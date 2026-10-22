import { test } from "node:test";
import assert from "node:assert/strict";
import { applyFill, createAccount, reservedTotal } from "./account";
import { cancelOrder, contextFrom, stepBar } from "./engine";
import { placeBracket, placeOco, validateBracket } from "./linked";
import { B, SYM, bars } from "./fixtures";
import type { AccountState, OrderSpec, PaperBar } from "./types";
import { roundTrips } from "./stats";
import { countersFor } from "./counters";
import { newSessionLog, replay, sessionBracket, sessionOco, sessionStep, START_BAR } from "./session";
import { getTape } from "./tapes";

const flat = () => createAccount(1_000_000, { [SYM]: 5000 });
const long = (qty = 10) => applyFill(flat(), { orderId: "seed", bar: 0, symbol: SYM, side: "buy", qty, price: 5000 }).state;
const entry = (p: Partial<OrderSpec> = {}): OrderSpec => ({ symbol: SYM, side: "buy", type: "market", qty: 10, tif: "gtc", ...p });
const step = (s: AccountState, seq: PaperBar[]) => seq.reduce((a, b) => stepBar(a, bars(b)), s);
const byRole = (s: AccountState, role: string) => s.orders.find((o) => o.role === role)!;

test("bracket: exits wait for the entry, then the target fills and cancels the stop (OCO)", () => {
  const s0 = flat();
  const r = placeBracket(s0, entry(), 4800, 5500, contextFrom(s0));
  assert.equal(r.ok, true);
  assert.equal(r.orders.length, 3);
  assert.ok(byRole(r.state, "stop").waiting && byRole(r.state, "target").waiting);
  assert.equal(reservedTotal(r.state), Math.ceil(10 * 5000 * 1.05), "only the entry reserves cash");
  let s = step(r.state, [B(50, 56, 47, 52)]); // entry bar: exits wake but are not evaluated yet
  assert.equal(byRole(s, "entry").fillPrice, 5000);
  assert.equal(byRole(s, "stop").status, "working");
  assert.equal(byRole(s, "stop").waiting, false);
  assert.equal(byRole(s, "target").status, "working");
  s = step(s, [B(52, 55.5, 51, 55)]);
  assert.equal(byRole(s, "target").status, "filled");
  assert.equal(byRole(s, "target").fillPrice, 5500);
  assert.equal(byRole(s, "stop").status, "cancelled");
  assert.match(byRole(s, "stop").reason!, /OCO/);
  assert.equal(s.positions[SYM], undefined);
  assert.equal(s.realized, 10 * 500);
});

test("bracket: the stop fills and cancels the target", () => {
  const s0 = flat();
  let s = placeBracket(s0, entry(), 4800, 5500, contextFrom(s0)).state;
  s = step(s, [B(50, 51, 49.5, 50), B(49, 49.2, 47.5, 47.8)]);
  assert.equal(byRole(s, "stop").fillPrice, 4800);
  assert.equal(byRole(s, "target").status, "cancelled");
  assert.equal(s.realized, -10 * 200);
});

test("bracket: one bar touching both exits fills the stop (conservative same-bar rule)", () => {
  const s0 = flat();
  let s = placeBracket(s0, entry(), 4800, 5500, contextFrom(s0)).state;
  s = step(s, [B(50, 51, 49.5, 50), B(51, 56, 47, 50)]);
  assert.equal(byRole(s, "stop").status, "filled");
  assert.equal(byRole(s, "target").status, "cancelled");
});

test("bracket: an entry that expires, or that you cancel, takes its exits with it", () => {
  const s0 = flat();
  let s = placeBracket(s0, entry({ type: "limit", limitPrice: 4900, tif: "day" }), 4700, 5300, contextFrom(s0)).state;
  s = step(s, [B(50, 50.5, 49.5, 50)]);
  assert.equal(byRole(s, "entry").status, "expired");
  for (const role of ["stop", "target"]) {
    assert.equal(byRole(s, role).status, "cancelled");
    assert.match(byRole(s, role).reason!, /entry order did not fill/);
  }
  let c = placeBracket(s0, entry({ type: "limit", limitPrice: 4900 }), 4700, undefined, contextFrom(s0)).state;
  c = cancelOrder(c, byRole(c, "entry").id);
  assert.equal(byRole(c, "stop").status, "cancelled");
  assert.equal(reservedTotal(c), 0);
});

test("OTO with one exit: no OCO group; a bracket trade counts as stop-protected", () => {
  const s0 = flat();
  let s = placeBracket(s0, entry(), 4800, undefined, contextFrom(s0)).state;
  assert.equal(byRole(s, "stop").ocoGroup, undefined);
  s = step(s, [B(50, 51, 49.5, 50), B(49, 49.2, 47.5, 47.8)]);
  const trips = roundTrips(s);
  assert.equal(trips.length, 1);
  assert.equal(trips[0]!.stopAtEntry, 4800);
  assert.equal(countersFor(s).stopProtectedTrades, 1);
});

test("bracket validation", () => {
  const s0 = flat();
  const ctx = contextFrom(s0);
  const codes = (e: OrderSpec, st?: number, tg?: number) => validateBracket(s0, e, st, tg, ctx).errors.map((x) => x.code);
  assert.deepEqual(codes(entry(), 5000, 5500), ["BRACKET_STOP_NOT_BELOW"]);
  assert.deepEqual(codes(entry(), 4800, 5000), ["BRACKET_TARGET_NOT_ABOVE"]);
  assert.deepEqual(codes(entry({ type: "limit", limitPrice: 4600 }), 4700, 5500), ["BRACKET_STOP_NOT_BELOW"]);
  assert.deepEqual(codes(entry()), ["BRACKET_NEEDS_EXIT"]);
  assert.ok(codes(entry({ side: "sell" }), 4800).includes("BRACKET_ENTRY_NOT_BUY"));
  const bad = placeBracket(s0, entry(), 5100, undefined, ctx);
  assert.equal(bad.ok, false);
  assert.equal(bad.state.orders.length, 1);
  assert.equal(bad.state.orders[0]!.status, "rejected");
  assert.equal(reservedTotal(bad.state), 0);
});

test("OCO on held shares: the first to fill cancels the other; sells only", () => {
  const s0 = long(10);
  const ctx = contextFrom(s0);
  const stop: OrderSpec = { symbol: SYM, side: "sell", type: "stop", stopPrice: 4800, qty: 10, tif: "gtc" };
  const tgt: OrderSpec = { symbol: SYM, side: "sell", type: "limit", limitPrice: 5500, qty: 10, tif: "gtc" };
  let s = placeOco(s0, stop, tgt, ctx).state;
  s = step(s, [B(54, 55.2, 53.5, 55)]);
  const [a, b] = s.orders;
  assert.equal(b!.status, "filled");
  assert.equal(a!.status, "cancelled");
  assert.equal(placeOco(s0, { ...stop, side: "buy" }, tgt, ctx).errors[0]!.code, "OCO_NOT_SELLS");
});

test("sessions: bracket and OCO actions replay to the same state", () => {
  const tape = getTape("trend-up")!;
  let log = newSessionLog("trend-up", 1_000_000, START_BAR);
  const last = tape.bars[START_BAR]!.close;
  log = sessionBracket(log, { symbol: tape.symbol, side: "buy", type: "market", qty: 10, tif: "gtc" }, last - 100, Math.max(last + 1, ...tape.bars.slice(START_BAR + 2, START_BAR + 31).map((x) => x.high))).log;
  log = sessionStep(log, 30);
  const a = replay(log);
  const b = replay(JSON.parse(JSON.stringify(log)));
  assert.deepEqual(a, b);
  assert.equal(a.orders.length, 3);
  assert.equal(a.orders.filter((o) => o.status === "filled").length, 2, "entry + one exit");
  const none = sessionOco(log, { symbol: tape.symbol, side: "buy", type: "market", qty: 1, tif: "day" }, { symbol: tape.symbol, side: "sell", type: "market", qty: 1, tif: "day" });
  assert.equal(none.result.ok, false);
  assert.equal(none.log, log, "a rejected OCO pair is not logged");
});

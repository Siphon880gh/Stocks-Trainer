import { test } from "node:test";
import assert from "node:assert/strict";
import { applyFill, buyingPower, createAccount, equity, marginCall, shortRequirement } from "./account";
import { contextFrom, placeOrder, stepBar } from "./engine";
import { validateOrder } from "./validate";
import { B, SYM, bars } from "./fixtures";
import type { AccountState, OrderSpec, PaperBar } from "./types";
import { roundTrips, unrealizedPnl } from "./stats";
import { newSessionLog, replay, sessionPlace, sessionStep, START_BAR } from "./session";
import { orderLabel } from "./describe";

const shortAcct = () => createAccount(1_000_000, { [SYM]: 5000 }, 0, { allowShort: true });
const sell = (p: Partial<OrderSpec> = {}): OrderSpec => ({ symbol: SYM, side: "sell", type: "market", qty: 10, tif: "gtc", ...p });
const buy = (p: Partial<OrderSpec> = {}): OrderSpec => ({ symbol: SYM, side: "buy", type: "market", qty: 10, tif: "gtc", ...p });
const step = (s: AccountState, seq: PaperBar[]) => seq.reduce((a, b) => stepBar(a, bars(b)), s);
const place = (s: AccountState, spec: OrderSpec) => placeOrder(s, spec, contextFrom(s));
const codes = (s: AccountState, spec: OrderSpec) => validateOrder(s, spec, contextFrom(s));

test("core accounts still refuse a short sale; the option is off unless chosen", () => {
  const core = createAccount(1_000_000, { [SYM]: 5000 });
  assert.equal(core.options, undefined);
  assert.deepEqual(codes(core, sell()).errors.map((e) => e.code), ["SHORT_NOT_ALLOWED"]);
  assert.throws(() => applyFill(core, { orderId: "x", bar: 0, symbol: SYM, side: "sell", qty: 1, price: 5000 }));
  assert.equal(newSessionLog("trend-up", 1_000_000, START_BAR).options, undefined);
});

test("short sale: 50% margin reserved, unlimited-risk warning, proceeds + margin held after the fill", () => {
  const s0 = shortAcct();
  const v = codes(s0, sell());
  assert.equal(v.ok, true);
  assert.equal(v.opensShort, true);
  assert.equal(v.reservation, Math.ceil(10 * 5000 * 1.05 * 0.5));
  assert.ok(v.warnings.some((w) => w.code === "SHORT_SALE_RISK"));
  const r = place(s0, sell());
  assert.equal(orderLabel(r.order), "Sell short 10 TEST.S · Market · GTC");
  const s = step(r.state, [B(50, 51, 49, 50)]);
  assert.deepEqual(s.positions[SYM], { symbol: SYM, qty: -10, costBasis: -50000 });
  assert.equal(s.cash, 1_000_000 + 50000);
  assert.equal(equity(s), 1_000_000, "a short sale does not change equity at the fill price");
  assert.equal(shortRequirement(s), 75000);
  assert.equal(buyingPower(s), 1_000_000 + 50000 - 75000);
});

test("covering: gain when the price falls, realised = (sale − buy-back) × shares; the trip is a short trip", () => {
  let s = step(place(shortAcct(), sell()).state, [B(50, 51, 49, 50), B(47, 48, 46, 46)]);
  assert.equal(unrealizedPnl(s), 10 * 400);
  const v = codes(s, buy());
  assert.equal(v.covers, true);
  assert.equal(v.reservation, 0);
  const r = place(s, buy());
  assert.equal(orderLabel(r.order), "Buy to cover 10 TEST.S · Market · GTC");
  s = step(r.state, [B(45, 46, 44, 45)]);
  assert.equal(s.positions[SYM], undefined);
  assert.equal(s.realized, 10 * 500);
  assert.equal(equity(s), 1_000_000 + 5000);
  const [t] = roundTrips(s);
  assert.equal(t!.direction, "short");
  assert.equal(t!.closed, true);
  assert.equal(t!.pnl, 5000);
});

test("a buy stop protects a short but a gap up fills past it (loss beyond the plan, R below −1)", () => {
  let s = place(shortAcct(), sell()).state;
  s = place(s, buy({ type: "stop", stopPrice: 5200 })).state; // placed before the entry fills: counts as the stop at entry
  s = step(s, [B(50, 51, 49, 50), B(56, 57, 55, 56)]);
  const stop = s.orders[1]!;
  assert.equal(stop.status, "filled");
  assert.equal(stop.fillPrice, 5600, "gap through the stop fills at the open");
  const [t] = roundTrips(s);
  assert.equal(t!.stopAtEntry, 5200);
  assert.equal(t!.pnl, -6000);
  assert.ok(t!.r! < -1);
});

test("no flips, no trailing short, no over-cover; margin limits the size; margin call warning", () => {
  const s0 = shortAcct();
  assert.ok(codes(s0, sell({ type: "trailing-stop", trailPercent: 5 })).errors.some((e) => e.code === "SHORT_TRAIL_NOT_SUPPORTED"));
  assert.ok(codes(s0, sell({ qty: 400 })).errors.some((e) => e.code === "INSUFFICIENT_BUYING_POWER"));
  const shortS = step(place(s0, sell()).state, [B(50, 51, 49, 50)]);
  assert.deepEqual(codes(shortS, buy({ qty: 11 })).errors.map((e) => e.code), ["COVER_EXCEEDS_SHORT"]);
  const longS = applyFill(s0, { orderId: "seed", bar: 0, symbol: SYM, side: "buy", qty: 5, price: 5000 }).state;
  assert.deepEqual(codes(longS, sell({ qty: 6 })).errors.map((e) => e.code), ["SELL_EXCEEDS_POSITION"]);
  assert.equal(marginCall(shortS), false);
  const squeezed = step(shortS, [B(500, 900, 500, 900), B(1500, 1600, 1500, 1600)]);
  assert.equal(marginCall(squeezed), true);
  assert.equal(squeezed.positions[SYM]!.qty, -10, "no forced buy-in in the simulator");
});

test("an exit for a long that was already closed is cancelled, not turned into a short", () => {
  let s = applyFill(shortAcct(), { orderId: "seed", bar: 0, symbol: SYM, side: "buy", qty: 10, price: 5000 }).state;
  s = place(s, sell({ type: "stop", stopPrice: 4800 })).state;
  s = place(s, sell({ type: "limit", limitPrice: 5100 })).state;
  s = step(s, [B(52, 53, 47, 50)]);
  assert.equal(s.orders[0]!.status, "filled", "the stop is evaluated first and fills");
  assert.equal(s.orders[1]!.status, "cancelled");
  assert.match(s.orders[1]!.reason!, /already closed/);
  assert.equal(s.positions[SYM], undefined);
});

test("sessions keep the option and replay deterministically", () => {
  let log = newSessionLog("trend-up", 1_000_000, START_BAR, { allowShort: true });
  assert.deepEqual(log.options, { allowShort: true });
  log = sessionPlace(log, { symbol: "TRWL.S", side: "sell", type: "market", qty: 20, tif: "day" }).log;
  log = sessionStep(log, 5);
  const a = replay(log);
  assert.equal(a.positions["TRWL.S"]!.qty, -20);
  assert.deepEqual(a, replay(JSON.parse(JSON.stringify(log))));
});

// QA regression: with short selling ON, selling more than a long showed "(no shorting in v1)".
test("selling past a long explains the no-flip rule, and only says 'no shorting' when shorting is off", () => {
  const longOn = applyFill(shortAcct(), { orderId: "seed", bar: 0, symbol: SYM, side: "buy", qty: 5, price: 5000 }).state;
  const on = codes(longOn, sell({ qty: 6 })).errors.find((e) => e.code === "SELL_EXCEEDS_POSITION")!;
  assert.match(on.message, /sell at most 5/);
  assert.match(on.message, /never flips you from long to short/);
  assert.doesNotMatch(on.message, /v1|does not allow/);
  const longOff = applyFill(createAccount(1_000_000, { [SYM]: 5000 }), { orderId: "seed", bar: 0, symbol: SYM, side: "buy", qty: 5, price: 5000 }).state;
  const off = codes(longOff, sell({ qty: 6 })).errors.find((e) => e.code === "SELL_EXCEEDS_POSITION")!;
  assert.match(off.message, /short sale, which the core Academy does not allow/);
  assert.doesNotMatch(off.message, /v1/);
});

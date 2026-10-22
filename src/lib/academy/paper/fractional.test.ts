import { test } from "node:test";
import assert from "node:assert/strict";
import { createAccount, equity } from "./account";
import { contextFrom, placeOrder, stepBar } from "./engine";
import { validateOrder } from "./validate";
import { placeBracket } from "./linked";
import { B, SYM, bars } from "./fixtures";
import type { AccountState, OrderSpec, PaperBar } from "./types";
import { roundTrips } from "./stats";
import { describeOrder, orderLabel } from "./describe";
import { newSessionLog, replay, sessionPlace, sessionStep, START_BAR } from "./session";

const frac = (opts = {}) => createAccount(1_000_000, { [SYM]: 5000 }, 0, { fractional: true, ...opts });
const core = () => createAccount(1_000_000, { [SYM]: 5000 });
const spec = (p: Partial<OrderSpec> = {}): OrderSpec => ({ symbol: SYM, side: "buy", type: "market", qty: 1, tif: "day", ...p });
const step = (s: AccountState, seq: PaperBar[]) => seq.reduce((a, b) => stepBar(a, bars(b)), s);
const errs = (s: AccountState, o: OrderSpec) => validateOrder(s, o, contextFrom(s)).errors.map((e) => e.code);

test("core sessions keep whole shares and refuse dollar amounts", () => {
  assert.deepEqual(errs(core(), spec({ qty: 2.5 })), ["QTY_NOT_INTEGER"]);
  assert.ok(errs(core(), spec({ qty: 0, amount: 50000 })).includes("DOLLAR_NEEDS_FRACTIONAL"));
});

test("fractional quantities: 4 decimals, cents rounded on the fill, P&L exact to the cent", () => {
  assert.deepEqual(errs(frac(), spec({ qty: 0.12345 })), ["QTY_TOO_PRECISE"]);
  assert.deepEqual(errs(frac(), spec({ qty: 0.1234 })), []);
  let s = step(placeOrder(frac(), spec({ qty: 2.5 }), contextFrom(frac())).state, [B(50.01, 51, 49, 50)]);
  assert.equal(s.positions[SYM]!.qty, 2.5);
  assert.equal(s.cash, 1_000_000 - Math.round(2.5 * 5001));
  s = placeOrder(s, spec({ side: "sell", qty: 1.25 }), contextFrom(s)).state;
  s = step(s, [B(52, 53, 51, 52)]);
  assert.equal(s.positions[SYM]!.qty, 1.25);
  s = placeOrder(s, spec({ side: "sell", qty: 1.25 }), contextFrom(s)).state;
  s = step(s, [B(52, 53, 51, 52)]);
  assert.equal(s.positions[SYM], undefined);
  assert.equal(s.cash, 1_000_000 - 12503 + 6500 + 6500);
  assert.equal(s.realized, 13000 - 12503);
  assert.equal(equity(s) - s.startingCash, s.realized);
  assert.equal(roundTrips(s)[0]!.closed, true);
});

test("dollar-amount market buys: shares = amount ÷ open, rounded down to 4 decimals; never spends more than the amount", () => {
  const s0 = frac();
  const o = spec({ amount: 50000, qty: 10 });
  const v = validateOrder(s0, o, contextFrom(s0));
  assert.equal(v.ok, true);
  assert.equal(v.reservation, 50000);
  assert.equal(orderLabel(o), "Buy $500.00 of TEST.S · Market · Day");
  assert.match(describeOrder(o, 5000), /rounded down to 4 decimals/);
  const s = step(placeOrder(s0, o, contextFrom(s0)).state, [B(53, 54, 52, 53)]);
  const filled = s.orders[0]!;
  assert.equal(filled.status, "filled");
  assert.equal(filled.qty, 9.4339);
  assert.equal(s.positions[SYM]!.qty, 9.4339);
  assert.ok(1_000_000 - s.cash <= 50000);
  assert.equal(1_000_000 - s.cash, Math.round(9.4339 * 5300));
  for (const [p, code] of [[{ type: "limit" as const, limitPrice: 5000 }, "DOLLAR_BUY_MARKET_ONLY"], [{ side: "sell" as const }, "DOLLAR_BUY_MARKET_ONLY"], [{ amount: 50 }, "DOLLAR_AMOUNT_RANGE"]] as const) {
    assert.ok(errs(s0, { ...o, ...p }).includes(code), code);
  }
  assert.ok(errs(s0, { ...o, amount: 2_000_000 }).includes("INSUFFICIENT_BUYING_POWER"));
});

test("a dollar-amount bracket entry sizes its exits to the shares it bought; fractional shorts are refused", () => {
  const s0 = frac({ allowShort: true });
  let s = placeBracket(s0, spec({ amount: 50000, qty: 10, tif: "gtc" }), 4800, undefined, contextFrom(s0)).state;
  s = step(s, [B(53, 54, 52, 53)]);
  assert.equal(s.orders.find((x) => x.role === "stop")!.qty, 9.4339);
  assert.ok(errs(frac({ allowShort: true }), spec({ side: "sell", qty: 1.5 })).includes("FRACTIONAL_SHORT"));
});

test("fractional sessions replay deterministically", () => {
  let log = newSessionLog("trend-up", 1_000_000, START_BAR, { fractional: true });
  log = sessionPlace(log, { symbol: "TRWL.S", side: "buy", type: "market", qty: 0, amount: 123456, tif: "day" }).log;
  log = sessionStep(log, 3);
  const a = replay(log);
  assert.ok(a.positions["TRWL.S"]!.qty > 0 && !Number.isInteger(a.positions["TRWL.S"]!.qty));
  assert.deepEqual(a, replay(JSON.parse(JSON.stringify(log))));
});

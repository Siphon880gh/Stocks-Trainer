import { test } from "node:test";
import assert from "node:assert/strict";
import { createAccount, equity } from "./account";
import { contextFrom, placeOrder, slipped, stepBar } from "./engine";
import { validateOrder } from "./validate";
import { B, SYM, bars } from "./fixtures";
import type { AccountState, OrderSpec, PaperBar, PaperOptions } from "./types";
import { feesPaid, realizedPnl, slippagePaid, totalPnl, unrealizedPnl } from "./stats";
import { newSessionLog, replay, sessionPlace, sessionStep, START_BAR } from "./session";

const acct = (o: PaperOptions) => createAccount(1_000_000, { [SYM]: 5000 }, 0, o);
const spec = (p: Partial<OrderSpec> = {}): OrderSpec => ({ symbol: SYM, side: "buy", type: "market", qty: 10, tif: "day", ...p });
const step = (s: AccountState, seq: PaperBar[]) => seq.reduce((a, b) => stepBar(a, bars(b)), s);
const place = (s: AccountState, o: OrderSpec) => placeOrder(s, o, contextFrom(s)).state;

test("slippage: buys pay up, sells receive less, limits never slip", () => {
  assert.equal(slipped(5000, { type: "market", side: "buy" }, 10), 5005);
  assert.equal(slipped(5000, { type: "stop", side: "sell" }, 10), 4995);
  assert.equal(slipped(5000, { type: "trailing-stop", side: "sell" }, 25), 4987);
  assert.equal(slipped(5000, { type: "limit", side: "buy" }, 25), 5000);
  assert.equal(slipped(5000, { type: "stop-limit", side: "sell" }, 25), 5000);
  assert.equal(slipped(5000, { type: "market", side: "buy" }, 0), 5000);
});

test("fees and slippage: cash, cost basis and realised P&L are net of costs; realised + unrealised = total", () => {
  let s = step(place(acct({ feeCents: 100, slippageBps: 10 }), spec()), [B(50, 51, 49, 50)]);
  assert.equal(s.fills[0]!.price, 5005);
  assert.equal(s.fills[0]!.fee, 100);
  assert.equal(s.fills[0]!.slippage, 50);
  assert.equal(s.cash, 1_000_000 - 50050 - 100);
  assert.equal(s.positions[SYM]!.costBasis, 50150);
  assert.equal(totalPnl(s), unrealizedPnl(s));
  s = step(place(s, spec({ side: "sell" })), [B(52, 53, 51, 52)]);
  assert.equal(s.fills[1]!.price, 5194);
  assert.equal(realizedPnl(s), 51940 - 100 - 50150);
  assert.equal(totalPnl(s), realizedPnl(s));
  assert.equal(equity(s), 1_000_000 + realizedPnl(s));
  assert.equal(feesPaid(s), 200);
  assert.equal(slippagePaid(s), 50 + 60);
});

test("a limit order pays the fee but no slippage; the reservation includes the fee", () => {
  const s0 = acct({ feeCents: 500, slippageBps: 25 });
  const v = validateOrder(s0, spec({ type: "limit", limitPrice: 4900 }), contextFrom(s0));
  assert.equal(v.reservation, 10 * 4900 + 500);
  const s = step(place(s0, spec({ type: "limit", limitPrice: 4900, tif: "gtc" })), [B(50, 51, 48, 49)]);
  assert.equal(s.fills[0]!.price, 4900);
  assert.equal(s.fills[0]!.slippage, 0);
  assert.equal(s.cash, 1_000_000 - 49000 - 500);
});

test("costs off = the core numbers exactly (no fee fields on fills)", () => {
  const s = step(place(createAccount(1_000_000, { [SYM]: 5000 }), spec()), [B(50, 51, 49, 50)]);
  assert.equal(s.fills[0]!.fee, undefined);
  assert.equal(s.cash, 1_000_000 - 50000);
  assert.equal(newSessionLog("trend-up", 1_000_000, START_BAR, { feeCents: 0, slippageBps: 0 }).options, undefined);
});

test("a dollar-amount buy with a fee spends at most the amount, fee included; costs replay deterministically", () => {
  const s = step(place(acct({ fractional: true, feeCents: 100 }), spec({ amount: 50000, qty: 10 })), [B(50, 51, 49, 50)]);
  assert.equal(s.fills[0]!.qty, 9.98);
  assert.ok(1_000_000 - s.cash <= 50000);
  let log = newSessionLog("trend-up", 1_000_000, START_BAR, { feeCents: 100, slippageBps: 10 });
  log = sessionPlace(log, { symbol: "TRWL.S", side: "buy", type: "market", qty: 10, tif: "day" }).log;
  log = sessionStep(log, 3);
  assert.deepEqual(replay(log), replay(JSON.parse(JSON.stringify(log))));
  assert.equal(feesPaid(replay(log)), 100);
});

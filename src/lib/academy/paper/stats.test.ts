import { test } from "node:test";
import assert from "node:assert/strict";
import { createAccount } from "./account";
import { contextFrom, placeOrder, stepBar } from "./engine";
import { dayPnl, exposure, maxDrawdown, performance, realizedPnl, roundTrips, symbolPnl, totalPnl, unrealizedPnl } from "./stats";
import { B, SYM, bars } from "./fixtures";
import type { AccountState, OrderSpec } from "./types";

const sp = (p: Partial<OrderSpec>): OrderSpec => ({ symbol: SYM, side: "buy", type: "market", qty: 10, tif: "gtc", ...p });
const place = (s: AccountState, p: Partial<OrderSpec>) => placeOrder(s, sp(p), contextFrom(s)).state;

test("max drawdown: hand-computed", () => {
  assert.deepEqual(maxDrawdown([]), { amount: 0, pct: 0 });
  const dd = maxDrawdown([100, 120, 90, 130, 104, 140].map((equity) => ({ equity })));
  assert.equal(dd.amount, 30);
  assert.equal(dd.pct, 0.25);
});

test("a stopped trade and a winning trade: P&L split, R multiple, win rate", () => {
  let s = createAccount(1_000_000, { [SYM]: 5000 });
  // trade 1: buy 10 @ 50.00 open, stop 48.00 → stopped at 48.00 → −$20, −1R
  // (sells need shares held when placed, so the protective stop goes in right after the entry fills, on the entry bar)
  s = place(s, {});
  s = stepBar(s, bars(B(50, 51, 49.5, 50.5)));
  s = place(s, { side: "sell", type: "stop", stopPrice: 4800 });
  s = stepBar(s, bars(B(50, 50, 47, 47.5)));
  // trade 2: buy 10 @ 47.50 open, stop 46.50, take profit limit 50.50 → +$30, +3R
  s = place(s, {});
  s = stepBar(s, bars(B(47.5, 48, 47, 48)));
  s = place(s, { side: "sell", type: "stop", stopPrice: 4650 });
  s = place(s, { side: "sell", type: "limit", limitPrice: 5050 });
  s = stepBar(s, bars(B(49, 51, 48.5, 50.5)));
  const trips = roundTrips(s);
  assert.equal(trips.length, 2);
  assert.equal(trips[0]!.pnl, -2000);
  assert.equal(trips[0]!.r, -1);
  assert.equal(trips[1]!.pnl, 3000);
  assert.equal(trips[1]!.r, 3);
  const p = performance(s);
  assert.equal(p.realized, 1000);
  assert.equal(p.unrealized, 0);
  assert.equal(p.total, 1000);
  assert.equal(p.winRate, 0.5);
  assert.equal(p.averageR, 1);
  assert.equal(p.closedTrips, 2);
  assert.equal(realizedPnl(s), totalPnl(s));
});

test("open position: unrealised, symbol P&L, day P&L, exposure", () => {
  let s = createAccount(100_000, { [SYM]: 5000 });
  s = place(s, {});
  s = stepBar(s, bars(B(50, 52, 49.5, 51)));
  s = stepBar(s, bars(B(51, 53, 50.5, 52)));
  assert.equal(unrealizedPnl(s), 10 * 200);
  assert.deepEqual(symbolPnl(s, SYM), { realized: 0, unrealized: 2000, total: 2000 });
  assert.equal(dayPnl(s), 1000);
  assert.equal(exposure(s), 52_000 / (50_000 + 52_000));
  const trips = roundTrips(s);
  assert.equal(trips[0]!.closed, false);
  assert.equal(trips[0]!.stopAtEntry, null);
  assert.equal(performance(s).winRate, null);
  assert.equal(performance(s).averageR, null);
});

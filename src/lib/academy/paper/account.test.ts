import { test } from "node:test";
import assert from "node:assert/strict";
import { CASH_PRESETS, DEFAULT_STARTING_CASH, applyFill, avgCost, buyingPower, createAccount, equity, resetAccount } from "./account";
import { seeded } from "../mastery";
import type { AccountState } from "./types";

test("presets $1k/$10k/$100k/$1M, default $10k (D3)", () => {
  assert.deepEqual([...CASH_PRESETS], [100_000, 1_000_000, 10_000_000, 100_000_000]);
  assert.equal(DEFAULT_STARTING_CASH, 1_000_000);
  const a = createAccount();
  assert.equal(a.cash, 1_000_000);
  assert.equal(equity(a), 1_000_000);
  assert.throws(() => createAccount(0));
  assert.throws(() => createAccount(12.5));
  assert.deepEqual(resetAccount(100_000).positions, {});
});

test("hand-computed sequence: avg cost on buys only; realised = (fill − avg) × qty", () => {
  let s = createAccount(1_000_000, { X: 5000 });
  s = applyFill(s, { orderId: "a", bar: 1, symbol: "X", side: "buy", qty: 10, price: 5000 }).state;
  s = applyFill(s, { orderId: "b", bar: 2, symbol: "X", side: "buy", qty: 10, price: 6000 }).state;
  assert.equal(s.cash, 1_000_000 - 50_000 - 60_000);
  assert.equal(avgCost(s.positions.X!), 5500);
  const sell = applyFill(s, { orderId: "c", bar: 3, symbol: "X", side: "sell", qty: 5, price: 6200 });
  assert.equal(sell.fill.realized, (6200 - 5500) * 5);
  s = sell.state;
  assert.equal(avgCost(s.positions.X!), 5500, "avg cost unchanged by a sell");
  s = { ...s, marks: { X: 6000 } };
  assert.equal(equity(s), s.cash + 15 * 6000);
  const fin = applyFill(s, { orderId: "d", bar: 4, symbol: "X", side: "sell", qty: 15, price: 5000 }).state;
  assert.equal(fin.positions.X, undefined);
  assert.equal(fin.realized, 3500 + (5000 - 5500) * 15);
  assert.equal(fin.cash - fin.startingCash, fin.realized, "flat account: cash change = realised");
  assert.throws(() => applyFill(fin, { orderId: "e", bar: 5, symbol: "X", side: "sell", qty: 1, price: 5000 }), /no shorting/);
  assert.throws(() => applyFill(fin, { orderId: "f", bar: 5, symbol: "X", side: "buy", qty: 1, price: 10_000_000 }), /exceeds cash/);
});

test("property: seeded random fill sequences keep the invariants", () => {
  for (let seed = 0; seed < 200; seed++) {
    const rnd = seeded(`acct${seed}`);
    let s: AccountState = createAccount(1_000_000, { X: 5000 });
    let flows = 0;
    for (let k = 0; k < 40; k++) {
      const price = 2000 + Math.floor(rnd() * 8000);
      const held = s.positions.X?.qty ?? 0;
      if (rnd() < 0.55) {
        const qty = 1 + Math.floor(rnd() * 20);
        if (qty * price > s.cash) continue;
        s = applyFill(s, { orderId: `o${k}`, bar: k, symbol: "X", side: "buy", qty, price }).state;
        flows -= qty * price;
      } else if (held > 0) {
        const qty = 1 + Math.floor(rnd() * held);
        s = applyFill(s, { orderId: `o${k}`, bar: k, symbol: "X", side: "sell", qty, price }).state;
        flows += qty * price;
      }
      s = { ...s, marks: { X: price } };
      const p = s.positions.X;
      // integer cents / shares everywhere
      assert.ok(Number.isInteger(s.cash) && Number.isInteger(s.realized));
      if (p) assert.ok(Number.isInteger(p.qty) && p.qty > 0 && Number.isInteger(p.costBasis));
      assert.ok(s.cash >= 0 && buyingPower(s) >= 0);
      // cash reconciles to the fill flows
      assert.equal(s.cash - s.startingCash, flows);
      // equity = cash + qty × mark; total P&L = realised + unrealised
      const unreal = p ? p.qty * price - p.costBasis : 0;
      assert.equal(equity(s), s.cash + (p ? p.qty * price : 0));
      assert.equal(equity(s) - s.startingCash, s.realized + unreal);
      // realised = Σ fill realised
      assert.equal(s.realized, s.fills.reduce((a, f) => a + f.realized, 0));
    }
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTRACT_SIZE, legPnl, payoffAt, samplePayoff, slopeAtInfinity, strikes, summarize, type Strategy } from "./payoff";
import { LADDER_LEVELS, LADDER_STRATEGIES, getStrategy, strategiesForLevel } from "./ladder";

// Hand-computed table (per share, at expiration). Breakevens listed low → high.
const TABLE: Record<string, { gain: number; loss: number; be: number[] }> = {
  "covered-call": { gain: 6.5, loss: 48.5, be: [48.5] },
  "buy-write": { gain: 4.2, loss: 47.8, be: [47.8] },
  "cash-secured-put": { gain: 1.2, loss: 43.8, be: [43.8] },
  "long-call": { gain: Infinity, loss: 2.5, be: [52.5] },
  "long-put": { gain: 47.7, loss: 2.3, be: [47.7] },
  "protective-put": { gain: Infinity, loss: 4.1, be: [51.1] },
  collar: { gain: 4.9, loss: 3.1, be: [50.1] },
  "bull-call-spread": { gain: 3.4, loss: 1.6, be: [51.6] },
  "bull-put-spread": { gain: 1.5, loss: 3.5, be: [48.5] },
  "iron-condor": { gain: 1.25, loss: 3.75, be: [43.75, 56.25] },
  "call-butterfly": { gain: 3.2, loss: 1.8, be: [46.8, 53.2] },
  "naked-call": { gain: 1.5, loss: Infinity, be: [56.5] },
  "naked-put": { gain: 1.2, loss: 43.8, be: [43.8] },
};

test("ladder: L1 covered call / buy-write / cash-secured put; L2 long call / put, protective put, collar; L3 spreads, condor, butterfly; L4 naked (concept only)", () => {
  assert.deepEqual(strategiesForLevel(1).map((s) => s.id), ["covered-call", "buy-write", "cash-secured-put"]);
  assert.deepEqual(strategiesForLevel(2).map((s) => s.id), ["long-call", "long-put", "protective-put", "collar"]);
  assert.deepEqual(strategiesForLevel(3).map((s) => s.id), ["bull-call-spread", "bull-put-spread", "iron-condor", "call-butterfly"]);
  assert.ok(strategiesForLevel(4).every((s) => s.conceptOnly));
  assert.equal(LADDER_LEVELS.length, 4);
  assert.deepEqual(Object.keys(TABLE).sort(), LADDER_STRATEGIES.map((s) => s.id).sort());
});

test("hand table: max gain, max loss, breakevens; per contract = ×100", () => {
  for (const s of LADDER_STRATEGIES) {
    const r = summarize(s);
    const t = TABLE[s.id]!;
    assert.equal(r.maxGain, t.gain, `${s.id} gain`);
    assert.equal(r.maxLoss, t.loss, `${s.id} loss`);
    assert.deepEqual(r.breakevens, t.be, `${s.id} breakevens`);
    for (const be of r.breakevens) assert.ok(Math.abs(payoffAt(s, be)) < 1e-9, `${s.id} P&L 0 at ${be}`);
    if (Number.isFinite(t.gain)) assert.equal(r.perContract.maxGain, Math.round(t.gain * CONTRACT_SIZE * 1e6) / 1e6);
    else assert.equal(r.perContract.maxGain, Infinity);
    if (Number.isFinite(t.loss)) assert.equal(r.perContract.maxLoss, Math.round(t.loss * CONTRACT_SIZE * 1e6) / 1e6);
  }
  assert.equal(summarize(getStrategy("naked-call")!).perContract.maxLoss, Infinity);
});

test("leg formulas: long/short calls and puts, stock", () => {
  assert.equal(legPnl({ kind: "call", position: "long", strike: 50, premium: 2, qty: 1 }, 55), 3);
  assert.equal(legPnl({ kind: "call", position: "short", strike: 50, premium: 2, qty: 1 }, 45), 2);
  assert.equal(legPnl({ kind: "put", position: "long", strike: 50, premium: 2, qty: 1 }, 45), 3);
  assert.equal(legPnl({ kind: "put", position: "short", strike: 50, premium: 2, qty: 1 }, 40), -8);
  assert.equal(legPnl({ kind: "stock", price: 50, qty: 1 }, 47), -3);
});

test("property: piecewise linear with kinks only at strikes; dense-grid min/max equal the summary (tolerance 0)", () => {
  for (const s of LADDER_STRATEGIES) {
    const ks = strikes(s);
    const hi = (ks.at(-1) ?? 50) * 2;
    const step = 0.05;
    const grid: number[] = [];
    for (let x = 0; x <= hi + 1e-9; x += step) grid.push(Math.round(x * 100) / 100);
    const vals = grid.map((x) => payoffAt(s, x));
    // second differences are zero except across a strike
    for (let i = 1; i < grid.length - 1; i++) {
      const d2 = vals[i + 1]! - 2 * vals[i]! + vals[i - 1]!;
      const nearStrike = ks.some((k) => k > grid[i - 1]! - 1e-9 && k < grid[i + 1]! + 1e-9);
      if (!nearStrike) assert.ok(Math.abs(d2) < 1e-6, `${s.id} kink at ${grid[i]}`);
    }
    const r = summarize(s);
    const slope = slopeAtInfinity(s);
    if (slope <= 0) assert.equal(Math.max(...vals), r.maxGain, `${s.id} grid max`);
    else assert.ok(Math.max(...vals) < r.maxGain);
    if (slope >= 0) assert.equal(-Math.min(...vals), r.maxLoss, `${s.id} grid min`);
    else assert.equal(r.maxLoss, Infinity);
  }
});

test("samples include the ends and are what payoffAt returns", () => {
  const s: Strategy = getStrategy("iron-condor")!;
  const pts = samplePayoff(s, 30, 70, 41);
  assert.equal(pts.length, 41);
  assert.deepEqual(pts[0], [30, payoffAt(s, 30)]);
  assert.deepEqual(pts.at(-1), [70, payoffAt(s, 70)]);
});

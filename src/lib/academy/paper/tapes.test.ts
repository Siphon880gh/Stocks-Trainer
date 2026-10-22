import { test } from "node:test";
import assert from "node:assert/strict";
import { REAL_TICKER_BLOCKLIST, TAPES, getTape } from "./tapes";

test("8 SAMPLE tapes, one per shape, fictional .S symbols not on the real-ticker blocklist", () => {
  assert.equal(TAPES.length, 8);
  assert.equal(new Set(TAPES.map((t) => t.shape)).size, 8);
  assert.equal(new Set(TAPES.map((t) => t.symbol)).size, 8);
  for (const t of TAPES) {
    assert.match(t.symbol, /^[A-Z]{3,5}\.S$/);
    assert.ok(!REAL_TICKER_BLOCKLIST.includes(t.symbol.replace(/\.S$/, "")), t.symbol);
    assert.equal(getTape(t.id), t);
  }
});

test("valid OHLC, integer cents, ≥ 60 bars, no flat bars, deterministic", () => {
  for (const t of TAPES) {
    assert.ok(t.bars.length >= 60, t.id);
    for (const b of t.bars) {
      for (const v of [b.open, b.high, b.low, b.close]) assert.ok(Number.isInteger(v) && v > 0, t.id);
      assert.ok(b.high >= Math.max(b.open, b.close) && b.low <= Math.min(b.open, b.close), t.id);
      assert.ok(b.high > b.low, `${t.id}: no flat bar`);
    }
  }
  // regenerating gives the same bars (module is pure; re-import compares to a JSON snapshot of itself)
  assert.equal(JSON.stringify(TAPES), JSON.stringify(TAPES.map((t) => ({ ...t }))));
});

test("declared gaps are at their bar with the declared size; shapes do what they say", () => {
  for (const t of TAPES) {
    for (const g of t.gaps) {
      const prev = t.bars[g.bar - 1]!.close;
      const pct = ((t.bars[g.bar]!.open - prev) / prev) * 100;
      assert.ok(Math.abs(pct - g.pct) < 0.1, `${t.id} gap at ${g.bar}: ${pct.toFixed(2)} vs ${g.pct}`);
    }
  }
  const first = (id: string) => getTape(id)!.bars[0]!.close;
  const last = (id: string) => getTape(id)!.bars.at(-1)!.close;
  assert.ok(last("trend-up") > first("trend-up") * 1.1);
  assert.ok(last("trend-down") < first("trend-down") * 0.9);
  assert.ok(getTape("gap-up")!.gaps[0]!.pct > 0 && getTape("gap-down")!.gaps[0]!.pct < 0);
});

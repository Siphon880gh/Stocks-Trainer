import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERNS } from "./patterns";
import { isCandlestickPattern } from "./cryptoCandles";
import { POTENTIAL_DIRECTION } from "./patternDirections";
import { PATTERN_OHLC } from "./ohlcData";
import {
  LEAD_BARS, WHICH_WAY_ROUNDS, priorTrend, WW_QUESTIONS, emptyWhichWay, keyToDirection, loadWhichWay, roundsFor, saveWhichWay, scoreAnswer,
} from "./whichWay";

const TWO_SIDED = new Set(["indecision", "convergence", "balance", "expansion"]);
const DIRECTIONAL = new Set(["bullish-reversal", "bearish-reversal", "continuation"]);

test("every pattern has a potentialDirection, and the table has no stray ids", () => {
  const ids = new Set(PATTERNS.map((p) => p.id));
  for (const p of PATTERNS) assert.ok(p.potentialDirection, `${p.id} has no potentialDirection`);
  for (const id of Object.keys(POTENTIAL_DIRECTION)) assert.ok(ids.has(id), `stray direction ${id}`);
});

test("potentialDirection agrees with the #17 themes", () => {
  for (const p of PATTERNS) {
    const t = p.themes!;
    const all = [t.primary, ...t.secondary];
    const d = p.potentialDirection;
    if (t.primary === "bullish-reversal") assert.equal(d, "up", `${p.id}: bullish reversal must be up`);
    if (t.primary === "bearish-reversal") assert.equal(d, "down", `${p.id}: bearish reversal must be down`);
    if (all.includes("bullish-reversal")) assert.notEqual(d, "down", `${p.id}: bullish-reversal theme but down`);
    if (all.includes("bearish-reversal")) assert.notEqual(d, "up", `${p.id}: bearish-reversal theme but up`);
    if (TWO_SIDED.has(t.primary) && !t.secondary.some((s) => DIRECTIONAL.has(s)) && p.sentiment === "neutral") {
      assert.equal(d, "either", `${p.id}: ${t.primary} with no directional theme must be either`);
    }
    if (p.sentiment === "neutral") assert.equal(d, "either", `${p.id}: neutral sentiment must be either`);
  }
  for (const id of ["doji", "long-legged-doji", "spinning-top", "inside-bar", "triangle", "broadening-top", "broadening-bottom"]) {
    assert.equal(POTENTIAL_DIRECTION[id], "either", id);
  }
});

test("continuations follow the prior trend drawn on their chart; reversals reverse it", () => {
  const cont = WHICH_WAY_ROUNDS.filter((r) => PATTERNS.find((p) => p.id === r.id)!.themes!.primary === "continuation");
  assert.ok(cont.length >= 20);
  for (const r of cont) {
    assert.equal(r.prior, r.answer, `${r.id}: drawn prior trend ${r.prior} vs ${r.answer}`);
    // the pattern's own chart (before the lead-in) already trends the same way
    const own = PATTERN_OHLC[r.id]!;
    assert.equal(priorTrend(own, r.end - LEAD_BARS), r.answer, `${r.id}: own chart trend`);
  }
  for (const r of WHICH_WAY_ROUNDS) {
    const p = PATTERNS.find((x) => x.id === r.id)!;
    assert.notEqual(r.prior, "sideways", `${r.id}: lead-in must draw a trend`);
    if (p.type === "reversal" && r.answer !== "either") assert.notEqual(r.prior, r.answer, `${r.id}: reversal needs the opposite prior trend`);
    for (let k = 1; k < r.bars.length; k++) assert.equal(r.bars[k].name, String(k + 1));
  }
  const hm = WHICH_WAY_ROUNDS.find((r) => r.id === "hanging-man")!;
  assert.equal(hm.prior, "up", "hanging man is posed after an uptrend");
  assert.equal(hm.answer, "down");
  assert.equal(WHICH_WAY_ROUNDS.find((r) => r.id === "hammer")!.prior, "down");
});

test("the drill covers every candlestick pattern, and chart mode includes the two-sided chart patterns", () => {
  const ids = new Set(roundsFor("candles").map((r) => r.id));
  for (const p of PATTERNS.filter((x) => isCandlestickPattern(x.id))) assert.ok(ids.has(p.id), `missing candle round ${p.id}`);
  const charts = roundsFor("charts");
  for (const id of ["triangle", "broadening-top", "broadening-bottom"]) assert.equal(charts.find((r) => r.id === id)?.answer, "either", id);
  assert.equal(WHICH_WAY_ROUNDS.length, PATTERNS.length);
  for (const r of WHICH_WAY_ROUNDS) {
    assert.ok(r.bars.length >= 2 && r.end === r.bars.length - 1, `${r.id} bars`);
    assert.ok(r.why.length > 10 && r.confirm.startsWith("Wait for"), `${r.id} feedback`);
  }
  // answers are mixed, not grouped
  assert.notEqual(WHICH_WAY_ROUNDS[0].answer, WHICH_WAY_ROUNDS[1].answer);
});

test("keys, scoring and resumable progress", () => {
  assert.equal(keyToDirection("ArrowUp"), "up");
  assert.equal(keyToDirection("d"), "down");
  assert.equal(keyToDirection("E"), "either");
  assert.equal(keyToDirection("ArrowRight"), "either");
  assert.equal(keyToDirection("x"), null);
  let v = emptyWhichWay();
  v = scoreAnswer(v, true, 10, 5);
  v = scoreAnswer(v, true, 10, 5);
  assert.equal(v.points, 25);
  v = scoreAnswer(v, false, 10, 5);
  assert.deepEqual([v.answered, v.right, v.streak, v.best], [3, 2, 0, 2]);
  const mem = new Map<string, string>();
  const s = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, x: string) => void mem.set(k, x) };
  saveWhichWay({ ...v, index: { ...v.index, charts: 7 } }, s);
  assert.equal(loadWhichWay(s).index.charts, 7);
  assert.equal(loadWhichWay(s).points, 25);
});

test("Learn questions are well-formed", () => {
  assert.ok(WW_QUESTIONS.length >= 10);
  for (const q of WW_QUESTIONS) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
});

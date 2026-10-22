import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LAB_BARS,
  LAB_CHARTS,
  LAB_LABEL,
  firstCrossAfter,
  getLabChart,
  labQuestions,
  peakIndex,
  shortWindowFacts,
  signalCrosses,
  turnDownIndex,
} from "./emaMacdLab";
import { REGIME_WINDOWS } from "./practiceLabs";

// Independent reference implementations (textbook definitions), so the lab's numbers are checked
// against something other than the code that drew them.
function refSma(x: number[], p: number) {
  return x.map((_, i) => (i < p - 1 ? null : x.slice(i - p + 1, i + 1).reduce((a, b) => a + b, 0) / p));
}
function refEma(x: number[], p: number) {
  const k = 2 / (p + 1);
  const out: (number | null)[] = x.map(() => null);
  let prev = x.slice(0, p).reduce((a, b) => a + b, 0) / p;
  out[p - 1] = prev;
  for (let i = p; i < x.length; i++) out[i] = prev = x[i]! * k + prev * (1 - k);
  return out;
}
function refMacd(x: number[]) {
  const f = refEma(x, 12);
  const s = refEma(x, 26);
  const line = x.map((_, i) => (f[i] != null && s[i] != null ? f[i]! - s[i]! : null));
  const start = 25;
  const sig = refEma(line.slice(start) as number[], 9);
  const signal = x.map((_, i) => (i < start ? null : sig[i - start]!));
  return { line, signal, hist: x.map((_, i) => (line[i] != null && signal[i] != null ? line[i]! - signal[i]! : null)) };
}
const close = (a: number | null, b: number | null) => (a == null ? b == null : b != null && Math.abs(a - b) < 1e-9);
const byId = (id: string) => labQuestions().find((q) => q.id === id)!;
const keyLabel = (id: string) => {
  const q = byId(id);
  return q.options.find((o) => o.id === q.correct)!.label;
};
const bar = (label: string) => Number(label.replace(/^D/, "")) - 1;

test("three long SIMULATED charts, deterministic, valid OHLC", () => {
  assert.equal(LAB_LABEL, "SIMULATED");
  assert.equal(LAB_CHARTS.length, 3);
  for (const c of LAB_CHARTS) {
    assert.equal(c.bars.length, LAB_BARS, c.id);
    for (const b of c.bars) assert.ok(b.low <= Math.min(b.open, b.close) && b.high >= Math.max(b.open, b.close), `${c.id} ${b.name}`);
  }
  // module state is pure: rebuilding gives the same closes
  assert.deepEqual(getLabChart("trend-turn")!.closes.slice(0, 5), LAB_CHARTS[0]!.closes.slice(0, 5));
});

test("indicator values match independent SMA(20) / EMA(20) / MACD(12, 26, 9) references", () => {
  for (const c of LAB_CHARTS) {
    const s = refSma(c.closes, 20);
    const e = refEma(c.closes, 20);
    const m = refMacd(c.closes);
    for (let i = 0; i < c.closes.length; i++) {
      assert.ok(close(c.sma[i]!, s[i]!), `${c.id} sma ${i}`);
      assert.ok(close(c.ema[i]!, e[i]!), `${c.id} ema ${i}`);
      assert.ok(close(c.macd[i]!, m.line[i]!), `${c.id} macd ${i}`);
      assert.ok(close(c.signal[i]!, m.signal[i]!), `${c.id} signal ${i}`);
      assert.ok(close(c.histogram[i]!, m.hist[i]!), `${c.id} hist ${i}`);
    }
  }
});

test("every question is well formed and its key is one of its options", () => {
  const qs = labQuestions();
  assert.ok(qs.length >= 10);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) {
    assert.ok(q.options.length >= 2 && q.options.length <= 4, q.id);
    assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} duplicate option`);
    assert.ok(q.options.some((o) => o.id === q.correct), q.id);
    assert.ok(q.explanation.length > 20, q.id);
  }
});

test("turn chart: keys recomputed from the lines; EMA turns before SMA, MACD crosses down near the top", () => {
  const c = getLabChart("trend-turn")!;
  const top = peakIndex(c.closes, 0, 89);
  const e = turnDownIndex(c.ema, top - 5);
  const s = turnDownIndex(c.sma, top - 5);
  assert.ok(e > 0 && s > e, `EMA ${e} should turn before SMA ${s}`);
  assert.equal(keyLabel("turn-first"), "EMA(20)");
  assert.equal(keyLabel("turn-lag"), `${s - e} bars`);
  const cross = bar(keyLabel("turn-cross"));
  assert.ok(c.histogram[cross - 1]! >= 0 && c.histogram[cross]! < 0, "a down cross");
  for (let k = 0; k < 8; k++) assert.ok(c.histogram[cross + k]! < 0, "and it holds");
  assert.ok(Math.abs(cross - top) <= 5, "near the top");
  const after = cross + 3;
  assert.equal(keyLabel("turn-hist"), c.histogram[after]! < 0 ? "Below zero" : "Above zero");
  // on the straight part the two averages nearly coincide
  assert.ok(Math.abs(c.ema[49]! - c.sma[49]!) < 0.5);
  assert.match(keyLabel("ema-vs-sma-climb"), /nearly the same line/);
});

test("breakout chart: whipsaw count and the breakout cross match the histogram", () => {
  const c = getLabChart("range-breakout")!;
  let n = 0;
  for (let i = 34; i < 70; i++) if (Math.sign(c.histogram[i - 1]!) !== Math.sign(c.histogram[i]!) && c.histogram[i] !== 0) n++;
  assert.equal(keyLabel("range-whipsaw"), String(n));
  assert.ok(n >= 3, "a range whipsaws");
  const cross = bar(keyLabel("breakout-cross"));
  assert.equal(cross, firstCrossAfter(c, 65, "up")!.index);
  assert.ok(c.histogram[cross]! > 0 && c.histogram[cross - 1]! <= 0);
  assert.equal(keyLabel("breakout-zero").startsWith("Above"), c.macd[cross]! > 0);
  assert.ok(signalCrosses(c).length >= 4);
});

test("rounded top: the histogram peaks before price", () => {
  const c = getLabChart("rounded-top")!;
  const pricePeak = peakIndex(c.closes, 0, 90);
  let hp = 36;
  for (let i = 36; i <= pricePeak; i++) if (c.histogram[i]! > c.histogram[hp]!) hp = i;
  assert.ok(hp < pricePeak);
  assert.equal(keyLabel("hist-first"), "The histogram");
  assert.equal(byId("hist-first").mark, hp);
});

test("short-window lesson numbers come from the real Trend vs range window", () => {
  const f = shortWindowFacts();
  assert.equal(f.windowBars, 6);
  assert.equal(f.macdValues, 0);
  assert.equal(f.signalValues, 0);
  assert.equal(f.sma20Values, 0);
  assert.equal(f.macdFirstBar, 26);
  assert.equal(f.signalFirstBar, 34);
  assert.ok(f.maxGap < f.avgStep, "SMA(3) and EMA(3) stay within one bar's move");
  assert.equal(keyLabel("short-macd"), "0");
});

test("the existing short-chart Trend vs range practice is unchanged", () => {
  assert.deepEqual(
    REGIME_WINDOWS.map((w) => [w.id, w.regime, w.bars.length]),
    REGIME_WINDOWS.map((w) => [w.id, w.regime, 6]),
  );
  assert.equal(REGIME_WINDOWS.length, 8);
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rsi } from "./indicators.ts";
import { atr, rawStochastic } from "./oscillators.ts";
import { OSC_BARS, OSC_CHARTS, OSC_LABEL, OSC_PANELS, climbFacts, gapFacts, getOscChart, oscQuestions, rangeFacts } from "./oscillatorLab.ts";

const labelOf = (q: ReturnType<typeof oscQuestions>[number]) => q.options.find((o) => o.id === q.correct)!.label;

describe("oscillator lab charts", () => {
  it("three SIMULATED 120-bar charts with valid OHLC and a panel list each", () => {
    assert.equal(OSC_LABEL, "SIMULATED");
    assert.equal(OSC_CHARTS.length, 3);
    for (const c of OSC_CHARTS) {
      assert.equal(c.bars.length, OSC_BARS, c.id);
      for (const b of c.bars) assert.ok(b.low <= Math.min(b.open, b.close) && b.high >= Math.max(b.open, b.close), `${c.id} ${b.name}`);
      assert.ok(OSC_PANELS[c.id].length >= 2);
    }
  });
  it("series are the library functions applied to the bars", () => {
    for (const c of OSC_CHARTS) {
      assert.deepEqual(c.rsi, rsi(c.closes, 14));
      assert.deepEqual(c.fastK, rawStochastic(c.bars, 14));
      assert.deepEqual(c.atr, atr(c.bars, 20));
    }
  });
});

describe("oscillator lab facts (recomputed by hand-rolled loops)", () => {
  it("strong climb: RSI stays above 70 for a long run and price is higher 20 bars after the first overbought bar", () => {
    const c = getOscChart("strong-climb")!;
    const f = climbFacts(c);
    let best = 0, run = 0;
    for (const v of c.rsi) { run = v != null && v > 70 ? run + 1 : 0; best = Math.max(best, run); }
    assert.equal(f.runLength, best);
    assert.ok(best >= 10, `run ${best}`);
    assert.ok(f.closeLater > f.closeAtFirst);
    const over = c.rsi.map((v, i) => [v, i] as const).filter(([v]) => v != null && v > 70);
    const both = over.filter(([, i]) => (c.fastK[i] ?? 0) > 80).length;
    assert.equal(f.bothPct, Math.round((both / over.length) * 100));
    assert.ok(f.bothPct >= 60, "RSI and %K mostly agree");
  });
  it("choppy range: fast pair crosses more than the slow pair; J leaves 0–100 and K never does", () => {
    const f = rangeFacts();
    assert.ok(f.fastCrosses > f.slowCrosses);
    assert.ok(f.jOut > 0);
    assert.equal(f.kOut, 0);
    assert.ok(Math.abs(f.J - (3 * f.K - 2 * f.D)) < 1e-9);
  });
  it("climb then gap: stop arithmetic, ratchet, flip on the gap bar and a fill below the stop", () => {
    const c = getOscChart("climb-then-gap")!;
    const f = gapFacts(c);
    assert.ok(Math.abs(f.stopAtStep - (f.peakAtStep - 2 * f.atrAtStep)) <= 0.011, "stop = peak − 2 × ATR (rounded)");
    assert.equal(f.movedDownInClimb, false);
    assert.ok(c.bars[f.gapBar]!.open < f.stopBefore, "gap opens below the stop");
    // The flip is the first bar whose close is under the previous bar's stop.
    const firstBreak = c.closes.findIndex((cl, i) => i > 20 && c.vstopUp[i - 1] && cl < c.vstop[i - 1]!);
    assert.equal(f.downFlip, firstBreak);
    assert.ok(f.corrRsiStoch >= 0.7);
  });
});

describe("oscillator lab questions", () => {
  const qs = oscQuestions();
  it("ids unique, 4 or fewer distinct options, key present, marks inside the chart", () => {
    assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
    for (const q of qs) {
      assert.ok(q.options.length >= 3 && q.options.length <= 4, q.id);
      assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} labels`);
      assert.ok(q.options.some((o) => o.id === q.correct), q.id);
      if (q.mark != null) assert.ok(q.mark >= 0 && q.mark < OSC_BARS, q.id);
      assert.ok(OSC_PANELS[q.chartId].some((p) => p.id === q.panel), `${q.id} panel`);
    }
  });
  it("keys match the facts", () => {
    const byId = Object.fromEntries(qs.map((q) => [q.id, q]));
    const g = gapFacts();
    assert.equal(labelOf(byId["climb-rsi-run"]!), `${climbFacts().runLength} bars`);
    assert.equal(labelOf(byId["range-fast-crosses"]!), String(rangeFacts().slowCrosses));
    assert.equal(labelOf(byId["gap-stop-calc"]!), g.stopAtStep.toFixed(2));
    assert.equal(labelOf(byId["gap-flip"]!), `D${g.downFlip + 1}`);
    assert.match(labelOf(byId["gap-fill"]!), new RegExp(`^${g.gapOpen.toFixed(2)}`));
    const r = rangeFacts();
    const r1 = (v: number) => Math.round(v * 10) / 10;
    assert.equal(labelOf(byId["range-j-calc"]!), r1(3 * r1(r.K) - 2 * r1(r.D)).toFixed(1));
  });
  it("prompts never state the answer bar for bar-pick questions", () => {
    const flip = qs.find((q) => q.id === "gap-flip")!;
    assert.ok(!flip.prompt.includes(labelOf(flip)));
  });
});

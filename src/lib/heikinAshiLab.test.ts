/** Heikin-Ashi lab: SIMULATED chart shape, and every key recomputed independently from the raw bars. */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { HA_BARS, HA_CANDLES, haFacts, haQuestions } from "./heikinAshiLab.ts";
import { HEIKIN_ASHI_QUESTIONS } from "./candleQuiz.ts";
import PracticeHeikinAshi from "../pages/practice/HeikinAshi.tsx";
import PracticeJapaneseCandles from "../pages/practice/JapaneseCandles.tsx";
import { CORE_PATTERNS } from "./patternTabs.ts";

// Independent recompute: plain loops over the raw bars.
function ref() {
  const o: number[] = [], c: number[] = [], h: number[] = [], l: number[] = [];
  HA_BARS.forEach((b, i) => {
    c.push((b.open + b.high + b.low + b.close) / 4);
    o.push(i === 0 ? (b.open + b.close) / 2 : (o[i - 1]! + c[i - 1]!) / 2);
    h.push(Math.max(b.high, o[i]!, c[i]!));
    l.push(Math.min(b.low, o[i]!, c[i]!));
  });
  return { o, c, h, l };
}
const labelOf = (q: ReturnType<typeof haQuestions>[number]) => q.options.find((x) => x.id === q.correct)!.label;

describe("Heikin-Ashi lab", () => {
  it("draws the same HA candles as an independent loop", () => {
    const r = ref();
    HA_CANDLES.forEach((x, i) => {
      assert.ok(Math.abs(x.open - r.o[i]!) < 1e-9 && Math.abs(x.close - r.c[i]!) < 1e-9 && Math.abs(x.high - r.h[i]!) < 1e-9 && Math.abs(x.low - r.l[i]!) < 1e-9, `bar ${i}`);
    });
  });
  it("teaching points hold on this chart: smoother trend, strong-trend runs, lag, indecision at the top", () => {
    const f = haFacts();
    assert.ok(f.regRedInClimb >= 3 && f.haRedInClimb < f.regRedInClimb, "HA hides the small red days in the climb");
    assert.ok(f.haGreenInDecline < f.regGreenInDecline);
    assert.ok(f.upRun >= 6 && f.downRun >= 4);
    assert.ok(f.lagBars >= 1, "HA turns red after the regular candles");
    assert.ok(f.indecisionAtTop >= 2);
  });
  it("every key is recomputed from the raw bars", () => {
    const r = ref();
    const byId = Object.fromEntries(haQuestions().map((q) => [q.id, q]));
    const f = haFacts();
    const [c0, c1] = f.climb;
    let red = 0;
    for (let i = c0; i <= c1; i++) if (r.c[i]! < r.o[i]!) red++;
    assert.equal(labelOf(byId["ha-smoothing"]!), String(red));
    let best = 0, run = 0;
    for (let i = c0; i <= c1; i++) {
      run = r.c[i]! > r.o[i]! && r.o[i]! - r.l[i]! < 1e-9 ? run + 1 : 0;
      best = Math.max(best, run);
    }
    assert.equal(labelOf(byId["ha-up-run"]!), `${best} candles`);
    const peak = HA_BARS.reduce((m, b, i) => (b.close > HA_BARS[m]!.close ? i : m), 0);
    const firstHaRed = r.o.findIndex((o, i) => i > peak && r.c[i]! < o);
    assert.equal(labelOf(byId["ha-lag"]!), `D${firstHaRed + 1}`);
    const k = f.calcBar;
    const r2 = (x: number) => (Math.round((x + 1e-9) * 100) / 100).toFixed(2);
    assert.equal(labelOf(byId["ha-calc-open"]!), r2((Number(r.o[k - 1]!.toFixed(2)) + Number(r.c[k - 1]!.toFixed(2))) / 2));
    assert.equal(labelOf(byId["ha-calc-close"]!), r2(r.c[k]!));
    assert.match(labelOf(byId["ha-not-real"]!), /real prices/);
  });
  it("Learn bank includes every lab question with the exhibit, and option keys are spread", () => {
    const lab = HEIKIN_ASHI_QUESTIONS.filter((q) => q.heikinAshiExhibit);
    assert.equal(lab.length, haQuestions().length);
    assert.ok(new Set(HEIKIN_ASHI_QUESTIONS.map((q) => q.correctAnswer)).size >= 3);
  });
});

describe("Japanese candles and Heikin-Ashi pages", () => {
  const html = (el: Parameters<typeof createElement>[0], p = {}) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(el as never, p)));
  it("lesson page: history, the buyer vs seller battle, the core list and links", () => {
    const out = html(PracticeJapaneseCandles);
    for (const s of ["Dojima", "Steve Nison", "1991", "battle between buyers and sellers", "who won", "who was rejected", "indecision"]) assert.ok(out.includes(s), s);
    for (const href of ["/training?group=candle-reading&amp;start=1", "/training?group=japanese-candles&amp;start=1", "/practice/heikin-ashi"]) assert.ok(out.includes(`href="${href}"`), href);
    assert.ok(out.includes('data-testid="core-side-bullish"') && out.includes('data-testid="core-side-bearish"'));
    for (const c of CORE_PATTERNS.filter((x) => x.side === "bullish")) assert.ok(out.includes(`core-row-${c.id}`), c.id);
  });
  it("HA page: SIMULATED, formula and caveats, three views", () => {
    const both = html(PracticeHeikinAshi);
    for (const s of ["SIMULATED", "(open + high + low + close) ÷ 4", "not prices that traded", "lags"]) assert.ok(both.includes(s), s);
    assert.ok(both.includes('data-testid="ha-chart-regular"') && both.includes('data-testid="ha-chart-ha"'));
    const ha = html(PracticeHeikinAshi, { initialView: "ha" });
    assert.ok(!ha.includes('data-testid="ha-chart-regular"') && ha.includes('data-testid="ha-chart-ha"'));
    const done = html(PracticeHeikinAshi, { initialAnswers: Object.fromEntries(haQuestions().map((q) => [q.id, q.correct])) });
    assert.ok(done.includes(`${haQuestions().length} / ${haQuestions().length} answered right`));
  });
});

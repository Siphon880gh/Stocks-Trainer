import { test } from "node:test";
import assert from "node:assert/strict";
import { SCENARIOS } from "./scenarioCharts";
import { stairStepLines } from "./chartAnnotations";
import { PRICE_ACTION_QUESTIONS } from "./quizCandleExtras";
import { BUY_SELL_QUESTIONS } from "./buySellDrill";
import { getLiteracyTerm } from "./literacyTerms";

const ids = (n: number[]) => n.map((i) => `PA-${i}`);

test("stairStepLines: flat step + riser per change, last step extends with the label", () => {
  const lines = stairStepLines([{ fromIndex: 2, price: 10 }, { fromIndex: 5, price: 12 }, { fromIndex: 9, price: 15 }], { label: "Trail" });
  assert.equal(lines.length, 5);
  assert.deepEqual(lines[0], { from: { index: 2, price: 10 }, to: { index: 5, price: 10 }, tone: "risk" });
  assert.deepEqual(lines[1], { from: { index: 5, price: 10 }, to: { index: 5, price: 12 }, tone: "risk" });
  const last = lines[4];
  assert.equal(last.extend, true);
  assert.equal(last.label, "Trail");
  assert.equal(last.from.price, last.to.price);
  assert.ok(lines.slice(0, 4).every((l) => !l.label));
});

test("sc-trailing-stop: higher lows, stop only rises, never hit, target not reached", () => {
  const s = SCENARIOS["sc-trailing-stop"];
  const f = s.facts;
  const b = s.bars;
  const hl = [f.hl1Index, f.hl2Index, f.hl3Index];
  assert.equal(b[f.brkIndex].close, f.entry);
  assert.ok(b[f.brkIndex].close > f.breakLevel && b[f.brkIndex - 1].close <= f.breakLevel, "breakout bar is the first close above the base");
  for (let i = 1; i < f.brkIndex; i++) assert.ok(b[i].high <= f.breakLevel || i < 8, `base bar ${i} stays under the base top`);
  assert.deepEqual(hl.map((i) => b[i].low), [f.hl1, f.hl2, f.hl3]);
  assert.ok(f.hl1 < f.hl2 && f.hl2 < f.hl3);
  const steps = [f.baseStop, f.stop1, f.stop2, f.stop3];
  assert.ok(steps.every((v, i) => i === 0 || v > steps[i - 1]), "stop only moves up");
  assert.deepEqual([f.stop1, f.stop2, f.stop3], [f.hl1 - 40, f.hl2 - 40, f.hl3 - 40]);
  // Each HL is the lowest bar of its pullback, and no bar after a step trades at or below that step.
  const starts = [f.brkIndex, ...hl.map((i) => i + 1)];
  starts.forEach((from, k) => {
    const to = k + 1 < starts.length ? starts[k + 1] - 1 : b.length - 1;
    for (let i = from; i <= to; i++) assert.ok(b[i].low > steps[k], `bar ${i} low ${b[i].low} above step ${steps[k]}`);
  });
  for (const i of hl) assert.ok(b[i - 1].low > b[i].low && b[i + 1].low > b[i].low, `HL at ${i} is a swing low`);
  assert.equal(b[0].high, f.target);
  for (let i = 1; i < b.length; i++) assert.ok(b[i].high < f.target, `bar ${i} under the old high`);
  assert.equal(b[b.length - 1].close, f.close);
  assert.ok(f.target - f.close < f.close - f.stop3, "reward left < risk left (take-profit lesson)");
  assert.ok((f.target - f.entry) / (f.entry - f.baseStop) >= 2, "planned reward ≥ 2R");
  const trail = s.reveal.trendlines ?? [];
  assert.equal(trail.length, 7);
  assert.ok(trail.some((t) => t.label === "Trailing stop" && t.extend));
});

test("sc-pullback-entry: uptrend, pullback holds at the trendline, green confirmation, 1:2 plan", () => {
  const s = SCENARIOS["sc-pullback-entry"];
  const f = s.facts;
  const b = s.bars;
  const last = b[b.length - 1];
  assert.equal(s.decision, "buy");
  assert.equal(b[f.l1Index].low, f.l1);
  assert.equal(b[f.l2Index].low, f.l2);
  assert.equal(b[f.pbIndex].low, f.pbLow);
  assert.ok(f.l1 < f.l2 && f.l2 < f.pbLow, "higher lows");
  for (let i = f.l1Index; i < b.length; i++) assert.ok(b[i].low >= f.l1, `bar ${i} above the first HL`);
  for (let i = f.l2Index + 1; i < b.length; i++) assert.ok(b[i].low > f.l2, `bar ${i} above the second HL`);
  const h3 = Math.max(...b.slice(f.l2Index, f.pbIndex).map((x) => x.high));
  const h3Index = b.findIndex((x, i) => i >= f.l2Index && x.high === h3);
  assert.ok(h3 > f.h2, "higher high before the pullback");
  for (let i = h3Index; i < b.length; i++) assert.ok(b[i].low >= f.pbLow, `bar ${i}: the pullback low is the low of the dip`);
  const line = s.trendline!;
  const lineAt = line.from.price + ((line.to.price - line.from.price) / (line.to.index - line.from.index)) * (f.pbIndex - line.from.index);
  assert.ok(Math.abs(f.pbLow - lineAt) <= 30, "pullback low sits on the trendline");
  assert.ok(last.close > last.open && last.close > b[b.length - 2].close, "green confirmation");
  const p = s.plan!;
  assert.equal(p.entry, last.close);
  assert.ok(p.stop < f.pbLow);
  assert.equal(p.target - p.entry, 2 * (p.entry - p.stop));
});

test("trade-management questions: present, answers consistent with the facts, terms exist", () => {
  const byId = new Map(PRICE_ACTION_QUESTIONS.map((q) => [q.id, q]));
  for (const id of ids([18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])) {
    const q = byId.get(id);
    assert.ok(q, id);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), `${id} answer is an option`);
    assert.ok(q.glossaryTermId && getLiteracyTerm(q.glossaryTermId), `${id} term`);
  }
  assert.equal(new Set(PRICE_ACTION_QUESTIONS.map((q) => q.id)).size, PRICE_ACTION_QUESTIONS.length);
  const f = SCENARIOS["sc-trailing-stop"].facts;
  const ans = (id: string) => {
    const q = byId.get(id)!;
    return q.options.find((o) => o.id === q.correctAnswer)!.label;
  };
  assert.equal(ans("PA-24"), f.stop3.toLocaleString("en-US"));
  assert.ok(ans("PA-27").includes((f.stop3 - f.entry).toLocaleString("en-US")));
  assert.ok(ans("PA-28").includes((f.target - f.close).toLocaleString("en-US")) && ans("PA-28").includes((f.close - f.stop3).toLocaleString("en-US")));
  assert.ok(ans("PA-29").includes(((f.target - f.entry) / (f.entry - f.baseStop)).toFixed(1)));
  // Teaching marks stay hidden until submit.
  for (const id of ids([20, 22, 24, 27, 28, 29])) assert.ok(byId.get(id)!.revealAnnotations && !byId.get(id)!.annotations, id);
});

test("framework glossary terms + drill scenario", () => {
  for (const id of ["no-trade-zone", "entry-types", "trailing-stop", "taking-profit"]) assert.ok(getLiteracyTerm(id), id);
  const q = BUY_SELL_QUESTIONS.find((x) => x.id === "BS-SC-18");
  assert.ok(q);
  assert.equal(q.correctAnswer, "A");
  assert.equal(q.patternKey, "sc-pullback-entry");
  assert.ok(q.explanation.startsWith("Buy."));
});

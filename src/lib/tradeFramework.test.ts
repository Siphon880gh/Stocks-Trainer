import { test } from "node:test";
import assert from "node:assert/strict";
import { SCENARIOS } from "./scenarioCharts";
import { PATTERNS } from "./patterns";
import { PATTERN_OHLC, type OHLC } from "./ohlcData";
import { getLiteracyTerm } from "./literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies";
import { PRICE_ACTION_CASES, PRICE_ACTION_CASE_FACTS } from "./priceActionCases";
import { listSessions } from "./coaching";
import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import {
  FRAMEWORK_DRILL_OPTIONS,
  FRAMEWORK_DRILLS,
  FRAMEWORK_STEPS,
  FRAMEWORK_UNCERTAINTY,
  TARGET_AFTERMATH,
  TF_QUESTIONS,
  TRADE_FRAMEWORK_LINKS,
  TRADE_FRAMEWORK_QUESTIONS,
} from "./tradeFramework";

const maxHigh = (b: OHLC[], from = 0, to = b.length - 1) => Math.max(...b.slice(from, to + 1).map((x) => x.high));
const minLow = (b: OHLC[], from = 0, to = b.length - 1) => Math.min(...b.slice(from, to + 1).map((x) => x.low));
const answer = (id: string) => {
  const q = TF_QUESTIONS.find((x) => x.id === id)!;
  return q.options.find((o) => o.id === q.correctAnswer)!.label;
};

test("sc-stop-hit: breakout entry, pullbacks hold above the stop, last bar closes through it, target never reached", () => {
  const s = SCENARIOS["sc-stop-hit"];
  const f = s.facts;
  const b = s.bars;
  const last = b.length - 1;
  assert.equal(b[f.brkIndex].close, f.entry);
  assert.ok(b[f.brkIndex].close > f.breakLevel);
  for (let i = 0; i < f.brkIndex; i++) assert.ok(b[i].close <= f.breakLevel, `bar ${i} closes in the base`);
  assert.ok(f.stop < f.breakLevel && f.stop < b[f.brkIndex].low, "stop sits back inside the base, under the breakout candle");
  for (let i = f.brkIndex + 1; i < last; i++) assert.ok(b[i].low > f.stop, `bar ${i} stays above the stop`);
  assert.ok(b[last].close < f.stop, "the decision bar closes through the stop");
  assert.equal(b[last].close, f.close);
  assert.equal(b[f.topIndex].high, f.top);
  assert.equal(maxHigh(b, f.brkIndex), f.top, "the top is the high of the trade");
  assert.ok(f.top < f.target, "target never reached");
  assert.equal(f.target - f.entry, 2 * (f.entry - f.stop));
  assert.equal(s.decision, "sell");
  for (let i = 1; i < b.length; i++) assert.equal(b[i].open, b[i - 1].close, `bar ${i} opens at the prior close`);
});

test("sc-target-reversal: higher low entry, rally into the target zone, shooting star, reward left < risk left", () => {
  const s = SCENARIOS["sc-target-reversal"];
  const f = s.facts;
  const b = s.bars;
  const last = b.length - 1;
  const d = b[last];
  assert.equal(b[f.oldHighIndex].high, f.target);
  assert.equal(maxHigh(b), f.target, "the old high is the high of the chart");
  for (let i = f.lowIndex; i < last; i++) assert.ok(b[i].high < f.zoneBottom, `bar ${i}: the rally stays under the zone until the decision`);
  assert.ok(d.high >= f.zoneBottom && d.high < f.target, "decision bar reaches into the zone");
  const body = Math.abs(d.close - d.open);
  const upper = d.high - Math.max(d.open, d.close);
  const lower = Math.min(d.open, d.close) - d.low;
  assert.ok(upper >= 2 * body && upper >= 2 * lower, "shooting star: long upper wick, small body near the low");
  assert.equal(d.close, f.close);
  assert.equal(b[f.lowIndex].low, f.low);
  assert.equal(minLow(b, f.oldHighIndex), f.low);
  assert.equal(b[f.hlIndex].low, f.hlLow);
  assert.ok(f.hlLow > f.low);
  assert.equal(minLow(b, f.lowIndex + 1), f.hlLow, "the higher low is the lowest bar after the low");
  assert.equal(b[f.entryIndex].close, f.entry);
  assert.ok(f.stop < f.hlLow);
  assert.ok(f.trail < minLow(b, last - 6, last), "trailed stop sits under the last swing");
  assert.ok(f.target - f.close < f.close - f.trail, "reward left < risk left");
  assert.ok((f.target - f.entry) / (f.entry - f.stop) >= 2, "planned reward ≥ 2R");
  for (let i = 1; i < b.length; i++) assert.equal(b[i].open, b[i - 1].close, `bar ${i} opens at the prior close`);
});

test("lesson: four steps in framework order, real charts, candles and glossary terms", () => {
  assert.deepEqual(FRAMEWORK_STEPS.map((s) => [s.n, s.id]), [[1, "entry"], [2, "stop"], [3, "trail"], [4, "target"]]);
  const patternIds = new Set(PATTERNS.map((p) => p.id));
  for (const s of FRAMEWORK_STEPS) {
    assert.ok(SCENARIOS[s.chartKey], s.chartKey);
    assert.ok(s.bars.length >= 30, s.id);
    assert.ok(getLiteracyTerm(s.termId), s.termId);
    assert.ok(s.points.length >= 3 && s.rule.length > 10, s.id);
    for (const c of s.candles) assert.ok(patternIds.has(c.id) && PATTERN_OHLC[c.id], `${s.id} candle ${c.id}`);
  }
  for (const c of [FRAMEWORK_UNCERTAINTY.chop, FRAMEWORK_UNCERTAINTY.signal]) assert.ok(SCENARIOS[c.chartKey], c.chartKey);
  assert.equal(SCENARIOS["sc-range-middle"].decision, "wait");
  assert.equal(SCENARIOS["sc-breakout-retest"].decision, "buy");
  // Lesson-only aftermath: continuous, and it falls through the trailed stop (taking profit at the target kept more).
  const t = SCENARIOS["sc-target-reversal"];
  let prev = t.bars[t.bars.length - 1].close;
  for (const x of TARGET_AFTERMATH) {
    assert.equal(x.open, prev);
    assert.ok(x.high >= Math.max(x.open, x.close) && x.low <= Math.min(x.open, x.close));
    prev = x.close;
  }
  assert.ok(minLow(TARGET_AFTERMATH) < t.facts.trail);
  assert.ok(maxHigh(TARGET_AFTERMATH) < t.facts.target);
});

test("lesson drills: every answer is an option; every framework step is drilled", () => {
  for (const d of FRAMEWORK_DRILLS) assert.ok((FRAMEWORK_DRILL_OPTIONS as readonly string[]).includes(d.answer), d.id);
  for (const o of FRAMEWORK_DRILL_OPTIONS) assert.ok(FRAMEWORK_DRILLS.some((d) => d.answer === o), o);
  assert.equal(new Set(FRAMEWORK_DRILLS.map((d) => d.id)).size, FRAMEWORK_DRILLS.length);
});

test("Learn group trade-framework: TF- questions plus PA-18…PA-30, numbers from the scenario facts", () => {
  assert.ok(QUIZ_GROUPS.some((g) => g.id === "trade-framework"));
  const qs = getQuestionsForGroup("trade-framework");
  assert.equal(qs, TRADE_FRAMEWORK_QUESTIONS);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (let i = 18; i <= 30; i++) assert.ok(qs.some((q) => q.id === `PA-${i}`), `PA-${i}`);
  for (const q of TF_QUESTIONS) {
    assert.match(q.id, /^TF-\d\d$/);
    assert.ok(q.glossaryTermId && getLiteracyTerm(q.glossaryTermId), `${q.id} term`);
    for (const o of q.options) if (o.id !== q.correctAnswer) assert.ok(o.feedback, `${q.id} ${o.id} feedback`);
    assert.ok(!q.options.find((o) => o.id === q.correctAnswer)!.feedback, `${q.id} right answer has no feedback`);
  }
  const sh = SCENARIOS["sc-stop-hit"].facts;
  const tr = SCENARIOS["sc-target-reversal"].facts;
  const fmt = (v: number) => v.toLocaleString("en-US");
  assert.ok(answer("TF-04").includes(fmt(sh.stop)));
  assert.ok(answer("TF-06").includes(fmt(sh.entry - sh.stop)));
  assert.ok(answer("TF-09").includes(fmt(tr.target - tr.close)) && answer("TF-09").includes(fmt(tr.close - tr.trail)));
  assert.ok(answer("TF-10").includes(((tr.target - tr.entry) / (tr.entry - tr.stop)).toFixed(1)));
  assert.ok(answer("TF-07").startsWith("50 shares"));
  // Chart questions that would give the answer away keep the teaching marks for after submit.
  for (const id of ["TF-04", "TF-05", "TF-08", "TF-09"]) {
    const q = TF_QUESTIONS.find((x) => x.id === id)!;
    assert.ok(q.revealAnnotations, id);
  }
});

test("cases pack price-action: five charts-only cases walking the framework, facts match the bars", () => {
  assert.ok(CASE_PACKS.some((p) => p.id === "price-action"));
  assert.equal(PRICE_ACTION_CASES.length, 5);
  for (const c of PRICE_ACTION_CASES) {
    assert.ok(CASE_STUDIES.includes(c), c.id);
    assert.equal(c.packId, "price-action");
    assert.equal(c.contextType, "chart");
    assert.equal(c.postOhlc.length > c.preOhlc.length, true);
    assert.deepEqual(c.postOhlc.slice(0, c.preOhlc.length), c.preOhlc);
    for (let i = 1; i < c.postOhlc.length; i++) assert.equal(c.postOhlc[i].open, c.postOhlc[i - 1].close, `${c.id} bar ${i}`);
    for (const x of c.postOhlc) assert.ok(x.high >= Math.max(x.open, x.close) && x.low <= Math.min(x.open, x.close), `${c.id} ${x.name}`);
  }
  assert.deepEqual(PRICE_ACTION_CASES.map((c) => c.correctActions[0]), ["hold", "buy", "sell", "hold", "sell"]);
  const [chop, brk, stop, trail, target] = PRICE_ACTION_CASES;
  const F = PRICE_ACTION_CASE_FACTS;
  assert.equal(maxHigh(chop.preOhlc), F.chop.top);
  assert.equal(minLow(chop.preOhlc), F.chop.bottom);
  assert.ok(maxHigh(chop.postOhlc) <= F.chop.top && minLow(chop.postOhlc) >= F.chop.bottom, "chop stays in the range");
  assert.equal(maxHigh(brk.preOhlc, 0, brk.preOhlc.length - 2), F.breakout.ceiling);
  assert.equal(brk.preOhlc.at(-1)!.close, F.breakout.close);
  assert.ok(brk.preOhlc.at(-1)!.low > F.breakout.stop);
  assert.equal(maxHigh(brk.postOhlc), F.breakout.target);
  assert.ok((F.breakout.target - F.breakout.close) / (F.breakout.close - F.breakout.stop) >= 2);
  assert.equal(maxHigh(stop.preOhlc), F.stop.top);
  assert.equal(stop.preOhlc.at(-1)!.close, F.stop.close);
  assert.ok(F.stop.close < F.stop.stop);
  assert.ok(minLow(stop.preOhlc, 7, stop.preOhlc.length - 2) > F.stop.stop, "pullbacks held above the stop until the last bar");
  assert.equal(maxHigh(trail.preOhlc), F.trail.high);
  assert.equal(minLow(trail.preOhlc, 12), F.trail.dipLow);
  assert.ok(minLow(trail.preOhlc, 4) >= F.trail.hl1 && F.trail.dipLow > F.trail.hl2 && F.trail.hl2 > F.trail.stop);
  assert.ok(maxHigh(trail.postOhlc) > F.trail.high, "trend resumed");
  assert.equal(target.preOhlc[0].high, F.target.oldHigh);
  assert.ok(maxHigh(target.preOhlc.slice(1)) < F.target.oldHigh);
  assert.equal(target.preOhlc.at(-1)!.close, F.target.close);
  assert.ok(F.target.oldHigh - F.target.close < F.target.close - F.target.trail);
  assert.ok(minLow(target.preOhlc, 8) >= F.target.hl && F.target.trail < F.target.hl);
});

test("coach, glossary, practice hub and links point at real surfaces", () => {
  const slugs = new Set(listSessions().map((s) => s.slug));
  for (const slug of ["honor-the-stop", "trade-plan-before-entry", "trailing-stop-exit"]) assert.ok(slugs.has(slug), slug);
  for (const id of ["price-action-framework", "stop-loss-invalidation", "no-trade-zone", "entry-types", "trailing-stop", "taking-profit"]) {
    assert.ok(getLiteracyTerm(id), id);
  }
  assert.ok(MISC_PRACTICE_ITEMS.some((m) => m.id === "trade-framework" && m.to === "/practice/trade-framework"));
  const groups = new Set(QUIZ_GROUPS.map((g) => g.id));
  const packs = new Set(CASE_PACKS.map((p) => p.id as string));
  for (const l of TRADE_FRAMEWORK_LINKS) {
    const coach = l.to.match(/^\/coach\/(.+)$/);
    if (coach) assert.ok(slugs.has(coach[1]), l.to);
    const group = l.to.match(/group=([a-z-]+)/);
    if (group) assert.ok(groups.has(group[1] as never), l.to);
    const pack = l.to.match(/pack=([a-z-]+)/);
    if (pack) assert.ok(packs.has(pack[1]), l.to);
  }
});

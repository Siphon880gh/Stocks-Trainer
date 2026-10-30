import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERN_OHLC, type OHLC } from "./ohlcData";
import { getLiteracyTerm } from "./literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies";
import { PILLAR_CASES, PILLAR_CASE_FACTS } from "./priceActionCases";
import { listSessions } from "./coaching";
import { getPlaybook } from "./playbooks";
import { classifySourceUrl } from "./playbookPrompt";
import { APP_ROUTES } from "./academy/refs";
import { FOUR_PILLARS, FP_CHART_FACTS, FP_MISTAKES, FP_OHLC, FP_QUESTIONS, FP_RELATED, FP_SETUPS, FP_SOURCE, FP_TERMS } from "./fourPillars";

const maxHigh = (b: OHLC[]) => Math.max(...b.map((x) => x.high));
const minLow = (b: OHLC[]) => Math.min(...b.map((x) => x.low));
const wellFormed = (id: string, bars: OHLC[]) => {
  for (let i = 0; i < bars.length; i++) {
    const x = bars[i];
    assert.ok(x.high >= Math.max(x.open, x.close) && x.low <= Math.min(x.open, x.close), `${id} ${x.name}`);
    if (i) assert.equal(x.open, bars[i - 1].close, `${id} ${x.name} opens at the previous close`);
  }
};

test("pillars in the video's order, three setups, four mistakes", () => {
  assert.deepEqual(FOUR_PILLARS.map((p) => p.id), ["map", "confirmation", "invalidation", "context"]);
  assert.deepEqual(FOUR_PILLARS.map((p) => p.n), [1, 2, 3, 4]);
  const map = FOUR_PILLARS[0].points.join(" ");
  assert.match(map, /1 is interesting, 2 is real, 3–4 is significant/);
  assert.match(map, /wick through it is a test, a close through it is a statement/);
  assert.match(FOUR_PILLARS[2].points.join(" "), /sets the position size/);
  assert.match(FOUR_PILLARS[3].points.join(" "), /earnings, CPI, a Fed decision/);
  assert.deepEqual(FP_SETUPS.map((s) => [s.id, s.direction]), [["hold", "long"], ["reclaim", "long"], ["rejection", "short"]]);
  for (const s of FP_SETUPS) assert.ok(getLiteracyTerm(s.termId), s.termId);
  assert.equal(FP_MISTAKES.length, 4);
  for (const t of FP_TERMS) assert.ok(getLiteracyTerm(t.id), t.id);
});

test("Playbook kit: YouTube source credited, cross-links resolve, no exit rules attributed to the video", () => {
  const p = getPlaybook("price-action-four-pillars")!;
  assert.ok(p);
  assert.equal(p.source.url, FP_SOURCE.url);
  assert.equal(classifySourceUrl(p.source.url), "youtube");
  assert.equal(p.source.kind, "youtube");
  assert.match(p.source.label, /^Brando Trades · /);
  assert.equal(p.coachSlug, "four-pillars");
  assert.equal(p.caseId, "case-fp-reclaim");
  assert.deepEqual(p.overlayIds, []);
  for (const word of ["Map", "Confirmation", "Invalidation", "Context", "Hold", "Reclaim", "Rejection", "full size, half size or pass"]) {
    assert.ok(p.explanation.includes(word), word);
  }
  assert.ok(p.explanation.indexOf("1. Map") < p.explanation.indexOf("2. Confirmation"));
  assert.ok(p.explanation.indexOf("2. Confirmation") < p.explanation.indexOf("3. Invalidation"));
  assert.ok(p.explanation.indexOf("3. Invalidation") < p.explanation.indexOf("4. Context"));
  assert.match(p.explanation, /does not give profit-target or trailing-stop rules/);
  assert.match(p.explanation, /his account, not checked here/);
  assert.equal(p.related, FP_RELATED);
  const routes = new Set<string>(APP_ROUTES);
  const slugs = new Set(listSessions().map((s) => s.slug));
  const groups = new Set(QUIZ_GROUPS.map((g) => g.id as string));
  const packs = new Set(CASE_PACKS.map((x) => x.id as string));
  for (const l of FP_RELATED) {
    const path = l.to.split("?")[0];
    const coach = path.match(/^\/coach\/(.+)$/);
    if (coach) assert.ok(slugs.has(coach[1]), l.to);
    else assert.ok(routes.has(path), `${l.to} is an app route`);
    const group = l.to.match(/group=([a-z-]+)/);
    if (group) assert.ok(groups.has(group[1]), l.to);
    const pack = l.to.match(/pack=([a-z-]+)/);
    if (pack) assert.ok(packs.has(pack[1]), l.to);
  }
  assert.ok(FP_RELATED.some((l) => l.to === "/practice/trade-framework"));
});

test("Learn group four-pillars: FP- questions, charts match their facts", () => {
  assert.ok(QUIZ_GROUPS.some((g) => g.id === "four-pillars"));
  const qs = getQuestionsForGroup("four-pillars");
  assert.equal(qs, FP_QUESTIONS);
  assert.ok(qs.length >= 16);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) {
    assert.match(q.id, /^FP-\d\d$/);
    if (q.patternKey) assert.ok(PATTERN_OHLC[q.patternKey], q.id);
    if (q.glossaryTermId) assert.ok(getLiteracyTerm(q.glossaryTermId), `${q.id} ${q.glossaryTermId}`);
    assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} distinct options`);
  }
  for (const [id, bars] of Object.entries(FP_OHLC)) wellFormed(id, bars);
  const T = FP_CHART_FACTS.touches;
  const touches = FP_OHLC["fp-touches"].filter((x) => Math.abs(x.high - T.level) <= T.tolerance);
  assert.equal(touches.length, T.count);
  assert.ok(FP_OHLC["fp-touches"].every((x) => x.close < T.level), "never closes above the level");
  const W = FP_CHART_FACTS.wickClose;
  const wc = FP_OHLC["fp-wick-close"];
  assert.ok(wc[W.testIndex].low < W.level && wc[W.testIndex].close > W.level, "wick test");
  assert.ok(wc[W.breakIndex].close < W.level, "close through");
  assert.ok(wc.slice(0, W.testIndex).every((x) => x.close > W.level), "held before the test");
});

test("four-pillar cases: facts match the bars, mode four_pillars, invalidation respected", () => {
  assert.deepEqual(PILLAR_CASES.map((c) => c.correctActions[0]), ["buy", "short", "hold"]);
  for (const c of PILLAR_CASES) {
    assert.ok(CASE_STUDIES.includes(c), c.id);
    assert.equal(c.packId, "price-action");
    assert.equal(c.thinkingMode, "four_pillars");
    assert.equal(c.assetClass, "equity");
    assert.deepEqual(c.postOhlc.slice(0, c.preOhlc.length), c.preOhlc);
    wellFormed(c.id, c.postOhlc);
  }
  const [reclaim, reject, context] = PILLAR_CASES;
  const F = PILLAR_CASE_FACTS;
  const pre = reclaim.preOhlc;
  assert.deepEqual(pre.filter((x) => Math.abs(x.low - F.reclaim.level) <= 0.05).map((x) => x.low), [...F.reclaim.touches]);
  const breakIdx = pre.findIndex((x) => x.close < F.reclaim.level);
  assert.equal(pre[breakIdx].close, F.reclaim.breakClose);
  assert.ok(pre.slice(breakIdx, -1).every((x) => x.close < F.reclaim.level), "stays below until the reclaim");
  assert.deepEqual([pre.at(-2)!.high, pre.at(-2)!.close], [F.reclaim.testHigh, F.reclaim.testClose]);
  assert.deepEqual([pre.at(-1)!.close, pre.at(-1)!.low], [F.reclaim.close, F.reclaim.invalidation]);
  assert.ok(minLow(reclaim.postOhlc.slice(pre.length)) > F.reclaim.invalidation);
  const rp = reject.preOhlc;
  assert.deepEqual(rp.slice(0, -1).filter((x) => Math.abs(x.high - F.reject.level) <= 0.05).map((x) => x.high), [...F.reject.touches]);
  assert.deepEqual([rp.at(-1)!.high, rp.at(-1)!.close], [F.reject.wickHigh, F.reject.close]);
  assert.ok(maxHigh(rp.slice(0, -1)) < F.reject.wickHigh && maxHigh(reject.postOhlc.slice(rp.length)) < F.reject.invalidation);
  assert.equal(reject.allowShort, true);
  const cp = context.preOhlc;
  assert.equal(cp[0].open, F.context.start);
  assert.equal(maxHigh(cp), F.context.high);
  assert.deepEqual([cp.at(-1)!.low, cp.at(-1)!.close], [F.context.dipLow, F.context.close]);
  assert.equal(Math.round((F.context.close / F.context.start - 1) * 100), F.context.runPct);
  assert.ok(minLow(context.postOhlc.slice(cp.length)) < F.context.dipLow, "the catalyst knocks it through");
  assert.ok(listSessions().some((s) => s.slug === "four-pillars"));
});

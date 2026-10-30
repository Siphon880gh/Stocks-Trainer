import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERN_OHLC, type OHLC } from "./ohlcData";
import { getLiteracyTerm } from "./literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies";
import { FVG_CASES, FVG_CASE_FACTS } from "./priceActionCases";
import { listSessions } from "./coaching";
import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import { getPlaybook } from "./playbooks";
import { classifySourceUrl } from "./playbookPrompt";
import { routeExists } from "./academy/refs";
import {
  breakoutGap,
  detectFairValueGaps,
  firstPullbackInto,
  fvgPlan,
  fvgSizeFor,
  FVG_BY_ID,
  FVG_CAVEATS,
  FVG_CREDIBILITY,
  FVG_LINKS,
  FVG_PLAYBOOK_SOURCE,
  FVG_QUESTIONS,
  FVG_RELATED,
  FVG_SESSIONS,
  FVG_SOURCE,
  FVG_STEPS,
  FVG_TERMS,
  FVG_THREE_CANDLES,
} from "./fairValueGap";

const maxHigh = (b: OHLC[]) => Math.max(...b.map((x) => x.high));
const minLow = (b: OHLC[]) => Math.min(...b.map((x) => x.low));
const wellFormed = (id: string, bars: OHLC[]) => {
  for (let i = 0; i < bars.length; i++) {
    const x = bars[i];
    assert.ok(x.high >= Math.max(x.open, x.close) && x.low <= Math.min(x.open, x.close), `${id} ${x.name}`);
    if (i) assert.equal(x.open, bars[i - 1].close, `${id} ${x.name} opens at the previous close`);
  }
};
const c = (high: number, low: number): OHLC => ({ name: "", open: low, high, low, close: high });

test("detectFairValueGaps: bullish, bearish, and no gap when wicks overlap (even by a cent)", () => {
  assert.deepEqual(detectFairValueGaps([c(10, 9), c(12, 10), c(13, 11)]), [{ index: 1, direction: "bullish", bottom: 10, top: 11 }]);
  assert.deepEqual(detectFairValueGaps([c(13, 12), c(12, 10), c(11, 10.5)]), [{ index: 1, direction: "bearish", bottom: 11, top: 12 }]);
  assert.deepEqual(detectFairValueGaps([c(10, 9), c(12, 10), c(13, 9.99)]), []);
  assert.deepEqual(detectFairValueGaps([c(10, 9), c(12, 10), c(13, 10)]), [], "touching is not a gap");
  assert.deepEqual(detectFairValueGaps([c(10, 9), c(11, 9)]), []);
  const [g1, g2, g3] = FVG_THREE_CANDLES.gap;
  assert.equal(detectFairValueGaps([g1, g2, g3]).length, 1);
  assert.equal(detectFairValueGaps(FVG_THREE_CANDLES.noGap).length, 0);
});

test("sessions: well formed, 5-minute clock, answers follow from the bars", () => {
  for (const s of FVG_SESSIONS) {
    wellFormed(s.id, s.bars);
    assert.equal(s.bars[0].name, "10:00");
    assert.equal(s.bars[1].name, "10:05");
    assert.ok(s.decisionIndex < s.bars.length - 1, s.id);
  }
  const clean = fvgPlan(FVG_BY_ID["fvg-pullback"].bars, 50);
  assert.deepEqual([clean.gap?.index, clean.gap?.bottom, clean.gap?.top, clean.pullbackIndex, clean.entry, clean.stop, clean.risk, clean.target], [6, 49.99, 50.4, 10, 50.4, 49.89, 0.51, 51.42]);
  const after = FVG_BY_ID["fvg-pullback"].bars.slice(11);
  assert.ok(maxHigh(after) >= clean.target! && minLow(FVG_BY_ID["fvg-pullback"].bars.slice(10)) > clean.stop!);
  // The signal drill decides on the breakout candle itself: candle 3 has not printed, so the gap is not known yet.
  assert.equal(FVG_BY_ID["fvg-signal"].decisionIndex, clean.gap!.index);
  assert.equal(FVG_BY_ID["fvg-pullback"].decisionIndex, clean.pullbackIndex);
  assert.equal(breakoutGap(FVG_BY_ID["fvg-no-gap"].bars, 30), null, "no-gap tape has no breakout gap");
  const run = fvgPlan(FVG_BY_ID["fvg-runaway"].bars, 80);
  assert.ok(run.gap && run.pullbackIndex === null, "runaway gap never revisited");
  const fail = fvgPlan(FVG_BY_ID["fvg-fail"].bars, 20);
  assert.equal(fail.pullbackIndex, FVG_BY_ID["fvg-fail"].decisionIndex);
  const afterFail = FVG_BY_ID["fvg-fail"].bars.slice(fail.pullbackIndex! + 1);
  assert.ok(minLow(afterFail) <= fail.stop! && maxHigh(afterFail) < fail.target!, "stopped out, target never reached");
  assert.equal(fvgSizeFor(200, 0.51), 392);
  assert.deepEqual(FVG_STEPS.map((s) => s.n), [1, 2, 3, 4, 5]);
  assert.match(FVG_STEPS[1].title, /signal, not an entry/);
  assert.deepEqual(FVG_CAVEATS.map((x) => x.id), ["belief-not-fact", "missed-trade", "no-gap-no-setup", "pullback-can-fail", "no-target-rule", "size-from-stop"]);
});

test("Learn group fair-value-gap: FVG- questions, charts and glossary terms resolve", () => {
  assert.ok(QUIZ_GROUPS.some((g) => g.id === "fair-value-gap"));
  const qs = getQuestionsForGroup("fair-value-gap");
  assert.equal(qs, FVG_QUESTIONS);
  assert.ok(qs.length >= 13);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) {
    assert.match(q.id, /^FVG-\d\d$/);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} distinct options`);
    if (q.patternKey) assert.ok(PATTERN_OHLC[q.patternKey], `${q.id} ${q.patternKey}`);
    if (q.glossaryTermId) assert.ok(getLiteracyTerm(q.glossaryTermId), `${q.id} ${q.glossaryTermId}`);
  }
  for (const s of FVG_SESSIONS) assert.equal(PATTERN_OHLC[`${s.id}-pre`].length, s.decisionIndex + 1);
  for (const t of FVG_TERMS) assert.ok(getLiteracyTerm(t.id), t.id);
  // "Often retested" is never stated as fact.
  const copy = JSON.stringify([FVG_STEPS, FVG_CAVEATS, FVG_QUESTIONS, FVG_TERMS]);
  assert.doesNotMatch(copy, /gaps always (fill|get retested)|will be retested/i);
  assert.match(copy, /belief, not a (guarantee|promise)/);
});

test("FVG cases: facts match the bars, mode fair_value_gap, in the price-action pack", () => {
  assert.deepEqual(FVG_CASES.map((x) => x.correctActions[0]), ["hold", "buy", "hold", "sell"]);
  for (const k of FVG_CASES) {
    assert.ok(CASE_STUDIES.includes(k), k.id);
    assert.equal(k.packId, "price-action");
    assert.equal(k.thinkingMode, "fair_value_gap");
    assert.equal(k.assetClass, "equity");
    assert.deepEqual(k.postOhlc.slice(0, k.preOhlc.length), k.preOhlc);
    assert.ok(k.postOhlc.length > k.preOhlc.length);
    wellFormed(k.id, k.postOhlc);
    assert.match(k.brief, /SAMPLE stock, 5-minute candles/);
  }
  const [signal, pullback, run, fail] = FVG_CASES;
  const F = FVG_CASE_FACTS;
  const m = fvgPlan(pullback.postOhlc, F.main.level);
  assert.deepEqual([m.gap!.index, m.gap!.bottom, m.gap!.top, m.pullbackIndex, m.entry, m.stop, m.risk, m.target], [F.main.breakoutIndex, F.main.gapBottom, F.main.gapTop, F.main.pullbackIndex, F.main.entry, F.main.stop, F.main.risk, F.main.target]);
  assert.equal(signal.preOhlc.length - 1, F.main.breakoutIndex, "case 1 decides on the breakout candle");
  assert.equal(pullback.preOhlc.length - 1, F.main.pullbackIndex, "case 2 decides on the pullback candle");
  const post = pullback.postOhlc.slice(pullback.preOhlc.length);
  assert.ok(maxHigh(post) >= F.main.target && minLow(post) > F.main.stop);
  const r = fvgPlan(run.postOhlc, F.run.level);
  assert.deepEqual([r.gap!.bottom, r.gap!.top, r.pullbackIndex], [F.run.gapBottom, F.run.gapTop, null]);
  assert.equal(run.preOhlc.length - 1, F.run.decisionIndex);
  const f = fvgPlan(fail.postOhlc, F.fail.level);
  assert.deepEqual([f.gap!.bottom, f.gap!.top, f.pullbackIndex, f.entry, f.stop], [F.fail.gapBottom, F.fail.gapTop, F.fail.pullbackIndex, F.fail.entry, F.fail.stop]);
  const d = fail.preOhlc[F.fail.decisionIndex];
  assert.ok(d.close < f.gap!.bottom && d.close < F.fail.level && d.low > f.stop!, "closed below gap and level; stop not yet filled");
  assert.ok(minLow(fail.postOhlc.slice(fail.preOhlc.length)) < f.stop!, "the stop fills next");
  assert.equal(firstPullbackInto(fail.postOhlc, f.gap!), F.fail.pullbackIndex);
});

test("coach, practice hub, links, Playbook kit and credibility point at real surfaces", () => {
  const slugs = new Set(listSessions().map((s) => s.slug));
  assert.ok(slugs.has("breakout-pullback-fvg"));
  assert.ok(MISC_PRACTICE_ITEMS.some((x) => x.id === "fair-value-gap" && x.to === "/practice/fair-value-gap"));
  const groups = new Set(QUIZ_GROUPS.map((g) => g.id as string));
  const packs = new Set(CASE_PACKS.map((p) => p.id as string));
  for (const l of [...FVG_LINKS, ...FVG_RELATED]) {
    const coach = l.to.match(/^\/coach\/(.+)$/);
    if (coach) assert.ok(slugs.has(coach[1]), l.to);
    else assert.ok(routeExists(l.to), `${l.to} is an app route`);
    const group = l.to.match(/group=([a-z-]+)/);
    if (group) assert.ok(groups.has(group[1]), l.to);
    const pack = l.to.match(/pack=([a-z-]+)/);
    if (pack) assert.ok(packs.has(pack[1]), l.to);
    const open = l.to.match(/open=([a-z-]+)/);
    if (open) assert.ok(getLiteracyTerm(open[1]), l.to);
    const kit = l.to.match(/^\/playbooks\/(.+)$/);
    if (kit) assert.ok(getPlaybook(kit[1]), l.to);
  }
  assert.match(FVG_SOURCE.url, /^https:\/\/www\.facebook\.com\/reel\//);
  const p = getPlaybook("breakout-pullback-fvg")!;
  assert.ok(p);
  assert.equal(p.source.url, FVG_PLAYBOOK_SOURCE.url);
  assert.equal(p.source.kind, "webpage");
  assert.equal(classifySourceUrl(p.source.url), "webpage");
  assert.doesNotMatch(p.source.url, /facebook\.com/, "the reel needs a login, so it is not the kit's source");
  assert.equal(p.video, undefined, "no video embed");
  assert.equal(p.coachSlug, "breakout-pullback-fvg");
  assert.equal(p.caseId, "case-fvg-pullback-into-gap");
  assert.equal(p.related, FVG_RELATED);
  assert.ok(FVG_RELATED.some((l) => l.to === "/practice/trade-framework"));
  assert.ok(FVG_RELATED.some((l) => l.to === "/practice/fair-value-gap"));
  assert.match(p.explanation, /short Facebook trading reel/);
  assert.match(p.explanation, /common trader belief, not a guarantee/);
  assert.match(p.explanation, /gives no rule for it/);
  assert.equal(p.credibility, FVG_CREDIBILITY);
  const summary = FVG_CREDIBILITY.summary.join(" ");
  assert.match(summary, /no independent test or track record/);
  assert.match(summary, /common trader belief, not a guarantee/);
  for (const s of FVG_CREDIBILITY.sources) {
    assert.equal(s.role, "corroborates");
    assert.doesNotMatch(s.url, /facebook\.com/);
  }
  const backs = FVG_CREDIBILITY.sources.map((s) => s.supports).join(" | ");
  for (const idea of ["confirmation", "retest", "fair value gap", "no gap", "Stop"]) assert.ok(backs.includes(idea), idea);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERN_OHLC, type OHLC } from "./ohlcData";
import { getLiteracyTerm } from "./literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies";
import { ORB_CASES, ORB_CASE_FACTS } from "./priceActionCases";
import { listSessions } from "./coaching";
import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import {
  firstCloseOutside,
  openingRange,
  orbPlan,
  ORB_BY_ID,
  ORB_CAVEATS,
  ORB_LINKS,
  ORB_OPTION_EXAMPLE,
  ORB_QUESTIONS,
  ORB_RANGE_BARS,
  ORB_SESSIONS,
  ORB_SOURCE,
  ORB_TERMS,
  ORB_TYPICAL_WIDTH,
  ORB_WIDE_MULTIPLE,
  sizeFor,
} from "./openingRange";

const maxHigh = (b: OHLC[]) => Math.max(...b.map((x) => x.high));
const minLow = (b: OHLC[]) => Math.min(...b.map((x) => x.low));
const wellFormed = (id: string, bars: OHLC[]) => {
  for (let i = 0; i < bars.length; i++) {
    const x = bars[i];
    assert.ok(x.high >= Math.max(x.open, x.close) && x.low <= Math.min(x.open, x.close), `${id} ${x.name}`);
    if (i) assert.equal(x.open, bars[i - 1].close, `${id} ${x.name} opens at the previous close`);
  }
};

test("sessions: 15-minute ET clock, well formed, the decision candle is the first close outside the range", () => {
  assert.equal(ORB_RANGE_BARS, 2);
  for (const s of ORB_SESSIONS) {
    wellFormed(s.id, s.bars);
    assert.equal(s.bars[0].name, "9:30");
    assert.equal(s.bars[1].name, "9:45");
    assert.ok(s.decisionIndex >= ORB_RANGE_BARS && s.decisionIndex < s.bars.length - 1, s.id);
    const sig = firstCloseOutside(s.bars);
    if (s.answer === "wait") {
      const r = openingRange(s.bars);
      const d = s.bars[s.decisionIndex];
      assert.equal(sig, null, `${s.id}: no close outside all session`);
      assert.ok(d.high > r.high && d.close <= r.high, `${s.id}: the decision candle is a wick above, close inside`);
    } else {
      assert.ok(sig, s.id);
      assert.equal(sig!.index, s.decisionIndex, s.id);
    }
  }
});

test("plans: long and short reach the 1:1 target without touching the stop; the failed breakout hits its stop", () => {
  const long = orbPlan(ORB_BY_ID["orb-long"].bars);
  assert.deepEqual([long.rangeLow, long.rangeHigh, long.direction, long.entry, long.stop, long.risk, long.target], [579.6, 581.6, "long", 582.1, 579.6, 2.5, 584.6]);
  const afterLong = ORB_BY_ID["orb-long"].bars.slice(ORB_BY_ID["orb-long"].decisionIndex + 1);
  assert.ok(maxHigh(afterLong) >= long.target! && minLow(afterLong) > long.stop!);
  const short = orbPlan(ORB_BY_ID["orb-short"].bars);
  assert.deepEqual([short.direction, short.entry, short.stop, short.risk, short.target], ["short", 573.6, 575.6, 2, 571.6]);
  const afterShort = ORB_BY_ID["orb-short"].bars.slice(ORB_BY_ID["orb-short"].decisionIndex + 1);
  assert.ok(minLow(afterShort) <= short.target! && maxHigh(afterShort) < short.stop!);
  const fail = orbPlan(ORB_BY_ID["orb-fail"].bars);
  const afterFail = ORB_BY_ID["orb-fail"].bars.slice(ORB_BY_ID["orb-fail"].decisionIndex + 1);
  assert.ok(minLow(afterFail) <= fail.stop! && maxHigh(afterFail) < fail.target!, "stopped out, target never reached");
  const wide = orbPlan(ORB_BY_ID["orb-wide"].bars);
  assert.ok(wide.risk! > ORB_WIDE_MULTIPLE * ORB_TYPICAL_WIDTH, "wide day flagged");
  const afterWide = ORB_BY_ID["orb-wide"].bars.slice(ORB_BY_ID["orb-wide"].decisionIndex + 1);
  assert.ok(maxHigh(afterWide) < wide.target! && minLow(afterWide) > wide.stop!, "wide day goes nowhere");
  for (const id of ["orb-long", "orb-short", "orb-fail"]) {
    assert.ok(orbPlan(ORB_BY_ID[id].bars).risk! <= ORB_WIDE_MULTIPLE * ORB_TYPICAL_WIDTH, id);
  }
  assert.equal(sizeFor(200, 2.5), 80);
  assert.equal(sizeFor(200, 5.7), 35);
});

test("option example: 1:1 on the underlying is not 1:1 on premium, and same-day decays faster", () => {
  const [zero, month] = ORB_OPTION_EXAMPLE.rows;
  assert.equal(zero.id, "0dte");
  assert.equal(month.id, "month");
  assert.ok(ORB_OPTION_EXAMPLE.strike > ORB_OPTION_EXAMPLE.underlying.entry!, "slightly out of the money call");
  assert.ok(zero.delta > 0.2 && zero.delta < 0.5);
  assert.ok(Math.abs(zero.targetPct + zero.stopPct) >= 5, `${zero.targetPct} vs ${zero.stopPct}`);
  assert.ok(zero.atTarget - zero.entry < ORB_OPTION_EXAMPLE.underlying.risk!, "the option gains less than the stock in dollars");
  assert.ok(zero.flatPct < month.flatPct && zero.flatPct <= -5, "theta hurts the same-day contract more");
  const premium = ORB_CAVEATS.find((c) => c.id === "premium-not-1to1")!.text;
  assert.match(premium, new RegExp(`\\+${zero.targetPct}%`));
  assert.match(premium, new RegExp(`${zero.stopPct}%`));
  assert.deepEqual(ORB_CAVEATS.map((c) => c.id), ["close-vs-open", "wide-range", "premium-not-1to1", "no-expiry-rule", "strike-subjective", "afford"]);
});

test("Learn group opening-range: ORB- questions, charts and glossary terms resolve", () => {
  assert.ok(QUIZ_GROUPS.some((g) => g.id === "opening-range"));
  const qs = getQuestionsForGroup("opening-range");
  assert.equal(qs, ORB_QUESTIONS);
  assert.ok(qs.length >= 14);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) {
    assert.match(q.id, /^ORB-\d\d$/);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} distinct options`);
    if (q.patternKey) assert.ok(PATTERN_OHLC[q.patternKey], `${q.id} ${q.patternKey}`);
    if (q.glossaryTermId) assert.ok(getLiteracyTerm(q.glossaryTermId), `${q.id} ${q.glossaryTermId}`);
  }
  // The "-pre" charts end at the decision candle, so they never show the answer.
  for (const s of ORB_SESSIONS) assert.equal(PATTERN_OHLC[`${s.id}-pre`].length, s.decisionIndex + 1);
  for (const t of ORB_TERMS) assert.ok(getLiteracyTerm(t.id), t.id);
});

test("ORB cases: facts match the bars, mode opening_range, in the price-action pack", () => {
  assert.deepEqual(ORB_CASES.map((c) => c.correctActions[0]), ["buy", "hold", "hold"]);
  for (const c of ORB_CASES) {
    assert.ok(CASE_STUDIES.includes(c), c.id);
    assert.equal(c.packId, "price-action");
    assert.equal(c.thinkingMode, "opening_range");
    assert.equal(c.assetClass, "equity");
    assert.deepEqual(c.postOhlc.slice(0, c.preOhlc.length), c.preOhlc);
    assert.ok(c.postOhlc.length > c.preOhlc.length);
    wellFormed(c.id, c.postOhlc);
    assert.equal(firstCloseOutside(c.preOhlc)?.index ?? null, c.id === "case-orb-wick-only" ? null : c.preOhlc.length - 1, c.id);
  }
  const [up, wick, wide] = ORB_CASES;
  const F = ORB_CASE_FACTS;
  const pu = orbPlan(up.preOhlc);
  assert.deepEqual([pu.rangeHigh, pu.rangeLow, pu.entry, pu.risk, pu.target], [F.up.high, F.up.low, F.up.close, F.up.risk, F.up.target]);
  assert.ok(maxHigh(up.postOhlc.slice(up.preOhlc.length)) >= F.up.target && minLow(up.postOhlc.slice(up.preOhlc.length)) > F.up.low);
  const rw = openingRange(wick.preOhlc);
  assert.deepEqual([rw.high, rw.low, wick.preOhlc.at(-1)!.high, wick.preOhlc.at(-1)!.close], [F.wick.high, F.wick.low, F.wick.wickHigh, F.wick.close]);
  assert.equal(firstCloseOutside(wick.postOhlc), null, "never closes outside");
  const pw = orbPlan(wide.preOhlc);
  assert.deepEqual([pw.rangeHigh, pw.rangeLow, pw.entry, pw.risk], [F.wide.high, F.wide.low, F.wide.close, F.wide.risk]);
  assert.ok(pw.width > ORB_WIDE_MULTIPLE * F.wide.usualWidth);
  assert.equal(sizeFor(F.wide.budget, F.wide.risk), F.wide.shares);
  for (const c of ORB_CASES) assert.match(c.brief, /SAMPLE SPY\.S, 15-minute candles/);
});

test("coach, practice hub, links and source point at real surfaces", () => {
  const slugs = new Set(listSessions().map((s) => s.slug));
  assert.ok(slugs.has("opening-range-breakout"));
  assert.ok(MISC_PRACTICE_ITEMS.some((m) => m.id === "opening-range" && m.to === "/practice/opening-range"));
  const groups = new Set(QUIZ_GROUPS.map((g) => g.id as string));
  const packs = new Set(CASE_PACKS.map((p) => p.id as string));
  for (const l of ORB_LINKS) {
    const coach = l.to.match(/^\/coach\/(.+)$/);
    if (coach) assert.ok(slugs.has(coach[1]), l.to);
    const group = l.to.match(/group=([a-z-]+)/);
    if (group) assert.ok(groups.has(group[1]), l.to);
    const pack = l.to.match(/pack=([a-z-]+)/);
    if (pack) assert.ok(packs.has(pack[1]), l.to);
    const open = l.to.match(/open=([a-z-]+)/);
    if (open) assert.ok(getLiteracyTerm(open[1]), l.to);
  }
  assert.match(ORB_SOURCE.url, /^https:\/\/www\.facebook\.com\/reel\//);
  // The broker promotion in the reel is not repeated anywhere in the lesson.
  const copy = JSON.stringify([ORB_SESSIONS, ORB_CAVEATS, ORB_QUESTIONS, ORB_TERMS, ORB_SOURCE]);
  assert.doesNotMatch(copy, /firstrade/i);
});

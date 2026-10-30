import { test } from "node:test";
import assert from "node:assert/strict";
import { type OHLC } from "./ohlcData";
import { getLiteracyTerm } from "./literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies";
import { listSessions } from "./coaching";
import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import { getPlaybook } from "./playbooks";
import { classifySourceUrl } from "./playbookPrompt";
import { routeExists } from "./academy/refs";
import {
  cagr,
  impliedYears,
  maxDrawdown,
  portfolioVol,
  shortSleeveLoss,
  termSlopePct,
  trendFilter,
  twoAssetVol,
  vrpCall,
  RPP_BACKTEST,
  RPP_CASES,
  RPP_CASE_FACTS,
  RPP_CORR_EXAMPLE,
  RPP_CREDIBILITY,
  RPP_ETF_IMPLIED_CAGR,
  RPP_IMPLIED_YEARS,
  RPP_LINKS,
  RPP_PLAYBOOK_SOURCE,
  RPP_QUESTIONS,
  RPP_RELATED,
  RPP_SLEEVES,
  RPP_START,
  RPP_TERMS,
  RPP_TREND_SAMPLE,
  RPP_VIDEO,
  VRP_SCENARIOS,
} from "./riskPremiumPortfolio";

const wellFormed = (id: string, bars: OHLC[]) => {
  for (const b of bars) assert.ok(b.low <= Math.min(b.open, b.close) && b.high >= Math.max(b.open, b.close), `${id} ${b.name}`);
};

test("sleeves add to 100% and the backtest numbers are the creator's, as shown", () => {
  assert.deepEqual(RPP_SLEEVES.map((s) => [s.ticker, s.weight]), [["SPY", 35], ["TLT", 30], ["GLD", 20], ["FXE", 10], ["DBC", 5]]);
  assert.equal(RPP_SLEEVES.reduce((a, s) => a + s.weight, 0), 100);
  const combined = RPP_BACKTEST.find((r) => r.id === "combined")!;
  assert.equal(combined.endValue, 1_215_306);
  assert.equal(combined.cagr, 18.4);
  assert.equal(combined.sharpe, 1.22);
});

test("helpers: CAGR, implied years, drawdown, portfolio volatility, trend filter, VRP call, short-sleeve loss", () => {
  assert.equal(Math.round(cagr(100, 200, 10) * 100) / 100, 7.18);
  assert.ok(Math.abs(impliedYears(100, 200, 7.177) - 10) < 0.01);
  assert.equal(maxDrawdown([100, 120, 90, 130, 117]), -25);
  assert.equal(Math.round(portfolioVol([1], [15], [[1]]) * 100) / 100, 15);
  assert.equal(Math.round(twoAssetVol(10, 10, 1) * 100) / 100, 10);
  assert.deepEqual(RPP_CORR_EXAMPLE.map((c) => c.vol), [13.43, 10.97, 9.18]);
  const t = trendFilter(RPP_TREND_SAMPLE, 10);
  assert.equal(t.length, RPP_TREND_SAMPLE.length);
  assert.deepEqual(t.slice(0, 9), Array(9).fill(null), "no signal until 10 months of data");
  assert.ok(t.includes(true) && t.includes(false), "the sample both holds and goes to cash");
  assert.equal(termSlopePct(10, 11), 10);
  assert.equal(vrpCall(14, 15, 13, 9), "short");
  assert.equal(vrpCall(30, 25, 40, 50), "long");
  assert.equal(vrpCall(14, 15, 13, 20), "flat");
  for (const s of VRP_SCENARIOS) assert.equal(vrpCall(s.front, s.second, s.implied, s.realized), s.answer, s.id);
  assert.deepEqual(VRP_SCENARIOS.map((s) => s.answer), ["short", "long", "flat", "flat"]);
  assert.equal(shortSleeveLoss(20, 400), 80);
});

test("the app's numbers check: implied years and the ETF-only CAGR inconsistency", () => {
  assert.equal(RPP_START, 100_000);
  assert.equal(RPP_IMPLIED_YEARS, 14.8);
  assert.ok(RPP_ETF_IMPLIED_CAGR > 6.9 && RPP_ETF_IMPLIED_CAGR < 7.0);
  const etf = RPP_BACKTEST.find((r) => r.id === "etf")!;
  assert.ok(RPP_ETF_IMPLIED_CAGR - etf.cagr > 1, "end value and CAGR shown for the ETF-only line disagree");
});

test("Learn group risk-premium-portfolio: RPP- questions and glossary terms resolve", () => {
  assert.ok(QUIZ_GROUPS.some((g) => g.id === "risk-premium-portfolio"));
  const qs = getQuestionsForGroup("risk-premium-portfolio");
  assert.equal(qs, RPP_QUESTIONS);
  assert.equal(qs.length, 15);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) {
    assert.match(q.id, /^RPP-\d{2}$/);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    if (q.glossaryTermId) assert.ok(getLiteracyTerm(q.glossaryTermId), `${q.id} ${q.glossaryTermId}`);
  }
  for (const t of RPP_TERMS) assert.ok(getLiteracyTerm(t.id), t.id);
  assert.match(`${getLiteracyTerm("trend-filter")!.summary} ${getLiteracyTerm("trend-filter")!.detail}`, /not the rule in the Predicting Alpha video/);
});

test("volatility cases: facts match the bars, mode vol_risk_premium, in the market-wide news pack", () => {
  assert.equal(RPP_CASES.length, 3);
  assert.deepEqual(RPP_CASES.map((c) => c.correctActions[0]), ["sell", "buy", "sell"]);
  for (const k of RPP_CASES) {
    assert.ok(CASE_STUDIES.includes(k), k.id);
    assert.equal(k.packId, "macro-news");
    assert.equal(k.thinkingMode, "vol_risk_premium");
    assert.deepEqual(k.postOhlc.slice(0, k.preOhlc.length), k.preOhlc);
    assert.ok(k.postOhlc.length > k.preOhlc.length);
    wellFormed(k.id, k.postOhlc);
    assert.match(k.brief, /SAMPLE/);
  }
  const [xiv, vxx, tlt] = RPP_CASES;
  const F = RPP_CASE_FACTS;
  assert.equal(xiv.preOhlc.at(-1)!.close, F.xiv.lastClose);
  assert.ok(Math.min(...xiv.postOhlc.slice(xiv.preOhlc.length).map((b) => b.close)) < F.xiv.lastClose * 0.1, "falls more than 90%");
  assert.equal(vxx.preOhlc.at(-1)!.close, F.vxx.decisionClose);
  assert.equal(Math.max(...vxx.postOhlc.map((b) => b.close)), F.vxx.peak);
  assert.ok(F.vxx.peak / F.vxx.low - 1 > 3.9, "about +400% from the low");
  assert.equal(tlt.preOhlc.at(-1)!.close, F.tlt.decisionClose);
  assert.equal(tlt.postOhlc.at(-1)!.close, F.tlt.end);
});

test("coach, practice hub, links, Playbook kit with video and credibility point at real surfaces", () => {
  const slugs = new Set(listSessions().map((s) => s.slug));
  assert.ok(slugs.has("read-a-backtest"));
  assert.ok(MISC_PRACTICE_ITEMS.some((x) => x.id === "risk-premium-portfolio" && x.to === "/practice/risk-premium-portfolio"));
  const groups = new Set(QUIZ_GROUPS.map((g) => g.id as string));
  const packs = new Set(CASE_PACKS.map((p) => p.id as string));
  for (const l of [...RPP_LINKS, ...RPP_RELATED]) {
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
  const p = getPlaybook("etf-north-star-vrp")!;
  assert.ok(p);
  assert.equal(p.source.url, RPP_PLAYBOOK_SOURCE.url);
  assert.equal(classifySourceUrl(p.source.url), "webpage");
  assert.doesNotMatch(p.source.url, /youtube\.com/, "the main source is an outside page, not the video");
  assert.deepEqual(p.video, { ...RPP_VIDEO });
  assert.equal(p.video!.embedUrl, "https://www.youtube-nocookie.com/embed/lgCcuWrfLkI");
  assert.equal(p.coachSlug, "read-a-backtest");
  assert.equal(p.caseId, "case-vrp-short-vxx-curve-inverts");
  assert.equal(p.related, RPP_RELATED);
  assert.ok(RPP_RELATED.some((l) => l.to === "/practice/risk-premium-portfolio"));
  assert.match(p.explanation, /creator’s own backtest/);
  assert.match(p.explanation, /Warning: short volatility/);
  assert.match(p.explanation, /Warning: leverage/);
  assert.match(p.explanation, /not the video’s/);
  assert.equal(p.credibility, RPP_CREDIBILITY);
  const summary = RPP_CREDIBILITY.summary.join(" ");
  assert.match(summary, /own backtest/);
  assert.match(summary, /paid offering/);
  for (const s of RPP_CREDIBILITY.sources) {
    assert.equal(s.role, "corroborates");
    assert.doesNotMatch(s.url, /youtube\.com/);
  }
  const backs = RPP_CREDIBILITY.sources.map((s) => s.supports).join(" | ");
  for (const idea of ["economic role", "Trend", "Volatility risk premium", "contango", "inverse volatility"]) assert.ok(backs.includes(idea), idea);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { type OHLC } from "./ohlcData";
import { getLiteracyTerm, LITERACY_TERMS } from "./literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies";
import { listSessions, loadSession } from "./coaching";
import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import { getPlaybook } from "./playbooks";
import { getSamplePack } from "./samplePacks";
import { classifySourceUrl } from "./playbookPrompt";
import { routeExists } from "./academy/refs";
import {
  annualizedPremiumYield,
  assignedPnl,
  calledAwayForgone,
  coveredCallBreakeven,
  coveredCallMaxProfit,
  cspBreakeven,
  cspCollateral,
  deltaRoughItmPct,
  effectiveCostBasis,
  premiumYieldPct,
  wheelCycleReturn,
  EX_BASIS_AFTER_CALL,
  EX_BREAKEVEN,
  EX_COLLATERAL,
  EX_CRASH_BUY_HOLD,
  EX_CRASH_LOCKED,
  EX_CRASH_WHEEL,
  EX_CYCLE,
  EX_PUT_ANNUAL,
  EX_PUT_YIELD,
  EX_RALLY_FORGONE,
  WHEEL_BENCHMARKS,
  WHEEL_CASES,
  WHEEL_CASE_FACTS,
  WHEEL_CREDIBILITY,
  WHEEL_CYCLE,
  WHEEL_DRILLS,
  WHEEL_LINKS,
  WHEEL_PLAYBOOK_SOURCE,
  WHEEL_QUESTIONS,
  WHEEL_RELATED,
  WHEEL_SCENARIOS,
  WHEEL_TERMS,
  WHEEL_VERDICT,
  WHEEL_VIDEO,
} from "./wheelStrategy";

const wellFormed = (id: string, bars: OHLC[]) => {
  for (const b of bars) assert.ok(b.low <= Math.min(b.open, b.close) && b.high >= Math.max(b.open, b.close), `${id} ${b.name}`);
};

test("helpers: put breakeven, collateral, yields, basis, covered call math, cycle return, delta shortcut", () => {
  assert.equal(cspBreakeven(50, 1.2), 48.8);
  assert.equal(cspCollateral(50), 5000);
  assert.equal(cspCollateral(50, 3), 15000);
  assert.equal(premiumYieldPct(1.2, 50), 2.4);
  assert.equal(annualizedPremiumYield(1.2, 50, 30), 29.2);
  assert.ok(annualizedPremiumYield(1.2, 50, 30, true) > 29.2, "compounding is higher than simple");
  // The screenshots' AROI column matches the simple formula.
  assert.equal(Math.round(annualizedPremiumYield(1, 65, 7) * 10) / 10, 80.2);
  assert.equal(Math.round(annualizedPremiumYield(5.5, 85, 15) * 10) / 10, 157.5);
  assert.equal(Math.round(annualizedPremiumYield(13, 335, 24)), 59);
  assert.equal(effectiveCostBasis(50, [1.2, 0.9]), 47.9);
  assert.equal(coveredCallBreakeven(48.8, 0.9), 47.9);
  assert.equal(coveredCallMaxProfit(48.8, 53, 0.9), 510);
  assert.equal(calledAwayForgone(53, 62), 900);
  assert.equal(calledAwayForgone(53, 50), 0);
  assert.equal(assignedPnl(48.8, 35), -1380);
  const c = wheelCycleReturn({ putStrike: 50, premiums: [1.2, 0.9], exitPrice: 53, days: 60 });
  assert.deepEqual([c.basis, c.profit, c.returnPct], [47.9, 510, 10.2]);
  assert.equal(c.annualizedPct, 62.05);
  assert.equal(deltaRoughItmPct(-0.25), 25);
});

test("worked example and three paths are derived, and the wheel loses less than the stock only by the premium", () => {
  assert.equal(EX_BREAKEVEN, 48.8);
  assert.equal(EX_COLLATERAL, 5000);
  assert.equal(EX_PUT_YIELD, 2.4);
  assert.equal(EX_PUT_ANNUAL, 29.2);
  assert.equal(EX_BASIS_AFTER_CALL, 47.9);
  assert.equal(EX_CYCLE.profit, 510);
  assert.equal(EX_RALLY_FORGONE, 900);
  assert.equal(EX_CRASH_WHEEL, -1380);
  assert.equal(EX_CRASH_BUY_HOLD, -1700);
  assert.equal(EX_CRASH_LOCKED, -855);
  assert.equal(EX_CRASH_WHEEL - EX_CRASH_BUY_HOLD, 320, "the gap is the premium plus the lower entry");
  assert.deepEqual(WHEEL_SCENARIOS.map((s) => s.id), ["flat", "rally", "crash"]);
  const rally = WHEEL_SCENARIOS.find((s) => s.id === "rally")!;
  assert.ok(rally.stock > rally.wheel, "a rally favors just owning the stock");
  const crash = WHEEL_SCENARIOS.find((s) => s.id === "crash")!;
  assert.ok(crash.wheel < 0 && crash.stock < crash.wheel);
  assert.deepEqual(WHEEL_CYCLE.map((s) => s.id), ["csp", "assigned", "cc", "called"]);
});

test("benchmarks match the Wilshire study for Cboe and the verdict is honest", () => {
  const b = Object.fromEntries(WHEEL_BENCHMARKS.map((r) => [r.id, r]));
  assert.deepEqual([b.spx.annualReturn, b.put.annualReturn, b.bxm.annualReturn], [9.8, 9.54, 8.5]);
  assert.deepEqual([b.spx.vol, b.put.vol, b.bxm.vol], [14.9, 9.9, 10.6]);
  assert.deepEqual([b.spx.maxDd, b.put.maxDd, b.bxm.maxDd], [-50.9, -35.5, -35.8]);
  assert.deepEqual([b.spx.sharpe, b.put.sharpe, b.bxm.sharpe], [0.45, 0.64, 0.51]);
  assert.deepEqual([b.spx.y2008, b.put.y2008, b.bxm.y2008], [-37, -26.8, -28.7]);
  assert.deepEqual([b.spx.y2013, b.put.y2013, b.bxm.y2013], [32.4, 12.3, 13.3]);
  assert.match(WHEEL_VERDICT.answer, /^Yes/);
  assert.match(WHEEL_VERDICT.answer, /Not as free income/);
});

test("drills have one right answer among distinct options", () => {
  assert.equal(WHEEL_DRILLS.length, 8);
  for (const d of WHEEL_DRILLS) {
    assert.ok(d.answer >= 0 && d.answer < d.options.length, d.id);
    assert.equal(new Set(d.options).size, d.options.length, d.id);
  }
});

test("Learn group wheel-strategy: 20 WHEEL- questions, passable without the video, glossary resolves", () => {
  assert.ok(QUIZ_GROUPS.some((g) => g.id === "wheel-strategy"));
  const qs = getQuestionsForGroup("wheel-strategy");
  assert.equal(qs, WHEEL_QUESTIONS);
  assert.ok(qs.length >= 12 && qs.length <= 20);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) {
    assert.match(q.id, /^WHEEL-\d{2}$/);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} distinct options`);
    assert.doesNotMatch(`${q.prompt} ${q.explanation}`, /\bvideo\b|tastylive/i, `${q.id} does not depend on the video`);
    if (q.glossaryTermId) assert.ok(getLiteracyTerm(q.glossaryTermId), `${q.id} ${q.glossaryTermId}`);
  }
  for (const t of WHEEL_TERMS) assert.ok(getLiteracyTerm(t.id), t.id);
  const ids = LITERACY_TERMS.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "glossary ids are unique");
});

test("wheel cases: facts match the bars, mode wheel_cycle, in the options-context pack", () => {
  assert.equal(WHEEL_CASES.length, 4);
  assert.deepEqual(WHEEL_CASES.map((c) => c.correctActions[0]), ["buy", "hold", "sell", "buy"]);
  for (const k of WHEEL_CASES) {
    assert.ok(CASE_STUDIES.includes(k), k.id);
    assert.equal(k.packId, "options-context");
    assert.equal(k.assetClass, "option_context");
    assert.equal(k.thinkingMode, "wheel_cycle");
    assert.deepEqual(k.postOhlc.slice(0, k.preOhlc.length), k.preOhlc);
    assert.ok(k.postOhlc.length > k.preOhlc.length);
    wellFormed(k.id, k.postOhlc);
    assert.match(k.brief, /SAMPLE/);
    assert.match(k.brief, /Buy = .*Sell = .*Hold = |Buy = .*Hold = .*Sell = /, `${k.id} maps the buttons to wheel actions`);
  }
  const [flat, rip, crash, earn] = WHEEL_CASES;
  const F = WHEEL_CASE_FACTS;
  assert.equal(flat.preOhlc.at(-1)!.close, F.flat.decision);
  assert.equal(flat.postOhlc.at(-1)!.close, F.flat.end);
  assert.ok(Math.min(...flat.postOhlc.slice(flat.preOhlc.length).map((b) => b.low)) > F.flat.putStrike, "the next put stays out of the money");
  assert.equal(rip.preOhlc.at(-1)!.close, F.rip.decision);
  assert.equal(rip.postOhlc.at(-1)!.close, F.rip.end);
  assert.ok(F.rip.end > F.rip.callStrike);
  assert.equal(crash.preOhlc.at(-1)!.close, F.crash.decision);
  assert.equal(crash.postOhlc.at(-1)!.close, F.crash.end);
  assert.ok(F.crash.end < F.crash.basis);
  assert.equal(earn.preOhlc.at(-1)!.close, F.earnings.decision);
  assert.equal(earn.postOhlc[earn.preOhlc.length]!.open, F.earnings.gapOpen);
  assert.equal(earn.postOhlc.at(-1)!.close, F.earnings.end);
  assert.ok(F.earnings.gapOpen < F.earnings.putStrike, "the report gaps through the strike");
});

test("coach session, practice hub, links and the Playbook kit point at real surfaces", () => {
  const r = loadSession("wheel-strategy");
  assert.ok(r.ok, JSON.stringify(r));
  const s = r.session;
  const nodes = Object.values(s.tree.nodes);
  assert.ok(nodes.length <= 16);
  assert.ok(nodes.filter((n) => n.outcome === "wrong" && n.rewind_to).length >= 2);
  assert.ok(nodes.some((n) => n.outcome === "success"));
  assert.ok(!s.meta.tags.includes("equities"));
  const slugs = new Set(listSessions().map((x) => x.slug));
  assert.ok(MISC_PRACTICE_ITEMS.some((x) => x.id === "wheel-strategy" && x.to === "/practice/wheel-strategy"));
  const groups = new Set(QUIZ_GROUPS.map((g) => g.id as string));
  const packs = new Set(CASE_PACKS.map((p) => p.id as string));
  for (const l of [...WHEEL_LINKS, ...WHEEL_RELATED]) {
    const coach = l.to.match(/^\/coach\/(.+)$/);
    if (coach) assert.ok(slugs.has(coach[1]), l.to);
    else assert.ok(routeExists(l.to), `${l.to} is an app route`);
    const group = l.to.match(/group=([a-z-]+)/);
    if (group) assert.ok(groups.has(group[1]), l.to);
    const pack = l.to.match(/pack=([a-z-]+)/);
    if (pack) assert.ok(packs.has(pack[1]), l.to);
    const kit = l.to.match(/^\/playbooks\/(.+)$/);
    if (kit) assert.ok(getPlaybook(kit[1]), l.to);
  }
  const p = getPlaybook("wheel-csp-to-covered-call")!;
  assert.ok(p);
  assert.equal(p.assetClass, "option_context");
  assert.equal(getSamplePack(p.samplePackId!)!.assetClass, p.assetClass);
  assert.equal(WHEEL_CASES.find((c) => c.id === p.caseId)!.assetClass, p.assetClass);
  assert.equal(p.coachSlug, "wheel-strategy");
  assert.equal(p.source.url, WHEEL_PLAYBOOK_SOURCE.url);
  assert.equal(classifySourceUrl(p.source.url), "webpage");
  assert.match(p.source.url, /schwab\.com/);
  assert.deepEqual(p.video, { ...WHEEL_VIDEO });
  assert.equal(p.video!.embedUrl, "https://www.youtube-nocookie.com/embed/WwTBFM1hEjI");
  assert.ok(p.related!.some((l) => l.to.startsWith("/training?group=wheel-strategy") && l.label.startsWith("Learn · ")), "the video points at the Learn check");
  assert.match(p.explanation, /SAMPLE/);
  assert.match(p.explanation, /Warning: the downside is the stock's/);
  assert.equal(p.credibility, WHEEL_CREDIBILITY);
  assert.equal(WHEEL_CREDIBILITY.title, "How well-tested is this?");
  for (const src of WHEEL_CREDIBILITY.sources) {
    assert.doesNotMatch(src.url, /youtube\.com|wheelstrategyoptions/);
    assert.match(src.verifiedOn, /^\d{4}-\d{2}-\d{2}$/);
  }
  const hosts = WHEEL_CREDIBILITY.sources.map((x) => new URL(x.url).hostname).join(" ");
  for (const h of ["schwab.com", "optionseducation.org", "finra.org", "irs.gov", "cboe.com", "fidelity.com"]) assert.ok(hosts.includes(h), h);
  for (const id of ["covered-call", "cash-secured-put"]) {
    assert.ok(getPlaybook(id)!.related!.some((l) => l.to === "/playbooks/wheel-csp-to-covered-call"), `${id} links the wheel`);
  }
});

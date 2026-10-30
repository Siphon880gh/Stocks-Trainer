import { test } from "node:test";
import assert from "node:assert/strict";
import { type OHLC } from "./ohlcData";
import { getLiteracyTerm, LITERACY_TERMS } from "./literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies";
import { listSessions } from "./coaching";
import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import { getPlaybook } from "./playbooks";
import { classifySourceUrl } from "./playbookPrompt";
import { routeExists } from "./academy/refs";
import { RPP_LINKS, RPP_RELATED, RPP_TERMS } from "./riskPremiumPortfolio";
import {
  carryRollDown,
  curveShape,
  curveSlope,
  expectedSettlement,
  longCallExpectedPnl,
  optionPnlAtExpiry,
  optionPnlBeforeExpiry,
  shortFutureExpectedPnl,
  vxNetPnl,
  dailyInverseCompound,
  fillLoss,
  optionBreakeven,
  optionNetAtSettlement,
  recoveryGainNeeded,
  sharesForBudget,
  vixMonthlySigma,
  vxPnl,
  winRateExpectancy,
  CONTANGO_SHORT_LOSS,
  CURVE_EXAMPLES,
  EARLY_EXIT_EXAMPLE,
  EDGE_REQUIREMENTS,
  EV_CALL_EXAMPLE,
  EV_CALL_TEST,
  EV_CARRY,
  EV_MODEL,
  EV_OUTCOMES,
  EV_TAIL_MODEL,
  EV_TAIL_OUTCOMES,
  FORECAST_EXAMPLES,
  INVERSE_PATH,
  HALF_INVERSE_PATH,
  OPTION_EXAMPLES,
  RECOVERY_TABLE,
  SIZING_EXAMPLE,
  VIX_CASES,
  VIX_CASE_FACTS,
  VIX_CREDIBILITY,
  VIX_DRILLS,
  VIX_KEY_IDEAS,
  VIX_LINKS,
  VIX_PLAYBOOK_SOURCE,
  VIX_QUESTIONS,
  VIX_RELATED,
  VIX_SIGMA_LEVELS,
  VIX_TERMS,
  VIX_VERDICT,
  VRO_EXAMPLE,
  VX_EXAMPLES,
  VXM_MULTIPLIER,
  WIN_RATE_EXAMPLE,
} from "./vixTrading";

const wellFormed = (id: string, bars: OHLC[]) => {
  for (const b of bars) assert.ok(b.low <= Math.min(b.open, b.close) && b.high >= Math.max(b.open, b.close), `${id} ${b.name}`);
};

test("what VIX measures: VIX 20 is about a 5.7% one-sigma 30-day move", () => {
  assert.equal(Math.round(vixMonthlySigma(20) * 10) / 10, 5.7);
  assert.equal(Math.round(vixMonthlySigma(30) * 10) / 10, 8.6);
  assert.equal(VIX_SIGMA_LEVELS.find((r) => r.vix === 20)!.monthly, 5.7);
});

test("VX futures arithmetic: $1,000 a point, shorts reversed, minis one-tenth", () => {
  assert.deepEqual(VX_EXAMPLES.map((x) => vxPnl(x.entry, x.exit, x.side)), [5000, 4000, -15000]);
  assert.equal(vxPnl(20, 30, "short"), -10_000);
  assert.equal(vxPnl(16, 46, "short", 1, VXM_MULTIPLIER), -3000);
  assert.equal(vxPnl(20, 25, "long", 2), 10_000);
});

test("the curve: shapes, slope and contango that still loses", () => {
  assert.deepEqual(CURVE_EXAMPLES.map((c) => curveShape(c.prices)), ["contango", "backwardation", "flat", "hump"]);
  for (const c of CURVE_EXAMPLES) assert.equal(curveShape(c.prices), c.id, c.id);
  assert.equal(curveShape([20, 18, 22]), "mixed");
  assert.equal(Math.round(curveSlope(18, 20) * 10) / 10, 11.1);
  assert.equal(Math.round(curveSlope(35, 30) * 10) / 10, -14.3);
  assert.equal(CONTANGO_SHORT_LOSS.pnl, -6000);
  assert.ok(curveSlope(...CONTANGO_SHORT_LOSS.after) > 0, "still contango after the move");
});

test("right forecast, losing trade (and the reverse)", () => {
  assert.deepEqual(FORECAST_EXAMPLES.map((f) => f.pnl), [-5000, 2000, -2000]);
});

test("expected value vs price: the notes' exact numbers (hypothetical, before costs unless stated)", () => {
  // futures P/L with costs; VRO settlement example
  assert.equal(vxNetPnl(20, 18, "long"), -2000);
  assert.equal(VRO_EXAMPLE.pnl, -2000);
  assert.equal(vxNetPnl(20, 18, "short", 2, 50), 3950);
  assert.equal(vxNetPnl(20, 25, "long", 1, 10), 4990);
  // carry under an unchanged curve: 22 → 20 is −$2,000 long / +$2,000 short; backwardation flips it; flat is zero
  assert.deepEqual(carryRollDown([20, 22, 23]), [
    { from: 2, entry: 22, after: 20, long: -2000, short: 2000 },
    { from: 3, entry: 23, after: 22, long: -1000, short: 1000 },
  ]);
  assert.deepEqual(EV_CARRY.map((c) => [c.roll.long, c.roll.short]), [[-2000, 2000], [4000, -4000], [0, 0]]);
  // options at expiry, breakevens, early exit
  assert.equal(optionPnlAtExpiry("call", 20, 2, 21), -100);
  assert.equal(EV_CALL_EXAMPLE.pnl, -100);
  assert.equal(EV_CALL_EXAMPLE.cost, 200);
  assert.equal(EV_CALL_EXAMPLE.payout, 100);
  assert.equal(EV_CALL_EXAMPLE.breakeven, 22);
  assert.equal(EV_CALL_EXAMPLE.putBreakeven, 18);
  assert.equal(optionPnlAtExpiry("put", 20, 2, 15, 2, 20), 580);
  assert.equal(optionPnlBeforeExpiry(1.2, 2, 3, 15), 225);
  assert.equal(EARLY_EXIT_EXAMPLE.pnl, 225);
  assert.equal(optionPnlBeforeExpiry(3, 1, 1), -200);
  // the expected-value test
  assert.equal(expectedSettlement(EV_OUTCOMES), 18);
  assert.equal(shortFutureExpectedPnl(20, EV_OUTCOMES), 2000);
  assert.equal(EV_MODEL.expectedPnl, 2000);
  assert.deepEqual(EV_MODEL.rows.map((r) => r.pnl), [4000, -16000]);
  assert.equal(expectedSettlement(EV_TAIL_OUTCOMES), 21.4);
  assert.equal(shortFutureExpectedPnl(20, EV_TAIL_OUTCOMES), -1400);
  assert.equal(EV_TAIL_MODEL.expectedPnl, -1400);
  assert.deepEqual(EV_TAIL_MODEL.rows.map((r) => r.pnl), [4000, -50000]);
  // probability-weighted P/L equals the formula
  const weighted = EV_MODEL.rows.reduce((a, r) => a + r.p * r.pnl, 0);
  assert.equal(Math.round(weighted), EV_MODEL.expectedPnl);
  assert.equal(shortFutureExpectedPnl(20, EV_OUTCOMES, 2, 100), 3900);
  assert.equal(longCallExpectedPnl(20, 2, EV_OUTCOMES), -40);
  assert.equal(longCallExpectedPnl(20, 2, EV_TAIL_OUTCOMES), 300);
  assert.deepEqual([EV_CALL_TEST.base, EV_CALL_TEST.tail], [-40, 300]);
  assert.throws(() => expectedSettlement([{ label: "x", p: 0.5, settle: 16 }]), /sum to 1/);
  assert.throws(() => expectedSettlement([]), /sum to 1/);
  assert.deepEqual(EDGE_REQUIREMENTS.map((r) => r.id), ["distribution", "costs", "out-of-sample", "capital"]);
});

test("key ideas: the seven concepts, each pointing at a lesson panel", () => {
  assert.equal(VIX_KEY_IDEAS.length, 7);
  assert.deepEqual(VIX_KEY_IDEAS.map((k) => k.category), ["Definition", "Definition", "Fundamental", "Fundamental", "Principle", "Principle", "Risk principle"]);
  assert.match(VIX_KEY_IDEAS.map((k) => k.text).join(" "), /VIXY, SVIX and SVXY/);
});

test("VIX options: 25 call for 2.00 breaks even at 27, 25 put at 23", () => {
  assert.equal(optionBreakeven("call", 25, 2), 27);
  assert.equal(optionBreakeven("put", 25, 2), 23);
  assert.deepEqual(OPTION_EXAMPLES.map((o) => o.net), [300, -100, 300]);
  assert.equal(optionNetAtSettlement("call", 25, 2, 20), -200, "worst case is the premium");
});

test("daily inverse compounding: 100 → 120 → 100 loses about 6.67%", () => {
  assert.deepEqual(INVERSE_PATH, [100, 80, 93.33]);
  assert.deepEqual(HALF_INVERSE_PATH, [100, 90, 97.5]);
  const trend = dailyInverseCompound([100, 90, 81], -1);
  assert.ok(trend.at(-1)! > 120, "a steady favorable trend compounds the other way");
});

test("why continuous shorting fails: 95% winners that lose, recovery math, sizing and gaps", () => {
  assert.equal(WIN_RATE_EXAMPLE.winRate, 95);
  assert.equal(WIN_RATE_EXAMPLE.total, -1100);
  assert.equal(WIN_RATE_EXAMPLE.expectancy, -55);
  assert.deepEqual(winRateExpectancy([100, -50]).avgLoss, -50);
  assert.deepEqual(RECOVERY_TABLE.map((r) => r.gain), [25, 100, 400, 900]);
  assert.equal(recoveryGainNeeded(80), 400);
  assert.equal(sharesForBudget(100, 25, 23), 50);
  assert.equal(fillLoss(50, 25, 23), -100);
  assert.equal(SIZING_EXAMPLE.gapLoss, -500);
  assert.equal(SIZING_EXAMPLE.vxTenPoints, -10_000);
});

test("drills: every answer index resolves and matches the helpers", () => {
  assert.equal(VIX_DRILLS.length, 10);
  for (const d of VIX_DRILLS) assert.ok(d.answer >= 0 && d.answer < d.options.length, d.id);
  const pick = (id: string) => { const d = VIX_DRILLS.find((x) => x.id === id)!; return d.options[d.answer]; };
  assert.equal(pick("spot-falls-future-rises"), "−$5,000");
  assert.equal(pick("spot-rises-short-wins"), "+$2,000");
  assert.equal(pick("inverse-round-trip"), "$93.33");
  assert.equal(pick("gap-through-stop"), "−$500");
  assert.equal(pick("call-breakeven"), "−$100");
  assert.equal(pick("ev-short-future"), "+$2,000");
  assert.equal(pick("ev-tail-70"), "−$1,400");
  assert.match(pick("carry-stable-curve"), /^−\$2,000/);
});

test("the verdict is honest: legitimate, conditional edge, paper-trade or skip, not a signal", () => {
  const v = VIX_VERDICT.paragraphs.join(" ");
  assert.match(v, /legitimate/);
  assert.match(v, /New York Fed/);
  assert.match(v, /conditional/);
  assert.match(v, /wipe out an account/);
  assert.match(v, /paper-trade it first or skip it/);
  assert.match(v, /not a signal/);
});

test("Learn group vix-trading: 40 VIX- questions, glossary terms resolve, no duplicate terms", () => {
  assert.ok(QUIZ_GROUPS.some((g) => g.id === "vix-trading"));
  const qs = getQuestionsForGroup("vix-trading");
  assert.equal(qs, VIX_QUESTIONS);
  assert.equal(qs.length, 40);
  const answer = (id: string) => { const q = qs.find((x) => x.id === id)!; return q.options.find((o) => o.id === q.correctAnswer)!.label; };
  assert.equal(answer("VIX-27"), "−$2,000");
  assert.equal(answer("VIX-28"), "18");
  assert.equal(answer("VIX-29"), "+$2,000");
  assert.equal(answer("VIX-30"), "−$1,400");
  assert.equal(answer("VIX-31"), "+$3,900");
  assert.match(answer("VIX-33"), /^\+\$2,000/);
  assert.equal(answer("VIX-35"), "+$225");
  assert.equal(answer("VIX-36"), "−$40");
  assert.match(answer("VIX-39"), /^−\$16,000/);
  assert.match(answer("VIX-04"), /VIXY, SVIX and SVXY/);
  for (const q of qs) assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} has duplicate options`);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) {
    assert.match(q.id, /^VIX-\d{2}$/);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    assert.ok(q.glossaryTermId && getLiteracyTerm(q.glossaryTermId), `${q.id} ${q.glossaryTermId}`);
  }
  for (const t of VIX_TERMS) {
    assert.ok(getLiteracyTerm(t.id), t.id);
    assert.ok(!RPP_TERMS.some((r) => r.id === t.id), `${t.id} duplicates a risk-premium term`);
    assert.match(t.detail, /Educational, not advice\.$/);
  }
  assert.equal(new Set(LITERACY_TERMS.map((t) => t.id)).size, LITERACY_TERMS.length);
});

test("VIX cases: hypothetical, labelled SAMPLE, facts match the bars", () => {
  assert.equal(VIX_CASES.length, 5);
  assert.deepEqual(VIX_CASES.map((c) => c.correctActions[0]), ["buy", "hold", "buy", "hold", "sell"]);
  assert.deepEqual(VIX_CASES.map((c) => c.packId), ["futures", "futures", "futures", "macro-news", "macro-news"]);
  for (const k of VIX_CASES) {
    assert.ok(CASE_STUDIES.includes(k), k.id);
    assert.equal(k.thinkingMode, "vix_products");
    assert.deepEqual(k.postOhlc.slice(0, k.preOhlc.length), k.preOhlc);
    assert.ok(k.postOhlc.length > k.preOhlc.length);
    wellFormed(k.id, k.postOhlc);
    assert.match(k.brief, /SAMPLE hypothetical/);
  }
  const [spike, converge, streak, roundTrip, gap] = VIX_CASES;
  const F = VIX_CASE_FACTS;
  assert.equal(spike.preOhlc.at(-1)!.close, F.spike.decision);
  assert.equal(vxPnl(F.spike.entry, F.spike.decision, "short"), -3500);
  assert.equal(spike.postOhlc.at(-1)!.close, F.spike.heldTo);
  assert.equal(vxPnl(F.spike.entry, F.spike.heldTo, "short"), -5900);
  assert.equal(converge.preOhlc.at(-1)!.close, F.converge.decision);
  assert.equal(converge.postOhlc.at(-1)!.close, F.converge.settle);
  assert.equal(vxPnl(F.converge.entry, F.converge.settle, "short"), 2800);
  assert.equal(streak.preOhlc.at(-1)!.close, F.streak.decision);
  assert.equal(Math.max(...streak.postOhlc.map((b) => b.close)), F.streak.peak);
  assert.equal(vxPnl(F.streak.entry, F.streak.decision, "short", 1, VXM_MULTIPLIER), -550);
  assert.equal(vxPnl(F.streak.entry, F.streak.peak, "short", 1, VXM_MULTIPLIER) + F.streak.wins * 100, WIN_RATE_EXAMPLE.total);
  assert.equal(roundTrip.preOhlc.at(-2)!.close, F.roundTrip.afterDayOne);
  assert.equal(roundTrip.preOhlc.at(-1)!.close, INVERSE_PATH.at(-1));
  assert.equal(gap.preOhlc.at(-1)!.open, F.gap.open);
  assert.equal(fillLoss(F.gap.shares, F.gap.entry, F.gap.open), -500);
  assert.equal(Math.round(fillLoss(F.gap.shares, F.gap.entry, F.gap.decision)), -490);
});

test("coach, practice hub, links and the Playbook kit point at real surfaces", () => {
  const slugs = new Set(listSessions().map((s) => s.slug));
  assert.ok(slugs.has("vix-futures-curve"));
  assert.ok(MISC_PRACTICE_ITEMS.some((x) => x.id === "vix-trading" && x.to === "/practice/vix-trading"));
  const groups = new Set(QUIZ_GROUPS.map((g) => g.id as string));
  const packs = new Set(CASE_PACKS.map((p) => p.id as string));
  for (const l of [...VIX_LINKS, ...VIX_RELATED]) {
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
  assert.ok(RPP_LINKS.some((l) => l.to === "/practice/vix-trading"), "the risk-premium lesson links here");
  assert.ok(RPP_RELATED.some((l) => l.to === "/practice/vix-trading"), "the risk-premium kit links here");

  const p = getPlaybook("vix-curve-carry-paper")!;
  assert.ok(p);
  assert.equal(p.source.url, VIX_PLAYBOOK_SOURCE.url);
  assert.equal(classifySourceUrl(p.source.url), "webpage");
  assert.equal(p.video, undefined, "no video: the source is an article");
  assert.equal(p.assetClass, "future");
  assert.equal(p.coachSlug, "vix-futures-curve");
  assert.equal(p.caseId, "case-vix-short-future-spot-falls");
  assert.equal(p.related, VIX_RELATED);
  assert.match(p.explanation, /SAMPLE paper-trading kit/);
  assert.match(p.explanation, /Is VIX a valid play\?/);
  assert.match(p.explanation, /Warning: short volatility/);
  assert.equal(p.credibility, VIX_CREDIBILITY);
  const summary = VIX_CREDIBILITY.summary.join(" ");
  assert.match(summary, /not a strategy with a track record/);
  assert.match(summary, /VIX Trading for Beginners/);
  assert.match(summary, /A contango filter alone is not an edge/);
  const hosts = new Set(VIX_CREDIBILITY.sources.map((s) => new URL(s.url).hostname));
  for (const h of ["www.cboe.com", "www.newyorkfed.org", "libertystreeteconomics.newyorkfed.org", "www.investor.gov", "www.finra.org", "www.nfa.futures.org", "www.proshares.com", "www.volatilityshares.com"]) assert.ok(hosts.has(h), h);
  const backs = VIX_CREDIBILITY.sources.map((s) => s.supports).join(" | ");
  for (const idea of ["What the VIX measures", "Special Opening Quotation", "$1,000", "contango", "term premia", "path dependence", "ETN", "stop-limits", "can turn negative", "price off futures"]) assert.ok(backs.includes(idea), idea);
  assert.equal(VIX_CREDIBILITY.sources.length, 22);
  for (const s of VIX_CREDIBILITY.sources) assert.ok(!s.url.includes("utm_"), `${s.url} has a tracking parameter`);
  assert.match(summary, /model-implied/);
  assert.match(p.explanation, /Price the edge before you claim one/);
});

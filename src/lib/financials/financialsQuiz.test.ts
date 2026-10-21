import { test } from "node:test";
import assert from "node:assert/strict";
import { getLiteracyTerm } from "../literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS, type QuizQuestion } from "../quizData";
import { computeForecast, applyWhatIf } from "./cashForecast";
import { forecastById } from "./cashForecastFixtures";
import { companyById } from "./companies";
import { eventById } from "./earningsEvents";
import { generateReaction, EVENT_INDEX } from "./reactionCharts";
import {
  FINANCIALS_QUESTION_BANKS,
  FINANCIALS_QUIZ_GROUPS,
  epsLabel,
  money,
  num,
  pct,
  spct,
  usd,
  type FinancialsQuizGroupId,
} from "./quizBanks";

const FLOORS: Record<FinancialsQuizGroupId, number> = {
  "statements-reading": 12,
  "cash-forecast-13wk": 10,
  "earnings-preview": 10,
  "earnings-reaction": 10,
};
const ALL: QuizQuestion[] = Object.values(FINANCIALS_QUESTION_BANKS).flat();
const byId = (id: string) => {
  const q = ALL.find((x) => x.id === id);
  assert.ok(q, `missing ${id}`);
  return q;
};
const correctLabel = (id: string) => {
  const q = byId(id);
  return q.options.find((o) => o.id === q.correctAnswer)!.label;
};
const co = (id: string) => companyById(id)!;
const qt = (id: string, i: number) => co(id).quarters[i]!;
const fx = (id: string, w = {}) => computeForecast(applyWhatIf(forecastById(id)!, w));

test("group floors are met and the groups are wired into quizData", () => {
  for (const [g, floor] of Object.entries(FLOORS) as [FinancialsQuizGroupId, number][]) {
    assert.ok(FINANCIALS_QUESTION_BANKS[g].length >= floor, `${g} has ${FINANCIALS_QUESTION_BANKS[g].length} < ${floor}`);
    assert.equal(getQuestionsForGroup(g), FINANCIALS_QUESTION_BANKS[g]);
    assert.ok(QUIZ_GROUPS.some((x) => x.id === g), `${g} not in QUIZ_GROUPS`);
  }
  assert.equal(FINANCIALS_QUIZ_GROUPS.length, 4);
  const drills = QUIZ_GROUPS.findIndex((g) => g.id === "financial-drills");
  assert.deepEqual(
    QUIZ_GROUPS.slice(drills + 1, drills + 5).map((g) => g.id),
    FINANCIALS_QUIZ_GROUPS.map((g) => g.id),
    "featured right after financial-drills",
  );
});

test("ids are unique across every quiz group", () => {
  const seen = new Map<string, string>();
  for (const g of QUIZ_GROUPS) {
    for (const q of getQuestionsForGroup(g.id)) {
      const prev = seen.get(q.id);
      if (prev !== undefined && prev !== g.id) {
        // Pattern families legitimately share questions with "all"; financial ids must be unique.
        assert.ok(!q.id.startsWith("FIN-"), `${q.id} appears in ${prev} and ${g.id}`);
      }
      seen.set(q.id, g.id);
    }
  }
  assert.equal(new Set(ALL.map((q) => q.id)).size, ALL.length);
});

test("every question is well formed: 4 options, answer exists, labels distinct, glossary resolves", () => {
  for (const q of ALL) {
    assert.equal(q.options.length, 4, q.id);
    assert.deepEqual(q.options.map((o) => o.id), ["A", "B", "C", "D"], q.id);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), `${q.id} answer missing`);
    assert.equal(new Set(q.options.map((o) => o.label)).size, 4, `${q.id} duplicate labels: ${q.options.map((o) => o.label).join(" | ")}`);
    for (const o of q.options) assert.ok(o.label.trim() && o.description.trim(), `${q.id}.${o.id} empty`);
    for (const o of q.options.filter((x) => x.id !== q.correctAnswer)) assert.ok(o.feedback, `${q.id}.${o.id} wrong option needs feedback`);
    assert.ok(q.explanation.length > 20, q.id);
    assert.ok(q.glossaryTermId && getLiteracyTerm(q.glossaryTermId), `${q.id} glossary ${q.glossaryTermId}`);
    assert.ok(!/NaN|undefined|Infinity|n\/m/.test(q.prompt + q.options.map((o) => o.label).join()), `${q.id} has a bad number`);
  }
});

test("answer letters are balanced within each group", () => {
  for (const [g, qs] of Object.entries(FINANCIALS_QUESTION_BANKS)) {
    const counts: Record<string, number> = {};
    for (const q of qs) counts[q.correctAnswer] = (counts[q.correctAnswer] ?? 0) + 1;
    for (const l of ["A", "B", "C", "D"]) assert.ok((counts[l] ?? 0) >= 2, `${g}: ${l} correct only ${counts[l] ?? 0}×`);
    for (const n of Object.values(counts)) assert.ok(n <= Math.ceil(qs.length * 0.4), `${g} skewed ${JSON.stringify(counts)}`);
  }
});

test("exhibits resolve: companies, quarter ranges, forecasts, events, chart keys and highlight indices", () => {
  for (const q of ALL) {
    const x = q.financialsExhibit;
    assert.ok(x, `${q.id} has no exhibit`);
    if (x.kind === "statement") {
      const c = companyById(x.companyId);
      assert.ok(c, q.id);
      assert.ok(x.start >= 0 && x.count >= 1 && x.start + x.count <= c.quarters.length, `${q.id} range`);
      if (x.highlightColumn !== undefined) assert.ok(x.highlightColumn < x.count, `${q.id} highlight`);
    } else if (x.kind === "forecast") {
      assert.ok(forecastById(x.forecastId), q.id);
    } else {
      const e = eventById(x.eventId);
      assert.ok(e, q.id);
      if (x.kind === "reaction") {
        const shown = x.bars === "full" ? generateReaction(e).bars.length : EVENT_INDEX;
        const hi = x.highlightIndex ?? (x.bars === "full" ? EVENT_INDEX : 0);
        assert.ok(hi >= 0 && hi < shown, `${q.id} highlight ${hi} out of ${shown}`);
      }
    }
  }
  // Reaction group is chart based.
  for (const q of FINANCIALS_QUESTION_BANKS["earnings-reaction"]) assert.equal(q.financialsExhibit?.kind, "reaction", q.id);
});

test("preview questions that are about the upcoming print don't reveal actuals", () => {
  for (const id of ["FIN-EP-01", "FIN-EP-02", "FIN-EP-03", "FIN-EP-04", "FIN-EP-10", "FIN-EP-11"]) {
    const x = byId(id).financialsExhibit;
    assert.ok(x?.kind === "preview" && !x.revealActuals, id);
  }
});

/* ---------- numeric answers recomputed from raw fixture fields ---------- */

test("statements-reading answers recompute from the statements", () => {
  const n0 = qt("northwind-cloud", 0);
  assert.equal(correctLabel("FIN-ST-01"), pct(n0.income.grossProfit / n0.income.revenue));
  const n7 = qt("northwind-cloud", 7);
  assert.equal(correctLabel("FIN-ST-02"), pct((n7.income.revenue - n7.income.cogs - n7.income.rnd - n7.income.sga) / n7.income.revenue));
  assert.equal(correctLabel("FIN-ST-03"), money(n0.cashFlow.cfo + n0.cashFlow.capex));
  const i3 = qt("ironbridge-industrial", 3);
  assert.equal(correctLabel("FIN-ST-04"), `${(i3.income.operatingIncome / i3.income.interestExpense).toFixed(1)}×`);
  assert.equal(correctLabel("FIN-ST-05"), spct(qt("harbor-pine", 6).balance.inventory / qt("harbor-pine", 2).balance.inventory - 1));
  // Red flag: inventory growth beats revenue growth YoY; receivables stay tiny.
  const h6 = qt("harbor-pine", 6), h2 = qt("harbor-pine", 2);
  assert.ok(h6.balance.inventory / h2.balance.inventory - 1 > 5 * (h6.income.revenue / h2.income.revenue - 1));
  assert.ok(h6.balance.cash < h2.balance.cash);
  assert.match(correctLabel("FIN-ST-06"), /Inventory/);
  assert.equal(correctLabel("FIN-ST-07"), spct(qt("northwind-cloud", 4).income.sharesDiluted / qt("northwind-cloud", 3).income.sharesDiluted - 1));
  const n4 = qt("northwind-cloud", 4);
  assert.ok(n4.cashFlow.equityIssued > 0.9 * (n4.balance.cash - qt("northwind-cloud", 3).balance.cash));
  assert.equal(n4.cashFlow.debtIssued, 0);
  assert.equal(correctLabel("FIN-ST-08"), `Selling new shares (${money(n4.cashFlow.equityIssued)})`);
  const i7 = qt("ironbridge-industrial", 7);
  const nd = i7.balance.shortTermDebt + i7.balance.longTermDebt - i7.balance.cash;
  assert.equal(correctLabel("FIN-ST-09"), money(nd));
  const ttmEbitda = [4, 5, 6, 7].reduce((a, i) => {
    const x = qt("ironbridge-industrial", i);
    return a + x.income.operatingIncome + x.cashFlow.depreciation;
  }, 0);
  assert.equal(correctLabel("FIN-ST-10"), `${(nd / ttmEbitda).toFixed(1)}×`);
  assert.ok(nd / ttmEbitda < co("ironbridge-industrial").covenant!.maxNetLeverage);
  const n3 = qt("northwind-cloud", 3);
  const burn = -(n3.cashFlow.cfo + n3.cashFlow.capex) / 3;
  assert.equal(correctLabel("FIN-ST-11"), `${(n3.balance.cash / burn).toFixed(1)} mo`);
  assert.equal(correctLabel("FIN-ST-12"), `Year over year: ${spct(qt("harbor-pine", 4).income.revenue / qt("harbor-pine", 0).income.revenue - 1)}`);
  assert.equal(correctLabel("FIN-ST-13"), epsLabel(i7.income.epsDiluted));
});

test("cash-forecast answers recompute via cashForecast.ts", () => {
  const ibOff = fx("ironbridge-debt-service", { useRevolver: false });
  const first = ibOff.weeks.find((w) => w.ending < ibOff.input.minCash)!.week;
  assert.equal(correctLabel("FIN-CF-01"), `Week ${first}`);
  const low = Math.min(...ibOff.weeks.map((w) => w.ending));
  assert.equal(correctLabel("FIN-CF-02"), money(ibOff.input.minCash - low));
  assert.equal(fx("ironbridge-debt-service").peakRevolver, ibOff.input.minCash - low, "revolver draws exactly the shortfall");
  const hb = fx("harbor-collections-slip");
  assert.equal(correctLabel("FIN-CF-03"), money(Math.max(...hb.weeks.map((w) => w.revolverBalance))));
  const hbOff = fx("harbor-collections-slip", { useRevolver: false });
  const red = hbOff.weeks.filter((w) => w.ending < hbOff.input.minCash).map((w) => w.week);
  assert.equal(correctLabel("FIN-CF-04"), `${red.length} weeks (weeks ${red[0]}–${red[red.length - 1]})`);
  const hbDelay = fx("harbor-collections-slip", { delayCollections: true });
  assert.equal(correctLabel("FIN-CF-05"), money(Math.max(...hbDelay.weeks.map((w) => w.revolverBalance))));
  assert.ok(hbDelay.peakRevolver > hb.peakRevolver);
  const nw = fx("northwind-runway");
  assert.equal(correctLabel("FIN-CF-06"), `Week ${nw.weeks.find((w) => w.ending < nw.input.minCash)!.week}`);
  const nwDefer = fx("northwind-runway", { deferCapex: true });
  const nwLow = Math.min(...nwDefer.weeks.map((w) => w.ending));
  assert.ok(nwLow >= nwDefer.input.minCash);
  assert.equal(correctLabel("FIN-CF-07"), `Yes: the low week is ${money(nwLow)}, above the ${money(nwDefer.input.minCash)} minimum`);
  const l1 = fx("level1-replica");
  const down = l1.weeks.filter((w) => w.ending < w.beginning).map((w) => w.week);
  assert.equal(down.length, 1);
  assert.equal(correctLabel("FIN-CF-08"), `Week ${down[0]}`);
  const src = forecastById("level1-replica")!;
  const w1Out = Object.values(src.weeks[0]!.disbursements).reduce((a, b) => a + (b ?? 0), 0);
  const w1Other = src.weeks[0]!.receipts.otherReceipts ?? 0;
  assert.equal(correctLabel("FIN-CF-09"), num(src.beginningCash + w1Other - w1Out));
  const ibDefer = fx("ironbridge-debt-service", { deferCapex: true });
  assert.equal(ibDefer.peakRevolver, 0);
  assert.equal(correctLabel("FIN-CF-10"), `No: the low week is ${money(Math.min(...ibDefer.weeks.map((w) => w.ending)))}, above ${money(ibDefer.input.minCash)}`);
});

test("earnings-preview answers recompute from the events", () => {
  const e1 = eventById("nwcl-q2fy25")!;
  assert.equal(correctLabel("FIN-EP-01"), money((e1.expect.priorGuidance.low + e1.expect.priorGuidance.high) / 2));
  const m = e1.expect.impliedMovePct / 100;
  assert.equal(correctLabel("FIN-EP-02"), `${usd(e1.priorClose * (1 - m))}–${usd(e1.priorClose * (1 + m))}`);
  const hb = eventById("hbpn-q1fy26")!;
  assert.ok(hb.expect.whisperEps! > hb.expect.consensusEps);
  assert.match(correctLabel("FIN-EP-03"), new RegExp(`\\${usd(hb.expect.whisperEps!)}`));
  assert.ok(hb.expect.runUpPct > hb.expect.impliedMovePct, "run-up exceeds the implied move");
  const guide = (id: string) => {
    const e = eventById(id)!;
    return (e.newGuidance.low + e.newGuidance.high) / 2 / e.nextQuarterConsensusRevenue - 1;
  };
  assert.ok(guide("nwcl-q4fy26") > 0.01);
  assert.equal(correctLabel("FIN-EP-05"), `Raise: the midpoint is ${spct(guide("nwcl-q4fy26"))} vs the street`);
  assert.ok(guide("irbg-q1fy26") < -0.01);
  assert.equal(correctLabel("FIN-EP-06"), `Cut: the midpoint is ${spct(guide("irbg-q1fy26"))} vs the street`);
  const ns = eventById("nwcl-q4fy25")!;
  const q = qt(ns.companyId, ns.quarterIndex);
  assert.ok(Math.round((q.income.epsDiluted - ns.expect.consensusEps) * 100) >= 1, "EPS beat by ≥ 1¢");
  assert.match(correctLabel("FIN-EP-07"), /^Beat/);
  const rs = q.income.revenue / ns.expect.consensusRevenue - 1;
  assert.ok(Math.abs(rs) < 0.01);
  assert.equal(correctLabel("FIN-EP-08"), `In line: ${spct(rs, 2)} is inside ±1%`);
  const ib = eventById("irbg-q1fy26")!;
  const b2b = qt(ib.companyId, ib.quarterIndex).kpis.find((k) => k.id === "book-to-bill")!;
  assert.ok(b2b.value < 1);
  const im = eventById("irbg-q3fy25")!;
  assert.equal(correctLabel("FIN-EP-10"), usd((im.priorClose * im.expect.impliedMovePct) / 100));
  assert.ok(eventById("nwcl-q4fy26")!.expect.runUpPct < 0);
});

test("earnings-reaction answers recompute from the generated charts", () => {
  const archOf = (id: string) => {
    const x = byId(id).financialsExhibit!;
    assert.equal(x.kind, "reaction");
    return eventById((x as { eventId: string }).eventId)!.reaction;
  };
  const expectArch: Record<string, string> = {
    "FIN-ER-01": "gap-fill",
    "FIN-ER-02": "gap-and-go",
    "FIN-ER-03": "sell-the-news",
    "FIN-ER-04": "guidance-reversal",
    "FIN-ER-05": "pead-drift",
    "FIN-ER-06": "muted",
    "FIN-ER-09": "gap-fill",
    "FIN-ER-10": "pead-drift",
    "FIN-ER-11": "sell-the-news",
  };
  for (const [id, a] of Object.entries(expectArch)) assert.equal(archOf(id), a, id);
  const bars = (id: string) => generateReaction(eventById(id)!);
  const E = EVENT_INDEX;
  const a = bars("nwcl-q2fy25");
  const avg = a.bars.slice(E - 20, E).reduce((s, b) => s + b.volume!, 0) / 20;
  assert.equal(correctLabel("FIN-ER-07"), `${Math.round(a.bars[E]!.volume! / avg)}×`);
  const h3 = bars("hbpn-q3fy26");
  assert.equal(correctLabel("FIN-ER-08"), spct(h3.bars[E]!.open / h3.bars[E - 1]!.close - 1));
  const g = bars("irbg-q2fy26");
  const prior = g.bars[E - 1]!.close;
  assert.ok(g.bars[E]!.high < prior, "report bar does not fill");
  const fill = g.bars.findIndex((b, i) => i > E && b.high >= prior) - E;
  assert.equal(correctLabel("FIN-ER-09"), `${fill} session${fill === 1 ? "" : "s"}`);
  const r10 = (id: string) => {
    const c = bars(id);
    return c.bars[E + 10]!.close / c.bars[E]!.close - 1;
  };
  assert.ok(r10("nwcl-q4fy26") > 0 && r10("hbpn-q4fy26") < 0);
  assert.equal(correctLabel("FIN-ER-05"), `Kept drifting up: ${spct(r10("nwcl-q4fy26"))} after the report-day close`);
  assert.equal(correctLabel("FIN-ER-10"), `Kept falling: ${spct(r10("hbpn-q4fy26"))} after the report-day close`);
  const mu = bars("irbg-q3fy25");
  const mg = mu.bars[E]!.open / mu.bars[E - 1]!.close - 1;
  assert.ok(Math.abs(mg) < eventById("irbg-q3fy25")!.expect.impliedMovePct / 100);
  assert.equal(correctLabel("FIN-ER-06"), `Muted: the ${spct(mg)} open stayed inside the implied move`);
  const s = bars("nwcl-q4fy25").bars[E]!;
  assert.ok(s.open > bars("nwcl-q4fy25").bars[E - 1]!.close && s.close < s.open, "gap-up red report candle");
});

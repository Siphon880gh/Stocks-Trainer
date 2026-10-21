import { test } from "node:test";
import assert from "node:assert/strict";
import { MACRO_NUMERIC, MACRO_QUESTION_BANKS } from "./quiz/banks";
import { MACRO_QUIZ_GROUP_IDS } from "./quiz/groups";
import { QUIZ_GROUPS, getQuestionsForGroup, type QuizGroupId } from "../quizData";
import { getLiteracyTerm } from "../literacyTerms";
import { getRelease } from "./releases";
import { meetingByMonth, dotsFor } from "./fed";
import { WORLD } from "./world";
import { intradayChart } from "./reactionCharts";

const FLOORS: Record<string, number> = { "macro-releases": 14, "rates-curve": 12, "fed-policy": 12, "housing-mortgage": 10, "macro-reactions": 14 };
const all = Object.values(MACRO_QUESTION_BANKS).flat();

test("floors, registration, ≥ 60 questions", () => {
  assert.ok(all.length >= 60, `${all.length}`);
  for (const g of MACRO_QUIZ_GROUP_IDS) {
    assert.ok(MACRO_QUESTION_BANKS[g].length >= FLOORS[g]!, g);
    assert.ok(QUIZ_GROUPS.some((x) => x.id === g), `${g} registered`);
    assert.equal(getQuestionsForGroup(g as QuizGroupId).length, MACRO_QUESTION_BANKS[g].length);
  }
});

test("structure: ids unique across all banks, answer exists, distinct options, glossary + exhibits resolve", () => {
  const ids = QUIZ_GROUPS.flatMap((g) => (g.id === "all" ? [] : getQuestionsForGroup(g.id).map((q) => q.id)));
  for (const q of all) assert.equal(ids.filter((i) => i === q.id).length >= 1, true);
  assert.equal(new Set(all.map((q) => q.id)).size, all.length);
  for (const q of all) {
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} duplicate labels`);
    if (q.glossaryTermId) assert.ok(getLiteracyTerm(q.glossaryTermId), `${q.id} glossary ${q.glossaryTermId}`);
    assert.doesNotMatch(q.prompt + q.options.map((o) => o.label).join(" "), /NaN|undefined|Infinity/, q.id);
    const x = q.macroExhibit;
    if (!x) continue;
    if (x.kind === "release" || x.kind === "reaction") assert.ok(getRelease(x.eventId), q.id);
    if (x.kind === "reaction") assert.equal(intradayChart(getRelease(x.eventId)!, x.instrument).bars.length, 42);
    if (x.kind === "pricing" || x.kind === "dots") assert.ok(meetingByMonth(x.month), q.id);
    if (x.kind === "dots") assert.ok(dotsFor(meetingByMonth(x.month)!), q.id);
    if (x.kind === "curve") assert.ok(WORLD.days[x.day]);
    if (x.kind === "pmms") assert.ok(WORLD.weeks[x.week]);
  }
  assert.ok(MACRO_QUESTION_BANKS["macro-reactions"].every((q) => q.macroExhibit?.kind === "reaction"));
});

// Independent recomputation from raw world fields (no viewData helpers).
const r1 = (v: number) => Math.round(v * 10) / 10;
const ans = (id: string) => MACRO_NUMERIC[id];
test("numeric answers recomputed independently", () => {
  const p2 = getRelease("payrolls-02")!;
  const m = WORLD.months;
  const comb = m[p2.month - 1]!.payroll.secondPrint - m[p2.month - 1]!.payroll.firstPrint + (m[p2.month - 2]!.payroll.totalChange - m[p2.month - 2]!.payroll.secondPrint);
  assert.ok(ans("MR-02")!.replace("−", "-").startsWith(`${comb > 0 ? "+" : ""}${comb}`), ans("MR-02"));
  const h = m[p2.month]!.household;
  assert.equal(ans("MR-03"), `${r1((100 * h.unemployed) / h.laborForce).toFixed(1)}%`);
  assert.equal(ans("MR-04"), `${r1((100 * h.laborForce) / h.population).toFixed(1)}%`);
  const c = getRelease("cpi-17")!.month;
  const mom = r1((m[c]!.prices.all / m[c - 1]!.prices.all - 1) * 100);
  assert.equal(ans("MR-05")!.replace("−", "-"), `${mom.toFixed(1)}%`);
  const w = getRelease("claims-11")!.week!;
  assert.equal(ans("MR-08"), Math.round([0, 1, 2, 3].reduce((a, k) => a + WORLD.weeks[w - k]!.initialClaims, 0) / 4).toLocaleString("en-US"));
  const q = WORLD.quarters[getRelease("gdp-24")!.quarter!]!;
  assert.equal(ans("MR-09")!.replace("−", "-"), `${r1(q.contributions.consumption + q.contributions.investment + q.contributions.government + q.contributions.netExports).toFixed(1)}%`);
  assert.ok(ans("MR-14")!.includes(r1(p2.headline.surprise / p2.headline.stdev).toFixed(1)));
  const d = WORLD.days[300]!;
  assert.equal(Math.abs(Number(ans("RC-01")!.replace(/[^\d]/g, ""))), Math.abs(Math.round((d.y10 - d.y2) * 100)));
  const d2 = WORLD.days[150]!;
  assert.equal(ans("RC-05"), `${(Math.round((d2.y10 - d2.breakeven) * 100) / 100).toFixed(2)}%`);
  assert.equal(ans("RC-12"), "+15 bp");
  const mt = meetingByMonth(getRelease("fomc-38")!.month)!;
  assert.equal(ans("FP-01"), `${(mt.lowerBefore + 0.25).toFixed(2)}–${(mt.lowerBefore + 0.5).toFixed(2)}%`);
  assert.equal(ans("FP-02"), "+13.75 bp");
  assert.equal(ans("FP-13"), "0.50 percentage point");
  const dots = [...dotsFor(meetingByMonth(getRelease("fomc-40")!.month)!)![0]!.dots].sort((a, b) => a - b);
  assert.equal(Number(ans("FP-05")!.replace("%", "")), dots[9]);
  const pw = getRelease("pmms-36")!.week!;
  const W = WORLD.weeks;
  assert.equal(ans("HM-01"), `${(Math.round((W[pw]!.mortgage30 - W[pw]!.avg10y) * 100) / 100).toFixed(2)} points`);
  assert.equal(ans("HM-03"), `${W[pw - 1]!.mortgage30.toFixed(2)}%`);
  const hm = getRelease("housing-starts-34")!.month;
  const hpct = r1((m[hm]!.housing.starts / m[hm - 1]!.housing.starts - 1) * 100);
  assert.equal(ans("HM-06")!.replace("−", "-").replace("+", ""), `${hpct.toFixed(1)}%`);
  const wn = getRelease("pmms-37")!.week!;
  const pay = (rate: number) => { const r = rate / 1200; return (400000 * r) / (1 - (1 + r) ** -360); };
  const diff = Math.round(pay(W[wn]!.mortgage30) - pay(W[wn - 48]!.mortgage30));
  assert.equal(ans("HM-11"), `${diff >= 0 ? "+" : "−"}$${Math.abs(diff).toLocaleString("en-US")}`);
  assert.equal(Object.keys(MACRO_NUMERIC).length, 18);
});

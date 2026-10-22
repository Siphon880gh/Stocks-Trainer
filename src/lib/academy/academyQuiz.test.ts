import { test } from "node:test";
import assert from "node:assert/strict";
import { ACADEMY_NUMERIC, ACADEMY_QUESTION_BANKS, PNL_SCENARIOS, OPTION_Q_LEGS, sizeShares } from "./quiz/banks";
import { ACADEMY_QUIZ_GROUP_IDS, ACADEMY_QUIZ_GROUP_META } from "./quiz/groups";
import { QUIZ_GROUPS, getQuestionsForGroup, type QuizGroupId } from "../quizData";
import { getLiteracyTerm } from "../literacyTerms";
import { UNIT_QUIZ_ITEMS } from "./content/unitQuizzes";
import { OPTIONS_CHECKS } from "./options/checks";
import { bannedIn } from "./content/banned";
import type { Leg } from "./options/payoff";

const all = Object.values(ACADEMY_QUESTION_BANKS).flat();

test("≥ 60 questions, ≥ 20 per group, registered after the macro groups, served by getQuestionsForGroup", () => {
  assert.ok(all.length >= 60, `${all.length}`);
  const ids = QUIZ_GROUPS.map((g) => g.id);
  for (const g of ACADEMY_QUIZ_GROUP_IDS) {
    assert.ok(ACADEMY_QUESTION_BANKS[g].length >= 20, g);
    assert.ok(ids.includes(g), `${g} registered`);
    assert.ok(ids.indexOf(g) > ids.indexOf("macro-reactions" as QuizGroupId), `${g} after macro`);
    assert.equal(getQuestionsForGroup(g as QuizGroupId), ACADEMY_QUESTION_BANKS[g]);
    for (const q of ACADEMY_QUESTION_BANKS[g]) assert.ok(q.id.startsWith(ACADEMY_QUIZ_GROUP_META[g].prefix), q.id);
  }
});

test("ids unique across every Learn bank, unit quiz and options check; structure; glossary; wording", () => {
  const learn = QUIZ_GROUPS.flatMap((g) => (g.id === "all" ? [] : getQuestionsForGroup(g.id).map((q) => q.id)));
  const pool = [...new Set(learn), ...UNIT_QUIZ_ITEMS.map((q) => q.id), ...OPTIONS_CHECKS.map((q) => q.id)];
  for (const q of all) assert.equal(pool.filter((i) => i === q.id).length, 1, `${q.id} duplicated`);
  for (const q of all) {
    assert.equal(q.options.length, 4, q.id);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    assert.equal(new Set(q.options.map((o) => o.label)).size, 4, `${q.id} duplicate labels`);
    if (q.glossaryTermId) assert.ok(getLiteracyTerm(q.glossaryTermId), `${q.id} glossary ${q.glossaryTermId}`);
    const text = [q.prompt, q.explanation, ...q.options.map((o) => o.label)].join(" ");
    assert.doesNotMatch(text, /NaN|undefined|Infinity/, q.id);
    assert.deepEqual(bannedIn(text), [], q.id);
    assert.doesNotMatch(text, /\b(delta|gamma|theta|vega)\b|option chain/i, q.id);
  }
});

test("answer letters balanced (each letter 20–30%)", () => {
  const n: Record<string, number> = {};
  for (const q of all) n[q.correctAnswer] = (n[q.correctAnswer] ?? 0) + 1;
  for (const l of ["A", "B", "C", "D"]) assert.ok((n[l] ?? 0) / all.length >= 0.2 && (n[l] ?? 0) / all.length <= 0.3, `${l}: ${n[l]}`);
});

// ---- independent recomputation (plain arithmetic, no engine / payoff imports) ----
const right = (id: string) => {
  const q = all.find((x) => x.id === id)!;
  return q.options.find((o) => o.id === q.correctAnswer)!.label;
};
const $ = (x: number) => `${x < 0 ? "−" : ""}$${Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const s$ = (x: number) => (x > 0 ? `+${$(x)}` : $(x));

test("orders-and-fills: textbook fill rules recomputed by hand", () => {
  const expect: Record<string, string> = {
    "BA-OF-01": $(50.4), // market → open
    "BA-OF-02": $(49.5), // buy limit touched → limit
    "BA-OF-03": $(49.0), // gap below buy limit → open
    "BA-OF-04": "It does not fill on that bar",
    "BA-OF-05": $(52.0),
    "BA-OF-06": $(52.8),
    "BA-OF-07": $(51.0), // buy stop → stop
    "BA-OF-08": $(51.8), // gap through buy stop → open
    "BA-OF-09": $(48.0),
    "BA-OF-10": $(46.5), // gap through sell stop → open
    "BA-OF-11": "It does not fill on that bar", // stop-limit gap past limit
    "BA-OF-12": $(48.0),
    "BA-OF-13": "It does not fill on that bar",
    "BA-OF-14": $(Math.round(5400 * 0.95) / 100), // trail ratchets from the $54 peak
    "BA-OF-15": "It does not fill on that bar", // day order expired
    "BA-OF-16": $(49.0),
    "BA-OF-17": $(100 * 50 * 1.05),
    "BA-OF-18": $(100 * 48),
  };
  for (const [id, v] of Object.entries(expect)) {
    assert.equal(right(id), v, id);
    assert.equal(ACADEMY_NUMERIC[id], v, id);
  }
});

test("paper-pnl: recomputed by hand", () => {
  const expect: Record<string, string> = {
    "BA-PL-01": s$((43 - 40) * 100),
    "BA-PL-02": $((40 * 100 + 44 * 100) / 200),
    "BA-PL-03": s$((23 - 20) * 50),
    "BA-PL-04": s$((33 - 30) * 40),
    "BA-PL-05": s$((31 - 30) * 60),
    "BA-PL-06": $(10000 - 5000 + 100 * 47),
    "BA-PL-07": "−3.0%",
    "BA-PL-08": $(10000 - 100 * 50),
    "BA-PL-09": $(10600 - 9900),
    "BA-PL-10": `−${((700 / 10600) * 100).toFixed(1)}%`,
    "BA-PL-11": s$((24 - 25) * 200),
    "BA-PL-12": `${Math.floor(100 / 2)} shares`,
    "BA-PL-13": `${Math.floor(200 / 2.5)} shares`,
    "BA-PL-14": `${Math.floor(250 / 4)} shares`,
    "BA-PL-15": `${Math.floor(50 / 0.5)} shares`,
  };
  for (const [id, v] of Object.entries(expect)) assert.equal(right(id), v, id);
  assert.equal(sizeShares(10000, 1, 50, 48), 50);
  assert.ok(PNL_SCENARIOS.curve.length === 5);
});

test("options-ladder: textbook formulas recomputed by hand", () => {
  const expect: Record<string, string> = {
    "BA-OL-01": $(60 + 3),
    "BA-OL-02": s$((70 - 60 - 3) * 100),
    "BA-OL-03": s$(-3 * 100),
    "BA-OL-04": $(40 - 2),
    "BA-OL-05": $(40 - 2),
    "BA-OL-06": $(33 - 30 + 1),
    "BA-OL-07": $(30 - 1),
    "BA-OL-08": $(25 - 0.8),
    "BA-OL-09": $(2 - 0.7),
    "BA-OL-10": $(45 - 40 - 1.3),
    "BA-OL-11": $(40 + 1.3),
    "BA-OL-12": $(5 - (1.8 - 0.6)),
    "BA-OL-13": $(1.2 + 1.3 - 0.5 - 0.6),
    "BA-OL-14": `${$(95 - 1.4)} and ${$(105 + 1.4)}`,
    "BA-OL-15": $(50 - 45 + 1.5),
    "BA-OL-16": "Unlimited",
    "BA-OL-17": $(50 - 46 + (1 - 0.8)),
  };
  for (const [id, v] of Object.entries(expect)) assert.equal(right(id), v, id);
  const legs: Leg[] = OPTION_Q_LEGS.condor;
  assert.equal(legs.length, 4);
});

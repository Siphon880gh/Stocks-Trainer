import { test } from "node:test";
import assert from "node:assert/strict";
import { UNIT_QUIZ_ITEMS, quizForUnit } from "./unitQuizzes";
import { UNITS, getUnit } from "./levels";
import { bannedIn } from "./banned";
import { QUIZ_GROUPS, getQuestionsForGroup } from "../../quizData";
import { LITERACY_TERMS } from "../../literacyTerms";
import { LEVEL_IDS } from "../types";

/** Every question id that already exists in the app (quizData incl. the financials + macro banks). */
export function existingQuizIds(): Set<string> {
  const s = new Set<string>();
  for (const g of QUIZ_GROUPS) for (const q of getQuestionsForGroup(g.id)) s.add(q.id);
  return s;
}

test("3–5 items per unit, ids BA-<unit>-NN, unique within and across all banks", () => {
  for (const u of UNITS) {
    const qs = quizForUnit(u.id);
    assert.ok(qs.length >= 3 && qs.length <= 5, `${u.id}: ${qs.length}`);
    qs.forEach((q, i) => assert.equal(q.id, `BA-${u.id}-${String(i + 1).padStart(2, "0")}`));
  }
  const ids = UNIT_QUIZ_ITEMS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
  const existing = existingQuizIds();
  assert.ok(existing.size > 500, `sanity: existing banks loaded (${existing.size})`);
  for (const id of ids) assert.ok(!existing.has(id), `collides with an existing bank: ${id}`);
  for (const q of UNIT_QUIZ_ITEMS) assert.ok(getUnit(q.unitId), q.id);
});

test("answers exist in options; 4 options with unique labels; every wrong option has feedback", () => {
  for (const q of UNIT_QUIZ_ITEMS) {
    assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    assert.equal(q.options.length, 4, q.id);
    assert.deepEqual(q.options.map((o) => o.id), ["A", "B", "C", "D"]);
    assert.equal(new Set(q.options.map((o) => o.label)).size, 4, q.id);
    for (const o of q.options) if (o.id !== q.correctAnswer) assert.ok(o.feedback && o.feedback.length > 0, `${q.id} ${o.id}`);
    assert.deepEqual(bannedIn([q.prompt, q.explanation, ...q.options.flatMap((o) => [o.label, o.feedback ?? ""])].join(" ")), [], q.id);
  }
});

test("no answer letter above 35% within any level", () => {
  for (const lv of LEVEL_IDS) {
    const qs = UNIT_QUIZ_ITEMS.filter((q) => getUnit(q.unitId)!.levelId === lv);
    assert.ok(qs.length > 0, lv);
    for (const L of ["A", "B", "C", "D"]) {
      const share = qs.filter((q) => q.correctAnswer === L).length / qs.length;
      assert.ok(share <= 0.35, `${lv} ${L} ${share.toFixed(2)}`);
    }
  }
});

test("citation check: every cited fact is in the unit's cards and the explanation cites at least one", () => {
  for (const q of UNIT_QUIZ_ITEMS) {
    const u = getUnit(q.unitId)!;
    const cards = u.cards.map((c) => `${c.title} ${c.body}`).join(" ").toLowerCase();
    assert.ok(q.cites.length >= 1, q.id);
    for (const c of q.cites) assert.ok(cards.includes(c.toLowerCase()), `${q.id}: "${c}" not in ${u.id} cards`);
    assert.ok(q.cites.some((c) => q.explanation.toLowerCase().includes(c.toLowerCase())), `${q.id}: explanation cites none of ${q.cites.join(", ")}`);
  }
});

test("glossary ids on items resolve", () => {
  const terms = new Set(LITERACY_TERMS.map((t) => t.id));
  for (const q of UNIT_QUIZ_ITEMS) if (q.glossaryTermId) assert.ok(terms.has(q.glossaryTermId), `${q.id} ${q.glossaryTermId}`);
});

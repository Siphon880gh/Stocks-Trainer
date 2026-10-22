import { test } from "node:test";
import assert from "node:assert/strict";
import { NO_REPEAT_DAYS, pickReview, recordDaily, reviewOrder, todayPicks } from "./today";
import { emptyAcademy, type AcademyState } from "./storage";
import { UNIT_QUIZ_ITEMS } from "./content/unitQuizzes";
import { UNIT_ORDER } from "./content/levels";
import { addDays } from "./rewards/streak";

const TZ = "America/Los_Angeles";
const noon = (k: string) => new Date(`${k}T19:00:00Z`); // noon PDT / 11:00 PST
function mastered(ids: string[]): AcademyState {
  const s = emptyAcademy();
  ids.forEach((id, i) => (s.units[id] = { best: 3, total: 3, attempts: 1, lastAt: `2026-09-0${i + 1}T00:00:00.000Z`, masteredAt: `2026-09-0${i + 1}T00:00:00.000Z` }));
  return s;
}

test("same date + same state → same picks; different dates vary the term", () => {
  const s = mastered(UNIT_ORDER.slice(0, 3));
  const a = todayPicks(s, noon("2026-10-21"), TZ);
  const b = todayPicks(s, new Date("2026-10-21T23:59:00-07:00"), TZ);
  assert.deepEqual(a, b);
  const terms = new Set(Array.from({ length: 14 }, (_, i) => todayPicks(s, noon(addDays("2026-10-21", i)), TZ).term.id));
  assert.ok(terms.size > 3);
});

test("no mastered units → no review question; next unit is the first unit", () => {
  const p = todayPicks(emptyAcademy(), noon("2026-10-21"), TZ);
  assert.equal(p.review, null);
  assert.equal(p.nextUnitId, UNIT_ORDER[0]);
});

test("oldest-mastered unit first", () => {
  const s = mastered([UNIT_ORDER[4]!, UNIT_ORDER[1]!, UNIT_ORDER[2]!]);
  assert.equal(reviewOrder(s)[0], UNIT_ORDER[4]);
  assert.equal(pickReview(s, "2026-10-21")!.unitId, UNIT_ORDER[4]);
});

test("no repeat within 7 days when the pool allows (answering daily for 30 days)", () => {
  let s = mastered(UNIT_ORDER.slice(0, 5)); // 15 questions
  const shown: string[] = [];
  for (let i = 0; i < 30; i++) {
    const k = addDays("2026-10-01", i);
    const q = pickReview(s, k)!;
    assert.ok(!shown.slice(-NO_REPEAT_DAYS).includes(q.id), `${k} repeats ${q.id}`);
    shown.push(q.id);
    s = recordDaily(s, k, q.id, true);
  }
  assert.ok(new Set(shown).size >= 8);
});

test("small pool (one unit, 3 questions) still returns a question", () => {
  let s = mastered([UNIT_ORDER[0]!]);
  for (let i = 0; i < 10; i++) {
    const k = addDays("2026-10-01", i);
    const q = pickReview(s, k);
    assert.ok(q && UNIT_QUIZ_ITEMS.includes(q));
    s = recordDaily(s, k, q!.id, false);
  }
});

test("answered day keeps its question and ignores a second answer", () => {
  const s0 = mastered(UNIT_ORDER.slice(0, 3));
  const q = pickReview(s0, "2026-10-21")!;
  const s1 = recordDaily(s0, "2026-10-21", q.id, true);
  assert.equal(pickReview(s1, "2026-10-21")!.id, q.id);
  assert.equal(recordDaily(s1, "2026-10-21", "x", false), s1);
  assert.deepEqual(todayPicks(s1, noon("2026-10-21"), TZ).answered, { questionId: q.id, correct: true });
});

test("local date boundary: 23:30 PT on Oct 21 is still Oct 21 (UTC is Oct 22)", () => {
  assert.equal(todayPicks(emptyAcademy(), new Date("2026-10-22T06:30:00Z"), TZ).dateKey, "2026-10-21");
});

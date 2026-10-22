import { test } from "node:test";
import assert from "node:assert/strict";
import { MASTERY_THRESHOLD, optionsForAttempt, scoreUnit } from "./mastery";
import { quizForUnit } from "./content/unitQuizzes";
import { UNIT_QUIZ_ITEMS } from "./content/unitQuizzes";

const items = quizForUnit("l3-position-sizing");
const right = Object.fromEntries(items.map((q) => [q.id, q.correctAnswer]));

test("80% threshold: 3/3 masters, 2/3 does not; empty never masters", () => {
  assert.equal(MASTERY_THRESHOLD, 0.8);
  const all = scoreUnit(items, right);
  assert.deepEqual([all.correct, all.total, all.mastered], [3, 3, true]);
  const two = scoreUnit(items, { ...right, [items[0]!.id]: items[0]!.correctAnswer === "A" ? "B" : "A" });
  assert.deepEqual([two.correct, two.mastered], [2, false]);
  assert.equal(two.perItem[items[0]!.id], false);
  assert.equal(scoreUnit([], {}).mastered, false);
  // a synthetic 5-item quiz: 4/5 = 80% masters
  const five = [...items, ...quizForUnit("l3-trade-plan").slice(0, 2)];
  const ans = Object.fromEntries(five.map((q) => [q.id, q.correctAnswer]));
  ans[five[4]!.id] = five[4]!.correctAnswer === "A" ? "B" : "A";
  assert.equal(scoreUnit(five, ans).mastered, true);
});

test("unanswered items count as wrong", () => {
  assert.equal(scoreUnit(items, {}).correct, 0);
});

test("retry shuffle is deterministic, keeps the same option set and ids, attempt 0 is authored order", () => {
  let moved = 0;
  for (const q of UNIT_QUIZ_ITEMS) {
    assert.deepEqual(optionsForAttempt(q, 0), q.options);
    const a = optionsForAttempt(q, 1);
    assert.deepEqual(a, optionsForAttempt(q, 1));
    assert.deepEqual([...a].map((o) => o.id).sort(), ["A", "B", "C", "D"]);
    if (a.map((o) => o.id).join() !== "A,B,C,D") moved++;
  }
  assert.ok(moved > UNIT_QUIZ_ITEMS.length / 2, `most retries reorder (${moved})`);
});

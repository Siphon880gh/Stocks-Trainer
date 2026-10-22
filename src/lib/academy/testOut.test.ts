import { test } from "node:test";
import assert from "node:assert/strict";
import { TEST_OUT_LEVELS, TEST_OUT_PASS, TEST_OUT_SIZE, gradeTestOut, testOutItems } from "./testOut";
import { unitsForLevel } from "./content/levels";
import { emptyAcademy } from "./storage";
import { markTestedOut, unitStatus } from "./progress";
import type { AnswerLetter } from "./types";

const other = (c: AnswerLetter): AnswerLetter => (c === "A" ? "B" : "A");

test("each level draws 7 distinct items from its own units, covering every unit when it can, deterministically", () => {
  for (const lv of TEST_OUT_LEVELS) {
    const items = testOutItems(lv);
    assert.equal(items.length, TEST_OUT_SIZE, lv);
    assert.equal(new Set(items.map((q) => q.id)).size, items.length, lv);
    const units = unitsForLevel(lv).map((u) => u.id);
    for (const q of items) assert.ok(units.includes(q.unitId), `${lv}: ${q.id}`);
    if (units.length <= TEST_OUT_SIZE) for (const u of units) assert.ok(items.some((q) => q.unitId === u), `${lv} covers ${u}`);
    assert.deepEqual(testOutItems(lv).map((q) => q.id), items.map((q) => q.id));
  }
});

test("grading: 85% pass line (6/7 passes, 5/7 fails), weakest units listed most-missed first", () => {
  assert.equal(TEST_OUT_PASS, 0.85);
  const items = testOutItems("L3");
  const all = Object.fromEntries(items.map((q) => [q.id, q.correctAnswer]));
  assert.equal(gradeTestOut("L3", all).passed, true);
  const one = { ...all, [items[0]!.id]: other(items[0]!.correctAnswer) };
  const r6 = gradeTestOut("L3", one);
  assert.equal(r6.correct, 6);
  assert.equal(r6.passed, true);
  assert.deepEqual(r6.weakest, [items[0]!.unitId]);
  const two = { ...one, [items[1]!.id]: other(items[1]!.correctAnswer) };
  assert.equal(gradeTestOut("L3", two).passed, false);
  assert.equal(gradeTestOut("L3", {}).correct, 0);
});

test("a passed test-out marks the level's units tested out without mastering them", () => {
  const s = markTestedOut(emptyAcademy(), "L3", 7, 7);
  for (const u of unitsForLevel("L3")) assert.equal(unitStatus(s, u.id), "tested_out");
  assert.deepEqual(s.units, {});
});

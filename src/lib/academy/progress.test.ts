import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyAcademy } from "./storage";
import { isLevelComplete, isLevelUnlocked, levelPct, markTestedOut, nextUnit, recordUnitAttempt, unitStatus, coursePct, academySummary } from "./progress";
import { LEVELS, unitsForLevel } from "./content/levels";

const T = new Date("2026-10-21T10:00:00Z");

test("fresh learner: L0 unlocked, L1 locked, next unit is the first L0 unit", () => {
  const s = emptyAcademy();
  assert.ok(isLevelUnlocked(s, "L0"));
  assert.ok(!isLevelUnlocked(s, "L1"));
  assert.equal(unitStatus(s, "l0-what-is-a-market"), "available");
  assert.equal(unitStatus(s, "l1-what-is-a-share"), "locked");
  assert.equal(nextUnit(s), "l0-what-is-a-market");
  assert.equal(unitStatus(s, "nope"), "locked");
});

test("scripted learner walks L0 → L1", () => {
  let s = emptyAcademy();
  const l0 = unitsForLevel("L0");
  s = recordUnitAttempt(s, l0[0]!.id, 2, 3, T);
  assert.equal(unitStatus(s, l0[0]!.id), "in_progress");
  assert.equal(nextUnit(s), l0[0]!.id, "an unmastered unit is still next");
  for (const u of l0) s = recordUnitAttempt(s, u.id, 3, 3, T);
  assert.ok(isLevelComplete(s, "L0"));
  assert.equal(levelPct(s, "L0"), 1);
  assert.ok(isLevelUnlocked(s, "L1"));
  assert.equal(unitStatus(s, "l1-what-is-a-share"), "available");
  assert.equal(nextUnit(s), unitsForLevel("L1")[0]!.id);
  assert.ok(!isLevelUnlocked(s, "L2"));
  assert.equal(coursePct(s, "orientation"), 1);
  assert.equal(academySummary(s).unitsDone, l0.length);
});

test("a worse retry keeps the best score and mastery", () => {
  let s = recordUnitAttempt(emptyAcademy(), "l0-risk-first", 3, 3, T);
  const mAt = s.units["l0-risk-first"]!.masteredAt;
  s = recordUnitAttempt(s, "l0-risk-first", 1, 3, new Date("2026-10-22T10:00:00Z"));
  const r = s.units["l0-risk-first"]!;
  assert.deepEqual([r.best, r.total, r.attempts], [3, 3, 2]);
  assert.equal(r.masteredAt, mAt);
  assert.equal(unitStatus(s, "l0-risk-first"), "mastered");
  // a better retry raises the best
  let t = recordUnitAttempt(emptyAcademy(), "l0-risk-first", 1, 3, T);
  t = recordUnitAttempt(t, "l0-risk-first", 2, 3, T);
  assert.equal(t.units["l0-risk-first"]!.best, 2);
  assert.equal(t.units["l0-risk-first"]!.masteredAt, undefined);
});

test("test-out marks the level's units tested_out and unlocks what depends on it", () => {
  let s = markTestedOut(emptyAcademy(), "L0", 7, 8, T);
  for (const u of unitsForLevel("L0")) assert.equal(unitStatus(s, u.id), "tested_out");
  assert.ok(isLevelUnlocked(s, "L1"));
  const again = markTestedOut(s, "L0", 8, 8, T);
  assert.equal(again, s, "second test-out is a no-op");
  s = markTestedOut(s, "L1", 6, 7, T);
  // L4, L5, L7 need only L1
  for (const lv of ["L4", "L5", "L7"] as const) assert.ok(isLevelUnlocked(s, lv), lv);
  assert.ok(!isLevelUnlocked(s, "L6"), "options education needs L3");
});

test("placement credit: starting at L3 completes L0–L2 but not L3; skipping placement gives none", () => {
  const s = { ...emptyAcademy(), placement: { startLevel: "L3" as const, correct: 8, total: 12, skipped: false, at: T.toISOString() } };
  for (const lv of ["L0", "L1", "L2"] as const) assert.ok(isLevelComplete(s, lv), lv);
  assert.ok(!isLevelComplete(s, "L3"));
  assert.ok(isLevelUnlocked(s, "L3"));
  assert.equal(nextUnit(s), unitsForLevel("L3")[0]!.id);
  const sk = { ...s, placement: { ...s.placement, skipped: true } };
  assert.ok(!isLevelComplete(sk, "L0"));
});

test("nextUnit is null when everything is done", () => {
  let s = emptyAcademy();
  for (const l of LEVELS) s = markTestedOut(s, l.id, 8, 8, T);
  assert.equal(nextUnit(s), null);
});

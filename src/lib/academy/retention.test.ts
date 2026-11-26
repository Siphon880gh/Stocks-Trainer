import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyAcademy, migrateAcademy, memoryStorage, saveAcademy, loadAcademy } from "./storage";
import { UNIT_ORDER } from "./content/levels";
import { quizForUnit } from "./content/unitQuizzes";
import { recordUnitAttempt } from "./progress";
import {
  actualPace, behind, categoryRecency, daysAgo, diary, dueReviews, emptyRetention, forecast, getRetention, goalMet, logReviewAnswer, logUnitCheck,
  markDoneForToday, migrateRetention, reminderDelay, remainingUnits, setPace, staleCategories, todayCounts, weekly, UNIT_PATH,
} from "./retention";

const TZ = "America/Los_Angeles";
const at = (iso: string) => new Date(iso);
const U0 = UNIT_ORDER[0]!;
const qs = quizForUnit(U0);
const pass = (perItem: Record<string, boolean> = Object.fromEntries(qs.map((q) => [q.id, true]))) => {
  const correct = Object.values(perItem).filter(Boolean).length;
  return { correct, total: qs.length, mastered: correct / qs.length >= 0.8, perItem };
};

test("retention survives migrateAcademy and a storage round trip; junk falls back to defaults", () => {
  let s = logUnitCheck(emptyAcademy(), U0, pass(), at("2026-11-26T17:00:00Z"), TZ);
  const st = memoryStorage();
  saveAcademy(s, st);
  s = loadAcademy(st).state;
  assert.equal(getRetention(s).log.length, 1);
  assert.deepEqual(migrateRetention("nope"), emptyRetention());
  assert.equal(getRetention(migrateAcademy({ retention: { pace: { unitsPerDay: 999 } } })).pace.unitsPerDay, 50);
  assert.equal(migrateAcademy({}).retention, undefined);
});

test("a passed check logs one lesson; a failed one logs none and schedules the misses for tomorrow", () => {
  const now = at("2026-11-26T17:00:00Z");
  const ok = logUnitCheck(emptyAcademy(), U0, pass(), now, TZ);
  assert.deepEqual(todayCounts(ok, now, TZ), { units: 1, quizzes: 0 });
  const miss = Object.fromEntries(qs.map((q, i) => [q.id, i !== 0]));
  miss[qs[1]!.id] = false;
  const bad = logUnitCheck(emptyAcademy(), U0, pass(miss), now, TZ);
  assert.equal(todayCounts(bad, now, TZ).units, 0);
  assert.equal(Object.keys(getRetention(bad).review).length, 2);
  assert.equal(dueReviews(bad, now, TZ).length, 0);
  assert.equal(dueReviews(bad, at("2026-11-27T17:00:00Z"), TZ).length, 2);
});

test("review steps 1 → 3 → 7 days; an early correct answer does not advance; a miss resets", () => {
  const q = qs[0]!.id;
  let s = logReviewAnswer(emptyAcademy(), q, false, "review", at("2026-11-01T17:00:00Z"), TZ);
  assert.equal(getRetention(s).review[q]!.dueOn, "2026-11-02");
  s = logReviewAnswer(s, q, true, "review", at("2026-11-01T18:00:00Z"), TZ); // early
  assert.equal(getRetention(s).review[q]!.dueOn, "2026-11-02");
  s = logReviewAnswer(s, q, true, "review", at("2026-11-02T17:00:00Z"), TZ);
  assert.equal(getRetention(s).review[q]!.dueOn, "2026-11-05");
  s = logReviewAnswer(s, q, true, "review", at("2026-11-05T17:00:00Z"), TZ);
  assert.equal(getRetention(s).review[q]!.dueOn, "2026-11-12");
  s = logReviewAnswer(s, q, false, "daily", at("2026-11-12T17:00:00Z"), TZ);
  assert.equal(getRetention(s).review[q]!.step, 0);
  s = logReviewAnswer(s, q, true, "review", at("2026-11-13T17:00:00Z"), TZ);
  s = logReviewAnswer(s, q, true, "review", at("2026-11-16T17:00:00Z"), TZ);
  s = logReviewAnswer(s, q, true, "review", at("2026-11-23T17:00:00Z"), TZ);
  assert.equal(getRetention(s).review[q], undefined);
  assert.equal(todayCounts(s, at("2026-11-23T18:00:00Z"), TZ).quizzes, 1);
});

test("pace: goal met, done for today, behind note, real pace and forecast", () => {
  let s = setPace(emptyAcademy(), 1, 1, at("2026-11-20T17:00:00Z"), TZ);
  const now = at("2026-11-26T17:00:00Z");
  assert.deepEqual(behind(s, now, TZ), { owed: 6, days: 6 });
  s = logUnitCheck(s, U0, pass(), now, TZ);
  assert.equal(goalMet(s, now, TZ), false);
  s = logReviewAnswer(s, qs[0]!.id, true, "daily", now, TZ);
  assert.equal(goalMet(s, now, TZ), true);
  assert.equal(getRetention(markDoneForToday(s, now, TZ)).doneForToday, "2026-11-26");
  assert.equal(actualPace(s, now, TZ), null);
  assert.deepEqual(forecast(10, 2, now, TZ), { days: 5, date: "2026-12-01" });
  assert.equal(forecast(3, 0, now, TZ), null);
  assert.equal(remainingUnits(s), UNIT_ORDER.length, "the log alone does not master a unit");
  assert.equal(remainingUnits(recordUnitAttempt(s, U0, qs.length, qs.length, now)), UNIT_ORDER.length - 1);
});

test("days ago, level/course recency, stale levels and the diary (with legacy masteredAt backfill)", () => {
  const s = emptyAcademy();
  s.units[UNIT_ORDER[1]!] = { best: 3, total: 3, attempts: 1, lastAt: "2026-06-01T17:00:00.000Z", masteredAt: "2026-06-01T17:00:00.000Z" };
  const now = at("2026-11-25T17:00:00Z");
  assert.equal(daysAgo("2026-06-01T17:00:00.000Z", now, TZ).label, "177d");
  assert.equal(daysAgo("2026-11-25T08:00:00.000Z", now, TZ).label, "today");
  const s2 = logUnitCheck(s, U0, pass(), at("2026-11-24T17:00:00Z"), TZ);
  const rec = categoryRecency(s2, now, TZ);
  const [lv, course] = UNIT_PATH[U0]!;
  assert.equal(rec[lv]!.label, "1d");
  assert.ok(rec[`${lv} > ${course}`]!.done >= 1);
  const old = categoryRecency(s, now, TZ);
  assert.ok(staleCategories(old).some((x) => x.key === UNIT_PATH[UNIT_ORDER[1]!]![0]));
  const d = diary(s2);
  assert.equal(d[0]!.unitId, U0);
  assert.equal(d[1]!.source, "mastered");
  assert.deepEqual(d[0]!.path, [lv, course]);
});

test("weekly recap starts Monday; reminder delay targets the next 9:00", () => {
  const s = logUnitCheck(emptyAcademy(), U0, pass(), at("2026-11-23T17:00:00Z"), TZ); // Monday
  const w = weekly(s, at("2026-11-26T17:00:00Z"), TZ);
  assert.equal(w.monday, "2026-11-23");
  assert.equal(w.units, 1);
  const now = new Date(2026, 10, 26, 8, 0, 0);
  assert.equal(reminderDelay("09:00", now, null), 3600_000);
  assert.ok(reminderDelay("09:00", new Date(2026, 10, 26, 10, 0, 0), null) > 20 * 3600_000);
});

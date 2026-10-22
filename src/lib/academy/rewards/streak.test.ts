import { test } from "node:test";
import assert from "node:assert/strict";
import { FREEZE_EVERY, addDays, computeStreak, dayKey, daysBetween, recordActivity } from "./streak";

const LA = "America/Los_Angeles";

test("day keys follow the local calendar: LA vs UTC around midnight", () => {
  const t = new Date("2026-10-22T05:30:00Z"); // 22:30 PDT on the 21st
  assert.equal(dayKey(t, LA), "2026-10-21");
  assert.equal(dayKey(t, "UTC"), "2026-10-22");
});

test("DST: spring forward (Mar 8 2026) and fall back (Nov 1 2026) never skip or repeat a day", () => {
  assert.equal(addDays("2026-03-07", 1), "2026-03-08");
  assert.equal(addDays("2026-03-08", 1), "2026-03-09");
  assert.equal(addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(addDays("2026-11-01", 1), "2026-11-02");
  assert.equal(daysBetween("2026-03-07", "2026-03-10"), 3);
  // activity at 23:30 local on each night across the spring change: a 3-day streak
  let days: string[] = [];
  for (const iso of ["2026-03-07T07:30:00Z", "2026-03-08T06:30:00Z", "2026-03-09T06:30:00Z"]) days = recordActivity(days, new Date(iso), LA);
  assert.deepEqual(days, ["2026-03-06", "2026-03-07", "2026-03-08"]);
  assert.equal(computeStreak(days, new Date("2026-03-09T06:30:00Z"), LA).current, 3);
  // fall back: 25-hour day still one day
  let fb: string[] = [];
  for (const iso of ["2026-11-01T07:30:00Z", "2026-11-02T08:30:00Z"]) fb = recordActivity(fb, new Date(iso), LA);
  assert.deepEqual(fb, ["2026-11-01", "2026-11-02"]);
  assert.equal(computeStreak(fb, new Date("2026-11-02T08:30:00Z"), LA).current, 2);
});

test("missed day resets without a freeze; today not yet active keeps the streak", () => {
  const now = new Date("2026-10-21T19:00:00Z");
  assert.equal(computeStreak(["2026-10-19", "2026-10-20"], now, LA).current, 2);
  assert.equal(computeStreak(["2026-10-19", "2026-10-20"], now, LA).activeToday, false);
  assert.equal(computeStreak(["2026-10-18", "2026-10-19"], now, LA).current, 0, "missed the 20th");
  assert.equal(computeStreak(["2026-10-18", "2026-10-19"], now, LA).best, 2);
  assert.equal(computeStreak([], now, LA).current, 0);
  assert.equal(recordActivity(["2026-10-21"], now, LA).length, 1, "idempotent per day");
});

test("one freeze per 7 active days covers a single missed day; two missed days reset", () => {
  const week = Array.from({ length: FREEZE_EVERY }, (_, i) => addDays("2026-10-01", i)); // Oct 1–7
  const now = new Date("2026-10-09T19:00:00Z"); // Oct 9 LA
  const s = computeStreak([...week, "2026-10-09"], now, LA); // missed Oct 8
  assert.deepEqual(s.frozenDays, ["2026-10-08"]);
  assert.equal(s.current, 8);
  assert.equal(s.freezesAvailable, 0);
  const two = computeStreak([...week, "2026-10-10"], new Date("2026-10-10T19:00:00Z"), LA); // missed 8 and 9
  assert.equal(two.current, 1);
  const noFreeze = computeStreak(["2026-10-05", "2026-10-06", "2026-10-08"], new Date("2026-10-08T19:00:00Z"), LA);
  assert.equal(noFreeze.current, 1);
});

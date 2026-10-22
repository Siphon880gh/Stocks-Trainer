/**
 * Glue between Academy surfaces and the rewards store: award points, count the day toward the streak,
 * refresh badges, save. Every award is idempotent per key (ledger.ts).
 */
import type { LevelId } from "../types";
import type { UnitScore } from "../mastery";
import { loadRewards, saveRewards, type KVStorage, type RewardsState } from "../storage";
import { POINTS, award, unitMasteryPoints } from "./ledger";
import { recordActivity } from "./streak";
import { refreshBadges } from "./refresh";

export interface AwardOutcome {
  added: number;
  newBadges: string[];
  state: RewardsState;
}

function apply(storage: KVStorage | undefined, now: Date, fn: (s: RewardsState) => { state: RewardsState; added: number }, countsAsActivity = true): AwardOutcome {
  const before = loadRewards(storage).state;
  const r = fn(before);
  let s = r.state;
  if (countsAsActivity) s = { ...s, streak: { ...s.streak, days: recordActivity(s.streak.days, now) } };
  const b = refreshBadges(s, storage, now);
  saveRewards(b.state, storage, now);
  return { added: r.added, newBadges: b.added, state: b.state };
}

export const awardUnitMastery = (unitId: string, score: UnitScore, storage?: KVStorage, now = new Date()) =>
  apply(storage, now, (s) => (score.mastered ? award(s, `unit:${unitId}`, "unit-mastered", unitMasteryPoints(score.correct, score.total), now) : { state: s, added: 0 }));

export const awardTestOut = (levelId: LevelId, storage?: KVStorage, now = new Date()) => apply(storage, now, (s) => award(s, `test-out:${levelId}`, "test-out", POINTS.testOut, now));

export const awardChallenge = (challengeId: string, passed: boolean, storage?: KVStorage, now = new Date()) =>
  apply(storage, now, (s) => (passed ? award(s, `challenge:${challengeId}`, "challenge-passed", POINTS.challengePassed, now) : { state: s, added: 0 }));

export const awardFirstOrder = (storage?: KVStorage, now = new Date()) => apply(storage, now, (s) => award(s, "first-order", "first-order", POINTS.firstOrder, now));

export const awardDaily = (dateKey: string, storage?: KVStorage, now = new Date()) => apply(storage, now, (s) => award(s, `daily:${dateKey}`, "daily-goal", POINTS.dailyGoal, now));

export const awardOptionsLevel = (level: number, storage?: KVStorage, now = new Date()) => apply(storage, now, (s) => award(s, `options:L${level}`, "options-level", POINTS.optionsLevel, now));

/** Badges only (e.g. after a paper session updates its counters). Does not count as activity. */
export const refreshStoredBadges = (storage?: KVStorage, now = new Date()) => apply(storage, now, (s) => ({ state: s, added: 0 }), false);

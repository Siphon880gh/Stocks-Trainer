/**
 * BA7.M1: virtual points ledger. Append-only; one idempotency key per achievement.
 * Awarding a key again only adds the positive delta up to that key's cap (a better unit retry),
 * and never subtracts. There is deliberately no spend, redeem, transfer or cash-out function:
 * points are virtual, not redeemable, and unlock nothing outside the Academy.
 */
import type { PointsEvent, PointsSource } from "../types";
import type { RewardsState } from "../storage";

/** Point values (signed off at the BA7.M5 checkpoint). */
export const POINTS = {
  /** Unit mastered: up to 30, scaled by the best score (rounded). */
  unitMastered: 30,
  /** Level tested out: a single flat award, never per-unit mastery points. */
  testOut: 50,
  challengePassed: 40,
  firstOrder: 10,
  /** Today card: the daily review question answered correctly. */
  dailyGoal: 5,
  /** Today card: answered, but wrong (Weng 2026-10-22). Either answer counts toward the day streak. */
  dailyAttempt: 1,
  optionsLevel: 60,
  /** One-time catch-up for progress made before the Academy existed (rewards/retro.ts). */
  retroMax: 150,
} as const;

export const pointsForKey = (ledger: PointsEvent[], key: string) => ledger.filter((e) => e.key === key).reduce((a, e) => a + e.points, 0);
export const totalPoints = (ledger: PointsEvent[]) => ledger.reduce((a, e) => a + e.points, 0);

export function pointsBySource(ledger: PointsEvent[]): Record<PointsSource, number> {
  const out = { "unit-mastered": 0, "test-out": 0, "challenge-passed": 0, "first-order": 0, "daily-goal": 0, "options-level": 0, "retro-credit": 0 } as Record<PointsSource, number>;
  for (const e of ledger) out[e.source] += e.points;
  return out;
}

export interface AwardResult {
  state: RewardsState;
  /** Points added by this call (0 when the key was already fully awarded). */
  added: number;
}

/** Award up to `points` under `key`. Idempotent: the same key and value twice is a no-op. */
export function award(state: RewardsState, key: string, source: PointsSource, points: number, now = new Date(), note?: string): AwardResult {
  const target = Math.max(0, Math.round(points));
  const delta = target - pointsForKey(state.ledger, key);
  if (delta <= 0) return { state, added: 0 };
  const ev: PointsEvent = { key, source, points: delta, at: now.toISOString(), ...(note ? { note } : {}) };
  return { state: { ...state, ledger: [...state.ledger, ev] }, added: delta };
}

/** Unit mastery points: round(30 × best score share), only once mastered. */
export const unitMasteryPoints = (correct: number, total: number) => (total > 0 ? Math.round((POINTS.unitMastered * correct) / total) : 0);

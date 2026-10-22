/**
 * BA8.M2: options ladder gating (pure). Education only: this is not a broker's options approval.
 * - Level 1 is open; level n needs level n−1 passed.
 * - Before each level's check the learner ticks the risk acknowledgement.
 * - At most MAX_ATTEMPTS attempts per level in any rolling WINDOW_MS (24 h), with an injectable clock.
 */
import type { OptionsLadderRecord } from "../storage";
import type { LadderLevel } from "./ladder";

export const MAX_ATTEMPTS = 3;
export const WINDOW_MS = 24 * 60 * 60 * 1000;
export const LADDER: LadderLevel[] = [1, 2, 3, 4];

export const isOptionsLevelPassed = (r: OptionsLadderRecord, l: LadderLevel) => !!r.passed[String(l)];
export const isOptionsLevelUnlocked = (r: OptionsLadderRecord, l: LadderLevel) => l === 1 || isOptionsLevelPassed(r, (l - 1) as LadderLevel);

export type AttemptBlock = "locked" | "not-acknowledged" | "already-passed" | "too-many-attempts";

export function recentAttempts(r: OptionsLadderRecord, l: LadderLevel, now: Date): string[] {
  return (r.attempts[String(l)] ?? []).filter((t) => {
    const age = now.getTime() - new Date(t).getTime();
    return age >= 0 && age < WINDOW_MS;
  });
}

export function canAttempt(r: OptionsLadderRecord, l: LadderLevel, now: Date): { ok: boolean; reason?: AttemptBlock; remaining: number; nextAt?: string } {
  const recent = recentAttempts(r, l, now);
  const remaining = Math.max(0, MAX_ATTEMPTS - recent.length);
  if (!isOptionsLevelUnlocked(r, l)) return { ok: false, reason: "locked", remaining };
  if (isOptionsLevelPassed(r, l)) return { ok: false, reason: "already-passed", remaining };
  if (!r.acknowledged[String(l)]) return { ok: false, reason: "not-acknowledged", remaining };
  if (remaining === 0) {
    const oldest = recent.map((t) => new Date(t).getTime()).sort((a, b) => a - b)[0]!;
    return { ok: false, reason: "too-many-attempts", remaining, nextAt: new Date(oldest + WINDOW_MS).toISOString() };
  }
  return { ok: true, remaining };
}

export const acknowledge = (r: OptionsLadderRecord, l: LadderLevel, now: Date): OptionsLadderRecord => (r.acknowledged[String(l)] ? r : { ...r, acknowledged: { ...r.acknowledged, [String(l)]: now.toISOString() } });

export type AfterCheck = { kind: "passed" } | { kind: "retry"; remaining: number } | { kind: "blocked"; reason: AttemptBlock; nextAt?: string };

/**
 * What the check panel offers once a result is on screen. A failed check with attempts left
 * offers a retry; with none left it says why and when. (QA: the panel used to dead-end.)
 */
export function afterCheck(r: OptionsLadderRecord, l: LadderLevel, now: Date): AfterCheck {
  if (isOptionsLevelPassed(r, l)) return { kind: "passed" };
  const g = canAttempt(r, l, now);
  return g.ok ? { kind: "retry", remaining: g.remaining } : { kind: "blocked", reason: g.reason!, ...(g.nextAt ? { nextAt: g.nextAt } : {}) };
}

/** Records one attempt (only when allowed); a pass sets `passed` once. Returns the record unchanged when blocked. */
export function recordOptionsAttempt(r: OptionsLadderRecord, l: LadderLevel, passed: boolean, now: Date): OptionsLadderRecord {
  if (!canAttempt(r, l, now).ok) return r;
  const k = String(l);
  const next: OptionsLadderRecord = { ...r, attempts: { ...r.attempts, [k]: [...(r.attempts[k] ?? []), now.toISOString()] } };
  return passed ? { ...next, passed: { ...next.passed, [k]: now.toISOString() } } : next;
}

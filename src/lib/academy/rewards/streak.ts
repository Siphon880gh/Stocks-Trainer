/**
 * BA7.M2: daily learning streak on the local calendar day.
 * - Day keys are `YYYY-MM-DD` in a time zone (default: the device's), from an injectable clock.
 * - Day arithmetic uses the calendar dates themselves (UTC noon), so DST changes never skip or repeat a day.
 * - Freezes: every 7th consecutive active day earns one freeze (at most one banked). A single missed day is
 *   covered automatically by a banked freeze; otherwise a missed day resets the streak to 0.
 * - Today without activity yet does not break the streak (the day is not over).
 */

export function dayKey(now: Date, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const toUtcNoon = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return Date.UTC(y!, m! - 1, d!, 12);
};
export const addDays = (k: string, n: number) => new Date(toUtcNoon(k) + n * 86_400_000).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((toUtcNoon(b) - toUtcNoon(a)) / 86_400_000);

/** Adds today's key (sorted, unique). */
export function recordActivity(days: string[], now: Date, timeZone?: string): string[] {
  const k = dayKey(now, timeZone);
  return days.includes(k) ? days : [...days, k].sort();
}

export interface StreakSummary {
  current: number;
  best: number;
  freezesAvailable: number;
  /** Missed days that a freeze covered. */
  frozenDays: string[];
  activeToday: boolean;
}

export const FREEZE_EVERY = 7;
export const MAX_FREEZES = 1;

export function computeStreak(days: string[], now: Date, timeZone?: string): StreakSummary {
  const today = dayKey(now, timeZone);
  const active = new Set(days.filter((d) => d <= today));
  const sorted = [...active].sort();
  if (sorted.length === 0) return { current: 0, best: 0, freezesAvailable: 0, frozenDays: [], activeToday: false };
  let streak = 0;
  let best = 0;
  let run = 0;
  let freezes = 0;
  const frozen: string[] = [];
  for (let d = sorted[0]!; d <= today; d = addDays(d, 1)) {
    if (active.has(d)) {
      streak++;
      run++;
      if (run % FREEZE_EVERY === 0) freezes = Math.min(MAX_FREEZES, freezes + 1);
    } else if (d < today) {
      if (freezes > 0 && streak > 0) {
        freezes--;
        frozen.push(d);
      } else {
        streak = 0;
        run = 0;
      }
    }
    best = Math.max(best, streak);
  }
  return { current: streak, best, freezesAvailable: freezes, frozenDays: frozen, activeToday: active.has(today) };
}

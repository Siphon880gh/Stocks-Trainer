/**
 * BA9.M1: the "Today" daily-habit picks, from the local calendar date and the stored Academy state.
 * - Same date + same state → same picks (hash32 on the date key; no Math.random).
 * - Review question: from mastered units only, spaced: the unit reviewed least recently (or mastered
 *   earliest, if never reviewed) comes first; a question shown in the previous 7 days is skipped while
 *   the pool has others.
 * - Once today's question is answered, the stored question id is the pick (stable after answering).
 */
import type { AcademyState } from "./storage";
import type { LiteracyTerm } from "../literacyTerms";
import type { UnitQuizItem } from "./types";
import { UNIT_QUIZ_ITEMS } from "./content/unitQuizzes";
import { hash32 } from "./mastery";
import { nextUnit } from "./progress";
import { ACADEMY_TERMS } from "./terms";
import { challengeOfTheWeek, type Challenge } from "./challenges";
import { addDays, dayKey } from "./rewards/streak";

export const NO_REPEAT_DAYS = 7;

export interface TodayPicks {
  dateKey: string;
  nextUnitId: string | null;
  review: UnitQuizItem | null;
  answered: { questionId: string; correct: boolean } | null;
  term: LiteracyTerm;
  challenge: Challenge;
}

const byId = new Map(UNIT_QUIZ_ITEMS.map((q) => [q.id, q]));

/** Question ids shown on the `NO_REPEAT_DAYS` days before `dateKey`. */
export function recentQuestionIds(state: AcademyState, dateKey: string): Set<string> {
  const out = new Set<string>();
  for (let i = 1; i <= NO_REPEAT_DAYS; i++) {
    const d = state.daily[addDays(dateKey, -i)];
    if (d) out.add(d.questionId);
  }
  return out;
}

/** Mastered units, least recently reviewed (then earliest mastered, then id) first. */
export function reviewOrder(state: AcademyState): string[] {
  const lastReview = new Map<string, string>();
  for (const [day, d] of Object.entries(state.daily)) {
    const u = byId.get(d.questionId)?.unitId;
    if (u && (lastReview.get(u) ?? "") < day) lastReview.set(u, day);
  }
  return Object.entries(state.units)
    .filter(([, r]) => r.masteredAt)
    .map(([id, r]) => ({ id, key: lastReview.get(id) ?? "", at: r.masteredAt! }))
    .sort((a, b) => (a.key !== b.key ? (a.key < b.key ? -1 : 1) : a.at !== b.at ? (a.at < b.at ? -1 : 1) : a.id < b.id ? -1 : 1))
    .map((x) => x.id);
}

export function pickReview(state: AcademyState, dateKey: string): UnitQuizItem | null {
  const stored = state.daily[dateKey];
  if (stored && byId.has(stored.questionId)) return byId.get(stored.questionId)!;
  const order = reviewOrder(state).filter((u) => UNIT_QUIZ_ITEMS.some((q) => q.unitId === u));
  if (!order.length) return null;
  const recent = recentQuestionIds(state, dateKey);
  const h = hash32(`${dateKey}:review`);
  for (const u of order) {
    const fresh = UNIT_QUIZ_ITEMS.filter((q) => q.unitId === u && !recent.has(q.id));
    if (fresh.length) return fresh[h % fresh.length]!;
  }
  // Pool too small for 7 days without a repeat: fall back to the least recently reviewed unit.
  const all = UNIT_QUIZ_ITEMS.filter((q) => q.unitId === order[0]);
  return all[h % all.length]!;
}

export function pickTerm(dateKey: string): LiteracyTerm {
  return ACADEMY_TERMS[hash32(`${dateKey}:term`) % ACADEMY_TERMS.length]!;
}

export function todayPicks(state: AcademyState, now: Date, timeZone?: string): TodayPicks {
  const dateKey = dayKey(now, timeZone);
  return {
    dateKey,
    nextUnitId: nextUnit(state),
    review: pickReview(state, dateKey),
    answered: state.daily[dateKey] ?? null,
    term: pickTerm(dateKey),
    challenge: challengeOfTheWeek(now, timeZone),
  };
}

/** Records today's answer once; a second answer on the same day is ignored. */
export function recordDaily(state: AcademyState, dateKey: string, questionId: string, correct: boolean, now = new Date()): AcademyState {
  if (state.daily[dateKey]) return state;
  return { ...state, daily: { ...state.daily, [dateKey]: { questionId, correct } }, updatedAt: now.toISOString() };
}

/**
 * Learning retention for the Beginner Academy (weng/.agents/skills/learning-retention).
 * - Unit: one Academy unit. It completes when its check is passed at 80%+ (mastery), an explicit action, so there is no
 *   separate Mark complete button. Reading cards or scrolling never completes anything.
 * - The day streak, freezes, badges and ranks stay in the existing rewards system (rewards/streak.ts, badges.ts).
 * - Added here: pace (units and review questions per day), a gentle behind-pace note, forecasts, a 1/3/7-day review of
 *   missed check questions, opt-in reminders, a weekly recap, days-ago badges, level/course recency and the diary.
 * State lives in AcademyState.retention (analysis_core_academy_v1); migrateAcademy keeps and sanitises it.
 */
import type { AcademyState } from "./storage";
import { LEVELS, UNIT_ORDER, getUnit } from "./content/levels";
import { UNIT_QUIZ_ITEMS } from "./content/unitQuizzes";
import { isUnitDone } from "./progress";
import { addDays, dayKey, daysBetween } from "./rewards/streak";

export type LogKind = "lesson" | "quiz";
export interface RetentionLogEntry {
  unitId: string;
  at: string;
  kind: LogKind;
  source: "check" | "review" | "daily";
  /** 0..1 for a check; omitted for one review answer. */
  score?: number;
  questionId?: string;
}
export interface ReviewItem {
  unitId: string;
  dueOn: string;
  /** Index into REVIEW_STEPS reached so far (0 = due one day after the miss). */
  step: number;
  missedAt: string;
}
export interface RetentionState {
  pace: { unitsPerDay: number; quizzesPerDay: number; since: string | null };
  log: RetentionLogEntry[];
  review: Record<string, ReviewItem>;
  reminder: { enabled: boolean; time: string; permission: string | null; lastNotifiedOn: string | null };
  doneForToday: string | null;
}

/** Default pace: one unit and one review question a day (units are 5–10 minutes; the Today card asks one question). */
export const DEFAULT_PACE = { unitsPerDay: 1, quizzesPerDay: 1 } as const;
export const REVIEW_STEPS = [1, 3, 7] as const;
export const LOG_CAP = 5000;
export const STALE_DAYS = 14;

export const emptyRetention = (): RetentionState => ({
  pace: { ...DEFAULT_PACE, since: null },
  log: [],
  review: {},
  reminder: { enabled: false, time: "09:00", permission: null, lastNotifiedOn: null },
  doneForToday: null,
});

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const clampInt = (v: unknown, d: number, lo: number, hi: number) => (typeof v === "number" && Number.isFinite(v) ? Math.max(lo, Math.min(hi, Math.round(v))) : d);
const str = (v: unknown): string | null => (typeof v === "string" ? v : null);

/** Keeps every well-formed field; anything else falls back to the defaults. Never throws. */
export function migrateRetention(raw: unknown): RetentionState {
  const e = emptyRetention();
  if (!isObj(raw)) return e;
  const p = isObj(raw.pace) ? raw.pace : {};
  const rm = isObj(raw.reminder) ? raw.reminder : {};
  const log = (Array.isArray(raw.log) ? raw.log : []).filter(
    (x): x is RetentionLogEntry => isObj(x) && typeof x.unitId === "string" && typeof x.at === "string" && (x.kind === "lesson" || x.kind === "quiz"),
  );
  const review: Record<string, ReviewItem> = {};
  if (isObj(raw.review)) {
    for (const [k, v] of Object.entries(raw.review)) {
      if (isObj(v) && typeof v.unitId === "string" && typeof v.dueOn === "string") review[k] = { unitId: v.unitId, dueOn: v.dueOn, step: clampInt(v.step, 0, 0, REVIEW_STEPS.length), missedAt: str(v.missedAt) ?? v.dueOn };
    }
  }
  const time = str(rm.time);
  return {
    pace: { unitsPerDay: clampInt(p.unitsPerDay, DEFAULT_PACE.unitsPerDay, 0, 50), quizzesPerDay: clampInt(p.quizzesPerDay, DEFAULT_PACE.quizzesPerDay, 0, 50), since: str(p.since) },
    log: log.slice(-LOG_CAP),
    review,
    reminder: { enabled: rm.enabled === true, time: time && /^\d{2}:\d{2}$/.test(time) ? time : "09:00", permission: str(rm.permission), lastNotifiedOn: str(rm.lastNotifiedOn) },
    doneForToday: str(raw.doneForToday),
  };
}

export const getRetention = (s: AcademyState): RetentionState => migrateRetention(s.retention);
export const withRetention = (s: AcademyState, r: RetentionState, now = new Date()): AcademyState => ({
  ...s,
  retention: { ...r, log: r.log.slice(-LOG_CAP) } as unknown as Record<string, unknown>,
  updatedAt: now.toISOString(),
});

const quizById = new Map(UNIT_QUIZ_ITEMS.map((q) => [q.id, q]));

/** unit id → [level label, course title] */
export const UNIT_PATH: Record<string, [string, string]> = Object.fromEntries(
  LEVELS.flatMap((lv) => lv.courses.flatMap((c) => c.unitIds.map((u) => [u, [`${lv.id} · ${lv.title}`, c.title] as [string, string]]))),
);

// ---- completion ---------------------------------------------------------------------------------------------------

function applyReview(r: RetentionState, qid: string, unitId: string, correct: boolean, today: string, at: string): RetentionState {
  const cur = r.review[qid];
  const review = { ...r.review };
  if (!correct) review[qid] = { unitId, dueOn: addDays(today, REVIEW_STEPS[0]), step: 0, missedAt: at };
  else if (cur && cur.dueOn <= today) {
    const step = cur.step + 1;
    if (step >= REVIEW_STEPS.length) delete review[qid];
    else review[qid] = { ...cur, step, dueOn: addDays(today, REVIEW_STEPS[step]!) };
  }
  // an early correct answer (before it is due) does not advance the item
  return { ...r, review };
}

/**
 * A finished unit check. A pass (mastered) logs a completed lesson; every missed question is scheduled for review
 * 1 day out, and a due review question answered correctly moves on (1 → 3 → 7 days, then leaves the queue).
 */
export function logUnitCheck(s: AcademyState, unitId: string, score: { correct: number; total: number; mastered: boolean; perItem: Record<string, boolean> }, now = new Date(), timeZone?: string): AcademyState {
  const today = dayKey(now, timeZone);
  const at = now.toISOString();
  let r = getRetention(s);
  if (score.mastered) r = { ...r, log: [...r.log, { unitId, at, kind: "lesson", source: "check", score: score.total ? score.correct / score.total : 0 }] };
  for (const [qid, ok] of Object.entries(score.perItem)) r = applyReview(r, qid, unitId, ok, today, at);
  if (!r.pace.since) r = { ...r, pace: { ...r.pace, since: today } };
  return withRetention(s, r, now);
}

/** One review answer: the Today card question (source "daily") or a question from the review list. Counts as one quiz. */
export function logReviewAnswer(s: AcademyState, questionId: string, correct: boolean, source: "review" | "daily", now = new Date(), timeZone?: string): AcademyState {
  const q = quizById.get(questionId);
  if (!q) return s;
  const today = dayKey(now, timeZone);
  const at = now.toISOString();
  let r = getRetention(s);
  r = { ...r, log: [...r.log, { unitId: q.unitId, at, kind: "quiz", source, questionId, score: correct ? 1 : 0 }] };
  r = applyReview(r, questionId, q.unitId, correct, today, at);
  if (!r.pace.since) r = { ...r, pace: { ...r.pace, since: today } };
  return withRetention(s, r, now);
}

export function dueReviews(s: AcademyState, now = new Date(), timeZone?: string) {
  const today = dayKey(now, timeZone);
  return Object.entries(getRetention(s).review)
    .filter(([qid, it]) => it.dueOn <= today && quizById.has(qid))
    .sort((a, b) => (a[1].dueOn < b[1].dueOn ? -1 : a[1].dueOn > b[1].dueOn ? 1 : a[0] < b[0] ? -1 : 1))
    .map(([qid, it]) => ({ questionId: qid, item: it, question: quizById.get(qid)! }));
}

// ---- pace, behind, forecast ------------------------------------------------------------------------------------------

const localDay = (iso: string, timeZone?: string) => dayKey(new Date(iso), timeZone);

export function todayCounts(s: AcademyState, now = new Date(), timeZone?: string) {
  const today = dayKey(now, timeZone);
  const r = getRetention(s);
  let units = 0;
  let quizzes = 0;
  for (const e of r.log) {
    if (localDay(e.at, timeZone) !== today) continue;
    if (e.kind === "lesson") units++;
    else quizzes++;
  }
  return { units, quizzes };
}

export function goalMet(s: AcademyState, now = new Date(), timeZone?: string) {
  const r = getRetention(s);
  const c = todayCounts(s, now, timeZone);
  return c.units >= r.pace.unitsPerDay && c.quizzes >= r.pace.quizzesPerDay && r.pace.unitsPerDay + r.pace.quizzesPerDay > 0;
}

/** Units owed over the last full days (up to 7) since the pace was set; today does not count yet. */
export function behind(s: AcademyState, now = new Date(), timeZone?: string) {
  const r = getRetention(s);
  const today = dayKey(now, timeZone);
  if (!r.pace.since || r.pace.unitsPerDay <= 0) return { owed: 0, days: 0 };
  const days = Math.min(7, daysBetween(r.pace.since, today));
  if (days <= 0) return { owed: 0, days: 0 };
  const from = addDays(today, -days);
  const done = r.log.filter((e) => e.kind === "lesson" && localDay(e.at, timeZone) >= from && localDay(e.at, timeZone) < today).length;
  return { owed: Math.max(0, days * r.pace.unitsPerDay - done), days };
}

/** Units per active day over the trailing 14 days; null with fewer than 3 active days. Repeat passes are not counted. */
export function actualPace(s: AcademyState, now = new Date(), timeZone?: string): number | null {
  const r = getRetention(s);
  const today = dayKey(now, timeZone);
  const from = addDays(today, -13);
  const seen = new Set<string>();
  const firsts = r.log.filter((e) => e.kind === "lesson" && (seen.has(e.unitId) ? false : (seen.add(e.unitId), true)));
  const recent = firsts.filter((e) => localDay(e.at, timeZone) >= from);
  const activeDays = new Set(r.log.filter((e) => localDay(e.at, timeZone) >= from).map((e) => localDay(e.at, timeZone)));
  if (activeDays.size < 3) return null;
  return recent.length / 14;
}

export function remainingUnits(s: AcademyState, unitIds: readonly string[] = UNIT_ORDER) {
  return unitIds.filter((id) => !isUnitDone(s, id)).length;
}

/** Finish date for `remaining` units at `perDay` (the learner's real pace when known, else the set pace). */
export function forecast(remaining: number, perDay: number, now = new Date(), timeZone?: string): { days: number; date: string } | null {
  if (remaining <= 0) return { days: 0, date: dayKey(now, timeZone) };
  if (!(perDay > 0)) return null;
  const days = Math.ceil(remaining / perDay);
  return { days, date: addDays(dayKey(now, timeZone), days) };
}

// ---- days ago, recency, diary, weekly ---------------------------------------------------------------------------------

export function daysAgo(iso: string, now = new Date(), timeZone?: string) {
  const days = Math.max(0, daysBetween(localDay(iso, timeZone), dayKey(now, timeZone)));
  return { days, label: days === 0 ? "today" : `${days}d` };
}

/** When the unit was last completed: its latest logged pass, else mastery, else its level's test-out. */
export function lastCompletedAt(s: AcademyState, unitId: string): string | null {
  const r = getRetention(s);
  for (let i = r.log.length - 1; i >= 0; i--) if (r.log[i]!.unitId === unitId && r.log[i]!.kind === "lesson") return r.log[i]!.at;
  const m = s.units[unitId]?.masteredAt;
  if (m) return m;
  const u = getUnit(unitId);
  return (u && s.testedOut[u.levelId]?.at) || null;
}

export interface CategoryRecency { lastAt: string | null; days: number | null; label: string | null; done: number; total: number }

/** Every level ("L1 · Title") and course ("L1 · Title > Course"), with done/total and days since the latest completion. */
export function categoryRecency(s: AcademyState, now = new Date(), timeZone?: string): Record<string, CategoryRecency> {
  const out: Record<string, CategoryRecency> = {};
  const touch = (key: string, unitId: string) => {
    const row = (out[key] ??= { lastAt: null, days: null, label: null, done: 0, total: 0 });
    row.total++;
    if (isUnitDone(s, unitId)) row.done++;
    const at = lastCompletedAt(s, unitId);
    if (at && (!row.lastAt || at > row.lastAt)) row.lastAt = at;
  };
  for (const [unitId, [lv, course]] of Object.entries(UNIT_PATH)) {
    touch(lv, unitId);
    touch(`${lv} > ${course}`, unitId);
  }
  for (const row of Object.values(out)) {
    if (row.lastAt) {
      const a = daysAgo(row.lastAt, now, timeZone);
      row.days = a.days;
      row.label = a.label;
    }
  }
  return out;
}

/** Levels started but not finished and untouched for STALE_DAYS or more (oldest first). */
export function staleCategories(rec: Record<string, CategoryRecency>, minDays = STALE_DAYS) {
  return Object.entries(rec)
    .filter(([k, v]) => !k.includes(" > ") && v.done > 0 && v.done < v.total && (v.days ?? 0) >= minDays)
    .sort((a, b) => (b[1].days ?? 0) - (a[1].days ?? 0))
    .map(([key, v]) => ({ key, days: v.days ?? 0 }));
}

export interface DiaryEntry { unitId: string; title: string; at: string; path: string[]; source: "check" | "mastered" | "tested-out"; score?: number }

/** Every completed unit, newest first. Units mastered before the log existed are backfilled from masteredAt / test-outs. */
export function diary(s: AcademyState): DiaryEntry[] {
  const r = getRetention(s);
  const out: DiaryEntry[] = [];
  const logged = new Set<string>();
  for (const e of r.log) {
    if (e.kind !== "lesson") continue;
    logged.add(e.unitId);
    out.push({ unitId: e.unitId, title: getUnit(e.unitId)?.title ?? e.unitId, at: e.at, path: UNIT_PATH[e.unitId] ?? [], source: "check", score: e.score });
  }
  for (const id of UNIT_ORDER) {
    if (logged.has(id)) continue;
    const m = s.units[id]?.masteredAt;
    const u = getUnit(id)!;
    const t = s.testedOut[u.levelId]?.at;
    if (m) out.push({ unitId: id, title: u.title, at: m, path: UNIT_PATH[id] ?? [], source: "mastered" });
    else if (t) out.push({ unitId: id, title: u.title, at: t, path: UNIT_PATH[id] ?? [], source: "tested-out" });
  }
  return out.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}

/** This week (Monday start): units completed, review questions answered, active days. */
export function weekly(s: AcademyState, now = new Date(), timeZone?: string) {
  const today = dayKey(now, timeZone);
  const dow = (new Date(`${today}T12:00:00Z`).getUTCDay() + 6) % 7;
  const monday = addDays(today, -dow);
  const r = getRetention(s);
  const inWeek = r.log.filter((e) => localDay(e.at, timeZone) >= monday);
  return { monday, units: inWeek.filter((e) => e.kind === "lesson").length, quizzes: inWeek.filter((e) => e.kind === "quiz").length, activeDays: new Set(inWeek.map((e) => localDay(e.at, timeZone))).size };
}

// ---- settings and reminders -------------------------------------------------------------------------------------------

export function setPace(s: AcademyState, unitsPerDay: number, quizzesPerDay: number, now = new Date(), timeZone?: string): AcademyState {
  const r = getRetention(s);
  return withRetention(s, { ...r, pace: { unitsPerDay: clampInt(unitsPerDay, 1, 0, 50), quizzesPerDay: clampInt(quizzesPerDay, 1, 0, 50), since: dayKey(now, timeZone) } }, now);
}

export function markDoneForToday(s: AcademyState, now = new Date(), timeZone?: string): AcademyState {
  return withRetention(s, { ...getRetention(s), doneForToday: dayKey(now, timeZone) }, now);
}

export function setReminder(s: AcademyState, patch: Partial<RetentionState["reminder"]>, now = new Date()): AcademyState {
  const r = getRetention(s);
  return withRetention(s, { ...r, reminder: { ...r.reminder, ...patch } }, now);
}

/** Milliseconds until the next reminder (today at `time` if still ahead and not yet sent, else tomorrow). */
export function reminderDelay(time: string, now: Date, lastNotifiedOn: string | null, timeZone?: string): number {
  const [h, m] = time.split(":").map(Number);
  const at = new Date(now);
  at.setHours(h ?? 9, m ?? 0, 0, 0);
  if (at.getTime() <= now.getTime() || lastNotifiedOn === dayKey(now, timeZone)) at.setDate(at.getDate() + 1);
  return at.getTime() - now.getTime();
}

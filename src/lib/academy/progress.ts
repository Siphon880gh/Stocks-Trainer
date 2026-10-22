/**
 * BA2.M3: course progress. Pure functions over AcademyState (persisted by storage.ts).
 *
 * Rules:
 * - A level is complete when every unit is mastered, the level was tested out, or a placement started the
 *   learner above it (placement credit).
 * - A level is unlocked when every prerequisite level is complete. L0 is always unlocked.
 * - Every unit of an unlocked level is available; `nextUnit` suggests course-map order.
 * - A worse retry never lowers progress: the best score is kept and `masteredAt` is never removed.
 */
import { LEVEL_IDS, type LevelId } from "./types";
import { LEVELS, UNIT_ORDER, getUnit, unitsForLevel } from "./content/levels";
import { MASTERY_THRESHOLD } from "./mastery";
import type { AcademyState } from "./storage";

export type UnitStatus = "locked" | "available" | "in_progress" | "mastered" | "tested_out";

const levelIndex = (id: LevelId) => LEVEL_IDS.indexOf(id);

/** Levels below the placement start level count as complete (unless the learner skipped placement). */
export function placedPast(state: AcademyState, levelId: LevelId): boolean {
  const p = state.placement;
  return !!p && !p.skipped && levelIndex(levelId) < levelIndex(p.startLevel);
}

export const isUnitDone = (state: AcademyState, unitId: string) => {
  const u = getUnit(unitId);
  return !!state.units[unitId]?.masteredAt || (!!u && !!state.testedOut[u.levelId]);
};

export function isLevelComplete(state: AcademyState, levelId: LevelId): boolean {
  if (state.testedOut[levelId] || placedPast(state, levelId)) return true;
  return unitsForLevel(levelId).every((u) => !!state.units[u.id]?.masteredAt);
}

export function isLevelUnlocked(state: AcademyState, levelId: LevelId): boolean {
  const l = LEVELS.find((x) => x.id === levelId)!;
  return l.prerequisites.every((p) => isLevelComplete(state, p));
}

export function unitStatus(state: AcademyState, unitId: string): UnitStatus {
  const u = getUnit(unitId);
  if (!u) return "locked";
  const r = state.units[unitId];
  if (r?.masteredAt) return "mastered";
  if (state.testedOut[u.levelId]) return "tested_out";
  if (!isLevelUnlocked(state, u.levelId)) return "locked";
  return r && r.attempts > 0 ? "in_progress" : "available";
}

/** Share (0..1) of a course's / level's units that are mastered or tested out. */
export function coursePct(state: AcademyState, courseId: string): number {
  const c = LEVELS.flatMap((l) => l.courses).find((x) => x.id === courseId);
  if (!c || c.unitIds.length === 0) return 0;
  return c.unitIds.filter((id) => isUnitDone(state, id)).length / c.unitIds.length;
}

export function levelPct(state: AcademyState, levelId: LevelId): number {
  const us = unitsForLevel(levelId);
  return us.filter((u) => isUnitDone(state, u.id)).length / us.length;
}

/** The next unit to study in course-map order, skipping complete levels and locked ones; null when nothing is left. */
export function nextUnit(state: AcademyState): string | null {
  for (const id of UNIT_ORDER) {
    const u = getUnit(id)!;
    if (isLevelComplete(state, u.levelId)) continue;
    const s = unitStatus(state, id);
    if (s === "available" || s === "in_progress") return id;
  }
  return null;
}

/** Records one finished unit quiz. Best score kept; mastery is permanent once reached. */
export function recordUnitAttempt(state: AcademyState, unitId: string, correct: number, total: number, now = new Date()): AcademyState {
  const prev = state.units[unitId];
  const at = now.toISOString();
  const bestNow = !prev || correct / total > prev.best / prev.total ? { best: correct, total } : { best: prev.best, total: prev.total };
  const masteredNow = total > 0 && correct / total >= MASTERY_THRESHOLD;
  return {
    ...state,
    units: {
      ...state.units,
      [unitId]: {
        ...bestNow,
        attempts: (prev?.attempts ?? 0) + 1,
        lastAt: at,
        ...(prev?.masteredAt ? { masteredAt: prev.masteredAt } : masteredNow ? { masteredAt: at } : {}),
      },
    },
  };
}

export function markTestedOut(state: AcademyState, levelId: LevelId, correct: number, total: number, now = new Date()): AcademyState {
  if (state.testedOut[levelId]) return state;
  return { ...state, testedOut: { ...state.testedOut, [levelId]: { at: now.toISOString(), correct, total } } };
}

export function academySummary(state: AcademyState) {
  const done = UNIT_ORDER.filter((id) => isUnitDone(state, id)).length;
  const levelsComplete = LEVEL_IDS.filter((l) => isLevelComplete(state, l)).length;
  return { unitsDone: done, units: UNIT_ORDER.length, levelsComplete, levels: LEVEL_IDS.length };
}

/**
 * BA3.M2: per-level test-out quizzes for L1–L7. Each draws 7 items from the level's unit quizzes
 * (round-robin over units in course order, the item within a unit picked by a seeded hash of the level id),
 * so every unit is represented when the level has ≥ 7 units' worth of items. Pass ≥ 85% marks the level
 * tested out. A test-out is worth one test-out award only (rewards/ledger.ts), never unit mastery points.
 */
import type { AnswerLetter, LevelId, UnitQuizItem } from "./types";
import { unitsForLevel } from "./content/levels";
import { quizForUnit } from "./content/unitQuizzes";
import { hash32 } from "./mastery";

export const TEST_OUT_LEVELS: LevelId[] = ["L1", "L2", "L3", "L4", "L5", "L6", "L7"];
export const TEST_OUT_SIZE = 7;
export const TEST_OUT_PASS = 0.85;

export function testOutItems(levelId: LevelId): UnitQuizItem[] {
  const pools = unitsForLevel(levelId).map((u) => quizForUnit(u.id));
  const used = pools.map(() => new Set<number>());
  const out: UnitQuizItem[] = [];
  let round = 0;
  while (out.length < TEST_OUT_SIZE && round < 10) {
    for (let i = 0; i < pools.length && out.length < TEST_OUT_SIZE; i++) {
      const pool = pools[i]!;
      if (used[i]!.size >= pool.length) continue;
      let k = hash32(`${levelId}:${i}:${round}`) % pool.length;
      while (used[i]!.has(k)) k = (k + 1) % pool.length;
      used[i]!.add(k);
      out.push(pool[k]!);
    }
    round++;
  }
  return out;
}

export interface TestOutResult {
  levelId: LevelId;
  correct: number;
  total: number;
  passed: boolean;
  /** Units with a missed item, weakest (most missed) first. */
  weakest: string[];
}

export function gradeTestOut(levelId: LevelId, answers: Record<string, AnswerLetter | undefined>): TestOutResult {
  const items = testOutItems(levelId);
  const missed = new Map<string, number>();
  let correct = 0;
  for (const q of items) {
    if (answers[q.id] === q.correctAnswer) correct++;
    else missed.set(q.unitId, (missed.get(q.unitId) ?? 0) + 1);
  }
  const weakest = [...missed.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([u]) => u);
  return { levelId, correct, total: items.length, passed: correct / items.length >= TEST_OUT_PASS, weakest };
}

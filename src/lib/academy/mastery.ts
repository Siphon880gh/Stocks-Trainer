/**
 * BA2.M2: unit quiz scoring. Pure: no storage, no clock.
 * Mastery = at least 80% correct. Retries show the options in a deterministic shuffled order
 * (attempt 0 = authored order), so a retry is not just memorising letter positions.
 */
import type { AnswerLetter, QuizChoice, UnitQuizItem } from "./types";

export const MASTERY_THRESHOLD = 0.8;

export interface UnitScore {
  correct: number;
  total: number;
  /** 0..1 */
  pct: number;
  mastered: boolean;
  /** item id → answered correctly */
  perItem: Record<string, boolean>;
}

/** `answers` maps item id → the option id the learner picked (option ids are the authored letters). */
export function scoreUnit(items: UnitQuizItem[], answers: Record<string, AnswerLetter | undefined>): UnitScore {
  const perItem: Record<string, boolean> = {};
  let correct = 0;
  for (const q of items) {
    const ok = answers[q.id] === q.correctAnswer;
    perItem[q.id] = ok;
    if (ok) correct++;
  }
  const total = items.length;
  const pct = total === 0 ? 0 : correct / total;
  return { correct, total, pct, mastered: total > 0 && pct >= MASTERY_THRESHOLD, perItem };
}

/** FNV-1a 32-bit hash: small, deterministic, no dependency. */
export function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Deterministic PRNG (mulberry32) seeded from a string. */
export function seeded(seed: string): () => number {
  let a = hash32(seed);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Options in display order for a given attempt. Ids stay the authored ids, so scoring is unaffected. */
export function optionsForAttempt(item: UnitQuizItem, attempt: number): QuizChoice[] {
  const opts = [...item.options];
  if (attempt <= 0) return opts;
  const rnd = seeded(`${item.id}#${attempt}`);
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [opts[i], opts[j]] = [opts[j]!, opts[i]!];
  }
  return opts;
}

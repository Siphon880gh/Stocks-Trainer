/** Reading-time estimate for a unit: cards + quiz text at 200 words per minute, rounded up. */
import type { Unit } from "../types";
import { quizForUnit } from "./unitQuizzes";

export const WORDS_PER_MINUTE = 200;
export const MAX_CARD_WORDS = 120;
export const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function unitWords(u: Unit): number {
  const cards = u.cards.reduce((a, c) => a + wordCount(c.title) + wordCount(c.body), 0);
  const quiz = quizForUnit(u.id).reduce((a, q) => a + wordCount(q.prompt) + q.options.reduce((b, o) => b + wordCount(o.label), 0), 0);
  return cards + quiz;
}

export const estMinutes = (u: Unit) => Math.max(1, Math.ceil(unitWords(u) / WORDS_PER_MINUTE));

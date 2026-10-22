/** Builds unit quiz items from compact authoring tuples, rotating the correct letter A→D per level. */
import type { AnswerLetter, QuizChoice, UnitQuizItem } from "../types";

export interface RawItem {
  /** prompt */
  p: string;
  /** right answer */
  r: string;
  /** three wrong answers with feedback */
  w: [string, string][];
  /** explanation (must mention ≥ 1 of the cites) */
  e: string;
  /** words that appear in the unit's cards */
  c: string[];
  g?: string;
}

const LETTERS: AnswerLetter[] = ["A", "B", "C", "D"];

/** `counter` is shared per level so letters rotate across a level's units. */
export function buildUnitItems(unitId: string, raws: RawItem[], counter: { n: number }): UnitQuizItem[] {
  return raws.map((raw, i) => {
    const at = counter.n++ % LETTERS.length;
    const wrong: QuizChoice[] = raw.w.map(([label, feedback]) => ({ id: "A", label, feedback }));
    const ordered = [...wrong];
    ordered.splice(at, 0, { id: "A", label: raw.r });
    const options = ordered.map((o, k) => ({ ...o, id: LETTERS[k]! }));
    return {
      id: `BA-${unitId}-${String(i + 1).padStart(2, "0")}`,
      unitId,
      prompt: raw.p,
      options,
      correctAnswer: LETTERS[at]!,
      explanation: raw.e,
      cites: raw.c,
      ...(raw.g ? { glossaryTermId: raw.g } : {}),
    };
  });
}

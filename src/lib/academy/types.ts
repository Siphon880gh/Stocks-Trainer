/**
 * Beginner Academy (BA0.M1): shared types for the course map, lessons, quizzes, placement and rewards.
 * Everything in the Academy is educational and SIMULATED: virtual money, SAMPLE prices, virtual points.
 */

/** Level ids in course-map order. L0 Orientation … L7 Other markets. */
export const LEVEL_IDS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"] as const;
export type LevelId = (typeof LEVEL_IDS)[number];

/**
 * A typed link into content that already exists in the app. Authored as a short string
 * (`quiz:candle-reading`, `glossary:trailing-stop`, `coach:trailing-stop-exit`, `practice:/practice/plan`,
 * `case:case-earn-beat-miss`, `macro:cpi`, `route:/macro/play`) and parsed by `parseRef` in refs.ts.
 */
export type ContentRef =
  | { kind: "quiz"; groupId: string }
  | { kind: "glossary"; termId: string }
  | { kind: "coach"; slug: string }
  | { kind: "practice"; route: string }
  | { kind: "case"; caseId: string }
  | { kind: "macro"; lessonId: string }
  | { kind: "route"; path: string };

export type ContentRefKind = ContentRef["kind"];
export const CONTENT_REF_KINDS: readonly ContentRefKind[] = ["quiz", "glossary", "coach", "practice", "case", "macro", "route"];

/** String form used in content files. */
export type RefString = `${ContentRefKind}:${string}`;

export interface LessonCard {
  title: string;
  /** Plain sentence-case English, at most 120 words. */
  body: string;
  /** Optional glossary chip under the card (an Archive literacy term id). */
  glossaryTermId?: string;
}

export interface Unit {
  id: string;
  levelId: LevelId;
  courseId: string;
  title: string;
  /** One sentence: what the learner can do after this unit. */
  objective: string;
  /** 3–6 lesson cards. */
  cards: LessonCard[];
  /** ≥ 1 link into existing app content (practice it there). */
  refs: RefString[];
}

export interface Course {
  id: string;
  levelId: LevelId;
  title: string;
  summary: string;
  /** Ordered unit ids. */
  unitIds: string[];
}

export interface Level {
  id: LevelId;
  title: string;
  summary: string;
  /** Levels that must be mastered or tested out first (always earlier levels: the map is a DAG). */
  prerequisites: LevelId[];
  courses: Course[];
}

export type AnswerLetter = "A" | "B" | "C" | "D" | "E";

export interface QuizChoice {
  id: AnswerLetter;
  label: string;
  /** Shown after a wrong pick of this option. */
  feedback?: string;
}

export interface UnitQuizItem {
  /** `BA-<unitId>-NN` for unit quizzes, `BA-PLC-NN` for placement, `BA-OPT-L<n>-NN` for options checks. */
  id: string;
  unitId: string;
  prompt: string;
  options: QuizChoice[];
  correctAnswer: AnswerLetter;
  explanation: string;
  /** Words that must appear in the unit's cards: the explanation cites a fact the unit taught. */
  cites: string[];
  glossaryTermId?: string;
}

export interface PlacementItem {
  id: string;
  /** The level this item probes. */
  levelId: LevelId;
  /** The unit to review when this item is missed. */
  unitId: string;
  prompt: string;
  options: QuizChoice[];
  correctAnswer: AnswerLetter;
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  /** Material Symbols icon name. */
  icon: string;
  /** Shown while locked: how to earn it (never the predicate code). */
  hint: string;
}

export type PointsSource = "unit-mastered" | "test-out" | "challenge-passed" | "first-order" | "daily-goal" | "options-level" | "retro-credit";

/** One append-only entry in the virtual points ledger. Points are virtual and never redeemable. */
export interface PointsEvent {
  /** Idempotency key: the same key is never awarded twice (retries award only the delta under `key`). */
  key: string;
  source: PointsSource;
  points: number;
  at: string;
  note?: string;
}

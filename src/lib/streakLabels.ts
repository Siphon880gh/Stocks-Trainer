/**
 * Two different streaks, two names (Weng 2026-10-22). Labels only; the counting logic is unchanged.
 * - Answer streak: Training quiz answers right in a row (progress `streaks.current`), shown on Home / Training.
 * - Day streak: local calendar days in a row with Academy activity (rewards `streak.days`), shown in the Academy.
 */
export const ANSWER_STREAK_LABEL = "Answer streak";
export const ANSWER_STREAK_TIP = "Training quiz answers right in a row. A wrong answer resets it to 0.";
export const DAY_STREAK_LABEL = "Day streak";
export const DAY_STREAK_TIP =
  "Days in a row with Academy activity: finishing a unit, a test-out, a challenge, an options level or the Today question. A banked freeze covers one missed day.";

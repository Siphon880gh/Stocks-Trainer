/** Learn quiz groups owned by the macro project (questions live beside this file; registered in quizData.ts). */
export const MACRO_QUIZ_GROUP_IDS = ["macro-releases", "rates-curve", "fed-policy", "housing-mortgage", "macro-reactions"] as const;
export type MacroQuizGroupId = (typeof MACRO_QUIZ_GROUP_IDS)[number];

export const MACRO_QUIZ_GROUP_META: Record<MacroQuizGroupId, { label: string; description: string }> = {
  "macro-releases": { label: "Reading Macro Releases", description: "Jobs, inflation and growth reports: which line matters, revisions, month-over-month vs year-over-year." },
  "rates-curve": { label: "Rates & the Yield Curve", description: "2-year vs 10-year, curve inversion, real yields and breakevens, the dollar." },
  "fed-policy": { label: "Fed Policy & Pricing", description: "Target range, statements, dot plots, and why priced-in decisions barely move markets." },
  "housing-mortgage": { label: "Housing & Mortgage Rates", description: "Mortgage rates vs the 10-year, the mortgage spread, housing starts, and rate-sensitive sectors." },
  "macro-reactions": { label: "Macro Market Reactions", description: "Read the reaction chart: regimes, follow-through, reversals and muted moves." },
};

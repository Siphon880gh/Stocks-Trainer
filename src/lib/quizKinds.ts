import { QUIZ_GROUPS, type QuizGroup, type QuizGroupId } from "./quizData";

/**
 * Named candle and chart shapes. Everything else in the quiz list is a concept check
 * (literacy, statements, indicators, risk, and how a single candle is built).
 */
const PATTERN_QUIZ_IDS = new Set<string>(
  `candle-pattern-book all hammer engulfing bullish-engulfing bearish-engulfing shooting-star inverted-hammer morning-star tweezer-bottom rising-wedge bull-flag double-top double-bottom triangle hanging-man evening-star piercing-line dark-cloud-cover three-white-soldiers three-black-crows harami tweezer-top falling-wedge head-shoulders three-inside-outside counterattack-on-neck continuation-methods gap-reversals crows-and-strikes advanced-rare japanese-candles marubozu doji essential-candles crypto-candles chart-patterns reversal-charts pattern-themes which-way buy-or-sell`.split(
    " ",
  ),
);

export const isPatternQuiz = (id: string) => PATTERN_QUIZ_IDS.has(id);

export const patternQuizGroups = (): QuizGroup[] => QUIZ_GROUPS.filter((g) => isPatternQuiz(g.id));

export const conceptQuizGroups = (): QuizGroup[] => QUIZ_GROUPS.filter((g) => !isPatternQuiz(g.id));

export const isQuizGroupId = (id: string): id is QuizGroupId => QUIZ_GROUPS.some((g) => g.id === id);

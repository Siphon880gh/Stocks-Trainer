/**
 * Registry of market-theme lessons (MK0–MK8). Each theme feeds a Learn group, cases, glossary terms, a
 * practice page (`MarketThemePage`) and a coach session. Add a theme here and to the wiring listed in
 * AGENTS_CODE_REFERENCE.md ("Market themes").
 */
import type { QuizQuestion } from "../quizData";
import type { MarketTheme, MarketThemeMode, MarketThemeQuizGroupId } from "./types";
import { EXPOSURE_WRAPPERS } from "./structure";
import { CURRENCY_FUNDS } from "./currencyFunds";
import { INDUSTRIAL_METALS } from "./industrialMetals";
import { ENERGY } from "./energy";
import { PRECIOUS_METALS } from "./preciousMetals";

export type { MarketTheme, MarketThemeMode, MarketThemeQuizGroupId } from "./types";

export const MARKET_THEMES: MarketTheme[] = [EXPOSURE_WRAPPERS, CURRENCY_FUNDS, PRECIOUS_METALS, ENERGY, INDUSTRIAL_METALS];

export const MARKET_THEME_IDS = MARKET_THEMES.map((t) => t.id);

export function isMarketThemeQuizGroup(id: string): id is MarketThemeQuizGroupId {
  return MARKET_THEMES.some((t) => t.id === id);
}

export function getMarketTheme(id: string): MarketTheme | undefined {
  return MARKET_THEMES.find((t) => t.id === id);
}

export function marketThemeQuestions(id: string): QuizQuestion[] {
  return getMarketTheme(id)?.questions ?? [];
}

export const MARKET_THEME_QUIZ_GROUPS = MARKET_THEMES.map((t) => ({ id: t.id, name: t.quiz.name, description: t.quiz.description, icon: t.quiz.icon }));
export const MARKET_THEME_CASES = MARKET_THEMES.flatMap((t) => t.cases);
export const MARKET_THEME_TERMS = MARKET_THEMES.flatMap((t) => t.terms);
export const MARKET_THEME_PRACTICE_ITEMS = MARKET_THEMES.map((t) => ({ id: t.id, title: t.practiceTitle, to: t.route }));

export const MARKET_THEME_MODE_LABELS = Object.fromEntries(MARKET_THEMES.map((t) => [t.mode, t.modeLabel])) as Record<MarketThemeMode, string>;
export const MARKET_THEME_MODE_TIPS = Object.fromEntries(MARKET_THEMES.map((t) => [t.mode, t.modeTip])) as Record<MarketThemeMode, string>;

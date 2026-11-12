/**
 * Market themes (MK0–MK8): one data shape for every "same theme, different exposure" lesson, so each theme
 * (precious metals, energy, bonds, sectors…) is a data file rendered by `MarketThemePage`. Educational, not advice.
 */
import type { QuizQuestion } from "../quizData";
import type { LiteracyTerm } from "../literacyTerms";
import type { CaseStudy } from "../caseStudies";
import type { ToolSimulation, ToolText } from "../toolTraining/types";

/** Learn group ids (also misc-practice ids) owned by the market-theme lessons. */
export type MarketThemeQuizGroupId =
  | "exposure-wrappers"
  | "currency-funds"
  | "precious-metals"
  | "energy"
  | "industrial-metals"
  | "agriculture"
  | "materials-chemicals"
  | "bonds-rates"
  | "sectors-rotation"
  | "index-style";

/** Case thinking modes owned by the market-theme lessons (spread into `CaseThinkingMode`). */
export type MarketThemeMode =
  | "exposure_wrapper"
  | "currency_wrapper"
  | "precious_metals"
  | "energy_theme"
  | "industrial_metals"
  | "agriculture_inputs"
  | "materials_chemicals"
  | "bond_duration"
  | "sector_cycle"
  | "index_style";

export interface ThemeSource {
  label: string;
  url: string;
  /** What this source supports in the lesson. */
  supports: string;
}

export interface ThemeWrapper {
  /** e.g. "Physically backed trust" */
  name: string;
  /** Example tickers or contracts, named as starting points, not recommendations. */
  examples: string;
  owns: string;
  tracks: string;
  watch: string;
}

export interface ThemeCard {
  title: string;
  text: string;
  /** Same words as `text` with underlined simulation triggers (build both with `withSims`). */
  rich?: ToolText;
}

export interface ThemeMathRow {
  label: string;
  formula: string;
  example: string;
}

export interface ThemeCalculatorInput {
  id: string;
  label: string;
  value: number;
  step: number;
}

export interface ThemeCalculator {
  title: string;
  inputs: ThemeCalculatorInput[];
  /** Pure: input values → labelled outputs. */
  compute: (v: Record<string, number>) => { label: string; value: string }[];
  note: string;
}

export interface ThemeDrill {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
}

export interface MarketTheme {
  /** Also the misc-practice id and the Learn group id. */
  id: MarketThemeQuizGroupId;
  route: string;
  /** Practice menu title. */
  practiceTitle: string;
  /** Page heading. */
  title: string;
  blurb: string;
  /** Where the theme sits in Weng's Market Forces directory, or why it is new. */
  marketForces: string;
  asOf: string;
  quiz: { name: string; description: string; icon: string };
  intro: string[];
  wrappers: ThemeWrapper[];
  drivers: ThemeCard[];
  /** Economic-force bridge cards: how a macro force reaches this theme. */
  bridges: ThemeCard[];
  math: { title: string; rows: ThemeMathRow[]; note: string };
  calculator?: ThemeCalculator;
  drills: ThemeDrill[];
  caveats: ThemeCard[];
  sources: ThemeSource[];
  links: { label: string; to: string }[];
  /** Bar-by-bar or column walks opened from underlined phrases in the driver and bridge cards. */
  simulations?: ToolSimulation[];
  mode: MarketThemeMode;
  modeLabel: string;
  modeTip: string;
  questions: QuizQuestion[];
  terms: LiteracyTerm[];
  cases: CaseStudy[];
}

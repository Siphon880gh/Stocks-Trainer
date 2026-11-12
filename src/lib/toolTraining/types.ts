/**
 * Tool training (TT0–TT5): lessons on using research tools (Market Forces, StockAnalysis, Finviz, Yahoo Finance)
 * with simulated layouts drawn in this app's own style. Each lesson is a data file rendered by `ToolLessonPage`
 * at /tools/<slug>. Commercial tools are credited, not endorsed. Educational, not advice.
 */
import type { QuizQuestion } from "../quizData";
import type { LiteracyTerm } from "../literacyTerms";
import type { CaseStudy } from "../caseStudies";
import type { ThemeCard, ThemeDrill, ThemeSource } from "../marketThemes/types";

/** Learn group ids owned by tool lessons. */
export type ToolTrainingQuizGroupId =
  | "tool-market-forces"
  | "tool-stockanalysis"
  | "tool-finviz"
  | "tool-yahoo-finance"
  | "tool-capstone";

/** Case thinking modes owned by tool lessons (spread into `CaseThinkingMode`). */
export type ToolTrainingMode =
  | "tool_market_forces"
  | "tool_stockanalysis"
  | "tool_finviz"
  | "tool_yahoo_finance"
  | "tool_capstone";

/** One block of a simulated screen. Numbers in blocks are illustrative unless the lesson says otherwise. */
export type MockBlock =
  | { kind: "quote"; symbol: string; name: string; price: string; change: string; up: boolean; meta: string }
  | { kind: "tabs"; tabs: string[]; active: number }
  | { kind: "stats"; title?: string; rows: { label: string; value: string }[] }
  | { kind: "table"; title?: string; columns: string[]; rows: string[][] }
  | { kind: "filters"; title?: string; filters: { label: string; value: string }[] }
  | { kind: "chart"; label: string; seed: number; drift: number; points?: number }
  | { kind: "chips"; title?: string; chips: string[]; active?: number }
  | { kind: "note"; text: string };

/** A numbered marker that the caption list explains. `block` is the index of the block it sits beside. */
export interface MockCallout {
  n: number;
  block: number;
  text: string;
}

/** One simulated screen: drawn in the app's own look, no logos, with alt text and a caption. */
export interface ToolScreen {
  id: string;
  title: string;
  /** Where on the real tool this resembles, e.g. "Quote page · Statistics tab". */
  where: string;
  /** Full description for screen readers. */
  alt: string;
  caption: string;
  blocks: MockBlock[];
  callouts: MockCallout[];
}

export interface ToolWalkthrough {
  title: string;
  steps: string[];
}

export interface ToolLesson {
  id: ToolTrainingQuizGroupId;
  /** URL segment: /tools/<slug>. */
  slug: string;
  route: string;
  menuLabel: string;
  icon: string;
  title: string;
  blurb: string;
  /** Who makes the tool and where it lives; shown as a credit, never an endorsement. */
  credit: { name: string; url: string; note: string };
  /** Day the real tool was last checked against these layouts (YYYY-MM-DD). */
  asOf: string;
  quiz: { name: string; description: string; icon: string };
  intro: string[];
  screens: ToolScreen[];
  walkthroughs: ToolWalkthrough[];
  drills: ThemeDrill[];
  caveats: ThemeCard[];
  sources: ThemeSource[];
  links: { label: string; to: string }[];
  mode: ToolTrainingMode;
  modeLabel: string;
  modeTip: string;
  questions: QuizQuestion[];
  terms: LiteracyTerm[];
  cases: CaseStudy[];
}

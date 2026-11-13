/**
 * Tool training (TT0–TT5): lessons on using research tools (Market Forces, StockAnalysis, Finviz, Yahoo Finance)
 * with simulated layouts drawn in this app's own style. Each lesson is a data file rendered by `ToolLessonPage`
 * at /tools/<slug>. Commercial tools are credited, not endorsed. Educational, not advice.
 */
import type { QuizQuestion } from "../quizData";
import type { LiteracyTerm } from "../literacyTerms";
import type { CaseStudy } from "../caseStudies";
import type { ThemeCard, ThemeDrill, ThemeSource } from "../marketThemes/types";
import type { LiveLink } from "./liveLinks";

/** Learn group ids owned by tool lessons. */
export type ToolTrainingQuizGroupId =
  | "tool-market-forces"
  | "tool-stockanalysis"
  | "tool-finviz"
  | "tool-yahoo-finance"
  | "tool-capstone"
  | "tool-capstone-bank";

/** Case thinking modes owned by tool lessons (spread into `CaseThinkingMode`). */
export type ToolTrainingMode =
  | "tool_market_forces"
  | "tool_stockanalysis"
  | "tool_finviz"
  | "tool_yahoo_finance"
  | "tool_capstone"
  | "tool_capstone_bank";

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

/**
 * An underlined phrase in lesson copy that opens a simulation popover. `sim` is a `ToolSimulation.id` in the same
 * lesson (the hub legend has none). Structured, not parsed from prose, so tests can check every trigger resolves.
 */
export interface SimRef {
  text: string;
  sim: string;
}

/** A glossary term in lesson copy: hover, focus or tap shows its Archive definition. `term` is a `LiteracyTerm` id. */
export interface TermRef {
  text: string;
  term: string;
}

/** Lesson copy: plain text, or plain runs mixed with simulation triggers and glossary terms. `toolTextPlain` flattens it. */
export type ToolText = string | (string | SimRef | TermRef)[];

/** What a bar is flagged as on a simulated chart. Drawn as a small tag; `high` / `low` also draw a level line. */
export type SimBarMark = "high" | "low" | "earnings" | "news" | "dividend" | "signal";

/** One SAMPLE bar in a bar-by-bar walk: prices plus what the bar shows and why we are looking at it. */
export interface SimBar {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  mark?: SimBarMark;
  /** A small figure shown with the bar, e.g. "P/E 15.0" or "Adj Close 49.20". */
  readout?: string;
  what: string;
  /** The research habit this bar trains: the point of the simulation. */
  why: string;
}

/** A bar-by-bar walk on a SIMULATED candlestick tape. Bars appear one at a time; the newest is the current bar. */
export interface BarWalkSim {
  kind: "bars";
  id: string;
  title: string;
  /** Shown before the first Next: what this walk is for. */
  goal: string;
  /** Tape label, must say SAMPLE or simulated, e.g. "SAMPLE company · monthly bars · simulated". */
  tape: string;
  /** Bars visible when the walk opens (at least 1). */
  start: number;
  bars: SimBar[];
  /** One-line summary shown on the last bar. */
  takeaway: string;
}

/** One step of a column walk: which column (and optionally row) it points at, and why. */
export interface ColumnStep {
  col: number;
  row?: number;
  what: string;
  why: string;
}

/** A column-by-column walk over a table (e.g. Financials TTM → fiscal years). Columns appear as steps reach them. */
export interface ColumnWalkSim {
  kind: "columns";
  id: string;
  title: string;
  goal: string;
  tape: string;
  start: number;
  /** Header row; column 0 holds the row labels and is always shown. */
  columns: string[];
  rows: string[][];
  steps: ColumnStep[];
  takeaway: string;
  /** The real page(s) this table mirrors, built in `liveLinks.ts`. Live numbers differ from the dated walk. */
  live?: LiveLink[];
}

export type ToolSimulation = BarWalkSim | ColumnWalkSim;

/** A numbered marker that the caption list explains. `block` is the index of the block it sits beside. */
export interface MockCallout {
  n: number;
  block: number;
  text: ToolText;
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
  /** The real page(s) this layout mirrors, built in `liveLinks.ts`. Omit when there is no live counterpart. */
  live?: LiveLink[];
}

export interface ToolWalkthrough {
  title: string;
  steps: ToolText[];
}

/**
 * What a "find it yourself" answer should look like. Live values move, so the check is format and plausibility
 * (a range, a list of labels), never an exact number. `example` must pass its own check.
 */
export type FindTaskAnswer =
  | { format: "percent" | "number" | "money"; min: number; max: number; example: string }
  | { format: "date"; example: string; minYear: number; maxYear: number }
  | { format: "text"; example: string; oneOf?: string[] };

/** A task on the real tool: open the live link, find one field, record its value and the page's time stamp. */
export interface ToolTask {
  id: string;
  /** What to find, e.g. "Newmont's Short Float". */
  find: ToolText;
  live: LiveLink;
  /** Where on the page the field sits. */
  where: string;
  answer: FindTaskAnswer;
  /** Why the value matters for research (shown after a check). */
  why: string;
}

/** One input in a guided workflow; `key` fills `{key}` in the workflow's note template. */
export interface WorkflowField {
  key: string;
  label: string;
  placeholder: string;
}

/** One step of a guided multi-tool workflow: open the live page(s), do the read, type what you found. */
export interface WorkflowStep {
  id: string;
  title: string;
  live: LiveLink[];
  do: ToolText[];
  fields: WorkflowField[];
}

/**
 * A step-by-step research workflow across tools with a note template that fills as you type. Unfilled keys show
 * as blanks, so the note reads as a checklist until it is done.
 */
export interface ToolWorkflow {
  title: string;
  intro: string;
  noteTitle: string;
  steps: WorkflowStep[];
  /** Note lines; `{key}` is replaced by that field's value. */
  note: string[];
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
  intro: ToolText[];
  screens: ToolScreen[];
  walkthroughs: ToolWalkthrough[];
  /** Bar-by-bar (or column-by-column) walks opened from underlined phrases in the copy above. */
  simulations?: ToolSimulation[];
  /** "Find it yourself" tasks on the live tools (3–4 per lesson). */
  tasks: ToolTask[];
  /** Optional guided workflow with a note template (the capstones). */
  workflow?: ToolWorkflow;
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

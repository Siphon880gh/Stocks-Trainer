/**
 * Paper desk types: a multi-symbol replay with a watchlist, news and financial statements that unlock on the
 * replay clock (no look-ahead). Money is SIMULATED; a scenario's prices are either HISTORICAL (real past bars) or
 * SIMULATED (fictional tapes). Prices in the engine are integer cents; statement figures are whole US dollars.
 */
import type { PaperAction, PaperBar, PaperOptions } from "../types";

export type DeskNewsKind = "earnings" | "filing" | "company" | "market";

export interface DeskNewsItem {
  id: string;
  /** Symbol the item is about ("" = the whole market). */
  symbol: string;
  /** Publication date (ISO, US Eastern) for a HISTORICAL scenario. */
  date?: string;
  /** Bar index for a SIMULATED scenario: the item is published after this bar closes. */
  bar?: number;
  kind: DeskNewsKind;
  headline: string;
  summary: string;
  source: string;
  url?: string;
  /** Invented for practice (always shown with a SIMULATED tag). */
  simulated?: boolean;
}

/** One filed statement (10-Q quarter or 10-K fiscal year). Dollars; EPS in dollars per share. */
export interface DeskStatement {
  form: string;
  /** Filing date (HISTORICAL) … */
  filed?: string;
  /** … or the bar it is published after (SIMULATED). */
  bar?: number;
  periodStart: string;
  periodEnd: string;
  /** Cash-flow lines are year-to-date in a 10-Q: how many months they cover. */
  cashFlowMonths: number;
  url?: string;
  /** Total liabilities was not tagged in the filing, so it is total assets − stockholders' equity. */
  liabilitiesDerived?: boolean;
  simulated?: boolean;
  revenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  epsDiluted?: number;
  operatingCashFlow?: number;
  capex?: number;
  cash?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  equity?: number;
  /** SIMULATED series also carry the financing side so the change in cash ties out. */
  financingCashFlow?: number;
  debt?: number;
  sharesDiluted?: number;
  buybacks?: number;
  dividendsPaid?: number;
  stockIssued?: number;
  /** A filing note (going-concern doubt, restatement …). */
  note?: string;
  /** SIMULATED: statements in one series tie out to each other (a restatement or split starts a new one). */
  series?: string;
}

export interface DeskSymbol {
  symbol: string;
  name: string;
  /** Cents; `label` is the bar's date (HISTORICAL) or "D1…" (SIMULATED). */
  bars: PaperBar[];
  /** Shares traded per bar (HISTORICAL only). */
  volumes?: number[];
}

export type DeskTopicId = "historical" | "earnings" | "trend" | "breakouts" | "volatility" | "corporate" | "events" | "macro" | "credit" | "signals" | "execution";

/** A checkable goal for a scenario (evaluated by goals.ts from the account and the log). */
export type DeskGoal =
  | { kind: "stopOnEntries"; text: string }
  | { kind: "maxDrawdown"; pct: number; text: string }
  | { kind: "flatAt"; bar: number; symbol?: string; text: string }
  | { kind: "positive"; text: string }
  | { kind: "usedType"; type: "limit" | "stop" | "stop-limit" | "trailing-stop"; text: string }
  | { kind: "maxRiskPct"; pct: number; text: string }
  | { kind: "maxTrades"; n: number; text: string }
  | { kind: "traded"; symbol?: string; text: string };

/** Cash dividend: holders at the close before `exBar` receive `cents` per share on the ex-date (shorts pay it). */
export interface DeskDividend {
  symbol: string;
  exBar: number;
  cents: number;
}

export interface DeskScenario {
  /** Topic group for the picker. */
  topic?: DeskTopicId;
  /** Learning goals shown on the picker card. */
  learn?: string[];
  goals?: DeskGoal[];
  /** Shown when the replay ends: what the news / filings signalled and what a disciplined trade looked like. */
  debrief?: { signals: string[]; plan: string[] };
  /** Glossary term ids (Archive → Literacy). */
  terms?: string[];
  /** Journal questions for the debrief. */
  prompts?: string[];
  /** Account rules the scenario starts with (the learner can still change them on the setup). */
  options?: PaperOptions;
  dividends?: DeskDividend[];
  id: string;
  title: string;
  /** HISTORICAL = real past prices and filings replayed; SIMULATED = fictional tapes and invented news. */
  kind: "historical" | "simulated";
  description: string;
  /** What to practise with it. */
  lesson: string;
  /** One label per bar (dates for HISTORICAL). Every symbol has exactly this many bars. */
  labels: string[];
  symbols: DeskSymbol[];
  news: DeskNewsItem[];
  statements: Record<string, DeskStatement[]>;
  /** Plain-language note on where the data comes from. */
  sourceNote: string;
}

/** A persisted desk session: an action log replayed through the paper engine (same as /paper, many symbols). */
export interface DeskLog {
  scenarioId: string;
  startingCash: number;
  /** Last visible bar index (the replay clock). */
  bar: number;
  actions: PaperAction[];
  options?: PaperOptions;
  /** Symbol on the chart and ticket. */
  active?: string;
  /** Journal notes per filled order id (never change the account). */
  notes?: Record<string, string>;
}

/**
 * Paper desk scenarios and the replay-clock reveal rules (no look-ahead):
 * - bars: the learner sees bars 0..bar of every symbol.
 * - news / statements: an item dated d (HISTORICAL) unlocks on the first bar whose date is ≥ d (it was published
 *   by that session's close, so an order placed then is evaluated on the next bar); an item with `bar` b
 *   (SIMULATED) unlocks once bar b has closed. Items published before the first bar are history: always visible.
 */
import { HISTORY_2024_DATES, HISTORY_2024_NEWS, HISTORY_2024_STATEMENTS, HISTORY_2024_SYMBOLS } from "./history2024";
import { SIMULATED_DESK } from "./simulatedDesk";
import type { DeskNewsItem, DeskScenario, DeskStatement, DeskSymbol } from "./types";

const HISTORICAL_2024: DeskScenario = {
  id: "big-tech-2024",
  title: "Big tech, 2024 (HISTORICAL)",
  kind: "historical",
  description: "Apple, Microsoft and Amazon, every trading day of 2024, with their real earnings releases and filings.",
  lesson: "Trade through four real earnings seasons. Each release and 10-Q appears only on the day it was filed.",
  labels: [...HISTORY_2024_DATES],
  symbols: Object.entries(HISTORY_2024_SYMBOLS).map(
    ([symbol, s]): DeskSymbol => ({
      symbol,
      name: s.name,
      bars: s.bars.map(([open, high, low, close], i) => ({ open, high, low, close, label: HISTORY_2024_DATES[i] })),
      volumes: s.bars.map((b) => b[4]),
    }),
  ),
  news: [...HISTORY_2024_NEWS],
  statements: Object.fromEntries(Object.entries(HISTORY_2024_STATEMENTS).map(([k, v]) => [k, [...v]])),
  sourceNote:
    "HISTORICAL: real 2024 daily prices (Yahoo Finance) and real SEC EDGAR filings and press-release headlines, replayed one day at a time. The money is SIMULATED; nothing is live.",
};

export const DESK_SCENARIOS: DeskScenario[] = [HISTORICAL_2024, SIMULATED_DESK];

export const getDeskScenario = (id: string) => DESK_SCENARIOS.find((s) => s.id === id);

/** First bar a desk session shows (two weeks of history for context). */
export const DESK_START_BAR = 10;

export const lastBarOf = (s: DeskScenario) => s.labels.length - 1;

/** Bar after whose close an item dated `date` is visible (−1 = before the replay starts). */
export function barForDate(labels: readonly string[], date: string): number {
  if (date < labels[0]!) return -1;
  const i = labels.findIndex((d) => d >= date);
  return i === -1 ? Number.POSITIVE_INFINITY : i;
}

export const revealBar = (s: DeskScenario, item: { date?: string; bar?: number; filed?: string }): number => {
  if (item.bar !== undefined) return item.bar;
  const d = item.date ?? item.filed;
  return d ? barForDate(s.labels, d) : Number.POSITIVE_INFINITY;
};

/** News visible at `bar`, newest first (optionally for one symbol; market-wide items always included). */
export function visibleNews(s: DeskScenario, bar: number, symbol?: string): (DeskNewsItem & { at: number })[] {
  return s.news
    .map((n) => ({ ...n, at: revealBar(s, n) }))
    .filter((n) => n.at <= bar && (!symbol || n.symbol === symbol || n.symbol === ""))
    .sort((a, b) => b.at - a.at || (b.date ?? "").localeCompare(a.date ?? ""));
}

/** Statements filed by `bar`, newest first. */
export function statementsAsOf(s: DeskScenario, symbol: string, bar: number): (DeskStatement & { at: number })[] {
  return (s.statements[symbol] ?? [])
    .map((st) => ({ ...st, at: revealBar(s, st) }))
    .filter((st) => st.at <= bar)
    .sort((a, b) => b.at - a.at);
}

export const symbolOf = (s: DeskScenario, symbol: string) => s.symbols.find((x) => x.symbol === symbol);

/** Watchlist row: last close and change vs the prior close (cents). */
export function quote(s: DeskScenario, symbol: string, bar: number) {
  const bars = symbolOf(s, symbol)!.bars;
  const last = bars[Math.min(bar, bars.length - 1)]!;
  const prev = bars[Math.max(0, Math.min(bar, bars.length - 1) - 1)]!;
  const change = last.close - prev.close;
  return { last: last.close, change, changePct: prev.close ? change / prev.close : 0 };
}

/** Derived figures for the Financials tab (null when a line is missing). */
export function ratios(st: DeskStatement) {
  const r = (a?: number, b?: number) => (a === undefined || b === undefined || b === 0 ? null : a / b);
  return {
    grossMargin: r(st.grossProfit, st.revenue),
    operatingMargin: r(st.operatingIncome, st.revenue),
    netMargin: r(st.netIncome, st.revenue),
    freeCashFlow: st.operatingCashFlow !== undefined && st.capex !== undefined ? st.operatingCashFlow - st.capex : null,
    liabilitiesToEquity: r(st.totalLiabilities, st.equity),
  };
}

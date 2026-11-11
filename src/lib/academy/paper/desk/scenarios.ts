/**
 * Paper desk scenarios and the replay-clock reveal rules (no look-ahead):
 * - bars: the learner sees bars 0..bar of every symbol.
 * - news / statements: an item dated d (HISTORICAL) unlocks on the first bar whose date is ≥ d (it was published
 *   by that session's close, so an order placed then is evaluated on the next bar); an item with `bar` b
 *   (SIMULATED) unlocks once bar b has closed. Items published before the first bar are history: always visible.
 */
import { HISTORY_2024_DATES, HISTORY_2024_NEWS, HISTORY_2024_STATEMENTS, HISTORY_2024_SYMBOLS } from "./history2024";
import { SIM_LIBRARY } from "./simLibrary";
import { SIMULATED_DESK } from "./simulatedDesk";
import type { DeskTopicId } from "./types";
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

/** Next-session gap after each real earnings release (computed from the bundled prices, nothing invented). */
function earningsGaps(s: DeskScenario): string[] {
  const out: string[] = [];
  for (const n of s.news) {
    if (n.kind !== "earnings" || !n.symbol || !n.date) continue;
    const at = barForDate(s.labels, n.date);
    const bars = s.symbols.find((x) => x.symbol === n.symbol)?.bars;
    if (!bars || at < 0 || at + 1 >= bars.length) continue;
    const gap = bars[at + 1]!.open / bars[at]!.close - 1;
    const day = bars[at + 1]!.close / bars[at]!.close - 1;
    const pct = (x: number) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(1)}%`;
    out.push(`${n.symbol} ${n.date}: next open ${pct(gap)}, next close ${pct(day)}.`);
  }
  return out;
}

const HISTORICAL_DESK: DeskScenario = {
  ...HISTORICAL_2024,
  topic: "historical",
  learn: ["Trade real earnings seasons without knowing the outcome", "Read real filings the day they appear", "Size into report dates you can see coming"],
  goals: [
    { kind: "stopOnEntries", text: "Every entry has a protective stop working by the end of its first day" },
    { kind: "maxRiskPct", pct: 1, text: "Plan no more than 1% of starting cash of risk per trade" },
    { kind: "maxDrawdown", pct: 10, text: "Keep the account's drawdown under 10%" },
  ],
  debrief: {
    signals: ["How each real earnings release moved the next session (from the bundled prices):", ...earningsGaps(HISTORICAL_2024)],
    plan: ["Report dates were public: a disciplined trader sized down or flattened before each release.", "Large single-day moves after a report are the reason to size for the gap, not just the stop."],
  },
  terms: ["earnings-surprise", "earnings-gap", "gap-risk", "position-sizing"],
};

const EARNINGS_WEEK: DeskScenario = {
  ...SIMULATED_DESK,
  topic: "earnings",
  learn: ["Read a beat and a guidance cut before the gap", "Size small into a known report date", "Leave a quiet range alone"],
  goals: [
    { kind: "stopOnEntries", text: "Every entry has a protective stop working by the end of its first day" },
    { kind: "maxRiskPct", pct: 1, text: "Plan no more than 1% of starting cash of risk per trade" },
    { kind: "maxDrawdown", pct: 6, text: "Keep drawdown under 6%" },
  ],
  debrief: {
    signals: ["D35 after the close: PRWD.S sales +22% above its own outlook; D36 gapped up about 14%.", "D45 after the close: DRPL.S cut guidance and swung to a loss; D46 gapped down about 11%.", "RNGF.S had only expected news and stayed in its range."],
    plan: ["Small or flat into each report; a stop below the market fills at the gap open.", "Trade the reaction: a long above PRWD.S's gap-day high, no long in DRPL.S until it bases."],
  },
  terms: ["earnings-surprise", "guidance-raise-cut", "earnings-gap", "trend-vs-range"],
};

export const DESK_SCENARIOS: DeskScenario[] = [HISTORICAL_DESK, EARNINGS_WEEK, ...SIM_LIBRARY];

/** Picker groups, in order. */
export const DESK_TOPICS: { id: DeskTopicId; name: string; blurb: string }[] = [
  { id: "historical", name: "Real history", blurb: "Real prices and real filings, replayed one day at a time." },
  { id: "earnings", name: "Earnings & guidance", blurb: "Beats, misses, guidance and the gaps they cause." },
  { id: "trend", name: "Trends & ranges", blurb: "Bull trends, bear trends and sideways chop." },
  { id: "breakouts", name: "Breakouts & gaps", blurb: "Which breakouts and gaps hold, and which fail." },
  { id: "volatility", name: "Volatility & squeezes", blurb: "Flash crashes and short squeezes." },
  { id: "corporate", name: "Corporate actions", blurb: "Dividends, splits, offerings and buybacks." },
  { id: "events", name: "Deals & binary events", blurb: "Takeovers and all-or-nothing decisions." },
  { id: "macro", name: "Macro & sectors", blurb: "Rate decisions, inflation prints, rotation and recessions." },
  { id: "credit", name: "Balance-sheet risk", blurb: "Going-concern warnings, bankruptcy and restatements." },
  { id: "signals", name: "Insiders & analysts", blurb: "Insider buying and rating changes." },
  { id: "execution", name: "Execution & risk", blurb: "Slippage, gaps through stops, trailing stops, sizing and time decay." },
];

export const scenariosByTopic = () =>
  DESK_TOPICS.map((t) => ({ ...t, scenarios: DESK_SCENARIOS.filter((s) => (s.topic ?? (s.kind === "historical" ? "historical" : "earnings")) === t.id) })).filter((g) => g.scenarios.length > 0);

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

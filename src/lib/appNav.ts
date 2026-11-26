import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import { CHARTING_APPS_ROUTE, TOOL_LESSONS } from "./toolTraining";

/** Top menu, in the same order as the Learn page after the path. */
export const APP_NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/training", label: "ToC", end: true },
  { to: "/academy", label: "Academy" },
  { to: "/training#patterns", label: "Pattern recognition" },
  { to: "/training#practice", label: "Practice" },
] as const;

/** The progress map lives with the dashboard. The summary line stays on the dashboard page. */
export const DASHBOARD_MORE = [
  { label: "Map", to: "/map", icon: "map" },
] as const;

/** Lessons, then the concept quizzes. */
export const ACADEMY_MORE = [
  { label: "Lessons", to: "/academy", icon: "school" },
  { label: "Quiz (Concepts)", to: "/training#concepts", icon: "lightbulb" },
] as const;

/** Basics, then the pattern quizzes, then the library. */
export const PATTERN_MORE = [
  { label: "Candlestick Basics", to: "/practice/candle-basics", icon: "candlestick_chart" },
  { label: "Quiz (Patterns)", to: "/training#patterns", icon: "quiz" },
  { label: "Library", to: "/archive", icon: "menu_book" },
] as const;

/**
 * Same order as the Practice section: stock charts, then futures and options,
 * then crypto, volatility products, and narrower topics.
 */
export const PRACTICE_MENU = MISC_PRACTICE_ITEMS.flatMap((item) => {
  const row = { id: item.id, label: item.title, to: item.to };
  if (item.id !== "futures-vs-options") return [row];
  return [row, { id: "options-ladder", label: "Options ladder", to: "/academy/options" }];
});

/** Tool Training: the hub, one lesson per tool, then the existing charting-apps comparison (kept in Practice too). */
export const TOOL_TRAINING: readonly { label: string; to: string; icon: string }[] = [
  { label: "Tool Training overview", to: "/tools", icon: "construction" },
  ...TOOL_LESSONS.map((t) => ({ label: t.menuLabel, to: t.route, icon: t.icon })),
  { label: "Charting apps compared", to: CHARTING_APPS_ROUTE, icon: "compare" },
];

export const DEEP_STUDY = [
  { label: "Cases", to: "/cases", icon: "cases" },
  { label: "Coach", to: "/coach", icon: "psychology" },
  { label: "Playbooks", to: "/playbooks", icon: "auto_stories" },
  { label: "Paper trading", to: "/paper", icon: "account_balance_wallet" },
  { label: "Paper desk", to: "/paper/desk", icon: "monitoring" },
  { label: "Challenges", to: "/paper/challenges", icon: "emoji_events" },
] as const;

export const OTHER_FACTORS = [
  { label: "Financials", to: "/training#financials" },
  { label: "Statements lab", to: "/practice/statements" },
  { label: "Read the Print", to: "/practice/read-the-print" },
  { label: "Mark the band", to: "/practice/mark-the-band" },
  { label: "Macro", to: "/training#macro" },
  { label: "Macro desk", to: "/macro" },
  { label: "Macro play", to: "/macro/play" },
] as const;

/** Charts and Buy or Sell, after Other factors. */
export const QUICK_DECISIONS = [
  { label: "Charts", to: "/market" },
  { label: "Buy or Sell", to: "/training#buy-or-sell" },
] as const;

/* ---------------------------------------------------------------------------------------------
 * Directional header (docs/projects/navigation/DIRECTIONAL-NAV-PROPOSAL.md): Home, Learn, Practice,
 * Trade, Map and Browse everything. The groups above stay as the full catalog that Browse everything
 * and the Table of Contents still show.
 * ------------------------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  to: string;
  icon?: string;
}

/** Lessons, quizzes and reference. */
export const LEARN_MENU: readonly NavItem[] = [
  { label: "Table of Contents", to: "/training", icon: "toc" },
  { label: "Academy lessons", to: "/academy", icon: "school" },
  { label: "Candlestick Basics", to: "/practice/candle-basics", icon: "candlestick_chart" },
  { label: "Quiz (Patterns)", to: "/training#patterns", icon: "quiz" },
  { label: "Quiz (Concepts)", to: "/training#concepts", icon: "lightbulb" },
  { label: "Library and glossary", to: "/archive", icon: "menu_book" },
  { label: "Financials", to: "/training#financials", icon: "receipt_long" },
  { label: "Statements lab", to: "/practice/statements", icon: "table_chart" },
  { label: "Macro", to: "/training#macro", icon: "public" },
  { label: "Macro desk", to: "/macro", icon: "newspaper" },
  { label: "Options ladder", to: "/academy/options", icon: "stacked_line_chart" },
  { label: "Tool Training", to: "/tools", icon: "construction" },
];

/** Practice families: every Practice-menu lab once, plus the financials games. */
export const PRACTICE_FAMILY_IDS: readonly { title: string; ids: readonly string[] }[] = [
  { title: "Candles and patterns", ids: ["japanese-candles", "essential-candles", "missing-wicks", "which-way", "pattern-themes", "reversal-charts", "flashcards", "label", "lookalike", "hunt", "draw"] },
  { title: "Price action and day trading", ids: ["regime", "levels", "replay", "plan", "invalidation", "trade-framework", "opening-range", "fair-value-gap", "fib-decision-map", "one-minute-charts"] },
  { title: "Indicators and charting apps", ids: ["heikin-ashi", "ema-macd", "oscillators", "technique-narratives", "charting-apps"] },
  { title: "Statements and earnings", ids: ["statements", "read-the-print", "mark-the-band"] },
  { title: "Options and volatility", ids: ["news-biases", "futures-vs-options", "options-ladder", "wheel-strategy", "gamma-squeeze", "risk-premium-portfolio", "vix-trading"] },
  { title: "Other markets", ids: ["crypto-candles", "exposure-wrappers", "currency-funds", "precious-metals", "energy", "industrial-metals", "agriculture", "materials-chemicals", "bonds-rates", "sectors-rotation", "index-style"] },
  { title: "Automation and records", ids: ["algo-trading", "record-traders"] },
];

const FINANCIAL_GAMES: readonly { id: string; label: string; to: string }[] = [
  { id: "statements", label: "Statements lab", to: "/practice/statements" },
  { id: "read-the-print", label: "Read the Print", to: "/practice/read-the-print" },
  { id: "mark-the-band", label: "Mark the band", to: "/practice/mark-the-band" },
];

export const PRACTICE_FAMILIES: readonly { title: string; items: readonly NavItem[] }[] = PRACTICE_FAMILY_IDS.map((f) => ({
  title: f.title,
  items: f.ids.map((id) => {
    const row = PRACTICE_MENU.find((r) => r.id === id) ?? FINANCIAL_GAMES.find((r) => r.id === id);
    if (!row) throw new Error(`practice family item ${id} has no menu row`);
    return { label: row.label, to: row.to };
  }),
}));

/** Decide and trade: paper trading, cases, coaching, playbooks and quick decisions. */
export const TRADE_MENU: readonly NavItem[] = [
  { label: "Paper trading", to: "/paper", icon: "account_balance_wallet" },
  { label: "Paper desk", to: "/paper/desk", icon: "monitoring" },
  { label: "Challenges", to: "/paper/challenges", icon: "emoji_events" },
  { label: "Cases", to: "/cases", icon: "cases" },
  { label: "Coach", to: "/coach", icon: "psychology" },
  { label: "Playbooks", to: "/playbooks", icon: "auto_stories" },
  { label: "Charts", to: "/market", icon: "query_stats" },
  { label: "Buy or Sell", to: "/training#buy-or-sell", icon: "swap_vert" },
  { label: "Macro play", to: "/macro/play", icon: "sports_esports" },
];

export const BROWSE_ROUTE = "/browse";

/** Top-level header destinations, in order. Menus open on the chevron; labels with `to` navigate. */
export const HEADER_NAV: readonly { id: string; label: string; to?: string; end?: boolean; menu?: "learn" | "practice" | "trade" }[] = [
  { id: "home", label: "Home", to: "/", end: true },
  { id: "learn", label: "Learn", to: "/academy", end: true, menu: "learn" },
  { id: "practice", label: "Practice", to: "/training#practice", menu: "practice" },
  { id: "trade", label: "Trade", menu: "trade" },
  { id: "map", label: "Map", to: "/map" },
  { id: "browse", label: "Browse everything", to: BROWSE_ROUTE },
];

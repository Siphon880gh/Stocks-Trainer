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

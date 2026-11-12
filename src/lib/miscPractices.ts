import { MARKET_THEME_PRACTICE_ITEMS } from "./marketThemes";
/** Practice labs, from cash-stock charts toward futures, options, crypto, and narrower markets. */

export interface MiscPracticeItem {
  id: string;
  title: string;
  to: string;
}

export const MISC_PRACTICE_ITEMS: MiscPracticeItem[] = [
  { id: "japanese-candles", title: "Japanese candlesticks", to: "/practice/japanese-candles" },
  { id: "essential-candles", title: "Essential candlestick patterns", to: "/practice/essential-candles" },
  { id: "missing-wicks", title: "Missing wicks and zooming in", to: "/practice/missing-wicks" },
  { id: "which-way", title: "Which Way? (Up, Down or Either)", to: "/practice/which-way" },
  { id: "pattern-themes", title: "Pattern themes", to: "/practice/pattern-themes" },
  { id: "reversal-charts", title: "Reversal chart patterns", to: "/practice/reversal-charts" },
  { id: "flashcards", title: "Flashcards", to: "/practice/flashcards" },
  { id: "label", title: "Label", to: "/practice/label" },
  { id: "lookalike", title: "Lookalikes", to: "/practice/lookalike" },
  { id: "hunt", title: "Pattern hunt", to: "/practice/hunt" },
  { id: "draw", title: "Drawing", to: "/practice-draw" },
  { id: "regime", title: "Trend vs range", to: "/practice/regime" },
  { id: "levels", title: "Support and resistance", to: "/practice/levels" },
  { id: "replay", title: "Bar replay", to: "/practice/replay" },
  { id: "plan", title: "Mark the plan", to: "/practice/plan" },
  { id: "invalidation", title: "Invalidation", to: "/practice/invalidation" },
  { id: "trade-framework", title: "Price action trading framework", to: "/practice/trade-framework" },
  { id: "opening-range", title: "Opening range: retests, failed breaks & risk", to: "/practice/opening-range" },
  { id: "fair-value-gap", title: "Breakout, pullback and fair value gap", to: "/practice/fair-value-gap" },
  { id: "fib-decision-map", title: "Fibonacci as a decision map", to: "/practice/fib-decision-map" },
  { id: "one-minute-charts", title: "Reading 1-minute charts", to: "/practice/one-minute-charts" },
  { id: "heikin-ashi", title: "Heikin-Ashi candles", to: "/practice/heikin-ashi" },
  { id: "ema-macd", title: "EMA, SMA and MACD (long charts)", to: "/practice/ema-macd" },
  { id: "oscillators", title: "Oscillators & volatility stop", to: "/practice/oscillators" },
  { id: "technique-narratives", title: "Technique narratives", to: "/practice/technique-narratives" },
  { id: "charting-apps", title: "Indicator & charting apps", to: "/practice/charting-apps" },
  { id: "news-biases", title: "News, biases & short-term options", to: "/practice/news-biases" },
  { id: "futures-vs-options", title: "Futures vs options & beginner toolkit", to: "/practice/futures-vs-options" },
  { id: "wheel-strategy", title: "The wheel strategy (cash-secured puts to covered calls)", to: "/practice/wheel-strategy" },
  { id: "gamma-squeeze", title: "Gamma squeeze case", to: "/practice/gamma-squeeze" },
  { id: "crypto-candles", title: "Candlesticks for crypto", to: "/practice/crypto-candles" },
  { id: "risk-premium-portfolio", title: "Risk-premium portfolio and the VIX overlay", to: "/practice/risk-premium-portfolio" },
  { id: "vix-trading", title: "VIX trading for beginners", to: "/practice/vix-trading" },
  ...MARKET_THEME_PRACTICE_ITEMS,
  { id: "algo-trading", title: "Automated & algo trading (2026)", to: "/practice/algo-trading" },
  { id: "record-traders", title: "Record-setting traders", to: "/practice/record-traders" },
];

const DONE_KEY = "analysis_core_misc_practices_done_v1";

function loadDoneIds(): string[] {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function isMiscPracticeDone(id: string): boolean {
  return loadDoneIds().includes(id);
}

export function markMiscPracticeDone(id: string): void {
  const next = new Set(loadDoneIds());
  next.add(id);
  localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
}

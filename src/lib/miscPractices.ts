/** Learn → Misc Practices hub entries. Drawing keeps its existing route. */

export interface MiscPracticeItem {
  id: string;
  title: string;
  to: string;
}

export const MISC_PRACTICE_ITEMS: MiscPracticeItem[] = [
  { id: "draw", title: "Drawing", to: "/practice-draw" },
  { id: "flashcards", title: "Flashcards", to: "/practice/flashcards" },
  { id: "label", title: "Label", to: "/practice/label" },
  { id: "regime", title: "Trend vs range", to: "/practice/regime" },
  { id: "replay", title: "Bar replay", to: "/practice/replay" },
  { id: "plan", title: "Mark the plan", to: "/practice/plan" },
  { id: "hunt", title: "Pattern hunt", to: "/practice/hunt" },
  { id: "lookalike", title: "Lookalikes", to: "/practice/lookalike" },
  { id: "invalidation", title: "Invalidation", to: "/practice/invalidation" },
  { id: "levels", title: "Support and resistance", to: "/practice/levels" },
  { id: "ema-macd", title: "EMA, SMA and MACD (long charts)", to: "/practice/ema-macd" },
  { id: "oscillators", title: "Oscillators & volatility stop", to: "/practice/oscillators" },
  { id: "japanese-candles", title: "Japanese candlesticks", to: "/practice/japanese-candles" },
  { id: "heikin-ashi", title: "Heikin-Ashi candles", to: "/practice/heikin-ashi" },
  { id: "gamma-squeeze", title: "Gamma squeeze case", to: "/practice/gamma-squeeze" },
  { id: "news-biases", title: "News, biases & short-term options", to: "/practice/news-biases" },
  { id: "algo-trading", title: "Automated & algo trading (2026)", to: "/practice/algo-trading" },
  { id: "charting-apps", title: "Indicator & charting apps", to: "/practice/charting-apps" },
  { id: "crypto-candles", title: "Candlesticks for crypto", to: "/practice/crypto-candles" },
  { id: "reversal-charts", title: "Reversal chart patterns", to: "/practice/reversal-charts" },
  { id: "one-minute-charts", title: "Reading 1-minute charts", to: "/practice/one-minute-charts" },
  { id: "fib-decision-map", title: "Fibonacci as a decision map", to: "/practice/fib-decision-map" },
  { id: "futures-vs-options", title: "Futures vs options & beginner toolkit", to: "/practice/futures-vs-options" },
  { id: "technique-narratives", title: "Technique narratives", to: "/practice/technique-narratives" },
  { id: "missing-wicks", title: "Missing wicks and zooming in", to: "/practice/missing-wicks" },
  { id: "record-traders", title: "Record-setting traders", to: "/practice/record-traders" },
  { id: "pattern-themes", title: "Pattern themes", to: "/practice/pattern-themes" },
  { id: "essential-candles", title: "Essential candlestick patterns", to: "/practice/essential-candles" },
  { id: "which-way", title: "Which Way? (Up, Down or Either)", to: "/practice/which-way" },
  { id: "trade-framework", title: "Price action trading framework", to: "/practice/trade-framework" },
  { id: "opening-range", title: "Opening range breakout (15-minute)", to: "/practice/opening-range" },
  { id: "fair-value-gap", title: "Breakout, pullback and fair value gap", to: "/practice/fair-value-gap" },
  { id: "risk-premium-portfolio", title: "Risk-premium portfolio and the VIX overlay", to: "/practice/risk-premium-portfolio" },
  { id: "vix-trading", title: "VIX trading for beginners", to: "/practice/vix-trading" },
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

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

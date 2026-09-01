/** Overlay registry: id, name, description, useCase for right-click popover and glossary */
export type OverlayCategory = "trend" | "oscillator" | "volatility";

export interface OverlayDef {
  id: string;
  name: string;
  fullName: string;
  description: string;
  /** Longer learner-facing definition for the detail modal. */
  detail?: string;
  useCase: string;
  category: OverlayCategory;
}

export const OVERLAYS: OverlayDef[] = [
  {
    id: "sma",
    name: "SMA",
    fullName: "Simple Moving Average",
    category: "trend",
    description:
      "Average of closing prices over a period. Smooths noise and shows trend direction. Price above SMA = bullish bias; below = bearish.",
    useCase: "Trend identification, support/resistance levels.",
  },
  {
    id: "ema",
    category: "trend",
    name: "EMA",
    fullName: "Exponential Moving Average",
    description:
      "Like SMA but gives more weight to recent prices. Reacts faster to new data. Useful for short-term momentum.",
    detail:
      "An Exponential Moving Average (EMA) is calculated by applying a percentage of the current price and combining it with the previous period's EMA, giving more weight to recent data points than a Simple Moving Average (SMA).",
    useCase: "Faster signals than SMA; popular for swing trading.",
  },
  {
    id: "rsi",
    category: "oscillator",
    name: "RSI",
    fullName: "Relative Strength Index",
    description:
      "Oscillator 0–100. Measures speed of price changes. RSI above 70 = overbought; RSI below 30 = oversold. Divergences can signal reversals.",
    useCase: "Overbought/oversold zones, momentum confirmation.",
  },
  {
    id: "macd",
    category: "oscillator",
    name: "MACD",
    fullName: "Moving Average Convergence Divergence",
    description:
      "Difference between fast and slow EMA. Signal line = EMA of MACD. Histogram shows momentum. Crossovers = potential entry/exit.",
    useCase: "Trend changes, momentum shifts, crossover signals.",
  },
  {
    id: "bollinger",
    category: "volatility",
    name: "Bollinger Bands",
    fullName: "Bollinger Bands",
    description:
      "Middle band = SMA; upper/lower = SMA ± 2× standard deviation. Price near upper band = overbought; near lower = oversold. Squeeze = low volatility before breakout.",
    useCase: "Volatility, mean reversion, breakout signals.",
  },
];

export function getOverlay(id: string): OverlayDef | undefined {
  return OVERLAYS.find((o) => o.id === id);
}

export function getOverlaysByCategory(category: OverlayCategory | "all"): OverlayDef[] {
  if (category === "all") return OVERLAYS;
  return OVERLAYS.filter((o) => o.category === category);
}

const HINT_TERM_RE = /\b(Bollinger Bands|SMA|EMA|RSI|MACD|Bollinger)\b/gi;

export function overlayIdForHintTerm(term: string): string | undefined {
  const t = term.toLowerCase();
  if (t === "bollinger bands" || t === "bollinger") return "bollinger";
  return OVERLAYS.find((o) => o.name.toLowerCase() === t)?.id;
}

export function splitHintTerms(text: string): Array<{ text: string; overlayId?: string }> {
  const parts: Array<{ text: string; overlayId?: string }> = [];
  const re = new RegExp(HINT_TERM_RE.source, HINT_TERM_RE.flags);
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) });
    parts.push({ text: match[0], overlayId: overlayIdForHintTerm(match[0]) });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  if (parts.length === 0) parts.push({ text });
  return parts;
}

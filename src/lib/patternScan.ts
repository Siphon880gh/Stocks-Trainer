import type { OHLC } from "./ohlcData";

export interface DetectedPattern {
  index: number;
  name: string;
  confidence: number;
  description: string;
}

/** Detect Doji: open ≈ close, small body relative to range */
function isDoji(candle: OHLC, prev?: OHLC): boolean {
  const range = candle.high - candle.low;
  if (range === 0) return false;
  const bodySize = Math.abs(candle.close - candle.open);
  return bodySize / range < 0.1;
}

/** Detect Hammer: long lower shadow, small body at top */
function isHammer(candle: OHLC): boolean {
  const range = candle.high - candle.low;
  if (range === 0) return false;
  const bodySize = Math.abs(candle.close - candle.open);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  return lowerShadow > range * 0.6 && bodySize < range * 0.3 && upperShadow < range * 0.2;
}

/** Detect Bullish Engulfing: current green body engulfs previous red body */
function isBullishEngulfing(curr: OHLC, prev: OHLC): boolean {
  const currUp = curr.close >= curr.open;
  const prevDown = prev.close < prev.open;
  if (!currUp || !prevDown) return false;
  const currBodyLow = Math.min(curr.open, curr.close);
  const currBodyHigh = Math.max(curr.open, curr.close);
  const prevBodyLow = Math.min(prev.open, prev.close);
  const prevBodyHigh = Math.max(prev.open, prev.close);
  return currBodyLow <= prevBodyLow && currBodyHigh >= prevBodyHigh;
}

/** Detect Bearish Engulfing: red body engulfs prior green */
function isBearishEngulfing(curr: OHLC, prev: OHLC): boolean {
  const currDown = curr.close < curr.open;
  const prevUp = prev.close >= prev.open;
  if (!currDown || !prevUp) return false;
  const currBodyLow = Math.min(curr.open, curr.close);
  const currBodyHigh = Math.max(curr.open, curr.close);
  const prevBodyLow = Math.min(prev.open, prev.close);
  const prevBodyHigh = Math.max(prev.open, prev.close);
  return currBodyLow <= prevBodyLow && currBodyHigh >= prevBodyHigh;
}

/** Detect Shooting Star: long upper shadow, small body at bottom */
function isShootingStar(candle: OHLC): boolean {
  const range = candle.high - candle.low;
  if (range === 0) return false;
  const bodySize = Math.abs(candle.close - candle.open);
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  return upperShadow > range * 0.6 && bodySize < range * 0.3 && lowerShadow < range * 0.2;
}

/** Detect Inverted Hammer: long upper shadow, small body at bottom (bullish context) */
function isInvertedHammer(candle: OHLC): boolean {
  return isShootingStar(candle);
}

/** Detect Morning Star: 3-candle bullish reversal (simplified) */
function isMorningStar(data: OHLC[], i: number): boolean {
  if (i < 2 || i >= data.length) return false;
  const [first, mid, third] = [data[i - 2]!, data[i - 1]!, data[i]!];
  const firstDown = first.close < first.open;
  const midSmall = Math.abs(mid.close - mid.open) < (mid.high - mid.low) * 0.3;
  const thirdUp = third.close > third.open;
  const thirdBody = Math.abs(third.close - third.open);
  const firstBody = Math.abs(first.close - first.open);
  return firstDown && midSmall && thirdUp && thirdBody > firstBody * 0.5;
}

/** Scan OHLC data for patterns */
export function scanPatterns(data: OHLC[]): DetectedPattern[] {
  const results: DetectedPattern[] = [];
  for (let i = 0; i < data.length; i++) {
    const candle = data[i]!;
    const prev = i > 0 ? data[i - 1] : undefined;
    if (isDoji(candle, prev)) {
      results.push({
        index: i,
        name: "Doji",
        confidence: 85,
        description: "Indecision; open ≈ close with long wicks.",
      });
    }
    if (isHammer(candle)) {
      results.push({
        index: i,
        name: "Hammer",
        confidence: 88,
        description: "Bullish reversal; long lower shadow, small body at top.",
      });
    }
    if (prev && isBullishEngulfing(candle, prev)) {
      results.push({
        index: i,
        name: "Bullish Engulfing",
        confidence: 90,
        description: "Green body engulfs previous red body; strong reversal signal.",
      });
    }
    if (prev && isBearishEngulfing(candle, prev)) {
      results.push({
        index: i,
        name: "Bearish Engulfing",
        confidence: 90,
        description: "Red body engulfs previous green body; bearish reversal signal.",
      });
    }
    if (isShootingStar(candle)) {
      results.push({
        index: i,
        name: "Shooting Star / Inverted Hammer",
        confidence: 85,
        description: "Long upper shadow, small body. Context: top = bearish, bottom = bullish.",
      });
    }
    if (isMorningStar(data, i)) {
      results.push({
        index: i,
        name: "Morning Star",
        confidence: 88,
        description: "Three-candle bullish reversal at bottom of downtrend.",
      });
    }
  }
  return results;
}

export interface ChartProgressionNote {
  index: number;
  step: number;
  of: number;
  barName: string;
  headline: string;
  detail: string;
}

export interface ProgressionOverlayValues {
  sma?: Array<number | null>;
  ema?: Array<number | null>;
  rsi?: Array<number | null>;
}

function displayBarName(name: string): string {
  return name.replace(/^D-/, "");
}

function pctFrom(base: number, value: number): string {
  if (base === 0) return "flat vs the first open";
  const pct = ((value - base) / Math.abs(base)) * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% vs the first open`;
}

/** SAMPLE walk-through of the tape so far — not a live call. */
export function explainChartProgression(
  data: OHLC[],
  overlays: ProgressionOverlayValues = {},
): ChartProgressionNote[] {
  if (data.length === 0) return [];
  const patterns = scanPatterns(data);
  const atIndex = new Map<number, DetectedPattern[]>();
  for (const p of patterns) {
    const list = atIndex.get(p.index) ?? [];
    list.push(p);
    atIndex.set(p.index, list);
  }
  const first = data[0]!;
  const n = data.length;

  return data.map((c, i) => {
    const prev = i > 0 ? data[i - 1] : undefined;
    const range = c.high - c.low;
    const body = Math.abs(c.close - c.open);
    const upper = c.high - Math.max(c.open, c.close);
    const lower = Math.min(c.open, c.close) - c.low;
    const up = c.close >= c.open;
    const label = displayBarName(c.name);
    const bits: string[] = [];

    let headline: string;
    if (i === 0) {
      headline = up
        ? "Open of this SAMPLE window — buyers hold the first close"
        : "Open of this SAMPLE window — sellers hold the first close";
      bits.push(
        `Bar 1 of ${n} (${label}). This is the starting print; later dots continue this path.`,
      );
    } else {
      const vsPrev = c.close - prev!.close;
      if (vsPrev > 0) {
        headline = "Follow-through: close is higher than the prior bar";
      } else if (vsPrev < 0) {
        headline = "Setback: close slipped under the prior bar";
      } else {
        headline = "Pause: close matches the prior bar";
      }
      bits.push(
        `Bar ${i + 1} of ${n} (${label}). So far this SAMPLE path is ${pctFrom(first.open, c.close)}.`,
      );
    }

    if (range > 0) {
      if (lower / range > 0.45) {
        bits.push("Long lower wick: the bar probed lower, then buyers recovered toward the close.");
      } else if (upper / range > 0.45) {
        bits.push("Long upper wick: the bar probed higher, then got rejected into the close.");
      } else if (body / range > 0.7) {
        bits.push(
          up
            ? "Full-bodied green candle: little rejection, buyers kept the close."
            : "Full-bodied red candle: little bounce, sellers kept the close.",
        );
      }
    }

    const runHigh = Math.max(...data.slice(0, i + 1).map((d) => d.high));
    const runLow = Math.min(...data.slice(0, i + 1).map((d) => d.low));
    if (i > 0 && c.high === runHigh) {
      bits.push("New high on the window so far.");
      if (!headline.startsWith("Open")) headline = "New high on this SAMPLE window so far";
    } else if (i > 0 && c.low === runLow) {
      bits.push("New low on the window so far.");
      if (!headline.startsWith("Open")) headline = "New low on this SAMPLE window so far";
    }

    const hits = atIndex.get(i) ?? [];
    for (const p of hits) {
      bits.push(`${p.name}: ${p.description}`);
    }

    const sma = overlays.sma?.[i];
    const smaPrev = i > 0 ? overlays.sma?.[i - 1] : null;
    if (sma != null) {
      if (smaPrev != null && prev) {
        const wasAbove = prev.close >= smaPrev;
        const nowAbove = c.close >= sma;
        if (!wasAbove && nowAbove) bits.push("Close crossed back above SMA(5).");
        else if (wasAbove && !nowAbove) bits.push("Close crossed under SMA(5).");
        else bits.push(nowAbove ? "Close remains above SMA(5)." : "Close remains below SMA(5).");
      } else {
        bits.push(c.close >= sma ? "Close is above SMA(5)." : "Close is below SMA(5).");
      }
    } else if (overlays.ema?.[i] != null) {
      const ema = overlays.ema[i]!;
      bits.push(c.close >= ema ? "Close is above EMA(4)." : "Close is below EMA(4).");
    }

    const rsi = overlays.rsi?.[i];
    if (rsi != null) {
      if (rsi >= 70) bits.push(`RSI(5) is ${rsi.toFixed(0)} — stretched high on this SAMPLE oscillator.`);
      else if (rsi <= 30) bits.push(`RSI(5) is ${rsi.toFixed(0)} — stretched low on this SAMPLE oscillator.`);
    }

    if (i === n - 1 && n > 1) {
      bits.push("Last bar in this window: later frequencies or markets will tell a different SAMPLE path.");
    }

    return {
      index: i,
      step: i + 1,
      of: n,
      barName: label,
      headline,
      detail: bits.join(" "),
    };
  });
}

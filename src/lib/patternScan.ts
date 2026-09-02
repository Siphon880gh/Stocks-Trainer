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

/** Candle indexes that make up a scanned pattern (for chart highlight). */
export function patternBarIndices(pattern: DetectedPattern): number[] {
  const i = pattern.index;
  if (pattern.name.includes("Engulfing")) {
    return i > 0 ? [i - 1, i] : [i];
  }
  if (pattern.name === "Morning Star") {
    return i >= 2 ? [i - 2, i - 1, i] : [i];
  }
  return [i];
}

export type ChartProgressionAnchor =
  | "high"
  | "sma"
  | "ema"
  | "bbMid"
  | "rsi"
  | "macd";

export interface ChartProgressionNote {
  id: string;
  index: number;
  step: number;
  of: number;
  barName: string;
  headline: string;
  detail: string;
  anchor: ChartProgressionAnchor;
  y: number;
}

export interface ProgressionOverlayValues {
  sma?: Array<number | null>;
  ema?: Array<number | null>;
  rsi?: Array<number | null>;
  macd?: Array<number | null>;
  macdSignal?: Array<number | null>;
  macdHist?: Array<number | null>;
  bbMid?: Array<number | null>;
  bbUpper?: Array<number | null>;
  bbLower?: Array<number | null>;
}

const ANCHOR_RANK: Record<ChartProgressionAnchor, number> = {
  high: 0,
  sma: 1,
  ema: 2,
  bbMid: 3,
  rsi: 4,
  macd: 5,
};

type OverlayDraft = {
  index: number;
  anchor: Exclude<ChartProgressionAnchor, "high">;
  y: number;
  headline: string;
  bits: string[];
};

function displayBarName(name: string): string {
  return name.replace(/^D-/, "");
}

function pctFrom(base: number, value: number): string {
  if (base === 0) return "flat vs the first open";
  const pct = ((value - base) / Math.abs(base)) * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% vs the first open`;
}

function pushOverlay(drafts: OverlayDraft[], next: OverlayDraft): void {
  const existing = drafts.find(
    (d) => d.index === next.index && d.anchor === next.anchor,
  );
  if (existing) {
    existing.bits.push(...next.bits);
    if (!/turns|cross|recapture|loses|stretch|band/i.test(existing.headline)) {
      existing.headline = next.headline;
    }
    return;
  }
  drafts.push({ ...next, bits: [...next.bits] });
}

function movingAverageEvents(
  data: OHLC[],
  series: Array<number | null> | undefined,
  spec: { anchor: "sma" | "ema"; label: string; startDetail: string },
  drafts: OverlayDraft[],
): void {
  if (!series) return;
  let started = false;
  for (let i = 0; i < data.length; i++) {
    const v = series[i];
    if (v == null) continue;
    const bits: string[] = [];
    let headline = `${spec.label} on this SAMPLE window`;
    if (!started) {
      started = true;
      bits.push(spec.startDetail);
      headline = `${spec.label} begins on this SAMPLE window`;
    }
    const prev = i > 0 ? series[i - 1] : null;
    const prev2 = i > 1 ? series[i - 2] : null;
    if (prev != null && prev2 != null) {
      const d0 = prev - prev2;
      const d1 = v - prev;
      if (d0 < 0 && d1 > 0) {
        bits.push(
          `${spec.label} turns higher — the average is starting to rise.`,
        );
        headline = `${spec.label} turns higher`;
      } else if (d0 > 0 && d1 < 0) {
        bits.push(
          `${spec.label} turns lower — the average is starting to fall.`,
        );
        headline = `${spec.label} turns lower`;
      }
    }
    const c = data[i]!;
    const p = i > 0 ? data[i - 1] : undefined;
    if (prev != null && p) {
      const wasAbove = p.close >= prev;
      const nowAbove = c.close >= v;
      if (!wasAbove && nowAbove) {
        bits.push(`Close crossed back above ${spec.label}.`);
        headline = `Close recaptures ${spec.label}`;
      } else if (wasAbove && !nowAbove) {
        bits.push(`Close crossed under ${spec.label}.`);
        headline = `Close loses ${spec.label}`;
      }
    }
    if (bits.length === 0) continue;
    pushOverlay(drafts, {
      index: i,
      anchor: spec.anchor,
      y: v,
      headline,
      bits,
    });
  }
}

function overlayEvents(
  data: OHLC[],
  overlays: ProgressionOverlayValues,
): OverlayDraft[] {
  const drafts: OverlayDraft[] = [];
  movingAverageEvents(
    data,
    overlays.sma,
    {
      anchor: "sma",
      label: "SMA(5)",
      startDetail: "SMA(5) starts here — five-bar average of closes.",
    },
    drafts,
  );
  movingAverageEvents(
    data,
    overlays.ema,
    {
      anchor: "ema",
      label: "EMA(4)",
      startDetail:
        "EMA(4) starts here — recent closes weigh more than older ones.",
    },
    drafts,
  );

  const { bbMid, bbUpper, bbLower } = overlays;
  if (bbMid) {
    let started = false;
    for (let i = 0; i < data.length; i++) {
      const mid = bbMid[i];
      if (mid == null) continue;
      const bits: string[] = [];
      let headline = "Bollinger mid on this SAMPLE window";
      if (!started) {
        started = true;
        bits.push(
          "Bollinger mid starts here — SMA of closes, with bands for stretch.",
        );
        headline = "Bollinger mid begins on this SAMPLE window";
      }
      const upper = bbUpper?.[i];
      const lower = bbLower?.[i];
      const prevUpper = i > 0 ? bbUpper?.[i - 1] : null;
      const prevLower = i > 0 ? bbLower?.[i - 1] : null;
      const c = data[i]!;
      const p = i > 0 ? data[i - 1] : undefined;
      if (upper != null && (p == null || prevUpper == null || p.close < prevUpper) && c.close >= upper) {
        bits.push(
          "Close prints at or above the upper band — stretched vs the recent average.",
        );
        headline = "Close reaches the upper Bollinger band";
      }
      if (lower != null && (p == null || prevLower == null || p.close > prevLower) && c.close <= lower) {
        bits.push(
          "Close prints at or below the lower band — stretched vs the recent average.",
        );
        headline = "Close reaches the lower Bollinger band";
      }
      if (bits.length === 0) continue;
      pushOverlay(drafts, {
        index: i,
        anchor: "bbMid",
        y: mid,
        headline,
        bits,
      });
    }
  }

  if (overlays.rsi) {
    for (let i = 0; i < data.length; i++) {
      const v = overlays.rsi[i];
      if (v == null) continue;
      const prev = i > 0 ? overlays.rsi[i - 1] : null;
      const bits: string[] = [];
      let headline = "RSI(5) on this SAMPLE oscillator";
      if (v >= 70 && (prev == null || prev < 70)) {
        bits.push(
          `RSI(5) is ${v.toFixed(0)} — stretched high on this SAMPLE oscillator.`,
        );
        headline = "RSI(5) stretches high";
      } else if (v <= 30 && (prev == null || prev > 30)) {
        bits.push(
          `RSI(5) is ${v.toFixed(0)} — stretched low on this SAMPLE oscillator.`,
        );
        headline = "RSI(5) stretches low";
      } else if (prev != null && prev >= 70 && v < 70) {
        bits.push("RSI(5) leaves the stretched-high zone.");
        headline = "RSI(5) leaves the high stretch";
      } else if (prev != null && prev <= 30 && v > 30) {
        bits.push("RSI(5) leaves the stretched-low zone.");
        headline = "RSI(5) leaves the low stretch";
      }
      if (bits.length === 0) continue;
      pushOverlay(drafts, {
        index: i,
        anchor: "rsi",
        y: v,
        headline,
        bits,
      });
    }
  }

  const { macd, macdSignal, macdHist } = overlays;
  if (macd) {
    for (let i = 0; i < data.length; i++) {
      const line = macd[i];
      if (line == null) continue;
      const bits: string[] = [];
      let headline = "MACD on this SAMPLE oscillator";
      const prevLine = i > 0 ? macd[i - 1] : null;
      const sig = macdSignal?.[i];
      const prevSig = i > 0 ? macdSignal?.[i - 1] : null;
      const hist = macdHist?.[i];
      const prevHist = i > 0 ? macdHist?.[i - 1] : null;
      if (hist != null && prevHist != null && prevHist < 0 && hist >= 0) {
        bits.push("MACD histogram crosses up through zero — momentum flipped positive.");
        headline = "MACD histogram turns positive";
      } else if (hist != null && prevHist != null && prevHist > 0 && hist <= 0) {
        bits.push("MACD histogram crosses down through zero — momentum flipped negative.");
        headline = "MACD histogram turns negative";
      }
      if (
        sig != null &&
        prevLine != null &&
        prevSig != null &&
        prevLine < prevSig &&
        line >= sig
      ) {
        bits.push("MACD line crossed above its signal line.");
        headline = "MACD crosses above signal";
      } else if (
        sig != null &&
        prevLine != null &&
        prevSig != null &&
        prevLine > prevSig &&
        line <= sig
      ) {
        bits.push("MACD line crossed below its signal line.");
        headline = "MACD crosses below signal";
      }
      if (bits.length === 0) continue;
      pushOverlay(drafts, {
        index: i,
        anchor: "macd",
        y: line,
        headline,
        bits,
      });
    }
  }

  return drafts;
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

  const barNotes: ChartProgressionNote[] = data.map((c, i) => {
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

    if (i === n - 1 && n > 1) {
      bits.push("Last bar in this window: later frequencies or markets will tell a different SAMPLE path.");
    }

    return {
      id: `bar-${i}`,
      index: i,
      step: 0,
      of: 0,
      barName: label,
      headline,
      detail: bits.join(" "),
      anchor: "high",
      y: c.high,
    };
  });

  const overlayNotes: ChartProgressionNote[] = overlayEvents(data, overlays).map(
    (d) => ({
      id: `${d.anchor}-${d.index}`,
      index: d.index,
      step: 0,
      of: 0,
      barName: displayBarName(data[d.index]?.name ?? ""),
      headline: d.headline,
      detail: d.bits.join(" "),
      anchor: d.anchor,
      y: d.y,
    }),
  );

  const notes = [...barNotes, ...overlayNotes].sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return ANCHOR_RANK[a.anchor] - ANCHOR_RANK[b.anchor];
  });
  const of = notes.length;
  return notes.map((note, i) => ({ ...note, step: i + 1, of }));
}

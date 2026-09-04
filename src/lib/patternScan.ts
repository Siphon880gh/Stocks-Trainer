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

function bodyLow(c: OHLC): number {
  return Math.min(c.open, c.close);
}

function bodyHigh(c: OHLC): number {
  return Math.max(c.open, c.close);
}

function isGreen(c: OHLC): boolean {
  return c.close >= c.open;
}

function isRed(c: OHLC): boolean {
  return c.close < c.open;
}

function bodyShare(c: OHLC): number {
  const range = c.high - c.low;
  if (range <= 0) return 0;
  return Math.abs(c.close - c.open) / range;
}

/** Prior closes: rally, decline, or flat. Threshold is 0.1% so short SAMPLE tapes still count. */
function closeTrend(data: OHLC[], i: number, lookback = 2): "up" | "down" | "flat" {
  if (i < 1) return "flat";
  const from = Math.max(0, i - lookback);
  const a = data[from]!.close;
  const b = data[i - 1]!.close;
  const thresh = Math.max(Math.abs(a) * 0.001, 1);
  if (b - a > thresh) return "up";
  if (a - b > thresh) return "down";
  return "flat";
}

function isEveningStar(data: OHLC[], i: number): boolean {
  if (i < 2 || i >= data.length) return false;
  const [first, mid, third] = [data[i - 2]!, data[i - 1]!, data[i]!];
  const firstUp = isGreen(first);
  const midSmall = Math.abs(mid.close - mid.open) < (mid.high - mid.low) * 0.3;
  const thirdDown = isRed(third);
  const thirdBody = Math.abs(third.close - third.open);
  const firstBody = Math.abs(first.close - first.open);
  const firstMid = (first.open + first.close) / 2;
  return firstUp && midSmall && thirdDown && thirdBody > firstBody * 0.5 && third.close < firstMid;
}

function isPiercingLine(curr: OHLC, prev: OHLC): boolean {
  if (!isRed(prev) || !isGreen(curr)) return false;
  if (isBullishEngulfing(curr, prev)) return false;
  const mid = (prev.open + prev.close) / 2;
  return curr.open < prev.close && curr.close > mid && curr.close < prev.open;
}

function isDarkCloudCover(curr: OHLC, prev: OHLC): boolean {
  if (!isGreen(prev) || !isRed(curr)) return false;
  if (isBearishEngulfing(curr, prev)) return false;
  const mid = (prev.open + prev.close) / 2;
  return curr.open > prev.close && curr.close < mid && curr.close > prev.open;
}

function isThreeWhiteSoldiers(data: OHLC[], i: number): boolean {
  if (i < 2) return false;
  const a = data[i - 2]!;
  const b = data[i - 1]!;
  const c = data[i]!;
  return (
    isGreen(a) &&
    isGreen(b) &&
    isGreen(c) &&
    bodyShare(a) >= 0.4 &&
    bodyShare(b) >= 0.4 &&
    bodyShare(c) >= 0.4 &&
    b.close > a.close &&
    c.close > b.close
  );
}

function isThreeBlackCrows(data: OHLC[], i: number): boolean {
  if (i < 2) return false;
  const a = data[i - 2]!;
  const b = data[i - 1]!;
  const c = data[i]!;
  return (
    isRed(a) &&
    isRed(b) &&
    isRed(c) &&
    bodyShare(a) >= 0.4 &&
    bodyShare(b) >= 0.4 &&
    bodyShare(c) >= 0.4 &&
    b.close < a.close &&
    c.close < b.close
  );
}

function isHarami(curr: OHLC, prev: OHLC): boolean {
  const currSpan = bodyHigh(curr) - bodyLow(curr);
  const prevSpan = bodyHigh(prev) - bodyLow(prev);
  if (prevSpan <= 0 || currSpan <= 0) return false;
  return (
    bodyLow(curr) > bodyLow(prev) &&
    bodyHigh(curr) < bodyHigh(prev) &&
    currSpan < prevSpan * 0.6
  );
}

function highsMatch(a: OHLC, b: OHLC): boolean {
  const thresh = Math.max(Math.abs(a.high) * 0.001, 1);
  return Math.abs(a.high - b.high) <= thresh;
}

function lowsMatch(a: OHLC, b: OHLC): boolean {
  const thresh = Math.max(Math.abs(a.low) * 0.001, 1);
  return Math.abs(a.low - b.low) <= thresh;
}

function extremeHighCount(data: OHLC[]): number {
  const maxH = Math.max(...data.map((c) => c.high));
  const thresh = Math.max(Math.abs(maxH) * 0.001, 1);
  return data.filter((c) => c.high >= maxH - thresh).length;
}

function extremeLowCount(data: OHLC[]): number {
  const minL = Math.min(...data.map((c) => c.low));
  const thresh = Math.max(Math.abs(minL) * 0.001, 1);
  return data.filter((c) => c.low <= minL + thresh).length;
}

function linSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (let i = 0; i < n; i++) {
    const y = values[i]!;
    sumX += i;
    sumY += y;
    sumXY += i * y;
    sumXX += i * i;
  }
  const den = n * sumXX - sumX * sumX;
  if (den === 0) return 0;
  return (n * sumXY - sumX * sumY) / den;
}

function slopeShare(values: number[]): number {
  const mid = values.reduce((s, v) => s + v, 0) / values.length;
  if (mid === 0) return 0;
  return linSlope(values) / Math.abs(mid);
}

function barRange(c: OHLC): number {
  return c.high - c.low;
}

function envelopeWidth(bars: OHLC[]): number {
  return Math.max(...bars.map((c) => c.high)) - Math.min(...bars.map((c) => c.low));
}

function converges(data: OHLC[]): boolean {
  const half = Math.max(2, Math.floor(data.length / 2));
  const early = envelopeWidth(data.slice(0, half));
  const late = envelopeWidth(data.slice(-half));
  return late < early * 0.85;
}

function localTroughs(data: OHLC[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i]!.low <= data[i - 1]!.low && data[i]!.low <= data[i + 1]!.low) {
      out.push(i);
    }
  }
  return out;
}

function soldOffHigh(c: OHLC): boolean {
  return c.close <= c.high - barRange(c) * 0.4;
}

function bouncedOffLow(c: OHLC): boolean {
  return c.close >= c.low + barRange(c) * 0.4;
}

function isBullFlag(data: OHLC[]): boolean {
  if (data.length < 6) return false;
  const pole = data.slice(0, 3);
  const flag = data.slice(3);
  const poleRise = pole[pole.length - 1]!.close - pole[0]!.close;
  const poleSpan = envelopeWidth(pole);
  if (poleRise < poleSpan * 0.45) return false;
  if (linSlope(flag.map((c) => c.close)) > 0) return false;
  return envelopeWidth(flag) <= poleSpan * 0.65;
}

function isRisingWedge(data: OHLC[]): boolean {
  if (data.length < 6 || isBullFlag(data)) return false;
  if (extremeHighCount(data) >= 2) return false;
  const highs = data.map((c) => c.high);
  const lows = data.map((c) => c.low);
  if (slopeShare(highs) <= 0.0006 || slopeShare(lows) <= 0.0006) return false;
  if (!converges(data)) return false;
  const last = data[data.length - 1]!;
  const lastMid = (last.high + last.low) / 2;
  const maxClose = Math.max(...data.map((c) => c.close));
  return last.close <= lastMid || last.close < maxClose;
}

function isFallingWedge(data: OHLC[]): boolean {
  if (data.length < 6) return false;
  if (extremeLowCount(data) >= 2) return false;
  const last = data[data.length - 1]!;
  const prev = data[data.length - 2]!;
  if (isRed(last) && isRed(prev) && last.close < prev.close) return false;
  const highs = data.map((c) => c.high);
  const lows = data.map((c) => c.low);
  if (slopeShare(highs) >= -0.0006 || slopeShare(lows) >= -0.0006) return false;
  return converges(data);
}

function isTriangle(data: OHLC[]): boolean {
  if (data.length < 6) return false;
  const highs = data.map((c) => c.high);
  const lows = data.map((c) => c.low);
  if (slopeShare(highs) >= -0.0004 || slopeShare(lows) <= 0.0004) return false;
  return converges(data);
}

function isDoubleTop(data: OHLC[]): boolean {
  if (data.length < 6) return false;
  const maxH = Math.max(...data.map((c) => c.high));
  const tol = Math.max(Math.abs(maxH) * 0.0015, 20);
  const peaks = data
    .map((c, i) => ({ i, h: c.high }))
    .filter((p) => p.h >= maxH - tol);
  if (peaks.length < 2) return false;
  const lastClose = data[data.length - 1]!.close;
  const drop = Math.max(Math.abs(maxH) * 0.005, 30);
  for (let a = 0; a < peaks.length; a++) {
    for (let b = a + 1; b < peaks.length; b++) {
      const i = peaks[a]!.i;
      const j = peaks[b]!.i;
      const sep = j - i;
      if (sep < 1) continue;
      if (sep < 2 && !soldOffHigh(data[i]!)) continue;
      const dip = Math.min(...data.slice(i, j + 1).map((c) => c.low));
      if (dip > maxH - Math.max(Math.abs(maxH) * 0.008, 40)) continue;
      if (lastClose < maxH - drop) return true;
    }
  }
  return false;
}

function isDoubleBottom(data: OHLC[]): boolean {
  if (data.length < 6) return false;
  const minL = Math.min(...data.map((c) => c.low));
  const tol = Math.max(Math.abs(minL) * 0.0015, 20);
  const troughs = localTroughs(data).filter((i) => data[i]!.low <= minL + tol);
  if (troughs.length < 2) return false;
  const lift = Math.max(Math.abs(minL) * 0.005, 30);
  for (let a = 0; a < troughs.length; a++) {
    for (let b = a + 1; b < troughs.length; b++) {
      const i = troughs[a]!;
      const j = troughs[b]!;
      const sep = j - i;
      if (sep < 1) continue;
      if (sep < 2 && !bouncedOffLow(data[i]!)) continue;
      const bounce = Math.max(...data.slice(i, j + 1).map((c) => c.high));
      if (bounce < minL + Math.max(Math.abs(minL) * 0.008, 40)) continue;
      if (data[data.length - 1]!.close > minL + lift) return true;
    }
  }
  return false;
}

function isHeadShoulders(data: OHLC[]): boolean {
  if (data.length < 6) return false;
  let head = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i]!.high > data[head]!.high) head = i;
  }
  if (head < 2 || head > data.length - 3) return false;
  const headH = data[head]!.high;
  let left = 0;
  for (let i = 0; i < head; i++) {
    if (data[i]!.high > data[left]!.high) left = i;
  }
  if (head - left < 1) return false;
  let right = head + 2;
  if (right >= data.length) return false;
  for (let i = head + 2; i < data.length; i++) {
    if (data[i]!.high >= data[right]!.high) right = i;
  }
  const leftH = data[left]!.high;
  const rightH = data[right]!.high;
  const prominence = Math.max(headH * 0.006, 80);
  if (headH < leftH + prominence || headH < rightH + prominence) return false;
  if (Math.abs(leftH - rightH) > Math.max(headH * 0.008, 80)) return false;
  return data[data.length - 1]!.close < leftH;
}

export const STRUCTURE_SCAN_NAMES = new Set([
  "Rising Wedge",
  "Falling Wedge",
  "Bull Flag",
  "Double Top",
  "Double Bottom",
  "Triangle",
  "Head and Shoulders",
]);

const STRUCTURE_WINDOWS = [6, 7, 8] as const;

function scanStructuresOnWindow(data: OHLC[]): DetectedPattern[] {
  if (data.length < 6) return [];
  const last = data.length - 1;
  const out: DetectedPattern[] = [];
  const push = (name: string, confidence: number, description: string) => {
    out.push({ index: last, name, confidence, description });
  };
  if (isHeadShoulders(data)) {
    push(
      "Head and Shoulders",
      86,
      "Three peaks: the middle high is the head. SAMPLE read — wait for the next print.",
    );
  } else if (isDoubleTop(data)) {
    push(
      "Double Top",
      84,
      "Two similar highs with a dip between. SAMPLE read — the second high failed to break out.",
    );
  }
  if (isDoubleBottom(data)) {
    push(
      "Double Bottom",
      84,
      "Two similar lows with a bounce between. SAMPLE read — the second low held.",
    );
  }
  if (isBullFlag(data)) {
    push(
      "Bull Flag",
      83,
      "A sharp rise, then a tight downward pause. SAMPLE read — the pause can be a rest.",
    );
  } else if (isRisingWedge(data)) {
    push(
      "Rising Wedge",
      82,
      "Price rises inside two upward, converging lines. SAMPLE read — buying is tiring.",
    );
  }
  if (isTriangle(data)) {
    push(
      "Triangle",
      80,
      "Highs and lows squeeze toward a point. SAMPLE read — wait for which side breaks.",
    );
  } else if (isFallingWedge(data)) {
    push(
      "Falling Wedge",
      82,
      "Price consolidates between two downward, converging lines. SAMPLE teaching.",
    );
  }
  return out;
}

function scanStructures(data: OHLC[]): DetectedPattern[] {
  if (data.length < 6) return [];
  const earliest = new Map<string, DetectedPattern>();
  for (let end = 5; end < data.length; end++) {
    for (const width of STRUCTURE_WINDOWS) {
      if (end + 1 < width) continue;
      const slice = data.slice(end + 1 - width, end + 1);
      for (const hit of scanStructuresOnWindow(slice)) {
        const mapped = { ...hit, index: end };
        const prev = earliest.get(mapped.name);
        if (!prev || mapped.index < prev.index) {
          earliest.set(mapped.name, mapped);
        }
      }
    }
  }
  return [...earliest.values()];
}

/** Scan OHLC data for patterns */
export function scanPatterns(data: OHLC[]): DetectedPattern[] {
  const results: DetectedPattern[] = [];
  for (let i = 0; i < data.length; i++) {
    const candle = data[i]!;
    const prev = i > 0 ? data[i - 1] : undefined;
    const wickSilhouette = isHammer(candle) || isShootingStar(candle);
    if (isDoji(candle, prev) && !wickSilhouette) {
      results.push({
        index: i,
        name: "Doji",
        confidence: 85,
        description: "Indecision; open ≈ close with long wicks.",
      });
    }
    if (isHammer(candle)) {
      if (closeTrend(data, i) === "up") {
        results.push({
          index: i,
          name: "Hanging Man",
          confidence: 86,
          description: "Same long lower wick as a hammer, but after a rally. Wait for the next print.",
        });
      } else {
        results.push({
          index: i,
          name: "Hammer",
          confidence: 88,
          description: "Bullish reversal; long lower shadow, small body at top.",
        });
      }
    }
    if (prev && isBullishEngulfing(candle, prev)) {
      results.push({
        index: i,
        name: "Bullish Engulfing",
        confidence: 90,
        description: "Green body engulfs previous red body; strong reversal signal.",
      });
    } else if (prev && isPiercingLine(candle, prev)) {
      results.push({
        index: i,
        name: "Piercing Line",
        confidence: 84,
        description: "Green opens lower then closes well into the prior red body — not a full cover.",
      });
    }
    if (prev && isBearishEngulfing(candle, prev)) {
      results.push({
        index: i,
        name: "Bearish Engulfing",
        confidence: 90,
        description: "Red body engulfs previous green body; bearish reversal signal.",
      });
    } else if (prev && isDarkCloudCover(candle, prev)) {
      results.push({
        index: i,
        name: "Dark Cloud Cover",
        confidence: 84,
        description: "Red opens higher then closes well into the prior green body — not a full cover.",
      });
    }
    if (isShootingStar(candle)) {
      if (closeTrend(data, i) === "down") {
        results.push({
          index: i,
          name: "Inverted Hammer",
          confidence: 85,
          description: "Long upper shadow at a bottom after a decline. Wait for the next print.",
        });
      } else {
        results.push({
          index: i,
          name: "Shooting Star",
          confidence: 85,
          description: "Long upper shadow at a top after a rally. Wait for the next print.",
        });
      }
    }
    if (isMorningStar(data, i)) {
      results.push({
        index: i,
        name: "Morning Star",
        confidence: 88,
        description: "Three-candle bullish reversal at bottom of downtrend.",
      });
    }
    if (isEveningStar(data, i)) {
      results.push({
        index: i,
        name: "Evening Star",
        confidence: 88,
        description: "Three-candle top: strong green, small middle, then strong red.",
      });
    }
    if (isThreeWhiteSoldiers(data, i)) {
      results.push({
        index: i,
        name: "Three White Soldiers",
        confidence: 87,
        description: "Three rising green bodies in a row. SAMPLE read: buyers in control.",
      });
    }
    if (isThreeBlackCrows(data, i)) {
      results.push({
        index: i,
        name: "Three Black Crows",
        confidence: 87,
        description: "Three falling red bodies in a row. SAMPLE read: sellers in control.",
      });
    }
    if (
      prev &&
      isHarami(candle, prev) &&
      !isBullishEngulfing(candle, prev) &&
      !isBearishEngulfing(candle, prev)
    ) {
      results.push({
        index: i,
        name: "Harami",
        confidence: 78,
        description: "A small body nested inside the prior larger body. Direction needs the next print.",
      });
    }
    if (
      prev &&
      highsMatch(prev, candle) &&
      closeTrend(data, i) === "up" &&
      extremeHighCount(data.slice(Math.max(0, i - 5), i + 1)) === 2
    ) {
      results.push({
        index: i,
        name: "Tweezer Top",
        confidence: 82,
        description: "Two candles share a similar high after a rally — matched rejection.",
      });
    }
    if (
      prev &&
      lowsMatch(prev, candle) &&
      closeTrend(data, i) === "down" &&
      extremeLowCount(data.slice(Math.max(0, i - 5), i + 1)) === 2
    ) {
      results.push({
        index: i,
        name: "Tweezer Bottom",
        confidence: 82,
        description: "Two candles share a similar low after a decline — matched support.",
      });
    }
  }
  results.push(...scanStructures(data));
  return results;
}

/** Candle indexes that make up a scanned pattern (for chart highlight). */
export function patternBarIndices(pattern: DetectedPattern): number[] {
  const i = pattern.index;
  if (pattern.name.includes("Engulfing")) {
    return i > 0 ? [i - 1, i] : [i];
  }
  if (
    pattern.name === "Morning Star" ||
    pattern.name === "Evening Star" ||
    pattern.name === "Three White Soldiers" ||
    pattern.name === "Three Black Crows"
  ) {
    return i >= 2 ? [i - 2, i - 1, i] : [i];
  }
  if (
    pattern.name === "Piercing Line" ||
    pattern.name === "Dark Cloud Cover" ||
    pattern.name === "Harami" ||
    pattern.name === "Tweezer Top" ||
    pattern.name === "Tweezer Bottom"
  ) {
    return i > 0 ? [i - 1, i] : [i];
  }
  if (STRUCTURE_SCAN_NAMES.has(pattern.name)) {
    const start = Math.max(0, i - 4);
    const span: number[] = [];
    for (let k = start; k <= i; k++) span.push(k);
    return span;
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

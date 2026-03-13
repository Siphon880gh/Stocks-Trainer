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

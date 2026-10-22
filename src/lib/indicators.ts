/** Simple Moving Average */
export function sma(closes: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += closes[i - j];
      result.push(sum / period);
    }
  }
  return result;
}

/** Exponential Moving Average */
export function ema(closes: number[], period: number): (number | null)[] {
  const k = 2 / (period + 1);
  const result: (number | null)[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += closes[j];
      result.push(sum / period);
    } else {
      const prev = result[i - 1]!;
      result.push(closes[i] * k + prev * (1 - k));
    }
  }
  return result;
}

/**
 * Relative Strength Index with Wilder's smoothing (the standard RSI).
 * The first average gain / loss is the simple mean of the first `period` close-to-close changes; after that
 * average = (previous average × (period − 1) + current gain or loss) / period. RSI = 100 − 100 / (1 + avg gain / avg loss);
 * 100 when the average loss is 0. Values start at index `period` (the first bar with `period` changes behind it).
 * Source: StockCharts ChartSchool, "Relative Strength Index (RSI)", and its cs-rsi.xls worked example (rsi.test.ts).
 */
/** RSI period the SAMPLE MarketChart pane uses: its packs are only ~12 bars, so 14 would leave the pane empty. */
export const MARKET_CHART_RSI_PERIOD = 5;

export function rsi(closes: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = closes.map(() => null);
  if (closes.length <= period) return result;
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i]! - closes[i - 1]!;
    if (diff > 0) avgGain += diff;
    else avgLoss -= diff;
  }
  avgGain /= period;
  avgLoss /= period;
  const value = () => (avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  result[period] = value();
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i]! - closes[i - 1]!;
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    result[i] = value();
  }
  return result;
}

/** MACD: returns { macd, signal, histogram } */
export function macd(
  closes: number[],
  fast = 12,
  slow = 26,
  signalPeriod = 9
): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } {
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const macdLine: (number | null)[] = closes.map((_, i) =>
    emaFast[i] != null && emaSlow[i] != null ? emaFast[i]! - emaSlow[i]! : null
  );
  // The signal is an EMA of the MACD values themselves, seeded from the first MACD value
  // (zero-filling the warm-up bars would drag the early signal toward 0).
  const start = macdLine.findIndex((v) => v != null);
  const signalLine: (number | null)[] = closes.map(() => null);
  if (start >= 0) {
    const sig = ema(macdLine.slice(start).map((v) => v!), signalPeriod);
    sig.forEach((v, j) => (signalLine[start + j] = v));
  }
  const histogram: (number | null)[] = macdLine.map((v, i) =>
    v != null && signalLine[i] != null ? v - signalLine[i]! : null
  );
  return { macd: macdLine, signal: signalLine, histogram };
}

/** Bollinger Bands: middle = SMA, upper/lower = middle ± k×std */
export function bollingerBands(
  closes: number[],
  period = 20,
  k = 2
): { middle: (number | null)[]; upper: (number | null)[]; lower: (number | null)[] } {
  const middle = sma(closes, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1 || middle[i] == null) {
      upper.push(null);
      lower.push(null);
    } else {
      let sumSq = 0;
      for (let j = 0; j < period; j++) {
        const d = closes[i - j]! - middle[i]!;
        sumSq += d * d;
      }
      const std = Math.sqrt(sumSq / period);
      upper.push(middle[i]! + k * std);
      lower.push(middle[i]! - k * std);
    }
  }
  return { middle, upper, lower };
}

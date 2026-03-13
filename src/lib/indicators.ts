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

/** Relative Strength Index */
export function rsi(closes: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      result.push(null);
    } else {
      let gains = 0;
      let losses = 0;
      for (let j = 1; j <= period; j++) {
        const diff = closes[i - j + 1]! - closes[i - j]!;
        if (diff > 0) gains += diff;
        else losses -= diff;
      }
      const avgGain = gains / period;
      const avgLoss = losses / period;
      if (avgLoss === 0) result.push(100);
      else result.push(100 - 100 / (1 + avgGain / avgLoss));
    }
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
  const macdValues = macdLine.map((v) => v ?? 0);
  const signalLine = ema(macdValues, signalPeriod).map((v, i) => (macdLine[i] != null ? v : null));
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

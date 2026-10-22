/**
 * Momentum oscillators and a volatility stop, computed from OHLC bars.
 *
 * Sources (each fetched and checked before it was cited here):
 * - Stochastic oscillator, fast / slow: StockCharts ChartSchool, "Stochastic Oscillator (Fast, Slow, and Full)"
 *   https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/stochastic-oscillator-fast-slow-and-full
 *   Fast %K = 100 × (close − lowest low n) / (highest high n − lowest low n); fast %D = SMA(3) of fast %K;
 *   slow %K = fast %K smoothed with SMA(3) (so slow %K equals fast %D); slow %D = SMA(3) of slow %K. Defaults (14, 3).
 *   Also Investopedia, "Stochastic Oscillator" https://www.investopedia.com/terms/s/stochasticoscillator.asp (80 / 20 levels).
 * - KDJ: Moomoo help center "KDJ" https://www.moomoo.com/us/support/topic3_142 and Capital.com "KDJ indicator"
 *   https://capital.com/en-int/learn/technical-analysis/kdj-indicator
 *   RSV = fast %K over n (default 9); K = 2/3 × previous K + 1/3 × RSV; D = 2/3 × previous D + 1/3 × K; J = 3K − 2D;
 *   K and D start at 50. This recursive 1/3 smoothing is the convention those platforms use. Some charting packages
 *   use SMA(3) smoothing instead, which reads like the slow stochastic; the two give different K values, so a level
 *   copied from another platform may not match.
 * - Average true range: StockCharts ChartSchool, "Average True Range (ATR)"
 *   https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/average-true-range-atr-and-average-true-range-percent-atrp
 *   TR = greatest of (high − low, |high − previous close|, |low − previous close|); the first ATR is the mean of the
 *   first n TR values; after that ATR = (previous ATR × (n − 1) + TR) / n.
 * - Volatility stop: TradingView's "Volatility Stop" indicator https://www.tradingview.com/script/v9YZoIw1-Volatility-Stop/
 *   (an ATR-based trend detector that can be used as a stop and does not move against the trend; defaults length 20,
 *   ATR factor 2) and TradingView Help Center https://www.tradingview.com/support/solutions/43000594676-volatility-stop/
 *   (stop distance = volatility measure × safety multiple, from a price anchor such as the close).
 *
 * Educational only. SIMULATED inputs in this app; nothing here is a buy or sell signal.
 */
import type { OHLC } from "./ohlcData";
import { sma } from "./indicators";

export type Series = (number | null)[];

/** SMA over the non-null tail of a series that starts with nulls (keeps the leading nulls). */
export function smaOfSeries(values: Series, period: number): Series {
  const start = values.findIndex((v) => v != null);
  const out: Series = values.map(() => null);
  if (start < 0) return out;
  const tail = values.slice(start).map((v) => v as number);
  sma(tail, period).forEach((v, j) => (out[start + j] = v));
  return out;
}

/** True range. The first bar has no previous close, so its TR is high − low. */
export function trueRange(bars: OHLC[]): number[] {
  return bars.map((b, i) => {
    if (i === 0) return b.high - b.low;
    const pc = bars[i - 1]!.close;
    return Math.max(b.high - b.low, Math.abs(b.high - pc), Math.abs(b.low - pc));
  });
}

/** Average true range: mean of the first n TRs, then (prev × (n − 1) + TR) / n. */
export function atr(bars: OHLC[], period = 14): Series {
  const tr = trueRange(bars);
  const out: Series = bars.map(() => null);
  if (bars.length < period) return out;
  let prev = tr.slice(0, period).reduce((s, v) => s + v, 0) / period;
  out[period - 1] = prev;
  for (let i = period; i < bars.length; i++) {
    prev = (prev * (period - 1) + tr[i]!) / period;
    out[i] = prev;
  }
  return out;
}

/**
 * Raw stochastic %K (also called RSV in KDJ): where the close sits in the last n bars' high-low range, 0–100.
 * A flat window (highest high = lowest low) has no range; it reads 50.
 */
export function rawStochastic(bars: OHLC[], period = 14): Series {
  return bars.map((b, i) => {
    if (i < period - 1) return null;
    let hh = -Infinity;
    let ll = Infinity;
    for (let j = i - period + 1; j <= i; j++) {
      hh = Math.max(hh, bars[j]!.high);
      ll = Math.min(ll, bars[j]!.low);
    }
    return hh === ll ? 50 : (100 * (b.close - ll)) / (hh - ll);
  });
}

/** Fast stochastic (the original form): %K raw, %D = SMA(d) of %K. */
export function fastStochastic(bars: OHLC[], period = 14, dPeriod = 3): { k: Series; d: Series } {
  const k = rawStochastic(bars, period);
  return { k, d: smaOfSeries(k, dPeriod) };
}

/** Slow stochastic: %K = SMA(slowing) of fast %K (equal to fast %D), %D = SMA(d) of slow %K. */
export function slowStochastic(bars: OHLC[], period = 14, dPeriod = 3, slowing = 3): { k: Series; d: Series } {
  const k = smaOfSeries(rawStochastic(bars, period), slowing);
  return { k, d: smaOfSeries(k, dPeriod) };
}

/** One KDJ smoothing step: next = ((m − 1) × previous + input) / m, i.e. 2/3 × previous + 1/3 × input for m = 3. */
export const kdjStep = (previous: number, input: number, m = 3) => ((m - 1) * previous + input) / m;

/** KDJ(n, m1, m2): K and D smoothed recursively from RSV (seeded at 50), J = 3K − 2D. Defaults (9, 3, 3). */
export function kdj(bars: OHLC[], period = 9, m1 = 3, m2 = 3): { k: Series; d: Series; j: Series } {
  const rsv = rawStochastic(bars, period);
  const k: Series = bars.map(() => null);
  const d: Series = bars.map(() => null);
  const j: Series = bars.map(() => null);
  let pk = 50;
  let pd = 50;
  rsv.forEach((r, i) => {
    if (r == null) return;
    pk = kdjStep(pk, r, m1);
    pd = kdjStep(pd, pk, m2);
    k[i] = pk;
    d[i] = pd;
    j[i] = 3 * pk - 2 * pd;
  });
  return { k, d, j };
}

export interface VolatilityStop {
  /** Stop level on each bar (null until ATR exists). */
  stop: Series;
  /** true = uptrend (stop under price), false = downtrend (stop over price), null before the first value. */
  up: (boolean | null)[];
  /** ATR × multiplier on each bar. */
  distance: Series;
  /** Bars where the trend flipped (close crossed the stop). */
  flips: number[];
}

/**
 * Volatility stop (ATR trailing stop) on closes, following the logic of TradingView's Volatility Stop:
 * in an uptrend the stop is the highest close since the trend began minus ATR × multiplier, and it never moves down;
 * in a downtrend it is the lowest close plus ATR × multiplier and never moves up. When the close crosses the stop the
 * trend flips and the stop restarts from that close. It starts (as an uptrend) on the first bar that has an ATR.
 */
export function volatilityStop(bars: OHLC[], period = 20, multiplier = 2): VolatilityStop {
  const a = atr(bars, period);
  const n = bars.length;
  const stop: Series = Array(n).fill(null);
  const up: (boolean | null)[] = Array(n).fill(null);
  const distance: Series = Array(n).fill(null);
  const flips: number[] = [];
  let peak = 0;
  let trough = 0;
  let level = 0;
  let trendUp = true;
  let started = false;
  for (let i = 0; i < n; i++) {
    if (a[i] == null) continue;
    const c = bars[i]!.close;
    const dist = a[i]! * multiplier;
    distance[i] = dist;
    if (!started) {
      started = true;
      peak = trough = c;
      trendUp = true;
      level = c - dist;
    } else {
      peak = Math.max(peak, c);
      trough = Math.min(trough, c);
      const candidate = trendUp ? Math.max(level, peak - dist) : Math.min(level, trough + dist);
      const nextUp = c >= candidate;
      if (nextUp !== trendUp) {
        flips.push(i);
        peak = trough = c;
        level = nextUp ? c - dist : c + dist;
      } else {
        level = candidate;
      }
      trendUp = nextUp;
    }
    stop[i] = level;
    up[i] = trendUp;
  }
  return { stop, up, distance, flips };
}

/** Pearson correlation of two series over the bars where both have values. */
export function correlation(a: Series, b: Series): number {
  const xs: number[] = [];
  const ys: number[] = [];
  a.forEach((v, i) => {
    const w = b[i];
    if (v != null && w != null) {
      xs.push(v);
      ys.push(w);
    }
  });
  const n = xs.length;
  if (n < 2) return 0;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i]! - mx) * (ys[i]! - my);
    sxx += (xs[i]! - mx) ** 2;
    syy += (ys[i]! - my) ** 2;
  }
  return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
}

/** Bars where line a crosses line b (sign of a − b changes). */
export function lineCrosses(a: Series, b: Series): { index: number; dir: "up" | "down" }[] {
  const out: { index: number; dir: "up" | "down" }[] = [];
  for (let i = 1; i < a.length; i++) {
    const p0 = a[i - 1], q0 = b[i - 1], p1 = a[i], q1 = b[i];
    if (p0 == null || q0 == null || p1 == null || q1 == null) continue;
    const d0 = p0 - q0;
    const d1 = p1 - q1;
    if (d0 <= 0 && d1 > 0) out.push({ index: i, dir: "up" });
    else if (d0 >= 0 && d1 < 0) out.push({ index: i, dir: "down" });
  }
  return out;
}

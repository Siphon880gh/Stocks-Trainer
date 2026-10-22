/**
 * Heikin-Ashi ("average pace") candles, per StockCharts ChartSchool:
 *   HA close = (O + H + L + C) / 4
 *   HA open  = (prev HA open + prev HA close) / 2, seeded on the first bar as (O + C) / 2
 *   HA high  = max(H, HA open, HA close)
 *   HA low   = min(L, HA open, HA close)
 * HA prices are averages, not traded prices: never use them for exact fills or stop levels.
 */
import type { OHLC } from "./ohlcData";

export type HaSeed = "open-close" | "open";

/** `seed: "open"` reproduces the StockCharts worked spreadsheet, whose first HA open is the first open. */
export function heikinAshi(bars: OHLC[], seed: HaSeed = "open-close"): OHLC[] {
  const out: OHLC[] = [];
  bars.forEach((b, i) => {
    const close = (b.open + b.high + b.low + b.close) / 4;
    const prev = out[i - 1];
    const open = prev ? (prev.open + prev.close) / 2 : seed === "open" ? b.open : (b.open + b.close) / 2;
    out.push({ name: b.name, open, close, high: Math.max(b.high, open, close), low: Math.min(b.low, open, close), volume: b.volume });
  });
  return out;
}

const EPS = 1e-9;
export const haUpperWick = (c: OHLC) => c.high - Math.max(c.open, c.close);
export const haLowerWick = (c: OHLC) => Math.min(c.open, c.close) - c.low;
/** Strong-up HA candle: green with no lower wick (the HA open is the low). */
export const isStrongUp = (c: OHLC) => c.close > c.open && haLowerWick(c) <= EPS;
/** Strong-down HA candle: red with no upper wick (the HA open is the high). */
export const isStrongDown = (c: OHLC) => c.close < c.open && haUpperWick(c) <= EPS;
/** Indecision HA candle: small body with wicks on both sides. */
export function isIndecision(c: OHLC, maxBodyShare = 0.3) {
  const range = c.high - c.low;
  return range > 0 && Math.abs(c.close - c.open) <= maxBodyShare * range && haUpperWick(c) > EPS && haLowerWick(c) > EPS;
}

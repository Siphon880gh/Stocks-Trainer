import { barsFromCloses, closesFromKnots, type Bar } from "./narrativeEngine";
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const r2 = (v: number) => Math.round(v * 100) / 100;

/** RSI right chart: sideways range 92–108. */
export function rsiRange(): Bar[] {
  const c = range(80).map((i) => r2(100 + 8 * Math.sin((i * 2 * Math.PI) / 26) + 0.8 * Math.sin(i * 1.7)));
  return barsFromCloses(c, { wick: 0.6 });
}
/** RSI wrong chart: steady downtrend with weak bounces. */
export function rsiDowntrend(): Bar[] {
  const c = range(80).map((i) => r2(120 - 0.45 * i + 1.6 * Math.sin((i * 2 * Math.PI) / 13)));
  return barsFromCloses(c, { wick: 0.6 });
}
/** MA right chart: smooth uptrend with shallow pullbacks. */
export function maTrend(): Bar[] {
  const c = range(90).map((i) => r2(100 + (i < 36 ? -0.15 * i : -5.4 + 0.6 * (i - 36)) + 1.5 * Math.sin((i * 2 * Math.PI) / 12)));
  return barsFromCloses(c, { wick: 0.5 });
}
/** MA wrong chart: choppy range. */
export function maChop(): Bar[] {
  const c = range(90).map((i) => r2(100 + 3.5 * Math.sin((i * 2 * Math.PI) / 22) + 1.2 * Math.sin(i * 0.9)));
  return barsFromCloses(c, { wick: 0.5 });
}

export interface BreakoutSet { bars: Bar[]; pivot: number; handleLow: number; cupDepth: number; fromIndex: number }
/** Cup and handle after an uptrend; breakout on ~3x volume (right chart). */
export function cupGood(): BreakoutSet {
  const c = closesFromKnots([[0, 80], [15, 100], [30, 82], [45, 99.5], [50, 96.5], [55, 99], [56, 102.5], [70, 121]], 0.35);
  const bars = barsFromCloses(c, { wick: 0.5, volume: (i) => (i >= 46 && i <= 55 ? 600_000 : i === 56 ? 3_000_000 : i > 56 ? 1_500_000 : 1_000_000 + 80_000 * Math.sin(i)) });
  return { bars, pivot: 100, handleLow: 95.5, cupDepth: 18, fromIndex: 46 };
}
/** Same-looking base inside a downtrend; volume breakout fails back into the range (wrong chart). */
export function cupWrong(): BreakoutSet {
  const c = closesFromKnots([[0, 125], [15, 100], [30, 84], [45, 99.5], [50, 96.5], [55, 99], [56, 101.5], [58, 100.5], [64, 93], [70, 88]], 0.35);
  const bars = barsFromCloses(c, { wick: 0.5, volume: (i) => (i >= 46 && i <= 55 ? 900_000 : i === 56 ? 2_400_000 : 1_100_000 + 80_000 * Math.sin(i)) });
  return { bars, pivot: 100, handleLow: 95.5, cupDepth: 16, fromIndex: 46 };
}
const t5 = (i: number) => { const m = 390 + i * 5; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; };
/** Trend day: holds above VWAP, pullbacks tag it (5m, right chart). */
export function vwapTrend(): Bar[] {
  const c = closesFromKnots([[0, 100], [8, 104], [13, 102.2], [20, 106], [26, 104.3], [34, 108.5], [39, 110]], 0.25);
  return barsFromCloses(c, { wick: 0.6, start: 99.6, label: t5, volume: (i) => (i < 6 ? 2_000_000 : 1_000_000) * (1 + 0.2 * Math.sin(i)) });
}
/** Range day: price chops back and forth through VWAP (wrong chart). */
export function vwapRange(): Bar[] {
  const c = range(40).map((i) => r2(100 + 1.4 * Math.sin((i * 2 * Math.PI) / 9) + 0.3 * Math.sin(i * 1.3)));
  return barsFromCloses(c, { wick: 0.5, start: 99.8, label: t5, volume: (i) => 1_000_000 * (1 + 0.2 * Math.sin(i)) });
}
/** Lower low on fading momentum, then a turn (right chart). */
export function macdGood(): Bar[] {
  const c = closesFromKnots([[0, 130], [36, 100], [46, 107], [62, 98], [92, 116]], 0.4);
  return barsFromCloses(c, { wick: 0.5 });
}
/** Accelerating downtrend: an early 'divergence' just precedes another leg down (wrong chart). */
export function macdWrong(): Bar[] {
  const c = closesFromKnots([[0, 130], [36, 104], [44, 109], [54, 102], [60, 106], [92, 80]], 0.4);
  return barsFromCloses(c, { wick: 0.5 });
}
/** Volatile, then a tight squeeze, then an upside expansion (right chart). */
export function squeezeGood(): Bar[] {
  const c = range(80).map((i) => r2(i < 30 ? 100 + 4 * Math.sin(i * 0.9) : i < 56 ? 100 + 0.35 * Math.sin(i * 1.3) : 100 + 0.9 * (i - 55) + 0.4 * Math.sin(i)));
  return barsFromCloses(c, { wick: 0.4 });
}
/** Same squeeze, but the upside break is a head-fake that reverses (wrong chart). */
export function squeezeWrong(): Bar[] {
  const c = range(80).map((i) => r2(i < 30 ? 100 + 4 * Math.sin(i * 0.9) : i < 56 ? 100 + 0.35 * Math.sin(i * 1.3) : i < 58 ? 100 + 1.1 * (i - 55) : 102.2 - 0.9 * (i - 57) + 0.3 * Math.sin(i)));
  return barsFromCloses(c, { wick: 0.4 });
}

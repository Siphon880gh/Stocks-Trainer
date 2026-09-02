export interface OHLC {
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

function ohlc(
  name: string,
  open: number,
  high: number,
  low: number,
  close: number
): OHLC {
  return { name, open, high, low, close };
}

/** Generic trend data for Market page — labeled as US cash RTH (not extended hours). */
export const SAMPLE_OHLC: OHLC[] = [
  ohlc("09:30", 63200, 63800, 63000, 63600),
  ohlc("10:00", 63600, 64200, 63400, 63800),
  ohlc("10:30", 63800, 64100, 63400, 63500), // Red candle
  ohlc("11:00", 63200, 63900, 62800, 63800), // Bullish Engulfing: green engulfs prev red
  ohlc("11:30", 63650, 64000, 63200, 63650), // Doji: open≈close, long wicks
  ohlc("12:00", 63800, 64400, 63600, 64000),
  ohlc("12:30", 64000, 64800, 63800, 64200),
  ohlc("13:00", 64200, 65000, 64000, 64600),
  ohlc("13:30", 64600, 65200, 64400, 64800),
  ohlc("14:00", 64800, 65400, 64600, 65000),
  ohlc("14:30", 65000, 65600, 64800, 65200),
  ohlc("15:00", 65200, 65800, 65000, 65500),
];

/** 12 half-hour labels across a US equity regular session (09:30–15:00). */
export const RTH_BAR_LABELS_12 = [
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
] as const;

/** Continuous 24h session labels (crypto / futures SAMPLE packs). */
export const SESSION_24H_LABELS_12 = [
  "00:00",
  "02:00",
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
] as const;

export function withBarLabels(
  data: OHLC[],
  labels: readonly string[]
): OHLC[] {
  return data.map((d, i) => ({ ...d, name: labels[i] ?? d.name }));
}

/** TradingView-style chart windows. Finer than the pack's native bars stay unavailable. */
export const CHART_FREQUENCIES: ReadonlyArray<{ minutes: number; label: string }> = [
  { minutes: 1, label: "1m" },
  { minutes: 5, label: "5m" },
  { minutes: 15, label: "15m" },
  { minutes: 30, label: "30m" },
  { minutes: 60, label: "1h" },
  { minutes: 120, label: "2h" },
  { minutes: 240, label: "4h" },
  { minutes: 1440, label: "1D" },
];

export function formatBarFrequency(minutes: number): string {
  if (minutes >= 1440 && minutes % 1440 === 0) return `${minutes / 1440}D`;
  if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60}h`;
  return `${minutes}m`;
}

function clockMinutesFromLabel(name: string): number | null {
  const m = name.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh > 23 || mm > 59) return null;
  return hh * 60 + mm;
}

/** Native bar width from successive HH:MM labels (midnight wrap allowed). */
export function inferNativeBarMinutes(bars: OHLC[]): number | null {
  if (bars.length < 2) return null;
  const times = bars
    .map((b) => clockMinutesFromLabel(b.name))
    .filter((t): t is number => t != null);
  if (times.length < 2) return null;
  const counts = new Map<number, number>();
  let best = 0;
  let bestN = 0;
  for (let i = 1; i < times.length; i++) {
    let d = times[i] - times[i - 1];
    if (d <= 0) d += 24 * 60;
    const n = (counts.get(d) ?? 0) + 1;
    counts.set(d, n);
    if (n > bestN) {
      bestN = n;
      best = d;
    }
  }
  return best > 0 ? best : null;
}

export function canUseChartFrequency(
  nativeMinutes: number,
  targetMinutes: number,
  barCount: number,
): boolean {
  if (targetMinutes === nativeMinutes) return barCount >= 1;
  if (targetMinutes < nativeMinutes) return false;
  if (targetMinutes % nativeMinutes !== 0) return false;
  const group = targetMinutes / nativeMinutes;
  return Math.floor(barCount / group) >= 2;
}

export function chartFrequenciesForSeries(bars: OHLC[]): Array<{
  minutes: number;
  label: string;
  enabled: boolean;
}> {
  const native = inferNativeBarMinutes(bars);
  if (native == null) return [];
  const list = CHART_FREQUENCIES.map((f) => ({ ...f }));
  if (!list.some((f) => f.minutes === native)) {
    list.push({ minutes: native, label: formatBarFrequency(native) });
    list.sort((a, b) => a.minutes - b.minutes);
  }
  return list.map((f) => ({
    ...f,
    enabled: canUseChartFrequency(native, f.minutes, bars.length),
  }));
}

/** Collapse `groupSize` native bars into one candle. Drops a trailing partial group. */
export function aggregateOhlc(bars: OHLC[], groupSize: number): OHLC[] {
  if (groupSize <= 1) return bars;
  const out: OHLC[] = [];
  for (let i = 0; i + groupSize <= bars.length; i += groupSize) {
    const chunk = bars.slice(i, i + groupSize);
    out.push({
      name: chunk[0].name,
      open: chunk[0].open,
      high: Math.max(...chunk.map((c) => c.high)),
      low: Math.min(...chunk.map((c) => c.low)),
      close: chunk[chunk.length - 1].close,
    });
  }
  return out.length > 0 ? out : bars;
}

export function ohlcAtFrequency(
  bars: OHLC[],
  targetMinutes: number | null,
): OHLC[] {
  const native = inferNativeBarMinutes(bars);
  if (native == null || targetMinutes == null || targetMinutes === native) {
    return bars;
  }
  if (!canUseChartFrequency(native, targetMinutes, bars.length)) return bars;
  return aggregateOhlc(bars, targetMinutes / native);
}

/** Hammer pattern: long lower shadow, small body at top */
export const HAMMER_OHLC: OHLC[] = [
  ohlc("1", 63800, 64000, 63200, 63900),
  ohlc("2", 63900, 64200, 63500, 63800),
  ohlc("3", 63800, 64100, 63000, 63950), // Hammer: low 63000, open 63800, close 63950
  ohlc("4", 63950, 64200, 63700, 64100),
  ohlc("5", 64100, 64400, 63900, 64200),
];

/** Doji pattern: open ≈ close, long wicks */
export const DOJI_OHLC: OHLC[] = [
  ohlc("1", 64000, 64500, 63500, 64200),
  ohlc("2", 64200, 64400, 63800, 64100),
  ohlc("3", 64100, 64400, 63600, 64100), // Doji: open=close=64100
  ohlc("4", 64100, 64300, 63900, 64000),
  ohlc("5", 64000, 64200, 63700, 63900),
];

/** Bullish Engulfing: current green body engulfs previous red body */
export const ENGULFING_OHLC: OHLC[] = [
  ohlc("1", 64200, 64400, 63800, 63900),
  ohlc("2", 63900, 64100, 63500, 63700),
  ohlc("3", 63700, 64200, 63400, 64100),
  ohlc("4", 64100, 64400, 63900, 64300),
  ohlc("5", 64300, 64600, 64100, 64400),
];

/** Bearish Engulfing: red body engulfs prior green */
export const BEARISH_ENGULFING_OHLC: OHLC[] = [
  ohlc("1", 63800, 64200, 63600, 64100),
  ohlc("2", 64100, 64400, 63900, 64200),
  ohlc("3", 64200, 64500, 63400, 63500), // Red engulfs prev green
  ohlc("4", 63500, 63800, 63200, 63600),
  ohlc("5", 63600, 63900, 63300, 63700),
];

/** Shooting Star: long upper shadow, small body at bottom (bearish) */
export const SHOOTING_STAR_OHLC: OHLC[] = [
  ohlc("1", 63800, 64200, 63600, 64000),
  ohlc("2", 64000, 64500, 63900, 64100),
  ohlc("3", 64100, 64800, 64000, 64150), // Shooting star at 3
  ohlc("4", 64150, 64400, 63800, 64200),
  ohlc("5", 64200, 64500, 63900, 64300),
];

/** Inverted Hammer: long upper shadow, small body at bottom (bullish) */
export const INVERTED_HAMMER_OHLC: OHLC[] = [
  ohlc("1", 63600, 64000, 63200, 63800),
  ohlc("2", 63800, 64200, 63500, 63700),
  ohlc("3", 63700, 64500, 63600, 63750), // Inverted hammer at 3
  ohlc("4", 63750, 64100, 63500, 64000),
  ohlc("5", 64000, 64400, 63800, 64200),
];

/** Morning Star: 3-candle bullish reversal */
export const MORNING_STAR_OHLC: OHLC[] = [
  ohlc("1", 64200, 64400, 63800, 63900),
  ohlc("2", 63900, 64100, 63500, 63600),
  ohlc("3", 63600, 63700, 63400, 63650), // Small middle candle
  ohlc("4", 63650, 64200, 63500, 64100), // Large green
  ohlc("5", 64100, 64400, 63900, 64200),
];

/** Single green candle with readable wicks — anatomy quiz */
export const CANDLE_GREEN_OHLC: OHLC[] = [
  ohlc("1", 63600, 64000, 63400, 63800),
  ohlc("2", 63800, 64100, 63600, 63700),
  ohlc("3", 63700, 64800, 63500, 64600), // green: open 63700, close 64600, high 64800, low 63500
  ohlc("4", 64600, 64900, 64400, 64700),
];

/** Single red candle with readable wicks — anatomy quiz */
export const CANDLE_RED_OHLC: OHLC[] = [
  ohlc("1", 64600, 65000, 64400, 64800),
  ohlc("2", 64800, 65100, 64600, 64900),
  ohlc("3", 64900, 65100, 63600, 63800), // red: open 64900, close 63800, high 65100, low 63600
  ohlc("4", 63800, 64100, 63500, 63700),
];

/** Head and Shoulders (simplified): three peaks */
export const HEAD_SHOULDERS_OHLC: OHLC[] = [
  ohlc("1", 63000, 63500, 62800, 63200),
  ohlc("2", 63200, 63800, 63000, 63600),
  ohlc("3", 63600, 64200, 63400, 63800), // Left shoulder
  ohlc("4", 63800, 64800, 63600, 64400), // Head
  ohlc("5", 64400, 64600, 63800, 64000),
  ohlc("6", 64000, 64200, 63200, 63600), // Right shoulder
  ohlc("7", 63600, 63800, 63000, 63200),
  ohlc("8", 63200, 63400, 62800, 63000),
];

/** Falling Wedge (simplified): converging downtrend */
export const FALLING_WEDGE_OHLC: OHLC[] = [
  ohlc("1", 63800, 64200, 63400, 64000),
  ohlc("2", 64000, 64500, 63600, 63800),
  ohlc("3", 63800, 64100, 63200, 63500),
  ohlc("4", 63500, 63800, 63000, 63200),
  ohlc("5", 63200, 63500, 62800, 63400),
  ohlc("6", 63400, 63700, 63100, 63600),
];

export const PATTERN_OHLC: Record<string, OHLC[]> = {
  hammer: HAMMER_OHLC,
  doji: DOJI_OHLC,
  engulfing: ENGULFING_OHLC,
  "bullish-engulfing": ENGULFING_OHLC,
  "bearish-engulfing": BEARISH_ENGULFING_OHLC,
  "shooting-star": SHOOTING_STAR_OHLC,
  "inverted-hammer": INVERTED_HAMMER_OHLC,
  "morning-star": MORNING_STAR_OHLC,
  "candle-green": CANDLE_GREEN_OHLC,
  "candle-red": CANDLE_RED_OHLC,
  "head-shoulders": HEAD_SHOULDERS_OHLC,
  "falling-wedge": FALLING_WEDGE_OHLC,
};

/** High/low span across candles (and optional overlay values). */
export function ohlcPriceExtent(
  data: OHLC[],
  extras: Array<number | null | undefined> = []
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const d of data) {
    if (d.low < min) min = d.low;
    if (d.high > max) max = d.high;
  }
  for (const v of extras) {
    if (v == null || Number.isNaN(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 1 };
  }
  if (min === max) {
    const pad = Math.max(Math.abs(min) * 0.01, 1);
    return { min: min - pad, max: max + pad };
  }
  return { min, max };
}

/**
 * Fit a Y domain to price action. `zoom` > 1 zooms in; < 1 zooms out.
 * Default pad is ~12% of the data span (not a fixed dollar amount).
 */
export function paddedPriceDomain(
  min: number,
  max: number,
  zoom = 1
): [number, number] {
  const mid = (min + max) / 2;
  const span = Math.max(max - min, Math.abs(mid) * 0.001, 1e-6);
  const pad = span * 0.12;
  const z = Math.max(0.25, Math.min(zoom, 8));
  const half = (span / 2 + pad) / z;
  return [mid - half, mid + half];
}

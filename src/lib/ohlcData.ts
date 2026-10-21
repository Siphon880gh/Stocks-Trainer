import { SCENARIO_OHLC } from "./scenarioCharts";
import { ADVANCED_OHLC, ADVANCED_DRILL_SPECS } from "./advancedPatterns";

export interface OHLC {
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
  /** Optional traded volume (shares). Charts draw it only with `showVolume`. */
  volume?: number;
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

/** Two candles share a similar high after a rally. */
export const TWEEZER_TOP_OHLC: OHLC[] = [
  ohlc("1", 63600, 63900, 63400, 63800),
  ohlc("2", 63800, 64200, 63700, 64100),
  ohlc("3", 64100, 64600, 64000, 64400),
  ohlc("4", 64400, 64800, 64200, 64750),
  ohlc("5", 64600, 64800, 64300, 64400),
  ohlc("6", 64400, 64600, 64000, 64150),
];

/** Two candles share a similar low after a decline. */
export const TWEEZER_BOTTOM_OHLC: OHLC[] = [
  ohlc("1", 64400, 64600, 64000, 64100),
  ohlc("2", 64100, 64200, 63600, 63700),
  ohlc("3", 63700, 63800, 63200, 63300),
  ohlc("4", 63300, 63450, 62800, 62950),
  ohlc("5", 63000, 63500, 62800, 63400),
  ohlc("6", 63400, 63800, 63200, 63650),
];

/** Rising, converging range (≠ falling-wedge down-squeeze). */
export const RISING_WEDGE_OHLC: OHLC[] = [
  ohlc("1", 62800, 63200, 62600, 63000),
  ohlc("2", 63000, 63600, 62900, 63400),
  ohlc("3", 63400, 64000, 63250, 63700),
  ohlc("4", 63700, 64300, 63550, 64000),
  ohlc("5", 64000, 64500, 63850, 64100),
  ohlc("6", 64100, 64600, 63950, 64050),
];

/** Sharp rise, then a tight downward pause (≠ rising-wedge grind). */
export const BULL_FLAG_OHLC: OHLC[] = [
  ohlc("1", 62800, 63100, 62600, 62900),
  ohlc("2", 62900, 63800, 62800, 63700),
  ohlc("3", 63700, 64600, 63600, 64500),
  ohlc("4", 64500, 64650, 64100, 64200),
  ohlc("5", 64200, 64350, 63900, 64000),
  ohlc("6", 64000, 64150, 63750, 63850),
];

/** Two similar highs with a dip between (≠ head-and-shoulders three peaks). */
export const DOUBLE_TOP_OHLC: OHLC[] = [
  ohlc("1", 63200, 63600, 63000, 63400),
  ohlc("2", 63400, 64400, 63300, 64200),
  ohlc("3", 64200, 64600, 63800, 63900),
  ohlc("4", 63900, 64600, 63700, 64400),
  ohlc("5", 64400, 64550, 63600, 63750),
  ohlc("6", 63750, 63900, 63200, 63350),
];

/** Two similar lows with a bounce between (≠ tweezer-bottom two-bar match). */
export const DOUBLE_BOTTOM_OHLC: OHLC[] = [
  ohlc("1", 64400, 64600, 64000, 64100),
  ohlc("2", 64100, 64200, 63200, 63400),
  ohlc("3", 63400, 64200, 63300, 64000),
  ohlc("4", 64000, 64100, 63200, 63350),
  ohlc("5", 63350, 64100, 63250, 63950),
  ohlc("6", 63950, 64600, 63800, 64400),
];

/** Highs and lows squeeze toward a point (≠ wedge one-way tilt). */
export const TRIANGLE_OHLC: OHLC[] = [
  ohlc("1", 63600, 64800, 62800, 64000),
  ohlc("2", 64000, 64600, 63200, 63400),
  ohlc("3", 63400, 64300, 63300, 64100),
  ohlc("4", 64100, 64400, 63550, 63700),
  ohlc("5", 63700, 64200, 63650, 64050),
  ohlc("6", 64050, 64250, 63800, 63950),
];

/** Same long lower wick as a hammer, but after a rally (≠ hammer after a decline). */
export const HANGING_MAN_OHLC: OHLC[] = [
  ohlc("1", 62800, 63200, 62600, 63100),
  ohlc("2", 63100, 63600, 63000, 63500),
  ohlc("3", 63500, 64100, 63400, 64000),
  ohlc("4", 64000, 64150, 62800, 63900),
  ohlc("5", 63900, 64000, 63400, 63550),
  ohlc("6", 63550, 63700, 63000, 63150),
];

/** Large green, small middle, large red at the highs (≠ morning-star at the lows). */
export const EVENING_STAR_OHLC: OHLC[] = [
  ohlc("1", 62800, 63200, 62700, 63100),
  ohlc("2", 63100, 64000, 63000, 63900),
  ohlc("3", 63900, 64200, 63800, 64000),
  ohlc("4", 64000, 64100, 63000, 63150),
  ohlc("5", 63150, 63400, 62800, 62950),
  ohlc("6", 62950, 63200, 62600, 62750),
];

/** Green opens lower then closes into the prior red body (≠ full-cover engulfing). */
export const PIERCING_LINE_OHLC: OHLC[] = [
  ohlc("1", 64600, 64800, 64200, 64300),
  ohlc("2", 64300, 64400, 63700, 63800),
  ohlc("3", 63800, 63900, 62800, 62950),
  ohlc("4", 62600, 63600, 62500, 63500),
  ohlc("5", 63500, 63800, 63200, 63650),
  ohlc("6", 63650, 64000, 63400, 63800),
];

/** Red opens higher then closes into the prior green body (≠ full-cover bearish engulfing). */
export const DARK_CLOUD_COVER_OHLC: OHLC[] = [
  ohlc("1", 62800, 63100, 62600, 63000),
  ohlc("2", 63000, 63600, 62900, 63500),
  ohlc("3", 63500, 64600, 63400, 64450),
  ohlc("4", 64750, 64850, 63600, 63700),
  ohlc("5", 63700, 63900, 63200, 63350),
  ohlc("6", 63350, 63500, 62800, 62950),
];

/** Three rising green bodies after a decline (≠ one engulfing bar or a morning star). */
export const THREE_WHITE_SOLDIERS_OHLC: OHLC[] = [
  ohlc("1", 63600, 63800, 63000, 63150),
  ohlc("2", 63150, 63700, 63050, 63600),
  ohlc("3", 63600, 64200, 63500, 64100),
  ohlc("4", 64100, 64700, 64000, 64600),
  ohlc("5", 64600, 64900, 64400, 64750),
  ohlc("6", 64750, 65100, 64600, 64950),
];

/** Three falling red bodies after a rally (≠ one bearish engulfing bar). */
export const THREE_BLACK_CROWS_OHLC: OHLC[] = [
  ohlc("1", 64000, 64800, 63900, 64650),
  ohlc("2", 64650, 64750, 63800, 63900),
  ohlc("3", 63900, 64000, 63100, 63200),
  ohlc("4", 63200, 63300, 62400, 62550),
  ohlc("5", 62550, 62800, 62200, 62350),
  ohlc("6", 62350, 62600, 62000, 62150),
];

/** Small body nested inside the prior larger body (≠ engulfing full cover). */
export const HARAMI_OHLC: OHLC[] = [
  ohlc("1", 64800, 65000, 64400, 64550),
  ohlc("2", 64550, 64700, 64000, 64100),
  ohlc("3", 64100, 64600, 63000, 63150),
  ohlc("4", 63600, 63900, 63500, 63750),
  ohlc("5", 63750, 64000, 63300, 63450),
  ohlc("6", 63450, 63700, 63000, 63150),
];

/**
 * Reading one candle (Learn `candle-reading`). The marked candle is bar 4 (index 3);
 * bars 1–3 give context and bar 5 shows what followed.
 */

/** Price rejected higher: red, long upper wick, small body near the low, after a rally. */
export const CANDLE_REJECTED_HIGH_OHLC: OHLC[] = [
  ohlc("1", 63400, 63750, 63300, 63700),
  ohlc("2", 63700, 64050, 63600, 64000),
  ohlc("3", 64000, 64350, 63900, 64300),
  ohlc("4", 64300, 65300, 64150, 64200), // upper wick 1000, body 100, lower wick 50
  ohlc("5", 64200, 64300, 63800, 63900), // next close lower = follow-through
];

/** Price rejected lower: green, long lower wick, small body near the high, after a decline. */
export const CANDLE_REJECTED_LOW_OHLC: OHLC[] = [
  ohlc("1", 64800, 64900, 64400, 64450),
  ohlc("2", 64450, 64500, 64050, 64100),
  ohlc("3", 64100, 64150, 63700, 63750),
  ohlc("4", 63700, 63900, 62700, 63850), // lower wick 1000, body 150, upper wick 50
  ohlc("5", 63850, 64250, 63800, 64200), // next close higher = follow-through
];

/** Price stability (green): steady full bodies, tiny wicks, similar sizes. */
export const CANDLE_STABLE_GREEN_OHLC: OHLC[] = [
  ohlc("1", 63500, 63710, 63480, 63700),
  ohlc("2", 63700, 63890, 63690, 63880),
  ohlc("3", 63880, 64110, 63870, 64100),
  ohlc("4", 64100, 64310, 64090, 64300), // body 200, wicks 10
  ohlc("5", 64300, 64500, 64280, 64490),
];

/** Price stability (red): steady full bodies, tiny wicks, similar sizes. */
export const CANDLE_STABLE_RED_OHLC: OHLC[] = [
  ohlc("1", 64800, 64820, 64590, 64600),
  ohlc("2", 64600, 64610, 64420, 64430),
  ohlc("3", 64430, 64440, 64210, 64220),
  ohlc("4", 64220, 64230, 64010, 64020), // body 200, wicks 10
  ohlc("5", 64020, 64030, 63830, 63840),
];

/** Indecision (green): small body, wicks on both sides, inside a choppy range. */
export const CANDLE_INDECISION_GREEN_OHLC: OHLC[] = [
  ohlc("1", 64000, 64300, 63800, 64200),
  ohlc("2", 64200, 64350, 63900, 64000),
  ohlc("3", 64000, 64250, 63750, 64100),
  ohlc("4", 64050, 64450, 63650, 64120), // body 70, upper wick 330, lower wick 400
  ohlc("5", 64120, 64300, 63900, 64000),
];

/** Indecision (red): small body, wicks on both sides, after a short rally. */
export const CANDLE_INDECISION_RED_OHLC: OHLC[] = [
  ohlc("1", 63600, 63850, 63550, 63800),
  ohlc("2", 63800, 64100, 63750, 64050),
  ohlc("3", 64050, 64300, 64000, 64250),
  ohlc("4", 64280, 64650, 63900, 64200), // body 80, upper wick 370, lower wick 300
  ohlc("5", 64200, 64400, 63950, 64300),
];

/** Strong movement, bulls win: tall green body (open near low, close near high) after a quiet range. */
export const CANDLE_BULLS_WIN_OHLC: OHLC[] = [
  ohlc("1", 64000, 64150, 63850, 64050),
  ohlc("2", 64050, 64200, 63900, 63950),
  ohlc("3", 63950, 64100, 63850, 64050),
  ohlc("4", 64000, 64920, 63980, 64900), // body 900, wicks 20
  ohlc("5", 64900, 65050, 64700, 64850), // pause after the expansion
];

/** Strong movement, bears win: tall red body (open near high, close near low) after a quiet range. */
export const CANDLE_BEARS_WIN_OHLC: OHLC[] = [
  ohlc("1", 64500, 64650, 64350, 64450),
  ohlc("2", 64450, 64600, 64300, 64550),
  ohlc("3", 64550, 64650, 64400, 64450),
  ohlc("4", 64500, 64520, 63580, 63600), // body 900, wicks 20
  ohlc("5", 63600, 63800, 63450, 63700),
];

/** Candlestick pattern book (PDF lessons) — patterns not covered by the families above. */

/** White marubozu after a decline: tall green body, no wicks (open = low, close = high). */
export const WHITE_MARUBOZU_OHLC: OHLC[] = [
  ohlc("1", 64800, 64850, 64450, 64500),
  ohlc("2", 64500, 64550, 64150, 64200),
  ohlc("3", 64200, 64250, 63850, 63900),
  ohlc("4", 63900, 64700, 63900, 64700),
  ohlc("5", 64700, 64900, 64550, 64800),
];

/** Black marubozu after a rally: tall red body, no wicks (open = high, close = low). */
export const BLACK_MARUBOZU_OHLC: OHLC[] = [
  ohlc("1", 63500, 63850, 63450, 63800),
  ohlc("2", 63800, 64150, 63750, 64100),
  ohlc("3", 64100, 64450, 64050, 64400),
  ohlc("4", 64400, 64400, 63600, 63600),
  ohlc("5", 63600, 63750, 63300, 63450),
];

/** Spinning top after a decline: small body (bigger than a doji) with wicks both ways. */
export const SPINNING_TOP_OHLC: OHLC[] = [
  ohlc("1", 64600, 64700, 64250, 64300),
  ohlc("2", 64300, 64400, 63950, 64000),
  ohlc("3", 63980, 64400, 63550, 64130), // body 150, upper 270, lower 430
  ohlc("4", 64130, 64350, 63900, 64250),
  ohlc("5", 64250, 64450, 64100, 64200),
];

/** Bearish harami: tall green, then a small red body inside it, after a rally. */
export const BEARISH_HARAMI_OHLC: OHLC[] = [
  ohlc("1", 63300, 63550, 63250, 63500),
  ohlc("2", 63500, 63800, 63450, 63750),
  ohlc("3", 63750, 64700, 63700, 64600),
  ohlc("4", 64400, 64500, 64150, 64250), // body 64400→64250 sits inside 63750–64600
  ohlc("5", 64250, 64350, 63900, 64000),
];

/** Three inside up: tall red, small green inside it, then green closing above the first open. */
export const THREE_INSIDE_UP_OHLC: OHLC[] = [
  ohlc("1", 64900, 65000, 64550, 64600),
  ohlc("2", 64600, 64700, 64250, 64300),
  ohlc("3", 64300, 64350, 63300, 63400),
  ohlc("4", 63500, 63850, 63450, 63800),
  ohlc("5", 63800, 64500, 63750, 64450), // closes above 64300 (first candle's open)
];

/** Three inside down: tall green, small red inside it, then red closing below the first open. */
export const THREE_INSIDE_DOWN_OHLC: OHLC[] = [
  ohlc("1", 62900, 63250, 62850, 63200),
  ohlc("2", 63200, 63550, 63150, 63500),
  ohlc("3", 63500, 64450, 63450, 64400),
  ohlc("4", 64300, 64350, 63950, 64000),
  ohlc("5", 64000, 64050, 63350, 63400), // closes below 63500 (first candle's open)
];

/** Three outside up: short red, green that engulfs it, then a higher green close. */
export const THREE_OUTSIDE_UP_OHLC: OHLC[] = [
  ohlc("1", 64700, 64750, 64350, 64400),
  ohlc("2", 64400, 64450, 64050, 64100),
  ohlc("3", 64100, 64150, 63850, 63900),
  ohlc("4", 63800, 64400, 63750, 64350),
  ohlc("5", 64350, 64800, 64300, 64750),
];

/** Three outside down: short green, red that engulfs it, then a lower red close. */
export const THREE_OUTSIDE_DOWN_OHLC: OHLC[] = [
  ohlc("1", 63300, 63650, 63250, 63600),
  ohlc("2", 63600, 63950, 63550, 63900),
  ohlc("3", 63900, 64150, 63850, 64100),
  ohlc("4", 64200, 64250, 63600, 63650),
  ohlc("5", 63650, 63700, 63150, 63200),
];

/** On-neck: long red, then a small green that opens below its low and closes back at its close. */
export const ON_NECK_OHLC: OHLC[] = [
  ohlc("1", 64900, 64950, 64550, 64600),
  ohlc("2", 64600, 64650, 64250, 64300),
  ohlc("3", 64300, 64320, 63500, 63550),
  ohlc("4", 63300, 63560, 63250, 63540), // close ≈ prior close, never gets into the red body
  ohlc("5", 63540, 63580, 63100, 63150),
];

/** Bullish counterattack: long red, then a long green that opens far lower and closes at the same close. */
export const BULLISH_COUNTERATTACK_OHLC: OHLC[] = [
  ohlc("1", 65200, 65250, 64850, 64900),
  ohlc("2", 64900, 64950, 64500, 64550),
  ohlc("3", 64550, 64600, 63750, 63800),
  ohlc("4", 63050, 63820, 63000, 63800),
  ohlc("5", 63800, 64250, 63750, 64200),
];

/** Bearish counterattack: long green, then a long red that opens far higher and closes at the same close. */
export const BEARISH_COUNTERATTACK_OHLC: OHLC[] = [
  ohlc("1", 63000, 63350, 62950, 63300),
  ohlc("2", 63300, 63700, 63250, 63650),
  ohlc("3", 63650, 64450, 63600, 64400),
  ohlc("4", 65150, 65200, 64380, 64400),
  ohlc("5", 64400, 64450, 63950, 64000),
];

/** Rising three methods: long green, three small reds inside its range, long green to a new close high. */
export const RISING_THREE_METHODS_OHLC: OHLC[] = [
  ohlc("1", 63400, 63650, 63350, 63600),
  ohlc("2", 63600, 64500, 63550, 64450),
  ohlc("3", 64400, 64450, 64250, 64300),
  ohlc("4", 64300, 64350, 64100, 64150),
  ohlc("5", 64150, 64200, 63950, 64000),
  ohlc("6", 64000, 64850, 63950, 64800),
];

/** Falling three methods: long red, three small greens inside its range, long red to a new close low. */
export const FALLING_THREE_METHODS_OHLC: OHLC[] = [
  ohlc("1", 64900, 64950, 64650, 64700),
  ohlc("2", 64700, 64750, 63800, 63850),
  ohlc("3", 63900, 64100, 63850, 64050),
  ohlc("4", 64050, 64250, 64000, 64200),
  ohlc("5", 64200, 64400, 64150, 64350),
  ohlc("6", 64350, 64400, 63450, 63500),
];

/** Bullish mat hold: long green, gap up, three small drifting candles above the first low, long green. */
export const MAT_HOLD_OHLC: OHLC[] = [
  ohlc("1", 63300, 63550, 63250, 63500),
  ohlc("2", 63500, 64300, 63450, 64250),
  ohlc("3", 64500, 64550, 64350, 64400), // gaps above bar 2's high
  ohlc("4", 64400, 64420, 64200, 64250),
  ohlc("5", 64250, 64280, 64050, 64100),
  ohlc("6", 64100, 64800, 64080, 64750),
];

/** Upside tasuki gap: green, green that gaps up, then a red that closes inside the gap without filling it. */
export const UPSIDE_TASUKI_GAP_OHLC: OHLC[] = [
  ohlc("1", 63300, 63550, 63250, 63500),
  ohlc("2", 63500, 64100, 63450, 64050),
  ohlc("3", 64250, 64600, 64200, 64550), // gap: 64100–64200
  ohlc("4", 64450, 64500, 64120, 64150), // closes inside the gap
  ohlc("5", 64150, 64700, 64100, 64650),
];

/** Downside tasuki gap: red, red that gaps down, then a green that closes inside the gap without filling it. */
export const DOWNSIDE_TASUKI_GAP_OHLC: OHLC[] = [
  ohlc("1", 64900, 64950, 64650, 64700),
  ohlc("2", 64700, 64750, 64100, 64150),
  ohlc("3", 63950, 64000, 63600, 63650), // gap: 64000–64100
  ohlc("4", 63750, 64080, 63700, 64050), // closes inside the gap
  ohlc("5", 64050, 64100, 63400, 63450),
];

/** Candlestick encyclopedia (cheat-sheet lessons) — basic candles, doji and marubozu variants, gap and multi-candle patterns. */

/** Long green candle: tall body with normal wicks, much bigger than the quiet candles before it. */
export const LONG_GREEN_CANDLE_OHLC: OHLC[] = [
  ohlc("1", 64000, 64150, 63850, 64050),
  ohlc("2", 64050, 64200, 63900, 63950),
  ohlc("3", 63950, 64100, 63850, 64000),
  ohlc("4", 64000, 64850, 63900, 64750),
  ohlc("5", 64750, 64900, 64600, 64800),
];

/** Long red candle: tall body with normal wicks. */
export const LONG_RED_CANDLE_OHLC: OHLC[] = [
  ohlc("1", 64500, 64650, 64350, 64450),
  ohlc("2", 64450, 64600, 64300, 64550),
  ohlc("3", 64550, 64650, 64400, 64500),
  ohlc("4", 64500, 64600, 63650, 63750),
  ohlc("5", 63750, 63900, 63600, 63700),
];

/** Short green candle: small body, small range. */
export const SHORT_GREEN_CANDLE_OHLC: OHLC[] = [
  ohlc("1", 64000, 64200, 63850, 64100),
  ohlc("2", 64100, 64250, 63900, 63950),
  ohlc("3", 63950, 64150, 63850, 64100),
  ohlc("4", 64050, 64140, 63990, 64090),
  ohlc("5", 64090, 64300, 64000, 64200),
];

/** Short red candle: small body, small range. */
export const SHORT_RED_CANDLE_OHLC: OHLC[] = [
  ohlc("1", 64300, 64450, 64150, 64200),
  ohlc("2", 64200, 64350, 64050, 64300),
  ohlc("3", 64300, 64400, 64150, 64200),
  ohlc("4", 64230, 64270, 64140, 64190),
  ohlc("5", 64190, 64300, 64000, 64250),
];

/** Bullish closing marubozu: closes at the high (no upper wick), has a lower wick. */
export const BULLISH_CLOSING_MARUBOZU_OHLC: OHLC[] = [
  ohlc("1", 63500, 63750, 63450, 63700),
  ohlc("2", 63700, 63950, 63650, 63900),
  ohlc("3", 63900, 64150, 63850, 64100),
  ohlc("4", 64100, 64800, 63950, 64800),
  ohlc("5", 64800, 65000, 64700, 64900),
];

/** Bearish closing marubozu: closes at the low (no lower wick), has an upper wick. */
export const BEARISH_CLOSING_MARUBOZU_OHLC: OHLC[] = [
  ohlc("1", 64800, 64850, 64550, 64600),
  ohlc("2", 64600, 64650, 64350, 64400),
  ohlc("3", 64400, 64450, 64150, 64200),
  ohlc("4", 64200, 64350, 63500, 63500),
  ohlc("5", 63500, 63600, 63250, 63350),
];

/** Bullish opening marubozu: opens at the low (no lower wick), has an upper wick. */
export const BULLISH_OPENING_MARUBOZU_OHLC: OHLC[] = [
  ohlc("1", 63300, 63600, 63250, 63550),
  ohlc("2", 63550, 63800, 63500, 63750),
  ohlc("3", 63750, 64000, 63700, 63950),
  ohlc("4", 63950, 64700, 63950, 64550),
  ohlc("5", 64550, 64750, 64450, 64700),
];

/** Bearish opening marubozu: opens at the high (no upper wick), has a lower wick. */
export const BEARISH_OPENING_MARUBOZU_OHLC: OHLC[] = [
  ohlc("1", 65000, 65050, 64750, 64800),
  ohlc("2", 64800, 64850, 64550, 64600),
  ohlc("3", 64600, 64650, 64350, 64400),
  ohlc("4", 64400, 64400, 63600, 63750),
  ohlc("5", 63750, 63850, 63450, 63500),
];

/** Long-legged doji after a rally: open ≈ close with very long wicks both ways. */
export const LONG_LEGGED_DOJI_OHLC: OHLC[] = [
  ohlc("1", 63600, 63850, 63550, 63800),
  ohlc("2", 63800, 64050, 63750, 64000),
  ohlc("3", 64000, 64250, 63950, 64200),
  ohlc("4", 64200, 64750, 63650, 64210),
  ohlc("5", 64210, 64350, 63950, 64050),
];

/** Cross doji in a range: open = close, lower wick longer than the upper. */
export const CROSS_DOJI_OHLC: OHLC[] = [
  ohlc("1", 64000, 64200, 63850, 64100),
  ohlc("2", 64100, 64250, 63900, 63950),
  ohlc("3", 63950, 64150, 63800, 64050),
  ohlc("4", 64050, 64150, 63850, 64050),
  ohlc("5", 64050, 64200, 63900, 64100),
];

/** Inverted cross doji in a range: open = close near the low, upper wick much longer than the lower. */
export const INVERTED_CROSS_DOJI_OHLC: OHLC[] = [
  ohlc("1", 64100, 64300, 63950, 64200),
  ohlc("2", 64200, 64300, 64000, 64050),
  ohlc("3", 64050, 64250, 63900, 64150),
  ohlc("4", 64100, 64350, 64050, 64100),
  ohlc("5", 64100, 64250, 63950, 64000),
];

/** Dragonfly doji after a decline: open = close = high, long lower wick (buyers defended lower levels). */
export const DRAGONFLY_DOJI_OHLC: OHLC[] = [
  ohlc("1", 64800, 64850, 64450, 64500),
  ohlc("2", 64500, 64550, 64150, 64200),
  ohlc("3", 64200, 64250, 63850, 63900),
  ohlc("4", 63900, 63900, 63300, 63900),
  ohlc("5", 63900, 64300, 63850, 64250),
];

/** Gravestone doji after a rally: open = close = low, long upper wick (sellers defended upper levels). */
export const GRAVESTONE_DOJI_OHLC: OHLC[] = [
  ohlc("1", 63300, 63550, 63250, 63500),
  ohlc("2", 63500, 63850, 63450, 63800),
  ohlc("3", 63800, 64150, 63750, 64100),
  ohlc("4", 64100, 64700, 64100, 64100),
  ohlc("5", 64100, 64150, 63700, 63750),
];

/** Bullish kicker: red, then a green that gaps above the red's open and never looks back. */
export const BULLISH_KICKER_OHLC: OHLC[] = [
  ohlc("1", 64800, 64850, 64450, 64500),
  ohlc("2", 64500, 64550, 64150, 64200),
  ohlc("3", 64200, 64250, 63750, 63800),
  ohlc("4", 64300, 64900, 64280, 64850),
  ohlc("5", 64850, 65050, 64750, 64950),
];

/** Bearish kicker: green, then a red that gaps below the green's open. */
export const BEARISH_KICKER_OHLC: OHLC[] = [
  ohlc("1", 63200, 63550, 63150, 63500),
  ohlc("2", 63500, 63850, 63450, 63800),
  ohlc("3", 63800, 64250, 63750, 64200),
  ohlc("4", 63700, 63720, 63100, 63150),
  ohlc("5", 63150, 63250, 62850, 62950),
];

/** Bullish separating lines: in an uptrend, a red pullback, then a green opening at the red's open. */
export const BULLISH_SEPARATING_LINES_OHLC: OHLC[] = [
  ohlc("1", 63300, 63600, 63250, 63550),
  ohlc("2", 63550, 63850, 63500, 63800),
  ohlc("3", 63800, 63850, 63450, 63500),
  ohlc("4", 63800, 64400, 63780, 64350),
  ohlc("5", 64350, 64550, 64250, 64500),
];

/** Bearish separating lines: in a downtrend, a green bounce, then a red opening at the green's open. */
export const BEARISH_SEPARATING_LINES_OHLC: OHLC[] = [
  ohlc("1", 64800, 64850, 64450, 64500),
  ohlc("2", 64500, 64550, 64150, 64200),
  ohlc("3", 64200, 64550, 64150, 64500),
  ohlc("4", 64200, 64220, 63600, 63650),
  ohlc("5", 63650, 63750, 63400, 63450),
];

/** Bullish side-by-side white lines: green, gap up, then two similar greens side by side. */
export const BULLISH_SIDE_BY_SIDE_OHLC: OHLC[] = [
  ohlc("1", 63300, 63550, 63250, 63500),
  ohlc("2", 63500, 64000, 63450, 63950),
  ohlc("3", 64150, 64450, 64100, 64400),
  ohlc("4", 64160, 64470, 64120, 64420),
  ohlc("5", 64420, 64800, 64350, 64750),
];

/** Bearish side-by-side white lines: red, gap down, then two similar greens that stay below the gap. */
export const BEARISH_SIDE_BY_SIDE_OHLC: OHLC[] = [
  ohlc("1", 64900, 64950, 64650, 64700),
  ohlc("2", 64700, 64750, 64250, 64300),
  ohlc("3", 63850, 64100, 63800, 64050),
  ohlc("4", 63860, 64110, 63820, 64060),
  ohlc("5", 64060, 64080, 63500, 63550),
];

/** In-neck: long red, then a small green opening below its low and closing just inside its body. */
export const IN_NECK_OHLC: OHLC[] = [
  ohlc("1", 65100, 65150, 64750, 64800),
  ohlc("2", 64800, 64850, 64450, 64500),
  ohlc("3", 64500, 64520, 63700, 63750),
  ohlc("4", 63500, 63830, 63450, 63800),
  ohlc("5", 63800, 63820, 63300, 63350),
];

/** Thrusting: long red, then a green opening below its low and closing into the body but below its midpoint. */
export const THRUSTING_OHLC: OHLC[] = [
  ohlc("1", 64700, 64750, 64350, 64400),
  ohlc("2", 64400, 64450, 64050, 64100),
  ohlc("3", 64100, 64120, 63250, 63300),
  ohlc("4", 63100, 63580, 63050, 63550),
  ohlc("5", 63550, 63600, 63000, 63050),
];

/** Two crows: long green, a red that gaps up, then a red that opens inside it and closes inside the green body. */
export const TWO_CROWS_OHLC: OHLC[] = [
  ohlc("1", 63000, 63350, 62950, 63300),
  ohlc("2", 63300, 63650, 63250, 63600),
  ohlc("3", 63600, 64400, 63550, 64350),
  ohlc("4", 64600, 64700, 64450, 64500),
  ohlc("5", 64550, 64600, 63900, 63950),
  ohlc("6", 63950, 64000, 63600, 63650),
];

/** Upside gap two crows: long green, a red that gaps up, then a bigger red that engulfs it but still closes above the green. */
export const UPSIDE_GAP_TWO_CROWS_OHLC: OHLC[] = [
  ohlc("1", 62900, 63250, 62850, 63200),
  ohlc("2", 63200, 63550, 63150, 63500),
  ohlc("3", 63500, 64300, 63450, 64250),
  ohlc("4", 64500, 64600, 64350, 64400),
  ohlc("5", 64550, 64650, 64280, 64300),
  ohlc("6", 64300, 64320, 63800, 63850),
];

/** Bullish abandoned baby: long red, a doji that gaps below it, then a green that gaps above the doji. */
export const BULLISH_ABANDONED_BABY_OHLC: OHLC[] = [
  ohlc("1", 65000, 65050, 64650, 64700),
  ohlc("2", 64700, 64750, 64350, 64400),
  ohlc("3", 64400, 64420, 63650, 63700),
  ohlc("4", 63450, 63550, 63350, 63450),
  ohlc("5", 63700, 64300, 63650, 64250),
  ohlc("6", 64250, 64500, 64150, 64400),
];

/** Bearish abandoned baby: long green, a doji that gaps above it, then a red that gaps below the doji. */
export const BEARISH_ABANDONED_BABY_OHLC: OHLC[] = [
  ohlc("1", 63000, 63350, 62950, 63300),
  ohlc("2", 63300, 63650, 63250, 63600),
  ohlc("3", 63600, 64350, 63580, 64300),
  ohlc("4", 64550, 64650, 64450, 64550),
  ohlc("5", 64300, 64400, 63700, 63750),
  ohlc("6", 63750, 63800, 63400, 63450),
];

/** Bullish tri star: three dojis after a decline, the middle one gapped below the other two. */
export const BULLISH_TRI_STAR_OHLC: OHLC[] = [
  ohlc("1", 64800, 64850, 64450, 64500),
  ohlc("2", 64500, 64550, 64150, 64200),
  ohlc("3", 64200, 64250, 63850, 63900),
  ohlc("4", 63800, 63900, 63650, 63800),
  ohlc("5", 63550, 63620, 63400, 63550),
  ohlc("6", 63750, 63900, 63680, 63750),
  ohlc("7", 63750, 64200, 63700, 64150),
];

/** Bearish tri star: three dojis after a rally, the middle one gapped above the other two. */
export const BEARISH_TRI_STAR_OHLC: OHLC[] = [
  ohlc("1", 63200, 63550, 63150, 63500),
  ohlc("2", 63500, 63850, 63450, 63800),
  ohlc("3", 63800, 64150, 63750, 64100),
  ohlc("4", 64200, 64350, 64100, 64200),
  ohlc("5", 64450, 64600, 64400, 64450),
  ohlc("6", 64250, 64380, 64150, 64250),
  ohlc("7", 64250, 64300, 63800, 63850),
];

/** Bullish three-line strike: three rising greens, then one red that erases them (traditionally a pause in an uptrend). */
export const BULLISH_THREE_LINE_STRIKE_OHLC: OHLC[] = [
  ohlc("1", 63200, 63450, 63150, 63400),
  ohlc("2", 63400, 63750, 63350, 63700),
  ohlc("3", 63700, 64050, 63650, 64000),
  ohlc("4", 64000, 64350, 63950, 64300),
  ohlc("5", 64350, 64400, 63300, 63350),
  ohlc("6", 63350, 63800, 63300, 63700),
];

/** Bearish three-line strike: three falling reds, then one green that erases them. */
export const BEARISH_THREE_LINE_STRIKE_OHLC: OHLC[] = [
  ohlc("1", 64800, 64850, 64550, 64600),
  ohlc("2", 64600, 64650, 64250, 64300),
  ohlc("3", 64300, 64350, 63950, 64000),
  ohlc("4", 64000, 64050, 63650, 63700),
  ohlc("5", 63650, 64650, 63600, 64620),
  ohlc("6", 64620, 64700, 64200, 64250),
];

/** Upside gap three methods: two greens with a gap between, then a red that fills the gap. */
export const UPSIDE_GAP_THREE_METHODS_OHLC: OHLC[] = [
  ohlc("1", 63300, 63550, 63250, 63500),
  ohlc("2", 63500, 64000, 63450, 63950),
  ohlc("3", 64150, 64600, 64100, 64550),
  ohlc("4", 64400, 64450, 63750, 63800),
  ohlc("5", 63800, 64300, 63750, 64250),
];

/** Downside gap three methods: two reds with a gap between, then a green that fills the gap. */
export const DOWNSIDE_GAP_THREE_METHODS_OHLC: OHLC[] = [
  ohlc("1", 64900, 64950, 64650, 64700),
  ohlc("2", 64700, 64750, 64200, 64250),
  ohlc("3", 64050, 64100, 63600, 63650),
  ohlc("4", 63800, 64500, 63750, 64450),
  ohlc("5", 64450, 64500, 63950, 64000),
];

/** Bullish breakaway: long red, a red gap down, three small lower candles, then a long green closing into the gap. */
export const BULLISH_BREAKAWAY_OHLC: OHLC[] = [
  ohlc("1", 64900, 64950, 64650, 64700),
  ohlc("2", 64700, 64750, 64350, 64400),
  ohlc("3", 64400, 64420, 63800, 63850),
  ohlc("4", 63650, 63700, 63450, 63500),
  ohlc("5", 63500, 63550, 63300, 63350),
  ohlc("6", 63250, 63400, 63150, 63300),
  ohlc("7", 63300, 63780, 63250, 63750),
  ohlc("8", 63750, 64100, 63700, 64050),
];

/** Bearish breakaway: long green, a green gap up, three small higher candles, then a long red closing into the gap. */
export const BEARISH_BREAKAWAY_OHLC: OHLC[] = [
  ohlc("1", 63000, 63300, 62950, 63250),
  ohlc("2", 63250, 63600, 63200, 63550),
  ohlc("3", 63550, 64150, 63500, 64100),
  ohlc("4", 64300, 64500, 64250, 64450),
  ohlc("5", 64450, 64650, 64400, 64600),
  ohlc("6", 64600, 64800, 64550, 64700),
  ohlc("7", 64700, 64750, 64180, 64200),
  ohlc("8", 64200, 64250, 63850, 63900),
];

/** Bearish mat hold: long red, a gap down, three small bounce candles below the first high, then a long red. */
export const BEARISH_MAT_HOLD_OHLC: OHLC[] = [
  ohlc("1", 64900, 64950, 64650, 64700),
  ohlc("2", 64700, 64750, 63900, 63950),
  ohlc("3", 63750, 63850, 63700, 63800),
  ohlc("4", 63800, 64000, 63780, 63950),
  ohlc("5", 63950, 64150, 63900, 64100),
  ohlc("6", 64100, 64120, 63350, 63400),
];

/** Supply zone (teaching chart): a small base candle, then a big-bodied drop away from it. */
export const SUPPLY_ZONE_OHLC: OHLC[] = [
  ohlc("1", 63600, 63850, 63550, 63800),
  ohlc("2", 63800, 64100, 63750, 64050),
  ohlc("3", 64050, 64300, 64000, 64250),
  ohlc("4", 64250, 64380, 64180, 64220), // base: small body, top of zone = its high
  ohlc("5", 64220, 64240, 63400, 63450), // impulse: big body leaving the zone
  ohlc("6", 63450, 63600, 63300, 63500),
  ohlc("7", 63500, 63800, 63450, 63750),
  ohlc("8", 63750, 64100, 63700, 64050),
  ohlc("9", 64050, 64300, 64000, 64200), // back into the zone
  ohlc("10", 64200, 64250, 63850, 63900), // rejection from supply
];

/** Demand zone (teaching chart): a small base candle, then a big-bodied rally away from it. */
export const DEMAND_ZONE_OHLC: OHLC[] = [
  ohlc("1", 64800, 64850, 64500, 64550),
  ohlc("2", 64550, 64600, 64250, 64300),
  ohlc("3", 64300, 64350, 64050, 64100),
  ohlc("4", 64100, 64170, 63980, 64130), // base: small body, bottom of zone = its low
  ohlc("5", 64130, 64980, 64110, 64950), // impulse: big body leaving the zone
  ohlc("6", 64950, 65100, 64850, 65000),
  ohlc("7", 65000, 65050, 64700, 64750),
  ohlc("8", 64750, 64800, 64400, 64450),
  ohlc("9", 64450, 64500, 64050, 64150), // back into the zone
  ohlc("10", 64150, 64550, 64100, 64500), // bounce from demand
];

/** Hammer shape in the middle of a sideways range (no prior downtrend) — Buy-or-Sell “wait” case. */
export const HAMMER_NO_TREND_OHLC: OHLC[] = [
  ohlc("1", 64000, 64250, 63850, 64150),
  ohlc("2", 64150, 64300, 63900, 63950),
  ohlc("3", 63950, 64200, 63850, 64100),
  ohlc("4", 64100, 64250, 63850, 64000),
  ohlc("5", 64000, 64110, 63500, 64080), // hammer shape, but nothing to reverse
  ohlc("6", 64080, 64250, 63900, 64000),
];

/** Bearish-engulfing shape inside a flat range (no prior rally) — Buy-or-Sell “wait” case. */
export const ENGULFING_NO_TREND_OHLC: OHLC[] = [
  ohlc("1", 64100, 64300, 63900, 64000),
  ohlc("2", 64000, 64250, 63850, 64150),
  ohlc("3", 64150, 64300, 63950, 64050),
  ohlc("4", 64000, 64200, 63900, 64120),
  ohlc("5", 64180, 64260, 63880, 63950), // engulfs bar 4's body, but mid-range
  ohlc("6", 63950, 64150, 63850, 64100),
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
  "candle-rejected-high": CANDLE_REJECTED_HIGH_OHLC,
  "candle-rejected-low": CANDLE_REJECTED_LOW_OHLC,
  "candle-stable-green": CANDLE_STABLE_GREEN_OHLC,
  "candle-stable-red": CANDLE_STABLE_RED_OHLC,
  "candle-indecision-green": CANDLE_INDECISION_GREEN_OHLC,
  "candle-indecision-red": CANDLE_INDECISION_RED_OHLC,
  "candle-bulls-win": CANDLE_BULLS_WIN_OHLC,
  "candle-bears-win": CANDLE_BEARS_WIN_OHLC,
  "head-shoulders": HEAD_SHOULDERS_OHLC,
  "falling-wedge": FALLING_WEDGE_OHLC,
  "tweezer-top": TWEEZER_TOP_OHLC,
  "tweezer-bottom": TWEEZER_BOTTOM_OHLC,
  "rising-wedge": RISING_WEDGE_OHLC,
  "bull-flag": BULL_FLAG_OHLC,
  "double-top": DOUBLE_TOP_OHLC,
  "double-bottom": DOUBLE_BOTTOM_OHLC,
  triangle: TRIANGLE_OHLC,
  "hanging-man": HANGING_MAN_OHLC,
  "evening-star": EVENING_STAR_OHLC,
  "piercing-line": PIERCING_LINE_OHLC,
  "dark-cloud-cover": DARK_CLOUD_COVER_OHLC,
  "three-white-soldiers": THREE_WHITE_SOLDIERS_OHLC,
  "three-black-crows": THREE_BLACK_CROWS_OHLC,
  harami: HARAMI_OHLC,
  "white-marubozu": WHITE_MARUBOZU_OHLC,
  "black-marubozu": BLACK_MARUBOZU_OHLC,
  "spinning-top": SPINNING_TOP_OHLC,
  "bearish-harami": BEARISH_HARAMI_OHLC,
  "three-inside-up": THREE_INSIDE_UP_OHLC,
  "three-inside-down": THREE_INSIDE_DOWN_OHLC,
  "three-outside-up": THREE_OUTSIDE_UP_OHLC,
  "three-outside-down": THREE_OUTSIDE_DOWN_OHLC,
  "on-neck": ON_NECK_OHLC,
  "bullish-counterattack": BULLISH_COUNTERATTACK_OHLC,
  "bearish-counterattack": BEARISH_COUNTERATTACK_OHLC,
  "rising-three-methods": RISING_THREE_METHODS_OHLC,
  "falling-three-methods": FALLING_THREE_METHODS_OHLC,
  "mat-hold": MAT_HOLD_OHLC,
  "upside-tasuki-gap": UPSIDE_TASUKI_GAP_OHLC,
  "downside-tasuki-gap": DOWNSIDE_TASUKI_GAP_OHLC,
  "long-green-candle": LONG_GREEN_CANDLE_OHLC,
  "long-red-candle": LONG_RED_CANDLE_OHLC,
  "short-green-candle": SHORT_GREEN_CANDLE_OHLC,
  "short-red-candle": SHORT_RED_CANDLE_OHLC,
  "bullish-closing-marubozu": BULLISH_CLOSING_MARUBOZU_OHLC,
  "bearish-closing-marubozu": BEARISH_CLOSING_MARUBOZU_OHLC,
  "bullish-opening-marubozu": BULLISH_OPENING_MARUBOZU_OHLC,
  "bearish-opening-marubozu": BEARISH_OPENING_MARUBOZU_OHLC,
  "long-legged-doji": LONG_LEGGED_DOJI_OHLC,
  "cross-doji": CROSS_DOJI_OHLC,
  "inverted-cross-doji": INVERTED_CROSS_DOJI_OHLC,
  "dragonfly-doji": DRAGONFLY_DOJI_OHLC,
  "gravestone-doji": GRAVESTONE_DOJI_OHLC,
  "bullish-kicker": BULLISH_KICKER_OHLC,
  "bearish-kicker": BEARISH_KICKER_OHLC,
  "bullish-separating-lines": BULLISH_SEPARATING_LINES_OHLC,
  "bearish-separating-lines": BEARISH_SEPARATING_LINES_OHLC,
  "bullish-side-by-side-white-lines": BULLISH_SIDE_BY_SIDE_OHLC,
  "bearish-side-by-side-white-lines": BEARISH_SIDE_BY_SIDE_OHLC,
  "in-neck": IN_NECK_OHLC,
  "thrusting": THRUSTING_OHLC,
  "two-crows": TWO_CROWS_OHLC,
  "upside-gap-two-crows": UPSIDE_GAP_TWO_CROWS_OHLC,
  "bullish-abandoned-baby": BULLISH_ABANDONED_BABY_OHLC,
  "bearish-abandoned-baby": BEARISH_ABANDONED_BABY_OHLC,
  "bullish-tri-star": BULLISH_TRI_STAR_OHLC,
  "bearish-tri-star": BEARISH_TRI_STAR_OHLC,
  "bullish-three-line-strike": BULLISH_THREE_LINE_STRIKE_OHLC,
  "bearish-three-line-strike": BEARISH_THREE_LINE_STRIKE_OHLC,
  "upside-gap-three-methods": UPSIDE_GAP_THREE_METHODS_OHLC,
  "downside-gap-three-methods": DOWNSIDE_GAP_THREE_METHODS_OHLC,
  "bullish-breakaway": BULLISH_BREAKAWAY_OHLC,
  "bearish-breakaway": BEARISH_BREAKAWAY_OHLC,
  "bearish-mat-hold": BEARISH_MAT_HOLD_OHLC,
  "supply-zone": SUPPLY_ZONE_OHLC,
  "demand-zone": DEMAND_ZONE_OHLC,
  ...SCENARIO_OHLC,
  "inverse-head-shoulders": SCENARIO_OHLC["sc-inverse-head-shoulders"],
  "triple-top": SCENARIO_OHLC["sc-triple-top"],
  "triple-bottom": SCENARIO_OHLC["sc-triple-bottom"],
  ...ADVANCED_OHLC,
  "hammer-no-trend": HAMMER_NO_TREND_OHLC,
  "engulfing-no-trend": ENGULFING_NO_TREND_OHLC,
};

/**
 * Buy-or-Sell drill charts, derived from the pattern charts above.
 * `bs-<key>`: bars up to the pattern's last candle plus one confirming candle that closes beyond that candle's high (up) or low (down).
 * `bs-<key>-open`: bars up to the pattern's last candle only — no confirmation yet.
 */
export type DrillDirection = "up" | "down" | "open";

/**
 * Buy-or-Sell drill charts. "up"/"down" add one confirming candle after the pattern's last bar (`end`);
 * "open" stops at the pattern (unconfirmed). `from` = first bar whose extreme the confirmation must clear (default `end`).
 */
export const DRILL_CHART_SPECS: ReadonlyArray<{ key: string; end: number; dir: DrillDirection; from?: number }> = [
  // bullish reversals
  { key: "hammer", end: 2, dir: "up" },
  { key: "inverted-hammer", end: 2, dir: "up" },
  { key: "engulfing", end: 2, dir: "up" },
  { key: "piercing-line", end: 3, dir: "up" },
  { key: "morning-star", end: 3, dir: "up" },
  { key: "three-white-soldiers", end: 3, dir: "up" },
  { key: "tweezer-bottom", end: 4, dir: "up" },
  { key: "harami", end: 3, dir: "up" },
  { key: "three-inside-up", end: 4, dir: "up" },
  { key: "three-outside-up", end: 4, dir: "up" },
  { key: "bullish-counterattack", end: 3, dir: "up" },
  { key: "white-marubozu", end: 3, dir: "up" },
  { key: "candle-rejected-low", end: 3, dir: "up" },
  { key: "candle-bulls-win", end: 3, dir: "up" },
  { key: "dragonfly-doji", end: 3, dir: "up" },
  { key: "bullish-kicker", end: 3, dir: "up" },
  { key: "bullish-abandoned-baby", end: 4, dir: "up" },
  { key: "bullish-tri-star", end: 5, dir: "up" },
  { key: "bullish-breakaway", end: 6, dir: "up" },
  { key: "bullish-closing-marubozu", end: 3, dir: "up" },
  { key: "bullish-opening-marubozu", end: 3, dir: "up" },
  // bullish continuations
  { key: "rising-three-methods", end: 5, dir: "up" },
  { key: "mat-hold", end: 5, dir: "up" },
  { key: "upside-tasuki-gap", end: 3, dir: "up" },
  { key: "bullish-separating-lines", end: 3, dir: "up" },
  { key: "bullish-side-by-side-white-lines", end: 3, dir: "up" },
  { key: "upside-gap-three-methods", end: 3, dir: "up" },
  { key: "bull-flag", end: 5, dir: "up", from: 2 },
  // bearish reversals
  { key: "shooting-star", end: 2, dir: "down" },
  { key: "hanging-man", end: 3, dir: "down" },
  { key: "bearish-engulfing", end: 2, dir: "down" },
  { key: "dark-cloud-cover", end: 3, dir: "down" },
  { key: "evening-star", end: 3, dir: "down" },
  { key: "three-black-crows", end: 3, dir: "down" },
  { key: "tweezer-top", end: 4, dir: "down" },
  { key: "bearish-harami", end: 3, dir: "down" },
  { key: "three-inside-down", end: 4, dir: "down" },
  { key: "three-outside-down", end: 4, dir: "down" },
  { key: "bearish-counterattack", end: 3, dir: "down" },
  { key: "black-marubozu", end: 3, dir: "down" },
  { key: "candle-rejected-high", end: 3, dir: "down" },
  { key: "candle-bears-win", end: 3, dir: "down" },
  { key: "gravestone-doji", end: 3, dir: "down" },
  { key: "bearish-kicker", end: 3, dir: "down" },
  { key: "bearish-abandoned-baby", end: 4, dir: "down" },
  { key: "bearish-tri-star", end: 5, dir: "down" },
  { key: "bearish-breakaway", end: 6, dir: "down" },
  { key: "two-crows", end: 4, dir: "down" },
  { key: "upside-gap-two-crows", end: 4, dir: "down" },
  { key: "bearish-closing-marubozu", end: 3, dir: "down" },
  { key: "bearish-opening-marubozu", end: 3, dir: "down" },
  // bearish continuations
  { key: "falling-three-methods", end: 5, dir: "down" },
  { key: "bearish-mat-hold", end: 5, dir: "down" },
  { key: "downside-tasuki-gap", end: 3, dir: "down" },
  { key: "bearish-separating-lines", end: 3, dir: "down" },
  { key: "bearish-side-by-side-white-lines", end: 3, dir: "down" },
  { key: "downside-gap-three-methods", end: 3, dir: "down" },
  { key: "on-neck", end: 3, dir: "down" },
  { key: "in-neck", end: 3, dir: "down" },
  { key: "thrusting", end: 3, dir: "down" },
  // unconfirmed (pattern is the last candle)
  { key: "hammer", end: 2, dir: "open" },
  { key: "engulfing", end: 2, dir: "open" },
  { key: "shooting-star", end: 2, dir: "open" },
  { key: "dark-cloud-cover", end: 3, dir: "open" },
  { key: "hanging-man", end: 3, dir: "open" },
  { key: "inverted-hammer", end: 2, dir: "open" },
  { key: "gravestone-doji", end: 3, dir: "open" },
  // indecision / unclear direction (wait cases)
  { key: "doji", end: 2, dir: "open" },
  { key: "spinning-top", end: 2, dir: "open" },
  { key: "long-legged-doji", end: 3, dir: "open" },
  { key: "cross-doji", end: 3, dir: "open" },
  { key: "inverted-cross-doji", end: 3, dir: "open" },
  { key: "bullish-three-line-strike", end: 4, dir: "open" },
  { key: "bearish-three-line-strike", end: 4, dir: "open" },
  // pattern shape with no prior trend (wait cases)
  { key: "hammer-no-trend", end: 4, dir: "open" },
  { key: "engulfing-no-trend", end: 4, dir: "open" },
  // harami crosses, doji stars, high-wave / rickshaw man (wait), advanced / rare patterns
  ...ADVANCED_DRILL_SPECS,
];

/** One confirming candle: opens at the pattern close and closes beyond the pattern's high (up) or low (down) over bars [from, end]. */
export function confirmationBar(bars: OHLC[], end: number, dir: "up" | "down", from = end): OHLC {
  const last = bars[end];
  const span = bars.slice(from, end + 1);
  const recent = bars.slice(Math.max(0, end - 3), end + 1);
  const avgBody = Math.max(50, recent.reduce((s, b) => s + Math.abs(b.close - b.open), 0) / recent.length);
  const open = last.close;
  const close =
    dir === "up"
      ? Math.max(...span.map((b) => b.high)) + Math.round(avgBody * 0.4)
      : Math.min(...span.map((b) => b.low)) - Math.round(avgBody * 0.4);
  const wick = Math.round(avgBody * 0.15);
  return ohlc(
    String(end + 2),
    open,
    Math.max(open, close) + wick,
    Math.min(open, close) - wick,
    close
  );
}

export function drillChartKey(key: string, dir: DrillDirection): string {
  return dir === "open" ? `bs-${key}-open` : `bs-${key}`;
}

for (const spec of DRILL_CHART_SPECS) {
  const source = PATTERN_OHLC[spec.key];
  if (!source) continue;
  const head = source.slice(0, spec.end + 1);
  PATTERN_OHLC[drillChartKey(spec.key, spec.dir)] =
    spec.dir === "open" ? head : [...head, confirmationBar(source, spec.end, spec.dir, spec.from ?? spec.end)];
}

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
 * Scale-up grows the price pane so candles stay in view.
 * Scale-down keeps pane height and widens the Y domain.
 */
export function chartVerticalScale(
  baseHeight: number,
  zoom: number,
): { paneHeight: number; domainZoom: number } {
  const z = Math.max(0.25, Math.min(zoom, 8));
  return {
    paneHeight: Math.round(baseHeight * Math.max(1, z)),
    domainZoom: Math.min(1, z),
  };
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

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

/** Generic trend data for Market page */
export const SAMPLE_OHLC: OHLC[] = [
  ohlc("08:00", 63200, 63800, 63000, 63600),
  ohlc("10:00", 63600, 64200, 63400, 63800),
  ohlc("12:00", 63800, 64100, 63400, 63500), // Red candle
  ohlc("14:00", 63200, 63900, 62800, 63800), // Bullish Engulfing: green engulfs prev red
  ohlc("16:00", 63650, 64000, 63200, 63650), // Doji: open≈close, long wicks
  ohlc("18:00", 63800, 64400, 63600, 64000),
  ohlc("20:00", 64000, 64800, 63800, 64200),
  ohlc("22:00", 64200, 65000, 64000, 64600),
  ohlc("00:00", 64600, 65200, 64400, 64800),
  ohlc("02:00", 64800, 65400, 64600, 65000),
  ohlc("04:00", 65000, 65600, 64800, 65200),
  ohlc("06:00", 65200, 65800, 65000, 65500),
];

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
  "head-shoulders": HEAD_SHOULDERS_OHLC,
  "falling-wedge": FALLING_WEDGE_OHLC,
};

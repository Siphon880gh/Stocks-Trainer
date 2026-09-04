import type { AssetClass } from "./samplePacks";

export type PatternId =
  | "doji"
  | "hammer"
  | "engulfing"
  | "bullish-engulfing"
  | "bearish-engulfing"
  | "shooting-star"
  | "inverted-hammer"
  | "morning-star"
  | "tweezer-bottom"
  | "rising-wedge"
  | "bull-flag"
  | "double-top"
  | "double-bottom"
  | "triangle"
  | "hanging-man"
  | "evening-star"
  | "piercing-line"
  | "dark-cloud-cover"
  | "three-white-soldiers"
  | "three-black-crows"
  | "harami"
  | "tweezer-top"
  | "falling-wedge"
  | "head-shoulders";

export interface QuizOption {
  id: "A" | "B" | "C" | "D" | "E";
  patternId?: PatternId;
  label: string;
  description: string;
  /** When set, this option is a selectable mini chart (pick-the-chart questions). */
  chartKey?: string;
  chartHighlightIndex?: number;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  options: QuizOption[];
  explanation: string;
  patternKey?: string;
  overlayId?: string;
  highlightIndex?: number;
  /** Options are mini charts; hide the single hero chart above choices. */
  optionsAreCharts?: boolean;
  /** Optional Archive literacy term id for glossary deep-link */
  glossaryTermId?: string;
  /** Optional structured financial snapshot id (E4.M2 card) */
  snapshotId?: string;
  /** Planner filter tag (E4.M3.S2) */
  assetClass?: AssetClass;
  /** Optional E1 sample pack id for equity-backed drills */
  samplePackId?: string;
}

/** Build numbered chart choices (1…n) for “which chart is the pattern?” questions. */
function chartPickOptions(
  entries: Array<{ id: "A" | "B" | "C" | "D" | "E"; chartKey: string; highlightIndex?: number }>
): QuizOption[] {
  return entries.map((e, i) => ({
    id: e.id,
    label: String(i + 1),
    description: "Select this chart",
    chartKey: e.chartKey,
    chartHighlightIndex: e.highlightIndex ?? 2,
    patternId: e.chartKey as PatternId,
  }));
}

const OPTIONS_3: QuizOption[] = [
  { id: "A", patternId: "doji", label: "Doji", description: "Indecision in the market with equal open/close." },
  { id: "B", patternId: "hammer", label: "Hammer", description: "Bullish reversal pattern with a long lower shadow." },
  { id: "C", patternId: "engulfing", label: "Engulfing", description: "Body of current candle covers previous candle." },
];

const OPTIONS_5: QuizOption[] = [
  { id: "A", patternId: "hammer", label: "Hammer", description: "Long lower shadow, small body at top." },
  { id: "B", patternId: "bearish-engulfing", label: "Bearish Engulfing", description: "Red body engulfs prior green." },
  { id: "C", patternId: "shooting-star", label: "Shooting Star", description: "Long upper shadow, small body at bottom." },
  { id: "D", patternId: "inverted-hammer", label: "Inverted Hammer", description: "Long upper shadow; bullish bottom reversal." },
  { id: "E", patternId: "morning-star", label: "Morning Star", description: "Three-candle bullish reversal." },
];

const INDICATOR_OPTIONS: QuizOption[] = [
  { id: "A", label: "SMA", description: "Simple Moving Average" },
  { id: "B", label: "EMA", description: "Exponential Moving Average" },
  { id: "C", label: "RSI", description: "Relative Strength Index" },
  { id: "D", label: "MACD", description: "Moving Average Convergence Divergence" },
  { id: "E", label: "Bollinger Bands", description: "Volatility bands around SMA" },
];

const HAMMER_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "doji", label: "Doji", description: "Open ≈ close, indecision." },
  { id: "B", patternId: "hammer", label: "Hammer", description: "Long lower shadow, small body at top." },
  { id: "C", patternId: "shooting-star", label: "Shooting Star", description: "Long upper shadow after a rally." },
];

const DESC_HINT = "Pick the matching definition.";

const HAMMER_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Open and close nearly equal, wicks both ways — indecision", description: DESC_HINT },
  { id: "B", label: "Long lower shadow, small body near the high — buyers reclaimed a selloff", description: DESC_HINT },
  { id: "C", label: "Long upper shadow after a rally — rejection of higher prices", description: DESC_HINT },
];

const DOJI_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Open and close nearly equal, often with wicks — buyers and sellers in balance", description: DESC_HINT },
  { id: "B", label: "Long lower shadow, small body at the top — bullish reclaim", description: DESC_HINT },
  { id: "C", label: "The current body fully covers the prior body — momentum shift", description: DESC_HINT },
];

const ENGULFING_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Open ≈ close with long wicks — indecision", description: DESC_HINT },
  { id: "B", label: "Long lower shadow, small body at the top", description: DESC_HINT },
  { id: "C", label: "The current candle's body completely covers the previous candle's body", description: DESC_HINT },
];

const SHOOTING_STAR_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "hammer", label: "Hammer", description: "Long lower shadow at a bottom." },
  { id: "B", patternId: "shooting-star", label: "Shooting Star", description: "Long upper shadow at a top." },
  { id: "C", patternId: "inverted-hammer", label: "Inverted Hammer", description: "Same shape at a bottom; bullish." },
];

const SHOOTING_STAR_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Long lower shadow after a decline — bullish reclaim", description: DESC_HINT },
  { id: "B", label: "Long upper shadow after a rally — rejection at the highs", description: DESC_HINT },
  { id: "C", label: "Open ≈ close with balanced wicks — indecision", description: DESC_HINT },
];

const INVERTED_HAMMER_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "shooting-star", label: "Shooting Star", description: "Same shape, but at a top — bearish." },
  { id: "B", patternId: "hammer", label: "Hammer", description: "Long lower shadow, body at top." },
  { id: "C", patternId: "inverted-hammer", label: "Inverted Hammer", description: "Long upper shadow at a bottom — bullish." },
];

const INVERTED_HAMMER_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Long upper shadow at a top after a rally — bearish rejection", description: DESC_HINT },
  { id: "B", label: "Long lower shadow, small body at the top — bullish reclaim", description: DESC_HINT },
  { id: "C", label: "Long upper shadow at a bottom after a decline — bullish probe", description: DESC_HINT },
];

const BULLISH_ENGULFING_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "bullish-engulfing", label: "Bullish Engulfing", description: "Green body covers prior red." },
  { id: "B", patternId: "bearish-engulfing", label: "Bearish Engulfing", description: "Red body covers prior green." },
  { id: "C", patternId: "hammer", label: "Hammer", description: "One-candle lower-wick reclaim." },
];

const BULLISH_ENGULFING_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "A green body completely covers the prior red body — buyers take over", description: DESC_HINT },
  { id: "B", label: "A red body completely covers the prior green body — sellers take over", description: DESC_HINT },
  { id: "C", label: "Single candle with a long lower wick after a selloff", description: DESC_HINT },
];

const BEARISH_ENGULFING_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "bullish-engulfing", label: "Bullish Engulfing", description: "Green body covers prior red." },
  { id: "B", patternId: "bearish-engulfing", label: "Bearish Engulfing", description: "Red body covers prior green." },
  { id: "C", patternId: "shooting-star", label: "Shooting Star", description: "Long upper wick at a top." },
];

const BEARISH_ENGULFING_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "A green body completely covers the prior red body — buyers take over", description: DESC_HINT },
  { id: "B", label: "A red body completely covers the prior green body — sellers take over", description: DESC_HINT },
  { id: "C", label: "Long upper shadow after a rally — rejection of higher prices", description: DESC_HINT },
];

const MORNING_STAR_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "doji", label: "Doji", description: "One indecision candle." },
  { id: "B", patternId: "hammer", label: "Hammer", description: "One-candle lower-wick reclaim." },
  { id: "C", patternId: "morning-star", label: "Morning Star", description: "Three-candle bullish reversal." },
];

const MORNING_STAR_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Open ≈ close on a single bar — indecision only", description: DESC_HINT },
  { id: "B", label: "One candle with a long lower wick after a selloff", description: DESC_HINT },
  { id: "C", label: "Large red, small middle, then large green — three-bar bullish reversal", description: DESC_HINT },
];

const TWEEZER_BOTTOM_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "hammer", label: "Hammer", description: "One long lower wick." },
  { id: "B", patternId: "tweezer-bottom", label: "Tweezer Bottom", description: "Two candles share a similar low." },
  { id: "C", patternId: "double-bottom", label: "Double Bottom", description: "Two swing lows with a bounce between." },
];

const TWEEZER_BOTTOM_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Two candles share a similar low after a decline — matched support", description: DESC_HINT },
  { id: "B", label: "Two swing lows with a bounce high between them", description: DESC_HINT },
  { id: "C", label: "Highs and lows squeeze toward one point", description: DESC_HINT },
];

const RISING_WEDGE_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "rising-wedge", label: "Rising Wedge", description: "Upward converging lines." },
  { id: "B", patternId: "bull-flag", label: "Bull Flag", description: "Sharp rise, then a tight pause." },
  { id: "C", patternId: "triangle", label: "Triangle", description: "Squeeze with no built-in tilt." },
];

const RISING_WEDGE_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Price rises inside two upward, converging lines — buying is tiring", description: DESC_HINT },
  { id: "B", label: "A sharp rise, then a tight downward pause", description: DESC_HINT },
  { id: "C", label: "Two similar highs with a dip between them", description: DESC_HINT },
];

const BULL_FLAG_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "rising-wedge", label: "Rising Wedge", description: "Slow squeeze higher." },
  { id: "B", patternId: "bull-flag", label: "Bull Flag", description: "Pole, then a tight rest." },
  { id: "C", patternId: "triangle", label: "Triangle", description: "Range squeeze, no pole." },
];

const BULL_FLAG_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "A sharp rise, then a tight downward or sideways pause", description: DESC_HINT },
  { id: "B", label: "Two similar lows with a bounce between them", description: DESC_HINT },
  { id: "C", label: "Two candles share a similar high after a rally", description: DESC_HINT },
];

const DOUBLE_TOP_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "double-top", label: "Double Top", description: "Two similar highs." },
  { id: "B", patternId: "double-bottom", label: "Double Bottom", description: "Two similar lows." },
  { id: "C", patternId: "triangle", label: "Triangle", description: "Squeeze, not two peaks." },
];

const DOUBLE_TOP_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Two similar highs with a dip between — second high failed to break out", description: DESC_HINT },
  { id: "B", label: "Two similar lows with a bounce between them", description: DESC_HINT },
  { id: "C", label: "A sharp rise then a tight flag pause", description: DESC_HINT },
];

const DOUBLE_BOTTOM_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "double-top", label: "Double Top", description: "Two similar highs." },
  { id: "B", patternId: "tweezer-bottom", label: "Tweezer Bottom", description: "Two-bar matched low." },
  { id: "C", patternId: "double-bottom", label: "Double Bottom", description: "Two swing lows, bounce between." },
];

const DOUBLE_BOTTOM_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Two similar lows with a bounce between — second low held", description: DESC_HINT },
  { id: "B", label: "Two candles share one low with no bounce swing between", description: DESC_HINT },
  { id: "C", label: "Price rises in two upward converging lines", description: DESC_HINT },
];

const TRIANGLE_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "triangle", label: "Triangle", description: "Squeeze toward a point." },
  { id: "B", patternId: "rising-wedge", label: "Rising Wedge", description: "Upward tilt squeeze." },
  { id: "C", patternId: "bull-flag", label: "Bull Flag", description: "Pole plus pause." },
];

const TRIANGLE_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Highs and lows squeeze toward a point — direction is the later break", description: DESC_HINT },
  { id: "B", label: "Two similar highs with a neckline dip", description: DESC_HINT },
  { id: "C", label: "Matched lows on two neighboring candles", description: DESC_HINT },
];

const HANGING_MAN_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "hammer", label: "Hammer", description: "Same wick after a decline." },
  { id: "B", patternId: "hanging-man", label: "Hanging Man", description: "Long lower wick after a rally." },
  { id: "C", patternId: "shooting-star", label: "Shooting Star", description: "Long upper wick at a top." },
];

const HANGING_MAN_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Long lower wick after a rally — sellers may be showing up", description: DESC_HINT },
  { id: "B", label: "Long lower wick after a decline — buyers reclaimed a selloff", description: DESC_HINT },
  { id: "C", label: "Long upper wick after a rally — rejection of higher prices", description: DESC_HINT },
];

const EVENING_STAR_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "morning-star", label: "Morning Star", description: "Red · small · green at the lows." },
  { id: "B", patternId: "doji", label: "Doji", description: "One indecision candle." },
  { id: "C", patternId: "evening-star", label: "Evening Star", description: "Green · small · red at the highs." },
];

const EVENING_STAR_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Large red, small middle, then large green — three-bar bullish reversal", description: DESC_HINT },
  { id: "B", label: "Large green, small middle, then large red — three-bar top reversal", description: DESC_HINT },
  { id: "C", label: "Open ≈ close on a single bar — indecision only", description: DESC_HINT },
];

const PIERCING_LINE_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "piercing-line", label: "Piercing Line", description: "Green closes into prior red." },
  { id: "B", patternId: "bullish-engulfing", label: "Bullish Engulfing", description: "Green fully covers prior red." },
  { id: "C", patternId: "hammer", label: "Hammer", description: "One-candle lower-wick reclaim." },
];

const PIERCING_LINE_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "After a decline, a green opens lower then closes well into the prior red body — not a full cover", description: DESC_HINT },
  { id: "B", label: "A green body completely covers the prior red body", description: DESC_HINT },
  { id: "C", label: "Two candles share a similar low after a decline", description: DESC_HINT },
];

const DARK_CLOUD_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "bearish-engulfing", label: "Bearish Engulfing", description: "Red fully covers prior green." },
  { id: "B", patternId: "dark-cloud-cover", label: "Dark Cloud Cover", description: "Red closes into prior green." },
  { id: "C", patternId: "shooting-star", label: "Shooting Star", description: "Long upper wick at a top." },
];

const DARK_CLOUD_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "A red body completely covers the prior green body", description: DESC_HINT },
  { id: "B", label: "After a rally, a red opens higher then closes well into the prior green body — not a full cover", description: DESC_HINT },
  { id: "C", label: "Three falling red bodies in a row", description: DESC_HINT },
];

const THREE_WHITE_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "morning-star", label: "Morning Star", description: "Red · small · green." },
  { id: "B", patternId: "bullish-engulfing", label: "Bullish Engulfing", description: "One green covers one red." },
  { id: "C", patternId: "three-white-soldiers", label: "Three White Soldiers", description: "Three rising green bodies." },
];

const THREE_WHITE_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Three rising green bodies in a row after a decline or pause", description: DESC_HINT },
  { id: "B", label: "Large red, small middle, then large green", description: DESC_HINT },
  { id: "C", label: "A green body completely covers the prior red body", description: DESC_HINT },
];

const THREE_CROWS_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "evening-star", label: "Evening Star", description: "Green · small · red." },
  { id: "B", patternId: "three-black-crows", label: "Three Black Crows", description: "Three falling red bodies." },
  { id: "C", patternId: "bearish-engulfing", label: "Bearish Engulfing", description: "One red covers one green." },
];

const THREE_CROWS_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Large green, small middle, then large red", description: DESC_HINT },
  { id: "B", label: "Three falling red bodies in a row after a rally or pause", description: DESC_HINT },
  { id: "C", label: "A red body completely covers the prior green body", description: DESC_HINT },
];

const HARAMI_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "engulfing", label: "Engulfing", description: "Current body covers the prior body." },
  { id: "B", patternId: "doji", label: "Doji", description: "Open ≈ close, one bar." },
  { id: "C", patternId: "harami", label: "Harami", description: "Small body nested in the prior body." },
];

const HARAMI_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "The current body fully covers the prior body — momentum shift", description: DESC_HINT },
  { id: "B", label: "A small body nested inside the prior larger body — indecision after a swing", description: DESC_HINT },
  { id: "C", label: "Open ≈ close with long wicks both ways", description: DESC_HINT },
];

const TWEEZER_TOP_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "double-top", label: "Double Top", description: "Two swings with a dip between." },
  { id: "B", patternId: "shooting-star", label: "Shooting Star", description: "One long upper wick." },
  { id: "C", patternId: "tweezer-top", label: "Tweezer Top", description: "Two candles share a similar high." },
];

const TWEEZER_TOP_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Two candles share a similar high after a rally — matched rejection", description: DESC_HINT },
  { id: "B", label: "Two similar highs with a dip swing between them", description: DESC_HINT },
  { id: "C", label: "Long upper wick on a single candle after a rally", description: DESC_HINT },
];

const FALLING_WEDGE_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "falling-wedge", label: "Falling Wedge", description: "Downward converging lines." },
  { id: "B", patternId: "rising-wedge", label: "Rising Wedge", description: "Upward converging lines." },
  { id: "C", patternId: "triangle", label: "Triangle", description: "Squeeze with no built-in tilt." },
];

const FALLING_WEDGE_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Price falls inside two downward, converging lines — selling is tiring", description: DESC_HINT },
  { id: "B", label: "Price rises inside two upward, converging lines", description: DESC_HINT },
  { id: "C", label: "Highs and lows squeeze with no built-in tilt", description: DESC_HINT },
];

const HEAD_SHOULDERS_NAME_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "double-top", label: "Double Top", description: "Two similar highs." },
  { id: "B", patternId: "head-shoulders", label: "Head and Shoulders", description: "Three peaks; middle is highest." },
  { id: "C", patternId: "triangle", label: "Triangle", description: "Squeeze, not three peaks." },
];

const HEAD_SHOULDERS_DESC_OPTIONS: QuizOption[] = [
  { id: "A", label: "Two similar highs with a dip between them", description: DESC_HINT },
  { id: "B", label: "Three peaks: the center peak (head) is highest, flanked by two lower shoulders", description: DESC_HINT },
  { id: "C", label: "Two neighboring candles share a similar high", description: DESC_HINT },
];

const OHLC_PART_OPTIONS: QuizOption[] = [
  { id: "A", label: "Open", description: "Price when the period started." },
  { id: "B", label: "High", description: "Highest price in the period." },
  { id: "C", label: "Low", description: "Lowest price in the period." },
  { id: "D", label: "Close", description: "Price when the period ended." },
];

const CANDLE_COLOR_OPTIONS: QuizOption[] = [
  { id: "A", label: "Close is above open", description: "Buyers finished higher — typically green." },
  { id: "B", label: "Close is below open", description: "Sellers finished lower — typically red." },
  { id: "C", label: "High equals the low", description: "A flat range, not a color rule." },
];

export const QUIZ_OPTIONS = OPTIONS_3;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "PR-042",
    prompt: "Analyze the price action highlighted on the chart below. Which candlestick pattern is currently forming at the resistance level?",
    correctAnswer: "B",
    options: OPTIONS_3,
    explanation:
      "The long lower shadow indicates that sellers drove prices down, but were met with strong buying pressure, pushing the price back up near the open. This is a classic bullish sign.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-018",
    prompt: "Identify the candlestick pattern at the highlighted area. What does this formation suggest about market sentiment?",
    correctAnswer: "A",
    options: OPTIONS_3,
    explanation:
      "A Doji shows open and close at nearly the same level, indicating indecision. Buyers and sellers are in equilibrium; a breakout often follows.",
    patternKey: "doji",
    highlightIndex: 2,
  },
  {
    id: "PR-031",
    prompt: "Which pattern appears at the marked candle? Consider the relationship between the current and previous candle bodies.",
    correctAnswer: "C",
    options: OPTIONS_3,
    explanation:
      "The current candle's body completely engulfs the previous candle's body. This signals a strong shift in momentum and often precedes a trend reversal.",
    patternKey: "engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-055",
    prompt: "At the marked candle, price rejected a sharp move lower and closed near the high. What pattern is this?",
    correctAnswer: "B",
    options: OPTIONS_3,
    explanation:
      "The long lower wick and small body at the top indicate a Hammer. Sellers pushed down but buyers reclaimed control—a bullish reversal signal.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-019",
    prompt: "The marked candle shows a near-identical open and close with long upper and lower shadows. Identify the pattern.",
    correctAnswer: "A",
    options: OPTIONS_3,
    explanation:
      "Open equals close (or nearly so) with extended wicks—a Doji. This signals indecision and often precedes a reversal or breakout.",
    patternKey: "doji",
    highlightIndex: 2,
  },
  {
    id: "PR-033",
    prompt: "The green candle at the marked position fully engulfs the prior red candle. What pattern is this?",
    correctAnswer: "C",
    options: OPTIONS_3,
    explanation:
      "The current candle's body completely engulfs the previous candle's body. This signals a strong shift in momentum and often precedes a trend reversal.",
    patternKey: "engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-061",
    prompt: "After a downtrend, the marked candle shows a long lower shadow and small body at the top. Which pattern?",
    correctAnswer: "B",
    options: OPTIONS_3,
    explanation:
      "A Hammer forms when the lower wick is at least twice the body size. It suggests buyers stepped in after a sell-off.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-022",
    prompt: "The marked candle shows equilibrium between buyers and sellers—open and close nearly identical. Identify the pattern.",
    correctAnswer: "A",
    options: OPTIONS_3,
    explanation:
      "A Doji represents indecision. The market tested both directions but closed where it opened—a potential reversal point.",
    patternKey: "doji",
    highlightIndex: 2,
  },
  {
    id: "PR-038",
    prompt: "At the marked candle, a strong green body completely overlaps the previous red body. What pattern is this?",
    correctAnswer: "C",
    options: OPTIONS_3,
    explanation:
      "Bullish Engulfing: the new candle's body completely contains the prior candle's body, signaling strong buying momentum.",
    patternKey: "engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-044",
    prompt: "The marked candle has a long upper shadow and small body at the bottom after an uptrend. What pattern?",
    correctAnswer: "C",
    options: OPTIONS_5,
    explanation: "Shooting Star: long upper wick shows rejection of higher prices; bearish reversal at tops.",
    patternKey: "shooting-star",
    highlightIndex: 2,
  },
  {
    id: "PR-047",
    prompt: "A red candle fully engulfs the prior green candle at the marked position. Identify the pattern.",
    correctAnswer: "B",
    options: OPTIONS_5,
    explanation: "Bearish Engulfing: red body engulfs prior green; strong selling momentum.",
    patternKey: "bearish-engulfing",
    highlightIndex: 2,
  },
  {
    id: "PR-051",
    prompt: "After a downtrend, the marked candle shows a long upper shadow and small body. What pattern?",
    correctAnswer: "D",
    options: OPTIONS_5,
    explanation: "Inverted Hammer: same shape as Shooting Star but at bottom; bullish reversal signal.",
    patternKey: "inverted-hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-058",
    prompt: "Identify the three-candle formation: large red, small middle, large green. What pattern?",
    correctAnswer: "E",
    options: OPTIONS_5,
    explanation: "Morning Star: three-candle bullish reversal at bottom of downtrend.",
    patternKey: "morning-star",
    highlightIndex: 3,
  },
  {
    id: "PR-H-PICK",
    prompt: "Which chart shows a Hammer?",
    correctAnswer: "C",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "doji" },
      { id: "B", chartKey: "shooting-star" },
      { id: "C", chartKey: "hammer" },
      { id: "D", chartKey: "engulfing", highlightIndex: 3 },
      { id: "E", chartKey: "inverted-hammer" },
    ]),
    explanation:
      "Hammer: long lower wick, small body near the high. Chart 3 matches that shape; the others are different families.",
    patternKey: "hammer",
  },
  {
    id: "PR-H-DESC",
    prompt: "Which description matches a Hammer?",
    correctAnswer: "B",
    options: HAMMER_DESC_OPTIONS,
    explanation:
      "A Hammer has a long lower shadow and a small body near the high — sellers pushed down, buyers reclaimed.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-D-PICK",
    prompt: "Which chart shows a Doji?",
    correctAnswer: "A",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "doji" },
      { id: "B", chartKey: "hammer" },
      { id: "C", chartKey: "shooting-star" },
      { id: "D", chartKey: "bullish-engulfing" },
      { id: "E", chartKey: "morning-star", highlightIndex: 3 },
    ]),
    explanation: "Doji: open ≈ close (tiny body). Chart 1 is the Doji; the others have clear directional bodies or multi-candle shapes.",
    patternKey: "doji",
  },
  {
    id: "PR-D-DESC",
    prompt: "Which description matches a Doji?",
    correctAnswer: "A",
    options: DOJI_DESC_OPTIONS,
    explanation: "A Doji prints open ≈ close. Wicks can be long; the tell is the tiny body.",
    patternKey: "doji",
    highlightIndex: 2,
  },
  {
    id: "PR-E-PICK",
    prompt: "Which chart shows an Engulfing pattern?",
    correctAnswer: "D",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "hammer" },
      { id: "B", chartKey: "doji" },
      { id: "C", chartKey: "shooting-star" },
      { id: "D", chartKey: "engulfing", highlightIndex: 3 },
      { id: "E", chartKey: "inverted-hammer" },
    ]),
    explanation: "Engulfing is two candles where the later body fully covers the prior body. Chart 4 shows that overlap.",
    patternKey: "engulfing",
  },
  {
    id: "PR-E-DESC",
    prompt: "Which description matches an Engulfing candle?",
    correctAnswer: "C",
    options: ENGULFING_DESC_OPTIONS,
    explanation: "Engulfing is a two-candle pattern: the new body completely covers the prior body.",
    patternKey: "engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-BU-PICK",
    prompt: "Which chart shows Bullish Engulfing?",
    correctAnswer: "B",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "bearish-engulfing" },
      { id: "B", chartKey: "bullish-engulfing" },
      { id: "C", chartKey: "hammer" },
      { id: "D", chartKey: "doji" },
      { id: "E", chartKey: "shooting-star" },
    ]),
    explanation: "Bullish Engulfing: a green body swallows the prior red body. Chart 2 is that pair; Chart 1 is the bearish color flip.",
    patternKey: "bullish-engulfing",
  },
  {
    id: "PR-BU-DESC",
    prompt: "Which description matches Bullish Engulfing?",
    correctAnswer: "A",
    options: BULLISH_ENGULFING_DESC_OPTIONS,
    explanation: "Green body completely covers the prior red body. Color pair matters: the inverse is Bearish Engulfing.",
    patternKey: "bullish-engulfing",
    highlightIndex: 2,
  },
  {
    id: "PR-SS-PICK",
    prompt: "Which chart shows a Shooting Star?",
    correctAnswer: "B",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "hammer" },
      { id: "B", chartKey: "shooting-star" },
      { id: "C", chartKey: "doji" },
      { id: "D", chartKey: "inverted-hammer" },
      { id: "E", chartKey: "engulfing", highlightIndex: 3 },
    ]),
    explanation:
      "Shooting Star: long upper wick, small body at the bottom (after a rally). Chart 2 matches; Hammer is the flipped lower-wick cousin.",
    patternKey: "shooting-star",
  },
  {
    id: "PR-SS-DESC",
    prompt: "Which description matches a Shooting Star?",
    correctAnswer: "B",
    options: SHOOTING_STAR_DESC_OPTIONS,
    explanation: "Shooting Star: long upper shadow after a rally; the market rejected higher prices.",
    patternKey: "shooting-star",
    highlightIndex: 2,
  },
  {
    id: "PR-IH-PICK",
    prompt: "Which chart shows an Inverted Hammer?",
    correctAnswer: "D",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "shooting-star" },
      { id: "B", chartKey: "hammer" },
      { id: "C", chartKey: "doji" },
      { id: "D", chartKey: "inverted-hammer" },
      { id: "E", chartKey: "morning-star", highlightIndex: 3 },
    ]),
    explanation:
      "Inverted Hammer: long upper wick after a decline (bullish probe). Same silhouette as Shooting Star — Chart 4 is the inverted-hammer pack.",
    patternKey: "inverted-hammer",
  },
  {
    id: "PR-IH-DESC",
    prompt: "Which description matches an Inverted Hammer?",
    correctAnswer: "C",
    options: INVERTED_HAMMER_DESC_OPTIONS,
    explanation: "Long upper shadow at a bottom after a decline. Context (where it prints) separates it from Shooting Star.",
    patternKey: "inverted-hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-BE-PICK",
    prompt: "Which chart shows Bearish Engulfing?",
    correctAnswer: "A",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "bearish-engulfing" },
      { id: "B", chartKey: "bullish-engulfing" },
      { id: "C", chartKey: "shooting-star" },
      { id: "D", chartKey: "hammer" },
      { id: "E", chartKey: "doji" },
    ]),
    explanation: "Bearish Engulfing: a red body swallows the prior green. Chart 1 is that pair; Chart 2 flips the colors.",
    patternKey: "bearish-engulfing",
  },
  {
    id: "PR-BE-DESC",
    prompt: "Which description matches Bearish Engulfing?",
    correctAnswer: "B",
    options: BEARISH_ENGULFING_DESC_OPTIONS,
    explanation: "A red body completely covers the prior green body — sellers take the session.",
    patternKey: "bearish-engulfing",
    highlightIndex: 2,
  },
  {
    id: "PR-MS-PICK",
    prompt: "Which chart shows a Morning Star?",
    correctAnswer: "E",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "doji" },
      { id: "B", chartKey: "hammer" },
      { id: "C", chartKey: "bullish-engulfing" },
      { id: "D", chartKey: "shooting-star" },
      { id: "E", chartKey: "morning-star", highlightIndex: 3 },
    ]),
    explanation: "Morning Star is three candles: large red, small middle, large green. Chart 5 is that formation — not a single-bar Doji or Hammer.",
    patternKey: "morning-star",
  },
  {
    id: "PR-MS-DESC",
    prompt: "Which description matches a Morning Star?",
    correctAnswer: "C",
    options: MORNING_STAR_DESC_OPTIONS,
    explanation: "Three-bar bullish reversal: wide red, tight middle, then a wide green reclaim.",
    patternKey: "morning-star",
    highlightIndex: 3,
  },
  {
    id: "PR-H-MOVE",
    prompt:
      "SAMPLE: after a selloff, a Hammer prints at the lows. What move should a process-first trader lean toward?",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Lean long / prepare to buy (with risk plan)",
        description: "Bullish reclaim bias — still size for being wrong.",
      },
      {
        id: "B",
        label: "Market short immediately — hammers always fail",
        description: "Dogma, not process.",
      },
      {
        id: "C",
        label: "Ignore risk and max long with no stop",
        description: "No plan.",
      },
    ],
    explanation:
      "A Hammer after a decline is a bullish reclaim cue. Lean long only with a defined risk plan — SAMPLE teaching, not a guaranteed bounce. In other words, you are getting ready to buy because price fell hard and then bounced back — but you still decide ahead of time how much you can afford to lose if the bounce fails.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-H-MOVE2",
    prompt: "A Hammer just printed. Which action is least consistent with good process?",
    correctAnswer: "C",
    options: [
      {
        id: "A",
        label: "Wait for a bit of follow-through before sizing up",
        description: "Confirmation can improve odds.",
      },
      {
        id: "B",
        label: "Place a stop below the hammer low if you go long",
        description: "Invalidation under the wick.",
      },
      {
        id: "C",
        label: "Double size because one hammer means free money",
        description: "One candle is not a license to oversize.",
      },
    ],
    explanation:
      "Process keeps risk defined. Oversizing on a single SAMPLE candle is the mistake — confirmation and stops matter more than certainty. In other words, you are not treating one lucky-looking candle like a jackpot; you keep the amount you risk small enough to survive being wrong.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-D-MOVE",
    prompt: "A Doji prints after a run. What is the best first move?",
    correctAnswer: "B",
    options: [
      {
        id: "A",
        label: "Chase the prior trend with max size",
        description: "Doji is indecision, not a green light.",
      },
      {
        id: "B",
        label: "Wait — no edge until the next candle confirms direction",
        description: "Indecision → patience.",
      },
      {
        id: "C",
        label: "Short 10x because dojis always reverse",
        description: "Blind rule.",
      },
    ],
    explanation:
      "Doji = open ≈ close = indecision. The process move is wait for confirmation, not invent a forced trade from one bar. In other words, you are pausing because the market could not decide up or down — you wait for the next candle before you buy or sell.",
    patternKey: "doji",
    highlightIndex: 2,
  },
  {
    id: "PR-E-MOVE",
    prompt:
      "You see an Engulfing candle. How should you choose the trade direction?",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Match the engulfing candle’s color / direction (green→long bias, red→short bias)",
        description: "The second body shows who won the fight.",
      },
      {
        id: "B",
        label: "Always buy engulfings no matter the color",
        description: "Color/direction matters.",
      },
      {
        id: "C",
        label: "Flip a coin — engulfing has no directional meaning",
        description: "False.",
      },
    ],
    explanation:
      "Engulfing is a momentum handoff: the later body covers the prior one. Lean with that later candle’s direction, still with risk rules. In other words, you are following whoever just took control — if the big new candle finished higher, you lean toward buying; if it finished lower, you lean toward selling or sitting out.",
    patternKey: "engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-BU-MOVE",
    prompt:
      "SAMPLE: Bullish Engulfing after a dip. What move fits the signal?",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Lean long / buy the reclaim (with a stop under the pattern)",
        description: "Buyers took the prior red body.",
      },
      {
        id: "B",
        label: "Short into the green engulfing",
        description: "Fights the signal.",
      },
      {
        id: "C",
        label: "Close the chart and guess from headlines only",
        description: "Skips the tape.",
      },
    ],
    explanation:
      "Bullish Engulfing = buyers covered the prior sell candle. Process lean is long with invalidation under the structure — SAMPLE, not a promise. In other words, you are getting ready to buy because a strong up candle wiped out the prior down candle — and you still pick a price where you will quit if it falls back through.",
    patternKey: "bullish-engulfing",
    highlightIndex: 2,
  },
  {
    id: "PR-BE-MOVE",
    prompt:
      "SAMPLE: Bearish Engulfing after a rally. What move fits the signal?",
    correctAnswer: "B",
    options: [
      {
        id: "A",
        label: "Add to longs because red candles are discounts",
        description: "Fights the signal.",
      },
      {
        id: "B",
        label: "Lean short / fade or tighten/exit longs",
        description: "Sellers covered the prior green body.",
      },
      {
        id: "C",
        label: "Ignore the engulfing and average up blindly",
        description: "No process.",
      },
    ],
    explanation:
      "Bearish Engulfing = sellers swallowed the prior buy candle. Lean short or protect longs; still use a plan and SAMPLE humility. In other words, you are getting ready to sell, or cash out what you already own, because a strong down candle wiped out the prior up candle.",
    patternKey: "bearish-engulfing",
    highlightIndex: 2,
  },
  {
    id: "PR-SS-MOVE",
    prompt:
      "SAMPLE: Shooting Star after an uptrend. What move should you lean toward?",
    correctAnswer: "B",
    options: [
      {
        id: "A",
        label: "Chase higher — long upper wicks mean breakouts",
        description: "Misreads rejection.",
      },
      {
        id: "B",
        label: "Lean short / fade the high or tighten long stops",
        description: "Rejection at the highs.",
      },
      {
        id: "C",
        label: "All-in long because stars are lucky",
        description: "Not a process.",
      },
    ],
    explanation:
      "Shooting Star after a rally rejects higher prices. Process lean is fade/defend longs — not chase the wick. In other words, you are not buying the spike; price tried to go higher and got shoved back down, so you either sell / bet on a drop, or move your “get out” price closer so a fall does not erase your gains.",
    patternKey: "shooting-star",
    highlightIndex: 2,
  },
  {
    id: "PR-IH-MOVE",
    prompt:
      "An Inverted Hammer prints after a decline. Best process move?",
    correctAnswer: "C",
    options: [
      {
        id: "A",
        label: "Short hard — long upper wicks are always bearish",
        description: "Context: this one is at a bottom.",
      },
      {
        id: "B",
        label: "Market buy 5x with no confirmation",
        description: "Overtrades a probe.",
      },
      {
        id: "C",
        label: "Treat as a bullish probe — wait for follow-through before sizing a long",
        description: "Needs confirmation more than a Hammer.",
      },
    ],
    explanation:
      "Inverted Hammer is a bullish probe after a decline, but it often wants the next bar to confirm. Wait/confirm beats blind size. In other words, you are interested in buying after a drop, but you wait for the next candle to prove buyers are still there before you risk more money.",
    patternKey: "inverted-hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-MS-MOVE",
    prompt:
      "SAMPLE: Morning Star completes at the lows (red → small → strong green). What move fits?",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Lean long / buy the reversal with risk under the star low",
        description: "Three-bar bullish handoff.",
      },
      {
        id: "B",
        label: "Short the green candle — three bars mean exhaustion",
        description: "Fights the pattern.",
      },
      {
        id: "C",
        label: "Do nothing forever; multi-candle patterns never matter",
        description: "Avoidance, not skill.",
      },
    ],
    explanation:
      "Morning Star is a structured bullish reversal. Lean long with invalidation under the pattern low — SAMPLE process, not certainty. In other words, you are getting ready to buy because the drop stalled and a strong up candle took over — and you still pick a low point where you admit you were wrong and get out.",
    patternKey: "morning-star",
    highlightIndex: 3,
  },
  {
    id: "PR-BU-DESC2",
    prompt: "After a decline, a large green body fully covers the prior red body. That is…",
    correctAnswer: "A",
    options: BULLISH_ENGULFING_NAME_OPTIONS,
    explanation: "Bullish Engulfing: buyers take the prior range. SAMPLE — wait for context, not a LIVE fill.",
    patternKey: "bullish-engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-BU-DESC3",
    prompt: "Which sentence matches Bullish Engulfing?",
    correctAnswer: "A",
    options: BULLISH_ENGULFING_DESC_OPTIONS,
    explanation: "Green body completely covers the prior red body.",
    patternKey: "bullish-engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-BU-MOVE2",
    prompt: "SAMPLE: Bullish Engulfing prints after a selloff. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Market buy 10x with no invalidation", description: "Oversize." },
      { id: "B", label: "Short because the green candle is late", description: "Fights the pattern." },
      { id: "C", label: "Lean long with risk under the engulfing low", description: "Process." },
    ],
    explanation: "The pattern is a buyer handoff. Size with a level that is wrong if broken. SAMPLE teaching.",
    patternKey: "bullish-engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-BE-DESC2",
    prompt: "After a rally, a large red body fully covers the prior green body. That is…",
    correctAnswer: "B",
    options: BEARISH_ENGULFING_NAME_OPTIONS,
    explanation: "Bearish Engulfing: sellers take the prior range.",
    patternKey: "bearish-engulfing",
    highlightIndex: 2,
  },
  {
    id: "PR-BE-MOVE2",
    prompt: "SAMPLE: Bearish Engulfing at a high. Process-first move?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Stand aside or reduce longs until the thesis is rewritten", description: "Process." },
      { id: "B", label: "Double the long because red means discount", description: "Fights the pattern." },
      { id: "C", label: "Ignore two-candle structures forever", description: "Avoidance." },
    ],
    explanation: "Sellers took the prior body. That is a reason to slow down, not to add blindly. SAMPLE.",
    patternKey: "bearish-engulfing",
    highlightIndex: 2,
  },
  {
    id: "PR-SS-DESC2",
    prompt: "Long upper wick, small body near the low, after a rally. Name it.",
    correctAnswer: "C",
    options: OPTIONS_5,
    explanation: "Shooting Star: rejection at the highs after a run-up.",
    patternKey: "shooting-star",
    highlightIndex: 2,
  },
  {
    id: "PR-SS-MOVE2",
    prompt: "SAMPLE: Shooting Star after a grind up. Process-first move?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Chase the next high immediately", description: "Late chase." },
      { id: "B", label: "Treat as rejection — wait for the next bar before adding long", description: "Process." },
      { id: "C", label: "Assume LIVE volume confirmed it", description: "No LIVE volume here." },
    ],
    explanation: "Upper-wick rejection is a pause cue. Confirm with the next print. SAMPLE teaching.",
    patternKey: "shooting-star",
    highlightIndex: 2,
  },
  {
    id: "PR-IH-DESC2",
    prompt: "Long upper wick, small body, after a decline (not after a rally). That is…",
    correctAnswer: "D",
    options: OPTIONS_5,
    explanation: "Inverted Hammer: same shape as a Shooting Star, bullish context at a bottom.",
    patternKey: "inverted-hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-IH-MOVE2",
    prompt: "SAMPLE: Inverted Hammer after a washout. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Treat it as a Shooting Star short", description: "Wrong location." },
      { id: "B", label: "All-in long on the wick", description: "Oversize a probe." },
      { id: "C", label: "Bullish probe — wait for follow-through before sizing", description: "Process." },
    ],
    explanation: "Context is a bottom. Still a probe: next bar should confirm buyers. SAMPLE.",
    patternKey: "inverted-hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-MS-DESC2",
    prompt: "Large red, small middle, large green at the lows. Name the three-bar pattern.",
    correctAnswer: "C",
    options: MORNING_STAR_NAME_OPTIONS,
    explanation: "Morning Star: three-candle bullish reversal.",
    patternKey: "morning-star",
    highlightIndex: 3,
  },
  {
    id: "PR-MS-MOVE2",
    prompt: "SAMPLE: Morning Star completes. What is the honest invalidation idea?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Risk under the pattern low if you lean long", description: "Process." },
      { id: "B", label: "There is no invalidation on three-bar patterns", description: "False." },
      { id: "C", label: "Short the green bar because three bars mean exhaustion", description: "Fights the pattern." },
    ],
    explanation: "Structured reversal still needs a wrong level. SAMPLE process, not certainty.",
    patternKey: "morning-star",
    highlightIndex: 3,
  },
  {
    id: "PR-TB-PICK",
    prompt: "Which chart shows a Tweezer Bottom?",
    correctAnswer: "C",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "hammer" },
      { id: "B", chartKey: "double-bottom" },
      { id: "C", chartKey: "tweezer-bottom", highlightIndex: 3 },
      { id: "D", chartKey: "doji" },
      { id: "E", chartKey: "triangle" },
    ]),
    explanation: "Tweezer Bottom is two neighboring candles with a matched low after a decline — not a two-swing double bottom.",
    patternKey: "tweezer-bottom",
  },
  {
    id: "PR-TB-DESC",
    prompt: "Which description matches a Tweezer Bottom?",
    correctAnswer: "A",
    options: TWEEZER_BOTTOM_DESC_OPTIONS,
    explanation: "Matched lows on two candles after a decline. SAMPLE — wait for the next print.",
    patternKey: "tweezer-bottom",
    highlightIndex: 3,
  },
  {
    id: "PR-TB-NAME",
    prompt: "Two candles share a similar low after a selloff. Name it.",
    correctAnswer: "B",
    options: TWEEZER_BOTTOM_NAME_OPTIONS,
    explanation: "That is a Tweezer Bottom, not a Hammer (one wick) or a Double Bottom (two swings).",
    patternKey: "tweezer-bottom",
    highlightIndex: 3,
  },
  {
    id: "PR-TB-MOVE",
    prompt: "SAMPLE: Tweezer Bottom prints after a decline. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Market buy 10x because two lows never break", description: "Oversize." },
      { id: "B", label: "Treat it as a Double Top short", description: "Wrong location." },
      { id: "C", label: "Note matched support — wait for the next print before sizing a long", description: "Process." },
    ],
    explanation: "Matched lows are a support clue, not an automatic fill. SAMPLE teaching.",
    patternKey: "tweezer-bottom",
    highlightIndex: 3,
  },
  {
    id: "PR-TB-DESC2",
    prompt: "How is a Tweezer Bottom different from a Double Bottom?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Tweezer is two neighboring candles; Double Bottom is two swings with a bounce between", description: DESC_HINT },
      { id: "B", label: "They are the same pattern with two names", description: DESC_HINT },
      { id: "C", label: "Tweezer Bottom is always a LIVE short signal", description: DESC_HINT },
    ],
    explanation: "One is a two-bar match. The other is a swing structure. SAMPLE, not LIVE.",
    patternKey: "tweezer-bottom",
    highlightIndex: 3,
  },
  {
    id: "PR-TB-MOVE2",
    prompt: "SAMPLE: Tweezer Bottom, then the next bar loses the shared low. Process?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Add to the long — the tweezer cannot fail", description: "Dogma." },
      { id: "B", label: "The support clue failed — stand aside or cut if you already leaned long", description: "Process." },
      { id: "C", label: "Ignore later bars; two-bar patterns settle the trade", description: "Avoidance." },
    ],
    explanation: "The next print can cancel the match. SAMPLE process, not certainty.",
    patternKey: "tweezer-bottom",
    highlightIndex: 4,
  },
  {
    id: "PR-RW-PICK",
    prompt: "Which chart shows a Rising Wedge?",
    correctAnswer: "B",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "falling-wedge" },
      { id: "B", chartKey: "rising-wedge" },
      { id: "C", chartKey: "bull-flag" },
      { id: "D", chartKey: "triangle" },
      { id: "E", chartKey: "hammer" },
    ]),
    explanation: "Rising Wedge climbs inside two upward converging lines — not a down-squeeze falling wedge or a flag pole.",
    patternKey: "rising-wedge",
  },
  {
    id: "PR-RW-DESC",
    prompt: "Which description matches a Rising Wedge?",
    correctAnswer: "A",
    options: RISING_WEDGE_DESC_OPTIONS,
    explanation: "Upward converging lines. SAMPLE: a break of the lower line still needs later bars.",
    patternKey: "rising-wedge",
  },
  {
    id: "PR-RW-NAME",
    prompt: "Price rises inside two upward, converging lines. Name it.",
    correctAnswer: "A",
    options: RISING_WEDGE_NAME_OPTIONS,
    explanation: "Rising Wedge — buying is tiring. Not a bull flag pole or a flat triangle.",
    patternKey: "rising-wedge",
  },
  {
    id: "PR-RW-MOVE",
    prompt: "SAMPLE: Rising Wedge after a grind up. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Chase every new high until it breaks", description: "Late chase." },
      { id: "B", label: "Short immediately because wedges always dump", description: "Dogma." },
      { id: "C", label: "Treat as tiring buying — wait for a lower-line break, then the next print", description: "Process." },
    ],
    explanation: "The wedge is a structure, not a LIVE sell button. SAMPLE teaching.",
    patternKey: "rising-wedge",
  },
  {
    id: "PR-RW-DESC2",
    prompt: "A Rising Wedge differs from a Triangle because…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "A triangle always points down and a wedge never does", description: DESC_HINT },
      { id: "B", label: "The wedge has an upward tilt; a triangle squeeze has no built-in direction", description: DESC_HINT },
      { id: "C", label: "Wedges are LIVE orders and triangles are SAMPLE only", description: DESC_HINT },
    ],
    explanation: "Tilt vs squeeze. Direction still waits for a break. SAMPLE, not LIVE.",
    patternKey: "rising-wedge",
  },
  {
    id: "PR-RW-MOVE2",
    prompt: "SAMPLE: Rising Wedge, no break yet. Honest invalidation idea if you fade?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "You are wrong if price holds above the upper line and keeps expanding", description: "Process." },
      { id: "B", label: "There is no wrong level on structure patterns", description: "False." },
      { id: "C", label: "Double the short on every higher high", description: "Oversize." },
    ],
    explanation: "Structures still need a level that proves you wrong. SAMPLE process.",
    patternKey: "rising-wedge",
  },
  {
    id: "PR-BF-PICK",
    prompt: "Which chart shows a Bull Flag?",
    correctAnswer: "D",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "rising-wedge" },
      { id: "B", chartKey: "triangle" },
      { id: "C", chartKey: "hammer" },
      { id: "D", chartKey: "bull-flag" },
      { id: "E", chartKey: "double-top" },
    ]),
    explanation: "Bull Flag is a sharp pole, then a tight pause — not a slow rising squeeze.",
    patternKey: "bull-flag",
  },
  {
    id: "PR-BF-DESC",
    prompt: "Which description matches a Bull Flag?",
    correctAnswer: "A",
    options: BULL_FLAG_DESC_OPTIONS,
    explanation: "Pole, then a tight rest. SAMPLE: the pause can be a rest if the thrust was clean.",
    patternKey: "bull-flag",
  },
  {
    id: "PR-BF-NAME",
    prompt: "A sharp rise, then a tight downward pause. Name it.",
    correctAnswer: "B",
    options: BULL_FLAG_NAME_OPTIONS,
    explanation: "Bull Flag — pole then rest. Not a rising wedge grind.",
    patternKey: "bull-flag",
  },
  {
    id: "PR-BF-MOVE",
    prompt: "SAMPLE: Bull Flag pause after a clean thrust. Process-first move?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Treat the pause as a possible rest — wait for the flag to hold before adding", description: "Process." },
      { id: "B", label: "Short the pause because every dip is a new downtrend", description: "Fights the thrust." },
      { id: "C", label: "All-in at the first pause bar with no invalidation", description: "Oversize." },
    ],
    explanation: "A rest is a hypothesis. Confirm the pause holds. SAMPLE teaching.",
    patternKey: "bull-flag",
  },
  {
    id: "PR-BF-DESC2",
    prompt: "What makes a Bull Flag different from a Rising Wedge?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Nothing — both are just uptrends", description: DESC_HINT },
      { id: "B", label: "A flag is always a LIVE buy and a wedge is always a LIVE sell", description: DESC_HINT },
      { id: "C", label: "A flag is a sharp pole then a tight rest; a rising wedge is a slow upward squeeze", description: DESC_HINT },
    ],
    explanation: "Pole-and-pause vs grind-and-squeeze. SAMPLE, not LIVE.",
    patternKey: "bull-flag",
  },
  {
    id: "PR-BF-MOVE2",
    prompt: "SAMPLE: Bull Flag, then the pause loses the pole low. Process?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Add long — flags never fail", description: "Dogma." },
      { id: "B", label: "The rest idea failed — stand aside until a new structure prints", description: "Process." },
      { id: "C", label: "Assume DELAYED data made the break fake and ignore it", description: "Feed theater." },
    ],
    explanation: "If the pause breaks the thrust, you do not own a flag. SAMPLE process.",
    patternKey: "bull-flag",
  },
  {
    id: "PR-DT-PICK",
    prompt: "Which chart shows a Double Top?",
    correctAnswer: "A",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "double-top" },
      { id: "B", chartKey: "double-bottom" },
      { id: "C", chartKey: "head-shoulders" },
      { id: "D", chartKey: "tweezer-top" },
      { id: "E", chartKey: "triangle" },
    ]),
    explanation: "Double Top is two similar swing highs with a dip between — not three peaks and not a two-bar tweezer.",
    patternKey: "double-top",
  },
  {
    id: "PR-DT-DESC",
    prompt: "Which description matches a Double Top?",
    correctAnswer: "A",
    options: DOUBLE_TOP_DESC_OPTIONS,
    explanation: "Two similar highs, failed breakout on the second. SAMPLE: confirm with a break of the dip.",
    patternKey: "double-top",
  },
  {
    id: "PR-DT-NAME",
    prompt: "Two similar highs with a dip between them. Name it.",
    correctAnswer: "A",
    options: DOUBLE_TOP_NAME_OPTIONS,
    explanation: "Double Top — two peaks, one dip. Not a double bottom or a triangle squeeze.",
    patternKey: "double-top",
  },
  {
    id: "PR-DT-MOVE",
    prompt: "SAMPLE: Double Top, second high failed. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Buy the second high because two tests mean breakout", description: "Chase." },
      { id: "B", label: "Short the first tick of the second high with no neckline plan", description: "Early fade." },
      { id: "C", label: "Wait for a break of the dip (neckline) before treating it as confirmed", description: "Process." },
    ],
    explanation: "The usual confirmation is the dip break, not the second high itself. SAMPLE.",
    patternKey: "double-top",
  },
  {
    id: "PR-DT-DESC2",
    prompt: "A Double Top is not a Tweezer Top because…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Tweezer tops only appear on crypto tapes", description: DESC_HINT },
      { id: "B", label: "Tweezer Top is two neighboring highs; Double Top is two swings with a dip between", description: DESC_HINT },
      { id: "C", label: "Double Top is a LIVE order ticket", description: DESC_HINT },
    ],
    explanation: "Two-bar match vs two-swing structure. SAMPLE, not LIVE.",
    patternKey: "double-top",
  },
  {
    id: "PR-DT-MOVE2",
    prompt: "SAMPLE: Double Top neckline holds and price makes a higher high. Process?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "The failed-breakout idea is wrong — stand aside or rewrite the thesis", description: "Process." },
      { id: "B", label: "Keep shorting every high because doubles always win", description: "Dogma." },
      { id: "C", label: "Treat the higher high as a LIVE fill you missed", description: "No LIVE desk." },
    ],
    explanation: "A higher high after the second peak cancels the double. SAMPLE process.",
    patternKey: "double-top",
  },
  {
    id: "PR-DB-PICK",
    prompt: "Which chart shows a Double Bottom?",
    correctAnswer: "E",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "tweezer-bottom" },
      { id: "B", chartKey: "double-top" },
      { id: "C", chartKey: "hammer" },
      { id: "D", chartKey: "triangle" },
      { id: "E", chartKey: "double-bottom" },
    ]),
    explanation: "Double Bottom is two swing lows with a bounce between — not a two-bar tweezer match.",
    patternKey: "double-bottom",
  },
  {
    id: "PR-DB-DESC",
    prompt: "Which description matches a Double Bottom?",
    correctAnswer: "A",
    options: DOUBLE_BOTTOM_DESC_OPTIONS,
    explanation: "Two similar lows, second low held. SAMPLE: confirm with a break of the bounce high.",
    patternKey: "double-bottom",
  },
  {
    id: "PR-DB-NAME",
    prompt: "Two similar lows with a bounce between them. Name it.",
    correctAnswer: "C",
    options: DOUBLE_BOTTOM_NAME_OPTIONS,
    explanation: "Double Bottom — two swings. Not a two-bar tweezer and not a double top.",
    patternKey: "double-bottom",
  },
  {
    id: "PR-DB-MOVE",
    prompt: "SAMPLE: Double Bottom, second low held. Process-first move?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Market buy the second low with no bounce-high plan", description: "Early." },
      { id: "B", label: "Wait for a break of the bounce high before treating it as confirmed", description: "Process." },
      { id: "C", label: "Short because two lows mean a third test is coming", description: "Dogma." },
    ],
    explanation: "Usual confirmation is the bounce-high break. SAMPLE teaching.",
    patternKey: "double-bottom",
  },
  {
    id: "PR-DB-DESC2",
    prompt: "How do you tell a Double Bottom from a Tweezer Bottom?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Double Bottom has a bounce swing between two lows; Tweezer Bottom is two neighboring candles", description: DESC_HINT },
      { id: "B", label: "Double Bottom is always bearish", description: DESC_HINT },
      { id: "C", label: "Tweezer Bottom requires a LIVE tick tape", description: DESC_HINT },
    ],
    explanation: "Swing vs two-bar. SAMPLE, not LIVE.",
    patternKey: "double-bottom",
  },
  {
    id: "PR-DB-MOVE2",
    prompt: "SAMPLE: Double Bottom, then the second low breaks. Process?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Add long — the second test must bounce later", description: "Hope." },
      { id: "B", label: "Treat the break as a LIVE stop you can still hold", description: "No LIVE desk." },
      { id: "C", label: "The hold idea failed — stand aside or cut if you already leaned long", description: "Process." },
    ],
    explanation: "A broken second low is not a double bottom anymore. SAMPLE process.",
    patternKey: "double-bottom",
  },
  {
    id: "PR-TR-PICK",
    prompt: "Which chart shows a Triangle?",
    correctAnswer: "C",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "rising-wedge" },
      { id: "B", chartKey: "falling-wedge" },
      { id: "C", chartKey: "triangle" },
      { id: "D", chartKey: "bull-flag" },
      { id: "E", chartKey: "doji" },
    ]),
    explanation: "Triangle is a two-sided squeeze with no built-in tilt — not a rising or falling wedge.",
    patternKey: "triangle",
  },
  {
    id: "PR-TR-DESC",
    prompt: "Which description matches a Triangle?",
    correctAnswer: "A",
    options: TRIANGLE_DESC_OPTIONS,
    explanation: "Squeeze toward a point. SAMPLE: wait for which side breaks, then the next print.",
    patternKey: "triangle",
  },
  {
    id: "PR-TR-NAME",
    prompt: "Highs and lows squeeze toward a point. Name it.",
    correctAnswer: "A",
    options: TRIANGLE_NAME_OPTIONS,
    explanation: "Triangle — no built-in direction. Not a rising wedge or a flag pole.",
    patternKey: "triangle",
  },
  {
    id: "PR-TR-MOVE",
    prompt: "SAMPLE: Triangle is still squeezing. Process-first move?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Buy because triangles always break up", description: "Dogma." },
      { id: "B", label: "Wait for which side breaks, then the next print — the squeeze is not the trade", description: "Process." },
      { id: "C", label: "Short because squeezes always dump", description: "Dogma." },
    ],
    explanation: "Direction is the later break, not the triangle itself. SAMPLE teaching.",
    patternKey: "triangle",
  },
  {
    id: "PR-TR-DESC2",
    prompt: "A Triangle is not a Rising Wedge because…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Triangles only appear on forex SAMPLE packs", description: DESC_HINT },
      { id: "B", label: "Wedges never converge", description: DESC_HINT },
      { id: "C", label: "A triangle squeeze has no built-in tilt; a rising wedge climbs as it squeezes", description: DESC_HINT },
    ],
    explanation: "Tilt vs two-sided squeeze. SAMPLE, not LIVE.",
    patternKey: "triangle",
  },
  {
    id: "PR-TR-MOVE2",
    prompt: "SAMPLE: Triangle breaks, then the next bar fails back inside. Process?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "The break did not hold — stand aside until a later print settles it", description: "Process." },
      { id: "B", label: "Double the breakout because failed breaks always retry", description: "Hope." },
      { id: "C", label: "Treat the fail as a LIVE fill you can still chase", description: "No LIVE desk." },
    ],
    explanation: "A break that fails is not confirmation. SAMPLE process.",
    patternKey: "triangle",
  },
  {
    id: "PR-HM-PICK",
    prompt: "Which chart shows a Hanging Man?",
    correctAnswer: "B",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "hammer" },
      { id: "B", chartKey: "hanging-man", highlightIndex: 3 },
      { id: "C", chartKey: "shooting-star" },
      { id: "D", chartKey: "doji" },
      { id: "E", chartKey: "inverted-hammer" },
    ]),
    explanation: "Hanging Man is the same long lower wick as a Hammer, but after a rally — context, not silhouette.",
    patternKey: "hanging-man",
  },
  {
    id: "PR-HM-DESC",
    prompt: "Which description matches a Hanging Man?",
    correctAnswer: "A",
    options: HANGING_MAN_DESC_OPTIONS,
    explanation: "Long lower wick after a rally. SAMPLE — wait for the next print.",
    patternKey: "hanging-man",
    highlightIndex: 3,
  },
  {
    id: "PR-HM-NAME",
    prompt: "Long lower wick after a rally. Name it.",
    correctAnswer: "B",
    options: HANGING_MAN_NAME_OPTIONS,
    explanation: "Hanging Man. A Hammer is the same shape after a decline.",
    patternKey: "hanging-man",
    highlightIndex: 3,
  },
  {
    id: "PR-HM-MOVE",
    prompt: "SAMPLE: Hanging Man prints after a rally. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Short immediately because a long lower wick always dumps", description: "Dogma." },
      { id: "B", label: "Treat it as a Hammer long at the highs", description: "Wrong location." },
      { id: "C", label: "Note sellers may be showing up — wait for the next print before fading", description: "Process." },
    ],
    explanation: "The wick is a clue, not a fill. SAMPLE teaching.",
    patternKey: "hanging-man",
    highlightIndex: 3,
  },
  {
    id: "PR-HM-DESC2",
    prompt: "How is a Hanging Man different from a Hammer?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Same long lower wick — Hanging Man is after a rally; Hammer is after a decline", description: DESC_HINT },
      { id: "B", label: "Hanging Man has a long upper wick and Hammer never does", description: DESC_HINT },
      { id: "C", label: "Hammer is a LIVE buy and Hanging Man is a LIVE sell", description: DESC_HINT },
    ],
    explanation: "Context, not silhouette. SAMPLE, not LIVE.",
    patternKey: "hanging-man",
    highlightIndex: 3,
  },
  {
    id: "PR-HM-MOVE2",
    prompt: "SAMPLE: Hanging Man, then the next bar makes a new high and holds. Process?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Double the short — hanging men cannot fail", description: "Dogma." },
      { id: "B", label: "The fade idea failed — stand aside or cut if you already leaned short", description: "Process." },
      { id: "C", label: "Ignore later bars; one wick settles the trade", description: "Avoidance." },
    ],
    explanation: "A new high after the wick cancels the hanging-man read. SAMPLE process.",
    patternKey: "hanging-man",
    highlightIndex: 4,
  },
  {
    id: "PR-ES-PICK",
    prompt: "Which chart shows an Evening Star?",
    correctAnswer: "D",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "morning-star" },
      { id: "B", chartKey: "doji" },
      { id: "C", chartKey: "shooting-star" },
      { id: "D", chartKey: "evening-star", highlightIndex: 3 },
      { id: "E", chartKey: "bearish-engulfing" },
    ]),
    explanation: "Evening Star is green · small · red at the highs — the inverse of a Morning Star.",
    patternKey: "evening-star",
  },
  {
    id: "PR-ES-DESC",
    prompt: "Which description matches an Evening Star?",
    correctAnswer: "B",
    options: EVENING_STAR_DESC_OPTIONS,
    explanation: "Large green, small middle, large red. SAMPLE — confirm with later bars.",
    patternKey: "evening-star",
    highlightIndex: 3,
  },
  {
    id: "PR-ES-NAME",
    prompt: "Large green, small middle, then large red at the highs. Name it.",
    correctAnswer: "C",
    options: EVENING_STAR_NAME_OPTIONS,
    explanation: "Evening Star. Morning Star is the opposite three-bar shape at the lows.",
    patternKey: "evening-star",
    highlightIndex: 3,
  },
  {
    id: "PR-ES-MOVE",
    prompt: "SAMPLE: Evening Star completes at the highs. Process-first move?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Treat as a possible top — wait for the next print before sizing a fade", description: "Process." },
      { id: "B", label: "Buy the red bar because three bars mean a bounce", description: "Fights the pattern." },
      { id: "C", label: "Market short 10x because evening stars never fail", description: "Oversize." },
    ],
    explanation: "Three bars are a structure, not a LIVE sell. SAMPLE teaching.",
    patternKey: "evening-star",
    highlightIndex: 3,
  },
  {
    id: "PR-ES-DESC2",
    prompt: "An Evening Star differs from a Morning Star because…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Evening Star is one candle and Morning Star is three", description: DESC_HINT },
      { id: "B", label: "They are the same pattern with two names", description: DESC_HINT },
      { id: "C", label: "Evening is green · small · red at a top; Morning is red · small · green at a bottom", description: DESC_HINT },
    ],
    explanation: "Inverse three-bar stories. SAMPLE, not LIVE.",
    patternKey: "evening-star",
    highlightIndex: 3,
  },
  {
    id: "PR-ES-MOVE2",
    prompt: "SAMPLE: Evening Star, then the next bar reclaims the first green high. Process?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Add to the short — three bars cannot fail", description: "Dogma." },
      { id: "B", label: "The top idea failed — stand aside or cut if you already leaned short", description: "Process." },
      { id: "C", label: "Treat the reclaim as a LIVE fill you missed", description: "No LIVE desk." },
    ],
    explanation: "A reclaim of the first green high cancels the evening-star read. SAMPLE process.",
    patternKey: "evening-star",
    highlightIndex: 4,
  },
  {
    id: "PR-PL-PICK",
    prompt: "Which chart shows a Piercing Line?",
    correctAnswer: "A",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "piercing-line", highlightIndex: 3 },
      { id: "B", chartKey: "bullish-engulfing" },
      { id: "C", chartKey: "hammer" },
      { id: "D", chartKey: "morning-star" },
      { id: "E", chartKey: "tweezer-bottom" },
    ]),
    explanation: "Piercing Line closes well into the prior red body — it does not fully cover it.",
    patternKey: "piercing-line",
  },
  {
    id: "PR-PL-DESC",
    prompt: "Which description matches a Piercing Line?",
    correctAnswer: "A",
    options: PIERCING_LINE_DESC_OPTIONS,
    explanation: "Opens lower, closes into the red body. SAMPLE — wait for the next print.",
    patternKey: "piercing-line",
    highlightIndex: 3,
  },
  {
    id: "PR-PL-NAME",
    prompt: "After a decline, a green opens lower then closes well into the prior red. Name it.",
    correctAnswer: "A",
    options: PIERCING_LINE_NAME_OPTIONS,
    explanation: "Piercing Line. Bullish Engulfing would fully cover the prior red body.",
    patternKey: "piercing-line",
    highlightIndex: 3,
  },
  {
    id: "PR-PL-MOVE",
    prompt: "SAMPLE: Piercing Line prints after a decline. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Market buy because a pierce always reverses", description: "Dogma." },
      { id: "B", label: "Treat it as a Bearish Engulfing short", description: "Wrong pattern." },
      { id: "C", label: "Note a reclaim into the prior red — wait for the next print before sizing a long", description: "Process." },
    ],
    explanation: "A pierce is a reclaim clue, not an automatic fill. SAMPLE teaching.",
    patternKey: "piercing-line",
    highlightIndex: 3,
  },
  {
    id: "PR-PL-DESC2",
    prompt: "A Piercing Line is not a Bullish Engulfing because…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Piercing Line only appears on forex SAMPLE packs", description: DESC_HINT },
      { id: "B", label: "The green closes into the prior red body; it does not fully cover it", description: DESC_HINT },
      { id: "C", label: "Engulfing is a LIVE order and Piercing Line is SAMPLE only", description: DESC_HINT },
    ],
    explanation: "Into the body vs full cover. SAMPLE, not LIVE.",
    patternKey: "piercing-line",
    highlightIndex: 3,
  },
  {
    id: "PR-PL-MOVE2",
    prompt: "SAMPLE: Piercing Line, then the next bar loses the pierce close. Process?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "The reclaim clue failed — stand aside or cut if you already leaned long", description: "Process." },
      { id: "B", label: "Add long — pierces always retry", description: "Hope." },
      { id: "C", label: "Treat the fail as a LIVE stop you can still hold", description: "No LIVE desk." },
    ],
    explanation: "The next print can cancel the pierce. SAMPLE process.",
    patternKey: "piercing-line",
    highlightIndex: 4,
  },
  {
    id: "PR-DC-PICK",
    prompt: "Which chart shows Dark Cloud Cover?",
    correctAnswer: "C",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "bearish-engulfing" },
      { id: "B", chartKey: "shooting-star" },
      { id: "C", chartKey: "dark-cloud-cover", highlightIndex: 3 },
      { id: "D", chartKey: "evening-star" },
      { id: "E", chartKey: "tweezer-top" },
    ]),
    explanation: "Dark Cloud Cover closes well into the prior green body — it does not fully cover it.",
    patternKey: "dark-cloud-cover",
  },
  {
    id: "PR-DC-DESC",
    prompt: "Which description matches Dark Cloud Cover?",
    correctAnswer: "B",
    options: DARK_CLOUD_DESC_OPTIONS,
    explanation: "Opens higher, closes into the green body. SAMPLE — wait for the next print.",
    patternKey: "dark-cloud-cover",
    highlightIndex: 3,
  },
  {
    id: "PR-DC-NAME",
    prompt: "After a rally, a red opens higher then closes well into the prior green. Name it.",
    correctAnswer: "B",
    options: DARK_CLOUD_NAME_OPTIONS,
    explanation: "Dark Cloud Cover. Bearish Engulfing would fully cover the prior green body.",
    patternKey: "dark-cloud-cover",
    highlightIndex: 3,
  },
  {
    id: "PR-DC-MOVE",
    prompt: "SAMPLE: Dark Cloud Cover prints after a rally. Process-first move?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Note a cover into the prior green — wait for the next print before fading", description: "Process." },
      { id: "B", label: "Buy the red bar because clouds always bounce", description: "Fights the pattern." },
      { id: "C", label: "Market short because covers never fail", description: "Oversize." },
    ],
    explanation: "A cover is a rejection clue, not a LIVE sell. SAMPLE teaching.",
    patternKey: "dark-cloud-cover",
    highlightIndex: 3,
  },
  {
    id: "PR-DC-DESC2",
    prompt: "Dark Cloud Cover is not a Bearish Engulfing because…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Dark Cloud Cover is always three candles", description: DESC_HINT },
      { id: "B", label: "They are the same pattern with two names", description: DESC_HINT },
      { id: "C", label: "The red closes into the prior green body; it does not fully cover it", description: DESC_HINT },
    ],
    explanation: "Into the body vs full cover. SAMPLE, not LIVE.",
    patternKey: "dark-cloud-cover",
    highlightIndex: 3,
  },
  {
    id: "PR-DC-MOVE2",
    prompt: "SAMPLE: Dark Cloud Cover, then the next bar reclaims the cover close. Process?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Add to the short — clouds cannot fail", description: "Dogma." },
      { id: "B", label: "The cover idea failed — stand aside or cut if you already leaned short", description: "Process." },
      { id: "C", label: "Ignore later bars; two-bar patterns settle the trade", description: "Avoidance." },
    ],
    explanation: "A reclaim after the cover cancels the fade. SAMPLE process.",
    patternKey: "dark-cloud-cover",
    highlightIndex: 4,
  },
  {
    id: "PR-WS-PICK",
    prompt: "Which chart shows Three White Soldiers?",
    correctAnswer: "E",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "morning-star" },
      { id: "B", chartKey: "bullish-engulfing" },
      { id: "C", chartKey: "hammer" },
      { id: "D", chartKey: "piercing-line" },
      { id: "E", chartKey: "three-white-soldiers", highlightIndex: 3 },
    ]),
    explanation: "Three White Soldiers is three rising green bodies in a row — not a one-bar engulf or a three-bar star.",
    patternKey: "three-white-soldiers",
  },
  {
    id: "PR-WS-DESC",
    prompt: "Which description matches Three White Soldiers?",
    correctAnswer: "A",
    options: THREE_WHITE_DESC_OPTIONS,
    explanation: "Three rising greens after a decline or pause. SAMPLE read: buyers in control.",
    patternKey: "three-white-soldiers",
    highlightIndex: 3,
  },
  {
    id: "PR-WS-NAME",
    prompt: "Three rising green bodies in a row after a decline. Name it.",
    correctAnswer: "C",
    options: THREE_WHITE_NAME_OPTIONS,
    explanation: "Three White Soldiers. Not a Morning Star and not one engulfing bar.",
    patternKey: "three-white-soldiers",
    highlightIndex: 3,
  },
  {
    id: "PR-WS-MOVE",
    prompt: "SAMPLE: Three White Soldiers just printed. Process-first move?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Chase the third close with no invalidation", description: "Late chase." },
      { id: "B", label: "Treat as buyers in control — wait for a later print; risk under the first soldier if you lean long", description: "Process." },
      { id: "C", label: "Short the third green because three up bars mean exhaustion", description: "Fights the pattern." },
    ],
    explanation: "Three greens are a read, not a chase button. SAMPLE teaching.",
    patternKey: "three-white-soldiers",
    highlightIndex: 3,
  },
  {
    id: "PR-WS-DESC2",
    prompt: "Three White Soldiers differ from a Morning Star because…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Soldiers are three rising greens; Morning Star is red · small · green", description: DESC_HINT },
      { id: "B", label: "Morning Star is always four candles", description: DESC_HINT },
      { id: "C", label: "Soldiers are a LIVE buy ticket", description: DESC_HINT },
    ],
    explanation: "Three same-color bodies vs a three-bar reversal mix. SAMPLE, not LIVE.",
    patternKey: "three-white-soldiers",
    highlightIndex: 3,
  },
  {
    id: "PR-WS-MOVE2",
    prompt: "SAMPLE: Three White Soldiers, then a red bar undercuts the first soldier. Process?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Add long — soldiers never fail", description: "Dogma." },
      { id: "B", label: "Treat the undercut as a LIVE fill you can still hold", description: "No LIVE desk." },
      { id: "C", label: "The control idea failed — stand aside or cut if you already leaned long", description: "Process." },
    ],
    explanation: "Losing the first soldier is not a soldiers tape anymore. SAMPLE process.",
    patternKey: "three-white-soldiers",
    highlightIndex: 4,
  },
  {
    id: "PR-BC-PICK",
    prompt: "Which chart shows Three Black Crows?",
    correctAnswer: "B",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "evening-star" },
      { id: "B", chartKey: "three-black-crows", highlightIndex: 3 },
      { id: "C", chartKey: "bearish-engulfing" },
      { id: "D", chartKey: "dark-cloud-cover" },
      { id: "E", chartKey: "shooting-star" },
    ]),
    explanation: "Three Black Crows is three falling red bodies in a row — not a star or one engulfing bar.",
    patternKey: "three-black-crows",
  },
  {
    id: "PR-BC-DESC",
    prompt: "Which description matches Three Black Crows?",
    correctAnswer: "B",
    options: THREE_CROWS_DESC_OPTIONS,
    explanation: "Three falling reds after a rally or pause. SAMPLE read: sellers in control.",
    patternKey: "three-black-crows",
    highlightIndex: 3,
  },
  {
    id: "PR-BC-NAME",
    prompt: "Three falling red bodies in a row after a rally. Name it.",
    correctAnswer: "B",
    options: THREE_CROWS_NAME_OPTIONS,
    explanation: "Three Black Crows. Not an Evening Star and not one engulfing bar.",
    patternKey: "three-black-crows",
    highlightIndex: 3,
  },
  {
    id: "PR-BC-MOVE",
    prompt: "SAMPLE: Three Black Crows just printed. Process-first move?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Treat as sellers in control — wait for a later print; risk above the first crow if you lean short", description: "Process." },
      { id: "B", label: "Buy the third red because three down bars mean a bounce", description: "Fights the pattern." },
      { id: "C", label: "Market short the third close with no invalidation", description: "Oversize." },
    ],
    explanation: "Three reds are a read, not a chase button. SAMPLE teaching.",
    patternKey: "three-black-crows",
    highlightIndex: 3,
  },
  {
    id: "PR-BC-DESC2",
    prompt: "Three Black Crows differ from an Evening Star because…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Crows only appear on crypto SAMPLE packs", description: DESC_HINT },
      { id: "B", label: "Evening Star is always two candles", description: DESC_HINT },
      { id: "C", label: "Crows are three falling reds; Evening Star is green · small · red", description: DESC_HINT },
    ],
    explanation: "Three same-color bodies vs a three-bar reversal mix. SAMPLE, not LIVE.",
    patternKey: "three-black-crows",
    highlightIndex: 3,
  },
  {
    id: "PR-BC-MOVE2",
    prompt: "SAMPLE: Three Black Crows, then a green bar reclaims the first crow high. Process?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Add short — crows never fail", description: "Dogma." },
      { id: "B", label: "The control idea failed — stand aside or cut if you already leaned short", description: "Process." },
      { id: "C", label: "Treat the reclaim as a LIVE fill you missed", description: "No LIVE desk." },
    ],
    explanation: "Reclaiming the first crow cancels the crows tape. SAMPLE process.",
    patternKey: "three-black-crows",
    highlightIndex: 4,
  },
  {
    id: "PR-HA-PICK",
    prompt: "Which chart shows a Harami?",
    correctAnswer: "D",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "engulfing" },
      { id: "B", chartKey: "doji" },
      { id: "C", chartKey: "hammer" },
      { id: "D", chartKey: "harami", highlightIndex: 3 },
      { id: "E", chartKey: "morning-star" },
    ]),
    explanation: "Harami is a small body nested inside the prior larger body — the inverse of engulfing.",
    patternKey: "harami",
  },
  {
    id: "PR-HA-DESC",
    prompt: "Which description matches a Harami?",
    correctAnswer: "B",
    options: HARAMI_DESC_OPTIONS,
    explanation: "Small nested inside large. SAMPLE — direction needs the next print.",
    patternKey: "harami",
    highlightIndex: 3,
  },
  {
    id: "PR-HA-NAME",
    prompt: "A small body nested inside the prior larger body. Name it.",
    correctAnswer: "C",
    options: HARAMI_NAME_OPTIONS,
    explanation: "Harami. Engulfing is the opposite: the current body covers the prior one.",
    patternKey: "harami",
    highlightIndex: 3,
  },
  {
    id: "PR-HA-MOVE",
    prompt: "SAMPLE: Harami prints after a swing. Process-first move?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Treat as indecision — wait for the next print; do not size on the nest alone", description: "Process." },
      { id: "B", label: "Market buy because a nest always reverses up", description: "Dogma." },
      { id: "C", label: "Market short because a nest always reverses down", description: "Dogma." },
    ],
    explanation: "Harami confirmation is low. SAMPLE teaching.",
    patternKey: "harami",
    highlightIndex: 3,
  },
  {
    id: "PR-HA-DESC2",
    prompt: "A Harami is not an Engulfing because…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Harami nests a small body inside the prior body; Engulfing covers the prior body", description: DESC_HINT },
      { id: "B", label: "Harami is always three candles", description: DESC_HINT },
      { id: "C", label: "Engulfing is a LIVE order ticket", description: DESC_HINT },
    ],
    explanation: "Nested vs covering. SAMPLE, not LIVE.",
    patternKey: "harami",
    highlightIndex: 3,
  },
  {
    id: "PR-HA-MOVE2",
    prompt: "SAMPLE: Harami, then the next bar expands through the large-body side. Process?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Ignore the expansion — the nest already settled the trade", description: "Avoidance." },
      { id: "B", label: "Treat the expansion as a LIVE fill you missed", description: "No LIVE desk." },
      { id: "C", label: "The next print decided direction — use that break, not the nest alone", description: "Process." },
    ],
    explanation: "The nest waits; the next print decides. SAMPLE process.",
    patternKey: "harami",
    highlightIndex: 4,
  },
  {
    id: "PR-TT-PICK",
    prompt: "Which chart shows a Tweezer Top?",
    correctAnswer: "C",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "double-top" },
      { id: "B", chartKey: "shooting-star" },
      { id: "C", chartKey: "tweezer-top", highlightIndex: 3 },
      { id: "D", chartKey: "tweezer-bottom" },
      { id: "E", chartKey: "head-shoulders" },
    ]),
    explanation: "Tweezer Top is two neighboring candles with a matched high after a rally — not a two-swing double top.",
    patternKey: "tweezer-top",
  },
  {
    id: "PR-TT-DESC",
    prompt: "Which description matches a Tweezer Top?",
    correctAnswer: "A",
    options: TWEEZER_TOP_DESC_OPTIONS,
    explanation: "Matched highs on two candles after a rally. SAMPLE — wait for the next print.",
    patternKey: "tweezer-top",
    highlightIndex: 3,
  },
  {
    id: "PR-TT-NAME",
    prompt: "Two candles share a similar high after a rally. Name it.",
    correctAnswer: "C",
    options: TWEEZER_TOP_NAME_OPTIONS,
    explanation: "Tweezer Top, not a Double Top (two swings) or a Shooting Star (one wick).",
    patternKey: "tweezer-top",
    highlightIndex: 3,
  },
  {
    id: "PR-TT-MOVE",
    prompt: "SAMPLE: Tweezer Top prints after a rally. Process-first move?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Market short 10x because two highs never break", description: "Oversize." },
      { id: "B", label: "Note matched rejection — wait for the next print before sizing a fade", description: "Process." },
      { id: "C", label: "Treat it as a Tweezer Bottom long", description: "Wrong location." },
    ],
    explanation: "Matched highs are a rejection clue, not an automatic fill. SAMPLE teaching.",
    patternKey: "tweezer-top",
    highlightIndex: 3,
  },
  {
    id: "PR-TT-DESC2",
    prompt: "How is a Tweezer Top different from a Double Top?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Tweezer is two neighboring candles; Double Top is two swings with a dip between", description: DESC_HINT },
      { id: "B", label: "They are the same pattern with two names", description: DESC_HINT },
      { id: "C", label: "Tweezer Top is always a LIVE long signal", description: DESC_HINT },
    ],
    explanation: "Two-bar match vs two-swing structure. SAMPLE, not LIVE.",
    patternKey: "tweezer-top",
    highlightIndex: 3,
  },
  {
    id: "PR-TT-MOVE2",
    prompt: "SAMPLE: Tweezer Top, then the next bar makes a new high. Process?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Add to the short — tweezers cannot fail", description: "Dogma." },
      { id: "B", label: "Treat the new high as a LIVE fill you missed", description: "No LIVE desk." },
      { id: "C", label: "The rejection clue failed — stand aside or cut if you already leaned short", description: "Process." },
    ],
    explanation: "A new high after the match cancels the tweezer. SAMPLE process.",
    patternKey: "tweezer-top",
    highlightIndex: 4,
  },
  {
    id: "PR-FW-PICK",
    prompt: "Which chart shows a Falling Wedge?",
    correctAnswer: "A",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "falling-wedge" },
      { id: "B", chartKey: "rising-wedge" },
      { id: "C", chartKey: "triangle" },
      { id: "D", chartKey: "bull-flag" },
      { id: "E", chartKey: "hammer" },
    ]),
    explanation: "Falling Wedge drops inside two downward converging lines — not an upward rising wedge or a flat triangle.",
    patternKey: "falling-wedge",
  },
  {
    id: "PR-FW-DESC",
    prompt: "Which description matches a Falling Wedge?",
    correctAnswer: "A",
    options: FALLING_WEDGE_DESC_OPTIONS,
    explanation: "Downward converging lines. SAMPLE: a break of the upper line still needs later bars.",
    patternKey: "falling-wedge",
  },
  {
    id: "PR-FW-NAME",
    prompt: "Price falls inside two downward, converging lines. Name it.",
    correctAnswer: "A",
    options: FALLING_WEDGE_NAME_OPTIONS,
    explanation: "Falling Wedge — selling is tiring. Not a rising wedge or a flat triangle.",
    patternKey: "falling-wedge",
  },
  {
    id: "PR-FW-MOVE",
    prompt: "SAMPLE: Falling Wedge after a grind down. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Chase every new low until it breaks", description: "Late chase." },
      { id: "B", label: "Buy immediately because falling wedges always rip", description: "Dogma." },
      { id: "C", label: "Treat as tiring selling — wait for an upper-line break, then the next print", description: "Process." },
    ],
    explanation: "The wedge is a structure, not a LIVE buy button. SAMPLE teaching.",
    patternKey: "falling-wedge",
  },
  {
    id: "PR-FW-DESC2",
    prompt: "A Falling Wedge differs from a Triangle because…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "A triangle always points up and a wedge never does", description: DESC_HINT },
      { id: "B", label: "The wedge has a downward tilt; a triangle squeeze has no built-in direction", description: DESC_HINT },
      { id: "C", label: "Wedges are LIVE orders and triangles are SAMPLE only", description: DESC_HINT },
    ],
    explanation: "Tilt vs squeeze. Direction still waits for a break. SAMPLE, not LIVE.",
    patternKey: "falling-wedge",
  },
  {
    id: "PR-FW-MOVE2",
    prompt: "SAMPLE: Falling Wedge, then the lower line breaks and range expands down. Process?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "The tiring-sell idea is wrong — stand aside or rewrite the thesis", description: "Process." },
      { id: "B", label: "Double the long on every lower low", description: "Oversize." },
      { id: "C", label: "There is no wrong level on structure patterns", description: "False." },
    ],
    explanation: "A downside expansion cancels the tiring-sell read. SAMPLE process.",
    patternKey: "falling-wedge",
  },
  {
    id: "PR-HS-PICK",
    prompt: "Which chart shows Head and Shoulders?",
    correctAnswer: "E",
    optionsAreCharts: true,
    options: chartPickOptions([
      { id: "A", chartKey: "double-top" },
      { id: "B", chartKey: "triangle" },
      { id: "C", chartKey: "tweezer-top" },
      { id: "D", chartKey: "falling-wedge" },
      { id: "E", chartKey: "head-shoulders", highlightIndex: 3 },
    ]),
    explanation: "Head and Shoulders is three peaks with the middle highest — not two peaks and not a two-bar tweezer.",
    patternKey: "head-shoulders",
  },
  {
    id: "PR-HS-DESC",
    prompt: "Which description matches Head and Shoulders?",
    correctAnswer: "B",
    options: HEAD_SHOULDERS_DESC_OPTIONS,
    explanation: "Three peaks, head in the middle. SAMPLE: confirm with a neckline break.",
    patternKey: "head-shoulders",
    highlightIndex: 3,
  },
  {
    id: "PR-HS-NAME",
    prompt: "Three peaks; the center peak is highest. Name it.",
    correctAnswer: "B",
    options: HEAD_SHOULDERS_NAME_OPTIONS,
    explanation: "Head and Shoulders — three peaks. Not a two-peak double top.",
    patternKey: "head-shoulders",
    highlightIndex: 3,
  },
  {
    id: "PR-HS-MOVE",
    prompt: "SAMPLE: Head and Shoulders, right shoulder in. Process-first move?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Short the first tick of the right shoulder with no neckline plan", description: "Early fade." },
      { id: "B", label: "Buy the head because three peaks mean a breakout", description: "Chase." },
      { id: "C", label: "Wait for a neckline break before treating it as confirmed", description: "Process." },
    ],
    explanation: "The usual confirmation is the neckline, not the right shoulder itself. SAMPLE.",
    patternKey: "head-shoulders",
    highlightIndex: 3,
  },
  {
    id: "PR-HS-DESC2",
    prompt: "Head and Shoulders is not a Double Top because…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Head and Shoulders has three peaks; Double Top has two similar highs and one dip", description: DESC_HINT },
      { id: "B", label: "Double Top only appears on forex SAMPLE packs", description: DESC_HINT },
      { id: "C", label: "Head and Shoulders is a LIVE order ticket", description: DESC_HINT },
    ],
    explanation: "Three peaks vs two. SAMPLE, not LIVE.",
    patternKey: "head-shoulders",
    highlightIndex: 3,
  },
  {
    id: "PR-HS-MOVE2",
    prompt: "SAMPLE: Head and Shoulders, then the right shoulder makes a new high. Process?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Keep shorting every high because three peaks always win", description: "Dogma." },
      { id: "B", label: "The three-peak idea is wrong — stand aside or rewrite the thesis", description: "Process." },
      { id: "C", label: "Treat the new high as a LIVE fill you missed", description: "No LIVE desk." },
    ],
    explanation: "A new high after the right shoulder cancels the pattern. SAMPLE process.",
    patternKey: "head-shoulders",
    highlightIndex: 5,
  },
];

/** Candlestick anatomy — OHLC parts and red/green (no pattern ID). */
export const CANDLE_ANATOMY_QUESTIONS: QuizQuestion[] = [
  {
    id: "CA-01",
    prompt: "On the marked candle, the tip of the upper wick is which price?",
    correctAnswer: "B",
    options: OHLC_PART_OPTIONS,
    explanation: "High is the highest trade in the period — the top of the upper wick.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
  {
    id: "CA-02",
    prompt: "On the marked candle, the tip of the lower wick is which price?",
    correctAnswer: "C",
    options: OHLC_PART_OPTIONS,
    explanation: "Low is the lowest trade in the period — the bottom of the lower wick.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
  {
    id: "CA-03",
    prompt: "This marked candle is green. The top of the solid body is which price?",
    correctAnswer: "D",
    options: OHLC_PART_OPTIONS,
    explanation: "Green means close > open, so the top of the body is the close.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
  {
    id: "CA-04",
    prompt: "This marked candle is green. The bottom of the solid body is which price?",
    correctAnswer: "A",
    options: OHLC_PART_OPTIONS,
    explanation: "On a green candle the body runs up from open to close — the bottom of the body is the open.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
  {
    id: "CA-05",
    prompt: "This marked candle is red. The top of the solid body is which price?",
    correctAnswer: "A",
    options: OHLC_PART_OPTIONS,
    explanation: "Red means close < open, so the top of the body is the open.",
    patternKey: "candle-red",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
  {
    id: "CA-06",
    prompt: "This marked candle is red. The bottom of the solid body is which price?",
    correctAnswer: "D",
    options: OHLC_PART_OPTIONS,
    explanation: "On a red candle the body runs down from open to close — the bottom of the body is the close.",
    patternKey: "candle-red",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
  {
    id: "CA-07",
    prompt: "Why is the marked candle green?",
    correctAnswer: "A",
    options: CANDLE_COLOR_OPTIONS,
    explanation: "Green (up close) means the period finished above where it started: close > open.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "candle-color",
  },
  {
    id: "CA-08",
    prompt: "Why is the marked candle red?",
    correctAnswer: "B",
    options: CANDLE_COLOR_OPTIONS,
    explanation: "Red (down close) means the period finished below where it started: close < open.",
    patternKey: "candle-red",
    highlightIndex: 2,
    glossaryTermId: "candle-color",
  },
  {
    id: "CA-09",
    prompt: "OHLC stands for…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Open, High, Low, Close", description: "The four prices of one bar." },
      { id: "B", label: "Order, Hedge, Lot, Coupon", description: "Not candle anatomy." },
      { id: "C", label: "Only High, Low, Close", description: "Missing the open." },
    ],
    explanation: "One candlestick is four prices: open, high, low, close. SAMPLE teaching — not a live quote.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
  {
    id: "CA-10",
    prompt: "The thin line above or below the body is called a…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Volume bar", description: "These SAMPLE candles do not plot volume." },
      { id: "B", label: "Wick (shadow)", description: "High/low extremes." },
      { id: "C", label: "Moving average", description: "That is an overlay." },
    ],
    explanation: "Wicks mark the high and low. The body is only open-to-close.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
  {
    id: "CA-11",
    prompt: "Color on these SAMPLE charts encodes…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "How much volume traded", description: "Color is not volume." },
      { id: "B", label: "Whether the company beat earnings", description: "Unrelated." },
      { id: "C", label: "Whether close finished above or below open", description: "Green vs red rule." },
    ],
    explanation: "Green = close > open; red = close < open. Not certainty, not volume.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "candle-color",
  },
  {
    id: "CA-12",
    prompt: "If open and close are almost equal, the body looks…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Tiny — buyers and sellers finished near even", description: "Indecision cue." },
      { id: "B", label: "Impossible — every bar must be wide", description: "Doji-like bars exist." },
      { id: "C", label: "Always green", description: "Color still follows close vs open." },
    ],
    explanation: "A small body means open ≈ close. That is an anatomy fact before you name a pattern.",
    patternKey: "candle-green",
    highlightIndex: 2,
    glossaryTermId: "ohlc-anatomy",
  },
];

export const INDICATOR_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "IN-01",
    prompt: "Which indicator is displayed on the chart? It smooths price and shows trend direction.",
    correctAnswer: "A",
    options: INDICATOR_OPTIONS,
    explanation: "SMA averages closing prices over a period; price above SMA = bullish bias.",
    overlayId: "sma",
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
  {
    id: "IN-02",
    prompt: "Which indicator is shown? It gives more weight to recent prices than older ones.",
    correctAnswer: "B",
    options: INDICATOR_OPTIONS,
    explanation: "EMA reacts faster to new data; popular for swing trading.",
    overlayId: "ema",
    assetClass: "equity",
    samplePackId: "eq-index-proxy",
  },
  {
    id: "IN-03",
    prompt: "Identify the oscillator (0–100) that measures overbought/oversold conditions.",
    correctAnswer: "C",
    options: INDICATOR_OPTIONS,
    explanation: "RSI above 70 = overbought; below 30 = oversold.",
    overlayId: "rsi",
    assetClass: "equity",
    samplePackId: "eq-cyclical",
  },
  {
    id: "IN-04",
    prompt: "Which indicator shows the difference between fast and slow EMAs with a signal line?",
    correctAnswer: "D",
    options: INDICATOR_OPTIONS,
    explanation: "MACD crossovers signal potential trend changes.",
    overlayId: "macd",
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
  {
    id: "IN-05",
    prompt: "Which indicator displays a middle band with upper and lower volatility bands?",
    correctAnswer: "E",
    options: INDICATOR_OPTIONS,
    explanation: "Bollinger Bands: squeeze = low volatility before breakout.",
    overlayId: "bollinger",
    assetClass: "equity",
    samplePackId: "eq-index-proxy",
  },
  {
    id: "IN-06",
    prompt: "Price walking above a rising SMA most often reads as…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "A bullish trend bias — not a guarantee", description: "Process." },
      { id: "B", label: "Proof the next bar must gap up", description: "No guarantee." },
      { id: "C", label: "A LIVE order-routing signal", description: "SAMPLE overlay only." },
    ],
    explanation: "SMA is a smoother. Above a rising SMA is a bias, not a fill.",
    overlayId: "sma",
    assetClass: "equity",
    samplePackId: "eq-gap-go",
  },
  {
    id: "IN-07",
    prompt: "Compared with SMA, EMA is usually…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Slower because it ignores new prices", description: "Opposite." },
      { id: "B", label: "Faster — more weight on recent closes", description: "Definition." },
      { id: "C", label: "An oscillator from 0–100", description: "That is RSI." },
    ],
    explanation: "EMA weights recent prices more, so it turns sooner than SMA. Still SAMPLE teaching.",
    overlayId: "ema",
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
  {
    id: "IN-08",
    prompt: "RSI near 80 after a straight grind is best treated as…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "An automatic short", description: "Overbought ≠ must reverse." },
      { id: "B", label: "Proof volume is fake", description: "Non sequitur." },
      { id: "C", label: "A stretch reading — wait for later bars", description: "Process." },
    ],
    explanation: "RSI labels stretch vs mean. Trends can stay stretched. SAMPLE: do not treat 70/30 as a button.",
    overlayId: "rsi",
    assetClass: "equity",
    samplePackId: "eq-cyclical",
  },
  {
    id: "IN-09",
    prompt: "A MACD line crossing above its signal line is…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "A momentum-shift cue to check with price", description: "Process." },
      { id: "B", label: "A brokerage fill", description: "No routing here." },
      { id: "C", label: "The same as Bollinger squeeze", description: "Different tool." },
    ],
    explanation: "MACD crossovers flag momentum changes. Confirm with the tape — SAMPLE overlays are not orders.",
    overlayId: "macd",
    assetClass: "equity",
    samplePackId: "eq-index-proxy",
  },
  {
    id: "IN-10",
    prompt: "Bollinger Band squeeze (bands pinching) usually means…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Volume just printed a LIVE spike", description: "No LIVE volume feed." },
      { id: "B", label: "Volatility is low — a later expansion is more likely", description: "Squeeze idea." },
      { id: "C", label: "RSI is always above 70", description: "Unrelated." },
    ],
    explanation: "Squeeze = low volatility. Direction of the next expansion is not the squeeze itself.",
    overlayId: "bollinger",
    assetClass: "equity",
    samplePackId: "eq-squeeze",
  },
  {
    id: "IN-11",
    prompt: "In a choppy range, which overlay is usually the better stretch tool?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "SMA as if it were a new trend", description: "Trend tool in a range." },
      { id: "B", label: "Ignore all overlays", description: "You can still use oscillators." },
      { id: "C", label: "RSI (oscillator) vs mean, not a new trend call", description: "Match tool to regime." },
    ],
    explanation: "Trend vs range: moving averages for a grind, RSI-style oscillators for stretch in a range.",
    overlayId: "rsi",
    assetClass: "equity",
    samplePackId: "eq-index-proxy",
    glossaryTermId: "trend-vs-range",
  },
  {
    id: "IN-12",
    prompt: "These indicator lines on Market are…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "SAMPLE / DELAYED teaching overlays — not LIVE theater", description: "Honesty." },
      { id: "B", label: "A broker’s executable signals", description: "No brokerage." },
      { id: "C", label: "Options Greeks", description: "Not a chain product." },
    ],
    explanation: "Provider labels stay SAMPLE or DELAYED. Overlays teach reading, they do not route orders.",
    overlayId: "sma",
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
    glossaryTermId: "delayed-vs-sample-feed",
  },
];

/** Equity-pack-backed candle/indicator drills beyond the E4.M0 indicators gate (E4.M3). */
export const EQUITY_PATTERN_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "EQ-PAT-01",
    prompt:
      "SAMPLE mega-cap tech pack: after a mid-session dip, which candle pattern best matches a long lower wick reclaim near the lows?",
    correctAnswer: "B",
    options: OPTIONS_3,
    explanation:
      "A hammer-like reclaim after a dip is a process cue: sellers pushed, buyers absorbed. Tied to eq-mega-tech SAMPLE pack.",
    patternKey: "hammer",
    highlightIndex: 2,
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
  {
    id: "EQ-PAT-02",
    prompt:
      "SAMPLE index proxy pack: tight range, small bodies. Which indicator family best describes a middle band with volatility envelopes?",
    correctAnswer: "E",
    options: INDICATOR_OPTIONS,
    explanation:
      "Bollinger-style bands suit calm index ranges—watch squeezes before breakouts. Tied to eq-index-proxy SAMPLE pack.",
    overlayId: "bollinger",
    assetClass: "equity",
    samplePackId: "eq-index-proxy",
  },
  {
    id: "EQ-PAT-03",
    prompt:
      "SAMPLE cyclical energy pack: sharp selloff then bounce. Which oscillator (0–100) flags oversold extremes after a washout?",
    correctAnswer: "C",
    options: INDICATOR_OPTIONS,
    explanation:
      "RSI-style oscillators help label oversold after a cyclical dump—not a buy signal alone. Tied to eq-cyclical SAMPLE pack.",
    overlayId: "rsi",
    assetClass: "equity",
    samplePackId: "eq-cyclical",
  },
  {
    id: "EQ-PAT-04",
    prompt:
      "On the SAMPLE mega-cap grind, which smoother shows trend direction by averaging closes equally across the window?",
    correctAnswer: "A",
    options: INDICATOR_OPTIONS,
    explanation:
      "SMA is the equal-weight smoother. Equity pack context: trend bias vs noise on eq-mega-tech.",
    overlayId: "sma",
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
  {
    id: "EQ-PAT-05",
    prompt:
      "SAMPLE gap-and-go pack: the tape jumps then holds. Which smoother best tracks that new higher path without extra weight on old closes?",
    correctAnswer: "A",
    options: INDICATOR_OPTIONS,
    explanation:
      "Equal-weight SMA is a simple way to stay oriented after a gap holds. Tied to eq-gap-go SAMPLE pack — not a LIVE fill.",
    overlayId: "sma",
    assetClass: "equity",
    samplePackId: "eq-gap-go",
  },
  {
    id: "EQ-PAT-06",
    prompt:
      "SAMPLE squeeze pack: range collapses then a small break. Which overlay family is built for pinch-then-expand?",
    correctAnswer: "E",
    options: INDICATOR_OPTIONS,
    explanation:
      "Bollinger-style bands shrink in a squeeze. Tied to eq-squeeze SAMPLE pack.",
    overlayId: "bollinger",
    assetClass: "equity",
    samplePackId: "eq-squeeze",
  },
  {
    id: "EQ-PAT-07",
    prompt:
      "SAMPLE gap-and-go pack: after the gap, which overlay reacts faster if you want recent closes to matter more?",
    correctAnswer: "B",
    options: INDICATOR_OPTIONS,
    explanation: "EMA weights new prices more than SMA. Tied to eq-gap-go.",
    overlayId: "ema",
    assetClass: "equity",
    samplePackId: "eq-gap-go",
  },
  {
    id: "EQ-PAT-08",
    prompt:
      "SAMPLE squeeze pack: if the break is noisy, which 0–100 oscillator labels stretch vs the recent mean?",
    correctAnswer: "C",
    options: INDICATOR_OPTIONS,
    explanation: "RSI is the stretch oscillator on these SAMPLE overlays. Tied to eq-squeeze.",
    overlayId: "rsi",
    assetClass: "equity",
    samplePackId: "eq-squeeze",
  },
];

export const POINTS_PER_CORRECT = 50;
export const STREAK_BONUS = 10;

/** Equities literacy + risk/horizon (E4.M1) — text quizzes, SAMPLE teaching copy. */
export const EQUITY_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "EL-01",
    prompt: "What is a share of stock?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "A loan to a company", description: "That describes a bond, not equity." },
      { id: "B", label: "Ownership slice of a company", description: "Equity stake in the business." },
      { id: "C", label: "A government IOU", description: "Treasury instruments are debt, not stock." },
    ],
    explanation:
      "A share is a unit of ownership in a company. You own a claim on residual value and (often) voting rights—not a loan.",
    glossaryTermId: "stock-share",
  },
  {
    id: "EL-02",
    prompt: "Where do most U.S. listed stocks trade?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Exchanges / regulated markets", description: "e.g. NYSE, Nasdaq (SAMPLE context)." },
      { id: "B", label: "Only private chat rooms", description: "Public listings use formal markets." },
      { id: "C", label: "Company break rooms", description: "Not a market venue." },
    ],
    explanation:
      "Listed equities trade on exchanges (and related venues) with public quotes. SAMPLE teaching—not a brokerage recommendation.",
    glossaryTermId: "exchange",
  },
  {
    id: "EL-03",
    prompt: "Going long a stock means you expect the price to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Rise (or stay valuable long-term)", description: "You benefit if value increases." },
      { id: "B", label: "Fall immediately", description: "That is the short thesis." },
      { id: "C", label: "Become a bond", description: "Asset class does not change." },
    ],
    explanation:
      "A long position profits if the stock’s value rises (or you collect ownership benefits over time). Shorting bets on a decline.",
    glossaryTermId: "long-vs-short",
  },
  {
    id: "EL-04",
    prompt: "Going short a stock (when available) generally bets that price will…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Rise sharply", description: "That favors longs." },
      { id: "B", label: "Fall", description: "Shorts profit from declines (with extra risk)." },
      { id: "C", label: "Stay exactly flat forever", description: "Flat markets are not the short thesis." },
    ],
    explanation:
      "Shorting borrows shares to sell now and buy back later cheaper if price falls. Losses can exceed the initial stake—treat as advanced.",
    glossaryTermId: "long-vs-short",
  },
  {
    id: "EL-05",
    prompt: "Owning shares means you own…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "The CEO’s personal house", description: "Personal assets ≠ company equity." },
      { id: "B", label: "A guaranteed paycheck from the Fed", description: "No government wage for shareholders." },
      { id: "C", label: "A stake in the company itself", description: "Equity ownership in the business entity." },
    ],
    explanation:
      "Shares = ownership in the company (claims on residual earnings/assets after debts), not random personal property of executives.",
    glossaryTermId: "stock-share",
  },
  {
    id: "EL-06",
    prompt: "An exchange’s main job for equities is to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Match buyers and sellers with public prices", description: "Price discovery + liquidity." },
      { id: "B", label: "Guarantee every trade is profitable", description: "Markets do not remove risk." },
      { id: "C", label: "Print money for traders", description: "Not an exchange function." },
    ],
    explanation:
      "Exchanges (and market systems) help discover prices and match orders. They do not guarantee profits.",
    glossaryTermId: "exchange",
  },
  {
    id: "EL-07",
    prompt: "“Hold” as a decision often fits best when…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "You need adrenaline this minute", description: "Trading for thrills is not a plan." },
      { id: "B", label: "Your thesis and horizon still look intact", description: "No edge to chase noise." },
      { id: "C", label: "You forgot what you bought", description: "Amnesia is not a strategy." },
    ],
    explanation:
      "Hold is often correct when nothing material changed vs your plan and time horizon—avoid trading just to feel active.",
    glossaryTermId: "investing-vs-trading",
  },
  {
    id: "EL-08",
    prompt: "Investing vs trading — which statement is more accurate?",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Investing usually uses longer horizons; trading shorter ones",
        description: "Horizon and process differ.",
      },
      { id: "B", label: "They are identical words", description: "Different time and process norms." },
      { id: "C", label: "Trading always has zero risk", description: "False—trading can be riskier." },
    ],
    explanation:
      "Investing typically emphasizes multi-month/year ownership theses; trading emphasizes shorter moves. Match tools to horizon.",
    glossaryTermId: "investing-vs-trading",
  },
  {
    id: "EL-09",
    prompt: "Higher expected return usually comes with…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Zero risk by definition", description: "No free lunch." },
      { id: "B", label: "A government guarantee", description: "Listed equities are not risk-free." },
      { id: "C", label: "Higher risk / uncertainty", description: "Risk–return tradeoff." },
    ],
    explanation:
      "Risk and expected return travel together. Equities can lose value; SAMPLE lessons never erase that.",
    glossaryTermId: "risk-horizon",
  },
  {
    id: "EL-10",
    prompt: "If your goal is multi-year compounding, a useful first filter is…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Does this fit my risk and time horizon?", description: "Process before ticker chase." },
      { id: "B", label: "Can I double money before lunch?", description: "Lottery thinking." },
      { id: "C", label: "Is the chart neon green right now?", description: "Color alone is not a thesis." },
    ],
    explanation:
      "Start with horizon and risk capacity, then instruments. Short-horizon thrills often fight a long-horizon plan.",
    glossaryTermId: "risk-horizon",
  },
  {
    id: "EL-11",
    prompt: "In this app, Equities means…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Traditional retail stocks / listed shares", description: "The primary path." },
      { id: "B", label: "A LIVE options chain", description: "Options context is educational only." },
      { id: "C", label: "A forex dealing desk", description: "Forex is a SAMPLE class after stocks." },
    ],
    explanation:
      "Traditional retail stocks are labeled Equities here. Futures, crypto, forex, and options-context are SAMPLE expansion classes.",
    glossaryTermId: "equities-traditional-retail",
  },
  {
    id: "EL-12",
    prompt: "The bid is the price buyers will pay; the ask is the price sellers will take. The gap between them is…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "A guaranteed profit", description: "Spreads are a cost, not a gift." },
      { id: "B", label: "The company’s net margin", description: "Wrong statement." },
      { id: "C", label: "The spread — a cost of transacting", description: "Process." },
    ],
    explanation:
      "SAMPLE charts show OHLC, not a live book. Bid/ask literacy still matters: the spread is a friction, not a signal to chase.",
    glossaryTermId: "bid-ask",
  },
];

/** Financial statement literacy (E4.M2) — uses SAMPLE snapshot cards. */
export const FINANCIAL_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "FL-01",
    prompt: "On the SAMPLE snapshot, which line best captures total sales before expenses?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Revenue", description: "Top-line sales." },
      { id: "B", label: "Net income", description: "Bottom line after expenses." },
      { id: "C", label: "Liabilities", description: "Balance sheet claim, not sales." },
    ],
    explanation: "Revenue is the top line—sales before costs. Net income is what remains after expenses.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-02",
    prompt: "Net income is best described as…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Cash sitting in the bank", description: "Cash is a balance/cash-flow idea." },
      { id: "B", label: "Profit after expenses (accounting)", description: "Bottom-line earnings." },
      { id: "C", label: "Total assets", description: "Balance sheet stock of resources." },
    ],
    explanation:
      "Net income is accounting profit after expenses. It is not the same as cash in the bank.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-03",
    prompt: "Cash from operations vs net income — which is true?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "They are always identical", description: "Timing and accruals differ." },
      { id: "B", label: "Cash flow never matters", description: "Cash keeps the business alive." },
      { id: "C", label: "They can diverge; cash ≠ profit", description: "Accruals vs cash timing." },
    ],
    explanation:
      "Profit can include non-cash items and timing differences. Operating cash flow tracks cash generated by the business.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-04",
    prompt: "Assets on the balance sheet roughly mean…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Resources the company controls", description: "What it owns/controls." },
      { id: "B", label: "Only tomorrow’s revenue", description: "Revenue is income statement." },
      { id: "C", label: "Money owed to lenders only", description: "That is liabilities." },
    ],
    explanation: "Assets are resources controlled by the company (cash, inventory, PP&E, etc.).",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FL-05",
    prompt: "Liabilities are…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Owner’s residual claim", description: "That is equity." },
      { id: "B", label: "Obligations / claims by others", description: "Debt, payables, etc." },
      { id: "C", label: "Marketing slogans", description: "Not a financial statement line." },
    ],
    explanation: "Liabilities are obligations—what the company owes. Equity is the residual claim after liabilities.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FL-06",
    prompt: "Simple P/E on the SAMPLE card is closest to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Price ÷ earnings", description: "How many $ of price per $ of earnings." },
      { id: "B", label: "Revenue ÷ assets", description: "Different ratio." },
      { id: "C", label: "Cash ÷ liabilities", description: "Liquidity-style idea, not P/E." },
    ],
    explanation:
      "P/E = price per share ÷ earnings per share (here shown as price / earnings on the SAMPLE card).",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-07",
    prompt: "Net margin on the snapshot is…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Assets ÷ liabilities", description: "Leverage-style ratio." },
      { id: "B", label: "Price ÷ revenue", description: "Not net margin." },
      { id: "C", label: "Net income ÷ revenue", description: "Profitability percent." },
    ],
    explanation: "Net margin = net income / revenue. Higher means more of each sales dollar kept as profit.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-08",
    prompt: "Free cash flow is useful because it approximates…",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Cash left after operating needs / reinvestment",
        description: "Cash available after sustaining the business.",
      },
      { id: "B", label: "Marketing budget only", description: "Too narrow." },
      { id: "C", label: "Share count", description: "Equity structure, not cash flow." },
    ],
    explanation:
      "Free cash flow approximates cash generated after operating cash needs and sustaining investment—useful for flexibility (SAMPLE teaching).",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FL-09",
    prompt: "If net income is positive but operating cash flow is weak, a careful reader…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Ignores cash forever", description: "Cash stress can sink a firm." },
      { id: "B", label: "Asks why cash and profit diverge", description: "Process check." },
      { id: "C", label: "Assumes fraud automatically", description: "Investigate, don’t jump." },
    ],
    explanation:
      "Divergence invites questions (working capital, accruals, one-offs)—not an automatic conclusion. Read both statements.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FL-10",
    prompt: "Net margin is best read as…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "How much of each dollar of sales is kept as profit", description: "Net income / revenue." },
      { id: "B", label: "How many shares are outstanding", description: "Equity structure." },
      { id: "C", label: "The bid–ask spread", description: "Market microstructure." },
    ],
    explanation: "Net margin = net income ÷ revenue. SAMPLE cards print netMarginPct so you can compare mix and costs.",
    snapshotId: "snap-mega-tech",
    glossaryTermId: "net-margin",
  },
  {
    id: "FL-11",
    prompt: "A simple P/E on a SAMPLE card is…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "A buy rating", description: "Multiples are not grades." },
      { id: "B", label: "Price divided by earnings — a starting question", description: "Humility." },
      { id: "C", label: "Operating cash flow", description: "Wrong line." },
    ],
    explanation: "P/E is a multiple, not a verdict. SAMPLE teaching: ask what earnings quality sits under the number.",
    snapshotId: "snap-mega-tech",
    glossaryTermId: "pe-ratio",
  },
  {
    id: "FL-12",
    prompt: "Free cash flow on these SAMPLE cards is closest to…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Revenue before any costs", description: "That is the top line." },
      { id: "B", label: "Share price × share count", description: "Market value, not cash." },
      { id: "C", label: "Cash from operations minus sustaining reinvestment", description: "FCF idea." },
    ],
    explanation: "Profit can diverge from cash. SAMPLE snapshots list operating cash and free cash flow so you can notice that gap.",
    snapshotId: "snap-cyclical",
    glossaryTermId: "free-cash-flow",
  },
];

export const NEWS_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "NL-01",
    prompt: "A viral social post claims a buyout with no company filing. Best first move?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Buy immediately", description: "Chase unverified noise." },
      { id: "B", label: "Treat as rumor until confirmed", description: "Source humility." },
      { id: "C", label: "Ignore all future news forever", description: "Overreaction." },
    ],
    explanation:
      "SAMPLE: rumor ≠ filing. Raise confidence only when a disclosure or reputable primary source confirms.",
    glossaryTermId: "rumor-vs-filing",
  },
  {
    id: "NL-02",
    prompt: "Everyone expected a rate hold and the headline matches. The first spike often…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Fades if it was already priced in", description: "Expectations matter." },
      { id: "B", label: "Guarantees a trend day", description: "Nothing is guaranteed." },
      { id: "C", label: "Means filings are fake", description: "Non sequitur." },
    ],
    explanation: "If widely expected, much of the move may already be in the tape (priced in).",
    glossaryTermId: "priced-in",
  },
  {
    id: "NL-03",
    prompt: "Chase vs fade — which statement is most accurate?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Always chase breakouts", description: "Blind rule." },
      { id: "B", label: "Always fade every spike", description: "Blind rule." },
      {
        id: "C",
        label: "Choose using evidence quality + horizon",
        description: "Process match.",
      },
    ],
    explanation: "Neither chase nor fade is always right — match to evidence and your time horizon.",
    glossaryTermId: "chase-vs-fade",
  },
  {
    id: "NL-04",
    prompt: "Source humility means…",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Weight claims by how primary/verifiable the source is",
        description: "Process.",
      },
      { id: "B", label: "Trust the loudest account", description: "Noise bias." },
      { id: "C", label: "Never read headlines", description: "Avoidance, not skill." },
    ],
    explanation: "Primary filings and official releases outrank anonymous chatter for decision confidence.",
    glossaryTermId: "rumor-vs-filing",
  },
  {
    id: "NL-05",
    prompt: "A stock gaps up on a rumor then asks for a decision. Process-first choice?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Market buy, no plan", description: "FOMO." },
      {
        id: "B",
        label: "Ask what is new vs already priced; size for being wrong",
        description: "Process.",
      },
      { id: "C", label: "Short 10x because gaps always fail", description: "Dogma." },
    ],
    explanation: "Separate novelty from priced-in expectations; size risk to uncertainty.",
    glossaryTermId: "priced-in",
  },
  {
    id: "NL-06",
    prompt: "Company-news cases in this app hide the aftermath until you decide. Why?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Anti-hindsight: practice deciding with only the brief", description: "Skill." },
      { id: "B", label: "To simulate LIVE brokerage fills", description: "Out of scope." },
      { id: "C", label: "Because SAMPLE data is random noise", description: "Still structured teaching." },
    ],
    explanation: "Anti-hindsight forces process under incomplete information — SAMPLE teaching design.",
    glossaryTermId: "chase-vs-fade",
  },
  {
    id: "NL-07",
    prompt: "Rumor vs filing — which pair is ranked correctly for confidence?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Company filing / official release beats an anonymous post", description: "Source hierarchy." },
      { id: "B", label: "The loudest reply is the filing", description: "Noise." },
      { id: "C", label: "All headlines are equally true", description: "No ranking." },
    ],
    explanation: "Raise confidence when a disclosure confirms. SAMPLE: rumor ≠ filing.",
    glossaryTermId: "rumor-vs-filing",
  },
  {
    id: "NL-08",
    prompt: "“Priced in” means…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "The stock cannot move again", description: "False." },
      { id: "B", label: "The tape may already reflect widely expected news", description: "Definition." },
      { id: "C", label: "A LIVE feed printed the fill", description: "No LIVE theater." },
    ],
    explanation: "If everyone expected the print, the first spike can fade. Ask what is new.",
    glossaryTermId: "priced-in",
  },
  {
    id: "NL-09",
    prompt: "Chasing a headline gap is most dangerous when…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "You already finished Indicators", description: "Unrelated." },
      { id: "B", label: "The company is in Equities class", description: "Class is not the issue." },
      { id: "C", label: "The story is unverified and already in the open", description: "Late + low quality." },
    ],
    explanation: "Chase vs fade is a process choice: evidence quality, whether it is priced, and your horizon.",
    glossaryTermId: "chase-vs-fade",
  },
  {
    id: "NL-10",
    prompt: "A SAMPLE news case asks BUY / SELL / HOLD before the aftermath. HOLD is…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "A valid taught answer when uncertainty is high", description: "Process." },
      { id: "B", label: "Always wrong because you must trade", description: "This is not a casino." },
      { id: "C", label: "The same as a LIVE short", description: "No routing; short is gated." },
    ],
    explanation: "Waiting is a decision. SAMPLE cases grade process, not “you must click buy.”",
    glossaryTermId: "chase-vs-fade",
  },
  {
    id: "NL-11",
    prompt: "Correlation in a risk-off tape (plain language) means…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "This stock cannot be the story", description: "Too strong." },
      { id: "B", label: "Many names may fall together — ask if this one is special", description: "Macro vs single-name." },
      { id: "C", label: "A LIVE correlation matrix is running", description: "Not in this app." },
    ],
    explanation: "SAMPLE macro cases: is this name the story or along for the ride?",
    glossaryTermId: "correlation",
  },
  {
    id: "NL-12",
    prompt: "Guidance cut in a headline is closest to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "The outlook reset — reread the thesis", description: "Process." },
      { id: "B", label: "Proof last quarter’s revenue was fake", description: "Jump." },
      { id: "C", label: "A reason to ignore statements", description: "Opposite." },
    ],
    explanation: "Outlook can matter more than a beat on the last print. SAMPLE earnings + news literacy overlap here.",
    glossaryTermId: "guidance",
  },
];

export const FINANCIAL_DRILLS_QUESTIONS: QuizQuestion[] = [
  {
    id: "FD-01",
    prompt: "On the SAMPLE card, strong net income with weak operating cash most invites…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Ignore cash forever", description: "Dangerous." },
      { id: "B", label: "Questions about accruals / working capital", description: "Process." },
      { id: "C", label: "Automatic buy", description: "No process." },
    ],
    explanation: "Cash vs profit divergence is a cue to investigate, not a slogan trade.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FD-02",
    prompt: "Net margin falling while revenue rises can mean…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Costs or mix are eating profitability", description: "Margin compression cue." },
      { id: "B", label: "Assets disappeared", description: "Wrong statement." },
      { id: "C", label: "P/E is cash", description: "Category error." },
    ],
    explanation: "Margin = profit / revenue. Rising sales with falling margin = watch costs/mix.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FD-03",
    prompt: "High liabilities vs equity on a SAMPLE cyclical card is a cue about…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Guaranteed bankruptcy tomorrow", description: "Jumping." },
      { id: "B", label: "Marketing spend only", description: "Too narrow." },
      { id: "C", label: "Leverage / cushion under stress", description: "Balance-sheet process." },
    ],
    explanation: "Leverage amplifies outcomes. Ask if the cushion fits your horizon.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FD-04",
    prompt: "Free cash flow on the card approximates cash after…",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Operating needs and sustaining reinvestment",
        description: "Flexibility cue.",
      },
      { id: "B", label: "Only interest expense", description: "Incomplete." },
      { id: "C", label: "Share count changes", description: "Equity structure." },
    ],
    explanation: "FCF is a flexibility/sustainability cue in SAMPLE teaching — not a price target.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FD-05",
    prompt: "Simple P/E rising solely because earnings fell (price flat) means…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "The company printed cash", description: "Unrelated." },
      { id: "B", label: "You are paying more per unit of earnings", description: "Multiple math." },
      { id: "C", label: "Liabilities vanished", description: "Wrong statement." },
    ],
    explanation: "P/E = price / earnings. Lower earnings → higher P/E if price unchanged.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FD-06",
    prompt: "Before an earnings case, reading the snapshot helps you…",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Form a thesis from numbers, then decide on the print",
        description: "Process.",
      },
      { id: "B", label: "Skip Indicators forever", description: "Indicators still come first." },
      { id: "C", label: "Pull LIVE filings automatically", description: "SAMPLE only." },
    ],
    explanation: "Statements literacy feeds decide-and-reveal — still SAMPLE snapshots, not LIVE EDGAR.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FD-07",
    prompt: "On the SAMPLE mega-tech card, a fat net margin with weaker free cash flow first asks…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Where the cash went (working capital, capex, timing)", description: "Investigate." },
      { id: "B", label: "To ignore the cash lines", description: "Skip the drill." },
      { id: "C", label: "To treat P/E as cash", description: "Category error." },
    ],
    explanation: "Margin is not cash. SAMPLE drills: read income and cash together.",
    snapshotId: "snap-mega-tech",
    glossaryTermId: "free-cash-flow",
  },
  {
    id: "FD-08",
    prompt: "Liabilities large vs equity on the SAMPLE cyclical card is a cue to…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Assume bankruptcy today", description: "Jump." },
      { id: "B", label: "Ask how a miss could get worse for owners", description: "Balance-sheet stress." },
      { id: "C", label: "Ignore the balance sheet after a beat", description: "Skip process." },
    ],
    explanation: "Shareholders are last in line. SAMPLE: debt and cash bound how bad a miss can get.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FD-09",
    prompt: "Revenue up, net margin down on a SAMPLE card most often points at…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "A LIVE filing error", description: "These are SAMPLE numbers." },
      { id: "B", label: "The bid–ask spread", description: "Wrong domain." },
      { id: "C", label: "Mix, costs, or pricing — profitability per sale slipped", description: "Margin compression." },
    ],
    explanation: "Top-line growth can hide a weaker profit story. That is the margin drill.",
    snapshotId: "snap-cyclical",
    glossaryTermId: "net-margin",
  },
  {
    id: "FD-10",
    prompt: "Using SAMPLE price and earnings, a higher P/E with unchanged price usually means…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Earnings in the denominator fell", description: "Multiple math." },
      { id: "B", label: "The exchange closed", description: "Unrelated." },
      { id: "C", label: "Free cash flow became revenue", description: "Wrong lines." },
    ],
    explanation: "P/E = price / earnings. SAMPLE cards exist so you can do that arithmetic with humility.",
    snapshotId: "snap-mega-tech",
    glossaryTermId: "pe-ratio",
  },
  {
    id: "FD-11",
    prompt: "Operating cash flow versus net income is useful because…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "They are always identical", description: "They often diverge." },
      { id: "B", label: "Cash can confirm or challenge paper profit", description: "Process." },
      { id: "C", label: "It replaces the need for a chart gate", description: "Indicators still come first." },
    ],
    explanation: "Accruals and working capital can wedge profit vs cash. SAMPLE snapshots put both on the card.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FD-12",
    prompt: "These statement cards are…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "SAMPLE / stylized teaching numbers — not live filings", description: "Honesty." },
      { id: "B", label: "A LIVE EDGAR pull", description: "Out of scope." },
      { id: "C", label: "Options chain quotes", description: "Wrong product." },
    ],
    explanation: "Financial drills stay SAMPLE. Do not treat the card as a live 10-Q.",
    snapshotId: "snap-cyclical",
    glossaryTermId: "delayed-vs-sample-feed",
  },
];

export const FUTURES_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "FU-01",
    prompt: "A futures contract is closest to…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "A share of a company", description: "That is equities." },
      { id: "B", label: "An agreement to buy or sell an underlying later at a set price", description: "Definition." },
      { id: "C", label: "A LIVE options chain", description: "Wrong product." },
    ],
    explanation: "Futures point at an underlying (index, commodity, rates). SAMPLE tapes here are not live contracts.",
    glossaryTermId: "futures-market",
    assetClass: "future",
  },
  {
    id: "FU-02",
    prompt: "In this trainer, Futures class is…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "SAMPLE educational charts — not a live desk", description: "Honesty." },
      { id: "B", label: "The Beginner Equities Path", description: "Stocks stay Equities." },
      { id: "C", label: "Order routing to an exchange", description: "No brokerage." },
    ],
    explanation: "Traditional retail stocks remain Equities. Futures are SAMPLE browse/decide after that fluency.",
    glossaryTermId: "futures-market",
    assetClass: "future",
  },
  {
    id: "FU-03",
    prompt: "Index-style vs energy-style SAMPLE futures tapes are useful because…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "They prove LIVE fills", description: "They do not." },
      { id: "B", label: "All futures look identical", description: "Shapes differ on purpose." },
      { id: "C", label: "Different underlyings have different tape shapes", description: "Process." },
    ],
    explanation: "Grind vs dump-reclaim vs range is the lesson — not a live roll calendar.",
    assetClass: "future",
  },
  {
    id: "FU-04",
    prompt: "Roll literacy (plain language) means…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Contracts expire — the teaching tape is not a perpetual stock", description: "Process." },
      { id: "B", label: "You must buy the stock instead", description: "Different market." },
      { id: "C", label: "Greeks replace the chart", description: "No Greeks engine." },
    ],
    explanation: "SAMPLE futures charts still teach candles. Real desks also manage expiry. This app does not roll live contracts.",
    glossaryTermId: "futures-market",
    assetClass: "future",
  },
  {
    id: "FU-05",
    prompt: "Decide-and-reveal futures cases use…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "LIVE pit prices", description: "Out of scope." },
      { id: "B", label: "SAMPLE briefs + pre/post OHLC", description: "Same CasePlayer loop." },
      { id: "C", label: "A forex dealing desk", description: "Wrong class." },
    ],
    explanation: "Same BUY/SELL/HOLD loop as equities cases. Mock data only.",
    assetClass: "future",
  },
  {
    id: "FU-06",
    prompt: "If you still need stock-market vocabulary, you should…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Stay on Equities literacy / Beginner path first", description: "Curriculum." },
      { id: "B", label: "Skip to LIVE futures", description: "No LIVE." },
      { id: "C", label: "Treat crypto as stocks", description: "Wrong class." },
    ],
    explanation: "Equities first. Futures SAMPLE is an expansion class.",
    glossaryTermId: "equities-traditional-retail",
    assetClass: "future",
  },
];

export const FOREX_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "FX-01",
    prompt: "Spot FX is closest to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "The price of one currency in another", description: "Pair quote." },
      { id: "B", label: "A share of a central bank", description: "Not equities." },
      { id: "C", label: "A LIVE options chain", description: "Wrong product." },
    ],
    explanation: "EUR/USD is a pair. SAMPLE quotes here are stylized — not a live FX desk.",
    glossaryTermId: "forex-spot",
    assetClass: "forex",
  },
  {
    id: "FX-02",
    prompt: "In this app, Forex class is…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "The traditional retail stocks path", description: "That is Equities." },
      { id: "B", label: "SAMPLE pair tapes for chart literacy", description: "Honesty." },
      { id: "C", label: "A dealing desk with leverage tickets", description: "No brokerage." },
    ],
    explanation: "Traditional retail stocks = Equities. FX is SAMPLE expansion.",
    glossaryTermId: "forex-spot",
    assetClass: "forex",
  },
  {
    id: "FX-03",
    prompt: "Risk-on vs risk-off in SAMPLE FX often shows up as…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "A company’s net margin", description: "Statements, not FX." },
      { id: "B", label: "A LIVE fill at the pit", description: "No LIVE." },
      { id: "C", label: "Pairs moving together with mood — still ask what is new", description: "Process." },
    ],
    explanation: "Mood can move many pairs. SAMPLE: still separate rumor from data prints.",
    glossaryTermId: "correlation",
    assetClass: "forex",
  },
  {
    id: "FX-04",
    prompt: "A data-print spike that immediately fades on a SAMPLE FX tape is a cue to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Ask if the print was priced in before chasing", description: "Process." },
      { id: "B", label: "Assume the pair cannot move again", description: "False." },
      { id: "C", label: "Switch to LIVE quotes", description: "Stay SAMPLE." },
    ],
    explanation: "Same priced-in lesson as equities news. SAMPLE FX is still anti-hindsight practice.",
    glossaryTermId: "priced-in",
    assetClass: "forex",
  },
  {
    id: "FX-05",
    prompt: "Majors vs crosses in these SAMPLE packs exist so you can see…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Identical scaled clones", description: "Forbidden." },
      { id: "B", label: "Different shapes (drift, dump, range, spike-fade)", description: "Why multiple packs." },
      { id: "C", label: "Greeks", description: "No chain." },
    ],
    explanation: "EURUSD drift ≠ USDJPY dump ≠ GBP range. Distinct teaching tapes.",
    assetClass: "forex",
  },
  {
    id: "FX-06",
    prompt: "HOLD on a SAMPLE FX case is…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Valid when the print is noisy and your horizon is unclear", description: "Process." },
      { id: "B", label: "Cheating because FX must always trade", description: "This is education." },
      { id: "C", label: "A LIVE short on the dollar", description: "No routing." },
    ],
    explanation: "Waiting is a decision on FX SAMPLE cases too.",
    assetClass: "forex",
  },
];

export const CRYPTO_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "CR-01",
    prompt: "Crypto class in this trainer is…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "A replacement for Beginner Equities Path", description: "It is not." },
      { id: "B", label: "SAMPLE browse/drill charts — not the stocks path", description: "Honesty." },
      { id: "C", label: "LIVE on-chain execution", description: "No LIVE theater." },
    ],
    explanation: "Crypto does not replace Equities. SAMPLE/DELAYED labels only.",
    glossaryTermId: "crypto-browse",
    assetClass: "crypto",
  },
  {
    id: "CR-02",
    prompt: "Chase vs fade still applies on SAMPLE crypto because…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Spikes can be noise — evidence and horizon still matter", description: "Process." },
      { id: "B", label: "Crypto never retraces", description: "False." },
      { id: "C", label: "There is a LIVE order book here", description: "There is not." },
    ],
    explanation: "Same headline skill, different tape. SAMPLE only.",
    glossaryTermId: "chase-vs-fade",
    assetClass: "crypto",
  },
  {
    id: "CR-03",
    prompt: "A dump-with-no-reclaim SAMPLE tape is teaching…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "That every dump must bounce", description: "Opposite." },
      { id: "B", label: "A LIVE liquidation feed", description: "Stylized OHLC." },
      { id: "C", label: "Not every washout is a buy-the-dip", description: "Process." },
    ],
    explanation: "Distinct from ETH-style dump-then-reclaim. Shape is the lesson.",
    assetClass: "crypto",
  },
  {
    id: "CR-04",
    prompt: "A stable-range SAMPLE pack is useful because…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Tiny ranges are a different tape than BTC grind", description: "Contrast." },
      { id: "B", label: "It is a live peg guarantee", description: "Educational only." },
      { id: "C", label: "It replaces SMA", description: "Unrelated." },
    ],
    explanation: "Not every crypto chart is a moon tape. SAMPLE contrast.",
    assetClass: "crypto",
  },
  {
    id: "CR-05",
    prompt: "Chop-then-break on an alt SAMPLE pack is a cue to…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Assume LIVE volume confirmed it", description: "No LIVE volume." },
      { id: "B", label: "Wait for the expansion, then decide with a level", description: "Process." },
      { id: "C", label: "Treat it as Equities earnings", description: "Wrong class." },
    ],
    explanation: "Range then break is a regime change. SAMPLE process, not a casino button.",
    glossaryTermId: "trend-vs-range",
    assetClass: "crypto",
  },
  {
    id: "CR-06",
    prompt: "If you cannot yet read equities candles, crypto class should be…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Secondary — finish Equities literacy and Indicators first", description: "Curriculum." },
      { id: "B", label: "Your only path", description: "Wrong spine." },
      { id: "C", label: "A LIVE replacement for stocks", description: "No." },
    ],
    explanation: "Equities first. Crypto SAMPLE is browse/drill after candle fluency.",
    glossaryTermId: "equities-traditional-retail",
    assetClass: "crypto",
  },
];

export const OPTIONS_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "OP-01",
    prompt: "Options context in this app means…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "SAMPLE charts of an underlying around events or vol — not a chain", description: "Definition." },
      { id: "B", label: "LIVE strikes, bids, and Greeks", description: "Out of scope." },
      { id: "C", label: "The Beginner Equities Path", description: "Stocks stay Equities." },
    ],
    explanation: "No chain, no Greeks engine, no order routing. Underlying tape only.",
    glossaryTermId: "options-context",
    assetClass: "option_context",
  },
  {
    id: "OP-02",
    prompt: "Why show an underlying into an event window?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "To price a LIVE call", description: "Not a pricing product." },
      { id: "B", label: "Event risk often shows up as coil or expansion on the stock tape", description: "Context." },
      { id: "C", label: "Because options are equities", description: "Different product." },
    ],
    explanation: "Context education: the stock can squeeze or jump around events. SAMPLE.",
    glossaryTermId: "options-context",
    assetClass: "option_context",
  },
  {
    id: "OP-03",
    prompt: "A vol-spike SAMPLE underlying tape is teaching…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Implied vol as a tradable chain", description: "No chain." },
      { id: "B", label: "That range is always tiny", description: "Opposite." },
      { id: "C", label: "Wide range then settle can follow a shock", description: "Shape." },
    ],
    explanation: "You are reading the underlying, not quoting options. SAMPLE.",
    assetClass: "option_context",
  },
  {
    id: "OP-04",
    prompt: "Failed breakout on an options-context pack is a cue to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Ask whether the event move already failed — HOLD can be correct", description: "Process." },
      { id: "B", label: "Buy every call automatically", description: "No chain; no auto." },
      { id: "C", label: "Assume LIVE gamma is hedging", description: "No Greeks engine." },
    ],
    explanation: "Poke then fail is a tape story. Decide-and-reveal still uses BUY/SELL/HOLD on SAMPLE.",
    assetClass: "option_context",
  },
  {
    id: "OP-05",
    prompt: "Pre-event coil (shrinking range) on SAMPLE context charts often means…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Volatility cannot expand later", description: "Coil can precede expansion." },
      { id: "B", label: "The market is waiting — expansion may follow the event", description: "Context." },
      { id: "C", label: "You have a LIVE straddle quote", description: "No quotes." },
    ],
    explanation: "Coil is a wait cue. Direction is not the coil itself.",
    assetClass: "option_context",
  },
  {
    id: "OP-06",
    prompt: "Greeks and a live options chain in this trainer are…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Out of scope — educational underlying only", description: "Constraint." },
      { id: "B", label: "Enabled on Market", description: "They are not." },
      { id: "C", label: "Required before Equities literacy", description: "Opposite curriculum." },
    ],
    explanation: "Options context ≠ options product. Equities path stays stocks-first.",
    glossaryTermId: "options-context",
    assetClass: "option_context",
  },
];

export type QuizGroupId =
  | "all"
  | "candle-anatomy"
  | "hammer"
  | "doji"
  | "engulfing"
  | "bullish-engulfing"
  | "bearish-engulfing"
  | "shooting-star"
  | "inverted-hammer"
  | "morning-star"
  | "tweezer-bottom"
  | "rising-wedge"
  | "bull-flag"
  | "double-top"
  | "double-bottom"
  | "triangle"
  | "hanging-man"
  | "evening-star"
  | "piercing-line"
  | "dark-cloud-cover"
  | "three-white-soldiers"
  | "three-black-crows"
  | "harami"
  | "tweezer-top"
  | "falling-wedge"
  | "head-shoulders"
  | "indicators"
  | "equity-patterns"
  | "equity-literacy"
  | "financial-literacy"
  | "news-literacy"
  | "financial-drills"
  | "futures-literacy"
  | "forex-literacy"
  | "crypto-literacy"
  | "options-literacy";

export interface QuizGroup {
  id: QuizGroupId;
  name: string;
  description: string;
  icon?: string;
}

export const QUIZ_GROUPS: QuizGroup[] = [
  {
    id: "equity-literacy",
    name: "Equities Literacy",
    description: "Stocks, exchanges, long/short, risk & horizon (SAMPLE beginner path)",
    icon: "account_balance",
  },
  {
    id: "financial-literacy",
    name: "Statements Literacy",
    description: "Revenue, profit vs cash, balance sheet basics, P/E & margin (SAMPLE snapshots)",
    icon: "table_chart",
  },
  {
    id: "news-literacy",
    name: "News Literacy",
    description: "Rumor vs filing, priced-in, chase vs fade, source humility (SAMPLE)",
    icon: "newspaper",
  },
  {
    id: "financial-drills",
    name: "Statements Drills",
    description: "Extra SAMPLE snapshot practice — cash vs profit, margin, leverage cues",
    icon: "finance_mode",
  },
  { id: "indicators", name: "Indicators", description: "Identify SMA, EMA, RSI, MACD, Bollinger Bands", icon: "show_chart" },
  {
    id: "candle-anatomy",
    name: "Candlestick Basics",
    description: "Where high / low / open / close sit, and what red vs green means",
    icon: "candlestick_chart",
  },
  {
    id: "equity-patterns",
    name: "Equity Pack Drills",
    description: "Candle/indicator drills tagged to E1 equity SAMPLE packs (post-P0)",
    icon: "candlestick_chart",
  },
  { id: "all", name: "All Patterns", description: "Mix of all candlestick patterns", icon: "shuffle" },
  { id: "hammer", name: "Hammer Family", description: "Long lower shadow, small body at top—bullish reversal", icon: "vertical_align_bottom" },
  { id: "doji", name: "Doji Family", description: "Open ≈ close, long wicks—indecision", icon: "trending_flat" },
  { id: "engulfing", name: "Engulfing Family", description: "Body engulfs previous candle—momentum shift", icon: "compare_arrows" },
  { id: "bullish-engulfing", name: "Bullish Engulfing", description: "Green body engulfs prior red", icon: "trending_up" },
  { id: "bearish-engulfing", name: "Bearish Engulfing", description: "Red body engulfs prior green", icon: "trending_down" },
  { id: "shooting-star", name: "Shooting Star", description: "Long upper shadow, top reversal", icon: "vertical_align_top" },
  { id: "inverted-hammer", name: "Inverted Hammer", description: "Long upper shadow, bottom reversal", icon: "vertical_align_bottom" },
  { id: "morning-star", name: "Morning Star", description: "Three-candle bullish reversal", icon: "nightlight" },
  { id: "tweezer-bottom", name: "Tweezer Bottom", description: "Two candles share a similar low after a decline", icon: "vertical_align_bottom" },
  { id: "rising-wedge", name: "Rising Wedge", description: "Upward converging lines — buying is tiring", icon: "trending_up" },
  { id: "bull-flag", name: "Bull Flag", description: "Sharp rise, then a tight pause", icon: "flag" },
  { id: "double-top", name: "Double Top", description: "Two similar highs with a dip between", icon: "keyboard_double_arrow_up" },
  { id: "double-bottom", name: "Double Bottom", description: "Two similar lows with a bounce between", icon: "keyboard_double_arrow_down" },
  { id: "triangle", name: "Triangle", description: "Highs and lows squeeze — wait for the break", icon: "change_history" },
  { id: "hanging-man", name: "Hanging Man", description: "Long lower wick after a rally — wait for the next print", icon: "vertical_align_bottom" },
  { id: "evening-star", name: "Evening Star", description: "Green · small · red at the highs", icon: "nightlight" },
  { id: "piercing-line", name: "Piercing Line", description: "Green closes into the prior red body", icon: "trending_up" },
  { id: "dark-cloud-cover", name: "Dark Cloud Cover", description: "Red closes into the prior green body", icon: "trending_down" },
  { id: "three-white-soldiers", name: "Three White Soldiers", description: "Three rising green bodies in a row", icon: "trending_up" },
  { id: "three-black-crows", name: "Three Black Crows", description: "Three falling red bodies in a row", icon: "trending_down" },
  { id: "harami", name: "Harami", description: "Small body nested inside the prior larger body", icon: "compare_arrows" },
  { id: "tweezer-top", name: "Tweezer Top", description: "Two candles share a similar high after a rally", icon: "vertical_align_top" },
  { id: "falling-wedge", name: "Falling Wedge", description: "Downward converging lines — selling is tiring", icon: "trending_down" },
  { id: "head-shoulders", name: "Head and Shoulders", description: "Three peaks; the center peak is highest", icon: "account_tree" },
  {
    id: "futures-literacy",
    name: "Futures Literacy",
    description: "Contract vs stock, SAMPLE tapes, not a live desk (extra drill)",
    icon: "candlestick_chart",
  },
  {
    id: "forex-literacy",
    name: "Forex Literacy",
    description: "Pair quotes and risk-on/off on SAMPLE FX — not a live desk",
    icon: "currency_exchange",
  },
  {
    id: "crypto-literacy",
    name: "Crypto Literacy",
    description: "SAMPLE browse/drill only — does not replace Equities path",
    icon: "token",
  },
  {
    id: "options-literacy",
    name: "Options Context Literacy",
    description: "Underlying / event / vol context — no chain or Greeks",
    icon: "tune",
  },
];

function patternKeysForGroup(groupId: QuizGroupId): string[] {
  if (groupId === "engulfing") return ["engulfing", "bullish-engulfing", "bearish-engulfing"];
  return [groupId];
}

function questionsArrayForGroup(groupId: QuizGroupId): QuizQuestion[] {
  if (groupId === "indicators") return INDICATOR_QUIZ_QUESTIONS;
  if (groupId === "candle-anatomy") return CANDLE_ANATOMY_QUESTIONS;
  if (groupId === "equity-patterns") return EQUITY_PATTERN_QUIZ_QUESTIONS;
  if (groupId === "equity-literacy") return EQUITY_LITERACY_QUESTIONS;
  if (groupId === "financial-literacy") return FINANCIAL_LITERACY_QUESTIONS;
  if (groupId === "news-literacy") return NEWS_LITERACY_QUESTIONS;
  if (groupId === "financial-drills") return FINANCIAL_DRILLS_QUESTIONS;
  if (groupId === "futures-literacy") return FUTURES_LITERACY_QUESTIONS;
  if (groupId === "forex-literacy") return FOREX_LITERACY_QUESTIONS;
  if (groupId === "crypto-literacy") return CRYPTO_LITERACY_QUESTIONS;
  if (groupId === "options-literacy") return OPTIONS_LITERACY_QUESTIONS;
  return QUIZ_QUESTIONS;
}

export function getQuestionsForGroup(groupId: QuizGroupId): QuizQuestion[] {
  if (groupId === "indicators") return INDICATOR_QUIZ_QUESTIONS;
  if (groupId === "candle-anatomy") return CANDLE_ANATOMY_QUESTIONS;
  if (groupId === "equity-patterns") return EQUITY_PATTERN_QUIZ_QUESTIONS;
  if (groupId === "equity-literacy") return EQUITY_LITERACY_QUESTIONS;
  if (groupId === "financial-literacy") return FINANCIAL_LITERACY_QUESTIONS;
  if (groupId === "news-literacy") return NEWS_LITERACY_QUESTIONS;
  if (groupId === "financial-drills") return FINANCIAL_DRILLS_QUESTIONS;
  if (groupId === "futures-literacy") return FUTURES_LITERACY_QUESTIONS;
  if (groupId === "forex-literacy") return FOREX_LITERACY_QUESTIONS;
  if (groupId === "crypto-literacy") return CRYPTO_LITERACY_QUESTIONS;
  if (groupId === "options-literacy") return OPTIONS_LITERACY_QUESTIONS;
  if (groupId === "all") return QUIZ_QUESTIONS;
  const keys = patternKeysForGroup(groupId);
  const filtered = QUIZ_QUESTIONS.filter((q) => q.patternKey != null && keys.includes(q.patternKey));
  // Chart-pick first → identify/describe → trade-move last
  return [...filtered].sort((a, b) => familyDrillOrder(a) - familyDrillOrder(b));
}

function familyDrillOrder(q: QuizQuestion): number {
  if (q.optionsAreCharts) return 0;
  if (/-MOVE\d*$/.test(q.id)) return 2;
  return 1;
}

/** Planner helper: filter questions by asset class tag. */
export function getQuestionsByAssetClass(assetClass: AssetClass): QuizQuestion[] {
  return [
    ...INDICATOR_QUIZ_QUESTIONS,
    ...EQUITY_PATTERN_QUIZ_QUESTIONS,
    ...QUIZ_QUESTIONS,
  ].filter((q) => q.assetClass === assetClass);
}

export function getQuestionIndexInGroup(globalIndex: number, groupId: QuizGroupId): number {
  if (groupId === "all") return globalIndex;
  const groupQuestions = getQuestionsForGroup(groupId);
  const q = questionsArrayForGroup(groupId)[globalIndex];
  return groupQuestions.findIndex((gq) => gq.id === q?.id);
}

export function getGlobalIndexFromGroup(groupIndex: number, groupId: QuizGroupId): number {
  if (groupId === "all") return groupIndex;
  const groupQuestions = getQuestionsForGroup(groupId);
  const q = groupQuestions[groupIndex];
  return questionsArrayForGroup(groupId).findIndex((gq) => gq.id === q?.id);
}

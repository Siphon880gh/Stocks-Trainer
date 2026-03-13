export type PatternId =
  | "doji"
  | "hammer"
  | "engulfing"
  | "bullish-engulfing"
  | "bearish-engulfing"
  | "shooting-star"
  | "inverted-hammer"
  | "morning-star";

export interface QuizOption {
  id: "A" | "B" | "C" | "D" | "E";
  patternId?: PatternId;
  label: string;
  description: string;
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

export const QUIZ_OPTIONS = OPTIONS_3;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "PR-042",
    prompt: "Analyze the price action highlighted in the terminal window below. Which candlestick pattern is currently forming at the resistance level?",
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
];

export const INDICATOR_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "IN-01",
    prompt: "Which indicator is displayed on the chart? It smooths price and shows trend direction.",
    correctAnswer: "A",
    options: INDICATOR_OPTIONS,
    explanation: "SMA averages closing prices over a period; price above SMA = bullish bias.",
    overlayId: "sma",
  },
  {
    id: "IN-02",
    prompt: "Which indicator is shown? It gives more weight to recent prices than older ones.",
    correctAnswer: "B",
    options: INDICATOR_OPTIONS,
    explanation: "EMA reacts faster to new data; popular for swing trading.",
    overlayId: "ema",
  },
  {
    id: "IN-03",
    prompt: "Identify the oscillator (0–100) that measures overbought/oversold conditions.",
    correctAnswer: "C",
    options: INDICATOR_OPTIONS,
    explanation: "RSI above 70 = overbought; below 30 = oversold.",
    overlayId: "rsi",
  },
  {
    id: "IN-04",
    prompt: "Which indicator shows the difference between fast and slow EMAs with a signal line?",
    correctAnswer: "D",
    options: INDICATOR_OPTIONS,
    explanation: "MACD crossovers signal potential trend changes.",
    overlayId: "macd",
  },
  {
    id: "IN-05",
    prompt: "Which indicator displays a middle band with upper and lower volatility bands?",
    correctAnswer: "E",
    options: INDICATOR_OPTIONS,
    explanation: "Bollinger Bands: squeeze = low volatility before breakout.",
    overlayId: "bollinger",
  },
];

export const POINTS_PER_CORRECT = 50;
export const STREAK_BONUS = 10;

export type QuizGroupId =
  | "all"
  | "hammer"
  | "doji"
  | "engulfing"
  | "bullish-engulfing"
  | "bearish-engulfing"
  | "shooting-star"
  | "inverted-hammer"
  | "morning-star"
  | "indicators";

export interface QuizGroup {
  id: QuizGroupId;
  name: string;
  description: string;
  icon?: string;
}

export const QUIZ_GROUPS: QuizGroup[] = [
  { id: "indicators", name: "Indicators", description: "Identify SMA, EMA, RSI, MACD, Bollinger Bands", icon: "show_chart" },
  { id: "all", name: "All Patterns", description: "Mix of all candlestick patterns", icon: "shuffle" },
  { id: "hammer", name: "Hammer Family", description: "Long lower shadow, small body at top—bullish reversal", icon: "vertical_align_bottom" },
  { id: "doji", name: "Doji Family", description: "Open ≈ close, long wicks—indecision", icon: "trending_flat" },
  { id: "engulfing", name: "Engulfing Family", description: "Body engulfs previous candle—momentum shift", icon: "compare_arrows" },
  { id: "bullish-engulfing", name: "Bullish Engulfing", description: "Green body engulfs prior red", icon: "trending_up" },
  { id: "bearish-engulfing", name: "Bearish Engulfing", description: "Red body engulfs prior green", icon: "trending_down" },
  { id: "shooting-star", name: "Shooting Star", description: "Long upper shadow, top reversal", icon: "vertical_align_top" },
  { id: "inverted-hammer", name: "Inverted Hammer", description: "Long upper shadow, bottom reversal", icon: "vertical_align_bottom" },
  { id: "morning-star", name: "Morning Star", description: "Three-candle bullish reversal", icon: "nightlight" },
];

export function getQuestionsForGroup(groupId: QuizGroupId): QuizQuestion[] {
  if (groupId === "indicators") return INDICATOR_QUIZ_QUESTIONS;
  if (groupId === "all") return QUIZ_QUESTIONS;
  return QUIZ_QUESTIONS.filter((q) => q.patternKey === groupId);
}

export function getQuestionIndexInGroup(globalIndex: number, groupId: QuizGroupId): number {
  if (groupId === "all") return globalIndex;
  const groupQuestions = getQuestionsForGroup(groupId);
  const q = groupId === "indicators" ? INDICATOR_QUIZ_QUESTIONS[globalIndex] : QUIZ_QUESTIONS[globalIndex];
  return groupQuestions.findIndex((gq) => gq.id === q?.id);
}

export function getGlobalIndexFromGroup(groupIndex: number, groupId: QuizGroupId): number {
  if (groupId === "all") return groupIndex;
  const groupQuestions = getQuestionsForGroup(groupId);
  const q = groupQuestions[groupIndex];
  const arr = groupId === "indicators" ? INDICATOR_QUIZ_QUESTIONS : QUIZ_QUESTIONS;
  return arr.findIndex((gq) => gq.id === q?.id);
}

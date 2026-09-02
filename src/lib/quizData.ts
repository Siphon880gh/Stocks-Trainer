import type { AssetClass } from "./samplePacks";

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
  | "indicators"
  | "equity-patterns"
  | "equity-literacy"
  | "financial-literacy"
  | "news-literacy"
  | "financial-drills";

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

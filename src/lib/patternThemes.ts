/**
 * Common candlestick and chart-pattern themes (#17): 17 functional themes, a theme tag on EVERY pattern
 * record (patterns.ts attaches PATTERN_THEMES), the quick pattern map, the practical hierarchy (pre-trade
 * checklist), a few example patterns the themes need (pipe top/bottom, inside bar, four-price doji, common gap,
 * bull/bear trap, blow-off top) with SIMULATED charts, glossary terms and the Learn group "pattern-themes".
 * Type-only imports, so there is no runtime import cycle.
 *
 * Sources (loaded 2026-10-22): StockCharts ChartSchool (gaps, broadening, chart patterns), Bulkowski
 * (pipe bottoms / tops), Investopedia (bull trap, bear trap, blow-off top), iwpfinance (four-price doji),
 * TMGM (inside bar).
 */
import type { OHLC } from "./ohlcData";
import type { PatternDef } from "./patterns";
import type { LiteracyTerm } from "./literacyTerms";
import type { QuizOption, QuizQuestion } from "./quizData";

export type ThemeId =
  | "continuation"
  | "bullish-reversal"
  | "bearish-reversal"
  | "convergence"
  | "balance"
  | "expansion"
  | "breakout"
  | "rejection"
  | "indecision"
  | "momentum"
  | "exhaustion"
  | "gap"
  | "role-reversal"
  | "basing"
  | "measured-move"
  | "failure"
  | "confirmation";

export interface PatternThemes {
  primary: ThemeId;
  secondary: ThemeId[];
}

export interface Theme {
  id: ThemeId;
  n: number;
  name: string;
  short: string;
  question: string;
  notes: string[];
  examples: string[];
}

export const THEMES_INTRO = [
  "Candlestick and chart patterns provide a structured way to interpret recurring market behaviour. Candlestick patterns typically develop over one to three bars and are based on the open, high, low and close. Chart patterns develop over a longer sequence of bars or price swings and describe broader formations in market structure. Together, they help organise observations about trend, momentum, support and resistance, volatility, and potential changes in market direction.",
  "For example, Dark Cloud Cover is a two-candle bearish-reversal candidate, while a wedge or triangle is a multi-bar price structure. These patterns belong to different analytical categories, although both can provide information about changing market conditions.",
  "There is no single official master list of pattern labels; textbooks and platforms use overlapping names. The functional themes below cover the common set: every familiar candle or chart pattern fits one or more of them. Patterns can support quick decisions, though they are never guaranteed.",
];

export const THEMES_QUOTE =
  "A named pattern is not a prediction. It is an organised hypothesis about price behaviour that still needs confirmation and risk control.";

export const THEMES: Theme[] = [
  {
    id: "continuation", n: 1, name: "Trend continuation", short: "Continuation",
    question: "Is the existing trend pausing and then likely resuming?",
    notes: [
      "Forms after a clear prior advance or decline; the pattern is a temporary pause, not evidence that the larger trend has ended.",
      "Continuation is contextual: the same rectangle or triangle can become a reversal if it breaks the opposite way.",
    ],
    examples: ["Flags and pennants", "Rising and falling three methods", "Mat hold", "Separating lines", "Channels", "Rectangles and some triangles", "Runaway / measuring gaps"],
  },
  {
    id: "bullish-reversal", n: 2, name: "Bullish reversal", short: "Bullish reversal",
    question: "Has a downtrend or pullback likely exhausted itself and begun to turn upward?",
    notes: ["Matters most after a decline and near support."],
    examples: ["Hammer and inverted hammer", "Bullish engulfing", "Piercing line", "Morning star and morning doji star", "Tweezer bottom", "Three white soldiers", "Three inside up and three outside up", "Bullish harami or harami cross", "Bullish kicker and abandoned baby", "Pipe bottom / two-bar reversal bottom", "Double bottom, triple bottom, inverse head and shoulders, rounding bottom, cup-and-handle and falling wedge", "Failed breakdown / bear trap"],
  },
  {
    id: "bearish-reversal", n: 3, name: "Bearish reversal", short: "Bearish reversal",
    question: "Has an uptrend or rally likely exhausted itself and begun to turn downward?",
    notes: ["Matters most after an advance and near resistance."],
    examples: ["Shooting star and hanging man", "Bearish engulfing", "Dark Cloud Cover", "Evening star and evening doji star", "Tweezer top", "Three black crows", "Three inside down and three outside down", "Bearish harami or harami cross", "Bearish kicker and abandoned baby", "Pipe top / two-bar reversal top", "Double top, triple top, head and shoulders top, rounding top and rising wedge", "Failed breakout / bull trap"],
  },
  {
    id: "convergence", n: 4, name: "Convergence and volatility compression", short: "Convergence",
    question: "Is the range narrowing as buyers and sellers approach a decision point?",
    notes: [
      "The theme behind wedges and triangles: successive swings become smaller and the boundaries converge.",
      "Compression signals potential energy, not guaranteed direction.",
      "The apex is not a price target; a confirmed breakout before or near it is what matters.",
    ],
    examples: ["Symmetrical, ascending and descending triangles", "Rising and falling wedges", "Pennant", "Inside bar, narrow-range bar and mother-bar structures"],
  },
  {
    id: "balance", n: 5, name: "Horizontal balance, range and congestion", short: "Balance / range",
    question: "Is price temporarily balanced between support and resistance?",
    notes: ["Price moves sideways rather than narrowing or expanding; neutral until a boundary breaks."],
    examples: ["Rectangle / trading range", "Horizontal channel", "Base after a decline", "Distribution range after an advance", "Repeated tests of support or resistance"],
  },
  {
    id: "expansion", n: 6, name: "Expansion and divergence", short: "Expansion",
    question: "Is volatility increasing and are buyers and sellers becoming less orderly?",
    notes: ["The opposite of convergence: swings widen.", "Expansion is usually a volatility warning, not a direction by itself."],
    examples: ["Broadening formation / megaphone", "Expanding triangle", "Broadening top or bottom", "Large-range bars after quiet trading", "Volatility expansion from an inside-bar or narrow-range setup"],
  },
  {
    id: "breakout", n: 7, name: "Breakout and breakdown", short: "Breakout",
    question: "Has price escaped a defined boundary?",
    notes: [
      "A breakout is a move above resistance or a pattern boundary; a breakdown is a move below support or a lower boundary. This activates many chart patterns.",
      "Useful confirmation includes a close beyond the level, follow-through, a retest that holds, and relevant volume. None eliminates false breakouts.",
    ],
    examples: ["Triangle, wedge, rectangle, flag, pennant, cup-and-handle and channel breaks", "A head-and-shoulders neckline break", "A double top/bottom break through its confirmation level", "A gap through support or resistance"],
  },
  {
    id: "rejection", n: 8, name: "Rejection of a price level", short: "Rejection",
    question: "Did price probe beyond a level but get pushed back?",
    notes: ["Often appears as a long wick or tail relative to the real body.", "Rejection shows an attempted move failed; it does not by itself prove a reversal."],
    examples: ["Hammer (rejection of lower prices after a decline)", "Shooting star (rejection of higher prices after an advance)", "Long-legged doji or high-wave candle", "Tweezer top/bottom", "A failed breakout or breakdown that closes back inside the range"],
  },
  {
    id: "indecision", n: 9, name: "Indecision and transition", short: "Indecision",
    question: "Has directional conviction weakened enough that a transition may be starting?",
    notes: ["Neither bullish nor bearish by itself; more relevant after a one-sided move or at support/resistance.", "Treat indecision as a reason to wait for confirmation."],
    examples: ["Doji (standard, long-legged, dragonfly, gravestone and four-price variants)", "Spinning top", "High-wave candle", "Harami and harami cross", "Small-body candles clustered after a strong impulse"],
  },
  {
    id: "momentum", n: 10, name: "Momentum and directional dominance", short: "Momentum",
    question: "Is one side controlling the auction strongly right now?",
    notes: ["Wide real bodies, closes near an extreme, or a series of directional candles.", "Momentum can confirm a new move, but a late surge can also become exhaustion."],
    examples: ["Bullish or bearish marubozu", "Large-bodied momentum candle", "Three white soldiers and three black crows", "Strong breakout bar", "Kicker pattern"],
  },
  {
    id: "exhaustion", n: 11, name: "Exhaustion and climax", short: "Exhaustion",
    question: "Has the trend pushed so far or so fast that follow-through may be running out?",
    notes: ["Often combines a mature trend, unusually wide bars or gaps, rejection wicks, then failure to continue.", "The key evidence is the later loss of follow-through."],
    examples: ["Blow-off top or selling climax", "Exhaustion gap", "A trend followed by a doji, shooting star, hammer or star pattern", "Island reversal", "A final momentum surge followed by a failed breakout", "A rising or falling wedge at the end of a mature move"],
  },
  {
    id: "gap", n: 12, name: "Gap and discontinuity", short: "Gap",
    question: "Did price skip a range of prices because of a rapid supply-demand shift?",
    notes: ["Do not assume every gap must fill."],
    examples: ["Common gap (often inside a range)", "Breakaway gap (leaves a base, range or pattern)", "Runaway / continuation / measuring gap (during a strong trend)", "Exhaustion gap (late in a mature trend, then fails)", "Tasuki gap and island reversal"],
  },
  {
    id: "role-reversal", n: 13, name: "Support, resistance, role reversal and retest", short: "Role reversal / retest",
    question: "Has a former decision level changed jobs?",
    notes: ["Former resistance may become support after a breakout, and former support may become resistance after a breakdown.", "A retest is also called a pullback or throwback."],
    examples: ["A triangle breakout retests its upper trend line and holds", "A head-and-shoulders neckline breaks, then acts as resistance", "A rectangle boundary flips roles after a break", "A bullish engulfing appears at major support"],
  },
  {
    id: "basing", n: 14, name: "Basing, accumulation, topping and distribution", short: "Basing / topping",
    question: "Is a larger transfer of control developing over time?",
    notes: ["Longer-horizon versions of balance and reversal.", "\"Accumulation\" and \"distribution\" are interpretations, not facts visible from price alone; require a confirmed break of structure."],
    examples: ["Rounding bottom / saucer", "Cup-and-handle", "Extended horizontal base", "Rounding top", "Distribution range and broadening top", "Double or triple top/bottom", "Inverse or regular head and shoulders"],
  },
  {
    id: "measured-move", n: 15, name: "Measured move and price projection", short: "Measured move",
    question: "If the pattern resolves, what is a reasonable reference distance for the move?",
    notes: ["A planning framework, not a promise."],
    examples: [
      "Flag or pennant: project the flagpole from the breakout",
      "Triangle or rectangle: project the pattern's height from the break",
      "Head and shoulders: project the head-to-neckline distance from the neckline break",
      "Cup-and-handle: project the cup depth from the lip breakout",
      "Double top/bottom: project the pattern height from its confirmation level",
    ],
  },
  {
    id: "failure", n: 16, name: "Pattern failure and traps", short: "Failure / trap",
    question: "Did an apparently valid setup fail, trapping traders on the wrong side?",
    notes: ["Failure is a primary theme, not an exception.", "Define invalidation before treating any pattern as actionable."],
    examples: ["Bull trap (an upside breakout fails and price falls back below resistance)", "Bear trap (a downside breakdown fails and price rises back above support)", "Failed head and shoulders, triangle or wedge", "False breakout with no follow-through", "A brief break of a level followed by a close back inside the range"],
  },
  {
    id: "confirmation", n: 17, name: "Confirmation and multi-time-frame context", short: "Confirmation",
    question: "Is the setup strong enough to act on, or is it only a possibility?",
    notes: ["Not a pattern shape, but the final decision theme."],
    examples: [
      "A bar closes beyond the boundary rather than merely piercing it intraday",
      "Later bars show follow-through",
      "A retest holds",
      "Breakout volume is stronger than the surrounding consolidation",
      "The lower-time-frame signal aligns with the higher-time-frame trend or level",
      "Entry, invalidation, position size and maximum loss are defined first",
    ],
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);
export const getTheme = (id: string): Theme | undefined => THEMES.find((t) => t.id === id);
export const isThemeId = (id: string | null | undefined): id is ThemeId => !!id && THEME_IDS.includes(id as ThemeId);

/** Quick pattern map, as given (19 rows). `patterns` = Archive ids the row covers (for links). */
export const QUICK_MAP: Array<{ family: string; primary: string; secondary: string; patterns: string[] }> = [
  { family: "Dark Cloud Cover", primary: "Bearish reversal", secondary: "Rejection / exhaustion", patterns: ["dark-cloud-cover"] },
  { family: "Piercing line", primary: "Bullish reversal", secondary: "Rejection / exhaustion", patterns: ["piercing-line"] },
  { family: "Hammer / shooting star", primary: "Rejection", secondary: "Reversal, depending on trend context", patterns: ["hammer", "shooting-star"] },
  { family: "Doji / spinning top", primary: "Indecision", secondary: "Exhaustion or transition", patterns: ["doji", "spinning-top"] },
  { family: "Engulfing", primary: "Reversal", secondary: "Momentum", patterns: ["bullish-engulfing", "bearish-engulfing"] },
  { family: "Morning / evening star", primary: "Reversal", secondary: "Exhaustion", patterns: ["morning-star", "evening-star"] },
  { family: "Three methods", primary: "Continuation", secondary: "Compression", patterns: ["rising-three-methods", "falling-three-methods"] },
  { family: "Three white soldiers / black crows", primary: "Momentum", secondary: "Reversal or exhaustion", patterns: ["three-white-soldiers", "three-black-crows"] },
  { family: "Flag / pennant", primary: "Continuation", secondary: "Consolidation / convergence", patterns: ["bull-flag", "bear-flag", "bull-pennant", "bear-pennant"] },
  { family: "Symmetrical triangle", primary: "Convergence", secondary: "Bilateral breakout", patterns: ["triangle"] },
  { family: "Ascending / descending triangle", primary: "Convergence", secondary: "Directional breakout bias", patterns: ["ascending-triangle", "descending-triangle"] },
  { family: "Rising / falling wedge", primary: "Convergence", secondary: "Reversal or continuation", patterns: ["rising-wedge", "falling-wedge"] },
  { family: "Rectangle / channel", primary: "Balance / range", secondary: "Continuation or reversal after the break", patterns: ["bullish-rectangle", "bearish-rectangle", "ascending-channel", "descending-channel"] },
  { family: "Double / triple top or bottom", primary: "Reversal", secondary: "Support/resistance test", patterns: ["double-top", "double-bottom", "triple-top", "triple-bottom"] },
  { family: "Head and shoulders", primary: "Reversal", secondary: "Measured move", patterns: ["head-shoulders", "inverse-head-shoulders"] },
  { family: "Cup-and-handle / rounding bottom", primary: "Basing", secondary: "Bullish continuation or reversal", patterns: ["cup-and-handle", "rounding-bottom"] },
  { family: "Broadening formation", primary: "Expansion", secondary: "Bilateral / volatile transition", patterns: ["broadening-top", "broadening-bottom"] },
  { family: "Gap", primary: "Discontinuity", secondary: "Breakout, continuation or exhaustion", patterns: ["common-gap", "breakaway-gap", "runaway-gap", "exhaustion-gap"] },
  { family: "Failed breakout / breakdown", primary: "Trap", secondary: "Reversal", patterns: ["failed-breakout", "failed-breakdown"] },
];

/** The practical hierarchy, as an interactive pre-trade checklist. */
export const HIERARCHY: Array<{ id: string; step: string; ask: string }> = [
  { id: "context", step: "Context", ask: "Is price trending, ranging, compressing or expanding?" },
  { id: "location", step: "Location", ask: "Is the setup at meaningful support, resistance or a prior swing level?" },
  { id: "theme", step: "Theme", ask: "Is it continuation, reversal, indecision, rejection or a volatility change?" },
  { id: "trigger", step: "Trigger", ask: "What confirms it (breakout, breakdown, close, retest or follow-through)?" },
  { id: "risk", step: "Invalidation and risk", ask: "Where is the setup clearly wrong, and how much can be lost if it fails?" },
];

const t = (primary: ThemeId, ...secondary: ThemeId[]): PatternThemes => ({ primary, secondary });

/** Theme tags for EVERY pattern in the Archive registry (patterns.ts). The test fails if one is missing. */
export const PATTERN_THEMES: Record<string, PatternThemes> = {
  // core single and multi-candle patterns
  doji: t("indecision", "exhaustion"),
  hammer: t("rejection", "bullish-reversal"),
  engulfing: t("bullish-reversal", "momentum"),
  "bullish-engulfing": t("bullish-reversal", "momentum"),
  "bearish-engulfing": t("bearish-reversal", "momentum"),
  "shooting-star": t("rejection", "bearish-reversal"),
  "inverted-hammer": t("bullish-reversal", "rejection"),
  "morning-star": t("bullish-reversal", "exhaustion"),
  "hanging-man": t("bearish-reversal", "rejection"),
  "evening-star": t("bearish-reversal", "exhaustion"),
  "piercing-line": t("bullish-reversal", "rejection", "exhaustion"),
  "dark-cloud-cover": t("bearish-reversal", "rejection", "exhaustion"),
  "three-white-soldiers": t("momentum", "bullish-reversal", "exhaustion"),
  "three-black-crows": t("momentum", "bearish-reversal", "exhaustion"),
  harami: t("bullish-reversal", "indecision"),
  "bearish-harami": t("bearish-reversal", "indecision"),
  "tweezer-top": t("bearish-reversal", "rejection"),
  "tweezer-bottom": t("bullish-reversal", "rejection"),
  "white-marubozu": t("momentum"),
  "black-marubozu": t("momentum"),
  "spinning-top": t("indecision", "exhaustion"),
  "three-inside-up": t("bullish-reversal", "confirmation"),
  "three-inside-down": t("bearish-reversal", "confirmation"),
  "three-outside-up": t("bullish-reversal", "momentum"),
  "three-outside-down": t("bearish-reversal", "momentum"),
  "on-neck": t("continuation"),
  "bullish-counterattack": t("bullish-reversal", "rejection"),
  "bearish-counterattack": t("bearish-reversal", "rejection"),
  "rising-three-methods": t("continuation", "convergence"),
  "falling-three-methods": t("continuation", "convergence"),
  "mat-hold": t("continuation", "gap"),
  "bearish-mat-hold": t("continuation", "gap"),
  "upside-tasuki-gap": t("continuation", "gap"),
  "downside-tasuki-gap": t("continuation", "gap"),
  "long-green-candle": t("momentum"),
  "long-red-candle": t("momentum"),
  "short-green-candle": t("indecision"),
  "short-red-candle": t("indecision"),
  "bullish-closing-marubozu": t("momentum"),
  "bearish-closing-marubozu": t("momentum"),
  "bullish-opening-marubozu": t("momentum", "bullish-reversal"),
  "bearish-opening-marubozu": t("momentum", "bearish-reversal"),
  "long-legged-doji": t("indecision", "rejection", "exhaustion"),
  "cross-doji": t("indecision"),
  "inverted-cross-doji": t("indecision", "rejection"),
  "dragonfly-doji": t("indecision", "rejection", "bullish-reversal"),
  "gravestone-doji": t("indecision", "rejection", "bearish-reversal"),
  "bullish-kicker": t("bullish-reversal", "momentum", "gap"),
  "bearish-kicker": t("bearish-reversal", "momentum", "gap"),
  "bullish-abandoned-baby": t("bullish-reversal", "gap", "exhaustion"),
  "bearish-abandoned-baby": t("bearish-reversal", "gap", "exhaustion"),
  "bullish-tri-star": t("bullish-reversal", "indecision"),
  "bearish-tri-star": t("bearish-reversal", "indecision"),
  "two-crows": t("bearish-reversal", "gap"),
  "upside-gap-two-crows": t("bearish-reversal", "gap"),
  "bullish-three-line-strike": t("continuation", "failure"),
  "bearish-three-line-strike": t("continuation", "failure"),
  "bullish-breakaway": t("bullish-reversal", "gap", "exhaustion"),
  "bearish-breakaway": t("bearish-reversal", "gap", "exhaustion"),
  "bullish-separating-lines": t("continuation"),
  "bearish-separating-lines": t("continuation"),
  "bullish-side-by-side-white-lines": t("continuation", "gap"),
  "bearish-side-by-side-white-lines": t("continuation", "gap"),
  "in-neck": t("continuation"),
  thrusting: t("continuation"),
  "upside-gap-three-methods": t("continuation", "gap"),
  "downside-gap-three-methods": t("continuation", "gap"),
  // harami crosses, doji stars, doji family and advanced / rare candles
  "bullish-harami-cross": t("bullish-reversal", "indecision"),
  "bearish-harami-cross": t("bearish-reversal", "indecision"),
  "morning-doji-star": t("bullish-reversal", "exhaustion", "indecision"),
  "evening-doji-star": t("bearish-reversal", "exhaustion", "indecision"),
  "high-wave": t("indecision", "rejection", "expansion"),
  "rickshaw-man": t("indecision"),
  "double-doji": t("indecision", "expansion"),
  "stick-sandwich": t("bullish-reversal", "role-reversal"),
  "homing-pigeon": t("bullish-reversal", "indecision"),
  "ladder-bottom": t("bullish-reversal", "exhaustion"),
  "concealing-baby-swallow": t("bullish-reversal", "exhaustion"),
  "unique-three-river-bottom": t("bullish-reversal", "rejection"),
  "advance-block": t("bearish-reversal", "exhaustion"),
  deliberation: t("bearish-reversal", "exhaustion"),
  "matching-low": t("bullish-reversal", "role-reversal"),
  "three-stars-in-the-south": t("bullish-reversal", "exhaustion"),
  "identical-three-crows": t("bearish-reversal", "momentum"),
  "takuri-line": t("bullish-reversal", "rejection"),
  "last-engulfing-bottom": t("bullish-reversal", "failure"),
  "last-engulfing-top": t("bearish-reversal", "failure"),
  "above-the-stomach": t("bullish-reversal", "momentum"),
  "below-the-stomach": t("bearish-reversal", "momentum"),
  "bullish-hikkake": t("failure", "bullish-reversal", "convergence"),
  "bearish-hikkake": t("failure", "bearish-reversal", "convergence"),
  // chart patterns and zones
  "head-shoulders": t("bearish-reversal", "measured-move", "basing"),
  "inverse-head-shoulders": t("bullish-reversal", "measured-move", "basing"),
  "falling-wedge": t("convergence", "bullish-reversal", "continuation"),
  "rising-wedge": t("convergence", "bearish-reversal", "continuation"),
  "bull-flag": t("continuation", "convergence", "measured-move"),
  "bear-flag": t("continuation", "convergence", "measured-move"),
  "bull-pennant": t("continuation", "convergence", "measured-move"),
  "bear-pennant": t("continuation", "convergence", "measured-move"),
  "high-tight-flag": t("continuation", "momentum", "measured-move"),
  "double-top": t("bearish-reversal", "role-reversal", "basing"),
  "double-bottom": t("bullish-reversal", "role-reversal", "basing"),
  "triple-top": t("bearish-reversal", "role-reversal", "basing"),
  "triple-bottom": t("bullish-reversal", "role-reversal", "basing"),
  triangle: t("convergence", "breakout"),
  "ascending-triangle": t("convergence", "breakout", "continuation"),
  "descending-triangle": t("convergence", "breakout", "continuation"),
  "bullish-rectangle": t("balance", "continuation", "breakout"),
  "bearish-rectangle": t("balance", "continuation", "breakout"),
  "ascending-channel": t("continuation", "balance"),
  "descending-channel": t("continuation", "balance"),
  "rounding-bottom": t("basing", "bullish-reversal"),
  "rounding-top": t("basing", "bearish-reversal"),
  "cup-and-handle": t("basing", "continuation", "measured-move"),
  "inverse-cup-and-handle": t("basing", "continuation", "measured-move"),
  "broadening-top": t("expansion", "basing"),
  "broadening-bottom": t("expansion"),
  "diamond-top": t("bearish-reversal", "expansion", "convergence"),
  "diamond-bottom": t("bullish-reversal", "expansion", "convergence"),
  "v-bottom": t("bullish-reversal", "exhaustion"),
  "three-pushes": t("exhaustion", "bearish-reversal"),
  "supply-zone": t("role-reversal", "bearish-reversal"),
  "demand-zone": t("role-reversal", "bullish-reversal"),
  // gaps and volume
  "rising-window": t("gap", "continuation", "role-reversal"),
  "falling-window": t("gap", "continuation", "role-reversal"),
  "breakaway-gap": t("gap", "breakout"),
  "runaway-gap": t("gap", "continuation", "measured-move"),
  "exhaustion-gap": t("gap", "exhaustion"),
  "island-top": t("gap", "exhaustion", "bearish-reversal"),
  "island-bottom": t("gap", "exhaustion", "bullish-reversal"),
  "selling-climax": t("exhaustion", "bullish-reversal"),
  "volume-dry-up": t("convergence", "confirmation"),
  "breakout-volume": t("breakout", "confirmation"),
  "volume-divergence": t("exhaustion", "confirmation"),
  // example patterns added by this module
  "inside-bar": t("convergence", "indecision", "breakout"),
  "pipe-bottom": t("bullish-reversal", "rejection"),
  "pipe-top": t("bearish-reversal", "rejection"),
  "four-price-doji": t("indecision"),
  "common-gap": t("gap", "balance"),
  "failed-breakout": t("failure", "bearish-reversal", "rejection"),
  "failed-breakdown": t("failure", "bullish-reversal", "rejection"),
  "blow-off-top": t("exhaustion", "bearish-reversal", "momentum"),
};

export const themesFor = (id: string): PatternThemes | undefined => PATTERN_THEMES[id];
export const patternIdsForTheme = (theme: ThemeId): string[] =>
  Object.entries(PATTERN_THEMES).filter(([, v]) => v.primary === theme || v.secondary.includes(theme)).map(([k]) => k);

// ---------- example patterns the themes need (SIMULATED charts) ----------
const bars = (rows: Array<[number, number, number, number]>): OHLC[] =>
  rows.map(([open, high, low, close], i) => ({ name: String(i + 1), open, high, low, close }));

interface ThemePattern {
  def: PatternDef;
  bars: OHLC[];
  /** Last candle of the pattern. */
  end: number;
  /** Buy-or-Sell drill: confirmation direction, and the first bar whose extreme the confirmation must clear. */
  drill?: { dir: "up" | "down"; from: number; kind: string; why: string; stop: string; term: string };
}

export const THEME_PATTERNS: ThemePattern[] = [
  {
    def: {
      id: "inside-bar", name: "Inside Bar (Mother Bar)", type: "neutral", sentiment: "neutral", confirmation: "low",
      description: "Two candles: a large mother bar, then a candle whose whole range, wicks included, sits inside the mother bar's high and low. Range contraction, not a direction. Traders mark the mother bar's high and low and wait for a close beyond one of them; a breakout plan often places a stop beyond the opposite side of the mother bar. A narrow-range (NR) bar is a related idea: the narrowest range of the last few bars.",
    },
    bars: bars([[63000, 63400, 62950, 63350], [63350, 63750, 63300, 63700], [63700, 64500, 63600, 64400], [64300, 64350, 63900, 64000]]),
    end: 3,
    drill: { dir: "up", from: 2, kind: "inside-bar breakout", why: "The inside bar held inside the mother bar's range, then the next candle closed above the mother bar's high: the coil broke upward.", stop: "below the mother bar's low", term: "inside-bar" },
  },
  {
    def: {
      id: "pipe-bottom", name: "Pipe Bottom", type: "reversal", sentiment: "bullish", confirmation: "medium",
      description: "Two adjacent, unusually long downward spikes with a large overlap, standing out below the surrounding bars, usually after a decline (often on a weekly chart). Valid only once price closes above the highest high of the two bars. A close below the lower spike cancels it. Also called a two-bar reversal bottom.",
    },
    bars: bars([[65000, 65050, 64600, 64650], [64650, 64700, 64250, 64300], [64300, 64350, 63900, 63950], [63950, 64050, 62800, 63800], [63800, 63900, 62850, 63700]]),
    end: 4,
    drill: { dir: "up", from: 3, kind: "bullish reversal", why: "Two adjacent long downward spikes after a decline, then a close above the higher of the two bars: lower prices were rejected twice.", stop: "below the lower spike", term: "pipe-top-bottom" },
  },
  {
    def: {
      id: "pipe-top", name: "Pipe Top", type: "reversal", sentiment: "bearish", confirmation: "medium",
      description: "Two adjacent, unusually long upward spikes with a large overlap, standing out above the surrounding bars, usually after a rally. Valid only once price closes below the lowest low of the two bars. A close above the higher spike cancels it. Also called a two-bar reversal top.",
    },
    bars: bars([[63000, 63400, 62950, 63350], [63350, 63750, 63300, 63700], [63700, 64100, 63650, 64050], [64050, 65200, 63950, 64150], [64150, 65150, 64050, 64100]]),
    end: 4,
    drill: { dir: "down", from: 3, kind: "bearish reversal", why: "Two adjacent long upward spikes after a rally, then a close below the lower of the two bars: higher prices were rejected twice.", stop: "above the higher spike", term: "pipe-top-bottom" },
  },
  {
    def: {
      id: "four-price-doji", name: "Four-Price Doji", type: "neutral", sentiment: "neutral", confirmation: "low",
      description: "Open, high, low and close are all the same price, so the candle is a single flat line. It usually means almost no trading happened in that bar (a thin market, a halt, or an after-hours bar), so it carries very little signal on its own.",
    },
    bars: bars([[63000, 63100, 62900, 63050], [63050, 63150, 62950, 63000], [63000, 63000, 63000, 63000], [63000, 63100, 62950, 63050]]),
    end: 2,
  },
  {
    def: {
      id: "common-gap", name: "Common Gap", type: "neutral", sentiment: "neutral", confirmation: "low",
      description: "A small gap inside a trading range, often on light volume. It does not leave a base or a pattern, and it is usually filled fairly quickly as price trades back to the last bar before the gap. Compare breakaway, runaway and exhaustion gaps, which say more; and do not assume every gap must fill.",
    },
    bars: bars([[63100, 63300, 63000, 63250], [63250, 63400, 63150, 63200], [63450, 63550, 63420, 63500], [63480, 63500, 63150, 63200], [63200, 63350, 63100, 63300]]),
    end: 2,
  },
  {
    def: {
      id: "failed-breakout", name: "Bull Trap (Failed Breakout)", type: "reversal", sentiment: "bearish", confirmation: "medium",
      description: "Price breaks above resistance or a pattern's upper boundary, then falls back and closes below it, trapping the buyers who chased the break. The failure itself is the information: a close back inside the range, then a close below the breakout bar's low, is the bearish trigger. Stop above the failed high.",
    },
    bars: bars([[63500, 64000, 63400, 63900], [63900, 63950, 63500, 63600], [63600, 64000, 63550, 63950], [63950, 64300, 63900, 64250], [64250, 64280, 63800, 63850]]),
    end: 4,
    drill: { dir: "down", from: 3, kind: "failed breakout (bull trap)", why: "The close above resistance did not hold: price fell back inside the range and then through the breakout bar's low.", stop: "above the failed breakout high", term: "bull-trap" },
  },
  {
    def: {
      id: "failed-breakdown", name: "Bear Trap (Failed Breakdown)", type: "reversal", sentiment: "bullish", confirmation: "medium",
      description: "Price breaks below support or a pattern's lower boundary, then rallies back and closes above it, trapping the sellers who shorted the break. A close back inside the range, then a close above the breakdown bar's high, is the bullish trigger. Stop below the failed low.",
    },
    bars: bars([[63500, 63600, 63000, 63100], [63100, 63500, 63050, 63400], [63400, 63450, 63000, 63050], [63050, 63100, 62700, 62750], [62750, 63200, 62720, 63150]]),
    end: 4,
    drill: { dir: "up", from: 3, kind: "failed breakdown (bear trap)", why: "The close below support did not hold: price climbed back inside the range and then above the breakdown bar's high.", stop: "below the failed breakdown low", term: "bear-trap" },
  },
  {
    def: {
      id: "blow-off-top", name: "Blow-Off Top", type: "reversal", sentiment: "bearish", confirmation: "medium",
      description: "A steep, accelerating rally, usually on heavy volume, ends in a very wide bar and is followed by a sharp drop. It is an exhaustion move: the late buyers are the last buyers. The evidence is the loss of follow-through after the climax bar; the mirror at a low is a selling climax.",
    },
    bars: bars([[63000, 63300, 62950, 63250], [63250, 63700, 63200, 63650], [63650, 64300, 63600, 64250], [64250, 65600, 64200, 65400], [65400, 65500, 64300, 64400]]),
    end: 4,
    drill: { dir: "down", from: 3, kind: "exhaustion (blow-off top)", why: "The widest bar of the run was immediately reversed: follow-through ran out.", stop: "above the climax high", term: "blow-off-top" },
  },
];

export const THEME_PATTERN_DEFS: PatternDef[] = THEME_PATTERNS.map((p) => p.def);
export const THEME_OHLC: Record<string, OHLC[]> = Object.fromEntries(THEME_PATTERNS.map((p) => [p.def.id, p.bars]));
export const THEME_DRILL_SPECS: ReadonlyArray<{ key: string; end: number; dir: "up" | "down"; from: number }> =
  THEME_PATTERNS.filter((p) => p.drill).map((p) => ({ key: p.def.id, end: p.end, dir: p.drill!.dir, from: p.drill!.from }));
export const THEME_DRILL_INFO: Record<string, { name: string; kind: string; why: string; stop: string; term: string }> =
  Object.fromEntries(
    THEME_PATTERNS.filter((p) => p.drill).map((p) => [
      p.def.id,
      { name: p.def.name, kind: p.drill!.kind, why: p.drill!.why, stop: p.drill!.stop, term: p.drill!.term },
    ]),
  );

// ---------- glossary ----------
export const THEME_TERMS: LiteracyTerm[] = [
  { id: "pattern-theme", name: "Pattern theme", category: "process", summary: "The question a pattern answers: continuation, reversal, rejection, compression, a trap…", detail: "There is no single official master list of pattern names. Grouping patterns by the behaviour they describe (17 themes in Practice → Pattern themes) makes a new or unfamiliar name easier to place. A theme is still a hypothesis that needs confirmation and a planned stop. Educational, not advice." },
  { id: "inside-bar", name: "Inside bar", category: "process", summary: "A candle whose whole range sits inside the prior (mother) bar's high and low.", detail: "Two candles. Containment is measured on the full high-to-low range, wicks included (a harami is measured on bodies). It shows a pause; the break of the mother bar's high or low decides direction. Educational, not advice." },
  { id: "mother-bar", name: "Mother bar", category: "process", summary: "The larger first candle of an inside-bar setup; its high and low are the boundaries.", detail: "A close above the mother bar's high is a bullish break, a close below its low a bearish break. A very large mother bar means a wider stop. Educational, not advice." },
  { id: "narrow-range-bar", name: "Narrow-range (NR) bar", category: "process", summary: "The bar with the smallest high-low range of the last few bars (e.g. NR4, NR7).", detail: "Like an inside bar, it marks compression. Quiet bars often precede larger-range bars, but the direction is not known in advance. Educational, not advice." },
  { id: "pipe-top-bottom", name: "Pipe top / pipe bottom", category: "process", summary: "Two adjacent, unusually long spikes; confirmed by a close beyond the far end of the pair.", detail: "Pipe bottom: two long downward spikes, valid once price closes above the higher of the two highs. Pipe top: two long upward spikes, valid once price closes below the lower of the two lows. Best known on weekly charts. Educational, not advice." },
  { id: "four-price-doji", name: "Four-price doji", category: "process", summary: "Open = high = low = close: a flat line.", detail: "The rarest doji. It usually reflects almost no trading in the bar (thin market, halt, after-hours) rather than a meaningful reversal signal. Educational, not advice." },
  { id: "common-gap", name: "Common gap", category: "markets", summary: "A small, uneventful gap inside a range that is usually filled quickly.", detail: "One of the four basic gap types (common, breakaway, runaway, exhaustion). Common gaps tend to fill; breakaway and runaway gaps often do not. Educational, not advice." },
  { id: "gap-types", name: "Gap types", category: "markets", summary: "Common, breakaway, runaway (measuring) and exhaustion gaps.", detail: "Common: inside a range, often filled. Breakaway: leaves a base or pattern. Runaway: mid-trend, in the direction of the trend. Exhaustion: late in a mature trend, then fails. Tasuki gaps and island reversals are candle and chart patterns built on gaps. Do not assume every gap must fill. Educational, not advice." },
  { id: "bear-trap", name: "Bear trap", category: "process", summary: "A breakdown below support that reverses back above it, trapping sellers.", detail: "The mirror of a bull trap. Wait for a close, not an intraday poke, and define invalidation before entry so a failed break is a small, planned loss. Educational, not advice." },
  { id: "blow-off-top", name: "Blow-off top", category: "process", summary: "A steep, high-volume run-up that ends in a sharp drop.", detail: "An exhaustion move: price accelerates, often on news or speculation, then reverses quickly. The mirror at a low is a selling climax. Educational, not advice." },
  { id: "expanding-triangle", name: "Expanding triangle", category: "process", summary: "Another name for a broadening formation (megaphone): higher highs and lower lows.", detail: "Swings widen instead of narrowing, the opposite of a symmetrical triangle. It is a volatility warning rather than a direction; wait for a confirmed break. Educational, not advice." },
];

// ---------- Learn group "pattern-themes" ----------
type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, extra: Partial<QuizQuestion> = {}): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, glossaryTermId: "pattern-theme", ...extra };
}

export const THEME_QUESTIONS: QuizQuestion[] = [
  mc("PT-01", "How do candlestick patterns and chart patterns differ?", "B", "Candlestick patterns form over one to three bars from OHLC; chart patterns form over many bars or swings", ["They are the same thing under different names", "Chart patterns use only closing prices; candles use only volume", "Candlestick patterns only work on daily charts"], "Candles describe one to three bars of open, high, low and close; chart patterns describe broader structure over many bars or price swings. Both can inform the same decision."),
  mc("PT-02", "Dark Cloud Cover and a rising wedge are both bearish candidates. Which statement is right?", "C", "They belong to different categories: a two-candle reversal versus a multi-bar structure", ["They are both two-candle patterns", "A rising wedge is a candlestick pattern", "Dark Cloud Cover always appears at the end of a wedge"], "Dark Cloud Cover is a two-candle bearish-reversal candidate; a wedge is a multi-bar price structure. Different categories, overlapping information."),
  mc("PT-03", "Is there one official master list of pattern names?", "A", "No: textbooks and platforms use overlapping names, so themes help place any name", ["Yes, published by the exchanges", "Yes, every charting platform uses the same list", "No, so patterns cannot be learned"], "There is no single official list. The functional themes cover the common set; every familiar pattern fits one or more of them."),
  mc("PT-04", "A rectangle forms after a rally. Price then breaks the bottom of it. What happened to the continuation read?", "D", "It became a reversal: continuation is contextual and depends on which side breaks", ["Nothing; a rectangle in an uptrend is always bullish", "The pattern is invalid and should be ignored", "It became a measured move higher"], "The same rectangle or triangle can become a reversal if it breaks the opposite way. The break decides, not the label."),
  mc("PT-05", "A symmetrical triangle is narrowing toward its apex. What does the compression tell you?", "B", "Potential energy, not a direction; a confirmed break before or near the apex matters", ["Price will rise at the apex", "The apex is the price target", "Volatility will stay low for weeks"], "Compression signals potential energy, not guaranteed direction. The apex is not a price target.", { glossaryTermId: "pattern-theme" }),
  mc("PT-06", "Swings keep making higher highs and lower lows (a megaphone). Which theme is this?", "C", "Expansion: a volatility warning rather than a direction", ["Convergence", "Trend continuation", "Bullish reversal"], "Broadening formations / expanding triangles are the expansion theme: swings widen, and expansion is usually a volatility warning, not a direction.", { glossaryTermId: "expanding-triangle" }),
  mc("PT-07", "A hammer prints after a decline. Which theme is primary and what does it NOT prove?", "A", "Rejection of lower prices; on its own it does not prove a reversal", ["Momentum; it proves the trend has turned", "Continuation; it proves the decline will resume", "Gap; it proves an unfilled gap"], "A long lower wick shows an attempted move down failed. Rejection is evidence, not proof; the reversal read needs confirmation.", { patternKey: "hammer", highlightIndex: 2 }),
  mc("PT-08", "A doji appears after a strong impulse. What is the sensible response?", "D", "Treat indecision as a reason to wait for confirmation", ["Buy immediately", "Sell immediately", "Ignore it because dojis never matter"], "Indecision is neither bullish nor bearish by itself; it matters more after a one-sided move or at a level, and it is a reason to wait.", { patternKey: "doji" }),
  mc("PT-09", "Which pair best describes the momentum theme?", "B", "Marubozu and three white soldiers: wide bodies closing near an extreme", ["Spinning top and doji", "Inside bar and NR7", "Common gap and rectangle"], "Momentum shows as wide real bodies, closes near an extreme, or a series of directional candles. A late surge can also become exhaustion."),
  mc("PT-10", "A runaway gap appears in a strong uptrend. A trader insists it must fill before price can rise further. Best reply?", "C", "Not every gap fills; runaway gaps during strong trends often stay open", ["Correct: every gap fills within days", "Correct: only common gaps stay open", "Gaps are not part of any theme"], "Do not assume every gap must fill. Common gaps are usually filled quickly; breakaway and runaway gaps often are not.", { glossaryTermId: "gap-types" }),
  mc("PT-11", "Price breaks above a triangle, pulls back to the old upper line and bounces. Which theme describes the pullback?", "A", "Role reversal and retest: former resistance acting as support", ["Exhaustion", "Indecision", "Expansion"], "Former resistance may become support after a breakout. The retest is also called a pullback or throwback."),
  mc("PT-12", "Someone says a long sideways base 'shows accumulation'. What is the careful reading?", "B", "Accumulation is an interpretation; require a confirmed break of structure", ["Accumulation is visible directly in price", "It guarantees a rally", "It means the base will last exactly as long as the decline"], "Accumulation and distribution are interpretations, not facts visible from price alone; require a confirmed break of structure."),
  mc("PT-13", "A bull flag's pole is 8 points and it breaks out at 102. What is the measured-move reference?", "C", "About 110: the pole projected from the breakout, as a planning reference", ["102: the breakout itself", "94: the pole projected down", "Exactly 110, guaranteed"], "Flag or pennant: project the flagpole from the breakout. 102 + 8 = 110. A planning framework, not a promise."),
  mc("PT-14", "Price closes above resistance, then the next bar closes back inside the range and lower. What is this?", "D", "A bull trap (failed breakout); the failure itself is the signal", ["A runaway gap", "A confirmed breakout", "A common gap"], "Failure is a primary theme. A breakout that cannot hold traps the buyers who chased it; define invalidation before acting.", { patternKey: "failed-breakout", highlightIndex: 4, glossaryTermId: "bull-trap" }),
  mc("PT-15", "Which is NOT a confirmation idea?", "A", "A wick pokes through the level intraday and closes back inside", ["A bar closes beyond the boundary", "Later bars show follow-through", "Breakout volume is stronger than in the consolidation"], "Confirmation means a close beyond the boundary rather than merely piercing it intraday, follow-through, a retest that holds, and relevant volume, with entry, invalidation and size defined first."),
  mc("PT-16", "Put the practical hierarchy in order.", "B", "Context, location, theme, trigger, invalidation and risk", ["Trigger, theme, context, location, risk", "Theme, trigger, risk, context, location", "Risk, location, theme, context, trigger"], "First context (trending, ranging, compressing, expanding), then location (a meaningful level), then theme, then the trigger that confirms it, and finally where the setup is wrong and how much can be lost."),
  mc("PT-17", "An inside bar forms. Which bar sets the breakout levels, and what is measured?", "C", "The mother bar's full high and low, wicks included", ["The inside bar's body only", "The mother bar's body only", "The average of the last five closes"], "An inside bar sits entirely inside the prior (mother) bar's range including wicks; the mother bar's high and low are the boundaries.", { patternKey: "inside-bar", highlightIndex: 3, glossaryTermId: "inside-bar" }),
  mc("PT-18", "When is a pipe bottom valid?", "B", "Once price closes above the highest high of the two spike bars", ["As soon as the second spike prints", "When the two lows are exactly equal", "When volume is lower on the left spike"], "Two adjacent long downward spikes after a decline; it confirms on a close above the highest high in the pair. A close below the lower spike cancels it.", { patternKey: "pipe-bottom", highlightIndex: 4, glossaryTermId: "pipe-top-bottom" }),
];

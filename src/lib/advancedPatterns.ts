/**
 * Harami crosses, doji stars, high-wave / rickshaw man, and the advanced / rare textbook candlestick patterns
 * (Nison, Bulkowski): one table feeds the Archive (patterns.ts), the glossary (literacyTerms.ts), the sample
 * charts and drill specs (ohlcData.ts), the Learn questions (quizData.ts) and the Buy-or-Sell drill (buySellDrill.ts).
 * Type-only imports, so there is no runtime import cycle.
 */
import type { OHLC } from "./ohlcData";
import type { PatternDef, PatternSentiment } from "./patterns";
import type { LiteracyTerm } from "./literacyTerms";
import type { QuizOption, QuizQuestion } from "./quizData";

export const RARE_NOTE =
  "Advanced / rare: it shows up infrequently and is less reliable than the core patterns. Treat it as a clue and act only after confirmation.";

type Signal = "bullish reversal" | "bearish reversal" | "indecision";
type Family = "advanced-rare" | "harami" | "morning-star" | "evening-star" | "doji";

export interface AdvancedPattern {
  id: string;
  name: string;
  /** true = shown with the "Advanced / rare" tag and in the Advanced & Rare Learn group. */
  rare: boolean;
  family: Family;
  sentiment: PatternSentiment;
  confirmation: PatternDef["confirmation"];
  signal: Signal;
  /** One-line shape, used in the glossary summary and option descriptions. */
  short: string;
  /** Full shape description (identify prompt). */
  shape: string;
  /** What it means and what confirms it. */
  read: string;
  /** Extra warning (e.g. statistics that disagree with the textbook read). */
  caution?: string;
  /** Index of the pattern's last candle in `bars`. */
  end: number;
  /** Drill: "up"/"down" = add a confirming candle; "open" = wait case. */
  dir: "up" | "down" | "open";
  stop: string;
  /** Lookalike charts for the pick-the-chart question: [chart key, highlight index]. */
  lookalikes: Array<[string, number]>;
  /** Wrong answers for the name-it question (pattern ids). */
  confusers: string[];
  glossaryLink: string;
  bars: OHLC[];
}

const bars = (rows: Array<[number, number, number, number]>): OHLC[] =>
  rows.map(([open, high, low, close], i) => ({ name: String(i + 1), open, high, low, close }));

const DOWN_LEAD: Array<[number, number, number, number]> = [
  [65000, 65050, 64600, 64650],
  [64650, 64700, 64250, 64300],
];
const UP_LEAD: Array<[number, number, number, number]> = [
  [63000, 63400, 62950, 63350],
  [63350, 63750, 63300, 63700],
];

export const ADVANCED_PATTERNS: AdvancedPattern[] = [
  // ---------- core-family additions ----------
  {
    id: "bullish-harami-cross",
    name: "Bullish Harami Cross",
    rare: false,
    family: "harami",
    sentiment: "bullish",
    confirmation: "medium",
    signal: "bullish reversal",
    short: "Long red, then a doji inside the red body.",
    shape: "After a decline, a long red candle is followed by a doji whose whole body sits inside the red body.",
    read: "A harami whose second candle is a doji: selling momentum stalled even harder than in a normal harami. Bullish once a later candle closes above the doji's high.",
    end: 3,
    dir: "up",
    stop: "below the red candle's low",
    lookalikes: [["harami", 3], ["morning-doji-star", 3]],
    confusers: ["harami", "bearish-harami-cross", "morning-doji-star", "doji"],
    glossaryLink: "harami-cross",
    bars: bars([...DOWN_LEAD, [64300, 64350, 63500, 63550], [63900, 64000, 63800, 63905], [63905, 64350, 63880, 64300]]),
  },
  {
    id: "bearish-harami-cross",
    name: "Bearish Harami Cross",
    rare: false,
    family: "harami",
    sentiment: "bearish",
    confirmation: "medium",
    signal: "bearish reversal",
    short: "Long green, then a doji inside the green body.",
    shape: "After a rally, a long green candle is followed by a doji whose whole body sits inside the green body.",
    read: "A bearish harami whose second candle is a doji: buying momentum stalled. Bearish once a later candle closes below the doji's low.",
    end: 3,
    dir: "down",
    stop: "above the green candle's high",
    lookalikes: [["bearish-harami", 3], ["evening-doji-star", 3]],
    confusers: ["bearish-harami", "bullish-harami-cross", "evening-doji-star", "doji"],
    glossaryLink: "harami-cross",
    bars: bars([...UP_LEAD, [63700, 64550, 63650, 64500], [64100, 64200, 64000, 64095], [64095, 64120, 63650, 63700]]),
  },
  {
    id: "morning-doji-star",
    name: "Morning Doji Star",
    rare: false,
    family: "morning-star",
    sentiment: "bullish",
    confirmation: "high",
    signal: "bullish reversal",
    short: "Long red, a doji gapped below it, then a long green.",
    shape: "Downtrend: a long red candle, a doji that gaps below the red body, then a long green that closes above the red body's midpoint.",
    read: "A morning star whose middle candle is a doji, so the indecision at the low is clearer. Bullish reversal; the read fails on a close below the doji's low.",
    end: 4,
    dir: "up",
    stop: "below the doji's low",
    lookalikes: [["morning-star", 3], ["bullish-harami-cross", 3]],
    confusers: ["morning-star", "bullish-abandoned-baby", "bullish-harami-cross", "evening-doji-star"],
    glossaryLink: "doji-star",
    bars: bars([
      ...DOWN_LEAD,
      [64300, 64350, 63600, 63650],
      [63500, 63560, 63350, 63505],
      [63600, 64150, 63580, 64100],
      [64100, 64300, 64050, 64250],
    ]),
  },
  {
    id: "evening-doji-star",
    name: "Evening Doji Star",
    rare: false,
    family: "evening-star",
    sentiment: "bearish",
    confirmation: "high",
    signal: "bearish reversal",
    short: "Long green, a doji gapped above it, then a long red.",
    shape: "Uptrend: a long green candle, a doji that gaps above the green body, then a long red that closes below the green body's midpoint.",
    read: "An evening star whose middle candle is a doji. Bearish reversal; the read fails on a close above the doji's high.",
    end: 4,
    dir: "down",
    stop: "above the doji's high",
    lookalikes: [["evening-star", 3], ["bearish-harami-cross", 3]],
    confusers: ["evening-star", "bearish-abandoned-baby", "bearish-harami-cross", "morning-doji-star"],
    glossaryLink: "doji-star",
    bars: bars([
      ...UP_LEAD,
      [63700, 64450, 63650, 64400],
      [64550, 64650, 64440, 64545],
      [64450, 64470, 63900, 63950],
      [63950, 64000, 63700, 63750],
    ]),
  },
  {
    id: "high-wave",
    name: "High-Wave Candle",
    rare: false,
    family: "doji",
    sentiment: "neutral",
    confirmation: "low",
    signal: "indecision",
    short: "Small body, very long upper and lower shadows.",
    shape: "A small (not quite doji) body with very long upper and lower shadows, each several times the body.",
    read: "Extreme indecision: price swung hard both ways and went nowhere. After a long trend it warns the trend is losing control. Wait for a close beyond its high or low.",
    end: 3,
    dir: "open",
    stop: "beyond whichever end of the range breaks",
    lookalikes: [["spinning-top", 2], ["long-legged-doji", 3]],
    confusers: ["spinning-top", "long-legged-doji", "rickshaw-man", "hammer"],
    glossaryLink: "high-wave",
    bars: bars([
      [64000, 64200, 63850, 64100],
      [64100, 64250, 63900, 63950],
      [63950, 64150, 63850, 64050],
      [64050, 64600, 63400, 63900],
      [63900, 64150, 63800, 64100],
    ]),
  },
  {
    id: "rickshaw-man",
    name: "Rickshaw Man",
    rare: false,
    family: "doji",
    sentiment: "neutral",
    confirmation: "low",
    signal: "indecision",
    short: "Long-legged doji with the open/close in the middle of the range.",
    shape: "A doji (open ≈ close) with very long shadows both ways, and the open/close sitting near the middle of the range.",
    read: "A centered long-legged doji: buyers and sellers fought to an exact draw. Indecision; let the next candle choose a direction.",
    end: 3,
    dir: "open",
    stop: "beyond whichever end of the range breaks",
    lookalikes: [["high-wave", 3], ["gravestone-doji", 3]],
    confusers: ["long-legged-doji", "high-wave", "dragonfly-doji", "gravestone-doji"],
    glossaryLink: "rickshaw-man",
    bars: bars([
      ...UP_LEAD,
      [63700, 64050, 63550, 64000],
      [64000, 64500, 63500, 64005],
      [64005, 64100, 63700, 63750],
    ]),
  },
  {
    id: "double-doji",
    name: "Double Doji",
    rare: false,
    family: "doji",
    sentiment: "neutral",
    confirmation: "low",
    signal: "indecision",
    short: "Two dojis in a row: extended indecision.",
    shape: "Two consecutive dojis (open ≈ close on each), often with wicks. Colour of the tiny bodies does not matter.",
    read: "One doji is hesitation; two in a row says neither side can hold a close. After a long move it warns the trend is stalling. Wait for a decisive close beyond the pair's high or low — do not treat the pair itself as a reversal.",
    end: 4,
    dir: "open",
    stop: "beyond whichever end of the two-doji range breaks",
    lookalikes: [["doji", 2], ["long-legged-doji", 3]],
    confusers: ["doji", "spinning-top", "bullish-tri-star", "high-wave"],
    glossaryLink: "double-doji",
    bars: bars([
      ...DOWN_LEAD,
      [64300, 64400, 64000, 64050],
      [64050, 64180, 63920, 64055],
      [64050, 64160, 63940, 64048],
      [64048, 64350, 64000, 64300],
    ]),
  },
  {
    id: "tweezer-star",
    name: "Tweezer Star",
    rare: false,
    family: "advanced-rare",
    sentiment: "bearish",
    confirmation: "medium",
    signal: "bearish reversal",
    short: "A tweezer top whose second candle is a shooting star.",
    shape: "After a rally, a green candle is followed by a shooting star (small body near the low, long upper wick) whose high matches the green candle's high.",
    read: "Buyers pushed to the same high twice and the second push was sold back down inside the bar: double rejection at one price. Bearish once a red candle closes below the shooting star's low; the read fails on a close above the shared high.",
    end: 3,
    dir: "down",
    stop: "above the shared high",
    lookalikes: [["tweezer-top", 4], ["shooting-star", 2]],
    confusers: ["tweezer-top", "shooting-star", "bearish-engulfing", "evening-star"],
    glossaryLink: "wick-rejection",
    bars: bars([...UP_LEAD, [63700, 64400, 63650, 64300], [64250, 64400, 64180, 64200], [64180, 64220, 63850, 63900]]),
  },
  // ---------- advanced / rare ----------
  {
    id: "stick-sandwich",
    name: "Stick Sandwich",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "Red, green, red, with both reds closing at the same price.",
    shape: "Downtrend: a red candle, a green candle that trades above it, then a red candle that closes at the same price as the first red.",
    read: "The two equal closes mark a support price that held twice (the green is the 'meat' in the sandwich). Bullish once price closes above the middle green.",
    end: 4,
    dir: "up",
    stop: "below the matching closes",
    lookalikes: [["tweezer-bottom", 4], ["matching-low", 3]],
    confusers: ["tweezer-bottom", "matching-low", "homing-pigeon", "piercing-line"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      ...DOWN_LEAD,
      [64300, 64350, 63750, 63800],
      [63900, 64450, 63850, 64400],
      [64450, 64500, 63780, 63800],
      [63800, 64200, 63750, 64150],
    ]),
  },
  {
    id: "homing-pigeon",
    name: "Homing Pigeon",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "Two reds; the second red body sits inside the first.",
    shape: "Downtrend: a long red candle, then a smaller red candle whose body sits entirely inside the first red body.",
    read: "Like a bullish harami, but both candles are red: selling continued but with less force. Textbook read is a bullish reversal once a later candle closes above the pattern.",
    caution: "Statistical studies (e.g. Bulkowski) found it often just continues lower, so never act without confirmation.",
    end: 3,
    dir: "up",
    stop: "below the second red's low",
    lookalikes: [["harami", 3], ["matching-low", 3]],
    confusers: ["harami", "matching-low", "stick-sandwich", "in-neck"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([...DOWN_LEAD, [64300, 64350, 63550, 63600], [64100, 64200, 63700, 63750], [63750, 64150, 63700, 64100]]),
  },
  {
    id: "ladder-bottom",
    name: "Ladder Bottom",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "medium",
    signal: "bullish reversal",
    short: "Three falling reds, a red with an upper shadow, then a gap-up green.",
    shape: "After a decline: three red candles with lower closes, a fourth red that shows an upper shadow, then a green that opens above the fourth candle's body and closes higher.",
    read: "The fourth candle's upper shadow is the first sign of buying; the gap-up green confirms buyers stepped in. Bullish reversal.",
    end: 5,
    dir: "up",
    stop: "below the fourth red's low",
    lookalikes: [["three-black-crows", 3], ["concealing-baby-swallow", 4]],
    confusers: ["three-black-crows", "concealing-baby-swallow", "identical-three-crows", "bullish-breakaway"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      [65400, 65450, 65100, 65150],
      [65150, 65200, 64650, 64700],
      [64650, 64700, 64200, 64250],
      [64200, 64250, 63750, 63800],
      [63750, 64050, 63450, 63500],
      [63850, 64300, 63800, 64250],
      [64250, 64450, 64200, 64400],
    ]),
  },
  {
    id: "concealing-baby-swallow",
    name: "Concealing Baby Swallow",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "Two red marubozus, a gapped red with an upper shadow, then a red that engulfs it.",
    shape: "Downtrend: two red marubozus, a third red that gaps down but has an upper shadow reaching into the second body, then a fourth red marubozu that engulfs the third, shadows included.",
    read: "Four red candles look bearish, but the third candle's upper shadow and the failure to keep falling hint that selling is exhausting. Textbook bullish reversal; it is very rare and needs a green confirmation.",
    end: 4,
    dir: "up",
    stop: "below the fourth red's low",
    lookalikes: [["ladder-bottom", 5], ["identical-three-crows", 5]],
    confusers: ["ladder-bottom", "three-black-crows", "identical-three-crows", "bearish-engulfing"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      [65200, 65250, 64850, 64900],
      [64900, 64900, 64400, 64400],
      [64400, 64400, 63900, 63900],
      [63700, 64100, 63600, 63650],
      [64150, 64150, 63550, 63550],
      [63550, 64000, 63500, 63950],
    ]),
  },
  {
    id: "unique-three-river-bottom",
    name: "Unique Three River Bottom",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "Long red, a red harami with a new low, then a small green below it.",
    shape: "Downtrend: a long red, then a smaller red whose body sits inside the first but whose lower shadow makes a new low, then a small green whose body sits below the second candle's close.",
    read: "The new low was rejected (long lower shadow) and the small green shows sellers are stalling. Mild bullish reversal once price closes above the pattern.",
    end: 4,
    dir: "up",
    stop: "below the second candle's low",
    lookalikes: [["morning-star", 3], ["three-stars-in-the-south", 4]],
    confusers: ["morning-star", "three-stars-in-the-south", "harami", "homing-pigeon"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      ...DOWN_LEAD,
      [64300, 64350, 63600, 63650],
      [64000, 64050, 63200, 63800],
      [63650, 63750, 63550, 63700],
      [63700, 64100, 63650, 64050],
    ]),
  },
  {
    id: "advance-block",
    name: "Advance Block",
    rare: true,
    family: "advanced-rare",
    sentiment: "bearish",
    confirmation: "low",
    signal: "bearish reversal",
    short: "Three greens with shrinking bodies and growing upper shadows.",
    shape: "Uptrend: three green candles, each opening inside the prior body, but each body is smaller and each upper shadow longer.",
    read: "Looks like three white soldiers, but the rally is losing force and sellers push back at every high. A warning that the advance may stall; bearish once a red closes below the third candle.",
    caution: "Statistical studies found it often resolves upward instead, so treat it as a warning to tighten stops, not a short signal on its own.",
    end: 3,
    dir: "down",
    stop: "above the third candle's high",
    lookalikes: [["three-white-soldiers", 3], ["deliberation", 3]],
    confusers: ["three-white-soldiers", "deliberation", "identical-three-crows", "three-inside-up"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      [63000, 63200, 62950, 63150],
      [63150, 63700, 63100, 63650],
      [63500, 63950, 63450, 63850],
      [63750, 64150, 63700, 63950],
      [63950, 64000, 63600, 63650],
    ]),
  },
  {
    id: "deliberation",
    name: "Deliberation (Stalled Pattern)",
    rare: true,
    family: "advanced-rare",
    sentiment: "bearish",
    confirmation: "low",
    signal: "bearish reversal",
    short: "Two long greens, then a small green at the top.",
    shape: "Uptrend: two long green candles, then a small green (a spinning top or star) that opens at or above the second close.",
    read: "Buyers 'deliberate': the third small body shows the rally stalling after two strong candles. Bearish once a red closes below the small candle.",
    caution: "Statistical studies found it often continues higher, so wait for the red confirmation.",
    end: 3,
    dir: "down",
    stop: "above the small candle's high",
    lookalikes: [["evening-star", 3], ["advance-block", 3]],
    confusers: ["advance-block", "evening-star", "three-white-soldiers", "spinning-top"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      [63000, 63200, 62950, 63150],
      [63150, 63650, 63100, 63600],
      [63600, 64150, 63550, 64100],
      [64120, 64250, 64080, 64180],
      [64180, 64200, 63800, 63850],
    ]),
  },
  {
    id: "matching-low",
    name: "Matching Low",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "Two reds in a downtrend that close at the same price.",
    shape: "Downtrend: a long red candle, then a second red that closes at the same price as the first.",
    read: "Two equal closes mark short-term support: sellers could not close lower. Bullish once price closes above the second red.",
    end: 3,
    dir: "up",
    stop: "below the second red's low",
    lookalikes: [["tweezer-bottom", 4], ["homing-pigeon", 3]],
    confusers: ["tweezer-bottom", "stick-sandwich", "homing-pigeon", "on-neck"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([...DOWN_LEAD, [64300, 64350, 63650, 63700], [64000, 64050, 63680, 63700], [63700, 64100, 63650, 64050]]),
  },
  {
    id: "three-stars-in-the-south",
    name: "Three Stars in the South",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "Three shrinking reds with higher lows; the last a tiny marubozu.",
    shape: "Downtrend: a long red with a long lower shadow, a smaller red whose low stays above the first low, then a tiny red marubozu inside the second candle's range.",
    read: "Each red is smaller and the lows stop falling: selling pressure is draining away. Bullish reversal once a green closes above the pattern.",
    end: 4,
    dir: "up",
    stop: "below the first candle's low",
    lookalikes: [["unique-three-river-bottom", 4], ["three-black-crows", 3]],
    confusers: ["unique-three-river-bottom", "three-black-crows", "bullish-tri-star", "ladder-bottom"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      ...DOWN_LEAD,
      [64300, 64320, 63500, 63800],
      [64000, 64050, 63650, 63850],
      [63830, 63830, 63720, 63720],
      [63720, 64100, 63700, 64050],
    ]),
  },
  {
    id: "identical-three-crows",
    name: "Identical Three Crows",
    rare: true,
    family: "advanced-rare",
    sentiment: "bearish",
    confirmation: "high",
    signal: "bearish reversal",
    short: "Three long reds, each opening at the prior close.",
    shape: "After a rally: three long red candles, each opening at (or very near) the previous candle's close and closing near its low.",
    read: "A stricter three black crows: with no bounce at the open, sellers stayed in control from close to close. Bearish reversal.",
    end: 5,
    dir: "down",
    stop: "above the first crow's open",
    lookalikes: [["three-black-crows", 3], ["concealing-baby-swallow", 4]],
    confusers: ["three-black-crows", "concealing-baby-swallow", "advance-block", "falling-three-methods"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      ...UP_LEAD,
      [63700, 64200, 63650, 64150],
      [64150, 64170, 63700, 63720],
      [63720, 63740, 63300, 63320],
      [63320, 63340, 62900, 62920],
      [62920, 63100, 62800, 62850],
    ]),
  },
  {
    id: "takuri-line",
    name: "Takuri Line",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "Hammer with an extra-long lower shadow (3×+ the body).",
    shape: "After a decline, a candle with a tiny body at the top of its range, almost no upper shadow, and a lower shadow at least three times the body (longer than a typical hammer's).",
    read: "An extreme hammer: sellers pushed far down and buyers took it all back. Bullish reversal once the next candle closes above it.",
    end: 3,
    dir: "up",
    stop: "below the takuri's low",
    lookalikes: [["hammer", 2], ["dragonfly-doji", 3]],
    confusers: ["hammer", "dragonfly-doji", "hanging-man", "high-wave"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([...DOWN_LEAD, [64300, 64350, 63900, 63950], [63950, 63960, 63250, 63900], [63900, 64250, 63850, 64200]]),
  },
  {
    id: "last-engulfing-bottom",
    name: "Last Engulfing Bottom",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "At a low: a small green, then a red that engulfs it, then up.",
    shape: "Downtrend: a small green candle, then a red candle whose body engulfs the green body (a bearish engulfing shape at the low).",
    read: "Counterintuitive: the 'last' engulfing at the end of a decline often marks selling exhaustion. Bullish only once a green closes above the red's high.",
    caution: "It looks bearish, so this is the textbook case of letting confirmation, not the shape, decide.",
    end: 3,
    dir: "up",
    stop: "below the red candle's low",
    lookalikes: [["engulfing", 2], ["bearish-engulfing", 2]],
    confusers: ["bearish-engulfing", "bullish-engulfing", "last-engulfing-top", "dark-cloud-cover"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([...DOWN_LEAD, [64300, 64450, 64250, 64400], [64450, 64500, 63900, 63950], [63950, 64300, 63900, 64250]]),
  },
  {
    id: "last-engulfing-top",
    name: "Last Engulfing Top",
    rare: true,
    family: "advanced-rare",
    sentiment: "bearish",
    confirmation: "low",
    signal: "bearish reversal",
    short: "At a high: a small red, then a green that engulfs it, then down.",
    shape: "Uptrend: a small red candle, then a green candle whose body engulfs the red body (a bullish engulfing shape at the high).",
    read: "Counterintuitive: the 'last' engulfing at the end of a rally often marks buying exhaustion. Bearish only once a red closes below the green's low.",
    caution: "It looks bullish, so wait for confirmation before acting on it.",
    end: 3,
    dir: "down",
    stop: "above the green candle's high",
    lookalikes: [["bearish-engulfing", 2], ["engulfing", 2]],
    confusers: ["bullish-engulfing", "bearish-engulfing", "last-engulfing-bottom", "piercing-line"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([...UP_LEAD, [63700, 63750, 63550, 63600], [63550, 64100, 63500, 64050], [64050, 64100, 63700, 63750]]),
  },
  {
    id: "above-the-stomach",
    name: "Above the Stomach",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "low",
    signal: "bullish reversal",
    short: "Red, then a green that opens and closes above the red body's midpoint.",
    shape: "Downtrend: a red candle, then a green candle that opens at or above the red body's midpoint and closes higher.",
    read: "Buyers took over from the middle of the red body without any gap down first (unlike a piercing line). Bullish once confirmed.",
    end: 3,
    dir: "up",
    stop: "below the red candle's low",
    lookalikes: [["piercing-line", 3], ["engulfing", 2]],
    confusers: ["piercing-line", "bullish-engulfing", "bullish-counterattack", "below-the-stomach"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([...DOWN_LEAD, [64300, 64350, 63700, 63750], [64050, 64400, 64000, 64350], [64350, 64500, 64300, 64450]]),
  },
  {
    id: "below-the-stomach",
    name: "Below the Stomach",
    rare: true,
    family: "advanced-rare",
    sentiment: "bearish",
    confirmation: "low",
    signal: "bearish reversal",
    short: "Green, then a red that opens and closes below the green body's midpoint.",
    shape: "Uptrend: a green candle, then a red candle that opens at or below the green body's midpoint and closes lower.",
    read: "Sellers took over from the middle of the green body without a gap up first (unlike dark cloud cover). Bearish once confirmed.",
    end: 3,
    dir: "down",
    stop: "above the green candle's high",
    lookalikes: [["dark-cloud-cover", 3], ["bearish-engulfing", 2]],
    confusers: ["dark-cloud-cover", "bearish-engulfing", "bearish-counterattack", "above-the-stomach"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([...UP_LEAD, [63700, 64300, 63650, 64250], [63950, 64000, 63600, 63650], [63650, 63700, 63450, 63500]]),
  },
  {
    id: "bullish-hikkake",
    name: "Bullish Hikkake",
    rare: true,
    family: "advanced-rare",
    sentiment: "bullish",
    confirmation: "medium",
    signal: "bullish reversal",
    short: "Inside bar, a false break lower, then a close above the inside bar.",
    shape: "An inside bar (range inside the prior candle), then a candle that breaks below the inside bar's low, then within a few candles a close back above the inside bar's high.",
    read: "A trap: traders who sold the breakdown are caught when price reverses up through the inside bar. Bullish once the close above the inside high happens.",
    end: 5,
    dir: "up",
    stop: "below the false break's low",
    lookalikes: [["harami", 3], ["bearish-hikkake", 5]],
    confusers: ["bearish-hikkake", "harami", "three-inside-up", "bull-flag"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      [64800, 64900, 64500, 64550],
      [64550, 64600, 64150, 64200],
      [64200, 64300, 63700, 63800],
      [63850, 64100, 63800, 64050],
      [64000, 64050, 63650, 63700],
      [63750, 64250, 63700, 64200],
      [64200, 64400, 64150, 64350],
    ]),
  },
  {
    id: "bearish-hikkake",
    name: "Bearish Hikkake",
    rare: true,
    family: "advanced-rare",
    sentiment: "bearish",
    confirmation: "medium",
    signal: "bearish reversal",
    short: "Inside bar, a false break higher, then a close below the inside bar.",
    shape: "An inside bar (range inside the prior candle), then a candle that breaks above the inside bar's high, then within a few candles a close back below the inside bar's low.",
    read: "A trap: traders who bought the breakout are caught when price reverses down through the inside bar. Bearish once the close below the inside low happens.",
    end: 5,
    dir: "down",
    stop: "above the false break's high",
    lookalikes: [["bearish-harami", 3], ["bullish-hikkake", 5]],
    confusers: ["bullish-hikkake", "bearish-harami", "three-inside-down", "evening-star"],
    glossaryLink: "advanced-rare-patterns",
    bars: bars([
      [63200, 63500, 63100, 63450],
      [63450, 63850, 63400, 63800],
      [63800, 64300, 63700, 64200],
      [64150, 64200, 63900, 63950],
      [64000, 64350, 63950, 64300],
      [64250, 64300, 63800, 63850],
      [63850, 63900, 63600, 63650],
    ]),
  },
];

const BY_ID = Object.fromEntries(ADVANCED_PATTERNS.map((p) => [p.id, p]));

/** Names / shapes of existing patterns used as wrong answers. */
const EXISTING: Record<string, [string, string]> = {
  harami: ["Bullish Harami", "Long red, then a small green body inside it."],
  "bearish-harami": ["Bearish Harami", "Long green, then a small red body inside it."],
  doji: ["Doji", "Open ≈ close; a cross shape."],
  "morning-star": ["Morning Star", "Long red, small star, long green."],
  "evening-star": ["Evening Star", "Long green, small star, long red."],
  "bullish-abandoned-baby": ["Bullish Abandoned Baby", "Island doji with gaps on both sides at a low."],
  "bearish-abandoned-baby": ["Bearish Abandoned Baby", "Island doji with gaps on both sides at a high."],
  "spinning-top": ["Spinning Top", "Small body, moderate wicks both ways."],
  "long-legged-doji": ["Long-Legged Doji", "Doji with long wicks both ways."],
  "dragonfly-doji": ["Dragonfly Doji", "T shape: long lower wick, close at the high."],
  "gravestone-doji": ["Gravestone Doji", "Upside-down T: long upper wick, close at the low."],
  hammer: ["Hammer", "Small body on top, lower wick about 2× the body."],
  "hanging-man": ["Hanging Man", "Hammer shape after a rally."],
  "tweezer-bottom": ["Tweezer Bottom", "Two candles with matching lows."],
  "piercing-line": ["Piercing Line", "Gap down, green closes above the red midpoint."],
  "dark-cloud-cover": ["Dark Cloud Cover", "Gap up, red closes below the green midpoint."],
  "in-neck": ["In-Neck", "Green bounce closes just inside the red body."],
  "on-neck": ["On-Neck", "Green bounce closes at the red's low."],
  "three-black-crows": ["Three Black Crows", "Three long reds, each opening inside the prior body."],
  "three-white-soldiers": ["Three White Soldiers", "Three long greens, each closing higher."],
  "three-inside-up": ["Three Inside Up", "Bullish harami plus a confirming close."],
  "three-inside-down": ["Three Inside Down", "Bearish harami plus a confirming close."],
  "bullish-breakaway": ["Bullish Breakaway", "Gap down, drift lower, green closes into the gap."],
  "bullish-tri-star": ["Bullish Tri-Star", "Three dojis at a low."],
  engulfing: ["Bullish Engulfing", "Green body engulfs the prior red body."],
  "bullish-engulfing": ["Bullish Engulfing", "Green body engulfs the prior red body."],
  "bearish-engulfing": ["Bearish Engulfing", "Red body engulfs the prior green body."],
  "bullish-counterattack": ["Bullish Counterattack", "Green opens far lower, closes at the red's close."],
  "bearish-counterattack": ["Bearish Counterattack", "Red opens far higher, closes at the green's close."],
  "falling-three-methods": ["Falling Three Methods", "Long red, small bounce, long red."],
  "bull-flag": ["Bull Flag", "Sharp rise, tight pullback, breakout."],
  "tweezer-top": ["Tweezer Top", "Two candles with matching highs after a rally."],
  "shooting-star": ["Shooting Star", "Small body at the low, long upper wick after a rally."],
};

function nameOf(id: string): [string, string] {
  const a = BY_ID[id];
  if (a) return [a.name, a.short];
  const e = EXISTING[id];
  if (!e) throw new Error(`advancedPatterns: no name for ${id}`);
  return e;
}

// ---------- Archive + glossary ----------
const tag = (p: AdvancedPattern) => (p.rare ? "Advanced / rare. " : "");

export const ADVANCED_PATTERN_DEFS: Array<PatternDef & { rare?: boolean }> = [
  ...ADVANCED_PATTERNS.map((p) => ({
    id: p.id,
    name: p.name,
    type: (p.signal === "indecision" ? "neutral" : "reversal") as PatternDef["type"],
    sentiment: p.sentiment,
    confirmation: p.confirmation,
    description: `${tag(p)}${p.shape} ${p.read}${p.caution ? ` ${p.caution}` : ""}${p.rare ? " Infrequent and less reliable than the core patterns." : ""}`,
    rare: p.rare || undefined,
  })),
  {
    id: "triple-top",
    name: "Triple Top",
    type: "reversal",
    sentiment: "bearish",
    confirmation: "high",
    description:
      "Three peaks at about the same price with two dips between: resistance rejected buyers three times. The neckline is the lowest dip. Confirmed only by a close below the neckline; the old neckline then often acts as resistance on a retest. A close back above the tops cancels it.",
  },
  {
    id: "triple-bottom",
    name: "Triple Bottom",
    type: "reversal",
    sentiment: "bullish",
    confirmation: "high",
    description:
      "Three troughs at about the same price with two bounces between: support held three times. The neckline is the highest bounce. Confirmed only by a close above the neckline; the old neckline then often acts as support on a retest. A close back below the lows cancels it.",
  },
];

export const ADVANCED_TERMS: LiteracyTerm[] = [
  ...ADVANCED_PATTERNS.map((p) => ({
    id: p.id,
    name: p.name,
    category: "process" as const,
    summary: `${p.rare ? "Advanced / rare. " : ""}${p.short}`,
    detail: `${p.shape} ${p.read}${p.caution ? ` ${p.caution}` : ""} Stop idea: ${p.stop}.${p.rare ? ` ${RARE_NOTE}` : ""} SAMPLE educational definition, not trading advice.`,
  })),
  {
    id: "triple-top",
    name: "Triple Top",
    category: "process",
    summary: "Three equal highs; bearish once price closes below the neckline.",
    detail:
      "Like a double top with one more failed test of resistance. Neckline = the lowest dip between the tops. Until a close below it, it is only a range. After the break, a retest of the neckline from below that fails is a classic sell trigger. SAMPLE educational definition.",
  },
  {
    id: "triple-bottom",
    name: "Triple Bottom",
    category: "process",
    summary: "Three equal lows; bullish once price closes above the neckline.",
    detail:
      "Like a double bottom with one more successful test of support. Neckline = the highest bounce between the lows. Until a close above it, it is only a range. After the break, a retest of the neckline from above that holds is a classic buy trigger. SAMPLE educational definition.",
  },
  {
    id: "harami-cross",
    name: "Harami Cross",
    category: "process",
    summary: "A harami whose second candle is a doji.",
    detail:
      "Bullish after a decline (long red, then a doji inside it), bearish after a rally (long green, then a doji inside it). The doji makes the stall clearer than a plain harami, but the next candle still has to confirm.",
  },
  {
    id: "doji-star",
    name: "Doji Star",
    category: "process",
    summary: "A doji that gaps away from a long candle; the middle of morning/evening doji stars.",
    detail:
      "Morning doji star: long red, doji gapped below, long green into the red body. Evening doji star: long green, doji gapped above, long red into the green body. A doji star alone is only a warning; the third candle confirms.",
  },
  {
    // Own id: "high-wave" is already the generated High-Wave Candle term above.
    id: "high-wave-and-rickshaw-man",
    name: "High-Wave & Rickshaw Man",
    category: "process",
    summary: "Very long shadows both ways around a small body: extreme indecision.",
    detail:
      "High-wave candle: small (not quite doji) body with very long shadows. Rickshaw man: a long-legged doji with the open/close in the middle of the range. Both say neither side won; wait for a close beyond the range.",
  },
  {
    id: "wedge",
    name: "Rising & Falling Wedge",
    category: "process",
    summary: "Two converging lines sloping the same way: the trend is tiring.",
    detail:
      "Rising wedge: both lines slope up, the lower one steeper; usually bearish, confirmed by a close below the lower line. Falling wedge: both lines slope down, the upper one steeper; usually bullish, confirmed by a close above the upper line. A close through the other line cancels the read.",
  },
  {
    id: "belt-hold",
    name: "Belt Hold",
    category: "process",
    summary: "Japanese name for the opening marubozu at the start of a reversal.",
    detail:
      "Bullish belt hold: after a decline, a long green that opens at its low (no lower shadow) and closes near the high. Bearish belt hold: after a rally, a long red that opens at its high (no upper shadow) and closes near the low. Same shape as the bullish / bearish opening marubozu in the Archive; the belt-hold name stresses the prior trend it reverses.",
  },
  {
    id: "advanced-rare-patterns",
    name: "Advanced / Rare Patterns",
    category: "process",
    summary: "Textbook patterns that appear rarely and are less reliable.",
    detail:
      "Stick sandwich, homing pigeon, ladder bottom, concealing baby swallow, unique three river bottom, advance block, deliberation, matching low, three stars in the south, identical three crows, takuri line, last engulfing top/bottom, above/below the stomach and hikkake. They are worth recognising, but they are infrequent, often fail, and should only be acted on after confirmation and at a meaningful level.",
  },
];

// ---------- charts + drill specs (consumed by ohlcData.ts) ----------
export const ADVANCED_OHLC: Record<string, OHLC[]> = Object.fromEntries(ADVANCED_PATTERNS.map((p) => [p.id, p.bars]));

export const ADVANCED_DRILL_SPECS: ReadonlyArray<{ key: string; end: number; dir: "up" | "down" | "open" }> =
  ADVANCED_PATTERNS.map((p) => ({ key: p.id, end: p.end, dir: p.dir }));

/** Drill INFO rows for the directional entries (same shape as buySellDrill's PatternInfo). */
export const ADVANCED_DRILL_INFO: Record<string, { name: string; kind: string; why: string; stop: string; term: string }> =
  Object.fromEntries(
    ADVANCED_PATTERNS.filter((p) => p.dir !== "open").map((p) => [
      p.id,
      {
        name: p.name,
        kind: p.rare ? `${p.signal}, advanced / rare` : p.signal,
        why: `${p.read}${p.rare ? " Advanced / rare: infrequent and less reliable, so the confirmation candle carries most of the weight." : ""}`,
        stop: p.stop,
        term: p.id,
      },
    ])
  );

// ---------- Learn questions ----------
type OptId = "A" | "B" | "C" | "D" | "E";
const IDS: OptId[] = ["A", "B", "C", "D", "E"];

/** Put the correct item at `pos` (rotates through positions so the answer letter varies). */
function place<T>(correct: T, others: T[], pos: number): T[] {
  const out = [...others];
  out.splice(pos % (others.length + 1), 0, correct);
  return out;
}

const SIGNALS = ["Bullish reversal", "Bearish reversal", "Indecision (wait)", "Bullish continuation", "Bearish continuation"];
const SIGNAL_DESC = [
  "A decline may be ending; look for a higher close.",
  "A rally may be ending; look for a lower close.",
  "Neither side won; wait for a close beyond the range.",
  "A pause inside an uptrend before more upside.",
  "A pause inside a downtrend before more downside.",
];
const SIGNAL_LABEL: Record<Signal, string> = {
  "bullish reversal": "Bullish reversal",
  "bearish reversal": "Bearish reversal",
  indecision: "Indecision (wait)",
};

function prefix(p: AdvancedPattern): string {
  if (p.rare) return "AR";
  if (p.family === "harami") return "PB-HC";
  if (p.family === "doji") return "PB-HW";
  return "PB-DS";
}

function patternQuestions(p: AdvancedPattern, n: number): QuizQuestion[] {
  const id = `${prefix(p)}-${p.id}`;
  const rareTail = p.rare ? ` ${RARE_NOTE}` : "";
  const charts = place<[string, number]>([p.id, p.end], p.lookalikes, n);
  const correctChart = IDS[charts.findIndex(([k]) => k === p.id)];
  const nameRows = place<string>(p.id, p.confusers, n + 1);
  const correctName = IDS[nameRows.indexOf(p.id)];
  const sigCorrect = IDS[SIGNALS.indexOf(SIGNAL_LABEL[p.signal])];
  const lookNames = p.lookalikes.map(([k]) => nameOf(k)[0]).join(" and ");
  return [
    {
      id: `${id}-PICK`,
      prompt: `Which chart shows a ${p.name} ending at the marked candle?${p.rare ? " (Advanced / rare)" : ""}`,
      correctAnswer: correctChart,
      options: charts.map(([chartKey, hi], i) => ({
        id: IDS[i],
        label: String(i + 1),
        description: "Select this chart",
        chartKey,
        chartHighlightIndex: hi,
      })),
      optionsAreCharts: true,
      explanation: `Chart ${IDS.indexOf(correctChart) + 1}. ${p.shape} The other charts show ${lookNames}.${rareTail}`,
      patternKey: p.id,
      highlightIndex: p.end,
      glossaryTermId: p.id,
    },
    {
      id: `${id}-NAME`,
      prompt: `${p.shape} Name it.`,
      correctAnswer: correctName,
      options: nameRows.map((k, i) => ({ id: IDS[i], label: nameOf(k)[0], description: nameOf(k)[1] })) as QuizOption[],
      explanation: `${p.name}. ${p.read}${p.caution ? ` ${p.caution}` : ""}${rareTail}`,
      patternKey: p.id,
      highlightIndex: p.end,
      glossaryTermId: p.id,
    },
    {
      id: `${id}-READ`,
      prompt: `The marked candles form a ${p.name}. What is its textbook read?`,
      correctAnswer: sigCorrect,
      options: SIGNALS.map((label, i) => ({ id: IDS[i], label, description: SIGNAL_DESC[i] })) as QuizOption[],
      explanation: `${SIGNAL_LABEL[p.signal]}. ${p.read} Stop idea: ${p.stop}.${p.caution ? ` ${p.caution}` : ""}${rareTail}`,
      patternKey: p.id,
      highlightIndex: p.end,
      glossaryTermId: p.id,
    },
  ];
}

const CONCEPT: QuizQuestion[] = [
  {
    id: "AR-CONCEPT-01",
    prompt: "This chart shows a ladder bottom, one of the advanced / rare patterns. How should a rare pattern like this be used?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "As a strong signal", description: "Rare means special, so act on it right away." },
      { id: "B", label: "As a clue that needs confirmation", description: "Infrequent and less tested: wait for confirmation at a meaningful level." },
      { id: "C", label: "Ignore it completely", description: "Rare patterns never mean anything." },
      { id: "D", label: "Only trade it against the trend", description: "Rare patterns always mean the opposite." },
    ],
    explanation: `As a clue that needs confirmation. ${RARE_NOTE} Ignoring it throws away information; acting on it alone over-trusts a small sample.`,
    patternKey: "ladder-bottom",
    highlightIndex: 5,
    glossaryTermId: "advanced-rare-patterns",
  },
  {
    id: "AR-CONCEPT-02",
    prompt: "Last engulfing bottom vs bullish engulfing: which statement is right?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "They are the same pattern", description: "Both are a green body engulfing a red body." },
      { id: "B", label: "Last engulfing bottom is bearish", description: "A red engulfing body always means lower." },
      { id: "C", label: "Last engulfing bottom is a red engulfing at a low, read bullish after confirmation", description: "The shape looks bearish; the location and the next close decide." },
      { id: "D", label: "Neither needs a prior trend", description: "Engulfing shapes work anywhere." },
    ],
    explanation:
      "Last engulfing bottom is a red engulfing at a low, read bullish after confirmation. A bullish engulfing is the opposite shape (green engulfs red). Both need a prior decline. Advanced / rare: confirm first.",
    patternKey: "last-engulfing-bottom",
    highlightIndex: 3,
    glossaryTermId: "last-engulfing-bottom",
  },
  {
    id: "AR-CONCEPT-03",
    prompt: "Hikkake: why does the false break matter?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "It traps traders on the wrong side", description: "When price reverses through the inside bar, their exits fuel the move." },
      { id: "B", label: "It confirms the breakout", description: "A break of the inside bar is always the real move." },
      { id: "C", label: "It has no effect", description: "Inside bars are just noise." },
    ],
    explanation:
      "It traps traders on the wrong side. In a bullish hikkake, sellers who shorted the break below the inside bar must buy back when price closes above the inside high. Advanced / rare: confirm first.",
    patternKey: "bullish-hikkake",
    highlightIndex: 5,
    glossaryTermId: "bullish-hikkake",
  },
];

/** Belt hold = opening marubozu with a prior trend; cross-linked, not duplicated. */
const BELT_HOLD: QuizQuestion[] = [
  {
    id: "PB-BELT-01",
    prompt: "After a decline, a long green candle opens at its low (no lower shadow) and closes near its high. What is the Japanese name for this reversal candle?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Takuri line", description: "Tiny body on top with a very long lower shadow." },
      { id: "B", label: "Bullish belt hold", description: "Same shape as a bullish opening marubozu, at the end of a decline." },
      { id: "C", label: "Bullish kicker", description: "Gaps above the prior red's open." },
      { id: "D", label: "Bullish harami", description: "Small body inside the prior red body." },
    ],
    explanation:
      "Bullish belt hold. It is the bullish opening marubozu shape; the belt-hold name adds the prior decline it reverses. Confirm with the next candle.",
    patternKey: "bullish-opening-marubozu",
    highlightIndex: 3,
    glossaryTermId: "belt-hold",
  },
  {
    id: "PB-BELT-02",
    prompt: "A bearish belt hold is the same shape as which Archive pattern, seen after a rally?",
    correctAnswer: "D",
    options: [
      { id: "A", label: "Bearish closing marubozu", description: "Red, closes at the low, upper wick only." },
      { id: "B", label: "Shooting star", description: "Small body at the bottom, long upper wick." },
      { id: "C", label: "Bearish engulfing", description: "Two candles: red body engulfs the green body." },
      { id: "D", label: "Bearish opening marubozu", description: "Red, opens at the high (no upper wick), lower wick only." },
    ],
    explanation:
      "Bearish opening marubozu. Sellers took control from the first tick after a rally; that is the bearish belt hold. A close back above its open cancels it.",
    patternKey: "bearish-opening-marubozu",
    highlightIndex: 3,
    glossaryTermId: "belt-hold",
  },
];

export const ADVANCED_QUESTIONS: QuizQuestion[] = [
  ...ADVANCED_PATTERNS.flatMap((p, i) => patternQuestions(p, i)),
  ...CONCEPT,
  ...BELT_HOLD,
];

export const ADVANCED_RARE_KEYS = ADVANCED_PATTERNS.filter((p) => p.rare).map((p) => p.id);
export const familyKeys = (family: Family) => ADVANCED_PATTERNS.filter((p) => p.family === family).map((p) => p.id);

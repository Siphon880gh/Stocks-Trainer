/**
 * Potential direction for every pattern in the registry (#19 "Which Way?"): where price can go once the pattern
 * is confirmed. "either" = indecision, compression or balance, where the break decides. Continuations follow the
 * prior trend drawn on the pattern's chart. Kept consistent with the #17 themes by whichWay.test.ts.
 * No imports, so patterns.ts can attach it without a cycle.
 */
export type PotentialDirection = "up" | "down" | "either";

/** Bullish reversals and bullish continuations. */
const UP: readonly string[] = [
  "hammer", "engulfing", "bullish-engulfing", "inverted-hammer", "falling-wedge", "morning-star", "piercing-line",
  "three-white-soldiers", "harami", "tweezer-bottom", "bull-flag", "double-bottom", "white-marubozu",
  "three-inside-up", "three-outside-up", "bullish-counterattack", "rising-three-methods", "mat-hold",
  "upside-tasuki-gap", "long-green-candle", "bullish-closing-marubozu", "bullish-opening-marubozu", "dragonfly-doji",
  "bullish-kicker", "bullish-abandoned-baby", "bullish-tri-star", "bullish-three-line-strike", "bullish-breakaway",
  "bullish-separating-lines", "bullish-side-by-side-white-lines", "upside-gap-three-methods",
  "inverse-head-shoulders", "demand-zone", "bullish-harami-cross", "morning-doji-star", "stick-sandwich",
  "homing-pigeon", "ladder-bottom", "concealing-baby-swallow", "unique-three-river-bottom", "matching-low",
  "three-stars-in-the-south", "takuri-line", "last-engulfing-bottom", "above-the-stomach", "bullish-hikkake",
  "triple-bottom", "rising-window", "breakaway-gap", "runaway-gap", "island-bottom", "bull-pennant",
  "high-tight-flag", "ascending-triangle", "bullish-rectangle", "ascending-channel", "rounding-bottom",
  "cup-and-handle", "diamond-bottom", "v-bottom", "selling-climax", "volume-dry-up", "breakout-volume",
  "pipe-bottom", "failed-breakdown", "complex-inverse-head-shoulders", "low-tight-flag",
  "trend-stage-bounce", "measured-move-up", "neckline-retest-bullish", "rectangle-bottom", "step-bottom", "bullish-three-pushes",
];

/** Bearish reversals and bearish continuations. */
const DOWN: readonly string[] = [
  "bearish-engulfing", "shooting-star", "head-shoulders", "hanging-man", "evening-star", "dark-cloud-cover",
  "three-black-crows", "tweezer-top", "rising-wedge", "double-top", "black-marubozu", "bearish-harami",
  "three-inside-down", "three-outside-down", "on-neck", "bearish-counterattack", "falling-three-methods",
  "downside-tasuki-gap", "long-red-candle", "bearish-closing-marubozu", "bearish-opening-marubozu",
  "gravestone-doji", "bearish-kicker", "bearish-abandoned-baby", "bearish-tri-star", "two-crows",
  "upside-gap-two-crows", "bearish-three-line-strike", "bearish-breakaway", "bearish-separating-lines",
  "bearish-side-by-side-white-lines", "in-neck", "thrusting", "downside-gap-three-methods", "bearish-mat-hold",
  "supply-zone", "bearish-harami-cross", "evening-doji-star", "advance-block", "deliberation",
  "identical-three-crows", "last-engulfing-top", "below-the-stomach", "bearish-hikkake", "triple-top",
  "falling-window", "exhaustion-gap", "island-top", "bear-flag", "bear-pennant", "descending-triangle",
  "bearish-rectangle", "descending-channel", "rounding-top", "inverse-cup-and-handle", "diamond-top",
  "volume-divergence", "three-pushes", "pipe-top", "failed-breakout", "blow-off-top",
  "complex-head-shoulders",
  "tweezer-star", "trendline-breakdown", "measured-move-down", "neckline-retest-bearish", "step-top", "bearish-breakaway-gap", "bearish-runaway-gap",
];

/** Indecision, compression and balance: the break decides. */
const EITHER: readonly string[] = [
  "doji", "spinning-top", "triangle", "short-green-candle", "short-red-candle", "long-legged-doji", "cross-doji",
  "inverted-cross-doji", "high-wave", "rickshaw-man", "double-doji", "broadening-top", "broadening-bottom",
  "inside-bar", "four-price-doji", "common-gap",
];

export const POTENTIAL_DIRECTION: Readonly<Record<string, PotentialDirection>> = Object.fromEntries([
  ...UP.map((id) => [id, "up"] as const),
  ...DOWN.map((id) => [id, "down"] as const),
  ...EITHER.map((id) => [id, "either"] as const),
]);

export const DIRECTION_LABEL: Record<PotentialDirection, string> = { up: "Up", down: "Down", either: "Either" };
export const DIRECTION_ARROW: Record<PotentialDirection, string> = { up: "↑", down: "↓", either: "↔" };

/**
 * Crypto candlestick track: which patterns work, need adaptation, or are rare on 24/7 markets
 * (crypto trades continuously, so true gaps between candles are uncommon). Tags every candlestick
 * PatternDef; chart/gap/volume patterns are excluded. Educational, not advice.
 */
import type { PatternDef } from "./patterns";
import { PATTERNS } from "./patterns";
import { CHART_BOOK } from "./chartPatternBook";
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";

export type CryptoFit = "works" | "adapted" | "rare";

/** Chart / gap / volume / zone patterns — not tagged for the crypto candle track. */
const NON_CANDLE = new Set<string>([
  ...CHART_BOOK.map((p) => p.id),
  "head-shoulders", "falling-wedge", "rising-wedge", "bull-flag", "bear-flag", "double-top", "double-bottom",
  "triangle", "inverse-head-shoulders", "supply-zone", "demand-zone", "bull-pennant", "bear-pennant",
  "high-tight-flag", "ascending-triangle", "descending-triangle", "bullish-rectangle", "bearish-rectangle",
  "ascending-channel", "descending-channel", "rounding-bottom", "rounding-top", "cup-and-handle",
  "inverse-cup-and-handle", "broadening-top", "broadening-bottom", "diamond-top", "diamond-bottom",
  "v-bottom", "triple-top", "triple-bottom", "three-pushes", "selling-climax", "volume-dry-up",
  "breakout-volume", "volume-divergence", "rising-window", "falling-window", "breakaway-gap",
  "runaway-gap", "exhaustion-gap", "island-top", "island-bottom",
]);

/** Classic form needs a real gap between candles — uncommon when markets never close. */
const RARE: ReadonlySet<string> = new Set([
  "bullish-abandoned-baby", "bearish-abandoned-baby",
  "bullish-kicker", "bearish-kicker",
  "upside-gap-two-crows", "two-crows",
  "upside-tasuki-gap", "downside-tasuki-gap",
  "upside-gap-three-methods", "downside-gap-three-methods",
  "bullish-breakaway", "bearish-breakaway",
  "bullish-side-by-side-white-lines", "bearish-side-by-side-white-lines",
  "bullish-tri-star", "bearish-tri-star",
  "concealing-baby-swallow",
]);

/**
 * Classic textbook form uses a gap (or an open beyond the prior high/low), but the same idea can be
 * read without a gap: look for the body relationships and the midpoint / confirmation rules.
 */
const ADAPTED: ReadonlySet<string> = new Set([
  "morning-star", "evening-star", "morning-doji-star", "evening-doji-star",
  "piercing-line", "dark-cloud-cover",
  "mat-hold", "bearish-mat-hold",
  "bullish-separating-lines", "bearish-separating-lines",
]);

export function isCandlestickPattern(id: string): boolean {
  return !NON_CANDLE.has(id);
}

export function cryptoFitFor(id: string): CryptoFit | null {
  if (!isCandlestickPattern(id)) return null;
  if (RARE.has(id)) return "rare";
  if (ADAPTED.has(id)) return "adapted";
  return "works";
}

export const CRYPTO_FIT_LABEL: Record<CryptoFit, string> = {
  works: "Works in crypto",
  adapted: "Adapted in crypto",
  rare: "Rare in crypto",
};

export const CRYPTO_FIT_HINT: Record<CryptoFit, string> = {
  works: "Body and wick pattern: carries over to 24/7 markets.",
  adapted: "Classic form uses a gap; read the body and midpoint rules without requiring one.",
  rare: "Needs a true gap between candles, which is uncommon when trading never stops.",
};

/** Every candlestick PatternDef with its crypto tag. */
export function candlestickPatterns(): Array<PatternDef & { cryptoFit: CryptoFit }> {
  return PATTERNS.filter((p) => isCandlestickPattern(p.id)).map((p) => ({
    ...p,
    cryptoFit: cryptoFitFor(p.id)!,
  }));
}

export const CRYPTO_WHY = {
  title: "Why crypto candles are different",
  points: [
    "Crypto trades 24/7. Between one candle and the next there is usually no exchange close, so true gaps (open well beyond the prior high or low) are rare.",
    "Gap-dependent patterns — abandoned baby, kickers, upside gap two crows, island reversals, classic gap-based piercing and dark cloud — form infrequently. Prefer the adapted read (body and midpoint rules) or skip them.",
    "Body and wick patterns — engulfing, hammer, shooting star, the doji family, tweezers, three soldiers and crows, harami, three-line strike, three methods — carry over directly.",
    "The \"daily\" close is a convention, commonly 00:00 UTC, and varies by exchange. Always check which close your chart uses.",
    "Crypto is more volatile and prints more wicks. Size stops from the pattern's extreme, confirm with volume when you have it, and check the higher timeframe before acting on a single candle.",
  ],
  sources: [
    { label: "StockCharts ChartSchool: candlestick dictionary", url: "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/candlestick-charts/candlestick-pattern-dictionary" },
    { label: "Bulkowski: bullish harami", url: "https://thepatternsite.com/HaramiBull.html" },
    { label: "Bulkowski: bullish belt hold", url: "https://thepatternsite.com/BeltHoldBull.html" },
  ],
};

/** Weng's harami sentence — used verbatim as the key takeaway. */
export const HARAMI_TAKEAWAY =
  "A harami candle signals a potential trend reversal by showing market hesitation, helping commodity traders spot weakening momentum and possible entry or exit points.";

export const HARAMI_TEACHING = [
  HARAMI_TAKEAWAY,
  "Shape: after a clear trend, a large body is followed by a much smaller body that sits entirely inside the prior body (wicks may poke out; the bodies decide).",
  "It needs a preceding trend: tall red then small green after a decline (bullish harami); tall green then small red after a rally (bearish harami).",
  "It is an early warning of hesitation, not an entry signal. Wait for a confirming close beyond the small candle (and usually beyond the large candle's extreme).",
  "Contrast with engulfing: engulfing is decisive (the second body covers the first); harami is hesitation (the second body hides inside the first).",
];

export const CRYPTO_TERMS: LiteracyTerm[] = [
  {
    id: "crypto-candle-gaps",
    name: "Crypto candles and gaps",
    category: "markets",
    summary: "24/7 trading means true gaps between candles are rare, so gap-dependent patterns form infrequently.",
    detail:
      "On stocks a gap is an open beyond the prior high or low after the exchange was closed. Crypto rarely closes, so abandoned babies, kickers and gap-two-crows are uncommon. Prefer body and wick patterns, or adapt stars and piercing / dark cloud by dropping the gap requirement and keeping the midpoint and confirmation rules. Educational, not advice.",
  },
  {
    id: "crypto-daily-close",
    name: "Crypto daily close",
    category: "markets",
    summary: "The daily candle's close is a convention (often 00:00 UTC) and varies by exchange.",
    detail:
      "Because crypto never sleeps, \"daily\" is a chosen cut-off, not an exchange close. Charts on different exchanges or tools can disagree on the same day's open and close. Check the session setting before comparing patterns across platforms. Educational, not advice.",
  },
  {
    id: "umbrella-line",
    name: "Umbrella line",
    category: "process",
    summary: "Family name for candles with a small body at the top and a long lower wick: hammer and hanging man.",
    detail:
      "An umbrella has a small body near the high of the range and a lower wick at least twice the body. After a decline it is a hammer (bullish warning); after a rally it is a hanging man (bearish warning). Both need a confirming candle. Educational, not advice.",
  },
];

type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string, patternKey?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}), ...(patternKey ? { patternKey } : {}) };
}

export const CRYPTO_CANDLE_QUESTIONS: QuizQuestion[] = [
  mc("CC-01", "Why are true gaps between crypto candles uncommon?", "B", "Crypto trades 24/7, so there is usually no exchange close between one candle and the next",
    ["Crypto bans gaps by regulation", "Exchanges fill every gap overnight", "Gaps only form on weekly charts"],
    "Without a close, the next open is usually near the prior close.", "crypto-candle-gaps"),
  mc("CC-02", "Which group of patterns carries over to crypto with little change?", "A", "Body and wick patterns: engulfing, hammer, doji family, tweezers, harami, three soldiers / crows, three-line strike, three methods",
    ["Only abandoned babies and kickers", "Only island reversals", "Only gap-based piercing lines"],
    "These patterns do not need a gap; they read from bodies and wicks.", "crypto-candle-gaps"),
  mc("CC-03", "Abandoned baby and kicker patterns on crypto are…", "C", "Rare, because they need a true gap between candles",
    ["The most common crypto patterns", "Identical to hammers", "Required for every trade"],
    "Tag: rare in crypto.", "crypto-candle-gaps", "bullish-abandoned-baby"),
  mc("CC-04", "How should you read a morning star on a crypto chart?", "D", "Keep the three-candle shape and the 50% midpoint rule; do not require the classic gaps",
    ["Never use morning stars on crypto", "Require both gaps or skip the pattern", "Treat it as a doji only"],
    "Tag: adapted in crypto — body relationships still apply.", "crypto-candle-gaps", "morning-star"),
  mc("CC-05", "The \"daily\" close on most crypto charts is…", "B", "A convention (often 00:00 UTC) that can differ by exchange",
    ["Always the New York close", "Always the Tokyo close", "Random each day"],
    "Check the session setting before comparing charts.", "crypto-daily-close"),
  mc("CC-06", "Crypto candles often show more wicks than equity candles. What does that imply for stops?", "A", "Place stops beyond the pattern's extreme and confirm on a higher timeframe",
    ["Ignore wicks entirely", "Use a 1-tick stop", "Widen the stop and increase size"],
    "More noise means more false signals on a single timeframe."),
  mc("CC-07", "A harami on any market (including crypto) is best treated as…", "C", "An early warning of hesitation that still needs a confirming close",
    ["An immediate entry at the close of the small candle", "A guaranteed reversal", "The same as a bullish engulfing"],
    HARAMI_TAKEAWAY + " Confirmation still decides.", undefined, "harami"),
  mc("CC-08", "Engulfing vs harami: which statement is right?", "B", "Engulfing is decisive (second body covers the first); harami is hesitation (second body sits inside the first)",
    ["They are the same pattern", "Harami is always stronger", "Engulfing needs a gap; harami does not"],
    "Both work in crypto; the psychology differs.", undefined, "bullish-engulfing"),
  mc("CC-09", "Piercing line and dark cloud cover on crypto should be…", "A", "Adapted: keep the midpoint rule; do not require an open beyond the prior high or low",
    ["Dropped forever", "Read only on 1-minute charts", "Treated as abandoned babies"],
    "Tag: adapted in crypto.", "crypto-candle-gaps", "piercing-line"),
  mc("CC-10", "Which pattern is tagged \"works in crypto\"?", "D", "Bullish engulfing",
    ["Bullish abandoned baby", "Bullish kicker", "Upside gap two crows"],
    "Engulfing is a body pattern; the others need gaps.", undefined, "bullish-engulfing"),
  mc("CC-11", "An umbrella line is…", "B", "A small body at the top of the range with a long lower wick: a hammer after a decline, a hanging man after a rally",
    ["Any doji", "A gap pattern", "Three white soldiers"],
    "Family name for the hammer / hanging-man shape.", "umbrella-line", "hammer"),
  mc("CC-12", "Before acting on a single crypto candle, you should…", "C", "Confirm with volume when available and check the higher timeframe",
    ["Double size", "Ignore volume", "Switch to a line chart"],
    "Crypto volatility produces more lone-candle traps."),
];

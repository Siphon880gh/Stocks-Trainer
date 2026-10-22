/** Central pattern registry for Archive, Quiz, and Chart annotations */
import { ADVANCED_PATTERN_DEFS } from "./advancedPatterns";
import { CHART_BOOK_DEFS } from "./chartPatternBook";

export type PatternSentiment = "bullish" | "bearish" | "neutral";

export interface PatternDef {
  id: string;
  name: string;
  type: "reversal" | "continuation" | "neutral";
  sentiment?: PatternSentiment;
  confirmation: "low" | "medium" | "high" | "very_high";
  description: string;
  image?: string;
  /** Advanced / rare textbook pattern: infrequent and less reliable (Archive shows a tag). */
  rare?: boolean;
  /** Optional key takeaway shown prominently on the detail card. */
  takeaway?: string;
}

// Resolve public images from the loaded document, not from the client-side
// route. This keeps them working with Vite's relative production base.
// Outside Vite (node:test via tsx) there is no import.meta.env or document,
// so fall back to "/" and a placeholder origin; the registry still loads.
const patternImage = (file: string) => new URL(
  `${import.meta.env?.BASE_URL ?? "/"}patterns/${file}`,
  typeof document === "undefined" ? "http://localhost/" : document.baseURI,
).href;

export const PATTERNS: PatternDef[] = [
  { id: "doji", name: "Doji", type: "neutral", sentiment: "neutral", confirmation: "medium", description: "Indecision in the market with equal open/close." },
  { id: "hammer", name: "Hammer", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Bullish reversal pattern with a long lower shadow." },
  { id: "engulfing", name: "Engulfing", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Body of current candle covers previous candle." },
  { id: "bullish-engulfing", name: "Bullish Engulfing", type: "reversal", sentiment: "bullish", confirmation: "high", description: "A large green candle completely overlaps the previous small red candle.", image: patternImage("bullish-engulfing.svg") },
  { id: "bearish-engulfing", name: "Bearish Engulfing", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Red body fully engulfs prior green body; bearish reversal." },
  { id: "shooting-star", name: "Shooting Star", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Long upper shadow, small body at bottom; top reversal." },
  { id: "inverted-hammer", name: "Inverted Hammer", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Long upper shadow, small body at bottom; bottom reversal." },
  { id: "head-shoulders", name: "Head and Shoulders", type: "reversal", sentiment: "bearish", confirmation: "very_high", description: "Three peaks after an advance: left shoulder, higher head, lower right shoulder. Confirmed by a close below the neckline; target is the head-to-neckline height projected down. Watch for a retest of the neckline from below.", image: patternImage("head-shoulders.svg") },
  { id: "falling-wedge", name: "Falling Wedge", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "Price falls inside two downward-sloping, converging lines: each push lower gains less ground. Usually bullish (the bullish wedge): a reversal after a decline, or a bullish continuation pause in an uptrend. Confirmed by a close above the upper line.", image: patternImage("falling-wedge.svg") },
  { id: "morning-star", name: "Morning Star", type: "reversal", sentiment: "bullish", confirmation: "high", description: "A three-candle bullish reversal pattern occurring at the bottom of a downtrend.", image: patternImage("morning-star.svg") },
  { id: "hanging-man", name: "Hanging Man", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Same long lower wick as a hammer, but after a rally—sellers may be showing up. Wait for the next print." },
  { id: "evening-star", name: "Evening Star", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Three-candle top: strong green, small middle, then strong red. SAMPLE teaching—confirm with later bars." },
  { id: "piercing-line", name: "Piercing Line", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "After a decline, a green body opens lower then closes well into the prior red body." },
  { id: "dark-cloud-cover", name: "Dark Cloud Cover", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "After a rally, a red body opens higher then closes well into the prior green body." },
  { id: "three-white-soldiers", name: "Three White Soldiers", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Bullish reversal: after a downtrend, three long green bodies in a row, each opening inside the prior body and closing near its high with short wicks. Buyers took control three periods running. Invalidation: a close back below the first soldier's open. Far above support after a long rally, it can instead mean the move is stretched." },
  { id: "three-black-crows", name: "Three Black Crows", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Bearish reversal: after an uptrend, three long red bodies in a row, each opening inside the prior body and closing near its low with short wicks. Sellers took control three periods running. Invalidation: a close back above the first crow's open. Far below resistance after a long decline, it can instead mean the move is stretched." },
  { id: "harami", name: "Harami", type: "reversal", sentiment: "bullish", confirmation: "low", description: "After a decline: a tall red body, then a much smaller body that sits inside it. Hesitation, not an entry — wait for a confirming close. Contrast with engulfing, where the second body covers the first.", takeaway: "A harami candle signals a potential trend reversal by showing market hesitation, helping commodity traders spot weakening momentum and possible entry or exit points." },
  { id: "tweezer-top", name: "Tweezer Top", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Two candles share a similar high after a rally—matched rejection at the highs on SAMPLE tapes." },
  { id: "tweezer-bottom", name: "Tweezer Bottom", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "Two candles share a similar low after a decline—matched support on SAMPLE tapes. Wait for the next print." },
  { id: "rising-wedge", name: "Rising Wedge", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Price rises inside two upward-sloping, converging lines: each push higher gains less ground. Usually bearish (the bearish wedge): a reversal after an advance, or a bearish continuation pause in a downtrend. Confirmed by a close below the lower line." },
  { id: "bull-flag", name: "Bull Flag", type: "continuation", sentiment: "bullish", confirmation: "medium", description: "A sharp rise, then a tight downward or sideways pause. SAMPLE read: the pause can be a rest, not a new downtrend, if the prior thrust was clean." },
  { id: "double-top", name: "Double Top", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Two similar highs after an advance with a clear dip between them. Confirmed only by a close below the neckline (the dip low); measured move is the height of the pattern projected down. A failed retest of the neckline is common." },
  { id: "double-bottom", name: "Double Bottom", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Two similar lows after a decline (a W). Confirmed only by a close above the neckline (the bounce high); measured move is the pattern height projected up. Marks a change in trend and momentum from the prior decline — after confirmation." },
  { id: "white-marubozu", name: "White Marubozu", type: "neutral", sentiment: "bullish", confirmation: "medium", description: "A tall green body with no wicks: it opened at the low and closed at the high. Buyers controlled the whole period. After a decline it can mark a turn; inside an uptrend it reads as strength. It does not promise the next candle." },
  { id: "black-marubozu", name: "Black Marubozu", type: "neutral", sentiment: "bearish", confirmation: "medium", description: "A tall red body with no wicks: it opened at the high and closed at the low. Sellers controlled the whole period. After a rally it is a warning for longs; inside a downtrend it reads as weakness." },
  { id: "spinning-top", name: "Spinning Top", type: "neutral", sentiment: "neutral", confirmation: "low", description: "A small body with wicks on both sides. Like a doji it shows indecision, but the body is a bit larger. Location matters: after a run it hints at fading momentum; in a range it is often noise." },
  { id: "bearish-harami", name: "Bearish Harami", type: "reversal", sentiment: "bearish", confirmation: "low", description: "After a rally: a tall green body, then a much smaller body that sits inside it. Hesitation at the highs — wait for a confirming close below. Contrast with bearish engulfing.", takeaway: "A harami candle signals a potential trend reversal by showing market hesitation, helping commodity traders spot weakening momentum and possible entry or exit points." },
  { id: "three-inside-up", name: "Three Inside Up", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "After a decline: a tall red, a small green inside it (a bullish harami), then a green that closes above the first candle's open. The third candle is the built-in confirmation." },
  { id: "three-inside-down", name: "Three Inside Down", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "After a rally: a tall green, a small red inside it (a bearish harami), then a red that closes below the first candle's open. The third candle is the built-in confirmation." },
  { id: "three-outside-up", name: "Three Outside Up", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "After a decline: a short red, a green body that engulfs it (a bullish engulfing), then a green that closes higher still. The third candle confirms the engulfing." },
  { id: "three-outside-down", name: "Three Outside Down", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "After a rally: a short green, a red body that engulfs it (a bearish engulfing), then a red that closes lower still. The third candle confirms the engulfing." },
  { id: "on-neck", name: "On-Neck", type: "continuation", sentiment: "bearish", confirmation: "low", description: "In a decline, a long red candle is followed by a small green that opens below its low and closes back at about the red candle's close. Buyers could not get into the red body, so it is traditionally read as a pause before more downside. Compare Piercing Line, which closes past the midpoint." },
  { id: "bullish-counterattack", name: "Bullish Counterattack", type: "reversal", sentiment: "bullish", confirmation: "low", description: "In a decline, a long red candle is followed by a long green that opens far lower and climbs back to close at about the same price. Buyers erased the gap. Weaker than a piercing line; wait for the next candle. Also called bullish meeting lines." },
  { id: "bearish-counterattack", name: "Bearish Counterattack", type: "reversal", sentiment: "bearish", confirmation: "low", description: "In a rally, a long green candle is followed by a long red that opens far higher and falls back to close at about the same price. Sellers erased the gap. Weaker than dark cloud cover; wait for the next candle. Also called bearish meeting lines." },
  { id: "rising-three-methods", name: "Rising Three Methods", type: "continuation", sentiment: "bullish", confirmation: "medium", description: "Five candles in an uptrend: a long green, three small pullback candles that stay inside its range, then a long green that closes above the first. A rest, not a reversal." },
  { id: "falling-three-methods", name: "Falling Three Methods", type: "continuation", sentiment: "bearish", confirmation: "medium", description: "Five candles in a downtrend: a long red, three small bounce candles that stay inside its range, then a long red that closes below the first. Buyers could not take over." },
  { id: "mat-hold", name: "Mat Hold", type: "continuation", sentiment: "bullish", confirmation: "medium", description: "In an uptrend: a long green, a gap higher, three small candles drifting lower that stay above the first candle's low, then a long green to new highs. The downtrend mirror is the bearish mat hold." },
  { id: "upside-tasuki-gap", name: "Upside Tasuki Gap", type: "continuation", sentiment: "bullish", confirmation: "low", description: "In an uptrend: a green, a green that gaps up, then a red that closes inside the gap without filling it. If the gap holds, the uptrend is intact; a full fill cancels the read." },
  { id: "downside-tasuki-gap", name: "Downside Tasuki Gap", type: "continuation", sentiment: "bearish", confirmation: "low", description: "In a downtrend: a red, a red that gaps down, then a green that closes inside the gap without filling it. If the gap holds, the downtrend is intact; a full fill cancels the read." },
  { id: "triangle", name: "Triangle", type: "neutral", sentiment: "neutral", confirmation: "low", description: "Highs and lows squeeze toward a point. SAMPLE read: direction is not the triangle itself—wait for which side breaks, then the next print." },
  // --- Candle types: long/short, opening/closing marubozu, doji variants ---
  { id: "long-green-candle", name: "Long Green Candle", type: "neutral", sentiment: "bullish", confirmation: "low", description: "A green body much taller than recent bodies: buyers pushed price a long way from open to close. Strength in the moment, not a signal by itself; read it with the trend and where it closes." },
  { id: "long-red-candle", name: "Long Red Candle", type: "neutral", sentiment: "bearish", confirmation: "low", description: "A red body much taller than recent bodies: sellers pushed price a long way from open to close. Strength in the moment, not a signal by itself." },
  { id: "short-green-candle", name: "Short Green Candle", type: "neutral", sentiment: "neutral", confirmation: "low", description: "A small green body with a small range: little happened. Buyers edged ahead, but conviction was low on both sides." },
  { id: "short-red-candle", name: "Short Red Candle", type: "neutral", sentiment: "neutral", confirmation: "low", description: "A small red body with a small range: sellers edged ahead, but conviction was low on both sides." },
  { id: "bullish-closing-marubozu", name: "Bullish Closing Marubozu", type: "neutral", sentiment: "bullish", confirmation: "low", description: "Long green body that closes at the high (no upper wick) but has a lower wick. Buyers were still in control at the close." },
  { id: "bearish-closing-marubozu", name: "Bearish Closing Marubozu", type: "neutral", sentiment: "bearish", confirmation: "low", description: "Long red body that closes at the low (no lower wick) but has an upper wick. Sellers were still in control at the close." },
  { id: "bullish-opening-marubozu", name: "Bullish Opening Marubozu", type: "neutral", sentiment: "bullish", confirmation: "low", description: "Long green body that opens at the low (no lower wick) and has an upper wick. Buyers drove it from the first tick, but some gains were given back by the close. After a decline the same shape is called a bullish belt hold." },
  { id: "bearish-opening-marubozu", name: "Bearish Opening Marubozu", type: "neutral", sentiment: "bearish", confirmation: "low", description: "Long red body that opens at the high (no upper wick) and has a lower wick. Sellers drove it from the first tick, but buyers clawed a little back by the close. After a rally the same shape is called a bearish belt hold." },
  { id: "long-legged-doji", name: "Long-Legged Doji", type: "neutral", sentiment: "neutral", confirmation: "low", description: "Open ≈ close with long wicks on both sides. Price swung hard both ways and ended where it started: strong indecision. Matters most after a long move; wait for the next candle." },
  { id: "cross-doji", name: "Cross Doji", type: "neutral", sentiment: "neutral", confirmation: "low", description: "A doji whose lower wick is longer than its upper wick, so it looks like a cross (†). Indecision; naming varies between sources, so focus on where the wicks are." },
  { id: "inverted-cross-doji", name: "Inverted Cross Doji", type: "neutral", sentiment: "neutral", confirmation: "low", description: "A doji whose upper wick is longer than its lower wick (an upside-down cross). Indecision with some rejection of higher prices; wait for the next candle." },
  { id: "dragonfly-doji", name: "Dragonfly Doji", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "Open, high, and close all at the top, with a long lower wick (a T shape). Sellers pushed down, buyers defended lower levels and closed it at the high. After a decline it can mark a bottom; needs a green confirmation." },
  { id: "gravestone-doji", name: "Gravestone Doji", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Open, low, and close all at the bottom, with a long upper wick (an upside-down T). Buyers pushed up, sellers defended upper levels and closed it at the low. After a rally it can mark a top; needs a red confirmation." },
  // --- Gap reversals ---
  { id: "bullish-kicker", name: "Bullish Kicker", type: "reversal", sentiment: "bullish", confirmation: "very_high", description: "A red candle, then a green candle that gaps up above the red candle's open and keeps going. The gap means sentiment flipped overnight. One of the strongest two-candle reversals; the gap should hold." },
  { id: "bearish-kicker", name: "Bearish Kicker", type: "reversal", sentiment: "bearish", confirmation: "very_high", description: "A green candle, then a red candle that gaps down below the green candle's open and keeps falling. Sentiment flipped hard. The gap should stay unfilled." },
  { id: "bullish-abandoned-baby", name: "Bullish Abandoned Baby", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Downtrend: a long red, a doji that gaps below it (no wick overlap), then a green that gaps up above the doji. The doji is left alone on an island. A rare, strong morning-star variant." },
  { id: "bearish-abandoned-baby", name: "Bearish Abandoned Baby", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Uptrend: a long green, a doji that gaps above it (no wick overlap), then a red that gaps down below the doji. The doji is stranded on an island. A rare, strong evening-star variant." },
  { id: "bullish-tri-star", name: "Bullish Tri-Star", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "Three dojis in a row after a decline, with the middle one gapping below the other two. Three sessions of indecision at the lows. Rare; wait for a green confirmation." },
  { id: "bearish-tri-star", name: "Bearish Tri-Star", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Three dojis in a row after a rally, with the middle one gapping above the other two. Repeated indecision at the highs. Rare; wait for a red confirmation." },
  // --- Crows, strikes, breakaways ---
  { id: "two-crows", name: "Two Crows", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Uptrend: a long green, a red that gaps up but closes lower, then a red that opens inside that red's body and closes inside the first green's body. Buyers' gap failed twice." },
  { id: "upside-gap-two-crows", name: "Upside Gap Two Crows", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Uptrend: a long green, a small red that gaps up, then a larger red that engulfs the small red but still closes above the first green's close. The gap is still open, so it is a warning that needs a lower close to confirm." },
  { id: "bullish-three-line-strike", name: "Bullish Three-Line Strike", type: "continuation", sentiment: "bullish", confirmation: "low", description: "Three rising green candles, then a long red that opens at the high and closes below the first candle's open, wiping out the run. Traditionally a continuation, but it often behaves like a reversal, so treat the direction as unclear until the next candles show it." },
  { id: "bearish-three-line-strike", name: "Bearish Three-Line Strike", type: "continuation", sentiment: "bearish", confirmation: "low", description: "Three falling red candles, then a long green that opens at the low and closes above the first candle's open. Traditionally a continuation, but often acts as a reversal. Treat it as unclear until later candles pick a side." },
  { id: "bullish-breakaway", name: "Bullish Breakaway", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "Five candles in a downtrend: a long red, a red that gaps down, two or three smaller candles that drift lower, then a long green that closes inside the first gap. Sellers broke away and the move was reclaimed." },
  { id: "bearish-breakaway", name: "Bearish Breakaway", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Five candles in an uptrend: a long green, a green that gaps up, smaller candles drifting higher, then a long red that closes inside the first gap. The breakaway rally was taken back." },
  // --- More continuation patterns ---
  { id: "bullish-separating-lines", name: "Bullish Separating Lines", type: "continuation", sentiment: "bullish", confirmation: "low", description: "In an uptrend: a red pullback candle, then a green candle that opens at the same price as the red's open and rallies away. The dip was erased at the open; the uptrend resumes." },
  { id: "bearish-separating-lines", name: "Bearish Separating Lines", type: "continuation", sentiment: "bearish", confirmation: "low", description: "In a downtrend: a green bounce candle, then a red candle that opens at the same price as the green's open and falls away. The bounce was erased at the open; the downtrend resumes." },
  { id: "bullish-side-by-side-white-lines", name: "Bullish Side-by-Side White Lines", type: "continuation", sentiment: "bullish", confirmation: "low", description: "In an uptrend: a green, then two similar green candles side by side that gap up above it and open at about the same price. The gap holds; continuation. (Both are green, i.e. white, candles.)" },
  { id: "bearish-side-by-side-white-lines", name: "Bearish Side-by-Side White Lines", type: "continuation", sentiment: "bearish", confirmation: "low", description: "In a downtrend: a red, then two similar green candles side by side that gap down below it. The green candles are weak bounces that cannot close the gap; the downtrend usually continues. Textbook version uses green (white) candles." },
  { id: "in-neck", name: "In-Neck", type: "continuation", sentiment: "bearish", confirmation: "low", description: "Downtrend: a long red, then a green that opens below the red's low and closes just barely inside the red body. Buyers could only nudge into the body; sellers likely stay in control. Sits between on-neck (closes at the low) and thrusting (deeper)." },
  { id: "thrusting", name: "Thrusting", type: "continuation", sentiment: "bearish", confirmation: "low", description: "Downtrend: a long red, then a green that opens lower and closes well into the red body but below its midpoint. A stronger bounce than in-neck, yet short of a piercing line, so the downtrend is not reversed." },
  { id: "upside-gap-three-methods", name: "Upside Gap Three Methods", type: "continuation", sentiment: "bullish", confirmation: "low", description: "Uptrend: two green candles with a gap between them, then a red that opens inside the second body and closes inside the first, filling the gap. A pullback that fills the gap but holds the first candle; continuation if the next candles rise." },
  { id: "downside-gap-three-methods", name: "Downside Gap Three Methods", type: "continuation", sentiment: "bearish", confirmation: "low", description: "Downtrend: two red candles with a gap between them, then a green that opens inside the second body and closes inside the first, filling the gap. A bounce that holds below the first candle; continuation if the next candles fall." },
  { id: "bearish-mat-hold", name: "Bearish Mat Hold", type: "continuation", sentiment: "bearish", confirmation: "medium", description: "Downtrend mirror of the mat hold: a long red, a gap lower, three small bounce candles that stay below the first candle's high, then a long red to new lows." },
  // --- Chart patterns and zones ---
  { id: "inverse-head-shoulders", name: "Inverse Head and Shoulders", type: "reversal", sentiment: "bullish", confirmation: "very_high", description: "Three troughs after a decline: the middle low (head) is deepest, flanked by two higher lows (shoulders). A close above the neckline confirms; the retest of the neckline from above is a common entry area." },
  { id: "supply-zone", name: "Supply Zone", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "A price area where sellers overwhelmed buyers: a small base candle (or a few) followed by a big-body drop away. When price returns to a fresh supply zone, sellers often show up again. A strong close above the zone breaks it." },
  { id: "demand-zone", name: "Demand Zone", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "A price area where buyers overwhelmed sellers: a small base candle (or a few) followed by a big-body rally away. When price returns to a fresh demand zone, buyers often show up again. A strong close below the zone breaks it." },
  ...ADVANCED_PATTERN_DEFS,
  // chart, gap and volume patterns (chartPatternBook.ts)
  ...CHART_BOOK_DEFS,
];

export function getPattern(id: string): PatternDef | undefined {
  return PATTERNS.find((p) => p.id === id);
}

const SCAN_NAME_DEFS: Record<string, PatternDef> = {
  "Shooting Star / Inverted Hammer": {
    id: "shooting-star-inverted-hammer",
    name: "Shooting Star / Inverted Hammer",
    type: "reversal",
    confirmation: "high",
    description:
      "Long upper shadow with a small body near the low of the range. After a run-up it is a shooting star (sellers stepped in at the highs). After a selloff it is an inverted hammer (buyers may be probing). Wait for the next print to confirm either read.",
  },
};

/** Archive / quiz PatternDef for a name returned by scanPatterns. */
export function patternDefForScanName(
  name: string,
  fallbackDescription?: string,
): PatternDef {
  const special = SCAN_NAME_DEFS[name];
  if (special) return special;
  const byName = PATTERNS.find((p) => p.name === name);
  if (byName) return byName;
  return {
    id: "scan-pattern",
    name,
    type: "neutral",
    confirmation: "medium",
    description:
      fallbackDescription ||
      "Candlestick pattern on this SAMPLE tape. Confirm with later prints.",
  };
}

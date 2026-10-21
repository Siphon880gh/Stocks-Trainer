/** Central pattern registry for Archive, Quiz, and Chart annotations */
export type PatternSentiment = "bullish" | "bearish" | "neutral";

export interface PatternDef {
  id: string;
  name: string;
  type: "reversal" | "continuation" | "neutral";
  sentiment?: PatternSentiment;
  confirmation: "low" | "medium" | "high" | "very_high";
  description: string;
  image?: string;
}

// Resolve public images from the loaded document, not from the client-side
// route. This keeps them working with Vite's relative production base.
const patternImage = (file: string) => new URL(
  `${import.meta.env.BASE_URL}patterns/${file}`,
  document.baseURI,
).href;

export const PATTERNS: PatternDef[] = [
  { id: "doji", name: "Doji", type: "neutral", sentiment: "neutral", confirmation: "medium", description: "Indecision in the market with equal open/close." },
  { id: "hammer", name: "Hammer", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Bullish reversal pattern with a long lower shadow." },
  { id: "engulfing", name: "Engulfing", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Body of current candle covers previous candle." },
  { id: "bullish-engulfing", name: "Bullish Engulfing", type: "reversal", sentiment: "bullish", confirmation: "high", description: "A large green candle completely overlaps the previous small red candle.", image: patternImage("bullish-engulfing.svg") },
  { id: "bearish-engulfing", name: "Bearish Engulfing", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Red body fully engulfs prior green body; bearish reversal." },
  { id: "shooting-star", name: "Shooting Star", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Long upper shadow, small body at bottom; top reversal." },
  { id: "inverted-hammer", name: "Inverted Hammer", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Long upper shadow, small body at bottom; bottom reversal." },
  { id: "head-shoulders", name: "Head and Shoulders", type: "reversal", sentiment: "bearish", confirmation: "very_high", description: "Three peaks: center peak (head) is highest, flanked by two lower peaks.", image: patternImage("head-shoulders.svg") },
  { id: "falling-wedge", name: "Falling Wedge", type: "continuation", sentiment: "bearish", confirmation: "medium", description: "Price consolidates between two downward sloping, converging trendlines.", image: patternImage("falling-wedge.svg") },
  { id: "morning-star", name: "Morning Star", type: "reversal", sentiment: "bullish", confirmation: "high", description: "A three-candle bullish reversal pattern occurring at the bottom of a downtrend.", image: patternImage("morning-star.svg") },
  { id: "hanging-man", name: "Hanging Man", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Same long lower wick as a hammer, but after a rally—sellers may be showing up. Wait for the next print." },
  { id: "evening-star", name: "Evening Star", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Three-candle top: strong green, small middle, then strong red. SAMPLE teaching—confirm with later bars." },
  { id: "piercing-line", name: "Piercing Line", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "After a decline, a green body opens lower then closes well into the prior red body." },
  { id: "dark-cloud-cover", name: "Dark Cloud Cover", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "After a rally, a red body opens higher then closes well into the prior green body." },
  { id: "three-white-soldiers", name: "Three White Soldiers", type: "continuation", sentiment: "bullish", confirmation: "high", description: "Three rising green bodies in a row after a decline or pause—buyers in control on this SAMPLE read. Each opens inside the prior body and closes near its high with short wicks. After a downtrend it is usually read as a bullish reversal." },
  { id: "three-black-crows", name: "Three Black Crows", type: "continuation", sentiment: "bearish", confirmation: "high", description: "Three falling red bodies in a row after a rally or pause—sellers in control on this SAMPLE read. Each opens inside the prior body and closes near its low with short wicks. After an uptrend it is usually read as a bearish reversal." },
  { id: "harami", name: "Harami", type: "reversal", sentiment: "neutral", confirmation: "low", description: "A small body nested inside the prior larger body—indecision after a swing. After a decline (tall red, small green) it is a bullish harami; see Bearish Harami for the top version. Direction needs the next print." },
  { id: "tweezer-top", name: "Tweezer Top", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Two candles share a similar high after a rally—matched rejection at the highs on SAMPLE tapes." },
  { id: "tweezer-bottom", name: "Tweezer Bottom", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "Two candles share a similar low after a decline—matched support on SAMPLE tapes. Wait for the next print." },
  { id: "rising-wedge", name: "Rising Wedge", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Price rises inside two upward, converging lines. SAMPLE read: buying is tiring; a break of the lower line needs later bars." },
  { id: "bull-flag", name: "Bull Flag", type: "continuation", sentiment: "bullish", confirmation: "medium", description: "A sharp rise, then a tight downward or sideways pause. SAMPLE read: the pause can be a rest, not a new downtrend, if the prior thrust was clean." },
  { id: "double-top", name: "Double Top", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Two similar highs with a dip between them. SAMPLE read: the second high failed to break out; a break of the dip is the usual confirmation." },
  { id: "double-bottom", name: "Double Bottom", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Two similar lows with a bounce between them. SAMPLE read: the second low held; a break of the bounce high is the usual confirmation." },
  { id: "white-marubozu", name: "White Marubozu", type: "neutral", sentiment: "bullish", confirmation: "medium", description: "A tall green body with no wicks: it opened at the low and closed at the high. Buyers controlled the whole period. After a decline it can mark a turn; inside an uptrend it reads as strength. It does not promise the next candle." },
  { id: "black-marubozu", name: "Black Marubozu", type: "neutral", sentiment: "bearish", confirmation: "medium", description: "A tall red body with no wicks: it opened at the high and closed at the low. Sellers controlled the whole period. After a rally it is a warning for longs; inside a downtrend it reads as weakness." },
  { id: "spinning-top", name: "Spinning Top", type: "neutral", sentiment: "neutral", confirmation: "low", description: "A small body with wicks on both sides. Like a doji it shows indecision, but the body is a bit larger. Location matters: after a run it hints at fading momentum; in a range it is often noise." },
  { id: "bearish-harami", name: "Bearish Harami", type: "reversal", sentiment: "bearish", confirmation: "low", description: "After a rally, a tall green candle is followed by a small red body that sits inside it. Buying momentum stalled. Treat it as a warning until a later candle closes lower." },
  { id: "three-inside-up", name: "Three Inside Up", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "After a decline: a tall red, a small green inside it (a bullish harami), then a green that closes above the first candle's open. The third candle is the built-in confirmation." },
  { id: "three-inside-down", name: "Three Inside Down", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "After a rally: a tall green, a small red inside it (a bearish harami), then a red that closes below the first candle's open. The third candle is the built-in confirmation." },
  { id: "three-outside-up", name: "Three Outside Up", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "After a decline: a short red, a green body that engulfs it (a bullish engulfing), then a green that closes higher still. The third candle confirms the engulfing." },
  { id: "three-outside-down", name: "Three Outside Down", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "After a rally: a short green, a red body that engulfs it (a bearish engulfing), then a red that closes lower still. The third candle confirms the engulfing." },
  { id: "on-neck", name: "On-Neck", type: "continuation", sentiment: "bearish", confirmation: "low", description: "In a decline, a long red candle is followed by a small green that opens below its low and closes back at about the red candle's close. Buyers could not get into the red body, so it is traditionally read as a pause before more downside. Compare Piercing Line, which closes past the midpoint." },
  { id: "bullish-counterattack", name: "Bullish Counterattack", type: "reversal", sentiment: "bullish", confirmation: "low", description: "In a decline, a long red candle is followed by a long green that opens far lower and climbs back to close at about the same price. Buyers erased the gap. Weaker than a piercing line; wait for the next candle." },
  { id: "bearish-counterattack", name: "Bearish Counterattack", type: "reversal", sentiment: "bearish", confirmation: "low", description: "In a rally, a long green candle is followed by a long red that opens far higher and falls back to close at about the same price. Sellers erased the gap. Weaker than dark cloud cover; wait for the next candle." },
  { id: "rising-three-methods", name: "Rising Three Methods", type: "continuation", sentiment: "bullish", confirmation: "medium", description: "Five candles in an uptrend: a long green, three small pullback candles that stay inside its range, then a long green that closes above the first. A rest, not a reversal." },
  { id: "falling-three-methods", name: "Falling Three Methods", type: "continuation", sentiment: "bearish", confirmation: "medium", description: "Five candles in a downtrend: a long red, three small bounce candles that stay inside its range, then a long red that closes below the first. Buyers could not take over." },
  { id: "mat-hold", name: "Mat Hold", type: "continuation", sentiment: "bullish", confirmation: "medium", description: "In an uptrend: a long green, a gap higher, three small candles drifting lower that stay above the first candle's low, then a long green to new highs. A bearish mirror exists in downtrends." },
  { id: "upside-tasuki-gap", name: "Upside Tasuki Gap", type: "continuation", sentiment: "bullish", confirmation: "low", description: "In an uptrend: a green, a green that gaps up, then a red that closes inside the gap without filling it. If the gap holds, the uptrend is intact; a full fill cancels the read." },
  { id: "downside-tasuki-gap", name: "Downside Tasuki Gap", type: "continuation", sentiment: "bearish", confirmation: "low", description: "In a downtrend: a red, a red that gaps down, then a green that closes inside the gap without filling it. If the gap holds, the downtrend is intact; a full fill cancels the read." },
  { id: "triangle", name: "Triangle", type: "neutral", sentiment: "neutral", confirmation: "low", description: "Highs and lows squeeze toward a point. SAMPLE read: direction is not the triangle itself—wait for which side breaks, then the next print." },
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

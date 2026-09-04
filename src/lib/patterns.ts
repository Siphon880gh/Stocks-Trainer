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

const patternImage = (file: string) => `${import.meta.env.BASE_URL}patterns/${file}`;

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
  { id: "three-white-soldiers", name: "Three White Soldiers", type: "continuation", sentiment: "bullish", confirmation: "high", description: "Three rising green bodies in a row after a decline or pause—buyers in control on this SAMPLE read." },
  { id: "three-black-crows", name: "Three Black Crows", type: "continuation", sentiment: "bearish", confirmation: "high", description: "Three falling red bodies in a row after a rally or pause—sellers in control on this SAMPLE read." },
  { id: "harami", name: "Harami", type: "reversal", sentiment: "neutral", confirmation: "low", description: "A small body nested inside the prior larger body—indecision after a swing. Direction needs the next print." },
  { id: "tweezer-top", name: "Tweezer Top", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Two candles share a similar high after a rally—matched rejection at the highs on SAMPLE tapes." },
  { id: "tweezer-bottom", name: "Tweezer Bottom", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "Two candles share a similar low after a decline—matched support on SAMPLE tapes. Wait for the next print." },
  { id: "rising-wedge", name: "Rising Wedge", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Price rises inside two upward, converging lines. SAMPLE read: buying is tiring; a break of the lower line needs later bars." },
  { id: "bull-flag", name: "Bull Flag", type: "continuation", sentiment: "bullish", confirmation: "medium", description: "A sharp rise, then a tight downward or sideways pause. SAMPLE read: the pause can be a rest, not a new downtrend, if the prior thrust was clean." },
  { id: "double-top", name: "Double Top", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Two similar highs with a dip between them. SAMPLE read: the second high failed to break out; a break of the dip is the usual confirmation." },
  { id: "double-bottom", name: "Double Bottom", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Two similar lows with a bounce between them. SAMPLE read: the second low held; a break of the bounce high is the usual confirmation." },
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

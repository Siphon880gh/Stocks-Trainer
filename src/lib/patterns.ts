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

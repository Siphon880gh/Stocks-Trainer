/**
 * The 16 candlestick patterns every trader should know (#18), audited against the app in
 * docs/projects/content-graph/IG-16-AUDIT.md, plus the morning / evening star 50% rule (#20).
 * One table feeds /practice/essential-candles, lesson tabs for patterns that only had a generated
 * lesson (patternTabs.ts), the star rule used by the scanner (patternScan.ts) and the Learn group
 * "essential-candles". Type-only imports, so there is no runtime import cycle.
 *
 * Source (loaded 2026-10-22): IG, "16 candlestick patterns every trader should know".
 * Charts are SIMULATED.
 */
import type { OHLC } from "./ohlcData";
import type { LiteracyTerm } from "./literacyTerms";
import type { QuizOption, QuizQuestion } from "./quizData";
import type { PatternTabs } from "./patternTabs";

export const IG16_SOURCE = {
  label: "IG: 16 candlestick patterns every trader should know",
  url: "https://www.ig.com/en/trading-strategies/16-candlestick-patterns-every-trader-should-know-180615",
};

export type Bars = 1 | 2 | 3;
export interface Essential {
  /** Archive pattern id. */
  id: string;
  name: string;
  candles: Bars;
  bias: "bullish" | "bearish" | "neutral";
  rule: string;
  meaning: string;
  confirm: string;
  stop: string;
  /** Related Archive ids shown as variants. */
  variants?: string[];
}

export const ESSENTIALS: Essential[] = [
  { id: "hammer", name: "Hammer", candles: 1, bias: "bullish", rule: "After a decline: a small body at the top of the range, a lower shadow at least twice the body, little or no upper shadow.", meaning: "Sellers pushed price well lower, buyers closed it near the open: lower prices were rejected. Colour matters less than position and wick length; a green body is slightly stronger.", confirm: "The next candle closes higher, ideally at support and on above-average volume.", stop: "Below the hammer's low." },
  { id: "hanging-man", name: "Hanging man", candles: 1, bias: "bearish", rule: "The hammer shape (small body on top, long lower shadow) but after a sustained uptrend.", meaning: "Sellers managed a deep intraday push even though buyers recovered by the close: growing bearish pressure.", confirm: "The next candle closes lower; more significant at resistance or after a long advance.", stop: "Above the hanging man's high." },
  { id: "shooting-star", name: "Shooting star", candles: 1, bias: "bearish", rule: "After a rally: a small body at the bottom of the range, an upper shadow at least twice the body, little or no lower shadow.", meaning: "Buyers pushed sharply higher, sellers closed it near the open: the advance was rejected.", confirm: "A bearish next candle, ideally at resistance.", stop: "Above the shooting star's high." },
  { id: "inverted-hammer", name: "Inverted hammer", candles: 1, bias: "bullish", rule: "The shooting-star shape (long upper shadow, small body at the bottom) but after a downtrend.", meaning: "Buyers probed higher after the decline; on its own it is weak, so the confirmation carries the weight.", confirm: "The next candle closes higher, above the inverted hammer's body.", stop: "Below the inverted hammer's low." },
  { id: "doji", name: "Doji", candles: 1, bias: "neutral", rule: "One candle whose open and close are at or very close to the same price: a cross or plus sign.", meaning: "Neither side won the session: indecision, and possibly exhaustion of the trend before it. A doji after a long move matters more than one mid-trend.", confirm: "The next decisive close; moving averages or volume help judge the location.", stop: "Beyond the doji's opposite extreme, once a direction confirms.", variants: ["gravestone-doji", "dragonfly-doji", "long-legged-doji"] },
  { id: "bullish-engulfing", name: "Bullish engulfing", candles: 2, bias: "bullish", rule: "A small red candle, then a larger green candle whose BODY completely engulfs the first body.", meaning: "Buyers overwhelmed sellers and closed above the prior open: a decisive shift in control.", confirm: "Most reliable at support after a sustained decline; volume on the green candle should exceed the prior candle's.", stop: "Below the engulfing candle's low." },
  { id: "bearish-engulfing", name: "Bearish engulfing", candles: 2, bias: "bearish", rule: "A small green candle, then a larger red candle whose body completely engulfs the first body.", meaning: "Sellers overwhelmed buyers and closed below the prior open.", confirm: "Most reliable at resistance after a sustained advance; higher volume strengthens it.", stop: "Above the bearish engulfing candle's high." },
  { id: "tweezer-top", name: "Tweezer top", candles: 2, bias: "bearish", rule: "Two consecutive candles with matching or near-identical highs after a rally; typically the first green, the second red.", meaning: "The same high was rejected twice: resistance.", confirm: "A lower close after the pair, ideally where the high meets prior resistance.", stop: "Above the shared high." },
  { id: "tweezer-bottom", name: "Tweezer bottom", candles: 2, bias: "bullish", rule: "Two consecutive candles with matching or near-identical lows after a decline; typically the first red, the second green.", meaning: "Buyers defended the same low twice: support.", confirm: "A higher close, ideally where the low meets prior support; a higher-volume second candle adds conviction.", stop: "Below the shared low." },
  { id: "inside-bar", name: "Inside bar", candles: 2, bias: "neutral", rule: "Two candles: the second candle's whole range, high to low including wicks, sits inside the first (mother) bar's range. It need not sit inside the body.", meaning: "The market is coiling inside the prior candle; neither side pushed beyond the mother bar.", confirm: "A close beyond the mother bar's high or low. Traders often place a buy stop above the high and a sell stop below the low and take whichever breaks first.", stop: "Beyond the opposite side of the mother bar." },
  { id: "morning-star", name: "Morning star", candles: 3, bias: "bullish", rule: "After a downtrend: a long red candle, a small-bodied star that gaps down, then a long green candle that closes above the 50% midpoint of the first candle's body.", meaning: "Selling, a pause, then buyers take control. A doji star (morning doji star) is the stronger version; volume often expands on the third candle.", confirm: "The third candle IS the confirmation, but only if it closes above the first body's midpoint.", stop: "Below the star's low.", variants: ["morning-doji-star"] },
  { id: "evening-star", name: "Evening star", candles: 3, bias: "bearish", rule: "After an uptrend: a long green candle, a small-bodied star that gaps up, then a long red candle that closes below the 50% midpoint of the first candle's body.", meaning: "Buying peaks, momentum stalls, sellers take control. The evening doji star is the stronger version.", confirm: "The third candle closes below the first body's midpoint; a high-volume third candle adds conviction.", stop: "Above the star's high.", variants: ["evening-doji-star"] },
  { id: "three-white-soldiers", name: "Three white soldiers", candles: 3, bias: "bullish", rule: "Three large green candles, each opening within the previous body and closing progressively higher, with small or no upper wicks.", meaning: "Sustained, orderly buying after selling or consolidation. Large upper wicks make it weaker; very large candles after an extended move can mean exhaustion instead.", confirm: "Follow-through above the third candle; context decides whether it is a turn or a stretched move.", stop: "Below the first soldier's open." },
  { id: "three-black-crows", name: "Three black crows", candles: 3, bias: "bearish", rule: "Three large red candles, each opening within the previous body and closing progressively lower, with small or no lower wicks.", meaning: "Sustained selling at the top of an uptrend; very large candles after an extended decline can mean the move is stretched (oversold).", confirm: "Follow-through below the third candle; a high-volume third crow is particularly bearish.", stop: "Above the first crow's open." },
  { id: "harami", name: "Bullish harami", candles: 2, bias: "bullish", rule: "A large red candle, then a small green candle whose body sits entirely within the first body.", meaning: "Selling has slowed: an early warning of a possible turn, not an immediate reversal. Less decisive than an engulfing: the harami shows hesitation, the engulfing decisiveness.", confirm: "Watch for a bullish close above the pattern on later candles before acting.", stop: "Below the red candle's low." },
  { id: "bearish-harami", name: "Bearish harami", candles: 2, bias: "bearish", rule: "A large green candle, then a small red candle whose body sits entirely within the first body.", meaning: "Buying is waning, but sellers have not yet taken control: an alert, not an entry.", confirm: "A bearish follow-through close strengthens the case significantly.", stop: "Above the green candle's high." },
  { id: "spinning-top", name: "Spinning top", candles: 1, bias: "neutral", rule: "One candle with a small body centred between roughly equal upper and lower wicks.", meaning: "Both sides fought and neither won. A single spinning top is not a signal; a cluster after a directional move suggests the trend is losing momentum.", confirm: "Volume and other evidence of exhaustion, then a decisive close.", stop: "Beyond the cluster's opposite extreme, once a direction confirms." },
  { id: "white-marubozu", name: "Marubozu", candles: 1, bias: "neutral", rule: "A long body with no (or almost no) wicks: green opened at the low and closed at the high; red opened at the high and closed at the low.", meaning: "One side controlled the whole session: momentum, not a promise about the next candle.", confirm: "Follow-through in the same direction; at the end of a long move it can also be a climax.", stop: "Beyond the marubozu's midpoint or far end.", variants: ["black-marubozu"] },
];

/** Context rules that decide whether any of the patterns above matters. */
export const CONTEXT_RULES: string[] = [
  "Trend: a reversal pattern needs a trend to reverse; the same shape means different things after a rally and after a decline (hammer vs hanging man).",
  "Support and resistance: patterns at a clearly defined level carry more weight than patterns in the middle of nowhere.",
  "Moving averages: a pattern at a widely watched average such as the 200-day adds confluence.",
  "Volume: above-average volume on the signal or confirmation candle adds conviction.",
  "Oscillators: overbought / oversold readings or divergence on RSI or MACD can support the read; they do not replace confirmation.",
  "Confirmation: let the next candle close in the expected direction before treating a pattern as a signal.",
];

// ---------- #20 star rule ----------
export const bodyMid = (c: OHLC): number => (c.open + c.close) / 2;
const body = (c: OHLC) => Math.abs(c.close - c.open);

export interface StarCheck {
  valid: boolean;
  /** Midpoint of the first candle's body. */
  midpoint: number;
  reason: string;
}

/** Morning star: red, small star, green whose close is ABOVE the first body's 50% midpoint. */
export function checkMorningStar(first: OHLC, star: OHLC, third: OHLC): StarCheck {
  const midpoint = bodyMid(first);
  if (!(first.close < first.open)) return { valid: false, midpoint, reason: "Candle 1 must be a long red (bearish) candle." };
  if (!(body(star) < body(first) * 0.5)) return { valid: false, midpoint, reason: "Candle 2 must be a small-bodied star." };
  if (!(third.close > third.open)) return { valid: false, midpoint, reason: "Candle 3 must be green (bullish)." };
  if (!(third.close > midpoint)) return { valid: false, midpoint, reason: `Candle 3 closed at ${third.close}, below the ${midpoint} midpoint of candle 1's body: not a valid morning star yet.` };
  return { valid: true, midpoint, reason: `Candle 3 closed at ${third.close}, above the ${midpoint} midpoint of candle 1's body.` };
}

/** Evening star: green, small star, red whose close is BELOW the first body's 50% midpoint. */
export function checkEveningStar(first: OHLC, star: OHLC, third: OHLC): StarCheck {
  const midpoint = bodyMid(first);
  if (!(first.close > first.open)) return { valid: false, midpoint, reason: "Candle 1 must be a long green (bullish) candle." };
  if (!(body(star) < body(first) * 0.5)) return { valid: false, midpoint, reason: "Candle 2 must be a small-bodied star." };
  if (!(third.close < third.open)) return { valid: false, midpoint, reason: "Candle 3 must be red (bearish)." };
  if (!(third.close < midpoint)) return { valid: false, midpoint, reason: `Candle 3 closed at ${third.close}, above the ${midpoint} midpoint of candle 1's body: not a valid evening star yet.` };
  return { valid: true, midpoint, reason: `Candle 3 closed at ${third.close}, below the ${midpoint} midpoint of candle 1's body.` };
}

export const MORNING_STAR_TAKEAWAY =
  "A morning star is a three-candle pattern where the third (bullish) candle closes above the 50% midpoint of the first (bearish) candle's body.";
export const EVENING_STAR_TAKEAWAY =
  "An evening star is the mirror: the third (bearish) candle closes below the 50% midpoint of the first (bullish) candle's body.";

const b = (name: string, open: number, high: number, low: number, close: number): OHLC => ({ name, open, high, low, close });

/** SIMULATED diagram bars, in the correct order: 1 long red, 2 small star gapped down, 3 green past the midpoint. */
export const MORNING_STAR_DIAGRAM: OHLC[] = [b("1", 110, 110.6, 99.6, 100), b("2", 98.6, 99.2, 97.8, 98.8), b("3", 99.4, 106.6, 99.1, 106.2)];
export const MORNING_DOJI_DIAGRAM: OHLC[] = [b("1", 110, 110.6, 99.6, 100), b("2", 98.7, 99.4, 97.9, 98.7), b("3", 99.4, 106.6, 99.1, 106.2)];
export const EVENING_STAR_DIAGRAM: OHLC[] = [b("1", 100, 110.4, 99.4, 110), b("2", 111.4, 112.2, 110.8, 111.2), b("3", 110.6, 110.9, 103.4, 103.8)];

export interface StarCase {
  id: string;
  kind: "morning" | "evening";
  bars: [OHLC, OHLC, OHLC];
  /** One SIMULATED line shown with the case. */
  note: string;
}

/** "Valid star?" drill: answers come from checkMorningStar / checkEveningStar, never hard-coded. */
export const STAR_CASES: StarCase[] = [
  { id: "ms-valid", kind: "morning", bars: [b("1", 110, 110.6, 99.6, 100), b("2", 98.6, 99.2, 97.8, 98.8), b("3", 99.4, 106.6, 99.1, 106.2)], note: "After a downtrend." },
  { id: "ms-near-miss", kind: "morning", bars: [b("1", 110, 110.6, 99.6, 100), b("2", 98.6, 99.2, 97.8, 98.8), b("3", 99.4, 104.2, 99.1, 103.8)], note: "After a downtrend. The third candle is green and tall-ish." },
  { id: "ms-doji", kind: "morning", bars: [b("1", 52, 52.3, 47.8, 48), b("2", 47.4, 47.9, 46.9, 47.4), b("3", 47.7, 50.9, 47.5, 50.6)], note: "After a downtrend; the star is a doji." },
  { id: "es-valid", kind: "evening", bars: [b("1", 100, 110.4, 99.4, 110), b("2", 111.4, 112.2, 110.8, 111.2), b("3", 110.6, 110.9, 103.4, 103.8)], note: "After an uptrend." },
  { id: "es-near-miss", kind: "evening", bars: [b("1", 100, 110.4, 99.4, 110), b("2", 111.4, 112.2, 110.8, 111.2), b("3", 110.6, 110.9, 105.6, 106.1)], note: "After an uptrend. The third candle is red." },
  { id: "es-doji-near-miss", kind: "evening", bars: [b("1", 40, 44.2, 39.8, 44), b("2", 44.6, 45.1, 44.2, 44.6), b("3", 44.3, 44.5, 42.3, 42.4)], note: "After an uptrend; the star is a doji." },
];
export const starCheck = (c: StarCase): StarCheck =>
  c.kind === "morning" ? checkMorningStar(...c.bars) : checkEveningStar(...c.bars);

// ---------- lesson tabs for patterns that only had a generated lesson ----------
const tabs = (e: Essential, psychology: string[], target: string): PatternTabs => ({
  recognise: [e.rule, `${e.candles === 1 ? "A single candle." : `${e.candles} candles.`}`],
  psychology: [e.meaning, ...psychology],
  trade: { confirmation: e.confirm, entry: e.bias === "neutral" ? "Only after the break closes, in its direction." : `${e.bias === "bullish" ? "Long" : "Exit longs or short"} on the confirming close.`, stop: `${e.stop}`, target },
  general: false,
});
const E = (id: string) => ESSENTIALS.find((e) => e.id === id)!;
export const ESSENTIAL_TABS: Record<string, PatternTabs> = {
  "hanging-man": tabs(E("hanging-man"), ["A hammer after a decline and a hanging man after a rally are the same shape; the prior trend names it."], "Prior support or the base of the rally; plan at least twice the stop distance."),
  "inverted-hammer": tabs(E("inverted-hammer"), ["After an uptrend the same shape is a shooting star (bearish)."], "Prior resistance; plan at least twice the stop distance."),
  doji: tabs(E("doji"), ["Variants: gravestone (long upper wick, bearish at tops), dragonfly (long lower wick, bullish at bottoms), long-legged (long wicks both sides, extreme indecision)."], "The next support or resistance in the direction of the break."),
  "spinning-top": tabs(E("spinning-top"), ["Like a doji, it is a single candle; the body is just a little larger."], "The next support or resistance in the direction of the break."),
  "inside-bar": tabs(E("inside-bar"), ["More reliable when the mother bar is a strong directional candle and on a daily chart or higher."], "The next level beyond the mother bar; a measured move of the mother bar's height is a common reference."),
  harami: tabs(E("harami"), ["Measured on bodies; an inside bar is measured on the full range."], "Prior resistance once confirmed."),
  "bearish-harami": tabs(E("bearish-harami"), ["Measured on bodies; compare the bearish engulfing, which covers the first body."], "Prior support once confirmed."),
};

// ---------- glossary ----------
export const EC_TERMS: LiteracyTerm[] = [
  { id: "star-midpoint-rule", name: "Star 50% (midpoint) rule", category: "process", summary: "A morning/evening star's third candle must close past the midpoint of the first candle's body.", detail: "Morning star: the third (green) candle closes above the 50% midpoint of the first (red) body. Evening star: the third (red) candle closes below the midpoint of the first (green) body. A third candle that stops short is not a valid star yet. Educational, not advice." },
  { id: "pattern-context-rules", name: "Pattern context rules", category: "process", summary: "Trend, support/resistance, moving averages, volume, oscillators and confirmation decide whether a pattern matters.", detail: "The same candle shape is a different signal in a different place. Check the prior trend, the level, a watched average such as the 200-day, volume and an oscillator, then wait for the confirming close. Educational, not advice." },
];

// ---------- Learn group "essential-candles" ----------
type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, extra: Partial<QuizQuestion> = {}): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...extra };
}

export const EC_QUESTIONS: QuizQuestion[] = [
  mc("EC-01", "In a morning star, where must the third (green) candle close?", "C", "Above the 50% midpoint of the first (red) candle's body", ["Anywhere above the star's high", "Above the first candle's high", "Below the first candle's close"], MORNING_STAR_TAKEAWAY, { glossaryTermId: "star-midpoint-rule", patternKey: "morning-star", highlightIndex: 3 }),
  mc("EC-02", "First body: open 110, close 100. Star in between. The third candle is green and closes at 103.8. Valid morning star?", "B", "Not a valid morning star yet: 103.8 is below the 105 midpoint", ["Yes: the third candle is green", "Yes: it closed above the star", "No: morning stars need a red third candle"], "The midpoint of a 110→100 body is 105. A close at 103.8 stops short; wait for a close above 105.", { glossaryTermId: "star-midpoint-rule" }),
  mc("EC-03", "Which candle in a morning star is the 'star'?", "A", "The second (middle) small-bodied candle", ["The first long red candle", "The third long green candle", "Whichever candle has the longest wick"], "Order: 1 long red, 2 the small star (gapping down), 3 the long green that closes past candle 1's midpoint."),
  mc("EC-04", "Evening star: first body opens 100 and closes 110. Where must the third (red) candle close?", "D", "Below 105, the midpoint of the first body", ["Below 100", "Below the star's low", "Anywhere, as long as it is red"], `The midpoint of 100→110 is 105. ${EVENING_STAR_TAKEAWAY}`, { glossaryTermId: "star-midpoint-rule" }),
  mc("EC-05", "Which version of the morning star is considered stronger?", "B", "The morning doji star, whose middle candle is a doji", ["One whose third candle is smaller", "One with no prior downtrend", "One whose star is a long candle"], "A doji in the middle shows the indecision more clearly; the third candle still has to clear the midpoint."),
  mc("EC-06", "How long must a hammer's lower shadow be?", "C", "At least twice the length of the body", ["Exactly equal to the body", "Half the body", "Longer than the prior candle"], "Small body at the top, lower shadow at least 2× the body, little or no upper shadow; the stop goes below the hammer's low.", { patternKey: "hammer", highlightIndex: 2 }),
  mc("EC-07", "A hammer-shaped candle prints after a long rally. What is it called and where is the stop?", "A", "A hanging man; stop above its high", ["A hammer; stop below its low", "A shooting star; stop below its low", "An inverted hammer; no stop needed"], "Same shape, different trend: after an uptrend it is a hanging man, bearish once the next candle closes lower.", { patternKey: "hanging-man" }),
  mc("EC-08", "What separates a shooting star from an inverted hammer?", "D", "The prior trend: shooting star after a rally, inverted hammer after a decline", ["The colour of the body", "The shooting star has a long lower wick", "The inverted hammer needs a gap"], "Both have a long upper shadow and a small body at the bottom. Position decides the name and the bias."),
  mc("EC-09", "How many candles make an inside bar, and what must sit inside what?", "B", "Two: the second candle's full range, wicks included, inside the mother bar's high and low", ["Three: the third candle inside the first body", "One: a small body inside its own wicks", "Two: the second body inside the first body only"], "An inside bar is a two-candle pattern measured on the full high-low range. Body-only containment is a harami.", { patternKey: "inside-bar", highlightIndex: 3, glossaryTermId: "inside-bar" }),
  mc("EC-10", "A common way to trade an inside bar breakout?", "C", "Buy stop above the mother bar's high and sell stop below its low; take whichever breaks", ["Buy at the inside bar's close", "Sell at the mother bar's open", "Wait for a third inside bar"], "The mother bar's range is the box; a close beyond it decides direction."),
  mc("EC-11", "Harami versus engulfing: which statement is right?", "A", "Harami shows hesitation (small body inside); engulfing shows decisiveness (large body covers)", ["Both are entry signals on their own", "Harami is stronger than engulfing", "They are the same pattern in different colours"], "Treat a harami as an early warning and wait for confirmation; an engulfing already shows a decisive shift."),
  mc("EC-12", "What makes three white soldiers weaker or riskier?", "D", "Large upper wicks, or very large candles after an already extended move", ["Each candle opening inside the prior body", "Progressively higher closes", "Small upper wicks"], "Ideal soldiers open within the prior body, close progressively higher near their highs. Oversized candles after a long run can mean exhaustion."),
  mc("EC-13", "A single spinning top appears mid-trend. What does it mean?", "B", "On its own, little; a cluster after a directional move suggests waning momentum", ["A confirmed reversal", "Buy immediately", "The trend will accelerate"], "A spinning top is one candle with a small body between roughly equal wicks; it needs a cluster and context to matter."),
  mc("EC-14", "Which is NOT one of the context rules for candlestick patterns?", "C", "The colour of the candle body decides everything", ["The prior trend", "Support or resistance at the pattern", "Volume and the 200-day moving average"], "Trend, location, moving averages, volume, oscillators and confirmation matter more than body colour.", { glossaryTermId: "pattern-context-rules" }),
  mc("EC-15", "How many candles are a doji and a spinning top?", "A", "One each", ["Two each", "Three each", "A doji is one, a spinning top is two"], "Both are single-candle indecision patterns."),
];

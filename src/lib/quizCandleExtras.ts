/**
 * Extra candlestick content (Task: "completely teach and quiz"): doji / marubozu variants, gap reversals,
 * crows / strikes / breakaways, gap continuations, neck patterns, inverse H&S, long vs short candles,
 * price-action concepts (PA-) and supply / demand zones (SD-).
 * Type-only import from quizData, so there is no runtime import cycle.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import { SCENARIOS } from "./scenarioCharts";
import type { ChartAnnotations } from "./chartAnnotations";

const DESC_HINT = "Pick the matching definition.";
type OptId = "A" | "B" | "C" | "D" | "E";
const IDS: OptId[] = ["A", "B", "C", "D", "E"];

/** Numbered mini-chart choices; `patternId` only when the key is a real pattern id. */
function chartPick(keys: string[], highlight: number[]): QuizOption[] {
  return keys.map((chartKey, i) => ({
    id: IDS[i],
    label: String(i + 1),
    description: "Select this chart",
    chartKey,
    chartHighlightIndex: highlight[i],
  }));
}

function textOptions(rows: Array<[string, string]>): QuizOption[] {
  return rows.map(([label, description], i) => ({ id: IDS[i], label, description }));
}

const DOJI_TYPE_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "long-legged-doji", label: "Long-Legged Doji", description: "Long wicks both ways, open ≈ close." },
  { id: "B", patternId: "dragonfly-doji", label: "Dragonfly Doji", description: "T shape: long lower wick, no upper wick." },
  { id: "C", patternId: "gravestone-doji", label: "Gravestone Doji", description: "Upside-down T: long upper wick, no lower wick." },
  { id: "D", patternId: "cross-doji", label: "Cross Doji", description: "Lower wick longer than the upper wick." },
  { id: "E", patternId: "inverted-cross-doji", label: "Inverted Cross Doji", description: "Upper wick longer than the lower wick." },
];

const MARUBOZU_TYPE_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "bullish-closing-marubozu", label: "Bullish Closing Marubozu", description: "Green, closes at the high, lower wick only." },
  { id: "B", patternId: "bearish-closing-marubozu", label: "Bearish Closing Marubozu", description: "Red, closes at the low, upper wick only." },
  { id: "C", patternId: "bullish-opening-marubozu", label: "Bullish Opening Marubozu", description: "Green, opens at the low, upper wick only." },
  { id: "D", patternId: "bearish-opening-marubozu", label: "Bearish Opening Marubozu", description: "Red, opens at the high, lower wick only." },
  { id: "E", patternId: "white-marubozu", label: "White (Full) Marubozu", description: "Green with no wicks at all." },
];

const GAP_REVERSAL_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "bullish-kicker", label: "Bullish Kicker", description: "Red, then a green that gaps above the red's open." },
  { id: "B", patternId: "bearish-kicker", label: "Bearish Kicker", description: "Green, then a red that gaps below the green's open." },
  { id: "C", patternId: "bullish-abandoned-baby", label: "Bullish Abandoned Baby", description: "Red, island doji below, gap-up green." },
  { id: "D", patternId: "bearish-abandoned-baby", label: "Bearish Abandoned Baby", description: "Green, island doji above, gap-down red." },
  { id: "E", patternId: "morning-star", label: "Morning Star", description: "Red, small body, green into the first body (no island needed)." },
];

const TRI_STAR_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "bullish-tri-star", label: "Bullish Tri-Star", description: "Three dojis at a low, middle one lowest." },
  { id: "B", patternId: "bearish-tri-star", label: "Bearish Tri-Star", description: "Three dojis at a high, middle one highest." },
  { id: "C", patternId: "evening-star", label: "Evening Star", description: "Green, small body, red." },
];

const CROWS_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "two-crows", label: "Two Crows", description: "Second red closes inside the first green's body." },
  { id: "B", patternId: "upside-gap-two-crows", label: "Upside Gap Two Crows", description: "Second red engulfs the first red but stays above the green." },
  { id: "C", patternId: "three-black-crows", label: "Three Black Crows", description: "Three long reds, each closing lower." },
  { id: "D", patternId: "evening-star", label: "Evening Star", description: "Green, small star, red." },
];

const STRIKE_BREAKAWAY_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "bullish-three-line-strike", label: "Bullish Three-Line Strike", description: "Three rising greens, then one red that erases them." },
  { id: "B", patternId: "bearish-three-line-strike", label: "Bearish Three-Line Strike", description: "Three falling reds, then one green that erases them." },
  { id: "C", patternId: "bullish-breakaway", label: "Bullish Breakaway", description: "Red, gap down, drift lower, green closes into the gap." },
  { id: "D", patternId: "bearish-breakaway", label: "Bearish Breakaway", description: "Green, gap up, drift higher, red closes into the gap." },
];

const GAP_CONTINUATION_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "bullish-separating-lines", label: "Bullish Separating Lines", description: "Red, then a green that opens at the red's open." },
  { id: "B", patternId: "bearish-separating-lines", label: "Bearish Separating Lines", description: "Green, then a red that opens at the green's open." },
  { id: "C", patternId: "bullish-side-by-side-white-lines", label: "Bullish Side-by-Side White Lines", description: "Two matching greens gapped above a green." },
  { id: "D", patternId: "bearish-side-by-side-white-lines", label: "Bearish Side-by-Side White Lines", description: "Two matching greens gapped below a red." },
];

const GAP_METHODS_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "upside-gap-three-methods", label: "Upside Gap Three Methods", description: "Two greens with a gap, red fills the gap." },
  { id: "B", patternId: "downside-gap-three-methods", label: "Downside Gap Three Methods", description: "Two reds with a gap, green fills the gap." },
  { id: "C", patternId: "upside-tasuki-gap", label: "Upside Tasuki Gap", description: "Red closes inside the gap, gap stays open." },
  { id: "D", patternId: "downside-tasuki-gap", label: "Downside Tasuki Gap", description: "Green closes inside the gap, gap stays open." },
];

const MAT_HOLD_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "mat-hold", label: "Mat Hold (bullish)", description: "Long green, gap up, small drift, long green." },
  { id: "B", patternId: "bearish-mat-hold", label: "Bearish Mat Hold", description: "Long red, gap down, small bounce, long red." },
  { id: "C", patternId: "falling-three-methods", label: "Falling Three Methods", description: "Long red, three small bounces inside its range (no gap), long red." },
];

const NECK_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "on-neck", label: "On-Neck", description: "Green closes at about the red's low." },
  { id: "B", patternId: "in-neck", label: "In-Neck", description: "Green closes just barely inside the red body." },
  { id: "C", patternId: "thrusting", label: "Thrusting", description: "Green closes well into the red body, below the midpoint." },
  { id: "D", patternId: "piercing-line", label: "Piercing Line", description: "Green closes above the red body's midpoint." },
];

const HS_OPTIONS: QuizOption[] = [
  { id: "A", patternId: "head-shoulders", label: "Head and Shoulders", description: "Three peaks, middle highest." },
  { id: "B", patternId: "inverse-head-shoulders", label: "Inverse Head and Shoulders", description: "Three troughs, middle lowest." },
  { id: "C", patternId: "double-bottom", label: "Double Bottom", description: "Two similar lows." },
];

const sc = (key: string) => SCENARIOS[key];
const lastIdx = (key: string) => sc(key).bars.length - 1;

/** Questions that join the pattern families (QUIZ_QUESTIONS, filtered by patternKey). */

/** Triple top / bottom and wedge questions on the large scenario charts (validated in scenarioCharts). */
const sf = (key: string) => SCENARIOS[key].facts;
const levelsOnly = (key: string): ChartAnnotations => ({ levels: SCENARIOS[key].reveal.levels });
const STRUCTURE_NAMES: Array<[string, string]> = [
  ["Double Top", "Two similar highs, neckline at the dip between."],
  ["Triple Top", "Three similar highs, neckline at the lowest dip."],
  ["Head and Shoulders", "Three peaks, the middle one highest."],
  ["Triple Bottom", "Three similar lows, neckline at the highest bounce."],
  ["Rising Wedge", "Two rising, converging lines."],
];

function tripleQuestions(top: boolean): QuizQuestion[] {
  const key = top ? "sc-triple-top" : "sc-triple-bottom";
  const pk = top ? "triple-top" : "triple-bottom";
  const P = top ? "PB-TT" : "PB-TB";
  const f = sf(key);
  const third = top ? f.top3Index : f.bot3Index;
  const neck = f.neck.toLocaleString("en-US");
  return [
    {
      id: `${P}-01`,
      prompt: `Which chart shows a triple ${top ? "top" : "bottom"}? (The marked candle is the last ${top ? "peak" : "low"} of each structure.)`,
      correctAnswer: "B",
      options: chartPick(
        top ? ["sc-double-top", "sc-triple-top", "sc-head-shoulders"] : ["sc-double-bottom", "sc-triple-bottom", "sc-inverse-head-shoulders"],
        top
          ? [sf("sc-double-top").top2Index, third, sf("sc-head-shoulders").rsIndex]
          : [sf("sc-double-bottom").bot2Index, third, sf("sc-inverse-head-shoulders").rsIndex]
      ),
      optionsAreCharts: true,
      explanation: `Chart 2: three ${top ? "highs" : "lows"} at about the same price. Chart 1 has only two (double ${top ? "top" : "bottom"}); chart 3 has a ${top ? "higher" : "deeper"} middle ${top ? "peak" : "low"} (${top ? "" : "inverse "}head and shoulders).`,
      patternKey: pk,
      highlightIndex: third,
      glossaryTermId: pk,
    },
    {
      id: `${P}-02`,
      prompt: `${top ? "After a rally, price makes three peaks at about the same price, with two dips between them" : "After a decline, price makes three lows at about the same price, with two bounces between them"}. Name the structure.`,
      correctAnswer: top ? "B" : "D",
      options: textOptions(STRUCTURE_NAMES),
      explanation: top
        ? "Triple top: resistance rejected buyers three times. A double top has two peaks; a head and shoulders has a higher middle peak."
        : "Triple bottom: support held three times. It is the mirror of a triple top; a double bottom has only two lows.",
      patternKey: pk,
      highlightIndex: third,
      glossaryTermId: pk,
    },
    {
      id: `${P}-03`,
      prompt: `This triple ${top ? "top" : "bottom"}'s neckline is near ${neck}. What confirms the pattern?`,
      correctAnswer: "B",
      options: textOptions([
        [`A third ${top ? "rejection at resistance" : "bounce at support"}`, "The third touch alone is still just a range."],
        [`A close ${top ? "below" : "above"} the neckline`, `The ${top ? "lowest dip" : "highest bounce"} between the ${top ? "tops" : "lows"} gives way.`],
        [`Any ${top ? "red" : "green"} candle at the third ${top ? "top" : "low"}`, "One candle at the level is a clue, not a break."],
        ["Three touches are enough", "Count alone does not confirm direction."],
      ]),
      explanation: `A close ${top ? "below" : "above"} the neckline (${neck}). Until then the three ${top ? "tops" : "lows"} are only the edge of a range, and a ${top ? "fourth push could break out higher" : "fourth push could break down"}.`,
      patternKey: pk,
      highlightIndex: f.brkIndex,
      annotations: levelsOnly(key),
      glossaryTermId: pk,
    },
    {
      id: `${P}-04`,
      prompt: `After the close ${top ? "below" : "above"} the neckline, price comes back to it. What role does the old neckline usually play now?`,
      correctAnswer: top ? "A" : "B",
      options: textOptions([
        ["Resistance", "Old support, now a ceiling."],
        ["Support", "Old resistance, now a floor."],
        ["No role", "Broken levels are forgotten."],
      ]),
      explanation: top
        ? "Resistance. Broken support often flips to resistance; a failed retest from below is the classic sell trigger (see the Buy or Sell? scenario)."
        : "Support. Broken resistance often flips to support; a held retest from above is the classic buy trigger (see the Buy or Sell? scenario).",
      patternKey: pk,
      highlightIndex: f.retestIndex,
      annotations: levelsOnly(key),
      glossaryTermId: "support-resistance",
    },
  ];
}

function wedgeQuestions(rising: boolean): QuizQuestion[] {
  const key = rising ? "sc-rising-wedge" : "sc-falling-wedge";
  const s = SCENARIOS[key];
  const P = rising ? "PB-WG-R" : "PB-WG-F";
  const lines: ChartAnnotations = { trendlines: s.lines };
  return [
    {
      id: `${P}-01`,
      prompt: `Both drawn lines slope ${rising ? "up" : "down"} and converge; the ${rising ? "lower" : "upper"} line is steeper. Name the structure.`,
      correctAnswer: rising ? "A" : "B",
      options: textOptions([
        ["Rising Wedge", "Both lines up, converging: buying is tiring."],
        ["Falling Wedge", "Both lines down, converging: selling is tiring."],
        ["Bull Flag", "A sharp rise, then a small parallel pullback."],
        ["Triangle", "One line up, one line down (or one flat), converging."],
        ["Channel", "Two parallel lines that do not converge."],
      ]),
      explanation: rising
        ? "Rising wedge. Each push higher gains less ground than the rise in the lows, so the lines squeeze together: buyers are tiring."
        : "Falling wedge. Each push lower gains less ground, so the lines squeeze together: sellers are tiring.",
      patternKey: key,
      highlightIndex: s.facts.b3Index,
      annotations: lines,
      glossaryTermId: "wedge",
    },
    {
      id: `${P}-02`,
      prompt: `How does a ${rising ? "rising" : "falling"} wedge usually resolve, and what confirms it?`,
      correctAnswer: rising ? "B" : "A",
      options: textOptions([
        ["Up: a close above the upper line", "Breakout through the top line."],
        ["Down: a close below the lower line", "Breakdown through the bottom line."],
        ["Either way: the first wick outside a line", "Wicks alone are not closes."],
        ["It never breaks", "Wedges always keep squeezing."],
      ]),
      explanation: rising
        ? "Down, confirmed by a close below the lower line (the highlighted candle). Usually bearish; a close above the upper line cancels the read."
        : "Up, confirmed by a close above the upper line (the highlighted candle). Usually bullish; a close below the lower line cancels the read.",
      patternKey: key,
      highlightIndex: s.facts.brkIndex,
      annotations: lines,
      glossaryTermId: "wedge",
    },
  ];
}

const STRUCTURE_QUESTIONS: QuizQuestion[] = [
  ...tripleQuestions(true),
  ...tripleQuestions(false),
  ...wedgeQuestions(true),
  ...wedgeQuestions(false),
];

export const EXTRA_FAMILY_QUESTIONS: QuizQuestion[] = [
  ...STRUCTURE_QUESTIONS,
  // --- Doji family: types ---
  {
    id: "PB-DJ-01",
    prompt: "Which chart's marked candle is a dragonfly doji?",
    correctAnswer: "B",
    options: chartPick(["gravestone-doji", "dragonfly-doji", "long-legged-doji"], [3, 3, 3]),
    optionsAreCharts: true,
    explanation:
      "Chart 2: open, high and close sit together at the top with a long lower wick (a T). Chart 1 is the upside-down version (gravestone) and chart 3 has long wicks on both sides (long-legged).",
    patternKey: "dragonfly-doji",
    highlightIndex: 3,
    glossaryTermId: "doji-types",
  },
  {
    id: "PB-DJ-02",
    prompt: "The marked candle opened and closed at the same price, with long wicks above and below. Name it.",
    correctAnswer: "A",
    options: DOJI_TYPE_OPTIONS,
    explanation:
      "Long-legged doji: price swung far both ways and ended where it started. Strong indecision; after a long move it can warn the move is tiring, but it needs the next candle.",
    patternKey: "long-legged-doji",
    highlightIndex: 3,
    glossaryTermId: "doji-types",
  },
  {
    id: "PB-DJ-03",
    prompt: "After a decline, the marked candle opens, closes and makes its high at the same price, with a long lower wick. Name it.",
    correctAnswer: "B",
    options: DOJI_TYPE_OPTIONS,
    explanation:
      "Dragonfly doji (T shape). Sellers pushed price down during the period and buyers brought it all the way back. After a decline, that is a possible bottom. Wait for a green confirmation.",
    patternKey: "dragonfly-doji",
    highlightIndex: 3,
    glossaryTermId: "dragonfly-gravestone",
  },
  {
    id: "PB-DJ-04",
    prompt: "After a rally, the marked candle opens, closes and makes its low at the same price, with a long upper wick. Name it.",
    correctAnswer: "C",
    options: DOJI_TYPE_OPTIONS,
    explanation:
      "Gravestone doji (upside-down T). Buyers pushed up, sellers pushed it all the way back. After a rally, a possible top. Wait for a red confirmation.",
    patternKey: "gravestone-doji",
    highlightIndex: 3,
    glossaryTermId: "dragonfly-gravestone",
  },
  {
    id: "PB-DJ-05",
    prompt: "The marked doji has a short upper wick and a longer lower wick, like a cross (†). Name it.",
    correctAnswer: "D",
    options: DOJI_TYPE_OPTIONS,
    explanation:
      "Cross doji: open ≈ close, lower wick longer than the upper. Naming varies between books; the read is still indecision with some rejection of lower prices.",
    patternKey: "cross-doji",
    highlightIndex: 3,
    glossaryTermId: "doji-types",
  },
  {
    id: "PB-DJ-06",
    prompt: "The marked doji has a long upper wick and a shorter lower wick (an upside-down cross). Name it.",
    correctAnswer: "E",
    options: DOJI_TYPE_OPTIONS,
    explanation:
      "Inverted cross doji: open ≈ close, upper wick longer. Indecision with some rejection of higher prices. If the upper wick is huge and there is no lower wick at all, it becomes a gravestone.",
    patternKey: "inverted-cross-doji",
    highlightIndex: 3,
    glossaryTermId: "doji-types",
  },
  {
    id: "PB-DJ-07",
    prompt: "What story does a dragonfly doji's long lower wick tell?",
    correctAnswer: "B",
    options: textOptions([
      ["Sellers were in control the whole time", "Then it would close near the low."],
      ["Sellers pushed price down, but buyers defended lower levels and closed it back at the top", "Rejection of lower prices."],
      ["Nothing; only the body matters", "The wick shows where price went and got pushed back."],
    ]),
    explanation:
      "The wick is where price traveled and got rejected. A dragonfly says buyers defended the lows by the close. It is a clue, not a signal, until the next candle confirms.",
    patternKey: "dragonfly-doji",
    highlightIndex: 3,
    glossaryTermId: "wick-rejection",
  },
  {
    id: "PB-DJ-08",
    prompt: "What does a gravestone doji after a rally suggest?",
    correctAnswer: "A",
    options: textOptions([
      ["Buyers pushed up, sellers defended upper levels and closed it at the low: a possible top", "Rejection of higher prices."],
      ["A guaranteed reversal", "Nothing is guaranteed; confirmation matters."],
      ["Strong buying that will continue", "The close at the low says buyers lost the period."],
    ]),
    explanation:
      "The gravestone closes where it opened, at the low, after trading much higher. Sellers defended the highs. After a rally that is a possible top; a red candle closing below it confirms.",
    patternKey: "gravestone-doji",
    highlightIndex: 3,
    glossaryTermId: "dragonfly-gravestone",
  },
  {
    id: "PB-DJ-MOVE1",
    prompt: "SAMPLE: a long-legged doji prints after a long rally. What is the sensible next step?",
    correctAnswer: "C",
    options: textOptions([
      ["Sell immediately; dojis are bearish", "A doji is indecision, not a direction."],
      ["Buy more; the trend is up", "The doji says buyers did not win this period."],
      ["Wait for the next candle: a red close below the doji's low would confirm weakness", "Let the market pick a side."],
    ]),
    explanation:
      "A doji after a long move says the trend paused. It does not say which way it goes next. Confirmation decides. SAMPLE process, not advice.",
    patternKey: "long-legged-doji",
    highlightIndex: 3,
    glossaryTermId: "pattern-confirmation",
  },
  // --- Marubozu family: opening / closing ---
  {
    id: "PB-MB-01",
    prompt: "The marked long green candle closes exactly at its high but has a lower wick. Name it.",
    correctAnswer: "A",
    options: MARUBOZU_TYPE_OPTIONS,
    explanation: "Bullish closing marubozu: no wick on the closing end, so buyers held control right to the close.",
    patternKey: "bullish-closing-marubozu",
    highlightIndex: 3,
    glossaryTermId: "marubozu-types",
  },
  {
    id: "PB-MB-02",
    prompt: "The marked long red candle closes exactly at its low but has an upper wick. Name it.",
    correctAnswer: "B",
    options: MARUBOZU_TYPE_OPTIONS,
    explanation: "Bearish closing marubozu: it closed at the low, so sellers were still pressing at the end of the period.",
    patternKey: "bearish-closing-marubozu",
    highlightIndex: 3,
    glossaryTermId: "marubozu-types",
  },
  {
    id: "PB-MB-03",
    prompt: "The marked long green candle opens at its low (no lower wick) and has an upper wick. Name it.",
    correctAnswer: "C",
    options: MARUBOZU_TYPE_OPTIONS,
    explanation:
      "Bullish opening marubozu: buyers drove price from the first tick, then gave a little back before the close (the upper wick).",
    patternKey: "bullish-opening-marubozu",
    highlightIndex: 3,
    glossaryTermId: "marubozu-types",
  },
  {
    id: "PB-MB-04",
    prompt: "The marked long red candle opens at its high (no upper wick) and has a lower wick. Name it.",
    correctAnswer: "D",
    options: MARUBOZU_TYPE_OPTIONS,
    explanation:
      "Bearish opening marubozu: sellers drove price down from the open, then buyers clawed a little back (the lower wick). The body is still long, which separates it from a spinning top.",
    patternKey: "bearish-opening-marubozu",
    highlightIndex: 3,
    glossaryTermId: "marubozu-types",
  },
  {
    id: "PB-MB-05",
    prompt: "Why do many traders read a closing marubozu as a bit stronger than an opening marubozu?",
    correctAnswer: "B",
    options: textOptions([
      ["Because it has no wicks at all", "A closing marubozu does have a wick, on the opening end."],
      ["Because it closed at the extreme, so the winning side still had control when the period ended", "No give-back at the close."],
      ["Because it is always followed by a gap", "No pattern guarantees a gap."],
    ]),
    explanation:
      "The close is the final verdict of the period. Closing at the high (or low) means no give-back at the end. An opening marubozu started strong but gave some back.",
    patternKey: "bullish-closing-marubozu",
    highlightIndex: 3,
    glossaryTermId: "marubozu-types",
  },
  {
    id: "PB-MB-06",
    prompt: "Which chart's marked candle is a bearish closing marubozu?",
    correctAnswer: "C",
    options: chartPick(["bearish-opening-marubozu", "bullish-closing-marubozu", "bearish-closing-marubozu"], [3, 3, 3]),
    optionsAreCharts: true,
    explanation:
      "Chart 3: a long red that closes at its low with only an upper wick. Chart 1 opens at its high and has a lower wick (opening marubozu). Chart 2 is green.",
    patternKey: "bearish-closing-marubozu",
    highlightIndex: 3,
    glossaryTermId: "marubozu-types",
  },
  // --- Gap reversals: kickers, abandoned babies, tri-stars ---
  {
    id: "PB-GR-01",
    prompt: "Which chart shows a bullish kicker on the marked candle?",
    correctAnswer: "A",
    options: chartPick(["bullish-kicker", "bullish-counterattack", "bearish-kicker"], [3, 3, 3]),
    optionsAreCharts: true,
    explanation:
      "Chart 1: after a red candle, the green opens with a gap above the red's open and runs. Chart 2 opens lower and only climbs back to the prior close (counterattack). Chart 3 is the bearish kicker.",
    patternKey: "bullish-kicker",
    highlightIndex: 3,
    glossaryTermId: "gap-reversal",
  },
  {
    id: "PB-GR-02",
    prompt: "A red candle, then a green candle that opens with a gap above the red candle's open and closes much higher. Name it.",
    correctAnswer: "A",
    options: GAP_REVERSAL_OPTIONS,
    explanation:
      "Bullish kicker. The gap past the prior open shows sentiment flipped between sessions. If the gap fills, the read is wrong.",
    patternKey: "bullish-kicker",
    highlightIndex: 3,
    glossaryTermId: "gap-reversal",
  },
  {
    id: "PB-GR-03",
    prompt: "A green candle, then a red candle that gaps below the green candle's open and keeps falling. Name it.",
    correctAnswer: "B",
    options: GAP_REVERSAL_OPTIONS,
    explanation: "Bearish kicker: the gap down past the prior open says buyers were overwhelmed between sessions.",
    patternKey: "bearish-kicker",
    highlightIndex: 3,
    glossaryTermId: "gap-reversal",
  },
  {
    id: "PB-GR-04",
    prompt: "Downtrend: a long red, a doji that gaps below it with no wick overlap, then a green that gaps up above the doji. Name it.",
    correctAnswer: "C",
    options: GAP_REVERSAL_OPTIONS,
    explanation:
      "Bullish abandoned baby: the doji is left alone on an island between two gaps. A rare, stronger cousin of the morning star.",
    patternKey: "bullish-abandoned-baby",
    highlightIndex: 4,
    glossaryTermId: "gap-reversal",
  },
  {
    id: "PB-GR-05",
    prompt: "Uptrend: a long green, a doji that gaps above it, then a red that gaps down below the doji. Name it.",
    correctAnswer: "D",
    options: GAP_REVERSAL_OPTIONS,
    explanation: "Bearish abandoned baby: an island doji at the top, then a gap back down. A rare, strong evening-star variant.",
    patternKey: "bearish-abandoned-baby",
    highlightIndex: 4,
    glossaryTermId: "gap-reversal",
  },
  {
    id: "PB-GR-06",
    prompt: "What separates a bullish abandoned baby from an ordinary morning star?",
    correctAnswer: "A",
    options: textOptions([
      ["The middle candle is a doji with gaps on both sides, so even its wicks do not overlap the neighbors", "An island."],
      ["The last candle is red", "The last candle is green in both."],
      ["Nothing; they are the same", "The abandoned baby has stricter gap rules."],
    ]),
    explanation:
      "Both are three-candle bottoms. The abandoned baby adds full gaps (no wick overlap) around a doji, which is why it is rarer and read as stronger.",
    patternKey: "bullish-abandoned-baby",
    highlightIndex: 4,
    glossaryTermId: "gap-reversal",
  },
  {
    id: "PB-GR-07",
    prompt: "After a decline, three dojis print in a row and the middle one sits lower than the other two. Name it.",
    correctAnswer: "A",
    options: TRI_STAR_OPTIONS,
    explanation: "Bullish tri-star: repeated indecision at the lows. Rare, and it needs a green confirmation candle.",
    patternKey: "bullish-tri-star",
    highlightIndex: 5,
    glossaryTermId: "doji-types",
  },
  {
    id: "PB-GR-08",
    prompt: "After a rally, three dojis print in a row and the middle one gaps above the other two. Name it.",
    correctAnswer: "B",
    options: TRI_STAR_OPTIONS,
    explanation: "Bearish tri-star: three periods where buyers could not push on, at the highs. Wait for a red confirmation.",
    patternKey: "bearish-tri-star",
    highlightIndex: 5,
    glossaryTermId: "doji-types",
  },
  {
    id: "PB-GR-MOVE1",
    prompt: "SAMPLE: a bullish kicker just printed. What would most clearly say the idea failed?",
    correctAnswer: "B",
    options: textOptions([
      ["The next candle is a small doji", "A pause is normal."],
      ["Price falls back and fills the gap, closing below the red candle's open", "The gap was the whole story."],
      ["Volume is lower the next day", "A detail, not the invalidation."],
    ]),
    explanation:
      "A kicker is about the gap. If price closes back inside or below it, the sentiment shift did not hold. SAMPLE process, not advice.",
    patternKey: "bullish-kicker",
    highlightIndex: 3,
    glossaryTermId: "pattern-confirmation",
  },
  // --- Crows, strikes, breakaways ---
  {
    id: "PB-CS-01",
    prompt: "Uptrend: a long green, a red that gaps up but closes lower, then a red that opens inside that red's body and closes inside the green's body. Name it.",
    correctAnswer: "A",
    options: CROWS_OPTIONS,
    explanation: "Two crows: the gap up failed and the second red pushed back into the green body. A bearish warning that needs follow-through.",
    patternKey: "two-crows",
    highlightIndex: 4,
    glossaryTermId: "reversal-vs-continuation",
  },
  {
    id: "PB-CS-02",
    prompt: "Uptrend: a long green, a small red that gaps up, then a larger red that engulfs the small red but closes above the green's close. Name it.",
    correctAnswer: "B",
    options: CROWS_OPTIONS,
    explanation:
      "Upside gap two crows: two reds sitting above a gap. Because the gap is still open, it is only a warning until price closes into the green body.",
    patternKey: "upside-gap-two-crows",
    highlightIndex: 4,
    glossaryTermId: "pattern-confirmation",
  },
  {
    id: "PB-CS-03",
    prompt: "What is the key difference between two crows and upside gap two crows?",
    correctAnswer: "C",
    options: textOptions([
      ["Two crows has three reds", "That is three black crows."],
      ["Upside gap two crows ends with a green", "Both end with a red."],
      ["In two crows the last red closes inside the first green body; in upside gap two crows it stays above the green's close", "Whether the gap is closed."],
    ]),
    explanation: "Closing into the green body (two crows) is the stronger bearish statement. Leaving the gap open (upside gap two crows) is weaker.",
    patternKey: "two-crows",
    highlightIndex: 4,
    glossaryTermId: "reversal-vs-continuation",
  },
  {
    id: "PB-CS-04",
    prompt: "Three rising green candles, then one long red that opens at the high and closes below the first green's open. Name it.",
    correctAnswer: "A",
    options: STRIKE_BREAKAWAY_OPTIONS,
    explanation:
      "Bullish three-line strike (named for the trend before the strike). Classic books call it continuation; in practice it often reverses. Treat the direction as unclear.",
    patternKey: "bullish-three-line-strike",
    highlightIndex: 4,
    glossaryTermId: "three-line-strike",
  },
  {
    id: "PB-CS-05",
    prompt: "Three falling red candles, then one long green that opens at the low and closes above the first red's open. Name it.",
    correctAnswer: "B",
    options: STRIKE_BREAKAWAY_OPTIONS,
    explanation: "Bearish three-line strike. The strike candle erases the whole decline; whether that is a reversal or a pause is decided by the next candles.",
    patternKey: "bearish-three-line-strike",
    highlightIndex: 4,
    glossaryTermId: "three-line-strike",
  },
  {
    id: "PB-CS-06",
    prompt: "Why does this trainer treat the three-line strike as 'wait' rather than a clear buy or sell?",
    correctAnswer: "B",
    options: textOptions([
      ["Because it is too rare to matter", "Rarity is not the issue."],
      ["Because the textbook says continuation but the strike candle often starts a reversal, so the signal points both ways", "Conflicting reads."],
      ["Because it only works on crypto", "It is a general candle pattern."],
    ]),
    explanation:
      "When the classic label and common behavior disagree, the honest move is to let the next candles decide instead of guessing.",
    patternKey: "bullish-three-line-strike",
    highlightIndex: 4,
    glossaryTermId: "three-line-strike",
  },
  {
    id: "PB-CS-07",
    prompt: "Downtrend: a long red, a red that gaps down, smaller candles drifting lower, then a long green that closes inside the first gap. Name it.",
    correctAnswer: "C",
    options: STRIKE_BREAKAWAY_OPTIONS,
    explanation: "Bullish breakaway: sellers broke away with a gap, ran out of steam, and the green candle reclaimed the gap area.",
    patternKey: "bullish-breakaway",
    highlightIndex: 6,
    glossaryTermId: "reversal-vs-continuation",
  },
  {
    id: "PB-CS-08",
    prompt: "Uptrend: a long green, a green that gaps up, smaller candles drifting higher, then a long red that closes inside the first gap. Name it.",
    correctAnswer: "D",
    options: STRIKE_BREAKAWAY_OPTIONS,
    explanation: "Bearish breakaway: the breakaway rally faded and the red candle closed back into the gap.",
    patternKey: "bearish-breakaway",
    highlightIndex: 6,
    glossaryTermId: "reversal-vs-continuation",
  },
  {
    id: "PB-CS-MOVE1",
    prompt: "SAMPLE: a bearish breakaway just completed. Where does the bearish idea become wrong?",
    correctAnswer: "A",
    options: textOptions([
      ["A close back above the highs of the drifting candles", "Above the pattern's high."],
      ["Any small green candle", "Small bounces happen."],
      ["It cannot be wrong", "Every pattern can fail."],
    ]),
    explanation: "The pattern says the late rally failed. Price making new highs above it says the rally did not fail. SAMPLE process, not advice.",
    patternKey: "bearish-breakaway",
    highlightIndex: 6,
    glossaryTermId: "pattern-confirmation",
  },
  // --- Gap continuations ---
  {
    id: "PB-GC-01",
    prompt: "Uptrend: a red pullback candle, then a green that opens at the same price as the red's open and rallies away. Name it.",
    correctAnswer: "A",
    options: GAP_CONTINUATION_OPTIONS,
    explanation: "Bullish separating lines: the pullback was wiped out at the open. The uptrend resumes.",
    patternKey: "bullish-separating-lines",
    highlightIndex: 3,
    glossaryTermId: "gap-continuation",
  },
  {
    id: "PB-GC-02",
    prompt: "Downtrend: a green bounce candle, then a red that opens at the same price as the green's open and falls away. Name it.",
    correctAnswer: "B",
    options: GAP_CONTINUATION_OPTIONS,
    explanation: "Bearish separating lines: the bounce was erased at the open and sellers took over again.",
    patternKey: "bearish-separating-lines",
    highlightIndex: 3,
    glossaryTermId: "gap-continuation",
  },
  {
    id: "PB-GC-03",
    prompt: "Uptrend: a green, then two similar green candles that gap up above it and open at about the same price. Name it.",
    correctAnswer: "C",
    options: GAP_CONTINUATION_OPTIONS,
    explanation: "Bullish side-by-side white lines: the gap holds for two periods. Continuation.",
    patternKey: "bullish-side-by-side-white-lines",
    highlightIndex: 3,
    glossaryTermId: "gap-continuation",
  },
  {
    id: "PB-GC-04",
    prompt: "Downtrend: a red, then two similar green candles that gap down below it and cannot close the gap. Name it.",
    correctAnswer: "D",
    options: GAP_CONTINUATION_OPTIONS,
    explanation:
      "Bearish side-by-side white lines: the textbook version uses two green (white) candles. They are weak bounces under a gap, so the downtrend usually continues. Some cheat sheets draw them red; the textbook does not.",
    patternKey: "bearish-side-by-side-white-lines",
    highlightIndex: 3,
    glossaryTermId: "gap-continuation",
  },
  {
    id: "PB-GC-05",
    prompt: "Uptrend: two green candles with a gap between them, then a red that opens inside the second body and closes inside the first, filling the gap. Name it.",
    correctAnswer: "A",
    options: GAP_METHODS_OPTIONS,
    explanation: "Upside gap three methods: the red fills the gap but holds within the first green. Continuation if the next candles rise.",
    patternKey: "upside-gap-three-methods",
    highlightIndex: 3,
    glossaryTermId: "gap-continuation",
  },
  {
    id: "PB-GC-06",
    prompt: "Downtrend: two red candles with a gap between them, then a green that opens inside the second body and closes inside the first, filling the gap. Name it.",
    correctAnswer: "B",
    options: GAP_METHODS_OPTIONS,
    explanation: "Downside gap three methods: the bounce fills the gap but stays inside the first red. Continuation if the next candles fall.",
    patternKey: "downside-gap-three-methods",
    highlightIndex: 3,
    glossaryTermId: "gap-continuation",
  },
  {
    id: "PB-GC-07",
    prompt: "Tasuki gap vs gap three methods: what is the difference in the third candle?",
    correctAnswer: "C",
    options: textOptions([
      ["Tasuki's third candle is a doji", "It is a normal body."],
      ["Gap three methods has no gap", "Both start with a gap."],
      ["Tasuki's third candle closes inside the gap and leaves part open; gap three methods closes past it and fills the gap", "Partly filled vs filled."],
    ]),
    explanation:
      "A partly filled gap (tasuki) still has open space acting as support or resistance. A filled gap (gap three methods) relies on the first candle's body holding instead.",
    patternKey: "upside-gap-three-methods",
    highlightIndex: 3,
    glossaryTermId: "gap-continuation",
  },
  {
    id: "PB-GC-08",
    prompt: "Downtrend: a long red, a gap lower, three small bounce candles that stay below the first candle's high, then a long red to new lows. Name it.",
    correctAnswer: "B",
    options: MAT_HOLD_OPTIONS,
    explanation:
      "Bearish mat hold: the downtrend mirror of the mat hold. The gap and the weak bounce say sellers stayed in charge.",
    patternKey: "bearish-mat-hold",
    highlightIndex: 5,
    glossaryTermId: "reversal-vs-continuation",
  },
  {
    id: "PB-GC-09",
    prompt: "What defines separating lines?",
    correctAnswer: "A",
    options: textOptions([
      ["The second candle opens at the same price as the first candle's open, then moves the other way", "Same open, opposite colors."],
      ["The second candle engulfs the first", "That is engulfing."],
      ["Both candles close at the same price", "That is meeting/counterattack lines."],
    ]),
    explanation: "Same open, opposite direction. Compare meeting lines (same close) and engulfing (bigger body).",
    patternKey: "bullish-separating-lines",
    highlightIndex: 3,
    glossaryTermId: "gap-continuation",
  },
  // --- Neck patterns ---
  {
    id: "PB-NK-01",
    prompt: "Downtrend: a long red, then a green that opens below the red's low and closes just barely inside the red body. Name it.",
    correctAnswer: "B",
    options: NECK_OPTIONS,
    explanation: "In-neck: buyers only nudged into the body. Sellers likely remain in control (bearish continuation).",
    patternKey: "in-neck",
    highlightIndex: 3,
    glossaryTermId: "neck-patterns",
  },
  {
    id: "PB-NK-02",
    prompt: "Downtrend: a long red, then a green that opens lower and closes well into the red body, but below its midpoint. Name it.",
    correctAnswer: "C",
    options: NECK_OPTIONS,
    explanation: "Thrusting: a real bounce, but short of the midpoint. Past the midpoint it would be a piercing line.",
    patternKey: "thrusting",
    highlightIndex: 3,
    glossaryTermId: "neck-patterns",
  },
  {
    id: "PB-NK-03",
    prompt: "Order these by how far the green closes into the prior red body, weakest to strongest.",
    correctAnswer: "A",
    options: textOptions([
      ["On-neck → in-neck → thrusting → piercing line", "Low, just inside, deeper, past the midpoint."],
      ["Piercing line → thrusting → in-neck → on-neck", "Reversed."],
      ["In-neck → on-neck → piercing line → thrusting", "Mixed up."],
    ]),
    explanation:
      "The deeper the green closes into the red body, the more buyers achieved. Only past the midpoint (piercing line) is it read as bullish.",
    patternKey: "in-neck",
    highlightIndex: 3,
    glossaryTermId: "neck-patterns",
  },
  {
    id: "PB-NK-04",
    prompt: "A cheat sheet lists 'meeting lines'. Which pattern already in this trainer is it?",
    correctAnswer: "B",
    options: [
      { id: "A", patternId: "piercing-line", label: "Piercing line", description: "Closes past the midpoint." },
      { id: "B", patternId: "bullish-counterattack", label: "Counterattack lines", description: "Second candle closes at the prior close." },
      { id: "C", patternId: "bullish-separating-lines", label: "Separating lines", description: "Second candle opens at the prior open." },
    ],
    explanation: "Meeting lines and counterattack lines are two names for the same pair: opposite colors that close at about the same price.",
    patternKey: "bullish-counterattack",
    highlightIndex: 3,
    glossaryTermId: "meeting-lines",
  },
  // --- Inverse head and shoulders ---
  {
    id: "PB-IHS-01",
    prompt: "After a decline, price makes a low, a deeper low, then a higher low, and each bounce stops near the same line. Name the shape.",
    correctAnswer: "B",
    options: HS_OPTIONS,
    explanation:
      "Inverse head and shoulders: left shoulder, deeper head, right shoulder. The line across the bounce highs is the neckline.",
    patternKey: "inverse-head-shoulders",
    highlightIndex: sc("sc-inverse-head-shoulders").facts.headIndex,
    chartSize: "large",
    glossaryTermId: "neckline",
  },
  {
    id: "PB-IHS-02",
    prompt: "When is an inverse head and shoulders confirmed?",
    correctAnswer: "C",
    options: textOptions([
      ["When the head prints", "The head is just the lowest low so far."],
      ["When the right shoulder starts", "Price can still roll over."],
      ["When a candle closes above the neckline", "The break is the confirmation."],
    ]),
    explanation:
      "Until price closes above the neckline it is just a range of lows. After the break, the neckline often acts as support on a retest.",
    patternKey: "inverse-head-shoulders",
    highlightIndex: sc("sc-inverse-head-shoulders").facts.brkIndex,
    chartSize: "large",
    revealAnnotations: sc("sc-inverse-head-shoulders").reveal,
    glossaryTermId: "neckline",
  },
];

/** Long vs short candles (appended to Reading One Candle). */
export const LONG_SHORT_CANDLE_QUESTIONS: QuizQuestion[] = [
  {
    id: "OC-18",
    prompt: "Which chart's marked candle is a long red candle?",
    correctAnswer: "B",
    options: chartPick(["short-red-candle", "long-red-candle", "long-green-candle", "short-green-candle"], [3, 3, 3, 3]),
    optionsAreCharts: true,
    explanation:
      "Chart 2: a red body far taller than the bodies before it. Chart 1 is red but small; charts 3 and 4 are green.",
    patternKey: "long-red-candle",
    highlightIndex: 3,
    glossaryTermId: "long-vs-short-candle",
  },
  {
    id: "OC-19",
    prompt: "The marked green body is several times taller than the candles before it. What does it tell you?",
    correctAnswer: "A",
    options: textOptions([
      ["Buyers pushed price a long way from open to close this period", "Strong buying in that period."],
      ["Price will keep rising tomorrow", "One candle is not a forecast."],
      ["Sellers won the period", "Green means close above open."],
    ]),
    explanation: "A long green candle is strength in that period. Whether it continues depends on context and the next candles.",
    patternKey: "long-green-candle",
    highlightIndex: 3,
    glossaryTermId: "long-vs-short-candle",
  },
  {
    id: "OC-20",
    prompt: "The marked candle is small and green with a small range. What is the best read?",
    correctAnswer: "C",
    options: textOptions([
      ["Strong buying", "The body is tiny."],
      ["A bullish reversal", "Nothing reversed."],
      ["Low conviction: buyers edged ahead, but neither side pushed hard", "Quiet period."],
    ]),
    explanation: "Short bodies (either color) mean little happened. They matter more as part of a pattern, such as the middle of a star.",
    patternKey: "short-green-candle",
    highlightIndex: 3,
    glossaryTermId: "long-vs-short-candle",
  },
  {
    id: "OC-21",
    prompt: "How do you decide whether a candle is 'long'?",
    correctAnswer: "B",
    options: textOptions([
      ["Any body larger than $100", "Size is relative to the chart."],
      ["Compare its body with the recent candles on the same chart; much taller is long", "Relative size."],
      ["Green candles are long, red candles are short", "Color says nothing about length."],
    ]),
    explanation: "Long and short are relative. A big candle on a quiet chart can be small on a volatile one.",
    patternKey: "long-green-candle",
    highlightIndex: 3,
    glossaryTermId: "long-vs-short-candle",
  },
  {
    id: "OC-22",
    prompt: "Which chart's marked candle is a short red candle?",
    correctAnswer: "D",
    options: chartPick(["long-red-candle", "short-green-candle", "long-green-candle", "short-red-candle"], [3, 3, 3, 3]),
    optionsAreCharts: true,
    explanation: "Chart 4: red (close below open) with a small body and range. Chart 1 is a long red; charts 2 and 3 are green.",
    patternKey: "short-red-candle",
    highlightIndex: 3,
    glossaryTermId: "long-vs-short-candle",
  },
];

const plan = (key: string) => sc(key).plan!;
const rr = (key: string) => {
  const p = plan(key);
  return (Math.abs(p.target - p.entry) / Math.abs(p.entry - p.stop)).toFixed(1);
};

/** Price action: S/R, structure, breakouts, entries / stops / targets, SMC labels, trade management (PA-18+). */
export const PRICE_ACTION_QUESTIONS: QuizQuestion[] = [
  {
    id: "PA-01",
    prompt: "Price stalled near 64,000 three times before finally breaking above it. Before the break, what was 64,000?",
    correctAnswer: "A",
    options: textOptions([
      ["Resistance: sellers kept showing up there", "Repeated rejections from above."],
      ["Support", "Support is below price, where buyers step in."],
      ["A random number", "Three rejections make it a level traders watch."],
    ]),
    explanation:
      "Resistance is where selling repeatedly stopped the rally. After a close above, old resistance often becomes support, which is what the retest checks.",
    patternKey: "sc-breakout-retest",
    highlightIndex: sc("sc-breakout-retest").facts.r3Index,
    chartSize: "large",
    annotations: { levels: [{ price: 64000, label: "64,000", tone: "neutral" }] },
    revealAnnotations: sc("sc-breakout-retest").reveal,
    glossaryTermId: "support-resistance",
  },
  {
    id: "PA-02",
    prompt: "Swing highs: about 63,000 → 63,600 → 64,200. Swing lows: about 62,800 → 63,350. What is the structure?",
    correctAnswer: "B",
    options: textOptions([
      ["Downtrend (LH + LL)", "The highs are rising."],
      ["Uptrend (HH + HL)", "Higher highs and higher lows."],
      ["Range", "Price is making progress upward."],
    ]),
    explanation: "Higher highs plus higher lows define an uptrend. The trendline through the higher lows is the line to watch.",
    patternKey: "sc-trendline-break",
    highlightIndex: sc("sc-trendline-break").facts.peakIndex,
    chartSize: "large",
    glossaryTermId: "market-structure",
  },
  {
    id: "PA-03",
    prompt: "In a downtrend, which pair of swing labels do you expect?",
    correctAnswer: "C",
    options: textOptions([
      ["HH and HL", "That is an uptrend."],
      ["HH and LL", "That is an expanding range."],
      ["LH and LL", "Lower highs, lower lows."],
    ]),
    explanation: "Lower highs and lower lows. The first higher high after a run of LH/LL is an early hint the downtrend may be ending.",
    glossaryTermId: "market-structure",
  },
  {
    id: "PA-04",
    prompt: "Price has bounced between 63,500 and 64,500 for weeks and now sits at 64,000 with a hammer. What is the honest read?",
    correctAnswer: "C",
    options: textOptions([
      ["Strong buy: hammers are bullish", "A hammer needs a decline into support."],
      ["Strong sell: ranges always break down", "No such rule."],
      ["Wait: mid-range, the pattern has nothing meaningful to reverse", "Edges matter, the middle does not."],
    ]),
    explanation:
      "In a range, patterns at the edges (support or resistance) carry weight; in the middle, risk and reward are both unclear.",
    patternKey: "sc-range-middle",
    highlightIndex: lastIdx("sc-range-middle"),
    chartSize: "large",
    revealAnnotations: sc("sc-range-middle").reveal,
    glossaryTermId: "trend-vs-range",
  },
  {
    id: "PA-05",
    prompt: "What counts as a breakout of resistance?",
    correctAnswer: "B",
    options: textOptions([
      ["A wick that pokes above the level", "Wicks above and closes below are failed tests."],
      ["A candle that closes above the level", "Use the close."],
      ["Price getting close to the level", "Near is not through."],
    ]),
    explanation: "The close is the period's verdict. A wick through and a close back below is a rejection (and sometimes a liquidity sweep).",
    glossaryTermId: "breakout-retest",
  },
  {
    id: "PA-06",
    prompt: "After breaking above 64,000, price pulls back to 64,000, holds, and prints a green candle. What is this called?",
    correctAnswer: "A",
    options: textOptions([
      ["A breakout retest that held (old resistance acting as support)", "Role reversal."],
      ["A failed breakout", "It would need to close back below the level."],
      ["A double top", "No second peak here."],
    ]),
    explanation:
      "The retest asks whether buyers defend the broken level. Holding with a green confirmation is a common entry area. Retests do not always happen and do not always hold.",
    patternKey: "sc-breakout-retest",
    highlightIndex: lastIdx("sc-breakout-retest"),
    chartSize: "large",
    revealAnnotations: sc("sc-breakout-retest").reveal,
    glossaryTermId: "breakout-retest",
  },
  {
    id: "PA-07",
    prompt: `SAMPLE double-top trade: entry ${plan("sc-double-top").entry}, stop ${plan("sc-double-top").stop}. For 1:2 risk:reward, where is the target?`,
    correctAnswer: "B",
    options: textOptions([
      [String(plan("sc-double-top").entry - (plan("sc-double-top").stop - plan("sc-double-top").entry)), "That is only 1:1."],
      [String(plan("sc-double-top").target), "Risk × 2 below entry."],
      [String(plan("sc-double-top").stop + 2 * (plan("sc-double-top").stop - plan("sc-double-top").entry)), "That is above the stop, the wrong direction for a short."],
    ]),
    explanation: `Risk = ${plan("sc-double-top").stop} − ${plan("sc-double-top").entry} = ${plan("sc-double-top").stop - plan("sc-double-top").entry}. A 1:2 target is twice that below entry: ${plan("sc-double-top").target}. The reveal shows the red risk box and the green reward box.`,
    patternKey: "sc-double-top",
    highlightIndex: lastIdx("sc-double-top"),
    chartSize: "large",
    revealAnnotations: sc("sc-double-top").reveal,
    glossaryTermId: "risk-reward",
  },
  {
    id: "PA-08",
    prompt: "Where does a stop loss belong for a long entered on a breakout retest?",
    correctAnswer: "C",
    options: textOptions([
      ["At a round number you feel comfortable losing", "The stop should be where the idea is proven wrong."],
      ["Just above entry", "That is not below the idea."],
      ["Below the retest low / back under the broken level, where the breakout idea fails", "Invalidation."],
    ]),
    explanation:
      "If price closes back under the broken level, the breakout failed. The stop sits just beyond that point, and the target is then sized from that risk.",
    patternKey: "sc-breakout-retest",
    highlightIndex: lastIdx("sc-breakout-retest"),
    chartSize: "large",
    revealAnnotations: sc("sc-breakout-retest").reveal,
    glossaryTermId: "risk-reward",
  },
  {
    id: "PA-09",
    prompt: "A trade risks 400 to make 800. Does the 1:2 ratio mean it will probably win?",
    correctAnswer: "B",
    options: textOptions([
      ["Yes, good R:R means a good trade", "R:R says nothing about probability."],
      ["No. It only means one winner pays for two losers; the setup still has to be valid", "Payoff, not odds."],
      ["Yes, if the stop is tight", "Tight stops get hit more often."],
    ]),
    explanation: "R:R is payoff math. The pattern, the level and the confirmation are what make a setup worth taking at all.",
    glossaryTermId: "risk-reward",
  },
  {
    id: "PA-10",
    prompt: "Why wait for a confirmation candle after a reversal pattern?",
    correctAnswer: "A",
    options: textOptions([
      ["The pattern only shows the attempt; the next candle shows whether the other side followed through", "Evidence, not hope."],
      ["Because patterns are always wrong without it", "Not always, but often enough to matter."],
      ["To get a better price", "Confirmation usually costs some price."],
    ]),
    explanation: "Confirmation trades a slightly worse price for more evidence. Without it, many patterns simply fail.",
    glossaryTermId: "pattern-confirmation",
  },
  {
    id: "PA-11",
    prompt: "In an uptrend, price closes above the last swing high. In smart-money-concepts language, this is…",
    correctAnswer: "A",
    options: textOptions([
      ["A bullish break of structure (BOS)", "Trend continuing."],
      ["A liquidity sweep", "A sweep wicks through and closes back."],
      ["A breaker block", "That is a failed order block."],
    ]),
    explanation: "A close beyond the last swing in the trend direction is a BOS. Breaking the last higher low instead would warn of a change in character.",
    glossaryTermId: "break-of-structure",
  },
  {
    id: "PA-12",
    prompt: "Price spikes below a set of equal lows, then closes back above them with a long lower wick. What is this often called?",
    correctAnswer: "B",
    options: textOptions([
      ["A breakdown", "It closed back above."],
      ["A liquidity sweep: stops below the lows were triggered, then price snapped back", "Stop run."],
      ["A bearish order block", "That is the last green before a drop."],
    ]),
    explanation: "Sweeps look like hammers at the lows. They only matter once the next candle confirms buyers are in control.",
    glossaryTermId: "liquidity-sweep",
  },
  {
    id: "PA-13",
    prompt: "What is a bullish order block?",
    correctAnswer: "C",
    options: textOptions([
      ["Any green candle", "Too broad."],
      ["The highest candle of an uptrend", "That is a swing high."],
      ["The last red candle before a strong rally that breaks structure", "Marked as a zone."],
    ]),
    explanation:
      "Traders mark that last red candle as a zone and watch the reaction when price returns, much like a demand zone. An exit order block is the opposite zone used as a profit-taking area.",
    glossaryTermId: "order-block",
  },
  {
    id: "PA-14",
    prompt: "Price closes straight through a bullish order block, then rallies back up into it and stalls. What is the block now called?",
    correctAnswer: "A",
    options: textOptions([
      ["A breaker block: a failed order block now acting from the other side", "Flipped role."],
      ["A fresh demand zone", "It was broken, so it is no longer fresh demand."],
      ["A doji", "A doji is one candle."],
    ]),
    explanation: "Like support turning into resistance, a broken block can act the other way on the retest.",
    patternKey: "sc-zone-flip",
    highlightIndex: lastIdx("sc-zone-flip"),
    chartSize: "large",
    revealAnnotations: sc("sc-zone-flip").reveal,
    glossaryTermId: "breaker-block",
  },
  {
    id: "PA-15",
    prompt: "Price closed below a rising trendline, then rallied back to the line and was rejected. What does that say?",
    correctAnswer: "B",
    options: textOptions([
      ["The uptrend is stronger than ever", "The line broke."],
      ["The trend is weakening: the line flipped from support to resistance", "Break and failed retest."],
      ["Nothing; trendlines do not matter once broken", "Broken lines often get retested."],
    ]),
    explanation: "A break plus a failed retest is two pieces of evidence that buyers lost control of the trend.",
    patternKey: "sc-trendline-break",
    highlightIndex: lastIdx("sc-trendline-break"),
    chartSize: "large",
    revealAnnotations: sc("sc-trendline-break").reveal,
    glossaryTermId: "trendline",
  },
  {
    id: "PA-16",
    prompt: "Where is the neckline of a double top?",
    correctAnswer: "A",
    options: textOptions([
      ["At the low between the two tops", "The dip that separates them."],
      ["At the highest top", "That is resistance."],
      ["Halfway up the first rally", "Not a defined level."],
    ]),
    explanation: "The neckline is the dip between the tops. The pattern is only confirmed by a close below it.",
    patternKey: "sc-double-top",
    highlightIndex: sc("sc-double-top").facts.brkIndex,
    chartSize: "large",
    revealAnnotations: sc("sc-double-top").reveal,
    glossaryTermId: "neckline",
  },
  {
    id: "PA-17",
    prompt: "A cheat sheet says 'after a retest the move always continues'. What is the honest correction?",
    correctAnswer: "C",
    options: textOptions([
      ["It is correct", "Retests fail often."],
      ["Retests never work", "Too far the other way."],
      ["A retest often continues, but it can fail; that is why the stop sits just beyond the level", "Probabilities, not promises."],
    ]),
    explanation: "Retests improve the odds and give a clear invalidation point. They do not guarantee anything.",
    glossaryTermId: "breakout-retest",
  },
  ...tradeManagementQuestions(),
];

/** Trade management (framework: wait through uncertainty → entry from a defined edge → stop at invalidation → trailing stop → profit target). Numbers come from the scenario facts. */
function tradeManagementQuestions(): QuizQuestion[] {
  const n = (v: number) => v.toLocaleString("en-US");
  const rg = sf("sc-range-middle");
  const pb = sf("sc-pullback-entry");
  const pbPlan = plan("sc-pullback-entry");
  const t = sf("sc-trailing-stop");
  const risk0 = t.entry - t.baseStop;
  const locked = t.stop3 - t.entry;
  const left = t.target - t.close;
  const riskLeft = t.close - t.stop3;
  const planned = (t.target - t.entry) / risk0;
  const trail = { patternKey: "sc-trailing-stop", highlightIndex: lastIdx("sc-trailing-stop"), chartSize: "large" as const, revealAnnotations: sc("sc-trailing-stop").reveal };
  return [
    {
      id: "PA-18",
      prompt: `Price has chopped between about ${n(rg.rangeBottom)} and ${n(rg.rangeTop)} for weeks, and the latest candle sits in the middle. What would turn this uncertainty into a clear signal?`,
      correctAnswer: "A",
      options: textOptions([
        [`A close above ${n(rg.rangeTop)} (or below ${n(rg.rangeBottom)}), ideally with a retest that holds`, "Price leaves the chop at an edge."],
        ["One more green candle in the middle of the range", "The middle has no edge in either direction."],
        ["Time: after enough sideways weeks, a move is due", "Time alone is not a signal."],
      ]),
      explanation:
        "Chop in the middle of a range is the no-trade zone: no nearby place to be wrong and no clear target. A close through an edge (or a confirmed reaction at one) is the clear signal; until then, waiting is the decision.",
      patternKey: "sc-range-middle",
      highlightIndex: lastIdx("sc-range-middle"),
      chartSize: "large",
      revealAnnotations: sc("sc-range-middle").reveal,
      glossaryTermId: "no-trade-zone",
    },
    {
      id: "PA-19",
      prompt: "Which of these is NOT an entry from a defined edge?",
      correctAnswer: "C",
      options: textOptions([
        ["Buying a breakout retest that holds above the old resistance", "Breakout: wrong if price closes back under the level."],
        ["Buying a bounce off a higher low in an uptrend after a green confirmation", "Pullback: wrong if the higher low breaks."],
        ["Buying because the stock has fallen a lot and \"feels cheap\"", "An opinion with no price where the idea is wrong."],
      ]),
      explanation:
        "Breakout, pullback and reversal entries each come with a price that proves the idea wrong, so the stop has an obvious home. \"Feels cheap\" has no such price.",
      glossaryTermId: "entry-types",
    },
    {
      id: "PA-20",
      prompt: `Uptrend: higher lows at about ${n(pb.l1)} and ${n(pb.l2)} along a rising trendline. Price dipped to ${n(pb.pbLow)}, at the trendline and near the old swing high, and the last candle closed green. Which entry type is this?`,
      correctAnswer: "B",
      options: textOptions([
        ["Breakout", "No level is being closed through; price is dipping, not breaking out."],
        ["Pullback: buying a higher low inside an existing uptrend", "Trend, dip to support, confirmation."],
        ["Reversal", "The trend is not changing direction; it is continuing."],
      ]),
      explanation:
        "A pullback entry buys a dip inside a trend at a defined level (here the rising trendline and the old swing high) once a candle confirms. The reveal shows the higher lows, the trendline and the plan.",
      patternKey: "sc-pullback-entry",
      highlightIndex: lastIdx("sc-pullback-entry"),
      chartSize: "large",
      revealAnnotations: sc("sc-pullback-entry").reveal,
      glossaryTermId: "entry-types",
    },
    {
      id: "PA-21",
      prompt: "A downtrend makes a double bottom at support, then closes above the neckline. Which entry type is that?",
      correctAnswer: "C",
      options: textOptions([
        ["Pullback", "A pullback buys a dip inside an uptrend; here the trend was down."],
        ["Breakout of a range top", "There was no range top being broken; it is a pattern at support."],
        ["Reversal: a confirmed pattern at a level turns the trend", "The neckline close is the confirmation."],
      ]),
      explanation:
        "Reversal entries come from a completed pattern at a level (double bottom, inverse head and shoulders, hammer plus confirmation at support). The edge is the pattern's low: below it, the reversal idea is wrong.",
      patternKey: "sc-double-bottom",
      highlightIndex: lastIdx("sc-double-bottom"),
      chartSize: "large",
      revealAnnotations: sc("sc-double-bottom").reveal,
      glossaryTermId: "entry-types",
    },
    {
      id: "PA-22",
      prompt: `SAMPLE pullback trade: entry ${n(pbPlan.entry)}, stop ${n(pbPlan.stop)}. Why does the stop sit there?`,
      correctAnswer: "A",
      options: textOptions([
        [`Just under the pullback low (${n(pb.pbLow)}): a close below it breaks the higher-low structure, so the idea is wrong`, "Invalidation."],
        ["It is a round amount the trader is comfortable losing", "The stop goes where the idea fails, then the size fits the stop."],
        ["As far away as possible so it never gets hit", "Wide stops make the losses big."],
      ]),
      explanation: `Risk = ${n(pbPlan.entry)} − ${n(pbPlan.stop)} = ${n(pbPlan.entry - pbPlan.stop)}; the 2R target is ${n(pbPlan.target)}. The stop is set by the chart (where the thesis is invalidated), which keeps the loss small and known before entry.`,
      patternKey: "sc-pullback-entry",
      highlightIndex: lastIdx("sc-pullback-entry"),
      chartSize: "large",
      revealAnnotations: sc("sc-pullback-entry").reveal,
      glossaryTermId: "risk-reward",
    },
    {
      id: "PA-23",
      prompt: "Price is drifting toward your stop. What keeps the loss small?",
      correctAnswer: "A",
      options: textOptions([
        ["Leave the stop where the idea is wrong and accept the planned loss", "Small, known loss."],
        ["Move the stop lower to give the trade more room", "That turns a small planned loss into a bigger unplanned one."],
        ["Cancel the stop and wait for price to come back", "Hope is not a plan; losses can grow without limit."],
      ]),
      explanation: "The stop was placed at invalidation before entry. Moving it away only makes the loss larger when the idea is already failing.",
      glossaryTermId: "risk-reward",
    },
    {
      id: "PA-24",
      prompt: `SAMPLE long: bought the breakout at ${n(t.entry)}, first stop ${n(t.baseStop)} (back under the ${n(t.breakLevel)} base top). The trend then printed higher lows at ${n(t.hl1)}, ${n(t.hl2)} and ${n(t.hl3)}. Trailing the stop 40 under each new higher low, where is it now?`,
      correctAnswer: "B",
      options: textOptions([
        [n(t.baseStop), "That is the original stop; it was never raised."],
        [n(t.stop3), "40 under the latest higher low."],
        [n(t.stop1), "That was the first step; two higher lows came after it."],
      ]),
      explanation: `The stop climbs in steps: ${n(t.baseStop)} → ${n(t.stop1)} → ${n(t.stop2)} → ${n(t.stop3)}. The reveal draws it as a red stair-step under price.`,
      ...trail,
      glossaryTermId: "trailing-stop",
    },
    {
      id: "PA-25",
      prompt: "Why trail the stop up instead of leaving it at the original stop?",
      correctAnswer: "A",
      options: textOptions([
        ["It protects open profit while still letting the trend run", "Lock in, stay in."],
        ["It guarantees a bigger win", "A trailed stop gives back some profit when it is hit."],
        ["It lets you sell at the exact top", "No stop does that; it exits after the turn."],
      ]),
      explanation: "Once price has moved away from a new higher low, a stop under that low turns part of the open profit into a locked-in gain. The trade stays on as long as the trend keeps making higher lows.",
      glossaryTermId: "trailing-stop",
    },
    {
      id: "PA-26",
      prompt: "On a long trade, when may the trailing stop move down?",
      correctAnswer: "C",
      options: textOptions([
        ["When price pulls back toward it", "That is exactly when the stop is doing its job."],
        ["After a big red candle, to avoid getting stopped out", "Lowering the stop raises the loss."],
        ["Never: a long's trailing stop only moves up (or stays)", "One-way ratchet."],
      ]),
      explanation: "A trailing stop is a ratchet. Raising it protects profit; lowering it undoes the plan and turns a small loss into a big one.",
      glossaryTermId: "trailing-stop",
    },
    {
      id: "PA-27",
      prompt: `Same trade: the stop now sits at ${n(t.stop3)}. If price closes below it, how does the trade end versus the ${n(t.entry)} entry?`,
      correctAnswer: "A",
      options: textOptions([
        [`A locked-in gain of about ${n(locked)} (${(locked / risk0).toFixed(1)}R on the ${n(risk0)} first risk)`, "Stop above entry = profit protected."],
        [`A loss of ${n(risk0)}`, "That was the first stop, before it was trailed."],
        ["Nothing happens; trailing stops only work in downtrends", "They work in any trend you are trading with."],
      ]),
      explanation: `${n(t.stop3)} − ${n(t.entry)} = ${n(locked)}. Once the trailed stop is above entry, the worst case is a gain.`,
      ...trail,
      glossaryTermId: "trailing-stop",
    },
    {
      id: "PA-28",
      prompt: `Price is ${n(t.close)}, just under the planned target ${n(t.target)} (the old high); the trailed stop is ${n(t.stop3)}. What does the plan say?`,
      correctAnswer: "B",
      options: textOptions([
        ["Hold for more: the trend is strong", "The reward left is now smaller than the risk left."],
        [`Take profit (or tighten the stop): about ${n(left)} left to gain versus ${n(riskLeft)} to lose (≈${(left / riskLeft).toFixed(1)}:1)`, "Reward no longer justifies risk."],
        ["Add to the position at the old high", "Buying into resistance with little room left."],
      ]),
      explanation: `Reward left = ${n(t.target)} − ${n(t.close)} = ${n(left)}; risk to the trailed stop = ${n(t.close)} − ${n(t.stop3)} = ${n(riskLeft)}. When what is left to gain is smaller than what you can give back, the target has done its job. The reveal shows both boxes.`,
      ...trail,
      glossaryTermId: "taking-profit",
    },
    {
      id: "PA-29",
      prompt: `Before buying the breakout at ${n(t.entry)} with the stop at ${n(t.baseStop)}, what reward-to-risk did the old high at ${n(t.target)} offer?`,
      correctAnswer: "A",
      options: textOptions([
        [`About ${planned.toFixed(1)}:1 (${n(t.target - t.entry)} reward vs ${n(risk0)} risk), worth taking`, "Planned before entry."],
        ["About 1:1", `The target is ${n(t.target - t.entry)} away and the stop only ${n(risk0)}.`],
        ["You only know after the trade", "Target and stop are both known before entry."],
      ]),
      explanation: "Plan the reward before entry: find the target (here the old high) and the stop, and only take the trade if the ratio is worth it.",
      ...trail,
      glossaryTermId: "taking-profit",
    },
    {
      id: "PA-30",
      prompt: "A breakout looks good, but the next resistance is only 150 above the entry and the stop at invalidation is 300 below. What does planning the reward first say?",
      correctAnswer: "C",
      options: textOptions([
        ["Take it: breakouts usually run", "The plan says the payoff is too small."],
        ["Take it, but move the stop to 150 so the ratio looks like 1:1", "The stop belongs at invalidation, not where the math looks nice."],
        ["Skip it or wait for a better entry: 150 / 300 is only 0.5:1", "Reward does not justify the risk."],
      ]),
      explanation: "If the realistic target is closer than the stop, one loss wipes out two wins. Skip it, or wait for a retest that gives a closer stop or for the resistance to break.",
      glossaryTermId: "taking-profit",
    },
  ];
}

const zoneShade = (top: number, bottom: number, label: string): ChartAnnotations => ({
  zones: [{ fromIndex: 3, top, bottom, label, tone: "neutral" }],
});

/** Supply / demand zones. */
export const SUPPLY_DEMAND_QUESTIONS: QuizQuestion[] = [
  {
    id: "SD-01",
    prompt: "A small base candle, then a big red candle that drops away fast. When price later rallies back to that base, what is the shaded area?",
    correctAnswer: "A",
    options: textOptions([
      ["A supply zone: sellers overwhelmed buyers there before", "Base + big drop."],
      ["A demand zone", "Demand forms before a big rally."],
      ["A doji", "A doji is a single candle."],
    ]),
    explanation:
      "Supply zone: the base is where sell orders built up, and the impulse candle proves sellers won. On the return (bar 9) sellers showed up again (bar 10).",
    patternKey: "supply-zone",
    highlightIndex: 3,
    annotations: zoneShade(64380, 64220, "Zone"),
    glossaryTermId: "supply-zone",
  },
  {
    id: "SD-02",
    prompt: "A small base candle, then a big green candle that rallies away. Price later falls back into the base. What is the shaded area?",
    correctAnswer: "B",
    options: textOptions([
      ["A supply zone", "Supply forms before a big drop."],
      ["A demand zone: buyers overwhelmed sellers there before", "Base + big rally."],
      ["Resistance", "It sits below price."],
    ]),
    explanation: "Demand zone: unfilled buy interest may still sit in the base. Here price returned (bar 9) and bounced (bar 10).",
    patternKey: "demand-zone",
    highlightIndex: 3,
    annotations: zoneShade(64130, 63980, "Zone"),
    glossaryTermId: "demand-zone",
  },
  {
    id: "SD-03",
    prompt: "In a demand zone, which candle is the base?",
    correctAnswer: "C",
    options: textOptions([
      ["The biggest green candle", "That is the impulse."],
      ["The candle that returns to the zone", "That is the test."],
      ["The small-body candle right before the big move away", "Where orders built up."],
    ]),
    explanation: "The base is the pause (small body) right before the impulse. The zone is drawn around the base, not around the impulse.",
    patternKey: "demand-zone",
    highlightIndex: 3,
    glossaryTermId: "base-candle",
  },
  {
    id: "SD-04",
    prompt: "What makes the departure from a zone convincing?",
    correctAnswer: "A",
    options: textOptions([
      ["A big-body impulse candle, several times the base body, leaving fast", "Speed and size."],
      ["Several small overlapping candles", "A slow drift leaves a weak zone."],
      ["A long wick on the base", "Wicks are not the departure."],
    ]),
    explanation: "The impulse candle proves one side overwhelmed the other. In this trainer's sample charts, it is at least 3× the base body.",
    patternKey: "demand-zone",
    highlightIndex: 4,
    glossaryTermId: "impulse-candle",
  },
  {
    id: "SD-05",
    prompt: "How do you draw a demand zone from one base candle?",
    correctAnswer: "B",
    options: textOptions([
      ["From the impulse candle's high to its low", "The zone is the base, not the impulse."],
      ["From the base's body top down to the base's low", "Body to wick."],
      ["A single line at the base's close", "Zones are areas."],
    ]),
    explanation: "Demand: base body top to base low. Supply: base high down to base body bottom. Areas, not exact prices.",
    patternKey: "demand-zone",
    highlightIndex: 3,
    annotations: zoneShade(64130, 63980, "Demand zone"),
    glossaryTermId: "demand-zone",
  },
  {
    id: "SD-06",
    prompt: "Why is a fresh zone usually stronger than one that has already been tested twice?",
    correctAnswer: "C",
    options: textOptions([
      ["Fresh zones are bigger", "Size is not the reason."],
      ["Old zones cannot be drawn", "They can."],
      ["Each visit fills some of the waiting orders, so fewer remain", "Orders get used up."],
    ]),
    explanation: "The first return gets the most attention. Repeated tests weaken a zone until it breaks.",
    glossaryTermId: "fresh-vs-tested-zone",
  },
  {
    id: "SD-07",
    prompt: "Price falls into a fresh demand zone with one huge red candle that closes inside it, no rejection wick. What is the careful read?",
    correctAnswer: "C",
    options: textOptions([
      ["Buy now; demand always holds", "Zones break."],
      ["Sell now; the zone is broken", "It has not closed below the zone yet."],
      ["Wait: let the zone prove itself with a bullish candle, or break with a close below", "No reaction yet."],
    ]),
    explanation:
      "A big body straight into a zone shows sellers still in control. Wait for a bullish rejection inside the zone (buy idea) or a close below it (zone broken).",
    patternKey: "sc-demand-under-pressure",
    highlightIndex: lastIdx("sc-demand-under-pressure"),
    chartSize: "large",
    revealAnnotations: sc("sc-demand-under-pressure").reveal,
    glossaryTermId: "fresh-vs-tested-zone",
  },
  {
    id: "SD-08",
    prompt: "A demand zone is broken by a big red close. Price later rallies back into it. What might the zone do now?",
    correctAnswer: "A",
    options: textOptions([
      ["Act as supply: trapped buyers may sell there (a zone flip)", "Role reversal."],
      ["Act as stronger demand", "It already failed."],
      ["Nothing, it disappears", "Broken zones are often retested."],
    ]),
    explanation: "Same idea as support becoming resistance, drawn as an area. The retest from below is where the flip gets tested.",
    patternKey: "sc-zone-flip",
    highlightIndex: lastIdx("sc-zone-flip"),
    chartSize: "large",
    revealAnnotations: sc("sc-zone-flip").reveal,
    glossaryTermId: "zone-flip",
  },
  {
    id: "SD-09",
    prompt: "Difference between a zone and a support/resistance line?",
    correctAnswer: "B",
    options: textOptions([
      ["There is none", "Different construction."],
      ["A zone is the base area of one strong departure; S/R is a price touched many times", "Origin vs repetition."],
      ["Zones only exist in crypto", "They apply to any market."],
    ]),
    explanation: "S/R comes from repeated touches. A zone comes from one strong move away from a base. They often overlap, which adds weight.",
    glossaryTermId: "zone-flip",
  },
  {
    id: "SD-10",
    prompt: "Price returns to a fresh demand zone and prints a bullish engulfing inside it. Where does a sensible stop go for a long?",
    correctAnswer: "B",
    options: textOptions([
      ["Inside the zone, near its top", "Normal noise inside the zone would hit it."],
      ["Just below the zone's low", "Below the area that should hold."],
      ["No stop needed in a zone", "Zones fail."],
    ]),
    explanation: `If price closes below the demand zone, the idea is wrong. In the sample scenario: entry ${plan("sc-demand-zone").entry}, stop ${plan("sc-demand-zone").stop} (below the zone), target ${plan("sc-demand-zone").target} (1:${rr("sc-demand-zone")}).`,
    patternKey: "sc-demand-zone",
    highlightIndex: lastIdx("sc-demand-zone"),
    chartSize: "large",
    revealAnnotations: sc("sc-demand-zone").reveal,
    glossaryTermId: "demand-zone",
  },
  {
    id: "SD-11",
    prompt: "Which chart shows a supply zone being respected on the return?",
    correctAnswer: "A",
    options: chartPick(["supply-zone", "demand-zone"], [8, 8]),
    optionsAreCharts: true,
    explanation:
      "Chart 1: base, big drop, rally back into the base area, then a red rejection. Chart 2 is the mirror: a demand zone holding.",
    patternKey: "supply-zone",
    highlightIndex: 8,
    glossaryTermId: "supply-zone",
  },
  {
    id: "SD-12",
    prompt: "An order block and a demand zone: how are they related?",
    correctAnswer: "C",
    options: textOptions([
      ["Opposites", "They point the same way."],
      ["Unrelated ideas", "Very similar idea."],
      ["Close cousins: both mark where a strong move started and watch the reaction on return", "Different names, similar logic."],
    ]),
    explanation:
      "A bullish order block (last red before a strong rally) often sits inside or next to a demand zone. Treat both as areas to watch, not guarantees.",
    glossaryTermId: "order-block",
  },
];

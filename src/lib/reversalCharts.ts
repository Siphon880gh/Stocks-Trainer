/**
 * Reversal chart patterns lesson (/practice/reversal-charts): deepen head & shoulders, double/triple
 * tops and bottoms, and wedges with neckline, volume, measured-move, confirmation, retest and
 * failure rules. Rectangle is taught as a separate continuation/range pattern, not a triple bottom.
 * Sources: StockCharts ChartSchool (fetched 2026-10-22). Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";

export const AS_OF = "2026-10-22";
export interface Src { label: string; url: string }
const s = (label: string, url: string): Src => ({ label, url });

export const SRC = {
  hsTop: s("StockCharts: Head and Shoulders Top", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-patterns/head-and-shoulders-top"),
  hsBot: s("StockCharts: Head and Shoulders Bottom", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-patterns/head-and-shoulders-bottom-or-reverse-head-and-shoulders"),
  dt: s("StockCharts: Double Top Reversal", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-patterns/double-top-reversal"),
  db: s("StockCharts: Double Bottom Reversal", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-patterns/double-bottom-reversal"),
  fw: s("StockCharts: Falling Wedge", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-patterns/falling-wedge-ascending-wedge"),
  rw: s("StockCharts: Rising Wedge", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-patterns/rising-wedge"),
  rect: s("StockCharts: Rectangle", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-patterns/rectangle"),
  invDb: s("Investopedia: Double Bottom", "https://www.investopedia.com/terms/d/doublebottom.asp"),
};

export type RevId =
  | "head-shoulders" | "inverse-head-shoulders"
  | "double-top" | "double-bottom"
  | "triple-top" | "triple-bottom"
  | "rising-wedge" | "falling-wedge";

export interface RevPattern {
  id: RevId;
  name: string;
  side: "bullish" | "bearish";
  /** Neckline / confirmation level. */
  confirm: string;
  measured: string;
  volume: string;
  retest: string;
  failure: string;
  recognise: string[];
  psychology: string[];
  source: Src;
  /** Chart key in PATTERN_OHLC. */
  chartKey: string;
}

export const REVERSAL_PATTERNS: RevPattern[] = [
  {
    id: "head-shoulders",
    name: "Head and Shoulders (top)",
    side: "bearish",
    confirm: "A close below the neckline (the line through the two troughs between the three peaks).",
    measured: "From the neckline break, project down the height of the head above the neckline.",
    volume: "Volume often rises into the left shoulder and head, then fades on the right shoulder; a pickup on the neckline break helps.",
    retest: "After the break, the old neckline often acts as resistance on a bounce. A failed retest keeps the short case alive.",
    failure: "A close back above the neckline (and especially above the right shoulder) invalidates the breakdown.",
    recognise: [
      "After an advance: left shoulder, higher head, lower right shoulder (buyers could not make a new high).",
      "Neckline joins the two troughs between the peaks; it can slope up or down.",
      "The pattern is only a candidate until a candle closes below the neckline.",
    ],
    psychology: [
      "The head is the last push of the uptrend; the right shoulder shows demand failing at a lower high.",
      "Breaking the neckline means the buyers who defended the troughs have lost.",
      "A measured move gives a planning target, not a promise.",
    ],
    source: SRC.hsTop,
    chartKey: "head-shoulders",
  },
  {
    id: "inverse-head-shoulders",
    name: "Inverse Head and Shoulders",
    side: "bullish",
    confirm: "A close above the neckline (the line through the two peaks between the three troughs).",
    measured: "From the neckline break, project up the depth of the head below the neckline.",
    volume: "Selling often peaks at the head; the right shoulder is quieter; volume ideally expands on the neckline break.",
    retest: "After the break, the old neckline often acts as support on a pullback.",
    failure: "A close back below the neckline (and especially below the right shoulder) cancels the breakout.",
    recognise: [
      "After a decline: left shoulder, deeper head, higher right shoulder (sellers could not make a new low).",
      "Neckline joins the two peaks between the troughs.",
      "Wait for a close above the neckline before treating it as confirmed.",
    ],
    psychology: [
      "The head is capitulation; the higher right shoulder shows selling pressure fading.",
      "Breaking the neckline means the sellers who capped the peaks have lost.",
      "A retest that holds is a common, lower-stress entry than chasing the first breakout bar.",
    ],
    source: SRC.hsBot,
    chartKey: "inverse-head-shoulders",
  },
  {
    id: "double-top",
    name: "Double Top",
    side: "bearish",
    confirm: "A close below the neckline (the low of the dip between the two highs).",
    measured: "From the neckline break, project down the height from the tops to the neckline.",
    volume: "The second top often prints on lighter volume than the first; volume ideally expands on the neckline break.",
    retest: "Broken neckline often acts as resistance on a bounce.",
    failure: "A close back above the neckline — or a new high above both tops — cancels the pattern.",
    recognise: [
      "After an advance: two peaks at about the same price with a clear dip between them.",
      "The neckline is the lowest point of that dip.",
      "Two tops alone are not a signal; the close below the neckline is.",
    ],
    psychology: [
      "The second peak fails to attract enough new buyers to break resistance.",
      "Breaking the dip's low shows the bulls who defended that pullback have given up.",
      "A change in trend and a momentum reversal from the prior leading price action — still confirmed only by the neckline break.",
    ],
    source: SRC.dt,
    chartKey: "double-top",
  },
  {
    id: "double-bottom",
    name: "Double Bottom",
    side: "bullish",
    confirm: "A close above the neckline (the high of the bounce between the two lows).",
    measured: "From the neckline break, project up the height from the neckline down to the lows.",
    volume: "The second low often prints on lighter volume; volume ideally expands on the neckline break.",
    retest: "Broken neckline often acts as support on a pullback.",
    failure: "A close back below the neckline — or a new low below both bottoms — cancels the pattern.",
    recognise: [
      "After a decline: two troughs at about the same price with a clear bounce between them (a \"W\" shape).",
      "The neckline is the highest point of that bounce.",
      "Confirmation is a close above the neckline, not the second low alone.",
    ],
    psychology: [
      "The second low holds: sellers could not force a new extreme.",
      "Breaking the bounce high shows the bears who capped the middle peak have lost.",
      "It marks a change in trend and a momentum reversal from the prior decline — still only after confirmation.",
    ],
    source: SRC.db,
    chartKey: "double-bottom",
  },
  {
    id: "triple-top",
    name: "Triple Top",
    side: "bearish",
    confirm: "A close below the neckline (the lowest of the two dips between the three peaks).",
    measured: "From the neckline break, project down the height from the tops to the neckline.",
    volume: "Later peaks often show fading volume; the break ideally expands.",
    retest: "Broken neckline often becomes resistance.",
    failure: "A close back above the neckline, or a breakout above the three peaks, invalidates it.",
    recognise: [
      "Three peaks at about the same resistance with two dips between them.",
      "The neckline is the lowest dip.",
      "Not a rectangle: the prior trend is up, and the signal is a downside break of the dips — not a sideways range in a trend.",
    ],
    psychology: [
      "Buyers tested the same ceiling three times and failed.",
      "Breaking the dips shows that defence has collapsed.",
      "Three equal highs without a neckline break are still just resistance tests inside a range.",
    ],
    source: SRC.dt,
    chartKey: "triple-top",
  },
  {
    id: "triple-bottom",
    name: "Triple Bottom",
    side: "bullish",
    confirm: "A close above the neckline (the highest of the two bounces between the three lows).",
    measured: "From the neckline break, project up the height from the neckline down to the lows.",
    volume: "Later lows often show fading volume; the break ideally expands.",
    retest: "Broken neckline often becomes support.",
    failure: "A close back below the neckline, or a breakdown below the three lows, invalidates it.",
    recognise: [
      "Three troughs at about the same support with two bounces between them.",
      "The neckline is the highest bounce.",
      "Not a rectangle: a rectangle is a horizontal trading range that can break either way and is usually a continuation pause; a triple bottom is a reversal candidate after a decline, confirmed only by an upside neckline break.",
    ],
    psychology: [
      "Sellers tested the same floor three times and failed.",
      "Breaking the bounces shows that supply has been absorbed.",
      "Until the neckline closes above, it is still a range — treat it like any other support test.",
    ],
    source: SRC.db,
    chartKey: "triple-bottom",
  },
  {
    id: "rising-wedge",
    name: "Rising Wedge",
    side: "bearish",
    confirm: "A close below the lower rising trendline.",
    measured: "A common plan is a return toward the start of the wedge; treat measured moves as guidance, not guarantees.",
    volume: "Volume often contracts as the wedge rises (effort fades into the highs).",
    retest: "Broken lower line can act as resistance on a bounce.",
    failure: "A decisive close above the upper line cancels the bearish case.",
    recognise: [
      "Two upward-sloping, converging trendlines: each push higher gains less ground.",
      "Usually bearish: a reversal after an advance, or a bearish continuation when it forms in a downtrend (a rising pause).",
      "Context decides reversal vs continuation; the break of the lower line is the trigger in both cases.",
    ],
    psychology: [
      "Buyers are still lifting price, but each rally is weaker — demand is tiring.",
      "When the lower line breaks, late longs are trapped.",
      "Rising wedge = the bearish wedge; falling wedge = the bullish wedge.",
    ],
    source: SRC.rw,
    chartKey: "rising-wedge",
  },
  {
    id: "falling-wedge",
    name: "Falling Wedge",
    side: "bullish",
    confirm: "A close above the upper falling trendline.",
    measured: "A common plan is a return toward the start of the wedge; treat measured moves as guidance, not guarantees.",
    volume: "Volume often contracts as the wedge falls; expands on the upside break.",
    retest: "Broken upper line can act as support on a pullback.",
    failure: "A decisive close below the lower line cancels the bullish case.",
    recognise: [
      "Two downward-sloping, converging trendlines: each push lower gains less ground.",
      "Usually bullish: a reversal after a decline, or a bullish continuation when it forms in an uptrend (a falling pause).",
      "Context decides reversal vs continuation; the break of the upper line is the trigger in both cases.",
    ],
    psychology: [
      "Sellers are still pressing price, but each decline is weaker — supply is tiring.",
      "When the upper line breaks, late shorts are trapped.",
      "Falling wedge = the bullish wedge.",
    ],
    source: SRC.fw,
    chartKey: "falling-wedge",
  },
];

export const RECTANGLE_VS_TRIPLE = {
  title: "Triple bottom is not a rectangle",
  points: [
    "A rectangle (trading range) has roughly equal highs and lows that form two parallel horizontal boundaries. It is a pause: the break can be up or down, and in a trend it is often a continuation pattern.",
    "A triple bottom has three similar lows after a decline. It is a bullish reversal candidate only after a close above the neckline (the highest bounce between the lows).",
    "The same sideways tape can look like either. Ask: was there a clear prior decline, and did price close above the bounce highs? If yes, read triple bottom. If price is consolidating in a trend with equal highs and lows and no reversal claim yet, read rectangle.",
    "Never label a pattern \"triple bottom or rectangle\" as if they were the same setup.",
  ],
  source: SRC.rect,
};

/** Custom three-tab content for the thin Archive entries (consumed by patternTabs). */
export const REVERSAL_TABS = Object.fromEntries(
  REVERSAL_PATTERNS.map((p) => [
    p.id,
    {
      recognise: p.recognise,
      psychology: p.psychology,
      trade: {
        confirmation: p.confirm,
        entry: `${p.side === "bullish" ? "Long" : "Exit longs or short"} on the confirming close, or on a retest of the broken level that holds.`,
        stop: p.failure,
        target: p.measured,
      },
      general: false as const,
    },
  ]),
);

export const REVERSAL_TERMS: LiteracyTerm[] = [
  {
    id: "measured-move",
    name: "Measured move (pattern target)",
    category: "markets",
    summary: "A planning distance taken from the pattern's height and projected from the breakout.",
    detail:
      "Head and shoulders: head-to-neckline height projected from the neckline break. Double/triple top or bottom: pattern height from the neckline. Flags and rectangles use the same idea with their own heights. It is a reference, not a promise. Educational, not advice.",
  },
  {
    id: "pattern-retest",
    name: "Retest (throwback / pullback)",
    category: "markets",
    summary: "Price returns to a broken neckline or boundary to test it from the other side.",
    detail:
      "After a downside break, a bounce into the old neckline that fails is a classic short trigger. After an upside break, a pullback that holds the neckline is a classic long trigger. Educational, not advice.",
  },
  {
    id: "pattern-invalidation",
    name: "Pattern invalidation",
    category: "process",
    summary: "The price close that cancels a chart-pattern read.",
    detail:
      "Examples: a close back above a broken head-and-shoulders neckline; a new high above both peaks of a double top; a close back below a double-bottom neckline. Define it before you act. Educational, not advice.",
  },
];

/** Spot-the-confirm drill items. */
export const CONFIRM_DRILLS: { id: string; patternId: RevId; question: string; options: string[]; answer: string; why: string }[] = [
  {
    id: "d1", patternId: "double-bottom",
    question: "A W-shaped double bottom after a decline. When is it confirmed?",
    options: ["At the second low", "When price closes above the neckline (bounce high)", "When volume spikes on the second low", "When a doji appears"],
    answer: "When price closes above the neckline (bounce high)",
    why: "Two lows are only a candidate. The close above the neckline is the confirmation.",
  },
  {
    id: "d2", patternId: "head-shoulders",
    question: "Head and shoulders top. What is the usual measured-move target after the neckline break?",
    options: ["Twice the width of the pattern", "The height of the head above the neckline, projected down from the break", "The left shoulder high", "The 200-day moving average"],
    answer: "The height of the head above the neckline, projected down from the break",
    why: "Classic H&S projection: head-to-neckline distance applied from the break.",
  },
  {
    id: "d3", patternId: "triple-bottom",
    question: "Three equal lows after a decline, still trading between the lows and the bounce highs. Best label?",
    options: ["Confirmed triple bottom", "Rectangle / range until a close above the neckline (or a breakdown)", "Cup and handle", "Rising wedge"],
    answer: "Rectangle / range until a close above the neckline (or a breakdown)",
    why: "Without a neckline close, it is still a range. Triple bottom and rectangle are different patterns.",
  },
  {
    id: "d4", patternId: "falling-wedge",
    question: "A falling wedge (two downward converging lines). Which break confirms the usual bullish case?",
    options: ["A close below the lower line", "A close above the upper line", "Any wick above the upper line", "A doji at the apex"],
    answer: "A close above the upper line",
    why: "Falling wedge = bullish wedge; confirmation is a close through the upper trendline.",
  },
  {
    id: "d5", patternId: "rising-wedge",
    question: "A rising wedge after an advance. What usually confirms the bearish reversal?",
    options: ["A close above the upper line", "A close below the lower rising trendline", "Touching the apex", "A green marubozu"],
    answer: "A close below the lower rising trendline",
    why: "Rising wedge = bearish wedge; the lower-line break is the trigger.",
  },
  {
    id: "d6", patternId: "double-top",
    question: "Two equal highs, then a bounce that stops at the old neckline from below and turns down. What is that bounce?",
    options: ["A failed pattern", "A retest of broken support now acting as resistance", "A new double top", "A measured move already complete"],
    answer: "A retest of broken support now acting as resistance",
    why: "After a neckline break, a failed retest is a common continuation of the reversal.",
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

export const REVERSAL_QUESTIONS: QuizQuestion[] = [
  mc("RV-01", "A head-and-shoulders top is confirmed when…", "B", "Price closes below the neckline",
    ["The right shoulder forms", "Volume fades at the head", "Price tags the head high again"],
    "The three peaks are only a candidate until the neckline close.", "neckline", "head-shoulders"),
  mc("RV-02", "The usual measured-move target for a head-and-shoulders top is…", "C", "The head-to-neckline height projected down from the break",
    ["Always 10%", "The width of the left shoulder", "The prior year's low"],
    "A planning distance, not a promise.", "measured-move", "head-shoulders"),
  mc("RV-03", "A double bottom is confirmed when…", "A", "Price closes above the neckline (the bounce high between the two lows)",
    ["The second low prints", "A hammer appears at the second low", "Volume dries up"],
    "Two lows alone are not the signal.", "neckline", "double-bottom"),
  mc("RV-04", "Triple bottom vs rectangle: which statement is right?", "D", "A triple bottom is a reversal candidate after a decline, confirmed by a close above the neckline; a rectangle is a horizontal range that can break either way",
    ["They are the same pattern", "A rectangle always reverses", "A triple bottom needs no confirmation"],
    "Do not label a tape \"triple bottom or rectangle\" as if that were one setup.", undefined, "triple-bottom"),
  mc("RV-05", "A falling wedge is usually…", "B", "Bullish: a close above the upper trendline confirms",
    ["Bearish: a close below the lower line confirms", "Neutral forever", "Only a continuation in downtrends"],
    "Falling wedge = bullish wedge; context still decides reversal vs continuation.", undefined, "falling-wedge"),
  mc("RV-06", "A rising wedge is usually…", "C", "Bearish: a close below the lower trendline confirms",
    ["Bullish", "Only valid on weekly charts", "Confirmed at the apex"],
    "Rising wedge = bearish wedge.", undefined, "rising-wedge"),
  mc("RV-07", "After a neckline breaks down, a bounce into that neckline that fails is…", "A", "A retest: old support acting as resistance",
    ["Proof the pattern failed", "A new inverse head and shoulders", "A measured-move completion"],
    "Retests are common entry locations.", "pattern-retest", "double-top"),
  mc("RV-08", "What invalidates a confirmed double top?", "D", "A close back above the neckline, or a new high above both peaks",
    ["Any green candle", "A doji", "Low volume"],
    "Define invalidation before you act.", "pattern-invalidation", "double-top"),
  mc("RV-09", "Volume on a classic head-and-shoulders top often…", "B", "Fades on the right shoulder and expands on the neckline break",
    ["Must be zero at the head", "Is irrelevant", "Only matters on forex"],
    "Volume is supporting evidence, not a hard rule.", undefined, "head-shoulders"),
  mc("RV-10", "An inverse head and shoulders measured move uses…", "A", "The depth of the head below the neckline, projected up from the break",
    ["The width of the right shoulder only", "ATR × 14 always", "The prior gap size"],
    "Mirror of the top pattern.", "measured-move", "inverse-head-shoulders"),
  mc("RV-11", "Wedges can be…", "C", "Reversals or continuations depending on the prior trend; the break of the \"wrong\" boundary is still the trigger",
    ["Only reversals", "Only continuations", "Never traded"],
    "A rising wedge in a downtrend can be a bearish continuation pause.", undefined, "rising-wedge"),
  mc("RV-12", "A double bottom marks…", "B", "A change in trend and a momentum reversal from the prior decline — after the neckline confirms",
    ["An automatic short entry at the second low", "A guaranteed measured move", "A gap fill"],
    "Investopedia's framing matches the textbook: trend and momentum change, still confirmed by the break.", undefined, "double-bottom"),
];

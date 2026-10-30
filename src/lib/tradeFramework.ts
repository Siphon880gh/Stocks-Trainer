/**
 * Price action trading framework ("Trade what's happening, not what you think will happen"):
 * uncertainty vs a clear signal, then 1 entry from a defined edge (breakout, pullback, reversal),
 * 2 stop-loss at invalidation, 3 trailing stop, 4 profit target planned before entry.
 * Feeds the lesson page /practice/trade-framework, the Learn group `trade-framework` (TF- questions plus the
 * trade-management PA-18…PA-30 questions) and is checked by tradeFramework.test.ts.
 * Charts are SAMPLE scenario charts from scenarioCharts.ts; every number in a question comes from scenario `facts`.
 * Type-only import from quizData, so there is no runtime import cycle.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { OHLC } from "./ohlcData";
import type { ChartAnnotations } from "./chartAnnotations";
import { SCENARIOS } from "./scenarioCharts";
import { PRICE_ACTION_QUESTIONS } from "./quizCandleExtras";

export const TRADE_FRAMEWORK_DISCLAIMER = "SAMPLE charts for learning a process, not trading advice.";

type OptId = "A" | "B" | "C" | "D" | "E";
const IDS: OptId[] = ["A", "B", "C", "D", "E"];
const opts = (rows: Array<[string, string, string?]>): QuizOption[] =>
  rows.map(([label, description, feedback], i) => ({ id: IDS[i], label, description, ...(feedback ? { feedback } : {}) }));
const n = (v: number) => v.toLocaleString("en-US");
const sc = (key: string) => SCENARIOS[key];
const sf = (key: string) => SCENARIOS[key].facts;
const lastIdx = (key: string) => sc(key).bars.length - 1;

// ---------------------------------------------------------------- lesson content

export type FrameworkStepId = "entry" | "stop" | "trail" | "target";

export interface FrameworkCandle {
  /** Archive pattern id (PATTERNS / PATTERN_OHLC). */
  id: string;
  name: string;
  role: string;
}

export interface FrameworkStep {
  id: FrameworkStepId;
  n: 1 | 2 | 3 | 4;
  title: string;
  /** The one-line rule from the framework. */
  rule: string;
  points: string[];
  chartKey: string;
  bars: OHLC[];
  annotations: ChartAnnotations;
  caption: string;
  candles: FrameworkCandle[];
  mistake: string;
  termId: string;
}

const stopHit = sf("sc-stop-hit");
const tgt = sf("sc-target-reversal");
const trail = sf("sc-trailing-stop");

/** SAMPLE bars after the shooting star at the target (lesson only; the quiz never shows them). */
export const TARGET_AFTERMATH: OHLC[] = (() => {
  const base = sc("sc-target-reversal").bars;
  const start = base.length;
  const rows: Array<[number, number, number, number]> = [
    [tgt.close, tgt.close + 30, tgt.close - 280, tgt.close - 250],
    [tgt.close - 250, tgt.close - 210, tgt.close - 530, tgt.close - 490],
    [tgt.close - 490, tgt.close - 430, tgt.trail - 25, tgt.trail + 45],
    [tgt.trail + 45, tgt.trail + 115, tgt.trail - 205, tgt.trail - 145],
  ];
  return rows.map(([open, high, low, close], i) => ({ name: String(start + i + 1), open, high, low, close }));
})();

export const TARGET_LESSON_BARS: OHLC[] = [...sc("sc-target-reversal").bars, ...TARGET_AFTERMATH];

export const FRAMEWORK_UNCERTAINTY = {
  title: "Uncertainty vs a clear signal",
  chop: {
    chartKey: "sc-range-middle",
    label: "Uncertainty",
    text: "Candles overlap and chop sideways in the middle of a range. There is no nearby price where you would be wrong and no clear target, so any entry is a guess. Waiting is the decision.",
    annotations: sc("sc-range-middle").reveal,
  },
  signal: {
    chartKey: "sc-breakout-retest",
    label: "Clear signal",
    text: "Price builds a range under resistance, closes through it, retests the old ceiling from above and holds. Now the chart is telling you something: there is an edge to enter from and a price that proves you wrong.",
    annotations: sc("sc-breakout-retest").reveal,
  },
} as const;

export const FRAMEWORK_STEPS: FrameworkStep[] = [
  {
    id: "entry",
    n: 1,
    title: "Entry signal",
    rule: "Enter from a defined edge, not an opinion.",
    points: [
      "Breakout: a close through a level price failed at before (often bought on the retest).",
      "Pullback: in an uptrend of higher highs and higher lows, a dip to a higher low, trendline or old swing high, then a confirming candle.",
      "Reversal: a completed pattern at a level (double bottom, inverse head and shoulders, hammer plus confirmation at support).",
      "Each one comes with a price where the idea is clearly wrong. \"It feels cheap\" does not.",
    ],
    chartKey: "sc-breakout-retest",
    bars: sc("sc-breakout-retest").bars,
    annotations: sc("sc-breakout-retest").reveal,
    caption: "Breakout: three failures at the same ceiling, a close above it, a held retest, then the entry with the stop and a 2R target.",
    candles: [
      { id: "hammer", name: "Hammer", role: "Reversal entry at support once the next candle confirms." },
      { id: "bullish-engulfing", name: "Bullish engulfing", role: "Pullback entry when it forms at a higher low." },
      { id: "morning-star", name: "Morning star", role: "Reversal entry after a downtrend reaches support." },
    ],
    mistake: "Buying in the middle of a range, or before the close confirms the break.",
    termId: "entry-types",
  },
  {
    id: "stop",
    n: 2,
    title: "Stop-loss",
    rule: "Exit where the trade thesis is invalidated. Keep losses small.",
    points: [
      "Put the stop where the chart says the idea is wrong: back inside the base for a breakout, under the higher low for a pullback, beyond the pattern's extreme for a reversal.",
      "Decide it before entry, then size the position so a stop-out is a small, known loss (for example 1% of the account).",
      "A pullback that stays above the stop is normal. A close through the stop is the signal to get out.",
      "Never move the stop further away to avoid being wrong.",
    ],
    chartKey: "sc-stop-hit",
    bars: sc("sc-stop-hit").bars,
    annotations: sc("sc-stop-hit").reveal,
    caption: `Breakout long at ${n(stopHit.entry)} with the stop at ${n(stopHit.stop)}. Price tops at ${n(stopHit.top)} and closes at ${n(stopHit.close)}, back inside the base: the breakout failed, so the trade ends with a small loss.`,
    candles: [
      { id: "bearish-engulfing", name: "Bearish engulfing", role: "A warning near the top; the stop, not the candle, decides the exit." },
      { id: "long-red-candle", name: "Long red candle", role: "A strong close through the stop level ends the idea." },
    ],
    mistake: "Holding through the stop because it \"has to come back\", or widening the stop after entry.",
    termId: "stop-loss-invalidation",
  },
  {
    id: "trail",
    n: 3,
    title: "Trailing stop",
    rule: "Raise the exit level as price trends higher. Protect open profit.",
    points: [
      "Each time the trend prints a new higher low and moves away from it, raise the stop to just under that low.",
      "The stop climbs in steps under price and only ever moves up on a long.",
      "Once the stop is above entry, the worst case is a gain.",
      "A trailed stop gives back some profit when it is hit. That is the cost of staying in the trend.",
    ],
    chartKey: "sc-trailing-stop",
    bars: sc("sc-trailing-stop").bars,
    annotations: sc("sc-trailing-stop").reveal,
    caption: `Breakout long at ${n(trail.entry)}. The stop steps up ${n(trail.baseStop)} → ${n(trail.stop1)} → ${n(trail.stop2)} → ${n(trail.stop3)} under each higher low, so it now locks in ${n(trail.stop3 - trail.entry)}.`,
    candles: [
      { id: "hammer", name: "Hammer", role: "A hammer at a new higher low marks where the next stop step goes." },
      { id: "doji", name: "Doji", role: "Indecision inside a trend is not a reason to exit while the stop holds." },
    ],
    mistake: "Trailing so tight that normal pullbacks stop you out, or lowering the stop on a dip.",
    termId: "trailing-stop",
  },
  {
    id: "target",
    n: 4,
    title: "Profit target",
    rule: "Take gains where reward no longer justifies risk. Plan reward before entry.",
    points: [
      "Before entry, mark a realistic target (next resistance, the old high, a measured move) and only take trades where it is worth the risk, for example 2:1 or better.",
      "In the trade, compare the reward left (target minus price) with the risk left (price minus the stop).",
      "When price reaches the target zone and what is left to gain is smaller than what you can give back, take profit or tighten the stop.",
      "A rejection candle at the target (shooting star, bearish engulfing) is extra evidence, not the plan itself.",
    ],
    chartKey: "sc-target-reversal",
    bars: TARGET_LESSON_BARS,
    annotations: sc("sc-target-reversal").reveal,
    caption: `Long at ${n(tgt.entry)} from the higher low, target ${n(tgt.target)} at the old high (planned ${((tgt.target - tgt.entry) / (tgt.entry - tgt.stop)).toFixed(1)}:1). A shooting star prints in the target zone at ${n(tgt.close)}; taking profit there keeps ${n(tgt.close - tgt.entry)}, while waiting for the trailed stop at ${n(tgt.trail)} would keep only ${n(tgt.trail - tgt.entry)}.`,
    candles: [
      { id: "shooting-star", name: "Shooting star", role: "Rejection at the target zone: buyers could not hold the highs." },
      { id: "bearish-engulfing", name: "Bearish engulfing", role: "Sellers take over at resistance: tighten or take profit." },
      { id: "evening-star", name: "Evening star", role: "A three-candle top at the target." },
    ],
    mistake: "Holding for \"more\" at the old high when there is little left to gain and a lot to give back.",
    termId: "taking-profit",
  },
];

// ---------------------------------------------------------------- lesson drills ("Which step is this?")

export const FRAMEWORK_DRILL_OPTIONS = [
  "Wait: no edge yet",
  "Entry signal",
  "Stop-loss: exit",
  "Trailing stop: raise the stop",
  "Profit target: take gains",
] as const;

export interface FrameworkDrill {
  id: string;
  question: string;
  answer: (typeof FRAMEWORK_DRILL_OPTIONS)[number];
  why: string;
}

export const FRAMEWORK_DRILLS: FrameworkDrill[] = [
  {
    id: "tf-d1",
    question: "Price chops sideways in the middle of a range, far from support and resistance. You have no position.",
    answer: "Wait: no edge yet",
    why: "Uncertainty: no nearby price where you would be wrong and no clear target. Wait for a close through an edge or a confirmed reaction at one.",
  },
  {
    id: "tf-d2",
    question: "After failing at the same ceiling three times, price closes above it on a strong green candle and the retest holds.",
    answer: "Entry signal",
    why: "A breakout from a defined edge. The stop goes back under the old ceiling, where the breakout would fail.",
  },
  {
    id: "tf-d3",
    question: "You bought the breakout. Price stalls, rolls over and closes back inside the base, below your stop.",
    answer: "Stop-loss: exit",
    why: "The thesis (the breakout holds) is invalidated. Take the small planned loss instead of hoping.",
  },
  {
    id: "tf-d4",
    question: "Your long is well in profit and the uptrend has just printed a new higher low, then moved away from it.",
    answer: "Trailing stop: raise the stop",
    why: "Step the stop up to just under the new higher low. It protects open profit and keeps you in the trend.",
  },
  {
    id: "tf-d5",
    question: "Price reaches the target you planned at the old high and prints a shooting star. The trailed stop is far below.",
    answer: "Profit target: take gains",
    why: "Little reward is left versus a lot of risk to the stop, and the candle shows rejection. Take profit or tighten.",
  },
  {
    id: "tf-d6",
    question: "In an uptrend, price dips to the rising trendline at a higher low and a bullish engulfing candle closes there.",
    answer: "Entry signal",
    why: "A pullback entry: trend, level and confirming candle. The stop goes just under the pullback low.",
  },
];

// ---------------------------------------------------------------- Learn questions (TF-)

const stopPlan = sc("sc-stop-hit").plan!;
const brk = sf("sc-breakout-retest");
const brkPlan = sc("sc-breakout-retest").plan!;
const tReward0 = tgt.target - tgt.entry;
const tRisk0 = tgt.entry - tgt.stop;
const tLeft = tgt.target - tgt.close;
const tRiskLeft = tgt.close - tgt.trail;

const stopShown: ChartAnnotations = {
  levels: [
    { price: stopHit.breakLevel, label: "Base top (breakout level)", tone: "neutral" },
    { price: stopHit.stop, label: "Your stop", tone: "risk" },
  ],
  points: [{ index: stopHit.brkIndex, price: stopHit.entry, label: "Entry (breakout)", tone: "entry" }],
};
const targetShown: ChartAnnotations = {
  levels: [{ price: tgt.target, label: "Planned target: old high", tone: "reward" }],
  points: [{ index: tgt.entryIndex, price: tgt.entry, label: "Entry", tone: "entry" }],
};

export const TF_QUESTIONS: QuizQuestion[] = [
  {
    id: "TF-01",
    prompt: "\"Trade what's happening, not what you think will happen.\" Which decision follows that rule?",
    correctAnswer: "B",
    options: opts([
      ["Buy now because earnings should be strong next month", "A forecast, not something on the chart.", "That is what you think will happen. Nothing on the chart has confirmed it."],
      ["Buy after price closes above resistance it failed at three times", "A signal the chart has already printed."],
      ["Sell because the stock \"has gone up too much\"", "An opinion with no level to be wrong at.", "Too much is an opinion. There is no price that proves it wrong, so there is no stop."],
    ]),
    explanation: "The framework acts on what price has done (a close through a level, a held retest, a confirmed pattern), because that gives an entry, a stop and a target. Forecasts and feelings give none of the three.",
    glossaryTermId: "price-action-framework",
  },
  {
    id: "TF-02",
    prompt: "Which order does the price action framework follow once there is a clear signal?",
    correctAnswer: "A",
    options: opts([
      ["Entry from an edge → stop at invalidation → trail the stop → take profit at the target", "Plan the stop and target before entry, then manage."],
      ["Entry → wait to see how it goes → decide on a stop if it falls", "The stop belongs in the plan before entry.", "Deciding the stop after it falls is how small losses turn into big ones."],
      ["Pick a profit target → enter anywhere → move the stop lower if needed", "No edge, and the stop moves the wrong way.", "Without an edge there is no logical stop, and a long's stop never moves down."],
    ]),
    explanation: "1 Entry signal, 2 Stop-loss, 3 Trailing stop, 4 Profit target. Steps 2 and 4 are both written down before the entry; steps 3 and 4 manage the open trade.",
    glossaryTermId: "price-action-framework",
  },
  {
    id: "TF-03",
    prompt: `Price failed three times at about ${n(brk.level)}, then closed above it and came back to retest it. Which entry type is this, and where does the stop go?`,
    correctAnswer: "C",
    options: opts([
      ["Pullback; stop under the first candle of the chart", "There is no uptrend of higher lows here; it is a range breaking out.", "A pullback buys a dip inside an existing trend. This is a level being broken."],
      ["Reversal; no stop needed because the level is strong", "Every entry needs a stop.", "Strong levels still fail. The stop is what keeps that failure small."],
      [`Breakout; stop back under the old resistance (the plan uses ${n(brkPlan.stop)}, below the retest low)`, "Breakout from a defined edge."],
    ]),
    explanation: `Old resistance became support. Entry ${n(brkPlan.entry)}, stop ${n(brkPlan.stop)}, 2R target ${n(brkPlan.target)}: the stop sits where the breakout would fail. The reveal draws the level and the plan.`,
    patternKey: "sc-breakout-retest",
    highlightIndex: lastIdx("sc-breakout-retest"),
    chartSize: "large",
    revealAnnotations: sc("sc-breakout-retest").reveal,
    glossaryTermId: "entry-types",
  },
  {
    id: "TF-04",
    prompt: `SAMPLE long: bought the breakout at ${n(stopHit.entry)}, stop ${n(stopHit.stop)} (back inside the base). Price topped at ${n(stopHit.top)}, and the last candle closed at ${n(stopHit.close)}. What does the plan say?`,
    correctAnswer: "A",
    options: opts([
      [`Exit: the close below ${n(stopHit.stop)} invalidates the breakout. Take the small planned loss`, "Stop-loss at invalidation."],
      ["Hold: it was above the entry a few candles ago, so it should come back", "Hope, not a plan.", "Where price was does not matter. The idea was \"the breakout holds\", and the close says it did not."],
      ["Move the stop down to the bottom of the base to give it room", "Widening the stop after entry.", "That turns a small planned loss into a larger unplanned one."],
    ]),
    explanation: `Risk was planned at ${n(stopHit.entry)} − ${n(stopHit.stop)} = ${n(stopHit.entry - stopHit.stop)} (1R). A close back inside the base means the breakout failed. The reveal shows the stop, the top and the 2R target at ${n(stopHit.target)} that was never reached.`,
    patternKey: "sc-stop-hit",
    highlightIndex: lastIdx("sc-stop-hit"),
    chartSize: "large",
    annotations: stopShown,
    revealAnnotations: sc("sc-stop-hit").reveal,
    glossaryTermId: "stop-loss-invalidation",
  },
  {
    id: "TF-05",
    prompt: `Same trade. Between the top at ${n(stopHit.top)} and the stop, several red candles pulled back but stayed above ${n(stopHit.stop)}. What should those candles have changed?`,
    correctAnswer: "C",
    options: opts([
      ["Exit on the first red candle after the top", "A pullback above the stop is normal.", "Exiting on every red candle means stopping yourself out of trades that are still valid."],
      ["Lower the stop so the pullback has more room", "The stop never moves away from price.", "Lowering the stop raises the loss after the fact."],
      ["Nothing: the thesis was intact until a close through the stop", "The stop decides, not each candle."],
    ]),
    explanation: "Exit where the thesis is invalidated, not where you feel nervous. Pullbacks that hold above the stop are part of a working trade; the close through the stop is the exit signal.",
    patternKey: "sc-stop-hit",
    highlightIndex: stopHit.topIndex,
    chartSize: "large",
    annotations: stopShown,
    revealAnnotations: sc("sc-stop-hit").reveal,
    glossaryTermId: "stop-loss-invalidation",
  },
  {
    id: "TF-06",
    prompt: `Breakout long at ${n(stopPlan.entry)} with the stop at ${n(stopPlan.stop)}. Why is that stop better than one far below at ${n(stopPlan.stop - 3 * (stopPlan.entry - stopPlan.stop))}?`,
    correctAnswer: "B",
    options: opts([
      ["The far stop is safer because it will not get hit", "It still gets hit when the idea fails, just later and bigger.", "A wide stop does not prevent the loss, it makes it bigger."],
      [`It sits where the breakout fails, so the loss is ${n(stopPlan.entry - stopPlan.stop)} instead of ${n(4 * (stopPlan.entry - stopPlan.stop))}`, "Small, logical, known before entry."],
      ["Stops should be a round number of dollars", "The chart, not a round number, sets the stop.", "Pick the stop from structure, then size the position to fit it."],
    ]),
    explanation: "A stop at invalidation keeps losses small: once price is back inside the base, the breakout reason for the trade is gone. Waiting much lower only makes the same mistake more expensive.",
    glossaryTermId: "stop-loss-invalidation",
  },
  {
    id: "TF-07",
    prompt: "Account 10,000. You risk 1% per trade. Entry 50.00, stop at invalidation 48.00. How many shares keep the loss small and known?",
    correctAnswer: "A",
    options: opts([
      ["50 shares (100 risk ÷ 2.00 per share)", "Size from the stop distance."],
      ["200 shares (all 10,000 ÷ 50.00)", "That risks 400 (4%), not 100.", "200 shares × 2.00 = 400, four times the 1% budget."],
      ["100 shares, and move the stop to 49.00 to make it fit", "The stop belongs at invalidation.", "Moving the stop to fit the size puts it where the idea is not wrong yet."],
    ]),
    explanation: "Risk budget 10,000 × 1% = 100. Risk per share 50.00 − 48.00 = 2.00. 100 ÷ 2.00 = 50 shares. The stop comes from the chart; the size comes from the stop.",
    glossaryTermId: "risk-reward",
  },
  {
    id: "TF-08",
    prompt: `SAMPLE long from the higher low at ${n(tgt.entry)}, stop ${n(tgt.stop)}, target ${n(tgt.target)} at the old high. Price has rallied into the target zone. What is the last candle, and what does it add?`,
    correctAnswer: "B",
    options: opts([
      ["A hammer: buyers are in control, so add to the position", "The long wick is on top, not below the body.", "A hammer has a long lower wick. This candle's long wick points up into the old high."],
      ["A shooting star: price was rejected at the target, extra evidence to take profit or tighten", "Small body near the low, long upper wick at resistance."],
      ["A marubozu: a strong close at the high", "It closed near its low with a long upper wick.", "A marubozu has little or no wick. This one has a long upper wick."],
    ]),
    explanation: "The shooting star pushed into the old high and closed near its low: buyers could not hold it. At a planned target that is extra evidence; the reward-to-risk math is the plan itself.",
    patternKey: "sc-target-reversal",
    highlightIndex: lastIdx("sc-target-reversal"),
    chartSize: "large",
    annotations: targetShown,
    revealAnnotations: sc("sc-target-reversal").reveal,
    glossaryTermId: "taking-profit",
  },
  {
    id: "TF-09",
    prompt: `Same trade: price ${n(tgt.close)}, target ${n(tgt.target)}, trailed stop ${n(tgt.trail)} (under the last swing low). Does the reward left justify the risk?`,
    correctAnswer: "C",
    options: opts([
      ["Yes: the trend is up, so hold for more", "Compare the numbers, not the feeling.", `About ${n(tLeft)} is left to gain and ${n(tRiskLeft)} to give back.`],
      ["Yes: add a second position at the old high", "Buying into the target with little room left.", "Adding at resistance buys a small reward with a large risk."],
      [`No: about ${n(tLeft)} left to gain vs ${n(tRiskLeft)} to the stop (≈${(tLeft / tRiskLeft).toFixed(1)}:1). Take profit or tighten`, "Reward no longer justifies risk."],
    ]),
    explanation: `Reward left = ${n(tgt.target)} − ${n(tgt.close)} = ${n(tLeft)}; risk left = ${n(tgt.close)} − ${n(tgt.trail)} = ${n(tRiskLeft)}. Taking profit here keeps ${n(tgt.close - tgt.entry)}. The reveal shows the target zone and the risk box.`,
    patternKey: "sc-target-reversal",
    highlightIndex: lastIdx("sc-target-reversal"),
    chartSize: "large",
    annotations: targetShown,
    revealAnnotations: sc("sc-target-reversal").reveal,
    glossaryTermId: "taking-profit",
  },
  {
    id: "TF-10",
    prompt: `Before entering that long at ${n(tgt.entry)} with the stop at ${n(tgt.stop)}, what reward-to-risk did the old high at ${n(tgt.target)} offer?`,
    correctAnswer: "A",
    options: opts([
      [`About ${(tReward0 / tRisk0).toFixed(1)}:1 (${n(tReward0)} reward vs ${n(tRisk0)} risk): worth taking`, "Planned before entry."],
      ["About 1:1", `The target is ${n(tReward0)} away and the stop ${n(tRisk0)}.`, "Divide the distance to the target by the distance to the stop."],
      ["It cannot be known until the trade is closed", "Both prices are known before entry.", "The target and the stop are both on the chart before you buy."],
    ]),
    explanation: "Plan reward before entry: the old high is a realistic target, the higher low sets the stop, and the ratio says whether the trade is worth taking at all.",
    patternKey: "sc-target-reversal",
    highlightIndex: tgt.entryIndex,
    chartSize: "large",
    annotations: targetShown,
    glossaryTermId: "taking-profit",
  },
  {
    id: "TF-11",
    prompt: "A hammer prints at support after a downtrend. What turns it into a reversal entry from a defined edge?",
    correctAnswer: "B",
    options: opts([
      ["Nothing more: buy the hammer's close", "Unconfirmed.", "A hammer alone is a candidate. Without confirmation it often fails."],
      ["A green confirmation close above the hammer's high, with the stop under the hammer's low", "Confirmation plus a level to be wrong at."],
      ["Wait for three more red candles to be sure", "That is the opposite of confirmation.", "More red candles would mean the reversal failed."],
    ]),
    explanation: "Candles are the entry trigger, the level is the edge. Hammer at support + confirming close = reversal entry; the hammer's low is where the idea is wrong.",
    patternKey: "hammer",
    highlightIndex: 2,
    glossaryTermId: "entry-types",
  },
  {
    id: "TF-12",
    prompt: "Uptrend of higher lows. Price pulls back to the rising trendline and a bullish engulfing candle closes there. Which step and which stop?",
    correctAnswer: "A",
    options: opts([
      ["Entry signal (pullback); stop just under the engulfing low / the pullback low", "Trend + level + confirming candle."],
      ["Profit target; sell the bounce", "It is a fresh signal, not a target.", "A bullish candle at a higher low starts a trade; it does not end one."],
      ["Uncertainty; wait for more chop", "The trend and the level make this an edge.", "Chop is overlapping candles in the middle of a range. This is a trend pullback to support."],
    ]),
    explanation: "Pullback entries buy a higher low inside an existing trend once a candle confirms. If price closes under the pullback low, the higher-low structure is broken and the stop ends the trade.",
    patternKey: "bullish-engulfing",
    highlightIndex: 2,
    glossaryTermId: "entry-types",
  },
  {
    id: "TF-13",
    prompt: "You are long and near your target at resistance. A bearish engulfing candle closes there. What does the framework say?",
    correctAnswer: "C",
    options: opts([
      ["Short immediately: one candle reversed the trend", "Managing a long is not the same as opening a short.", "The candle is a warning for your long, not a new trade by itself."],
      ["Ignore it; only the original stop matters", "The target step uses this evidence.", "At a planned target, a rejection candle is a reason to protect the gain."],
      ["Take profit or tighten the stop: sellers took over right at the planned target", "Protect open profit at the target."],
    ]),
    explanation: "At the target, a bearish engulfing candle says reward is drying up. Take the gain or raise the stop under that candle; a short is a separate trade that needs its own edge.",
    patternKey: "bearish-engulfing",
    highlightIndex: 2,
    glossaryTermId: "taking-profit",
  },
  {
    id: "TF-14",
    prompt: "Price prints a string of dojis and spinning tops in the middle of a sideways range. What is this in the framework?",
    correctAnswer: "A",
    options: opts([
      ["Uncertainty: no edge yet. Wait for a close through the range or a confirmed reaction at an edge", "Indecision in the middle = no trade."],
      ["A buy signal: dojis always reverse", "Dojis show indecision, not direction.", "A doji needs a trend before it and a confirming candle after it to mean anything."],
      ["A trailing-stop signal", "There is no open trend trade to manage here.", "Trailing stops manage an open position in a trend."],
    ]),
    explanation: "Small-bodied candles in the middle of a range are the uncertainty side of the framework. The clear signal comes later: a close through the range top or bottom, ideally with a held retest.",
    patternKey: "doji",
    highlightIndex: 2,
    glossaryTermId: "no-trade-zone",
  },
  {
    id: "TF-15",
    prompt: "Where should a profit target come from?",
    correctAnswer: "B",
    options: opts([
      ["As far as possible; never cap a winner", "No plan to compare reward with risk.", "Without a target you cannot check reward-to-risk before entry."],
      ["A realistic level on the chart (next resistance, the old high, a measured move), checked against the stop before entry", "Plan reward before entry."],
      ["Whatever round number would feel good", "A feeling, not a level.", "Round numbers can matter, but only when the chart shows a level there."],
    ]),
    explanation: "Take gains where reward no longer justifies risk, and plan that reward before entry: if the next level is closer than the stop, skip the trade or wait for a better entry.",
    glossaryTermId: "taking-profit",
  },
];

const TRADE_MANAGEMENT_IDS = new Set(Array.from({ length: 13 }, (_, i) => `PA-${18 + i}`));

/** Learn group `trade-framework`: the TF- questions plus the trade-management price-action questions (same objects). */
export const TRADE_FRAMEWORK_QUESTIONS: QuizQuestion[] = [
  ...TF_QUESTIONS,
  ...PRICE_ACTION_QUESTIONS.filter((q) => TRADE_MANAGEMENT_IDS.has(q.id)),
];

/** Where the framework lives elsewhere in the app (lesson page "Keep going" links). */
export const TRADE_FRAMEWORK_LINKS = [
  { label: "Learn · Price Action Framework", to: "/training?group=trade-framework&start=1" },
  { label: "Cases · Price action trades", to: "/cases?pack=price-action" },
  { label: "Coach · Honor the stop", to: "/coach/honor-the-stop" },
  { label: "Coach · Plan the trade before you click", to: "/coach/trade-plan-before-entry" },
  { label: "Coach · Trail the stop, plan the exit", to: "/coach/trailing-stop-exit" },
  { label: "Buy or Sell? drill", to: "/training?group=buy-or-sell&start=1" },
  { label: "Practice · Mark the plan", to: "/practice/plan" },
  { label: "Practice · Invalidation", to: "/practice/invalidation" },
  { label: "Paper trading (stops and trailing stops)", to: "/paper" },
] as const;

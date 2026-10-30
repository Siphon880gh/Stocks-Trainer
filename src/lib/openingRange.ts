/**
 * Opening range breakout (ORB) on a 15-minute chart, as described in a public Facebook reel about SPY
 * (https://www.facebook.com/reel/1698614037860407): mark the high and low of the first two 15-minute candles
 * (the first 30 minutes), enter only when a 15-minute candle CLOSES outside that range (above → calls / long,
 * below → puts / short), put the stop at the opposite end of the range, and aim for 1:1 measured on the underlying.
 * The app adds the caveats the reel skips: entry on the close vs the next open, a wide range means a deep stop
 * (size down or skip), 1:1 on the underlying is not 1:1 on option premium, and the reel gives no expiry rule.
 * The reel's broker promotion and its PDT remark are not used; the app's PDT facts come from FINRA (pdtRule.ts).
 *
 * Feeds /practice/opening-range, the Learn group `opening-range` (ORB- questions), the ORB cases and the
 * glossary. Every session is SAMPLE (SPY.S, stylized); option prices come from the Black-Scholes helpers in
 * gammaSqueeze.ts with an assumed volatility. Type-only imports apart from gammaSqueeze, so no import cycle.
 * Checked by openingRange.test.ts. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { OHLC } from "./ohlcData";
import type { ChartAnnotations } from "./chartAnnotations";
import type { LiteracyTerm } from "./literacyTerms";
import { callDelta, callValue, MINUTES_PER_YEAR } from "./gammaSqueeze";

export const ORB_DISCLAIMER = "SAMPLE 15-minute sessions for learning a process, not trading advice.";
export const ORB_SOURCE = {
  label: "Public Facebook reel: SPY 15-minute opening range breakout",
  url: "https://www.facebook.com/reel/1698614037860407",
  note: "Rules restated from the reel; the caveats are the app's. The reel's broker promotion is left out, and the app does not rely on the reel for rule changes such as PDT.",
} as const;

/** Number of 15-minute candles that make the opening range (the first 30 minutes). */
export const ORB_RANGE_BARS = 2;
/** SAMPLE risk budget used for sizing examples (dollars per trade). */
export const ORB_RISK_BUDGET = 200;
/** SAMPLE "usual" opening range width for this stylized SPY.S, used to spot a wide range. */
export const ORB_TYPICAL_WIDTH = 2;
/** A stop deeper than this multiple of the usual range is flagged as "size down or skip". */
export const ORB_WIDE_MULTIPLE = 2;

const b = (name: string, open: number, high: number, low: number, close: number): OHLC => ({ name, open, high, low, close });
const r2 = (v: number) => Math.round(v * 100) / 100;
export const fmt = (v: number) => v.toFixed(2);

export type OrbAnswer = "calls" | "puts" | "wait" | "skip";
export const ORB_ANSWER_LABELS: Record<OrbAnswer, string> = {
  calls: "Calls (long): a 15-minute candle closed above the range",
  puts: "Puts (short): a 15-minute candle closed below the range",
  wait: "Wait: no 15-minute close outside the range yet",
  skip: "Size down or skip: the range is too wide for my risk",
};
export const ORB_ANSWERS: OrbAnswer[] = ["calls", "puts", "wait", "skip"];

export interface OrbSession {
  id: string;
  title: string;
  /** Full SAMPLE session, 15-minute candles named by their ET start time. */
  bars: OHLC[];
  /** The candle the learner decides on (bars after it are the reveal). */
  decisionIndex: number;
  answer: OrbAnswer;
  why: string;
  /** What happened after the decision. */
  outcome: string;
}

export const ORB_SESSIONS: OrbSession[] = [
  {
    id: "orb-wick",
    title: "A wick pokes above the range",
    bars: [
      b("9:30", 590.0, 590.8, 589.5, 590.4), b("9:45", 590.4, 590.9, 589.8, 590.1), b("10:00", 590.1, 590.7, 589.9, 590.5),
      b("10:15", 590.5, 591.4, 590.3, 590.6), b("10:30", 590.6, 590.8, 589.9, 590.0), b("10:45", 590.0, 590.3, 589.2, 589.6),
      b("11:00", 589.6, 590.1, 589.4, 589.9), b("11:15", 589.9, 590.5, 589.7, 590.3),
    ],
    decisionIndex: 3,
    answer: "wait",
    why: "The 10:15 candle traded above the range high but closed back inside it. A wick is a test, not a close: no entry yet.",
    outcome: "Price chopped inside the range; a later wick below the low also closed back inside. No signal all morning, so no trade.",
  },
  {
    id: "orb-long",
    title: "A close above the range",
    bars: [
      b("9:30", 580.2, 581.4, 579.6, 581.0), b("9:45", 581.0, 581.6, 580.3, 580.7), b("10:00", 580.7, 581.5, 580.4, 581.2),
      b("10:15", 581.2, 581.9, 580.9, 581.3), b("10:30", 581.3, 582.3, 581.1, 582.1), b("10:45", 582.1, 582.7, 581.7, 582.5),
      b("11:00", 582.5, 583.4, 582.3, 583.2), b("11:15", 583.2, 583.6, 582.8, 583.0), b("11:30", 583.0, 584.1, 582.9, 583.9),
      b("11:45", 583.9, 584.8, 583.7, 584.6), b("12:00", 584.6, 584.9, 584.1, 584.3),
    ],
    decisionIndex: 4,
    answer: "calls",
    why: "The 10:30 candle closed at 582.10, above the 581.60 range high (the 10:15 wick did not count). Calls / long, stop at the range low 579.60.",
    outcome: "Risk 582.10 − 579.60 = 2.50, so the 1:1 target was 584.60. Price never came near the stop and reached 584.60 in the 11:45 candle.",
  },
  {
    id: "orb-short",
    title: "A close below the range",
    bars: [
      b("9:30", 575.0, 575.6, 573.9, 574.3), b("9:45", 574.3, 575.2, 574.0, 574.9), b("10:00", 574.9, 575.1, 574.2, 574.4),
      b("10:15", 574.4, 574.6, 573.4, 573.6), b("10:30", 573.6, 573.9, 572.8, 573.0), b("10:45", 573.0, 573.3, 572.1, 572.3),
      b("11:00", 572.3, 572.6, 571.4, 571.7), b("11:15", 571.7, 572.2, 571.3, 571.9),
    ],
    decisionIndex: 3,
    answer: "puts",
    why: "The 10:15 candle closed at 573.60, below the 573.90 range low. Puts / short, stop at the range high 575.60.",
    outcome: "Risk 575.60 − 573.60 = 2.00, so the 1:1 target was 571.60. Price reached it in the 11:00 candle.",
  },
  {
    id: "orb-wide",
    title: "A huge opening range",
    bars: [
      b("9:30", 600.0, 603.8, 599.2, 603.2), b("9:45", 603.2, 603.9, 598.4, 599.1), b("10:00", 599.1, 601.5, 598.9, 601.2),
      b("10:15", 601.2, 604.3, 601.0, 604.1), b("10:30", 604.1, 604.6, 602.2, 602.6), b("10:45", 602.6, 603.0, 600.9, 601.3),
      b("11:00", 601.3, 602.1, 600.4, 601.8), b("11:15", 601.8, 602.4, 600.8, 601.1),
    ],
    decisionIndex: 3,
    answer: "skip",
    why: "The close above 603.90 is a signal, but the stop at the range low 598.40 is 5.70 away, almost three times this SAMPLE ticker's usual 2.00 range. Size down so the dollar risk stays the same, or skip.",
    outcome: "Price slid back into the middle of the range: no stop, no target, just a large position sitting in chop.",
  },
  {
    id: "orb-fail",
    title: "A breakout that fails",
    bars: [
      b("9:30", 585.0, 585.7, 584.4, 585.4), b("9:45", 585.4, 585.8, 584.7, 585.1), b("10:00", 585.1, 586.2, 585.0, 586.0),
      b("10:15", 586.0, 586.5, 585.4, 585.6), b("10:30", 585.6, 585.8, 584.6, 584.8), b("10:45", 584.8, 585.0, 584.0, 584.2),
      b("11:00", 584.2, 584.6, 583.5, 583.7),
    ],
    decisionIndex: 2,
    answer: "calls",
    why: "The 10:00 candle closed at 586.00, above the 585.80 range high: a valid long signal with the stop at 584.40.",
    outcome: "Price fell back through the whole range and hit the 584.40 stop in the 10:45 candle: a planned 1R loss of 1.60. A valid signal can still lose; the stop is what keeps it small.",
  },
];

export const ORB_BY_ID: Record<string, OrbSession> = Object.fromEntries(ORB_SESSIONS.map((s) => [s.id, s]));

export interface OrbPlan {
  rangeHigh: number;
  rangeLow: number;
  width: number;
  direction: "long" | "short" | null;
  entry: number | null;
  stop: number | null;
  risk: number | null;
  target: number | null;
}

/** High / low of the first `ORB_RANGE_BARS` candles. */
export function openingRange(bars: OHLC[]): { high: number; low: number; width: number } {
  const first = bars.slice(0, ORB_RANGE_BARS);
  const high = Math.max(...first.map((x) => x.high));
  const low = Math.min(...first.map((x) => x.low));
  return { high, low, width: r2(high - low) };
}

/** First candle after the range that CLOSES outside it (wicks do not count). */
export function firstCloseOutside(bars: OHLC[]): { index: number; direction: "long" | "short" } | null {
  const { high, low } = openingRange(bars);
  for (let i = ORB_RANGE_BARS; i < bars.length; i++) {
    if (bars[i].close > high) return { index: i, direction: "long" };
    if (bars[i].close < low) return { index: i, direction: "short" };
  }
  return null;
}

/** Entry on the signal candle's close, stop at the opposite end of the range, 1:1 target on the underlying. */
export function orbPlan(bars: OHLC[]): OrbPlan {
  const { high, low, width } = openingRange(bars);
  const sig = firstCloseOutside(bars);
  if (!sig) return { rangeHigh: high, rangeLow: low, width, direction: null, entry: null, stop: null, risk: null, target: null };
  const entry = bars[sig.index].close;
  const stop = sig.direction === "long" ? low : high;
  const risk = r2(Math.abs(entry - stop));
  const target = r2(sig.direction === "long" ? entry + risk : entry - risk);
  return { rangeHigh: high, rangeLow: low, width, direction: sig.direction, entry, stop, risk, target };
}

/** Whole units you can hold so that (units × risk per unit) stays within the budget. */
export const sizeFor = (budget: number, riskPerUnit: number) => Math.floor(budget / riskPerUnit + 1e-9);

/** Annotations: the range box before the answer; entry / stop / target after it. */
export function orbAnnotations(s: OrbSession): { before: ChartAnnotations; reveal: ChartAnnotations } {
  const p = orbPlan(s.bars);
  const before: ChartAnnotations = {
    zones: [{ fromIndex: 0, top: p.rangeHigh, bottom: p.rangeLow, label: `Opening range ${fmt(p.rangeLow)}–${fmt(p.rangeHigh)}`, tone: "neutral", labelAt: "bottom" }],
  };
  if (p.entry === null || p.stop === null || p.target === null) return { before, reveal: {} };
  const sig = firstCloseOutside(s.bars)!;
  return {
    before,
    reveal: {
      points: [{ index: sig.index, price: p.entry, label: `Close ${fmt(p.entry)}`, tone: "entry" }],
      levels: [
        { price: p.stop, label: `Stop ${fmt(p.stop)} (other end of range)`, tone: "risk" },
        { price: p.target, label: `1:1 target ${fmt(p.target)}`, tone: "reward" },
      ],
    },
  };
}

/** Chart series for quiz questions: full sessions plus `-pre` versions that stop at the decision candle. */
export const ORB_OHLC: Record<string, OHLC[]> = Object.fromEntries(
  ORB_SESSIONS.flatMap((s) => [
    [s.id, s.bars],
    [`${s.id}-pre`, s.bars.slice(0, s.decisionIndex + 1)],
  ]),
);

// ---------------------------------------------------------------- the rules, as taught

export interface OrbStep {
  n: number;
  title: string;
  rule: string;
  detail: string;
}

export const ORB_STEPS: OrbStep[] = [
  { n: 1, title: "Mark the opening range", rule: "On a 15-minute chart, mark the high and the low of the first two candles (9:30 and 9:45 ET, the first 30 minutes).", detail: "That box is where buyers and sellers fought at the open. Nothing is decided until price leaves it." },
  { n: 2, title: "Wait for a close outside", rule: "Enter only when a 15-minute candle closes above the high (long / calls) or below the low (short / puts).", detail: "A wick through the line is a test. The close is the market's answer for that 15 minutes." },
  { n: 3, title: "Pick the contract", rule: "The reel buys a strike just past the price (slightly out of the money): calls above, puts below.", detail: "Strike choice is a judgement call. Out-of-the-money contracts are cheaper but move less per $1 at first (lower delta) and lose more if price stalls." },
  { n: 4, title: "Stop at the other end", rule: "Long: stop at the range low. Short: stop at the range high.", detail: "If price crosses the whole range the other way, the breakout idea has failed." },
  { n: 5, title: "Target 1:1 on the underlying", rule: "Measure the distance from entry to stop on the chart, and take profit the same distance beyond the entry.", detail: "Measured on SPY itself, not on the option's price. Do not risk more than you can afford to lose." },
];

export interface OrbCaveat {
  id: string;
  title: string;
  text: string;
}

const LONG = orbPlan(ORB_BY_ID["orb-long"].bars);
const WIDE = orbPlan(ORB_BY_ID["orb-wide"].bars);

/** Option prices for the orb-long trade with an assumed implied volatility (SAMPLE, Black-Scholes, no rates). */
export const ORB_OPTION_EXAMPLE = (() => {
  const strike = 583;
  const vol = 0.15;
  /** Signal candle 10:30 closes at 10:45 ET: 315 minutes to the 16:00 close. One hour later at the target or stop. */
  const minutesAtEntry = 315;
  const elapsed = 60;
  const rows = [
    { id: "0dte", label: "Expires today (0DTE)", extra: 0 },
    { id: "month", label: "Expires in about a month (21 sessions)", extra: 20 * 390 },
  ].map((r) => {
    const t0 = (minutesAtEntry + r.extra) / MINUTES_PER_YEAR;
    const t1 = (minutesAtEntry + r.extra - elapsed) / MINUTES_PER_YEAR;
    const entry = r2(callValue(LONG.entry!, strike, t0, vol));
    const atTarget = r2(callValue(LONG.target!, strike, t1, vol));
    const atStop = r2(callValue(LONG.stop!, strike, t1, vol));
    const flat = r2(callValue(LONG.entry!, strike, t1, vol));
    const pct = (v: number) => Math.round((v / entry - 1) * 100);
    return {
      id: r.id,
      label: r.label,
      delta: r2(callDelta(LONG.entry!, strike, t0, vol)),
      entry,
      atTarget,
      atStop,
      flat,
      targetPct: pct(atTarget),
      stopPct: pct(atStop),
      flatPct: pct(flat),
    };
  });
  return { strike, vol, minutesAtEntry, elapsed, underlying: LONG, rows };
})();

const [ZERO, MONTH] = ORB_OPTION_EXAMPLE.rows;

export const ORB_CAVEATS: OrbCaveat[] = [
  {
    id: "close-vs-open",
    title: "Entry on the close or the next open?",
    text: "The signal only exists once the 15-minute candle has closed. In practice you fill a moment later, at or near the next candle's open, which can be better or worse than the close. Decide which one your plan uses, and measure the stop and target from your actual fill.",
  },
  {
    id: "wide-range",
    title: "A wide range means a deep stop",
    text: `The stop is the other end of the range, so a wide range means a big loss if it fails. With a SAMPLE ${ORB_RISK_BUDGET} risk budget, the ${fmt(LONG.risk!)} stop in the normal session allows ${sizeFor(ORB_RISK_BUDGET, LONG.risk!)} shares; the ${fmt(WIDE.risk!)} stop in the wide session allows only ${sizeFor(ORB_RISK_BUDGET, WIDE.risk!)}. Size down to keep the dollar risk the same, or skip the day.`,
  },
  {
    id: "premium-not-1to1",
    title: "1:1 on SPY is not 1:1 on the option",
    text: `Same trade, ${fmt(ORB_OPTION_EXAMPLE.strike)} call, assumed ${ORB_OPTION_EXAMPLE.vol * 100}% volatility: the same-day contract costs ${fmt(ZERO.entry)} and is worth about ${fmt(ZERO.atTarget)} at the target (+${ZERO.targetPct}%) but ${fmt(ZERO.atStop)} at the stop (${ZERO.stopPct}%). A one-month contract costs ${fmt(MONTH.entry)} and moves about ${MONTH.targetPct}% either way. The option's price moves by roughly delta × the stock's move, and delta itself changes (gamma), so the reward-to-risk on the premium is not the 1:1 drawn on the chart.`,
  },
  {
    id: "no-expiry-rule",
    title: "The reel gives no expiry rule",
    text: `Time decay works against option buyers, fastest on same-day contracts. If SPY simply sat at the entry for an hour, the same-day call would lose about ${Math.abs(ZERO.flatPct)}% while the one-month call would lose about ${Math.abs(MONTH.flatPct)}%. Pick the expiry on purpose and know what a stall costs.`,
  },
  {
    id: "strike-subjective",
    title: "Strike choice is subjective",
    text: `"Just above the price" is the reel's habit, not a rule. Here the ${fmt(ORB_OPTION_EXAMPLE.strike)} call has a delta of about ${fmt(ZERO.delta)} at entry. Further out of the money is cheaper but needs a bigger move; in the money costs more but tracks SPY more closely.`,
  },
  {
    id: "afford",
    title: "Only risk what you can afford to lose",
    text: "When you buy options, the most you can lose is the premium you paid, and short-dated premium can go to zero within a day. Size the trade so a full loss is a number you accept before you click.",
  },
];

// ---------------------------------------------------------------- glossary

export const ORB_TERMS: LiteracyTerm[] = [
  {
    id: "opening-range",
    name: "Opening range",
    category: "markets",
    summary: "The high and low of the first part of the session, e.g. the first two 15-minute candles (9:30–10:00 ET).",
    detail:
      "Traders mark it because the open is where the overnight news gets priced and both sides fight hardest. Some use the first 5, 15 or 30 minutes; the 15-minute version in Practice → Opening range breakout uses the first 30 minutes. Educational, not advice.",
  },
  {
    id: "opening-range-breakout",
    name: "Opening range breakout (ORB)",
    category: "process",
    summary: "Enter when a candle closes outside the opening range; stop at the other end of the range; a fixed reward-to-risk target.",
    detail:
      "The version taught in Practice → Opening range breakout: 15-minute candles, a close above the range for longs (calls) or below it for shorts (puts), stop at the opposite end, 1:1 target measured on the underlying. A wick through the line is not a signal, and a wide range means a deep stop, so size down or skip. Educational, not advice.",
  },
  {
    id: "underlying-vs-premium-rr",
    name: "Reward-to-risk: underlying vs option premium",
    category: "position",
    summary: "A 1:1 target on the stock's chart is not a 1:1 gain-to-loss on the option you bought.",
    detail:
      "An option's price moves by roughly its delta for each $1 in the stock, delta changes as price moves (gamma), and time decay (theta) keeps eating the premium. A short-dated call can gain more at the target than it loses at the stop, or lose most of its value if price stalls. Plan risk in premium dollars as well as on the chart. Educational, not advice.",
  },
];

// ---------------------------------------------------------------- Learn questions (ORB-)

type OptId = "A" | "B" | "C" | "D";
const IDS: OptId[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: OptId, right: string, wrong: string[], explanation: string, extra: Partial<QuizQuestion> = {}): QuizQuestion {
  const o = [...wrong];
  o.splice(IDS.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: IDS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...extra };
}
const chart = (s: OrbSession, pre: boolean): Partial<QuizQuestion> => {
  const a = orbAnnotations(s);
  return {
    patternKey: pre ? `${s.id}-pre` : s.id,
    highlightIndex: s.decisionIndex,
    annotations: a.before,
    ...(pre ? {} : { revealAnnotations: a.reveal }),
  };
};

const WICK = ORB_BY_ID["orb-wick"];
const LONG_S = ORB_BY_ID["orb-long"];
const SHORT_S = ORB_BY_ID["orb-short"];
const WIDE_S = ORB_BY_ID["orb-wide"];
const FAIL_S = ORB_BY_ID["orb-fail"];
const SHORT = orbPlan(SHORT_S.bars);
const FAIL = orbPlan(FAIL_S.bars);
const WICKR = openingRange(WICK.bars);

export const ORB_QUESTIONS: QuizQuestion[] = [
  mc("ORB-01", "In this 15-minute opening range breakout, what is the opening range?", "B", "The high and low of the first two 15-minute candles (the first 30 minutes)",
    ["Yesterday's high and low", "The first 1-minute candle only", "The high and low of the whole morning"],
    "Mark the high and low of the 9:30 and 9:45 ET candles. Nothing is decided until a candle closes outside that box.", { glossaryTermId: "opening-range" }),
  mc("ORB-02", `SAMPLE SPY.S. Range ${fmt(WICKR.low)}–${fmt(WICKR.high)}. The 10:15 candle traded to ${fmt(WICK.bars[3].high)} but closed at ${fmt(WICK.bars[3].close)}. What does the rule say?`, "C", "Wait: a wick above the range is a test, not a close outside it",
    ["Buy calls: price broke the high", "Buy puts: the breakout failed", "Move the range high up to the wick"],
    "Only a 15-minute close outside the range is a signal. This one closed back inside, and the rest of the morning chopped in the box.", { ...chart(WICK, true), revealAnnotations: { levels: [{ price: WICK.bars[3].high, label: "Wick only", tone: "neutral" }] }, glossaryTermId: "opening-range-breakout" }),
  mc("ORB-03", `Range ${fmt(LONG.rangeLow)}–${fmt(LONG.rangeHigh)}. The 10:30 candle closed at ${fmt(LONG.entry!)}. Which way, and where is the stop?`, "A", `Long / calls, stop at the range low ${fmt(LONG.rangeLow)}`,
    [`Long / calls, stop at the range high ${fmt(LONG.rangeHigh)}`, `Short / puts, stop at ${fmt(LONG.entry!)}`, "No stop: the range already held"],
    `A close above the range high is the long signal. The stop goes at the opposite end of the range, ${fmt(LONG.rangeLow)}: if price crosses the whole range back down, the breakout failed.`, chart(LONG_S, true)),
  mc("ORB-04", `Same trade: entry ${fmt(LONG.entry!)} on the close, stop ${fmt(LONG.stop!)}. Where is the 1:1 target on SPY?`, "D", fmt(LONG.target!),
    [fmt(r2(LONG.entry! + LONG.width)), fmt(r2(LONG.rangeHigh + LONG.width)), fmt(r2(LONG.entry! + 2 * LONG.risk!))],
    `Risk is entry − stop = ${fmt(LONG.entry!)} − ${fmt(LONG.stop!)} = ${fmt(LONG.risk!)}, a bit more than the ${fmt(LONG.width)} range because the close was above the high. 1:1 adds the same ${fmt(LONG.risk!)}: ${fmt(LONG.target!)}. It was reached in the 11:45 candle.`, chart(LONG_S, false)),
  mc("ORB-05", `Range ${fmt(SHORT.rangeLow)}–${fmt(SHORT.rangeHigh)}. The 10:15 candle closed at ${fmt(SHORT.entry!)}. What is the plan?`, "B", `Puts / short, stop ${fmt(SHORT.stop!)}, 1:1 target ${fmt(SHORT.target!)}`,
    [`Calls / long, stop ${fmt(SHORT.rangeLow)}, target ${fmt(SHORT.rangeHigh)}`, `Puts / short, stop ${fmt(SHORT.rangeLow)}, target ${fmt(r2(SHORT.entry! - 0.3))}`, "Wait for the range high to break first"],
    `A close below the low is the short signal. Stop at the range high ${fmt(SHORT.stop!)}; risk ${fmt(SHORT.risk!)}, so the 1:1 target is ${fmt(SHORT.target!)}, reached in the 11:00 candle.`, chart(SHORT_S, false)),
  mc("ORB-06", "Why wait for the candle to close instead of entering the moment price trades through the line?", "A", "Wicks through the line often close back inside; the close is the 15-minute verdict",
    ["The close is always the best price", "Orders cannot be placed during a candle", "It makes the stop smaller"],
    "Entering on the touch means buying every fake-out wick. Waiting costs a little price, and in return the signal has actually happened."),
  mc("ORB-07", "The signal candle closes at 582.10. Your order fills at 582.35 on the next candle's open. What do you measure the risk and target from?", "C", "Your real fill, 582.35: the risk is now 2.75 and the 1:1 target 585.10",
    ["The 582.10 close, as if you had filled there", "The range high, 581.60", "Nothing changes; targets are fixed in advance"],
    "Decide in advance whether your rule enters on the close or the next open, then do the math from where you actually got in. Slippage changes both the risk and the target."),
  mc("ORB-08", `Normal day: stop ${fmt(LONG.risk!)} away. Wide day: the range is ${fmt(WIDE.width)} and the stop ${fmt(WIDE.risk!)} away. With a SAMPLE ${ORB_RISK_BUDGET} risk budget, what changes?`, "D", `Size down to about ${sizeFor(ORB_RISK_BUDGET, WIDE.risk!)} shares (from ${sizeFor(ORB_RISK_BUDGET, LONG.risk!)}), or skip the day`,
    ["Same size: the rule is the rule", "Move the stop to the middle of the range so the size fits", "Double the size because big ranges move more"],
    `${ORB_RISK_BUDGET} ÷ ${fmt(WIDE.risk!)} ≈ ${sizeFor(ORB_RISK_BUDGET, WIDE.risk!)} shares vs ${ORB_RISK_BUDGET} ÷ ${fmt(LONG.risk!)} = ${sizeFor(ORB_RISK_BUDGET, LONG.risk!)}. The stop belongs at the other end of the range; the size is what adjusts. Skipping is also a valid plan.`, { ...chart(WIDE_S, false), glossaryTermId: "position-sizing" }),
  mc("ORB-09", `SPY moves 1:1, +${fmt(LONG.risk!)} or −${fmt(LONG.risk!)}. A same-day ${fmt(ORB_OPTION_EXAMPLE.strike)} call bought at ${fmt(ZERO.entry)} is worth about ${fmt(ZERO.atTarget)} at the target and ${fmt(ZERO.atStop)} at the stop (SAMPLE, assumed volatility). What does that show?`, "B", "1:1 on the underlying is not 1:1 on the premium: delta and gamma change how much the option moves",
    ["The option math is wrong; it should be +100% / −100%", "Options always pay double the stock", "Calls cannot lose more than the stock"],
    `+${ZERO.targetPct}% vs ${ZERO.stopPct}% on the premium. The option moves by roughly delta × the stock's move, delta grows as the call moves toward the money (gamma), and time decay works throughout.`, { glossaryTermId: "underlying-vs-premium-rr" }),
  mc("ORB-10", "The reel does not say which expiry to buy. Why does that matter?", "C", `Same-day contracts decay fastest: if SPY stalls for an hour, the same-day call here loses about ${Math.abs(ZERO.flatPct)}%, the one-month call about ${Math.abs(MONTH.flatPct)}%`,
    ["It does not: every expiry behaves the same", "Longer expiries cannot lose money", "Expiry only matters for puts"],
    "Time decay (theta) is the cost of waiting, and it accelerates near expiration. Choose the expiry deliberately and know what a stall costs.", { glossaryTermId: "short-dated-option" }),
  mc("ORB-11", "The reel buys a strike just past the price (slightly out of the money). How should you treat that?", "A", "As a preference: cheaper, but a lower delta and more sensitive to a stall than an in-the-money strike",
    ["As the only correct strike", "Always buy far out of the money for the biggest gain", "Strike does not affect the trade"],
    `Strike choice is subjective. The ${fmt(ORB_OPTION_EXAMPLE.strike)} call here starts with a delta near ${fmt(ZERO.delta)}: it gains about ${fmt(ZERO.delta)} per $1 at first.`, { glossaryTermId: "strike-price" }),
  mc("ORB-12", `Range ${fmt(FAIL.rangeLow)}–${fmt(FAIL.rangeHigh)}. You bought the close above at ${fmt(FAIL.entry!)} with the stop at ${fmt(FAIL.stop!)}. Price falls back through the range and trades to ${fmt(FAIL_S.bars[5].low)}. Now?`, "B", "Out at the stop: a 1R loss, exactly as planned",
    ["Hold: it was above the range an hour ago", "Buy more puts and calls to hedge", "Move the stop to the day's low"],
    `A valid signal can still fail. Crossing the whole range the other way is the invalidation, and the stop keeps it to ${fmt(FAIL.risk!)} on SPY.`, { ...chart(FAIL_S, false), glossaryTermId: "stop-loss-invalidation" }),
  mc("ORB-13", "Why is the stop at the opposite end of the range, not just below the breakout candle?", "D", "Because the idea is \"price leaves the range in this direction\": crossing the whole range the other way proves it wrong",
    ["Because it is always the smallest stop", "Because brokers require it", "Because the target is measured from the range middle"],
    "The stop goes where the trade idea is invalidated. A tighter stop can work, but then it is a different plan with a different win rate."),
  mc("ORB-14", "You buy calls on the ORB signal. What is the most you can lose?", "C", "The premium you paid, which on a same-day contract can go to zero within hours",
    ["The 1:1 distance on SPY", "Nothing, if you have a stop", "Unlimited, like a short stock"],
    "A stop limits the loss only if it fills. A long option's worst case is the whole premium, so size the trade so that loss is affordable."),
];

/** Links from the lesson page to the other ORB surfaces. */
export const ORB_LINKS: { label: string; to: string }[] = [
  { label: "Learn · Opening Range Breakout", to: "/training?group=opening-range&start=1" },
  { label: "Coach · Trade the opening range", to: "/coach/opening-range-breakout" },
  { label: "Cases · Price action trades (ORB cases)", to: "/cases?pack=price-action" },
  { label: "Price action trading framework (entry, stop, trail, target)", to: "/practice/trade-framework" },
  { label: "Glossary · Short-dated option", to: "/archive?tab=literacy&open=short-dated-option" },
  { label: "Glossary · Pattern day trader rule (FINRA-sourced)", to: "/archive?tab=literacy&open=pattern-day-trader" },
];

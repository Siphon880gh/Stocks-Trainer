/**
 * Breakout → pullback → fair value gap, as taught in a short Facebook trading reel
 * (https://www.facebook.com/reel/1521919442778905; no creator named on screen): do not buy the breakout candle as it
 * first crosses resistance (it is a SIGNAL, not an entry); a fast move leaves an IMBALANCE, a gap between candle 1's
 * high and candle 3's low (commonly called a fair value gap, FVG); wait for price to pull back into that gap and enter
 * there, with the stop below the gap and the broken level. The reel says such gaps are "often retested"; the app
 * presents that as a common belief, not a fact, and adds what the reel skips: no gap means no setup, some gaps are
 * never revisited (a missed trade is the cost of waiting), a pullback can keep going, and the reel gives no target
 * rule, so exits point to the app's price action trading framework (/practice/trade-framework).
 *
 * Feeds /practice/fair-value-gap, the Learn group `fair-value-gap` (FVG- questions), FVG_CASES in
 * priceActionCases.ts, the coach session `breakout-pullback-fvg`, the glossary and the Playbook kit
 * `breakout-pullback-fvg` (FVG_CREDIBILITY, FVG_RELATED). Every tape is SAMPLE (stylized 5-minute candles).
 * Type-only imports, so there is no runtime import cycle. Checked by fairValueGap.test.ts. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { OHLC } from "./ohlcData";
import type { ChartAnnotations } from "./chartAnnotations";
import type { LiteracyTerm } from "./literacyTerms";
import type { PlaybookCredibility } from "./playbooks";

export const FVG_DISCLAIMER = "SAMPLE 5-minute tapes for learning a process, not trading advice.";
export const FVG_SOURCE = {
  label: "A short Facebook trading reel: breakout, pullback and the gap",
  url: "https://www.facebook.com/reel/1521919442778905",
  note: "The setup is restated from the reel, which names no creator on screen. The \"often retested\" line is the reel's claim, and the caveats are the app's.",
} as const;

/** Stop sits this far below the lower of the gap bottom and the broken level (SAMPLE buffer, in price units). */
export const FVG_STOP_BUFFER = 0.1;
/** The reel gives no target rule. The lesson shows a 2R example and points to the trade framework for exits. */
export const FVG_EXAMPLE_R = 2;
/** SAMPLE risk budget used for sizing examples (dollars per trade). */
export const FVG_RISK_BUDGET = 200;

const b = (name: string, open: number, high: number, low: number, close: number): OHLC => ({ name, open, high, low, close });
const r2 = (v: number) => Math.round(v * 100) / 100;
export const fmt = (v: number) => v.toFixed(2);

/** 5-minute candles named by their ET start time, from 10:00. */
const clock5 = (data: Array<[number, number, number, number]>, startMinutes = 10 * 60): OHLC[] =>
  data.map(([o, h, l, c], i) => {
    const m = startMinutes + i * 5;
    return b(`${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`, o, h, l, c);
  });

// ---------------------------------------------------------------- pure helpers

export interface FairValueGap {
  /** Index of the middle (fast) candle; the gap sits between candles index-1 and index+1. */
  index: number;
  direction: "bullish" | "bearish";
  bottom: number;
  top: number;
}

/**
 * Every three-candle imbalance in `bars`. Bullish: candle 3's low is above candle 1's high (gap = candle 1 high →
 * candle 3 low). Bearish: candle 3's high is below candle 1's low. If the wicks overlap, even by a cent, there is no gap.
 */
export function detectFairValueGaps(bars: OHLC[]): FairValueGap[] {
  const out: FairValueGap[] = [];
  for (let i = 1; i < bars.length - 1; i++) {
    const a = bars[i - 1];
    const c = bars[i + 1];
    if (c.low > a.high) out.push({ index: i, direction: "bullish", bottom: a.high, top: c.low });
    else if (c.high < a.low) out.push({ index: i, direction: "bearish", bottom: c.high, top: a.low });
  }
  return out;
}

/** The bullish gap left by the breakout candle itself: the first candle that closes above `level` after a close at or below it. */
export function breakoutGap(bars: OHLC[], level: number): FairValueGap | null {
  const i = bars.findIndex((x, k) => k > 0 && x.close > level && bars[k - 1].close <= level);
  if (i < 1) return null;
  return detectFairValueGaps(bars).find((g) => g.index === i && g.direction === "bullish") ?? null;
}

/** First candle after the gap formed (after candle 3) that trades back down into it. */
export function firstPullbackInto(bars: OHLC[], gap: FairValueGap): number | null {
  for (let j = gap.index + 2; j < bars.length; j++) if (bars[j].low <= gap.top) return j;
  return null;
}

export interface FvgPlan {
  level: number;
  gap: FairValueGap | null;
  /** Candle that pulled back into the gap (entry fills there), or null if price never came back. */
  pullbackIndex: number | null;
  entry: number | null;
  stop: number | null;
  risk: number | null;
  /** SAMPLE 2R example target; the reel gives no target rule. */
  target: number | null;
}

/** Entry at the top of the gap on the pullback, stop just below the gap and the broken level, 2R example target. */
export function fvgPlan(bars: OHLC[], level: number): FvgPlan {
  const gap = breakoutGap(bars, level);
  const empty = { level, gap, pullbackIndex: null, entry: null, stop: null, risk: null, target: null };
  if (!gap) return empty;
  const stop = r2(Math.min(gap.bottom, level) - FVG_STOP_BUFFER);
  const entry = gap.top;
  const risk = r2(entry - stop);
  const target = r2(entry + FVG_EXAMPLE_R * risk);
  return { ...empty, pullbackIndex: firstPullbackInto(bars, gap), entry, stop, risk, target };
}

/** Whole shares you can hold so that (shares × risk per share) stays within the budget. */
export const fvgSizeFor = (budget: number, riskPerUnit: number) => Math.floor(budget / riskPerUnit + 1e-9);

// ---------------------------------------------------------------- SAMPLE tapes and drills

export type FvgAnswer = "chase" | "gap" | "wait";
export const FVG_ANSWER_LABELS: Record<FvgAnswer, string> = {
  chase: "Buy now: the breakout is happening",
  gap: "Buy the pullback into the gap, stop below the gap and the broken level",
  wait: "Wait: no entry here",
};
export const FVG_ANSWERS: FvgAnswer[] = ["chase", "gap", "wait"];

export interface FvgSession {
  id: string;
  title: string;
  /** The resistance level that was broken. */
  level: number;
  bars: OHLC[];
  decisionIndex: number;
  answer: FvgAnswer;
  why: string;
  outcome: string;
}

/** Resistance 50.00, breakout at 10:30, gap 49.99–50.40, pullback into it at 10:50, then higher. */
const TAPE_CLEAN = clock5([
  [49.4, 49.75, 49.3, 49.6], [49.6, 49.98, 49.5, 49.7], [49.7, 49.8, 49.45, 49.55], [49.55, 50.0, 49.5, 49.85],
  [49.85, 49.95, 49.6, 49.75], [49.75, 49.99, 49.65, 49.9], [49.9, 51.1, 49.88, 51.0], [51.0, 51.4, 50.4, 51.3],
  [51.3, 51.45, 50.9, 51.0], [51.0, 51.05, 50.55, 50.65], [50.65, 50.7, 50.25, 50.45], [50.45, 50.95, 50.4, 50.9],
  [50.9, 51.5, 50.85, 51.45], [51.45, 52.0, 51.35, 51.9],
]);
/** Resistance 30.00, breakout at 10:25, but candle 3's low overlaps candle 1's high: no gap. Falls back under the level. */
const TAPE_NO_GAP = clock5([
  [29.5, 29.8, 29.4, 29.7], [29.7, 29.98, 29.6, 29.75], [29.75, 29.9, 29.55, 29.8], [29.8, 30.0, 29.7, 29.9],
  [29.9, 29.97, 29.75, 29.85], [29.85, 30.4, 29.8, 30.3], [30.3, 30.45, 29.95, 30.1], [30.1, 30.15, 29.7, 29.8],
  [29.8, 29.9, 29.5, 29.6],
]);
/** Resistance 80.00, breakout at 10:20 leaves a gap 79.98–80.60 that is never revisited. */
const TAPE_RUNAWAY = clock5([
  [79.2, 79.7, 79.1, 79.5], [79.5, 79.95, 79.4, 79.6], [79.6, 79.8, 79.3, 79.45], [79.45, 79.98, 79.4, 79.9],
  [79.9, 81.2, 79.85, 81.1], [81.1, 81.9, 80.6, 81.8], [81.8, 82.5, 81.5, 82.4], [82.4, 83.1, 82.2, 83.0],
  [83.0, 83.8, 82.8, 83.6], [83.6, 84.2, 83.4, 84.0],
]);
/** Resistance 20.00, gap 19.97–20.30, pullback into it at 10:35, then a close back under the level: stopped out. */
const TAPE_FAIL = clock5([
  [19.6, 19.85, 19.5, 19.7], [19.7, 19.99, 19.65, 19.8], [19.8, 19.9, 19.55, 19.65], [19.65, 19.97, 19.6, 19.9],
  [19.9, 20.7, 19.88, 20.6], [20.6, 20.9, 20.3, 20.8], [20.8, 20.85, 20.45, 20.5], [20.5, 20.55, 20.15, 20.25],
  [20.25, 20.3, 19.7, 19.75], [19.75, 19.85, 19.4, 19.5],
]);

export const FVG_SESSIONS: FvgSession[] = [
  {
    id: "fvg-signal",
    title: "The breakout candle crosses resistance",
    level: 50,
    bars: TAPE_CLEAN,
    decisionIndex: 6,
    answer: "wait",
    why: "The 10:30 candle is crossing 50.00, a level that capped price three times. That is the signal. The setup needs the next candle to see whether the move left a gap, and then a pullback into it.",
    outcome: "The 10:35 candle's low (50.40) stayed above the 10:25 high (49.99): a gap. Price pulled back into it at 10:50 and then climbed. Buying at the 10:30 high (51.10) would have meant sitting through a 0.85 dip.",
  },
  {
    id: "fvg-pullback",
    title: "Price pulls back into the gap",
    level: 50,
    bars: TAPE_CLEAN,
    decisionIndex: 10,
    answer: "gap",
    why: "The breakout left a gap from 49.99 (10:25 high) to 50.40 (10:35 low). The 10:50 candle traded down to 50.25, into the gap, and held above it. Entry 50.40 at the top of the gap, stop 49.89 under the gap and the 50.00 level.",
    outcome: "Risk 0.51 per share. The SAMPLE 2R target 51.42 was reached at 11:00, and price never came near the stop.",
  },
  {
    id: "fvg-no-gap",
    title: "A breakout with no gap",
    level: 30,
    bars: TAPE_NO_GAP,
    decisionIndex: 6,
    answer: "wait",
    why: "The 10:25 candle closed above 30.00, but the 10:30 candle's low (29.95) dipped below the 10:20 high (29.97). The wicks overlap, so there is no gap and the reel's entry does not exist.",
    outcome: "The breakout failed: the 10:35 candle closed at 29.80, back under the level. No gap, no setup, no trade.",
  },
  {
    id: "fvg-runaway",
    title: "The gap is never revisited",
    level: 80,
    bars: TAPE_RUNAWAY,
    decisionIndex: 7,
    answer: "wait",
    why: "The breakout left a gap at 79.98–80.60, but price is now at 83.00 and has not come back. Buying here is chasing: the stop would still belong under 79.98, more than 3.00 away.",
    outcome: "Price kept climbing to 84.20 without a pullback. The trade was missed, and that is the cost of waiting. It is not a reason to chase.",
  },
  {
    id: "fvg-fail",
    title: "A pullback that keeps going",
    level: 20,
    bars: TAPE_FAIL,
    decisionIndex: 7,
    answer: "gap",
    why: "Gap 19.97–20.30 from the 10:20 breakout. The 10:35 candle traded down to 20.15, into the gap. By the rule this is a valid long at 20.30 with the stop at 19.87.",
    outcome: "The next candle closed at 19.75, below the gap and back under 20.00, and traded through the 19.87 stop: a planned 1R loss of 0.43. A valid setup can still lose. The stop keeps the loss small.",
  },
];

export const FVG_BY_ID: Record<string, FvgSession> = Object.fromEntries(FVG_SESSIONS.map((s) => [s.id, s]));

/** Annotations: the level (and the gap once candle 3 has printed) before the answer; entry / stop / target after it. */
export function fvgAnnotations(s: FvgSession): { before: ChartAnnotations; reveal: ChartAnnotations } {
  const p = fvgPlan(s.bars, s.level);
  const levels = [{ price: s.level, label: `Resistance ${fmt(s.level)}`, tone: "supply" as const }];
  const gapVisible = p.gap && p.gap.index + 1 <= s.decisionIndex;
  const zone = (g: FairValueGap) => ({ fromIndex: g.index - 1, top: g.top, bottom: g.bottom, label: `Gap ${fmt(g.bottom)}–${fmt(g.top)}`, tone: "demand" as const, labelAt: "bottom" as const });
  const before: ChartAnnotations = { levels, ...(gapVisible ? { zones: [zone(p.gap!)] } : {}) };
  if (!p.gap || p.entry === null || p.stop === null || p.target === null) return { before, reveal: {} };
  return {
    before,
    reveal: {
      ...(gapVisible ? {} : { zones: [zone(p.gap)] }),
      ...(p.pullbackIndex !== null ? { points: [{ index: p.pullbackIndex, price: p.entry, label: `Entry ${fmt(p.entry)}`, tone: "entry" as const }] } : {}),
      levels: [
        { price: p.stop, label: `Stop ${fmt(p.stop)} (below gap and level)`, tone: "risk" },
        { price: p.target, label: `2R example ${fmt(p.target)}`, tone: "reward" },
      ],
    },
  };
}

/** Chart series for quiz questions: full tapes plus `-pre` versions that stop at the decision candle. */
export const FVG_OHLC: Record<string, OHLC[]> = Object.fromEntries(
  FVG_SESSIONS.flatMap((s) => [
    [s.id, s.bars],
    [`${s.id}-pre`, s.bars.slice(0, s.decisionIndex + 1)],
  ]),
);

/** Three-candle snippets for the "gap vs no gap" panel: candle 1, the fast candle, candle 3. */
export const FVG_THREE_CANDLES = {
  gap: TAPE_CLEAN.slice(5, 8),
  noGap: TAPE_NO_GAP.slice(4, 7),
} as const;

// ---------------------------------------------------------------- the setup, as taught

export interface FvgStep {
  n: number;
  title: string;
  rule: string;
  detail: string;
}

export const FVG_STEPS: FvgStep[] = [
  { n: 1, title: "Mark the level", rule: "Find resistance that has capped price more than once.", detail: "The level tells you where to watch. It does not tell you when to act." },
  { n: 2, title: "The breakout candle is a signal, not an entry", rule: "Do not buy as the candle first crosses the level.", detail: "The first cross is where late buyers chase and where many breakouts reverse. It tells you something is happening, not where to get in." },
  { n: 3, title: "Look for the imbalance", rule: "Compare candle 1's high with candle 3's low around the breakout candle. If candle 3's low is above candle 1's high, the space between them is a gap.", detail: "Commonly called a fair value gap (FVG) or imbalance: price moved so fast that only one side traded there. If the wicks overlap, even by a cent, there is no gap." },
  { n: 4, title: "Wait for the pullback into the gap", rule: "Enter long when price pulls back into the gap.", detail: "That pullback is the confirmation the reel waits for. The reel says these gaps are often retested. That is a common belief, not a promise." },
  { n: 5, title: "Stop below the gap and the level", rule: "Put the stop just under the lower of the gap bottom and the broken level, and plan the target before entry.", detail: "If price closes back below both, the breakout idea has failed. The reel shows a target well above but gives no rule for it, so use the price action trading framework for targets and trailing stops." },
];

export interface FvgCaveat {
  id: string;
  title: string;
  text: string;
}

const CLEAN = fvgPlan(TAPE_CLEAN, 50);
const FAIL = fvgPlan(TAPE_FAIL, 20);

export const FVG_CAVEATS: FvgCaveat[] = [
  {
    id: "belief-not-fact",
    title: "\"Often retested\" is a belief, not a guarantee",
    text: "Many traders watch these gaps, and price often does come back into them. But some gaps are revisited within a few candles, some take weeks, and some never are. The gap shows where price moved fast, not where it must return.",
  },
  {
    id: "missed-trade",
    title: "Missing a trade is the cost of waiting",
    text: "The strongest breakouts often never pull back. Waiting gets a better price and a closer stop on the trades that do come back, and nothing on the ones that run. Chasing the runner afterwards throws away the reason you waited.",
  },
  {
    id: "no-gap-no-setup",
    title: "No gap, no setup",
    text: "If candle 3's low touches or dips below candle 1's high, the wicks overlap and there is no imbalance. A plain breakout-and-retest of the level is a different setup with its own rules.",
  },
  {
    id: "pullback-can-fail",
    title: "A pullback can keep going",
    text: `Entering in the gap is still a bet. In the failed SAMPLE tape the entry at ${fmt(FAIL.entry!)} was valid, and the next candle closed under the gap and the level and hit the ${fmt(FAIL.stop!)} stop: a planned loss of ${fmt(FAIL.risk!)} a share. Decide on closes: a wick through the gap that closes back inside is a test, a close below it ends the idea.`,
  },
  {
    id: "no-target-rule",
    title: "The reel gives no target rule",
    text: `The reel's picture shows a target well above the entry, which implies a good reward-to-risk, but it does not say where. Decide before entry: the next resistance, a fixed multiple of the risk (here ${FVG_EXAMPLE_R}R = ${fmt(CLEAN.target!)} on a ${fmt(CLEAN.risk!)} risk), or a trailing stop under higher lows.`,
  },
  {
    id: "size-from-stop",
    title: "Size from the stop",
    text: `A ${fmt(CLEAN.risk!)} stop with a SAMPLE ${FVG_RISK_BUDGET} risk budget allows ${fvgSizeFor(FVG_RISK_BUDGET, CLEAN.risk!)} shares. A wide gap means a deep stop and a smaller size, not a tighter stop inside the gap.`,
  },
];

// ---------------------------------------------------------------- glossary

export const FVG_TERMS: LiteracyTerm[] = [
  {
    id: "imbalance",
    name: "Imbalance (price)",
    category: "markets",
    summary: "A stretch of price that a fast move skipped through with almost no two-way trading.",
    detail:
      "On a chart it shows up as a gap between candle 1's wick and candle 3's wick around one large candle. Traders often call it a fair value gap. Some expect price to return to it and \"rebalance\". That is a common belief, not a rule. See Practice → Breakout, pullback and fair value gap. Educational, not advice.",
  },
  {
    id: "fair-value-gap",
    name: "Fair value gap (FVG)",
    category: "process",
    summary: "Three candles where candle 3's low is above candle 1's high (bullish) or candle 3's high is below candle 1's low (bearish).",
    detail:
      "The gap runs from candle 1's high to candle 3's low, around the fast middle candle. If the wicks overlap, even by a cent, there is no gap. Many traders treat it as a zone price may pull back into, and buy that pullback with the stop below the gap. Some gaps are never revisited, and a close through the far side ends the idea. The term comes from ICT / smart-money teaching. Educational, not advice.",
  },
  {
    id: "breakout-signal-vs-entry",
    name: "Breakout signal vs entry",
    category: "process",
    summary: "The candle that first crosses a level is a signal that something is happening, not necessarily the place to buy.",
    detail:
      "Buying the first cross catches every runner and every fake-out. Waiting for confirmation, such as a pullback into the gap the move left or a retest of the broken level that holds, gives a closer stop but misses breakouts that never come back. Pick one in advance. Educational, not advice.",
  },
];

// ---------------------------------------------------------------- Learn questions (FVG-)

const IDS = ["A", "B", "C", "D"] as const;
type OptId = (typeof IDS)[number];
function mc(id: string, prompt: string, at: OptId, right: string, wrong: string[], explanation: string, extra: Partial<QuizQuestion> = {}): QuizQuestion {
  const o = [...wrong];
  o.splice(IDS.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: IDS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...extra };
}
const chart = (s: FvgSession, pre: boolean): Partial<QuizQuestion> => {
  const a = fvgAnnotations(s);
  return {
    patternKey: pre ? `${s.id}-pre` : s.id,
    highlightIndex: s.decisionIndex,
    annotations: a.before,
    ...(pre ? {} : { revealAnnotations: a.reveal }),
  };
};

const SIG = FVG_BY_ID["fvg-signal"];
const PB = FVG_BY_ID["fvg-pullback"];
const NG = FVG_BY_ID["fvg-no-gap"];
const RUN = FVG_BY_ID["fvg-runaway"];
const FL = FVG_BY_ID["fvg-fail"];
const [G1, , G3] = FVG_THREE_CANDLES.gap;
const [N1, , N3] = FVG_THREE_CANDLES.noGap;

export const FVG_QUESTIONS: QuizQuestion[] = [
  mc("FVG-01", `SAMPLE stock, 5-minute chart. Resistance ${fmt(SIG.level)} capped price three times. The 10:30 candle is crossing it right now. What does this setup do?`, "C", "Wait: the breakout candle is a signal, not an entry",
    ["Buy now before it runs", "Short it: breakouts always fail", "Buy half now and half at the high"],
    "The first cross is where late buyers chase and where many breakouts reverse. The setup waits to see whether the move leaves a gap, then for a pullback into it.", { ...chart(SIG, true), glossaryTermId: "breakout-signal-vs-entry" }),
  mc("FVG-02", `Candle 1 high ${fmt(G1.high)}. Candle 2 is a big green candle. Candle 3 low ${fmt(G3.low)}. Is there a gap?`, "A", `Yes: a bullish gap from ${fmt(G1.high)} to ${fmt(G3.low)}`,
    ["No: the candles are all green", `Yes: from ${fmt(G1.low)} to ${fmt(G3.high)}`, "No: you need four candles"],
    `Candle 3's low (${fmt(G3.low)}) is above candle 1's high (${fmt(G1.high)}), so the space between them traded in one direction only. That space is the gap.`, { glossaryTermId: "fair-value-gap" }),
  mc("FVG-03", `Candle 1 high ${fmt(N1.high)}. Candle 2 closes above resistance. Candle 3 low ${fmt(N3.low)}. Is there a gap?`, "D", "No: the wicks overlap, so there is no imbalance",
    ["Yes: candle 2 is large", "Yes: the gap is candle 2's body", "Only if volume was high"],
    `${fmt(N3.low)} is below ${fmt(N1.high)}: candle 3's wick reaches back into candle 1's range. Overlap by even a cent means no gap, however big candle 2 is.`, { patternKey: `${NG.id}-pre`, highlightIndex: NG.decisionIndex, annotations: fvgAnnotations(NG).before, glossaryTermId: "fair-value-gap" }),
  mc("FVG-04", "Which prices define a bullish fair value gap?", "B", "Candle 1's high and candle 3's low, around a fast middle candle",
    ["Candle 2's open and close", "Yesterday's close and today's open", "The highest high and lowest low of the move"],
    "The middle candle is the fast move. The gap is what it left behind: the range between candle 1's high and candle 3's low. A gap between sessions (yesterday's close vs today's open) is a different thing."),
  mc("FVG-05", "A fast move leaves a stretch of price where almost only buyers traded. What is that commonly called?", "C", "An imbalance, often called a fair value gap (FVG)",
    ["A doji", "A dead-cat bounce", "An opening range"],
    "Traders call it an imbalance or a fair value gap. The FVG name comes from ICT / smart-money teaching.", { glossaryTermId: "imbalance" }),
  mc("FVG-06", `The breakout left a gap from ${fmt(CLEAN.gap!.bottom)} to ${fmt(CLEAN.gap!.top)}. Price pulls back and trades to ${fmt(PB.bars[10].low)}. Where does the setup enter?`, "A", `Long at ${fmt(CLEAN.entry!)}, as price pulls back into the gap`,
    [`Long at ${fmt(PB.bars[6].high)}, the breakout high`, `Long only after a new high above ${fmt(PB.bars[8].high)}`, "Short: the breakout failed"],
    "The pullback into the gap is the confirmation the setup waits for. Entering there gives a much closer stop than buying the breakout high.", chart(PB, true)),
  mc("FVG-07", `Long at ${fmt(CLEAN.entry!)}. Gap ${fmt(CLEAN.gap!.bottom)}–${fmt(CLEAN.gap!.top)}, broken level ${fmt(CLEAN.level)}. Where does the stop belong?`, "D", `Just below both, at ${fmt(CLEAN.stop!)}`,
    [`Inside the gap at ${fmt(r2(CLEAN.entry! - 0.1))}`, `At the breakout high ${fmt(PB.bars[6].high)}`, "No stop: the gap will hold"],
    "If price closes back under the gap and the old resistance, the breakout idea is wrong. A stop inside the gap gets hit by an ordinary pullback.", { ...chart(PB, false), glossaryTermId: "stop-loss-invalidation" }),
  mc("FVG-08", "The reel says these gaps are \"often retested\". How should you treat that?", "B", "As a common trader belief: some gaps are revisited quickly, some take weeks, some never are",
    ["As a rule: every gap fills", "As false: gaps never matter", "As proof the trade will win"],
    "No source in the app shows a reliable fill rate for this exact setup. Treat the gap as a place to watch, with a stop for when it does not hold.", { glossaryTermId: "imbalance" }),
  mc("FVG-09", `Gap ${fmt(fvgPlan(RUN.bars, RUN.level).gap!.bottom)}–${fmt(fvgPlan(RUN.bars, RUN.level).gap!.top)}. Price never came back and is now ${fmt(RUN.bars[7].close)}. What now?`, "C", "Let it go: a missed trade is the cost of waiting",
    ["Buy now: it is clearly strong", "Buy now with the stop at the gap anyway", "Short it because it has gone too far"],
    "Chasing now means a stop more than 3.00 away or no proper stop at all. The strongest breakouts often never pull back. That is the trade-off you accepted by waiting.", chart(RUN, true)),
  mc("FVG-10", `You bought the pullback into the gap at ${fmt(FAIL.entry!)} with the stop at ${fmt(FAIL.stop!)}. The next candle closes at ${fmt(FL.bars[8].close)}, below the gap and back under ${fmt(FL.level)}. Now?`, "A", `Out at the stop: a planned 1R loss of ${fmt(FAIL.risk!)}`,
    ["Hold: gaps get retested", "Buy more at a better price", "Move the stop under the day's low"],
    "A close back below the gap and the level is the invalidation. The setup was valid and still lost. The stop is what keeps the loss small.", { ...chart(FL, false), glossaryTermId: "stop-loss-invalidation" }),
  mc("FVG-11", "The reel shows a target well above the entry but gives no rule for it. What should you do?", "D", "Pick the target before entry: the next level, a fixed multiple of risk, or a trailing stop",
    ["Hold until it feels done", "Copy the picture's target exactly", "Skip targets: the stop is enough"],
    `With a ${fmt(CLEAN.risk!)} risk, a ${FVG_EXAMPLE_R}R example target is ${fmt(CLEAN.target!)}. The app's price action framework covers profit targets and trailing stops.`, { glossaryTermId: "risk-reward" }),
  mc("FVG-12", "What does a bearish fair value gap look like, and how is it traded the same way?", "B", "Candle 3's high is below candle 1's low; short a pullback up into it, stop above the gap and the broken support",
    ["Candle 3's low is above candle 1's high; short the breakdown candle", "Any red candle; buy the dip", "The same as bullish; only buy"],
    "It is the mirror image: a fast drop leaves a gap above price. Shorting needs extra care: losses on a short are not capped.", { glossaryTermId: "fair-value-gap" }),
  mc("FVG-13", `Risk ${fmt(CLEAN.risk!)} a share and a SAMPLE ${FVG_RISK_BUDGET} risk budget. How many shares?`, "C", `${fvgSizeFor(FVG_RISK_BUDGET, CLEAN.risk!)}: ${FVG_RISK_BUDGET} ÷ ${fmt(CLEAN.risk!)}, rounded down`,
    [`${FVG_RISK_BUDGET}: one per dollar`, `${fvgSizeFor(FVG_RISK_BUDGET, CLEAN.risk!) * 2}: the stop is tight, so double up`, "As many as the account allows"],
    "Size from the distance to the stop so a loss costs what you planned. A wider gap means a deeper stop and fewer shares.", { glossaryTermId: "position-sizing" }),
];

/** Links from the lesson page to the other surfaces. */
export const FVG_LINKS: { label: string; to: string }[] = [
  { label: "Learn · Breakout Pullback & Fair Value Gaps", to: "/training?group=fair-value-gap&start=1" },
  { label: "Coach · Buy the pullback, not the breakout", to: "/coach/breakout-pullback-fvg" },
  { label: "Cases · Price action trades (fair value gap cases)", to: "/cases?pack=price-action" },
  { label: "Playbook · Breakout, pullback and fair value gap", to: "/playbooks/breakout-pullback-fvg" },
  { label: "Targets and trailing stops: the price action trading framework", to: "/practice/trade-framework" },
  { label: "Glossary · Breakout and retest", to: "/archive?tab=literacy&open=breakout-retest" },
];

/** Related links on the Playbook page (checked in fairValueGap.test.ts). */
export const FVG_RELATED: { label: string; to: string }[] = [
  { label: "Practice · Breakout, pullback and fair value gap (drills)", to: "/practice/fair-value-gap" },
  { label: "Learn · Breakout Pullback & Fair Value Gaps", to: "/training?group=fair-value-gap&start=1" },
  { label: "Cases · Price action trades (fair value gap cases)", to: "/cases?pack=price-action" },
  { label: "The reel gives no target rule: profit targets and trailing stops in the app's price action trading framework", to: "/practice/trade-framework" },
  { label: "Playbook · Price action in four pillars (confirmation and invalidation)", to: "/playbooks/price-action-four-pillars" },
];

// ---------------------------------------------------------------- Playbook credibility

export const FVG_CREDIBILITY: PlaybookCredibility = {
  title: "How well-tested is this?",
  summary: [
    "The exact recipe here (skip the breakout candle, wait for a pullback into the gap it left, stop below the gap and the broken level) comes from a short Facebook trading reel that names no creator. We found no independent test or track record for that exact recipe.",
    "The reel's line that these gaps are \"often retested\" is a common trader belief, not a guarantee. Some gaps are revisited quickly, some take weeks and some never are, and waiting means missing the breakouts that run.",
    "Each idea inside it, though, is mainstream price-action teaching:",
  ],
  sources: [
    {
      supports: "Wait for confirmation, not the first cross",
      label: "LuxAlgo · Breakout confirmation",
      url: "https://www.luxalgo.com/library/concept/breakout-confirmation/",
      note: "Waiting for a close or a retest means worse prices on breakouts that run and fewer losses on ones that fail; some breakouts never come back.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Pullback (retest) of the broken level",
      label: "Capital.com · How to trade the break and retest",
      url: "https://capital.com/en-int/analysis/how-to-trade-the-break-retest",
      note: "Break, pull back to the broken level, then confirmation that old resistance acts as support; not every breakout retests.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Imbalance / fair value gap",
      label: "NinjaTrader · Ultimate guide to trading fair value gaps",
      url: "https://ninjatrader.com/futures/blogs/fair-value-gaps/",
      note: "A three-candle pattern where candle 1's and candle 3's wicks do not overlap, commonly called an imbalance; treated as live until a candle closes through it.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Gap vs no gap, and gaps that are never revisited",
      label: "Alien Algorithms · Fair value gaps explained",
      url: "https://alienalgorithms.com/fair-value-gaps-tradingview",
      note: "If the wicks overlap by even one tick there is no gap; some gaps are revisited within a few candles, some take weeks, and some never are.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Stop below the gap and the level, size from the stop",
      label: "Brooks Trading Course · Trade management: position sizing",
      url: "https://www.brookstradingcourse.com/ask-al/trade-management-position-sizing/",
      note: "When the stop is farther away than your maximum risk allows, cut the position size.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
  ],
};

export const FVG_PLAYBOOK_SOURCE = {
  url: "https://ninjatrader.com/futures/blogs/fair-value-gaps/",
  label: "NinjaTrader · Ultimate Guide to Trading Fair Value Gaps (FVG)",
  verifiedOn: "2026-10-30",
} as const;

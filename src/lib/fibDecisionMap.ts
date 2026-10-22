/**
 * Fibonacci Retracement as a Decision Map (/practice/fib-decision-map).
 * Deepens #10 fib settings into zone → confirm → stop → target → R:R planning on a SIMULATED 5m decline.
 * Sources: TradingView 43000518158, Fidelity Fibonacci Retracement, FINRA Rule 2270 (day-trading risk).
 * Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";
import type { OHLC } from "./ohlcData";
import type { ChartAnnotations, AnnotationTone } from "./chartAnnotations";

export const AS_OF = "2026-10-22";
export interface Src { label: string; url: string }
const s = (label: string, url: string): Src => ({ label, url });

export const SRC = {
  tv: s("TradingView: Fibonacci Retracement", "https://www.tradingview.com/support/solutions/43000518158-fibonacci-retracement/"),
  fidelity: s("Fidelity: Fibonacci Retracement", "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/fibonacci-retracement"),
  finra2270: s("FINRA Rule 2270: Day-Trading Risk Disclosure", "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2270"),
};

/** Common ratios taught here (internal + 50% + deep 78.6 + extensions). */
export const FIB_RATIOS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618] as const;

export type FibRatio = (typeof FIB_RATIOS)[number];

/** Price at a fib ratio for a decline anchored high → low (0% = low / end of move, 100% = high / start). */
export function fibPrice(high: number, low: number, ratio: number): number {
  const range = high - low;
  return low + range * ratio;
}

/** For an advance low → high: 0% = high end, 100% = low start — same formula with swapped anchors. */
export function fibPriceAdvance(low: number, high: number, ratio: number): number {
  return fibPrice(high, low, ratio);
}

export function riskReward(entry: number, stop: number, target: number): number | null {
  const risk = Math.abs(entry - stop);
  if (risk < 1e-9) return null;
  return Math.abs(target - entry) / risk;
}

/** SIMULATED 5m decline: swing high ~5050 → swing low ~5000, then bounce into fib zone. */
export function buildSim5mDecline(): OHLC[] {
  // Quiet grind up into the swing high, then a 3-bar impulse down, pause, more down to the low, bounce.
  const bars: Array<[number, number, number, number]> = [
    [5038, 5042, 5036, 5040],
    [5040, 5045, 5039, 5044],
    [5044, 5048, 5043, 5047],
    [5047, 5050, 5046, 5049], // swing high region (bar index 3 high=5050)
    [5049, 5049, 5038, 5040], // first down leg
    [5040, 5041, 5028, 5030],
    [5030, 5032, 5018, 5020], // completes early 3-bar measure
    [5020, 5024, 5016, 5018], // pause
    [5018, 5019, 5006, 5008],
    [5008, 5010, 5000, 5001], // swing low (index 9 low=5000)
    [5001, 5012, 5000, 5010], // bounce starts
    [5010, 5022, 5008, 5019], // into ~38.2 zone (5019)
    [5019, 5028, 5016, 5025], // toward 50% (5025)
    [5025, 5032, 5022, 5029], // stall under 61.8 (5030.9)
    [5029, 5031, 5020, 5022], // rejection wick hint
  ];
  return bars.map(([o, h, l, c], i) => ({
    name: `T+${(i + 1) * 5}m`,
    open: o, high: h, low: l, close: c,
  }));
}

export const SIM_5M = buildSim5mDecline();

export const SWING = {
  high: 5050,
  low: 5000,
  highBar: 3,
  lowBar: 9,
  /** Example session VWAP near the 50% for confluence teaching (SIMULATED). */
  vwap: 5025,
};

export function levelTable(high = SWING.high, low = SWING.low): Array<{ ratio: number; label: string; price: number; role: string }> {
  const roles: Record<number, string> = {
    0: "End of the measured move (swing low on a decline)",
    0.236: "Shallow pullback — often too tight for a first entry plan",
    0.382: "Common first reaction zone",
    0.5: "Midpoint (widely watched; not a pure Fibonacci ratio)",
    0.618: "Golden-ratio zone — often the decision area",
    0.786: "Deep retracement — late; invalidation may be close",
    1: "Start of the measured move (swing high on a decline)",
    1.272: "Extension target beyond the swing",
    1.618: "Wider extension / measured stretch",
  };
  return FIB_RATIOS.map((ratio) => ({
    ratio,
    label: `${(ratio * 100).toFixed(ratio % 1 === 0 ? 0 : 1)}%`,
    price: Math.round(fibPrice(high, low, ratio) * 100) / 100,
    role: roles[ratio] ?? "",
  }));
}

export function fibAnnotations(): ChartAnnotations {
  const levels = levelTable().filter((l) => l.ratio <= 1).map((l) => {
    const tone: AnnotationTone = l.ratio === 0.618 || l.ratio === 0.5 ? "demand" : "neutral";
    return { price: l.price, label: l.label, tone };
  });
  return {
    levels,
    points: [
      { index: SWING.highBar, price: SWING.high, label: "Swing high", tone: "supply" },
      { index: SWING.lowBar, price: SWING.low, label: "Swing low", tone: "demand" },
    ],
    trendlines: [
      {
        from: { index: SWING.highBar, price: SWING.high },
        to: { index: SWING.lowBar, price: SWING.low },
        label: "Anchor",
        tone: "neutral",
      },
    ],
  };
}

export const DECISION_STEPS = [
  {
    id: "zone",
    title: "1. Zone",
    body: "Mark where price is reacting inside the retracement (often 38.2–61.8). A zone is a plan area, not an automatic buy.",
  },
  {
    id: "confirm",
    title: "2. Confirm",
    body: "Wait for a behaviour that shows buyers defended the zone: a rejection wick, a bullish engulfing, or a close back above the zone after a probe.",
  },
  {
    id: "stop",
    title: "3. Stop (invalidation)",
    body: "Place risk beyond the level that would break the idea — commonly below the swing low that anchored the fib, or below a deeper ratio you refuse to own.",
  },
  {
    id: "target",
    title: "4. Target",
    body: "Plan a reward toward prior structure or a fib extension (1.272 / 1.618 beyond the swing). Targets are planning markers, not promises.",
  },
  {
    id: "rr",
    title: "5. Risk : Reward",
    body: "R:R = |target − entry| ÷ |entry − stop|. If costs and slippage (see 1-minute charts / MES ticks) leave the plan thin, skip.",
  },
];

export interface DecisionChoice {
  id: string;
  label: string;
  correct: boolean;
  why: string;
}

export const DECISION_DRILL: {
  prompt: string;
  choices: DecisionChoice[];
} = {
  prompt:
    "SIMULATED 5m decline 5050→5000 has bounced to ~5025 (50%) near a SIMULATED session VWAP. Which plan is coherent?",
  choices: [
    {
      id: "a",
      label: "Long at 5025 because it touched 50% — no stop needed; fib levels always hold",
      correct: false,
      why: "Levels are planning aids, not guarantees. FINRA's day-trading disclosure exists because fast plans without risk control lose money quickly.",
    },
    {
      id: "b",
      label: "Zone 50%/VWAP confluence → wait for a bullish rejection/close → stop below 5000 → target prior supply ~5050 (R:R ≈ 1:1 on a 5025 entry) or a partial at 61.8 if short-term",
      correct: true,
      why: "Zone + confluence, confirmation, hard invalidation under the swing low, and an explicit target so you can judge R:R before entry.",
    },
    {
      id: "c",
      label: "Short at 5025 because price is still in a downtrend on the 1-minute, ignore the 5m fib",
      correct: false,
      why: "The fib here is drawn on the 5m impulse. Fighting every 1m bounce without a higher-timeframe plan is the 'more signals, not always better' trap from the 1-minute lesson.",
    },
    {
      id: "d",
      label: "Move the stop to break-even immediately on any green candle so risk becomes zero",
      correct: false,
      why: "Stops are for invalidation of the idea. Scratching to break-even on noise often exits a valid plan early; size and invalidation come first.",
    },
  ],
};

export const CONFLUENCE_NOTES = [
  "Confluence means two or more independent reasons agree at a price (fib + prior swing + VWAP/session average + round number).",
  "One fib touch alone is weak; fib + VWAP + a prior pivot is a clearer decision map.",
  "VWAP is the volume-weighted average price for the session — a common intraday benchmark. This lesson uses a SIMULATED VWAP near 5025 for teaching.",
];

export const INVALIDATION_NOTES = [
  "Invalidation is the price that kills the hypothesis: for a long planned off a decline's retracement, a decisive close back below the swing low (0%) usually ends the bounce case.",
  "Do not move invalidation farther away to 'give it room' after entry — that is changing the plan because you are losing.",
  "TradingView Reverse flips a mis-drawn fib vertically; Extend Lines Left/Right keeps levels visible as new bars print (see Reading 1-minute charts).",
];

export const CAUTION = [
  "Fibonacci levels are widely watched objectives, not magnetic certainties (Fidelity; TradingView).",
  "Day trading and scalping with tight fib plans still carry the risks in FINRA Rule 2270: rapid losses, costs, and competition with professionals.",
  "Educational practice on SIMULATED charts — not trading advice.",
];

type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export const FIB_MAP_TERMS: LiteracyTerm[] = [
  {
    id: "fib-retracement",
    name: "Fibonacci Retracement",
    category: "process",
    summary: "Horizontal levels at Fibonacci ratios between two swing extremes, used as possible support/resistance while price corrects.",
    detail: "Connect a swing high and swing low; place lines at ratios such as 23.6%, 38.2%, 61.8% (and often 50%). On a decline, traders watch bounce zones between the low (0%) and high (100%). Levels are planning aids, not guarantees. Educational, not advice.",
  },
  {
    id: "fib-extension",
    name: "Fibonacci Extension",
    category: "process",
    summary: "Targets beyond the 100% anchor (e.g. 127.2%, 161.8%) used to plan how far a move might stretch.",
    detail: "On TradingView, values greater than 1 are often treated as external/extension style levels depending on how the tool is drawn. Use them as planning targets with invalidation defined first. Educational, not advice.",
  },
  {
    id: "confluence",
    name: "Confluence",
    category: "process",
    summary: "Two or more independent reasons agreeing at the same price area.",
    detail: "Example: a 50% fib retracement meeting a session VWAP and a prior swing. Confluence improves the quality of a decision map; it still needs confirmation and risk limits. Educational, not advice.",
  },
  {
    id: "fib-invalidation",
    name: "Invalidation (fib plan)",
    category: "process",
    summary: "The price that proves the fib-based hypothesis wrong and ends the trade plan.",
    detail: "For a long planned on a bounce after a decline, a close back below the swing-low anchor often invalidates the idea. Invalidation belongs in the plan before entry. Educational, not advice.",
  },
  {
    id: "vwap",
    name: "VWAP",
    category: "markets",
    summary: "Volume-weighted average price — the session's average price weighted by volume.",
    detail: "Intraday traders often treat VWAP as a fair-value benchmark: holding above or reclaiming it can be bullish context; losing it can be caution. This app may use SMA as a stand-in on some SAMPLE charts when VWAP is not drawn. Educational, not advice.",
  },
];

export const FIB_MAP_QUESTIONS: QuizQuestion[] = [
  mc("FM-01", "Fibonacci retracement levels are primarily used as…", "B", "Possible support/resistance while price corrects a prior move", ["Guaranteed turning points every time", "Exchange-set daily price limits", "Option strike listing rules"], "Fidelity and TradingView describe them as S/R objectives during countertrend moves — not certainties.", "fib-retracement"),
  mc("FM-02", "On a decline, you draw the fib from…", "A", "Swing high to swing low (TradingView Reverse if you drew it the other way)", ["Only from left to right in time, never by price", "Close to open of the same candle", "VWAP to the prior day close only"], "Anchor the extremes of the move. Reverse flips a vertical mistake."),
  mc("FM-03", "Which ratio is widely watched but not a pure Fibonacci number?", "C", "50%", ["61.8%", "38.2%", "23.6%"], "The midpoint is commonly plotted with the fib set even though it is not from the Fibonacci sequence."),
  mc("FM-04", "A fib extension such as 1.618 is mainly a…", "D", "Planning target beyond the swing anchor", ["Mandatory profit-take enforced by the exchange", "Stop-loss formula", "Volume threshold"], "Extensions help answer how far a move might stretch after the retracement completes.", "fib-extension"),
  mc("FM-05", "Confluence means…", "A", "Two or more independent reasons agree at a price", ["Every indicator is turned on", "Price equals VWAP exactly", "You entered without a stop"], "Fib + VWAP + prior pivot is stronger than a lone fib touch.", "confluence"),
  mc("FM-06", "VWAP stands for…", "B", "Volume-weighted average price", ["Very wide ask price", "Vendor-weighted alpha product", "Volatility-weighted annual premium"], "Session average price weighted by volume — a common intraday benchmark.", "vwap"),
  mc("FM-07", "For a long planned on a bounce after 5050→5000, a common invalidation is…", "C", "A decisive close back below the 5000 swing low", ["Any wick under 5025", "The first red candle", "Missing the 1.618 extension"], "The swing-low anchor is the idea's floor for that bounce plan.", "fib-invalidation"),
  mc("FM-08", "Entry 5025, stop 4995, target 5085. R:R is…", "A", "2.0", ["0.5", "1.0", "3.0"], "|5085−5025| ÷ |5025−4995| = 60 ÷ 30 = 2."),
  mc("FM-09", "Price tags 61.8% with no rejection and immediately trades through — best next step in a decision map?", "D", "Treat the zone as failed for now; do not invent a new thesis mid-bar", ["Double size because 'it must bounce'", "Move the stop farther away", "Assume 1.618 will magnetically pull price"], "Confirmation is part of the map. A clean break without defence is information."),
  mc("FM-10", "TradingView setting that flips a fib vertically:", "B", "Reverse", ["Extend Lines Left/Right", "Prices", "Log scale"], "Verified on TradingView's Fibonacci Retracement help: Reverse reflects the drawing vertically."),
  mc("FM-11", "Why cite FINRA Rule 2270 next to a fib scalping plan?", "A", "Day trading can cause rapid, substantial losses — tools do not remove that risk", ["FINRA bans Fibonacci drawings", "Rule 2270 sets tick sizes for MES", "It requires every chart to show VWAP"], "2270 is the day-trading risk disclosure. Fib levels do not make intraday trading safe."),
  mc("FM-12", "A useful mental order for a fib decision map is…", "C", "Zone → confirm → stop/invalidation → target → R:R", ["Target → size → hope → average down", "Reverse → reverse again → enter", "VWAP only, ignore structure"], "Plan the area, wait for behaviour, define death of the idea, then judge payoff."),
];

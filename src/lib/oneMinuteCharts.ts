/**
 * Reading 1-minute charts with 5- and 15-minute context (/practice/one-minute-charts).
 * Grouping, legs vs sideways, MES tick math, Fibonacci settings (TradingView), bar count.
 * Costs are example costs. MES specs from CME (0.25 index points = $1.25). Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";
import type { OHLC } from "./ohlcData";

export const AS_OF = "2026-10-22";
export interface Src { label: string; url: string }
const s = (label: string, url: string): Src => ({ label, url });

export const SRC = {
  mesFaq: s("CME: Micro E-mini Equity Index Futures FAQ", "https://www.cmegroup.com/articles/faqs/frequently-asked-questions-micro-e-mini-equity-index-futures.html"),
  mesRule: s("CME Rulebook Ch. 353 (Micro E-mini S&P 500)", "https://www.cmegroup.com/rulebook/CME/IV/350/353/353.pdf"),
  fib: s("TradingView: Fibonacci Retracement", "https://www.tradingview.com/support/solutions/43000518158-fibonacci-retracement/"),
};

/** Regular US cash session: 9:30–16:00 ET = 390 minutes → 78 five-minute bars. */
export const SESSION = {
  openET: "9:30 AM ET",
  openPT: "6:30 AM PT",
  firstHourPT: "6:30–7:30 AM PT",
  minutes: 390,
  bars5m: 78,
  bars1m: 390,
};

export const GROUPING = [
  { formula: "5 × 1-minute = 1 × 5-minute", note: "The 5th one-minute candle completes the 5m bar." },
  { formula: "3 × 5-minute = 1 × 15-minute", note: "The 3rd five-minute candle completes the 15m bar." },
  { formula: "15 × 1-minute = 1 × 15-minute", note: "The 15th one-minute candle completes the 15m bar." },
];

export const GROUPING_NOTE =
  "Groups align to clock boundaries from the regular-session open (9:30 AM ET / 6:30 AM PT), not from whatever bar you happen to be looking at.";

export const ONE_MIN_HARD = [
  "Less time to think: setups appear, fail, reverse or hit stops within a few candles.",
  "That pace leads to rushing, overtrading and late emotional entries.",
  "The 1-minute chart gives more signals, but not always better signals.",
  "For most people it moves too fast: use 1m for detail and respect 5m and 15m for context.",
];

export const OPEN_HOUR = [
  "Some traders focus on the first hour after the US open (6:30–7:30 AM PT): volume and strong moves as overnight news, premarket levels and reports hit.",
  "It is also very volatile, with sharp reversals and fakeouts.",
  "The goal is not to trade because the market is open, but to know: What is my setup? Where is my stop? Where is my target? How many bars has this move already lasted? Am I early, or chasing?",
];

export interface LegDrill {
  id: string;
  text: string;
  legsUp: number;
  sideways: number;
  legsDown: number;
  answer: string;
}
export const LEG_DRILLS: LegDrill[] = [
  { id: "l1", text: "Three legs up, sideways consolidation, then two more legs up.", legsUp: 5, sideways: 2, legsDown: 0, answer: "5 up legs in two bursts, with 2 sideways pauses" },
  { id: "l2", text: "Two legs down, sideways pause, then another breakdown attempt.", legsUp: 0, sideways: 1, legsDown: 3, answer: "3 down legs with 1 sideways pause" },
  { id: "l3", text: "One leg up, long sideways grind, then one leg down.", legsUp: 1, sideways: 1, legsDown: 1, answer: "1 up, 1 sideways, 1 down" },
];

export const MES = {
  symbol: "MES",
  name: "Micro E-mini S&P 500",
  multiplier: 5,
  tickPoints: 0.25,
  tickValue: 1.25,
  /** Example round-trip commission+fees; present as example costs. */
  exampleRoundTrip: 1.5,
};

/** Gross dollars from MES ticks, minus example round-trip cost. */
export function mesNet(ticks: number, contracts: number, roundTrip = MES.exampleRoundTrip): number {
  return ticks * MES.tickValue * contracts - roundTrip * contracts;
}

export function ticksToCover(roundTrip: number): number {
  return Math.ceil(roundTrip / MES.tickValue);
}

export const FIB_TEACH = {
  /** Common early-move anchor: high of bar 1 to low of bar 3 on a decline (or reverse for an advance). */
  anchor: "You usually select the high price of bar 1 to the low price of bar 3 (for a decline). TradingView's Reverse setting flips the tool vertically if you drew it the other way.",
  settings: [
    { name: "Reverse", meaning: "Reverses the direction of the fib retracement (reflects it vertically)." },
    { name: "Extend Lines Left/Right", meaning: "Extends the level lines indefinitely to the left or right." },
  ],
  timeLens:
    "Fib and bar count also measure time: if the first move took N bars, 1× and 1.618× that many bars are planning zones for how long a related move or pause might last. A setup that looks strong early can weaken if it takes too long and goes sideways.",
  source: SRC.fib,
};

export const BAR_COUNT = {
  indicatorName: "Bar Count Normal 2",
  note: "On TradingView, denser bar-count overlays suit 1-minute charts (numbers would otherwise crowd); a lighter count suits 5-minute charts.",
  questions: [
    "How many candles has this move lasted?",
    "How many bars since the breakout?",
    "How many bars since the pullback started?",
    "Is the move getting old? Is price taking too long?",
  ],
  session5m: SESSION.bars5m,
};

/** SIMULATED 1m bars: 3 legs up, sideways, 2 legs up — for the grouping overlay demo. */
export function buildSim1m(): OHLC[] {
  const out: OHLC[] = [];
  let px = 5200;
  const push = (n: number, dir: number, range: number) => {
    for (let i = 0; i < n; i++) {
      const open = px;
      const close = +(px + dir * (0.4 + (i % 3) * 0.15)).toFixed(2);
      const high = Math.max(open, close) + range;
      const low = Math.min(open, close) - range * 0.4;
      out.push({ name: String(out.length + 1), open, high: +high.toFixed(2), low: +low.toFixed(2), close });
      px = close;
    }
  };
  push(5, 1, 0.6); // leg 1
  push(5, 1, 0.5); // leg 2
  push(5, 1, 0.45); // leg 3
  push(8, 0.05, 0.35); // sideways (tiny drift)
  push(5, 1, 0.55); // leg 4
  push(5, 1, 0.5); // leg 5
  return out;
}

export const SIM_1M = buildSim1m();

/** Index of bars that complete a 5m group (every 5th, 0-based end). */
export function fiveMinuteEnds(n: number): number[] {
  const ends: number[] = [];
  for (let i = 4; i < n; i += 5) ends.push(i);
  return ends;
}

export const MENTAL_MODEL = [
  "Read the 1-minute chart but think in 5- and 15-minute groups.",
  "Remember 1-minute trading is fast and risky.",
  "Describe movement as legs and sideways pauses.",
  "Account for futures costs before assuming a scalp is profitable.",
  "Use Fibonacci and bar count to measure price and time.",
  "Goal: know where price may go and how long the move may reasonably last.",
];

export const ONE_MIN_TERMS: LiteracyTerm[] = [
  { id: "price-leg", name: "Leg (price leg)", category: "markets", summary: "A clean directional push on the chart, before a pause.", detail: "Markets often move in bursts (legs), then pause sideways. Counting legs (\"three legs up, then sideways\") is clearer than saying the chart is confusing. Educational, not advice." },
  { id: "consolidation", name: "Consolidation (sideways pause)", category: "markets", summary: "A pause where price moves sideways after a leg, while traders decide on the next move.", detail: "Also called a range or congestion. The pause is where traders decide whether another leg is coming. Educational, not advice." },
  { id: "bar-count", name: "Bar count", category: "process", summary: "Numbering candles to see how long a move, breakout or pullback has lasted.", detail: `TradingView overlays such as "${BAR_COUNT.indicatorName}" put a number on each bar. Helps answer: is the move getting old? A regular US session has ${SESSION.bars5m} five-minute bars (390 ÷ 5). Educational, not advice.` },
  { id: "tick", name: "Tick", category: "markets", summary: "The minimum price increment a contract can move.", detail: `On MES the minimum tick is ${MES.tickPoints} index points. Educational, not advice.` },
  { id: "tick-value", name: "Tick value", category: "markets", summary: "Dollars gained or lost when price moves one tick, per contract.", detail: `MES: ${MES.tickPoints} points × $${MES.multiplier} multiplier = $${MES.tickValue} per tick per contract (CME). Educational, not advice.` },
  { id: "round-trip-cost", name: "Round-trip cost", category: "position", summary: "What you pay to enter and exit a trade (commissions, fees, and often half-spreads).", detail: "Example futures costs might be about $1.50 round trip per MES contract — check your own broker. You need enough ticks of gross profit to cover it. Educational, not advice." },
  { id: "mes-micro", name: "MES (Micro E-mini S&P 500)", category: "markets", summary: "CME micro S&P 500 futures: $5 × index, minimum tick 0.25 points = $1.25.", detail: "Smaller than the E-mini (ES). Tick math makes scalp costs obvious: one tick ($1.25) may not cover a round-trip commission. Educational, not advice." },
];

type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export const ONE_MIN_QUESTIONS: QuizQuestion[] = [
  mc("OM-01", "How many one-minute candles make one five-minute candle?", "B", "5", ["3", "15", "78"], "5 × 1m = 1 × 5m. The 5th 1m candle completes the 5m bar."),
  mc("OM-02", "How many one-minute candles make one fifteen-minute candle?", "C", "15", ["5", "3", "78"], "15 × 1m = 1 × 15m. Also 3 × 5m = 1 × 15m."),
  mc("OM-03", "Why can the final candle in a 5m or 15m group matter more?", "A", "Higher-timeframe traders often decide on that close: enter, exit, hold, confirm or fail", ["It is always the largest candle", "Exchanges only print then", "Stops cannot fill until then"], GROUPING_NOTE),
  mc("OM-04", "\"The 1-minute chart gives more signals, but…\"", "D", "not always better signals", ["always better signals", "no signals after 10 AM", "only gap signals"], "Use 1m for detail; respect 5m and 15m for context."),
  mc("OM-05", "A regular US cash session has how many five-minute bars?", "B", "78", ["80", "100", "390"], "390 minutes ÷ 5 = 78.", "bar-count"),
  mc("OM-06", "MES minimum tick size and value?", "A", "0.25 index points = $1.25 per contract", ["0.25 points = $12.50", "1.00 point = $1.25", "0.05 points = $5"], "CME: $5 multiplier × 0.25 = $1.25.", "tick-value"),
  mc("OM-07", `With an example $${MES.exampleRoundTrip} round-trip cost on one MES contract, how many ticks of gross profit do you need just to cover costs?`, "C", `${ticksToCover(MES.exampleRoundTrip)}`, ["1", "2", "10"], `$${MES.exampleRoundTrip} ÷ $${MES.tickValue} = ${MES.exampleRoundTrip / MES.tickValue}, so ceil to ${ticksToCover(MES.exampleRoundTrip)} ticks. Costs are examples — check your broker.`, "round-trip-cost"),
  mc("OM-08", "A clean directional push on the chart, before a pause, is called a…", "B", "Leg", ["Gap", "Doji", "Neckline"], "Markets move in legs, then sideways pauses.", "price-leg"),
  mc("OM-09", "TradingView Fibonacci tool: which setting reverses the fib vertically?", "A", "Reverse", ["Extend Lines Left/Right", "Prices", "Levels"], "TradingView's own label is Reverse; Extend Lines Left/Right extends the lines.", undefined),
  mc("OM-10", "Bar count helps you avoid…", "D", "Entering late after a move has already lasted many candles", ["Using stops", "Reading the 15m chart", "Trading the open"], "Ask: how many bars has this move lasted?", "bar-count"),
  mc("OM-11", "The US regular open in Pacific Time is…", "B", "6:30 AM PT", ["9:30 AM PT", "4:00 AM PT", "12:00 PM PT"], "9:30 AM ET = 6:30 AM PT."),
  mc("OM-12", "Fib and bar count can measure…", "C", "Both how far price may move and how long a behaviour may last", ["Only price", "Only volume", "Only overnight gaps"], FIB_TEACH.timeLens.slice(0, 120) + "…"),
];

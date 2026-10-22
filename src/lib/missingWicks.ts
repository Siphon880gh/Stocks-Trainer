/**
 * Missing Wicks and Zooming In (/practice/missing-wicks): a popover walkthrough on SIMULATED 1-minute bars
 * aggregated into 15-minute and 1-hour candles with real OHLC aggregation. Two different 1m paths build the
 * identical hourly candle with no upper wick (high = open). Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";
import type { WalkthroughStep } from "./tourProgress";

export interface Candle { name: string; open: number; high: number; low: number; close: number; volume?: number }
const r2 = (v: number) => Math.round(v * 100) / 100;

/** OHLC rule: high ≥ max(open, close) and low ≤ min(open, close). */
export function isValidOhlc(b: Candle): boolean {
  return b.high >= Math.max(b.open, b.close) && b.low <= Math.min(b.open, b.close) && b.high >= b.low;
}
export function upperWick(b: Candle): number { return r2(b.high - Math.max(b.open, b.close)); }
export function lowerWick(b: Candle): number { return r2(Math.min(b.open, b.close) - b.low); }

/** Aggregate consecutive bars into one: first open, max high, min low, last close, summed volume. */
export function aggregateOne(bars: Candle[], name: string): Candle {
  return {
    name,
    open: bars[0]!.open,
    high: Math.max(...bars.map((b) => b.high)),
    low: Math.min(...bars.map((b) => b.low)),
    close: bars[bars.length - 1]!.close,
    volume: bars.reduce((a, b) => a + (b.volume ?? 0), 0),
  };
}
/** Aggregate into groups of `size` bars (e.g. 15 one-minute bars → one 15-minute bar). */
export function aggregate(bars: Candle[], size: number, label: (g: number) => string): Candle[] {
  const out: Candle[] = [];
  for (let g = 0; g * size < bars.length; g++) out.push(aggregateOne(bars.slice(g * size, (g + 1) * size), label(g)));
  return out;
}

const START_MIN = 7 * 60 + 30; // 7:30 AM PT
const hhmm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
const lab1 = (i: number) => hhmm(START_MIN + i);
const lab15 = (g: number) => hhmm(START_MIN + g * 15);

export const HOUR = { open: 100, high: 100, low: 97, close: 97.5 };
export const MIRROR_HOUR = { open: 100, low: 100, high: 103, close: 102.5 };

/** Build 60 one-minute bars through knots; clamp to the hour's range and pin the extreme bar. */
function buildMinutes(knots: Array<[number, number]>, opts: { hi: number; lo: number; pinLowAt?: number; pinHighAt?: number; open: number; close: number; phase: number }): Candle[] {
  const c: number[] = [];
  for (let k = 0; k < knots.length - 1; k++) {
    const [i0, p0] = knots[k]!; const [i1, p1] = knots[k + 1]!;
    for (let i = i0; i < i1; i++) c.push(p0 + ((p1 - p0) * (i - i0)) / (i1 - i0));
  }
  const closes = c.slice(0, 60).map((v, i) => r2(Math.min(opts.hi - 0.05, Math.max(opts.lo + 0.05, v + 0.12 * Math.sin(i * 1.9 + opts.phase)))));
  closes[59] = opts.close;
  return closes.map((cl, i) => {
    const o = i === 0 ? opts.open : closes[i - 1]!;
    const w = 0.06 + 0.06 * Math.abs(Math.sin(i * 2.7 + opts.phase));
    let high = r2(Math.min(opts.hi, Math.max(o, cl) + w));
    let low = r2(Math.max(opts.lo, Math.min(o, cl) - w));
    if (i === opts.pinLowAt) low = opts.lo;
    if (i === opts.pinHighAt) high = opts.hi;
    return { name: lab1(i), open: r2(o), high, low, close: cl, volume: 20_000 + Math.round(8_000 * Math.abs(Math.sin(i * 0.7 + opts.phase))) };
  });
}

/** Scenario A: sellers from the first tick, a steady selloff, a small bounce off the low into the close. */
export const SCENARIO_A = buildMinutes([[0, 99.9], [52, 97.15], [56, 97.1], [60, 97.5]], { hi: HOUR.high, lo: HOUR.low, pinLowAt: 54, open: HOUR.open, close: HOUR.close, phase: 0 });
/** Scenario B: early drop, mid-hour rally that stalls just under the open (failed retest), then a selloff into the close. */
export const SCENARIO_B = buildMinutes([[0, 99.8], [14, 98.3], [34, 99.75], [38, 99.6], [54, 97.15], [57, 97.1], [60, 97.5]], { hi: HOUR.high, lo: HOUR.low, pinLowAt: 55, open: HOUR.open, close: HOUR.close, phase: 1.3 });
/** Mirror: a bullish hour that opens on its low (no lower wick, shaven bottom). */
export const MIRROR = buildMinutes([[0, 100.1], [50, 102.85], [54, 102.9], [60, 102.5]], { hi: MIRROR_HOUR.high, lo: MIRROR_HOUR.low, pinHighAt: 52, open: MIRROR_HOUR.open, close: MIRROR_HOUR.close, phase: 0.7 });

export type Scenario = "A" | "B" | "mirror";
export type Timeframe = "1h" | "15m" | "1m";
export const MINUTES: Record<Scenario, Candle[]> = { A: SCENARIO_A, B: SCENARIO_B, mirror: MIRROR };

/** SIMULATED hourly context before the focus hour (not aggregated from the 1m data). */
const CONTEXT_BEAR: Candle[] = [
  { name: "4:30", open: 99.2, high: 100.4, low: 98.9, close: 100.1 },
  { name: "5:30", open: 100.1, high: 100.9, low: 99.6, close: 100.6 },
  { name: "6:30", open: 100.6, high: 101.2, low: 99.7, close: 100.0 },
];
const CONTEXT_BULL: Candle[] = [
  { name: "4:30", open: 101.4, high: 101.7, low: 100.2, close: 100.5 },
  { name: "5:30", open: 100.5, high: 100.9, low: 99.4, close: 99.8 },
  { name: "6:30", open: 99.8, high: 100.6, low: 99.3, close: 100.0 },
];

export function barsFor(s: Scenario, tf: Timeframe): Candle[] {
  const m = MINUTES[s];
  if (tf === "1m") return m;
  if (tf === "15m") return aggregate(m, 15, lab15);
  return [...(s === "mirror" ? CONTEXT_BULL : CONTEXT_BEAR), aggregateOne(m, "7:30")];
}
export const FOCUS_INDEX_1H = 3;

export const OHLC_RULES = [
  "High ≥ the larger of open and close. Low ≤ the smaller of open and close.",
  "So the high can never be below the open: at the very least it equals the open, the first trade of the period.",
  "No upper wick: the high equals the top of the body. On a red candle that's the open (shaven top); on a green candle it's the close.",
  "No lower wick: the low equals the bottom of the body (shaven bottom). No wick on either end: a marubozu.",
];

export const WHEN_TO_DRILL = {
  yes: [
    "Timing an entry or exit inside a higher-timeframe setup you already like",
    "Checking whether a level was tested and rejected inside the bar (the failed retest of the open in path B)",
    "A big candle that may hide a reversal near its end",
  ],
  no: [
    "Hunting for extra signals: the 1-minute chart gives more signals, but not always better signals",
    "Overriding the higher-timeframe picture: the hourly close still sets the context",
    "When the extra noise makes you trade more without a plan",
  ],
};

export const MW_STEPS: Array<WalkthroughStep & { tf: Timeframe; scenario: Scenario }> = [
  { id: "hourly", title: "A red hourly candle with no top wick", body: `This SIMULATED 1-hour candle opened at ${HOUR.open.toFixed(2)}, and its high is also ${HOUR.high.toFixed(2)}. Price never traded above where the hour started: sellers were in control from the first tick. It fell to ${HOUR.low.toFixed(2)} and closed at ${HOUR.close.toFixed(2)}.`, target: "mw-chart", tf: "1h", scenario: "A" },
  { id: "rule", title: "The OHLC rule", body: "Every candle obeys: high ≥ max(open, close) and low ≤ min(open, close). The high can't be below the open, so a missing upper wick means the high equals the open (red) or the close (green). Traders call it a shaven top.", target: "mw-rule", tf: "1h", scenario: "A" },
  { id: "zoom15", title: "Zoom in: four 15-minute candles", body: "The same hour as 4 × 15-minute candles. Their first open, highest high, lowest low and last close rebuild the hourly candle exactly. Sixty 1-minute candles do the same: 60 × 1m = 4 × 15m = 1h.", target: "mw-chart", tf: "15m", scenario: "A" },
  { id: "pathA", title: "Path A: a steady selloff", body: "In 1-minute candles, path A falls almost the whole hour: lower highs, lower lows, a small bounce off the low into the close. No minute traded above the open.", target: "mw-chart", tf: "1m", scenario: "A" },
  { id: "pathB", title: "Path B: same hourly candle, different story", body: "Path B drops early, rallies mid-hour to just under the open, stalls (a lower high and a rejection), then sells off into the close. That's a failed retest of the open. Its hourly open, high, low and close match path A exactly; see the comparison table.", target: "mw-compare", tf: "1m", scenario: "B" },
  { id: "when", title: "When to drill down, and when not to", body: "Drill down to time entries and exits, to see whether a level was tested and rejected inside the bar, or when a big candle may hide a reversal. Don't drill down to hunt for more signals; the hourly close still sets the context.", target: "mw-when", tf: "15m", scenario: "B" },
  { id: "mirror", title: "The mirror: green with no bottom wick", body: `A bullish hour that opens on its low (${MIRROR_HOUR.open.toFixed(2)}) has no lower wick: a shaven bottom. Buyers held price above the open the whole hour. It's the same idea flipped: low equals open.`, target: "mw-chart", tf: "1h", scenario: "mirror" },
  { id: "explore", title: "Now explore", body: "Exit the walkthrough, then switch between 1h, 15m and 1m and between paths A, B and the mirror. Click any candle to read its open, high, low, close and wicks.", target: "mw-controls", tf: "1h", scenario: "A" },
];

type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export const MW_QUESTIONS: QuizQuestion[] = [
  mc("MW-01", "Can a candle's high be lower than its open?", "B", "No: the high is at least the open, because the open is a traded price in that period", ["Yes, on red candles", "Yes, when volume is low", "Only on 1-minute charts"], "High ≥ max(open, close).", "timeframe-aggregation"),
  mc("MW-02", "A red candle has no upper wick. What does that tell you?", "C", "The high equals the open: price never traded above where it started", ["The close was the high", "The data is broken", "Buyers controlled the period"], "That's a shaven top.", "shaven-top"),
  mc("MW-03", "Two different 1-minute paths can produce the same hourly candle because…", "A", "Aggregation keeps only first open, highest high, lowest low and last close", ["Hourly candles are averages", "Brokers smooth the data", "They can't; every path is unique"], "The order of moves inside the hour is lost.", "intrabar"),
  mc("MW-04", "How many 15-minute candles make one 1-hour candle?", "D", "4", ["15", "60", "3"], "60 ÷ 15 = 4; 60 one-minute candles also make one hour."),
  mc("MW-05", "Four 15m candles: opens 100, 99.1, 98.6, 99.0; highs 100, 99.3, 99.8, 99.1; lows 98.9, 98.2, 98.5, 97.0; last close 97.5. Hourly candle?", "B", "O 100 · H 100 · L 97 · C 97.5", ["O 99.2 · H 99.6 · L 98.2 · C 98.6", "O 100 · H 99.8 · L 98.2 · C 97.5", "O 97.5 · H 100 · L 97 · C 100"], "First open, max high, min low, last close."),
  mc("MW-06", "A green candle with no lower wick is called…", "A", "A shaven bottom (the open was the low)", ["A shaven top", "A doji", "A hanging man"], "Mirror of the shaven top.", "shaven-bottom"),
  mc("MW-07", "When is dropping to a lower timeframe most useful?", "C", "To time an entry or see whether a level was rejected inside a bar you already care about", ["To find more trades when nothing sets up", "To replace the higher-timeframe trend", "Always, because more candles mean better signals"], "More signals, not always better signals."),
];

export const MW_TERMS: LiteracyTerm[] = [
  { id: "shaven-top", name: "Shaven top", category: "process", summary: "A candle with no upper wick: the high equals the top of the body.", detail: "On a red candle the high is the open, so price never traded above where the period started. On a green candle the high is the close. Educational, not advice." },
  { id: "shaven-bottom", name: "Shaven bottom", category: "process", summary: "A candle with no lower wick: the low equals the bottom of the body.", detail: "On a green candle the low is the open, so buyers held price above the start the whole period. A candle shaven on both ends is a marubozu. Educational, not advice." },
  { id: "intrabar", name: "Intrabar", category: "process", summary: "What happened inside one candle's period, visible only on a lower timeframe.", detail: "An hourly candle hides the path: a steady selloff and a failed mid-hour rally can produce the same OHLC. Drop to 15m or 1m to see the path. Educational, not advice." },
  { id: "timeframe-aggregation", name: "Timeframe aggregation", category: "process", summary: "Building a higher-timeframe candle from lower ones: first open, highest high, lowest low, last close.", detail: "Volume is summed. 60 one-minute or 4 fifteen-minute candles make one hourly candle. It also shows why high ≥ max(open, close) and low ≤ min(open, close). Educational, not advice." },
];

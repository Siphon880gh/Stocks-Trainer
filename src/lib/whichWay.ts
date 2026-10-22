/**
 * "Which Way?" drill (#19): every pattern in the registry, drawn with its prior trend on a SIMULATED chart, asks
 * Up, Down or Either. Answers come from `potentialDirection` (patternDirections.ts), which whichWay.test.ts keeps
 * consistent with the #17 themes. Feedback: the direction, a one-line why and the confirmation to wait for.
 * Scoring reuses the Learn quiz conventions (POINTS_PER_CORRECT, STREAK_BONUS, QUIZ_PASS_PCT, Answer streak).
 */
import { PATTERNS, type PatternDef } from "./patterns";
import { PATTERN_OHLC, DRILL_CHART_SPECS, type OHLC } from "./ohlcData";
import { isCandlestickPattern } from "./cryptoCandles";
import { BUY_SELL_INFO } from "./buySellDrill";
import { ADVANCED_DRILL_INFO } from "./advancedPatterns";
import { CHART_BOOK_DRILL_INFO } from "./chartPatternBook";
import { THEME_DRILL_INFO } from "./patternThemes";
import { DIRECTION_ARROW, DIRECTION_LABEL, type PotentialDirection } from "./patternDirections";
import type { LiteracyTerm } from "./literacyTerms";
import type { QuizOption, QuizQuestion } from "./quizData";

export { DIRECTION_ARROW, DIRECTION_LABEL, type PotentialDirection };
export type WhichWayMode = "candles" | "charts" | "all";
export type PriorTrend = "up" | "down" | "sideways";

export const WHICH_WAY_DISCLAIMER = "Learning drill on SIMULATED charts, not trading advice.";
export const WHICH_WAY_STORAGE_KEY = "analysis_core_which_way_v1";
export const WHICH_WAY_MIN_FOR_PASS = 10;

export interface WhichWayRound {
  id: string;
  name: string;
  mode: "candles" | "charts";
  bars: OHLC[];
  /** Index of the bar that completes the pattern (highlighted). */
  end: number;
  /** SIMULATED lead-in bars drawn before the pattern so its prior trend is visible. */
  lead: number;
  prior: PriorTrend;
  answer: PotentialDirection;
  why: string;
  confirm: string;
}

const INFO: Record<string, { why: string; stop: string }> = {
  ...ADVANCED_DRILL_INFO,
  ...CHART_BOOK_DRILL_INFO,
  ...THEME_DRILL_INFO,
  ...BUY_SELL_INFO,
};

/** Last bar of the pattern itself: the drill spec's `end` (before any confirming candle), else the whole chart. */
function patternEnd(id: string, bars: OHLC[]): number {
  const specs = DRILL_CHART_SPECS.filter((s) => s.key === id);
  const s = specs.find((x) => x.dir !== "open") ?? specs[0];
  return s ? Math.min(s.end, bars.length - 1) : bars.length - 1;
}

/** Trend drawn before bar `end`: first open to bar end-1's close, against the range of bars 0..end. */
export function priorTrend(bars: OHLC[], end: number): PriorTrend {
  if (end < 1) return "sideways";
  const shown = bars.slice(0, end + 1);
  const range = Math.max(...shown.map((b) => b.high)) - Math.min(...shown.map((b) => b.low));
  const move = bars[end - 1].close - bars[0].open;
  if (range <= 0 || Math.abs(move) < range * 0.15) return "sideways";
  return move > 0 ? "up" : "down";
}

export const LEAD_BARS = 4;

/** Trend needed before the pattern: reversals reverse it, continuations follow it, two-sided patterns alternate. */
export function contextFor(p: PatternDef, i: number): "up" | "down" {
  const d = p.potentialDirection;
  if (d === "either") return i % 2 === 0 ? "up" : "down";
  if (p.type === "continuation") return d === "up" ? "up" : "down";
  return d === "up" ? "down" : "up";
}

/** SIMULATED lead-in: LEAD_BARS steady candles trending into the pattern's first open. */
export function leadIn(first: OHLC, trend: "up" | "down", sample: OHLC[]): OHLC[] {
  const avgBody = sample.reduce((s, b) => s + Math.abs(b.close - b.open), 0) / Math.max(1, sample.length);
  const step = Math.max(Math.abs(first.open) * 0.003, avgBody * 0.8, 0.01);
  const sign = trend === "up" ? 1 : -1;
  const r = (v: number) => Math.round(v * 100) / 100;
  const out: OHLC[] = [];
  for (let k = 0; k < LEAD_BARS; k++) {
    const close = first.open - sign * step * (LEAD_BARS - 1 - k);
    const open = close - sign * step;
    const bar: OHLC = { name: "", open: r(open), close: r(close), high: r(Math.max(open, close) + step * 0.25), low: r(Math.min(open, close) - step * 0.25) };
    if (first.volume != null) bar.volume = first.volume;
    out.push(bar);
  }
  return out;
}

const firstSentence = (s: string) => (s.match(/^.*?[.!?](\s|$)/)?.[0] ?? s).trim();

function confirmFor(dir: PotentialDirection, p: PatternDef, stop?: string): string {
  const s = stop ? ` Stop ${stop}.` : "";
  if (dir === "either") return "Wait for a close beyond the pattern's high or low; the break picks the direction.";
  if (dir === "up") {
    return p.type === "continuation"
      ? `Wait for a close above the pattern's high to resume the uptrend.${s}`
      : `Wait for a green candle that closes above the pattern's high.${s}`;
  }
  return p.type === "continuation"
    ? `Wait for a close below the pattern's low to resume the downtrend.${s}`
    : `Wait for a red candle that closes below the pattern's low.${s}`;
}

function buildRound(p: PatternDef, i: number): WhichWayRound | null {
  const src = PATTERN_OHLC[p.id];
  const answer = p.potentialDirection;
  if (!src?.length || !answer) return null;
  const patternEndIdx = patternEnd(p.id, src);
  const shown = src.slice(0, patternEndIdx + 1);
  const ctx = contextFor(p, i);
  const bars = [...leadIn(shown[0], ctx, shown.slice(0, 4)), ...shown].map((b, k) => ({ ...b, name: String(k + 1) }));
  const info = INFO[p.id];
  return {
    id: p.id,
    name: p.name,
    mode: isCandlestickPattern(p.id) ? "candles" : "charts",
    bars,
    end: bars.length - 1,
    lead: LEAD_BARS,
    prior: priorTrend(bars, LEAD_BARS),
    answer,
    why: info?.why ?? firstSentence(p.description),
    confirm: confirmFor(answer, p, info?.stop),
  };
}

/** Deterministic interleave so Up / Down / Either answers are mixed, not grouped. */
function mix(rounds: WhichWayRound[]): WhichWayRound[] {
  const by: Record<PotentialDirection, WhichWayRound[]> = { up: [], down: [], either: [] };
  for (const r of rounds) by[r.answer].push(r);
  const out: WhichWayRound[] = [];
  const order: PotentialDirection[] = ["up", "either", "down"];
  for (let i = 0; out.length < rounds.length; i++) {
    for (const d of order) if (by[d][i]) out.push(by[d][i]);
  }
  return out;
}

export const WHICH_WAY_ROUNDS: WhichWayRound[] = mix(
  PATTERNS.map(buildRound).filter((r): r is WhichWayRound => r !== null),
);

export function roundsFor(mode: WhichWayMode): WhichWayRound[] {
  return mode === "all" ? WHICH_WAY_ROUNDS : WHICH_WAY_ROUNDS.filter((r) => r.mode === mode);
}

export const PRIOR_TREND_LABEL: Record<PriorTrend, string> = {
  up: "Prior trend: up",
  down: "Prior trend: down",
  sideways: "Prior trend: sideways",
};

/** Keyboard: ↑ / U = Up, ↓ / D = Down, ← → / E = Either. */
export function keyToDirection(key: string): PotentialDirection | null {
  const k = key.toLowerCase();
  if (k === "arrowup" || k === "u") return "up";
  if (k === "arrowdown" || k === "d") return "down";
  if (k === "arrowleft" || k === "arrowright" || k === "e") return "either";
  return null;
}

export function feedbackLine(r: WhichWayRound): string {
  return `${DIRECTION_ARROW[r.answer]} ${DIRECTION_LABEL[r.answer]}: ${r.why}`;
}

// ---------- resumable progress ----------
export interface WhichWayProgress {
  mode: WhichWayMode;
  /** Next round index per mode. */
  index: Record<WhichWayMode, number>;
  answered: number;
  right: number;
  points: number;
  streak: number;
  best: number;
}

export const emptyWhichWay = (): WhichWayProgress => ({
  mode: "candles",
  index: { candles: 0, charts: 0, all: 0 },
  answered: 0,
  right: 0,
  points: 0,
  streak: 0,
  best: 0,
});

export function loadWhichWay(storage: Pick<Storage, "getItem"> = localStorage): WhichWayProgress {
  try {
    const raw = storage.getItem(WHICH_WAY_STORAGE_KEY);
    if (!raw) return emptyWhichWay();
    const v = JSON.parse(raw) as Partial<WhichWayProgress>;
    const e = emptyWhichWay();
    return { ...e, ...v, index: { ...e.index, ...(v.index ?? {}) } };
  } catch {
    return emptyWhichWay();
  }
}

export function saveWhichWay(v: WhichWayProgress, storage: Pick<Storage, "setItem"> = localStorage): void {
  storage.setItem(WHICH_WAY_STORAGE_KEY, JSON.stringify(v));
}

/** Apply one answer: Learn quiz points (per correct + streak bonus after the first in a row). */
export function scoreAnswer(v: WhichWayProgress, correct: boolean, perCorrect: number, streakBonus: number): WhichWayProgress {
  const streak = correct ? v.streak + 1 : 0;
  return {
    ...v,
    answered: v.answered + 1,
    right: v.right + (correct ? 1 : 0),
    points: v.points + (correct ? perCorrect + (streak > 1 ? streakBonus : 0) : 0),
    streak,
    best: Math.max(v.best, streak),
  };
}

export const accuracyPct = (v: Pick<WhichWayProgress, "answered" | "right">) =>
  v.answered ? Math.round((v.right / v.answered) * 100) : 0;

// ---------- glossary ----------
export const WW_TERMS: LiteracyTerm[] = [
  { id: "potential-direction", name: "Potential direction", category: "process", summary: "Where price can go once a pattern is confirmed: up, down, or either way.", detail: "Bullish reversals point up and bearish reversals point down. Continuations follow the trend that came before them. Indecision, compression and balance patterns (doji, spinning top, inside bar, symmetrical triangle, broadening formation) point either way: the break decides. A potential direction is a hypothesis to confirm, not a prediction. Educational, not advice." },
  { id: "two-sided-pattern", name: "Two-sided (either-way) pattern", category: "process", summary: "A pattern that can resolve up or down; the close beyond its high or low decides.", detail: "Examples: doji, long-legged doji, spinning top, inside bar, symmetrical triangle, broadening formation. Plan both sides: a level above, a level below, and a stop beyond the opposite side once one breaks. Educational, not advice." },
];

// ---------- Learn group "which-way" ----------
type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, extra: Partial<QuizQuestion> = {}): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...extra };
}

export const WW_QUESTIONS: QuizQuestion[] = [
  mc("WW-01", "A hammer shape (small body on top, long lower wick) prints after a long rally. Which way is the potential move?", "B", "Down: after an uptrend the shape is a hanging man", ["Up: hammers are always bullish", "Either: wicks cancel out", "Up: the long wick shows buyers"], "Same shape, different trend. After a rally it is a hanging man, bearish once the next candle closes lower.", { patternKey: "hanging-man", glossaryTermId: "prior-trend-context" }),
  mc("WW-02", "A plain doji appears. Which way?", "C", "Either: it shows indecision until the next decisive close", ["Up", "Down", "Up, if the doji is green"], "A doji has its open and close at or near the same price. The break of its high or low decides.", { patternKey: "doji", glossaryTermId: "two-sided-pattern" }),
  mc("WW-03", "A bull flag forms after a sharp rise. Which way?", "A", "Up: a continuation follows the prior trend", ["Down: the flag slopes down", "Either: flags are neutral", "Down: volume is drying up"], "A flag is a pause in the trend that came before it. A close above the flag's high resumes it.", { patternKey: "bull-flag" }),
  mc("WW-04", "An inside bar sits within the prior candle's high and low. Which way?", "D", "Either: the break of the mother bar decides", ["Up, always", "Down, always", "Up, if the inside bar is green"], "The market is coiling. Traders often set a buy stop above the mother bar's high and a sell stop below its low.", { patternKey: "inside-bar", glossaryTermId: "inside-bar" }),
  mc("WW-05", "A symmetrical triangle forms with no strong bias. Which way?", "B", "Either: a close outside one of the lines decides", ["Up: triangles are bullish", "Down: highs are falling", "Up: lows are rising"], "Converging lines show compression. Plan both breaks.", { patternKey: "triangle", glossaryTermId: "two-sided-pattern" }),
  mc("WW-06", "Bearish separating lines appear inside a downtrend. Which way?", "C", "Down: a bearish continuation follows the downtrend", ["Up: the first candle is green", "Either: the opens match", "Up: buyers tried"], "The bounce candle is erased by a red candle opening at the same price; the downtrend is expected to resume.", { patternKey: "bearish-separating-lines" }),
  mc("WW-07", "Which pattern points Up?", "A", "Falling wedge after a decline", ["Rising wedge after an advance", "Spinning top mid-trend", "Evening star after a rally"], "Converging lines sloping down, with each push lower gaining less ground: usually resolves up."),
  mc("WW-08", "You answered Either on a long-legged doji. What confirmation do you wait for?", "D", "A close beyond the doji's high or low", ["Any green candle", "The next candle's open", "A second doji"], "An either-way pattern is resolved by the break; then the stop goes beyond the opposite side.", { patternKey: "long-legged-doji" }),
  mc("WW-09", "A broadening formation (higher highs and lower lows) appears. Which way?", "B", "Either: swings are widening and neither side controls", ["Up: highs keep rising", "Down: lows keep falling", "Up, after any downtrend"], "Expanding swings show instability. Wait for a decisive break and size smaller.", { patternKey: "broadening-top", glossaryTermId: "two-sided-pattern" }),
  mc("WW-10", "Why does the drill draw the prior trend on every chart?", "C", "The same shape can point a different way depending on what came before", ["To make the chart look busier", "Because patterns ignore context", "Only continuation patterns need it"], "A hammer after a decline points up; the same shape after a rally is a hanging man. Continuations follow the trend before them.", { glossaryTermId: "prior-trend-context" }),
];

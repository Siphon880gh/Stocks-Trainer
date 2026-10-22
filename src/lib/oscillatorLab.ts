/**
 * Oscillators & volatility stop lab: RSI, fast / slow stochastic, KDJ and an ATR volatility stop on three
 * LONG SIMULATED charts (120 daily bars, fixed seeds, no market data).
 *
 * Teaching points (see src/lib/oscillators.ts for the formulas and sources):
 * - Overbought / oversold (RSI 70 / 30, stochastic 80 / 20) describe where price sits in its recent range; in a strong
 *   trend they can stay there for many bars, so they are not reversal calls.
 * - RSI, the stochastic and KDJ are all momentum oscillators built from the same prices, so they tend to agree;
 *   agreement between them is not independent confirmation.
 * - Fast lines turn more often than slow ones; KDJ's J line amplifies the K − D gap and leaves 0–100.
 * - A volatility stop trails the highest close by ATR × multiplier and flips when the close crosses it. A stop level is
 *   where an exit order triggers, not a guaranteed fill: a gap can open far through it.
 *
 * Every quiz key is computed from the charts with the same functions the charts draw.
 */
import { rsi } from "./indicators";
import type { OHLC } from "./ohlcData";
import { atr, correlation, fastStochastic, kdj, lineCrosses, slowStochastic, volatilityStop, type Series } from "./oscillators";

export const OSC_LABEL = "SIMULATED";
export const OSC_BARS = 120;
export const RSI_PERIOD = 14;
export const STOCH_PERIOD = 14;
export const STOCH_D = 3;
export const KDJ_PERIOD = 9;
export const ATR_PERIOD = 20;
export const VSTOP_MULT = 2;

export type OscChartId = "strong-climb" | "choppy-range" | "climb-then-gap";

interface Segment {
  bars: number;
  drift: number;
  wave?: number;
  /** Open the first bar of the segment this far from the previous close (a gap). */
  gap?: number;
}
interface Spec {
  id: OscChartId;
  title: string;
  blurb: string;
  seed: number;
  start: number;
  noise: number;
  /** Typical intrabar range added beyond open / close. */
  wick: number;
  segments: Segment[];
}

const SPECS: Spec[] = [
  {
    id: "strong-climb",
    title: "A strong climb",
    blurb: "A short flat base, then a long steady climb with small pullbacks.",
    seed: 5,
    start: 50,
    noise: 1.1,
    wick: 0.5,
    segments: [
      { bars: 20, drift: 0, wave: 0.8 },
      { bars: 100, drift: 0.4, wave: 1.6 },
    ],
  },
  {
    id: "choppy-range",
    title: "A choppy range",
    blurb: "120 bars swinging inside a sideways range.",
    seed: 19,
    start: 80,
    noise: 1.3,
    wick: 0.6,
    segments: [{ bars: 120, drift: 0, wave: 3 }],
  },
  {
    id: "climb-then-gap",
    title: "A climb, then a gap down",
    blurb: "70 bars of climb, a sideways stall, then a gap down and a slide.",
    seed: 31,
    start: 60,
    noise: 0.4,
    wick: 0.4,
    segments: [
      { bars: 70, drift: 0.4 },
      { bars: 15, drift: 0 },
      { bars: 35, drift: -0.35, gap: -6 },
    ],
  },
];

/** mulberry32: small deterministic PRNG. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const round2 = (x: number) => Math.round(x * 100) / 100;

function build(spec: Spec): OHLC[] {
  const r = rng(spec.seed);
  const out: OHLC[] = [];
  let base = spec.start;
  let prevClose = spec.start;
  let i = 0;
  for (const seg of spec.segments) {
    for (let j = 0; j < seg.bars; j++, i++) {
      if (j === 0 && seg.gap) base += seg.gap;
      base += seg.drift;
      const wave = seg.wave ? seg.wave * Math.sin((j / 7) * Math.PI) : 0;
      const close = round2(base + wave + (r() - 0.5) * 2 * spec.noise);
      const open = j === 0 && seg.gap ? round2(prevClose + seg.gap) : prevClose;
      const high = round2(Math.max(open, close) + r() * spec.wick);
      const low = round2(Math.min(open, close) - r() * spec.wick);
      out.push({ name: `D${i + 1}`, open, high, low, close });
      prevClose = close;
    }
  }
  return out;
}

export interface OscChart {
  id: OscChartId;
  title: string;
  blurb: string;
  bars: OHLC[];
  closes: number[];
  rsi: Series;
  fastK: Series;
  fastD: Series;
  slowK: Series;
  slowD: Series;
  k: Series;
  d: Series;
  j: Series;
  atr: Series;
  vstop: Series;
  vstopUp: (boolean | null)[];
  flips: number[];
}

function analyze(spec: Spec): OscChart {
  const bars = build(spec);
  const closes = bars.map((b) => b.close);
  const f = fastStochastic(bars, STOCH_PERIOD, STOCH_D);
  const s = slowStochastic(bars, STOCH_PERIOD, STOCH_D);
  const x = kdj(bars, KDJ_PERIOD);
  const v = volatilityStop(bars, ATR_PERIOD, VSTOP_MULT);
  return {
    id: spec.id,
    title: spec.title,
    blurb: spec.blurb,
    bars,
    closes,
    rsi: rsi(closes, RSI_PERIOD),
    fastK: f.k,
    fastD: f.d,
    slowK: s.k,
    slowD: s.d,
    k: x.k,
    d: x.d,
    j: x.j,
    atr: atr(bars, ATR_PERIOD),
    vstop: v.stop,
    vstopUp: v.up,
    flips: v.flips,
  };
}

export const OSC_CHARTS: OscChart[] = SPECS.map(analyze);
export const getOscChart = (id: string) => OSC_CHARTS.find((c) => c.id === id);

// ---------------------------------------------------------------------------------------------
// Facts computed from the charts.

/** Longest run of consecutive bars where `test` holds; returns [start, length]. */
export function longestRun(values: Series, test: (v: number) => boolean): [number, number] {
  let best: [number, number] = [-1, 0];
  let start = -1;
  values.forEach((v, i) => {
    if (v != null && test(v)) {
      if (start < 0) start = i;
      if (i - start + 1 > best[1]) best = [start, i - start + 1];
    } else start = -1;
  });
  return best;
}
export const countWhere = (values: Series, test: (v: number) => boolean) => values.filter((v) => v != null && test(v)).length;

export function climbFacts(c = getOscChart("strong-climb")!) {
  const [runStart, runLength] = longestRun(c.rsi, (v) => v > 70);
  const firstOver = c.rsi.findIndex((v) => v != null && v > 70);
  const later = Math.min(c.closes.length - 1, firstOver + 20);
  const rsiOver = c.rsi.map((v, i) => (v != null && v > 70 ? i : -1)).filter((i) => i >= 0);
  const bothOver = rsiOver.filter((i) => (c.fastK[i] ?? 0) > 80).length;
  return {
    runStart,
    runLength,
    firstOver,
    later,
    closeAtFirst: c.closes[firstOver]!,
    closeLater: c.closes[later]!,
    rsiOverBars: rsiOver.length,
    stochOverBars: countWhere(c.fastK, (v) => v > 80),
    bothOver,
    /** Share of RSI-overbought bars where fast %K is also over 80, in %. */
    bothPct: rsiOver.length ? Math.round((bothOver / rsiOver.length) * 100) : 0,
  };
}

export function rangeFacts(c = getOscChart("choppy-range")!) {
  const fastCrosses = lineCrosses(c.fastK, c.fastD).length;
  const slowCrosses = lineCrosses(c.slowK, c.slowD).length;
  const jOut = countWhere(c.j, (v) => v > 100 || v < 0);
  const kOut = countWhere(c.k, (v) => v > 100 || v < 0);
  // A bar where J is far from K, for the J = 3K − 2D question.
  let jBar = -1;
  c.j.forEach((v, i) => {
    if (v != null && (jBar < 0 || Math.abs(v - c.k[i]!) > Math.abs(c.j[jBar]! - c.k[jBar]!))) jBar = i;
  });
  return { fastCrosses, slowCrosses, jOut, kOut, jBar, K: c.k[jBar]!, D: c.d[jBar]!, J: c.j[jBar]! };
}

export function gapFacts(c = getOscChart("climb-then-gap")!) {
  const gapBar = c.bars.findIndex((b, i) => i > 0 && b.open < c.bars[i - 1]!.low - 2);
  const stopBefore = c.vstop[gapBar - 1]!;
  const gapOpen = c.bars[gapBar]!.open;
  const downFlip = c.flips.find((i) => i >= gapBar && c.vstopUp[i] === false) ?? -1;
  // A bar in the climb where the stop moved up to (highest close − ATR × 2).
  let stepBar = -1;
  let peakAtStep = 0;
  let peak = -Infinity;
  for (let i = 0; i < gapBar; i++) {
    if (c.vstop[i] == null) continue;
    if (c.flips.includes(i) || peak === -Infinity) peak = c.closes[i]!;
    else peak = Math.max(peak, c.closes[i]!);
    const prev = c.vstop[i - 1];
    if (i > 40 && c.vstopUp[i] && c.vstopUp[i - 1] && prev != null && c.vstop[i]! > prev + 0.05 && stepBar < 0) {
      stepBar = i;
      peakAtStep = peak;
    }
  }
  let movedDownInClimb = false;
  for (let i = 1; i < gapBar; i++) {
    const a = c.vstop[i - 1], b = c.vstop[i];
    if (a != null && b != null && c.vstopUp[i] && c.vstopUp[i - 1] && b < a - 1e-9) movedDownInClimb = true;
  }
  return {
    gapBar,
    stopBefore: round2(stopBefore),
    gapOpen,
    slippage: round2(stopBefore - gapOpen),
    downFlip,
    stepBar,
    peakAtStep: round2(peakAtStep),
    atrAtStep: round2(c.atr[stepBar]!),
    stopAtStep: round2(c.vstop[stepBar]!),
    movedDownInClimb,
    corrRsiStoch: round2(correlation(c.rsi, c.fastK)),
    corrStochK: round2(correlation(c.fastK, c.k)),
  };
}

// ---------------------------------------------------------------------------------------------
// Quiz items (shared by the practice page and the Learn group).

export interface OscChoice {
  id: string;
  label: string;
}
export type OscPanel = "rsi-stoch" | "fast-slow" | "kdj" | "vstop";
/** Lower-panel choices for each chart (first = default). */
export const OSC_PANELS: Record<OscChartId, { id: OscPanel; label: string }[]> = {
  "strong-climb": [
    { id: "rsi-stoch", label: "RSI + fast %K" },
    { id: "kdj", label: "KDJ" },
  ],
  "choppy-range": [
    { id: "fast-slow", label: "Fast vs slow stochastic" },
    { id: "kdj", label: "KDJ" },
  ],
  "climb-then-gap": [
    { id: "vstop", label: "Volatility stop + ATR" },
    { id: "rsi-stoch", label: "RSI + fast %K" },
  ],
};

export interface OscQuestion {
  id: string;
  chartId: OscChartId;
  panel: OscPanel;
  prompt: string;
  options: OscChoice[];
  correct: string;
  explanation: string;
  mark?: number;
  glossaryTermId?: string;
}

const LETTERS = ["A", "B", "C", "D"];
const label = (i: number) => `D${i + 1}`;
function choices(labels: string[], keyIndex: number) {
  return { options: labels.map((l, i) => ({ id: LETTERS[i]!, label: l })), correct: LETTERS[keyIndex]! };
}
/** Four distinct values including the key, from fixed offsets, sorted ascending. */
function numberChoices(key: number, offsets: number[], fmt: (v: number) => string, allowNegative = false) {
  const picks = [key];
  for (const o of offsets) {
    const v = round2(key + o);
    if ((allowNegative || v >= 0) && !picks.some((p) => fmt(p) === fmt(v))) picks.push(v);
    if (picks.length === 4) break;
  }
  picks.sort((a, b) => a - b);
  return { options: picks.map((p, i) => ({ id: LETTERS[i]!, label: fmt(p) })), correct: LETTERS[picks.indexOf(key)]! };
}
function barChoices(key: number, offsets: number[], n: number) {
  const picks = [key];
  for (const o of offsets) {
    const v = key + o;
    if (v >= 0 && v < n && !picks.includes(v)) picks.push(v);
    if (picks.length === 4) break;
  }
  picks.sort((a, b) => a - b);
  return { options: picks.map((p, i) => ({ id: LETTERS[i]!, label: label(p) })), correct: LETTERS[picks.indexOf(key)]! };
}
const corrBucket = (r: number) => (r >= 0.7 ? 0 : r >= 0.3 ? 1 : r > -0.3 ? 2 : 3);
const CORR_LABELS = ["Strongly positive (0.7 or more)", "Moderately positive (0.3 to 0.7)", "About zero", "Negative"];

export function climbQuestions(): OscQuestion[] {
  const c = getOscChart("strong-climb")!;
  const f = climbFacts(c);
  const up = f.closeLater > f.closeAtFirst;
  return [
    {
      id: "climb-rsi-run",
      chartId: c.id,
      panel: "rsi-stoch",
      prompt: `On this climb, what is the longest run of consecutive bars with RSI(${RSI_PERIOD}) above 70?`,
      ...numberChoices(f.runLength, [-6, 5, 12, -3, 20], (v) => `${v} bars`),
      explanation: `RSI stays above 70 from ${label(f.runStart)} for ${f.runLength} bars in a row. "Overbought" describes a stretch, not a turn: in a strong trend RSI can stay above 70 for a long time.`,
      mark: f.runStart,
      glossaryTermId: "momentum-oscillator",
    },
    {
      id: "climb-after-overbought",
      chartId: c.id,
      panel: "rsi-stoch",
      prompt: `RSI first goes above 70 at ${label(f.firstOver)} (close ${f.closeAtFirst.toFixed(2)}). Twenty bars later, at ${label(f.later)}, the close is…`,
      ...choices(["Higher", "Lower", "Unchanged"], up ? 0 : 1),
      explanation: `${label(f.later)} closes at ${f.closeLater.toFixed(2)}, ${up ? "higher" : "lower"} than ${f.closeAtFirst.toFixed(2)}. Selling the first overbought reading would have ${up ? "fought the trend" : "worked this time, which is luck, not a rule"}. Overbought is not a sell signal on its own.`,
      mark: f.later,
    },
    {
      id: "climb-agreement",
      chartId: c.id,
      panel: "rsi-stoch",
      prompt: `On the bars where RSI(${RSI_PERIOD}) is above 70, how often is fast %K(${STOCH_PERIOD}) also above 80?`,
      ...numberChoices(f.bothPct, [-40, -25, -60, -15, 10], (v) => `${v}% of them`),
      explanation: `${f.bothOver} of ${f.rsiOverBars} bars (${f.bothPct}%). Both are momentum oscillators computed from the same closes (the stochastic also uses highs and lows), so they usually agree. Two of them flashing "overbought" together is close to one reading, not two independent confirmations.`,
      glossaryTermId: "momentum-oscillator",
    },
  ];
}

export function rangeQuestions(): OscQuestion[] {
  const c = getOscChart("choppy-range")!;
  const f = rangeFacts(c);
  const r1 = (v: number) => Math.round(v * 10) / 10;
  /** J from the K and D shown in the prompt (one decimal), so the arithmetic matches what the learner sees. */
  const jFromShown = r1(3 * r1(f.K) - 2 * r1(f.D));
  return [
    {
      id: "range-fast-crosses",
      chartId: c.id,
      panel: "fast-slow",
      prompt: `In this range, fast %K crosses fast %D ${f.fastCrosses} times. How many times does slow %K cross slow %D?`,
      ...numberChoices(f.slowCrosses, [-6, 8, 4, 14, -3], (v) => `${v}`),
      explanation: `Slow %K is fast %K smoothed with a 3-bar SMA (it equals fast %D), so the slow pair crosses ${f.slowCrosses} times against ${f.fastCrosses} for the fast pair. Faster lines give more crossovers, and more of them are false signals that price does not follow.`,
      glossaryTermId: "slow-stochastic",
    },
    {
      id: "range-j-out",
      chartId: c.id,
      panel: "kdj",
      prompt: `KDJ(${KDJ_PERIOD}, 3, 3): on how many bars does the J line go above 100 or below 0? (K does on ${f.kOut}.)`,
      ...numberChoices(f.jOut, [-8, 6, 15, -4, 25], (v) => `${v} bars`),
      explanation: `J = 3K − 2D amplifies the gap between K and D, so it leaves the 0–100 band on ${f.jOut} bars while K and D never can. That sensitivity is why J turns first and also why it gives more false turns in a choppy market.`,
      glossaryTermId: "kdj",
    },
    {
      id: "range-j-calc",
      chartId: c.id,
      panel: "kdj",
      prompt: `At ${label(f.jBar)}, K = ${f.K.toFixed(1)} and D = ${f.D.toFixed(1)}. What is J?`,
      ...numberChoices(jFromShown, [-25, 18, 40, -12, 60], (v) => v.toFixed(1), true),
      explanation: `J = 3K − 2D = 3 × ${f.K.toFixed(1)} − 2 × ${f.D.toFixed(1)} = ${jFromShown.toFixed(1)} (the chart's unrounded J is ${f.J.toFixed(1)}). When K is above D, J is further above K; when K is below D, J is further below.`,
      mark: f.jBar,
      glossaryTermId: "kdj",
    },
  ];
}

export function gapQuestions(): OscQuestion[] {
  const c = getOscChart("climb-then-gap")!;
  const f = gapFacts(c);
  const n = c.bars.length;
  return [
    {
      id: "gap-stop-calc",
      chartId: c.id,
      panel: "vstop",
      prompt: `At ${label(f.stepBar)} the highest close since the uptrend began is ${f.peakAtStep.toFixed(2)} and ATR(${ATR_PERIOD}) is ${f.atrAtStep.toFixed(2)}. With a ${VSTOP_MULT}× multiplier, where is the volatility stop?`,
      ...numberChoices(f.stopAtStep, [-f.atrAtStep, f.atrAtStep, -2 * f.atrAtStep, 2 * f.atrAtStep], (v) => v.toFixed(2)),
      explanation: `${f.peakAtStep.toFixed(2)} − ${VSTOP_MULT} × ${f.atrAtStep.toFixed(2)} = ${f.stopAtStep.toFixed(2)}. The stop trails the highest close by ATR × multiplier and only ratchets up during the uptrend.`,
      mark: f.stepBar,
      glossaryTermId: "volatility-stop",
    },
    {
      id: "gap-ratchet",
      chartId: c.id,
      panel: "vstop",
      prompt: `During the climb (before the gap), does the volatility stop ever move down?`,
      ...choices(["No: it only moves up or stays flat while the trend is up", "Yes, whenever ATR rises", "Yes, on every red bar"], f.movedDownInClimb ? 1 : 0),
      explanation: `It never moves down in the uptrend: each bar keeps the higher of the old stop and (highest close − ATR × ${VSTOP_MULT}). That is what makes it a trailing stop. Compare the trailing-stop rule: a long's stop only moves up.`,
      glossaryTermId: "trailing-stop",
    },
    {
      id: "gap-flip",
      chartId: c.id,
      panel: "vstop",
      prompt: `On which bar does the volatility stop flip to a downtrend (the close crosses below it)?`,
      ...barChoices(f.downFlip, [-15, 6, 12, -8, 20], n),
      explanation: `${label(f.downFlip)}: the close falls through the stop, so the line jumps above price and starts trailing the lowest close plus ATR × ${VSTOP_MULT}.`,
      mark: f.downFlip,
      glossaryTermId: "volatility-stop",
    },
    {
      id: "gap-fill",
      chartId: c.id,
      panel: "vstop",
      prompt: `The stop is ${f.stopBefore.toFixed(2)} at the close of ${label(f.gapBar - 1)}. ${label(f.gapBar)} opens at ${f.gapOpen.toFixed(2)}. A sell-stop order at ${f.stopBefore.toFixed(2)} would most likely fill near…`,
      ...choices([`${f.stopBefore.toFixed(2)}, the stop level`, `${f.gapOpen.toFixed(2)} or lower, near the open`, "It cannot fill until price comes back up", `${round2(f.stopBefore + 1).toFixed(2)}, above the stop`], 1),
      explanation: `A stop order becomes a market order once price trades at or through the stop. Price opened ${f.slippage.toFixed(2)} below it, so the first available price is near the open. A stop level controls when you exit, not the price you get.`,
      mark: f.gapBar,
      glossaryTermId: "gap-risk",
    },
    {
      id: "gap-agreement",
      chartId: c.id,
      panel: "rsi-stoch",
      prompt: `On this chart RSI(${RSI_PERIOD}), fast %K(${STOCH_PERIOD}) and KDJ's K all swing from high readings in the climb to low readings after the gap. How closely do RSI and fast %K move together (correlation)?`,
      ...choices(CORR_LABELS, corrBucket(f.corrRsiStoch)),
      explanation: `The correlation is ${f.corrRsiStoch.toFixed(2)}, and fast %K with KDJ's K is ${f.corrStochK.toFixed(2)}. All three are momentum oscillators built from the same prices, so when price makes a real move they read almost the same. Three of them agreeing is close to one reading, not three independent confirmations; check something different (trend, a level, the plan's risk).`,
      glossaryTermId: "momentum-oscillator",
    },
  ];
}

export function oscQuestions(): OscQuestion[] {
  return [...climbQuestions(), ...rangeQuestions(), ...gapQuestions()];
}
export const gradeOsc = (q: OscQuestion, pick: string) => pick === q.correct;

/**
 * EMA vs SMA and MACD on dedicated LONG simulated charts (120 daily bars).
 *
 * The Trend-vs-range practice uses 6-bar windows. On those, a 20-bar average does not exist yet and
 * MACD(12, 26, 9) needs 26 bars for its first value and 34 for its signal, so EMA, SMA and MACD read
 * the same or not at all. These charts are long enough for the differences to show: EMA turns before
 * SMA, MACD crosses its signal near turns, and the histogram fades before price tops.
 *
 * Every chart is generated from a fixed seed (no live data), and every quiz answer is computed from
 * the chart with the same indicator functions the app draws, so the key always matches the picture.
 */
import { ema, macd, sma } from "./indicators";
import type { OHLC } from "./ohlcData";
import { REGIME_WINDOWS } from "./practiceLabs";

export const LAB_LABEL = "SIMULATED";
export const MA_PERIOD = 20;
export const MACD_FAST = 12;
export const MACD_SLOW = 26;
export const MACD_SIGNAL = 9;
export const LAB_BARS = 120;

export type LabChartId = "trend-turn" | "range-breakout" | "rounded-top";

interface Segment {
  bars: number;
  /** Close-to-close drift per bar. */
  drift: number;
  /** Optional wave amplitude (range segments). */
  wave?: number;
}

interface ChartSpec {
  id: LabChartId;
  title: string;
  blurb: string;
  seed: number;
  start: number;
  noise: number;
  segments: Segment[];
}

const SPECS: ChartSpec[] = [
  {
    id: "trend-turn",
    title: "Uptrend, then a sharp turn down",
    blurb: "60 bars of climb, a 30-bar drop, then a flat base.",
    seed: 11,
    start: 100,
    noise: 0.5,
    segments: [
      { bars: 60, drift: 0.6 },
      { bars: 30, drift: -1.0 },
      { bars: 30, drift: 0.05 },
    ],
  },
  {
    id: "range-breakout",
    title: "Range, then a breakout",
    blurb: "70 bars swinging around 100, then a steady move up.",
    seed: 23,
    start: 100,
    noise: 0.4,
    segments: [
      { bars: 70, drift: 0, wave: 2.5 },
      { bars: 50, drift: 0.8 },
    ],
  },
  {
    id: "rounded-top",
    title: "A rounded top",
    blurb: "A flat base, a fast climb that slows, a stall, then a roll-over.",
    seed: 37,
    start: 100,
    noise: 0.3,
    segments: [
      { bars: 30, drift: 0 },
      { bars: 25, drift: 1.0 },
      { bars: 15, drift: 0.3 },
      { bars: 15, drift: 0 },
      { bars: 35, drift: -0.6 },
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

function build(spec: ChartSpec): OHLC[] {
  const r = rng(spec.seed);
  const out: OHLC[] = [];
  let base = spec.start;
  let prevClose = spec.start;
  let i = 0;
  for (const seg of spec.segments) {
    for (let j = 0; j < seg.bars; j++, i++) {
      base += seg.drift;
      const wave = seg.wave ? seg.wave * Math.sin((j / 9) * Math.PI) : 0;
      const close = round2(base + wave + (r() - 0.5) * 2 * spec.noise);
      const open = prevClose;
      const high = round2(Math.max(open, close) + r() * spec.noise);
      const low = round2(Math.min(open, close) - r() * spec.noise);
      out.push({ name: `D${i + 1}`, open, high, low, close });
      prevClose = close;
    }
  }
  return out;
}

export interface LabChart {
  id: LabChartId;
  title: string;
  blurb: string;
  bars: OHLC[];
  closes: number[];
  sma: (number | null)[];
  ema: (number | null)[];
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
}

function analyze(spec: ChartSpec): LabChart {
  const bars = build(spec);
  const closes = bars.map((b) => b.close);
  const m = macd(closes, MACD_FAST, MACD_SLOW, MACD_SIGNAL);
  return {
    id: spec.id,
    title: spec.title,
    blurb: spec.blurb,
    bars,
    closes,
    sma: sma(closes, MA_PERIOD),
    ema: ema(closes, MA_PERIOD),
    macd: m.macd,
    signal: m.signal,
    histogram: m.histogram,
  };
}

export const LAB_CHARTS: LabChart[] = SPECS.map(analyze);
export const getLabChart = (id: string) => LAB_CHARTS.find((c) => c.id === id);

/** Index of the highest close in [from, to]. */
export function peakIndex(values: number[], from = 0, to = values.length - 1): number {
  let best = from;
  for (let i = from; i <= to; i++) if (values[i]! > values[best]!) best = i;
  return best;
}

/** Index of the highest non-null value in [from, to]. */
export function peakOf(values: (number | null)[], from: number, to: number): number {
  let best = -1;
  for (let i = from; i <= to; i++) if (values[i] != null && (best < 0 || values[i]! > values[best]!)) best = i;
  return best;
}

/**
 * First bar at or after `from` that starts a run of `run` straight declines in the line
 * (the line has "turned down"). -1 if it never does.
 */
export function turnDownIndex(line: (number | null)[], from: number, run = 3): number {
  for (let i = Math.max(from, 1); i + run - 1 < line.length; i++) {
    let ok = true;
    for (let k = 0; k < run; k++) {
      const a = line[i + k - 1];
      const b = line[i + k];
      if (a == null || b == null || !(b < a)) {
        ok = false;
        break;
      }
    }
    if (ok) return i;
  }
  return -1;
}

export interface Cross {
  index: number;
  dir: "up" | "down";
}

/** Bars where MACD crosses its signal line (sign of the histogram changes). */
export function signalCrosses(chart: Pick<LabChart, "histogram">): Cross[] {
  const out: Cross[] = [];
  const h = chart.histogram;
  for (let i = 1; i < h.length; i++) {
    const a = h[i - 1];
    const b = h[i];
    if (a == null || b == null) continue;
    if (a <= 0 && b > 0) out.push({ index: i, dir: "up" });
    else if (a >= 0 && b < 0) out.push({ index: i, dir: "down" });
  }
  return out;
}

/**
 * First signal cross in `dir` at or after `from` whose histogram then keeps its new sign for `hold`
 * bars: a decisive cross, not a one-bar wiggle around zero.
 */
export function firstCrossAfter(chart: Pick<LabChart, "histogram">, from: number, dir: Cross["dir"], hold = 5): Cross | undefined {
  const h = chart.histogram;
  return signalCrosses(chart).find((c) => {
    if (c.index < from || c.dir !== dir) return false;
    for (let k = 0; k < hold && c.index + k < h.length; k++) {
      const v = h[c.index + k]!;
      if (dir === "up" ? !(v > 0) : !(v < 0)) return false;
    }
    return true;
  });
}

/** Bars until a series first has a value: the warm-up. */
export const warmUp = (line: (number | null)[]) => line.findIndex((v) => v != null);

/** The short-window lesson, computed: what each indicator has to show on an N-bar window. */
export function shortWindowFacts(windowId = "grind-up", maPeriod = 3) {
  // The real Trend vs range window (unchanged), measured with the app's own indicator functions.
  const closes = REGIME_WINDOWS.find((w) => w.id === windowId)!.bars.map((b) => b.close);
  const windowBars = closes.length;
  const s = sma(closes, maPeriod);
  const e = ema(closes, maPeriod);
  let maxGap = 0;
  for (let i = 0; i < closes.length; i++) if (s[i] != null && e[i] != null) maxGap = Math.max(maxGap, Math.abs(s[i]! - e[i]!));
  const m = macd(closes, MACD_FAST, MACD_SLOW, MACD_SIGNAL);
  const long = Array.from({ length: LAB_BARS }, (_, i) => 100 + i);
  const ml = macd(long, MACD_FAST, MACD_SLOW, MACD_SIGNAL);
  return {
    windowId,
    windowBars,
    maPeriod,
    /** Largest SMA vs EMA gap on the window, in price units. */
    maxGap: round2(maxGap),
    /** Average closing range of the window, for scale. */
    avgStep: round2((closes[closes.length - 1]! - closes[0]!) / (closes.length - 1)),
    sma20Values: sma(closes, MA_PERIOD).filter((v) => v != null).length,
    macdValues: m.macd.filter((v) => v != null).length,
    signalValues: m.signal.filter((v) => v != null).length,
    /** Bars needed before MACD and its signal exist. */
    macdFirstBar: warmUp(ml.macd) + 1,
    signalFirstBar: warmUp(ml.signal) + 1,
  };
}

// ---------------------------------------------------------------------------------------------
// Quiz items: every key is computed from the chart above.

export interface LabChoice {
  id: string;
  label: string;
}

export interface LabQuestion {
  id: string;
  chartId: LabChartId | "short-window";
  prompt: string;
  options: LabChoice[];
  correct: string;
  explanation: string;
  /** Bar to mark on the chart once answered. */
  mark?: number;
}

const label = (i: number) => `D${i + 1}`;
const LETTERS = ["A", "B", "C", "D"];

/** Four bar options: the key plus distinct distractors at fixed offsets, kept inside the chart, in bar order. */
function barOptions(key: number, offsets: number[], n: number): { options: LabChoice[]; correct: string } {
  const picks = [key];
  for (const o of offsets) {
    const v = key + o;
    if (v >= 0 && v < n && !picks.includes(v)) picks.push(v);
    if (picks.length === 4) break;
  }
  picks.sort((a, b) => a - b);
  const options = picks.map((p, i) => ({ id: LETTERS[i]!, label: label(p) }));
  return { options, correct: options[picks.indexOf(key)]!.id };
}

/** Four distinct non-negative numbers including `key`, sorted, from fixed offsets. */
function numberOptions(key: number, offsets: number[], suffix = ""): { options: LabChoice[]; correct: string } {
  const picks = [key];
  for (const o of offsets) {
    const v = key + o;
    if (v >= 0 && !picks.includes(v)) picks.push(v);
    if (picks.length === 4) break;
  }
  picks.sort((a, b) => a - b);
  return { options: picks.map((p, i) => ({ id: LETTERS[i]!, label: `${p}${suffix}` })), correct: LETTERS[picks.indexOf(key)]! };
}

function choices(labels: string[], keyIndex: number): { options: LabChoice[]; correct: string } {
  return { options: labels.map((l, i) => ({ id: LETTERS[i]!, label: l })), correct: LETTERS[keyIndex]! };
}

export function turnQuestions(c: LabChart): LabQuestion[] {
  const n = c.bars.length;
  const top = peakIndex(c.closes, 0, 89);
  const e = turnDownIndex(c.ema, top - 5);
  const s = turnDownIndex(c.sma, top - 5);
  const first = e < s ? 0 : s < e ? 1 : 2;
  const lag = s - e;
  const down = firstCrossAfter(c, top - 3, "down", 8)!;
  const after = Math.min(n - 1, down.index + 3);
  const histNeg = c.histogram[after]! < 0;
  const climb = 49; // 50 bars into a straight climb
  const gap = c.ema[climb]! - c.sma[climb]!;
  const buckets = ["Under 0.5: nearly the same line", "About 2", "About 5", "About 10"];
  const a = Math.abs(gap);
  const bucket = a < 0.5 ? 0 : a < 3.5 ? 1 : a < 7.5 ? 2 : 3;
  return [
    {
      id: "turn-first",
      chartId: c.id,
      prompt: `Price tops out at ${label(top)}. Which ${MA_PERIOD}-bar average turns down first (three falling bars in a row)?`,
      ...choices([`EMA(${MA_PERIOD})`, `SMA(${MA_PERIOD})`, "Both on the same bar", "Neither turns"], first),
      explanation: `EMA(${MA_PERIOD}) turns at ${label(e)}, SMA(${MA_PERIOD}) at ${label(s)}. The EMA gives the newest close about ${Math.round((2 / (MA_PERIOD + 1)) * 100)}% weight; the SMA gives every close in its window 1/${MA_PERIOD} = 5%, so it keeps "remembering" the highs longer.`,
      mark: e,
    },
    {
      id: "turn-lag",
      chartId: c.id,
      prompt: `How many bars after the EMA(${MA_PERIOD}) does the SMA(${MA_PERIOD}) turn down?`,
      ...numberOptions(lag, [-2, 4, 8, -1, 12], " bars"),
      explanation: `${label(s)} − ${label(e)} = ${lag} bars of extra lag. On a 6-bar chart a gap like that cannot show up at all.`,
      mark: s,
    },
    {
      id: "turn-cross",
      chartId: c.id,
      prompt: `Near the top, on which bar does MACD(${MACD_FAST}, ${MACD_SLOW}, ${MACD_SIGNAL}) first cross below its signal line?`,
      ...barOptions(down.index, [-12, 8, 16, -6, 20], n),
      explanation: `The histogram (MACD − signal) flips from positive to negative at ${label(down.index)}. Price topped at ${label(top)}: ${down.index >= top ? (down.index === top ? "the cross lands on the top bar itself" : `the cross confirms ${down.index - top} bars after the top`) : `momentum faded ${top - down.index} bars before the price top`}.`,
      mark: down.index,
    },
    {
      id: "turn-hist",
      chartId: c.id,
      prompt: `Three bars after that cross, at ${label(after)}, the MACD histogram is…`,
      ...choices(["Above zero", "Below zero", "Exactly zero"], histNeg ? 1 : 0),
      explanation: `At ${label(after)} MACD ${c.macd[after]!.toFixed(2)} − signal ${c.signal[after]!.toFixed(2)} = ${c.histogram[after]!.toFixed(2)}.`,
      mark: after,
    },
    {
      id: "ema-vs-sma-climb",
      chartId: c.id,
      prompt: `At ${label(climb)}, in the middle of the steady climb, how far apart are EMA(${MA_PERIOD}) and SMA(${MA_PERIOD})?`,
      ...choices(buckets, bucket),
      explanation: `EMA ${c.ema[climb]!.toFixed(2)} vs SMA ${c.sma[climb]!.toFixed(2)}: ${a.toFixed(2)} apart. On a straight climb both lag by about (${MA_PERIOD} − 1) / 2 = ${(MA_PERIOD - 1) / 2} bars, so they nearly coincide; they separate where the trend bends (see the turn chart).`,
      mark: climb,
    },
  ];
}

export function breakoutQuestions(c: LabChart): LabQuestion[] {
  const n = c.bars.length;
  const brk = 70;
  const up = firstCrossAfter(c, brk - 5, "up")!;
  const aboveZero = c.macd[up.index]! > 0;
  const crossesInRange = signalCrosses(c).filter((x) => x.index >= warmUp(c.signal) && x.index < brk).length;
  return [
    {
      id: "breakout-cross",
      chartId: c.id,
      prompt: `The range breaks out around ${label(brk)}. On which bar does MACD next cross above its signal line?`,
      ...barOptions(up.index, [-14, 9, 18, -7, 24], n),
      explanation: `The histogram turns positive at ${label(up.index)}.`,
      mark: up.index,
    },
    {
      id: "breakout-zero",
      chartId: c.id,
      prompt: `At that cross (${label(up.index)}), is the MACD line itself above or below zero?`,
      ...choices(["Above zero (EMA12 over EMA26)", "Below zero (EMA12 under EMA26)"], aboveZero ? 0 : 1),
      explanation: `MACD = EMA(12) − EMA(26) = ${c.macd[up.index]!.toFixed(2)} at ${label(up.index)}. A signal cross and a zero-line cross are different events.`,
      mark: up.index,
    },
    {
      id: "range-whipsaw",
      chartId: c.id,
      prompt: `Inside the range (from the first signal value to ${label(brk - 1)}), how many times does MACD cross its signal line?`,
      ...numberOptions(crossesInRange, [-2, 3, 6, -1, 9]),
      explanation: `${crossesInRange} crosses in a sideways market: signal-line crosses whipsaw in a range, which is why the Trend vs range practice pairs ranges with other tools.`,
    },
  ];
}

export function roundedTopQuestions(c: LabChart): LabQuestion[] {
  const from = warmUp(c.histogram) + 3;
  const pricePeak = peakIndex(c.closes, 0, 90);
  const histPeak = peakOf(c.histogram, from, pricePeak);
  const lead = pricePeak - histPeak;
  return [
    {
      id: "hist-first",
      chartId: c.id,
      prompt: `Which peaks first on this rounded top: the MACD histogram or the closing price?`,
      ...choices(["The histogram", "The price", "Same bar"], lead > 0 ? 0 : lead < 0 ? 1 : 2),
      explanation: `The histogram peaks at ${label(histPeak)}, price at ${label(pricePeak)}${lead > 0 ? `: ${lead} bars earlier. The histogram tracks how fast MACD is changing, so it fades as the climb slows, before the climb stops` : ""}.`,
      mark: histPeak,
    },
  ];
}

export function shortWindowQuestions(): LabQuestion[] {
  const f = shortWindowFacts();
  return [
    {
      id: "short-macd",
      chartId: "short-window",
      prompt: `On a ${f.windowBars}-bar window like the Trend vs range charts, how many MACD(${MACD_FAST}, ${MACD_SLOW}, ${MACD_SIGNAL}) values can be drawn?`,
      ...choices(["0", "1", String(f.windowBars), "26"], 0),
      explanation: `MACD needs ${f.macdFirstBar} bars before its first value and ${f.signalFirstBar} before its signal. A ${f.windowBars}-bar window has ${f.macdValues}.`,
    },
    {
      id: "short-gap",
      chartId: "short-window",
      prompt: `On the ${f.windowBars}-bar "grind" window from Trend vs range, a ${f.maPeriod}-bar SMA and EMA differ by at most…`,
      ...choices([`${f.maxGap.toFixed(2)}, less than one bar's typical move of ${f.avgStep.toFixed(2)}`, "About 5", "About 10", "They can't be computed"], 0),
      explanation: `Max gap ${f.maxGap.toFixed(2)} on the Trend vs range "grind" window. With only ${f.windowBars} bars, the EMA's weighting has no long history to discount, so both lines sit on top of each other: the reason these lessons use ${LAB_BARS}-bar charts.`,
    },
  ];
}

export function labQuestions(): LabQuestion[] {
  const [turn, breakout, top] = LAB_CHARTS;
  return [...shortWindowQuestions(), ...turnQuestions(turn!), ...breakoutQuestions(breakout!), ...roundedTopQuestions(top!)];
}

export const gradeLab = (q: LabQuestion, pick: string) => pick === q.correct;

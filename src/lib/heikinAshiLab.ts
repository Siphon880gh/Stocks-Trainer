/**
 * Heikin-Ashi lab: one LONG SIMULATED chart (60 daily bars, fixed seed, no market data) drawn as regular
 * candles and as Heikin-Ashi candles. Every quiz key is computed from the same bars the charts draw.
 *
 * Teaching points: HA averages each bar with the previous HA bar, so trends print long runs of one colour
 * (green with no lower wick in a strong advance, red with no upper wick in a strong decline), and small bodies
 * with wicks on both sides flag a possible turn. HA prices are not traded prices and HA lags: entries, stops and
 * fills must use the real candles.
 */
import { heikinAshi, isIndecision, isStrongDown, isStrongUp } from "./heikinAshi";
import type { OHLC } from "./ohlcData";

export const HA_LABEL = "SIMULATED";

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

/** Segments: base, climb, top, decline. */
export const HA_SEGMENTS = [
  { name: "base", bars: 10, drift: 0 },
  { name: "climb", bars: 24, drift: 0.55 },
  { name: "top", bars: 8, drift: 0 },
  { name: "decline", bars: 18, drift: -0.6 },
] as const;

function build(seed = 11, start = 40, noise = 0.9, wick = 0.5): OHLC[] {
  const r = rng(seed);
  const out: OHLC[] = [];
  let base = start;
  let prev = start;
  let i = 0;
  for (const seg of HA_SEGMENTS) {
    for (let j = 0; j < seg.bars; j++, i++) {
      base += seg.drift;
      const close = round2(base + (r() - 0.5) * 2 * noise);
      const open = prev;
      out.push({ name: `D${i + 1}`, open, close, high: round2(Math.max(open, close) + r() * wick), low: round2(Math.min(open, close) - r() * wick) });
      prev = close;
    }
  }
  return out;
}

export const HA_BARS: OHLC[] = build();
export const HA_CANDLES: OHLC[] = heikinAshi(HA_BARS);

export function segmentRange(name: (typeof HA_SEGMENTS)[number]["name"]): [number, number] {
  let s = 0;
  for (const seg of HA_SEGMENTS) {
    if (seg.name === name) return [s, s + seg.bars - 1];
    s += seg.bars;
  }
  throw new Error(name);
}

const isRed = (c: OHLC) => c.close < c.open;
const isGreen = (c: OHLC) => c.close > c.open;
function longestRun(test: (i: number) => boolean, from: number, to: number): [number, number] {
  let best = 0, bestStart = from, run = 0, start = from;
  for (let i = from; i <= to; i++) {
    if (test(i)) {
      if (run === 0) start = i;
      run++;
      if (run > best) { best = run; bestStart = start; }
    } else run = 0;
  }
  return [bestStart, best];
}

export function haFacts(bars = HA_BARS, ha = HA_CANDLES) {
  const [c0, c1] = segmentRange("climb");
  const [t0, t1] = segmentRange("top");
  const [d0, d1] = segmentRange("decline");
  const idx = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
  const climb = idx(c0, c1);
  const decline = idx(d0, d1);
  const peak = bars.reduce((m, b, i) => (b.close > bars[m]!.close ? i : m), 0);
  const firstRegRedAfterPeak = bars.findIndex((b, i) => i > peak && isRed(b));
  const firstHaRedAfterPeak = ha.findIndex((b, i) => i > peak && isRed(b));
  const [upRunStart, upRun] = longestRun((i) => isStrongUp(ha[i]!), c0, c1);
  const [downRunStart, downRun] = longestRun((i) => isStrongDown(ha[i]!), d0, d1);
  const calcBar = c0 + 6;
  return {
    climb: [c0, c1] as [number, number],
    top: [t0, t1] as [number, number],
    decline: [d0, d1] as [number, number],
    regRedInClimb: climb.filter((i) => isRed(bars[i]!)).length,
    haRedInClimb: climb.filter((i) => isRed(ha[i]!)).length,
    regGreenInDecline: decline.filter((i) => isGreen(bars[i]!)).length,
    haGreenInDecline: decline.filter((i) => isGreen(ha[i]!)).length,
    upRunStart, upRun, downRunStart, downRun,
    peak,
    firstRegRedAfterPeak,
    firstHaRedAfterPeak,
    lagBars: firstHaRedAfterPeak - firstRegRedAfterPeak,
    indecisionAtTop: idx(t0, t1).filter((i) => isIndecision(ha[i]!)).length,
    calcBar,
    calc: { bar: bars[calcBar]!, prevHa: ha[calcBar - 1]!, ha: ha[calcBar]! },
    lastClose: bars[bars.length - 1]!.close,
    lastHaClose: ha[ha.length - 1]!.close,
  };
}

// ---------------------------------------------------------------------------------------------

export interface HaQuestion {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correct: string;
  explanation: string;
  /** Bar to mark on the charts after answering. */
  mark?: number;
  glossaryTermId?: string;
}
const L = ["A", "B", "C", "D"];
const D = (i: number) => `D${i + 1}`;
function nums(key: number, offsets: number[], fmt: (v: number) => string) {
  const picks = [key];
  for (const o of offsets) {
    const v = round2(key + o);
    if (v >= 0 && !picks.some((p) => fmt(p) === fmt(v))) picks.push(v);
    if (picks.length === 4) break;
  }
  picks.sort((a, b) => a - b);
  return { options: picks.map((p, i) => ({ id: L[i]!, label: fmt(p) })), correct: L[picks.indexOf(key)]! };
}
const pick = (labels: string[], key: number) => ({ options: labels.map((l, i) => ({ id: L[i]!, label: l })), correct: L[key]! });

export function haQuestions(): HaQuestion[] {
  const f = haFacts();
  const { bar, prevHa, ha } = f.calc;
  // Keys use the 2-decimal values the prompt shows.
  const haOpen = round2((round2(prevHa.open) + round2(prevHa.close)) / 2 + 1e-9);
  const haClose = round2((bar.open + bar.high + bar.low + bar.close) / 4 + 1e-9);
  return [
    {
      id: "ha-smoothing",
      prompt: `In the climb (${D(f.climb[0])}–${D(f.climb[1])}) the regular candles print ${f.regRedInClimb} red bodies. How many red Heikin-Ashi candles print over the same bars?`,
      ...nums(f.haRedInClimb, [2, 5, 8, 11], (v) => `${v}`),
      explanation: `${f.haRedInClimb}. Each HA candle averages the bar with the previous HA candle, so small down days inside a climb usually stay green. That smoothing is the point of HA: the trend is easier to see, the day-to-day noise is hidden.`,
      glossaryTermId: "heikin-ashi",
    },
    {
      id: "ha-up-run",
      prompt: `How many HA candles in a row print green with no lower wick in the climb (the longest such run)?`,
      ...nums(f.upRun, [-3, 3, 6, 9], (v) => `${v} candles`),
      explanation: `${f.upRun}, starting at ${D(f.upRunStart)}. Green HA candles with no lower wick mark a strong advance: the HA open is the low of the candle, and price never traded back below it.`,
      mark: f.upRunStart,
    },
    {
      id: "ha-down-run",
      prompt: `In the decline, what is the longest run of red HA candles with no upper wick?`,
      ...nums(f.downRun, [-3, 3, 6, 9], (v) => `${v} candles`),
      explanation: `${f.downRun}, starting at ${D(f.downRunStart)}. Red HA candles with no upper wick are the mirror image: a strong decline where the HA open is the high.`,
      mark: f.downRunStart,
    },
    {
      id: "ha-lag",
      prompt: `The highest close is at ${D(f.peak)}. The first regular red candle after it prints at ${D(f.firstRegRedAfterPeak)}. When does the first red HA candle after the peak print?`,
      ...pick([D(f.peak), D(f.firstRegRedAfterPeak), D(f.firstHaRedAfterPeak), `${D(f.firstHaRedAfterPeak + 5)} or later`], 2),
      explanation: `${D(f.firstHaRedAfterPeak)}, ${f.lagBars === 0 ? "the same bar" : `${f.lagBars} bar${f.lagBars === 1 ? "" : "s"} after the regular candle`}. HA carries the previous HA candle forward, so it is slower to change colour: smoother, but it lags.`,
      mark: f.firstHaRedAfterPeak,
    },
    {
      id: "ha-calc-open",
      prompt: `At ${D(f.calcBar - 1)} the HA open is ${prevHa.open.toFixed(2)} and the HA close is ${prevHa.close.toFixed(2)}. What is the HA open at ${D(f.calcBar)}?`,
      ...nums(haOpen, [-0.6, 0.45, 0.9, -1.2], (v) => v.toFixed(2)),
      explanation: `HA open = (previous HA open + previous HA close) ÷ 2 = (${prevHa.open.toFixed(2)} + ${prevHa.close.toFixed(2)}) ÷ 2 = ${haOpen.toFixed(2)}.`,
      mark: f.calcBar,
    },
    {
      id: "ha-calc-close",
      prompt: `${D(f.calcBar)} trades open ${bar.open.toFixed(2)}, high ${bar.high.toFixed(2)}, low ${bar.low.toFixed(2)}, close ${bar.close.toFixed(2)}. What is its HA close?`,
      ...nums(haClose, [-0.5, 0.35, 0.8, -1.1], (v) => v.toFixed(2)),
      explanation: `HA close = (O + H + L + C) ÷ 4 = ${haClose.toFixed(2)}. The real close was ${bar.close.toFixed(2)}: the HA close is an average, not a price that traded at the close.`,
      mark: f.calcBar,
    },
    {
      id: "ha-not-real",
      prompt: `On the last bar the HA close is ${f.lastHaClose.toFixed(2)} and the real close is ${f.lastClose.toFixed(2)}. Where should a stop or a limit order be based?`,
      ...pick(["On the HA close, because it is smoother", "On the real prices (the regular candles)", "Halfway between the two", "It does not matter"], 1),
      explanation: "HA prices are averages, not traded prices. Orders fill at real prices, so entries, stops and targets must be read off the regular candles. Use HA to read the trend, not to set levels.",
      mark: HA_BARS.length - 1,
    },
    {
      id: "ha-top-read",
      prompt: `At the top (${D(f.top[0])}–${D(f.top[1])}) several HA candles have small bodies with wicks on both sides. What do they suggest?`,
      ...pick(["The climb is accelerating", "A guaranteed reversal", "A possible turn: the trend has lost its push. Wait for confirmation", "Nothing: HA candles never warn"], 2),
      explanation: `${f.indecisionAtTop} candles at the top fit that shape. Small HA bodies with upper and lower wicks show indecision after a trend. It is a warning, not a signal: confirmation is a run of red HA candles or a break of support on the real candles.`,
      mark: f.top[0],
    },
  ];
}

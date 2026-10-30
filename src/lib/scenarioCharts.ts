/**
 * Larger SAMPLE scenario charts (40–70 bars) for the Buy-or-Sell drill.
 * Bars come from a seeded walk through waypoints, then key bars (tops, bases, impulses, retests,
 * the decision candle) are pinned so the structure is exact. The decision point is always the last bar.
 * `reveal` holds the levels / entry / stop / target drawn after the learner answers.
 */
import type { OHLC } from "./ohlcData";
import { stairStepLines, trendlinePriceAt, type ChartAnnotations, type ChartTrendline } from "./chartAnnotations";

export type ScenarioDecision = "buy" | "sell" | "wait";

export interface ScenarioChart {
  key: string;
  bars: OHLC[];
  decision: ScenarioDecision;
  /** Drawn only after the answer is submitted. */
  reveal: ChartAnnotations;
  /** Trade plan for buy/sell scenarios (prices). */
  plan?: { entry: number; stop: number; target: number };
  /** Named prices / indices used by explanations and validation. */
  facts: Record<string, number>;
  trendline?: ChartTrendline;
  /** Both wedge lines (lower, upper) for wedge scenarios. */
  lines?: ChartTrendline[];
}

interface Leg {
  to: number;
  bars: number;
  mark?: string;
}

const r5 = (v: number) => Math.round(v / 5) * 5;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function walk(start: number, legs: Leg[], seed: number, noise = 70, wick = 80) {
  const rand = mulberry32(seed);
  const bars: OHLC[] = [];
  const marks: Record<string, number> = {};
  let prev = start;
  for (const leg of legs) {
    const from = prev;
    for (let k = 1; k <= leg.bars; k++) {
      const base = from + ((leg.to - from) * k) / leg.bars;
      const close = r5(k === leg.bars ? leg.to : base + (rand() - 0.5) * 2 * noise);
      const open = r5(prev);
      const high = r5(Math.max(open, close) + rand() * wick);
      const low = r5(Math.min(open, close) - rand() * wick);
      bars.push({ name: String(bars.length + 1), open, high, low, close });
      prev = close;
    }
    if (leg.mark) marks[leg.mark] = bars.length - 1;
  }
  return { bars, marks };
}

function setBar(bars: OHLC[], i: number, open: number, high: number, low: number, close: number) {
  bars[i] = { name: bars[i].name, open, high: Math.max(high, open, close), low: Math.min(low, open, close), close };
  if (i + 1 < bars.length) {
    const n = bars[i + 1];
    bars[i + 1] = { ...n, open: close, high: Math.max(n.high, close), low: Math.min(n.low, close) };
  }
}

/** Keep every bar in [from, to] at or below `max` (skipping `except`). */
function capHigh(bars: OHLC[], from: number, to: number, max: number | ((i: number) => number), except: number[] = []) {
  for (let i = from; i <= to; i++) {
    if (except.includes(i)) continue;
    const m = typeof max === "number" ? max : max(i);
    const b = bars[i];
    const open = Math.min(b.open, m - 10);
    const close = Math.min(b.close, m - 10);
    bars[i] = { ...b, open, close, high: Math.min(b.high, m), low: Math.min(b.low, Math.min(open, close)) };
  }
}

/** Keep every bar in [from, to] at or above `min` (skipping `except`). */
function floorLow(bars: OHLC[], from: number, to: number, min: number | ((i: number) => number), except: number[] = []) {
  for (let i = from; i <= to; i++) {
    if (except.includes(i)) continue;
    const m = typeof min === "number" ? min : min(i);
    const b = bars[i];
    const open = Math.max(b.open, m + 10);
    const close = Math.max(b.close, m + 10);
    bars[i] = { ...b, open, close, low: Math.max(b.low, m), high: Math.max(b.high, Math.max(open, close)) };
  }
}

/**
 * Re-open every bar at the previous close so pinned bars never leave visual gaps.
 * Prefer the fix that does not widen any candle; bars named in `facts` (…Index) keep their open.
 */
function stitch(s: ScenarioChart): ScenarioChart {
  const bars = s.bars.map((b) => ({ ...b }));
  const pinned = new Set<number>(Object.entries(s.facts).filter(([k]) => k.endsWith("Index")).map(([, v]) => v));
  for (let i = 1; i < bars.length; i++) {
    const p = bars[i - 1];
    const b = bars[i];
    if (p.close === b.open) continue;
    const reopenFits = p.close <= b.high && p.close >= b.low;
    const recloseFits = b.open <= p.high && b.open >= p.low;
    if (!pinned.has(i) && (reopenFits || !recloseFits || pinned.has(i - 1))) {
      bars[i] = { ...b, open: p.close, high: Math.max(b.high, p.close), low: Math.min(b.low, p.close) };
    } else {
      bars[i - 1] = { ...p, close: b.open, high: Math.max(p.high, b.open), low: Math.min(p.low, b.open) };
    }
  }
  return { ...s, bars };
}

const maxHigh = (bars: OHLC[], from: number, to: number) => Math.max(...bars.slice(from, to + 1).map((b) => b.high));
const minLow = (bars: OHLC[], from: number, to: number) => Math.min(...bars.slice(from, to + 1).map((b) => b.low));

function sellPlan(entry: number, stopAbove: number) {
  const stop = r5(stopAbove + 40);
  return { entry, stop, target: r5(entry - 2 * (stop - entry)) };
}
function buyPlan(entry: number, stopBelow: number) {
  const stop = r5(stopBelow - 40);
  return { entry, stop, target: r5(entry + 2 * (entry - stop)) };
}

function planAnnotations(plan: { entry: number; stop: number; target: number }, at: number): ChartAnnotations {
  return {
    zones: [
      {
        fromIndex: at,
        top: Math.max(plan.entry, plan.stop),
        bottom: Math.min(plan.entry, plan.stop),
        label: "Risk (stop)",
        tone: "risk",
        labelAt: plan.stop > plan.entry ? "top" : "bottom",
      },
      {
        fromIndex: at,
        top: Math.max(plan.entry, plan.target),
        bottom: Math.min(plan.entry, plan.target),
        label: "Reward (2R target)",
        tone: "reward",
        labelAt: plan.target > plan.entry ? "top" : "bottom",
      },
    ],
    points: [{ index: at, price: plan.entry, label: "Entry", tone: "entry" }],
  };
}

function merge(...sets: ChartAnnotations[]): ChartAnnotations {
  return {
    levels: sets.flatMap((s) => s.levels ?? []),
    trendlines: sets.flatMap((s) => s.trendlines ?? []),
    zones: sets.flatMap((s) => s.zones ?? []),
    points: sets.flatMap((s) => s.points ?? []),
  };
}

// ---------- Double top → sell on the neckline retest ----------
function doubleTop(): ScenarioChart {
  const { bars, marks: m } = walk(62200, [
    { to: 62400, bars: 10, mark: "lead" },
    { to: 63300, bars: 8 },
    { to: 62750, bars: 5, mark: "tl1" },
    { to: 64450, bars: 9, mark: "top1" },
    { to: 63600, bars: 6, mark: "neck" },
    { to: 64430, bars: 6, mark: "top2" },
    { to: 63400, bars: 7, mark: "brk" },
    { to: 63620, bars: 3, mark: "retest" },
    { to: 63430, bars: 1, mark: "decision" },
  ], 11);
  const line: ChartTrendline = { from: { index: m.lead, price: bars[m.lead].low }, to: { index: m.tl1, price: 0 }, label: "Trendline", tone: "neutral", extend: true };
  line.to.price = bars[m.tl1].low;
  floorLow(bars, m.lead, m.top2, (i) => r5(trendlinePriceAt(line, i)), []);
  capHigh(bars, 0, m.decision, 64380, [m.top1, m.top2]);
  setBar(bars, m.top1, 64300, 64560, 64250, 64420);
  setBar(bars, m.top2, 64330, 64545, 64280, 64400);
  const neck = minLow(bars, m.top1 + 1, m.top2 - 1);
  capHigh(bars, m.brk, m.retest - 1, neck - 20);
  setBar(bars, m.retest, bars[m.retest].open, neck + 50, bars[m.retest].open - 60, neck - 70);
  setBar(bars, m.decision, neck - 70, neck - 40, neck - 330, neck - 300);
  const plan = sellPlan(bars[m.decision].close, bars[m.retest].high);
  return {
    key: "sc-double-top",
    bars,
    decision: "sell",
    plan,
    trendline: line,
    facts: { neck, top1: bars[m.top1].high, top2: bars[m.top2].high, top1Index: m.top1, top2Index: m.top2, brkIndex: m.brk, retestIndex: m.retest },
    reveal: merge(
      {
        levels: [
          { price: 64560, label: "Resistance (two failed tops)", tone: "supply" },
          { price: neck, label: "Neckline: support → resistance", tone: "neutral" },
        ],
        trendlines: [line],
        points: [
          { index: m.top1, price: bars[m.top1].high, label: "Top 1", tone: "supply" },
          { index: m.top2, price: bars[m.top2].high, label: "Top 2", tone: "supply" },
          { index: m.retest, price: bars[m.retest].high, label: "Retest", tone: "neutral" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Double bottom → buy on the neckline retest ----------
function doubleBottom(): ScenarioChart {
  const { bars, marks: m } = walk(66000, [
    { to: 65800, bars: 9, mark: "lead" },
    { to: 64900, bars: 8 },
    { to: 65350, bars: 5, mark: "tl1" },
    { to: 63650, bars: 9, mark: "bot1" },
    { to: 64500, bars: 7, mark: "neck" },
    { to: 63680, bars: 6, mark: "bot2" },
    { to: 64750, bars: 6, mark: "brk" },
    { to: 64560, bars: 3, mark: "retest" },
    { to: 64760, bars: 1, mark: "decision" },
  ], 23);
  const line: ChartTrendline = { from: { index: m.lead, price: bars[m.lead].high }, to: { index: m.tl1, price: bars[m.tl1].high }, label: "Trendline", tone: "neutral", extend: true };
  capHigh(bars, m.lead, m.bot2, (i) => r5(trendlinePriceAt(line, i)));
  floorLow(bars, 0, m.decision, 63700, [m.bot1, m.bot2]);
  setBar(bars, m.bot1, 63760, 63820, 63520, 63700);
  setBar(bars, m.bot2, 63740, 63800, 63535, 63720);
  const neck = maxHigh(bars, m.bot1 + 1, m.bot2 - 1);
  floorLow(bars, m.brk, m.retest - 1, neck + 20);
  setBar(bars, m.retest, bars[m.retest].open, bars[m.retest].open + 60, neck - 50, neck + 70);
  setBar(bars, m.decision, neck + 70, neck + 330, neck + 40, neck + 300);
  const plan = buyPlan(bars[m.decision].close, bars[m.retest].low);
  return {
    key: "sc-double-bottom",
    bars,
    decision: "buy",
    plan,
    trendline: line,
    facts: { neck, bot1: bars[m.bot1].low, bot2: bars[m.bot2].low, bot1Index: m.bot1, bot2Index: m.bot2, brkIndex: m.brk, retestIndex: m.retest },
    reveal: merge(
      {
        levels: [
          { price: 63520, label: "Support (two held lows)", tone: "demand" },
          { price: neck, label: "Neckline: resistance → support", tone: "neutral" },
        ],
        trendlines: [line],
        points: [
          { index: m.bot1, price: bars[m.bot1].low, label: "Bottom 1", tone: "demand" },
          { index: m.bot2, price: bars[m.bot2].low, label: "Bottom 2", tone: "demand" },
          { index: m.retest, price: bars[m.retest].low, label: "Retest", tone: "neutral" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Head and shoulders → sell on the neckline retest ----------
function headShoulders(): ScenarioChart {
  const { bars, marks: m } = walk(62500, [
    { to: 63000, bars: 6 },
    { to: 64000, bars: 8, mark: "ls" },
    { to: 63300, bars: 5, mark: "n1" },
    { to: 64700, bars: 7, mark: "head" },
    { to: 63350, bars: 6, mark: "n2" },
    { to: 64000, bars: 6, mark: "rs" },
    { to: 63150, bars: 6, mark: "brk" },
    { to: 63320, bars: 3, mark: "retest" },
    { to: 63150, bars: 1, mark: "decision" },
  ], 37);
  capHigh(bars, 0, m.n1, 64060, [m.ls]);
  capHigh(bars, m.n2, m.decision, 64060, [m.rs]);
  setBar(bars, m.ls, 63950, 64080, 63900, 63990);
  setBar(bars, m.head, 64600, 64780, 64550, 64650);
  setBar(bars, m.rs, 63960, 64070, 63900, 63970);
  floorLow(bars, m.ls + 1, m.rs, 63300, [m.n1, m.n2]);
  setBar(bars, m.n1, 63380, 63420, 63280, 63360);
  setBar(bars, m.n2, 63390, 63430, 63300, 63380);
  const neckAt = (i: number) => 63280 + ((63300 - 63280) * (i - m.n1)) / (m.n2 - m.n1);
  const line: ChartTrendline = { from: { index: m.n1, price: 63280 }, to: { index: m.n2, price: 63300 }, label: "Neckline", tone: "neutral", extend: true };
  capHigh(bars, m.brk, m.retest - 1, (i) => r5(neckAt(i) - 20));
  const n = r5(neckAt(m.retest));
  setBar(bars, m.retest, bars[m.retest].open, n + 40, bars[m.retest].open - 60, n - 60);
  setBar(bars, m.decision, n - 60, n - 30, n - 330, n - 300);
  const plan = sellPlan(bars[m.decision].close, bars[m.retest].high);
  return {
    key: "sc-head-shoulders",
    bars,
    decision: "sell",
    plan,
    trendline: line,
    facts: { leftShoulder: bars[m.ls].high, head: bars[m.head].high, rightShoulder: bars[m.rs].high, neck: n, lsIndex: m.ls, headIndex: m.head, rsIndex: m.rs, brkIndex: m.brk, n1Index: m.n1, n2Index: m.n2 },
    reveal: merge(
      {
        trendlines: [line],
        points: [
          { index: m.ls, price: bars[m.ls].high, label: "Left shoulder", tone: "supply" },
          { index: m.head, price: bars[m.head].high, label: "Head", tone: "supply" },
          { index: m.rs, price: bars[m.rs].high, label: "Right shoulder", tone: "supply" },
          { index: m.retest, price: bars[m.retest].high, label: "Retest", tone: "neutral" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Inverse head and shoulders → buy on the neckline retest ----------
function inverseHeadShoulders(): ScenarioChart {
  const { bars, marks: m } = walk(65500, [
    { to: 65000, bars: 6 },
    { to: 64000, bars: 8, mark: "ls" },
    { to: 64700, bars: 5, mark: "n1" },
    { to: 63300, bars: 7, mark: "head" },
    { to: 64650, bars: 6, mark: "n2" },
    { to: 64000, bars: 6, mark: "rs" },
    { to: 64900, bars: 6, mark: "brk" },
    { to: 64720, bars: 3, mark: "retest" },
    { to: 64900, bars: 1, mark: "decision" },
  ], 41);
  floorLow(bars, 0, m.n1, 63940, [m.ls]);
  floorLow(bars, m.n2, m.decision, 63940, [m.rs]);
  setBar(bars, m.ls, 64050, 64100, 63920, 64010);
  setBar(bars, m.head, 63400, 63450, 63220, 63350);
  setBar(bars, m.rs, 64040, 64100, 63930, 64030);
  capHigh(bars, m.ls + 1, m.rs, 64700, [m.n1, m.n2]);
  setBar(bars, m.n1, 64620, 64720, 64580, 64640);
  setBar(bars, m.n2, 64600, 64700, 64560, 64620);
  const neckAt = (i: number) => 64720 + ((64700 - 64720) * (i - m.n1)) / (m.n2 - m.n1);
  const line: ChartTrendline = { from: { index: m.n1, price: 64720 }, to: { index: m.n2, price: 64700 }, label: "Neckline", tone: "neutral", extend: true };
  floorLow(bars, m.brk, m.retest - 1, (i) => r5(neckAt(i) + 20));
  const n = r5(neckAt(m.retest));
  setBar(bars, m.retest, bars[m.retest].open, bars[m.retest].open + 60, n - 40, n + 60);
  setBar(bars, m.decision, n + 60, n + 330, n + 30, n + 300);
  const plan = buyPlan(bars[m.decision].close, bars[m.retest].low);
  return {
    key: "sc-inverse-head-shoulders",
    bars,
    decision: "buy",
    plan,
    trendline: line,
    facts: { leftShoulder: bars[m.ls].low, head: bars[m.head].low, rightShoulder: bars[m.rs].low, neck: n, lsIndex: m.ls, headIndex: m.head, rsIndex: m.rs, brkIndex: m.brk, n1Index: m.n1, n2Index: m.n2 },
    reveal: merge(
      {
        trendlines: [line],
        points: [
          { index: m.ls, price: bars[m.ls].low, label: "Left shoulder", tone: "demand" },
          { index: m.head, price: bars[m.head].low, label: "Head", tone: "demand" },
          { index: m.rs, price: bars[m.rs].low, label: "Right shoulder", tone: "demand" },
          { index: m.retest, price: bars[m.retest].low, label: "Retest", tone: "neutral" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Rising trendline break → sell the failed retest ----------
function trendlineBreak(): ScenarioChart {
  const { bars, marks: m } = walk(62000, [
    { to: 62300, bars: 6, mark: "t0" },
    { to: 63000, bars: 6 },
    { to: 62800, bars: 4, mark: "t1" },
    { to: 63600, bars: 6 },
    { to: 63350, bars: 4, mark: "t2" },
    { to: 64200, bars: 6, mark: "peak" },
    { to: 63500, bars: 6, mark: "brk" },
    { to: 63750, bars: 3, mark: "retest" },
    { to: 63550, bars: 1, mark: "decision" },
  ], 53);
  // Touches are small bullish rejection candles so the next bar opens above the line.
  setBar(bars, m.t1, 62860, 62900, 62780, 62895);
  setBar(bars, m.t2, 63400, 63450, 63330, 63445);
  const line: ChartTrendline = { from: { index: m.t1, price: bars[m.t1].low }, to: { index: m.t2, price: bars[m.t2].low }, label: "Rising trendline", tone: "neutral", extend: true };
  floorLow(bars, m.t1, m.peak, (i) => r5(trendlinePriceAt(line, i)), [m.t1, m.t2]);
  const at = (i: number) => r5(trendlinePriceAt(line, i));
  capHigh(bars, m.brk, m.retest - 1, (i) => at(i) - 20);
  setBar(bars, m.brk, bars[m.brk].open, bars[m.brk].open + 30, at(m.brk) - 250, at(m.brk) - 200);
  setBar(bars, m.retest, bars[m.retest].open, at(m.retest) + 30, bars[m.retest].open - 50, at(m.retest) - 80);
  setBar(bars, m.decision, at(m.retest) - 80, at(m.retest) - 50, at(m.retest) - 380, at(m.retest) - 350);
  const plan = sellPlan(bars[m.decision].close, bars[m.retest].high);
  return {
    key: "sc-trendline-break",
    bars,
    decision: "sell",
    plan,
    trendline: line,
    facts: { t1Index: m.t1, t2Index: m.t2, brkIndex: m.brk, retestIndex: m.retest, peakIndex: m.peak },
    reveal: merge(
      {
        trendlines: [line],
        points: [
          { index: m.t1, price: bars[m.t1].low, label: "Touch", tone: "demand" },
          { index: m.t2, price: bars[m.t2].low, label: "Touch", tone: "demand" },
          { index: m.brk, price: bars[m.brk].low, label: "Break", tone: "supply" },
          { index: m.retest, price: bars[m.retest].high, label: "Retest fails", tone: "supply" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Resistance breakout and retest → buy ----------
function breakoutRetest(): ScenarioChart {
  const R = 64000;
  const { bars, marks: m } = walk(63000, [
    { to: 63900, bars: 7, mark: "r1" },
    { to: 63300, bars: 5 },
    { to: 63920, bars: 5, mark: "r2" },
    { to: 63350, bars: 5 },
    { to: 63900, bars: 5, mark: "r3" },
    { to: 63500, bars: 4 },
    { to: 64550, bars: 6, mark: "brk" },
    { to: 64100, bars: 4, mark: "retest" },
    { to: 64350, bars: 1, mark: "decision" },
  ], 67);
  capHigh(bars, 0, m.r3 + 4, R, []);
  for (const i of [m.r1, m.r2, m.r3]) setBar(bars, i, bars[i].open, R, Math.min(bars[i].open, R - 120) - 40, R - 110);
  floorLow(bars, m.brk - 1, m.retest - 1, R + 30);
  setBar(bars, m.retest, bars[m.retest].open, bars[m.retest].open + 40, R + 15, R + 90);
  setBar(bars, m.decision, R + 90, R + 420, R + 40, R + 380);
  const plan = buyPlan(bars[m.decision].close, bars[m.retest].low);
  return {
    key: "sc-breakout-retest",
    bars,
    decision: "buy",
    plan,
    facts: { level: R, r1Index: m.r1, r2Index: m.r2, r3Index: m.r3, brkIndex: m.brk, retestIndex: m.retest },
    reveal: merge(
      {
        levels: [{ price: R, label: "Old resistance → new support", tone: "neutral" }],
        points: [
          { index: m.brk, price: bars[m.brk].high, label: "Breakout", tone: "demand" },
          { index: m.retest, price: bars[m.retest].low, label: "Retest holds", tone: "demand" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Support breakdown and retest → sell ----------
function breakdownRetest(): ScenarioChart {
  const S = 64000;
  const { bars, marks: m } = walk(65000, [
    { to: 64100, bars: 7, mark: "s1" },
    { to: 64700, bars: 5 },
    { to: 64080, bars: 5, mark: "s2" },
    { to: 64650, bars: 5 },
    { to: 64100, bars: 5, mark: "s3" },
    { to: 64500, bars: 4 },
    { to: 63450, bars: 6, mark: "brk" },
    { to: 63900, bars: 4, mark: "retest" },
    { to: 63650, bars: 1, mark: "decision" },
  ], 71);
  floorLow(bars, 0, m.s3 + 4, S, []);
  for (const i of [m.s1, m.s2, m.s3]) setBar(bars, i, bars[i].open, Math.max(bars[i].open, S + 120) + 40, S, S + 110);
  capHigh(bars, m.brk - 1, m.retest - 1, S - 30);
  setBar(bars, m.retest, bars[m.retest].open, S - 15, bars[m.retest].open - 40, S - 90);
  setBar(bars, m.decision, S - 90, S - 40, S - 420, S - 380);
  const plan = sellPlan(bars[m.decision].close, bars[m.retest].high);
  return {
    key: "sc-breakdown-retest",
    bars,
    decision: "sell",
    plan,
    facts: { level: S, s1Index: m.s1, s2Index: m.s2, s3Index: m.s3, brkIndex: m.brk, retestIndex: m.retest },
    reveal: merge(
      {
        levels: [{ price: S, label: "Old support → new resistance", tone: "neutral" }],
        points: [
          { index: m.brk, price: bars[m.brk].low, label: "Breakdown", tone: "supply" },
          { index: m.retest, price: bars[m.retest].high, label: "Retest fails", tone: "supply" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Fresh demand zone retest → buy ----------
function demandZone(): ScenarioChart {
  const { bars, marks: m } = walk(65200, [
    { to: 65700, bars: 10 },
    { to: 64300, bars: 10, mark: "pre" },
    { to: 64260, bars: 1, mark: "base" },
    { to: 65100, bars: 1, mark: "imp" },
    { to: 65500, bars: 8 },
    { to: 64900, bars: 5 },
    { to: 64420, bars: 7, mark: "ret" },
    { to: 64650, bars: 1, mark: "decision" },
  ], 83);
  setBar(bars, m.base, 64300, 64360, 64180, 64260);
  setBar(bars, m.imp, 64260, 65150, 64240, 65100);
  const top = 64300;
  const bottom = 64180;
  floorLow(bars, m.imp + 1, m.ret - 1, top + 40);
  setBar(bars, m.ret, bars[m.ret].open, bars[m.ret].open + 40, 64220, 64390);
  setBar(bars, m.decision, 64390, 64700, 64230, 64650);
  const plan = buyPlan(bars[m.decision].close, bottom);
  return {
    key: "sc-demand-zone",
    bars,
    decision: "buy",
    plan,
    facts: { zoneTop: top, zoneBottom: bottom, baseIndex: m.base, impulseIndex: m.imp, returnIndex: m.ret },
    reveal: merge(
      {
        zones: [{ fromIndex: m.base, toIndex: m.decision - 1, top, bottom, label: "Demand zone (fresh)", tone: "demand" }],
        points: [
          { index: m.base, price: bars[m.base].low, label: "Base", tone: "demand" },
          { index: m.imp, price: bars[m.imp].high, label: "Big-body rally", tone: "demand" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Fresh supply zone retest → sell ----------
function supplyZone(): ScenarioChart {
  const { bars, marks: m } = walk(63000, [
    { to: 62550, bars: 10 },
    { to: 63900, bars: 10, mark: "pre" },
    { to: 63930, bars: 1, mark: "base" },
    { to: 63100, bars: 1, mark: "imp" },
    { to: 62700, bars: 8 },
    { to: 63200, bars: 5 },
    { to: 63780, bars: 7, mark: "ret" },
    { to: 63500, bars: 1, mark: "decision" },
  ], 89);
  setBar(bars, m.base, 63900, 64020, 63840, 63930);
  setBar(bars, m.imp, 63930, 63950, 63050, 63100);
  const top = 64020;
  const bottom = 63900;
  capHigh(bars, m.imp + 1, m.ret - 1, bottom - 40);
  setBar(bars, m.ret, bars[m.ret].open, 63980, bars[m.ret].open - 40, 63810);
  setBar(bars, m.decision, 63810, 63990, 63480, 63500);
  const plan = sellPlan(bars[m.decision].close, top);
  return {
    key: "sc-supply-zone",
    bars,
    decision: "sell",
    plan,
    facts: { zoneTop: top, zoneBottom: bottom, baseIndex: m.base, impulseIndex: m.imp, returnIndex: m.ret },
    reveal: merge(
      {
        zones: [{ fromIndex: m.base, toIndex: m.decision - 1, top, bottom, label: "Supply zone (fresh)", tone: "supply" }],
        points: [
          { index: m.base, price: bars[m.base].high, label: "Base", tone: "supply" },
          { index: m.imp, price: bars[m.imp].low, label: "Big-body drop", tone: "supply" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Demand zone broken, retested from below (zone flip) → sell ----------
function zoneFlip(): ScenarioChart {
  const { bars, marks: m } = walk(65000, [
    { to: 65500, bars: 6 },
    { to: 64300, bars: 8 },
    { to: 64260, bars: 1, mark: "base" },
    { to: 65000, bars: 1, mark: "imp" },
    { to: 65300, bars: 6 },
    { to: 64500, bars: 6, mark: "test1" },
    { to: 64800, bars: 5 },
    { to: 63600, bars: 1, mark: "brk" },
    { to: 63400, bars: 4 },
    { to: 64150, bars: 6, mark: "ret" },
    { to: 63950, bars: 1, mark: "decision" },
  ], 97);
  const top = 64320;
  const bottom = 64200;
  setBar(bars, m.base, 64320, 64380, 64200, 64260);
  setBar(bars, m.imp, 64260, 65050, 64240, 65000);
  floorLow(bars, m.imp + 1, m.brk - 1, top + 30, [m.test1]);
  setBar(bars, m.test1, bars[m.test1].open, bars[m.test1].open + 40, top - 30, top + 120);
  setBar(bars, m.brk, 64650, 64680, 63560, 63600);
  capHigh(bars, m.brk + 1, m.ret - 1, bottom - 50);
  setBar(bars, m.ret, bars[m.ret].open, top - 10, bars[m.ret].open - 40, 64180);
  setBar(bars, m.decision, 64180, 64300, 63920, 63950);
  const plan = sellPlan(bars[m.decision].close, top);
  return {
    key: "sc-zone-flip",
    bars,
    decision: "sell",
    plan,
    facts: { zoneTop: top, zoneBottom: bottom, baseIndex: m.base, impulseIndex: m.imp, breakIndex: m.brk, returnIndex: m.ret, test1Index: m.test1 },
    reveal: merge(
      {
        zones: [
          { fromIndex: m.base, toIndex: m.brk, top, bottom, label: "Demand zone (tested, then broken)", tone: "demand" },
          { fromIndex: m.brk, toIndex: m.decision - 1, top, bottom, label: "Flipped: now supply", tone: "supply" },
        ],
        points: [
          { index: m.test1, price: bars[m.test1].low, label: "Test", tone: "demand" },
          { index: m.brk, price: bars[m.brk].low, label: "Big-body break", tone: "supply" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Middle of a range → wait ----------
function rangeMiddle(): ScenarioChart {
  const { bars, marks: m } = walk(64000, [
    { to: 64420, bars: 6 },
    { to: 63580, bars: 6 },
    { to: 64430, bars: 6 },
    { to: 63570, bars: 6 },
    { to: 64400, bars: 6 },
    { to: 63650, bars: 6 },
    { to: 64000, bars: 4, mark: "decision" },
  ], 101);
  capHigh(bars, 0, m.decision, 64500);
  floorLow(bars, 0, m.decision, 63500);
  setBar(bars, m.decision, 63990, 64150, 63860, 64020);
  return {
    key: "sc-range-middle",
    bars,
    decision: "wait",
    facts: { rangeTop: 64500, rangeBottom: 63500 },
    reveal: {
      levels: [
        { price: 64500, label: "Range top (resistance)", tone: "supply" },
        { price: 63500, label: "Range bottom (support)", tone: "demand" },
      ],
      zones: [{ fromIndex: m.decision, top: 64150, bottom: 63850, label: "No edge: middle of the range", tone: "neutral" }],
    },
  };
}

// ---------- Double top forming, neckline not broken → wait ----------
function doubleTopUnconfirmed(): ScenarioChart {
  const { bars, marks: m } = walk(62300, [
    { to: 62500, bars: 8 },
    { to: 63350, bars: 8 },
    { to: 62850, bars: 5 },
    { to: 64450, bars: 9, mark: "top1" },
    { to: 63650, bars: 6, mark: "neck" },
    { to: 64420, bars: 6, mark: "top2" },
    { to: 63950, bars: 4, mark: "decision" },
  ], 113);
  capHigh(bars, 0, m.decision, 64380, [m.top1, m.top2]);
  setBar(bars, m.top1, 64310, 64560, 64260, 64430);
  setBar(bars, m.top2, 64320, 64550, 64280, 64390);
  const neck = minLow(bars, m.top1 + 1, m.top2 - 1);
  floorLow(bars, m.top2 + 1, m.decision, neck + 150);
  return {
    key: "sc-double-top-unconfirmed",
    bars,
    decision: "wait",
    facts: { neck, top1Index: m.top1, top2Index: m.top2 },
    reveal: {
      levels: [
        { price: 64560, label: "Resistance (two tops)", tone: "supply" },
        { price: neck, label: "Neckline: not broken yet", tone: "neutral" },
      ],
      points: [
        { index: m.top1, price: bars[m.top1].high, label: "Top 1", tone: "supply" },
        { index: m.top2, price: bars[m.top2].high, label: "Top 2", tone: "supply" },
      ],
    },
  };
}

// ---------- Big red body driving into demand, no rejection → wait ----------
function demandUnderPressure(): ScenarioChart {
  const { bars, marks: m } = walk(65000, [
    { to: 65500, bars: 12 },
    { to: 64300, bars: 9 },
    { to: 64250, bars: 1, mark: "base" },
    { to: 65050, bars: 1, mark: "imp" },
    { to: 65400, bars: 7 },
    { to: 64900, bars: 6 },
    { to: 64550, bars: 5, mark: "pre" },
    { to: 64240, bars: 1, mark: "decision" },
  ], 127);
  const top = 64310;
  const bottom = 64190;
  setBar(bars, m.base, 64310, 64370, 64190, 64250);
  setBar(bars, m.imp, 64250, 65100, 64230, 65050);
  floorLow(bars, m.imp + 1, m.decision - 1, top + 60);
  setBar(bars, m.decision, 64620, 64640, 64205, 64220);
  return {
    key: "sc-demand-under-pressure",
    bars,
    decision: "wait",
    facts: { zoneTop: top, zoneBottom: bottom, baseIndex: m.base, impulseIndex: m.imp },
    reveal: {
      zones: [{ fromIndex: m.base, top, bottom, label: "Demand zone: no reaction yet", tone: "demand" }],
      points: [{ index: m.decision, price: bars[m.decision].low, label: "Big red body into the zone", tone: "supply" }],
    },
  };
}

// ---------- Triple top → sell on the neckline retest ----------
function tripleTop(): ScenarioChart {
  const { bars, marks: m } = walk(62300, [
    { to: 62500, bars: 6 },
    { to: 63300, bars: 7 },
    { to: 62900, bars: 4 },
    { to: 64450, bars: 8, mark: "top1" },
    { to: 63650, bars: 5, mark: "v1" },
    { to: 64430, bars: 5, mark: "top2" },
    { to: 63680, bars: 5, mark: "v2" },
    { to: 64420, bars: 5, mark: "top3" },
    { to: 63400, bars: 6, mark: "brk" },
    { to: 63620, bars: 3, mark: "retest" },
    { to: 63430, bars: 1, mark: "decision" },
  ], 211);
  capHigh(bars, 0, m.decision, 64380, [m.top1, m.top2, m.top3]);
  setBar(bars, m.top1, 64300, 64560, 64250, 64420);
  setBar(bars, m.top2, 64330, 64545, 64280, 64400);
  setBar(bars, m.top3, 64320, 64550, 64270, 64390);
  const neck = minLow(bars, m.top1 + 1, m.top3 - 1);
  capHigh(bars, m.brk, m.retest - 1, neck - 20);
  setBar(bars, m.retest, bars[m.retest].open, neck + 50, bars[m.retest].open - 60, neck - 70);
  setBar(bars, m.decision, neck - 70, neck - 40, neck - 330, neck - 300);
  const plan = sellPlan(bars[m.decision].close, bars[m.retest].high);
  return {
    key: "sc-triple-top",
    bars,
    decision: "sell",
    plan,
    facts: {
      neck,
      top1Index: m.top1,
      top2Index: m.top2,
      top3Index: m.top3,
      brkIndex: m.brk,
      retestIndex: m.retest,
    },
    reveal: merge(
      {
        levels: [
          { price: 64560, label: "Resistance (three failed tops)", tone: "supply" },
          { price: neck, label: "Neckline: support → resistance", tone: "neutral" },
        ],
        points: [
          { index: m.top1, price: bars[m.top1].high, label: "Top 1", tone: "supply" },
          { index: m.top2, price: bars[m.top2].high, label: "Top 2", tone: "supply" },
          { index: m.top3, price: bars[m.top3].high, label: "Top 3", tone: "supply" },
          { index: m.retest, price: bars[m.retest].high, label: "Retest", tone: "neutral" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Triple bottom → buy on the neckline retest ----------
function tripleBottom(): ScenarioChart {
  const { bars, marks: m } = walk(66000, [
    { to: 65800, bars: 6 },
    { to: 65000, bars: 7 },
    { to: 65400, bars: 4 },
    { to: 63650, bars: 8, mark: "bot1" },
    { to: 64450, bars: 5, mark: "p1" },
    { to: 63680, bars: 5, mark: "bot2" },
    { to: 64430, bars: 5, mark: "p2" },
    { to: 63690, bars: 5, mark: "bot3" },
    { to: 64750, bars: 6, mark: "brk" },
    { to: 64560, bars: 3, mark: "retest" },
    { to: 64760, bars: 1, mark: "decision" },
  ], 223);
  floorLow(bars, 0, m.decision, 63700, [m.bot1, m.bot2, m.bot3]);
  setBar(bars, m.bot1, 63760, 63820, 63520, 63700);
  setBar(bars, m.bot2, 63740, 63800, 63535, 63720);
  setBar(bars, m.bot3, 63750, 63810, 63530, 63730);
  const neck = maxHigh(bars, m.bot1 + 1, m.bot3 - 1);
  floorLow(bars, m.brk, m.retest - 1, neck + 20);
  setBar(bars, m.retest, bars[m.retest].open, bars[m.retest].open + 60, neck - 50, neck + 70);
  setBar(bars, m.decision, neck + 70, neck + 330, neck + 40, neck + 300);
  const plan = buyPlan(bars[m.decision].close, bars[m.retest].low);
  return {
    key: "sc-triple-bottom",
    bars,
    decision: "buy",
    plan,
    facts: {
      neck,
      bot1Index: m.bot1,
      bot2Index: m.bot2,
      bot3Index: m.bot3,
      brkIndex: m.brk,
      retestIndex: m.retest,
    },
    reveal: merge(
      {
        levels: [
          { price: 63520, label: "Support (three held lows)", tone: "demand" },
          { price: neck, label: "Neckline: resistance → support", tone: "neutral" },
        ],
        points: [
          { index: m.bot1, price: bars[m.bot1].low, label: "Bottom 1", tone: "demand" },
          { index: m.bot2, price: bars[m.bot2].low, label: "Bottom 2", tone: "demand" },
          { index: m.bot3, price: bars[m.bot3].low, label: "Bottom 3", tone: "demand" },
          { index: m.retest, price: bars[m.retest].low, label: "Retest", tone: "neutral" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

/**
 * Wedge helper: swings alternate between two converging lines. `rising` = both lines slope up and the
 * lower line is steeper (bearish); otherwise both slope down and the upper line is steeper (bullish).
 */
function wedge(rising: boolean): ScenarioChart {
  const legs: Leg[] = rising
    ? [
        { to: 62900, bars: 8 },
        { to: 62800, bars: 3, mark: "a1" },
        { to: 63700, bars: 5, mark: "b1" },
        { to: 63300, bars: 5, mark: "a2" },
        { to: 64000, bars: 5, mark: "b2" },
        { to: 63830, bars: 5, mark: "a3" },
        { to: 64260, bars: 5, mark: "b3" },
        { to: 64150, bars: 3, mark: "brk" },
        { to: 64000, bars: 1, mark: "decision" },
      ]
    : [
        { to: 65100, bars: 8 },
        { to: 65200, bars: 3, mark: "a1" },
        { to: 64300, bars: 5, mark: "b1" },
        { to: 64700, bars: 5, mark: "a2" },
        { to: 64000, bars: 5, mark: "b2" },
        { to: 64170, bars: 5, mark: "a3" },
        { to: 63740, bars: 5, mark: "b3" },
        { to: 63850, bars: 3, mark: "brk" },
        { to: 64000, bars: 1, mark: "decision" },
      ];
  const { bars, marks: m } = walk(rising ? 62000 : 66000, legs, rising ? 307 : 311, 35, 45);
  // a* = touches of the line the break goes through (lower line if rising, upper if falling); b* = the other line.
  const pin = (i: number, extreme: number, isLow: boolean) =>
    isLow
      ? setBar(bars, i, extreme + 60, extreme + 90, extreme, extreme + 70)
      : setBar(bars, i, extreme - 60, extreme, extreme - 90, extreme - 70);
  const [a1, a2, b1, b2] = rising ? [62800, 63300, 63700, 64000] : [65200, 64700, 64300, 64000];
  pin(m.a1, a1, rising);
  pin(m.a2, a2, rising);
  pin(m.b1, b1, !rising);
  pin(m.b2, b2, !rising);
  const breakLine: ChartTrendline = {
    from: { index: m.a1, price: a1 },
    to: { index: m.a2, price: a2 },
    label: rising ? "Lower line" : "Upper line",
    tone: "neutral",
    extend: true,
  };
  const otherLine: ChartTrendline = {
    from: { index: m.b1, price: b1 },
    to: { index: m.b2, price: b2 },
    label: rising ? "Upper line" : "Lower line",
    tone: "neutral",
    extend: true,
  };
  const at = (t: ChartTrendline, i: number) => r5(trendlinePriceAt(t, i));
  pin(m.a3, at(breakLine, m.a3) + (rising ? 15 : -15), rising);
  pin(m.b3, at(otherLine, m.b3) + (rising ? -15 : 15), !rising);
  const lowerLine = rising ? breakLine : otherLine;
  const upperLine = rising ? otherLine : breakLine;
  const touches = [m.a1, m.a2, m.a3, m.b1, m.b2, m.b3];
  floorLow(bars, m.a1, m.b3, (i) => at(lowerLine, i) + 5, touches);
  capHigh(bars, m.a1, m.b3, (i) => at(upperLine, i) - 5, touches);
  // Drift toward the line, close through it, then one confirming candle.
  const brk = m.brk;
  for (let i = m.b3 + 1; i < brk; i++) {
    const target = rising ? at(lowerLine, i) + 40 : at(upperLine, i) - 40;
    const o = bars[i - 1].close;
    setBar(bars, i, o, Math.max(o, target) + 30, Math.min(o, target) - 30, target);
  }
  const lineAtBrk = rising ? at(lowerLine, brk) : at(upperLine, brk);
  const brkClose = rising ? lineAtBrk - 120 : lineAtBrk + 120;
  const bo = bars[brk - 1].close;
  setBar(bars, brk, bo, Math.max(bo, brkClose) + 25, Math.min(bo, brkClose) - 25, brkClose);
  const decClose = rising ? brkClose - 230 : brkClose + 230;
  setBar(bars, m.decision, brkClose, Math.max(brkClose, decClose) + 30, Math.min(brkClose, decClose) - 30, decClose);
  const plan = rising
    ? sellPlan(bars[m.decision].close, bars[m.b3].high)
    : buyPlan(bars[m.decision].close, bars[m.b3].low);
  return {
    key: rising ? "sc-rising-wedge" : "sc-falling-wedge",
    bars,
    decision: rising ? "sell" : "buy",
    plan,
    lines: [lowerLine, upperLine],
    facts: {
      a1Index: m.a1,
      a2Index: m.a2,
      a3Index: m.a3,
      b1Index: m.b1,
      b2Index: m.b2,
      b3Index: m.b3,
      brkIndex: brk,
    },
    reveal: merge(
      {
        trendlines: [lowerLine, upperLine],
        points: [
          { index: m.a1, price: a1, label: "Touch", tone: "neutral" },
          { index: m.a2, price: a2, label: "Touch", tone: "neutral" },
          { index: brk, price: brkClose, label: "Break", tone: rising ? "supply" : "demand" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Uptrend pullback to the rising trendline + old swing high → buy (pullback entry) ----------
function pullbackEntry(): ScenarioChart {
  const L1 = 63300;
  const L2 = 63700;
  const { bars, marks: m } = walk(62900, [
    { to: 63750, bars: 6, mark: "h1" },
    { to: L1 + 70, bars: 4, mark: "l1" },
    { to: 64150, bars: 6, mark: "h2" },
    { to: L2 + 70, bars: 4, mark: "l2" },
    { to: 64600, bars: 6, mark: "h3" },
    { to: 64230, bars: 5, mark: "pb" },
    { to: 64420, bars: 1, mark: "decision" },
  ], 401);
  setBar(bars, m.l1, bars[m.l1].open, bars[m.l1].open + 30, L1, L1 + 70);
  setBar(bars, m.l2, bars[m.l2].open, bars[m.l2].open + 30, L2, L2 + 70);
  const line: ChartTrendline = { from: { index: m.l1, price: L1 }, to: { index: m.l2, price: L2 }, label: "Rising trendline (higher lows)", tone: "demand", extend: true };
  const at = (i: number) => r5(trendlinePriceAt(line, i));
  floorLow(bars, m.l1 + 1, m.pb - 1, (i) => at(i) + 40, [m.l2]);
  const pbLow = at(m.pb) + 10;
  setBar(bars, m.pb, bars[m.pb].open, bars[m.pb].open + 30, pbLow, pbLow + 90);
  setBar(bars, m.decision, pbLow + 90, 64460, pbLow + 60, 64420);
  const h2 = maxHigh(bars, m.l1 + 1, m.l2 - 1);
  const plan = buyPlan(bars[m.decision].close, pbLow);
  return {
    key: "sc-pullback-entry",
    bars,
    decision: "buy",
    plan,
    trendline: line,
    facts: { l1: L1, l2: L2, pbLow, h2, l1Index: m.l1, l2Index: m.l2, pbIndex: m.pb },
    reveal: merge(
      {
        trendlines: [line],
        levels: [{ price: h2, label: "Old swing high → support", tone: "neutral" }],
        points: [
          { index: m.l1, price: L1, label: "HL", tone: "demand" },
          { index: m.l2, price: L2, label: "HL", tone: "demand" },
          { index: m.pb, price: pbLow, label: "Pullback holds", tone: "demand" },
        ],
      },
      planAnnotations(plan, m.decision)
    ),
  };
}

// ---------- Breakout long managed with a trailing stop into the planned target (trade management) ----------
function trailingStop(): ScenarioChart {
  const T = 65450;
  const B = 64000;
  const L = [64250, 64600, 64900];
  const { bars, marks: m } = walk(65300, [
    { to: 63750, bars: 8, mark: "drop" },
    { to: 63950, bars: 4 },
    { to: 63680, bars: 4, mark: "baseLow" },
    { to: 63960, bars: 4 },
    { to: 64300, bars: 2, mark: "brk" },
    { to: 64700, bars: 4, mark: "sh1" },
    { to: L[0] + 70, bars: 3, mark: "hl1" },
    { to: 65000, bars: 4, mark: "sh2" },
    { to: L[1] + 70, bars: 3, mark: "hl2" },
    { to: 65250, bars: 4, mark: "sh3" },
    { to: L[2] + 70, bars: 3, mark: "hl3" },
    { to: 65300, bars: 3, mark: "decision" },
  ], 409);
  setBar(bars, 0, 65380, T, 65150, 65200);
  capHigh(bars, 1, m.decision - 1, T - 80);
  capHigh(bars, m.drop + 1, m.brk - 1, B);
  floorLow(bars, m.drop + 1, m.brk - 1, 63600, [m.baseLow]);
  setBar(bars, m.baseLow, bars[m.baseLow].open, bars[m.baseLow].open + 30, 63600, 63680);
  const brkOpen = bars[m.brk - 1].close;
  setBar(bars, m.brk, brkOpen, 64340, brkOpen - 10, 64300);
  // Initial stop: back under the broken level, where the breakout idea fails.
  const baseStop = r5(B - 40);
  const stops = L.map((l) => r5(l - 40));
  const hl = [m.hl1, m.hl2, m.hl3];
  const sh = [m.sh1, m.sh2, m.sh3];
  floorLow(bars, m.brk + 1, m.sh1, L[0] + 30);
  hl.forEach((h, k) => {
    floorLow(bars, sh[k] + 1, h - 1, L[k] + 30);
    setBar(bars, h, bars[h].open, bars[h].open + 30, L[k], L[k] + 70);
    const end = k < 2 ? sh[k + 1] : m.decision - 1;
    floorLow(bars, h + 1, end, L[k] + 40);
  });
  setBar(bars, m.decision, bars[m.decision].open, T - 10, 65180, 65300);
  const entry = bars[m.brk].close;
  const close = bars[m.decision].close;
  const steps = [{ fromIndex: m.brk, price: baseStop }, ...hl.map((h, k) => ({ fromIndex: h + 1, price: stops[k] }))];
  const trail = stops[2];
  return {
    key: "sc-trailing-stop",
    bars,
    // Trade-management chart (Learn only, not in the Buy-or-Sell drill): the decision is to take profit on the long.
    decision: "sell",
    facts: {
      target: T,
      breakLevel: B,
      entry,
      baseStop,
      hl1: L[0],
      hl2: L[1],
      hl3: L[2],
      stop1: stops[0],
      stop2: stops[1],
      stop3: stops[2],
      close,
      brkIndex: m.brk,
      hl1Index: m.hl1,
      hl2Index: m.hl2,
      hl3Index: m.hl3,
    },
    reveal: {
      levels: [
        { price: T, label: "Planned target: old high", tone: "supply" },
        { price: B, label: "Base top (breakout level)", tone: "neutral" },
      ],
      trendlines: stairStepLines(steps, { label: "Trailing stop", tone: "risk" }),
      zones: [
        { fromIndex: m.decision, top: T, bottom: close, label: "Reward left", tone: "reward", labelAt: "top" },
        { fromIndex: m.decision, top: close, bottom: trail, label: "Risk to trailed stop", tone: "risk", labelAt: "bottom" },
      ],
      points: [
        { index: m.brk, price: entry, label: "Entry (breakout)", tone: "entry" },
        ...hl.map((h, k) => ({ index: h, price: L[k], label: `HL ${k + 1}`, tone: "demand" as const })),
      ],
    },
  };
}

// ---------- Breakout long that fails: price tops and closes through the stop (framework step 2) ----------
function stopHit(): ScenarioChart {
  const B = 52000;
  const { bars, marks: m } = walk(50900, [
    { to: 51300, bars: 7 },
    { to: 51950, bars: 4, mark: "r1" },
    { to: 51500, bars: 4, mark: "b1" },
    { to: 51950, bars: 4, mark: "r2" },
    { to: 51600, bars: 3, mark: "b2" },
    { to: 51900, bars: 3 },
    { to: 52150, bars: 1, mark: "brk" },
    { to: 52650, bars: 6, mark: "top" },
    { to: 52000, bars: 5 },
    { to: 51650, bars: 1, mark: "decision" },
  ], 503);
  capHigh(bars, 0, m.brk - 1, B, [m.r1, m.r2]);
  for (const i of [m.r1, m.r2]) setBar(bars, i, bars[i].open, B, Math.min(bars[i].open, B - 140) - 30, B - 110);
  floorLow(bars, m.r1 + 1, m.brk - 1, 51400);
  const brkOpen = bars[m.brk - 1].close;
  setBar(bars, m.brk, brkOpen, B + 190, brkOpen - 20, B + 150);
  const entry = B + 150;
  // Stop at invalidation: back inside the base, under the breakout candle.
  const stop = r5(Math.min(bars[m.brk].low, B) - 60);
  const target = entry + 2 * (entry - stop);
  const topHigh = r5(entry + (target - entry) * 0.55);
  capHigh(bars, m.brk + 1, m.decision, topHigh - 40, [m.top]);
  floorLow(bars, m.brk + 1, m.decision - 1, stop + 40);
  setBar(bars, m.top, topHigh - 90, topHigh, topHigh - 170, topHigh - 140);
  const decOpen = bars[m.decision - 1].close;
  setBar(bars, m.decision, decOpen, decOpen + 20, stop - 170, stop - 130);
  const close = stop - 130;
  return {
    key: "sc-stop-hit",
    bars,
    // Framework chart (Learn only, not in the Buy-or-Sell drill): the long's thesis failed, so the decision is to exit.
    decision: "sell",
    plan: { entry, stop, target },
    facts: { breakLevel: B, entry, stop, target, top: topHigh, close, brkIndex: m.brk, topIndex: m.top },
    reveal: {
      levels: [
        { price: B, label: "Base top (breakout level)", tone: "neutral" },
        { price: stop, label: "Stop-loss: thesis invalidated", tone: "risk" },
        { price: target, label: "Planned target (2R), never reached", tone: "reward" },
      ],
      points: [
        { index: m.brk, price: entry, label: "Entry (breakout)", tone: "entry" },
        { index: m.top, price: topHigh, label: "Top", tone: "supply" },
        { index: m.decision, price: close, label: "Close below stop: exit", tone: "risk" },
      ],
    },
  };
}

// ---------- Rally into the planned target zone at the old high, shooting star (framework step 4) ----------
function targetReversal(): ScenarioChart {
  const T = 72450;
  const { bars, marks: m } = walk(71600, [
    { to: 72300, bars: 5, mark: "oldHigh" },
    { to: 71300, bars: 6 },
    { to: 70650, bars: 5, mark: "low" },
    { to: 70950, bars: 4 },
    { to: 70800, bars: 3, mark: "hl" },
    { to: 71050, bars: 2, mark: "entryBar" },
    { to: 71700, bars: 6 },
    { to: 72100, bars: 5 },
    { to: 72230, bars: 1, mark: "decision" },
  ], 547);
  setBar(bars, m.oldHigh, bars[m.oldHigh].open, T, bars[m.oldHigh].open - 40, T - 150);
  const zoneBottom = T - 200;
  capHigh(bars, m.oldHigh + 1, m.decision - 1, zoneBottom - 20);
  capHigh(bars, 0, m.oldHigh - 1, T - 60);
  const low = 70600;
  floorLow(bars, m.oldHigh + 1, m.decision, low, [m.low]);
  setBar(bars, m.low, bars[m.low].open, bars[m.low].open + 30, low, low + 190);
  const hlLow = 70760;
  floorLow(bars, m.low + 1, m.hl - 1, hlLow + 20);
  floorLow(bars, m.hl + 1, m.decision, hlLow + 40);
  setBar(bars, m.hl, bars[m.hl].open, bars[m.hl].open + 30, hlLow, hlLow + 60);
  const eOpen = bars[m.entryBar - 1].close;
  setBar(bars, m.entryBar, eOpen, 71090, Math.min(eOpen, hlLow + 60) - 10, 71060);
  const entry = 71060;
  const stop = r5(hlLow - 60);
  const trail = r5(minLow(bars, m.decision - 6, m.decision - 1) - 40);
  // Shooting star into the zone: small body near the low, long upper wick, high just under the old high.
  const dOpen = bars[m.decision - 1].close;
  setBar(bars, m.decision, dOpen, T - 10, dOpen - 30, dOpen + 30);
  const close = dOpen + 30;
  return {
    key: "sc-target-reversal",
    bars,
    // Framework chart (Learn only): long from the higher low, planned target reached, so the decision is to take profit.
    decision: "sell",
    plan: { entry, stop, target: T },
    facts: { target: T, zoneBottom, entry, stop, trail, close, low, hlLow, entryIndex: m.entryBar, oldHighIndex: m.oldHigh, lowIndex: m.low, hlIndex: m.hl },
    reveal: {
      zones: [
        { fromIndex: m.oldHigh, top: T, bottom: zoneBottom, label: "Profit target zone (old high)", tone: "reward", labelAt: "top" },
        { fromIndex: m.decision, top: close, bottom: trail, label: "Risk to trailed stop", tone: "risk", labelAt: "bottom" },
      ],
      levels: [{ price: stop, label: "First stop (under the higher low)", tone: "risk" }],
      points: [
        { index: m.entryBar, price: entry, label: "Entry (higher low)", tone: "entry" },
        { index: m.decision, price: T - 10, label: "Shooting star at target", tone: "supply" },
      ],
    },
  };
}

const ALL = [
  doubleTop(),
  doubleBottom(),
  headShoulders(),
  inverseHeadShoulders(),
  trendlineBreak(),
  breakoutRetest(),
  breakdownRetest(),
  demandZone(),
  supplyZone(),
  zoneFlip(),
  rangeMiddle(),
  doubleTopUnconfirmed(),
  demandUnderPressure(),
  tripleTop(),
  tripleBottom(),
  wedge(true),
  wedge(false),
  pullbackEntry(),
  trailingStop(),
  stopHit(),
  targetReversal(),
];

/** Empty slots on the right of scenario charts so risk/reward boxes have room. */
export const SCENARIO_PAD_BARS = 8;

export const SCENARIOS: Record<string, ScenarioChart> = Object.fromEntries(ALL.map((s) => [s.key, stitch(s)]));

export const SCENARIO_OHLC: Record<string, OHLC[]> = Object.fromEntries(Object.values(SCENARIOS).map((s) => [s.key, s.bars]));

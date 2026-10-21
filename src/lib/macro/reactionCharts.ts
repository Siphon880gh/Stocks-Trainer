/**
 * Reaction charts (MF4.M3–M4): deterministic SIMULATED intraday 5-minute bars around a release and a 10-day
 * daily view, for any instrument, driven by the transmission rules. Plus validators and reveal annotations.
 */
import type { OHLC } from "../ohlcData";
import type { ChartAnnotations } from "../chartAnnotations";
import type { Direction, Instrument } from "./types";
import { reactionForEvent } from "./reactions";
import type { ReleaseEvent } from "./releases";
import { meetingByMonth } from "./fed";
import { WORLD } from "./world";

export const PRE_BARS = 12;
export const POST_BARS = 30;
export const RELEASE_INDEX = PRE_BARS;
export const INTRADAY_BARS = PRE_BARS + POST_BARS;

/** Final-move size per unit of effective surprise (z), and decimals, per instrument. Yields in percent. */
const UNIT: Record<Instrument, { pct?: number; abs?: number; dp: number }> = {
  index: { pct: 0.35, dp: 2 },
  "growth-tech": { pct: 0.5, dp: 2 },
  "small-caps": { pct: 0.5, dp: 2 },
  homebuilders: { pct: 0.6, dp: 2 },
  reits: { pct: 0.45, dp: 2 },
  utilities: { pct: 0.35, dp: 2 },
  banks: { pct: 0.4, dp: 2 },
  "bond-proxy": { pct: 0.4, dp: 2 },
  dollar: { pct: 0.2, dp: 3 },
  us2y: { abs: 0.06, dp: 3 },
  us10y: { abs: 0.04, dp: 3 },
  mortgage30: { abs: 0.04, dp: 3 },
};

export const MUTED_MAX_UNITS = 0.25;
export const MOVE_MIN_UNITS = 0.55;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Trading day on which a release lands in the simulated calendar. */
export function releaseDay(e: ReleaseEvent): number {
  const last = WORLD.days.length - 1;
  if (e.kind === "fomc") return meetingByMonth(e.month)!.day;
  if (e.week !== undefined) return Math.min(last, e.week * 5 + 3);
  return Math.min(last, (e.month + 1) * 20 + 4);
}

/** Price level of an instrument at the close of a day (yields/dollar from the world; equities a smooth simulated path). */
export function levelAt(instrument: Instrument, day: number): number {
  const d = WORLD.days[Math.max(0, Math.min(WORLD.days.length - 1, day))]!;
  switch (instrument) {
    case "us2y": return d.y2;
    case "us10y": return d.y10;
    case "dollar": return d.dollar;
    case "mortgage30": return WORLD.weeks[Math.floor(day / 5)]!.mortgage30;
    case "index": return 4200 + day * 0.9 + 60 * Math.sin(day / 37);
    default: {
      const base: Record<string, number> = { "growth-tech": 180, "small-caps": 95, homebuilders: 70, reits: 88, utilities: 64, banks: 46, "bond-proxy": 92 };
      return base[instrument]! * (1 + day / 3000 + 0.02 * Math.sin(day / 29 + instrument.length));
    }
  }
}

const unitAbs = (inst: Instrument, level: number) => (UNIT[inst].abs ?? (UNIT[inst].pct! / 100) * level);
const round = (v: number, dp: number) => Math.round(v * 10 ** dp) / 10 ** dp;

function minutesOf(releaseTimeET: string): number {
  const m = /(\d+):(\d+)\s*([ap])\.m\./.exec(releaseTimeET);
  if (!m) return 8 * 60 + 30;
  let h = Number(m[1]);
  if (m[3] === "p" && h !== 12) h += 12;
  return h * 60 + Number(m[2]);
}
const clock = (mins: number) => `${Math.floor(mins / 60) % 24}:${String(mins % 60).padStart(2, "0")}`;

export interface ReactionChart {
  eventId: string;
  instrument: Instrument;
  bars: OHLC[];
  releaseIndex: number;
  releaseLabel: string;
  preClose: number;
  /** Signed final move (close of last bar − pre-release close). */
  net: number;
  unit: number;
  direction: Direction;
  initial: Direction;
  archetype: ReturnType<typeof reactionForEvent>["archetype"];
  magnitude: number;
  dp: number;
}

/** Deterministic intraday 5-minute chart for one event × instrument. */
export function intradayChart(e: ReleaseEvent, instrument: Instrument): ReactionChart {
  const r = reactionForEvent(e);
  const dir = r.moves[instrument];
  const { dp } = UNIT[instrument];
  const day = releaseDay(e);
  const pre0 = levelAt(instrument, day - 1);
  const u = unitAbs(instrument, pre0);
  const rand = rng(hash(`${e.id}:${instrument}`));
  const noise = () => (rand() - 0.5) * 2;
  const sign = dir === "up" ? 1 : dir === "down" ? -1 : 0;
  // Initial (release-bar) direction: reversal → opposite; whipsaw → headline label's direction; else final.
  let initialSign = sign;
  if (r.archetype === "reversal") initialSign = instrument === "index" || instrument === "growth-tech" || instrument === "small-caps" ? -sign : sign;
  if (r.archetype === "whipsaw") {
    const h = reactionForEvent({ ...e, effectiveLabel: e.headline.label, twist: undefined });
    const hd = h.moves[instrument];
    initialSign = hd === "up" ? 1 : hd === "down" ? -1 : 0;
  }
  const targetNet = sign !== 0 ? sign * r.magnitude * u : (rand() < 0.5 ? -1 : 1) * 0.12 * u;
  const closes: number[] = [];
  let p = pre0;
  for (let i = 0; i < PRE_BARS; i++) {
    p += noise() * 0.06 * u;
    closes.push(p);
  }
  const preClose = closes[PRE_BARS - 1]!;
  const kneeJerk = initialSign !== 0 ? initialSign * Math.max(0.6, r.magnitude * (r.archetype === "follow-through" ? 0.6 : 0.5)) * u : targetNet * 0.5;
  closes.push(preClose + kneeJerk);
  const end = preClose + targetNet;
  for (let i = 1; i < POST_BARS; i++) {
    const t = i / (POST_BARS - 1);
    // Ease from the knee-jerk to the final level; reversal/whipsaw cross back within the first ~third.
    const ease = r.archetype === "follow-through" ? t : Math.min(1, t * 2.2);
    const base = preClose + kneeJerk + (targetNet - kneeJerk) * (r.archetype === "follow-through" ? 1 - (1 - ease) ** 2 : ease);
    const wiggle = i === POST_BARS - 1 ? 0 : noise() * 0.11 * u * (1 - t * 0.5);
    closes.push(i === POST_BARS - 1 ? end : base + wiggle);
  }
  const startMin = minutesOf(e.releaseTimeET) - PRE_BARS * 5;
  const bars: OHLC[] = [];
  const preVol = 1000 + Math.floor(rand() * 400);
  for (let i = 0; i < closes.length; i++) {
    const open = i === 0 ? pre0 : closes[i - 1]!;
    const close = closes[i]!;
    const span = i === RELEASE_INDEX ? 0.25 * u : 0.05 * u;
    const high = Math.max(open, close) + Math.abs(noise()) * span + 0.01 * u;
    const low = Math.min(open, close) - Math.abs(noise()) * span - 0.01 * u;
    const vol = i < RELEASE_INDEX ? preVol * (0.8 + rand() * 0.4) : i === RELEASE_INDEX ? preVol * (5 + r.magnitude * 2) : preVol * (1 + 2.5 * Math.exp(-(i - RELEASE_INDEX) / 6)) * (0.85 + rand() * 0.3);
    const ro = round(open, dp), rc = round(close, dp);
    bars.push({ name: clock(startMin + i * 5), open: ro, high: Math.max(round(high, dp), ro, rc), low: Math.min(round(low, dp), ro, rc), close: rc, volume: Math.round(vol) });
  }
  const rp = round(preClose, dp);
  return {
    eventId: e.id,
    instrument,
    bars,
    releaseIndex: RELEASE_INDEX,
    releaseLabel: e.releaseTimeET,
    preClose: rp,
    net: round(bars[bars.length - 1]!.close - rp, dp + 1),
    unit: u,
    direction: dir,
    initial: initialSign > 0 ? "up" : initialSign < 0 ? "down" : "muted",
    archetype: r.archetype,
    magnitude: r.magnitude,
    dp,
  };
}

/** 10-day daily view: five sessions before, the release day (open = prior close, close = intraday close), four after. */
export function dailyChart(e: ReleaseEvent, instrument: Instrument): OHLC[] {
  const ic = intradayChart(e, instrument);
  const day = releaseDay(e);
  const rand = rng(hash(`${e.id}:${instrument}:daily`));
  const u = ic.unit;
  const out: OHLC[] = [];
  let prev = levelAt(instrument, day - 6);
  for (let d = day - 5; d <= day + 4; d++) {
    let open = prev;
    let close: number;
    if (d === day) {
      open = ic.bars[0]!.open;
      close = ic.bars[ic.bars.length - 1]!.close;
    } else if (d < day) {
      close = d === day - 1 ? ic.bars[0]!.open : prev + (rand() - 0.5) * 0.8 * u;
    } else {
      // Drift after the event: half-strength continuation for follow-through, flat otherwise.
      const drift = ic.archetype === "follow-through" && ic.direction !== "muted" ? Math.sign(ic.net) * 0.25 * u : 0;
      close = prev + drift + (rand() - 0.5) * 0.6 * u;
    }
    const hi = d === day ? Math.max(...ic.bars.map((b) => b.high)) : Math.max(open, close) + rand() * 0.3 * u;
    const lo = d === day ? Math.min(...ic.bars.map((b) => b.low)) : Math.min(open, close) - rand() * 0.3 * u;
    const ro = round(open, ic.dp), rc = round(close, ic.dp);
    out.push({ name: d === day ? "Release" : d < day ? `T−${day - d}` : `T+${d - day}`, open: ro, high: Math.max(round(hi, ic.dp), ro, rc), low: Math.min(round(lo, ic.dp), ro, rc), close: rc });
    prev = close;
  }
  return out;
}

export const DAILY_RELEASE_INDEX = 5;

/** Violations for a chart against its expected outcome (empty = valid). */
export function validateReactionChart(c: ReactionChart): string[] {
  const v: string[] = [];
  if (c.bars.length !== INTRADAY_BARS) v.push(`bars ${c.bars.length}`);
  for (const [i, b] of c.bars.entries()) {
    if (!(b.high >= Math.max(b.open, b.close) && b.low <= Math.min(b.open, b.close))) v.push(`bar ${i} invalid OHLC`);
    if (i > 0 && b.open !== c.bars[i - 1]!.close) v.push(`bar ${i} gap`);
  }
  const relMin = minutesOf(c.releaseLabel);
  if (c.bars[c.releaseIndex]!.name !== clock(relMin)) v.push(`release bar at ${c.bars[c.releaseIndex]!.name}, expected ${clock(relMin)}`);
  const units = c.net / c.unit;
  if (c.direction === "muted" && Math.abs(units) > MUTED_MAX_UNITS) v.push(`muted but moved ${units.toFixed(2)}u`);
  if (c.direction === "up" && units < MOVE_MIN_UNITS) v.push(`expected up, net ${units.toFixed(2)}u`);
  if (c.direction === "down" && units > -MOVE_MIN_UNITS) v.push(`expected down, net ${units.toFixed(2)}u`);
  const rb = c.bars[c.releaseIndex]!;
  const rbDir = rb.close > rb.open ? "up" : rb.close < rb.open ? "down" : "muted";
  if (c.initial !== "muted" && rbDir !== c.initial) v.push(`release bar ${rbDir}, expected ${c.initial}`);
  const vols = c.bars.map((b) => b.volume ?? 0);
  const preAvg = vols.slice(0, c.releaseIndex).reduce((a, b) => a + b, 0) / c.releaseIndex;
  if (vols[c.releaseIndex]! < 3 * preAvg) v.push("release volume < 3× pre-release average");
  return v;
}

/** Reveal annotations: release line, pre-release range, pre-release close, outcome point, knee-jerk point for reversals. */
export function revealAnnotations(c: ReactionChart): ChartAnnotations {
  const pre = c.bars.slice(0, c.releaseIndex);
  const top = Math.max(...pre.map((b) => b.high));
  const bottom = Math.min(...pre.map((b) => b.low));
  const last = c.bars.length - 1;
  const isYield = c.instrument === "us2y" || c.instrument === "us10y" || c.instrument === "mortgage30";
  const moveText = isYield ? `${c.net >= 0 ? "+" : "−"}${Math.abs(Math.round(c.net * 100))} bp` : `${c.net >= 0 ? "+" : "−"}${Math.abs((c.net / c.preClose) * 100).toFixed(2)}%`;
  const outcome = c.direction === "muted" ? `Muted (${moveText})` : c.archetype === "reversal" ? `Reversal: ${moveText}` : c.archetype === "whipsaw" ? `Whipsaw: ${moveText}` : `Follow-through: ${moveText}`;
  const a: ChartAnnotations = {
    events: [{ index: c.releaseIndex, label: `${c.releaseLabel} release`, tone: "entry" }],
    zones: [{ fromIndex: 0, toIndex: c.releaseIndex - 1, top, bottom, label: "Pre-release range", tone: "neutral", labelAt: "bottom" }],
    levels: [{ price: c.preClose, label: "Pre-release close", tone: "neutral" }],
    points: [{ index: last, price: c.bars[last]!.close, label: outcome, tone: c.net >= 0 ? "reward" : "risk" }],
  };
  if (c.archetype === "reversal" || c.archetype === "whipsaw") {
    const window = c.bars.slice(c.releaseIndex, c.releaseIndex + 8);
    const pick = c.initial === "up" ? Math.max(...window.map((b) => b.high)) : Math.min(...window.map((b) => b.low));
    const idx = c.releaseIndex + window.findIndex((b) => (c.initial === "up" ? b.high === pick : b.low === pick));
    a.points!.push({ index: idx, price: pick, label: c.initial === "up" ? "Knee-jerk high — faded" : "Knee-jerk low — faded", tone: "supply" });
  }
  return a;
}

/** Instruments the game asks about, in display order. */
export const GAME_INSTRUMENTS: Instrument[] = ["us2y", "dollar", "index"];

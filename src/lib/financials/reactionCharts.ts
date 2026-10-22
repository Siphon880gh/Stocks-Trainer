/**
 * Earnings reaction charts (FE4.M2): ~30 pre-event bars, a report bar that gaps, 15 post bars, with volume.
 * Deterministic: seeded from the event id. Shape comes from the event's archetype + implied move.
 * SAMPLE / STYLIZED price paths, not real tape.
 */
import type { ChartAnnotations } from "../chartAnnotations";
import type { OHLC } from "../ohlcData";
import { resolveEvent, type EarningsEvent, type GapDirection, type ReactionArchetype } from "./earningsEvents";

export const PRE_BARS = 30;
export const POST_BARS = 15;
export const EVENT_INDEX = PRE_BARS;
/** Bars allowed for a gap-fill to touch the prior close. */
export const FILL_WITHIN_BARS = 8;
export const RUN_UP_WINDOW = 10;

const BASE_VOLUME: Record<string, number> = {
  "northwind-cloud": 2_400_000,
  "harbor-pine": 3_800_000,
  "ironbridge-industrial": 1_100_000,
  "bayline-bancorp": 2_000_000,
  "kestrel-bio": 3_200_000,
};

export interface ReactionChart {
  eventId: string;
  archetype: ReactionArchetype;
  direction: GapDirection;
  bars: OHLC[];
  eventIndex: number;
  priorClose: number;
  /** Event-bar open vs prior close, as a fraction. */
  gap: number;
  impliedMove: number;
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

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

const cents = (n: number) => Math.round(n * 100) / 100;
const barName = (i: number) => (i === EVENT_INDEX ? "Report" : i < EVENT_INDEX ? `T-${EVENT_INDEX - i}` : `T+${i - EVENT_INDEX}`);

/** Close-to-close path (fractions) for the post-event bars, given the event-bar close. */
function postPath(arch: ReactionArchetype, d: number, implied: number, eventClose: number, prior: number, rnd: () => number): number[] {
  const noise = (amp: number) => (rnd() * 2 - 1) * amp;
  const closes: number[] = [];
  let c = eventClose;
  for (let k = 1; k <= POST_BARS; k++) {
    let next: number;
    switch (arch) {
      case "gap-and-go":
        next = c * (1 + d * 0.003 + noise(0.004));
        // never fill: stay clearly beyond the prior close
        next = d > 0 ? Math.max(next, prior * (1 + implied * 0.6)) : Math.min(next, prior * (1 - implied * 0.6));
        break;
      case "pead-drift":
        next = c * (1 + d * implied * 0.07 + noise(0.003));
        break;
      case "gap-fill": {
        const fillBy = 4;
        if (k <= fillBy) {
          const target = prior * (1 - d * 0.004);
          next = c + (target - c) / (fillBy - k + 1);
        } else next = prior * (1 + noise(0.006));
        break;
      }
      case "sell-the-news":
        next = k <= 8 ? c * (1 - 0.006 + noise(0.003)) : c * (1 + noise(0.005));
        break;
      case "guidance-reversal":
        next = k <= 10 ? c * (1 - 0.007 + noise(0.003)) : c * (1 + noise(0.004));
        break;
      case "muted":
        next = prior * (1 + noise(implied * 0.35));
        break;
    }
    closes.push(next);
    c = next;
  }
  return closes;
}

export function generateReaction(event: EarningsEvent): ReactionChart {
  const r = resolveEvent(event);
  const rnd = mulberry32(hashSeed(event.id));
  const noise = (amp: number) => (rnd() * 2 - 1) * amp;
  const implied = event.expect.impliedMovePct / 100;
  const d = r.direction === "up" ? 1 : -1;
  const prior = event.priorClose;
  const arch = event.reaction;

  // Pre-event closes: flat-ish walk for 20 bars, then the run-up over the last 10 (exact by construction).
  const rets: number[] = [];
  for (let i = 1; i < PRE_BARS; i++) rets.push(i < PRE_BARS - RUN_UP_WINDOW ? noise(0.008) : 0);
  const runUp = event.expect.runUpPct / 100;
  const perBar = Math.pow(1 + runUp, 1 / RUN_UP_WINDOW) - 1;
  const wiggle = Array.from({ length: RUN_UP_WINDOW }, () => noise(0.004));
  const meanWiggle = wiggle.reduce((a, b) => a + b, 0) / RUN_UP_WINDOW;
  for (let j = 0; j < RUN_UP_WINDOW; j++) rets[PRE_BARS - RUN_UP_WINDOW - 1 + j] = perBar + wiggle[j]! - meanWiggle;
  const rel = [1];
  for (const x of rets) rel.push(rel[rel.length - 1]! * (1 + x));
  const scale = prior / rel[rel.length - 1]!;
  const preCloses = rel.map((x) => x * scale);

  // Report bar.
  const gapMag = arch === "muted" ? 0.35 + rnd() * 0.2 : 1.05 + rnd() * 0.35;
  const gap = d * gapMag * implied;
  const eventOpen = prior * (1 + gap);
  let eventClose: number;
  switch (arch) {
    case "gap-and-go":
      eventClose = eventOpen * (1 + d * implied * 0.35);
      break;
    case "pead-drift":
      eventClose = eventOpen * (1 + d * implied * 0.25);
      break;
    case "gap-fill":
      eventClose = eventOpen - (eventOpen - prior) * 0.3;
      break;
    case "sell-the-news":
      eventClose = eventOpen - (eventOpen - prior) * 0.6;
      break;
    case "guidance-reversal":
      eventClose = prior * (1 - implied * 0.3);
      break;
    case "muted":
      eventClose = eventOpen * (1 + noise(implied * 0.15));
      break;
  }
  const postCloses = postPath(arch, d, implied, eventClose, prior, rnd);

  // Assemble bars: opens = previous close except at the report bar.
  const closes = [...preCloses, eventClose, ...postCloses].map(cents);
  const baseVol = BASE_VOLUME[event.companyId] ?? 1_500_000;
  const bars: OHLC[] = [];
  for (let i = 0; i < closes.length; i++) {
    const open = i === 0 ? cents(closes[0]! * (1 - noise(0.004) - 0.001)) : i === EVENT_INDEX ? cents(eventOpen) : bars[i - 1]!.close;
    let close = closes[i]!;
    if (close === open) close = cents(close + (rnd() < 0.5 ? 0.01 : -0.01));
    const ref = Math.max(open, close);
    const wickUp = ref * (0.0015 + rnd() * 0.006);
    const wickDn = ref * (0.0015 + rnd() * 0.006);
    let high = cents(Math.max(open, close) + wickUp);
    let low = cents(Math.min(open, close) - wickDn);
    if (arch === "gap-and-go" && i >= EVENT_INDEX) {
      // keep the gap open on every bar after the report
      if (d > 0) low = Math.max(low, cents(prior * (1 + implied * 0.3)));
      else high = Math.min(high, cents(prior * (1 - implied * 0.3)));
      low = Math.min(low, Math.min(open, close));
      high = Math.max(high, Math.max(open, close));
    }
    if (arch === "muted" && i === EVENT_INDEX) {
      high = Math.min(high, cents(prior * (1 + implied * 0.95)));
      low = Math.max(low, cents(prior * (1 - implied * 0.95)));
      high = Math.max(high, Math.max(open, close) + 0.01);
      low = Math.min(low, Math.min(open, close) - 0.01);
    }
    if (high <= low) high = cents(low + 0.02);
    let volFactor: number;
    if (i < EVENT_INDEX) volFactor = 0.85 + rnd() * 0.3 + (i >= EVENT_INDEX - 5 ? 0.15 : 0);
    else if (i === EVENT_INDEX) volFactor = 4.2 + rnd() * 1.6;
    else volFactor = Math.max(1.05, 2.6 * Math.pow(0.78, i - EVENT_INDEX - 1)) + rnd() * 0.2;
    bars.push({ name: barName(i), open, high, low, close, volume: Math.round(baseVol * volFactor) });
  }
  return { eventId: event.id, archetype: arch, direction: r.direction, bars, eventIndex: EVENT_INDEX, priorClose: prior, gap, impliedMove: implied };
}

/** Rules every reaction chart must satisfy (FE4.M2 validators). Returns violations. */
export function reactionViolations(rc: ReactionChart, event: EarningsEvent): string[] {
  const v: string[] = [];
  const b = rc.bars;
  const e = rc.eventIndex;
  const id = rc.eventId;
  const prior = b[e - 1]!.close;
  const implied = event.expect.impliedMovePct / 100;
  const d = rc.direction === "up" ? 1 : -1;
  if (b.length !== PRE_BARS + 1 + POST_BARS) v.push(`${id}: expected ${PRE_BARS + 1 + POST_BARS} bars`);
  if (prior !== event.priorClose) v.push(`${id}: bar before the report must close at the event's prior close`);
  b.forEach((x, i) => {
    if (!(x.high > x.low)) v.push(`${id} ${x.name}: flat bar (high ≤ low)`);
    if (x.open === x.close) v.push(`${id} ${x.name}: open = close`);
    if (x.high < Math.max(x.open, x.close) || x.low > Math.min(x.open, x.close)) v.push(`${id} ${x.name}: body outside the wick`);
    if (i > 0 && i !== e && x.open !== b[i - 1]!.close) v.push(`${id} ${x.name}: unintended gap`);
    if (!(x.volume && x.volume > 0)) v.push(`${id} ${x.name}: missing volume`);
  });
  const gap = b[e]!.open / prior - 1;
  if (Math.sign(gap) !== d) v.push(`${id}: gap direction ${gap > 0 ? "up" : "down"} != ${rc.direction}`);
  if (event.reaction === "muted") {
    if (Math.abs(gap) >= implied) v.push(`${id}: muted gap ${gap} not inside implied ${implied}`);
    if (b[e]!.high / prior - 1 >= implied || 1 - b[e]!.low / prior >= implied) v.push(`${id}: muted report bar range leaves the implied band`);
  } else if (Math.abs(gap) <= implied) v.push(`${id}: gap ${gap.toFixed(4)} not outside implied ${implied} (would read as muted)`);
  const prev20 = b.slice(e - 20, e).map((x) => x.volume ?? 0);
  const avg20 = prev20.reduce((a, x) => a + x, 0) / prev20.length;
  if ((b[e]!.volume ?? 0) < 3 * avg20) v.push(`${id}: report volume < 3 × 20-bar average`);
  const chartRunUp = b[e - 1]!.close / b[e - 1 - RUN_UP_WINDOW]!.close - 1;
  if (Math.abs(chartRunUp - event.expect.runUpPct / 100) > 0.005) v.push(`${id}: chart run-up ${(chartRunUp * 100).toFixed(2)}% != ${event.expect.runUpPct}%`);
  const post = b.slice(e + 1);
  switch (event.reaction) {
    case "gap-and-go": {
      const filled = [b[e]!, ...post].some((x) => (d > 0 ? x.low <= prior : x.high >= prior));
      if (filled) v.push(`${id}: gap-and-go must not fill the gap`);
      if (Math.sign(b[e + 5]!.close / b[e]!.close - 1) !== d) v.push(`${id}: gap-and-go should extend over 5 bars`);
      break;
    }
    case "gap-fill": {
      const window = b.slice(e + 1, e + 1 + FILL_WITHIN_BARS);
      if (!window.some((x) => (d > 0 ? x.low <= prior : x.high >= prior))) v.push(`${id}: gap not filled within ${FILL_WITHIN_BARS} bars`);
      break;
    }
    case "sell-the-news":
      if (chartRunUp < 0.08) v.push(`${id}: sell-the-news needs ≥ 8% run-up on the chart`);
      if (!(b[e]!.close < b[e]!.open)) v.push(`${id}: sell-the-news report bar must close below its open`);
      break;
    case "guidance-reversal":
      if (!(gap > 0 && b[e]!.close < b[e]!.open && b[e]!.close < prior)) v.push(`${id}: guidance-reversal must gap up and close red below the prior close`);
      break;
    case "pead-drift": {
      const r10 = b[e + 10]!.close / b[e]!.close - 1;
      if (Math.sign(r10) !== d || Math.abs(r10) < 0.3 * implied) v.push(`${id}: PEAD 10-bar return ${r10.toFixed(4)} not with the gap`);
      break;
    }
    case "muted":
      break;
  }
  return v;
}

/** Charts for every event, generated once (deterministic). */
export function reactionChartFor(event: EarningsEvent): ReactionChart {
  return generateReaction(event);
}

/* -------------------- FE4.M3 reveal annotations -------------------- */


export interface RevealAnnotations {
  annotations: ChartAnnotations;
  /** Existing glossary / candle terms that explain the shape. */
  relatedTermIds: string[];
}

const RELATED_TERMS: Record<ReactionArchetype, string[]> = {
  "gap-and-go": ["earnings-gap", "gap-continuation", "volume-spike"],
  "gap-fill": ["earnings-gap", "gap-reversal", "volume-spike"],
  "sell-the-news": ["pre-earnings-run-up", "priced-in", "gap-reversal"],
  "guidance-reversal": ["guidance-raise-cut", "gap-reversal", "volume-spike"],
  "pead-drift": ["post-earnings-drift", "gap-continuation", "positioning"],
  muted: ["implied-move", "consensus-estimate"],
};

/** Teaching overlays for the reveal phase: prior close, gap, implied band, report line, fill / drift / fade marks. */
export function revealAnnotations(rc: ReactionChart, event: EarningsEvent): RevealAnnotations {
  const b = rc.bars;
  const e = rc.eventIndex;
  const last = b.length - 1;
  const prior = rc.priorClose;
  const implied = rc.impliedMove;
  const open = b[e]!.open;
  const up = rc.direction === "up";
  const a: ChartAnnotations = {
    levels: [{ price: prior, label: `Prior close ${prior.toFixed(2)}`, tone: "neutral" }],
    zones: [
      {
        fromIndex: e,
        toIndex: last,
        top: cents(prior * (1 + implied)),
        bottom: cents(prior * (1 - implied)),
        label: `Implied ±${event.expect.impliedMovePct}%`,
        tone: "neutral",
        labelAt: "bottom",
      },
      {
        fromIndex: e - 1,
        toIndex: Math.min(last, e + 2),
        top: Math.max(prior, open),
        bottom: Math.min(prior, open),
        label: `Gap ${up ? "+" : ""}${(rc.gap * 100).toFixed(1)}%`,
        tone: up ? "demand" : "supply",
      },
    ],
    events: [{ index: e, label: "Report", tone: "entry" }],
    points: [],
    trendlines: [],
  };
  switch (event.reaction) {
    case "gap-fill": {
      const k = b.findIndex((x, i) => i > e && (up ? x.low <= prior : x.high >= prior));
      if (k > 0) a.points!.push({ index: k, price: prior, label: "Gap filled", tone: "reward" });
      break;
    }
    case "gap-and-go":
    case "pead-drift": {
      const to = Math.min(last, e + 10);
      a.trendlines!.push({ from: { index: e, price: b[e]!.close }, to: { index: to, price: b[to]!.close }, label: event.reaction === "pead-drift" ? "Drift" : "Holds", tone: up ? "demand" : "supply" });
      break;
    }
    case "sell-the-news":
      a.points!.push({ index: e, price: b[e]!.high, label: "Sold the news", tone: "risk" });
      break;
    case "guidance-reversal":
      a.points!.push({ index: e, price: b[e]!.high, label: "Guide cut → fade", tone: "risk" });
      break;
    case "muted":
      break;
  }
  return { annotations: a, relatedTermIds: RELATED_TERMS[event.reaction] };
}

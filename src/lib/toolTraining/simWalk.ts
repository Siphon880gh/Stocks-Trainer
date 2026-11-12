/**
 * Pure logic for Tool Training simulations (bar-by-bar and column-by-column walks) and the underlined
 * `ToolText` triggers that open them. The popover in `components/tools/Simulation.tsx` only calls these, so the
 * stepping rules are unit-tested without a browser. Educational, not advice.
 */
import type { SimBar, SimRef, ToolLesson, ToolSimulation, ToolText } from "./types";

/** Minimum steps in a simulation ("5+ bars"). */
export const MIN_SIM_STEPS = 5;

/** How many steps (bars or column steps) a simulation has. */
export function simStepCount(sim: ToolSimulation): number {
  return sim.kind === "bars" ? sim.bars.length : sim.steps.length;
}

/** `shown` = steps revealed so far; the current step is `shown - 1`. */
export interface WalkState {
  shown: number;
  total: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function startWalk(sim: ToolSimulation): WalkState {
  const total = simStepCount(sim);
  return { shown: clamp(sim.start, 1, Math.max(1, total)), total };
}
export const replayWalk = startWalk;
export function nextStep(s: WalkState): WalkState {
  return s.shown < s.total ? { ...s, shown: s.shown + 1 } : s;
}
export function prevStep(s: WalkState): WalkState {
  return s.shown > 1 ? { ...s, shown: s.shown - 1 } : s;
}
/** Jump straight to a step (1-based count of revealed steps), clamped to the walk. */
export function showStep(s: WalkState, shown: number): WalkState {
  return { ...s, shown: clamp(shown, 1, s.total) };
}
export const atStart = (s: WalkState) => s.shown <= 1;
export const atEnd = (s: WalkState) => s.shown >= s.total;
export const currentIndex = (s: WalkState) => s.shown - 1;

/** The copy for the current step: what it shows and why we are looking. */
export function currentStepCopy(sim: ToolSimulation, s: WalkState): { label: string; what: string; why: string } {
  const i = currentIndex(s);
  if (sim.kind === "bars") {
    const b = sim.bars[i]!;
    return { label: b.label, what: b.what, why: b.why };
  }
  const st = sim.steps[i]!;
  return { label: sim.columns[st.col] ?? "", what: st.what, why: st.why };
}

/** "Bar 3 of 9" / "Step 2 of 5". */
export function walkProgress(sim: ToolSimulation, s: WalkState): string {
  return `${sim.kind === "bars" ? "Bar" : "Step"} ${s.shown} of ${s.total}`;
}

/** Column walk: which table columns are visible (0 = row labels, always) and which one is current. */
export function visibleColumns(sim: Extract<ToolSimulation, { kind: "columns" }>, s: WalkState): { visible: number[]; current: number; row?: number } {
  const reached = sim.steps.slice(0, s.shown);
  const maxCol = Math.max(0, ...reached.map((st) => st.col));
  const visible = sim.columns.map((_, i) => i).filter((i) => i === 0 || i <= maxCol);
  const cur = sim.steps[currentIndex(s)]!;
  return { visible, current: cur.col, row: cur.row };
}

/** Candle geometry for a fixed number of slots, so bars don't jump as new ones are revealed. */
export interface CandleBox {
  x: number;
  bodyX: number;
  bodyW: number;
  yHigh: number;
  yLow: number;
  yOpen: number;
  yClose: number;
  up: boolean;
}
export function candleLayout(bars: SimBar[], width: number, height: number, pad = 8): { boxes: CandleBox[]; y: (price: number) => number; slot: number } {
  const hi = Math.max(...bars.map((b) => b.high));
  const lo = Math.min(...bars.map((b) => b.low));
  const span = hi - lo || 1;
  const y = (p: number) => pad + (1 - (p - lo) / span) * (height - pad * 2);
  const slot = width / Math.max(1, bars.length);
  const bodyW = Math.max(3, Math.min(22, slot * 0.6));
  const boxes = bars.map((b, i) => {
    const x = slot * i + slot / 2;
    return { x, bodyX: x - bodyW / 2, bodyW, yHigh: y(b.high), yLow: y(b.low), yOpen: y(b.open), yClose: y(b.close), up: b.close >= b.open };
  });
  return { boxes, y, slot };
}

/** Flatten lesson copy to the text a reader sees (triggers keep their words). */
export function toolTextPlain(t: ToolText): string {
  return typeof t === "string" ? t : t.map((p) => (typeof p === "string" ? p : p.text)).join("");
}
export function toolTextRefs(t: ToolText): SimRef[] {
  return typeof t === "string" ? [] : t.filter((p): p is SimRef => typeof p !== "string");
}

/** Every underlined trigger in a lesson's intro, screen callouts and walkthrough steps. */
export function lessonSimRefs(lesson: ToolLesson): SimRef[] {
  return [
    ...lesson.intro.flatMap(toolTextRefs),
    ...lesson.screens.flatMap((s) => s.callouts.flatMap((c) => toolTextRefs(c.text))),
    ...lesson.walkthroughs.flatMap((w) => w.steps.flatMap(toolTextRefs)),
  ];
}

export function findSimulation(lesson: ToolLesson, id: string): ToolSimulation | undefined {
  return lesson.simulations?.find((s) => s.id === id);
}

/** Problems with a lesson's simulations; empty when everything is well-formed. Used by tests. */
export function simulationProblems(lesson: ToolLesson): string[] {
  const out: string[] = [];
  const sims = lesson.simulations ?? [];
  const ids = sims.map((s) => s.id);
  if (new Set(ids).size !== ids.length) out.push(`${lesson.id}: duplicate simulation id`);
  for (const r of lessonSimRefs(lesson)) if (!ids.includes(r.sim)) out.push(`${lesson.id}: trigger "${r.text}" → missing ${r.sim}`);
  for (const s of sims) {
    if (!lessonSimRefs(lesson).some((r) => r.sim === s.id)) out.push(`${s.id}: no underlined trigger`);
    if (simStepCount(s) < MIN_SIM_STEPS) out.push(`${s.id}: fewer than ${MIN_SIM_STEPS} steps`);
    if (s.start < 1 || s.start >= simStepCount(s)) out.push(`${s.id}: start must leave at least one Next`);
    if (!/SAMPLE|simulated/i.test(s.tape)) out.push(`${s.id}: tape must say SAMPLE or simulated`);
    if (s.goal.length < 40 || s.takeaway.length < 20) out.push(`${s.id}: goal or takeaway too short`);
    const steps = s.kind === "bars" ? s.bars : s.steps;
    steps.forEach((st, i) => {
      if (st.what.length < 15) out.push(`${s.id}#${i}: what too short`);
      if (st.why.length < 30) out.push(`${s.id}#${i}: why too short`);
    });
    if (s.kind === "bars") {
      s.bars.forEach((b, i) => {
        if (!(b.low <= Math.min(b.open, b.close) && b.high >= Math.max(b.open, b.close))) out.push(`${s.id}#${i}: OHLC out of order`);
      });
    } else {
      for (const r of s.rows) if (r.length !== s.columns.length) out.push(`${s.id}: row "${r[0]}" width`);
      s.steps.forEach((st, i) => {
        if (st.col < 1 || st.col >= s.columns.length) out.push(`${s.id}#${i}: col out of range`);
        if (st.row !== undefined && (st.row < 0 || st.row >= s.rows.length)) out.push(`${s.id}#${i}: row out of range`);
      });
    }
  }
  return out;
}

/** Shorthand for SAMPLE bars in lesson data: `simBar("Mar", [43, 44, 38.5, 40], what, why, { mark: "low" })`. */
export function simBar(label: string, ohlc: [number, number, number, number], what: string, why: string, extra: { mark?: SimBar["mark"]; readout?: string } = {}): SimBar {
  const [open, high, low, close] = ohlc;
  return { label, open, high, low, close, what, why, ...extra };
}

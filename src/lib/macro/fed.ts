/**
 * SIMULATED Fed layer on top of WORLD.meetings: market-implied probabilities before each meeting,
 * Summary of Economic Projections dots (19 participants), and statement facts. Statement sentences are
 * written fresh for this app; they are not Federal Reserve text.
 */
import { median, round2 } from "./consistency";
import type { Regime } from "./types";
import { WORLD, regimeForMonth, type FedMeeting } from "./world";

export interface PricedOutcome {
  moveBp: number;
  prob: number;
}

/** Hand-set pricing for teaching meetings; everything else defaults to 90% on the actual move. */
const PRICING_OVERRIDES: Record<number, PricedOutcome[]> = {
  5: [{ moveBp: 0, prob: 45 }, { moveBp: 25, prob: 55 }],
  6: [{ moveBp: 0, prob: 10 }, { moveBp: 25, prob: 90 }],
  14: [{ moveBp: -25, prob: 15 }, { moveBp: 0, prob: 85 }],
  21: [{ moveBp: -25, prob: 60 }, { moveBp: 0, prob: 40 }],
  26: [{ moveBp: -50, prob: 30 }, { moveBp: -25, prob: 70 }],
  33: [{ moveBp: -25, prob: 95 }, { moveBp: 0, prob: 5 }],
};

export function pricingFor(m: FedMeeting): PricedOutcome[] {
  const o = PRICING_OVERRIDES[m.month];
  if (o) return o;
  const alt = m.decisionBp === 0 ? (regimeForMonth(m.month) === "overheating" || regimeForMonth(m.month) === "inflation-worry" ? 25 : -25) : 0;
  return [{ moveBp: m.decisionBp, prob: 90 }, { moveBp: alt, prob: 10 }];
}

export const expectedMoveBp = (p: PricedOutcome[]) => round2(p.reduce((a, o) => a + (o.moveBp * o.prob) / 100, 0));

/** SEP median paths (midpoint of target range at year end): [this year, next year, year after, longer run]. */
const SEP_MEDIANS: Record<number, [number, number, number, number]> = {
  2: [5.375, 4.875, 3.875, 2.75],
  5: [5.625, 5.125, 4.125, 2.75],
  8: [5.625, 5.125, 4.125, 2.75],
  11: [5.625, 4.875, 3.875, 2.875],
  14: [5.125, 4.125, 3.375, 2.875],
  17: [5.125, 4.125, 3.375, 2.875],
  20: [5.125, 4.375, 3.625, 2.875],
  23: [5.125, 4.375, 3.625, 3.0],
  26: [4.125, 3.375, 3.125, 3.0],
  29: [3.875, 3.375, 3.125, 3.0],
  32: [3.625, 3.125, 3.0, 3.0],
  35: [3.625, 3.125, 3.0, 3.0],
};
/** Offsets that keep the 10th of 19 sorted dots on the median. */
const DOT_OFFSETS = [-0.5, -0.375, -0.25, -0.25, -0.125, -0.125, -0.125, 0, 0, 0, 0, 0, 0.125, 0.125, 0.25, 0.25, 0.375, 0.5, 0.625];

export interface DotColumn {
  label: string;
  dots: number[];
  median: number;
}

export function dotsFor(m: FedMeeting): DotColumn[] | undefined {
  const med = SEP_MEDIANS[m.month];
  if (!m.sep || !med) return undefined;
  const y = Math.floor(m.month / 12) + 1;
  const labels = [`SIM Y${y}`, `SIM Y${y + 1}`, `SIM Y${y + 2}`, "Longer run"];
  return med.map((mm, i) => {
    const spread = i === 3 ? 0.5 : 1;
    const dots = DOT_OFFSETS.map((o) => Math.max(0.125, mm + o * spread)).map((v) => Math.round(v * 8) / 8);
    return { label: labels[i]!, dots, median: median(dots) };
  });
}

/** Previous SEP meeting's projection for the same calendar year as `col` (undefined if none). */
export function priorSepMedianSameYear(m: FedMeeting, colIndex: number): number | undefined {
  const prev = [...WORLD.meetings].reverse().find((x) => x.sep && x.month < m.month);
  if (!prev) return undefined;
  const yearShift = Math.floor(m.month / 12) - Math.floor(prev.month / 12);
  const prevCols = dotsFor(prev);
  const idx = colIndex + yearShift;
  if (!prevCols || colIndex === 3 || idx > 2) return undefined;
  return prevCols[idx]!.median;
}

const ACTIVITY: Record<Regime, string> = {
  overheating: "Spending and hiring have stayed very strong, and price pressures remain broad.",
  "inflation-worry": "Activity is still solid, job gains remain firm, and inflation is running well above the 2 percent goal.",
  "fed-pivot-watch": "Growth has cooled from its earlier pace; job gains have slowed, and inflation is easing but still elevated.",
  goldilocks: "Growth is moderate, the labor market is gradually loosening, and inflation has moved closer to the goal.",
  "growth-scare": "Activity has softened, hiring has slowed noticeably, and inflation has continued to ease.",
  "recession-fear": "Output is weakening, the unemployment rate has moved up, and inflation is near the goal.",
};

export interface StatementFacts {
  meeting: FedMeeting;
  action: "raise" | "lower" | "maintain";
  activitySentence: string;
  votesFor: number;
  votesAgainst: number;
  dissentNote?: string;
  pricing: PricedOutcome[];
  expectedBp: number;
  surpriseBp: number;
}

export function statementFor(m: FedMeeting): StatementFacts {
  const pricing = pricingFor(m);
  const expectedBp = expectedMoveBp(pricing);
  const dissent = Math.abs(m.decisionBp) === 50 ? "One member preferred a 25 basis point reduction." : m.month === 5 ? "One member preferred to hold the range unchanged." : undefined;
  return {
    meeting: m,
    action: m.decisionBp > 0 ? "raise" : m.decisionBp < 0 ? "lower" : "maintain",
    activitySentence: ACTIVITY[regimeForMonth(m.month)],
    votesFor: dissent ? 11 : 12,
    votesAgainst: dissent ? 1 : 0,
    dissentNote: dissent,
    pricing,
    expectedBp,
    surpriseBp: round2(m.decisionBp - expectedBp),
  };
}

export const meetingByMonth = (month: number) => WORLD.meetings.find((m) => m.month === month);

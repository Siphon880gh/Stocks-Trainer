/**
 * FE8.M3: "Mark the band" practice. Before the report, mark the options-implied band around the
 * prior close; after the report bar prints, mark the level where the gap would count as filled.
 * Truth comes from the event fixture and its generated chart. SAMPLE / STYLIZED, not advice.
 */
import { eventById, type EarningsEvent } from "./earningsEvents";
import { EVENT_INDEX, generateReaction, type ReactionChart } from "./reactionCharts";
import { ROUND_ORDER } from "./readThePrint";

/** Band edges count as right within this fraction of the prior close. */
export const BAND_TOLERANCE = 0.005;
/** The fill level counts as right within this fraction of the prior close. */
export const FILL_TOLERANCE = 0.0025;

export interface BandTruth {
  eventId: string;
  priorClose: number;
  impliedMovePct: number;
  low: number;
  high: number;
  /** Where the gap counts as filled: the prior close. */
  fillLevel: number;
  /** Sessions after the report until price traded back to the prior close; null = not within the chart. */
  filledAfter: number | null;
  gapPct: number;
}

const cents = (n: number) => Math.round(n * 100) / 100;

export function filledAfter(rc: ReactionChart): number | null {
  for (let i = EVENT_INDEX + 1; i < rc.bars.length; i++) {
    const b = rc.bars[i]!;
    if (rc.direction === "down" ? b.high >= rc.priorClose : b.low <= rc.priorClose) return i - EVENT_INDEX;
  }
  return null;
}

export function bandTruth(event: EarningsEvent): BandTruth {
  const rc = generateReaction(event);
  const m = event.expect.impliedMovePct / 100;
  return {
    eventId: event.id,
    priorClose: rc.priorClose,
    impliedMovePct: event.expect.impliedMovePct,
    low: cents(rc.priorClose * (1 - m)),
    high: cents(rc.priorClose * (1 + m)),
    fillLevel: rc.priorClose,
    filledAfter: filledAfter(rc),
    gapPct: rc.bars[EVENT_INDEX]!.open / rc.priorClose - 1,
  };
}

export interface BandGrade {
  lowOk: boolean;
  highOk: boolean;
  fillOk: boolean | null;
  points: number;
  /** Signed errors as a fraction of the prior close. */
  lowErr: number | null;
  highErr: number | null;
  fillErr: number | null;
}

const within = (x: number | null | undefined, target: number, tol: number, base: number) =>
  x === null || x === undefined || !Number.isFinite(x) ? null : (x - target) / base;

export function gradeBand(t: BandTruth, input: { low?: number | null; high?: number | null; fill?: number | null }): BandGrade {
  const lowErr = within(input.low, t.low, BAND_TOLERANCE, t.priorClose);
  const highErr = within(input.high, t.high, BAND_TOLERANCE, t.priorClose);
  const fillErr = within(input.fill, t.fillLevel, FILL_TOLERANCE, t.priorClose);
  const lowOk = lowErr !== null && Math.abs(lowErr) <= BAND_TOLERANCE;
  const highOk = highErr !== null && Math.abs(highErr) <= BAND_TOLERANCE;
  const fillOk = fillErr === null ? null : Math.abs(fillErr) <= FILL_TOLERANCE;
  return { lowOk, highOk, fillOk, points: Number(lowOk) + Number(highOk) + Number(fillOk === true), lowErr, highErr, fillErr };
}

/** Same order as Read the Print so round n is the same report in both games. */
export const BAND_ROUNDS: BandTruth[] = ROUND_ORDER.map((id) => {
  const e = eventById(id);
  if (!e) throw new Error(`markTheBand: missing ${id}`);
  return bandTruth(e);
});

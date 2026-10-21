/**
 * Macro Desk game rounds (MF5.M1). Each round: one release event, 2–3 instruments to call up / down / muted.
 * Answer keys come from the transmission rules (reactions.ts); nothing is hand-keyed.
 */
import type { Direction, Instrument } from "./types";
import { INSTRUMENT_NAMES, REGIME_NAMES, reactionForEvent } from "./reactions";
import { getRelease, type ReleaseEvent } from "./releases";
import { LABEL_TEXT, formatMetricValue } from "./display";

const article = (w: string) => (/^[aeiou]/i.test(w) ? "an" : "a");

export interface MacroRound {
  id: string;
  eventId: string;
  instruments: Instrument[];
  /** One-line teaching focus shown in round lists. */
  focus: string;
}

const R = (eventId: string, instruments: Instrument[], focus: string): MacroRound => ({ id: `round-${eventId}`, eventId, instruments, focus });

export const MACRO_ROUNDS: MacroRound[] = [
  R("payrolls-01", ["us2y", "dollar", "index"], "Hot jobs while the Fed is still hiking"),
  R("payrolls-02", ["us2y", "index", "homebuilders"], "Strong payrolls reach mortgage rates"),
  R("payrolls-03", ["us2y", "index", "growth-tech"], "Headline beat, details miss"),
  R("payrolls-04", ["us2y", "index", "small-caps"], "Bad news is good news"),
  R("payrolls-05", ["us2y", "index"], "In line = priced in"),
  R("payrolls-06", ["us2y", "index", "utilities"], "Good news is good news again"),
  R("payrolls-07", ["us2y", "index"], "Mixed report whipsaw"),
  R("payrolls-08", ["us10y", "index", "utilities"], "Weak jobs in a recession scare"),
  R("claims-11", ["us2y", "index", "banks"], "Claims jump when recession is the fear"),
  R("jolts-12", ["us2y", "index"], "Openings and quits as wage signals"),
  R("cpi-14", ["us2y", "dollar", "index"], "Hot CPI while overheating"),
  R("cpi-15", ["us2y", "index", "growth-tech"], "Core is what counts"),
  R("cpi-16", ["us2y", "index", "reits"], "Energy-driven headline, cool core"),
  R("cpi-17", ["us2y", "index", "homebuilders"], "Cool CPI before the pivot"),
  R("cpi-18", ["us2y", "index"], "In-line inflation in a soft landing"),
  R("cpi-19", ["us2y", "index", "growth-tech"], "Stagflation scare"),
  R("ppi-21", ["us2y", "index"], "Producer prices in line"),
  R("pce-22", ["us10y", "index"], "Fed's gauge comes in cool"),
  R("gdp-25", ["us10y", "index", "small-caps"], "GDP miss in a growth scare"),
  R("retail-27", ["us2y", "index", "banks"], "Spending relief in a recession scare"),
  R("ism-mfg-28", ["us2y", "index"], "Factory slump before the pivot"),
  R("ism-services-31", ["us2y", "index"], "Busy services, cooler prices"),
  R("housing-starts-34", ["us2y", "index", "homebuilders"], "A lower-impact release"),
  R("pmms-36", ["mortgage30", "index"], "The mortgage survey lags the bond market"),
  R("fomc-38", ["us2y", "dollar", "index"], "Hike that was not fully priced"),
  R("fomc-40", ["us2y", "index", "growth-tech"], "Hold as expected, hawkish dots"),
  R("fomc-41", ["us2y", "dollar", "index"], "First cut, more than priced"),
  R("fomc-42", ["us2y", "index", "banks"], "Big cut, scared market"),
  R("fomc-43", ["us2y", "index"], "Fully priced cut"),
];

export const getRound = (id: string) => MACRO_ROUNDS.find((r) => r.id === id);
export const roundsForEvent = (eventId: string) => MACRO_ROUNDS.filter((r) => r.eventId === eventId);

export function answerKey(round: MacroRound): Record<Instrument, Direction> {
  const r = reactionForEvent(getRelease(round.eventId)!);
  return Object.fromEntries(round.instruments.map((i) => [i, r.moves[i]])) as Record<Instrument, Direction>;
}

/** The number line every explanation starts from: "Payrolls +267k vs +190k consensus". */
export function headlineFact(e: ReleaseEvent): string {
  const h = e.headline;
  return `${h.name}: ${formatMetricValue(h, h.actual)} vs ${formatMetricValue(h, h.consensus)} consensus`;
}

export interface RoundExplanation {
  lead: string;
  perInstrument: Record<Instrument, string>;
  archetypeNote?: string;
}

export function explainRound(round: MacroRound): RoundExplanation {
  const e = getRelease(round.eventId)!;
  const r = reactionForEvent(e);
  const dom = e.details.find((d) => d.key === e.dominantDetail);
  const detail = dom ? ` The deciding detail: ${dom.name.toLowerCase()} ${formatMetricValue(dom, dom.actual)} vs ${formatMetricValue(dom, dom.consensus)}.` : "";
  const lead = `${headlineFact(e)} — ${LABEL_TEXT[e.effectiveLabel].toLowerCase()} in ${article(REGIME_NAMES[e.regime])} ${REGIME_NAMES[e.regime].toLowerCase()} market.${detail} ${r.summary}`;
  const perInstrument = Object.fromEntries(round.instruments.map((i) => [i, r.rationale[i]])) as Record<Instrument, string>;
  const archetypeNote =
    r.archetype === "reversal"
      ? "The first 5-minute bar went one way and the session went the other: the knee-jerk reacted to the headline, then traders read the rest."
      : r.archetype === "whipsaw"
        ? "Whipsaw: a sharp first move, then a full retrace as the offsetting numbers sank in."
        : undefined;
  return { lead, perInstrument, archetypeNote };
}

/** Feedback for a wrong call ("why not"). */
export function whyNot(round: MacroRound, instrument: Instrument, chosen: Direction): string | undefined {
  const key = answerKey(round)[instrument];
  if (chosen === key) return undefined;
  const e = getRelease(round.eventId)!;
  const name = INSTRUMENT_NAMES[instrument];
  if (key === "muted") {
    if (e.kind === "pmms" || e.kind === "sentiment" || e.kind === "housing-starts") return `${name}: this release rarely moves it — the market treats it as lower impact or already known.`;
    return `${name}: the result was ${e.effectiveLabel === "in-line" ? "in line with consensus" : "not a surprise for this market"}, so there was little new to price.`;
  }
  if (chosen === "muted") return `${name}: the surprise was big enough to matter (${headlineFact(e)}), so expect a real move, not a shrug.`;
  return `${name}: right channel, wrong sign for this regime — in ${article(REGIME_NAMES[e.regime])} ${REGIME_NAMES[e.regime].toLowerCase()} market the ${e.effectiveLabel === "hot" ? "hot" : "cool"} read pushes it ${key}.`;
}

export interface RoundScore {
  correct: number;
  total: number;
  results: Record<Instrument, boolean>;
}

export function scoreRound(round: MacroRound, answers: Partial<Record<Instrument, Direction>>): RoundScore {
  const key = answerKey(round);
  const results = Object.fromEntries(round.instruments.map((i) => [i, answers[i] === key[i]])) as Record<Instrument, boolean>;
  return { correct: Object.values(results).filter(Boolean).length, total: round.instruments.length, results };
}

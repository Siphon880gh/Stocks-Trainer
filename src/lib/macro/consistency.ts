/**
 * Pure data-consistency checks for the SIMULATED macro world.
 * Each check returns a list of violations (empty = consistent). Tests run them over every period.
 */
import type { Violation } from "./types";

export const round1 = (v: number) => Math.round(v * 10) / 10;
export const round2 = (v: number) => Math.round(v * 100) / 100;
/** Percent change between two index levels, rounded to 0.1. */
export const pctChange = (now: number, before: number) => round1((now / before - 1) * 100);

const v = (rule: string, detail: string): Violation => ({ rule, detail });
const near = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) <= tol;

/** surprise = actual − consensus. */
export function checkSurprise(e: { id?: string; actual: number; consensus: number; surprise: number }): Violation[] {
  return near(e.surprise, round2(e.actual - e.consensus), 1e-6)
    ? []
    : [v("surprise", `${e.id ?? ""} surprise ${e.surprise} ≠ actual ${e.actual} − consensus ${e.consensus}`)];
}

export interface PayrollMonth {
  label: string;
  /** Change by private sector, thousands. */
  sectors: Record<string, number>;
  privateChange: number;
  governmentChange: number;
  totalChange: number;
  level: number;
  prevLevel: number;
}

export function checkPayrolls(m: PayrollMonth): Violation[] {
  const out: Violation[] = [];
  const sum = Object.values(m.sectors).reduce((a, b) => a + b, 0);
  if (sum !== m.privateChange) out.push(v("payroll-sectors", `${m.label}: Σ sectors ${sum} ≠ private ${m.privateChange}`));
  if (m.privateChange + m.governmentChange !== m.totalChange)
    out.push(v("payroll-total", `${m.label}: private + government ≠ total ${m.totalChange}`));
  if (m.prevLevel + m.totalChange !== m.level)
    out.push(v("payroll-level", `${m.label}: level ${m.level} ≠ prev ${m.prevLevel} + change ${m.totalChange}`));
  return out;
}

export interface HouseholdMonth {
  label: string;
  population: number;
  laborForce: number;
  employed: number;
  unemployed: number;
  unemploymentRate: number;
  participationRate: number;
}

export function checkHousehold(h: HouseholdMonth): Violation[] {
  const out: Violation[] = [];
  if (h.employed + h.unemployed !== h.laborForce) out.push(v("labor-force", `${h.label}: employed + unemployed ≠ labor force`));
  if (h.unemploymentRate !== round1((h.unemployed / h.laborForce) * 100))
    out.push(v("unemployment-rate", `${h.label}: UR ${h.unemploymentRate} ≠ unemployed / labor force`));
  if (h.participationRate !== round1((h.laborForce / h.population) * 100))
    out.push(v("participation", `${h.label}: participation ${h.participationRate} ≠ labor force / population`));
  return out;
}

/** Reported % change must equal the change computed from index levels. */
export function checkPriceChange(label: string, now: number, before: number, reported: number): Violation[] {
  return reported === pctChange(now, before) ? [] : [v("price-change", `${label}: reported ${reported} ≠ computed ${pctChange(now, before)}`)];
}

/** 4-week average = mean of the last 4 weekly values (thousands-precision kept as reported, 0.25 steps allowed). */
export function checkClaimsAverage(label: string, lastFour: number[], reportedAvg: number): Violation[] {
  if (lastFour.length !== 4) return [v("claims-window", `${label}: need 4 weeks, got ${lastFour.length}`)];
  const avg = lastFour.reduce((a, b) => a + b, 0) / 4;
  return near(avg, reportedAvg, 1e-6) ? [] : [v("claims-average", `${label}: 4-wk avg ${reportedAvg} ≠ ${avg}`)];
}

/** 2s10s in basis points = (10y − 2y) × 100. */
export function checkCurveSpread(label: string, y10: number, y2: number, spreadBp: number): Violation[] {
  return spreadBp === Math.round((y10 - y2) * 100) ? [] : [v("curve-spread", `${label}: 2s10s ${spreadBp}bp ≠ (${y10} − ${y2})`)];
}

export function checkRealYield(label: string, nominal: number, breakeven: number, real: number): Violation[] {
  return near(real, round2(nominal - breakeven), 1e-6) ? [] : [v("real-yield", `${label}: real ${real} ≠ ${nominal} − ${breakeven}`)];
}

export const MORTGAGE_SPREAD_BAND: [number, number] = [1.3, 3.0];

export function checkMortgage(label: string, m30: number, m15: number, avg10y: number): Violation[] {
  const out: Violation[] = [];
  const spread = m30 - avg10y;
  if (spread < MORTGAGE_SPREAD_BAND[0] || spread > MORTGAGE_SPREAD_BAND[1])
    out.push(v("mortgage-spread", `${label}: 30y − 10y = ${round2(spread)} outside ${MORTGAGE_SPREAD_BAND.join("–")}`));
  if (!(m15 < m30)) out.push(v("mortgage-15-30", `${label}: 15y ${m15} not below 30y ${m30}`));
  return out;
}

export function checkTargetRange(label: string, lower: number, upper: number, effective: number): Violation[] {
  const out: Violation[] = [];
  if (Math.round((upper - lower) * 100) !== 25) out.push(v("range-width", `${label}: range ${lower}–${upper} not 25 bp wide`));
  if (effective < lower || effective > upper) out.push(v("effective-in-range", `${label}: effective ${effective} outside range`));
  return out;
}

export function checkDecisionStep(label: string, changeBp: number): Violation[] {
  return changeBp % 25 === 0 ? [] : [v("decision-step", `${label}: ${changeBp} bp not a multiple of 25`)];
}

export function checkProbabilities(label: string, probs: number[]): Violation[] {
  const sum = probs.reduce((a, b) => a + b, 0);
  const out: Violation[] = [];
  if (Math.round(sum * 10) !== 1000) out.push(v("probabilities-sum", `${label}: probabilities sum to ${sum}`));
  if (probs.some((p) => p < 0)) out.push(v("probabilities-negative", `${label}: negative probability`));
  return out;
}

/** Annualized quarterly growth from levels, and contributions summing to headline (±0.1). */
export function checkGdp(label: string, level: number, prior: number, headline: number, contributions: number[]): Violation[] {
  const out: Violation[] = [];
  const annualized = round1((Math.pow(level / prior, 4) - 1) * 100);
  if (annualized !== headline) out.push(v("gdp-annualized", `${label}: headline ${headline} ≠ annualized ${annualized}`));
  const sum = round1(contributions.reduce((a, b) => a + b, 0));
  if (Math.abs(sum - headline) > 0.1 + 1e-9) out.push(v("gdp-contributions", `${label}: contributions ${sum} ≠ headline ${headline}`));
  return out;
}

/** ISM: PMI is the equal-weighted mean of its components; "Growing" iff > 50. */
export function checkIsm(label: string, pmi: number, components: number[], status: "Growing" | "Contracting"): Violation[] {
  const out: Violation[] = [];
  const mean = round1(components.reduce((a, b) => a + b, 0) / components.length);
  if (mean !== pmi) out.push(v("ism-mean", `${label}: PMI ${pmi} ≠ component mean ${mean}`));
  if ((pmi > 50) !== (status === "Growing")) out.push(v("ism-status", `${label}: ${pmi} labeled ${status}`));
  return out;
}

/** JOLTS rates: openings rate = openings / (employment + openings); hires rate = hires / employment. */
export function checkJolts(label: string, openings: number, hires: number, employment: number, openingsRate: number, hiresRate: number): Violation[] {
  const out: Violation[] = [];
  if (openingsRate !== round1((openings / (employment + openings)) * 100)) out.push(v("jolts-openings-rate", `${label}: openings rate`));
  if (hiresRate !== round1((hires / employment) * 100)) out.push(v("jolts-hires-rate", `${label}: hires rate`));
  return out;
}

/** Median of a list (19 dots → the 10th). */
export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

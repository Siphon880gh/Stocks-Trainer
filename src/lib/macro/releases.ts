/**
 * SIMULATED release events cut from WORLD. Actuals are read from the world; consensus is set from a
 * designed surprise (z, in "hotter = positive" units) so the storyline teaches each regime.
 * Surprise and labels are always computed (never typed).
 */
import { pctChange, round2 } from "./consistency";
import { dotsFor, meetingByMonth, priorSepMedianSameYear, statementFor } from "./fed";
import type { Regime, ReleaseKind, SurpriseLabel } from "./types";
import { WORLD, monthLabel, quarterLabel, regimeForMonth, weekLabel } from "./world";

export interface Metric {
  key: string;
  name: string;
  /** Display unit hint for components. */
  unit: "k" | "%" | "pct-mom" | "index" | "bp" | "persons" | "saar-k" | "pct-ann";
  actual: number;
  consensus: number;
  /** Consensus range (low, high). */
  range: [number, number];
  prior?: number;
  /** Prior period as revised in this release (payrolls). */
  priorRevised?: number;
  surprise: number;
  stdev: number;
  /** true when a higher number is the "stronger / hotter" reading. */
  strongerIsHigher: boolean;
  label: SurpriseLabel;
  /** Rounding step for consensus / surprise. */
  step: number;
}

export interface Revision {
  label: string;
  from: number;
  to: number;
}

export interface ReleaseEvent {
  id: string;
  kind: ReleaseKind;
  sourceId: string;
  period: string;
  releaseTimeET: string;
  month: number;
  week?: number;
  quarter?: number;
  regime: Regime;
  headline: Metric;
  details: Metric[];
  twist?: "details-reverse" | "mixed";
  /** The detail key that decides the read when twist = details-reverse. */
  dominantDetail?: string;
  /** The label the market ends up trading (headline unless the details overrule it). */
  effectiveLabel: SurpriseLabel;
  revisions?: Revision[];
  /** One-line context for the expectations panel. */
  setup: string;
}

const roundStep = (v: number, step: number) => Math.round(Math.round(v / step) * step * 10000) / 10000;

export function labelFor(surprise: number, stdev: number, strongerIsHigher: boolean): SurpriseLabel {
  if (Math.abs(surprise) < 0.5 * stdev) return "in-line";
  return surprise > 0 === strongerIsHigher ? "hot" : "cool";
}

function metric(
  key: string,
  name: string,
  unit: Metric["unit"],
  actual: number,
  z: number,
  stdev: number,
  step: number,
  strongerIsHigher = true,
  extra: Partial<Pick<Metric, "prior" | "priorRevised">> = {},
  consensusOverride?: number
): Metric {
  const sign = strongerIsHigher ? 1 : -1;
  const consensus = consensusOverride ?? roundStep(actual - z * stdev * sign, step);
  const surprise = round2(actual - consensus);
  return {
    key,
    name,
    unit,
    actual,
    consensus,
    range: [roundStep(consensus - 1.5 * stdev, step), roundStep(consensus + 1.5 * stdev, step)],
    surprise,
    stdev,
    strongerIsHigher,
    label: labelFor(surprise, stdev, strongerIsHigher),
    step,
    ...extra,
  };
}

const month = (m: number) => WORLD.months[m]!;
const mom = (m: number, f: (x: (typeof WORLD.months)[number]) => number) => pctChange(f(month(m)), f(month(m - 1)));

interface Spec {
  kind: ReleaseKind;
  at: number;
  z?: number;
  dz?: number;
  twist?: ReleaseEvent["twist"];
  expect: SurpriseLabel;
}

/** The teaching storyline. `expect` is asserted in tests against the computed effective label. */
export const RELEASE_SPECS: Spec[] = [
  { kind: "payrolls", at: 3, z: 1.5, expect: "hot" },
  { kind: "payrolls", at: 9, z: 1.8, expect: "hot" },
  { kind: "payrolls", at: 12, z: 1.2, dz: -1.4, twist: "details-reverse", expect: "cool" },
  { kind: "payrolls", at: 16, z: -1.5, expect: "cool" },
  { kind: "payrolls", at: 22, z: 0.2, expect: "in-line" },
  { kind: "payrolls", at: 27, z: 1.4, expect: "hot" },
  { kind: "payrolls", at: 30, z: -1.2, dz: 1.2, twist: "mixed", expect: "in-line" },
  { kind: "payrolls", at: 32, z: -1.6, expect: "cool" },
  { kind: "claims", at: 10, z: 1.2, expect: "hot" },
  { kind: "claims", at: 29, z: -1.5, expect: "cool" },
  { kind: "claims", at: 34, z: -2, expect: "cool" },
  { kind: "jolts", at: 8, z: 1.3, expect: "hot" },
  { kind: "jolts", at: 26, z: -1.2, expect: "cool" },
  { kind: "cpi", at: 4, z: 2, expect: "hot" },
  { kind: "cpi", at: 10, z: 1.5, expect: "hot" },
  { kind: "cpi", at: 13, z: 1.5, dz: -1.2, twist: "details-reverse", expect: "cool" },
  { kind: "cpi", at: 17, z: -1.5, expect: "cool" },
  { kind: "cpi", at: 23, z: 0.1, expect: "in-line" },
  { kind: "cpi", at: 31, z: 1.2, expect: "hot" },
  { kind: "ppi", at: 7, z: 1.3, expect: "hot" },
  { kind: "ppi", at: 19, z: -0.3, expect: "in-line" },
  { kind: "pce", at: 11, z: -1.2, expect: "cool" },
  { kind: "pce", at: 25, z: 0.2, expect: "in-line" },
  { kind: "gdp", at: 3, z: 1.5, expect: "hot" },
  { kind: "gdp", at: 9, z: -1.6, expect: "cool" },
  { kind: "retail", at: 6, z: 1.4, expect: "hot" },
  { kind: "retail", at: 33, z: 1.3, expect: "hot" },
  { kind: "ism-mfg", at: 14, z: -1.3, expect: "cool" },
  { kind: "ism-mfg", at: 32, z: -1.5, expect: "cool" },
  { kind: "ism-services", at: 20, z: 1.4, expect: "hot" },
  { kind: "ism-services", at: 27, z: 1.2, dz: -1.3, twist: "mixed", expect: "in-line" },
  { kind: "sentiment", at: 5, z: 0.2, expect: "in-line" },
  { kind: "sentiment", at: 31, z: -1.5, expect: "cool" },
  { kind: "housing-starts", at: 15, z: 1.5, expect: "hot" },
  { kind: "housing-starts", at: 29, z: -1.4, expect: "cool" },
  { kind: "pmms", at: 8, expect: "hot" },
  { kind: "pmms", at: 24, expect: "in-line" },
  { kind: "fomc", at: 5, expect: "hot" },
  { kind: "fomc", at: 6, expect: "in-line" },
  { kind: "fomc", at: 14, twist: "details-reverse", expect: "hot" },
  { kind: "fomc", at: 21, expect: "cool" },
  { kind: "fomc", at: 26, expect: "cool" },
  { kind: "fomc", at: 33, expect: "in-line" },
];

const SOURCE: Record<ReleaseKind, string> = {
  payrolls: "bls-empsit",
  claims: "dol-claims",
  jolts: "bls-jolts",
  cpi: "bls-cpi",
  ppi: "bls-ppi",
  pce: "bea-pce",
  gdp: "bea-gdp",
  retail: "census-retail",
  "ism-mfg": "ism-pmi",
  "ism-services": "ism-pmi",
  sentiment: "umich-sentiment",
  fomc: "fed-fomc-calendar",
  pmms: "freddie-pmms",
  "housing-starts": "census-housing",
};

const TIME: Record<ReleaseKind, string> = {
  payrolls: "8:30 a.m.", claims: "8:30 a.m.", jolts: "10:00 a.m.", cpi: "8:30 a.m.", ppi: "8:30 a.m.", pce: "8:30 a.m.", gdp: "8:30 a.m.",
  retail: "8:30 a.m.", "ism-mfg": "10:00 a.m.", "ism-services": "10:00 a.m.", sentiment: "10:00 a.m.", fomc: "2:00 p.m.", pmms: "12:00 p.m.", "housing-starts": "8:30 a.m.",
};

/**
 * Releases whose real counterpart revises the prior period in the same report (DOL claims: prior week;
 * BLS JOLTS / PPI, BEA PCE, Census retail & starts: prior month). Payrolls carry their own two-month
 * revisions. CPI (annual seasonal revisions only), ISM, PMMS, FOMC, UMich (prelim vs final) and the
 * GDP advance estimate (prior quarter not re-estimated here) show no prior revision — none is invented.
 */
export const REVISES_PRIOR: ReadonlySet<ReleaseKind> = new Set(["claims", "jolts", "ppi", "pce", "retail", "housing-starts"]);

function revHash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** WORLD holds the revised value; the prior as first reported differs by a small deterministic, non-zero amount. */
function withPriorRevision(mt: Metric, eventId: string) {
  if (mt.prior === undefined || mt.priorRevised !== undefined) return;
  const h = revHash(`${eventId}:${mt.key}`);
  const sign = h % 2 ? 1 : -1;
  const steps = Math.max(1, Math.round((0.25 + ((h >>> 1) % 4) * 0.1) * mt.stdev / mt.step));
  mt.priorRevised = mt.prior;
  mt.prior = roundStep(mt.prior - sign * steps * mt.step, mt.step);
}

function build(spec: Spec, i: number): ReleaseEvent {
  const z = spec.z ?? 0;
  const dz = spec.dz ?? z;
  const m = spec.kind === "gdp" ? Math.min(35, spec.at * 3 + 3) : spec.at;
  const base = { id: `${spec.kind}-${String(i + 1).padStart(2, "0")}`, kind: spec.kind, sourceId: SOURCE[spec.kind], releaseTimeET: TIME[spec.kind], month: m, regime: regimeForMonth(m), twist: spec.twist };
  let headline: Metric;
  let details: Metric[] = [];
  let period = monthLabel(m);
  let extra: Partial<ReleaseEvent> = {};
  let setup = "";
  switch (spec.kind) {
    case "payrolls": {
      const p = month(m).payroll;
      const p1 = month(m - 1).payroll;
      const p2 = month(m - 2).payroll;
      headline = metric("payrolls", "Total nonfarm payroll change", "k", p.firstPrint, z, 50, 5, true, { prior: p1.firstPrint, priorRevised: p1.secondPrint });
      details = [
        metric("ur", "Unemployment rate", "%", month(m).household.unemploymentRate, dz, 0.1, 0.1, false, { prior: month(m - 1).household.unemploymentRate }),
        metric("ahe", "Average hourly earnings, m/m", "pct-mom", p.aheMoM, dz, 0.1, 0.1, true, { prior: p1.aheMoM }),
      ];
      extra = { revisions: [{ label: p1.label, from: p1.firstPrint, to: p1.secondPrint }, { label: p2.label, from: p2.secondPrint, to: p2.totalChange }], dominantDetail: spec.twist === "details-reverse" ? "ahe" : undefined };
      setup = "Payrolls, the unemployment rate and wages all print at once; revisions to the two prior months come with it.";
      break;
    }
    case "claims": {
      const w = m * 4 + 1;
      const wk = WORLD.weeks[w]!;
      period = weekLabel(w);
      headline = metric("claims", "Initial claims (SA)", "persons", wk.initialClaims, z, 8000, 1000, false, { prior: WORLD.weeks[w - 1]!.initialClaims });
      details = [metric("continuing", "Continuing claims (SA)", "persons", wk.continuingClaims, z, 20000, 1000, false, { prior: WORLD.weeks[w - 1]!.continuingClaims })];
      extra = { week: w };
      setup = "Weekly claims are the fastest labor read; one week is noisy, so the 4-week average matters.";
      break;
    }
    case "jolts": {
      const j = month(m).jolts;
      headline = metric("openings", "Job openings", "k", j.openings, z, 300, 10, true, { prior: month(m - 1).jolts.openings });
      details = [metric("quits", "Quits", "k", j.quits, dz, 120, 10, true, { prior: month(m - 1).jolts.quits })];
      setup = "Openings and quits show labor demand and worker confidence; this release lands at 10:00 a.m., after the open.";
      break;
    }
    case "cpi": {
      headline = metric("cpi", "CPI all items, m/m (SA)", "pct-mom", mom(m, (x) => x.prices.all), z, 0.1, 0.1, true, { prior: mom(m - 1, (x) => x.prices.all) });
      details = [metric("core", "CPI less food and energy, m/m", "pct-mom", mom(m, (x) => x.prices.core), dz, 0.1, 0.1, true, { prior: mom(m - 1, (x) => x.prices.core) })];
      extra = { dominantDetail: spec.twist === "details-reverse" ? "core" : undefined };
      setup = "The market trades core (less food and energy) more than the headline, because energy swings back and forth.";
      break;
    }
    case "ppi": {
      headline = metric("ppi", "PPI final demand, m/m", "pct-mom", mom(m, (x) => x.prices.ppi), z, 0.15, 0.1, true, { prior: mom(m - 1, (x) => x.prices.ppi) });
      details = [metric("ppi-core", "PPI less foods, energy, trade, m/m", "pct-mom", mom(m, (x) => x.prices.ppiCore), dz, 0.15, 0.1, true)];
      setup = "Producer prices are a pipeline read for consumer inflation; markets usually react less than to CPI.";
      break;
    }
    case "pce": {
      headline = metric("pce-core", "Core PCE price index, m/m", "pct-mom", mom(m, (x) => x.prices.pceCore), z, 0.1, 0.1, true, { prior: mom(m - 1, (x) => x.prices.pceCore) });
      details = [metric("pce", "PCE price index, m/m", "pct-mom", mom(m, (x) => x.prices.pce), dz, 0.1, 0.1, true)];
      setup = "Core PCE is the inflation gauge the Fed targets; CPI and PPI already let forecasters estimate it, so surprises are usually small.";
      break;
    }
    case "gdp": {
      const q = WORLD.quarters[spec.at]!;
      period = quarterLabel(spec.at);
      headline = metric("gdp", "Real GDP, annualized q/q", "pct-ann", q.headline, z, 0.5, 0.1, true, { prior: WORLD.quarters[spec.at - 1]?.headline });
      details = [metric("consumption", "Consumer spending contribution", "pct-ann", q.contributions.consumption, dz, 0.3, 0.1, true)];
      extra = { quarter: spec.at };
      setup = "The advance GDP estimate is a look back at a finished quarter; most of it was already known from monthly data.";
      break;
    }
    case "retail": {
      headline = metric("retail", "Retail sales, m/m", "pct-mom", mom(m, (x) => x.retail.total), z, 0.4, 0.1, true, { prior: mom(m - 1, (x) => x.retail.total) });
      details = [metric("control", "Control group, m/m", "pct-mom", mom(m, (x) => x.retail.control), dz, 0.3, 0.1, true)];
      setup = "The control group (ex autos, gas, building materials, food services) feeds GDP; traders check it next to the headline.";
      break;
    }
    case "ism-mfg":
    case "ism-services": {
      const x = spec.kind === "ism-mfg" ? month(m).ismMfg : month(m).ismServices;
      const px = spec.kind === "ism-mfg" ? month(m - 1).ismMfg : month(m - 1).ismServices;
      headline = metric("pmi", spec.kind === "ism-mfg" ? "Manufacturing PMI" : "Services PMI", "index", x.pmi, z, 1.2, 0.1, true, { prior: px.pmi });
      details = [metric("prices", "Prices index", "index", x.prices, dz, 2, 0.1, true, { prior: px.prices })];
      setup = "Above 50 means growing, below 50 contracting; the prices sub-index is an early inflation read.";
      break;
    }
    case "sentiment": {
      const s = month(m).sentiment;
      headline = metric("sentiment", "Consumer sentiment index", "index", s.index, z, 2, 0.1, true, { prior: month(m - 1).sentiment.index });
      details = [metric("infl1y", "Year-ahead inflation expectations", "%", s.inflation1y, dz, 0.2, 0.1, true, { prior: month(m - 1).sentiment.inflation1y })];
      setup = "Sentiment is a survey of how households feel; markets usually shrug unless inflation expectations jump.";
      break;
    }
    case "housing-starts": {
      const h = month(m).housing;
      headline = metric("starts", "Housing starts (SAAR)", "saar-k", h.starts, z, 60, 5, true, { prior: month(m - 1).housing.starts });
      details = [metric("permits", "Building permits (SAAR)", "saar-k", h.permits, dz, 60, 5, true, { prior: month(m - 1).housing.permits })];
      setup = "Starts show building activity; permits lead starts. This is a sector release more than a market-wide one.";
      break;
    }
    case "pmms": {
      const w = m * 4 + 2;
      const wk = WORLD.weeks[w]!;
      const prev = WORLD.weeks[w - 1]!;
      period = weekLabel(w);
      headline = metric("m30", "30-year fixed rate", "%", wk.mortgage30, 0, 0.05, 0.01, true, { prior: prev.mortgage30 }, round2(prev.mortgage30 + (wk.avg10y - prev.avg10y)));
      details = [metric("m15", "15-year fixed rate", "%", wk.mortgage15, 0, 0.05, 0.01, true, { prior: prev.mortgage15 }, round2(prev.mortgage15 + (wk.avg10y - prev.avg10y)))];
      extra = { week: w };
      setup = "The weekly survey summarizes rates on loan applications from the days before it is published, so it mostly reflects 10-year moves the market has already seen.";
      break;
    }
    case "fomc": {
      const mt = meetingByMonth(m)!;
      const st = statementFor(mt);
      headline = metric("decision", "Target range change", "bp", mt.decisionBp, 0, 10, 0.01, true, { prior: WORLD.meetings[WORLD.meetings.indexOf(mt) - 1]?.decisionBp ?? 0 }, st.expectedBp);
      const cols = dotsFor(mt);
      const prior = priorSepMedianSameYear(mt, 0);
      if (cols && prior !== undefined) details = [metric("dots", `Median dot, ${cols[0]!.label} year-end`, "%", cols[0]!.median, 0, 0.125, 0.125, true, {}, prior)];
      extra = { dominantDetail: spec.twist === "details-reverse" ? "dots" : undefined };
      setup = "A decision that is fully priced moves little; the surprise is the decision versus pricing, and the dots versus the last projection.";
      break;
    }
  }
  if (REVISES_PRIOR.has(spec.kind)) [headline!, ...details].forEach((mt) => withPriorRevision(mt, base.id));
  const dominant = details.find((d) => d.key === extra.dominantDetail);
  const effectiveLabel: SurpriseLabel = spec.twist === "details-reverse" && dominant ? dominant.label : spec.twist === "mixed" ? "in-line" : headline!.label;
  return { ...base, period, headline: headline!, details, effectiveLabel, setup, ...extra } as ReleaseEvent;
}

export const RELEASES: ReleaseEvent[] = RELEASE_SPECS.map(build);

export function getRelease(id: string): ReleaseEvent | undefined {
  return RELEASES.find((r) => r.id === id);
}

/** |surprise| in stdev units of the metric the market trades (dominant detail or headline). */
export function surpriseZ(e: ReleaseEvent): number {
  const d = e.details.find((x) => x.key === e.dominantDetail) ?? e.headline;
  return Math.min(3, Math.abs(d.surprise) / d.stdev);
}

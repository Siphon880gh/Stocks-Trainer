/**
 * Macro Forces (docs/projects/macro-forces): shared types.
 * Units: rates and yields in percent (2 decimals); changes in basis points as integers;
 * payrolls and claims in thousands / persons as stated per field. All data is SIMULATED.
 */

export type ReleaseKind =
  | "payrolls"
  | "claims"
  | "jolts"
  | "cpi"
  | "ppi"
  | "pce"
  | "gdp"
  | "retail"
  | "ism-mfg"
  | "ism-services"
  | "sentiment"
  | "fomc"
  | "pmms"
  | "housing-starts";

/** Market backdrop that decides how the same print is read. */
export type Regime =
  | "inflation-worry"
  | "overheating"
  | "fed-pivot-watch"
  | "goldilocks"
  | "growth-scare"
  | "recession-fear";

export type Instrument =
  | "us2y"
  | "us10y"
  | "dollar"
  | "index"
  | "growth-tech"
  | "homebuilders"
  | "reits"
  | "banks"
  | "utilities"
  | "small-caps"
  | "bond-proxy"
  | "mortgage30";

export type Direction = "up" | "down" | "muted";

/** hot = stronger / higher-inflation than expected; cool = weaker / softer; in-line = inside the threshold. */
export type SurpriseLabel = "hot" | "cool" | "in-line";

/** How the intraday reaction unfolds after the release bar. */
export type ReactionArchetype = "follow-through" | "reversal" | "whipsaw";

export interface MacroSource {
  id: string;
  agency: string;
  title: string;
  url: string;
  /** e.g. "8:30 a.m." — Eastern Time. */
  releaseTimeET?: string;
  /** Host answers scripted fetches with 403 (CDN bot protection); verified manually in SOURCES.md. */
  botBlocked: boolean;
  fredSeries?: string;
}

export interface Violation {
  rule: string;
  detail: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

/** Number formatting for release metrics (shared by panels, game and tests). */
import type { Metric, ReleaseEvent } from "./releases";

export function decimalsFor(m: Pick<Metric, "step" | "unit">): number {
  if (m.unit === "bp") return m.step < 1 ? 1 : 0;
  if (m.step >= 1) return 0;
  if (m.step === 0.125) return 3;
  if (m.step >= 0.1) return 1;
  return 2;
}

const UNIT_SUFFIX: Record<Metric["unit"], string> = { k: "k", "%": "%", "pct-mom": "%", index: "", bp: " bp", persons: "", "saar-k": "k", "pct-ann": "%" };

/** Plain value in the metric's unit, e.g. "+150k", "3.9%", "0.3%", "217,000", "+25 bp". */
export function formatMetricValue(m: Pick<Metric, "step" | "unit">, v: number): string {
  const d = m.unit === "bp" ? (Number.isInteger(v) ? 0 : decimalsFor(m)) : decimalsFor(m);
  const abs = Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const signed = m.unit === "k" || m.unit === "bp" || m.unit === "pct-mom" || m.unit === "pct-ann";
  const sign = v < 0 ? "−" : signed && v > 0 ? "+" : "";
  return `${sign}${abs}${UNIT_SUFFIX[m.unit]}`;
}

export function formatSurprise(m: Pick<Metric, "step" | "unit">, v: number): string {
  const d = decimalsFor(m);
  const abs = Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  return `${v < 0 ? "−" : v > 0 ? "+" : "±"}${abs}${UNIT_SUFFIX[m.unit]}`;
}

/** Surprise in standard deviations of the forecast spread (capped ±3, rounded to 0.1). */
export const metricZ = (m: Metric) => Math.max(-3, Math.min(3, Math.round((m.surprise / m.stdev) * 10) / 10));

export const LABEL_TEXT: Record<Metric["label"], string> = { hot: "Hotter / stronger than expected", cool: "Cooler / weaker than expected", "in-line": "In line with expectations" };

export const allMetrics = (e: ReleaseEvent) => [e.headline, ...e.details];

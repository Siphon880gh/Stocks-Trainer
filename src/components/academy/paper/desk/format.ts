/** Display helpers for the paper desk. */
export const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

/** "Jan 17, 2024" for an ISO date (UTC noon, so no time-zone shift); other labels ("D12") unchanged. */
export function dayLabel(label: string, weekday = false): string {
  if (!isIsoDate(label)) return label;
  return new Date(`${label}T12:00:00Z`).toLocaleDateString("en-US", { ...(weekday ? { weekday: "short" } : {}), month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** Whole dollars → "$119.6B" / "$503.0M" / "$12,000". */
export function bigUsd(n: number | undefined | null): string {
  if (n === undefined || n === null) return "—";
  const a = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(1)}B`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(1)}M`;
  return `${sign}$${a.toLocaleString("en-US")}`;
}

export const pctOrDash = (x: number | null, digits = 1) => (x === null ? "—" : `${(x * 100).toFixed(digits)}%`);

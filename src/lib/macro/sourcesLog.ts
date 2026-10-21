import type { MacroSource } from "./types";

export interface VerificationRow {
  date: string;
  method: string;
  result: string;
}

/** Parse the "Verification log" table of SOURCES.md. */
export function parseVerificationLog(md: string): VerificationRow[] {
  const part = md.split("## Verification log")[1] ?? "";
  return part
    .split("\n")
    .filter((l) => /^\|\s*\d{4}-\d{2}-\d{2}/.test(l))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
    .map(([date, method, result]) => ({ date: date!, method: method!, result: result! }));
}

/** A bot-blocked source counts as verified when a dated log row names its id (or its FRED series id). */
export function manuallyVerified(source: MacroSource, rows: VerificationRow[]): VerificationRow | undefined {
  const token = source.fredSeries ?? source.id;
  const re = new RegExp(`(^|[^A-Za-z0-9-])${token}([^A-Za-z0-9-]|$)`);
  return rows.find((r) => re.test(r.result));
}

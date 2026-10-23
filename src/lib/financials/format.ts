/** Display formatting for financial tables. Accounting style: negatives in parentheses. */

const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Whole thousands: 40000 → "40,000"; -9200 → "(9,200)"; 0 → "0". */
export function fmtK(n: number): string {
  const s = nf0.format(Math.abs(n));
  return n < 0 ? `(${s})` : s;
}

/** Fraction → percent with one decimal: 0.253 → "25.3%"; null → "n/m". */
export function fmtPct(n: number | null, digits = 1): string {
  if (n === null) return "n/m";
  const s = `${(Math.abs(n) * 100).toFixed(digits)}%`;
  return n < 0 ? `(${s})` : s;
}

/** EPS in dollars: 0.15 → "$0.15"; -0.18 → "($0.18)". */
export function fmtEps(n: number): string {
  const s = `$${Math.abs(n).toFixed(2)}`;
  return n < 0 ? `(${s})` : s;
}

/** Multiple: 2.634 → "2.6×"; null → "n/m". */
export function fmtX(n: number | null): string {
  return n === null ? "n/m" : `${n.toFixed(1)}×`;
}

/** Days: 45.5 → "46 days"; null → "n/m". */
export function fmtDays(n: number | null): string {
  return n === null ? "n/m" : `${Math.round(n)} days`;
}

/** Months: 7.25 → "7.3 mo"; null → "not burning". */
export function fmtMonths(n: number | null): string {
  return n === null ? "not burning" : `${n.toFixed(1)} mo`;
}

export type CellFormat = "k" | "pct" | "eps" | "x" | "days" | "months" | "count" | "ratio";

export function fmtCell(n: number | null, format: CellFormat): string {
  if (n === null) return format === "months" ? fmtMonths(null) : "n/m";
  switch (format) {
    case "k":
      return fmtK(n);
    case "pct":
      return fmtPct(n);
    case "eps":
      return fmtEps(n);
    case "x":
      return fmtX(n);
    case "days":
      return fmtDays(n);
    case "months":
      return fmtMonths(n);
    case "count":
      return nf0.format(n);
    case "ratio":
      return n.toFixed(2);
  }
}

export const FIN_DISCLAIMER =
  "Note: this is sample data. It does not reflect true market prices or a live filing.";

/** Archive deep-link for a glossary term (router path, basename handled by <Link>). */
export const glossaryHref = (termId: string) => `/archive?tab=literacy&open=${termId}`;

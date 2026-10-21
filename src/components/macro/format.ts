/** Display helpers for SIMULATED macro viewers. */
export const fmtInt = (n: number | null | undefined) => (n === null || n === undefined ? "—" : Math.round(n).toLocaleString("en-US"));
export const fmtSigned = (n: number | null | undefined, digits = 0) =>
  n === null || n === undefined ? "—" : `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
export const fmt1 = (n: number | null | undefined) => (n === null || n === undefined ? "—" : n.toFixed(1));
export const fmt2 = (n: number | null | undefined) => (n === null || n === undefined ? "—" : n.toFixed(2));
export const fmt3 = (n: number | null | undefined) => (n === null || n === undefined ? "—" : n.toFixed(3));
/** 5.25 → "5-1/4" (policy-statement style fractions). */
export function fedFraction(x: number): string {
  const whole = Math.floor(x + 1e-9);
  const frac = Math.round((x - whole) * 8);
  const map: Record<number, string> = { 0: "", 1: "-1/8", 2: "-1/4", 3: "-3/8", 4: "-1/2", 5: "-5/8", 6: "-3/4", 7: "-7/8" };
  return `${whole}${map[frac] ?? ""}`;
}
export const labelTone = (l: "hot" | "cool" | "in-line") => (l === "hot" ? "text-accent-red" : l === "cool" ? "text-primary" : "text-muted");

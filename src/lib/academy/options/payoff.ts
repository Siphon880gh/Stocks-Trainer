/**
 * BA8.M1: option strategy payoff AT EXPIRATION (decision D1: arithmetic only, no pricing models).
 * All prices are per share, in dollars; one contract = CONTRACT_SIZE shares. Fees ignored.
 *
 * Leg P&L at an expiration price S (premium p, strike K, stock bought at S0):
 *   long call  = max(S − K, 0) − p        short call = p − max(S − K, 0)
 *   long put   = max(K − S, 0) − p        short put  = p − max(K − S, 0)
 *   long stock = S − S0
 * A strategy's P&L is the sum of its legs × their quantities. It is piecewise linear in S with kinks only
 * at the strikes, so max gain / max loss are found at S = 0, at the strikes, or as S → ∞ (unbounded when
 * the slope past the highest strike is non-zero). Breakevens are the zero crossings between those points.
 */
export const CONTRACT_SIZE = 100;

export type Leg =
  | { kind: "stock"; qty: number; price: number }
  | { kind: "call" | "put"; position: "long" | "short"; qty: number; strike: number; premium: number };

export interface Strategy {
  id: string;
  name: string;
  legs: Leg[];
}

const round = (x: number) => Math.round(x * 1e6) / 1e6;

export function legPnl(leg: Leg, S: number): number {
  if (leg.kind === "stock") return leg.qty * (S - leg.price);
  const intrinsic = leg.kind === "call" ? Math.max(S - leg.strike, 0) : Math.max(leg.strike - S, 0);
  const sign = leg.position === "long" ? 1 : -1;
  return leg.qty * sign * (intrinsic - leg.premium);
}

/** Per-share P&L at expiration for the expiration price S (S ≥ 0). */
export const payoffAt = (s: Strategy, S: number) => round(s.legs.reduce((a, l) => a + legPnl(l, S), 0));
export const payoffPerContract = (s: Strategy, S: number) => round(payoffAt(s, S) * CONTRACT_SIZE);

export const strikes = (s: Strategy) => [...new Set(s.legs.flatMap((l) => (l.kind === "stock" ? [] : [l.strike])))].sort((a, b) => a - b);

/** Slope of the P&L line above the highest strike (shares-equivalent per share). */
export function slopeAtInfinity(s: Strategy): number {
  return s.legs.reduce((a, l) => a + (l.kind === "stock" ? l.qty : l.kind === "call" ? (l.position === "long" ? l.qty : -l.qty) : 0), 0);
}

/** Net premium per share: positive = paid (debit), negative = received (credit). Stock cost excluded. */
export const netPremium = (s: Strategy) => round(s.legs.reduce((a, l) => a + (l.kind === "stock" ? 0 : (l.position === "long" ? 1 : -1) * l.qty * l.premium), 0));

export interface PayoffSummary {
  /** Per share; Infinity when unbounded. */
  maxGain: number;
  /** Per share, as a positive number; Infinity when unbounded. */
  maxLoss: number;
  breakevens: number[];
  netPremium: number;
  perContract: { maxGain: number; maxLoss: number; netPremium: number };
}

export function summarize(s: Strategy): PayoffSummary {
  const ks = strikes(s);
  const top = (ks.at(-1) ?? 0) + 1;
  const pts = [0, ...ks, top];
  const vals = pts.map((x) => payoffAt(s, x));
  const slope = slopeAtInfinity(s);
  const maxGain = slope > 0 ? Infinity : Math.max(...vals);
  const minVal = slope < 0 ? -Infinity : Math.min(...vals);
  const breakevens: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i]!, pts[i + 1]!];
    const [fa, fb] = [vals[i]!, vals[i + 1]!];
    if (fa === 0 && !breakevens.includes(a)) breakevens.push(a);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) breakevens.push(round(a + ((0 - fa) * (b - a)) / (fb - fa)));
  }
  // beyond the top point the line continues with `slope`
  const fTop = vals.at(-1)!;
  if (fTop === 0 && !breakevens.includes(top)) breakevens.push(top);
  else if (slope !== 0 && Math.sign(fTop) !== Math.sign(slope) && fTop !== 0) breakevens.push(round(top - fTop / slope));
  const maxLoss = minVal === -Infinity ? Infinity : Math.max(0, -minVal);
  const np = netPremium(s);
  return {
    maxGain: round(maxGain),
    maxLoss: round(maxLoss),
    breakevens: breakevens.filter((x) => x > 0).sort((a, b) => a - b),
    netPremium: np,
    perContract: { maxGain: maxGain === Infinity ? Infinity : round(maxGain * CONTRACT_SIZE), maxLoss: maxLoss === Infinity ? Infinity : round(maxLoss * CONTRACT_SIZE), netPremium: round(np * CONTRACT_SIZE) },
  };
}

/** Sample points for charts: [S, P&L per share] from lo to hi inclusive. */
export function samplePayoff(s: Strategy, lo: number, hi: number, n = 61): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const S = round(lo + ((hi - lo) * i) / (n - 1));
    return [S, payoffAt(s, S)] as [number, number];
  });
}

export const fmtUsd = (x: number) => (x === Infinity ? "Unlimited" : `$${x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

/**
 * BA4.M4: P&L and performance statistics (all in cents unless noted). Pure.
 */
import type { AccountState, Order } from "./types";
import { equity, positionValue, q4 } from "./account";

/** Unrealised P&L = Σ (qty × mark − cost basis) over open positions. */
export const unrealizedPnl = (s: AccountState) => Object.values(s.positions).reduce((a, p) => a + positionValue(s, p) - p.costBasis, 0);
/** Realised P&L = Σ realised over sell fills. */
export const realizedPnl = (s: AccountState) => s.fills.reduce((a, f) => a + f.realized, 0);
/** Total P&L = equity − starting cash (= realised + unrealised, fees being 0). */
export const totalPnl = (s: AccountState) => equity(s) - s.startingCash;

/** One symbol's P&L: realised from its sells + unrealised on its open position. */
export function symbolPnl(s: AccountState, symbol: string) {
  const realized = s.fills.filter((f) => f.symbol === symbol).reduce((a, f) => a + f.realized, 0);
  const p = s.positions[symbol];
  const unreal = p ? positionValue(s, p) - p.costBasis : 0;
  return { realized, unrealized: unreal, total: realized + unreal };
}

/** Change in equity over the last bar (0 before the first step). */
export function dayPnl(s: AccountState): number {
  const c = s.equityCurve;
  return c.length < 2 ? 0 : c[c.length - 1]!.equity - c[c.length - 2]!.equity;
}

/** Max drawdown over the equity curve: the largest peak-to-trough fall, in cents and as a share of the peak. */
export function maxDrawdown(curve: { equity: number }[]): { amount: number; pct: number } {
  let peak = -Infinity;
  let amount = 0;
  let pct = 0;
  for (const p of curve) {
    peak = Math.max(peak, p.equity);
    const dd = peak - p.equity;
    if (dd > amount) {
      amount = dd;
      pct = peak > 0 ? dd / peak : 0;
    }
  }
  return { amount, pct };
}

/** Exposure = gross market value of positions (shorts counted at their absolute value) ÷ equity. */
export const exposure = (s: AccountState) => {
  const e = equity(s);
  const gross = Object.values(s.positions).reduce((a, p) => a + Math.abs(positionValue(s, p)), 0);
  return e > 0 ? gross / e : 0;
};

export interface RoundTrip {
  symbol: string;
  /** BA11.M2: a short trip opens with a sell and closes with buys to cover. */
  direction: "long" | "short";
  entryBar: number;
  /** Price and quantity of the opening buy fill. */
  entryPrice: number;
  entryQty: number;
  exitBar: number | null;
  /** Σ realised P&L of the trip's sells (closed trips only are final). */
  pnl: number;
  closed: boolean;
  /** Protective stop level working at the end of the entry bar, if any. */
  stopAtEntry: number | null;
  /** pnl ÷ planned risk, when a stop existed at entry. */
  r: number | null;
}

const isProtective = (o: Order, direction: RoundTrip["direction"]) =>
  direction === "long" ? o.side === "sell" && !o.opensShort && (o.type === "stop" || o.type === "stop-limit" || o.type === "trailing-stop") : o.side === "buy" && (o.type === "stop" || o.type === "stop-limit");

/** Protective stop for a trip: a sell stop / stop-limit / trailing stop (a buy stop for a short) placed by the end of the entry bar and still working then. */
export function stopAtEntry(s: AccountState, symbol: string, entryBar: number, direction: RoundTrip["direction"] = "long"): number | null {
  const o = s.orders.find((x) => x.symbol === symbol && isProtective(x, direction) && x.status !== "rejected" && x.placedAtBar <= entryBar && (x.closedAtBar === undefined || x.closedAtBar > entryBar));
  return o?.initialStop ?? null;
}

/** Splits the fills into round trips: flat → long → flat, or flat → short → flat (BA11.M2). Quantities are signed. */
export function roundTrips(s: AccountState): RoundTrip[] {
  const trips: RoundTrip[] = [];
  const open: Record<string, { trip: RoundTrip; qty: number }> = {};
  for (const f of s.fills) {
    const cur = open[f.symbol];
    const d = f.side === "buy" ? f.qty : -f.qty;
    if (!cur) {
      const direction = d > 0 ? "long" : "short";
      const trip: RoundTrip = { symbol: f.symbol, direction, entryBar: f.bar, entryPrice: f.price, entryQty: f.qty, exitBar: null, pnl: 0, closed: false, stopAtEntry: stopAtEntry(s, f.symbol, f.bar, direction), r: null };
      trips.push(trip);
      open[f.symbol] = { trip, qty: d };
    } else if (Math.sign(cur.qty) === Math.sign(d)) {
      cur.qty = q4(cur.qty + d);
    } else {
      cur.trip.pnl += f.realized;
      cur.qty = q4(cur.qty + d);
      if (cur.qty === 0) {
        cur.trip.closed = true;
        cur.trip.exitBar = f.bar;
        delete open[f.symbol];
      }
    }
  }
  for (const t of trips) {
    if (!t.closed || t.stopAtEntry === null) continue;
    const risk = t.direction === "long" ? t.entryPrice - t.stopAtEntry : t.stopAtEntry - t.entryPrice;
    if (risk > 0) t.r = t.pnl / (risk * t.entryQty);
  }
  return trips;
}

export interface PerformanceStats {
  equity: number;
  cash: number;
  realized: number;
  unrealized: number;
  total: number;
  day: number;
  maxDrawdown: { amount: number; pct: number };
  /** Winning closed trips ÷ closed trips; null with no closed trip. */
  winRate: number | null;
  /** Mean R over closed trips that had a stop at entry; null when none. */
  averageR: number | null;
  exposure: number;
  closedTrips: number;
}

export function performance(s: AccountState): PerformanceStats {
  const trips = roundTrips(s).filter((t) => t.closed);
  const withR = trips.filter((t) => t.r !== null);
  return {
    equity: equity(s),
    cash: s.cash,
    realized: realizedPnl(s),
    unrealized: unrealizedPnl(s),
    total: totalPnl(s),
    day: dayPnl(s),
    maxDrawdown: maxDrawdown(s.equityCurve),
    winRate: trips.length ? trips.filter((t) => t.pnl > 0).length / trips.length : null,
    averageR: withR.length ? withR.reduce((a, t) => a + t.r!, 0) / withR.length : null,
    exposure: exposure(s),
    closedTrips: trips.length,
  };
}

/** BA11.M4: trading costs paid so far (cents). Both are already inside realised / unrealised P&L. */
export const feesPaid = (s: AccountState) => s.fills.reduce((a, f) => a + (f.fee ?? 0), 0);
export const slippagePaid = (s: AccountState) => s.fills.reduce((a, f) => a + (f.slippage ?? 0), 0);

/**
 * BA4.M1: paper account and ledger. SIMULATED — virtual money, SAMPLE prices, not a brokerage.
 *
 * Money is integer cents, shares are integers, fees are 0 (decision D4). Formulas:
 * - equity = cash + Σ qty × mark
 * - reserved = Σ reserved over working buy orders; buying power = cash − reserved (never negative)
 * - avg cost = costBasis ÷ qty; it changes only on buys
 * - a sell of q shares removes basis = round(costBasis × q ÷ qty) (the whole basis on the final sell),
 *   so realised P&L = q × fill − removed basis = (fill − avg cost) × q up to a cent of rounding
 */
import type { AccountState, Fill, Order, Position } from "./types";

/** $1k / $10k / $100k / $1M in cents. Default $10k (decision D3). */
export const CASH_PRESETS = [100_000, 1_000_000, 10_000_000, 100_000_000] as const;
export const DEFAULT_STARTING_CASH = 1_000_000;

export function createAccount(startingCash: number = DEFAULT_STARTING_CASH, marks: Record<string, number> = {}, bar = 0): AccountState {
  if (!Number.isInteger(startingCash) || startingCash <= 0) throw new Error("starting cash must be a positive integer number of cents");
  return {
    startingCash,
    cash: startingCash,
    positions: {},
    orders: [],
    fills: [],
    realized: 0,
    bar,
    marks: { ...marks },
    equityCurve: [{ bar, cash: startingCash, equity: startingCash }],
    nextOrderSeq: 1,
  };
}

/** Reset = a brand-new account with the chosen starting cash (history cleared). */
export const resetAccount = (startingCash: number = DEFAULT_STARTING_CASH, marks: Record<string, number> = {}, bar = 0) => createAccount(startingCash, marks, bar);

export const workingOrders = (s: AccountState): Order[] => s.orders.filter((o) => o.status === "working");
export const reservedTotal = (s: AccountState) => workingOrders(s).reduce((a, o) => a + o.reserved, 0);
export const buyingPower = (s: AccountState) => s.cash - reservedTotal(s);
export const positionValue = (s: AccountState, p: Position) => p.qty * (s.marks[p.symbol] ?? 0);
export const positionsValue = (s: AccountState) => Object.values(s.positions).reduce((a, p) => a + positionValue(s, p), 0);
export const equity = (s: AccountState) => s.cash + positionsValue(s);
export const avgCost = (p: Position) => (p.qty > 0 ? p.costBasis / p.qty : 0);
export const unrealized = (s: AccountState) => Object.values(s.positions).reduce((a, p) => a + positionValue(s, p) - p.costBasis, 0);

/** Applies one fill to cash, positions and realised P&L. Throws on an impossible fill (callers check first). */
export function applyFill(s: AccountState, f: Omit<Fill, "realized">): { state: AccountState; fill: Fill } {
  if (!Number.isInteger(f.qty) || f.qty <= 0 || !Number.isInteger(f.price) || f.price <= 0) throw new Error("fill qty and price must be positive integers");
  const pos = s.positions[f.symbol] ?? { symbol: f.symbol, qty: 0, costBasis: 0 };
  const notional = f.qty * f.price;
  if (f.side === "buy") {
    if (notional > s.cash) throw new Error("fill exceeds cash");
    const next: Position = { symbol: f.symbol, qty: pos.qty + f.qty, costBasis: pos.costBasis + notional };
    const fill: Fill = { ...f, realized: 0 };
    return { state: { ...s, cash: s.cash - notional, positions: { ...s.positions, [f.symbol]: next }, fills: [...s.fills, fill] }, fill };
  }
  if (f.qty > pos.qty) throw new Error("sell exceeds position (no shorting in v1)");
  const removed = f.qty === pos.qty ? pos.costBasis : Math.round((pos.costBasis * f.qty) / pos.qty);
  const realized = notional - removed;
  const positions = { ...s.positions };
  if (f.qty === pos.qty) delete positions[f.symbol];
  else positions[f.symbol] = { symbol: f.symbol, qty: pos.qty - f.qty, costBasis: pos.costBasis - removed };
  const fill: Fill = { ...f, realized };
  return { state: { ...s, cash: s.cash + notional, positions, realized: s.realized + realized, fills: [...s.fills, fill] }, fill };
}

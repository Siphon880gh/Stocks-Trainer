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
import type { AccountState, Fill, Order, PaperOptions, Position } from "./types";

/** BA11.M2: Reg T initial margin on a short sale (50% of its value) and the 30% maintenance level used for the warning. */
export const SHORT_INITIAL_MARGIN = 0.5;
export const SHORT_MAINTENANCE = 0.3;

/** $1k / $10k / $100k / $1M in cents. Default $10k (decision D3). */
export const CASH_PRESETS = [100_000, 1_000_000, 10_000_000, 100_000_000] as const;
export const DEFAULT_STARTING_CASH = 1_000_000;

/** BA11.M3: share quantities are rounded to 4 decimals (fractional sessions); whole shares stay exact. */
export const FRACTION_DIGITS = 4;
export const q4 = (x: number) => Math.round(x * 10 ** FRACTION_DIGITS) / 10 ** FRACTION_DIGITS;
export const isQ4 = (x: number) => Math.abs(x * 10 ** FRACTION_DIGITS - Math.round(x * 10 ** FRACTION_DIGITS)) < 1e-6;
/** Cents for qty × price (rounded to the cent; exact for whole shares). */
export const notionalOf = (qty: number, price: number) => Math.round(qty * price);

export function createAccount(startingCash: number = DEFAULT_STARTING_CASH, marks: Record<string, number> = {}, bar = 0, options?: PaperOptions): AccountState {
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
    ...(options && Object.values(options).some(Boolean) ? { options: { ...options } } : {}),
  };
}

/** Reset = a brand-new account with the chosen starting cash (history cleared). */
export const resetAccount = (startingCash: number = DEFAULT_STARTING_CASH, marks: Record<string, number> = {}, bar = 0) => createAccount(startingCash, marks, bar);

export const workingOrders = (s: AccountState): Order[] => s.orders.filter((o) => o.status === "working");
export const reservedTotal = (s: AccountState) => workingOrders(s).reduce((a, o) => a + o.reserved, 0);
/** BA11.M2: short positions hold back their current value (the sale proceeds) plus 50% initial margin. */
export const shortValue = (s: AccountState) => Object.values(s.positions).reduce((a, p) => a + (p.qty < 0 ? notionalOf(-p.qty, s.marks[p.symbol] ?? 0) : 0), 0);
export const shortRequirement = (s: AccountState) => Math.ceil(shortValue(s) * (1 + SHORT_INITIAL_MARGIN));
export const buyingPower = (s: AccountState) => s.cash - reservedTotal(s) - shortRequirement(s);
/** BA11.M2: equity below 30% of the short value would bring a maintenance margin call at a broker (warning only here). */
export const marginCall = (s: AccountState) => shortValue(s) > 0 && equity(s) < SHORT_MAINTENANCE * shortValue(s);
export const positionValue = (s: AccountState, p: Position) => notionalOf(p.qty, s.marks[p.symbol] ?? 0);
export const positionsValue = (s: AccountState) => Object.values(s.positions).reduce((a, p) => a + positionValue(s, p), 0);
export const equity = (s: AccountState) => s.cash + positionsValue(s);
export const avgCost = (p: Position) => (p.qty !== 0 ? p.costBasis / p.qty : 0);
export const unrealized = (s: AccountState) => Object.values(s.positions).reduce((a, p) => a + positionValue(s, p) - p.costBasis, 0);

/**
 * Applies one fill to cash, positions and realised P&L. Throws on an impossible fill (callers check first).
 * BA11.M2: a sell with no long position opens / adds to a short (costBasis −proceeds); a buy on a short covers it.
 * One fill never flips a position from long to short or back.
 */
export function applyFill(s: AccountState, f: Omit<Fill, "realized">): { state: AccountState; fill: Fill } {
  const qtyOk = s.options?.fractional ? isQ4(f.qty) : Number.isInteger(f.qty);
  if (!qtyOk || f.qty <= 0 || !Number.isInteger(f.price) || f.price <= 0) throw new Error("fill qty and price must be positive integers");
  const pos = s.positions[f.symbol] ?? { symbol: f.symbol, qty: 0, costBasis: 0 };
  const notional = notionalOf(f.qty, f.price);
  const d = f.side === "buy" ? f.qty : -f.qty;
  const fee = f.fee ?? 0;
  // Signed cash flow of the fill. Fees go into the cost basis (buys) or come off the proceeds (sells), as on a
  // broker's cost-basis report, so realised + unrealised = total P&L still holds with costs on.
  const cf = (f.side === "buy" ? -notional : notional) - fee;
  const cash = s.cash + cf;
  if (pos.qty === 0 || Math.sign(pos.qty) === Math.sign(d)) {
    if (d > 0 && notional + fee > s.cash) throw new Error("fill exceeds cash");
    if (d < 0 && !s.options?.allowShort) throw new Error("sell exceeds position (no shorting in v1)");
    const next: Position = { symbol: f.symbol, qty: q4(pos.qty + d), costBasis: pos.costBasis - cf };
    const fill: Fill = { ...f, realized: 0 };
    return { state: { ...s, cash, positions: { ...s.positions, [f.symbol]: next }, fills: [...s.fills, fill] }, fill };
  }
  const held = Math.abs(pos.qty);
  if (q4(f.qty) > q4(held)) throw new Error(d < 0 ? "sell exceeds position (no shorting in v1)" : "cover exceeds the short position");
  const removed = q4(f.qty) === q4(held) ? pos.costBasis : Math.round((pos.costBasis * f.qty) / held);
  const realized = cf - removed;
  const positions = { ...s.positions };
  if (q4(f.qty) === q4(held)) delete positions[f.symbol];
  else positions[f.symbol] = { symbol: f.symbol, qty: q4(pos.qty + d), costBasis: pos.costBasis - removed };
  const fill: Fill = { ...f, realized };
  return { state: { ...s, cash, positions, realized: s.realized + realized, fills: [...s.fills, fill] }, fill };
}

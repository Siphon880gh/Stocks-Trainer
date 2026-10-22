/**
 * Paper-trading types (BA4). SIMULATED — virtual money, SAMPLE prices, not a brokerage, not trading advice.
 * Money is integer cents everywhere; shares are integers; fees are 0 (decision D4).
 */

export type Side = "buy" | "sell";
export type OrderType = "market" | "limit" | "stop" | "stop-limit" | "trailing-stop";
/** Day = only the next session (one bar = one session in v1); GTC = until filled or cancelled. */
export type TimeInForce = "day" | "gtc";

export const ORDER_TYPES: readonly OrderType[] = ["market", "limit", "stop", "stop-limit", "trailing-stop"];
export const SIDES: readonly Side[] = ["buy", "sell"];
export const TIFS: readonly TimeInForce[] = ["day", "gtc"];

/** What the learner asks for. Prices in cents. */
export interface OrderSpec {
  symbol: string;
  side: Side;
  type: OrderType;
  qty: number;
  tif: TimeInForce;
  /** limit and stop-limit */
  limitPrice?: number;
  /** stop and stop-limit (the trigger) */
  stopPrice?: number;
  /** trailing-stop: a fixed distance in cents, or … */
  trailAmount?: number;
  /** … a percent of the peak (0 < p < 50). */
  trailPercent?: number;
}

export type OrderStatus = "working" | "filled" | "cancelled" | "expired" | "rejected";

export interface Order extends OrderSpec {
  id: string;
  /** Placed after this bar closed; evaluated from bar placedAtBar + 1. */
  placedAtBar: number;
  status: OrderStatus;
  /** Cash held back for a working buy order (released exactly on fill / cancel / expire). */
  reserved: number;
  /** stop-limit: the stop has triggered and the order now works as a limit. */
  triggered?: boolean;
  /** trailing-stop: highest high seen so far and the current stop level. */
  peak?: number;
  trailStop?: number;
  closedAtBar?: number;
  fillPrice?: number;
  /** Plain-language reason for a rejection / expiry. */
  reason?: string;
}

export interface Fill {
  orderId: string;
  bar: number;
  symbol: string;
  side: Side;
  qty: number;
  /** cents per share */
  price: number;
  /** Realised P&L of this fill (sells only; 0 for buys). */
  realized: number;
}

export interface Position {
  symbol: string;
  qty: number;
  /** Total cost basis in cents (avg cost = costBasis / qty). */
  costBasis: number;
}

/** One bar in cents. */
export interface PaperBar {
  open: number;
  high: number;
  low: number;
  close: number;
  label?: string;
}

export interface EquityPoint {
  bar: number;
  cash: number;
  equity: number;
}

export interface AccountState {
  startingCash: number;
  cash: number;
  positions: Record<string, Position>;
  orders: Order[];
  fills: Fill[];
  /** Σ realised P&L of every sell fill. */
  realized: number;
  /** Index of the last bar that has closed (the learner sees bars 0..bar). */
  bar: number;
  /** Last close per symbol (the mark). */
  marks: Record<string, number>;
  equityCurve: EquityPoint[];
  nextOrderSeq: number;
}

/** A persisted session is an action log replayed through the deterministic engine. */
export type PaperAction =
  | { type: "place"; atBar: number; spec: OrderSpec }
  | { type: "cancel"; atBar: number; orderId: string };

export interface PaperSessionLog {
  tapeId: string;
  startingCash: number;
  /** Last visible bar index. */
  bar: number;
  actions: PaperAction[];
}

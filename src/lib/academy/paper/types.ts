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
  /** BA11.M3: dollar-amount market buy (cents). qty is then the estimate at the last close; the fill buys
   *  floor(amount ÷ fill price) to 4 decimals. */
  amount?: number;
}

/** BA11 stretch switches, chosen when a session starts (all off = the core Academy rules). */
export interface PaperOptions {
  /** BA11.M2: short selling on margin (50% Reg T initial margin reserved; no borrow fees or buy-ins). */
  allowShort?: boolean;
  /** BA11.M3: fractional shares (up to 4 decimals) and dollar-amount market buys. */
  fractional?: boolean;
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
  /** Stop level when the order was placed (trailing-stop: from the price at placement). Used for R. */
  initialStop?: number;
  closedAtBar?: number;
  fillPrice?: number;
  /** Plain-language reason for a rejection / expiry. */
  reason?: string;
  /** BA11.M1 linked orders: an OTO exit waits for its parent entry to fill before it works. */
  parentId?: string;
  waiting?: boolean;
  /** BA11.M1: orders sharing an OCO group cancel each other when one fills. */
  ocoGroup?: string;
  /** BA11.M1: the order's part in a bracket. */
  role?: "entry" | "stop" | "target";
  /** BA11.M2: this sell opens or adds to a short; this buy covers a short. Fixed at placement. */
  opensShort?: boolean;
  covers?: boolean;
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
  /** Shares held; negative = a short position (BA11.M2). */
  qty: number;
  /** Total cost basis in cents (avg cost = costBasis / qty). For a short it is −(sale proceeds). */
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
  /** BA11 stretch switches (absent = core rules). */
  options?: PaperOptions;
}

/** A persisted session is an action log replayed through the deterministic engine. */
export type PaperAction =
  | { type: "place"; atBar: number; spec: OrderSpec }
  | { type: "cancel"; atBar: number; orderId: string }
  | { type: "bracket"; atBar: number; entry: OrderSpec; stopPrice?: number; targetPrice?: number }
  | { type: "oco"; atBar: number; a: OrderSpec; b: OrderSpec };

export interface PaperSessionLog {
  tapeId: string;
  startingCash: number;
  /** Last visible bar index. */
  bar: number;
  actions: PaperAction[];
  /** BA11 stretch switches for this session (absent = core rules). */
  options?: PaperOptions;
}

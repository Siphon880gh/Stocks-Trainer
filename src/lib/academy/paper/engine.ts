/**
 * BA4.M3: deterministic bar-based matching engine. SIMULATED — virtual money, SAMPLE prices, not a brokerage.
 *
 * Fill rules (normative, from EPICS BA4; engine.test.ts locks each one):
 * - Orders placed after bar t closes are evaluated from bar t + 1, in the order they were placed.
 * - Market: fills at the bar's open.
 * - Buy limit L: fills at min(open, L) if low ≤ L. Sell limit L: fills at max(open, L) if high ≥ L.
 * - Buy stop S: triggers if high ≥ S, fills at max(open, S). Sell stop S: triggers if low ≤ S, fills at min(open, S).
 *   A gap through the stop fills at the open.
 * - Stop-limit (S, L): triggers like a stop. On the trigger bar the trigger price t = max(open, S) (buy) or
 *   min(open, S) (sell) fills only if it is within the limit (t ≤ L buy, t ≥ L sell); a bar that gaps past
 *   the limit does not fill. From the next bar on it works as a plain limit at L.
 * - Trailing stop (sell only in v1): stop = peak − amount, or round(peak × (1 − p%)), where the peak starts at
 *   the last close when placed and then rises with each bar's high. Each bar is checked against the stop from
 *   before that bar (stop rule), then the peak and stop ratchet up. The stop never moves down.
 * - Day: evaluated on the next bar only, then expires. GTC: until filled or cancelled.
 * - At the fill a buy needs cash − (other orders' reservations) ≥ qty × price (a gap beyond the reservation
 *   buffer can reject it); a sell needs the shares still held (if an earlier exit already sold them, it is
 *   cancelled). Cancel, fill, reject and expire release the reservation exactly.
 * - Fees 0, integer cents, integer shares.
 */
import type { AccountState, Order, OrderSpec, PaperBar } from "./types";
import { applyFill, equity, reservedTotal } from "./account";
import { validateOrder, type MarketContext, type Validation } from "./validate";

export const trailLevel = (peak: number, spec: Pick<OrderSpec, "trailAmount" | "trailPercent">) =>
  spec.trailAmount !== undefined ? peak - spec.trailAmount : Math.round(peak * (1 - (spec.trailPercent ?? 0) / 100));

export interface PlaceResult {
  state: AccountState;
  order: Order;
  validation: Validation;
}

/** Validates and places an order after the current bar closed. A rejected order is kept in history with its reason. */
export function placeOrder(state: AccountState, spec: OrderSpec, ctx: MarketContext): PlaceResult {
  const validation = validateOrder(state, spec, ctx);
  const id = `o${state.nextOrderSeq}`;
  const base: Order = { ...spec, id, placedAtBar: state.bar, status: "working", reserved: 0 };
  let order: Order;
  if (!validation.ok) {
    order = { ...base, status: "rejected", closedAtBar: state.bar, reason: validation.errors.map((e) => e.message).join(" ") };
  } else {
    order = { ...base, reserved: validation.reservation };
    if (spec.type === "stop" || spec.type === "stop-limit") order.initialStop = spec.stopPrice;
    if (spec.type === "trailing-stop") {
      const peak = ctx.lastClose[spec.symbol]!;
      order.peak = peak;
      order.trailStop = trailLevel(peak, spec);
      order.initialStop = order.trailStop;
    }
  }
  return { state: { ...state, orders: [...state.orders, order], nextOrderSeq: state.nextOrderSeq + 1 }, order, validation };
}

const close = (o: Order, status: Order["status"], bar: number, extra: Partial<Order> = {}): Order => ({ ...o, ...extra, status, reserved: 0, closedAtBar: bar });

export function cancelOrder(state: AccountState, orderId: string): AccountState {
  const target = state.orders.find((o) => o.id === orderId);
  const s = { ...state, orders: state.orders.map((o) => (o.id === orderId && o.status === "working" ? close(o, "cancelled", state.bar, { reason: "Cancelled by you." }) : o)) };
  return target && target.status === "working" ? cancelWaitingChildren(s, orderId, state.bar) : s;
}

/** BA11.M1: an entry that will never fill takes its waiting exits with it. */
function cancelWaitingChildren(s: AccountState, parentId: string, bar: number): AccountState {
  return { ...s, orders: s.orders.map((o) => (o.parentId === parentId && o.waiting && o.status === "working" ? close(o, "cancelled", bar, { waiting: false, reason: "Cancelled: its entry order did not fill." }) : o)) };
}

/** BA11.M1: after `done` closed on bar t, wake its exits (filled) or cancel them (not filled), and cancel its OCO partners. */
function settleLinks(s: AccountState, done: Order, t: number): AccountState {
  if (done.status === "filled") {
    let orders = s.orders.map((o) => (o.parentId === done.id && o.waiting && o.status === "working" ? { ...o, waiting: false, placedAtBar: t } : o));
    if (done.ocoGroup) orders = orders.map((o) => (o.id !== done.id && o.ocoGroup === done.ocoGroup && o.status === "working" ? close(o, "cancelled", t, { waiting: false, reason: "Cancelled: the other order in its OCO pair filled." }) : o));
    return { ...s, orders };
  }
  return cancelWaitingChildren(s, done.id, t);
}

/** Cancel + place a new order with the new spec (the old order keeps its history). */
export function replaceOrder(state: AccountState, orderId: string, spec: OrderSpec, ctx: MarketContext): PlaceResult {
  return placeOrder(cancelOrder(state, orderId), spec, ctx);
}

/** Price this order fills at on `bar`, or null. May update stop-limit / trailing state via the returned order. */
function evaluate(o: Order, bar: PaperBar): { price: number | null; order: Order } {
  const { open, high, low } = bar;
  const buy = o.side === "buy";
  switch (o.type) {
    case "market":
      return { price: open, order: o };
    case "limit": {
      const L = o.limitPrice!;
      if (buy) return { price: low <= L ? Math.min(open, L) : null, order: o };
      return { price: high >= L ? Math.max(open, L) : null, order: o };
    }
    case "stop": {
      const S = o.stopPrice!;
      if (buy) return { price: high >= S ? Math.max(open, S) : null, order: o };
      return { price: low <= S ? Math.min(open, S) : null, order: o };
    }
    case "stop-limit": {
      const S = o.stopPrice!;
      const L = o.limitPrice!;
      if (o.triggered) {
        if (buy) return { price: low <= L ? Math.min(open, L) : null, order: o };
        return { price: high >= L ? Math.max(open, L) : null, order: o };
      }
      if (buy ? high >= S : low <= S) {
        const t = buy ? Math.max(open, S) : Math.min(open, S);
        const within = buy ? t <= L : t >= L;
        return { price: within ? t : null, order: { ...o, triggered: true } };
      }
      return { price: null, order: o };
    }
    case "trailing-stop": {
      const stop = o.trailStop!;
      if (low <= stop) return { price: Math.min(open, stop), order: o };
      const peak = Math.max(o.peak!, high);
      return { price: null, order: { ...o, peak, trailStop: Math.max(stop, trailLevel(peak, o)) } };
    }
  }
}

/** Advances one bar: evaluates working orders against `bars[symbol]`, marks to the closes, records equity. */
export function stepBar(state: AccountState, bars: Record<string, PaperBar>): AccountState {
  const t = state.bar + 1;
  let s: AccountState = { ...state, bar: t };
  const ids = s.orders.filter((o) => o.status === "working" && o.placedAtBar < t).map((o) => o.id);
  for (const id of ids) {
    const o = s.orders.find((x) => x.id === id)!;
    // An earlier order this bar may have closed it (OCO partner) or it may still wait for its entry (OTO).
    if (o.status !== "working" || o.waiting || o.placedAtBar >= t) continue;
    const bar = bars[o.symbol];
    if (!bar) continue;
    const { price, order } = evaluate(o, bar);
    let next: Order = order;
    if (price !== null) {
      if (o.side === "buy") {
        const available = s.cash - (reservedTotal(s) - o.reserved);
        if (o.qty * price > available) {
          next = close(order, "rejected", t, { reason: `Not enough cash at the fill price $${(price / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} after the price moved (a gap past the reserved amount).` });
        } else {
          s = applyFill(s, { orderId: o.id, bar: t, symbol: o.symbol, side: "buy", qty: o.qty, price }).state;
          next = close(order, "filled", t, { fillPrice: price });
        }
      } else {
        const held = s.positions[o.symbol]?.qty ?? 0;
        if (o.qty > held) {
          next = close(order, "cancelled", t, { reason: held === 0 ? "The position was already closed by another order." : `Only ${held} shares were left to sell.` });
        } else {
          s = applyFill(s, { orderId: o.id, bar: t, symbol: o.symbol, side: "sell", qty: o.qty, price }).state;
          next = close(order, "filled", t, { fillPrice: price });
        }
      }
    } else if (o.tif === "day") {
      next = close(order, "expired", t, { reason: next.triggered ? "Day stop-limit triggered but the limit was not reached; it expired at the end of the session." : "Day order did not fill and expired at the end of the session." });
    }
    s = { ...s, orders: s.orders.map((x) => (x.id === id ? next : x)) };
    if (next.status !== "working") s = settleLinks(s, next, t);
  }
  const marks = { ...s.marks };
  for (const [sym, b] of Object.entries(bars)) marks[sym] = b.close;
  s = { ...s, marks };
  return { ...s, equityCurve: [...s.equityCurve, { bar: t, cash: s.cash, equity: equity(s) }] };
}

/** Convenience: market context from the current marks. */
export const contextFrom = (s: AccountState): MarketContext => ({ lastClose: { ...s.marks } });

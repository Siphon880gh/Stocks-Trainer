/**
 * BA11.M1: linked orders. SIMULATED — virtual money, SAMPLE prices.
 * - Bracket (OTO + OCO): a buy entry; when it fills, a sell stop (protective) and / or a sell limit (target) start
 *   working on the next bar as an OCO pair for the same shares. If the entry expires, is cancelled or rejected,
 *   the exits are cancelled.
 * - OCO: two sell orders on shares you hold; when one fills, the other is cancelled.
 * - Same-bar rule: exits are evaluated in placement order and the stop is placed first, so a bar that touches both
 *   the stop and the target fills the stop (bar data cannot show which came first; the conservative reading).
 */
import type { AccountState, Order, OrderSpec } from "./types";
import { placeOrder } from "./engine";
import { validateOrder, type Issue, type MarketContext } from "./validate";

export type LinkCode = "BRACKET_NEEDS_EXIT" | "BRACKET_ENTRY_NOT_BUY" | "BRACKET_ENTRY_TYPE" | "BRACKET_STOP_NOT_BELOW" | "BRACKET_TARGET_NOT_ABOVE" | "BRACKET_PRICE_INVALID" | "OCO_NOT_SELLS" | "OCO_DIFFERENT_SYMBOL";

export interface LinkedResult {
  state: AccountState;
  orders: Order[];
  ok: boolean;
  errors: { code: string; message: string }[];
  warnings: Issue[];
}

const $ = (c: number) => `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** The price the entry is expected near: its limit / stop, or the last close for a market order. */
export function entryReference(spec: OrderSpec, last: number): number {
  if (spec.type === "limit") return spec.limitPrice ?? last;
  if (spec.type === "stop") return spec.stopPrice ?? last;
  if (spec.type === "stop-limit") return spec.limitPrice ?? last;
  return last;
}

export function validateBracket(state: AccountState, entry: OrderSpec, stopPrice: number | undefined, targetPrice: number | undefined, ctx: MarketContext) {
  const errors: { code: string; message: string }[] = [];
  const e = (code: LinkCode, message: string) => errors.push({ code, message });
  const v = validateOrder(state, entry, ctx);
  errors.push(...v.errors);
  if (entry.side !== "buy") e("BRACKET_ENTRY_NOT_BUY", "A bracket starts with a buy (long-only in this simulator).");
  if (entry.type === "trailing-stop") e("BRACKET_ENTRY_TYPE", "Use a market, limit, stop or stop-limit entry for a bracket.");
  if (stopPrice === undefined && targetPrice === undefined) e("BRACKET_NEEDS_EXIT", "Add a stop, a target or both.");
  for (const p of [stopPrice, targetPrice]) if (p !== undefined && (!(p > 0) || !Number.isInteger(p))) e("BRACKET_PRICE_INVALID", "Exit prices must be above $0, in whole cents.");
  const last = ctx.lastClose[entry.symbol];
  if (last !== undefined) {
    const ref = entryReference(entry, last);
    if (stopPrice !== undefined && stopPrice >= ref) e("BRACKET_STOP_NOT_BELOW", `The protective stop must be below the entry (${$(ref)}).`);
    if (targetPrice !== undefined && targetPrice <= ref) e("BRACKET_TARGET_NOT_ABOVE", `The target must be above the entry (${$(ref)}).`);
  }
  return { ok: errors.length === 0, errors, warnings: v.warnings, reservation: v.reservation };
}

export function placeBracket(state: AccountState, entry: OrderSpec, stopPrice: number | undefined, targetPrice: number | undefined, ctx: MarketContext): LinkedResult {
  const v = validateBracket(state, entry, stopPrice, targetPrice, ctx);
  if (!v.ok) {
    const r = placeOrder(state, entry, ctx);
    // keep a rejected entry in history with every reason (placeOrder only knows the single-order checks)
    const order: Order = { ...r.order, status: "rejected", reserved: 0, closedAtBar: state.bar, reason: v.errors.map((x) => x.message).join(" ") };
    return { state: { ...r.state, orders: r.state.orders.map((o) => (o.id === order.id ? order : o)) }, orders: [order], ok: false, errors: v.errors, warnings: v.warnings };
  }
  const r = placeOrder(state, entry, ctx);
  const entryOrder: Order = { ...r.order, role: "entry" };
  let s: AccountState = { ...r.state, orders: r.state.orders.map((o) => (o.id === entryOrder.id ? entryOrder : o)) };
  const group = stopPrice !== undefined && targetPrice !== undefined ? `oco-${entryOrder.id}` : undefined;
  const exits: Order[] = [];
  const add = (spec: OrderSpec, role: "stop" | "target") => {
    const o: Order = { ...spec, id: `o${s.nextOrderSeq}`, placedAtBar: state.bar, status: "working", reserved: 0, parentId: entryOrder.id, waiting: true, role, ocoGroup: group };
    if (spec.type === "stop") o.initialStop = spec.stopPrice;
    s = { ...s, orders: [...s.orders, o], nextOrderSeq: s.nextOrderSeq + 1 };
    exits.push(o);
  };
  if (stopPrice !== undefined) add({ symbol: entry.symbol, side: "sell", type: "stop", stopPrice, qty: entry.qty, tif: "gtc" }, "stop");
  if (targetPrice !== undefined) add({ symbol: entry.symbol, side: "sell", type: "limit", limitPrice: targetPrice, qty: entry.qty, tif: "gtc" }, "target");
  return { state: s, orders: [entryOrder, ...exits], ok: true, errors: [], warnings: v.warnings };
}

export function validateOco(state: AccountState, a: OrderSpec, b: OrderSpec, ctx: MarketContext) {
  const errors: { code: string; message: string }[] = [];
  if (a.side !== "sell" || b.side !== "sell") errors.push({ code: "OCO_NOT_SELLS", message: "An OCO pair here is two sell orders on shares you hold (for example a stop below and a target above)." });
  if (a.symbol !== b.symbol) errors.push({ code: "OCO_DIFFERENT_SYMBOL", message: "Both orders of an OCO pair must be for the same stock." });
  const va = validateOrder(state, a, ctx);
  const vb = validateOrder(state, b, ctx);
  errors.push(...va.errors, ...vb.errors.filter((x) => !va.errors.some((y) => y.code === x.code)));
  return { ok: errors.length === 0, errors, warnings: [...va.warnings, ...vb.warnings] };
}

export function placeOco(state: AccountState, a: OrderSpec, b: OrderSpec, ctx: MarketContext): LinkedResult {
  const v = validateOco(state, a, b, ctx);
  if (!v.ok) return { state, orders: [], ok: false, errors: v.errors, warnings: v.warnings };
  const ra = placeOrder(state, a, ctx);
  const rb = placeOrder(ra.state, b, ctx);
  const group = `oco-${ra.order.id}`;
  const s = { ...rb.state, orders: rb.state.orders.map((o) => (o.id === ra.order.id || o.id === rb.order.id ? { ...o, ocoGroup: group } : o)) };
  return { state: s, orders: s.orders.filter((o) => o.ocoGroup === group), ok: true, errors: [], warnings: v.warnings };
}

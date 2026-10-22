/**
 * BA4.M2: order validation. Each rule has a stable code and a plain-language message.
 * Errors reject the order; warnings are shown but do not block it.
 *
 * Buying-power check (cash account, no margin): the order's reservation must fit in buying power.
 * - buy limit / buy stop-limit: qty × limit (it can never fill above the limit)
 * - buy market / buy stop: ceil(qty × reference × 1.05) where reference = last close (market) or the stop;
 *   the 5% buffer covers a gap at the next open. A gap beyond the buffer is re-checked at the fill.
 * Sells reserve no cash; v1 is long-only, so a sell must not exceed the shares held.
 */
import type { AccountState, OrderSpec } from "./types";
import { ORDER_TYPES, TIFS } from "./types";
import { buyingPower } from "./account";

export const MARKET_BUFFER = 0.05;
export const MAX_TRAIL_PERCENT = 50;

export type ValidationCode =
  | "QTY_NOT_POSITIVE"
  | "QTY_NOT_INTEGER"
  | "UNKNOWN_SYMBOL"
  | "UNKNOWN_TYPE"
  | "UNKNOWN_SIDE"
  | "UNKNOWN_TIF"
  | "SHORT_NOT_ALLOWED"
  | "SELL_EXCEEDS_POSITION"
  | "INSUFFICIENT_BUYING_POWER"
  | "LIMIT_REQUIRED"
  | "LIMIT_NOT_POSITIVE"
  | "STOP_REQUIRED"
  | "STOP_NOT_POSITIVE"
  | "PRICE_NOT_INTEGER_CENTS"
  | "STOP_LIMIT_WRONG_SIDE"
  | "TRAIL_REQUIRED"
  | "TRAIL_BOTH"
  | "TRAIL_AMOUNT_RANGE"
  | "TRAIL_PERCENT_RANGE"
  | "TRAIL_BUY_NOT_SUPPORTED"
  | "PRICE_NOT_ALLOWED"
  | "MARKETABLE_LIMIT"
  | "BUY_STOP_AT_OR_BELOW_MARKET"
  | "SELL_STOP_AT_OR_ABOVE_MARKET"
  | "LARGE_POSITION";

export interface Issue {
  code: ValidationCode;
  message: string;
}

export interface Validation {
  ok: boolean;
  errors: Issue[];
  warnings: Issue[];
  /** Cash this order would hold back while working (0 for sells). */
  reservation: number;
}

export interface MarketContext {
  /** symbol → last close in cents */
  lastClose: Record<string, number>;
}

const $ = (c: number) => `$${(c / 100).toFixed(2)}`;

export function reservationFor(spec: OrderSpec, lastClose: number): number {
  if (spec.side !== "buy") return 0;
  switch (spec.type) {
    case "limit":
    case "stop-limit":
      return spec.qty * (spec.limitPrice ?? 0);
    case "market":
      return Math.ceil(spec.qty * lastClose * (1 + MARKET_BUFFER));
    case "stop":
      return Math.ceil(spec.qty * (spec.stopPrice ?? 0) * (1 + MARKET_BUFFER));
    case "trailing-stop":
      return 0;
  }
}

export function validateOrder(state: AccountState, spec: OrderSpec, ctx: MarketContext): Validation {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const e = (code: ValidationCode, message: string) => errors.push({ code, message });
  const w = (code: ValidationCode, message: string) => warnings.push({ code, message });
  const last = ctx.lastClose[spec.symbol];

  if (last === undefined) e("UNKNOWN_SYMBOL", `${spec.symbol || "That symbol"} is not on this practice tape.`);
  if (spec.side !== "buy" && spec.side !== "sell") e("UNKNOWN_SIDE", "Choose buy or sell.");
  if (!ORDER_TYPES.includes(spec.type)) e("UNKNOWN_TYPE", "Choose an order type.");
  if (!TIFS.includes(spec.tif)) e("UNKNOWN_TIF", "Choose Day or GTC.");
  if (!(spec.qty > 0)) e("QTY_NOT_POSITIVE", "Quantity must be at least 1 share.");
  else if (!Number.isInteger(spec.qty)) e("QTY_NOT_INTEGER", "Whole shares only (fractional shares are not in the core Academy).");

  const needsLimit = spec.type === "limit" || spec.type === "stop-limit";
  const needsStop = spec.type === "stop" || spec.type === "stop-limit";
  for (const [field, needed, label] of [
    ["limitPrice", needsLimit, "limit"],
    ["stopPrice", needsStop, "stop"],
  ] as const) {
    const v = spec[field];
    if (needed) {
      if (v === undefined || v === null || Number.isNaN(v)) e(field === "limitPrice" ? "LIMIT_REQUIRED" : "STOP_REQUIRED", `Enter a ${label} price.`);
      else if (!(v > 0)) e(field === "limitPrice" ? "LIMIT_NOT_POSITIVE" : "STOP_NOT_POSITIVE", `The ${label} price must be above $0.`);
      else if (!Number.isInteger(v)) e("PRICE_NOT_INTEGER_CENTS", `Prices are in whole cents.`);
    } else if (v !== undefined) e("PRICE_NOT_ALLOWED", `A ${spec.type} order has no ${label} price.`);
  }

  if (spec.type === "stop-limit" && spec.limitPrice && spec.stopPrice && spec.limitPrice > 0 && spec.stopPrice > 0) {
    if (spec.side === "buy" && spec.limitPrice < spec.stopPrice) e("STOP_LIMIT_WRONG_SIDE", "For a buy stop-limit the limit must be at or above the stop, or it can never fill once triggered.");
    if (spec.side === "sell" && spec.limitPrice > spec.stopPrice) e("STOP_LIMIT_WRONG_SIDE", "For a sell stop-limit the limit must be at or below the stop, or it can never fill once triggered.");
  }

  if (spec.type === "trailing-stop") {
    const hasA = spec.trailAmount !== undefined;
    const hasP = spec.trailPercent !== undefined;
    if (spec.side === "buy") e("TRAIL_BUY_NOT_SUPPORTED", "Trailing stops are sell-side only in v1 (they protect a long position).");
    if (!hasA && !hasP) e("TRAIL_REQUIRED", "Enter a trail amount ($) or a trail percent.");
    if (hasA && hasP) e("TRAIL_BOTH", "Use either a trail amount or a trail percent, not both.");
    if (hasA && !hasP) {
      const a = spec.trailAmount!;
      if (!(a > 0) || !Number.isInteger(a) || (last !== undefined && a >= last)) e("TRAIL_AMOUNT_RANGE", `The trail amount must be above $0 and below the price${last !== undefined ? ` (${$(last)})` : ""}, in whole cents.`);
    }
    if (hasP && !hasA) {
      const p = spec.trailPercent!;
      if (!(p > 0) || p >= MAX_TRAIL_PERCENT) e("TRAIL_PERCENT_RANGE", `The trail percent must be above 0% and below ${MAX_TRAIL_PERCENT}%.`);
    }
  } else {
    if (spec.trailAmount !== undefined || spec.trailPercent !== undefined) e("PRICE_NOT_ALLOWED", "Only trailing stops have a trail.");
  }

  const held = state.positions[spec.symbol]?.qty ?? 0;
  if (spec.side === "sell" && spec.qty > 0) {
    if (held === 0) e("SHORT_NOT_ALLOWED", "You do not own this stock. Selling it would be a short sale, which the core Academy does not allow.");
    else if (spec.qty > held) e("SELL_EXCEEDS_POSITION", `You own ${held} shares; you cannot sell ${spec.qty} (no shorting in v1).`);
  }

  let reservation = 0;
  if (last !== undefined && errors.length === 0) {
    reservation = reservationFor(spec, last);
    if (spec.side === "buy" && reservation > buyingPower(state)) {
      e("INSUFFICIENT_BUYING_POWER", `This order needs ${$(reservation)} of buying power; you have ${$(buyingPower(state))}.`);
    }
    if (spec.type === "limit" && spec.limitPrice) {
      if (spec.side === "buy" && spec.limitPrice >= last) w("MARKETABLE_LIMIT", `Your buy limit ${$(spec.limitPrice)} is at or above the last price ${$(last)}: it will probably fill right away, at the open or better.`);
      if (spec.side === "sell" && spec.limitPrice <= last) w("MARKETABLE_LIMIT", `Your sell limit ${$(spec.limitPrice)} is at or below the last price ${$(last)}: it will probably fill right away.`);
    }
    if ((spec.type === "stop" || spec.type === "stop-limit") && spec.stopPrice) {
      if (spec.side === "buy" && spec.stopPrice <= last) w("BUY_STOP_AT_OR_BELOW_MARKET", `A buy stop at ${$(spec.stopPrice)} is at or below the last price ${$(last)}, so it triggers on the next bar. Did you mean a buy limit?`);
      if (spec.side === "sell" && spec.stopPrice >= last) w("SELL_STOP_AT_OR_ABOVE_MARKET", `A sell stop at ${$(spec.stopPrice)} is at or above the last price ${$(last)}, so it triggers on the next bar. Did you mean a sell limit?`);
    }
    if (spec.side === "buy" && state.cash > 0 && reservation > 0.5 * (state.cash + Object.values(state.positions).reduce((a, p) => a + p.qty * (ctx.lastClose[p.symbol] ?? 0), 0))) {
      w("LARGE_POSITION", "This one order is more than half of your account. Most beginner plans cap a single position well below that.");
    }
  }
  return { ok: errors.length === 0, errors, warnings, reservation: errors.length === 0 ? reservation : 0 };
}

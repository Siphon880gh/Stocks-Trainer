/**
 * BA4.M2: order validation. Each rule has a stable code and a plain-language message.
 * Errors reject the order; warnings are shown but do not block it.
 *
 * Buying-power check (cash account, no margin): the order's reservation must fit in buying power.
 * - buy limit / buy stop-limit: qty × limit (it can never fill above the limit)
 * - buy market / buy stop: ceil(qty × reference × 1.05) where reference = last close (market) or the stop;
 *   the 5% buffer covers a gap at the next open. A gap beyond the buffer is re-checked at the fill.
 * Sells reserve no cash; v1 is long-only, so a sell must not exceed the shares held.
 * BA11.M2 (session option allowShort): a sell with no long position is a short sale. It reserves
 * ceil(qty × reference × 1.05 × 50%) (Reg T initial margin; reference = last close, the stop, or the higher of
 * the limit and the last close) and once filled the short holds back its value + 50% (account.ts). A buy on a
 * short position covers it (no reservation; it releases margin). One order never flips long ↔ short.
 */
import type { AccountState, OrderSpec } from "./types";
import { ORDER_TYPES, TIFS } from "./types";
import { FRACTION_DIGITS, SHORT_INITIAL_MARGIN, buyingPower, isQ4 } from "./account";

/** BA11.M3: smallest dollar-amount order. */
export const MIN_DOLLAR_AMOUNT = 100;

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
  | "LARGE_POSITION"
  | "SHORT_TRAIL_NOT_SUPPORTED"
  | "COVER_EXCEEDS_SHORT"
  | "SHORT_SALE_RISK"
  | "QTY_TOO_PRECISE"
  | "FRACTIONAL_SHORT"
  | "DOLLAR_NEEDS_FRACTIONAL"
  | "DOLLAR_BUY_MARKET_ONLY"
  | "DOLLAR_AMOUNT_RANGE";

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
  /** BA11.M2: how this order meets the position (set only when shorting is on or a short is held). */
  opensShort?: boolean;
  covers?: boolean;
}

export interface MarketContext {
  /** symbol → last close in cents */
  lastClose: Record<string, number>;
}

const $ = (c: number) => `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** BA11.M2: margin a working short sale holds back. */
export function shortReservation(spec: OrderSpec, lastClose: number): number {
  const ref = spec.type === "stop" || spec.type === "stop-limit" ? (spec.stopPrice ?? 0) : spec.type === "limit" ? Math.max(spec.limitPrice ?? 0, lastClose) : lastClose;
  return Math.ceil(spec.qty * ref * (1 + MARKET_BUFFER) * SHORT_INITIAL_MARGIN);
}

export function reservationFor(spec: OrderSpec, lastClose: number): number {
  if (spec.side !== "buy") return 0;
  switch (spec.type) {
    case "limit":
    case "stop-limit":
      return Math.ceil(spec.qty * (spec.limitPrice ?? 0));
    case "market":
      // BA11.M3: a dollar-amount buy never spends more than its amount.
      if (spec.amount !== undefined) return spec.amount;
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
  const fractional = !!state.options?.fractional;
  if (spec.amount !== undefined) {
    if (!fractional) e("DOLLAR_NEEDS_FRACTIONAL", "Dollar-amount orders need fractional shares (a stretch rule chosen when the session starts).");
    if (spec.side !== "buy" || spec.type !== "market") e("DOLLAR_BUY_MARKET_ONLY", "Dollar amounts work with market buys only; enter shares for other orders.");
    if (!Number.isInteger(spec.amount) || spec.amount < MIN_DOLLAR_AMOUNT) e("DOLLAR_AMOUNT_RANGE", `Enter at least ${$(MIN_DOLLAR_AMOUNT)}, in whole cents.`);
  } else if (!(spec.qty > 0)) e("QTY_NOT_POSITIVE", fractional ? "Quantity must be above 0 shares." : "Quantity must be at least 1 share.");
  else if (!fractional && !Number.isInteger(spec.qty)) e("QTY_NOT_INTEGER", "Whole shares only (fractional shares are not in the core Academy).");
  else if (fractional && !isQ4(spec.qty)) e("QTY_TOO_PRECISE", `Fractional shares go to ${FRACTION_DIGITS} decimal places at most.`);

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
  const shortOk = !!state.options?.allowShort;
  const opensShort = spec.side === "sell" && held <= 0 && shortOk;
  const covers = spec.side === "buy" && held < 0;
  if (spec.side === "sell" && spec.qty > 0) {
    if (held === 0 && !shortOk) e("SHORT_NOT_ALLOWED", "You do not own this stock. Selling it would be a short sale, which the core Academy does not allow.");
    else if (held > 0 && spec.qty > held) e("SELL_EXCEEDS_POSITION", `You own ${held} shares; you cannot sell ${spec.qty} (no shorting in v1).`);
    if (opensShort && !Number.isInteger(spec.qty)) e("FRACTIONAL_SHORT", "Fractional shares cannot be sold short; use whole shares.");
    if (opensShort && spec.type === "trailing-stop") e("SHORT_TRAIL_NOT_SUPPORTED", "A trailing stop protects shares you own; it cannot open a short sale.");
  }
  if (covers && spec.qty > -held) e("COVER_EXCEEDS_SHORT", `You are short ${-held} shares; buy at most ${-held} to cover (one order never flips you from short to long).`);

  let reservation = 0;
  if (last !== undefined && errors.length === 0) {
    reservation = opensShort ? shortReservation(spec, last) : covers ? 0 : reservationFor(spec, last);
    if (opensShort) {
      if (reservation > buyingPower(state)) e("INSUFFICIENT_BUYING_POWER", `This short sale needs ${$(reservation)} of margin (50% of its value); you have ${$(buyingPower(state))} of buying power.`);
      w("SHORT_SALE_RISK", "Short sale: you profit if the price falls, but there is no ceiling on how high it can rise, so the possible loss is unlimited. A gap up can jump past a buy stop.");
    }
    if (spec.side === "buy" && !covers && reservation > buyingPower(state)) {
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
  return { ok: errors.length === 0, errors, warnings, reservation: errors.length === 0 ? reservation : 0, opensShort: opensShort || undefined, covers: covers || undefined };
}

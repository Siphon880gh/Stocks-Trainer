/**
 * BA5.M1: plain-language order preview, generated from the order object (never hand-written per order).
 * Textbook semantics: a limit fills at the limit or better; a stop becomes a market order once touched and
 * can fill past the stop on a gap; a stop-limit becomes a limit and may not fill; a trailing stop follows the
 * highest price and never moves down.
 */
import type { OrderSpec, OrderType } from "./types";
import { trailLevel } from "./engine";

export const money = (cents: number) => `${cents < 0 ? "−" : ""}$${(Math.abs(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const signedMoney = (cents: number) => (cents > 0 ? `+${money(cents)}` : money(cents));
export const pct = (x: number, digits = 1) => `${(x * 100).toFixed(digits)}%`;

export const TYPE_LABELS: Record<OrderType, string> = { market: "Market", limit: "Limit", stop: "Stop", "stop-limit": "Stop-limit", "trailing-stop": "Trailing stop" };

const shares = (n: number) => `${n} share${n === 1 ? "" : "s"}`;

/** One-line label for tables: "Buy 10 TRWL.S · Limit $49.00 · GTC". */
export function orderLabel(o: OrderSpec): string {
  const px =
    o.type === "limit" ? ` ${money(o.limitPrice!)}` :
    o.type === "stop" ? ` ${money(o.stopPrice!)}` :
    o.type === "stop-limit" ? ` ${money(o.stopPrice!)} / ${money(o.limitPrice!)}` :
    o.type === "trailing-stop" ? (o.trailAmount !== undefined ? ` ${money(o.trailAmount)} trail` : ` ${o.trailPercent}% trail`) : "";
  return `${o.side === "buy" ? "Buy" : "Sell"} ${o.qty} ${o.symbol} · ${TYPE_LABELS[o.type]}${px} · ${o.tif === "day" ? "Day" : "GTC"}`;
}

/** Full preview sentence(s). `lastClose` (cents) is used for market estimates and the trailing start level. */
export function describeOrder(o: OrderSpec, lastClose?: number): string {
  const n = shares(o.qty);
  const buy = o.side === "buy";
  let body: string;
  switch (o.type) {
    case "market":
      body = `${buy ? "Buy" : "Sell"} ${n} of ${o.symbol} at the next bar's open, whatever that price is${lastClose ? ` (the last close was ${money(lastClose)})` : ""}. A market order fills, but the price can differ from the last close, most of all after a gap.`;
      break;
    case "limit": {
      const L = money(o.limitPrice!);
      body = buy
        ? `If the price trades at or below ${L}, buy ${n} at ${L} or lower. If it opens below ${L} you get the lower open price. If it never comes down to ${L}, nothing fills.`
        : `If the price trades at or above ${L}, sell ${n} at ${L} or higher. If it opens above ${L} you get the higher open price. If it never reaches ${L}, nothing fills.`;
      break;
    }
    case "stop": {
      const S = money(o.stopPrice!);
      body = buy
        ? `If the price trades at or above ${S}, this becomes a market order to buy ${n}. It fills near ${S}, or higher if the price gaps above it.`
        : `If the price trades at or below ${S}, this becomes a market order to sell ${n}. It fills near ${S}, or lower if the price gaps below it.`;
      break;
    }
    case "stop-limit": {
      const S = money(o.stopPrice!);
      const L = money(o.limitPrice!);
      body = buy
        ? `If the price trades at or above ${S}, this becomes a limit order to buy ${n} at ${L} or lower. If the price jumps past ${L}, it may not fill at all.`
        : `If the price trades at or below ${S}, this becomes a limit order to sell ${n} at ${L} or higher. If the price gaps below ${L}, it may not fill and you keep the shares while the price falls.`;
      break;
    }
    case "trailing-stop": {
      const dist = o.trailAmount !== undefined ? money(o.trailAmount) : `${o.trailPercent}%`;
      const start = lastClose !== undefined ? ` The stop starts at ${money(trailLevel(lastClose, o))}` : " The stop starts below the last close";
      body = `${buy ? "Buy" : "Sell"} ${n} if the price falls ${dist} from its highest point since you placed the order.${start} and rises with each new high; it never moves down. Once hit, it fills like a stop: near the level, or lower on a gap.`;
      break;
    }
  }
  const tif = o.tif === "day" ? "Day order: if it has not filled on the next bar, it expires." : "Good-til-canceled: it keeps working until it fills or you cancel it.";
  return `${body} ${tif}`.replace(/\s+/g, " ").trim();
}

/** Reference price for the cost estimate: limit → L, stop / stop-limit → S (or L), market / trailing → last close. */
export function estimatePrice(o: OrderSpec, lastClose: number): number {
  if (o.type === "limit") return o.limitPrice ?? lastClose;
  if (o.type === "stop-limit") return o.limitPrice ?? o.stopPrice ?? lastClose;
  if (o.type === "stop") return o.stopPrice ?? lastClose;
  return lastClose;
}

/** BA11.M1: plain-language line for a bracket's exits. SIMULATED. */
export function describeBracket(exits: { stopPrice?: number; targetPrice?: number }, qty: number): string {
  const n = shares(qty);
  const parts: string[] = [];
  if (exits.stopPrice !== undefined) parts.push(`a sell stop at ${money(exits.stopPrice)} (caps the loss)`);
  if (exits.targetPrice !== undefined) parts.push(`a sell limit at ${money(exits.targetPrice)} (takes the profit)`);
  const both = parts.length === 2 ? " They are one-cancels-other: when one fills, the other is cancelled." : "";
  return `Only after the buy fills: ${parts.join(" and ")} start working on the next bar for the same ${n}.${both} If the buy never fills, they are cancelled.`;
}

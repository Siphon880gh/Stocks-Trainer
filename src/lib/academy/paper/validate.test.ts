import { test } from "node:test";
import assert from "node:assert/strict";
import { applyFill, createAccount } from "./account";
import { MARKET_BUFFER, reservationFor, validateOrder, type ValidationCode } from "./validate";
import type { OrderSpec } from "./types";

const S = "TEST.S";
const ctx = { lastClose: { [S]: 5000 } };
const flat = createAccount(1_000_000, { [S]: 5000 });
const long = applyFill(flat, { orderId: "x", bar: 0, symbol: S, side: "buy", qty: 20, price: 5000 }).state;
const base: OrderSpec = { symbol: S, side: "buy", type: "market", qty: 10, tif: "day" };

type Case = [name: string, spec: Partial<OrderSpec>, acct: "flat" | "long", errors: ValidationCode[], warnings?: ValidationCode[]];
const CASES: Case[] = [
  ["valid market buy", {}, "flat", []],
  ["qty 0", { qty: 0 }, "flat", ["QTY_NOT_POSITIVE"]],
  ["qty negative", { qty: -5 }, "flat", ["QTY_NOT_POSITIVE"]],
  ["qty fractional", { qty: 1.5 }, "flat", ["QTY_NOT_INTEGER"]],
  ["unknown symbol", { symbol: "NOPE.S" }, "flat", ["UNKNOWN_SYMBOL"]],
  ["unknown type", { type: "iceberg" as never }, "flat", ["UNKNOWN_TYPE"]],
  ["unknown side", { side: "short" as never }, "flat", ["UNKNOWN_SIDE"]],
  ["unknown tif", { tif: "ioc" as never }, "flat", ["UNKNOWN_TIF"]],
  ["sell with no position = short", { side: "sell" }, "flat", ["SHORT_NOT_ALLOWED"]],
  ["sell more than held", { side: "sell", qty: 21 }, "long", ["SELL_EXCEEDS_POSITION"]],
  ["sell exactly held (boundary)", { side: "sell", qty: 20 }, "long", []],
  ["market buy over buying power", { qty: 200 }, "flat", ["INSUFFICIENT_BUYING_POWER"], ["LARGE_POSITION"]],
  ["market buy at the buffer boundary fits", { qty: 190 }, "flat", [], ["LARGE_POSITION"]],
  ["limit missing price", { type: "limit" }, "flat", ["LIMIT_REQUIRED"]],
  ["limit price 0", { type: "limit", limitPrice: 0 }, "flat", ["LIMIT_NOT_POSITIVE"]],
  ["limit fractional cents", { type: "limit", limitPrice: 4999.5 }, "flat", ["PRICE_NOT_INTEGER_CENTS"]],
  ["buy limit below market", { type: "limit", limitPrice: 4800 }, "flat", []],
  ["buy limit above market warns", { type: "limit", limitPrice: 5100 }, "flat", [], ["MARKETABLE_LIMIT"]],
  ["sell limit below market warns", { type: "limit", side: "sell", limitPrice: 4900 }, "long", [], ["MARKETABLE_LIMIT"]],
  ["stop missing price", { type: "stop" }, "flat", ["STOP_REQUIRED"]],
  ["stop price negative", { type: "stop", stopPrice: -1 }, "flat", ["STOP_NOT_POSITIVE"]],
  ["buy stop above market", { type: "stop", stopPrice: 5200 }, "flat", []],
  ["buy stop below market warns", { type: "stop", stopPrice: 4900 }, "flat", [], ["BUY_STOP_AT_OR_BELOW_MARKET"]],
  ["sell stop above market warns", { type: "stop", side: "sell", stopPrice: 5100 }, "long", [], ["SELL_STOP_AT_OR_ABOVE_MARKET"]],
  ["sell stop below market", { type: "stop", side: "sell", stopPrice: 4800 }, "long", []],
  ["market with a limit price", { limitPrice: 5000 }, "flat", ["PRICE_NOT_ALLOWED"]],
  ["limit with a stop price", { type: "limit", limitPrice: 4900, stopPrice: 4800 }, "flat", ["PRICE_NOT_ALLOWED"]],
  ["buy stop-limit limit below stop", { type: "stop-limit", stopPrice: 5200, limitPrice: 5100 }, "flat", ["STOP_LIMIT_WRONG_SIDE"]],
  ["sell stop-limit limit above stop", { type: "stop-limit", side: "sell", stopPrice: 4500, limitPrice: 4600 }, "long", ["STOP_LIMIT_WRONG_SIDE"]],
  ["sell stop-limit limit = stop (boundary ok)", { type: "stop-limit", side: "sell", stopPrice: 4500, limitPrice: 4500 }, "long", []],
  ["buy stop-limit ok", { type: "stop-limit", stopPrice: 5200, limitPrice: 5300 }, "flat", []],
  ["stop-limit missing limit", { type: "stop-limit", stopPrice: 5200 }, "flat", ["LIMIT_REQUIRED"]],
  ["trailing buy not supported", { type: "trailing-stop", trailAmount: 200 }, "flat", ["TRAIL_BUY_NOT_SUPPORTED"]],
  ["trailing missing trail", { type: "trailing-stop", side: "sell" }, "long", ["TRAIL_REQUIRED"]],
  ["trailing both trails", { type: "trailing-stop", side: "sell", trailAmount: 200, trailPercent: 5 }, "long", ["TRAIL_BOTH"]],
  ["trailing amount 0", { type: "trailing-stop", side: "sell", trailAmount: 0 }, "long", ["TRAIL_AMOUNT_RANGE"]],
  ["trailing amount ≥ price", { type: "trailing-stop", side: "sell", trailAmount: 5000 }, "long", ["TRAIL_AMOUNT_RANGE"]],
  ["trailing amount just below price (boundary)", { type: "trailing-stop", side: "sell", trailAmount: 4999 }, "long", []],
  ["trailing percent 0", { type: "trailing-stop", side: "sell", trailPercent: 0 }, "long", ["TRAIL_PERCENT_RANGE"]],
  ["trailing percent 50", { type: "trailing-stop", side: "sell", trailPercent: 50 }, "long", ["TRAIL_PERCENT_RANGE"]],
  ["trailing percent 49.9 (boundary)", { type: "trailing-stop", side: "sell", trailPercent: 49.9 }, "long", []],
  ["trail on a non-trailing order", { trailPercent: 5 }, "flat", ["PRICE_NOT_ALLOWED"]],
];

test(`≥ 30 validation cases, each yields exactly its codes (${CASES.length} cases)`, () => {
  assert.ok(CASES.length >= 30);
  for (const [name, patch, acct, errs, warns = []] of CASES) {
    const v = validateOrder(acct === "flat" ? flat : long, { ...base, ...patch }, ctx);
    assert.deepEqual(v.errors.map((e) => e.code).sort(), [...errs].sort(), name);
    assert.deepEqual(v.warnings.map((w) => w.code).sort(), [...warns].sort(), name);
    assert.equal(v.ok, errs.length === 0, name);
    for (const i of [...v.errors, ...v.warnings]) assert.ok(i.message.length > 10, `${name}: plain-language message`);
  }
});

test("every error code in the table appears at least once (stable codes)", () => {
  const seen = new Set(CASES.flatMap((c) => [...c[3], ...(c[4] ?? [])]));
  for (const code of ["QTY_NOT_POSITIVE", "QTY_NOT_INTEGER", "UNKNOWN_SYMBOL", "SHORT_NOT_ALLOWED", "SELL_EXCEEDS_POSITION", "INSUFFICIENT_BUYING_POWER", "STOP_LIMIT_WRONG_SIDE", "TRAIL_AMOUNT_RANGE", "TRAIL_PERCENT_RANGE", "MARKETABLE_LIMIT", "BUY_STOP_AT_OR_BELOW_MARKET"]) assert.ok(seen.has(code as ValidationCode), code);
});

test("reservations: limit = qty × L; market/stop carry the 5% buffer; sells reserve nothing", () => {
  assert.equal(MARKET_BUFFER, 0.05);
  assert.equal(reservationFor({ ...base, type: "limit", limitPrice: 4800 }, 5000), 48_000);
  assert.equal(reservationFor({ ...base, type: "stop-limit", stopPrice: 5200, limitPrice: 5300 }, 5000), 53_000);
  assert.equal(reservationFor(base, 5000), 52_500);
  assert.equal(reservationFor({ ...base, type: "stop", stopPrice: 5200 }, 5000), 54_600);
  assert.equal(reservationFor({ ...base, side: "sell" }, 5000), 0);
  // buying power counts other working buys
  const v = validateOrder(flat, { ...base, qty: 190 }, ctx);
  assert.equal(v.reservation, Math.ceil(190 * 5000 * 1.05));
});

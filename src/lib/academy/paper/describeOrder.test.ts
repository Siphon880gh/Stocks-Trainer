import { test } from "node:test";
import assert from "node:assert/strict";
import { describeOrder, estimatePrice, money, orderLabel } from "./describe";
import { ORDER_TYPES, type OrderSpec } from "./types";
import { bannedIn } from "../content/banned";

const base: OrderSpec = { symbol: "TRWL.S", side: "buy", type: "market", qty: 10, tif: "gtc" };
const specFor = (type: OrderSpec["type"], side: OrderSpec["side"]): OrderSpec => ({
  ...base, type, side,
  ...(type === "limit" ? { limitPrice: side === "buy" ? 4900 : 5200 } : {}),
  ...(type === "stop" ? { stopPrice: side === "buy" ? 5200 : 4800 } : {}),
  ...(type === "stop-limit" ? (side === "buy" ? { stopPrice: 5200, limitPrice: 5300 } : { stopPrice: 4800, limitPrice: 4700 }) : {}),
  ...(type === "trailing-stop" ? { trailPercent: 5 } : {}),
});

test("money formatting in cents", () => {
  assert.equal(money(123456), "$1,234.56");
  assert.equal(money(5), "$0.05");
  assert.equal(money(-2000), "−$20.00");
});

test("every type × side is described from the object's own numbers, with textbook semantics", () => {
  for (const type of ORDER_TYPES) {
    for (const side of ["buy", "sell"] as const) {
      if (type === "trailing-stop" && side === "buy") continue;
      const o = specFor(type, side);
      const d = describeOrder(o, 5000);
      assert.ok(d.includes("10 shares"), `${type}/${side}: qty`);
      assert.match(d, side === "buy" ? /\bbuy\b/i : /\bsell\b/i);
      if (o.limitPrice) assert.ok(d.includes(money(o.limitPrice)), `${type}/${side}: limit`);
      if (o.stopPrice) assert.ok(d.includes(money(o.stopPrice)), `${type}/${side}: stop`);
      assert.deepEqual(bannedIn(d), [], `${type}/${side}`);
      assert.match(d, /Good-til-canceled/);
      assert.match(describeOrder({ ...o, tif: "day" }, 5000), /expires/);
      assert.ok(orderLabel(o).startsWith(side === "buy" ? "Buy 10 TRWL.S" : "Sell 10 TRWL.S"));
    }
  }
  assert.match(describeOrder(specFor("limit", "buy")), /at or below \$49\.00.*\$49\.00 or lower/);
  assert.match(describeOrder(specFor("limit", "sell")), /at or above \$52\.00/);
  assert.match(describeOrder(specFor("stop", "sell")), /becomes a market order.*lower if the price gaps/);
  assert.match(describeOrder(specFor("stop", "buy")), /higher if the price gaps/);
  assert.match(describeOrder(specFor("stop-limit", "sell")), /may not fill/);
  assert.match(describeOrder(specFor("trailing-stop", "sell"), 5000), /starts at \$47\.50.*never moves down/);
  assert.match(describeOrder({ ...base, side: "sell", type: "trailing-stop", trailAmount: 150 }, 5000), /falls \$1\.50.*starts at \$48\.50/);
  assert.match(describeOrder(base, 5000), /next bar's open.*\$50\.00/);
});

test("changing a number changes the preview (generated, not canned)", () => {
  const a = describeOrder({ ...base, type: "limit", limitPrice: 4900 });
  const b = describeOrder({ ...base, type: "limit", limitPrice: 4800 });
  assert.notEqual(a, b);
  assert.equal(describeOrder({ ...base, qty: 1 }).includes("1 share "), true);
});

test("estimate price per type", () => {
  assert.equal(estimatePrice(specFor("limit", "buy"), 5000), 4900);
  assert.equal(estimatePrice(specFor("stop", "buy"), 5000), 5200);
  assert.equal(estimatePrice(specFor("stop-limit", "buy"), 5000), 5300);
  assert.equal(estimatePrice(base, 5000), 5000);
});

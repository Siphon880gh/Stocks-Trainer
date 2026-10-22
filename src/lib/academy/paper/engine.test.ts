import { test } from "node:test";
import assert from "node:assert/strict";
import { applyFill, buyingPower, createAccount, equity, reservedTotal } from "./account";
import { cancelOrder, contextFrom, placeOrder, replaceOrder, stepBar, trailLevel } from "./engine";
import { B, SYM, bars } from "./fixtures";
import type { AccountState, OrderSpec, PaperBar } from "./types";
import { TAPES } from "./tapes";
import { seeded } from "../mastery";

const flat = () => createAccount(1_000_000, { [SYM]: 5000 });
const long = (qty = 20) => applyFill(flat(), { orderId: "seed", bar: 0, symbol: SYM, side: "buy", qty, price: 5000 }).state;
const spec = (p: Partial<OrderSpec>): OrderSpec => ({ symbol: SYM, side: "buy", type: "market", qty: 10, tif: "gtc", ...p });

function run(s0: AccountState, p: Partial<OrderSpec>, seq: PaperBar[]) {
  let s = placeOrder(s0, spec(p), contextFrom(s0)).state;
  const id = s.orders[s.orders.length - 1]!.id;
  for (const b of seq) s = stepBar(s, bars(b));
  return { s, o: s.orders.find((x) => x.id === id)! };
}

// [name, account, spec, bars, expected fill price (cents) or status]
type Row = [string, "flat" | "long", Partial<OrderSpec>, PaperBar[], number | "working" | "expired" | "cancelled" | "rejected"];
const ROWS: Row[] = [
  // market
  ["market buy fills at the next open", "flat", {}, [B(51, 52, 50, 51.5)], 5100],
  ["market sell fills at the next open", "long", { side: "sell" }, [B(49, 50, 48, 49.5)], 4900],
  ["market day buy fills at the next open", "flat", { tif: "day" }, [B(51, 52, 50, 51.5)], 5100],
  // limit
  ["buy limit touched fills at L", "flat", { type: "limit", limitPrice: 4900 }, [B(50, 50.5, 48.5, 49.5)], 4900],
  ["buy limit, open below L fills at the open (gap in your favour)", "flat", { type: "limit", limitPrice: 4900 }, [B(48, 49.5, 47.5, 49)], 4800],
  ["buy limit not reached stays working (GTC)", "flat", { type: "limit", limitPrice: 4500 }, [B(50, 51, 49, 50.5)], "working"],
  ["buy limit day not reached expires", "flat", { type: "limit", limitPrice: 4500, tif: "day" }, [B(50, 51, 49, 50.5)], "expired"],
  ["buy limit low exactly = L fills (boundary)", "flat", { type: "limit", limitPrice: 4900 }, [B(50, 51, 49, 50)], 4900],
  ["sell limit touched fills at L", "long", { side: "sell", type: "limit", limitPrice: 5200 }, [B(51, 52.5, 50.5, 52)], 5200],
  ["sell limit, open above L fills at the open", "long", { side: "sell", type: "limit", limitPrice: 5200 }, [B(53, 54, 52.5, 53.5)], 5300],
  ["sell limit day not reached expires", "long", { side: "sell", type: "limit", limitPrice: 6000, tif: "day" }, [B(50, 51, 49, 50.5)], "expired"],
  ["GTC limit fills on a later bar", "flat", { type: "limit", limitPrice: 4800 }, [B(50, 51, 49, 50.5), B(50, 50, 47.5, 48)], 4800],
  // stop
  ["buy stop triggered fills at S", "flat", { type: "stop", stopPrice: 5200 }, [B(51, 53, 50.5, 52.5)], 5200],
  ["buy stop gap above S fills at the open", "flat", { type: "stop", stopPrice: 5200 }, [B(54, 55, 53.5, 54.5)], 5400],
  ["buy stop not reached, day → expired", "flat", { type: "stop", stopPrice: 5500, tif: "day" }, [B(51, 52, 50, 51.5)], "expired"],
  ["sell stop triggered fills at S", "long", { side: "sell", type: "stop", stopPrice: 4800 }, [B(49, 49.5, 47, 47.5)], 4800],
  ["sell stop gap below S fills at the open (worse than the stop)", "long", { side: "sell", type: "stop", stopPrice: 4800 }, [B(45, 46, 44, 45.5)], 4500],
  ["sell stop GTC not reached keeps working", "long", { side: "sell", type: "stop", stopPrice: 4000 }, [B(50, 51, 49, 50.5), B(50, 51, 49, 50)], "working"],
  // stop-limit
  ["buy stop-limit trigger inside the limit fills at S", "flat", { type: "stop-limit", stopPrice: 5200, limitPrice: 5300 }, [B(51, 53.5, 50.5, 53)], 5200],
  ["buy stop-limit gap past the limit: no fill (GTC keeps working)", "flat", { type: "stop-limit", stopPrice: 5200, limitPrice: 5300 }, [B(55, 56, 54.5, 55.5)], "working"],
  ["buy stop-limit gap past limit, day → expired", "flat", { type: "stop-limit", stopPrice: 5200, limitPrice: 5300, tif: "day" }, [B(55, 56, 54.5, 55.5)], "expired"],
  ["sell stop-limit trigger inside the limit fills at S", "long", { side: "sell", type: "stop-limit", stopPrice: 4800, limitPrice: 4700 }, [B(49, 49.5, 47.5, 48)], 4800],
  ["sell stop-limit gap below the limit: NO fill — the gap risk", "long", { side: "sell", type: "stop-limit", stopPrice: 4800, limitPrice: 4700 }, [B(44, 45, 43, 44.5)], "working"],
  ["sell stop-limit triggered then works as a limit on a rebound", "long", { side: "sell", type: "stop-limit", stopPrice: 4800, limitPrice: 4700 }, [B(44, 45, 43, 44.5), B(45, 47.5, 44.5, 47)], 4700],
  ["sell stop-limit day gap: expired", "long", { side: "sell", type: "stop-limit", stopPrice: 4800, limitPrice: 4700, tif: "day" }, [B(44, 45, 43, 44.5)], "expired"],
  // trailing stop
  ["trailing $ stop from the last close triggers", "long", { side: "sell", type: "trailing-stop", trailAmount: 200 }, [B(49.5, 50, 47.5, 48)], 4800],
  ["trailing stop ratchets with the high and then triggers", "long", { side: "sell", type: "trailing-stop", trailAmount: 200 }, [B(51, 55, 50.5, 54.5), B(54, 54, 52.5, 53)], 5300],
  ["trailing % stop gap below fills at the open", "long", { side: "sell", type: "trailing-stop", trailPercent: 5 }, [B(45, 46, 44, 45)], 4500],
  ["trailing day not triggered expires", "long", { side: "sell", type: "trailing-stop", trailAmount: 500, tif: "day" }, [B(50, 51, 49, 50.5)], "expired"],
];

test(`fill-rule table: every type × side × TIF (${ROWS.length} rows)`, () => {
  const seen = new Set<string>();
  for (const [name, acct, p, seq, exp] of ROWS) {
    const { o, s } = run(acct === "flat" ? flat() : long(), p, seq);
    seen.add(`${p.type ?? "market"}/${p.side ?? "buy"}/${p.tif ?? "gtc"}`);
    if (typeof exp === "number") {
      assert.equal(o.status, "filled", name);
      assert.equal(o.fillPrice, exp, name);
      assert.equal(s.fills[s.fills.length - 1]!.price, exp, name);
    } else assert.equal(o.status, exp, name);
    assert.equal(reservedTotal(s), s.orders.filter((x) => x.status === "working").reduce((a, x) => a + x.reserved, 0), name);
  }
  for (const k of ["market/buy/gtc", "market/sell/gtc", "limit/buy/gtc", "limit/buy/day", "limit/sell/gtc", "limit/sell/day", "stop/buy/gtc", "stop/buy/day", "stop/sell/gtc", "stop-limit/buy/gtc", "stop-limit/buy/day", "stop-limit/sell/gtc", "stop-limit/sell/day", "trailing-stop/sell/gtc", "trailing-stop/sell/day"]) assert.ok(seen.has(k), k);
});

test("an order placed after bar t is not evaluated on bar t (no look-ahead)", () => {
  const s0 = flat();
  const s1 = placeOrder(s0, spec({}), contextFrom(s0)).state;
  assert.equal(s1.orders[0]!.status, "working");
  assert.equal(s1.fills.length, 0);
});

test("trailing stop never moves down and follows trailLevel", () => {
  let s = placeOrder(long(), spec({ side: "sell", type: "trailing-stop", trailPercent: 10 }), { lastClose: { [SYM]: 5000 } }).state;
  assert.equal(s.orders[0]!.trailStop, trailLevel(5000, { trailPercent: 10 }));
  let prev = s.orders[0]!.trailStop!;
  for (const b of [B(50, 56, 49, 55), B(55, 55.5, 51, 52), B(52, 53, 51, 52.5), B(53, 60, 52.5, 59)]) {
    s = stepBar(s, bars(b));
    const o = s.orders[0]!;
    assert.equal(o.status, "working");
    assert.ok(o.trailStop! >= prev, "ratchet only");
    prev = o.trailStop!;
  }
  assert.equal(prev, Math.round(6000 * 0.9));
});

test("buying power: reserve on place, release exactly on cancel / fill / expire / reject", () => {
  const s0 = flat();
  const bp0 = buyingPower(s0);
  const placed = placeOrder(s0, spec({ type: "limit", limitPrice: 4900 }), contextFrom(s0)).state;
  assert.equal(buyingPower(placed), bp0 - 49_000);
  assert.equal(buyingPower(cancelOrder(placed, "o1")), bp0);
  const expired = stepBar(placeOrder(s0, spec({ type: "limit", limitPrice: 4000, tif: "day" }), contextFrom(s0)).state, bars(B(50, 51, 49, 50)));
  assert.equal(expired.orders[0]!.status, "expired");
  assert.equal(buyingPower(expired), bp0);
  const filled = stepBar(placed, bars(B(49, 50, 48, 49)));
  assert.equal(reservedTotal(filled), 0);
  assert.equal(filled.cash, 1_000_000 - 10 * 4900);
  const rejected = placeOrder(s0, spec({ qty: 0 }), contextFrom(s0)).state;
  assert.equal(rejected.orders[0]!.status, "rejected");
  assert.ok(rejected.orders[0]!.reason!.length > 0);
  assert.equal(buyingPower(rejected), bp0);
});

test("gap beyond the reservation buffer rejects the buy at fill time with a plain reason", () => {
  const s0 = createAccount(100_000, { [SYM]: 5000 });
  const s1 = placeOrder(s0, spec({ qty: 19 }), contextFrom(s0)).state; // reserve 19 × 50 × 1.05 = $997.50
  const s2 = stepBar(s1, bars(B(60, 61, 59, 60)));
  assert.equal(s2.orders[0]!.status, "rejected");
  assert.match(s2.orders[0]!.reason!, /Not enough cash/);
  assert.equal(s2.cash, 100_000);
});

test("two exits on one position: the second is cancelled once the first sells it (no OCO)", () => {
  let s = long(10);
  s = placeOrder(s, spec({ side: "sell", type: "stop", stopPrice: 4800 }), contextFrom(s)).state;
  s = placeOrder(s, spec({ side: "sell", type: "limit", limitPrice: 4700 }), contextFrom(s)).state;
  s = stepBar(s, bars(B(48, 48.5, 46, 47)));
  assert.equal(s.orders[0]!.status, "filled");
  assert.equal(s.orders[1]!.status, "cancelled");
  assert.match(s.orders[1]!.reason!, /already closed/);
});

test("replace keeps the old order in history and places a new one", () => {
  let s = flat();
  s = placeOrder(s, spec({ type: "limit", limitPrice: 4800 }), contextFrom(s)).state;
  const r = replaceOrder(s, "o1", spec({ type: "limit", limitPrice: 4900 }), contextFrom(s));
  assert.equal(r.state.orders[0]!.status, "cancelled");
  assert.equal(r.order.limitPrice, 4900);
  assert.equal(reservedTotal(r.state), 49_000);
});

test("cash conservation + determinism on every tape with seeded random order flow", () => {
  const runTape = (seedKey: string, tapeIdx: number) => {
    const tape = TAPES[tapeIdx]!;
    const rnd = seeded(seedKey);
    let s = createAccount(1_000_000, { [tape.symbol]: tape.bars[0]!.close });
    let flows = 0;
    for (let b = 1; b < tape.bars.length; b++) {
      const last = s.marks[tape.symbol]!;
      const held = s.positions[tape.symbol]?.qty ?? 0;
      const r = rnd();
      const types: OrderSpec["type"][] = ["market", "limit", "stop", "stop-limit", "trailing-stop"];
      const type = types[Math.floor(rnd() * types.length)]!;
      const side: OrderSpec["side"] = held > 0 && r < 0.45 ? "sell" : "buy";
      if (r < 0.6 && !(type === "trailing-stop" && side === "buy")) {
        const off = Math.round(last * 0.02);
        const sp: OrderSpec = { symbol: tape.symbol, side, type, qty: side === "sell" ? Math.max(1, Math.floor(held / 2)) : 5 + Math.floor(rnd() * 10), tif: rnd() < 0.5 ? "day" : "gtc" };
        if (type === "limit") sp.limitPrice = side === "buy" ? last - off : last + off;
        if (type === "stop") sp.stopPrice = side === "buy" ? last + off : last - off;
        if (type === "stop-limit") { sp.stopPrice = side === "buy" ? last + off : last - off; sp.limitPrice = side === "buy" ? sp.stopPrice + off : sp.stopPrice - off; }
        if (type === "trailing-stop") sp.trailPercent = 3;
        s = placeOrder(s, sp, contextFrom(s)).state;
      }
      const before = s.fills.length;
      s = stepBar(s, { [tape.symbol]: tape.bars[b]! });
      for (const f of s.fills.slice(before)) flows += (f.side === "buy" ? -1 : 1) * f.qty * f.price;
      assert.equal(s.cash, 1_000_000 + flows);
      assert.ok(s.cash >= 0 && buyingPower(s) >= 0);
      assert.equal(equity(s) - s.startingCash, s.realized + Object.values(s.positions).reduce((a, p) => a + p.qty * s.marks[p.symbol]! - p.costBasis, 0));
    }
    return s;
  };
  for (let i = 0; i < TAPES.length; i++) {
    const a = runTape(`det${i}`, i);
    const b = runTape(`det${i}`, i);
    assert.deepEqual(a, b, "same inputs → identical state");
    assert.ok(a.fills.length > 0, `${TAPES[i]!.id}: some fills happened`);
  }
});

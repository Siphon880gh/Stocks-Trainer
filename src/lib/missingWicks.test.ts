import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HOUR, MINUTES, MIRROR_HOUR, MW_QUESTIONS, MW_STEPS, MW_TERMS, aggregate, aggregateOne, barsFor, isValidOhlc, lowerWick, upperWick,
} from "./missingWicks";

describe("missing wicks: OHLC aggregation", () => {
  it("aggregateOne takes first open, max high, min low, last close, summed volume", () => {
    const b = aggregateOne([
      { name: "a", open: 10, high: 11, low: 9, close: 10.5, volume: 1 },
      { name: "b", open: 10.5, high: 12, low: 10, close: 11, volume: 2 },
      { name: "c", open: 11, high: 11.5, low: 8, close: 9, volume: 3 },
    ], "x");
    assert.deepEqual({ ...b }, { name: "x", open: 10, high: 12, low: 8, close: 9, volume: 6 });
  });

  it("each path has 60 valid 1m bars; 4×15m and 60×1m rebuild the same hourly candle", () => {
    for (const [s, m] of Object.entries(MINUTES)) {
      assert.equal(m.length, 60, s);
      assert.ok(m.every(isValidOhlc), s);
      const q = aggregate(m, 15, String);
      assert.equal(q.length, 4);
      const fromQ = aggregateOne(q, "h"), fromM = aggregateOne(m, "h");
      assert.deepEqual([fromQ.open, fromQ.high, fromQ.low, fromQ.close], [fromM.open, fromM.high, fromM.low, fromM.close], s);
    }
  });

  it("paths A and B make the identical hourly candle with no upper wick, but different 15m paths", () => {
    const a = aggregateOne(MINUTES.A, "h"), b = aggregateOne(MINUTES.B, "h");
    for (const k of ["open", "high", "low", "close"] as const) {
      assert.equal(a[k], HOUR[k]);
      assert.equal(b[k], HOUR[k]);
    }
    assert.equal(upperWick(a), 0);
    assert.ok(lowerWick(a) > 0);
    const qa = aggregate(MINUTES.A, 15, String).map((x) => x.close), qb = aggregate(MINUTES.B, 15, String).map((x) => x.close);
    assert.notDeepEqual(qa, qb);
    // B's mid-hour rally stalls just under the open; A never gets close.
    const maxB = Math.max(...MINUTES.B.slice(20, 45).map((x) => x.high));
    const maxA = Math.max(...MINUTES.A.slice(20, 45).map((x) => x.high));
    assert.ok(maxB < HOUR.open && maxB > HOUR.open - 0.5, `B rally ${maxB}`);
    assert.ok(maxA < HOUR.open - 1, `A ${maxA}`);
  });

  it("mirror hour has no lower wick (open = low)", () => {
    const m = aggregateOne(MINUTES.mirror, "h");
    assert.equal(m.low, MIRROR_HOUR.low);
    assert.equal(m.open, MIRROR_HOUR.open);
    assert.equal(lowerWick(m), 0);
    assert.equal(barsFor("mirror", "1h")[3]!.close, MIRROR_HOUR.close);
  });

  it("walkthrough has 8 steps with tf/scenario views; quiz 5+; terms", () => {
    assert.equal(MW_STEPS.length, 8);
    assert.ok(MW_STEPS.some((s) => s.scenario === "B") && MW_STEPS.some((s) => s.scenario === "mirror"));
    assert.ok(MW_QUESTIONS.length >= 5);
    const ids = new Set(MW_TERMS.map((t) => t.id));
    for (const need of ["shaven-top", "shaven-bottom", "intrabar", "timeframe-aggregation"]) assert.ok(ids.has(need));
  });
});

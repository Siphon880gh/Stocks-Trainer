import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FIB_MAP_QUESTIONS, FIB_MAP_TERMS, FIB_RATIOS, SWING, buildSim5mDecline, fibAnnotations,
  fibPrice, levelTable, riskReward,
} from "./fibDecisionMap";

describe("fibDecisionMap", () => {
  it("fibPrice on 5050→5000 maps 0/0.5/1 correctly", () => {
    assert.equal(fibPrice(5050, 5000, 0), 5000);
    assert.equal(fibPrice(5050, 5000, 0.5), 5025);
    assert.equal(fibPrice(5050, 5000, 1), 5050);
    assert.equal(fibPrice(5050, 5000, 0.618), 5000 + 50 * 0.618);
  });

  it("riskReward computes 2.0 for the lesson example", () => {
    assert.equal(riskReward(5025, 4995, 5085), 2);
    assert.equal(riskReward(100, 100, 110), null);
  });

  it("SIMULATED 5m decline contains the swing high/low", () => {
    const bars = buildSim5mDecline();
    assert.ok(bars.length >= 12);
    assert.equal(bars[SWING.highBar]!.high, SWING.high);
    assert.equal(bars[SWING.lowBar]!.low, SWING.low);
  });

  it("level table covers taught ratios and annotations include levels", () => {
    const t = levelTable();
    assert.equal(t.length, FIB_RATIOS.length);
    const ann = fibAnnotations();
    assert.ok((ann.levels?.length ?? 0) >= 6);
    assert.ok((ann.points?.length ?? 0) >= 2);
  });

  it("quiz has 12+ and terms cover the brief set", () => {
    assert.ok(FIB_MAP_QUESTIONS.length >= 12);
    const ids = new Set(FIB_MAP_TERMS.map((t) => t.id));
    for (const need of ["fib-retracement", "fib-extension", "confluence", "fib-invalidation", "vwap"]) {
      assert.ok(ids.has(need), need);
    }
  });
});

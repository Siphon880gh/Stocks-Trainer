import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SAMPLE_OHLC, type OHLC } from "./ohlcData.ts";
import { MISC_PRACTICE_ITEMS } from "./miscPractices.ts";
import { scanPatterns } from "./patternScan.ts";
import {
  candlePartAtPrice,
  gradeHunt,
  gradeInvalidation,
  gradeLabel,
  gradeLevel,
  gradeLookalike,
  gradePlan,
  gradeRegime,
  gradeReplay,
  HUNT_TAPES,
  REGIME_WINDOWS,
} from "./practiceLabs.ts";

const green: OHLC = {
  name: "t",
  open: 10,
  high: 20,
  low: 5,
  close: 15,
};

describe("misc practice catalog", () => {
  it("lists Drawing plus the six labs and Phase D lookalike / invalidation / levels", () => {
    const titles = MISC_PRACTICE_ITEMS.map((i) => i.title);
    assert.deepEqual(titles, [
      "Drawing",
      "Flashcards",
      "Label",
      "Trend vs range",
      "Bar replay",
      "Mark the plan",
      "Pattern hunt",
      "Lookalikes",
      "Invalidation",
      "Support and resistance",
    ]);
  });
});

describe("label the candle", () => {
  it("maps prices to OHLC parts on a green candle", () => {
    assert.equal(candlePartAtPrice(green, 20), "high");
    assert.equal(candlePartAtPrice(green, 5), "low");
    assert.equal(candlePartAtPrice(green, 10), "open");
    assert.equal(candlePartAtPrice(green, 15), "close");
    assert.equal(candlePartAtPrice(green, 17.5), "upper-wick");
    assert.equal(candlePartAtPrice(green, 7), "lower-wick");
    assert.equal(candlePartAtPrice(green, 12.5), "body");
  });

  it("grades a matching tap correct and a miss incorrect", () => {
    assert.equal(gradeLabel("high", "high").grade, "correct");
    assert.equal(gradeLabel("high", "body").grade, "incorrect");
    assert.equal(gradeLabel("body", "open").grade, "partial");
  });
});

describe("trend vs range", () => {
  it("accepts the authored regime and rejects a mismatch", () => {
    const up = REGIME_WINDOWS.find((w) => w.regime === "trend-up");
    assert.ok(up);
    assert.equal(gradeRegime(up.id, "trend-up").grade, "correct");
    assert.equal(gradeRegime(up.id, "range").grade, "incorrect");
  });
});

describe("bar replay process", () => {
  it("rewards waiting before a bias", () => {
    assert.equal(gradeReplay(["wait", "bias-up"]).grade, "correct");
    assert.equal(gradeReplay(["bias-down"]).grade, "partial");
    assert.equal(gradeReplay([]).grade, "incorrect");
  });
});

describe("mark the plan", () => {
  it("requires stop opposite the target, R:R >= 1, stop outside last body", () => {
    const last: OHLC = { name: "last", open: 100, high: 102, low: 98, close: 101 };
    const ok = gradePlan({ entry: 101, stop: 95, target: 113 }, last);
    assert.equal(ok.grade, "correct");
    const inside = gradePlan({ entry: 101, stop: 100.5, target: 113 }, last);
    assert.equal(inside.grade, "incorrect");
    const badSide = gradePlan({ entry: 101, stop: 108, target: 113 }, last);
    assert.equal(badSide.grade, "incorrect");
  });
});

describe("pattern hunt", () => {
  it("scores a mark within one bar of a scanned hit", () => {
    const hits = gradeHunt(3, SAMPLE_OHLC);
    assert.equal(hits.grade, "correct");
    const miss = gradeHunt(0, SAMPLE_OHLC);
    assert.equal(miss.grade, "incorrect");
  });

  it("scores the hanging-man hunt tape on the Hanging Man bar", () => {
    const tape = HUNT_TAPES.find((t) => t.id === "hunt-hanging-man");
    assert.ok(tape);
    const hit = scanPatterns(tape.bars).find((p) => p.name === "Hanging Man");
    assert.ok(hit);
    assert.equal(gradeHunt(hit.index, tape.bars).grade, "correct");
  });

  it("gives every hunt tape at least one scan hit", () => {
    for (const tape of HUNT_TAPES) {
      assert.ok(scanPatterns(tape.bars).length > 0, tape.id);
    }
  });

  it("scores the falling-wedge hunt tape on the Falling Wedge bar", () => {
    const tape = HUNT_TAPES.find((t) => t.id === "hunt-falling-wedge");
    assert.ok(tape);
    const hit = scanPatterns(tape.bars).find((p) => p.name === "Falling Wedge");
    assert.ok(hit);
    const result = gradeHunt(hit.index, tape.bars);
    assert.equal(result.grade, "correct");
    assert.match(result.tip, /Falling Wedge/);
  });
});

describe("lookalike lab", () => {
  it("accepts the hanging-man chart and rejects the hammer chart", () => {
    assert.equal(gradeLookalike("hm-vs-hammer", "B").grade, "correct");
    assert.equal(gradeLookalike("hm-vs-hammer", "A").grade, "incorrect");
  });

  it("accepts the rising-wedge chart over the bull-flag chart", () => {
    assert.equal(gradeLookalike("rw-vs-flag", "A").grade, "correct");
    assert.equal(gradeLookalike("rw-vs-flag", "B").grade, "incorrect");
  });
});

describe("invalidation lab", () => {
  it("accepts a tap under the hanging-man low and rejects the small body", () => {
    assert.equal(gradeInvalidation("inv-hanging-man", 62800).grade, "correct");
    assert.equal(gradeInvalidation("inv-hanging-man", 63950).grade, "incorrect");
  });

  it("accepts the falling-wedge coil low", () => {
    assert.equal(gradeInvalidation("inv-falling-wedge", 62800).grade, "correct");
  });
});

describe("levels lab", () => {
  it("accepts the tweezer-bottom matched low as support", () => {
    assert.equal(gradeLevel("lvl-tweezer-bottom", 62800).grade, "correct");
    assert.equal(gradeLevel("lvl-tweezer-bottom", 64400).grade, "incorrect");
  });

  it("accepts the triangle rising-lows zone", () => {
    assert.equal(gradeLevel("lvl-triangle-low", 63800).grade, "correct");
  });
});

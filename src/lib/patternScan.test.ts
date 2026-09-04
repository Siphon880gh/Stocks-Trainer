import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sma, rsi } from "./indicators.ts";
import type { OHLC } from "./ohlcData.ts";
import { PATTERN_OHLC } from "./ohlcData.ts";
import { explainChartProgression, patternBarIndices, scanPatterns } from "./patternScan.ts";

function namesAt(key: string): string[] {
  return scanPatterns(PATTERN_OHLC[key] ?? []).map((p) => p.name);
}

function fromCloses(closes: number[]): OHLC[] {
  return closes.map((c, i) => ({
    name: `T${i}`,
    open: c,
    high: c + 2,
    low: c - 2,
    close: c,
  }));
}

describe("explainChartProgression", () => {
  it("anchors one bar note at each candle high when no overlays are on", () => {
    const data = fromCloses([10, 11, 12]);
    const notes = explainChartProgression(data);
    assert.equal(notes.length, 3);
    assert.deepEqual(
      notes.map((n) => n.anchor),
      ["high", "high", "high"],
    );
    assert.equal(notes[0]?.y, data[0]?.high);
    assert.equal(notes[0]?.id, "bar-0");
  });

  it("keeps bar dots and adds SMA dots at start, cross, and slope turn", () => {
    const data = fromCloses([10, 12, 14, 16, 18, 20, 22, 8, 6, 4]);
    const sma5 = sma(
      data.map((d) => d.close),
      5,
    );
    const notes = explainChartProgression(data, { sma: sma5 });
    const bars = notes.filter((n) => n.anchor === "high");
    const smaNotes = notes.filter((n) => n.anchor === "sma");

    assert.equal(bars.length, data.length);
    assert.ok(smaNotes.length >= 2);

    const start = smaNotes.find((n) => n.index === 4);
    assert.ok(start);
    assert.equal(start.y, sma5[4]);
    assert.match(start.headline, /SMA/i);

    const turn = smaNotes.find((n) => n.index === 7);
    assert.ok(turn);
    assert.match(turn.detail, /turns lower|turn lower|starts to fall|falling/i);

    const ids = new Set(notes.map((n) => n.id));
    assert.equal(ids.size, notes.length);
  });

  it("places an SMA dot where close crosses the average", () => {
    const data = fromCloses([20, 19, 18, 17, 10, 9, 25]);
    const sma5 = sma(
      data.map((d) => d.close),
      5,
    );
    const notes = explainChartProgression(data, { sma: sma5 });
    const cross = notes.find((n) => n.anchor === "sma" && n.index === 6);
    assert.ok(cross);
    assert.equal(cross.y, sma5[6]);
    assert.match(cross.detail, /cross/i);
  });

  it("places an RSI dot on the oscillator when it stretches high", () => {
    const data = fromCloses([10, 12, 14, 16, 18, 20, 22]);
    const rsi5 = rsi(
      data.map((d) => d.close),
      5,
    );
    const notes = explainChartProgression(data, { rsi: rsi5 });
    const rsiNotes = notes.filter((n) => n.anchor === "rsi");
    assert.ok(rsiNotes.length >= 1);
    assert.equal(typeof rsiNotes[0]?.y, "number");
    assert.match(rsiNotes[0]!.detail, /RSI/i);
  });
});

describe("patternBarIndices", () => {
  it("highlights only the print bar for a single-candle pattern", () => {
    assert.deepEqual(
      patternBarIndices({
        index: 4,
        name: "Doji",
        confidence: 85,
        description: "",
      }),
      [4],
    );
    assert.deepEqual(
      patternBarIndices({
        index: 2,
        name: "Hammer",
        confidence: 88,
        description: "",
      }),
      [2],
    );
  });

  it("includes the prior bar for engulfing", () => {
    assert.deepEqual(
      patternBarIndices({
        index: 5,
        name: "Bullish Engulfing",
        confidence: 90,
        description: "",
      }),
      [4, 5],
    );
    assert.deepEqual(
      patternBarIndices({
        index: 3,
        name: "Bearish Engulfing",
        confidence: 90,
        description: "",
      }),
      [2, 3],
    );
  });

  it("includes all three bars for Morning Star", () => {
    assert.deepEqual(
      patternBarIndices({
        index: 7,
        name: "Morning Star",
        confidence: 88,
        description: "",
      }),
      [5, 6, 7],
    );
  });

  it("includes three bars for Evening Star and soldiers / crows", () => {
    assert.deepEqual(
      patternBarIndices({ index: 7, name: "Evening Star", confidence: 88, description: "" }),
      [5, 6, 7],
    );
    assert.deepEqual(
      patternBarIndices({ index: 4, name: "Three White Soldiers", confidence: 88, description: "" }),
      [2, 3, 4],
    );
    assert.deepEqual(
      patternBarIndices({ index: 4, name: "Three Black Crows", confidence: 88, description: "" }),
      [2, 3, 4],
    );
  });

  it("includes the prior bar for pierce, cover, harami, and tweezers", () => {
    for (const name of [
      "Piercing Line",
      "Dark Cloud Cover",
      "Harami",
      "Tweezer Top",
      "Tweezer Bottom",
    ]) {
      assert.deepEqual(
        patternBarIndices({ index: 5, name, confidence: 80, description: "" }),
        [4, 5],
      );
    }
  });
});

describe("scanPatterns candle families", () => {
  it("labels a lower wick after a decline as Hammer, not Hanging Man", () => {
    const names = namesAt("hammer");
    assert.ok(names.includes("Hammer"));
    assert.equal(names.includes("Hanging Man"), false);
  });

  it("labels a lower wick after a rally as Hanging Man, not Hammer", () => {
    const names = namesAt("hanging-man");
    assert.ok(names.includes("Hanging Man"));
    assert.equal(names.includes("Hammer"), false);
    const hanging = scanPatterns(PATTERN_OHLC["hanging-man"] ?? []).find((p) => p.name === "Hanging Man");
    assert.ok(hanging);
    const atBar = scanPatterns(PATTERN_OHLC["hanging-man"] ?? [])
      .filter((p) => p.index === hanging.index)
      .map((p) => p.name);
    assert.equal(atBar.includes("Doji"), false);
  });

  it("splits long upper wick by context", () => {
    assert.ok(namesAt("shooting-star").includes("Shooting Star"));
    assert.equal(namesAt("shooting-star").includes("Inverted Hammer"), false);
    assert.ok(namesAt("inverted-hammer").includes("Inverted Hammer"));
    assert.equal(namesAt("inverted-hammer").includes("Shooting Star"), false);
  });

  it("labels Morning Star and Evening Star on their own tapes", () => {
    assert.ok(namesAt("morning-star").includes("Morning Star"));
    assert.equal(namesAt("morning-star").includes("Evening Star"), false);
    assert.ok(namesAt("evening-star").includes("Evening Star"));
    assert.equal(namesAt("evening-star").includes("Morning Star"), false);
  });

  it("does not call a pierce an engulf, or a cover an engulf", () => {
    assert.ok(namesAt("piercing-line").includes("Piercing Line"));
    assert.equal(namesAt("piercing-line").includes("Bullish Engulfing"), false);
    assert.ok(namesAt("bullish-engulfing").includes("Bullish Engulfing"));
    assert.equal(namesAt("bullish-engulfing").includes("Piercing Line"), false);
    assert.ok(namesAt("dark-cloud-cover").includes("Dark Cloud Cover"));
    assert.equal(namesAt("dark-cloud-cover").includes("Bearish Engulfing"), false);
    assert.ok(namesAt("bearish-engulfing").includes("Bearish Engulfing"));
    assert.equal(namesAt("bearish-engulfing").includes("Dark Cloud Cover"), false);
  });

  it("labels soldiers, crows, harami, and tweezers", () => {
    assert.ok(namesAt("three-white-soldiers").includes("Three White Soldiers"));
    assert.ok(namesAt("three-black-crows").includes("Three Black Crows"));
    assert.ok(namesAt("harami").includes("Harami"));
    assert.equal(namesAt("harami").includes("Bullish Engulfing"), false);
    assert.ok(namesAt("tweezer-top").includes("Tweezer Top"));
    assert.ok(namesAt("tweezer-bottom").includes("Tweezer Bottom"));
  });
});

const STRUCTURE_NAMES = [
  "Rising Wedge",
  "Falling Wedge",
  "Bull Flag",
  "Double Top",
  "Double Bottom",
  "Triangle",
  "Head and Shoulders",
];

describe("scanPatterns structure families", () => {
  it("labels each structure tape with its Archive name", () => {
    assert.ok(namesAt("rising-wedge").includes("Rising Wedge"));
    assert.ok(namesAt("falling-wedge").includes("Falling Wedge"));
    assert.ok(namesAt("bull-flag").includes("Bull Flag"));
    assert.ok(namesAt("double-top").includes("Double Top"));
    assert.ok(namesAt("double-bottom").includes("Double Bottom"));
    assert.ok(namesAt("triangle").includes("Triangle"));
    assert.ok(namesAt("head-shoulders").includes("Head and Shoulders"));
  });

  it("does not swap lookalike structures", () => {
    assert.equal(namesAt("rising-wedge").includes("Falling Wedge"), false);
    assert.equal(namesAt("rising-wedge").includes("Bull Flag"), false);
    assert.equal(namesAt("rising-wedge").includes("Triangle"), false);
    assert.equal(namesAt("falling-wedge").includes("Rising Wedge"), false);
    assert.equal(namesAt("falling-wedge").includes("Triangle"), false);
    assert.equal(namesAt("bull-flag").includes("Rising Wedge"), false);
    assert.equal(namesAt("triangle").includes("Falling Wedge"), false);
    assert.equal(namesAt("triangle").includes("Rising Wedge"), false);
    assert.equal(namesAt("double-top").includes("Head and Shoulders"), false);
    assert.equal(namesAt("double-top").includes("Tweezer Top"), false);
    assert.equal(namesAt("double-bottom").includes("Tweezer Bottom"), false);
    assert.equal(namesAt("head-shoulders").includes("Double Top"), false);
  });

  it("does not pin structure names on candle-only tapes", () => {
    for (const key of [
      "hammer",
      "hanging-man",
      "tweezer-top",
      "tweezer-bottom",
      "three-white-soldiers",
      "three-black-crows",
      "morning-star",
      "evening-star",
    ]) {
      const names = namesAt(key);
      for (const structure of STRUCTURE_NAMES) {
        assert.equal(names.includes(structure), false, `${key} should not be ${structure}`);
      }
    }
  });

  it("still names a double top after later bars bury the whole-series shape", () => {
    const core = PATTERN_OHLC["double-top"] ?? [];
    const trail: OHLC[] = [
      { name: "t0", open: 63350, high: 64000, low: 63200, close: 63800 },
      { name: "t1", open: 63800, high: 64400, low: 63700, close: 64300 },
      { name: "t2", open: 64300, high: 64600, low: 64200, close: 64500 },
      { name: "t3", open: 64500, high: 64700, low: 64400, close: 64600 },
      { name: "t4", open: 64600, high: 64750, low: 64500, close: 64650 },
      { name: "t5", open: 64650, high: 64800, low: 64550, close: 64700 },
    ];
    const hits = scanPatterns([...core, ...trail]).filter((p) => p.name === "Double Top");
    assert.ok(hits.length >= 1);
    assert.ok(hits.some((p) => p.index === core.length - 1));
  });

  it("still names head and shoulders after later bars bury the whole-series shape", () => {
    const core = PATTERN_OHLC["head-shoulders"] ?? [];
    const trail: OHLC[] = [
      { name: "t0", open: 63000, high: 63400, low: 62800, close: 63200 },
      { name: "t1", open: 63200, high: 63600, low: 63000, close: 63400 },
      { name: "t2", open: 63400, high: 64000, low: 63200, close: 63800 },
      { name: "t3", open: 63800, high: 64600, low: 63600, close: 64400 },
    ];
    const hits = scanPatterns([...core, ...trail]).filter((p) => p.name === "Head and Shoulders");
    assert.ok(hits.length >= 1);
    assert.ok(hits.every((p) => p.index <= core.length - 1));
    assert.ok(hits.some((p) => p.index >= 5));
  });
});

describe("patternBarIndices structures", () => {
  it("highlights a span ending at the print bar", () => {
    assert.deepEqual(
      patternBarIndices({ index: 5, name: "Falling Wedge", confidence: 80, description: "" }),
      [1, 2, 3, 4, 5],
    );
    assert.deepEqual(
      patternBarIndices({ index: 7, name: "Head and Shoulders", confidence: 80, description: "" }),
      [3, 4, 5, 6, 7],
    );
  });
});

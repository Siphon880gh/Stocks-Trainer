import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sma, rsi } from "./indicators.ts";
import type { OHLC } from "./ohlcData.ts";
import { explainChartProgression, patternBarIndices } from "./patternScan.ts";

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
});

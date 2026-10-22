import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { NARRATIVES, NARRATIVE_QUESTIONS, NARRATIVE_TERMS } from "./techniqueNarratives";
import { Z } from "./zLayers";
import { vwap, rsi } from "./narrativeEngine";

describe("technique narratives", () => {
  it("has at least six narratives, each with 6+ steps and a wrong-chart step", () => {
    assert.ok(NARRATIVES.length >= 6);
    for (const n of NARRATIVES) {
      assert.ok(n.steps.length >= 6, n.id);
      assert.ok(n.steps.some((s) => s.chart === "wrong"), n.id);
      assert.ok(n.steps.some((s) => s.target === "nar-fail"), n.id);
      assert.ok(n.sources.length >= 1, n.id);
      assert.ok(n.questions.length >= 2, n.id);
    }
  });

  it("the technique makes money on the right chart and loses on the wrong chart (SIMULATED, computed)", () => {
    for (const n of NARRATIVES) {
      assert.ok(n.right.result.trades.length >= 1, `${n.id} right has trades`);
      assert.ok(n.wrong.result.trades.length >= 1, `${n.id} wrong has trades`);
      assert.ok(n.right.result.total > 0, `${n.id} right total ${n.right.result.total}`);
      assert.ok(n.wrong.result.total < 0, `${n.id} wrong total ${n.wrong.result.total}`);
    }
  });

  it("SIMULATED bars are valid OHLC and titles say SIMULATED", () => {
    for (const n of NARRATIVES) for (const side of [n.right, n.wrong]) {
      assert.match(side.title, /SIMULATED/);
      for (const b of side.bars) {
        assert.ok(b.high >= Math.max(b.open, b.close) && b.low <= Math.min(b.open, b.close), `${n.id} ${b.name}`);
      }
    }
  });

  it("indicator helpers: VWAP of equal-volume flat bars equals the price; RSI bounded", () => {
    const flat = Array.from({ length: 5 }, (_, i) => ({ name: `${i}`, open: 10, high: 10, low: 10, close: 10, volume: 100 }));
    assert.deepEqual(vwap(flat), [10, 10, 10, 10, 10]);
    const r = rsi(NARRATIVES[0]!.right.bars.map((b) => b.close), 14).filter((v): v is number => v != null);
    assert.ok(r.every((v) => v >= 0 && v <= 100));
  });

  it("quiz has 12+ unique questions and terms exist", () => {
    assert.ok(NARRATIVE_QUESTIONS.length >= 12);
    assert.equal(new Set(NARRATIVE_QUESTIONS.map((q) => q.id)).size, NARRATIVE_QUESTIONS.length);
    assert.ok(NARRATIVE_TERMS.length >= 5);
  });
});

describe("z-index tokens", () => {
  it("tour layers are above every z-index used in src/components and src/pages", () => {
    const files: string[] = [];
    const walk = (d: string) => {
      for (const f of readdirSync(d)) {
        const p = join(d, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.tsx?$/.test(f)) files.push(p);
      }
    };
    walk("src/components");
    walk("src/pages");
    let max = 0;
    for (const f of files) {
      if (f.endsWith("Walkthrough.tsx")) continue;
      const t = readFileSync(f, "utf8");
      for (const m of t.matchAll(/z-\[(\d+)\]|\bz-(\d+)\b|zIndex:\s*(\d+)/g)) max = Math.max(max, Number(m[1] ?? m[2] ?? m[3]));
    }
    assert.ok(max < Z.tourBackdrop, `max z ${max}`);
    assert.ok(Z.tourBackdrop < Z.tourHighlight && Z.tourHighlight < Z.tourPopover);
  });
});

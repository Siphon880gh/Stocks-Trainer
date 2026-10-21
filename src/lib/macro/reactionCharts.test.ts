import { test } from "node:test";
import assert from "node:assert/strict";
import { INSTRUMENTS } from "./reactions";
import { RELEASES } from "./releases";
import { DAILY_RELEASE_INDEX, intradayChart, dailyChart, revealAnnotations, validateReactionChart, RELEASE_INDEX } from "./reactionCharts";

test("every event × instrument chart is valid and matches its outcome", () => {
  for (const e of RELEASES)
    for (const i of INSTRUMENTS) {
      const c = intradayChart(e, i);
      assert.deepEqual(validateReactionChart(c), [], `${e.id} ${i}`);
    }
});

test("deterministic", () => {
  for (const e of RELEASES.slice(0, 8)) assert.deepEqual(intradayChart(e, "index"), intradayChart(e, "index"));
});

test("|move| grows with |surprise| within a kind (index, non-muted)", () => {
  const kinds = new Set(RELEASES.map((e) => e.kind));
  for (const k of kinds) {
    const cs = RELEASES.filter((e) => e.kind === k).map((e) => intradayChart(e, "index")).filter((c) => c.direction !== "muted");
    const sorted = [...cs].sort((a, b) => a.magnitude - b.magnitude);
    for (let j = 1; j < sorted.length; j++) assert.ok(Math.abs(sorted[j]!.net / sorted[j]!.unit) + 1e-6 >= Math.abs(sorted[j - 1]!.net / sorted[j - 1]!.unit) - 0.02, k);
  }
});

test("a broken chart is caught", () => {
  const c = intradayChart(RELEASES[0]!, "index");
  const flipped = { ...c, direction: c.direction === "up" ? ("down" as const) : ("up" as const) };
  assert.ok(validateReactionChart(flipped).length > 0);
  const bad = { ...c, bars: c.bars.map((b, i) => (i === 5 ? { ...b, high: b.low - 1 } : b)) };
  assert.ok(validateReactionChart(bad).some((x) => x.includes("invalid OHLC")));
});

test("daily view: 10 bars, release day matches intraday open/close", () => {
  for (const e of RELEASES) {
    const d = dailyChart(e, "index");
    const c = intradayChart(e, "index");
    assert.equal(d.length, 10);
    assert.equal(d[DAILY_RELEASE_INDEX]!.close, c.bars.at(-1)!.close);
    assert.equal(d[DAILY_RELEASE_INDEX]!.open, c.bars[0]!.open);
    for (const b of d) assert.ok(b.high >= Math.max(b.open, b.close) && b.low <= Math.min(b.open, b.close));
  }
});

test("reveal annotations: indices in range, prices inside the chart extent", () => {
  for (const e of RELEASES)
    for (const i of ["index", "us2y", "dollar"] as const) {
      const c = intradayChart(e, i);
      const a = revealAnnotations(c);
      const hi = Math.max(...c.bars.map((b) => b.high));
      const lo = Math.min(...c.bars.map((b) => b.low));
      assert.equal(a.events![0]!.index, RELEASE_INDEX);
      for (const p of a.points!) {
        assert.ok(p.index >= 0 && p.index < c.bars.length, `${e.id} ${i}`);
        assert.ok(p.price >= lo - 1e-9 && p.price <= hi + 1e-9, `${e.id} ${i} ${p.label}`);
      }
      for (const z of a.zones!) assert.ok(z.top <= hi && z.bottom >= lo && z.top >= z.bottom);
      for (const l of a.levels!) assert.ok(l.price >= lo && l.price <= hi);
      if (c.archetype === "reversal") assert.ok(a.points!.some((p) => /faded/.test(p.label)), e.id);
    }
});

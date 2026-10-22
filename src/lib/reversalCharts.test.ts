import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERN_OHLC } from "./ohlcData";
import { getPattern } from "./patterns";
import { patternTabs } from "./patternTabs";
import {
  CONFIRM_DRILLS, RECTANGLE_VS_TRIPLE, REVERSAL_PATTERNS, REVERSAL_QUESTIONS, REVERSAL_TABS,
} from "./reversalCharts";

test("every reversal pattern has Archive entry, OHLC, deep tabs, confirm/measured/retest/failure", () => {
  for (const p of REVERSAL_PATTERNS) {
    assert.ok(getPattern(p.id), p.id);
    assert.ok((PATTERN_OHLC[p.chartKey] ?? []).length >= 5, p.id);
    const tabs = patternTabs(getPattern(p.id)!);
    assert.equal(tabs.general, false, p.id);
    assert.ok(tabs.recognise.some((l) => /neckline|trendline|converg/i.test(l) || p.id.includes("wedge")), p.id);
    assert.match(tabs.trade.confirmation, /close/i);
    assert.ok(p.measured.length > 20 && p.retest.length > 20 && p.failure.length > 20, p.id);
    assert.ok(REVERSAL_TABS[p.id]);
  }
});

test("triple bottom is taught as distinct from rectangle", () => {
  const tb = REVERSAL_PATTERNS.find((p) => p.id === "triple-bottom")!;
  assert.match(tb.recognise.join(" "), /Not a rectangle/);
  assert.match(RECTANGLE_VS_TRIPLE.points.join(" "), /Never label/);
  assert.ok(CONFIRM_DRILLS.some((d) => d.answer.includes("Rectangle")));
});

test("falling wedge bullish, rising wedge bearish", () => {
  assert.equal(REVERSAL_PATTERNS.find((p) => p.id === "falling-wedge")!.side, "bullish");
  assert.equal(REVERSAL_PATTERNS.find((p) => p.id === "rising-wedge")!.side, "bearish");
});

test("quiz 10+ well-formed", () => {
  assert.ok(REVERSAL_QUESTIONS.length >= 10);
  assert.equal(new Set(REVERSAL_QUESTIONS.map((q) => q.id)).size, REVERSAL_QUESTIONS.length);
  for (const q of REVERSAL_QUESTIONS) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
});

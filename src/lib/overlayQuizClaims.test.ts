/**
 * MACD and Bollinger quiz questions that describe their chart must match what MarketChart draws for the
 * tagged SAMPLE pack (same shortened periods: MARKET_CHART_MACD, MARKET_CHART_BOLLINGER).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MARKET_CHART_BOLLINGER, MARKET_CHART_MACD, bollingerBands, macd } from "./indicators.ts";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData.ts";
import { overlayQuizBars } from "./quizChartData.ts";

const byId = new Map<string, ReturnType<typeof getQuestionsForGroup>[number]>();
for (const g of QUIZ_GROUPS) for (const q of getQuestionsForGroup(g.id)) byId.set(q.id, q);
const closesOf = (id: string, overlay: string) => {
  const q = byId.get(id);
  assert.ok(q, id);
  assert.equal(q.overlayId, overlay, `${id} shows the ${overlay} pane`);
  return overlayQuizBars(q).map((b) => b.close);
};

describe("MACD / Bollinger quiz claims vs the drawn panes", () => {
  it("EQ-PAT-09: the MACD line peaks, turns down below zero and stays under its signal line", () => {
    const { macd: line, signal, histogram } = macd(closesOf("EQ-PAT-09", "macd"), MARKET_CHART_MACD.fast, MARKET_CHART_MACD.slow, MARKET_CHART_MACD.signal);
    const m = line.filter((v): v is number => v != null);
    assert.ok(Math.max(...m) > 0 && m[m.length - 1]! < 0, m.join(","));
    const drawn = signal.map((s, i) => (s == null ? null : histogram[i]));
    assert.ok(drawn.some((h) => h != null), "signal line is drawn");
    assert.ok(drawn.every((h) => h == null || h < 0), "MACD under its signal wherever the signal is drawn");
  });
  for (const id of ["IN-10", "EQ-PAT-06"]) {
    it(`${id}: the bands pinch, then expand on the break`, () => {
      const { upper, lower } = bollingerBands(closesOf(id, "bollinger"), MARKET_CHART_BOLLINGER.period, MARKET_CHART_BOLLINGER.k);
      const w = upper.map((u, i) => (u == null || lower[i] == null ? null : u - lower[i]!)).filter((v): v is number => v != null);
      const pinch = w.indexOf(Math.min(...w));
      assert.ok(pinch > 0 && pinch < w.length - 1, `pinch at ${pinch}: ${w.join(",")}`);
      assert.ok(w[pinch]! < w[0]!, "bands narrow into the pinch");
      assert.ok(w[w.length - 1]! > 2 * w[pinch]!, "bands expand after the pinch");
    });
  }
});

/**
 * Quiz questions that make a claim about the RSI pane must match the RSI that MarketChart actually draws
 * for their tagged SAMPLE pack (Wilder RSI, period MARKET_CHART_RSI_PERIOD).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MARKET_CHART_RSI_PERIOD, rsi } from "./indicators.ts";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData.ts";
import { overlayQuizBars } from "./quizChartData.ts";

const byId = new Map<string, ReturnType<typeof getQuestionsForGroup>[number]>();
for (const g of QUIZ_GROUPS) for (const q of getQuestionsForGroup(g.id)) byId.set(q.id, q);

function paneRsi(id: string): number[] {
  const q = byId.get(id);
  assert.ok(q, id);
  assert.equal(q.overlayId, "rsi", `${id} shows the RSI pane`);
  return rsi(overlayQuizBars(q).map((b) => b.close), MARKET_CHART_RSI_PERIOD).filter((v): v is number => v != null);
}

describe("RSI quiz claims vs the drawn RSI pane", () => {
  it("IN-08 'RSI near 80 after a straight grind': the pane reaches the overbought zone on a rising pack", () => {
    const v = paneRsi("IN-08");
    assert.ok(Math.max(...v) >= 70, `max ${Math.max(...v)}`);
    const closes = overlayQuizBars(byId.get("IN-08")!).map((b) => b.close);
    assert.ok(closes[closes.length - 1]! > closes[0]!, "the pack grinds up");
  });
  it("EQ-PAT-03 'flags oversold extremes after a washout': the pane dips below 30, then recovers", () => {
    const v = paneRsi("EQ-PAT-03");
    const low = v.indexOf(Math.min(...v));
    assert.ok(v[low]! < 30, `min ${v[low]}`);
    assert.ok(v[v.length - 1]! > v[low]!, "bounce after the washout");
  });
  it("EQ-PAT-10 'RSI sits low': every drawn RSI value is below 30", () => {
    const v = paneRsi("EQ-PAT-10");
    assert.ok(v.length > 0 && v.every((x) => x < 30), v.join(","));
  });
});

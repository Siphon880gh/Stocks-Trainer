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
  it("IN-11 'in a choppy range': the drawn chart is a range and its RSI oscillates around 50", () => {
    const v = paneRsi("IN-11");
    let crosses = 0;
    for (let i = 1; i < v.length; i++) if ((v[i]! - 50) * (v[i - 1]! - 50) < 0) crosses++;
    assert.ok(crosses >= 3, `RSI crosses 50 only ${crosses} times: ${v.map((x) => x.toFixed(0)).join(",")}`);
    assert.ok(v.every((x) => x > 30 && x < 70), "no trend-style stretch: RSI stays between 30 and 70");
    const bars = overlayQuizBars(byId.get("IN-11")!);
    const hi = Math.max(...bars.map((b) => b.high));
    const lo = Math.min(...bars.map((b) => b.low));
    const net = Math.abs(bars[bars.length - 1]!.close - bars[0]!.close);
    assert.ok(net <= 0.25 * (hi - lo), `net move ${net.toFixed(4)} is more than a quarter of the range ${(hi - lo).toFixed(4)}`);
  });
  it("EQ-PAT-10 'RSI sits low': every drawn RSI value is below 30", () => {
    const v = paneRsi("EQ-PAT-10");
    assert.ok(v.length > 0 && v.every((x) => x < 30), v.join(","));
  });
});

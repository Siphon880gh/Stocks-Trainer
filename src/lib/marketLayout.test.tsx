import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import MarketChart from "../components/MarketChart.tsx";
import Market from "../pages/Market.tsx";
import { renderHtml } from "./macro/renderHarness.ts";
import { getSamplePack } from "./samplePacks.ts";

const classOf = (html: string, testId: string) => {
  const m = html.match(new RegExp(`<div[^>]*data-testid="${testId}"[^>]*>`));
  assert.ok(m, `${testId} rendered`);
  return m![0].match(/class="([^"]*)"/)?.[1] ?? "";
};

describe("Charts page layout on narrow screens (QA 2026-10-21)", () => {
  it("the Pair / Price / 24h / Volatility cards take their own row below lg instead of squeezing beside the selects", () => {
    const html = renderHtml(
      <MemoryRouter initialEntries={["/market"]}>
        <Market />
      </MemoryRouter>,
    );
    const cls = classOf(html, "market-stats").split(/\s+/);
    for (const c of ["basis-full", "lg:basis-0", "grow", "min-w-0"]) assert.ok(cls.includes(c), c);
    assert.ok(!cls.includes("flex-1"), "flex-1 (basis 0) is what squeezed the cards to ~24px columns at 390px");
  });

  it("the chart toolbar's explanations / feed / Videos group wraps instead of running out of the chart pane", () => {
    const pack = getSamplePack("eq-mega-tech")!;
    const html = renderHtml(<MarketChart data={pack.ohlc} height={280} statusLabel="SAMPLE" youtubeTitle="Mega-Cap Tech" />);
    const cls = classOf(html, "chart-toolbar-right").split(/\s+/);
    for (const c of ["flex-wrap", "max-w-full"]) assert.ok(cls.includes(c), c);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ToolsHub from "../pages/ToolsHub.tsx";
import { SimPanel } from "../components/tools/Simulation.tsx";
import { renderHtml } from "./macro/renderHarness.ts";
import {
  LIVE_TOOL_ORIGINS,
  MARKET_FORCES_URL,
  TOOL_LESSONS,
  isLiveLinkValid,
  startWalk,
  type LiveLink,
  type LiveTool,
  type ToolTrainingQuizGroupId,
} from "./toolTraining/index.ts";

/** Which tools a lesson's live links may open: one per tool lesson; the capstones span several. */
const LESSON_TOOLS: Record<ToolTrainingQuizGroupId, LiveTool[]> = {
  "tool-market-forces": ["Market Forces"],
  "tool-stockanalysis": ["StockAnalysis"],
  "tool-finviz": ["Finviz"],
  "tool-yahoo-finance": ["Yahoo Finance"],
  "tool-capstone": ["Market Forces", "StockAnalysis", "Finviz", "Yahoo Finance"],
  "tool-edgar": ["SEC EDGAR", "StockAnalysis", "Finviz"],
  "tool-capstone-bank": ["Market Forces", "StockAnalysis", "Finviz", "Yahoo Finance", "SEC EDGAR"],
};

const at = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/tools/:toolId" element={<ToolsHub />} />
    </Routes>
  </MemoryRouter>
);

/** Every live link a lesson declares, on a screen or a column walk, with where it came from. */
function declared(lessonIndex: number): { where: string; link: LiveLink }[] {
  const t = TOOL_LESSONS[lessonIndex]!;
  const out: { where: string; link: LiveLink }[] = [];
  for (const s of t.screens) for (const link of s.live ?? []) out.push({ where: `${t.slug}/${s.id}`, link });
  for (const s of t.simulations ?? []) if (s.kind === "columns") for (const link of s.live ?? []) out.push({ where: `${t.slug}/${s.id}`, link });
  for (const k of t.tasks) out.push({ where: `${t.slug}/${k.id}`, link: k.live });
  for (const st of t.workflow?.steps ?? []) for (const link of st.live) out.push({ where: `${t.slug}/${st.id}`, link });
  return out;
}

const escapeHref = (url: string) => url.replace(/&/g, "&amp;");

describe("tool training live links", () => {
  TOOL_LESSONS.forEach((t, i) => {
    it(`${t.route}: every declared live link is well formed and opens the lesson's tool`, () => {
      const links = declared(i);
      assert.ok(links.length > 0, `${t.slug} declares no live links`);
      for (const { where, link } of links) {
        assert.ok(isLiveLinkValid(link), `${where}: ${link.url}`);
        assert.ok(LESSON_TOOLS[t.id].includes(link.tool), `${where}: ${link.tool} is not a ${t.slug} tool`);
        if (link.tool === "Market Forces") assert.ok(link.url.startsWith(MARKET_FORCES_URL), where);
        else assert.ok(link.url.startsWith(LIVE_TOOL_ORIGINS[link.tool]) && link.url.startsWith("https://"), where);
      }
    });

    it(`${t.route}: live links render in a new tab with noopener and a dated note`, () => {
      const html = renderHtml(at(t.route));
      for (const s of t.screens) {
        for (const link of s.live ?? []) {
          const href = escapeHref(link.url);
          const tag = html.match(new RegExp(`<a href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`))?.[0];
          assert.ok(tag, `${s.id}: ${link.url} not rendered`);
          assert.match(tag!, /target="_blank"/);
          assert.match(tag!, /rel="noopener noreferrer"/);
        }
      }
      if (t.screens.some((s) => s.live?.length)) assert.match(html, /Live numbers will differ from this snapshot of/);
    });
  });

  it("column walks show their live links inside the simulation panel", () => {
    for (const t of TOOL_LESSONS) {
      for (const s of t.simulations ?? []) {
        if (s.kind !== "columns" || !s.live?.length) continue;
        const html = renderHtml(<SimPanel sim={s} walk={startWalk(s)} />);
        for (const link of s.live) assert.ok(html.includes(`href="${escapeHref(link.url)}"`), `${s.id}: ${link.url}`);
      }
    }
  });

  it("rejects links that leave their tool's site or are not https", () => {
    assert.equal(isLiveLinkValid({ tool: "Finviz", label: "x", url: "https://finance.yahoo.com/quote/NEM/" }), false);
    assert.equal(isLiveLinkValid({ tool: "StockAnalysis", label: "x", url: "http://stockanalysis.com/stocks/nem/" }), false);
    assert.equal(isLiveLinkValid({ tool: "Yahoo Finance", label: "x", url: "not a url" }), false);
    assert.equal(isLiveLinkValid({ tool: "Market Forces", label: "x", url: "https://example.com/#ticker=NEM" }), false);
  });
});

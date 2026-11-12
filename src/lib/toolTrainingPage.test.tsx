import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ToolsHub from "../pages/ToolsHub.tsx";
import { hrefs, renderHtml, renderText } from "./macro/renderHarness.ts";
import { TOOL_LESSONS } from "./toolTraining/index.ts";

const at = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/tools" element={<ToolsHub />} />
      <Route path="/tools/:toolId" element={<ToolsHub />} />
    </Routes>
  </MemoryRouter>
);

describe("tool training pages", () => {
  it("the hub lists every lesson, explains the screens and links the charting-apps comparison", () => {
    const html = renderHtml(at("/tools"));
    const links = hrefs(html);
    for (const t of TOOL_LESSONS) assert.ok(links.includes(t.route), t.route);
    assert.ok(links.includes("/practice/charting-apps"));
    assert.match(html, /data-testid="mock-screen"/);
    assert.match(html, /<figcaption/);
  });
  it("an unknown tool shows a way back", () => {
    assert.ok(hrefs(renderHtml(at("/tools/nope"))).includes("/tools"));
  });
  for (const t of TOOL_LESSONS) {
    it(`${t.route} renders every screen, step, drill, source and link from its data`, () => {
      const text = renderText(at(t.route));
      assert.ok(text.includes(t.title));
      for (const s of t.screens) {
        assert.ok(text.includes(s.alt), `${s.id} alt`);
        assert.ok(text.includes(s.caption), `${s.id} caption`);
        for (const c of s.callouts) assert.ok(text.includes(c.text), `${s.id} marker ${c.n}`);
      }
      for (const w of t.walkthroughs) for (const step of w.steps) assert.ok(text.includes(step), step);
      for (const d of t.drills) assert.ok(text.includes(d.prompt), d.id);
      for (const c of t.caveats) assert.ok(text.includes(c.title), c.title);
      const links = hrefs(renderHtml(at(t.route)));
      for (const s of t.sources) assert.ok(links.includes(s.url) || links.includes(s.url.replace(/&/g, "&amp;")), s.url);
      for (const l of t.links) assert.ok(links.includes(l.to) || links.includes(l.to.replace(/&/g, "&amp;")), l.to);
      assert.ok(links.includes(t.credit.url), "credit link");
    });
  }
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import MarketThemePage from "../components/practice/MarketThemePage.tsx";
import { hrefs, renderHtml, renderText } from "./macro/renderHarness.ts";
import { MARKET_THEMES } from "./marketThemes/index.ts";

describe("market theme pages", () => {
  for (const t of MARKET_THEMES) {
    it(`${t.route} renders every section from its data`, () => {
      const ui = (
        <MemoryRouter initialEntries={[t.route]}>
          <MarketThemePage id={t.id} />
        </MemoryRouter>
      );
      const text = renderText(ui);
      assert.ok(text.includes(t.title), "title");
      for (const w of t.wrappers) assert.ok(text.includes(w.name), w.name);
      for (const c of [...t.drivers, ...t.bridges, ...t.caveats]) assert.ok(text.includes(c.title), c.title);
      for (const r of t.math.rows) assert.ok(text.includes(r.label), r.label);
      for (const d of t.drills) assert.ok(text.includes(d.prompt), d.id);
      if (t.calculator) {
        const v = Object.fromEntries(t.calculator.inputs.map((i) => [i.id, i.value]));
        for (const o of t.calculator.compute(v)) assert.ok(text.includes(o.value), o.label);
      }
      const html = renderHtml(ui);
      const links = hrefs(html);
      for (const s of t.sources) assert.ok(links.includes(s.url) || links.includes(s.url.replace(/&/g, "&amp;")), s.url);
      for (const l of t.links) assert.ok(links.includes(l.to) || links.includes(l.to.replace(/&/g, "&amp;")), l.to);
    });
  }
});

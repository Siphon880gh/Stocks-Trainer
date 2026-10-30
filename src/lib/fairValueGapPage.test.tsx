import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import PracticeFairValueGap from "../pages/practice/FairValueGap.tsx";
import { hrefs, renderHtml, renderText } from "./macro/renderHarness.ts";
import { FVG_CAVEATS, FVG_LINKS, FVG_SESSIONS, FVG_SOURCE, FVG_STEPS } from "./fairValueGap.ts";

describe("/practice/fair-value-gap page", () => {
  const ui = (
    <MemoryRouter initialEntries={["/practice/fair-value-gap"]}>
      <PracticeFairValueGap />
    </MemoryRouter>
  );
  it("renders the steps, gap vs no gap, every caveat, every drill and the links", () => {
    const text = renderText(ui);
    assert.match(text, /Breakout, pullback and fair value gap/);
    for (const s of FVG_STEPS) assert.ok(text.includes(s.title), `step ${s.n}`);
    assert.match(text, /GAP: candle 3's low/);
    assert.match(text, /NO GAP: candle 3's low/);
    for (const c of FVG_CAVEATS) assert.ok(text.includes(c.title), c.id);
    for (const s of FVG_SESSIONS) assert.ok(text.includes(s.title), s.id);
    const links = hrefs(renderHtml(ui));
    for (const l of FVG_LINKS) assert.ok(links.includes(l.to) || links.includes(l.to.replace(/&/g, "&amp;")), l.to);
    assert.ok(links.includes(FVG_SOURCE.url), "credits the reel");
    assert.match(text, /a short Facebook trading reel/);
  });
});

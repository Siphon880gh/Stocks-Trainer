import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import PracticeOpeningRange from "../pages/practice/OpeningRange.tsx";
import { hrefs, renderHtml, renderText } from "./macro/renderHarness.ts";
import { ORB_CAVEATS, ORB_LINKS, ORB_SESSIONS, ORB_SOURCE } from "./openingRange.ts";

describe("/practice/opening-range page", () => {
  const ui = (
    <MemoryRouter initialEntries={["/practice/opening-range"]}>
      <PracticeOpeningRange />
    </MemoryRouter>
  );
  it("renders the rules, every caveat, every drill, the option table and the links", () => {
    const text = renderText(ui);
    assert.match(text, /Opening range breakout \(15-minute\)/);
    for (const c of ORB_CAVEATS) assert.ok(text.includes(c.title), c.id);
    for (const s of ORB_SESSIONS) assert.ok(text.includes(s.title), s.id);
    assert.match(text, /Expires today \(0DTE\)/);
    assert.doesNotMatch(text, /firstrade/i);
    const html = renderHtml(ui);
    const links = hrefs(html);
    for (const l of ORB_LINKS) assert.ok(links.includes(l.to) || links.includes(l.to.replace(/&/g, "&amp;")), l.to);
    assert.ok(links.includes(ORB_SOURCE.url), "credits the reel");
  });
});

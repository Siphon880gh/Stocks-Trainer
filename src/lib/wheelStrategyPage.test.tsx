import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import PracticeWheelStrategy from "../pages/practice/WheelStrategy.tsx";
import { hrefs, renderHtml, renderText } from "./macro/renderHarness.ts";
import { WHEEL_CAVEATS, WHEEL_CYCLE, WHEEL_DRILLS, WHEEL_LINKS, WHEEL_SCENARIOS, WHEEL_SCREENSHOT_LESSONS, WHEEL_VERDICT } from "./wheelStrategy.ts";

describe("/practice/wheel-strategy page", () => {
  const ui = (
    <MemoryRouter initialEntries={["/practice/wheel-strategy"]}>
      <PracticeWheelStrategy />
    </MemoryRouter>
  );
  it("renders the verdict, cycle, worked math, paths, evidence, screenshot lessons, drills, caveats and links", () => {
    const text = renderText(ui);
    assert.match(text, /The wheel strategy/);
    assert.ok(text.includes(WHEEL_VERDICT.answer));
    for (const s of WHEEL_CYCLE) assert.ok(text.includes(s.title), s.id);
    assert.match(text, /\$5,000/);
    assert.match(text, /48\.8/);
    assert.match(text, /\$510/);
    for (const s of WHEEL_SCENARIOS) assert.ok(text.includes(s.title), s.id);
    assert.match(text, /9\.54%/);
    assert.match(text, /-26\.8%/);
    assert.match(text, /32\.4%/);
    assert.match(text, /Wilshire/);
    for (const l of WHEEL_SCREENSHOT_LESSONS) assert.ok(text.includes(l.lesson), l.id);
    assert.match(text, /not as a recommendation/);
    for (const d of WHEEL_DRILLS) assert.ok(text.includes(d.prompt), d.id);
    for (const c of WHEEL_CAVEATS) assert.ok(text.includes(c.title), c.id);
    const links = hrefs(renderHtml(ui));
    for (const l of WHEEL_LINKS) assert.ok(links.includes(l.to) || links.includes(l.to.replace(/&/g, "&amp;")), l.to);
  });
});

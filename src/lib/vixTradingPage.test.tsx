import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import PracticeVixTrading from "../pages/practice/VixTrading.tsx";
import { hrefs, renderHtml, renderText } from "./macro/renderHarness.ts";
import { EDGE_REQUIREMENTS, PAPER_PROCESS, STRATEGY_FAMILIES, VIX_DRILLS, VIX_INSTRUMENTS, VIX_KEY_IDEAS, VIX_LINKS, VIX_VERDICT } from "./vixTrading.ts";

describe("/practice/vix-trading page", () => {
  const ui = (
    <MemoryRouter initialEntries={["/practice/vix-trading"]}>
      <PracticeVixTrading />
    </MemoryRouter>
  );
  it("renders the verdict, the worked numbers, every instrument, strategy, drill and step, the credit and the links", () => {
    const text = renderText(ui);
    assert.match(text, /VIX trading for beginners/);
    assert.match(text, /Is VIX a valid play\?/);
    for (const p of VIX_VERDICT.paragraphs) assert.ok(text.includes(p.slice(0, 40)), p.slice(0, 40));
    assert.match(text, /about 5\.7%/);
    for (const x of VIX_INSTRUMENTS) assert.ok(text.includes(x.name), x.id);
    assert.match(text, /−\$15,000/);
    assert.match(text, /\+11\.1%/);
    assert.match(text, /[−-]14\.3%/);
    assert.match(text, /VIX3M is not a VIX future/);
    assert.match(text, /\$93\.33/);
    assert.match(text, /95% winners and −\$1,100/);
    assert.match(text, /400%/);
    for (const s of STRATEGY_FAMILIES) assert.ok(text.includes(s.name), s.id);
    for (const d of VIX_DRILLS) assert.ok(text.includes(d.prompt.slice(0, 30)), d.id);
    for (const p of PAPER_PROCESS) assert.ok(text.includes(p.title), p.id);
    assert.match(text, /Choosing no position is a valid outcome/);
    assert.match(text, /Key ideas/);
    for (const k of VIX_KEY_IDEAS) assert.ok(text.includes(k.concept), k.concept);
    assert.match(text, /Where an edge actually comes from: expected value vs price/);
    assert.match(text, /Long P\/L = N × \$1,000 × \(F exit − F entry\) − C/);
    assert.match(text, /= −\$2,000 before costs/);
    assert.match(text, /22 → 20/);
    assert.match(text, /loses \$100 \(breakeven 22/);
    assert.match(text, /\+\$225/);
    assert.match(text, /E\[V_T\] = 18/);
    assert.match(text, /E\[P\/L\] \+\$2,000/);
    assert.match(text, /E\[P\/L\] −\$1,400/);
    assert.match(text, /−\$40/);
    assert.match(text, /switches between positive and negative/);
    assert.match(text, /A model-implied edge is not evidence/);
    for (const r of EDGE_REQUIREMENTS) assert.ok(text.includes(r.title), r.id);
    assert.match(text, /Volatility rises, the long still loses/);
    assert.doesNotMatch(text, /\\\(|\\\[|\\text|\\mathbb/, "no raw LaTeX");
    assert.match(text, /VIX Trading for Beginners/);
    const html = renderHtml(ui);
    assert.match(html, /data-shape="hump"/);
    for (const id of ["contango", "backwardation", "flat"]) assert.match(html, new RegExp(`data-carry="${id}"`));
    for (const k of VIX_KEY_IDEAS) assert.match(html, new RegExp(`data-testid="${k.panel}"`), k.panel);
    const links = hrefs(html);
    for (const l of VIX_LINKS) assert.ok(links.includes(l.to) || links.includes(l.to.replace(/&/g, "&amp;")), l.to);
    assert.ok(links.includes("/playbooks/vix-curve-carry-paper"));
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import PracticeRiskPremiumPortfolio from "../pages/practice/RiskPremiumPortfolio.tsx";
import { hrefs, renderHtml, renderText } from "./macro/renderHarness.ts";
import { RPP_CAVEATS, RPP_LINKS, RPP_SLEEVES, RPP_VIDEO, VRP_SCENARIOS } from "./riskPremiumPortfolio.ts";

describe("/practice/risk-premium-portfolio page", () => {
  const ui = (
    <MemoryRouter initialEntries={["/practice/risk-premium-portfolio"]}>
      <PracticeRiskPremiumPortfolio />
    </MemoryRouter>
  );
  it("renders the sleeves, labelled examples, every drill and caveat, the backtest label and the links", () => {
    const text = renderText(ui);
    assert.match(text, /Risk-premium portfolio and the VIX overlay/);
    for (const s of RPP_SLEEVES) assert.ok(text.includes(s.ticker), s.ticker);
    assert.match(text, /textbook example, not the video's rule/);
    assert.match(text, /the creator's own numbers/);
    assert.match(text, /Not live or audited results/);
    assert.match(text, /about 80% of the whole account lost/);
    for (const s of VRP_SCENARIOS) assert.ok(text.includes(s.title), s.id);
    for (const c of RPP_CAVEATS) assert.ok(text.includes(c.title), c.id);
    const links = hrefs(renderHtml(ui));
    for (const l of RPP_LINKS) assert.ok(links.includes(l.to) || links.includes(l.to.replace(/&/g, "&amp;")), l.to);
    assert.ok(links.includes(RPP_VIDEO.watchUrl), "credits the video");
    assert.ok(links.includes(RPP_VIDEO.channelUrl), "links the channel");
  });
});

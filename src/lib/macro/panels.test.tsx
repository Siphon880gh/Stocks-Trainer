import { test } from "node:test";
import assert from "node:assert/strict";
import ExpectationsPanel from "../../components/macro/ExpectationsPanel";
import FedPricingCard from "../../components/macro/FedPricingCard";
import { RELEASES } from "./releases";
import { allMetrics, formatMetricValue } from "./display";
import { renderHtml, renderText } from "./renderHarness";
import { WORLD } from "./world";

test("expectations panel: no actual or surprise in pre-reveal markup", () => {
  for (const e of RELEASES) {
    const html = renderHtml(<ExpectationsPanel event={e} revealed={false} />);
    const text = renderText(<ExpectationsPanel event={e} revealed={false} />);
    assert.doesNotMatch(html, /data-field="actual"|data-field="surprise"|Market read/, e.id);
    // Any value legitimately on screen pre-reveal (any metric's consensus / range / priors) can coincide with an actual.
    const shown = allMetrics(e).flatMap((m) => [m.consensus, m.range[0], m.range[1], m.prior, m.priorRevised].filter((v) => v !== undefined).map((v) => formatMetricValue(m, v!)));
    for (const m of allMetrics(e)) {
      const a = formatMetricValue(m, m.actual);
      if (!shown.includes(a)) assert.ok(!text.includes(` ${a} `), `${e.id} leaks ${a}`);
      assert.ok(text.includes(formatMetricValue(m, m.consensus)), `${e.id} consensus`);
    }
  }
});

test("expectations panel: reveal shows actual, surprise and read", () => {
  for (const e of RELEASES) {
    const html = renderHtml(<ExpectationsPanel event={e} revealed />);
    assert.equal((html.match(/data-field="actual"/g) ?? []).length, allMetrics(e).length, e.id);
    assert.match(html, /Market read/);
    for (const m of allMetrics(e)) assert.ok(renderText(<ExpectationsPanel event={e} revealed />).includes(formatMetricValue(m, m.actual)), `${e.id} ${m.key}`);
  }
});

test("Fed pricing card probabilities sum to 100 for every meeting", () => {
  for (const m of WORLD.meetings) {
    const html = renderHtml(<FedPricingCard month={m.month} />);
    const probs = [...html.matchAll(/data-field="prob">(\d+)%/g)].map((x) => Number(x[1]));
    assert.ok(probs.length >= 2, m.label);
    assert.equal(probs.reduce((a, b) => a + b, 0), 100, m.label);
  }
});

import ReactionRulesTable from "../../components/macro/ReactionRulesTable";
import { REGIME_NAMES } from "./reactions";

test("rules table renders every regime", () => {
  const t = renderText(<ReactionRulesTable />);
  for (const n of Object.values(REGIME_NAMES)) assert.ok(t.includes(n), n);
  assert.match(t, /can reverse/);
});

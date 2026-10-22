import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryRouter } from "react-router-dom";
import OptionsLadder from "../../components/academy/options/OptionsLadder";
import PayoffChart from "../../components/academy/options/PayoffChart";
import { ACADEMY_KEY, emptyAcademy, memoryStorage } from "./storage";
import { OPTIONS_RISK_STATEMENT } from "./copy";
import { LADDER_STRATEGIES, getStrategy, strategiesForLevel } from "./options/ladder";
import { samplePayoff, summarize, fmtUsd } from "./options/payoff";
import { hrefs, renderHtml, renderText } from "./renderHarness";
import { routeExists } from "./refs";

const view = (storage = memoryStorage()) => (
  <MemoryRouter>
    <OptionsLadder storage={storage} />
  </MemoryRouter>
);

test("risk statement is shown at the top and bottom of the ladder", () => {
  const text = renderText(view());
  assert.ok(text.split(OPTIONS_RISK_STATEMENT).length - 1 >= 2);
});

test("fresh state: level 1 open, levels 2–4 locked with no strategy cards or checks", () => {
  const html = renderHtml(view());
  assert.match(html, /data-level="1" data-unlocked="true"/);
  for (const l of [2, 3, 4]) assert.match(html, new RegExp(`data-level="${l}" data-unlocked="false"`));
  for (const s of strategiesForLevel(1)) assert.ok(html.includes(`data-strategy="${s.id}"`));
  for (const s of strategiesForLevel(4)) assert.ok(!html.includes(`data-strategy="${s.id}"`), s.id);
  assert.ok(!html.includes('data-testid="start-check-2"'));
  // check button disabled until acknowledged
  assert.match(html, /disabled=""[^>]*data-testid="start-check-1"/);
});

test("passed level 1 unlocks level 2", () => {
  const st = emptyAcademy();
  const storage = memoryStorage({ [ACADEMY_KEY]: JSON.stringify({ ...st, options: { ...st.options, passed: { "1": "2026-10-20T00:00:00.000Z" } } }) });
  const html = renderHtml(view(storage));
  assert.match(html, /data-level="1" data-unlocked="true" data-passed="true"/);
  assert.match(html, /data-level="2" data-unlocked="true"/);
});

test("stats table shows summarize() values for each open strategy", () => {
  const text = renderText(view());
  for (const s of strategiesForLevel(1)) {
    const sum = summarize(s);
    assert.ok(text.includes(fmtUsd(sum.maxLoss)), `${s.id} max loss`);
    for (const b of sum.breakevens) assert.ok(text.includes(fmtUsd(b)), `${s.id} BE`);
  }
});

test("chart path points equal payoff samples", () => {
  for (const s of LADDER_STRATEGIES) {
    const html = renderHtml(<PayoffChart strategy={s} />);
    const path = html.match(/<path d="([^"]+)"/)![1];
    const pts = samplePayoff(s, 30, 70, 81);
    const segs = path.split(/(?=[ML])/);
    assert.equal(segs.length, pts.length, s.id);
    assert.ok(html.includes('data-path="payoff"'));
    // y must be monotone with payoff: compare ordering of first/last against samples
    const ys = segs.map((g) => Number(g.slice(1).split(",")[1]));
    for (let i = 1; i < pts.length; i++) {
      const dv = pts[i][1] - pts[i - 1][1];
      const dy = ys[i] - ys[i - 1];
      if (Math.abs(dv) > 1e-9) assert.ok(Math.sign(dy) === -Math.sign(dv), `${s.id} @${i}`);
    }
    for (const b of summarize(s).breakevens) if (b >= 30 && b <= 70) assert.ok(html.includes(`data-breakeven="${b}"`), `${s.id} BE ${b}`);
  }
  assert.ok(getStrategy("iron-condor"));
});

test("page links resolve", () => {
  for (const h of hrefs(renderHtml(view()))) assert.ok(routeExists(h), h);
});

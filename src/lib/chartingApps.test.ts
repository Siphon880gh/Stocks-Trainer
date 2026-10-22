import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { BROKER_LEARN, CHART_APPS, CHART_APP_QUESTIONS, CHART_APP_TERMS, WEBULL_POINTS, WEBULL_SCREENSHOTS } from "./chartingApps";

test("11 charting apps, each with a source", () => {
  assert.equal(CHART_APPS.length, 11);
  for (const r of CHART_APPS) assert.ok(r.sources.length > 0, r.app);
});

test("MACD is never taught as an overbought/oversold oscillator", () => {
  const p = WEBULL_POINTS.find((x) => x.includes("MACD is unbounded"));
  assert.ok(p);
});

test("Webull screenshots: webp files exist in public/, small, with alt text and no owner attribution", () => {
  for (const s of WEBULL_SCREENSHOTS) {
    for (const f of [s.src, s.srcSmall]) {
      assert.match(f, /\.webp$/);
      const path = `public${f}`;
      assert.ok(existsSync(path), path);
      assert.ok(statSync(path).size < 80_000, `${path} too large`);
    }
    assert.ok(s.alt.length > 40);
    assert.doesNotMatch(JSON.stringify(s), /\b(my|mine|owner|weng)\b/i);
    assert.doesNotMatch(s.captions.join(" "), /accura/i);
  }
});

test("broker learning sites and questions are well-formed", () => {
  assert.equal(BROKER_LEARN.length, 5);
  assert.equal(new Set(CHART_APP_QUESTIONS.map((q) => q.id)).size, CHART_APP_QUESTIONS.length);
  for (const q of CHART_APP_QUESTIONS) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
  assert.equal(new Set(CHART_APP_TERMS.map((t) => t.id)).size, CHART_APP_TERMS.length);
});

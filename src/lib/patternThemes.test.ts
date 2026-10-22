import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERNS } from "./patterns";
import { PATTERN_OHLC } from "./ohlcData";
import { LITERACY_TERMS } from "./literacyTerms";
import {
  HIERARCHY, PATTERN_THEMES, QUICK_MAP, THEMES, THEME_DRILL_INFO, THEME_IDS, THEME_PATTERNS, THEME_QUESTIONS, THEMES_QUOTE,
} from "./patternThemes";

test("every pattern record has a valid primary theme (and only valid secondaries)", () => {
  assert.ok(PATTERNS.length >= 140);
  for (const p of PATTERNS) {
    assert.ok(p.themes, `${p.id} has no themes`);
    assert.ok(THEME_IDS.includes(p.themes!.primary), `${p.id} primary ${p.themes!.primary}`);
    for (const s of p.themes!.secondary) {
      assert.ok(THEME_IDS.includes(s), `${p.id} secondary ${s}`);
      assert.notEqual(s, p.themes!.primary, `${p.id} repeats its primary`);
    }
  }
  const ids = new Set(PATTERNS.map((p) => p.id));
  for (const k of Object.keys(PATTERN_THEMES)) assert.ok(ids.has(k), `stale theme entry ${k}`);
});

test("17 themes with a question and examples; quick map has the 19 rows; hierarchy has 5 steps", () => {
  assert.equal(THEMES.length, 17);
  THEMES.forEach((t, i) => {
    assert.equal(t.n, i + 1);
    assert.ok(t.question.endsWith("?"), t.id);
    assert.ok(t.examples.length >= 3, t.id);
  });
  assert.equal(QUICK_MAP.length, 19);
  assert.equal(QUICK_MAP[0].family, "Dark Cloud Cover");
  assert.equal(QUICK_MAP[18].family, "Failed breakout / breakdown");
  const ids = new Set(PATTERNS.map((p) => p.id));
  for (const r of QUICK_MAP) for (const id of r.patterns) assert.ok(ids.has(id), `${r.family}: ${id}`);
  assert.deepEqual(HIERARCHY.map((h) => h.id), ["context", "location", "theme", "trigger", "risk"]);
  assert.equal(THEMES_QUOTE, "A named pattern is not a prediction. It is an organised hypothesis about price behaviour that still needs confirmation and risk control.");
});

test("primary themes agree with pattern direction for reversals", () => {
  for (const p of PATTERNS) {
    const pr = p.themes!.primary;
    if (pr === "bullish-reversal") assert.equal(p.sentiment, "bullish", p.id);
    if (pr === "bearish-reversal") assert.equal(p.sentiment, "bearish", p.id);
  }
});

test("example patterns have SIMULATED charts that match their rules", () => {
  for (const p of THEME_PATTERNS) assert.ok(PATTERN_OHLC[p.def.id]?.length, p.def.id);
  const ib = PATTERN_OHLC["inside-bar"];
  assert.ok(ib[3].high < ib[2].high && ib[3].low > ib[2].low, "inside bar inside mother range incl wicks");
  const fp = PATTERN_OHLC["four-price-doji"][2];
  assert.ok(fp.open === fp.high && fp.high === fp.low && fp.low === fp.close);
  const cg = PATTERN_OHLC["common-gap"];
  assert.ok(cg[2].low > cg[1].high, "gap");
  assert.ok(cg[3].low <= cg[1].high, "filled");
  // drill confirmations clear the far end of the pattern
  const pb = PATTERN_OHLC["bs-pipe-bottom"];
  assert.ok(pb[pb.length - 1].close > Math.max(pb[3].high, pb[4].high));
  const pt = PATTERN_OHLC["bs-pipe-top"];
  assert.ok(pt[pt.length - 1].close < Math.min(pt[3].low, pt[4].low));
  const fb = PATTERN_OHLC["failed-breakout"];
  assert.ok(fb[3].close > 64000 && fb[4].close < 64000, "break, then close back inside");
  const termIds = new Set(LITERACY_TERMS.map((t) => t.id));
  for (const [k, v] of Object.entries(THEME_DRILL_INFO)) assert.ok(termIds.has(v.term), `${k} term ${v.term}`);
  assert.ok(termIds.has("bull-trap") && termIds.has("bear-trap"));
});

test("Learn group pattern-themes: 15+ questions, unique ids, valid answers", () => {
  assert.ok(THEME_QUESTIONS.length >= 15);
  assert.equal(new Set(THEME_QUESTIONS.map((q) => q.id)).size, THEME_QUESTIONS.length);
  for (const q of THEME_QUESTIONS) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
});

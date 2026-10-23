import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERNS } from "./patterns.ts";
import { LITERACY_TERMS } from "./literacyTerms.ts";
import { ALL_SOURCE_ROWS, PATTERN_SOURCES } from "./patternSourceNames.ts";
import { PATTERN_ALIASES } from "./patternAliases.ts";

const patternIds = new Set(PATTERNS.map((p) => p.id));
const termIds = new Set(LITERACY_TERMS.map((t) => t.id));

test("every source pattern name maps to a pattern, a glossary term, or a documented exclusion", () => {
  assert.ok(PATTERN_SOURCES.length >= 13);
  assert.ok(ALL_SOURCE_ROWS.length >= 300, `only ${ALL_SOURCE_ROWS.length} source rows`);
  const bad: string[] = [];
  for (const row of ALL_SOURCE_ROWS) {
    if (!row.map.length) bad.push(`${row.source}: ${row.name} has no mapping`);
    for (const m of row.map) {
      if (m.startsWith("term:")) {
        if (!termIds.has(m.slice(5))) bad.push(`${row.source}: ${row.name} -> missing term ${m}`);
      } else if (m.startsWith("x:")) {
        if (m.length < 30) bad.push(`${row.source}: ${row.name} exclusion needs a real reason`);
        if (row.map.length > 1) bad.push(`${row.source}: ${row.name} cannot be both excluded and mapped`);
      } else if (!patternIds.has(m)) bad.push(`${row.source}: ${row.name} -> missing pattern ${m}`);
    }
  }
  assert.deepEqual(bad, []);
});

test("the seven poster names researched in r27 are taught as patterns", () => {
  const poster = PATTERN_SOURCES.find((s) => s.id === "poster-dark")!;
  const want: Record<string, string> = {
    "Tweezer Star": "tweezer-star",
    "Trend Stage Bounce": "trend-stage-bounce",
    "Parallelogram (Bullish)": "bull-flag",
    "Three Stage Pattern (bullish)": "measured-move-up",
    "Three Stage Pattern (bearish)": "measured-move-down",
    "On Neckline (Ascending)": "neckline-retest-bullish",
    "On Neckline (Descending)": "neckline-retest-bearish",
    "Square Bottom": "rectangle-bottom",
    "Step Top": "step-top",
    "Step Bottom": "step-bottom",
  };
  for (const [name, id] of Object.entries(want)) {
    assert.ok(poster.rows.find((x) => x.name === name)?.map.includes(id), `${name} -> ${id}`);
    assert.ok(patternIds.has(id), id);
  }
});

test("every chart-pattern and candle id is reached by some source row or is an app-only extra", () => {
  const reached = new Set(ALL_SOURCE_ROWS.flatMap((r) => r.map));
  // the 13 r27 additions must each be reached by a source name
  for (const id of [
    "tweezer-star", "trend-stage-bounce", "trendline-breakdown", "measured-move-up", "measured-move-down",
    "neckline-retest-bullish", "neckline-retest-bearish", "rectangle-bottom", "step-top", "step-bottom",
    "bullish-three-pushes", "bearish-breakaway-gap", "bearish-runaway-gap",
  ]) assert.ok(reached.has(id), id);
});

test("aliases point at real patterns and do not repeat the pattern's own name", () => {
  for (const [id, names] of Object.entries(PATTERN_ALIASES)) {
    const p = PATTERNS.find((x) => x.id === id);
    assert.ok(p, `alias for missing pattern ${id}`);
    for (const n of names) assert.notEqual(n.toLowerCase(), p!.name.toLowerCase(), `${id} alias repeats its name`);
  }
});

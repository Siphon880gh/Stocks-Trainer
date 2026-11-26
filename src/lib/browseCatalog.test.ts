import { test } from "node:test";
import assert from "node:assert/strict";
import { BROWSE_SECTIONS, browseIndex, searchBrowse } from "./browseCatalog";
import { routeExists } from "./academy/refs";
import { PRACTICE_FAMILIES, PRACTICE_FAMILY_IDS, PRACTICE_MENU, TOOL_TRAINING, DEEP_STUDY, OTHER_FACTORS, QUICK_DECISIONS, ACADEMY_MORE, PATTERN_MORE, DASHBOARD_MORE } from "./appNav";
import { LEVELS } from "./academy/content/levels";
import { MACRO_LESSONS } from "./macro/lessons";
import { CASE_PACKS } from "./caseStudies";
import { CHALLENGES } from "./academy/challenges";

const allLinks = BROWSE_SECTIONS.flatMap((s) => s.links.map((l) => l.to));

test("browse: every catalog link opens a real route", () => {
  for (const s of BROWSE_SECTIONS) for (const l of s.links) assert.ok(routeExists(l.to), `${s.id}: ${l.to}`);
  for (const h of browseIndex()) assert.ok(routeExists(h.to), `${h.kind}: ${h.to}`);
});

test("browse: practice families hold every Practice-menu lab exactly once", () => {
  const ids = PRACTICE_FAMILY_IDS.flatMap((f) => f.ids);
  assert.equal(new Set(ids).size, ids.length, "duplicate family item");
  for (const row of PRACTICE_MENU) assert.ok(ids.includes(row.id), `practice item ${row.id} has no family`);
  assert.equal(PRACTICE_FAMILIES.length, PRACTICE_FAMILY_IDS.length);
});

test("browse: every old menu item is still listed", () => {
  const old = [...DASHBOARD_MORE, ...ACADEMY_MORE, ...PATTERN_MORE, ...PRACTICE_MENU, ...TOOL_TRAINING, ...DEEP_STUDY, ...OTHER_FACTORS, ...QUICK_DECISIONS];
  for (const item of old) assert.ok(allLinks.includes(item.to), `old menu item ${item.label} (${item.to}) is missing`);
  assert.ok(allLinks.includes("/training"), "full Table of Contents");
});

test("browse: at-risk entry points have a link", () => {
  for (const l of LEVELS) assert.ok(allLinks.includes(`/academy/test-out/${l.id}`), `test-out ${l.id}`);
  for (const l of MACRO_LESSONS) assert.ok(allLinks.includes(`/macro/${l.id}`), `macro lesson ${l.id}`);
  for (const p of CASE_PACKS) assert.ok(allLinks.includes(`/cases?pack=${p.id}`), `case pack ${p.id}`);
  for (const c of CHALLENGES) assert.ok(allLinks.includes(`/paper/challenges/${c.id}`), `challenge ${c.id}`);
  for (const c of ["equity", "future", "forex", "crypto", "option_context"]) assert.ok(allLinks.includes(`/coach?class=${c}`), `coach ${c}`);
});

test("browse: search finds glossary terms, patterns and labs", () => {
  assert.equal(searchBrowse("").length, 0);
  assert.ok(searchBrowse("doji").some((h) => h.to === "/archive?tab=patterns&open=doji"));
  assert.ok(searchBrowse("opening range").length > 0);
  assert.ok(searchBrowse("doji").length <= 40);
  assert.equal(new Set(browseIndex().map((h) => h.to)).size, browseIndex().length, "duplicate hrefs");
});

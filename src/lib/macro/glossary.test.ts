import { test } from "node:test";
import assert from "node:assert/strict";
import { MACRO_TERMS } from "./glossary";
import { LITERACY_TERMS, getLiteracyTerm } from "../literacyTerms";

test("macro glossary: ≥ 35 terms, ids unique across the whole glossary, all reachable", () => {
  assert.ok(MACRO_TERMS.length >= 35, `${MACRO_TERMS.length}`);
  const ids = LITERACY_TERMS.map((t) => t.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(dupes.filter((d) => MACRO_TERMS.some((t) => t.id === d)), []);
  for (const t of MACRO_TERMS) {
    assert.equal(getLiteracyTerm(t.id)?.name, t.name);
    assert.ok(t.summary.length > 20 && t.detail.length > 60, t.id);
    assert.match(t.id, /^[a-z0-9-]+$/);
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { ACADEMY_SIBLING_TERM_IDS, ACADEMY_TERMS } from "./terms";
import { LITERACY_TERMS, getLiteracyTerm } from "../literacyTerms";
import { bannedIn } from "./content/banned";

test("≥ 25 Academy glossary terms, registered once in the Archive, ids unique app-wide", () => {
  assert.ok(ACADEMY_TERMS.length >= 25);
  const ids = LITERACY_TERMS.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "no id collisions across all literacy terms");
  for (const t of ACADEMY_TERMS) {
    assert.equal(getLiteracyTerm(t.id), t, t.id);
    assert.ok(t.summary.length > 20 && t.detail.length > 40, t.id);
    assert.deepEqual(bannedIn(`${t.summary} ${t.detail}`), [], t.id);
  }
});

test("sibling terms already in the app are linked, not copied", () => {
  const mine = new Set(ACADEMY_TERMS.map((t) => t.id));
  for (const id of ACADEMY_SIBLING_TERM_IDS) {
    assert.ok(getLiteracyTerm(id), `${id} exists elsewhere`);
    assert.ok(!mine.has(id), `${id} is not duplicated`);
  }
  const names = new Map(LITERACY_TERMS.filter((t) => !mine.has(t.id)).map((t) => [t.name.toLowerCase(), t.id]));
  for (const t of ACADEMY_TERMS) assert.ok(!names.has(t.name.toLowerCase()), `${t.name} duplicates ${names.get(t.name.toLowerCase())}`);
});

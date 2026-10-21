import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LITERACY_TERMS, getLiteracyTerm } from "../literacyTerms";
import { FINANCIAL_TERMS } from "./terms";

const CATEGORIES = new Set(["ownership", "markets", "position", "process"]);

describe("financial glossary terms", () => {
  it("has at least 20 new terms", () => {
    assert.ok(FINANCIAL_TERMS.length >= 20, `${FINANCIAL_TERMS.length}`);
  });
  it("every term is complete, valid and labelled SAMPLE", () => {
    for (const t of FINANCIAL_TERMS) {
      assert.match(t.id, /^[a-z0-9-]+$/);
      assert.ok(t.name.length > 2 && t.summary.length > 15 && t.detail.length > 40, t.id);
      assert.ok(CATEGORIES.has(t.category), t.id);
      assert.match(t.detail, /SAMPLE/, t.id);
      assert.ok(t.summary.length <= 140, `${t.id} summary is ${t.summary.length} chars`);
    }
  });
  it("ids are unique across the whole glossary and resolve via getLiteracyTerm", () => {
    for (const t of FINANCIAL_TERMS) {
      assert.equal(LITERACY_TERMS.filter((x) => x.id === t.id).length, 1, `duplicate id ${t.id}`);
      assert.equal(getLiteracyTerm(t.id)?.name, t.name);
    }
  });
});

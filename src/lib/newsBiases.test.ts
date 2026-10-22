import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BIAS_CHECKLIST, HORIZON_ROWS, NEWS_BIASES, NEWS_BIAS_QUESTIONS, NEWS_BIAS_SOURCES, NEWS_BIAS_TERMS, NEWS_DAY_STEPS } from "./newsBiases.ts";
import { LITERACY_TERMS } from "./literacyTerms.ts";

describe("news, biases & short-term options", () => {
  it("each bias has a definition, a news example and a countermeasure; loss aversion cites Kahneman & Tversky", () => {
    for (const id of ["recency-bias", "availability-bias", "confirmation-bias", "fomo", "loss-aversion", "anchoring"]) {
      const b = NEWS_BIASES.find((x) => x.id === id);
      assert.ok(b && b.definition.length > 30 && b.newsExample.length > 30 && b.countermeasure.length > 30, id);
    }
    assert.match(NEWS_BIASES.find((b) => b.id === "loss-aversion")!.source!.label, /Kahneman & Tversky \(1979\)/);
  });

  it("terms are in the glossary; every glossary id a question links to exists", () => {
    const ids = new Set(LITERACY_TERMS.map((t) => t.id));
    for (const t of NEWS_BIAS_TERMS) assert.ok(ids.has(t.id), t.id);
    for (const id of ["leaps", "information-overload", "anchoring"]) assert.ok(ids.has(id), id);
    for (const q of NEWS_BIAS_QUESTIONS) if (q.glossaryTermId) assert.ok(ids.has(q.glossaryTermId), `${q.id} -> ${q.glossaryTermId}`);
  });

  it("≥15 well-formed questions with unique ids", () => {
    assert.ok(NEWS_BIAS_QUESTIONS.length >= 15);
    assert.equal(new Set(NEWS_BIAS_QUESTIONS.map((q) => q.id)).size, NEWS_BIAS_QUESTIONS.length);
    for (const q of NEWS_BIAS_QUESTIONS) {
      assert.equal(q.options.length, 4, q.id);
      assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
      assert.equal(new Set(q.options.map((o) => o.label)).size, 4, q.id);
    }
  });

  it("horizon, checklist, scenario and sources are complete and anonymous", () => {
    assert.equal(HORIZON_ROWS.length, 3);
    assert.match(HORIZON_ROWS[2]!.horizon, /LEAPS/);
    assert.ok(BIAS_CHECKLIST.length >= 5);
    for (const s of NEWS_DAY_STEPS) assert.ok(NEWS_BIASES.some((b) => b.id === s.bias), s.id);
    for (const s of NEWS_BIAS_SOURCES) assert.match(s.url, /^https:\/\//);
    const all = JSON.stringify([NEWS_BIASES, NEWS_BIAS_TERMS, NEWS_BIAS_QUESTIONS, HORIZON_ROWS]);
    assert.doesNotMatch(all, /\[\d+\]|corrected|actually|myth|\btheta\b/i);
  });
});

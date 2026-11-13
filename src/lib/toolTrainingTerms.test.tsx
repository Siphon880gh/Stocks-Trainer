import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ToolsHub from "../pages/ToolsHub.tsx";
import { renderHtml } from "./macro/renderHarness.ts";
import { getLiteracyTerm } from "./literacyTerms.ts";
import {
  FIELD_TERM_IDS,
  TOOL_FIELD_TERMS,
  TOOL_LESSONS,
  fieldLabelKey,
  fieldTermId,
  screenFieldTermIds,
  toolTextTerms,
  type ToolLesson,
  type ToolText,
} from "./toolTraining/index.ts";

const at = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/tools/:toolId" element={<ToolsHub />} />
    </Routes>
  </MemoryRouter>
);

/** Every piece of lesson copy that can carry `{ text, term }` runs. */
function lessonTexts(t: ToolLesson): { where: string; text: ToolText }[] {
  return [
    ...t.intro.map((text, i) => ({ where: `${t.slug} intro ${i}`, text })),
    ...t.screens.flatMap((s) => s.callouts.map((c) => ({ where: `${t.slug}/${s.id} marker ${c.n}`, text: c.text }))),
    ...t.walkthroughs.flatMap((w) => w.steps.map((text, i) => ({ where: `${t.slug} ${w.title} step ${i + 1}`, text }))),
  ];
}

describe("tool training hover terms", () => {
  it("every screen label marked for hover resolves to a glossary definition", () => {
    for (const [label, id] of Object.entries(FIELD_TERM_IDS)) {
      const term = getLiteracyTerm(id);
      assert.ok(term, `${label} → ${id} is not in the glossary`);
      assert.ok(term!.summary.trim().length > 10, `${id} summary`);
    }
  });

  it("every term marked in lesson copy resolves, and its text appears in the sentence", () => {
    let marked = 0;
    for (const t of TOOL_LESSONS) {
      for (const { where, text } of lessonTexts(t)) {
        for (const ref of toolTextTerms(text)) {
          marked += 1;
          assert.ok(getLiteracyTerm(ref.term), `${where}: ${ref.term}`);
          assert.ok(ref.text.trim(), `${where}: empty term text`);
        }
      }
    }
    assert.ok(marked > 0);
  });

  it("new field definitions are complete and do not shadow existing glossary ids", () => {
    const ids = TOOL_FIELD_TERMS.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const t of TOOL_FIELD_TERMS) {
      assert.ok(t.name && t.summary && t.detail, t.id);
      assert.equal(getLiteracyTerm(t.id), t, `${t.id} is defined twice`);
    }
  });

  it("label lookup ignores footnote stars and a trailing date", () => {
    assert.equal(fieldLabelKey("Adj Close**"), "Adj Close");
    assert.equal(fieldLabelKey("Short % of Float (10/30/2026)"), "Short % of Float");
    assert.equal(fieldTermId("Forward P/E"), "forward-pe");
    assert.equal(fieldTermId("Not a field"), undefined);
  });

  for (const t of TOOL_LESSONS) {
    it(`${t.route}: hover terms render on screens and callouts, and simulations still open`, () => {
      const html = renderHtml(at(t.route));
      const rendered = new Set([...html.matchAll(/data-glossary-term="([^"]+)"/g)].map((m) => m[1]!));
      for (const s of t.screens) for (const id of screenFieldTermIds(s)) assert.ok(rendered.has(id), `${s.id}: ${id}`);
      for (const { where, text } of lessonTexts(t)) for (const ref of toolTextTerms(text)) assert.ok(rendered.has(ref.term), `${where}: ${ref.term}`);
      if (t.screens.some((s) => screenFieldTermIds(s).length)) {
        assert.match(html, /data-testid="screen-terms"/);
        // The focusable copy outside the hidden frame: a keyboard stop with a button role.
        assert.match(html, /<span tabindex="0" role="button" aria-expanded="false" data-glossary-term=/);
      }
      if (t.simulations?.length) assert.match(html, /data-sim-trigger=/);
    });
  }
});

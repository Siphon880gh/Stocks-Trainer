import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { MemoryRouter } from "react-router-dom";
import { renderHtml } from "./renderHarness";
import MacroTrainingCard from "../../components/macro/MacroTrainingCard";
import CaseMacroLink from "../../components/macro/CaseMacroLink";
import { MACRO_CASE_LESSON_LINKS, macroLinkForCase } from "./caseLinks";
import { MACRO_QUIZ_GROUP_IDS } from "./quiz/groups";
import { QUIZ_GROUPS, getQuestionsForGroup } from "../quizData";
import { LITERACY_TERMS } from "../literacyTerms";
import { MACRO_TERM_IDS } from "./glossary";
import { getCaseStudy, CASE_STUDIES } from "../caseStudies";

test("MF8.M1: every macro group registered and returns ≥ 10 questions; glossary in Archive list", () => {
  for (const g of MACRO_QUIZ_GROUP_IDS) {
    assert.ok(QUIZ_GROUPS.some((x) => x.id === g), g);
    assert.ok(getQuestionsForGroup(g).length >= 10, g);
  }
  for (const id of MACRO_TERM_IDS) assert.ok(LITERACY_TERMS.some((t) => t.id === id), id);
});

test("MF8.M1: Training card links the desk, the game and all 5 groups", () => {
  const html = renderHtml(
    <MemoryRouter>
      <MacroTrainingCard progress={{ rounds: {} }} />
    </MemoryRouter>,
  );
  assert.match(html, /href="\/macro"/);
  assert.match(html, /href="\/macro\/play"/);
  for (const g of MACRO_QUIZ_GROUP_IDS) assert.ok(html.includes(`group=${g}&amp;start=1`), g);
  assert.match(html, /SIMULATED/);
});

test("MF8.M2: mapped case ids exist, links resolve, case data unchanged", () => {
  for (const [caseId, lessonId] of Object.entries(MACRO_CASE_LESSON_LINKS)) {
    const c = getCaseStudy(caseId);
    assert.ok(c && c.id === caseId, caseId);
    const l = macroLinkForCase(caseId)!;
    assert.equal(l.lessonId, lessonId);
    assert.match(l.sourceUrl, /^https:\/\//);
    const html = renderHtml(
      <MemoryRouter>
        <CaseMacroLink caseId={caseId} />
      </MemoryRouter>,
    );
    assert.ok(html.includes(`href="/macro/${lessonId}"`) && html.includes("Read the real release"));
  }
  assert.equal(macroLinkForCase("case-macro-risk-off"), undefined);
  // The bridge is read-only: the case bank is not mutated by importing the macro modules.
  const before = createHash("sha1").update(JSON.stringify(CASE_STUDIES)).digest("hex");
  macroLinkForCase("case-macro-print");
  assert.equal(createHash("sha1").update(JSON.stringify(CASE_STUDIES)).digest("hex"), before);
});

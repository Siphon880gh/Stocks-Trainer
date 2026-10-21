import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import FinancialsTrainingCard from "../../components/financials/FinancialsTrainingCard";
import { LITERACY_TERMS } from "../literacyTerms";
import { getQuestionsForGroup, QUIZ_GROUPS } from "../quizData";
import { FINANCIALS_QUIZ_GROUPS } from "./quizBanks";
import { FINANCIAL_TERMS } from "./terms";
import { emptyPrintProgress, recordRound } from "./readThePrintProgress";

test("FE7.M1: every new group is in QUIZ_GROUPS and returns ≥ 10 questions", () => {
  for (const g of FINANCIALS_QUIZ_GROUPS) {
    assert.ok(QUIZ_GROUPS.some((x) => x.id === g.id), g.id);
    assert.ok(getQuestionsForGroup(g.id).length >= 10, g.id);
  }
});

test("FE7.M1: financial glossary terms are in the Archive literacy list", () => {
  const ids = new Set(LITERACY_TERMS.map((t) => t.id));
  for (const t of FINANCIAL_TERMS) assert.ok(ids.has(t.id), t.id);
});

test("FE7.M1: Training card links the game, the lab, the forecast and the 4 groups", () => {
  const p = recordRound(emptyPrintProgress(), "nwcl-q2fy25", true, true, new Date("2026-10-21T12:00:00Z"));
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <FinancialsTrainingCard progress={{ ...p, bestSessionScore: 3 }} />
    </MemoryRouter>,
  );
  assert.ok(html.includes('href="/practice/read-the-print"'));
  assert.ok(html.includes('href="/practice/statements"'));
  assert.ok(html.includes('href="/practice/statements#forecast"'));
  assert.ok(html.includes("1/14 rounds played · best session 3"));
  for (const g of FINANCIALS_QUIZ_GROUPS) {
    assert.ok(html.includes(`data-group="${g.id}"`), g.id);
    assert.ok(html.includes(`href="/training?group=${g.id}&amp;start=1"`), `${g.id} opens the quiz`);
  }
});

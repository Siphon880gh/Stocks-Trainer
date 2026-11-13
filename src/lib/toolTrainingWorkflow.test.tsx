import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ToolsHub from "../pages/ToolsHub.tsx";
import { renderHtml } from "./macro/renderHarness.ts";
import { CB_FILINGS, CB_TTM_COMMON, CB_TTM_TOTAL, CB_JPM } from "./toolTraining/capstoneBank.ts";
import { NOTE_BLANK, TOOL_LESSONS, fillWorkflowNote, getToolLesson, isLiveLinkValid, noteKeys, workflowProblems, workflowProgress } from "./toolTraining/index.ts";

const at = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/tools/:toolId" element={<ToolsHub />} />
    </Routes>
  </MemoryRouter>
);

describe("capstone part 2: guided bank workflow", () => {
  const lesson = getToolLesson("capstone-bank")!;
  it("is registered after part 1 and has a well-formed workflow", () => {
    assert.ok(lesson, "lesson");
    const ids = TOOL_LESSONS.map((t) => t.id);
    assert.ok(ids.indexOf("tool-capstone-bank") > ids.indexOf("tool-capstone"));
    assert.deepEqual(workflowProblems(lesson.workflow!), []);
    for (const st of lesson.workflow!.steps) for (const l of st.live) assert.ok(isLiveLinkValid(l), `${st.id}: ${l.url}`);
  });
  it("fills the note as fields are typed, with blanks until then", () => {
    const w = lesson.workflow!;
    const empty = fillWorkflowNote(w, {});
    assert.ok(empty.some((l) => l.includes(NOTE_BLANK)));
    assert.deepEqual(workflowProgress(w, {}), { filled: 0, total: w.steps.flatMap((s) => s.fields).length });
    const filled = fillWorkflowNote(w, { exposure: "Bank", sa_pe: "14.40" });
    assert.ok(filled[0]!.startsWith("Owning: Bank."));
    assert.ok(filled.some((l) => l.includes("P/E 14.40")));
    assert.equal(workflowProgress(w, { exposure: "Bank", sa_pe: " " }).filled, 1, "whitespace is not a value");
    assert.deepEqual(noteKeys("a {x} b {y_2}"), ["x", "y_2"]);
  });
  it("dated figures add up: TTM from the filings matches the sites' 64.53B", () => {
    assert.equal(CB_TTM_COMMON, 64527);
    assert.equal((CB_TTM_COMMON / 1000).toFixed(2), CB_JPM.sa.netIncome.replace("B", ""));
    assert.equal(CB_TTM_TOTAL - CB_TTM_COMMON, 1452);
    assert.match(CB_FILINGS.q3Filed, /^\d{4}-\d{2}-\d{2}$/);
  });
  it("renders steps, inputs, live links in a new tab and the note", () => {
    const html = renderHtml(at(lesson.route));
    assert.ok(html.includes('data-testid="tool-workflow"'));
    assert.ok(html.includes('data-testid="workflow-note"'));
    for (const st of lesson.workflow!.steps) {
      assert.ok(html.includes(`data-workflow-step="${st.id}"`), st.id);
      for (const f of st.fields) assert.ok(html.includes(`data-workflow-field="${f.key}"`), f.key);
    }
    assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'));
    assert.ok(html.includes("0 of "), "progress line");
  });
  it("lessons without a workflow do not render the panel", () => {
    const html = renderHtml(at("/tools/finviz"));
    assert.ok(!html.includes('data-testid="tool-workflow"'));
  });
});

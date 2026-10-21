import { test } from "node:test";
import assert from "node:assert/strict";
import MacroDeskRound from "../../components/macro/MacroDeskRound";
import { MACRO_ROUNDS, answerKey, explainRound } from "./game";
import { renderHtml, renderText } from "./renderHarness";

const OUTCOME = /Follow-through:|Reversal:|Whipsaw:|Muted \(|faded|calls right|data-phase="reveal"/;

test("pre-answer phases contain no outcome labels, rationale or post-release bars", () => {
  for (const r of MACRO_ROUNDS) {
    for (const phase of ["read", "predict"] as const) {
      const html = renderHtml(<MacroDeskRound round={r} initialPhase={phase} />);
      assert.doesNotMatch(html, OUTCOME, `${r.id} ${phase}`);
      const ex = explainRound(r);
      for (const i of r.instruments) assert.ok(!html.includes(ex.perInstrument[i]!.slice(0, 40)), `${r.id} ${phase} rationale leak`);
      assert.ok(!html.includes("Release day"), `${r.id} daily view leak`);
    }
  }
});

test("reveal shows score, explanation, and one chart per instrument", () => {
  for (const r of MACRO_ROUNDS) {
    const t = renderText(<MacroDeskRound round={r} initialPhase="reveal" initialAnswers={answerKey(r)} />);
    assert.match(t, new RegExp(`${r.instruments.length} / ${r.instruments.length} calls right`), r.id);
    const html = renderHtml(<MacroDeskRound round={r} initialPhase="reveal" initialAnswers={answerKey(r)} />);
    assert.equal((html.match(/reaction chart \(simulated\)/g) ?? []).length, r.instruments.length, r.id);
  }
});

import MacroQuizExhibit from "../../components/macro/MacroQuizExhibit";
import { MACRO_QUESTION_BANKS } from "./quiz/banks";

test("quiz exhibits: predict mode hides the reaction until submit; every exhibit renders", () => {
  for (const q of Object.values(MACRO_QUESTION_BANKS).flat()) {
    const x = q.macroExhibit;
    if (!x) continue;
    const pre = renderHtml(<MacroQuizExhibit exhibit={x} revealed={false} />);
    const post = renderHtml(<MacroQuizExhibit exhibit={x} revealed />);
    assert.ok(pre.length > 200 && post.length > 200, q.id);
    if (x.kind === "release" || (x.kind === "reaction" && x.mode === "predict")) {
      assert.doesNotMatch(pre, /Market read:/, `${q.id} read leaked pre-submit`);
      assert.match(post, /Market read:/, `${q.id} read after submit`);
    }
    if (x.kind === "reaction") {
      assert.doesNotMatch(pre, /Follow-through:|Reversal:|Whipsaw:|Muted \(|faded/, `${q.id} pre leak`);
      assert.match(post, /Follow-through:|Reversal:|Whipsaw:|Muted \(/, `${q.id} post`);
    }
  }
});

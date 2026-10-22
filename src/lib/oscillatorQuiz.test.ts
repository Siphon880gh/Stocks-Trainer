import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getQuestionsForGroup, QUIZ_GROUPS } from "./quizData.ts";
import { OSC_NUMERIC, OSCILLATOR_QUESTIONS, TRADING_RISK_QUESTIONS } from "./oscillatorQuiz.ts";
import { getOscChart, OSC_PANELS } from "./oscillatorLab.ts";
import { getLiteracyTerm, LITERACY_TERMS } from "./literacyTerms.ts";
import { OSCILLATOR_TERMS } from "./oscillatorTerms.ts";
import { OSC_SOURCES } from "./oscillatorSources.ts";

const key = (id: string) => {
  const q = [...OSCILLATOR_QUESTIONS, ...TRADING_RISK_QUESTIONS].find((x) => x.id === id)!;
  return q.options.find((o) => o.id === q.correctAnswer)!.label;
};

describe("oscillators / trading-risk Learn groups", () => {
  it("are registered in Learn with their banks", () => {
    for (const id of ["oscillators", "trading-risk"] as const) assert.ok(QUIZ_GROUPS.some((g) => g.id === id), id);
    assert.equal(getQuestionsForGroup("oscillators"), OSCILLATOR_QUESTIONS);
    assert.equal(getQuestionsForGroup("trading-risk"), TRADING_RISK_QUESTIONS);
    assert.ok(OSCILLATOR_QUESTIONS.length >= 18 && TRADING_RISK_QUESTIONS.length >= 12);
  });
  it("numeric keys recompute independently", () => {
    const expect: Record<string, string> = {
      "OSC-04": (((49 - 40) / (52 - 40)) * 100).toFixed(1),
      "OSC-05": ((60 + 75 + 90) / 3).toFixed(1),
      "OSC-07": ((40 * 2 + 70) / 3).toFixed(1),
      "OSC-08": String(3 * 90 - 2 * 70),
      "OSC-10": String(Math.max(47 - 45, Math.abs(47 - 50), Math.abs(45 - 50))),
      "OSC-11": (80 - 2 * 1.5).toFixed(2),
      "RISK-02": `${12 / 4}×`,
      "RISK-07": "$255.00",
      "RISK-12": `${Math.floor(100 / 2.5)} shares`,
      "RISK-14": `A ${Math.floor(100 / 3)}, B ${Math.floor(100 / 1)}`,
    };
    for (const [id, v] of Object.entries(expect)) {
      assert.equal(OSC_NUMERIC[id], v, id);
      assert.equal(key(id), v, id);
    }
    assert.match(key("RISK-10"), /^\+400%/);
  });
  it("chart exhibits resolve to a lab chart and panel; marks stay inside it", () => {
    const withEx = OSCILLATOR_QUESTIONS.filter((q) => q.oscillatorExhibit);
    assert.ok(withEx.length >= 8);
    for (const q of withEx) {
      const ex = q.oscillatorExhibit!;
      const c = getOscChart(ex.chartId);
      assert.ok(c, q.id);
      assert.ok(OSC_PANELS[ex.chartId].some((p) => p.id === ex.panel), q.id);
      if (ex.mark != null) assert.ok(ex.mark >= 0 && ex.mark < c!.bars.length, q.id);
      assert.match(q.prompt, /SIMULATED/);
    }
  });
  it("glossary terms are merged, unique and referenced by the questions", () => {
    const ids = LITERACY_TERMS.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const t of OSCILLATOR_TERMS) assert.ok(getLiteracyTerm(t.id), t.id);
    const used = new Set([...OSCILLATOR_QUESTIONS, ...TRADING_RISK_QUESTIONS].map((q) => q.glossaryTermId).filter(Boolean));
    for (const id of ["fast-stochastic", "slow-stochastic", "kdj", "average-true-range", "volatility-stop", "public-float", "float-turnover", "theta-decay", "short-dated-option", "momentum-oscillator", "indicator-not-signal"])
      assert.ok(used.has(id), id);
    assert.match(getLiteracyTerm("trailing-stop")!.detail, /volatility stop/);
  });
  it("sources are unique https URLs", () => {
    assert.equal(new Set(OSC_SOURCES.map((s) => s.url)).size, OSC_SOURCES.length);
    for (const s of OSC_SOURCES) assert.match(s.url, /^https:\/\//);
  });
});

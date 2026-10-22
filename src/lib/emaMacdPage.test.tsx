import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import PracticeEmaMacd from "../pages/practice/EmaMacd";
import { LAB_CHARTS, LAB_LABEL, labQuestions, shortWindowFacts, type LabChartId } from "./emaMacdLab";

const html = (p: Parameters<typeof PracticeEmaMacd>[0] = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <PracticeEmaMacd {...p} />
    </MemoryRouter>,
  );

test("EMA/MACD page: SIMULATED label, short-window lesson from computed facts, link to the unchanged Trend vs range practice", () => {
  const out = html();
  const f = shortWindowFacts();
  assert.ok(out.includes(LAB_LABEL));
  assert.ok(out.includes('data-testid="short-window-lesson"'));
  assert.ok(out.includes(f.maxGap.toFixed(2)));
  assert.ok(out.includes(`needs ${f.macdFirstBar} bars`));
  assert.ok(out.includes('href="/practice/regime"'));
  for (const c of LAB_CHARTS) assert.ok(out.includes(`data-testid="lab-tab-${c.id}"`), c.id);
});

test("EMA/MACD page: each chart draws SMA, EMA, MACD and signal and shows only its own questions", () => {
  const qs = labQuestions();
  for (const c of LAB_CHARTS) {
    const out = html({ initialChart: c.id as LabChartId });
    assert.ok(out.includes(`data-chart="${c.id}"`));
    for (const l of ["sma", "ema", "macd", "signal"]) assert.ok(out.includes(`data-line="${l}"`), `${c.id} ${l}`);
    for (const q of qs) {
      const shown = out.includes(`data-question="${q.id}"`);
      assert.equal(shown, q.chartId === c.id || q.chartId === "short-window", `${c.id} ${q.id}`);
    }
  }
});

test("EMA/MACD page: answered questions show feedback and the score counts right answers", () => {
  const qs = labQuestions();
  const answers: Record<string, string> = {};
  for (const q of qs) answers[q.id] = q.correct;
  const wrong = qs[0]!;
  answers[wrong.id] = wrong.options.find((o) => o.id !== wrong.correct)!.id;
  const out = html({ initialAnswers: answers });
  assert.ok(out.includes(`${qs.length - 1} / ${qs.length} answered right`));
  assert.ok(out.includes("Not quite."));
  assert.ok(out.includes(wrong.explanation.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").slice(0, 30)));
});

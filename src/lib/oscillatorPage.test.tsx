import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import PracticeOscillators from "../pages/practice/Oscillators";
import OptionsLadderPage from "../pages/academy/OptionsLadder";
import { OSC_CHARTS, OSC_LABEL, OSC_PANELS, oscQuestions, type OscChartId } from "./oscillatorLab";
import { OSC_SOURCES } from "./oscillatorSources";

const html = (p: Parameters<typeof PracticeOscillators>[0] = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <PracticeOscillators {...p} />
    </MemoryRouter>,
  );

test("Oscillators page: SIMULATED label, lesson, links to the MACD lab, glossary and both Learn groups, every source", () => {
  const out = html();
  assert.ok(out.includes(OSC_LABEL));
  assert.ok(out.includes('data-testid="oscillator-lesson"'));
  for (const href of ["/practice/ema-macd", "/archive?tab=literacy&amp;open=kdj", "/archive?tab=literacy&amp;open=trailing-stop", "/training?group=oscillators&amp;start=1", "/training?group=trading-risk&amp;start=1"])
    assert.ok(out.includes(`href="${href}"`), href);
  for (const s of OSC_SOURCES) assert.ok(out.includes(s.url.replace(/&/g, "&amp;")), s.id);
  assert.ok(out.includes("not buy or sell signals"));
});

test("Oscillators page: each chart shows its default panel and only its own questions", () => {
  const qs = oscQuestions();
  for (const c of OSC_CHARTS) {
    const out = html({ initialChart: c.id as OscChartId });
    assert.ok(out.includes(`data-chart="${c.id}"`));
    assert.ok(out.includes(`data-panel="${OSC_PANELS[c.id][0]!.id}"`));
    if (OSC_PANELS[c.id][0]!.id === "vstop") assert.ok(out.includes('data-line="vstop"'));
    for (const q of qs) assert.equal(out.includes(`data-question="${q.id}"`), q.chartId === c.id, `${c.id} ${q.id}`);
  }
});

test("Oscillators page: score counts right answers and shows feedback", () => {
  const qs = oscQuestions();
  const answers: Record<string, string> = {};
  for (const q of qs) answers[q.id] = q.correct;
  const w = qs[0]!;
  answers[w.id] = w.options.find((o) => o.id !== w.correct)!.id;
  const out = html({ initialAnswers: answers });
  assert.ok(out.includes(`${qs.length - 1} / ${qs.length} answered right`));
  assert.ok(out.includes("Not quite."));
});

test("Options ladder page: short-dated risk section with Learn, glossary and source links", () => {
  const out = renderToStaticMarkup(
    <MemoryRouter>
      <OptionsLadderPage />
    </MemoryRouter>,
  );
  assert.ok(out.includes('data-testid="short-dated-risk"'));
  assert.ok(out.includes("Holding an option briefly is not the same as buying a short-dated contract"));
  assert.ok(out.includes('href="/training?group=trading-risk&amp;start=1"'));
  assert.ok(out.includes("finra.org/investors/insights/zeroing-in-options-trading-strategy"));
});

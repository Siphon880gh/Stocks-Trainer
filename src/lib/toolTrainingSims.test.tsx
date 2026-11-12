import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ToolsHub from "../pages/ToolsHub.tsx";
import { SimPanel } from "../components/tools/Simulation.tsx";
import { renderHtml, renderText } from "./macro/renderHarness.ts";
import {
  MIN_SIM_STEPS,
  TOOL_LESSONS,
  atEnd,
  atStart,
  candleLayout,
  currentStepCopy,
  getToolLesson,
  lessonSimRefs,
  nextStep,
  prevStep,
  replayWalk,
  showStep,
  simStepCount,
  simulationProblems,
  startWalk,
  toolTextPlain,
  visibleColumns,
  walkProgress,
  type BarWalkSim,
  type ToolSimulation,
} from "./toolTraining/index.ts";

const at = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/tools/:toolId" element={<ToolsHub />} />
    </Routes>
  </MemoryRouter>
);
const SA = getToolLesson("stockanalysis")!;
const allSims = TOOL_LESSONS.flatMap((t) => t.simulations ?? []);

describe("simulation walk logic", () => {
  const sim = SA.simulations!.find((s): s is BarWalkSim => s.id === "sa-sim-52-week" && s.kind === "bars")!;
  it("starts with a few bars, steps forward and back within bounds, and replays", () => {
    let w = startWalk(sim);
    assert.equal(w.shown, sim.start);
    assert.equal(w.total, sim.bars.length);
    assert.ok(!atStart(w) && !atEnd(w));
    w = nextStep(w);
    assert.equal(w.shown, sim.start + 1);
    for (let i = 0; i < 50; i++) w = nextStep(w);
    assert.equal(w.shown, w.total);
    assert.ok(atEnd(w));
    assert.equal(nextStep(w), w, "Next at the last bar is a no-op");
    for (let i = 0; i < 50; i++) w = prevStep(w);
    assert.equal(w.shown, 1);
    assert.ok(atStart(w));
    assert.equal(prevStep(w), w, "Previous at the first bar is a no-op");
    assert.deepEqual(replayWalk(sim), startWalk(sim));
    assert.equal(showStep(w, 999).shown, w.total);
    assert.equal(showStep(w, -3).shown, 1);
  });
  it("labels progress and returns the current bar's what and why", () => {
    const w = startWalk(sim);
    assert.equal(walkProgress(sim, w), `Bar ${sim.start} of ${sim.bars.length}`);
    const c = currentStepCopy(sim, w);
    assert.equal(c.what, sim.bars[sim.start - 1]!.what);
    assert.equal(c.why, sim.bars[sim.start - 1]!.why);
  });
  it("clamps a bad start and lays candles out in fixed slots", () => {
    const bad: ToolSimulation = { ...sim, start: 99 };
    assert.equal(startWalk(bad).shown, sim.bars.length);
    const { boxes, y } = candleLayout(sim.bars, 300, 100);
    assert.equal(boxes.length, sim.bars.length);
    for (let i = 1; i < boxes.length; i++) assert.ok(boxes[i]!.x > boxes[i - 1]!.x);
    const hi = Math.max(...sim.bars.map((b) => b.high));
    const lo = Math.min(...sim.bars.map((b) => b.low));
    assert.ok(y(hi) < y(lo), "higher prices draw higher up");
    for (const b of boxes) assert.ok(b.yHigh <= Math.min(b.yOpen, b.yClose) && b.yLow >= Math.max(b.yOpen, b.yClose));
  });
  it("column walks reveal columns as steps reach them", () => {
    const cols = SA.simulations!.find((s) => s.kind === "columns")!;
    assert.equal(cols.kind, "columns");
    if (cols.kind !== "columns") return;
    let w = startWalk(cols);
    assert.deepEqual(visibleColumns(cols, w).visible, [0, 1]);
    while (!atEnd(w)) w = nextStep(w);
    assert.deepEqual(visibleColumns(cols, w).visible, cols.columns.map((_, i) => i));
    assert.equal(walkProgress(cols, w), `Step ${cols.steps.length} of ${cols.steps.length}`);
  });
});

describe("tool training simulations data", () => {
  it("every lesson's simulations are well-formed and every trigger resolves", () => {
    for (const t of TOOL_LESSONS) assert.deepEqual(simulationProblems(t), [], t.id);
    const ids = allSims.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, "simulation ids are unique across lessons");
  });
  it("StockAnalysis has at least 4 simulations, each with 5+ steps, why-copy and a SAMPLE / simulated label", () => {
    const sims = SA.simulations ?? [];
    assert.ok(sims.length >= 4, String(sims.length));
    assert.ok(sims.filter((s) => s.kind === "bars").length >= 3);
    for (const s of sims) {
      assert.ok(simStepCount(s) >= MIN_SIM_STEPS, s.id);
      assert.match(s.tape, /SAMPLE|simulated/i, s.id);
      for (const st of s.kind === "bars" ? s.bars : s.steps) assert.ok(st.why.length >= 30, `${s.id}: ${st.what}`);
    }
    for (const id of ["sa-sim-52-week", "sa-sim-earnings-week", "sa-sim-one-time"]) assert.ok(sims.some((s) => s.id === id), id);
  });
  it("bar readouts match the step copy where the copy quotes them", () => {
    const pe = SA.simulations!.find((s) => s.id === "sa-sim-pe-moves")!;
    if (pe.kind !== "bars") throw new Error("bars");
    for (const b of pe.bars) {
      const v = b.readout!.match(/P\/E (\d+\.\d)/)![1]!;
      assert.ok(b.what.includes(`P/E ${v}`), `${b.label}: ${b.readout} vs ${b.what}`);
    }
  });
  it("at least one other lesson has a why-focused simulation", () => {
    assert.ok(TOOL_LESSONS.filter((t) => t.id !== "tool-stockanalysis" && (t.simulations?.length ?? 0) > 0).length >= 1);
  });
});

describe("simulation popover on the page", () => {
  it("/tools/stockanalysis shows underlined triggers wired as dialog openers, and a simulations list", () => {
    const html = renderHtml(at("/tools/stockanalysis"));
    for (const r of lessonSimRefs(SA)) assert.ok(html.includes(`data-sim-trigger="${r.sim}"`), r.sim);
    assert.match(html, /aria-haspopup="dialog"/);
    assert.match(html, /aria-expanded="false"/);
    assert.match(html, /data-testid="tool-simulations"/);
    assert.doesNotMatch(html, /role="dialog"/, "closed by default");
    for (const s of SA.simulations!) assert.ok(renderText(at("/tools/stockanalysis")).includes(s.title), s.title);
  });
  it("?sim= opens the popover with goal, chart, step copy and controls", () => {
    const sim = SA.simulations!.find((s) => s.id === "sa-sim-earnings-week")!;
    const html = renderHtml(at(`/tools/stockanalysis?sim=${sim.id}`));
    assert.match(html, /role="dialog"/);
    assert.match(html, /aria-modal="true"/);
    assert.match(html, new RegExp(`data-sim-trigger="${sim.id}"[^>]*aria-expanded="true"|aria-expanded="true"[^>]*data-sim-trigger="${sim.id}"`));
    const text = renderText(at(`/tools/stockanalysis?sim=${sim.id}`));
    for (const want of [sim.goal, "Why we are doing this", "Next bar", "Previous bar", "Replay", "Close simulation".slice(0, 5), walkProgress(sim, startWalk(sim))]) assert.ok(text.includes(want), want);
    assert.ok(text.includes(currentStepCopy(sim, startWalk(sim)).why));
    assert.equal((html.match(/data-bar="/g) ?? []).length, sim.start, "only the first bars are drawn");
    assert.match(html, /data-current-bar=/);
  });
  it("the panel renders later steps, the takeaway at the end, and disables Next there", () => {
    for (const sim of allSims) {
      let w = startWalk(sim);
      while (!atEnd(w)) w = nextStep(w);
      const html = renderHtml(<SimPanel sim={sim} walk={w} />);
      const text = renderText(<SimPanel sim={sim} walk={w} />);
      assert.ok(text.includes(sim.takeaway), sim.id);
      assert.ok(text.includes(currentStepCopy(sim, w).why), sim.id);
      assert.match(html, /disabled=""[^>]*data-sim-next|data-sim-next[^>]*disabled=""/, `${sim.id} Next disabled at end`);
      if (sim.kind === "bars") assert.equal((html.match(/data-bar="/g) ?? []).length, sim.bars.length);
    }
  });
  it("an unknown ?sim= id leaves the page closed", () => {
    assert.doesNotMatch(renderHtml(at("/tools/stockanalysis?sim=nope")), /role="dialog"/);
  });
  it("lessons with simulations show their triggers' words in the copy", () => {
    for (const t of TOOL_LESSONS) {
      const text = renderText(at(t.route)).replace(/[\s▶]/g, "");
      for (const r of lessonSimRefs(t)) assert.ok(text.includes(r.text.replace(/\s/g, "")), r.text);
      for (const p of t.intro) assert.ok(text.includes(toolTextPlain(p).replace(/\s/g, "")));
    }
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MarketThemePage from "../components/practice/MarketThemePage.tsx";
import MacroLesson from "../pages/macro/MacroLesson.tsx";
import UnitPlayer from "../components/academy/UnitPlayer.tsx";
import PracticeVixTrading from "../pages/practice/VixTrading.tsx";
import { SimPanel } from "../components/tools/Simulation.tsx";
import { renderHtml, renderText } from "./macro/renderHarness.ts";
import { CONTENT_SIM_SETS, CONTENT_SIMS, contentSimProblems } from "./contentSims.ts";
import { MARKET_THEMES, themeSimRefs, type MarketThemeQuizGroupId } from "./marketThemes/index.ts";
import { getUnit } from "./academy/content/levels.ts";
import { TOOL_LESSONS, atEnd, currentStepCopy, nextStep, startWalk, toolTextRefs, walkProgress } from "./toolTraining/index.ts";

const flat = (s: string) => s.replace(/[\s▶]/g, "");
const theme = (route: string, id: MarketThemeQuizGroupId) => (
  <MemoryRouter initialEntries={[route]}>
    <MarketThemePage id={id} />
  </MemoryRouter>
);
const macro = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/macro/:lessonId" element={<MacroLesson />} />
    </Routes>
  </MemoryRouter>
);
const vix = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <PracticeVixTrading />
  </MemoryRouter>
);

describe("simulations across the app (beyond Tool Training)", () => {
  it("every set is well-formed, every trigger resolves and rich copy reads exactly like the plain copy", () => {
    assert.deepEqual(contentSimProblems(), []);
  });
  it("simulation ids are unique across Tool Training and the rest of the app", () => {
    const ids = [...TOOL_LESSONS.flatMap((t) => t.simulations ?? []), ...CONTENT_SIMS].map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length);
  });
  it("covers every market theme, several macro lessons, Academy units and the VIX page", () => {
    const by = (a: string) => CONTENT_SIM_SETS.filter((s) => s.area === a).length;
    assert.equal(by("market-theme"), MARKET_THEMES.length, "every market theme");
    assert.ok(by("macro") >= 5, "macro lessons");
    assert.ok(by("academy") >= 3, "Academy units");
    assert.equal(by("practice"), 1, "VIX page");
    for (const s of CONTENT_SIMS) assert.match(s.tape, /SAMPLE|simulated/i, s.id);
  });
  it("the panel renders the last step, the takeaway and a disabled Next for every walk", () => {
    for (const sim of CONTENT_SIMS) {
      let w = startWalk(sim);
      while (!atEnd(w)) w = nextStep(w);
      const html = renderHtml(<SimPanel sim={sim} walk={w} />);
      const text = renderText(<SimPanel sim={sim} walk={w} />);
      assert.ok(text.includes(sim.takeaway), sim.id);
      assert.ok(text.includes(currentStepCopy(sim, w).why), sim.id);
      assert.match(html, /disabled=""[^>]*data-sim-next|data-sim-next[^>]*disabled=""/, sim.id);
      if (sim.kind === "bars") assert.equal((html.match(/data-bar="/g) ?? []).length, sim.bars.length, sim.id);
    }
  });
});

describe("market theme pages open simulations", () => {
  for (const t of MARKET_THEMES) {
    it(`${t.route}: triggers in the cards, legend shown, closed by default, ?sim= opens each walk`, () => {
      const html = renderHtml(theme(t.route, t.id));
      for (const r of themeSimRefs(t)) assert.ok(html.includes(`data-sim-trigger="${r.sim}"`), r.sim);
      assert.match(html, /data-testid="sim-hint"/);
      assert.doesNotMatch(html, /role="dialog"/);
      const text = flat(renderText(theme(t.route, t.id)));
      for (const c of [...t.drivers, ...t.bridges]) assert.ok(text.includes(flat(c.text)), c.title);
      for (const s of t.simulations ?? []) {
        const open = renderHtml(theme(`${t.route}?sim=${s.id}`, t.id));
        assert.match(open, new RegExp(`role="dialog"[^>]*data-sim="${s.id}"|data-sim="${s.id}"[^>]*role="dialog"|id="sim-${s.id}"`), s.id);
        assert.ok(renderText(theme(`${t.route}?sim=${s.id}`, t.id)).includes(s.goal), s.id);
      }
    });
  }
});

describe("macro lessons open simulations from the reaction paragraph", () => {
  for (const set of CONTENT_SIM_SETS.filter((s) => s.area === "macro")) {
    it(`${set.route}`, () => {
      const html = renderHtml(macro(set.route));
      for (const r of set.refs) assert.ok(html.includes(`data-sim-trigger="${r.sim}"`), r.sim);
      assert.match(html, /data-testid="macro-reaction"/);
      assert.match(html, /data-testid="sim-hint"/);
      assert.doesNotMatch(html, /role="dialog"/);
      const s = set.sims[0]!;
      const text = renderText(macro(`${set.route}?sim=${s.id}`));
      assert.ok(text.includes(s.goal) && text.includes(walkProgress(s, startWalk(s))), s.id);
    });
  }
  it("a lesson without simulations shows no legend", () => {
    assert.doesNotMatch(renderHtml(macro("/macro/jolts")), /data-testid="sim-hint"|data-sim-trigger/);
  });
});

describe("Academy units open simulations from a card", () => {
  for (const set of CONTENT_SIM_SETS.filter((s) => s.area === "academy")) {
    it(`${set.route}`, () => {
      const u = getUnit(set.owner)!;
      // The first card whose lead carries a simulation trigger (a lead may also mark only glossary terms).
      const idx = u.cards.findIndex((c) => c.leadRich && toolTextRefs(c.leadRich).length);
      const card = u.cards[idx]!;
      const ui = (
        <MemoryRouter>
          <UnitPlayer unit={u} initialCard={idx} />
        </MemoryRouter>
      );
      const html = renderHtml(ui);
      for (const r of toolTextRefs(card.leadRich!)) assert.ok(html.includes(`data-sim-trigger="${r.sim}"`), r.sim);
      assert.match(html, /data-testid="sim-hint"/);
      assert.ok(flat(renderText(ui)).includes(flat(card.body)), "the whole card body still reads the same");
      const first = renderHtml(
        <MemoryRouter>
          <UnitPlayer unit={u} />
        </MemoryRouter>,
      );
      if (idx > 0) assert.doesNotMatch(first, /data-sim-trigger/, "other cards carry no trigger");
      const s = set.sims[0]!;
      const open = (
        <MemoryRouter>
          <UnitPlayer unit={u} initialSim={s.id} />
        </MemoryRouter>
      );
      assert.match(renderHtml(open), /role="dialog"/);
      assert.ok(renderHtml(open).includes(`data-sim-trigger="${s.id}"`), "deep link opens on the card with the trigger");
    });
  }
});

describe("/practice/vix-trading opens the short-volatility walk", () => {
  it("trigger in the shorting panel, closed by default, ?sim= opens it, existing copy intact", () => {
    const set = CONTENT_SIM_SETS.find((s) => s.owner === "vix-trading")!;
    const html = renderHtml(vix("/practice/vix-trading"));
    assert.ok(html.includes(`data-sim-trigger="${set.sims[0]!.id}"`));
    assert.doesNotMatch(html, /role="dialog"/);
    assert.ok(flat(renderText(vix("/practice/vix-trading"))).includes(flat("no guarantee the account survives until it does. 19 trades")));
    const text = renderText(vix(`/practice/vix-trading?sim=${set.sims[0]!.id}`));
    assert.ok(text.includes(set.sims[0]!.goal));
  });
});

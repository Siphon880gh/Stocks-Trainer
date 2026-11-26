import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import UnitPlayer from "../../components/academy/UnitPlayer.tsx";
import { renderHtml } from "../macro/renderHarness.ts";
import { LEVELS, getUnit } from "./content/levels.ts";
import { quizForUnit } from "./content/unitQuizzes.ts";
import { DASHBOARD_NUMBERS_UNITS } from "./content/dashboardNumbers.ts";
import { resolveRef } from "./refs.ts";
import { getLiteracyTerm } from "../literacyTerms.ts";
import { CONTENT_SIM_SETS, CONTENT_SIMS } from "../contentSims.ts";
import { simSetProblems } from "../toolTraining/simWalk.ts";
import { TOOL_LESSONS, toolTextRefs, toolTextTerms } from "../toolTraining/index.ts";

/** Which walks each page can open with `?sim=`. */
const PAGE_SIMS = new Map<string, Set<string>>([
  ...CONTENT_SIM_SETS.map((s) => [s.route, new Set(s.sims.map((x) => x.id))] as [string, Set<string>]),
  ...TOOL_LESSONS.map((t) => [t.route, new Set((t.simulations ?? []).map((x) => x.id))] as [string, Set<string>]),
]);

describe("Dashboard numbers: gap days, grading trades, positioning", () => {
  it("each unit opens its own course beside the lessons it extends", () => {
    const where = [
      ["L2", "gap-days", "l2-gap-day-numbers"],
      ["L3", "review-results", "l3-grade-your-trades"],
      ["L4", "positioning", "l4-positioning-signals"],
    ] as const;
    for (const [level, course, unit] of where) {
      const c = LEVELS.find((l) => l.id === level)!.courses.find((x) => x.id === course);
      assert.ok(c, `${level} ${course}`);
      assert.deepEqual(c!.unitIds, [unit]);
      assert.equal(getUnit(unit)!.levelId, level);
    }
    assert.deepEqual(DASHBOARD_NUMBERS_UNITS.map((u) => u.id), where.map((w) => w[2]));
  });

  it("covers the Learn-glossary gaps by name: profit factor, pre-market, spike and fade, short volume, put/call, EOD data", () => {
    for (const id of ["profit-factor", "equity-curve", "trade-journal", "premarket-session", "spike-and-fade", "short-volume-ratio", "put-call-ratio", "end-of-day-data"]) {
      const t = getLiteracyTerm(id);
      assert.ok(t, id);
      assert.match(t!.detail, /Educational, not advice\./, id);
      assert.ok(DASHBOARD_NUMBERS_UNITS.some((u) => u.cards.some((c) => c.glossaryTermId === id || (c.leadRich ? toolTextTerms(c.leadRich) : []).some((x) => x.term === id))), `${id} is used in a card`);
    }
  });

  it("each unit has a quiz, resolving refs, glossary chips and hover terms, and its own valid walks", () => {
    const otherSims = new Set(CONTENT_SIMS.filter((s) => !DASHBOARD_NUMBERS_UNITS.some((u) => u.simulations?.includes(s))).map((s) => s.id));
    for (const u of DASHBOARD_NUMBERS_UNITS) {
      assert.ok(quizForUnit(u.id).length >= 4, u.id);
      for (const r of u.refs) assert.ok(resolveRef(r).ok, `${u.id}: ${r}`);
      const refs = u.cards.flatMap((c) => (c.leadRich ? toolTextRefs(c.leadRich) : []));
      assert.deepEqual(simSetProblems(u.id, refs, u.simulations ?? []), []);
      for (const c of u.cards) {
        if (c.glossaryTermId) assert.ok(getLiteracyTerm(c.glossaryTermId), `${u.id}: chip ${c.glossaryTermId}`);
        for (const t of c.leadRich ? toolTextTerms(c.leadRich) : []) assert.ok(getLiteracyTerm(t.term), `${u.id}: term ${t.term}`);
      }
      for (const s of u.simulations ?? []) {
        assert.ok(!otherSims.has(s.id), `${s.id} reuses an id from another page`);
        assert.match(s.tape, /SAMPLE/, s.id);
      }
      for (const r of u.refs) {
        const m = /^([^?#]+)\?(?:.*&)?sim=([^&#]+)/.exec(resolveRef(r).href);
        if (m) assert.ok(PAGE_SIMS.get(m[1]!)?.has(m[2]!), `${u.id}: ${m[1]} has no walk ${m[2]}`);
      }
    }
  });

  it("the walk arithmetic matches its own table", () => {
    const records = DASHBOARD_NUMBERS_UNITS.flatMap((u) => u.simulations ?? []).find((s) => s.id === "ac-two-records")!;
    assert.equal(records.kind, "columns");
    const exp = (w: number, aw: number, al: number) => Math.round((w * aw - (1 - w) * al) * 100) / 100;
    assert.equal(exp(0.7, 0.5, 1.5), -0.1);
    assert.equal(exp(0.4, 2, 1), 0.2);
    assert.equal((8 / 6).toFixed(2), "1.33");
    assert.equal((3.5 / 4.5).toFixed(2), "0.78");
    const climb = (d: number) => (1 / (1 - d) - 1) * 100;
    assert.equal(climb(0.5), 100);
    assert.equal(climb(0.75), 300);
    assert.equal(climb(0.3).toFixed(1), "42.9");
  });

  for (const u of DASHBOARD_NUMBERS_UNITS) {
    it(`/academy/${u.id}: every card renders its triggers and hover terms`, () => {
      u.cards.forEach((c, i) => {
        const html = renderHtml(
          <MemoryRouter>
            <UnitPlayer unit={u} initialCard={i} />
          </MemoryRouter>,
        );
        assert.ok(html.includes(c.title.replace(/&/g, "&amp;")), c.title);
        for (const r of c.leadRich ? toolTextRefs(c.leadRich) : []) assert.ok(html.includes(`data-sim-trigger="${r.sim}"`), `${c.title}: ${r.sim}`);
        for (const t of c.leadRich ? toolTextTerms(c.leadRich) : []) assert.ok(html.includes(`data-glossary-term="${t.term}"`), `${c.title}: ${t.term}`);
      });
    });
  }
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import UnitPlayer from "../../components/academy/UnitPlayer.tsx";
import { renderHtml } from "../macro/renderHarness.ts";
import { LEVELS, UNITS, getUnit } from "./content/levels.ts";
import { quizForUnit } from "./content/unitQuizzes.ts";
import { BEFORE_YOU_TRADE_UNITS } from "./content/beforeYouTrade.ts";
import { resolveRef } from "./refs.ts";
import { getLiteracyTerm } from "../literacyTerms.ts";
import { CONTENT_SIM_SETS, CONTENT_SIMS } from "../contentSims.ts";
import { TOOL_LESSONS, toolTextRefs, toolTextTerms } from "../toolTraining/index.ts";

/** Which walks each page can open with `?sim=`: market themes, macro, Academy, VIX, and Tool Training lessons. */
const PAGE_SIMS = new Map<string, Set<string>>([
  ...CONTENT_SIM_SETS.map((s) => [s.route, new Set(s.sims.map((x) => x.id))] as [string, Set<string>]),
  ...TOOL_LESSONS.map((t) => [t.route, new Set((t.simulations ?? []).map((x) => x.id))] as [string, Set<string>]),
]);

describe("L7 · Before you trade", () => {
  const course = LEVELS.find((l) => l.id === "L7")!.courses.find((c) => c.id === "before-you-trade");

  it("is an L7 course: what you would own, then the six-step checklist", () => {
    assert.ok(course, "course exists");
    assert.deepEqual(course!.unitIds, BEFORE_YOU_TRADE_UNITS.map((u) => u.id));
    assert.deepEqual(course!.unitIds, ["l7-what-you-own", "l7-before-you-trade"]);
  });

  it("the checklist presents its six steps as one numbered sequence", () => {
    const u = getUnit("l7-before-you-trade")!;
    assert.equal(u.cards.length, 6);
    u.cards.forEach((c, i) => assert.ok(c.title.startsWith(`${i + 1}. `), c.title));
  });

  it("each unit has a quiz, resolving refs, glossary chips and hover terms, and its own walks", () => {
    const otherSims = new Set(CONTENT_SIMS.filter((s) => !BEFORE_YOU_TRADE_UNITS.some((u) => u.simulations?.includes(s))).map((s) => s.id));
    for (const u of BEFORE_YOU_TRADE_UNITS) {
      assert.ok(quizForUnit(u.id).length >= 3, u.id);
      for (const r of u.refs) assert.ok(resolveRef(r).ok, `${u.id}: ${r}`);
      for (const c of u.cards) {
        if (c.glossaryTermId) assert.ok(getLiteracyTerm(c.glossaryTermId), `${u.id}: chip ${c.glossaryTermId}`);
        for (const t of c.leadRich ? toolTextTerms(c.leadRich) : []) assert.ok(getLiteracyTerm(t.term), `${u.id}: term ${t.term}`);
      }
      for (const s of u.simulations ?? []) assert.ok(!otherSims.has(s.id), `${s.id} reuses an id from another page`);
    }
  });

  it("every Academy link that deep-opens a walk (?sim=) names a walk that page really has", () => {
    let checked = 0;
    for (const u of UNITS) {
      for (const r of u.refs) {
        const href = resolveRef(r).href;
        const m = /^([^?#]+)\?(?:.*&)?sim=([^&#]+)/.exec(href);
        if (!m) continue;
        checked += 1;
        const sims = PAGE_SIMS.get(m[1]!);
        assert.ok(sims, `${u.id}: ${m[1]} has no simulations`);
        assert.ok(sims!.has(m[2]!), `${u.id}: ${m[1]} has no walk ${m[2]}`);
      }
    }
    assert.ok(checked >= 5);
  });

  for (const u of BEFORE_YOU_TRADE_UNITS) {
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

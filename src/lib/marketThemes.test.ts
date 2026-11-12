import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MARKET_THEMES, MARKET_THEME_CASES, MARKET_THEME_TERMS, getMarketTheme, marketThemeQuestions } from "./marketThemes/index.ts";
import { annualizeMonthlyPct, marginChangePct, rollCostPct, WRAP_MARGIN, WRAP_ROLL } from "./marketThemes/structure.ts";
import { foreignCurrencyReturnPct, FX_EX_RETURN, USDX_WEIGHTS } from "./marketThemes/currencyFunds.ts";
import { seededTape } from "./marketThemes/helpers.ts";
import { APP_ROUTES, routeExists } from "./academy/refs.ts";
import { listSessions } from "./coaching/index.ts";
import { MISC_PRACTICE_ITEMS } from "./miscPractices.ts";
import { QUIZ_GROUPS, getQuestionsForGroup } from "./quizData.ts";

describe("market theme math", () => {
  it("roll cost, annualizing, operating leverage and currency returns", () => {
    assert.equal(rollCostPct(70, 70.7), 1);
    assert.equal(rollCostPct(70, 69.3), -1);
    assert.equal(annualizeMonthlyPct(1), 12.68);
    assert.equal(marginChangePct(2000, 1400, 10), 33.33);
    assert.equal(marginChangePct(2000, 1400, -10), -33.33);
    assert.equal(WRAP_ROLL, 1);
    assert.equal(WRAP_MARGIN, 33.33);
    assert.equal(foreignCurrencyReturnPct(1.1, 1.1, 2, 0.4), 1.6);
    assert.equal(FX_EX_RETURN, -1.46);
    assert.equal(Math.round(USDX_WEIGHTS.reduce((s, w) => s + w.weight, 0) * 10) / 10, 100);
  });
  it("seeded tapes are deterministic and differ by seed", () => {
    const a = seededTape({ seed: 1, start: 100, preDrift: 0, postDrift: 0, vol: 1 });
    const b = seededTape({ seed: 1, start: 100, preDrift: 0, postDrift: 0, vol: 1 });
    const c = seededTape({ seed: 2, start: 100, preDrift: 0, postDrift: 0, vol: 1 });
    assert.deepEqual(a, b);
    assert.notDeepEqual(a.full.map((x) => x.close), c.full.map((x) => x.close));
    assert.ok(a.full.length > a.pre.length);
  });
});

describe("market theme registry", () => {
  const sessions = new Set(listSessions().map((s) => s.slug));
  const ids = MARKET_THEMES.map((t) => t.id);
  it("ids are unique and each theme is a Learn group, a practice lab and a route", () => {
    assert.equal(new Set(ids).size, ids.length);
    for (const t of MARKET_THEMES) {
      assert.equal(t.route, `/practice/${t.id}`);
      assert.ok(APP_ROUTES.includes(t.route), t.route);
      assert.ok(QUIZ_GROUPS.some((g) => g.id === t.id), `quiz group ${t.id}`);
      assert.ok(MISC_PRACTICE_ITEMS.some((m) => m.id === t.id && m.to === t.route), `lab ${t.id}`);
      assert.equal(getMarketTheme(t.id), t);
      assert.deepEqual(getQuestionsForGroup(t.id), marketThemeQuestions(t.id));
    }
  });
  it("quizzes have 12 to 20 well-formed questions with unique ids", () => {
    const qids = MARKET_THEMES.flatMap((t) => t.questions.map((q) => q.id));
    assert.equal(new Set(qids).size, qids.length);
    for (const t of MARKET_THEMES) {
      assert.ok(t.questions.length >= 12 && t.questions.length <= 20, `${t.id}: ${t.questions.length}`);
      for (const q of t.questions) {
        assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
        assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, q.id);
        assert.ok(q.explanation.length > 20, q.id);
      }
    }
  });
  it("cite real sources with dates, and every link resolves", () => {
    for (const t of MARKET_THEMES) {
      assert.match(t.asOf, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(t.sources.length >= 3, t.id);
      for (const s of t.sources) {
        assert.match(s.url, /^https:\/\//, s.url);
        assert.ok(s.label && s.supports, s.url);
      }
      assert.equal(new Set(t.sources.map((s) => s.url)).size, t.sources.length, `${t.id} duplicate source`);
      for (const l of t.links) {
        const path = l.to.split("?")[0]!;
        if (path.startsWith("/coach/")) assert.ok(sessions.has(path.slice(7)), l.to);
        else assert.ok(routeExists(path), l.to);
      }
    }
  });
  it("drills, calculators, wrappers and modes are well-formed", () => {
    for (const t of MARKET_THEMES) {
      assert.ok(t.wrappers.length >= 2 && t.drivers.length >= 2 && t.caveats.length >= 2, t.id);
      assert.ok(t.drills.length >= 3, t.id);
      for (const d of t.drills) assert.ok(d.answer >= 0 && d.answer < d.options.length, d.id);
      if (t.calculator) {
        const v = Object.fromEntries(t.calculator.inputs.map((i) => [i.id, i.value]));
        const out = t.calculator.compute(v);
        assert.ok(out.length >= 1, t.id);
        for (const o of out) assert.doesNotMatch(o.value, /NaN|Infinity/, `${t.id} ${o.label}`);
      }
      assert.ok(t.modeLabel && t.modeTip, t.id);
    }
  });
  it("cases and terms are unique and each theme has its own cases", () => {
    const cids = MARKET_THEME_CASES.map((c) => c.id);
    assert.equal(new Set(cids).size, cids.length);
    const tids = MARKET_THEME_TERMS.map((t) => t.id);
    assert.equal(new Set(tids).size, tids.length);
    for (const t of MARKET_THEMES) assert.ok(t.cases.length >= 2, t.id);
  });
});

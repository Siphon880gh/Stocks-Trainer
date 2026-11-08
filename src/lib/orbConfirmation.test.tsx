import assert from "node:assert/strict";
import { test } from "node:test";
import { MemoryRouter } from "react-router-dom";
import OrbContextLab from "../components/OrbContextLab";
import { renderText, renderHtml } from "./macro/renderHarness";
import { completedOrb, contextAnnotations, stockOrbRisk, ORB_CONTEXT_CASES as cases, ORB_CONTEXT_OHLC, ORB_CONTEXT_QUESTIONS, ORB_CONTEXT_TOUR, ORB_CONTEXT_FRAMES, ORB_VIDEO } from "./orbConfirmation";
import { getQuestionsForGroup } from "./quizData";
import { PATTERN_OHLC } from "./ohlcData";
import { getLiteracyTerm } from "./literacyTerms";
import { STAGE_BY_ID } from "./progressMap";
import { getPlaybook } from "./playbooks";

test("completed range: no lookahead, frozen extremes, midpoint and separate 15/30 windows", () => {
  const bars = cases[0].bars;
  assert.equal(completedOrb([], 15), null);
  assert.equal(completedOrb(bars.slice(0, 2), 15), null);
  assert.deepEqual(completedOrb(bars.slice(0, 3), 15), { high: 102, low: 99, midpoint: 100.5, width: 3, count: 3 });
  assert.equal(completedOrb(bars.slice(0, 5), 30), null);
  assert.equal(completedOrb(bars.slice(0, 6), 30)?.high, 103);
  assert.deepEqual(completedOrb(bars, 15), completedOrb(bars.slice(0, 3), 15));
  assert.deepEqual(completedOrb(bars, 30), completedOrb(bars.slice(0, 6), 30));
  assert.deepEqual(contextAnnotations(bars.slice(0, 2), 15), {});
  assert.equal(contextAnnotations(bars, 15).zones?.[0].fromIndex, 2, "range appears only when complete");
  const invalid = bars.map(b => ({ ...b })); invalid[0].high = NaN;
  assert.equal(completedOrb(invalid, 15), null);
});

test("SIMULATED contiguous 5-minute tapes, distinct structures and honest aftermaths", () => {
  for (const s of cases) {
    assert.ok(s.decision >= 3 && s.decision < s.bars.length - 1);
    for (const [i, b] of s.bars.entries()) {
      assert.ok(b.high >= Math.max(b.open, b.close) && b.low <= Math.min(b.open, b.close), s.id);
      if (i) assert.equal(b.open, s.bars[i - 1].close);
      const [h, m] = b.name.split(":").map(Number);
      assert.equal(h * 60 + m, 390 + i * 5, "Pacific candle start");
    }
    assert.equal(ORB_CONTEXT_OHLC[s.id].length, s.decision + 1);
    assert.equal(PATTERN_OHLC[s.id].length, s.decision + 1);
  }
  const [r, f, m] = cases;
  assert.ok(r.bars[3].close > 102 && r.bars[4].low > 102 && r.bars[5].low > 102);
  assert.ok(r.bars[r.decision].close > r.bars[4].high);
  assert.ok(r.bars[7].high >= r.target && r.bars[7].low > r.stop);
  assert.ok(f.bars[3].close > 102 && f.bars[4].close < 102);
  assert.ok(f.bars[5].high < f.bars[3].high && f.bars[6].close < f.bars[5].low);
  assert.ok(f.bars.slice(f.decision + 1).every(b => b.low > f.target));
  assert.ok(f.bars.at(-1)!.high >= f.stop, "failed break can still lose");
  assert.ok(m.bars[3].close < 99 && m.bars[4].high < 100.5 && m.bars[5].high < 100.5);
  assert.ok(stockOrbRisk(m.side, m.entry, m.stop, m.target, 100, 5000)!.rewardRisk < 1);
});

test("share sizing respects invalidation, finite inputs, costs, risk and buying-power caps", () => {
  const r = stockOrbRisk("long", 100, 99, 103, 100, 5000)!;
  assert.equal(r.shares, 50);
  assert.equal(r.plannedRisk, 1.05);
  assert.equal(r.dollarsAtRisk, 52.5);
  assert.equal(stockOrbRisk("long", 100, 99, 103, 100, 50000)!.shares, 95);
  assert.equal(stockOrbRisk("short", 100, 101, 97, 100, 5000)!.shares, 50);
  assert.equal(stockOrbRisk("long", 100, 99, 103, 1, 50)!.shares, 0);
  for (const n of [NaN, Infinity, -1, 0]) assert.equal(stockOrbRisk("long", 100, 99, 103, n, 5000), null);
  assert.equal(stockOrbRisk("long", 100, 100, 103, 100, 5000), null);
  assert.equal(stockOrbRisk("short", 100, 99, 97, 100, 5000), null);
  assert.equal(stockOrbRisk("long", 100, 99, 99, 100, 5000), null);
  assert.equal(stockOrbRisk("long", 100, 99, 103, 100, 5000, -1), null);
  assert.equal(stockOrbRisk("long", 100, 99, 100.01, 100, 5000), null);
  for (const s of cases) {
    const p = stockOrbRisk(s.side, s.entry, s.stop, s.target, 100, 5000)!;
    assert.ok(p.dollarsAtRisk <= 100 && p.shares * s.entry <= 5000);
  }
});

test("new lessons resolve through existing Learn, charts, Archive and Playbook surfaces", () => {
  const all = getQuestionsForGroup("opening-range");
  assert.equal(all.length, 22);
  assert.match(STAGE_BY_ID["lab:opening-range"].title, /retests, failed breaks/);
  assert.ok(STAGE_BY_ID["quiz:opening-range"].prereqs.includes("lab:opening-range"));
  for (const q of ORB_CONTEXT_QUESTIONS) {
    assert.ok(all.includes(q)); assert.ok(getLiteracyTerm(q.glossaryTermId!));
    if (q.patternKey) assert.ok(PATTERN_OHLC[q.patternKey]);
  }
  assert.equal(new Set(ORB_CONTEXT_QUESTIONS.map(q => q.correctAnswer)).size, 4);
  assert.equal(getPlaybook("orb-context-confirmation")?.video?.watchUrl, ORB_VIDEO.watchUrl);
  assert.equal(ORB_CONTEXT_TOUR.length, ORB_CONTEXT_FRAMES.length);
  for (const n of ORB_CONTEXT_FRAMES) assert.ok(n <= cases[0].decision + 1);
});

test("initial context page is SIMULATED, incomplete and hides answer/aftermath/risk facts", () => {
  const ui = <MemoryRouter><OrbContextLab onComplete={() => {}} /></MemoryRouter>;
  const text = renderText(ui); const html = renderHtml(ui);
  assert.match(text, /SIMULATED stock/); assert.match(text, /15-minute range incomplete/);
  assert.doesNotMatch(html, /data-testid="orb-context-result"/);
  assert.doesNotMatch(text, /planned risk \$/);
  assert.doesNotMatch(text, /The next candle reaches/);
  assert.ok(html.includes(ORB_VIDEO.watchUrl.replace(/&/g, "&amp;")));
});

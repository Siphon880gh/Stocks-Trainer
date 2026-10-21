import { test } from "node:test";
import assert from "node:assert/strict";
import * as C from "./consistency";
import { RELEASES, RELEASE_SPECS, labelFor } from "./releases";
import { getMacroSource } from "./sources";
import { WORLD } from "./world";

test("≥ 30 events, ≥ 2 per kind, ≥ 6 regimes, sources resolve", () => {
  assert.ok(RELEASES.length >= 30);
  const kinds = new Map<string, number>();
  for (const e of RELEASES) kinds.set(e.kind, (kinds.get(e.kind) ?? 0) + 1);
  assert.equal(kinds.size, 14);
  for (const [k, n] of kinds) assert.ok(n >= 2, k);
  assert.ok(new Set(RELEASES.map((e) => e.regime)).size >= 6);
  for (const e of RELEASES) assert.ok(getMacroSource(e.sourceId), e.sourceId);
  assert.equal(new Set(RELEASES.map((e) => e.id)).size, RELEASES.length);
});

test("surprise computed; labels computed; storyline labels hold", () => {
  RELEASES.forEach((e, i) => {
    for (const mt of [e.headline, ...e.details]) {
      assert.deepEqual(C.checkSurprise({ id: e.id, ...mt }), []);
      assert.equal(mt.label, labelFor(mt.surprise, mt.stdev, mt.strongerIsHigher));
      assert.ok(mt.range[0] <= mt.consensus && mt.consensus <= mt.range[1]);
    }
    assert.equal(e.effectiveLabel, RELEASE_SPECS[i]!.expect, `${e.id} ${e.period}`);
    if (e.twist === "details-reverse") {
      const d = e.details.find((x) => x.key === e.dominantDetail)!;
      assert.ok(d, e.id);
      if (e.kind !== "fomc") assert.notEqual(d.label, e.headline.label, `${e.id} details must overrule the headline`);
    }
  });
});

test("actuals equal the world", () => {
  for (const e of RELEASES) {
    const mo = WORLD.months[e.month]!;
    if (e.kind === "payrolls") {
      assert.equal(e.headline.actual, mo.payroll.firstPrint);
      assert.equal(e.headline.priorRevised, WORLD.months[e.month - 1]!.payroll.secondPrint);
      assert.equal(e.details[0]!.actual, mo.household.unemploymentRate);
      const [r1, r2] = e.revisions!;
      assert.equal(r1!.to - r1!.from, WORLD.months[e.month - 1]!.payroll.secondPrint - WORLD.months[e.month - 1]!.payroll.firstPrint);
      assert.equal(r2!.to, WORLD.months[e.month - 2]!.payroll.totalChange);
    }
    if (e.kind === "cpi") {
      assert.deepEqual(C.checkPriceChange(e.id, mo.prices.all, WORLD.months[e.month - 1]!.prices.all, e.headline.actual), []);
      assert.deepEqual(C.checkPriceChange(e.id, mo.prices.core, WORLD.months[e.month - 1]!.prices.core, e.details[0]!.actual), []);
    }
    if (e.kind === "claims") assert.equal(e.headline.actual, WORLD.weeks[e.week!]!.initialClaims);
    if (e.kind === "pmms") assert.equal(e.headline.actual, WORLD.weeks[e.week!]!.mortgage30);
    if (e.kind === "gdp") assert.equal(e.headline.actual, WORLD.quarters[e.quarter!]!.headline);
    if (e.kind === "fomc") assert.equal(e.headline.actual, WORLD.meetings.find((m) => m.month === e.month)!.decisionBp);
  }
});

import { REVISES_PRIOR } from "./releases";
test("prior revisions: revising kinds show first-reported prior vs revised (= world); others never invent one", () => {
  let n = 0;
  for (const e of RELEASES) {
    for (const m of [e.headline, ...e.details]) {
      if (e.kind === "payrolls" || m.prior === undefined) continue;
      if (REVISES_PRIOR.has(e.kind)) {
        assert.ok(m.priorRevised !== undefined && m.priorRevised !== m.prior, `${e.id}/${m.key}`);
        assert.ok(Math.abs(m.priorRevised - m.prior) <= 1.5 * m.stdev, `${e.id}/${m.key} revision size`);
        n++;
      } else assert.equal(m.priorRevised, undefined, `${e.id}/${m.key}`);
    }
  }
  assert.ok(n >= 15, `${n}`);
  const withRevision = RELEASES.filter((e) => e.headline.priorRevised !== undefined).length;
  assert.ok(withRevision >= 21, `${withRevision}`);
});

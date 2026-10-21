import { test } from "node:test";
import assert from "node:assert/strict";
import * as C from "./consistency";
import { buildWorld, claimsWindow, N_DAYS, N_MONTHS, N_WEEKS, WORLD } from "./world";

const all = (vs: { rule: string; detail: string }[][]) => vs.flat();

test("deterministic", () => {
  assert.deepEqual(buildWorld(), buildWorld());
  assert.equal(WORLD.months.length, N_MONTHS);
  assert.equal(WORLD.weeks.length, N_WEEKS);
  assert.equal(WORLD.days.length, N_DAYS);
  assert.equal(WORLD.quarters.length, 12);
});

test("labor identities hold every month", () => {
  const v = all(WORLD.months.map((mo) => [...C.checkPayrolls(mo.payroll), ...C.checkHousehold(mo.household)]));
  assert.deepEqual(v, []);
  for (let i = 1; i < N_MONTHS; i++) assert.equal(WORLD.months[i]!.payroll.prevLevel, WORLD.months[i - 1]!.payroll.level);
  for (const mo of WORLD.months) {
    const fp = Object.values(mo.payroll.firstPrintSectors).reduce((a, b) => a + b, 0);
    assert.equal(fp + mo.payroll.governmentChange, mo.payroll.firstPrint, mo.label);
    const j = mo.jolts;
    assert.deepEqual(C.checkJolts(mo.label, j.openings, j.hires, mo.payroll.level, j.openingsRate, j.hiresRate), []);
  }
});

test("activity identities", () => {
  for (const mo of WORLD.months) {
    const m = mo.ismMfg;
    assert.deepEqual(C.checkIsm(mo.label, m.pmi, [m.newOrders, m.production, m.employment, m.supplierDeliveries, m.inventories], m.status), []);
    const s = mo.ismServices;
    assert.deepEqual(C.checkIsm(mo.label, s.pmi, [s.businessActivity, s.newOrders, s.employment, s.supplierDeliveries], s.status), []);
  }
  for (const q of WORLD.quarters) {
    const c = q.contributions;
    assert.deepEqual(C.checkGdp(q.label, q.level, q.prior, q.headline, [c.consumption, c.investment, c.government, c.netExports]), []);
  }
});

test("rates, curve, claims, mortgage, fed range", () => {
  for (const d of WORLD.days) {
    assert.deepEqual(C.checkCurveSpread(d.label, d.y10, d.y2, d.spreadBp), []);
    assert.deepEqual(C.checkRealYield(d.label, d.y10, d.breakeven, d.real10y), []);
    assert.deepEqual(C.checkTargetRange(d.label, d.fedLower, d.fedUpper, d.effective), []);
    assert.ok(d.y10 > 2 && d.y10 < 6.5, `${d.label} 10y ${d.y10}`);
  }
  for (const w of WORLD.weeks) {
    assert.deepEqual(C.checkClaimsAverage(w.label, claimsWindow(WORLD, w.w), w.fourWeekAvg), []);
    assert.deepEqual(C.checkMortgage(w.label, w.mortgage30, w.mortgage15, w.avg10y), []);
  }
  for (const mt of WORLD.meetings) {
    assert.deepEqual(C.checkDecisionStep(mt.label, mt.decisionBp), []);
    assert.deepEqual(C.checkTargetRange(mt.label, mt.lower, mt.upper, mt.effective), []);
  }
});

test("plausible bands and storyline", () => {
  for (const mo of WORLD.months) {
    assert.ok(mo.household.unemploymentRate >= 3 && mo.household.unemploymentRate <= 7);
  }
  const ur0 = WORLD.months[0]!.household.unemploymentRate;
  const urEnd = WORLD.months[N_MONTHS - 1]!.household.unemploymentRate;
  assert.ok(urEnd > ur0 + 0.5, "unemployment rises into the recession-fear regime");
  const y1 = WORLD.months.slice(0, 12).reduce((a, m) => a + m.payroll.totalChange, 0) / 12;
  const y3 = WORLD.months.slice(30).reduce((a, m) => a + m.payroll.totalChange, 0) / 6;
  assert.ok(y1 > 150 && y3 < 60, `payroll trend ${y1} → ${y3}`);
  assert.ok(WORLD.days[N_DAYS - 1]!.spreadBp > 0 && WORLD.days[200]!.spreadBp < 0, "curve inverts then re-steepens");
});

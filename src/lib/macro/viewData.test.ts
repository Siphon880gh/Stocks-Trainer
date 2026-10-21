import { test } from "node:test";
import assert from "node:assert/strict";
import * as C from "./consistency";
import { FRED_META, claimsTable, cpiTable, curveRow, fredSeriesData, gdpTable, ismTable, payrollColumns, payrollRevisionSentence, pmmsCards } from "./viewData";
import { RELEASES } from "./releases";
import { MACRO_SOURCES } from "./sources";
import { WORLD } from "./world";

test("payroll columns: sectors sum to private, private + government = total, revisions", () => {
  for (const e of RELEASES.filter((r) => r.kind === "payrolls")) {
    for (const c of payrollColumns(e.month)) {
      assert.equal(Object.values(c.sectors).reduce((a, b) => a + b, 0), c.privateChange, c.label);
      assert.equal(c.privateChange + c.government, c.total);
    }
    const r = payrollRevisionSentence(e.month);
    assert.deepEqual([r.m1, r.m2], e.revisions);
    assert.equal(r.combined, r.m1.to - r.m1.from + r.m2.to - r.m2.from);
    assert.equal(payrollColumns(e.month)[2]!.total, e.headline.actual);
  }
});

test("CPI cells computed from index levels", () => {
  const t = cpiTable(13);
  const last = t.rows[0]!.monthly[6];
  assert.deepEqual(C.checkPriceChange("cpi", WORLD.months[13]!.prices.all, WORLD.months[12]!.prices.all, last as number), []);
  assert.equal(t.rows[0]!.yoy, C.pctChange(WORLD.months[13]!.prices.all, WORLD.months[1]!.prices.all));
  assert.equal(cpiTable(4).rows[0]!.yoy, null);
});

test("claims, curve, pmms, gdp, ism", () => {
  const ct = claimsTable(41);
  assert.equal(ct.rows[0]!.values[2], WORLD.weeks[41]!.initialClaims - WORLD.weeks[40]!.initialClaims);
  const cr = curveRow(300);
  assert.equal(cr.spreadBp, Math.round((cr.values[6]! - cr.values[4]!) * 100));
  const p = pmmsCards(34);
  assert.equal(p.cards[0]!.weekChange, Math.round((WORLD.weeks[34]!.mortgage30 - WORLD.weeks[33]!.mortgage30) * 100) / 100);
  const g = gdpTable(9);
  g.headline.forEach((h, i) => assert.ok(Math.abs(g.contributions.reduce((a, c) => a + c.values[i]!, 0) - h) <= 0.1 + 1e-9));
  for (const row of ismTable(14, "mfg")) assert.equal(row.direction === "Growing", row.current > 50);
});

test("every FRED series in the registry has data and metadata", () => {
  for (const s of MACRO_SOURCES.filter((x) => x.fredSeries)) {
    assert.ok(FRED_META[s.fredSeries!], s.fredSeries);
    assert.ok(fredSeriesData(s.fredSeries!).points.length >= 12, s.fredSeries);
  }
  const t = fredSeriesData("T10Y2Y").points[100]!.value;
  assert.equal(Math.round(t * 100), WORLD.days[100]!.spreadBp);
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyWhatIf,
  computeForecast,
  forecastInputViolations,
  forecastViolations,
  type ForecastInput,
  type ForecastResult,
} from "./cashForecast";
import {
  CASH_FORECASTS,
  HARBOR_COLLECTIONS_SLIP,
  IRONBRIDGE_DEBT_SERVICE,
  LEVEL1_REPLICA,
  NORTHWIND_RUNWAY,
  forecastById,
} from "./cashForecastFixtures";
import { companyById } from "./companies";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

describe("FE2.M1 forecast model: properties hold for every fixture and every what-if combination", () => {
  const combos = [
    {},
    { delayCollections: true },
    { deferCapex: true },
    { delayCollections: true, deferCapex: true },
    { useRevolver: false },
    { useRevolver: true, delayCollections: true },
  ];
  for (const f of CASH_FORECASTS) {
    it(`${f.id}: input is valid and every combination ties`, () => {
      assert.deepEqual(forecastInputViolations(f), []);
      for (const w of combos) {
        const r = computeForecast(applyWhatIf(f, w));
        assert.deepEqual(forecastViolations(r), [], `${f.id} ${JSON.stringify(w)}`);
        assert.equal(r.weeks.length, 13);
      }
    });
  }

  it("revolver never exceeds its limit even when the hole is bigger than the line", () => {
    const f: ForecastInput = {
      ...clone(IRONBRIDGE_DEBT_SERVICE),
      id: "tiny-line",
      revolver: { limit: 1000, openingBalance: 0, auto: true, cushion: 0 },
    };
    const r = computeForecast(f);
    assert.deepEqual(forecastViolations(r), []);
    assert.ok(r.peakRevolver <= 1000);
    assert.ok(r.breachWeeks.includes(7), "line too small: still a breach in week 7");
  });

  it("first-week beginning cash is the input's beginning cash", () => {
    for (const f of CASH_FORECASTS) assert.equal(computeForecast(f).weeks[0]!.beginning, f.beginningCash);
  });
});

describe("FE2.M1 validators catch broken results", () => {
  const base = () => clone(computeForecast(IRONBRIDGE_DEBT_SERVICE)) as ForecastResult;
  const breaks: [string, (r: ForecastResult) => void][] = [
    ["total receipts", (r) => (r.weeks[2]!.totalReceipts += 1)],
    ["total disbursements", (r) => (r.weeks[2]!.totalDisbursements += 1)],
    ["net", (r) => (r.weeks[2]!.net += 1)],
    ["ending", (r) => (r.weeks[2]!.ending += 1)],
    ["beginning chain", (r) => {
      r.weeks[3]!.beginning += 1;
      r.weeks[3]!.ending += 1;
    }],
    ["headroom", (r) => (r.weeks[2]!.headroom += 1)],
    ["breach flag", (r) => (r.weeks[2]!.breach = !r.weeks[2]!.breach)],
    ["revolver roll-forward", (r) => (r.weeks[7]!.revolverBalance += 1)],
    ["revolver above limit", (r) => {
      r.weeks[6]!.draw += 30000;
      r.weeks[6]!.ending += 30000;
      r.weeks[6]!.headroom += 30000;
      r.weeks[6]!.revolverBalance += 30000;
    }],
    ["breachWeeks list", (r) => r.breachWeeks.push(3)],
  ];
  for (const [name, mutate] of breaks) {
    it(name, () => {
      const r = base();
      mutate(r);
      assert.ok(forecastViolations(r).length > 0, name);
    });
  }
  it("input validator: wrong week count, negative or fractional lines, callout range", () => {
    const f = clone(LEVEL1_REPLICA);
    assert.deepEqual(forecastInputViolations(f), []);
    assert.ok(forecastInputViolations({ ...f, weeks: f.weeks.slice(0, 12) }).length > 0);
    const neg = clone(f);
    neg.weeks[0]!.disbursements.marketing = -1;
    assert.ok(forecastInputViolations(neg).length > 0);
    const frac = clone(f);
    frac.weeks[0]!.receipts.collections = 1.5;
    assert.ok(forecastInputViolations(frac).length > 0);
    assert.ok(forecastInputViolations({ ...f, callout: { week: 14, text: "x" } }).length > 0);
  });
});

describe("FE2.M2 fixtures tell their stories", () => {
  it("has at least 4 forecasts with unique ids and stories", () => {
    assert.ok(CASH_FORECASTS.length >= 4);
    assert.equal(new Set(CASH_FORECASTS.map((f) => f.id)).size, CASH_FORECASTS.length);
    for (const f of CASH_FORECASTS) assert.ok(f.story.length >= 3, f.id);
    assert.equal(forecastById("northwind-runway"), NORTHWIND_RUNWAY);
  });

  it("level-1 replica: week 9 nets −5k, every other week +10k, no covenant, only the four source rows", () => {
    const r = computeForecast(LEVEL1_REPLICA);
    assert.equal(r.weeks[8]!.receipts.collections, 30);
    assert.equal(r.weeks[8]!.net, -5);
    for (const w of r.weeks) if (w.week !== 9) {
      assert.equal(w.receipts.collections, 50);
      assert.equal(w.net, 10);
    }
    assert.equal(LEVEL1_REPLICA.minCash, 0);
    assert.deepEqual(r.breachWeeks, []);
    const used = new Set(LEVEL1_REPLICA.weeks.flatMap((w) => [...Object.keys(w.receipts), ...Object.keys(w.disbursements)]));
    assert.deepEqual([...used].sort(), ["collections", "marketing", "payables", "rentOpex"]);
    assert.ok(LEVEL1_REPLICA.notes?.some((n) => n.includes("week 9 inventory is 10k")), "adjustment is disclosed");
  });

  it("Harbor & Pine: collections slip weeks 5–9, revolver draws only weeks 7–9, fully repaid by week 11, never breaches", () => {
    const r = computeForecast(HARBOR_COLLECTIONS_SLIP);
    const coll = r.weeks.map((w) => w.receipts.collections);
    const normal = Math.min(...coll.slice(0, 4));
    for (const i of [4, 5, 6, 7, 8]) assert.ok(coll[i]! < normal * 0.7, `week ${i + 1} collections slipped`);
    assert.deepEqual(r.weeks.filter((w) => w.draw > 0).map((w) => w.week), [7, 8, 9]);
    assert.equal(r.weeks[10]!.revolverBalance, 0);
    assert.deepEqual(r.breachWeeks, []);
    const noLine = computeForecast(applyWhatIf(HARBOR_COLLECTIONS_SLIP, { useRevolver: false }));
    assert.equal(noLine.firstBreachWeek, 7, "without the line the floor breaks in week 7");
  });

  it("Ironbridge: without the revolver the only breach is week 7; with it, a draw in week 7 and repaid by week 10", () => {
    const off = computeForecast(applyWhatIf(IRONBRIDGE_DEBT_SERVICE, { useRevolver: false }));
    assert.deepEqual(off.breachWeeks, [7]);
    const r = computeForecast(IRONBRIDGE_DEBT_SERVICE);
    assert.deepEqual(r.breachWeeks, []);
    assert.equal(r.weeks.find((w) => w.draw > 0)?.week, 7);
    assert.equal(r.weeks[9]!.revolverBalance, 0);
    assert.ok(r.weeks[6]!.disbursements.debtService > 0 && r.weeks[6]!.disbursements.payroll > 0, "payroll + debt service collide");
    assert.equal(IRONBRIDGE_DEBT_SERVICE.minCash, companyById("ironbridge-industrial")!.covenant!.minCash, "same covenant as the statements");
  });

  it("Northwind: no revolver, cash crosses the 75k floor first in week 12", () => {
    const r = computeForecast(NORTHWIND_RUNWAY);
    assert.equal(NORTHWIND_RUNWAY.revolver, undefined);
    assert.equal(r.firstBreachWeek, 12);
    assert.ok(r.totalNet < 0, "net burn over the quarter");
    const nwq = companyById("northwind-cloud")!.quarters.at(-1)!;
    assert.ok(Math.abs(NORTHWIND_RUNWAY.beginningCash - nwq.balance.cash) < 1000, "starts from Q4 FY26 cash");
  });
});

describe("FE2.M3 what-ifs never mutate fixtures", () => {
  it("applyWhatIf returns new objects and leaves every fixture deep-equal to its snapshot", () => {
    const before = clone(CASH_FORECASTS);
    for (const f of CASH_FORECASTS) {
      const w = applyWhatIf(f, { delayCollections: true, deferCapex: true, useRevolver: false });
      assert.notEqual(w, f);
      assert.notEqual(w.weeks, f.weeks);
      w.weeks[0]!.receipts.collections = 999999;
      if (w.revolver) w.revolver.limit = 1;
      computeForecast(w);
    }
    assert.deepEqual(clone(CASH_FORECASTS), before);
  });

  it("delay collections shifts receipts one week; defer capex zeroes capex", () => {
    const f = HARBOR_COLLECTIONS_SLIP;
    const d = applyWhatIf(f, { delayCollections: true });
    assert.equal(d.weeks[0]!.receipts.collections, 0);
    for (let i = 1; i < 13; i++) assert.equal(d.weeks[i]!.receipts.collections, f.weeks[i - 1]!.receipts.collections);
    const c = applyWhatIf(f, { deferCapex: true });
    assert.ok(c.weeks.every((w) => w.disbursements.capex === 0));
    assert.ok(computeForecast(c).lowestCash >= computeForecast(f).lowestCash);
  });
});

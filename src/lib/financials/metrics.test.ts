import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMPANIES, buildQuarters } from "./companies";
import {
  cashConversionCycle,
  currentRatio,
  daysInventory,
  daysPayables,
  daysSalesOutstanding,
  ebitda,
  freeCashFlow,
  grossMargin,
  growthQoQ,
  growthYoY,
  interestCoverage,
  monthlyBurn,
  netDebt,
  netLeverage,
  netMargin,
  operatingMargin,
  quarterMetrics,
  runwayMonths,
  ttm,
} from "./metrics";
import type { Company } from "./types";

const close = (a: number | null, b: number, tol = 1e-9) => {
  assert.notEqual(a, null);
  assert.ok(Math.abs((a as number) - b) <= tol, `${a} vs ${b}`);
};

const D = {
  revenue: 1000, cogsPct: 0.4, rndPct: 0.1, sgaPct: 0.2, depreciation: 50, stockComp: 20, taxRate: 0.2, interestRate: 0.08,
  otherIncome: 10, dso: 45.5, dio: 91, dpo: 45.5, accruedPct: 0.1, deferredPct: 0.2, capex: 80, debtIssued: 0, debtRepaid: 0,
  currentDebt: 100, equityIssued: 0, newShares: 0, dividendsPerShare: 0, dilutiveShares: 0, kpis: [],
};
const OPEN = {
  cash: 500, receivables: 500, inventory: 400, otherCurrentAssets: 0, ppe: 1000, otherAssets: 0, payables: 200,
  accruedLiabilities: 30, deferredRevenue: 200, debt: 500, currentDebt: 100, otherLiabilities: 0, paidInCapital: 800, sharesBasic: 100,
};
/** 5 quarters: revenue 1000, 1100, 1200, 1300, 1500. */
const fx: Company = {
  id: "fx", name: "Fixture", ticker: "FX.S", archetype: "levered-industrial", sector: "", description: "", story: [],
  quarters: buildQuarters(OPEN, [1000, 1100, 1200, 1300, 1500].map((revenue) => ({ ...D, revenue }))),
};

describe("metrics: hand-computed fixture", () => {
  const q0 = fx.quarters[0];
  it("margins", () => {
    close(grossMargin(q0.income), 0.6);
    close(operatingMargin(q0.income), 0.3);
    close(netMargin(q0.income), 240 / 1000);
  });
  it("working-capital days on a 91-day quarter", () => {
    // AR = 1000 × 45.5 / 91 = 500 → DSO 45.5; inventory = 400 × 91/91 = 400 → DIO 91; AP = 400 × 45.5/91 = 200 → DPO 45.5
    close(daysSalesOutstanding(q0), 45.5);
    close(daysInventory(q0), 91);
    close(daysPayables(q0), 45.5);
    close(cashConversionCycle(q0), 91);
  });
  it("cash flow, debt and coverage", () => {
    // CFO = NI 240 + D&A 50 + SBC 20 + ΔAR 0 + ΔInv 0 + ΔAP 0 + Δaccrued (30 → 30) + Δdeferred (200 → 200) = 310
    assert.equal(q0.cashFlow.cfo, 310);
    assert.equal(freeCashFlow(q0), 230);
    assert.equal(ebitda(q0), 350);
    assert.equal(netDebt(q0.balance), 500 - q0.balance.cash);
    close(interestCoverage(q0.income), 300 / 10);
    close(currentRatio(q0.balance), q0.balance.totalCurrentAssets / q0.balance.totalCurrentLiabilities);
  });
  it("growth: QoQ, YoY and n/m cases", () => {
    assert.equal(growthQoQ(fx, 0), null);
    close(growthQoQ(fx, 1), 0.1);
    assert.equal(growthYoY(fx, 3), null);
    close(growthYoY(fx, 4), 0.5);
  });
  it("TTM and leverage need four quarters", () => {
    assert.equal(ttm(fx, 2, ebitda), null);
    const e = ttm(fx, 3, ebitda)!;
    assert.equal(e, fx.quarters.slice(0, 4).reduce((s, q) => s + ebitda(q), 0));
    assert.equal(netLeverage(fx, 2), null);
    close(netLeverage(fx, 3), netDebt(fx.quarters[3].balance) / e);
  });
  it("burn and runway: null runway when not burning", () => {
    assert.equal(monthlyBurn(q0), 0);
    assert.equal(runwayMonths(q0), null);
  });
});

describe("metrics: n/m guards", () => {
  it("zero revenue and zero interest return null, not Infinity/NaN", () => {
    const q = buildQuarters({ ...OPEN, debt: 0, currentDebt: 0, inventory: 0 }, [{ ...D, revenue: 0, interestRate: 0, dio: 0 }])[0];
    assert.equal(grossMargin(q.income), null);
    assert.equal(daysSalesOutstanding(q), null);
    assert.equal(daysInventory(q), null);
    assert.equal(interestCoverage(q.income), null);
  });
  it("leverage is null when TTM EBITDA is not positive", () => {
    const loss: Company = { ...fx, quarters: buildQuarters(OPEN, [0, 1, 2, 3].map(() => ({ ...D, sgaPct: 1.2 }))) };
    assert.ok(ttm(loss, 3, ebitda)! <= 0);
    assert.equal(netLeverage(loss, 3), null);
  });
});

describe("metrics: on the real fixtures", () => {
  it("Northwind runway is finite and short before the raise, longer after", () => {
    const nw = COMPANIES.find((c) => c.id === "northwind-cloud")!;
    const before = runwayMonths(nw.quarters[3])!;
    const after = runwayMonths(nw.quarters[4])!;
    assert.ok(before > 0 && before < 18, `runway before raise ${before}`);
    assert.ok(after > before * 2, "raise extends runway");
    close(monthlyBurn(nw.quarters[3]), -freeCashFlow(nw.quarters[3]) / 3);
  });
  it("quarterMetrics returns finite numbers or null for every quarter", () => {
    for (const c of COMPANIES) {
      c.quarters.forEach((_, i) => {
        for (const [k, v] of Object.entries(quarterMetrics(c, i))) {
          if (k === "label") continue;
          assert.ok(v === null || Number.isFinite(v), `${c.id} ${i} ${k}=${v}`);
        }
      });
    }
  });
});

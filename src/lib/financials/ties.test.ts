import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildQuarters } from "./companies";
import {
  balanceSheetViolations,
  cashFlowViolations,
  chainViolations,
  companyViolations,
  incomeStatementViolations,
  quarterViolations,
} from "./ties";
import type { Company, Quarter } from "./types";

/** Small hand-sized company: two quarters built from drivers. */
function fixtureQuarters(): Quarter[] {
  const base = {
    revenue: 1000, cogsPct: 0.4, rndPct: 0.1, sgaPct: 0.2, depreciation: 50, stockComp: 20, taxRate: 0.2,
    interestRate: 0.08, otherIncome: 10, dso: 45.5, dio: 91, dpo: 45.5, accruedPct: 0.1, deferredPct: 0.2, capex: 80,
    debtIssued: 0, debtRepaid: 25, currentDebt: 100, equityIssued: 0, newShares: 0, dividendsPerShare: 0.1,
    dilutiveShares: 10, kpis: [],
  };
  return buildQuarters(
    {
      cash: 500, receivables: 400, inventory: 300, otherCurrentAssets: 50, ppe: 1000, otherAssets: 100, payables: 150,
      accruedLiabilities: 40, deferredRevenue: 180, debt: 500, currentDebt: 100, otherLiabilities: 60, paidInCapital: 800,
      sharesBasic: 100,
    },
    [base, { ...base, revenue: 1200, equityIssued: 300, newShares: 20 }],
  );
}

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

describe("ties: good fixture", () => {
  it("hand-sized quarters tie out with no violations", () => {
    const [q1, q2] = fixtureQuarters();
    assert.deepEqual(quarterViolations(q1), []);
    assert.deepEqual(quarterViolations(q2), []);
    assert.deepEqual(chainViolations(q1, q2), []);
  });

  it("hand-computed numbers match (Q1)", () => {
    const [q1] = fixtureQuarters();
    // revenue 1000, cogs 400, GP 600, opex 300, OI 300, interest 500*8%/4 = 10, other +10, pretax 300, tax 60, NI 240
    assert.equal(q1.income.grossProfit, 600);
    assert.equal(q1.income.operatingIncome, 300);
    assert.equal(q1.income.interestExpense, 10);
    assert.equal(q1.income.netIncome, 240);
    assert.equal(q1.income.epsBasic, 2.4);
    assert.equal(q1.income.epsDiluted, 2.18); // 240 / 110
    assert.equal(q1.cashFlow.dividends, -10);
    assert.equal(q1.balance.totalAssets, q1.balance.totalLiabilitiesAndEquity);
  });

  it("a loss uses basic shares for diluted EPS", () => {
    const quarters = buildQuarters(
      { cash: 100, receivables: 0, inventory: 0, otherCurrentAssets: 0, ppe: 0, otherAssets: 0, payables: 0, accruedLiabilities: 0,
        deferredRevenue: 0, debt: 0, currentDebt: 0, otherLiabilities: 0, paidInCapital: 100, sharesBasic: 50 },
      [{ revenue: 100, cogsPct: 0.5, rndPct: 0.5, sgaPct: 0.5, depreciation: 0, stockComp: 0, taxRate: 0.2, interestRate: 0,
        otherIncome: 0, dso: 0, dio: 0, dpo: 0, accruedPct: 0, deferredPct: 0, capex: 0, debtIssued: 0, debtRepaid: 0,
        currentDebt: 0, equityIssued: 0, newShares: 0, dividendsPerShare: 0, dilutiveShares: 25, kpis: [] }],
    );
    assert.equal(quarters[0].income.netIncome, -50);
    assert.equal(quarters[0].income.taxExpense, 0);
    assert.equal(quarters[0].income.sharesDiluted, 50);
    assert.deepEqual(quarterViolations(quarters[0]), []);
  });
});

describe("ties: each rule catches a broken fixture", () => {
  const isBreaks: [string, (q: Quarter) => void][] = [
    ["grossProfit", (q) => (q.income.grossProfit += 1)],
    ["operatingExpenses", (q) => (q.income.operatingExpenses += 1)],
    ["operatingIncome", (q) => (q.income.operatingIncome += 1)],
    ["pretaxIncome", (q) => (q.income.pretaxIncome += 1)],
    ["netIncome", (q) => (q.income.netIncome += 1)],
    ["epsBasic", (q) => (q.income.epsBasic += 0.01)],
    ["epsDiluted", (q) => (q.income.epsDiluted += 0.01)],
    ["sharesDiluted", (q) => (q.income.sharesDiluted = q.income.sharesBasic - 1)],
  ];
  for (const [name, mutate] of isBreaks) {
    it(`income statement: ${name}`, () => {
      const q = clone(fixtureQuarters()[0]);
      mutate(q);
      assert.ok(incomeStatementViolations(q.income).length > 0);
    });
  }

  const bsBreaks: [string, (q: Quarter) => void][] = [
    ["totalCurrentAssets", (q) => (q.balance.totalCurrentAssets += 1)],
    ["totalAssets", (q) => (q.balance.totalAssets += 1)],
    ["totalCurrentLiabilities", (q) => (q.balance.totalCurrentLiabilities += 1)],
    ["totalLiabilities", (q) => (q.balance.totalLiabilities += 1)],
    ["totalEquity", (q) => (q.balance.totalEquity += 1)],
    ["totalLiabilitiesAndEquity", (q) => (q.balance.totalLiabilitiesAndEquity += 1)],
    ["assets != L+E (cash moved, totals recomputed)", (q) => {
      q.balance.cash += 5;
      q.balance.totalCurrentAssets += 5;
      q.balance.totalAssets += 5;
    }],
  ];
  for (const [name, mutate] of bsBreaks) {
    it(`balance sheet: ${name}`, () => {
      const q = clone(fixtureQuarters()[0]);
      mutate(q);
      assert.ok(balanceSheetViolations(q.balance).length > 0);
    });
  }

  const cfBreaks: [string, (q: Quarter) => void][] = [
    ["cfo", (q) => (q.cashFlow.cfo += 1)],
    ["cfi", (q) => (q.cashFlow.cfi += 1)],
    ["cff", (q) => (q.cashFlow.cff += 1)],
    ["netChangeInCash", (q) => (q.cashFlow.netChangeInCash += 1)],
    ["endingCash", (q) => (q.cashFlow.endingCash += 1)],
    ["outflow stored positive", (q) => {
      q.cashFlow.capex = -q.cashFlow.capex;
      q.cashFlow.cfi = q.cashFlow.capex;
    }],
  ];
  for (const [name, mutate] of cfBreaks) {
    it(`cash flow: ${name}`, () => {
      const q = clone(fixtureQuarters()[0]);
      mutate(q);
      assert.ok(cashFlowViolations(q.cashFlow).length > 0);
    });
  }

  it("cross-statement: CF net income must equal IS net income", () => {
    const q = clone(fixtureQuarters()[0]);
    q.cashFlow.netIncome += 1;
    q.cashFlow.cfo += 1;
    q.cashFlow.netChangeInCash += 1;
    q.cashFlow.endingCash += 1;
    assert.ok(quarterViolations(q).some((s) => s.includes("net income")));
  });

  it("cross-statement: CF ending cash must equal BS cash", () => {
    const q = clone(fixtureQuarters()[0]);
    q.cashFlow.beginningCash += 1;
    q.cashFlow.endingCash += 1;
    assert.ok(quarterViolations(q).some((s) => s.includes("ending cash != BS cash")));
  });

  const chainBreaks: [string, (q: Quarter) => void][] = [
    ["beginning cash", (q) => (q.cashFlow.beginningCash += 1)],
    ["retained earnings", (q) => (q.balance.retainedEarnings += 1)],
    ["receivables", (q) => (q.cashFlow.changeReceivables += 1)],
    ["inventory", (q) => (q.cashFlow.changeInventory += 1)],
    ["payables", (q) => (q.cashFlow.changePayables += 1)],
    ["accrued", (q) => (q.cashFlow.changeAccrued += 1)],
    ["deferred revenue", (q) => (q.cashFlow.changeDeferredRevenue += 1)],
    ["PP&E", (q) => (q.balance.ppe += 1)],
    ["debt", (q) => (q.balance.longTermDebt += 1)],
    ["paid-in capital", (q) => (q.balance.paidInCapital += 1)],
    ["other line moved", (q) => (q.balance.otherAssets += 1)],
  ];
  for (const [name, mutate] of chainBreaks) {
    it(`chain: ${name}`, () => {
      const [q1, q2raw] = fixtureQuarters();
      const q2 = clone(q2raw);
      mutate(q2);
      assert.ok(chainViolations(q1, q2).length > 0, name);
    });
  }

  it("companyViolations walks quarters and chains", () => {
    const quarters = fixtureQuarters().map(clone);
    const c: Company = { id: "fx", name: "Fixture", ticker: "FX.S", archetype: "saas-burner", sector: "", description: "", story: [], quarters };
    assert.deepEqual(companyViolations(c), []);
    quarters[1].balance.otherLiabilities += 1;
    assert.ok(companyViolations(c).length > 0);
  });
});

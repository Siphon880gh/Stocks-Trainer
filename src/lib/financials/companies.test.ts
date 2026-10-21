import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMPANIES, buildQuarters, companyById } from "./companies";
import { freeCashFlow, grossMargin, netLeverage, operatingMargin } from "./metrics";
import { companyViolations } from "./ties";

const QUARTER_LABELS = ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26", "Q3 FY26", "Q4 FY26"];
const isInt = (n: number) => Number.isInteger(n);

describe("companies: shape and ties", () => {
  it("has at least 3 companies with unique ids and SAMPLE .S tickers", () => {
    assert.ok(COMPANIES.length >= 3);
    assert.equal(new Set(COMPANIES.map((c) => c.id)).size, COMPANIES.length);
    for (const c of COMPANIES) assert.match(c.ticker, /^[A-Z]{2,5}\.S$/);
  });

  for (const c of COMPANIES) {
    it(`${c.id}: 8 labelled quarters`, () => {
      assert.deepEqual(c.quarters.map((q) => q.label), QUARTER_LABELS);
    });

    it(`${c.id}: every statement ties, within and across quarters`, () => {
      assert.deepEqual(companyViolations(c), []);
    });

    it(`${c.id}: money values are whole thousands and cash never goes negative`, () => {
      for (const q of c.quarters) {
        for (const block of [q.income, q.balance, q.cashFlow] as unknown as Record<string, number>[]) {
          for (const [k, v] of Object.entries(block)) {
            if (k.startsWith("eps")) continue;
            assert.ok(isInt(v), `${c.id} ${q.label} ${k}=${v}`);
          }
        }
        assert.ok(q.balance.cash > 0, `${c.id} ${q.label} cash`);
        assert.ok(q.income.revenue > 0);
      }
    });

    it(`${c.id}: has a plain-language story and KPIs`, () => {
      assert.ok(c.story.length >= 3);
      for (const q of c.quarters) assert.ok(q.kpis.length >= 1);
    });
  }

  it("generator is deterministic (two runs deep-equal)", () => {
    const open = { cash: 100, receivables: 10, inventory: 10, otherCurrentAssets: 0, ppe: 50, otherAssets: 0, payables: 5,
      accruedLiabilities: 2, deferredRevenue: 3, debt: 20, currentDebt: 5, otherLiabilities: 0, paidInCapital: 100, sharesBasic: 10 };
    const d = { revenue: 300, cogsPct: 0.5, rndPct: 0.1, sgaPct: 0.2, depreciation: 4, stockComp: 2, taxRate: 0.2, interestRate: 0.05,
      otherIncome: 0, dso: 30, dio: 40, dpo: 20, accruedPct: 0.05, deferredPct: 0.02, capex: 6, debtIssued: 0, debtRepaid: 1,
      currentDebt: 4, equityIssued: 0, newShares: 0, dividendsPerShare: 0.01, dilutiveShares: 1, kpis: [] };
    assert.deepEqual(buildQuarters(open, [d, d, d]), buildQuarters(open, [d, d, d]));
  });

  it("companyById finds companies", () => {
    assert.equal(companyById("harbor-pine")?.ticker, "HBPN.S");
    assert.equal(companyById("nope"), undefined);
  });
});

describe("companies: the numbers tell the stated story", () => {
  it("Northwind: growing SaaS, ~75% gross margin, shrinking losses, FCF negative in most quarters, equity raise in Q1 FY26", () => {
    const c = companyById("northwind-cloud")!;
    const q = c.quarters;
    for (let i = 1; i < q.length; i++) assert.ok(q[i].income.revenue > q[i - 1].income.revenue, "revenue grows");
    for (const x of q) assert.ok(Math.abs(grossMargin(x.income)! - 0.75) < 0.02, "GM ~75%");
    for (const x of q) assert.ok(x.income.operatingIncome < 0, "operating loss every quarter");
    for (let i = 1; i < q.length; i++) assert.ok(operatingMargin(q[i].income)! > operatingMargin(q[i - 1].income)!, "losses shrink");
    assert.ok(q.filter((x) => freeCashFlow(x) < 0).length >= 6, "FCF negative ≥ 6 of 8");
    const raises = q.map((x, i) => (x.cashFlow.equityIssued > 0 ? i : -1)).filter((i) => i >= 0);
    assert.deepEqual(raises, [4], "one equity raise in Q1 FY26");
    for (let i = 1; i < 4; i++) assert.ok(q[i].balance.cash < q[i - 1].balance.cash, "cash runs down before the raise");
    assert.ok(q[4].income.sharesBasic > q[3].income.sharesBasic * 1.08, "raise dilutes shareholders");
    for (let i = 1; i < q.length; i++) assert.ok(q[i].balance.deferredRevenue > q[i - 1].balance.deferredRevenue, "deferred revenue grows");
  });

  it("Harbor & Pine: Q4 is the biggest quarter, inventory peaks in Q3, dividend every quarter, comps fade", () => {
    const c = companyById("harbor-pine")!;
    const q = c.quarters;
    for (const year of [0, 4]) {
      const rev = q.slice(year, year + 4).map((x) => x.income.revenue);
      assert.equal(Math.max(...rev), rev[3], "Q4 revenue largest");
      const inv = q.slice(year, year + 4).map((x) => x.balance.inventory);
      assert.equal(Math.max(...inv), inv[2], "inventory peaks at Q3");
      assert.ok(inv[3] < inv[2], "inventory falls in Q4");
      assert.ok(q[year + 2].balance.cash < q[year + 1].balance.cash, "cash dips in Q3");
      assert.ok(q[year + 3].balance.cash > q[year + 2].balance.cash, "cash rebuilds in Q4");
    }
    for (const x of q) assert.ok(x.cashFlow.dividends < 0, "dividend paid");
    for (const x of q) assert.ok(Math.abs(grossMargin(x.income)! - 0.38) < 0.04, "GM ~38%");
    const comps = q.map((x) => x.kpis.find((k) => k.id === "comps")!.value);
    assert.ok(comps[7] < 0 && comps[6] < 0 && comps[3] > 0, "comps turn negative in FY26");
    assert.ok(q[6].balance.inventory > q[2].balance.inventory, "inventory higher than a year ago (warning sign)");
  });

  it("Ironbridge: thin margins that compress, heavy capex, amortizing term loan, leverage climbs but stays under covenant", () => {
    const c = companyById("ironbridge-industrial")!;
    const q = c.quarters;
    for (const x of q) assert.ok(Math.abs(grossMargin(x.income)! - 0.27) < 0.035, "GM ~27%");
    assert.ok(grossMargin(q[6].income)! < grossMargin(q[3].income)!, "margin shrinks as revenue falls");
    for (const x of q) assert.ok(-x.cashFlow.capex >= x.income.revenue * 0.08, "capex ≥ 8% of revenue");
    for (const x of q) assert.equal(x.cashFlow.debtRepaid, -5000, "repays 5,000 per quarter");
    for (const x of q) assert.ok(x.income.interestExpense > x.income.operatingIncome * 0.25, "interest is a big slice of OI");
    const lev = [3, 4, 5, 6, 7].map((i) => netLeverage(c, i)!);
    assert.ok(lev[4] > lev[0], "leverage climbs");
    for (const l of lev) assert.ok(l > 2 && l < c.covenant!.maxNetLeverage, `leverage ${l} under covenant`);
    for (const x of q) assert.ok(x.balance.cash >= c.covenant!.minCash, "quarter-end cash above covenant minimum");
  });
});

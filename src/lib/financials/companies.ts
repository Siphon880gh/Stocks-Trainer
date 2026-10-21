/**
 * Three fictional companies × 8 quarters (Q1 FY25 … Q4 FY26), generated from drivers so every statement ties.
 * SAMPLE / STYLIZED: invented companies and numbers, for practice only. Not live filings, not advice.
 */
import { eps } from "./ties";
import type { BalanceSheet, CashFlowStatement, Company, IncomeStatement, Kpi, Quarter } from "./types";

/** Per-quarter assumptions. Percentages are fractions (0.38 = 38%). Money in thousands. */
export interface QuarterDrivers {
  revenue: number;
  cogsPct: number;
  rndPct: number;
  sgaPct: number;
  depreciation: number;
  stockComp: number;
  taxRate: number;
  /** Annual rate charged on debt at the start of the quarter. */
  interestRate: number;
  otherIncome: number;
  /** Days of sales outstanding / inventory / payables on a 91-day quarter. */
  dso: number;
  dio: number;
  dpo: number;
  /** Accrued liabilities as a fraction of operating expenses. */
  accruedPct: number;
  /** Deferred revenue as a fraction of quarterly revenue. */
  deferredPct: number;
  capex: number;
  debtIssued: number;
  debtRepaid: number;
  /** Debt due in the next 12 months (reported as short-term debt). */
  currentDebt: number;
  equityIssued: number;
  newShares: number;
  /** Dividends per share in dollars (× shares in thousands = thousands of dollars). */
  dividendsPerShare: number;
  /** Extra diluted shares when profitable (options / RSUs). */
  dilutiveShares: number;
  kpis: Kpi[];
}

export interface OpeningBalance {
  cash: number;
  receivables: number;
  inventory: number;
  otherCurrentAssets: number;
  ppe: number;
  otherAssets: number;
  payables: number;
  accruedLiabilities: number;
  deferredRevenue: number;
  debt: number;
  currentDebt: number;
  otherLiabilities: number;
  paidInCapital: number;
  sharesBasic: number;
}

const r = Math.round;

export function quarterLabel(index: number, firstFiscalYear = 25): { label: string; fiscalYear: number; quarter: 1 | 2 | 3 | 4 } {
  const quarter = ((index % 4) + 1) as 1 | 2 | 3 | 4;
  const fiscalYear = firstFiscalYear + Math.floor(index / 4);
  return { label: `Q${quarter} FY${fiscalYear}`, fiscalYear, quarter };
}

function balanceFrom(parts: {
  cash: number; receivables: number; inventory: number; otherCurrentAssets: number; ppe: number; otherAssets: number;
  payables: number; accruedLiabilities: number; deferredRevenue: number; shortTermDebt: number; longTermDebt: number;
  otherLiabilities: number; paidInCapital: number; retainedEarnings: number;
}): BalanceSheet {
  const totalCurrentAssets = parts.cash + parts.receivables + parts.inventory + parts.otherCurrentAssets;
  const totalAssets = totalCurrentAssets + parts.ppe + parts.otherAssets;
  const totalCurrentLiabilities = parts.payables + parts.accruedLiabilities + parts.deferredRevenue + parts.shortTermDebt;
  const totalLiabilities = totalCurrentLiabilities + parts.longTermDebt + parts.otherLiabilities;
  const totalEquity = parts.paidInCapital + parts.retainedEarnings;
  return {
    ...parts,
    totalCurrentAssets,
    totalAssets,
    totalCurrentLiabilities,
    totalLiabilities,
    totalEquity,
    totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
  };
}

/** Roll drivers forward from an opening balance. Retained earnings are the plug at the opening only. */
export function buildQuarters(opening: OpeningBalance, drivers: QuarterDrivers[], firstFiscalYear = 25): Quarter[] {
  const openingLiabs =
    opening.payables + opening.accruedLiabilities + opening.deferredRevenue + opening.debt + opening.otherLiabilities;
  const openingAssets =
    opening.cash + opening.receivables + opening.inventory + opening.otherCurrentAssets + opening.ppe + opening.otherAssets;
  let prev = balanceFrom({
    cash: opening.cash,
    receivables: opening.receivables,
    inventory: opening.inventory,
    otherCurrentAssets: opening.otherCurrentAssets,
    ppe: opening.ppe,
    otherAssets: opening.otherAssets,
    payables: opening.payables,
    accruedLiabilities: opening.accruedLiabilities,
    deferredRevenue: opening.deferredRevenue,
    shortTermDebt: opening.currentDebt,
    longTermDebt: opening.debt - opening.currentDebt,
    otherLiabilities: opening.otherLiabilities,
    paidInCapital: opening.paidInCapital,
    retainedEarnings: openingAssets - openingLiabs - opening.paidInCapital,
  });
  let shares = opening.sharesBasic;

  return drivers.map((d, i) => {
    const prevDebt = prev.shortTermDebt + prev.longTermDebt;
    shares += d.newShares;
    const cogs = r(d.revenue * d.cogsPct);
    const rnd = r(d.revenue * d.rndPct);
    const sga = r(d.revenue * d.sgaPct);
    const grossProfit = d.revenue - cogs;
    const operatingExpenses = rnd + sga;
    const operatingIncome = grossProfit - operatingExpenses;
    const interestExpense = r((prevDebt * d.interestRate) / 4);
    const pretaxIncome = operatingIncome - interestExpense + d.otherIncome;
    const taxExpense = pretaxIncome > 0 ? r(pretaxIncome * d.taxRate) : 0;
    const netIncome = pretaxIncome - taxExpense;
    const sharesDiluted = netIncome > 0 ? shares + d.dilutiveShares : shares;
    const income: IncomeStatement = {
      revenue: d.revenue, cogs, grossProfit, rnd, sga, operatingExpenses, operatingIncome, interestExpense,
      otherIncome: d.otherIncome, pretaxIncome, taxExpense, netIncome,
      sharesBasic: shares, sharesDiluted, epsBasic: eps(netIncome, shares), epsDiluted: eps(netIncome, sharesDiluted),
    };

    const receivables = r((d.revenue * d.dso) / 91);
    const inventory = r((cogs * d.dio) / 91);
    const payables = r((cogs * d.dpo) / 91);
    const accruedLiabilities = r(operatingExpenses * d.accruedPct);
    const deferredRevenue = r(d.revenue * d.deferredPct);
    const dividends = -r(d.dividendsPerShare * shares);
    const changeReceivables = -(receivables - prev.receivables);
    const changeInventory = -(inventory - prev.inventory);
    const changePayables = payables - prev.payables;
    const changeAccrued = accruedLiabilities - prev.accruedLiabilities;
    const changeDeferredRevenue = deferredRevenue - prev.deferredRevenue;
    const cfo = netIncome + d.depreciation + d.stockComp + changeReceivables + changeInventory + changePayables + changeAccrued + changeDeferredRevenue;
    const capex = -d.capex;
    const cfi = capex;
    const debtRepaid = -d.debtRepaid;
    const cff = d.debtIssued + debtRepaid + d.equityIssued + dividends;
    const netChangeInCash = cfo + cfi + cff;
    const cashFlow: CashFlowStatement = {
      netIncome, depreciation: d.depreciation, stockComp: d.stockComp, changeReceivables, changeInventory, changePayables,
      changeAccrued, changeDeferredRevenue, cfo, capex, cfi, debtIssued: d.debtIssued, debtRepaid, equityIssued: d.equityIssued,
      dividends, cff, netChangeInCash, beginningCash: prev.cash, endingCash: prev.cash + netChangeInCash,
    };

    const debt = prevDebt + d.debtIssued - d.debtRepaid;
    const shortTermDebt = Math.min(d.currentDebt, debt);
    const balance = balanceFrom({
      cash: cashFlow.endingCash,
      receivables,
      inventory,
      otherCurrentAssets: prev.otherCurrentAssets,
      ppe: prev.ppe + d.capex - d.depreciation,
      otherAssets: prev.otherAssets,
      payables,
      accruedLiabilities,
      deferredRevenue,
      shortTermDebt,
      longTermDebt: debt - shortTermDebt,
      otherLiabilities: prev.otherLiabilities,
      paidInCapital: prev.paidInCapital + d.equityIssued + d.stockComp,
      retainedEarnings: prev.retainedEarnings + netIncome + dividends,
    });
    prev = balance;
    return { ...quarterLabel(i, firstFiscalYear), income, balance, cashFlow, kpis: d.kpis };
  });
}

const QUARTERS = 8;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ---------- Northwind Cloud: fast-growing SaaS that burns cash and raises equity ---------- */

const NORTHWIND_NRR = [124, 123, 121, 120, 118, 117, 116, 116];
const northwindDrivers: QuarterDrivers[] = range(QUARTERS).map((t) => {
  const revenue = r(40000 * Math.pow(1.08, t));
  return {
    revenue,
    cogsPct: 0.25,
    rndPct: 0.35 - 0.004 * t,
    sgaPct: 0.6 - 0.022 * t,
    depreciation: 1200 + 100 * t,
    stockComp: 2400 + 150 * t,
    taxRate: 0.21,
    interestRate: 0,
    otherIncome: 300,
    dso: 60,
    dio: 0,
    dpo: 30,
    accruedPct: 0.12,
    deferredPct: 0.35,
    capex: 2600 + 100 * t,
    debtIssued: 0,
    debtRepaid: 0,
    currentDebt: 0,
    equityIssued: t === 4 ? 90000 : 0,
    newShares: t === 4 ? 6000 : 150,
    dividendsPerShare: 0,
    dilutiveShares: 2500,
    kpis: [
      { id: "arr", label: "ARR", value: r(revenue * 4 * 1.06), unit: "thousands" },
      { id: "nrr", label: "Net revenue retention", value: NORTHWIND_NRR[t], unit: "pct" },
      { id: "customers", label: "Customers", value: 1800 + 140 * t, unit: "count" },
    ],
  };
});

const northwind: Company = {
  id: "northwind-cloud",
  name: "Northwind Cloud",
  ticker: "NWCL.S",
  archetype: "saas-burner",
  sector: "Software (SaaS)",
  description: "Subscription software growing ~8% a quarter. High gross margin, but sales and R&D spend more than gross profit.",
  story: [
    "Revenue grows every quarter and gross margin stays near 75%.",
    "Operating losses shrink but never turn positive in eight quarters.",
    "Free cash flow is negative in most quarters, so cash runs down until a stock sale in Q1 FY26.",
    "Deferred revenue (cash collected up front) grows with sales and softens the burn.",
  ],
  quarters: buildQuarters(
    {
      cash: 52000, receivables: 25000, inventory: 0, otherCurrentAssets: 4000, ppe: 14000, otherAssets: 9000,
      payables: 3200, accruedLiabilities: 4300, deferredRevenue: 13000, debt: 0, currentDebt: 0, otherLiabilities: 3000,
      paidInCapital: 210000, sharesBasic: 48000,
    },
    northwindDrivers,
  ),
};

/* ---------- Harbor & Pine: seasonal retailer, inventory build before holidays, pays a dividend ---------- */

const HP_SEASON = [205000, 215000, 225000, 330000];
const HP_COMPS = [3.4, 2.8, 2.1, 3.6, 1.9, 0.6, -0.8, -2.2];
const harborDrivers: QuarterDrivers[] = range(QUARTERS).map((t) => {
  const q = t % 4;
  const year = Math.floor(t / 4);
  const revenue = r(HP_SEASON[q] * (year === 0 ? 1 : 1.015) * (t === 7 ? 0.96 : 1));
  return {
    revenue,
    cogsPct: q === 3 ? 0.645 : 0.615 + (t >= 5 ? 0.008 : 0),
    rndPct: 0,
    sgaPct: q === 3 ? 0.25 : 0.3,
    depreciation: 6000,
    stockComp: 700,
    taxRate: 0.25,
    interestRate: 0.06,
    otherIncome: 0,
    dso: 4,
    dio: [72, 80, 104, 48][q] + (t >= 6 ? 8 : 0),
    dpo: [44, 50, 68, 38][q],
    accruedPct: 0.1,
    deferredPct: 0.012,
    capex: 8000,
    debtIssued: 0,
    debtRepaid: 0,
    currentDebt: 0,
    equityIssued: 0,
    newShares: 0,
    dividendsPerShare: 0.2,
    dilutiveShares: 900,
    kpis: [
      { id: "comps", label: "Same-store sales", value: HP_COMPS[t], unit: "pct" },
      { id: "stores", label: "Stores", value: 412 + 3 * t, unit: "count" },
    ],
  };
});

const harbor: Company = {
  id: "harbor-pine",
  name: "Harbor & Pine",
  ticker: "HBPN.S",
  archetype: "seasonal-retailer",
  sector: "Retail (home goods)",
  description: "Home-goods retailer. The holiday quarter (Q4) is the biggest; inventory is built up in Q3 to get ready.",
  story: [
    "Q4 revenue is the largest of each year (holiday season).",
    "Inventory peaks at the end of Q3, then falls in Q4 as it is sold.",
    "Cash dips in Q3 (inventory build) and rebuilds in Q4.",
    "Same-store sales slow through FY26 and inventory days creep up: a warning sign.",
    "Pays a steady dividend every quarter.",
  ],
  quarters: buildQuarters(
    {
      cash: 95000, receivables: 9500, inventory: 125000, otherCurrentAssets: 12000, ppe: 180000, otherAssets: 40000,
      payables: 72000, accruedLiabilities: 21000, deferredRevenue: 4000, debt: 60000, currentDebt: 0, otherLiabilities: 30000,
      paidInCapital: 120000, sharesBasic: 80000,
    },
    harborDrivers,
  ),
};

/* ---------- Ironbridge Industrial: capital heavy, levered, covenant gets tight ---------- */

const IB_REVENUE = [150000, 155000, 158000, 161000, 156000, 148000, 141000, 144000];
const IB_BACKLOG = [410000, 418000, 422000, 415000, 396000, 372000, 360000, 366000];
const ironDrivers: QuarterDrivers[] = range(QUARTERS).map((t) => {
  const revenue = IB_REVENUE[t];
  return {
    revenue,
    // Fixed costs inside COGS: margin compresses when revenue falls (operating leverage).
    cogsPct: 0.712 + (158000 - revenue) / 400000,
    rndPct: 0.015,
    sgaPct: 0.12,
    depreciation: 9000,
    stockComp: 600,
    taxRate: 0.24,
    interestRate: 0.075,
    otherIncome: 0,
    dso: 62,
    dio: 78,
    dpo: 46,
    accruedPct: 0.25,
    deferredPct: 0.03,
    capex: 14000,
    debtIssued: 0,
    debtRepaid: 5000,
    currentDebt: 20000,
    equityIssued: 0,
    newShares: 0,
    dividendsPerShare: 0.1,
    dilutiveShares: 300,
    kpis: [
      { id: "backlog", label: "Backlog", value: IB_BACKLOG[t], unit: "thousands" },
      { id: "book-to-bill", label: "Book-to-bill", value: Math.round(((IB_BACKLOG[t] - (IB_BACKLOG[t - 1] ?? 402000) + revenue) / revenue) * 100) / 100, unit: "ratio" },
    ],
  };
});

const ironbridge: Company = {
  id: "ironbridge-industrial",
  name: "Ironbridge Industrial",
  ticker: "IRBG.S",
  archetype: "levered-industrial",
  sector: "Industrials (equipment)",
  description: "Builds heavy equipment. Big factories (capex), a large term loan, and a lender covenant on leverage.",
  story: [
    "Gross margin is thin (~28%) and shrinks when revenue falls, because factory costs are mostly fixed.",
    "Capex is heavy, so free cash flow is far below operating cash flow.",
    "The term loan is repaid 5,000 a quarter and interest eats a big slice of operating income.",
    "Revenue and backlog fall in FY26, so leverage (net debt ÷ EBITDA) climbs toward the 3.5× covenant.",
  ],
  covenant: { maxNetLeverage: 3.5, minCash: 15000 },
  quarters: buildQuarters(
    {
      cash: 48000, receivables: 102000, inventory: 95000, otherCurrentAssets: 10000, ppe: 360000, otherAssets: 25000,
      payables: 55000, accruedLiabilities: 20000, deferredRevenue: 4500, debt: 380000, currentDebt: 20000, otherLiabilities: 15000,
      paidInCapital: 140000, sharesBasic: 40000,
    },
    ironDrivers,
  ),
};

export const COMPANIES: Company[] = [northwind, harbor, ironbridge];

export function companyById(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

/**
 * Fictional company financials (FE0). SAMPLE / STYLIZED: invented companies, not live filings, not advice.
 *
 * Units: every money value is in whole THOUSANDS of US dollars (integers). Share counts are in thousands.
 * EPS is in dollars (NI thousands / shares thousands), rounded to cents.
 * Cash flow lines store the CASH IMPACT: inflows positive, outflows negative (capex, repayments, dividends are negative).
 */

export type Thousands = number;

export interface IncomeStatement {
  revenue: Thousands;
  cogs: Thousands;
  grossProfit: Thousands;
  /** Research & development (0 for companies without R&D). */
  rnd: Thousands;
  /** Selling, general & administrative. */
  sga: Thousands;
  /** rnd + sga (D&A is included inside these lines). */
  operatingExpenses: Thousands;
  operatingIncome: Thousands;
  interestExpense: Thousands;
  otherIncome: Thousands;
  pretaxIncome: Thousands;
  taxExpense: Thousands;
  netIncome: Thousands;
  sharesBasic: Thousands;
  sharesDiluted: Thousands;
  epsBasic: number;
  epsDiluted: number;
}

export interface BalanceSheet {
  cash: Thousands;
  receivables: Thousands;
  inventory: Thousands;
  otherCurrentAssets: Thousands;
  totalCurrentAssets: Thousands;
  ppe: Thousands;
  otherAssets: Thousands;
  totalAssets: Thousands;
  payables: Thousands;
  accruedLiabilities: Thousands;
  deferredRevenue: Thousands;
  /** Debt due within 12 months. */
  shortTermDebt: Thousands;
  totalCurrentLiabilities: Thousands;
  longTermDebt: Thousands;
  otherLiabilities: Thousands;
  totalLiabilities: Thousands;
  paidInCapital: Thousands;
  retainedEarnings: Thousands;
  totalEquity: Thousands;
  totalLiabilitiesAndEquity: Thousands;
}

export interface CashFlowStatement {
  netIncome: Thousands;
  depreciation: Thousands;
  stockComp: Thousands;
  changeReceivables: Thousands;
  changeInventory: Thousands;
  changePayables: Thousands;
  changeAccrued: Thousands;
  changeDeferredRevenue: Thousands;
  cfo: Thousands;
  /** Negative (cash out). */
  capex: Thousands;
  cfi: Thousands;
  debtIssued: Thousands;
  /** Negative (cash out). */
  debtRepaid: Thousands;
  equityIssued: Thousands;
  /** Negative (cash out). */
  dividends: Thousands;
  cff: Thousands;
  netChangeInCash: Thousands;
  beginningCash: Thousands;
  endingCash: Thousands;
}

export type KpiUnit = "pct" | "thousands" | "count" | "ratio";

export interface Kpi {
  id: string;
  label: string;
  value: number;
  unit: KpiUnit;
}

export interface Quarter {
  /** e.g. "Q1 FY25" */
  label: string;
  fiscalYear: number;
  quarter: 1 | 2 | 3 | 4;
  income: IncomeStatement;
  balance: BalanceSheet;
  cashFlow: CashFlowStatement;
  kpis: Kpi[];
}

export type CompanyArchetype = "saas-burner" | "seasonal-retailer" | "levered-industrial";

export interface Company {
  id: string;
  name: string;
  /** SAMPLE ticker with the repo's ".S" suffix. */
  ticker: string;
  archetype: CompanyArchetype;
  sector: string;
  description: string;
  /** Plain-language story the numbers are built to show (asserted in tests). */
  story: string[];
  quarters: Quarter[];
  /** Optional debt covenant (levered names). */
  covenant?: { maxNetLeverage: number; minCash: Thousands };
}

/** Guidance range for a metric, e.g. next-quarter revenue. */
export interface GuidanceRange {
  low: number;
  high: number;
}

export interface Consensus {
  eps: number;
  revenue: Thousands;
}

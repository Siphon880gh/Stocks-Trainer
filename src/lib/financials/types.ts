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
  /** Banks only (FE8.M1): investment securities. Counted in total assets. */
  securities?: Thousands;
  /** Banks only: gross loans minus the allowance for credit losses. Counted in total assets. */
  loansNet?: Thousands;
  /** Banks only: customer deposits. Counted in total liabilities. */
  deposits?: Thousands;
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
  /** Banks only (FE8.M1): provision for credit losses added back in CFO (a non-cash expense). */
  provisionAddback?: Thousands;
  /** Banks only: net new loans made (investing; negative when the loan book grows). */
  changeLoans?: Thousands;
  /** Banks only: securities bought (negative) or run off / sold (positive). */
  changeSecurities?: Thousands;
  /** Banks only: deposits taken in (financing; positive when deposits grow). */
  changeDeposits?: Thousands;
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
  /** Banks only (FE8.M1): the bank-format lines behind the generic statements. */
  bank?: BankLines;
}

/**
 * Bank-format income statement and loan book for one quarter (FE8.M1). The generic statements map onto it:
 * revenue = net interest income + non-interest income, SG&A = non-interest expense, operating income = PPNR,
 * other income = −provision, and the generic interest-expense line is 0 (a bank's interest cost sits inside NII).
 */
export interface BankLines {
  interestIncome: Thousands;
  /** Interest paid on deposits and borrowings. */
  interestExpense: Thousands;
  netInterestIncome: Thousands;
  provision: Thousands;
  nonInterestIncome: Thousands;
  nonInterestExpense: Thousands;
  /** Pre-provision net revenue = NII + non-interest income − non-interest expense. */
  ppnr: Thousands;
  grossLoans: Thousands;
  /** Allowance for credit losses (reserve held against the loan book). */
  allowance: Thousands;
  netChargeOffs: Thousands;
  nonperformingLoans: Thousands;
  securities: Thousands;
  deposits: Thousands;
  borrowings: Thousands;
  /** Average of opening and closing earning assets (cash + securities + gross loans). */
  averageEarningAssets: Thousands;
  /** SIMPLIFIED risk-weighted assets: 100% of gross loans + 20% of securities. */
  riskWeightedAssets: Thousands;
}

export type CompanyArchetype = "saas-burner" | "seasonal-retailer" | "levered-industrial" | "regional-bank" | "clinical-biotech";

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
  /** "bank" switches the statement reader to bank-format rows (FE8.M1). Default: standard. */
  statementStyle?: "standard" | "bank";
  /** What the "revenue" line and revenue guidance mean for this company, e.g. "net revenue (NII + fees)". Default "revenue". */
  revenueLabel?: string;
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

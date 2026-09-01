/**
 * Structured company snapshot cards for quizzes/cases (E4.M2).
 * SAMPLE / STYLIZED numbers — not live filings.
 */

export interface IncomeStatementHighlight {
  revenue: number;
  netIncome: number;
  /** Net income / revenue as percent */
  netMarginPct: number;
}

export interface BalanceSheetHighlight {
  assets: number;
  liabilities: number;
  equity: number;
}

export interface CashFlowHighlight {
  operatingCashFlow: number;
  freeCashFlow: number;
}

export interface FinancialSnapshot {
  id: string;
  label: string;
  symbol: string;
  notes: string;
  incomeStatement: IncomeStatementHighlight;
  balanceSheet: BalanceSheetHighlight;
  cashFlow: CashFlowHighlight;
  /** Price used for simple P/E teaching */
  price: number;
  /** Trailing earnings (same units as price context) */
  earnings: number;
}

export const FINANCIAL_SNAPSHOTS: FinancialSnapshot[] = [
  {
    id: "snap-mega-tech",
    label: "Big tech company",
    symbol: "AAPL.S",
    notes: "Practice numbers for teaching. Not a live filing.",
    incomeStatement: {
      revenue: 380_000,
      netIncome: 95_000,
      netMarginPct: 25,
    },
    balanceSheet: {
      assets: 350_000,
      liabilities: 280_000,
      equity: 70_000,
    },
    cashFlow: {
      operatingCashFlow: 110_000,
      freeCashFlow: 90_000,
    },
    price: 184.1,
    earnings: 6.2,
  },
  {
    id: "snap-cyclical",
    label: "Energy company",
    symbol: "XOM.S",
    notes: "Practice snapshot: thinner margins and heavier assets than the tech example.",
    incomeStatement: {
      revenue: 210_000,
      netIncome: 18_000,
      netMarginPct: 8.6,
    },
    balanceSheet: {
      assets: 420_000,
      liabilities: 240_000,
      equity: 180_000,
    },
    cashFlow: {
      operatingCashFlow: 40_000,
      freeCashFlow: 22_000,
    },
    price: 111.0,
    earnings: 8.5,
  },
];

export function getFinancialSnapshot(id: string): FinancialSnapshot | undefined {
  return FINANCIAL_SNAPSHOTS.find((s) => s.id === id);
}

export function simplePE(snapshot: FinancialSnapshot): number {
  if (snapshot.earnings <= 0) return 0;
  return snapshot.price / snapshot.earnings;
}

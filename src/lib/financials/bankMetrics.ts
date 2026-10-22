/**
 * Bank metrics (FE8.M1). Pure functions over the bank-format lines. Ratios are fractions (0.034 = 3.4%).
 * Annualized figures multiply a quarter by 4. CET1 is SIMPLIFIED (see bankBuilder.ts); real CET1 has many more adjustments.
 * SAMPLE / STYLIZED, not advice.
 */
import { simplifiedCet1 } from "./bankBuilder";
import type { Company, Quarter } from "./types";

const div = (a: number, b: number): number | null => (b === 0 ? null : a / b);

export interface BankQuarterMetrics {
  label: string;
  /** Annualized NII ÷ average earning assets. */
  netInterestMargin: number | null;
  /** Non-interest expense ÷ net revenue (lower is better; ~55–65% is typical). */
  efficiencyRatio: number | null;
  /** Annualized net charge-offs ÷ gross loans. */
  netChargeOffRatio: number | null;
  /** Provision ÷ net charge-offs: above 1 = building reserves, below 1 = releasing. */
  provisionToChargeOffs: number | null;
  /** Allowance ÷ gross loans. */
  allowanceToLoans: number | null;
  nonperformingRatio: number | null;
  /** Gross loans ÷ deposits. */
  loanToDeposit: number | null;
  /** Annualized net income ÷ ending equity (simplified, not averaged). */
  returnOnEquity: number | null;
  returnOnAssets: number | null;
  bookValuePerShare: number | null;
  tangibleBookValuePerShare: number | null;
  cet1: number | null;
  ppnr: number;
  netInterestIncome: number;
  /** NII change vs the prior quarter; null for the first quarter. */
  niiQoQ: number | null;
}

export function bankQuarterMetrics(c: Company, index: number): BankQuarterMetrics | null {
  const q: Quarter | undefined = c.quarters[index];
  const b = q?.bank;
  if (!q || !b) return null;
  const prev = index > 0 ? c.quarters[index - 1]?.bank : undefined;
  const bs = q.balance;
  const shares = q.income.sharesBasic;
  return {
    label: q.label,
    netInterestMargin: div(b.netInterestIncome * 4, b.averageEarningAssets),
    efficiencyRatio: div(b.nonInterestExpense, q.income.revenue),
    netChargeOffRatio: div(b.netChargeOffs * 4, b.grossLoans),
    provisionToChargeOffs: div(b.provision, b.netChargeOffs),
    allowanceToLoans: div(b.allowance, b.grossLoans),
    nonperformingRatio: div(b.nonperformingLoans, b.grossLoans),
    loanToDeposit: div(b.grossLoans, b.deposits),
    returnOnEquity: div(q.income.netIncome * 4, bs.totalEquity),
    returnOnAssets: div(q.income.netIncome * 4, bs.totalAssets),
    bookValuePerShare: div(bs.totalEquity, shares),
    tangibleBookValuePerShare: div(bs.totalEquity - bs.otherAssets, shares),
    cet1: b.riskWeightedAssets === 0 ? null : simplifiedCet1(bs, b.riskWeightedAssets),
    ppnr: b.ppnr,
    netInterestIncome: b.netInterestIncome,
    niiQoQ: prev ? div(b.netInterestIncome - prev.netInterestIncome, prev.netInterestIncome) : null,
  };
}

export const isBank = (c: Company) => c.statementStyle === "bank";

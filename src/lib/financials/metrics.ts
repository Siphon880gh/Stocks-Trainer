/**
 * Derived metrics for the fictional companies (FE0.M3). Pure functions.
 * Ratios are returned as fractions (0.25 = 25%). `null` means not meaningful (n/m): divide by zero,
 * not enough history, or a ratio whose sign would mislead (e.g. leverage on negative EBITDA).
 */
import type { BalanceSheet, Company, IncomeStatement, Quarter } from "./types";

const DAYS_IN_QUARTER = 91;

const safeDiv = (a: number, b: number): number | null => (b === 0 ? null : a / b);

export const grossMargin = (is: IncomeStatement) => safeDiv(is.grossProfit, is.revenue);
export const operatingMargin = (is: IncomeStatement) => safeDiv(is.operatingIncome, is.revenue);
export const netMargin = (is: IncomeStatement) => safeDiv(is.netIncome, is.revenue);

export const freeCashFlow = (q: Quarter) => q.cashFlow.cfo + q.cashFlow.capex;
export const ebitda = (q: Quarter) => q.income.operatingIncome + q.cashFlow.depreciation;
export const totalDebt = (bs: BalanceSheet) => bs.shortTermDebt + bs.longTermDebt;
export const netDebt = (bs: BalanceSheet) => totalDebt(bs) - bs.cash;
export const currentRatio = (bs: BalanceSheet) => safeDiv(bs.totalCurrentAssets, bs.totalCurrentLiabilities);

export const daysSalesOutstanding = (q: Quarter) => safeDiv(q.balance.receivables * DAYS_IN_QUARTER, q.income.revenue);
export const daysInventory = (q: Quarter) => (q.balance.inventory === 0 ? null : safeDiv(q.balance.inventory * DAYS_IN_QUARTER, q.income.cogs));
export const daysPayables = (q: Quarter) => safeDiv(q.balance.payables * DAYS_IN_QUARTER, q.income.cogs);

/** DSO + DIO - DPO. Inventory-free businesses count DIO as 0. */
export function cashConversionCycle(q: Quarter): number | null {
  const dso = daysSalesOutstanding(q);
  const dpo = daysPayables(q);
  if (dso === null || dpo === null) return null;
  return dso + (daysInventory(q) ?? 0) - dpo;
}

/** Operating income ÷ interest expense. null when there is no interest. */
export const interestCoverage = (is: IncomeStatement) => (is.interestExpense === 0 ? null : is.operatingIncome / is.interestExpense);

/** Average monthly cash burn from free cash flow; 0 when FCF is positive. */
export function monthlyBurn(q: Quarter): number {
  const fcf = freeCashFlow(q);
  return fcf < 0 ? -fcf / 3 : 0;
}

/** Months of cash left at this quarter's burn. null when the company is not burning. */
export function runwayMonths(q: Quarter): number | null {
  const burn = monthlyBurn(q);
  return burn === 0 ? null : q.balance.cash / burn;
}

function growth(cur: number, prior: number): number | null {
  return prior === 0 ? null : (cur - prior) / Math.abs(prior);
}

/** Quarter-over-quarter growth of an income statement line. null for the first quarter. */
export function growthQoQ(c: Company, index: number, field: keyof IncomeStatement = "revenue"): number | null {
  if (index < 1) return null;
  return growth(c.quarters[index].income[field], c.quarters[index - 1].income[field]);
}

/** Year-over-year growth (same quarter last year). null for the first four quarters. */
export function growthYoY(c: Company, index: number, field: keyof IncomeStatement = "revenue"): number | null {
  if (index < 4) return null;
  return growth(c.quarters[index].income[field], c.quarters[index - 4].income[field]);
}

/** Trailing-twelve-month sum of a per-quarter value. null with fewer than 4 quarters. */
export function ttm(c: Company, index: number, fn: (q: Quarter) => number): number | null {
  if (index < 3) return null;
  let sum = 0;
  for (let i = index - 3; i <= index; i++) sum += fn(c.quarters[i]);
  return sum;
}

/** Net debt ÷ TTM EBITDA. null without 4 quarters of history or when TTM EBITDA ≤ 0. */
export function netLeverage(c: Company, index: number): number | null {
  const e = ttm(c, index, ebitda);
  if (e === null || e <= 0) return null;
  return netDebt(c.quarters[index].balance) / e;
}

export interface QuarterMetrics {
  label: string;
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
  revenueQoQ: number | null;
  revenueYoY: number | null;
  freeCashFlow: number;
  ebitda: number;
  netDebt: number;
  currentRatio: number | null;
  dso: number | null;
  dio: number | null;
  dpo: number | null;
  cashConversionCycle: number | null;
  interestCoverage: number | null;
  monthlyBurn: number;
  runwayMonths: number | null;
  netLeverage: number | null;
}

export function quarterMetrics(c: Company, index: number): QuarterMetrics {
  const q = c.quarters[index];
  const base = standardQuarterMetrics(c, index, q);
  if (c.statementStyle !== "bank") return base;
  // FE8.M1: industrial-company ratios do not apply to a bank (no COGS, no inventory, loans are its product,
  // deposits are its funding). Show them as n/m; banks use bankQuarterMetrics instead.
  return {
    ...base,
    grossMargin: null, dso: null, dio: null, dpo: null, cashConversionCycle: null, currentRatio: null,
    interestCoverage: null, netLeverage: null, runwayMonths: null, monthlyBurn: 0,
  };
}

function standardQuarterMetrics(c: Company, index: number, q: Quarter): QuarterMetrics {
  return {
    label: q.label,
    grossMargin: grossMargin(q.income),
    operatingMargin: operatingMargin(q.income),
    netMargin: netMargin(q.income),
    revenueQoQ: growthQoQ(c, index),
    revenueYoY: growthYoY(c, index),
    freeCashFlow: freeCashFlow(q),
    ebitda: ebitda(q),
    netDebt: netDebt(q.balance),
    currentRatio: currentRatio(q.balance),
    dso: daysSalesOutstanding(q),
    dio: daysInventory(q),
    dpo: daysPayables(q),
    cashConversionCycle: cashConversionCycle(q),
    interestCoverage: interestCoverage(q.income),
    monthlyBurn: monthlyBurn(q),
    runwayMonths: runwayMonths(q),
    netLeverage: netLeverage(c, index),
  };
}

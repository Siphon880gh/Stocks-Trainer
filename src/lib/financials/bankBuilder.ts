/**
 * Bank statement generator (FE8.M1). A bank earns a SPREAD: interest on loans and securities minus interest on
 * deposits and borrowings. Generated from drivers so every line ties, like companies.ts.
 * SAMPLE / STYLIZED: an invented bank and simulated numbers, for practice only. Not a live filing, not advice.
 * Money is in whole thousands of dollars; share counts in thousands.
 */
import { eps } from "./ties";
import type { BalanceSheet, BankLines, CashFlowStatement, IncomeStatement, Kpi, Quarter } from "./types";

export interface BankOpening {
  cash: number;
  securities: number;
  grossLoans: number;
  allowance: number;
  otherCurrentAssets: number;
  ppe: number;
  /** Goodwill and intangibles (deducted from CET1 capital). */
  otherAssets: number;
  deposits: number;
  borrowings: number;
  accruedLiabilities: number;
  otherLiabilities: number;
  paidInCapital: number;
  sharesBasic: number;
}

/** Per-quarter assumptions. Rates are annual fractions (0.056 = 5.6%). Money in thousands. */
export interface BankDrivers {
  loanYield: number;
  securitiesYield: number;
  cashYield: number;
  /** Average rate paid on deposits. */
  depositCost: number;
  borrowingRate: number;
  /** Net new lending this quarter (cash out; gross loans also fall by charge-offs). */
  newLoans: number;
  /** Securities bought (+) or run off (−). */
  securitiesChange: number;
  depositChange: number;
  borrowingChange: number;
  nonInterestIncome: number;
  /** Includes depreciation and stock comp. */
  nonInterestExpense: number;
  provision: number;
  netChargeOffs: number;
  /** Non-performing loans as a fraction of gross loans at quarter end. */
  nplRatio: number;
  depreciation: number;
  stockComp: number;
  capex: number;
  taxRate: number;
  dividendsPerShare: number;
  dilutiveShares: number;
}

const r = Math.round;
const pct2 = (x: number) => Math.round(x * 10000) / 100;

function label(index: number, firstFiscalYear: number) {
  const quarter = ((index % 4) + 1) as 1 | 2 | 3 | 4;
  const fiscalYear = firstFiscalYear + Math.floor(index / 4);
  return { label: `Q${quarter} FY${fiscalYear}`, fiscalYear, quarter };
}

function bankBalance(p: {
  cash: number; securities: number; loansNet: number; otherCurrentAssets: number; ppe: number; otherAssets: number;
  deposits: number; borrowings: number; accruedLiabilities: number; otherLiabilities: number; paidInCapital: number; retainedEarnings: number;
}): BalanceSheet {
  const totalCurrentAssets = p.cash + p.otherCurrentAssets;
  const totalAssets = totalCurrentAssets + p.ppe + p.otherAssets + p.securities + p.loansNet;
  const totalCurrentLiabilities = p.accruedLiabilities;
  const totalLiabilities = totalCurrentLiabilities + p.borrowings + p.otherLiabilities + p.deposits;
  const totalEquity = p.paidInCapital + p.retainedEarnings;
  return {
    cash: p.cash, receivables: 0, inventory: 0, otherCurrentAssets: p.otherCurrentAssets, totalCurrentAssets,
    ppe: p.ppe, otherAssets: p.otherAssets, totalAssets,
    payables: 0, accruedLiabilities: p.accruedLiabilities, deferredRevenue: 0, shortTermDebt: 0, totalCurrentLiabilities,
    longTermDebt: p.borrowings, otherLiabilities: p.otherLiabilities, totalLiabilities,
    paidInCapital: p.paidInCapital, retainedEarnings: p.retainedEarnings, totalEquity,
    totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
    securities: p.securities, loansNet: p.loansNet, deposits: p.deposits,
  };
}

/** SIMPLIFIED CET1 ratio: (equity − goodwill & intangibles) ÷ (100% of loans + 20% of securities). */
export function simplifiedCet1(bs: BalanceSheet, rwa: number): number {
  return (bs.totalEquity - bs.otherAssets) / rwa;
}

/** Roll a bank forward. Retained earnings are the plug at the opening only. */
export function buildBankQuarters(opening: BankOpening, drivers: BankDrivers[], firstFiscalYear = 25): Quarter[] {
  const loansNet0 = opening.grossLoans - opening.allowance;
  const assets0 = opening.cash + opening.securities + loansNet0 + opening.otherCurrentAssets + opening.ppe + opening.otherAssets;
  const liabs0 = opening.deposits + opening.borrowings + opening.accruedLiabilities + opening.otherLiabilities;
  let prev = bankBalance({
    cash: opening.cash, securities: opening.securities, loansNet: loansNet0, otherCurrentAssets: opening.otherCurrentAssets,
    ppe: opening.ppe, otherAssets: opening.otherAssets, deposits: opening.deposits, borrowings: opening.borrowings,
    accruedLiabilities: opening.accruedLiabilities, otherLiabilities: opening.otherLiabilities, paidInCapital: opening.paidInCapital,
    retainedEarnings: assets0 - liabs0 - opening.paidInCapital,
  });
  let grossLoans = opening.grossLoans;
  let allowance = opening.allowance;
  const shares = opening.sharesBasic;

  return drivers.map((d, i) => {
    const prevGross = grossLoans;
    const prevEarning = prev.cash + (prev.securities ?? 0) + prevGross;
    const interestIncome = r((prevGross * d.loanYield + (prev.securities ?? 0) * d.securitiesYield + prev.cash * d.cashYield) / 4);
    const interestExpense = r(((prev.deposits ?? 0) * d.depositCost + prev.longTermDebt * d.borrowingRate) / 4);
    const netInterestIncome = interestIncome - interestExpense;
    const revenue = netInterestIncome + d.nonInterestIncome;
    const ppnr = revenue - d.nonInterestExpense;
    const pretaxIncome = ppnr - d.provision;
    const taxExpense = pretaxIncome > 0 ? r(pretaxIncome * d.taxRate) : 0;
    const netIncome = pretaxIncome - taxExpense;
    const sharesDiluted = netIncome > 0 ? shares + d.dilutiveShares : shares;
    const income: IncomeStatement = {
      revenue, cogs: 0, grossProfit: revenue, rnd: 0, sga: d.nonInterestExpense, operatingExpenses: d.nonInterestExpense,
      operatingIncome: ppnr, interestExpense: 0, otherIncome: -d.provision, pretaxIncome, taxExpense, netIncome,
      sharesBasic: shares, sharesDiluted, epsBasic: eps(netIncome, shares), epsDiluted: eps(netIncome, sharesDiluted),
    };

    grossLoans = prevGross + d.newLoans - d.netChargeOffs;
    allowance = allowance + d.provision - d.netChargeOffs;
    const loansNet = grossLoans - allowance;
    const securities = (prev.securities ?? 0) + d.securitiesChange;
    const deposits = (prev.deposits ?? 0) + d.depositChange;
    const borrowings = prev.longTermDebt + d.borrowingChange;
    const dividends = -r(d.dividendsPerShare * shares);

    const cfo = netIncome + d.depreciation + d.stockComp + d.provision;
    const capex = -d.capex;
    const changeLoans = -d.newLoans;
    const changeSecurities = -d.securitiesChange;
    const cfi = capex + changeLoans + changeSecurities;
    const debtIssued = Math.max(0, d.borrowingChange);
    const debtRepaid = Math.min(0, d.borrowingChange);
    const cff = debtIssued + debtRepaid + dividends + d.depositChange;
    const netChangeInCash = cfo + cfi + cff;
    const cashFlow: CashFlowStatement = {
      netIncome, depreciation: d.depreciation, stockComp: d.stockComp, changeReceivables: 0, changeInventory: 0, changePayables: 0,
      changeAccrued: 0, changeDeferredRevenue: 0, cfo, capex, cfi, debtIssued, debtRepaid, equityIssued: 0, dividends, cff,
      netChangeInCash, beginningCash: prev.cash, endingCash: prev.cash + netChangeInCash,
      provisionAddback: d.provision, changeLoans, changeSecurities, changeDeposits: d.depositChange,
    };

    const balance = bankBalance({
      cash: cashFlow.endingCash, securities, loansNet, otherCurrentAssets: prev.otherCurrentAssets, ppe: prev.ppe + d.capex - d.depreciation,
      otherAssets: prev.otherAssets, deposits, borrowings, accruedLiabilities: prev.accruedLiabilities, otherLiabilities: prev.otherLiabilities,
      paidInCapital: prev.paidInCapital + d.stockComp, retainedEarnings: prev.retainedEarnings + netIncome + dividends,
    });
    const earning = balance.cash + securities + grossLoans;
    const averageEarningAssets = r((prevEarning + earning) / 2);
    const riskWeightedAssets = r(grossLoans + 0.2 * securities);
    const bank: BankLines = {
      interestIncome, interestExpense, netInterestIncome, provision: d.provision, nonInterestIncome: d.nonInterestIncome,
      nonInterestExpense: d.nonInterestExpense, ppnr, grossLoans, allowance, netChargeOffs: d.netChargeOffs,
      nonperformingLoans: r(grossLoans * d.nplRatio), securities, deposits, borrowings, averageEarningAssets, riskWeightedAssets,
    };
    const kpis: Kpi[] = [
      { id: "nim", label: "Net interest margin", value: pct2((netInterestIncome * 4) / averageEarningAssets), unit: "pct" },
      { id: "deposit-cost", label: "Cost of deposits", value: pct2(d.depositCost), unit: "pct" },
      { id: "nco-ratio", label: "Net charge-offs (annualized)", value: pct2((d.netChargeOffs * 4) / grossLoans), unit: "pct" },
      { id: "cet1", label: "CET1 ratio (simplified)", value: pct2(simplifiedCet1(balance, riskWeightedAssets)), unit: "pct" },
    ];
    prev = balance;
    return { ...label(i, firstFiscalYear), income, balance, cashFlow, kpis, bank };
  });
}

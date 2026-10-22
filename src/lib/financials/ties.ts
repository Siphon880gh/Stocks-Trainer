/** Tie-out checks: every function returns a list of violations ([] = ties out). Pure, no side effects. */
import type { BalanceSheet, CashFlowStatement, Company, IncomeStatement, Quarter } from "./types";

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** EPS in dollars from thousands of NI and thousands of shares, rounded to cents. */
export function eps(netIncome: number, shares: number): number {
  return shares > 0 ? round2(netIncome / shares) : 0;
}

export function incomeStatementViolations(is: IncomeStatement): string[] {
  const v: string[] = [];
  if (is.grossProfit !== is.revenue - is.cogs) v.push("IS: grossProfit != revenue - cogs");
  if (is.operatingExpenses !== is.rnd + is.sga) v.push("IS: operatingExpenses != rnd + sga");
  if (is.operatingIncome !== is.grossProfit - is.operatingExpenses) v.push("IS: operatingIncome != grossProfit - operatingExpenses");
  if (is.pretaxIncome !== is.operatingIncome - is.interestExpense + is.otherIncome) v.push("IS: pretaxIncome != operatingIncome - interest + other");
  if (is.netIncome !== is.pretaxIncome - is.taxExpense) v.push("IS: netIncome != pretaxIncome - tax");
  if (is.epsBasic !== eps(is.netIncome, is.sharesBasic)) v.push("IS: epsBasic != netIncome / sharesBasic");
  if (is.epsDiluted !== eps(is.netIncome, is.sharesDiluted)) v.push("IS: epsDiluted != netIncome / sharesDiluted");
  if (is.sharesDiluted < is.sharesBasic) v.push("IS: sharesDiluted < sharesBasic");
  return v;
}

export function balanceSheetViolations(bs: BalanceSheet): string[] {
  const v: string[] = [];
  if (bs.totalCurrentAssets !== bs.cash + bs.receivables + bs.inventory + bs.otherCurrentAssets) v.push("BS: totalCurrentAssets mismatch");
  // Bank lines (securities, net loans, deposits) are optional and count as 0 for other companies.
  if (bs.totalAssets !== bs.totalCurrentAssets + bs.ppe + bs.otherAssets + (bs.securities ?? 0) + (bs.loansNet ?? 0)) v.push("BS: totalAssets mismatch");
  if (bs.totalCurrentLiabilities !== bs.payables + bs.accruedLiabilities + bs.deferredRevenue + bs.shortTermDebt) v.push("BS: totalCurrentLiabilities mismatch");
  if (bs.totalLiabilities !== bs.totalCurrentLiabilities + bs.longTermDebt + bs.otherLiabilities + (bs.deposits ?? 0)) v.push("BS: totalLiabilities mismatch");
  if (bs.totalEquity !== bs.paidInCapital + bs.retainedEarnings) v.push("BS: totalEquity mismatch");
  if (bs.totalLiabilitiesAndEquity !== bs.totalLiabilities + bs.totalEquity) v.push("BS: totalLiabilitiesAndEquity mismatch");
  if (bs.totalAssets !== bs.totalLiabilitiesAndEquity) v.push("BS: assets != liabilities + equity");
  return v;
}

export function cashFlowViolations(cf: CashFlowStatement): string[] {
  const v: string[] = [];
  const cfo =
    cf.netIncome + cf.depreciation + cf.stockComp + cf.changeReceivables + cf.changeInventory + cf.changePayables + cf.changeAccrued + cf.changeDeferredRevenue +
    (cf.provisionAddback ?? 0);
  if (cf.cfo !== cfo) v.push("CF: cfo != sum of operating lines");
  if (cf.cfi !== cf.capex + (cf.changeLoans ?? 0) + (cf.changeSecurities ?? 0)) v.push("CF: cfi != capex (+ bank loan / securities lines)");
  if (cf.cff !== cf.debtIssued + cf.debtRepaid + cf.equityIssued + cf.dividends + (cf.changeDeposits ?? 0)) v.push("CF: cff != sum of financing lines");
  if (cf.netChangeInCash !== cf.cfo + cf.cfi + cf.cff) v.push("CF: cfo + cfi + cff != net change in cash");
  if (cf.endingCash !== cf.beginningCash + cf.netChangeInCash) v.push("CF: ending cash != beginning + net change");
  if (cf.capex > 0 || cf.debtRepaid > 0 || cf.dividends > 0) v.push("CF: outflow line stored as positive");
  return v;
}

/** Cross-statement ties inside one quarter. */
export function quarterViolations(q: Quarter): string[] {
  const v = [
    ...incomeStatementViolations(q.income).map((s) => `${q.label} ${s}`),
    ...balanceSheetViolations(q.balance).map((s) => `${q.label} ${s}`),
    ...cashFlowViolations(q.cashFlow).map((s) => `${q.label} ${s}`),
  ];
  if (q.cashFlow.netIncome !== q.income.netIncome) v.push(`${q.label} CF: net income != IS net income`);
  if (q.cashFlow.endingCash !== q.balance.cash) v.push(`${q.label} CF: ending cash != BS cash`);
  return v;
}

/** Ties between consecutive quarters (prev → cur). */
export function chainViolations(prev: Quarter, cur: Quarter): string[] {
  const v: string[] = [];
  const p = prev.balance;
  const c = cur.balance;
  const cf = cur.cashFlow;
  if (cf.beginningCash !== p.cash) v.push(`${cur.label} chain: beginning cash != prior BS cash`);
  if (c.retainedEarnings !== p.retainedEarnings + cur.income.netIncome + cf.dividends)
    v.push(`${cur.label} chain: retained earnings != prior + NI - dividends`);
  if (cf.changeReceivables !== -(c.receivables - p.receivables)) v.push(`${cur.label} chain: change in receivables`);
  if (cf.changeInventory !== -(c.inventory - p.inventory)) v.push(`${cur.label} chain: change in inventory`);
  if (cf.changePayables !== c.payables - p.payables) v.push(`${cur.label} chain: change in payables`);
  if (cf.changeAccrued !== c.accruedLiabilities - p.accruedLiabilities) v.push(`${cur.label} chain: change in accrued`);
  if (cf.changeDeferredRevenue !== c.deferredRevenue - p.deferredRevenue) v.push(`${cur.label} chain: change in deferred revenue`);
  if (c.ppe !== p.ppe - cf.capex - cf.depreciation) v.push(`${cur.label} chain: PP&E != prior + capex - D&A`);
  const debt = (b: typeof p) => b.shortTermDebt + b.longTermDebt;
  if (debt(c) !== debt(p) + cf.debtIssued + cf.debtRepaid) v.push(`${cur.label} chain: debt != prior + issued - repaid`);
  if (c.paidInCapital !== p.paidInCapital + cf.equityIssued + cf.stockComp) v.push(`${cur.label} chain: paid-in capital != prior + issued + SBC`);
  // Lines with no cash-flow line must not move (otherwise the cash flow statement would not explain the BS).
  if (c.otherCurrentAssets !== p.otherCurrentAssets || c.otherAssets !== p.otherAssets || c.otherLiabilities !== p.otherLiabilities)
    v.push(`${cur.label} chain: an "other" line moved without a cash-flow line`);
  // Bank lines (FE8.M1): each balance-sheet move must be explained by its cash-flow line.
  if ((cf.changeSecurities ?? 0) !== -((c.securities ?? 0) - (p.securities ?? 0))) v.push(`${cur.label} chain: change in securities`);
  if ((cf.changeLoans ?? 0) !== -((c.loansNet ?? 0) - (p.loansNet ?? 0)) - (cf.provisionAddback ?? 0))
    v.push(`${cur.label} chain: net loans != prior + new lending − provision`);
  if ((cf.changeDeposits ?? 0) !== (c.deposits ?? 0) - (p.deposits ?? 0)) v.push(`${cur.label} chain: change in deposits`);
  if (cur.bank && prev.bank && cur.bank.allowance !== prev.bank.allowance + cur.bank.provision - cur.bank.netChargeOffs)
    v.push(`${cur.label} chain: allowance != prior + provision − net charge-offs`);
  return v;
}

/** Bank-format lines vs the generic statements (FE8.M1). [] for non-banks. */
export function bankViolations(q: Quarter): string[] {
  const b = q.bank;
  if (!b) return [];
  const v: string[] = [];
  const is = q.income;
  const bs = q.balance;
  if (b.netInterestIncome !== b.interestIncome - b.interestExpense) v.push(`${q.label} bank: NII != interest income − interest expense`);
  if (b.ppnr !== b.netInterestIncome + b.nonInterestIncome - b.nonInterestExpense) v.push(`${q.label} bank: PPNR mismatch`);
  if (is.revenue !== b.netInterestIncome + b.nonInterestIncome) v.push(`${q.label} bank: revenue != NII + non-interest income`);
  if (is.cogs !== 0 || is.rnd !== 0) v.push(`${q.label} bank: a bank has no COGS or R&D line`);
  if (is.sga !== b.nonInterestExpense) v.push(`${q.label} bank: SG&A != non-interest expense`);
  if (is.operatingIncome !== b.ppnr) v.push(`${q.label} bank: operating income != PPNR`);
  if (is.interestExpense !== 0) v.push(`${q.label} bank: interest cost must sit inside NII, not below operating income`);
  if (is.otherIncome !== -b.provision) v.push(`${q.label} bank: other income != −provision`);
  if (bs.loansNet !== b.grossLoans - b.allowance) v.push(`${q.label} bank: net loans != gross loans − allowance`);
  if (bs.securities !== b.securities || bs.deposits !== b.deposits) v.push(`${q.label} bank: securities / deposits differ from the balance sheet`);
  if (bs.shortTermDebt + bs.longTermDebt !== b.borrowings) v.push(`${q.label} bank: borrowings != balance-sheet debt`);
  if (q.cashFlow.provisionAddback !== b.provision) v.push(`${q.label} bank: CFO provision add-back != provision`);
  if (b.allowance <= 0 || b.provision < 0 || b.netChargeOffs < 0) v.push(`${q.label} bank: allowance / provision / charge-offs must be non-negative`);
  return v;
}

export function companyViolations(c: Company): string[] {
  const v: string[] = [];
  c.quarters.forEach((q, i) => {
    v.push(...quarterViolations(q).map((s) => `${c.id} ${s}`));
    v.push(...bankViolations(q).map((s) => `${c.id} ${s}`));
    if (i > 0) v.push(...chainViolations(c.quarters[i - 1], q).map((s) => `${c.id} ${s}`));
  });
  return v;
}

/** Row builders for the three statements + metrics (pure; reused by tables, quizzes and tests). */
import { bankQuarterMetrics } from "../../lib/financials/bankMetrics";
import { quarterMetrics } from "../../lib/financials/metrics";
import type { Company, Quarter } from "../../lib/financials/types";
import type { StatementRow } from "./StatementTable";

const col = (qs: Quarter[], f: (q: Quarter) => number | null) => qs.map(f);

export function incomeRows(qs: Quarter[]): StatementRow[] {
  if (qs.length > 0 && qs.every((q) => q.bank)) return bankIncomeRows(qs);
  const hasRnd = qs.some((q) => q.income.rnd !== 0);
  const rows: StatementRow[] = [
    { label: "Revenue", values: col(qs, (q) => q.income.revenue), kind: "subtotal" },
    { label: "Cost of goods sold", values: col(qs, (q) => -q.income.cogs), indent: true },
    { label: "Gross profit", values: col(qs, (q) => q.income.grossProfit), kind: "subtotal", termId: "gross-margin" },
  ];
  if (hasRnd) rows.push({ label: "Research & development", values: col(qs, (q) => -q.income.rnd), indent: true });
  rows.push(
    { label: "Selling, general & admin", values: col(qs, (q) => -q.income.sga), indent: true },
    { label: "Operating income", values: col(qs, (q) => q.income.operatingIncome), kind: "subtotal", termId: "operating-income" },
    { label: "Interest expense", values: col(qs, (q) => -q.income.interestExpense), indent: true },
    { label: "Other income", values: col(qs, (q) => q.income.otherIncome), indent: true },
    { label: "Pretax income", values: col(qs, (q) => q.income.pretaxIncome), kind: "subtotal" },
    { label: "Income tax", values: col(qs, (q) => -q.income.taxExpense), indent: true },
    { label: "Net income", values: col(qs, (q) => q.income.netIncome), kind: "total", termId: "net-margin" },
    { label: "Diluted shares (k)", values: col(qs, (q) => q.income.sharesDiluted), format: "count", indent: true, termId: "dilution" },
    { label: "Diluted EPS", values: col(qs, (q) => q.income.epsDiluted), format: "eps", kind: "subtotal", termId: "eps" },
  );
  return rows;
}

export function balanceRows(qs: Quarter[]): StatementRow[] {
  if (qs.length > 0 && qs.every((q) => q.bank)) return bankBalanceRows(qs);
  const b = (f: (bs: Quarter["balance"]) => number) => col(qs, (q) => f(q.balance));
  return [
    { label: "Assets", values: [], kind: "section" },
    { label: "Cash", values: b((x) => x.cash), indent: true },
    { label: "Accounts receivable", values: b((x) => x.receivables), indent: true, termId: "accounts-receivable" },
    { label: "Inventory", values: b((x) => x.inventory), indent: true, termId: "inventory-days" },
    { label: "Other current assets", values: b((x) => x.otherCurrentAssets), indent: true },
    { label: "Total current assets", values: b((x) => x.totalCurrentAssets), kind: "subtotal", termId: "working-capital" },
    { label: "Property, plant & equipment", values: b((x) => x.ppe), indent: true, termId: "capex" },
    { label: "Other assets", values: b((x) => x.otherAssets), indent: true },
    { label: "Total assets", values: b((x) => x.totalAssets), kind: "total" },
    { label: "Liabilities", values: [], kind: "section" },
    { label: "Accounts payable", values: b((x) => x.payables), indent: true, termId: "accounts-payable" },
    { label: "Accrued liabilities", values: b((x) => x.accruedLiabilities), indent: true },
    { label: "Deferred revenue", values: b((x) => x.deferredRevenue), indent: true, termId: "deferred-revenue" },
    { label: "Short-term debt", values: b((x) => x.shortTermDebt), indent: true },
    { label: "Total current liabilities", values: b((x) => x.totalCurrentLiabilities), kind: "subtotal" },
    { label: "Long-term debt", values: b((x) => x.longTermDebt), indent: true, termId: "net-debt" },
    { label: "Other liabilities", values: b((x) => x.otherLiabilities), indent: true },
    { label: "Total liabilities", values: b((x) => x.totalLiabilities), kind: "subtotal" },
    { label: "Equity", values: [], kind: "section" },
    { label: "Paid-in capital", values: b((x) => x.paidInCapital), indent: true },
    { label: "Retained earnings", values: b((x) => x.retainedEarnings), indent: true },
    { label: "Total equity", values: b((x) => x.totalEquity), kind: "subtotal" },
    { label: "Total liabilities + equity", values: b((x) => x.totalLiabilitiesAndEquity), kind: "total", termId: "balance-sheet" },
    {
      label: "Check: assets − (liabilities + equity)",
      values: b((x) => x.totalAssets - x.totalLiabilitiesAndEquity),
      kind: "check",
      tones: qs.map((q) => (q.balance.totalAssets === q.balance.totalLiabilitiesAndEquity ? "good" : "bad")),
    },
  ];
}

export function cashFlowRows(qs: Quarter[]): StatementRow[] {
  if (qs.length > 0 && qs.every((q) => q.bank)) return bankCashFlowRows(qs);
  const c = (f: (cf: Quarter["cashFlow"]) => number) => col(qs, (q) => f(q.cashFlow));
  const hasInventory = qs.some((q) => q.cashFlow.changeInventory !== 0);
  const rows: StatementRow[] = [
    { label: "Operating", values: [], kind: "section" },
    { label: "Net income", values: c((x) => x.netIncome), indent: true },
    { label: "Depreciation & amortization", values: c((x) => x.depreciation), indent: true, termId: "ebitda" },
    { label: "Stock-based compensation", values: c((x) => x.stockComp), indent: true, termId: "stock-based-comp" },
    { label: "Change in receivables", values: c((x) => x.changeReceivables), indent: true, termId: "accounts-receivable" },
  ];
  if (hasInventory) rows.push({ label: "Change in inventory", values: c((x) => x.changeInventory), indent: true, termId: "inventory-days" });
  rows.push(
    { label: "Change in payables", values: c((x) => x.changePayables), indent: true, termId: "accounts-payable" },
    { label: "Change in accrued", values: c((x) => x.changeAccrued), indent: true },
    { label: "Change in deferred revenue", values: c((x) => x.changeDeferredRevenue), indent: true, termId: "deferred-revenue" },
    { label: "Cash from operations", values: c((x) => x.cfo), kind: "subtotal", termId: "cash-flow-statement" },
    { label: "Investing", values: [], kind: "section" },
    { label: "Capital expenditures", values: c((x) => x.capex), indent: true, termId: "capex" },
    { label: "Cash from investing", values: c((x) => x.cfi), kind: "subtotal" },
    { label: "Financing", values: [], kind: "section" },
    { label: "Debt issued", values: c((x) => x.debtIssued), indent: true },
    { label: "Debt repaid", values: c((x) => x.debtRepaid), indent: true },
    { label: "Shares issued", values: c((x) => x.equityIssued), indent: true, termId: "dilution" },
    { label: "Dividends", values: c((x) => x.dividends), indent: true },
    { label: "Cash from financing", values: c((x) => x.cff), kind: "subtotal" },
    { label: "Free cash flow (CFO + capex)", values: col(qs, (q) => q.cashFlow.cfo + q.cashFlow.capex), kind: "subtotal", termId: "free-cash-flow" },
    { label: "Cash bridge", values: [], kind: "section" },
    { label: "Beginning cash", values: c((x) => x.beginningCash), indent: true },
    { label: "Net change in cash", values: c((x) => x.netChangeInCash), indent: true },
    { label: "Ending cash", values: c((x) => x.endingCash), kind: "total" },
    {
      label: "Check: ending cash − balance sheet cash",
      values: col(qs, (q) => q.cashFlow.endingCash - q.balance.cash),
      kind: "check",
      tones: qs.map((q) => (q.cashFlow.endingCash === q.balance.cash ? "good" : "bad")),
    },
  );
  return rows;
}

export function metricRows(company: Company, startIndex: number, count: number): StatementRow[] {
  if (company.statementStyle === "bank") return bankMetricRows(company, startIndex, count);
  const ms = Array.from({ length: count }, (_, i) => quarterMetrics(company, startIndex + i));
  const m = <K extends keyof (typeof ms)[number]>(k: K) => ms.map((x) => x[k] as number | null);
  const hasDebt = company.quarters.some((q) => q.income.interestExpense > 0);
  const hasInventory = company.quarters.some((q) => q.balance.inventory > 0);
  const rows: StatementRow[] = [
    { label: "Growth & margins", values: [], kind: "section" },
    { label: "Revenue growth (QoQ)", values: m("revenueQoQ"), format: "pct" },
    { label: "Revenue growth (YoY)", values: m("revenueYoY"), format: "pct" },
    { label: "Gross margin", values: m("grossMargin"), format: "pct", termId: "gross-margin" },
    { label: "Operating margin", values: m("operatingMargin"), format: "pct", termId: "operating-income" },
    { label: "Net margin", values: m("netMargin"), format: "pct", termId: "net-margin" },
    { label: "Cash", values: [], kind: "section" },
    { label: "Free cash flow", values: m("freeCashFlow"), termId: "free-cash-flow" },
    { label: "EBITDA", values: m("ebitda"), termId: "ebitda" },
    { label: "Monthly burn", values: m("monthlyBurn"), termId: "cash-burn" },
    { label: "Runway", values: m("runwayMonths"), format: "months", termId: "cash-burn" },
    { label: "Working capital", values: [], kind: "section" },
    { label: "Current ratio", values: m("currentRatio"), format: "x", termId: "working-capital" },
    { label: "DSO", values: m("dso"), format: "days", termId: "accounts-receivable" },
  ];
  if (hasInventory) rows.push({ label: "DIO", values: m("dio"), format: "days", termId: "inventory-days" });
  rows.push(
    { label: "DPO", values: m("dpo"), format: "days", termId: "accounts-payable" },
    { label: "Cash conversion cycle", values: m("cashConversionCycle"), format: "days", termId: "working-capital" },
    { label: "Debt", values: [], kind: "section" },
    { label: "Net debt", values: m("netDebt"), termId: "net-debt" },
  );
  if (hasDebt)
    rows.push(
      { label: "Net leverage (net debt ÷ TTM EBITDA)", values: m("netLeverage"), format: "x", termId: "net-leverage" },
      { label: "Interest coverage", values: m("interestCoverage"), format: "x", termId: "interest-coverage" },
    );
  return rows;
}

export function kpiRows(qs: Quarter[]): StatementRow[] {
  const ids = qs[0]?.kpis.map((k) => k.id) ?? [];
  return ids.map((id) => {
    const first = qs[0].kpis.find((k) => k.id === id)!;
    const format = first.unit === "pct" ? "pct" : first.unit === "count" ? "count" : first.unit === "ratio" ? "ratio" : "k";
    return {
      label: first.label,
      values: qs.map((q) => {
        const k = q.kpis.find((x) => x.id === id);
        if (!k) return null;
        return k.unit === "pct" ? k.value / 100 : k.value;
      }),
      format,
    } satisfies StatementRow;
  });
}

/** Every glossary term id the row builders can link to (for the resolve test). */
export function allRowTermIds(company: Company): string[] {
  const qs = company.quarters;
  const rows = [...incomeRows(qs), ...balanceRows(qs), ...cashFlowRows(qs), ...metricRows(company, 0, qs.length)];
  return [...new Set(rows.map((r) => r.termId).filter((x): x is string => !!x))];
}

/* ---------------- FE8.M1 bank-format rows (Bayline Bancorp) ---------------- */

const bk = (qs: Quarter[], f: (b: NonNullable<Quarter["bank"]>, q: Quarter) => number) => qs.map((q) => (q.bank ? f(q.bank, q) : null));

/** Bank income statement: interest income − interest expense = NII; + fees − expenses = PPNR; − provision = pretax. */
export function bankIncomeRows(qs: Quarter[]): StatementRow[] {
  return [
    { label: "Interest income (loans, securities, cash)", values: bk(qs, (b) => b.interestIncome), indent: true },
    { label: "Interest expense (deposits, borrowings)", values: bk(qs, (b) => -b.interestExpense), indent: true, termId: "deposit-beta" },
    { label: "Net interest income", values: bk(qs, (b) => b.netInterestIncome), kind: "subtotal", termId: "net-interest-income" },
    { label: "Non-interest income (fees)", values: bk(qs, (b) => b.nonInterestIncome), indent: true },
    { label: "Net revenue", values: col(qs, (q) => q.income.revenue), kind: "subtotal" },
    { label: "Non-interest expense", values: bk(qs, (b) => -b.nonInterestExpense), indent: true, termId: "efficiency-ratio" },
    { label: "Pre-provision net revenue (PPNR)", values: bk(qs, (b) => b.ppnr), kind: "subtotal", termId: "ppnr" },
    { label: "Provision for credit losses", values: bk(qs, (b) => -b.provision), indent: true, termId: "provision-for-credit-losses" },
    { label: "Pretax income", values: col(qs, (q) => q.income.pretaxIncome), kind: "subtotal" },
    { label: "Income tax", values: col(qs, (q) => -q.income.taxExpense), indent: true },
    { label: "Net income", values: col(qs, (q) => q.income.netIncome), kind: "total", termId: "net-margin" },
    { label: "Diluted shares (k)", values: col(qs, (q) => q.income.sharesDiluted), format: "count", indent: true, termId: "dilution" },
    { label: "Diluted EPS", values: col(qs, (q) => q.income.epsDiluted), format: "eps", kind: "subtotal", termId: "eps" },
  ];
}

export function bankBalanceRows(qs: Quarter[]): StatementRow[] {
  const b = (f: (bs: Quarter["balance"]) => number) => col(qs, (q) => f(q.balance));
  return [
    { label: "Assets", values: [], kind: "section" },
    { label: "Cash & reserves", values: b((x) => x.cash), indent: true },
    { label: "Investment securities", values: b((x) => x.securities ?? 0), indent: true },
    { label: "Gross loans", values: bk(qs, (k) => k.grossLoans), indent: true, termId: "loan-to-deposit" },
    { label: "Allowance for credit losses", values: bk(qs, (k) => -k.allowance), indent: true, termId: "allowance-for-credit-losses" },
    { label: "Net loans", values: b((x) => x.loansNet ?? 0), kind: "subtotal" },
    { label: "Premises & equipment", values: b((x) => x.ppe), indent: true },
    { label: "Goodwill & intangibles", values: b((x) => x.otherAssets), indent: true, termId: "tangible-book-value" },
    { label: "Other assets", values: b((x) => x.otherCurrentAssets), indent: true },
    { label: "Total assets", values: b((x) => x.totalAssets), kind: "total" },
    { label: "Liabilities", values: [], kind: "section" },
    { label: "Deposits", values: b((x) => x.deposits ?? 0), indent: true, termId: "bank-deposits" },
    { label: "Borrowings", values: b((x) => x.shortTermDebt + x.longTermDebt), indent: true },
    { label: "Accrued & other liabilities", values: b((x) => x.accruedLiabilities + x.otherLiabilities), indent: true },
    { label: "Total liabilities", values: b((x) => x.totalLiabilities), kind: "subtotal" },
    { label: "Equity", values: [], kind: "section" },
    { label: "Paid-in capital", values: b((x) => x.paidInCapital), indent: true },
    { label: "Retained earnings", values: b((x) => x.retainedEarnings), indent: true },
    { label: "Total equity", values: b((x) => x.totalEquity), kind: "subtotal", termId: "cet1-ratio" },
    { label: "Total liabilities + equity", values: b((x) => x.totalLiabilitiesAndEquity), kind: "total", termId: "balance-sheet" },
    {
      label: "Check: assets − (liabilities + equity)",
      values: b((x) => x.totalAssets - x.totalLiabilitiesAndEquity),
      kind: "check",
      tones: qs.map((q) => (q.balance.totalAssets === q.balance.totalLiabilitiesAndEquity ? "good" : "bad")),
    },
  ];
}

export function bankCashFlowRows(qs: Quarter[]): StatementRow[] {
  const c = (f: (cf: Quarter["cashFlow"]) => number) => col(qs, (q) => f(q.cashFlow));
  return [
    { label: "Operating", values: [], kind: "section" },
    { label: "Net income", values: c((x) => x.netIncome), indent: true },
    { label: "Provision for credit losses (non-cash)", values: c((x) => x.provisionAddback ?? 0), indent: true, termId: "provision-for-credit-losses" },
    { label: "Depreciation & amortization", values: c((x) => x.depreciation), indent: true },
    { label: "Stock-based compensation", values: c((x) => x.stockComp), indent: true, termId: "stock-based-comp" },
    { label: "Cash from operations", values: c((x) => x.cfo), kind: "subtotal", termId: "cash-flow-statement" },
    { label: "Investing", values: [], kind: "section" },
    { label: "Net new loans", values: c((x) => x.changeLoans ?? 0), indent: true },
    { label: "Securities (bought) / run off", values: c((x) => x.changeSecurities ?? 0), indent: true },
    { label: "Capital expenditures", values: c((x) => x.capex), indent: true, termId: "capex" },
    { label: "Cash from investing", values: c((x) => x.cfi), kind: "subtotal" },
    { label: "Financing", values: [], kind: "section" },
    { label: "Deposits in / (out)", values: c((x) => x.changeDeposits ?? 0), indent: true, termId: "bank-deposits" },
    { label: "Borrowings added", values: c((x) => x.debtIssued), indent: true },
    { label: "Borrowings repaid", values: c((x) => x.debtRepaid), indent: true },
    { label: "Dividends", values: c((x) => x.dividends), indent: true },
    { label: "Cash from financing", values: c((x) => x.cff), kind: "subtotal" },
    { label: "Cash bridge", values: [], kind: "section" },
    { label: "Beginning cash", values: c((x) => x.beginningCash), indent: true },
    { label: "Net change in cash", values: c((x) => x.netChangeInCash), indent: true },
    { label: "Ending cash", values: c((x) => x.endingCash), kind: "total" },
    {
      label: "Check: ending cash − balance sheet cash",
      values: col(qs, (q) => q.cashFlow.endingCash - q.balance.cash),
      kind: "check",
      tones: qs.map((q) => (q.cashFlow.endingCash === q.balance.cash ? "good" : "bad")),
    },
  ];
}

export function bankMetricRows(company: Company, startIndex: number, count: number): StatementRow[] {
  const ms = Array.from({ length: count }, (_, i) => bankQuarterMetrics(company, startIndex + i));
  const m = (f: (x: NonNullable<(typeof ms)[number]>) => number | null) => ms.map((x) => (x ? f(x) : null));
  return [
    { label: "Spread", values: [], kind: "section" },
    { label: "Net interest margin (annualized)", values: m((x) => x.netInterestMargin), format: "pct", termId: "net-interest-margin" },
    { label: "Net interest income QoQ", values: m((x) => x.niiQoQ), format: "pct", termId: "net-interest-income" },
    { label: "Efficiency ratio", values: m((x) => x.efficiencyRatio), format: "pct", termId: "efficiency-ratio" },
    { label: "PPNR", values: m((x) => x.ppnr), termId: "ppnr" },
    { label: "Credit", values: [], kind: "section" },
    { label: "Net charge-offs (annualized)", values: m((x) => x.netChargeOffRatio), format: "pct", termId: "net-charge-offs" },
    { label: "Provision ÷ net charge-offs", values: m((x) => x.provisionToChargeOffs), format: "x", termId: "reserve-build" },
    { label: "Allowance ÷ loans", values: m((x) => x.allowanceToLoans), format: "pct", termId: "allowance-for-credit-losses" },
    { label: "Non-performing loans ÷ loans", values: m((x) => x.nonperformingRatio), format: "pct", termId: "nonperforming-loans" },
    { label: "Funding & capital", values: [], kind: "section" },
    { label: "Loans ÷ deposits", values: m((x) => x.loanToDeposit), format: "pct", termId: "loan-to-deposit" },
    { label: "CET1 ratio (simplified)", values: m((x) => x.cet1), format: "pct", termId: "cet1-ratio" },
    { label: "Return on equity (annualized)", values: m((x) => x.returnOnEquity), format: "pct", termId: "return-on-equity" },
    { label: "Return on assets (annualized)", values: m((x) => x.returnOnAssets), format: "pct" },
    { label: "Book value per share", values: m((x) => x.bookValuePerShare), format: "eps", termId: "tangible-book-value" },
    { label: "Tangible book value per share", values: m((x) => x.tangibleBookValuePerShare), format: "eps", termId: "tangible-book-value" },
  ];
}

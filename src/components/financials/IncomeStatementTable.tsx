import type { Company } from "../../lib/financials/types";
import StatementTable from "./StatementTable";
import { incomeRows } from "./rows";

interface Props {
  company: Company;
  /** First quarter index to show (default 0). */
  start?: number;
  /** Number of quarters to show (default all). */
  count?: number;
  highlightColumn?: number;
}

export default function IncomeStatementTable({ company, start = 0, count, highlightColumn }: Props) {
  const qs = company.quarters.slice(start, count === undefined ? undefined : start + count);
  return (
    <StatementTable
      title={`Income statement · ${company.ticker}`}
      columns={qs.map((q) => q.label)}
      rows={incomeRows(qs)}
      highlightColumn={highlightColumn}
      caption="Revenue down to EPS. Parentheses = costs or losses."
    />
  );
}

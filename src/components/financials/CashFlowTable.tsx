import type { Company } from "../../lib/financials/types";
import StatementTable from "./StatementTable";
import { cashFlowRows } from "./rows";

interface Props {
  company: Company;
  /** First quarter index to show (default 0). */
  start?: number;
  /** Number of quarters to show (default all). */
  count?: number;
  highlightColumn?: number;
}

export default function CashFlowTable({ company, start = 0, count, highlightColumn }: Props) {
  const qs = company.quarters.slice(start, count === undefined ? undefined : start + count);
  return (
    <StatementTable
      title={`Cash flow statement · ${company.ticker}`}
      columns={qs.map((q) => q.label)}
      rows={cashFlowRows(qs)}
      highlightColumn={highlightColumn}
      caption="Inflows positive, outflows in parentheses. Ending cash must equal balance-sheet cash."
    />
  );
}

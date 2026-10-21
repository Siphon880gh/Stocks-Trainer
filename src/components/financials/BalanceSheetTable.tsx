import type { Company } from "../../lib/financials/types";
import StatementTable from "./StatementTable";
import { balanceRows } from "./rows";

interface Props {
  company: Company;
  /** First quarter index to show (default 0). */
  start?: number;
  /** Number of quarters to show (default all). */
  count?: number;
  highlightColumn?: number;
}

export default function BalanceSheetTable({ company, start = 0, count, highlightColumn }: Props) {
  const qs = company.quarters.slice(start, count === undefined ? undefined : start + count);
  return (
    <StatementTable
      title={`Balance sheet · ${company.ticker}`}
      columns={qs.map((q) => q.label)}
      rows={balanceRows(qs)}
      highlightColumn={highlightColumn}
      caption="End-of-quarter snapshot. The check row must be 0 (assets = liabilities + equity)."
    />
  );
}

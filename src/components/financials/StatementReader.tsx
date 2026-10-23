import { useState } from "react";
import { COMPANIES } from "../../lib/financials/companies";
import { FIN_DISCLAIMER } from "../../lib/financials/format";
import SampleDataNote from "../SampleDataNote";
import type { Company } from "../../lib/financials/types";
import BalanceSheetTable from "./BalanceSheetTable";
import CashFlowTable from "./CashFlowTable";
import IncomeStatementTable from "./IncomeStatementTable";
import StatementTable from "./StatementTable";
import { kpiRows, metricRows } from "./rows";

export type ReaderTab = "income" | "balance" | "cashflow" | "metrics" | "story";

const TABS: { id: ReaderTab; label: string }[] = [
  { id: "income", label: "Income" },
  { id: "balance", label: "Balance sheet" },
  { id: "cashflow", label: "Cash flow" },
  { id: "metrics", label: "Metrics & KPIs" },
  { id: "story", label: "What the numbers say" },
];

interface StatementReaderProps {
  companies?: Company[];
  initialCompanyId?: string;
  initialTab?: ReaderTab;
  /** Show only the latest four quarters until the user expands. Default true. */
  initialLatestFour?: boolean;
}

/** Company picker + statement tabs + metrics panel (FE1.M3). */
export default function StatementReader({
  companies = COMPANIES,
  initialCompanyId,
  initialTab = "income",
  initialLatestFour = true,
}: StatementReaderProps) {
  const [companyId, setCompanyId] = useState(initialCompanyId ?? companies[0]!.id);
  const [tab, setTab] = useState<ReaderTab>(initialTab);
  const [latestFour, setLatestFour] = useState(initialLatestFour);
  const company = companies.find((c) => c.id === companyId) ?? companies[0]!;
  const total = company.quarters.length;
  const start = latestFour ? Math.max(0, total - 4) : 0;
  const count = total - start;
  const qs = company.quarters.slice(start);

  return (
    <section className="relative space-y-3 pr-9" data-testid="statement-reader">
      <SampleDataNote text={FIN_DISCLAIMER} />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Company">
        {companies.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCompanyId(c.id)}
            aria-pressed={c.id === company.id}
            className={`px-3 py-1.5 rounded-lg border text-[12px] ${c.id === company.id ? "border-primary bg-primary/10 text-ink font-semibold" : "border-line bg-surface text-muted hover:text-ink"}`}
          >
            {c.name} <span className="font-mono text-[10px]">{c.ticker}</span>
          </button>
        ))}
      </div>

      <div className="border border-line rounded-lg bg-surface px-3 py-2">
        <p className="text-[13px] text-ink">
          <span className="font-semibold">{company.name}</span> · {company.sector}
        </p>
        <p className="text-[12px] text-muted">{company.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b border-line" role="tablist" aria-label="Statement">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-[12px] -mb-px border-b-2 ${tab === t.id ? "border-primary text-ink font-semibold" : "border-transparent text-muted hover:text-ink"}`}
          >
            {t.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-1 text-[11px] text-muted pb-1">
          <input type="checkbox" checked={!latestFour} onChange={(e) => setLatestFour(!e.target.checked)} />
          All {total} quarters
        </label>
      </div>

      {tab === "income" && <IncomeStatementTable company={company} start={start} count={count} />}
      {tab === "balance" && <BalanceSheetTable company={company} start={start} count={count} />}
      {tab === "cashflow" && <CashFlowTable company={company} start={start} count={count} />}
      {tab === "metrics" && (
        <div className="space-y-3">
          <StatementTable
            title={`Metrics · ${company.ticker}`}
            columns={qs.map((q) => q.label)}
            rows={metricRows(company, start, count)}
            redNegatives
            unitLabel="money in $ thousands"
            caption="n/m = not meaningful (no prior period, no debt, or negative EBITDA). Leverage and YoY need four quarters of history."
          />
          <StatementTable title={`Company KPIs · ${company.ticker}`} columns={qs.map((q) => q.label)} rows={kpiRows(qs)} unitLabel="backlog / ARR in $ thousands" />
        </div>
      )}
      {tab === "story" && (
        <ul className="border border-line rounded-lg bg-surface p-3 space-y-1.5 text-[13px] text-ink list-disc pl-6">
          {company.story.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}

    </section>
  );
}

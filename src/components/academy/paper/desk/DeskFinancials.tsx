import type { DeskScenario, DeskStatement } from "../../../../lib/academy/paper/desk/types";
import { ratios, statementsAsOf } from "../../../../lib/academy/paper/desk/scenarios";
import { bigUsd, dayLabel, pctOrDash } from "./format";

const period = (s: DeskStatement) => {
  if (s.simulated) return `${s.periodEnd} (fictional)`;
  return `${s.form === "10-K" ? "Fiscal year" : "Quarter"} to ${dayLabel(s.periodEnd)}`;
};

type Row = [string, (s: DeskStatement) => string, string?];

const ROWS: Row[] = [
  ["Revenue", (s) => bigUsd(s.revenue)],
  ["Gross profit", (s) => bigUsd(s.grossProfit)],
  ["Operating income", (s) => bigUsd(s.operatingIncome)],
  ["Net income", (s) => bigUsd(s.netIncome)],
  ["Diluted EPS", (s) => (s.epsDiluted === undefined ? "—" : `$${s.epsDiluted.toFixed(2)}`)],
  ["Gross margin", (s) => pctOrDash(ratios(s).grossMargin), "Gross profit ÷ revenue"],
  ["Operating margin", (s) => pctOrDash(ratios(s).operatingMargin), "Operating income ÷ revenue"],
  ["Net margin", (s) => pctOrDash(ratios(s).netMargin), "Net income ÷ revenue"],
  ["Operating cash flow", (s) => `${bigUsd(s.operatingCashFlow)}${s.simulated ? "" : ` (${s.cashFlowMonths} mo)`}`, "Cash flow lines in a 10-Q are year to date"],
  ["Capital spending", (s) => bigUsd(s.capex)],
  ["Free cash flow", (s) => bigUsd(ratios(s).freeCashFlow), "Operating cash flow − capital spending"],
  ["Cash", (s) => bigUsd(s.cash)],
  ["Total assets", (s) => bigUsd(s.totalAssets)],
  ["Total liabilities", (s) => `${bigUsd(s.totalLiabilities)}${s.liabilitiesDerived ? "*" : ""}`],
  ["Stockholders' equity", (s) => bigUsd(s.equity)],
  ["Liabilities ÷ equity", (s) => { const r = ratios(s).liabilitiesToEquity; return r === null ? "—" : r.toFixed(2); }],
];

/** Financials: the statements filed by the replay clock (newest first, up to three side by side). */
export default function DeskFinancials({ scenario, bar, active }: { scenario: DeskScenario; bar: number; active: string }) {
  const all = statementsAsOf(scenario, active, bar);
  const cols = all.slice(0, 3);
  const name = scenario.symbols.find((s) => s.symbol === active)?.name ?? active;
  return (
    <div className="space-y-2" data-testid="desk-financials" data-count={all.length}>
      <p className="text-[12px] text-muted">
        {name}: what had been filed by {dayLabel(scenario.labels[bar]!)}. Newer filings unlock as the replay reaches their filing date.
      </p>
      {cols.length === 0 ? (
        <p className="text-[12px] text-muted">No filing yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr>
                <th className="text-left font-medium text-muted px-1 py-1" />
                {cols.map((c, i) => (
                  <th key={i} className="text-right font-medium px-1 py-1 align-bottom" data-filed={c.filed ?? c.bar}>
                    <span className="block">{c.simulated ? c.form : `Form ${c.form}`}</span>
                    <span className="block text-muted font-normal">{period(c)}</span>
                    <span className="block text-muted font-normal">filed {c.at < 0 ? dayLabel(c.filed ?? "before the replay") : dayLabel(scenario.labels[c.at]!)}</span>
                    {c.simulated ? <span className="block text-sim font-semibold">SIMULATED</span> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, f, hint]) => (
                <tr key={label} className="border-t border-line">
                  <td className="px-1 py-0.5 text-muted" title={hint}>
                    {label}
                  </td>
                  {cols.map((c, i) => (
                    <td key={i} className="px-1 py-0.5 text-right tabular-nums">
                      {f(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {cols.some((c) => c.liabilitiesDerived) ? <p className="text-[11px] text-muted">* Total liabilities = total assets − stockholders' equity (the filing does not tag a total).</p> : null}
      <p className="text-[11px] text-muted">
        Compare like with like: a 10-K covers a full fiscal year, a 10-Q one quarter.
        {cols.map((c, i) =>
          c.url ? (
            <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-ink">
              Form {c.form} ({dayLabel(c.periodEnd)})
            </a>
          ) : null,
        )}
      </p>
    </div>
  );
}

import { Link } from "react-router-dom";
import {
  DEFAULT_LINE_LABELS,
  DISBURSEMENT_KEYS,
  RECEIPT_KEYS,
  type ForecastLineKey,
  type ForecastResult,
} from "../../lib/financials/cashForecast";
import { fmtK, glossaryHref } from "../../lib/financials/format";

interface CashForecastTableProps {
  result: ForecastResult;
  /** Show the teaching callout pin. Default true. */
  showCallout?: boolean;
  /** Quiz mode before the answer: no breach tint and no headroom row (they would give the answer away). */
  hideBreachCues?: boolean;
}

type Row =
  | { kind: "section"; label: string }
  | { kind: "line" | "subtotal" | "net" | "bridge" | "ending" | "covenant" | "headroom"; label: string; values: number[]; termId?: string };

/** Weeks 1–13 as columns: receipts, disbursements, bold net, cash bridge, covenant line with breach tint (FE2.M3). */
export default function CashForecastTable({ result, showCallout = true, hideBreachCues = false }: CashForecastTableProps) {
  const { input, weeks } = result;
  const label = (k: ForecastLineKey) => input.lineLabels?.[k] ?? DEFAULT_LINE_LABELS[k];
  /** A row shows when the forecast defines that line in any week (what-ifs that zero it keep the row visible). */
  const used = (k: ForecastLineKey) => input.weeks.some((w) => k in w.receipts || k in w.disbursements);
  const level1 = input.level === 1;
  const hasRevolver = !!input.revolver;
  const hasFloor = input.minCash > 0;

  const rows: Row[] = [{ kind: "section", label: "Cash in" }];
  for (const k of RECEIPT_KEYS) if (used(k)) rows.push({ kind: "line", label: label(k), values: weeks.map((w) => w.receipts[k]) });
  if (!level1) rows.push({ kind: "subtotal", label: "Total receipts", values: weeks.map((w) => w.totalReceipts) });
  rows.push({ kind: "section", label: "Cash out" });
  for (const k of DISBURSEMENT_KEYS)
    if (used(k)) rows.push({ kind: "line", label: label(k), values: weeks.map((w) => -w.disbursements[k]) });
  if (!level1) rows.push({ kind: "subtotal", label: "Total disbursements", values: weeks.map((w) => -w.totalDisbursements) });
  rows.push({ kind: "net", label: "Net cash flow", values: weeks.map((w) => w.net), termId: "thirteen-week-cash-flow" });
  rows.push({ kind: "section", label: "Cash bridge" });
  rows.push({ kind: "bridge", label: "Beginning cash", values: weeks.map((w) => w.beginning) });
  if (hasRevolver) {
    rows.push({ kind: "bridge", label: "Revolver draw", values: weeks.map((w) => w.draw), termId: "revolver" });
    rows.push({ kind: "bridge", label: "Revolver repay", values: weeks.map((w) => -w.repay) });
  }
  rows.push({ kind: "ending", label: "Ending cash", values: weeks.map((w) => w.ending) });
  if (hasRevolver) rows.push({ kind: "bridge", label: "Revolver balance", values: weeks.map((w) => w.revolverBalance) });
  if (hasFloor) {
    rows.push({ kind: "covenant", label: input.minCashLabel ?? "Minimum cash", values: weeks.map(() => input.minCash), termId: "minimum-cash" });
    if (!hideBreachCues) rows.push({ kind: "headroom", label: "Headroom (ending − minimum)", values: weeks.map((w) => w.headroom) });
  }

  const calloutWeek = showCallout ? input.callout?.week : undefined;

  return (
    <div className="border border-line rounded-lg bg-surface overflow-hidden" data-testid="cash-forecast-table">
      <div className="px-3 py-2 border-b border-line flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-ink">
          {input.title}
          {input.ticker ? <span className="ml-1 font-mono text-[10px] text-muted">{input.ticker}</span> : null}
        </h3>
        <span className="text-[10px] text-muted font-mono">$ thousands · 13 weeks</span>
      </div>
      <div className="overflow-x-auto [contain:inline-size]">
        <table className="w-full text-[11px] font-mono tabular-nums border-collapse">
          <thead>
            <tr className="text-muted">
              <th className="sticky left-0 bg-surface text-left font-normal px-2 py-1.5 min-w-[132px]">Week</th>
              {weeks.map((w) => (
                <th
                  key={w.week}
                  data-week={w.week}
                  className={`text-right font-normal px-1.5 py-1.5 whitespace-nowrap ${w.week === calloutWeek ? "bg-amber-100 text-ink font-semibold" : ""}`}
                >
                  {w.week === calloutWeek ? "📌 " : ""}Wk {w.week}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              if (row.kind === "section")
                return (
                  <tr key={`s-${ri}`} className="bg-canvas">
                    <td colSpan={weeks.length + 1} className="sticky left-0 px-3 py-1 text-[10px] uppercase tracking-wider text-muted">
                      {row.label}
                    </td>
                  </tr>
                );
              const strong = row.kind === "net" || row.kind === "ending" || row.kind === "subtotal";
              const rule = row.kind === "net" || row.kind === "ending" ? "border-t-2 border-ink/40" : row.kind === "subtotal" ? "border-t border-line" : "";
              return (
                <tr key={`${row.label}-${ri}`} className={rule} data-row={row.label}>
                  <td className={`sticky left-0 bg-surface px-2 py-1 leading-tight ${row.kind === "line" ? "pl-4 text-slate-300" : ""} ${strong ? "font-semibold text-ink" : "text-slate-300"}`}>
                    {row.termId ? (
                      <Link to={glossaryHref(row.termId)} className="underline decoration-dotted underline-offset-2 hover:text-primary" data-term={row.termId}>
                        {row.label}
                      </Link>
                    ) : (
                      row.label
                    )}
                  </td>
                  {row.values.map((v, i) => {
                    const wk = weeks[i]!;
                    const breachCell = !hideBreachCues && (row.kind === "ending" || row.kind === "headroom") && wk.breach;
                    const negResult = (row.kind === "net" || row.kind === "headroom" || row.kind === "ending") && v < 0;
                    const bg = breachCell ? "bg-accent-red/15" : wk.week === calloutWeek ? "bg-amber-50" : "";
                    const color = breachCell || negResult ? "text-accent-red" : row.kind === "covenant" ? "text-muted" : strong ? "text-ink" : "text-slate-200";
                    return (
                      <td
                        key={i}
                        data-breach={breachCell ? "1" : undefined}
                        className={`text-right px-1.5 py-1 whitespace-nowrap ${bg} ${color} ${strong ? "font-semibold" : ""}`}
                      >
                        {v === 0 && row.kind === "line" ? "—" : fmtK(v)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {calloutWeek && input.callout ? (
        <p className="px-3 py-2 text-[12px] text-ink border-t border-line bg-amber-50" data-testid="forecast-callout">
          📌 <span className="font-semibold">Week {calloutWeek}:</span> {input.callout.text}
        </p>
      ) : null}
      {input.notes?.length ? (
        <ul className="px-3 py-2 text-[11px] text-muted border-t border-line list-disc pl-6">
          {input.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

import type { ReactNode } from "react";
import { getMacroSource } from "../../lib/macro/sources";

export const SIMULATED_BANNER =
  "SIMULATED — fictional numbers arranged like the official release so you can practice reading it. Not live data, not affiliated with the agency, not trading advice.";

interface Props {
  sourceId: string;
  /** Our own title for the simulated page, e.g. "Employment Situation (simulated)". */
  title: string;
  period: string;
  releaseTimeET?: string;
  children: ReactNode;
  footnote?: ReactNode;
}

/** Wraps every look-alike viewer: SIMULATED banner, the real-source link first, then the simulated page. */
export default function SimulatedFrame({ sourceId, title, period, releaseTimeET, children, footnote }: Props) {
  const src = getMacroSource(sourceId);
  return (
    <section className="panel overflow-hidden" data-simulated="true" aria-label={`${title} — simulated`}>
      <div className="bg-amber-50 border-b border-amber-300 px-4 py-2 text-[12px] text-amber-900 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-bold tracking-wide">SIMULATED</span>
        <span>{SIMULATED_BANNER.replace(/^SIMULATED — /, "")}</span>
        {src && (
          <a href={src.url} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 font-semibold text-primary underline">
            Visit the real source: {src.agency} — {src.title}
            <span className="material-symbols-outlined text-[14px]" aria-hidden>
              open_in_new
            </span>
          </a>
        )}
      </div>
      <div className="px-4 pt-3 pb-2 border-b border-line flex flex-wrap items-baseline gap-x-3">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <span className="text-sm text-muted">{period}</span>
        {releaseTimeET && <span className="text-[12px] text-muted ml-auto">Released {releaseTimeET} ET (simulated schedule)</span>}
      </div>
      <div className="p-4 space-y-4 text-sm text-ink">{children}</div>
      {footnote && <div className="px-4 pb-3 text-[11px] text-muted">{footnote}</div>}
    </section>
  );
}

/** Plain bordered data table used by the look-alikes. First column is the row label. */
export function DataTable({ caption, columns, rows, highlightCol }: { caption?: string; columns: string[]; rows: { name: string; cells: (string | number)[]; strong?: boolean; indent?: boolean }[]; highlightCol?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        {caption && <caption className="text-left font-semibold pb-1 text-ink">{caption}</caption>}
        <thead>
          <tr className="border-b border-line bg-canvas">
            <th className="text-left font-medium py-1.5 px-2"></th>
            {columns.map((c, i) => (
              <th key={i} className={`text-right font-medium py-1.5 px-2 whitespace-nowrap ${i === highlightCol ? "bg-primary/10" : ""}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-line/60">
              <td className={`py-1 px-2 ${r.strong ? "font-semibold" : ""} ${r.indent ? "pl-5" : ""}`}>{r.name}</td>
              {r.cells.map((c, i) => (
                <td key={i} className={`text-right tabular-nums py-1 px-2 ${r.strong ? "font-semibold" : ""} ${i === highlightCol ? "bg-primary/5" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

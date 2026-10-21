import { Link } from "react-router-dom";
import { fmtCell, glossaryHref, type CellFormat } from "../../lib/financials/format";

export type RowKind = "line" | "subtotal" | "total" | "check" | "section";

export interface StatementRow {
  label: string;
  /** One value per column; null renders "n/m". Ignored for section rows. */
  values: (number | null)[];
  kind?: RowKind;
  format?: CellFormat;
  /** Glossary term id → label links to Archive → Literacy. */
  termId?: string;
  indent?: boolean;
  /** Optional per-cell tone override. */
  tones?: ("good" | "bad" | null)[];
}

interface StatementTableProps {
  title: string;
  columns: string[];
  rows: StatementRow[];
  /** Column index to emphasize (e.g. the quarter being discussed). */
  highlightColumn?: number;
  caption?: string;
  /** Show negative values in red. Default true. */
  redNegatives?: boolean;
  /** Units note in the header. Default "$ thousands"; pass null to hide. */
  unitLabel?: string | null;
}

/**
 * Generic accounting-style table: sticky first column, horizontal scroll on narrow screens,
 * subtotal/total rules, glossary links on row labels.
 */
export default function StatementTable({
  title,
  columns,
  rows,
  highlightColumn,
  caption,
  redNegatives = true,
  unitLabel = "$ thousands",
}: StatementTableProps) {
  return (
    <div className="border border-line rounded-lg bg-surface overflow-hidden" data-testid="statement-table">
      <div className="px-3 py-2 border-b border-line flex items-baseline justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
        {unitLabel ? <span className="text-[10px] text-muted font-mono">{unitLabel}</span> : null}
      </div>
      {/* contain:inline-size stops the table's min-content width from stretching the page on phones. */}
      <div className="overflow-x-auto [contain:inline-size]">
        <table className="w-full text-[12px] font-mono tabular-nums border-collapse">
          <thead>
            <tr className="text-muted">
              <th className="sticky left-0 bg-surface text-left font-normal px-3 py-1.5 min-w-[170px]">Line</th>
              {columns.map((c, i) => (
                <th
                  key={c}
                  className={`text-right font-normal px-3 py-1.5 whitespace-nowrap ${i === highlightColumn ? "bg-primary/10 text-ink font-semibold" : ""}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const kind = row.kind ?? "line";
              if (kind === "section") {
                return (
                  <tr key={`${row.label}-${ri}`} className="bg-canvas">
                    <td colSpan={columns.length + 1} className="sticky left-0 px-3 py-1 text-[10px] uppercase tracking-wider text-muted">
                      {row.label}
                    </td>
                  </tr>
                );
              }
              const strong = kind === "subtotal" || kind === "total" || kind === "check";
              const rule = kind === "total" ? "border-t-2 border-ink/40" : kind === "subtotal" ? "border-t border-line" : "";
              return (
                <tr key={`${row.label}-${ri}`} className={`${rule} ${kind === "check" ? "bg-canvas" : ""}`} data-row={row.label}>
                  <td className={`sticky left-0 bg-surface px-3 py-1 ${row.indent ? "pl-6" : ""} ${strong ? "font-semibold text-ink" : "text-slate-300"}`}>
                    {row.termId ? (
                      <Link to={glossaryHref(row.termId)} className="underline decoration-dotted underline-offset-2 hover:text-primary" data-term={row.termId}>
                        {row.label}
                      </Link>
                    ) : (
                      row.label
                    )}
                  </td>
                  {row.values.map((v, ci) => {
                    const tone = row.tones?.[ci];
                    // Costs on plain lines stay neutral (parentheses already say "out"); red marks negative results.
                    const neg = redNegatives && v !== null && v < 0 && row.format !== "x" && (strong || (row.format ?? "k") !== "k");
                    const color =
                      tone === "good" ? "text-up" : tone === "bad" ? "text-accent-red" : neg ? "text-accent-red" : strong ? "text-ink" : "text-slate-200";
                    return (
                      <td
                        key={ci}
                        className={`text-right px-3 py-1 whitespace-nowrap ${color} ${strong ? "font-semibold" : ""} ${ci === highlightColumn ? "bg-primary/10" : ""}`}
                      >
                        {v === 0 && kind === "line" ? "—" : fmtCell(v, row.format ?? "k")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {caption ? <p className="px-3 py-2 text-[11px] text-muted border-t border-line">{caption}</p> : null}
    </div>
  );
}

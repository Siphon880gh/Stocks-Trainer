import SimulatedFrame, { DataTable } from "../SimulatedFrame";
import { fmt2, fmtInt, fmtSigned } from "../format";
import { housingTable, pmmsCards } from "../../../lib/macro/viewData";
import { monthLabel } from "../../../lib/macro/world";

/** Look-alike of the weekly mortgage-rate survey: two rate cards plus the 10-year link. */
export function PmmsViewer({ week }: { week: number }) {
  const p = pmmsCards(week);
  return (
    <SimulatedFrame sourceId="freddie-pmms" title="Weekly Mortgage Rate Survey (simulated)" period={`Week of ${p.asOf}`} releaseTimeET="12:00 p.m.">
      <div className="grid sm:grid-cols-2 gap-3">
        {p.cards.map((c) => (
          <div key={c.name} className="border border-line rounded-lg p-3">
            <p className="text-[12px] text-muted">{c.name}</p>
            <p className="text-3xl font-semibold tabular-nums">{fmt2(c.rate)}%</p>
            <p className="text-[12px] tabular-nums">
              1-week change: <span className={c.weekChange > 0 ? "text-accent-red" : c.weekChange < 0 ? "text-up" : ""}>{fmtSigned(c.weekChange, 2)}</span>
              {" · "}1 year ago: {c.yearAgo === null ? "—" : `${fmt2(c.yearAgo)}%`}
            </p>
          </div>
        ))}
      </div>
      <p className="leading-relaxed">
        The simulated weekly average 10-year yield was {fmt2(p.avg10y)}%, so the 30-year mortgage rate sits <strong>{fmt2(p.spread)} points</strong> above it. Mortgage rates follow the 10-year
        plus a spread that widens when rates are volatile; that is why a jobs or inflation surprise can reach a homebuyer within days.
      </p>
    </SimulatedFrame>
  );
}

/** Look-alike of the monthly new residential construction summary. */
export function HousingStartsViewer({ month }: { month: number }) {
  const rows = housingTable(month);
  return (
    <SimulatedFrame sourceId="census-housing" title="New Residential Construction (simulated)" period={monthLabel(month)} releaseTimeET="8:30 a.m.">
      <p className="leading-relaxed">
        Simulated privately-owned housing starts were at a seasonally adjusted annual rate of <strong>{fmtInt(rows[0]!.current)},000</strong>, {fmtSigned(rows[0]!.momPct, 1)} percent from the
        prior month. Building permits, a lead on future starts, were {fmtInt(rows[1]!.current)},000.
      </p>
      <DataTable
        caption="Thousands of units, SAAR (simulated)"
        columns={[monthLabel(month), monthLabel(month - 1), "% chg", "Year ago", "% chg y/y"]}
        highlightCol={0}
        rows={rows.map((r, i) => ({ name: r.name, cells: [fmtInt(r.current), fmtInt(r.prior), fmtSigned(r.momPct, 1), fmtInt(r.yearAgo), r.yoyPct === null ? "—" : fmtSigned(r.yoyPct, 1)], strong: i === 0 }))}
      />
      <p className="text-[12px] text-muted">Real monthly changes in starts are noisy (often ±10%), which is one reason markets react to them less than to jobs or inflation.</p>
    </SimulatedFrame>
  );
}


import SimulatedFrame, { DataTable } from "../SimulatedFrame";
import { fedFraction, fmt2, fmtInt, fmtSigned } from "../format";
import { CURVE_TENORS, curveRow, fredSeriesData } from "../../../lib/macro/viewData";
import { dotsFor, meetingByMonth, statementFor } from "../../../lib/macro/fed";
import { WORLD } from "../../../lib/macro/world";

/** Tiny dependency-free line chart (SVG) so viewers render the same in tests and in the app. */
export function SparkLine({ values, height = 140, label }: { values: number[]; height?: number; label: string }) {
  const w = 560;
  const pad = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${(pad + (i / Math.max(1, values.length - 1)) * (w - 2 * pad)).toFixed(1)},${(height - pad - ((v - min) / span) * (height - 2 * pad)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-auto bg-canvas rounded" role="img" aria-label={label}>
      <line x1={pad} x2={w - pad} y1={height - pad} y2={height - pad} stroke="#d1d4dc" />
      <text x={pad} y={14} fontSize="11" fill="#787b86">
        {max.toFixed(2)}
      </text>
      <text x={pad} y={height - 6} fontSize="11" fill="#787b86">
        {min.toFixed(2)}
      </text>
      <polyline points={pts} fill="none" stroke="#2962ff" strokeWidth="2" />
    </svg>
  );
}

const fmtVal = (id: string, v: number) => (["PAYEMS", "ICSA", "JTSJOL", "RSAFS", "HOUST"].includes(id) ? fmtInt(v) : v >= 100 ? v.toFixed(3) : fmt2(v));

/** Look-alike of an economic-data series page: title, ID, units, a line chart and the latest observations. */
export function FredSeriesViewer({ seriesId, end, window = 120 }: { seriesId: string; end?: number; window?: number }) {
  const { meta, points } = fredSeriesData(seriesId, end);
  const shown = points.slice(-window);
  const latest = points.slice(-6).reverse();
  return (
    <SimulatedFrame sourceId={`fred-${seriesId}`} title={`${meta.title} (simulated)`} period={`Series ${meta.id} · ${meta.frequency}`}>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-muted">
        <span>Units: {meta.units}</span>
        <span>Frequency: {meta.frequency}</span>
        <span>Release: {meta.release}</span>
      </div>
      <SparkLine values={shown.map((p) => p.value)} label={`${meta.id} simulated line chart`} />
      <p className="text-[12px] text-muted">
        Notes: simulated observations on the {meta.frequency.toLowerCase()} schedule of the practice world (periods are labeled SIM Y1–Y3). The real page has the full history, downloads and
        revision vintages — use the link above.
      </p>
      <DataTable caption="Latest observations (simulated)" columns={["Value"]} rows={latest.map((p) => ({ name: p.label, cells: [fmtVal(meta.id, p.value)] }))} />
    </SimulatedFrame>
  );
}

/** Look-alike of the daily par yield curve table, last 5 sessions, with the 2s10s spread. */
export function TreasuryCurveViewer({ day }: { day: number }) {
  const rows = [day - 4, day - 3, day - 2, day - 1, day].filter((d) => d >= 0).map(curveRow);
  const last = rows[rows.length - 1]!;
  return (
    <SimulatedFrame
      sourceId="treasury-curve"
      title="Daily Par Yield Curve Rates (simulated)"
      period={last.label}
      footnote="2 Yr and 10 Yr come from the simulated world; the other tenors are smooth interpolations for practice."
    >
      <DataTable
        caption="Percent (simulated)"
        columns={[...CURVE_TENORS, "2s10s (bp)"]}
        rows={rows.map((r, i) => ({ name: r.label, cells: [...r.values.map(fmt2), fmtSigned(r.spreadBp)], strong: i === rows.length - 1 }))}
      />
      <SparkLine values={last.values} height={120} label={`Simulated yield curve for ${last.label}, 1 month to 30 years`} />
      <p className="leading-relaxed">
        The 10-year minus 2-year spread is <strong>{fmtSigned(last.spreadBp)} bp</strong>
        {last.spreadBp < 0 ? " — the curve is inverted: short rates sit above long rates, which markets often read as a sign that policy is tight." : "."}
      </p>
    </SimulatedFrame>
  );
}

/** Look-alike of a policy statement, written fresh for the simulated meeting (no real statement text). */
export function FomcStatementViewer({ month }: { month: number }) {
  const m = meetingByMonth(month);
  if (!m) return null;
  const s = statementFor(m);
  const range = `${fedFraction(m.lower)} to ${fedFraction(m.upper)} percent`;
  const actionLine =
    s.action === "maintain"
      ? `the Committee decided to maintain the target range for the federal funds rate at ${range}`
      : `the Committee decided to ${s.action} the target range for the federal funds rate by ${Math.abs(m.decisionBp)} basis points to ${range}`;
  return (
    <SimulatedFrame sourceId="fed-fomc-calendar" title="Policy Statement (simulated)" period={m.label} releaseTimeET="2:00 p.m.">
      <div className="space-y-3 leading-relaxed max-w-prose">
        <p>{s.activitySentence}</p>
        <p>
          The Committee seeks maximum employment and inflation at 2 percent over the longer run. In support of these goals, {actionLine}. The Committee will keep watching incoming data,
          the outlook, and the balance of risks when weighing further adjustments.
        </p>
        <p className="text-[13px]">
          Voting for the action: {s.votesFor} members. Voting against: {s.votesAgainst}.{s.dissentNote ? ` ${s.dissentNote}` : ""}
        </p>
      </div>
      <div className="border-t border-line pt-2 text-[13px] space-y-1">
        <p className="font-semibold">Implementation note (simulated)</p>
        <p>
          Effective with the simulated decision, the rate paid on reserve balances is {fmt2(m.upper - 0.1)} percent and the overnight reverse repurchase rate is {fmt2(m.lower)} percent,
          which keeps the effective funds rate near {fmt2(m.effective)} percent, inside the {range} range.
        </p>
      </div>
      <div className="text-[12px] text-muted border-t border-line pt-2">
        Practice note: in this simulation, futures priced an expected move of {fmtSigned(s.expectedBp, 1)} bp before the meeting; the decision was {fmtSigned(m.decisionBp)} bp.
      </div>
    </SimulatedFrame>
  );
}

/** Look-alike of the projections dot plot: 19 anonymous dots per year, medians marked. */
export function DotPlotViewer({ month }: { month: number }) {
  const m = meetingByMonth(month);
  const cols = m ? dotsFor(m) : undefined;
  if (!m || !cols) return null;
  const all = cols.flatMap((c) => c.dots);
  const lo = Math.floor(Math.min(...all)) - 0.25;
  const hi = Math.ceil(Math.max(...all)) + 0.25;
  const H = 260;
  const W = 520;
  const y = (v: number) => 16 + ((hi - v) / (hi - lo)) * (H - 40);
  const colW = (W - 60) / cols.length;
  const ticks: number[] = [];
  for (let v = Math.ceil(lo * 2) / 2; v <= hi; v += 0.5) ticks.push(v);
  return (
    <SimulatedFrame sourceId="fed-fomc-calendar" title="Projections — dot plot (simulated)" period={m.label} releaseTimeET="2:00 p.m.">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Simulated dot plot">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={50} x2={W - 10} y1={y(t)} y2={y(t)} stroke="#eef0f4" />
            <text x={6} y={y(t) + 4} fontSize="11" fill="#787b86">
              {t.toFixed(2)}
            </text>
          </g>
        ))}
        {cols.map((c, ci) => {
          const counts: Record<string, number> = {};
          return (
            <g key={c.label}>
              <text x={60 + ci * colW + colW / 2} y={H - 6} fontSize="11" textAnchor="middle" fill="#131722">
                {c.label}
              </text>
              <line x1={60 + ci * colW + 8} x2={60 + (ci + 1) * colW - 8} y1={y(c.median)} y2={y(c.median)} stroke="#f23645" strokeDasharray="4 3" />
              {c.dots.map((d, di) => {
                const k = d.toFixed(3);
                const n = (counts[k] = (counts[k] ?? 0) + 1) - 1;
                return <circle key={di} cx={60 + ci * colW + colW / 2 + (n % 2 ? 1 : -1) * Math.ceil(n / 2) * 7} cy={y(d)} r={3} fill="#2962ff" />;
              })}
            </g>
          );
        })}
      </svg>
      <DataTable caption="Median of projections (midpoint of target range, %)" columns={cols.map((c) => c.label)} rows={[{ name: "Median", cells: cols.map((c) => c.median.toFixed(3)) }]} />
      <p className="text-[12px] text-muted">Red dashes mark the median. Each dot is one anonymous participant&apos;s view of the appropriate year-end rate.</p>
    </SimulatedFrame>
  );
}

export const curveDayForMonthEnd = (m: number) => Math.min(WORLD.days.length - 1, m * 20 + 19);

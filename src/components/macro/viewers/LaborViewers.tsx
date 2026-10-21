import SimulatedFrame, { DataTable } from "../SimulatedFrame";
import { fmt1, fmt2, fmtInt, fmtSigned } from "../format";
import { claimsTable, householdColumns, joltsTable, payrollColumns, payrollRevisionSentence, PRIVATE_SECTORS } from "../../../lib/macro/viewData";
import { WORLD } from "../../../lib/macro/world";

/** Look-alike of a monthly jobs report: lead paragraph, household table (A) and establishment table (B). */
export function EmploymentSituationViewer({ month }: { month: number }) {
  const cols = payrollColumns(month);
  const hh = householdColumns(month);
  const cur = cols[2]!;
  const hc = hh[2]!;
  const rev = payrollRevisionSentence(month);
  const pr = WORLD.months[month]!.payroll;
  const colLabels = cols.map((c, i) => `${c.label}${i === 2 ? " (p)" : ""}`);
  const verb = cur.total >= 0 ? "rose by" : "fell by";
  return (
    <SimulatedFrame
      sourceId="bls-empsit"
      title="The Employment Situation (simulated)"
      period={cur.label}
      releaseTimeET="8:30 a.m."
      footnote="(p) preliminary. Changes in thousands, seasonally adjusted. Every number on this page is fictional and generated for practice."
    >
      <p className="leading-relaxed">
        In this simulated release, total nonfarm payroll employment {verb} <strong>{fmtInt(Math.abs(cur.total))},000</strong> in {cur.label}, and the
        unemployment rate was <strong>{fmt1(hc.unemploymentRate)} percent</strong>. Average hourly earnings for private employees changed by{" "}
        {fmtSigned(pr.aheMoM, 1)} percent to ${fmt2(pr.ahe)}.
      </p>
      <p className="leading-relaxed">
        The change in total nonfarm payroll employment for {rev.m1.label} was revised from {fmtSigned(rev.m1.from)},000 to {fmtSigned(rev.m1.to)},000, and the change
        for {rev.m2.label} was revised from {fmtSigned(rev.m2.from)},000 to {fmtSigned(rev.m2.to)},000. With these revisions, employment in those two months combined
        is {fmtInt(Math.abs(rev.combined))},000 {rev.combined >= 0 ? "higher" : "lower"} than previously reported.
      </p>
      <DataTable
        caption="Table A. Household data, seasonally adjusted (simulated, thousands)"
        columns={hh.map((h) => h.label)}
        highlightCol={2}
        rows={[
          { name: "Civilian labor force", cells: hh.map((h) => fmtInt(h.laborForce)) },
          { name: "Participation rate (%)", cells: hh.map((h) => fmt1(h.participationRate)) },
          { name: "Employed", cells: hh.map((h) => fmtInt(h.employed)) },
          { name: "Unemployed", cells: hh.map((h) => fmtInt(h.unemployed)) },
          { name: "Unemployment rate (%)", cells: hh.map((h) => fmt1(h.unemploymentRate)), strong: true },
        ]}
      />
      <DataTable
        caption="Table B. Establishment data, over-the-month change (simulated, thousands)"
        columns={colLabels}
        highlightCol={2}
        rows={[
          { name: "Total nonfarm", cells: cols.map((c) => fmtSigned(c.total)), strong: true },
          { name: "Total private", cells: cols.map((c) => fmtSigned(c.privateChange)) },
          ...PRIVATE_SECTORS.map((s) => ({ name: s, cells: cols.map((c) => fmtSigned(c.sectors[s]!)), indent: true })),
          { name: "Government", cells: cols.map((c) => fmtSigned(c.government)) },
          { name: "Average hourly earnings ($)", cells: [month - 2, month - 1, month].map((k) => fmt2(WORLD.months[k]!.payroll.ahe)) },
          { name: "Average weekly hours", cells: [month - 2, month - 1, month].map((k) => fmt1(WORLD.months[k]!.payroll.avgWeeklyHours)) },
        ]}
      />
    </SimulatedFrame>
  );
}

/** Look-alike of the weekly jobless-claims news release table. */
export function ClaimsViewer({ week }: { week: number }) {
  const t = claimsTable(week);
  const cur = t.rows[0]!.values;
  return (
    <SimulatedFrame sourceId="dol-claims" title="Unemployment Insurance Weekly Claims (simulated)" period={`Week ending ${t.columns[0]}`} releaseTimeET="8:30 a.m.">
      <p className="leading-relaxed">
        In the simulated week ending {t.columns[0]}, the advance figure for seasonally adjusted initial claims was <strong>{fmtInt(cur[0])}</strong>, a change of{" "}
        {fmtSigned(cur[2])} from the previous week. The 4-week moving average was {fmtInt(t.rows[1]!.values[0])}.
      </p>
      <DataTable
        caption="Seasonally adjusted data (simulated)"
        columns={t.columns}
        highlightCol={0}
        rows={t.rows.map((r) => ({ name: r.name, cells: r.values.map((v, i) => (i === 2 ? fmtSigned(v) : fmtInt(v))), strong: r.name.startsWith("Initial") }))}
      />
      <p className="text-[12px] text-muted">Continuing (insured unemployment) claims lag initial claims by one week in the real report; here both are shown for the same simulated week.</p>
    </SimulatedFrame>
  );
}

/** Look-alike of the JOLTS highlights table. */
export function JoltsViewer({ month }: { month: number }) {
  const [p, c] = joltsTable(month);
  const row = (name: string, a: number, ar: number, b: number, br: number) => ({ name, cells: [fmtInt(a), fmt1(ar), fmtInt(b), fmt1(br), fmtSigned(b - a)] });
  return (
    <SimulatedFrame sourceId="bls-jolts" title="Job Openings and Labor Turnover (simulated)" period={c!.label} releaseTimeET="10:00 a.m.">
      <p className="leading-relaxed">
        On the last business day of {c!.label}, the simulated number of job openings was <strong>{fmtInt(c!.openings)},000</strong> (rate {fmt1(c!.openingsRate)} percent). Hires were{" "}
        {fmtInt(c!.hires)},000 and quits {fmtInt(c!.quits)},000. A falling quits rate usually means workers feel less confident about finding a new job.
      </p>
      <DataTable
        caption="Levels in thousands and rates in percent (simulated)"
        columns={[`${p!.label} level`, "rate", `${c!.label} level`, "rate", "Change"]}
        highlightCol={2}
        rows={[
          row("Job openings", p!.openings, p!.openingsRate, c!.openings, c!.openingsRate),
          row("Hires", p!.hires, p!.hiresRate, c!.hires, c!.hiresRate),
          row("Quits", p!.quits, p!.quitsRate, c!.quits, c!.quitsRate),
          row("Layoffs and discharges", p!.layoffs, p!.layoffsRate, c!.layoffs, c!.layoffsRate),
        ]}
      />
    </SimulatedFrame>
  );
}

import SimulatedFrame, { DataTable } from "../SimulatedFrame";
import { fmt1, fmtInt, fmtSigned } from "../format";
import { gdpTable, ismTable, retailTable, sentimentTable } from "../../../lib/macro/viewData";
import { WORLD, monthLabel } from "../../../lib/macro/world";

const CONTRIB_NAMES = { consumption: "Personal consumption", investment: "Private investment", government: "Government", netExports: "Net exports" } as const;

/** Look-alike of the GDP release: headline annualized growth and contributions to it. */
export function GdpViewer({ quarter }: { quarter: number }) {
  const t = gdpTable(quarter);
  const q = WORLD.quarters[quarter]!;
  return (
    <SimulatedFrame sourceId="bea-gdp" title="Gross Domestic Product (simulated)" period={q.label} releaseTimeET="8:30 a.m.">
      <p className="leading-relaxed">
        Simulated real GDP changed at an annual rate of <strong>{fmt1(q.headline)} percent</strong> in {q.label}. The contributions below add up to the headline (to rounding): consumer spending is
        usually the largest piece; swings in net exports and inventories can make a quarter look stronger or weaker than underlying demand.
      </p>
      <DataTable
        caption="Percent change at annual rate, and contributions in percentage points (simulated)"
        columns={t.columns}
        highlightCol={t.columns.length - 1}
        rows={[
          { name: "Real GDP", cells: t.headline.map(fmt1), strong: true },
          ...t.contributions.map((c) => ({ name: CONTRIB_NAMES[c.key], cells: c.values.map((v) => fmtSigned(v, 1)), indent: true })),
        ]}
      />
    </SimulatedFrame>
  );
}

/** Look-alike of the advance monthly retail sales summary. */
export function RetailSalesViewer({ month }: { month: number }) {
  const rows = retailTable(month);
  return (
    <SimulatedFrame sourceId="census-retail" title="Advance Monthly Retail Sales (simulated)" period={monthLabel(month)} releaseTimeET="8:30 a.m.">
      <p className="leading-relaxed">
        Simulated advance retail and food services sales were ${fmtInt(rows[0]!.level)} million, <strong>{fmtSigned(rows[0]!.momPct, 1)} percent</strong> from the previous month. The control
        group, which feeds the consumption part of GDP, changed {fmtSigned(rows[2]!.momPct, 1)} percent.
      </p>
      <DataTable
        caption="Millions of dollars, seasonally adjusted (simulated)"
        columns={["Level", "% chg m/m", "% chg y/y"]}
        rows={rows.map((r, i) => ({ name: r.name, cells: [fmtInt(r.level), fmtSigned(r.momPct, 1), r.yoyPct === null ? "—" : fmtSigned(r.yoyPct, 1)], strong: i === 0 }))}
      />
      <p className="text-[12px] text-muted">Retail sales are nominal: a hot month can be price increases rather than more stuff bought.</p>
    </SimulatedFrame>
  );
}

/** Look-alike of a purchasing-managers survey index table (manufacturing or services). */
export function IsmViewer({ month, kind }: { month: number; kind: "mfg" | "services" }) {
  const rows = ismTable(month, kind);
  const pmi = rows[0]!;
  return (
    <SimulatedFrame
      sourceId="ism-pmi"
      title={`${kind === "mfg" ? "Manufacturing" : "Services"} PMI® survey (simulated)`}
      period={monthLabel(month)}
      releaseTimeET="10:00 a.m."
      footnote="A reading above 50 means the activity is growing; below 50, contracting. PMI® is a registered trademark of its owner; this page is a simulated practice table."
    >
      <p className="leading-relaxed">
        The simulated {kind === "mfg" ? "manufacturing" : "services"} PMI® registered <strong>{fmt1(pmi.current)} percent</strong>, {fmtSigned(pmi.change, 1)} points from {fmt1(pmi.prior)}:{" "}
        {pmi.direction.toLowerCase()} {pmi.rate === "Same" ? "at the same rate" : `at a ${pmi.rate.toLowerCase()} rate`}.
      </p>
      <DataTable
        caption="Index readings (simulated)"
        columns={[monthLabel(month), monthLabel(month - 1), "Change", "Direction", "Rate of change"]}
        highlightCol={0}
        rows={rows.map((r, i) => ({ name: r.name, cells: [fmt1(r.current), fmt1(r.prior), fmtSigned(r.change, 1), r.direction, r.rate], strong: i === 0 }))}
      />
    </SimulatedFrame>
  );
}

/** Look-alike of a consumer-sentiment survey summary. */
export function SentimentViewer({ month }: { month: number }) {
  const rows = sentimentTable(month);
  return (
    <SimulatedFrame sourceId="umich-sentiment" title="Consumer Sentiment Survey (simulated)" period={monthLabel(month)} releaseTimeET="10:00 a.m.">
      <DataTable
        caption="Index values (simulated)"
        columns={[monthLabel(month), monthLabel(month - 1), "Change"]}
        highlightCol={0}
        rows={rows.map((r, i) => ({ name: r.name, cells: [fmt1(r.current), fmt1(r.prior), fmtSigned(r.change, 1)], strong: i === 0 }))}
      />
      <p className="leading-relaxed">
        Markets mostly shrug at the sentiment index itself; the line that sometimes moves bonds is <strong>year-ahead inflation expectations</strong>, because a central bank watches whether
        households expect prices to keep rising.
      </p>
    </SimulatedFrame>
  );
}

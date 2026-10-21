import SimulatedFrame, { DataTable } from "../SimulatedFrame";
import { fmt1, fmt3 } from "../format";
import { cpiTable, pceTable, ppiTable, type PctRow } from "../../../lib/macro/viewData";
import { monthLabel } from "../../../lib/macro/world";

const pctRows = (rows: PctRow[], strongFirst = true) =>
  rows.map((r, i) => ({ name: r.name, cells: [...r.monthly.map(fmt1), fmt1(r.yoy)], strong: strongFirst && i === 0, indent: i > 0 && !r.name.startsWith("All items less") }));

/** Look-alike of CPI Table A: seasonally adjusted percent changes by month plus the unadjusted 12-month change. */
export function CpiViewer({ month }: { month: number }) {
  const t = cpiTable(month);
  const head = t.rows[0]!;
  const core = t.rows[3]!;
  return (
    <SimulatedFrame
      sourceId="bls-cpi"
      title="Consumer Price Index (simulated)"
      period={monthLabel(month)}
      releaseTimeET="8:30 a.m."
      footnote={`Simulated index levels: all items ${fmt3(t.levels.all)}, core ${fmt3(t.levels.core)}. Percent changes are computed from these levels and rounded to one decimal.`}
    >
      <p className="leading-relaxed">
        In this simulated report the all-items index changed <strong>{fmt1(head.monthly[6] ?? null)} percent</strong> in {monthLabel(month)}, and the index for all items less
        food and energy (core) changed <strong>{fmt1(core.monthly[6] ?? null)} percent</strong>. Over the last 12 months, all items {head.yoy === null ? "has no year-ago comparison yet" : `changed ${fmt1(head.yoy)} percent`}.
      </p>
      <DataTable caption="Table A. Percent changes, seasonally adjusted (simulated)" columns={[...t.columns, "12-mo"]} highlightCol={6} rows={pctRows(t.rows)} />
    </SimulatedFrame>
  );
}

/** Look-alike of the PPI final-demand summary. */
export function PpiViewer({ month }: { month: number }) {
  const t = ppiTable(month);
  return (
    <SimulatedFrame sourceId="bls-ppi" title="Producer Price Index (simulated)" period={monthLabel(month)} releaseTimeET="8:30 a.m.">
      <p className="leading-relaxed">
        The simulated final-demand index changed <strong>{fmt1(t.rows[0]!.monthly[6] ?? null)} percent</strong> in {monthLabel(month)}; final demand less foods, energy, and trade services changed{" "}
        {fmt1(t.rows[1]!.monthly[6] ?? null)} percent. Producer prices are an early read on the cost pressure that can later show up in consumer prices.
      </p>
      <DataTable caption="Final demand, percent change, seasonally adjusted (simulated)" columns={[...t.columns, "12-mo"]} highlightCol={6} rows={pctRows(t.rows)} />
    </SimulatedFrame>
  );
}

/** Look-alike of the PCE price section of Personal Income and Outlays. */
export function PceViewer({ month }: { month: number }) {
  const t = pceTable(month);
  return (
    <SimulatedFrame sourceId="bea-pce" title="Personal Income and Outlays — PCE prices (simulated)" period={monthLabel(month)} releaseTimeET="8:30 a.m.">
      <p className="leading-relaxed">
        The simulated PCE price index changed <strong>{fmt1(t.rows[0]!.monthly[3] ?? null)} percent</strong>; excluding food and energy it changed{" "}
        <strong>{fmt1(t.rows[1]!.monthly[3] ?? null)} percent</strong>. Core PCE is the inflation gauge a central bank&apos;s 2 percent goal usually refers to; because CPI comes out first,
        much of PCE is often predictable by release day.
      </p>
      <DataTable caption="Price indexes, percent change from preceding month (simulated)" columns={[...t.columns, "12-mo"]} highlightCol={3} rows={pctRows(t.rows, true)} />
    </SimulatedFrame>
  );
}

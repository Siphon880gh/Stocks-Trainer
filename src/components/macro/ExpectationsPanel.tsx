import { Fragment } from "react";
import type { ReleaseEvent, Metric } from "../../lib/macro/releases";
import { LABEL_TEXT, formatMetricValue, formatSurprise, metricZ } from "../../lib/macro/display";
import { labelTone } from "./format";

function Row({ m, revealed }: { m: Metric; revealed: boolean }) {
  return (
    <tr className="border-b border-line/60 align-top">
      <td className="py-1.5 px-2">{m.name}</td>
      <td className="py-1.5 px-2 text-right tabular-nums">{m.prior === undefined ? "—" : formatMetricValue(m, m.prior)}</td>
      <td className="py-1.5 px-2 text-right tabular-nums">{m.priorRevised === undefined ? "—" : formatMetricValue(m, m.priorRevised)}</td>
      <td className="py-1.5 px-2 text-right tabular-nums font-semibold">{formatMetricValue(m, m.consensus)}</td>
      <td className="py-1.5 px-2 text-right tabular-nums text-muted whitespace-nowrap">
        {formatMetricValue(m, m.range[0])} to {formatMetricValue(m, m.range[1])}
      </td>
      {revealed ? (
        <>
          <td className="py-1.5 px-2 text-right tabular-nums font-semibold" data-field="actual">
            {formatMetricValue(m, m.actual)}
          </td>
          <td className={`py-1.5 px-2 text-right tabular-nums ${labelTone(m.label)}`} data-field="surprise">
            {formatSurprise(m, m.surprise)} <span className="text-[11px]">({metricZ(m) > 0 ? "+" : ""}{metricZ(m).toFixed(1)}σ)</span>
          </td>
        </>
      ) : (
        <>
          <td className="py-1.5 px-2 text-right text-muted">?</td>
          <td className="py-1.5 px-2 text-right text-muted">—</td>
        </>
      )}
    </tr>
  );
}

/** What the market expected before the release; actuals and surprises only after reveal (no leaks in markup). */
/** `hideRead`: show actuals but keep the "Market read" verdict back (quiz questions that ask for that read). */
export default function ExpectationsPanel({ event, revealed, hideRead = false }: { event: ReleaseEvent; revealed: boolean; hideRead?: boolean }) {
  const metrics = [event.headline, ...event.details];
  return (
    <section className="panel p-4 space-y-3" aria-label="Expectations before the release">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h3 className="font-semibold">Expectations — {event.period}</h3>
        <span className="text-[12px] text-muted">Simulated economist survey · {event.releaseTimeET} ET</span>
      </div>
      <p className="text-[13px] text-muted">{event.setup}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-line bg-canvas">
              {["", "Prior", "Prior revised", "Consensus", "Range", "Actual", "Surprise"].map((h) => (
                <th key={h} className={`py-1.5 px-2 font-medium ${h ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <Fragment key={m.key}>
                <Row m={m} revealed={revealed} />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {revealed && !hideRead && (
        <p className="text-[13px]">
          <span className={`font-semibold ${labelTone(event.effectiveLabel)}`}>Market read: {LABEL_TEXT[event.effectiveLabel]}.</span>{" "}
          {event.twist === "details-reverse" && <span>The headline said one thing, but the detail traders care about most pointed the other way — the detail wins the read.</span>}
          {event.twist === "mixed" && <span>The pieces disagreed, so the release nets out close to in line.</span>}
        </p>
      )}
      <p className="text-[11px] text-muted">σ = surprise divided by the usual forecast miss for this release. Consensus and range are simulated.</p>
    </section>
  );
}

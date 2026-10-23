import { useMemo, useState } from "react";
import { applyWhatIf, computeForecast, type ForecastInput, type WhatIf } from "../../lib/financials/cashForecast";
import { CASH_FORECASTS } from "../../lib/financials/cashForecastFixtures";
import { FIN_DISCLAIMER, fmtK } from "../../lib/financials/format";
import SampleDataNote from "../SampleDataNote";
import CashForecastTable from "./CashForecastTable";

interface CashForecastPanelProps {
  forecasts?: ForecastInput[];
  initialId?: string;
  initialWhatIf?: WhatIf;
}

/** Forecast picker + summary chips + what-if toggles; recomputes through the pure model (FE2.M3). */
export default function CashForecastPanel({ forecasts = CASH_FORECASTS, initialId, initialWhatIf = {} }: CashForecastPanelProps) {
  const [id, setId] = useState(initialId ?? forecasts[0]!.id);
  const [whatIf, setWhatIf] = useState<WhatIf>(initialWhatIf);
  const input = forecasts.find((f) => f.id === id) ?? forecasts[0]!;
  const result = useMemo(() => computeForecast(applyWhatIf(input, whatIf)), [input, whatIf]);
  const hasCapex = input.weeks.some((w) => (w.disbursements.capex ?? 0) > 0);
  const toggle = (k: keyof WhatIf, def: boolean) => setWhatIf((w) => ({ ...w, [k]: !(w[k] ?? def) }));

  return (
    <section className="relative space-y-3 pr-9" data-testid="cash-forecast-panel">
      <SampleDataNote text={FIN_DISCLAIMER} />
      <div className="flex flex-wrap gap-2">
        {forecasts.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={f.id === input.id}
            onClick={() => {
              setId(f.id);
              setWhatIf({});
            }}
            className={`px-3 py-1.5 rounded-lg border text-[12px] text-left ${f.id === input.id ? "border-primary bg-primary/10 text-ink font-semibold" : "border-line bg-surface text-muted hover:text-ink"}`}
          >
            {f.level === 1 ? "Level 1 · " : ""}
            {f.ticker ?? "Starter"}
          </button>
        ))}
      </div>

      <ul className="border border-line rounded-lg bg-surface p-3 space-y-1 text-[13px] text-ink list-disc pl-6">
        {input.story.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 text-[12px]" data-testid="forecast-summary">
        <span className="px-2 py-1 rounded border border-line bg-surface">
          Lowest cash: <b>{fmtK(result.lowestCash)}</b> (week {result.lowestWeek})
        </span>
        {input.minCash > 0 ? (
          <span className={`px-2 py-1 rounded border ${result.breachWeeks.length ? "border-accent-red text-accent-red bg-accent-red/10" : "border-up text-up bg-up/10"}`}>
            {result.breachWeeks.length ? `Below minimum in week ${result.breachWeeks.join(", ")}` : "Never below minimum"}
          </span>
        ) : null}
        {input.revolver ? (
          <span className="px-2 py-1 rounded border border-line bg-surface">
            Peak revolver: <b>{fmtK(result.peakRevolver)}</b> of {fmtK(input.revolver.limit)}
          </span>
        ) : null}
        <span className="px-2 py-1 rounded border border-line bg-surface">
          13-week net: <b className={result.totalNet < 0 ? "text-accent-red" : ""}>{fmtK(result.totalNet)}</b>
        </span>
      </div>

      <fieldset className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink" data-testid="what-if">
        <legend className="text-[10px] uppercase tracking-wider text-muted mb-1">What if…</legend>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={!!whatIf.delayCollections} onChange={() => toggle("delayCollections", false)} />
          customers pay one week later
        </label>
        {hasCapex ? (
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={!!whatIf.deferCapex} onChange={() => toggle("deferCapex", false)} />
            capex is pushed to next quarter
          </label>
        ) : null}
        {input.revolver ? (
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={whatIf.useRevolver ?? input.revolver.auto} onChange={() => toggle("useRevolver", input.revolver!.auto)} />
            use the revolver
          </label>
        ) : null}
      </fieldset>

      <CashForecastTable result={result} />
    </section>
  );
}

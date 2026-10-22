import { Link } from "react-router-dom";
import { midpoint, resolveEvent, revenueLabelOf, RevenueLabel, type EarningsEvent, type Outcome } from "../../lib/financials/earningsEvents";
import { FIN_DISCLAIMER, fmtEps, fmtK, fmtPct, glossaryHref } from "../../lib/financials/format";
import type { GuidanceRange } from "../../lib/financials/types";

interface EarningsPreviewCardProps {
  event: EarningsEvent;
  /** When false (default) nothing about the results is rendered — not even hidden. */
  revealActuals?: boolean;
  compact?: boolean;
}

const OUTCOME_STYLE: Record<Outcome | "raise" | "maintain" | "cut", string> = {
  beat: "border-up text-up bg-up/10",
  raise: "border-up text-up bg-up/10",
  "in-line": "border-line text-muted bg-canvas",
  maintain: "border-line text-muted bg-canvas",
  miss: "border-accent-red text-accent-red bg-accent-red/10",
  cut: "border-accent-red text-accent-red bg-accent-red/10",
};

function Chip({ kind }: { kind: keyof typeof OUTCOME_STYLE }) {
  return <span className={`px-1.5 py-0.5 rounded border text-[10px] uppercase tracking-wider font-semibold ${OUTCOME_STYLE[kind]}`}>{kind}</span>;
}

function Term({ id, children }: { id: string; children: string }) {
  return (
    <Link to={glossaryHref(id)} className="underline decoration-dotted underline-offset-2 hover:text-primary" data-term={id}>
      {children}
    </Link>
  );
}

/** Range bar: guidance low–high with tick marks (consensus, actual). */
function RangeBar({ range, ticks }: { range: GuidanceRange; ticks: { value: number; label: string; tone: "muted" | "ink" | "up" | "red" }[] }) {
  const values = [range.low, range.high, ...ticks.map((t) => t.value)];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo) * 0.15 || hi * 0.01;
  const pos = (v: number) => `${(((v - (lo - pad)) / (hi + pad - (lo - pad))) * 100).toFixed(1)}%`;
  const toneClass = { muted: "bg-muted", ink: "bg-ink", up: "bg-up", red: "bg-accent-red" };
  return (
    <div className="relative h-9 mt-1" aria-hidden="true">
      <div className="absolute top-3 left-0 right-0 h-1 rounded bg-line" />
      <div className="absolute top-2.5 h-2 rounded bg-primary/30 border border-primary/50" style={{ left: pos(range.low), width: `calc(${pos(range.high)} - ${pos(range.low)})` }} />
      {ticks.map((t) => (
        <div key={t.label} className="absolute top-1 flex flex-col items-center -translate-x-1/2" style={{ left: pos(t.value) }}>
          <div className={`w-0.5 h-4 ${toneClass[t.tone]}`} />
          <span className="text-[9px] text-muted whitespace-nowrap">{t.label}</span>
        </div>
      ))}
    </div>
  );
}

/** What the street expects going into a report; optionally the results (FE3.M2). */
export default function EarningsPreviewCard({ event, revealActuals = false, compact = false }: EarningsPreviewCardProps) {
  const r = resolveEvent(event);
  const x = event.expect;
  const fmtKpi = (v: number, unit: string) => (unit === "pct" ? `${v}%` : unit === "ratio" ? v.toFixed(2) : fmtK(v));

  return (
    <div className="border border-line rounded-lg bg-surface overflow-hidden" data-testid="earnings-preview">
      <div className="px-3 py-2 border-b border-line flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-ink">
          {revealActuals ? "Results vs expectations" : "Earnings preview"} · {r.company.name}{" "}
          <span className="font-mono text-[10px] text-muted">{r.company.ticker}</span> · {r.quarter.label}
        </h3>
        <span className="text-[10px] text-muted font-mono">EPS in $ · revenue in $ thousands</span>
      </div>

      {revealActuals ? (
        <p className="px-3 pt-2 text-[13px] font-semibold text-ink" data-testid="preview-headline">
          “{event.headline}”
        </p>
      ) : null}

      <div className={`grid gap-3 p-3 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        <div className="space-y-1 text-[12px]">
          <p className="text-[10px] uppercase tracking-wider text-muted">
            <Term id="consensus-estimate">Consensus</Term>
          </p>
          <table className="w-full font-mono tabular-nums">
            <tbody>
              <tr>
                <td className="text-slate-300 py-0.5">
                  <Term id="eps">EPS</Term>
                </td>
                <td className="text-right text-ink">{fmtEps(x.consensusEps)}</td>
                {revealActuals ? (
                  <td className="text-right pl-3" data-testid="actual-eps">
                    <span className="text-ink font-semibold">{fmtEps(r.actualEps)}</span> <Chip kind={r.eps} />
                  </td>
                ) : null}
              </tr>
              {x.whisperEps !== undefined ? (
                <tr>
                  <td className="text-slate-300 py-0.5">Whisper EPS</td>
                  <td className="text-right text-ink">{fmtEps(x.whisperEps)}</td>
                  {revealActuals ? (
                    <td className="text-right pl-3 text-[11px] text-muted">{r.actualEps >= x.whisperEps ? "met whisper" : "missed whisper"}</td>
                  ) : null}
                </tr>
              ) : null}
              <tr>
                <td className="text-slate-300 py-0.5">{RevenueLabel(r.company)}</td>
                <td className="text-right text-ink">{fmtK(x.consensusRevenue)}</td>
                {revealActuals ? (
                  <td className="text-right pl-3" data-testid="actual-revenue">
                    <span className="text-ink font-semibold">{fmtK(r.actualRevenue)}</span> <Chip kind={r.revenue} />
                  </td>
                ) : null}
              </tr>
            </tbody>
          </table>
          {revealActuals && r.epsSurprise !== null ? (
            <p className="text-[11px] text-muted">
              <Term id="earnings-surprise">Surprise</Term>: EPS {fmtPct(r.epsSurprise)} · revenue {fmtPct(r.revenueSurprise)}
            </p>
          ) : null}
        </div>

        <div className="space-y-1 text-[12px]">
          <p className="text-[10px] uppercase tracking-wider text-muted">
            <Term id="guidance">Company guidance</Term> for {r.quarter.label} {revenueLabelOf(r.company)}
          </p>
          <p className="font-mono tabular-nums text-ink">
            {fmtK(x.priorGuidance.low)} – {fmtK(x.priorGuidance.high)}
          </p>
          <RangeBar
            range={x.priorGuidance}
            ticks={[
              { value: x.consensusRevenue, label: "consensus", tone: "muted" },
              ...(revealActuals ? [{ value: r.actualRevenue, label: "actual", tone: (r.revenue === "miss" ? "red" : r.revenue === "beat" ? "up" : "ink") as "red" | "up" | "ink" }] : []),
            ]}
          />
          {revealActuals ? (
            <div className="pt-1" data-testid="new-guidance">
              <p className="text-[11px] text-slate-300">
                Next quarter: {fmtK(event.newGuidance.low)} – {fmtK(event.newGuidance.high)} (mid {fmtK(midpoint(event.newGuidance))}) vs street{" "}
                {fmtK(event.nextQuarterConsensusRevenue)} <Chip kind={r.guidance} />
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-1 text-[12px]">
          <p className="text-[10px] uppercase tracking-wider text-muted">
            <Term id="kpi">KPI watch</Term>
          </p>
          <ul className="space-y-1">
            {r.kpiActuals.map((k) => (
              <li key={k.kpiId} className="text-slate-300">
                <span className="text-ink font-medium">{k.label}</span>: street wants {fmtKpi(k.expected, k.unit)}
                {revealActuals ? (
                  <span data-testid="kpi-actual">
                    {" "}
                    → <span className="font-semibold text-ink">{fmtKpi(k.actual, k.unit)}</span>{" "}
                    <Chip kind={k.actual >= k.expected ? "beat" : "miss"} />
                  </span>
                ) : null}
                <span className="block text-[11px] text-muted">{k.why}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-1 text-[12px]">
          <p className="text-[10px] uppercase tracking-wider text-muted">Setup</p>
          <p className="text-slate-300">
            <Term id="implied-move">Implied move</Term>: <span className="font-mono text-ink">±{x.impliedMovePct}%</span>
          </p>
          <p className="text-slate-300">
            <Term id="pre-earnings-run-up">Run-up into the print</Term>:{" "}
            <span className={`font-mono ${x.runUpPct < 0 ? "text-accent-red" : "text-ink"}`}>
              {x.runUpPct > 0 ? "+" : ""}
              {x.runUpPct}%
            </span>
          </p>
          <p className="text-slate-300">
            <Term id="positioning">Positioning</Term>: {x.positioning}
          </p>
        </div>
      </div>
      <p className="px-3 pb-2 text-[10px] text-muted">{FIN_DISCLAIMER}</p>
    </div>
  );
}

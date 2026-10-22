import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { PATTERN_OHLC } from "../../lib/ohlcData";
import {
  CONFIRM_DRILLS, RECTANGLE_VS_TRIPLE, REVERSAL_PATTERNS, SRC, type RevId,
} from "../../lib/reversalCharts";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);

/** /practice/reversal-charts: deepen classic reversal chart patterns with neckline, measured move, retest and failure. */
export default function PracticeReversalCharts() {
  const [open, setOpen] = useState<RevId | null>("double-bottom");
  const [picks, setPicks] = useState<Record<string, string>>({});
  const choose = (id: string, v: string) => {
    if (picks[id]) return;
    const next = { ...picks, [id]: v };
    setPicks(next);
    if (CONFIRM_DRILLS.every((d) => next[d.id])) markMiscPracticeDone("reversal-charts");
  };
  const active = REVERSAL_PATTERNS.find((p) => p.id === open) ?? REVERSAL_PATTERNS[0]!;
  const bars = PATTERN_OHLC[active.chartKey] ?? [];
  const right = CONFIRM_DRILLS.filter((d) => picks[d.id] === d.answer).length;

  return (
    <PracticeShell
      title="Reversal chart patterns"
      blurb="Head and shoulders, double and triple tops and bottoms, and wedges — with neckline confirmation, measured-move targets, retests and invalidation. Illustrations are SIMULATED. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="rev-intro">
        <p className="font-semibold text-[14px]">What confirms a reversal pattern</p>
        <p>
          The shape (two tops, three shoulders, a wedge) is only a candidate. Confirmation is a{" "}
          <strong>close</strong> beyond the {term("neckline", "neckline")} or pattern boundary. After that, plan a{" "}
          {term("measured-move", "measured-move")} target, watch for a {term("pattern-retest", "retest")}, and know the{" "}
          {term("pattern-invalidation", "invalidation")} close before you act.
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rev-gallery">
        <p className="font-semibold text-[14px]">Pattern gallery</p>
        <div className="flex flex-wrap gap-1">
          {REVERSAL_PATTERNS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-rev={p.id}
              onClick={() => setOpen(p.id)}
              className={cn(
                "px-2 py-1 rounded border text-[12px]",
                open === p.id ? "bg-primary text-white border-primary" : "border-line bg-primary/10 text-primary",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="panel p-3 space-y-2" data-testid="rev-detail" data-active={active.id}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-[14px]">{active.name}</p>
            <span className={cn("text-[10px] font-mono uppercase tracking-wide rounded border px-1.5 py-0.5", active.side === "bullish" ? "border-emerald-500/60 text-emerald-600" : "border-rose-500/60 text-rose-600")}>
              {active.side}
            </span>
            <Link to={`/archive?tab=patterns&open=${active.id}`} className="text-[12px] text-primary underline">Archive</Link>
          </div>
          {bars.length ? (
            <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
              <p className="text-[10px] text-muted px-2 pt-1">SIMULATED illustration</p>
              <CandlestickChart data={bars} height={160} showScaleControls={false} compact />
            </div>
          ) : null}
          <ul className="list-disc pl-5 space-y-1">
            {active.recognise.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <div className="grid sm:grid-cols-2 gap-2 text-[12px]">
            <p><span className="font-medium">Confirm: </span>{active.confirm}</p>
            <p><span className="font-medium">Measured move: </span>{active.measured}</p>
            <p><span className="font-medium">Volume: </span>{active.volume}</p>
            <p><span className="font-medium">Retest: </span>{active.retest}</p>
            <p className="sm:col-span-2"><span className="font-medium">Invalidation: </span>{active.failure}</p>
          </div>
          <a href={active.source.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary underline">{active.source.label}</a>
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="rev-rectangle">
        <p className="font-semibold text-[14px]">{RECTANGLE_VS_TRIPLE.title}</p>
        <ul className="list-disc pl-5 space-y-1">{RECTANGLE_VS_TRIPLE.points.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="text-[12px]">
          <Link to="/archive?tab=patterns&open=triple-bottom" className="text-primary underline">Triple bottom</Link>
          {" · "}
          <Link to="/archive?tab=patterns&open=bullish-rectangle" className="text-primary underline">Bullish rectangle</Link>
          {" · "}
          <a href={RECTANGLE_VS_TRIPLE.source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{RECTANGLE_VS_TRIPLE.source.label}</a>
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rev-drills">
        <p className="font-semibold text-[14px]">Confirmation drills</p>
        {CONFIRM_DRILLS.map((d) => (
          <div key={d.id} className="panel p-3 space-y-2" data-drill={d.id}>
            <p>{d.question}</p>
            <div className="flex flex-col gap-1">
              {d.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  disabled={!!picks[d.id]}
                  onClick={() => choose(d.id, o)}
                  className={cn(
                    "text-left px-2 py-1.5 rounded border text-[12px]",
                    picks[d.id] === o && o === d.answer && "bg-emerald-500/20 border-emerald-500",
                    picks[d.id] === o && o !== d.answer && "bg-rose-500/20 border-rose-500",
                    picks[d.id] && o === d.answer && picks[d.id] !== o && "border-emerald-500/50",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
            {picks[d.id] ? <p className="text-[12px]" data-drill-result>{picks[d.id] === d.answer ? "Correct. " : "Not quite. "}{d.why}</p> : null}
          </div>
        ))}
        {CONFIRM_DRILLS.every((d) => picks[d.id]) ? (
          <p className="font-medium" data-testid="rev-score">{right} / {CONFIRM_DRILLS.length} correct</p>
        ) : null}
        <p className="text-[12px]">
          <Link to="/training?group=reversal-charts&start=1" className="text-primary underline">Learn · Reversal Chart Patterns</Link>
          {" · "}
          <Link to="/archive?tab=patterns" className="text-primary underline">Archive</Link>
        </p>
        <p className="text-[11px] text-muted space-x-1">
          Sources: {Object.values(SRC).map((x) => (
            <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{x.label}</a>
          ))}
        </p>
      </section>
    </PracticeShell>
  );
}

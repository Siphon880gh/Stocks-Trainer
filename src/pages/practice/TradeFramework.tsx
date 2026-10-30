import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { SCENARIOS, SCENARIO_PAD_BARS } from "../../lib/scenarioCharts";
import {
  FRAMEWORK_DRILL_OPTIONS,
  FRAMEWORK_DRILLS,
  FRAMEWORK_STEPS,
  FRAMEWORK_UNCERTAINTY,
  TRADE_FRAMEWORK_DISCLAIMER,
  TRADE_FRAMEWORK_LINKS,
  type FrameworkStepId,
} from "../../lib/tradeFramework";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);

/** /practice/trade-framework: the price action trading framework (entry, stop-loss, trailing stop, profit target) on SAMPLE charts. */
export default function PracticeTradeFramework() {
  const [open, setOpen] = useState<FrameworkStepId>("entry");
  const [picks, setPicks] = useState<Record<string, string>>({});
  const choose = (id: string, v: string) => {
    if (picks[id]) return;
    const next = { ...picks, [id]: v };
    setPicks(next);
    if (FRAMEWORK_DRILLS.every((d) => next[d.id])) markMiscPracticeDone("trade-framework");
  };
  const step = FRAMEWORK_STEPS.find((s) => s.id === open) ?? FRAMEWORK_STEPS[0]!;
  const right = FRAMEWORK_DRILLS.filter((d) => picks[d.id] === d.answer).length;
  const { chop, signal } = FRAMEWORK_UNCERTAINTY;

  return (
    <PracticeShell
      title="Price action trading framework"
      blurb={`Trade what's happening, not what you think will happen. Wait through uncertainty, then: 1 entry signal, 2 stop-loss, 3 trailing stop, 4 profit target. ${TRADE_FRAMEWORK_DISCLAIMER}`}
    >
      <section className="panel p-4 space-y-3 text-[13px]" data-testid="tf-uncertainty">
        <p className="font-semibold text-[14px]">{FRAMEWORK_UNCERTAINTY.title}</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[chop, signal].map((c) => (
            <div key={c.chartKey} className="space-y-1" data-panel={c.label}>
              <p className={cn("text-[12px] font-semibold", c === chop ? "text-muted" : "text-emerald-600")}>{c.label}</p>
              <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
                <CandlestickChart data={SCENARIOS[c.chartKey]!.bars} annotations={c.annotations} height={170} showScaleControls={false} compact />
              </div>
              <p className="text-[12px]">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="text-[12px]">
          Read more: {term("no-trade-zone", "the no-trade zone")} · {term("breakout-retest", "breakout and retest")} · {term("price-action-framework", "the framework")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="tf-steps">
        <p className="font-semibold text-[14px]">The four steps</p>
        <div className="flex flex-wrap gap-1" role="tablist">
          {FRAMEWORK_STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={open === s.id}
              data-step={s.id}
              onClick={() => setOpen(s.id)}
              className={cn(
                "px-2 py-1 rounded border text-[12px]",
                open === s.id ? "bg-primary text-white border-primary" : "border-line bg-primary/10 text-primary",
              )}
            >
              {s.n} · {s.title}
            </button>
          ))}
        </div>
        <div className="panel p-3 space-y-2" data-testid="tf-detail" data-active={step.id}>
          <p className="font-semibold text-[14px]">
            {step.n}. {step.title}
          </p>
          <p className="font-medium">{step.rule}</p>
          <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
            <p className="text-[10px] text-muted px-2 pt-1">SAMPLE chart</p>
            <CandlestickChart
              data={step.bars}
              annotations={step.annotations}
              height={260}
              padRightBars={SCENARIO_PAD_BARS}
              showScaleControls={false}
            />
          </div>
          <p className="text-[12px] text-muted">{step.caption}</p>
          <ul className="list-disc pl-5 space-y-1">
            {step.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <p className="text-[12px]">
            <span className="font-medium">Candles that help: </span>
            {step.candles.map((c, i) => (
              <span key={c.id}>
                {i ? " · " : ""}
                <Link to={`/archive?tab=patterns&open=${c.id}`} className="text-primary underline">{c.name}</Link>
                {` (${c.role})`}
              </span>
            ))}
          </p>
          <p className="text-[12px]"><span className="font-medium">Common mistake: </span>{step.mistake}</p>
          <p className="text-[12px]">Glossary: {term(step.termId, step.title.toLowerCase())}</p>
        </div>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="tf-drills">
        <p className="font-semibold text-[14px]">Which step is this?</p>
        {FRAMEWORK_DRILLS.map((d) => (
          <div key={d.id} className="panel p-3 space-y-2" data-drill={d.id}>
            <p>{d.question}</p>
            <div className="flex flex-col gap-1">
              {FRAMEWORK_DRILL_OPTIONS.map((o) => (
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
        {FRAMEWORK_DRILLS.every((d) => picks[d.id]) ? (
          <p className="font-medium" data-testid="tf-score">{right} / {FRAMEWORK_DRILLS.length} correct</p>
        ) : null}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="tf-links">
        <p className="font-semibold text-[14px]">Keep going</p>
        <ul className="list-disc pl-5 space-y-1">
          {TRADE_FRAMEWORK_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-primary underline">{l.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </PracticeShell>
  );
}

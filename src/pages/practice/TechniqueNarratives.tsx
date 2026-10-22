import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import IndicatorPane from "../../components/IndicatorPane";
import Walkthrough from "../../components/Walkthrough";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { loadTourStep, saveTourStep } from "../../lib/tourProgress";
import { NARRATIVES, narrativeById, resultLine } from "../../lib/techniqueNarratives";
import { cn } from "../../lib/utils";

/** /practice/technique-narratives: six popover walkthroughs; each technique wins on its chart and fails on the wrong one (SIMULATED). */
export default function PracticeTechniqueNarratives() {
  const [params, setParams] = useSearchParams();
  const n = narrativeById(params.get("n") ?? "") ?? NARRATIVES[0]!;
  const tourId = `narrative:${n.id}`;
  const [side, setSide] = useState<"right" | "wrong">("right");
  const [focus, setFocus] = useState<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<number | null>(() => loadTourStep(tourId));
  const [bar, setBar] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSide("right"); setFocus(undefined); setOpen(false); setIndex(0); setBar(null); setAnswers({}); setChecks({});
    setSaved(loadTourStep(`narrative:${n.id}`));
  }, [n.id]);

  const chart = side === "right" ? n.right : n.wrong;

  const go = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(n.steps.length - 1, i));
    const st = n.steps[clamped]!;
    setIndex(clamped);
    setSide(st.chart);
    setFocus(st.focus);
    saveTourStep(tourId, clamped);
    setSaved(clamped);
  }, [n.steps, tourId]);

  const start = (from: number) => { go(from); setOpen(true); };
  const exit = useCallback(() => {
    setOpen(false);
    if (index >= n.steps.length - 1) {
      markMiscPracticeDone("technique-narratives");
      saveTourStep(tourId, null);
      setSaved(null);
    }
  }, [index, n.steps.length, tourId]);

  const pane = chart.pane;
  const ann = useMemo(() => chart.overlays, [chart]);

  return (
    <PracticeShell
      title="Technique narratives"
      blurb="Step-by-step walkthroughs: each technique runs on a SIMULATED chart that suits it, then on one that doesn't. Click Next and Prev, or Exit to explore the chart yourself. Educational, not trading advice."
    >
      <section className="panel p-3 text-[13px]" data-testid="nar-picker">
        <p className="font-semibold text-[14px] mb-2">Pick a technique</p>
        <div className="flex flex-wrap gap-2">
          {NARRATIVES.map((x) => (
            <button key={x.id} type="button" data-narrative={x.id} aria-pressed={x.id === n.id}
              onClick={() => setParams({ n: x.id })}
              className={cn("panel px-3 py-1 text-[12px]", x.id === n.id && "ring-2 ring-primary")}>{x.title}</button>
          ))}
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="nar-rule" data-testid="nar-rule">
        <p className="font-semibold text-[14px]">{n.title}</p>
        <p>{n.technique}</p>
        <p><span className="font-medium">Rule:</span> {n.rule}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button type="button" data-testid="nar-start" onClick={() => start(0)} className="panel px-3 py-1 text-[12px] ring-2 ring-primary">
            {saved != null && saved > 0 ? "Restart walkthrough" : "Start walkthrough"}
          </button>
          {saved != null && saved > 0 && (
            <button type="button" data-testid="nar-resume" onClick={() => start(saved)} className="panel px-3 py-1 text-[12px]">
              Resume at step {saved + 1}
            </button>
          )}
        </div>
        <p className="text-[12px] text-muted">
          Sources:{" "}
          {n.sources.map((x, i) => (
            <span key={x.url}>{i > 0 && " · "}<a className="underline" href={x.url} target="_blank" rel="noreferrer">{x.label}</a></span>
          ))}
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="nar-chart" data-testid="nar-chart">
        <div className="flex flex-wrap items-center gap-2">
          {(["right", "wrong"] as const).map((sd) => (
            <button key={sd} type="button" data-side={sd} aria-pressed={side === sd} onClick={() => { setSide(sd); setBar(null); }}
              className={cn("panel px-3 py-1 text-[12px]", side === sd && (sd === "right" ? "ring-2 ring-emerald-500" : "ring-2 ring-rose-500"))}>
              {sd === "right" ? "Right chart" : "Wrong chart"}
            </button>
          ))}
        </div>
        <p className="font-medium">{chart.title}</p>
        <div className="rounded-lg bg-background-dark border border-line overflow-hidden" data-testid="nar-canvas">
          <p className="text-[10px] text-muted px-2 pt-1">SIMULATED · click a candle to read it</p>
          <CandlestickChart data={chart.bars} height={240} showScaleControls={false} annotations={ann} highlightIndex={bar ?? focus}
            showVolume={chart.showVolume} onSelectBar={(i) => setBar(i)} markerDecimals={2} />
        </div>
        <p data-testid="nar-readout" className="text-[12px] font-mono min-h-[1.5em]">{bar != null ? chart.readout(bar) : "Click a candle for its values."}</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="nar-indicator" data-testid="nar-indicator">
        <p className="font-semibold text-[14px]">{pane ? pane.title : "Volume"}</p>
        {pane ? (
          <div className="rounded-lg bg-background-dark border border-line overflow-hidden text-ink">
            <IndicatorPane count={chart.bars.length} series={pane.series} guides={pane.guides} domain={pane.domain} title={pane.title} />
          </div>
        ) : (
          <p className="text-[12px]">Volume is drawn under the candles in the chart above.</p>
        )}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="nar-trades" data-testid="nar-trades">
        <p className="font-semibold text-[14px]">Trades on the {side} chart</p>
        <p data-testid="nar-result" className={cn("font-medium", chart.result.total >= 0 ? "text-emerald-600" : "text-rose-600")}>{resultLine(chart.result)}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="text-left text-muted"><th className="py-1 pr-2">Entry bar</th><th className="pr-2">Entry</th><th className="pr-2">Exit bar</th><th className="pr-2">Exit</th><th>P&L</th></tr></thead>
            <tbody>
              {chart.result.trades.map((t) => (
                <tr key={`${t.entryIndex}-${t.exitIndex}`} className="border-t border-line/60 font-mono">
                  <td className="py-1 pr-2">{t.entryIndex + 1}</td><td className="pr-2">{t.entry}</td><td className="pr-2">{t.exitIndex + 1}</td><td className="pr-2">{t.exit}</td>
                  <td className={t.pnl >= 0 ? "text-emerald-600" : "text-rose-600"}>{t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px] border-rose-500/40" data-tour="nar-fail" data-testid="nar-fail">
        <p className="font-semibold text-[14px]">Wrong chart: {n.fail.title.replace(/^Why it failed: /, "")}</p>
        <p className="text-[12px]">{n.wrong.title}. {resultLine(n.wrong.result)}.</p>
        <ul className="list-disc pl-5 space-y-1">{n.fail.why.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="text-[12px]"><span className="font-medium">Instead:</span> {n.fail.instead}</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="nar-checklist" data-testid="nar-checklist">
        <p className="font-semibold text-[14px]">Before you use it: does the chart fit?</p>
        <ul className="space-y-1">
          {n.checklist.map((c) => (
            <li key={c}><label className="flex gap-2 items-start"><input type="checkbox" checked={!!checks[c]} onChange={(e) => setChecks({ ...checks, [c]: e.target.checked })} />{c}</label></li>
          ))}
        </ul>
        {n.checklist.every((c) => checks[c]) && <p className="text-[12px] text-emerald-600">The chart fits. Still define your stop and size first.</p>}
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="nar-quiz">
        <p className="font-semibold text-[14px]">Quick check</p>
        {n.questions.map((q) => {
          const pick = answers[q.id];
          return (
            <div key={q.id} className="space-y-1" data-q={q.id}>
              <p>{q.prompt}</p>
              <div className="grid gap-1 sm:grid-cols-2">
                {q.options.map((o) => (
                  <button key={o.id} type="button" data-opt={o.id} onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                    className={cn("panel px-2 py-1 text-left text-[12px]", pick === o.id && (o.id === q.correctAnswer ? "ring-2 ring-emerald-500" : "ring-2 ring-rose-500"))}>{o.label}</button>
                ))}
              </div>
              {pick && <p className={cn("text-[12px]", pick === q.correctAnswer ? "text-emerald-600" : "text-rose-600")}>{pick === q.correctAnswer ? "Correct. " : "Not quite. "}{q.explanation}</p>}
            </div>
          );
        })}
        <p className="text-[12px]">All questions: <Link className="underline text-primary" to="/training?group=technique-narratives">Learn · Technique Narratives</Link></p>
      </section>

      {open && <Walkthrough steps={n.steps} index={index} onIndexChange={go} onExit={exit} label={n.title} />}
    </PracticeShell>
  );
}

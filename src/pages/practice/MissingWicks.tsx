import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import Walkthrough from "../../components/Walkthrough";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { loadTourStep, saveTourStep } from "../../lib/tourProgress";
import {
  FOCUS_INDEX_1H, MINUTES, MW_QUESTIONS, MW_STEPS, OHLC_RULES, WHEN_TO_DRILL, aggregateOne, barsFor, lowerWick, upperWick,
  type Scenario, type Timeframe,
} from "../../lib/missingWicks";
import { cn } from "../../lib/utils";

const TOUR_ID = "missing-wicks";
const SCN_LABEL: Record<Scenario, string> = { A: "Path A: steady selloff", B: "Path B: failed retest", mirror: "Mirror: no lower wick" };
const term = (id: string, label: string) => <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>;

/** /practice/missing-wicks: walkthrough on shaven tops and zooming from 1h into 15m and 1m (SIMULATED). */
export default function PracticeMissingWicks() {
  const [tf, setTf] = useState<Timeframe>("1h");
  const [scn, setScn] = useState<Scenario>("A");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<number | null>(() => loadTourStep(TOUR_ID));
  const [bar, setBar] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const bars = useMemo(() => barsFor(scn, tf), [scn, tf]);
  const go = useCallback((i: number) => {
    const c = Math.max(0, Math.min(MW_STEPS.length - 1, i));
    setIndex(c); setTf(MW_STEPS[c]!.tf); setScn(MW_STEPS[c]!.scenario); setBar(null);
    saveTourStep(TOUR_ID, c); setSaved(c);
  }, []);
  const start = (from: number) => { go(from); setOpen(true); };
  const exit = useCallback(() => {
    setOpen(false);
    if (index >= MW_STEPS.length - 1) { markMiscPracticeDone("missing-wicks"); saveTourStep(TOUR_ID, null); setSaved(null); }
  }, [index]);

  const sel = bar != null ? bars[bar] : null;
  const hA = aggregateOne(MINUTES.A, "A"), hB = aggregateOne(MINUTES.B, "B");

  return (
    <PracticeShell
      title="Missing wicks and zooming in"
      blurb="Why a red hourly candle can have no top wick, and what the 15-minute and 1-minute candles inside it show. A walkthrough on SIMULATED data; Exit any time to explore. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="mw-intro">
        <p>
          A candle with no upper wick is a {term("shaven-top", "shaven top")}. Zooming into lower timeframes shows the {term("intrabar", "intrabar")} path that built it, using {term("timeframe-aggregation", "timeframe aggregation")}.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" data-testid="mw-start" onClick={() => start(0)} className="panel px-3 py-1 text-[12px] ring-2 ring-primary">
            {saved != null && saved > 0 ? "Restart walkthrough" : "Start walkthrough"}
          </button>
          {saved != null && saved > 0 && (
            <button type="button" data-testid="mw-resume" onClick={() => start(saved)} className="panel px-3 py-1 text-[12px]">Resume at step {saved + 1}</button>
          )}
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="mw-controls" data-testid="mw-controls">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Timeframe">
          {(["1h", "15m", "1m"] as Timeframe[]).map((t) => (
            <button key={t} type="button" data-tf={t} aria-pressed={tf === t} onClick={() => { setTf(t); setBar(null); }}
              className={cn("panel px-3 py-1 text-[12px]", tf === t && "ring-2 ring-primary")}>{t}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Path">
          {(["A", "B", "mirror"] as Scenario[]).map((s) => (
            <button key={s} type="button" data-scn={s} aria-pressed={scn === s} onClick={() => { setScn(s); setBar(null); }}
              className={cn("panel px-3 py-1 text-[12px]", scn === s && "ring-2 ring-primary")}>{SCN_LABEL[s]}</button>
          ))}
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="mw-chart" data-testid="mw-chart">
        <p className="font-medium">{SCN_LABEL[scn]} · {tf === "1h" ? "1-hour candles (focus: 7:30–8:30 AM PT)" : tf === "15m" ? "4 × 15-minute candles, 7:30–8:30 AM PT" : "60 × 1-minute candles, 7:30–8:30 AM PT"}</p>
        <div className="rounded-lg bg-background-dark border border-line overflow-hidden" data-testid="mw-canvas">
          <p className="text-[10px] text-muted px-2 pt-1">SIMULATED · click a candle to read it</p>
          <CandlestickChart data={bars} height={240} showScaleControls={false} highlightIndex={bar ?? (tf === "1h" ? FOCUS_INDEX_1H : undefined)}
            onSelectBar={(i) => setBar(i)} markerDecimals={2} padRightBars={tf === "1h" ? 1 : 0}
            annotations={{ levels: [{ price: scn === "mirror" ? 100 : 100, label: scn === "mirror" ? "Open = low 100.00" : "Open = high 100.00", tone: "entry" }] }} />
        </div>
        <p data-testid="mw-readout" className="text-[12px] font-mono min-h-[1.5em]">
          {sel ? `${sel.name} PT: O ${sel.open.toFixed(2)} · H ${sel.high.toFixed(2)} · L ${sel.low.toFixed(2)} · C ${sel.close.toFixed(2)} · upper wick ${upperWick(sel).toFixed(2)} · lower wick ${lowerWick(sel).toFixed(2)}` : "Click a candle for its values."}
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="mw-rule" data-testid="mw-rule">
        <p className="font-semibold text-[14px]">The OHLC rule</p>
        <div className="flex gap-4 items-center">
          <svg viewBox="0 0 170 120" className="w-36 h-24 shrink-0" role="img" aria-label="Candle diagram: red candle whose high equals its open">
            <line x1="60" y1="20" x2="60" y2="100" stroke="currentColor" strokeWidth="2" />
            <rect x="42" y="20" width="36" height="60" fill="#dc2626" />
            <text x="82" y="24" fontSize="10" fill="currentColor">Open = High</text>
            <text x="82" y="84" fontSize="10" fill="currentColor">Close</text>
            <text x="82" y="104" fontSize="10" fill="currentColor">Low</text>
          </svg>
          <ul className="list-disc pl-5 space-y-1">{OHLC_RULES.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="mw-compare" data-testid="mw-compare">
        <p className="font-semibold text-[14px]">Same hourly candle, two paths</p>
        <table className="w-full text-[12px] font-mono">
          <thead><tr className="text-left text-muted font-sans"><th className="py-1">Path</th><th>Open</th><th>High</th><th>Low</th><th>Close</th></tr></thead>
          <tbody>
            {[hA, hB].map((h) => (
              <tr key={h.name} className="border-t border-line/60"><td className="py-1 font-sans">{h.name === "A" ? "A: steady selloff" : "B: failed retest"}</td><td>{h.open.toFixed(2)}</td><td>{h.high.toFixed(2)}</td><td>{h.low.toFixed(2)}</td><td>{h.close.toFixed(2)}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="text-[12px]">Path B's mid-hour rally peaked at {Math.max(...MINUTES.B.slice(20, 45).map((b) => b.high)).toFixed(2)}, just under the 100.00 open, then failed. The hourly candle can't show that.</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-tour="mw-when" data-testid="mw-when">
        <p className="font-semibold text-[14px]">When to drill down</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><p className="font-medium text-emerald-600">Useful</p><ul className="list-disc pl-5 space-y-1">{WHEN_TO_DRILL.yes.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><p className="font-medium text-rose-600">Not useful</p><ul className="list-disc pl-5 space-y-1">{WHEN_TO_DRILL.no.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        <p className="text-[12px]">Grouping rules: <Link className="underline text-primary" to="/practice/one-minute-charts">Reading 1-minute charts</Link></p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="mw-quiz">
        <p className="font-semibold text-[14px]">Quick check</p>
        {MW_QUESTIONS.slice(0, 3).map((q) => {
          const pick = answers[q.id];
          return (
            <div key={q.id} className="space-y-1">
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
        <p className="text-[12px]">All questions: <Link className="underline text-primary" to="/training?group=missing-wicks">Learn · Missing Wicks</Link></p>
      </section>

      {open && <Walkthrough steps={MW_STEPS} index={index} onIndexChange={go} onExit={exit} label="Missing wicks" />}
    </PracticeShell>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  CAUTION, CONFLUENCE_NOTES, DECISION_DRILL, DECISION_STEPS, INVALIDATION_NOTES, SIM_5M, SRC, SWING,
  fibAnnotations, levelTable, riskReward,
} from "../../lib/fibDecisionMap";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);

/** /practice/fib-decision-map: zone → confirm → stop → target → R:R on a SIMULATED 5m decline. */
export default function PracticeFibDecisionMap() {
  const [pick, setPick] = useState<string | null>(null);
  const [entry, setEntry] = useState(5025);
  const [stop, setStop] = useState(4995);
  const [target, setTarget] = useState(5085);
  const ann = useMemo(() => fibAnnotations(), []);
  const levels = useMemo(() => levelTable(), []);
  const rr = riskReward(entry, stop, target);
  const correct = DECISION_DRILL.choices.find((c) => c.id === pick);

  const choose = (id: string) => {
    setPick(id);
    const c = DECISION_DRILL.choices.find((x) => x.id === id);
    if (c?.correct) markMiscPracticeDone("fib-decision-map");
  };

  return (
    <PracticeShell
      title="Fibonacci as a decision map"
      blurb="Turn fib levels into a plan: zone, confirmation, invalidation, target, and R:R — on a SIMULATED 5-minute decline. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fib-intro">
        <p className="font-semibold text-[14px]">Retracement is a map, not a magnet</p>
        <p>
          After a clear impulse, {term("fib-retracement", "Fibonacci Retracement")} levels mark where a correction might pause.
          Fidelity and TradingView present them as possible support/resistance objectives — not guarantees.
          Pair them with {term("confluence", "confluence")} (here a SIMULATED {term("vwap", "VWAP")} near {SWING.vwap}) and a hard {term("fib-invalidation", "invalidation")}.
        </p>
        <p className="text-[12px] text-muted">
          Sources: <a className="underline" href={SRC.tv.url} target="_blank" rel="noreferrer">{SRC.tv.label}</a>
          {" · "}
          <a className="underline" href={SRC.fidelity.url} target="_blank" rel="noreferrer">{SRC.fidelity.label}</a>
          {" · "}
          <a className="underline" href={SRC.finra2270.url} target="_blank" rel="noreferrer">{SRC.finra2270.label}</a>
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fib-chart">
        <p className="font-semibold text-[14px]">SIMULATED 5m decline {SWING.high} → {SWING.low}</p>
        <p className="text-[12px]">
          Anchor: high of the push to low of the selloff. Bounce stalls near 50% / VWAP ({SWING.vwap}). Levels through 100% shown; {term("fib-extension", "extensions")} 127.2% / 161.8% are in the table for targets.
        </p>
        <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
          <p className="text-[10px] text-muted px-2 pt-1">SIMULATED · fib from swing high to swing low</p>
          <CandlestickChart data={SIM_5M} height={220} showScaleControls={false} compact annotations={ann} padRightBars={2} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]" data-testid="fib-levels">
            <thead><tr className="text-left text-muted"><th className="py-1 pr-2">Level</th><th className="pr-2">Price</th><th>Role</th></tr></thead>
            <tbody>
              {levels.map((l) => (
                <tr key={l.ratio} className="border-t border-line/60">
                  <td className="py-1 pr-2 font-mono">{l.label}</td>
                  <td className="pr-2 font-mono">{l.price.toFixed(2)}</td>
                  <td>{l.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fib-steps">
        <p className="font-semibold text-[14px]">Decision map</p>
        <ol className="space-y-2">
          {DECISION_STEPS.map((st) => (
            <li key={st.id} className="panel p-3">
              <p className="font-medium">{st.title}</p>
              <p className="text-[12px]">{st.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fib-rr">
        <p className="font-semibold text-[14px]">R:R calculator (example numbers)</p>
        <div className="grid grid-cols-3 gap-2 max-w-md">
          <label className="space-y-1">Entry<input data-testid="fib-entry" type="number" value={entry} onChange={(e) => setEntry(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
          <label className="space-y-1">Stop<input data-testid="fib-stop" type="number" value={stop} onChange={(e) => setStop(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
          <label className="space-y-1">Target<input data-testid="fib-target" type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
        </div>
        <p data-testid="fib-rr-out" className="font-medium">
          {rr == null ? "Set a stop different from entry." : `R:R ≈ ${rr.toFixed(2)} (|target−entry| ÷ |entry−stop|)`}
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fib-drill">
        <p className="font-semibold text-[14px]">Plan drill</p>
        <p>{DECISION_DRILL.prompt}</p>
        <div className="space-y-2">
          {DECISION_DRILL.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              data-choice={c.id}
              onClick={() => choose(c.id)}
              className={cn(
                "block w-full text-left panel p-3 text-[12px]",
                pick === c.id && (c.correct ? "ring-2 ring-emerald-500" : "ring-2 ring-rose-500"),
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        {correct && (
          <p data-testid="fib-drill-feedback" className={cn("text-[12px]", correct.correct ? "text-emerald-600" : "text-rose-600")}>
            {correct.correct ? "Coherent plan. " : "Not the map. "}{correct.why}
          </p>
        )}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fib-confluence">
        <p className="font-semibold text-[14px]">Confluence & invalidation</p>
        <ul className="list-disc pl-5 space-y-1">{CONFLUENCE_NOTES.map((x) => <li key={x}>{x}</li>)}</ul>
        <ul className="list-disc pl-5 space-y-1">{INVALIDATION_NOTES.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fib-caution">
        <p className="font-semibold text-[14px]">Caution</p>
        <ul className="list-disc pl-5 space-y-1">{CAUTION.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="text-[12px]">
          Tool settings refresher: see{" "}
          <Link className="underline text-primary" to="/practice/one-minute-charts">Reading 1-minute charts</Link>
          {" "}(Reverse, Extend Lines Left/Right).
        </p>
      </section>
    </PracticeShell>
  );
}

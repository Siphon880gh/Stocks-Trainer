import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import HeikinAshiCharts, { type HaView } from "../../components/practice/HeikinAshiCharts";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { HA_BARS, HA_LABEL, haQuestions } from "../../lib/heikinAshiLab";
import { cn } from "../../lib/utils";

const VIEWS: { id: HaView; label: string }[] = [
  { id: "both", label: "Side by side" },
  { id: "regular", label: "Regular" },
  { id: "ha", label: "Heikin-Ashi" },
];

/** /practice/heikin-ashi: regular vs Heikin-Ashi candles on one SIMULATED chart; quiz keys computed from the bars. */
export default function PracticeHeikinAshi({ initialView = "both" as HaView, initialAnswers = {} as Record<string, string> }) {
  const [view, setView] = useState<HaView>(initialView);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [mark, setMark] = useState<number | undefined>(undefined);
  const qs = haQuestions();
  const done = qs.filter((q) => answers[q.id]).length;
  const right = qs.filter((q) => answers[q.id] === q.correct).length;
  const pick = (qid: string, oid: string, m?: number) => {
    if (answers[qid]) return;
    setAnswers((a) => ({ ...a, [qid]: oid }));
    if (m != null) setMark(m);
    markMiscPracticeDone("heikin-ashi");
  };
  return (
    <PracticeShell
      title="Heikin-Ashi candles"
      blurb={`Regular and Heikin-Ashi candles on one ${HA_BARS.length}-bar ${HA_LABEL} chart. Every answer is computed from the chart. Educational, not trading advice.`}
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="ha-lesson">
        <p className="font-semibold text-[14px]">A modified, averaged candle</p>
        <p>
          Heikin-Ashi means roughly &quot;average pace&quot;. Each HA candle blends the current bar with the previous HA candle, which smooths price so trends and possible
          reversals are easier to see.
        </p>
        <ul className="list-disc pl-5 space-y-1 tabular-nums">
          <li>HA close = (open + high + low + close) ÷ 4</li>
          <li>HA open = (previous HA open + previous HA close) ÷ 2 (the first one is (open + close) ÷ 2)</li>
          <li>HA high = the highest of the high, HA open and HA close; HA low = the lowest of the low, HA open and HA close</li>
        </ul>
        <p className="font-semibold">Reading it</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Strong uptrend: green HA candles with no lower wicks.</li>
          <li>Strong downtrend: red HA candles with no upper wicks.</li>
          <li>Small bodies with wicks on both sides: indecision, a possible turn. Wait for confirmation.</li>
        </ul>
        <p className="font-semibold">Limits</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>HA prices are averages, not prices that traded. Orders fill at real prices, so read entries, stops and targets off the regular candles.</li>
          <li>HA lags: it changes colour after the regular candles do, and it hides gaps.</li>
          <li>Classic one- to three-candle patterns (engulfing, stars) are read on regular candles, not on HA candles.</li>
        </ul>
        <p className="text-[12px]">
          More:{" "}
          <Link to="/training?group=heikin-ashi&start=1" className="text-primary underline">
            Learn · Heikin-Ashi Candles
          </Link>{" "}
          ·{" "}
          <Link to="/practice/japanese-candles" className="text-primary underline">
            Japanese candlesticks
          </Link>{" "}
          ·{" "}
          <a href="https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-types/heikin-ashi" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            StockCharts ChartSchool: Heikin-Ashi
          </a>
        </p>
      </section>
      <section className="panel p-4 space-y-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Chart view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              data-testid={`ha-view-${v.id}`}
              onClick={() => setView(v.id)}
              className={cn("px-3 py-1.5 rounded-lg border text-[13px] min-h-[44px]", view === v.id ? "border-primary bg-primary/5 font-semibold" : "border-line hover:border-primary")}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-muted">{HA_LABEL} · a base, a climb, a top and a decline. Fixed seed, not market data.</p>
        <HeikinAshiCharts view={view} mark={mark} />
        <div className="grid gap-2">
          {qs.map((q) => {
            const a = answers[q.id];
            return (
              <div key={q.id} className="panel p-3 space-y-2" data-question={q.id}>
                <p className="text-[13px] font-medium">{q.prompt}</p>
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {q.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      disabled={!!a}
                      aria-pressed={a === o.id}
                      onClick={() => pick(q.id, o.id, q.mark)}
                      className={cn(
                        "text-left px-2.5 py-1.5 rounded-md border text-[12px] min-h-[44px]",
                        a && o.id === q.correct ? "border-up bg-up/10" : a === o.id ? "border-accent-red bg-accent-red/10" : "border-line hover:border-primary",
                      )}
                    >
                      <span className="font-semibold mr-1">{o.id}</span>
                      {o.label}
                    </button>
                  ))}
                </div>
                {a ? (
                  <p className="text-[12px]" data-testid="ha-feedback">
                    <strong className={a === q.correct ? "text-up" : "text-accent-red"}>{a === q.correct ? "Right. " : "Not quite. "}</strong>
                    {q.explanation}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
      <p className="text-[12px] text-muted tabular-nums" data-testid="ha-score">
        {right} / {done} answered right · {qs.length} questions
      </p>
    </PracticeShell>
  );
}

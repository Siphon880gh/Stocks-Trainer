import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import EmaMacdChart from "../../components/practice/EmaMacdChart";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { LAB_BARS, LAB_CHARTS, LAB_LABEL, MA_PERIOD, gradeLab, labQuestions, shortWindowFacts, type LabChartId } from "../../lib/emaMacdLab";
import { cn } from "../../lib/utils";

/** /practice/ema-macd: EMA vs SMA lag and MACD crosses on 120-bar SIMULATED charts, quiz keys computed from the charts. */
export default function PracticeEmaMacd({ initialChart = "trend-turn" as LabChartId, initialAnswers = {} as Record<string, string> }) {
  const [chartId, setChartId] = useState<LabChartId>(initialChart);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [mark, setMark] = useState<number | undefined>(undefined);
  const chart = LAB_CHARTS.find((c) => c.id === chartId)!;
  const f = shortWindowFacts();
  const qs = labQuestions();
  const shortQs = qs.filter((q) => q.chartId === "short-window");
  const chartQs = qs.filter((q) => q.chartId === chartId);
  const done = qs.filter((q) => answers[q.id]).length;
  const right = qs.filter((q) => answers[q.id] && gradeLab(q, answers[q.id]!)).length;

  const pick = (qid: string, oid: string, m?: number) => {
    if (answers[qid]) return;
    setAnswers((a) => ({ ...a, [qid]: oid }));
    if (m != null) setMark(m);
    markMiscPracticeDone("ema-macd");
  };

  const renderQuestion = (q: (typeof qs)[number]) => {
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
                "text-left px-2.5 py-1.5 rounded-md border text-[12px]",
                a && o.id === q.correct ? "border-up bg-up/10" : a === o.id ? "border-accent-red bg-accent-red/10" : "border-line hover:border-primary",
              )}
            >
              <span className="font-semibold mr-1">{o.id}</span>
              {o.label}
            </button>
          ))}
        </div>
        {a ? (
          <p className="text-[12px]" data-testid="lab-feedback">
            <strong className={gradeLab(q, a) ? "text-up" : "text-accent-red"}>{gradeLab(q, a) ? "Right. " : "Not quite. "}</strong>
            {q.explanation}
            {q.mark != null && q.chartId === chartId ? (
              <button type="button" className="ml-1 text-primary underline" onClick={() => setMark(q.mark)}>
                Show D{q.mark + 1}
              </button>
            ) : null}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <PracticeShell
      title="EMA, SMA and MACD on long charts"
      blurb={`See where EMA and SMA really differ and how MACD crosses its signal, on ${LAB_BARS}-bar ${LAB_LABEL} charts. Every answer is computed from the chart. Not trading advice.`}
    >
      <section className="panel p-4 space-y-2" data-testid="short-window-lesson">
        <p className="font-semibold text-[14px]">Why the short practice charts make them look the same</p>
        <ul className="list-disc pl-5 text-[13px] space-y-1">
          <li>
            The <Link to="/practice/regime" className="text-primary underline">Trend vs range</Link> windows are {f.windowBars} bars. A {MA_PERIOD}-bar SMA or EMA has{" "}
            {f.sma20Values} values there: it needs {MA_PERIOD} bars to start.
          </li>
          <li>
            Shrink the average to {f.maPeriod} bars and the SMA and EMA differ by at most {f.maxGap.toFixed(2)} on the "grind" window, less than one bar's typical move of{" "}
            {f.avgStep.toFixed(2)}. With so little history the EMA has nothing old to discount.
          </li>
          <li>
            MACD({12}, {26}, {9}) needs {f.macdFirstBar} bars for its first value and {f.signalFirstBar} for its signal line, so a {f.windowBars}-bar window has {f.macdValues} MACD
            values.
          </li>
          <li>On a straight trend the two averages also lag by about the same (period − 1) / 2 bars. They separate where the trend bends, which the charts below show.</li>
        </ul>
        <div className="grid gap-2">
          {shortQs.map(renderQuestion)}
        </div>
      </section>

      <section className="panel p-4 space-y-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Simulated chart">
          {LAB_CHARTS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === chartId}
              onClick={() => {
                setChartId(c.id);
                setMark(undefined);
              }}
              className={cn("px-3 py-1.5 rounded-lg border text-[13px]", c.id === chartId ? "border-primary bg-primary/5 font-semibold" : "border-line hover:border-primary")}
              data-testid={`lab-tab-${c.id}`}
            >
              {c.title}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-muted">
          {LAB_LABEL} · {chart.blurb} Fixed seed, not market data.
        </p>
        <EmaMacdChart chart={chart} mark={mark} />
        <div className="grid gap-2">
          {chartQs.map(renderQuestion)}
        </div>
      </section>
      <p className="text-[12px] text-muted tabular-nums" data-testid="lab-score">
        {right} / {done} answered right · {qs.length} questions across the lesson and the three charts
      </p>
    </PracticeShell>
  );
}

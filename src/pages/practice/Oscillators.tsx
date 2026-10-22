import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import OscillatorChart from "../../components/practice/OscillatorChart";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { ATR_PERIOD, KDJ_PERIOD, OSC_BARS, OSC_CHARTS, OSC_LABEL, STOCH_PERIOD, VSTOP_MULT, OSC_PANELS, gradeOsc, oscQuestions, type OscChartId, type OscPanel } from "../../lib/oscillatorLab";
import { OSC_SOURCES } from "../../lib/oscillatorSources";
import { cn } from "../../lib/utils";


const term = (id: string, text: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">
    {text}
  </Link>
);

/** /practice/oscillators: stochastic, KDJ, RSI and an ATR volatility stop on 120-bar SIMULATED charts; quiz keys computed from the charts. */
export default function PracticeOscillators({ initialChart = "strong-climb" as OscChartId, initialAnswers = {} as Record<string, string> }) {
  const [chartId, setChartId] = useState<OscChartId>(initialChart);
  const [panel, setPanel] = useState<OscPanel>(OSC_PANELS[initialChart][0]!.id);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [mark, setMark] = useState<number | undefined>(undefined);
  const chart = OSC_CHARTS.find((c) => c.id === chartId)!;
  const qs = oscQuestions();
  const chartQs = qs.filter((q) => q.chartId === chartId);
  const done = qs.filter((q) => answers[q.id]).length;
  const right = qs.filter((q) => answers[q.id] && gradeOsc(q, answers[q.id]!)).length;

  const pick = (qid: string, oid: string, m: number | undefined, p: OscPanel) => {
    if (answers[qid]) return;
    setAnswers((a) => ({ ...a, [qid]: oid }));
    setPanel(p);
    if (m != null) setMark(m);
    markMiscPracticeDone("oscillators");
  };

  return (
    <PracticeShell
      title="Oscillators & volatility stop"
      blurb={`Stochastic, KDJ, RSI and an ATR volatility stop on ${OSC_BARS}-bar ${OSC_LABEL} charts. Every answer is computed from the chart. Educational, not trading advice.`}
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="oscillator-lesson">
        <p className="font-semibold text-[14px]">What these tools measure</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>RSI</strong> (0–100): above 70 is read as overbought, below 30 as oversold. Overbought does not guarantee a reversal; in a strong trend RSI can stay above 70
            for a long time.
          </li>
          <li>
            <strong>MACD</strong>: a cross above its signal line is commonly read as bullish, a cross below as bearish. It is often paired with RSI, and the two can disagree. See
            the <Link to="/practice/ema-macd" className="text-primary underline">EMA, SMA and MACD lab</Link>.
          </li>
          <li>
            <strong>{term("fast-stochastic", "Fast stochastic")}</strong>: %K = (close − lowest low of {STOCH_PERIOD} bars) ÷ (highest high − lowest low) × 100, and %D = the 3-bar
            SMA of %K. Above 80 is read as overbought, below 20 as oversold; %K crossing %D is the usual trigger. Being fast, it gives more false signals.{" "}
            <strong>{term("slow-stochastic", "Slow stochastic")}</strong> smooths %K with a 3-bar SMA first (slow %K equals fast %D), so it crosses less often.
          </li>
          <li>
            <strong>{term("kdj", "KDJ")}</strong>({KDJ_PERIOD}, 3, 3) is built from the same stochastic reading: K and D are smoothed versions of it and J = 3K − 2D. J amplifies the gap
            between K and D, leaves the 0–100 band, and gives more false turns when the market is choppy.
          </li>
          <li>
            <strong>Same family:</strong> RSI, the stochastic and KDJ are all {term("momentum-oscillator", "momentum oscillators")} built from the same prices. When they agree it is
            close to one reading, not independent confirmation.
          </li>
          <li>
            <strong>{term("average-true-range", "ATR")}</strong> is the average true range (including gaps), a measure of volatility, not direction. A{" "}
            <strong>{term("volatility-stop", "volatility stop")}</strong> trails the highest close by ATR({ATR_PERIOD}) × {VSTOP_MULT} in an uptrend, never moves down, and flips when the
            close breaks it: a rule-based {term("trailing-stop", "trailing stop")}. A stop level sets when you exit, not the price you get; a gap can open far through it (
            {term("gap-risk", "gap risk")}).
          </li>
          <li>
            <strong>{term("indicator-not-signal", "Indicators support a decision; they are not buy or sell signals.")}</strong> An entry still needs a{" "}
            {term("position-sizing", "position size")}, an exit plan and a defined risk limit.
          </li>
        </ul>
        <p className="text-[12px]">
          More practice:{" "}
          <Link to="/training?group=oscillators&start=1" className="text-primary underline">
            Learn · Oscillators &amp; Volatility Stops
          </Link>{" "}
          ·{" "}
          <Link to="/training?group=trading-risk&start=1" className="text-primary underline">
            Learn · Float, Short-Dated Options &amp; Risk
          </Link>
        </p>
      </section>

      <section className="panel p-4 space-y-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Simulated chart">
          {OSC_CHARTS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === chartId}
              onClick={() => {
                setChartId(c.id);
                setPanel(OSC_PANELS[c.id][0]!.id);
                setMark(undefined);
              }}
              className={cn("px-3 py-1.5 rounded-lg border text-[13px] min-h-[44px]", c.id === chartId ? "border-primary bg-primary/5 font-semibold" : "border-line hover:border-primary")}
              data-testid={`osc-tab-${c.id}`}
            >
              {c.title}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Lower panel">
          {OSC_PANELS[chartId].map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === panel}
              onClick={() => setPanel(p.id)}
              className={cn("px-2.5 py-1 rounded-md border text-[12px] min-h-[36px]", p.id === panel ? "border-primary bg-primary/5 font-semibold" : "border-line hover:border-primary")}
              data-testid={`osc-panel-${p.id}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-muted">
          {OSC_LABEL} · {chart.blurb} Fixed seed, not market data.
        </p>
        <OscillatorChart chart={chart} panel={panel} mark={mark} />
        <div className="grid gap-2">
          {chartQs.map((q) => {
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
                      onClick={() => pick(q.id, o.id, q.mark, q.panel)}
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
                  <p className="text-[12px]" data-testid="osc-feedback">
                    <strong className={gradeOsc(q, a) ? "text-up" : "text-accent-red"}>{gradeOsc(q, a) ? "Right. " : "Not quite. "}</strong>
                    {q.explanation}
                    {q.mark != null ? (
                      <button
                        type="button"
                        className="ml-1 text-primary underline"
                        onClick={() => {
                          setPanel(q.panel);
                          setMark(q.mark);
                        }}
                      >
                        Show D{q.mark + 1}
                      </button>
                    ) : null}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
      <p className="text-[12px] text-muted tabular-nums" data-testid="osc-score">
        {right} / {done} answered right · {qs.length} questions across the three charts
      </p>
      <section className="panel p-4 space-y-1" data-testid="osc-sources">
        <p className="font-semibold text-[13px]">Sources</p>
        <ul className="list-disc pl-5 text-[12px] space-y-0.5">
          {OSC_SOURCES.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                {s.title}
              </a>
              : {s.supports}
            </li>
          ))}
        </ul>
      </section>
    </PracticeShell>
  );
}

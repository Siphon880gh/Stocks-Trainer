import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { mergeAnnotations } from "../../lib/chartAnnotations";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  ORB_ANSWER_LABELS,
  ORB_ANSWERS,
  ORB_BY_ID,
  ORB_CAVEATS,
  ORB_DISCLAIMER,
  ORB_LINKS,
  ORB_OPTION_EXAMPLE,
  ORB_SESSIONS,
  ORB_SOURCE,
  ORB_STEPS,
  fmt,
  orbAnnotations,
  type OrbAnswer,
} from "../../lib/openingRange";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);

/** /practice/opening-range: the 15-minute opening range breakout on SAMPLE SPY.S sessions, with the caveats. */
export default function PracticeOpeningRange() {
  const [picks, setPicks] = useState<Record<string, OrbAnswer>>({});
  const choose = (id: string, v: OrbAnswer) => {
    if (picks[id]) return;
    const next = { ...picks, [id]: v };
    setPicks(next);
    if (ORB_SESSIONS.every((s) => next[s.id])) markMiscPracticeDone("opening-range");
  };
  const right = ORB_SESSIONS.filter((s) => picks[s.id] === s.answer).length;
  const example = ORB_BY_ID["orb-long"]!;
  const exampleAnn = orbAnnotations(example);
  const u = ORB_OPTION_EXAMPLE.underlying;

  return (
    <PracticeShell
      title="Opening range breakout (15-minute)"
      blurb={`Mark the first 30 minutes, wait for a 15-minute close outside the range, stop at the other end, target 1:1 on the underlying. ${ORB_DISCLAIMER}`}
    >
      <section className="panel p-4 space-y-3 text-[13px]" data-testid="orb-rules">
        <p className="font-semibold text-[14px]">The rules</p>
        <ol className="space-y-2">
          {ORB_STEPS.map((s) => (
            <li key={s.n} data-step={s.n}>
              <p className="font-medium">{s.n}. {s.title}: {s.rule}</p>
              <p className="text-[12px] text-muted">{s.detail}</p>
            </li>
          ))}
        </ol>
        <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
          <p className="text-[10px] text-muted px-2 pt-1">SAMPLE SPY.S, 15-minute candles (ET)</p>
          <CandlestickChart
            data={example.bars}
            annotations={mergeAnnotations(exampleAnn.before, exampleAnn.reveal)}
            height={260}
            padRightBars={4}
            showScaleControls={false}
            markerDecimals={2}
          />
        </div>
        <p className="text-[12px] text-muted">
          Range {fmt(u.rangeLow)}–{fmt(u.rangeHigh)}. The 10:15 candle only wicked above it; the 10:30 candle closed at {fmt(u.entry!)}. Stop {fmt(u.stop!)}, risk {fmt(u.risk!)}, 1:1 target {fmt(u.target!)}.
        </p>
        <p className="text-[12px]">
          Glossary: {term("opening-range", "opening range")} · {term("opening-range-breakout", "opening range breakout")} · {term("strike-price", "strike price")}
        </p>
        <p className="text-[11px] text-muted" data-testid="orb-source">
          Idea from a{" "}
          <a href={ORB_SOURCE.url} target="_blank" rel="noreferrer" className="text-primary underline">public Facebook reel</a>{" "}
          (may ask you to log in). {ORB_SOURCE.note}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="orb-caveats">
        <p className="font-semibold text-[14px]">What the rules leave out</p>
        {ORB_CAVEATS.map((c) => (
          <div key={c.id} data-caveat={c.id}>
            <p className="font-medium">{c.title}</p>
            <p className="text-[12px]">{c.text}</p>
          </div>
        ))}
        <div className="overflow-x-auto">
          <table className="text-[12px] w-full" data-testid="orb-option-table">
            <thead>
              <tr className="text-left text-muted">
                <th className="pr-3 font-medium">{fmt(ORB_OPTION_EXAMPLE.strike)} call (SAMPLE)</th>
                <th className="pr-3 font-medium">Delta</th>
                <th className="pr-3 font-medium">Paid</th>
                <th className="pr-3 font-medium">At 1:1 target</th>
                <th className="pr-3 font-medium">At stop</th>
                <th className="font-medium">Flat for 1 hour</th>
              </tr>
            </thead>
            <tbody>
              {ORB_OPTION_EXAMPLE.rows.map((r) => (
                <tr key={r.id} data-row={r.id}>
                  <td className="pr-3">{r.label}</td>
                  <td className="pr-3">{fmt(r.delta)}</td>
                  <td className="pr-3">{fmt(r.entry)}</td>
                  <td className="pr-3">{fmt(r.atTarget)} (+{r.targetPct}%)</td>
                  <td className="pr-3">{fmt(r.atStop)} ({r.stopPct}%)</td>
                  <td>{fmt(r.flat)} ({r.flatPct}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted">
          Black-Scholes with an assumed {ORB_OPTION_EXAMPLE.vol * 100}% volatility and no rates; real quotes add a bid-ask spread. Read more: {term("underlying-vs-premium-rr", "underlying vs premium")} · {term("gamma", "delta and gamma")} · {term("short-dated-option", "short-dated options")} · {term("pattern-day-trader", "the PDT rule (FINRA-sourced)")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="orb-drills">
        <p className="font-semibold text-[14px]">Your call at the highlighted candle</p>
        {ORB_SESSIONS.map((s) => {
          const picked = picks[s.id];
          const ann = orbAnnotations(s);
          return (
            <div key={s.id} className="panel p-3 space-y-2" data-drill={s.id}>
              <p className="font-medium">{s.title}</p>
              <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
                <CandlestickChart
                  data={picked ? s.bars : s.bars.slice(0, s.decisionIndex + 1)}
                  annotations={picked ? mergeAnnotations(ann.before, ann.reveal) : ann.before}
                  highlightIndex={s.decisionIndex}
                  height={200}
                  padRightBars={picked ? 2 : s.bars.length - s.decisionIndex + 1}
                  showScaleControls={false}
                  markerDecimals={2}
                />
              </div>
              <div className="flex flex-col gap-1">
                {ORB_ANSWERS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    disabled={!!picked}
                    onClick={() => choose(s.id, o)}
                    className={cn(
                      "text-left px-2 py-1.5 rounded border text-[12px]",
                      picked === o && o === s.answer && "bg-emerald-500/20 border-emerald-500",
                      picked === o && o !== s.answer && "bg-rose-500/20 border-rose-500",
                      picked && o === s.answer && picked !== o && "border-emerald-500/50",
                    )}
                  >
                    {ORB_ANSWER_LABELS[o]}
                  </button>
                ))}
              </div>
              {picked ? (
                <p className="text-[12px]" data-drill-result>
                  {picked === s.answer ? "Correct. " : "Not quite. "}
                  {s.why} {s.outcome}
                </p>
              ) : null}
            </div>
          );
        })}
        {ORB_SESSIONS.every((s) => picks[s.id]) ? (
          <p className="font-medium" data-testid="orb-score">{right} / {ORB_SESSIONS.length} correct</p>
        ) : null}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="orb-links">
        <p className="font-semibold text-[14px]">Keep going</p>
        <ul className="list-disc pl-5 space-y-1">
          {ORB_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-primary underline">{l.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </PracticeShell>
  );
}

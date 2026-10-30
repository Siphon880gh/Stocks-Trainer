import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { mergeAnnotations } from "../../lib/chartAnnotations";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  FVG_ANSWER_LABELS,
  FVG_ANSWERS,
  FVG_BY_ID,
  FVG_CAVEATS,
  FVG_DISCLAIMER,
  FVG_LINKS,
  FVG_SESSIONS,
  FVG_SOURCE,
  FVG_STEPS,
  FVG_THREE_CANDLES,
  fmt,
  fvgAnnotations,
  fvgPlan,
  type FvgAnswer,
} from "../../lib/fairValueGap";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);

/** /practice/fair-value-gap: breakout signal vs entry, gap vs no gap, and the pullback into the gap, on SAMPLE 5-minute tapes. */
export default function PracticeFairValueGap() {
  const [picks, setPicks] = useState<Record<string, FvgAnswer>>({});
  const choose = (id: string, v: FvgAnswer) => {
    if (picks[id]) return;
    const next = { ...picks, [id]: v };
    setPicks(next);
    if (FVG_SESSIONS.every((s) => next[s.id])) markMiscPracticeDone("fair-value-gap");
  };
  const right = FVG_SESSIONS.filter((s) => picks[s.id] === s.answer).length;
  const example = FVG_BY_ID["fvg-pullback"]!;
  const exampleAnn = fvgAnnotations(example);
  const p = fvgPlan(example.bars, example.level);
  const [g1, , g3] = FVG_THREE_CANDLES.gap;
  const [n1, , n3] = FVG_THREE_CANDLES.noGap;

  return (
    <PracticeShell
      title="Breakout, pullback and fair value gap"
      blurb={`Don't buy the breakout candle. Check whether the move left a gap, buy the pullback into it, stop below the gap and the level. ${FVG_DISCLAIMER}`}
    >
      <section className="panel p-4 space-y-3 text-[13px]" data-testid="fvg-rules">
        <p className="font-semibold text-[14px]">The setup</p>
        <ol className="space-y-2">
          {FVG_STEPS.map((s) => (
            <li key={s.n} data-step={s.n}>
              <p className="font-medium">{s.n}. {s.title}: {s.rule}</p>
              <p className="text-[12px] text-muted">{s.detail}</p>
            </li>
          ))}
        </ol>
        <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
          <p className="text-[10px] text-muted px-2 pt-1">SAMPLE stock, 5-minute candles (ET)</p>
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
          Resistance {fmt(example.level)}. The 10:30 candle broke out; the gap runs from the 10:25 high {fmt(p.gap!.bottom)} to the 10:35 low {fmt(p.gap!.top)}. Price pulled back into it at 10:50: entry {fmt(p.entry!)}, stop {fmt(p.stop!)}, risk {fmt(p.risk!)}, 2R example {fmt(p.target!)}.
        </p>
        <p className="text-[12px]">
          Glossary: {term("fair-value-gap", "fair value gap")} · {term("imbalance", "imbalance")} · {term("breakout-signal-vs-entry", "breakout signal vs entry")} · {term("breakout-retest", "breakout and retest")}
        </p>
        <p className="text-[11px] text-muted" data-testid="fvg-source">
          Idea from{" "}
          <a href={FVG_SOURCE.url} target="_blank" rel="noreferrer" className="text-primary underline">a short Facebook trading reel</a>{" "}
          (may ask you to log in). {FVG_SOURCE.note}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="fvg-gap-vs-no-gap">
        <p className="font-semibold text-[14px]">Gap or no gap?</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1" data-panel="gap">
            <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
              <CandlestickChart
                data={FVG_THREE_CANDLES.gap}
                annotations={{ zones: [{ fromIndex: 0, top: g3.low, bottom: g1.high, label: "GAP", tone: "demand", labelAt: "bottom" }] }}
                height={160}
                padRightBars={1}
                showScaleControls={false}
                markerDecimals={2}
              />
            </div>
            <p className="text-[12px]">GAP: candle 3's low {fmt(g3.low)} is above candle 1's high {fmt(g1.high)}.</p>
          </div>
          <div className="space-y-1" data-panel="no-gap">
            <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
              <CandlestickChart
                data={FVG_THREE_CANDLES.noGap}
                annotations={{ levels: [{ price: n1.high, label: "Candle 1 high", tone: "neutral" }] }}
                height={160}
                padRightBars={1}
                showScaleControls={false}
                markerDecimals={2}
              />
            </div>
            <p className="text-[12px]">NO GAP: candle 3's low {fmt(n3.low)} dips below candle 1's high {fmt(n1.high)}. The wicks overlap.</p>
          </div>
        </div>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="fvg-caveats">
        <p className="font-semibold text-[14px]">What the reel leaves out</p>
        {FVG_CAVEATS.map((c) => (
          <div key={c.id} data-caveat={c.id}>
            <p className="font-medium">{c.title}</p>
            <p className="text-[12px]">{c.text}</p>
          </div>
        ))}
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="fvg-drills">
        <p className="font-semibold text-[14px]">Your call at the highlighted candle</p>
        {FVG_SESSIONS.map((s) => {
          const picked = picks[s.id];
          const ann = fvgAnnotations(s);
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
                {FVG_ANSWERS.map((o) => (
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
                    {FVG_ANSWER_LABELS[o]}
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
        {FVG_SESSIONS.every((s) => picks[s.id]) ? (
          <p className="font-medium" data-testid="fvg-score">{right} / {FVG_SESSIONS.length} correct</p>
        ) : null}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fvg-links">
        <p className="font-semibold text-[14px]">Keep going</p>
        <ul className="list-disc pl-5 space-y-1">
          {FVG_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-primary underline">{l.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </PracticeShell>
  );
}

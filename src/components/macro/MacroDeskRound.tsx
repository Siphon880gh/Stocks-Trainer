import { Fragment, useState } from "react";
import type { Direction, Instrument } from "../../lib/macro/types";
import { getRelease } from "../../lib/macro/releases";
import { INSTRUMENT_NAMES, REGIME_BLURB, REGIME_NAMES } from "../../lib/macro/reactions";
import { answerKey, explainRound, scoreRound, whyNot, type MacroRound } from "../../lib/macro/game";
import ViewerForEvent from "./viewers/ViewerForEvent";
import ExpectationsPanel from "./ExpectationsPanel";
import FedPricingCard from "./FedPricingCard";
import ReactionChartView from "./ReactionChartView";

export type RoundPhase = "read" | "predict" | "reveal";
const CHOICES: { d: Direction; label: string; icon: string }[] = [
  { d: "up", label: "Up", icon: "north" },
  { d: "muted", label: "Little change", icon: "east" },
  { d: "down", label: "Down", icon: "south" },
];
const DIR_TEXT: Record<Direction, string> = { up: "Up", down: "Down", muted: "Little change" };

interface Props {
  round: MacroRound;
  onComplete?: (correct: number, total: number) => void;
  onNext?: () => void;
  /** Test / screenshot hooks. */
  initialPhase?: RoundPhase;
  initialAnswers?: Partial<Record<Instrument, Direction>>;
}

/** One Macro Desk round: read the (simulated) release, call the reaction, then see the tape. */
export default function MacroDeskRound({ round, onComplete, onNext, initialPhase = "read", initialAnswers = {} }: Props) {
  const e = getRelease(round.eventId)!;
  const [phase, setPhase] = useState<RoundPhase>(initialPhase);
  const [answers, setAnswers] = useState<Partial<Record<Instrument, Direction>>>(initialAnswers);
  const ready = round.instruments.every((i) => answers[i]);

  const header = (
    <div className="panel p-4 space-y-1" data-phase={phase}>
      <p className="text-[12px] text-muted">
        Macro Desk · {e.period} · {round.focus}
      </p>
      <p className="font-semibold">
        Regime: {REGIME_NAMES[e.regime]} <span className="font-normal text-muted text-sm">— {REGIME_BLURB[e.regime]}</span>
      </p>
      <ol className="flex gap-3 text-[12px] pt-1">
        {(["read", "predict", "reveal"] as const).map((p, i) => (
          <li key={p} className={phase === p ? "font-semibold text-primary" : "text-muted"}>
            {i + 1}. {p === "read" ? "Read the release" : p === "predict" ? "Make your calls" : "See the reaction"}
          </li>
        ))}
      </ol>
    </div>
  );

  if (phase === "read") {
    return (
      <div className="space-y-4">
        {header}
        {e.kind === "fomc" && <FedPricingCard month={e.month} />}
        <ExpectationsPanel event={e} revealed />
        <ViewerForEvent event={e} />
        <button type="button" onClick={() => setPhase("predict")} className="bg-primary hover:bg-primary-dim text-white font-semibold px-5 py-2.5 rounded-lg">
          Make my calls
        </button>
      </div>
    );
  }

  if (phase === "predict") {
    return (
      <div className="space-y-4">
        {header}
        <ExpectationsPanel event={e} revealed />
        <ReactionChartView eventId={e.id} instrument="index" revealed={false} height={220} />
        <section className="panel p-4 space-y-3" aria-label="Your calls">
          <p className="font-semibold">Where does each market go by the end of the session?</p>
          <p className="text-[12px] text-muted">Little change = the move stays small (roughly a quarter of a typical surprise move).</p>
          {round.instruments.map((i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <span className="w-40 text-sm">{INSTRUMENT_NAMES[i]}</span>
              {CHOICES.map((c) => (
                <button
                  key={c.d}
                  type="button"
                  aria-pressed={answers[i] === c.d}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: c.d }))}
                  className={`px-3 py-1.5 rounded-lg border text-sm inline-flex items-center gap-1 ${answers[i] === c.d ? "bg-primary text-white border-primary" : "border-line hover:bg-canvas"}`}
                >
                  <span className="material-symbols-outlined text-[16px]" aria-hidden>
                    {c.icon}
                  </span>
                  {c.label}
                </button>
              ))}
            </div>
          ))}
          <div className="flex gap-3">
            <button type="button" onClick={() => setPhase("read")} className="border border-line px-4 py-2 rounded-lg text-sm">
              Back to the release
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => {
                const s = scoreRound(round, answers);
                onComplete?.(s.correct, s.total);
                setPhase("reveal");
              }}
              className="bg-primary hover:bg-primary-dim disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-lg"
            >
              Lock in and reveal
            </button>
          </div>
        </section>
      </div>
    );
  }

  const key = answerKey(round);
  const score = scoreRound(round, answers);
  const ex = explainRound(round);
  return (
    <div className="space-y-4">
      {header}
      <section className="panel p-4 space-y-3" aria-label="Result">
        <p className="text-lg font-semibold">
          {score.correct} / {score.total} calls right
        </p>
        <p className="text-sm leading-relaxed">{ex.lead}</p>
        {ex.archetypeNote && <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded p-2">{ex.archetypeNote}</p>}
        <ul className="space-y-2">
          {round.instruments.map((i) => {
            const ok = score.results[i];
            return (
              <li key={i} className="text-sm border-t border-line pt-2">
                <span className={`font-semibold ${ok ? "text-up" : "text-accent-red"}`}>{ok ? "✓" : "✗"} {INSTRUMENT_NAMES[i]}</span>: {DIR_TEXT[key[i]]}
                {answers[i] && !ok ? <span className="text-muted"> (you said {DIR_TEXT[answers[i]!].toLowerCase()})</span> : null}
                <p className="text-muted">{ex.perInstrument[i]}</p>
                {!ok && answers[i] && <p className="text-[13px]">{whyNot(round, i, answers[i]!)}</p>}
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] text-muted">Simulated tendencies for learning, not a forecast or trading advice. Real reactions vary with positioning and other news.</p>
      </section>
      <div className="grid lg:grid-cols-2 gap-4">
        {round.instruments.map((i) => (
          <Fragment key={i}>
            <ReactionChartView eventId={e.id} instrument={i} showDaily={i === "index"} height={240} />
          </Fragment>
        ))}
      </div>
      {onNext && (
        <button type="button" onClick={onNext} className="bg-primary hover:bg-primary-dim text-white font-semibold px-5 py-2.5 rounded-lg">
          Next round
        </button>
      )}
    </div>
  );
}

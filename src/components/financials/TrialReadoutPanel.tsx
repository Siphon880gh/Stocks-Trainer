import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CandlestickChart from "../CandlestickChart";
import type { ChartAnnotations } from "../../lib/chartAnnotations";
import { FIN_DISCLAIMER, fmtK, fmtMonths, glossaryHref } from "../../lib/financials/format";
import SampleDataNote from "../SampleDataNote";
import { freeCashFlow } from "../../lib/financials/metrics";
import {
  READOUT_INDEX,
  TRIAL_READOUTS,
  followUpQuestion,
  readoutBars,
  resolveReadout,
  sizingQuestion,
  type ReadoutQuestion,
} from "../../lib/financials/trialReadouts";

export type ReadoutPhase = "setup" | "reveal";

interface Props {
  initialId?: string;
  initialPhase?: ReadoutPhase;
}

function Question({ q, picked, onPick, testId }: { q: ReadoutQuestion; picked?: string; onPick: (id: string) => void; testId: string }) {
  return (
    <div className="space-y-2" data-testid={testId}>
      <p className="text-[13px] text-ink">{q.prompt}</p>
      <div className="grid gap-1.5">
        {q.choices.map((c) => {
          const chosen = picked === c.id;
          const tone = !picked ? "border-line hover:border-primary" : c.id === q.answer ? "border-up bg-up/10" : chosen ? "border-accent-red bg-accent-red/10" : "border-line opacity-70";
          return (
            <button key={c.id} type="button" disabled={!!picked} onClick={() => onPick(c.id)} className={`text-left px-3 py-2 rounded-lg border text-[12px] ${tone}`}>
              <b className="font-mono mr-1">{c.id}</b> {c.label}
              {picked && chosen && c.feedback ? <span className="block text-[11px] text-muted mt-0.5">{c.feedback}</span> : null}
            </button>
          );
        })}
      </div>
      {picked ? (
        <p className="text-[12px] text-slate-300">
          {picked === q.answer ? "Right. " : "Not quite. "}
          {q.explanation}{" "}
          <Link to={glossaryHref(q.termId)} className="text-primary underline">
            Glossary
          </Link>
        </p>
      ) : null}
    </div>
  );
}

/** FE8.M1: biotech readout day. Size first (no outcome shown), then the reveal and a statements follow-up. */
export default function TrialReadoutPanel({ initialId, initialPhase = "setup" }: Props) {
  const [id, setId] = useState(initialId && TRIAL_READOUTS.some((r) => r.id === initialId) ? initialId : TRIAL_READOUTS[0]!.id);
  const [phase, setPhase] = useState<ReadoutPhase>(initialPhase);
  const [sizePick, setSizePick] = useState<string | undefined>();
  const [followPick, setFollowPick] = useState<string | undefined>();
  const readout = TRIAL_READOUTS.find((r) => r.id === id)!;
  const rr = resolveReadout(readout);
  const bars = useMemo(() => readoutBars(readout), [readout]);
  const sizing = sizingQuestion(readout);
  const follow = followUpQuestion(readout);
  const reveal = phase === "reveal";
  const last = rr.lastReported;
  const implied = readout.impliedMovePct / 100;
  const annotations: ChartAnnotations | undefined = reveal
    ? {
        levels: [
          { price: readout.priorClose, label: `Prior close ${readout.priorClose.toFixed(2)}`, tone: "neutral" },
          ...(rr.followOn ? [{ price: rr.followOn.price, label: `Follow-on $${rr.followOn.price.toFixed(2)}`, tone: "risk" as const }] : []),
        ],
        zones: [
          {
            fromIndex: READOUT_INDEX,
            toIndex: bars.length - 1,
            top: Math.round(readout.priorClose * (1 + implied) * 100) / 100,
            bottom: Math.round(readout.priorClose * (1 - implied) * 100) / 100,
            label: `Implied ±${readout.impliedMovePct}%`,
            tone: "neutral",
            labelAt: "bottom",
          },
        ],
        events: [{ index: READOUT_INDEX, label: "Readout", tone: "entry" }],
      }
    : undefined;

  const pick = (rid: string) => {
    setId(rid);
    setPhase("setup");
    setSizePick(undefined);
    setFollowPick(undefined);
  };

  return (
    <section className="relative space-y-3 pr-9" data-testid="trial-readout-panel">
      <SampleDataNote text={`Invented trials and drugs, not medical information. ${FIN_DISCLAIMER}`} />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Readout">
        {TRIAL_READOUTS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => pick(r.id)}
            aria-pressed={r.id === id}
            className={`px-3 py-1.5 rounded-lg border text-[12px] ${r.id === id ? "border-primary bg-primary/10 text-ink font-semibold" : "border-line bg-surface text-muted hover:text-ink"}`}
          >
            {r.trial} <span className="font-mono text-[10px]">{rr.company.quarters[r.quarterIndex]!.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="border border-line rounded-lg bg-surface p-3 space-y-2 text-[12px]">
          <p className="text-[13px] font-semibold text-ink">
            Going in · {rr.company.name} <span className="font-mono text-[10px] text-muted">{rr.company.ticker}</span>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {readout.setup.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="text-muted">
            Last reported ({last.label}): cash <b className="font-mono text-ink">{fmtK(last.balance.cash)}</b> · free cash flow{" "}
            <b className="font-mono text-ink">{fmtK(freeCashFlow(last))}</b> ·{" "}
            <Link to={glossaryHref("cash-runway")} className="underline decoration-dotted">
              runway
            </Link>{" "}
            <b className="font-mono text-ink">{fmtMonths(rr.runwayBefore)}</b>
          </p>
          <Question q={sizing} picked={sizePick} onPick={setSizePick} testId="readout-sizing" />
          {!reveal ? (
            <button
              type="button"
              disabled={!sizePick}
              onClick={() => setPhase("reveal")}
              className="px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] disabled:opacity-40"
              data-testid="readout-reveal-button"
            >
              Reveal the readout
            </button>
          ) : null}
        </div>
        <div className="border border-line rounded-lg bg-surface p-2">
          <CandlestickChart
            data={reveal ? bars : bars.slice(0, READOUT_INDEX)}
            height={280}
            showVolume
            showScaleControls={false}
            padRightBars={reveal ? 0 : bars.length - READOUT_INDEX}
            annotations={annotations}
          />
        </div>
      </div>

      {reveal ? (
        <div className="border border-line rounded-lg bg-surface p-3 space-y-2" data-testid="readout-reveal">
          <p className="text-[13px] font-semibold text-ink">“{readout.headline}”</p>
          <p className="text-[12px] text-slate-300">
            Gap {readout.gap > 0 ? "+" : ""}
            {(readout.gap * 100).toFixed(0)}% vs an implied ±{readout.impliedMovePct}%. {readout.whatMattered}
          </p>
          <Question q={follow} picked={followPick} onPick={setFollowPick} testId="readout-follow-up" />
        </div>
      ) : null}
    </section>
  );
}

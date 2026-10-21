import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CandlestickChart from "../CandlestickChart";
import { eventById, resolveEvent } from "../../lib/financials/earningsEvents";
import { fmtK, fmtMonths, fmtPct, fmtX, glossaryHref } from "../../lib/financials/format";
import { quarterMetrics } from "../../lib/financials/metrics";
import { generateReaction, revealAnnotations, EVENT_INDEX } from "../../lib/financials/reactionCharts";
import {
  FOLLOW_OPTIONS,
  PRINT_OPTIONS,
  PRINT_ROUNDS,
  type FollowThrough,
  type PrintOptionId,
  type PrintRound,
} from "../../lib/financials/readThePrint";
import {
  completedCount,
  correctCount,
  finishSession,
  loadPrintProgress,
  recordRound,
  roundPoints,
  savePrintProgress,
  type ReadThePrintProgress,
} from "../../lib/financials/readThePrintProgress";
import { getLiteracyTerm } from "../../lib/literacyTerms";
import EarningsPreviewCard from "./EarningsPreviewCard";
import IncomeStatementTable from "./IncomeStatementTable";

export type GamePhase = "read" | "answer" | "follow" | "reveal";

interface ReadThePrintGameProps {
  rounds?: PrintRound[];
  initialRoundIndex?: number;
  initialPhase?: GamePhase;
  initialChoice?: PrintOptionId;
  initialFollow?: FollowThrough | null;
  /** Disable localStorage (tests). */
  persist?: boolean;
}

/** Condensed pre-report view of the company: only quarters already reported. */
function PriorQuarters({ round }: { round: PrintRound }) {
  const r = resolveEvent(eventById(round.eventId)!);
  const k = r.event.quarterIndex;
  const start = Math.max(0, k - 4);
  const m = quarterMetrics(r.company, k - 1);
  const chips: [string, string, string][] = [
    ["Gross margin", fmtPct(m.grossMargin), "gross-margin"],
    ["Revenue YoY", fmtPct(m.revenueYoY), "income-statement"],
    ["Free cash flow", fmtK(m.freeCashFlow), "free-cash-flow"],
    ["Cash", fmtK(r.history[k - 1]!.balance.cash), "balance-sheet"],
  ];
  if (m.runwayMonths !== null) chips.push(["Runway", fmtMonths(m.runwayMonths), "cash-burn"]);
  if (m.netLeverage !== null && m.netDebt > 0) chips.push(["Net leverage", fmtX(m.netLeverage), "net-leverage"]);
  return (
    <div className="space-y-2" data-testid="prior-quarters">
      <IncomeStatementTable company={r.company} start={start} count={k - start} />
      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="text-muted self-center">Last reported quarter:</span>
        {chips.map(([label, value, term]) => (
          <Link key={label} to={glossaryHref(term)} className="px-2 py-1 rounded border border-line bg-surface hover:border-primary">
            {label} <b className="font-mono">{value}</b>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** "Read the Print": read statements + preview, call the reaction, then see the reveal (FE5.M2). */
export default function ReadThePrintGame({
  rounds = PRINT_ROUNDS,
  initialRoundIndex = 0,
  initialPhase = "read",
  initialChoice,
  initialFollow = null,
  persist = true,
}: ReadThePrintGameProps) {
  const [index, setIndex] = useState(Math.min(Math.max(0, initialRoundIndex), rounds.length - 1));
  const [phase, setPhase] = useState<GamePhase>(initialPhase);
  const [choice, setChoice] = useState<PrintOptionId | undefined>(initialChoice);
  const [follow, setFollow] = useState<FollowThrough | null>(initialFollow);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState<ReadThePrintProgress>(() => (persist ? loadPrintProgress() : loadPrintProgress(null)));

  const round = rounds[index]!;
  const event = eventById(round.eventId)!;
  const rc = useMemo(() => generateReaction(event), [event]);
  const preBars = useMemo(() => rc.bars.slice(0, EVENT_INDEX), [rc]);
  const reveal = phase === "reveal";
  const correct = choice === round.answer;
  const followCorrect = follow === null ? undefined : follow === round.followAnswer;

  const commit = (c: PrintOptionId, f: FollowThrough | null) => {
    const ok = c === round.answer;
    const fok = f === null ? undefined : f === round.followAnswer;
    setScore((s) => s + roundPoints(ok, fok));
    setAnswered((n) => n + 1);
    const next = recordRound(progress, round.id, ok, fok, new Date());
    setProgress(next);
    if (persist) savePrintProgress(next);
    setPhase("reveal");
  };

  const nextRound = () => {
    if (index + 1 >= rounds.length) {
      const fin = finishSession(progress, score);
      setProgress(fin);
      if (persist) savePrintProgress(fin);
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setPhase("read");
    setChoice(undefined);
    setFollow(null);
  };

  if (done) {
    return (
      <section className="border border-line rounded-lg bg-surface p-4 space-y-2" data-testid="rtp-summary">
        <h2 className="text-[15px] font-semibold text-ink">Session complete</h2>
        <p className="text-[13px] text-ink">
          Score <b>{score}</b> / {rounds.length * 3} · best ever <b>{progress.bestSessionScore}</b>
        </p>
        <p className="text-[12px] text-muted">
          {correctCount(progress)} of {completedCount(progress)} rounds called correctly across all sessions.
        </p>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg bg-primary text-white text-[13px]"
          onClick={() => {
            setDone(false);
            setIndex(0);
            setPhase("read");
            setChoice(undefined);
            setFollow(null);
            setScore(0);
            setAnswered(0);
          }}
        >
          Play again
        </button>
      </section>
    );
  }

  const ann = reveal ? revealAnnotations(rc, event) : null;
  const pickedLabel = PRINT_OPTIONS.find((o) => o.id === choice)?.label;
  const rightLabel = PRINT_OPTIONS.find((o) => o.id === round.answer)!.label;

  return (
    <section className="space-y-3" data-testid="rtp-game" data-phase={phase}>
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted">
        <span className="px-2 py-0.5 rounded border border-line bg-surface text-ink">
          Round {index + 1} / {rounds.length}
        </span>
        <span>
          Session score <b className="text-ink">{score}</b>
          {answered ? ` from ${answered} round${answered === 1 ? "" : "s"}` : ""}
        </span>
        <span className="ml-auto">
          {completedCount(progress)} played · best session {progress.bestSessionScore}
        </span>
      </div>

      <p className="text-[14px] text-ink font-medium">{round.prompt}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <EarningsPreviewCard event={event} revealActuals={reveal} compact />
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted">
            {reveal ? "Price around the report (with volume)" : "Price into the report (last 30 sessions)"}
          </p>
          <div data-testid="rtp-chart" data-bars={reveal ? rc.bars.length : preBars.length}>
            <CandlestickChart
              data={reveal ? rc.bars : preBars}
              height={300}
              showVolume
              showScaleControls={false}
              padRightBars={reveal ? 0 : rc.bars.length - EVENT_INDEX}
              annotations={ann?.annotations}
            />
          </div>
        </div>
      </div>

      {!reveal ? <PriorQuarters round={round} /> : null}

      {phase === "read" ? (
        <button type="button" className="px-4 py-2 rounded-lg bg-primary text-white text-[13px]" onClick={() => setPhase("answer")}>
          I've read it: make the call
        </button>
      ) : null}

      {phase === "answer" ? (
        <div className="space-y-2" data-testid="rtp-options">
          <p className="text-[13px] font-semibold text-ink">How does it trade on the report?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {PRINT_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                className="px-3 py-2 rounded-lg border border-line bg-surface text-[13px] text-ink text-left hover:border-primary"
                onClick={() => {
                  setChoice(o.id);
                  setPhase("follow");
                }}
              >
                <span className="font-mono text-muted mr-1">{o.id}</span> {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "follow" ? (
        <div className="space-y-2" data-testid="rtp-follow">
          <p className="text-[13px] text-ink">
            Your call: <b>{pickedLabel}</b>. Bonus: {round.followPrompt}
          </p>
          <div className="flex flex-wrap gap-2">
            {FOLLOW_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                className="px-3 py-1.5 rounded-lg border border-line bg-surface text-[13px] text-ink hover:border-primary"
                onClick={() => {
                  setFollow(f.id);
                  commit(choice!, f.id);
                }}
              >
                {f.label}
              </button>
            ))}
            <button type="button" className="px-3 py-1.5 text-[12px] text-muted underline" onClick={() => commit(choice!, null)}>
              Skip bonus
            </button>
          </div>
        </div>
      ) : null}

      {reveal ? (
        <div className="space-y-3" data-testid="rtp-reveal">
          <div className={`rounded-lg border p-3 ${correct ? "border-up bg-up/10" : "border-accent-red bg-accent-red/10"}`}>
            <p className="text-[14px] font-semibold text-ink">
              {correct ? "Correct" : "Not this time"}: it was <span data-testid="rtp-answer">{rightLabel}</span>
              {!correct && pickedLabel ? <span className="font-normal text-muted"> (you said {pickedLabel})</span> : null}
            </p>
            {followCorrect !== undefined ? (
              <p className="text-[12px] text-ink">
                Next {5} sessions: {FOLLOW_OPTIONS.find((f) => f.id === round.followAnswer)!.label.toLowerCase()} ·{" "}
                {followCorrect ? "bonus +1" : "no bonus"}
              </p>
            ) : null}
          </div>
          <p className="text-[13px] text-ink">{round.explanation}</p>
          <ul className="text-[12px] text-slate-300 list-disc pl-5 space-y-0.5">
            {round.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {!correct && choice && round.feedback[choice] ? (
            <p className="text-[12px] text-ink border-l-2 border-accent-red pl-2">
              Why not “{pickedLabel}”? {round.feedback[choice]}
            </p>
          ) : null}
          <details className="text-[12px] text-slate-300">
            <summary className="cursor-pointer text-muted">Why not the other answers?</summary>
            <ul className="list-disc pl-5 space-y-0.5 pt-1">
              {PRINT_OPTIONS.filter((o) => o.id !== round.answer).map((o) => (
                <li key={o.id}>
                  <b>{o.label}:</b> {round.feedback[o.id]}
                </li>
              ))}
            </ul>
          </details>
          {ann ? (
            <p className="text-[12px] text-muted">
              Learn the shape:{" "}
              {ann.relatedTermIds.map((id, i) => (
                <span key={id}>
                  {i ? " · " : ""}
                  <Link to={glossaryHref(id)} className="underline decoration-dotted hover:text-primary">
                    {getLiteracyTerm(id)?.name ?? id}
                  </Link>
                </span>
              ))}
            </p>
          ) : null}
          <button type="button" className="px-4 py-2 rounded-lg bg-primary text-white text-[13px]" onClick={nextRound}>
            {index + 1 >= rounds.length ? "Finish session" : "Next round →"}
          </button>
        </div>
      ) : null}

      <p className="text-[10px] text-muted">{round.disclaimer}</p>
    </section>
  );
}

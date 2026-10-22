import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { POINTS_PER_CORRECT, STREAK_BONUS } from "../../lib/quizData";
import { QUIZ_PASS_PCT, recordQuizScore } from "../../lib/progressStore";
import { ANSWER_STREAK_LABEL, ANSWER_STREAK_TIP } from "../../lib/streakLabels";
import {
  DIRECTION_ARROW, DIRECTION_LABEL, PRIOR_TREND_LABEL, WHICH_WAY_DISCLAIMER, WHICH_WAY_MIN_FOR_PASS, accuracyPct, feedbackLine,
  keyToDirection, loadWhichWay, roundsFor, saveWhichWay, scoreAnswer, emptyWhichWay,
  type PotentialDirection, type WhichWayMode, type WhichWayProgress,
} from "../../lib/whichWay";
import { cn } from "../../lib/utils";

const MODES: Array<{ id: WhichWayMode; label: string }> = [
  { id: "candles", label: "Candlesticks" },
  { id: "charts", label: "Chart patterns" },
  { id: "all", label: "All" },
];
const CHOICES: PotentialDirection[] = ["up", "down", "either"];
const KEYS: Record<PotentialDirection, string> = { up: "↑ or U", down: "↓ or D", either: "← → or E" };

/** /practice/which-way: every pattern with its prior trend drawn; pick Up, Down or Either. Resumable. */
export default function PracticeWhichWay() {
  const [prog, setProg] = useState<WhichWayProgress>(() => loadWhichWay());
  const [picked, setPicked] = useState<PotentialDirection | null>(null);
  const rounds = roundsFor(prog.mode);
  const idx = prog.index[prog.mode] % rounds.length;
  const round = rounds[idx]!;
  const pct = accuracyPct(prog);

  const update = (next: WhichWayProgress) => {
    saveWhichWay(next);
    setProg(next);
  };

  const answer = useCallback(
    (d: PotentialDirection) => {
      if (picked) return;
      setPicked(d);
      const next = scoreAnswer(prog, d === round.answer, POINTS_PER_CORRECT, STREAK_BONUS);
      update(next);
      recordQuizScore({ points: next.points, streak: next.streak, accuracy: accuracyPct(next) });
      if (next.answered >= WHICH_WAY_MIN_FOR_PASS && accuracyPct(next) >= QUIZ_PASS_PCT) markMiscPracticeDone("which-way");
    },
    [picked, prog, round],
  );

  const nextRound = useCallback(() => {
    setPicked(null);
    update({ ...prog, index: { ...prog.index, [prog.mode]: (idx + 1) % rounds.length } });
  }, [prog, idx, rounds.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (picked && (e.key === "Enter" || e.key.toLowerCase() === "n")) {
        e.preventDefault();
        nextRound();
        return;
      }
      const d = keyToDirection(e.key);
      if (d && !picked) {
        e.preventDefault();
        answer(d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, nextRound, picked]);

  const setMode = (mode: WhichWayMode) => {
    setPicked(null);
    update({ ...prog, mode });
  };
  const restart = () => {
    setPicked(null);
    update({ ...emptyWhichWay(), mode: prog.mode });
  };
  const correct = picked === round.answer;

  return (
    <PracticeShell
      title="Which Way?"
      blurb="Every candlestick and chart pattern in the Archive, drawn after its prior trend. Pick where price can go once the pattern is confirmed: Up, Down, or Either way. Learning drill, not trading advice."
    >
      <section className="panel p-3 flex flex-wrap items-center gap-2 text-[12px]" data-testid="ww-bar">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Which patterns">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={prog.mode === m.id}
              data-testid={`ww-mode-${m.id}`}
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-full border px-3 py-1",
                prog.mode === m.id ? "border-primary bg-primary text-white" : "border-line bg-surface hover:bg-primary/10",
              )}
            >
              {m.label} ({roundsFor(m.id).length})
            </button>
          ))}
        </div>
        <span className="ml-auto tabular-nums" data-testid="ww-score">
          <span className="font-semibold text-ink">{prog.points} pts</span>
          {" · "}
          {prog.right}/{prog.answered} right ({pct}%)
          {" · "}
          <span title={ANSWER_STREAK_TIP}>{ANSWER_STREAK_LABEL} {prog.streak}</span>
        </span>
      </section>

      <article className="panel p-4 space-y-3" data-testid="ww-round" data-pattern={round.id} data-answer={round.answer}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[15px] font-semibold">
            {round.name}
            <span className="ml-2 text-[11px] font-normal text-muted" data-testid="ww-position">
              {idx + 1} / {rounds.length}
            </span>
          </h2>
          <span className="text-[12px] rounded-full border border-line px-2 py-0.5" data-testid="ww-prior">
            {PRIOR_TREND_LABEL[round.prior]}
          </span>
        </div>
        <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
          <p className="text-[10px] text-muted px-2 pt-1">
            SIMULATED · first {round.lead} candles = prior trend · highlighted = the bar that completes the pattern
          </p>
          <CandlestickChart data={round.bars} height={220} showScaleControls={false} compact highlightIndex={round.end} />
        </div>
        <p className="text-[13px] font-medium" id="ww-question">Which way can price go once this pattern is confirmed?</p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="ww-question">
          {CHOICES.map((d) => (
            <button
              key={d}
              type="button"
              data-testid={`ww-pick-${d}`}
              disabled={!!picked}
              aria-pressed={picked === d}
              aria-keyshortcuts={d === "up" ? "ArrowUp u" : d === "down" ? "ArrowDown d" : "ArrowLeft ArrowRight e"}
              onClick={() => answer(d)}
              className={cn(
                "rounded-lg border px-2 py-3 text-[14px] font-semibold",
                !picked && "border-line bg-surface hover:border-primary",
                picked && d === round.answer && "border-emerald-500 bg-emerald-500/10",
                picked === d && d !== round.answer && "border-red-500 bg-red-500/10",
                picked && d !== round.answer && picked !== d && "border-line opacity-60",
              )}
            >
              <span aria-hidden>{DIRECTION_ARROW[d]}</span> {DIRECTION_LABEL[d]}
              <span className="block text-[10px] font-normal text-muted">{KEYS[d]}</span>
            </button>
          ))}
        </div>
        <div aria-live="polite" data-testid="ww-feedback">
          {picked ? (
            <div className={cn("rounded-lg border p-3 text-[13px] space-y-1", correct ? "border-emerald-500/60" : "border-red-500/60")}>
              <p className="font-semibold">{correct ? "Right." : `Not quite: you picked ${DIRECTION_LABEL[picked]}.`}</p>
              <p data-testid="ww-why">{feedbackLine(round)}</p>
              <p data-testid="ww-confirm"><span className="font-medium">Confirmation to wait for:</span> {round.confirm}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button type="button" onClick={nextRound} data-testid="ww-next" className="rounded-lg bg-primary text-white px-3 py-1.5 text-[13px]">
                  Next pattern (Enter)
                </button>
                <Link to={`/archive?open=${round.id}`} className="text-primary text-[12px] hover:underline">Open in the Archive</Link>
              </div>
            </div>
          ) : null}
        </div>
      </article>

      <section className="panel p-4 text-[12px] text-muted space-y-1" data-testid="ww-notes">
        <p>
          Up: bullish reversals after a decline and bullish continuations in an uptrend. Down: the bearish mirror. Either: indecision,
          compression or balance (doji, spinning top, inside bar, symmetrical triangle, broadening formation), where the break decides.
        </p>
        <p>
          Pass mark: {QUIZ_PASS_PCT}% after at least {WHICH_WAY_MIN_FOR_PASS} answers. Your place in each deck is saved, so you can leave and pick up
          where you stopped. {WHICH_WAY_DISCLAIMER}
        </p>
        <button type="button" onClick={restart} className="text-primary hover:underline" data-testid="ww-restart">Restart score</button>
        {" · "}
        <Link to="/practice/pattern-themes" className="text-primary hover:underline">Pattern themes</Link>
      </section>
    </PracticeShell>
  );
}

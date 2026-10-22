import { useState } from "react";
import { DAY_STREAK_LABEL, DAY_STREAK_TIP } from "../../lib/streakLabels";
import { Link } from "react-router-dom";
import type { AnswerLetter } from "../../lib/academy/types";
import { loadAcademy, saveAcademy, type KVStorage } from "../../lib/academy/storage";
import { recordDaily, todayPicks } from "../../lib/academy/today";
import { getUnit } from "../../lib/academy/content/levels";
import { glossaryHref } from "../../lib/academy/refs";
import { awardDaily, dailyFlash } from "../../lib/academy/rewards/award";
import { computeStreak } from "../../lib/academy/rewards/streak";
import { loadRewards } from "../../lib/academy/storage";
import { cn } from "../../lib/utils";

/** BA9.M2: Today card (Home + Academy hub): next unit, one spaced review question, a term, the challenge of the week. */
export default function TodayCard({ storage, now = () => new Date(), variant = "hub" }: { storage?: KVStorage; now?: () => Date; variant?: "home" | "hub" }) {
  const [state, setState] = useState(() => loadAcademy(storage).state);
  const [flash, setFlash] = useState<string | null>(null);
  const picks = todayPicks(state, now());
  const unit = picks.nextUnitId ? getUnit(picks.nextUnitId) : null;
  const q = picks.review;
  const answered = picks.answered;
  const streak = computeStreak(loadRewards(storage).state.streak.days, now());

  const answer = (id: AnswerLetter) => {
    if (!q || answered) return;
    const correct = id === q.correctAnswer;
    const next = recordDaily(loadAcademy(storage).state, picks.dateKey, q.id, correct, now());
    saveAcademy(next, storage);
    setState(next);
    const r = awardDaily(picks.dateKey, storage, now(), correct);
    setFlash(dailyFlash(r.added, correct));
  };

  return (
    <section className="panel p-4 space-y-3" data-testid="today-card" data-variant={variant} data-date={picks.dateKey}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold">
          <span className="material-symbols-outlined text-primary align-middle mr-1" aria-hidden>
            today
          </span>
          Today in the Academy
        </h2>
        <span className="text-[12px] text-muted tabular-nums" data-testid="today-streak" title={DAY_STREAK_TIP}>
          {DAY_STREAK_LABEL} {streak.current} {streak.current === 1 ? "day" : "days"}
          {streak.activeToday ? " · done today" : ""}
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-2 text-[13px]">
        {unit ? (
          <Link to={`/academy/${unit.id}`} className="border border-line rounded-lg p-2.5 hover:border-primary" data-testid="today-next-unit">
            <p className="text-[11px] text-muted">Next unit</p>
            <p className="font-medium">{unit.title}</p>
          </Link>
        ) : (
          <Link to="/academy" className="border border-line rounded-lg p-2.5 hover:border-primary">
            <p className="text-[11px] text-muted">Next unit</p>
            <p className="font-medium">All units done</p>
          </Link>
        )}
        <Link to={glossaryHref(picks.term.id)} className="border border-line rounded-lg p-2.5 hover:border-primary" data-testid="today-term">
          <p className="text-[11px] text-muted">Term of the day</p>
          <p className="font-medium">{picks.term.name}</p>
          <p className="text-[12px] text-muted line-clamp-2">{picks.term.summary}</p>
        </Link>
        <Link to={`/paper/challenges/${picks.challenge.id}`} className="border border-line rounded-lg p-2.5 hover:border-sim" data-testid="today-challenge">
          <p className="text-[11px] text-muted">Challenge of the week</p>
          <p className="font-medium">{picks.challenge.title}</p>
        </Link>
      </div>

      {q ? (
        <div className="space-y-1.5 border-t border-line pt-3" data-testid="today-review" data-question={q.id}>
          <p className="text-[11px] text-muted">Review question{getUnit(q.unitId) ? ` · from "${getUnit(q.unitId)!.title}"` : ""}</p>
          <p className="text-[13px] font-medium">{q.prompt}</p>
          <div className="grid sm:grid-cols-2 gap-1">
            {q.options.map((o) => {
              return (
                <button
                  key={o.id}
                  type="button"
                  disabled={!!answered}
                  onClick={() => answer(o.id)}
                  className={cn("text-left px-2.5 py-1.5 rounded-md border text-[12px]", answered && o.id === q.correctAnswer ? "border-up bg-up/5" : "border-line")}
                  data-option={o.id}
                >
                  <span className="font-semibold mr-1">{o.id}</span>
                  {o.label}
                </button>
              );
            })}
          </div>
          {answered ? (
            <p className="text-[12px]" data-testid="today-feedback">
              {answered.correct ? "Right. " : `Not quite: the answer is ${q.correctAnswer}. `}
              {q.explanation}
            </p>
          ) : null}
          {flash ? <p className="text-[12px] text-up font-semibold" data-testid="today-flash">{flash}</p> : null}
        </div>
      ) : (
        <p className="text-[12px] text-muted border-t border-line pt-3">Master a unit to get a daily review question here.</p>
      )}
    </section>
  );
}

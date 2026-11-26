import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUnit, UNIT_ORDER } from "../../lib/academy/content/levels";
import { nextUnit } from "../../lib/academy/progress";
import { computeStreak, dayKey } from "../../lib/academy/rewards/streak";
import { loadAcademy, loadRewards, saveAcademy, type KVStorage } from "../../lib/academy/storage";
import {
  actualPace, behind, categoryRecency, forecast, getRetention, goalMet, markDoneForToday, remainingUnits, setPace, staleCategories, todayCounts, weekly, UNIT_PATH,
} from "../../lib/academy/retention";

const fmtDate = (k: string) => new Date(`${k}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Learning retention panel on the Academy hub (weng/.agents/skills/learning-retention): today against your pace,
 * done-for-today, a gentle behind-pace note, the existing day streak (with its freeze), forecasts, stale levels,
 * the weekly recap and pace settings. Everything is local to this browser.
 */
export default function PacePanel({ storage, now = () => new Date() }: { storage?: KVStorage; now?: () => Date }) {
  const [state, setState] = useState(() => loadAcademy(storage).state);
  const save = (s: typeof state) => {
    saveAcademy(s, storage);
    setState(s);
  };
  const t = now();
  const r = getRetention(state);
  const c = todayCounts(state, t);
  const met = goalMet(state, t);
  const b = behind(state, t);
  const streak = computeStreak(loadRewards(storage).state.streak.days, t);
  const real = actualPace(state, t);
  const perDay = real ?? r.pace.unitsPerDay;
  const remaining = remainingUnits(state);
  const all = forecast(remaining, perDay, t);
  const nextId = nextUnit(state);
  const nextU = nextId ? getUnit(nextId) : undefined;
  const levelIds = nextId ? UNIT_ORDER.filter((id) => UNIT_PATH[id]?.[0] === UNIT_PATH[nextId]?.[0]) : [];
  const levelLeft = remainingUnits(state, levelIds);
  const levelFc = nextId ? forecast(levelLeft, perDay, t) : null;
  const stale = staleCategories(categoryRecency(state, t)).slice(0, 2);
  const w = weekly(state, t);
  const doneToday = r.doneForToday === dayKey(t);
  const [units, setUnits] = useState(String(r.pace.unitsPerDay));
  const [quizzes, setQuizzes] = useState(String(r.pace.quizzesPerDay));
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <section className="panel p-4 space-y-3" aria-labelledby="rt-pace-h" data-testid="pace-panel">
      <h2 id="rt-pace-h" className="text-[15px] font-semibold">
        Your pace
      </h2>
      <div aria-live="polite" className="space-y-1 text-[13px]">
        <p data-testid="pace-today">
          {c.units} of {plural(r.pace.unitsPerDay, "unit", "units")} today
          {r.pace.quizzesPerDay > 0 ? ` · ${c.quizzes} of ${plural(r.pace.quizzesPerDay, "review question", "review questions")}` : ""}
        </p>
        {met && !doneToday ? (
          <div className="flex flex-wrap items-center gap-2" data-testid="pace-met">
            <p className="font-semibold text-up">You met today's pace.</p>
            {nextU ? (
              <Link to={`/academy/${nextU.id}`} className="text-primary underline">
                Do one more
              </Link>
            ) : null}
            <button type="button" className="rounded border border-line px-2 py-0.5" onClick={() => save(markDoneForToday(loadAcademy(storage).state, now()))}>
              I'm done for today
            </button>
          </div>
        ) : null}
        {doneToday ? <p className="text-muted">Done for today. See you tomorrow.</p> : null}
        {b.owed > 0 && !met ? (
          <p className="text-muted" data-testid="pace-behind">
            You're {plural(b.owed, "unit", "units")} behind your pace over the last {plural(b.days, "day", "days")}. No pressure: catch up a little, or{" "}
            <a href="#rt-pace-settings" className="underline">
              lower your pace
            </a>
            .
          </p>
        ) : null}
        <p>
          Day streak: {plural(streak.current, "day", "days")} (best {streak.best}){streak.freezesAvailable ? " · 1 freeze saved" : ""}.
        </p>
        {all ? (
          <p data-testid="pace-forecast">
            {remaining === 0
              ? "Every unit is done."
              : `At ${real !== null ? "your current pace" : "your set pace"}, you'll finish the Academy by ${fmtDate(all.date)} (${plural(remaining, "unit", "units")} left).`}
          </p>
        ) : (
          <p className="text-muted">Set a pace above zero to see a finish date.</p>
        )}
        {levelFc && levelLeft > 0 && nextId ? (
          <p>
            {UNIT_PATH[nextId]?.[0]}: done by {fmtDate(levelFc.date)} ({plural(levelLeft, "unit", "units")} left).
          </p>
        ) : null}
        {stale.map((x) => (
          <p key={x.key} className="text-muted" data-testid="pace-stale">
            You haven't touched {x.key} in {x.days} days. A quick unit there keeps it fresh.
          </p>
        ))}
        <p className="text-muted" data-testid="pace-weekly">
          This week: {plural(w.units, "unit", "units")} · {plural(w.quizzes, "review question", "review questions")} · {plural(w.activeDays, "active day", "active days")}.
        </p>
      </div>
      <details id="rt-pace-settings" className="text-[13px]">
        <summary className="cursor-pointer font-semibold">Pace</summary>
        <form
          className="mt-2 flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            save(setPace(loadAcademy(storage).state, Number(units), Number(quizzes), now()));
            setSaved("Pace saved.");
          }}
        >
          <label className="flex flex-col gap-1">
            Units per day
            <input type="number" min={0} max={50} value={units} onChange={(e) => setUnits(e.target.value)} className="w-20 rounded border border-line bg-surface px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1">
            Review questions per day
            <input type="number" min={0} max={50} value={quizzes} onChange={(e) => setQuizzes(e.target.value)} className="w-20 rounded border border-line bg-surface px-2 py-1" />
          </label>
          <button type="submit" className="rounded bg-primary-fill px-3 py-1.5 font-semibold text-white">
            Save pace
          </button>
          {saved ? <span role="status">{saved}</span> : null}
        </form>
        <p className="mt-2 text-muted">Freezes: every 7 active days in a row earns one freeze (you can bank one). It covers a single missed day automatically.</p>
      </details>
    </section>
  );
}

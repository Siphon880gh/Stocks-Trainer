import { Fragment, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { LEVELS, getUnit } from "../../lib/academy/content/levels";
import { estMinutes } from "../../lib/academy/content/estimate";
import { loadAcademy, type KVStorage } from "../../lib/academy/storage";
import { academySummary, coursePct, isLevelComplete, isLevelUnlocked, levelPct, nextUnit, unitStatus, type UnitStatus } from "../../lib/academy/progress";
import { TEST_OUT_LEVELS } from "../../lib/academy/testOut";
import PlacementCard from "../../components/academy/PlacementCard";
import TodayCard from "../../components/academy/TodayCard";
import RewardsPanel from "../../components/academy/RewardsPanel";
import { cn } from "../../lib/utils";

const STATUS: Record<UnitStatus, { label: string; icon: string; cls: string }> = {
  locked: { label: "Locked", icon: "lock", cls: "text-muted" },
  available: { label: "Start", icon: "radio_button_unchecked", cls: "text-ink" },
  in_progress: { label: "In progress", icon: "pending", cls: "text-primary" },
  mastered: { label: "Mastered", icon: "check_circle", cls: "text-up" },
  tested_out: { label: "Tested out", icon: "fast_forward", cls: "text-up" },
};

/** /academy — Beginner Academy hub: placement, continue, the level map with courses and units. */
export default function AcademyHub({ storage, extra }: { storage?: KVStorage; extra?: ReactNode }) {
  const state = loadAcademy(storage).state;
  // the Today answer writes the rewards store; re-read it so points and the Day streak agree with the card
  const [rewardsTick, setRewardsTick] = useState(0);
  const sum = academySummary(state);
  const next = nextUnit(state);
  const nextU = next ? getUnit(next) : undefined;
  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full space-y-6" data-testid="academy-hub">
      <header className="space-y-2">
        <p className="text-[12px] text-muted">
          <Link to="/training" className="hover:text-ink">
            Learn
          </Link>{" "}
          · Beginner Academy
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Beginner Academy</h1>
        <p className="text-[14px] text-muted max-w-3xl">
          Short units from "what is a stock" to order types, statements, earnings and options basics. Each unit is a few cards and a 3-question check, and links into the
          drills, cases and coach sessions already in the app. Educational only; not investment advice.
        </p>
        <p className="text-[13px]" data-testid="academy-summary">
          {sum.unitsDone}/{sum.units} units done · {sum.levelsComplete}/{sum.levels} levels complete
        </p>
      </header>

      {nextU ? (
        <section className="panel p-4 flex flex-wrap items-center gap-4" data-testid="academy-continue">
          <div className="flex-1 min-w-60">
            <p className="font-semibold">{sum.unitsDone === 0 ? "Start here" : "Continue"}: {nextU.title}</p>
            <p className="text-[13px] text-muted">
              {nextU.levelId} · about {estMinutes(nextU)} min · {nextU.objective}
            </p>
          </div>
          <Link to={`/academy/${nextU.id}`} className="bg-primary hover:bg-primary-dim text-white font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-2">
            <span className="material-symbols-outlined" aria-hidden>
              play_arrow
            </span>
            {sum.unitsDone === 0 ? "Start" : "Continue"}
          </Link>
        </section>
      ) : null}

      {!state.placement ? <PlacementCard variant="hub" storage={storage} /> : null}

      <section className="grid sm:grid-cols-2 gap-3" aria-label="Practice with virtual money">
        <Link to="/paper" className="panel p-4 block hover:border-sim space-y-1" data-testid="hub-paper">
          <p className="font-semibold">
            <span className="material-symbols-outlined text-sim align-middle mr-1" aria-hidden>
              candlestick_chart
            </span>
            Paper trading
          </p>
          <p className="text-[13px] text-muted">Place market, limit, stop, stop-limit and trailing-stop orders with virtual money, one bar at a time.</p>
        </Link>
        <Link to="/paper/challenges" className="panel p-4 block hover:border-sim space-y-1" data-testid="hub-challenges">
          <p className="font-semibold">
            <span className="material-symbols-outlined text-sim align-middle mr-1" aria-hidden>
              flag
            </span>
            Challenges
          </p>
          <p className="text-[13px] text-muted">Short scenarios scored mostly on discipline: stops, size and patience.</p>
        </Link>
        <Link to="/academy/options" className="panel p-4 block hover:border-sim space-y-1 sm:col-span-2" data-testid="hub-options">
          <p className="font-semibold">
            <span className="material-symbols-outlined text-sim align-middle mr-1" aria-hidden>
              stacked_line_chart
            </span>
            Options knowledge ladder
          </p>
          <p className="text-[13px] text-muted">Four levels of options strategies with payoff charts at expiration and a check per level. Education only; it approves you for nothing.</p>
        </Link>
      </section>

      <TodayCard storage={storage} onAward={() => setRewardsTick((t) => t + 1)} />

      <Fragment key={rewardsTick}>
        <RewardsPanel storage={storage} />
      </Fragment>

      {extra}

      {LEVELS.map((lv) => {
        const unlocked = isLevelUnlocked(state, lv.id);
        const complete = isLevelComplete(state, lv.id);
        return (
          <section key={lv.id} className={cn("space-y-2", !unlocked && "opacity-80")} aria-label={`${lv.id} ${lv.title}`} data-level={lv.id} data-unlocked={unlocked ? "true" : "false"}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-[15px] font-semibold">
                {lv.id} · {lv.title}
              </h2>
              <span className="text-[12px] text-muted">
                {complete ? "Complete" : unlocked ? `${Math.round(levelPct(state, lv.id) * 100)}% done` : `Locked: finish ${lv.prerequisites.join(", ")} first (or test out)`}
              </span>
              {(TEST_OUT_LEVELS as string[]).includes(lv.id) && !complete ? (
                <Link to={`/academy/test-out/${lv.id}`} className="text-[12px] text-primary underline" data-testid={`test-out-${lv.id}`}>
                  Already know this? Test out
                </Link>
              ) : null}
            </div>
            <p className="text-[13px] text-muted max-w-3xl">{lv.summary}</p>
            <div className="grid md:grid-cols-2 gap-3">
              {lv.courses.map((c) => (
                <div key={c.id} className="panel p-3 space-y-2" data-course={c.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-[14px]">{c.title}</p>
                    <span className="text-[11px] text-muted">{Math.round(coursePct(state, c.id) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-line overflow-hidden" aria-hidden>
                    <div className="h-full bg-up" style={{ width: `${Math.round(coursePct(state, c.id) * 100)}%` }} />
                  </div>
                  <ul className="space-y-1">
                    {c.unitIds.map((id) => {
                      const u = getUnit(id)!;
                      const st = unitStatus(state, id);
                      const s = STATUS[st];
                      return (
                        <li key={id}>
                          <Link to={`/academy/${id}`} className="flex items-center gap-2 text-[13px] hover:text-primary" data-unit={id} data-status={st}>
                            <span className={cn("material-symbols-outlined text-base", s.cls)} aria-hidden>
                              {s.icon}
                            </span>
                            <span className="flex-1">{u.title}</span>
                            <span className="text-[11px] text-muted">
                              {s.label} · {estMinutes(u)} min
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}

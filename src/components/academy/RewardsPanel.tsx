import { BADGES } from "../../lib/academy/rewards/badges";
import { pointsBySource, totalPoints } from "../../lib/academy/rewards/ledger";
import { rankForPoints } from "../../lib/academy/rewards/levels";
import { computeStreak } from "../../lib/academy/rewards/streak";
import { POINTS_DISCLAIMER } from "../../lib/academy/copy";
import { loadRewards, type KVStorage } from "../../lib/academy/storage";
import { cn } from "../../lib/utils";

/** BA7.M5: points, rank bar, streak and badge grid. Virtual only. */
export default function RewardsPanel({ storage, now = new Date() }: { storage?: KVStorage; now?: Date }) {
  const r = loadRewards(storage).state;
  const pts = totalPoints(r.ledger);
  const rank = rankForPoints(pts);
  const streak = computeStreak(r.streak.days, now);
  const by = pointsBySource(r.ledger);
  const earned = BADGES.filter((b) => r.badges[b.id]).length;
  return (
    <section className="panel p-4 space-y-3" aria-label="Rewards" data-testid="rewards-panel">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <p className="font-semibold">
          {pts} practice points · Rank {rank.rank}: {rank.name}
        </p>
        <p className="text-[13px]" data-testid="streak">
          <span className="material-symbols-outlined text-base align-middle text-accent-red" aria-hidden>
            local_fire_department
          </span>{" "}
          {streak.current}-day streak{streak.freezesAvailable ? " · 1 freeze saved" : ""} · best {streak.best}
        </p>
        <p className="text-[12px] text-muted">
          {earned}/{BADGES.length} badges
        </p>
      </div>
      <div className="h-2 rounded-full bg-line overflow-hidden" aria-label={`Progress to the next rank ${Math.round(rank.progress * 100)}%`}>
        <div className="h-full bg-sim" style={{ width: `${Math.round(rank.progress * 100)}%` }} />
      </div>
      <p className="text-[11px] text-muted">
        {rank.next === null ? "Top rank reached." : `${rank.next - pts} points to the next rank.`} Units {by["unit-mastered"]} · test-outs {by["test-out"]} · challenges {by["challenge-passed"]} · daily {by["daily-goal"]} · options {by["options-level"]} · other {by["first-order"] + by["retro-credit"]}
      </p>
      <ul className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-2" aria-label="Badges">
        {BADGES.map((b) => {
          const got = !!r.badges[b.id];
          return (
            <li key={b.id} className={cn("rounded-lg border p-2 text-center space-y-0.5", got ? "border-sim/50 bg-sim/5" : "border-line opacity-70")} data-badge={b.id} data-earned={got ? "true" : "false"} title={got ? b.name : b.hint}>
              <span className={cn("material-symbols-outlined", got ? "text-sim" : "text-muted")} aria-hidden>
                {got ? b.icon : "lock"}
              </span>
              <p className="text-[11px] font-semibold leading-tight">{b.name}</p>
              {!got ? <p className="text-[10px] text-muted leading-tight">{b.hint}</p> : null}
            </li>
          );
        })}
      </ul>
      <p className="text-[11px] text-muted" data-testid="points-disclaimer">
        {POINTS_DISCLAIMER}
      </p>
    </section>
  );
}

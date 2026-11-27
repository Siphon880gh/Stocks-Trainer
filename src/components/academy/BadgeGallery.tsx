import { BADGES } from "../../lib/academy/rewards/badges";
import { daysAgo } from "../../lib/academy/retention";
import { loadRewards, type KVStorage } from "../../lib/academy/storage";

const time = (iso?: string) => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(t) ? t : 0;
};

/**
 * Every Academy badge, reviewable at any time: earned ones first (newest first) with the date earned and what
 * it was for, then locked ones with what unlocks them. The corner Badges button links here (/academy/diary#badges).
 */
export default function BadgeGallery({ storage, now = new Date(), id = "badges" }: { storage?: KVStorage; now?: Date; id?: string }) {
  const earned = loadRewards(storage).state.badges;
  const got = BADGES.filter((b) => earned[b.id]).sort((a, b) => time(earned[b.id]) - time(earned[a.id]));
  const locked = BADGES.filter((b) => !earned[b.id]);
  return (
    <section id={id} className="panel p-4 space-y-3 scroll-mt-20" aria-labelledby={`${id}-h`} data-testid="badge-gallery">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${id}-h`} className="text-[15px] font-semibold">
          Badges
        </h2>
        <p className="text-[12px] text-muted" data-testid="badge-count">
          {got.length} of {BADGES.length} earned
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {got.map((b) => {
          const at = earned[b.id]!;
          const ago = daysAgo(at, now);
          return (
            <li key={b.id} className="flex items-start gap-3 rounded-lg border border-sim/40 bg-sim/5 p-2" data-badge={b.id} data-earned="true">
              <span className="material-symbols-outlined text-sim" aria-hidden>
                {b.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight">{b.name}</p>
                <p className="text-[12px] text-muted leading-snug">{b.hint}</p>
                <p className="text-[12px] text-muted">
                  Earned{" "}
                  <time dateTime={at} data-badge-earned={at}>
                    {new Date(at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </time>{" "}
                  <span className="rounded-full border border-line px-2 text-[11px] tabular-nums" data-days-ago={ago.days}>
                    {ago.label}
                  </span>
                </p>
              </div>
            </li>
          );
        })}
        {locked.map((b) => (
          <li key={b.id} className="flex items-start gap-3 rounded-lg border border-line p-2" data-badge={b.id} data-earned="false">
            <span className="material-symbols-outlined text-muted" aria-hidden>
              lock
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium leading-tight text-muted">{b.name}</p>
              <p className="text-[12px] text-muted leading-snug">Locked. {b.hint}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

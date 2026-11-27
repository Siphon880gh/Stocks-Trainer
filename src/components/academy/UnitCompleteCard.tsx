import { useEffect, useState } from "react";
import { coreState } from "../../lib/academy/retentionChrome";
import { loadAcademy, type KVStorage } from "../../lib/academy/storage";
import { unitReviewState } from "../../lib/academy/retention";

/**
 * Unit completion control (learning-retention skill, section 3). A unit completes only by passing its
 * check (80% or more), so the control's action is "Take the check"; once passed it shows Completed with
 * a days-ago badge. "bottom" is the card at the end of the unit; "top" sits under the title and shows
 * only while the page is taller than 1.5 viewports. Both read the same state, so they stay in sync.
 * Markup and classes match the shared retention core so the corner chrome's styles theme it.
 */
type Ago = { short: string; long: string; date: string } | null;
const agoOf = (iso: string): Ago => {
  const C = (globalThis as unknown as { RetentionCore?: { daysAgo?: (s: string) => Ago } }).RetentionCore;
  return C && C.daysAgo ? C.daysAgo(iso) : null;
};

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7" />
    </svg>
  );
}

function AgoBadge({ iso }: { iso: string }) {
  const a = agoOf(iso);
  if (!a) return null;
  return (
    <span className="rt-ago" title={`Completed ${a.date}`} aria-label={`${a.long} (${a.date})`}>
      {a.short}
    </span>
  );
}

/** True while the document is taller than 1.5 viewports; re-checked on resize, after layout settles and on `tick`. */
export function useLongPage(tick: unknown) {
  const [long, setLong] = useState(false);
  useEffect(() => {
    const check = () => setLong(document.documentElement.scrollHeight > window.innerHeight * 1.5);
    check();
    const t = setTimeout(check, 900);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(check) : null;
    ro?.observe(document.body);
    window.addEventListener("resize", check);
    return () => { clearTimeout(t); ro?.disconnect(); window.removeEventListener("resize", check); };
  }, [tick]);
  return long;
}

export default function UnitCompleteCard({ unitId, place, storage, tick, onTakeCheck }: {
  unitId: string; place: "top" | "bottom"; storage?: KVStorage; tick: unknown; onTakeCheck: () => void;
}) {
  const long = useLongPage(tick);
  const c = (coreState(storage).completions as Record<string, { completedAt: string } | undefined>)[unitId];
  // Passing the retake on a later day is a review: half a unit, once a day (learning-retention, Re-complete / Reviewed).
  const rs = c ? unitReviewState(loadAcademy(storage).state, unitId) : "open";
  const doneWord = rs === "reviewed-today" ? "Reviewed" : "Completed";
  if (place === "top") {
    if (!long) return null;
    return (
      <div className="rt-ui rt-topdone" data-rt-top-complete="1" data-rt-state={c ? "done" : "open"}>
        {c ? (
          <>
            <span className="rt-top-chip"><Check /><span>{doneWord}</span><AgoBadge iso={c.completedAt} /></span>
            {rs === "reviewable" ? (
              <button type="button" className="rt-ghost rt-top-btn" data-rt-mark-review-top={unitId} onClick={onTakeCheck}>
                <Check /><span>Review: retake the check</span>
              </button>
            ) : null}
          </>
        ) : (
          <button type="button" className="rt-ghost rt-top-btn" data-rt-mark-complete-top={unitId} onClick={onTakeCheck}>
            <Check /><span>Take the check</span>
          </button>
        )}
      </div>
    );
  }
  return (
    <section className="rt-ui rt-done-card rt-complete" data-rt-complete-control="1" data-rt-state={c ? "done" : "open"} data-rt-review={rs} aria-label="Unit completion">
      <div className="rt-dc-head">
        <span className={c ? "rt-dc-ic rt-dc-ic--done" : "rt-dc-ic"} aria-hidden="true"><Check /></span>
        <div>
          <p className="rt-dc-title" data-rt-status="1">
            {c ? (<><span className="rt-done">{doneWord}</span> <AgoBadge iso={c.completedAt} /></>) : "Finished this unit?"}
          </p>
          <p className="rt-dc-sub">
            {rs === "reviewable"
              ? "You passed this unit's check. Passing it again today counts as a review: half a unit toward today's pace."
              : rs === "reviewed-today"
                ? "Reviewed today, counted as half a unit. Retake it again tomorrow to review it again."
                : rs === "done-today"
                  ? "You passed this unit's check today. From tomorrow, passing a retake counts as a review (half a unit)."
                  : "A unit completes when you pass its check (80% or more). Reading the cards never counts."}
          </p>
        </div>
      </div>
      <div className="rt-dc-act">
        {rs === "reviewed-today" ? (
          <button type="button" className="rt-ghost" data-rt-reviewed="1" aria-disabled="true" title="Reviewed today. Review it again tomorrow.">
            <Check />Reviewed
          </button>
        ) : (
          <button type="button" className={c ? "rt-ghost" : "rt-cta"} data-rt-mark-complete={unitId} data-rt-mark-review={rs === "reviewable" ? unitId : undefined} onClick={onTakeCheck}>
            {rs === "reviewable" ? "Review: retake the check" : c ? "Retake the check" : "Take the check"}
          </button>
        )}
      </div>
    </section>
  );
}

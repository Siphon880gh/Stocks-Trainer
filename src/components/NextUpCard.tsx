import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buildMapModel, readSnapshot } from "../lib/progressMap";
import { loadMapStore, normalizePath } from "../lib/mapProgress";
import { listCaseStudies, type CaseStudy } from "../lib/caseStudies";
import { loadProgress } from "../lib/progressStore";
import { BROWSE_ROUTE } from "../lib/appNav";
import { EVERYTHING_TRACK_ID, doneCount, isStepDone, nextSteps, type Track, type TrackProgress } from "../lib/tracks";
import { TrackPickerDialog } from "./TrackPicker";

/** Done state for track steps, from the progress map, visited pages and case results on this device. */
export function readTrackProgress(): TrackProgress {
  const model = buildMapModel(readSnapshot());
  const visited = new Set(loadMapStore().visited.map(normalizePath));
  const results = loadProgress().state.caseResults ?? {};
  return {
    stageStatus: (id) => model.states[id]?.status,
    visited,
    packPlayed: (pack) => listCaseStudies(pack as CaseStudy["packId"]).some((c) => results[c.id] != null),
  };
}

/** Home: the learner's track and only its next 1–3 steps, with the whole path and Browse everything a click away. */
export default function NextUpCard({ track }: { track: Track }) {
  const progress = useMemo(() => readTrackProgress(), []);
  const [changing, setChanging] = useState(false);
  const everything = track.id === EVERYTHING_TRACK_ID;
  const next = nextSteps(track, progress);
  const done = doneCount(track, progress);

  return (
    <section className="panel p-4 space-y-3" aria-labelledby="next-up-title" data-testid="next-up" data-track={track.id}>
      <div className="flex flex-wrap items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[26px]" aria-hidden>{track.icon}</span>
        <div className="flex-1 min-w-[180px]">
          <h2 id="next-up-title" className="text-lg font-semibold tracking-tight">
            <span className="sr-only">Your path: </span>
            {track.title}
          </h2>
          {everything ? (
            <p className="text-[12px] text-muted">Every section is open. Start from the full catalog, the Table of Contents or the map.</p>
          ) : (
            <p className="text-[12px] text-muted" data-testid="next-up-count">Your path · {done} of {track.steps.length} steps done</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setChanging(true)}
          className="rounded-lg border border-line px-3 py-1.5 text-[13px] hover:bg-canvas"
          data-testid="next-up-change"
        >
          Change path
        </button>
      </div>

      {next.length ? (
        <ol className="space-y-2">
          {next.map((s, i) => (
            <li key={s.to + s.label}>
              <Link
                to={s.to}
                data-testid="next-up-step"
                className={
                  i === 0
                    ? "flex items-center justify-between gap-3 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary-dim"
                    : "flex items-center justify-between gap-3 rounded-lg border border-line px-4 py-2 text-sm hover:bg-canvas"
                }
              >
                <span>{i === 0 && !everything ? "Next up: " : ""}{s.label}</span>
                <span className="material-symbols-outlined text-[18px]" aria-hidden>arrow_forward</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm" data-testid="next-up-complete">
          Path complete. Pick another path, or open anything in Browse everything.
        </p>
      )}

      {!everything ? (
        <details className="text-sm" data-testid="next-up-all">
          <summary className="cursor-pointer text-muted hover:text-ink">See the whole path ({track.steps.length} steps)</summary>
          <ol className="mt-2 space-y-1 list-decimal pl-5">
            {track.steps.map((s) => {
              const ok = isStepDone(s, progress);
              return (
                <li key={s.to + s.label}>
                  <Link to={s.to} className={ok ? "text-muted line-through" : "text-primary hover:underline"}>{s.label}</Link>
                  {ok ? <span className="sr-only"> (done)</span> : null}
                </li>
              );
            })}
          </ol>
        </details>
      ) : null}

      <p className="text-[13px] border-t border-line pt-3">
        Want more than your path?{" "}
        <Link to={BROWSE_ROUTE} className="text-primary font-semibold hover:underline" data-testid="next-up-browse">
          Browse everything
        </Link>
      </p>
      <TrackPickerDialog open={changing} onClose={() => setChanging(false)} />
    </section>
  );
}

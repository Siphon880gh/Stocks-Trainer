import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EVERYTHING_TRACK_ID, TRACKS, getTrack, loadTrackId, saveTrackId } from "../lib/tracks";
import { confirmPathSelection, isPathConfirmed } from "../lib/progressStore";
import { cn } from "../lib/utils";
import { Z } from "../lib/zLayers";

/** The saved track id, kept in step with picks made anywhere on the page. */
export function useTrackId(): string | null {
  const [id, setId] = useState<string | null>(() => loadTrackId());
  useEffect(() => {
    const sync = () => setId(loadTrackId());
    window.addEventListener("track-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("track-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return id;
}

/** Save the track. The first pick also confirms the matching milestone path; later picks never reset progress. */
export function pickTrack(id: string): void {
  const track = getTrack(id);
  if (!track) return;
  if (!isPathConfirmed()) confirmPathSelection(track.pathId);
  saveTrackId(id);
}

/** Short path picker: seven learner tracks plus Show me everything. */
export default function TrackPicker({
  currentId,
  onPicked,
  headingId = "track-picker-title",
}: {
  currentId?: string | null;
  onPicked?: (id: string) => void;
  headingId?: string;
}) {
  return (
    <section className="panel p-4 space-y-3" aria-labelledby={headingId} data-testid="track-picker">
      <div>
        <h2 id={headingId} className="text-lg font-semibold tracking-tight">What do you want to learn?</h2>
        <p className="text-sm text-muted">
          Pick a path and Home shows only your next few steps. Change it anytime; your progress stays. Everything else is one click away in Browse everything. Not sure? Start with New to stocks.
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {TRACKS.map((t) => {
          const on = t.id === currentId;
          return (
            <li key={t.id}>
              <button
                type="button"
                data-testid={`track-option-${t.id}`}
                aria-pressed={on}
                onClick={() => {
                  pickTrack(t.id);
                  onPicked?.(t.id);
                }}
                className={cn(
                  "w-full h-full text-left rounded-lg border px-3 py-2.5 flex items-start gap-2.5 transition-colors",
                  on ? "border-primary bg-primary/10" : "border-line hover:bg-canvas",
                  t.id === EVERYTHING_TRACK_ID ? "border-dashed" : "",
                )}
              >
                <span className="material-symbols-outlined text-[22px] text-primary shrink-0" aria-hidden>{t.icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{t.title}</span>
                  <span className="block text-[12px] text-muted">{t.blurb}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The picker as a dialog, opened from the header path chip or the Next up card. */
export function TrackPickerDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const currentId = useTrackId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Hide the corner AI helper while the dialog is open so it never sits on top of the backdrop (see index.css).
    document.body.classList.add("overlay-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("overlay-open");
    };
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div style={{ zIndex: Z.modal }} className="fixed inset-0 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="track-dialog-title" data-testid="track-dialog">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl mt-10 bg-surface rounded-xl shadow-lg">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-2 top-2 p-2 rounded hover:bg-primary/10 text-muted">
          <span className="material-symbols-outlined" aria-hidden>close</span>
        </button>
        <TrackPicker currentId={currentId} onPicked={onClose} headingId="track-dialog-title" />
      </div>
    </div>,
    document.body,
  );
}

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SAMPLE_DATA_NOTE } from "../lib/learnerCopy";
import { cn } from "../lib/utils";

export { SAMPLE_DATA_NOTE };

/**
 * Shield in the top-right of a text panel. The disclaimer stays out of the
 * reading flow until hover or click. Parent should be `relative` for the
 * corner placement.
 */
export default function SampleDataNote({
  text = SAMPLE_DATA_NOTE,
  placement = "corner",
}: {
  text?: string;
  /** `corner` sits on the panel. `inline` sits in an existing header cluster. */
  placement?: "corner" | "inline";
}) {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const open = pinned || hover;
  const btnRef = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<number | null>(null);
  const tipId = useId();
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const show = () => {
    if (hideTimer.current != null) window.clearTimeout(hideTimer.current);
    setHover(true);
  };
  const hideSoon = () => {
    if (hideTimer.current != null) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setHover(false), 160);
  };

  const place = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 240;
    const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
    setPos({ top: rect.bottom + 6, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    place();
  }, [open]);

  useEffect(() => {
    if (!pinned) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (btnRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-sample-note-tip]")) return;
      setPinned(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPinned(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  return (
    <div className={cn(placement === "corner" && "absolute top-2 right-2 z-20")}>
      <button
        ref={btnRef}
        type="button"
        data-testid="sample-data-note"
        aria-label="Practice data notice"
        aria-expanded={open}
        aria-describedby={tipId}
        onMouseEnter={show}
        onMouseLeave={hideSoon}
        onFocus={show}
        onBlur={hideSoon}
        onClick={() => setPinned((on) => !on)}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-muted hover:text-ink",
          open && "text-ink border-ink/30",
        )}
      >
        <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden>
          shield
        </span>
      </button>
      <span id={tipId} className="sr-only">
        {text}
      </span>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              data-sample-note-tip
              role="tooltip"
              onMouseEnter={show}
              onMouseLeave={hideSoon}
              className="fixed z-[400] w-60 rounded-md border border-line bg-surface px-2.5 py-2 text-[12px] leading-relaxed text-muted shadow-md"
              style={{ top: pos.top, left: pos.left }}
            >
              {text}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

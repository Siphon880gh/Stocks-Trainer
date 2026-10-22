import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Z } from "../lib/zLayers";
import type { WalkthroughStep } from "../lib/tourProgress";
export type { WalkthroughStep };


interface Rect { top: number; left: number; width: number; height: number }

/**
 * Popover walkthrough ("narrative"). Rendered in a portal on document.body with the top z-index tokens, so it
 * is always above charts, headers and modals. While open, a backdrop blocks the page; Exit (or Esc) removes it
 * and leaves the page fully interactive. ←/→ step, Esc exits. Controlled: the page owns `index`.
 */
export default function Walkthrough({
  steps,
  index,
  onIndexChange,
  onExit,
  label,
}: {
  steps: WalkthroughStep[];
  index: number;
  onIndexChange: (i: number) => void;
  onExit: () => void;
  label: string;
}) {
  const step = steps[Math.min(Math.max(0, index), steps.length - 1)]!;
  const [rect, setRect] = useState<Rect | null>(null);
  const [vw, setVw] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
  const [popH, setPopH] = useState(220);
  const popRef = useRef<HTMLDivElement>(null);
  const last = index >= steps.length - 1;

  const measure = useCallback(() => {
    setVw(window.innerWidth);
    const el = step.target ? document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`) : null;
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step.target]);

  // Scroll the target into view (below the sticky header), then measure.
  useLayoutEffect(() => {
    const el = step.target ? document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`) : null;
    if (el) {
      const r = el.getBoundingClientRect();
      const mobile = window.innerWidth < 640;
      const want = mobile ? 100 : Math.max(80, (window.innerHeight - r.height) / 2 - 80);
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - want), behavior: "auto" });
    }
    measure();
  }, [index, step.target, measure]);

  useEffect(() => {
    const on = () => measure();
    window.addEventListener("resize", on);
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("resize", on); window.removeEventListener("scroll", on); };
  }, [measure]);

  useEffect(() => {
    if (popRef.current) setPopH(popRef.current.offsetHeight);
  }, [index, vw]);

  useEffect(() => {
    popRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onExit(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); if (!last) onIndexChange(index + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); if (index > 0) onIndexChange(index - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, last, onExit, onIndexChange]);

  const mobile = vw < 640;
  const popW = mobile ? vw - 16 : Math.min(360, vw - 32);
  let style: CSSProperties;
  if (mobile || !rect) {
    style = mobile
      ? { position: "fixed", left: 8, right: 8, bottom: 8 }
      : { position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: popW };
  } else {
    const below = rect.top + rect.height + 12;
    const top = below + popH < window.innerHeight - 8 ? below : Math.max(8, rect.top - popH - 12);
    const left = Math.min(Math.max(8, rect.left), vw - popW - 16);
    style = { position: "fixed", top, left, width: popW };
  }

  if (typeof document === "undefined") return null;
  return createPortal(
    <>
      <div
        data-testid="tour-backdrop"
        aria-hidden="true"
        className="fixed inset-0 bg-black/30"
        style={{ zIndex: Z.tourBackdrop }}
      />
      {rect && (
        <div
          aria-hidden="true"
          className="fixed rounded-lg ring-4 ring-primary pointer-events-none"
          style={{ zIndex: Z.tourHighlight, top: rect.top - 4, left: rect.left - 4, width: rect.width + 8, height: rect.height + 8 }}
        />
      )}
      <div
        ref={popRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${label} walkthrough`}
        tabIndex={-1}
        data-testid="tour-popover"
        data-step={step.id}
        className="rounded-lg border-2 border-line bg-surface shadow-xl p-4 text-[13px] space-y-2 outline-none"
        style={{ ...style, zIndex: Z.tourPopover }}
      >
        <p className="text-[11px] text-muted" aria-live="polite" data-testid="tour-count">
          Step {index + 1} of {steps.length} · {label}
        </p>
        <p className="font-semibold text-[14px]">{step.title}</p>
        <p className="whitespace-pre-line max-h-[40vh] overflow-y-auto">{step.body}</p>
        <div className="flex items-center gap-2 pt-1">
          <button type="button" data-testid="tour-prev" onClick={() => onIndexChange(index - 1)} disabled={index === 0}
            className="panel px-3 py-1 text-[12px] disabled:opacity-40">← Prev</button>
          {last ? (
            <button type="button" data-testid="tour-finish" onClick={onExit} className="panel px-3 py-1 text-[12px] ring-2 ring-primary">Finish</button>
          ) : (
            <button type="button" data-testid="tour-next" onClick={() => onIndexChange(index + 1)} className="panel px-3 py-1 text-[12px] ring-2 ring-primary">Next →</button>
          )}
          <button type="button" data-testid="tour-exit" onClick={onExit} className="ml-auto text-[12px] underline">Exit to explore</button>
        </div>
        <p className="text-[10px] text-muted">← → to step · Esc to exit</p>
      </div>
    </>,
    document.body,
  );
}


import { Fragment, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { splitEarningsJargon, type EarningsJargonTerm } from "../lib/earningsJargon";

interface JargonTextProps {
  text: string;
  /** Replacement for a stretch of copy that is not an earnings-desk phrase. */
  renderPlain?: (text: string) => ReactNode;
  /**
   * Inside a button or link: render terms without their own ⓘ (a nested interactive would steal the tap).
   * Put a <GlossaryButtons> / <WithGlossary> next to the control instead (Weng 2026-10-22).
   */
  plain?: boolean;
}

export default function JargonText({ text, renderPlain, plain }: JargonTextProps) {
  const parts = splitEarningsJargon(text);
  if (!renderPlain && parts.length === 1 && !parts[0]?.term) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        part.term ? (
          plain ? (
            <span key={i} className="underline decoration-dotted decoration-primary/50 underline-offset-2" data-term={part.term.id}>
              {part.text}
            </span>
          ) : (
            <span key={i}>
              <JargonMark matched={part.text} term={part.term} />
            </span>
          )
        ) : renderPlain ? (
          <span key={i}>{renderPlain(part.text)}</span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

/** Distinct glossary terms in a text, in first-seen order. */
export function jargonTerms(...texts: (string | undefined)[]): EarningsJargonTerm[] {
  const seen = new Map<string, EarningsJargonTerm>();
  for (const t of texts) for (const p of splitEarningsJargon(t ?? "")) if (p.term && !seen.has(p.term.id)) seen.set(p.term.id, p.term);
  return [...seen.values()];
}

function useGlossaryPopover<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const closeTimer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState({ left: 8, top: 8, width: 288 });
  const pinned = useRef(false);
  const clearClose = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  useEffect(() => () => clearClose(), []);
  const place = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(288, window.innerWidth - 16);
    let left = r.left;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    if (left < 8) left = 8;
    const estimated = 112;
    let top = r.bottom + 6;
    if (top + estimated > window.innerHeight - 8) top = Math.max(8, r.top - estimated - 6);
    setBox({ left, top, width });
  };
  const show = () => {
    clearClose();
    place();
    setOpen(true);
  };
  const scheduleClose = () => {
    if (pinned.current) return;
    clearClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };
  // A tap fires hover/focus (which open) before click, so click pins the tip open rather than flipping it;
  // a second click, Escape or leaving focus unpins and closes it.
  const toggle = () => {
    if (pinned.current) {
      pinned.current = false;
      setOpen(false);
    } else {
      pinned.current = true;
      show();
    }
  };
  const close = () => {
    pinned.current = false;
    setOpen(false);
  };
  const blur = () => {
    pinned.current = false;
    scheduleClose();
  };
  return { ref, open, setOpen: (v: boolean) => (v ? show() : close()), box, show, scheduleClose, blur, toggle };
}

function Tip({ term, box, onEnter, onLeave }: { term: EarningsJargonTerm; box: { left: number; top: number; width: number }; onEnter: () => void; onLeave: () => void }) {
  return (
    <span
      role="tooltip"
      className="fixed z-[260] p-3 rounded-lg border-2 border-line bg-background-dark shadow-lg text-left normal-case not-italic font-normal tracking-normal"
      style={{ left: box.left, top: box.top, width: box.width }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">{term.name}</span>
      <span className="block text-[13px] text-slate-300 leading-snug">{term.summary}</span>
    </span>
  );
}

function JargonMark({ matched, term }: { matched: string; term: EarningsJargonTerm }): ReactElement {
  const p = useGlossaryPopover<HTMLSpanElement>();
  return (
    <>
      {matched}
      <span
        ref={p.ref}
        tabIndex={0}
        aria-label={`About ${term.name}`}
        aria-expanded={p.open}
        className="inline-flex align-text-bottom ml-0.5 text-primary cursor-help rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        onMouseEnter={p.show}
        onMouseLeave={p.scheduleClose}
        onFocus={p.show}
        onBlur={p.blur}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          p.toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            p.setOpen(false);
          }
        }}
      >
        <span className="material-symbols-outlined text-[15px] leading-none" aria-hidden>
          info
        </span>
      </span>
      {p.open ? <Tip term={term} box={p.box} onEnter={p.show} onLeave={p.scheduleClose} /> : null}
    </>
  );
}

/** One glossary ⓘ as its own button: labelled, focusable after its control, 44 px target on mobile. */
function GlossaryButton({ term, showName }: { term: EarningsJargonTerm; showName: boolean }): ReactElement {
  const p = useGlossaryPopover<HTMLButtonElement>();
  return (
    <>
      <button
        ref={p.ref}
        type="button"
        aria-label={`About ${term.name}`}
        aria-expanded={p.open}
        title={`About ${term.name}`}
        data-glossary-term={term.id}
        className="inline-flex shrink-0 items-center justify-center gap-0.5 min-h-11 min-w-11 sm:min-h-7 sm:min-w-7 px-1 rounded-md text-primary text-[11px] hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        onMouseEnter={p.show}
        onMouseLeave={p.scheduleClose}
        onFocus={p.show}
        onBlur={p.blur}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          p.toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            p.setOpen(false);
          }
        }}
      >
        <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden>
          info
        </span>
        {showName ? <span aria-hidden>{term.name}</span> : null}
      </button>
      {p.open ? <Tip term={term} box={p.box} onEnter={p.show} onLeave={p.scheduleClose} /> : null}
    </>
  );
}

/** The ⓘ buttons for every glossary term in `texts`, for placing next to (never inside) a button or link. */
export function GlossaryButtons({ texts, className }: { texts: (string | undefined)[]; className?: string }) {
  const terms = jargonTerms(...texts);
  if (!terms.length) return null;
  return (
    <span className={`inline-flex flex-wrap items-start gap-0.5 ${className ?? ""}`} data-testid="glossary-buttons">
      {terms.map((t) => (
        <Fragment key={t.id}>
          <GlossaryButton term={t} showName={terms.length > 1} />
        </Fragment>
      ))}
    </span>
  );
}

/** A choice control with its glossary ⓘ buttons beside it. With no terms, just the control. */
export function WithGlossary({ texts, children, className }: { texts: (string | undefined)[]; children: ReactNode; className?: string }) {
  if (!jargonTerms(...texts).length) return <>{children}</>;
  return (
    <div className={`flex items-start gap-1 ${className ?? ""}`} data-testid="with-glossary">
      <div className="flex-1 min-w-0 h-full">{children}</div>
      <GlossaryButtons texts={texts} />
    </div>
  );
}

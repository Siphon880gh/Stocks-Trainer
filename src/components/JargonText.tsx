import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { splitEarningsJargon, type EarningsJargonTerm } from "../lib/earningsJargon";

interface JargonTextProps {
  text: string;
  /** Replacement for a stretch of copy that is not an earnings-desk phrase. */
  renderPlain?: (text: string) => ReactNode;
}

export default function JargonText({ text, renderPlain }: JargonTextProps) {
  const parts = splitEarningsJargon(text);
  if (!renderPlain && parts.length === 1 && !parts[0]?.term) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        part.term ? (
          <span key={i}>
            <JargonMark matched={part.text} term={part.term} />
          </span>
        ) : renderPlain ? (
          <span key={i}>{renderPlain(part.text)}</span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

function JargonMark({ matched, term }: { matched: string; term: EarningsJargonTerm }): ReactElement {
  const iconRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState({ left: 8, top: 8, width: 288 });

  const clearClose = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => () => clearClose(), []);

  const place = () => {
    const el = iconRef.current;
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
    clearClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  return (
    <>
      {matched}
      <span
        ref={iconRef}
        tabIndex={0}
        aria-label={`About ${term.name}`}
        aria-expanded={open}
        className="inline-flex align-text-bottom ml-0.5 text-primary cursor-help rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        onMouseEnter={show}
        onMouseLeave={scheduleClose}
        onFocus={show}
        onBlur={scheduleClose}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (open) setOpen(false);
          else show();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            setOpen(false);
          }
        }}
      >
        <span className="material-symbols-outlined text-[15px] leading-none" aria-hidden>
          info
        </span>
      </span>
      {open ? (
        <span
          role="tooltip"
          className="fixed z-[260] p-3 rounded-lg border-2 border-line bg-background-dark shadow-lg text-left normal-case not-italic font-normal tracking-normal"
          style={{ left: box.left, top: box.top, width: box.width }}
          onMouseEnter={show}
          onMouseLeave={scheduleClose}
        >
          <span className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
            {term.name}
          </span>
          <span className="block text-[13px] text-slate-300 leading-snug">{term.summary}</span>
        </span>
      ) : null}
    </>
  );
}

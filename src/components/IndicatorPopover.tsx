import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getOverlay } from "../lib/overlays";

interface IndicatorPopoverProps {
  overlayId: string;
  x: number;
  y: number;
  onClose: () => void;
  onLearnMore?: () => void;
}

const PADDING = 8;

export default function IndicatorPopover({ overlayId, x, y, onClose, onLearnMore }: IndicatorPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: x, top: y });
  const overlay = getOverlay(overlayId);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = x;
    let top = y;
    if (left + rect.width > vw - PADDING) left = vw - rect.width - PADDING;
    if (left < PADDING) left = PADDING;
    if (top + rect.height > vh - PADDING) top = vh - rect.height - PADDING;
    if (top < PADDING) top = PADDING;
    setPosition({ left, top });
  }, [x, y]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!overlay) return null;

  return (
    <div
      ref={ref}
      className="fixed z-[200] w-72 p-4 rounded-lg border-2 border-primary/50 bg-background-dark shadow-2xl shadow-primary/20"
      style={{ left: position.left, top: position.top }}
    >
      <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">{overlay.name}</h4>
      <p className="text-xs text-primary/80 mb-2">{overlay.fullName}</p>
      <p className="text-slate-300 text-sm mb-2">{overlay.description}</p>
      <p className="text-xs text-primary/60 italic mb-3">Use: {overlay.useCase}</p>
      {onLearnMore && (
        <button
          onClick={() => {
            onClose();
            onLearnMore();
          }}
          className="w-full py-2 rounded border border-primary/40 text-primary text-xs font-bold hover:bg-primary/10 transition-colors flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">menu_book</span>
          Learn more
        </button>
      )}
    </div>
  );
}

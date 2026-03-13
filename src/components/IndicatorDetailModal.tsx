import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { OverlayDef } from "../lib/overlays";
import MarketChart from "./MarketChart";
import { SAMPLE_OHLC } from "../lib/ohlcData";

interface IndicatorDetailModalProps {
  overlay: OverlayDef;
  onClose: () => void;
}

export default function IndicatorDetailModal({ overlay, onClose }: IndicatorDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="indicator-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg bg-background-dark border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/30 bg-neutral-dark/80">
          <h2 id="indicator-modal-title" className="text-lg font-bold text-primary">
            {overlay.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex gap-6">
            <div className="h-32 w-40 shrink-0 rounded-lg bg-background-dark border border-primary/30 overflow-hidden">
              <MarketChart
                data={SAMPLE_OHLC}
                height={128}
                showSMA={overlay.id === "sma"}
                showEMA={overlay.id === "ema"}
                showRSI={overlay.id === "rsi"}
                showMACD={overlay.id === "macd"}
                showBollinger={overlay.id === "bollinger"}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-primary/60 uppercase tracking-wider">
                  {overlay.fullName} • {overlay.category}
                </span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">{overlay.description}</p>
              <p className="text-xs text-primary/60 italic">Use: {overlay.useCase}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/training?group=indicators&start=1"
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined">quiz</span>
              Practice in Quiz
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-primary/40 text-primary rounded-lg font-bold hover:bg-primary/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

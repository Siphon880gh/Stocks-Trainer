import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { OverlayDef } from "../lib/overlays";
import MarketChart from "./MarketChart";
import { SAMPLE_OHLC } from "../lib/ohlcData";
import YouTubeSearchLink from "./YouTubeSearchLink";

interface IndicatorDetailModalProps {
  overlay: OverlayDef;
  onClose: () => void;
  /** Hide the quiz CTA when already inside a quiz. */
  hidePracticeLink?: boolean;
}

export default function IndicatorDetailModal({ overlay, onClose, hidePracticeLink }: IndicatorDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    if (!hidePracticeLink) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      if (!hidePracticeLink) {
        document.body.style.overflow = "";
      }
    };
  }, [onClose, hidePracticeLink]);

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="indicator-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg bg-surface border border-line rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface">
          <div className="flex items-center gap-2 min-w-0">
            <h2 id="indicator-modal-title" className="text-lg font-bold text-primary truncate">
              {overlay.name}
            </h2>
            <YouTubeSearchLink title={overlay.name} />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-32 w-full overflow-hidden">
            <MarketChart
              data={SAMPLE_OHLC}
              height={128}
              showSMA={overlay.id === "sma"}
              showEMA={overlay.id === "ema"}
              showRSI={overlay.id === "rsi"}
              showMACD={overlay.id === "macd"}
              showBollinger={overlay.id === "bollinger"}
              showScaleControls={false}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-primary/60 uppercase tracking-wider">
              {overlay.fullName} • {overlay.category}
            </p>
            <p className="text-slate-200 text-sm leading-relaxed normal-case">
              {overlay.detail ?? overlay.description}
            </p>
            <p className="text-xs text-primary/60 italic">Use: {overlay.useCase}</p>
          </div>
          <div className="flex gap-3">
            {hidePracticeLink ? null : (
              <Link
                to="/training?group=indicators&start=1"
                onClick={onClose}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined">quiz</span>
                Practice in Quiz
              </Link>
            )}
            <button
              onClick={onClose}
              className={`${hidePracticeLink ? "flex-1" : ""} px-6 py-3 border border-line text-primary rounded-lg font-bold hover:bg-primary/10 transition-colors`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

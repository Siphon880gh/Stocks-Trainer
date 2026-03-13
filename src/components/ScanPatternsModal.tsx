import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { DetectedPattern } from "../lib/patternScan";

interface ScanPatternsModalProps {
  patterns: DetectedPattern[];
  onClose: () => void;
}

export default function ScanPatternsModal({ patterns, onClose }: ScanPatternsModalProps) {
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
      aria-labelledby="scan-modal-title"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-lg bg-background-dark border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/30 bg-neutral-dark/80">
          <h2 id="scan-modal-title" className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">radar</span>
            Pattern Scan Results
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {patterns.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No candlestick patterns detected in the current data. Try different timeframes or add more data.
            </p>
          ) : (
            <>
              <p className="text-primary/60 text-xs">
                Detected {patterns.length} pattern(s) in the chart. Use these signals with confirmation.
              </p>
              <div className="space-y-3">
                {patterns.map((p, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-primary/30 bg-neutral-dark/60 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-primary">{p.name}</span>
                      <span className="text-xs font-mono text-primary/70">Candle {p.index + 1} • {p.confidence}%</span>
                    </div>
                    <p className="text-slate-300 text-sm">{p.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Link
              to="/archive"
              onClick={onClose}
              className="flex-1 border border-primary/40 text-primary py-3 rounded-lg font-bold hover:bg-primary/10 flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined">menu_book</span>
              Learn Patterns
            </Link>
            <Link
              to="/training"
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-background-dark py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined">quiz</span>
              Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

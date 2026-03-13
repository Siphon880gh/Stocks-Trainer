import { useEffect } from "react";
import type { OHLC } from "../lib/ohlcData";

interface HistoryModalProps {
  data: OHLC[];
  onClose: () => void;
}

export default function HistoryModal({ data, onClose }: HistoryModalProps) {
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

  const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-background-dark border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20">
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/30 bg-neutral-dark/80 sticky top-0">
          <h2 id="history-modal-title" className="text-lg font-bold text-primary">
            OHLC History
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">
          <p className="text-primary/60 text-xs mb-4">
            Historical price data for the current chart. O=Open, H=High, L=Low, C=Close.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-primary/30">
                  <th className="text-left py-2 px-3 text-primary/80">Time</th>
                  <th className="text-right py-2 px-3 text-primary/80">O</th>
                  <th className="text-right py-2 px-3 text-primary/80">H</th>
                  <th className="text-right py-2 px-3 text-primary/80">L</th>
                  <th className="text-right py-2 px-3 text-primary/80">C</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="py-2 px-3 text-slate-200">{row.name}</td>
                    <td className="text-right py-2 px-3 text-slate-300">{fmt(row.open)}</td>
                    <td className="text-right py-2 px-3 text-primary">{fmt(row.high)}</td>
                    <td className="text-right py-2 px-3 text-accent-red">{fmt(row.low)}</td>
                    <td className="text-right py-2 px-3 text-slate-300">{fmt(row.close)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

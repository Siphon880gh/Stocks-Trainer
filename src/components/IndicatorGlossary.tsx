import { useState } from "react";
import { Link } from "react-router-dom";
import { OVERLAYS } from "../lib/overlays";

interface IndicatorGlossaryProps {
  onClose?: () => void;
  compact?: boolean;
}

export default function IndicatorGlossary({ onClose, compact = false }: IndicatorGlossaryProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-primary/80 uppercase tracking-wider">How Indicators Help</h4>
          <div className="flex items-center gap-2">
            <Link to="/archive?tab=indicators" className="text-xs text-primary/70 hover:text-primary">View in Library</Link>
            {onClose && (
              <button onClick={onClose} className="text-xs text-primary/70 hover:text-primary">Collapse</button>
            )}
          </div>
        </div>
        {OVERLAYS.map((ind) => (
          <details key={ind.id} className="group">
            <summary className="cursor-pointer text-sm font-mono text-primary hover:text-primary/90 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">info</span>
              {ind.name} — {ind.fullName}
            </summary>
            <p className="mt-1 text-xs text-slate-300 pl-6">{ind.description}</p>
            <p className="mt-0.5 text-xs text-primary/60 pl-6 italic">Use: {ind.useCase}</p>
          </details>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-widest">How Indicators Help</h3>
        <Link to="/archive?tab=indicators" className="text-xs text-primary/70 hover:text-primary font-bold">View in Library</Link>
      </div>
      <p className="text-slate-400 text-xs">
        Technical indicators smooth price data and highlight momentum, trend, and overbought/oversold conditions.
      </p>
      {OVERLAYS.map((ind) => (
        <div
          key={ind.id}
          className="border border-primary/20 rounded-lg overflow-hidden bg-neutral-dark/40"
        >
          <button
            onClick={() => setExpanded(expanded === ind.id ? null : ind.id)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
          >
            <span className="font-bold text-primary">{ind.name}</span>
            <span className="text-xs text-primary/60">{ind.fullName}</span>
            <span className="material-symbols-outlined text-primary/60">
              {expanded === ind.id ? "expand_less" : "expand_more"}
            </span>
          </button>
          {expanded === ind.id && (
            <div className="px-4 pb-4 pt-0 space-y-2">
              <p className="text-slate-300 text-sm">{ind.description}</p>
              <p className="text-primary/70 text-xs font-mono">Use: {ind.useCase}</p>
            </div>
          )}
        </div>
      ))}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full py-2 border border-primary/40 text-primary rounded-lg text-sm font-bold hover:bg-primary/10"
        >
          Close
        </button>
      )}
    </div>
  );
}

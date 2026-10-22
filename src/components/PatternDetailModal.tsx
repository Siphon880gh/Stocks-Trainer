import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PatternDef } from "../lib/patterns";
import YouTubeSearchLink from "./YouTubeSearchLink";
import JargonText from "./JargonText";
import CandlestickChart from "./CandlestickChart";
import { NOT_A_GUARANTEE, patternIllustration, patternTabs } from "../lib/patternTabs";

export type PatternTab = "recognise" | "psychology" | "trade";
export const PATTERN_TAB_LABELS: Record<PatternTab, string> = {
  recognise: "How to recognise it",
  psychology: "What is the psychology?",
  trade: "How do we trade it?",
};

interface PatternDetailModalProps {
  pattern: PatternDef;
  onClose: () => void;
  initialTab?: PatternTab;
}

export default function PatternDetailModal({ pattern, onClose, initialTab = "recognise" }: PatternDetailModalProps) {
  const [tab, setTab] = useState<PatternTab>(initialTab);
  const tabs = patternTabs(pattern);
  const ill = patternIllustration(pattern.id);
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
      aria-labelledby="pattern-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-surface border border-line rounded-xl shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface">
          <div className="flex items-center gap-2 min-w-0">
            <h2 id="pattern-modal-title" className="text-lg font-bold text-primary truncate">
              {pattern.name}
            </h2>
            <YouTubeSearchLink title={pattern.name} />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-primary/60 uppercase tracking-wider">
                {pattern.type} • {pattern.confirmation.replace("_", " ")} confirmation
              </span>
              {pattern.rare ? (
                <span className="text-[10px] font-mono uppercase tracking-wide rounded border border-amber-500/60 text-amber-600 px-1.5 py-0.5">
                  Advanced / rare
                </span>
              ) : null}
            </div>
            {ill.bars.length ? (
              <div className="rounded-lg bg-background-dark border border-line overflow-hidden" data-testid="pattern-illustration">
                <p className="text-[10px] text-muted px-2 pt-1">
                  SIMULATED illustration{ill.confirmIndex != null ? " · last candle = confirmation" : ""}
                </p>
                <CandlestickChart data={ill.bars} height={150} highlightIndex={ill.highlight} showScaleControls={false} compact />
              </div>
            ) : pattern.image ? (
              <img className="h-32 w-full object-contain p-2 rounded-lg border border-line" src={pattern.image} alt={`${pattern.name} pattern`} />
            ) : null}
          </div>
          <div className="flex flex-col sm:flex-row gap-1" role="tablist" aria-label="Pattern detail">
            {(Object.keys(PATTERN_TAB_LABELS) as PatternTab[]).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                data-testid={`pattern-tab-${t}`}
                onClick={() => setTab(t)}
                className={`flex-1 text-left sm:text-center px-3 py-2 rounded-lg text-[13px] min-h-[44px] ${
                  tab === t ? "bg-primary/10 text-primary font-semibold" : "text-muted hover:bg-primary/5"
                }`}
              >
                {PATTERN_TAB_LABELS[t]}
              </button>
            ))}
          </div>
          <div role="tabpanel" data-testid="pattern-tabpanel" data-tab={tab} className="text-ink text-sm leading-relaxed space-y-2">
            {tabs.general ? (
              <p className="text-[11px] text-muted">General guide for this pattern family; check the description for this pattern's own rules.</p>
            ) : null}
            {tab === "recognise" ? (
              <ul className="list-disc pl-5 space-y-1">
                {tabs.recognise.map((t, i) => (
                  <li key={i}>
                    <JargonText text={t} />
                  </li>
                ))}
              </ul>
            ) : tab === "psychology" ? (
              <ol className="list-decimal pl-5 space-y-1">
                {tabs.psychology.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>
            ) : (
              <div className="space-y-1.5">
                <p><strong>Confirmation:</strong> {tabs.trade.confirmation}</p>
                <p><strong>Entry:</strong> {tabs.trade.entry}</p>
                <p><strong>Stop (invalidation):</strong> {tabs.trade.stop}</p>
                <p><strong>Target or exit:</strong> {tabs.trade.target}</p>
                <p className="text-[12px] text-muted">{NOT_A_GUARANTEE}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              to="/training"
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined">quiz</span>
              Practice in Quiz
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-line text-primary rounded-lg font-bold hover:bg-primary/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

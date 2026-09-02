import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PATTERNS, type PatternDef } from "../lib/patterns";
import { OVERLAYS, getOverlaysByCategory, type OverlayDef, type OverlayCategory } from "../lib/overlays";
import { LITERACY_TERMS, getLiteracyTerm, type LiteracyTerm } from "../lib/literacyTerms";
import PatternDetailModal from "../components/PatternDetailModal";
import IndicatorDetailModal from "../components/IndicatorDetailModal";

type FilterType = "all" | "bullish" | "bearish" | "neutral";
type ArchiveTab = "patterns" | "indicators" | "literacy";

export default function Archive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as ArchiveTab | null;
  const openId = searchParams.get("open");

  const [tab, setTab] = useState<ArchiveTab>(
    tabParam === "indicators" || tabParam === "literacy" ? tabParam : "patterns"
  );
  const [selectedPattern, setSelectedPattern] = useState<PatternDef | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<OverlayDef | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<LiteracyTerm | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [indicatorFilter, setIndicatorFilter] = useState<OverlayCategory | "all">("all");

  useEffect(() => {
    if (tabParam === "indicators" || tabParam === "literacy") setTab(tabParam);
    else if (!tabParam) setTab("patterns");
  }, [tabParam]);

  useEffect(() => {
    if (!openId) return;
    if (tab === "literacy" || tabParam === "literacy") {
      const term = getLiteracyTerm(openId);
      if (term) setSelectedTerm(term);
      return;
    }
    const overlay = OVERLAYS.find((o) => o.id === openId);
    if (overlay) setSelectedOverlay(overlay);
  }, [openId, tab, tabParam]);

  const filteredPatterns = PATTERNS.filter((p) => {
    if (filter === "all") return true;
    const sentiment = p.sentiment ?? (p.type === "neutral" ? "neutral" : "bullish");
    return sentiment === filter;
  });

  const filteredOverlays = getOverlaysByCategory(indicatorFilter);

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-line bg-surface">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">Reference</h1>
        </div>
        <div className="px-4 pb-4">
          <label className="flex flex-col w-full">
            <div className="flex w-full items-stretch rounded-lg bg-surface border border-line h-11">
              <div className="text-primary/60 flex items-center justify-center px-3">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="form-input flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-primary/40 text-sm font-display outline-none"
                placeholder="Search technical patterns..."
              />
              <div className="text-primary/60 flex items-center justify-center px-3">
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </div>
            </div>
          </label>
        </div>
        <div className="flex gap-2 px-4 pb-2">
          <button
            type="button"
            onClick={() => {
              setTab("patterns");
              setSearchParams((p) => {
                const n = new URLSearchParams(p);
                n.delete("tab");
                n.delete("open");
                return n;
              }, { replace: true });
            }}
            className={`flex h-9 shrink-0 items-center gap-2 rounded-lg px-4 font-bold text-sm transition-colors ${
              tab === "patterns" ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <span className="material-symbols-outlined text-lg">candlestick_chart</span>
            Patterns
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("indicators");
              setSearchParams({ tab: "indicators" }, { replace: true });
            }}
            className={`flex h-9 shrink-0 items-center gap-2 rounded-lg px-4 font-bold text-sm transition-colors ${
              tab === "indicators" ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <span className="material-symbols-outlined text-lg">show_chart</span>
            Indicators
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("literacy");
              setSearchParams({ tab: "literacy" }, { replace: true });
            }}
            className={`flex h-9 shrink-0 items-center gap-2 rounded-lg px-4 font-bold text-sm transition-colors ${
              tab === "literacy" ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <span className="material-symbols-outlined text-lg">menu_book</span>
            Literacy
          </button>
        </div>
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          {tab === "patterns"
            ? (["all", "bullish", "bearish", "neutral"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded px-4 cursor-pointer transition-colors ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-primary/10 border border-line text-primary hover:bg-primary/20"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider">
                {f === "all" ? "All Patterns" : f.charAt(0).toUpperCase() + f.slice(1)}
              </p>
            </button>
          ))
            : tab === "indicators"
            ? (["all", "trend", "oscillator", "volatility"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setIndicatorFilter(f)}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded px-4 cursor-pointer transition-colors ${
                indicatorFilter === f
                  ? "bg-primary text-white"
                  : "bg-primary/10 border border-line text-primary hover:bg-primary/20"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider">
                {f === "all" ? "All Indicators" : f.charAt(0).toUpperCase() + f.slice(1)}
              </p>
            </button>
          ))
            : (
              <p className="text-xs text-primary/50 font-mono uppercase tracking-wider py-1">
                Beginner equities glossary (SAMPLE)
              </p>
            )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold uppercase tracking-[0.2em] font-mono">
            {tab === "patterns"
              ? "Pattern Library / root"
              : tab === "indicators"
                ? "Indicator Library / root"
                : "Literacy Glossary / root"}
          </h3>
          <span className="text-primary/40 text-xs font-mono">
            Total:{" "}
            {tab === "patterns"
              ? filteredPatterns.length
              : tab === "indicators"
                ? filteredOverlays.length
                : LITERACY_TERMS.length}{" "}
            entries
          </span>
        </div>

        <div className="space-y-4">
          {tab === "literacy"
            ? LITERACY_TERMS.map((term) => (
            <button
              key={term.id}
              type="button"
              onClick={() => {
                setSelectedTerm(term);
                setSearchParams({ tab: "literacy", open: term.id }, { replace: true });
              }}
              className="group w-full text-left flex flex-col rounded-xl border border-line bg-surface p-4 hover:border-primary hover:bg-surface transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">menu_book</span>
                <h4 className="text-slate-100 font-bold text-base font-display">{term.name}</h4>
                <span className="text-[10px] font-mono text-primary/50 uppercase">{term.category}</span>
              </div>
              <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">{term.summary}</p>
            </button>
          ))
          : tab === "patterns"
            ? filteredPatterns.map((pattern) => (
            <button
              key={pattern.id}
              type="button"
              onClick={() => setSelectedPattern(pattern)}
              className="group w-full text-left flex flex-col rounded-xl border border-line bg-surface p-4 hover:border-primary hover:bg-surface transition-all cursor-pointer"
              title={`${pattern.type.toUpperCase()}_PATTERN | CONFIRMATION: ${pattern.confirmation.toUpperCase()} — ${pattern.description}`}
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 rounded bg-background-dark overflow-hidden border border-line flex items-center justify-center">
                  {pattern.image ? (
                    <img
                      className="h-full w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity p-2"
                      src={pattern.image}
                      alt={`${pattern.name} pattern`}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-primary/60">
                      {pattern.id === "doji" ? "trending_flat" : pattern.id === "hammer" ? "vertical_align_bottom" : "compare_arrows"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-sm ${
                          pattern.id === "head-shoulders" ? "text-accent-red" : pattern.type === "reversal" ? "text-primary" : pattern.type === "continuation" ? "text-primary/70" : "text-primary/60"
                        }`}
                      >
                        {pattern.id === "head-shoulders" ? "arrow_downward" : pattern.type === "reversal" ? "arrow_upward" : pattern.type === "continuation" ? "trending_flat" : "remove"}
                      </span>
                      <h4 className="text-slate-100 font-bold text-base font-display">{pattern.name}</h4>
                    </div>
                    <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">
                      &gt; {pattern.type.toUpperCase()}_PATTERN<br />
                      &gt; CONFIRMATION: {pattern.confirmation.toUpperCase().replace("_", " ")}<br />
                      {pattern.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))
            : filteredOverlays.map((overlay) => (
            <button
              key={overlay.id}
              type="button"
              onClick={() => setSelectedOverlay(overlay)}
              className="group w-full text-left flex flex-col rounded-xl border border-line bg-surface p-4 hover:border-primary hover:bg-surface transition-all cursor-pointer"
              title={`${overlay.category.toUpperCase()} — ${overlay.description}`}
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 rounded bg-background-dark overflow-hidden border border-line flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary/60">
                    {overlay.id === "sma" || overlay.id === "ema" ? "trending_up" : overlay.id === "rsi" || overlay.id === "macd" ? "show_chart" : "bar_chart"}
                  </span>
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">
                        {overlay.category === "trend" ? "trending_up" : overlay.category === "oscillator" ? "show_chart" : "bar_chart"}
                      </span>
                      <h4 className="text-slate-100 font-bold text-base font-display">{overlay.name}</h4>
                    </div>
                    <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">
                      &gt; {overlay.category.toUpperCase()}<br />
                      &gt; {overlay.fullName}<br />
                      {overlay.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {selectedPattern && (
        <PatternDetailModal
          pattern={selectedPattern}
          onClose={() => setSelectedPattern(null)}
        />
      )}
      {selectedOverlay && (
        <IndicatorDetailModal
          overlay={selectedOverlay}
          onClose={() => {
            setSelectedOverlay(null);
            if (searchParams.has("open")) {
              const next = new URLSearchParams(searchParams);
              next.delete("open");
              setSearchParams(next, { replace: true });
            }
          }}
        />
      )}
      {selectedTerm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setSelectedTerm(null);
            const next = new URLSearchParams(searchParams);
            next.delete("open");
            setSearchParams(next, { replace: true });
          }}
        >
          <div
            className="w-full max-w-lg panel bg-surface p-6 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono text-primary/50 uppercase tracking-widest">
                  Literacy · {selectedTerm.category}
                </p>
                <h3 className="text-xl font-bold text-primary">{selectedTerm.name}</h3>
              </div>
              <button
                type="button"
                className="text-primary hover:bg-primary/10 p-1 rounded"
                aria-label="Close"
                onClick={() => {
                  setSelectedTerm(null);
                  const next = new URLSearchParams(searchParams);
                  next.delete("open");
                  setSearchParams(next, { replace: true });
                }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-slate-300">{selectedTerm.detail}</p>
            <Link
              to="/training?group=equity-literacy&start=1"
              className="inline-flex text-xs font-bold text-primary underline"
            >
              Practice Equities Literacy quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

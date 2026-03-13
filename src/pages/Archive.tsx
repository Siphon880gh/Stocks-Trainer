import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PATTERNS, type PatternDef } from "../lib/patterns";
import { OVERLAYS, getOverlaysByCategory, type OverlayDef, type OverlayCategory } from "../lib/overlays";
import PatternDetailModal from "../components/PatternDetailModal";
import IndicatorDetailModal from "../components/IndicatorDetailModal";

type FilterType = "all" | "bullish" | "bearish" | "neutral";
type ArchiveTab = "patterns" | "indicators";

export default function Archive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as ArchiveTab | null;
  const openOverlayId = searchParams.get("open");

  const [tab, setTab] = useState<ArchiveTab>(tabParam === "indicators" ? "indicators" : "patterns");
  const [selectedPattern, setSelectedPattern] = useState<PatternDef | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<OverlayDef | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [indicatorFilter, setIndicatorFilter] = useState<OverlayCategory | "all">("all");

  useEffect(() => {
    if (tabParam === "indicators") setTab("indicators");
  }, [tabParam]);

  useEffect(() => {
    if (openOverlayId) {
      const overlay = OVERLAYS.find((o) => o.id === openOverlayId);
      if (overlay) setSelectedOverlay(overlay);
    }
  }, [openOverlayId]);

  const filteredPatterns = PATTERNS.filter((p) => {
    if (filter === "all") return true;
    const sentiment = p.sentiment ?? (p.type === "neutral" ? "neutral" : "bullish");
    return sentiment === filter;
  });

  const filteredOverlays = getOverlaysByCategory(indicatorFilter);

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 bg-background-dark/95 border-b border-primary/30 backdrop-blur-sm">
        <div className="flex items-center p-4 justify-between">
          <Link to="/" className="text-primary flex size-10 shrink-0 items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined text-3xl">terminal</span>
          </Link>
          <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 ml-3 font-mono">
            Accessing Database...<span className="animate-pulse">_</span>
          </h2>
          <div className="flex w-10 items-center justify-end">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <label className="flex flex-col w-full">
            <div className="flex w-full items-stretch rounded-lg bg-neutral-dark/80 border border-primary/30 h-11">
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
              tab === "patterns" ? "bg-primary text-background-dark" : "bg-primary/10 text-primary hover:bg-primary/20"
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
              tab === "indicators" ? "bg-primary text-background-dark" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <span className="material-symbols-outlined text-lg">show_chart</span>
            Indicators
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
                  ? "bg-primary text-background-dark"
                  : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider">
                {f === "all" ? "All Patterns" : f.charAt(0).toUpperCase() + f.slice(1)}
              </p>
            </button>
          ))
            : (["all", "trend", "oscillator", "volatility"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setIndicatorFilter(f)}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded px-4 cursor-pointer transition-colors ${
                indicatorFilter === f
                  ? "bg-primary text-background-dark"
                  : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider">
                {f === "all" ? "All Indicators" : f.charAt(0).toUpperCase() + f.slice(1)}
              </p>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold uppercase tracking-[0.2em] font-mono">
            {tab === "patterns" ? "Pattern Library / root" : "Indicator Library / root"}
          </h3>
          <span className="text-primary/40 text-xs font-mono">
            Total: {tab === "patterns" ? filteredPatterns.length : filteredOverlays.length} entries
          </span>
        </div>

        <div className="space-y-4">
          {tab === "patterns"
            ? filteredPatterns.map((pattern) => (
            <button
              key={pattern.id}
              type="button"
              onClick={() => setSelectedPattern(pattern)}
              className="group w-full text-left flex flex-col rounded-xl border border-primary/30 bg-neutral-dark/60 p-4 hover:border-primary hover:bg-neutral-dark/80 transition-all cursor-pointer"
              title={`${pattern.type.toUpperCase()}_PATTERN | CONFIRMATION: ${pattern.confirmation.toUpperCase()} — ${pattern.description}`}
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 rounded bg-background-dark overflow-hidden border border-primary/30 flex items-center justify-center">
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
              className="group w-full text-left flex flex-col rounded-xl border border-primary/30 bg-neutral-dark/60 p-4 hover:border-primary hover:bg-neutral-dark/80 transition-all cursor-pointer"
              title={`${overlay.category.toUpperCase()} — ${overlay.description}`}
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 rounded bg-background-dark overflow-hidden border border-primary/30 flex items-center justify-center">
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

      <nav className="sticky bottom-0 bg-background-dark border-t border-primary/30 pb-6 pt-2">
        <div className="flex gap-2 px-4">
          <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">terminal</span>
            <p className="text-[10px] font-bold uppercase tracking-wider font-display">Terminal</p>
          </Link>
          <Link to="/archive" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>archive</span>
            <p className="text-[10px] font-bold uppercase tracking-wider font-display">Archive</p>
          </Link>
          <Link to="/market" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">monitoring</span>
            <p className="text-[10px] font-bold uppercase tracking-wider font-display">Analysis</p>
          </Link>
          <Link to="/training" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings_suggest</span>
            <p className="text-[10px] font-bold uppercase tracking-wider font-display">Config</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}

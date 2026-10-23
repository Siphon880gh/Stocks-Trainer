import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BrowsePopover from "../components/BrowsePopover";
import { PATTERNS, type PatternDef } from "../lib/patterns";
import { OVERLAYS, getOverlaysByCategory, type OverlayDef, type OverlayCategory } from "../lib/overlays";
import { LITERACY_TERMS, getLiteracyTerm, type LiteracyTerm } from "../lib/literacyTerms";
import {
  canBrowseAssetClass,
  isChartGateTemporarilyBypassed,
  literacyTermAssetClass,
  setChartGateTemporaryBypass,
} from "../lib/beginnerPath";
import PatternDetailModal from "../components/PatternDetailModal";
import CorePatternList from "../components/CorePatternList";
import IndicatorDetailModal from "../components/IndicatorDetailModal";
import YouTubeSearchLink from "../components/YouTubeSearchLink";
import JargonText, { GlossaryButtons } from "../components/JargonText";
import SampleDataNote from "../components/SampleDataNote";
import { withoutSampleWord } from "../lib/learnerCopy";
import { CRYPTO_FIT_HINT, CRYPTO_FIT_LABEL, cryptoFitFor, isCandlestickPattern, type CryptoFit } from "../lib/cryptoCandles";
import { THEMES, getTheme, isThemeId } from "../lib/patternThemes";

type FilterType = "all" | "bullish" | "bearish" | "neutral";
type CryptoFilter = "all" | CryptoFit;
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
  const cryptoParam = searchParams.get("crypto") as CryptoFilter | null;
  const [cryptoFilter, setCryptoFilter] = useState<CryptoFilter>(
    cryptoParam === "works" || cryptoParam === "adapted" || cryptoParam === "rare" ? cryptoParam : "all",
  );
  const themeParam = searchParams.get("theme");
  const themeFilter = isThemeId(themeParam) ? themeParam : null;
  const [indicatorFilter, setIndicatorFilter] = useState<OverlayCategory | "all">("all");
  const [tempBypass, setTempBypass] = useState(isChartGateTemporarilyBypassed);

  useEffect(() => {
    if (tabParam === "indicators" || tabParam === "literacy") setTab(tabParam);
    else if (!tabParam) setTab("patterns");
  }, [tabParam]);
  useEffect(() => {
    if (cryptoParam === "works" || cryptoParam === "adapted" || cryptoParam === "rare") setCryptoFilter(cryptoParam);
    else if (!cryptoParam) setCryptoFilter("all");
  }, [cryptoParam]);

  useEffect(() => {
    if (!openId) return;
    if (tab === "literacy" || tabParam === "literacy") {
      const term = getLiteracyTerm(openId);
      if (term) {
        const cls = literacyTermAssetClass(term.id);
        if (cls && !canBrowseAssetClass(cls)) {
          setSelectedTerm(null);
          return;
        }
        setSelectedTerm(term);
      }
      return;
    }
    const overlay = OVERLAYS.find((o) => o.id === openId);
    if (overlay) setSelectedOverlay(overlay);
    const pattern = PATTERNS.find((p) => p.id === openId);
    if (pattern) setSelectedPattern(pattern);
  }, [openId, tab, tabParam, tempBypass]);

  const filteredPatterns = PATTERNS.filter((p) => {
    if (themeFilter && p.themes?.primary !== themeFilter && !p.themes?.secondary.includes(themeFilter)) return false;
    if (cryptoFilter !== "all") {
      if (!isCandlestickPattern(p.id)) return false;
      if (cryptoFitFor(p.id) !== cryptoFilter) return false;
    }
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
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
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
                Beginner equities glossary
              </p>
            )}
        </div>
        {tab === "patterns" ? (
          <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar" data-testid="archive-crypto-filters">
            {(["all", "works", "adapted", "rare"] as const).map((f) => (
              <button
                key={`crypto-${f}`}
                type="button"
                data-testid={`archive-crypto-${f}`}
                onClick={() => {
                  setCryptoFilter(f);
                  const next = new URLSearchParams(searchParams);
                  if (f === "all") next.delete("crypto");
                  else next.set("crypto", f);
                  setSearchParams(next, { replace: true });
                }}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded px-4 cursor-pointer transition-colors ${
                  cryptoFilter === f
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-500/10 border border-line text-emerald-700 hover:bg-emerald-500/20"
                }`}
                title={f === "all" ? "Show all patterns" : CRYPTO_FIT_HINT[f]}
              >
                <p className="text-xs font-bold uppercase tracking-wider">
                  {f === "all" ? "Crypto: all" : CRYPTO_FIT_LABEL[f]}
                </p>
              </button>
            ))}
            <Link to="/practice/crypto-candles" className="flex h-8 shrink-0 items-center px-3 text-xs font-bold text-primary underline">
              Why crypto tags?
            </Link>
            <select
              aria-label="Filter patterns by theme"
              data-testid="archive-theme-filter"
              value={themeFilter ?? ""}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                if (e.target.value) next.set("theme", e.target.value);
                else next.delete("theme");
                setSearchParams(next, { replace: true });
              }}
              className="h-8 shrink-0 rounded border border-line bg-surface px-2 text-xs font-bold"
            >
              <option value="">Theme: all</option>
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>{t.n}. {t.short}</option>
              ))}
            </select>
            {themeFilter ? (
              <Link to={`/practice/pattern-themes?theme=${themeFilter}`} className="flex h-8 shrink-0 items-center px-3 text-xs font-bold text-primary underline" data-testid="archive-theme-about">
                About “{getTheme(themeFilter)?.name}”
              </Link>
            ) : (
              <Link to="/practice/pattern-themes" className="flex h-8 shrink-0 items-center px-3 text-xs font-bold text-primary underline">
                What are themes?
              </Link>
            )}
          </div>
        ) : null}
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-primary text-sm font-bold uppercase tracking-[0.2em] font-mono">
            {tab === "patterns"
              ? "Pattern Library / root"
              : tab === "indicators"
                ? "Indicator Library / root"
                : "Literacy Glossary / root"}
          </h3>
          <div className="flex items-center gap-3">
            <BrowsePopover
              title={
                tab === "patterns"
                  ? "Patterns"
                  : tab === "indicators"
                    ? "Indicators"
                    : "Literacy"
              }
              selectedId={
                tab === "patterns"
                  ? selectedPattern?.id
                  : tab === "indicators"
                    ? selectedOverlay?.id
                    : selectedTerm?.id
              }
              items={
                tab === "patterns"
                  ? filteredPatterns.map((p) => ({
                      id: p.id,
                      label: p.name,
                      hint: p.type,
                    }))
                  : tab === "indicators"
                    ? filteredOverlays.map((o) => ({
                        id: o.id,
                        label: o.name,
                        hint: o.fullName,
                      }))
                    : LITERACY_TERMS.map((term) => {
                        const cls = literacyTermAssetClass(term.id);
                        const locked = Boolean(cls && !canBrowseAssetClass(cls));
                        return {
                          id: term.id,
                          label: withoutSampleWord(term.name),
                          hint: locked ? `${term.category} · locked` : term.category,
                          disabled: locked,
                        };
                      })
              }
              onSelect={(id) => {
                if (tab === "patterns") {
                  const pattern = filteredPatterns.find((p) => p.id === id);
                  if (pattern) setSelectedPattern(pattern);
                  return;
                }
                if (tab === "indicators") {
                  const overlay = filteredOverlays.find((o) => o.id === id);
                  if (overlay) setSelectedOverlay(overlay);
                  return;
                }
                const term = LITERACY_TERMS.find((t) => t.id === id);
                if (!term) return;
                setSelectedTerm(term);
                setSearchParams({ tab: "literacy", open: term.id }, { replace: true });
              }}
            />
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
        </div>

        {tab === "patterns" ? (
          <div className="space-y-2">
            <CorePatternList />
            <p className="text-[12px] text-muted px-1">
              New to candles? Start with the{" "}
              <Link to="/practice/japanese-candles" className="text-primary underline">
                Japanese candlesticks lesson
              </Link>
              . Every pattern below opens the same three tabs.
            </p>
          </div>
        ) : null}
        <div className="space-y-4">
          {tab === "literacy"
            ? LITERACY_TERMS.map((term) => {
              const cls = literacyTermAssetClass(term.id);
              const locked = Boolean(cls && !canBrowseAssetClass(cls));
              return (
            <div
              key={term.id}
              className={`w-full text-left flex flex-col rounded-xl border border-line bg-surface p-4 ${
                locked ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-2">
              <button
                type="button"
                disabled={locked}
                onClick={() => {
                  setSelectedTerm(term);
                  setSearchParams({ tab: "literacy", open: term.id }, { replace: true });
                }}
                className={`group text-left min-w-0 flex-1 ${
                  locked ? "cursor-not-allowed" : "hover:text-primary cursor-pointer"
                }`}
              >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">menu_book</span>
                <h4 className="text-slate-100 font-bold text-base font-display">{withoutSampleWord(term.name)}</h4>
                <span className="text-[10px] font-mono text-primary/50 uppercase">{term.category}</span>
                {locked ? (
                  <span className="text-[10px] font-mono text-muted uppercase">locked</span>
                ) : null}
              </div>
              <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">
                <JargonText text={withoutSampleWord(term.summary)} plain />
              </p>
              </button>
              <GlossaryButtons texts={[withoutSampleWord(term.summary)]} />
              <YouTubeSearchLink title={withoutSampleWord(term.name)} />
              </div>
              {locked ? (
                <button
                  type="button"
                  className="text-primary underline text-xs mt-2 font-mono text-left"
                  onClick={() => {
                    setChartGateTemporaryBypass(true);
                    setTempBypass(true);
                  }}
                >
                  Browse this session
                </button>
              ) : null}
            </div>
              );
            })
          : tab === "patterns"
            ? filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              data-pattern-id={pattern.id}
              className="relative rounded-xl border border-line bg-surface p-4 hover:border-primary transition-all"
            >
            <button
              type="button"
              onClick={() => setSelectedPattern(pattern)}
              className="group w-full text-left flex flex-col cursor-pointer"
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
                <div className="flex min-w-0 flex-col justify-between py-1 pr-16">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={`material-symbols-outlined text-sm ${
                          pattern.sentiment === "bearish" ? "text-accent-red" : pattern.type === "reversal" ? "text-primary" : pattern.type === "continuation" ? "text-primary/70" : "text-primary/60"
                        }`}
                      >
                        {pattern.type === "reversal"
                          ? pattern.sentiment === "bearish"
                            ? "arrow_downward"
                            : "arrow_upward"
                          : pattern.type === "continuation"
                            ? "trending_flat"
                            : "remove"}
                      </span>
                      <h4 className="text-slate-100 font-bold text-base font-display">{pattern.name}</h4>
                      {pattern.rare ? (
                        <span
                          className="text-[9px] font-mono uppercase tracking-wide rounded border border-amber-500/60 text-amber-600 px-1 py-0.5"
                          title="Advanced / rare: infrequent and less reliable than the core patterns. Confirm before acting."
                        >
                          Advanced / rare
                        </span>
                      ) : null}
                      {(() => {
                        const fit = cryptoFitFor(pattern.id);
                        if (!fit) return null;
                        return (
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wide rounded border px-1 py-0.5 ${
                              fit === "works"
                                ? "border-emerald-500/60 text-emerald-600"
                                : fit === "adapted"
                                  ? "border-amber-500/60 text-amber-600"
                                  : "border-rose-500/60 text-rose-600"
                            }`}
                            title={CRYPTO_FIT_HINT[fit]}
                            data-crypto-fit={fit}
                          >
                            {fit}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">
                      &gt; {pattern.type.toUpperCase()}_PATTERN<br />
                      &gt; CONFIRMATION: {pattern.confirmation.toUpperCase().replace("_", " ")}<br />
                      <JargonText text={withoutSampleWord(pattern.description)} plain />
                    </p>
                  </div>
                </div>
              </div>
            </button>
            <GlossaryButtons texts={[withoutSampleWord(pattern.description)]} className="mt-1" />
            <YouTubeSearchLink title={pattern.name} className="absolute top-4 right-4" />
            </div>
          ))
            : filteredOverlays.map((overlay) => (
            <div
              key={overlay.id}
              className="relative rounded-xl border border-line bg-surface p-4 hover:border-primary transition-all"
            >
            <button
              type="button"
              onClick={() => setSelectedOverlay(overlay)}
              className="group w-full text-left flex flex-col cursor-pointer"
              title={`${overlay.category.toUpperCase()} — ${overlay.description}`}
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 rounded bg-background-dark overflow-hidden border border-line flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary/60">
                    {overlay.id === "sma" || overlay.id === "ema" ? "trending_up" : overlay.id === "rsi" || overlay.id === "macd" ? "show_chart" : "bar_chart"}
                  </span>
                </div>
                <div className="flex min-w-0 flex-col justify-between py-1 pr-16">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
            <YouTubeSearchLink title={overlay.name} className="absolute top-4 right-4" />
            </div>
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
                <h3 className="text-xl font-bold text-primary inline-flex items-center gap-2">
                  {withoutSampleWord(selectedTerm.name)}
                  <YouTubeSearchLink title={withoutSampleWord(selectedTerm.name)} />
                </h3>
              </div>
              <div className="flex items-start gap-1">
              <SampleDataNote placement="inline" />
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
            </div>
            <p className="text-sm text-slate-300">
              <JargonText text={withoutSampleWord(selectedTerm.detail)} />
            </p>
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

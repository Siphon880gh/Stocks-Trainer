import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MarketChart, { type ChartHighlightMark } from "../components/MarketChart";
import HistoryModal from "../components/HistoryModal";
import ScanPatternsModal from "../components/ScanPatternsModal";
import IndicatorGlossary from "../components/IndicatorGlossary";
import IndicatorPopover from "../components/IndicatorPopover";
import FinancialsPanel from "../components/FinancialsPanel";
import MarketNavigator from "../components/MarketNavigator";
import BrowsePopover from "../components/BrowsePopover";
import {
  getMarket,
  listMarketsByAssetClass,
  type MarketAssetFilter,
} from "../lib/markets";
import {
  getMarketDataProvider,
  getStoredProviderId,
  listMarketDataProviders,
  setStoredProviderId,
  type MarketDataProviderId,
} from "../lib/marketDataProvider";
import { ASSET_CLASSES, type AssetClass } from "../lib/samplePacks";
import { getOverlay, type OverlayDef } from "../lib/overlays";
import { scanPatterns, patternBarIndices, type DetectedPattern } from "../lib/patternScan";
import { patternDefForScanName } from "../lib/patterns";
import IndicatorDetailModal from "../components/IndicatorDetailModal";
import PatternDetailModal from "../components/PatternDetailModal";
import {
  canBrowseAssetClass,
  CHART_GATE_TRAINING_GROUP,
  isChartGateComplete,
  isChartGateTemporarilyBypassed,
} from "../lib/beginnerPath";
import {
  chartFrequenciesForSeries,
  inferNativeBarMinutes,
  ohlcAtFrequency,
} from "../lib/ohlcData";
import { parseMarketClassParam } from "../lib/marketNavigator";

const CLASS_LABELS: Record<AssetClass, string> = {
  equity: "Equities",
  crypto: "Crypto",
  future: "Futures",
  option_context: "Options context",
  forex: "Forex",
};

type ChartHighlight = ChartHighlightMark & { pattern?: DetectedPattern };

function marketsForFilter(filter: MarketAssetFilter) {
  return listMarketsByAssetClass(filter).filter(
    (m) =>
      m.pack.assetClass === "equity" || canBrowseAssetClass(m.pack.assetClass),
  );
}

export default function Market() {
  const [searchParams, setSearchParams] = useSearchParams();
  const classFromUrl = parseMarketClassParam(searchParams.get("class"));
  const [assetFilter, setAssetFilter] = useState<MarketAssetFilter>(
    () => classFromUrl ?? "all",
  );
  const [peekOn, setPeekOn] = useState(isChartGateTemporarilyBypassed);
  const [providerId, setProviderId] = useState<MarketDataProviderId>(() =>
    getStoredProviderId(),
  );
  const dataProvider = useMemo(() => getMarketDataProvider(providerId), [providerId]);
  const filteredMarkets = useMemo(
    () => marketsForFilter(assetFilter),
    [assetFilter, peekOn]
  );
  const [marketId, setMarketId] = useState(() => {
    const cls = classFromUrl ?? "all";
    return marketsForFilter(cls)[0]?.id ?? "btc";
  });

  const applyAssetFilter = (next: MarketAssetFilter) => {
    setAssetFilter(next);
    const list = marketsForFilter(next);
    if (list[0]) setMarketId(list[0].id);
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next === "all") p.delete("class");
        else p.set("class", next);
        return p;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (!classFromUrl) return;
    setAssetFilter(classFromUrl);
    const list = marketsForFilter(classFromUrl);
    if (list[0]) setMarketId(list[0].id);
  }, [classFromUrl, peekOn]);

  useEffect(() => {
    if (searchParams.get("nav") !== "1") return;
    document.getElementById("market-navigator")?.scrollIntoView({
      block: "start",
    });
  }, [searchParams]);
  const [controls, setControls] = useState({
    sma: true,
    ema: false,
    rsi: true,
    macd: false,
    bollinger: false,
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [highlights, setHighlights] = useState<ChartHighlight[]>([]);
  const [helpHighlightId, setHelpHighlightId] = useState<string | null>(null);
  const [popover, setPopover] = useState<{ overlayId: string; x: number; y: number } | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<OverlayDef | null>(null);
  const [freqMinutes, setFreqMinutes] = useState<number | null>(null);

  const marketInFilter = filteredMarkets.find((m) => m.id === marketId);
  const market = marketInFilter ?? filteredMarkets[0] ?? getMarket(marketId);
  const emptyClass =
    filteredMarkets.length === 0 && assetFilter !== "all";
  const sourceOhlc = useMemo(
    () => (market ? dataProvider.getOhlc(market.id) ?? [] : []),
    [market, dataProvider],
  );
  const nativeMinutes = useMemo(
    () => inferNativeBarMinutes(sourceOhlc),
    [sourceOhlc],
  );
  const frequencies = useMemo(
    () => chartFrequenciesForSeries(sourceOhlc),
    [sourceOhlc],
  );

  useEffect(() => {
    if (nativeMinutes == null || freqMinutes == null) return;
    if (
      !frequencies.some(
        (f) => f.minutes === freqMinutes && f.enabled,
      )
    ) {
      setFreqMinutes(nativeMinutes);
    }
  }, [nativeMinutes, freqMinutes, frequencies]);

  const resolvedFreq =
    freqMinutes != null &&
    frequencies.some((f) => f.minutes === freqMinutes && f.enabled)
      ? freqMinutes
      : nativeMinutes;

  const ohlcData = useMemo(
    () => ohlcAtFrequency(sourceOhlc, resolvedFreq),
    [sourceOhlc, resolvedFreq],
  );
  const detectedPatterns = useMemo(
    () => (ohlcData.length ? scanPatterns(ohlcData) : []),
    [ohlcData]
  );

  useEffect(() => {
    setHighlights([]);
    setHelpHighlightId(null);
  }, [ohlcData]);

  const helpPattern = highlights.find((h) => h.id === helpHighlightId)?.pattern;
  const upsertHighlight = (item: ChartHighlight) => {
    setHighlights((prev) => [...prev.filter((h) => h.id !== item.id), item]);
  };
  const revealChart = () => {
    requestAnimationFrame(() => {
      document
        .getElementById("market-chart")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const toggleControl = (key: keyof typeof controls) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className="border-b border-line bg-surface px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Charts</h1>
          <p className="text-[12px] text-muted">{dataProvider.label} feed</p>
        </div>
        <label className="flex flex-col text-right gap-0.5">
          <span className="text-[12px] text-muted">Provider</span>
          <select
            value={providerId}
            onChange={(e) => {
              const next = e.target.value as MarketDataProviderId;
              setProviderId(next);
              setStoredProviderId(next);
            }}
            className="bg-surface border border-line text-ink px-2 py-1.5 rounded-md text-sm"
          >
            {listMarketDataProviders().map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto relative">
        <MarketNavigator
          compact
          initialClass={classFromUrl}
          selectedClass={assetFilter === "all" ? null : assetFilter}
          onSelectClass={applyAssetFilter}
          onSessionPeekChange={setPeekOn}
        />

        {/* Financials */}
        {market && !emptyClass ? <FinancialsPanel data={ohlcData} /> : null}

        {market?.pack.assetClass === "equity" && !isChartGateComplete() ? (
          <div className="border border-line bg-surface rounded-md px-3 py-2 text-[13px] text-muted flex flex-wrap items-center gap-2">
            <span>SAMPLE equity pack · Indicators quiz still open on Beginner path.</span>
            <Link
              to={`/training?group=${CHART_GATE_TRAINING_GROUP}&start=1`}
              className="underline text-primary"
            >
              Run Indicators quiz
            </Link>
          </div>
        ) : null}

        {market?.pack.assetClass === "option_context" ? (
          <div className="border border-line bg-surface rounded-md px-3 py-2 text-[13px] text-muted flex flex-wrap items-center gap-2">
            <span>
              Options context · SAMPLE underlying tape only — not a live chain or Greeks engine.
            </span>
            <Link
              to="/archive?tab=literacy&open=options-context"
              className="underline text-primary"
            >
              Options context (SAMPLE)
            </Link>
          </div>
        ) : null}

        {market?.pack.assetClass === "crypto" ? (
          <div className="border border-line bg-surface rounded-md px-3 py-2 text-[13px] text-muted">
            Crypto browse · SAMPLE chart drills only — does not replace the Equities (stocks)
            Beginner path.
          </div>
        ) : null}

        {market?.pack.assetClass === "forex" ? (
          <div className="border border-line bg-surface rounded-md px-3 py-2 text-[13px] text-muted">
            Forex browse · SAMPLE spot FX — traditional retail stocks track remains{" "}
            <span className="text-ink">Equities</span> (Class filter).
          </div>
        ) : null}

        {assetFilter === "all" || assetFilter === "equity" ? (
          <p className="text-[12px] text-muted">
            Traditional retail market type = Equities (stocks). Other classes are SAMPLE
            expansion.
          </p>
        ) : null}

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-muted">Class</label>
            <select
              value={assetFilter}
              onChange={(e) => {
                applyAssetFilter(e.target.value as MarketAssetFilter);
              }}
              className="bg-surface border border-line text-ink px-3 py-2 rounded-md text-sm"
            >
              <option value="all">All</option>
              {ASSET_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {CLASS_LABELS[cls]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-muted">Market</label>
            <select
              value={marketInFilter?.id ?? ""}
              onChange={(e) => setMarketId(e.target.value)}
              disabled={emptyClass}
              className="bg-surface border border-line text-ink px-3 py-2 rounded-md text-sm disabled:opacity-40"
            >
              {filteredMarkets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.pack.assetClass === "equity" ? `${m.pair} · SAMPLE` : m.pair}
                </option>
              ))}
            </select>
            <BrowsePopover
              title="Markets"
              selectedId={marketInFilter?.id}
              items={filteredMarkets.map((m) => ({
                id: m.id,
                label:
                  m.pack.assetClass === "equity" ? `${m.pair} · SAMPLE` : m.pair,
                hint: CLASS_LABELS[m.pack.assetClass],
              }))}
              onSelect={setMarketId}
            />
          </div>
          {!emptyClass && market ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div className="panel p-3">
                <p className="text-[12px] text-muted">Pair</p>
                <p className="text-xl font-semibold tabular-nums">{market.pair}</p>
              </div>
              <div className="panel p-3">
                <p className="text-[12px] text-muted">Price</p>
                <p className="text-xl font-semibold tabular-nums">{market.price}</p>
              </div>
              <div className="panel p-3">
                <p className="text-[12px] text-muted">24h</p>
                <p className="text-xl font-semibold tabular-nums">{market.delta}</p>
              </div>
              <div className="panel p-3">
                <p className="text-[12px] text-muted">Volatility</p>
                <p className="text-xl font-semibold">{market.volatility}</p>
              </div>
            </div>
          ) : null}
        </div>

        {emptyClass ? (
          <div className="flex-1 panel p-8 text-sm text-muted space-y-2">
            <p className="text-ink font-semibold">
              {assetFilter !== "all" &&
              assetFilter !== "equity" &&
              !canBrowseAssetClass(assetFilter)
                ? `${CLASS_LABELS[assetFilter]} is locked this session`
                : `No packs in ${CLASS_LABELS[assetFilter as AssetClass] ?? assetFilter}`}
            </p>
            <p>
              {assetFilter !== "all" &&
              assetFilter !== "equity" &&
              !canBrowseAssetClass(assetFilter)
                ? "Use Browse this session in the navigator above. Equities stays the default path."
                : "No SAMPLE packs in this asset class yet. Switch to Equities (stocks — traditional retail), Futures, Options context, Forex, or Crypto — or leave Class = All."}
            </p>
          </div>
        ) : null}

        {/* Chart Container */}
        {!emptyClass && market ? (
        <div
          id="market-chart"
          data-highlight-bars={highlights.flatMap((h) => h.indices).join(",")}
          className="relative min-h-[350px] shrink-0"
        >
          <MarketChart
            data={ohlcData}
            showSMA={controls.sma}
            showEMA={controls.ema}
            showRSI={controls.rsi}
            showMACD={controls.macd}
            showBollinger={controls.bollinger}
            height={320}
            highlights={highlights}
            onExplainHighlight={(id) => setHelpHighlightId(id)}
            onClearHighlight={(id) => {
              setHighlights((prev) => prev.filter((h) => h.id !== id));
              setHelpHighlightId((cur) => (cur === id ? null : cur));
            }}
            statusLabel={`${dataProvider.label} feed`}
            youtubeTitle={market.name}
            frequencies={frequencies}
            frequencyMinutes={resolvedFreq}
            nativeMinutes={nativeMinutes}
            onFrequencyMinutes={(minutes) => {
              if (minutes === resolvedFreq) {
                setHighlights([]);
                setHelpHighlightId(null);
                return;
              }
              setFreqMinutes(minutes);
            }}
          />
        </div>
        ) : null}

        {/* Overlays & Controls */}
        {!emptyClass && market ? (
        <div className="panel p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-[12px] font-semibold text-muted">Overlays</h3>
                <button
                  onClick={() => setShowGlossary(!showGlossary)}
                  className="p-1 rounded hover:bg-primary/10 text-primary/70 hover:text-primary transition-colors"
                  title="How indicators help"
                >
                  <span className="material-symbols-outlined text-sm">info</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                {(Object.keys(controls) as Array<keyof typeof controls>).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 cursor-pointer group"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setPopover({ overlayId: key, x: e.clientX, y: e.clientY });
                    }}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={controls[key]}
                        onChange={() => toggleControl(key)}
                      />
                      <div className="w-10 h-5 bg-canvas border border-line rounded-full peer-checked:bg-primary/20 transition-all"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-muted rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-primary"></div>
                    </div>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setHistoryOpen(true)}
                className="flex-1 md:flex-none border border-line text-ink px-5 py-2.5 rounded-md font-medium hover:bg-canvas text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">history</span>
                History
              </button>
              <button
                onClick={() => setScanOpen(true)}
                className="flex-1 md:flex-none bg-primary text-white px-6 py-2.5 rounded-md font-semibold hover:bg-primary-dim text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">radar</span>
                Scan patterns
              </button>
            </div>
          </div>
          {showGlossary && (
            <div className="pt-4 border-t border-line">
              <IndicatorGlossary compact onClose={() => setShowGlossary(false)} />
            </div>
          )}
        </div>
        ) : null}

        {historyOpen && market ? (
          <HistoryModal
            data={ohlcData}
            onClose={() => setHistoryOpen(false)}
            onSelectBar={(index, bar) => {
              upsertHighlight({
                id: `bar-${index}`,
                indices: [index],
                label: bar.name || `Bar ${index + 1}`,
              });
              setHistoryOpen(false);
              revealChart();
            }}
          />
        ) : null}
        {scanOpen && market ? (
          <ScanPatternsModal
            patterns={detectedPatterns}
            onClose={() => setScanOpen(false)}
            onSelectPattern={(p) => {
              upsertHighlight({
                id: `pattern-${p.index}-${p.name}`,
                indices: patternBarIndices(p),
                label: p.name,
                canExplain: true,
                pattern: p,
              });
              setScanOpen(false);
              revealChart();
            }}
          />
        ) : null}
        {helpPattern ? (
          <PatternDetailModal
            pattern={patternDefForScanName(
              helpPattern.name,
              helpPattern.description,
            )}
            onClose={() => setHelpHighlightId(null)}
          />
        ) : null}
        {popover && (
          <IndicatorPopover
            overlayId={popover.overlayId}
            x={popover.x}
            y={popover.y}
            onClose={() => setPopover(null)}
            onLearnMore={() => {
              const overlay = getOverlay(popover.overlayId);
              setPopover(null);
              if (overlay) setSelectedOverlay(overlay);
            }}
          />
        )}
        {selectedOverlay && (
          <IndicatorDetailModal
            overlay={selectedOverlay}
            onClose={() => setSelectedOverlay(null)}
          />
        )}
      </main>
    </div>
  );
}

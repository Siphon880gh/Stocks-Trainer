import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import MarketChart from "../components/MarketChart";
import HistoryModal from "../components/HistoryModal";
import ScanPatternsModal from "../components/ScanPatternsModal";
import IndicatorGlossary from "../components/IndicatorGlossary";
import IndicatorPopover from "../components/IndicatorPopover";
import FinancialsPanel from "../components/FinancialsPanel";
import { MARKETS, getMarket } from "../lib/markets";
import { getOverlay, type OverlayDef } from "../lib/overlays";
import { scanPatterns } from "../lib/patternScan";
import IndicatorDetailModal from "../components/IndicatorDetailModal";

export default function Market() {
  const [marketId, setMarketId] = useState("btc");
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
  const [popover, setPopover] = useState<{ overlayId: string; x: number; y: number } | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<OverlayDef | null>(null);

  const market = getMarket(marketId) ?? MARKETS[0];
  const ohlcData = market.data;
  const detectedPatterns = useMemo(() => scanPatterns(ohlcData), [ohlcData]);

  const toggleControl = (key: keyof typeof controls) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="scanline-thin"></div>

      {/* Header Section */}
      <header className="border-b border-primary/20 bg-background-dark p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer">
          <span className="material-symbols-outlined text-primary">terminal</span>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-primary/60 uppercase">System_Core_v4.2</h1>
            <p className="text-lg font-bold leading-tight">MARKET_ANALYTICS_PRO</p>
          </div>
        </Link>
        <div className="flex gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-primary/40 uppercase">Latency</p>
            <p className="text-xs font-mono text-primary">14ms</p>
          </div>
          <button className="bg-primary/10 border border-primary/30 p-2 rounded hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary">settings_input_component</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative">
        {/* Financials */}
        <FinancialsPanel data={ohlcData} />

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-primary/50 uppercase">Market</label>
            <select
              value={marketId}
              onChange={(e) => setMarketId(e.target.value)}
              className="bg-background-dark border border-primary/40 text-primary px-3 py-2 rounded font-mono text-sm"
            >
              {MARKETS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.pair}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <div className="bg-neutral-dark/80 border border-primary/30 p-3 rounded">
              <p className="text-[10px] text-primary/50 uppercase">Asset_Pair</p>
              <p className="text-xl font-bold">{market.pair}</p>
            </div>
            <div className="bg-neutral-dark/80 border border-primary/30 p-3 rounded">
              <p className="text-[10px] text-primary/50 uppercase">Current_Price</p>
              <p className="text-xl font-bold text-primary tracking-tighter">{market.price}</p>
            </div>
            <div className="bg-neutral-dark/80 border border-primary/30 p-3 rounded">
              <p className="text-[10px] text-primary/50 uppercase">24H_Delta</p>
              <p className="text-xl font-bold text-primary">{market.delta}</p>
            </div>
            <div className="bg-neutral-dark/80 border border-primary/30 p-3 rounded">
              <p className="text-[10px] text-primary/50 uppercase">Volatility_Index</p>
              <p className="text-xl font-bold text-accent-red">{market.volatility}</p>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex-1 bg-background-dark border-2 border-primary/40 rounded-lg relative overflow-hidden terminal-grid p-4 min-h-[350px]">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <span className="flex items-center gap-1 text-[10px] text-primary bg-neutral-dark/80 px-2 py-1 rounded border border-primary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> LIVE_FEED
            </span>
          </div>
          <div className="h-[350px] w-full">
            <MarketChart
              data={ohlcData}
              showSMA={controls.sma}
              showEMA={controls.ema}
              showRSI={controls.rsi}
              showMACD={controls.macd}
              showBollinger={controls.bollinger}
              height={350}
            />
          </div>
        </div>

        {/* Overlays & Controls */}
        <div className="bg-neutral-dark/80 border border-primary/30 rounded-lg p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">Layer_Controls</h3>
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
                      <div className="w-10 h-5 bg-background-dark border border-primary/40 rounded-full peer-checked:bg-primary/20 transition-all"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-primary/40 rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-primary"></div>
                    </div>
                    <span className="text-sm font-bold group-hover:text-primary transition-colors uppercase">{key}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setHistoryOpen(true)}
                className="flex-1 md:flex-none border border-primary/40 text-primary px-6 py-3 rounded font-bold hover:bg-primary/10 transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">history</span>
                History
              </button>
              <button
                onClick={() => setScanOpen(true)}
                className="flex-1 md:flex-none bg-primary text-background-dark px-8 py-3 rounded font-bold hover:bg-primary/90 transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,255,20,0.3)]"
              >
                <span className="material-symbols-outlined">radar</span>
                Scan_Patterns
              </button>
            </div>
          </div>
          {showGlossary && (
            <div className="pt-4 border-t border-primary/20">
              <IndicatorGlossary compact onClose={() => setShowGlossary(false)} />
            </div>
          )}
        </div>

        {historyOpen && <HistoryModal data={ohlcData} onClose={() => setHistoryOpen(false)} />}
        {scanOpen && <ScanPatternsModal patterns={detectedPatterns} onClose={() => setScanOpen(false)} />}
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

      {/* Bottom Navigation Bar */}
      <nav className="border-t border-primary/30 bg-background-dark px-4 pb-6 pt-2">
        <div className="flex gap-2 max-w-lg mx-auto">
          <Link to="/market" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Market</span>
          </Link>
          <Link to="/archive" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">shield_with_heart</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Security</span>
          </Link>
          <div className="flex flex-1 flex-col items-center justify-center -mt-8">
            <div className="bg-primary p-3 rounded-full shadow-[0_0_25px_rgba(56,255,20,0.4)]">
              <span className="material-symbols-outlined text-background-dark">add</span>
            </div>
          </div>
          <Link to="/training" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">memory</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Compute</span>
          </Link>
          <Link to="/" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </Link>
        </div>
      </nav>

      {/* UI Decor */}
      <div className="fixed bottom-24 right-4 pointer-events-none opacity-20 hidden lg:block">
        <div className="text-[8px] font-mono text-primary leading-tight">
          SYSTEM_STATUS: OK<br />
          ENCRYPTION: AES_256<br />
          NODE_CLUSTER: 0x82f...<br />
          THROUGHPUT: 1.2 GB/s
        </div>
      </div>
    </div>
  );
}

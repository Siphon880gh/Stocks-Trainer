import { useState } from "react";
import { Link } from "react-router-dom";

export default function Market() {
  const [controls, setControls] = useState({
    sma: true,
    ema: false,
    rsi: true,
    macd: false,
  });

  const toggleControl = (key: keyof typeof controls) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="scanline-thin"></div>

      {/* Header Section */}
      <header className="border-b border-primary/20 bg-background-dark p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">terminal</span>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-primary/60 uppercase">System_Core_v4.2</h1>
            <p className="text-lg font-bold leading-tight">MARKET_ANALYTICS_PRO</p>
          </div>
        </div>
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
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-dark/40 border border-primary/20 p-3 rounded">
            <p className="text-[10px] text-primary/50 uppercase">Asset_Pair</p>
            <p className="text-xl font-bold">BTC/USDT</p>
          </div>
          <div className="bg-neutral-dark/40 border border-primary/20 p-3 rounded">
            <p className="text-[10px] text-primary/50 uppercase">Current_Price</p>
            <p className="text-xl font-bold text-primary tracking-tighter">$64,281.92</p>
          </div>
          <div className="bg-neutral-dark/40 border border-primary/20 p-3 rounded">
            <p className="text-[10px] text-primary/50 uppercase">24H_Delta</p>
            <p className="text-xl font-bold text-primary">+4.12%</p>
          </div>
          <div className="bg-neutral-dark/40 border border-primary/20 p-3 rounded">
            <p className="text-[10px] text-primary/50 uppercase">Volatility_Index</p>
            <p className="text-xl font-bold text-accent-red">HIGH</p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex-1 bg-background-dark border border-primary/30 rounded-lg relative overflow-hidden terminal-grid p-6 min-h-[300px]">
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="flex items-center gap-1 text-[10px] text-primary/60 bg-primary/5 px-2 py-1 rounded border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> LIVE_FEED
            </span>
          </div>

          {/* Candlestick Visual Representation */}
          <div className="w-full h-full flex items-end justify-around gap-1 md:gap-4 pb-8 pt-12">
            {/* Data Points (Static Simulation) */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-1 bg-primary h-24 relative">
                <div className="absolute top-4 -left-1 w-3 h-12 bg-primary"></div>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-1 bg-accent-red h-32 relative">
                <div className="absolute top-8 -left-1 w-3 h-16 bg-accent-red"></div>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-1 bg-primary h-40 relative">
                <div className="absolute top-10 -left-1 w-3 h-20 bg-primary"></div>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-1 bg-primary h-20 relative">
                <div className="absolute top-2 -left-1 w-3 h-10 bg-primary"></div>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-1 bg-accent-red h-28 relative">
                <div className="absolute top-6 -left-1 w-3 h-14 bg-accent-red"></div>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-1 bg-primary h-48 relative">
                <div className="absolute top-12 -left-1 w-3 h-24 bg-primary"></div>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-1 bg-primary h-36 relative">
                <div className="absolute top-8 -left-1 w-3 h-18 bg-primary shadow-[0_0_10px_rgba(56,255,20,0.5)]"></div>
              </div>
            </div>

            {/* RSI Overlay simulation */}
            {controls.rsi && (
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <path d="M0,150 Q100,100 200,180 T400,120 T600,200 T800,140 T1000,170" fill="none" stroke="#38ff14" strokeDasharray="4" strokeWidth="1.5"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Chart Axes Labels */}
          <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-6 text-[10px] text-primary/40 font-mono">
            <span>70,000</span><span>65,000</span><span>60,000</span><span>55,000</span><span>50,000</span>
          </div>
          <div className="absolute bottom-1 w-full flex justify-around px-6 text-[10px] text-primary/40 font-mono">
            <span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>00:00</span>
          </div>
        </div>

        {/* Overlays & Controls */}
        <div className="bg-neutral-dark/60 border border-primary/20 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-auto">
              <h3 className="text-[10px] font-bold text-primary/60 uppercase mb-3 tracking-[0.2em]">Layer_Controls</h3>
              <div className="flex flex-wrap gap-4">
                {(Object.keys(controls) as Array<keyof typeof controls>).map((key) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
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
              <button className="flex-1 md:flex-none border border-primary/40 text-primary px-6 py-3 rounded font-bold hover:bg-primary/10 transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">history</span>
                History
              </button>
              <button className="flex-1 md:flex-none bg-primary text-background-dark px-8 py-3 rounded font-bold hover:bg-primary/90 transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,255,20,0.3)]">
                <span className="material-symbols-outlined">radar</span>
                Scan_Patterns
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="border-t border-primary/20 bg-background-dark px-4 pb-6 pt-2">
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

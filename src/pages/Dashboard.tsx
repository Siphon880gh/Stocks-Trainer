import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      {/* Header / Terminal Identity */}
      <header className="border-b border-primary/30 p-4 flex items-center justify-between bg-background-light dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl crt-glow">terminal</span>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-primary crt-glow">ANALYSIS_CORE_v2.0</h1>
            <p className="text-[10px] text-primary/60 leading-none">SYSTEM_STATUS: OPERATIONAL // USER: TRADER_01</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] text-primary/60">LATENCY: 14MS</span>
            <span className="text-[10px] text-primary/60">UPTIME: 142:12:05</span>
          </div>
          <button className="border-neon p-2 flex items-center justify-center hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">power_settings_new</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Market Feed Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-sm">sensors</span>
            <h2 className="text-sm font-bold tracking-widest text-primary/80">MARKET_FEED_SUMMARY</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-neon p-4 bg-primary/5 flex flex-col gap-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <span className="material-symbols-outlined text-4xl">trending_up</span>
              </div>
              <p className="text-xs text-primary/70">BTC / USDT</p>
              <p className="text-2xl font-bold tracking-tight text-primary">$64,231.00</p>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="material-symbols-outlined text-sm">arrow_drop_up</span>
                <span>+2.41% [BULLISH]</span>
              </div>
            </div>
            <div className="border-neon p-4 bg-primary/5 flex flex-col gap-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-20 text-red-500">
                <span className="material-symbols-outlined text-4xl">trending_down</span>
              </div>
              <p className="text-xs text-primary/70">ETH / USDT</p>
              <p className="text-2xl font-bold tracking-tight text-primary">$3,450.12</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                <span>-1.18% [RETRACING]</span>
              </div>
            </div>
            <div className="border-neon p-4 bg-primary/5 flex flex-col gap-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <span className="material-symbols-outlined text-4xl">show_chart</span>
              </div>
              <p className="text-xs text-primary/70">S&P 500 INDEX</p>
              <p className="text-2xl font-bold tracking-tight text-primary">5,240.10</p>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="material-symbols-outlined text-sm">arrow_drop_up</span>
                <span>+0.52% [STABLE]</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Progress & Lesson */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 border-neon p-6 bg-primary/5 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h3 className="text-xs text-primary/60 font-medium tracking-widest">ACTIVE_MODULE_04/12</h3>
                  <h2 className="text-2xl font-bold text-primary crt-glow">BULLISH_ENGULFING_PATTERNS</h2>
                </div>
                <p className="text-2xl font-bold">65%</p>
              </div>
              <div className="h-4 w-full bg-primary/20 border border-primary/30 p-0.5">
                <div className="h-full bg-primary shadow-[0_0_10px_#38ff14]" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-2">
                <span className="material-symbols-outlined text-primary/70">menu_book</span>
                <span className="text-[10px]">READ_THEORY</span>
              </div>
              <div className="p-3 border border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-2">
                <span className="material-symbols-outlined text-primary/70">visibility</span>
                <span className="text-[10px]">IDENTIFY_CANDLE</span>
              </div>
              <div className="p-3 border border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-2">
                <span className="material-symbols-outlined text-primary/70">history_edu</span>
                <span className="text-[10px]">PRACTICE_DRAW</span>
              </div>
              <Link to="/training" className="p-3 border border-primary bg-primary text-background-dark font-bold flex flex-col items-center text-center gap-2 hover:bg-primary/90">
                <span className="material-symbols-outlined">play_arrow</span>
                <span className="text-[10px]">RESUME_SIM</span>
              </Link>
            </div>
          </section>

          {/* Navigation Grid */}
          <section className="grid grid-cols-1 gap-4">
            <Link to="/market" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">candlestick_chart</span>
                <div>
                  <p className="font-bold tracking-widest">CHARTS</p>
                  <p className="text-[10px] opacity-70">REAL_TIME_ANALYSIS</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
            <Link to="/training" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">quiz</span>
                <div>
                  <p className="font-bold tracking-widest">QUIZ_CENTER</p>
                  <p className="text-[10px] opacity-70">VALIDATE_KNOWLEDGE</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
            <Link to="/archive" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">inventory_2</span>
                <div>
                  <p className="font-bold tracking-widest">ARCHIVE</p>
                  <p className="text-[10px] opacity-70">HISTORICAL_PATTERNS</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </section>
        </div>

        {/* Terminal Logs / Footer Stats */}
        <section className="border-neon p-4 bg-primary/5 font-mono text-[11px] h-32 overflow-y-auto space-y-1">
          <p className="text-primary/40">[2024-05-24 10:42:01] INITIALIZING_NEURAL_ENGINE...</p>
          <p className="text-primary/40">[2024-05-24 10:42:03] FETCHING_OHLCV_DATA_BTC_60M...</p>
          <p className="text-primary/80">[2024-05-24 10:42:05] PATTERN_DETECTED: THREE_WHITE_SOLDIERS (CONFIDENCE: 88%)</p>
          <p className="text-primary/40">[2024-05-24 10:45:12] USER_CONNECTED: TRADER_01</p>
          <p className="text-primary/40">[2024-05-24 10:48:22] SYNCING_LEARNING_PROGRESS...</p>
          <p className="text-primary/80 animate-pulse">_</p>
        </section>
      </main>

      {/* Navigation Bar */}
      <nav className="border-t border-primary/30 bg-background-light dark:bg-background-dark/95 backdrop-blur-md sticky bottom-0 w-full z-50">
        <div className="flex max-w-7xl mx-auto px-4 py-2 gap-2">
          <Link to="/" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-primary border-b-2 border-primary">
            <span className="material-symbols-outlined fill-1">dashboard</span>
            <p className="text-[10px] font-bold tracking-widest">DASHBOARD</p>
          </Link>
          <Link to="/training" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">school</span>
            <p className="text-[10px] font-bold tracking-widest">LEARN</p>
          </Link>
          <Link to="/market" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">monitoring</span>
            <p className="text-[10px] font-bold tracking-widest">MARKET</p>
          </Link>
          <Link to="/archive" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <p className="text-[10px] font-bold tracking-widest">CONFIG</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

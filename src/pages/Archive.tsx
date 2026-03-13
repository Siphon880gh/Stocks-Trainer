import { Link } from "react-router-dom";

export default function Archive() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 border-b border-primary/20 backdrop-blur-sm">
        <div className="flex items-center p-4 justify-between">
          <div className="text-primary flex size-10 shrink-0 items-center justify-center">
            <span className="material-symbols-outlined text-3xl">terminal</span>
          </div>
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
            <div className="flex w-full items-stretch rounded-lg bg-primary/5 border border-primary/20 h-11">
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
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded bg-primary text-background-dark px-4 cursor-pointer">
            <p className="text-xs font-bold uppercase tracking-wider">All Patterns</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded bg-primary/10 border border-primary/20 text-primary px-4 cursor-pointer hover:bg-primary/20">
            <p className="text-xs font-bold uppercase tracking-wider">Bullish</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded bg-primary/10 border border-primary/20 text-primary px-4 cursor-pointer hover:bg-primary/20">
            <p className="text-xs font-bold uppercase tracking-wider">Bearish</p>
          </div>
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded bg-primary/10 border border-primary/20 text-primary px-4 cursor-pointer hover:bg-primary/20">
            <p className="text-xs font-bold uppercase tracking-wider">Neutral</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-primary text-sm font-bold uppercase tracking-[0.2em] font-mono">Pattern Library / root</h3>
          <span className="text-primary/40 text-xs font-mono">Total: 128 entries</span>
        </div>

        <div className="space-y-4">
          {/* Bullish Engulfing */}
          <div className="group flex flex-col rounded-xl border border-primary/10 bg-primary/5 p-4 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 rounded bg-slate-800 overflow-hidden border border-primary/20">
                <img
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSwPBT69N9gyHODv6wEk3TxIBc4-3ay_gCPqpysgpE_Giwi6IgnB6HnrDgTqGuEqsf3sU40XocSlLdDsDRsCfLIQzGu0QWRVpF5sqEZnCAkxA4KsBZ2EQGrJ0yV0zRqjms1MNEwq6he1uPeKKbQso4qlKhzlp1wwV_90lmJqy7LrDUoXQADwu_DN_Jq4ho68EYHb0-btzgGQLu6pYVMMNC4-Wny4e7idcmwYYN97QjyGza4uqUYFFUZaOF14hXB5NUKWUqhjD4aMQ"
                  alt="Bullish Engulfing pattern"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">arrow_upward</span>
                    <h4 className="text-slate-100 font-bold text-base font-display">Bullish Engulfing</h4>
                  </div>
                  <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">
                    &gt; REVERSAL_PATTERN<br />
                    &gt; CONFIRMATION: HIGH<br />
                    A large green candle completely overlaps the previous small red candle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Head and Shoulders */}
          <div className="group flex flex-col rounded-xl border border-primary/10 bg-primary/5 p-4 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 rounded bg-slate-800 overflow-hidden border border-primary/20">
                <img
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZpguSJwYPDQQ1qUjaL0m7CBDYZ__dnEhXVjP6bo3fb6Z4ZgBtb5CPChpXMtYOG3MjVyHXeG87nFnQ0CRvEhhIfK9j_t5NvzE3CMPlZDTpPSDmlzgiokDWkscJHusKVa3zhBf88LmhOyGMeyKEZonwcZAsm2cRJiYxz-xoOaT3avHL89xNaM5Ml3L-zKVhwo6m7bFFw22YxtiymIc3k6QTIRZYisU2s1tRppzvrq8-S8KRdV67VnOx9uOQArQRkOZhNU6pHaqi66o"
                  alt="Head and Shoulders pattern"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-sm">arrow_downward</span>
                    <h4 className="text-slate-100 font-bold text-base font-display">Head and Shoulders</h4>
                  </div>
                  <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">
                    &gt; REVERSAL_PATTERN<br />
                    &gt; CONFIRMATION: VERY_HIGH<br />
                    Three peaks: center peak (head) is highest, flanked by two lower peaks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Falling Wedge */}
          <div className="group flex flex-col rounded-xl border border-primary/10 bg-primary/5 p-4 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 rounded bg-slate-800 overflow-hidden border border-primary/20">
                <img
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgLmQ-EPA5nTTlgInw2ijC6mS1jqzIIX5e6KBWyyX93tMRrzkPMsBqjJeokq5w122trRHnwowD5Dvd5VoSyKzsH6KD167bHM_PB8LnLXBkpfsA_QrxDUiXqOqz5DnuYfg3fsr2i-QZPmiZNNrjV6TlttntMZPayFCx6EmWwAAmy1NDlszHba-n6WP-eS2rscXgVsWIIpuHB_RIFm8MjSykwYgnBu_tZ3_Eu1pSmlwmFXs3gKNi1kqzC0TeoYpnL2Sp5PACwdVLQ2s"
                  alt="Falling Wedge pattern"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">trending_flat</span>
                    <h4 className="text-slate-100 font-bold text-base font-display">Falling Wedge</h4>
                  </div>
                  <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">
                    &gt; CONTINUATION_PATTERN<br />
                    &gt; CONFIRMATION: MEDIUM<br />
                    Price consolidates between two downward sloping, converging trendlines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Morning Star */}
          <div className="group flex flex-col rounded-xl border border-primary/10 bg-primary/5 p-4 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 rounded bg-slate-800 overflow-hidden border border-primary/20">
                <img
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCubf4b2aqAAnqX_z1aucWOJQNj0U2-f-M0leSTw8ke0Qhyt-BbmYrR8qGeFZhI7UM-L6oHAiDY-pHggtYMtMWAQBNG7_mPkO4WWW6HzwZ3jnzG9_h956vubEG6K_94vTAWo09ja8cVSDmn2QZZX6rm5TChY7gaGSqC2KuccAtpkA9eY0FQz3fXTlM0eJISQfCA5VIXSvfzEa2-CCSRSqP7Qv1aJ7Hp9Br0N_DQ2S3aYqrodiCHULXYWsYcUO9FGYv67E6MNUNFP9o"
                  alt="Morning Star pattern"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">star</span>
                    <h4 className="text-slate-100 font-bold text-base font-display">Morning Star</h4>
                  </div>
                  <p className="text-primary/70 text-xs mt-2 font-mono leading-relaxed">
                    &gt; REVERSAL_PATTERN<br />
                    &gt; CONFIRMATION: HIGH<br />
                    A three-candle bullish reversal pattern occurring at the bottom of a downtrend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <nav className="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-primary/20 pb-6 pt-2">
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

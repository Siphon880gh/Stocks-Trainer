import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export default function Training() {
  const [selectedOption, setSelectedOption] = useState<string | null>("B");

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Top Navigation / Progress Bar */}
      <nav className="border-b border-primary/20 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-icons text-background-dark text-sm">psychology</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">TRAINING<span className="text-primary">TERMINAL</span></h1>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">Session Progress</span>
              <div className="w-48 h-1.5 bg-primary/10 rounded-full mt-1 overflow-hidden">
                <div className="w-2/3 h-full bg-primary shadow-[0_0_10px_#38ff14]"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded">
              <span className="material-icons text-primary text-sm">stars</span>
              <span className="font-bold text-primary">1,250 PTS</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Quiz Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-xs font-mono text-primary/40">MODULE_ID: PR-042</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Identify the Signal</h2>
            <p className="text-slate-400 max-w-xl">Analyze the price action highlighted in the terminal window below. Which candlestick pattern is currently forming at the resistance level?</p>
          </div>

          {/* Chart Snippet Container */}
          <div className="bg-slate-900 border border-primary/30 rounded-xl overflow-hidden shadow-2xl shadow-primary/5">
            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/10 bg-slate-950/50">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-[10px] font-mono text-primary/50 tracking-widest uppercase">Live_Chart_Feed // BTCUSD_1H</span>
            </div>
            <div className="relative h-[400px] w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8Wg0w2Gq3w2IXMBASIYjyYoHyMFPk8iSW1STkCOctlQ-FPdqk2wdB9W36_8tqQEeR1YyNMWFrfRWD1AbCgwONyzVcgV-40xdfgaMHVs_u5hMGjKj6scWG3lAD4WzawWLFtMKXm0mLYr2m4-Swt8Wl4fIQwsnc-de8nvkS_xnwJe4iply0_0HWkKOkFIQNnWdWH3Ts2lxpIxHbl3piuVmu5y01LrR3-CqrTg3G8tSFuz7JUNSkvdJhTlcmUGjaySjEGbl2nbr4gx8"
                alt="Financial candlestick chart showing a market trend"
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
                referrerPolicy="no-referrer"
              />
              {/* Highlight Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-48 border-2 border-primary border-dashed rounded bg-primary/5 animate-pulse flex items-center justify-center">
                  <div className="bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 absolute -top-3">TARGET</div>
                </div>
              </div>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedOption("A")}
              className={cn(
                "group relative flex flex-col items-start p-6 rounded-lg transition-all text-left",
                selectedOption === "A"
                  ? "bg-primary/10 border-2 border-primary shadow-[0_0_15px_rgba(56,255,20,0.1)]"
                  : "bg-primary/5 border border-primary/20 hover:border-primary hover:bg-primary/10"
              )}
            >
              <span className={cn("text-xs font-mono mb-2", selectedOption === "A" ? "text-primary" : "text-primary/40")}>
                OPTION_A {selectedOption === "A" && "[SELECTED]"}
              </span>
              <span className={cn("text-lg font-bold", selectedOption === "A" && "text-primary")}>Doji</span>
              <p className={cn("text-sm mt-1 transition-opacity", selectedOption === "A" ? "text-primary/60" : "text-slate-400 opacity-0 group-hover:opacity-100")}>
                Indecision in the market with equal open/close.
              </p>
              <div className={cn("absolute bottom-4 right-4 transition-all", selectedOption === "A" ? "text-primary" : "text-primary opacity-20 group-hover:opacity-100")}>
                <span className="material-icons">{selectedOption === "A" ? "check_circle" : "chevron_right"}</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedOption("B")}
              className={cn(
                "group relative flex flex-col items-start p-6 rounded-lg transition-all text-left",
                selectedOption === "B"
                  ? "bg-primary/10 border-2 border-primary shadow-[0_0_15px_rgba(56,255,20,0.1)]"
                  : "bg-primary/5 border border-primary/20 hover:border-primary hover:bg-primary/10"
              )}
            >
              <span className={cn("text-xs font-mono mb-2", selectedOption === "B" ? "text-primary" : "text-primary/40")}>
                OPTION_B {selectedOption === "B" && "[SELECTED]"}
              </span>
              <span className={cn("text-lg font-bold", selectedOption === "B" && "text-primary")}>Hammer</span>
              <p className={cn("text-sm mt-1 transition-opacity", selectedOption === "B" ? "text-primary/60" : "text-slate-400 opacity-0 group-hover:opacity-100")}>
                Bullish reversal pattern with a long lower shadow.
              </p>
              <div className={cn("absolute bottom-4 right-4 transition-all", selectedOption === "B" ? "text-primary" : "text-primary opacity-20 group-hover:opacity-100")}>
                <span className="material-icons">{selectedOption === "B" ? "check_circle" : "chevron_right"}</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedOption("C")}
              className={cn(
                "group relative flex flex-col items-start p-6 rounded-lg transition-all text-left",
                selectedOption === "C"
                  ? "bg-primary/10 border-2 border-primary shadow-[0_0_15px_rgba(56,255,20,0.1)]"
                  : "bg-primary/5 border border-primary/20 hover:border-primary hover:bg-primary/10"
              )}
            >
              <span className={cn("text-xs font-mono mb-2", selectedOption === "C" ? "text-primary" : "text-primary/40")}>
                OPTION_C {selectedOption === "C" && "[SELECTED]"}
              </span>
              <span className={cn("text-lg font-bold", selectedOption === "C" && "text-primary")}>Engulfing</span>
              <p className={cn("text-sm mt-1 transition-opacity", selectedOption === "C" ? "text-primary/60" : "text-slate-400 opacity-0 group-hover:opacity-100")}>
                Body of current candle covers previous candle.
              </p>
              <div className={cn("absolute bottom-4 right-4 transition-all", selectedOption === "C" ? "text-primary" : "text-primary opacity-20 group-hover:opacity-100")}>
                <span className="material-icons">{selectedOption === "C" ? "check_circle" : "chevron_right"}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Sidebar & Terminal Feedback */}
        <div className="lg:col-span-4 space-y-6">
          {/* Terminal Feedback */}
          <div className="bg-slate-950 border border-primary/20 rounded-xl flex flex-col h-full min-h-[500px]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10 bg-primary/5">
              <span className="material-icons text-primary text-sm">terminal</span>
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-tighter">Terminal Feedback System</span>
            </div>
            <div className="p-6 flex-grow font-mono text-sm space-y-4">
              <div className="flex gap-2">
                <span className="text-primary opacity-50">&gt;</span>
                <p className="text-slate-300">Awaiting user input sequence...</p>
              </div>
              {selectedOption && (
                <div className="flex gap-2">
                  <span className="text-primary opacity-50">&gt;</span>
                  <p className="text-slate-300">Selected option: <span className="text-primary">{selectedOption === "A" ? "A_DOJI" : selectedOption === "B" ? "B_HAMMER" : "C_ENGULFING"}</span></p>
                </div>
              )}
              {selectedOption === "B" && (
                <div className="flex gap-2">
                  <span className="text-primary opacity-50">&gt;</span>
                  <p className="text-slate-100 italic">"The long lower shadow indicates that sellers drove prices down, but were met with strong buying pressure, pushing the price back up near the open. This is a classic bullish sign."</p>
                </div>
              )}
              <div className="pt-6 border-t border-primary/10">
                <div className="flex items-center gap-3 text-primary animate-pulse">
                  <span className="material-icons text-sm">circle</span>
                  <p className="font-bold">SYSTEM READY FOR FINAL SUBMISSION</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-primary/10 bg-primary/5">
              <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                SUBMIT ANALYSIS
                <span className="material-icons">bolt</span>
              </button>
              <p className="text-[10px] text-center mt-3 text-primary/40 font-mono uppercase tracking-widest">Double check your pattern logic</p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-primary uppercase font-bold tracking-widest mb-1">Current Streak</p>
                <div className="flex items-center gap-1">
                  <span className="material-icons text-primary">local_fire_department</span>
                  <span className="text-2xl font-bold">12</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-primary uppercase font-bold tracking-widest mb-1">Accuracy</p>
                <span className="text-2xl font-bold">94%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-between border-t border-primary/10 mt-12 opacity-60 w-full">
        <div className="flex gap-6">
          <button className="text-xs font-mono hover:text-primary transition-colors uppercase tracking-widest">Documentation</button>
          <button className="text-xs font-mono hover:text-primary transition-colors uppercase tracking-widest">Shortcuts</button>
          <button className="text-xs font-mono hover:text-primary transition-colors uppercase tracking-widest">Support</button>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-tighter text-right">
          V 2.0.4 // SECURE CONNECTION STABLE
        </div>
      </footer>
    </div>
  );
}

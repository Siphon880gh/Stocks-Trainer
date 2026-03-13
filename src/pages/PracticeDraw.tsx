import { Link } from "react-router-dom";

export default function PracticeDraw() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 bg-background-dark/95 border-b border-primary/30 backdrop-blur-sm">
        <div className="flex items-center p-4 justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">history_edu</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-primary font-mono">PRACTICE_DRAW</h1>
              <p className="text-[10px] text-primary/60 leading-none">DRAW_CANDLESTICK_PATTERNS</p>
            </div>
          </Link>
          <Link
            to="/"
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-xs font-mono">BACK</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-6">
        <section className="border-neon p-6 bg-neutral-dark/60 rounded-xl">
          <h2 className="text-sm font-bold tracking-widest text-primary/80 mb-2">CANVAS_AREA</h2>
          <div className="aspect-video w-full bg-background-dark border-2 border-primary/40 rounded-lg flex items-center justify-center">
            <div className="text-center text-primary/50">
              <span className="material-symbols-outlined text-6xl mb-2 block">draw</span>
              <p className="text-sm font-mono">Draw candlestick patterns here</p>
              <p className="text-xs mt-1 text-primary/40">Canvas coming soon</p>
            </div>
          </div>
        </section>

        <section className="border-neon p-4 bg-neutral-dark/80 rounded-xl font-mono text-[11px] space-y-1">
          <p className="text-primary/40">&gt; PRACTICE_DRAW module initialized</p>
          <p className="text-primary/40">&gt; Load pattern reference: Doji, Hammer, Engulfing</p>
          <p className="text-primary/80">&gt; Use canvas to sketch patterns and reinforce recognition</p>
          <p className="text-primary/40 animate-pulse">_</p>
        </section>

        <div className="flex gap-4">
          <Link
            to="/archive"
            className="flex-1 p-4 border border-primary/30 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors text-center"
          >
            <span className="material-symbols-outlined text-primary block mb-2">menu_book</span>
            <span className="text-xs font-mono text-primary">READ_THEORY</span>
          </Link>
          <Link
            to="/training"
            className="flex-1 p-4 border border-primary rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors text-center"
          >
            <span className="material-symbols-outlined text-primary block mb-2">quiz</span>
            <span className="text-xs font-mono text-primary font-bold">QUIZ_CENTER</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

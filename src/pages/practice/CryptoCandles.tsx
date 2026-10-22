import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  CRYPTO_FIT_HINT, CRYPTO_FIT_LABEL, CRYPTO_WHY, HARAMI_TAKEAWAY, HARAMI_TEACHING, candlestickPatterns,
  type CryptoFit,
} from "../../lib/cryptoCandles";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);

/** /practice/crypto-candles: which candlestick patterns work, need adaptation, or are rare on 24/7 markets. */
export default function PracticeCryptoCandles() {
  const [fit, setFit] = useState<CryptoFit | "all">("all");
  const all = useMemo(() => candlestickPatterns(), []);
  const shown = fit === "all" ? all : all.filter((p) => p.cryptoFit === fit);
  const counts = useMemo(() => {
    const c = { works: 0, adapted: 0, rare: 0 };
    for (const p of all) c[p.cryptoFit]++;
    return c;
  }, [all]);
  useEffect(() => markMiscPracticeDone("crypto-candles"), []);

  return (
    <PracticeShell
      title="Candlesticks for crypto"
      blurb="Crypto trades 24/7, so true gaps are rare. Learn which candlestick patterns carry over, which need a no-gap adaptation, and which almost never form. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="cc-why">
        <p className="font-semibold text-[14px]">{CRYPTO_WHY.title}</p>
        <ul className="list-disc pl-5 space-y-1">{CRYPTO_WHY.points.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="text-[12px]">
          Terms: {term("crypto-candle-gaps", "crypto candles and gaps")} · {term("crypto-daily-close", "crypto daily close")} · {term("umbrella-line", "umbrella line")}
        </p>
        <p className="text-[12px] space-x-1">
          {CRYPTO_WHY.sources.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{s.label}</a>
          ))}
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="cc-harami">
        <p className="font-semibold text-[14px]">Harami (works in crypto)</p>
        <p className="rounded border border-primary/40 bg-primary/5 px-3 py-2 font-medium" data-testid="cc-harami-takeaway">
          {HARAMI_TAKEAWAY}
        </p>
        <ul className="list-disc pl-5 space-y-1">
          {HARAMI_TEACHING.slice(1).map((t) => <li key={t}>{t}</li>)}
        </ul>
        <p className="text-[12px]">
          <Link to="/archive?tab=patterns&open=harami" className="text-primary underline">Archive · Harami</Link>
          {" · "}
          <Link to="/archive?tab=patterns&open=bearish-harami" className="text-primary underline">Bearish Harami</Link>
          {" · "}
          <Link to="/archive?tab=patterns&open=bullish-engulfing" className="text-primary underline">contrast: Bullish Engulfing</Link>
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="cc-filter">
        <p className="font-semibold text-[14px]">Pattern track ({all.length} candlestick patterns)</p>
        <div className="flex flex-wrap gap-1">
          {(["all", "works", "adapted", "rare"] as const).map((f) => (
            <button
              key={f}
              type="button"
              data-fit={f}
              onClick={() => setFit(f)}
              className={cn(
                "px-3 py-1 rounded border text-[12px]",
                fit === f ? "bg-primary text-white border-primary" : "border-line bg-primary/10 text-primary",
              )}
            >
              {f === "all" ? `All (${all.length})` : `${CRYPTO_FIT_LABEL[f]} (${counts[f]})`}
            </button>
          ))}
        </div>
        {fit !== "all" ? <p className="text-[12px] text-muted">{CRYPTO_FIT_HINT[fit]}</p> : null}
        <div className="grid sm:grid-cols-2 gap-1 max-h-[420px] overflow-y-auto" data-testid="cc-list">
          {shown.map((p) => (
            <Link
              key={p.id}
              to={`/archive?tab=patterns&open=${p.id}`}
              data-pattern={p.id}
              data-crypto-fit={p.cryptoFit}
              className="panel px-3 py-2 flex items-center justify-between gap-2 hover:border-primary"
            >
              <span className="font-medium text-[13px]">{p.name}</span>
              <span
                className={cn(
                  "shrink-0 text-[10px] font-mono uppercase tracking-wide rounded border px-1.5 py-0.5",
                  p.cryptoFit === "works" && "border-emerald-500/60 text-emerald-600",
                  p.cryptoFit === "adapted" && "border-amber-500/60 text-amber-600",
                  p.cryptoFit === "rare" && "border-rose-500/60 text-rose-600",
                )}
                title={CRYPTO_FIT_HINT[p.cryptoFit]}
              >
                {p.cryptoFit}
              </span>
            </Link>
          ))}
        </div>
        <p className="text-[12px]">
          Same filter on the{" "}
          <Link to="/archive?tab=patterns&crypto=works" className="text-primary underline">Archive</Link>
          {" · "}
          <Link to="/training?group=crypto-candles&start=1" className="text-primary underline">Learn · Candlesticks for Crypto</Link>
          {" · "}
          <Link to="/practice/japanese-candles" className="text-primary underline">Japanese candlesticks</Link>
        </p>
      </section>
    </PracticeShell>
  );
}

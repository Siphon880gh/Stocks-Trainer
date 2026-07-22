import { useState } from "react";
import { Link } from "react-router-dom";
import type { AssetClass } from "../lib/samplePacks";
import {
  decideLockCopy,
  decideLockReason,
  marketChartsHref,
  marketDecideHref,
  marketLiteracyHref,
  NAVIGATOR_CLASS_LABELS,
  NAVIGATOR_CLASSES,
} from "../lib/marketNavigator";

interface MarketNavigatorProps {
  /** Pre-select from URL `class` */
  initialClass?: AssetClass | null;
  compact?: boolean;
}

export default function MarketNavigator({
  initialClass = null,
  compact = false,
}: MarketNavigatorProps) {
  const [selected, setSelected] = useState<AssetClass | null>(
    initialClass && NAVIGATOR_CLASSES.includes(initialClass)
      ? initialClass
      : "equity",
  );

  const lock = selected ? decideLockReason(selected) : null;

  return (
    <section
      id="market-navigator"
      className={`border border-primary/40 rounded-lg bg-primary/5 font-mono ${
        compact ? "p-3 space-y-2" : "p-4 space-y-3"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xs font-bold text-primary tracking-widest uppercase">
          MARKET_NAVIGATOR
        </h2>
        <p className="text-[10px] text-primary/50">
          Charts · literacy · decide (SAMPLE)
        </p>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        Traditional retail ={" "}
        <span className="text-primary">Equities (stocks)</span>. Other types =
        SAMPLE browse / decide expansion — not a LIVE desk.
      </p>

      <div className="flex flex-wrap gap-2">
        {NAVIGATOR_CLASSES.map((cls) => (
          <button
            key={cls}
            type="button"
            onClick={() => setSelected(cls)}
            className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wide transition-colors ${
              selected === cls
                ? "bg-primary text-background-dark"
                : "border border-primary/40 text-primary hover:bg-primary/10"
            }`}
          >
            {NAVIGATOR_CLASS_LABELS[cls]}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-primary/20">
          <Link
            to={marketChartsHref(selected)}
            className="px-3 py-2 rounded border border-primary/50 text-primary text-[11px] font-bold hover:bg-primary/10"
          >
            VIEW_CHARTS
          </Link>
          <Link
            to={marketLiteracyHref(selected)}
            className="px-3 py-2 rounded border border-primary/50 text-primary text-[11px] font-bold hover:bg-primary/10"
          >
            READ_LITERACY
          </Link>
          {lock ? (
            <span
              className="px-3 py-2 rounded border border-white/10 text-slate-500 text-[11px] font-bold cursor-not-allowed"
              title={decideLockCopy(lock)}
            >
              DECIDE_CASES · LOCKED
            </span>
          ) : (
            <Link
              to={marketDecideHref(selected)}
              className="px-3 py-2 rounded bg-primary text-background-dark text-[11px] font-bold hover:bg-primary/90"
            >
              DECIDE_CASES
            </Link>
          )}
        </div>
      ) : null}

      {selected && lock ? (
        <p className="text-[10px] text-yellow-400/80">{decideLockCopy(lock)}</p>
      ) : null}
    </section>
  );
}

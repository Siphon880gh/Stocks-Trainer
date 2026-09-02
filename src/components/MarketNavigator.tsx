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
      className={`panel ${
        compact ? "p-3 space-y-2" : "p-4 space-y-3"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">
          Market navigator
        </h2>
        <p className="text-[12px] text-muted">
          Charts · literacy · decide (SAMPLE)
        </p>
      </div>

      <p className="text-[13px] text-muted leading-relaxed">
        Traditional retail ={" "}
        <span className="text-ink font-medium">Equities (stocks)</span>. Other types =
        SAMPLE browse / decide expansion — not a LIVE desk.
      </p>

      <div className="flex flex-wrap gap-2">
        {NAVIGATOR_CLASSES.map((cls) => (
          <button
            key={cls}
            type="button"
            onClick={() => setSelected(cls)}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              selected === cls
                ? "bg-primary text-white"
                : "border border-line text-ink hover:bg-canvas"
            }`}
          >
            {NAVIGATOR_CLASS_LABELS[cls]}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-line">
          <Link
            to={marketChartsHref(selected)}
            className="px-3 py-2 rounded-md border border-line text-ink text-[13px] hover:bg-canvas"
          >
            View charts
          </Link>
          <Link
            to={marketLiteracyHref(selected)}
            className="px-3 py-2 rounded-md border border-line text-ink text-[13px] hover:bg-canvas"
          >
            Literacy
          </Link>
          {lock ? (
            <span
              className="px-3 py-2 rounded-md border border-line text-muted text-[13px] cursor-not-allowed"
              title={decideLockCopy(lock)}
            >
              Cases locked
            </span>
          ) : (
            <Link
              to={marketDecideHref(selected)}
              className="px-3 py-2 rounded-md bg-primary text-white text-[13px] font-semibold hover:bg-primary-dim"
            >
              Decide cases
            </Link>
          )}
        </div>
      ) : null}

      {selected && lock ? (
        <p className="text-[13px] text-muted">{decideLockCopy(lock)}</p>
      ) : null}
    </section>
  );
}

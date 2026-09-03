import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { AssetClass } from "../lib/samplePacks";
import {
  canBrowseAssetClass,
  CHART_GATE_TRAINING_GROUP,
  isChartGateComplete,
  isChartGateTemporarilyBypassed,
  setChartGateTemporaryBypass,
} from "../lib/beginnerPath";
import {
  decideLockCopy,
  decideLockReason,
  marketChartsHref,
  marketCoachHref,
  marketDecideHref,
  marketLiteracyHref,
  NAVIGATOR_CLASS_LABELS,
  NAVIGATOR_CLASSES,
} from "../lib/marketNavigator";

interface MarketNavigatorProps {
  /** Pre-select from URL `class` */
  initialClass?: AssetClass | null;
  /** Charts page Class filter — when set, highlight follows it */
  selectedClass?: AssetClass | null;
  /** Charts page: update Class + chart when a market type is chosen */
  onSelectClass?: (assetClass: AssetClass) => void;
  onSessionPeekChange?: (enabled: boolean) => void;
  compact?: boolean;
}

export default function MarketNavigator({
  initialClass = null,
  selectedClass = null,
  onSelectClass,
  onSessionPeekChange,
  compact = false,
}: MarketNavigatorProps) {
  const location = useLocation();
  const onCoach =
    location.pathname === "/coach" || location.pathname.startsWith("/coach/");
  const [internalSelected, setInternalSelected] = useState<AssetClass>(
    initialClass && NAVIGATOR_CLASSES.includes(initialClass)
      ? initialClass
      : "equity",
  );
  const selected =
    selectedClass && NAVIGATOR_CLASSES.includes(selectedClass)
      ? selectedClass
      : internalSelected;
  const [tempBypass, setTempBypass] = useState(isChartGateTemporarilyBypassed);
  const gateDone = isChartGateComplete();
  const lock = selected
    ? decideLockReason(selected, gateDone || tempBypass)
    : null;

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
          Charts · literacy · decide · step (SAMPLE)
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
            onClick={() => {
              setInternalSelected(cls);
              onSelectClass?.(cls);
            }}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              selected === cls
                ? "bg-primary text-white"
                : canBrowseAssetClass(cls)
                  ? "border border-line text-ink hover:bg-canvas"
                  : "border border-line text-muted hover:bg-canvas"
            }`}
          >
            {NAVIGATOR_CLASS_LABELS[cls]}
            {!canBrowseAssetClass(cls) ? " · locked" : ""}
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
          <Link
            to={marketCoachHref(selected)}
            className={
              onCoach
                ? "px-3 py-2 rounded-md bg-primary text-white text-[13px] font-semibold hover:bg-primary-dim"
                : "px-3 py-2 rounded-md border border-line text-ink text-[13px] hover:bg-canvas"
            }
          >
            Step by step
          </Link>
          {lock === "chart_gate" || lock === "path_lock" || lock === "class_lock" ? (
            <button
              type="button"
              onClick={() => {
                setChartGateTemporaryBypass(true);
                setTempBypass(true);
                onSessionPeekChange?.(true);
              }}
              className="px-3 py-2 rounded-md border border-line text-primary text-[13px] hover:bg-canvas"
            >
              Browse this session
            </button>
          ) : lock ? (
            <span
              className="px-3 py-2 rounded-md border border-line text-muted text-[13px] cursor-not-allowed"
              title={decideLockCopy(lock)}
            >
              Cases locked
            </span>
          ) : (
            <Link
              to={marketDecideHref(selected)}
              className={
                onCoach
                  ? "px-3 py-2 rounded-md border border-line text-ink text-[13px] hover:bg-canvas"
                  : "px-3 py-2 rounded-md bg-primary text-white text-[13px] font-semibold hover:bg-primary-dim"
              }
            >
              Decide cases
            </Link>
          )}
        </div>
      ) : null}

      {selected &&
      (lock === "chart_gate" || lock === "path_lock" || lock === "class_lock") ? (
        <div className="space-y-2">
          <p className="text-[13px] text-muted leading-relaxed">
            {lock === "chart_gate"
              ? "Cases make more sense after Indicators on Training. You can open every pack for this browser session only, including Futures, Forex, Crypto, and Options context."
              : lock === "class_lock"
                ? "Futures, Forex, Crypto, and Options context stay locked until you peek this session. Equities stays the default path."
                : "This class still follows the path. You can open its decide packs for this browser session only."}
          </p>
          <p className="text-[12px] text-muted">
            Temporary — clears when you close the tab. Does not save as path
            progress.
          </p>
          {lock === "chart_gate" ? (
            <Link
              to={`/training?group=${CHART_GATE_TRAINING_GROUP}&start=1`}
              className="inline-block text-[13px] text-primary hover:underline"
            >
              Take Indicators quiz
            </Link>
          ) : null}
        </div>
      ) : null}

      {selected && lock && lock === "no_pack" ? (
        <p className="text-[13px] text-muted">{decideLockCopy(lock)}</p>
      ) : null}

      {selected && tempBypass && !lock ? (
        <div className="space-y-1">
          <p className="text-[13px] text-muted">
            Temporary session peek is on — path progress is not saved.
          </p>
          <button
            type="button"
            onClick={() => {
              setChartGateTemporaryBypass(false);
              setTempBypass(false);
              onSessionPeekChange?.(false);
            }}
            className="text-[13px] text-primary underline"
          >
            Turn off temporary peek
          </button>
        </div>
      ) : null}
    </section>
  );
}

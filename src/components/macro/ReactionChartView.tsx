import CandlestickChart from "../CandlestickChart";
import { INSTRUMENT_NAMES } from "../../lib/macro/reactions";
import { intradayChart, revealAnnotations, dailyChart, DAILY_RELEASE_INDEX } from "../../lib/macro/reactionCharts";
import { getRelease } from "../../lib/macro/releases";
import type { Instrument } from "../../lib/macro/types";

/** SIMULATED 5-minute reaction chart for one event × instrument, optionally with reveal annotations and the daily view. */
export default function ReactionChartView({
  eventId,
  instrument,
  revealed = true,
  annotate = true,
  showDaily = false,
  height = 300,
}: {
  eventId: string;
  instrument: Instrument;
  /** false = pre-release bars only. */
  revealed?: boolean;
  /** Teaching annotations on a revealed chart (release line always shows). */
  annotate?: boolean;
  showDaily?: boolean;
  height?: number;
}) {
  const e = getRelease(eventId);
  if (!e) return null;
  const c = intradayChart(e, instrument);
  const bars = revealed ? c.bars : c.bars.slice(0, c.releaseIndex);
  const isYield = instrument === "us2y" || instrument === "us10y" || instrument === "mortgage30";
  return (
    <figure className="panel p-3 space-y-2" aria-label={`${INSTRUMENT_NAMES[instrument]} reaction chart (simulated)`}>
      <figcaption className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
        <span className="font-semibold">{INSTRUMENT_NAMES[instrument]}</span>
        <span className="text-muted">5-minute bars{isYield ? " · yield in %" : ""} · {e.period} release</span>
        <span className="ml-auto text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded px-1">SIMULATED</span>
      </figcaption>
      <CandlestickChart
        data={bars}
        height={height}
        showVolume
        padRightBars={revealed ? 2 : 6}
        annotations={revealed ? (annotate ? revealAnnotations(c) : { events: revealAnnotations(c).events }) : { events: [{ index: c.releaseIndex - 1, label: "Next bar: release", tone: "entry" }] }}
      />
      {revealed && showDaily && (
        <div className="space-y-1">
          <p className="text-[12px] text-muted">Daily view: five sessions before, release day, four after.</p>
          <CandlestickChart data={dailyChart(e, instrument)} height={180} annotations={{ events: [{ index: DAILY_RELEASE_INDEX, label: "Release day" }] }} />
        </div>
      )}
    </figure>
  );
}

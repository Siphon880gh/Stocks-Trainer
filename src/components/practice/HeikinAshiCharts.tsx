import CandlestickChart from "../CandlestickChart";
import { HA_BARS, HA_CANDLES, HA_LABEL } from "../../lib/heikinAshiLab";

export type HaView = "regular" | "ha" | "both";

/** Regular and / or Heikin-Ashi candles for the lab's SIMULATED chart. */
export default function HeikinAshiCharts({ view, mark, height = 220 }: { view: HaView; mark?: number; height?: number }) {
  const one = (title: string, data: typeof HA_BARS, testid: string) => (
    <div className="min-w-0" data-testid={testid}>
      <p className="text-[11px] font-semibold text-muted px-1">{title}</p>
      <CandlestickChart data={data} height={height} highlightIndex={mark} showScaleControls={false} compact />
    </div>
  );
  return (
    <div className={view === "both" ? "grid gap-3 lg:grid-cols-2" : ""} data-testid="ha-charts" data-view={view}>
      {view !== "ha" ? one(`Regular candles · ${HA_LABEL}`, HA_BARS, "ha-chart-regular") : null}
      {view !== "regular" ? one(`Heikin-Ashi candles · ${HA_LABEL} (averaged, not traded prices)`, HA_CANDLES, "ha-chart-ha") : null}
    </div>
  );
}

/** Learn exhibit for HA-LAB- questions: both views; the answer bar is highlighted only after submit. */
export function HeikinAshiQuizExhibit({ exhibit, revealed }: { exhibit: { mark?: number }; revealed: boolean }) {
  return (
    <div className="overflow-hidden" data-testid="ha-exhibit">
      <p className="text-[10px] text-[#787b86] normal-case px-1 pb-1">
        {HA_LABEL} chart · regular vs Heikin-Ashi · educational{exhibit.mark != null && !revealed ? " · the answer bar is marked after you answer" : ""}
      </p>
      <HeikinAshiCharts view="both" mark={revealed ? exhibit.mark : undefined} height={180} />
    </div>
  );
}

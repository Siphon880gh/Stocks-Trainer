import { getOscChart, OSC_LABEL, type OscChartId, type OscPanel } from "../../lib/oscillatorLab";
import OscillatorChart from "./OscillatorChart";

/** Learn exhibit for OSC-LAB- questions: the lab's SIMULATED chart; the answer bar is marked only after submit. */
export default function OscillatorQuizExhibit({ exhibit, revealed }: { exhibit: { chartId: OscChartId; panel: OscPanel; mark?: number }; revealed: boolean }) {
  const chart = getOscChart(exhibit.chartId);
  if (!chart) return null;
  return (
    <div className="overflow-hidden" data-testid="oscillator-exhibit">
      <p className="text-[10px] text-[#787b86] normal-case px-1 pb-1">
        {OSC_LABEL} chart · {chart.title} · educational{exhibit.mark != null && !revealed ? " · the answer bar is marked after you answer" : ""}
      </p>
      <OscillatorChart chart={chart} panel={exhibit.panel} mark={revealed ? exhibit.mark : undefined} />
    </div>
  );
}

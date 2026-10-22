import type { LabChart } from "../../lib/emaMacdLab";
import { LAB_LABEL, MA_PERIOD, MACD_FAST, MACD_SIGNAL, MACD_SLOW } from "../../lib/emaMacdLab";

const W = 720;
const PRICE_H = 220;
const MACD_H = 110;
const GAP = 16;
const PAD_L = 8;
const PAD_R = 44;

function path(values: (number | null)[], x: (i: number) => number, y: (v: number) => number): string {
  let d = "";
  let pen = false;
  values.forEach((v, i) => {
    if (v == null) {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
    pen = true;
  });
  return d;
}

/** Close line + SMA(20) + EMA(20) over a MACD(12, 26, 9) pane with histogram. SIMULATED data only. */
export default function EmaMacdChart({ chart, mark, showSma = true, showEma = true }: { chart: LabChart; mark?: number; showSma?: boolean; showEma?: boolean }) {
  const n = chart.closes.length;
  const x = (i: number) => PAD_L + (i / (n - 1)) * (W - PAD_L - PAD_R);
  const lo = Math.min(...chart.bars.map((b) => b.low));
  const hi = Math.max(...chart.bars.map((b) => b.high));
  const py = (v: number) => 8 + (1 - (v - lo) / (hi - lo)) * (PRICE_H - 16);
  const mVals = [...chart.macd, ...chart.signal, ...chart.histogram].filter((v): v is number => v != null);
  const mAbs = Math.max(...mVals.map(Math.abs), 0.01);
  const top = PRICE_H + GAP;
  const my = (v: number) => top + MACD_H / 2 - (v / mAbs) * (MACD_H / 2 - 6);
  const barW = Math.max(1, (W - PAD_L - PAD_R) / n - 1);
  const ticks = [0, 29, 59, 89, 119].filter((i) => i < n);
  return (
    <figure className="space-y-1" data-testid="ema-macd-chart" data-chart={chart.id}>
      <svg viewBox={`0 0 ${W} ${PRICE_H + GAP + MACD_H + 18}`} className="w-full h-auto" role="img" aria-label={`${LAB_LABEL} chart: ${chart.title}, with SMA ${MA_PERIOD}, EMA ${MA_PERIOD} and MACD`}>
        <rect x={0} y={0} width={W} height={PRICE_H} fill="none" stroke="currentColor" strokeOpacity={0.12} />
        <text x={PAD_L + 4} y={18} fontSize={12} fontWeight={700} fill="#b45309">
          {LAB_LABEL}
        </text>
        <text x={W - PAD_R + 4} y={py(hi) + 4} fontSize={10} fill="currentColor" opacity={0.6}>
          {hi.toFixed(0)}
        </text>
        <text x={W - PAD_R + 4} y={py(lo)} fontSize={10} fill="currentColor" opacity={0.6}>
          {lo.toFixed(0)}
        </text>
        <path d={path(chart.closes, x, py)} fill="none" stroke="#64748b" strokeWidth={1.2} />
        {showSma ? <path d={path(chart.sma, x, py)} fill="none" stroke="#2563eb" strokeWidth={2} data-line="sma" /> : null}
        {showEma ? <path d={path(chart.ema, x, py)} fill="none" stroke="#ea580c" strokeWidth={2} strokeDasharray="6 3" data-line="ema" /> : null}
        <rect x={0} y={top} width={W} height={MACD_H} fill="none" stroke="currentColor" strokeOpacity={0.12} />
        <line x1={PAD_L} x2={W - PAD_R} y1={my(0)} y2={my(0)} stroke="currentColor" strokeOpacity={0.3} />
        {chart.histogram.map((v, i) =>
          v == null ? null : (
            <rect key={i} x={x(i) - barW / 2} width={barW} y={Math.min(my(0), my(v))} height={Math.max(0.5, Math.abs(my(v) - my(0)))} fill={v >= 0 ? "#16a34a" : "#dc2626"} opacity={0.55} />
          ),
        )}
        <path d={path(chart.macd, x, my)} fill="none" stroke="#0f766e" strokeWidth={1.6} data-line="macd" />
        <path d={path(chart.signal, x, my)} fill="none" stroke="#a21caf" strokeWidth={1.4} strokeDasharray="4 3" data-line="signal" />
        <text x={W - PAD_R + 4} y={my(0) + 4} fontSize={10} fill="currentColor" opacity={0.6}>
          0
        </text>
        {mark != null ? (
          <g data-mark={mark}>
            <line x1={x(mark)} x2={x(mark)} y1={0} y2={top + MACD_H} stroke="#f59e0b" strokeWidth={1.5} />
            <text x={Math.min(x(mark) + 4, W - PAD_R - 30)} y={PRICE_H - 6} fontSize={11} fontWeight={700} fill="#b45309">
              D{mark + 1}
            </text>
          </g>
        ) : null}
        {ticks.map((i) => (
          <text key={i} x={x(i)} y={top + MACD_H + 14} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.6}>
            D{i + 1}
          </text>
        ))}
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
        <span><span className="inline-block w-4 h-0.5 align-middle bg-[#64748b]" /> Close</span>
        {showSma ? <span><span className="inline-block w-4 h-0.5 align-middle bg-[#2563eb]" /> SMA({MA_PERIOD})</span> : null}
        {showEma ? <span><span className="inline-block w-4 h-0.5 align-middle bg-[#ea580c]" /> EMA({MA_PERIOD}), dashed</span> : null}
        <span><span className="inline-block w-4 h-0.5 align-middle bg-[#0f766e]" /> MACD({MACD_FAST}, {MACD_SLOW})</span>
        <span><span className="inline-block w-4 h-0.5 align-middle bg-[#a21caf]" /> Signal({MACD_SIGNAL})</span>
        <span>Bars: histogram = MACD − signal</span>
      </figcaption>
    </figure>
  );
}

import type { OscChart, OscPanel } from "../../lib/oscillatorLab";
import { ATR_PERIOD, KDJ_PERIOD, OSC_LABEL, RSI_PERIOD, STOCH_D, STOCH_PERIOD, VSTOP_MULT } from "../../lib/oscillatorLab";
import type { Series } from "../../lib/oscillators";

const W = 720;
const PRICE_H = 200;
const OSC_H = 120;
const GAP = 16;
const PAD_L = 8;
const PAD_R = 44;

function path(values: Series, x: (i: number) => number, y: (v: number) => number): string {
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

interface Line {
  key: string;
  label: string;
  values: Series;
  color: string;
  dash?: string;
}

function panelLines(chart: OscChart, panel: OscPanel): { lines: Line[]; levels: number[]; min: number; max: number; title: string } {
  if (panel === "rsi-stoch")
    return {
      title: `RSI(${RSI_PERIOD}) and fast %K(${STOCH_PERIOD})`,
      lines: [
        { key: "rsi", label: `RSI(${RSI_PERIOD})`, values: chart.rsi, color: "#7c3aed" },
        { key: "fast-k", label: `Fast %K(${STOCH_PERIOD})`, values: chart.fastK, color: "#0f766e", dash: "5 3" },
      ],
      levels: [20, 30, 70, 80],
      min: 0,
      max: 100,
    };
  if (panel === "fast-slow")
    return {
      title: `Fast and slow stochastic (${STOCH_PERIOD}, ${STOCH_D})`,
      lines: [
        { key: "fast-k", label: "Fast %K", values: chart.fastK, color: "#0f766e" },
        { key: "fast-d", label: "Fast %D = slow %K", values: chart.fastD, color: "#ea580c", dash: "5 3" },
        { key: "slow-d", label: "Slow %D", values: chart.slowD, color: "#2563eb", dash: "2 2" },
      ],
      levels: [20, 80],
      min: 0,
      max: 100,
    };
  if (panel === "kdj") {
    const js = chart.j.filter((v): v is number => v != null);
    return {
      title: `KDJ(${KDJ_PERIOD}, 3, 3)`,
      lines: [
        { key: "k", label: "K", values: chart.k, color: "#0f766e" },
        { key: "d", label: "D", values: chart.d, color: "#2563eb", dash: "5 3" },
        { key: "j", label: "J = 3K − 2D", values: chart.j, color: "#dc2626" },
      ],
      levels: [0, 20, 80, 100],
      min: Math.min(0, ...js),
      max: Math.max(100, ...js),
    };
  }
  const a = chart.atr.filter((v): v is number => v != null);
  return {
    title: `ATR(${ATR_PERIOD})`,
    lines: [{ key: "atr", label: `ATR(${ATR_PERIOD})`, values: chart.atr, color: "#b45309" }],
    levels: [],
    min: 0,
    max: Math.max(...a) * 1.1,
  };
}

/** Close line (plus the volatility stop on the "vstop" panel) over one oscillator pane. SIMULATED data only. */
export default function OscillatorChart({ chart, panel, mark }: { chart: OscChart; panel: OscPanel; mark?: number }) {
  const n = chart.closes.length;
  const x = (i: number) => PAD_L + (i / (n - 1)) * (W - PAD_L - PAD_R);
  const showStop = panel === "vstop";
  const stops = showStop ? chart.vstop.filter((v): v is number => v != null) : [];
  const lo = Math.min(...chart.bars.map((b) => b.low), ...stops);
  const hi = Math.max(...chart.bars.map((b) => b.high), ...stops);
  const py = (v: number) => 8 + (1 - (v - lo) / (hi - lo)) * (PRICE_H - 16);
  const p = panelLines(chart, panel);
  const top = PRICE_H + GAP;
  const oy = (v: number) => top + 6 + (1 - (v - p.min) / (p.max - p.min)) * (OSC_H - 12);
  const upStop: Series = chart.vstop.map((v, i) => (chart.vstopUp[i] ? v : null));
  const downStop: Series = chart.vstop.map((v, i) => (chart.vstopUp[i] === false ? v : null));
  const ticks = [0, 29, 59, 89, 119].filter((i) => i < n);
  return (
    <figure className="space-y-1" data-testid="oscillator-chart" data-chart={chart.id} data-panel={panel}>
      <svg viewBox={`0 0 ${W} ${PRICE_H + GAP + OSC_H + 18}`} className="w-full h-auto" role="img" aria-label={`${OSC_LABEL} chart: ${chart.title}, with ${p.title}`}>
        <rect x={0} y={0} width={W} height={PRICE_H} fill="none" stroke="currentColor" strokeOpacity={0.12} />
        <text x={PAD_L + 4} y={18} fontSize={12} fontWeight={700} fill="#b45309">
          {OSC_LABEL}
        </text>
        <text x={W - PAD_R + 4} y={py(hi) + 4} fontSize={10} fill="currentColor" opacity={0.6}>
          {hi.toFixed(0)}
        </text>
        <text x={W - PAD_R + 4} y={py(lo)} fontSize={10} fill="currentColor" opacity={0.6}>
          {lo.toFixed(0)}
        </text>
        <path d={path(chart.closes, x, py)} fill="none" stroke="#64748b" strokeWidth={1.3} data-line="close" />
        {showStop ? (
          <g data-line="vstop">
            <path d={path(upStop, x, py)} fill="none" stroke="#16a34a" strokeWidth={2} strokeDasharray="1 2" />
            <path d={path(downStop, x, py)} fill="none" stroke="#dc2626" strokeWidth={2} strokeDasharray="1 2" />
          </g>
        ) : null}
        <rect x={0} y={top} width={W} height={OSC_H} fill="none" stroke="currentColor" strokeOpacity={0.12} />
        {p.levels.map((l) => (
          <g key={l}>
            <line x1={PAD_L} x2={W - PAD_R} y1={oy(l)} y2={oy(l)} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="3 3" />
            <text x={W - PAD_R + 4} y={oy(l) + 4} fontSize={10} fill="currentColor" opacity={0.6}>
              {l}
            </text>
          </g>
        ))}
        {p.lines.map((l) => (
          <path key={l.key} d={path(l.values, x, oy)} fill="none" stroke={l.color} strokeWidth={1.5} strokeDasharray={l.dash} data-line={l.key} />
        ))}
        {mark != null ? (
          <g data-mark={mark}>
            <line x1={x(mark)} x2={x(mark)} y1={0} y2={top + OSC_H} stroke="#f59e0b" strokeWidth={1.5} />
            <text x={Math.min(x(mark) + 4, W - PAD_R - 30)} y={PRICE_H - 6} fontSize={11} fontWeight={700} fill="#b45309">
              D{mark + 1}
            </text>
          </g>
        ) : null}
        {ticks.map((i) => (
          <text key={i} x={x(i)} y={top + OSC_H + 14} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.6}>
            D{i + 1}
          </text>
        ))}
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
        <span>
          <span className="inline-block w-4 h-0.5 align-middle bg-[#64748b]" /> Close
        </span>
        {showStop ? (
          <span>
            <span className="inline-block w-4 h-0.5 align-middle bg-[#16a34a]" /> / <span className="inline-block w-4 h-0.5 align-middle bg-[#dc2626]" /> Volatility stop
            (ATR {ATR_PERIOD} × {VSTOP_MULT}), under price in an uptrend, over it in a downtrend
          </span>
        ) : null}
        {p.lines.map((l) => (
          <span key={l.key}>
            <span className="inline-block w-4 h-0.5 align-middle" style={{ background: l.color }} /> {l.label}
            {l.dash ? ", dashed" : ""}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

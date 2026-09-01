import { useState } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Line,
  Bar,
  Cell,
} from "recharts";
import {
  SAMPLE_OHLC,
  ohlcPriceExtent,
  paddedPriceDomain,
  type OHLC,
} from "../lib/ohlcData";
import { sma, ema, rsi, macd, bollingerBands } from "../lib/indicators";

interface MarketChartProps {
  data?: OHLC[];
  showSMA?: boolean;
  showEMA?: boolean;
  showRSI?: boolean;
  showMACD?: boolean;
  showBollinger?: boolean;
  /** Price pane height; RSI/MACD add panes below (TradingView-style). */
  height?: number;
  /** Show zoom in/out controls for the price axis. */
  showScaleControls?: boolean;
}

const BULLISH = "#38ff14";
const BEARISH = "#ff3814";
const RSI_COLOR = "#a78bfa";
const MACD_COLOR = "#38bdf8";
const SIGNAL_COLOR = "#818cf8";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;
const OSC_PANEL_H = 120;

type ChartRow = OHLC & {
  index: number;
  sma: number | null;
  ema: number | null;
  rsi: number | null;
  macd: number | null;
  signal: number | null;
  histogram: number | null;
  bbMid: number | null;
  bbUpper: number | null;
  bbLower: number | null;
};

function PriceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return (
    <div className="font-mono text-sm space-y-1 bg-neutral-dark border-2 border-primary/60 rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(0,0,0,0.8)] min-w-[140px]">
      <p className="text-primary font-bold border-b border-primary/40 pb-1.5 mb-2">
        {d.name}
      </p>
      <div className="space-y-1 text-slate-100">
        <p>
          <span className="text-primary/80 w-4 inline-block">O</span> {fmt(d.open)}
        </p>
        <p>
          <span className="text-primary/80 w-4 inline-block">H</span> {fmt(d.high)}
        </p>
        <p>
          <span className="text-primary/80 w-4 inline-block">L</span> {fmt(d.low)}
        </p>
        <p>
          <span className="text-primary/80 w-4 inline-block">C</span> {fmt(d.close)}
        </p>
      </div>
    </div>
  );
}

function PaneLegend({
  items,
}: {
  items: Array<{ color: string; label: string; dashed?: boolean }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 pb-1 font-mono text-[10px]">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5 text-slate-300">
          <span
            className="inline-block w-3 h-0.5 shrink-0"
            style={{
              backgroundColor: item.dashed ? "transparent" : item.color,
              borderTop: item.dashed ? `1.5px dashed ${item.color}` : undefined,
            }}
            aria-hidden
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export default function MarketChart({
  data = SAMPLE_OHLC,
  showSMA = false,
  showEMA = false,
  showRSI = false,
  showMACD = false,
  showBollinger = false,
  height = 400,
  showScaleControls = true,
}: MarketChartProps) {
  const [zoom, setZoom] = useState(1);

  const closes = data.map((d) => d.close);
  const sma20 = sma(closes, 5);
  const ema12 = ema(closes, 4);
  const rsi14 = rsi(closes, 5);
  const { macd: macdLine, signal: macdSignal, histogram: macdHist } = macd(
    closes,
    4,
    6,
    3
  );
  const { middle: bbMid, upper: bbUpper, lower: bbLower } = bollingerBands(
    closes,
    5,
    2
  );

  const chartData: ChartRow[] = data.map((d, i) => ({
    ...d,
    index: i,
    sma: sma20[i],
    ema: ema12[i],
    rsi: rsi14[i],
    macd: macdLine[i],
    signal: macdSignal[i],
    histogram: macdHist[i],
    bbMid: bbMid[i],
    bbUpper: bbUpper[i],
    bbLower: bbLower[i],
  }));

  const extras: Array<number | null | undefined> = [];
  if (showSMA) extras.push(...sma20);
  if (showEMA) extras.push(...ema12);
  if (showBollinger) extras.push(...bbMid, ...bbUpper, ...bbLower);
  const { min: priceMin, max: priceMax } = ohlcPriceExtent(data, extras);
  const priceDomain = paddedPriceDomain(priceMin, priceMax, zoom);

  const nudgeZoom = (delta: number) => {
    setZoom((z) =>
      Math.min(
        ZOOM_MAX,
        Math.max(ZOOM_MIN, Math.round((z + delta) / ZOOM_STEP) * ZOOM_STEP)
      )
    );
  };

  const axisDigits =
    priceDomain[1] - priceDomain[0] < 2
      ? 2
      : priceDomain[1] - priceDomain[0] < 20
        ? 1
        : 0;

  const priceLegend: Array<{ color: string; label: string; dashed?: boolean }> =
    [];
  if (showSMA) priceLegend.push({ color: "#fbbf24", label: "SMA(5)" });
  if (showEMA)
    priceLegend.push({ color: "#f59e0b", label: "EMA(4)", dashed: true });
  if (showBollinger) {
    priceLegend.push({ color: "#94a3b8", label: "BB Mid" });
    priceLegend.push({
      color: "#64748b",
      label: "BB Upper/Lower",
      dashed: true,
    });
  }

  const sharedXAxis = (showTicks: boolean) => (
    <XAxis
      dataKey="index"
      type="number"
      domain={[0, Math.max(0, chartData.length - 1)]}
      tickCount={chartData.length}
      tickFormatter={
        showTicks ? (_, i) => chartData[i]?.name ?? "" : () => ""
      }
      stroke="rgba(56,255,20,0.5)"
      tick={{ fill: "rgba(56,255,20,0.7)", fontSize: 10 }}
      tickLine={{ stroke: "rgba(56,255,20,0.3)" }}
      height={showTicks ? 28 : 8}
    />
  );

  return (
    <div className="space-y-2">
      {showScaleControls ? (
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-primary/80">
          <span className="uppercase tracking-wider text-primary/50">Y scale</span>
          <button
            type="button"
            aria-label="Zoom out vertical scale"
            className="rounded border border-primary/40 px-2 py-0.5 hover:bg-primary/10 disabled:opacity-40"
            disabled={zoom <= ZOOM_MIN}
            onClick={() => nudgeZoom(-ZOOM_STEP)}
          >
            −
          </button>
          <input
            type="range"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={ZOOM_STEP}
            value={zoom}
            aria-label="Vertical zoom"
            className="w-24 accent-primary"
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <button
            type="button"
            aria-label="Zoom in vertical scale"
            className="rounded border border-primary/40 px-2 py-0.5 hover:bg-primary/10 disabled:opacity-40"
            disabled={zoom >= ZOOM_MAX}
            onClick={() => nudgeZoom(ZOOM_STEP)}
          >
            +
          </button>
          <button
            type="button"
            className="rounded border border-primary/40 px-2 py-0.5 hover:bg-primary/10"
            onClick={() => setZoom(1)}
          >
            Fit
          </button>
          <span className="text-primary/45">{zoom.toFixed(2)}×</span>
        </div>
      ) : null}

      {/* Price pane — overlays that share price scale live here */}
      <div>
        {priceLegend.length > 0 ? <PaneLegend items={priceLegend} /> : null}
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,255,20,0.1)" />
            {sharedXAxis(!showRSI && !showMACD)}
            <YAxis
              yAxisId="price"
              domain={priceDomain}
              allowDataOverflow
              stroke="rgba(56,255,20,0.5)"
              tick={{ fill: "rgba(56,255,20,0.7)", fontSize: 10 }}
              tickLine={{ stroke: "rgba(56,255,20,0.3)" }}
              width={56}
              tickFormatter={(v) =>
                Number(v).toLocaleString(undefined, {
                  maximumFractionDigits: axisDigits,
                })
              }
            />
            <Tooltip content={<PriceTooltip />} />
            {chartData.map((entry, i) => {
              const bodyLow = Math.min(entry.open, entry.close);
              const bodyHigh = Math.max(entry.open, entry.close);
              const span = priceDomain[1] - priceDomain[0];
              const minBody = span * 0.008;
              const paddedHigh =
                bodyHigh - bodyLow < minBody
                  ? (bodyLow + bodyHigh) / 2 + minBody / 2
                  : bodyHigh;
              const paddedLow =
                bodyHigh - bodyLow < minBody
                  ? (bodyLow + bodyHigh) / 2 - minBody / 2
                  : bodyLow;
              const color = entry.close >= entry.open ? BULLISH : BEARISH;
              return (
                <g key={entry.name}>
                  <ReferenceArea
                    x1={i - 0.4}
                    x2={i + 0.4}
                    y1={paddedLow}
                    y2={paddedHigh}
                    yAxisId="price"
                    {...({
                      fill: color,
                      fillOpacity: 0.95,
                      stroke: color,
                      strokeWidth: 1,
                    } as Record<string, string | number>)}
                  />
                  <ReferenceLine
                    yAxisId="price"
                    segment={[
                      { x: i, y: entry.low },
                      { x: i, y: entry.high },
                    ]}
                    stroke={color}
                    strokeWidth={2.5}
                    strokeOpacity={1}
                  />
                </g>
              );
            })}
            {showSMA && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                connectNulls
                name="SMA(5)"
                legendType="none"
              />
            )}
            {showEMA && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="ema"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
                name="EMA(4)"
                legendType="none"
              />
            )}
            {showBollinger && (
              <>
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="bbMid"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls
                  name="BB Mid"
                  legendType="none"
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="bbUpper"
                  stroke="#64748b"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                  connectNulls
                  name="BB Upper"
                  legendType="none"
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="bbLower"
                  stroke="#64748b"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                  connectNulls
                  name="BB Lower"
                  legendType="none"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* RSI pane — separate oscillator (TradingView-style) */}
      {showRSI ? (
        <div className="border-t border-primary/20 pt-2">
          <PaneLegend items={[{ color: RSI_COLOR, label: "RSI(5)" }]} />
          <ResponsiveContainer width="100%" height={OSC_PANEL_H}>
            <ComposedChart
              data={chartData}
              margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(56,255,20,0.08)"
              />
              {sharedXAxis(!showMACD)}
              <YAxis
                domain={[0, 100]}
                ticks={[30, 50, 70]}
                stroke="rgba(56,255,20,0.4)"
                tick={{ fill: "rgba(56,255,20,0.6)", fontSize: 9 }}
                width={56}
              />
              <ReferenceLine
                y={70}
                stroke="rgba(248,113,113,0.45)"
                strokeDasharray="4 4"
              />
              <ReferenceLine
                y={30}
                stroke="rgba(56,255,20,0.35)"
                strokeDasharray="4 4"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1810",
                  border: "1px solid rgba(56,255,20,0.5)",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
                formatter={(v) => [
                  typeof v === "number" ? v.toFixed(1) : v,
                  "RSI",
                ]}
                labelFormatter={(_, payload) =>
                  (payload?.[0]?.payload as ChartRow | undefined)?.name ?? ""
                }
              />
              <Line
                type="monotone"
                dataKey="rsi"
                stroke={RSI_COLOR}
                strokeWidth={1.5}
                dot={false}
                connectNulls
                name="RSI(5)"
                legendType="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {/* MACD pane — histogram + MACD + signal */}
      {showMACD ? (
        <div className="border-t border-primary/20 pt-2">
          <PaneLegend
            items={[
              { color: MACD_COLOR, label: "MACD" },
              { color: SIGNAL_COLOR, label: "Signal", dashed: true },
              { color: "rgba(56,255,20,0.7)", label: "Hist" },
            ]}
          />
          <ResponsiveContainer width="100%" height={OSC_PANEL_H}>
            <ComposedChart
              data={chartData}
              margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(56,255,20,0.08)"
              />
              {sharedXAxis(true)}
              <YAxis
                domain={["auto", "auto"]}
                stroke="rgba(56,255,20,0.4)"
                tick={{ fill: "rgba(56,255,20,0.6)", fontSize: 9 }}
                width={56}
                tickFormatter={(v) => Number(v).toFixed(0)}
              />
              <ReferenceLine y={0} stroke="rgba(56,255,20,0.25)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1810",
                  border: "1px solid rgba(56,255,20,0.5)",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
                labelFormatter={(_, payload) =>
                  (payload?.[0]?.payload as ChartRow | undefined)?.name ?? ""
                }
              />
              <Bar dataKey="histogram" name="Hist" legendType="none">
                {chartData.map((entry, i) => (
                  <Cell
                    key={`hist-${i}`}
                    fill={
                      (entry.histogram ?? 0) >= 0
                        ? "rgba(56,255,20,0.55)"
                        : "rgba(255,56,20,0.55)"
                    }
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="macd"
                stroke={MACD_COLOR}
                strokeWidth={1.5}
                dot={false}
                connectNulls
                name="MACD"
                legendType="none"
              />
              <Line
                type="monotone"
                dataKey="signal"
                stroke={SIGNAL_COLOR}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
                name="Signal"
                legendType="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  );
}

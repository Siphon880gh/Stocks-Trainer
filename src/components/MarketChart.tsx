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
import { CHART, chartPaneClass } from "../lib/chartTheme";
import { cn } from "../lib/utils";

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
  /** Optional feed/status chip in the scale toolbar (Market page). */
  statusLabel?: string;
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;
const OSC_PANEL_H = 120;

const scaleBtn =
  "rounded border border-[#d1d4dc] bg-white px-2 py-0.5 text-[#131722] hover:bg-[#f0f3fa] disabled:opacity-40";

const axisTick = { fill: CHART.textMuted, fontSize: 10, fontFamily: CHART.font };

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
  const up = d.close >= d.open;
  return (
    <div
      className="text-[12px] space-y-0.5 bg-white border border-[#d1d4dc] rounded shadow-md px-3 py-2 min-w-[128px]"
      style={{ fontFamily: CHART.font, color: CHART.text }}
    >
      <p className="font-semibold border-b border-[#e0e3eb] pb-1 mb-1.5">{d.name}</p>
      <div className="tabular-nums space-y-0.5">
        <p>
          <span className="text-[#787b86] w-4 inline-block">O</span> {fmt(d.open)}
        </p>
        <p>
          <span className="text-[#787b86] w-4 inline-block">H</span> {fmt(d.high)}
        </p>
        <p>
          <span className="text-[#787b86] w-4 inline-block">L</span> {fmt(d.low)}
        </p>
        <p>
          <span className="text-[#787b86] w-4 inline-block">C</span>{" "}
          <span style={{ color: up ? CHART.up : CHART.down }}>{fmt(d.close)}</span>
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
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-1 text-[11px]"
      style={{ fontFamily: CHART.font, color: CHART.textMuted }}
    >
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
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
  statusLabel,
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
  if (showSMA) priceLegend.push({ color: CHART.sma, label: "SMA(5)" });
  if (showEMA)
    priceLegend.push({ color: CHART.ema, label: "EMA(4)", dashed: true });
  if (showBollinger) {
    priceLegend.push({ color: CHART.bb, label: "BB Mid" });
    priceLegend.push({
      color: CHART.bb,
      label: "BB Upper/Lower",
      dashed: true,
    });
  }

  const oscTooltip = {
    backgroundColor: CHART.tooltipBg,
    border: `1px solid ${CHART.tooltipBorder}`,
    color: CHART.text,
    fontFamily: CHART.font,
    fontSize: 12,
  };

  const sharedXAxis = (showTicks: boolean) => (
    <XAxis
      dataKey="index"
      type="number"
      domain={[0, Math.max(0, chartData.length - 1)]}
      tickCount={chartData.length}
      tickFormatter={
        showTicks ? (_, i) => chartData[i]?.name ?? "" : () => ""
      }
      stroke={CHART.grid}
      tick={axisTick}
      tickLine={{ stroke: CHART.grid }}
      axisLine={{ stroke: CHART.border }}
      height={showTicks ? 28 : 8}
    />
  );

  return (
    <div className={cn(chartPaneClass, "space-y-0")} style={{ fontFamily: CHART.font }}>
      {showScaleControls ? (
        <div
          className="flex flex-wrap items-center gap-2 px-2 py-1.5 text-[11px] border-b border-[#e0e3eb] bg-[#f8f9fd]"
          style={{ color: CHART.textMuted }}
        >
          <span>Scale</span>
          <button
            type="button"
            aria-label="Zoom out vertical scale"
            className={scaleBtn}
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
            className="w-24"
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <button
            type="button"
            aria-label="Zoom in vertical scale"
            className={scaleBtn}
            disabled={zoom >= ZOOM_MAX}
            onClick={() => nudgeZoom(ZOOM_STEP)}
          >
            +
          </button>
          <button type="button" className={scaleBtn} onClick={() => setZoom(1)}>
            Fit
          </button>
          <span>{zoom.toFixed(2)}×</span>
          {statusLabel ? (
            <span className="ml-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-[#d1d4dc] bg-white text-[#131722] normal-case">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
              {statusLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      <div>
        {priceLegend.length > 0 ? <PaneLegend items={priceLegend} /> : null}
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
          >
            <CartesianGrid
              stroke={CHART.grid}
              vertical={false}
            />
            {sharedXAxis(!showRSI && !showMACD)}
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={priceDomain}
              allowDataOverflow
              stroke={CHART.grid}
              tick={axisTick}
              tickLine={{ stroke: CHART.grid }}
              axisLine={{ stroke: CHART.border }}
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
              const minBody = span * 0.004;
              const paddedHigh =
                bodyHigh - bodyLow < minBody
                  ? (bodyLow + bodyHigh) / 2 + minBody / 2
                  : bodyHigh;
              const paddedLow =
                bodyHigh - bodyLow < minBody
                  ? (bodyLow + bodyHigh) / 2 - minBody / 2
                  : bodyLow;
              const color = entry.close >= entry.open ? CHART.up : CHART.down;
              return (
                <g key={entry.name}>
                  <ReferenceLine
                    yAxisId="price"
                    segment={[
                      { x: i, y: entry.low },
                      { x: i, y: entry.high },
                    ]}
                    stroke={color}
                    strokeWidth={1.25}
                    strokeOpacity={1}
                  />
                  <ReferenceArea
                    x1={i - 0.32}
                    x2={i + 0.32}
                    y1={paddedLow}
                    y2={paddedHigh}
                    yAxisId="price"
                    {...({
                      fill: color,
                      fillOpacity: 1,
                      stroke: color,
                      strokeWidth: 0.5,
                    } as Record<string, string | number>)}
                  />
                </g>
              );
            })}
            {showSMA && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma"
                stroke={CHART.sma}
                strokeWidth={1.5}
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
                stroke={CHART.ema}
                strokeWidth={1.5}
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
                  stroke={CHART.bb}
                  strokeWidth={1.25}
                  dot={false}
                  connectNulls
                  name="BB Mid"
                  legendType="none"
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="bbUpper"
                  stroke={CHART.bb}
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
                  stroke={CHART.bb}
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

      {showRSI ? (
        <div className="border-t border-[#e0e3eb]">
          <PaneLegend items={[{ color: CHART.rsi, label: "RSI(5)" }]} />
          <ResponsiveContainer width="100%" height={OSC_PANEL_H}>
            <ComposedChart
              data={chartData}
              margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
            >
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              {sharedXAxis(!showMACD)}
              <YAxis
                orientation="right"
                domain={[0, 100]}
                ticks={[30, 50, 70]}
                stroke={CHART.grid}
                tick={{ ...axisTick, fontSize: 9 }}
                width={56}
                axisLine={{ stroke: CHART.border }}
              />
              <ReferenceLine
                y={70}
                stroke={CHART.overbought}
                strokeOpacity={0.45}
                strokeDasharray="4 4"
              />
              <ReferenceLine
                y={30}
                stroke={CHART.oversold}
                strokeOpacity={0.45}
                strokeDasharray="4 4"
              />
              <Tooltip
                contentStyle={oscTooltip}
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
                stroke={CHART.rsi}
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

      {showMACD ? (
        <div className="border-t border-[#e0e3eb]">
          <PaneLegend
            items={[
              { color: CHART.macd, label: "MACD" },
              { color: CHART.signal, label: "Signal", dashed: true },
              { color: CHART.up, label: "Hist" },
            ]}
          />
          <ResponsiveContainer width="100%" height={OSC_PANEL_H}>
            <ComposedChart
              data={chartData}
              margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
            >
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              {sharedXAxis(true)}
              <YAxis
                orientation="right"
                domain={["auto", "auto"]}
                stroke={CHART.grid}
                tick={{ ...axisTick, fontSize: 9 }}
                width={56}
                tickFormatter={(v) => Number(v).toFixed(0)}
                axisLine={{ stroke: CHART.border }}
              />
              <ReferenceLine y={0} stroke={CHART.border} />
              <Tooltip
                contentStyle={oscTooltip}
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
                        ? `${CHART.up}99`
                        : `${CHART.down}99`
                    }
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="macd"
                stroke={CHART.macd}
                strokeWidth={1.5}
                dot={false}
                connectNulls
                name="MACD"
                legendType="none"
              />
              <Line
                type="monotone"
                dataKey="signal"
                stroke={CHART.signal}
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

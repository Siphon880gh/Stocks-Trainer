import { useState, useRef, type MouseEvent } from "react";
import {
  ohlcPriceExtent,
  paddedPriceDomain,
  type OHLC,
} from "../lib/ohlcData";

interface CandlestickChartProps {
  data: OHLC[];
  height?: number;
  highlightIndex?: number;
  /** Tighter padding / no axis labels — for quiz chart-pick thumbnails. */
  compact?: boolean;
  /** Show zoom in/out controls (ignored when compact). */
  showScaleControls?: boolean;
}

const BULLISH = "#38ff14";
const BEARISH = "#ff3814";

const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 0 });

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

export default function CandlestickChart({
  data,
  height = 300,
  highlightIndex,
  compact = false,
  showScaleControls = true,
}: CandlestickChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const padding = compact
    ? { top: 8, right: 8, bottom: 20, left: 8 }
    : { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = compact ? 160 : 400;
  const chartHeight = height - padding.top - padding.bottom;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight;

  const { min: dataMin, max: dataMax } = ohlcPriceExtent(data);
  const [yMin, yMax] = paddedPriceDomain(dataMin, dataMax, zoom);
  const yRange = yMax - yMin;

  const candleCount = data.length;
  const gap = 4;
  const candleWidth = Math.max(8, (innerWidth - gap * (candleCount - 1)) / candleCount);
  const step = candleWidth + gap;

  const y = (value: number) =>
    padding.top + innerHeight - ((value - yMin) / yRange) * innerHeight;
  const x = (i: number) => padding.left + i * step + step / 2;

  const handleMouseMove = (e: MouseEvent, i: number) => {
    setHoveredIndex(i);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const nudgeZoom = (delta: number) => {
    setZoom((z) =>
      Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + delta) / ZOOM_STEP) * ZOOM_STEP))
    );
  };

  const axisDigits =
    yRange < 2 ? 2 : yRange < 20 ? 1 : 0;

  return (
    <div ref={containerRef} className="relative">
      {!compact && showScaleControls ? (
        <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-[10px] text-primary/80">
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
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute z-20 px-4 py-3 font-mono text-sm bg-neutral-dark border-2 border-primary rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8),0_0_10px_rgba(56,255,20,0.2)] pointer-events-none min-w-[140px]"
          style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 12 }}
        >
          <p className="text-primary font-bold border-b border-primary/40 pb-1.5 mb-2">{data[hoveredIndex].name}</p>
          <div className="space-y-1 text-slate-100">
            <p><span className="text-primary/80 w-4 inline-block">O</span> {fmt(data[hoveredIndex].open)}</p>
            <p><span className="text-primary/80 w-4 inline-block">H</span> {fmt(data[hoveredIndex].high)}</p>
            <p><span className="text-primary/80 w-4 inline-block">L</span> {fmt(data[hoveredIndex].low)}</p>
            <p><span className="text-primary/80 w-4 inline-block">C</span> {fmt(data[hoveredIndex].close)}</p>
          </div>
        </div>
      )}
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${chartWidth} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="bullish" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BULLISH} stopOpacity={1} />
          <stop offset="1" stopColor={BULLISH} stopOpacity={0.6} />
        </linearGradient>
        <linearGradient id="bearish" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BEARISH} stopOpacity={0.6} />
          <stop offset="1" stopColor={BEARISH} stopOpacity={1} />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`h${i}`}
          x1={padding.left}
          y1={padding.top + (innerHeight * i) / 4}
          x2={padding.left + innerWidth}
          y2={padding.top + (innerHeight * i) / 4}
          stroke="rgba(56,255,20,0.1)"
          strokeDasharray="3 3"
          strokeWidth={1}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={`v${i}`}
          x1={padding.left + (innerWidth * i) / 5}
          y1={padding.top}
          x2={padding.left + (innerWidth * i) / 5}
          y2={padding.top + innerHeight}
          stroke="rgba(56,255,20,0.1)"
          strokeDasharray="3 3"
          strokeWidth={1}
        />
      ))}

      {/* Y-axis labels */}
      {!compact &&
        [0, 0.25, 0.5, 0.75, 1].map((t) => {
          const val = yMin + (1 - t) * yRange;
          return (
            <text
              key={t}
              x={padding.left - 8}
              y={padding.top + t * innerHeight}
              fill="rgba(56,255,20,0.7)"
              fontSize={10}
              fontFamily="monospace"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {val.toLocaleString(undefined, { maximumFractionDigits: axisDigits })}
            </text>
          );
        })}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={d.name}
          x={x(i)}
          y={height - (compact ? 4 : 8)}
          fill="rgba(56,255,20,0.7)"
          fontSize={compact ? 8 : 10}
          fontFamily="monospace"
          textAnchor="middle"
        >
          {compact ? String(i + 1) : d.name}
        </text>
      ))}

      {/* Candlesticks */}
      {data.map((entry, i) => {
        const cx = x(i);
        const isUp = entry.close >= entry.open;
        const color = isUp ? BULLISH : BEARISH;
        // SVG y grows downward: higher price → smaller y
        const bodyHighY = y(Math.max(entry.open, entry.close));
        const bodyLowY = y(Math.min(entry.open, entry.close));
        const minBody = compact ? 4 : 6;
        let bodyY = bodyHighY;
        let bodyHeight = bodyLowY - bodyHighY;
        if (bodyHeight < minBody) {
          const mid = (bodyHighY + bodyLowY) / 2;
          bodyY = mid - minBody / 2;
          bodyHeight = minBody;
        }
        const lowY = y(entry.low);
        const highY = y(entry.high);
        const halfWidth = candleWidth / 2;
        const bodyWidth = Math.max(6, candleWidth - 4);

        return (
          <g
            key={entry.name}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Invisible hit area for easier hover */}
            <rect
              x={cx - halfWidth - 4}
              y={highY - 4}
              width={candleWidth + 8}
              height={lowY - highY + 8}
              fill="transparent"
            />
            {highlightIndex === i && (
              <rect
                x={cx - halfWidth - 4}
                y={highY - 4}
                width={candleWidth + 8}
                height={lowY - highY + 8}
                fill="none"
                stroke={BULLISH}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            )}
            {/* Wick first; body drawn on top so the bar reads as a thick candle */}
            <line
              x1={cx}
              y1={highY}
              x2={cx}
              y2={lowY}
              stroke={color}
              strokeWidth={2}
              strokeOpacity={1}
              strokeLinecap="round"
            />
            <rect
              x={cx - bodyWidth / 2}
              y={bodyY}
              width={bodyWidth}
              height={bodyHeight}
              fill={color}
              stroke={color}
              strokeWidth={1}
            />
          </g>
        );
      })}
    </svg>
    </div>
  );
}

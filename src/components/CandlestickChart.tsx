import { useState, useRef, type MouseEvent } from "react";
import {
  ohlcPriceExtent,
  paddedPriceDomain,
  chartVerticalScale,
  type OHLC,
} from "../lib/ohlcData";
import { CHART, chartPaneClass } from "../lib/chartTheme";
import { cn } from "../lib/utils";
import {
  annotationPrices,
  trendlinePriceAt,
  type AnnotationTone,
  type ChartAnnotations,
} from "../lib/chartAnnotations";

interface PriceMarker {
  price: number;
  label: string;
}

interface CandlestickChartProps {
  data: OHLC[];
  height?: number;
  highlightIndex?: number;
  /** Tighter padding / no axis labels — for quiz chart-pick thumbnails. */
  compact?: boolean;
  /** Show zoom in/out controls (ignored when compact). */
  showScaleControls?: boolean;
  onSelectBar?: (index: number) => void;
  onSelectPrice?: (price: number) => void;
  markers?: PriceMarker[];
  /** Levels, trendlines, zones, and labeled points drawn over the candles. */
  annotations?: ChartAnnotations;
  /** Empty bar slots reserved on the right (room for zones / risk-reward boxes). */
  padRightBars?: number;
}

const TONE_COLOR: Record<AnnotationTone, string> = {
  neutral: CHART.textMuted,
  supply: CHART.down,
  demand: CHART.up,
  risk: CHART.down,
  reward: CHART.up,
  entry: CHART.highlight,
};

const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 0 });

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

const scaleBtn =
  "rounded border border-[#d1d4dc] bg-white px-2 py-0.5 text-[#131722] hover:bg-[#f0f3fa] disabled:opacity-40";

export default function CandlestickChart({
  data,
  height = 300,
  highlightIndex,
  compact = false,
  showScaleControls = true,
  onSelectBar,
  onSelectPrice,
  markers,
  annotations,
  padRightBars = 0,
}: CandlestickChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const padding = compact
    ? { top: 8, right: 8, bottom: 18, left: 8 }
    : { top: 12, right: 52, bottom: 24, left: 8 };
  const slotCount = data.length + padRightBars;
  /** Long scenario charts (dozens of bars) get a wider canvas and thinner candles. */
  const dense = slotCount > 24;
  const chartWidth = compact ? 160 : dense ? 720 : 400;
  const innerWidth = chartWidth - padding.left - padding.right;

  const { min: dataMin, max: dataMax } = ohlcPriceExtent(data, annotationPrices(annotations));
  const { paneHeight, domainZoom } = chartVerticalScale(height, zoom);
  const [yMin, yMax] = paddedPriceDomain(dataMin, dataMax, domainZoom);
  const yRange = yMax - yMin;
  const innerHeight = paneHeight - padding.top - padding.bottom;

  const candleCount = slotCount;
  const gap = compact || dense ? 1.5 : 2;
  const candleWidth = Math.max(dense ? 2 : compact ? 4 : 6, (innerWidth - gap * (candleCount - 1)) / candleCount);
  const labelEvery = Math.max(1, Math.ceil(data.length / 12));
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

  const axisDigits = yRange < 2 ? 2 : yRange < 20 ? 1 : 0;

  const priceFromSvgY = (svgY: number) =>
    yMin + (1 - (svgY - padding.top) / innerHeight) * yRange;

  const clientToSvg = (svg: SVGSVGElement, clientX: number, clientY: number) => {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  };

  const selectable = Boolean(onSelectBar || onSelectPrice);

  return (
    <div ref={containerRef} className={cn(chartPaneClass, "relative")}>
      {!compact && showScaleControls ? (
        <div
          className="flex flex-wrap items-center gap-2 px-2 py-1.5 text-[11px] border-b border-[#e0e3eb] bg-[#f8f9fd]"
          style={{ fontFamily: CHART.font, color: CHART.textMuted }}
        >
          <span>Scale</span>
          <button type="button" aria-label="Zoom out vertical scale" className={scaleBtn} disabled={zoom <= ZOOM_MIN} onClick={() => nudgeZoom(-ZOOM_STEP)}>
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
          <button type="button" aria-label="Zoom in vertical scale" className={scaleBtn} disabled={zoom >= ZOOM_MAX} onClick={() => nudgeZoom(ZOOM_STEP)}>
            +
          </button>
          <button type="button" className={scaleBtn} onClick={() => setZoom(1)}>
            Fit
          </button>
          <span>{zoom.toFixed(2)}×</span>
        </div>
      ) : null}
      {hoveredIndex !== null && data[hoveredIndex] && !compact ? (
        <div
          className="absolute z-20 px-3 py-2 text-[12px] bg-white border border-[#d1d4dc] rounded shadow-md pointer-events-none min-w-[128px]"
          style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 12, fontFamily: CHART.font, color: CHART.text }}
        >
          <p className="font-semibold border-b border-[#e0e3eb] pb-1 mb-1.5">{data[hoveredIndex].name}</p>
          <div className="space-y-0.5 tabular-nums">
            <p><span className="text-[#787b86] w-4 inline-block">O</span> {fmt(data[hoveredIndex].open)}</p>
            <p><span className="text-[#787b86] w-4 inline-block">H</span> {fmt(data[hoveredIndex].high)}</p>
            <p><span className="text-[#787b86] w-4 inline-block">L</span> {fmt(data[hoveredIndex].low)}</p>
            <p>
              <span className="text-[#787b86] w-4 inline-block">C</span>{" "}
              <span style={{ color: data[hoveredIndex].close >= data[hoveredIndex].open ? CHART.up : CHART.down }}>
                {fmt(data[hoveredIndex].close)}
              </span>
            </p>
          </div>
        </div>
      ) : null}
      <svg
        width="100%"
        height={paneHeight}
        viewBox={`0 0 ${chartWidth} ${paneHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ background: CHART.bg, cursor: onSelectPrice ? "crosshair" : undefined }}
        onClick={(e) => {
          if (!onSelectPrice) return;
          const loc = clientToSvg(e.currentTarget, e.clientX, e.clientY);
          if (!loc) return;
          if (loc.y < padding.top || loc.y > padding.top + innerHeight) return;
          onSelectPrice(priceFromSvgY(loc.y));
        }}
      >
        {/* Horizontal grid only — typical tape layout */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h${i}`}
            x1={padding.left}
            y1={padding.top + (innerHeight * i) / 4}
            x2={padding.left + innerWidth}
            y2={padding.top + (innerHeight * i) / 4}
            stroke={CHART.grid}
            strokeWidth={1}
          />
        ))}

        {!compact &&
          [0, 0.25, 0.5, 0.75, 1].map((t) => {
            const val = yMin + (1 - t) * yRange;
            return (
              <text
                key={t}
                x={chartWidth - padding.right + 6}
                y={padding.top + t * innerHeight}
                fill={CHART.textMuted}
                fontSize={10}
                fontFamily={CHART.font}
                textAnchor="start"
                dominantBaseline="middle"
              >
                {val.toLocaleString(undefined, { maximumFractionDigits: axisDigits })}
              </text>
            );
          })}

        {data.map((d, i) => (i % labelEvery !== 0 ? null :
          <text
            key={d.name}
            x={x(i)}
            y={height - (compact ? 4 : 6)}
            fill={CHART.textMuted}
            fontSize={compact ? 8 : 10}
            fontFamily={CHART.font}
            textAnchor="middle"
          >
            {compact ? String(i + 1) : d.name}
          </text>
        ))}

        {(annotations?.zones ?? []).map((z, zi) => {
          const color = TONE_COLOR[z.tone];
          const x1 = x(z.fromIndex) - step / 2;
          const x2 = x(z.toIndex ?? candleCount - 1) + step / 2;
          const top = y(Math.max(z.top, z.bottom));
          const bottom = y(Math.min(z.top, z.bottom));
          return (
            <g key={`zone-${zi}`}>
              <rect x={x1} y={top} width={Math.max(1, x2 - x1)} height={Math.max(1, bottom - top)} fill={color} fillOpacity={0.14} stroke={color} strokeOpacity={0.5} strokeWidth={0.75} />
              <text
                x={x2 - 3}
                y={z.labelAt === "bottom" ? bottom - 4 : top + 10}
                fill={color}
                fontSize={9}
                fontFamily={CHART.font}
                textAnchor="end"
                stroke={CHART.bg}
                strokeWidth={3}
                paintOrder="stroke"
              >
                {z.label}
              </text>
            </g>
          );
        })}

        {(markers ?? []).map((m) => {
          const my = y(m.price);
          return (
            <g key={`${m.label}-${m.price}`}>
              <line
                x1={padding.left}
                y1={my}
                x2={padding.left + innerWidth}
                y2={my}
                stroke={CHART.textMuted}
                strokeDasharray="4 3"
                strokeWidth={1}
              />
              <text
                x={padding.left + 4}
                y={my - 3}
                fill={CHART.text}
                fontSize={10}
                fontFamily={CHART.font}
              >
                {m.label} {fmt(m.price)}
              </text>
            </g>
          );
        })}

        {data.map((entry, i) => {
          const cx = x(i);
          const isUp = entry.close >= entry.open;
          const color = isUp ? CHART.up : CHART.down;
          const bodyHighY = y(Math.max(entry.open, entry.close));
          const bodyLowY = y(Math.min(entry.open, entry.close));
          const minBody = 1;
          let bodyY = bodyHighY;
          let bodyHeight = Math.max(minBody, bodyLowY - bodyHighY);
          const lowY = y(entry.low);
          const highY = y(entry.high);
          const halfWidth = candleWidth / 2;
          const bodyWidth = Math.max(dense ? 1.5 : compact ? 3 : 5, candleWidth - 1);
          const wickW = candleWidth < 6 ? 1 : 1.25;

          return (
            <g
              key={entry.name}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                if (!onSelectBar) return;
                e.stopPropagation();
                onSelectBar(i);
              }}
              style={{
                cursor: selectable ? "pointer" : compact ? "default" : "crosshair",
              }}
            >
              <rect
                x={cx - halfWidth - 2}
                y={highY - 2}
                width={candleWidth + 4}
                height={lowY - highY + 4}
                fill="transparent"
              />
              {highlightIndex === i && (
                <rect
                  x={cx - halfWidth - 3}
                  y={padding.top}
                  width={candleWidth + 6}
                  height={innerHeight}
                  fill={CHART.highlight}
                  fillOpacity={0.08}
                />
              )}
              <line
                x1={cx}
                y1={highY}
                x2={cx}
                y2={lowY}
                stroke={color}
                strokeWidth={wickW}
                strokeLinecap="butt"
              />
              <rect
                x={cx - bodyWidth / 2}
                y={bodyY}
                width={bodyWidth}
                height={bodyHeight}
                fill={color}
                stroke={color}
                strokeWidth={0.5}
              />
            </g>
          );
        })}

        {(annotations?.levels ?? []).map((l, li) => {
          const ly = y(l.price);
          const color = TONE_COLOR[l.tone ?? "neutral"];
          return (
            <g key={`level-${li}`}>
              <line x1={padding.left} y1={ly} x2={padding.left + innerWidth} y2={ly} stroke={color} strokeDasharray="5 3" strokeWidth={1} />
              <text x={padding.left + 3} y={ly - 3} fill={color} fontSize={9} fontFamily={CHART.font} stroke={CHART.bg} strokeWidth={3} paintOrder="stroke">
                {l.label}
              </text>
            </g>
          );
        })}

        {(annotations?.trendlines ?? []).map((t, ti) => {
          const color = TONE_COLOR[t.tone ?? "neutral"];
          const endIndex = t.extend ? candleCount - 1 : t.to.index;
          const endPrice = t.extend ? trendlinePriceAt(t, endIndex) : t.to.price;
          return (
            <g key={`trend-${ti}`}>
              <line x1={x(t.from.index)} y1={y(t.from.price)} x2={x(endIndex)} y2={y(endPrice)} stroke={color} strokeWidth={1.25} />
              {t.label ? (
                <text x={x(t.to.index) + 4} y={y(t.to.price) + 12} fill={color} fontSize={9} fontFamily={CHART.font} stroke={CHART.bg} strokeWidth={3} paintOrder="stroke">
                  {t.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {(annotations?.points ?? []).map((p, pi) => {
          const color = TONE_COLOR[p.tone ?? "neutral"];
          const py = y(p.price);
          return (
            <g key={`point-${pi}`}>
              <circle cx={x(p.index)} cy={py} r={5} fill="none" stroke={color} strokeWidth={1.5} />
              <text x={x(p.index)} y={py - 8} fill={color} fontSize={9} fontFamily={CHART.font} textAnchor="middle" stroke={CHART.bg} strokeWidth={3} paintOrder="stroke">
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

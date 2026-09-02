import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  formatBarFrequency,
  ohlcPriceExtent,
  paddedPriceDomain,
  type OHLC,
} from "../lib/ohlcData";
import { sma, ema, rsi, macd, bollingerBands } from "../lib/indicators";
import {
  explainChartProgression,
  type ChartProgressionNote,
} from "../lib/patternScan";
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
  frequencies?: Array<{ minutes: number; label: string; enabled: boolean }>;
  frequencyMinutes?: number | null;
  nativeMinutes?: number | null;
  onFrequencyMinutes?: (minutes: number) => void;
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
  explainY: number | null;
};

function neighborNote(
  notes: ChartProgressionNote[],
  index: number,
  dir: -1 | 1,
): ChartProgressionNote | null {
  if (dir < 0) {
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      if (n && n.index < index) return n;
    }
    return null;
  }
  for (const n of notes) {
    if (n.index > index) return n;
  }
  return null;
}

function svgPointToViewport(
  svg: SVGSVGElement,
  x: number,
  y: number,
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const ctm = svg.getScreenCTM();
  if (!ctm) {
    const r = svg.getBoundingClientRect();
    return { x: r.left + x, y: r.top + y };
  }
  const p = pt.matrixTransform(ctm);
  return { x: p.x, y: p.y };
}

const chevronBtn =
  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#d1d4dc] bg-white text-[#131722] hover:bg-[#f0f3fa] disabled:border-[#ececef] disabled:bg-[#f8f9fd] disabled:text-[#c5c7ce] disabled:hover:bg-[#f8f9fd]";

function ExplanationPopover({
  note,
  anchor,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
}: {
  note: ChartProgressionNote;
  anchor: { x: number; y: number };
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: anchor.x, top: anchor.y });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = anchor.x - rect.width / 2;
    let top = anchor.y - rect.height - 12;
    if (top < 8) top = anchor.y + 16;
    if (left + rect.width > vw - 8) left = vw - rect.width - 8;
    if (left < 8) left = 8;
    if (top + rect.height > vh - 8) top = Math.max(8, vh - rect.height - 8);
    setPos({ left, top });
  }, [anchor.x, anchor.y, note.index, note.headline]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (ref.current?.contains(t)) return;
      if (
        t instanceof Element &&
        (t.closest("[data-explain-dot]") || t.closest("[data-explain-hit]"))
      ) {
        return;
      }
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (hasPrev) onPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (hasNext) onNext();
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={`Bar ${note.step} of ${note.of} explanation`}
      className="fixed z-[200] w-[300px] rounded border border-[#d1d4dc] bg-white shadow-md px-2.5 py-2 text-[12px] leading-relaxed"
      style={{
        left: pos.left,
        top: pos.top,
        fontFamily: CHART.font,
        color: CHART.text,
      }}
    >
      <div className="flex items-center gap-1 mb-1">
        <button
          type="button"
          className={chevronBtn}
          disabled={!hasPrev}
          aria-label="Previous bar explanation"
          onClick={onPrev}
        >
          <span className="material-symbols-outlined text-[18px] leading-none">
            chevron_left
          </span>
        </button>
        <p className="flex-1 min-w-0 text-center text-[10px] uppercase tracking-wide text-[#787b86]">
          Step {note.step} of {note.of} · {note.barName}
        </p>
        <button
          type="button"
          className={chevronBtn}
          disabled={!hasNext}
          aria-label="Next bar explanation"
          onClick={onNext}
        >
          <span className="material-symbols-outlined text-[18px] leading-none">
            chevron_right
          </span>
        </button>
      </div>
      <p className="font-semibold mb-0.5 px-0.5">{note.headline}</p>
      <p className="text-[#787b86] px-0.5">{note.detail}</p>
    </div>,
    document.body,
  );
}

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
  frequencies,
  frequencyMinutes = null,
  nativeMinutes = null,
  onFrequencyMinutes,
}: MarketChartProps) {
  const [zoom, setZoom] = useState(1);
  const [explanationsOn, setExplanationsOn] = useState(false);
  const [hoverExplain, setHoverExplain] = useState<number | null>(null);
  const [pinnedExplain, setPinnedExplain] = useState<number | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dotHits, setDotHits] = useState<
    Array<{ index: number; left: number; top: number }>
  >([]);
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const explainDotsRef = useRef<Array<{ index: number; cx: number; cy: number }>>(
    [],
  );

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

  const notes = useMemo(
    () =>
      explainChartProgression(data, {
        sma: showSMA ? sma20 : undefined,
        ema: showEMA ? ema12 : undefined,
        rsi: showRSI ? rsi14 : undefined,
      }),
    [data, showSMA, showEMA, showRSI, sma20, ema12, rsi14],
  );

  useEffect(() => {
    setHoverExplain(null);
    setPinnedExplain(null);
  }, [data]);

  const activeExplain = explanationsOn
    ? (pinnedExplain ?? hoverExplain)
    : null;
  const pinnedNote =
    explanationsOn && pinnedExplain != null
      ? notes.find((n) => n.index === pinnedExplain) ?? null
      : null;
  const prevNote =
    pinnedExplain != null ? neighborNote(notes, pinnedExplain, -1) : null;
  const nextNote =
    pinnedExplain != null ? neighborNote(notes, pinnedExplain, 1) : null;

  const syncPopoverAnchor = useCallback(() => {
    if (pinnedExplain == null) {
      setPopoverAnchor(null);
      return;
    }
    const wrap = chartWrapRef.current;
    const hit = wrap?.querySelector(`[data-explain-hit="${pinnedExplain}"]`);
    if (hit instanceof Element) {
      const r = hit.getBoundingClientRect();
      setPopoverAnchor({ x: r.left + r.width / 2, y: r.top });
      return;
    }
    const svg = wrap?.querySelector("svg.recharts-surface");
    const pt = explainDotsRef.current.find((d) => d.index === pinnedExplain);
    if (svg instanceof SVGSVGElement && pt) {
      setPopoverAnchor(svgPointToViewport(svg, pt.cx, pt.cy));
    }
  }, [pinnedExplain]);

  const syncDotHits = useCallback(() => {
    const wrap = chartWrapRef.current;
    if (!wrap || !explanationsOn) {
      setDotHits([]);
      return;
    }
    const wrapR = wrap.getBoundingClientRect();
    const byIndex = new Map<number, { index: number; left: number; top: number }>();
    wrap.querySelectorAll("[data-explain-dot]").forEach((node) => {
      const i = Number(node.getAttribute("data-explain-dot"));
      if (!Number.isFinite(i)) return;
      const r = node.getBoundingClientRect();
      byIndex.set(i, {
        index: i,
        left: r.left - wrapR.left + r.width / 2,
        top: r.top - wrapR.top + r.height / 2,
      });
    });
    if (byIndex.size === 0) {
      const svg = wrap.querySelector("svg.recharts-surface");
      if (svg instanceof SVGSVGElement) {
        for (const d of explainDotsRef.current) {
          const vp = svgPointToViewport(svg, d.cx, d.cy);
          byIndex.set(d.index, {
            index: d.index,
            left: vp.x - wrapR.left,
            top: vp.y - wrapR.top,
          });
        }
      }
    }
    setDotHits(Array.from(byIndex.values()));
  }, [explanationsOn]);

  useLayoutEffect(() => {
    const wrap = chartWrapRef.current;
    wrap?.querySelectorAll("[data-explain-hit]").forEach((node) => {
      if (!node.closest("[data-explain-hits]")) node.remove();
    });
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      syncDotHits();
      syncPopoverAnchor();
    };
    run();
    const raf = requestAnimationFrame(() => requestAnimationFrame(run));
    const t = window.setTimeout(run, 40);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [
    syncDotHits,
    syncPopoverAnchor,
    zoom,
    data,
    height,
    explanationsOn,
    showSMA,
    showEMA,
    showBollinger,
  ]);

  useEffect(() => {
    if (pinnedExplain == null) return;
    const onWin = () => syncPopoverAnchor();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [pinnedExplain, syncPopoverAnchor]);

  const closeExplain = useCallback(() => {
    setPinnedExplain(null);
    setHoverExplain(null);
  }, []);

  const chartData: ChartRow[] = data.map((d, i) => {
    const smaV = sma20[i];
    const emaV = ema12[i];
    const bbV = bbMid[i];
    let explainY: number | null = null;
    if (explanationsOn) {
      if (showSMA && smaV != null) explainY = smaV;
      else if (showEMA && emaV != null) explainY = emaV;
      else if (showBollinger && bbV != null) explainY = bbV;
      else explainY = d.high;
    }
    return {
      ...d,
      index: i,
      sma: smaV,
      ema: emaV,
      rsi: rsi14[i],
      macd: macdLine[i],
      signal: macdSignal[i],
      histogram: macdHist[i],
      bbMid: bbV,
      bbUpper: bbUpper[i],
      bbLower: bbLower[i],
      explainY,
    };
  });

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
          {frequencies && frequencies.length > 0 ? (
            <div
              className="flex flex-wrap items-center gap-0.5"
              role="group"
              aria-label="Chart frequency"
            >
              {frequencies.map((f) => {
                const active = frequencyMinutes === f.minutes;
                const nativeHint =
                  nativeMinutes != null
                    ? formatBarFrequency(nativeMinutes)
                    : "native";
                return (
                  <button
                    key={f.minutes}
                    type="button"
                    disabled={!f.enabled}
                    aria-pressed={active}
                    title={
                      f.enabled
                        ? f.label
                        : `This SAMPLE series is ${nativeHint} bars — ${f.label} needs a finer feed`
                    }
                    className={`${scaleBtn} ${
                      active
                        ? "border-[#2962ff] bg-[#e8f0ff] text-[#2962ff] hover:bg-[#e8f0ff]"
                        : ""
                    }`}
                    onClick={() => onFrequencyMinutes?.(f.minutes)}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          ) : null}
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
          <button
            type="button"
            className={scaleBtn}
            aria-pressed={explanationsOn}
            onClick={() => {
              setExplanationsOn((on) => {
                if (on) {
                  setHoverExplain(null);
                  setPinnedExplain(null);
                }
                return !on;
              });
            }}
          >
            {explanationsOn ? "Hide explanations" : "Show explanations"}
          </button>
          {statusLabel ? (
            <span className="ml-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-[#d1d4dc] bg-white text-[#131722] normal-case">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
              {statusLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      <div ref={chartWrapRef} className="relative">
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
            <Tooltip
              content={
                explanationsOn && pinnedNote ? () => null : <PriceTooltip />
              }
            />
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
            {explanationsOn ? (
              <Line
                yAxisId="price"
                type="linear"
                dataKey="explainY"
                stroke="none"
                isAnimationActive={false}
                legendType="none"
                tooltipType="none"
                activeDot={false}
                dot={(props) => {
                  const cx = Number(props.cx);
                  const cy = Number(props.cy);
                  const payload = props.payload as ChartRow | undefined;
                  if (
                    !Number.isFinite(cx) ||
                    !Number.isFinite(cy) ||
                    payload?.explainY == null
                  ) {
                    return <g key={String(props.index)} />;
                  }
                  const i = payload.index;
                  const active = activeExplain === i;
                  if (i === 0) explainDotsRef.current = [];
                  explainDotsRef.current.push({ index: i, cx, cy });
                  return (
                    <g key={i}>
                      <circle
                        data-explain-dot={i}
                        cx={cx}
                        cy={cy}
                        r={active ? 7 : 5.5}
                        fill={CHART.highlight}
                        stroke="#ffffff"
                        strokeWidth={2}
                        pointerEvents="none"
                      />
                      <text
                        x={cx}
                        y={cy - 11}
                        textAnchor="middle"
                        fill={CHART.highlight}
                        fontSize={9}
                        fontWeight={700}
                        fontFamily={CHART.font}
                        pointerEvents="none"
                      >
                        {i + 1}
                      </text>
                    </g>
                  );
                }}
              />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
        {explanationsOn ? (
          <div
            data-explain-hits
            className="absolute inset-0 z-[5] pointer-events-none"
          >
            {Array.from(
              new Map(dotHits.map((h) => [h.index, h])).values(),
            ).map((hit) => (
              <button
                key={`explain-hit-${hit.index}`}
                type="button"
                data-explain-hit={hit.index}
                aria-label={`Bar ${hit.index + 1} explanation`}
                aria-pressed={pinnedExplain === hit.index}
                className="absolute z-[5] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-transparent p-0 cursor-pointer pointer-events-auto"
                style={{ left: hit.left, top: hit.top }}
                onMouseEnter={() => setHoverExplain(hit.index)}
                onMouseLeave={() => setHoverExplain(null)}
                onClick={() =>
                  setPinnedExplain((p) => (p === hit.index ? null : hit.index))
                }
              />
            ))}
          </div>
        ) : null}
        {pinnedNote && popoverAnchor ? (
          <ExplanationPopover
            note={pinnedNote}
            anchor={popoverAnchor}
            hasPrev={prevNote != null}
            hasNext={nextNote != null}
            onPrev={() => {
              if (prevNote) setPinnedExplain(prevNote.index);
            }}
            onNext={() => {
              if (nextNote) setPinnedExplain(nextNote.index);
            }}
            onClose={closeExplain}
          />
        ) : null}
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

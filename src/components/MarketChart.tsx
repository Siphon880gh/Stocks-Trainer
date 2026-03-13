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
  Legend,
} from "recharts";
import { SAMPLE_OHLC, type OHLC } from "../lib/ohlcData";
import { sma, ema, rsi, macd, bollingerBands } from "../lib/indicators";

interface MarketChartProps {
  data?: OHLC[];
  showSMA?: boolean;
  showEMA?: boolean;
  showRSI?: boolean;
  showMACD?: boolean;
  showBollinger?: boolean;
  height?: number;
}

const BULLISH = "#38ff14";
const BEARISH = "#ff3814";

export default function MarketChart({
  data = SAMPLE_OHLC,
  showSMA = false,
  showEMA = false,
  showRSI = false,
  showMACD = false,
  showBollinger = false,
  height = 400,
}: MarketChartProps) {
  const closes = data.map((d) => d.close);
  const sma20 = sma(closes, 5);
  const ema12 = ema(closes, 4);
  const rsi14 = rsi(closes, 5);
  const { macd: macdLine, signal: macdSignal, histogram: macdHist } = macd(closes, 4, 6, 3);
  const { middle: bbMid, upper: bbUpper, lower: bbLower } = bollingerBands(closes, 5, 2);

  const chartData = data.map((d, i) => ({
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,255,20,0.1)" />
        <XAxis
          dataKey="index"
          type="number"
          domain={[0, chartData.length - 1]}
          tickCount={chartData.length}
          tickFormatter={(_, i) => chartData[i]?.name ?? ""}
          stroke="rgba(56,255,20,0.5)"
          tick={{ fill: "rgba(56,255,20,0.7)", fontSize: 10 }}
          tickLine={{ stroke: "rgba(56,255,20,0.3)" }}
        />
        <YAxis
          yAxisId="price"
          domain={["dataMin - 200", "dataMax + 200"]}
          stroke="rgba(56,255,20,0.5)"
          tick={{ fill: "rgba(56,255,20,0.7)", fontSize: 10 }}
          tickLine={{ stroke: "rgba(56,255,20,0.3)" }}
          tickFormatter={(v) => v.toLocaleString()}
        />
        {showRSI && (
          <YAxis
            yAxisId="rsi"
            orientation="right"
            domain={[0, 100]}
            stroke="rgba(56,255,20,0.4)"
            tick={{ fill: "rgba(56,255,20,0.6)", fontSize: 9 }}
            tickFormatter={(v) => `${v}`}
          />
        )}
        {showMACD && (
          <YAxis
            yAxisId="macd"
            orientation="right"
            domain={["auto", "auto"]}
            stroke="rgba(56,255,20,0.4)"
            tick={{ fill: "rgba(56,255,20,0.6)", fontSize: 9 }}
            tickFormatter={(v) => v.toFixed(0)}
          />
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f1810",
            border: "2px solid rgba(56,255,20,0.6)",
            borderRadius: "8px",
            boxShadow: "0 0 20px rgba(0,0,0,0.8), 0 0 10px rgba(56,255,20,0.2)",
            padding: "12px 16px",
            minWidth: "140px",
          }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload as (typeof chartData)[0];
            if (!d) return null;
            const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 0 });
            return (
              <div className="font-mono text-sm space-y-1">
                <p className="text-primary font-bold border-b border-primary/40 pb-1.5 mb-2">{d.name}</p>
                <div className="space-y-1 text-slate-100">
                  <p><span className="text-primary/80 w-4 inline-block">O</span> {fmt(d.open)}</p>
                  <p><span className="text-primary/80 w-4 inline-block">H</span> {fmt(d.high)}</p>
                  <p><span className="text-primary/80 w-4 inline-block">L</span> {fmt(d.low)}</p>
                  <p><span className="text-primary/80 w-4 inline-block">C</span> {fmt(d.close)}</p>
                </div>
              </div>
            );
          }}
        />
        <Legend />
        {chartData.map((entry, i) => (
          <g key={entry.name}>
            <ReferenceArea
              x1={i - 0.4}
              x2={i + 0.4}
              y1={Math.min(entry.open, entry.close)}
              y2={Math.max(entry.open, entry.close)}
              yAxisId="price"
              fill={entry.close >= entry.open ? BULLISH : BEARISH}
              fillOpacity={0.95}
              stroke={entry.close >= entry.open ? BULLISH : BEARISH}
              strokeWidth={1}
            />
            <ReferenceLine
              yAxisId="price"
              segment={[
                { x: i, y: entry.low },
                { x: i, y: entry.high },
              ]}
              stroke={entry.close >= entry.open ? BULLISH : BEARISH}
              strokeWidth={2.5}
              strokeOpacity={1}
            />
          </g>
        ))}
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
          />
        )}
        {showRSI && (
          <Line
            yAxisId="rsi"
            type="monotone"
            dataKey="rsi"
            stroke="#a78bfa"
            strokeWidth={1.5}
            dot={false}
            connectNulls
            name="RSI(5)"
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
            />
          </>
        )}
        {showMACD && (
          <>
            <Line
              yAxisId="macd"
              type="monotone"
              dataKey="macd"
              stroke="#38bdf8"
              strokeWidth={1}
              dot={false}
              connectNulls
              name="MACD"
            />
            <Line
              yAxisId="macd"
              type="monotone"
              dataKey="signal"
              stroke="#818cf8"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              connectNulls
              name="Signal"
            />
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

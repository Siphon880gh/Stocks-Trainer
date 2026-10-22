/**
 * Small SVG line pane under a dense CandlestickChart (same x geometry: 720 wide, padding 8/52, gap 1.5),
 * for RSI / MACD / bandwidth style series. Purely presentational.
 */
export interface PaneSeries { values: (number | null)[]; color: string; label: string; kind?: "line" | "bar" }
export default function IndicatorPane({
  count, series, guides = [], height = 90, domain, title,
}: {
  count: number;
  series: PaneSeries[];
  guides?: Array<{ value: number; label: string }>;
  height?: number;
  domain?: [number, number];
  title: string;
}) {
  const dense = count > 24;
  const W = dense ? 720 : 400;
  const padL = 8, padR = 52, padT = 8, padB = 8;
  const gap = dense ? 1.5 : 2;
  const innerW = W - padL - padR;
  const cw = Math.max(dense ? 2 : 6, (innerW - gap * (count - 1)) / count);
  const step = cw + gap;
  const x = (i: number) => padL + i * step + step / 2;
  const all = series.flatMap((s) => s.values.filter((v): v is number => v != null)).concat(guides.map((g) => g.value));
  const [lo, hi] = domain ?? [Math.min(...all), Math.max(...all)];
  const span = hi - lo || 1;
  const y = (v: number) => padT + (height - padT - padB) * (1 - (v - lo) / span);
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full h-auto" role="img" aria-label={title}>
      {guides.map((g) => (
        <g key={g.label}>
          <line x1={padL} x2={W - padR} y1={y(g.value)} y2={y(g.value)} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="4 3" />
          <text x={W - padR + 4} y={y(g.value) + 3} fontSize={9} fill="currentColor" opacity={0.7}>{g.label}</text>
        </g>
      ))}
      {series.map((s) =>
        s.kind === "bar" ? (
          <g key={s.label}>
            {s.values.map((v, i) => v == null ? null : (
              <rect key={i} x={x(i) - cw / 2} width={cw} y={Math.min(y(v), y(Math.max(lo, Math.min(hi, 0))))} height={Math.abs(y(v) - y(Math.max(lo, Math.min(hi, 0))))} fill={s.color} opacity={0.5} />
            ))}
          </g>
        ) : (
          <polyline
            key={s.label}
            fill="none"
            stroke={s.color}
            strokeWidth={1.5}
            points={s.values.map((v, i) => (v == null ? null : `${x(i)},${y(v)}`)).filter(Boolean).join(" ")}
          />
        ),
      )}
      <text x={padL + 2} y={padT + 8} fontSize={9} fill="currentColor" opacity={0.8}>{series.map((s) => s.label).join(" · ")}</text>
    </svg>
  );
}

import type { EquityPoint } from "../../../lib/academy/paper/types";
import { money } from "../../../lib/academy/paper/describe";

/** Small SVG equity line with the starting-cash baseline. */
export default function EquityCurve({ points, startingCash, height = 120 }: { points: EquityPoint[]; startingCash: number; height?: number }) {
  const W = 600;
  const vals = [startingCash, ...points.map((p) => p.equity)];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  const y = (v: number) => 8 + (1 - (v - lo) / span) * (height - 16);
  const x = (i: number) => (points.length <= 1 ? W / 2 : (i / (points.length - 1)) * W);
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.equity).toFixed(1)}`).join(" ");
  const last = points.at(-1)?.equity ?? startingCash;
  return (
    <section className="panel p-3 space-y-1" aria-label="Equity curve" data-testid="equity-curve">
      <div className="flex justify-between text-[12px]">
        <p className="font-semibold">Equity curve</p>
        <p className="text-muted tabular-nums">
          start {money(startingCash)} · now {money(last)}
        </p>
      </div>
      <svg viewBox={`0 0 ${W} ${height}`} className="w-full" style={{ height }} role="img" aria-label={`Equity from ${money(startingCash)} to ${money(last)}`}>
        <line x1={0} x2={W} y1={y(startingCash)} y2={y(startingCash)} stroke="#d1d4dc" strokeDasharray="4 4" />
        {points.length > 1 ? <path d={d} fill="none" stroke={last >= startingCash ? "#089981" : "#f23645"} strokeWidth={2} /> : null}
      </svg>
    </section>
  );
}

import type { Strategy } from "../../../lib/academy/options/payoff";
import { samplePayoff, strikes, summarize } from "../../../lib/academy/options/payoff";

/** BA8.M3: P&L at expiration vs the stock price at expiration (SVG). Points come straight from payoff.ts. */
export default function PayoffChart({ strategy, lo = 30, hi = 70, n = 81, height = 180 }: { strategy: Strategy; lo?: number; hi?: number; n?: number; height?: number }) {
  const pts = samplePayoff(strategy, lo, hi, n);
  const W = 420;
  const pad = { l: 36, r: 8, t: 10, b: 22 };
  const ys = pts.map((p) => p[1]);
  const yMax = Math.max(1, ...ys);
  const yMin = Math.min(-1, ...ys);
  const x = (s: number) => pad.l + ((s - lo) / (hi - lo)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + ((yMax - v) / (yMax - yMin)) * (height - pad.t - pad.b);
  const d = pts.map(([s, v], i) => `${i ? "L" : "M"}${x(s).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const sum = summarize(strategy);
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" style={{ maxHeight: height }} role="img" aria-label={`${strategy.name}: profit or loss per share at expiration`} data-testid="payoff-chart" data-points={pts.length}>
      <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke="#787b86" strokeWidth={1} />
      {strikes(strategy).map((k) => (
        <g key={k}>
          <line x1={x(k)} x2={x(k)} y1={pad.t} y2={height - pad.b} stroke="#d1d4dc" strokeDasharray="3 3" />
          <text x={x(k)} y={height - 6} fontSize={10} textAnchor="middle" fill="#787b86">
            {k}
          </text>
        </g>
      ))}
      {sum.breakevens.filter((b) => b >= lo && b <= hi).map((b) => (
        <circle key={b} cx={x(b)} cy={y(0)} r={3} fill="#7c3aed" data-breakeven={b} />
      ))}
      <path d={d} fill="none" stroke="#7c3aed" strokeWidth={2} data-path="payoff" />
      <text x={4} y={y(yMax) + 4} fontSize={10} fill="#089981">
        +{yMax.toFixed(1)}
      </text>
      <text x={4} y={y(yMin)} fontSize={10} fill="#f23645">
        {yMin.toFixed(1)}
      </text>
      <text x={W - pad.r} y={height - 6} fontSize={10} textAnchor="end" fill="#787b86">
        stock price at expiration
      </text>
    </svg>
  );
}

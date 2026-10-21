import { meetingByMonth, pricingFor, expectedMoveBp } from "../../lib/macro/fed";
import { fmtSigned } from "./format";

const outcomeName = (bp: number) => (bp === 0 ? "Hold" : bp > 0 ? `Hike ${bp} bp` : `Cut ${Math.abs(bp)} bp`);

/** Simulated futures-implied probabilities for the next decision (look-alike of a rate-probability tool). */
export default function FedPricingCard({ month }: { month: number }) {
  const m = meetingByMonth(month);
  if (!m) return null;
  const p = [...pricingFor(m)].sort((a, b) => b.prob - a.prob);
  const exp = expectedMoveBp(p);
  return (
    <section className="panel p-4 space-y-2" aria-label="Simulated rate probabilities">
      <div className="flex items-baseline gap-2">
        <h3 className="font-semibold">Market pricing for the {m.label} meeting</h3>
        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded px-1">SIMULATED</span>
      </div>
      <p className="text-[12px] text-muted">Current range before the meeting: {m.lowerBefore.toFixed(2)}–{(m.lowerBefore + 0.25).toFixed(2)}%</p>
      <div className="space-y-1.5">
        {p.map((o) => (
          <div key={o.moveBp} className="flex items-center gap-2 text-[13px]">
            <span className="w-24">{outcomeName(o.moveBp)}</span>
            <div className="flex-1 h-4 bg-canvas rounded">
              <div className="h-4 bg-primary rounded" style={{ width: `${o.prob}%` }} />
            </div>
            <span className="w-12 text-right tabular-nums" data-field="prob">
              {o.prob}%
            </span>
          </div>
        ))}
      </div>
      <p className="text-[13px]">
        Market expects about <strong>{fmtSigned(exp, exp % 1 === 0 ? 0 : 1)} bp</strong> (probability-weighted). A decision that matches the favorite is mostly priced in; the move comes
        from the gap between decision and pricing — and from the statement and dots.
      </p>
    </section>
  );
}

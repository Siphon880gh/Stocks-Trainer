import SimulatedFrame, { DataTable } from "./SimulatedFrame";
import { meetingByMonth, expectedMoveBp, pricingHistoryFor, targetBandForMove, type PricingAge } from "../../lib/macro/fed";
import { WORLD } from "../../lib/macro/world";
import { fmtSigned } from "./format";

const AGES: { key: PricingAge; label: string }[] = [
  { key: "current", label: "Current" },
  { key: "dayAgo", label: "1 day ago" },
  { key: "weekAgo", label: "1 week ago" },
  { key: "monthAgo", label: "1 month ago" },
];

/** SIMULATED look-alike of CME FedWatch: target-rate probabilities from 30-Day Fed Funds futures. */
export default function FedPricingCard({ month }: { month: number }) {
  const m = meetingByMonth(month);
  if (!m) return null;
  const hist = pricingHistoryFor(m);
  const current = [...hist.current].sort((a, b) => a.moveBp - b.moveBp);
  const exp = expectedMoveBp(hist.current);
  const idx = WORLD.meetings.findIndex((x) => x.month === m.month);
  const tabs = WORLD.meetings.slice(Math.max(0, idx - 1), idx + 3);
  const rows = current.map((o) => ({
    name: targetBandForMove(m, o.moveBp),
    cells: AGES.map(({ key }) => `${hist[key].find((x) => x.moveBp === o.moveBp)?.prob ?? 0}%`),
    strong: o === current.reduce((a, b) => (a.prob >= b.prob ? a : b)),
  }));
  return (
    <SimulatedFrame
      sourceId="cme-fedwatch"
      title="FedWatch (simulated)"
      period={`${m.label} meeting · target range before the decision ${m.lowerBefore.toFixed(2)}–${(m.lowerBefore + 0.25).toFixed(2)}%`}
      footnote="CME's live tool is implied by 30-Day Fed Funds futures. CME asks media to attribute rate probabilities to “CME FedWatch.” This board is a SIMULATED layout with fictional probabilities; open the real tool for live numbers."
    >
      <p className="text-[12px] text-muted">
        Across the top, each tab is a scheduled FOMC meeting. The nearest meeting sits on the left. This board is parked on {m.label}.
      </p>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Simulated FOMC meeting tabs">
        {tabs.map((t) => (
          <span key={t.month} role="tab" aria-selected={t.month === m.month} className={`px-2.5 py-1 rounded-lg border text-[12px] ${t.month === m.month ? "bg-primary-fill text-white border-primary" : "border-line text-muted"}`}>
            {t.label}
          </span>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold">Current probabilities</p>
        {current.map((o) => (
          <div key={o.moveBp} className="flex items-center gap-2 text-[13px]">
            <span className="w-28 tabular-nums">{targetBandForMove(m, o.moveBp)}</span>
            <div className="flex-1 h-4 bg-canvas rounded">
              <div className="h-4 bg-primary-fill rounded" style={{ width: `${o.prob}%` }} />
            </div>
            <span className="w-12 text-right tabular-nums" data-field="prob">
              {o.prob}%
            </span>
          </div>
        ))}
      </div>
      <DataTable caption="Target rate probabilities (Current tab)" columns={AGES.map((a) => a.label)} rows={rows} highlightCol={0} />
      <p className="text-[13px]">
        Probability-weighted move: about <strong>{fmtSigned(exp, exp % 1 === 0 ? 0 : 1)} bp</strong>. A decision that matches the favorite is mostly priced in; the surprise is the gap between the decision and this table — and the statement and dots.
      </p>
    </SimulatedFrame>
  );
}

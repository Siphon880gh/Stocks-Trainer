import type { AccountState } from "../../../lib/academy/paper/types";
import { feesPaid, slippagePaid } from "../../../lib/academy/paper/stats";
import { money } from "../../../lib/academy/paper/describe";

/** BA11.M4: the cost of trading, with this session's fee / slippage settings and totals. SIMULATED. */
export default function CostPanel({ state }: { state: AccountState }) {
  const fee = state.options?.feeCents ?? 0;
  const bps = state.options?.slippageBps ?? 0;
  const example = 100_000; // a $1,000 trade
  const roundTrip = 2 * fee + 2 * Math.round((example * bps) / 10_000);
  return (
    <section className="panel p-3 space-y-2 text-[12px]" aria-label="Cost of trading" data-testid="cost-panel">
      <p className="font-semibold text-[13px]">Cost of trading (stretch rules on)</p>
      <p>
        This session charges {fee ? `${money(fee)} per fill` : "no fee"} and {bps ? `${bps} bps (${(bps / 100).toFixed(2)}%) slippage on market, stop and trailing-stop fills` : "no slippage"}. Limit orders never fill worse than their limit.
      </p>
      <ul className="list-disc pl-4 space-y-1">
        <li>A fee is a fixed cost, so it weighs more on small trades: $1 on a $100 trade is 1% each way.</li>
        <li>Slippage is the gap between the price you expected and the price you got; market and stop orders pay it, most of all in fast or thin markets.</li>
        <li>
          Costs are paid on the way in and on the way out. A {money(example)} round trip here costs about {money(roundTrip)}, so the price must move at least that much before the trade breaks even.
        </li>
        <li>Fees are added to the cost basis (and taken from sale proceeds), so the P&amp;L above is already net of costs.</li>
      </ul>
      <p className="tabular-nums" data-testid="cost-totals">
        Paid so far: fees {money(feesPaid(state))} · slippage {money(slippagePaid(state))}
      </p>
    </section>
  );
}

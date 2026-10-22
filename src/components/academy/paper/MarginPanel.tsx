import type { AccountState } from "../../../lib/academy/paper/types";
import { SHORT_INITIAL_MARGIN, SHORT_MAINTENANCE, buyingPower, equity, marginCall, shortRequirement, shortValue } from "../../../lib/academy/paper/account";
import { money, pct } from "../../../lib/academy/paper/describe";

/** BA11.M2: short selling and margin explainer with this session's live numbers. SIMULATED. */
export default function MarginPanel({ state }: { state: AccountState }) {
  const sv = shortValue(state);
  return (
    <section className="panel p-3 space-y-2 text-[12px]" aria-label="Short selling and margin" data-testid="margin-panel">
      <p className="font-semibold text-[13px]">Short selling &amp; margin (stretch rules on)</p>
      <ul className="list-disc pl-4 space-y-1">
        <li>A short sale sells shares you borrowed. You buy them back later (&ldquo;buy to cover&rdquo;); the gain is the sale price minus the buy-back price.</li>
        <li>The price can rise without limit, so the loss on a short has no ceiling. A buy stop caps it, but a gap up can jump past the stop.</li>
        <li>
          Initial margin (Reg T): {pct(SHORT_INITIAL_MARGIN, 0)} of the sale value is held on top of the sale proceeds. If equity falls below {pct(SHORT_MAINTENANCE, 0)} of the short value, a broker issues a margin call and can buy you in.
        </li>
        <li>Simplified here: no borrow fee, no hard-to-borrow list, no dividends owed and no forced buy-in.</li>
      </ul>
      <p className="tabular-nums" data-testid="margin-numbers">
        Short value {money(sv)} · held back {money(shortRequirement(state))} · buying power {money(buyingPower(state))} · equity {money(equity(state))}
      </p>
      {marginCall(state) ? (
        <p className="text-accent-red font-semibold" role="alert" data-testid="margin-call">
          Margin call (simulated): equity is below {pct(SHORT_MAINTENANCE, 0)} of the short value. At a broker you would have to add cash or cover now.
        </p>
      ) : null}
    </section>
  );
}

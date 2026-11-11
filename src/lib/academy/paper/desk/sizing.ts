/** Order-ticket sizing helpers for the paper desk (like a broker ticket's "risk" and "% of balance" modes). Cents in, whole shares out. */

/** Shares so that a stop-out loses about `riskCents` (before gaps and slippage). 0 when the stop is not below / above the entry. */
export function sharesForRisk(riskCents: number, entry: number, stop: number): number {
  const per = Math.abs(entry - stop);
  if (!(riskCents > 0) || !(per > 0)) return 0;
  return Math.floor(riskCents / per);
}

/** Whole shares a cash amount buys at `price`. */
export const sharesForAmount = (amountCents: number, price: number) => (amountCents > 0 && price > 0 ? Math.floor(amountCents / price) : 0);

/** Whole shares for `pct` (0–100) of the account's equity at `price`. */
export const sharesForPercent = (pct: number, equityCents: number, price: number) => sharesForAmount(Math.round((equityCents * pct) / 100), price);

/** Reward ÷ risk for a long (stop below, target above) or short (stop above, target below) plan; null if the plan is inconsistent. */
export function rewardRisk(entry: number, stop: number, target: number): number | null {
  const long = stop < entry && target > entry;
  const short = stop > entry && target < entry;
  if (!long && !short) return null;
  return Math.abs(target - entry) / Math.abs(entry - stop);
}

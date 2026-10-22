/**
 * BA8.M2: options knowledge checks, 8 original items per ladder level (ids BA-OPT-L<n>-NN).
 * Numeric items take their right answer from payoff.ts (never typed in), so the test can recompute them.
 */
import type { AnswerLetter, QuizChoice } from "../types";
import type { LadderLevel } from "./ladder";
import { getStrategy } from "./ladder";
import { summarize } from "./payoff";

export type NumericMetric = "maxGain" | "maxLoss" | "breakeven" | "breakevenHigh" | "maxGainContract" | "maxLossContract";

export interface OptionsCheckItem {
  id: string;
  level: LadderLevel;
  prompt: string;
  options: QuizChoice[];
  correctAnswer: AnswerLetter;
  explanation: string;
  numeric?: { strategyId: string; metric: NumericMetric };
}

const LETTERS: AnswerLetter[] = ["A", "B", "C", "D"];
const usd = (x: number) => `$${x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function metricValue(strategyId: string, m: NumericMetric): number {
  const s = summarize(getStrategy(strategyId)!);
  switch (m) {
    case "maxGain": return s.maxGain;
    case "maxLoss": return s.maxLoss;
    case "breakeven": return s.breakevens[0]!;
    case "breakevenHigh": return s.breakevens.at(-1)!;
    case "maxGainContract": return s.perContract.maxGain;
    case "maxLossContract": return s.perContract.maxLoss;
  }
}

function build(level: LadderLevel, n: number, prompt: string, right: string, wrong: string[], explanation: string, numeric?: OptionsCheckItem["numeric"]): OptionsCheckItem {
  const at = (n + level) % 4;
  const labels = [...wrong];
  labels.splice(at, 0, right);
  return { id: `BA-OPT-L${level}-${String(n).padStart(2, "0")}`, level, prompt, options: labels.map((label, i) => ({ id: LETTERS[i]!, label })), correctAnswer: LETTERS[at]!, explanation, ...(numeric ? { numeric } : {}) };
}

const num = (level: LadderLevel, n: number, strategyId: string, metric: NumericMetric, prompt: string, wrongs: number[], explanation: string) =>
  build(level, n, prompt, usd(metricValue(strategyId, metric)), wrongs.map(usd), explanation, { strategyId, metric });

export const OPTIONS_CHECKS: OptionsCheckItem[] = [
  // Level 1
  build(1, 1, "You own 100 shares and sell one covered call. If it is exercised, what must you do?", "Sell your 100 shares at the strike", ["Buy 100 more shares at the strike", "Pay the premium back", "Nothing: covered calls carry no obligation"], "Selling a call is an obligation to sell the shares at the strike if assigned; your shares cover it."),
  build(1, 2, "In a cash-secured put, what is the cash set aside for?", "Buying 100 shares at the strike if you are assigned", ["Paying the premium", "Covering losses above the strike", "Repaying a margin loan"], "The put seller must buy at the strike if assigned; the cash makes sure that purchase is covered."),
  build(1, 3, "With a covered call, what happens to gains above the strike at expiration?", "You give them up: the shares are sold at the strike", ["You keep all of them", "They are paid to you as a dividend", "They are added to the premium"], "The buyer of your call gets the upside above the strike; you keep the strike price plus the premium."),
  build(1, 4, "The stock under your covered call falls 30%. How much does the call protect you?", "Only by the premium you received", ["Fully: the call covers the loss", "Half of the loss", "The broker refunds the loss"], "The premium is a small cushion. The rest of the fall in the shares is yours."),
  num(1, 5, "covered-call", "maxGain", "Covered call: shares bought at $50.00, sold a $55 call for $1.50. Maximum gain per share at expiration?", [1.5, 5, 56.5], "Max gain = (strike − purchase price) + premium = (55 − 50) + 1.50 = $6.50."),
  num(1, 6, "covered-call", "breakeven", "Same covered call ($50.00 shares, $55 call sold for $1.50). Breakeven at expiration?", [50, 51.5, 53.5], "Breakeven = purchase price − premium = 50 − 1.50 = $48.50."),
  num(1, 7, "cash-secured-put", "breakeven", "Cash-secured put: sold a $45 put for $1.20. Breakeven at expiration?", [45, 46.2, 43.2], "Breakeven = strike − premium = 45 − 1.20 = $43.80."),
  num(1, 8, "cash-secured-put", "maxGainContract", "Same cash-secured put ($45 put sold for $1.20). Maximum gain for one contract (100 shares)?", [1.2, 12, 4500], "Max gain is the premium: $1.20 × 100 shares = $120.00."),
  // Level 2
  build(2, 1, "What is the most the buyer of a call can lose?", "The premium paid", ["Unlimited", "The strike price", "Nothing, if they hold to expiration"], "A long option risks only its premium."),
  build(2, 2, "A long put makes money at expiration when…", "the stock is below the strike minus the premium", ["the stock is above the strike", "the stock is exactly at the strike", "volume rises"], "Breakeven for a long put is strike − premium; below it, the put is worth more than it cost."),
  build(2, 3, "A protective put works most like…", "insurance: a floor at the strike, paid for with the premium", ["a free hedge", "a way to collect income", "a promise the shares will rise"], "You pay a premium for the right to sell at the strike, which caps the loss on the shares."),
  build(2, 4, "What does a collar trade away?", "Gains above the short call strike, in exchange for a floor", ["The dividend", "The floor below the put strike", "Nothing: it is free protection"], "The sold call pays for most of the bought put but caps the upside."),
  num(2, 5, "long-call", "breakeven", "Long call: bought a $50 call for $2.50. Breakeven at expiration?", [50, 47.5, 55], "Breakeven = strike + premium = 50 + 2.50 = $52.50."),
  num(2, 6, "long-put", "maxGain", "Long put: bought a $50 put for $2.30. Largest possible gain per share (stock to $0)?", [50, 2.3, 52.3], "Max gain = strike − premium = 50 − 2.30 = $47.70, reached if the stock goes to zero."),
  num(2, 7, "protective-put", "maxLoss", "Protective put: shares at $50.00 plus a $47 put bought for $1.10. Maximum loss per share at expiration?", [1.1, 3, 47], "Max loss = (purchase − strike) + premium = (50 − 47) + 1.10 = $4.10."),
  num(2, 8, "collar", "maxGain", "Collar: shares at $50.00, bought a $47 put for $1.10, sold a $55 call for $1.00. Maximum gain per share?", [5, 6, 3.9], "Max gain = (55 − 50) − 1.10 + 1.00 = $4.90."),
  // Level 3
  build(3, 1, "Why is a vertical spread called defined risk?", "The bought option limits the loss on the sold one", ["The broker covers any loss", "Both options always expire worthless", "The premiums cancel out exactly"], "Owning the further strike caps what the sold strike can cost you."),
  build(3, 2, "The most a credit spread can earn is…", "the net credit received", ["the width of the strikes", "unlimited", "the higher strike price"], "If both options expire worthless, you keep the credit and nothing more."),
  build(3, 3, "An iron condor makes its maximum gain when the stock…", "ends between the two short strikes", ["moves far in either direction", "ends exactly at a long strike", "gaps on earnings"], "Inside the short strikes all four options expire worthless and you keep the credit."),
  build(3, 4, "Compared with a long call, what does a bull call spread give up?", "Gains above the short call strike", ["All of the downside protection", "The right to sell", "Nothing: it only lowers the cost"], "Selling the higher call lowers the cost but caps the gain at the spread width minus the debit."),
  num(3, 5, "bull-call-spread", "maxGain", "Bull call spread: bought a $50 call for $2.50, sold a $55 call for $0.90. Maximum gain per share?", [5, 1.6, 4.1], "Max gain = width − net debit = (55 − 50) − (2.50 − 0.90) = $3.40."),
  num(3, 6, "bull-put-spread", "maxLoss", "Bull put spread: sold a $50 put for $2.20, bought a $45 put for $0.70. Maximum loss per share?", [5, 1.5, 2.9], "Max loss = width − net credit = 5 − 1.50 = $3.50."),
  num(3, 7, "iron-condor", "breakevenHigh", "Iron condor: $40/$45 put spread and $55/$60 call spread for a $1.25 total credit. Upper breakeven?", [55, 60, 53.75], "Upper breakeven = short call strike + credit = 55 + 1.25 = $56.25."),
  num(3, 8, "call-butterfly", "maxGain", "Call butterfly: long $45 call ($6.00), two short $50 calls ($2.50 each), long $55 call ($0.80). Maximum gain per share?", [5, 1.8, 6.8], "Net debit = 6.00 − 5.00 + 0.80 = 1.80. Max gain at $50 = (50 − 45) − 1.80 = $3.20."),
  // Level 4
  build(4, 1, "What is the maximum loss of a naked (uncovered) short call?", "Unlimited: the stock can keep rising", ["The premium received", "The strike price", "100 times the premium"], "With no shares to deliver, each dollar above the strike is a dollar lost, with no ceiling."),
  build(4, 2, "Why do brokers keep naked options for their highest approval tier?", "Losses can far exceed the premium and need large margin", ["They are illegal for individuals", "They have no risk", "They cannot be assigned"], "The seller can owe much more than they collected, so brokers require experience and margin."),
  build(4, 3, "A naked put and a cash-secured put have the same payoff. What is different?", "Whether the cash to buy the shares is set aside", ["The strike price", "The expiration date", "Whether premium is received"], "The naked seller may not have the money to buy the shares if assigned."),
  build(4, 4, "You are assigned on a short call and own no shares. What happens?", "You must deliver shares you do not have, buying them at the market price", ["The contract is cancelled", "You receive shares", "You pay only the premium back"], "Assignment forces delivery at the strike; without shares you buy them at whatever the market price is."),
  num(4, 5, "naked-call", "breakeven", "Naked call: sold a $55 call for $1.50. Breakeven at expiration?", [55, 53.5, 58], "Breakeven = strike + premium = 55 + 1.50 = $56.50."),
  num(4, 6, "naked-put", "maxLoss", "Naked put: sold a $45 put for $1.20. Loss per share if the stock goes to $0?", [45, 1.2, 46.2], "Loss at zero = strike − premium = 45 − 1.20 = $43.80."),
  num(4, 7, "naked-call", "maxGainContract", "Naked call ($55 call sold for $1.50). Best case for one contract?", [1.5, 5500, 550], "The best case is keeping the premium: $1.50 × 100 = $150.00."),
  num(4, 8, "naked-put", "maxLossContract", "Naked put ($45 put sold for $1.20). Loss for one contract if the stock goes to $0?", [4500, 120, 438], "($45 − $1.20) × 100 = $4,380.00."),
];

export const checksForLevel = (l: LadderLevel) => OPTIONS_CHECKS.filter((q) => q.level === l);
export const CHECK_PASS = 0.8;
export const gradeChecks = (l: LadderLevel, answers: Record<string, AnswerLetter | undefined>) => {
  const items = checksForLevel(l);
  const correct = items.filter((q) => answers[q.id] === q.correctAnswer).length;
  return { correct, total: items.length, passed: correct / items.length >= CHECK_PASS };
};

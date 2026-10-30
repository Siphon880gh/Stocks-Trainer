import type { CoachingSession } from "../types";

/** Breakout → pullback into a fair value gap on SAMPLE 5-minute tapes: signal vs entry, gap vs no gap, stop, the "often retested" claim, targets. */
export const breakoutPullbackFvgSession: CoachingSession = {
  meta: {
    slug: "breakout-pullback-fvg",
    title: "Buy the pullback, not the breakout",
    summary:
      "Treat the breakout candle as a signal, check whether the move left a gap (candle 1's high vs candle 3's low), buy only a pullback into it with the stop below the gap and the level, and plan the target yourself.",
    topic: "Trade management",
    tags: ["sample", "equities", "price-action", "trade-management"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE stock, 5-minute chart. 50.00 has capped price three times this morning. The 10:30 candle is crossing it right now and trades at 50.80.\n\nWhat do you do?",
        outcome: "continue",
        choices: [
          { label: "Wait: the breakout candle is a signal, not an entry", next: "gap" },
          { label: "Buy now before it runs away", next: "wrong_chase" },
        ],
      },
      wrong_chase: {
        message:
          "The first cross is where late buyers chase and where many breakouts reverse. This setup waits to see whether the move leaves a gap, then for price to pull back into it.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      gap: {
        message:
          "The 10:30 candle closes at 51.00. The 10:25 candle's high was 49.99. The 10:35 candle's low is 50.40.\n\nDid the move leave a gap?",
        outcome: "continue",
        choices: [
          { label: "Yes: 49.99–50.40, between candle 1's high and candle 3's low", next: "entry" },
          { label: "No: the gap would have to be between two sessions", next: "wrong_gap" },
        ],
      },
      wrong_gap: {
        message:
          "This is a three-candle gap, often called a fair value gap or imbalance: candle 3's low (50.40) is above candle 1's high (49.99), so only buyers traded in between. It can form on any timeframe, inside one session.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "gap",
      },
      entry: {
        message:
          "At 10:50 price pulls back to 50.25, into the gap.\n\nWhere do you buy, and where is the stop?",
        outcome: "continue",
        choices: [
          { label: "Buy 50.40 in the gap; stop 49.89, below the gap and the 50.00 level", next: "claim" },
          { label: "Buy 50.40; stop 50.30, just inside the gap", next: "wrong_stop" },
        ],
      },
      wrong_stop: {
        message:
          "A stop inside the gap gets hit by an ordinary pullback, which is exactly what you were waiting for. The idea is wrong only if price closes back below the gap and the old resistance.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "entry",
      },
      claim: {
        message:
          "The reel this comes from says these gaps are \"often retested\".\n\nHow much weight should that carry?",
        outcome: "continue",
        choices: [
          { label: "It's a common belief: some gaps are never revisited, and a missed trade is the cost of waiting", next: "nogap" },
          { label: "It's a rule: gaps always fill, so the stop is optional", next: "wrong_claim" },
        ],
      },
      wrong_claim: {
        message:
          "Some gaps are revisited within a few candles, some take weeks, and some never are. Some pullbacks also keep going straight through the gap. The stop is what makes the belief safe to act on.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "claim",
      },
      nogap: {
        message:
          "Another stock: the 10:25 candle closes at 30.30, above 30.00. The 10:20 high was 29.97. The 10:30 candle's low is 29.95.\n\nIs this setup on?",
        outcome: "continue",
        choices: [
          { label: "No: 29.95 overlaps 29.97, so there is no gap and no entry", next: "target" },
          { label: "Yes: buy at 29.97 anyway", next: "wrong_nogap" },
        ],
      },
      wrong_nogap: {
        message:
          "Overlap by even a cent means no imbalance. A plain breakout-and-retest is a different setup with its own rules. Here price closed back under 30.00 on the next candle.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "nogap",
      },
      target: {
        message:
          "Back to the first trade: long 50.40, stop 49.89, risk 0.51. The reel shows a target well above but gives no rule.\n\nWhat do you do?",
        outcome: "continue",
        choices: [
          { label: "Set it before entry: the next level, a 2R target (51.42), or a trailing stop", next: "success" },
          { label: "No target: hold until it feels done", next: "wrong_target" },
        ],
      },
      wrong_target: {
        message:
          "Without a target or a trailing rule, winners turn into scratches and the reward-to-risk is a guess. Decide the exit when you decide the entry.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "target",
      },
      success: {
        message:
          "Session complete. The breakout candle is a signal, the gap (candle 1's high to candle 3's low) is where to buy a pullback, the stop goes below the gap and the level, no gap means no setup, and \"often retested\" is a belief, not a promise.\n\nNext: Practice → Breakout, pullback and fair value gap, Learn → Breakout Pullback & Fair Value Gaps, and the fair value gap cases in Cases → Price action trades.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default breakoutPullbackFvgSession;

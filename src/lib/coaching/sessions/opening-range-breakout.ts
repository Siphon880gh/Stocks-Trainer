import type { CoachingSession } from "../types";

/** 15-minute opening range breakout on SAMPLE SPY.S: range, close outside, stop at the other end, 1:1, sizing and the option caveat. */
export const openingRangeBreakoutSession: CoachingSession = {
  meta: {
    slug: "opening-range-breakout",
    title: "Trade the opening range",
    summary:
      "Mark the first 30 minutes on a 15-minute chart, wait for a close outside the range, put the stop at the other end, aim 1:1 on the underlying, and size for a wide range.",
    topic: "Trade management",
    tags: ["sample", "equities", "price-action", "trade-management"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE SPY.S, 15-minute chart. The 9:30 candle ranged 579.60–581.40 and the 9:45 candle 580.30–581.60.\n\nWhat is the opening range?",
        outcome: "continue",
        choices: [
          { label: "579.60–581.60: the high and low of the first two candles", next: "wick" },
          { label: "580.30–581.40: where the two candles overlap", next: "wrong_overlap" },
        ],
      },
      wrong_overlap: {
        message:
          "The range is the full extent of the first 30 minutes: the highest high and the lowest low of both candles. The overlap leaves out the extremes buyers and sellers actually reached.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wick: {
        message:
          "10:15: price trades up to 581.90, above the 581.60 range high, but the candle closes at 581.30.\n\nWhat now?",
        outcome: "continue",
        choices: [
          { label: "Nothing yet: it closed back inside the range", next: "signal" },
          { label: "Buy calls: it broke the high", next: "wrong_wick" },
        ],
      },
      wrong_wick: {
        message:
          "A wick through the line is a test. The rule waits for a 15-minute close outside the range, and this one closed inside it.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "wick",
      },
      signal: {
        message:
          "10:30 closes at 582.10, above 581.60. You go long (calls on SPY.S, or shares).\n\nWhere is the stop, and where is the 1:1 target?",
        outcome: "continue",
        choices: [
          { label: "Stop 579.60 (the range low); risk 2.50, so the target is 584.60", next: "wide" },
          { label: "Stop 581.60 (the range high); target 582.60", next: "wrong_stop" },
          { label: "Target 584.60, and I'll decide the stop if it drops", next: "wrong_nostop" },
        ],
      },
      wrong_stop: {
        message:
          "The rule puts the stop at the opposite end of the range. The idea is \"price leaves the range upward\"; it is wrong when price crosses the whole range back down, not when it dips to the old high.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "signal",
      },
      wrong_nostop: {
        message:
          "The 1:1 target is measured from the stop. Without a stop there is no risk to measure, and no limit on the loss.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "signal",
      },
      wide: {
        message:
          "Another day the open is violent: the range is 598.40–603.90 and a candle closes above it at 604.10. The stop would be 5.70 away. You risk 200 per trade and usually hold 80 shares.\n\nWhat do you do?",
        outcome: "continue",
        choices: [
          { label: "Size down to about 35 shares (200 ÷ 5.70), or skip the day", next: "option" },
          { label: "Same 80 shares: the signal is the signal", next: "wrong_size" },
          { label: "Move the stop to the middle of the range so 80 shares fit", next: "wrong_move" },
        ],
      },
      wrong_size: {
        message:
          "80 × 5.70 = 456 at risk, more than double your budget. The signal decides direction; the stop distance decides size.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "wide",
      },
      wrong_move: {
        message:
          "A stop in the middle of the range is not where the idea fails, so it gets hit by ordinary noise. Keep the stop, change the size.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "wide",
      },
      option: {
        message:
          "Back to the first trade with a same-day 583 call bought at about 1.56. If SPY.S reaches the 1:1 target the call is worth about 2.69; at the stop about 0.57 (SAMPLE, assumed volatility).\n\nIs this a 1:1 trade on the option?",
        outcome: "continue",
        choices: [
          { label: "No: about +73% vs −64% on the premium. Delta, gamma and time decay change the math", next: "success" },
          { label: "Yes: 1:1 on the chart means 1:1 on the option", next: "wrong_premium" },
        ],
      },
      wrong_premium: {
        message:
          "The option moves by roughly delta × the stock's move, and delta changes as price moves. The chart's 1:1 is on SPY.S; the premium has its own reward and risk, and the most you can lose is what you paid.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "option",
      },
      success: {
        message:
          "Session complete. Range from the first two 15-minute candles, a close (not a wick) outside it, stop at the other end, 1:1 on the underlying, size from the stop, and option premium planned separately.\n\nNext: Practice → Opening range breakout, Learn → Opening Range Breakout, and the ORB cases in Cases → Price action trades.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default openingRangeBreakoutSession;

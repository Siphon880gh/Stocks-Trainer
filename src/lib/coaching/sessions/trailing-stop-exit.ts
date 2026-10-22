import type { CoachingSession } from "../types";

/** Trailing a stop under higher lows and exiting when the reward left no longer pays for the risk (SAMPLE). */
export const trailingStopExitSession: CoachingSession = {
  meta: {
    slug: "trailing-stop-exit",
    title: "Trail the stop, plan the exit",
    summary:
      "Step a stop up under each higher low, never move it away from price, and exit when the reward left no longer justifies the risk.",
    topic: "Trade management",
    tags: ["all-markets", "price-action", "trade-management"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE uptrend: you bought at 50.00 with a stop at 48.00. Price has made higher lows at 51.00 and 53.00 and now trades at 56.00.\n\nWhat do you do with the stop?",
        outcome: "continue",
        choices: [
          {
            label: "Leave it at 48.00 for the whole trade",
            next: "wrong_static",
          },
          {
            label: "Step it up to just under the latest higher low, below 53.00",
            next: "trail",
          },
          {
            label: "Move it to 55.80, a few cents under price",
            next: "wrong_tight",
          },
        ],
      },
      wrong_static: {
        message:
          "A stop left at 48.00 lets a 6-point gain turn back into a loss. Each higher low is a new place where the uptrend would be broken.\n\nBack to the stop.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_tight: {
        message:
          "A stop inside normal noise gets hit by an ordinary pullback, not by a broken trend. Trail under structure, not under the last tick.\n\nBack to the stop.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      trail: {
        message:
          "Price pulls back to 54.00, holds above 53.00, then rallies to 58.00 and leaves a new higher low at 55.00.\n\nNow?",
        outcome: "continue",
        choices: [
          {
            label: "Raise the stop to just under 55.00, the new higher low",
            next: "exit",
          },
          {
            label: "Lower the stop to give the trade more room",
            next: "wrong_lower",
          },
        ],
      },
      wrong_lower: {
        message:
          "A trailing stop only moves in the direction of the trade. Moving it away from price adds risk after the fact.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "trail",
      },
      exit: {
        message:
          "Price reaches 60.00, just under the 61.00 target you planned at a major prior high. From here the reward left is about 1.00, while the trailed stop is about 5.00 away.\n\nWhat fits?",
        outcome: "continue",
        choices: [
          {
            label: "Take profit or tighten the stop: the reward left no longer justifies the risk",
            next: "success",
          },
          {
            label: "Add a new full position because the trade is working",
            next: "wrong_add",
          },
        ],
      },
      wrong_add: {
        message:
          "Adding right under a major high buys about 1.00 of upside with about 5.00 of risk. Working is not the same as worth more risk.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "exit",
      },
      success: {
        message:
          "Session complete. The stop stepped up under each higher low, never away from price, and the exit came when the reward left was too small.\n\nNext: Learn → Price Action for the trailing-stop chart, and Archive → trailing stop.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default trailingStopExitSession;

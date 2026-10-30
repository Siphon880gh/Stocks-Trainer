import type { CoachingSession } from "../types";

/** Price action framework step 2: the stop sits where the thesis is invalidated, and a close through it ends the trade (SAMPLE). */
export const honorTheStopSession: CoachingSession = {
  meta: {
    slug: "honor-the-stop",
    title: "Honor the stop",
    summary:
      "Place the stop where the trade idea is proven wrong, size the position to it, sit through normal pullbacks, and exit when price closes through it.",
    topic: "Trade management",
    tags: ["all-markets", "price-action", "trade-management"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE stock: resistance at 50.00 turned price back three times. Today it closed at 50.60, above that ceiling. You plan to buy the breakout.\n\nWhere does the stop go?",
        outcome: "continue",
        choices: [
          {
            label: "Just under the breakout candle, back inside the base (about 49.70): where the breakout has failed",
            next: "size",
          },
          {
            label: "At 45.00, far away so it never gets hit",
            next: "wrong_wide",
          },
          {
            label: "No stop. I will decide if it falls",
            next: "wrong_none",
          },
        ],
      },
      wrong_wide: {
        message:
          "A stop at 45.00 still gets hit if the idea fails, just after a loss six times bigger. The breakout idea is already wrong once price is back inside the base.\n\nBack to the stop.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_none: {
        message:
          "Deciding after it falls means deciding while losing, which is when people hold and hope. The stop belongs in the plan before entry.\n\nBack to the stop.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      size: {
        message:
          "Entry 50.60, stop 49.70: 0.90 of risk per share. Your account is 9,000 and you risk 1% per trade.\n\nHow many shares?",
        outcome: "continue",
        choices: [
          {
            label: "100 shares: 90 of risk ÷ 0.90 per share",
            next: "pullback",
          },
          {
            label: "177 shares: as many as the account can buy",
            next: "wrong_size",
          },
        ],
      },
      wrong_size: {
        message:
          "177 shares × 0.90 = about 160 at risk, close to 2% of the account instead of 1%. Size comes from the stop distance, not from the buying power.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "size",
      },
      pullback: {
        message:
          "Price runs to 51.50, then pulls back with three red candles to 50.10. It is still above your 49.70 stop.\n\nWhat do you do?",
        outcome: "continue",
        choices: [
          {
            label: "Nothing: the thesis holds until a close through 49.70",
            next: "close_through",
          },
          {
            label: "Lower the stop to 48.50 to give it more room",
            next: "wrong_lower",
          },
        ],
      },
      wrong_lower: {
        message:
          "Moving the stop away from price after entry raises the loss you agreed to. A long's stop only moves up.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "pullback",
      },
      close_through: {
        message:
          "Next candle: price closes at 49.50, back inside the base and below 49.70.\n\nNow?",
        outcome: "continue",
        choices: [
          {
            label: "Exit and take the small planned loss: the breakout failed",
            next: "success",
          },
          {
            label: "Hold: it was at 51.50 a few days ago, it will come back",
            next: "wrong_hope",
          },
        ],
      },
      wrong_hope: {
        message:
          "Where price was does not matter. The reason for the trade was \"the breakout holds\", and the close says it did not. Holding turns a 1% loss into an open-ended one.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "close_through",
      },
      success: {
        message:
          "Session complete. The stop sat where the idea was wrong, the size kept the loss to about 1%, the pullback above the stop was ignored, and the close through it ended the trade.\n\nNext: Learn → Price Action Framework, and Cases → Framework 3: the breakout fails.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default honorTheStopSession;

import type { CoachingSession } from "../types";

/** A hammer shape needs a prior decline, a level and a confirmation candle (SAMPLE). */
export const candleNeedsContextSession: CoachingSession = {
  meta: {
    slug: "candle-needs-context",
    title: "One candle is not a signal",
    summary:
      "A hammer shape only becomes a hammer setup after a decline, near support, and with a confirming close. Then the idea fails below its low.",
    topic: "Chart skills",
    tags: ["all-markets", "candles", "price-action", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE chart: a candle with a long lower wick and a small body near its high prints in the middle of a sideways range, far from any support.\n\nRead?",
        outcome: "continue",
        choices: [
          {
            label: "It is a hammer, so buy",
            next: "wrong_shape_only",
          },
          {
            label: "The shape alone is not a signal: a hammer is a reversal after a decline, ideally at support",
            next: "context",
          },
          {
            label: "Sell it, because it is really a hanging man",
            next: "wrong_hanging",
          },
        ],
      },
      wrong_shape_only: {
        message:
          "Candle names describe shapes in context. In the middle of a range there is no decline to reverse and no level to defend.\n\nBack to the read.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_hanging: {
        message:
          "A hanging man is the same shape after a rally. There was no rally here either, just a range.\n\nBack to the read.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      context: {
        message:
          "Later, after a three-bar decline into a prior support area, the same shape prints.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "This is a hammer setup. Wait for confirmation: a next candle that closes above the hammer's high",
            next: "confirm",
          },
          {
            label: "Buy immediately at the bottom of the wick",
            next: "wrong_no_confirm",
          },
        ],
      },
      wrong_no_confirm: {
        message:
          "Single-candle reversals fail often. The confirming close is what shows buyers followed through.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "context",
      },
      confirm: {
        message:
          "The next candle closes above the hammer's high.\n\nWhere is the idea proven wrong?",
        outcome: "continue",
        choices: [
          {
            label: "Below the hammer's low: that is where the buyers' rejection would fail",
            next: "success",
          },
          {
            label: "Nowhere. A confirmed hammer cannot fail",
            next: "wrong_no_stop",
          },
        ],
      },
      wrong_no_stop: {
        message:
          "Confirmed patterns still fail. The hammer's low is where its story is over.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "confirm",
      },
      success: {
        message:
          "Session complete. Shape, then prior trend and level, then confirmation, then invalidation.\n\nNext: Learn → Reading One Candle and the Hammer Family drills.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default candleNeedsContextSession;

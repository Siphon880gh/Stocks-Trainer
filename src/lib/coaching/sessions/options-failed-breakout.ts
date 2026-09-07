import type { CoachingSession } from "../types";

/** Failed breakout on the underlying — still a stock decision. */
export const optionsFailedBreakoutSession: CoachingSession = {
  meta: {
    slug: "options-failed-breakout",
    title: "Failed breakout on the underlying",
    summary:
      "A SAMPLE breakout that fails is a stock-tape story. Do not invent puts because the level broke.",
    topic: "Options context",
    tags: ["options", "options-context", "breakout", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE stock: price pushes through a well-watched level, then closes back below it. No options chain in the UI.\n\nHow do you name this?",
        outcome: "continue",
        choices: [
          {
            label: "Buy puts because failed breakouts are put trades",
            next: "wrong_puts",
          },
          {
            label: "Call it a failed breakout on the stock, then ask if you chase, fade, or hold",
            next: "stance",
          },
          {
            label: "Ignore the fail and treat the first push as a confirmed breakout",
            next: "wrong_ignore_fail",
          },
        ],
      },
      wrong_puts: {
        message:
          "Puts are not a product here. A failed breakout is still a stock decision.\n\nReturn to how you name this.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_ignore_fail: {
        message:
          "Closing back below the level is the fail. Pretending the first push won skips the tape.\n\nReturn to how you name this.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      stance: {
        message:
          "The breakout attempt already failed. You have no short-option overlay.\n\nWhat stock stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the close so you own the next attempt",
            next: "wrong_buy_fail",
          },
          {
            label: "Hold or wait; do not buy a failed breakout, and do not invent a short",
            next: "retry",
          },
        ],
      },
      wrong_buy_fail: {
        message:
          "Buying a fail to own the next attempt is chasing a rejected level. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "stance",
      },
      retry: {
        message:
          "A later SAMPLE session re-tests the same level and fails again.\n\nDoes that unlock options?",
        outcome: "continue",
        choices: [
          {
            label: "Two fails mean you may now write calls on the stock",
            next: "wrong_write_calls",
          },
          {
            label: "Two fails are still stock context; keep HOLD unless a new fact besides the level shows up",
            next: "success",
          },
        ],
      },
      wrong_write_calls: {
        message:
          "Repeat fails do not list a call. Return to the retry check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "retry",
      },
      success: {
        message:
          "Session complete. You graded a SAMPLE failed breakout on the stock and left the chain uninvented.\n\nNext: Cases → options context (failed-breakout briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsFailedBreakoutSession;

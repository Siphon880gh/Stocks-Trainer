import type { CoachingSession } from "../types";

/** Short versus sell on SAMPLE futures — this class can teach the distinction. */
export const futuresShortVsSellSession: CoachingSession = {
  meta: {
    slug: "futures-short-vs-sell",
    title: "Short versus sell on SAMPLE futures",
    summary:
      "Sell flattens a long you already have. Short is a new bet the future falls. Do not short a rumor as if this were a live desk.",
    topic: "Multi-market decisions",
    tags: ["futures", "short", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: you do not hold a long in this drill. An index future gaps down on a thin rumor.\n\nWhat is the first distinction?",
        outcome: "continue",
        choices: [
          {
            label: "Sell and short are the same word — both mean the price should fall",
            next: "wrong_same",
          },
          {
            label: "Sell closes a long you have. Short is a new downside bet you do not yet have",
            next: "owned",
          },
          {
            label: "This app is a live futures desk, so short size like a prop book",
            next: "wrong_desk",
          },
        ],
      },
      wrong_same: {
        message:
          "They are not the same. Without a long, there is nothing to sell.\n\nReturn to the distinction.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_desk: {
        message:
          "No live contract, margin, or brokerage here. SAMPLE education only.\n\nReturn to the distinction.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      owned: {
        message:
          "You do not own a long. The catalyst is a rumor, not a scheduled print.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Open a short because every gap down is free money",
            next: "wrong_blind_short",
          },
          {
            label: "Hold: do not invent a short on a rumor when you have no long to exit",
            next: "later",
          },
        ],
      },
      wrong_blind_short: {
        message:
          "Blind shorts on rumor gaps skip source quality. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "owned",
      },
      later: {
        message:
          "A later SAMPLE card: you already hold a long from a prior drill, and a scheduled print misses.\n\nWhat is available now that was not before?",
        outcome: "continue",
        choices: [
          {
            label: "Still nothing — futures never let you flatten a long",
            next: "wrong_never_flatten",
          },
          {
            label: "Now sell (flatten) is on the table; short remains a separate, later choice",
            next: "success",
          },
        ],
      },
      wrong_never_flatten: {
        message:
          "If the drill says you hold a long, sell/flatten is the first tool. Return to the later card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "later",
      },
      success: {
        message:
          "Session complete. You named sell versus short on SAMPLE futures without inventing a live book.\n\nNext: Cases → futures (when a brief actually teaches short).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresShortVsSellSession;

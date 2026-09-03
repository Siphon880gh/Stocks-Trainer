import type { CoachingSession } from "../types";

/** Balance-sheet stress on SAMPLE cards. */
export const earningsDebtSession: CoachingSession = {
  meta: {
    slug: "earnings-debt",
    title: "Profit on a thin equity cushion",
    summary:
      "SAMPLE debt versus equity sets how bad a miss can get. Shareholders are last in line.",
    topic: "Financial statements",
    tags: ["equities", "debt", "statements"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE snapshot: a thin profit, liabilities much larger than equity, and the chart already weak.\n\nWhat do you check first?",
        outcome: "continue",
        choices: [
          {
            label: "Celebrate the profit print and ignore the balance sheet",
            next: "wrong_profit_only",
          },
          {
            label: "Ask how much debt sits in front of shareholders if the tape keeps sliding",
            next: "cushion",
          },
          {
            label: "Buy because a green quarter repairs leverage",
            next: "wrong_repairs",
          },
        ],
      },
      wrong_profit_only: {
        message:
          "One green quarter does not rewrite who is last in line.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_repairs: {
        message:
          "Leverage is not repaired by a thin print. Process starts with the cushion.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      cushion: {
        message:
          "Equity is thin versus debt.\n\nHow do you size the decide-and-reveal stance?",
        outcome: "continue",
        choices: [
          {
            label: "Add a full new line because the quarter was profitable",
            next: "wrong_add_full",
          },
          {
            label: "Sell or hold a sized line that can survive a further slide",
            next: "success",
          },
        ],
      },
      wrong_add_full: {
        message:
          "Adding a full line into leverage plus a weak tape skips size. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "cushion",
      },
      success: {
        message:
          "Session complete. You put debt in front of the profit print.\n\nNext: Cases → earnings (too much debt).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default earningsDebtSession;

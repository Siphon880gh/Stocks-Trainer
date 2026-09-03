import type { CoachingSession } from "../types";

/** Shrinking margins vs revenue growth on SAMPLE cards. */
export const earningsMarginsSession: CoachingSession = {
  meta: {
    slug: "earnings-margins",
    title: "Revenue up, margin down",
    summary:
      "Practice naming mix, costs, or pricing when SAMPLE sales grow but profit per dollar shrinks.",
    topic: "Earnings decisions",
    tags: ["equities", "margins", "earnings"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE snapshot: revenue is up, net margin is down, and the stock is choppy near highs.\n\nWhat is the first question?",
        outcome: "continue",
        choices: [
          {
            label: "Ignore margin because sales growth is the whole story",
            next: "wrong_sales_only",
          },
          {
            label: "Ask why the company keeps less profit on each sale",
            next: "why_margin",
          },
          {
            label: "Buy because a bigger top line always lifts the stock later",
            next: "wrong_later",
          },
        ],
      },
      wrong_sales_only: {
        message:
          "Sales without margin can be promotions, mix, or costs catching up. Process starts with why.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_later: {
        message:
          "Hoping the stock lifts later skips the margin check this drill teaches.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      why_margin: {
        message:
          "Name the cause: mix, costs, or weaker pricing.\n\nHow do you use that for a decide-and-reveal stance?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the high because revenue is still growing",
            next: "wrong_chase_high",
          },
          {
            label: "Hold or fade until you can say the margin hit is temporary",
            next: "success",
          },
        ],
      },
      wrong_chase_high: {
        message:
          "Chasing a high on a thinning margin treats growth as a cure. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "why_margin",
      },
      success: {
        message:
          "Session complete. You asked why margin shrank before celebrating sales.\n\nNext: Cases → earnings (shrinking margins).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default earningsMarginsSession;

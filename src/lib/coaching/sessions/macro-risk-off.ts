import type { CoachingSession } from "../types";

/** Stock vs tape in a SAMPLE risk-off tape. */
export const macroRiskOffSession: CoachingSession = {
  meta: {
    slug: "macro-risk-off",
    title: "Stock versus a scared tape",
    summary:
      "When many SAMPLE stocks sell together, decide how much market risk you want — not just one company's story.",
    topic: "Market-wide news",
    tags: ["equities", "macro", "risk-off"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: credit spreads widen, growth names weaken, and your stock had already run.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Treat this as a company-only event and buy the dip",
            next: "wrong_company_only",
          },
          {
            label: "Ask whether this stock is the story or just along for the ride",
            next: "tape",
          },
          {
            label: "Short every name because fear always lasts",
            next: "wrong_always_short",
          },
        ],
      },
      wrong_company_only: {
        message:
          "A group move is not a company filing. Buying the dip skips the market-risk question.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_always_short: {
        message:
          "Blind shorts skip short literacy and treat every scare as permanent.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      tape: {
        message:
          "This is about how much market risk you want.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Add a full new line into the scare",
            next: "wrong_add_scare",
          },
          {
            label: "Cut or hold a sized position; do not add into the scare by default",
            next: "success",
          },
        ],
      },
      wrong_add_scare: {
        message:
          "Adding a full line into a scare is usually not process. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "tape",
      },
      success: {
        message:
          "Session complete. You separated stock from tape.\n\nNext: Cases → market-wide news (market mood).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default macroRiskOffSession;

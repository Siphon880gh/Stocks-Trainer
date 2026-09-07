import type { CoachingSession } from "../types";

/** SAMPLE risk-off on the underlying — still no puts. */
export const optionsRiskOffStockSession: CoachingSession = {
  meta: {
    slug: "options-risk-off-stock",
    title: "Risk-off on the stock, no puts",
    summary:
      "When SAMPLE risk assets sell together, stay on the stock. A scared tape is not a put simulator.",
    topic: "Options context",
    tags: ["options", "options-context", "risk-off", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: the stock dumps with a broad risk-off tape. No company filing. No options chain.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Buy puts because risk-off is an options trade",
            next: "wrong_puts",
          },
          {
            label: "Ask whether this name is the story or just along for the market ride",
            next: "tape",
          },
          {
            label: "Compute put-call ratios by hand so you can still trade volatility",
            next: "wrong_ratio",
          },
        ],
      },
      wrong_puts: {
        message:
          "There is no chain. Risk-off is still a stock-versus-tape question.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_ratio: {
        message:
          "This app does not run options stats. Hand-waving ratios invents a product.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      tape: {
        message:
          "The dump is already extended. No new company fact.\n\nWhat stock stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the dip so you own the bounce like a short-put seller",
            next: "wrong_dip",
          },
          {
            label: "Hold or wait; do not add into the scare, and do not invent a put",
            next: "later",
          },
        ],
      },
      wrong_dip: {
        message:
          "Owning the bounce like a short-put seller still invents options. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "tape",
      },
      later: {
        message:
          "Later SAMPLE: the tape calms, the stock chops. Still no filing.\n\nLast check?",
        outcome: "continue",
        choices: [
          {
            label: "Calm tape means sell volatility with invented strangles",
            next: "wrong_strangle",
          },
          {
            label: "Re-decide on the quieter stock; still no options product",
            next: "success",
          },
        ],
      },
      wrong_strangle: {
        message:
          "Calm is not a strangle. Return to the last check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "later",
      },
      success: {
        message:
          "Session complete. You kept SAMPLE risk-off on the stock and never invented puts.\n\nNext: Cases → options context (risk-off underlying briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsRiskOffStockSession;

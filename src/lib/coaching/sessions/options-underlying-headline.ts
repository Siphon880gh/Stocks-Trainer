import type { CoachingSession } from "../types";

/** SAMPLE company headline on the underlying — still no chain. */
export const optionsUnderlyingHeadlineSession: CoachingSession = {
  meta: {
    slug: "options-underlying-headline",
    title: "Headline on the stock, no chain",
    summary:
      "A SAMPLE product rumor still grades as a stock headline. Do not invent calls because the story sounds optional.",
    topic: "Options context",
    tags: ["options", "options-context", "headline", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE stock: a product rumor, not a filing. The UI has no options chain.\n\nHow do you frame it?",
        outcome: "continue",
        choices: [
          {
            label: "Buy calls because rumors are options events",
            next: "wrong_calls",
          },
          {
            label: "Treat it as a stock headline: rumor versus filing, then priced-in",
            next: "priced",
          },
          {
            label: "Ignore the headline because options context is only for expiry day",
            next: "wrong_only_expiry",
          },
        ],
      },
      wrong_calls: {
        message:
          "There is no chain. A rumor is still a stock-source problem.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_only_expiry: {
        message:
          "Event context includes ordinary headlines on the underlying.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The stock already gapped on the rumor.\n\nWhat stock stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the gap so you participate like an options buyer",
            next: "wrong_chase",
          },
          {
            label: "Hold or wait for a filing; do not chase, and do not invent a call",
            next: "later",
          },
        ],
      },
      wrong_chase: {
        message:
          "Participating like an options buyer still requires a chain you do not have. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      later: {
        message:
          "Later SAMPLE: a filing confirms a smaller version of the rumor. The gap chops.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Now write calls because confirmation arrived",
            next: "wrong_write",
          },
          {
            label: "Re-decide on the stock with the filing; still no listed option",
            next: "success",
          },
        ],
      },
      wrong_write: {
        message:
          "A filing does not list a call. Return to the later card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "later",
      },
      success: {
        message:
          "Session complete. You graded a SAMPLE rumor on the stock and left the chain uninvented.\n\nNext: Cases → options context (headline-on-underlying briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsUnderlyingHeadlineSession;

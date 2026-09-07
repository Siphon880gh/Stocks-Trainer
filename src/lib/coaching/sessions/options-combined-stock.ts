import type { CoachingSession } from "../types";

/** SAMPLE filing plus headline on the underlying — no options overlay. */
export const optionsCombinedStockSession: CoachingSession = {
  meta: {
    slug: "options-combined-stock",
    title: "Filing plus headline, still no chain",
    summary:
      "A SAMPLE beat can disagree with a guidance headline. Match snapshot to path on the stock. Do not invent a ticket.",
    topic: "Options context",
    tags: ["options", "options-context", "combined", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: the quarter beat, and the headline is a guidance cut. The stock chopped. No chain.\n\nWhat do you separate first?",
        outcome: "continue",
        choices: [
          {
            label: "Treat the beat as a call-buy and ignore the cut",
            next: "wrong_calls",
          },
          {
            label: "Match the snapshot (past) to the headline (path) on the stock, then name your clock",
            next: "clock",
          },
          {
            label: "Trust options-style chatter over the filing",
            next: "wrong_chatter",
          },
        ],
      },
      wrong_calls: {
        message:
          "A beat is not a listed call. Combined context is still stock facts.\n\nReturn to what you separate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_chatter: {
        message:
          "Filed facts outrank chatter. Return to what you separate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      clock: {
        message:
          "You named past versus path.\n\nHow does horizon change the grade?",
        outcome: "continue",
        choices: [
          {
            label: "One answer fits every owner — ignore weeks versus years",
            next: "wrong_one",
          },
          {
            label: "HOLD can be fair for a long clock even if sellers win the session; still no chain",
            next: "later",
          },
        ],
      },
      wrong_one: {
        message:
          "Combined cards can award wait when the clock is unnamed. Revisit horizon.",
        outcome: "wrong",
        choices: [],
        rewind_to: "clock",
      },
      later: {
        message:
          "Later SAMPLE: the cut stays on the filing, the beat is old news.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Keep buying the beat because it sounded better",
            next: "wrong_sounded",
          },
          {
            label: "Re-weight toward the path (the cut) on the stock; do not invent options to express it",
            next: "success",
          },
        ],
      },
      wrong_sounded: {
        message:
          "Better-sounding is not the surviving fact. Return to the later card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "later",
      },
      success: {
        message:
          "Session complete. You matched a SAMPLE filing to a headline on the stock with no chain.\n\nNext: Cases → options context (combined underlying briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsCombinedStockSession;

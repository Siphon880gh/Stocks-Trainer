import type { CoachingSession } from "../types";

/** Vol already spiked on the underlying — still no chain. */
export const optionsVolSpikeSession: CoachingSession = {
  meta: {
    slug: "options-vol-spike",
    title: "Vol spike on the stock, no chain",
    summary:
      "When the SAMPLE stock's range explodes, stay on the underlying. This app has no options chain or Greeks.",
    topic: "Options context",
    tags: ["options", "options-context", "vol", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE stock: overnight range explodes after a surprise. The UI still has no options chain.\n\nHow do you frame the vol spike?",
        outcome: "continue",
        choices: [
          {
            label: "Invent a straddle because wide range means cheap options",
            next: "wrong_straddle",
          },
          {
            label: "Treat the spike as a stock-range fact, not a chain simulator",
            next: "range",
          },
          {
            label: "Compute implied vol and delta by hand so you can still trade options",
            next: "wrong_greeks",
          },
        ],
      },
      wrong_straddle: {
        message:
          "There is no chain and no fill. Inventing a straddle skips the product rule.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_greeks: {
        message:
          "This app does not run Greeks. Hand-waving delta is still inventing a chain.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      range: {
        message:
          "The stock already paid a wide overnight range. You have no listed-option overlay.\n\nWhat stock stance matches?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the open to harvest the rest of the vol",
            next: "wrong_harvest",
          },
          {
            label: "Hold or wait; a range explosion is not an automatic stock buy",
            next: "after",
          },
        ],
      },
      wrong_harvest: {
        message:
          "Buying a vol spike on the stock to harvest vol is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "range",
      },
      after: {
        message:
          "Later in the SAMPLE session the range compresses again. Still no chain.\n\nLast check?",
        outcome: "continue",
        choices: [
          {
            label: "Now sell invented puts because calm range means expensive premium is gone",
            next: "wrong_puts",
          },
          {
            label: "Re-decide on the quieter stock tape; still no options product",
            next: "success",
          },
        ],
      },
      wrong_puts: {
        message:
          "Calm tape does not unlock puts. Return to the last check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "after",
      },
      success: {
        message:
          "Session complete. You kept a SAMPLE vol spike on the stock and never invented a chain.\n\nNext: Cases → options context (vol / range briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsVolSpikeSession;

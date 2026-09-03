import type { CoachingSession } from "../types";

/** Producer vs buyer on a SAMPLE supply shock. */
export const supplyShockSession: CoachingSession = {
  meta: {
    slug: "supply-shock",
    title: "Who benefits from a supply shock",
    summary:
      "A SAMPLE supply headline can help producers and hurt buyers. Name which side you are on.",
    topic: "Market-wide news",
    tags: ["equities", "supply", "macro"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: a shipping lane is disrupted. Energy and freight costs jump. Your industrial/energy-linked name was already weak.\n\nFirst question?",
        outcome: "continue",
        choices: [
          {
            label: "Sell because scary geopolitics always means dump the stock",
            next: "wrong_scary",
          },
          {
            label: "Name whether this company sells the scarce thing or buys it",
            next: "side",
          },
          {
            label: "Ignore the headline and trade only yesterday's candle",
            next: "wrong_ignore",
          },
        ],
      },
      wrong_scary: {
        message:
          "Scary words are not a side. Producers can catch a bid on the same headline that hurts buyers.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_ignore: {
        message:
          "A supply shock is the catalyst this drill teaches. Candle-only drops the channel.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      side: {
        message:
          "If this SAMPLE name is a producer, scarcity can help near-term pricing.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Panic-sell because the news sounds global",
            next: "wrong_panic",
          },
          {
            label: "Buy or hold if this name sits on the producer side of the shock",
            next: "success",
          },
        ],
      },
      wrong_panic: {
        message:
          "Global-sounding news is still a channel question. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "side",
      },
      success: {
        message:
          "Session complete. You named producer versus buyer.\n\nNext: Cases → market-wide news (supply shock).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default supplyShockSession;

import type { CoachingSession } from "../types";

/** Options-context vocabulary — underlying only, no Greeks. */
export const optionsLiteracySession: CoachingSession = {
  meta: {
    slug: "options-literacy",
    title: "Name options-context building blocks",
    summary:
      "This class is event and volatility context on the SAMPLE stock. No chain, no Greeks, no brokerage.",
    topic: "Options context",
    tags: ["options", "options-context", "literacy", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "Navigator → Options context on SAMPLE data.\n\nWhat is this class here?",
        outcome: "continue",
        choices: [
          {
            label: "A listed-options trainer with chains, Greeks, and fills",
            next: "wrong_chain",
          },
          {
            label: "Stock decisions around events and range — educational context only",
            next: "greeks",
          },
          {
            label: "Skip it unless you already trade options live",
            next: "wrong_skip",
          },
        ],
      },
      wrong_chain: {
        message:
          "There is no chain and no Greeks engine. Product rule first.\n\nReturn to what this class is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_skip: {
        message:
          "Event-risk context is for anyone who will decide on the stock.\n\nReturn to what this class is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      greeks: {
        message:
          "A brief mentions implied vol in passing.\n\nWhat do you do with that word here?",
        outcome: "continue",
        choices: [
          {
            label: "Compute delta and vega so you can still structure a trade",
            next: "wrong_compute",
          },
          {
            label: "Read it as 'the stock's range may be wide' — still a stock stance, no overlay",
            next: "hold",
          },
        ],
      },
      wrong_compute: {
        message:
          "This app does not compute Greeks. Revisit the word.",
        outcome: "wrong",
        choices: [],
        rewind_to: "greeks",
      },
      hold: {
        message:
          "You have no edge into a known event.\n\nWhat does literacy allow?",
        outcome: "continue",
        choices: [
          {
            label: "You must pick a side so the event counts",
            next: "wrong_must",
          },
          {
            label: "HOLD is the process answer when the only fact is the known event",
            next: "success",
          },
        ],
      },
      wrong_must: {
        message:
          "Forcing a side invents participation. Return to HOLD.",
        outcome: "wrong",
        choices: [],
        rewind_to: "hold",
      },
      success: {
        message:
          "Session complete. You kept options context on the SAMPLE stock: no chain, no Greeks, HOLD allowed.\n\nNext: Training → options-literacy, then Cases → options context.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsLiteracySession;

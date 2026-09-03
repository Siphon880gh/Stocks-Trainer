import type { CoachingSession } from "../types";

/** Options context — event/vol on the underlying, no chain. */
export const optionsContextEventSession: CoachingSession = {
  meta: {
    slug: "options-context-event",
    title: "Event risk without an options chain",
    summary:
      "SAMPLE event and volatility stories on the stock. This app does not trade chains or Greeks.",
    topic: "Options context",
    tags: ["options", "options-context", "equities"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: the stock is coiled going into a known event tomorrow. The UI has no options chain.\n\nHow do you frame this?",
        outcome: "continue",
        choices: [
          {
            label: "Invent a call or put trade because the coil looks cheap",
            next: "wrong_invent_chain",
          },
          {
            label: "Treat this as a stock decision with wider outcomes, not a chain simulator",
            next: "stock",
          },
          {
            label: "Skip the event because options context is only for professionals",
            next: "wrong_skip",
          },
        ],
      },
      wrong_invent_chain: {
        message:
          "There is no chain, no Greeks, and no fills. Inventing a listed option skips the product rule.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_skip: {
        message:
          "Event-risk context is for anyone who will decide on the stock. It is still SAMPLE education.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      stock: {
        message:
          "You have no directional edge into the event.\n\nWhat stock stance matches?",
        outcome: "continue",
        choices: [
          {
            label: "Force a buy so you participate in the gap",
            next: "wrong_force",
          },
          {
            label: "Hold unless a new fact besides the known event shows up",
            next: "success",
          },
        ],
      },
      wrong_force: {
        message:
          "No edge into a binary event is a hold on the stock. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "stock",
      },
      success: {
        message:
          "Session complete. You kept options context on the stock, with no chain.\n\nNext: Cases → options context.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsContextEventSession;

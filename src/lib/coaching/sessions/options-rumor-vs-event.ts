import type { CoachingSession } from "../types";

/** SAMPLE rumor versus scheduled event on the underlying. */
export const optionsRumorVsEventSession: CoachingSession = {
  meta: {
    slug: "options-rumor-vs-event",
    title: "Rumor versus a scheduled event, no chain",
    summary:
      "Chat about a SAMPLE event is not the scheduled print. Stay on the stock and wait for the official card.",
    topic: "Options context",
    tags: ["options", "options-context", "rumor", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: chat says the known event will be a blowout. The event is tomorrow. The stock already ran. No chain.\n\nFirst hygiene?",
        outcome: "continue",
        choices: [
          {
            label: "Treat chat as the event result and buy calls",
            next: "wrong_calls",
          },
          {
            label: "Separate rumor versus the scheduled event, then ask if the run already priced the chat",
            next: "priced",
          },
          {
            label: "Skip waiting because options context means you must be in before events",
            next: "wrong_must",
          },
        ],
      },
      wrong_calls: {
        message:
          "Chat is not the print, and there are no calls.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_must: {
        message:
          "You do not have to be in. HOLD is allowed into a known event.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The run already embeds the rumor. Tomorrow has not printed.\n\nWhat stock stance fits tonight?",
        outcome: "continue",
        choices: [
          {
            label: "Buy so you are positioned for whatever the event does",
            next: "wrong_position",
          },
          {
            label: "Hold until the scheduled event; do not pay the rumor",
            next: "after",
          },
        ],
      },
      wrong_position: {
        message:
          "Positioning for an unknown print is still a chase. Revisit tonight's stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      after: {
        message:
          "SAMPLE next day: the event is ordinary, not a blowout. The stock gives back the run.\n\nWhat changed?",
        outcome: "continue",
        choices: [
          {
            label: "Nothing — you should have bought calls on the chat",
            next: "wrong_should",
          },
          {
            label: "The official event is the new fact; re-decide on the stock, still no chain",
            next: "success",
          },
        ],
      },
      wrong_should: {
        message:
          "Yesterday's chat was not the event. Return to what changed.",
        outcome: "wrong",
        choices: [],
        rewind_to: "after",
      },
      success: {
        message:
          "Session complete. You waited for the scheduled SAMPLE event instead of paying the rumor run.\n\nNext: Cases → options context (rumor vs event briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsRumorVsEventSession;

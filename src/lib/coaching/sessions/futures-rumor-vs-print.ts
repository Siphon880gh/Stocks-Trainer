import type { CoachingSession } from "../types";

/** SAMPLE rumor versus scheduled inventory / crop / rates print. */
export const futuresRumorVsPrintSession: CoachingSession = {
  meta: {
    slug: "futures-rumor-vs-print",
    title: "Rumor versus a scheduled futures print",
    summary:
      "Chat about barrels or bushels is not the scheduled SAMPLE print. Wait for the official card.",
    topic: "Multi-market decisions",
    tags: ["futures", "rumor", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE crude: chat says inventories will crush. The scheduled inventory print is tomorrow. Front month already jumped the other way.\n\nFirst hygiene?",
        outcome: "continue",
        choices: [
          {
            label: "Treat chat as the print and chase the rumor spike",
            next: "wrong_chat",
          },
          {
            label: "Separate rumor versus the scheduled print, then ask if the move is already in",
            next: "priced",
          },
          {
            label: "Skip the brief because futures are only candles",
            next: "wrong_candles",
          },
        ],
      },
      wrong_chat: {
        message:
          "Chat is not the official print. You skipped source humility.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_candles: {
        message:
          "The rumor-versus-print brief is the drill. Candle-only drops it.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The spike already embeds the chat. Tomorrow's print has not happened.\n\nWhat stance fits tonight?",
        outcome: "continue",
        choices: [
          {
            label: "Buy so you are positioned for whatever the print does",
            next: "wrong_position",
          },
          {
            label: "Hold until the scheduled print; do not pay the rumor",
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
          "SAMPLE next day: the official inventory print is larger than chat said. Price dumps.\n\nWhat changed?",
        outcome: "continue",
        choices: [
          {
            label: "Nothing — you should have chased yesterday's chat",
            next: "wrong_should_chase",
          },
          {
            label: "The official print is the new fact; re-decide on that tape, still SAMPLE",
            next: "success",
          },
        ],
      },
      wrong_should_chase: {
        message:
          "Yesterday's chat was not the print. Return to what changed.",
        outcome: "wrong",
        choices: [],
        rewind_to: "after",
      },
      success: {
        message:
          "Session complete. You waited for the scheduled SAMPLE print instead of chasing chat.\n\nNext: Cases → futures (rumor vs inventory/crop prints).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresRumorVsPrintSession;

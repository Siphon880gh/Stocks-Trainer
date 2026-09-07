import type { CoachingSession } from "../types";

/** SAMPLE FX rumor versus official print or scheduled event. */
export const forexRumorVsPrintSession: CoachingSession = {
  meta: {
    slug: "forex-rumor-vs-print",
    title: "Rumor versus official FX print",
    summary:
      "Chat about a SAMPLE intervention or leak is not the official print. Wait for the scheduled card.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "rumor", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE USD/JPY: chat says intervention is coming. No official statement. The pair already dumped.\n\nFirst hygiene?",
        outcome: "continue",
        choices: [
          {
            label: "Treat chat as confirmed intervention and chase yen",
            next: "wrong_chat",
          },
          {
            label: "Separate rumor versus official print, then ask if the dump already priced the chat",
            next: "priced",
          },
          {
            label: "This app will execute the intervention for you",
            next: "wrong_app",
          },
        ],
      },
      wrong_chat: {
        message:
          "Chat is not a ministry statement. You skipped source rank.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_app: {
        message:
          "No live desk, no intervention button. SAMPLE education only.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The dump already embeds the rumor. Nothing official yet.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Keep selling USD/JPY so you are ready if the rumor is true",
            next: "wrong_ready",
          },
          {
            label: "Hold until an official print; do not pay the rumor dump",
            next: "after",
          },
        ],
      },
      wrong_ready: {
        message:
          "Being ready is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      after: {
        message:
          "Later SAMPLE: officials deny the rumor. USD/JPY retraces.\n\nWhat changed?",
        outcome: "continue",
        choices: [
          {
            label: "Nothing — denials always lie, keep the chase",
            next: "wrong_always_lie",
          },
          {
            label: "The official line is a new fact; re-decide, still SAMPLE",
            next: "success",
          },
        ],
      },
      wrong_always_lie: {
        message:
          "Process re-decides on the official card. Return to what changed.",
        outcome: "wrong",
        choices: [],
        rewind_to: "after",
      },
      success: {
        message:
          "Session complete. You waited for an official SAMPLE line instead of chasing intervention chat.\n\nNext: Cases → forex (rumor vs official briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexRumorVsPrintSession;

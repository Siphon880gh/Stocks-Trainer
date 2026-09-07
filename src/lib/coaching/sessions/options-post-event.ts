import type { CoachingSession } from "../types";

/** After the known event prints — re-decide on the stock. */
export const optionsPostEventSession: CoachingSession = {
  meta: {
    slug: "options-post-event",
    title: "After the event, still no chain",
    summary:
      "Once a SAMPLE known event prints, the coil is over. Re-decide on the stock. Do not keep an invented options ticket.",
    topic: "Options context",
    tags: ["options", "options-context", "event", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: the known event printed overnight. The stock gapped. You never had a chain here.\n\nFirst move after the print?",
        outcome: "continue",
        choices: [
          {
            label: "Keep the pre-event coil thesis as if the event had not happened",
            next: "wrong_stale_coil",
          },
          {
            label: "Treat the print as a new stock tape and drop the pre-event wait",
            next: "new_tape",
          },
          {
            label: "Exercise imaginary calls because the gap went your way",
            next: "wrong_exercise",
          },
        ],
      },
      wrong_stale_coil: {
        message:
          "The coil was about unknown outcome. After the print, that wait is stale.\n\nReturn to the first move.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_exercise: {
        message:
          "There were no calls. A gap does not create a listed option after the fact.\n\nReturn to the first move.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      new_tape: {
        message:
          "The gap already contains the event. No new fact besides the print.\n\nWhat stock stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the gap so you participate in the rest of the event",
            next: "wrong_chase_gap",
          },
          {
            label: "Hold or wait; the event is now priced unless a second fact appears",
            next: "settle",
          },
        ],
      },
      wrong_chase_gap: {
        message:
          "Chasing a post-event gap is paying for news that already printed. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "new_tape",
      },
      settle: {
        message:
          "SAMPLE midday: the stock mean-reverts part of the gap while the fact stays the same.\n\nWhat is that settle teaching?",
        outcome: "continue",
        choices: [
          {
            label: "The revert proves the event was fake, so reverse with size",
            next: "wrong_fake",
          },
          {
            label: "A settle can be digestion of a known print, not a new catalyst; keep HOLD unless facts change",
            next: "success",
          },
        ],
      },
      wrong_fake: {
        message:
          "Digestion is not a fake event. Return to what the settle teaches.",
        outcome: "wrong",
        choices: [],
        rewind_to: "settle",
      },
      success: {
        message:
          "Session complete. You re-decided on the post-event SAMPLE stock and never invented a ticket to expire.\n\nNext: Cases → options context (post-event settle briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsPostEventSession;

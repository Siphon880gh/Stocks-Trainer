import type { CoachingSession } from "../types";

/** SAMPLE horizon mismatch — event thesis vs panic timer, still no chain. */
export const optionsHorizonMismatchSession: CoachingSession = {
  meta: {
    slug: "options-horizon-mismatch",
    title: "Match the clock on event context",
    summary:
      "A SAMPLE event thesis needs a confirmation window. A five-minute abandon clock mismatches the story — and still is not an options expiry.",
    topic: "Options context",
    tags: ["options", "options-context", "horizon", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: you chose HOLD into a known event because you had no edge. After the print, the stock gaps and chops.\n\nWhat clock were you using?",
        outcome: "continue",
        choices: [
          {
            label: "An options expiry you invented so the event would 'decay'",
            next: "wrong_expiry",
          },
          {
            label: "A stock confirmation window (hours to a session), not an invented expiry",
            next: "window",
          },
          {
            label: "No clock — event context does not need a horizon",
            next: "wrong_no_clock",
          },
        ],
      },
      wrong_expiry: {
        message:
          "There is no expiry to decay. Inventing one skips the product rule.\n\nReturn to the clock.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_no_clock: {
        message:
          "Even HOLD needs a named window so you know when to re-decide.\n\nReturn to the clock.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      window: {
        message:
          "The gap is 20 minutes old and still chopping.\n\nWhat does a session-scale window say?",
        outcome: "continue",
        choices: [
          {
            label: "Abandon in five minutes if it does not trend",
            next: "wrong_five",
          },
          {
            label: "Let the session digest the print; five minutes is a panic timer",
            next: "redecide",
          },
        ],
      },
      wrong_five: {
        message:
          "A five-minute abandon mismatches an event thesis. Revisit the window.",
        outcome: "wrong",
        choices: [],
        rewind_to: "window",
      },
      redecide: {
        message:
          "SAMPLE later: a second fact besides the event appears (a filing update).\n\nWhat happens to the old HOLD?",
        outcome: "continue",
        choices: [
          {
            label: "Keep the old HOLD forever because you already chose it",
            next: "wrong_forever",
          },
          {
            label: "Re-decide on the new fact; the old event clock is done",
            next: "success",
          },
        ],
      },
      wrong_forever: {
        message:
          "HOLD is not a lifetime pass. Return to the second-fact check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "redecide",
      },
      success: {
        message:
          "Session complete. You matched a SAMPLE event thesis to a session window, not an invented expiry or a panic timer.\n\nNext: Cases → options context (horizon / post-event briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsHorizonMismatchSession;

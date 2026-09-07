import type { CoachingSession } from "../types";

/** SAMPLE pre-event chase — the coil is not a buy signal. */
export const optionsPreEventChaseSession: CoachingSession = {
  meta: {
    slug: "options-pre-event-chase",
    title: "Do not chase the pre-event coil",
    summary:
      "A SAMPLE coil into a known event is often a wait. Tight range is not a reason to invent a debit spread.",
    topic: "Options context",
    tags: ["options", "options-context", "chase", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE stock: range compresses into a known event tomorrow. People in chat call it a coil. No chain.\n\nFirst check?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the coil because tight range always explodes in your favor",
            next: "wrong_always",
          },
          {
            label: "Ask whether you have a directional edge besides the known event",
            next: "edge",
          },
          {
            label: "Buy a debit spread to express the coil cheaply",
            next: "wrong_spread",
          },
        ],
      },
      wrong_always: {
        message:
          "Coils can break either way. You skipped the edge question.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_spread: {
        message:
          "There is no spread to buy. Inventing one skips the product rule.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      edge: {
        message:
          "No new fact besides the known event. The coil is already obvious on the chart.\n\nWhat stock stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the last quiet bar so you are in before the gap",
            next: "wrong_last_bar",
          },
          {
            label: "Hold; a coil without edge is a pass, not a must-own",
            next: "after",
          },
        ],
      },
      wrong_last_bar: {
        message:
          "The last quiet bar is still the coil. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "edge",
      },
      after: {
        message:
          "SAMPLE next day: the event prints, the stock gaps, then settles.\n\nDid skipping the coil fail the drill?",
        outcome: "continue",
        choices: [
          {
            label: "Yes — you must always be in before events",
            next: "wrong_must",
          },
          {
            label: "No — the drill grades process; HOLD into a no-edge coil is the point",
            next: "success",
          },
        ],
      },
      wrong_must: {
        message:
          "Participation is not the grade. Return to whether skipping failed.",
        outcome: "wrong",
        choices: [],
        rewind_to: "after",
      },
      success: {
        message:
          "Session complete. You did not chase a SAMPLE coil and did not invent a spread.\n\nNext: Cases → options context (pre-event coil briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsPreEventChaseSession;

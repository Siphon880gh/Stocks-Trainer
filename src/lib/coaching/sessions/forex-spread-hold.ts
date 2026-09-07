import type { CoachingSession } from "../types";

/** SAMPLE pip / spread humility — HOLD is a valid FX answer. */
export const forexSpreadHoldSession: CoachingSession = {
  meta: {
    slug: "forex-spread-hold",
    title: "When HOLD is the FX answer",
    summary:
      "On SAMPLE currency tapes, a wide spread and no catalyst can make doing nothing the process choice.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "spread", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: EUR/USD is quiet. The brief names a wide spread and no scheduled print. This is not a live dealing desk.\n\nFirst humility check?",
        outcome: "continue",
        choices: [
          {
            label: "Force a buy or sell so the case feels like a real FX trade",
            next: "wrong_force",
          },
          {
            label: "Ask whether the spread and missing catalyst leave enough room for a decision",
            next: "room",
          },
          {
            label: "Assume majors never need HOLD because they always trend",
            next: "wrong_always_trend",
          },
        ],
      },
      wrong_force: {
        message:
          "Forcing a side to feel active skips spread humility. HOLD is allowed here.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_always_trend: {
        message:
          "Majors chop. A quiet SAMPLE tape is often a hold, not a trend lecture.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      room: {
        message:
          "The spread is wide relative to the day's range. No new fact arrived.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Scalp a few pips anyway because the pair is liquid",
            next: "wrong_scalp",
          },
          {
            label: "Hold: pass when cost and catalyst do not support a side",
            next: "cross",
          },
        ],
      },
      wrong_scalp: {
        message:
          "Liquidity is not a reason to pay a wide SAMPLE spread. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "room",
      },
      cross: {
        message:
          "Same quiet tape, but now the brief is a thin cross instead of a major.\n\nDoes HOLD still apply?",
        outcome: "continue",
        choices: [
          {
            label: "Crosses must be traded because they move more",
            next: "wrong_cross_must",
          },
          {
            label: "A thin cross with a wide spread is an even stronger hold",
            next: "success",
          },
        ],
      },
      wrong_cross_must: {
        message:
          "More movement can mean worse spreads, not a must-trade. Return to the cross check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "cross",
      },
      success: {
        message:
          "Session complete. You treated HOLD as a first-class FX answer when spread and catalyst fail the test.\n\nNext: Cases → forex (quiet / spread briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexSpreadHoldSession;

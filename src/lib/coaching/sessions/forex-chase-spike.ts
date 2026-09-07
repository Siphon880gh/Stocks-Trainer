import type { CoachingSession } from "../types";

/** SAMPLE major pair spike with no print — chase vs wait. */
export const forexChaseSpikeSession: CoachingSession = {
  meta: {
    slug: "forex-chase-spike",
    title: "Chase vs wait a SAMPLE FX spike",
    summary:
      "A thin SAMPLE spike on a major with no scheduled print is a wait, not a must-trade.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "chase", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE GBP/USD spikes 80 pips in minutes. No print, no speaker on the brief. Spread is wide.\n\nFirst check?",
        outcome: "continue",
        choices: [
          {
            label: "Chase because majors that spike always continue",
            next: "wrong_always",
          },
          {
            label: "Ask catalyst quality and whether the spike is already in the tape",
            next: "quality",
          },
          {
            label: "This is a live London desk — size through the spread",
            next: "wrong_desk",
          },
        ],
      },
      wrong_always: {
        message:
          "Spikes without a named catalyst often fade. You skipped quality.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_desk: {
        message:
          "No live desk or fill. SAMPLE education only.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      quality: {
        message:
          "The brief still has no catalyst. The spread is wide relative to the day's prior range.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Fade immediately with size because all spikes fail",
            next: "wrong_blind_fade",
          },
          {
            label: "Hold: no catalyst plus a wide spread is a pass",
            next: "later",
          },
        ],
      },
      wrong_blind_fade: {
        message:
          "Blind fades skip the same humility as blind chases. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "quality",
      },
      later: {
        message:
          "A later SAMPLE bar gives back half the spike. Still no catalyst.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "The giveback is your signal to chase the other way",
            next: "wrong_other_way",
          },
          {
            label: "Giveback without a new fact is still HOLD, not a new trade",
            next: "success",
          },
        ],
      },
      wrong_other_way: {
        message:
          "Flipping chase direction is still a chase. Return to the later bar.",
        outcome: "wrong",
        choices: [],
        rewind_to: "later",
      },
      success: {
        message:
          "Session complete. You passed on a SAMPLE spike that had no catalyst and a wide spread.\n\nNext: Cases → forex (spike / no-print briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexChaseSpikeSession;

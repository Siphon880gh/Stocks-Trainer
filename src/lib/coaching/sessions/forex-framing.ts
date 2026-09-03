import type { CoachingSession } from "../types";

/** SAMPLE FX framing — not a live FX desk. */
export const forexFramingSession: CoachingSession = {
  meta: {
    slug: "forex-framing",
    title: "Frame a SAMPLE forex decision",
    summary:
      "Same decide-and-reveal process as equities, on SAMPLE currency tapes. Not a live FX desk.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "multi-market", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "You open Navigator → Forex → DECIDE_CASES on SAMPLE data.\n\nFirst framing choice?",
        outcome: "continue",
        choices: [
          {
            label: "Treat forex packs as a live dealing desk with fills",
            next: "wrong_desk",
          },
          {
            label: "Same decide→reveal process as equities, on a SAMPLE currency pair",
            next: "process",
          },
          {
            label: "Skip data-print literacy because FX is only charts",
            next: "wrong_skip_print",
          },
        ],
      },
      wrong_desk: {
        message:
          "No live desk, spreads, or brokerage here — SAMPLE educational packs only.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_skip_print: {
        message:
          "Many SAMPLE FX briefs are data prints and risk mood. Charts still matter; so does the brief.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      process: {
        message:
          "Brief shows a thin rumor spike on EUR/USD.\n\nHow do you act under anti-hindsight rules?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the spike because FX always follows the first tick",
            next: "wrong_chase",
          },
          {
            label: "Lock BUY/SELL/HOLD on the pre tape, then read the process debrief",
            next: "success",
          },
        ],
      },
      wrong_chase: {
        message:
          "Low-quality spikes invite waiting or fading, not chasing. Revisit how you act.",
        outcome: "wrong",
        choices: [],
        rewind_to: "process",
      },
      success: {
        message:
          "Session complete. Forex here = SAMPLE decide packs with the same process rules.\n\nNext: Navigator → Forex DECIDE_CASES, or Cases → forex.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexFramingSession;

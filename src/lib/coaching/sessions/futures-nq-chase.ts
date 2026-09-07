import type { CoachingSession } from "../types";

/** SAMPLE NQ-style spike — chase vs wait on an already-extended index. */
export const futuresNqChaseSession: CoachingSession = {
  meta: {
    slug: "futures-nq-chase",
    title: "Chase vs fade a SAMPLE NQ spike",
    summary:
      "An extended SAMPLE tech-index jump is still a chase-versus-wait problem, not a live NQ desk.",
    topic: "Multi-market decisions",
    tags: ["futures", "chase", "index", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE NQ-style future: overnight gap +3% on a cluster of mega-cap headlines. The jump is already in the tape.\n\nFirst check?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the open so you do not miss the rest of the tech melt-up",
            next: "wrong_chase",
          },
          {
            label: "Ask whether the headlines are already priced into the gap",
            next: "priced",
          },
          {
            label: "Treat NQ as a live day-trading simulator with fills",
            next: "wrong_desk",
          },
        ],
      },
      wrong_chase: {
        message:
          "Paying an extended gap is classic chase. You skipped priced-in.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_desk: {
        message:
          "No live NQ desk or brokerage here. SAMPLE education only.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The gap already embeds a lot of optimism. No new filing analog on an index.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy more because mega-caps never fade",
            next: "wrong_never_fade",
          },
          {
            label: "Hold or fade; an index gap is not a must-own melt-up",
            next: "horizon",
          },
        ],
      },
      wrong_never_fade: {
        message:
          "Quality names inside an index do not cancel a priced-in gap. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      horizon: {
        message:
          "You waited. Last check: which clock matches a gap-versus-wait thesis?",
        outcome: "continue",
        choices: [
          {
            label: "Abandon in two minutes if NQ does not fade",
            next: "wrong_timer",
          },
          {
            label: "Give the gap a session-scale confirmation window, not a panic timer",
            next: "success",
          },
        ],
      },
      wrong_timer: {
        message:
          "A two-minute clock mismatches a priced-in gap thesis. Return to horizon.",
        outcome: "wrong",
        choices: [],
        rewind_to: "horizon",
      },
      success: {
        message:
          "Session complete. You refused to chase a SAMPLE NQ gap that was already in the tape.\n\nNext: Cases → futures (index chase briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresNqChaseSession;

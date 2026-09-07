import type { CoachingSession } from "../types";

/** SAMPLE unexpected central-bank comment — headline, not a 10-K. */
export const forexCbHeadlineSession: CoachingSession = {
  meta: {
    slug: "forex-cb-headline",
    title: "Central-bank headline on SAMPLE FX",
    summary:
      "An unexpected SAMPLE quote from a central banker is still a headline. Source quality and priced-in still rule.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "headline", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: a Fed speaker sounds hawkish off-script. EUR/USD gaps. This is not a live wire service.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Treat every quote as a rate decision and chase the gap",
            next: "wrong_as_decision",
          },
          {
            label: "Ask speaker versus decision, then whether the gap already priced the quote",
            next: "priced",
          },
          {
            label: "Ignore the headline and trade only the candle wick",
            next: "wrong_wick",
          },
        ],
      },
      wrong_as_decision: {
        message:
          "A speaker is not the committee decision. You skipped source rank.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_wick: {
        message:
          "The headline is the catalyst this drill teaches.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The gap is already large. No scheduled decision today.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the dollar so you do not miss the rest of the quote",
            next: "wrong_chase",
          },
          {
            label: "Hold or wait; a speaker gap is often fade-or-wait, not a must-chase",
            next: "confirm",
          },
        ],
      },
      wrong_chase: {
        message:
          "Chasing a speaker gap is paying for a quote that may be walked back. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      confirm: {
        message:
          "Later SAMPLE: the same speaker clarifies and the gap mean-reverts.\n\nWhat did waiting protect?",
        outcome: "continue",
        choices: [
          {
            label: "Nothing — you should have sized like a live desk on the first quote",
            next: "wrong_desk",
          },
          {
            label: "Process: wait until a decision or a durable second fact, still SAMPLE",
            next: "success",
          },
        ],
      },
      wrong_desk: {
        message:
          "There is no live desk. Return to what waiting protected.",
        outcome: "wrong",
        choices: [],
        rewind_to: "confirm",
      },
      success: {
        message:
          "Session complete. You ranked a SAMPLE speaker below a decision and refused to chase the gap.\n\nNext: Cases → forex (headline / CB-comment briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexCbHeadlineSession;

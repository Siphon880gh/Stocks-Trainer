import type { CoachingSession } from "../types";

/** SAMPLE index future vs a scared tape — not one company's story. */
export const futuresIndexRiskOffSession: CoachingSession = {
  meta: {
    slug: "futures-index-risk-off",
    title: "Index future versus a scared tape",
    summary:
      "A SAMPLE ES-style dump is market risk on the index, not a single-stock filing. Do not treat it as one name.",
    topic: "Multi-market decisions",
    tags: ["futures", "risk-off", "index", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE ES-style index future: credit spreads widen and the front month dumps with global risk-off. Not a live contract.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Treat this as one company's miss and buy the dip like a stock",
            next: "wrong_one_name",
          },
          {
            label: "Ask whether the index is the risk story, not a single filing",
            next: "tape",
          },
          {
            label: "Short every commodity because fear always lasts",
            next: "wrong_every_commodity",
          },
        ],
      },
      wrong_one_name: {
        message:
          "An index future is a basket tape. Buying the dip as if ES were one 10-K skips market risk.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_every_commodity: {
        message:
          "Index risk-off is not an automatic sell on crude or corn. Keep the instrument.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      tape: {
        message:
          "The dump is already extended. You have no live desk.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Add a full new line into the scare so you own the bounce",
            next: "wrong_add",
          },
          {
            label: "Hold or wait; do not add a full line into an extended index scare",
            next: "horizon",
          },
        ],
      },
      wrong_add: {
        message:
          "Adding size into an extended scare is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "tape",
      },
      horizon: {
        message:
          "A later SAMPLE bar chops. The brief is still risk-off, no new print.\n\nLast check?",
        outcome: "continue",
        choices: [
          {
            label: "Chop means the scare is over — buy the index immediately",
            next: "wrong_chop",
          },
          {
            label: "Chop without a new fact is still a hold; name the clock before forcing a side",
            next: "success",
          },
        ],
      },
      wrong_chop: {
        message:
          "Chop is not a new catalyst. Return to the last check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "horizon",
      },
      success: {
        message:
          "Session complete. You treated SAMPLE ES as market risk, not one stock.\n\nNext: Cases → futures (index / risk-off briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresIndexRiskOffSession;

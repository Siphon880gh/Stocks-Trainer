import type { CoachingSession } from "../types";

/** Outlook cut after a SAMPLE quarter. */
export const earningsGuidanceSession: CoachingSession = {
  meta: {
    slug: "earnings-guidance",
    title: "When the outlook is cut",
    summary:
      "A lower SAMPLE outlook resets the path. Match your action to the new numbers, not last quarter alone.",
    topic: "Earnings decisions",
    tags: ["equities", "guidance", "earnings"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: the latest quarter beat, and the company cut next-year growth.\n\nWhich clock are you on?",
        outcome: "continue",
        choices: [
          {
            label: "Only last quarter — a beat means the story is intact",
            next: "wrong_quarter_only",
          },
          {
            label: "The outlook is the path; last quarter is already in the rear-view",
            next: "path",
          },
          {
            label: "Ignore the cut because utilities and banks never reprice",
            next: "wrong_never",
          },
        ],
      },
      wrong_quarter_only: {
        message:
          "A beat can still fail a forward thesis if the path is reset.\n\nReturn to which clock you are on.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_never: {
        message:
          "Any SAMPLE name can reprice on a slower path. Sector labels are not a hall pass.\n\nReturn to which clock you are on.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      path: {
        message:
          "The cut is the new path.\n\nWhat stance matches that?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the dip because the quarter was green",
            next: "wrong_buy_dip",
          },
          {
            label: "Sell or hold only if your thesis still works with the slower path",
            next: "success",
          },
        ],
      },
      wrong_buy_dip: {
        message:
          "Buying a dip because last quarter was green ignores the cut. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "path",
      },
      success: {
        message:
          "Session complete. You treated the outlook as the path.\n\nNext: Cases → earnings (weaker outlook) and combined beat-plus-cut stories.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default earningsGuidanceSession;

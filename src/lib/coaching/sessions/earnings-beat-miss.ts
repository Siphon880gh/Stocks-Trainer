import type { CoachingSession } from "../types";

/** Beat vs miss on SAMPLE earnings — profitable companies can still miss. */
export const earningsBeatMissSession: CoachingSession = {
  meta: {
    slug: "earnings-beat-miss",
    title: "Beat vs miss on a SAMPLE report",
    summary:
      "A profitable SAMPLE company can still miss. Compare the print to what was already expected.",
    topic: "Earnings decisions",
    tags: ["equities", "earnings", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: sales met the run rate, profit per share came in weaker, and the stock had already been rising into the print.\n\nWhat do you check first?",
        outcome: "continue",
        choices: [
          {
            label: "Treat profit as proof the report was a success",
            next: "wrong_profit_ok",
          },
          {
            label: "Compare the print to what the tape already expected",
            next: "expected",
          },
          {
            label: "Buy the dip because profitable companies always bounce",
            next: "wrong_always_bounce",
          },
        ],
      },
      wrong_profit_ok: {
        message:
          "Profitability is not the same as beating what people already paid for. A miss can still be a miss.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_always_bounce: {
        message:
          "Buying every dip because the company is profitable skips the expectation check.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      expected: {
        message:
          "The tape had already risen into the print. The miss is versus that hope.\n\nWhat stance matches a process-first response?",
        outcome: "continue",
        choices: [
          {
            label: "Add risk because the company is still profitable",
            next: "wrong_add_risk",
          },
          {
            label: "Sell or hold a sized line until the thesis still works with the miss",
            next: "success",
          },
        ],
      },
      wrong_add_risk: {
        message:
          "Adding into a miss after a run pays for hope that just failed. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "expected",
      },
      success: {
        message:
          "Session complete. You compared the print to what was already expected.\n\nNext: Cases → earnings (beat or miss).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default earningsBeatMissSession;

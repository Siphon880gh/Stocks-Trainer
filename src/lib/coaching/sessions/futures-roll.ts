import type { CoachingSession } from "../types";

export const futuresRollSession: CoachingSession = {
  meta: {
    slug: "futures-roll",
    title: "Contango, backwardation, and the roll",
    summary:
      "Name SAMPLE futures structure before guessing ticks. Contango and backwardation are costs to know, not automatic trades.",
    topic: "Multi-market decisions",
    tags: ["futures", "roll", "multi-market", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE crude future: the front month is richer than the next month (contango). A roll window is near.\n\nWhat is contango here?",
        outcome: "continue",
        choices: [
          {
            label: "A live calculator that tells you the exact roll profit",
            next: "wrong_calc",
          },
          {
            label: "A structure: front month costs more than the next month",
            next: "structure",
          },
          {
            label: "An automatic sell signal on every commodity future",
            next: "wrong_auto_sell",
          },
        ],
      },
      wrong_calc: {
        message:
          "This app has no live roll calculator, fills, or brokerage. Structure first.\n\nReturn to what contango is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_auto_sell: {
        message:
          "Contango is a cost to name, not an automatic sell. Time frame still rules.\n\nReturn to what contango is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      structure: {
        message:
          "The next SAMPLE tape is backwardation: the front month is cheaper than the next.\n\nHow do you treat the roll?",
        outcome: "continue",
        choices: [
          {
            label: "Treat backwardation as an automatic buy and skip the brief",
            next: "wrong_auto_buy",
          },
          {
            label: "Name the structure, then decide if your time frame cares about the roll",
            next: "success",
          },
        ],
      },
      wrong_auto_buy: {
        message:
          "Backwardation is also a structure, not a buy button. Revisit how you treat the roll.",
        outcome: "wrong",
        choices: [],
        rewind_to: "structure",
      },
      success: {
        message:
          "Session complete. You named contango and backwardation without inventing a live desk.\n\nNext: Cases → futures (roll / structure briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresRollSession;

import type { CoachingSession } from "../types";

/** SAMPLE data print plus a risk-off headline on the same pair. */
export const forexCombinedSession: CoachingSession = {
  meta: {
    slug: "forex-combined",
    title: "Print plus headline on SAMPLE FX",
    summary:
      "A SAMPLE jobs print can disagree with a risk-off headline. Match fact to mood, then name your clock.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "combined", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: U.S. payrolls beat, and the headline is a risk-off scare. EUR/USD chopped both ways.\n\nWhat do you separate first?",
        outcome: "continue",
        choices: [
          {
            label: "Treat the scare headline as the whole story and ignore the print",
            next: "wrong_headline",
          },
          {
            label: "Match the print (dollar/rates) to the headline (mood), then name your clock",
            next: "clock",
          },
          {
            label: "Average the two moves and call that the answer",
            next: "wrong_average",
          },
        ],
      },
      wrong_headline: {
        message:
          "A beat can still support the dollar even while mood is ugly. Return to what you separate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_average: {
        message:
          "Averaging hides which channel you are grading. Return to what you separate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      clock: {
        message:
          "You named print versus mood.\n\nHow does horizon change the grade?",
        outcome: "continue",
        choices: [
          {
            label: "One side fits every clock — ignore session versus days",
            next: "wrong_one",
          },
          {
            label: "HOLD can be fair when the two facts fight on a short clock",
            next: "later",
          },
        ],
      },
      wrong_one: {
        message:
          "Combined FX cards often award wait. Revisit horizon.",
        outcome: "wrong",
        choices: [],
        rewind_to: "clock",
      },
      later: {
        message:
          "Later SAMPLE: the scare fades, the payrolls beat remains.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Keep the scare thesis because it made a bigger candle",
            next: "wrong_candle_size",
          },
          {
            label: "Re-weight toward the print that is still on the card; still not a live desk",
            next: "success",
          },
        ],
      },
      wrong_candle_size: {
        message:
          "Bigger candles are not the surviving fact. Return to the later card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "later",
      },
      success: {
        message:
          "Session complete. You matched a SAMPLE print to a mood headline and named the clock.\n\nNext: Cases → forex (combined briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexCombinedSession;

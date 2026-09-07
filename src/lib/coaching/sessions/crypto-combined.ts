import type { CoachingSession } from "../types";

/** SAMPLE on-chain or scheduled fact plus a social headline. */
export const cryptoCombinedSession: CoachingSession = {
  meta: {
    slug: "crypto-combined",
    title: "Print plus headline on SAMPLE crypto",
    summary:
      "A SAMPLE unlock or scheduled fact can disagree with a viral headline. Match fact to chat, then name your clock.",
    topic: "Multi-market decisions",
    tags: ["crypto", "combined", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: a known token unlock prints extra float, and the headline is a celebrity endorsement. Price chopped.\n\nWhat do you separate first?",
        outcome: "continue",
        choices: [
          {
            label: "Treat the celebrity headline as the whole story and ignore the unlock",
            next: "wrong_celeb",
          },
          {
            label: "Match the unlock (supply fact) to the headline (attention), then name your clock",
            next: "clock",
          },
          {
            label: "Trust whichever side is louder on social",
            next: "wrong_louder",
          },
        ],
      },
      wrong_celeb: {
        message:
          "Attention can fail a tape that just added float. Return to what you separate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_louder: {
        message:
          "Loud is not official. Combined drills teach both channels.\n\nReturn to what you separate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      clock: {
        message:
          "You named supply versus attention.\n\nHow does horizon change the grade?",
        outcome: "continue",
        choices: [
          {
            label: "One answer fits every clock — ignore hours versus days",
            next: "wrong_one",
          },
          {
            label: "HOLD can be fair on a short clock when supply and hype fight",
            next: "later",
          },
        ],
      },
      wrong_one: {
        message:
          "Combined crypto cards often award wait. Revisit horizon.",
        outcome: "wrong",
        choices: [],
        rewind_to: "clock",
      },
      later: {
        message:
          "Later SAMPLE: the celebrity post fades, the extra float remains.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Keep the celebrity thesis because it made the bigger wick",
            next: "wrong_wick",
          },
          {
            label: "Re-weight toward the unlock that is still on the card; still not an exchange",
            next: "success",
          },
        ],
      },
      wrong_wick: {
        message:
          "Wick size is not the surviving fact. Return to the later card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "later",
      },
      success: {
        message:
          "Session complete. You matched a SAMPLE unlock to a headline and named the clock.\n\nNext: Cases → crypto (combined briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoCombinedSession;

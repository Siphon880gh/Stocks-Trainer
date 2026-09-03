import type { CoachingSession } from "../types";

/** Filing vs headline and horizon mismatch on SAMPLE combined cases. */
export const combinedDecisionsSession: CoachingSession = {
  meta: {
    slug: "combined-decisions",
    title: "Headline plus snapshot",
    summary:
      "Match SAMPLE filing facts to the headline. A different time frame can change the grade.",
    topic: "Combined decisions",
    tags: ["equities", "combined"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: the quarter beat, and the headline is a guidance cut. Cash still looks solid.\n\nWhat do you separate first?",
        outcome: "continue",
        choices: [
          {
            label: "Treat the beat as the whole story and ignore the headline",
            next: "wrong_beat_only",
          },
          {
            label: "Match the snapshot (past) to the headline (path), then name your clock",
            next: "clock",
          },
          {
            label: "Trust chat over the filing if the chat is louder",
            next: "wrong_chat",
          },
        ],
      },
      wrong_beat_only: {
        message:
          "A beat can still fail a short-term thesis if the outlook resets.\n\nReturn to what you separate first.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_chat: {
        message:
          "Filed facts outrank chat. Combined cases teach rumor versus filing as well as beat versus cut.\n\nReturn to what you separate first.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      clock: {
        message:
          "You named past versus path.\n\nHow does horizon change the answer?",
        outcome: "continue",
        choices: [
          {
            label: "One answer fits every owner — ignore how long you meant to hold",
            next: "wrong_one_answer",
          },
          {
            label: "State weeks versus years; hold can be fair for a long clock even if sellers win the session",
            next: "success",
          },
        ],
      },
      wrong_one_answer: {
        message:
          "Combined cases can award partial credit when the thesis is right but the clock is not. Revisit horizon.",
        outcome: "wrong",
        choices: [],
        rewind_to: "clock",
      },
      success: {
        message:
          "Session complete. You matched filing to headline and named your clock.\n\nNext: Cases → news plus financials.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default combinedDecisionsSession;

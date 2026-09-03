import type { CoachingSession } from "../types";

/** Equities vocabulary coaching — not a quiz clone. */
export const equitiesLiteracySession: CoachingSession = {
  meta: {
    slug: "equities-literacy",
    title: "Name the equity building blocks",
    summary:
      "Walk SAMPLE vocabulary: long versus short, horizon, and what this app will not do (brokerage, live fills).",
    topic: "Equities vocabulary",
    tags: ["equities", "literacy", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "You are on the Beginner equities path. Training → Equities literacy is the first quiz gate.\n\nWhat is this app for?",
        outcome: "continue",
        choices: [
          {
            label: "Place live stock orders and see fills",
            next: "wrong_broker",
          },
          {
            label: "Practice SAMPLE charts, quizzes, and decide-and-reveal cases",
            next: "purpose",
          },
          {
            label: "Skip vocabulary because charts are enough",
            next: "wrong_skip_vocab",
          },
        ],
      },
      wrong_broker: {
        message:
          "There is no brokerage, no LIVE order routing, and no account to fund.\n\nReturn to what this app is for.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_skip_vocab: {
        message:
          "Cases and Coach use words like horizon, bid-ask, and SAMPLE feed. Vocabulary first keeps debriefs readable.\n\nReturn to what this app is for.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      purpose: {
        message:
          "A quiz asks when a long stock position profits.\n\nWhich answer is process, not a slogan?",
        outcome: "continue",
        choices: [
          {
            label: "Price goes down — longs always hedge by hoping",
            next: "wrong_hope",
          },
          {
            label: "Price goes up over your time frame; shorts stay locked until the app teaches them",
            next: "success",
          },
        ],
      },
      wrong_hope: {
        message:
          "A long profits if price rises (minus costs). Hope is not a direction.\n\nRevisit the literacy check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "purpose",
      },
      success: {
        message:
          "Session complete. You kept SAMPLE honesty and named long versus short gating.\n\nNext: Training → equity-literacy, then Archive terms.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default equitiesLiteracySession;

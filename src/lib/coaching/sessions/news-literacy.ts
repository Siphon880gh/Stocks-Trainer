import type { CoachingSession } from "../types";

/** News literacy as a graph, not a quiz clone. */
export const newsLiteracySession: CoachingSession = {
  meta: {
    slug: "news-literacy",
    title: "Rumor, filing, and priced-in",
    summary:
      "Practice SAMPLE news hygiene: source quality, already-in-the-price, and chase versus wait — without replacing Training quizzes.",
    topic: "News literacy",
    tags: ["equities", "news-literacy", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE headline: a product rumor, not a filing. The stock already ran.\n\nFirst hygiene check?",
        outcome: "continue",
        choices: [
          {
            label: "Treat social volume as the same thing as a filed fact",
            next: "wrong_social",
          },
          {
            label: "Ask rumor versus filing, then whether the run already priced the story",
            next: "priced",
          },
          {
            label: "Skip Training news quizzes because Coach is enough",
            next: "wrong_skip_quiz",
          },
        ],
      },
      wrong_social: {
        message:
          "Chat is not a filing. Source quality is the first news-literacy move.\n\nReturn to the hygiene check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_skip_quiz: {
        message:
          "This tree is practice, not a replacement for Training → news-literacy questions.\n\nReturn to the hygiene check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The run may already contain the rumor.\n\nWhat do you do next?",
        outcome: "continue",
        choices: [
          {
            label: "Chase so you do not miss the rest",
            next: "wrong_chase",
          },
          {
            label: "Wait or fade until a filing confirms; waiting is a valid choice",
            next: "success",
          },
        ],
      },
      wrong_chase: {
        message:
          "Chasing a priced-in rumor is the mistake Training names chase-versus-fade. Revisit the next step.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      success: {
        message:
          "Session complete. You kept rumor versus filing and priced-in humility.\n\nNext: Training → news-literacy, then Cases → company news. Chase-vs-fade is the sibling tree for a full headline walk.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default newsLiteracySession;

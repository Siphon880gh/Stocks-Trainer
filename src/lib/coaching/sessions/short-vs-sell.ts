import type { CoachingSession } from "../types";

export const shortVsSellSession: CoachingSession = {
  meta: {
    slug: "short-vs-sell",
    title: "Short versus sell",
    summary:
      "Sell closes a long you already have. Short is a new bet that price falls. Do not short a rumor.",
    topic: "Company news decisions",
    tags: ["equities", "company-news", "short", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: you do not own the stock. A launch product is recalled after a crowded run.\n\nWhat is the first distinction?",
        outcome: "continue",
        choices: [
          {
            label: "Sell and short mean the same thing — both are just downside",
            next: "wrong_same",
          },
          {
            label: "Sell exits a long you have; short is a new downside bet",
            next: "own",
          },
          {
            label: "Short every recall because price always gaps and stays down",
            next: "wrong_always",
          },
        ],
      },
      wrong_same: {
        message:
          "They are not the same. Sell needs shares you already hold. Short opens risk that can grow if the stock rips back.\n\nReturn to the first distinction.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_always: {
        message:
          "A recall is a fact, but “always” skips size and bounce risk. Process starts with own-vs-not-own.\n\nReturn to the first distinction.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      own: {
        message:
          "You do not own shares. Chat also has an unconfirmed CEO rumor on a different name.\n\nWhen is short the process answer?",
        outcome: "continue",
        choices: [
          {
            label: "Short the CEO rumor because chat is loud",
            next: "wrong_rumor",
          },
          {
            label: "Short only when a filed fact broke the thesis; hold if you refuse short risk",
            next: "success",
          },
        ],
      },
      wrong_rumor: {
        message:
          "A rumor without a filing is not an automatic short. Cases → company news (short vs sell) teaches that trap.\n\nRevisit when short is process.",
        outcome: "wrong",
        choices: [],
        rewind_to: "own",
      },
      success: {
        message:
          "Session complete. You separated sell from short, and rumor from filing.\n\nNext: Cases → company news (short vs sell).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default shortVsSellSession;

import type { CoachingSession } from "../types";

/** Futures vocabulary — contract vs stock, not a live desk. */
export const futuresLiteracySession: CoachingSession = {
  meta: {
    slug: "futures-literacy",
    title: "Name SAMPLE futures building blocks",
    summary:
      "Front month, roll, and index versus commodity — vocabulary for SAMPLE futures, not a brokerage account.",
    topic: "Multi-market decisions",
    tags: ["futures", "literacy", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "Navigator → Futures on SAMPLE data. You already know equities vocabulary.\n\nWhat is a futures pack here?",
        outcome: "continue",
        choices: [
          {
            label: "A live contract you roll with real margin and fills",
            next: "wrong_live",
          },
          {
            label: "An educational tape labeled like ES, CL, GC, or ZC — still decide-and-reveal",
            next: "front",
          },
          {
            label: "The same thing as one stock, so skip new words",
            next: "wrong_same_stock",
          },
        ],
      },
      wrong_live: {
        message:
          "No margin, no roll desk, no brokerage. SAMPLE labels only.\n\nReturn to what a pack is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_same_stock: {
        message:
          "Index and commodity futures are not one company's 10-K. Vocabulary still matters.\n\nReturn to what a pack is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      front: {
        message:
          "The brief says front month.\n\nWhat does that name?",
        outcome: "continue",
        choices: [
          {
            label: "The cheapest month on every commodity, always buy it",
            next: "wrong_cheap",
          },
          {
            label: "The nearest listed SAMPLE expiry on this tape — structure, not a buy button",
            next: "index",
          },
        ],
      },
      wrong_cheap: {
        message:
          "Front month is nearest expiry, not cheapest. Revisit the definition.",
        outcome: "wrong",
        choices: [],
        rewind_to: "front",
      },
      index: {
        message:
          "ES-style versus CL-style.\n\nWhat is the literacy split?",
        outcome: "continue",
        choices: [
          {
            label: "There is no split — all futures are oil",
            next: "wrong_all_oil",
          },
          {
            label: "Index futures track a basket; commodity futures track a stuff story (energy, metal, grain)",
            next: "success",
          },
        ],
      },
      wrong_all_oil: {
        message:
          "ES is not oil. Return to the split.",
        outcome: "wrong",
        choices: [],
        rewind_to: "index",
      },
      success: {
        message:
          "Session complete. You named SAMPLE front month and index versus commodity without inventing a desk.\n\nNext: Training → futures-literacy, then Cases → futures.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresLiteracySession;

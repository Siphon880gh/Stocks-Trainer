import type { CoachingSession } from "../types";

/** SAMPLE FX vocabulary — pair, pip, quote — not a dealing desk. */
export const forexLiteracySession: CoachingSession = {
  meta: {
    slug: "forex-literacy",
    title: "Name SAMPLE forex building blocks",
    summary:
      "Base versus quote, pip humility, and HOLD — vocabulary for SAMPLE FX, not a live dealing desk.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "literacy", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "Navigator → Forex on SAMPLE data.\n\nWhat is this class here?",
        outcome: "continue",
        choices: [
          {
            label: "A live FX desk with bank spreads and fills",
            next: "wrong_desk",
          },
          {
            label: "Educational currency tapes using the same decide-and-reveal process as equities",
            next: "pair",
          },
          {
            label: "Skip words like pip because only candles matter",
            next: "wrong_skip",
          },
        ],
      },
      wrong_desk: {
        message:
          "No live desk, no prime broker. SAMPLE packs only.\n\nReturn to what this class is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_skip: {
        message:
          "Debriefs use pair, pip, and spread. Vocabulary keeps them readable.\n\nReturn to what this class is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      pair: {
        message:
          "EUR/USD is quoted as dollars per euro.\n\nIf EUR/USD rises, which currency strengthened in this SAMPLE quote?",
        outcome: "continue",
        choices: [
          {
            label: "The dollar — the quote always wins when the number goes up",
            next: "wrong_quote_wins",
          },
          {
            label: "The euro (base): it takes more dollars to buy one euro",
            next: "hold",
          },
        ],
      },
      wrong_quote_wins: {
        message:
          "Up on EUR/USD is a stronger euro versus the dollar in this quote. Revisit the pair.",
        outcome: "wrong",
        choices: [],
        rewind_to: "pair",
      },
      hold: {
        message:
          "A brief shows a wide SAMPLE spread and no catalyst.\n\nWhat does literacy allow?",
        outcome: "continue",
        choices: [
          {
            label: "You must pick buy or sell so the case counts",
            next: "wrong_must",
          },
          {
            label: "HOLD is a first-class answer when cost and catalyst fail the test",
            next: "success",
          },
        ],
      },
      wrong_must: {
        message:
          "Forcing a side is not literacy. Return to HOLD.",
        outcome: "wrong",
        choices: [],
        rewind_to: "hold",
      },
      success: {
        message:
          "Session complete. You named SAMPLE base/quote and kept HOLD as a valid FX answer.\n\nNext: Training → forex-literacy, then Cases → forex.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexLiteracySession;

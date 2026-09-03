import type { CoachingSession } from "../types";

/** Data print → rates/growth on SAMPLE briefs. */
export const macroPrintSession: CoachingSession = {
  meta: {
    slug: "macro-print",
    title: "Map a SAMPLE data print",
    summary:
      "Map inflation or jobs data to rates and growth, then to how sensitive this SAMPLE stock is.",
    topic: "Market-wide news",
    tags: ["equities", "macro-print", "macro"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: inflation comes in hotter than expected. Rate-cut hopes fade. Your stock had been grinding higher.\n\nWhat do you map first?",
        outcome: "continue",
        choices: [
          {
            label: "Ignore the print — this is still a company story only",
            next: "wrong_ignore",
          },
          {
            label: "Map the print to rates and growth, then to this stock's sensitivity",
            next: "map",
          },
          {
            label: "Assume hot data always lifts every stock",
            next: "wrong_always_lift",
          },
        ],
      },
      wrong_ignore: {
        message:
          "Hot inflation can reprice what people pay for future profits even if the company is fine.\n\nReturn to the map.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_always_lift: {
        message:
          "Hot data often lifts the dollar and rates, which can hurt long-duration names.\n\nReturn to the map.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      map: {
        message:
          "Rates may stay higher for longer.\n\nWhat stance matches a grind into that print?",
        outcome: "continue",
        choices: [
          {
            label: "Buy more because the company is high quality",
            next: "wrong_quality",
          },
          {
            label: "Sell or hold a sized line — quality does not cancel a rate reprice",
            next: "success",
          },
        ],
      },
      wrong_quality: {
        message:
          "Quality is not a hall pass on discount rates. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "map",
      },
      success: {
        message:
          "Session complete. You mapped the print to rates, then to the stock.\n\nNext: Cases → market-wide news (macro setup).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default macroPrintSession;

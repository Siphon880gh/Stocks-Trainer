import type { CoachingSession } from "../types";

/** SAMPLE FOMC / CPI map onto an index future. */
export const futuresFomcPrintSession: CoachingSession = {
  meta: {
    slug: "futures-fomc-print",
    title: "Map a SAMPLE FOMC print to ES",
    summary:
      "Hot SAMPLE inflation or a hawkish FOMC can reprice the index future. Map rates before chasing the first tick.",
    topic: "Multi-market decisions",
    tags: ["futures", "macro-print", "index", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: inflation prints hotter than expected. ES-style futures drop on the first tick. Practice data, not a live print.\n\nWhat do you map first?",
        outcome: "continue",
        choices: [
          {
            label: "Ignore the print — index futures are only chart patterns",
            next: "wrong_ignore",
          },
          {
            label: "Map the print to rates and growth, then to how sensitive this index tape is",
            next: "map",
          },
          {
            label: "Assume hot inflation always lifts every future, including ES",
            next: "wrong_always_lift",
          },
        ],
      },
      wrong_ignore: {
        message:
          "A rates print can reprice the whole index even if no single company filed.\n\nReturn to the map.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_always_lift: {
        message:
          "Hot inflation often hurts long-duration index multiples. It is not a buy-everything signal.\n\nReturn to the map.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      map: {
        message:
          "Rates may stay higher for longer. The first tick already moved.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the drop because quality indexes always recover by lunch",
            next: "wrong_lunch",
          },
          {
            label: "Do not chase the first tick; hold until the spread and the spike settle",
            next: "horizon",
          },
        ],
      },
      wrong_lunch: {
        message:
          "Quality is not a hall pass on discount rates. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "map",
      },
      horizon: {
        message:
          "You waited. A later SAMPLE card is the FOMC statement, not the CPI print.\n\nHow do you treat it?",
        outcome: "continue",
        choices: [
          {
            label: "Reuse the CPI stance unchanged — all data prints are the same",
            next: "wrong_reuse",
          },
          {
            label: "Re-map: a policy statement is a new print, still not a live desk",
            next: "success",
          },
        ],
      },
      wrong_reuse: {
        message:
          "CPI and FOMC can rhyme without being the same card. Return to how you treat the statement.",
        outcome: "wrong",
        choices: [],
        rewind_to: "horizon",
      },
      success: {
        message:
          "Session complete. You mapped a SAMPLE rates print onto the index and refused the first tick.\n\nNext: Cases → futures (macro-print briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresFomcPrintSession;

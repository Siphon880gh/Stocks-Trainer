import type { CoachingSession } from "../types";

/** SAMPLE BOJ / Japan policy print on USD/JPY. */
export const forexBojPrintSession: CoachingSession = {
  meta: {
    slug: "forex-boj-print",
    title: "Map a SAMPLE BOJ print",
    summary:
      "A SAMPLE Bank of Japan decision can reprice USD/JPY. Map policy before chasing the first tick.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "macro-print", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: BOJ sounds less patient. USD/JPY dumps on the first tick as yen is bid. Not a live Tokyo desk.\n\nWhat do you map first?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the first tick because JPY always follows the statement verbatim",
            next: "wrong_chase",
          },
          {
            label: "Map the policy shift to rate differentials, then to this pair",
            next: "map",
          },
          {
            label: "Ignore BOJ — USD/JPY is only a U.S. story",
            next: "wrong_ignore",
          },
        ],
      },
      wrong_chase: {
        message:
          "The first tick is often the worst fill in the story. You skipped the map.\n\nReturn to what you map first.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_ignore: {
        message:
          "Yen policy is the other side of USD/JPY. Return to the map.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      map: {
        message:
          "If Japan rates are less suppressed, yen can stay bid versus the dollar.\n\nWhat stance fits an already-moved SAMPLE tape?",
        outcome: "continue",
        choices: [
          {
            label: "Buy USD/JPY immediately so you catch the reversal",
            next: "wrong_fade",
          },
          {
            label: "Do not chase; hold until the spike and the spread settle",
            next: "nfp",
          },
        ],
      },
      wrong_fade: {
        message:
          "Blindly fading a policy spike is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "map",
      },
      nfp: {
        message:
          "A later SAMPLE card is U.S. payrolls, not BOJ.\n\nHow do you treat it?",
        outcome: "continue",
        choices: [
          {
            label: "Reuse the BOJ stance unchanged — all prints are yen",
            next: "wrong_reuse",
          },
          {
            label: "Re-map: U.S. jobs hit the dollar side; still no live desk",
            next: "success",
          },
        ],
      },
      wrong_reuse: {
        message:
          "BOJ and NFP are different sides of the pair. Return to the later card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "nfp",
      },
      success: {
        message:
          "Session complete. You mapped a SAMPLE BOJ print onto USD/JPY and refused the first tick.\n\nNext: Cases → forex (BOJ / yen-policy briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexBojPrintSession;

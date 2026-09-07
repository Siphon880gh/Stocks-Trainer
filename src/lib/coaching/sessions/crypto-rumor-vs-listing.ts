import type { CoachingSession } from "../types";

/** SAMPLE rumor versus official listing / protocol notice. */
export const cryptoRumorVsListingSession: CoachingSession = {
  meta: {
    slug: "crypto-rumor-vs-listing",
    title: "Rumor versus official crypto notice",
    summary:
      "Social volume is not an official SAMPLE listing or protocol post. Wait for the notice.",
    topic: "Multi-market decisions",
    tags: ["crypto", "rumor", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE ETH-style tape: social says a large product will add the token. No official post. Price already ran.\n\nFirst hygiene?",
        outcome: "continue",
        choices: [
          {
            label: "Treat social volume as the official notice and chase",
            next: "wrong_social",
          },
          {
            label: "Separate rumor versus official notice, then ask if the run already priced the story",
            next: "priced",
          },
          {
            label: "This app will list the token for you",
            next: "wrong_list",
          },
        ],
      },
      wrong_social: {
        message:
          "Social is not a venue or protocol post. You skipped source rank.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_list: {
        message:
          "No exchange, no listing button. SAMPLE education only.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The run already embeds the rumor.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Keep buying so you are in before the official post",
            next: "wrong_before",
          },
          {
            label: "Hold until an official notice; do not pay the rumor run",
            next: "after",
          },
        ],
      },
      wrong_before: {
        message:
          "Getting in before the post is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      after: {
        message:
          "Later SAMPLE: the official post lands, and price chops. No second fact.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Official always means buy the next candle",
            next: "wrong_next",
          },
          {
            label: "Re-decide: the notice is the new fact, and chop can mean it is already in",
            next: "success",
          },
        ],
      },
      wrong_next: {
        message:
          "Official is not a buy button. Return to the after card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "after",
      },
      success: {
        message:
          "Session complete. You waited for an official SAMPLE notice instead of chasing social.\n\nNext: Cases → crypto (rumor vs listing briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoRumorVsListingSession;

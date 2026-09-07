import type { CoachingSession } from "../types";

/** SAMPLE listing / ETF / exchange headline — not a live venue. */
export const cryptoListingHeadlineSession: CoachingSession = {
  meta: {
    slug: "crypto-listing-headline",
    title: "Listing headline on SAMPLE crypto",
    summary:
      "A SAMPLE listing or ETF rumor is still a headline. Source quality and priced-in still beat FOMO.",
    topic: "Multi-market decisions",
    tags: ["crypto", "headline", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE SOL-style tape: chat says a large venue will list the token. Price already jumped. Not a live exchange.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Treat the listing rumor as confirmed and chase the open",
            next: "wrong_confirmed",
          },
          {
            label: "Ask rumor versus official listing notice, then whether the jump already priced it",
            next: "priced",
          },
          {
            label: "Ignore the headline and trade only the influencer candle",
            next: "wrong_candle",
          },
        ],
      },
      wrong_confirmed: {
        message:
          "Chat is not a venue notice. You skipped source rank.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_candle: {
        message:
          "The listing story is the catalyst this drill teaches.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The jump is already large. No official notice on the brief.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy so you do not miss the listing day",
            next: "wrong_miss",
          },
          {
            label: "Hold or wait until an official notice; FOMO is still FOMO",
            next: "notice",
          },
        ],
      },
      wrong_miss: {
        message:
          "Paying a rumor jump to not miss listing day is classic chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      notice: {
        message:
          "Later SAMPLE: the venue posts an official listing notice. Price chops.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Chase anyway because official always means another leg up",
            next: "wrong_always_leg",
          },
          {
            label: "Re-decide: the notice is a new fact, but the move may already be in; HOLD is allowed",
            next: "success",
          },
        ],
      },
      wrong_always_leg: {
        message:
          "Official does not guarantee a second leg. Return to the notice card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "notice",
      },
      success: {
        message:
          "Session complete. You ranked a SAMPLE listing rumor below an official notice and refused to chase the first jump.\n\nNext: Cases → crypto (listing / headline briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoListingHeadlineSession;

import type { CoachingSession } from "../types";

/** SAMPLE BTC on a broad risk-off tape. */
export const cryptoBtcRiskOffSession: CoachingSession = {
  meta: {
    slug: "crypto-btc-risk-off",
    title: "Bitcoin versus a SAMPLE risk-off tape",
    summary:
      "When SAMPLE risk assets sell together, bitcoin can be beta, not a separate island. Do not buy the dip by default.",
    topic: "Multi-market decisions",
    tags: ["crypto", "risk-off", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: credit spreads widen, indexes dump, and bitcoin dumps with them. Weekend hours still apply. Not a live exchange.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Treat bitcoin as uncorrelated gold and buy the dip",
            next: "wrong_gold",
          },
          {
            label: "Ask whether BTC is the story or just along for the risk-off ride",
            next: "beta",
          },
          {
            label: "Short every alt because fear always lasts forever",
            next: "wrong_forever",
          },
        ],
      },
      wrong_gold: {
        message:
          "On this SAMPLE tape, BTC is selling with risk assets. Buying the dip skips beta.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_forever: {
        message:
          "Blind shorts skip process and treat every scare as permanent.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      beta: {
        message:
          "The dump is already extended. No protocol fact on the brief.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Add a full new line into the scare so you own the bounce",
            next: "wrong_add",
          },
          {
            label: "Hold or wait; do not add a full line into an extended beta dump",
            next: "alt",
          },
        ],
      },
      wrong_add: {
        message:
          "Adding size into an extended scare is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "beta",
      },
      alt: {
        message:
          "A SAMPLE alt dumped twice as hard with no separate headline.\n\nHow do you treat it?",
        outcome: "continue",
        choices: [
          {
            label: "The extra dump proves the alt is the buy",
            next: "wrong_extra",
          },
          {
            label: "Harder beta is not a separate catalyst; HOLD unless a coin-specific fact shows",
            next: "success",
          },
        ],
      },
      wrong_extra: {
        message:
          "More dump is not a new story. Return to the alt check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "alt",
      },
      success: {
        message:
          "Session complete. You treated SAMPLE bitcoin as risk beta on this tape, not as automatic digital gold.\n\nNext: Cases → crypto (risk-off briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoBtcRiskOffSession;

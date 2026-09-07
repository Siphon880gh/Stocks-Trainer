import type { CoachingSession } from "../types";

/** SAMPLE alt hype versus BTC — do not treat them as one chase. */
export const cryptoSolAltHypeSession: CoachingSession = {
  meta: {
    slug: "crypto-sol-alt-hype",
    title: "Alt hype versus SAMPLE bitcoin",
    summary:
      "A SAMPLE alt can run on social while BTC is quiet. Grade the alt on its own catalyst, not as cheaper bitcoin.",
    topic: "Multi-market decisions",
    tags: ["crypto", "alt", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: bitcoin is flat. A SOL-style alt is extended after influencer clips. Not a live venue.\n\nFirst check?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the alt because it is cheaper than bitcoin so it must catch up",
            next: "wrong_cheap",
          },
          {
            label: "Ask whether the alt has its own durable fact, or only social heat",
            next: "own",
          },
          {
            label: "Buy bitcoin instead automatically whenever an alt rips",
            next: "wrong_auto_btc",
          },
        ],
      },
      wrong_cheap: {
        message:
          "Cheaper is not a catch-up contract. You skipped the alt's own catalyst.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_auto_btc: {
        message:
          "An alt rip is not an automatic BTC buy. Grade each tape.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      own: {
        message:
          "The brief is clips, not a protocol or listing fact. The alt is already extended.\n\nWhat stance fits the alt?",
        outcome: "continue",
        choices: [
          {
            label: "Chase so you do not miss the next clip",
            next: "wrong_clips",
          },
          {
            label: "Hold or fade the alt; social heat is not a durable fact",
            next: "btc",
          },
        ],
      },
      wrong_clips: {
        message:
          "The next clip is still social. Revisit the alt stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "own",
      },
      btc: {
        message:
          "BTC is still quiet with no matching headline.\n\nWhat about bitcoin?",
        outcome: "continue",
        choices: [
          {
            label: "Force a BTC trade so the session feels complete",
            next: "wrong_force",
          },
          {
            label: "HOLD bitcoin too: a quiet tape with no fact is a pass",
            next: "success",
          },
        ],
      },
      wrong_force: {
        message:
          "Completeness is not a catalyst. Return to the BTC check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "btc",
      },
      success: {
        message:
          "Session complete. You graded a SAMPLE alt on its own social heat and left quiet BTC as HOLD.\n\nNext: Cases → crypto (alt vs BTC briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoSolAltHypeSession;

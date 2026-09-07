import type { CoachingSession } from "../types";

/** SAMPLE crypto vocabulary — not an exchange, wallet, or brokerage. */
export const cryptoLiteracySession: CoachingSession = {
  meta: {
    slug: "crypto-literacy",
    title: "Name SAMPLE crypto building blocks",
    summary:
      "Exchange versus practice tape, weekend hours, and HOLD — vocabulary for SAMPLE crypto, not a live venue.",
    topic: "Multi-market decisions",
    tags: ["crypto", "literacy", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "Navigator → Crypto on SAMPLE data.\n\nWhat is this class here?",
        outcome: "continue",
        choices: [
          {
            label: "A live exchange with wallets, deposits, and fills",
            next: "wrong_exchange",
          },
          {
            label: "Educational BTC/ETH/SOL-style tapes with the same decide-and-reveal rules",
            next: "hours",
          },
          {
            label: "Skip crypto words because it is just like stocks",
            next: "wrong_just_stocks",
          },
        ],
      },
      wrong_exchange: {
        message:
          "No wallet, no CEX, no brokerage. SAMPLE packs only.\n\nReturn to what this class is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_just_stocks: {
        message:
          "Weekend hours and no 10-K analog still need words. Vocabulary first.\n\nReturn to what this class is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      hours: {
        message:
          "Crypto can print when equities are shut.\n\nWhat does that change in this app?",
        outcome: "continue",
        choices: [
          {
            label: "You must trade every weekend gap because the market never sleeps",
            next: "wrong_must",
          },
          {
            label: "Hours stay on; process stays the same — catalyst, priced-in, HOLD allowed",
            next: "hold",
          },
        ],
      },
      wrong_must: {
        message:
          "Always-on is not a must-trade. Revisit hours.",
        outcome: "wrong",
        choices: [],
        rewind_to: "hours",
      },
      hold: {
        message:
          "A brief has hype and no durable fact.\n\nWhat does literacy allow?",
        outcome: "continue",
        choices: [
          {
            label: "You must pick buy so you do not miss crypto",
            next: "wrong_miss",
          },
          {
            label: "HOLD is valid; missing a SAMPLE hype tape is not a failure",
            next: "success",
          },
        ],
      },
      wrong_miss: {
        message:
          "FOMO is not literacy. Return to HOLD.",
        outcome: "wrong",
        choices: [],
        rewind_to: "hold",
      },
      success: {
        message:
          "Session complete. You kept SAMPLE crypto honest: no exchange, weekend hours without a must-trade, HOLD allowed.\n\nNext: Training → crypto-literacy, then Cases → crypto.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoLiteracySession;

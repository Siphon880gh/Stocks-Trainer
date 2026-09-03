import type { CoachingSession } from "../types";

/** Chase vs fade on SAMPLE crypto tapes. */
export const cryptoChaseSession: CoachingSession = {
  meta: {
    slug: "crypto-chase",
    title: "Chase vs fade SAMPLE crypto hype",
    summary:
      "Social hype on a SAMPLE bitcoin or alt tape is still a source-quality problem, not a live exchange.",
    topic: "Multi-market decisions",
    tags: ["crypto", "multi-market", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: bitcoin is already extended after influencer chase posts. No filing equivalent.\n\nFirst check?",
        outcome: "continue",
        choices: [
          {
            label: "Treat influencer volume as confirmed news and chase",
            next: "wrong_influencer",
          },
          {
            label: "Weigh evidence quality against FOMO, then ask if the move is already in the tape",
            next: "quality",
          },
          {
            label: "This app is a live crypto exchange — size like a desk",
            next: "wrong_exchange",
          },
        ],
      },
      wrong_influencer: {
        message:
          "Hype without a durable catalyst often fades. You skipped source humility.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_exchange: {
        message:
          "Practice data only. No live exchange, wallet, or brokerage here.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      quality: {
        message:
          "The tape is already extended.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the open so you do not miss the next leg",
            next: "wrong_buy_open",
          },
          {
            label: "Sell or hold a sized line until a better catalyst shows up",
            next: "success",
          },
        ],
      },
      wrong_buy_open: {
        message:
          "Buying an extended hype tape is classic chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "quality",
      },
      success: {
        message:
          "Session complete. You treated crypto hype as a source-quality problem.\n\nNext: Cases → crypto.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoChaseSession;

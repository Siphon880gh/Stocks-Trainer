import type { CoachingSession } from "../types";

/** SAMPLE hack / supply-shock analog — name which coin sits on the damaged side. */
export const cryptoHackSupplySession: CoachingSession = {
  meta: {
    slug: "crypto-hack-supply",
    title: "Hack scare on SAMPLE crypto",
    summary:
      "A SAMPLE bridge or venue hack is a supply-and-trust shock. Name which coin is on the damaged side.",
    topic: "Multi-market decisions",
    tags: ["crypto", "supply", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: a bridge hack headline hits. The related token dumps. BTC dips with it. Not a live incident desk.\n\nFirst question?",
        outcome: "continue",
        choices: [
          {
            label: "Sell every coin because a hack always means crypto is over",
            next: "wrong_every",
          },
          {
            label: "Name which token sits on the damaged rail versus which is only along for the ride",
            next: "side",
          },
          {
            label: "Buy the dumped token immediately because hacks always bounce",
            next: "wrong_bounce",
          },
        ],
      },
      wrong_every: {
        message:
          "A rail-specific scare is not a reason to flatten every SAMPLE coin.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_bounce: {
        message:
          "Buying a hack dump because dumps bounce skips which side is damaged.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      side: {
        message:
          "The related token is on the damaged rail. BTC is beta, not the hacked contract.\n\nWhat stance fits the related token?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the dump with size so you own the panic",
            next: "wrong_chase",
          },
          {
            label: "Hold or wait; do not catch the knife until a confirmed print, not chat",
            next: "btc",
          },
        ],
      },
      wrong_chase: {
        message:
          "Owning the panic is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "side",
      },
      btc: {
        message:
          "SAMPLE BTC only dipped and reclaimed. The hacked token did not.\n\nHow do you keep them distinct?",
        outcome: "continue",
        choices: [
          {
            label: "They must be the same trade now",
            next: "wrong_same",
          },
          {
            label: "BTC reclaim is not a reclaim of the damaged token; grade each tape",
            next: "success",
          },
        ],
      },
      wrong_same: {
        message:
          "Beta is not identity. Return to the BTC check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "btc",
      },
      success: {
        message:
          "Session complete. You named the damaged SAMPLE rail instead of selling everything or catching the knife.\n\nNext: Cases → crypto (hack / supply briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoHackSupplySession;

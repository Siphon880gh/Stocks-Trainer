import type { CoachingSession } from "../types";

/** Educational stable depeg scare — not a live CEX or issuer. */
export const cryptoDepegScareSession: CoachingSession = {
  meta: {
    slug: "crypto-depeg-scare",
    title: "SAMPLE stable depeg scare",
    summary:
      "A SAMPLE stablecoin wobble is a source-quality drill. This app is not an exchange and does not confirm a depeg.",
    topic: "Multi-market decisions",
    tags: ["crypto", "depeg", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: chat says a dollar-pegged token slipped. BTC dumps with it. Educational scare only — not a live issuer or CEX.\n\nFirst hygiene check?",
        outcome: "continue",
        choices: [
          {
            label: "Treat chat volume as proof the peg is dead and dump everything",
            next: "wrong_chat_proof",
          },
          {
            label: "Separate rumor versus a confirmed print, then ask what you actually hold in this drill",
            next: "what",
          },
          {
            label: "Open a live exchange in this app and redeem the stable",
            next: "wrong_redeem",
          },
        ],
      },
      wrong_chat_proof: {
        message:
          "Chat is not a confirmed depeg. Panic-selling every coin skips source humility.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_redeem: {
        message:
          "There is no wallet, redemption rail, or brokerage here. SAMPLE education only.\n\nReturn to hygiene.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      what: {
        message:
          "This drill's SAMPLE position is bitcoin, not the stable itself.\n\nWhat stance fits an unconfirmed peg scare?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the BTC dump because depeg scares always bounce",
            next: "wrong_always_bounce",
          },
          {
            label: "Hold or wait for a confirmed print; do not chase the scare tape",
            next: "confirm",
          },
        ],
      },
      wrong_always_bounce: {
        message:
          "Buying a scare because scares bounce is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "what",
      },
      confirm: {
        message:
          "A later SAMPLE card shows the peg print stabilizing; no insolvency filing analog.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Keep selling BTC because the scare headline is still on social",
            next: "wrong_stale_headline",
          },
          {
            label: "Re-decide on the new print; a stale scare is not a new fact",
            next: "success",
          },
        ],
      },
      wrong_stale_headline: {
        message:
          "Social can lag the print. Return to how you treat a stabilizing peg card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "confirm",
      },
      success: {
        message:
          "Session complete. You treated a SAMPLE depeg scare as rumor versus print, not as a live redemption.\n\nNext: Cases → crypto (depeg-scare briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoDepegScareSession;

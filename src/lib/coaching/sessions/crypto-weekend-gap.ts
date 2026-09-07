import type { CoachingSession } from "../types";

/** SAMPLE crypto weekend gap — not a live exchange. */
export const cryptoWeekendGapSession: CoachingSession = {
  meta: {
    slug: "crypto-weekend-gap",
    title: "Weekend gap on SAMPLE crypto",
    summary:
      "Crypto can print when other markets are closed. A SAMPLE weekend gap is still a chase-versus-wait problem.",
    topic: "Multi-market decisions",
    tags: ["crypto", "weekend", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE bitcoin: Saturday prints a sharp gap while equities are shut. No exchange, wallet, or brokerage here.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the gap because crypto never sleeps so you must act now",
            next: "wrong_never_sleeps",
          },
          {
            label: "Ask what catalyst opened the gap, and whether the move is already in the tape",
            next: "catalyst",
          },
          {
            label: "Treat the weekend print as a live 24/7 desk with fills",
            next: "wrong_desk",
          },
        ],
      },
      wrong_never_sleeps: {
        message:
          "Always-on hours are not a reason to chase. You skipped catalyst quality.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_desk: {
        message:
          "Practice data only. No live exchange or weekend desk here.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      catalyst: {
        message:
          "The brief is a thin social rumor, not a protocol or listing fact. The gap is already large.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the gap so Monday does not leave you behind",
            next: "wrong_monday",
          },
          {
            label: "Hold or fade until a durable fact shows; weekend FOMO is still FOMO",
            next: "monday",
          },
        ],
      },
      wrong_monday: {
        message:
          "Paying the weekend gap for a rumor is classic chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "catalyst",
      },
      monday: {
        message:
          "SAMPLE Monday: equities reopen and the crypto gap is still hanging.\n\nLast check?",
        outcome: "continue",
        choices: [
          {
            label: "The reopen proves the rumor, so now you must buy",
            next: "wrong_reopen",
          },
          {
            label: "A reopen is not a filing; keep waiting unless a new fact arrives",
            next: "success",
          },
        ],
      },
      wrong_reopen: {
        message:
          "Other markets opening does not upgrade a rumor. Return to the Monday check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "monday",
      },
      success: {
        message:
          "Session complete. You treated a SAMPLE weekend gap as source quality plus priced-in, not as a 24/7 order to chase.\n\nNext: Cases → crypto (weekend / gap briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoWeekendGapSession;

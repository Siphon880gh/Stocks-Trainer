import type { CoachingSession } from "../types";

/** SAMPLE USD/JPY risk-off dump — name the safe-haven side. */
export const forexJpyDumpSession: CoachingSession = {
  meta: {
    slug: "forex-jpy-dump",
    title: "JPY dump versus risk-on AUD",
    summary:
      "SAMPLE risk-off can bid yen and dump AUD. Name which side this pair sits on before chasing.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "risk-off", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: global risk-off. USD/JPY dumps as yen is bid. AUD/USD is already weak. Practice tape only.\n\nFirst question?",
        outcome: "continue",
        choices: [
          {
            label: "Buy USD/JPY because scary dumps always bounce",
            next: "wrong_bounce",
          },
          {
            label: "Name whether this pair is on the safe-haven side or the risk-on side",
            next: "side",
          },
          {
            label: "Treat yen and AUD as the same risk-off trade",
            next: "wrong_same",
          },
        ],
      },
      wrong_bounce: {
        message:
          "Buying a risk-off dump because dumps bounce skips which currency is the haven.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_same: {
        message:
          "Yen can catch a bid on the same scare that hurts AUD. They are not the same side.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      side: {
        message:
          "USD/JPY falling in a scare often means yen (the quote) is the haven bid.\n\nWhat stance fits if you have no other catalyst?",
        outcome: "continue",
        choices: [
          {
            label: "Chase USD/JPY lower after the dump is already extended",
            next: "wrong_chase_dump",
          },
          {
            label: "Hold or wait; do not chase an extended haven move on SAMPLE data",
            next: "aud",
          },
        ],
      },
      wrong_chase_dump: {
        message:
          "Chasing an extended dump is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "side",
      },
      aud: {
        message:
          "The next SAMPLE card is AUD/USD still sliding with risk-off.\n\nHow is that different from the yen tape?",
        outcome: "continue",
        choices: [
          {
            label: "AUD is also a haven, so buy the dip",
            next: "wrong_aud_haven",
          },
          {
            label: "AUD is often risk-on: the same scare can keep selling it; hold unless a new fact shows",
            next: "success",
          },
        ],
      },
      wrong_aud_haven: {
        message:
          "AUD is typically on the risk-on side, not a yen-style haven. Return to the AUD check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "aud",
      },
      success: {
        message:
          "Session complete. You named haven yen versus risk-on AUD instead of treating every dump as one trade.\n\nNext: Cases → forex (risk-off / JPY / AUD briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexJpyDumpSession;

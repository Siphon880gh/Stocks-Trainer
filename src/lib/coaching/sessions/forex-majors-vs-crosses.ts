import type { CoachingSession } from "../types";

/** SAMPLE majors versus crosses — liquidity and spread humility. */
export const forexMajorsVsCrossesSession: CoachingSession = {
  meta: {
    slug: "forex-majors-vs-crosses",
    title: "Majors versus crosses on SAMPLE FX",
    summary:
      "A SAMPLE cross can move more and still be a worse decision because of spread. HOLD is allowed.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "cross", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: EUR/USD is quiet. EUR/NZD is jumping. No scheduled print on either card.\n\nFirst humility?",
        outcome: "continue",
        choices: [
          {
            label: "Trade the cross because it is moving, so it must be the better market",
            next: "wrong_moving",
          },
          {
            label: "Ask whether the cross's spread and catalyst beat the quiet major",
            next: "spread",
          },
          {
            label: "Majors and crosses are the same liquidity, so skip the split",
            next: "wrong_same",
          },
        ],
      },
      wrong_moving: {
        message:
          "Movement can be spread and thin interest, not a better story.\n\nReturn to humility.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_same: {
        message:
          "Crosses often pay more to enter. The split is the drill.\n\nReturn to humility.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      spread: {
        message:
          "The cross brief names a wide SAMPLE spread. Still no catalyst.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Scalp the cross anyway because it looks more exciting than EUR/USD",
            next: "wrong_exciting",
          },
          {
            label: "Hold both: excitement is not a catalyst, and the spread is a cost",
            next: "when",
          },
        ],
      },
      wrong_exciting: {
        message:
          "Excitement is not process. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "spread",
      },
      when: {
        message:
          "When would a cross deserve a side in this app?",
        outcome: "continue",
        choices: [
          {
            label: "Whenever it is the only pair on the screen",
            next: "wrong_screen",
          },
          {
            label: "When a named catalyst and an acceptable SAMPLE spread show up — still not a live desk",
            next: "success",
          },
        ],
      },
      wrong_screen: {
        message:
          "Being on screen is not a reason to trade. Return to when a cross qualifies.",
        outcome: "wrong",
        choices: [],
        rewind_to: "when",
      },
      success: {
        message:
          "Session complete. You treated a SAMPLE cross as a spread-and-catalyst test, not a must-trade because it moved.\n\nNext: Cases → forex (cross vs major briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexMajorsVsCrossesSession;

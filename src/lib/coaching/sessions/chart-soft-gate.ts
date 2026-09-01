import type { CoachingSession } from "../types";

/** Chart / indicator soft-gate thinking before graded cases. */
export const chartSoftGateSession: CoachingSession = {
  meta: {
    slug: "chart-soft-gate",
    title: "Why Indicators come before cases",
    summary:
      "Decide when candles + indicators are ready enough for graded decide-and-reveal cases.",
    topic: "Chart fluency",
    tags: ["equities", "indicators", "chart-gate", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "You finished equities vocabulary. Cases wait until you can read candles and indicator lines.\n\nWhy finish Indicators literacy first?",
        outcome: "continue",
        choices: [
          {
            label: "Skip charts — news and statements are enough for buy/sell/hold",
            next: "wrong_skip_charts",
          },
          {
            label: "Prove candle/indicator fluency so debriefs can talk process on the tape",
            next: "overlays",
          },
          {
            label: "This step exists to unlock LIVE quotes",
            next: "wrong_live",
          },
        ],
      },
      wrong_skip_charts: {
        message:
          "Cases show pre-reaction OHLC. Without chart language, debriefs collapse into direction-only guesses.\n\nReturn to why Indicators come first.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_live: {
        message:
          "This app uses SAMPLE / DELAYED labels — this step is educational, not a LIVE feed unlock.\n\nReturn to why Indicators come first.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      overlays: {
        message:
          "On Market you can toggle SMA/EMA/RSI/MACD/Bollinger on SAMPLE packs.\n\nBefore Cases, which practice habit matches?",
        outcome: "continue",
        choices: [
          {
            label: "Memorize one indicator color and ignore candles",
            next: "wrong_indicator_only",
          },
          {
            label: "Finish the Indicators quiz, then open a SAMPLE chart and name what you see",
            next: "success",
          },
        ],
      },
      wrong_indicator_only: {
        message:
          "Indicators without candle context are incomplete fluency. You need both.\n\nRevisit the practice habit.",
        outcome: "wrong",
        choices: [],
        rewind_to: "overlays",
      },
      success: {
        message:
          "Session complete. Chart language first, then graded reveals.\n\nNext: Training → Indicators, then Cases.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default chartSoftGateSession;

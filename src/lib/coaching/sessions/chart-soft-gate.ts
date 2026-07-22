import type { CoachingSession } from "../types";

/** Chart / indicator soft-gate thinking before graded cases. */
export const chartSoftGateSession: CoachingSession = {
  meta: {
    slug: "chart-soft-gate",
    title: "Why the chart soft-gate exists",
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
          "You finished equities vocabulary. Graded Cases want a chart soft-gate first.\n\nWhy block cases until Indicators literacy is done?",
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
            label: "The gate exists to unlock LIVE quotes",
            next: "wrong_live",
          },
        ],
      },
      wrong_skip_charts: {
        message:
          "Cases show pre-reaction OHLC. Without chart language, debriefs collapse into direction-only guesses.\n\nReturn to the purpose of the gate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_live: {
        message:
          "This app uses SAMPLE / DELAYED labels — the soft-gate is educational, not a LIVE feed unlock.\n\nReturn to the purpose of the gate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      overlays: {
        message:
          "On Market you can toggle SMA/EMA/RSI/MACD/Bollinger on SAMPLE packs.\n\nBefore Cases, which practice habit matches the gate?",
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
          "Indicators without candle context are incomplete fluency. The gate wants both.\n\nRevisit the practice habit.",
        outcome: "wrong",
        choices: [],
        rewind_to: "overlays",
      },
      success: {
        message:
          "Session complete. Soft-gate = chart language before graded reveals.\n\nNext: Training → Indicators (path gate), then Cases.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default chartSoftGateSession;

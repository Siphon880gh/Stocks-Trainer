import type { CoachingSession } from "../types";

/** RSI oversold / overbought read against the trend vs inside a range (SAMPLE). */
export const rsiVsTrendSession: CoachingSession = {
  meta: {
    slug: "rsi-vs-trend",
    title: "Oversold is not a buy signal",
    summary:
      "RSI can stay oversold for a long time in a downtrend. Read the trend first; overbought and oversold work best inside a range.",
    topic: "Chart fluency",
    tags: ["all-markets", "indicators", "rsi"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE chart: lower highs and lower lows under a falling moving average. RSI drops to 22.\n\nFirst read?",
        outcome: "continue",
        choices: [
          {
            label: "RSI under 30 means buy",
            next: "wrong_oversold_buy",
          },
          {
            label: "In a downtrend RSI can stay oversold for a long time. The trend comes first",
            next: "trend",
          },
          {
            label: "Ignore price. RSI alone decides the trade",
            next: "wrong_rsi_only",
          },
        ],
      },
      wrong_oversold_buy: {
        message:
          "Oversold says recent closes were weak, not that they are about to turn. In a strong downtrend that weakness can continue.\n\nBack to the read.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_rsi_only: {
        message:
          "RSI is built from price. Reading it without the price structure throws away the main evidence.\n\nBack to the read.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      trend: {
        message:
          "What would make a bounce idea worth considering?",
        outcome: "continue",
        choices: [
          {
            label: "Price stops making lower lows, forms a higher low, and reclaims the moving average",
            next: "range",
          },
          {
            label: "RSI falls to 15, even more oversold",
            next: "wrong_deeper",
          },
        ],
      },
      wrong_deeper: {
        message:
          "A deeper oversold reading means the selling got stronger. Look for the price structure to change instead.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "trend",
      },
      range: {
        message:
          "Later the chart moves sideways between 50.00 and 55.00. Price tags 55.00 and RSI reads 75.\n\nRead?",
        outcome: "continue",
        choices: [
          {
            label: "Inside a range, overbought near the top is a fair 'stretched, do not chase' read",
            next: "success",
          },
          {
            label: "Overbought means it has to crash",
            next: "wrong_crash",
          },
        ],
      },
      wrong_crash: {
        message:
          "Overbought is a stretch reading, not a forecast. It is most useful as a 'do not chase' cue at the top of a range.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "range",
      },
      success: {
        message:
          "Session complete. Trend first, then the oscillator. RSI extremes help most inside a range.\n\nNext: Learn → Indicators, then Practice → Trend vs range.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default rsiVsTrendSession;

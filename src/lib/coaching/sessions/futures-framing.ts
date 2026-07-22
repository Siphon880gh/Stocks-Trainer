import type { CoachingSession } from "../types";

/** Multi-market SAMPLE framing — futures decide packs (not a LIVE desk). */
export const futuresFramingSession: CoachingSession = {
  meta: {
    slug: "futures-framing",
    title: "Frame a SAMPLE futures decision",
    summary:
      "After equities fluency: how to approach index/commodity-style SAMPLE cases without LIVE theater.",
    topic: "Multi-market decisions",
    tags: ["futures", "multi-market", "sample", "explorer"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "You open Navigator → Futures → DECIDE_CASES on SAMPLE data.\n\nFirst framing choice?",
        outcome: "continue",
        choices: [
          {
            label: "Treat futures packs as a LIVE order-routing simulator",
            next: "wrong_live_desk",
          },
          {
            label: "Same decide→reveal process as equities, on SAMPLE futures tape",
            next: "process",
          },
          {
            label: "Skip the chart gate because futures are advanced",
            next: "wrong_skip_gate",
          },
        ],
      },
      wrong_live_desk: {
        message:
          "No LIVE desk, fills, or brokerage here — SAMPLE educational packs only.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_skip_gate: {
        message:
          "Chart soft-gate still applies across asset classes. Advanced topic ≠ skip fluency.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      process: {
        message:
          "Brief shows a stylized risk-off dump on an index future.\n\nHow do you act under anti-hindsight rules?",
        outcome: "continue",
        choices: [
          {
            label: "Peek at aftermath OHLC before locking a decision",
            next: "wrong_peek",
          },
          {
            label: "Lock BUY/SELL/HOLD on the pre tape, then read the process debrief",
            next: "success",
          },
        ],
      },
      wrong_peek: {
        message:
          "Aftermath stays hidden until you lock — peeking breaks the teaching loop.\n\nRevisit how you act.",
        outcome: "wrong",
        choices: [],
        rewind_to: "process",
      },
      success: {
        message:
          "Session complete. Futures here = SAMPLE decide packs with the same process rules.\n\nNext: Navigator → Futures DECIDE_CASES (or Market Explorer path).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresFramingSession;

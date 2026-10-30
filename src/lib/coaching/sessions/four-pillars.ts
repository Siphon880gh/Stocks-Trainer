import type { CoachingSession } from "../types";

/** The four pillars on a SAMPLE reclaim: map the level, confirm on the close, set invalidation and size, then context. */
export const fourPillarsSession: CoachingSession = {
  meta: {
    slug: "four-pillars",
    title: "Map, confirm, invalidate, size",
    summary:
      "Run the four pillars on a reclaim: draw the level, wait for the close you chose in advance, write down the invalidation, size from it, and let context pick full, half or pass.",
    topic: "Trade management",
    tags: ["sample", "equities", "price-action", "trade-management"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE stock, daily chart. Price bounced off about 42.00 three times (lows 42.00, 42.02, 41.98), then a daily close at 41.80 broke it.\n\nPillar 1, the map: what do you draw?",
        outcome: "continue",
        choices: [
          { label: "One line at 42.00: three touches make it significant", next: "test" },
          { label: "A zone from 41.20 to 43.60 so every wick fits", next: "wrong_zone" },
        ],
      },
      wrong_zone: {
        message:
          "A zone that wide makes every outcome look like a hold. Draw one precise line where price touched, reacted and moved away, then judge closes against it.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      test: {
        message:
          "Pillar 2, confirmation. You decided in advance: \"a daily close back above 42.00\". Today price spikes to 42.10 intraday but closes at 41.85.\n\nAct?",
        outcome: "continue",
        choices: [
          { label: "No: that was a wick, a test. The close is still below", next: "reclaim" },
          { label: "Yes: it traded above 42.00, close enough", next: "wrong_early" },
        ],
      },
      wrong_early: {
        message:
          "\"Close enough\" is front-running the confirmation you chose. A wick is a test; a close is a statement.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "test",
      },
      reclaim: {
        message:
          "Next day closes at 42.50, back above 42.00, with a low of 41.75. That is your confirmation.\n\nPillar 3: what is the invalidation, decided before you buy?",
        outcome: "continue",
        choices: [
          { label: "A daily close below 41.75, the reclaim candle's low", next: "size" },
          { label: "I'll watch it and decide if it drops", next: "wrong_none" },
        ],
      },
      wrong_none: {
        message:
          "Deciding while it drops is how a small loss becomes a large one. Write down the exact close that proves you wrong before entry.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "reclaim",
      },
      size: {
        message:
          "Entry 42.50, invalidation 41.75: 0.75 a share. You risk at most 300 on a trade.\n\nHow many shares?",
        outcome: "continue",
        choices: [
          { label: "400: 300 ÷ 0.75", next: "context" },
          { label: "1,000: this setup is too good to size small", next: "wrong_confidence" },
        ],
      },
      wrong_confidence: {
        message:
          "1,000 × 0.75 = 750 at risk, two and a half times your limit. The math controls size, not confidence.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "size",
      },
      context: {
        message:
          "Pillar 4. Same setup on another day: the index has chopped sideways for two weeks and CPI comes out tomorrow before the open.\n\nWhat size?",
        outcome: "continue",
        choices: [
          { label: "Half size (about 200 shares) or pass", next: "success" },
          { label: "Full 400: the setup passed three pillars", next: "wrong_context" },
        ],
      },
      wrong_context: {
        message:
          "Context decides full, half or pass. A choppy market and a catalyst overnight both argue for less size, even with a clean setup.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "context",
      },
      success: {
        message:
          "Session complete: one precise level, a close (not a wick) as the confirmation, invalidation written before entry, size from the math, and context choosing the size. Exits are a separate plan: see the price action trading framework.\n\nNext: Playbooks → Price action in four pillars, Learn → Price Action: Four Pillars, and Cases → Four pillars 1–3.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default fourPillarsSession;

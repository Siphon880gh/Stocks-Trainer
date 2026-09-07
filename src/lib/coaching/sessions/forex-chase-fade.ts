import type { CoachingSession } from "../types";

/** Chase vs fade on a SAMPLE FX rumor spike — not a live desk. */
export const forexChaseFadeSession: CoachingSession = {
  meta: {
    slug: "forex-chase-fade",
    title: "Chase vs fade a SAMPLE FX spike",
    summary:
      "A thin rumor spike on a SAMPLE pair is still a source-quality problem. Practice only, not a live FX desk.",
    topic: "Headline decisions",
    tags: ["forex", "fx", "chase-vs-fade", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: EUR/USD spikes on chat that a central-bank surprise is coming. No official print yet.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Treat chat volume as confirmed news and chase the spike",
            next: "wrong_chase_chat",
          },
          {
            label: "Separate rumor vs official print, then ask if the spike is already in the tape",
            next: "priced",
          },
          {
            label: "This app is a live dealing desk — size like a bank",
            next: "wrong_desk",
          },
        ],
      },
      wrong_chase_chat: {
        message:
          "Chat is not a print. Chasing a thin spike skips source humility.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_desk: {
        message:
          "No live desk, spreads, or fills here — SAMPLE educational packs only.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The spike already embeds a lot of optimism.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the next tick so you do not miss the rest of the move",
            next: "wrong_buy_tick",
          },
          {
            label: "Fade or hold a sized line until an official print confirms",
            next: "horizon",
          },
          {
            label: "Ignore the brief and trade only the last candle shape",
            next: "wrong_candle_only",
          },
        ],
      },
      wrong_buy_tick: {
        message:
          "Buying an already-extended rumor spike is classic chase.\n\nRevisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      wrong_candle_only: {
        message:
          "Candle shape alone drops the rumor-vs-print check this drill teaches.\n\nRevisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      horizon: {
        message:
          "You chose fade-or-hold for a print. Which horizon matches?",
        outcome: "continue",
        choices: [
          {
            label: "Abandon in a few seconds if the spike does not fade",
            next: "wrong_horizon",
          },
          {
            label: "Give the rumor a confirmation window — hours to the next official note",
            next: "success",
          },
        ],
      },
      wrong_horizon: {
        message:
          "A panic timer mismatches a rumor-vs-print thesis.\n\nReturn to the horizon choice.",
        outcome: "wrong",
        choices: [],
        rewind_to: "horizon",
      },
      success: {
        message:
          "Session complete. You treated an FX spike as rumor vs print, not a chase.\n\nNext: Cases → forex.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexChaseFadeSession;

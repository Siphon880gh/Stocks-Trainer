import type { CoachingSession } from "../types";

/** SAMPLE FX data-print walk — not a live NFP desk. */
export const forexNfpPrintSession: CoachingSession = {
  meta: {
    slug: "forex-nfp-print",
    title: "Map a SAMPLE jobs print on FX",
    summary:
      "Hot SAMPLE payrolls can reprice the dollar in one tick. Map the print before chasing EUR/USD.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "macro-print", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: U.S. payrolls print hotter than expected. EUR/USD drops on the first tick. This is practice data, not a live print.\n\nWhat do you map first?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the first tick because FX always follows the headline number",
            next: "wrong_chase_tick",
          },
          {
            label: "Map the print to the dollar and rates, then to this pair's sensitivity",
            next: "map",
          },
          {
            label: "Ignore the print and trade only the five-minute candle",
            next: "wrong_ignore_print",
          },
        ],
      },
      wrong_chase_tick: {
        message:
          "The first tick is often the worst fill in the story. You skipped mapping the print.\n\nReturn to what you map first.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_ignore_print: {
        message:
          "A jobs print is the catalyst this drill teaches. Candle-only drops the brief.\n\nReturn to what you map first.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      map: {
        message:
          "Hot payrolls can keep U.S. rates higher, which often supports the dollar versus EUR.\n\nWhat stance fits a thin SAMPLE tape that already moved?",
        outcome: "continue",
        choices: [
          {
            label: "Buy EUR/USD immediately so you do not miss the reversal",
            next: "wrong_fade_blind",
          },
          {
            label: "Do not chase; hold or wait until the spread and the first spike settle",
            next: "horizon",
          },
          {
            label: "Treat this app as a live FX desk and size like a bank",
            next: "wrong_desk",
          },
        ],
      },
      wrong_fade_blind: {
        message:
          "Blindly fading a data spike is still a chase in the other direction. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "map",
      },
      wrong_desk: {
        message:
          "No live desk, spreads-as-fills, or brokerage here — SAMPLE education only.\n\nRevisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "map",
      },
      horizon: {
        message:
          "You waited instead of chasing. Last check: which clock matches a data-print thesis?",
        outcome: "continue",
        choices: [
          {
            label: "Abandon in thirty seconds if EUR/USD does not snap back",
            next: "wrong_timer",
          },
          {
            label: "Give the print a confirmation window (minutes to the session), not a panic timer",
            next: "success",
          },
        ],
      },
      wrong_timer: {
        message:
          "A thirty-second abandon clock mismatches a payrolls map. Process needs a confirmation window.\n\nReturn to the horizon check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "horizon",
      },
      success: {
        message:
          "Session complete. You mapped the SAMPLE jobs print to the dollar, then refused to chase the first tick.\n\nNext: Cases → forex (data-print briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexNfpPrintSession;

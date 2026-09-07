import type { CoachingSession } from "../types";

/** SAMPLE crude geopolitics — name which side the contract is on. */
export const futuresCrudeSupplySession: CoachingSession = {
  meta: {
    slug: "futures-crude-supply",
    title: "Supply shock on SAMPLE crude",
    summary:
      "A SAMPLE shipping or geopolitics scare can lift crude. Name tightness versus demand scare before chasing CL.",
    topic: "Multi-market decisions",
    tags: ["futures", "supply", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE crude future: a shipping lane is disrupted. Front-month CL jumps. This is not a live oil desk.\n\nFirst question?",
        outcome: "continue",
        choices: [
          {
            label: "Sell crude because geopolitics always means recession",
            next: "wrong_recession",
          },
          {
            label: "Ask whether this headline tightens supply or hits demand first",
            next: "channel",
          },
          {
            label: "Skip the brief and trade only yesterday's crude candle",
            next: "wrong_candle",
          },
        ],
      },
      wrong_recession: {
        message:
          "Scary words are not a channel. A lane disruption can tighten oil even while equities sell off.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_candle: {
        message:
          "The supply headline is the catalyst this drill teaches. Candle-only drops the channel.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      channel: {
        message:
          "If the story is barrels that cannot move, tightness can support the energy contract.\n\nWhat stance fits an already-jumped SAMPLE tape?",
        outcome: "continue",
        choices: [
          {
            label: "Chase CL because every shock is the last barrel",
            next: "wrong_chase",
          },
          {
            label: "Hold or size small; name tightness without paying the whole jump",
            next: "index",
          },
        ],
      },
      wrong_chase: {
        message:
          "Chasing the jump treats the headline as a fill. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "channel",
      },
      index: {
        message:
          "The same day, a SAMPLE index future (ES-style) dumps on the same geopolitics.\n\nHow do you keep the two tapes distinct?",
        outcome: "continue",
        choices: [
          {
            label: "Sell crude too because the index dumped",
            next: "wrong_copy_index",
          },
          {
            label: "Index risk-off is not automatic crude-off; keep the supply channel on CL",
            next: "success",
          },
        ],
      },
      wrong_copy_index: {
        message:
          "Copying the index onto crude skips which market the barrels sit in. Return to the index check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "index",
      },
      success: {
        message:
          "Session complete. You named supply tightness on SAMPLE crude instead of copying the index dump.\n\nNext: Cases → futures (energy / geopolitics briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresCrudeSupplySession;

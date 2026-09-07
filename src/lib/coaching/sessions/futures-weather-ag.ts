import type { CoachingSession } from "../types";

/** SAMPLE grain weather / harvest — not a live ag desk. */
export const futuresWeatherAgSession: CoachingSession = {
  meta: {
    slug: "futures-weather-ag",
    title: "Weather on a SAMPLE grain future",
    summary:
      "A SAMPLE drought or harvest scare is a supply story on the contract, not an automatic buy.",
    topic: "Multi-market decisions",
    tags: ["futures", "weather", "ag", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE corn future (ZC-style): a drought headline hits during pollination. The front month already jumped. Not a live contract.\n\nFirst framing?",
        outcome: "continue",
        choices: [
          {
            label: "Treat the drought tweet as a live weather API and buy size",
            next: "wrong_api",
          },
          {
            label: "Name this as a supply scare on the grain contract, then ask if the jump already priced it",
            next: "priced",
          },
          {
            label: "Ignore weather because futures are only index tapes",
            next: "wrong_index_only",
          },
        ],
      },
      wrong_api: {
        message:
          "This app has no live weather feed or ag desk. You skipped SAMPLE humility.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_index_only: {
        message:
          "Grain and energy futures are part of this class. Weather is a real SAMPLE catalyst here.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced: {
        message:
          "The jump already embeds a lot of tightness talk.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Chase the open so you do not miss the rest of the drought",
            next: "wrong_chase",
          },
          {
            label: "Hold or fade unless a new crop fact arrives beyond the first scare",
            next: "harvest",
          },
        ],
      },
      wrong_chase: {
        message:
          "Chasing a priced-in weather spike is the same mistake as chasing a rumor gap.\n\nRevisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced",
      },
      harvest: {
        message:
          "A later SAMPLE card shows harvest arriving larger than the scare implied.\n\nHow does that change the story?",
        outcome: "continue",
        choices: [
          {
            label: "Keep buying tightness because drought headlines never expire",
            next: "wrong_never_expire",
          },
          {
            label: "A larger harvest is a supply fact; re-decide instead of riding the old scare",
            next: "success",
          },
        ],
      },
      wrong_never_expire: {
        message:
          "Weather stories get updated by the crop. Revisit how harvest changes the brief.",
        outcome: "wrong",
        choices: [],
        rewind_to: "harvest",
      },
      success: {
        message:
          "Session complete. You treated weather as a SAMPLE supply story and refused to chase the first jump.\n\nNext: Cases → futures (ag / weather briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresWeatherAgSession;

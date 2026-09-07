import type { CoachingSession } from "../types";

/** SAMPLE dump with no reclaim — wait for the level, do not catch knives. */
export const cryptoDumpNoReclaimSession: CoachingSession = {
  meta: {
    slug: "crypto-dump-no-reclaim",
    title: "Dump with no reclaim on SAMPLE crypto",
    summary:
      "A SAMPLE breakdown that cannot reclaim the broken level is a wait, not an automatic bounce buy.",
    topic: "Multi-market decisions",
    tags: ["crypto", "reclaim", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE ether: a support level breaks on heavy range. Price dips, then fails to reclaim that level. Practice tape, not a live venue.\n\nFirst read?",
        outcome: "continue",
        choices: [
          {
            label: "Buy because crypto always returns to the old level",
            next: "wrong_always_return",
          },
          {
            label: "Name the break, then ask whether a reclaim actually printed",
            next: "reclaim",
          },
          {
            label: "Ignore levels and trade only influencer captions",
            next: "wrong_captions",
          },
        ],
      },
      wrong_always_return: {
        message:
          "Mean-reversion hope is not a reclaim. You skipped the tape test.\n\nReturn to the first read.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_captions: {
        message:
          "Captions are not a level. This drill is about dump versus reclaim.\n\nReturn to the first read.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      reclaim: {
        message:
          "No reclaim printed. The old support is now overhead.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Catch the knife so you get the bounce nobody else has",
            next: "wrong_knife",
          },
          {
            label: "Hold or wait; without a reclaim there is no bounce thesis yet",
            next: "later",
          },
        ],
      },
      wrong_knife: {
        message:
          "Buying a failed reclaim is a knife catch. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "reclaim",
      },
      later: {
        message:
          "A later SAMPLE bar tags the broken level from below and stalls.\n\nWhat does that bar do?",
        outcome: "continue",
        choices: [
          {
            label: "It proves the bounce; buy immediately",
            next: "wrong_tag_is_bounce",
          },
          {
            label: "A tag from below is still a test, not a reclaim; wait for acceptance back above",
            next: "success",
          },
        ],
      },
      wrong_tag_is_bounce: {
        message:
          "Touching a level from below is not acceptance above it. Return to the later-bar check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "later",
      },
      success: {
        message:
          "Session complete. You required a SAMPLE reclaim instead of buying a dump because crypto always bounces.\n\nNext: Cases → crypto (breakdown / no-reclaim briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoDumpNoReclaimSession;

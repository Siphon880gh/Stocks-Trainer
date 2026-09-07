import type { CoachingSession } from "../types";

/** SAMPLE gold future as haven — not automatic buy, not the same as ES. */
export const futuresGoldHavenSession: CoachingSession = {
  meta: {
    slug: "futures-gold-haven",
    title: "Gold as a SAMPLE haven, not ES",
    summary:
      "Risk-off can bid SAMPLE gold while the index dumps. Name the haven side before chasing GC.",
    topic: "Multi-market decisions",
    tags: ["futures", "gold", "risk-off", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE tape: ES dumps on risk-off while GC-style gold jumps. Not a live metals desk.\n\nFirst question?",
        outcome: "continue",
        choices: [
          {
            label: "Sell gold too because the index dumped",
            next: "wrong_copy_es",
          },
          {
            label: "Ask whether gold is on the haven side of this scare",
            next: "side",
          },
          {
            label: "Buy unlimited gold because havens never fade",
            next: "wrong_never_fade",
          },
        ],
      },
      wrong_copy_es: {
        message:
          "Copying the index onto gold skips which metal sits on the scare. Return to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_never_fade: {
        message:
          "Haven is a role, not a buy button. Gold can be extended too.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      side: {
        message:
          "Gold already jumped with the scare. No live vault or futures fill here.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Chase GC so you do not miss the rest of the haven bid",
            next: "wrong_chase",
          },
          {
            label: "Hold or wait; name the haven without paying the whole jump",
            next: "realrate",
          },
        ],
      },
      wrong_chase: {
        message:
          "Chasing an extended haven spike is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "side",
      },
      realrate: {
        message:
          "A later SAMPLE card shows real yields rising while the scare fades.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Keep buying gold because the old scare headline is still on the brief",
            next: "wrong_stale",
          },
          {
            label: "Re-decide: a fading scare plus higher real yields is a new gold tape",
            next: "success",
          },
        ],
      },
      wrong_stale: {
        message:
          "Stale scare copy is not a new fact. Return to the later card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "realrate",
      },
      success: {
        message:
          "Session complete. You kept SAMPLE gold on the haven side without copying ES or chasing the jump.\n\nNext: Cases → futures (gold / risk-off briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresGoldHavenSession;

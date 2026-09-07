import type { CoachingSession } from "../types";

/** SAMPLE scheduled print plus a geopolitics headline on the same future. */
export const futuresCombinedSession: CoachingSession = {
  meta: {
    slug: "futures-combined",
    title: "Print plus headline on SAMPLE futures",
    summary:
      "A SAMPLE inventory or crop print can disagree with a geopolitics headline. Match fact to path, then name your clock.",
    topic: "Multi-market decisions",
    tags: ["futures", "combined", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE crude: the inventory print shows more barrels, and the headline is a shipping disruption. Front month chopped.\n\nWhat do you separate first?",
        outcome: "continue",
        choices: [
          {
            label: "Treat the disruption headline as the whole story and ignore the print",
            next: "wrong_headline_only",
          },
          {
            label: "Match the print (past barrels) to the headline (path), then name your clock",
            next: "clock",
          },
          {
            label: "Trust the louder chat over the scheduled print",
            next: "wrong_chat",
          },
        ],
      },
      wrong_headline_only: {
        message:
          "A headline can still fail if the print already added supply. Return to what you separate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_chat: {
        message:
          "Scheduled prints outrank chat. Combined drills teach both channels.\n\nReturn to what you separate.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      clock: {
        message:
          "You named barrels versus path.\n\nHow does horizon change the answer?",
        outcome: "continue",
        choices: [
          {
            label: "One answer fits every clock — ignore how long you meant to hold",
            next: "wrong_one",
          },
          {
            label: "State session versus weeks; HOLD can be fair if the two facts fight",
            next: "settle",
          },
        ],
      },
      wrong_one: {
        message:
          "Combined cards can award wait when facts fight. Revisit horizon.",
        outcome: "wrong",
        choices: [],
        rewind_to: "clock",
      },
      settle: {
        message:
          "Midday SAMPLE: the disruption fades, the extra barrels remain.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Keep the disruption thesis because it was scarier",
            next: "wrong_scary",
          },
          {
            label: "Re-weight toward the print that is still on the card; still no live desk",
            next: "success",
          },
        ],
      },
      wrong_scary: {
        message:
          "Scare ranking is not a process. Return to midday.",
        outcome: "wrong",
        choices: [],
        rewind_to: "settle",
      },
      success: {
        message:
          "Session complete. You matched a SAMPLE print to a headline and named the clock.\n\nNext: Cases → futures (combined briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresCombinedSession;

import type { CoachingSession } from "../types";

/** SAMPLE earnings on the underlying — beat/miss without calls. */
export const optionsEarningsNoChainSession: CoachingSession = {
  meta: {
    slug: "options-earnings-no-chain",
    title: "Earnings on the stock, no chain",
    summary:
      "A SAMPLE report still grades as a stock print. Beat versus miss does not unlock calls or puts here.",
    topic: "Options context",
    tags: ["options", "options-context", "earnings", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: the company reports tonight. The stock is coiled. The UI has no chain.\n\nHow do you frame the report?",
        outcome: "continue",
        choices: [
          {
            label: "Buy a straddle because earnings are an options event",
            next: "wrong_straddle",
          },
          {
            label: "Treat it as a stock print with a wide overnight range, not a chain simulator",
            next: "edge",
          },
          {
            label: "Skip earnings context because this class is only for professionals",
            next: "wrong_skip",
          },
        ],
      },
      wrong_straddle: {
        message:
          "There is no straddle to buy. Earnings are still a stock binary here.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_skip: {
        message:
          "Anyone who will decide on the stock can practice event context.\n\nReturn to framing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      edge: {
        message:
          "You have no directional edge into the print.\n\nWhat stock stance matches tonight?",
        outcome: "continue",
        choices: [
          {
            label: "Force a buy so you participate in the gap",
            next: "wrong_force",
          },
          {
            label: "Hold into the print unless a new fact besides the known report shows up",
            next: "after",
          },
        ],
      },
      wrong_force: {
        message:
          "No edge into a known report is a hold on the stock. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "edge",
      },
      after: {
        message:
          "SAMPLE next morning: the print beats, the stock gaps, then chops.\n\nWhat now?",
        outcome: "continue",
        choices: [
          {
            label: "Exercise imaginary calls because the beat went your way",
            next: "wrong_exercise",
          },
          {
            label: "Re-decide on the post-print stock; the beat is now priced unless a second fact appears",
            next: "success",
          },
        ],
      },
      wrong_exercise: {
        message:
          "There were no calls. Return to the morning card.",
        outcome: "wrong",
        choices: [],
        rewind_to: "after",
      },
      success: {
        message:
          "Session complete. You graded SAMPLE earnings as a stock print with no chain.\n\nNext: Cases → options context (earnings-on-underlying briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default optionsEarningsNoChainSession;

import type { CoachingSession } from "../types";

/** Entry, stop at invalidation, target and size written down before the click (SAMPLE). */
export const tradePlanBeforeEntrySession: CoachingSession = {
  meta: {
    slug: "trade-plan-before-entry",
    title: "Plan the trade before you click",
    summary:
      "Write the entry, the price that proves the idea wrong, and the target before entering. Size from the stop, not from hope.",
    topic: "Trade management",
    tags: ["all-markets", "price-action", "trade-management", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: price broke above a range high at 105.00 and is now retesting that level from above at 105.40. You like the idea.\n\nWhat comes first?",
        outcome: "continue",
        choices: [
          {
            label: "Buy now and decide where to get out later",
            next: "wrong_no_plan",
          },
          {
            label: "Write the entry, the price that proves the idea wrong, and the target before entering",
            next: "stop",
          },
          {
            label: "Buy because the last candle was green",
            next: "wrong_green",
          },
        ],
      },
      wrong_no_plan: {
        message:
          "Deciding the exit after you are in means deciding while you are losing money. The plan is written before the click.\n\nBack to the setup.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_green: {
        message:
          "One green candle is not an edge. The edge here is the breakout and retest of 105.00, and it needs a plan.\n\nBack to the setup.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      stop: {
        message:
          "Good. The idea is: the old range high now acts as support.\n\nWhere does the stop belong?",
        outcome: "continue",
        choices: [
          {
            label: "Exactly 1.00 below entry, wherever that lands",
            next: "wrong_fixed",
          },
          {
            label: "Just below the retest low, back inside the old range (about 104.60): where the breakout has failed",
            next: "target",
          },
          {
            label: "No stop. If it drops I will wait for it to come back",
            next: "wrong_hope",
          },
        ],
      },
      wrong_fixed: {
        message:
          "A fixed distance ignores the chart. The stop goes where the idea is proven wrong, here a move back inside the range.\n\nPick the stop again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "stop",
      },
      wrong_hope: {
        message:
          "Waiting for it to come back is hope, not a plan. A failed breakout can keep falling.\n\nPick the stop again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "stop",
      },
      target: {
        message:
          "Stop at 104.60 means 0.80 of risk per share from 105.40. The next resistance is 107.00, 1.60 above entry.\n\nWhat do you check before entering?",
        outcome: "continue",
        choices: [
          {
            label: "Reward 1.60 against risk 0.80 is about 2 to 1. Size the position so 0.80 times the shares fits my maximum loss",
            next: "success",
          },
          {
            label: "Skip sizing. The target is all that matters",
            next: "wrong_size",
          },
        ],
      },
      wrong_size: {
        message:
          "The target says what you might make. The stop and the size say what you can lose, and that is what keeps you in the game.\n\nCheck again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "target",
      },
      success: {
        message:
          "Session complete. Entry from a defined edge, stop at invalidation, target and size before the click.\n\nNext: Learn → Price Action, then Practice → Invalidation to place stops on SAMPLE charts.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default tradePlanBeforeEntrySession;

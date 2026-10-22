import type { CoachingSession } from "../types";

/** Fresh vs tested demand zone, invalidation below the zone, and the zone flip (SAMPLE). */
export const supplyDemandZoneRetestSession: CoachingSession = {
  meta: {
    slug: "supply-demand-zone-retest",
    title: "Fresh zone or tested zone?",
    summary:
      "Read a demand zone by how price left it and how often it has been tested. Put the stop beyond the zone, and notice when a zone flips.",
    topic: "Chart skills",
    tags: ["all-markets", "price-action", "supply-demand"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE chart: price based tightly between 40.00 and 41.00, then left with a strong impulse to 46.00. Now it drifts back toward 41.00 for the first time.\n\nHow do you read the 40.00 to 41.00 area?",
        outcome: "continue",
        choices: [
          {
            label: "A fresh demand zone: the first return is usually the best-quality test",
            next: "plan",
          },
          {
            label: "Any price touched before is equally strong forever",
            next: "wrong_forever",
          },
          {
            label: "Zones only exist on daily charts of large stocks",
            next: "wrong_only",
          },
        ],
      },
      wrong_forever: {
        message:
          "Zones matter because of unfilled orders left behind by a strong move. Each test uses some of them up, so zones are not equally strong forever.\n\nBack to the read.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_only: {
        message:
          "Supply and demand zones are a way to read any chart where price based and then moved hard, on any time frame.\n\nBack to the read.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      plan: {
        message:
          "Price reaches 41.20 and prints a candle that rejects the lows. You consider a long.\n\nWhere is the idea proven wrong?",
        outcome: "continue",
        choices: [
          {
            label: "On a close below 40.00, the bottom of the zone",
            next: "second",
          },
          {
            label: "Anywhere under 41.20: the tighter the better",
            next: "wrong_inside",
          },
        ],
      },
      wrong_inside: {
        message:
          "A stop inside the zone sits in the very area buyers are expected to defend, so normal wicks hit it. The idea fails below the zone.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "plan",
      },
      second: {
        message:
          "Weeks later price returns a third time. Each bounce from the zone has been weaker, and this time price slices into it.\n\nRead?",
        outcome: "continue",
        choices: [
          {
            label: "Each test has absorbed buyers. The zone is weaker now, and a close below 40.00 would flip it into supply",
            next: "success",
          },
          {
            label: "The third touch is the strongest, so buy a bigger size",
            next: "wrong_bigger",
          },
        ],
      },
      wrong_bigger: {
        message:
          "Weaker bounces on each return mean fewer buyers are left. A heavily tested zone deserves less trust, not more size.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "second",
      },
      success: {
        message:
          "Session complete. Fresh beats tested, the stop sits beyond the zone, and a broken demand zone can turn into supply.\n\nNext: Learn → Supply & Demand Zones, then Buy or Sell? for zone charts.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default supplyDemandZoneRetestSession;

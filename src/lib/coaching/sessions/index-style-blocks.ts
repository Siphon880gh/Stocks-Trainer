import type { CoachingSession } from "../types";

/** Index and style: weighting rules, overlap across style funds, size and region slices held in a written mix. */
export const indexStyleBlocksSession: CoachingSession = {
  meta: {
    slug: "index-style-blocks",
    title: "What your index fund really holds",
    summary:
      "Size, region and style funds as building blocks: how market-cap weighting makes an index top-heavy, why three style funds can be one bet, and how to hold small-cap and international slices without chasing them.",
    topic: "Market themes",
    tags: ["sample", "market-themes", "equities", "index-funds"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. A friend says \"the S&P 500 fund owns 500 companies, so each one barely matters\".\n\nWhat is the better frame?",
        outcome: "continue",
        choices: [
          { label: "It is market-cap weighted: the biggest companies count for much more than the smallest", next: "weights" },
          { label: "Every company has the same weight", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "SEC Investor.gov: in a market-cap-weighted index, companies with a higher market cap account for a greater share. Equal weight is a different, non-traditional index.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      weights: {
        message:
          "State Street's SPY file (Nov 11, 2026): top 10 lines ≈ 36.9%; Apple ≈ 7.9%.\n\nHow does that compare with equal weighting?",
        outcome: "continue",
        choices: [
          { label: "Equal weight would be about 0.2% each, so 10 companies would be about 2%, not 37%", next: "overlap" },
          { label: "It is about the same", next: "wrong_weights" },
        ],
      },
      wrong_weights: {
        message:
          "100 ÷ 500 = 0.2% each. Cap weighting puts far more in the largest companies.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "weights",
      },
      overlap: {
        message:
          "You add a large-cap growth fund and a Nasdaq-100 fund to the S&P 500 fund.\n\nWhat did you add?",
        outcome: "continue",
        choices: [
          { label: "Mostly more of the same megacaps; real variety comes from size or region slices", next: "slices" },
          { label: "Three separate styles of risk", next: "wrong_overlap" },
        ],
      },
      wrong_overlap: {
        message:
          "All three are cap-weighted large-cap indexes with the same giants near the top. FINRA: check holdings, not labels.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "overlap",
      },
      slices: {
        message:
          "Your plan holds small-cap and international slices. Small caps lagged all year; international just jumped on a weaker dollar.\n\nWhat does the plan do?",
        outcome: "continue",
        choices: [
          { label: "Keep the target weights and rebalance on schedule, instead of dumping one and chasing the other", next: "success" },
          { label: "Sell small caps and move the money to international", next: "wrong_slices" },
        ],
      },
      wrong_slices: {
        message:
          "That swaps a plan for last year's returns. Rebalancing trims what ran and adds to what lagged, on a calendar or a threshold.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "slices",
      },
      success: {
        message:
          "Session complete. Read the weighting rule and top holdings, count overlap, and hold size and region slices in a written mix. Funds named are examples, not recommendations.\n\nNext: Practice → Index and style, the rebalancing Playbook, and the cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default indexStyleBlocksSession;

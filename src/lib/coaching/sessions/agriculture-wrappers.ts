import type { CoachingSession } from "../types";

/** Crops, fertilizer and equipment: which side of the farm budget does the news hit? */
export const agricultureWrappersSession: CoachingSession = {
  meta: {
    slug: "agriculture-wrappers",
    title: "Crops, fertilizer and tractors",
    summary:
      "Read a WASDE surprise, a natural gas spike and a farm-income forecast, and decide which wrapper each one hits: a crop futures fund, a nitrogen maker, a potash miner or an equipment maker.",
    topic: "Market themes",
    tags: ["sample", "futures", "market-themes", "agriculture", "risk"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. The noon WASDE cuts projected corn ending stocks; stocks-to-use falls from 13.3% to 8.0%.\n\nWhat does that tell you?",
        outcome: "continue",
        choices: [
          { label: "The market has less cushion, which usually supports prices and makes weather surprises matter more", next: "fund" },
          { label: "Corn prices must double this year", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "Stocks-to-use is context, not a price target. It tells you how sensitive the market is, not how far it will move.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      fund: {
        message:
          "You want corn exposure in a stock account.\n\nWhat does a corn futures fund like CORN actually hold?",
        outcome: "continue",
        choices: [
          { label: "Corn futures across several delivery months, rolled on published dates; it can differ from today's cash price", next: "nitrogen" },
          { label: "Corn in silos, so it equals the cash price", next: "wrong_fund" },
        ],
      },
      wrong_fund: {
        message:
          "Teucrium's fund holds CBOT futures across delivery months and lists its roll dates. It also issues a K-1.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "fund",
      },
      nitrogen: {
        message:
          "Gas jumps from $3 to $9 per million Btu; ammonia stays near $500 a ton.\n\nWhat happens to a nitrogen maker's margin over gas?",
        outcome: "continue",
        choices: [
          { label: "About $401 → $203 a ton: gas is roughly 33 million Btu per ton (USDA ERS)", next: "tractor" },
          { label: "It rises, because fertilizer demand is strong", next: "wrong_nitrogen" },
        ],
      },
      wrong_nitrogen: {
        message:
          "Gas is 72–85% of ammonia production cost. If gas triples and fertilizer prices do not, the margin shrinks no matter how strong demand is.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "nitrogen",
      },
      tractor: {
        message:
          "USDA forecasts lower farm income after a year of falling crop prices.\n\nWhich wrapper is most exposed?",
        outcome: "continue",
        choices: [
          { label: "An equipment maker: tractors are big purchases farmers can postpone", next: "success" },
          { label: "A Treasury bill fund", next: "wrong_tractor" },
        ],
      },
      wrong_tractor: {
        message:
          "T-bills do not depend on farm budgets. Equipment orders do, and they fall first when income drops.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "tractor",
      },
      success: {
        message:
          "Session complete. Crops trade the balance sheet, inputs trade their margins, equipment trades farm income. Ask which side of the farm budget the news hits.\n\nNext: Practice → Agriculture and inputs, and the cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default agricultureWrappersSession;

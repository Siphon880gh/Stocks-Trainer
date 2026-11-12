import type { CoachingSession } from "../types";

/** Gold and silver views: driver first, then trust vs futures vs miner fund, sizing miners for their swing. */
export const preciousMetalsWrappersSession: CoachingSession = {
  meta: {
    slug: "precious-metals-wrappers",
    title: "Gold view, which wrapper",
    summary:
      "Turn a gold or silver view into a position: name the driver, compare a bullion trust, a gold futures contract and a miner fund, read AISC margins, and size miners for their bigger swings.",
    topic: "Market themes",
    tags: ["sample", "futures", "market-themes", "gold", "risk"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. You expect real yields to fall over the next year and think gold will benefit.\n\nWhich statement about that view is fair?",
        outcome: "continue",
        choices: [
          { label: "Lower real yields cut the cost of holding gold, which often helps it; the link varies and the dollar and official buying matter too", next: "wrapper" },
          { label: "Gold always rises exactly when yields fall", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "Real yields are one driver among several. The World Gold Council's figures show central banks bought over 1,000 tonnes a year in 2022–2024, a support that had little to do with yields.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrapper: {
        message:
          "You want a one-year hold in an ordinary account, without margin calls.\n\nTrust, futures contract or miner fund?",
        outcome: "continue",
        choices: [
          { label: "A bullion trust: it tracks spot gold less a fee, with no roll and no margin", next: "miner" },
          { label: "One gold futures contract: the purest exposure", next: "wrong_wrapper" },
        ],
      },
      wrong_wrapper: {
        message:
          "A gold contract covers 100 troy ounces (CME), so it is large and leveraged; it expires and must be rolled, and margin can be raised. That suits sized, short-term futures trading, not a hands-off year.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "wrapper",
      },
      miner: {
        message:
          "A friend prefers a gold miner fund \"for more upside\". Gold is $2,400 and a typical miner's AISC is $1,450.\n\nIf gold falls 10%, what happens to that margin per ounce?",
        outcome: "continue",
        choices: [
          { label: "From $950 to $710, about −25%; miners magnify the metal both ways, so size them smaller", next: "silver" },
          { label: "About −10%, the same as gold", next: "wrong_miner" },
        ],
      },
      wrong_miner: {
        message:
          "Costs stay put while revenue falls: 2,160 − 1,450 = 710. That operating leverage is the \"more upside\", and it is also more downside.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "miner",
      },
      silver: {
        message:
          "You consider swapping some gold for silver because \"it's the same trade, cheaper\".\n\nWhat is different about silver?",
        outcome: "continue",
        choices: [
          { label: "More than half its demand is industrial, so it also follows factories and solar; it usually swings more than gold", next: "success" },
          { label: "Nothing; silver is just cheaper gold", next: "wrong_silver" },
        ],
      },
      wrong_silver: {
        message:
          "The Silver Institute put 2024 industrial demand at a record 680.5 million ounces, more than half the total. A recession can hit silver even when gold holds.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "silver",
      },
      success: {
        message:
          "Session complete. Name the driver, pick the wrapper that owns it, and size miners and silver for bigger swings.\n\nNext: Practice → Precious metals, and the metals cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default preciousMetalsWrappersSession;

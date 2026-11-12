import type { CoachingSession } from "../types";

/** Bitcoin exposure: the coin, a spot ETP, CME futures or miner stocks, and the weekend gap. */
export const bitcoinWrappersSession: CoachingSession = {
  meta: {
    slug: "bitcoin-wrappers",
    title: "Bitcoin: coin, ETP, futures or miners",
    summary:
      "Choose between holding the coin, a spot bitcoin exchange-traded product, a futures-based fund or a miner stock. Read the weekend gap, the fee and custody trade-off, and why miners are businesses first.",
    topic: "Market themes",
    tags: ["sample", "crypto", "market-themes", "etf", "risk"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. Bitcoin trades all weekend. A spot bitcoin ETP trades only during stock market hours. Bitcoin falls 6% between Friday's close and Monday's open.\n\nWhat do you expect from the ETP on Monday?",
        outcome: "continue",
        choices: [
          { label: "It likely opens near the lower level, a gap, because its shares could not trade while the coin did", next: "fee" },
          { label: "It will be unchanged because it was closed all weekend", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "The ETP holds bitcoin, so its value moved with the coin all weekend. When trading reopens the price catches up at once. A stop-loss order cannot fill in between: it fills at the first available price.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      fee: {
        message:
          "Holding the coin yourself has no fund fee but you manage keys or an exchange account. The ETP charges an annual expense ratio and holds the coin with a custodian.\n\nWhich statement is fair?",
        outcome: "continue",
        choices: [
          { label: "It's a trade-off: convenience and a brokerage account vs a yearly fee; neither removes bitcoin's own price risk", next: "approval" },
          { label: "The ETP is safer because it is regulated, so it can't fall much", next: "wrong_fee" },
        ],
      },
      wrong_fee: {
        message:
          "When the SEC approved spot bitcoin ETPs in January 2024, its chair stressed that this was not an endorsement of bitcoin. The wrapper changes custody and access, not volatility.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "fee",
      },
      approval: {
        message:
          "An older bitcoin fund holds CME futures instead of coins.\n\nWhat extra thing should you watch?",
        outcome: "continue",
        choices: [
          { label: "The futures curve: rolling in contango can make it lag the spot price over time", next: "miner" },
          { label: "Nothing: futures and spot are always equal", next: "wrong_approval" },
        ],
      },
      wrong_approval: {
        message:
          "Futures usually trade above spot when the market pays to wait (contango), and the fund pays that gap each time it rolls. Over months the gap between fund and coin can be large.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "approval",
      },
      miner: {
        message:
          "A bitcoin miner stock fell while bitcoin rose this quarter.\n\nWhat is the most likely reading?",
        outcome: "continue",
        choices: [
          { label: "It is a business: power costs, network difficulty, debt or share issuance can outweigh the coin price", next: "success" },
          { label: "The market made a mistake; it must catch up soon", next: "wrong_miner" },
        ],
      },
      wrong_miner: {
        message:
          "Miners earn coins minus the cost of earning them. If power prices or difficulty rise, or the company sells new shares, the stock can lag bitcoin for a long time. There is no rule that forces it to catch up.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "miner",
      },
      success: {
        message:
          "Session complete. Coin, spot ETP, futures fund and miner are four different exposures to one theme. Pick by what you want to own, then size for gaps.\n\nNext: Practice → Same theme, different wrapper, and the bitcoin ETP case in Cases → Crypto.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default bitcoinWrappersSession;

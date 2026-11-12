import type { CoachingSession } from "../types";

/** One theme, several wrappers: a futures fund that lags spot, a miner that over- or under-shoots, a trust that tracks spot less a fee. */
export const exposureWrappersSession: CoachingSession = {
  meta: {
    slug: "exposure-wrappers",
    title: "Same theme, three wrappers",
    summary:
      "You like a commodity view. Decide whether a trust, a futures-based fund, a producer stock or a futures contract fits it, read roll cost and operating leverage, and check what the fund actually owns before you buy.",
    topic: "Market themes",
    tags: ["sample", "all-markets", "market-themes", "etf", "futures", "risk"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. Oil has been rising and you want to own the move. A fund with \"oil\" in its name is down while spot crude is up over the same three months.\n\nWhat is the first thing to check?",
        outcome: "continue",
        choices: [
          { label: "What the fund owns: spot barrels, futures contracts or oil company shares", next: "roll" },
          { label: "Nothing: the name says oil, so it must track oil", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "A fund's name describes a theme, not a holding. Most oil funds hold futures (storing barrels is impractical), and some hold producer stocks. The prospectus says which, and that decides what it tracks.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      roll: {
        message:
          "It holds the front-month future at 70.00 and must roll into the next month at 70.70.\n\nWhat does that do to the fund?",
        outcome: "continue",
        choices: [
          { label: "About a 1% drag for that roll in contango: it sells low and buys the pricier contract, so it can lag spot even when spot is flat", next: "miner" },
          { label: "Nothing: the roll is free and the fund equals spot", next: "wrong_roll" },
        ],
      },
      wrong_roll: {
        message:
          "(70.70 − 70.00) ÷ 70.00 ≈ 1.0%. Repeat that every month and contango can cost several percent a year. In backwardation the roll can add instead. FINRA and the CFTC both warn that futures-based funds may not track spot.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "roll",
      },
      miner: {
        message:
          "Now gold. A miner produces at an all-in cost of $1,400 an ounce while gold is $2,000. Gold rises 10%.\n\nWhat happens to the miner's margin per ounce, if costs hold still?",
        outcome: "continue",
        choices: [
          { label: "From $600 to $800, about +33%: operating leverage. It cuts both ways, and costs, debt, hedges and country risk can swamp it", next: "trust" },
          { label: "Exactly +10%, the same as gold", next: "wrong_miner" },
        ],
      },
      wrong_miner: {
        message:
          "Revenue rises 10% but costs stay put, so profit moves more than the metal: 2,200 − 1,400 = 800 vs 600. The same math works in reverse when gold falls, and miners also carry company risks that gold does not.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "miner",
      },
      trust: {
        message:
          "A physically backed gold trust holds bullion in a vault and charges an expense ratio.\n\nWhich statement fits?",
        outcome: "continue",
        choices: [
          { label: "It tracks spot gold less fees, with no roll; I still pay the fee every year and may face different tax treatment, so I read the prospectus", next: "pick" },
          { label: "It tracks gold with zero cost and zero risk", next: "wrong_trust" },
        ],
      },
      wrong_trust: {
        message:
          "The fee is taken out of the metal held, so the trust drifts below spot over time, and gold itself can fall a long way. Physically backed is a structure, not a guarantee.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "trust",
      },
      pick: {
        message:
          "You want gold's price for several years, without leverage or rolling, in an ordinary brokerage account.\n\nWhich wrapper fits that goal best?",
        outcome: "continue",
        choices: [
          { label: "A physically backed trust, sized like any other position, after reading its fee and tax notes", next: "success" },
          { label: "A gold futures contract held through expiry", next: "wrong_pick" },
        ],
      },
      wrong_pick: {
        message:
          "A futures contract is leveraged, expires and must be rolled or closed, and the exchange can raise margin quickly. It suits short, sized trades by approved futures accounts, not a hands-off multi-year hold.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "pick",
      },
      success: {
        message:
          "Session complete. Name the exposure you want, then pick the wrapper that owns it: trust for spot less fees, futures fund for the curve, producer stock for a business with operating leverage, futures for leveraged short-term exposure.\n\nNext: Practice → Same theme, different wrapper, and the wrapper cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default exposureWrappersSession;

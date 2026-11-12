import type { CoachingSession } from "../types";

/** A dollar or euro view: index weights, trust vs futures fund, and carry from rate differentials. */
export const currencyFundsDollarSession: CoachingSession = {
  meta: {
    slug: "currency-funds-dollar",
    title: "Dollar view, which wrapper",
    summary:
      "Turn a view on the dollar into a position: read what the dollar index is weighted toward, compare a currency trust with a futures-based fund, and see how rate differentials show up as carry.",
    topic: "Market themes",
    tags: ["sample", "forex", "fx", "market-themes", "etf"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. Headlines say \"the dollar fell\" because the dollar index dropped. You think the dollar will weaken against the Mexican peso.\n\nDoes the dollar index measure that?",
        outcome: "continue",
        choices: [
          { label: "No: it is about 58% euro and uses six currencies; the peso is not one of them", next: "trust" },
          { label: "Yes: it measures the dollar against every currency equally", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "ICE's dollar index weights the euro 57.6%, yen 13.6%, pound 11.9%, Canadian dollar 9.1%, krona 4.2% and Swiss franc 3.6%. A move in the index is mostly a move in EUR/USD.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      trust: {
        message:
          "A euro trust holds euro deposits. The euro falls from 1.1000 to 1.0670 over a year; the deposits earn 2% and the trust charges 0.40%.\n\nRoughly what did a US holder get?",
        outcome: "continue",
        choices: [
          { label: "About −1.5%: −3.0% from the currency, about +2% interest, −0.4% fee, before taxes", next: "carry" },
          { label: "About +2%: the interest is all that counts", next: "wrong_trust" },
        ],
      },
      wrong_trust: {
        message:
          "(1.0670 ÷ 1.1000 − 1) = −3.0%; × 1.02 for interest and − 0.4% fee ≈ −1.5%. Interest helps and the fee hurts, but the exchange rate moved more than either. For a currency fund, the rate is usually the biggest piece.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "trust",
      },
      carry: {
        message:
          "A bullish-dollar fund holds dollar index futures. US rates are higher than euro rates.\n\nWhy might that fund earn a little even if the index is flat?",
        outcome: "continue",
        choices: [
          { label: "Futures prices build in the interest-rate differential, so the fund collects a carry while rates stay apart; it can reverse when rates converge", next: "intervene" },
          { label: "Because funds always go up when the index is flat", next: "wrong_carry" },
        ],
      },
      wrong_carry: {
        message:
          "Currency futures are priced off spot plus the rate gap between the two currencies. Holding the higher-yielding side earns that gap; holding the lower one pays it. It is a modest edge that a currency move can wipe out.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "carry",
      },
      intervene: {
        message:
          "You hold a yen trust. Japan's finance ministry is reported to be buying yen after a steep fall.\n\nWhat should you plan for?",
        outcome: "continue",
        choices: [
          { label: "Sharp, fast moves in either direction; size small and don't assume one intervention sets a floor", next: "success" },
          { label: "The yen can only go up from here", next: "wrong_intervene" },
        ],
      },
      wrong_intervene: {
        message:
          "Interventions can move a currency several percent in hours, and the effect can fade if rate gaps stay wide. Treat it as volatility, not a guarantee.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "intervene",
      },
      success: {
        message:
          "Session complete. Know what the index you quote is weighted toward, know whether your fund holds deposits or futures, and count currency, interest and fees separately.\n\nNext: Practice → Currency funds and the dollar, and the currency fund cases in Cases → Forex.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default currencyFundsDollarSession;

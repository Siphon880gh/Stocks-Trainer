import type { CoachingSession } from "../types";

/** Reading a too-good backtest: the risk-premium ETF portfolio with a VIX overlay (Predicting Alpha), its gaps and its tail risks. */
export const readABacktestSession: CoachingSession = {
  meta: {
    slug: "read-a-backtest",
    title: "Read a too-good backtest",
    summary:
      "A video shows $100k turning into $1.2M with a diversified ETF mix plus a short-VIX overlay. Check the weights, the missing rules, the timing, the short-volatility tail, the leverage and the sales pitch before believing it.",
    topic: "Risk",
    tags: ["sample", "all-markets", "risk", "volatility"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "A YouTube video shows a portfolio turning $100,000 into $1,215,306: 18.4% a year, Sharpe 1.22, worst drawdown −20.1%. It ends with \"You can have this too!\" and a link to a paid service.\n\nWhat are you looking at?",
        outcome: "continue",
        choices: [
          { label: "The creator's own backtest: a simulation, not a track record", next: "weights" },
          { label: "Proof the strategy makes 18% a year", next: "wrong_proof" },
        ],
      },
      wrong_proof: {
        message:
          "A backtest shows how rules would have done on past data, chosen and run by the person selling them. Nobody outside has audited it, and the future will not repeat the test period.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      weights: {
        message:
          "The base mix is SPY 35, TLT 30, GLD 20, FXE 10, DBC 5. The creator says the weights come from each asset's economic role, not from what backtested best.\n\nWhy does that matter?",
        outcome: "continue",
        choices: [
          { label: "Weights tuned to past results fit that history's noise (overfitting)", next: "rules" },
          { label: "It doesn't: the best-backtesting weights are always the best going forward", next: "wrong_weights" },
        ],
      },
      wrong_weights: {
        message:
          "Weights picked because they maximised a past result are fitted to that past. Weights picked for a reason (growth, rates, inflation, currency) at least have a reason to keep working.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "weights",
      },
      rules: {
        message:
          "Each asset has a trend filter, and a VIX overlay shorts VXX when the volatility risk premium looks positive. The video does not give the lookbacks, thresholds or sizing formula.\n\nWhat follows?",
        outcome: "continue",
        choices: [
          { label: "You cannot reproduce the result, and filling the gaps by testing many versions is overfitting", next: "timing" },
          { label: "Use any 10-month average and you will get 18.4% too", next: "wrong_rules" },
        ],
      },
      wrong_rules: {
        message:
          "A 10-month moving average is a common textbook trend rule, not the video's. Different parameters give different results, and the overlay's rules matter even more.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "rules",
      },
      timing: {
        message:
          "The test computes signals 30 minutes before the close and trades market-on-close, and charges $0.005 a share and 3.5% a year to borrow VXX.\n\nIs that good or bad practice?",
        outcome: "continue",
        choices: [
          { label: "Good: it avoids look-ahead bias and models costs", next: "tail" },
          { label: "Bad: costs never matter for ETFs", next: "wrong_timing" },
        ],
      },
      wrong_timing: {
        message:
          "Costs and borrow fees add up, especially on a short-volatility sleeve that trades often. Deciding before the close and filling at the close is how a test avoids using information it would not have had.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "timing",
      },
      tail: {
        message:
          "In the 2020 COVID crash, the video says, VXX rallied more than 400%. Suppose a short VXX position was 20% of the account.\n\nWhat happens if it is held through the rally?",
        outcome: "continue",
        choices: [
          { label: "About 80% of the whole account is lost (20% × 400%)", next: "leverage" },
          { label: "At most 20%: you can only lose the sleeve", next: "wrong_tail" },
        ],
      },
      wrong_tail: {
        message:
          "A short position loses the rally times its size, with no cap. That is why the video calls sizing and exposure limits central, and why it flips long when the VIX curve inverts.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "tail",
      },
      leverage: {
        message:
          "With the overlay on top of a fully invested portfolio, exposure is about 120%.\n\nWhat does that add?",
        outcome: "continue",
        choices: [
          { label: "Bigger losses when things go wrong, plus margin calls at bad times", next: "success" },
          { label: "Nothing: diversified portfolios can't lose much", next: "wrong_leverage" },
        ],
      },
      wrong_leverage: {
        message:
          "In 2022 stocks and long bonds fell together. Leverage on a mix whose cushion fails makes the drawdown deeper, and a broker can demand more margin right then.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "leverage",
      },
      success: {
        message:
          "Session complete. The building blocks (diversifying across risk premiums, trend filters, harvesting the volatility risk premium with strict limits, avoiding inverse-volatility products) are well researched. This exact recipe is a backtest with missing rules, shown before a sales pitch.\n\nNext: Practice → Risk-premium portfolio and the VIX overlay, Learn → Risk Premiums, Trend Filters & the VIX, and the volatility cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default readABacktestSession;

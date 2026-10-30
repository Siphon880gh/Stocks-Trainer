import type { CoachingSession } from "../types";

/** VIX futures for beginners: the contract, not the headline index; the curve; the multiplier; daily-reset funds; expected value, win rate vs size and the underestimated tail. */
export const vixFuturesCurveSession: CoachingSession = {
  meta: {
    slug: "vix-futures-curve",
    title: "Right forecast, losing trade",
    summary:
      "A hypothetical VIX futures trade: spot VIX does what you expected and you still lose. Work out why, then read the curve, the multiplier, a daily inverse fund and an expected-value model with an underestimated tail before deciding whether to trade VIX at all.",
    topic: "Risk",
    tags: ["sample", "futures", "options", "risk", "volatility"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "Hypothetical numbers. After a shock, spot VIX is 40 and a VIX future trades at 30. You short one standard contract at 30, expecting fear to ease.\n\nA week later spot VIX is 35, just as you expected. The future is also 35, and you buy it back. What is your result?",
        outcome: "continue",
        choices: [
          { label: "A 5-point loss, −$5,000: the future rose from 30 to 35", next: "curve" },
          { label: "A profit: spot VIX fell, so the short worked", next: "wrong_spot" },
        ],
      },
      wrong_spot: {
        message:
          "You don't own spot VIX. A short future pays only if that contract falls. At 30 it already priced in a lot of calming down; you sold at 30 and bought back at 35.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      curve: {
        message:
          "Next trade. The front future (F1) is 18 and the second month (F2) is 20: slope (20 ÷ 18 − 1) × 100 ≈ +11.1%.\n\nWhat is that number?",
        outcome: "continue",
        choices: [
          { label: "Contango between two contracts: a price comparison, not a return", next: "level" },
          { label: "About 11% a month a short will collect", next: "wrong_slope" },
        ],
      },
      wrong_slope: {
        message:
          "The slope compares two prices today. It isn't a yield or a backtested return, and the whole curve can move up while it stays in contango.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "curve",
      },
      level: {
        message:
          "You short F1 at 18. A week later the curve is 24 / 25: still contango.\n\nWhere does the short stand?",
        outcome: "continue",
        choices: [
          { label: "Down 6 points, −$6,000 per standard contract, despite the contango", next: "margin" },
          { label: "Fine: contango always favors shorts", next: "wrong_level" },
        ],
      },
      wrong_level: {
        message:
          "Carry from contango is conditional. When volatility rises, the futures price rise can be far bigger than anything convergence pays. Waiting for backwardation would not have stopped this loss.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "level",
      },
      margin: {
        message:
          "Your broker asked for margin to open that short. Is the margin the most you can lose?",
        outcome: "continue",
        choices: [
          { label: "No: it's collateral; losses are marked to market and can exceed it", next: "fund" },
          { label: "Yes: margin caps the loss", next: "wrong_margin" },
        ],
      },
      wrong_margin: {
        message:
          "Futures are marked to market daily. Adverse moves bring margin calls or forced liquidation, and a 10-point move on one VX contract is $10,000 whatever the margin was.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "margin",
      },
      fund: {
        message:
          "A friend prefers a fund that targets −1x a VIX futures index each day. Its benchmark goes 100 → 120 → 100.\n\nWhere does $100 in an idealized version of the fund end up?",
        outcome: "continue",
        choices: [
          { label: "About $93.33: daily compounding makes it path-dependent", next: "tail" },
          { label: "$100: the benchmark ended unchanged", next: "wrong_fund" },
        ],
      },
      wrong_fund: {
        message:
          "Day 1: −20% takes $100 to $80. Day 2: +16.67% applies to $80, giving $93.33. The SEC warns daily-reset funds can behave very differently from their benchmark over longer periods.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "fund",
      },
      tail: {
        message:
          "Hypothetical model for a short-volatility plan: short one VX future at 20 and hold to settlement. 90% calm, it settles at 16 (+$4,000); 10% spike to 36 (−$16,000). Expected P/L = 0.90 × $4,000 + 0.10 × (−$16,000) = +$2,000 before costs.\n\nBut you underestimated the tail: the spike settles at 70 (−$50,000). Same 90% win rate. What is the plan's expected P/L now?",
        outcome: "continue",
        choices: [
          { label: "−$1,400: the bigger tail flipped the sign; the +$2,000 was model-implied, not evidence", next: "verdict" },
          { label: "Still positive: it wins 90% of the time", next: "wrong_tail" },
        ],
      },
      wrong_tail: {
        message:
          "0.90 × $4,000 + 0.10 × (−$50,000) = −$1,400. A high win rate says nothing about the size of the rare loss: 19 wins of $100 and one $3,000 loss is 95% winners and −$1,100. A usable edge needs a credible distribution, real costs, out-of-sample testing and capital to survive the losses on the way.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "tail",
      },
      verdict: {
        message:
          "So: is VIX a valid play for you right now?",
        outcome: "continue",
        choices: [
          { label: "A legitimate market with a documented but conditional premium: paper-trade it first or skip it", next: "success" },
          { label: "Yes: shorting volatility is steady income", next: "wrong_verdict" },
        ],
      },
      wrong_verdict: {
        message:
          "The volatility risk premium is real on average and paid for with rare, very large losses. Short volatility can wipe out an account in a day. No position is a valid outcome.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "verdict",
      },
      success: {
        message:
          "Session complete. Judge the contract you hold, not the headline index; read the curve's level as well as its slope; size in dollars ($1,000 a point on VX, margin is not the limit); model a fund's daily reset; and weigh the rare big loss, not the win rate: price the edge as expected value after costs, knowing an underestimated tail can flip its sign.\n\nNext: Practice → VIX trading for beginners, Learn → VIX Trading: Futures, Curve & Products, and the VIX cases in Cases → Futures.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default vixFuturesCurveSession;

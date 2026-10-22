/**
 * Glossary terms for momentum oscillators, the volatility stop, float and short-dated options.
 * Definitions follow the public sources in oscillatorSources.ts (each fetched and checked). Educational, not advice.
 */
import type { LiteracyTerm } from "./literacyTerms";

export const OSCILLATOR_TERMS: LiteracyTerm[] = [
  {
    id: "momentum-oscillator",
    name: "Momentum oscillator",
    category: "process",
    summary: "An indicator that measures how fast or how far price has moved recently, usually on a fixed scale such as 0–100.",
    detail:
      "RSI, the stochastic oscillator and KDJ are all momentum oscillators, and all three are computed from the same recent prices. That is why they usually agree: three of them reading overbought together is close to one reading, not three independent confirmations. Overbought and oversold describe a stretch; in a strong trend a reading can stay there for a long time. Check something different instead, such as the trend, a level, or the plan's risk. Educational, not a buy or sell signal.",
  },
  {
    id: "fast-stochastic",
    name: "Fast stochastic oscillator (%K, %D)",
    category: "process",
    summary: "Where today's close sits inside the last n bars' high-low range, 0–100.",
    detail:
      "%K = (close − lowest low of n bars) ÷ (highest high of n bars − lowest low) × 100, usually n = 14. %D is the 3-bar simple average of %K. Above 80 is read as overbought, below 20 as oversold, and %K crossing %D is the usual trigger. Because it reacts to every bar it gives more false signals than the slow version, and very strong trends can keep it above 80 or below 20. Practice it in the Oscillators & volatility stop lab (SIMULATED). Educational, not advice.",
  },
  {
    id: "slow-stochastic",
    name: "Slow stochastic oscillator",
    category: "process",
    summary: "The fast stochastic smoothed once more, so it crosses less often.",
    detail:
      "Slow %K = fast %K smoothed with a 3-bar simple average, which is exactly fast %D. Slow %D = the 3-bar average of slow %K. Same information, less noise: fewer crossovers and fewer false signals, at the cost of turning a little later. Educational, not advice.",
  },
  {
    id: "kdj",
    name: "KDJ indicator",
    category: "process",
    summary: "A stochastic variant: K and D smoothed from the raw stochastic, plus J = 3K − 2D.",
    detail:
      "Start from the raw stochastic over n bars (usually 9), called RSV. K = 2/3 × previous K + 1/3 × RSV; D = 2/3 × previous D + 1/3 × K; both start at 50; J = 3K − 2D. J amplifies the gap between K and D, so it turns first, can go above 100 or below 0, and gives more false signals in choppy or volatile markets. Some platforms smooth with a 3-bar average instead, so their values differ. KDJ and the fast stochastic are close relatives: agreement between them is not independent confirmation. Educational, not advice.",
  },
  {
    id: "average-true-range",
    name: "Average true range (ATR)",
    category: "markets",
    summary: "The average size of a bar's full range, gaps included: a volatility measure, not a direction.",
    detail:
      "True range is the largest of high − low, |high − previous close| and |low − previous close|, so a gap counts. ATR averages it with a running smoothing (first value = the mean of the first n true ranges; then (previous ATR × (n − 1) + today's TR) ÷ n). Rising ATR means wider swings, in either direction. Traders size stops and positions with it. Educational, not advice.",
  },
  {
    id: "volatility-stop",
    name: "Volatility stop (ATR trailing stop)",
    category: "process",
    summary: "A trailing stop placed ATR × a multiplier away from the best close, which flips when price breaks it.",
    detail:
      "In an uptrend the stop sits at the highest close since the trend began minus ATR × multiplier (for example ATR 20 × 2) and never moves down; when the close falls through it, the trend flips and the stop moves above price (lowest close plus ATR × multiplier). It is one rule-based way to trail a stop. A stop level is where an exit order triggers, not a guaranteed price: if the market gaps through it, a stop order fills at the next available price, which can be far worse. Past volatility may not match future volatility. Educational, not advice.",
  },
  {
    id: "public-float",
    name: "Float (public float)",
    category: "markets",
    summary: "The shares actually available for the public to trade.",
    detail:
      "Float is shares outstanding minus shares that are locked up or held by insiders and other restricted holders; data vendors draw the line differently, so float figures differ. A small float means fewer shares to trade, so unusual volume can move the price sharply, in either direction, with wider spreads. Educational, not advice.",
  },
  {
    id: "float-turnover",
    name: "Float turnover",
    category: "markets",
    summary: "Volume ÷ float: how many times the float's worth of shares traded in the period.",
    detail:
      "If 12 million shares trade in a day and the float is 4 million, turnover is 3×. High turnover shows heavy trading activity; it does not mean every share changed hands (the same shares can trade many times), and it does not reliably predict a reversal or the next move. Educational, not advice.",
  },
  {
    id: "theta-decay",
    name: "Theta (time decay)",
    category: "position",
    summary: "How much value an option loses each day from the passage of time.",
    detail:
      "All else equal, an option's time value shrinks as expiration approaches, and the decay speeds up near expiration. Theta works against option buyers and in favor of sellers. A buyer who holds a short-dated contract needs the move to come quickly. Educational, not advice.",
  },
  {
    id: "short-dated-option",
    name: "Short-dated option (vs holding an option briefly)",
    category: "position",
    summary: "A contract close to expiration, which is not the same as holding any option for a short time.",
    detail:
      "Holding period is how long you own the contract; time to expiration is how long the contract has left. You can hold a six-month option for one day, or buy a contract that expires today. Short-dated contracts are cheap per contract but very sensitive to the underlying's price and to time decay: a buyer can lose the whole premium in hours. Large percentage gains on them are not representative or repeatable; the same move against you takes the premium to zero. Educational, not advice.",
  },
  {
    id: "indicator-not-signal",
    name: "Indicators support decisions, not signals",
    category: "process",
    summary: "An indicator reading is evidence for a plan, not a buy or sell order by itself.",
    detail:
      "RSI, MACD, stochastics, KDJ and ATR describe what price has already done. They can support a decision, but an entry still needs a position size, an exit plan (where you are wrong and where you take profit) and a defined risk limit for the trade and the account. The same market can give very different results depending on sector, timing and risk management. Educational, not advice.",
  },
];

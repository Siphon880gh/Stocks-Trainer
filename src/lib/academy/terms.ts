/**
 * BA10.M2: Beginner Academy glossary terms (order types, account math, options strategies).
 * Spread into LITERACY_TERMS like FINANCIAL_TERMS (type-only import: no runtime cycle).
 * Sibling terms that already exist are linked, not copied: `trailing-stop`, `market-order-vs-limit`,
 * `bid-ask`, `risk-reward`, `entry-types`, `taking-profit`, `liquidity`, `volatility`, `diversification`.
 * Educational definitions, not investment advice.
 */
import type { LiteracyTerm } from "../literacyTerms";

/** Existing terms the Academy links to instead of redefining (terms.test.ts checks they exist). */
export const ACADEMY_SIBLING_TERM_IDS = ["trailing-stop", "market-order-vs-limit", "bid-ask", "risk-reward", "entry-types", "taking-profit", "liquidity", "volatility", "diversification"] as const;

export const ACADEMY_TERMS: LiteracyTerm[] = [
  {
    id: "market-order",
    name: "Market order",
    category: "process",
    summary: "Buy or sell now at the best price available. It fills, but the price is not fixed.",
    detail:
      "A market order trades against the best offer (to buy) or the best bid (to sell). In a liquid stock that is close to the last price; in a thin stock, or right after news, the fill can be worse than the price you saw. In the Academy's paper account a market order fills at the next bar's open. Simulated rule, not a broker's.",
  },
  {
    id: "limit-order",
    name: "Limit order",
    category: "process",
    summary: "Buy at the limit price or lower, or sell at the limit price or higher. The price is protected; the fill is not.",
    detail:
      "A buy limit at 50 will never pay more than 50, but if price never trades down to 50 it never fills. A sell limit at 55 never sells for less than 55. If the market opens through your limit (a buy limit at 50 when the stock opens at 48), you get the better price. Pair with `market-order-vs-limit` in the glossary.",
  },
  {
    id: "stop-order",
    name: "Stop order",
    category: "process",
    summary: "Sleeps until price touches the stop level, then becomes a market order.",
    detail:
      "A sell stop at 45 under a stock trading at 50 is a protective exit: if price trades at or below 45, it sells at the next available price. A gap down to 42 fills near 42, not 45, so a stop limits a loss but does not cap it exactly. A buy stop above the market enters on strength (a breakout).",
  },
  {
    id: "stop-limit-order",
    name: "Stop-limit order",
    category: "process",
    summary: "A stop that turns into a limit instead of a market order. It controls price but may not fill at all.",
    detail:
      "Sell stop-limit: stop 45, limit 44. When price trades at 45 the order becomes a sell limit at 44, so it will not sell below 44. If the stock gaps from 46 straight to 40, the limit is never reached and you still own the shares while it falls. That missed exit is the trade-off for price control.",
  },
  {
    id: "time-in-force",
    name: "Time in force",
    category: "process",
    summary: "How long an order stays working: for one session (day) or until filled or cancelled (GTC).",
    detail:
      "Every order has a lifetime. A day order that does not fill expires when the session ends. A good-'til-cancelled order keeps working across sessions (real brokers usually cap it, often at a few months). Forgotten GTC orders can fill long after you stopped watching.",
  },
  {
    id: "day-order",
    name: "Day order",
    category: "process",
    summary: "An order that expires at the end of the session if it has not filled.",
    detail: "Use it when the idea only makes sense today. In the Academy's paper account one bar is one session, so a day order works for the next bar only and then expires.",
  },
  {
    id: "good-til-canceled",
    name: "Good 'til cancelled (GTC)",
    category: "process",
    summary: "An order that keeps working session after session until it fills or you cancel it.",
    detail: "Useful for a protective stop or a patient limit you do not want to re-enter each day. Review open GTC orders: a plan can change while the order still waits.",
  },
  {
    id: "buying-power",
    name: "Buying power",
    category: "position",
    summary: "Cash you can still spend: cash minus what open buy orders already hold back.",
    detail:
      "In a cash account, buying power = cash − cash reserved for working buy orders. Placing a buy limit for 10 shares at 50 holds back 500; cancelling it releases the 500. Margin accounts add borrowed money and are not part of the Academy's core (no margin, no shorting).",
  },
  {
    id: "cost-basis",
    name: "Cost basis",
    category: "position",
    summary: "What you paid for the shares you still hold, in total or per share (average cost).",
    detail:
      "Buy 10 at 50 and 10 at 60: cost basis 1,100, average cost 55. Selling shares does not change the average cost of the ones left. Profit or loss on a sale is measured against this average.",
  },
  {
    id: "realized-vs-unrealized-pnl",
    name: "Realised vs unrealised P&L",
    category: "position",
    summary: "Realised = locked in by a sale. Unrealised = paper gain or loss on shares you still hold.",
    detail:
      "Average cost 55, you sell 5 at 62: realised P&L = (62 − 55) × 5 = 35. The other 15 shares marked at 60 show unrealised P&L = (60 − 55) × 15 = 75, which can still change. Total P&L = realised + unrealised.",
  },
  {
    id: "account-equity",
    name: "Account equity",
    category: "position",
    summary: "What the account is worth right now: cash + the market value of every position.",
    detail: "Equity = cash + Σ shares × current price. It moves every time a price moves, even if you place no trades. Equity minus starting cash is the total profit or loss.",
  },
  {
    id: "drawdown",
    name: "Drawdown",
    category: "position",
    summary: "How far equity has fallen from its highest point so far.",
    detail:
      "If equity peaked at 11,000 and is now 9,900, the drawdown is 1,100, or 10%. Max drawdown is the worst such fall over a period. A 50% drawdown needs a 100% gain to get back, which is why risk rules aim to keep drawdowns small.",
  },
  {
    id: "position-sizing",
    name: "Position sizing",
    category: "process",
    summary: "Choosing how many shares to buy from how much you are willing to lose, not from how sure you feel.",
    detail:
      "Shares = (account × risk %) ÷ (entry − stop). With 10,000, 1% risk = 100; entry 50, stop 48 means 2 at risk per share, so 50 shares. A gap past the stop can still lose more than planned.",
  },
  {
    id: "paper-trading",
    name: "Paper trading",
    category: "process",
    summary: "Practising orders with virtual money. Mechanics and habits transfer; the emotions and fills of real money do not.",
    detail:
      "A simulated account lets you learn order types, sizing and exits without risk. Real trading adds slippage, partial fills, fees, taxes and the feeling of losing real money. Treat paper results as practice, not proof that a method works.",
  },
  {
    id: "slippage",
    name: "Slippage",
    category: "markets",
    summary: "The gap between the price you expected and the price you got.",
    detail: "It is largest for market and stop orders in fast or thin markets. Limit orders avoid paying more than the limit but may not fill. The Academy's paper account models gaps but not intrabar slippage.",
  },
  {
    id: "gap-risk",
    name: "Gap risk",
    category: "markets",
    summary: "Price can open far from the last close (after earnings, news, a weekend), jumping over your stop.",
    detail:
      "A stop at 45 is not a promise of an exit at 45: if the stock closes at 47 and opens at 40, a stop order fills near 40 and a stop-limit with a 44 limit may not fill at all. Smaller size is the main defence against gaps.",
  },
  {
    id: "r-multiple",
    name: "R-multiple",
    category: "process",
    summary: "A trade's result measured in units of the risk you planned (1R = entry minus stop, times shares).",
    detail: "Risk 100 and make 250: +2.5R. Lose 100: −1R. Measuring in R compares trades of different sizes and shows whether winners are big enough to pay for losers.",
  },
  {
    id: "option-premium",
    name: "Option premium",
    category: "markets",
    summary: "The price of an option, quoted per share. One contract covers 100 shares.",
    detail: "A premium of 2.50 costs 250 per contract (2.50 × 100). A buyer can lose the whole premium; a seller keeps it but takes on the obligation. The Academy gives premiums as numbers and does not price options.",
  },
  {
    id: "strike-price",
    name: "Strike price",
    category: "markets",
    summary: "The price at which an option lets the holder buy (call) or sell (put) the stock.",
    detail: "A 50 call gives the right to buy at 50; a 50 put gives the right to sell at 50. Payoff at expiration depends on where the stock is relative to the strike.",
  },
  {
    id: "expiration-date",
    name: "Expiration date",
    category: "markets",
    summary: "The last day an option exists. After it, the option is exercised, assigned or worthless.",
    detail: "An option that is out of the money at expiration expires worthless and the buyer loses the premium. The Academy's payoff charts show values at expiration only.",
  },
  {
    id: "options-exercise",
    name: "Exercise",
    category: "markets",
    summary: "The option holder uses the right: buys the stock at the strike (call) or sells it at the strike (put).",
    detail: "Holders normally exercise only when the option is in the money. Many traders sell the option instead of exercising it.",
  },
  {
    id: "options-assignment",
    name: "Assignment",
    category: "markets",
    summary: "The option seller is required to deliver: sell shares at the strike (short call) or buy them (short put).",
    detail:
      "Selling an option means you can be assigned. A covered call writer may have shares called away at the strike; a cash-secured put writer may have to buy 100 shares per contract at the strike, which is why the cash is set aside.",
  },
  {
    id: "options-breakeven",
    name: "Breakeven (options)",
    category: "markets",
    summary: "The stock price at expiration where the strategy neither makes nor loses money.",
    detail: "Long call: strike + premium. Long put: strike − premium. Covered call: stock cost − premium. Cash-secured put: strike − premium. Fees are ignored in the Academy.",
  },
  {
    id: "covered-call",
    name: "Covered call",
    category: "markets",
    summary: "Own 100 shares and sell one call against them: collect premium, give up gains above the strike.",
    detail:
      "Buy stock at 50, sell a 55 call for 1.00. Max gain = (55 − 50 + 1) × 100 = 600 per contract. Breakeven = 49. The downside is still almost the full stock loss, cushioned by the premium.",
  },
  {
    id: "cash-secured-put",
    name: "Cash-secured put",
    category: "markets",
    summary: "Sell a put and set aside the cash to buy 100 shares at the strike if assigned.",
    detail:
      "Sell a 45 put for 1.50 with 4,500 set aside. If the stock stays above 45 you keep 150. If assigned you own shares at an effective 43.50 (the breakeven). Max loss = (45 − 1.50) × 100 = 4,350 if the stock goes to zero.",
  },
  {
    id: "protective-put",
    name: "Protective put",
    category: "markets",
    summary: "Own the stock and buy a put: a floor under the position for the cost of the premium.",
    detail: "Stock at 50, buy a 45 put for 1.00: the worst case at expiration is (50 − 45 + 1) × 100 = 600 per 100 shares, while upside stays open minus the premium.",
  },
  {
    id: "collar",
    name: "Collar",
    category: "markets",
    summary: "Own the stock, buy a put below and sell a call above: a floor and a ceiling.",
    detail: "The call premium pays for some or all of the put. Both the loss and the gain are capped between the two strikes, adjusted by the net premium.",
  },
  {
    id: "vertical-spread",
    name: "Vertical spread",
    category: "markets",
    summary: "Buy one option and sell another of the same type and expiration at a different strike. Gain and loss are both capped.",
    detail:
      "Debit spread (e.g. buy 50 call, sell 55 call for 2.00 net): max loss = net debit, max gain = strike width − debit. Credit spread: max gain = net credit, max loss = width − credit.",
  },
  {
    id: "iron-condor",
    name: "Iron condor",
    category: "markets",
    summary: "A put credit spread plus a call credit spread: profits if the stock stays between the short strikes.",
    detail: "Max gain = total credit. Max loss = the wider spread's width − credit. There are two breakevens: short put − credit and short call + credit.",
  },
  {
    id: "etf",
    name: "ETF (exchange-traded fund)",
    category: "ownership",
    summary: "A fund that holds a basket (an index, a sector, bonds, commodities) and trades on an exchange like a stock.",
    detail: "One share gives exposure to the whole basket, which spreads single-company risk. Check what it holds, its yearly fee (expense ratio) and its trading volume before using it.",
  },
];

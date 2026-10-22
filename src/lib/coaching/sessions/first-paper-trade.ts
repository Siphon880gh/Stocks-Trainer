import type { CoachingSession } from "../types";

/** BA10.M4: planning a first paper trade in the Beginner Academy simulator (SIMULATED money, SAMPLE tape). */
export const firstPaperTradeSession: CoachingSession = {
  meta: {
    slug: "first-paper-trade",
    title: "Your first paper trade",
    summary:
      "Plan a first SIMULATED trade on a SAMPLE tape: pick the order type, size it from the stop, and place the stop as soon as the entry fills.",
    topic: "Trade management",
    tags: ["all-markets", "trade-management", "paper-trading", "academy"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "You open Paper trading with $10,000 of virtual cash. The SAMPLE stock last closed at $50.00 and you want to buy, but only if it dips to about $49.50.\n\nWhich order matches that plan?",
        outcome: "continue",
        choices: [
          { label: "A market buy now", next: "wrong_market" },
          { label: "A buy limit at $49.50", next: "limit" },
          { label: "A buy stop at $49.50", next: "wrong_buy_stop" },
        ],
      },
      wrong_market: {
        message:
          "A market order fills at the next open, whatever it is. Your plan names a price, so the order should name it too.\n\nGo back to the order choice.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_buy_stop: {
        message:
          "A buy stop sits above the price and fires when the price rises to it (a breakout entry). Below the price, a buy stop at $49.50 would trigger straight away. A dip entry is a buy limit.\n\nGo back to the order choice.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      limit: {
        message:
          "Right: a buy limit pays $49.50 or less, and may not fill at all if the dip never comes.\n\nYour stop will be $47.50, $2.00 below the entry. You risk 1% of the account per trade ($100). How many shares?",
        outcome: "continue",
        choices: [
          { label: "200 shares: put most of the cash to work", next: "wrong_all_in" },
          { label: "50 shares: $100 ÷ $2.00 risk per share", next: "sized" },
          { label: "2 shares: $100 ÷ $49.50", next: "wrong_price_divide" },
        ],
      },
      wrong_all_in: {
        message:
          "200 shares × $2.00 = $400 at risk, four times the plan. Size from the distance to the stop, not from the cash available.\n\nGo back to sizing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "limit",
      },
      wrong_price_divide: {
        message:
          "Dividing the risk budget by the share price ignores the stop. The loss at the stop is shares × (entry − stop).\n\nGo back to sizing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "limit",
      },
      sized: {
        message:
          "50 shares × $2.00 = $100 at the stop. The limit fills at $49.50 on the next bar.\n\nWhat do you do now?",
        outcome: "continue",
        choices: [
          { label: "Place a sell stop at $47.50 for the 50 shares right away", next: "stopped" },
          { label: "Wait and decide on a stop if it starts falling", next: "wrong_no_stop" },
          { label: "Place the stop at $45.00 so normal moves never hit it", next: "wrong_wide_stop" },
        ],
      },
      wrong_no_stop: {
        message:
          "Deciding mid-fall is how a planned $100 loss turns into a larger one. The plan already has a stop: place it with the entry.\n\nGo back to the step after the fill.",
        outcome: "wrong",
        choices: [],
        rewind_to: "sized",
      },
      wrong_wide_stop: {
        message:
          "With 50 shares a $45.00 stop risks $225, more than twice the plan. Moving the stop means resizing first.\n\nGo back to the step after the fill.",
        outcome: "wrong",
        choices: [],
        rewind_to: "sized",
      },
      stopped: {
        message:
          "The stop is working. Overnight, bad news gaps the stock to open at $46.80, below your stop.\n\nWhere does the sell stop fill in the simulator?",
        outcome: "continue",
        choices: [
          { label: "At $47.50, the stop price", next: "wrong_stop_price" },
          { label: "At the $46.80 open: a gap through a stop fills at the open", next: "success" },
        ],
      },
      wrong_stop_price: {
        message:
          "A stop becomes a market order once triggered. When the price gaps past it, the first price available is the open, so the loss is larger than planned (gap risk).\n\nGo back to the gap.",
        outcome: "wrong",
        choices: [],
        rewind_to: "stopped",
      },
      success: {
        message:
          "Session complete. You matched the order to the plan, sized from the stop, placed the stop with the entry and saw why gaps can still cost more. All of it was SIMULATED on a SAMPLE tape.\n\nNext: Academy → Paper trading, or the “Protect every entry” challenge.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default firstPaperTradeSession;

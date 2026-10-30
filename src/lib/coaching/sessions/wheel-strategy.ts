import type { CoachingSession } from "../types";

/** The wheel: pick the stock first, read the put's breakeven and collateral, then handle assignment, a crash, a rally and an annualized yield. */
export const wheelStrategySession: CoachingSession = {
  meta: {
    slug: "wheel-strategy",
    title: "Run the wheel without bag-holding",
    summary:
      "Sell a cash-secured put, take assignment, sell covered calls, get called away. Choose the stock before the premium, do the breakeven and collateral math, and decide what to do when the stock crashes or rips past your strike.",
    topic: "Options context",
    tags: ["sample", "options", "options-context", "wheel", "risk"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. A screener ranks a leveraged chip ETF first: its put pays 5.9% for a month. A steady company you already like pays 2.4% on a put 4% below its price.\n\nWhere does the wheel start?",
        outcome: "continue",
        choices: [
          { label: "With a stock I would be happy to own through a long fall; the premium comes second", next: "math" },
          { label: "With the highest premium on the screener", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "A high premium is the market's price for big expected moves. If the put is assigned you own the shares, so the stock has to be one you want, at a price you chose.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      math: {
        message:
          "The stock is at 52. You sell the 50 put, 30 days out, for 1.20.\n\nWhat is the cash commitment and the breakeven?",
        outcome: "continue",
        choices: [
          { label: "$5,000 set aside; breakeven 48.80 (strike − premium)", next: "strike" },
          { label: "$120 at risk; breakeven 51.20", next: "wrong_math" },
        ],
      },
      wrong_math: {
        message:
          "The $120 is what you collect, not what you risk. Cash-secured means strike × 100 = $5,000, and you lose money below 50 − 1.20 = 48.80 at expiration.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "math",
      },
      strike: {
        message:
          "The 50 put has a delta of about −0.25. A deeper 52 put pays more.\n\nHow do you read that?",
        outcome: "continue",
        choices: [
          { label: "Roughly a 25% chance of finishing in the money; more premium closer in means more assignments. Common practice, not a rule", next: "assigned" },
          { label: "Delta −0.25 means I can't be assigned", next: "wrong_strike" },
        ],
      },
      wrong_strike: {
        message:
          "Delta is a rough, changing guide. Any short American-style option can be assigned on any trading day, and a gap can take a low-delta put deep in the money overnight.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "strike",
      },
      assigned: {
        message:
          "The stock closes at 49 on expiration: you now own 100 shares at 50. Then guidance is cut and it falls to 35. A 40 call pays 0.25; a 50 call pays almost nothing.\n\nWhat is true?",
        outcome: "continue",
        choices: [
          { label: "About −$1,380 against the 48.80 basis; the premium only cushioned it. Sell if the reason to own broke, and don't sell calls that lock in a loss without meaning to", next: "rally" },
          { label: "It's fine: keep selling calls and the premium will cover it", next: "wrong_assigned" },
        ],
      },
      wrong_assigned: {
        message:
          "Calls above your basis pay little, and a 40 call exercised would lock in about −$855. Premium cannot repair a broken thesis: this is the bag-holding case.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "assigned",
      },
      rally: {
        message:
          "Different path: assigned at 50, you sell the 53 call for 0.90. A buyout rumor sends the stock to 62.\n\nWhat happens at expiration?",
        outcome: "continue",
        choices: [
          { label: "Called away at 53: +$510, the most this wheel could make; $900 above the strike goes to the call buyer", next: "yield" },
          { label: "I keep the shares and the whole gain", next: "wrong_rally" },
        ],
      },
      wrong_rally: {
        message:
          "A covered call sells the upside above the strike. Buying it back to keep the shares is a new bullish bet at today's price.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "rally",
      },
      yield: {
        message:
          "A tracker shows \"AROI 80%\" on a 7-day call: $1.00 on a $65 strike.\n\nHow should you read it?",
        outcome: "continue",
        choices: [
          { label: "1.5% for the week, annualized as if repeated all year with no losses; judge realized P/L after fees", next: "success" },
          { label: "I will make 80% this year", next: "wrong_yield" },
        ],
      },
      wrong_yield: {
        message:
          "1.00 ÷ 65 × 365 ÷ 7 ≈ 80%. One bad week (a gap through the strike) can erase months of these. Cboe's put-write index, run on the whole S&P 500, earned about the index's return with lower volatility, not 80%.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "yield",
      },
      success: {
        message:
          "Session complete. The wheel is a mainstream, conservative-tier options strategy: nearly the stock's downside, a capped upside, and premium as payment for that trade.\n\nNext: Practice → The wheel strategy, Learn → The Wheel: Cash-Secured Puts to Covered Calls, and the wheel cases in Cases → Options context.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default wheelStrategySession;

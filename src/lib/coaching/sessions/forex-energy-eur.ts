import type { CoachingSession } from "../types";

/** SAMPLE energy shock on EUR — name the buyer side of the currency. */
export const forexEnergyEurSession: CoachingSession = {
  meta: {
    slug: "forex-energy-eur",
    title: "Energy shock on SAMPLE EUR",
    summary:
      "A SAMPLE energy spike can hit EUR as a buyer of fuel. Name the currency's side before chasing the pair.",
    topic: "Multi-market decisions",
    tags: ["forex", "fx", "supply", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: a shipping scare lifts energy prices. EUR/USD sells off. Practice pair, not a live energy FX desk.\n\nFirst question?",
        outcome: "continue",
        choices: [
          {
            label: "Buy EUR because scary geopolitics always mean a euro bounce",
            next: "wrong_bounce",
          },
          {
            label: "Ask whether EUR sits on the energy-buyer side of this shock",
            next: "side",
          },
          {
            label: "Ignore energy and trade only yesterday's EUR candle",
            next: "wrong_candle",
          },
        ],
      },
      wrong_bounce: {
        message:
          "Scary words are not a bounce. EUR can be the buyer that pays more for fuel.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_candle: {
        message:
          "The energy channel is the catalyst this drill teaches.\n\nReturn to the first question.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      side: {
        message:
          "If Europe is paying more for barrels, EUR can stay heavy even while crude futures jump.\n\nWhat stance fits an already-sold SAMPLE pair?",
        outcome: "continue",
        choices: [
          {
            label: "Chase EUR/USD lower after the dump is extended",
            next: "wrong_chase",
          },
          {
            label: "Hold; name the buyer side without paying the whole dump",
            next: "usd",
          },
        ],
      },
      wrong_chase: {
        message:
          "Chasing an extended dump is still a chase. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "side",
      },
      usd: {
        message:
          "The same scare also bid the dollar on risk-off.\n\nHow do you keep the two channels distinct?",
        outcome: "continue",
        choices: [
          {
            label: "They are the same trade — always sell EUR when oil rises",
            next: "wrong_always",
          },
          {
            label: "Energy-buyer EUR and dollar haven can stack, but HOLD still beats chasing both",
            next: "success",
          },
        ],
      },
      wrong_always: {
        message:
          "Oil-up is not an automatic EUR-sell forever. Return to the dollar check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "usd",
      },
      success: {
        message:
          "Session complete. You named SAMPLE EUR as an energy buyer instead of chasing the dump.\n\nNext: Cases → forex (energy / EUR briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default forexEnergyEurSession;

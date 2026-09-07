import type { CoachingSession } from "../types";

/** SAMPLE CPI / rates print mapped onto bitcoin. */
export const cryptoCpiPrintSession: CoachingSession = {
  meta: {
    slug: "crypto-cpi-print",
    title: "Map a SAMPLE CPI print to bitcoin",
    summary:
      "Hot SAMPLE inflation can reprice risk assets, including bitcoin. Map rates before chasing the first tick.",
    topic: "Multi-market decisions",
    tags: ["crypto", "macro-print", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE: U.S. inflation prints hotter. Bitcoin dumps on the first tick while U.S. hours are open. Practice data, not a live print.\n\nWhat do you map first?",
        outcome: "continue",
        choices: [
          {
            label: "Ignore CPI — bitcoin only trades on-chain gossip",
            next: "wrong_ignore",
          },
          {
            label: "Map the print to rates and risk appetite, then to this BTC tape",
            next: "map",
          },
          {
            label: "Assume hot inflation always lifts bitcoin as digital gold",
            next: "wrong_gold",
          },
        ],
      },
      wrong_ignore: {
        message:
          "A rates print can reprice BTC even with no protocol news.\n\nReturn to the map.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_gold: {
        message:
          "Hot inflation often hits risk assets first. Digital-gold slogans skip the map.\n\nReturn to the map.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      map: {
        message:
          "Rates may stay higher. The first tick already moved.\n\nWhat stance fits?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the dump because bitcoin always reclaims before New York close",
            next: "wrong_close",
          },
          {
            label: "Do not chase the first tick; hold until the spike settles",
            next: "weekend",
          },
        ],
      },
      wrong_close: {
        message:
          "A clock slogan is not a map. Revisit the stance.",
        outcome: "wrong",
        choices: [],
        rewind_to: "map",
      },
      weekend: {
        message:
          "The print is Friday. SAMPLE weekend hours stay open.\n\nLast check?",
        outcome: "continue",
        choices: [
          {
            label: "Weekend hours mean you must trade the print all Saturday",
            next: "wrong_must",
          },
          {
            label: "Always-on hours are not a reason to chase; the print is still one fact",
            next: "success",
          },
        ],
      },
      wrong_must: {
        message:
          "Hours are not a must-trade. Return to the weekend check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "weekend",
      },
      success: {
        message:
          "Session complete. You mapped a SAMPLE CPI print onto bitcoin and refused the first tick.\n\nNext: Cases → crypto (macro-print briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default cryptoCpiPrintSession;

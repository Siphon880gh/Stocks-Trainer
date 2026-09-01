/**
 * SAMPLE decide-and-reveal packs for futures / forex / crypto / options-context (E10).
 */
import type { OHLC } from "./ohlcData";
import type { CaseStudy } from "./caseStudies";

function bar(
  name: string,
  open: number,
  high: number,
  low: number,
  close: number,
): OHLC {
  return { name, open, high, low, close };
}

function withAftermath(pre: OHLC[], aftermath: OHLC[]): OHLC[] {
  return [...pre, ...aftermath];
}

const ES_PRE: OHLC[] = [
  bar("T-5", 5120, 5135, 5110, 5128),
  bar("T-4", 5128, 5142, 5120, 5136),
  bar("T-3", 5136, 5150, 5130, 5144),
  bar("T-2", 5144, 5158, 5138, 5150),
  bar("T-1", 5150, 5162, 5142, 5155),
  bar("T0", 5155, 5168, 5148, 5160),
];

const CL_PRE: OHLC[] = [
  bar("T-5", 78.2, 79.0, 77.8, 78.6),
  bar("T-4", 78.6, 79.4, 78.0, 78.9),
  bar("T-3", 78.9, 79.2, 77.5, 77.8),
  bar("T-2", 77.8, 78.4, 76.9, 77.2),
  bar("T-1", 77.2, 77.8, 76.4, 76.8),
  bar("T0", 76.8, 77.2, 75.9, 76.1),
];

const EUR_PRE: OHLC[] = [
  bar("T-5", 1.084, 1.087, 1.082, 1.085),
  bar("T-4", 1.085, 1.089, 1.083, 1.087),
  bar("T-3", 1.087, 1.09, 1.085, 1.088),
  bar("T-2", 1.088, 1.091, 1.086, 1.089),
  bar("T-1", 1.089, 1.092, 1.087, 1.09),
  bar("T0", 1.09, 1.093, 1.088, 1.091),
];

const JPY_PRE: OHLC[] = [
  bar("T-5", 148.2, 148.8, 147.9, 148.4),
  bar("T-4", 148.4, 149.1, 148.0, 148.7),
  bar("T-3", 148.7, 149.4, 148.5, 149.0),
  bar("T-2", 149.0, 149.6, 148.6, 148.9),
  bar("T-1", 148.9, 149.3, 148.2, 148.5),
  bar("T0", 148.5, 148.9, 147.8, 148.1),
];

const BTC_PRE: OHLC[] = [
  bar("T-5", 64200, 64800, 63800, 64500),
  bar("T-4", 64500, 65200, 64200, 64900),
  bar("T-3", 64900, 65800, 64600, 65500),
  bar("T-2", 65500, 66200, 65000, 65800),
  bar("T-1", 65800, 66500, 65400, 66100),
  bar("T0", 66100, 66800, 65800, 66400),
];

const ETH_PRE: OHLC[] = [
  bar("T-5", 3420, 3480, 3380, 3450),
  bar("T-4", 3450, 3510, 3410, 3480),
  bar("T-3", 3480, 3520, 3390, 3410),
  bar("T-2", 3410, 3440, 3320, 3350),
  bar("T-1", 3350, 3390, 3280, 3310),
  bar("T0", 3310, 3360, 3260, 3290),
];

const UND_PRE: OHLC[] = [
  bar("T-5", 186.0, 187.5, 185.2, 186.8),
  bar("T-4", 186.8, 188.2, 186.0, 187.4),
  bar("T-3", 187.4, 189.0, 186.8, 188.2),
  bar("T-2", 188.2, 189.6, 187.5, 188.8),
  bar("T-1", 188.8, 190.2, 188.0, 189.4),
  bar("T0", 189.4, 191.0, 188.6, 190.0),
];

export const FUTURES_CASES: CaseStudy[] = [
  {
    id: "case-fut-trend-cont",
    title: "Index futures still grinding higher",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "An index futures contract has been grinding higher. Headlines are mildly positive. No shock in the brief. Buy, sell, or hold before the next session.",
    newsHeadline: "Risk appetite is steady. No new catalyst.",
    preOhlc: ES_PRE,
    postOhlc: withAftermath(ES_PRE, [
      bar("+1", 5160, 5180, 5152, 5172),
      bar("+2", 5172, 5190, 5164, 5184),
      bar("+3", 5184, 5200, 5175, 5192),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "With no bad news and a clean uptrend, blindly chasing is weaker than asking whether you still want to follow the trend for your time frame.",
      whyMarketMoved: "The grind continued. No shock headline.",
      evidence: "Uptrend plus a mildly positive brief. How you think about it matters more than guessing the next tick.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-risk-off",
    title: "Crude futures dump on fear",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This crude-oil futures contract was already weak. A sudden risk-off headline hits. Decide before the next session.",
    newsHeadline: "Sudden risk-off. Chatter about weaker demand.",
    preOhlc: CL_PRE,
    postOhlc: withAftermath(CL_PRE, [
      bar("+1", 76.1, 76.4, 73.8, 74.2),
      bar("+2", 74.2, 74.8, 72.9, 73.4),
      bar("+3", 73.4, 74.0, 72.5, 73.1),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dump like this punishes late buyers. Hold only if your thesis survives a further slide. Short selling stays locked here.",
      whyMarketMoved: "The contract dumped on a demand scare.",
      evidence: "Already-weak chart plus a risk-off headline. Size the risk to your time frame.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-roll-literacy",
    title: "Front month richer than the next (contango)",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This index future is near a roll to the next contract. The front month is richer than the next month (contango). This is a structure lesson, not a live calculator.",
    newsHeadline:
      "Front month trades at a premium to the next month. Roll window approaching.",
    preOhlc: ES_PRE,
    postOhlc: withAftermath(ES_PRE, [
      bar("+1", 5160, 5168, 5140, 5148),
      bar("+2", 5148, 5155, 5132, 5140),
      bar("+3", 5140, 5150, 5128, 5136),
    ]),
    correctActions: ["hold", "sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Contango is a cost to know about, not an automatic sell. Name the structure, then decide if your time frame cares.",
      whyMarketMoved: "The contract softened into roll chatter.",
      evidence: "Roll and contango brief. Know the structure before guessing ticks.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
];

export const FOREX_CASES: CaseStudy[] = [
  {
    id: "case-fx-risk-on",
    title: "EUR/USD firm while risk appetite is positive",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "EUR/USD has been firm while risk appetite is positive. Practice only, not a live FX desk.",
    newsHeadline: "Risk-on tone. Euro bid versus the dollar.",
    preOhlc: EUR_PRE,
    postOhlc: withAftermath(EUR_PRE, [
      bar("+1", 1.091, 1.096, 1.09, 1.094),
      bar("+2", 1.094, 1.098, 1.092, 1.096),
      bar("+3", 1.096, 1.099, 1.093, 1.097),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Ask whether the risk-on tone is new, or already in the grind. Your time frame still rules.",
      whyMarketMoved: "The pair kept grinding with a risk-on brief.",
      evidence: "Firm chart plus a risk-on headline. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-data-print",
    title: "USD/JPY into a U.S. data print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "USD/JPY is elevated going into a U.S. data print. Decide before you see the reaction.",
    newsHeadline: "Hot data print risk. Focus on the dollar.",
    preOhlc: JPY_PRE,
    postOhlc: withAftermath(JPY_PRE, [
      bar("+1", 148.1, 149.8, 147.9, 149.4),
      bar("+2", 149.4, 150.2, 149.0, 149.8),
      bar("+3", 149.8, 150.4, 149.2, 149.9),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Size for surprise into data. If the dollar strengthens on hot data, the yen often weakens, so this pair can rise.",
      whyMarketMoved: "The dollar bid after a hot print.",
      evidence: "Elevated chart plus a data-risk brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-fade-spike",
    title: "Euro spikes on a thin rumor",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/USD spikes on a thin rumor. The source looks weak. Decide before you see whether it fades.",
    newsHeadline: "Unconfirmed chatter. Euro spikes. Source quality is low.",
    preOhlc: EUR_PRE,
    postOhlc: withAftermath(EUR_PRE, [
      bar("+1", 1.091, 1.098, 1.088, 1.089),
      bar("+2", 1.089, 1.091, 1.085, 1.086),
      bar("+3", 1.086, 1.088, 1.083, 1.084),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Low-quality spikes invite waiting or fading, not chasing. Check the source first.",
      whyMarketMoved: "The spike faded after the rumor.",
      evidence: "Weak source plus a spike on the chart.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
];

export const CRYPTO_CASES: CaseStudy[] = [
  {
    id: "case-crypto-chase-fade",
    title: "Bitcoin already extended on social hype",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "Bitcoin has already extended after social hype. Decide before the next legs. Practice data only.",
    newsHeadline: "Influencer chase narrative. No company filing equivalent.",
    preOhlc: BTC_PRE,
    postOhlc: withAftermath(BTC_PRE, [
      bar("+1", 66400, 66600, 64800, 65100),
      bar("+2", 65100, 65500, 64200, 64600),
      bar("+3", 64600, 65000, 63800, 64100),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hype without a durable catalyst often fades. Weigh evidence quality against FOMO.",
      whyMarketMoved: "The chase narrative pulled back.",
      evidence: "Extended chart plus a low-quality headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-dump-reclaim",
    title: "Ether dumps, then buyers step in",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Ether dumped on a scare headline, then buyers showed up. The scare was later partly walked back.",
    newsHeadline: "Protocol scare chatter, later partly walked back.",
    preOhlc: ETH_PRE,
    postOhlc: withAftermath(ETH_PRE, [
      bar("+1", 3290, 3380, 3270, 3360),
      bar("+2", 3360, 3440, 3340, 3410),
      bar("+3", 3410, 3480, 3390, 3450),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "After a scare, ask if the thesis broke or if it was just a liquidity flush. Patience can beat a panic sell.",
      whyMarketMoved: "The move reclaimed after the scare was walked back.",
      evidence: "Flush on the chart plus a headline walk-back.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-chop-break",
    title: "Bitcoin breaks out of a range",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "Bitcoin coiled in a range. The catalyst is thin. Decide whether a break has follow-through.",
    newsHeadline: "Range-break interest. Thin catalyst.",
    preOhlc: [
      bar("T-5", 65000, 65200, 64800, 65050),
      bar("T-4", 65050, 65300, 64900, 65100),
      bar("T-3", 65100, 65250, 64950, 65080),
      bar("T-2", 65080, 65350, 65000, 65200),
      bar("T-1", 65200, 65400, 65100, 65300),
      bar("T0", 65300, 65550, 65250, 65480),
    ],
    postOhlc: withAftermath(
      [
        bar("T-5", 65000, 65200, 64800, 65050),
        bar("T-4", 65050, 65300, 64900, 65100),
        bar("T-3", 65100, 65250, 64950, 65080),
        bar("T-2", 65080, 65350, 65000, 65200),
        bar("T-1", 65200, 65400, 65100, 65300),
        bar("T0", 65300, 65550, 65250, 65480),
      ],
      [
        bar("+1", 65480, 66200, 65400, 66000),
        bar("+2", 66000, 66800, 65800, 66500),
        bar("+3", 66500, 67200, 66200, 66900),
      ],
    ),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Range breaks need follow-through. Confirm the structure, not just the first green bar.",
      whyMarketMoved: "Upside follow-through after the range.",
      evidence: "Coiled chart plus a thin catalyst.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
];

export const OPTIONS_CONTEXT_CASES: CaseStudy[] = [
  {
    id: "case-optctx-into-event",
    title: "Stock coiled going into a known event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "The stock is coiled going into a known event tomorrow. This is context for how options traders think. This app does not trade option chains.",
    newsHeadline: "Event tomorrow. Underlying coiled. Options context only.",
    preOhlc: UND_PRE,
    postOhlc: withAftermath(UND_PRE, [
      bar("+1", 190.0, 196.5, 189.2, 195.0),
      bar("+2", 195.0, 197.0, 192.0, 193.5),
      bar("+3", 193.5, 195.0, 191.0, 192.2),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Event risk widens outcomes. We grade your stock decision. This app does not trade options.",
      whyMarketMoved: "The event gapped, then digested.",
      evidence: "Coiled stock plus an event brief. No live options chain.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-vol-spike",
    title: "After a high-volatility session",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "The stock just had a high-volatility session. That is why options can get expensive afterward. Still no chain trading here.",
    newsHeadline: "Volatility spike session. Fear premium. Context only.",
    preOhlc: [
      bar("T-5", 190.0, 191.0, 188.0, 189.0),
      bar("T-4", 189.0, 190.5, 186.0, 187.0),
      bar("T-3", 187.0, 188.5, 182.0, 183.5),
      bar("T-2", 183.5, 185.0, 178.0, 179.5),
      bar("T-1", 179.5, 184.0, 177.0, 182.0),
      bar("T0", 182.0, 186.0, 180.5, 184.5),
    ],
    postOhlc: withAftermath(
      [
        bar("T-5", 190.0, 191.0, 188.0, 189.0),
        bar("T-4", 189.0, 190.5, 186.0, 187.0),
        bar("T-3", 187.0, 188.5, 182.0, 183.5),
        bar("T-2", 183.5, 185.0, 178.0, 179.5),
        bar("T-1", 179.5, 184.0, 177.0, 182.0),
        bar("T0", 182.0, 186.0, 180.5, 184.5),
      ],
      [
        bar("+1", 184.5, 187.0, 183.0, 185.5),
        bar("+2", 185.5, 188.0, 184.0, 186.5),
        bar("+3", 186.5, 189.0, 185.0, 187.5),
      ],
    ),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "After a volatility spike, the stock may chop. Hold is often the process answer when you have no clear edge. This app does not simulate options pricing.",
      whyMarketMoved: "The stock digested in a choppy range.",
      evidence: "Spike on the chart. Educational context only, no Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
];

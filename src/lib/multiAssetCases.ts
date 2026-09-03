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

const GC_PRE: OHLC[] = [
  bar("T-5", 2320, 2332, 2314, 2326),
  bar("T-4", 2326, 2338, 2320, 2330),
  bar("T-3", 2330, 2344, 2324, 2338),
  bar("T-2", 2338, 2350, 2332, 2344),
  bar("T-1", 2344, 2356, 2338, 2348),
  bar("T0", 2348, 2360, 2342, 2352),
];

const ZC_PRE: OHLC[] = [
  bar("T-5", 462, 468, 458, 464),
  bar("T-4", 464, 470, 460, 466),
  bar("T-3", 466, 469, 452, 454),
  bar("T-2", 454, 458, 448, 450),
  bar("T-1", 450, 455, 444, 448),
  bar("T0", 448, 452, 442, 445),
];

const NQ_PRE: OHLC[] = [
  bar("T-5", 17840, 17890, 17790, 17820),
  bar("T-4", 17820, 17870, 17760, 17790),
  bar("T-3", 17790, 17830, 17720, 17750),
  bar("T-2", 17750, 17800, 17680, 17710),
  bar("T-1", 17710, 17760, 17640, 17680),
  bar("T0", 17680, 17720, 17610, 17640),
];

const AUD_PRE: OHLC[] = [
  bar("T-5", 0.662, 0.665, 0.66, 0.663),
  bar("T-4", 0.663, 0.666, 0.661, 0.664),
  bar("T-3", 0.664, 0.667, 0.662, 0.665),
  bar("T-2", 0.665, 0.668, 0.663, 0.666),
  bar("T-1", 0.666, 0.669, 0.664, 0.667),
  bar("T0", 0.667, 0.67, 0.665, 0.668),
];

const GBP_PRE: OHLC[] = [
  bar("T-5", 1.268, 1.272, 1.265, 1.27),
  bar("T-4", 1.27, 1.274, 1.266, 1.269),
  bar("T-3", 1.269, 1.273, 1.264, 1.266),
  bar("T-2", 1.266, 1.27, 1.261, 1.263),
  bar("T-1", 1.263, 1.267, 1.258, 1.26),
  bar("T0", 1.26, 1.264, 1.256, 1.258),
];

const EURJPY_PRE: OHLC[] = [
  bar("T-5", 161.2, 161.8, 160.8, 161.4),
  bar("T-4", 161.4, 162.0, 161.0, 161.6),
  bar("T-3", 161.6, 162.4, 161.2, 162.0),
  bar("T-2", 162.0, 162.8, 161.6, 162.4),
  bar("T-1", 162.4, 163.0, 161.8, 162.2),
  bar("T0", 162.2, 162.6, 161.4, 161.8),
];

const SOL_PRE: OHLC[] = [
  bar("T-5", 142.0, 146.0, 140.0, 144.0),
  bar("T-4", 144.0, 148.0, 141.0, 147.0),
  bar("T-3", 147.0, 152.0, 145.0, 150.0),
  bar("T-2", 150.0, 156.0, 148.0, 154.0),
  bar("T-1", 154.0, 160.0, 152.0, 158.0),
  bar("T0", 158.0, 164.0, 156.0, 162.0),
];

const USDC_PRE: OHLC[] = [
  bar("T-5", 1.001, 1.002, 0.999, 1.0),
  bar("T-4", 1.0, 1.001, 0.998, 0.999),
  bar("T-3", 0.999, 1.0, 0.996, 0.997),
  bar("T-2", 0.997, 0.999, 0.994, 0.995),
  bar("T-1", 0.995, 0.998, 0.993, 0.996),
  bar("T0", 0.996, 0.999, 0.994, 0.997),
];

const EVENT_COIL_PRE: OHLC[] = [
  bar("T-5", 74.2, 74.8, 73.9, 74.4),
  bar("T-4", 74.4, 74.9, 74.0, 74.3),
  bar("T-3", 74.3, 74.7, 73.8, 74.1),
  bar("T-2", 74.1, 74.6, 73.9, 74.4),
  bar("T-1", 74.4, 74.8, 74.0, 74.5),
  bar("T0", 74.5, 75.0, 74.2, 74.7),
];

const SETTLE_PRE: OHLC[] = [
  bar("T-5", 212.0, 218.0, 210.0, 216.0),
  bar("T-4", 216.0, 220.0, 214.0, 215.0),
  bar("T-3", 215.0, 217.0, 211.0, 212.5),
  bar("T-2", 212.5, 214.0, 209.0, 210.5),
  bar("T-1", 210.5, 213.0, 208.5, 211.0),
  bar("T0", 211.0, 214.5, 210.0, 213.2),
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
  {
    id: "case-fut-gold-grind",
    title: "Gold futures still grinding with a calm brief",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "A SAMPLE gold futures contract has been grinding higher. The brief is calm, not a shock. Buy, sell, or hold before the next session.",
    newsHeadline: "Calm bid for gold futures. No shock in the brief.",
    preOhlc: GC_PRE,
    postOhlc: withAftermath(GC_PRE, [
      bar("+1", 2352, 2368, 2348, 2362),
      bar("+2", 2362, 2374, 2356, 2368),
      bar("+3", 2368, 2380, 2360, 2372),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A calm grind is a time-frame question, not an automatic chase. Hold if you already have the exposure you wanted.",
      whyMarketMoved: "The grind continued. No shock headline.",
      evidence: "Uptrend gold tape plus a calm SAMPLE brief.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-corn-weather",
    title: "Corn futures dump on a weather scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE corn contract was already weak. A weather scare hits demand chatter, not a crop outage. Decide before the next session.",
    newsHeadline: "Weather scare. Demand chatter cools. Not a confirmed outage.",
    preOhlc: ZC_PRE,
    postOhlc: withAftermath(ZC_PRE, [
      bar("+1", 445, 448, 432, 436),
      bar("+2", 436, 440, 428, 432),
      bar("+3", 432, 436, 424, 428),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A demand scare on an already-weak grain tape is usually not a buy. Hold if you sized for more slide. This is SAMPLE weather copy, not a live crop report.",
      whyMarketMoved: "The contract kept sliding with the scare.",
      evidence: "Weak grain tape plus a weather/demand headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-nq-risk-off",
    title: "Nasdaq futures sold with risk appetite",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE Nasdaq-style index future was already sliding. A risk-off headline hits. Decide before the next session.",
    newsHeadline: "Risk-off. Index futures sold with growth names.",
    preOhlc: NQ_PRE,
    postOhlc: withAftermath(NQ_PRE, [
      bar("+1", 17640, 17680, 17480, 17520),
      bar("+2", 17520, 17580, 17390, 17440),
      bar("+3", 17440, 17500, 17320, 17380),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Index futures in a risk-off tape are about how much market risk you want. Adding into the slide is usually not process.",
      whyMarketMoved: "The slide continued with the risk-off brief.",
      evidence: "Already-weak NQ-style tape plus a market-wide headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-es-print",
    title: "Index futures into a hot data print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE index future was grinding higher into a data print. The print comes in hotter than hoped. Decide before you see the next session.",
    newsHeadline: "Hot data print. Rate-cut odds fall. Index futures in focus.",
    preOhlc: ES_PRE,
    postOhlc: withAftermath(ES_PRE, [
      bar("+1", 5148, 5155, 5110, 5122),
      bar("+2", 5122, 5134, 5098, 5108),
      bar("+3", 5108, 5120, 5088, 5096),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hot data can reprice the whole index. A grind into the print is often already optimistic. Hold if you sized for a miss.",
      whyMarketMoved: "The grind reversed after the hot print.",
      evidence: "Uptrend ES-style tape plus a data-print brief.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-cl-supply",
    title: "Crude futures catch a bid on a supply headline",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "This SAMPLE crude contract was weak. A supply-outage headline hits. Producers can catch a bid on scary news. Decide before the next session.",
    newsHeadline: "Supply-outage chatter. Near-term crude prices jump.",
    preOhlc: CL_PRE,
    postOhlc: withAftermath(CL_PRE, [
      bar("+1", 76.8, 79.4, 76.4, 78.8),
      bar("+2", 78.8, 80.2, 78.2, 79.6),
      bar("+3", 79.6, 80.8, 78.8, 80.0),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Name whether this contract benefits from scarcity. A weak tape plus a real supply headline can be a buy or a hold, not an automatic dump.",
      whyMarketMoved: "The weak crude tape reversed with scarcity talk.",
      evidence: "Already-weak CL-style tape plus a supply headline.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-int-gold-fade",
    title: "Gold already extended into a calm print",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE gold future already ran. A calm data print lands with no shock. You have Indicators. Is the print a reason to add, or a reason for late buyers to exit?",
    newsHeadline: "Calm print. No new gold shock. Contract already extended.",
    preOhlc: GC_PRE,
    postOhlc: withAftermath(GC_PRE, [
      bar("+1", 2346, 2350, 2328, 2332),
      bar("+2", 2332, 2338, 2318, 2324),
      bar("+3", 2324, 2330, 2312, 2318),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "An extended contract plus a nothing-print is often fade-or-wait. Intermediate work is naming what is already in the price.",
      whyMarketMoved: "Late buyers exited when the print added nothing.",
      evidence: "Extended gold tape plus a calm print.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-roll-backwardation",
    title: "Front month cheaper than the next (backwardation)",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE crude contract is in backwardation: the front month is cheaper than the next. Roll is near. Structure lesson, not a live calculator. How do you treat the roll?",
    newsHeadline:
      "Front month cheaper than the next month. Roll window approaching.",
    preOhlc: CL_PRE,
    postOhlc: withAftermath(CL_PRE, [
      bar("+1", 76.4, 77.8, 76.0, 77.2),
      bar("+2", 77.2, 78.0, 76.8, 77.6),
      bar("+3", 77.6, 78.4, 77.0, 77.9),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Backwardation is a structure to name, not an automatic buy. Ask whether your time frame cares about the roll.",
      whyMarketMoved: "The weak tape bounced a little into roll chatter.",
      evidence: "CL-style tape plus a backwardation brief.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
    assetClass: "future",
  },
  {
    id: "case-fut-int-nq-print",
    title: "Growth index futures after a soft print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "This SAMPLE Nasdaq-style future was sliding. Growth data comes in soft, not a collapse. Soft-landing talk returns. Decide with the print and the already-weak tape.",
    newsHeadline: "Growth data soft, not collapsing. Soft-landing talk returns.",
    preOhlc: NQ_PRE,
    postOhlc: withAftermath(NQ_PRE, [
      bar("+1", 17680, 17840, 17650, 17800),
      bar("+2", 17800, 17920, 17760, 17880),
      bar("+3", 17880, 18000, 17820, 17940),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A soft print can reprice growth index futures that already sold off. Intermediate work is asking whether the slide already baked the print in.",
      whyMarketMoved: "The slide reversed as rate-cut hopes returned.",
      evidence: "Weak NQ-style tape plus a soft growth print.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "intermediate",
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
  {
    id: "case-fx-aud-risk-on",
    title: "AUD/USD firm in a risk-on brief",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "AUD/USD has been grinding higher while risk appetite is positive. Practice only, not a live FX desk.",
    newsHeadline: "Risk-on tone. Aussie bid versus the dollar.",
    preOhlc: AUD_PRE,
    postOhlc: withAftermath(AUD_PRE, [
      bar("+1", 0.668, 0.672, 0.667, 0.67),
      bar("+2", 0.67, 0.674, 0.669, 0.672),
      bar("+3", 0.672, 0.675, 0.67, 0.673),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Ask whether the risk-on tone is new. Hold if the grind already has your size.",
      whyMarketMoved: "The pair kept grinding with a risk-on brief.",
      evidence: "Firm AUD tape plus a risk-on headline. Practice only.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-gbp-print",
    title: "GBP/USD into a UK data print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "GBP/USD was already sliding into a UK data print. The print comes in soft. Decide before you see the next bars.",
    newsHeadline: "UK data softer than hoped. Sterling in focus.",
    preOhlc: GBP_PRE,
    postOhlc: withAftermath(GBP_PRE, [
      bar("+1", 1.256, 1.258, 1.248, 1.25),
      bar("+2", 1.25, 1.253, 1.244, 1.247),
      bar("+3", 1.247, 1.25, 1.242, 1.245),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Soft home data on an already-weak sterling tape is usually not a buy. Hold if you sized for more slide.",
      whyMarketMoved: "Sterling kept sliding after the soft print.",
      evidence: "Weak GBP tape plus a UK data brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-eurjpy-chase",
    title: "EUR/JPY already ran on thin chatter",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/JPY already ran. The headline is thin cross-market chatter. Decide whether to chase or wait.",
    newsHeadline: "Thin cross-market chatter. EUR/JPY already extended.",
    preOhlc: EURJPY_PRE,
    postOhlc: withAftermath(EURJPY_PRE, [
      bar("+1", 161.4, 161.8, 160.2, 160.6),
      bar("+2", 160.6, 161.0, 159.6, 160.0),
      bar("+3", 160.0, 160.4, 159.2, 159.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Thin chatter after a run is fade-or-wait. Do not treat a cross spike as a new fact.",
      whyMarketMoved: "The run faded when the chatter stayed thin.",
      evidence: "Extended EUR/JPY tape plus a weak-source headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-usd-jpy-risk-off",
    title: "USD/JPY sold as risk appetite fades",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "USD/JPY was elevated. Risk appetite fades. Some traders buy yen in a scare. Practice framing only.",
    newsHeadline: "Risk-off. Yen bid as a scare currency in this SAMPLE brief.",
    preOhlc: JPY_PRE,
    postOhlc: withAftermath(JPY_PRE, [
      bar("+1", 147.6, 147.9, 146.2, 146.6),
      bar("+2", 146.6, 147.0, 145.6, 146.0),
      bar("+3", 146.0, 146.4, 145.2, 145.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A risk-off yen bid can pull this pair down. That is a market-mood decision, not a company filing.",
      whyMarketMoved: "The elevated pair sold as yen caught a bid.",
      evidence: "Elevated USD/JPY tape plus a risk-off brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-eur-supply-energy",
    title: "EUR/USD wobbles on an energy-supply scare",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "EUR/USD had been firm. An energy-supply scare hits European cost talk. Decide before the next bars.",
    newsHeadline: "Energy-supply scare. European cost talk. Euro in focus.",
    preOhlc: EUR_PRE,
    postOhlc: withAftermath(EUR_PRE, [
      bar("+1", 1.088, 1.09, 1.082, 1.084),
      bar("+2", 1.084, 1.086, 1.079, 1.081),
      bar("+3", 1.081, 1.083, 1.077, 1.079),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply scare that raises European costs can hit the euro. Name the channel before you buy a dip.",
      whyMarketMoved: "The firm euro tape faded with the cost scare.",
      evidence: "Firm EUR tape plus an energy-supply headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-aud-print",
    title: "AUD/USD after a hot US print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "AUD/USD had been grinding. A hot US data print lands. The dollar often firms. You have Indicators. How do you treat the carry pair?",
    newsHeadline: "Hot US print. Dollar firm. Aussie in focus.",
    preOhlc: AUD_PRE,
    postOhlc: withAftermath(AUD_PRE, [
      bar("+1", 0.665, 0.666, 0.658, 0.66),
      bar("+2", 0.66, 0.662, 0.655, 0.657),
      bar("+3", 0.657, 0.659, 0.653, 0.655),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A hot US print can reprice dollar pairs even if the Aussie story is unchanged. Intermediate work is naming whose data moved.",
      whyMarketMoved: "The grind reversed as the dollar firmed.",
      evidence: "AUD grind plus a US data-print brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-gbp-fade",
    title: "Sterling spike on a thin budget rumor",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "GBP/USD spikes on a thin budget rumor. Source quality is low. The pair had been sliding. Chase the spike, or wait?",
    newsHeadline: "Unconfirmed budget chatter. Sterling spikes. Source is weak.",
    preOhlc: GBP_PRE,
    postOhlc: withAftermath(GBP_PRE, [
      bar("+1", 1.268, 1.276, 1.257, 1.259),
      bar("+2", 1.259, 1.262, 1.252, 1.254),
      bar("+3", 1.254, 1.257, 1.248, 1.25),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Low-quality spikes on a sliding pair invite waiting or fading. Check the source before you treat it as a new path.",
      whyMarketMoved: "The spike faded after the rumor.",
      evidence: "Weak GBP tape plus a thin budget rumor.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
    assetClass: "forex",
  },
  {
    id: "case-fx-int-eurjpy-risk",
    title: "EUR/JPY as a risk-on cross after a scare",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "EUR/JPY had already run, then a scare hit. The scare is later walked back. Crosses like this often track risk appetite. Decide after the walk-back, not the first scare bar.",
    newsHeadline: "Scare later walked back. Risk appetite steadies.",
    preOhlc: EURJPY_PRE,
    postOhlc: withAftermath(EURJPY_PRE, [
      bar("+1", 162.4, 163.6, 162.0, 163.2),
      bar("+2", 163.2, 164.0, 162.8, 163.6),
      bar("+3", 163.6, 164.4, 163.0, 163.9),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "If the scare is walked back, ask whether the cross thesis broke or just flushed. Intermediate work is waiting for the walk-back, not buying the first red bar.",
      whyMarketMoved: "The cross reclaimed after the scare was walked back.",
      evidence: "EUR/JPY tape plus a walked-back scare headline.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "intermediate",
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
  {
    id: "case-crypto-sol-chase",
    title: "Solana-style coin already extended on hype",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE Solana-style coin already extended after social hype. Practice data only. Chase, wait, or take risk off?",
    newsHeadline: "Influencer chase narrative. No protocol filing equivalent.",
    preOhlc: SOL_PRE,
    postOhlc: withAftermath(SOL_PRE, [
      bar("+1", 160.0, 162.0, 148.0, 150.0),
      bar("+2", 150.0, 154.0, 142.0, 146.0),
      bar("+3", 146.0, 150.0, 138.0, 141.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hype without a durable catalyst often fades. Weigh evidence quality against FOMO.",
      whyMarketMoved: "The chase narrative pulled back.",
      evidence: "Extended SAMPLE alt tape plus a low-quality headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-usdc-depeg-scare",
    title: "Stablecoin wobble, then a walk-back",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE dollar-peg coin wobbles on a reserve scare, then the scare is partly walked back. Practice only.",
    newsHeadline: "Reserve scare chatter, later partly walked back.",
    preOhlc: USDC_PRE,
    postOhlc: withAftermath(USDC_PRE, [
      bar("+1", 0.997, 1.001, 0.996, 1.0),
      bar("+2", 1.0, 1.002, 0.998, 1.001),
      bar("+3", 1.001, 1.002, 0.999, 1.0),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A peg wobble is a confidence story. Hold if the walk-back bounds the scare. This is SAMPLE copy, not a live stablecoin desk.",
      whyMarketMoved: "The wobble filled after the walk-back.",
      evidence: "Peg tape plus a walked-back reserve scare.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-btc-risk-off",
    title: "Bitcoin sold with risk appetite",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Bitcoin had already extended. A risk-off headline hits. Decide before the next legs. Practice data only.",
    newsHeadline: "Risk-off. Bitcoin sold with other risky assets.",
    preOhlc: BTC_PRE,
    postOhlc: withAftermath(BTC_PRE, [
      bar("+1", 65800, 66100, 64200, 64600),
      bar("+2", 64600, 65000, 63400, 63800),
      bar("+3", 63800, 64200, 62800, 63200),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "When bitcoin sells with everything else, you are deciding market risk, not a company filing.",
      whyMarketMoved: "The extended tape sold with the risk-off brief.",
      evidence: "Extended BTC tape plus a market-wide headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-eth-print",
    title: "Ether into a hot macro print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "Ether was already dumping. A hot macro print lands. Rate-cut hopes fade. Practice only.",
    newsHeadline: "Hot macro print. Rate-cut odds fall. Crypto in focus.",
    preOhlc: ETH_PRE,
    postOhlc: withAftermath(ETH_PRE, [
      bar("+1", 3260, 3280, 3180, 3210),
      bar("+2", 3210, 3240, 3140, 3170),
      bar("+3", 3170, 3200, 3120, 3140),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hot data can hit risk assets that were already sliding. Hold if you sized for more dump.",
      whyMarketMoved: "The dump continued after the print.",
      evidence: "Weak ETH tape plus a macro-print brief.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-btc-supply-hack",
    title: "Exchange-hack headline on a coiled bitcoin tape",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Bitcoin coiled in a range. An exchange-hack headline hits. This is a platform scare, not a protocol change. Practice only.",
    newsHeadline: "Exchange-hack chatter. Protocol unchanged in this SAMPLE brief.",
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
        bar("+1", 64800, 65000, 63200, 63600),
        bar("+2", 63600, 64000, 62800, 63200),
        bar("+3", 63200, 63800, 62600, 63400),
      ],
    ),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A platform scare can flush a coiled tape even if the protocol is unchanged. Hold if you can sit through the flush. Buying the first red bar is usually not process.",
      whyMarketMoved: "The range broke lower on the scare, then chopped.",
      evidence: "Coiled BTC tape plus an exchange-hack headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-sol-fade",
    title: "Alt already ran into a nothing-catalyst",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE alt already ran. The 'catalyst' is a conference appearance. You have Indicators. Is that a new fact?",
    newsHeadline: "Conference appearance. No protocol change. Coin already extended.",
    preOhlc: SOL_PRE,
    postOhlc: withAftermath(SOL_PRE, [
      bar("+1", 158.0, 160.0, 146.0, 148.0),
      bar("+2", 148.0, 152.0, 140.0, 143.0),
      bar("+3", 143.0, 146.0, 136.0, 138.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A conference is often already in an extended tape. Intermediate work is naming the incremental fact before you add risk.",
      whyMarketMoved: "Late buyers exited when the catalyst stayed thin.",
      evidence: "Extended alt tape plus a conference-only headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-eth-reclaim",
    title: "Ether scare walked back after a dump",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Ether dumped on a protocol scare, then the scare was walked back. The tape is still below the prior range. You already know flush vs thesis-break. Decide.",
    newsHeadline: "Protocol scare later walked back. Ether still below the prior range.",
    preOhlc: ETH_PRE,
    postOhlc: withAftermath(ETH_PRE, [
      bar("+1", 3310, 3420, 3290, 3390),
      bar("+2", 3390, 3480, 3360, 3450),
      bar("+3", 3450, 3520, 3420, 3490),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "If the scare is walked back, ask whether the thesis broke. Intermediate work is buying a bounded scare, not averaging every dump.",
      whyMarketMoved: "The dump reclaimed after the walk-back.",
      evidence: "ETH dump tape plus a walked-back protocol scare.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-int-btc-print",
    title: "Bitcoin after a soft landing print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "Bitcoin had been selling with risk assets. A jobs print cools without collapsing. Soft-landing talk returns. Decide with the print and the already-weak tape.",
    newsHeadline: "Jobs cool without collapsing. Soft-landing odds rise.",
    preOhlc: BTC_PRE,
    postOhlc: withAftermath(BTC_PRE, [
      bar("+1", 66600, 67800, 66400, 67400),
      bar("+2", 67400, 68400, 67000, 68000),
      bar("+3", 68000, 68800, 67600, 68400),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Easier macro news can lift bitcoin that already sold off. Still ask whether you are early or late to that story.",
      whyMarketMoved: "Risk assets bid as rate-cut hopes returned.",
      evidence: "Extended-then-heavy BTC tape plus a cooling jobs print.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "intermediate",
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
  {
    id: "case-optctx-event-coil-small",
    title: "Small-name coiled into a known event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE small-name stock is coiled going into a known event tomorrow. Options traders care about the range. This app does not trade option chains.",
    newsHeadline: "Event tomorrow. Underlying coiled. Options context only.",
    preOhlc: EVENT_COIL_PRE,
    postOhlc: withAftermath(EVENT_COIL_PRE, [
      bar("+1", 74.7, 79.8, 74.2, 78.6),
      bar("+2", 78.6, 80.2, 76.4, 77.2),
      bar("+3", 77.2, 78.4, 75.8, 76.6),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Event risk widens outcomes. We grade your stock decision. This app does not trade options.",
      whyMarketMoved: "The event expanded the range, then digested.",
      evidence: "Coiled small-name tape plus an event brief. No live chain.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-after-gap",
    title: "After the event gap, the stock settles",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "The known event already gapped this SAMPLE stock. Now it is settling. Chasing the first green bar after a gap is a different skill than sitting through the event. Still no chain here.",
    newsHeadline: "Event already printed. Gap is in. Settlement tape.",
    preOhlc: SETTLE_PRE,
    postOhlc: withAftermath(SETTLE_PRE, [
      bar("+1", 213.2, 214.8, 211.6, 212.4),
      bar("+2", 212.4, 213.6, 210.8, 211.6),
      bar("+3", 211.6, 212.8, 210.4, 211.2),
    ]),
    correctActions: ["hold", "sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "After a gap, wait for settlement unless you have a new fact. This app still does not simulate options prices.",
      whyMarketMoved: "The gap digested in a narrower range.",
      evidence: "Post-event settlement tape. Educational context only.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-vol-fail",
    title: "High-volatility session, then a failed bounce",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "This SAMPLE stock had a high-volatility session. A bounce starts, then fails. That is why fear premium can stay high. Still no Greeks here.",
    newsHeadline: "Volatility spike, failed bounce. Fear premium context only.",
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
        bar("+1", 185.5, 188.5, 184.8, 187.8),
        bar("+2", 187.8, 188.4, 183.2, 183.8),
        bar("+3", 183.8, 184.6, 181.4, 182.2),
      ],
    ),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A failed bounce after a volatility spike is a reason not to chase. Hold if you have no edge. This app does not price options.",
      whyMarketMoved: "The bounce failed and the stock slid again.",
      evidence: "Spike tape plus a failed bounce. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-headline-into-event",
    title: "Headline hits while the stock is coiled for an event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "The stock is coiled for a known event. A separate product headline hits the same day. Two clocks: the event range and the headline. Still no chain.",
    newsHeadline: "Product headline the same day as a known event. Context only.",
    preOhlc: UND_PRE,
    postOhlc: withAftermath(UND_PRE, [
      bar("+1", 190.8, 194.0, 189.6, 193.2),
      bar("+2", 193.2, 194.4, 191.2, 192.0),
      bar("+3", 192.0, 193.0, 190.4, 191.2),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "A headline into a known event still widens outcomes. Hold is often process when you cannot separate the two clocks. No options trading here.",
      whyMarketMoved: "The coil expanded, then digested.",
      evidence: "Coiled underlying plus a same-day product headline.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-settle-fade",
    title: "Rich gap, thin new fact, settlement fade",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "The event already gapped this SAMPLE name. The follow-up headline is incremental. You have Indicators. Chase the leftover premium, or wait for settlement?",
    newsHeadline: "Incremental follow-up after a large gap. Settlement in focus.",
    preOhlc: SETTLE_PRE,
    postOhlc: withAftermath(SETTLE_PRE, [
      bar("+1", 212.0, 213.0, 206.4, 207.2),
      bar("+2", 207.2, 208.4, 204.8, 205.6),
      bar("+3", 205.6, 206.8, 203.6, 204.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "After a rich gap, incremental news is often a fade. Intermediate work is naming what is already in the gap. Still no chain.",
      whyMarketMoved: "Settlement sold as the follow-up added little.",
      evidence: "Post-gap tape plus an incremental headline.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-coil-hold",
    title: "Coiled event, no edge on direction",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "The stock is coiled into a known event. You have no directional edge. Options traders might talk about buying range. This app still grades the stock choice only.",
    newsHeadline: "Event tomorrow. No directional edge in the brief. Context only.",
    preOhlc: EVENT_COIL_PRE,
    postOhlc: withAftermath(EVENT_COIL_PRE, [
      bar("+1", 74.2, 76.8, 71.4, 72.0),
      bar("+2", 72.0, 73.4, 70.6, 71.2),
      bar("+3", 71.2, 72.6, 70.2, 71.0),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "No edge into a binary event is a hold on the stock. Do not pretend a chain exists here.",
      whyMarketMoved: "The event broke the coil to the downside, then chopped.",
      evidence: "Tight coil plus an event brief with no directional fact.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-int-vol-chop",
    title: "After the spike, implied fear vs a calm stock",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Yesterday was a volatility spike. Today the SAMPLE stock is calmer. Fear in options-land can lag. You still cannot trade a chain here. What is the stock process?",
    newsHeadline: "Yesterday's spike. Today's stock is calmer. Context only.",
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
        bar("+1", 184.2, 185.4, 183.6, 184.8),
        bar("+2", 184.8, 185.8, 184.0, 185.2),
        bar("+3", 185.2, 186.0, 184.4, 185.6),
      ],
    ),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "A calmer stock after a spike is often a hold until you have a new fact. Do not invent an options trade.",
      whyMarketMoved: "The stock digested in a quiet range.",
      evidence: "Prior spike bars plus a calm follow-through. No Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "intermediate",
    assetClass: "option_context",
  },
];

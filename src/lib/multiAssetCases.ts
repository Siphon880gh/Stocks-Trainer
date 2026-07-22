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
    title: "SAMPLE Futures · Index Trend Continuation",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "ES-style SAMPLE index future grinding higher into soft risk-on headlines. Decide before the next session open tape.",
    newsHeadline: "SAMPLE: Risk appetite steady · no new catalyst in brief",
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
        "With no adverse print and a clean higher-high SAMPLE tape, chasing blindly is weaker than asking whether your horizon still matches trend continuation.",
      whyMarketMoved: "SAMPLE tape extended the grind; no shock headline.",
      evidence: "Pre-tape structure + soft risk-on brief. Process > direction guess.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-risk-off",
    title: "SAMPLE Futures · Commodity Risk-Off Dump",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "CL-style SAMPLE crude already soft. Stylized risk-off headline hits. Decide before the aftermath session.",
    newsHeadline: "SAMPLE: Sudden risk-off · demand scare chatter (stylized)",
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
        "Risk-off dumps punish late longs. Hold only if your thesis + horizon survive a further slide; short stays soft-gated here.",
      whyMarketMoved: "SAMPLE dump on stylized demand scare.",
      evidence: "Soft pre-tape + risk-off headline. Process: size risk to horizon.",
    },
    allowShort: false,
    packId: "futures",
    difficulty: "beginner",
    assetClass: "future",
  },
  {
    id: "case-fut-roll-literacy",
    title: "SAMPLE Futures · Contango / Roll Literacy-Light",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "Index future SAMPLE near a roll window. Brief notes front month rich vs next (contango literacy-light). Not a LIVE roll calculator.",
    newsHeadline: "SAMPLE: Front month premium vs next · roll window approaching",
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
        "Contango/roll is a cost/structure cue, not an automatic short. SAMPLE teach: name the structure, then decide if your horizon cares.",
      whyMarketMoved: "SAMPLE tape softened into roll chatter.",
      evidence: "Roll/contango brief. Process literacy > predicting ticks.",
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
    title: "SAMPLE Forex · EUR/USD Risk-On Grind",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "EUR/USD SAMPLE spot firm into stylized risk-on tone. SAMPLE desk only — not LIVE FX.",
    newsHeadline: "SAMPLE: Risk-on tone · EUR bid vs USD (stylized)",
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
        "FX SAMPLE: ask whether risk tone is new information or already in the grind. Horizon still rules.",
      whyMarketMoved: "SAMPLE continuation with risk-on brief.",
      evidence: "Firm pre-tape + stylized risk-on. No LIVE desk claim.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-data-print",
    title: "SAMPLE Forex · USD/JPY Into Data Print",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "USD/JPY SAMPLE elevated into a stylized US data print. Decide before the print aftermath.",
    newsHeadline: "SAMPLE: Hot data print risk · USD focus (stylized)",
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
        "Into prints, size for surprise. SAMPLE: if USD strengthens on hot data, JPY weakens (pair up). Process the scenario tree.",
      whyMarketMoved: "SAMPLE USD bid after stylized hot print.",
      evidence: "Elevated pre-tape + print risk brief.",
    },
    allowShort: false,
    packId: "forex",
    difficulty: "beginner",
    assetClass: "forex",
  },
  {
    id: "case-fx-fade-spike",
    title: "SAMPLE Forex · Fade Exhaustion Spike",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "EUR/USD SAMPLE spikes on a thin rumor. Source quality low. Decide before mean-reversion tape.",
    newsHeadline: "SAMPLE: Unconfirmed chatter · EUR spike (low source quality)",
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
        "Low-quality spikes invite fade or wait — not blind chase. SAMPLE FX teach: source humility first.",
      whyMarketMoved: "SAMPLE fade after rumor spike.",
      evidence: "Rumor quality cue + spike structure.",
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
    title: "SAMPLE Crypto · Chase vs Fade Into Extension",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "BTC SAMPLE extended after social hype. Decide before the next legs — SAMPLE only.",
    newsHeadline: "SAMPLE: Influencer chase narrative · no filing equivalent",
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
        "Hype without durable catalyst often fades. Process: evidence quality vs FOMO.",
      whyMarketMoved: "SAMPLE pullback after chase narrative.",
      evidence: "Extended pre-tape + low-quality headline.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-dump-reclaim",
    title: "SAMPLE Crypto · Dump Then Reclaim",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "ETH SAMPLE dumped on a scare headline, then buyers stepped in on the pre-tape. Aftermath may reclaim.",
    newsHeadline: "SAMPLE: Protocol scare chatter · later partially walked back",
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
        "After a scare, ask if the thesis broke or if liquidity just flushed. SAMPLE reclaim teaches patience vs panic sell.",
      whyMarketMoved: "SAMPLE reclaim after walked-back scare.",
      evidence: "Flush pre-tape + headline walk-back cue.",
    },
    allowShort: false,
    packId: "crypto",
    difficulty: "beginner",
    assetClass: "crypto",
  },
  {
    id: "case-crypto-chop-break",
    title: "SAMPLE Crypto · Chop Break Higher",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "BTC SAMPLE coiled in a range. Soft catalyst brief. Decide whether break has follow-through.",
    newsHeadline: "SAMPLE: Range break interest · thin catalyst",
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
        "Chop breaks need follow-through. SAMPLE: confirm structure, not just the first green bar.",
      whyMarketMoved: "SAMPLE upside follow-through after range.",
      evidence: "Coil pre-tape + soft catalyst.",
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
    title: "SAMPLE Options-Context · Underlying Into Event",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Underlying SAMPLE into a known event. This is context for options thinking — not a chain, not Greeks, not order entry.",
    newsHeadline: "SAMPLE: Event tomorrow · underlying coiled (options context only)",
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
        "Options-context teach: event risk widens outcomes. We grade underlying decision process — this app does not trade option chains.",
      whyMarketMoved: "SAMPLE event gap then digest.",
      evidence: "Coiled underlying + event brief. No LIVE chain.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
  {
    id: "case-optctx-vol-spike",
    title: "SAMPLE Options-Context · After Vol Spike",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Underlying SAMPLE just printed a vol spike session. Context for why options might have been expensive — still no chain trading here.",
    newsHeadline: "SAMPLE: Vol spike session · fear premium (context only)",
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
        "After a vol spike, underlying may chop while premium decays in the options world — we do not simulate that engine. Hold is often the process answer when edge is unclear.",
      whyMarketMoved: "SAMPLE digest / mean reversion chop.",
      evidence: "Spike pre-tape. Educational context only — no Greeks.",
    },
    allowShort: false,
    packId: "options-context",
    difficulty: "beginner",
    assetClass: "option_context",
  },
];

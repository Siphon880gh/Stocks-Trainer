import type { OHLC } from "./ohlcData";
import type { FinancialSnapshot } from "./financialSnapshots";
import { FINANCIAL_SNAPSHOTS } from "./financialSnapshots";
import type { AssetClass } from "./samplePacks";
import {
  CRYPTO_CASES,
  FOREX_CASES,
  FUTURES_CASES,
  OPTIONS_CONTEXT_CASES,
} from "./multiAssetCases";

export type CaseContextType = "news" | "financials" | "combined";
export type CaseThinkingMode =
  | "beat_miss"
  | "margin_compression"
  | "cash_flow_red_flag"
  | "guidance_cut"
  | "balance_sheet_stress"
  | "momentum_chase_vs_fade"
  | "company_headline"
  | "short_vs_sell"
  | "risk_off"
  | "macro_print"
  | "geopolitics_supply"
  | "combined_earnings_headline"
  | "combined_rumor_filing";

export type CaseAction = "buy" | "sell" | "hold" | "short";
export type CaseGrade = "correct" | "incorrect" | "partial";
export type CasePackId =
  | "demo"
  | "earnings"
  | "company-news"
  | "macro-news"
  | "combined"
  | "futures"
  | "forex"
  | "crypto"
  | "options-context";

export interface CaseDebrief {
  /** Process + theory — not direction-only */
  process: string;
  whyMarketMoved: string;
  evidence: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  contextType: CaseContextType;
  thinkingMode: CaseThinkingMode;
  brief: string;
  statementSnapshot?: FinancialSnapshot;
  newsHeadline?: string;
  preOhlc: OHLC[];
  postOhlc: OHLC[];
  correctActions: CaseAction[];
  acceptablePartial: CaseAction[];
  debrief: CaseDebrief;
  /** When false or omitted, SHORT is hidden — not a decision on this case. */
  allowShort?: boolean;
  packId: CasePackId;
  difficulty: "beginner" | "intermediate";
  /** When true, partial credit can apply if thesis ok but horizon mismatched (E5.M4) */
  partialOnHorizonMismatch?: boolean;
  /** Market type for Navigator / Cases filter; defaults to equity */
  assetClass?: AssetClass;
}

function bar(
  name: string,
  open: number,
  high: number,
  low: number,
  close: number
): OHLC {
  return { name, open, high, low, close };
}

function withAftermath(pre: OHLC[], aftermath: OHLC[]): OHLC[] {
  return [...pre, ...aftermath];
}

const TECH_PRE: OHLC[] = [
  bar("T-5", 178.2, 179.0, 177.8, 178.6),
  bar("T-4", 178.6, 179.4, 178.2, 179.1),
  bar("T-3", 179.1, 180.0, 178.8, 179.6),
  bar("T-2", 179.6, 180.8, 179.4, 180.4),
  bar("T-1", 180.4, 181.2, 180.0, 180.9),
  bar("T0", 180.9, 181.5, 180.2, 180.6),
];

const CYCLICAL_PRE: OHLC[] = [
  bar("T-5", 108.5, 109.8, 107.9, 109.2),
  bar("T-4", 109.2, 110.4, 108.6, 109.0),
  bar("T-3", 109.0, 109.6, 107.2, 107.8),
  bar("T-2", 107.8, 108.4, 106.5, 107.0),
  bar("T-1", 107.0, 108.2, 106.8, 107.6),
  bar("T0", 107.6, 108.0, 106.9, 107.2),
];

const BANK_PRE: OHLC[] = [
  bar("T-5", 42.8, 43.1, 42.4, 42.6),
  bar("T-4", 42.6, 42.9, 42.1, 42.3),
  bar("T-3", 42.3, 42.5, 41.6, 41.8),
  bar("T-2", 41.8, 42.0, 41.2, 41.4),
  bar("T-1", 41.4, 41.7, 40.9, 41.1),
  bar("T0", 41.1, 41.4, 40.7, 40.9),
];

const HEALTH_PRE: OHLC[] = [
  bar("T-5", 128.4, 129.0, 127.8, 128.6),
  bar("T-4", 128.6, 129.2, 128.0, 128.4),
  bar("T-3", 133.8, 135.2, 133.2, 134.6),
  bar("T-2", 134.6, 136.0, 134.0, 135.4),
  bar("T-1", 135.4, 136.4, 134.8, 135.8),
  bar("T0", 135.8, 136.8, 135.2, 136.1),
];

const SMALL_PRE: OHLC[] = [
  bar("T-5", 19.4, 19.9, 19.1, 19.6),
  bar("T-4", 19.6, 20.2, 19.3, 19.5),
  bar("T-3", 19.5, 19.8, 18.9, 19.2),
  bar("T-2", 19.2, 19.7, 19.0, 19.6),
  bar("T-1", 19.6, 20.1, 19.4, 19.8),
  bar("T0", 19.8, 20.4, 19.5, 19.9),
];

const UTILITY_PRE: OHLC[] = [
  bar("T-5", 58.2, 58.5, 58.0, 58.3),
  bar("T-4", 58.3, 58.6, 58.1, 58.4),
  bar("T-3", 58.4, 58.7, 58.2, 58.5),
  bar("T-2", 58.5, 58.9, 58.3, 58.6),
  bar("T-1", 58.6, 58.8, 58.4, 58.5),
  bar("T0", 58.5, 58.7, 58.3, 58.4),
];

const AIRLINE_PRE: OHLC[] = [
  bar("T-5", 36.8, 37.4, 36.2, 36.5),
  bar("T-4", 36.5, 36.9, 35.4, 35.8),
  bar("T-3", 35.8, 36.1, 34.6, 34.9),
  bar("T-2", 34.9, 35.4, 34.2, 34.6),
  bar("T-1", 34.6, 35.0, 33.8, 34.1),
  bar("T0", 34.1, 34.5, 33.4, 33.7),
];

const FOOD_PRE: OHLC[] = [
  bar("T-5", 72.1, 72.6, 71.8, 72.2),
  bar("T-4", 72.2, 72.8, 71.9, 72.0),
  bar("T-3", 72.0, 72.4, 71.5, 71.8),
  bar("T-2", 71.8, 72.3, 71.4, 72.1),
  bar("T-1", 72.1, 72.5, 71.7, 71.9),
  bar("T0", 71.9, 72.4, 71.6, 72.0),
];

const PHARMA_PRE: OHLC[] = [
  bar("T-5", 88.4, 89.2, 87.9, 88.8),
  bar("T-4", 88.8, 89.6, 88.2, 89.1),
  bar("T-3", 89.1, 89.5, 86.4, 86.9),
  bar("T-2", 86.9, 87.4, 85.8, 86.2),
  bar("T-1", 86.2, 86.8, 85.4, 85.9),
  bar("T0", 85.9, 86.4, 85.1, 85.5),
];

const STEEL_PRE: OHLC[] = [
  bar("T-5", 51.2, 51.8, 50.6, 51.0),
  bar("T-4", 51.0, 51.4, 50.2, 50.5),
  bar("T-3", 50.5, 52.8, 50.4, 52.4),
  bar("T-2", 52.4, 54.1, 52.0, 53.6),
  bar("T-1", 53.6, 54.8, 53.1, 54.2),
  bar("T0", 54.2, 55.0, 53.8, 54.6),
];

const TELCO_PRE: OHLC[] = [
  bar("T-5", 27.4, 27.7, 27.1, 27.3),
  bar("T-4", 27.3, 27.6, 26.8, 27.0),
  bar("T-3", 27.0, 27.2, 26.5, 26.7),
  bar("T-2", 26.7, 26.9, 26.2, 26.4),
  bar("T-1", 26.4, 26.8, 26.1, 26.5),
  bar("T0", 26.5, 26.9, 26.3, 26.6),
];

const REIT_PRE: OHLC[] = [
  bar("T-5", 31.8, 32.2, 31.5, 31.9),
  bar("T-4", 31.9, 32.4, 31.6, 32.1),
  bar("T-3", 32.1, 32.3, 31.4, 31.6),
  bar("T-2", 31.6, 31.9, 31.1, 31.3),
  bar("T-1", 31.3, 31.7, 31.0, 31.4),
  bar("T0", 31.4, 31.8, 31.1, 31.5),
];

/** Crowded staircase into a launch (≠ TECH grind, ≠ STEEL spike). */
const APPAREL_PRE: OHLC[] = [
  bar("T-5", 22.4, 23.1, 22.1, 22.9),
  bar("T-4", 22.9, 24.8, 22.8, 24.6),
  bar("T-3", 24.6, 27.2, 24.4, 26.8),
  bar("T-2", 26.8, 30.4, 26.6, 30.1),
  bar("T-1", 30.1, 34.2, 29.8, 33.8),
  bar("T0", 33.8, 36.6, 33.4, 36.0),
];

/** Tight chop after a scare headline (≠ FOOD range, ≠ REIT). */
const MINER_PRE: OHLC[] = [
  bar("T-5", 14.2, 14.6, 13.9, 14.1),
  bar("T-4", 14.1, 14.4, 13.6, 13.8),
  bar("T-3", 13.8, 14.5, 13.7, 14.3),
  bar("T-2", 14.3, 14.6, 13.9, 14.0),
  bar("T-1", 14.0, 14.3, 13.5, 13.7),
  bar("T0", 13.7, 14.2, 13.6, 14.0),
];

/** Run into a binary event (≠ PHARMA dump, ≠ HEALTH gap). */
const BIOTECH_PRE: OHLC[] = [
  bar("T-5", 41.2, 42.0, 40.8, 41.6),
  bar("T-4", 41.6, 44.2, 41.4, 43.8),
  bar("T-3", 43.8, 46.1, 43.5, 45.6),
  bar("T-2", 45.6, 48.4, 45.2, 47.9),
  bar("T-1", 47.9, 50.6, 47.4, 50.2),
  bar("T0", 50.2, 51.4, 49.6, 50.8),
];

const megaSnap = FINANCIAL_SNAPSHOTS[0]!;
const cyclicalSnap = FINANCIAL_SNAPSHOTS[1]!;

/** Pack B — financials / earnings (E5.M3). Floor ≥3; target ≥5 modes. */
export const EARNINGS_CASES: CaseStudy[] = [
  {
    id: "case-earn-beat-miss",
    title: "Earnings miss at a big tech company",
    contextType: "financials",
    thinkingMode: "beat_miss",
    brief:
      "This practice company looked healthy going into earnings. Sales met expectations, but profit per share came in weaker than people had hoped. The stock had been rising. Buy, sell, or hold before you see what happened next.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-earn-miss",
      incomeStatement: {
        ...megaSnap.incomeStatement,
        netIncome: 78_000,
        netMarginPct: 20.5,
      },
      notes: "Practice numbers: profit per share came in weaker than the recent run rate.",
    },
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 176.0, 176.8, 174.5, 175.2),
      bar("+2", 175.2, 175.9, 173.8, 174.4),
      bar("+3", 174.4, 175.0, 173.2, 173.9),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A company can still be profitable and still disappoint. If you owned it because you expected a strong report, a miss is a reason to rethink, not to ignore.",
      whyMarketMoved:
        "Buyers who assumed a clean beat stepped back. The stock sold off.",
      evidence:
        "Profit per share was weaker than expected, and the chart had already priced in good news.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-margin-compression",
    title: "Sales up, profit margin down",
    contextType: "financials",
    thinkingMode: "margin_compression",
    brief:
      "Sales are still growing, but the company keeps less profit from each dollar of sales. Costs caught up. The stock has been choppy near its highs. What do you do?",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-margin-comp",
      incomeStatement: {
        revenue: 390_000,
        netIncome: 58_000,
        netMarginPct: 14.9,
      },
      notes: "Practice numbers: sales up, profit margin down.",
    },
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 178.0, 178.5, 175.5, 176.2),
      bar("+2", 176.2, 176.8, 174.0, 174.8),
      bar("+3", 174.8, 175.4, 173.5, 174.1),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Growing sales is not enough if each sale is less profitable. Check the margin, not just the top line.",
      whyMarketMoved:
        "Investors pay less for a business that is getting less efficient.",
      evidence:
        "Revenue held up, but net margin dropped sharply.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-cash-flow-flag",
    title: "Profit on paper, cash missing",
    contextType: "financials",
    thinkingMode: "cash_flow_red_flag",
    brief:
      "The income statement still shows a profit, but cash from running the business collapsed. The stock was already weak. Buy, sell, or hold?",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-cf-flag",
      incomeStatement: {
        revenue: 200_000,
        netIncome: 12_000,
        netMarginPct: 6,
      },
      cashFlow: {
        operatingCashFlow: 4_000,
        freeCashFlow: -3_500,
      },
      notes: "Practice numbers: reported profit, but cash from operations is weak.",
    },
    preOhlc: CYCLICAL_PRE,
    postOhlc: withAftermath(CYCLICAL_PRE, [
      bar("+1", 105.0, 105.8, 103.2, 103.9),
      bar("+2", 103.9, 104.4, 102.0, 102.5),
      bar("+3", 102.5, 103.0, 101.2, 101.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Reported profit can look fine while cash is not actually arriving. Check cash flow before you treat earnings as proof the business is healthy.",
      whyMarketMoved:
        "Sellers focused on cash, not the accounting profit.",
      evidence:
        "Net income is still positive. Operating cash and free cash flow are not.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-guidance-cut",
    title: "Decent quarter, weaker outlook",
    contextType: "financials",
    thinkingMode: "guidance_cut",
    brief:
      "The latest quarter was acceptable, but management lowered what they expect next year. The stock had been bid up into the report. Decide with this snapshot only.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-guidance",
      incomeStatement: {
        revenue: 385_000,
        netIncome: 90_000,
        netMarginPct: 23.4,
      },
      notes: "Practice numbers: last quarter was fine. Next-year outlook was cut.",
    },
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 177.5, 178.0, 175.0, 175.6),
      bar("+2", 175.6, 176.2, 174.2, 174.8),
      bar("+3", 174.8, 175.5, 173.8, 174.5),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Markets care about what comes next. A decent quarter can still disappoint if the company lowers its forecast. Match your action to how long you planned to hold.",
      whyMarketMoved:
        "The stock sold off on the weaker outlook, not on last quarter's profit.",
      evidence:
        "Trailing results look okay. The warning is the cut in next-year guidance.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-balance-stress",
    title: "Earnings thin, debt jumped",
    contextType: "financials",
    thinkingMode: "balance_sheet_stress",
    brief:
      "Debt jumped relative to the company's equity, and earnings are thin. The chart is already weak. How much risk are you willing to take?",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-bs-stress",
      incomeStatement: {
        revenue: 195_000,
        netIncome: 6_000,
        netMarginPct: 3.1,
      },
      balanceSheet: {
        assets: 430_000,
        liabilities: 360_000,
        equity: 70_000,
      },
      notes: "Practice numbers: more debt, thinner equity cushion.",
    },
    preOhlc: CYCLICAL_PRE,
    postOhlc: withAftermath(CYCLICAL_PRE, [
      bar("+1", 104.5, 105.0, 102.5, 103.0),
      bar("+2", 103.0, 103.5, 101.0, 101.6),
      bar("+3", 101.6, 102.2, 100.2, 100.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A thin equity cushion leaves less room for error when the business cycle turns. Pair the earnings picture with the balance sheet.",
      whyMarketMoved:
        "The stock priced in more distress risk as liabilities rose versus equity.",
      evidence:
        "Leverage went up while earnings stayed weak.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-retail-beat-thin",
    title: "Retail beat, but traffic was the story",
    contextType: "financials",
    thinkingMode: "beat_miss",
    brief:
      "This SAMPLE retailer beat on profit, but store traffic was weaker than the crowd wanted. The stock had already jumped into the print. Buy, sell, or hold before you see what happened next.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-earn-retail-beat",
      label: "Retail chain",
      symbol: "NKE.S",
      incomeStatement: {
        revenue: 210_000,
        netIncome: 18_000,
        netMarginPct: 8.6,
      },
      notes: "Practice numbers: profit beat, traffic commentary weaker than hoped.",
    },
    preOhlc: [
      bar("T-5", 94.2, 94.8, 93.9, 94.5),
      bar("T-4", 94.5, 95.0, 94.1, 94.4),
      bar("T-3", 97.8, 98.6, 97.4, 98.2),
      bar("T-2", 98.2, 99.4, 98.0, 99.1),
      bar("T-1", 99.1, 100.2, 98.8, 99.9),
      bar("T0", 99.9, 101.0, 99.4, 100.6),
    ],
    postOhlc: withAftermath(
      [
        bar("T-5", 94.2, 94.8, 93.9, 94.5),
        bar("T-4", 94.5, 95.0, 94.1, 94.4),
        bar("T-3", 97.8, 98.6, 97.4, 98.2),
        bar("T-2", 98.2, 99.4, 98.0, 99.1),
        bar("T-1", 99.1, 100.2, 98.8, 99.9),
        bar("T0", 99.9, 101.0, 99.4, 100.6),
      ],
      [
        bar("+1", 97.2, 97.8, 95.6, 96.1),
        bar("+2", 96.1, 96.6, 94.8, 95.2),
        bar("+3", 95.2, 95.8, 94.2, 94.6),
      ],
    ),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A beat on profit is not the whole print. If the stock already jumped into the report, weaker traffic can be the new fact. HOLD is valid if you need time to reread the thesis.",
      whyMarketMoved:
        "Buyers who paid up for a clean beat stepped back when the traffic comment landed.",
      evidence:
        "Profit beat on SAMPLE numbers; the tape was already extended into the print; traffic was the miss the crowd cared about.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-bank-quiet-beat",
    title: "Bank beats, loan growth still slow",
    contextType: "financials",
    thinkingMode: "beat_miss",
    brief:
      "This SAMPLE regional bank beat on profit by a little. Loan growth stayed slow. The stock had already slipped into the print. Buy, sell, or hold before you see what happened next.",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-earn-bank-quiet",
      label: "Regional bank",
      symbol: "JPM.S",
      incomeStatement: {
        revenue: 48_000,
        netIncome: 12_400,
        netMarginPct: 25.8,
      },
      notes: "Practice numbers: small profit beat, slow loan growth.",
    },
    preOhlc: BANK_PRE,
    postOhlc: withAftermath(BANK_PRE, [
      bar("+1", 40.9, 41.6, 40.6, 41.3),
      bar("+2", 41.3, 41.8, 41.0, 41.5),
      bar("+3", 41.5, 41.9, 41.1, 41.4),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "A small beat into a weak tape is often not a new story. Hold is fair when the miss the crowd cared about (loan growth) did not flip.",
      whyMarketMoved:
        "The stock bounced a little, then stalled. The beat was not a reset.",
      evidence:
        "Profit beat on SAMPLE numbers; loan growth stayed slow; the chart was already slipping.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-int-beat-gap",
    title: "Beat on EPS, miss on the mix",
    contextType: "financials",
    thinkingMode: "beat_miss",
    brief:
      "This SAMPLE healthcare name beat EPS, but the mix shifted toward lower-margin contracts. The stock gapped higher into the print. You already passed Indicators. Decide with the mix, not the headline EPS.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-earn-int-mix",
      label: "Healthcare services",
      symbol: "UNH.S",
      incomeStatement: {
        revenue: 412_000,
        netIncome: 22_000,
        netMarginPct: 5.3,
      },
      notes: "Practice: EPS beat, mix shifted to thinner contracts.",
    },
    preOhlc: HEALTH_PRE,
    postOhlc: withAftermath(HEALTH_PRE, [
      bar("+1", 132.4, 133.0, 129.8, 130.6),
      bar("+2", 130.6, 131.2, 128.4, 129.1),
      bar("+3", 129.1, 129.8, 127.6, 128.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "EPS can beat while the engine that produces EPS gets worse. Intermediate work is naming the mix, then matching your time frame.",
      whyMarketMoved:
        "Buyers who paid the gap sold when the mix comment landed.",
      evidence:
        "EPS beat on SAMPLE numbers; mix comment weaker; tape already gapped into the print.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "intermediate",
  },
  {
    id: "case-earn-int-margin-volume",
    title: "Units up, dollars of profit down",
    contextType: "financials",
    thinkingMode: "margin_compression",
    brief:
      "This SAMPLE food company shipped more units. Net margin still fell. Price cuts and promotions explain most of it. The stock is stuck in a range. How do you treat a volume story that is not a profit story?",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-earn-int-food-margin",
      label: "Packaged food",
      symbol: "GIS.S",
      incomeStatement: {
        revenue: 88_000,
        netIncome: 4_200,
        netMarginPct: 4.8,
      },
      notes: "Practice: unit growth with promotional margin hit.",
    },
    preOhlc: FOOD_PRE,
    postOhlc: withAftermath(FOOD_PRE, [
      bar("+1", 71.4, 71.8, 70.2, 70.6),
      bar("+2", 70.6, 71.0, 69.6, 69.9),
      bar("+3", 69.9, 70.4, 69.2, 69.5),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Volume without margin is not automatically healthy. Ask whether promotions are temporary or the new price the customer will pay.",
      whyMarketMoved:
        "The range broke lower once the promotional comment showed up in the numbers.",
      evidence:
        "Units up, net margin down on SAMPLE cards. Range tape, not a melt-up.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "intermediate",
  },
  {
    id: "case-earn-int-cash-receivables",
    title: "Profit printed, receivables ate cash",
    contextType: "financials",
    thinkingMode: "cash_flow_red_flag",
    brief:
      "This SAMPLE software name printed a profit. Free cash flow went negative as receivables jumped. The stock had been grinding. You have already seen a snapshot card. Decide whether paper profit is enough.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-earn-int-recv",
      label: "Software vendor",
      symbol: "CRM.S",
      incomeStatement: {
        revenue: 92_000,
        netIncome: 11_000,
        netMarginPct: 12.0,
      },
      cashFlow: {
        operatingCashFlow: 1_200,
        freeCashFlow: -4_800,
      },
      notes: "Practice: profit with a receivables-driven cash miss.",
    },
    preOhlc: SMALL_PRE,
    postOhlc: withAftermath(SMALL_PRE, [
      bar("+1", 18.9, 19.1, 17.8, 18.1),
      bar("+2", 18.1, 18.4, 17.2, 17.5),
      bar("+3", 17.5, 17.8, 16.9, 17.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Profit without cash is a process flag. Hold only if you can name why receivables will reverse. Buying the grind because EPS looks fine is the trap.",
      whyMarketMoved:
        "The chop resolved lower when cash quality showed up next to the profit print.",
      evidence:
        "SAMPLE FCF negative vs positive net income; receivables called out in the notes.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "intermediate",
  },
  {
    id: "case-earn-int-guide-cut-utility",
    title: "Utility cuts capex-funded outlook",
    contextType: "financials",
    thinkingMode: "guidance_cut",
    brief:
      "This SAMPLE utility beat the quarter. It also cut next-year growth because a rate case slipped. The stock barely moved into the print. Which clock are you on: last quarter, or the delayed rate path?",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-earn-int-util-guide",
      label: "Regulated utility",
      symbol: "NEE.S",
      incomeStatement: {
        revenue: 26_000,
        netIncome: 3_100,
        netMarginPct: 11.9,
      },
      notes: "Practice: quarter ok, growth outlook delayed by a rate case.",
    },
    preOhlc: UTILITY_PRE,
    postOhlc: withAftermath(UTILITY_PRE, [
      bar("+1", 57.8, 58.0, 56.9, 57.2),
      bar("+2", 57.2, 57.4, 56.4, 56.7),
      bar("+3", 56.7, 57.0, 56.1, 56.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A beat does not cancel a slower path. Intermediate work is matching the cut to your holding period, not treating utilities as auto-hold.",
      whyMarketMoved:
        "Income buyers faded a slower growth path even though the quarter was fine.",
      evidence:
        "Quarter beat on SAMPLE numbers; outlook cut tied to a delayed rate case.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "intermediate",
  },
  {
    id: "case-earn-int-debt-airline",
    title: "Airline prints a profit on a thin equity cushion",
    contextType: "financials",
    thinkingMode: "balance_sheet_stress",
    brief:
      "This SAMPLE airline printed a profit after a weak stretch. Debt is still large versus equity. The tape is already sliding. A profitable quarter does not rewrite the balance sheet. What risk are you taking?",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-earn-int-air-debt",
      label: "Airline",
      symbol: "DAL.S",
      incomeStatement: {
        revenue: 54_000,
        netIncome: 1_800,
        netMarginPct: 3.3,
      },
      balanceSheet: {
        assets: 72_000,
        liabilities: 64_000,
        equity: 8_000,
      },
      notes: "Practice: thin profit, thin equity, still a lot of debt.",
    },
    preOhlc: AIRLINE_PRE,
    postOhlc: withAftermath(AIRLINE_PRE, [
      bar("+1", 32.8, 33.1, 31.6, 31.9),
      bar("+2", 31.9, 32.3, 30.8, 31.2),
      bar("+3", 31.2, 31.6, 30.2, 30.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Profit on a thin equity cushion still leaves you last in line. Hold only if you sized for a further slide. Buying because the quarter was green ignores leverage.",
      whyMarketMoved:
        "The slide continued. Leverage buyers did not get a reset from one print.",
      evidence:
        "SAMPLE liabilities dwarf equity; profit is thin; the tape was already weak.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "intermediate",
  },
];

/** Pack A — thin company news (E5.M2). Equity underlyings; no macro/FOMC required. */
export const COMPANY_NEWS_CASES: CaseStudy[] = [
  {
    id: "case-news-chase-fade",
    title: "Stock already ran, then a product headline",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "The stock already rallied hard. Then a product-refresh headline hits and social media tells you to buy. The chart looks stretched. Is this a reason to buy, or a reason to wait?",
    newsHeadline:
      "Big tech announces a small product refresh. Social posts call it a moonshot.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 179.5, 180.2, 177.0, 177.6),
      bar("+2", 177.6, 178.0, 176.2, 176.8),
      bar("+3", 176.8, 177.4, 175.5, 176.0),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Ask what is already in the price. A loud headline after a big run is often a reason to wait or take profits, unless you have a new fact the crowd missed.",
      whyMarketMoved:
        "Late buyers met sellers who used the headline as a chance to exit.",
      evidence:
        "The chart was already extended. The product news was incremental, not a new business.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-supplier-win",
    title: "New multi-year supply contract",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This industrial stock has been slipping. Then the company wins a multi-year supply contract with a large manufacturer. Does that change the story enough to buy, or do you wait?",
    newsHeadline:
      "Industrial company wins a multi-year supply contract with a large manufacturer.",
    preOhlc: CYCLICAL_PRE,
    postOhlc: withAftermath(CYCLICAL_PRE, [
      bar("+1", 108.5, 110.2, 108.0, 109.6),
      bar("+2", 109.6, 111.0, 109.2, 110.4),
      bar("+3", 110.4, 111.5, 109.8, 111.0),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Ask whether the contract is big enough and long enough to matter, and whether the weak chart already baked in bad news. Durable new demand can justify buying or holding instead of panic selling.",
      whyMarketMoved:
        "A visible multi-year order book reduced near-term demand worry.",
      evidence:
        "This is company news, not a market-wide event. Map the contract to the business before you chase or dump.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-ceo-exit",
    title: "CEO resigns, no scandal alleged",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "The stock is near highs. The CEO resigns suddenly. The board names an interim leader. Nobody alleges fraud. What do you do?",
    newsHeadline: "CEO resigns unexpectedly. Board names an interim CEO.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 178.0, 178.6, 175.8, 176.4),
      bar("+2", 176.4, 177.0, 175.0, 175.6),
      bar("+3", 175.6, 176.5, 174.8, 175.9),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A leadership gap raises execution risk even without fraud. Hold if your thesis is years out and you trust the board. Trim if you needed certainty soon.",
      whyMarketMoved:
        "The stock priced in uncertainty until a permanent plan is clear.",
      evidence:
        "Company news only. Uncertainty is not an automatic short. It is a reason not to chase.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-pharma-trial-hype",
    title: "Trial headline after a gap-down week",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE pharma name already dumped. Then a mid-stage trial headline hits social feeds. The trial is small. Is this a reason to chase the bounce, or a reason to wait for a filing?",
    newsHeadline:
      "Small mid-stage trial called encouraging on social posts. Full data not filed.",
    preOhlc: PHARMA_PRE,
    postOhlc: withAftermath(PHARMA_PRE, [
      bar("+1", 87.2, 89.4, 86.8, 88.6),
      bar("+2", 88.6, 89.0, 85.4, 85.9),
      bar("+3", 85.9, 86.4, 84.6, 85.1),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dumped chart plus a thin trial headline is a classic chase. Wait for what was actually measured. Hold is fair if you already own a sized position.",
      whyMarketMoved:
        "The bounce faded when the headline stayed small.",
      evidence:
        "Gap-down tape, then a social trial post without a full filing.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-steel-contract-spike",
    title: "Steel mill wins a one-off order",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE steel mill already spiked. Then it announces a one-off export order. The order is large for one quarter, not a multi-year book. Buy, sell, or hold?",
    newsHeadline: "Wins a large one-quarter export order. No multi-year frame.",
    preOhlc: STEEL_PRE,
    postOhlc: withAftermath(STEEL_PRE, [
      bar("+1", 54.0, 54.4, 51.8, 52.2),
      bar("+2", 52.2, 52.8, 51.2, 51.6),
      bar("+3", 51.6, 52.1, 50.8, 51.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Map the order to how long the cash shows up. A one-off after a spike is often a reason not to chase.",
      whyMarketMoved:
        "Late buyers met sellers who treated the order as already in the spike.",
      evidence:
        "Spike tape plus a one-quarter order, not a multi-year contract.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-telco-spectrum-pause",
    title: "Telco delays a spectrum purchase",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE telco was grinding lower. It delays a spectrum purchase to keep cash. No scandal. Does delaying a spend change the story enough to buy?",
    newsHeadline: "Pauses a spectrum purchase to hold cash. No scandal alleged.",
    preOhlc: TELCO_PRE,
    postOhlc: withAftermath(TELCO_PRE, [
      bar("+1", 26.8, 27.4, 26.6, 27.2),
      bar("+2", 27.2, 27.6, 26.9, 27.3),
      bar("+3", 27.3, 27.7, 27.0, 27.4),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A pause can be a cash choice, not a broken network. Hold if you needed a permanent plan. Buy only if cash flexibility was the missing piece.",
      whyMarketMoved:
        "The grind lifted a little once the spend delay was clear.",
      evidence:
        "Company headline on cash vs spend. Weak tape, not a scandal dump.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-int-chase-reit",
    title: "REIT already ran into a refinancing headline",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE REIT already ran. A refinancing headline says the company rolled a loan at a slightly better rate. You have Indicators. Is the headline new information, or a reason for late buyers to exit?",
    newsHeadline:
      "Rolls a loan at a modestly better rate. No new properties added.",
    preOhlc: REIT_PRE,
    postOhlc: withAftermath(REIT_PRE, [
      bar("+1", 31.2, 31.5, 30.2, 30.5),
      bar("+2", 30.5, 30.8, 29.8, 30.1),
      bar("+3", 30.1, 30.4, 29.6, 29.9),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Ask what is already in the price. A modest refinance after a run is often incremental. Intermediate work is naming the incremental fact before you add risk.",
      whyMarketMoved:
        "The run faded. The headline did not add properties or cash flow.",
      evidence:
        "Extended REIT tape plus a modest rate roll, not a new portfolio.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "intermediate",
  },
  {
    id: "case-news-int-headline-plant",
    title: "Factory fire, insurance comment attached",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE food plant has a fire. The company says insurance should cover rebuild. The stock is in a tight range. Separate the scary picture from the cash comment before you dump or chase a bounce.",
    newsHeadline:
      "Plant fire. Company says insurance should cover rebuild costs.",
    preOhlc: FOOD_PRE,
    postOhlc: withAftermath(FOOD_PRE, [
      bar("+1", 70.8, 71.2, 68.4, 69.0),
      bar("+2", 69.0, 69.6, 68.1, 68.8),
      bar("+3", 68.8, 70.2, 68.5, 69.8),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell", "buy"],
    debrief: {
      process:
        "A fire is a real hit to near-term units. Insurance can cap the cash damage. Hold is process when you cannot yet size the downtime versus the cover.",
      whyMarketMoved:
        "The range broke, then partly filled as the insurance comment circulated.",
      evidence:
        "Company headline with an insurance claim, not a market-wide shock.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "intermediate",
  },
  {
    id: "case-news-int-chase-small",
    title: "Small-name listing rumor after a chop",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "This SAMPLE small name chopped for days. Chat says a larger listing is coming. No filing. You already know rumor vs filing from Training. Chase, fade, or wait?",
    newsHeadline: "Unconfirmed listing chatter. No filing posted.",
    preOhlc: SMALL_PRE,
    postOhlc: withAftermath(SMALL_PRE, [
      bar("+1", 21.2, 22.4, 20.8, 21.0),
      bar("+2", 21.0, 21.4, 19.6, 19.9),
      bar("+3", 19.9, 20.2, 19.1, 19.4),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Low-quality listing chatter after a chop is a fade-or-wait problem. Do not treat chat as a catalyst.",
      whyMarketMoved:
        "The spike faded when no filing appeared.",
      evidence:
        "Chop tape plus unconfirmed listing chatter.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "intermediate",
  },
  {
    id: "case-news-int-headline-bank-branch",
    title: "Bank closes branches, keeps the deposit book",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This SAMPLE bank was sliding. It closes a cluster of branches and says deposits stay. Cost cut vs franchise risk. You have a snapshot habit already. What is the actual change?",
    newsHeadline:
      "Closes a cluster of branches. Says deposits remain with the bank.",
    preOhlc: BANK_PRE,
    postOhlc: withAftermath(BANK_PRE, [
      bar("+1", 41.2, 42.0, 41.0, 41.7),
      bar("+2", 41.7, 42.2, 41.4, 41.9),
      bar("+3", 41.9, 42.3, 41.5, 41.8),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A branch close can be a cost story if deposits stay. Intermediate work is naming what must remain true (deposits) before you buy a falling bank tape.",
      whyMarketMoved:
        "The slide paused when the deposit comment bounded the franchise worry.",
      evidence:
        "Company headline on costs vs deposits. Sliding tape into the print.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "intermediate",
  },
  {
    id: "case-news-short-recall",
    title: "You do not own it. The launch is recalled.",
    contextType: "news",
    thinkingMode: "short_vs_sell",
    brief:
      "You do not own this SAMPLE apparel stock. It already ran on a must-have launch. Then the company recalls that launch product. Sell is for shares you already have. Short is a new bet that the price falls. What do you do?",
    newsHeadline: "Recalls the launch product. Stores pull the SKU.",
    preOhlc: APPAREL_PRE,
    postOhlc: withAftermath(APPAREL_PRE, [
      bar("+1", 34.2, 34.8, 30.6, 31.0),
      bar("+2", 31.0, 31.4, 28.4, 28.8),
      bar("+3", 28.8, 29.2, 27.1, 27.6),
    ]),
    correctActions: ["short"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Sell closes a long you already have. You do not have one. Short is the downside bet when the launch thesis broke and the tape is crowded. Hold is fair if you refuse short risk — a short can lose more if the stock rips back.",
      whyMarketMoved:
        "Late launch buyers stepped aside. The recall removed the reason for the run.",
      evidence:
        "Crowded staircase into the launch, then a recall of that same product. You started with no shares.",
    },
    allowShort: true,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-short-rumor-trap",
    title: "Scary rumor, no filing, you do not own it",
    contextType: "news",
    thinkingMode: "short_vs_sell",
    brief:
      "You do not own this SAMPLE miner. Chat says the CEO is under review. The company has not filed anything. It says operations are unchanged. The chart is choppy, not a crash. Short is on this question so you can see the trap.",
    newsHeadline:
      "Unconfirmed CEO-under-review chatter. No filing. Operations unchanged.",
    preOhlc: MINER_PRE,
    postOhlc: withAftermath(MINER_PRE, [
      bar("+1", 14.0, 14.4, 13.8, 14.2),
      bar("+2", 14.2, 14.6, 14.0, 14.3),
      bar("+3", 14.3, 14.5, 13.9, 14.1),
    ]),
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process:
        "A rumor without a filing is not an automatic short. You also have nothing to sell. Stand aside until a fact shows up.",
      whyMarketMoved:
        "The chop stayed a chop. No filing arrived to change cash or control.",
      evidence:
        "Unconfirmed chatter, operations-unchanged comment, and a tight range — not a broken thesis.",
    },
    allowShort: true,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-int-short-trial-fail",
    title: "Filed trial miss after a run-up",
    contextType: "news",
    thinkingMode: "short_vs_sell",
    brief:
      "You do not own this SAMPLE biotech. The stock ran into a trial date. The company filed: the trial missed its main goal. You already know rumor vs filing. Selling would be for a long you do not have. Is a short the process bet, or do you stand aside?",
    newsHeadline: "Files that the late-stage trial missed its main goal.",
    preOhlc: BIOTECH_PRE,
    postOhlc: withAftermath(BIOTECH_PRE, [
      bar("+1", 44.8, 45.6, 39.2, 39.8),
      bar("+2", 39.8, 40.4, 37.6, 38.1),
      bar("+3", 38.1, 38.6, 36.4, 36.9),
    ]),
    correctActions: ["short"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A filed miss broke the event thesis. Short is a new downside bet, not the same as selling a long. Hold is partial if you refuse short risk after a gap. Price can still bounce — shorts can lose more than they start with.",
      whyMarketMoved:
        "The event premium came out once the filing was public.",
      evidence:
        "Run into the date, then a filed miss of the main goal. You started with no shares.",
    },
    allowShort: true,
    packId: "company-news",
    difficulty: "intermediate",
  },
];

/** Pack A macro intro (E5.M2b) — risk-off, macro print, geopolitics/supply. */
export const MACRO_NEWS_CASES: CaseStudy[] = [
  {
    id: "case-macro-risk-off",
    title: "Market-wide fear, stock already ran",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Investors are selling risky assets: credit spreads widen, defensive stocks hold up, high-growth tech weakens at the open. Your big-tech name had already run. What do you do?",
    newsHeadline:
      "Risk appetite fades. Money rotates toward cash and defensive stocks.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 177.0, 177.8, 174.5, 175.2),
      bar("+2", 175.2, 175.9, 173.0, 173.8),
      bar("+3", 173.8, 174.6, 172.5, 173.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "This is about how much market risk you want, not one company's story. Cutting or holding a sized position is process. Buying more into the scare usually is not.",
      whyMarketMoved:
        "Risky assets sold together as investors wanted cash.",
      evidence:
        "Market-wide headline plus a stock that had already run.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "intermediate",
  },
  {
    id: "case-macro-print",
    title: "Inflation comes in hotter than expected",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "Inflation comes in hotter than expected. Rate-cut hopes fade. This stock, used here as a stand-in for the broader market, had been grinding higher.",
    newsHeadline:
      "Inflation hotter than expected. Odds of a rate cut fall.",
    preOhlc: TECH_PRE.map((r) => ({
      ...r,
      open: r.open * 2.9,
      high: r.high * 2.9,
      low: r.low * 2.9,
      close: r.close * 2.9,
    })),
    postOhlc: withAftermath(
      TECH_PRE.map((r) => ({
        ...r,
        open: r.open * 2.9,
        high: r.high * 2.9,
        low: r.low * 2.9,
        close: r.close * 2.9,
      })),
      [
        bar("+1", 520.0, 521.0, 514.0, 515.5),
        bar("+2", 515.5, 516.8, 512.0, 513.2),
        bar("+3", 513.2, 514.5, 511.0, 512.4),
      ]
    ),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hot inflation can reprice interest rates. Even a good company can fall when discount rates rise. Match your action to how long you planned to hold.",
      whyMarketMoved:
        "Higher-for-longer rates compressed what people would pay for the stock.",
      evidence:
        "This is economic data, not a company filing. Separate how good the company is from how sensitive it is to rates.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "intermediate",
  },
  {
    id: "case-macro-supply",
    title: "Shipping lane disrupted",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "A key shipping lane is disrupted. Energy and freight costs jump overnight. Your industrial/energy-linked stock was already weak. Who benefits?",
    newsHeadline:
      "Shipping-lane disruption raises energy and freight cost fears.",
    preOhlc: CYCLICAL_PRE,
    postOhlc: withAftermath(CYCLICAL_PRE, [
      bar("+1", 109.0, 112.5, 108.5, 111.8),
      bar("+2", 111.8, 113.2, 110.5, 112.0),
      bar("+3", 112.0, 113.0, 110.8, 111.5),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply shock can help producers and hurt companies that buy the commodity. Figure out which side this stock sits on before you sell because the news sounds scary.",
      whyMarketMoved:
        "The commodity-linked name rallied as scarcity fears lifted near-term pricing power.",
      evidence:
        "Supply-shock headline on a cyclical company. Follow how the shock reaches this business, not just the scary words.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "intermediate",
  },
  {
    id: "case-macro-beg-risk-off-utility",
    title: "Market fear, utility barely moved",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Risky stocks are selling. This SAMPLE utility barely moved. You own it as a calmer name. Buy more, sell, or hold while the rest of the tape is scared?",
    newsHeadline:
      "Risk appetite fades. Defensive names hold up better than growth.",
    preOhlc: UTILITY_PRE,
    postOhlc: withAftermath(UTILITY_PRE, [
      bar("+1", 58.5, 59.0, 58.3, 58.8),
      bar("+2", 58.8, 59.2, 58.5, 58.9),
      bar("+3", 58.9, 59.3, 58.6, 59.0),
    ]),
    correctActions: ["hold", "buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Market-wide fear is about how much risk you want. A calm name can be a hold. Buying more is only process if that was already your plan.",
      whyMarketMoved:
        "Money rotated toward names that had not run.",
      evidence:
        "Market-wide headline plus a slow utility tape, not a company filing.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "beginner",
  },
  {
    id: "case-macro-beg-risk-off-airline",
    title: "Travel stocks sold with everything else",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Investors are selling risky assets. This SAMPLE airline was already sliding. The headline is about the whole market, not this company's flights. What do you do?",
    newsHeadline: "Risk-off. High-beta travel names sold with the tape.",
    preOhlc: AIRLINE_PRE,
    postOhlc: withAftermath(AIRLINE_PRE, [
      bar("+1", 32.9, 33.2, 31.4, 31.8),
      bar("+2", 31.8, 32.1, 30.6, 31.0),
      bar("+3", 31.0, 31.4, 30.2, 30.5),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "If the scare is market-wide, adding to a sliding airline is usually not process. Hold if you sized for a further slide.",
      whyMarketMoved:
        "Risky travel names sold together.",
      evidence:
        "Already-weak tape plus a risk-off headline.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "beginner",
  },
  {
    id: "case-macro-beg-risk-off-bank",
    title: "Banks sold as credit worries rise",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Credit spreads are in the headline. This SAMPLE bank was already grinding lower. No new filing from this bank. Stock vs tape: which one are you deciding?",
    newsHeadline: "Credit spreads widen. Bank stocks sold as a group.",
    preOhlc: BANK_PRE,
    postOhlc: withAftermath(BANK_PRE, [
      bar("+1", 40.4, 40.6, 39.2, 39.5),
      bar("+2", 39.5, 39.8, 38.8, 39.1),
      bar("+3", 39.1, 39.4, 38.5, 38.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A group move is not the same as a company filing. Cutting or holding a sized position is process. Buying because it looks cheap in a scare is usually not.",
      whyMarketMoved:
        "Bank stocks sold together as credit worry rose.",
      evidence:
        "Market-wide credit headline, not this bank's earnings.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "beginner",
  },
  {
    id: "case-macro-beg-print-jobs-hot",
    title: "Jobs come in hotter than people hoped",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "A jobs print comes in hotter than people hoped. Rate-cut talk fades. This SAMPLE software name had been chopping. What do you do before you see the next bars?",
    newsHeadline: "Jobs hotter than expected. Rate-cut odds fall.",
    preOhlc: SMALL_PRE,
    postOhlc: withAftermath(SMALL_PRE, [
      bar("+1", 19.2, 19.4, 18.1, 18.4),
      bar("+2", 18.4, 18.7, 17.8, 18.0),
      bar("+3", 18.0, 18.3, 17.5, 17.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Hot labor data can reprice rates. Even a fine company can fall when people pay less for future profits. Match the action to how long you meant to hold.",
      whyMarketMoved:
        "Rate-sensitive names sold after the print.",
      evidence:
        "Economic data, not a company filing. Chop tape into the print.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "beginner",
  },
  {
    id: "case-macro-beg-print-soft-landing",
    title: "Inflation cools a little",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "Inflation cools a little, not a collapse. This SAMPLE REIT had been stuck. Soft-landing talk picks up. Buy, sell, or hold?",
    newsHeadline: "Inflation cools modestly. Soft-landing talk returns.",
    preOhlc: REIT_PRE,
    postOhlc: withAftermath(REIT_PRE, [
      bar("+1", 31.7, 32.6, 31.5, 32.3),
      bar("+2", 32.3, 32.9, 32.0, 32.6),
      bar("+3", 32.6, 33.1, 32.2, 32.8),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Easier inflation talk can help rate-sensitive names. Still ask whether you are early or late. Hold is fair if the move is already in the tape.",
      whyMarketMoved:
        "REITs bid as rate-cut hopes ticked up.",
      evidence:
        "Macro print tone, not a property filing.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "beginner",
  },
  {
    id: "case-macro-beg-print-gdp-soft",
    title: "Growth data comes in soft",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "Growth data comes in soft. This SAMPLE steel mill had already spiked. Is softer growth a reason to take the spike off, or a reason to wait?",
    newsHeadline: "Growth data softer than expected. Demand chatter cools.",
    preOhlc: STEEL_PRE,
    postOhlc: withAftermath(STEEL_PRE, [
      bar("+1", 53.2, 53.6, 51.4, 51.8),
      bar("+2", 51.8, 52.2, 50.6, 51.0),
      bar("+3", 51.0, 51.5, 50.2, 50.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Soft growth can hit cyclicals that already ran. Taking risk off after a spike is process. Buying more because it 'looks cheap' after one print is usually not.",
      whyMarketMoved:
        "The spike faded as demand chatter cooled.",
      evidence:
        "Macro print plus a steel tape that had already jumped.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "beginner",
  },
  {
    id: "case-macro-beg-supply-freight",
    title: "Port delay lifts freight costs",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "A port delay lifts freight costs overnight. This SAMPLE food company buys a lot of shipped inputs. The stock was range-bound. Who gets hurt?",
    newsHeadline: "Port delay. Freight costs jump. Importers on watch.",
    preOhlc: FOOD_PRE,
    postOhlc: withAftermath(FOOD_PRE, [
      bar("+1", 71.2, 71.5, 69.4, 69.8),
      bar("+2", 69.8, 70.2, 68.8, 69.2),
      bar("+3", 69.2, 69.6, 68.4, 68.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A supply shock can hurt companies that buy the scarce thing. Name which side this stock sits on before you buy a 'bounce.'",
      whyMarketMoved:
        "An importer-like food name sold as freight costs jumped.",
      evidence:
        "Supply headline on a range-bound buyer of shipped inputs.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "beginner",
  },
  {
    id: "case-macro-beg-supply-energy",
    title: "Pipeline outage, energy producer",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "A pipeline outage hits the tape. This SAMPLE energy producer may get a better price near term. The stock had been weak. Scary news is not automatically a sell.",
    newsHeadline: "Pipeline outage. Near-term energy prices jump.",
    preOhlc: CYCLICAL_PRE,
    postOhlc: withAftermath(CYCLICAL_PRE, [
      bar("+1", 108.4, 111.8, 108.0, 111.2),
      bar("+2", 111.2, 113.0, 110.4, 112.2),
      bar("+3", 112.2, 113.4, 111.0, 112.0),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Figure out whether this name sells the scarce thing or buys it. Producers can catch a bid on the same headline that hurts buyers.",
      whyMarketMoved:
        "The weak energy tape reversed as scarcity talk lifted prices.",
      evidence:
        "Supply-shock headline on a producer-like SAMPLE energy name.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "beginner",
  },
];

/** Pack C — combined news + statements (E5.M4). */
export const COMBINED_CASES: CaseStudy[] = [
  {
    id: "case-comb-earn-headline",
    title: "Beat the quarter, cut the outlook",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "The latest quarter beat estimates, but the headline is a guidance cut. Last quarter's margins still look solid. Are you deciding for the next few weeks, or for years?",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-beat",
      notes: "Practice: last quarter beat. Forward outlook is weaker.",
    },
    newsHeadline: "Beats estimates but cuts next-year outlook.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 178.5, 179.0, 175.0, 175.8),
      bar("+2", 175.8, 176.5, 174.2, 174.9),
      bar("+3", 174.9, 175.8, 173.8, 174.5),
    ]),
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "A beat can still fail a short-term thesis if the outlook resets the path. Hold can be fair if you are a long-term owner and quality is intact.",
      whyMarketMoved:
        "Sellers cared more about next year's outlook than last quarter's beat.",
      evidence:
        "The snapshot is the past. The headline is the future. Which clock is your decision on?",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "intermediate",
  },
  {
    id: "case-comb-rumor-filing",
    title: "Restatement rumor, then a filing",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "Chat claims the company will restate results. Minutes later a filing says it is a narrow classification change, not fraud. Cash flow still looks healthy.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-clarify",
      cashFlow: { operatingCashFlow: 105_000, freeCashFlow: 88_000 },
      notes: "Practice: rumor vs a narrow filing clarification.",
    },
    newsHeadline:
      "Company clarifies an accounting classification and denies a fraud rumor.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 179.0, 181.0, 178.5, 180.5),
      bar("+2", 180.5, 181.8, 179.8, 181.2),
      bar("+3", 181.2, 182.0, 180.4, 181.5),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Separate rumor volume from what the filing actually says. Panic-selling a classification change is often a mistake if cash quality is intact.",
      whyMarketMoved:
        "Fear eased once the filing bounded the issue.",
      evidence:
        "Headline clarification plus healthy cash flow. Filed facts outrank chat.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "intermediate",
  },
  {
    id: "case-comb-margin-news",
    title: "Thinner margins plus sector cost news",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "The snapshot shows thinner margins. The same day, a headline says input costs are rising across the industry. The chart is choppy.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-margin",
      incomeStatement: { revenue: 388_000, netIncome: 62_000, netMarginPct: 16 },
      notes: "Practice: margin slip with an industry cost headline.",
    },
    newsHeadline: "Sector input costs spike. Peers warn on margins.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 178.0, 178.5, 175.5, 176.0),
      bar("+2", 176.0, 176.8, 174.0, 174.8),
      bar("+3", 174.8, 175.5, 173.5, 174.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "If costs are industry-wide, ask whether this company can raise prices, or whether you are hoping it can.",
      whyMarketMoved:
        "The stock discounted margin risk when company numbers and sector news agreed.",
      evidence:
        "Two matching signals: the snapshot and the cost headline.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "intermediate",
  },
  {
    id: "case-comb-cash-contract",
    title: "Weak cash now, big contract later",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "Cash from the business is weak right now, but the company just won a large multi-year contract that ramps next year. Near-term cash vs longer-term demand.",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-comb-cash",
      cashFlow: { operatingCashFlow: 8_000, freeCashFlow: -2_000 },
      notes: "Practice: cash is soft now; the contract may help later.",
    },
    newsHeadline: "Wins a multi-year contract. Ramp starts next year.",
    preOhlc: CYCLICAL_PRE,
    postOhlc: withAftermath(CYCLICAL_PRE, [
      bar("+1", 108.0, 109.5, 107.0, 108.8),
      bar("+2", 108.8, 110.0, 108.0, 109.2),
      bar("+3", 109.2, 110.2, 108.5, 109.6),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Near-term cash stress argues for caution. A multi-year contract argues for patience. Hold is the clean answer unless you are explicit about your time frame.",
      whyMarketMoved:
        "The stock chopped as traders argued timing of the ramp versus cash today.",
      evidence:
        "Snapshot cash versus the contract headline. State your time frame before picking a side.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "intermediate",
  },
  {
    id: "case-comb-beg-beat-headline",
    title: "Quarter looks fine, headline is a probe",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "This SAMPLE tech name beat the quarter. The same morning a regulator probe hits the headline. Cash still looks healthy. Which fact rules your next few weeks?",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-beg-probe",
      notes: "Practice: quarter beat. Probe is a headline, not a verdict.",
    },
    newsHeadline: "Regulator opens a probe. Company says it will cooperate.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 178.8, 179.2, 176.2, 176.8),
      bar("+2", 176.8, 177.4, 175.6, 176.1),
      bar("+3", 176.1, 176.8, 175.2, 175.8),
    ]),
    correctActions: ["hold", "sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A beat does not cancel a probe. Hold if cash covers a long legal path. Sell if you cannot sit through the headline noise.",
      whyMarketMoved:
        "The stock discounted uncertainty, not a proven fine.",
      evidence:
        "Snapshot beat plus a probe headline. Time frame matters.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "beginner",
  },
  {
    id: "case-comb-beg-margin-recall",
    title: "Thinner margin plus a product recall",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "The snapshot shows a thinner margin. The headline is a product recall. This SAMPLE food name was range-bound. Two matching warnings or one story?",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-comb-beg-recall",
      label: "Packaged food",
      symbol: "GIS.S",
      incomeStatement: {
        revenue: 84_000,
        netIncome: 3_600,
        netMarginPct: 4.3,
      },
      notes: "Practice: margin already thin; recall is extra cost risk.",
    },
    newsHeadline: "Recalls a product line. Cost of the fix is not sized yet.",
    preOhlc: FOOD_PRE,
    postOhlc: withAftermath(FOOD_PRE, [
      bar("+1", 71.0, 71.3, 68.8, 69.2),
      bar("+2", 69.2, 69.6, 68.2, 68.6),
      bar("+3", 68.6, 69.0, 67.8, 68.2),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "When the snapshot and the headline both point at cost, hope is not a plan. Hold only if you sized for more downside.",
      whyMarketMoved:
        "The range broke as recall cost stacked on a thin margin.",
      evidence:
        "Thinner SAMPLE margin plus a recall headline.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "beginner",
  },
  {
    id: "case-comb-beg-guide-bank",
    title: "Bank beats, cuts the loan-growth outlook",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "This SAMPLE bank beat the quarter. The headline is a cut to loan-growth outlook. The stock was already sliding. Past quarter vs next year's book.",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-comb-beg-bank-guide",
      label: "Regional bank",
      symbol: "JPM.S",
      incomeStatement: {
        revenue: 47_000,
        netIncome: 11_800,
        netMarginPct: 25.1,
      },
      notes: "Practice: quarter beat, loan-growth outlook cut.",
    },
    newsHeadline: "Beats the quarter. Cuts next-year loan-growth outlook.",
    preOhlc: BANK_PRE,
    postOhlc: withAftermath(BANK_PRE, [
      bar("+1", 40.2, 40.5, 39.0, 39.4),
      bar("+2", 39.4, 39.7, 38.6, 38.9),
      bar("+3", 38.9, 39.2, 38.3, 38.6),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "The snapshot is the past. The outlook cut is the path. Sell if you owned it for growth. Hold if you are a long-term owner and capital is intact.",
      whyMarketMoved:
        "Sellers cared more about the outlook than the beat.",
      evidence:
        "Beat on SAMPLE numbers plus a guidance-style headline.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "beginner",
  },
  {
    id: "case-comb-beg-cash-airline",
    title: "Airline profit, cash still thin, fuel headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "This SAMPLE airline printed a small profit. Free cash is still thin. The headline is a fuel-cost spike. Two clocks: last quarter vs the next few months of jet fuel.",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-comb-beg-air-cash",
      label: "Airline",
      symbol: "DAL.S",
      incomeStatement: {
        revenue: 52_000,
        netIncome: 900,
        netMarginPct: 1.7,
      },
      cashFlow: {
        operatingCashFlow: 1_100,
        freeCashFlow: -800,
      },
      notes: "Practice: thin profit, thin cash, fuel headline the same day.",
    },
    newsHeadline: "Jet-fuel costs jump. Airlines warn on the next quarter.",
    preOhlc: AIRLINE_PRE,
    postOhlc: withAftermath(AIRLINE_PRE, [
      bar("+1", 32.6, 32.9, 31.2, 31.5),
      bar("+2", 31.5, 31.8, 30.4, 30.8),
      bar("+3", 30.8, 31.2, 30.0, 30.3),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A green quarter does not refill cash. A fuel spike hits the next quarter. Hold only if you can name how the airline survives both.",
      whyMarketMoved:
        "The slide continued as fuel stacked on thin cash.",
      evidence:
        "SAMPLE cash still weak plus a fuel-cost headline.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "beginner",
  },
  {
    id: "case-comb-beg-rumor-buyout",
    title: "Buyout rumor, then a quiet filing",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "Chat says this SAMPLE telco will be bought. Minutes later a filing only confirms talks, not a deal. Cash looks ordinary. Chase the rumor, or wait for a real offer?",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-comb-beg-telco-rumor",
      label: "Telco",
      symbol: "T.S",
      notes: "Practice: rumor vs a filing that only confirms talks.",
    },
    newsHeadline: "Filing confirms talks. No agreed price. Denies a signed deal.",
    preOhlc: TELCO_PRE,
    postOhlc: withAftermath(TELCO_PRE, [
      bar("+1", 28.4, 29.8, 27.9, 28.1),
      bar("+2", 28.1, 28.4, 26.8, 27.1),
      bar("+3", 27.1, 27.4, 26.5, 26.8),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Talks are not a price. Fade or wait when the filing is smaller than the chat. Hold if you already own a sized line.",
      whyMarketMoved:
        "The spike faded once the filing bounded the rumor.",
      evidence:
        "Rumor volume vs a talks-only filing. Ordinary cash on the snapshot.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "beginner",
  },
  {
    id: "case-comb-beg-rumor-restatement",
    title: "Restatement scare, classification filing",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "Chat claims this SAMPLE software name will restate revenue. A filing says it is a classification change, not fraud. Cash from operations still looks healthy.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-beg-class",
      label: "Software vendor",
      symbol: "CRM.S",
      cashFlow: { operatingCashFlow: 14_000, freeCashFlow: 9_500 },
      notes: "Practice: restatement rumor vs a narrow classification filing.",
    },
    newsHeadline:
      "Company files a classification change and denies a fraud restatement.",
    preOhlc: SMALL_PRE,
    postOhlc: withAftermath(SMALL_PRE, [
      bar("+1", 19.4, 20.6, 19.1, 20.2),
      bar("+2", 20.2, 20.8, 19.8, 20.4),
      bar("+3", 20.4, 20.9, 20.0, 20.5),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Filed facts outrank chat. Panic-selling a classification change is often a mistake if cash quality is intact.",
      whyMarketMoved:
        "Fear eased once the filing bounded the issue.",
      evidence:
        "Healthy SAMPLE cash plus a clarification filing.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "beginner",
  },
  {
    id: "case-comb-beg-rumor-dividend",
    title: "Dividend-cut rumor, then a keep-the-payout filing",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "Chat says this SAMPLE utility will cut the dividend. A filing the same day keeps the payout and delays a project instead. Cash is steady. Rumor vs filed fact.",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-comb-beg-util-div",
      label: "Regulated utility",
      symbol: "NEE.S",
      cashFlow: { operatingCashFlow: 6_400, freeCashFlow: 1_200 },
      notes: "Practice: dividend-cut rumor vs a keep-the-payout filing.",
    },
    newsHeadline: "Keeps the dividend. Delays a project to protect cash.",
    preOhlc: UTILITY_PRE,
    postOhlc: withAftermath(UTILITY_PRE, [
      bar("+1", 57.6, 57.9, 56.4, 56.8),
      bar("+2", 56.8, 58.2, 56.6, 57.9),
      bar("+3", 57.9, 58.6, 57.6, 58.3),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "If the rumor and the filing disagree, size for the filed fact. Income owners often panic first. Hold or buy only after you read the actual payout line.",
      whyMarketMoved:
        "The dip filled when the filing kept the dividend.",
      evidence:
        "Rumor vs keep-the-payout filing. Steady SAMPLE cash.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "beginner",
  },
  {
    id: "case-comb-beg-rumor-pharma",
    title: "Approval rumor, then a delay filing",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "Chat says this SAMPLE pharma name will get an early approval. A filing says the review is delayed. Cash is adequate. Do you trust the chat or the delay?",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-beg-pharma-delay",
      label: "Pharma",
      symbol: "PFE.S",
      notes: "Practice: approval rumor vs a delay filing.",
    },
    newsHeadline: "Review delayed. Company withdraws the early-approval rumor.",
    preOhlc: PHARMA_PRE,
    postOhlc: withAftermath(PHARMA_PRE, [
      bar("+1", 84.2, 84.8, 82.0, 82.6),
      bar("+2", 82.6, 83.1, 81.4, 81.9),
      bar("+3", 81.9, 82.4, 80.8, 81.3),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "When chat and the filing disagree, the filing wins. Selling or holding a sized line is process. Buying the rumor after a delay is not.",
      whyMarketMoved:
        "The dump-week tape kept sliding once the delay was filed.",
      evidence:
        "Approval chatter vs a delay filing. Snapshot cash is not the catalyst.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "beginner",
  },
];

/** Extra tagged cases to reach E5.M5 library floor (≥20). */
export const SCALE_CASES: CaseStudy[] = [
  {
    id: "case-scale-buyback",
    title: "Large buyback after a weak stretch",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "The board authorizes a large buyback after a soft stretch in the stock. Decide before you see the reaction.",
    newsHeadline: "Authorizes a large buyback and starts buying immediately.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 181.0, 183.0, 180.5, 182.4),
      bar("+2", 182.4, 183.5, 181.8, 183.0),
      bar("+3", 183.0, 184.0, 182.2, 183.5),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Buybacks can support the stock. They do not fix a broken business. Ask whether returning cash was the missing piece.",
      whyMarketMoved: "The stock bid as the company itself became a buyer.",
      evidence: "Company news. Capital return vs the operating outlook.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-scale-dividend-cut",
    title: "Dividend cut to preserve cash",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "This industrial company cuts its dividend 40% to preserve cash. The stock was already weak.",
    newsHeadline: "Cuts the dividend 40%, citing balance-sheet flexibility.",
    preOhlc: CYCLICAL_PRE,
    postOhlc: withAftermath(CYCLICAL_PRE, [
      bar("+1", 104.0, 104.8, 101.5, 102.2),
      bar("+2", 102.2, 103.0, 100.8, 101.4),
      bar("+3", 101.4, 102.0, 100.2, 100.9),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A dividend cut often means cash is tighter or priorities changed. Income buyers often sell. Long-term owners reassess whether the payout was the reason they owned it.",
      whyMarketMoved: "Income-oriented selling after the cut.",
      evidence: "Company headline. Who owned this for the yield?",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-scale-beat-hold",
    title: "Quiet earnings beat",
    contextType: "financials",
    thinkingMode: "beat_miss",
    brief:
      "Earnings modestly beat, guidance is in line, and the stock already looks expensive. Decide.",
    statementSnapshot: megaSnap,
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 180.5, 181.2, 179.5, 180.2),
      bar("+2", 180.2, 180.8, 179.2, 179.8),
      bar("+3", 179.8, 180.5, 179.0, 180.0),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["buy", "sell"],
    debrief: {
      process:
        "A small beat into a rich stock often means hold: not enough new information to chase or dump.",
      whyMarketMoved: "The event was mostly priced in. The surprise was small.",
      evidence: "In-line guide plus a modest beat.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-scale-risk-on",
    title: "Jobs cool without collapsing",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "A jobs report cools without collapsing. Talk of a soft landing picks up. This stock had been consolidating.",
    newsHeadline: "Labor market cools without collapsing. Soft-landing odds rise.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 181.5, 183.2, 181.0, 182.8),
      bar("+2", 182.8, 184.0, 182.2, 183.5),
      bar("+3", 183.5, 184.5, 182.8, 184.0),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Easier macro news can lift riskier stocks. Still ask whether you are early or late to that story.",
      whyMarketMoved: "Risk assets bid as rate-cut hopes returned.",
      evidence: "Economic data tone, not a company filing.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "intermediate",
  },
  {
    id: "case-scale-combined-lawsuit",
    title: "Lawsuit headline, large cash pile",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "A consumer lawsuit hits the headlines. The snapshot still shows a large cash pile. Can you live with the uncertainty?",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-scale-lawsuit",
      balanceSheet: { assets: 400_000, liabilities: 200_000, equity: 200_000 },
      notes: "Practice: legal headline vs cash cushion.",
    },
    newsHeadline: "Faces a consumer lawsuit. Damages are uncertain.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 178.0, 178.8, 176.0, 176.8),
      bar("+2", 176.8, 177.5, 175.5, 176.2),
      bar("+3", 176.2, 177.0, 175.8, 176.5),
    ]),
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    partialOnHorizonMismatch: true,
    debrief: {
      process:
        "Legal headlines widen the range of outcomes. Hold if cash covers plausible damages. Sell if you cannot sit through that range.",
      whyMarketMoved: "The stock discounted uncertainty, not proven damages.",
      evidence: "Headline plus a strong cash and equity cushion.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "intermediate",
  },
];

/** @deprecated alias — demo loop now uses first earnings case */
export const DEMO_CASE: CaseStudy = EARNINGS_CASES[0]!;

export const CASE_STUDIES: CaseStudy[] = [
  ...EARNINGS_CASES,
  ...COMPANY_NEWS_CASES,
  ...MACRO_NEWS_CASES,
  ...COMBINED_CASES,
  ...SCALE_CASES,
  ...FUTURES_CASES,
  ...FOREX_CASES,
  ...CRYPTO_CASES,
  ...OPTIONS_CONTEXT_CASES,
];

/** Documented library size for E5.M5 (≥20 target). */
export const CASE_LIBRARY_COUNT = CASE_STUDIES.length;

export const CASE_PACKS: {
  id: CasePackId;
  name: string;
  description: string;
  milestoneId: string;
}[] = [
  {
    id: "earnings",
    name: "Earnings",
    description:
      "Practice after an earnings report: beats, misses, margins, cash, and outlook.",
    milestoneId: "E5.M3",
  },
  {
    id: "company-news",
    name: "Company news",
    description:
      "Practice on headlines: product news, contracts, leadership, and when short is a real choice versus sell.",
    milestoneId: "E5.M2",
  },
  {
    id: "macro-news",
    name: "Market-wide news",
    description:
      "Inflation, fear, and supply shocks that move many stocks at once.",
    milestoneId: "E5.M2b",
  },
  {
    id: "combined",
    name: "News plus financials",
    description:
      "Use both the headline and the snapshot. Your time frame can change the answer.",
    milestoneId: "E5.M4",
  },
  {
    id: "futures",
    name: "Futures",
    description: "Index and commodity practice. Not live futures.",
    milestoneId: "E10.M5",
  },
  {
    id: "forex",
    name: "Forex",
    description: "Currency practice. Not a live FX desk.",
    milestoneId: "E10.M6",
  },
  {
    id: "crypto",
    name: "Crypto",
    description: "Bitcoin and ether practice charts.",
    milestoneId: "E10.M7",
  },
  {
    id: "options-context",
    name: "Options context",
    description:
      "How event risk and volatility affect the stock. No options chain here.",
    milestoneId: "E10.M7",
  },
];

export function getCaseStudy(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.id === id);
}

export function listCaseStudies(packId?: CaseStudy["packId"]): CaseStudy[] {
  if (!packId) return [...CASE_STUDIES];
  return CASE_STUDIES.filter((c) => c.packId === packId);
}

export function listCaseStudiesByAssetClass(
  assetClass: AssetClass,
): CaseStudy[] {
  return CASE_STUDIES.filter((c) => (c.assetClass ?? "equity") === assetClass);
}

export function gradeCaseAction(
  study: CaseStudy,
  action: CaseAction
): CaseGrade {
  if (study.correctActions.includes(action)) return "correct";
  if (study.acceptablePartial.includes(action)) return "partial";
  return "incorrect";
}

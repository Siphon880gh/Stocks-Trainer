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
  /** Soft-gate: short not offered unless true */
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
      "Practice on headlines: product news, contracts, leadership, buybacks.",
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

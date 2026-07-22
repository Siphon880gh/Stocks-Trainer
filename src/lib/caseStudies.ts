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
    title: "SAMPLE Earnings Miss · Mega-Cap Tech",
    contextType: "financials",
    thinkingMode: "beat_miss",
    brief:
      "Pre-event chart is firm into the print. SAMPLE snapshot looked clean heading in. Print: revenue in-line, EPS soft vs quiet expectations. Decide before the aftermath tape.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-earn-miss",
      incomeStatement: {
        ...megaSnap.incomeStatement,
        netIncome: 78_000,
        netMarginPct: 20.5,
      },
      notes: "SAMPLE print: EPS soft vs prior run-rate — STYLIZED teaching numbers.",
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
        "Separate the prior uptrend from new evidence. A miss can invalidate a momentum long even if the company remains profitable.",
      whyMarketMoved:
        "SAMPLE tape sells the multiple: buyers who priced perfection step aside when the print disappoints.",
      evidence:
        "EPS soft vs expectations while the chart had already priced a clean beat. Grade the thesis update, not only the candle color.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-margin-compression",
    title: "SAMPLE Margin Compression · Mega-Cap Tech",
    contextType: "financials",
    thinkingMode: "margin_compression",
    brief:
      "Revenue still growing on the SAMPLE card, but net margin fell hard as costs caught up. Pre-tape is choppy near highs. How do you respond before seeing the reaction?",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-margin-comp",
      incomeStatement: {
        revenue: 390_000,
        netIncome: 58_000,
        netMarginPct: 14.9,
      },
      notes: "SAMPLE: revenue up, margin down — classic compression drill.",
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
        "Ask whether growth still earns its multiple when each sales dollar keeps less profit. Margin is a quality check on the revenue story.",
      whyMarketMoved:
        "SAMPLE reaction discounts richer multiples when profitability per dollar of sales deteriorates.",
      evidence:
        "Snapshot shows revenue resilience with a clear margin step-down—process: re-rate quality, not celebrate top-line alone.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-cash-flow-flag",
    title: "SAMPLE Cash-Flow Red Flag · Cyclical",
    contextType: "financials",
    thinkingMode: "cash_flow_red_flag",
    brief:
      "Net income still positive on the SAMPLE snapshot, but operating and free cash flow collapsed. Pre-chart already soft. Decide before aftermath.",
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
      notes: "SAMPLE: profits without cash — working-capital / quality drill.",
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
        "Treat cash as the reality check on accrual profit. Positive net income with broken FCF deserves skepticism, not automatic buy-the-dip.",
      whyMarketMoved:
        "SAMPLE sellers focus on funding risk: if cash is not arriving, the earnings print is less comforting.",
      evidence:
        "OCF/FCF divergence vs still-green net income is the tell. Process: reconcile income statement to cash flow before acting.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-guidance-cut",
    title: "SAMPLE Guidance Cut · Mega-Cap Tech",
    contextType: "financials",
    thinkingMode: "guidance_cut",
    brief:
      "Trailing print was acceptable, but management cut next-year guidance. Pre-tape had bid into the call. Decide with the snapshot + brief only.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-guidance",
      incomeStatement: {
        revenue: 385_000,
        netIncome: 90_000,
        netMarginPct: 23.4,
      },
      notes: "SAMPLE: trailing OK, forward guide cut — horizon mismatch drill.",
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
        "Markets price the future. Trailing beat/meet can still fail if the guide resets the path. Match action to your horizon.",
      whyMarketMoved:
        "SAMPLE reaction sells the new trajectory: lower guide compresses expected growth in the multiple.",
      evidence:
        "Brief flag is the guide cut, not a collapse in trailing profit. Process: update forward thesis first.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-earn-balance-stress",
    title: "SAMPLE Balance-Sheet Stress · Cyclical",
    contextType: "financials",
    thinkingMode: "balance_sheet_stress",
    brief:
      "Liabilities jumped vs equity on the SAMPLE card while earnings stayed thin. Pre-chart is weak. How do you size the risk before reveal?",
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
      notes: "SAMPLE: leverage up, cushion down — solvency/flexibility drill.",
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
        "Thin equity cushions leave less room for error when cycles turn. Pair income quality with balance-sheet flexibility.",
      whyMarketMoved:
        "SAMPLE tape prices higher distress risk: more liabilities vs equity raise the cost of being wrong.",
      evidence:
        "Snapshot leverage shift + soft earnings is the stress signal. Process: ask what breaks if cash gets tighter.",
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
    title: "SAMPLE Momentum Chase vs Fade · Mega-Cap Tech",
    contextType: "news",
    thinkingMode: "momentum_chase_vs_fade",
    brief:
      "Equity already ran hard into a product-launch headline. Crowd chat screams chase. Pre-tape is extended. Decide before the aftermath — is this chase or fade?",
    newsHeadline: "SAMPLE: Mega-cap unveils incremental product refresh; influencers call for moonshot.",
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
        "Ask what is already priced. A loud headline after a run often invites fade/hold over blind chase—unless you have a fresh edge.",
      whyMarketMoved:
        "SAMPLE tape fades the crowded chase: late buyers meet sellers who used the headline as exit liquidity.",
      evidence:
        "Extended pre-tape + incremental (not transformative) headline. Process: separate narrative volume from new information.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-supplier-win",
    title: "SAMPLE Company Headline · Supplier Win",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Cyclical equity dips into a SAMPLE headline: multi-year supply contract with a large OEM. Chart was soft. Decide before reveal — does the contract change the path?",
    newsHeadline: "SAMPLE: Energy/materials name wins multi-year OEM supply contract (stylized).",
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
        "Weigh whether the contract is material vs noise and whether the soft tape already discounted fear. New durable demand can justify buy/hold over panic selling.",
      whyMarketMoved:
        "SAMPLE reaction re-rates the path: visible multi-year volume reduces near-term demand uncertainty.",
      evidence:
        "Company-specific headline (not macro). Process: map contract size/duration to thesis before chasing or dumping.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-news-ceo-exit",
    title: "SAMPLE Company Headline · CEO Exit",
    contextType: "news",
    thinkingMode: "company_headline",
    brief:
      "Mega-cap equity is near highs when a SAMPLE headline hits: sudden CEO resignation, interim leadership named. No fraud alleged. Decide before aftermath.",
    newsHeadline: "SAMPLE: CEO resigns unexpectedly; board names interim CEO (stylized).",
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
        "Leadership gaps raise execution uncertainty even without fraud. Size risk to your horizon: hold if thesis is multi-year and board is credible; trim if you needed certainty near-term.",
      whyMarketMoved:
        "SAMPLE tape prices uncertainty: key-person risk widens the range of outcomes until a permanent plan is clear.",
      evidence:
        "Company headline, equity-only decision. Process: uncertainty ≠ automatic short; it does argue against aggressive chase.",
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
    title: "SAMPLE Risk-Off Tape · Mega-Cap Tech",
    contextType: "news",
    thinkingMode: "risk_off",
    brief:
      "Broad SAMPLE risk-off: credit spreads widen, defensives bid, high-beta tech softens into the open. Your mega-cap was extended. Decide before aftermath.",
    newsHeadline: "SAMPLE: Global risk appetite fades; investors rotate toward cash and defensives.",
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
        "Risk-off is about portfolio beta and liquidity preference, not one ticker story. Trim or hold sized exposure; chasing high-beta into the scare is usually process-breaking.",
      whyMarketMoved:
        "SAMPLE tape sells duration/risk assets together as investors demand cash safety.",
      evidence:
        "Macro headline + extended pre-tape. Process: ask how much equity beta you wanted into a risk-off impulse.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "intermediate",
  },
  {
    id: "case-macro-print",
    title: "SAMPLE Macro Print · Index Proxy Equity",
    contextType: "news",
    thinkingMode: "macro_print",
    brief:
      "A SAMPLE CPI-style print lands hotter than quiet expectations. Rates chatter jumps. Your equity proxy had been grinding higher. Decide before reveal.",
    newsHeadline: "SAMPLE: Inflation print hotter than consensus; rate-cut odds fall (stylized).",
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
        "Hot prints reprice discount rates. Even “good companies” can sell when the risk-free path shifts—match action to horizon, not cheerleading.",
      whyMarketMoved:
        "SAMPLE reaction discounts higher-for-longer rates: multiples compress when the print surprises hotter.",
      evidence:
        "Macro print headline, not a company filing. Process: separate firm quality from rate sensitivity.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "intermediate",
  },
  {
    id: "case-macro-supply",
    title: "SAMPLE Geopolitics / Supply · Cyclical",
    contextType: "news",
    thinkingMode: "geopolitics_supply",
    brief:
      "SAMPLE supply-shock headline: shipping lane disruption; energy/materials complex jumps in overnight futures. Your cyclical was already soft. Decide before tape.",
    newsHeadline: "SAMPLE: Key shipping lane disruption raises energy/freight cost fears (intro level).",
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
        "Supply shocks can help producers and hurt consumers. Map which side of the chain your equity sits on before reflexively selling “uncertainty.”",
      whyMarketMoved:
        "SAMPLE tape bids the commodity-linked name as scarcity fears lift near-term pricing power.",
      evidence:
        "Geopolitics/supply headline + cyclical underlying. Process: transmission path > scary words.",
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
    title: "SAMPLE Combined · Beat + Weak Guidance Headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "Trailing SAMPLE print beats, but the headline blares a guidance cut. Snapshot still looks solid on trailing margins. Horizon mismatch drill: near-term vs multi-year.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-beat",
      notes: "SAMPLE trailing beat; forward guide soft — combined context.",
    },
    newsHeadline: "SAMPLE: Beats estimates but slashes next-year outlook (stylized).",
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
        "Trailing beat can still fail a short-horizon thesis if the guide resets the path. Hold may be partial credit if your horizon is multi-year and quality is intact.",
      whyMarketMoved:
        "SAMPLE sellers weight the guide over the beat—markets price the future.",
      evidence:
        "Snapshot (trailing) + headline (forward). Process: which time scale is your decision on?",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "intermediate",
  },
  {
    id: "case-comb-rumor-filing",
    title: "SAMPLE Combined · Restatement Rumor + Filing",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "Chat rumor claims a restatement. Minutes later a SAMPLE 8-K-style note clarifies a narrow classification change, not fraud. Snapshot cash still healthy. Decide.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-clarify",
      cashFlow: { operatingCashFlow: 105_000, freeCashFlow: 88_000 },
      notes: "SAMPLE: rumor noise vs narrow filing clarification.",
    },
    newsHeadline: "SAMPLE: Company clarifies accounting classification; denies fraud rumor.",
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
        "Separate rumor severity from filing facts. Panic-selling a clarified classification change is often a horizon/process error if cash quality is intact.",
      whyMarketMoved:
        "SAMPLE tape squeezes fear once the filing bounds the issue.",
      evidence:
        "Headline clarification + healthy SAMPLE cash flow. Process: evidence hierarchy over chat volume.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "intermediate",
  },
  {
    id: "case-comb-margin-news",
    title: "SAMPLE Combined · Margin Slip + Cost Headline",
    contextType: "combined",
    thinkingMode: "combined_earnings_headline",
    brief:
      "SAMPLE snapshot shows margin compression; same day a headline cites rising input costs industry-wide. Pre-tape choppy. Decide before aftermath.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-comb-margin",
      incomeStatement: { revenue: 388_000, netIncome: 62_000, netMarginPct: 16 },
      notes: "SAMPLE margin slip with industry cost headline.",
    },
    newsHeadline: "SAMPLE: Sector input costs spike; peers warn on margins.",
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
        "Confirm the snapshot with the sector headline. If costs are industry-wide, ask whether your name has pricing power—or just hope.",
      whyMarketMoved:
        "SAMPLE tape discounts margin risk when company numbers and sector news agree.",
      evidence:
        "Dual signal: filing-like snapshot + cost headline. Process: congruence raises conviction.",
    },
    allowShort: false,
    packId: "combined",
    difficulty: "intermediate",
  },
  {
    id: "case-comb-cash-contract",
    title: "SAMPLE Combined · Soft Cash + Contract Win",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief:
      "Cyclical SAMPLE snapshot shows weak FCF, but a headline announces a large multi-year contract. Near-term cash vs long-horizon demand—horizon partial-credit case.",
    statementSnapshot: {
      ...cyclicalSnap,
      id: "snap-comb-cash",
      cashFlow: { operatingCashFlow: 8_000, freeCashFlow: -2_000 },
      notes: "SAMPLE: cash soft now; contract may help later.",
    },
    newsHeadline: "SAMPLE: Wins multi-year OEM contract; ramp starts next year.",
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
        "Near-term cash stress argues caution; multi-year contract argues patience. Hold is the clean process answer; buy/sell can be partial if your horizon is explicit.",
      whyMarketMoved:
        "SAMPLE tape chops as traders argue timing of the ramp vs cash reality.",
      evidence:
        "Snapshot cash vs headline contract. Process: state your horizon before picking a side.",
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
    title: "SAMPLE Company Headline · Buyback",
    contextType: "news",
    thinkingMode: "company_headline",
    brief: "SAMPLE: board authorizes large buyback after a soft tape. Decide before reveal.",
    newsHeadline: "SAMPLE: Authorizes multi-billion buyback; starts immediately (stylized).",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 181.0, 183.0, 180.5, 182.4),
      bar("+2", 182.4, 183.5, 181.8, 183.0),
      bar("+3", 183.0, 184.0, 182.2, 183.5),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "Buybacks can support price but do not fix a broken thesis. Size to whether capital return was the missing piece.",
      whyMarketMoved: "SAMPLE tape bids the mechanical bid from buybacks.",
      evidence: "Company headline, equity-only. Process: capital return vs operating outlook.",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-scale-dividend-cut",
    title: "SAMPLE Company Headline · Dividend Cut",
    contextType: "news",
    thinkingMode: "company_headline",
    brief: "SAMPLE: cyclical cuts dividend citing cash preservation. Pre-tape already weak.",
    newsHeadline: "SAMPLE: Cuts dividend 40%; cites balance-sheet flexibility.",
    preOhlc: CYCLICAL_PRE,
    postOhlc: withAftermath(CYCLICAL_PRE, [
      bar("+1", 104.0, 104.8, 101.5, 102.2),
      bar("+2", 102.2, 103.0, 100.8, 101.4),
      bar("+3", 101.4, 102.0, 100.2, 100.9),
    ]),
    correctActions: ["sell", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "Dividend cuts signal capital stress or priority shift. Income buyers often sell; long-horizon owners reassess coverage.",
      whyMarketMoved: "SAMPLE income-oriented selling pressure after the cut.",
      evidence: "Company headline on equity. Process: who owned it for the yield?",
    },
    allowShort: false,
    packId: "company-news",
    difficulty: "beginner",
  },
  {
    id: "case-scale-beat-hold",
    title: "SAMPLE Earnings Quiet Beat",
    contextType: "financials",
    thinkingMode: "beat_miss",
    brief: "SAMPLE print modestly beats with in-line guide. Pre-tape already rich. Decide.",
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
      process: "Quiet beats into rich tape often mean hold: not enough new info to chase or dump.",
      whyMarketMoved: "SAMPLE tape meanders—event priced, surprise small.",
      evidence: "In-line guide + modest beat. Process: size of surprise vs positioning.",
    },
    allowShort: false,
    packId: "earnings",
    difficulty: "beginner",
  },
  {
    id: "case-scale-risk-on",
    title: "SAMPLE Macro · Soft Landing Chatter",
    contextType: "news",
    thinkingMode: "macro_print",
    brief: "SAMPLE: softer labor print; soft-landing chatter rises. Equity was consolidating.",
    newsHeadline: "SAMPLE: Labor cooling without collapse; soft-landing odds rise.",
    preOhlc: TECH_PRE,
    postOhlc: withAftermath(TECH_PRE, [
      bar("+1", 181.5, 183.2, 181.0, 182.8),
      bar("+2", 182.8, 184.0, 182.2, 183.5),
      bar("+3", 183.5, 184.5, 182.8, 184.0),
    ]),
    correctActions: ["buy", "hold"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "Macro relief can lift beta. Still ask whether you are early or late vs the narrative.",
      whyMarketMoved: "SAMPLE risk assets bid as rate-cut hopes return.",
      evidence: "Macro print tone, not company filing.",
    },
    allowShort: false,
    packId: "macro-news",
    difficulty: "intermediate",
  },
  {
    id: "case-scale-combined-lawsuit",
    title: "SAMPLE Combined · Lawsuit Headline + Cash Cushion",
    contextType: "combined",
    thinkingMode: "combined_rumor_filing",
    brief: "SAMPLE lawsuit headline hits; snapshot still shows large cash. Horizon/process drill.",
    statementSnapshot: {
      ...megaSnap,
      id: "snap-scale-lawsuit",
      balanceSheet: { assets: 400_000, liabilities: 200_000, equity: 200_000 },
      notes: "SAMPLE: legal headline vs cash cushion.",
    },
    newsHeadline: "SAMPLE: Faces consumer lawsuit; damages uncertain.",
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
      process: "Legal headlines create uncertainty bands. Hold if cash covers plausible outcomes; sell if your horizon cannot tolerate the range.",
      whyMarketMoved: "SAMPLE tape discounts uncertainty, not proven damages.",
      evidence: "Headline + balance-sheet cushion. Process: range of outcomes vs time.",
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
    name: "Pack B · Earnings / Financials",
    description: "Beat/miss, margins, cash flow, guidance, balance-sheet stress (SAMPLE)",
    milestoneId: "E5.M3",
  },
  {
    id: "company-news",
    name: "Pack A · Company News",
    description: "Momentum chase vs fade + simple company headlines on equities (SAMPLE)",
    milestoneId: "E5.M2",
  },
  {
    id: "macro-news",
    name: "Pack A+ · Macro Intro",
    description: "Risk-off, macro print, geopolitics/supply (SAMPLE, post-P0)",
    milestoneId: "E5.M2b",
  },
  {
    id: "combined",
    name: "Pack C · Combined",
    description: "News + statement snapshots together; horizon partial credit (SAMPLE)",
    milestoneId: "E5.M4",
  },
  {
    id: "futures",
    name: "Pack F · Futures (SAMPLE)",
    description: "Index/commodity-style decide-and-reveal — SAMPLE tape only",
    milestoneId: "E10.M5",
  },
  {
    id: "forex",
    name: "Pack FX · Forex (SAMPLE)",
    description: "Spot FX SAMPLE decisions — not a LIVE FX desk",
    milestoneId: "E10.M6",
  },
  {
    id: "crypto",
    name: "Pack C+ · Crypto (SAMPLE)",
    description: "Chase/fade, dump/reclaim, chop-break on SAMPLE crypto",
    milestoneId: "E10.M7",
  },
  {
    id: "options-context",
    name: "Pack O · Options context (SAMPLE)",
    description: "Underlying into event / after vol spike — no chain or Greeks",
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

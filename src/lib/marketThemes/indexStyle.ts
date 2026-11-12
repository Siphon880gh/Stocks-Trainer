/**
 * MK8 · Index and style building blocks (/practice/index-style): size (large, mid, small, total market), region
 * (U.S., developed, emerging), style (growth, value, dividend) and the index-weights idea (market-cap vs equal vs
 * price weighting, top-heavy indexes). Sources: SEC Investor.gov, FINRA, State Street (SPY), iShares (IWM, IJH),
 * Vanguard (VTI, VEA, VWO, VTV, VUG), Nasdaq, S&P DJI. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { mc, pct, r2, seededTape } from "./helpers";

/** Market-cap weight in %: company cap ÷ total cap. */
export const capWeightPct = (cap: number, totalCap: number) => r2((cap / totalCap) * 100);
/** Equal weight in %: 100 ÷ number of holdings. */
export const equalWeightPct = (holdings: number) => r2(100 / holdings);
/** Blended share of one region: share in fund A × region weight in A + share in fund B × region weight in B (all %). */
export const blendedSharePct = (shareA: number, regionInA: number, shareB: number, regionInB: number) =>
  r2((shareA * regionInA + shareB * regionInB) / 100);

/** State Street SPY holdings file, as of Nov 11, 2026 (504 lines; some companies have two share classes). */
export const SPY_AS_OF = "2026-11-11";
export const SPY_FACTS = { lines: 504, top10: 36.9, AAPL: 7.9, NVDA: 6.4, MSFT: 5.9 } as const;
/** Fund pages (iShares Nov 10–11, 2026; Vanguard data as of Oct 31, 2026). */
export const FUND_FACTS = {
  IWM: { index: "Russell 2000", holdings: 1970, er: 0.19 },
  IJH: { index: "S&P MidCap 400", holdings: 409, er: 0.05 },
  VTI: { index: "Morningstar US Total Market", holdings: 3519, er: 0.03 },
  VEA: { index: "FTSE Developed All Cap ex US", holdings: 3903, er: 0.03 },
  VWO: { index: "FTSE Emerging Markets All Cap China A Inclusion", holdings: 6507, er: 0.06 },
  VTV: { index: "Morningstar US Large Cap Value", holdings: 298, er: 0.03 },
  VUG: { index: "Morningstar US Large Cap Growth", holdings: 135, er: 0.03 },
} as const;
export const EQUAL_500 = equalWeightPct(500);
/** Illustrative numbers only (not market data). */
export const IX_EX = { bigCap: 4, smallCap: 0.02, totalCap: 50, usFund: 80, intlFund: 20 } as const;
export const IX_BIG = capWeightPct(IX_EX.bigCap, IX_EX.totalCap);
export const IX_SMALL = capWeightPct(IX_EX.smallCap, IX_EX.totalCap);
export const IX_INTL = blendedSharePct(IX_EX.usFund, 0, IX_EX.intlFund, 100);

const TERMS: LiteracyTerm[] = [
  { id: "market-cap-weighting", name: "Market-cap weighting", category: "markets", summary: "Each company's weight is its market value (share price × shares outstanding) as a share of the index total.", detail: `SEC Investor.gov: bigger companies count for more. In State Street's SPY holdings (as of ${SPY_AS_OF}) the top 10 lines were about ${SPY_FACTS.top10}% of the fund, versus about ${EQUAL_500 * 10}% if 500 companies were weighted equally. Educational, not advice.` },
  { id: "equal-weight-index", name: "Equal-weight index", category: "markets", summary: "An index that gives every company the same weight, regardless of size.", detail: "FINRA files equal weighting under smart beta, a non-traditional index: it tilts toward smaller companies, trades more to rebalance and can cost more. No guarantee it beats the cap-weighted version. Educational, not advice." },
  { id: "price-weighted-index", name: "Price-weighted index", category: "markets", summary: "An index where a higher share price means a bigger weight, such as the Dow Jones Industrial Average.", detail: "SEC Investor.gov contrasts it with market-cap weighting. A stock split can change a company's weight without changing its value. Educational, not advice." },
  { id: "size-segment", name: "Size segments (large, mid, small)", category: "markets", summary: "Indexes split stocks by company size: large caps (S&P 500), mid caps (S&P MidCap 400), small caps (Russell 2000).", detail: "Small-cap funds hold many more, smaller companies and usually swing more. A total market fund holds all sizes, but by weight it is still mostly large caps. Educational, not advice." },
  { id: "developed-vs-emerging", name: "Developed vs emerging markets", category: "markets", summary: "Index providers group countries by market development; developed (Europe, Japan, Canada, Australia) and emerging (China, India, Brazil and others) are tracked separately.", detail: "International funds add currency exposure: a weaker dollar lifts foreign returns for a U.S. investor, a stronger dollar cuts them. See Currency funds and the dollar. Educational, not advice." },
  { id: "growth-vs-value-style", name: "Growth vs value style", category: "markets", summary: "Style indexes split companies by measures such as earnings growth (growth) or low prices relative to earnings and book value (value).", detail: "Each provider uses its own rules, so two growth funds can hold different companies. Style funds still overlap heavily with the broad index they come from. Educational, not advice." },
];

const T1 = seededTape({ seed: 10001, start: 512.6, preDrift: 0.002, postDrift: -0.004, vol: 0.013, gap: -0.028 });
const T2 = seededTape({ seed: 10002, start: 221.3, preDrift: -0.0015, postDrift: 0.001, vol: 0.017 });
const T3 = seededTape({ seed: 10003, start: 52.4, preDrift: 0.001, postDrift: 0.003, vol: 0.011, gap: 0.02 });

const CASES: CaseStudy[] = [
  {
    id: "case-ix-three-funds-one-bet",
    title: "Index and style: three funds, one bet",
    contextType: "news",
    thinkingMode: "index_style",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. You split your stocks across an S&P 500 fund, a large-cap growth fund and a Nasdaq-100 fund to \"diversify across styles\". In SPY alone, Apple, Nvidia and Microsoft were about ${r2(SPY_FACTS.AAPL + SPY_FACTS.NVDA + SPY_FACTS.MSFT)}% (State Street, ${SPY_AS_OF}), and the same names lead the other two funds. Megacap tech sells off and all three fall together. Buy = add to all three. Sell = consolidate into a written mix that actually differs (for example size or region), sized to your plan. Hold = keep all three as they are.`,
    newsHeadline: "Megacap tech slides; broad and growth indexes fall together.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "Three tickers are not three exposures. Cap-weighted large-cap, growth and Nasdaq-100 funds all lean on the same giants. FINRA's advice: look at the actual holdings to make sure weights match your diversification goal. Holding is partial credit if the tech tilt is deliberate and written down.",
      whyMarketMoved: "The same few companies dominate all three indexes, so one sell-off hits them together.",
      evidence: "SAMPLE: all three drifted lower over the next four sessions.",
    },
  },
  {
    id: "case-ix-small-caps-lag",
    title: "Index and style: small caps lag for a year",
    contextType: "news",
    thinkingMode: "index_style",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. Your written plan keeps a fixed slice in a small-cap fund (the Russell 2000 fund IWM held ${FUND_FACTS.IWM.holdings.toLocaleString("en-US")} stocks per iShares, Nov 10, 2026). Small caps have trailed large caps for a year and a headline says \"small caps are dead money\". Buy = double the slice to catch the rebound. Sell = dump small caps for the large-cap fund. Hold = keep the planned slice and rebalance on your schedule.`,
    newsHeadline: "Small caps trail large caps for a fourth straight quarter.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "Size segments take turns, and nobody publishes the turning date. A plan with a fixed slice plus scheduled rebalancing (SEC Investor.gov's beginners' guide) handles this without a forecast. Selling is partial credit only if small caps never belonged in the plan; doubling is a timing bet on a headline.",
      whyMarketMoved: "Small companies are more sensitive to borrowing costs and the economy, and can lag for long stretches.",
      evidence: "SAMPLE: the small-cap fund moved sideways over the next four sessions.",
    },
  },
  {
    id: "case-ix-intl-jumps-on-dollar",
    title: "Index and style: international jumps as the dollar slides",
    contextType: "news",
    thinkingMode: "index_style",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. Your plan keeps ${IX_EX.intlFund}% of stocks in a developed-markets fund (VEA tracks the ${FUND_FACTS.VEA.index} index per Vanguard). The dollar slides and the fund gaps up 2% after years of lagging U.S. stocks. A friend says \"international is back, go to 50%\". Buy = raise international to 50% today. Sell = take the gain and exit. Hold = keep the ${IX_EX.intlFund}% target and rebalance on schedule.`,
    newsHeadline: "Dollar weakens; overseas stock funds rally.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "Part of a foreign fund's return is currency: a weaker dollar lifts it for U.S. investors, a stronger one cuts it. A one-day move is not a reason to change a long-term mix. Trimming back to target at your scheduled rebalance is fine, so selling is partial credit; jumping to 50% chases the move.",
      whyMarketMoved: "A weaker dollar raised the dollar value of foreign shares on top of local gains.",
      evidence: "SAMPLE: the fund drifted higher over the next four sessions.",
    },
  },
];

export const INDEX_STYLE: MarketTheme = {
  id: "index-style",
  route: "/practice/index-style",
  practiceTitle: "Index and style: size, region, style and how index weights work",
  title: "Index and style building blocks",
  blurb:
    "The building blocks of index funds: size (large, mid, small, total market), region (U.S., developed, emerging), style (growth, value, dividend), and how weighting rules decide what you really own. Educational, not advice.",
  marketForces:
    "Market Forces' size, region and style themes list SPY, IJH, IWM, VTI, VEA, VWO, VUG, QQQ, VTV and SCHD. Holdings and index names here come from State Street, iShares and Vanguard pages read Nov 11–12, 2026.",
  asOf: "2026-11-12",
  quiz: {
    name: "Index & Style",
    description:
      "Market-cap, equal and price weighting; how top-heavy the S&P 500 is; size segments (S&P 500, MidCap 400, Russell 2000, total market); developed vs emerging funds and currency; growth vs value style indexes; overlap across style funds; tracking error and fees; smart beta as a non-traditional index",
    icon: "stacked_bar_chart",
  },
  intro: [
    "An index fund tracks a basket defined by rules: which companies get in, and how much each one counts. SEC Investor.gov explains that most market indexes weight companies by market capitalization (share price × shares outstanding), so bigger companies count for more; a few, like the Dow, weight by share price.",
    "Size, region and style funds are slices of the market built with those rules. Knowing the rules tells you what you really own: a total market fund is still mostly large caps, and growth and Nasdaq-100 funds share many top holdings with the S&P 500.",
  ],
  wrappers: [
    { name: "Large cap and total market", examples: `SPY (S&P 500, ${SPY_FACTS.lines} lines) · VTI (${FUND_FACTS.VTI.index}, ${FUND_FACTS.VTI.holdings.toLocaleString("en-US")} stocks)`, owns: "Large U.S. companies; VTI adds mid and small caps", tracks: "The U.S. market, weighted by size", watch: `SPY's top 10 lines were about ${SPY_FACTS.top10}% (${SPY_AS_OF})` },
    { name: "Mid and small cap", examples: `IJH (${FUND_FACTS.IJH.index}, ${FUND_FACTS.IJH.holdings}) · IWM (${FUND_FACTS.IWM.index}, ${FUND_FACTS.IWM.holdings.toLocaleString("en-US")})`, owns: "Smaller U.S. companies", tracks: "Domestic growth, credit and borrowing costs", watch: `More holdings and bigger swings; IWM's expense ratio was ${FUND_FACTS.IWM.er}% vs IJH ${FUND_FACTS.IJH.er}%` },
    { name: "Developed and emerging", examples: `VEA (${FUND_FACTS.VEA.holdings.toLocaleString("en-US")} stocks) · VWO (${FUND_FACTS.VWO.holdings.toLocaleString("en-US")} stocks)`, owns: "Companies outside the U.S.: developed markets, or emerging markets including China A-shares", tracks: "Foreign stock markets plus currency moves against the dollar", watch: "Currency, country concentration and different sector mixes" },
    { name: "Growth, value and dividend styles", examples: `VUG (${FUND_FACTS.VUG.holdings} stocks) · VTV (${FUND_FACTS.VTV.holdings}) · QQQ (Nasdaq-100) · SCHD (dividend)`, owns: "Large caps screened by growth, value or dividend rules", tracks: "Their style index; the Nasdaq-100 excludes financials and is cap-weighted", watch: "Overlap with the S&P 500; each provider's rules differ" },
  ],
  drivers: [
    { title: "Weighting rules", text: "Cap weighting lets winners grow their weight; equal weighting resets them at each rebalance; price weighting follows share prices. FINRA notes equal-weight and other smart beta indexes can cost more and may not beat the market." },
    { title: "Concentration", text: `With ${SPY_FACTS.lines} lines in SPY, an equal weight would be about ${EQUAL_500}% each; Apple alone was about ${SPY_FACTS.AAPL}% (${SPY_AS_OF}).` },
    { title: "Size and the economy", text: "Small companies lean on domestic sales and borrowing, so they tend to swing more with rates and growth." },
    { title: "Region and currency", text: "Foreign funds earn local returns plus or minus the currency move against the dollar." },
    { title: "Costs and tracking", text: "SEC Investor.gov: index funds can trail their index because of fees, trading costs and tracking error." },
  ],
  bridges: [
    { title: "Sectors", text: "Sector weights inside the S&P 500 explain why it can act like a tech fund; see Sectors and rotation." },
    { title: "The dollar", text: "International returns include currency; see Currency funds and the dollar." },
    { title: "Rates", text: "Small caps and long-duration growth stocks react to rates; see Bonds and rates." },
    { title: "Rebalancing", text: "The Playbook on rebalancing to a target mix is the vouched way to hold these slices together." },
  ],
  math: {
    title: "Cap weight, equal weight and blended region share",
    rows: [
      { label: "Market-cap weight", formula: "company cap ÷ total index cap", example: `$${IX_EX.bigCap}T ÷ $${IX_EX.totalCap}T = ${pct(IX_BIG, 1)}; $${IX_EX.smallCap}T ÷ $${IX_EX.totalCap}T = ${pct(IX_SMALL, 2)}` },
      { label: "Equal weight", formula: "100 ÷ number of holdings", example: `500 holdings → ${EQUAL_500}% each` },
      { label: "Blended region share", formula: "share A × region weight in A + share B × region weight in B", example: `${IX_EX.usFund}% U.S. fund (0% foreign) + ${IX_EX.intlFund}% international fund (100% foreign) = ${IX_INTL}% foreign` },
    ],
    note: "Market caps are illustrative; SPY figures are from State Street as of Nov 11, 2026.",
  },
  calculator: {
    title: "Try it: cap weight vs equal weight",
    inputs: [
      { id: "cap", label: "Company market cap ($T)", value: IX_EX.bigCap, step: 0.5 },
      { id: "total", label: "Total index market cap ($T)", value: IX_EX.totalCap, step: 1 },
      { id: "n", label: "Number of holdings", value: 500, step: 10 },
      { id: "intl", label: "Share in an international fund (%)", value: IX_EX.intlFund, step: 5 },
    ],
    compute: (v) => [
      { label: "Market-cap weight", value: (v.total ?? 0) > 0 ? pct(capWeightPct(v.cap ?? 0, v.total ?? 0), 2) : "—" },
      { label: "Equal weight", value: (v.n ?? 0) > 0 ? pct(equalWeightPct(v.n ?? 0), 2) : "—" },
      { label: "Foreign share of stocks", value: pct(blendedSharePct(100 - (v.intl ?? 0), 0, v.intl ?? 0, 100), 0) },
    ],
    note: "Compare the two weights: that gap is how much a cap-weighted index leans on its largest company.",
  },
  drills: [
    { id: "ix-d1", prompt: "In a market-cap-weighted index, a company's weight depends on…", options: ["Its share price only", "Share price × shares outstanding", "Its age", "Its dividend"], answer: 1, why: "SEC Investor.gov: market cap = price × shares outstanding." },
    { id: "ix-d2", prompt: "Which index is price-weighted?", options: ["S&P 500", "Dow Jones Industrial Average", "Russell 2000", "Nasdaq-100"], answer: 1, why: "Investor.gov names the Dow as price-weighted." },
    { id: "ix-d3", prompt: "Equal weight for 500 holdings is about…", options: ["0.2%", "2%", "5%", "20%"], answer: 0, why: "100 ÷ 500 = 0.2%." },
    { id: "ix-d4", prompt: "A total market fund is, by weight, mostly…", options: ["Small caps", "Large caps", "Bonds", "Foreign stocks"], answer: 1, why: "Cap weighting means large companies dominate even when thousands of small ones are held." },
    { id: "ix-d5", prompt: "The dollar weakens. A U.S. investor's international fund return…", options: ["Gets a boost from currency", "Is hurt by currency", "Is unaffected", "Turns into a bond return"], answer: 0, why: "Foreign shares are worth more dollars when the dollar falls." },
  ],
  caveats: [
    { title: "Numbers change", text: "Holdings counts, weights and expense ratios come from fund pages on the dates shown and change over time." },
    { title: "Rules differ", text: "Two funds with the same label (growth, small cap, emerging) can follow different indexes and hold different companies." },
    { title: "No Playbook here", text: "Size, value and region tilts have long, disputed debates behind them; the vouched practice is a written mix and rebalancing, already covered by the rebalancing Playbook." },
    { title: "Examples, not picks", text: "The funds named are examples from Market Forces and fund pages, not recommendations." },
  ],
  sources: [
    { label: "SEC Investor.gov: Investor Bulletin — Index funds", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-26", supports: "Market-cap vs price weighting (the Dow); tracking error; fees; index examples" },
    { label: "FINRA: A look at non-traditional indexes and funds that track them", url: "https://www.finra.org/investors/insights/non-traditional-index-funds", supports: "Cap weighting is traditional; equal weight is smart beta; no guarantee of outperformance; check holdings and cost" },
    { label: "State Street: SPDR S&P 500 ETF Trust (SPY) holdings", url: "https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy", supports: "Daily holdings (Nov 11, 2026): 504 lines; top 10 ≈ 36.9%; Apple 7.9%, Nvidia 6.4%, Microsoft 5.9%" },
    { label: "iShares: Russell 2000 ETF (IWM) and Core S&P Mid-Cap ETF (IJH)", url: "https://www.ishares.com/us/products/239710/ishares-russell-2000-etf", supports: "Benchmarks; 1,970 and 409 holdings (Nov 10–11, 2026); expense ratios 0.19% and 0.05%" },
    { label: "Vanguard: VTI, VEA, VWO, VTV and VUG profiles", url: "https://investor.vanguard.com/investment-products/etfs/profile/vti", supports: "Current benchmarks, stock counts and expense ratios (data as of Oct 31, 2026)" },
    { label: "Nasdaq: Nasdaq-100 Index", url: "https://www.nasdaq.com/solutions/global-indexes/nasdaq-100", supports: "100 large Nasdaq-listed companies; excludes financials; cap-weighted; quarterly review; an equal-weighted version exists" },
    { label: "S&P Dow Jones Indices: S&P 500", url: "https://www.spglobal.com/spdji/en/indices/equity/sp-500/", supports: "500 leading companies; about 80% of available U.S. market capitalization" },
  ],
  links: [
    { label: "Learn → Index & Style", to: "/training?group=index-style" },
    { label: "Coach → What your index fund really holds", to: "/coach/index-style-blocks" },
    { label: "Playbook → Rebalance back to your target mix", to: "/playbooks/rebalance-to-target" },
    { label: "Practice → Sectors and rotation", to: "/practice/sectors-rotation" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "index_style",
  modeLabel: "Index funds: read the rules and the weights",
  modeTip:
    "Before adding an index or style fund, read its index rules and top holdings, add up overlap with what you own, and decide its slice in a written mix you rebalance on schedule. Cases → Market-wide news.",
  questions: [
    mc("IX-01", "An index fund seeks to…", "B", "Track the returns of a market index", ["Beat the market by picking stocks", "Guarantee a return", "Hold only bonds"], "SEC Investor.gov: you cannot invest in an index directly; a fund tracks it.", "market-cap-weighting"),
    mc("IX-02", "Market capitalization equals…", "A", "Share price × shares outstanding", ["Share price ÷ earnings", "Dividends × years", "Revenue − costs"], "Investor.gov's definition; it sets weights in most market indexes.", "market-cap-weighting"),
    mc("IX-03", "The Dow Jones Industrial Average is weighted by…", "C", "Share price", ["Market capitalization", "Equal weight", "Dividends"], "Investor.gov names it as a price-weighted index.", "price-weighted-index"),
    mc("IX-04", `As of ${SPY_AS_OF}, SPY's top 10 lines were about what share of the fund?`, "D", `${SPY_FACTS.top10}%`, ["2%", "10%", "75%"], "Cap weighting makes the S&P 500 top-heavy (State Street holdings file).", "market-cap-weighting"),
    mc("IX-05", "With 500 holdings, an equal-weight index gives each about…", "B", `${EQUAL_500}%`, ["2%", "5%", "0.02%"], "100 ÷ 500; the largest companies get far less than in a cap-weighted index.", "equal-weight-index"),
    mc("IX-06", "FINRA classifies equal-weight index funds as…", "A", "Smart beta, a type of non-traditional index fund", ["Bond funds", "Actively managed funds", "Money market funds"], "They weight by rules other than market cap; outperformance is not guaranteed.", "equal-weight-index"),
    mc("IX-07", "Which fund tracks small caps?", "C", "IWM (Russell 2000)", ["SPY (S&P 500)", "IJH (S&P MidCap 400)", "VEA (developed ex-U.S.)"], `iShares lists ${FUND_FACTS.IWM.holdings.toLocaleString("en-US")} holdings for IWM (Nov 10, 2026).`, "size-segment"),
    mc("IX-08", "A total U.S. market fund with thousands of stocks is, by weight…", "D", "Still mostly large companies", ["Mostly small companies", "Equal-weighted", "Mostly foreign"], "Cap weighting lets large companies dominate.", "size-segment"),
    mc("IX-09", "VWO differs from VEA because it holds…", "B", "Emerging-market stocks, including China A-shares", ["U.S. small caps", "Treasury bonds", "Only Japanese stocks"], "Vanguard: VWO tracks a FTSE emerging markets index; VEA a FTSE developed ex-U.S. index.", "developed-vs-emerging"),
    mc("IX-10", "The dollar strengthens. For a U.S. investor, foreign fund returns…", "A", "Are reduced by the currency move", ["Are boosted", "Are unaffected", "Double"], "Foreign shares convert into fewer dollars.", "developed-vs-emerging"),
    mc("IX-11", "Growth and value style funds…", "C", "Split large caps by each provider's rules, so two growth funds can differ", ["Hold the same companies everywhere", "Never overlap with the S&P 500", "Only hold bonds"], "Read the index rules and holdings, not just the label.", "growth-vs-value-style"),
    mc("IX-12", "The Nasdaq-100…", "D", "Holds 100 large Nasdaq-listed companies, excludes financials and is cap-weighted", ["Holds every Nasdaq stock equally", "Is price-weighted", "Holds only banks"], "Nasdaq's index page describes these rules; an equal-weighted version also exists.", "growth-vs-value-style"),
    mc("IX-13", "You own an S&P 500 fund, a large-cap growth fund and a Nasdaq-100 fund. The main risk is…", "B", "Heavy overlap in the same megacap companies", ["Too much bond exposure", "Too many small caps", "Currency risk"], "FINRA: check holdings to be sure weights match your diversification goal.", "market-cap-weighting"),
    mc("IX-14", "Why can an index fund trail its index?", "A", "Fees, trading costs and tracking error", ["Indexes charge fees", "Funds are not allowed to hold index stocks", "Indexes pay extra dividends"], "SEC Investor.gov lists these as reasons for underperformance.", "size-segment"),
  ],
  terms: TERMS,
  cases: CASES,
};

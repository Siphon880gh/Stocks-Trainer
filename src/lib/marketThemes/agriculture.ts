/**
 * MK4 · Agriculture and inputs (/practice/agriculture): crops (corn, wheat, a basket) and the inputs folded in
 * (fertilizer, farm equipment). Weather, harvests, trade and the monthly WASDE; stocks-to-use; crop futures funds that
 * spread across contract months; nitrogen makers and natural gas; farm income and equipment demand.
 * Sources: USDA (WAOB, NASS, ERS), Teucrium, FINRA. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { withSims } from "../toolTraining/simWalk";
import { THEME_SIMS } from "./simulations";
import { mc, pct, r2, seededTape, usd } from "./helpers";

/** USDA ERS: about 33 million Btu of natural gas per ton of ammonia. */
export const MMBTU_PER_TON_AMMONIA = 33;
export const stocksToUsePct = (endingStocks: number, totalUse: number) => r2((endingStocks / totalUse) * 100);
export const gasCostPerTonAmmonia = (gasPerMmbtu: number) => r2(gasPerMmbtu * MMBTU_PER_TON_AMMONIA);
export const ammoniaMarginPerTon = (ammoniaPrice: number, gasPerMmbtu: number) => r2(ammoniaPrice - gasCostPerTonAmmonia(gasPerMmbtu));

/** Illustrative numbers only (not market data). */
export const AG_EX = { ending: 2.0, use: 15.0, endingTight: 1.2, ammonia: 500, gasLow: 3, gasHigh: 9 } as const;
export const AG_STU = stocksToUsePct(AG_EX.ending, AG_EX.use);
export const AG_STU_TIGHT = stocksToUsePct(AG_EX.endingTight, AG_EX.use);
export const AG_MARGIN_LOW = ammoniaMarginPerTon(AG_EX.ammonia, AG_EX.gasLow);
export const AG_MARGIN_HIGH = ammoniaMarginPerTon(AG_EX.ammonia, AG_EX.gasHigh);

const TERMS: LiteracyTerm[] = [
  { id: "wasde-report", name: "WASDE report", category: "markets", summary: "USDA's monthly World Agricultural Supply and Demand Estimates for grains, oilseeds, cotton and more.", detail: "Released at 12:00 p.m. Eastern on set dates (for example November 10 and December 10 in 2026). Traders compare its yield, export and ending-stocks numbers with expectations; surprises move crop futures. Educational, not advice." },
  { id: "stocks-to-use-ratio", name: "Stocks-to-use ratio", category: "markets", summary: "Ending stocks divided by total use for a crop year: a measure of how much cushion the market has.", detail: "A lower ratio means a tighter market, where a weather problem can move prices more. It is a context number from balance sheets like the WASDE, not a timing signal. Educational, not advice." },
  { id: "crop-progress-report", name: "Crop Progress report", category: "markets", summary: "USDA NASS's weekly report on planting, crop development, harvest and crop condition during the growing season.", detail: "Condition ratings (good/excellent share) give early hints about yields between WASDE releases. Educational, not advice." },
  { id: "nitrogen-fertilizer", name: "Nitrogen fertilizer (ammonia)", category: "markets", summary: "Fertilizer made from ammonia, which is made mostly from natural gas.", detail: "USDA ERS: about 33 million Btu of gas per ton of ammonia, and gas is 72–85% of production cost. A nitrogen maker's margin swings with the gap between fertilizer prices and its gas cost. Educational, not advice." },
  { id: "potash-phosphate", name: "Potash and phosphate", category: "markets", summary: "Two mined fertilizers (potassium and phosphorus) whose supply comes from a few countries and mines.", detail: "Their prices follow crop economics, mine output and trade restrictions more than natural gas. Educational, not advice." },
  { id: "farm-income", name: "Farm income", category: "markets", summary: "What farms earn after expenses; USDA's Economic Research Service publishes forecasts.", detail: "Equipment makers and fertilizer sellers depend on farm budgets: when crop prices fall and costs stay high, farmers delay big purchases. Educational, not advice." },
];

const T1 = seededTape({ seed: 9601, start: 21.8, preDrift: 0.001, postDrift: 0.005, vol: 0.02, gap: 0.045 });
const T2 = seededTape({ seed: 9602, start: 96.4, preDrift: 0.003, postDrift: -0.004, vol: 0.022, gap: -0.05 });
const T3 = seededTape({ seed: 9603, start: 410.0, preDrift: 0.002, postDrift: -0.005, vol: 0.016, gap: -0.06 });

const CASES: CaseStudy[] = [
  {
    id: "case-ag-wasde-tight-stocks",
    title: "Agriculture: WASDE cuts corn stocks; the corn fund jumps",
    contextType: "news",
    thinkingMode: "agriculture_inputs",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. You hold a small corn futures fund position, planned as a hedge on food costs with a stop below last month's low. The noon WASDE cuts projected ending stocks; stocks-to-use falls from about ${pct(AG_STU, 1)} to ${pct(AG_STU_TIGHT, 1)}. The fund gaps up 4.5%. Buy = triple the position. Sell = take the gain and exit. Hold = keep the planned size and stop.`,
    newsHeadline: "USDA trims corn yield and ending stocks; futures rally after WASDE.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "A tighter balance sheet supports prices, and your plan already covers this position. Holding keeps size and stop intact. Exiting is partial credit: not wrong, but your thesis just got stronger. Tripling after the gap turns a planned hedge into a bet on one report.",
      whyMarketMoved: "Lower ending stocks mean less cushion against the next weather problem.",
      evidence: "SAMPLE: the fund drifted higher over the next four sessions. USDA's WAOB releases WASDE at 12:00 p.m. ET.",
    },
  },
  {
    id: "case-ag-nitrogen-gas-spike",
    title: "Agriculture: natural gas spikes; the nitrogen maker slides",
    contextType: "news",
    thinkingMode: "agriculture_inputs",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical nitrogen producer. You own it on a \"strong crop prices = strong fertilizer demand\" thesis. U.S. gas jumps from $${AG_EX.gasLow} to $${AG_EX.gasHigh} per million Btu while ammonia prices hold near ${usd(AG_EX.ammonia, 0)} a ton. The stock gaps down 5%. Buy = add on the dip. Sell = exit or cut; the cost side of the thesis broke. Hold = keep it.`,
    newsHeadline: "Natural gas surges on cold snap; nitrogen producers fall.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `At about 33 million Btu per ton (USDA ERS), gas cost per ton rises from ${usd(AG_EX.gasLow * 33, 0)} to ${usd(AG_EX.gasHigh * 33, 0)}, cutting the margin from ${usd(AG_MARGIN_LOW, 0)} to ${usd(AG_MARGIN_HIGH, 0)}. Your thesis ignored the input. Cutting respects that; holding is partial credit only if you expect gas to fall back fast and size for being wrong.`,
      whyMarketMoved: "Gas is most of the cost of making ammonia, so margins shrink when gas jumps and fertilizer does not.",
      evidence: "SAMPLE: the stock kept drifting lower over the next four sessions.",
    },
  },
  {
    id: "case-ag-equipment-farm-income",
    title: "Agriculture: lower farm income hits the equipment maker",
    contextType: "news",
    thinkingMode: "agriculture_inputs",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical equipment maker. Crop prices have fallen for a year, USDA forecasts lower farm income, and the company cuts its outlook for large tractors. The stock gaps down 6%. You bought it as \"a way to own agriculture\". Buy = add; farmers always need tractors. Sell = exit; farm budgets drive orders and they are shrinking. Hold = keep it.",
    newsHeadline: "Equipment maker lowers outlook as farmers delay purchases.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "Equipment is a big, postponable purchase: when farm income falls, orders fall. The company just confirmed it. Holding is partial credit only if you own it for other businesses (construction, services) and size for the farm cycle. \"Farmers always need tractors\" ignores timing.",
      whyMarketMoved: "Weaker farm budgets and dealer inventories cut expected orders and margins.",
      evidence: "SAMPLE: the stock kept sliding over the next four sessions. USDA ERS publishes farm income forecasts.",
    },
  },
];

export const AGRICULTURE: MarketTheme = {
  id: "agriculture",
  route: "/practice/agriculture",
  practiceTitle: "Agriculture and inputs: crops, fertilizer and farm equipment",
  title: "Agriculture and inputs: crops, fertilizer and farm equipment",
  blurb:
    "Crops as research themes, with the inputs folded in: weather, harvests, trade and the monthly USDA balance sheet; crop futures funds; fertilizer makers and their gas bill; and equipment makers that live on farm income. Educational, not advice.",
  marketForces:
    "Market Forces lists Agriculture (DBA, CORN, WEAT, DE) and Fertilizer (NTR, MOS, CF). Fertilizer is folded in here as an input to the crop economy.",
  asOf: "2026-11-12",
  quiz: {
    name: "Agriculture & Inputs",
    description:
      "Weather, harvests and trade; the WASDE report and stocks-to-use; Crop Progress; crop futures funds across contract months; nitrogen fertilizer and natural gas; potash and phosphate; farm income and equipment demand",
    icon: "agriculture",
  },
  intro: [
    "Crop prices start with supply (acres, weather, yields) and demand (food, feed, fuel, exports). The USDA publishes the balance sheet monthly; markets trade the surprises.",
    "Inputs and equipment sit on the other side of the farm budget. A fertilizer maker earns the gap between fertilizer prices and its own costs; a tractor maker earns when farmers feel rich enough to buy.",
  ],
  wrappers: [
    { name: "Single-crop futures fund", examples: "Corn: CORN · Wheat: WEAT", owns: "Futures across several delivery months (CORN lists its roll dates)", tracks: "A blend of contract months, not today's cash price", watch: "Roll effects; issues a K-1 (Teucrium)" },
    { name: "Agriculture futures basket", examples: "DBA", owns: "Futures on several farm commodities", tracks: "The basket's rolled futures", watch: "Weights can be dominated by a few commodities; read holdings" },
    { name: "Nitrogen producer", examples: "CF", owns: "Ammonia and nitrogen plants", tracks: "Fertilizer price minus gas cost", watch: "Natural gas prices, plant outages" },
    { name: "Potash and phosphate producers", examples: "MOS · NTR (also nitrogen and farm retail)", owns: "Mines, plants and retail", tracks: "Crop economics, mine output, trade policy", watch: "Few supplier countries; export restrictions" },
    { name: "Equipment maker", examples: "DE", owns: "Farm and construction equipment businesses", tracks: "Orders driven by farm income and construction", watch: "Postponable purchases; dealer inventories; financing" },
  ],
  drivers: [
    { title: "Weather and yields", text: "Drought, floods and heat during key growth stages change yields. USDA NASS's weekly Crop Progress gives condition ratings between monthly reports." },
    { title: "The WASDE balance sheet", ...withSims(["USDA's monthly WASDE (12:00 p.m. ET) projects supply, use and ending stocks. ", { text: "A lower stocks-to-use ratio", sim: "mk-ag-wasde" }, " means less cushion."]) },
    { title: "Trade and policy", text: "Export demand, tariffs and export bans shift where crops go and what they fetch." },
    { title: "Gas for nitrogen", text: "USDA ERS: about 33 million Btu of gas per ton of ammonia; gas is 72–85% of production cost." },
    { title: "Farm income", text: "When crop prices fall and costs stay high, farmers delay equipment and may cut fertilizer use." },
  ],
  bridges: [
    { title: "Inflation", text: "Food prices feed headline inflation; crop futures react faster than grocery shelves." },
    { title: "Energy", text: "Natural gas sets nitrogen costs and diesel runs the farm; see Energy." },
    { title: "U.S. dollar", text: "A strong dollar can make U.S. crops less competitive abroad and weigh on export demand." },
    { title: "Economic slowdown", text: "Food demand is steady, but equipment purchases are postponable and cyclical." },
  ],
  math: {
    title: "Cushion and fertilizer margins",
    rows: [
      { label: "Stocks-to-use", formula: "ending stocks ÷ total use", example: `${AG_EX.ending} ÷ ${AG_EX.use} billion bu = ${pct(AG_STU, 1)}; tighter at ${AG_EX.endingTight}: ${pct(AG_STU_TIGHT, 1)}` },
      { label: "Gas cost per ton of ammonia", formula: "gas $/MMBtu × 33", example: `$${AG_EX.gasLow}: ${usd(gasCostPerTonAmmonia(AG_EX.gasLow), 0)}; $${AG_EX.gasHigh}: ${usd(gasCostPerTonAmmonia(AG_EX.gasHigh), 0)}` },
      { label: "Margin over gas", formula: "ammonia price − gas cost", example: `${usd(AG_EX.ammonia, 0)} ammonia: ${usd(AG_MARGIN_LOW, 0)} vs ${usd(AG_MARGIN_HIGH, 0)} a ton` },
    ],
    note: "Illustrative numbers except USDA ERS's 33 million Btu per ton. Real plants have other costs too.",
  },
  calculator: {
    title: "Try it: stocks-to-use and nitrogen margin",
    inputs: [
      { id: "ending", label: "Ending stocks (billion bu)", value: AG_EX.ending, step: 0.1 },
      { id: "use", label: "Total use (billion bu)", value: AG_EX.use, step: 0.1 },
      { id: "ammonia", label: "Ammonia price ($/ton)", value: AG_EX.ammonia, step: 10 },
      { id: "gas", label: "Natural gas ($/MMBtu)", value: AG_EX.gasHigh, step: 0.5 },
    ],
    compute: (v) => [
      { label: "Stocks-to-use", value: (v.use ?? 0) > 0 ? pct(stocksToUsePct(v.ending ?? 0, v.use ?? 0), 1) : "—" },
      { label: "Gas cost per ton", value: usd(gasCostPerTonAmmonia(v.gas ?? 0), 0) },
      { label: "Margin over gas per ton", value: usd(ammoniaMarginPerTon(v.ammonia ?? 0, v.gas ?? 0), 0) },
    ],
    note: "A lower stocks-to-use usually means a market more sensitive to weather.",
  },
  drills: [
    { id: "ag-d1", prompt: "WASDE cuts ending stocks well below expectations. Usual first reaction in crop futures?", options: ["Lower", "Higher", "None", "Trading halts for a month"], answer: 1, why: "Less cushion supports prices." },
    { id: "ag-d2", prompt: "Natural gas triples while ammonia prices hold. Who is squeezed?", options: ["A potash miner", "A nitrogen producer", "A corn futures fund", "A bullion trust"], answer: 1, why: "Gas is 72–85% of ammonia production cost (USDA ERS)." },
    { id: "ag-d3", prompt: "Why might CORN not match the cash corn price this month?", options: ["It holds several futures months, not cash corn", "It owns farms", "It holds Deere shares", "It is a currency trust"], answer: 0, why: "It spreads across delivery months and rolls on scheduled dates." },
    { id: "ag-d4", prompt: "Farm income is forecast to fall. Which business is most exposed?", options: ["A bond fund", "An equipment maker", "A gold trust", "A utility"], answer: 1, why: "Big purchases get postponed when budgets shrink." },
    { id: "ag-d5", prompt: "Stocks-to-use falls from 13.3% to 8.0%. What does that suggest?", options: ["A looser market", "A tighter market more sensitive to weather", "Nothing at all", "Prices must halve"], answer: 1, why: "Less cushion means bigger reactions to surprises. Context, not timing." },
  ],
  caveats: [
    { title: "Weather is not forecastable far out", text: "Seasonal outlooks shift; size for surprises in both directions." },
    { title: "Futures funds roll", text: "Crop futures funds follow their contract months and roll schedule; check the curve." },
    { title: "Taxes", text: "Some crop funds issue a K-1; check before buying in a tax-advantaged account." },
    { title: "Inputs are businesses", text: "Fertilizer and equipment makers have their own costs, debt and cycles." },
  ],
  sources: [
    { label: "USDA: WASDE report and 2026 release dates", url: "https://www.usda.gov/about-usda/general-information/staff-offices/office-chief-economist/commodity-markets/wasde-report", supports: "Monthly supply and demand estimates; 12:00 p.m. ET releases" },
    { label: "USDA NASS: National Crop Progress", url: "https://www.nass.usda.gov/Publications/National_Crop_Progress/", supports: "Weekly crop progress and condition" },
    { label: "USDA ERS: Impact of Rising Natural Gas Prices on U.S. Ammonia Supply (WRS-0702)", url: "https://www.ers.usda.gov/media/9339/wrs-0702.pdf", supports: "About 33 million Btu of gas per ton of ammonia; gas 72–85% of production cost" },
    { label: "USDA ERS: Farm sector income and finances", url: "https://www.ers.usda.gov/topics/farm-economy/farm-sector-income-finances/", supports: "Farm income forecasts" },
    { label: "Teucrium: Corn Fund (CORN)", url: "https://teucrium.com/corn", supports: "Holds CBOT corn futures across delivery months; roll dates; K-1" },
    { label: "FINRA: Futures and commodities", url: "https://www.finra.org/investors/investing/investment-products/futures-and-commodities", supports: "Commodity funds vs producer stocks" },
  ],
  links: [
    { label: "Learn → Agriculture & Inputs", to: "/training?group=agriculture" },
    { label: "Coach → Crops, fertilizer and tractors", to: "/coach/agriculture-wrappers" },
    { label: "Coach → Weather and crop futures", to: "/coach/futures-weather-ag" },
    { label: "Practice → Energy", to: "/practice/energy" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  simulations: THEME_SIMS["agriculture"],
  mode: "agriculture_inputs",
  modeLabel: "Farm economy: crop, input or equipment",
  modeTip:
    "Place the business in the farm budget: crop funds trade the balance sheet (WASDE, weather), fertilizer makers earn the gap over their inputs (gas for nitrogen), equipment makers ride farm income. Ask which side of the budget the news hits. Cases → Market-wide news.",
  questions: [
    mc("AG-01", "What does the WASDE report provide?", "B", "USDA's monthly supply and use forecasts for major crops", ["Daily stock prices", "Fertilizer company earnings", "Weather radar"], "Released by the World Agricultural Outlook Board.", "wasde-report"),
    mc("AG-02", "At what time is WASDE released?", "A", "12:00 p.m. Eastern", ["Midnight", "4:00 p.m. Eastern", "At the stock market open"], "On set monthly dates (Nov 10 and Dec 10 in 2026).", "wasde-report"),
    mc("AG-03", `Ending stocks ${AG_EX.ending}, total use ${AG_EX.use} (billion bu). Stocks-to-use?`, "C", pct(AG_STU, 1), ["7.5%", "2.0%", "150%"], "Ending stocks ÷ total use.", "stocks-to-use-ratio"),
    mc("AG-04", "A lower stocks-to-use ratio means…", "D", "A tighter market with less cushion", ["A looser market", "Guaranteed price gains", "Lower volatility"], "Weather surprises tend to matter more.", "stocks-to-use-ratio"),
    mc("AG-05", "Per USDA ERS, natural gas is what share of ammonia production cost?", "A", "About 72–85%", ["About 5%", "About 25%", "100% exactly"], "About 33 million Btu of gas per ton.", "nitrogen-fertilizer"),
    mc("AG-06", `Gas at $${AG_EX.gasHigh}/MMBtu: gas cost per ton of ammonia ≈`, "B", usd(gasCostPerTonAmmonia(AG_EX.gasHigh), 0), ["$9", "$33", "$900"], "Gas price × 33 million Btu.", "nitrogen-fertilizer"),
    mc("AG-07", "Potash prices follow…", "C", "Crop economics, mine output and trade policy more than natural gas", ["Natural gas only", "Gold", "Interest rates only"], "Potash is mined, not made from gas.", "potash-phosphate"),
    mc("AG-08", "CORN (Teucrium) holds…", "D", "CBOT corn futures across several delivery months", ["Farmland", "Deere shares", "Cash corn in silos"], "It rolls on published dates.", "commodity-pool"),
    mc("AG-09", "Which USDA report gives weekly crop condition ratings?", "A", "NASS Crop Progress", ["WASDE", "Census of Agriculture", "Farm income forecast"], "Weekly during the growing season.", "crop-progress-report"),
    mc("AG-10", "Why do equipment makers swing with farm income?", "B", "Big purchases are postponed when farm budgets shrink", ["They hold crop futures", "Farm income sets interest rates", "They are utilities"], "Orders are cyclical even though food demand is steady.", "farm-income"),
    mc("AG-11", "A strong U.S. dollar tends to…", "C", "Make U.S. crops less competitive abroad", ["Boost export demand", "Have no effect on trade", "Fix crop prices"], "Buyers pay more in their own currency.", "us-dollar-index"),
    mc("AG-12", "DBA is…", "D", "A basket of agricultural futures", ["A fertilizer company", "A farm REIT", "A Treasury fund"], "Read its weights; a few commodities can dominate.", "commodity-pool"),
  ],
  terms: TERMS,
  cases: CASES,
};

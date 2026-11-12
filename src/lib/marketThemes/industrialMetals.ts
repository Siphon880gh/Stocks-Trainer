/**
 * MK3 · Industrial and transition metals (/practice/industrial-metals): copper, uranium and the energy-transition
 * stocks. Grid and construction demand, mine supply and disruption, long-term uranium contracts, why a lithium boom
 * can still end in a price collapse, and how policy and financing costs move clean-energy shares.
 * Sources: IEA, EIA, FINRA, USCF, Global X. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { withSims } from "../toolTraining/simWalk";
import { THEME_SIMS } from "./simulations";
import { mc, pct, r2, seededTape } from "./helpers";

/** Revenue change when `contractedPct` of sales is at fixed prices and the rest moves with spot. */
export const revenueChangeWithContractsPct = (contractedPct: number, spotMovePct: number) => r2((1 - contractedPct / 100) * spotMovePct);
/** Share of a total, in %. */
export const sharePct = (part: number, total: number) => r2((part / total) * 100);
/** Yearly payment on a loan (annuity): principal × r ÷ (1 − (1 + r)^−years). */
export function annualLoanPayment(principal: number, ratePct: number, years: number): number {
  const r = ratePct / 100;
  if (r === 0) return r2(principal / years);
  return r2((principal * r) / (1 - Math.pow(1 + r, -years)));
}

/** EIA Uranium Marketing Annual Report, table S1a (2024 deliveries, million lb U3O8e). */
export const URANIUM_2024 = { total: 55.9, longTerm: 49.8, spot: 6.1 } as const;
export const URANIUM_LT_SHARE = sharePct(URANIUM_2024.longTerm, URANIUM_2024.total);
/** Illustrative numbers only (not market data). */
export const IM_EX = { contracted: 80, spotMove: 30, loan: 100, rateLow: 4, rateHigh: 7, years: 20 } as const;
export const IM_REV = revenueChangeWithContractsPct(IM_EX.contracted, IM_EX.spotMove);
export const IM_PAY_LOW = annualLoanPayment(IM_EX.loan, IM_EX.rateLow, IM_EX.years);
export const IM_PAY_HIGH = annualLoanPayment(IM_EX.loan, IM_EX.rateHigh, IM_EX.years);

const TERMS: LiteracyTerm[] = [
  { id: "long-term-uranium-contract", name: "Long-term uranium contract", category: "markets", summary: "A deal for uranium deliveries starting more than a year after signing, which is how most reactor fuel is bought.", detail: `EIA data show U.S. reactor owners bought ${URANIUM_2024.longTerm} of ${URANIUM_2024.total} million pounds under long-term contracts in 2024 (about ${Math.round(URANIUM_LT_SHARE)}%). A spot-price jump reaches producers slowly, through new contracts. Educational, not advice.` },
  { id: "spot-uranium-price", name: "Spot uranium price", category: "markets", summary: "The price for uranium delivered within about a year; a thin market that can swing sharply.", detail: "Headlines quote it, but most fuel is bought under long-term contracts, so producers' revenue moves more slowly than the spot price. Educational, not advice." },
  { id: "physical-uranium-vehicle", name: "Physical uranium vehicle", category: "ownership", summary: "A fund or trust that buys and stores uranium itself, instead of owning miners.", detail: "Some uranium funds hold shares of these vehicles alongside miners. Read the holdings to see how much exposure is to the metal and how much to companies. Educational, not advice." },
  { id: "grid-investment", name: "Grid investment", category: "markets", summary: "Spending on power lines, transformers and substations, a large and growing user of copper.", detail: "The IEA says the rapid expansion of grid investment in China was the single largest contributor to copper demand growth in 2023–2024. Educational, not advice." },
  { id: "supply-response", name: "Supply response", category: "markets", summary: "New production that arrives when prices are high, which can push prices back down.", detail: "The IEA notes lithium prices rose about eightfold in 2021–22 and then fell more than 80% from 2023 as supply grew fast. Strong demand stories do not guarantee high prices. Educational, not advice." },
  { id: "project-financing-cost", name: "Project financing cost", category: "markets", summary: "The interest a solar farm, wind farm or mine pays to borrow for construction.", detail: "Clean-energy projects are mostly up-front capital, so higher rates raise yearly payments and can cut demand for equipment like solar modules. Educational, not advice." },
];

const T1 = seededTape({ seed: 9501, start: 44.1, preDrift: 0.002, postDrift: 0.003, vol: 0.022, gap: 0.07 });
const T2 = seededTape({ seed: 9502, start: 52.3, preDrift: 0.005, postDrift: -0.001, vol: 0.026, gap: 0.04 });
const T3 = seededTape({ seed: 9503, start: 171.0, preDrift: 0.001, postDrift: -0.006, vol: 0.024, gap: -0.08 });

const CASES: CaseStudy[] = [
  {
    id: "case-im-copper-mine-disruption",
    title: "Industrial metals: a mine shutdown lifts copper",
    contextType: "news",
    thinkingMode: "industrial_metals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. Flooding halts a large copper mine abroad. Copper jumps and a diversified copper miner fund gaps up 7%. You have no position and no plan; a social post says \"copper to the moon\". Buy = chase the gap with a full position. Sell = nothing to sell; stay out today and write a plan. Hold = not applicable (no position); treat as doing nothing.",
    newsHeadline: "Floods halt major copper mine; copper and miners jump.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "Supply disruptions are real drivers (the IEA puts about 7% of 2024 copper supply at risk from floods or droughts), but the gap already prices the news and you have no entry, stop or size. Staying out and writing a plan is the process. Doing nothing is fine too.",
      whyMarketMoved: "Lost output tightened expected supply; miners with other mines benefit from a higher price.",
      evidence: "SAMPLE: the fund held the gap and drifted higher over the next four sessions. Missing a move without a plan is not a mistake.",
    },
  },
  {
    id: "case-im-uranium-spot-spike",
    title: "Industrial metals: spot uranium spikes; the producer lags",
    contextType: "news",
    thinkingMode: "industrial_metals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical producer. Spot uranium jumps ${IM_EX.spotMove}% in a month. You own a uranium producer that sells about ${IM_EX.contracted}% of output under fixed-price long-term contracts. It is up only 4%, and you feel it \"must catch up\". Buy = double the position. Sell = sell it all; it is broken. Hold = keep the planned size; the lag is how contracts work.`,
    newsHeadline: "Spot uranium surges on supply worries; producers rise more slowly.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: `With ${IM_EX.contracted}% of sales at fixed prices, a ${IM_EX.spotMove}% spot jump lifts revenue by only about ${pct(IM_REV, 0)} until contracts reprice. EIA data show U.S. reactors bought about ${Math.round(URANIUM_LT_SHARE)}% of 2024 deliveries under long-term contracts. Nothing broke; the lag is structural. Doubling up chases a story; selling misreads the lag.`,
      whyMarketMoved: "The thin spot market moved fast; the producer's revenue moves at the speed of its contract book.",
      evidence: "SAMPLE: the producer drifted sideways over the next four sessions.",
    },
  },
  {
    id: "case-im-solar-rates-rise",
    title: "Transition: rates jump and a solar maker gaps down",
    contextType: "news",
    thinkingMode: "industrial_metals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical solar manufacturer. Long-term yields jump after a hot jobs report; the solar maker gaps down 8%. Your thesis was \"falling rates make solar projects cheaper to finance\". A $${IM_EX.loan}M project loan at ${IM_EX.rateHigh}% instead of ${IM_EX.rateLow}% costs much more each year. Buy = buy the dip. Sell = cut; the rate leg of the thesis is moving the wrong way. Hold = keep it unchanged.`,
    newsHeadline: "Yields jump after strong payrolls; clean-energy shares slide.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `Projects are mostly up-front capital: at ${IM_EX.rateLow}% a $${IM_EX.loan}M, ${IM_EX.years}-year loan costs about $${IM_PAY_LOW}M a year; at ${IM_EX.rateHigh}% about $${IM_PAY_HIGH}M. Your thesis depended on falling rates, and they rose. Cutting respects the plan; holding is partial credit only if the company-specific case (orders, margins) still carries it.`,
      whyMarketMoved: "Higher financing costs can delay projects and squeeze demand for modules.",
      evidence: "SAMPLE: the stock kept drifting lower over the next four sessions.",
    },
  },
];

export const INDUSTRIAL_METALS: MarketTheme = {
  id: "industrial-metals",
  route: "/practice/industrial-metals",
  practiceTitle: "Industrial and transition metals: copper, uranium and clean energy",
  title: "Industrial and transition metals",
  blurb:
    "Copper, uranium and the energy-transition stocks: what moves each, why contracts and supply responses blunt the headlines, and how interest rates reach a solar farm. Educational, not advice.",
  marketForces:
    "Market Forces lists Copper (CPER, COPX, FCX, SCCO), Uranium (URA, URNM, CCJ) and the Energy transition theme (ICLN, TAN, FSLR). This lesson explains the forces behind them.",
  asOf: "2026-11-12",
  quiz: {
    name: "Industrial & Transition Metals",
    description:
      "Copper demand from grids and construction, mine supply and disruptions, copper futures funds vs miners; uranium's long-term contracts vs the spot price, physical uranium vehicles; supply responses (lithium's boom and bust); clean-energy stocks, policy and financing costs",
    icon: "bolt",
  },
  intro: [
    "Copper wires the world: buildings, power grids, motors and electronics. Uranium fuels reactors under long contracts. Solar and wind makers sell equipment whose demand depends on policy and the cost of borrowing.",
    "All three are sold as \"transition\" stories. The lesson here is that stories reach prices through specific channels: orders, contracts, supply and financing.",
  ],
  wrappers: [
    { name: "Copper futures fund", examples: "CPER", owns: "Copper futures plus cash", tracks: "Rolled copper futures", watch: "Roll cost; not a miner's leverage" },
    { name: "Copper miners", examples: "Fund: COPX · Stocks: FCX (copper and gold), SCCO", owns: "Mining businesses", tracks: "Copper price minus costs, plus by-products and country risk", watch: "Operating leverage, local politics, water and weather risks" },
    { name: "Uranium fund", examples: "URA (miners and nuclear components) · URNM (uranium-related equities and physical-uranium vehicles)", owns: "Shares of miners, nuclear suppliers and sometimes physical-uranium vehicles", tracks: "Those companies' prices", watch: "Read holdings: how much is metal exposure, how much companies" },
    { name: "Uranium producer", examples: "CCJ (Cameco)", owns: "Mines, conversion and fuel services", tracks: "Contract book prices more than spot", watch: "Contract mix, production problems" },
    { name: "Clean-energy stocks", examples: "Funds: ICLN, TAN · Stock: FSLR", owns: "Solar, wind and related businesses", tracks: "Orders and margins driven by policy, financing and competition", watch: "Interest rates, subsidy changes, imports and price wars" },
  ],
  drivers: [
    { title: "Grid and construction demand", text: "The IEA says China's rapid grid buildout was the single largest contributor to copper demand growth in 2023–2024. Construction and manufacturing cycles matter too." },
    { title: "Mine supply and disruption", text: "New copper mines take years. The IEA estimated about 7% of 2024 copper supply was at risk from floods or droughts." },
    { title: "Uranium contracts", text: "EIA data: U.S. reactor owners bought 49.8 of 55.9 million pounds under long-term contracts in 2024. Producers reprice slowly; the thin spot market can jump." },
    { title: "Supply response", ...withSims([{ text: "High prices bring new supply", sim: "mk-im-supply" }, ". The IEA notes lithium rose about eightfold in 2021–22, then fell more than 80% from 2023 as output surged."]) },
    { title: "Policy and financing", text: "Clean-energy projects are mostly up-front capital, so interest rates and subsidies change their economics." },
  ],
  bridges: [
    { title: "Energy transition", text: "Grids, EVs and solar add metal demand, but supply and prices can overshoot both ways." },
    { title: "Interest rates", text: "Higher rates raise project financing costs and the discount rate on far-off profits, a double hit for clean-energy shares." },
    { title: "Infrastructure", text: "Public and private spending reaches copper through orders and timing; see Sectors and sector rotation for industrials." },
    { title: "AI and chip demand", text: "Data centers need power and grid connections, linking AI spending to copper, gas and nuclear power." },
  ],
  math: {
    title: "Contracts, shares and financing",
    rows: [
      { label: "Long-term share (EIA 2024)", formula: "long-term ÷ total", example: `${URANIUM_2024.longTerm} ÷ ${URANIUM_2024.total} million lb ≈ ${pct(URANIUM_LT_SHARE, 0)}` },
      { label: "Revenue with fixed contracts", formula: "(1 − contracted) × spot move", example: `${IM_EX.contracted}% contracted, spot +${IM_EX.spotMove}%: revenue ≈ ${pct(IM_REV, 0)}` },
      { label: "Project loan payment", formula: "P × r ÷ (1 − (1 + r)^−n)", example: `$${IM_EX.loan}M over ${IM_EX.years} yrs: $${IM_PAY_LOW}M at ${IM_EX.rateLow}%, $${IM_PAY_HIGH}M at ${IM_EX.rateHigh}%` },
    ],
    note: "Illustrative except the EIA figures. Real contracts often mix fixed, escalated and market-linked prices.",
  },
  calculator: {
    title: "Try it: contracts and financing",
    inputs: [
      { id: "contracted", label: "Share of sales at fixed prices (%)", value: IM_EX.contracted, step: 5 },
      { id: "move", label: "Spot price move (%)", value: IM_EX.spotMove, step: 5 },
      { id: "loan", label: "Project loan ($M)", value: IM_EX.loan, step: 10 },
      { id: "rate", label: "Interest rate (%)", value: IM_EX.rateHigh, step: 0.5 },
      { id: "years", label: "Loan term (years)", value: IM_EX.years, step: 1 },
    ],
    compute: (v) => [
      { label: "Revenue change now", value: pct(revenueChangeWithContractsPct(v.contracted ?? 0, v.move ?? 0), 1) },
      { label: "Yearly loan payment", value: (v.years ?? 0) > 0 ? `$${annualLoanPayment(v.loan ?? 0, v.rate ?? 0, v.years ?? 0)}M` : "—" },
    ],
    note: "Fixed-price contracts delay both gains and losses.",
  },
  drills: [
    { id: "im-d1", prompt: "Spot uranium jumps 30%; a producer with 80% fixed-price contracts rises far less. Why?", options: ["The market is wrong", "Most of its revenue does not reprice yet", "Uranium is priced in gold", "It holds copper"], answer: 1, why: "Only the uncontracted 20% moves with spot right away: about +6% revenue." },
    { id: "im-d2", prompt: "Which was the largest source of copper demand growth in 2023–2024, per the IEA?", options: ["Jewelry", "China's grid investment", "Gold mining", "Crypto mining"], answer: 1, why: "Grid buildout uses a lot of copper." },
    { id: "im-d3", prompt: "Lithium prices fell over 80% from 2023 despite strong EV demand. The main reason?", options: ["Demand vanished", "Supply grew much faster", "Lithium was banned", "Futures funds sold it"], answer: 1, why: "Supply response: high prices brought new output quickly (IEA)." },
    { id: "im-d4", prompt: "Long-term yields jump. What usually happens to clean-energy shares, all else equal?", options: ["They benefit", "They come under pressure", "No effect", "They convert to bonds"], answer: 1, why: "Higher financing costs and discount rates weigh on capital-heavy, far-off profits." },
    { id: "im-d5", prompt: "You want uranium price exposure. What should you check in a uranium fund first?", options: ["Its logo", "Its holdings: physical vehicles vs miners vs component makers", "Its age", "Its ticker length"], answer: 1, why: "Funds mix very different exposures under one theme name." },
  ],
  caveats: [
    { title: "Stories vs prices", text: "A strong demand story can coexist with falling prices when supply grows faster." },
    { title: "Country and project risk", text: "Mines sit in specific places with water, weather, labor and political risks." },
    { title: "Policy can change", text: "Subsidies, tariffs and permits can change the economics of transition businesses quickly." },
    { title: "Thin markets", text: "Spot uranium trades thinly; a quote can jump on small volumes." },
  ],
  sources: [
    { label: "IEA: Global Critical Minerals Outlook 2025, executive summary", url: "https://www.iea.org/reports/global-critical-minerals-outlook-2025/executive-summary", supports: "China grid investment and copper demand growth; lithium boom and bust; 7% of copper supply at climate risk" },
    { label: "EIA: Uranium Marketing Annual Report, table S1a", url: "https://www.eia.gov/uranium/marketing/summarytable1a.php", supports: "2024 purchases: 55.9 million lb total, 49.8 long-term, 6.1 spot" },
    { label: "FINRA: Futures and commodities", url: "https://www.finra.org/investors/investing/investment-products/futures-and-commodities", supports: "Commodity funds vs producer stocks" },
    { label: "Global X: Copper Miners ETF (COPX)", url: "https://www.globalxetfs.com/funds/COPX", supports: "A basket of copper miners" },
    { label: "Global X: Uranium ETF (URA)", url: "https://www.globalxetfs.com/funds/ura", supports: "Miners and nuclear-component companies" },
    { label: "iShares: Global Clean Energy ETF (ICLN)", url: "https://www.ishares.com/us/products/239738/ishares-global-clean-energy-etf", supports: "Clean-energy company basket" },
  ],
  links: [
    { label: "Learn → Industrial & Transition Metals", to: "/training?group=industrial-metals" },
    { label: "Coach → Copper, uranium and the transition", to: "/coach/industrial-metals-wrappers" },
    { label: "Practice → Energy", to: "/practice/energy" },
    { label: "Practice → Same theme, different wrapper", to: "/practice/exposure-wrappers" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  simulations: THEME_SIMS["industrial-metals"],
  mode: "industrial_metals",
  modeLabel: "Metals: which channel reaches the price",
  modeTip:
    "Trace the story to a channel: orders and grids for copper, the contract book for uranium, financing and policy for clean energy, and supply response for everything. A headline without a channel is not a thesis. Cases → Market-wide news.",
  questions: [
    mc("IM-01", "Per the IEA, the single largest contributor to copper demand growth in 2023–2024 was…", "B", "China's grid investment", ["Jewelry", "Coins", "Oil drilling"], "Grids use a lot of copper wire and transformers.", "grid-investment"),
    mc("IM-02", "In 2024, about what share of U.S. reactor uranium purchases were long-term contracts (EIA)?", "C", "About 89%", ["About 10%", "About 50%", "100%"], "49.8 of 55.9 million pounds.", "long-term-uranium-contract"),
    mc("IM-03", "Why can a uranium producer lag a spot-price spike?", "A", "Most of its sales are under contracts that reprice slowly", ["It holds copper", "Spot prices are illegal", "It owns a bullion trust"], "Contracts delay both gains and losses.", "long-term-uranium-contract"),
    mc("IM-04", `With ${IM_EX.contracted}% fixed-price sales, a ${IM_EX.spotMove}% spot jump lifts revenue about…`, "D", pct(IM_REV, 0), ["30%", "80%", "0%"], "Only the uncontracted part moves now: (1 − 0.8) × 30%.", "spot-uranium-price"),
    mc("IM-05", "A physical uranium vehicle owns…", "B", "Stored uranium", ["Mining shares only", "Solar panels", "Copper futures"], "Some uranium funds hold these alongside miners.", "physical-uranium-vehicle"),
    mc("IM-06", "Lithium prices rose about eightfold in 2021–22 and then…", "C", "Fell more than 80% from 2023 as supply surged", ["Doubled again", "Stayed flat", "Were fixed by law"], "IEA: a classic supply response.", "supply-response"),
    mc("IM-07", "CPER mostly holds…", "A", "Copper futures plus cash", ["Copper miners", "Physical copper in vaults", "Utilities"], "A futures fund, with roll effects.", "commodity-pool"),
    mc("IM-08", "Higher interest rates usually hurt solar projects because…", "D", "They are mostly up-front capital, so financing costs more", ["Sunlight costs more", "Panels need oil", "Rates set panel prices directly"], `$${IM_EX.loan}M over ${IM_EX.years} years: $${IM_PAY_LOW}M a year at ${IM_EX.rateLow}% vs $${IM_PAY_HIGH}M at ${IM_EX.rateHigh}%.`, "project-financing-cost"),
    mc("IM-09", "The IEA estimated about what share of 2024 copper supply was at risk from floods or droughts?", "B", "About 7%", ["About 70%", "0%", "100%"], "Climate and water risks are rising.", "supply-response"),
    mc("IM-10", "URA's holdings are mainly…", "C", "Uranium miners and nuclear-component companies", ["Physical uranium only", "Gold bars", "Treasury bills"], "Read holdings before calling it a uranium price tracker.", "physical-uranium-vehicle"),
    mc("IM-11", "A copper miner fund rises more than copper on a good day mainly because of…", "A", "Operating leverage", ["Lower fees", "Roll yield", "Currency hedging"], "Fixed costs magnify price moves in profits.", "operating-leverage"),
    mc("IM-12", "\"Energy transition demand\" guarantees which outcome?", "D", "None; prices depend on supply too", ["Higher metal prices every year", "Rising clean-energy shares", "Falling interest rates"], "Demand stories reach prices through channels, and supply responds.", "supply-response"),
  ],
  terms: TERMS,
  cases: CASES,
};

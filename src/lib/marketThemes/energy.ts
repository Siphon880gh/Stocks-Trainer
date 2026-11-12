/**
 * MK2 · Energy (/practice/energy): oil and natural gas as themes. Supply, inventories and weather; WTI vs Brent;
 * the weekly EIA reports; upstream vs integrated vs refiners vs LNG exporters; the 3:2:1 crack spread; futures funds
 * (USO, BNO, UNG) vs energy stock funds (XLE, FCG). Complements the futures crude cases and coach.
 * Sources: EIA, USCF, FINRA, CFTC. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { withSims } from "../toolTraining/simWalk";
import { THEME_SIMS } from "./simulations";
import { mc, r2, seededTape, usd } from "./helpers";

export const GALLONS_PER_BARREL = 42;
/** EIA 3:2:1 crack spread, $/barrel: (2 × gasoline × 42 + 1 × distillate × 42 − 3 × crude) ÷ 3. Product prices in $/gallon. */
export const crackSpread321 = (gasolinePerGal: number, distillatePerGal: number, crudePerBbl: number) =>
  r2((2 * gasolinePerGal * GALLONS_PER_BARREL + distillatePerGal * GALLONS_PER_BARREL - 3 * crudePerBbl) / 3);
/** Storage vs the five-year average, % above (+) or below (−). */
export const vsFiveYearPct = (stocks: number, fiveYearAvg: number) => r2(((stocks - fiveYearAvg) / fiveYearAvg) * 100);

/** Illustrative numbers only (not market data). */
export const EN_EX = { gasoline: 2.4, distillate: 2.7, crude: 75, crudeUp: 80, storage: 3900, avg: 3700 } as const;
export const EN_CRACK = crackSpread321(EN_EX.gasoline, EN_EX.distillate, EN_EX.crude);
export const EN_CRACK_UP = crackSpread321(EN_EX.gasoline, EN_EX.distillate, EN_EX.crudeUp);
export const EN_STORAGE = vsFiveYearPct(EN_EX.storage, EN_EX.avg);

const TERMS: LiteracyTerm[] = [
  { id: "crack-spread", name: "Crack spread (3:2:1)", category: "markets", summary: "A rough refinery margin: the value of two barrels of gasoline and one of distillate minus three barrels of crude, per barrel.", detail: "EIA's formula: (2 × gasoline × 42 + distillate × 42 − 3 × crude) ÷ 3, with products in dollars per gallon. It ignores all costs except crude, so it is an indicator, not a refiner's profit. Educational, not advice." },
  { id: "wti-vs-brent", name: "WTI vs Brent", category: "markets", summary: "The two main crude benchmarks: West Texas Intermediate (delivered at Cushing, Oklahoma) and Brent (North Sea, used for much of the world's oil).", detail: "They usually move together but the gap between them changes with U.S. supply, pipelines and shipping. USO tracks WTI futures; BNO tracks Brent futures. Educational, not advice." },
  { id: "eia-petroleum-status-report", name: "EIA Weekly Petroleum Status Report", category: "markets", summary: "The U.S. government's weekly count of crude and fuel inventories, production, refinery runs and trade.", detail: "Usually released Wednesdays at 10:30 a.m. Eastern (moved for holidays). Traders compare the inventory change with expectations; a surprise can move crude within seconds. Educational, not advice." },
  { id: "natural-gas-storage-report", name: "EIA Weekly Natural Gas Storage Report", category: "markets", summary: "EIA's weekly estimate of working gas in U.S. underground storage, compared with last year and the five-year average.", detail: "Usually released Thursdays at 10:30 a.m. Eastern. Storage typically builds April–October and draws November–March; how full it is going into winter matters for prices. Educational, not advice." },
  { id: "upstream-midstream-downstream", name: "Upstream, midstream, downstream", category: "markets", summary: "Oil and gas business segments: finding and producing (upstream), moving and storing (midstream), and refining and selling (downstream).", detail: "Each earns money differently. Producers lean on commodity prices, pipelines often on volumes and fees, refiners on the spread between crude and fuels. Integrated majors own several segments. Educational, not advice." },
  { id: "lng-exporter", name: "LNG exporter", category: "markets", summary: "A company that chills natural gas into liquid, ships it abroad and often sells capacity under long-term contracts.", detail: "Long-term contracts with fixed fees can make its earnings less tied to day-to-day U.S. gas prices than a producer's. Read the company's filings for its actual contract mix. Educational, not advice." },
  { id: "reverse-split", name: "Reverse split", category: "ownership", summary: "Combining shares (say 4 into 1) so the price per share rises without changing the value of a holding.", detail: "Common in funds and stocks after big declines. USCF's natural gas fund did a 1-for-4 reverse split on January 23, 2024. It changes the share count, not the return. Educational, not advice." },
];

const T1 = seededTape({ seed: 9401, start: 142.5, preDrift: 0.002, postDrift: -0.005, vol: 0.018, gap: -0.045 });
const T2 = seededTape({ seed: 9402, start: 36.8, preDrift: 0.004, postDrift: -0.008, vol: 0.03, gap: -0.06 });
const T3 = seededTape({ seed: 9403, start: 15.2, preDrift: -0.006, postDrift: -0.007, vol: 0.03 });

const CASES: CaseStudy[] = [
  {
    id: "case-en-refiner-crude-up-margin-down",
    title: "Energy: crude rises, the refiner falls",
    contextType: "news",
    thinkingMode: "energy_theme",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical refiner. You bought a refiner \"for higher oil prices\". Crude jumps from ${usd(EN_EX.crude, 0)} to ${usd(EN_EX.crudeUp, 0)} on a supply cut while gasoline and diesel prices barely move. The refiner gaps down 4.5%. Buy = add because oil is up. Sell = exit; the thesis picked the wrong business for an oil-price view. Hold = keep it.`,
    newsHeadline: "Producers extend output cuts; crude climbs, fuel prices lag.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `A refiner buys crude and sells fuel. With products flat, the 3:2:1 crack spread falls from ${usd(EN_CRACK)} to ${usd(EN_CRACK_UP)} a barrel when crude rises ${usd(EN_EX.crudeUp - EN_EX.crude, 0)}. Your thesis was \"oil up\", which helps producers, not refiners. Holding is partial credit only if you now have a separate margin thesis.`,
      whyMarketMoved: "Higher input cost with flat output prices squeezes the refining margin.",
      evidence: "SAMPLE: the refiner kept sliding over the next four sessions. EIA explains the 3:2:1 crack spread as a refining-margin indicator.",
    },
  },
  {
    id: "case-en-gas-producer-mild-winter",
    title: "Energy: a mild winter forecast hits your gas producer",
    contextType: "news",
    thinkingMode: "energy_theme",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical gas producer. You bought it in October on a \"cold winter, tight storage\" thesis. Now forecasts turn mild and storage sits about ${EN_STORAGE.toFixed(1)}% above the five-year average. Gas falls 8% and the producer gaps down 6%. Buy = average down. Sell = exit; both legs of the thesis broke. Hold = keep it and hope for cold.`,
    newsHeadline: "Mild outlook, ample storage: natural gas slides; producers follow.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["sell"],
    acceptablePartial: [],
    debrief: {
      process: "The trade rested on weather and storage. EIA names storage and winter weather as major gas-price drivers, and both turned against you. When the reason for a trade is gone, so is the trade. Averaging down or hoping for cold replaces a thesis with a wish.",
      whyMarketMoved: "Warmer forecasts cut expected heating demand while storage was already above normal.",
      evidence: "SAMPLE: gas and the producer kept falling over the next four sessions. EIA's weekly storage report compares stocks with the five-year average.",
    },
  },
  {
    id: "case-en-gas-fund-long-hold",
    title: "Energy: a natural gas futures fund as a long-term hold",
    contextType: "news",
    thinkingMode: "energy_theme",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. A friend suggests a front-month natural gas futures fund as a \"buy and forget\" bet that gas will be worth more in ten years. The fund rolls monthly, the curve is in steep contango, and it has done a reverse split after years of losses. Buy = buy it for ten years. Sell = nothing to sell; pass and look at wrappers built for a long view. Hold = keep watching without a plan.",
    newsHeadline: "Gas futures curve steep into winter months; front-month fund hits new low.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "UNG's own objective is to track daily changes in the near-month Henry Hub contract. Rolling in contango has cost such funds heavily over long periods, which is why reverse splits follow. The wrapper does not fit a ten-year view. Passing is correct; watching is partial credit if it leads to a better-fitting wrapper.",
      whyMarketMoved: "Each roll sold a cheap expiring contract and bought a pricier later one.",
      evidence: "SAMPLE: the fund kept drifting lower over the next four sessions. USCF lists UNG's benchmark as the near-month NYMEX contract and a 1-for-4 reverse split on January 23, 2024.",
    },
  },
];

export const ENERGY: MarketTheme = {
  id: "energy",
  route: "/practice/energy",
  practiceTitle: "Energy: oil, natural gas and the companies",
  title: "Energy: oil, natural gas and the companies",
  blurb:
    "Oil and gas as research themes: what moves each, which weekly reports matter, and why a producer, a refiner, an LNG exporter and a futures fund can react differently to the same headline. Educational, not advice.",
  marketForces:
    "Market Forces lists Oil (USO, BNO, XLE, XOM, CVX) and Natural gas (UNG, FCG, EQT, LNG). The futures lessons already cover crude contracts; this lesson covers the stock-market wrappers and the businesses.",
  asOf: "2026-11-12",
  quiz: {
    name: "Energy: Oil, Gas & the Companies",
    description:
      "Supply, inventories, OPEC decisions and demand for oil; storage and weather for gas; WTI vs Brent; the weekly EIA reports; upstream, midstream, downstream and LNG exporters; the 3:2:1 crack spread; futures funds vs energy stock funds; reverse splits after roll losses",
    icon: "local_gas_station",
  },
  intro: [
    "\"Energy\" covers crude oil, fuels and natural gas, and the companies that find, move, refine and export them. A headline that lifts crude can help a producer, squeeze a refiner and barely touch a pipeline.",
    "Gas is more local than oil: U.S. prices lean on weather, storage and export capacity. Oil is global: supply decisions, inventories and world demand set the tone.",
  ],
  wrappers: [
    { name: "Oil futures fund", examples: "WTI: USO · Brent: BNO", owns: "Crude futures plus cash", tracks: "Rolled futures, not spot", watch: "Roll cost in contango; April 2020 showed contract mechanics can dominate" },
    { name: "Gas futures fund", examples: "UNG", owns: "Near-month Henry Hub futures (USCF)", tracks: "Daily changes in the benchmark contract", watch: "Steep winter curves, big roll costs, reverse splits after long declines" },
    { name: "Integrated major", examples: "XOM, CVX", owns: "Production, refining, chemicals and more", tracks: "A blend of oil, gas and refining margins", watch: "Less tied to crude than a pure producer; capital spending and buybacks matter" },
    { name: "Producer (upstream)", examples: "Gas: EQT", owns: "Wells and reserves", tracks: "Commodity price minus production cost, plus hedges", watch: "Operating leverage; hedges can delay both gains and losses" },
    { name: "LNG exporter", examples: "LNG (Cheniere)", owns: "Liquefaction and export terminals", tracks: "Contracted volumes and fees more than daily gas prices", watch: "Contract terms, project timing, global gas demand" },
    { name: "Energy stock fund", examples: "XLE (large U.S. energy) · FCG (gas-related companies)", owns: "A basket of energy companies", tracks: "Those companies, often concentrated in a few giants", watch: "Check current weights; it falls with stocks in a broad selloff" },
  ],
  drivers: [
    { title: "Oil supply decisions", text: "Producer-group output decisions, sanctions and outages change supply quickly. EIA lists supply, demand, inventories and financial markets among the factors behind crude prices." },
    { title: "Inventories", ...withSims(["EIA's Weekly Petroleum Status Report (usually Wednesday, 10:30 a.m. ET) counts crude and fuel stocks; ", { text: "a bigger-than-expected draw or build", sim: "mk-en-inventory" }, " can move crude within seconds."]) },
    { title: "Gas: weather and storage", text: "EIA names production, storage, trade, winter and summer weather, growth and other fuels' prices as the major gas drivers. Storage usually builds April–October and draws November–March; the Thursday storage report compares it with the five-year average." },
    { title: "Refining margins", ...withSims(["Refiners earn the spread between crude and fuels. EIA's ", { text: "3:2:1 crack spread", sim: "mk-en-crack" }, " is the common shorthand."]) },
    { title: "Global demand", text: "Growth, travel and industrial activity set oil demand; a slowdown can outweigh a supply cut." },
  ],
  bridges: [
    { title: "Inflation", text: "Energy feeds headline inflation directly through fuel prices; core inflation excludes it. See the macro desk and Bonds and rates." },
    { title: "Economic growth and slowdown", text: "Oil demand follows growth, so recession fears can sink crude and energy stocks together." },
    { title: "U.S. dollar", text: "Crude is priced in dollars; a stronger dollar is often a mild headwind." },
    { title: "Energy transition", text: "Utilities, solar and uranium sit in Industrial and transition metals and the sectors lesson; gas often fills the gap when wind and sun are low." },
  ],
  math: {
    title: "Refining margin and storage",
    rows: [
      { label: "3:2:1 crack spread", formula: "(2 × gasoline × 42 + distillate × 42 − 3 × crude) ÷ 3", example: `gasoline $${EN_EX.gasoline}/gal, diesel $${EN_EX.distillate}/gal, crude ${usd(EN_EX.crude, 0)}: ${usd(EN_CRACK)}/bbl` },
      { label: "Crude +$5, products flat", formula: "same formula", example: `${usd(EN_CRACK_UP)}/bbl: the refiner's margin shrinks` },
      { label: "Storage vs five-year average", formula: "(stocks − average) ÷ average", example: `${EN_EX.storage.toLocaleString("en-US")} vs ${EN_EX.avg.toLocaleString("en-US")} Bcf: ${EN_STORAGE.toFixed(1)}% above` },
    ],
    note: "Illustrative numbers, not current prices. A barrel is 42 gallons.",
  },
  calculator: {
    title: "Try it: 3:2:1 crack spread",
    inputs: [
      { id: "gas", label: "Gasoline ($/gallon)", value: EN_EX.gasoline, step: 0.05 },
      { id: "dist", label: "Diesel / distillate ($/gallon)", value: EN_EX.distillate, step: 0.05 },
      { id: "crude", label: "Crude ($/barrel)", value: EN_EX.crude, step: 1 },
    ],
    compute: (v) => {
      const c = crackSpread321(v.gas ?? 0, v.dist ?? 0, v.crude ?? 0);
      return [
        { label: "Crack spread", value: `${usd(c)} a barrel` },
        { label: "Fuel value per barrel of crude", value: usd(r2((2 * (v.gas ?? 0) * 42 + (v.dist ?? 0) * 42) / 3)) },
      ];
    },
    note: "Ignores every cost except crude, so it is an indicator, not a refiner's profit.",
  },
  drills: [
    { id: "en-d1", prompt: "Crude rises, gasoline and diesel do not. Which business is squeezed?", options: ["An oil producer", "A refiner", "A gold miner", "A bullion trust"], answer: 1, why: "The refiner's input costs rise while its outputs do not: the crack spread narrows." },
    { id: "en-d2", prompt: "Gas storage is well above the five-year average going into a mild winter. Usual pressure on gas prices?", options: ["Upward", "Downward", "None", "Prices are fixed"], answer: 1, why: "EIA: storage and winter weather are major drivers; ample storage plus mild weather point lower." },
    { id: "en-d3", prompt: "Which wrapper is least tied to day-to-day U.S. gas prices?", options: ["A gas futures fund", "A gas producer", "An LNG exporter with long-term fixed-fee contracts", "A front-month gas contract"], answer: 2, why: "Fixed fees on contracted capacity make earnings depend more on volumes than spot prices. Check the actual contract mix." },
    { id: "en-d4", prompt: "USO tracks…", options: ["Brent futures", "WTI futures", "Oil company stocks", "Gasoline at the pump"], answer: 1, why: "USO holds WTI futures; BNO holds Brent futures." },
    { id: "en-d5", prompt: "When is EIA's weekly crude inventory report usually released?", options: ["Monday 8 a.m.", "Wednesday 10:30 a.m. ET", "Friday after the close", "Monthly"], answer: 1, why: "Holidays can shift it (it moved to Thursday in a November 2026 holiday week)." },
  ],
  caveats: [
    { title: "Headlines hit businesses differently", text: "Ask which segment earns from the move before buying \"energy\"." },
    { title: "Futures funds are short-horizon tools", text: "Their objectives track near-month contracts daily; long holds pay the curve." },
    { title: "Concentration", text: "Energy stock funds can be dominated by a few giants; check current weights." },
    { title: "Hedges and contracts lag", text: "Producers' hedges and exporters' contracts delay how price changes reach earnings." },
  ],
  sources: [
    { label: "EIA: What drives crude oil prices", url: "https://www.eia.gov/finance/markets/crudeoil/", supports: "Supply, demand, inventories and financial markets as oil drivers" },
    { label: "EIA: Weekly Petroleum Status Report", url: "https://www.eia.gov/petroleum/supply/weekly/", supports: "Weekly inventories; 10:30 a.m. release; holiday schedule" },
    { label: "EIA: Weekly Natural Gas Storage Report", url: "https://ir.eia.gov/ngs/ngs.html", supports: "Working gas vs year ago and the five-year average" },
    { label: "EIA: Factors affecting natural gas prices", url: "https://www.eia.gov/energyexplained/natural-gas/factors-affecting-natural-gas-prices.php", supports: "Supply and demand factors; storage season April–October" },
    { label: "EIA: 3:2:1 crack spread", url: "https://www.eia.gov/todayinenergy/includes/CrackSpread_Explain.php", supports: "Crack spread formula" },
    { label: "USCF: United States Natural Gas Fund (UNG)", url: "https://www.uscfinvestments.com/ung", supports: "Near-month Henry Hub benchmark; 1-for-4 reverse split on Jan 23, 2024" },
    { label: "USCF: United States Oil Fund (USO)", url: "https://www.uscfinvestments.com/uso", supports: "WTI futures fund structure" },
    { label: "FINRA: Futures and commodities", url: "https://www.finra.org/investors/investing/investment-products/futures-and-commodities", supports: "Commodity funds vs producer stocks" },
  ],
  links: [
    { label: "Learn → Energy: Oil, Gas & the Companies", to: "/training?group=energy" },
    { label: "Coach → Oil and gas, which wrapper", to: "/coach/energy-wrappers" },
    { label: "Coach → Crude supply shock (futures)", to: "/coach/futures-crude-supply" },
    { label: "Practice → Same theme, different wrapper", to: "/practice/exposure-wrappers" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  simulations: THEME_SIMS["energy"],
  mode: "energy_theme",
  modeLabel: "Energy: which business earns from it",
  modeTip:
    "Before reacting to an oil or gas headline, name the business: producers earn the commodity price, refiners the crack spread, exporters their contracts, futures funds the rolled curve. Then check whether your thesis (weather, storage, supply) still holds. Cases → Market-wide news.",
  questions: [
    mc("EN-01", "A barrel of oil holds how many U.S. gallons?", "B", "42", ["24", "55", "100"], "EIA uses 42 gallons in the crack spread formula.", "crack-spread"),
    mc("EN-02", "The 3:2:1 crack spread compares…", "A", "Two barrels of gasoline plus one of distillate with three barrels of crude", ["Three oil stocks with two gas stocks", "Spot vs futures crude", "Brent vs WTI"], "A refining-margin indicator (EIA).", "crack-spread"),
    mc("EN-03", `Gasoline $${EN_EX.gasoline}/gal, distillate $${EN_EX.distillate}/gal, crude ${usd(EN_EX.crude, 0)}. Crack spread?`, "C", `${usd(EN_CRACK)}/bbl`, [`${usd(EN_EX.crude, 0)}/bbl`, "$5.10/bbl", "$0"], "(2 × 2.40 × 42 + 2.70 × 42 − 3 × 75) ÷ 3.", "crack-spread"),
    mc("EN-04", "Crude rises while fuel prices hold. A refiner's crack spread…", "D", "Narrows", ["Widens", "Is unchanged", "Turns into a dividend"], "Input up, output flat.", "crack-spread"),
    mc("EN-05", "Which benchmark is delivered at Cushing, Oklahoma?", "A", "WTI", ["Brent", "Henry Hub", "Dubai"], "Brent is the North Sea benchmark; Henry Hub is natural gas.", "wti-vs-brent"),
    mc("EN-06", "EIA's Weekly Petroleum Status Report is usually released…", "B", "Wednesdays at 10:30 a.m. Eastern", ["Daily at midnight", "Quarterly", "Only during OPEC meetings"], "Federal holidays can shift it by a day or more.", "eia-petroleum-status-report"),
    mc("EN-07", "U.S. gas storage usually builds in which months?", "C", "April through October", ["November through March", "Only in December", "It never changes"], "EIA: withdrawals typically run November–March.", "natural-gas-storage-report"),
    mc("EN-08", "Which is NOT one of EIA's major natural gas demand factors?", "D", "The gold price", ["Winter and summer weather", "Economic growth", "Prices of other fuels"], "EIA lists weather, growth and other fuels on the demand side.", "natural-gas-storage-report"),
    mc("EN-09", "UNG's benchmark futures contract is…", "A", "The near-month NYMEX Henry Hub contract (next month within two weeks of expiry)", ["A ten-year contract", "A basket of gas stocks", "Physical gas in tanks"], "Per USCF's fund page.", "commodity-pool"),
    mc("EN-10", "A reverse split after years of losses…", "B", "Raises the price per share without changing the value of your holding", ["Doubles your money", "Ends the roll cost", "Converts the fund to stock"], "UNG did a 1-for-4 reverse split on January 23, 2024.", "reverse-split"),
    mc("EN-11", "Midstream companies mostly earn from…", "C", "Moving and storing oil and gas, often for fees", ["Drilling wells", "Selling gasoline at stations", "Mining gold"], "Upstream produces, downstream refines and sells.", "upstream-midstream-downstream"),
    mc("EN-12", "Why can an LNG exporter shrug off a drop in U.S. gas prices?", "D", "Long-term contracts with fixed fees can make earnings depend more on volumes", ["It holds gas futures", "It is a bullion trust", "Gas prices do not affect anyone"], "Check the company's actual contract mix.", "lng-exporter"),
    mc("EN-13", "An integrated major's shares usually move…", "A", "Less than a pure producer's when crude swings, because refining and chemicals offset part of it", ["Exactly with crude", "Opposite to crude always", "Only with gold"], "Several segments blend the exposure.", "upstream-midstream-downstream"),
    mc("EN-14", "Storage is 3,900 Bcf vs a 3,700 Bcf five-year average. That is about…", "B", `${EN_STORAGE.toFixed(1)}% above`, ["5.4% below", "200% above", "Exactly average"], "(3,900 − 3,700) ÷ 3,700.", "natural-gas-storage-report"),
  ],
  terms: TERMS,
  cases: CASES,
};

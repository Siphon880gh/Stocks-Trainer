/**
 * MK5 · Materials, chemicals and resins (/practice/materials-chemicals): resin (plastics) makers Dow, LyondellBasell,
 * Westlake and Eastman, how feedstock (ethane vs oil-linked naphtha), demand and new capacity set their margins, and
 * what the materials sector fund (XLB) actually holds. Resins are a new theme here, not one of Market Forces' themes.
 * Sources: EIA, State Street (XLB holdings), S&P Dow Jones Indices, Westlake. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { mc, pct, r2, seededTape } from "./helpers";

/** Feedstock cost per pound of product, ignoring co-product credits: feedstock price ÷ yield. */
export const feedstockCostPerLb = (feedstockPerLb: number, yieldPct: number) => r2(feedstockPerLb / (yieldPct / 100));
/** Simple resin margin per pound: resin price − feedstock cost per pound. */
export const resinSpread = (resinPerLb: number, feedstockCost: number) => r2(resinPerLb - feedstockCost);
/** Operating rate: demand ÷ capacity, in %. */
export const operatingRatePct = (demand: number, capacity: number) => r2((demand / capacity) * 100);

/** XLB weights from State Street's daily holdings file, as of Nov 11, 2026 (rounded). */
export const XLB_AS_OF = "2026-11-11";
export const XLB_WEIGHTS = { linde: 13.1, chemicalsIndustry: 46.8, dow: 3.5, lyb: 2.4 } as const;
/** Illustrative numbers only (not market data). */
export const MAT_EX = { ethane: 0.2, ethaneYield: 80, resin: 0.6, resinLow: 0.48, demand: 90, capacity: 100, newCapacity: 10 } as const;
export const MAT_FEED = feedstockCostPerLb(MAT_EX.ethane, MAT_EX.ethaneYield);
export const MAT_SPREAD = resinSpread(MAT_EX.resin, MAT_FEED);
export const MAT_SPREAD_LOW = resinSpread(MAT_EX.resinLow, MAT_FEED);
export const MAT_RATE = operatingRatePct(MAT_EX.demand, MAT_EX.capacity);
export const MAT_RATE_NEW = operatingRatePct(MAT_EX.demand, MAT_EX.capacity + MAT_EX.newCapacity);

const TERMS: LiteracyTerm[] = [
  { id: "resin-producer", name: "Resin producer", category: "markets", summary: "A chemical company that turns feedstocks like ethane or naphtha into plastics such as polyethylene and PVC.", detail: "Its profit is mostly the spread between resin prices and feedstock and energy costs, which swings with demand and industry capacity. Dow, LyondellBasell and Westlake are large U.S.-listed examples; Eastman leans more to specialty materials. Educational, not advice." },
  { id: "ethane-cracker", name: "Ethane cracker", category: "markets", summary: "A plant that heats ethane with steam to break it into ethylene, the building block of polyethylene.", detail: "EIA: cracking ethane can yield more than 80% ethylene versus as little as 30% from naphtha, and U.S. ethane prices track natural gas rather than crude. That has given U.S. crackers a cost edge over oil-linked naphtha crackers. Educational, not advice." },
  { id: "naphtha", name: "Naphtha", category: "markets", summary: "An oil-derived liquid used as a petrochemical feedstock, common in European and Asian crackers.", detail: "Its price follows crude oil, so when oil rises relative to natural gas, naphtha-based producers' costs rise faster than U.S. ethane-based producers'. It also yields valuable co-products like propylene. Educational, not advice." },
  { id: "operating-rate", name: "Operating rate (utilization)", category: "markets", summary: "Production as a share of capacity. High rates usually mean pricing power; low rates mean price competition.", detail: "New plants add capacity in big steps; if demand does not keep up, operating rates and margins fall across the industry. Educational, not advice." },
  { id: "specialty-vs-commodity-chemicals", name: "Specialty vs commodity chemicals", category: "markets", summary: "Commodity chemicals compete mostly on price and swing with the cycle; specialty chemicals sell on performance and tend to have steadier margins.", detail: "A materials fund can hold both, plus industrial gases, miners, paints and packaging, so it is not a pure play on any one cycle. Educational, not advice." },
];

const T1 = seededTape({ seed: 9701, start: 38.4, preDrift: 0.001, postDrift: -0.006, vol: 0.02, gap: -0.07 });
const T2 = seededTape({ seed: 9702, start: 90.6, preDrift: 0.002, postDrift: 0.002, vol: 0.012 });
const T3 = seededTape({ seed: 9703, start: 61.7, preDrift: -0.003, postDrift: 0.003, vol: 0.022, gap: 0.05 });

const CASES: CaseStudy[] = [
  {
    id: "case-mat-new-capacity-margin-squeeze",
    title: "Materials: new plants come online and resin prices slide",
    contextType: "news",
    thinkingMode: "materials_chemicals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical resin maker. You bought it because \"oil is up, plastics are oil, so plastics makers win\". Now several large polyethylene plants start up abroad while demand is flat; industry operating rates slip from about ${pct(MAT_RATE, 0)} toward ${pct(MAT_RATE_NEW, 0)} and resin prices fall. The company cuts guidance; the stock gaps down 7%. Buy = add on the dip. Sell = exit; the thesis missed the capacity cycle. Hold = keep it.`,
    newsHeadline: "Resin maker cuts outlook as new capacity weighs on polyethylene prices.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `A resin maker earns a spread, not the oil price. With feedstock near $${MAT_FEED}/lb of ethylene, resin falling from $${MAT_EX.resin} to $${MAT_EX.resinLow}/lb cuts a simple spread from $${MAT_SPREAD} to $${MAT_SPREAD_LOW}. New capacity drives that. Holding is partial credit only with a view on when the cycle turns, sized for a long wait.`,
      whyMarketMoved: "More capacity than demand pushes operating rates and resin prices down across the industry.",
      evidence: "SAMPLE: the stock kept drifting lower over the next four sessions.",
    },
  },
  {
    id: "case-mat-xlb-not-a-resin-fund",
    title: "Materials: you bought XLB as a resin play",
    contextType: "news",
    thinkingMode: "materials_chemicals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. You bought the materials sector fund (XLB) to bet on a recovery in plastics prices. Reading the holdings, the largest position is an industrial-gas company (about ${XLB_WEIGHTS.linde}%); Dow and LyondellBasell are about ${XLB_WEIGHTS.dow}% and ${XLB_WEIGHTS.lyb}% (as of ${XLB_AS_OF}), and Westlake and Eastman are not held. Buy = add more XLB for the plastics view. Sell = switch to a wrapper that matches the thesis (individual resin makers, sized and diversified) or drop the thesis. Hold = keep XLB for the plastics view.`,
    newsHeadline: "Resin prices tick up; materials sector little changed.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "Read what you own before you rely on it. XLB holds S&P 500 materials companies: industrial gases, gold and copper miners, aggregates, paints, packaging and some chemicals. Resin makers are a small slice. Holding is partial credit if you are happy to own the broad sector for other reasons; adding more doubles down on a mismatch.",
      whyMarketMoved: "A small move in resin prices barely touches a fund where resin makers are a few percent.",
      evidence: "SAMPLE: XLB drifted with the market over the next four sessions. State Street publishes XLB's daily holdings.",
    },
  },
  {
    id: "case-mat-oil-spikes-ethane-edge",
    title: "Materials: oil jumps, gas stays cheap",
    contextType: "news",
    thinkingMode: "materials_chemicals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical U.S. resin maker that cracks ethane. Crude jumps on a supply shock while U.S. natural gas stays low. Global polyethylene prices firm because naphtha-based producers in Europe and Asia face higher costs. The U.S. maker gaps up 5%; you hold a planned, half-size position with a stop. Buy = double at the open. Sell = take the gap and exit. Hold = keep the planned size and stop.",
    newsHeadline: "Oil spike lifts naphtha costs abroad; U.S. ethane crackers gain.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "EIA explains why: U.S. ethane tracks natural gas, naphtha tracks crude, and ethane yields far more ethylene. When oil rises faster than gas, U.S. crackers' edge widens. Your plan already covers this; holding keeps it. Exiting is partial credit. Doubling at a gap changes your risk on one day's news.",
      whyMarketMoved: "Higher oil raised competitors' feedstock costs while U.S. ethane stayed cheap.",
      evidence: "SAMPLE: the stock drifted higher over the next four sessions.",
    },
  },
];

export const MATERIALS_CHEMICALS: MarketTheme = {
  id: "materials-chemicals",
  route: "/practice/materials-chemicals",
  practiceTitle: "Materials, chemicals and resins: Dow, LyondellBasell, Westlake, Eastman",
  title: "Materials, chemicals and resins",
  blurb:
    "Resin (plastics) makers as a research theme: feedstock, demand and capacity set the spread they earn, and the materials sector fund holds much more than plastics. A new theme here, not one of Market Forces' themes. Educational, not advice.",
  marketForces:
    "Market Forces lists Materials (XLB) but no resin theme; resin makers are a new theme added in this app only. The tickers were checked on Nov 11–12, 2026: DOW, LYB, WLK and EMN all trade on the NYSE.",
  asOf: "2026-11-12",
  quiz: {
    name: "Materials, Chemicals & Resins",
    description:
      "Resin producers and the spread they earn; ethane vs naphtha feedstock and the U.S. cost edge; ethylene yields; demand, new capacity and operating rates; specialty vs commodity chemicals; what XLB holds; Dow, LyondellBasell, Westlake and Eastman as examples, not recommendations",
    icon: "science",
  },
  intro: [
    "Plastics start as feedstocks: ethane from natural gas in the U.S., or naphtha from oil in much of Europe and Asia. Crackers turn them into ethylene and propylene; resin plants turn those into polyethylene, polypropylene and PVC for packaging, pipes and building products.",
    "\"Plastics are oil, so plastics makers rise with oil\" is a common mistake. A resin maker earns the spread between resin prices and its costs, and that spread is set by feedstock, demand and how much capacity the industry has built.",
  ],
  wrappers: [
    { name: "Large commodity resin makers", examples: "DOW (Dow Inc.) · LYB (LyondellBasell)", owns: "Crackers and polymer plants on several continents", tracks: "Resin and chemical spreads through the cycle", watch: "Capacity cycle, feedstock mix by region, dividend coverage in downturns" },
    { name: "Vinyls and building products", examples: "WLK (Westlake; renamed from Westlake Chemical in 2022)", owns: "Ethylene, PVC and chlor-alkali plants plus housing products", tracks: "PVC and caustic soda spreads, housing and construction", watch: "Housing cycle; plant closures and restructuring" },
    { name: "Specialty materials", examples: "EMN (Eastman; moved from the S&P 500 to the SmallCap 600 in Nov 2025)", owns: "Specialty plastics, additives and fibers", tracks: "Steadier, performance-based margins", watch: "End markets (autos, construction, consumer), volumes" },
    { name: "Materials sector fund", examples: "XLB", owns: "S&P 500 materials companies", tracks: "Industrial gases, miners, aggregates, paints, packaging and chemicals", watch: `Resin makers are a small slice (Dow ≈ ${XLB_WEIGHTS.dow}%, LYB ≈ ${XLB_WEIGHTS.lyb}% as of ${XLB_AS_OF}); WLK and EMN are not held` },
  ],
  drivers: [
    { title: "Feedstock: ethane vs naphtha", text: "EIA: U.S. ethane prices follow natural gas, naphtha follows crude; ethane can yield more than 80% ethylene vs as little as 30% from naphtha. When oil rises faster than gas, U.S. crackers' edge widens." },
    { title: "Demand", text: "Packaging, construction, autos and consumer goods drive volumes. Destocking by customers can cut orders even when end demand is fine." },
    { title: "Capacity", text: "Crackers and polymer plants are huge and arrive in steps. When new capacity outruns demand, operating rates and margins fall industry-wide." },
    { title: "Exports and trade", text: "EIA reports record U.S. ethane exports in 2024 (China took 46%), so cheap U.S. feedstock also supplies foreign crackers." },
    { title: "Energy and regulation", text: "Power costs, emissions rules and plant closures (especially in Europe) change who can compete." },
  ],
  bridges: [
    { title: "Oil and gas", text: "Crude sets naphtha costs; natural gas sets U.S. ethane costs. See Energy." },
    { title: "Economic growth and slowdown", text: "Commodity chemicals are cyclical: volumes and spreads fall in slowdowns." },
    { title: "Housing and rates", text: "PVC pipe and siding follow construction, which follows mortgage rates." },
    { title: "Sectors", text: "Materials is one of 11 sectors; see Sectors and sector rotation." },
  ],
  math: {
    title: "Feedstock, spread and utilization",
    rows: [
      { label: "Feedstock per lb of ethylene", formula: "feedstock price ÷ yield", example: `$${MAT_EX.ethane}/lb ethane at ${MAT_EX.ethaneYield}% yield ≈ $${MAT_FEED}/lb` },
      { label: "Simple resin spread", formula: "resin price − feedstock cost", example: `$${MAT_EX.resin} − $${MAT_FEED} = $${MAT_SPREAD}/lb; at $${MAT_EX.resinLow}: $${MAT_SPREAD_LOW}` },
      { label: "Operating rate", formula: "demand ÷ capacity", example: `${MAT_EX.demand} ÷ ${MAT_EX.capacity} = ${pct(MAT_RATE, 0)}; with +${MAT_EX.newCapacity} capacity: ${pct(MAT_RATE_NEW, 1)}` },
    ],
    note: "Illustrative numbers; real spreads include energy, other costs and co-product credits (naphtha cracking yields valuable co-products).",
  },
  calculator: {
    title: "Try it: resin spread and operating rate",
    inputs: [
      { id: "feed", label: "Feedstock price ($/lb)", value: MAT_EX.ethane, step: 0.01 },
      { id: "yield", label: "Ethylene yield (%)", value: MAT_EX.ethaneYield, step: 5 },
      { id: "resin", label: "Resin price ($/lb)", value: MAT_EX.resin, step: 0.01 },
      { id: "demand", label: "Industry demand (units)", value: MAT_EX.demand, step: 1 },
      { id: "capacity", label: "Industry capacity (units)", value: MAT_EX.capacity + MAT_EX.newCapacity, step: 1 },
    ],
    compute: (v) => {
      const y = v.yield ?? 0;
      const feed = y > 0 ? feedstockCostPerLb(v.feed ?? 0, y) : NaN;
      return [
        { label: "Feedstock per lb of ethylene", value: Number.isFinite(feed) ? `$${feed}` : "—" },
        { label: "Simple spread per lb", value: Number.isFinite(feed) ? `$${resinSpread(v.resin ?? 0, feed)}` : "—" },
        { label: "Operating rate", value: (v.capacity ?? 0) > 0 ? pct(operatingRatePct(v.demand ?? 0, v.capacity ?? 0), 1) : "—" },
      ];
    },
    note: "Try a naphtha-style yield (30%) to see why co-product credits matter for naphtha crackers.",
  },
  drills: [
    { id: "mat-d1", prompt: "Oil rises 20% while U.S. natural gas is flat. Whose feedstock costs rise most?", options: ["U.S. ethane crackers", "Naphtha-based crackers", "Gold miners", "Bond funds"], answer: 1, why: "Naphtha follows crude; U.S. ethane follows gas (EIA)." },
    { id: "mat-d2", prompt: "New capacity lifts industry capacity from 100 to 110 with demand flat at 90. Operating rate?", options: ["90% → 81.8%", "90% → 99%", "Unchanged", "100%"], answer: 0, why: "90 ÷ 110 ≈ 81.8%. Lower utilization usually means weaker pricing." },
    { id: "mat-d3", prompt: "XLB's largest holding as of Nov 2026 was…", options: ["Dow", "An industrial-gas company (Linde)", "Westlake", "Eastman"], answer: 1, why: "XLB is broad materials, not a resin fund." },
    { id: "mat-d4", prompt: "\"Plastics are oil, so plastics makers rise with oil.\" Best response?", options: ["Correct", "They earn a spread; oil can squeeze or widen it depending on feedstock and resin prices", "Plastics have nothing to do with oil", "They track gold"], answer: 1, why: "The spread, capacity and demand matter more than the oil headline." },
    { id: "mat-d5", prompt: "Which company leans most toward specialty materials?", options: ["Eastman", "LyondellBasell", "Westlake", "Dow"], answer: 0, why: "Eastman describes itself as a specialty materials company; the others lean more to commodity resins and vinyls." },
  ],
  caveats: [
    { title: "A new theme", text: "Resins are not one of Market Forces' themes; the tickers here were checked for this lesson and are examples, not recommendations." },
    { title: "Cycles are long", text: "Capacity waves can depress margins for years; dividends can be cut in deep troughs." },
    { title: "Regions differ", text: "The same company can have cheap U.S. plants and costly European ones." },
    { title: "Funds are broad", text: "Check holdings before using a sector fund for a narrow thesis." },
  ],
  sources: [
    { label: "EIA: This Week in Petroleum, Mar 23, 2022 (ethane vs naphtha)", url: "https://www.eia.gov/petroleum/weekly/archive/2022/220323/includes/analysis_print.php", supports: "Ethane tracks gas, naphtha tracks crude; >80% vs ~30% ethylene yields; ethylene used for plastics and resins" },
    { label: "EIA: U.S. ethane production, consumption and exports set records in 2024", url: "https://www.eia.gov/todayinenergy/detail.php?id=64785", supports: "Ethane used almost only for crackers; record exports; China 46%" },
    { label: "State Street: Materials Select Sector SPDR (XLB)", url: "https://www.ssga.com/us/en/intermediary/etfs/state-street-materials-select-sector-spdr-etf-xlb", supports: "Industries covered; top holdings and industry weights (Nov 2026)" },
    { label: "S&P Dow Jones Indices: index changes announced Oct 27, 2025", url: "https://press.spglobal.com/2025-10-27-Solstice-Advance-Materials-and-Qnity-Electronics-Set-to-Join-S-P-500-Others-to-Join-S-P-SmallCap-600", supports: "Eastman moved from the S&P 500 to the S&P SmallCap 600" },
    { label: "SEC EDGAR: Westlake certificate of amendment (Feb 18, 2022)", url: "https://www.sec.gov/Archives/edgar/data/1262823/000119312522046627/d270059dex31.htm", supports: "Westlake Chemical Corporation renamed Westlake Corporation" },
  ],
  links: [
    { label: "Learn → Materials, Chemicals & Resins", to: "/training?group=materials-chemicals" },
    { label: "Coach → Resin makers and the spread", to: "/coach/materials-resins" },
    { label: "Practice → Energy", to: "/practice/energy" },
    { label: "Practice → Same theme, different wrapper", to: "/practice/exposure-wrappers" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "materials_chemicals",
  modeLabel: "Chemicals: the spread, not the headline",
  modeTip:
    "For a chemicals or resin headline, ask what it does to the spread: feedstock cost (ethane follows gas, naphtha follows oil), resin prices, and industry capacity versus demand. Then check whether your wrapper even holds resin makers. Cases → Market-wide news.",
  questions: [
    mc("MAT-01", "A resin producer's profit mostly depends on…", "B", "The spread between resin prices and feedstock and energy costs", ["The oil price alone", "The gold price", "Interest on its cash"], "Feedstock, demand and capacity set that spread.", "resin-producer"),
    mc("MAT-02", "U.S. ethane prices are associated more with…", "A", "Natural gas", ["Crude oil", "Gold", "Copper"], "EIA: ethane tracks gas; naphtha tracks crude.", "ethane-cracker"),
    mc("MAT-03", "Cracking ethane can yield about how much ethylene, per EIA?", "C", "More than 80%", ["About 10%", "About 30%", "Exactly 50%"], "Naphtha can yield as little as 30%.", "ethane-cracker"),
    mc("MAT-04", "Naphtha's price mostly follows…", "D", "Crude oil", ["Natural gas", "Interest rates", "The dollar index only"], "It is an oil-derived liquid.", "naphtha"),
    mc("MAT-05", "Oil rises faster than natural gas. U.S. ethane crackers' cost edge…", "B", "Widens", ["Shrinks", "Disappears", "Is unrelated"], "Competitors on naphtha pay more; U.S. ethane stays tied to gas.", "naphtha"),
    mc("MAT-06", "Demand 90, capacity 110. Operating rate?", "A", pct(MAT_RATE_NEW, 1), ["90%", "110%", "122.2%"], "Demand ÷ capacity: 90 ÷ 110.", "operating-rate"),
    mc("MAT-07", "Large new plants starting up with flat demand usually…", "C", "Lower operating rates and resin prices", ["Raise prices", "Have no effect", "Lower oil prices"], "Capacity cycles drive margins.", "operating-rate"),
    mc("MAT-08", "As of Nov 2026, which two of these were NOT held in XLB?", "D", "Westlake and Eastman", ["Dow and LyondellBasell", "Linde and Newmont", "Vulcan and Nucor"], "XLB holds S&P 500 materials stocks; Eastman moved to the SmallCap 600 in Nov 2025.", "sector-rotation"),
    mc("MAT-09", "Which industry was the largest weight in XLB (Nov 2026)?", "B", "Chemicals (about 47%), led by industrial gases", ["Gold miners only", "Oil producers", "Banks"], "Plus metals and mining, packaging and construction materials.", "specialty-vs-commodity-chemicals"),
    mc("MAT-10", "Specialty chemicals differ from commodity chemicals because they…", "A", "Sell on performance and tend to have steadier margins", ["Never fall", "Track oil one-for-one", "Are bonds"], "Commodity chemicals compete mostly on price.", "specialty-vs-commodity-chemicals"),
    mc("MAT-11", "Westlake's ticker after its 2022 name change is…", "C", "WLK", ["WCC", "WEST", "WL"], "Renamed from Westlake Chemical; ticker unchanged.", "resin-producer"),
    mc("MAT-12", "Is \"resins\" one of Market Forces' themes?", "D", "No; it is a new theme added in this app", ["Yes, its own theme", "Yes, under Gold", "Yes, under Bonds"], "Market Forces has Materials (XLB); the resin lesson is new here.", "resin-producer"),
  ],
  terms: TERMS,
  cases: CASES,
};

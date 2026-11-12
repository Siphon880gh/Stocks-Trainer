/**
 * MK1 · Precious metals (/practice/precious-metals): gold and silver as themes. What moves the metals (real yields,
 * the dollar, central-bank buying, risk mood; silver's industrial half), how bullion trusts, miners, miner funds and
 * streamers differ, AISC margins and the gold/silver ratio. Complements the futures gold cases (no contract mechanics here).
 * Sources: World Gold Council, Silver Institute, FRED, FINRA, Barrick. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { mc, pct, r2, seededTape, usd } from "./helpers";

/** Margin per ounce over all-in sustaining cost. */
export const aiscMargin = (price: number, aisc: number) => r2(price - aisc);
/** % change in AISC margin when the metal moves `movePct` and AISC stays put. */
export function aiscMarginChangePct(price: number, aisc: number, movePct: number): number {
  const before = price - aisc;
  return r2(((price * (1 + movePct / 100) - aisc - before) / before) * 100);
}
/** Ounces of silver one ounce of gold buys. */
export const goldSilverRatio = (gold: number, silver: number) => r2(gold / silver);
/** Metal per share left after `years` of a yearly fee taken from the metal (starting at 1). */
export const metalPerShareAfter = (feePct: number, years: number) => Math.round(Math.pow(1 - feePct / 100, years) * 1000) / 1000;

/** Illustrative numbers only (not market data). */
export const PM_EX = { gold: 2400, aisc: 1450, move: -10, silver: 30, fee: 0.4, years: 10 } as const;
export const PM_MARGIN = aiscMargin(PM_EX.gold, PM_EX.aisc);
export const PM_MARGIN_DOWN = aiscMarginChangePct(PM_EX.gold, PM_EX.aisc, PM_EX.move);
export const PM_RATIO = goldSilverRatio(PM_EX.gold, PM_EX.silver);
export const PM_LEFT = metalPerShareAfter(PM_EX.fee, PM_EX.years);

const TERMS: LiteracyTerm[] = [
  { id: "all-in-sustaining-cost", name: "All-in sustaining cost (AISC)", category: "markets", summary: "A miner's full cost to keep producing an ounce: operating costs plus sustaining capital, overhead and reclamation.", detail: "The World Gold Council's guidance note (first issued in 2013) defines it. It leaves out new-mine construction, financing and taxes, so a company's true break-even is higher. Price minus AISC is a rough margin per ounce. Educational, not advice." },
  { id: "gold-silver-ratio", name: "Gold/silver ratio", category: "markets", summary: "How many ounces of silver one ounce of gold buys: gold price ÷ silver price.", detail: "Traders watch it for relative value, but it has no fixed \"normal\" level and can stay stretched for years. It says nothing about whether either metal is cheap. Educational, not advice." },
  { id: "central-bank-gold-buying", name: "Central-bank gold buying", category: "markets", summary: "Net purchases of gold by central banks and other official institutions for their reserves.", detail: "The World Gold Council estimates official buying topped 1,000 tonnes a year in 2022, 2023 and 2024 (1,044.6t in 2024), far above the 2010–2021 average of 473t. Disclosures lag and some buyers do not report. Educational, not advice." },
  { id: "silver-industrial-demand", name: "Silver industrial demand", category: "markets", summary: "Silver used in electronics, solar panels, electric vehicles and other products, as opposed to coins, bars and jewelry.", detail: "The Silver Institute's World Silver Survey 2025 put 2024 industrial demand at a record 680.5 million ounces, more than half of total demand (about 1.16 billion ounces). That ties silver to manufacturing cycles as well as to gold. Educational, not advice." },
  { id: "streaming-royalty-company", name: "Streaming and royalty company", category: "ownership", summary: "A company that pays a miner up front for a share of future metal or revenue, instead of running mines itself.", detail: "It avoids most operating-cost swings but still depends on the mines it finances, metal prices and its own deal terms. Not the same exposure as bullion or as an operator. Educational, not advice." },
  { id: "safe-haven-demand", name: "Safe-haven demand", category: "markets", summary: "Buying an asset because investors expect it to hold value when markets or politics are stressed.", detail: "Gold often gets this demand, but not every time: in a dash for cash it can fall with everything else. Treat \"haven\" as a tendency, not a guarantee. Educational, not advice." },
];

const T1 = seededTape({ seed: 9301, start: 38.6, preDrift: 0.003, postDrift: -0.007, vol: 0.022, gap: -0.06 });
const T2 = seededTape({ seed: 9302, start: 27.4, preDrift: -0.002, postDrift: 0.004, vol: 0.028, gap: 0.05 });
const T3 = seededTape({ seed: 9303, start: 61.2, preDrift: 0.001, postDrift: 0.002, vol: 0.012 });

const CASES: CaseStudy[] = [
  {
    id: "case-pm-gold-falls-miner-falls-harder",
    title: "Precious metals: gold dips 4%, the miner fund drops 10%",
    contextType: "news",
    thinkingMode: "precious_metals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You hold a gold miner fund sized as if it were bullion. A hot inflation print lifts real yields, gold falls about 4% and the miner fund gaps down about 6%, on its way to roughly −10% for the week. Your plan said \"gold exposure, at most a 15% drawdown\". Buy = add now that it is cheaper. Sell = cut to the size your plan allows for a fund that swings more than gold. Hold = keep it all.",
    newsHeadline: "Real yields jump after inflation surprise; gold slips, miners slide further.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `Miners are operating leverage on the metal: with gold at ${usd(PM_EX.gold, 0)} and AISC at ${usd(PM_EX.aisc, 0)}, a 10% gold fall cuts the margin per ounce by ${pct(Math.abs(PM_MARGIN_DOWN), 0)}. You sized the fund like bullion, so the position is too big for its real swing. Cutting to plan size fixes the mismatch. Holding is partial credit only if you re-size on purpose, not by hope.`,
      whyMarketMoved: "Higher real yields raise the cost of holding a metal that pays no interest, and miner profits fall faster than the metal.",
      evidence: "SAMPLE: the fund kept sliding over the next four sessions. The World Gold Council defines AISC; the margin math is on the lesson page.",
    },
  },
  {
    id: "case-pm-silver-industrial-headline",
    title: "Precious metals: silver jumps on a solar demand report",
    contextType: "news",
    thinkingMode: "precious_metals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. A silver bullion trust gaps up 5% after a report says solar panel makers will use more silver next year. You had a plan to buy a small silver position on a pullback toward a level well below today's open. Buy = buy at the open. Sell = nothing to sell; stay out. Hold = keep waiting for your planned level.",
    newsHeadline: "Report: solar demand to lift silver use again; silver jumps at the open.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "More than half of silver demand is industrial (Silver Institute), so solar news is a real driver, but one report rarely changes the yearly balance. Chasing a 5% gap abandons the plan you made when calm. Waiting keeps your entry and size. Staying out entirely is partial credit: safe, but the plan already said how to buy.",
      whyMarketMoved: "Traders priced in a stronger industrial demand outlook within minutes of the report.",
      evidence: "SAMPLE: silver held most of the gap and drifted higher; the planned pullback did not come in the next four sessions. Missing a trade is the cost of discipline.",
    },
  },
  {
    id: "case-pm-trust-fee-switch",
    title: "Precious metals: two gold trusts, two fees",
    contextType: "news",
    thinkingMode: "precious_metals",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. You hold a gold trust with a ${PM_EX.fee}% yearly fee for a ten-year plan. A similar physically backed trust charges much less and trades with a tight spread. Switching in a taxable account would realize a gain. Buy = add new money to the lower-fee trust and keep the old one. Sell = sell the old trust today regardless of taxes. Hold = change nothing.`,
    newsHeadline: "Issuers cut gold trust fees as competition grows.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `Both trusts hold bullion, so the exposure is the same; the fee is the difference. At ${PM_EX.fee}% a year, ${PM_EX.years} years leaves about ${PM_LEFT} ounce per starting ounce. Sending new money to the cheaper trust lowers the average fee without forcing a taxable sale. Holding is partial credit: nothing breaks, but the fee keeps compounding. Selling regardless of taxes ignores a real cost.`,
      whyMarketMoved: "Nothing about gold changed; this is a cost decision, not a market call.",
      evidence: "SAMPLE: gold kept drifting with the market over the next four sessions. FINRA reminds investors to compare expenses and trading costs among similar funds.",
    },
  },
];

export const PRECIOUS_METALS: MarketTheme = {
  id: "precious-metals",
  route: "/practice/precious-metals",
  practiceTitle: "Precious metals: gold, silver and the miners",
  title: "Precious metals: gold, silver and the miners",
  blurb:
    "Gold and silver as research themes: what moves each metal, and why a bullion trust, a miner, a miner fund and a streamer can disagree in the same week. Educational, not advice.",
  marketForces:
    "Market Forces lists Gold (GLD, IAU, GDX, NEM, B) and Silver (SLV, SIVR, SIL, PAAS). This lesson explains the forces behind them; the futures cases already cover the gold contract itself.",
  asOf: "2026-11-12",
  quiz: {
    name: "Precious Metals: Gold, Silver & Miners",
    description:
      "Real yields, the dollar, central-bank buying and safe-haven demand for gold; silver's industrial half; bullion trusts vs miners vs miner funds vs streamers; AISC margins and operating leverage; trust fees over time; and the gold/silver ratio",
    icon: "diamond",
  },
  intro: [
    "Gold pays no interest and has little industrial use, so its price leans on what investors and central banks are willing to hold. Silver is half precious metal and half industrial input, so it also follows factories and solar installations.",
    "The futures lesson already covers the gold contract. Here the question is different: which stock-market wrapper fits a metals view, and what else moves each one?",
  ],
  wrappers: [
    { name: "Bullion trust", examples: "Gold: GLD, IAU · Silver: SLV, SIVR", owns: "Vaulted bars", tracks: "Spot metal minus the fee", watch: "Fee and spread; metal per share shrinks a little each year; collectibles tax rules can apply to gains" },
    { name: "Single miner", examples: "Gold: NEM, B (Barrick, NYSE ticker B since May 2025) · Silver: PAAS", owns: "One mining business", tracks: "Metal price minus that company's costs, plus its own decisions", watch: "AISC, output guidance, debt, mine accidents, country risk, hedging" },
    { name: "Miner fund", examples: "Gold miners: GDX · Silver miners: SIL", owns: "A basket of miners", tracks: "Miner profits, weighted by the index", watch: "Swings more than the metal both ways; still falls with stocks in a selloff" },
    { name: "Streaming / royalty company", examples: "Look up streamers in a sector screen", owns: "Rights to future metal or revenue from other companies' mines", tracks: "Metal price times the streams it owns", watch: "Fewer cost swings than operators; depends on partners' mines and deal terms" },
  ],
  drivers: [
    { title: "Real yields", text: "Gold pays nothing, so when inflation-adjusted Treasury yields rise, holding gold costs more in forgone interest. Many analysts watch the 10-year TIPS yield (FRED DFII10). The link is strong in some years and weak in others." },
    { title: "The dollar", text: "Gold is priced in dollars, so a stronger dollar often weighs on it for non-U.S. buyers. Often, not always." },
    { title: "Central-bank buying", text: "The World Gold Council estimates central banks bought 1,044.6 tonnes in 2024, the third straight year above 1,000t, versus a 473t average in 2010–2021. Official demand can support prices even when real yields are high." },
    { title: "Risk mood", text: "Gold often draws safe-haven demand in a crisis, but in a rush for cash it can fall with stocks at first." },
    { title: "Silver's industrial side", text: "The Silver Institute put 2024 industrial demand at a record 680.5 million ounces, more than half of all demand, led by solar, grid and electronics. Silver usually swings more than gold." },
  ],
  bridges: [
    { title: "Inflation", text: "Gold is popular as an inflation idea, but over short periods real yields and the dollar often matter more. TIPS are the direct inflation-linked bond; see Bonds and rates." },
    { title: "Interest rates", text: "Rate cuts that lower real yields can help gold; cuts made because of a deep recession can hurt silver's industrial demand." },
    { title: "U.S. dollar", text: "Read gold next to the dollar index; see Currency funds and the dollar." },
    { title: "Energy transition", text: "Solar panels and grid buildout use silver, linking it to the transition theme in Industrial and transition metals." },
  ],
  math: {
    title: "Miner margins, fees and the ratio",
    rows: [
      { label: "AISC margin", formula: "metal price − AISC", example: `${usd(PM_EX.gold, 0)} − ${usd(PM_EX.aisc, 0)} = ${usd(PM_MARGIN, 0)} an ounce` },
      { label: "Metal −10%, AISC flat", formula: "change in margin ÷ old margin", example: `${usd(PM_EX.gold * 0.9, 0)} − ${usd(PM_EX.aisc, 0)}: margin ${pct(PM_MARGIN_DOWN, 0)}` },
      { label: "Trust fee over time", formula: "(1 − fee)^years", example: `${PM_EX.fee}% for ${PM_EX.years} years leaves ${PM_LEFT} oz per starting oz` },
      { label: "Gold/silver ratio", formula: "gold price ÷ silver price", example: `${usd(PM_EX.gold, 0)} ÷ ${usd(PM_EX.silver, 0)} = ${PM_RATIO}` },
    ],
    note: "Illustrative numbers, not current prices. AISC excludes growth capital, financing and taxes, so true break-even is higher.",
  },
  calculator: {
    title: "Try it: a miner's margin when the metal moves",
    inputs: [
      { id: "price", label: "Metal price ($/oz)", value: PM_EX.gold, step: 10 },
      { id: "aisc", label: "AISC ($/oz)", value: PM_EX.aisc, step: 10 },
      { id: "move", label: "Metal move %", value: PM_EX.move, step: 1 },
    ],
    compute: (v) => {
      const price = v.price ?? 0;
      const aisc = v.aisc ?? 0;
      const move = v.move ?? 0;
      const m = aiscMargin(price, aisc);
      return [
        { label: "Margin now", value: m > 0 ? `${usd(m, 0)} an ounce` : "No margin at this cost" },
        { label: "Margin after the move", value: usd(aiscMargin(price * (1 + move / 100), aisc), 0) },
        { label: "Margin change", value: m > 0 ? pct(aiscMarginChangePct(price, aisc, move), 1) : "—" },
      ];
    },
    note: "Higher AISC means more leverage to the metal in both directions.",
  },
  drills: [
    { id: "pm-d1", prompt: "Real yields rise sharply and the dollar firms. What is the usual first-order effect on gold?", options: ["Usually supportive", "Usually a headwind", "No link at all", "Gold must double"], answer: 1, why: "Holding a metal that pays nothing costs more when real yields rise, and a stronger dollar makes gold dearer abroad. Usually, not always." },
    { id: "pm-d2", prompt: "Gold is at $2,400 and a miner's AISC is $1,450. Gold falls 10%. Roughly how much does the miner's margin per ounce fall?", options: ["10%", "About 25%", "About 50%", "It rises"], answer: 1, why: "$950 → $710, about −25%. That is why miner funds swing more than bullion." },
    { id: "pm-d3", prompt: "Why can silver swing more with the economy than gold?", options: ["More than half of its demand is industrial", "Silver has no investment demand", "Silver is priced in euros", "Silver trusts hold futures"], answer: 0, why: "Solar, grid and electronics demand ties silver to factory cycles." },
    { id: "pm-d4", prompt: "Two gold trusts hold vaulted bars; one charges far less. What differs between them?", options: ["The metal", "Mostly the cost to hold, plus spread and liquidity", "One tracks miners", "One is a futures fund"], answer: 1, why: "Same exposure, different fee. The fee compounds for as long as you hold." },
    { id: "pm-d5", prompt: "The gold/silver ratio is far above its recent average. What does that prove?", options: ["Silver must rally", "Gold must fall", "Nothing on its own; it can stay stretched", "Both metals are cheap"], answer: 2, why: "Ratios are context, not a signal. There is no fixed normal level." },
  ],
  caveats: [
    { title: "Haven is a tendency", text: "Gold can fall in a liquidity scramble. Size for that, not for the story." },
    { title: "Miners are stocks", text: "Mine problems, debt and the stock market can override the metal for a long time." },
    { title: "Taxes", text: "U.S. tax rules treat gains on physically backed metal trusts differently from ordinary stock funds; check the fund's tax page or a professional." },
    { title: "Data lags", text: "Central-bank buying is estimated and revised; reported purchases cover only part of it." },
  ],
  sources: [
    { label: "World Gold Council: Gold Demand Trends FY 2024, Central banks", url: "https://www.gold.org/goldhub/research/gold-demand-trends/gold-demand-trends-full-year-2024/central-banks", supports: "1,044.6t in 2024; third year above 1,000t; 473t 2010–2021 average" },
    { label: "World Gold Council: All-in sustaining costs and all-in costs", url: "https://www.gold.org/about-gold/gold-supply/responsible-gold/all-in-costs", supports: "AISC guidance note (2013, updated)" },
    { label: "Silver Institute: Silver News, April 2025 (World Silver Survey 2025)", url: "https://silverinstitute.org/wp-content/uploads/2025/05/Silver-News-Apr-2025_Draft-FINAL.pdf", supports: "Record 680.5 Moz industrial demand; total demand about 1.16 billion oz" },
    { label: "FRED: 10-Year TIPS yield (DFII10)", url: "https://fred.stlouisfed.org/series/DFII10", supports: "Real-yield data to read next to gold" },
    { label: "FINRA: Futures and commodities", url: "https://www.finra.org/investors/investing/investment-products/futures-and-commodities", supports: "Commodity funds vs producer stocks" },
    { label: "Barrick: Barrick is now 'B' on the NYSE", url: "https://www.barrick.com/English/news/news-details/2025/barrick-Is-now-B-on-the-NYSE/default.aspx", supports: "Ticker change from GOLD to B (May 2025)" },
  ],
  links: [
    { label: "Learn → Precious Metals: Gold, Silver & Miners", to: "/training?group=precious-metals" },
    { label: "Coach → Gold view, which wrapper", to: "/coach/precious-metals-wrappers" },
    { label: "Practice → Same theme, different wrapper", to: "/practice/exposure-wrappers" },
    { label: "Coach → Gold as a haven (futures)", to: "/coach/futures-gold-haven" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "precious_metals",
  modeLabel: "Metals: which driver, which wrapper",
  modeTip:
    "Name the driver first (real yields, the dollar, official buying, risk mood, or silver's industrial demand), then the wrapper: a trust follows the metal less fees, a miner adds its own costs and stock-market risk. Size miners for their bigger swings. Cases → Market-wide news.",
  questions: [
    mc("PM-01", "Why do rising real yields often weigh on gold?", "B", "Gold pays no interest, so holding it costs more in forgone yield", ["Gold pays a falling dividend", "Miners must sell more gold", "Real yields set the gold price by law"], "Opportunity cost rises with real yields; the link varies over time.", "real-yield"),
    mc("PM-02", "About how much gold did central banks buy in 2024, per the World Gold Council?", "C", "About 1,045 tonnes", ["About 50 tonnes", "About 100 tonnes", "About 10,000 tonnes"], "1,044.6t, the third year in a row above 1,000t.", "central-bank-gold-buying"),
    mc("PM-03", "What share of 2024 silver demand was industrial (Silver Institute)?", "A", "More than half", ["Under 10%", "About a quarter", "Exactly 100%"], "680.5 Moz of about 1.16 billion oz.", "silver-industrial-demand"),
    mc("PM-04", "AISC is…", "D", "A miner's full cost to keep producing an ounce, excluding growth capital, financing and taxes", ["The spot price of gold", "A trust's expense ratio", "The futures roll cost"], "World Gold Council guidance note.", "all-in-sustaining-cost"),
    mc("PM-05", `Gold ${usd(PM_EX.gold, 0)}, AISC ${usd(PM_EX.aisc, 0)}. Margin per ounce?`, "B", usd(PM_MARGIN, 0), [usd(PM_EX.aisc, 0), usd(PM_EX.gold, 0), "$0"], "Metal price minus all-in sustaining cost per ounce.", "all-in-sustaining-cost"),
    mc("PM-06", "Gold falls 10% with AISC flat at the numbers above. The margin falls about…", "C", pct(Math.abs(PM_MARGIN_DOWN), 0), ["10%", "2%", "100%"], "$240 off a $950 margin.", "operating-leverage"),
    mc("PM-07", "A bullion trust's fee is paid by…", "A", "Selling a little metal, so metal per share shrinks", ["The miners", "The exchange", "Nobody"], `${PM_EX.fee}% for ${PM_EX.years} years leaves about ${PM_LEFT} oz per starting oz.`, "expense-ratio"),
    mc("PM-08", "A streaming company mainly owns…", "D", "Rights to future metal or revenue from other companies' mines", ["Vaulted bars", "Gold futures", "Jewelry shops"], "Fewer cost swings, but tied to partners' mines.", "streaming-royalty-company"),
    mc("PM-09", "Gold 2,400 and silver 30. Gold/silver ratio?", "B", String(PM_RATIO), ["30", "2,370", "0.0125"], "Gold price ÷ silver price; it has no fixed normal level.", "gold-silver-ratio"),
    mc("PM-10", "In a sudden rush for cash, gold…", "C", "Can fall with stocks at first", ["Always rises", "Stops trading", "Is fixed by central banks"], "Haven demand is a tendency, not a promise.", "safe-haven-demand"),
    mc("PM-11", "Why might a gold miner fund fall while gold rises?", "A", "Rising costs, mine problems or a broad stock selloff", ["Miner funds hold silver only", "Gold trusts short miners", "It cannot happen"], "Miners are businesses inside the stock market.", "operating-leverage"),
    mc("PM-12", "Barrick's NYSE ticker since May 2025 is…", "D", "B", ["GOLD", "BG", "ABX"], "Barrick Mining announced the change from GOLD to B.", "stock-share"),
    mc("PM-13", "A stronger U.S. dollar usually…", "B", "Weighs on dollar-priced gold", ["Lifts gold automatically", "Has no effect on any commodity", "Halts silver trading"], "It makes gold dearer in other currencies. Usually, not always.", "us-dollar-index"),
    mc("PM-14", "You want gold's price with no company risk. Best fit?", "C", "A physically backed gold trust", ["A single miner", "A silver miner fund", "A streaming company"], "The trust holds bars; the others add business risk.", "physically-backed-trust"),
  ],
  terms: TERMS,
  cases: CASES,
};

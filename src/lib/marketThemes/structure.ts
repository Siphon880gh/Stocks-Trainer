/**
 * MK0 · Same theme, different wrapper (/practice/exposure-wrappers): how a stock, a fund (physically backed trust,
 * futures-based fund, producer or miner equity fund) and a futures contract give different exposure to one theme.
 * The model every later market theme follows. Sources: FINRA, CFTC, SEC / Investor.gov, Fidelity, CME, EIA. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { withSims } from "../toolTraining/simWalk";
import { THEME_SIMS } from "./simulations";
import { mc, pct, r2, seededTape, usd } from "./helpers";

/** Roll cost of moving from the expiring contract to the next one, as a % of the position. Positive = a cost (contango). */
export const rollCostPct = (front: number, next: number) => r2(((next - front) / front) * 100);
/** A repeated monthly % compounded over 12 months. 1% a month ≈ 12.7% a year. */
export const annualizeMonthlyPct = (monthlyPct: number) => r2((Math.pow(1 + monthlyPct / 100, 12) - 1) * 100);
/** Producer margin change when the commodity moves `movePct` and costs per unit stay put. */
export function marginChangePct(price: number, costPerUnit: number, movePct: number): number {
  const before = price - costPerUnit;
  const after = price * (1 + movePct / 100) - costPerUnit;
  return r2(((after - before) / before) * 100);
}

/** Illustrative numbers used in the page, quiz and cases (not market data). */
export const WRAP_EX = { front: 70, next: 70.7, price: 2000, cost: 1400, move: 10 } as const;
export const WRAP_ROLL = rollCostPct(WRAP_EX.front, WRAP_EX.next);
export const WRAP_ROLL_YEAR = annualizeMonthlyPct(WRAP_ROLL);
export const WRAP_MARGIN = marginChangePct(WRAP_EX.price, WRAP_EX.cost, WRAP_EX.move);

const TERMS: LiteracyTerm[] = [
  { id: "exposure-wrapper", name: "Exposure wrapper", category: "ownership", summary: "The structure you use to bet on a theme: a company's stock, a fund, a trust or a futures contract.", detail: "The same theme (gold, oil, the dollar, bitcoin) can be owned several ways, and each way tracks something different and carries different risks. Read what the product owns before you read its name. Educational, not advice." },
  { id: "physically-backed-trust", name: "Physically backed trust", category: "ownership", summary: "An exchange-traded product that holds the asset itself, such as gold bars or a currency deposit.", detail: "It aims to track the spot price minus expenses. FINRA notes many of these are grantor trusts, not funds registered under the Investment Company Act of 1940, so protections and taxes can differ. Educational, not advice." },
  { id: "commodity-pool", name: "Commodity pool (futures-based fund)", category: "ownership", summary: "A fund that gets commodity exposure by holding futures contracts and cash instead of the physical good.", detail: "The CFTC regulates pool operators. The fund must roll expiring contracts, so its return can drift a long way from the spot price over time. Some are partnerships that send a Schedule K-1 at tax time. Educational, not advice." },
  { id: "contango", name: "Contango", category: "markets", summary: "Later-dated futures cost more than nearer ones, so rolling forward buys fewer contracts and costs money.", detail: "Common in storable commodities when storage and financing are priced in. A futures-based fund can lose money in contango even when the spot price is flat. Educational, not advice." },
  { id: "backwardation", name: "Backwardation", category: "markets", summary: "Later-dated futures cost less than nearer ones, so rolling forward adds a positive roll yield.", detail: "Often seen when supply is tight right now. It can flip to contango, so do not assume it lasts. Educational, not advice." },
  { id: "spot-price", name: "Spot price", category: "markets", summary: "The price for immediate delivery of a commodity or currency, as opposed to a futures price for a later date.", detail: "Headlines usually quote the front futures contract or a spot benchmark. A futures-based fund does not earn the spot price's change. Educational, not advice." },
  { id: "operating-leverage", name: "Operating leverage", category: "markets", summary: "When most costs are fixed, a small change in the selling price moves profit by a larger percentage.", detail: "A miner selling gold at $2,000 with $1,400 of costs earns $600; a 10% gold rise lifts the margin by about a third. The same math works in reverse, which is why producer stocks swing more than the commodity. Educational, not advice." },
  { id: "expense-ratio", name: "Expense ratio", category: "ownership", summary: "The yearly fee a fund charges, as a percentage of assets, taken out of the fund's value.", detail: "A trust that holds gold slowly sells a little gold to pay it, so its gold per share shrinks over time. Compare it with trading costs (spread) and how the fund gets its exposure. Educational, not advice." },
  { id: "spot-bitcoin-etp", name: "Spot bitcoin ETP", category: "ownership", summary: "An exchange-listed product that holds bitcoin and trades in a brokerage account during exchange hours.", detail: "The SEC approved the first U.S. spot bitcoin ETPs on January 10, 2024, while saying it did not endorse bitcoin. Bitcoin trades all week; the ETP trades on exchange days, so weekend moves show up as gaps. Educational, not advice." },
];

const T1 = seededTape({ seed: 9101, start: 31.2, preDrift: -0.004, postDrift: -0.006, vol: 0.02 });
const T2 = seededTape({ seed: 9102, start: 44.5, preDrift: 0.003, postDrift: -0.004, vol: 0.025, gap: -0.11 });
const T3 = seededTape({ seed: 9103, start: 52.8, preDrift: 0.004, postDrift: 0.002, vol: 0.03, gap: -0.075 });
const T4 = seededTape({ seed: 9104, start: 2010, preDrift: 0.002, postDrift: 0.003, vol: 0.008 });

const CASES: CaseStudy[] = [
  {
    id: "case-wrap-futures-fund-lags-spot",
    title: "Wrapper: the oil fund lags while crude holds up",
    contextType: "news",
    thinkingMode: "exposure_wrapper",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. You bought a front-month oil futures fund six months ago for a multi-year oil view. Spot crude is roughly where it was, but the fund is down about 9% because the curve has been in contango (the next contract costs about ${pct(WRAP_ROLL)} more each month). Buy = add to the fund. Sell = exit and choose a wrapper that fits a multi-year view (or none). Hold = keep it unchanged.`,
    newsHeadline: "Crude steady; futures curve stays in contango as inventories build.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `A front-month futures fund tracks rolled futures, not spot crude. At ${pct(WRAP_ROLL)} a month, the roll alone costs about ${pct(WRAP_ROLL_YEAR)} a year. Your thesis was multi-year, so the wrapper does not match the plan. Holding is partial credit only if you expect the curve to flip to backwardation and you size for being wrong.`,
      whyMarketMoved: "Rising inventories kept later months priced above the front month, so each roll bought less oil.",
      evidence: "SAMPLE: the fund kept sliding over the next four sessions while spot was little changed. FINRA and the CFTC both warn that rolling futures can make a fund diverge from spot.",
    },
  },
  {
    id: "case-wrap-miner-misses-while-gold-rises",
    title: "Wrapper: gold rises, but your miner gaps down",
    contextType: "news",
    thinkingMode: "exposure_wrapper",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical miner. Your plan was exposure to the gold price, and you bought one mining stock instead of a bullion trust. Gold is up 4% this month, but the miner just cut its output forecast and raised its cost guidance; the stock gapped down 11%. Buy = buy more of the miner on the dip. Sell = sell the miner; if you still want gold-price exposure, compare a bullion trust or a diversified miner fund. Hold = keep it.",
    newsHeadline: "Miner trims output guidance, lifts all-in costs; shares slide as gold climbs.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "A miner is a business: its profit is the gold price minus its own costs, and company problems can swamp a rising metal. Your thesis was the metal, so a company-specific miss breaks the reason you chose this wrapper. Holding is partial credit only if you had a separate case for this company. Averaging down adds to the part of the bet you did not intend to make.",
      whyMarketMoved: "Lower output and higher costs cut the margin the market expected, even with a higher gold price.",
      evidence: "SAMPLE: the miner kept drifting lower over the next four sessions while gold held its gain.",
    },
  },
  {
    id: "case-wrap-bitcoin-etp-weekend-gap",
    title: "Wrapper: bitcoin fell over the weekend; the ETP gaps Monday",
    contextType: "news",
    thinkingMode: "exposure_wrapper",
    packId: "crypto",
    assetClass: "crypto",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You hold a small, planned position in a spot bitcoin ETP, sized so a 30% drop would not break your plan. Bitcoin fell about 8% on Saturday after an exchange outage rumor that was later denied. The ETP, which only trades on exchange days, will open Monday about 7% lower. Buy = double the position at the open. Sell = sell at the open. Hold = keep the planned size.",
    newsHeadline: "Weekend selloff: bitcoin slides on an outage rumor; exchange later says systems normal.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "Bitcoin trades all week; the ETP trades on exchange days, so a weekend move arrives as one gap. You sized for a much larger fall, the news was a denied rumor, and nothing about your plan changed. Selling at the gap locks in a move you had already planned to tolerate. Doubling up changes your risk because of a headline.",
      whyMarketMoved: "The rumor hit while U.S. exchanges were closed; the ETP caught up to the coin's price at Monday's open.",
      evidence: "SAMPLE: after the gap, the ETP drifted slightly higher over the next four sessions. The SEC approved the first spot bitcoin ETPs on January 10, 2024 and warned of bitcoin's risks.",
    },
  },
  {
    id: "case-wrap-gold-contract-near-expiry",
    title: "Wrapper: a gold futures contract near expiration",
    contextType: "news",
    thinkingMode: "exposure_wrapper",
    packId: "futures",
    assetClass: "future",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You are long one gold futures contract (100 troy ounces) and your plan is to keep gold exposure for three more months. The contract enters its delivery period soon; your broker requires accounts that cannot take delivery to close or roll before then. Buy = roll: sell the expiring contract and buy a later one. Sell = close it and stay flat. Hold = keep the expiring contract through the delivery period.",
    newsHeadline: "Gold firm; broker reminds clients of the delivery-period deadline.",
    preOhlc: T4.pre,
    postOhlc: T4.full,
    correctActions: ["buy"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "A futures contract expires; a trust or a stock does not. Keeping exposure means rolling, and the price gap between months is a cost or a gain on each roll. Closing is partial credit: it is safe, but it drops the exposure your plan wanted. Holding into delivery is not an option for an account that cannot take delivery.",
      whyMarketMoved: "Steady demand kept gold firm; the roll itself is a mechanical step, not a view.",
      evidence: "SAMPLE: the later contract kept rising over the next four sessions. CME lists the gold contract at 100 troy ounces; the CFTC notes futures cannot be held indefinitely.",
    },
  },
];

export const EXPOSURE_WRAPPERS: MarketTheme = {
  id: "exposure-wrappers",
  route: "/practice/exposure-wrappers",
  practiceTitle: "Same theme, different wrapper: stocks, funds and futures",
  title: "Same theme, different wrapper",
  blurb:
    "One theme, several ways to own it. A company's stock, a fund that holds the asset, a fund that holds futures, and a futures contract each track something different. Read what a product owns before you trust its name. Educational, not advice.",
  marketForces:
    "Weng's Market Forces directory already tags every ticker with its exposure (Bullion, Commodity futures, Mining stocks, Currency trust…). This lesson explains what those labels mean before the theme lessons use them.",
  asOf: "2026-11-12",
  quiz: {
    name: "Same Theme, Different Wrapper",
    description:
      "Stock vs physically backed trust vs futures-based fund vs miner fund vs futures contract; spot vs futures prices, contango, backwardation and roll cost, operating leverage, expense ratios, spot bitcoin ETPs and weekend gaps, delivery and rolling, and how to read what a product owns",
    icon: "layers",
  },
  intro: [
    "Say you think gold will rise. You could buy a gold mining company, a trust that keeps gold bars in a vault, a fund that holds gold futures, a fund of many miners, or a gold futures contract. All five are \"gold\", and they can behave very differently in the same month.",
    "Three questions sort any product: What does it own? What price does it actually track? What else can move it? The table below answers them for the common wrappers.",
  ],
  wrappers: [
    { name: "Physically backed trust", examples: "Gold: GLD, IAU · Silver: SLV · Bitcoin: spot bitcoin ETPs", owns: "The asset itself, held by a custodian", tracks: "Spot price minus the expense ratio", watch: "Fees slowly shrink the asset per share; trading hours (a spot bitcoin ETP misses weekends); not always a 1940 Act fund, so taxes and protections differ" },
    { name: "Futures-based fund (commodity pool)", examples: "Oil: USO · Gas: UNG · Copper: CPER · Crops: DBA · Dollar: UUP", owns: "Futures contracts plus cash or Treasury bills", tracks: "The futures it holds, rolled forward, not spot", watch: "Roll cost in contango (gain in backwardation); position limits; some send a Schedule K-1" },
    { name: "Producer or miner stock", examples: "Gold: NEM · Oil: XOM · Copper: FCX · Fertilizer: NTR", owns: "A share of one business", tracks: "That company's profit: price minus its costs, plus its own decisions", watch: "Operating leverage, costs, debt, hedging, management, country risk, the whole stock market" },
    { name: "Producer stock fund", examples: "Gold miners: GDX · Energy: XLE · Copper miners: COPX", owns: "A basket of producer stocks", tracks: "Those companies, weighted by the fund's index", watch: "Less single-company risk, but still equities: they can fall with stocks while the commodity rises" },
    { name: "Futures contract", examples: "Gold, crude oil, copper, bitcoin futures (CME)", owns: "An obligation to buy or sell later at today's price", tracks: "That one contract month", watch: "Leverage and margin calls, expiration and delivery, rolling, contract size" },
  ],
  drivers: [
    { title: "Spot vs futures", text: "Spot is the price for delivery now. A futures price is for a later date and includes storage, financing and expectations. FINRA notes the two usually move together, imperfectly, and converge at expiration." },
    { title: "The roll", ...withSims(["A futures fund must sell expiring contracts and buy later ones. In contango, later months cost more, so ", { text: "each roll loses a little", sim: "mk-ew-roll" }, "; in backwardation it gains. Fidelity's example: 1% a month is nearly 13% a year."]) },
    { title: "Operating leverage", text: "Producers have large fixed costs. When the commodity rises, profit can rise by a much larger percentage, and the reverse on the way down. That is why miners often swing more than the metal." },
    { title: "Company and market risk", text: "A producer stock also moves with its own costs, debt and management, and with the stock market. In a broad selloff, miners can fall even if the metal holds." },
    { title: "Hours and gaps", ...withSims(["Bitcoin and forex trade almost around the clock; U.S. exchange products trade on exchange days. Moves made while the exchange is shut ", { text: "arrive as an opening gap", sim: "mk-ew-gap" }, "."]) },
    { title: "When it goes wrong", text: "On April 20, 2020 the expiring WTI crude contract settled at −$37.63 a barrel (CFTC); EIA tied it to scarce storage at the Cushing delivery point. Funds holding near-month contracts had to change how they rolled. Contract mechanics can matter more than the theme." },
  ],
  bridges: [
    { title: "Inflation", text: "Often researched through inflation-protected Treasuries, gold, crops and energy. Each wrapper reacts differently: TIPS through real yields, a crop futures fund through the futures curve, an energy stock through its margins. See Bonds and rates and the commodity themes." },
    { title: "Interest rates", text: "Higher real yields raise the cost of holding non-yielding gold, push long bond prices down, and pressure rate-sensitive sectors such as real estate and utilities." },
    { title: "U.S. dollar", text: "Commodities are mostly priced in dollars, so a stronger dollar can weigh on them; currency funds and pairs show the dollar directly. See Currency funds and the dollar." },
    { title: "Economic growth and slowdown", text: "Growth usually helps industrial metals, energy and cyclical sectors; a slowdown is often researched through defensive sectors and bonds. See Sectors and sector rotation." },
    { title: "AI and chip demand, infrastructure, energy transition", text: "Themes like these reach prices through specific companies' orders and margins, not through a headline. Copper and uranium sit in the industrial metals lesson; chips and industrials in the sectors lesson." },
  ],
  math: {
    title: "Two numbers that separate the wrappers",
    rows: [
      { label: "Roll cost (contango)", formula: "(next − expiring) ÷ expiring", example: `(${WRAP_EX.next} − ${WRAP_EX.front}) ÷ ${WRAP_EX.front} = ${pct(WRAP_ROLL)} a month` },
      { label: "Repeated for a year", formula: "(1 + monthly)^12 − 1", example: `${pct(WRAP_ROLL)} a month ≈ ${pct(WRAP_ROLL_YEAR)} a year of drag` },
      { label: "Producer margin", formula: "price − all-in cost per unit", example: `${usd(WRAP_EX.price, 0)} − ${usd(WRAP_EX.cost, 0)} = ${usd(WRAP_EX.price - WRAP_EX.cost, 0)} an ounce` },
      { label: "Price +10%, costs flat", formula: "margin change ÷ old margin", example: `${usd(WRAP_EX.price * 1.1, 0)} − ${usd(WRAP_EX.cost, 0)}: margin ${pct(WRAP_MARGIN)}` },
    ],
    note: "Illustrative numbers, not market data. Real curves move, and real costs change with energy, wages and the currency.",
  },
  calculator: {
    title: "Try it: roll cost and operating leverage",
    inputs: [
      { id: "front", label: "Expiring contract price", value: WRAP_EX.front, step: 0.1 },
      { id: "next", label: "Next contract price", value: WRAP_EX.next, step: 0.1 },
      { id: "price", label: "Commodity price (producer)", value: WRAP_EX.price, step: 10 },
      { id: "cost", label: "All-in cost per unit", value: WRAP_EX.cost, step: 10 },
      { id: "move", label: "Commodity move %", value: WRAP_EX.move, step: 1 },
    ],
    compute: (v) => {
      const roll = rollCostPct(v.front ?? 0, v.next ?? 0);
      const margin = (v.price ?? 0) - (v.cost ?? 0);
      return [
        { label: "Roll cost per month", value: Number.isFinite(roll) ? pct(roll, 2) : "—" },
        { label: "Repeated for 12 months", value: Number.isFinite(roll) ? pct(annualizeMonthlyPct(roll), 1) : "—" },
        { label: "Producer margin change", value: margin > 0 ? pct(marginChangePct(v.price ?? 0, v.cost ?? 0, v.move ?? 0), 1) : "No margin at this cost" },
      ];
    },
    note: "A negative roll cost means backwardation (a roll gain). If costs are above the price, the producer is losing money on every unit.",
  },
  drills: [
    { id: "wrap-d1", prompt: "You want the gold price itself, with no company risk. Which wrapper fits best?", options: ["A gold mining stock", "A physically backed gold trust", "A fund of gold miners", "A leveraged gold miner fund"], answer: 1, why: "A trust that holds bullion aims to track spot gold minus its fee. Miners add company and stock-market risk." },
    { id: "wrap-d2", prompt: "Spot crude was flat for a year, but the oil futures fund fell 12%. What is the most likely reason?", options: ["The fund was hacked", "Roll cost in a contango curve", "Oil companies cut dividends", "The fund holds oil stocks"], answer: 1, why: "In contango, each roll buys a later, pricier contract. FINRA and the CFTC both warn this makes futures funds diverge from spot." },
    { id: "wrap-d3", prompt: "Gold rises 10% and a miner's costs stay flat at $1,400 with gold at $2,000. Roughly how much does its margin per ounce rise?", options: ["10%", "About 33%", "About 3%", "It cannot change"], answer: 1, why: "Margin goes from $600 to $800, about +33%. Operating leverage cuts both ways." },
    { id: "wrap-d4", prompt: "Bitcoin falls 8% on a Saturday. When does a spot bitcoin ETP show that move?", options: ["Saturday, live", "At Monday's opening price", "Never; the ETP ignores weekends", "At the next month's roll"], answer: 1, why: "The ETP trades only when its exchange is open, so the weekend move arrives as a gap at the next open." },
    { id: "wrap-d5", prompt: "Which wrapper can require you to roll or close before a delivery period?", options: ["A bullion trust", "A miner stock", "A futures contract", "A broad stock ETF"], answer: 2, why: "Futures expire. Brokers make retail accounts close or roll before delivery." },
  ],
  caveats: [
    { title: "Names are not holdings", text: "\"Oil fund\" can mean futures, oil company stocks or a leveraged product. Read the holdings and the prospectus summary first." },
    { title: "Short-term tools for long-term views", text: "Front-month futures funds and leveraged or inverse products are built for short horizons; the SEC warns leveraged and inverse funds can diverge sharply from their target over longer periods." },
    { title: "Taxes and structure differ", text: "Grantor trusts, commodity pools and stock funds can be taxed differently, and some send a Schedule K-1. Check the fund's tax page or ask a tax professional." },
    { title: "Leverage in futures", text: "A futures contract controls far more than its margin deposit. A small move can mean a margin call or a loss larger than the deposit." },
  ],
  sources: [
    { label: "FINRA: Futures and commodities", url: "https://www.finra.org/investors/investing/investment-products/futures-and-commodities", supports: "Spot vs futures exposure, commodity funds vs producer funds, rolling and divergence" },
    { label: "FINRA: Exchange-traded funds and products", url: "https://www.finra.org/investors/investing/investment-products/exchange-traded-funds-and-products", supports: "Grantor trusts, commodity pools, currency and crypto ETPs" },
    { label: "CFTC: Risks before investing in commodity ETPs or funds", url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_CommodityETPs.htm", supports: "Futures cannot be held indefinitely; roll drag" },
    { label: "Fidelity: Commodity ETFs, contango and backwardation", url: "https://www.fidelity.com/learning-center/investment-products/etf/commodity-etfs-contango-backwardation", supports: "Roll cost example (1% a month ≈ 13% a year)" },
    { label: "FINRA Regulatory Notice 20-14 (oil-linked ETPs)", url: "https://www.finra.org/rules-guidance/notices/20-14", supports: "How oil ETPs hold futures; commodity pool features" },
    { label: "CFTC interim staff report on WTI, April 20, 2020", url: "https://www.cftc.gov/PressRoom/PressReleases/8315-20", supports: "May 2020 WTI settled at −$37.63" },
    { label: "EIA: WTI futures prices below zero", url: "https://www.eia.gov/todayinenergy/detail.php?id=43495", supports: "Storage at Cushing and negative prices" },
    { label: "SEC: Statement on spot bitcoin ETPs (Jan 10, 2024)", url: "https://www.sec.gov/newsroom/speeches-statements/gensler-statement-spot-bitcoin-011023", supports: "Approval date and the SEC's risk warning" },
    { label: "Investor.gov: Funds trading in bitcoin futures", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/funds-trading-bitcoin-futures-investor-bulletin", supports: "Futures-based bitcoin funds can diverge from spot" },
    { label: "CME Group: Gold futures contract specs", url: "https://www.cmegroup.com/markets/metals/precious/gold.contractSpecs.html", supports: "100 troy ounces per contract" },
  ],
  links: [
    { label: "Learn → Same Theme, Different Wrapper", to: "/training?group=exposure-wrappers" },
    { label: "Academy → What you would own, by type", to: "/academy/l7-what-you-own" },
    { label: "Coach → Same theme, three wrappers", to: "/coach/exposure-wrappers" },
    { label: "Coach → Bitcoin: coin, ETP, futures or miners", to: "/coach/bitcoin-wrappers" },
    { label: "Practice → Currency funds and the dollar", to: "/practice/currency-funds" },
    { label: "Practice → Futures vs options & beginner toolkit", to: "/practice/futures-vs-options" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  simulations: THEME_SIMS["exposure-wrappers"],
  mode: "exposure_wrapper",
  modeLabel: "Same theme, which wrapper",
  modeTip:
    "Before you judge the move, name the wrapper: a trust tracks spot minus fees, a futures fund tracks rolled futures, a producer tracks its own margins, and a contract expires. Ask whether the wrapper still matches the thesis and the time horizon. Cases → Market-wide news, Futures, Crypto.",
  questions: [
    mc("WRAP-01", "Which product aims to track the spot gold price minus its fee?", "B", "A physically backed gold trust", ["A gold mining stock", "A front-month gold futures contract", "A fund of gold miners"], "It holds bullion with a custodian. Miners and futures track other things.", "physically-backed-trust"),
    mc("WRAP-02", "A futures-based oil fund mostly owns…", "C", "Oil futures contracts plus cash or Treasury bills", ["Barrels in its own tanks", "Shares of oil companies", "Gas station franchises"], "FINRA: many commodity products track futures rather than spot.", "commodity-pool"),
    mc("WRAP-03", "Later-dated futures are priced above the expiring contract. What is that called?", "A", "Contango", ["Backwardation", "Convergence", "Basis zero"], "In contango, rolling forward buys fewer contracts with the same money.", "contango"),
    mc("WRAP-04", `The expiring contract is ${WRAP_EX.front} and the next is ${WRAP_EX.next}. What is the roll cost?`, "D", pct(WRAP_ROLL), [pct(WRAP_EX.next - WRAP_EX.front), "0%", pct(-WRAP_ROLL)], "(next − expiring) ÷ expiring.", "futures-roll"),
    mc("WRAP-05", "About how much is a 1% monthly roll cost over a year?", "B", "About 12.7%", ["1%", "About 6%", "About 25%"], "(1.01)^12 − 1 ≈ 12.7%. Fidelity rounds it to nearly 13%.", "roll-yield"),
    mc("WRAP-06", "Why can a futures fund rise in backwardation even if spot is flat?", "C", "Each roll buys a cheaper later contract, adding a roll gain", ["The fund borrows to buy more", "Backwardation means the fund owns barrels", "Funds are paid a bonus by exchanges"], "Later contracts converge up toward spot as they near expiry.", "backwardation"),
    mc("WRAP-07", "Gold rises 10% from $2,000; a miner's all-in cost stays $1,400. Its margin per ounce rises about…", "A", pct(WRAP_MARGIN, 0), ["10%", "3%", "100%"], "$600 → $800. That is operating leverage, and it works in reverse.", "operating-leverage"),
    mc("WRAP-08", "Gold is up this month but your single miner fell 11% on a cost warning. What does that show?", "D", "A producer stock also carries company risk the metal does not", ["The gold price is wrong", "Miners always fall when gold rises", "Bullion trusts have the same risk"], "Costs, output and management can swamp the commodity move.", "exposure-wrapper"),
    mc("WRAP-09", "What does a producer stock fund like a miner ETF reduce compared with one miner?", "B", "Single-company risk, but not stock-market risk", ["Commodity risk", "All risk", "Currency risk only"], "A basket spreads company problems, yet it still trades like equities.", "diversification"),
    mc("WRAP-10", "A spot bitcoin ETP trades…", "C", "Only when its exchange is open, so weekend moves arrive as a gap", ["24/7 like bitcoin", "Only on weekends", "Once a month at the roll"], "The coin trades all week; the exchange-listed product does not.", "spot-bitcoin-etp"),
    mc("WRAP-11", "When did the SEC approve the first U.S. spot bitcoin ETPs?", "A", "January 10, 2024", ["April 20, 2020", "January 3, 2009", "December 2017"], "Chair Gensler's statement said the approval did not endorse bitcoin.", "spot-bitcoin-etp"),
    mc("WRAP-12", "Why must a long futures position be rolled or closed?", "B", "Contracts expire and can lead to delivery", ["Exchanges charge a monthly ticket", "Prices reset to zero each month", "Margin is returned only at expiry"], "The CFTC notes futures cannot be held indefinitely the way a stock can.", "futures-contract"),
    mc("WRAP-13", "On April 20, 2020 the expiring WTI contract settled at…", "D", "−$37.63 a barrel", ["$0.01", "$18", "$100"], "CFTC report; EIA tied it to scarce storage at Cushing, the delivery point.", "futures-contract"),
    mc("WRAP-14", "A gold trust's expense ratio is paid how?", "A", "By slowly selling a little gold, so gold per share shrinks", ["By the exchange", "From miners' dividends", "It is never charged"], "Fees come out of fund assets every year.", "expense-ratio"),
    mc("WRAP-15", "What is the first question to ask about any \"oil\" or \"gold\" product?", "C", "What does it actually own?", ["Is the name exciting?", "Did it rise last week?", "How many people talk about it?"], "Holdings decide what price it tracks and what else can move it.", "exposure-wrapper"),
  ],
  terms: TERMS,
  cases: CASES,
};

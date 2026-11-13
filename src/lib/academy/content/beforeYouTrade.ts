/**
 * L7 · Before you trade (BT1): two units that turn Market Forces' "Before you trade" checklist and its
 * "What you would own, by type" guide into studyable lessons, in this app's own words. Unit 1 walks seven
 * wrappers; unit 2 runs the six research checks in order. Seven new SAMPLE walks live here; topics the app already
 * walks elsewhere (futures roll, duration, a Fed cut, real yields, a currency trust, a social-media rumor, Financials
 * columns, index weights) are linked with `?sim=` instead of copied. Tax points are general. Educational, not advice.
 */
import type { Unit } from "../types";
import type { RawItem } from "./quizBuilder";
import type { ToolSimulation } from "../../toolTraining/types";
import { simBar } from "../../toolTraining/simWalk";
import { cardWithSims } from "./simulations";

// ---------------------------------------------------------------- simulations

const FOUR_WRAPPERS: ToolSimulation = {
  kind: "columns",
  id: "ac-four-wrappers",
  title: "Same theme, four wrappers",
  goal: "Step through four SAMPLE months of one gold theme held four ways to see why a bullion trust, one miner, a miner fund and a futures fund can end far apart while the metal does the same thing.",
  tape: "SAMPLE gold theme · four wrappers · each starts at 100 · simulated",
  start: 1,
  columns: ["Month", "Gold (spot)", "Bullion trust", "One miner", "Miner fund", "Gold futures fund"],
  rows: [
    ["Start", "100", "100", "100", "100", "100"],
    ["Month 1", "104", "103.9", "109", "107", "103.6"],
    ["Month 2", "101", "100.9", "94", "101", "100.4"],
    ["Month 3", "106", "105.8", "101", "110", "104.9"],
    ["Month 4", "108", "107.8", "106", "115", "106.4"],
  ],
  steps: [
    { col: 1, what: "Gold itself gains 8% over four months, with a dip in month 2.", why: "This is the theme in the headline. Every wrapper to the right claims a link to it, but each owns something different." },
    { col: 2, what: "The bullion trust ends at 107.8, a hair under the metal.", why: "A trust holds vaulted metal, so it tracks spot minus its yearly fee. It is the closest match, and it pays no income." },
    { col: 3, row: 2, what: "In month 2 the single miner drops to 94 while gold is still above 100.", why: "A company can miss on costs or output. Its shares price the whole business, so one bad quarter can outweigh the metal." },
    { col: 4, what: "The miner fund ends at 115, ahead of gold, after swinging more on the way.", why: "Miners' profits rise faster than the metal when prices climb, and fall faster when they drop. A basket spreads company risk, not that leverage." },
    { col: 5, what: "The futures fund ends at 106.4, behind spot.", why: "It holds contracts and rolls them each month. When later contracts cost more, the roll leaves it behind the spot price." },
    { col: 5, row: 4, what: "Final row: 107.8, 106, 115 and 106.4 against gold's 108.", why: "Same idea, four results. Naming the wrapper first tells you which of these numbers you would actually have earned." },
  ],
  takeaway: "One theme can be four different trades; name the wrapper before you judge the idea.",
};

const FEE_COMPOUNDS: ToolSimulation = {
  kind: "columns",
  id: "ac-fee-compounds",
  title: "How a small fee compounds",
  goal: "Follow $10,000 in two SAMPLE funds that hold the same index and differ only in their yearly fee, to see how a gap of 0.65 points a year adds up.",
  tape: "SAMPLE index returning 7% a year · fees taken yearly · simulated, rounded to the dollar",
  start: 1,
  columns: ["Year", "Index, no fee", "Fund A, 0.10% fee", "Fund B, 0.75% fee", "A minus B"],
  rows: [
    ["Start", "$10,000", "$10,000", "$10,000", "$0"],
    ["Year 1", "$10,700", "$10,689", "$10,620", "$69"],
    ["Year 5", "$14,026", "$13,956", "$13,507", "$449"],
    ["Year 10", "$19,672", "$19,476", "$18,245", "$1,231"],
    ["Year 20", "$38,697", "$37,930", "$33,288", "$4,642"],
  ],
  steps: [
    { col: 1, what: "The index grows to $38,697 in 20 SAMPLE years at 7% a year.", why: "This is what the holdings earn before anyone is paid. Both funds own exactly this basket." },
    { col: 2, what: "Fund A, at 0.10% a year, ends at $37,930.", why: "A low fee costs a little each year, and the cost grows with the balance it is charged on." },
    { col: 3, what: "Fund B, at 0.75% a year, ends at $33,288.", why: "The expense ratio comes out of the fund's value every year, whether the year was good or bad." },
    { col: 4, row: 1, what: "After one year the gap is only $69.", why: "Small at first, which is why fees are easy to ignore when you compare two similar funds." },
    { col: 4, row: 4, what: "After 20 years the gap is $4,642, nearly half the starting money.", why: "Fees compound like returns, in reverse. For two funds holding the same thing, the fee is the one difference you can know in advance." },
  ],
  takeaway: "Between funds that hold the same thing, a lower expense ratio compounds into a real difference.",
};

const EX_DIVIDEND_CUT: ToolSimulation = {
  kind: "bars",
  id: "ac-ex-dividend-cut",
  title: "Ex-dividend day, then a dividend cut",
  goal: "Walk five SAMPLE weekly bars of a dividend stock through an ex-dividend date and a later cut, to see why a dividend does not add value on the day and why a cut says something about the business.",
  tape: "SAMPLE dividend stock · weekly bars · $0.50 quarterly dividend · simulated",
  start: 1,
  bars: [
    simBar("Week 1", [40.2, 40.9, 39.9, 40.6], "The stock closes at 40.60. The next $0.50 dividend goes ex next week.", "Note the payout and the ex-dividend date before reading any price move around it.", { readout: "Dividend $0.50 a quarter" }),
    simBar("Week 2", [40.1, 40.4, 39.7, 40.0], "On the ex-dividend date it opens near 40.10, about 50 cents below the last close.", "Buyers from this open do not get the dividend, so the price adjusts by roughly the payout. Cash moved from the company to holders; value did not appear.", { mark: "dividend" }),
    simBar("Week 3", [40.0, 40.8, 39.8, 40.5], "A quiet week back near 40.50.", "Holders got $0.50 in cash and a share worth about 50 cents less on the day. Total value is roughly unchanged, before tax."),
    simBar("Week 4", [37.2, 37.9, 36.4, 36.9], "The company cuts the dividend to $0.20 to keep cash; the stock gaps to 36.90.", "A cut usually means cash is tighter or priorities changed. Read the release and the cash-flow statement, not only the yield.", { mark: "news", readout: "Dividend cut to $0.20" }),
    simBar("Week 5", [36.9, 37.6, 36.2, 37.3], "The stock settles near 37.30, about 8% below week 3.", "A high yield before a cut was the warning, not the reward. Check whether free cash flow covers the payout before counting on it."),
  ],
  takeaway: "A dividend moves cash to you without adding value on the day; a cut is news about the business.",
};

const THEME_HOLDINGS: ToolSimulation = {
  kind: "columns",
  id: "ac-theme-holdings",
  title: "What a theme fund actually owns",
  goal: "Read a SAMPLE uranium-themed fund's top five holdings one column at a time to see why the holdings page, not the name, tells you the exposure.",
  tape: "SAMPLE uranium-themed fund · top five holdings · dated holdings file · simulated",
  start: 1,
  columns: ["Holding", "What the company does", "Weight", "Tied to uranium prices?"],
  rows: [
    ["Holding 1", "Uranium miner", "22%", "Directly"],
    ["Holding 2", "Physical uranium trust", "12%", "Directly"],
    ["Holding 3", "Nuclear plant engineering", "8%", "Loosely"],
    ["Holding 4", "Electric utility with reactors", "6%", "Barely"],
    ["Holding 5", "Diversified miner (copper, coal, some uranium)", "5%", "Partly"],
  ],
  steps: [
    { col: 1, what: "Only two of the five sell uranium or hold it.", why: "A theme name describes an idea. The businesses inside decide what actually moves the fund." },
    { col: 2, row: 0, what: "One miner is 22% of the fund.", why: "Concentration matters: a single company's mine problem would move almost a quarter of your money." },
    { col: 3, row: 3, what: "A utility owning reactors barely moves with the uranium price.", why: "Utilities earn regulated power rates. They belong to the theme's story, not its commodity." },
    { col: 3, row: 4, what: "A diversified miner earns most of its money from other metals.", why: "Partial exposure dilutes the theme. A copper slump can drag this holding even if uranium rallies." },
    { col: 2, what: "The top five are 53% of the fund; read the date on the file.", why: "Holdings change. The issuer's dated file and the prospectus are the source, not a summary or the fund's name." },
  ],
  takeaway: "Open the holdings, with their weights and date, before trusting what a theme fund's name says.",
};

const INFLATION_WRAPPERS: ToolSimulation = {
  kind: "columns",
  id: "ac-inflation-wrappers",
  title: "Inflation reports: three wrappers, three reactions",
  goal: "Step through five SAMPLE inflation reports and the one-day moves of an inflation-linked bond fund, a commodity fund and a consumer company, to see why each reacts differently and none is a sure hedge over a few months.",
  tape: "SAMPLE monthly inflation reports · one-day moves · simulated",
  start: 1,
  columns: ["Report", "Versus expected", "Inflation-linked bond fund", "Commodity fund", "Consumer company"],
  rows: [
    ["Report 1", "Hotter by 0.2 pt", "-0.6%", "+0.8%", "-1.1%"],
    ["Report 2", "Cooler by 0.1 pt", "+0.5%", "-0.4%", "+0.6%"],
    ["Report 3", "As expected", "+0.1%", "+0.2%", "0.0%"],
    ["Report 4", "Hotter by 0.3 pt", "-0.9%", "+1.2%", "-0.7%"],
    ["Report 5", "Hotter by 0.1 pt", "-0.3%", "-1.5%", "+0.4%"],
  ],
  steps: [
    { col: 1, what: "What moves markets is the report versus the forecast.", why: "A high reading that was expected is already in prices. The surprise is the news; write the consensus down before the release." },
    { col: 2, row: 0, what: "The inflation-linked bond fund falls 0.6% on a hot report.", why: "Its principal adjusts with inflation, but a hot report can lift real yields, and its price falls when they rise. It is still a bond fund with duration." },
    { col: 3, row: 0, what: "The commodity fund rises 0.8% the same day.", why: "Commodity prices often feed into inflation and can jump with it. That link is loose and day-to-day noisy." },
    { col: 4, row: 0, what: "The consumer company falls 1.1%.", why: "Higher costs and higher rates both weigh on a business. Its own pricing power decides whether it passes costs on." },
    { col: 3, row: 4, what: "Report 5 is hot, yet the commodity fund falls 1.5%.", why: "Other news landed that day, such as a supply change. One wrapper's move is never only about the report." },
  ],
  takeaway: "One inflation surprise moves bonds, commodities and companies differently; none is a guaranteed hedge.",
};

const STORY_PRICE: ToolSimulation = {
  kind: "columns",
  id: "ac-story-price",
  title: "A strong story, and the price you pay for it",
  goal: "Step through five SAMPLE quarters of a fast-growing chip company and a chip fund to see why growth, margins and the price already paid all matter, not only the story.",
  tape: "SAMPLE chip company and SAMPLE chip fund · quarter-end readings · simulated",
  start: 1,
  columns: ["Quarter", "Revenue growth", "Gross margin", "Share price", "P/E", "Chip fund (start = 100)"],
  rows: [
    ["Q1", "40%", "58%", "$60", "30", "100"],
    ["Q2", "55%", "61%", "$85", "38", "112"],
    ["Q3", "70%", "64%", "$120", "48", "128"],
    ["Q4", "62%", "63%", "$135", "52", "133"],
    ["Q5", "45%", "60%", "$110", "44", "124"],
  ],
  steps: [
    { col: 1, what: "Growth climbs to 70% in Q3, then slows to 45% by Q5.", why: "Read the direction, not only the level. 45% is still fast, but it is slower than the market had come to expect." },
    { col: 2, what: "Margins peak at 64% and slip to 60%.", why: "Margins show pricing power. A slip while growth slows says competition or costs are catching up." },
    { col: 3, row: 3, what: "In Q4 the price keeps rising to $135 even as growth eases.", why: "Price can run ahead of results when the story is popular. That is the 'already priced in' risk." },
    { col: 4, row: 3, what: "The P/E reaches 52: buyers pay $52 for each $1 of yearly earnings.", why: "A higher multiple needs faster growth to hold. When growth slows, the multiple usually shrinks too." },
    { col: 3, row: 4, what: "Q5: still 45% growth, yet the stock falls 19% to $110.", why: "Good news can disappoint when the price assumed better. Strong business and good entry price are two separate questions." },
    { col: 5, row: 4, what: "The chip fund falls about 7% from its Q4 level.", why: "A basket softens one company's swing but still moves with the theme. It does not make an expensive theme cheap." },
  ],
  takeaway: "Check growth, margins and the multiple you would pay; a strong story can already be in the price.",
};

const DOWNSIDE_SIZING: ToolSimulation = {
  kind: "columns",
  id: "ac-downside-sizing",
  title: "Define your downside before you buy",
  goal: "Compare SAMPLE position sizes in a $10,000 practice account, with entry at $50, to see why choosing the loss you can live with comes before choosing how many shares to buy.",
  tape: "SAMPLE $10,000 practice account · entry $50 · simulated",
  start: 1,
  columns: ["Plan", "Shares", "Position value", "Stop", "Loss if stopped", "Share of account"],
  rows: [
    ["Buy what feels right", "150", "$7,500", "$44", "$900", "9%"],
    ["Risk 1%, stop $2 away", "50", "$2,500", "$48", "$100", "1%"],
    ["Risk 1%, stop $5 away", "20", "$1,000", "$45", "$100", "1%"],
    ["Risk 1%, then a gap to $44.50", "50", "$2,500", "$48 (filled $44.50)", "$275", "2.75%"],
    ["Risk 2%, stop $2 away", "100", "$5,000", "$48", "$200", "2%"],
  ],
  steps: [
    { col: 1, row: 0, what: "Buying 150 shares because the idea feels strong.", why: "Size chosen from confidence has no link to what you can afford to lose. It is the most common beginner mistake." },
    { col: 5, row: 0, what: "If that stop is hit, the loss is $900, 9% of the account.", why: "Losses compound: after 9% you need about 10% just to get back. A few of these and the account is badly hurt." },
    { col: 1, row: 1, what: "Risking 1% ($100) with a $2 stop allows 50 shares.", why: "Shares = dollars at risk ÷ distance to the stop. You decide the loss first, then the size follows." },
    { col: 1, row: 2, what: "A wider $5 stop at the same 1% allows only 20 shares.", why: "A wider stop is not more risk if size shrinks to match. The dollar loss stays the same." },
    { col: 4, row: 3, what: "A gap fills the stop at $44.50, so the loss is $275, not $100.", why: "A stop order becomes a market order; on a gap it fills at the next price. Plan for losses bigger than the stop sometimes." },
    { col: 5, row: 4, what: "At 2% risk the planned loss is $200 for the same setup.", why: "The risk percentage is yours to pick before the trade, along with the order type. The chart does not pick it for you." },
  ],
  takeaway: "Pick the loss you can live with, then the share count; the stop and the order type follow from that.",
};

// ---------------------------------------------------------------- units

export const BEFORE_YOU_TRADE_UNITS: Unit[] = [
  {
    id: "l7-what-you-own",
    levelId: "L7",
    courseId: "before-you-trade",
    title: "What you would own, by type",
    objective: "Name what each of seven common wrappers holds and the first cost or risk to check in each.",
    cards: [
      { title: "One company", glossaryTermId: "stock-share", ...cardWithSims(["A share is a slice of one business, such as Newmont (NEM), Barrick (B) or Pan American Silver (PAAS). Its price follows that company's sales, profit, debt and decisions, so it can move very differently from its theme. Dividends come out of its cash: ", { text: "an ex-dividend day, then a dividend cut", sim: "ac-ex-dividend-cut" }, "."]) },
      { title: "A stock fund", glossaryTermId: "expense-ratio", ...cardWithSims(["A stock fund such as GDX, SIL or XLE holds a basket of companies in one share. Many names lower single-company risk, but the fund still falls with its sector and the market. Check the holdings, the index and the ", { text: "expense ratio", term: "expense-ratio" }, ", because ", { text: "a small fee compounds", sim: "ac-fee-compounds" }, "."]) },
      { title: "Bond and Treasury bill funds", glossaryTermId: "treasury-bill-fund", ...cardWithSims(["A bond fund such as TIP, IEF or TLT holds loans to a government or company. When rates rise, bond prices usually fall, and longer bonds fall more: that is ", { text: "duration", term: "bond-duration" }, ". A Treasury bill fund such as SGOV holds bills maturing within months, so its price barely moves."]) },
      { title: "A bullion trust", glossaryTermId: "collectibles-tax", ...cardWithSims(["A bullion trust such as GLD, IAU or SLV holds metal in a vault. Its price follows the metal minus a yearly fee, and it pays no dividend or interest. It is a ", { text: "physically backed trust", term: "physically-backed-trust" }, ", not a company, so it has no earnings to read."]) },
      { title: "A futures fund", glossaryTermId: "schedule-k1", ...cardWithSims(["A futures fund such as USO, BNO or UNG owns futures contracts, not barrels or gas in storage. Each expiring contract is swapped for a later one. In ", { text: "contango", term: "contango" }, " that roll can leave the fund behind the spot price over months."]) },
      { title: "A currency trust", glossaryTermId: "currency-trust", ...cardWithSims(["A currency trust such as FXE (euros) or FXY (yen) holds a foreign currency on deposit. It tends to rise when that currency strengthens against the dollar and fall when it weakens, minus the fee. Then compare ", { text: "the same theme held four ways", sim: "ac-four-wrappers" }, "."]) },
    ],
    refs: [
      "practice:/practice/exposure-wrappers?sim=mk-ew-roll",
      "practice:/practice/bonds-rates?sim=mk-br-duration",
      "practice:/practice/precious-metals?sim=mk-pm-real-yields",
      "practice:/practice/currency-funds?sim=mk-cf-rate-gap",
      "glossary:exposure-wrapper",
      "quiz:exposure-wrappers",
    ],
    simulations: [EX_DIVIDEND_CUT, FEE_COMPOUNDS, FOUR_WRAPPERS],
  },
  {
    id: "l7-before-you-trade",
    levelId: "L7",
    courseId: "before-you-trade",
    title: "Before you trade: a research checklist",
    objective: "Run six research checks in order, from what you would own to how much you could lose, before a practice trade.",
    cards: [
      { title: "1. Know what you own", glossaryTermId: "exposure-wrapper", ...cardWithSims(["Start by naming the wrapper. A stock is one business, a stock fund is a basket of them, and bullion trusts, futures funds and currency trusts each have their own structure, costs and tax treatment. The unit before this one covers each type."]) },
      { title: "2. Check the business or the fund", glossaryTermId: "primary-source-filing", ...cardWithSims(["For a company, read revenue, profit, debt, cash flow and management's ", { text: "guidance", term: "guidance" }, ". For a fund, read the issuer, holdings, fee, index, concentration and ", { text: "prospectus", term: "fund-prospectus" }, ". ", { text: "Open the holdings before trusting a theme name", sim: "ac-theme-holdings" }, "."]) },
      { title: "3. Look for the next catalyst", glossaryTermId: "next-catalyst", ...cardWithSims(["Find the ", { text: "next catalyst", term: "next-catalyst" }, " and its date: earnings, inflation reports, central-bank decisions, inventory reports or supply news. Keep what is announced apart from what is rumored. ", { text: "One inflation report can move three wrappers three ways", sim: "ac-inflation-wrappers" }, "."]) },
      { title: "4. Check the market price", glossaryTermId: "priced-in", ...cardWithSims(["Valuation, average volume, the ", { text: "bid–ask spread", term: "bid-ask" }, " and past swings tell you what a trade may cost and how far it can move. A strong story can already be ", { text: "priced in", term: "priced-in" }, ", so ", { text: "check what you would pay for it", sim: "ac-story-price" }, "."]) },
      { title: "5. Cross-check the conversation", glossaryTermId: "primary-source-filing", ...cardWithSims(["Social feeds show what the people posting think right now, not what every investor thinks. Before acting on a claim, find it in a ", { text: "primary source", term: "primary-source-filing" }, ": a filing, a company release or a dated report from a named outlet."]) },
      { title: "6. Define your downside", glossaryTermId: "position-sizing", ...cardWithSims(["Decide how much you could lose on this idea before choosing ", { text: "how many shares", term: "position-sizing" }, " to buy. Then pick the ", { text: "order type", term: "market-order-vs-limit" }, " and learn ", { text: "how a sale would be taxed", term: "capital-gains-holding-period" }, ". ", { text: "Walk position sizes in a $10,000 account", sim: "ac-downside-sizing" }, "."]) },
    ],
    refs: [
      "route:/tools/market-forces?sim=mf-sim-sentiment-filing",
      "route:/tools/stockanalysis?sim=sa-sim-earnings-week",
      "route:/tools/capstone",
      "practice:/practice/index-style?sim=mk-is-weights",
      "practice:/practice/sectors-rotation?sim=mk-sr-rates",
      "practice:/practice/bonds-rates?sim=mk-br-fed-cut",
      "practice:/practice/plan",
      "glossary:position-sizing",
    ],
    simulations: [THEME_HOLDINGS, INFLATION_WRAPPERS, STORY_PRICE, DOWNSIDE_SIZING],
  },
];

/** Second paragraphs (merged into `CARD_MORE`; keys `unitId::card title`). */
export const BEFORE_YOU_TRADE_MORE: Record<string, string> = {
  "l7-what-you-own::One company":
    "Gold can rise while a miner falls on a cost overrun, a mine outage or new shares. A dividend is not extra return on the day: on the ex-dividend date the price usually drops by about the payout, and a later cut says cash got tighter. Read the company's own filings before a theme headline.",
  "l7-what-you-own::A stock fund":
    "A fund weighted by company size can still lean on a few names, so open the holdings page and read the top ten, their weights and the file's date. The prospectus explains the index, fees and risks in the fund's own words. Two funds with similar names can follow different indexes and hold different companies.",
  "l7-what-you-own::Bond and Treasury bill funds":
    "Check the maturity range or duration and the expense ratio. TIP holds inflation-protected Treasuries, yet it still falls when real yields jump. A T-bill fund's income resets as bills roll over. It is not a bank account and is not FDIC insured. The Bonds and rates page walks duration and a rate cut.",
  "l7-what-you-own::A bullion trust":
    "Each share holds a little less metal every year as the fee is paid. In the U.S., gains on physical-metal trusts can fall under collectibles rules, which can mean a higher long-term rate than most stock gains. Tax rules change and depend on your situation, so check current IRS guidance or a tax professional.",
  "l7-what-you-own::A futures fund":
    "When later contracts cost more, each roll buys fewer of them, so the fund can drift below spot even if spot ends flat. Some of these funds are partnerships that send a Schedule K-1 instead of a 1099, which can arrive late and make filing harder. Read the fund's tax page and prospectus first.",
  "l7-what-you-own::A currency trust":
    "Interest-rate gaps between countries and central-bank surprises are the big drivers, so a currency trust can jump on a policy headline. A dollar-index fund holds a basket weighted toward the euro, so it does not move like every currency. The Currency funds page walks a euro trust when U.S. rate expectations jump.",
  "l7-before-you-trade::1. Know what you own":
    "Market Forces shows this as the exposure badge next to each ticker. Write it in one line, such as 'NEM: one gold-mining company, not gold.' If you cannot say what you would own, stop there. Every later check depends on it, because a fund's holdings and a company's statements answer different questions.",
  "l7-before-you-trade::2. Check the business or the fund":
    "When sites disagree, the company's own 10-K or 10-Q settles it; StockAnalysis and Yahoo Finance summarize the same filings. For a fund, the issuer's page carries the dated holdings file and the prospectus. A theme fund can hold large companies only loosely tied to its name, so weights matter as much as names.",
  "l7-before-you-trade::3. Look for the next catalyst":
    "Earnings dates come from the company's investor-relations page; report dates come from the agency's own calendar, such as the BLS for CPI. A position held through an event can gap past any stop. Markets react to the surprise against expectations, which the Macro Desk lessons practice release by release.",
  "l7-before-you-trade::4. Check the market price":
    "A thin stock with a 10-cent spread costs that spread on every round trip, and a market order can fill worse than the quote. Compare P/E or other multiples with the company's own history and close peers. Past daily swings, such as the average true range, hint at how far a normal day can move against you.",
  "l7-before-you-trade::5. Cross-check the conversation":
    "A burst of posts can come before, after or without any real news, and the SEC warns that coordinated promotion on social media is a common fraud pattern. If the only source is other posts, treat it as a rumor. Write down what the filing actually says and the date you read it.",
  "l7-before-you-trade::6. Define your downside":
    "A common beginner ceiling is risking about 1% of the account on one idea: $100 of $10,000. With a stop $2 below entry that is 50 shares, and a gap can still fill lower. In the U.S., gains on assets held a year or less are generally taxed as short-term; check current IRS rules or a tax professional.",
};

/** Unit quiz items (merged into the L4–L7 bank after `l7-crypto`, so existing answer letters keep their places). */
export const BEFORE_YOU_TRADE_QUIZ_RAW: Record<string, RawItem[]> = {
  "l7-what-you-own": [
    { p: "Gold rises 8%. Which wrapper should track it most closely?", r: "A bullion trust, minus its fee", w: [["One gold miner", "A miner prices its whole business, costs and all."], ["A miner fund", "Miners swing more than the metal both ways."], ["A futures fund", "The roll can leave it behind spot."]], e: "A bullion trust holds metal in a vault, so its price follows the metal minus a yearly fee.", c: ["minus a yearly fee"], g: "physically-backed-trust" },
    { p: "Two funds hold the same index. Fund A charges 0.10% a year and Fund B 0.75%. Over many years…", r: "Fund A usually ends ahead because the fee gap compounds", w: [["They end the same", "The fee comes out every year."], ["Fund B ends ahead because it charges more", "A higher fee is not better management of the same index."], ["Only the first year differs", "The gap grows with the balance."]], e: "Check the expense ratio, because a small fee compounds when two funds hold the same thing.", c: ["expense ratio"], g: "expense-ratio" },
    { p: "Why can a Treasury bill fund such as SGOV not replace a bank account?", r: "It is not FDIC insured and its income changes as bills roll over", w: [["It cannot fall at all", "Its price barely moves, but it is a fund, not a deposit."], ["It pays no income", "It pays income that follows short-term rates."], ["It holds long bonds", "It holds bills maturing within months."]], e: "A T-bill fund is not a bank account and is not FDIC insured; its income resets as bills roll over.", c: ["not FDIC insured"], g: "treasury-bill-fund" },
    { p: "A futures fund ends a year below the spot price it follows, though spot ended flat. The likely reason?", r: "Rolling into pricier later contracts", w: [["A dividend cut", "Futures funds hold contracts, not companies."], ["Its holdings page was out of date", "Not the cause of drift."], ["Currency moves", "Not for a dollar commodity fund."]], e: "When later contracts cost more, each roll buys fewer of them, so the fund can drift below spot.", c: ["each roll buys fewer"], g: "contango" },
    { p: "Which point about bullion trust taxes is a fair, general statement?", r: "Gains can fall under U.S. collectibles rules; check current IRS guidance", w: [["They are always tax-free", "Not so."], ["They send a Schedule K-1", "That is some futures funds."], ["They are taxed like bank interest every year", "Not a general rule."]], e: "In the U.S., gains on physical-metal trusts can fall under collectibles rules; check current IRS guidance or a tax professional.", c: ["collectibles rules"], g: "collectibles-tax" },
  ],
  "l7-before-you-trade": [
    { p: "What is the first of the six checks?", r: "Know what you own", w: [["Check the market price", "That is step 4."], ["Define your downside", "That is the last step."], ["Cross-check the conversation", "That is step 5."]], e: "Start by naming the wrapper; know what you own comes first because every later check depends on it.", c: ["naming the wrapper"], g: "exposure-wrapper" },
    { p: "A post says a company signed a huge contract. What does step 5 ask you to do?", r: "Find the claim in a filing or company release before acting", w: [["Buy before others see it", "Speed is not the check."], ["Count how many people repeat it", "Repetition is not confirmation."], ["Ignore all news", "Not the lesson."]], e: "Find the claim in a primary source: a filing, a company release or a dated report from a named outlet.", c: ["primary source"], g: "primary-source-filing" },
    { p: "Revenue growth stays at 45% but the stock falls 19%. What does step 4 say could explain it?", r: "The story was already priced in at a high multiple", w: [["The company must have lied", "No evidence of that."], ["Growth stopped", "45% is still growth."], ["The spread widened", "Not a 19% move."]], e: "A strong story can already be priced in, so check what you would pay for it, not only the growth.", c: ["priced in"], g: "priced-in" },
    { p: "With a $10,000 account, 1% risk and a stop $2 below entry, how many shares?", r: "50", w: [["100", "That risks 2%, or $200."], ["150", "That risks $300 at a $2 stop."], ["20", "That fits a $5 stop."]], e: "A common ceiling is risking about 1% of the account: $100 of $10,000, and a $2 stop means 50 shares.", c: ["50 shares"], g: "position-sizing" },
    { p: "Before holding a stock through earnings, step 3 asks you to…", r: "Write down the date and remember a gap can pass any stop", w: [["Remove all stops", "Not the check."], ["Assume the report is already priced in", "Check, do not assume."], ["Trade only rumors", "Separate announced from rumored."]], e: "Find the next catalyst and its date; a position held through an event can gap past any stop.", c: ["gap past any stop"], g: "next-catalyst" },
  ],
};

/**
 * TT1 · Market Forces (/tools/market-forces): Weng's beginner ticker directory. Themes and their "connection" line,
 * exposure labels, the five stock research-link groups (including valuation and distributions), fund documents, notes, and index-weight snapshots. Facts come from
 * the app's own data files (data/catalog.json updated 2026-11-12; data/index-weights.json snapshots of 2026-10-08).
 * Simulated layouts drawn in this app's style, no logos. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import { mc, seededTape } from "../marketThemes/helpers";
import type { ToolLesson } from "./types";

/** Counts from Market Forces' data/catalog.json (updated 2026-11-12). */
export const MF_FACTS = { tickers: 87, stocks: 36, funds: 51, themes: 42, assets: 10, industries: 12, markets: 12, forces: 8 } as const;
/** ETF-based index weight estimates in Market Forces' data/index-weights.json, snapshot Oct 8, 2026. */
export const MF_WEIGHTS_AS_OF = "2026-10-08";
export const MF_WEIGHTS = {
  CAT: { sp500: 0.55, djia: 9.23, russell1000: 0.51 },
  NVDA: { sp500: 8.34, djia: 2.67, ndx: 8.33, russell1000: 7.53 },
  NEM: { sp500: 0.18, russell1000: 0.17 },
} as const;

const TERMS: LiteracyTerm[] = [
  { id: "theme-connection", name: "Theme connection", category: "process", summary: "The short line in Market Forces that says how an economic force can reach a group of tickers, and what else matters.", detail: "Gold's connection reads: watch real interest rates, the dollar, central-bank demand and risk sentiment; miners also face business risks. A connection suggests what to research. It is not a forecast of price direction. Educational, not advice." },
  { id: "exposure-label", name: "Exposure label", category: "ownership", summary: "The badge that says what kind of exposure a ticker gives: for example Bullion, Mining stocks, Commodity futures or Currency trust.", detail: "Two tickers in the same theme can behave very differently. GLD (Bullion) holds metal; GDX (Mining stocks) holds businesses; USO (Commodity futures) holds oil contracts, and its returns can differ materially from spot crude. Educational, not advice." },
  { id: "research-starting-point", name: "Research starting point", category: "process", summary: "A directory that links out to where facts live (filings, issuer pages, data sites) without being the source itself.", detail: "Market Forces shows no live prices and makes no picks. Each link group (overview, financials and filings, valuation and distributions, fund documents, news, sentiment) answers a different question; primary sources such as SEC filings and the fund issuer settle disagreements. Educational, not advice." },
  { id: "etf-based-weight-estimate", name: "ETF-based index weight estimate", category: "markets", summary: "An index weight read from the holdings file of a fund that tracks the index, because the official constituent file is licensed.", detail: "Market Forces' S&P 500, Dow, Nasdaq-100 and Russell lines come from SPY, DIA, QQQ and IWB/IWM holdings. They are close to, but not the same as, official index weights, and they are only as fresh as the snapshot date. Educational, not advice." },
  { id: "snapshot-date", name: "Snapshot date", category: "process", summary: "The day a stored number (holdings, weights, a directory list) was captured. Anything after that date is not reflected.", detail: "Before comparing two numbers, check that they come from the same date. Weights in fast-moving companies can shift several points between snapshots. Educational, not advice." },
  { id: "next-catalyst", name: "Next catalyst", category: "process", summary: "An announced event that can move a ticker, such as earnings or a scheduled report, as opposed to a rumor.", detail: "Market Forces' News & the next catalyst group opens a Google News search and a Google search for official press releases. The in-app checklist, \"Before you trade,\" says to separate an announced event from speculation. Educational, not advice." },
  { id: "valuation-distributions", name: "Valuation and distributions", category: "markets", summary: "The stock-only link group for multiples and past payouts, because a good story can already be priced in.", detail: "Valuation & ratios opens Stock Analysis statistics (multiples and key metrics). Dividend history is past payouts, if any, not a promise of future payouts. Market Forces does not compute a fair price. Educational, not advice." },
];

const T1 = seededTape({ seed: 10101, start: 48.2, preDrift: 0.004, postDrift: -0.002, vol: 0.021, gap: 0.035 });
const T2 = seededTape({ seed: 10102, start: 76.5, preDrift: 0.002, postDrift: -0.003, vol: 0.019, gap: 0.02 });
const T3 = seededTape({ seed: 10103, start: 452.4, preDrift: 0.001, postDrift: 0.0005, vol: 0.009, gap: 0.012 });

const CASES: CaseStudy[] = [
  {
    id: "case-mf-gold-theme-hot",
    title: "Market Forces: the gold theme is in the news",
    contextType: "news",
    thinkingMode: "tool_market_forces",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. Gold is in the headlines. You open Market Forces → Gold and see GLD and IAU (Bullion), GDX (Mining stocks), and NEM and B (miners). A gold miner has jumped 3.5% on the day and you want in. Buy = buy the miner now because the theme is hot. Sell = nothing to sell; skip gold forever. Hold = no trade yet: open the miner's income statement, cash flow and next earnings date from its research links, write a note, then decide.",
    newsHeadline: "Gold climbs as real yields ease; miners rally.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "Market Forces says it plainly: a theme suggests a connection, not a guaranteed price direction. A miner is a business with costs, output and execution risk, so the theme only tells you where to start reading. The financials, filings and earnings links answer the questions the headline cannot.",
      whyMarketMoved: "Miners often move more than the metal because their profits depend on the gap between the gold price and their costs.",
      evidence: "SAMPLE: the miner gave back part of the jump over the next four sessions.",
    },
  },
  {
    id: "case-mf-futures-badge",
    title: "Market Forces: the fund said Commodity futures",
    contextType: "news",
    thinkingMode: "tool_market_forces",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. Your written goal was \"track spot crude oil closely for a year\". You bought USO without reading its badge. Market Forces tags it Commodity futures and says its returns can differ materially from spot crude. Spot oil is up on a supply headline, but your fund has lagged it for months. Buy = add more so it catches up. Sell = exit the mismatch and re-plan with a vehicle and horizon that fit your written goal. Hold = keep it and hope the gap closes.",
    newsHeadline: "Crude jumps on supply cut; oil futures fund lags spot.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "The exposure label is the first fact to read. FINRA notes that futures-based funds can perform differently from the commodity's spot price, especially over longer periods. Your goal and the fund's structure did not match, so the plan, not the headline, says to fix it. Holding is partial credit only if you rewrite the goal to fit how the fund works.",
      whyMarketMoved: "Futures funds roll contracts; when later contracts cost more than nearer ones, rolling can drag returns below spot.",
      evidence: "SAMPLE: the fund kept trailing the spot move over the next four sessions.",
    },
  },
  {
    id: "case-mf-dow-one-stock",
    title: "Market Forces: one stock moves the Dow",
    contextType: "news",
    thinkingMode: "tool_market_forces",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. You hold a Dow fund as your core and assumed it acts like the S&P 500. In Market Forces you turn on Index weights and pick CAT: about ${MF_WEIGHTS.CAT.djia}% of the Dow but ${MF_WEIGHTS.CAT.sp500}% of the S&P 500 (ETF-based estimates, snapshot Oct 8, 2026). A Caterpillar earnings beat lifts the Dow far more than the S&P. Buy = add to the Dow fund to ride the move. Sell = dump it on the news. Hold = keep the planned position, write a note that the Dow is price-weighted and concentrated, and review the mix on schedule.`,
    newsHeadline: "Dow outpaces S&P 500 as Caterpillar jumps after earnings.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "The Index weights view shows the same company carrying very different weights in different indexes. SEC Investor.gov explains why: the Dow is price-weighted, so a high-priced share counts for more. One day's move is not a reason to change a plan, but it is a reason to know what you hold. Selling is partial credit if the Dow fund never matched the broad-market role in your plan.",
      whyMarketMoved: "In a price-weighted index, a jump in a high-priced stock moves the index more than the same percent move in a lower-priced one.",
      evidence: "SAMPLE: the fund held most of the move over the next four sessions.",
    },
  },
];

export const MARKET_FORCES_LESSON: ToolLesson = {
  id: "tool-market-forces",
  slug: "market-forces",
  route: "/tools/market-forces",
  menuLabel: "Market Forces",
  icon: "explore",
  title: "Market Forces: start with what moves the market",
  blurb: "Weng's ticker directory: themes, exposure labels, the five stock research-link groups, fund documents, notes and index-weight snapshots.",
  credit: { name: "Market Forces by Weng Fei Fung", url: "https://github.com/Siphon880gh/tickers", note: "A beginner's directory of common U.S.-listed stocks and funds. No live prices; research opens in other sites." },
  asOf: "2026-11-12",
  quiz: { name: "Tool: Market Forces", description: "Themes, exposure labels, the five stock research-link groups, fund documents, notes and index weights in Weng's ticker directory.", icon: "explore" },
  intro: [
    `Market Forces groups ${MF_FACTS.tickers} common tickers (${MF_FACTS.stocks} stocks, ${MF_FACTS.funds} funds) into ${MF_FACTS.themes} themes under four headings: Assets (${MF_FACTS.assets}), Industries (${MF_FACTS.industries}), Markets (${MF_FACTS.markets}) and Economic forces (${MF_FACTS.forces}). Counts are from its catalog file dated Nov 12, 2026.`,
    "It is a starting point, not a data source. It shows no live prices and makes no picks; every research link opens another site, and some of those need a sign-in or subscription.",
    "This lesson walks the layout: pick a theme, read its connection line, read each ticker's exposure badge, then — for a stock — walk all five research-link groups (overview, financials, valuation, news, sentiment), keep notes, and use Index weights to see where a company sits in the big indexes.",
  ],
  screens: [
    {
      id: "mf-theme",
      title: "Pick a theme and read the connection",
      where: "Directory · Assets › Gold",
      alt: "Simulated Market Forces directory. A theme list with Gold selected, a search bar with a Show filter set to stocks and funds, a Gold panel with its description and connection line, and a table of five tickers with kind and exposure columns.",
      caption: "The theme view. The ticker list is Market Forces' real Gold theme; the layout is simulated.",
      blocks: [
        { kind: "chips", title: "Themes", chips: [`All tickers (${MF_FACTS.tickers})`, "Gold (5)", "Silver", "Oil & energy", "Interest rates", "U.S. dollar"], active: 1 },
        { kind: "filters", title: "Find a theme, company, or ticker", filters: [{ label: "Search", value: "Try gold, technology, large cap, or AAPL" }, { label: "Show", value: "Stocks & funds" }, { label: "Index weights", value: "Off" }, { label: "Has notes", value: "Off" }] },
        { kind: "note", text: "Assets · Gold — Research the metal itself or the businesses that mine it. The connection: watch real interest rates, the dollar, central-bank demand, and risk sentiment. Gold miners also face business and operating risks." },
        { kind: "table", title: "Common tickers · 5 tickers", columns: ["Ticker", "Name", "Kind", "Exposure"], rows: [["GLD", "SPDR Gold Shares", "Fund", "Bullion"], ["IAU", "iShares Gold Trust", "Fund", "Bullion"], ["GDX", "VanEck Gold Miners ETF", "Fund", "Mining stocks"], ["NEM", "Newmont", "Stock", "Gold miner"], ["B", "Barrick Mining", "Stock", "Gold & copper miner"]] },
      ],
      callouts: [
        { n: 1, block: 0, text: "Themes sit under Assets, Industries, Markets and Economic forces. The count is how many tickers the theme lists." },
        { n: 2, block: 1, text: "Search matches symbols, names, exposures and theme tags. Show narrows to stocks only or funds only." },
        { n: 3, block: 2, text: "The connection line says what to watch. It suggests a link, not a price direction." },
        { n: 4, block: 3, text: "Exposure tells you what you would own: metal in a trust, a basket of miners, or one mining business." },
      ],
    },
    {
      id: "mf-stock-links",
      title: "Research links for a stock",
      where: "Research panel · NEM selected",
      alt: "Simulated Market Forces research panel for Newmont, a stock. A summary of ticker, kind and exposure, then the five link groups a stock receives, in the order they appear: overview and analysis, financials and primary sources, valuation and distributions, news and the next catalyst, and sentiment and investor discussions.",
      caption: "A stock panel has five link groups. Group titles match the app; the layout is simulated.",
      blocks: [
        { kind: "stats", title: "Selected ticker · research links", rows: [{ label: "Ticker", value: "NEM" }, { label: "Kind", value: "Stock" }, { label: "Exposure", value: "Gold miner" }, { label: "Themes", value: "Gold, Materials" }] },
        { kind: "table", title: "The five groups on a stock panel", columns: ["Group", "What it helps you answer"], rows: [["Overview & analysis", "A snapshot on data sites, plus estimates"], ["Financials & primary sources", "Statements, official filings, and the company itself"], ["Valuation & distributions", "Multiples and past payouts, if any"], ["News & the next catalyst", "Headlines and announced events"], ["Sentiment & investor discussions", "What people posting are saying"]] },
        { kind: "note", text: "The in-app checklist, \"Before you trade,\" walks the same ground: know what you own, check the business, look for the next catalyst, check the market price, then cross-check the conversation." },
      ],
      callouts: [
        { n: 1, block: 0, text: "The badge says Stock, so the panel offers company financials and valuation. A fund gets holdings and documents instead." },
        { n: 2, block: 1, text: "These five group titles are the ones in Market Forces. The next screens open each group, with every link the app actually shows." },
        { n: 3, block: 2, text: "Primary facts before headlines, and headlines before sentiment. The last checklist step, defining your downside, is a decision you make; it is not a link." },
      ],
    },
    {
      id: "mf-stock-overview",
      title: "Overview & analysis",
      where: "Research panel · NEM · Overview & analysis",
      alt: "Simulated Market Forces overview and analysis group for Newmont. Four links: Stock Analysis for overview and key facts, drawn as the visually emphasized starting overview, Finviz for a chart, stats and headlines, Yahoo chart for price history and volume, and Analyst views for estimates and opinion.",
      caption: "Link names and the Opens lines match the app. In the real panel, Stock Analysis is the visually emphasized overview.",
      blocks: [
        { kind: "stats", title: "Selected ticker", rows: [{ label: "Ticker", value: "NEM" }, { label: "Kind", value: "Stock" }, { label: "Exposure", value: "Gold miner" }] },
        { kind: "table", title: "Overview & analysis", columns: ["Link", "Opens"], rows: [["Stock Analysis", "Overview & key facts"], ["Finviz", "Chart, stats & headlines"], ["Yahoo chart", "Price history & volume"], ["Analyst views", "Estimates & opinion"]] },
        { kind: "note", text: "Market Forces itself has no live prices. These overview links open other sites; some need a sign-in or a subscription." },
      ],
      callouts: [
        { n: 1, block: 1, text: "Stock Analysis is the visually emphasized starting overview (a navy button in the real app). The other three sit with it in this group." },
        { n: 2, block: 1, text: "Finviz and Yahoo chart are the tools in the next Tool Training lessons. Chart-reading practice stays in Charting apps compared." },
        { n: 3, block: 1, text: "Analyst views is labeled Estimates & opinion: targets and forecasts are not facts, and they often disagree." },
        { n: 4, block: 2, text: "Every research link opens in a new tab. This directory is not the data source." },
      ],
    },
    {
      id: "mf-stock-financials",
      title: "Financials & primary sources",
      where: "Research panel · NEM · Financials & primary sources",
      alt: "Simulated Market Forces financials and primary sources group for Newmont. Seven links: financials overview, income statement, balance sheet, cash flow, SEC filings, Find investor relations as a Google search, and Earnings and guidance as a Google search.",
      caption: "All seven links from the app, including Financials overview, which the shorter earlier screen left out. For NEM, investor relations and earnings are Google searches.",
      blocks: [
        { kind: "stats", title: "Selected ticker", rows: [{ label: "Ticker", value: "NEM" }, { label: "Kind", value: "Stock" }, { label: "Official URL in the catalog", value: "None stored" }] },
        { kind: "table", title: "Financials & primary sources", columns: ["Link", "Opens"], rows: [["Financials overview", "All statements"], ["Income statement", "Revenue & profit"], ["Balance sheet", "Assets, debt & equity"], ["Cash flow", "Cash in & cash out"], ["SEC filings", "Official reports"], ["Find investor relations", "Google search"], ["Earnings & guidance", "Google search"]] },
        { kind: "note", text: "When two data sites disagree about a figure, open SEC filings. Those are the company's official reports. Data sites summarize them." },
      ],
      callouts: [
        { n: 1, block: 1, text: "Financials overview opens all statements on Stock Analysis. The next three links go straight to the income statement, balance sheet and cash flow." },
        { n: 2, block: 1, text: "SEC filings open the company's official reports on SEC EDGAR. When sites disagree, these settle what the company reported." },
        { n: 3, block: 0, text: "Market Forces only shows Investor relations when the catalog has a stored official URL. For NEM that field is empty, so the link is Find investor relations and opens a Google search. Confirm you landed on the company's own site." },
        { n: 4, block: 1, text: "Earnings & guidance is also a Google search. Market Forces does not store the next earnings date." },
      ],
    },
    {
      id: "mf-stock-valuation",
      title: "Valuation & distributions",
      where: "Research panel · NEM · Valuation & distributions",
      alt: "Simulated Market Forces valuation and distributions group for Newmont, a stock-only group. Two links: Valuation and ratios for multiples and key metrics, and Dividend history for past payouts, if any.",
      caption: "This group appears only on a stock panel. Link names match the app. Market Forces does not compute a fair price.",
      blocks: [
        { kind: "table", title: "Valuation & distributions", columns: ["Link", "Opens"], rows: [["Valuation & ratios", "Multiples & key metrics"], ["Dividend history", "Past payouts, if any"]] },
        { kind: "note", text: "The in-app checklist puts this under \"check the market price\": valuation, trading volume, the bid–ask spread, and past price swings help you understand what a trade may cost. A good story can already be priced in." },
        { kind: "note", text: "These links open Stock Analysis statistics and dividend history. They are starting points, not a buy or sell recommendation, and past payouts are not a promise of future payouts." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Valuation & ratios opens the Stock Analysis statistics page: multiples and key metrics, each with the site's own as-of labels." },
        { n: 2, block: 0, text: "Dividend history is past payouts, if any. A company that paid a dividend before may reduce or stop it." },
        { n: 3, block: 1, text: "Market Forces has no live prices and does not compute whether a stock is cheap or expensive. The checklist's reminder is that a good story can already be in the price." },
        { n: 4, block: 2, text: "A fund panel does not have this group. Funds show holdings, fees and the prospectus instead." },
      ],
    },
    {
      id: "mf-stock-news-sentiment",
      title: "News, catalysts and sentiment",
      where: "Research panel · NEM · News and Sentiment",
      alt: "Simulated Market Forces news and sentiment groups for Newmont. News and the next catalyst lists Google News and press releases. Sentiment and investor discussions lists Stocktwits, a Reddit search, an X cashtag search that may need a sign-in, and Seeking Alpha for analysis and comments. A notes box sits under the links.",
      caption: "The app keeps news and sentiment as two groups, not one. Seeking Alpha sits with sentiment. Notes stay in this browser.",
      blocks: [
        { kind: "table", title: "News & the next catalyst", columns: ["Link", "Opens"], rows: [["Google News", "Ticker + name news search"], ["Press releases", "Google search"]] },
        { kind: "table", title: "Sentiment & investor discussions", columns: ["Link", "Opens"], rows: [["Stocktwits", "Ticker feed & sentiment"], ["Reddit search", "Recent ticker discussions"], ["X cashtag search", "Recent posts · sign-in may apply"], ["Seeking Alpha", "Analysis & comments"]] },
        { kind: "note", text: "Notes for NEM: \"Q3 cash flow fell; next earnings date to check against the filing, not a social post.\" Notes and saved tickers stay in this browser only." },
      ],
      callouts: [
        { n: 1, block: 0, text: "News & the next catalyst is for headlines and announced events (earnings, reports, policy dates). The checklist says to separate an announced event from speculation. Press releases is a Google search, not a stored feed." },
        { n: 2, block: 1, text: "Sentiment shows what people posting think, not what all investors think. SEC Investor.gov warns that social media can give a false impression of consensus." },
        { n: 3, block: 1, text: "Seeking Alpha is labeled Analysis & comments: it is opinion, in the same group as Stocktwits, Reddit and X. X may ask you to sign in; this app never logs in for you." },
        { n: 4, block: 2, text: "Write a dated note, and cross-check any claim in a post against the SEC filing. Notes stay on this device; the in-app guide can back them up." },
      ],
    },
    {
      id: "mf-fund-links",
      title: "Research links for a fund",
      where: "Research panel · GLD selected",
      alt: "Simulated Market Forces research panel for SPDR Gold Shares, a fund with a Bullion exposure badge. A fund holdings and documents group lists the issuer, holdings, fees and prospectus links.",
      caption: "Funds get issuer, holdings, fees and prospectus links. Bullion and futures funds send holdings to the issuer.",
      blocks: [
        { kind: "stats", title: "Selected ticker · research links", rows: [{ label: "Ticker", value: "GLD" }, { label: "Kind", value: "Fund" }, { label: "Exposure", value: "Bullion" }, { label: "Issuer", value: "State Street" }] },
        { kind: "table", title: "Fund holdings & documents", columns: ["Link", "Opens"], rows: [["Fund issuer", "Official source"], ["Holdings & exposure", "Issuer details"], ["Fees & structure", "Expense ratio & fund facts"], ["Reports & prospectus", "Google search"]] },
        { kind: "chips", title: "Also in these themes", chips: ["Gold", "Commodity market", "Inflation", "U.S. dollar"] },
      ],
      callouts: [
        { n: 1, block: 0, text: "Issuer and exposure come first. A bullion trust holds metal, not companies." },
        { n: 2, block: 1, text: "For bullion, currency-trust and futures funds, Holdings links to the issuer, because a stock list would not describe them." },
        { n: 3, block: 2, text: "One ticker can sit in several themes. GLD appears under Gold, Commodity market, Inflation and U.S. dollar." },
      ],
    },
    {
      id: "mf-index-weights",
      title: "Index weights: where the weight sits",
      where: "Index weights mode · CAT and NVDA picked",
      alt: "Simulated Market Forces index weights view. Caterpillar is about 9.23 percent of the Dow but 0.55 percent of the S&P 500. Nvidia is about 8.34 percent of the S&P 500 and 2.67 percent of the Dow. Each line is an ETF-based estimate with an October 8, 2026 snapshot date.",
      caption: `Index weights from Market Forces' stored snapshot (ETF-based estimates, ${MF_WEIGHTS_AS_OF}). Newer fund files will differ.`,
      blocks: [
        { kind: "filters", filters: [{ label: "Index weights", value: "On" }, { label: "Picked", value: "CAT, NVDA" }] },
        { kind: "table", title: "CAT · Caterpillar", columns: ["Index", "Weight", "Quality · snapshot"], rows: [["Dow Jones Industrial Average", `${MF_WEIGHTS.CAT.djia}%`, "ETF-based estimate · Oct 8, 2026"], ["S&P 500", `${MF_WEIGHTS.CAT.sp500}%`, "ETF-based estimate · Oct 8, 2026"], ["Russell 1000", `${MF_WEIGHTS.CAT.russell1000}%`, "ETF-based estimate · Oct 8, 2026"]] },
        { kind: "table", title: "NVDA · Nvidia", columns: ["Index", "Weight", "Quality · snapshot"], rows: [["S&P 500", `${MF_WEIGHTS.NVDA.sp500}%`, "ETF-based estimate · Oct 8, 2026"], ["Nasdaq-100", `${MF_WEIGHTS.NVDA.ndx}%`, "ETF-based estimate · Oct 8, 2026"], ["Russell 1000", `${MF_WEIGHTS.NVDA.russell1000}%`, "ETF-based estimate · Oct 8, 2026"], ["Dow Jones Industrial Average", `${MF_WEIGHTS.NVDA.djia}%`, "ETF-based estimate · Oct 8, 2026"]] },
        { kind: "note", text: "Not available as an official file: S&P and FTSE Russell license full constituent weights, and Nasdaq's live file needs a login. A fund is usually not a member of the index it tracks." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Index weights swaps the research panel for a weights panel. Check one or more tickers." },
        { n: 2, block: 1, text: "Same company, very different weights. The Dow is price-weighted; the S&P 500 is market-cap weighted." },
        { n: 3, block: 2, text: "Read the quality label and the snapshot date before comparing with any other source." },
        { n: 4, block: 3, text: "The limits list says what the app could not get, and why." },
      ],
    },
  ],
  walkthroughs: [
    {
      title: "From a headline to a research plan in five minutes",
      steps: [
        "Search the headline's subject (for example \"gold\" or \"rates\") and open the matching theme.",
        "Read the connection line and write down the one or two forces it names.",
        "Read every exposure badge in the list. Decide whether you mean the asset, a basket of businesses or one business.",
        "Select one ticker. For a stock, walk all five groups: overview, financials and SEC filings, valuation and distributions, news (the next catalyst), then sentiment. For a fund, open the issuer, holdings and fees.",
        "On a stock, treat Find investor relations and Earnings & guidance as Google searches when the catalog has no stored official URL; confirm you reached the company's own site. When two sites disagree, open SEC filings.",
        "Open news for announced events, then valuation (a good story can already be priced in), then sentiment. Note anything a post claims that a filing does not show.",
        "Add a note with what you found and the date, so the next visit starts where you left off.",
      ],
    },
    {
      title: "Check concentration with Index weights",
      steps: [
        "Turn on Index weights and check the companies you already own through funds.",
        "Read the weight in each index, the quality label and the snapshot date.",
        "If one company is a large share of your main index, write that down before adding a fund that leans on it again.",
      ],
    },
  ],
  drills: [
    { id: "mf-d1", prompt: "GLD and GDX are both in the Gold theme. The difference is…", options: ["None; both hold gold", "GLD holds bullion; GDX holds mining companies", "GDX holds bullion; GLD holds miners", "GLD is a futures fund"], answer: 1, why: "The exposure badges say Bullion and Mining stocks." },
    { id: "mf-d2", prompt: "Which link group should you open first to check a company's debt?", options: ["Sentiment", "News", "Financials & primary sources", "Index weights"], answer: 2, why: "The balance sheet link sits under Financials & primary sources." },
    { id: "mf-d3", prompt: "Where are Market Forces notes stored?", options: ["In your brokerage account", "On a shared server", "In this browser only", "In the SEC filing"], answer: 2, why: "Notes are saved in the browser's local storage, so they do not follow you to another device." },
    { id: "mf-d4", prompt: `CAT is ${MF_WEIGHTS.CAT.djia}% of the Dow but ${MF_WEIGHTS.CAT.sp500}% of the S&P 500. Why?`, options: ["Data error", "The Dow is price-weighted", "The S&P 500 excludes industrials", "CAT is not in the S&P 500"], answer: 1, why: "SEC Investor.gov: in a price-weighted index, higher-priced shares count for more." },
    { id: "mf-d5", prompt: "A theme's connection line tells you…", options: ["Which way prices will go", "What to research and watch", "The best ticker to buy", "Today's price"], answer: 1, why: "Market Forces: a theme suggests a connection, not a guaranteed price direction." },
    { id: "mf-d6", prompt: "Which stock-only group covers multiples and past payouts?", options: ["Sentiment & investor discussions", "News & the next catalyst", "Valuation & distributions", "Fund holdings & documents"], answer: 2, why: "Valuation & distributions appears only on a stock panel: Valuation & ratios, and Dividend history (past payouts, if any)." },
    { id: "mf-d7", prompt: "For NEM, Find investor relations opens…", options: ["A stored Newmont IR URL", "A Google search, because the catalog has no official URL", "The SEC company search", "Yahoo Finance"], answer: 1, why: "Market Forces only uses a stored Investor relations URL when the catalog has one. For NEM the field is empty." },
    { id: "mf-d8", prompt: "Analyst views is labeled…", options: ["Audited results", "Official guidance", "Estimates & opinion", "Index weights"], answer: 2, why: "The app's own Opens line says Estimates & opinion: targets are not facts." },
  ],
  caveats: [
    { title: "No live prices", text: "Market Forces has no quotes. Use the overview links for prices, and check each site's as-of time." },
    { title: "Snapshots age", text: `The catalog is dated Nov 12, 2026 and index weights Oct 8, 2026. Fund holdings change daily, so newer files will show different weights.` },
    { title: "Third-party sites", text: "Links open other companies' sites. They are credited, not endorsed; some need a sign-in or subscription, and this app never logs in for you." },
    { title: "Examples, not picks", text: "The directory lists common tickers as research starting points, not buy or sell recommendations." },
  ],
  sources: [
    { label: "Market Forces source code and data (GitHub)", url: "https://github.com/Siphon880gh/tickers", supports: "Theme groups and counts, exposure labels, the five stock research-link groups (including valuation and distributions, and Google-search fallbacks when no official URL is stored), fund documents, notes in local storage, index-weight snapshots and their limits" },
    { label: "SEC Investor.gov: Investor Bulletin — Index funds", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-26", supports: "Market-cap vs price weighting; the Dow is price-weighted" },
    { label: "FINRA: Futures and commodities", url: "https://www.finra.org/investors/investing/investment-products/futures-and-commodities", supports: "Futures-based funds can differ from spot prices" },
    { label: "SEC: Beginners' guide to financial statements", url: "https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements", supports: "What the income statement, balance sheet and cash flow statement show" },
    { label: "SEC Investor.gov: Social media and investment fraud — Investor Alert", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/social-media-and-investment-fraud-investor-alert", supports: "Social media can give a false impression of consensus; verify against company filings" },
  ],
  links: [
    { label: "Learn → Tool: Market Forces", to: "/training?group=tool-market-forces" },
    { label: "Coach → Tour Market Forces", to: "/coach/market-forces-tour" },
    { label: "Practice → Exposure wrappers", to: "/practice/exposure-wrappers" },
    { label: "Practice → Index and style", to: "/practice/index-style" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
    { label: "Tool Training overview", to: "/tools" },
  ],
  mode: "tool_market_forces",
  modeLabel: "Market Forces: theme, badge, primary source",
  modeTip:
    "Start from the theme's connection line, read every exposure badge, then open the financials or fund documents, then news and valuation, then sentiment. Write a dated note. Cases → Market-wide news.",
  questions: [
    mc("MF-01", "Market Forces is best described as…", "B", "A directory of starting points that links out to research", ["A live quote screen", "A stock-picking service", "A brokerage"], "It shows no live prices and makes no picks; links open other sites.", "research-starting-point"),
    mc("MF-02", "Which four headings group the themes?", "A", "Assets, Industries, Markets, Economic forces", ["Buy, Hold, Sell, Watch", "Stocks, Bonds, Cash, Crypto", "Daily, Weekly, Monthly, Yearly"], `Its catalog has ${MF_FACTS.themes} themes under those four headings.`, "theme-connection"),
    mc("MF-03", "A theme's connection line…", "C", "Names forces to watch, not a guaranteed price direction", ["Predicts next week's move", "Ranks the best ticker", "Shows the live price"], "The app's own note: a theme suggests a connection, not a guaranteed price direction.", "theme-connection"),
    mc("MF-04", "GLD's exposure badge says Bullion. That means it…", "D", "Holds physical gold in a trust", ["Holds gold mining companies", "Holds gold futures", "Pays a fixed interest rate"], "Bullion trusts hold metal; mining funds hold businesses.", "exposure-label"),
    mc("MF-05", "USO's badge says Commodity futures. A key consequence is…", "B", "Its returns can differ materially from spot crude", ["It always matches spot oil", "It holds oil companies", "It has no costs"], "FINRA and the fund's own description: futures funds can drift from spot prices.", "exposure-label"),
    mc("MF-06", "You select a stock. Which group is unique to stocks?", "A", "Financials & primary sources", ["News & the next catalyst", "Sentiment & investor discussions", "Overview & analysis"], "Funds get Fund holdings & documents instead of Financials & primary sources and Valuation & distributions.", "research-starting-point"),
    mc("MF-07", "For a bullion or futures fund, Holdings & exposure links to…", "C", "The fund issuer's page", ["A list of stocks", "Reddit", "The SEC company search"], "A stock list would not describe metal or futures, so the app sends you to the issuer.", "exposure-label"),
    mc("MF-08", "Two sites disagree about a company's debt. Which link settles it?", "D", "SEC filings", ["Stocktwits", "X cashtag search", "Google News"], "Filings are the company's official reports; data sites summarize them.", "research-starting-point"),
    mc("MF-09", "The sentiment links show…", "B", "What people posting think, not all investors", ["Official company guidance", "A poll of every shareholder", "Audited results"], "SEC Investor.gov warns social media can give a false impression of consensus.", "research-starting-point"),
    mc("MF-10", "Market Forces notes are saved…", "A", "In this browser only", ["In the cloud for every device", "With your broker", "In the SEC filing"], "Notes use the browser's local storage; clearing site data removes them.", "snapshot-date"),
    mc("MF-11", `In the Index weights view, CAT is ${MF_WEIGHTS.CAT.djia}% of the Dow but ${MF_WEIGHTS.CAT.sp500}% of the S&P 500. Why?`, "C", "The Dow is price-weighted; the S&P 500 is cap-weighted", ["CAT is not an S&P 500 member", "The app has a bug", "The Dow excludes industrials"], "SEC Investor.gov describes both weighting methods.", "etf-based-weight-estimate"),
    mc("MF-12", "Market Forces' index weights are labeled ETF-based estimates because…", "B", "Official constituent files are licensed, so weights come from funds that track each index", ["The app guesses them", "Indexes have no weights", "ETFs set index rules"], "The limits list names S&P, FTSE Russell and Nasdaq licensing or login.", "etf-based-weight-estimate"),
    mc("MF-13", "Another site shows a different NVDA weight in the S&P 500 than Market Forces. First check…", "D", "The snapshot dates of both numbers", ["Which one is larger", "Social media", "Nothing; one is wrong"], `Market Forces' weights are from ${MF_WEIGHTS_AS_OF}; holdings change daily.`, "snapshot-date"),
    mc("MF-14", "A good order for researching a new ticker in Market Forces is…", "A", "Theme and badge, then financials or fund documents, then news and valuation, then sentiment", ["Sentiment first, then decide", "News only", "Price chart only"], "Follow the in-app checklist: primary facts first, then the next catalyst and the market price, then sentiment, cross-checked against filings.", "research-starting-point"),
    mc("MF-15", "Besides financials, which other group appears only on a stock panel?", "C", "Valuation & distributions", ["Fund holdings & documents", "Overview & analysis", "News & the next catalyst"], "Valuation & distributions (multiples and past payouts) is stock-only. Funds get Fund holdings & documents instead.", "valuation-distributions"),
    mc("MF-16", "For NEM, Find investor relations opens…", "B", "A Google search, because the catalog has no stored official URL", ["Newmont's IR page stored in the catalog", "The 10-K itself", "A Yahoo Finance profile"], "Market Forces only uses a stored Investor relations URL when the catalog has one. For NEM the field is empty; confirm you reached the company's own site.", "research-starting-point"),
    mc("MF-17", "Analyst views is labeled Estimates & opinion because…", "A", "Targets and forecasts are not facts, and they often disagree", ["They are audited results", "They always match the SEC filing", "Market Forces computes the targets"], "The app's own Opens line says Estimates & opinion.", "research-starting-point"),
    mc("MF-18", "The group News & the next catalyst is for…", "D", "Headlines and announced events, kept separate from sentiment", ["Official audited financials", "Index membership weights", "A poll of every shareholder"], "The in-app checklist: look for the next catalyst, and separate an announced event from speculation. Sentiment is a later, separate group.", "next-catalyst"),
    mc("MF-19", "Dividend history under Valuation & distributions shows…", "B", "Past payouts, if any, not a promise of future payouts", ["The dividend the company will pay next year", "Only cash still on the balance sheet", "A buy or sell rating"], "The app's own Opens line is Past payouts, if any.", "valuation-distributions"),
  ],
  terms: TERMS,
  cases: CASES,
};

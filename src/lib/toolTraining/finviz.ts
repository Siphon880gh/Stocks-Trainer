/**
 * TT3 · Finviz (/tools/finviz): the screener (filter tabs, views, signals), the quote page's snapshot table, the
 * insider and analyst tables, and what a free account gets versus Elite. Public pages read on Nov 12, 2026, before the
 * open; nothing behind a login. Charting features are compared in /practice/charting-apps and not repeated here.
 * Credited, not endorsed. Simulated layouts, no logos. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import { mc, seededTape } from "../marketThemes/helpers";
import type { ToolLesson, ToolSimulation } from "./types";
import { finvizQuote, finvizScreener, finvizPlans } from "./liveLinks";
import { simBar } from "./simWalk";

export const FV_READ_ON = "2026-11-12";
/** Finviz NEM quote page, read Nov 12, 2026; header stamped 8:25 AM ET, before the 9:30 AM open. */
export const FV_NEM = {
  price: 115.56, change: -2.91, changePct: -2.46, stamp: "Nov 12 • 8:25 AM ET", prevClose: 118.47,
  index: "S&P 500, RUI", marketCap: "120.09B", pe: 13.42, fwdPe: 11.61, epsTtm: 8.61, shortFloat: "1.66%",
  insiderOwn: "0.11%", instOwn: "83.45%", perfYtd: "15.73%", perfYear: "24.16%", recom: 1.72, target: 137.64,
  relVolume: 0.12, sma200: "2.97%", ratings: "10 Buy · 4 Hold · 1 Sell", analysts: 15,
} as const;
/** Finviz screener, Industry = Gold, read Nov 12, 2026 before the open. */
export const FV_GOLD_SCREEN = { total: 56, pages: 3, rowsPerPage: 20 } as const;
/** Finviz Elite page, read Nov 12, 2026 (promotions aside). */
export const FV_ELITE = { monthly: "$39.50", annual: "$299.50", freeStatements: 3, eliteStatements: 8 } as const;

const TERMS: LiteracyTerm[] = [
  { id: "stock-screener", name: "Stock screener", category: "process", summary: "A tool that filters a whole market down to the stocks matching criteria you choose, such as industry, size or valuation.", detail: `A screen is a list to research, not a list to buy. Finviz's Industry = Gold screen returned ${FV_GOLD_SCREEN.total} stocks on Nov 12, 2026, from large miners to companies worth about $10 million with almost no volume. Educational, not advice.` },
  { id: "screener-signal", name: "Screener signal", category: "process", summary: "A preset list a screener builds from one event or reading, such as unusual volume, overbought or oversold by RSI(14), or chart patterns.", detail: "Finviz's help describes signals as special events on which traders usually enter or exit. A signal says something happened; it does not say why or what comes next. Educational, not advice." },
  { id: "relative-volume", name: "Relative volume", category: "markets", summary: "Today's volume divided by the 3-month average, adjusted for the time of day.", detail: `Finviz defines it this way. Before the open, relative volume is tiny (Newmont read ${FV_NEM.relVolume} at 8:25 AM ET), so read the time stamp with it. Educational, not advice.` },
  { id: "form-4-insider-sale", name: "Form 4 and Form 144", category: "process", summary: "Form 4 reports an insider's completed trade within two business days; Form 144 is a notice of a proposed sale by an affiliate.", detail: "SEC Investor.gov: insiders may sell for many reasons, including liquidity and diversification. Finviz lists both as rows (Sale, Proposed Sale), so one trade can appear twice. Educational, not advice." },
  { id: "delayed-quote", name: "Delayed quote", category: "markets", summary: "A price shown some minutes after it traded, common on free market data sites.", detail: "Finviz's free pages said stock quotes are delayed by 1 minute and futures and options by 15 minutes (Nov 12, 2026); Elite is real-time including pre-market and after-hours. Educational, not advice." },
];

const T1 = seededTape({ seed: 10301, start: 0.78, preDrift: 0.01, postDrift: -0.02, vol: 0.06, gap: 0.4 });
const T2 = seededTape({ seed: 10302, start: 42.6, preDrift: -0.006, postDrift: -0.002, vol: 0.022, gap: -0.03 });
const T3 = seededTape({ seed: 10303, start: 120.8, preDrift: 0.001, postDrift: 0.0005, vol: 0.014, gap: -0.015 });

const CASES: CaseStudy[] = [
  {
    id: "case-fv-tiny-top-gainer",
    title: "Finviz: the top of the sorted screen",
    contextType: "news",
    thinkingMode: "tool_finviz",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You run a Finviz screen for Industry = Gold and sort by Change %. The top row is a company worth about $10 million, up 40% today on a few thousand shares, with no P/E. Buy = buy it before it runs further. Sell = nothing to sell. Hold = no trade: add Market Cap and Average Volume filters to the screen, then open the quote page, news and filings for anything that survives.",
    newsHeadline: "Micro-cap gold explorer jumps 40% on thin volume.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "A sort shows what moved most, and the smallest, least-traded stocks move most. SEC Investor.gov warns that microcap stocks are more open to manipulation. Size and volume filters remove names you could not trade sensibly; research comes after the screen, not instead of it.",
      whyMarketMoved: "Thin trading lets a few orders move the price a long way in both directions.",
      evidence: "SAMPLE: the stock gave back most of the jump over the next four sessions.",
    },
  },
  {
    id: "case-fv-oversold-signal",
    title: "Finviz: the Oversold signal",
    contextType: "news",
    thinkingMode: "tool_finviz",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. Finviz's Oversold signal (RSI(14) after a sharp two-week fall) lists a company you have heard of. The site's help says oversold stocks may represent a buying opportunity. Your written plan has no rule for signals. Buy = buy because it is oversold. Sell = nothing to sell. Hold = no trade yet: open the quote page's news for why it fell, then the financials, and decide whether it fits your plan.",
    newsHeadline: "Retailer slides for a second week after cutting guidance.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "A signal is a reading, not a reason. Oversold says the price fell fast; the news says why (here, a guidance cut), and a lower outlook can keep a stock falling. Tools are credited, not endorsed: their help pages describe what traders often do, not what you should do.",
      whyMarketMoved: "Analysts kept cutting estimates after the guidance change, and the price followed.",
      evidence: "SAMPLE: the stock kept drifting lower over the next four sessions.",
    },
  },
  {
    id: "case-fv-insider-sale-post",
    title: "Finviz: \"insiders are dumping\"",
    contextType: "news",
    thinkingMode: "tool_finviz",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You hold a planned position. A post shares a screenshot of the Finviz insider table: an officer's Proposed Sale and a Sale of the same 8,000 shares on the same day. The post says \"insiders are dumping\". Buy = add to prove them wrong. Sell = exit now. Hold = keep the plan: open the Form 4, compare the shares sold with what the officer still owns, and note that the two rows are one trade.",
    newsHeadline: "Officer sells shares; social posts claim insiders are exiting.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "Form 144 gives notice of a proposed sale; Form 4 reports the completed trade, so they often appear as two rows for one sale. SEC Investor.gov notes insiders sell for many reasons, including liquidity and diversification. One officer's sale, small against their holdings, does not change a plan.",
      whyMarketMoved: "The post drew attention, but no new company information came out.",
      evidence: "SAMPLE: the stock moved sideways over the next four sessions.",
    },
  },
];

/** Bar-by-bar walk for the screener-signal habit. SAMPLE tape; Finviz's own signal is described, not reproduced. */
const FV_SIMULATIONS: ToolSimulation[] = [
  {
    kind: "bars",
    id: "fv-sim-signal",
    title: "A screener signal fires: research it before reacting",
    goal: "A signal says what the price did, not why. Step through 8 SAMPLE daily bars: the headline, the fall, the day an Oversold-style signal lists the stock, and what you check before treating it as a reason.",
    tape: "SAMPLE company · daily bars · simulated",
    start: 2,
    bars: [
      simBar("D1", [42, 42.6, 41.7, 42.3], "Before the fall: the SAMPLE stock trades near 42.", "Signals are computed from price alone. Knowing where the price sat before the move tells you how big the move the signal describes really is."),
      simBar("D2", [42.3, 42.5, 41.4, 41.6], "A small slip to 41.60.", "Nothing to act on. A screen run today would not list this stock; remember that a list is a snapshot of one moment."),
      simBar("News", [38.9, 39.4, 37.8, 38.2], "Headline: the company cuts its outlook. The stock gaps from 41.60 to 38.90 and closes at 38.20.", "This is the reason for the fall. The signal will fire days later and won't mention it, which is why you open the quote page's news rows before trusting any signal.", { mark: "news" }),
      simBar("D4", [38.2, 38.5, 36.6, 36.9], "Selling continues: close 36.90.", "A lower outlook changes what the business is expected to earn. Price can keep adjusting for days; the bars alone don't tell you when that ends."),
      simBar("D5", [36.9, 37.2, 35.4, 35.7], "Another lower close, 35.70.", "Count the fall from the pre-news close (41.60), not from the bar that looks worst. You are measuring the move the signal will summarize."),
      simBar("Signal", [35.7, 36, 34.6, 34.9], "An Oversold-style signal (RSI(14) after a sharp fall) lists the stock at 34.90.", "A signal is a reading, not a reason. Finviz's help says oversold stocks may represent a buying opportunity; in this app that is the tool's description, to check against the outlook cut you already saw.", { mark: "signal" }),
      simBar("D7", [34.9, 35.8, 34.5, 35.5], "A bounce to 35.50.", "One up day after a signal proves nothing. Read the snapshot's time stamp (free quotes are delayed) and check whether analysts' estimates changed after the outlook cut."),
      simBar("D8", [35.5, 35.6, 33.8, 34.1], "Lower again: 34.10, below the signal day.", "A lower outlook can keep a stock falling after an oversold reading. Your written plan decides, not the signal; if the plan has no rule for signals, this is research, not a trade."),
    ],
    takeaway: "Signal → news rows → snapshot time stamp → filings and estimates → your written plan. A screener builds lists; it doesn't give reasons.",
  },
  {
    kind: "bars",
    id: "fv-sim-premarket",
    title: "A stamp at 8:25 AM ET is not the close",
    goal: "Finviz stamps every header with a time. Walk a SAMPLE stock from yesterday's regular close through a pre-market print at 8:25 AM ET, then the 9:30 AM open, so those three prices stay distinct.",
    tape: "SAMPLE company · session bars · simulated",
    start: 3,
    bars: [
      simBar("Mon", [120, 120.8, 119.4, 120.2], "Monday's regular session closes at 120.20.", "A close is the last regular-session print, at 4:00 PM ET. Tomorrow this becomes the previous close. Nothing here is pre-market yet."),
      simBar("Tue", [120.2, 120.5, 119.6, 119.9], "Tuesday closes at 119.90, a quiet regular session.", "Two regular closes in a row. You are building a Prev Close you can compare with whatever the header shows before Wednesday's open."),
      simBar("Wed", [119.9, 120.1, 118.3, 118.5], "Wednesday's regular close is 118.50. This is the last 4:00 PM ET print before Thursday morning.", "Once Thursday's header is stamped, this close is what Prev Close should match. If the header price differs, you are not looking at this bar."),
      simBar("8:25", [117.2, 117.4, 115.1, 115.6], "Thursday 8:25 AM ET, before the 9:30 AM open: a pre-market print at 115.60.", "This is not Wednesday's close and not yet the regular open. Finviz's Newmont header on Nov 12, 2026 read 115.56 at 8:25 AM ET, with Prev Close 118.47 and relative volume 0.12 — tiny because the regular session had not started.", { readout: "8:25 AM ET · 115.60" }),
      simBar("9:30", [116.4, 116.8, 115.9, 116.2], "9:30 AM ET: the regular session opens at 116.40, not at the 8:25 pre-market print.", "Pre-market and the opening auction are different sessions. Read the stamp before quoting the header, and do not treat a pre-market move as the day's regular close."),
      simBar("Mid", [116.2, 117, 115.8, 116.5], "Mid-session: the stock trades around 116.50.", "Free Finviz quotes are delayed by a minute. The stamp and the delay both matter when you compare this page with another site."),
      simBar("4:00", [116.5, 116.9, 115.4, 115.8], "4:00 PM ET: the regular close is 115.80. Tomorrow this becomes Prev Close.", "Three prices, three times: yesterday's close, the pre-market print, and today's close. The habit is to read the stamp first, then the number."),
    ],
    takeaway: "Read the time stamp before the price. A header at 8:25 AM ET is pre-market; Prev Close is the last regular close; the open at 9:30 AM ET is a third print.",
  },
  {
    kind: "bars",
    id: "fv-sim-illiquid",
    title: "A $10 million name on a Gold screen",
    goal: "A Finviz Industry = Gold screen can list a $10 million company with almost no volume next to a $90 billion miner. Walk a SAMPLE micro-cap through a 40% jump on thin volume, then a zero-volume day that still appears on the screen.",
    tape: "SAMPLE micro-cap · daily bars · simulated",
    start: 3,
    bars: [
      simBar("D1", [0.82, 0.84, 0.8, 0.81], "A quiet day: the SAMPLE micro-cap closes at 0.81.", "At this size, a few thousand shares can move the price. That is why a Gold screen without a Market Cap or Average Volume filter mixes names you cannot compare."),
      simBar("D2", [0.81, 0.83, 0.79, 0.8], "Another quiet close, at 0.80.", "Nothing in the tape is a reason to act. You are watching how little it takes, on a later bar, to look like a top gainer."),
      simBar("D3", [0.8, 0.81, 0.78, 0.79], "A third thin day, close 0.79.", "Average volume over these days is tiny. A screen that ignores that will still list this stock beside large, liquid miners."),
      simBar("Jump", [0.79, 1.15, 0.79, 1.11], "The stock jumps about 40%, to 1.11, on only a few thousand shares.", "A 40% print on thin volume is easy to sort to the top of a Change % column. It is not the same event as a large miner moving 2% on millions of shares. Finviz's Gold screen on Nov 12, 2026 listed 56 names, including a company worth about $10 million with no P/E.", { mark: "news", readout: "Vol 4,200 · +41%" }),
      simBar("D5", [1.11, 1.14, 0.92, 0.96], "The next day gives back a large part of the jump: close 0.96.", "Wide ranges on small volume cut both ways. Before treating the jump as a new trend, check the news, the filings and whether you could actually trade this size."),
      simBar("Zero", [0.96, 0.96, 0.96, 0.96], "A zero-volume day: the bar is a flat line at 0.96. The name still sits on the Industry = Gold screen.", "A screen is a snapshot of what matches the filters, including names that barely trade. Add Market Cap and Average Volume filters, then research what survives."),
      simBar("D7", [0.96, 0.98, 0.9, 0.91], "A small fade to 0.91, still on almost no volume.", "The screen will keep listing this stock as long as Industry = Gold matches. Liquidity is a filter you add; it is not implied by the theme."),
    ],
    takeaway: "A screen is a list to research, not a list to buy. Filter for size and average volume, then open the quote, news and filings for anything that remains.",
  },
  {
    kind: "columns",
    id: "fv-sim-form144",
    live: [finvizQuote("NEM", "NEM insider trading table")],
    title: "Form 144 and Form 4: one trade, two rows",
    goal: "Finviz lists a proposed sale (Form 144) and a completed sale (Form 4) as separate rows. Walk Newmont's real insider rows, read Nov 12, 2026, to see how one trade can appear twice, then a later sale that appears only once.",
    tape: `Newmont (NEM) insider rows, roles only, read ${FV_READ_ON} · simulated layout`,
    start: 1,
    columns: ["Field", "Form 144 notice", "Form 4 (same trade)", "A later Form 4"],
    rows: [
      ["Insider", "Officer (MD, Americas)", "Officer (MD, Americas)", "Director"],
      ["Date", "Mar 03 '26", "Mar 03 '26", "Dec 01 '25"],
      ["Transaction", "Proposed Sale", "Sale", "Sale"],
      ["Shares", "8,060", "8,060", "2,080"],
      ["Cost", "120.78", "120.78", "92.36"],
      ["Filing", "Form 144", "Form 4", "Form 4"],
    ],
    steps: [
      { col: 1, row: 2, what: "Form 144 column: Transaction is Proposed Sale, 8,060 shares, dated Mar 03 '26.", why: "Form 144 is a notice of a proposed sale by an affiliate, filed before or around the trade. It is an intention, not proof that the shares have already been sold." },
      { col: 2, row: 2, what: "Form 4 column: Transaction is Sale, the same 8,060 shares and the same date.", why: "Form 4 reports a completed trade, due within two business days. Finviz shows both filings as rows, so the same trade can appear twice — once as Proposed Sale and once as Sale." },
      { col: 2, row: 3, what: "Same two columns, same 8,060 shares at 120.78.", why: "Matching size, price and date is the cue that these two rows are one trade, not two dumps. Compare the size with what the insider still holds, which the filing reports and this table may not." },
      { col: 3, row: 0, what: "A later Form 4: a director sells 2,080 shares on Dec 01 '25 at 92.36.", why: "This is a different person and a different date. It appears only as Sale, because there is no matching Form 144 row on this page for this trade." },
      { col: 3, row: 5, what: "The third column's filing is Form 4 only.", why: "Not every completed sale is preceded by a Form 144 on this table. Read the transaction type, then open the filing on SEC EDGAR before treating a row as a new fact. Insiders sell for many reasons, including taxes and diversification (SEC Investor.gov)." },
    ],
    takeaway: "Proposed Sale is Form 144 (a notice). Sale is Form 4 (the completed trade). One trade can show up as both; confirm in the filing.",
  },
];

export const FINVIZ_LESSON: ToolLesson = {
  id: "tool-finviz",
  slug: "finviz",
  route: "/tools/finviz",
  menuLabel: "Finviz",
  icon: "filter_alt",
  title: "Finviz: screen, then check the snapshot",
  blurb: "The screener's filters, views and signals, the quote page's snapshot table, insider and analyst rows, and free vs Elite.",
  credit: { name: "Finviz (finviz.com)", url: "https://finviz.com/", note: "A stock screener and market data site with a free tier and a paid Elite tier. Credited here as a research tool, not endorsed." },
  asOf: FV_READ_ON,
  quiz: { name: "Tool: Finviz", description: "Screener filters, views and signals, the snapshot table, insider rows, delays and free vs Elite.", icon: "filter_alt" },
  intro: [
    "Finviz is screener first: it filters thousands of U.S.-listed stocks down to a list, then shows each one's snapshot on a dense quote page. Market Forces links to that quote page for every ticker.",
    `Values here were read from public Finviz pages on Nov 12, 2026, before the 9:30 AM ET open (the Industry = Gold screen and Newmont's quote page). Free quotes were delayed, and several fields were Elite-only.`,
    "Charting features (indicators, layouts, intraday charts) are compared in Charting apps compared; this lesson covers the screener, the snapshot and the account limits instead.",
  ],
  screens: [
    {
      id: "fv-screener",
      live: [finvizScreener(["ind_gold"], "screener, Industry = Gold, Overview view")],
      title: "Screener: filters, views and a result list",
      where: "Screener · Descriptive filters · Industry = Gold · Overview view",
      alt: `Simulated Finviz screener. Filter tabs run Descriptive, Fundamental, Technical, News, ETF and All. Filters show Industry set to Gold and other fields at Any, with Trades marked Elite only. View tabs run Overview, Valuation, Financial, Ownership, Performance, Technical and Charts. The result list shows ${FV_GOLD_SCREEN.total} total on ${FV_GOLD_SCREEN.pages} pages, including large miners and a company worth about 10 million dollars with zero volume. A footer says stock quotes are delayed by 1 minute.`,
      caption: "Rows read from the free screener on Nov 12, 2026 before the open; prices and volumes are pre-market and delayed. The layout is simulated.",
      blocks: [
        { kind: "tabs", tabs: ["Descriptive", "Fundamental", "Technical", "News", "ETF", "All"], active: 0 },
        { kind: "filters", filters: [{ label: "Exchange", value: "Any" }, { label: "Index", value: "Any" }, { label: "Sector", value: "Any" }, { label: "Industry", value: "Gold" }, { label: "Market Cap.", value: "Any" }, { label: "Average Volume", value: "Any" }, { label: "Analyst Recom.", value: "Any" }, { label: "Trades", value: "Elite only" }] },
        { kind: "chips", title: "Views", chips: ["Overview", "Valuation", "Financial", "Ownership", "Performance", "Technical", "Charts"], active: 0 },
        { kind: "table", title: `#1 / ${FV_GOLD_SCREEN.total} Total · page 1 / ${FV_GOLD_SCREEN.pages}`, columns: ["Ticker", "Company", "Sector", "Country", "Market Cap", "P/E", "Price", "Change"], rows: [["AEM", "Agnico Eagle Mines Ltd", "Basic Materials", "Canada", "92.21B", "14.75", "180.99", "-2.67%"], ["AU", "AngloGold Ashanti Plc", "Basic Materials", "USA", "44.82B", "11.50", "88.76", "-3.53%"], ["AUST", "Austin Gold Corp", "Basic Materials", "Canada", "10.68M", "-", "0.78", "0.00%"], ["B", "Barrick Mining Corp", "Basic Materials", "Canada", "62.92B", "9.74", "38.23", "-2.12%"], ["CDE", "Coeur Mining Inc", "Basic Materials", "USA", "14.87B", "15.99", "14.55", "-3.19%"]] },
        { kind: "note", text: "Stock quotes delayed by 1 minute. Futures and options delayed by 15 minutes." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Filter tabs group criteria: Descriptive (what and how big), Fundamental (valuation, growth), Technical (price behavior)." },
        { n: 2, block: 1, text: ["Add filters until the list is one you could research. ", { text: "Market Cap.", term: "market-cap" }, " and ", { text: "Average Volume", term: "average-volume" }, " remove tiny, thinly traded names."] },
        { n: 3, block: 2, text: "Views change the columns, not the list. Valuation and Ownership are quick second looks." },
        { n: 4, block: 3, text: ["Finviz files gold miners under Basic Materials, its own sector scheme, not GICS Materials. ", { text: "A $10 million company with no P/E", sim: "fv-sim-illiquid" }, " sits beside $90 billion ones."] },
        { n: 5, block: 4, text: "Free data is delayed. Read the time before quoting a price." },
      ],
    },
    {
      id: "fv-snapshot",
      live: [finvizQuote("NEM", "NEM quote page")],
      title: "Quote page: the snapshot table",
      where: "Quote page · snapshot table (NEM)",
      alt: `Simulated Finviz quote page for Newmont. The header price is ${FV_NEM.price}, down ${Math.abs(FV_NEM.changePct)} percent, stamped ${FV_NEM.stamp} with a previous close of ${FV_NEM.prevClose}. A snapshot grid lists index membership, market cap, P/E ${FV_NEM.pe}, forward P/E ${FV_NEM.fwdPe}, EPS, short float, insider and institutional ownership, performance, analyst recommendation, target price, relative volume and distance from the 200-day average.`,
      caption: "Snapshot read Nov 12, 2026 at about 8:25 AM ET. Each provider computes ratios its own way, so these differ from StockAnalysis's.",
      blocks: [
        { kind: "quote", symbol: "NEM", name: "Newmont Corp", price: FV_NEM.price.toFixed(2), change: `${FV_NEM.change} (${FV_NEM.changePct}%)`, up: false, meta: `${FV_NEM.stamp} · Prev Close ${FV_NEM.prevClose}` },
        { kind: "stats", title: "Size and valuation", rows: [{ label: "Index", value: FV_NEM.index }, { label: "Market Cap", value: FV_NEM.marketCap }, { label: "P/E", value: String(FV_NEM.pe) }, { label: "Forward P/E", value: String(FV_NEM.fwdPe) }, { label: "EPS (ttm)", value: String(FV_NEM.epsTtm) }] },
        { kind: "stats", title: "Ownership and short interest", rows: [{ label: "Insider Own", value: FV_NEM.insiderOwn }, { label: "Inst Own", value: FV_NEM.instOwn }, { label: "Short Float", value: FV_NEM.shortFloat }] },
        { kind: "stats", title: "Performance and trend", rows: [{ label: "Perf YTD", value: FV_NEM.perfYtd }, { label: "Perf Year", value: FV_NEM.perfYear }, { label: "SMA200", value: FV_NEM.sma200 }, { label: "Rel Volume", value: String(FV_NEM.relVolume) }] },
        { kind: "stats", title: "Analysts", rows: [{ label: "Recom", value: String(FV_NEM.recom) }, { label: "Target Price", value: String(FV_NEM.target) }, { label: "Rating distribution", value: `${FV_NEM.ratings} (${FV_NEM.analysts})` }] },
      ],
      callouts: [
        { n: 1, block: 0, text: [{ text: "8:25 AM ET is before the open", sim: "fv-sim-premarket" }, " and Prev Close is 118.47, so the header price is not yesterday's close. Read the stamp."] },
        { n: 2, block: 1, text: ["Index shows membership (S&P 500, Russell 1000). ", { text: "P/E", term: "pe-ratio" }, " and ", { text: "Forward P/E", term: "forward-pe" }, " differ from other sites because price time and estimates differ."] },
        { n: 3, block: 2, text: ["Ownership and short interest give context, ", { text: "not a signal on their own", sim: "fv-sim-signal" }, "."] },
        { n: 4, block: 3, text: [{ text: "SMA200", term: "sma-distance" }, " is the distance from the 200-day average; ", { text: "Rel Volume", term: "relative-volume" }, " before the open is always tiny."] },
        { n: 5, block: 4, text: [{ text: "Recom", term: "analyst-consensus" }, " runs from 1 (strong buy) to 5 (strong sell). It is an average of opinions."] },
      ],
    },
    {
      id: "fv-insider",
      live: [finvizQuote("NEM", "NEM analyst and insider tables")],
      title: "Insider and analyst rows",
      where: "Quote page · analyst ratings and insider trading tables (NEM)",
      alt: "Simulated Finviz tables for Newmont. Analyst rows show a July 2026 upgrade from hold to buy with a 127 dollar target and a December 2025 downgrade to neutral with a 97 dollar target. Insider rows show an officer's sale of 8,060 shares at 120.78 dollars on March 3, 2026 listed twice, once as Proposed Sale and once as Sale, and a director's sale of 2,080 shares in December 2025.",
      caption: "Rows read Nov 12, 2026 from Finviz's quote page. Names are replaced with roles here; the filings on SEC EDGAR are the primary source.",
      blocks: [
        { kind: "table", title: "Analyst ratings", columns: ["Date", "Action", "Analyst", "Rating change", "Price target"], rows: [["Jul 14, 2026", "Upgrade", "TD Cowen", "Hold → Buy", "$127"], ["Feb 20, 2026", "Reiterated", "BMO Capital Markets", "Outperform", "$145 → $140"], ["Dec 05, 2025", "Downgrade", "BNP Paribas Exane", "Outperform → Neutral", "$97"]] },
        { kind: "table", title: "Insider trading", columns: ["Insider", "Date", "Transaction", "Cost", "#Shares"], rows: [["Officer (MD, Americas)", "Mar 03 '26", "Sale", "120.78", "8,060"], ["Officer (MD, Americas)", "Mar 03 '26", "Proposed Sale", "120.78", "8,060"], ["Director", "Dec 01 '25", "Sale", "92.36", "2,080"]] },
        { kind: "note", text: "Proposed Sale rows come from Form 144 notices; Sale rows from Form 4 filings. One trade can show up as both." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Ratings and targets change often and differ by firm. SEC: never rely solely on an analyst's recommendation." },
        { n: 2, block: 1, text: ["Two rows, one trade: ", { text: "the notice and the completed sale", sim: "fv-sim-form144" }, ". Compare the size with what the insider still owns."] },
        { n: 3, block: 2, text: "Insiders sell for many reasons, including taxes and diversification (SEC Investor.gov)." },
      ],
    },
    {
      id: "fv-free-elite",
      live: [finvizPlans("Elite plans and FAQ")],
      title: "Free vs Elite: account limits",
      where: "Pricing page · plan comparison (summarized)",
      alt: `Simulated summary of Finviz's free and Elite plans. Free gets delayed market and quote data, 3 years of financial statements, basic screener filters, 20 rows per page, a 3-minute auto-refresh, one watchlist of 10 tickers and no export. Elite gets real-time data, 8 years of statements, advanced filters, 100 rows per page, a 10-second refresh, 20 watchlists of 100 tickers and export to Excel or CSV. Elite listed at ${FV_ELITE.monthly} a month or ${FV_ELITE.annual} a year.`,
      caption: "Summarized from Finviz's pricing page on Nov 12, 2026. Prices and promotions change; charting differences are in Charting apps compared.",
      blocks: [
        { kind: "table", columns: ["Feature", "Free (registered)", "Elite"], rows: [["Market and quote data", "Delayed", "Real-time, incl. pre-market and after-hours"], ["Financial statements", `${FV_ELITE.freeStatements} years`, `${FV_ELITE.eliteStatements} years`], ["Screener filters", "Basic", "Advanced"], ["Rows per page", "20", "100"], ["Auto-refresh", "3 min", "10 s"], ["Watchlists", "1 (10 tickers)", "20 (100 tickers)"], ["ETF data", "Limited", "Full access"], ["Export to Excel, CSV", "Not included", "Included"]] },
        { kind: "note", text: `Elite listed at ${FV_ELITE.monthly} a month or ${FV_ELITE.annual} a year (Nov 12, 2026). Nothing in these lessons needs it.` },
      ],
      callouts: [
        { n: 1, block: 0, text: "For learning, the free tier's delays and limits are fine. Real-time data matters most to people trading during the day." },
        { n: 2, block: 1, text: "Paid tiers are a choice, not a requirement. This app credits tools; it does not recommend buying them." },
      ],
    },
  ],
  walkthroughs: [
    {
      title: "Build a screen you can actually research",
      steps: [
        ["Start in Descriptive: pick a Sector or Industry, then set Market Cap. and Average Volume so ", { text: "tiny, thinly traded names drop out", sim: "fv-sim-illiquid" }, "."],
        "Add one or two Fundamental filters you can explain (for example a P/E range or positive EPS growth).",
        "Switch views (Valuation, Ownership, Performance) to scan the list from different angles. The list stays the same.",
        "Open each survivor's quote page. Read the snapshot's time stamp first, then valuation, ownership and short interest.",
        ["Check news and ", { text: "insider rows", sim: "fv-sim-form144" }, ", then confirm anything important in the filings (Market Forces' SEC link)."],
      ],
    },
    {
      title: "Read the snapshot in one minute",
      steps: [
        ["Time stamp and previous close: is this ", { text: "the close, a delayed quote or pre-market", sim: "fv-sim-premarket" }, "?"],
        "Index and market cap: how big and in which indexes.",
        "P/E vs Forward P/E, then EPS (ttm).",
        ["Short Float and Insider Own: context to explain, ", { text: "not signals to act on", sim: "fv-sim-signal" }, "."],
        "Perf and SMA200: where the price sits versus its own recent history.",
      ],
    },
  ],
  simulations: FV_SIMULATIONS,
  tasks: [
    { id: "fv-t1", find: "How many stocks Industry = Gold returns", live: finvizScreener(["ind_gold"], "screener, Industry = Gold"), where: "Screener: the \"#1 / N Total\" count above the results", answer: { format: "number", min: 10, max: 200, example: "56" }, why: "The size of the list before you add size and volume filters shows how many tiny names a sort would surface first." },
    { id: "fv-t2", find: "Newmont's Short Float", live: finvizQuote("NEM", "NEM snapshot"), where: "Quote page snapshot table: Short Float", answer: { format: "percent", min: 0, max: 40, example: "1.66%" }, why: "Short interest is context to explain, not a signal. Its source updates twice a month, so the date matters." },
    { id: "fv-t3", find: "Newmont's analyst Recom on Finviz's 1–5 scale", live: finvizQuote("NEM", "NEM snapshot"), where: "Quote page snapshot table: Recom", answer: { format: "number", min: 1, max: 5, example: "1.72" }, why: "Recom averages opinions on a 1 (strong buy) to 5 (strong sell) scale. It is not a target or a reason by itself." },
    { id: "fv-t4", find: "Newmont's header price and the time stamp beside it", live: finvizQuote("NEM", "NEM quote page"), where: "Quote header, beside the price (e.g. \"Nov 12 • 8:25 AM ET\"); type the price as the value", answer: { format: "money", min: 20, max: 500, example: "115.56" }, why: "A header price can be pre-market, delayed or after hours. Reading the stamp first tells you which one you are looking at." },
  ],
  drills: [
    { id: "fv-d1", prompt: "Switching the screener from Overview to Valuation view…", options: ["Changes which stocks are listed", "Changes the columns shown for the same list", "Resets the filters", "Buys the stocks"], answer: 1, why: "Views change columns; filters change the list." },
    { id: "fv-d2", prompt: "To drop $10 million companies trading almost nothing from a screen, add…", options: ["Analyst Recom.", "Market Cap. and Average Volume filters", "A Charts view", "The News tab"], answer: 1, why: "Size and liquidity filters remove names you could not trade sensibly." },
    { id: "fv-d3", prompt: "A price stamped 8:25 AM ET with a different Prev Close is…", options: ["Yesterday's close", "A pre-market price", "The 52-week high", "An analyst target"], answer: 1, why: "Regular trading opens at 9:30 AM ET." },
    { id: "fv-d4", prompt: "An insider table shows Proposed Sale and Sale for the same shares and date. That is…", options: ["Two separate sales", "A Form 144 notice and the Form 4 for one sale", "A data error", "A purchase"], answer: 1, why: "Form 144 gives notice; Form 4 reports the completed trade." },
    { id: "fv-d5", prompt: "Finviz's Recom of 1.72 means…", options: ["Analysts' average leans toward buy on a 1–5 scale", "The stock rose 1.72%", "1.72 analysts cover it", "A guaranteed target"], answer: 0, why: "1 is strong buy and 5 strong sell; it averages opinions." },
  ],
  caveats: [
    { title: "Delayed and early", text: "Free quotes are delayed, and before the open the snapshot mixes pre-market prices with yesterday's statistics. Read the time stamp." },
    { title: "Different math, different numbers", text: "Finviz's P/E, forward P/E and targets for Newmont differed from StockAnalysis's on the same morning. Providers use different prices, estimates and definitions." },
    { title: "Its own sectors", text: "Finviz groups stocks by its own sector and industry scheme (gold miners under Basic Materials), which does not match GICS sector funds exactly." },
    { title: "Credited, not endorsed", text: "Finviz's help pages describe what traders often do with signals. That is the tool's description, not this app's advice. Examples are not recommendations." },
  ],
  sources: [
    { label: "Finviz: Newmont (NEM) quote page", url: "https://finviz.com/quote.ashx?t=NEM", supports: "Snapshot fields, header time stamp and previous close, analyst and insider tables (read Nov 12, 2026)" },
    { label: "Finviz: Stock screener, Industry = Gold", url: "https://finviz.com/screener.ashx?v=111&f=ind_gold", supports: "Filter tabs, views, 56 results on 3 pages, Elite-only filters, Analyst Recom. scale from Strong Buy (1) to Strong Sell (5), delay footer (read Nov 12, 2026)" },
    { label: "Finviz: Screener help", url: "https://finviz.com/help/screener.ashx", supports: "Definitions of filters, P/E (trailing twelve months), forward P/E, relative volume and signals" },
    { label: "Finviz Elite: plans and FAQ", url: "https://finviz.com/elite", supports: "Free vs Elite limits, prices, data delays and extended-hours access" },
    { label: "SEC Investor.gov: Insider transactions and Forms 3, 4 and 5", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-69", supports: "Form 4 within two business days; insiders sell for many reasons" },
    { label: "SEC Investor.gov: Form 144", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/form-144", supports: "Notice of a proposed sale by an affiliate" },
    { label: "SEC: Analyzing analyst recommendations", url: "https://www.sec.gov/investor/pubs/analysts.htm", supports: "Do not rely solely on analyst ratings and targets" },
    { label: "SEC Investor.gov: Social media and investment fraud — Investor Alert", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/social-media-and-investment-fraud-investor-alert", supports: "Microcap stocks are more susceptible to manipulation; social posts can mislead" },
  ],
  links: [
    { label: "Learn → Tool: Finviz", to: "/training?group=tool-finviz" },
    { label: "Coach → Screen with Finviz, then check", to: "/coach/finviz-tour" },
    { label: "Charting apps compared", to: "/practice/charting-apps" },
    { label: "Tool Training → StockAnalysis", to: "/tools/stockanalysis" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "tool_finviz",
  modeLabel: "Finviz: screen, filter, then verify",
  modeTip:
    "Treat a screen or signal as a list to research. Add size and volume filters, read the snapshot's time stamp, and confirm insider or analyst claims in the filings. Cases → Market-wide news.",
  questions: [
    mc("FV-01", "A stock screener…", "B", "Filters the market down to stocks that match your criteria", ["Picks winning stocks", "Executes trades", "Guarantees data is real-time"], "Finviz's help: it returns stocks matching selected filters.", "stock-screener"),
    mc("FV-02", "Finviz's filter tabs include…", "A", "Descriptive, Fundamental, Technical, News, ETF and All", ["Buy, Sell, Hold", "Daily, Weekly, Monthly", "Stocks, Bonds, Cash"], "Seen on the free screener, Nov 12, 2026.", "stock-screener"),
    mc("FV-03", "Changing from the Overview view to the Valuation view…", "C", "Shows different columns for the same list", ["Changes which stocks match", "Clears all filters", "Turns on real-time data"], "Views are column sets; filters decide the list.", "stock-screener"),
    mc("FV-04", `Industry = Gold returned ${FV_GOLD_SCREEN.total} stocks, from $90 billion miners to a $10 million company with zero volume. The first fix is…`, "D", "Add Market Cap. and Average Volume filters", ["Sort by change and buy the top", "Remove the Industry filter", "Switch to Charts"], "Size and liquidity filters make the list researchable.", "stock-screener"),
    mc("FV-05", "Finviz's Oversold signal is based on…", "B", "RSI(14) after a sharp two-week fall", ["Insider buying", "Analyst upgrades", "Dividend cuts"], "Finviz's help describes it this way. A reading is not a reason.", "screener-signal"),
    mc("FV-06", "Finviz's help says oversold stocks may be a buying opportunity. In this app that is…", "A", "The tool's description, to be checked against news and financials", ["A recommendation to buy", "A guarantee", "SEC guidance"], "Tools are credited, not endorsed.", "screener-signal"),
    mc("FV-07", `Newmont's header showed ${FV_NEM.price} at 8:25 AM ET with Prev Close ${FV_NEM.prevClose}. The header price is…`, "C", "A pre-market price, not yesterday's close", ["Yesterday's close", "The target price", "The 52-week low"], "Regular trading opens at 9:30 AM ET.", "delayed-quote"),
    mc("FV-08", "Free Finviz stock quotes were labeled…", "D", "Delayed by 1 minute", ["Real-time", "Delayed by 1 day", "Undated"], "Footer on the free screener, Nov 12, 2026. Futures and options: 15 minutes.", "delayed-quote"),
    mc("FV-09", `Before the open, Rel Volume read ${FV_NEM.relVolume}. That mostly reflects…`, "B", "The time of day; little has traded yet", ["A collapse in interest", "A data error", "A stock split"], "Relative volume = current volume ÷ 3-month average, intraday adjusted.", "relative-volume"),
    mc("FV-10", `Finviz showed P/E ${FV_NEM.pe}; StockAnalysis showed 13.79 the same morning. Why?`, "A", "Different price times, estimates and data providers", ["One site is lying", "Newmont has two P/E ratios by law", "Finviz excludes dividends"], "Quote the source and time with any ratio.", "pe-ratio"),
    mc("FV-11", "Insider rows show Proposed Sale and Sale for 8,060 shares on one date. This is…", "C", "A Form 144 notice and a Form 4 for one sale", ["Two sales totaling 16,120 shares", "An insider purchase", "An analyst rating"], "SEC Investor.gov describes both forms.", "form-4-insider-sale"),
    mc("FV-12", "SEC Investor.gov says insider sales…", "D", "Can happen for many reasons, including liquidity and diversification", ["Always predict a fall", "Are illegal", "Are never reported"], "Read size and context before drawing conclusions.", "form-4-insider-sale"),
    mc("FV-13", `Free accounts got ${FV_ELITE.freeStatements} years of financial statements; Elite got…`, "B", `${FV_ELITE.eliteStatements} years`, ["1 year", "Unlimited", "None"], "Finviz's plan comparison, Nov 12, 2026.", "delayed-quote"),
    mc("FV-14", "Finviz files gold miners under Basic Materials. A GICS sector fund files them under…", "A", "Materials", ["Energy", "Financials", "Industrials"], "Classification schemes differ; compare like with like.", "stock-screener"),
  ],
  terms: TERMS,
  cases: CASES,
};

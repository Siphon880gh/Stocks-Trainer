/**
 * TT4 · Yahoo Finance (/tools/yahoo-finance): the quote Summary, Performance Overview and analyst targets,
 * Statistics with its period labels and data-provider footnotes, Historical Data (Close vs Adj Close) and the
 * Financials column order. Public pages read on Nov 12, 2026; nothing behind a login. Chart features are compared in
 * /practice/charting-apps. Credited, not endorsed. Simulated layouts, no logos. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import { mc, seededTape } from "../marketThemes/helpers";
import type { ToolLesson, ToolSimulation } from "./types";
import { yahooQuote } from "./liveLinks";
import { simBar } from "./simWalk";

export const YF_READ_ON = "2026-11-12";
/** Yahoo Finance NEM Summary, read Nov 12, 2026. */
export const YF_NEM = {
  close: 118.47, change: -1.49, changePct: -1.24, closeAt: "November 11 at 4:00:02 PM EST",
  pre: 115.56, preChange: -2.93, prePct: -2.47, preAt: "8:30:43 AM EST",
  prevClose: 119.96, open: 119.97, dayRange: "118.19 - 120.41", range52: "81.34 - 135.29", volume: "5,026,736", avgVolume: "6,930,681",
  marketCap: "123.113B", beta: 0.57, pe: 13.74, eps: 8.62, earnings: "Oct 22, 2026", fwdDiv: "1.04 (0.88%)", target: 135.39,
  targetLow: 70, targetHigh: 165,
} as const;
/** Trailing total returns as of 11/11/2026 vs the S&P 500 (^GSPC), from the Summary's Performance Overview. */
export const YF_PERF = [
  ["YTD Return", "19.41%", "11.30%"],
  ["1-Year Return", "32.94%", "11.29%"],
  ["3-Year Return", "267.01%", "72.57%"],
  ["5-Year Return", "131.01%", "63.88%"],
] as const;
/** Statistics page: Trailing P/E by period end, mrq and dated short interest. */
export const YF_STATS = { pe: ["13.92", "14.54", "12.11", "16.94", "15.50"], fwdPe: ["11.52", "10.53", "9.37", "14.10", "11.24"], mrq: "9/30/2026", shortFloat: "1.91%", shortDate: "10/30/2026" } as const;
/** Historical Data rows (Close adjusted for splits; Adj Close also for dividends). */
export const YF_HISTORY = [
  ["Nov 11, 2026", "118.47", "118.47"],
  ["Nov 10, 2026", "119.96", "119.96"],
  ["Nov 28, 2025", "90.73", "90.15"],
  ["Nov 26, 2025", "0.25 Dividend", ""],
  ["Nov 25, 2025", "86.27", "85.47"],
] as const;

const TERMS: LiteracyTerm[] = [
  { id: "adjusted-close", name: "Adjusted close (Adj Close)", category: "markets", summary: "A past closing price adjusted for splits and for dividends and other distributions, so returns over time include them.", detail: `Yahoo Finance's Historical Data shows Close (adjusted for splits) and Adj Close (also for dividends). For Newmont, Nov 28, 2025 read Close 90.73 and Adj Close 90.15 (read ${YF_READ_ON}). Use Adj Close to compute a return that counts dividends. Educational, not advice.` },
  { id: "most-recent-quarter", name: "Most recent quarter (mrq)", category: "process", summary: "The last reported quarter, used for balance-sheet figures such as cash and debt.", detail: `Yahoo's Statistics page labels each figure ttm, mrq or with a date. Newmont's mrq was ${YF_STATS.mrq}; short interest was dated ${YF_STATS.shortDate}. Different labels mean different dates on the same page. Educational, not advice.` },
  { id: "total-return-vs-benchmark", name: "Total return vs a benchmark", category: "markets", summary: "A return that includes dividends, shown beside an index such as the S&P 500 for the same period.", detail: "Yahoo's Performance Overview shows trailing total returns that may include dividends, against the S&P 500. Past returns do not predict future ones; the comparison shows what happened, not what will. Educational, not advice." },
  { id: "price-target-range", name: "Price target range", category: "markets", summary: "The low, average and high of analysts' 12-month price targets.", detail: `Yahoo showed Newmont's targets from ${YF_NEM.targetLow} to ${YF_NEM.targetHigh} with an average of ${YF_NEM.target} (Nov 12, 2026). The average hides how far apart analysts are. Educational, not advice.` },
  { id: "provider-footnote", name: "Provider footnote", category: "process", summary: "A numbered note that says which company supplied, or how the site calculated, a figure.", detail: "Yahoo's Statistics page footnotes Refinitiv, EDGAR Online, Morningstar, S&P Global Market Intelligence and its own calculations for different rows. Two rows on one page can come from different sources. Educational, not advice." },
];

const T1 = seededTape({ seed: 10401, start: 118.5, preDrift: 0.001, postDrift: -0.002, vol: 0.016, gap: 0.01 });
const T2 = seededTape({ seed: 10402, start: 38.6, preDrift: 0.0002, postDrift: 0.0006, vol: 0.008 });
const T3 = seededTape({ seed: 10403, start: 74.2, preDrift: 0.001, postDrift: 0.001, vol: 0.018, gap: -0.03 });

const CASES: CaseStudy[] = [
  {
    id: "case-yf-average-target",
    title: "Yahoo Finance: \"14% upside\"",
    contextType: "news",
    thinkingMode: "tool_yahoo_finance",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. A stock's Summary shows 1y Target Est about 14% above the price. The Analyst Price Targets panel shows a low about 40% below the price and a high about 40% above it. A friend says \"analysts see 14% upside, buy\". Buy = buy a full position now. Sell = nothing to sell. Hold = no trade yet: read the range, the latest rating changes and the financials, then size any position to your plan.",
    newsHeadline: "Analysts split on miner after record quarter.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "An average target hides a wide spread of opinions. The SEC says not to rely solely on analyst recommendations; the range itself tells you how uncertain the outlook is. Research and position size come first.",
      whyMarketMoved: "With views this far apart, each new rating nudged the price around without a clear trend.",
      evidence: "SAMPLE: the stock drifted slightly lower over the next four sessions.",
    },
  },
  {
    id: "case-yf-close-vs-adj-close",
    title: "Yahoo Finance: the fund that \"went nowhere\"",
    contextType: "news",
    thinkingMode: "tool_yahoo_finance",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. Your plan holds a dividend fund. Using the Close column in Historical Data, you find its price is flat over a year and plan to switch to something \"better\". The Adj Close column and the Performance Overview show a positive total return, in line with the benchmark your plan uses. Buy = add more. Sell = switch funds now. Hold = keep the fund and judge it on total return against your written benchmark.",
    newsHeadline: "Dividend funds lag on price, keep pace on total return.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "Close is adjusted only for splits; Adj Close also adjusts for dividends. For a fund that pays out a lot, price alone understates what you earned. The plan judges it on total return against its benchmark, and on that test it was doing its job.",
      whyMarketMoved: "Dividend funds pay much of their return in cash, so the price line rises slowly.",
      evidence: "SAMPLE: the fund edged up over the next four sessions.",
    },
  },
  {
    id: "case-yf-summary-box",
    title: "Yahoo Finance: the summary box",
    contextType: "news",
    thinkingMode: "tool_yahoo_finance",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You hold a planned position. The \"What's happening\" box at the top of the Summary says the company faces rising costs and lower expected production. The stock dips 3% after earnings. Buy = add on the dip. Sell = exit because the box sounds negative. Hold = open the earnings release and quarterly report, check the production and cost guidance numbers against your written thesis, and decide at your review.",
    newsHeadline: "Miner guides production lower; costs climb.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "A summary is secondhand: it compresses news and coverage. The guidance numbers are in the company's own release and filings. If they break a specific line in your written thesis, selling is reasonable (partial credit here because the decision came from the box, not the numbers).",
      whyMarketMoved: "Lower production guidance cut near-term earnings estimates.",
      evidence: "SAMPLE: the stock steadied over the next four sessions.",
    },
  },
];

/** SAMPLE fund for the Adj Close walk: 0.50 dividend, ex-date on bar 5. Adj Close = Close × (1 − dividend ÷ last close before ex). */
const YF_DIV = { amount: 0.5, lastCloseBefore: 50.4 } as const;
const yfAdj = (close: number) => (close * (1 - YF_DIV.amount / YF_DIV.lastCloseBefore)).toFixed(2);

const YF_SIMULATIONS: ToolSimulation[] = [
  {
    kind: "bars",
    id: "yf-sim-adj-close",
    title: "Close vs Adj Close across an ex-dividend day",
    goal: "Historical Data shows two closing prices. Step through 7 SAMPLE daily bars of a fund that pays a 0.50 dividend to see why the columns differ, and which one to use for which question.",
    tape: "SAMPLE dividend fund · daily bars · simulated",
    start: 2,
    bars: [
      simBar("D1", [49.8, 50.2, 49.7, 50], "A quiet day: Close 50.00, Adj Close 49.50 as the table shows it today.", "The two columns only differ for dates before a later dividend. A gap like this on an old row is your first clue that a payout happened afterwards.", { readout: `Adj Close ${yfAdj(50)}` }),
      simBar("D2", [50, 50.5, 49.9, 50.3], "Close 50.30, Adj Close 49.80.", "Adj Close spreads the later dividend back over every earlier day as a percentage. It is a rewritten history built so returns include the cash paid, not the price that printed.", { readout: `Adj Close ${yfAdj(50.3)}` }),
      simBar("D3", [50.3, 50.4, 49.9, 50.1], "Close 50.10, Adj Close 49.60.", "Quoting what a share traded at that day? Use Close. Measuring a return? Use Adj Close. The question decides the column.", { readout: `Adj Close ${yfAdj(50.1)}` }),
      simBar("D4", [50.1, 50.6, 50, 50.4], "The last day before the ex-dividend date: Close 50.40.", "Holders at the end of this day get the 0.50 dividend. That is why the next bar is expected to open lower: the cash leaves the fund's price and lands in holders' accounts.", { readout: `Adj Close ${yfAdj(50.4)}` }),
      simBar("Ex-div", [49.95, 50.1, 49.7, 49.9], "Ex-dividend day: opens at 49.95 and closes at 49.90, down 0.50 from 50.40.", "A price-only chart shows a 1% drop, but holders didn't lose that 0.50; they received it. Yahoo lists the dividend as its own row in Historical Data, so look for that row before reading a drop as bad news.", { mark: "dividend", readout: "Adj Close 49.90 · 0.50 Dividend row" }),
      simBar("D6", [49.9, 50.3, 49.8, 50.2], "Close 50.20. From D1, Close went 50.00 → 50.20 (+0.4%); Adj Close went 49.50 → 50.20 (+1.4%).", "The extra 1% is the dividend. Performance Overview's total return works the same way, which is why it can beat a price-only chart of the same fund.", { readout: "Adj Close 50.20" }),
      simBar("D7", [50.2, 50.6, 50.1, 50.45], "Close 50.45, the same in both columns until the next payout.", "For a fund that pays out often, these gaps add up year after year. That is why a dividend fund that looks flat on Close is judged on Adj Close or total return.", { readout: "Adj Close 50.45" }),
    ],
    takeaway: "Close is what printed; Adj Close is the return including dividends. Pick the column for the question, and check for a dividend row before reading a drop as news.",
  },
  {
    kind: "bars",
    id: "yf-sim-sessions",
    title: "Previous Close, Close, and pre-market are three prints",
    goal: "Yahoo's Summary shows Previous Close, Close and a pre-market line, each with its own time. Walk a SAMPLE stock through those three prints so the labels stay attached to the session they belong to.",
    tape: "SAMPLE company · session bars · simulated",
    start: 3,
    bars: [
      simBar("Fri", [121, 121.6, 120.4, 120.8], "Friday's regular close is 120.80.", "A regular close is the 4:00 PM ET print. It is the number that will sit in Monday's Previous Close once Monday's session ends."),
      simBar("Mon", [120.8, 121.2, 119.7, 120], "Monday closes at 120.00.", "Two regular sessions. You now have a Previous Close (Friday) and a Close (Monday). Nothing here is pre-market."),
      simBar("Tue AM", [120.1, 120.6, 119.5, 119.8], "Tuesday morning, still in the regular session, around 119.80.", "The day's Close is not fixed until 4:00 PM. Mid-session prints are not Previous Close and not the official Close."),
      simBar("Tue 4pm", [119.8, 120.1, 118.2, 118.5], "Tuesday 4:00 PM ET: the official Close is 118.50.", "Yahoo's Newmont Summary, read Nov 12, 2026, showed a Nov 11 close of 118.47 at 4:00:02 PM EST and Previous Close 119.96 — that Previous Close is the Nov 10 regular close, not the 118.47 above it.", { readout: "Close 118.50 · 4:00 PM" }),
      simBar("AH", [118.3, 118.4, 117.4, 117.8], "After-hours: 117.80, after the regular close.", "After-hours is a fourth print, with its own time. It is not Close and not yet the next morning's pre-market line."),
      simBar("Wed pre", [116.8, 117, 115.2, 115.6], "Wednesday 8:30 AM ET, pre-market: 115.60.", "Yahoo's Newmont page the same morning showed a pre-market 115.56 at 8:30:43 AM EST, a separate line from the 118.47 close. Three labels, three times; do not mix them.", { readout: "Pre-market 115.60 · 8:30 AM" }),
      simBar("Wed open", [116.2, 116.7, 115.8, 116.3], "9:30 AM ET: the regular session opens at 116.20, not at the 8:30 pre-market print.", "When you quote a Yahoo price, quote the label and the time with it. Previous Close, Close and pre-market only agree when nothing has traded since the last regular close."),
    ],
    takeaway: "Previous Close is the last regular close; Close is this session's 4:00 PM print; pre-market is a separate line with its own stamp. Read the label and the time together.",
  },
  {
    kind: "columns",
    id: "yf-sim-target-range",
    live: [yahooQuote("NEM", "analysis", "NEM analyst price targets")],
    title: "The average target sits inside a wide range",
    goal: `An average target of ${YF_NEM.target} sits between a low of ${YF_NEM.targetLow} and a high of ${YF_NEM.targetHigh}. Walk those three Newmont figures, read Nov 12, 2026, so the average cannot hide the spread.`,
    tape: `Newmont (NEM) analyst price targets, read ${YF_READ_ON} · simulated layout`,
    start: 1,
    columns: ["", "Low", "Average", "High"],
    rows: [
      ["Price target (USD)", "70", String(YF_NEM.target), "165"],
      ["Vs the Nov 11 close of 118.47", "About 41% below", "About 14% above", "About 39% above"],
      ["What it is", "The most cautious target in the set", "The mean of the published set", "The most optimistic target in the set"],
      ["A figure can be months old", "A low number may not have been updated", "The average moves when any firm updates", "A high number can sit unchanged for months"],
    ],
    steps: [
      { col: 2, row: 0, what: `Average: ${YF_NEM.target}, the number a headline usually quotes.`, why: "An average is one summary of a set. It is an opinion, not a fact, and it hides how far apart the firms are. Yahoo's Newmont Summary on Nov 12, 2026 printed this 135.39 behind a 70–165 range." },
      { col: 1, row: 0, what: "Low: 70, the most cautious target in the set.", why: "70 is a long way below the Nov 11 close of 118.47. If you only quote the average, you miss that at least one published view sits about 41% below the last close." },
      { col: 3, row: 0, what: "High: 165, the most optimistic target in the set.", why: "165 is about 39% above the same close. The spread from 70 to 165 is the information; the average is just the midpoint of a wide disagreement." },
      { col: 1, row: 1, what: "Versus the Nov 11 close of 118.47: the low is well below, the high well above.", why: "A target is a firm's view of a future price, not a promise. Distance from the last close tells you how much of a move each view is calling for, and how little the average captures of that." },
      { col: 2, row: 3, what: "A figure in this table can be months old. The average moves only when a firm updates.", why: "Before treating 135 as a consensus, check when each target was filed. A stale low or high still pulls the average. SEC: never rely solely on an analyst's recommendation." },
    ],
    takeaway: "Read the low and the high, not just the average. The 70–165 range around 135.39 is the real information, and any of those figures can be months old.",
  },
  {
    kind: "columns",
    id: "yf-sim-financials-order",
    live: [yahooQuote("NEM", "financials", "NEM income statement")],
    title: "Yahoo Financials: oldest on the left",
    goal: "Yahoo's income statement puts the oldest year on the left and TTM on the far right, the opposite of StockAnalysis. Walk Newmont's real annual columns, read Nov 12, 2026, in that order, and notice where a one-time line sits.",
    tape: `Newmont (NEM) annual income statement, read ${YF_READ_ON} · simulated layout`,
    start: 1,
    columns: ["", "12/31/2022", "12/31/2023", "12/31/2024", "12/31/2025", "TTM"],
    rows: [
      ["Total Revenue", "11.92B", "11.81B", "18.68B", "22.67B", "26.61B"],
      ["Gross Profit", "3.26B", "3.01B", "7.14B", "12.06B", "15.88B"],
      ["Total Operating Profit/Loss", "1.61B", "708M", "5.91B", "11.02B", "14.8B"],
      ["Irregular Income/Expenses", "-1.47B", "-2.59B", "-1.28B", "-85M", "-869M"],
      ["Net Income Available to Common", "-429M", "-2.49B", "3.35B", "7.09B", "9.24B"],
      ["Diluted EPS", "-0.54", "-2.97", "2.92", "6.39", "8.62"],
    ],
    steps: [
      { col: 1, row: 0, what: "Far left is 12/31/2022, the oldest year: revenue 11.92B.", why: "Check which side is newest before reading a trend. Yahoo puts oldest on the left; StockAnalysis puts the newest (and TTM) on the left. Reading left-to-right as 'getting worse' would be backwards on the other site." },
      { col: 2, row: 4, what: "12/31/2023: net income is a 2.49B loss, and diluted EPS is -2.97.", why: "A loss this large is the cue to look at the irregular line in the same column, not to treat 2023 as the company's earning power. The 10-K is where that line is explained." },
      { col: 2, row: 3, what: "Same year: Irregular Income/Expenses is -2.59B.", why: "This line is why net income is so far below operating profit (708M) in 2023. StockAnalysis labels a similar hit as Impairment of Goodwill in FY 2023. Row names differ across sites; the filing settles what happened." },
      { col: 3, row: 0, what: "12/31/2024: revenue jumps to 18.68B, and net income turns to +3.35B.", why: "Once you know 2023 had a large irregular charge, 2024 is a different year, not a mysterious recovery from 'the business was unprofitable.' Walk year by year before drawing a trend." },
      { col: 5, row: 0, what: "Far right is TTM, the newest column: revenue 26.61B, diluted EPS 8.62.", why: "TTM is the last four reported quarters, here ending on the period Yahoo also uses on Statistics. It is not calendar 2026. Quote it with its period, and remember Gross Profit TTM reads 15.88B here but 18.1B on Yahoo's own Statistics page — cost of revenue is grouped differently." },
    ],
    takeaway: "On Yahoo, oldest is on the left and TTM is on the right. Find the newest column first, then walk the years, and confirm unusual lines in the filing.",
  },
];

export const YAHOO_FINANCE_LESSON: ToolLesson = {
  id: "tool-yahoo-finance",
  slug: "yahoo-finance",
  route: "/tools/yahoo-finance",
  menuLabel: "Yahoo Finance",
  icon: "newspaper",
  title: "Yahoo Finance: labels, periods and footnotes",
  blurb: "The Summary and its time stamps, Performance Overview and target range, Statistics labels and footnotes, Adj Close and the Financials column order.",
  credit: { name: "Yahoo Finance (finance.yahoo.com)", url: "https://finance.yahoo.com/", note: "A free market news and data site with paid Bronze, Silver and Gold plans. Credited here as a research tool, not endorsed." },
  asOf: YF_READ_ON,
  quiz: { name: "Tool: Yahoo Finance", description: "Summary time stamps, total return vs a benchmark, target ranges, ttm vs mrq, provider footnotes, Adj Close and column order.", icon: "newspaper" },
  intro: [
    "Market Forces links to Yahoo Finance for price history. This lesson reads the pages around it: Summary, Statistics, Historical Data and Financials.",
    `Values here were read from public Yahoo Finance pages for Newmont (NEM) on Nov 12, 2026: the Nov 11 close and a pre-market quote stamped ${YF_NEM.preAt}. They will have changed by the time you read this.`,
    "Chart features are compared in Charting apps compared. Some fields here say Upgrade or need a paid plan; this lesson does not log in or copy anything behind a paywall.",
  ],
  screens: [
    {
      id: "yf-summary",
      live: [yahooQuote("NEM", "", "NEM summary")],
      title: "Summary: two prices and a dense facts grid",
      where: "Quote page · Summary tab (NEM)",
      alt: `Simulated Yahoo Finance summary for Newmont. The quote shows ${YF_NEM.close} at close on ${YF_NEM.closeAt} and a pre-market price of ${YF_NEM.pre}. Tabs run Summary, News, Chart, Community, Statistics, Historical Data, Profile, Financials, Analysis, Seasonality, Options and Holders. A facts grid lists previous close, open, day's range, 52-week range, volume, market cap, beta, P/E, EPS, earnings date, dividend and the 1-year target estimate. Morningstar Rating is available only with a paid plan.`,
      caption: "Values read from finance.yahoo.com on Nov 12, 2026. Previous Close here belongs to the Nov 11 session. The layout is simulated.",
      blocks: [
        { kind: "quote", symbol: "NEM", name: "Newmont Corporation", price: YF_NEM.close.toFixed(2), change: `${YF_NEM.change} (${YF_NEM.changePct}%)`, up: false, meta: `At close: ${YF_NEM.closeAt} · Pre-Market ${YF_NEM.pre} ${YF_NEM.preChange} (${YF_NEM.prePct}%) at ${YF_NEM.preAt}` },
        { kind: "tabs", tabs: ["Summary", "News", "Chart", "Community", "Statistics", "Historical Data", "Profile", "Financials", "Analysis", "Seasonality", "Options", "Holders"], active: 0 },
        { kind: "stats", rows: [{ label: "Previous Close", value: String(YF_NEM.prevClose) }, { label: "Open", value: String(YF_NEM.open) }, { label: "Day's Range", value: YF_NEM.dayRange }, { label: "52 Week Range", value: YF_NEM.range52 }, { label: "Volume", value: YF_NEM.volume }, { label: "Avg. Volume", value: YF_NEM.avgVolume }] },
        { kind: "stats", rows: [{ label: "Market Cap (intraday)", value: YF_NEM.marketCap }, { label: "Beta (5Y Monthly)", value: String(YF_NEM.beta) }, { label: "PE Ratio (TTM)", value: String(YF_NEM.pe) }, { label: "EPS (TTM)", value: String(YF_NEM.eps) }, { label: "Earnings Date", value: YF_NEM.earnings }, { label: "Forward Dividend & Yield", value: YF_NEM.fwdDiv }, { label: "1y Target Est", value: String(YF_NEM.target) }, { label: "Morningstar Rating", value: "Paid plan only" }] },
        { kind: "note", text: "\"What's happening with NEM?\" — a summary box with suggested questions sits above the grid. It condenses coverage; trace any claim back to the company's own release or filing." },
      ],
      callouts: [
        { n: 1, block: 0, text: [{ text: "Close and pre-market are separate lines", sim: "yf-sim-sessions" }, " with separate times. The close is the regular-session price."] },
        { n: 2, block: 1, text: "Twelve tabs. Statistics, Historical Data and Financials hold the checks in this lesson." },
        { n: 3, block: 2, text: [{ text: "Previous Close (119.96) is the close before the Nov 11 session", sim: "yf-sim-sessions" }, ", not the 118.47 shown above. Labels are relative to the last session."] },
        { n: 4, block: 3, text: [{ text: "PE Ratio (TTM)", term: "pe-ratio" }, " uses the last 12 months. The ", { text: "1y Target Est", term: "price-target" }, " is an average of analyst opinions."] },
        { n: 5, block: 4, text: "Summaries are secondhand. Use them to find questions, not answers." },
      ],
    },
    {
      id: "yf-performance",
      live: [yahooQuote("NEM", "", "NEM Performance Overview"), yahooQuote("NEM", "analysis", "NEM analyst price targets")],
      title: "Performance Overview and the target range",
      where: "Quote page · Summary · Performance Overview and Analyst Price Targets (NEM)",
      alt: `Simulated Yahoo Finance performance overview for Newmont against the S&P 500: year to date ${YF_PERF[0][1]} versus ${YF_PERF[0][2]}, one year ${YF_PERF[1][1]} versus ${YF_PERF[1][2]}, three years ${YF_PERF[2][1]} versus ${YF_PERF[2][2]}, five years ${YF_PERF[3][1]} versus ${YF_PERF[3][2]}. Analyst price targets run from a low of ${YF_NEM.targetLow} to a high of ${YF_NEM.targetHigh}, with an average of ${YF_NEM.target} and the current price at ${YF_NEM.close}.`,
      caption: "Trailing total returns as of Nov 11, 2026, which may include dividends; benchmark S&P 500. Past returns do not predict future ones.",
      blocks: [
        { kind: "table", title: "Performance Overview · trailing total returns as of 11/11/2026", columns: ["Period", "NEM", "S&P 500 (^GSPC)"], rows: YF_PERF.map((r) => [...r]) },
        { kind: "stats", title: "Analyst Price Targets", rows: [{ label: "Low", value: String(YF_NEM.targetLow.toFixed(2)) }, { label: "Average", value: String(YF_NEM.target) }, { label: "Current", value: YF_NEM.close.toFixed(2) }, { label: "High", value: String(YF_NEM.targetHigh.toFixed(2)) }] },
        { kind: "chart", label: "Illustrative price line (not NEM data)", seed: 10411, drift: 0.001 },
      ],
      callouts: [
        { n: 1, block: 0, text: [{ text: "Total return", term: "total-return-vs-benchmark" }, " includes dividends, and the benchmark row gives context. It shows what happened, not what will."] },
        { n: 2, block: 1, text: ["The average target sits between ", { text: "a low of 70 and a high of 165", sim: "yf-sim-target-range" }, ". That spread is the real information."] },
        { n: 3, block: 2, text: "For charts and indicators, see Charting apps compared. This line is illustrative only." },
      ],
    },
    {
      id: "yf-statistics",
      live: [yahooQuote("NEM", "key-statistics", "NEM statistics")],
      title: "Statistics: ttm, mrq, dates and footnotes",
      where: "Quote page · Statistics tab (NEM)",
      alt: `Simulated Yahoo Finance statistics page for Newmont. A valuation table shows trailing P/E by period: current ${YF_STATS.pe[0]}, then ${YF_STATS.pe.slice(1).join(", ")} at the last four quarter ends, with forward P/E alongside. Labels show the most recent quarter as ${YF_STATS.mrq} and short interest dated ${YF_STATS.shortDate}. Footnotes credit Refinitiv, EDGAR Online, Morningstar, S&P Global Market Intelligence and Yahoo's own calculations. Longer history says Upgrade.`,
      caption: "Statistics read Nov 12, 2026. Trailing P/E here read 13.92 while the Summary showed 13.74: same site, different calculation times.",
      blocks: [
        { kind: "table", title: "Valuation Measures", columns: ["", "Current", "9/30/2026", "6/30/2026", "3/31/2026", "12/31/2025"], rows: [["Trailing P/E", ...YF_STATS.pe], ["Forward P/E", ...YF_STATS.fwdPe]] },
        { kind: "stats", title: "Labels", rows: [{ label: "Fiscal Year Ends", value: "12/31/2025" }, { label: "Most Recent Quarter (mrq)", value: YF_STATS.mrq }, { label: `Short % of Float (${YF_STATS.shortDate})`, value: YF_STATS.shortFloat }, { label: "Total Debt/Equity (mrq)", value: "15.58%" }] },
        { kind: "note", text: "Footnotes: 1 Refinitiv · 2 EDGAR Online · 3 derived from multiple sources or calculated by Yahoo Finance · 4 Morningstar · EBITDA calculated by S&P Global Market Intelligence. Older valuation history: Upgrade." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Valuation by quarter-end shows how the multiple moved. Compare a company with its own history first." },
        { n: 2, block: 1, text: [{ text: "ttm", term: "trailing-twelve-months" }, ", ", { text: "mrq", term: "most-recent-quarter" }, " and dated labels each point to a different date. ", { text: "Short interest", term: "short-interest" }, " is reported on a schedule, so it lags."] },
        { n: 3, block: 2, text: ["Each row's footnote names its source. ", { text: "Debt/Equity", term: "debt-to-equity" }, " here is a percent (15.58%); StockAnalysis showed 0.16, the same idea as a ratio."] },
      ],
    },
    {
      id: "yf-history",
      live: [yahooQuote("NEM", "history", "NEM historical data")],
      title: "Historical Data: Close vs Adj Close",
      where: "Quote page · Historical Data tab (NEM, daily)",
      alt: "Simulated Yahoo Finance historical data table for Newmont. Recent rows show identical Close and Adj Close. A row from November 28, 2025 shows Close 90.73 and Adj Close 90.15, and a November 26, 2025 row records a 0.25 dividend. Column notes say Close is adjusted for splits and Adj Close for splits and dividends or capital gain distributions.",
      caption: "Rows read Nov 12, 2026. Adj Close for older dates is lowered by later dividends, so returns computed from it include them.",
      blocks: [
        { kind: "table", columns: ["Date", "Close*", "Adj Close**"], rows: YF_HISTORY.map((r) => [...r]) },
        { kind: "note", text: "*Close price adjusted for splits. **Adjusted close price adjusted for splits and dividend and/or capital gain distributions." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Recent rows match; older rows differ once a dividend has been paid since. The dividend appears as its own row." },
        { n: 2, block: 1, text: [{ text: "Use Adj Close for returns that include dividends", sim: "yf-sim-adj-close" }, "; use Close to see the price that actually printed that day."] },
      ],
    },
    {
      id: "yf-financials",
      live: [yahooQuote("NEM", "financials", "NEM income statement")],
      title: "Financials: oldest on the left",
      where: "Quote page · Financials › Income Statement (NEM, annual)",
      alt: "Simulated Yahoo Finance income statement for Newmont. Columns run oldest to newest, left to right: 12/31/2022, 12/31/2023, 12/31/2024, 12/31/2025 and TTM. Rows show total revenue, gross profit, total operating profit, irregular income and expenses, net income available to common stockholders and diluted EPS. The 2023 column shows a 2.49 billion dollar loss with 2.59 billion dollars of irregular expenses.",
      caption: "Read Nov 12, 2026. Yahoo puts the newest column on the right; StockAnalysis puts it on the left. Row names and groupings differ too.",
      blocks: [
        { kind: "table", columns: ["", "12/31/2022", "12/31/2023", "12/31/2024", "12/31/2025", "TTM"], rows: [["Total Revenue", "11.92B", "11.81B", "18.68B", "22.67B", "26.61B"], ["Gross Profit", "3.26B", "3.01B", "7.14B", "12.06B", "15.88B"], ["Total Operating Profit/Loss", "1.61B", "708M", "5.91B", "11.02B", "14.8B"], ["Irregular Income/Expenses", "-1.47B", "-2.59B", "-1.28B", "-85M", "-869M"], ["Net Income Available to Common", "-429M", "-2.49B", "3.35B", "7.09B", "9.24B"], ["Diluted EPS", "-0.54", "-2.97", "2.92", "6.39", "8.62"]] },
        { kind: "note", text: "Gross Profit TTM reads 15.88B here but 18.1B on Yahoo's own Statistics page and 18,103 (millions) on StockAnalysis: cost of revenue is grouped differently." },
      ],
      callouts: [
        { n: 1, block: 0, text: [{ text: "Check which side is newest", sim: "yf-sim-financials-order" }, " before reading a trend. TTM is on the far right here."] },
        { n: 2, block: 1, text: "When one line differs across pages or sites, the definition differs. The 10-K or 10-Q settles it." },
      ],
    },
  ],
  walkthroughs: [
    {
      title: "Read a Yahoo Finance quote page carefully",
      steps: [
        ["Summary: note the close and its time, and ", { text: "any pre- or post-market line separately", sim: "yf-sim-sessions" }, "."],
        "Read the facts grid's labels (TTM, intraday, 5Y Monthly) as well as the numbers.",
        "Performance Overview: compare total return with the benchmark over the same periods; treat it as history.",
        ["Analyst Price Targets: ", { text: "read the low and high, not just the average", sim: "yf-sim-target-range" }, "."],
        "Statistics: note ttm, mrq and dated rows, and the footnote source of anything you quote.",
        ["Historical Data: use ", { text: "Adj Close for returns that include dividends", sim: "yf-sim-adj-close" }, "."],
        ["Financials: ", { text: "find which side is newest", sim: "yf-sim-financials-order" }, ", then read the trend; confirm odd lines in the filing."],
      ],
    },
  ],
  simulations: YF_SIMULATIONS,
  drills: [
    { id: "yf-d1", prompt: "To compute a 1-year return that includes dividends, use…", options: ["Close", "Adj Close", "Open", "Day's Range"], answer: 1, why: "Adj Close is adjusted for dividends and distributions as well as splits." },
    { id: "yf-d2", prompt: "\"Total Cash (mrq)\" is cash as of…", options: ["Today", "The most recent reported quarter", "The last fiscal year", "Next quarter"], answer: 1, why: "mrq = most recent quarter." },
    { id: "yf-d3", prompt: "Targets run from 70 to 165 with an average of 135. The most useful takeaway is…", options: ["Expect 135", "Analysts disagree widely", "The stock will reach 165", "Targets are audited"], answer: 1, why: "The range shows how uncertain the outlook is." },
    { id: "yf-d4", prompt: "On Yahoo's income statement, the newest column is…", options: ["On the left", "On the right (TTM)", "In the middle", "Hidden"], answer: 1, why: "Yahoo runs oldest to newest, left to right." },
    { id: "yf-d5", prompt: "A Statistics row has footnote 4. That tells you…", options: ["It is the 4th best stock", "Which provider supplied it (Morningstar)", "It is four days old", "It is an estimate by you"], answer: 1, why: "Footnotes name the source of each row." },
  ],
  caveats: [
    { title: "Many sources on one page", text: "Yahoo's rows come from several providers and its own calculations, so even one page can show slightly different versions of a ratio." },
    { title: "Free vs paid", text: "Free pages carry ads and some fields (Morningstar Rating, decades of history) need a paid plan. Yahoo listed Bronze, Silver and Gold plans from $7.95 to $39.95 a month on Nov 12, 2026. Nothing here needs them." },
    { title: "Summaries are secondhand", text: "Summary boxes and headlines condense coverage. Facts come from the company's releases and filings." },
    { title: "Credited, not endorsed", text: "Yahoo Finance is one of several data sites. The company shown is an example, not a recommendation." },
  ],
  sources: [
    { label: "Yahoo Finance: Newmont (NEM) summary", url: "https://finance.yahoo.com/quote/NEM/", supports: "Close and pre-market time stamps, facts grid, Performance Overview vs S&P 500, analyst target range (read Nov 12, 2026)" },
    { label: "Yahoo Finance: Newmont (NEM) statistics", url: "https://finance.yahoo.com/quote/NEM/key-statistics/", supports: "Valuation by quarter-end, ttm/mrq labels, dated short interest, provider footnotes, Upgrade for older history" },
    { label: "Yahoo Finance: Newmont (NEM) historical data", url: "https://finance.yahoo.com/quote/NEM/history/", supports: "Close vs Adj Close definitions and rows; dividend row" },
    { label: "Yahoo Finance: Newmont (NEM) financials", url: "https://finance.yahoo.com/quote/NEM/financials/", supports: "Column order oldest to newest; irregular income/expenses; gross profit grouping" },
    { label: "Yahoo Finance: Premium plans", url: "https://finance.yahoo.com/about/plans/select-plan/", supports: "Bronze, Silver and Gold plans and what they add (Nov 12, 2026)" },
    { label: "Yahoo Help: Exchanges and data providers on Yahoo Finance", url: "https://help.yahoo.com/kb/finance-for-web/SLN2310.html", supports: "Quote delays and data providers by exchange" },
    { label: "SEC: Analyzing analyst recommendations", url: "https://www.sec.gov/investor/pubs/analysts.htm", supports: "Do not rely solely on analyst ratings and targets" },
  ],
  links: [
    { label: "Learn → Tool: Yahoo Finance", to: "/training?group=tool-yahoo-finance" },
    { label: "Coach → Read Yahoo Finance labels", to: "/coach/yahoo-finance-tour" },
    { label: "Charting apps compared", to: "/practice/charting-apps" },
    { label: "Tool Training → Finviz", to: "/tools/finviz" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "tool_yahoo_finance",
  modeLabel: "Yahoo Finance: label, period, source",
  modeTip:
    "Read each figure's label (TTM, mrq, a date) and footnote source, use Adj Close for returns, read the target range not the average, and trace summary claims to filings. Cases → Market-wide news.",
  questions: [
    mc("YF-01", "Yahoo's Summary showed 118.47 at close and 115.56 pre-market. The regular-session price is…", "B", "118.47, at close Nov 11", ["115.56", "The average of the two", "Neither"], "Pre-market is a separate, thinner session with its own time stamp.", "as-of-time"),
    mc("YF-02", "Previous Close read 119.96 while the close shown was 118.47. Why?", "A", "Previous Close is the session before the one shown", ["A data error", "Previous Close includes dividends", "It is the pre-market price"], "Labels are relative to the last completed session.", "as-of-time"),
    mc("YF-03", "PE Ratio (TTM) uses earnings from…", "C", "The last 12 months", ["Next year's estimates", "The last quarter only", "The last 5 years"], "TTM = trailing twelve months.", "trailing-twelve-months"),
    mc("YF-04", "Performance Overview returns may include dividends. They are…", "D", "Trailing total returns, shown beside the S&P 500", ["Forecasts", "Price-only returns", "Analyst targets"], "As of 11/11/2026 on the page read.", "total-return-vs-benchmark"),
    mc("YF-05", `Targets ran from ${YF_NEM.targetLow} to ${YF_NEM.targetHigh}, average ${YF_NEM.target}. The best reading is…`, "B", "Analysts disagree widely; the average hides it", ["The stock will hit 135.39", "Targets are guaranteed", "Only the high matters"], "SEC: do not rely solely on analyst views.", "price-target-range"),
    mc("YF-06", "\"mrq\" on the Statistics page means…", "A", "Most recent quarter", ["Monthly return quote", "Market risk quotient", "Moving range quality"], "Yahoo's abbreviation guide.", "most-recent-quarter"),
    mc("YF-07", `Short % of Float was labeled (${YF_STATS.shortDate}) on a page read Nov 12. That means…`, "C", "It reflects a report from Oct 30, not today", ["It is live", "It is a forecast", "It is from Nov 12"], "Short interest is reported on a schedule.", "most-recent-quarter"),
    mc("YF-08", "Statistics footnotes credit Refinitiv, EDGAR Online, Morningstar and others. This shows…", "D", "Different rows can come from different providers", ["Every number is audited", "Yahoo makes up the numbers", "Only one source is used"], "Quote the source with the figure.", "provider-footnote"),
    mc("YF-09", "The Summary showed P/E 13.74; Statistics showed Trailing P/E 13.92. The likely reason is…", "A", "Different calculation times or inputs on the same site", ["Two companies", "A stock split", "One includes dividends"], "Even one site can show versions of a ratio.", "pe-ratio"),
    mc("YF-10", "Close vs Adj Close on Historical Data:", "B", "Close is adjusted for splits; Adj Close also for dividends and distributions", ["They are always equal", "Adj Close is the pre-market price", "Close includes dividends"], "Column notes on the page.", "adjusted-close"),
    mc("YF-11", "To measure what a dividend fund earned over a year, use…", "C", "Adj Close or total return", ["Close only", "Day's Range", "Volume"], "Price alone leaves out the cash paid.", "adjusted-close"),
    mc("YF-12", "On Yahoo's Financials page, the newest column is…", "D", "On the right (TTM)", ["On the left", "Not shown", "In a separate tab"], "Oldest to newest, left to right; StockAnalysis runs the other way.", "period-ending"),
    mc("YF-13", "Gross Profit TTM read 15.88B on Financials but 18.1B on Statistics. First assume…", "B", "Different definitions or groupings; check the filing", ["One is a typo", "The company restated today", "Gross profit is an estimate"], "Line items are grouped differently across layouts and providers.", "provider-footnote"),
    mc("YF-14", "The \"What's happening\" summary says costs are rising. You should…", "A", "Check the company's release or filing for the numbers", ["Act on it immediately", "Ignore all news", "Assume it is a forecast from the SEC"], "Summaries are secondhand; facts live in the filings.", "rumor-vs-filing"),
  ],
  terms: TERMS,
  cases: CASES,
};

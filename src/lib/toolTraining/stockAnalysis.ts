/**
 * TT2 · StockAnalysis (/tools/stockanalysis): reading a stock's Overview, Financials and Statistics pages and an ETF's
 * Holdings page on stockanalysis.com, with every number tied to its as-of time and data provider. Public pages only,
 * read on Nov 12, 2026; nothing behind a login. Credited, not endorsed. Simulated layouts, no logos. Not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import { mc, seededTape } from "../marketThemes/helpers";
import type { ToolLesson, ToolSimulation } from "./types";
import { stockAnalysisStock, stockAnalysisEtf } from "./liveLinks";
import { simBar } from "./simWalk";

/** Day the public StockAnalysis pages below were read. */
export const SA_READ_ON = "2026-11-12";
/** Newmont (NEM) on StockAnalysis: quote at close Nov 11, 2026; statistics "Last updated: Nov 12, 2026" (S&P Global Market Intelligence). */
export const SA_NEM = {
  close: 118.47, change: -1.49, changePct: -1.24, closeAt: "Nov 11, 2026, 4:00 PM EST",
  preMarket: 116.17, preAt: "Nov 12, 2026, 7:33 AM EST",
  marketCap: "122.81B", revenueTtm: "26.61B", netIncome: "9.24B", eps: 8.59, pe: 13.79, fwdPe: 12.95,
  dividend: "$1.04 (0.88%)", range52: "81.34 - 135.29", beta: 0.57, analysts: "Buy", target: "135.39 (+14.28%)", earnings: "Oct 22, 2026",
  ps: 4.62, pb: 3.46, pfcf: 12.19, currentRatio: 2.45, debtEquity: 0.16, interestCoverage: 107.12, shortFloat: "1.73%", daysToCover: 3.03,
} as const;
/** NEM income statement, millions USD (TTM = 12 months to Sep 30, 2026). */
export const SA_NEM_IS = {
  revenue: ["26,606", "22,669", "18,682", "11,812"],
  operatingIncome: ["14,783", "11,011", "5,913", "710"],
  netIncome: ["9,240", "7,085", "3,348", "-2,494"],
  dilutedShares: ["1,075", "1,108", "1,148", "841"],
  eps: ["8.59", "6.39", "2.92", "-2.97"],
  goodwillImpairmentFy2023: "-1,760",
  sharesChangeFy2024: "36.50%",
} as const;
/** VanEck Gold Miners ETF (GDX) on StockAnalysis: overview at close Nov 11, 2026; holdings "Last updated: Nov 10, 2026" (Finnhub). */
export const SA_GDX = { close: 85.21, change: -1.28, changePct: -1.48, assets: "$28.24B", er: "0.51%", holdings: 63, freeRows: 25, holdingsAsOf: "Nov 10, 2026" } as const;

const TERMS: LiteracyTerm[] = [
  { id: "trailing-twelve-months", name: "Trailing twelve months (TTM)", category: "process", summary: "The sum of the last four reported quarters, so a yearly figure that is more recent than the last fiscal year.", detail: `On StockAnalysis, Newmont's TTM column ends Sep 30, 2026, while FY 2025 ends Dec 31, 2025 (read ${SA_READ_ON}). Check the Period Ending row before comparing columns. Educational, not advice.` },
  { id: "forward-pe", name: "Forward P/E", category: "markets", summary: "Share price divided by analysts' estimate of earnings per share for the coming year.", detail: "Trailing P/E uses the last 12 months of reported earnings (SEC Investor.gov's definition of P/E). Forward P/E uses estimates, which can be wrong and are revised. A big gap between the two is a prompt to read why. Educational, not advice." },
  { id: "period-ending", name: "Period ending", category: "process", summary: "The last day covered by a column of financial data, such as Sep 30, 2026 for a TTM column.", detail: "A company's fiscal year may not match the calendar year. Data sites label each column; reading that label stops you comparing a quarter-old number with a fresh price. Educational, not advice." },
  { id: "as-of-time", name: "As-of time", category: "process", summary: "The moment a displayed number was true: a quote's close or pre-market time, or a page's last-updated date.", detail: `StockAnalysis showed Newmont's close (${SA_NEM.closeAt}) and a separate pre-market price, and dated each statistics and holdings page. Prices and ratios built on prices change through the day. Educational, not advice.` },
  { id: "data-provider", name: "Data provider", category: "process", summary: "The company that supplies the numbers a site displays, named in the page footer.", detail: "StockAnalysis credited S&P Global Market Intelligence for financial statistics and Finnhub for ETF holdings on the pages read for this lesson. When a number looks wrong, the filing is the primary source. Educational, not advice." },
];

const T1 = seededTape({ seed: 10201, start: 31.4, preDrift: 0.002, postDrift: -0.004, vol: 0.018, gap: 0.03 });
const T2 = seededTape({ seed: 10202, start: 64.8, preDrift: -0.002, postDrift: 0.002, vol: 0.017, gap: -0.04 });
const T3 = seededTape({ seed: 10203, start: 88.2, preDrift: 0.001, postDrift: -0.003, vol: 0.015, gap: -0.02 });

const CASES: CaseStudy[] = [
  {
    id: "case-sa-one-time-gain-pe",
    title: "StockAnalysis: the cheapest P/E in the group",
    contextType: "news",
    thinkingMode: "tool_stockanalysis",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical company. A stock's Statistics page shows a trailing P/E of 6 and a forward P/E of 15, the cheapest trailing P/E among its peers. Its income statement shows a large Gain (Loss) on Sale of Assets in the TTM column. A post calls it \"half price\". Buy = buy now on the low P/E. Sell = nothing to sell. Hold = no trade yet: read the income statement line by line, compare operating income with net income, and note why forward P/E is much higher.",
    newsHeadline: "Industrial firm's profit jumps after selling a division.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "Trailing P/E divides price by the last 12 months of earnings (SEC Investor.gov). A one-time gain inflates those earnings, so the ratio looks cheap. The forward P/E and the operating income line are the clues; the income statement shows the gain on its own row.",
      whyMarketMoved: "Once investors noticed the profit came from a sale, not the business, the stock drifted back.",
      evidence: "SAMPLE: the stock gave back its jump over the next four sessions.",
    },
  },
  {
    id: "case-sa-impairment-loss",
    title: "StockAnalysis: a loss year from a write-down",
    contextType: "news",
    thinkingMode: "tool_stockanalysis",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You hold a planned position. The headline says the company \"swung to a loss\" and the stock gaps down 4%. On StockAnalysis the income statement shows operating income still positive, a large Impairment of Goodwill row, and positive operating cash flow on the cash flow page. Buy = add on the dip. Sell = exit on the loss headline. Hold = keep the planned position, read the filing's note on the impairment, and review at your scheduled check.",
    newsHeadline: "Company posts quarterly loss on acquisition write-down.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "An impairment is a non-cash charge that writes down what was paid for an acquisition. It lowers net income without spending cash this year, so the operating lines and cash flow tell you whether the business itself changed. It can still be a warning about past deals: selling is partial credit if your written plan had an exit rule for overpaying on acquisitions.",
      whyMarketMoved: "Headlines report net income; the gap closed as investors read the operating figures.",
      evidence: "SAMPLE: the stock recovered part of the gap over the next four sessions.",
    },
  },
  {
    id: "case-sa-net-cash-to-debt",
    title: "StockAnalysis: net cash turned to net debt",
    contextType: "news",
    thinkingMode: "tool_stockanalysis",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. Your written thesis: \"hold while the company keeps net cash; exit if it moves to net debt.\" After a debt-funded acquisition, the Financials overview's Cash & Debt section shows Net Cash (Debt) turned negative in the latest period (period ending listed). Buy = add because the deal sounds exciting. Sell = follow your written exit rule. Hold = wait to see how the deal works out.",
    newsHeadline: "Company borrows to fund its largest acquisition.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "The tool did its job: it showed the exact number your thesis depended on, with the period it covers. The rule was written before the news, so following it is the process. Holding is partial credit only if you rewrite the thesis with a new, specific limit, rather than waiting on hope.",
      whyMarketMoved: "Investors priced in more debt and the risk of the deal.",
      evidence: "SAMPLE: the stock drifted lower over the next four sessions.",
    },
  },
];

/** SAMPLE P/E readout for simulated bars: price ÷ EPS to one decimal. */
const peAt = (price: number, eps: number) => (price / eps).toFixed(1);
const ONE_TIME_EPS = { before: 4, after: 7.5, forward: 3 } as const;
const PE_SIM_EPS = { before: 2, after: 2.4 } as const;

/**
 * Bar-by-bar simulations opened from underlined phrases on /tools/stockanalysis. Every tape is a SAMPLE company;
 * the only real figures are the NEM values above, quoted with their Nov 12, 2026 read date.
 */
const SA_SIMULATIONS: ToolSimulation[] = [
  {
    kind: "bars",
    id: "sa-sim-52-week",
    title: "52-week range: two extremes, one path",
    goal: "The Overview's 52-Week Range is just the highest and lowest prices of the past year. Step through 12 SAMPLE monthly bars to see where each extreme came from, and what the two numbers leave out.",
    tape: "SAMPLE company · monthly bars · simulated",
    start: 3,
    bars: [
      simBar("Dec", [50, 53, 48, 52], "December, the oldest month in the 52-week window: a quiet bar that closes at 52.", "The range only counts the last 52 weeks, so its left edge rolls forward every day. An extreme from 13 months ago silently drops out, and the range can change even when today's price doesn't."),
      simBar("Jan", [52, 55, 47, 48], "January: a long lower wick to 47 and a close at 48.", "Highs and lows are intraday extremes. The 52-week range is built from these wicks, not from closes, so one fast spike counts as much as a month of trading."),
      simBar("Feb", [48, 49, 41, 43], "February keeps falling, to a low of 41 and a close of 43.", "Watch the lows step down. You are training yourself to see the path, which the two numbers on the Overview cannot show."),
      simBar("Mar", [43, 44, 38.5, 40], "March sets the year's low: 38.50, with a close of 40.", "This one wick becomes the left number of the 52-Week Range. You open the chart because the Overview can't tell you whether 38.50 was one bad day or months of trading near that level.", { mark: "low" }),
      simBar("Apr", [40, 46, 39.5, 45], "April turns: opens at 40 and closes at 45 on a wide up bar.", "A reversal from the low is part of the story the range hides. Note where the turn happened; it is the month whose news and earnings you would read next."),
      simBar("May", [45, 52, 44, 51], "May makes a higher high and a higher low, closing at 51.", "Higher highs and lows describe the path; they are not a forecast. Writing down what you see keeps you honest when the price later sits mid-range."),
      simBar("Jun", [51, 58, 50, 57], "June closes at 57, the highest close so far.", "Closes and highs differ. When someone says a stock is \"near its high\", ask whether they mean the intraday high in the range or a closing high."),
      simBar("Jul", [57, 66, 56, 64], "July is a strong month: up to 66, closing at 64.", "A run into a high is easy to extrapolate. The habit is to note the move, then look up what drove it (an earnings report? a headline?) before calling it a trend."),
      simBar("Aug", [64, 71.2, 62, 63], "August spikes to 71.20, the year's high, but closes at 63.", "The right number of the range is a wick that lasted hours. Before calling a stock \"far below its high\", check whether that high was a one-day spike like this one.", { mark: "high" }),
      simBar("Sep", [63, 64, 57, 58], "September falls back to 58.", "The range will keep showing 71.20 as the high for the next 11 months, long after the price has moved on. A stale extreme is still an extreme."),
      simBar("Oct", [58, 61, 55, 60], "October is a narrow bar that closes at 60.", "Narrow bars after a big swing say little on their own. This is where readers over-read noise; stay with what the bars actually show."),
      simBar("Nov", [60, 62, 58.5, 61], "November, today's bar: close 61. The Overview would print 52-Week Range 38.50 - 71.20.", `61 sits about two-thirds of the way up that range, yet the path was a fall, a rally from March and a fade from an August spike. Newmont's Overview showed ${SA_NEM.range52} on ${SA_READ_ON}; those two numbers hide its path too, so open the chart before quoting a range.`),
    ],
    takeaway: "The 52-Week Range is two wicks. Open the chart (or the History tab) to see the path, when each extreme happened and whether it was a spike.",
  },
  {
    kind: "bars",
    id: "sa-sim-earnings-week",
    title: "Earnings week: match the date before calling a move news",
    goal: "Check the Overview's Earnings Date against the chart before you treat a big bar as news. Step through 8 SAMPLE daily bars around a report: the quiet days, the report bar's gap and the days after.",
    tape: "SAMPLE company · daily bars around a report · simulated",
    start: 3,
    bars: [
      simBar("D-4", [30, 30.6, 29.7, 30.4], "Four sessions before the report: the SAMPLE stock closes at 30.40.", `First open the Overview and note the Earnings Date (Newmont's read ${SA_NEM.earnings} on ${SA_READ_ON}). With the date in hand you know which bar should carry the news, so you won't mistake a random jump for a reaction.`),
      simBar("D-3", [30.4, 30.9, 30.1, 30.7], "A small up day to 30.70.", "Bars before a report are often quiet while traders wait. Don't read meaning into small ranges; they are the baseline you will compare the reaction with."),
      simBar("D-2", [30.7, 31, 30.3, 30.5], "A slight dip to 30.50 on a narrow range.", "Note the pre-report level now. Afterwards it is tempting to measure from whichever bar makes the move look biggest."),
      simBar("D-1", [30.5, 31.4, 30.4, 31.2], "The day before: a wider range, closing at 31.20.", "Companies report before the open or after the close. A report after this close shows up on the NEXT bar, so check the release time as well as the date before you pin a move to it."),
      simBar("Report", [33.4, 34.1, 32.6, 32.9], "Report bar: opens at 33.40, a gap of about 7% over 31.20, then fades to close at 32.90.", "This is the bar the Earnings Date predicted, so the gap is a reaction to the report, not a rumor. Now open Financials: the new quarter changes the TTM column, and the TTM column changes the P/E.", { mark: "earnings" }),
      simBar("D+1", [32.9, 33.2, 31.8, 32.1], "The stock gives back part of the gap, closing at 32.10.", "Reactions get revised as people read the full release. One bar is not a verdict; keep comparing with the 31.20 pre-report close."),
      simBar("D+2", [32.1, 32.6, 31.7, 32.4], "It steadies at 32.40.", "Look only at today's price and you would not know there was a report at all. That is why a dated note (report date, gap, what changed in Financials) beats memory."),
      simBar("D+3", [32.4, 33, 32.2, 32.8], "Three days on, 32.80: still above the pre-report close of 31.20.", "Measure from the last pre-report close, not from the report bar's open. Then check the Statistics page's last-updated date: ratios built on the new quarter appear only after the data provider refreshes."),
    ],
    takeaway: "Match the move to the Earnings Date (and time) first, then read what changed in Financials, then quote ratios with their updated date.",
  },
  {
    kind: "bars",
    id: "sa-sim-one-time",
    title: "A headline jump, then the Financials check",
    goal: "When a profit headline sends the price up and the trailing P/E down, open Financials and look for a one-time row before trusting the ratio. Step through 8 SAMPLE bars with the P/E shown on each.",
    tape: "SAMPLE industrial company · daily bars · simulated",
    start: 3,
    bars: [
      simBar("D1", [40, 40.8, 39.6, 40.3], "Before any headline: the SAMPLE stock trades near 40 with a trailing P/E around 10.", "Get a baseline for both price and ratio before news arrives. A ratio only means something next to what it was before and what close peers show.", { readout: `Trailing P/E ${peAt(40.3, ONE_TIME_EPS.before)}` }),
      simBar("D2", [40.3, 40.9, 40, 40.6], "Another quiet day, closing at 40.60.", "Nothing to research yet. Knowing where you started lets you measure a dramatic-looking number later instead of reacting to it.", { readout: `Trailing P/E ${peAt(40.6, ONE_TIME_EPS.before)}` }),
      simBar("D3", [40.6, 41, 40.2, 40.5], "The last bar before the report closes at 40.50.", "This is the pre-headline close you will measure from. Write it down next to the Earnings Date from the Overview.", { readout: `Trailing P/E ${peAt(40.5, ONE_TIME_EPS.before)}` }),
      simBar("News", [44, 45.5, 43.8, 45.2], "Headline: \"Profit nearly doubles\". The stock gaps from 40.50 to 44.00 and closes at 45.20, up about 12%. Trailing P/E drops to about 6.", "The P/E fell because trailing EPS jumped, not because the business got cheaper. A big move on a profit headline is the moment to ask what the profit is made of, before trusting the new ratio.", { mark: "news", readout: `Trailing P/E ${peAt(45.2, ONE_TIME_EPS.after)} · Forward P/E ${peAt(45.2, ONE_TIME_EPS.forward)}` }),
      simBar("D+1", [45.2, 46, 44.6, 45.5], "Follow-through to 45.50. Posts call it \"half price\" on its P/E of 6, while forward P/E is about 15.", "Trailing P/E is price ÷ the last 12 months of EPS (SEC Investor.gov). When forward P/E sits far above trailing, the trailing earnings probably include something that won't repeat. Open Financials › Income Statement next.", { readout: `Trailing P/E ${peAt(45.5, ONE_TIME_EPS.after)} · Forward P/E ${peAt(45.5, ONE_TIME_EPS.forward)}` }),
      simBar("D+2", [45.5, 45.7, 43.9, 44.2], "On the income statement you find a large Gain on Sale of Assets row in TTM; operating income barely changed. The price slips to 44.20.", "Comparing operating income with net income separates the business from the one-off. That row is why trailing P/E looks cheap, and why forward estimates, which leave the gain out, look expensive.", { readout: `Trailing P/E ${peAt(44.2, ONE_TIME_EPS.after)} · Forward P/E ${peAt(44.2, ONE_TIME_EPS.forward)}` }),
      simBar("D+3", [44.2, 44.4, 42.1, 42.5], "More readers find the same row; the stock closes at 42.50.", "You didn't need to predict this drift. Reading the row before acting kept you from paying a \"cheap\" price for earnings that won't come back next year.", { readout: `Trailing P/E ${peAt(42.5, ONE_TIME_EPS.after)}` }),
      simBar("D+4", [42.5, 42.9, 41.6, 41.9], "Four sessions on, the close is 41.90 and most of the gap is gone.", `The habit works in reverse too. Newmont's real FY 2023 (read ${SA_READ_ON}) showed net income of ${SA_NEM_IS.netIncome[3]}M beside operating income of +${SA_NEM_IS.operatingIncome[3]}M, with a ${SA_NEM_IS.goodwillImpairmentFy2023}M goodwill impairment: a one-time charge that made a year look worse, not better.`, { readout: `Trailing P/E ${peAt(41.9, ONE_TIME_EPS.after)}` }),
    ],
    takeaway: "Headline → odd ratio → Financials row by row → the filing's note. Trust a trailing P/E only after you know which rows built it.",
  },
  {
    kind: "bars",
    id: "sa-sim-pe-moves",
    title: "Why P/E moves every day, and jumps after earnings",
    goal: "P/E has two halves: price, which changes every trade, and trailing EPS, which changes only when a quarter is reported. Step through 7 SAMPLE bars with the P/E on each to see which half moved.",
    tape: "SAMPLE company · daily bars · simulated",
    start: 2,
    bars: [
      simBar("Mon", [29.8, 30.2, 29.6, 30], "Price 30.00 ÷ trailing EPS 2.00 = P/E 15.0.", "The EPS half changes only when a new quarter is reported; the price half changes all day. Knowing which half moved tells you what a new P/E means.", { readout: `P/E ${peAt(30, PE_SIM_EPS.before)} on EPS 2.00` }),
      simBar("Tue", [30, 30.8, 29.9, 30.6], "Price up to 30.60, EPS unchanged: P/E 15.3.", "The ratio rose only because the price rose. That is why the Statistics page dates its figures: a P/E quoted yesterday is already stale today.", { readout: `P/E ${peAt(30.6, PE_SIM_EPS.before)} on EPS 2.00` }),
      simBar("Wed", [30.6, 30.7, 29.2, 29.4], "Price down to 29.40: P/E 14.7.", "Same earnings, lower price, a \"cheaper\" stock, yet nothing about the business changed. Ask \"cheaper because of price, or because of earnings?\" every time a ratio moves.", { readout: `P/E ${peAt(29.4, PE_SIM_EPS.before)} on EPS 2.00` }),
      simBar("Thu", [29.4, 29.9, 29.3, 29.8], "Close 29.80, P/E 14.9. The company reports after the close.", "Check the Overview's Earnings Date and the release time. Tomorrow's P/E will use a new TTM EPS, so comparing Thursday's ratio with Friday's mixes two different denominators.", { readout: `P/E ${peAt(29.8, PE_SIM_EPS.before)} on EPS 2.00` }),
      simBar("Fri", [30.4, 31.4, 30.2, 31.2], "Report: TTM EPS rises to 2.40. The price gaps up and closes at 31.20, yet the ratio drops: P/E 13.0.", "Price up and P/E down on the same day: the earnings half grew faster. Open Financials to see which line grew (operating income, or a one-time row?) before calling the lower P/E better value.", { mark: "earnings", readout: `P/E ${peAt(31.2, PE_SIM_EPS.after)} on EPS 2.40` }),
      simBar("Mon", [31.2, 32, 31, 31.8], "Price 31.80, P/E 13.3 on the new EPS.", `From here the ratio drifts with price again until the next report. Providers refresh on their own schedule, which is why you quote the source and date (NEM's Statistics page credited S&P Global Market Intelligence, last updated Nov 12, 2026).`, { readout: `P/E ${peAt(31.8, PE_SIM_EPS.after)} on EPS 2.40` }),
      simBar("Tue", [31.8, 31.9, 31.2, 31.5], "Price 31.50, P/E 13.1.", "Write the ratio as \"P/E 13.1 at 31.50 on TTM EPS 2.40, as of <date>\". Every part matters: the price, the earnings period and the date.", { readout: `P/E ${peAt(31.5, PE_SIM_EPS.after)} on EPS 2.40` }),
    ],
    takeaway: "Price moves a P/E daily; earnings move it in steps after each report. Read the date and the TTM period before comparing two P/Es.",
  },
  {
    kind: "columns",
    id: "sa-sim-columns",
    live: [stockAnalysisStock("NEM", "financials", "NEM income statement")],
    title: "Walk the Financials columns: TTM, then each fiscal year",
    goal: `Read an income statement one column at a time, period first, so one ratio can't do your thinking. These are Newmont's real figures in millions of USD, read from StockAnalysis on ${SA_READ_ON}; the layout is simulated.`,
    tape: `Newmont (NEM) income statement, millions USD, read ${SA_READ_ON} · simulated layout`,
    start: 1,
    columns: ["Fiscal Year", "TTM", "FY 2025", "FY 2024", "FY 2023"],
    rows: [
      ["Period Ending", "Sep 30, 2026", "Dec 31, 2025", "Dec 31, 2024", "Dec 31, 2023"],
      ["Revenue", ...SA_NEM_IS.revenue],
      ["Operating Income", ...SA_NEM_IS.operatingIncome],
      ["Impairment of Goodwill", "-", "-", "-", SA_NEM_IS.goodwillImpairmentFy2023],
      ["Net Income", ...SA_NEM_IS.netIncome],
      ["Diluted Shares", ...SA_NEM_IS.dilutedShares],
      ["EPS (Diluted)", ...SA_NEM_IS.eps],
    ],
    steps: [
      { col: 1, row: 0, what: `TTM column: Period Ending Sep 30, 2026. Revenue ${SA_NEM_IS.revenue[0]}, operating income ${SA_NEM_IS.operatingIncome[0]}, net income ${SA_NEM_IS.netIncome[0]}.`, why: "Read Period Ending before any number. TTM is the last four reported quarters, so it is what the Overview's Revenue (ttm) and the trailing P/E are built from. It is not calendar 2026." },
      { col: 2, row: 1, what: `FY 2025 ends Dec 31, 2025: revenue ${SA_NEM_IS.revenue[1]}.`, why: "Comparing TTM with the last full year shows the newest trend without waiting for the annual report. The two columns overlap by nine months, so never add them together." },
      { col: 3, row: 5, what: `FY 2024: diluted shares ${SA_NEM_IS.dilutedShares[2]}M, up from ${SA_NEM_IS.dilutedShares[3]}M in FY 2023 (Shares Change read ${SA_NEM_IS.sharesChangeFy2024}).`, why: "Per-share numbers depend on the share count. When shares jump, EPS can lag net income. Check this row before comparing EPS across years, and let the filing explain why the count changed." },
      { col: 4, row: 4, what: `FY 2023: net income ${SA_NEM_IS.netIncome[3]} while operating income was +${SA_NEM_IS.operatingIncome[3]}.`, why: "A loss beside positive operating income is the cue to look for an unusual row below the operating line. Without walking to this column you might read FY 2023 as \"the business lost money\"." },
      { col: 4, row: 3, what: `Same column: Impairment of Goodwill ${SA_NEM_IS.goodwillImpairmentFy2023}, a non-cash write-down.`, why: `This row explains most of the gap between operating income and net income. Note it, then confirm the reason in the 10-K before treating FY 2023's EPS of ${SA_NEM_IS.eps[3]} as the company's earning power.` },
      { col: 1, row: 6, what: `Back to TTM: EPS ${SA_NEM_IS.eps[0]}, the number under the trailing P/E of ${SA_NEM.pe}.`, why: "Now you know what that ratio rests on: twelve months to Sep 30, 2026, no impairment row in that column, and a share count that has fallen since FY 2024. That is the context a single ratio leaves out." },
    ],
    takeaway: "Walk the columns in order: period, revenue, operating income, unusual rows, net income, shares. Then quote any ratio with the period it rests on.",
  },
];

export const STOCKANALYSIS_LESSON: ToolLesson = {
  id: "tool-stockanalysis",
  slug: "stockanalysis",
  route: "/tools/stockanalysis",
  menuLabel: "StockAnalysis",
  icon: "table_chart",
  title: "StockAnalysis: read the numbers and their dates",
  blurb: "Overview, Financials and Statistics for a stock, Holdings for an ETF, and the as-of time and data provider behind every number.",
  credit: { name: "Stock Analysis (stockanalysis.com)", url: "https://stockanalysis.com/", note: "A free stock and fund data site with a paid Pro tier. Credited here as a research tool, not endorsed." },
  asOf: SA_READ_ON,
  quiz: { name: "Tool: StockAnalysis", description: "Tabs, TTM vs fiscal years, statistics, ETF holdings, free vs Pro, and the as-of time behind each number.", icon: "table_chart" },
  intro: [
    "Market Forces' featured link for every ticker opens StockAnalysis. This lesson reads what you find there: a stock's Overview, Financials and Statistics tabs, and an ETF's Holdings tab.",
    `The numbers on these screens are real values read from public StockAnalysis pages on Nov 12, 2026 (Newmont, NEM, and the VanEck Gold Miners ETF, GDX). Prices were at the close of Nov 11. They will have changed by the time you read this; that is the point of reading the dates.`,
    "Everything here is on the free pages. Some fields say Upgrade and some lists are cut short for free users. This lesson does not log in or copy anything behind a paywall.",
    ["Why read the pages this way? Each check stops a common misread. Step through them bar by bar: ", { text: "what the 52-week range leaves out", sim: "sa-sim-52-week" }, ", ", { text: "a move in earnings week", sim: "sa-sim-earnings-week" }, ", ", { text: "a headline that makes the P/E look cheap", sim: "sa-sim-one-time" }, ", ", { text: "why P/E changes every day", sim: "sa-sim-pe-moves" }, " and ", { text: "walking the Financials columns", sim: "sa-sim-columns" }, "."],
  ],
  screens: [
    {
      id: "sa-overview",
      live: [stockAnalysisStock("NEM", "", "NEM overview")],
      title: "Overview: the quote and the key facts",
      where: "Stock page · Overview tab (NEM)",
      alt: `Simulated StockAnalysis overview for Newmont. The quote reads ${SA_NEM.close}, down ${Math.abs(SA_NEM.change)} or ${Math.abs(SA_NEM.changePct)} percent, at close on ${SA_NEM.closeAt}, with a separate pre-market price. Tabs run Overview, Financials, Forecast, Statistics, Dividends, History and Profile. Two fact tables list market cap, revenue, P/E, dividend, 52-week range, analyst rating and earnings date.`,
      caption: `Values read from stockanalysis.com on ${SA_READ_ON}; the price is the Nov 11 close. The layout is simulated.`,
      blocks: [
        { kind: "quote", symbol: "NEM", name: "Newmont Corporation", price: SA_NEM.close.toFixed(2), change: `${SA_NEM.change} (${SA_NEM.changePct}%)`, up: false, meta: `At close: ${SA_NEM.closeAt} · Pre-market ${SA_NEM.preMarket} (${SA_NEM.preAt})` },
        { kind: "tabs", tabs: ["Overview", "Financials", "Forecast", "Statistics", "Dividends", "History", "Profile"], active: 0 },
        { kind: "stats", rows: [{ label: "Market Cap", value: SA_NEM.marketCap }, { label: "Revenue (ttm)", value: SA_NEM.revenueTtm }, { label: "Net Income", value: SA_NEM.netIncome }, { label: "EPS", value: String(SA_NEM.eps) }, { label: "PE Ratio", value: String(SA_NEM.pe) }, { label: "Forward PE", value: String(SA_NEM.fwdPe) }, { label: "Dividend", value: SA_NEM.dividend }] },
        { kind: "stats", rows: [{ label: "52-Week Range", value: SA_NEM.range52 }, { label: "Beta", value: String(SA_NEM.beta) }, { label: "Analysts", value: SA_NEM.analysts }, { label: "Price Target", value: SA_NEM.target }, { label: "Earnings Date", value: SA_NEM.earnings }] },
      ],
      callouts: [
        { n: 1, block: 0, text: "Two prices, two times: the regular-session close and a pre-market quote. Read the time stamp before quoting either." },
        { n: 2, block: 1, text: "Tabs are the map. Financials and Statistics are where the checks in this lesson happen." },
        { n: 3, block: 2, text: [{ text: "Revenue (ttm)", term: "revenue" }, " is the last four reported quarters. ", { text: "P/E is price over trailing EPS", sim: "sa-sim-pe-moves" }, "; ", { text: "Forward PE", term: "forward-pe" }, " uses estimates."] },
        { n: 4, block: 3, text: [{ text: "Analysts", term: "analyst-consensus" }, " and ", { text: "Price Target", term: "price-target" }, " are opinions. SEC: never rely solely on an analyst's recommendation."] },
        { n: 5, block: 3, text: ["The ", { text: "52-Week Range", sim: "sa-sim-52-week" }, " is two extremes, not the path between them. The ", { text: "Earnings Date", sim: "sa-sim-earnings-week" }, " tells you which bar should carry the news."] },
      ],
    },
    {
      id: "sa-income",
      live: [stockAnalysisStock("NEM", "financials", "NEM income statement")],
      title: "Financials: columns, periods and unusual rows",
      where: "Stock page · Financials › Income Statement (NEM, annual)",
      alt: "Simulated StockAnalysis income statement for Newmont in millions of US dollars. Sub-tabs run Overview, Income Statement, Balance Sheet, Cash Flow, Ratios and KPIs, with an Annual and Quarterly switch. Columns are TTM ending Sep 30 2026, then fiscal years 2025, 2024 and 2023. FY 2023 shows a net loss of 2,494 million with a goodwill impairment of 1,760 million.",
      caption: `Millions of USD, read ${SA_READ_ON}. Free pages showed TTM plus five fiscal years; longer history is a Pro feature.`,
      blocks: [
        { kind: "tabs", tabs: ["Overview", "Income Statement", "Balance Sheet", "Cash Flow", "Ratios", "KPIs"], active: 1 },
        { kind: "chips", chips: ["Annual", "Quarterly"], active: 0 },
        { kind: "table", title: "Financials in millions USD. Fiscal year is January - December.", columns: ["Fiscal Year", "TTM", "FY 2025", "FY 2024", "FY 2023"], rows: [["Period Ending", "Sep 30, 2026", "Dec 31, 2025", "Dec 31, 2024", "Dec 31, 2023"], ["Revenue", ...SA_NEM_IS.revenue], ["Operating Income", ...SA_NEM_IS.operatingIncome], ["Impairment of Goodwill", "-", "-", "-", SA_NEM_IS.goodwillImpairmentFy2023], ["Net Income", ...SA_NEM_IS.netIncome], ["Shares Outstanding (Diluted)", ...SA_NEM_IS.dilutedShares], ["EPS (Diluted)", ...SA_NEM_IS.eps]] },
        { kind: "note", text: `Shares Change, FY 2024: ${SA_NEM_IS.sharesChangeFy2024}. A jump like this means each share owns a smaller slice; the filing explains why.` },
      ],
      callouts: [
        { n: 1, block: 0, text: "Income, balance sheet and cash flow each have their own sub-tab. Ratios and KPIs are derived from them." },
        { n: 2, block: 1, text: "Annual vs Quarterly changes every column. Quarterly numbers are not comparable with annual ones." },
        { n: 3, block: 2, text: [{ text: "Read Period Ending first", sim: "sa-sim-columns" }, ". TTM ends Sep 30, 2026; FY 2025 ends Dec 31, 2025. FY 2023's loss sits beside a goodwill write-down while operating income stayed positive."] },
        { n: 4, block: 3, text: [{ text: "Share count", term: "diluted-shares" }, " matters for per-share numbers. ", { text: "EPS", term: "eps" }, " can fall even when profit rises if shares jump."] },
      ],
    },
    {
      id: "sa-statistics",
      live: [stockAnalysisStock("NEM", "statistics", "NEM statistics")],
      title: "Statistics: ratios with a source and a date",
      where: "Stock page · Statistics tab (NEM)",
      alt: "Simulated StockAnalysis statistics page for Newmont. Valuation ratios include P/E 13.79, forward P/E 12.95, P/S 4.62, P/B 3.46 and P/FCF 12.19. Financial position shows a current ratio of 2.45, debt to equity of 0.16 and interest coverage of 107.12. Short selling shows 1.73 percent of float and 3.03 days to cover. Fair value fields say Upgrade. A footer credits S&P Global Market Intelligence, last updated Nov 12, 2026.",
      caption: "Statistics read on Nov 12, 2026. Price-based ratios move through the day; statement figures update after each earnings release.",
      blocks: [
        { kind: "stats", title: "Valuation Ratios", rows: [{ label: "PE Ratio", value: String(SA_NEM.pe) }, { label: "Forward PE", value: String(SA_NEM.fwdPe) }, { label: "PS Ratio", value: String(SA_NEM.ps) }, { label: "PB Ratio", value: String(SA_NEM.pb) }, { label: "P/FCF Ratio", value: String(SA_NEM.pfcf) }] },
        { kind: "stats", title: "Financial Position", rows: [{ label: "Current Ratio", value: String(SA_NEM.currentRatio) }, { label: "Debt / Equity", value: String(SA_NEM.debtEquity) }, { label: "Interest Coverage", value: String(SA_NEM.interestCoverage) }] },
        { kind: "stats", title: "Short Selling Information", rows: [{ label: "Short % of Float", value: SA_NEM.shortFloat }, { label: "Short Ratio (days to cover)", value: String(SA_NEM.daysToCover) }] },
        { kind: "stats", title: "Fair Value", rows: [{ label: "Lynch Fair Value", value: "Upgrade" }, { label: "Graham Number", value: "Upgrade" }] },
        { kind: "note", text: "Data Source: S&P Global Market Intelligence · Last updated: Nov 12, 2026" },
      ],
      callouts: [
        { n: 1, block: 0, text: [{ text: "Valuation ratios divide price by a statement figure", sim: "sa-sim-pe-moves" }, ". Compare a company with its own history or close peers, not across industries."] },
        { n: 2, block: 1, text: "Financial position answers \"can it pay its bills and its debt?\" before you think about upside." },
        { n: 3, block: 2, text: [{ text: "Short interest", term: "short-interest" }, " is reported on a schedule, so it lags the price."] },
        { n: 4, block: 3, text: "Upgrade marks a Pro-only field. Skip it; the free ratios are enough to learn the checks." },
        { n: 5, block: 4, text: "The footer names the data provider and the update date. Quote both with any number you use." },
      ],
    },
    {
      id: "sa-etf-holdings",
      live: [stockAnalysisEtf("GDX", "holdings", "GDX holdings")],
      title: "ETF Holdings: what the fund owns, as of when",
      where: "ETF page · Holdings tab (GDX)",
      alt: "Simulated StockAnalysis holdings page for the VanEck Gold Miners ETF. The fund shows assets of 28.24 billion dollars, a 0.51 percent expense ratio and 63 holdings. The top five holdings are Agnico Eagle 11.64 percent, Newmont 11.62 percent, Barrick 7.96 percent, Wheaton Precious Metals 5.76 percent and Franco-Nevada 5.44 percent. A note says 25 of 63 holdings are shown to free users, from Finnhub, last updated Nov 10, 2026.",
      caption: "Fund facts read on Nov 12, 2026; holdings last updated Nov 10, 2026. The issuer's own file is the primary source.",
      blocks: [
        { kind: "quote", symbol: "GDX", name: "VanEck Gold Miners ETF", price: SA_GDX.close.toFixed(2), change: `${SA_GDX.change} (${SA_GDX.changePct}%)`, up: false, meta: "At close: Nov 11, 2026, 4:00 PM EST" },
        { kind: "tabs", tabs: ["Overview", "Holdings", "Dividends", "History"], active: 1 },
        { kind: "stats", rows: [{ label: "Assets", value: SA_GDX.assets }, { label: "Expense Ratio", value: SA_GDX.er }, { label: "Holdings", value: String(SA_GDX.holdings) }, { label: "Index Tracked", value: "MarketVector Global Gold Miners Index" }] },
        { kind: "table", title: "Top holdings", columns: ["Name", "Symbol", "Weight"], rows: [["Agnico Eagle Mines Limited", "AEM", "11.64%"], ["Newmont Corporation", "NEM", "11.62%"], ["Barrick Mining Corporation", "ABX", "7.96%"], ["Wheaton Precious Metals Corp.", "WPM", "5.76%"], ["Franco-Nevada Corporation", "FNV", "5.44%"]] },
        { kind: "note", text: `Showing ${SA_GDX.freeRows} of ${SA_GDX.holdings} holdings · Subscribe to see the full list · Data Source: Finnhub · Last updated: ${SA_GDX.holdingsAsOf}` },
      ],
      callouts: [
        { n: 1, block: 1, text: "ETF pages have fewer tabs: Overview, Holdings, Dividends, History." },
        { n: 2, block: 2, text: [{ text: "Expense ratio", term: "expense-ratio" }, ", ", { text: "holdings", term: "etf-holdings" }, " count and the index tracked are the first fund facts to read."] },
        { n: 3, block: 3, text: "Symbols can differ by site and listing. Barrick shows as ABX here and B in Market Forces." },
        { n: 4, block: 4, text: "Free users see part of the list. For the full, dated file, open the issuer's page." },
      ],
    },
  ],
  walkthroughs: [
    {
      title: "Check a company in ten minutes",
      steps: [
        ["Overview: note the price and its time stamp, market cap, Revenue (ttm), ", { text: "P/E and Forward PE", sim: "sa-sim-pe-moves" }, ", the ", { text: "52-week range", sim: "sa-sim-52-week" }, " and ", { text: "the next earnings date", sim: "sa-sim-earnings-week" }, "."],
        ["Financials › Income Statement: ", { text: "read Period Ending, then revenue, operating income and net income across columns", sim: "sa-sim-columns" }, ". Look for ", { text: "unusual rows (impairments, gains on sales)", sim: "sa-sim-one-time" }, "."],
        "Financials › Balance Sheet and Cash Flow: check cash vs debt and whether operating cash flow covers capital spending.",
        "Statistics: read valuation ratios against the company's own history, then financial position and short interest.",
        "Write down each number with the page's as-of date and data provider. If something looks off, open the filing from Market Forces' SEC link.",
      ],
    },
    {
      title: "Check a fund",
      steps: [
        "Overview: expense ratio, assets, holdings count and the index tracked.",
        "Holdings: the top weights and the last-updated date. Note if the list is cut short.",
        "Open the issuer's page for the full, official holdings file and the prospectus.",
      ],
    },
  ],
  simulations: SA_SIMULATIONS,
  tasks: [
    { id: "sa-t1", find: "Newmont's market cap", live: stockAnalysisStock("NEM", "", "NEM overview"), where: "Overview: the key data list beside the chart", answer: { format: "money", min: 20e9, max: 600e9, example: "$125.3B" }, why: "Market cap sets the scale: how big the company is versus its peers and how much of an index it might be." },
    { id: "sa-t2", find: "Newmont's revenue in the TTM column", live: stockAnalysisStock("NEM", "financials", "NEM income statement"), where: "Financials › Income: the Revenue row, first column (TTM)", answer: { format: "money", min: 5e9, max: 120e9, example: "21.5B" }, why: "TTM revenue is the latest four quarters added up. Check the column header before comparing it with a fiscal year." },
    { id: "sa-t3", find: "Newmont's forward P/E", live: stockAnalysisStock("NEM", "statistics", "NEM statistics"), where: "Statistics › Valuation Ratios: Forward PE", answer: { format: "number", min: 2, max: 80, example: "11.9" }, why: "Forward P/E uses estimates, not reported profit. Write down the date: estimates change after every earnings report." },
    { id: "sa-t4", find: "The weight of GDX's largest holding", live: stockAnalysisEtf("GDX", "holdings", "GDX holdings"), where: "Holdings: the % Weight column, top row", answer: { format: "percent", min: 1, max: 30, example: "13.2%" }, why: "A fund's top holding tells you how concentrated it is. Holdings files are dated; record the as-of date the page shows." },
  ],
  drills: [
    { id: "sa-d1", prompt: "The TTM column ends Sep 30, 2026. It covers…", options: ["Calendar year 2026", "The 12 months to Sep 30, 2026", "Only Q3 2026", "Fiscal year 2025"], answer: 1, why: "Trailing twelve months = the last four reported quarters." },
    { id: "sa-d2", prompt: "Trailing P/E is low but forward P/E is much higher. First check…", options: ["Social media", "The income statement for one-time items", "The 52-week high", "The dividend"], answer: 1, why: "A one-time gain inflates trailing earnings; forward estimates leave it out." },
    { id: "sa-d3", prompt: "A field shows Upgrade. That means…", options: ["The number is zero", "It is a Pro-only field", "The stock was upgraded by analysts", "The page is broken"], answer: 1, why: "StockAnalysis marks paid fields with Upgrade on free pages." },
    { id: "sa-d4", prompt: "Where does a page name its data provider?", options: ["The page footer", "The tab bar", "The quote", "Nowhere"], answer: 0, why: "Statistics and holdings pages credit the provider and the last-updated date at the bottom." },
    { id: "sa-d5", prompt: "Net income is negative but operating income is positive. A likely reason is…", options: ["Revenue was zero", "A non-operating or one-time charge, such as an impairment", "The stock price fell", "The dividend was cut"], answer: 1, why: "Charges below operating income, like write-downs, can turn a profit into a loss." },
  ],
  scenarios: [
    { id: "sa-s1", prompt: "On Stock Analysis a company's net income jumped 80% in the TTM column, but revenue grew 3%. Before calling it a breakout, you…", options: ["Buy before others notice", "Open the quarterly view and look for a one-off gain, tax item or asset sale", "Ignore income and only read revenue", "Assume the TTM column is wrong"], answer: 1, why: "A big profit move without revenue growth often comes from a one-time item. The quarterly view shows which quarter carries it." },
    { id: "sa-s2", prompt: "You compare two retailers' P/E on Stock Analysis: one fiscal year ends in January, the other in December. To compare fairly you use…", options: ["Each company's latest fiscal-year column", "The TTM figures for both, read on the same day", "Whichever looks cheaper", "The 5-year average only"], answer: 1, why: "Different fiscal year-ends shift the periods. TTM lines both up on the last four reported quarters." },
    { id: "sa-s3", prompt: "A ratio you want sits behind an Upgrade button on Stock Analysis. A free path to the same figure is…", options: ["There is none", "Compute it from the free statements, or read the inputs in the company's 10-Q or 10-K on EDGAR", "Guess from the chart", "Copy a forum post"], answer: 1, why: "Most ratios are simple divisions of statement lines. The filing is the primary source the site is built on." },
  ],
  caveats: [
    { title: "Every number has a date", text: "Prices move all day; statements update after earnings; holdings update on their own schedule. Quote the as-of date and provider with any number." },
    { title: "Free vs Pro", text: "Free pages showed TTM plus five fiscal years, part of each ETF's holdings, and Upgrade on some fields. Pro (listed at $79 a year or $9.99 a month on Nov 12, 2026) adds longer history and full lists. Not needed for these lessons." },
    { title: "No logins, no scraping", text: "This lesson read public pages by hand on one day. It does not copy data behind a login or a paywall." },
    { title: "Credited, not endorsed", text: "StockAnalysis is one of several data sites. Filings and issuer files are the primary sources; the stock and fund shown are examples, not recommendations." },
  ],
  sources: [
    { label: "Stock Analysis: Newmont (NEM) statistics", url: "https://stockanalysis.com/stocks/nem/statistics/", supports: "Ratios, financial position, short interest, Upgrade fields and the S&P Global Market Intelligence footer (last updated Nov 12, 2026)" },
    { label: "Stock Analysis: Newmont (NEM) income statement", url: "https://stockanalysis.com/stocks/nem/financials/income-statement/", supports: "TTM to Sep 30, 2026 and FY 2021–2025 columns; goodwill impairment FY 2023; diluted shares and EPS" },
    { label: "Stock Analysis: VanEck Gold Miners ETF (GDX) holdings", url: "https://stockanalysis.com/etf/gdx/holdings/", supports: "25 of 63 holdings shown free; Finnhub; last updated Nov 10, 2026" },
    { label: "Stock Analysis Pro", url: "https://stockanalysis.com/pro/", supports: "What Pro adds (financial history of 10–40 years, full ETF holdings) and pricing on Nov 12, 2026" },
    { label: "SEC Investor.gov: Price-earnings (P/E) ratio", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/price-earnings-pe-ratio", supports: "P/E = price ÷ earnings per share for the past 12 months" },
    { label: "SEC: Analyzing analyst recommendations", url: "https://www.sec.gov/investor/pubs/analysts.htm", supports: "Do not rely solely on analyst recommendations; read filings" },
  ],
  links: [
    { label: "Learn → Tool: StockAnalysis", to: "/training?group=tool-stockanalysis" },
    { label: "Coach → Read StockAnalysis with dates", to: "/coach/stockanalysis-tour" },
    { label: "Tool Training → Market Forces", to: "/tools/market-forces" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
    { label: "Tool Training overview", to: "/tools" },
  ],
  mode: "tool_stockanalysis",
  modeLabel: "StockAnalysis: period, line item, as-of date",
  modeTip:
    "Read the Period Ending row and the page's last-updated date before any number. Compare operating income with net income to spot one-time items, and quote the data provider. Cases → Market-wide news.",
  questions: [
    mc("SA-01", "On a StockAnalysis quote, the close and the pre-market price differ. Which is the regular-session price?", "B", "The one stamped At close", ["The pre-market one", "Whichever is higher", "Neither"], `Newmont showed ${SA_NEM.close} at close (${SA_NEM.closeAt}) and ${SA_NEM.preMarket} pre-market.`, "as-of-time"),
    mc("SA-02", "Revenue (ttm) means revenue over…", "A", "The last four reported quarters", ["The current calendar year to date", "The next 12 months", "The last fiscal year only"], "Trailing twelve months.", "trailing-twelve-months"),
    mc("SA-03", "P/E ratio is…", "C", "Price ÷ earnings per share over the past 12 months", ["Price ÷ revenue", "Earnings ÷ dividends", "Market cap ÷ debt"], "SEC Investor.gov's definition.", "pe-ratio"),
    mc("SA-04", "Forward PE differs from PE because it uses…", "D", "Analysts' estimates of future earnings", ["Last year's earnings", "Revenue", "The dividend"], "Estimates can be wrong and are revised.", "forward-pe"),
    mc("SA-05", "Before comparing two columns on an income statement, read…", "B", "The Period Ending row", ["The 52-week range", "The analyst rating", "The dividend yield"], "TTM ended Sep 30, 2026; FY 2025 ended Dec 31, 2025.", "period-ending"),
    mc("SA-06", "Newmont's FY 2023 shows a net loss while operating income was positive. The statement also shows…", "A", "A goodwill impairment of about $1.76 billion", ["Zero revenue", "A stock split", "A dividend increase"], "A non-cash write-down below operating income.", "period-ending"),
    mc("SA-07", "Diluted shares jumped 36.50% in FY 2024. Per-share figures…", "C", "Can fall even if total profit rises", ["Always double", "Are unaffected", "Become meaningless"], "Each share owns a smaller slice when the count rises.", "dilution"),
    mc("SA-08", "A Statistics field shows Upgrade. You should…", "D", "Treat it as a Pro-only field and use the free data", ["Assume the stock was upgraded", "Read it as zero", "Log in with someone else's account"], "Free pages mark paid fields; this lesson never goes behind a login.", "data-provider"),
    mc("SA-09", "The Statistics footer names S&P Global Market Intelligence. That is…", "B", "The data provider behind the figures", ["The company's auditor", "An analyst's rating", "The exchange"], "Quote the provider and date with any number you use.", "data-provider"),
    mc("SA-10", "Debt / Equity and Interest Coverage answer…", "A", "Whether the company can carry its debt", ["How fast the price will rise", "How many analysts cover it", "Today's volume"], "Financial position comes before upside.", "interest-coverage"),
    mc("SA-11", "Price Target and Analysts: Buy should be treated as…", "C", "Opinions to weigh, not facts to act on alone", ["Guarantees", "Audited figures", "The company's guidance"], "SEC: never rely solely on an analyst's recommendation.", "analyst-rating"),
    mc("SA-12", `GDX's Holdings tab showed ${SA_GDX.freeRows} of ${SA_GDX.holdings} holdings to free users. For the full list, open…`, "D", "The fund issuer's holdings file", ["Reddit", "The Statistics tab", "The 52-week range"], "The issuer's dated file is the primary source.", "expense-ratio"),
    mc("SA-13", "A holdings page says Last updated: Nov 10, 2026 and you read it Nov 12. The weights are…", "B", "As of Nov 10; they may have shifted since", ["Live", "From Nov 12", "Undated"], "Holdings update on their own schedule.", "as-of-time"),
    mc("SA-14", "A good order on a stock page is…", "A", "Overview, then Financials, then Statistics, then forecasts", ["Forecast first, then decide", "Price chart only", "News, then buy"], "Facts and their dates first; opinions last.", "trailing-twelve-months"),
  ],
  terms: TERMS,
  cases: CASES,
};

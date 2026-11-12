/**
 * TT5 · Capstone (/tools/capstone): research one ticker (Newmont, NEM) across Market Forces, StockAnalysis, Finviz and
 * Yahoo Finance, line up where the numbers agree and disagree, confirm in the filing, and write a dated research note
 * with a decision rule. Every value comes from the TT1–TT4 lesson files (public pages read Nov 12, 2026).
 * Simulated layouts, no logos. Credited, not endorsed. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import { mc, seededTape } from "../marketThemes/helpers";
import type { ToolLesson } from "./types";
import { MF_WEIGHTS } from "./marketForces";
import { SA_NEM } from "./stockAnalysis";
import { FV_NEM } from "./finviz";
import { YF_NEM, YF_STATS } from "./yahooFinance";

export const CP_READ_ON = "2026-11-12";
/** Side-by-side values for NEM, all read Nov 12, 2026, each from its tool's lesson file. */
export const CP_COMPARE = {
  pe: { sa: SA_NEM.pe, fv: FV_NEM.pe, yfSummary: YF_NEM.pe, yfStats: Number(YF_STATS.pe[0]) },
  fwdPe: { sa: SA_NEM.fwdPe, fv: FV_NEM.fwdPe, yf: Number(YF_STATS.fwdPe[0]) },
  eps: { sa: SA_NEM.eps, fv: FV_NEM.epsTtm, yf: YF_NEM.eps },
  target: { sa: 135.39, fv: FV_NEM.target, yf: YF_NEM.target },
  shortFloat: { sa: SA_NEM.shortFloat, fv: FV_NEM.shortFloat, yf: YF_STATS.shortFloat },
  employees: { sa: "17,500", fv: "44,100", yf: "17,500" },
} as const;
const peValues = [CP_COMPARE.pe.sa, CP_COMPARE.pe.fv, CP_COMPARE.pe.yfSummary, CP_COMPARE.pe.yfStats];
export const CP_PE_SPREAD = Math.round((Math.max(...peValues) - Math.min(...peValues)) * 100) / 100;

const TERMS: LiteracyTerm[] = [
  { id: "cross-check-sources", name: "Cross-check", category: "process", summary: "Reading the same figure on two or more sources, with dates, to see where they agree and where they differ.", detail: `On Nov 12, 2026, Newmont's P/E read ${peValues.join(", ")} across StockAnalysis, Finviz and two Yahoo pages, a spread of ${CP_PE_SPREAD}. Small gaps come from price times and inputs; large gaps (like employee counts of 17,500 vs 44,100) mean different definitions. Educational, not advice.` },
  { id: "primary-source-filing", name: "Primary source", category: "process", summary: "The original document a figure comes from, such as a company's 10-K, 10-Q or press release on SEC EDGAR.", detail: "Data sites summarize filings and add their own calculations. When sites disagree, the filing settles what the company reported; the site's footnote or help page explains how it calculated the rest. Educational, not advice." },
  { id: "research-note", name: "Research note", category: "process", summary: "A short, dated record of what you checked, where, what you found and what would change your mind.", detail: "Facts carry a source and date; opinions (analyst targets, posts) are kept separate; open questions and a decision rule close the note. Market Forces can store notes in your browser. Educational, not advice." },
  { id: "written-decision-rule", name: "Written decision rule", category: "process", summary: "A condition written before a trade that says when you would add, hold or exit, tied to a number you can check.", detail: "For example: exit if operating cash flow falls below capital spending for two quarters in a row, confirmed in the 10-Q. Writing it first keeps headlines from making the decision. Educational, not advice." },
];

const T1 = seededTape({ seed: 10501, start: 118.5, preDrift: 0.001, postDrift: -0.001, vol: 0.016, gap: -0.02 });
const T2 = seededTape({ seed: 10502, start: 56.3, preDrift: 0.002, postDrift: -0.002, vol: 0.017, gap: 0.03 });
const T3 = seededTape({ seed: 10503, start: 47.9, preDrift: -0.001, postDrift: -0.003, vol: 0.018, gap: -0.035 });

const CASES: CaseStudy[] = [
  {
    id: "case-cp-cheaper-on-finviz",
    title: "Capstone: \"it's cheaper on Finviz\"",
    contextType: "news",
    thinkingMode: "tool_capstone",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical built on real readings. A friend says Newmont is "cheaper on Finviz": forward P/E ${CP_COMPARE.fwdPe.fv} there versus ${CP_COMPARE.fwdPe.sa} on StockAnalysis (both read Nov 12, 2026; Finviz before the open, StockAnalysis at the prior close). Buy = buy now because one site shows a lower multiple. Sell = nothing to sell. Hold = no trade on this: note both values with their times and sources, and judge valuation on one consistent source against the company's own history.`,
    newsHeadline: "Gold miners slip in pre-market trading.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "The company did not change between two websites. Forward P/E depends on the price used (pre-market vs close) and which analysts' estimates feed it. Cross-checking shows the range; choosing one consistent source and comparing over time gives a usable signal.",
      whyMarketMoved: "The pre-market dip lowered Finviz's price input, and estimate sets differ by provider.",
      evidence: "SAMPLE: the stock moved sideways over the next four sessions.",
    },
  },
  {
    id: "case-cp-earnings-in-two-days",
    title: "Capstone: research done, earnings in two days",
    contextType: "news",
    thinkingMode: "tool_capstone",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You finished a four-tool research note on a company and like what you found. StockAnalysis and Yahoo both list the next earnings date two days away. Your written rule: no new position within three trading days of earnings. Buy = buy today; the research is done. Sell = nothing to sell. Hold = follow the rule, add the earnings date to the note and revisit after the report.",
    newsHeadline: "Company to report quarterly results this week.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "The tools gave you the date; the rule decides what to do with it. A report can move the price sharply either way, and the note will be stronger with the new quarter in it. Following a written rule is the process.",
      whyMarketMoved: "The stock gapped on the report, as stocks often do around earnings.",
      evidence: "SAMPLE: a gap after the report, then a slow drift over the next sessions.",
    },
  },
  {
    id: "case-cp-rule-triggered",
    title: "Capstone: the written rule triggers",
    contextType: "news",
    thinkingMode: "tool_capstone",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. Your research note says: exit if operating cash flow falls below capital spending for two quarters in a row. StockAnalysis's quarterly cash flow shows it happened, and the 10-Q on EDGAR confirms the figures. Posts say the dip is a buying chance. Buy = add on the dip. Sell = follow the rule. Hold = wait a quarter to see.",
    newsHeadline: "Producer's spending outpaces operating cash flow again.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "The rule was written before the news, tied to a checkable number, and confirmed in the primary source. That is the whole loop: tools for data, the filing for confirmation, the note for the decision. Holding is partial credit only if you write a new, specific rule now instead of waiting on hope.",
      whyMarketMoved: "Investors priced in more borrowing or slower returns to shareholders.",
      evidence: "SAMPLE: the stock kept drifting lower over the next four sessions.",
    },
  },
];

export const CAPSTONE_LESSON: ToolLesson = {
  id: "tool-capstone",
  slug: "capstone",
  route: "/tools/capstone",
  menuLabel: "Capstone: one ticker, four tools",
  icon: "flag",
  title: "Capstone: research one ticker across four tools",
  blurb: "Take Newmont from Market Forces through StockAnalysis, Finviz and Yahoo Finance, line up the numbers, confirm in the filing and write a dated note.",
  credit: { name: "Market Forces, Stock Analysis, Finviz and Yahoo Finance", url: "https://www.sec.gov/edgar/search/", note: "The four tools from TT1–TT4, credited and not endorsed. The link goes to SEC EDGAR, the primary source behind them." },
  asOf: CP_READ_ON,
  quiz: { name: "Tool: Capstone", description: "Research path, cross-checking values across sites, primary sources, research notes and written decision rules.", icon: "flag" },
  intro: [
    "Each tool answers a different question. Market Forces says what you would own and where to look; StockAnalysis lays out statements; Finviz screens and summarizes; Yahoo Finance shows history, total return and labeled statistics.",
    `This capstone follows one ticker, Newmont (NEM), through all four on the same day (Nov 12, 2026). Every value below is a real reading from the earlier lessons. The point is not Newmont; it is the method.`,
    "When the sites disagree, the filing on SEC EDGAR settles what the company reported. The research note ties it together with a decision rule written in advance.",
  ],
  screens: [
    {
      id: "cp-path",
      title: "The research path",
      where: "Four tools, one ticker (NEM)",
      alt: "Simulated research path for Newmont across four tools. Market Forces shows the Gold theme, a Gold miner exposure badge and index weights. StockAnalysis shows the income statement and statistics with dates. Finviz shows the snapshot and insider rows. Yahoo Finance shows total return against the S&P 500, the analyst target range and Adj Close. The last step is the 10-K or 10-Q on SEC EDGAR.",
      caption: "One question per stop. Values are from the TT1–TT4 lessons, read Nov 12, 2026.",
      blocks: [
        { kind: "chips", title: "Path", chips: ["1 Market Forces", "2 StockAnalysis", "3 Finviz", "4 Yahoo Finance", "5 SEC EDGAR"], active: 0 },
        { kind: "table", columns: ["Stop", "Question it answers", "What NEM showed"], rows: [["Market Forces", "What would I own, and what moves it?", `Stock · Gold miner; themes Gold and Materials; ${MF_WEIGHTS.NEM.sp500}% of the S&P 500 (ETF-based estimate, Oct 8, 2026)`], ["StockAnalysis", "What did the business report?", "TTM revenue 26.61B to Sep 30, 2026; FY 2023 loss beside a 1.76B goodwill impairment"], ["Finviz", "How does it screen, and who is trading?", "Snapshot at 8:25 AM ET; insider Sale and Proposed Sale rows for one trade"], ["Yahoo Finance", "What has it returned, and how far apart are analysts?", "1-year total return 32.94% vs 11.29% for the S&P 500; targets 70 to 165"], ["SEC EDGAR", "What exactly did the company file?", "The 10-K and 10-Q behind every statement figure"]] },
      ],
      callouts: [
        { n: 1, block: 0, text: "Go in order: exposure first, reported facts next, then screens and opinions, then the filing." },
        { n: 2, block: 1, text: "Write each finding with its tool and date. Opinions (targets, posts) go in their own column." },
      ],
    },
    {
      id: "cp-crosscheck",
      title: "Cross-check: same company, same day, different numbers",
      where: "Side-by-side readings (NEM, Nov 12, 2026)",
      alt: `Simulated cross-check table for Newmont. P/E reads ${CP_COMPARE.pe.sa} on StockAnalysis, ${CP_COMPARE.pe.fv} on Finviz, and ${CP_COMPARE.pe.yfSummary} or ${CP_COMPARE.pe.yfStats} on two Yahoo pages. Forward P/E reads ${CP_COMPARE.fwdPe.sa}, ${CP_COMPARE.fwdPe.fv} and ${CP_COMPARE.fwdPe.yf}. EPS is about 8.6 everywhere. Average targets read ${CP_COMPARE.target.sa}, ${CP_COMPARE.target.fv} and ${CP_COMPARE.target.yf}. Short percent of float reads ${CP_COMPARE.shortFloat.sa}, ${CP_COMPARE.shortFloat.fv} and ${CP_COMPARE.shortFloat.yf}. Employees read 17,500 on two sites and 44,100 on Finviz.`,
      caption: "All read Nov 12, 2026. Small gaps: price time and inputs. Big gaps: different definitions. The filing settles reported figures.",
      blocks: [
        { kind: "table", columns: ["Figure", "StockAnalysis", "Finviz", "Yahoo Finance"], rows: [["Price used", "118.47 close, Nov 11", "115.56 at 8:25 AM ET", "118.47 close; 115.56 pre-market"], ["P/E", String(CP_COMPARE.pe.sa), String(CP_COMPARE.pe.fv), `${CP_COMPARE.pe.yfSummary} (Summary) · ${CP_COMPARE.pe.yfStats} (Statistics)`], ["Forward P/E", String(CP_COMPARE.fwdPe.sa), String(CP_COMPARE.fwdPe.fv), String(CP_COMPARE.fwdPe.yf)], ["EPS (ttm)", String(CP_COMPARE.eps.sa), String(CP_COMPARE.eps.fv), String(CP_COMPARE.eps.yf)], ["Average target", `${CP_COMPARE.target.sa} (22 analysts)`, `${CP_COMPARE.target.fv} (15)`, `${CP_COMPARE.target.yf} (range 70–165)`], ["Short % of float", CP_COMPARE.shortFloat.sa, CP_COMPARE.shortFloat.fv, `${CP_COMPARE.shortFloat.yf} (10/30/2026)`], ["Employees", CP_COMPARE.employees.sa, CP_COMPARE.employees.fv, CP_COMPARE.employees.yf]] },
        { kind: "note", text: `P/E spread across the four readings: ${CP_PE_SPREAD}. EPS agrees to within a few cents; the price and timing do most of the work.` },
      ],
      callouts: [
        { n: 1, block: 0, text: "Agreement (EPS near 8.6) builds confidence. Disagreement (employees) is a prompt to read the 10-K's own figure and each site's definition." },
        { n: 2, block: 1, text: "Pick one consistent source for any ratio you track over time, and note which." },
      ],
    },
    {
      id: "cp-note",
      title: "The research note",
      where: "Your note (Market Forces notes or any document)",
      alt: "Simulated research note for Newmont with five parts: what I would own, facts with source and date, opinions kept separate, open questions, and a written decision rule tied to a checkable number.",
      caption: "A template, filled with real readings from Nov 12, 2026. The decision rule is an example of form, not a recommendation.",
      blocks: [
        { kind: "stats", title: "What I would own", rows: [{ label: "Ticker", value: "NEM · stock" }, { label: "Exposure", value: "Gold miner (Market Forces)" }, { label: "Forces to watch", value: "Real rates, the dollar, central-bank demand; costs and output" }] },
        { kind: "table", title: "Facts (source · date)", columns: ["Fact", "Source · date"], rows: [["TTM revenue 26.61B, net income 9.24B", "StockAnalysis · Nov 12, 2026 (period to Sep 30, 2026)"], ["Net cash 3.68B", "StockAnalysis statistics · Nov 12, 2026"], ["1-year total return 32.94% vs S&P 500 11.29%", "Yahoo Finance · as of Nov 11, 2026"]] },
        { kind: "table", title: "Opinions (kept separate)", columns: ["Opinion", "Source · date"], rows: [["Average target 135.39, range 70–165", "Yahoo Finance · Nov 12, 2026"], ["Rating mix 10 Buy · 4 Hold · 1 Sell", "Finviz · Nov 12, 2026"]] },
        { kind: "note", text: "Open questions: why do employee counts differ (17,500 vs 44,100)? What does the 10-Q say about 2027 spending? Decision rule (example form): no position within three trading days of earnings; exit if operating cash flow falls below capital spending for two quarters, confirmed in the 10-Q." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Start with exposure. A miner is a business, not the metal." },
        { n: 2, block: 1, text: "Facts carry a source and the period they cover." },
        { n: 3, block: 2, text: "Opinions are useful context, never the deciding line." },
        { n: 4, block: 3, text: "Open questions send you to the filing; the rule decides in advance." },
      ],
    },
  ],
  walkthroughs: [
    {
      title: "Run the capstone on any ticker",
      steps: [
        "Market Forces: find the ticker, read its exposure badge and theme connection, and check Index weights.",
        "StockAnalysis: read Period Ending, then revenue, operating and net income, cash vs debt and cash flow. Note one-time rows.",
        "Finviz: read the snapshot's time stamp, valuation, ownership and short interest; scan insider and analyst rows.",
        "Yahoo Finance: compare total return with the S&P 500, read the target range, and check ttm/mrq labels and footnotes.",
        "Line up any figure that differs across sites. Explain each gap as timing, input or definition.",
        "Open the 10-K or 10-Q on SEC EDGAR to confirm what the company reported.",
        "Write the note: exposure, facts with source and date, opinions apart, open questions, and a decision rule.",
      ],
    },
  ],
  drills: [
    { id: "cp-d1", prompt: "Four sites show P/E between 13.42 and 13.92 on one morning. Most likely…", options: ["One site is wrong", "Different price times and inputs", "The company restated", "A split"], answer: 1, why: "EPS agreed within cents; the price used differed (pre-market vs close)." },
    { id: "cp-d2", prompt: "Employee counts read 17,500 and 44,100. Next step…", options: ["Average them", "Check the 10-K and each site's definition", "Use the bigger one", "Ignore it"], answer: 1, why: "Large gaps mean different definitions; the filing settles what the company reports." },
    { id: "cp-d3", prompt: "Which belongs in the Opinions column of a note?", options: ["TTM revenue", "Net cash", "An average price target", "Shares outstanding"], answer: 2, why: "Targets are analyst opinions; the rest are reported figures." },
    { id: "cp-d4", prompt: "A good decision rule is…", options: ["\"Sell if it feels bad\"", "Written in advance and tied to a checkable number", "Whatever the latest post says", "Set after the trade"], answer: 1, why: "A rule you can check keeps headlines from deciding." },
    { id: "cp-d5", prompt: "The first stop in the research path is…", options: ["Sentiment", "Analyst targets", "What you would own (exposure)", "The chart"], answer: 2, why: "Market Forces' badge says whether it is a business, a basket, metal or futures." },
  ],
  caveats: [
    { title: "One day's readings", text: "All values were read on Nov 12, 2026 and will change. The method, not the numbers, is the lesson." },
    { title: "Example ticker", text: "Newmont is used because it appears in Market Forces' Gold theme and on all four sites. It is an example, not a recommendation." },
    { title: "Credited, not endorsed", text: "The four tools are credited. Paid tiers are not needed; filings on SEC EDGAR are free." },
  ],
  sources: [
    { label: "SEC EDGAR: Full-text search", url: "https://www.sec.gov/edgar/search/", supports: "Where 10-K, 10-Q and Form 4 filings live; the primary source" },
    { label: "SEC: Beginners' guide to financial statements", url: "https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements", supports: "Income statement, balance sheet and cash flow basics" },
    { label: "Stock Analysis: Newmont (NEM) statistics", url: "https://stockanalysis.com/stocks/nem/statistics/", supports: "P/E 13.79, forward P/E 12.95, net cash, short interest (read Nov 12, 2026)" },
    { label: "Finviz: Newmont (NEM) quote page", url: "https://finviz.com/quote.ashx?t=NEM", supports: "P/E 13.42, forward P/E 11.61, target 137.64, employees 44,100 (read Nov 12, 2026)" },
    { label: "Yahoo Finance: Newmont (NEM) summary and statistics", url: "https://finance.yahoo.com/quote/NEM/key-statistics/", supports: "P/E 13.74 and 13.92, forward P/E 11.52, short % of float 1.91% (10/30/2026)" },
    { label: "Market Forces source code and data (GitHub)", url: "https://github.com/Siphon880gh/tickers", supports: "NEM's exposure badge, themes and index-weight snapshot" },
  ],
  links: [
    { label: "Learn → Tool: Capstone", to: "/training?group=tool-capstone" },
    { label: "Coach → One ticker, four tools", to: "/coach/tool-capstone-research" },
    { label: "Tool Training → Market Forces", to: "/tools/market-forces" },
    { label: "Tool Training → StockAnalysis", to: "/tools/stockanalysis" },
    { label: "Tool Training → Finviz", to: "/tools/finviz" },
    { label: "Tool Training → Yahoo Finance", to: "/tools/yahoo-finance" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "tool_capstone",
  modeLabel: "Capstone: path, cross-check, filing, note",
  modeTip:
    "Exposure first, reported facts next, screens and opinions after, then confirm in the filing. Explain every gap between sites as timing, input or definition, and let a written rule decide. Cases → Market-wide news.",
  questions: [
    mc("CP-01", "The best first stop when researching a new ticker is…", "B", "What you would own: the exposure badge and theme", ["The analyst target", "Social sentiment", "The 1-day chart"], "Exposure decides which facts matter next.", "exposure-label"),
    mc("CP-02", "Which tool question pairs best with StockAnalysis?", "A", "What did the business report, for which period?", ["Who is posting about it?", "Which theme is it in?", "What is the live order book?"], "Its Financials tabs lay out statements with Period Ending.", "period-ending"),
    mc("CP-03", "Which tool question pairs best with Finviz?", "C", "How does it screen, and what does the snapshot say?", ["What did the 10-K say about headcount?", "What is the dividend history in 1990?", "Which theme lists it?"], "Screener first, then a dense snapshot.", "stock-screener"),
    mc("CP-04", "Which tool question pairs best with Yahoo Finance?", "D", "What has it returned vs the S&P 500, with which labels?", ["Who are the insiders?", "What is the exposure badge?", "What is the expense ratio of GDX only?"], "Performance Overview and labeled Statistics.", "total-return-vs-benchmark"),
    mc("CP-05", `P/E read ${CP_COMPARE.pe.sa}, ${CP_COMPARE.pe.fv}, ${CP_COMPARE.pe.yfSummary} and ${CP_COMPARE.pe.yfStats} on one morning. The main cause is…`, "B", "Different price times and inputs", ["Fraud", "Four different companies", "A stock split"], "EPS agreed within cents; the price used differed.", "cross-check-sources"),
    mc("CP-06", `Forward P/E read ${CP_COMPARE.fwdPe.fv} on Finviz and ${CP_COMPARE.fwdPe.sa} on StockAnalysis. Before calling it cheaper on Finviz, check…`, "A", "Each site's price time and estimate source", ["Which number you prefer", "Social media", "Nothing"], "Compare like with like.", "forward-pe"),
    mc("CP-07", "Employee counts read 17,500 and 44,100. The figure the company reports is in…", "C", "Its 10-K on SEC EDGAR", ["A Reddit thread", "The price chart", "The analyst target"], "Large gaps mean different definitions; the filing settles it.", "primary-source-filing"),
    mc("CP-08", "A primary source is…", "D", "The original filing or release a figure comes from", ["The most popular website", "An analyst's target", "A social post with many likes"], "Data sites summarize primary sources.", "primary-source-filing"),
    mc("CP-09", "In a research note, analyst targets belong under…", "B", "Opinions, kept separate from facts", ["Facts", "Decision rule", "Exposure"], "Targets are views, not reported figures.", "research-note"),
    mc("CP-10", "Every fact in a research note should carry…", "A", "Its source and the date or period it covers", ["An emoji", "A price target", "A friend's opinion"], "Dated, sourced facts can be rechecked later.", "research-note"),
    mc("CP-11", "A written decision rule should be…", "C", "Set in advance and tied to a number you can check", ["Set after the trade", "Based on mood", "Copied from a post"], "It keeps headlines from deciding.", "written-decision-rule"),
    mc("CP-12", "Your rule triggers and the 10-Q confirms the numbers. Posts say buy the dip. The process says…", "D", "Follow the rule", ["Follow the posts", "Wait for a feeling", "Double the position"], "Rule, checked number, primary source.", "written-decision-rule"),
    mc("CP-13", "Earnings are two days away and your rule bars new positions within three trading days. You…", "B", "Wait and add the report to the note", ["Buy now; research is done", "Buy double", "Ignore the date"], "The tools gave the date; the rule decides.", "written-decision-rule"),
    mc("CP-14", "Which statement about these four tools is accurate?", "A", "They are credited as research tools, not endorsed; paid tiers are optional", ["They are guaranteed accurate", "This app recommends buying their plans", "They replace SEC filings"], "Filings are free on SEC EDGAR.", "cross-check-sources"),
  ],
  terms: TERMS,
  cases: CASES,
};

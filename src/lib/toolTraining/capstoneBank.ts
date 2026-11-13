/**
 * TT11 · Capstone part 2 (/tools/capstone-bank): a bank, JPMorgan Chase (JPM), through Market Forces, StockAnalysis,
 * Finviz, Yahoo Finance and SEC EDGAR as a step-by-step workflow with a note that fills as you go. Public pages read
 * on Nov 13, 2026 before the open (Nov 12 close 342.82); filing figures from EDGAR (10-K filed Feb 13, 2026; 10-Qs
 * filed May 1, Aug 6 and Nov 3, 2026). Credited, not endorsed. JPM is an example, not a recommendation.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import { mc, seededTape } from "../marketThemes/helpers";
import type { ToolLesson, ToolSimulation, ToolWorkflow } from "./types";
import { edgarDocument, edgarFilings, edgarFullText, finvizQuote, marketForcesView, stockAnalysisStock, yahooQuote } from "./liveLinks";
import { simBar } from "./simWalk";

export const CB_READ_ON = "2026-11-13";
export const JPM_CIK = "0000019617";

/** The same fields on three sites, all read Nov 13, 2026 before the open. */
export const CB_JPM = {
  close: 342.82,
  closeStamp: "Nov 12, 2026, 4:00 PM ET",
  sa: { stamp: "pre-market 4:42 AM ET", marketCap: "910.40B", pe: 14.4, fwdPe: 13.67, ps: 4.77, pb: 2.59, ptbv: 3.07, roe: "18.01%", revenue: "190.73B", netIncome: "64.53B", eps: 23.81, ocf: "-84.16B", currentRatio: "n/a", pfcf: "n/a", debtEq: 3.59, shortFloat: "0.97%", target: 373.48, analysts: 26, employees: "322,964", ev: "654.14B" },
  fv: { stamp: "Nov 13 • 6:22 AM ET", price: 345.0, marketCap: "916.19B", pe: 14.47, fwdPe: 13.48, ps: 3.03, pb: 2.61, roe: "17.93%", sales: "302.55B", income: "64.53B", eps: 23.84, currentRatio: 1.14, pfcf: 5.95, debtEq: 3.42, shortFloat: "0.90%", target: 375.04, recom: 2.0, employees: "318,512" },
  yf: { stamp: "pre-market 6:04 AM ET", marketCap: "911.91B", pe: 14.4, fwdPe: 13.4, ps: 4.68, pb: 2.6, roe: "18.01%", revenue: "190.73B", netIncome: "64.53B", eps: 23.84, ocf: "-84.16B", currentRatio: "--", debtEq: "--", shortFloat: "0.90%", shortDate: "10/30/2026" },
} as const;

/** Net income from EDGAR (XBRL facts in the 10-K and 10-Qs), millions of USD. */
export const CB_FILINGS = {
  q3Filed: "2026-11-03",
  q3Period: "2026-09-30",
  toCommon: { fy2025: 55681, nine2025: 42991, nine2026: 51837 },
  total: { fy2025: 57048, nine2025: 44023, nine2026: 52954 },
  q3: { total: 15305, toCommon: 14936 },
} as const;
export const CB_TTM_COMMON = CB_FILINGS.toCommon.fy2025 - CB_FILINGS.toCommon.nine2025 + CB_FILINGS.toCommon.nine2026;
export const CB_TTM_TOTAL = CB_FILINGS.total.fy2025 - CB_FILINGS.total.nine2025 + CB_FILINGS.total.nine2026;
/** Market Forces' stored index-weight snapshot (ETF-based estimates, Oct 8, 2026). */
export const CB_MF = { theme: "financials", exposure: "Bank", sp500: 1.32, djia: 3.84 } as const;

const n = (v: number) => v.toLocaleString("en-US");
const NA = "Educational, not advice.";

const TERMS: LiteracyTerm[] = [
  { id: "net-income-to-common", name: "Net income to common shareholders", category: "markets", summary: "Net income after preferred dividends: the profit that belongs to common shareholders, and the figure EPS divides.", detail: `JPMorgan's trailing net income was ${n(CB_TTM_TOTAL)} million dollars in total but ${n(CB_TTM_COMMON)} million to common (EDGAR, ${CB_FILINGS.q3Filed} 10-Q). StockAnalysis and Yahoo showed 64.53B: the common figure. ${NA}` },
  { id: "bank-revenue-definitions", name: "Bank revenue on data sites", category: "markets", summary: "A bank's revenue can be shown net of interest expense or gross, before it; sites pick differently, so P/S differs.", detail: `On ${CB_READ_ON}, StockAnalysis and Yahoo showed JPM revenue of ${CB_JPM.sa.revenue} and Finviz showed Sales of ${CB_JPM.fv.sales}, so P/S read ${CB_JPM.sa.ps} and ${CB_JPM.fv.ps}. Read the bank's own income statement in its 10-Q to see the lines. ${NA}` },
  { id: "ratios-that-skip-banks", name: "Ratios that do not fit a bank", category: "process", summary: "Current ratio, enterprise value, EBITDA and free cash flow are built for companies that make and sell things; for a bank they are blank or misleading.", detail: `Deposits are a bank's raw material, not ordinary debt, and lending flows sit in operating cash flow. StockAnalysis showed JPM's operating cash flow at ${CB_JPM.sa.ocf} and P/FCF n/a. Read book value, return on equity, credit losses and capital instead. ${NA}` },
  { id: "research-note-template", name: "Research note template", category: "process", summary: "A fixed list of fields you fill for every stock: source, value and time for each read, then what would change your mind.", detail: `A template makes two stocks comparable and keeps opinions in their own line. The note is a record of what you saw, not a reason to trade. ${NA}` },
];

const T1 = seededTape({ seed: 11101, start: 148, preDrift: 0.001, postDrift: -0.002, vol: 0.012, gap: 0.015 });
const T2 = seededTape({ seed: 11102, start: 58, preDrift: 0.0005, postDrift: 0.0002, vol: 0.01, gap: -0.01 });
const T3 = seededTape({ seed: 11103, start: 96, preDrift: 0.0, postDrift: -0.001, vol: 0.011, gap: -0.02 });

const CASES: CaseStudy[] = [
  {
    id: "case-cb-ps-bargain",
    title: "Capstone 2: the cheap P/S on one site",
    contextType: "news",
    thinkingMode: "tool_capstone_bank",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. A post says a large bank \"trades at only 3 times sales, far below its 4.8 average\". You check: one site's Sales line is a gross figure before interest expense; the other two show revenue net of it and a P/S near 4.8. Buy = buy the bargain. Sell = nothing to sell. Hold = no trade: note the definition gap and read the income statement in the 10-Q.",
    newsHeadline: "Post: big bank \"cheap on sales\" after a quiet quarter.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "Two P/S ratios for one bank on one morning came from two revenue definitions, not two prices. For a bank, P/S is a weak measure anyway; book value, return on equity and credit costs say more. Read the 10-Q's income statement before quoting any revenue figure.",
      whyMarketMoved: "Nothing changed in the business; the post compared numbers built on different definitions.",
      evidence: "SAMPLE: the stock drifted with the sector over the next four sessions.",
    },
  },
  {
    id: "case-cb-negative-cash-flow",
    title: "Capstone 2: \"the bank burns cash\"",
    contextType: "news",
    thinkingMode: "tool_capstone_bank",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. A screenshot shows a large bank's operating cash flow at minus 84 billion dollars over twelve months, captioned \"burning cash, get out\". Free cash flow reads n/a. You hold a planned position. Buy = add, it is oversold. Sell = exit on the cash flow. Hold = keep the plan: for a bank, loans and trading assets run through operating cash flow, so read credit losses and capital in the 10-Q.",
    newsHeadline: "Screenshot claims a major bank is \"burning cash\".",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "Cash-flow ratios are built for companies that make and sell things. A bank's lending and trading balances swing operating cash flow by tens of billions in either direction. The bank-specific checks are book value, return on equity, credit loss provisions and capital ratios, all in the filing.",
      whyMarketMoved: "The screenshot carried no new information about the bank.",
      evidence: "SAMPLE: the stock moved sideways over the next four sessions.",
    },
  },
  {
    id: "case-cb-provision-jump",
    title: "Capstone 2: beat on EPS, rise in provisions",
    contextType: "news",
    thinkingMode: "tool_capstone_bank",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. A bank beats the EPS estimate, but the release shows its provision for credit losses up sharply, and the stock opens lower. Your note's rule says no new position within three trading days of earnings. Buy = the beat makes it cheap. Sell = nothing to sell. Hold = follow the rule: add the provision line and the 10-Q date to the note and revisit.",
    newsHeadline: "Bank tops EPS estimate; credit loss provisions climb.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "For a bank, provisions are money set aside for expected loan losses; a rise can say more about the next year than an EPS beat says about the last quarter. The written rule decides the timing; the 10-Q, filed after the release, gives the detail.",
      whyMarketMoved: "Traders weighed the higher expected losses against the earnings beat.",
      evidence: "SAMPLE: the stock stayed below its pre-report level for four sessions.",
    },
  },
];

const CB_SIMULATIONS: ToolSimulation[] = [
  {
    kind: "columns",
    id: "cb-sim-ttm",
    live: [edgarFilings(JPM_CIK, "10-Q", "JPM 10-Q filings"), stockAnalysisStock("JPM", "statistics", "JPM statistics")],
    title: "Rebuild trailing net income from the filings",
    goal: `TTM is not a number a company reports; data sites add it up. Rebuild JPMorgan's from the 10-K and two 10-Qs on EDGAR (millions of USD), then see which line StockAnalysis and Yahoo use. Real figures, read ${CB_READ_ON}; simulated layout.`,
    tape: `JPMorgan Chase (JPM) net income, millions USD, from EDGAR, read ${CB_READ_ON} · simulated layout`,
    start: 1,
    columns: ["Line", "FY 2025 (10-K)", "9 months 2025", "9 months 2026", "TTM to Sep 30, 2026"],
    rows: [
      ["Net income to common", n(CB_FILINGS.toCommon.fy2025), n(CB_FILINGS.toCommon.nine2025), n(CB_FILINGS.toCommon.nine2026), n(CB_TTM_COMMON)],
      ["Net income (total)", n(CB_FILINGS.total.fy2025), n(CB_FILINGS.total.nine2025), n(CB_FILINGS.total.nine2026), n(CB_TTM_TOTAL)],
    ],
    steps: [
      { col: 1, row: 0, what: `FY 2025 from the 10-K (filed Feb 13, 2026): net income to common ${n(CB_FILINGS.toCommon.fy2025)} million.`, why: "Start with the last full fiscal year. It is the one audited annual number in the sum, and every other column is adjusted from it." },
      { col: 2, row: 0, what: `Nine months to Sep 30, 2025: ${n(CB_FILINGS.toCommon.nine2025)} million, shown as the comparison column in the latest 10-Q.`, why: "Subtract the part of last year that the newest nine months replace. Use the comparison column as restated in the new 10-Q, not an older copy." },
      { col: 3, row: 0, what: `Nine months to Sep 30, 2026: ${n(CB_FILINGS.toCommon.nine2026)} million, from the 10-Q filed ${CB_FILINGS.q3Filed}.`, why: "This is the newest year-to-date figure. Read the period header in the filing; a 10-Q shows the quarter and the year to date side by side." },
      { col: 4, row: 0, what: `TTM = ${n(CB_FILINGS.toCommon.fy2025)} − ${n(CB_FILINGS.toCommon.nine2025)} + ${n(CB_FILINGS.toCommon.nine2026)} = ${n(CB_TTM_COMMON)} million, which rounds to 64.53B.`, why: "StockAnalysis and Yahoo both showed 64.53B on this morning. Rebuilding the sum tells you exactly which periods the site's P/E rests on." },
      { col: 4, row: 1, what: `The same sum on total net income gives ${n(CB_TTM_TOTAL)} million, about 1.45 billion more.`, why: "The gap is preferred dividends. EPS and P/E use net income to common, so when a site's number does not match the filing, check which line it took before calling it an error." },
    ],
    takeaway: "TTM = last fiscal year − last year's year-to-date + this year's year-to-date. Rebuild it from the filings once and you will know which line a site is quoting.",
  },
  {
    kind: "columns",
    id: "cb-sim-bank-ratios",
    live: [stockAnalysisStock("JPM", "statistics", "JPM statistics"), finvizQuote("JPM", "JPM snapshot"), yahooQuote("JPM", "key-statistics", "JPM statistics")],
    title: "Which ratios fit a bank, site by site",
    goal: `Line up the same fields for JPMorgan on three sites (read ${CB_READ_ON} before the open) and sort them into "fits a bank" and "built for other businesses".`,
    tape: `JPMorgan Chase (JPM) fields on three sites, read ${CB_READ_ON} · simulated layout`,
    start: 1,
    columns: ["Field", "StockAnalysis", "Finviz", "Yahoo Finance"],
    rows: [
      ["P/E", `${CB_JPM.sa.pe}`, `${CB_JPM.fv.pe}`, `${CB_JPM.yf.pe}`],
      ["P/B", `${CB_JPM.sa.pb}`, `${CB_JPM.fv.pb}`, `${CB_JPM.yf.pb}`],
      ["Return on equity", CB_JPM.sa.roe, CB_JPM.fv.roe, CB_JPM.yf.roe],
      ["Revenue / Sales", CB_JPM.sa.revenue, CB_JPM.fv.sales, CB_JPM.yf.revenue],
      ["Current ratio", CB_JPM.sa.currentRatio, `${CB_JPM.fv.currentRatio}`, CB_JPM.yf.currentRatio],
      ["P/FCF", CB_JPM.sa.pfcf, `${CB_JPM.fv.pfcf}`, "--"],
    ],
    steps: [
      { col: 1, row: 0, what: `P/E: ${CB_JPM.sa.pe}, ${CB_JPM.fv.pe}, ${CB_JPM.yf.pe}. Close agreement.`, why: "EPS agreed within a few cents (23.81 and 23.84), so the small gap is the price used. P/E works for a bank as for any company with steady profits." },
      { col: 1, row: 1, what: `P/B: ${CB_JPM.sa.pb}, ${CB_JPM.fv.pb}, ${CB_JPM.yf.pb}; StockAnalysis also showed P/TBV ${CB_JPM.sa.ptbv}.`, why: "A bank's assets are mostly loans and securities carried near their value, so price to book (and to tangible book, without goodwill) is a core bank measure." },
      { col: 2, row: 2, what: `Return on equity: ${CB_JPM.sa.roe}, ${CB_JPM.fv.roe}, ${CB_JPM.yf.roe}.`, why: "ROE says how much profit the bank earns on its book value. Read P/B and ROE together: a higher P/B usually comes with a higher ROE." },
      { col: 2, row: 3, what: `Revenue: ${CB_JPM.sa.revenue} on StockAnalysis and Yahoo, Sales ${CB_JPM.fv.sales} on Finviz, so P/S read ${CB_JPM.sa.ps} and ${CB_JPM.fv.ps}.`, why: "A gap of more than 100 billion dollars is a definition, not timing: one figure is net of interest expense, the other is gross. For a bank, quote revenue with its definition, or skip P/S." },
      { col: 3, row: 4, what: `Current ratio: ${CB_JPM.sa.currentRatio} on StockAnalysis, ${CB_JPM.fv.currentRatio} on Finviz, ${CB_JPM.yf.currentRatio} on Yahoo.`, why: "Banks do not split their balance sheet into current and non-current. A number in this row is a site's own calculation, not something the bank reports." },
      { col: 2, row: 5, what: `P/FCF: n/a on StockAnalysis, ${CB_JPM.fv.pfcf} on Finviz, -- on Yahoo; operating cash flow read ${CB_JPM.sa.ocf}.`, why: "Free cash flow is built for companies that spend on plants and equipment. A bank's loans and trading balances swing its cash flow, so this row says little about the bank." },
    ],
    takeaway: "For a bank, lean on P/E, P/B (and tangible book), ROE, credit losses and capital. Treat current ratio, P/FCF and P/S as a site's calculation that may not fit the business.",
  },
  {
    kind: "bars",
    id: "cb-sim-provisions",
    title: "Earnings day: the EPS beat and the provision line",
    goal: "Walk a SAMPLE bank through a report where EPS beats but the provision for credit losses jumps, and see why the note records both, with the date the 10-Q arrives.",
    tape: "SAMPLE bank · daily bars around a report · simulated",
    start: 2,
    bars: [
      simBar("T-3", [96, 96.8, 95.4, 96.4], "Three days before the report: the SAMPLE bank closes at 96.40.", "Your note already lists the report date from the company's own events page, not only a data site's estimate. That date sets when the rule's no-new-position window starts."),
      simBar("T-1", [96.4, 97, 95.8, 96.6], "The day before, close 96.60. Sites show an EPS estimate of 2.10.", "An estimate is the average of analysts' forecasts. Write it down with its source and time; the comparison tomorrow is with this number, not with the stock price."),
      simBar("Report", [94.2, 95, 92.6, 93.1], "Report day: EPS 2.24 beats the estimate, but the provision for credit losses is up sharply. Close 93.10.", "A provision is money set aside for expected loan losses. It falls straight into profit, so a jump can be a warning about the next year even when this quarter beat.", { mark: "earnings", readout: "EPS 2.24 vs 2.10 est." }),
      simBar("T+1", [93.1, 94, 92.2, 92.8], "Next day, close 92.80. Posts argue the beat makes it cheap.", "The rule (an example form, not advice) bars a new position for three trading days after the report. The note gets two lines: the beat, and the provision change, each with its source."),
      simBar("T+3", [92.8, 94.6, 92.4, 94.1], "Three days on, close 94.10.", "The window has passed. Before deciding anything, read the 10-Q: it breaks provisions down by loan type and explains the change in the bank's own words.", { mark: "news" }),
      simBar("10-Q", [94.1, 95.2, 93.6, 94.8], "The 10-Q arrives on EDGAR a few weeks after the release. Close 94.80.", "Record its filing date and the provision detail in the note. The release is the headline; the 10-Q is the primary source for what changed, and it is what your rule should point at.", { mark: "news", readout: "10-Q filed" }),
    ],
    takeaway: "For a bank, an EPS line and a provision line can point different ways. Record both with dates, wait out the rule's window, and let the 10-Q supply the detail.",
  },
];

const WORKFLOW: ToolWorkflow = {
  title: "Workflow: research a bank in seven steps",
  intro: "Open each live page in a new tab, do the read, and type what you see with its time stamp. The note on the right fills as you go; copy it when it is done. Nothing is checked against an answer: live values move, and the note is your record.",
  noteTitle: "Research note: JPMorgan Chase (JPM)",
  steps: [
    {
      id: "cb-w1",
      title: "Start with what you would own",
      live: [marketForcesView({ theme: CB_MF.theme, ticker: "JPM" }, "JPM in the Financials theme")],
      do: ["Read JPM's exposure badge and the Financials theme's connection line.", "Turn on Index weights and read JPM's S&P 500 weight and its snapshot date."],
      fields: [
        { key: "exposure", label: "Exposure label", placeholder: CB_MF.exposure },
        { key: "connection", label: "What the theme says to watch", placeholder: "Rates, credit losses, regulation" },
        { key: "weight", label: "S&P 500 weight and snapshot date", placeholder: `${CB_MF.sp500}% · Oct 8, 2026` },
      ],
    },
    {
      id: "cb-w2",
      title: "Reported facts and bank ratios on StockAnalysis",
      live: [stockAnalysisStock("JPM", "statistics", "JPM statistics")],
      do: ["Read the price time stamp at the top first.", "Then PE Ratio, PB Ratio, P/TBV Ratio and Return on Equity (ROE)."],
      fields: [
        { key: "sa_time", label: "Price time stamp", placeholder: "Nov 12, 4:00 PM ET close" },
        { key: "sa_pe", label: "PE Ratio", placeholder: `${CB_JPM.sa.pe}` },
        { key: "sa_pb", label: "PB and P/TBV", placeholder: `${CB_JPM.sa.pb} · ${CB_JPM.sa.ptbv}` },
        { key: "sa_roe", label: "Return on equity", placeholder: CB_JPM.sa.roe },
      ],
    },
    {
      id: "cb-w3",
      title: "Cross-check on Finviz",
      live: [finvizQuote("JPM", "JPM quote page")],
      do: ["Read the header time stamp: pre-market, delayed or the close?", "Then P/E, P/B and Sales. Compare Sales with StockAnalysis's revenue and write down why they differ."],
      fields: [
        { key: "fv_time", label: "Header time stamp", placeholder: CB_JPM.fv.stamp },
        { key: "fv_pe_pb", label: "P/E and P/B", placeholder: `${CB_JPM.fv.pe} · ${CB_JPM.fv.pb}` },
        { key: "fv_sales", label: "Sales, and why it differs", placeholder: `${CB_JPM.fv.sales}: gross, before interest expense` },
      ],
    },
    {
      id: "cb-w4",
      title: "Cross-check on Yahoo Finance",
      live: [yahooQuote("JPM", "key-statistics", "JPM statistics")],
      do: ["Read Trailing P/E and Price/Book in the Current column.", "Read Short % of Float with the date in its label."],
      fields: [
        { key: "yf_pe_pb", label: "Trailing P/E and Price/Book", placeholder: `${CB_JPM.yf.pe} · ${CB_JPM.yf.pb}` },
        { key: "yf_short", label: "Short % of float and its date", placeholder: `${CB_JPM.yf.shortFloat} (${CB_JPM.yf.shortDate})` },
      ],
    },
    {
      id: "cb-w5",
      title: "Confirm in the filing on SEC EDGAR",
      live: [edgarFilings(JPM_CIK, "10-Q", "JPM 10-Q filings"), edgarFullText("provision for credit losses", "full-text search, JPM 10-Qs", { cik: JPM_CIK, forms: ["10-Q"] })],
      do: ["Open the latest 10-Q and note its filing date and the period it covers.", "Find net income applicable to common and the provision for credit losses for the quarter."],
      fields: [
        { key: "q_filed", label: "Latest 10-Q: filed, and period", placeholder: `${CB_FILINGS.q3Filed} · quarter to ${CB_FILINGS.q3Period}` },
        { key: "q_income", label: "Quarter's net income to common", placeholder: `${n(CB_FILINGS.q3.toCommon)} million` },
        { key: "q_provision", label: "Quarter's provision for credit losses", placeholder: "From the income statement" },
      ],
    },
    {
      id: "cb-w6",
      title: "The next report date",
      live: [yahooQuote("JPM", "", "JPM summary"), stockAnalysisStock("JPM", "", "JPM overview")],
      do: ["Read the earnings date the data site shows.", ["Then check it against the company's own investor relations page: a data site may show an estimate or the call time rather than the release time (Tool Training → Earnings dates and insiders)."]],
      fields: [{ key: "next_report", label: "Next report date and its source", placeholder: "Jan 14, 2027 · company IR" }],
    },
    {
      id: "cb-w7",
      title: "Write what would change your mind",
      live: [edgarDocument("19617/000162828026069523/", "JPM 10-Q filed Nov 3, 2026")],
      do: ["One line: the number you will check next time, and where.", "Opinions (targets, ratings) go in their own line, labeled as opinions."],
      fields: [
        { key: "change_mind", label: "What would change your mind", placeholder: "Provisions up two quarters in a row in the 10-Q" },
        { key: "opinions", label: "Opinions, labeled", placeholder: "Avg target 373.48 (26 analysts, StockAnalysis)" },
      ],
    },
  ],
  note: [
    "Owning: {exposure}. Theme says watch: {connection}. Index weight: {weight}.",
    "StockAnalysis ({sa_time}): P/E {sa_pe}; P/B and P/TBV {sa_pb}; ROE {sa_roe}.",
    "Finviz ({fv_time}): P/E and P/B {fv_pe_pb}; Sales {fv_sales}.",
    "Yahoo Finance: P/E and P/B {yf_pe_pb}; short % of float {yf_short}.",
    "SEC EDGAR: 10-Q {q_filed}; net income to common {q_income}; provision {q_provision}.",
    "Next report: {next_report}.",
    "Would change my mind: {change_mind}.",
    "Opinions (not facts): {opinions}.",
    "Educational record, not advice.",
  ],
};

export const CAPSTONE_BANK_LESSON: ToolLesson = {
  id: "tool-capstone-bank",
  slug: "capstone-bank",
  route: "/tools/capstone-bank",
  menuLabel: "Capstone 2: a bank, step by step",
  icon: "account_balance",
  title: "Capstone part 2: research a bank across five tools",
  blurb: "JPMorgan Chase through Market Forces, StockAnalysis, Finviz, Yahoo Finance and SEC EDGAR as a guided workflow, with a research note that fills as you go.",
  credit: { name: "Market Forces, StockAnalysis, Finviz, Yahoo Finance and SEC EDGAR", url: "https://www.sec.gov/edgar/search/", note: "Each tool is credited for what it shows, not endorsed. JPMorgan is an example, not a recommendation." },
  asOf: CB_READ_ON,
  quiz: { name: "Tool: Capstone 2 (a bank)", description: "Bank ratios that fit and ones that do not, revenue definitions, TTM from the filings, provisions, and a dated research note.", icon: "account_balance" },
  intro: [
    "The first capstone followed a gold miner. A bank is a different business: its raw material is money, its revenue is mostly the spread between what it earns on loans and pays on deposits, and several ratios the data sites print were built for companies that make and sell things.",
    ["This walk uses JPMorgan Chase (JPM), read on Nov 13, 2026 before the open. You will ", { text: "sort the ratios that fit a bank", sim: "cb-sim-bank-ratios" }, " from those that do not, ", { text: "rebuild trailing net income from the filings", sim: "cb-sim-ttm" }, ", and follow a written rule through ", { text: "an earnings day with a provision jump", sim: "cb-sim-provisions" }, "."],
    ["The workflow below has seven steps. Each opens a live page and asks for a value and its time stamp; the note fills as you go. Bank terms to know: ", { text: "net interest income", term: "net-interest-income" }, ", ", { text: "provision for credit losses", term: "provision-for-credit-losses" }, ", ", { text: "tangible book value", term: "tangible-book-value" }, " and ", { text: "return on equity", term: "return-on-equity" }, "."],
  ],
  screens: [
    {
      id: "cb-three-sites",
      live: [stockAnalysisStock("JPM", "statistics", "JPM statistics"), finvizQuote("JPM", "JPM snapshot"), yahooQuote("JPM", "key-statistics", "JPM statistics")],
      title: "One bank, three sites, one morning",
      where: "StockAnalysis Statistics · Finviz quote · Yahoo Statistics",
      alt: "Simulated comparison table for JPMorgan Chase read on November 13, 2026 before the open. P/E 14.40 on StockAnalysis, 14.47 on Finviz, 14.40 on Yahoo. P/B 2.59, 2.61, 2.60. Revenue 190.73 billion on StockAnalysis and Yahoo but Sales 302.55 billion on Finviz, giving P/S of 4.77 and 3.03. Employees 322,964 and 318,512.",
      caption: `JPMorgan's real fields, read ${CB_READ_ON} before the open (Nov 12 close ${CB_JPM.close}). Layout simulated.`,
      blocks: [
        { kind: "quote", symbol: "JPM", name: "JPMorgan Chase & Co.", price: `${CB_JPM.close}`, change: "−0.57 (−0.17%)", up: false, meta: `At close: ${CB_JPM.closeStamp} · Finviz pre-market ${CB_JPM.fv.price} (${CB_JPM.fv.stamp})` },
        { kind: "table", title: "Same field, three sites", columns: ["Field", "StockAnalysis", "Finviz", "Yahoo Finance"], rows: [
          ["P/E", `${CB_JPM.sa.pe}`, `${CB_JPM.fv.pe}`, `${CB_JPM.yf.pe}`],
          ["Forward P/E", `${CB_JPM.sa.fwdPe}`, `${CB_JPM.fv.fwdPe}`, `${CB_JPM.yf.fwdPe}`],
          ["P/B", `${CB_JPM.sa.pb}`, `${CB_JPM.fv.pb}`, `${CB_JPM.yf.pb}`],
          ["Revenue", CB_JPM.sa.revenue, `${CB_JPM.fv.sales} (Sales)`, CB_JPM.yf.revenue],
          ["P/S", `${CB_JPM.sa.ps}`, `${CB_JPM.fv.ps}`, `${CB_JPM.yf.ps}`],
          ["Employees", CB_JPM.sa.employees, CB_JPM.fv.employees, "—"],
        ] },
        { kind: "note", text: "Small gaps (P/E, P/B) are the price and time used. The revenue gap is a definition: one site counts interest income before interest expense." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Read the time stamps first: the close on one site, a pre-market price on another." },
        { n: 2, block: 1, text: ["P/E and P/B agree within a few hundredths. ", { text: "Revenue does not", sim: "cb-sim-bank-ratios" }, ", so P/S differs by more than a third."] },
        { n: 3, block: 2, text: ["When sites disagree on a definition, the bank's own income statement in its 10-Q settles what was reported. ", { text: "Rebuild the TTM", sim: "cb-sim-ttm" }, " to see which line each site uses."] },
      ],
    },
    {
      id: "cb-bank-fit",
      live: [stockAnalysisStock("JPM", "statistics", "JPM statistics")],
      title: "Fields that fit a bank, and fields that do not",
      where: "StockAnalysis · Statistics tab",
      alt: "Simulated StockAnalysis statistics panel for JPMorgan split in two. Fits a bank: PB Ratio 2.59, P/TBV Ratio 3.07, Return on Equity 18.01 percent, Net Income 64.53 billion. Built for other businesses: Current Ratio n/a, P/FCF Ratio n/a, Operating Cash Flow minus 84.16 billion, Enterprise Value 654.14 billion below the market cap.",
      caption: `StockAnalysis's real JPM statistics, read ${CB_READ_ON}. Layout simulated.`,
      blocks: [
        { kind: "stats", title: "Fits a bank", rows: [{ label: "PB Ratio", value: `${CB_JPM.sa.pb}` }, { label: "P/TBV Ratio", value: `${CB_JPM.sa.ptbv}` }, { label: "Return on Equity (ROE)", value: CB_JPM.sa.roe }, { label: "Net Income", value: CB_JPM.sa.netIncome }, { label: "PE Ratio", value: `${CB_JPM.sa.pe}` }] },
        { kind: "stats", title: "Built for other businesses", rows: [{ label: "Current Ratio", value: CB_JPM.sa.currentRatio }, { label: "P/FCF Ratio", value: CB_JPM.sa.pfcf }, { label: "Operating Cash Flow", value: CB_JPM.sa.ocf }, { label: "Enterprise Value", value: CB_JPM.sa.ev }, { label: "Market Cap", value: CB_JPM.sa.marketCap }] },
        { kind: "note", text: "Enterprise value below the market cap: the site subtracts the bank's cash, which for a bank is part of the business, not spare money." },
      ],
      callouts: [
        { n: 1, block: 0, text: ["Price to book, ", { text: "tangible book", term: "tangible-book-value" }, " and ", { text: "return on equity", term: "return-on-equity" }, " are the core bank reads. Read them together."] },
        { n: 2, block: 1, text: "Current ratio and free cash flow are blank for a reason. Operating cash flow swings with loans and trading balances." },
        { n: 3, block: 2, text: ["For a bank, the filing's lines that matter are net interest income, ", { text: "provisions", sim: "cb-sim-provisions" }, " and capital ratios."] },
      ],
    },
  ],
  walkthroughs: [
    {
      title: "The bank checklist",
      steps: [
        "Exposure first: a bank, a payments network and a sector fund in the same theme are different businesses.",
        ["Valuation that fits: P/E, P/B, P/TBV and ROE; ", { text: "treat current ratio and P/FCF as a site's calculation", sim: "cb-sim-bank-ratios" }, "."],
        "Revenue: quote it with its definition (net of interest expense or gross), or skip P/S.",
        ["Filings: ", { text: "TTM net income to common", sim: "cb-sim-ttm" }, ", the quarter's provision for credit losses, and the 10-Q's filing date."],
        ["Dates and rules: the next report from the company's own page, and a written rule for ", { text: "the days around it", sim: "cb-sim-provisions" }, "."],
      ],
    },
  ],
  simulations: CB_SIMULATIONS,
  workflow: WORKFLOW,
  tasks: [
    { id: "cb-t1", find: "JPMorgan's P/TBV Ratio", live: stockAnalysisStock("JPM", "statistics", "JPM statistics"), where: "Statistics › Valuation Ratios: P/TBV Ratio", answer: { format: "number", min: 0.3, max: 10, example: "3.07" }, why: "Price to tangible book strips out goodwill, so it compares banks that grew by acquisition with those that did not." },
    { id: "cb-t2", find: "JPMorgan's Sales on Finviz", live: finvizQuote("JPM", "JPM snapshot"), where: "Quote page snapshot table: Sales", answer: { format: "money", min: 50e9, max: 600e9, example: "302.55B" }, why: "Compare it with StockAnalysis's revenue. A gap of this size is a definition, and it changes P/S by a third." },
    { id: "cb-t3", find: "JPMorgan's Price/Book on Yahoo Finance", live: yahooQuote("JPM", "key-statistics", "JPM statistics"), where: "Statistics › Valuation Measures: Price/Book, Current column", answer: { format: "number", min: 0.3, max: 10, example: "2.60" }, why: "P/B is a core bank measure. Three sites within a few hundredths of each other means the inputs agree." },
    { id: "cb-t4", find: "The filing date of JPMorgan's latest 10-Q", live: edgarFilings(JPM_CIK, "10-Q", "JPM 10-Q filings"), where: "EDGAR filing list: the Filing Date column, top 10-Q row", answer: { format: "date", example: "2026-11-03", minYear: 2026, maxYear: 2028 }, why: "The 10-Q date tells you how fresh the TTM figures are. Data sites update within hours to days of it." },
  ],
  drills: [
    { id: "cb-d1", prompt: "For a bank, the most useful pair of valuation reads is…", options: ["Current ratio and P/FCF", "P/B (or P/TBV) and return on equity", "EV/EBITDA and P/S", "Dividend yield alone"], answer: 1, why: "A bank's assets are mostly financial and carried near value, so price to book with ROE fits the business." },
    { id: "cb-d2", prompt: `Revenue reads ${CB_JPM.sa.revenue} on one site and Sales ${CB_JPM.fv.sales} on another, same morning. Most likely…`, options: ["A typo", "Different definitions: net of interest expense versus gross", "One site is a quarter behind", "A stock split"], answer: 1, why: "A gap of over 100 billion dollars is not timing. Check the bank's income statement for the lines." },
    { id: "cb-d3", prompt: "TTM net income from the filings is…", options: ["The latest quarter × 4", "Last fiscal year − last year's year-to-date + this year's year-to-date", "The 10-K figure", "The average of four years"], answer: 1, why: "That sum covers exactly the latest twelve months." },
    { id: "cb-d4", prompt: "A site's TTM net income is about 1.45 billion below your sum of total net income. First check…", options: ["Whether it uses net income to common, after preferred dividends", "Whether the site is broken", "The stock price", "The analyst target"], answer: 0, why: "EPS and P/E use the common figure; JPM's two lines differ by its preferred dividends." },
    { id: "cb-d5", prompt: "EPS beats, but the provision for credit losses jumps. Your note should…", options: ["Record only the beat", "Record both lines with sources and dates, then read the 10-Q", "Ignore both", "Average them"], answer: 1, why: "Provisions point at expected losses ahead; the 10-Q breaks them down." },
  ],
  caveats: [
    { title: "Banks break generic ratios", text: "Current ratio, enterprise value, EBITDA and free cash flow were built for companies that make and sell things. On a bank they are blank, or a site's own calculation that the bank does not report." },
    { title: "Definitions before differences", text: "Revenue and P/S differed by more than a third across sites on the same morning. Quote a figure with its source, time and definition, and use the 10-Q to settle it." },
    { title: "One example, not a pick", text: "JPMorgan is used because its filings and data are public and plentiful. It is an example of a process, not a recommendation; the tools are credited, not endorsed." },
  ],
  sources: [
    { label: "StockAnalysis: JPMorgan Chase statistics", url: "https://stockanalysis.com/stocks/jpm/statistics/", supports: "P/E 14.40, forward P/E 13.67, P/S 4.77, P/B 2.59, P/TBV 3.07, ROE 18.01%, revenue 190.73B, net income 64.53B, operating cash flow −84.16B, current ratio and P/FCF n/a (read Nov 13, 2026)" },
    { label: "Finviz: JPMorgan Chase quote page", url: "https://finviz.com/quote.ashx?t=JPM", supports: "Header Nov 13 • 6:22 AM ET, P/E 14.47, P/B 2.61, P/S 3.03, Sales 302.55B, current ratio 1.14, P/FCF 5.95, employees 318,512 (read Nov 13, 2026)" },
    { label: "Yahoo Finance: JPMorgan Chase statistics", url: "https://finance.yahoo.com/quote/JPM/key-statistics/", supports: "Trailing P/E 14.40, Price/Book 2.60, P/S 4.68, revenue 190.73B, net income to common 64.53B, short % of float 0.90% (10/30/2026) (read Nov 13, 2026)" },
    { label: "SEC EDGAR: JPMorgan Chase 10-Q filings", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000019617&type=10-Q&dateb=&owner=include&count=40", supports: "10-Qs filed May 1, Aug 6 and Nov 3, 2026" },
    { label: "SEC EDGAR: XBRL company facts (net income, net income to common)", url: "https://data.sec.gov/api/xbrl/companyconcept/CIK0000019617/us-gaap/NetIncomeLossAvailableToCommonStockholdersBasic.json", supports: "FY 2025 55,681M; nine months 2025 42,991M and 2026 51,837M to common; totals 57,048M, 44,023M, 52,954M" },
    { label: "Market Forces data: Financials theme and index weights", url: "https://github.com/Siphon880gh/tickers", supports: "JPM exposure Bank; S&P 500 1.32% and Dow 3.84% (ETF-based estimates, Oct 8, 2026)" },
  ],
  links: [
    { label: "Learn → Tool: Capstone 2 (a bank)", to: "/training?group=tool-capstone-bank" },
    { label: "Coach → A bank, five tools", to: "/coach/tool-capstone-bank" },
    { label: "Tool Training → Capstone part 1 (a miner)", to: "/tools/capstone" },
    { label: "Tool Training → Earnings dates and insiders", to: "/tools/earnings-insiders" },
    { label: "Tool Training → SEC EDGAR", to: "/tools/sec-edgar" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "tool_capstone_bank",
  modeLabel: "Capstone 2: a bank, step by step",
  modeTip: "For a bank, use P/B, ROE, credit losses and capital; quote revenue with its definition; rebuild TTM from the filings; let a written rule handle report days. Cases → Market-wide news.",
  questions: [
    mc("CB-01", "A bank's revenue is mostly…", "B", "The spread between what it earns on loans and securities and pays on deposits and debt, plus fees", ["Sales of products", "Rent from branches", "Its share price"], "Net interest income plus noninterest revenue such as fees and trading.", "net-interest-income"),
    mc("CB-02", "Which pair fits a bank best?", "A", "Price to book (or tangible book) and return on equity", ["Current ratio and quick ratio", "EV/EBITDA and P/FCF", "Inventory turnover and gross margin"], "Bank assets are mostly financial and carried near value.", "price-to-book"),
    mc("CB-03", `On ${CB_READ_ON}, JPM's current ratio read n/a, 1.14 and --. That means…`, "C", "Banks do not report current and non-current splits; any number is a site's own calculation", ["JPM is about to default", "Finviz has inside data", "The ratio is 1.14 by law"], "Treat it as not meaningful for a bank.", "ratios-that-skip-banks"),
    mc("CB-04", `Revenue ${CB_JPM.sa.revenue} on StockAnalysis, Sales ${CB_JPM.fv.sales} on Finviz. The gap is mostly…`, "D", "Definition: revenue net of interest expense versus a gross figure", ["Timing: one is pre-market", "A currency conversion", "A stock split"], "Gaps that large are definitions, not prices.", "bank-revenue-definitions"),
    mc("CB-05", `Because of that gap, P/S read ${CB_JPM.sa.ps} and ${CB_JPM.fv.ps}. The sound note is…`, "A", "Quote P/S with its revenue definition, or skip it for a bank", ["The stock is cheap on Finviz", "Average the two", "Use whichever is lower"], "A ratio is only as comparable as its inputs.", "bank-revenue-definitions"),
    mc("CB-06", "TTM net income from the filings equals…", "B", "Last fiscal year − last year's year-to-date + this year's year-to-date", ["Latest quarter × 4", "The 10-K figure", "The last two quarters × 2"], "That sum covers exactly the latest twelve months.", "trailing-twelve-months"),
    mc("CB-07", `JPM's TTM net income to common from EDGAR was ${n(CB_TTM_COMMON)} million. StockAnalysis showed…`, "C", "64.53B: the same figure, rounded", ["65.98B, the total", "57.05B, the fiscal year", "15.31B, one quarter"], "Rebuilding the sum shows which line the site uses.", "net-income-to-common"),
    mc("CB-08", "Total net income ran about 1.45 billion above net income to common. The difference is…", "D", "Preferred dividends", ["Taxes", "Interest expense", "Share buybacks"], "EPS divides the common figure.", "net-income-to-common"),
    mc("CB-09", "A provision for credit losses is…", "A", "Money set aside for expected loan losses, charged against profit", ["A dividend", "A fee paid by borrowers", "Cash in the vault"], "A rise can signal expected losses ahead.", "provision-for-credit-losses"),
    mc("CB-10", "EPS beats but provisions jump. A dated research note…", "B", "Records both lines with sources, then the 10-Q's detail", ["Records the beat only", "Records neither", "Replaces both with the price change"], "Both lines matter; the 10-Q explains the change.", "research-note-template"),
    mc("CB-11", `StockAnalysis showed JPM's enterprise value (${CB_JPM.sa.ev}) below its market cap (${CB_JPM.sa.marketCap}). Why?`, "C", "The formula subtracts cash, and a bank holds a lot of it as part of the business", ["JPM has negative debt", "The site made an error", "EV includes preferred dividends"], "EV is built for non-financial companies.", "ratios-that-skip-banks"),
    mc("CB-12", "Operating cash flow of −84.16B over twelve months for a large bank most likely reflects…", "A", "Swings in loans and trading balances that run through operating cash flow", ["A cash crisis", "A data error", "Dividends paid"], "Cash-flow ratios rarely describe a bank well.", "ratios-that-skip-banks"),
    mc("CB-13", "In Market Forces, JPM's exposure label is…", "D", "Bank", ["Payments", "Financial stocks", "Insurer"], "Visa is Payments and XLF is Financial stocks in the same theme.", "research-note-template"),
    mc("CB-14", "The best place for an analyst target in your note is…", "B", "Its own line, labeled as an opinion with its source and count", ["The headline", "Mixed into the facts", "Nowhere; delete it"], "Keep facts and opinions apart.", "research-note-template"),
  ],
  terms: TERMS,
  cases: CASES,
};

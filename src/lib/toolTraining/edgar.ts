/**
 * TT12 · SEC EDGAR (/tools/sec-edgar): full-text search, a company's filing list, rebuilding a data site's TTM from
 * the 10-K and 10-Q, and reading a Form 4 against the insider row a data site shows. Public pages and EDGAR's XBRL
 * facts read on Nov 13, 2026. EDGAR is the SEC's public filing system; data sites are credited, not endorsed.
 * Companies are examples, not recommendations. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import { mc, seededTape } from "../marketThemes/helpers";
import type { ToolLesson, ToolSimulation } from "./types";
import { edgarDocument, edgarFilings, edgarFullText, edgarInsiders, finvizQuote, stockAnalysisStock } from "./liveLinks";
import { simBar } from "./simWalk";
import { JPM_CIK } from "./capstoneBank";

export const ED_READ_ON = "2026-11-13";
export const NEM_CIK = "0001164727";

/** Newmont from EDGAR's XBRL facts, millions USD: 10-K filed Feb 19, 2026; 10-Q filed Oct 22, 2026. */
export const ED_NEM = {
  tenKFiled: "2026-02-19",
  tenQFiled: "2026-10-22",
  tenQPath: "1164727/000116472726000043/",
  revenue: { fy2025: 22669, nine2025: 15851, nine2026: 19788, quarters2026: [7307, 6118, 6363] },
  netIncome: { fy2025: 7085, nine2025: 5784, nine2026: 7939, quarters2026: [3262, 2202, 2475] },
  /** StockAnalysis's TTM column, read Nov 12, 2026 (see the StockAnalysis lesson). */
  saTtm: { revenue: 26606, netIncome: 9240 },
} as const;
export const ED_TTM = {
  revenue: ED_NEM.revenue.fy2025 - ED_NEM.revenue.nine2025 + ED_NEM.revenue.nine2026,
  netIncome: ED_NEM.netIncome.fy2025 - ED_NEM.netIncome.nine2025 + ED_NEM.netIncome.nine2026,
} as const;

/** Full-text search: "all-in sustaining costs", Newmont, 10-Q (read Nov 13, 2026). */
export const ED_FTS = { query: "all-in sustaining costs", hits: 42, firstHitsYears: "2021 and 2022" } as const;

/** JPM 10-Q filing dates on EDGAR. */
export const ED_JPM_10Q = ["2026-11-03", "2026-08-06", "2026-05-01", "2025-11-04"] as const;

/** One Form 4 (accession 0001225208-26-007727) and Finviz's row for it, both read Nov 13, 2026. */
export const ED_FORM4 = {
  path: "19617/000122520826007727/xslF345X05/doc4.xml",
  person: "Leopold Robin",
  title: "Head of Human Resources",
  date: "2026-09-10",
  code: "S",
  shares: 2500,
  price: 352.8106,
  ownedAfter: 71047,
  indirect: "9,201 by GRAT; 9,201 by spouse's GRAT",
  plan: true,
  finviz: { date: "Sep 10 '26", transaction: "Sale", cost: 352.81, value: 882026, total: 71047, filed: "Sep 10 04:27 PM", form144: "Sep 10 04:25 PM" },
} as const;

const n = (v: number) => v.toLocaleString("en-US");
const NA = "Educational, not advice.";

const TERMS: LiteracyTerm[] = [
  { id: "sec-edgar", name: "SEC EDGAR", category: "process", summary: "The SEC's free public database of company filings: annual and quarterly reports, current reports, insider forms and more.", detail: `It is the primary source data sites summarize. Each filing has a filing date and an accession number; the company's own words are in it. ${NA}` },
  { id: "edgar-full-text-search", name: "EDGAR full-text search", category: "process", summary: "EDGAR's search across the text of filings submitted since 2001, including exhibits, with exact phrases in quotes.", detail: `Results can sort by relevance, not date: on ${ED_READ_ON} a phrase search of Newmont's 10-Qs returned ${ED_FTS.hits} hits led by ${ED_FTS.firstHitsYears} filings. Narrow the date range or sort by filing date. ${NA}` },
  { id: "form-10-q", name: "Form 10-Q", category: "process", summary: "A company's quarterly report: unaudited financial statements for the quarter and the year to date, with management's discussion.", detail: `The fourth quarter has no 10-Q; it is inside the annual 10-K. A 10-Q's columns show the quarter and the year to date, each with last year's comparison. ${NA}` },
  { id: "form-4-transaction-code", name: "Form 4 transaction code", category: "process", summary: "A letter that says what kind of trade a Form 4 reports: P open-market purchase, S sale, A award, M option exercise, F tax withholding, G gift.", detail: `Only P is an insider spending their own money in the market. Awards, exercises and tax withholding are pay mechanics, and a data site's \"Sale\" or \"Buy\" label may merge several codes. ${NA}` },
  { id: "rule-10b5-1-plan", name: "Rule 10b5-1 trading plan", category: "process", summary: "A plan set in advance that trades shares on a schedule or formula, so later trades are not decisions made with fresh inside information.", detail: `Since April 1, 2023, Form 4 has a checkbox for trades under such a plan. Officers and directors wait the later of 90 days or two business days after the quarter's results (at most 120 days) before a new plan can trade. ${NA}` },
];

const T1 = seededTape({ seed: 11201, start: 64, preDrift: 0.001, postDrift: -0.001, vol: 0.012, gap: 0.03 });
const T2 = seededTape({ seed: 11202, start: 88, preDrift: 0.0, postDrift: 0.0005, vol: 0.01, gap: -0.012 });

const CASES: CaseStudy[] = [
  {
    id: "case-ed-ttm-mismatch",
    title: "EDGAR: the TTM that does not match",
    contextType: "news",
    thinkingMode: "tool_edgar",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. A post says a data site \"overstates\" a company's profit because its TTM net income is higher than the latest 10-Q's figure. You check: the post compared the site's twelve-month number with the 10-Q's nine-month column. Buy = buy on the confusion. Sell = sell on the \"overstatement\". Hold = no trade: rebuild TTM from the 10-K and 10-Q and note which period each number covers.",
    newsHeadline: "Post: data site \"overstates\" profit versus the 10-Q.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "A 10-Q shows the quarter and the year to date, never twelve months. TTM is last fiscal year minus last year's year-to-date plus this year's. When the rebuilt sum matches the site, the site is fine and the post compared different periods.",
      whyMarketMoved: "No new information came out; the post mixed up periods.",
      evidence: "SAMPLE: the stock moved with its sector over the next four sessions.",
    },
  },
  {
    id: "case-ed-award-not-buy",
    title: "EDGAR: \"insiders are buying\"",
    contextType: "news",
    thinkingMode: "tool_edgar",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. A screenshot of a data site's insider table shows six directors \"acquiring\" shares on the same day. You open the Form 4s on EDGAR: each row is code A, a quarterly stock award of about 120 shares under the directors' pay plan. Buy = follow the insiders. Sell = nothing to sell. Hold = no trade: awards are pay, not purchases with their own money.",
    newsHeadline: "Screenshot: directors pile into the stock.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "The transaction code is the fact. A (award), M (option exercise) and F (shares withheld for tax) are pay mechanics; P is an open-market purchase. Six small awards on a quarter-end date are a schedule, not a signal.",
      whyMarketMoved: "Nothing changed; the screenshot labeled awards as buying.",
      evidence: "SAMPLE: the stock drifted sideways for four sessions.",
    },
  },
];

const ED_SIMULATIONS: ToolSimulation[] = [
  {
    kind: "columns",
    id: "ed-sim-ttm",
    live: [edgarFilings(NEM_CIK, "10-Q", "NEM 10-Q filings"), stockAnalysisStock("NEM", "financials", "NEM income statement")],
    title: "Rebuild StockAnalysis's TTM from the 10-K and 10-Q",
    goal: `Data sites add up TTM for you. Rebuild Newmont's from its filings on EDGAR (millions of USD) and check it against StockAnalysis's TTM column. Real figures, read ${ED_READ_ON}; simulated layout.`,
    tape: `Newmont (NEM) revenue and net income, millions USD, from EDGAR, read ${ED_READ_ON} · simulated layout`,
    start: 1,
    columns: ["Line", "FY 2025 (10-K)", "9 months 2025", "9 months 2026 (10-Q)", "TTM rebuilt", "StockAnalysis TTM"],
    rows: [
      ["Revenue", n(ED_NEM.revenue.fy2025), n(ED_NEM.revenue.nine2025), n(ED_NEM.revenue.nine2026), n(ED_TTM.revenue), n(ED_NEM.saTtm.revenue)],
      ["Net income", n(ED_NEM.netIncome.fy2025), n(ED_NEM.netIncome.nine2025), n(ED_NEM.netIncome.nine2026), n(ED_TTM.netIncome), n(ED_NEM.saTtm.netIncome)],
    ],
    steps: [
      { col: 1, row: 0, what: `FY 2025 from the 10-K filed ${ED_NEM.tenKFiled}: revenue ${n(ED_NEM.revenue.fy2025)}.`, why: "The annual report is the base of the sum. It is also the only audited figure in it; 10-Q numbers are reviewed, not audited." },
      { col: 2, row: 0, what: `The 10-Q's comparison column: nine months to Sep 30, 2025, revenue ${n(ED_NEM.revenue.nine2025)}.`, why: "This is the part of last year that the newest nine months replace. Take it from the new 10-Q, which shows any restatement." },
      { col: 3, row: 0, what: `Nine months to Sep 30, 2026, from the 10-Q filed ${ED_NEM.tenQFiled}: revenue ${n(ED_NEM.revenue.nine2026)} (quarters ${ED_NEM.revenue.quarters2026.map(n).join(" + ")}).`, why: "A 10-Q's year-to-date column equals the quarters added up. Checking that once shows you are reading the right column." },
      { col: 4, row: 0, what: `TTM = ${n(ED_NEM.revenue.fy2025)} − ${n(ED_NEM.revenue.nine2025)} + ${n(ED_NEM.revenue.nine2026)} = ${n(ED_TTM.revenue)}.`, why: "That is exactly twelve months to Sep 30, 2026. You now know what period the site's TTM column and its ratios rest on." },
      { col: 5, row: 0, what: `StockAnalysis's TTM revenue: ${n(ED_NEM.saTtm.revenue)}. A match.`, why: "When your sum matches, the site did the same arithmetic on the same filings. When it does not, check which line it took before calling it an error." },
      { col: 5, row: 1, what: `Net income: ${n(ED_NEM.netIncome.fy2025)} − ${n(ED_NEM.netIncome.nine2025)} + ${n(ED_NEM.netIncome.nine2026)} = ${n(ED_TTM.netIncome)}, and StockAnalysis showed ${n(ED_NEM.saTtm.netIncome)}.`, why: "The same rule works for every income-statement line. Balance-sheet lines are different: they are a single date, so there is nothing to add up." },
    ],
    takeaway: "TTM = last fiscal year − last year's year-to-date + this year's year-to-date. Rebuild it once from the 10-K and 10-Q and a data site's number stops being a black box.",
  },
  {
    kind: "columns",
    id: "ed-sim-form4",
    live: [edgarDocument(ED_FORM4.path, "the Form 4 (rendered)"), edgarInsiders(JPM_CIK, "JPM insider transactions"), finvizQuote("JPM", "JPM insider table")],
    title: "Read a Form 4 against a data site's insider row",
    goal: `One real insider sale at JPMorgan, field by field: the Form 4 on EDGAR and the row Finviz built from it, both read ${ED_READ_ON}. What the row keeps, and what it leaves out.`,
    tape: `JPMorgan Chase Form 4 (accession 0001225208-26-007727) and Finviz's row, read ${ED_READ_ON} · simulated layout`,
    start: 1,
    columns: ["Field", "Form 4 on EDGAR", "Finviz insider row"],
    rows: [
      ["Who", `${ED_FORM4.person} · ${ED_FORM4.title}`, `${ED_FORM4.person} · ${ED_FORM4.title}`],
      ["Date and code", `${ED_FORM4.date} · ${ED_FORM4.code}`, `${ED_FORM4.finviz.date} · ${ED_FORM4.finviz.transaction}`],
      ["Shares and price", `${n(ED_FORM4.shares)} at $${ED_FORM4.price}`, `${n(ED_FORM4.shares)} at ${ED_FORM4.finviz.cost} · value ${n(ED_FORM4.finviz.value)}`],
      ["Owned after", `${n(ED_FORM4.ownedAfter)} direct`, n(ED_FORM4.finviz.total)],
      ["Other holdings", ED_FORM4.indirect, "Not shown"],
      ["Rule 10b5-1 plan", "Box checked", "Not shown"],
    ],
    steps: [
      { col: 1, row: 0, what: `The Form 4: ${ED_FORM4.person}, ${ED_FORM4.title}, an officer of the issuer.`, why: "Who reports matters: officers and directors file Form 4 within two business days of a trade. Their role tells you how close they are to the business." },
      { col: 1, row: 1, what: `Transaction date ${ED_FORM4.date}, code ${ED_FORM4.code}: an open-market or private sale.`, why: "The code is the fact. S is a sale; A, M, F and G are awards, exercises, tax withholding and gifts, which say little about a view on the stock." },
      { col: 2, row: 2, what: `Finviz: ${n(ED_FORM4.shares)} shares at ${ED_FORM4.finviz.cost}, value ${n(ED_FORM4.finviz.value)}, which is ${n(ED_FORM4.shares)} × $${ED_FORM4.price} rounded.`, why: "The row matches the filing on the core numbers. Checking one row like this tells you how far you can trust the table's arithmetic." },
      { col: 2, row: 3, what: `Owned after: ${n(ED_FORM4.ownedAfter)} directly on both.`, why: "Read the sale against the holding: 2,500 of about 73,500 is roughly 3%. Size relative to the holding says more than the dollar value alone." },
      { col: 1, row: 4, what: `The Form 4 also lists indirect holdings: ${ED_FORM4.indirect}. The row does not.`, why: "Indirect holdings (trusts, family) belong in the picture of what the insider owns. Only the filing shows them." },
      { col: 1, row: 5, what: "The Form 4's Rule 10b5-1 box is checked: the sale was under a plan set in advance. Finviz's row does not show the box.", why: "A planned sale was scheduled months earlier, before the trade date's news. That is the single most useful fact for reading an insider sale, and it lives in the filing." },
    ],
    takeaway: "Data-site rows copy the core numbers well. The code's meaning, indirect holdings and the 10b5-1 box live in the Form 4: open it before reading anything into a trade.",
  },
  {
    kind: "bars",
    id: "ed-sim-filing-time",
    title: "A filing after the close: read the acceptance time",
    goal: "Walk a SAMPLE company that files a current report (8-K) after the close, and see why the filing's own time stamp, not a headline's, tells you which session could react first.",
    tape: "SAMPLE company · daily bars · simulated",
    start: 2,
    bars: [
      simBar("Mon", [88, 88.9, 87.4, 88.4], "A quiet session: the SAMPLE stock closes at 88.40.", "Nothing is filed today. Your note lists the last 10-Q's filing date, so you know which figures the data sites are using."),
      simBar("Tue", [88.4, 89.2, 87.9, 88.8], "Another quiet day, close 88.80. At 4:20 PM ET the company files an 8-K.", "An 8-K reports a material event. EDGAR stamps each filing with an acceptance time; 4:20 PM ET is after the 4:00 PM close, so Tuesday's bar could not react to it.", { mark: "news", readout: "8-K accepted 4:20 PM ET" }),
      simBar("Wed", [86.9, 87.3, 85.8, 86.2], "Wednesday opens lower at 86.90 and closes at 86.20.", "This is the first regular session after the filing. A chart that seems to \"move before the news\" usually means the reader used a headline's time, not EDGAR's."),
      simBar("Thu", [86.2, 87.1, 85.9, 86.8], "Close 86.80. A news site runs its story on the 8-K this morning.", "Stories come after filings. Write the filing time in the note and link the filing itself; the story's time is when someone read it, not when the company said it."),
      simBar("Fri", [86.8, 87.6, 86.4, 87.2], "Close 87.20. Data sites now show the 8-K in their news tabs.", "Each layer adds delay. The primary source on EDGAR is first and complete; the layers after it are summaries that may leave out the exhibits."),
    ],
    takeaway: "Read the acceptance time on EDGAR: it tells you which session could react first. Headlines and data-site tabs come later.",
  },
];

export const EDGAR_LESSON: ToolLesson = {
  id: "tool-edgar",
  slug: "sec-edgar",
  route: "/tools/sec-edgar",
  menuLabel: "SEC EDGAR",
  icon: "description",
  title: "SEC EDGAR: read the filing the sites summarize",
  blurb: "Full-text search, a company's filing list, rebuilding a data site's TTM from the 10-K and 10-Q, and reading a Form 4 against the insider row a site shows.",
  credit: { name: "SEC EDGAR, U.S. Securities and Exchange Commission", url: "https://www.sec.gov/edgar/search/", note: "Free and public. The SEC asks automated tools to identify themselves; a browser needs nothing." },
  asOf: ED_READ_ON,
  quiz: { name: "Tool: SEC EDGAR", description: "Full-text search, filing lists and form types, TTM from the 10-K and 10-Q, Form 4 codes, the 10b5-1 box and filing times.", icon: "description" },
  intro: [
    ["Every data site in Tool Training summarizes the same thing: what companies file with the SEC. ", { text: "EDGAR", term: "sec-edgar" }, " is where those filings live, free, with the company's own words and every exhibit."],
    ["This lesson covers three reads: find a phrase across years of filings, ", { text: "rebuild a site's TTM from the 10-K and 10-Q", sim: "ed-sim-ttm" }, ", and ", { text: "check a Form 4 against an insider row", sim: "ed-sim-form4" }, ". Filing times matter too: ", { text: "an 8-K after the close", sim: "ed-sim-filing-time" }, " reaches the next session first."],
    ["Words to know: ", { text: "10-Q", term: "form-10-q" }, ", ", { text: "transaction code", term: "form-4-transaction-code" }, " and ", { text: "Rule 10b5-1 plan", term: "rule-10b5-1-plan" }, "."],
  ],
  screens: [
    {
      id: "ed-full-text",
      live: [edgarFullText(`"${ED_FTS.query}"`, "full-text search, Newmont 10-Qs", { cik: NEM_CIK, forms: ["10-Q"] })],
      title: "Full-text search: a phrase across years of filings",
      where: "EDGAR full-text search · results",
      alt: `Simulated EDGAR full-text search. The phrase all-in sustaining costs in quotes, company Newmont, form type 10-Q. ${ED_FTS.hits} results, with the first rows from 2021 and 2022 filings because results sort by relevance. Columns: Form and File, Filed, Filing entity, Reporting for.`,
      caption: `A real search, run ${ED_READ_ON}: ${ED_FTS.hits} hits. Rows are illustrative of the layout; dates are from the first results.`,
      blocks: [
        { kind: "filters", title: "Search", filters: [{ label: "Document word or phrase", value: `"${ED_FTS.query}"` }, { label: "Company or person", value: "NEWMONT Corp /DE/ (CIK 0001164727)" }, { label: "Filing types", value: "10-Q" }, { label: "Filed", value: "All dates (2001 onward)" }] },
        { kind: "table", title: `${ED_FTS.hits} results · sorted by relevance`, columns: ["Form & File", "Filed", "Filing entity/person", "Reporting for"], rows: [["10-Q", "2022-07-25", "NEWMONT Corp /DE/", "2022-06-30"], ["10-Q", "2021-07-22", "NEWMONT Corp /DE/", "2021-06-30"], ["10-Q", "2021-10-28", "NEWMONT Corp /DE/", "2021-09-30"]] },
        { kind: "note", text: "Quotes find the exact phrase. Without them, every word must appear somewhere in the filing, in any order. A trailing * matches word endings." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Narrow by company (CIK) and form first. A phrase alone across all of EDGAR returns thousands of filings." },
        { n: 2, block: 1, text: "The newest filing is not on top: results lead with relevance. Sort by Filed or narrow the dates before reading." },
        { n: 3, block: 2, text: ["Full-text search covers exhibits too, which is where contracts and ", { text: "trading-plan details", term: "rule-10b5-1-plan" }, " often sit."] },
      ],
    },
    {
      id: "ed-filing-list",
      live: [edgarFilings(JPM_CIK, "10-Q", "JPM 10-Q filings"), edgarFilings(NEM_CIK, "10-Q", "NEM 10-Q filings")],
      title: "A company's filing list, filtered by form",
      where: "EDGAR company search · filings list",
      alt: "Simulated EDGAR filing list for JPMorgan Chase filtered to 10-Q: four rows filed November 3, 2026, August 6, 2026, May 1, 2026 and November 4, 2025, each with a Documents button and an accession number. A note warns that filtering by type 4 also lists 424B2 prospectuses.",
      caption: `JPMorgan's real 10-Q filing dates on EDGAR, read ${ED_READ_ON}. Layout simulated.`,
      blocks: [
        { kind: "stats", title: "JPMORGAN CHASE & CO · CIK 0000019617", rows: [{ label: "SIC", value: "6021 National commercial banks" }, { label: "Fiscal year end", value: "Dec 31" }, { label: "Filter", value: "Type 10-Q" }] },
        { kind: "table", title: "Filings", columns: ["Filings", "Format", "Filing Date"], rows: ED_JPM_10Q.map((d) => ["10-Q", "Documents · Interactive Data", d]) },
        { kind: "note", text: "The type box is a prefix match. On Nov 13, 2026, type 4 for JPMorgan listed 424B2 and 424B3 prospectuses, not Form 4s. Use the insider transactions page for Forms 3, 4 and 5." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Every company has a CIK. Search by name once, then use the CIK: names change, and JPMorgan's page lists several former names." },
        { n: 2, block: 1, text: ["Four 10-Qs a year? No: three. The fourth quarter is inside the 10-K, which is why ", { text: "TTM needs both forms", sim: "ed-sim-ttm" }, "."] },
        { n: 3, block: 2, text: ["A big bank files many prospectuses a day. For insider forms, ", { text: "go to the insider page", sim: "ed-sim-form4" }, " instead of the type filter."] },
      ],
    },
    {
      id: "ed-form4",
      live: [edgarDocument(ED_FORM4.path, "the Form 4 (rendered)"), edgarInsiders(JPM_CIK, "JPM insider transactions")],
      title: "One Form 4, top to bottom",
      where: "EDGAR · Form 4 (rendered)",
      alt: "Simulated Form 4 for JPMorgan Chase. Reporting person Leopold Robin, Head of Human Resources. Rule 10b5-1 box checked. Table I row: common stock, September 10, 2026, code S, 2,500 shares, disposed, price 352.8106 dollars, 71,047 owned directly after. Two more rows: 9,201 shares held indirectly by a GRAT and 9,201 by a spouse's GRAT.",
      caption: `A real Form 4 (accession 0001225208-26-007727), read ${ED_READ_ON}. Layout simulated.`,
      blocks: [
        { kind: "stats", title: "Boxes 1–5", rows: [{ label: "Reporting person", value: `${ED_FORM4.person}` }, { label: "Relationship", value: `Officer · ${ED_FORM4.title}` }, { label: "Date of earliest transaction", value: ED_FORM4.date }, { label: "Rule 10b5-1(c) box", value: "Checked" }] },
        { kind: "table", title: "Table I · Non-derivative securities", columns: ["Security", "Date", "Code", "Amount", "(A) or (D)", "Price", "Owned after", "Direct or indirect"], rows: [["Common Stock", ED_FORM4.date, "S", n(ED_FORM4.shares), "D", `$${ED_FORM4.price}`, n(ED_FORM4.ownedAfter), "D"], ["Common Stock", "", "", "", "", "", "9,201", "I · By GRAT"], ["Common Stock", "", "", "", "", "", "9,201", "I · By spouse's GRAT"]] },
        { kind: "note", text: "Codes: P purchase · S sale · A award · M option exercise · F tax withholding · G gift. Only P is an insider buying in the market with their own money." },
      ],
      callouts: [
        { n: 1, block: 0, text: ["The ", { text: "10b5-1 box", term: "rule-10b5-1-plan" }, " says the trade ran on a plan set in advance."] },
        { n: 2, block: 1, text: ["Code, amount and owned-after are the core. ", { text: "Compare them with the data site's row", sim: "ed-sim-form4" }, "."] },
        { n: 3, block: 2, text: ["Read the ", { text: "code", term: "form-4-transaction-code" }, " before the dollar value: awards and tax withholding are not views on the stock."] },
      ],
    },
  ],
  walkthroughs: [
    {
      title: "From a data site's number to the filing",
      steps: [
        "Find the company's CIK on EDGAR's company search, then open its filing list.",
        "Filter to 10-Q (or 10-K). Note the filing date and the period each covers.",
        ["Open the latest 10-Q; read the quarter and year-to-date columns, then ", { text: "rebuild TTM", sim: "ed-sim-ttm" }, " with the 10-K."],
        "Use full-text search with the phrase in quotes, the CIK and the form, and sort by filing date.",
        ["For insider trades, open the insider transactions page and then each Form 4: ", { text: "code, size against holdings, and the 10b5-1 box", sim: "ed-sim-form4" }, "."],
        ["Record each filing's date and ", { text: "acceptance time", sim: "ed-sim-filing-time" }, " in your note, with its link."],
      ],
    },
  ],
  simulations: ED_SIMULATIONS,
  tasks: [
    { id: "ed-t1", find: "The filing date of Newmont's latest 10-Q", live: edgarFilings(NEM_CIK, "10-Q", "NEM 10-Q filings"), where: "EDGAR filing list: Filing Date column, top row", answer: { format: "date", example: ED_NEM.tenQFiled, minYear: 2026, maxYear: 2028 }, why: "The 10-Q date tells you how fresh a data site's TTM is. Sites update within hours to days of it." },
    { id: "ed-t2", find: "How many results the phrase search returns for Newmont's 10-Qs", live: edgarFullText(`"${ED_FTS.query}"`, "full-text search, Newmont 10-Qs", { cik: NEM_CIK, forms: ["10-Q"] }), where: "Full-text search results: the count above the table", answer: { format: "number", min: 5, max: 200, example: `${ED_FTS.hits}` }, why: "The count says how often the company uses the phrase. Then sort by filing date: relevance order puts older filings first." },
    { id: "ed-t3", find: "The transaction code on the newest row of JPMorgan's insider transactions", live: edgarInsiders(JPM_CIK, "JPM insider transactions"), where: "Insider transactions table: Transaction Type column, top row (e.g. S-Sale, A-Award, G-Gift)", answer: { format: "text", example: "G-Gift", oneOf: ["P-", "S-", "A-", "M-", "F-", "G-", "D-", "C-", "J-", "purchase", "sale", "award", "exercise", "gift", "tax", "disposition", "conversion"] }, why: "The code decides what the row means. Most insider rows at large companies are awards, exercises, tax withholding or gifts." },
    { id: "ed-t4", find: "Shares owned after the trade on the Form 4 in this lesson", live: edgarDocument(ED_FORM4.path, "the Form 4 (rendered)"), where: "Table I: Amount of Securities Beneficially Owned Following Reported Transaction(s), first row", answer: { format: "number", min: 1000, max: 1e7, example: n(ED_FORM4.ownedAfter) }, why: "Size against holdings: a sale of 2,500 from about 73,500 is roughly 3% of the direct holding." },
  ],
  drills: [
    { id: "ed-d1", prompt: "To find every Newmont 10-Q that mentions \"all-in sustaining costs\" as a phrase, you…", options: ["Type the words without quotes across all of EDGAR", "Put the phrase in quotes, set the company and form 10-Q", "Use the filing list's type box", "Search a news site"], answer: 1, why: "Quotes match the exact phrase; company and form cut the noise." },
    { id: "ed-d2", prompt: "Why do a company's filings include three 10-Qs a year, not four?", options: ["The SEC skips a quarter", "The fourth quarter is reported in the annual 10-K", "Q4 is filed as an 8-K", "Companies choose"], answer: 1, why: "So TTM needs the 10-K and the latest 10-Q." },
    { id: "ed-d3", prompt: `Newmont: FY 2025 revenue ${n(ED_NEM.revenue.fy2025)}, nine months 2025 ${n(ED_NEM.revenue.nine2025)}, nine months 2026 ${n(ED_NEM.revenue.nine2026)}. TTM is…`, options: [n(ED_NEM.revenue.nine2026), n(ED_TTM.revenue), n(ED_NEM.revenue.fy2025 + ED_NEM.revenue.nine2026), n(Math.round(ED_NEM.revenue.nine2026 / 3 * 4))], answer: 1, why: "Last year − last year's nine months + this year's nine months." },
    { id: "ed-d4", prompt: "On a Form 4, which code is an open-market purchase?", options: ["A", "M", "P", "F"], answer: 2, why: "A is an award, M an option exercise, F shares withheld for tax." },
    { id: "ed-d5", prompt: "Filtering JPMorgan's filing list by type 4 shows 424B2 forms because…", options: ["The SEC mislabeled them", "The type box matches the start of the form name", "JPMorgan files Form 4 as 424B2", "Insiders use prospectuses"], answer: 1, why: "It is a prefix match. Use the insider transactions page for Forms 3, 4 and 5." },
  ],
  scenarios: [
    { id: "ed-s1", prompt: "On EDGAR you filter a company's filings by type 4 and the list fills with 424B2 prospectuses. What happened?", options: ["The company has no insiders", "The type box is a prefix match; use the insider transactions page for Form 4s", "EDGAR is down", "424B2 is a kind of Form 4"], answer: 1, why: "The filter matches types that start with what you type. The issuer's insider page lists Form 4s cleanly." },
    { id: "ed-s2", prompt: "A data site's TTM revenue and your sum from EDGAR differ by about one quarter's revenue. Most likely…", options: ["The site is lying", "One of you used a different set of four quarters; check the quarter end dates and the latest 10-Q filing date", "EDGAR is wrong", "Revenue cannot be summed"], answer: 1, why: "TTM depends on which quarters are included. A new 10-Q shifts the window, so match the period ends." },
    { id: "ed-s3", prompt: "Full-text search finds your phrase in 42 filings, including other companies' exhibits. To keep only the company you care about you…", options: ["Read all 42", "Add the company name or CIK filter and a form type", "Give up on full-text search", "Search a news site instead"], answer: 1, why: "Full-text search covers all filers. The entity and form filters narrow it to the documents you need." },
  ],
  caveats: [
    { title: "Filings are the source, not the answer", text: "A filing tells you what the company reported. It does not tell you what the stock will do. Read it to settle facts and definitions, then keep your own rule." },
    { title: "Relevance is not recency", text: "Full-text search results can lead with older filings. Sort by filing date or set a date range before you treat the top result as the latest." },
    { title: "Data sites simplify insider rows", text: "Sites merge codes into labels like Sale or Buy and leave out indirect holdings and the 10b5-1 box. Open the Form 4 for anything you would act on." },
  ],
  sources: [
    { label: "SEC: EDGAR full-text search FAQ", url: "https://www.sec.gov/edgar/search/efts-faq.html", supports: "Filings since 2001 including attachments; exact phrases in quotes; implied AND; trailing * wildcard" },
    { label: "SEC EDGAR: Newmont 10-Q filings", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001164727&type=10-Q&dateb=&owner=include&count=40", supports: "10-Q filed Oct 22, 2026 (read Nov 13, 2026)" },
    { label: "SEC EDGAR: XBRL company facts, Newmont revenue", url: "https://data.sec.gov/api/xbrl/companyconcept/CIK0001164727/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json", supports: "FY 2025 22,669M; nine months 2025 15,851M and 2026 19,788M" },
    { label: "SEC EDGAR: JPMorgan Chase Form 4, Sep 10, 2026", url: "https://www.sec.gov/Archives/edgar/data/19617/000122520826007727/xslF345X05/doc4.xml", supports: "Code S, 2,500 shares at $352.8106, 71,047 owned after, 10b5-1 box checked, two GRAT holdings" },
    { label: "SEC: Ownership form transaction codes", url: "https://www.sec.gov/edgar/searchedgar/ownershipformcodes.html", supports: "P, S, A, D, F, M, C, G and other codes" },
    { label: "SEC: Forms 3, 4 and 5 (Section 16)", url: "https://www.sec.gov/files/forms-3-4-5.pdf", supports: "Form 4 due within two business days of the transaction" },
    { label: "SEC fact sheet: Insider trading arrangements (Rule 10b5-1 amendments)", url: "https://www.sec.gov/files/33-11138-fact-sheet.pdf", supports: "Cooling-off for officers and directors: later of 90 days or two business days after the quarter's results, not over 120 days; Form 4 checkbox" },
    { label: "Finviz: JPMorgan Chase quote page (insider table)", url: "https://finviz.com/quote.ashx?t=JPM", supports: "Sale and Proposed Sale rows for the same Sep 10, 2026 trade (read Nov 13, 2026)" },
  ],
  links: [
    { label: "Learn → Tool: SEC EDGAR", to: "/training?group=tool-edgar" },
    { label: "Coach → Check it on EDGAR", to: "/coach/sec-edgar-tour" },
    { label: "Tool Training → Capstone 2 (a bank)", to: "/tools/capstone-bank" },
    { label: "Tool Training → Finviz", to: "/tools/finviz" },
    { label: "Tool Training → Earnings dates and insiders", to: "/tools/earnings-insiders" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "tool_edgar",
  modeLabel: "SEC EDGAR: settle it in the filing",
  modeTip: "Before acting on a site's number or insider row, open the filing: rebuild TTM from the 10-K and 10-Q, read the Form 4's code, size and 10b5-1 box, and note filing times. Cases → Market-wide news.",
  questions: [
    mc("ED-01", "EDGAR is…", "A", "The SEC's free public database of company filings", ["A paid data terminal", "A stock screener", "A broker"], "Every data site summarizes what is filed there.", "sec-edgar"),
    mc("ED-02", "EDGAR full-text search covers filings since…", "C", "2001, including exhibits", ["1934", "Last year only", "2020, text only"], "SEC FAQ, read Nov 13, 2026.", "edgar-full-text-search"),
    mc("ED-03", "To match an exact phrase in full-text search, you…", "B", "Put it in quotation marks", ["Add AND between words", "Use a leading *", "Type it in capitals"], "Without quotes, each word must appear anywhere in the filing.", "edgar-full-text-search"),
    mc("ED-04", `A phrase search of Newmont's 10-Qs returned ${ED_FTS.hits} hits led by ${ED_FTS.firstHitsYears} filings. That is because…`, "D", "Results lead with relevance, not the newest date", ["Newmont stopped filing", "The search is broken", "Older filings are more accurate"], "Sort by filing date or set a range.", "edgar-full-text-search"),
    mc("ED-05", "A Form 10-Q is…", "A", "A quarterly report with unaudited statements for the quarter and the year to date", ["An annual audited report", "An insider trade report", "A press release"], "The fourth quarter is in the 10-K.", "form-10-q"),
    mc("ED-06", "TTM revenue from the filings equals…", "B", "Last fiscal year − last year's year-to-date + this year's year-to-date", ["Latest quarter × 4", "The 10-K figure", "The sum of three 10-Qs"], "That covers exactly twelve months.", "trailing-twelve-months"),
    mc("ED-07", `Newmont's rebuilt TTM revenue was ${n(ED_TTM.revenue)} million. StockAnalysis's TTM column showed…`, "C", `${n(ED_NEM.saTtm.revenue)}, a match`, [n(ED_NEM.revenue.nine2026), n(ED_NEM.revenue.fy2025), "No figure"], "The site did the same arithmetic on the same filings.", "trailing-twelve-months"),
    mc("ED-08", "Filtering a company's filing list by type 4 lists 424B2 prospectuses because…", "D", "The type box matches the start of the form name", ["Prospectuses are insider forms", "EDGAR is wrong", "Form 4 was renamed"], "Use the insider transactions page instead.", "sec-edgar"),
    mc("ED-09", "On a Form 4, code P means…", "A", "An open-market or private purchase", ["A stock award", "An option exercise", "A gift"], "SEC ownership form codes.", "form-4-transaction-code"),
    mc("ED-10", "Six directors each show about 120 shares \"acquired\" on a quarter-end date, code A. That is most likely…", "B", "Scheduled stock awards under a pay plan", ["Coordinated open-market buying", "A tender offer", "Short covering"], "Awards are pay, not purchases with their own money.", "form-4-transaction-code"),
    mc("ED-11", "The Form 4's Rule 10b5-1 box, when checked, means…", "C", "The trade was made under a plan adopted in advance", ["The trade was illegal", "The insider bought shares", "The SEC approved the trade"], "Required on Forms 4 and 5 filed on or after April 1, 2023.", "rule-10b5-1-plan"),
    mc("ED-12", "Under the 2022 amendments, an officer's new 10b5-1 plan can start trading after…", "D", "The later of 90 days or two business days after the quarter's results, at most 120 days", ["One day", "One year", "Whenever they choose"], "SEC fact sheet, Release 33-11138.", "rule-10b5-1-plan"),
    mc("ED-13", "Compared with the Form 4, Finviz's insider row for the Sep 10, 2026 JPMorgan sale left out…", "A", "The indirect GRAT holdings and the 10b5-1 box", ["The share count", "The price", "The insider's name"], "Core numbers matched; context lives in the filing.", "form-4-insider-sale"),
    mc("ED-14", "An 8-K accepted at 4:20 PM ET could first affect…", "B", "The next regular session", ["That day's regular session", "The prior day's close", "Nothing; filings never matter"], "Regular trading closes at 4:00 PM ET.", "primary-source-filing"),
  ],
  terms: TERMS,
  cases: CASES,
};

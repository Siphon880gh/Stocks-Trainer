/**
 * TT13 · Earnings dates and insider trackers (/tools/earnings-insiders): the company's own investor-relations date
 * versus a data site's calendar, before-open and after-close timing, date changes; insider-tracker tables, clusters,
 * trading windows after a report, and Rule 10b5-1 plans. Pages read on Nov 13, 2026. OpenInsider is credited as an
 * insider tracker; it is http-only and returned server errors when checked, so its layout is a SAMPLE and its live
 * counterpart here is Finviz's insider page. Credited, not endorsed. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import { mc, seededTape } from "../marketThemes/helpers";
import type { ToolLesson, ToolSimulation } from "./types";
import { edgarInsiders, finvizInsiderTrading, finvizQuote, jpmorganIr, stockAnalysisEarningsCalendar, stockAnalysisStock, yahooEarningsCalendar } from "./liveLinks";
import { simBar } from "./simWalk";
import { JPM_CIK } from "./capstoneBank";

export const EI_READ_ON = "2026-11-13";

/** JPMorgan's next report, from its own release (May 21, 2025) and three data sites, read Nov 13, 2026. */
export const EI_JPM = {
  ir: { date: "Thu Jan 14, 2027", release: "about 6:45 AM ET", call: "8:30 AM ET", announced: "May 21, 2025" },
  yahoo: { date: "January 14, 2027 at 8 AM EST", eps: 5.86, last: { date: "October 13, 2026", est: 5.94, reported: 5.75, surprise: "-3.24%" } },
  stockAnalysis: { field: "Earnings Date", value: "Oct 13, 2026" },
  finviz: { field: "Earnings", value: "Oct 13 BMO" },
  /** Q4 2027 call: first announced Mar 4, 2026, moved in an update on Oct 27, 2026. */
  moved: { from: "Friday, January 14, 2028", to: "Thursday, January 13, 2028", firstOn: "Mar 4, 2026", updatedOn: "Oct 27, 2026" },
} as const;

/** Finviz's JPM insider table (Form 144 "Proposed Sale" rows), read Nov 13, 2026; JPM reported on Apr 14, 2026. */
export const EI_WINDOW = [
  { date: "Apr 15 '26", who: "Chief Operating Officer", shares: 9136 },
  { date: "Apr 15 '26", who: "CEO, Asset & Wealth Management", shares: 12345 },
  { date: "Apr 15 '26", who: "CEO, Consumer and Community Banking", shares: 6427 },
  { date: "Apr 15 '26", who: "Co-CEO, Commercial and Investment Bank", shares: 5660 },
  { date: "Apr 15 '26", who: "Chief Financial Officer", shares: 5611 },
  { date: "Apr 15 '26", who: "Chief Information Officer", shares: 3166 },
] as const;

/** Two Form 4 sales by one officer, both with the Rule 10b5-1 box checked (EDGAR, read Nov 13, 2026). */
export const EI_PLAN = [
  { date: "Aug 11, 2026", shares: 2500, price: 361.41, after: 73547 },
  { date: "Sep 10, 2026", shares: 2500, price: 352.81, after: 71047 },
] as const;

const n = (v: number) => v.toLocaleString("en-US");
const NA = "Educational, not advice.";

const TERMS: LiteracyTerm[] = [
  { id: "confirmed-earnings-date", name: "Confirmed vs estimated earnings date", category: "process", summary: "A confirmed date is one the company has announced; an estimated date is a data site's guess from past patterns.", detail: `The company's investor-relations page or press release is the source. JPMorgan announced its Jan 14, 2027 date on ${EI_JPM.ir.announced}; on ${EI_READ_ON} two data sites still showed the last report (Oct 13, 2026) in their earnings field. ${NA}` },
  { id: "bmo-amc", name: "Before open (BMO) and after close (AMC)", category: "markets", summary: "When a report comes out: before the 9:30 AM ET open, or after the 4:00 PM ET close.", detail: `It decides which session reacts first. A calendar's time may be the release, the call or a placeholder: Yahoo showed JPM's Jan 14, 2027 report \"at 8 AM EST\" while JPM said results at ${EI_JPM.ir.release} and the call at ${EI_JPM.ir.call}. ${NA}` },
  { id: "insider-trading-window", name: "Insider trading window", category: "process", summary: "The period, usually opening a day or two after a report, when a company's policy lets insiders trade.", detail: `Windows close before the next report. Several insiders filing on the same day right after a report is often the window opening, not a shared view: JPMorgan's insider table showed six officers' proposed sales on Apr 15, 2026, the day after its Apr 14 report. ${NA}` },
  { id: "insider-cluster", name: "Insider cluster", category: "ownership", summary: "Several insiders at one company trading the same way within a few days. Insider trackers such as OpenInsider list cluster buys.", detail: `A cluster of open-market purchases (code P) with their own money is rarer than a cluster of sales, which can come from pay schedules and windows. Read each Form 4's code and the size against holdings. ${NA}` },
  { id: "insider-tracker", name: "Insider tracker", category: "process", summary: "A site that collects Form 4 filings into searchable tables: OpenInsider, Finviz's insider page, and EDGAR's own insider transactions page.", detail: `Trackers label and filter rows; the Form 4 is the source. Labels like \"Sale+OE\" or \"Buy\" can merge codes, and most leave out the 10b5-1 box and indirect holdings. ${NA}` },
];

const T1 = seededTape({ seed: 11301, start: 42, preDrift: 0.001, postDrift: 0.0, vol: 0.014, gap: 0.05 });
const T2 = seededTape({ seed: 11302, start: 23, preDrift: -0.002, postDrift: 0.001, vol: 0.02, gap: 0.02 });

const CASES: CaseStudy[] = [
  {
    id: "case-ei-estimated-date",
    title: "Earnings dates: the estimate moves",
    contextType: "news",
    thinkingMode: "tool_earnings_insiders",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. Your rule bars new positions within three trading days of a report. A data site lists the company's report in nine days, so you plan to buy today. The company's own events page says the date is not yet announced, and last year it reported a week earlier than the site's estimate. Buy = the site says nine days. Sell = nothing to sell. Hold = wait: treat the site's date as an estimate until the company confirms it.",
    newsHeadline: "Company has not yet announced its report date.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "An estimated date is a guess from past patterns. The company's investor-relations page or its press release is the source; until it confirms, the rule's window could already be open.",
      whyMarketMoved: "SAMPLE: the company announced a date six days out, and the report moved the stock.",
      evidence: "SAMPLE: the report came out inside the window the estimate missed.",
    },
  },
  {
    id: "case-ei-cluster-sales",
    title: "Insiders: six sales in one day",
    contextType: "news",
    thinkingMode: "tool_earnings_insiders",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. The day after a company's report, an insider tracker shows six officers filing proposed sales. A post calls it \"a cluster sell signal\". You hold a planned position. Buy = buy the panic. Sell = exit before they do. Hold = keep the plan: check the dates against the report, the sizes against holdings, and the 10b5-1 boxes on the Form 4s.",
    newsHeadline: "Post: executives rush to sell after the quarter.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "Sales bunched the day after a report usually mean the trading window opened. Pay arrives in stock, and selling some is routine. A cluster of open-market buys is the rarer pattern; even that is a question for the filings, not a trade.",
      whyMarketMoved: "No new company information came out with the filings.",
      evidence: "SAMPLE: the stock moved with the market over the next four sessions.",
    },
  },
];

const EI_SIMULATIONS: ToolSimulation[] = [
  {
    kind: "bars",
    id: "ei-sim-estimated-date",
    title: "An estimated date, then the company's own",
    goal: "Walk a SAMPLE company whose data-site earnings date is an estimate. The company confirms a different day, and the rule's no-trade window moves with it.",
    tape: "SAMPLE company · daily bars · simulated",
    start: 2,
    bars: [
      simBar("D-12", [42, 42.6, 41.6, 42.3], "Twelve days out by the data site's calendar. Close 42.30.", "The site shows a date but no time. On many sites that means an estimate built from last year's pattern. Your note marks it \"estimated\"."),
      simBar("D-10", [42.3, 42.8, 41.9, 42.5], "The company's events page still says \"to be announced\". Close 42.50.", "The company is the source. Until it posts a date, any calendar's date is a guess, and a rule tied to the report date cannot rely on it."),
      simBar("Confirm", [42.5, 43.1, 42.2, 42.9], "The company announces its report in four trading days, before the open. Close 42.90.", "The confirmed date is six days earlier than the estimate. The three-day window in the rule (an example form, not advice) now starts the day after tomorrow.", { mark: "news", readout: "Confirmed: before open" }),
      simBar("D-2", [42.9, 43.4, 42.6, 43.0], "Two days before the confirmed report. Close 43.00.", "The rule bars a new position now. Anyone who planned from the estimate thought they had a week left."),
      simBar("Report", [45.1, 45.8, 44.2, 44.6], "Report day, before the open: the stock gaps to 45.10 and closes at 44.60.", "Before the open means the gap shows up at 9:30 AM. An after-close report would have hit the next session instead. Read BMO or AMC with the date.", { mark: "earnings" }),
      simBar("D+1", [44.6, 45, 43.9, 44.2], "The day after, close 44.20. Calendars now show the next estimate.", "The cycle starts again: the next date is an estimate until the company confirms it. Write both in the note, labeled."),
    ],
    takeaway: "Treat a calendar's date as an estimate until the company confirms it, read before-open or after-close with it, and let the confirmed date set your rule's window.",
  },
  {
    kind: "columns",
    id: "ei-sim-window",
    live: [finvizQuote("JPM", "JPM insider table"), edgarInsiders(JPM_CIK, "JPM insider transactions")],
    title: "A report, then the window opens",
    goal: `JPMorgan reported on Apr 14, 2026. Walk its insider table the day after, then one officer's planned sales months later (Finviz and EDGAR, read ${EI_READ_ON}), and sort routine from rare.`,
    tape: `JPMorgan Chase insider rows (Finviz and EDGAR), roles only, read ${EI_READ_ON} · simulated layout`,
    start: 1,
    columns: ["When", "Apr 15, 2026 (day after report)", "Aug 11, 2026", "Sep 10, 2026"],
    rows: [
      ["Rows", `${EI_WINDOW.length} officers' proposed sales (Form 144)`, "One officer's sale (Form 4)", "Same officer's sale (Form 4)"],
      ["Shares", EI_WINDOW.map((r) => n(r.shares)).join(" · "), n(EI_PLAN[0].shares), n(EI_PLAN[1].shares)],
      ["Owned after", "See each Form 4", n(EI_PLAN[0].after), n(EI_PLAN[1].after)],
      ["Rule 10b5-1 box", "Check each Form 4", "Checked", "Checked"],
    ],
    steps: [
      { col: 1, row: 0, what: `Apr 15, 2026, the day after JPMorgan's Apr 14 report: ${EI_WINDOW.length} officers file proposed sales.`, why: "Company policies usually open the trading window a day or two after a report. Many filings on one day right after a report are the window opening, not a shared signal." },
      { col: 1, row: 1, what: `Sizes: ${EI_WINDOW.map((r) => n(r.shares)).join(", ")} shares.`, why: "Each is a small slice of what senior bank officers hold in stock pay. Size against holdings is in each Form 4; the tracker row alone shows only the trade." },
      { col: 2, row: 0, what: `Aug 11, 2026: one officer sells ${n(EI_PLAN[0].shares)} shares at ${EI_PLAN[0].price}.`, why: "A single sale away from the report date. Before reading into it, open the Form 4 and look for the plan box." },
      { col: 2, row: 3, what: "The Form 4's Rule 10b5-1 box is checked.", why: "The sale ran on a plan adopted months earlier. Under the 2022 rule, an officer's plan cannot trade until a cooling-off period has passed, so the timing was set before this news." },
      { col: 3, row: 1, what: `Sep 10, 2026: the same officer sells ${n(EI_PLAN[1].shares)} again at ${EI_PLAN[1].price}, box checked, ${n(EI_PLAN[1].after)} owned after.`, why: "Same size, about a month apart: a schedule. Repeating plan sales are the most routine rows in any tracker." },
      { col: 3, row: 2, what: `Owned after fell from ${n(EI_PLAN[0].after)} to ${n(EI_PLAN[1].after)}.`, why: "Each sale is about 3% of the direct holding. A tracker's Value column in dollars can make that look larger than it is." },
    ],
    takeaway: "Sales bunched right after a report are usually a window opening; repeating same-size sales with the 10b5-1 box are a plan. Neither is a signal on its own.",
  },
  {
    kind: "columns",
    id: "ei-sim-cluster",
    live: [finvizInsiderTrading("buys", "latest insider purchases")],
    title: "A cluster buy in a tracker table, row by row",
    goal: "Read a SAMPLE insider-tracker table the way OpenInsider and Finviz lay it out, and check whether a \"cluster buy\" is open-market buying with the insiders' own money.",
    tape: "SAMPLE company (SMPL) · tracker rows · simulated",
    start: 1,
    columns: ["Field", "Row 1", "Row 2", "Row 3", "Row 4"],
    rows: [
      ["Insider · title", "A. Lee · CEO", "B. Ortiz · CFO", "C. Park · Director", "D. Shah · Director"],
      ["Trade date", "Nov 9", "Nov 10", "Nov 10", "Sep 30"],
      ["Trade type", "P - Purchase", "P - Purchase", "P - Purchase", "A - Award"],
      ["Qty · price", "20,000 · $9.10", "8,000 · $9.05", "5,000 · $9.20", "1,200 · $0.00"],
      ["Owned after · ΔOwn", "180,000 · +12%", "48,000 · +20%", "15,000 · +50%", "16,200 · +8%"],
    ],
    steps: [
      { col: 1, row: 2, what: "Row 1: the CEO, code P, an open-market purchase.", why: "P is the one code where an insider spends their own money at the market price. It is the row type insider trackers highlight." },
      { col: 2, row: 1, what: "Row 2: the CFO buys a day later.", why: "Two senior officers buying within days is what trackers call a cluster. Read the dates against the company's last report: buys right after it are the window opening." },
      { col: 3, row: 4, what: "Row 3: a director's buy raises their holding by half.", why: "ΔOwn shows size against holdings. A 50% increase means more to that person than a large dollar value that adds 1%." },
      { col: 4, row: 2, what: "Row 4: code A, an award on a quarter-end date.", why: "Awards are pay, not purchases. Some tables mix them in; count only P rows when you read a cluster." },
      { col: 4, row: 3, what: "Price $0.00 on the award.", why: "A zero or blank price is a clue that the row is not a market trade. Open the Form 4 to confirm the code." },
      { col: 1, row: 4, what: "Back to row 1: the CEO's holding rose 12%.", why: "Write each P row's size, date and holding change in the note. A cluster is a question to research in the filings and the business, not a trade. Insiders can be wrong." },
    ],
    takeaway: "In a tracker, count only code P rows, read ΔOwn for size, check the dates against the last report, and open the Form 4s. A cluster is a research lead, not a signal.",
  },
];

export const EARNINGS_INSIDERS_LESSON: ToolLesson = {
  id: "tool-earnings-insiders",
  slug: "earnings-insiders",
  route: "/tools/earnings-insiders",
  menuLabel: "Earnings dates and insiders",
  icon: "event",
  title: "Earnings dates and insider trackers: check the source",
  blurb: "The company's own report date versus a data site's calendar, before-open and after-close timing, and insider-tracker tables: clusters, trading windows and Rule 10b5-1 plans.",
  credit: { name: "Company investor-relations pages; calendars and insider tables on Yahoo Finance, StockAnalysis, Finviz and OpenInsider; SEC EDGAR", url: "https://www.jpmorganchase.com/ir", note: "Each is credited for what it shows, not endorsed. OpenInsider is http-only and returned server errors when checked on Nov 13, 2026, so its layout appears as a SAMPLE." },
  asOf: EI_READ_ON,
  quiz: { name: "Tool: Earnings dates and insiders", description: "Confirmed vs estimated dates, before open vs after close, date changes, insider-tracker rows, clusters, trading windows and 10b5-1 plans.", icon: "event" },
  intro: [
    ["Two dates drive a lot of short-term moves: when a company reports, and when its insiders trade. Data sites show both, but the source of a ", { text: "report date", term: "confirmed-earnings-date" }, " is the company, and the source of an insider trade is the Form 4."],
    ["This lesson compares JPMorgan's own date with three calendars, then walks ", { text: "an estimated date the company later confirms", sim: "ei-sim-estimated-date" }, ". On the insider side you will read ", { text: "a cluster in a tracker table", sim: "ei-sim-cluster" }, " and ", { text: "the window that opens after a report", sim: "ei-sim-window" }, "."],
    ["Words to know: ", { text: "before open and after close", term: "bmo-amc" }, ", ", { text: "trading window", term: "insider-trading-window" }, ", ", { text: "insider cluster", term: "insider-cluster" }, " and ", { text: "insider tracker", term: "insider-tracker" }, "."],
  ],
  screens: [
    {
      id: "ei-date-sources",
      live: [jpmorganIr("", "JPMorganChase investor relations"), yahooEarningsCalendar("JPM", "JPM earnings calendar"), stockAnalysisStock("JPM", "", "JPM overview"), stockAnalysisEarningsCalendar("earnings calendar, Before Open / After Close")],
      title: "One report date, four places",
      where: "Company IR · Yahoo calendar · StockAnalysis · Finviz",
      alt: `Simulated comparison of JPMorgan's next report date, read November 13, 2026. JPMorgan's own release: ${EI_JPM.ir.date}, results ${EI_JPM.ir.release}, call ${EI_JPM.ir.call}, announced ${EI_JPM.ir.announced}. Yahoo calendar: ${EI_JPM.yahoo.date}, EPS estimate ${EI_JPM.yahoo.eps}. StockAnalysis Earnings Date field: ${EI_JPM.stockAnalysis.value}. Finviz Earnings field: ${EI_JPM.finviz.value}.`,
      caption: `Real reads, ${EI_READ_ON}. The company's release is the source; the sites differ in what their field shows. Layout simulated.`,
      blocks: [
        { kind: "table", title: "JPMorgan · next report", columns: ["Source", "What it shows", "Time"], rows: [
          ["JPMorganChase IR (release of May 21, 2025)", EI_JPM.ir.date, `Results ${EI_JPM.ir.release}; call ${EI_JPM.ir.call}`],
          ["Yahoo Finance earnings calendar", "January 14, 2027", `\"at 8 AM EST\" · EPS estimate ${EI_JPM.yahoo.eps}`],
          ["StockAnalysis overview: Earnings Date", EI_JPM.stockAnalysis.value, "The last report, not the next"],
          ["Finviz snapshot: Earnings", EI_JPM.finviz.value, "The last report, before market open"],
        ] },
        { kind: "stats", title: "Yahoo calendar · last report", rows: [{ label: "Earnings Date", value: EI_JPM.yahoo.last.date }, { label: "EPS Estimate", value: `${EI_JPM.yahoo.last.est}` }, { label: "Reported EPS", value: `${EI_JPM.yahoo.last.reported}` }, { label: "Surprise (%)", value: EI_JPM.yahoo.last.surprise }] },
        { kind: "note", text: "Two sites' earnings fields still showed October's report a month later. A field labeled Earnings Date can mean the last one until the next is loaded." },
      ],
      callouts: [
        { n: 1, block: 0, text: ["The company's release gives the date, the release time and the call time. ", { text: "A calendar can show any of them", term: "bmo-amc" }, ", or a placeholder."] },
        { n: 2, block: 1, text: "Past rows show the estimate, the reported number and the surprise. Read them as history, not as a forecast." },
        { n: 3, block: 2, text: ["Check whether a date is the last or the next before ", { text: "building a rule on it", sim: "ei-sim-estimated-date" }, "."] },
      ],
    },
    {
      id: "ei-date-change",
      live: [jpmorganIr("news/2026/jpmc-updates-2027-earnings-release-date-info", "the Oct 27, 2026 date update")],
      title: "Dates change: read the company's update",
      where: "Company IR · news release",
      alt: `Simulated JPMorgan press release history. On ${EI_JPM.moved.firstOn} JPMorgan listed its fourth-quarter 2027 call for ${EI_JPM.moved.from}. On ${EI_JPM.moved.updatedOn} an update moved it to ${EI_JPM.moved.to}. The first three 2027 dates were unchanged.`,
      caption: "Two real JPMorgan releases, read Nov 13, 2026. Layout simulated.",
      blocks: [
        { kind: "table", title: "Fourth-quarter 2027 call", columns: ["Release", "Date given"], rows: [[EI_JPM.moved.firstOn, EI_JPM.moved.from], [`${EI_JPM.moved.updatedOn} (updated)`, EI_JPM.moved.to]] },
        { kind: "chips", title: "Other 2027 dates", chips: ["Q1 · Tue Apr 13, 2027", "Q2 · Tue Jul 13, 2027", "Q3 · Tue Oct 12, 2027", "(previously announced)"] },
        { kind: "note", text: "Results about 6:45 AM ET on each date; the call at 8:30 AM ET. A calendar that copied the first release would be a day off for Q4 2027." },
      ],
      callouts: [
        { n: 1, block: 0, text: "Companies update dates, sometimes months ahead. The newest release wins." },
        { n: 2, block: 1, text: "Large companies often publish a year of dates at once. Many smaller ones announce a few weeks ahead." },
        { n: 3, block: 2, text: ["Before the open means the first reaction is at 9:30 AM, ", { text: "not the next day", term: "bmo-amc" }, "."] },
      ],
    },
    {
      id: "ei-tracker",
      live: [finvizInsiderTrading("buys", "latest insider purchases"), edgarInsiders(JPM_CIK, "EDGAR insider transactions (JPM)")],
      title: "An insider tracker's table",
      where: "OpenInsider-style table (SAMPLE) · Finviz insider page",
      alt: "Simulated insider-tracker table for a SAMPLE company. Columns: filing date, trade date, ticker, insider, title, trade type, price, quantity, owned, change in ownership, value. Three P - Purchase rows by the CEO, CFO and a director within two days, and one A - Award row on a quarter-end date at zero price.",
      caption: "A SAMPLE table in the layout insider trackers such as OpenInsider use. Names and numbers are simulated.",
      blocks: [
        { kind: "table", title: "SAMPLE · SMPL insider trades", columns: ["Filing date", "Trade date", "Insider", "Title", "Trade type", "Price", "Qty", "Owned", "ΔOwn", "Value"], rows: [
          ["Nov 11", "Nov 9", "A. Lee", "CEO", "P - Purchase", "$9.10", "+20,000", "180,000", "+12%", "+$182,000"],
          ["Nov 12", "Nov 10", "B. Ortiz", "CFO", "P - Purchase", "$9.05", "+8,000", "48,000", "+20%", "+$72,400"],
          ["Nov 12", "Nov 10", "C. Park", "Dir", "P - Purchase", "$9.20", "+5,000", "15,000", "+50%", "+$46,000"],
          ["Oct 2", "Sep 30", "D. Shah", "Dir", "A - Award", "$0.00", "+1,200", "16,200", "+8%", "$0"],
        ] },
        { kind: "filters", title: "Tracker filters", filters: [{ label: "Trade type", value: "Purchases only" }, { label: "Insiders", value: "Officers and directors" }, { label: "Cluster", value: "2+ insiders within days" }] },
        { kind: "note", text: "Filing date vs trade date: Form 4 is due within two business days of the trade. Value is quantity × price; ΔOwn is the change against what the insider held." },
      ],
      callouts: [
        { n: 1, block: 0, text: ["Three P rows in two days: ", { text: "a cluster", sim: "ei-sim-cluster" }, ". The award row is pay, not a purchase."] },
        { n: 2, block: 1, text: ["Filter to purchases by officers and directors first. ", { text: "Sales cluster for routine reasons", sim: "ei-sim-window" }, "."] },
        { n: 3, block: 2, text: ["Every tracker row comes from a Form 4. Open it for the ", { text: "10b5-1 box", term: "rule-10b5-1-plan" }, " and indirect holdings."] },
      ],
    },
  ],
  walkthroughs: [
    {
      title: "Before you put a report date in a rule",
      steps: [
        "Open the company's investor-relations events page or its latest date release.",
        ["If the company has not announced, label the calendar's date ", { text: "estimated", sim: "ei-sim-estimated-date" }, "."],
        ["Record before open or after close, and whether a time is the release or the call."],
        "Check for an updated release; dates move.",
      ],
    },
    {
      title: "Reading an insider tracker",
      steps: [
        ["Filter to purchases (code P) by officers and directors; ", { text: "count only P rows in a cluster", sim: "ei-sim-cluster" }, "."],
        ["Line the dates up with the last report: ", { text: "a burst right after it", sim: "ei-sim-window" }, " is usually the trading window."],
        "Read ΔOwn for size against holdings, not the dollar value alone.",
        "Open the Form 4 on EDGAR: code, indirect holdings and the 10b5-1 box.",
      ],
    },
  ],
  simulations: EI_SIMULATIONS,
  tasks: [
    { id: "ei-t1", find: "JPMorgan's next report date on its own investor-relations page", live: jpmorganIr("", "JPMorganChase investor relations"), where: "Investor relations: Events, or the latest conference-call date release", answer: { format: "date", example: "Jan 14, 2027", minYear: 2026, maxYear: 2028 }, why: "The company's date is the confirmed one. Compare it with a calendar's before you set a rule's window." },
    { id: "ei-t2", find: "The EPS estimate Yahoo shows for JPMorgan's next report", live: yahooEarningsCalendar("JPM", "JPM earnings calendar"), where: "Earnings calendar: EPS Estimate column, top row", answer: { format: "number", min: 0, max: 50, example: `${EI_JPM.yahoo.eps}` }, why: "The estimate is the bar the report is measured against. Record it with the date: it moves as analysts revise." },
    { id: "ei-t3", find: "What StockAnalysis's Earnings Date field shows for JPMorgan", live: stockAnalysisStock("JPM", "", "JPM overview"), where: "Overview: the key data list, Earnings Date", answer: { format: "date", example: EI_JPM.stockAnalysis.value, minYear: 2026, maxYear: 2028 }, why: "On Nov 13, 2026 this field still showed the last report. Check whether a date is the last or the next before you rely on it." },
    { id: "ei-t4", find: "The Value ($) of the top row on Finviz's latest insider purchases", live: finvizInsiderTrading("buys", "latest insider purchases"), where: "Insider trading table: Value ($) column, first row", answer: { format: "money", min: 1, max: 5e9, example: "233,670" }, why: "Compare the value with #Shares Total: a large dollar figure can be a small change in what the insider holds." },
  ],
  drills: [
    { id: "ei-d1", prompt: "A calendar shows a report date; the company's events page says \"to be announced\". The calendar's date is…", options: ["Confirmed", "An estimate", "Wrong", "The call date"], answer: 1, why: "Until the company announces, sites estimate from past patterns." },
    { id: "ei-d2", prompt: "A company reports after the close on Tuesday. The first regular session that can react is…", options: ["Tuesday", "Wednesday", "Monday", "Friday"], answer: 1, why: "After close is after 4:00 PM ET; the next session opens Wednesday at 9:30 AM ET." },
    { id: "ei-d3", prompt: "Six officers file sales the day after a report. The most likely reason is…", options: ["They know bad news", "The trading window opened", "A tender offer", "A data error"], answer: 1, why: "Company policies usually open trading a day or two after a report." },
    { id: "ei-d4", prompt: "In a tracker cluster, which rows count as insiders buying with their own money?", options: ["A - Award", "M - Option exercise", "P - Purchase", "F - Tax"], answer: 2, why: "Only P is an open-market purchase." },
    { id: "ei-d5", prompt: "One officer sells the same 2,500 shares about a month apart, 10b5-1 box checked both times. That is…", options: ["A signal to sell", "A pre-set plan", "Insider trading", "A buyback"], answer: 1, why: "A plan adopted in advance, with a cooling-off period before it can trade." },
  ],
  scenarios: [
    { id: "ei-s1", prompt: "A calendar lists a company's earnings date, but the company's own IR page has not announced one. In your note you write…", options: ["The date as confirmed", "The date as estimated, with the source, and check IR again later", "Nothing at all", "The prior year's date"], answer: 1, why: "Calendars often project dates from history. Only the company's announcement confirms it." },
    { id: "ei-s2", prompt: "Six insiders filed proposed sales the week after earnings. Before reading it as a warning, you check…", options: ["Nothing; it is a warning", "Whether the trading window just opened, whether sales are 10b5-1 plan trades, and how much each still holds", "The stock's color on the chart", "Only the CEO's name"], answer: 1, why: "Insiders often sell when the post-earnings window opens. Plan status and remaining holdings give the context." },
    { id: "ei-s3", prompt: "An insider tracker shows one director buying $40,000 of stock. Another site says three insiders bought in the same month. Next step…", options: ["Ignore buys", "Open the Form 4s to confirm the dates, prices and codes (P is an open-market purchase)", "Buy the same amount", "Assume both sites are wrong"], answer: 1, why: "Code P marks an open-market buy. The filings confirm whether it is a real cluster or one trade counted twice." },
  ],
  caveats: [
    { title: "Fields can be stale", text: "On Nov 13, 2026, two sites' earnings fields still showed JPMorgan's October report. Read whether a date is the last or the next." },
    { title: "Insiders can be wrong", text: "Even a cluster of open-market buys is a research lead, not a forecast. Insiders buy and sell for many reasons, and a tracker cannot tell you which." },
    { title: "Credited, not endorsed", text: "OpenInsider, Finviz, Yahoo Finance and StockAnalysis are credited for their layouts. Their labels simplify the filings; the Form 4 and the company's release are the sources." },
  ],
  sources: [
    { label: "JPMorganChase: conference calls for 2026 earnings (May 21, 2025)", url: "https://www.jpmorganchase.com/ir/news/2025/jpmc-announces-conference-calls-to-review-first-quarter-second-quarter-third-quarter-and-fourth-quarter-2026-earnings", supports: "Q4 2026 call Thursday, January 14, 2027 at 8:30 a.m. ET; results about 6:45 a.m. ET" },
    { label: "JPMorganChase: updates 2027 earnings release date information (Oct 27, 2026)", url: "https://www.jpmorganchase.com/ir/news/2026/jpmc-updates-2027-earnings-release-date-info", supports: "Q4 2027 moved to Thursday, January 13, 2028; Q1–Q3 2027 previously announced" },
    { label: "JPMorganChase: conference calls for 2027 earnings (Mar 4, 2026)", url: "https://www.jpmorganchase.com/ir/news/2026/jpmc-announces-conference-calls-to-review-first-quarter-second-quarter-third-quarter-and-fourth-quarter-2027-earnings", supports: "Q4 2027 first listed as Friday, January 14, 2028" },
    { label: "Yahoo Finance: JPM earnings calendar", url: "https://finance.yahoo.com/calendar/earnings?symbol=JPM", supports: "January 14, 2027 at 8 AM EST, EPS estimate 5.86; Oct 13, 2026 estimate 5.94, reported 5.75, surprise −3.24% (read Nov 13, 2026)" },
    { label: "StockAnalysis: JPM overview and earnings calendar", url: "https://stockanalysis.com/stocks/jpm/", supports: "Earnings Date Oct 13, 2026 shown on Nov 13, 2026; the calendar lists Before Open and After Close times" },
    { label: "Finviz: JPM insider table and latest insider purchases", url: "https://finviz.com/insidertrading?tc=1", supports: "Insider rows (Owner, Relationship, Date, Transaction, Cost, #Shares, Value, #Shares Total, SEC Form 4); JPM proposed sales Apr 15, 2026 (read Nov 13, 2026)" },
    { label: "SEC fact sheet: Insider trading arrangements (Rule 10b5-1 amendments)", url: "https://www.sec.gov/files/33-11138-fact-sheet.pdf", supports: "Cooling-off periods; Form 4 checkbox for plan trades" },
    { label: "SEC Investor.gov: Insider transactions and Forms 3, 4 and 5", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-69", supports: "Form 4 within two business days; insiders sell for many reasons" },
  ],
  links: [
    { label: "Learn → Tool: Earnings dates and insiders", to: "/training?group=tool-earnings-insiders" },
    { label: "Coach → Whose date, whose trade?", to: "/coach/earnings-insiders-tour" },
    { label: "Tool Training → SEC EDGAR", to: "/tools/sec-edgar" },
    { label: "Tool Training → Capstone 2 (a bank)", to: "/tools/capstone-bank" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  mode: "tool_earnings_insiders",
  modeLabel: "Earnings dates and insiders: check the source",
  modeTip: "Take report dates from the company, label calendar dates as estimates, read before open or after close, and in insider tables count only P rows, check dates against the last report and open the Form 4. Cases → Market-wide news.",
  questions: [
    mc("EI-01", "The source for a company's report date is…", "A", "The company's investor-relations page or its press release", ["Any earnings calendar", "A social post", "The options chain"], "Calendars copy or estimate it.", "confirmed-earnings-date"),
    mc("EI-02", "Before the company announces, a calendar's date is usually…", "C", "An estimate from past reporting patterns", ["Confirmed by the SEC", "Random", "The ex-dividend date"], "Label it estimated in your note.", "confirmed-earnings-date"),
    mc("EI-03", `JPMorgan said results about ${EI_JPM.ir.release} and the call at ${EI_JPM.ir.call}; Yahoo showed "at 8 AM EST". The sound note records…`, "B", "The company's times, with the calendar's as a secondary read", ["Yahoo's time only", "No time", "The average"], "A calendar time may be the call, the release or a placeholder.", "bmo-amc"),
    mc("EI-04", "BMO means the report comes out…", "D", "Before the 9:30 AM ET open, so that session reacts first", ["After the close", "On the weekend", "Before the month ends"], "AMC means after the 4:00 PM ET close.", "bmo-amc"),
    mc("EI-05", `On ${EI_READ_ON}, StockAnalysis's Earnings Date field for JPM showed ${EI_JPM.stockAnalysis.value}. That was…`, "A", "The last report, not the next", ["The next report", "An error by JPMorgan", "The 10-K date"], "Check last vs next before relying on a field.", "confirmed-earnings-date"),
    mc("EI-06", "JPMorgan first listed its Q4 2027 call for Jan 14, 2028, then updated it to Jan 13, 2028. A calendar that copied the first release…", "C", "Would be a day off; the newest company release wins", ["Is still right", "Is the confirmed date", "Shows the 10-Q date"], "Dates move; check for updates.", "confirmed-earnings-date"),
    mc("EI-07", "An insider tracker such as OpenInsider…", "B", "Collects Form 4 filings into searchable tables", ["Files Form 4s for insiders", "Is run by the SEC", "Predicts prices"], "The Form 4 is the source.", "insider-tracker"),
    mc("EI-08", "In a tracker, which trade type is an open-market purchase?", "D", "P - Purchase", ["A - Award", "M - Option exercise", "G - Gift"], "Only P is an insider buying with their own money at the market.", "form-4-transaction-code"),
    mc("EI-09", "An insider cluster is…", "A", "Several insiders at one company trading the same way within days", ["One large trade", "A fund's rebalance", "A share split"], "Trackers list cluster buys.", "insider-cluster"),
    mc("EI-10", `JPMorgan's insider table showed ${EI_WINDOW.length} officers' proposed sales on Apr 15, 2026, the day after its report. The most likely reading is…`, "C", "The trading window opened after the report", ["A coordinated exit", "A data error", "A buyback"], "Policies usually open trading a day or two after a report.", "insider-trading-window"),
    mc("EI-11", "ΔOwn +50% on a director's purchase means…", "B", "The purchase raised their holding by half", ["The stock rose 50%", "They own 50% of the company", "The price was 50% off"], "Size against holdings, not dollars.", "insider-cluster"),
    mc("EI-12", "One officer sells 2,500 shares about a month apart, 10b5-1 box checked both times. That is…", "A", "A pre-set plan's schedule", ["A sign of trouble", "Illegal", "An award"], "Plans are adopted in advance with a cooling-off period.", "rule-10b5-1-plan"),
    mc("EI-13", "Which pattern is rarer and worth a closer look in the filings?", "D", "Several officers buying in the open market (P) with their own money", ["Sales right after a report", "Quarterly director awards", "Shares withheld for tax"], "Even then it is a lead, not a signal.", "insider-buying"),
    mc("EI-14", "Filing date Nov 12, trade date Nov 10 on a Form 4 row is…", "C", "Normal: a Form 4 is due within two business days", ["Late by a week", "A sign of fraud", "A tracker error"], "SEC Forms 3, 4 and 5 rules.", "form-4-insider-sale"),
  ],
  terms: TERMS,
  cases: CASES,
};

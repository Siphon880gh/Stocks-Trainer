/**
 * Hover definitions for the field labels on Tool Training's simulated screens (TT9). `TOOL_FIELD_TERMS` adds the
 * glossary entries the tools' labels needed (they join the Archive glossary through `TOOL_TERMS`); `FIELD_TERM_IDS`
 * maps each exact label, as it appears on a screen, to a glossary id. Callout copy marks a term with `{ text, term }`.
 * Definitions are plain and general; each tool's own help page is the authority for its exact formula.
 */
import type { LiteracyTerm } from "../literacyTerms";
import type { ToolScreen } from "./types";

const NA = "Educational, not advice.";

export const TOOL_FIELD_TERMS: LiteracyTerm[] = [
  { id: "market-cap", name: "Market cap", category: "markets", summary: "Share price times shares outstanding: what the market values the company's stock at right now.", detail: `It moves with the price all day, so read it with the quote's time. It is not the company's cash, revenue or debt; enterprise value adds debt and subtracts cash. ${NA}` },
  { id: "beta", name: "Beta", category: "markets", summary: "How much a stock's returns have moved with the market's in the past: 1 moves with it, below 1 less, above 1 more.", detail: `Yahoo Finance labels it Beta (5Y Monthly): five years of monthly returns against the S&P 500. It describes the past and says nothing about direction. ${NA}` },
  { id: "fifty-two-week-range", name: "52-week range", category: "markets", summary: "The lowest and highest prices over the past year.", detail: `Two extremes, not the path between them: a stock near its high may have spent most of the year near its low. ${NA}` },
  { id: "day-range", name: "Day's range", category: "markets", summary: "The lowest and highest prices of the session shown.", detail: `Before the open it still shows the last session's range. Check the quote's time to know which day it covers. ${NA}` },
  { id: "previous-close", name: "Previous close", category: "markets", summary: "The regular-session closing price of the session before the one shown.", detail: `Labels are relative to the last session. On Nov 12, 2026 before the open, Yahoo's Previous Close for NEM was Nov 10's close, while the headline price was Nov 11's close. ${NA}` },
  { id: "average-volume", name: "Average volume", category: "markets", summary: "The average number of shares traded per day over a window, often three months.", detail: `Low average volume means wide spreads and prices that one order can move. Finviz and Yahoo both show it near the quote. ${NA}` },
  { id: "price-to-sales", name: "P/S ratio", category: "markets", summary: "Market cap divided by revenue over the trailing twelve months.", detail: `Useful when earnings are negative or unusual, but it ignores costs: two companies with the same sales can earn very different profits. ${NA}` },
  { id: "price-to-book", name: "P/B ratio", category: "markets", summary: "Share price divided by book value per share (assets minus liabilities, per share).", detail: `Book value comes from the latest balance sheet, so it is a quarter or more old. Write-downs change it. ${NA}` },
  { id: "price-to-free-cash-flow", name: "P/FCF ratio", category: "markets", summary: "Market cap divided by free cash flow over the trailing twelve months.", detail: `Free cash flow is operating cash flow minus capital spending. It can swing with one large project year. ${NA}` },
  { id: "current-ratio", name: "Current ratio", category: "markets", summary: "Current assets divided by current liabilities: whether short-term assets cover bills due within a year.", detail: `Above 1 means they do on paper. It is a balance-sheet figure from the most recent quarter. ${NA}` },
  { id: "debt-to-equity", name: "Debt / equity", category: "markets", summary: "Total debt divided by shareholders' equity.", detail: `Sites write it differently: StockAnalysis showed NEM at 0.16 and Yahoo at 15.58% on Nov 12, 2026, the same ratio in two formats. ${NA}` },
  { id: "analyst-consensus", name: "Analyst consensus", category: "markets", summary: "The average of analysts' buy, hold and sell ratings. Finviz's Recom runs from 1 (strong buy) to 5 (strong sell).", detail: `It is a summary of opinions, not a fact about the business, and sites count different analysts. The SEC warns against relying on ratings alone. ${NA}` },
  { id: "price-target", name: "Price target", category: "markets", summary: "An analyst's estimate of where the price could be in about 12 months; sites show the average of many.", detail: `Read the range and the number of analysts with the average. "Upside" to an average target is an opinion. ${NA}` },
  { id: "earnings-date", name: "Earnings date", category: "process", summary: "The day a company reports (or is expected to report) its quarterly results.", detail: `Before the company confirms it, sites show an estimate. Moves around this date are often about the report. ${NA}` },
  { id: "revenue", name: "Revenue", category: "markets", summary: "Money a company took in from selling its goods and services in a period, before costs.", detail: `Also called sales or total revenue. Check the period: TTM, a fiscal year or a quarter. ${NA}` },
  { id: "net-income", name: "Net income", category: "markets", summary: "Profit after all costs, interest and taxes for a period: the bottom line.", detail: `One-time items such as impairments or asset-sale gains can swing it, so read the rows above it. ${NA}` },
  { id: "diluted-shares", name: "Diluted shares outstanding", category: "ownership", summary: "The share count including options and convertible securities that could become shares; used for diluted EPS.", detail: `A big jump usually means new shares were issued, for example to pay for an acquisition. ${NA}` },
  { id: "goodwill-impairment", name: "Goodwill impairment", category: "markets", summary: "A non-cash write-down when an acquired business is judged to be worth less than the company paid.", detail: `It cuts net income in the year taken but uses no cash that year. Newmont's FY 2023 included a 1.76 billion dollar goodwill impairment. ${NA}` },
  { id: "unusual-items", name: "Unusual (irregular) items", category: "markets", summary: "One-time gains or losses, such as write-downs, restructuring or asset sales, kept apart from regular operations.", detail: `Yahoo labels the row Irregular Income/Expenses. They can make one year's profit or P/E look unusually good or bad. ${NA}` },
  { id: "fiscal-year", name: "Fiscal year", category: "process", summary: "The 12-month period a company uses for its accounts; it may not match the calendar year.", detail: `Compare the same fiscal periods across companies, and read the period-ending date on each column. ${NA}` },
  { id: "insider-institutional-ownership", name: "Insider and institutional ownership", category: "ownership", summary: "The share of stock held by officers and directors (insider) and by funds and other institutions.", detail: `Reported with a lag from filings. A change is a question to look up in the filing, not a signal by itself. ${NA}` },
  { id: "sma-distance", name: "SMA20, SMA50, SMA200 (Finviz)", category: "markets", summary: "How far the price is above or below its 20-, 50- or 200-day simple moving average, in percent.", detail: `Finviz shows the distance, not the average itself. Positive means the price is above the average. ${NA}` },
  { id: "price-performance", name: "Performance (Perf YTD, Perf Year)", category: "markets", summary: "How much the price has changed since the start of the year (YTD) or over the past 12 months.", detail: `Check whether a figure includes dividends: Yahoo's Performance Overview says total return; a price change alone does not. ${NA}` },
  { id: "forward-dividend-yield", name: "Forward dividend and yield", category: "ownership", summary: "The expected dividend for the next 12 months (usually the latest payment annualized) and that amount as a percent of the price.", detail: `It assumes the dividend stays the same; companies can change it. ${NA}` },
  { id: "fund-assets", name: "Fund assets (AUM)", category: "ownership", summary: "The total value of everything a fund holds, also called assets under management.", detail: `Larger funds usually trade with tighter spreads, but size says nothing about whether the holdings suit you. ${NA}` },
  { id: "etf-holdings", name: "ETF holdings", category: "ownership", summary: "The securities a fund owns and the weight of each, as of a dated file.", detail: `Free pages often list only the top holdings. Read the as-of date; funds rebalance. ${NA}` },
  { id: "lynch-fair-value", name: "Lynch fair value", category: "markets", summary: "A rough value from Peter Lynch's rule of thumb that a fairly priced stock's P/E is about equal to its earnings growth rate.", detail: `It depends heavily on the growth estimate used, so it is a talking point, not a price. ${NA}` },
  { id: "graham-number", name: "Graham number", category: "markets", summary: "The square root of 22.5 × EPS × book value per share: Benjamin Graham's ceiling price for a defensive investor.", detail: `It ignores growth and suits steady, asset-heavy companies best. ${NA}` },
];

/**
 * Exact screen labels (table headers, first-column row labels, stats and filter labels) → glossary id.
 * Lookups trim trailing asterisks and a trailing date in parentheses, e.g. "Short % of Float (10/30/2026)".
 */
export const FIELD_TERM_IDS: Record<string, string> = {
  // Finviz
  "P/E": "pe-ratio",
  "Forward P/E": "forward-pe",
  "EPS (ttm)": "eps",
  "Market Cap": "market-cap",
  "Market Cap.": "market-cap",
  "Average Volume": "average-volume",
  "Analyst Recom.": "analyst-consensus",
  "Recom": "analyst-consensus",
  "Target Price": "price-target",
  "Insider Own": "insider-institutional-ownership",
  "Inst Own": "insider-institutional-ownership",
  "Short Float": "short-interest",
  "Perf YTD": "price-performance",
  "Perf Year": "price-performance",
  "SMA200": "sma-distance",
  "Rel Volume": "relative-volume",
  "Rating change": "analyst-rating",
  "Price target": "price-target",
  // StockAnalysis
  "Revenue (ttm)": "revenue",
  "Revenue": "revenue",
  "Net Income": "net-income",
  "EPS": "eps",
  "PE Ratio": "pe-ratio",
  "Forward PE": "forward-pe",
  "Dividend": "dividend",
  "52-Week Range": "fifty-two-week-range",
  "Beta": "beta",
  "Analysts": "analyst-consensus",
  "Price Target": "price-target",
  "Earnings Date": "earnings-date",
  "Fiscal Year": "fiscal-year",
  "TTM": "trailing-twelve-months",
  "Period Ending": "period-ending",
  "Operating Income": "operating-income",
  "Impairment of Goodwill": "goodwill-impairment",
  "Shares Outstanding (Diluted)": "diluted-shares",
  "EPS (Diluted)": "eps",
  "PS Ratio": "price-to-sales",
  "PB Ratio": "price-to-book",
  "P/FCF Ratio": "price-to-free-cash-flow",
  "Current Ratio": "current-ratio",
  "Debt / Equity": "debt-to-equity",
  "Interest Coverage": "interest-coverage",
  "Short % of Float": "short-interest",
  "Short Ratio (days to cover)": "days-to-cover",
  "Lynch Fair Value": "lynch-fair-value",
  "Graham Number": "graham-number",
  "Assets": "fund-assets",
  "Expense Ratio": "expense-ratio",
  "Holdings": "etf-holdings",
  // Yahoo Finance
  "Previous Close": "previous-close",
  "Day's Range": "day-range",
  "52 Week Range": "fifty-two-week-range",
  "Volume": "volume",
  "Avg. Volume": "average-volume",
  "Market Cap (intraday)": "market-cap",
  "Beta (5Y Monthly)": "beta",
  "PE Ratio (TTM)": "pe-ratio",
  "EPS (TTM)": "eps",
  "Forward Dividend & Yield": "forward-dividend-yield",
  "1y Target Est": "price-target",
  "Trailing P/E": "pe-ratio",
  "Fiscal Year Ends": "fiscal-year",
  "Most Recent Quarter (mrq)": "most-recent-quarter",
  "Total Debt/Equity (mrq)": "debt-to-equity",
  "Adj Close": "adjusted-close",
  "Total Revenue": "revenue",
  "Gross Profit": "gross-margin",
  "Total Operating Profit/Loss": "operating-income",
  "Irregular Income/Expenses": "unusual-items",
  "Net Income Available to Common": "net-income",
  "Diluted EPS": "eps",
  // Market Forces and capstone
  "Exposure": "exposure-label",
  "Quality · snapshot": "etf-based-weight-estimate",
  "Average target": "price-target",
  "Short % of float": "short-interest",
};

/** "Short % of Float (10/30/2026)" → "Short % of Float"; "Adj Close**" → "Adj Close". */
export function fieldLabelKey(label: string): string {
  return label.replace(/\*+$/, "").replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{4}\)$/, "").trim();
}

/** The glossary id a screen label carries a hover definition for, if any. */
export function fieldTermId(label: string): string | undefined {
  return FIELD_TERM_IDS[fieldLabelKey(label)];
}

/** Every label a screen draws that could carry a hover term: stats and filter labels, table headers, row labels. */
export function screenFieldLabels(screen: ToolScreen): string[] {
  const out: string[] = [];
  for (const b of screen.blocks) {
    if (b.kind === "stats") out.push(...b.rows.map((r) => r.label));
    else if (b.kind === "filters") out.push(...b.filters.map((f) => f.label));
    else if (b.kind === "table") {
      out.push(...b.columns);
      for (const r of b.rows) if (r[0] !== undefined) out.push(r[0]);
    }
  }
  return out;
}

/** Glossary ids a screen's labels define, in first-seen order (the focusable "Terms on this screen" row). */
export function screenFieldTermIds(screen: ToolScreen): string[] {
  const ids: string[] = [];
  for (const l of screenFieldLabels(screen)) {
    const id = fieldTermId(l);
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

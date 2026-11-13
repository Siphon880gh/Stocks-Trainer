import type { CoachingSession } from "../types";

/** Tool training capstone part 2: a bank through five tools; ratios that fit, definitions, filings, a written rule. */
export const toolCapstoneBankSession: CoachingSession = {
  meta: {
    slug: "tool-capstone-bank",
    title: "A bank, five tools",
    summary:
      "Research JPMorgan Chase across Market Forces, StockAnalysis, Finviz, Yahoo Finance and SEC EDGAR: pick ratios that fit a bank, explain a revenue gap, rebuild TTM from the filings, and let a written rule handle report day.",
    topic: "Tool training",
    tags: ["sample", "tools", "research-tools"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE walk with real dated reads. You are researching JPMorgan Chase (JPM) on Nov 13, 2026 before the open.\n\nWhich valuation reads do you put first in the note?",
        outcome: "continue",
        choices: [
          { label: "P/B and P/TBV with return on equity, then P/E", next: "revenue" },
          { label: "Current ratio and P/FCF, like any company", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "Those were built for companies that make and sell things. StockAnalysis showed both as n/a for JPM; Finviz printed its own calculation. For a bank, book value and ROE fit the business.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      revenue: {
        message:
          "Revenue reads 190.73B on StockAnalysis and Yahoo, Sales 302.55B on Finviz. P/S reads 4.77 and 3.03.\n\nHow do you explain the gap?",
        outcome: "continue",
        choices: [
          { label: "A definition gap (net of interest expense vs gross); quote it with the definition or skip P/S", next: "ttm" },
          { label: "Finviz shows it cheaper, so it is cheaper", next: "wrong_revenue" },
        ],
      },
      wrong_revenue: {
        message:
          "The bank and the morning are the same. A gap over 100 billion dollars is not a price move; it is what each site counts as revenue. The 10-Q's income statement shows the lines.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "revenue",
      },
      ttm: {
        message:
          "From EDGAR: net income to common was 55,681M for FY 2025, 42,991M for the first nine months of 2025 and 51,837M for the first nine months of 2026.\n\nWhat is the TTM?",
        outcome: "continue",
        choices: [
          { label: "55,681 − 42,991 + 51,837 = 64,527M, matching the sites' 64.53B", next: "rule" },
          { label: "51,837M, the latest figure", next: "wrong_ttm" },
        ],
      },
      wrong_ttm: {
        message:
          "That is nine months, not twelve. TTM swaps last year's first nine months for this year's.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "ttm",
      },
      rule: {
        message:
          "SAMPLE: on report day EPS beats, the provision for credit losses jumps, and posts say \"cheap after the beat\". Your rule: no new position within three trading days of a report.\n\nWhat do you do?",
        outcome: "continue",
        choices: [
          { label: "Record both lines with sources, wait out the window, read the 10-Q", next: "success" },
          { label: "Buy now; the beat settles it", next: "wrong_rule" },
        ],
      },
      wrong_rule: {
        message:
          "A provision is money set aside for expected loan losses; it can matter more for the next year than the beat. The written rule decides the timing.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "rule",
      },
      success: {
        message:
          "Capstone 2 complete. Exposure, ratios that fit a bank, definitions before differences, TTM from the filings, and a rule for report days, all in a dated note. The tools are credited, not endorsed; JPMorgan is an example, not a recommendation.\n\nNext: Tool Training → Capstone 2 and its Learn quiz.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default toolCapstoneBankSession;

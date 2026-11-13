import type { CoachingSession } from "../types";

/** Tool training: settle a data site's number or insider row in the filing on SEC EDGAR. */
export const secEdgarTourSession: CoachingSession = {
  meta: {
    slug: "sec-edgar-tour",
    title: "Check it on EDGAR",
    summary:
      "Search filings for a phrase, rebuild a data site's TTM from the 10-K and 10-Q, and read a Form 4's code, size and 10b5-1 box before reading anything into an insider trade.",
    topic: "Tool training",
    tags: ["sample", "tools", "research-tools"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE walk with real dated filings. You want every Newmont 10-Q that mentions \"all-in sustaining costs\".\n\nHow do you search?",
        outcome: "continue",
        choices: [
          { label: "Full-text search: the phrase in quotes, Newmont's CIK, form 10-Q, then sort by filing date", next: "ttm" },
          { label: "Type the words without quotes across all of EDGAR and read the top hit", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "Without quotes every word only has to appear somewhere, and across all filers that is thousands of hits. Results also lead with relevance, not the newest date (on Nov 13, 2026 the first hits were from 2021 and 2022).\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      ttm: {
        message:
          "Newmont's filings: FY 2025 revenue 22,669M (10-K), nine months 2025 15,851M, nine months 2026 19,788M (10-Q filed Oct 22, 2026). StockAnalysis's TTM shows 26,606M.\n\nIs the site right?",
        outcome: "continue",
        choices: [
          { label: "Yes: 22,669 − 15,851 + 19,788 = 26,606", next: "form4" },
          { label: "No: the 10-Q says 19,788, so the site overstates revenue", next: "wrong_ttm" },
        ],
      },
      wrong_ttm: {
        message:
          "19,788 is nine months. TTM swaps last year's first nine months for this year's, so the site's twelve-month figure is larger by design.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "ttm",
      },
      form4: {
        message:
          "A data site shows a JPMorgan officer's Sale of 2,500 shares on Sep 10, 2026. The Form 4 shows code S, 71,047 shares owned after, two GRAT holdings, and the 10b5-1 box checked.\n\nWhat does the note say?",
        outcome: "continue",
        choices: [
          { label: "A planned sale of about 3% of the direct holding; context, not a signal", next: "success" },
          { label: "An insider is dumping; sell", next: "wrong_form4" },
        ],
      },
      wrong_form4: {
        message:
          "The 10b5-1 box says the sale ran on a plan set in advance, and 2,500 of about 73,500 shares is small. The filing gives the context the row leaves out.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "form4",
      },
      success: {
        message:
          "Done. Search with quotes and filters, rebuild TTM from the 10-K and 10-Q, and read the Form 4 before the row. EDGAR is the primary source; data sites are credited, not endorsed. Companies here are examples, not recommendations.\n\nNext: Tool Training → SEC EDGAR and its Learn quiz.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default secEdgarTourSession;

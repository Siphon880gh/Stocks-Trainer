import type { CoachingSession } from "../types";

/** Tool training · StockAnalysis: time stamps, TTM vs fiscal years, one-time items, Pro fields and data providers. */
export const stockAnalysisTourSession: CoachingSession = {
  meta: {
    slug: "stockanalysis-tour",
    title: "Read StockAnalysis with dates",
    summary:
      "Read a stock page on stockanalysis.com the careful way: which price and when, which period each column covers, which rows are one-time, and who supplied the numbers.",
    topic: "Tool training",
    tags: ["sample", "tools", "research-tools"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE. On Nov 12, 2026, Newmont's page showed 118.47 at close (Nov 11, 4:00 PM EST) and 116.17 pre-market.\n\nWhich number do you write down as the last close?",
        outcome: "continue",
        choices: [
          { label: "118.47, stamped At close, with its date", next: "ttm" },
          { label: "116.17, because it is newer", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "Pre-market trading is thinner and is not the regular-session close. Write down the number and its time stamp.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      ttm: {
        message:
          "The income statement has a TTM column ending Sep 30, 2026 and an FY 2025 column ending Dec 31, 2025.\n\nWhat is TTM?",
        outcome: "continue",
        choices: [
          { label: "The last four reported quarters: the 12 months to Sep 30, 2026", next: "loss" },
          { label: "Calendar 2026 so far", next: "wrong_ttm" },
        ],
      },
      wrong_ttm: {
        message:
          "Trailing twelve months always covers four quarters. Read the Period Ending row before comparing columns.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "ttm",
      },
      loss: {
        message:
          "FY 2023 shows a net loss of 2,494 (millions), but operating income was positive and a goodwill impairment of 1,760 sits on its own row.\n\nWhat does that tell you?",
        outcome: "continue",
        choices: [
          { label: "A large non-cash write-down drove much of the loss; check the filing for why", next: "provider" },
          { label: "The mines stopped producing", next: "wrong_loss" },
        ],
      },
      wrong_loss: {
        message:
          "Revenue and operating income were still positive. Charges below operating income, like impairments, can turn profit into a loss on paper.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "loss",
      },
      provider: {
        message:
          "The Statistics footer says Data Source: S&P Global Market Intelligence, Last updated: Nov 12, 2026. Fair value fields say Upgrade.\n\nHow do you use the page?",
        outcome: "continue",
        choices: [
          { label: "Quote the free figures with the provider and date, and skip the paid fields", next: "success" },
          { label: "Find a way around the paywall", next: "wrong_provider" },
        ],
      },
      wrong_provider: {
        message:
          "Upgrade marks Pro-only fields. The free ratios, statements and filings are enough; never go behind a login you do not have.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "provider",
      },
      success: {
        message:
          "Session complete. Price and time stamp, period ending, one-time rows, provider and date. Stock Analysis is credited as a tool, not endorsed; Newmont is an example, not a recommendation.\n\nNext: Tool Training → StockAnalysis, its Learn quiz, and Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default stockAnalysisTourSession;

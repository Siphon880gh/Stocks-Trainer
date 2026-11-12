import type { CoachingSession } from "../types";

/** Tool training · Yahoo Finance: session labels, target ranges, Adj Close, mrq and provider footnotes. */
export const yahooFinanceTourSession: CoachingSession = {
  meta: {
    slug: "yahoo-finance-tour",
    title: "Read Yahoo Finance labels",
    summary:
      "Read Yahoo Finance's quote pages by their labels: which session a price belongs to, what an average target hides, why Adj Close differs from Close, and which provider stands behind a row.",
    topic: "Tool training",
    tags: ["sample", "tools", "research-tools"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE. Newmont's Summary on Nov 12, 2026 showed 118.47 at close (Nov 11), 115.56 pre-market, and Previous Close 119.96.\n\nWhat is 119.96?",
        outcome: "continue",
        choices: [
          { label: "The close of the session before Nov 11 (Nov 10)", next: "targets" },
          { label: "Today's opening price", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "Labels are relative to the last completed session. Historical Data confirms Nov 10 closed at 119.96.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      targets: {
        message:
          "Analyst Price Targets: low 70, average 135.39, high 165.\n\nWhat do you take from this?",
        outcome: "continue",
        choices: [
          { label: "Analysts disagree widely; the average hides the spread", next: "adj" },
          { label: "The stock is headed to 135.39", next: "wrong_targets" },
        ],
      },
      wrong_targets: {
        message:
          "A target is an opinion, and this range spans more than 90 dollars. The SEC says not to rely solely on analyst views.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "targets",
      },
      adj: {
        message:
          "Historical Data for Nov 28, 2025: Close 90.73, Adj Close 90.15. A 0.25 dividend row sits two days earlier.\n\nWhich column gives a return that includes dividends?",
        outcome: "continue",
        choices: [
          { label: "Adj Close, which adjusts older prices for later dividends", next: "footnotes" },
          { label: "Close", next: "wrong_adj" },
        ],
      },
      wrong_adj: {
        message:
          "Close is adjusted only for splits. Adj Close also adjusts for dividends and distributions.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "adj",
      },
      footnotes: {
        message:
          "Statistics shows Trailing P/E 13.92; the Summary showed 13.74. Footnotes credit several providers.\n\nHow do you quote the P/E?",
        outcome: "continue",
        choices: [
          { label: "With the page, the date and the source, knowing versions differ", next: "success" },
          { label: "Pick whichever supports my idea", next: "wrong_footnotes" },
        ],
      },
      wrong_footnotes: {
        message:
          "Different inputs and times give different versions. Quote one with its page, date and source, and compare like with like.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "footnotes",
      },
      success: {
        message:
          "Session complete. Session labels, target ranges, Adj Close for returns, and a source and date with every figure. Yahoo Finance is credited, not endorsed; Newmont is an example.\n\nNext: Tool Training → Yahoo Finance, its Learn quiz, and Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default yahooFinanceTourSession;

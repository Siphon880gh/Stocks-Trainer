import type { CoachingSession } from "../types";

/** Tool training · Finviz: screens are lists to research, filters for size and volume, time stamps, insider rows. */
export const finvizTourSession: CoachingSession = {
  meta: {
    slug: "finviz-tour",
    title: "Screen with Finviz, then check",
    summary:
      "Use Finviz's screener and snapshot the careful way: filter for size and volume, treat signals as lists, read the time stamp, and check insider and analyst rows against the filings.",
    topic: "Tool training",
    tags: ["sample", "tools", "research-tools"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE. On Nov 12, 2026, a Finviz screen for Industry = Gold returned 56 stocks, from $90 billion miners to a company worth about $10 million with zero volume.\n\nWhat do you do with the list?",
        outcome: "continue",
        choices: [
          { label: "Add Market Cap. and Average Volume filters, then research what remains", next: "signal" },
          { label: "Sort by Change % and buy the top row", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "The biggest movers are often the smallest, least-traded stocks, which SEC Investor.gov says are more open to manipulation. A screen is a list to research.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      signal: {
        message:
          "The Oversold signal lists a stock after a sharp two-week fall (RSI(14)). Finviz's help says oversold may be a buying opportunity.\n\nHow do you read that?",
        outcome: "continue",
        choices: [
          { label: "As the tool's description; check the news for why it fell before anything else", next: "stamp" },
          { label: "As a recommendation to buy", next: "wrong_signal" },
        ],
      },
      wrong_signal: {
        message:
          "Tools are credited, not endorsed. A signal says the price moved; the news and financials say why, and a lower outlook can keep it falling.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "signal",
      },
      stamp: {
        message:
          "Newmont's header shows 115.56, stamped 8:25 AM ET, with Prev Close 118.47.\n\nWhat is 115.56?",
        outcome: "continue",
        choices: [
          { label: "A pre-market price; the regular session opens at 9:30 AM ET", next: "insider" },
          { label: "Yesterday's close", next: "wrong_stamp" },
        ],
      },
      wrong_stamp: {
        message:
          "Prev Close is the close. Before the open, the header shows early trading, and free quotes are delayed.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "stamp",
      },
      insider: {
        message:
          "The insider table shows an officer's Proposed Sale and Sale of 8,060 shares on the same day.\n\nHow many shares were sold?",
        outcome: "continue",
        choices: [
          { label: "8,060: a Form 144 notice and a Form 4 for one sale", next: "success" },
          { label: "16,120: two sales", next: "wrong_insider" },
        ],
      },
      wrong_insider: {
        message:
          "Form 144 gives notice of a proposed sale; Form 4 reports it once done. Same shares, same day, one trade.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "insider",
      },
      success: {
        message:
          "Session complete. Filter for size and volume, treat signals as lists, read the time stamp, and confirm insider and analyst claims in the filings. Finviz is credited, not endorsed; tickers named are examples.\n\nNext: Tool Training → Finviz, its Learn quiz, and Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default finvizTourSession;

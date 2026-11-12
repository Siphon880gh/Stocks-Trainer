import type { CoachingSession } from "../types";

/** Tool training · Market Forces: theme connection, exposure badges, primary sources first, index-weight snapshots. */
export const marketForcesTourSession: CoachingSession = {
  meta: {
    slug: "market-forces-tour",
    title: "Tour Market Forces",
    summary:
      "Use Weng's ticker directory the way it was built: read the theme's connection line, read each exposure badge, walk a stock's five research-link groups (financials and filings before news, valuation and sentiment), and check snapshot dates on index weights.",
    topic: "Tool training",
    tags: ["sample", "tools", "research-tools"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. A headline says gold is rallying. You open Market Forces → Gold and see GLD, IAU, GDX, NEM and B.\n\nWhat does the theme's connection line tell you?",
        outcome: "continue",
        choices: [
          { label: "Which forces to watch (real rates, the dollar, central-bank demand); not which way prices will go", next: "badge" },
          { label: "That every ticker in the list will rise with gold", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "Market Forces says it on the page: a theme suggests a connection, not a guaranteed price direction. Miners also carry business and operating risk.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      badge: {
        message:
          "GLD's badge says Bullion; GDX's says Mining stocks.\n\nWhat is the difference?",
        outcome: "continue",
        choices: [
          { label: "GLD holds metal in a trust; GDX holds a basket of mining businesses", next: "links" },
          { label: "No difference; both are gold", next: "wrong_badge" },
        ],
      },
      wrong_badge: {
        message:
          "Same theme, different exposure. The badge is the first fact to read: metal, businesses, futures contracts or a currency trust all behave differently.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "badge",
      },
      links: {
        message:
          "You select NEM, a stock. The panel has five groups: Overview & analysis, Financials & primary sources, Valuation & distributions, News & the next catalyst, and Sentiment & investor discussions.\n\nWhich order makes sense?",
        outcome: "continue",
        choices: [
          { label: "Financials and SEC filings first, then news and valuation, then sentiment, cross-checked against the filings", next: "weights" },
          { label: "Sentiment first; if people are excited, buy", next: "wrong_links" },
        ],
      },
      wrong_links: {
        message:
          "SEC Investor.gov warns that social media can give a false impression of consensus. Primary sources first; opinion last.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "links",
      },
      weights: {
        message:
          "In Index weights, CAT shows about 9.23% of the Dow but 0.55% of the S&P 500 (ETF-based estimates, Oct 8, 2026). Another site shows different numbers today.\n\nWhat do you check?",
        outcome: "continue",
        choices: [
          { label: "The snapshot dates and the quality label, and remember the Dow is price-weighted", next: "success" },
          { label: "Assume Market Forces is broken", next: "wrong_weights" },
        ],
      },
      wrong_weights: {
        message:
          "The weights are dated estimates read from fund holdings, because official files are licensed. Holdings change daily, so compare like with like.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "weights",
      },
      success: {
        message:
          "Session complete. Theme → badge → the five stock groups (primary sources, then news and valuation, then sentiment), then a dated note. Market Forces is a starting point with no live prices and no picks.\n\nNext: Tool Training → Market Forces, the Learn quiz, and Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default marketForcesTourSession;

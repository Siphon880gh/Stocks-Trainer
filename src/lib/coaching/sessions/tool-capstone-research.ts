import type { CoachingSession } from "../types";

/** Tool training capstone: one ticker through four tools, cross-checks explained, filing confirmed, rule decides. */
export const toolCapstoneResearchSession: CoachingSession = {
  meta: {
    slug: "tool-capstone-research",
    title: "One ticker, four tools",
    summary:
      "Research Newmont across Market Forces, StockAnalysis, Finviz and Yahoo Finance: start from exposure, explain gaps between sites, confirm in the filing, and let a written rule decide.",
    topic: "Tool training",
    tags: ["sample", "tools", "research-tools"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE. You want to research Newmont (NEM). Four tools are open.\n\nWhere do you start?",
        outcome: "continue",
        choices: [
          { label: "Market Forces: the exposure badge (Gold miner) and theme connection", next: "gap" },
          { label: "The analyst target on whichever site is highest", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "Start with what you would own. A miner is a business with costs and output, not the metal; that decides which facts matter.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      gap: {
        message:
          "On Nov 12, 2026, P/E read 13.79 (StockAnalysis), 13.42 (Finviz, 8:25 AM ET), 13.74 and 13.92 (two Yahoo pages). EPS read about 8.6 everywhere.\n\nHow do you explain the gap?",
        outcome: "continue",
        choices: [
          { label: "Mostly the price used and when; pick one consistent source and note it", next: "definition" },
          { label: "Finviz is the bargain site", next: "wrong_gap" },
        ],
      },
      wrong_gap: {
        message:
          "The company is the same on every site. With EPS in agreement, the price input (pre-market vs close) does most of the work.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "gap",
      },
      definition: {
        message:
          "Employees read 17,500 on two sites and 44,100 on Finviz.\n\nWhat now?",
        outcome: "continue",
        choices: [
          { label: "Treat it as a definition gap and read the company's own figure in its 10-K", next: "rule" },
          { label: "Average them", next: "wrong_definition" },
        ],
      },
      wrong_definition: {
        message:
          "A gap that large is not rounding. The primary source, the filing on SEC EDGAR, settles what the company reports.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "definition",
      },
      rule: {
        message:
          "Your note's rule: no new position within three trading days of earnings. All three data sites list earnings in two days.\n\nWhat do you do?",
        outcome: "continue",
        choices: [
          { label: "Wait, add the date to the note, and revisit after the report", next: "success" },
          { label: "Buy now; the research is done", next: "wrong_rule" },
        ],
      },
      wrong_rule: {
        message:
          "The tools gave you the date; the written rule decides. Breaking it the first time it costs you something makes it a wish, not a rule.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "rule",
      },
      success: {
        message:
          "Capstone complete. Exposure, reported facts, screens and opinions, the filing, then a dated note with a rule. The four tools are credited, not endorsed; Newmont is an example, not a recommendation.\n\nNext: Tool Training → Capstone, its Learn quiz, and Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default toolCapstoneResearchSession;

import type { CoachingSession } from "../types";

/** Statements / snapshot reasoning (SAMPLE cards — not live filings). */
export const statementSnapshotSession: CoachingSession = {
  meta: {
    slug: "statement-snapshot",
    title: "Read a SAMPLE company snapshot",
    summary:
      "Practice profit vs cash, margin, and P/E humility before trusting a headline number.",
    topic: "Financial statements",
    tags: ["equities", "statements", "snapshot", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE snapshot: revenue up, net income up, but operating cash flow down sharply.\n\nWhat do you check first?",
        outcome: "continue",
        choices: [
          {
            label: "Treat rising net income as proof the business is healthy",
            next: "wrong_income_only",
          },
          {
            label: "Ask why cash diverged from profit before celebrating earnings",
            next: "cash_check",
          },
          {
            label: "Ignore cash and buy because P/E looks cheap vs peers",
            next: "wrong_pe_only",
          },
        ],
      },
      wrong_income_only: {
        message:
          "Net income can rise while cash weakens (receivables, inventory, one-offs). Process starts with cash vs profit, not celebration.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_pe_only: {
        message:
          "Cheap P/E without cash context is a trap—multiples need a durable earnings base.\n\nReturn to the first check.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      cash_check: {
        message:
          "Cash lagged profit. Margin also compressed slightly.\n\nHow do you use that for a decide-and-reveal stance?",
        outcome: "continue",
        choices: [
          {
            label: "Buy immediately — revenue growth cures everything",
            next: "wrong_revenue_cure",
          },
          {
            label: "Hold or fade until cash quality improves or the debrief explains the gap",
            next: "success",
          },
        ],
      },
      wrong_revenue_cure: {
        message:
          "Revenue growth does not automatically repair cash quality. Theory application wants humility on the gap.\n\nRevisit the stance choice.",
        outcome: "wrong",
        choices: [],
        rewind_to: "cash_check",
      },
      success: {
        message:
          "Session complete. You prioritized cash vs profit and avoided P/E-only shortcuts.\n\nNext: Training → Statements Literacy / financial-drills, then earnings cases.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default statementSnapshotSession;

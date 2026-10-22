/** BA10.M3: Learn quiz groups added by the Beginner Academy. Ids only (no quizData import), like macro/quiz/groups.ts. */
export const ACADEMY_QUIZ_GROUP_IDS = ["orders-and-fills", "paper-pnl", "options-ladder"] as const;
export type AcademyQuizGroupId = (typeof ACADEMY_QUIZ_GROUP_IDS)[number];

export const ACADEMY_QUIZ_GROUP_META: Record<AcademyQuizGroupId, { label: string; description: string; icon: string; prefix: string }> = {
  "orders-and-fills": { label: "Orders & Fills", description: "Where market, limit, stop, stop-limit and trailing-stop orders fill on SAMPLE bars (Beginner Academy)", icon: "receipt_long", prefix: "BA-OF-" },
  "paper-pnl": { label: "Paper P&L", description: "Cost basis, realised vs unrealised P&L, equity, drawdown and sizing with virtual money (Beginner Academy)", icon: "account_balance_wallet", prefix: "BA-PL-" },
  "options-ladder": { label: "Options Ladder", description: "Payoff at expiration, breakevens and max gain / loss from SAMPLE premiums (Beginner Academy)", icon: "stacked_line_chart", prefix: "BA-OL-" },
};

export const isAcademyQuizGroup = (id: string): id is AcademyQuizGroupId => (ACADEMY_QUIZ_GROUP_IDS as readonly string[]).includes(id);

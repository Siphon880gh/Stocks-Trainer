/**
 * The pattern day trader (PDT) rule and FINRA's intraday margin standards that replace it. Facts from FINRA
 * Regulatory Notice 26-10 and FINRA's investor insight (April 2026). Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";

export const PDT_FACTS = {
  secApproval: "2026-04-14",
  effective: "2026-06-04",
  transitionEnds: "2027-10-20",
  oldMinimumEquity: 25_000,
  marginMinimumEquity: 2_000,
  maintenancePct: 25,
  restrictionDays: 90,
  sources: [
    { label: "FINRA Regulatory Notice 26-10", url: "https://www.finra.org/rules-guidance/notices/26-10" },
    { label: "FINRA: Intraday margin requirements (investor insight, Apr 2026)", url: "https://www.finra.org/investors/insights/intraday-margin-requirements" },
    { label: "FINRA: Day trading", url: "https://www.finra.org/investors/investing/investment-products/stocks/day-trading" },
  ],
} as const;

/** One-paragraph summary shared by the pages and the glossary. */
export const PDT_SUMMARY =
  "Old rule: a margin account that made four or more day trades in five business days (when they were more than 6% of its trades) was flagged a \"pattern day trader\" and needed at least $25,000 in equity to keep day trading. New rule: FINRA's intraday margin standards replace the PDT rules in full. There is no $25,000 minimum and no PDT flag from counting trades; instead your firm checks margin during the day (25% maintenance), and an intraday margin deficit must be met promptly. Repeatedly failing to meet deficits can restrict the account for up to 90 days. Leveraged (margin) trading still needs at least $2,000 in equity. The SEC approved the change on April 14, 2026; it took effect June 4, 2026, and brokers have until October 20, 2027 to switch, so yours may still apply the old PDT rule until it converts, and any broker can set stricter house rules.";

export const PDT_TERMS: LiteracyTerm[] = [
  {
    id: "pattern-day-trader",
    name: "Pattern day trader (PDT) rule",
    category: "position",
    summary: "The old FINRA rule: four or more day trades in five business days in a margin account meant a $25,000 minimum equity. Being replaced by intraday margin standards (effective June 4, 2026; brokers switch by October 20, 2027).",
    detail: `${PDT_SUMMARY} Educational, not advice.`,
  },
  {
    id: "intraday-margin",
    name: "Intraday margin standards",
    category: "position",
    summary: "FINRA's replacement for the PDT rule: margin is checked during the day, not just at the close, with no $25,000 minimum and no trade count.",
    detail:
      "Maintenance margin (25%) applies throughout the day. If your positions dip below it intraday, you have an intraday margin deficit to meet promptly; a practice of not meeting deficits by the fifth business day can restrict the account for up to 90 days. A small deficit (the lesser of 5% of equity or $1,000) is treated as de minimis. Firms may monitor in real time or with an end-of-day calculation. Educational, not advice.",
  },
];

type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId: string): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, glossaryTermId };
}

export const PDT_QUESTIONS: QuizQuestion[] = [
  mc("PDT-01", "Under the old PDT rule, what did a margin account flagged as a pattern day trader need?", "B", "At least $25,000 in equity to keep day trading",
    ["$2,000 in a cash account", "No minimum at all", "A broker's written permission for each trade"],
    "Four or more day trades in five business days triggered the flag and the $25,000 minimum.", "pattern-day-trader"),
  mc("PDT-02", "What replaces the PDT rule?", "C", "FINRA intraday margin standards: margin is checked during the day, with no $25,000 minimum and no trade count",
    ["Nothing: day trading is unregulated now", "A $50,000 minimum", "A ban on day trading in margin accounts"],
    "The SEC approved FINRA's change on April 14, 2026; it took effect June 4, 2026.", "intraday-margin"),
  mc("PDT-03", "It's October 2026. Can your broker still apply the old PDT rule?", "A", "Yes: brokers have until October 20, 2027 to switch, and can set stricter house rules",
    ["No: it ended everywhere on June 4, 2026", "Only for crypto", "Only on Fridays"],
    "The transition runs through October 20, 2027. Check your own broker's rules.", "pattern-day-trader"),
  mc("PDT-04", "Under the new standards, what happens if you repeatedly fail to meet intraday margin deficits?", "D", "The account can be restricted for up to 90 days",
    ["Nothing", "The account is closed permanently", "You are flagged as a pattern day trader"],
    "Deficits should be met promptly; a practice of missing them by the fifth business day can bring a restriction of up to 90 days.", "intraday-margin"),
  mc("PDT-05", "What is still the minimum equity to trade on margin (with leverage)?", "B", "$2,000",
    ["$25,000", "$0", "$500"],
    "You can trade with less than $2,000 in a margin account, but without leverage: only with the cash you have.", "intraday-margin"),
];

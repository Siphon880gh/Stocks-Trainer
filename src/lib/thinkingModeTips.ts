import type { CaseThinkingMode } from "./caseStudies";

export const THINKING_MODE_LABELS: Record<CaseThinkingMode, string> = {
  beat_miss: "Beat or miss",
  margin_compression: "Shrinking margins",
  cash_flow_red_flag: "Profit without cash",
  guidance_cut: "Weaker outlook",
  balance_sheet_stress: "Too much debt",
  momentum_chase_vs_fade: "Chase or wait",
  company_headline: "Company news",
  risk_off: "Market mood",
  macro_print: "Macro setup",
  geopolitics_supply: "Supply shock",
  combined_earnings_headline: "Earnings plus news",
  combined_rumor_filing: "Rumor vs filing",
};

export const COACH_TIP_BY_THINKING_MODE: Record<CaseThinkingMode, string> = {
  beat_miss:
    "Compare the report to what people already expected. A profitable company can still miss.",
  margin_compression:
    "Ask why the company keeps less profit on each sale: mix, costs, or weaker pricing.",
  cash_flow_red_flag:
    "Profit on paper with weak cash is a warning. Check cash flow before you buy the dip.",
  guidance_cut:
    "A lower outlook resets the story. Hold only if your thesis still works with the new numbers.",
  balance_sheet_stress:
    "Debt and cash set how bad a miss can get. Shareholders are last in line.",
  momentum_chase_vs_fade:
    "Are you early to a real trend, or late to a crowd? Waiting is a valid choice.",
  company_headline:
    "Separate a shocking headline from a real change in cash. Decide your time frame first.",
  risk_off:
    "When the whole market sells off, ask if this stock is the story or just along for the ride.",
  macro_print:
    "Map the data to interest rates and growth, then to how sensitive this stock is.",
  geopolitics_supply:
    "A supply shock can help producers and hurt buyers. Name which side you are on.",
  combined_earnings_headline:
    "Match the filing facts to the headline. A different time frame can earn partial credit.",
  combined_rumor_filing:
    "Rumor vs filed fact. If they disagree, size for uncertainty.",
};

export function thinkingModeLabel(mode: CaseThinkingMode): string {
  return THINKING_MODE_LABELS[mode];
}

export function coachTipForThinkingMode(mode: CaseThinkingMode): string {
  return COACH_TIP_BY_THINKING_MODE[mode];
}

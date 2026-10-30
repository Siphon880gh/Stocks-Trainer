import type { CaseThinkingMode } from "./caseStudies";

export const THINKING_MODE_LABELS: Record<CaseThinkingMode, string> = {
  beat_miss: "Beat or miss",
  margin_compression: "Shrinking margins",
  cash_flow_red_flag: "Profit without cash",
  guidance_cut: "Weaker outlook",
  balance_sheet_stress: "Too much debt",
  momentum_chase_vs_fade: "Chase or wait",
  company_headline: "Company news",
  short_vs_sell: "Short vs sell",
  risk_off: "Market mood",
  macro_print: "Macro setup",
  geopolitics_supply: "Supply shock",
  combined_earnings_headline: "Earnings plus news",
  combined_rumor_filing: "Rumor vs filing",
  price_action_plan: "Price action plan",
  opening_range: "Opening range",
  four_pillars: "Map, confirm, invalidate, context",
  fair_value_gap: "Breakout, pullback, gap",
};

export const COACH_TIP_BY_THINKING_MODE: Record<CaseThinkingMode, string> = {
  beat_miss:
    "Compare the report to what people already expected. A profitable company can still miss. Cases → earnings.",
  margin_compression:
    "Ask why the company keeps less profit on each sale: mix, costs, or weaker pricing. Cases → earnings.",
  cash_flow_red_flag:
    "Profit on paper with weak cash is a warning. Check cash flow before you buy the dip. Cases → earnings.",
  guidance_cut:
    "A lower outlook resets the story. Hold only if your thesis still works with the new numbers. Cases → earnings.",
  balance_sheet_stress:
    "Debt and cash set how bad a miss can get. Shareholders are last in line. Cases → earnings.",
  momentum_chase_vs_fade:
    "Are you early to a real trend, or late to a crowd? Waiting is a valid choice. Cases → company news.",
  company_headline:
    "Separate a shocking headline from a real change in cash. Decide your time frame first. Cases → company news.",
  short_vs_sell:
    "Sell exits a long you already have. Short is a new bet that price falls. Do not short a rumor. Cases → company news.",
  risk_off:
    "When the whole market sells off, ask if this stock is the story or just along for the ride. Cases → market-wide news.",
  macro_print:
    "Map the data to interest rates and growth, then to how sensitive this stock is. Cases → market-wide news.",
  geopolitics_supply:
    "A supply shock can help producers and hurt buyers. Name which side you are on. Cases → market-wide news.",
  combined_earnings_headline:
    "Match the filing facts to the headline. A different time frame can earn partial credit. Cases → news plus financials.",
  combined_rumor_filing:
    "Rumor vs filed fact. If they disagree, size for uncertainty. Cases → news plus financials.",
  price_action_plan:
    "Trade what's happening, not what you think will happen: enter from an edge, stop where the idea is wrong, trail under higher lows, take profit when reward no longer justifies risk. Cases → price action trades.",
  opening_range:
    "Mark the first 30 minutes, wait for a 15-minute close outside it, stop at the other end, 1:1 on the underlying. A wick is not a close, and a wide range means smaller size or no trade. Cases → price action trades.",
  four_pillars:
    "Map the level, wait for the confirmation you chose in advance (a close, not a wick), know the invalidation price before entry, then let context set the size: full, half or pass. Cases → price action trades.",
  fair_value_gap:
    "The breakout candle is a signal, not an entry. Check for a gap between candle 1's high and candle 3's low, buy only a pullback into it, stop below the gap and the level. Some gaps are never retested: a missed trade is the cost of waiting. Cases → price action trades.",
};

export function thinkingModeLabel(mode: CaseThinkingMode): string {
  return THINKING_MODE_LABELS[mode];
}

export function coachTipForThinkingMode(mode: CaseThinkingMode): string {
  return COACH_TIP_BY_THINKING_MODE[mode];
}

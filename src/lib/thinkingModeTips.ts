import type { CaseThinkingMode } from "./caseStudies";

/** Short terminal-tone coach tips per thinking mode (E5.M6.S2). */
export const COACH_TIP_BY_THINKING_MODE: Record<CaseThinkingMode, string> = {
  beat_miss:
    "Size the surprise vs what was priced. Beat + cut guide ≠ automatic buy.",
  margin_compression:
    "Ask whether margin pressure is mix, cost, or pricing power — then size.",
  cash_flow_red_flag:
    "Profit without cash is a process smell. Trace working capital before you chase.",
  guidance_cut:
    "Guide cuts reset the forward path. Hold only if your thesis survives the new band.",
  balance_sheet_stress:
    "Liquidity and leverage set the downside floor. Equity is residual.",
  momentum_chase_vs_fade:
    "Decide if you are early to a trend or late to a crowd. Fade needs a catalyst.",
  company_headline:
    "Separate headline shock from durable cash-flow change. Horizon first.",
  risk_off:
    "When beta dumps, ask if the name is the story or just collateral damage.",
  macro_print:
    "Map the print to rates / growth / risk appetite — then to this equity’s beta.",
  geopolitics_supply:
    "Supply shocks hit margins and multiples differently. Name the channel.",
  combined_earnings_headline:
    "Reconcile filing facts with the headline narrative. Horizon mismatch → partial.",
  combined_rumor_filing:
    "Rumor vs filed fact. If ranges diverge, size for uncertainty, not certainty.",
};

export function coachTipForThinkingMode(mode: CaseThinkingMode): string {
  return COACH_TIP_BY_THINKING_MODE[mode];
}

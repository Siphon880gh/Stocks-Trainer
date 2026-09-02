/**
 * Light chart appearance modeled on retail trading platforms
 * (TradingView / Thinkorswim / broker terminals) — not the app chrome.
 */
export const CHART = {
  bg: "#ffffff",
  pane: "#f8f9fd",
  grid: "#e0e3eb",
  border: "#d1d4dc",
  text: "#131722",
  textMuted: "#787b86",
  axis: "#9598a1",
  up: "#089981",
  down: "#f23645",
  sma: "#2962ff",
  ema: "#ff6d00",
  bb: "#787b86",
  rsi: "#7b1fa2",
  macd: "#2962ff",
  signal: "#ff6d00",
  highlight: "#2962ff",
  overbought: "#f23645",
  oversold: "#089981",
  tooltipBg: "#ffffff",
  tooltipBorder: "#d1d4dc",
  font: '"Trebuchet MS", "Segoe UI", sans-serif',
} as const;

export const chartPaneClass =
  "chart-pane normal-case overflow-hidden rounded-sm border border-[#d1d4dc] bg-white text-[#131722]";

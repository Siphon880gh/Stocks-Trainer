import type { WalkthroughStep } from "../../../tourProgress";

/** Guided walkthrough of the paper desk (targets are data-tour attributes in DeskSession). */
export const DESK_TOUR: WalkthroughStep[] = [
  { id: "desk-lesson", title: "What this scenario teaches", body: "Every scenario teaches one idea. Read the lesson and the goals first: they are about process (stops, size, timing), not profit.", target: "desk-lesson" },
  { id: "desk-clock", title: "The replay clock", body: "Time only moves when you press Next day, +5 days or Play. You see bars, news and filings up to today's close, never anything later.", target: "desk-clock" },
  { id: "desk-watchlist", title: "Watchlist", body: "Every symbol shares one clock and one account. Click a row to chart it and trade it. The change column is today versus the prior close.", target: "desk-watchlist" },
  { id: "desk-chart", title: "Chart with your executions", body: "B and S circles are your fills, dashed lines are working orders, and vertical lines mark news days. Gaps happen between one close and the next open.", target: "desk-chart" },
  { id: "desk-ticket", title: "Order ticket", body: "Market, limit, stop, stop-limit and trailing-stop orders, plus brackets (entry with a stop and a target). Orders placed now are checked against the next day.", target: "desk-ticket" },
  { id: "desk-sizing", title: "Position sizing", body: "Size from the stop: shares = money at risk ÷ (entry − stop). Use the result to fill the ticket with a bracket in one click.", target: "desk-sizing" },
  { id: "desk-account", title: "Account manager", body: "Positions, working orders, fill history, closed trades with their R multiple, and the equity curve. Flatten closes a whole position at the next open.", target: "desk-account" },
  { id: "desk-research", title: "News and financials", body: "Headlines and statements unlock on the day they were published. Read them before the gap, then decide your size.", target: "desk-research" },
  { id: "desk-goals", title: "Goals and the debrief", body: "Goals update as you trade. When the replay ends, the debrief shows what the news and filings signalled, what a disciplined trade looked like, and journal questions.", target: "desk-goals" },
];

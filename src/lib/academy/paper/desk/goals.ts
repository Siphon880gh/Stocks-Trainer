/**
 * Scenario goals (process goals, not profit targets) evaluated from the action log and the replayed account.
 * "pending" = not decided yet (the replay has not reached the bar, or the goal is judged at the end).
 */
import { maxDrawdown, roundTrips } from "../stats";
import { equity } from "../account";
import { lastBarOf } from "./scenarios";
import { replayDesk } from "./session";
import type { AccountState } from "../types";
import type { DeskGoal, DeskLog, DeskScenario } from "./types";

export type GoalStatus = "met" | "missed" | "pending";

export interface GoalResult {
  goal: DeskGoal;
  status: GoalStatus;
  detail: string;
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export function evaluateGoals(scenario: DeskScenario, log: DeskLog, state: AccountState = replayDesk(log, scenario)): GoalResult[] {
  const ended = log.bar >= lastBarOf(scenario);
  const trips = roundTrips(state);
  return (scenario.goals ?? []).map((goal): GoalResult => {
    switch (goal.kind) {
      case "stopOnEntries": {
        const bare = trips.filter((t) => t.stopAtEntry === null);
        if (!trips.length) return { goal, status: ended ? "met" : "pending", detail: "No entries yet." };
        return bare.length ? { goal, status: "missed", detail: `${bare.length} of ${trips.length} entries had no stop working at the end of their first day.` } : { goal, status: ended ? "met" : "pending", detail: `All ${trips.length} entries had a stop.` };
      }
      case "maxRiskPct": {
        const limit = (state.startingCash * goal.pct) / 100;
        const over = trips.filter((t) => t.stopAtEntry === null || Math.abs(t.entryPrice - t.stopAtEntry) * t.entryQty > limit + 1);
        if (!trips.length) return { goal, status: ended ? "met" : "pending", detail: "No entries yet." };
        return over.length ? { goal, status: "missed", detail: `${over.length} entr${over.length === 1 ? "y" : "ies"} risked more than ${goal.pct}% (or had no stop to define the risk).` } : { goal, status: ended ? "met" : "pending", detail: `Every entry risked ${goal.pct}% or less.` };
      }
      case "maxDrawdown": {
        const dd = maxDrawdown(state.equityCurve).pct;
        if (dd * 100 >= goal.pct) return { goal, status: "missed", detail: `Drawdown reached ${pct(dd)}.` };
        return { goal, status: ended ? "met" : "pending", detail: `Drawdown so far ${pct(dd)}.` };
      }
      case "flatAt": {
        if (log.bar < goal.bar) return { goal, status: "pending", detail: "That day has not closed yet." };
        const at = replayDesk({ ...log, bar: goal.bar, actions: log.actions.filter((a) => a.atBar <= goal.bar) }, scenario);
        const open = Object.entries(at.positions).filter(([sym, p]) => p.qty !== 0 && (!goal.symbol || sym === goal.symbol));
        return open.length ? { goal, status: "missed", detail: `Still holding ${open.map(([s2, p]) => `${p.qty} ${s2}`).join(", ")} at that close.` } : { goal, status: "met", detail: "Flat at that close." };
      }
      case "positive": {
        const e = equity(state);
        if (!ended) return { goal, status: "pending", detail: `Equity now ${e >= state.startingCash ? "at or above" : "below"} the start.` };
        return e >= state.startingCash ? { goal, status: "met", detail: "Finished at or above the starting equity." } : { goal, status: "missed", detail: "Finished below the starting equity." };
      }
      case "usedType": {
        const used = state.orders.some((o) => o.type === goal.type && o.status !== "rejected");
        return used ? { goal, status: "met", detail: `Used a ${goal.type} order.` } : { goal, status: ended ? "missed" : "pending", detail: `No ${goal.type} order yet.` };
      }
      case "maxTrades": {
        if (trips.length > goal.n) return { goal, status: "missed", detail: `${trips.length} trades.` };
        return { goal, status: ended ? "met" : "pending", detail: `${trips.length} trade${trips.length === 1 ? "" : "s"} so far.` };
      }
      case "traded": {
        const did = state.fills.some((f) => !goal.symbol || f.symbol === goal.symbol);
        return did ? { goal, status: "met", detail: "Traded." } : { goal, status: ended ? "missed" : "pending", detail: "No fill yet." };
      }
    }
  });
}

export const DEFAULT_PROMPTS = [
  "What did you expect to happen when you took your first trade, and what actually happened?",
  "Which headline or filing line mattered most, and when did you first see it?",
  "Where was your stop, and did you size from it?",
  "What will you do differently next time?",
];

/**
 * Badge counters for the paper account. `PaperStore.stats` holds the totals of archived sessions; the live
 * session's counters are computed from its replayed state and added on top (and folded in on reset).
 */
import type { AccountState } from "./types";
import type { PaperStore } from "../storage";
import { roundTrips } from "./stats";
import { replay } from "./session";

export type PaperCounters = PaperStore["stats"];

export const ZERO_COUNTERS: PaperCounters = { orders: 0, limitFills: 0, trailingExits: 0, stopProtectedTrades: 0, stopLimitNoFills: 0 };

export function countersFor(s: AccountState): PaperCounters {
  return {
    orders: s.orders.filter((o) => o.status !== "rejected").length,
    limitFills: s.orders.filter((o) => o.type === "limit" && o.status === "filled").length,
    trailingExits: s.orders.filter((o) => o.type === "trailing-stop" && o.status === "filled").length,
    stopProtectedTrades: roundTrips(s).filter((t) => t.closed && t.stopAtEntry !== null).length,
    stopLimitNoFills: s.orders.filter((o) => o.type === "stop-limit" && o.triggered && o.status !== "filled").length,
  };
}

export const addCounters = (a: PaperCounters, b: PaperCounters): PaperCounters => ({
  orders: a.orders + b.orders,
  limitFills: a.limitFills + b.limitFills,
  trailingExits: a.trailingExits + b.trailingExits,
  stopProtectedTrades: a.stopProtectedTrades + b.stopProtectedTrades,
  stopLimitNoFills: a.stopLimitNoFills + b.stopLimitNoFills,
});

/** Archived totals + the live session (+ BA11.M6 the other portfolios' sessions). A broken log counts as zero rather than crashing badges. */
export function totalCounters(p: PaperStore): PaperCounters {
  const sessions = [p.session, ...(p.otherPortfolios ?? []).map((o) => o.session)];
  return sessions.reduce<PaperCounters>((acc, s) => {
    if (!s) return acc;
    try {
      return addCounters(acc, countersFor(replay(s)));
    } catch {
      return acc;
    }
  }, p.stats);
}

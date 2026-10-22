/**
 * Paper sessions are persisted as an action log (place / cancel at a bar) and rebuilt by replaying the log
 * through the deterministic engine, so a reload restores exactly the same state.
 */
import type { AccountState, OrderSpec, PaperAction, PaperSessionLog } from "./types";
import { createAccount } from "./account";
import { cancelOrder, contextFrom, placeOrder, stepBar, type PlaceResult } from "./engine";
import { getTape, type Tape } from "./tapes";

export function newSessionLog(tapeId: string, startingCash: number, bar = 0): PaperSessionLog {
  return { tapeId, startingCash, bar, actions: [] };
}

/** First bar the learner sees when a session starts (a few bars of history give context). */
export const START_BAR = 10;

export function replay(log: PaperSessionLog, tape: Tape | undefined = getTape(log.tapeId)): AccountState {
  if (!tape) throw new Error(`unknown tape ${log.tapeId}`);
  const start = Math.min(START_BAR, tape.bars.length - 1);
  const first = log.actions.length ? Math.min(start, ...log.actions.map((a) => a.atBar)) : start;
  const from = Math.min(first, log.bar);
  let s = createAccount(log.startingCash, { [tape.symbol]: tape.bars[from]!.close }, from);
  const last = Math.min(log.bar, tape.bars.length - 1);
  for (let b = from; b <= last; b++) {
    for (const a of log.actions.filter((x) => x.atBar === b)) s = applyAction(s, a, tape);
    if (b < last) s = stepBar(s, { [tape.symbol]: tape.bars[b + 1]! });
  }
  return s;
}

function applyAction(s: AccountState, a: PaperAction, _tape: Tape): AccountState {
  if (a.type === "cancel") return cancelOrder(s, a.orderId);
  return placeOrder(s, a.spec, contextFrom(s)).state;
}

/** Place an order in a session: appends to the log and returns the new log + engine result. */
export function sessionPlace(log: PaperSessionLog, spec: OrderSpec): { log: PaperSessionLog; result: PlaceResult } {
  const before = replay(log);
  const result = placeOrder(before, spec, contextFrom(before));
  return { log: { ...log, actions: [...log.actions, { type: "place", atBar: log.bar, spec }] }, result };
}

export const sessionCancel = (log: PaperSessionLog, orderId: string): PaperSessionLog => ({ ...log, actions: [...log.actions, { type: "cancel", atBar: log.bar, orderId }] });

/** Step forward n bars (bounded by the tape length). */
export function sessionStep(log: PaperSessionLog, n = 1): PaperSessionLog {
  const tape = getTape(log.tapeId)!;
  return { ...log, bar: Math.min(tape.bars.length - 1, log.bar + n) };
}

export const visibleBars = (log: PaperSessionLog) => getTape(log.tapeId)!.bars.slice(0, log.bar + 1);

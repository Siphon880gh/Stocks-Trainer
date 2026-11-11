/**
 * Paper desk sessions: the same action-log + deterministic engine as /paper (engine.ts fill rules), with one
 * account across every symbol of a scenario. Each step evaluates working orders against the next bar of every symbol.
 */
import type { AccountState, OrderSpec, PaperAction, PaperBar, PaperOptions } from "../types";
import { createAccount } from "../account";
import { cancelOrder, contextFrom, placeOrder, stepBar, type PlaceResult } from "../engine";
import { placeBracket, type LinkedResult } from "../linked";
import { DESK_START_BAR, getDeskScenario, lastBarOf } from "./scenarios";
import type { DeskLog, DeskScenario } from "./types";

export function newDeskLog(scenarioId: string, startingCash: number, options?: PaperOptions, bar = DESK_START_BAR): DeskLog {
  const s = getDeskScenario(scenarioId);
  if (!s) throw new Error(`unknown desk scenario ${scenarioId}`);
  const on = options && Object.values(options).some(Boolean);
  return { scenarioId, startingCash, bar: Math.min(bar, lastBarOf(s)), actions: [], active: s.symbols[0]!.symbol, ...(on ? { options: { ...options } } : {}) };
}

const barsAt = (s: DeskScenario, i: number): Record<string, PaperBar> => Object.fromEntries(s.symbols.map((x) => [x.symbol, x.bars[i]!]));
const closesAt = (s: DeskScenario, i: number): Record<string, number> => Object.fromEntries(s.symbols.map((x) => [x.symbol, x.bars[i]!.close]));

function apply(st: AccountState, a: PaperAction): AccountState {
  if (a.type === "cancel") return cancelOrder(st, a.orderId);
  if (a.type === "bracket") return placeBracket(st, a.entry, a.stopPrice, a.targetPrice, contextFrom(st)).state;
  if (a.type === "place") return placeOrder(st, a.spec, contextFrom(st)).state;
  return st;
}

export interface DeskDividendCredit {
  symbol: string;
  bar: number;
  qty: number;
  cents: number;
  /** Cash credited (negative for a short, which pays the dividend). */
  amount: number;
}

/** Replays the log and also lists every dividend credited on an ex-date (holders at the prior close). */
export function replayDeskDetailed(log: DeskLog, scenario: DeskScenario | undefined = getDeskScenario(log.scenarioId)): { state: AccountState; dividends: DeskDividendCredit[] } {
  if (!scenario) throw new Error(`unknown desk scenario ${log.scenarioId}`);
  const last = Math.min(log.bar, lastBarOf(scenario));
  const first = log.actions.length ? Math.min(DESK_START_BAR, ...log.actions.map((a) => a.atBar)) : DESK_START_BAR;
  const from = Math.max(0, Math.min(first, last));
  const dividends: DeskDividendCredit[] = [];
  let st = createAccount(log.startingCash, closesAt(scenario, from), from, log.options);
  for (let b = from; b <= last; b++) {
    for (const a of log.actions.filter((x) => x.atBar === b)) st = apply(st, a);
    if (b < last) {
      const exs = (scenario.dividends ?? []).filter((d) => d.exBar === b + 1);
      const held = exs.map((d) => st.positions[d.symbol]?.qty ?? 0);
      st = stepBar(st, barsAt(scenario, b + 1));
      exs.forEach((d, i) => {
        const qty = held[i]!;
        if (!qty) return;
        const amount = Math.round(qty * d.cents);
        dividends.push({ symbol: d.symbol, bar: b + 1, qty, cents: d.cents, amount });
        const curve = st.equityCurve.slice();
        const lastPt = curve[curve.length - 1];
        if (lastPt) curve[curve.length - 1] = { ...lastPt, cash: lastPt.cash + amount, equity: lastPt.equity + amount };
        st = { ...st, cash: st.cash + amount, equityCurve: curve };
      });
    }
  }
  return { state: st, dividends };
}

export const replayDesk = (log: DeskLog, scenario?: DeskScenario): AccountState => replayDeskDetailed(log, scenario).state;

export function deskPlace(log: DeskLog, spec: OrderSpec): { log: DeskLog; result: PlaceResult } {
  const before = replayDesk(log);
  const result = placeOrder(before, spec, contextFrom(before));
  return { log: { ...log, actions: [...log.actions, { type: "place", atBar: log.bar, spec }] }, result };
}

export function deskBracket(log: DeskLog, entry: OrderSpec, stopPrice?: number, targetPrice?: number): { log: DeskLog; result: LinkedResult } {
  const before = replayDesk(log);
  const result = placeBracket(before, entry, stopPrice, targetPrice, contextFrom(before));
  return { log: { ...log, actions: [...log.actions, { type: "bracket", atBar: log.bar, entry, stopPrice, targetPrice }] }, result };
}

export const deskCancel = (log: DeskLog, orderId: string): DeskLog => ({ ...log, actions: [...log.actions, { type: "cancel", atBar: log.bar, orderId }] });

/** Close a whole position at the next open (a market order for the shares held; a buy to cover for a short). */
export function deskFlatten(log: DeskLog, symbol: string): DeskLog {
  const st = replayDesk(log);
  const qty = st.positions[symbol]?.qty ?? 0;
  if (!qty) return log;
  return deskPlace(log, { symbol, side: qty > 0 ? "sell" : "buy", type: "market", qty: Math.abs(qty), tif: "day" }).log;
}

export function deskStep(log: DeskLog, n = 1): DeskLog {
  const s = getDeskScenario(log.scenarioId)!;
  return { ...log, bar: Math.min(lastBarOf(s), log.bar + n) };
}

export const deskSetActive = (log: DeskLog, symbol: string): DeskLog => ({ ...log, active: symbol });

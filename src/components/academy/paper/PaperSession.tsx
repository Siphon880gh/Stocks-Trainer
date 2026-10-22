import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import CandlestickChart from "../../CandlestickChart";
import type { OrderSpec, OrderType, PaperSessionLog } from "../../../lib/academy/paper/types";
import { replay, sessionBracket, sessionCancel, sessionPlace, sessionStep, visibleBars } from "../../../lib/academy/paper/session";
import { getTape } from "../../../lib/academy/paper/tapes";
import { avgCost } from "../../../lib/academy/paper/account";
import SimulatedBanner from "../SimulatedBanner";
import OrderTicket, { type BracketExits } from "./OrderTicket";
import MarginPanel from "./MarginPanel";
import CostPanel from "./CostPanel";
import JournalPanel from "./JournalPanel";
import EquityCurve from "./EquityCurve";
import { AccountSummary, OpenOrders, OrderHistory, PositionsTable } from "./PaperPanels";

interface Props {
  log: PaperSessionLog;
  onLog: (log: PaperSessionLog, event: { placed?: boolean; accepted?: boolean }) => void;
  allowedTypes?: readonly OrderType[];
  /** Last bar the session may step to (challenges end early). */
  lastBar?: number;
  toolbar?: ReactNode;
  /** Shown instead of the ticket once the session is over. */
  finished?: ReactNode;
  /** BA11.M1: allow bracket orders on the ticket. */
  allowBracket?: boolean;
  /** BA11.M5: show the trade journal (free paper page). */
  journal?: boolean;
}

/** BA5.M3: chart (bars 0..current only), stepping, ticket and account panels for one paper session. SIMULATED. */
export default function PaperSession({ log, onLog, allowedTypes, lastBar, toolbar, finished, allowBracket, journal }: Props) {
  const tape = getTape(log.tapeId)!;
  const end = Math.min(lastBar ?? tape.bars.length - 1, tape.bars.length - 1);
  const state = useMemo(() => replay(log), [log]);
  const bars = useMemo(() => visibleBars(log), [log]);
  const [auto, setAuto] = useState(false);
  const logRef = useRef(log);
  logRef.current = log;
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      const cur = logRef.current;
      if (cur.bar >= end) return setAuto(false);
      onLog(sessionStep(cur, 1), {});
    }, 700);
    return () => clearInterval(t);
  }, [auto, end, onLog]);
  const atEnd = log.bar >= end;
  const step = (n: number) => onLog({ ...sessionStep(log, n), bar: Math.min(end, log.bar + n) }, {});
  const pos = state.positions[tape.symbol];
  const markers = [
    ...state.orders
      .filter((o) => o.status === "working")
      .flatMap((o) => {
        const side = (o.side === "buy" ? "Buy" : "Sell") + (o.waiting ? " (after entry)" : "");
        if (o.type === "limit") return [{ price: o.limitPrice! / 100, label: `${side} limit` }];
        if (o.type === "stop") return [{ price: o.stopPrice! / 100, label: `${side} stop` }];
        if (o.type === "stop-limit") return [{ price: o.stopPrice! / 100, label: `${side} stop` }, { price: o.limitPrice! / 100, label: `${side} limit` }];
        if (o.type === "trailing-stop") return [{ price: o.trailStop! / 100, label: "Trailing stop" }];
        return [];
      }),
    ...(pos ? [{ price: Math.round(avgCost(pos)) / 100, label: "Avg cost" }] : []),
  ];
  const data = bars.map((b, i) => ({ name: b.label ?? `D${i + 1}`, open: b.open / 100, high: b.high / 100, low: b.low / 100, close: b.close / 100 }));

  const place = (spec: OrderSpec, exits?: BracketExits) => {
    if (exits) {
      const b = sessionBracket(log, spec, exits.stopPrice, exits.targetPrice);
      return onLog(b.log, { placed: true, accepted: b.result.ok });
    }
    const r = sessionPlace(log, spec);
    onLog(r.log, { placed: true, accepted: r.result.validation.ok });
  };

  return (
    <div className="space-y-3" data-testid="paper-session" data-bar={log.bar} data-tape={tape.id}>
      <SimulatedBanner />
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-[14px]">
          {tape.name} <span className="text-muted font-normal">({tape.symbol}, SAMPLE)</span>
        </p>
        <span className="text-[12px] text-muted tabular-nums" data-testid="bar-counter">
          Bar {log.bar + 1} of {end + 1}
        </span>
        <div className="flex-1" />
        <button type="button" disabled={atEnd} onClick={() => step(1)} className="px-3 py-1.5 rounded-md bg-primary text-white text-[13px] font-semibold disabled:opacity-40" data-testid="step-1">
          Next bar
        </button>
        <button type="button" disabled={atEnd} onClick={() => step(5)} className="px-3 py-1.5 rounded-md border border-line text-[13px] disabled:opacity-40" data-testid="step-5">
          +5 bars
        </button>
        <button type="button" disabled={atEnd} onClick={() => setAuto(!auto)} className="px-3 py-1.5 rounded-md border border-line text-[13px] disabled:opacity-40" aria-pressed={auto}>
          {auto ? "Pause" : "Auto-play"}
        </button>
        {toolbar}
      </div>
      <div className="grid lg:grid-cols-[1fr_320px] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          <div className="panel p-2">
            <CandlestickChart data={data} height={320} markers={markers} markerDecimals={2} padRightBars={4} showScaleControls={false} />
          </div>
          <AccountSummary state={state} />
          <div className="grid md:grid-cols-2 gap-3">
            <PositionsTable state={state} />
            <OpenOrders state={state} onCancel={atEnd ? undefined : (id) => onLog(sessionCancel(log, id), {})} />
          </div>
          <EquityCurve points={state.equityCurve} startingCash={state.startingCash} />
          <OrderHistory state={state} />
          {journal ? <JournalPanel state={state} log={log} onLog={(l) => onLog(l, {})} /> : null}
        </div>
        <div className="space-y-3 lg:sticky lg:top-4">
          {atEnd && finished ? finished : <div key={log.actions.length}>
              <OrderTicket state={state} symbol={tape.symbol} allowedTypes={allowedTypes} disabled={atEnd} onSubmit={place} allowBracket={allowBracket} />
            </div>}
          <p className="text-[12px] text-muted">
            Orders placed now are checked against the <strong>next</strong> bar. Fills follow textbook rules on daily bars: market at the open; limits at the limit or
            better; stops at the stop or worse on a gap. {state.options?.feeCents || state.options?.slippageBps ? "Trading costs are on (see below)." : "No fees."}
          </p>
          {state.options?.allowShort ? <MarginPanel state={state} /> : null}
          {state.options?.feeCents || state.options?.slippageBps ? <CostPanel state={state} /> : null}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import CandlestickChart from "../../../CandlestickChart";
import type { ChartAnnotations } from "../../../../lib/chartAnnotations";
import type { OrderSpec } from "../../../../lib/academy/paper/types";
import type { DeskLog } from "../../../../lib/academy/paper/desk/types";
import { getDeskScenario, lastBarOf, visibleNews } from "../../../../lib/academy/paper/desk/scenarios";
import { deskBracket, deskCancel, deskFlatten, deskPlace, deskSetActive, deskStep, replayDeskDetailed } from "../../../../lib/academy/paper/desk/session";
import { evaluateGoals } from "../../../../lib/academy/paper/desk/goals";
import { DESK_TOUR } from "../../../../lib/academy/paper/desk/tour";
import { glossaryHref } from "../../../../lib/academy/refs";
import { LITERACY_TERMS } from "../../../../lib/literacyTerms";
import { Link } from "react-router-dom";
import Walkthrough from "../../../Walkthrough";
import DeskGoals from "./DeskGoals";
import DeskDebrief from "./DeskDebrief";
import { avgCost, equity } from "../../../../lib/academy/paper/account";
import SimulatedBanner from "../../SimulatedBanner";
import OrderTicket, { type BracketExits, type TicketFields } from "../OrderTicket";
import { AccountSummary } from "../PaperPanels";
import DeskWatchlist from "./DeskWatchlist";
import DeskNews from "./DeskNews";
import DeskFinancials from "./DeskFinancials";
import DeskAccountTabs from "./DeskAccountTabs";
import DeskSizing from "./DeskSizing";
import { cn } from "../../../../lib/utils";
import { dayLabel } from "./format";

const RANGES: [string, number][] = [
  ["1M", 21],
  ["3M", 63],
  ["6M", 126],
  ["All", 10_000],
];
const SPEEDS: [string, number][] = [
  ["1×", 900],
  ["2×", 450],
  ["4×", 200],
];
const EVENT_TAG: Record<string, string> = { earnings: "Earnings", filing: "Filing", company: "News", market: "Macro" };

interface Props {
  log: DeskLog;
  onLog: (log: DeskLog, event: { placed?: boolean; accepted?: boolean }) => void;
  toolbar?: ReactNode;
}

/** The paper desk: replay clock, watchlist, chart with executions, order ticket, account tabs, news and financials. SIMULATED money. */
export default function DeskSession({ log, onLog, toolbar }: Props) {
  const scenario = getDeskScenario(log.scenarioId)!;
  const end = lastBarOf(scenario);
  const active = log.active && scenario.symbols.some((s) => s.symbol === log.active) ? log.active : scenario.symbols[0]!.symbol;
  const sym = scenario.symbols.find((s) => s.symbol === active)!;
  const detailed = useMemo(() => replayDeskDetailed(log), [log]);
  const state = detailed.state;
  const goals = useMemo(() => evaluateGoals(scenario, log, state), [scenario, log, state]);
  const [tour, setTour] = useState<number | null>(null);
  const [range, setRange] = useState(63);
  const [speed, setSpeed] = useState(900);
  const [auto, setAuto] = useState(false);
  const [research, setResearch] = useState<"news" | "financials">("news");
  const [preset, setPreset] = useState<{ seq: number; fields: Partial<TicketFields> }>({ seq: 0, fields: {} });
  const logRef = useRef(log);
  logRef.current = log;
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      const cur = logRef.current;
      if (cur.bar >= end) return setAuto(false);
      onLog(deskStep(cur, 1), {});
    }, speed);
    return () => clearInterval(t);
  }, [auto, end, onLog, speed]);
  const atEnd = log.bar >= end;
  const step = (n: number) => onLog(deskStep(log, n), {});

  const start = Math.max(0, log.bar + 1 - range);
  const data = sym.bars.slice(start, log.bar + 1).map((b, i) => ({ name: dayLabel(b.label ?? `D${start + i + 1}`), open: b.open / 100, high: b.high / 100, low: b.low / 100, close: b.close / 100, ...(sym.volumes ? { volume: sym.volumes[start + i] } : {}) }));
  const pos = state.positions[active];
  const markers = [
    ...state.orders
      .filter((o) => o.status === "working" && o.symbol === active)
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
  const annotations: ChartAnnotations = {
    points: state.fills
      .filter((f) => f.symbol === active && f.bar >= start)
      .map((f) => ({ index: f.bar - start, price: f.price / 100, label: `${f.side === "buy" ? "B" : "S"} ${f.qty}`, tone: f.side === "buy" ? "demand" : "supply" })),
    events: visibleNews(scenario, log.bar, active)
      .filter((n) => n.symbol === active && n.kind !== "filing" && n.at >= start)
      .map((n) => ({ index: n.at - start, label: EVENT_TAG[n.kind] ?? "News", tone: "neutral" })),
  };

  const place = (spec: OrderSpec, exits?: BracketExits) => {
    if (exits) {
      const b = deskBracket(log, spec, exits.stopPrice, exits.targetPrice);
      return onLog(b.log, { placed: true, accepted: b.result.ok });
    }
    const r = deskPlace(log, spec);
    onLog(r.log, { placed: true, accepted: r.result.validation.ok });
  };
  const last = state.marks[active] ?? sym.bars[log.bar]!.close;

  return (
    <div className="space-y-3" data-testid="desk-session" data-bar={log.bar} data-scenario={scenario.id} data-active={active}>
      <SimulatedBanner />
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("text-[11px] font-semibold px-1.5 py-0.5 rounded border", scenario.kind === "historical" ? "border-ink/40" : "border-sim text-sim")} data-testid="desk-kind">
          {scenario.kind === "historical" ? "HISTORICAL replay" : "SIMULATED"}
        </span>
        <p className="font-semibold text-[14px]">{scenario.title}</p>
        <span className="text-[12px] tabular-nums" data-testid="desk-clock" data-tour="desk-clock">
          {dayLabel(scenario.labels[log.bar]!, true)} · day {log.bar + 1} of {end + 1}
        </span>
        <div className="flex-1" />
        <button type="button" disabled={atEnd} onClick={() => step(1)} className="px-3 py-1.5 rounded-md bg-primary text-white text-[13px] font-semibold disabled:opacity-40" data-testid="desk-step-1">
          Next day
        </button>
        <button type="button" disabled={atEnd} onClick={() => step(5)} className="px-3 py-1.5 rounded-md border border-line text-[13px] disabled:opacity-40" data-testid="desk-step-5">
          +5 days
        </button>
        <button type="button" disabled={atEnd} onClick={() => setAuto(!auto)} className="px-3 py-1.5 rounded-md border border-line text-[13px] disabled:opacity-40" aria-pressed={auto} data-testid="desk-auto">
          {auto ? "Pause" : "Play"}
        </button>
        <select aria-label="Replay speed" className="border border-line rounded px-1 py-1 text-[12px]" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          {SPEEDS.map(([l, ms]) => (
            <option key={ms} value={ms}>
              {l}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setTour(0)} className="px-3 py-1.5 rounded-md border border-line text-[13px]" data-testid="desk-tour">
          Guided tour
        </button>
        {toolbar}
      </div>
      <p className="text-[12px] text-muted">{scenario.sourceNote}</p>
      <div className="panel px-3 py-2 text-[12px] space-y-1" data-testid="desk-lesson" data-tour="desk-lesson">
        <p>
          <span className="font-semibold">Lesson: </span>
          {scenario.lesson}
        </p>
        {scenario.learn?.length ? <p className="text-muted">You will practise: {scenario.learn.join(" · ")}</p> : null}
        {scenario.terms?.length ? (
          <p>
            <span className="text-muted">Glossary: </span>
            {scenario.terms.map((t, i) => (
              <span key={t}>
                {i ? " · " : ""}
                <Link to={glossaryHref(t)} className="underline hover:text-sim" data-term={t}>
                  {LITERACY_TERMS.find((x) => x.id === t)?.name ?? t}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>
      {atEnd ? <DeskDebrief scenario={scenario} log={log} state={state} goals={goals} dividends={detailed.dividends} onNotes={(notes) => onLog({ ...log, notes }, {})} /> : null}
      <div className="grid lg:grid-cols-[180px_minmax(0,1fr)_320px] gap-3 items-start">
        <div data-tour="desk-watchlist">
          <DeskWatchlist scenario={scenario} bar={log.bar} active={active} state={state} onPick={(s) => onLog(deskSetActive(log, s), {})} />
        </div>
        <div className="space-y-3 min-w-0">
          <div className="panel p-2 space-y-1">
            <div className="flex flex-wrap items-baseline gap-2 px-1">
              <p className="font-semibold text-[13px]">
                {sym.name} <span className="text-muted font-normal">({active})</span>
              </p>
              <div className="flex-1" />
              <div className="flex gap-1 text-[11px]" role="group" aria-label="Chart range">
                {RANGES.map(([l, n]) => (
                  <button key={l} type="button" onClick={() => setRange(n)} aria-pressed={range === n} className={cn("px-1.5 py-0.5 rounded border", range === n ? "border-sim bg-sim/10" : "border-line")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div data-testid="desk-chart" data-tour="desk-chart" data-executions={annotations.points?.length ?? 0} data-events={annotations.events?.length ?? 0}>
              <CandlestickChart data={data} height={320} markers={markers} markerDecimals={2} padRightBars={4} showScaleControls={false} annotations={annotations} showVolume={!!sym.volumes} />
            </div>
            <p className="text-[11px] text-muted px-1">B / S circles are your fills; dashed lines are working orders; vertical lines mark news days.</p>
          </div>
          <AccountSummary state={state} />
          <div data-tour="desk-account">
            <DeskAccountTabs state={state} labels={scenario.labels} onCancel={atEnd ? undefined : (id) => onLog(deskCancel(log, id), {})} onFlatten={atEnd ? undefined : (s) => onLog(deskFlatten(log, s), {})} />
          </div>
          <section className="panel p-3 space-y-2" aria-label="Research" data-tour="desk-research">
            <div className="flex gap-1 text-[12px]" role="tablist" aria-label="Research">
              {(["news", "financials"] as const).map((k) => (
                <button key={k} type="button" role="tab" aria-selected={research === k} onClick={() => setResearch(k)} className={cn("px-2.5 py-1 rounded-md border", research === k ? "border-sim bg-sim/10 font-semibold" : "border-line")} data-testid={`desk-research-${k}`}>
                  {k === "news" ? "News" : "Financials"}
                </button>
              ))}
            </div>
            {research === "news" ? <DeskNews scenario={scenario} bar={log.bar} active={active} /> : <DeskFinancials scenario={scenario} bar={log.bar} active={active} />}
          </section>
        </div>
        <div className="space-y-3">
          {atEnd ? (
            <div className="panel p-3 text-[13px]" data-testid="desk-finished">
              End of the replay. Read the debrief above, review the closed trades and equity tabs, then start a new session.
            </div>
          ) : (
            <div key={`${active}-${log.actions.length}-${preset.seq}`} data-tour="desk-ticket">
              <OrderTicket state={state} symbol={active} onSubmit={place} allowBracket initial={preset.fields} />
            </div>
          )}
          {!atEnd ? (
            <div key={`${active}-${log.bar}`} data-tour="desk-sizing">
            <DeskSizing
              last={last}
              equity={equity(state)}
              onUse={(qty, stop, target) =>
                setPreset((p) => ({
                  seq: p.seq + 1,
                  fields: { side: "buy", type: "market", qty: String(qty), ...(stop !== undefined ? { bracket: true, exitStop: (stop / 100).toFixed(2), exitTarget: target ? (target / 100).toFixed(2) : "" } : {}) },
                }))
              }
            />
            </div>
          ) : null}
          <DeskGoals results={goals} final={atEnd} />
          <p className="text-[12px] text-muted">
            Orders placed now are checked against the <strong>next</strong> day for every symbol: market at the open, limits at the limit or better, stops at the stop or worse on a gap.
          </p>
        </div>
      </div>
      {tour !== null && <Walkthrough label="Paper desk" steps={DESK_TOUR} index={tour} onIndexChange={setTour} onExit={() => setTour(null)} />}
    </div>
  );
}

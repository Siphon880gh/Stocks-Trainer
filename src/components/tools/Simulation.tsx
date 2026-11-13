import { Fragment, createContext, useCallback, useContext, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import {
  atEnd,
  atStart,
  candleLayout,
  currentIndex,
  currentStepCopy,
  nextStep,
  prevStep,
  replayWalk,
  startWalk,
  visibleColumns,
  walkProgress,
  type BarWalkSim,
  type ColumnWalkSim,
  type SimBarMark,
  type SimRef,
  type ToolSimulation,
  type ToolText,
  type WalkState,
} from "../../lib/toolTraining";
import { cn } from "../../lib/utils";
import { LiveLinks } from "./LiveLinks";
import { ToolTerm } from "./ToolTerm";

/**
 * Tool Training simulations: underlined phrases in lesson copy (`ToolTextView` / `SimTrigger`) open a popover
 * (`SimDialog`) that walks a SAMPLE tape bar by bar, or a table column by column, with "what this shows" and
 * "why we are doing this" copy for each step. Stepping rules live in `lib/toolTraining/simWalk.ts`.
 */

interface SimCtx {
  openId: string | null;
  open: (id: string, el: HTMLElement | null) => void;
}
const SimContext = createContext<SimCtx | null>(null);
/** One screen-reader description shared by every trigger on the page (the ▶ cue is CSS, so copy stays clean). */
const SIM_HINT_ID = "sim-trigger-hint";

const MARK_TAG: Record<SimBarMark, string> = { high: "High", low: "Low", earnings: "E", news: "N", dividend: "D", signal: "S" };
const MARK_NAME: Record<SimBarMark, string> = { high: "high of the window", low: "low of the window", earnings: "earnings report", news: "headline", dividend: "ex-dividend", signal: "screener signal" };

/** The underlined control. Without a provider (e.g. the hub legend) it renders as plain text. */
export function SimTrigger({ simRef, children }: { simRef: SimRef; children?: ReactNode }) {
  const ctx = useContext(SimContext);
  if (!ctx) return <>{simRef.text}</>;
  const expanded = ctx.openId === simRef.sim;
  return (
    <button
      type="button"
      data-sim-trigger={simRef.sim}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={expanded ? `sim-${simRef.sim}` : undefined}
      aria-describedby={SIM_HINT_ID}
      title="Opens a short simulation"
      onClick={(e) => ctx.open(simRef.sim, e.currentTarget)}
      className="inline text-left font-medium text-sim underline decoration-dotted decoration-2 decoration-sim/70 underline-offset-[3px] rounded-sm hover:bg-sim/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sim cursor-pointer after:inline-block after:ml-0.5 after:align-super after:text-[9px] after:no-underline after:content-['▶']"
    >
      {children ?? simRef.text}
    </button>
  );
}

/** Lesson copy with its underlined simulation triggers. */
export function ToolTextView({ text }: { text: ToolText }) {
  if (typeof text === "string") return <>{text}</>;
  return (
    <>
      {text.map((p, i) => (typeof p === "string" ? <span key={i}>{p}</span> : "sim" in p ? <Fragment key={i}><SimTrigger simRef={p} /></Fragment> : <Fragment key={i}><ToolTerm text={p.text} term={p.term} /></Fragment>))}
    </>
  );
}

/** Copy that may carry triggers: the plain `text` everywhere, the `rich` runs where a page has simulations. */
export function RichText({ text, rich }: { text: string; rich?: ToolText }) {
  return rich ? <ToolTextView text={rich} /> : <>{text}</>;
}

/** The one-line legend that tells readers dotted purple phrases are simulations, not glossary terms. */
export function SimHint({ subject = "why the idea matters on a chart or a table" }: { subject?: string }) {
  return (
    <p className="text-[11px] text-muted" data-testid="sim-hint">
      <span className="font-medium text-sim underline decoration-dotted decoration-2 underline-offset-[3px]">Dotted purple phrases ▶</span> are not glossary terms. Each opens a short simulation: a SAMPLE tape or a table you step through, showing {subject}.
    </p>
  );
}

/** Holds which simulation is open; renders the popover and returns focus to the trigger on close. */
export function SimProvider({ sims, initialOpen, children }: { sims: ToolSimulation[]; initialOpen?: string | null; children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(initialOpen && sims.some((s) => s.id === initialOpen) ? initialOpen : null);
  const trigger = useRef<HTMLElement | null>(null);
  const open = useCallback((id: string, el: HTMLElement | null) => {
    trigger.current = el;
    setOpenId(id);
  }, []);
  const close = useCallback(() => {
    const id = openId;
    setOpenId(null);
    const el = trigger.current ?? (id ? document.querySelector<HTMLElement>(`[data-sim-trigger="${id}"]`) : null);
    window.setTimeout(() => el?.focus(), 0);
  }, [openId]);
  const sim = sims.find((s) => s.id === openId);
  return (
    <SimContext.Provider value={{ openId, open }}>
      <span id={SIM_HINT_ID} className="sr-only">Opens a short simulation</span>
      {children}
      {sim ? <Fragment key={sim.id}><SimDialog sim={sim} onClose={close} /></Fragment> : null}
    </SimContext.Provider>
  );
}

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/** The popover: a dialog over the lesson with Next / Previous / Replay, Esc and ← → keys. */
export function SimDialog({ sim, onClose, initial }: { sim: ToolSimulation; onClose: () => void; initial?: WalkState }) {
  const [walk, setWalk] = useState<WalkState>(() => initial ?? startWalk(sim));
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panel.current?.querySelector<HTMLElement>("[data-sim-next]")?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      setWalk(nextStep);
    } else if (e.key === "ArrowLeft") {
      setWalk(prevStep);
    } else if (e.key === "Tab" && panel.current) {
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        id={`sim-${sim.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`sim-${sim.id}-title`}
        className="relative w-full sm:max-w-xl max-h-[88vh] overflow-y-auto bg-surface border border-line rounded-t-xl sm:rounded-xl shadow-lg"
        data-testid="sim-dialog"
        data-sim={sim.id}
      >
        <SimPanel
          sim={sim}
          walk={walk}
          onNext={() => setWalk(nextStep)}
          onPrev={() => setWalk(prevStep)}
          onReplay={() => setWalk(replayWalk(sim))}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

/** Everything inside the popover. Stateless so a static render (tests) shows the same thing a reader sees. */
export function SimPanel({ sim, walk, onNext, onPrev, onReplay, onClose }: { sim: ToolSimulation; walk: WalkState; onNext?: () => void; onPrev?: () => void; onReplay?: () => void; onClose?: () => void }) {
  const copy = currentStepCopy(sim, walk);
  const unit = sim.kind === "bars" ? "bar" : "column";
  const bar = sim.kind === "bars" ? sim.bars[currentIndex(walk)]! : null;
  return (
    <div className="text-[13px]">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-2 px-4 py-3 border-b border-line bg-surface">
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-wider text-sim">Simulation · {sim.tape}</p>
          <h2 id={`sim-${sim.id}-title`} className="text-[15px] font-semibold leading-snug">{sim.title}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close simulation" className="shrink-0 px-2 py-1 rounded border border-line text-[12px] hover:bg-canvas">
          Close ✕
        </button>
      </div>
      <div className="p-4 space-y-3">
        <p className="rounded border border-sim/30 bg-sim/5 px-3 py-2 text-[12px]" data-testid="sim-goal">
          <span className="font-semibold">Goal: </span>{sim.goal}
        </p>
        {sim.kind === "bars" ? <CandleWalkChart sim={sim} walk={walk} /> : <ColumnWalkTable sim={sim} walk={walk} />}
        {sim.kind === "columns" ? <LiveLinks links={sim.live} /> : null}
        <div aria-live="polite" className="space-y-2" data-testid="sim-step">
          <p className="text-[11px] text-muted">
            <span className="font-medium text-ink">{walkProgress(sim, walk)}</span>
            {copy.label ? ` · ${copy.label}` : ""}
            {bar ? ` · O ${bar.open.toFixed(2)} H ${bar.high.toFixed(2)} L ${bar.low.toFixed(2)} C ${bar.close.toFixed(2)}` : ""}
            {bar?.readout ? ` · ${bar.readout}` : ""}
          </p>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">What this {unit} shows</p>
            <p>{copy.what}</p>
          </div>
          <div className="rounded border-l-4 border-sim bg-canvas px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-sim">Why we are doing this</p>
            <p>{copy.why}</p>
          </div>
          {atEnd(walk) ? (
            <p className="rounded border border-up/40 bg-up/5 px-3 py-2 text-[12px]" data-testid="sim-takeaway">
              <span className="font-semibold">Takeaway: </span>{sim.takeaway}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="button" onClick={onPrev} disabled={atStart(walk)} className="px-3 py-1.5 rounded border border-line text-[12px] disabled:opacity-40">
            ← Previous {unit}
          </button>
          <button type="button" data-sim-next onClick={onNext} disabled={atEnd(walk)} className="px-3 py-1.5 rounded bg-sim text-white text-[12px] font-medium disabled:opacity-40">
            Next {unit} →
          </button>
          <button type="button" onClick={onReplay} className="px-3 py-1.5 rounded border border-line text-[12px]">
            ↺ Replay
          </button>
        </div>
        <p className="text-[10px] text-muted">SAMPLE figures, simulated, unless a step names a dated real value. Educational, not advice. Keys: ← → step, Esc closes.</p>
      </div>
    </div>
  );
}

/** Candlesticks in fixed slots; only revealed bars are drawn, the current one is boxed. */
export function CandleWalkChart({ sim, walk }: { sim: BarWalkSim; walk: WalkState }) {
  const W = 320;
  const H = 150;
  const LABEL = 14;
  const { boxes, y, slot } = candleLayout(sim.bars, W, H);
  const cur = currentIndex(walk);
  const b = sim.bars[cur]!;
  return (
    <figure className="space-y-1">
      <svg
        viewBox={`0 0 ${W} ${H + LABEL}`}
        className="w-full h-44 rounded border border-line bg-canvas"
        role="img"
        aria-label={`SAMPLE candlestick chart, ${walk.shown} of ${walk.total} bars shown. Current bar ${b.label}: open ${b.open}, high ${b.high}, low ${b.low}, close ${b.close}${b.mark ? `, marked ${MARK_NAME[b.mark]}` : ""}.`}
      >
        <rect x={slot * cur} y={0} width={slot} height={H + LABEL} className="fill-sim/10" data-current-bar={cur} />
        {sim.bars.map((bar, i) => {
          const g = boxes[i]!;
          if (i >= walk.shown) {
            return <line key={i} x1={g.x} x2={g.x} y1={H - 6} y2={H - 2} className="stroke-line" strokeWidth={2} />;
          }
          const color = g.up ? "fill-up stroke-up" : "fill-accent-red stroke-accent-red";
          const top = Math.min(g.yOpen, g.yClose);
          const bodyH = Math.max(1, Math.abs(g.yClose - g.yOpen));
          return (
            <g key={i} data-bar={i} opacity={i === cur ? 1 : 0.75}>
              <line x1={g.x} x2={g.x} y1={g.yHigh} y2={g.yLow} className={color} strokeWidth={1.2} />
              <rect x={g.bodyX} y={top} width={g.bodyW} height={bodyH} className={color} strokeWidth={i === cur ? 1.5 : 0.5} />
              <text x={g.x} y={H + LABEL - 3} textAnchor="middle" className="fill-muted" fontSize={8}>{bar.label}</text>
            </g>
          );
        })}
        {sim.bars.slice(0, walk.shown).map((bar, i) => {
          if (!bar.mark) return null;
          const g = boxes[i]!;
          if (bar.mark === "high" || bar.mark === "low") {
            const py = y(bar.mark === "high" ? bar.high : bar.low);
            return (
              <g key={`m${i}`} className="stroke-sim fill-sim">
                <line x1={0} x2={W} y1={py} y2={py} strokeDasharray="4 3" strokeWidth={0.8} />
                <text x={g.x < W / 2 ? W - 4 : 4} y={bar.mark === "high" ? py - 3 : py + 9} textAnchor={g.x < W / 2 ? "end" : "start"} fontSize={8} stroke="none">
                  {MARK_TAG[bar.mark]} {(bar.mark === "high" ? bar.high : bar.low).toFixed(2)}
                </text>
              </g>
            );
          }
          return (
            <g key={`m${i}`}>
              <circle cx={g.x} cy={Math.max(8, g.yHigh - 9)} r={6} className="fill-sim" />
              <text x={g.x} y={Math.max(8, g.yHigh - 9) + 3} textAnchor="middle" fontSize={8} className="fill-white" fontWeight={700}>{MARK_TAG[bar.mark]}</text>
            </g>
          );
        })}
        {b.readout ? <Readout text={b.readout} x={boxes[cur]!.x} yHigh={boxes[cur]!.yHigh} yLow={boxes[cur]!.yLow} w={W} h={H} /> : null}
      </svg>
      <figcaption className="text-[10px] text-muted">
        {sim.tape}. Green = closed above its open, red = below. Tags: E earnings, N headline, D ex-dividend, S signal; dashed lines mark the high and low.
      </figcaption>
    </figure>
  );
}

/** The current bar's tool figure, in a pill beside the bar (above it, or below when the bar is near the top). */
function Readout({ text, x, yHigh, yLow, w, h }: { text: string; x: number; yHigh: number; yLow: number; w: number; h: number }) {
  const pw = Math.min(w - 4, text.length * 4.6 + 10);
  const px = Math.min(w - pw - 2, Math.max(2, x - pw / 2));
  const above = yHigh - 30 > 0;
  const py = above ? yHigh - 30 : Math.min(h - 16, yLow + 6);
  return (
    <g data-readout>
      <line x1={x} x2={x} y1={above ? py + 14 : py} y2={above ? yHigh - 2 : yLow + 2} className="stroke-sim" strokeWidth={0.8} />
      <rect x={px} y={py} width={pw} height={14} rx={3} className="fill-surface stroke-sim" strokeWidth={0.8} />
      <text x={px + pw / 2} y={py + 10} textAnchor="middle" fontSize={8} className="fill-sim" fontWeight={600}>{text}</text>
    </g>
  );
}

/** Table revealed column by column; the current column (and row, if any) is highlighted. */
export function ColumnWalkTable({ sim, walk }: { sim: ColumnWalkSim; walk: WalkState }) {
  const { visible, current, row } = visibleColumns(sim, walk);
  return (
    <div className="overflow-x-auto rounded border border-line">
      <table className="w-full text-[12px] border-collapse">
        <thead>
          <tr className="text-left border-b border-line bg-canvas">
            {sim.columns.map((c, i) => (
              <th key={c} className={cn("py-1 px-2 font-medium", i === current && "bg-sim/15 text-sim", !visible.includes(i) && "text-muted/50")} data-current-col={i === current ? i : undefined}>
                {visible.includes(i) ? c : "…"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sim.rows.map((r, ri) => (
            <tr key={r[0]} className={cn("border-b border-line", ri === row && "font-semibold")}>
              {r.map((cell, ci) => (
                <td key={ci} className={cn("py-1 px-2 tabular-nums", ci === current && "bg-sim/10", ci === current && ri === row && "outline outline-2 outline-sim -outline-offset-2")}>
                  {visible.includes(ci) ? cell : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

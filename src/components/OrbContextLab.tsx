import { useState } from "react";
import { Link } from "react-router-dom";
import CandlestickChart from "./CandlestickChart";
import Walkthrough from "./Walkthrough";
import { completedOrb, contextAnnotations, stockOrbRisk, ORB_CONTEXT_CASES, ORB_CONTEXT_CHOICES, ORB_CONTEXT_TOUR, ORB_CONTEXT_FRAMES, ORB_MOMENTS, ORB_VIDEO, type RangeMinutes } from "../lib/orbConfirmation";

/** Context is visible before answering; future bars and trade/outcome facts are not. */
export default function OrbContextLab({ onComplete }: { onComplete: () => void }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [frame, setFrame] = useState(2);
  const [minutes, setMinutes] = useState<RangeMinutes>(15);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [tour, setTour] = useState<number | null>(null);
  const [budget, setBudget] = useState("100");
  const [power, setPower] = useState("5000");
  const s = ORB_CONTEXT_CASES[caseIndex];
  const picked = picks[s.id];
  const visible = s.bars.slice(0, frame);
  const range = completedOrb(visible, minutes);
  const r15 = completedOrb(visible, 15);
  const ann = contextAnnotations(visible, minutes);
  // Retain completed 15-minute context when the learner chooses 30 minutes.
  if (minutes === 30 && r15) ann.levels = [...(ann.levels ?? []),
    { price: r15.high, label: "15m high", tone: "neutral" }, { price: r15.low, label: "15m low", tone: "neutral" }];
  if (picked && frame >= s.decision + 1) {
    ann.levels = [...(ann.levels ?? []),
      { price: s.entry, label: "Illustrative entry", tone: "entry" },
      { price: s.stop, label: "Structural stop", tone: "risk" },
      { price: s.target, label: "Reference target", tone: "reward" }];
  }
  const risk = stockOrbRisk(s.side, s.entry, s.stop, s.target, Number(budget), Number(power));
  const fullStop = s.side === "long" ? 99 : 102;
  const full = stockOrbRisk(s.side, s.entry, fullStop, s.target, Number(budget), Number(power));
  const stepTour = (i: number) => { setTour(i); setFrame(ORB_CONTEXT_FRAMES[i]); };
  const choose = (id: string) => {
    if (picked || frame < s.decision + 1) return;
    const next = { ...picks, [s.id]: id }; setPicks(next);
    if (ORB_CONTEXT_CASES.every(c => next[c.id])) onComplete();
  };
  return <section id="context" className="panel p-4 space-y-4 text-[13px]" data-testid="orb-context">
    <h2 className="font-semibold text-[16px]">Stock ORB: context before confirmation</h2>
    <p>Define the window, then interpret the reaction. Breakout continuation and failed-break rotation are different plans. A close outside alone cannot tell you which will unfold.</p>
    <p className="text-muted text-[12px]">US stock cash-session open: 06:30 Pacific. The first 15 minutes finish at 06:45 Pacific; the first 30 at 07:00 Pacific. All chart clock labels below are candle start times in Pacific. No live signals or option contracts required.</p>
    <div className="flex flex-wrap gap-3">
      <label>Scenario <select aria-label="ORB context scenario" value={caseIndex} onChange={e => { const i = Number(e.target.value); setCaseIndex(i); setFrame(2); }} className="panel p-2 max-w-full">
        {ORB_CONTEXT_CASES.map((c, i) => <option value={i} key={c.id}>{i + 1}. {c.title}{picks[c.id] ? " · answered" : ""}</option>)}
      </select></label>
      <label>Opening window <select aria-label="Opening window" value={minutes} onChange={e => setMinutes(Number(e.target.value) as RangeMinutes)} className="panel p-2"><option value={15}>15 minutes</option><option value={30}>30 minutes</option></select></label>
      <button type="button" className="panel px-3 py-1 text-primary" onClick={() => { setCaseIndex(0); setMinutes(15); stepTour(0); }}>Walk me through the retest</button>
    </div>
    <div data-tour="orb-context-chart" className="space-y-2">
      <p className="font-medium">{s.title}</p>
      <p className="text-[11px] text-muted">SIMULATED stock · 5-minute candles · Pacific · {frame} completed candles · no future tape until answer</p>
      <CandlestickChart data={visible} annotations={ann} height={320} padRightBars={3} showScaleControls markerDecimals={2} />
      <p data-testid="orb-range-status" aria-live="polite">{range ? `${minutes}-minute range frozen: ${range.low.toFixed(2)}–${range.high.toFixed(2)} · midpoint ${range.midpoint.toFixed(2)}` : `${minutes}-minute range incomplete: wait for ${minutes / 5} completed candles.`}</p>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="panel px-3 py-1 disabled:opacity-40" disabled={frame <= 1} onClick={() => setFrame(frame - 1)}>Previous candle</button>
        <button type="button" className="panel px-3 py-1 disabled:opacity-40" disabled={frame >= (picked ? s.bars.length : s.decision + 1)} onClick={() => setFrame(frame + 1)}>Next candle</button>
        <span className="text-muted">{picked ? "Answer locked · explore the aftermath" : `Decide after candle ${s.decision + 1}`}</span>
      </div>
    </div>
    <p>If price keeps rotating inside a completed range, treat ranging conditions as a hypothesis, not an all-day forecast. A sustained move outside changes the evidence. Premarket levels can add context, but their session window must be defined separately.</p>
    <p className="text-[12px] text-muted">These evidence questions use the completed 15-minute boundaries. The 30-minute view adds context, not a different answer key. Classifying a setup is not an instruction to enter it.</p>
    <fieldset className="space-y-2" disabled={!!picked || frame < s.decision + 1}>
      <legend className="font-medium">Using the 15-minute boundaries, what does the completed tape show?</legend>
      {ORB_CONTEXT_CHOICES.map(c => <button type="button" key={c.id} data-context-answer={c.id} onClick={() => choose(c.id)} className="block panel px-3 py-2 text-left w-full disabled:opacity-50">{c.label}</button>)}
    </fieldset>
    {picked && <div data-testid="orb-context-result" role="status" className="panel p-3 space-y-2">
      <p className="font-medium">{picked === s.answer ? "Correct reading." : "Recheck the structure."} {ORB_CONTEXT_CHOICES.find(c => c.id === s.answer)?.label}</p>
      <p>{s.explanation}</p>
      {frame > s.decision + 1 ? <p>{s.outcome}</p> : <p>Advance the candles to reveal the aftermath. Grade the process before the result.</p>}
      <div data-tour="orb-context-risk" className="space-y-2">
        <h3 className="font-semibold">Risk the stock trade, not the confidence</h3>
        <p>SIMULATED {s.side}: entry {s.entry.toFixed(2)}, structural stop {s.stop.toFixed(2)}, reference target {s.target.toFixed(2)}. Compare the full-range stop at {fullStop.toFixed(2)} against the structural plan. Keep invalidation logical; never tighten a stop just to buy more shares.</p>
        <div className="flex flex-wrap gap-3">
          <label>Risk budget ($) <input aria-label="ORB risk budget" type="number" min="1" value={budget} onChange={e => setBudget(e.target.value)} className="panel p-1 w-24" /></label>
          <label>Buying power cap ($) <input aria-label="ORB buying power" type="number" min="1" value={power} onChange={e => setPower(e.target.value)} className="panel p-1 w-28" /></label>
        </div>
        <p data-testid="orb-risk-result">{risk && full ? `Structural: ${risk.shares} shares, planned risk $${risk.dollarsAtRisk.toFixed(2)}, reward/risk ${risk.rewardRisk.toFixed(2)}. Full-range: ${full.shares} shares, planned risk $${full.dollarsAtRisk.toFixed(2)}, reward/risk ${full.rewardRisk.toFixed(2)}.` : "Enter positive finite budget and buying power values."}</p>
        <p className="text-[12px] text-muted">Sizing takes the smaller of the risk cap and entry-notional cap, with a $0.05 per-share cost/adverse-fill allowance. This is an illustration, not a loss guarantee. Stops can fill worse, gaps can exceed the allowance, and short stock needs borrow and margin approval. Alignment with other levels is not permission to increase the risk budget. Paper-test after costs, including failed setups, or skip.</p>
      </div>
    </div>}
    <p data-testid="orb-context-score">Context practice: {Object.keys(picks).length} / {ORB_CONTEXT_CASES.length} answered · {ORB_CONTEXT_CASES.filter(c => picks[c.id] === c.answer).length} correct</p>
    <div className="space-y-2">
      <h3 className="font-semibold">Video lesson checkpoints</h3>
      <p className="text-muted">{ORB_VIDEO.creator} · <a className="text-primary underline" href={ORB_VIDEO.watchUrl} target="_blank" rel="noreferrer">{ORB_VIDEO.title}</a></p>
      {ORB_MOMENTS.map(m => <p key={m.seconds}><a className="text-primary underline" href={`${ORB_VIDEO.watchUrl}&t=${m.seconds}s`} target="_blank" rel="noreferrer">{m.label}</a> — {m.text}</p>)}
      <p className="text-[12px]">Independent background: <a className="text-primary underline" href="https://www.nyse.com/markets/hours-calendars" target="_blank" rel="noreferrer">NYSE session hours</a> · <a className="text-primary underline" href="https://www.finra.org/investors/investing/investment-products/stocks/day-trading" target="_blank" rel="noreferrer">FINRA intraday trading risks</a>.</p>
      <p><Link className="text-primary underline" to="/playbooks/orb-context-confirmation">Open the ORB confirmation playbook</Link> · <Link className="text-primary underline" to="/training?group=opening-range&start=1">Quiz these decisions</Link> · <Link className="text-primary underline" to="/archive?tab=literacy&open=orb-failed-break">Failed-break glossary</Link></p>
    </div>
    {tour !== null && <Walkthrough label="ORB retest" steps={ORB_CONTEXT_TOUR} index={tour} onIndexChange={stepTour} onExit={() => setTour(null)} />}
  </section>;
}

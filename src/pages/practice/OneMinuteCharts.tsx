import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  BAR_COUNT, FIB_TEACH, GROUPING, GROUPING_NOTE, LEG_DRILLS, MENTAL_MODEL, MES, ONE_MIN_HARD, OPEN_HOUR,
  SESSION, SIM_1M, SRC, fiveMinuteEnds, mesNet, ticksToCover,
} from "../../lib/oneMinuteCharts";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);

/** /practice/one-minute-charts: 1m with 5m/15m context, legs, MES costs, fib + bar count. */
export default function PracticeOneMinuteCharts() {
  const [ticks, setTicks] = useState(3);
  const [contracts, setContracts] = useState(1);
  const [rt, setRt] = useState(MES.exampleRoundTrip);
  const [legPicks, setLegPicks] = useState<Record<string, boolean>>({});
  const ends = useMemo(() => new Set(fiveMinuteEnds(SIM_1M.length)), []);
  const net = mesNet(ticks, contracts, rt);
  const need = ticksToCover(rt);

  const markLeg = (id: string) => {
    const next = { ...legPicks, [id]: true };
    setLegPicks(next);
    if (LEG_DRILLS.every((d) => next[d.id])) markMiscPracticeDone("one-minute-charts");
  };

  return (
    <PracticeShell
      title="Reading 1-minute charts"
      blurb="Think in 5- and 15-minute groups, count legs and pauses, respect futures tick costs, and use Fibonacci and bar count for price and time. SIMULATED charts. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="om-grouping">
        <p className="font-semibold text-[14px]">Grouping: think in 5m and 15m while you watch 1m</p>
        <ul className="list-disc pl-5 space-y-1">
          {GROUPING.map((g) => (
            <li key={g.formula}><span className="font-medium">{g.formula}.</span> {g.note}</li>
          ))}
        </ul>
        <p className="text-[12px]">{GROUPING_NOTE}</p>
        <p className="text-[12px]">
          Regular session: {SESSION.openET} ({SESSION.openPT}) → {SESSION.minutes} minutes →{" "}
          <strong>{SESSION.bars5m}</strong> five-minute bars (not ~80).
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="om-hard">
        <p className="font-semibold text-[14px]">Why 1-minute trading is hard</p>
        <ul className="list-disc pl-5 space-y-1">{ONE_MIN_HARD.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="om-open">
        <p className="font-semibold text-[14px]">Trading the open ({SESSION.firstHourPT})</p>
        <ul className="list-disc pl-5 space-y-1">{OPEN_HOUR.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="om-legs">
        <p className="font-semibold text-[14px]">Legs and sideways pauses</p>
        <p>
          A {term("price-leg", "leg")} is a clean directional push. {term("consolidation", "Sideways")} is the pause where traders decide whether another leg is coming. Say &quot;three legs up, then sideways&quot; instead of &quot;the chart is confusing&quot;.
        </p>
        <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
          <p className="text-[10px] text-muted px-2 pt-1">SIMULATED 1m: three legs up, sideways, two more legs up · dashed markers = end of each 5m group</p>
          <CandlestickChart data={SIM_1M} height={180} showScaleControls={false} compact />
          <div className="flex flex-wrap gap-1 px-2 pb-2">
            {[...ends].map((i) => (
              <span key={i} className="text-[10px] font-mono text-primary/70">5m@{i + 1}</span>
            ))}
          </div>
        </div>
        {LEG_DRILLS.map((d) => (
          <div key={d.id} className="panel p-3 space-y-1" data-leg={d.id}>
            <p className="italic">&quot;{d.text}&quot;</p>
            <button type="button" className="text-[12px] text-primary underline" onClick={() => markLeg(d.id)} disabled={!!legPicks[d.id]}>
              {legPicks[d.id] ? `Counted: ${d.answer}` : "Reveal the count"}
            </button>
          </div>
        ))}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="om-mes">
        <p className="font-semibold text-[14px]">Futures costs: {term("mes-micro", "MES")} tick math</p>
        <p>
          {MES.name}: ${MES.multiplier} × index, minimum {term("tick", "tick")} {MES.tickPoints} points = ${MES.tickValue}{" "}
          {term("tick-value", "tick value")} per contract. Example {term("round-trip-cost", "round-trip cost")} ${MES.exampleRoundTrip} → you need at least {need} ticks gross just to break even.
        </p>
        <div className="grid grid-cols-3 gap-2 text-[12px]">
          <label className="space-y-1">Ticks<input data-testid="mes-ticks" type="number" min={1} value={ticks} onChange={(e) => setTicks(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
          <label className="space-y-1">Contracts<input data-testid="mes-contracts" type="number" min={1} value={contracts} onChange={(e) => setContracts(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
          <label className="space-y-1">Round-trip $<input data-testid="mes-rt" type="number" min={0} step={0.25} value={rt} onChange={(e) => setRt(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
        </div>
        <p data-testid="mes-net" className="font-medium">
          Gross ${(ticks * MES.tickValue * contracts).toFixed(2)} − cost ${(rt * contracts).toFixed(2)} → net ${net.toFixed(2)}
          {net <= 0 ? " (costs ate the scalp)" : ""}
        </p>
        <p className="text-[11px] space-x-1">{[SRC.mesFaq, SRC.mesRule].map((x) => <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{x.label}</a>)}</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="om-fib">
        <p className="font-semibold text-[14px]">Fibonacci zones with bar count and time</p>
        <p>{FIB_TEACH.anchor}</p>
        <ul className="list-disc pl-5 space-y-1">
          {FIB_TEACH.settings.map((x) => (
            <li key={x.name}><span className="font-medium">{x.name}:</span> {x.meaning}</li>
          ))}
        </ul>
        <p>{FIB_TEACH.timeLens}</p>
        <p className="text-[11px]"><a href={FIB_TEACH.source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{FIB_TEACH.source.label}</a></p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="om-barcount">
        <p className="font-semibold text-[14px]">{term("bar-count", "Bar count")} (e.g. {BAR_COUNT.indicatorName})</p>
        <p>{BAR_COUNT.note}</p>
        <ul className="list-disc pl-5 space-y-1">{BAR_COUNT.questions.map((q) => <li key={q}>{q}</li>)}</ul>
        <p className="text-[12px]">About {BAR_COUNT.session5m} bars in one regular day on a 5-minute chart (390 ÷ 5).</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="om-model">
        <p className="font-semibold text-[14px]">Simple mental model</p>
        <ol className="list-decimal pl-5 space-y-1">{MENTAL_MODEL.map((m) => <li key={m}>{m}</li>)}</ol>
        <p className="text-[12px]">
          <Link to="/training?group=one-minute-charts&start=1" className="text-primary underline">Learn · Reading 1-Minute Charts</Link>
          {" · "}
          <Link to="/practice/reversal-charts" className="text-primary underline">Reversal chart patterns</Link>
        </p>
      </section>
    </PracticeShell>
  );
}

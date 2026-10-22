import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  AAPL_CHAIN, BAR_COUNT_FIB, CONTRACTS, EBITDA_STEPS, FIVE_BEFORE_ONE, FUT_VS_OPT, MES_ES_ROWS, SHARPE_NOTES,
  SIM_DAILY, SPY_FACTS, SPY_POINTS, SRC, type FutContract, futuresPnl, notional, pointsToTicks, sharpe, smaSeries, tickValue,
} from "../../lib/futuresOptionsBasics";
import type { Src } from "../../lib/futuresOptionsBasics";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);
const SrcLinks = ({ list }: { list: Src[] }) => (
  <p className="text-[12px] text-muted">
    Sources:{" "}
    {list.map((x, i) => (
      <span key={x.url}>
        {i > 0 && " · "}
        <a className="underline" href={x.url} target="_blank" rel="noreferrer">{x.label}</a>
      </span>
    ))}
  </p>
);
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

/** /practice/futures-vs-options: futures vs options, MES/ES, SPY, 5m before 1m, SMA, bar count + fib, Sharpe, Apple's income statement chain. */
export default function PracticeFuturesVsOptions() {
  const [contract, setContract] = useState<FutContract>("MES");
  const [qty, setQty] = useState(1);
  const [points, setPoints] = useState(4);
  const [price, setPrice] = useState(7500);
  const [ret, setRet] = useState(8);
  const [rf, setRf] = useState(2);
  const [sd, setSd] = useState(10);
  const [smaN, setSmaN] = useState(5);
  const sr = sharpe(ret, rf, sd);
  const smaVals = useMemo(() => smaSeries(smaN), [smaN]);
  const smaLast = smaVals[smaVals.length - 1];
  const ann = useMemo(
    () => ({
      trendlines: smaVals
        .map((v, i) => (v == null || i === 0 || smaVals[i - 1] == null ? null : { from: { index: i - 1, price: smaVals[i - 1]! }, to: { index: i, price: v }, tone: "entry" as const }))
        .filter((x): x is NonNullable<typeof x> => x != null),
    }),
    [smaVals],
  );

  const onCalc = (fn: () => void) => {
    fn();
    markMiscPracticeDone("futures-vs-options");
  };

  return (
    <PracticeShell
      title="Futures vs options & beginner toolkit"
      blurb="Futures vs options, MES vs ES, why SPY suits beginners, 5-minute before 1-minute, SMA, bar count with Fibonacci, the Sharpe ratio, and Apple's income statement down to EBITDA. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fo-compare">
        <p className="font-semibold text-[14px]">Futures vs options</p>
        <p>
          A {term("futures-contract", "futures contract")} is an obligation for both sides; an {term("option-contract", "option")} gives its buyer a right without an obligation.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] min-w-[520px]">
            <thead><tr className="text-left text-muted"><th className="py-1 pr-2 w-28">Topic</th><th className="pr-2">Futures</th><th>Options</th></tr></thead>
            <tbody>
              {FUT_VS_OPT.map((r) => (
                <tr key={r.topic} className="border-t border-line/60 align-top">
                  <td className="py-1 pr-2 font-medium">{r.topic}</td>
                  <td className="py-1 pr-2">{r.futures}</td>
                  <td className="py-1">{r.options}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SrcLinks list={[SRC.cftc, SRC.finra, SRC.mesFaq]} />
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fo-mes-es">
        <p className="font-semibold text-[14px]">MES vs ES</p>
        <p>
          {term("mes-micro", "MES")} is one tenth of {term("es-emini", "ES")}. Same index, same tick size, different {term("contract-multiplier", "multiplier")}.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="text-left text-muted"><th className="py-1 pr-2"></th><th className="pr-2">MES</th><th>ES</th></tr></thead>
            <tbody>
              {MES_ES_ROWS.map((r) => (
                <tr key={r.label} className="border-t border-line/60"><td className="py-1 pr-2 font-medium">{r.label}</td><td className="pr-2">{r.mes}</td><td>{r.es}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel p-3 space-y-2" data-testid="fo-calc">
          <p className="font-medium">Contract calculator (example numbers, before costs)</p>
          <div className="flex gap-2" role="group" aria-label="Contract">
            {(Object.keys(CONTRACTS) as FutContract[]).map((c) => (
              <button key={c} type="button" data-contract={c} aria-pressed={contract === c} onClick={() => onCalc(() => setContract(c))}
                className={`panel px-3 py-1 text-[12px] ${contract === c ? "ring-2 ring-primary" : ""}`}>{c}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-md">
            <label className="space-y-1">Contracts<input data-testid="fo-qty" type="number" min={1} value={qty} onChange={(e) => onCalc(() => setQty(Math.max(1, Number(e.target.value) || 1)))} className="w-full panel px-2 py-1" /></label>
            <label className="space-y-1">Points moved<input data-testid="fo-points" type="number" step={0.25} value={points} onChange={(e) => onCalc(() => setPoints(Number(e.target.value)))} className="w-full panel px-2 py-1" /></label>
            <label className="space-y-1">Futures price<input data-testid="fo-price" type="number" value={price} onChange={(e) => onCalc(() => setPrice(Number(e.target.value)))} className="w-full panel px-2 py-1" /></label>
          </div>
          <p data-testid="fo-calc-out" className="font-medium">
            {contract}: {pointsToTicks(points)} ticks × {usd(tickValue(contract))} × {qty} = {usd(futuresPnl(contract, points, qty))} · {term("notional-value", "notional")} {usd(notional(contract, price, qty))}
          </p>
        </div>
        <SrcLinks list={[SRC.mesFaq, SRC.es]} />
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fo-spy">
        <p className="font-semibold text-[14px]">SPY for beginners</p>
        <p>{term("spy-etf", SPY_FACTS.name)}: {SPY_FACTS.objective} Launched {SPY_FACTS.inception}; expense ratio {SPY_FACTS.expenseRatio}.</p>
        <ul className="list-disc pl-5 space-y-1">{SPY_POINTS.map((x) => <li key={x}>{x}</li>)}</ul>
        <SrcLinks list={[SRC.spy]} />
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fo-five">
        <p className="font-semibold text-[14px]">5-minute before 1-minute</p>
        <ul className="list-disc pl-5 space-y-1">{FIVE_BEFORE_ONE.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="text-[12px]">More: <Link className="underline text-primary" to="/practice/one-minute-charts">Reading 1-minute charts</Link></p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fo-sma">
        <p className="font-semibold text-[14px]">Simple moving average</p>
        <p>An {term("simple-moving-average", "SMA")} is the plain average of the last N closes. SMA(5) of 10, 11, 12, 13, 14 = 60 ÷ 5 = 12.</p>
        <label className="flex items-center gap-2 text-[12px]">Period
          <input data-testid="fo-sma-n" type="range" min={2} max={10} value={smaN} onChange={(e) => setSmaN(Number(e.target.value))} />
          <span className="font-mono">{smaN}</span>
        </label>
        <div className="rounded-lg bg-background-dark border border-line overflow-hidden">
          <p className="text-[10px] text-muted px-2 pt-1">SIMULATED daily closes · SMA({smaN}) line</p>
          <CandlestickChart data={SIM_DAILY} height={180} showScaleControls={false} compact annotations={ann} />
        </div>
        <p data-testid="fo-sma-out" className="text-[12px]">Latest SMA({smaN}) = {smaLast?.toFixed(2)}</p>
        <SrcLinks list={[SRC.sma]} />
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fo-barcount">
        <p className="font-semibold text-[14px]">Bar count + Fibonacci</p>
        <ul className="list-disc pl-5 space-y-1">{BAR_COUNT_FIB.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="text-[12px]">More: <Link className="underline text-primary" to="/practice/fib-decision-map">Fibonacci as a decision map</Link></p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fo-sharpe">
        <p className="font-semibold text-[14px]">Sharpe ratio</p>
        <p>{term("sharpe-ratio", "Sharpe ratio")} = (return − risk-free rate) ÷ standard deviation.</p>
        <div className="grid grid-cols-3 gap-2 max-w-md">
          <label className="space-y-1">Return %<input data-testid="fo-ret" type="number" value={ret} onChange={(e) => onCalc(() => setRet(Number(e.target.value)))} className="w-full panel px-2 py-1" /></label>
          <label className="space-y-1">Risk-free %<input data-testid="fo-rf" type="number" value={rf} onChange={(e) => onCalc(() => setRf(Number(e.target.value)))} className="w-full panel px-2 py-1" /></label>
          <label className="space-y-1">Std dev %<input data-testid="fo-sd" type="number" value={sd} onChange={(e) => onCalc(() => setSd(Number(e.target.value)))} className="w-full panel px-2 py-1" /></label>
        </div>
        <p data-testid="fo-sharpe-out" className="font-medium">{sr == null ? "Standard deviation must be above 0." : `Sharpe ≈ ${sr.toFixed(2)}`}</p>
        <ul className="list-disc pl-5 space-y-1">{SHARPE_NOTES.map((x) => <li key={x}>{x}</li>)}</ul>
        <SrcLinks list={[SRC.sharpe]} />
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="fo-aapl">
        <p className="font-semibold text-[14px]">Apple's income statement chain (fiscal 2025)</p>
        <p className="text-[12px]">Year ended Sep 27, 2025, $ millions, from Apple's Form 10-K. Read top to bottom: each line feeds the next ({term("income-statement", "income statement")}).</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <tbody>
              {AAPL_CHAIN.map((r) => (
                <tr key={r.step} className={`border-t border-line/60 ${r.op === "=" ? "font-semibold" : ""}`}>
                  <td className="py-1 pr-2 w-4 font-mono">{r.op}</td>
                  <td className="py-1 pr-2">{r.step}</td>
                  <td className="py-1 pr-2 font-mono text-right">{r.value.toLocaleString("en-US")}</td>
                  <td className="py-1 text-muted hidden sm:table-cell">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel p-3" data-testid="fo-ebitda">
          <p className="font-medium">Then to {term("ebitda", "EBITDA")}</p>
          <ul className="list-disc pl-5 space-y-1">{EBITDA_STEPS.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <SrcLinks list={[SRC.aapl10k, SRC.secGuide, SRC.ebitda]} />
      </section>

      <p className="text-[12px] text-muted">
        Quiz: <Link className="underline text-primary" to="/training?group=futures-vs-options">Learn · Futures vs Options</Link>. As of 2026-10-22.
      </p>
    </PracticeShell>
  );
}

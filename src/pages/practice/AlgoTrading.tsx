import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  API_KEY_RULES, AS_OF, ATR_EXAMPLE, BACKTEST_TRAPS, BOT_CONTROLS, BROKER_APIS, HALT_FACTS, LEGAL_RULES, NEWS_PLAYBOOK, NEWS_TIMES, SRC, STOP_TYPES, atrShares, ALGO_SOURCES,
} from "../../lib/algoTrading";
import { PDT_FACTS, PDT_SUMMARY } from "../../lib/pdtRule";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);
const ext = (src: { label: string; url: string }) => (
  <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{src.label}</a>
);

/** /practice/algo-trading: broker APIs, backtest traps, bot safety, and stops around news events (2026). */
export default function PracticeAlgoTrading() {
  const [risk, setRisk] = useState(ATR_EXAMPLE.risk);
  const [atr, setAtr] = useState(ATR_EXAMPLE.atr);
  const [mult, setMult] = useState(ATR_EXAMPLE.newsDay);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const tick = (i: number) => {
    const next = { ...done, [i]: !done[i] };
    setDone(next);
    if (NEWS_PLAYBOOK.every((_, k) => next[k])) markMiscPracticeDone("algo-trading");
  };
  const shares = atr > 0 && mult > 0 ? atrShares(risk, atr, mult) : 0;
  return (
    <PracticeShell
      title="Automated & algo trading (2026)"
      blurb={`Broker APIs, paper vs real, backtest traps, bot safety, and how stops behave around news. Facts as of ${AS_OF}. Educational, not trading advice.`}
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="algo-intro">
        <p className="font-semibold text-[14px]">Rules a computer can run</p>
        <p>
          A discretionary trader decides each trade. An {term("algorithmic-trading", "algorithmic")} trader writes entries, exits and sizing as explicit rules first, so a computer can{" "}
          {term("backtesting", "backtest")} and execute them. Whoever runs the algorithm is responsible for what it does. The path is the same as for any trader: test on history, paper trade,
          then go live small.
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="algo-brokers">
        <p className="font-semibold text-[14px]">Broker APIs and paper trading (as of {AS_OF})</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse min-w-[640px]">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="py-1 pr-2">Broker</th><th className="py-1 pr-2">Paper / sandbox</th><th className="py-1 pr-2">Assets</th><th className="py-1 pr-2">Notes</th><th className="py-1">Source</th>
              </tr>
            </thead>
            <tbody>
              {BROKER_APIS.map((r) => (
                <tr key={r.broker} className="border-b border-line/60 align-top" data-broker={r.broker}>
                  <td className="py-1 pr-2 font-medium">{r.broker}</td><td className="py-1 pr-2">{r.paper}</td><td className="py-1 pr-2">{r.assets}</td><td className="py-1 pr-2">{r.notes}</td>
                  <td className="py-1 space-x-1">{r.sources.map(ext)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px]">
          No-code routes: TradingView alerts can send a {term("webhook", "webhook")} when they fire ({ext(SRC.tvWebhooks)}); brokers offer bracket and OCO orders without code; QuantConnect runs
          cloud backtests and live trading through many brokers ({ext(SRC.qcBrokers)}).
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="algo-backtest">
        <p className="font-semibold text-[14px]">Paper vs real: why backtests flatter</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {BACKTEST_TRAPS.map((t) => (
            <div key={t.name} className="panel p-3 space-y-1">
              <p className="font-semibold">{t.name}</p>
              <p>{t.what}</p>
              <p className="text-[12px]"><span className="font-medium">Fix:</span> {t.fix}</p>
              <p className="text-[11px]">{ext(t.source)}</p>
            </div>
          ))}
        </div>
        <p className="text-[12px]">Terms: {term("overfitting", "overfitting")} · {term("look-ahead-bias", "look-ahead bias")} · {term("survivorship-bias", "survivorship bias")}</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="algo-safety">
        <p className="font-semibold text-[14px]">Bot safety: kill switch, limits, keys, and the law</p>
        <ul className="list-disc pl-5 space-y-1">{BOT_CONTROLS.map((c) => <li key={c}>{c}</li>)}</ul>
        <p className="font-medium">{term("api-key", "API key")} safety</p>
        <ul className="list-disc pl-5 space-y-1">{API_KEY_RULES.map((c) => <li key={c}>{c}</li>)}</ul>
        <div className="grid sm:grid-cols-2 gap-2">
          {LEGAL_RULES.map((l) => (
            <div key={l.name} className="panel p-3 space-y-1">
              <p className="font-semibold">{l.name}</p><p>{l.text}</p><p className="text-[11px]">{ext(l.source)}</p>
            </div>
          ))}
        </div>
        <p className="text-[12px]">Terms: {term("kill-switch", "kill switch")} · {term("spoofing", "spoofing")} · {term("wash-trade", "wash trade")} · {ext(SRC.finra1509)}</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="algo-pdt">
        <p className="font-semibold text-[14px]">Day trading on margin: the PDT rule is being replaced</p>
        <p>{PDT_SUMMARY}</p>
        <p className="text-[12px]">
          Terms: {term("pattern-day-trader", "pattern day trader")} · {term("intraday-margin", "intraday margin")} · {PDT_FACTS.sources.map((x, i) => <span key={x.url}>{i ? " · " : ""}{ext(x)}</span>)}
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="algo-stops">
        <p className="font-semibold text-[14px]">Stops around news events</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse min-w-[560px]">
            <thead><tr className="text-left border-b border-line"><th className="py-1 pr-2">Order</th><th className="py-1 pr-2">In a gap</th><th className="py-1">Use when</th></tr></thead>
            <tbody>
              {STOP_TYPES.map((r) => (
                <tr key={r.order} className="border-b border-line/60 align-top"><td className="py-1 pr-2 font-medium">{r.order}</td><td className="py-1 pr-2">{r.inAGap}</td><td className="py-1">{r.use}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-medium">When the news lands</p>
        <ul className="list-disc pl-5 space-y-1">{NEWS_TIMES.map((c) => <li key={c}>{c}</li>)}</ul>
        <p className="font-medium">Halts: {term("luld", "LULD")} and {term("circuit-breaker", "circuit breakers")}</p>
        <ul className="list-disc pl-5 space-y-1">{HALT_FACTS.map((c) => <li key={c}>{c}</li>)}</ul>
        <p className="text-[12px] space-x-1">{[SRC.secStops, SRC.finraStops, SRC.finraGuardrails, SRC.finraExt, SRC.bls, SRC.blsJobs, SRC.fomc].map(ext)}</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="algo-atr">
        <p className="font-semibold text-[14px]">Size by ATR: same dollar risk, wider stop</p>
        <p>Shares = dollar risk ÷ (multiple × ATR). A wider news-day stop means fewer shares, not more risk.</p>
        <div className="grid grid-cols-3 gap-2 text-[12px]">
          <label className="space-y-1">Dollar risk ($)<input data-testid="atr-risk" type="number" min={1} value={risk} onChange={(e) => setRisk(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
          <label className="space-y-1">ATR ($)<input data-testid="atr-atr" type="number" min={0.01} step={0.1} value={atr} onChange={(e) => setAtr(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
          <label className="space-y-1">Multiple<input data-testid="atr-mult" type="number" min={0.5} step={0.5} value={mult} onChange={(e) => setMult(Number(e.target.value))} className="w-full panel px-2 py-1" /></label>
        </div>
        <p data-testid="atr-result" className="font-medium">
          Stop distance ${(atr * mult).toFixed(2)} → {shares} shares (risking about ${(shares * atr * mult).toFixed(0)}).
        </p>
        <p className="text-[12px]">
          Example: $200 risk, ATR $2. Normal day 1.5×ATR = $3 stop → {atrShares(200, 2, 1.5)} shares. News day 3×ATR = $6 stop → {atrShares(200, 2, 3)} shares. {ext(SRC.atr)}
        </p>
        <p className="text-[12px]">
          A defined-risk alternative: a bought option can lose at most its premium, but implied volatility often falls after the event and cuts its value. {ext(SRC.oicLongCall)} · {term("server-side-stop", "broker-held stop")}
        </p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="algo-playbook">
        <p className="font-semibold text-[14px]">News-day playbook (tick each step to finish)</p>
        <ul className="space-y-1">
          {NEWS_PLAYBOOK.map((p, i) => (
            <li key={p.step}>
              <label className="flex gap-2 items-start">
                <input type="checkbox" data-playbook-item={i} checked={!!done[i]} onChange={() => tick(i)} className="mt-1" />
                <span><span className="font-medium">{p.step}</span> <span className="text-muted text-[12px]">{p.why}</span></span>
              </label>
            </li>
          ))}
        </ul>
        <p className="text-[12px]">
          <Link to="/training?group=algo-trading&start=1" className="text-primary underline">Learn · Automated & Algo Trading</Link> ·{" "}
          <Link to="/practice/charting-apps" className="text-primary underline">Indicator & charting apps</Link> ·{" "}
          <Link to="/practice/news-biases" className="text-primary underline">News, biases & short-term options</Link>
        </p>
      </section>

      <section className="panel p-4 space-y-1 text-[12px]" data-testid="algo-sources">
        <p className="font-semibold text-[13px]">Sources (fetched {AS_OF})</p>
        <ul className="list-disc pl-5 space-y-0.5">{ALGO_SOURCES.map((x) => <li key={x.url}>{ext(x)}</li>)}</ul>
      </section>
    </PracticeShell>
  );
}

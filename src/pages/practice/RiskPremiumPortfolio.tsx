import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  RPP_BACKTEST,
  RPP_CAVEATS,
  RPP_CORR_EXAMPLE,
  RPP_DISCLAIMER,
  RPP_ETF_IMPLIED_CAGR,
  RPP_IMPLIED_YEARS,
  RPP_LINKS,
  RPP_SLEEVES,
  RPP_TREND_LOOKBACK,
  RPP_TREND_SAMPLE,
  RPP_VIDEO,
  VRP_CALL_LABELS,
  VRP_CALLS,
  VRP_SCENARIOS,
  pct,
  shortSleeveLoss,
  termSlopePct,
  trendFilter,
  type VrpCall,
} from "../../lib/riskPremiumPortfolio";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);
const usd = (v: number) => `$${v.toLocaleString("en-US")}`;

/** /practice/risk-premium-portfolio: diversified risk premiums, a textbook trend filter, the VIX overlay and its tail risk. */
export default function PracticeRiskPremiumPortfolio() {
  const [picks, setPicks] = useState<Record<string, VrpCall>>({});
  const choose = (id: string, v: VrpCall) => {
    if (picks[id]) return;
    const next = { ...picks, [id]: v };
    setPicks(next);
    if (VRP_SCENARIOS.every((s) => next[s.id])) markMiscPracticeDone("risk-premium-portfolio");
  };
  const right = VRP_SCENARIOS.filter((s) => picks[s.id] === s.answer).length;
  const trend = trendFilter(RPP_TREND_SAMPLE, RPP_TREND_LOOKBACK);

  return (
    <PracticeShell
      title="Risk-premium portfolio and the VIX overlay"
      blurb={`A diversified ETF mix built from risk premiums, a trend filter, and a short-volatility overlay, with the risks a backtest hides. ${RPP_DISCLAIMER}`}
    >
      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rpp-portfolio">
        <p className="font-semibold text-[14px]">The base portfolio, as presented</p>
        <div className="overflow-x-auto">
          <table className="text-[12px] w-full" data-testid="rpp-sleeves">
            <thead>
              <tr className="text-left text-muted">
                <th className="pr-3 font-medium">ETF</th>
                <th className="pr-3 font-medium">Weight</th>
                <th className="pr-3 font-medium">What it is paid for</th>
                <th className="font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {RPP_SLEEVES.map((s) => (
                <tr key={s.ticker} data-row={s.ticker}>
                  <td className="pr-3 font-medium">{s.ticker}</td>
                  <td className="pr-3">{s.weight}%</td>
                  <td className="pr-3">{s.premium}</td>
                  <td>{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted">
          Weights set by each asset's economic role, not by what backtested best. Glossary: {term("risk-premium", "risk premium")} · {term("risk-parity", "risk parity / All Weather")} · {term("diversification", "diversification")} · {term("etf", "ETF")}
        </p>
        <p className="text-[11px] text-muted" data-testid="rpp-source">
          From{" "}
          <a href={RPP_VIDEO.watchUrl} target="_blank" rel="noreferrer" className="text-primary underline">{RPP_VIDEO.title}</a>{" "}
          by{" "}
          <a href={RPP_VIDEO.channelUrl} target="_blank" rel="noreferrer" className="text-primary underline">{RPP_VIDEO.creator}</a>{" "}
          (YouTube), which calls it the "North Star Portfolio". The video ends with a pitch for the creator's paid offering. The caveats below are the app's.
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rpp-correlation">
        <p className="font-semibold text-[14px]">Why mixing low-correlation assets lowers risk</p>
        <p className="text-[12px]">SAMPLE assumptions: two assets with 16% and 15% volatility, held 50/50.</p>
        <ul className="list-disc pl-5 text-[12px]">
          {RPP_CORR_EXAMPLE.map((c) => (
            <li key={c.rho} data-corr={c.rho}>Correlation {c.rho}: portfolio volatility about {pct(c.vol)}</li>
          ))}
        </ul>
        <p className="text-[12px] text-muted">
          Lower volatility is what lets some diversified mixes add modest leverage. The catch: correlations can jump together in a crisis. Glossary: {term("correlation", "correlation")} · {term("portfolio-leverage", "portfolio leverage")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rpp-trend">
        <p className="font-semibold text-[14px]">A trend filter (textbook example, not the video's rule)</p>
        <p className="text-[12px]">
          The video moves a weak slice to cash but does not give its lookbacks. A common textbook version: at each month-end, hold the asset if its price is above its {RPP_TREND_LOOKBACK}-month simple moving average, otherwise hold cash.
        </p>
        <div className="flex flex-wrap gap-1 text-[11px]" data-testid="rpp-trend-months">
          {RPP_TREND_SAMPLE.map((c, i) => (
            <span
              key={i}
              data-month={i + 1}
              className={cn(
                "px-1.5 py-0.5 rounded border",
                trend[i] === true && "border-emerald-500 bg-emerald-500/15",
                trend[i] === false && "border-rose-500 bg-rose-500/15",
                trend[i] === null && "border-line text-muted",
              )}
            >
              M{i + 1}: {c} {trend[i] === null ? "·" : trend[i] ? "in" : "cash"}
            </span>
          ))}
        </div>
        <p className="text-[12px] text-muted">
          SAMPLE month-end closes. It goes to cash after the fall has started and returns after the rebound has started: that lag is the cost. Glossary: {term("trend-filter", "trend filter")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rpp-vrp-drills">
        <p className="font-semibold text-[14px]">The VIX overlay: your call</p>
        <p className="text-[12px]">
          The video estimates the volatility risk premium from two inputs: the slope of the VIX futures curve (contango vs backwardation) and implied vs realized volatility. Positive: short VIX futures exposure (it shorts VXX). Small or unclear: flat. Negative: long. It gives no thresholds, so this drill uses the app's simplification: act only when both inputs agree.
        </p>
        {VRP_SCENARIOS.map((s) => {
          const picked = picks[s.id];
          return (
            <div key={s.id} className="panel p-3 space-y-2" data-drill={s.id}>
              <p className="font-medium">{s.title}</p>
              <p className="text-[12px]">
                VIX {s.vix} · front future {s.front} · second future {s.second} (slope {termSlopePct(s.front, s.second) > 0 ? "+" : ""}{termSlopePct(s.front, s.second)}%) · implied {s.implied} vs realized {s.realized}
              </p>
              <div className="flex flex-col gap-1">
                {VRP_CALLS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    disabled={!!picked}
                    onClick={() => choose(s.id, o)}
                    className={cn(
                      "text-left px-2 py-1.5 rounded border text-[12px]",
                      picked === o && o === s.answer && "bg-emerald-500/20 border-emerald-500",
                      picked === o && o !== s.answer && "bg-rose-500/20 border-rose-500",
                      picked && o === s.answer && picked !== o && "border-emerald-500/50",
                    )}
                  >
                    {VRP_CALL_LABELS[o]}
                  </button>
                ))}
              </div>
              {picked ? (
                <p className="text-[12px]" data-drill-result>
                  {picked === s.answer ? "Correct. " : "Not quite. "}
                  {s.why}
                </p>
              ) : null}
            </div>
          );
        })}
        {VRP_SCENARIOS.every((s) => picks[s.id]) ? (
          <p className="font-medium" data-testid="rpp-score">{right} / {VRP_SCENARIOS.length} correct</p>
        ) : null}
        <p className="text-[12px] text-muted">
          Glossary: {term("vix-index", "VIX")} · {term("vix-term-structure", "VIX term structure")} · {term("roll-yield", "roll yield")} · {term("volatility-risk-premium", "volatility risk premium")} · {term("inverse-volatility-etp", "inverse volatility ETPs")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rpp-tail">
        <p className="font-semibold text-[14px]">Short volatility: size for the crash</p>
        <ul className="list-disc pl-5 text-[12px]">
          {[5, 10, 20].map((sleeve) => (
            <li key={sleeve} data-sleeve={sleeve}>Short VXX at {sleeve}% of the account, VXX +400%: about {pct(shortSleeveLoss(sleeve, 400), 0)} of the whole account lost</li>
          ))}
        </ul>
        <p className="text-[12px] text-muted">The video reports VXX rallied more than 400% in the 2020 COVID crash. A short position's loss has no cap.</p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rpp-backtest">
        <p className="font-semibold text-[14px]">The video's backtest (the creator's own numbers)</p>
        <div className="overflow-x-auto">
          <table className="text-[12px] w-full">
            <thead>
              <tr className="text-left text-muted">
                <th className="pr-3 font-medium">From $100,000</th>
                <th className="pr-3 font-medium">End value</th>
                <th className="pr-3 font-medium">CAGR</th>
                <th className="pr-3 font-medium">Volatility</th>
                <th className="pr-3 font-medium">Sharpe</th>
                <th className="font-medium">Max drawdown</th>
              </tr>
            </thead>
            <tbody>
              {RPP_BACKTEST.map((r) => (
                <tr key={r.id} data-row={r.id}>
                  <td className="pr-3">{r.label}</td>
                  <td className="pr-3">{usd(r.endValue)}</td>
                  <td className="pr-3">{pct(r.cagr, 2)}</td>
                  <td className="pr-3">{pct(r.vol, 2)}</td>
                  <td className="pr-3">{r.sharpe}</td>
                  <td>{pct(r.maxDd, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted">
          Not live or audited results. The combined line implies about {RPP_IMPLIED_YEARS} years; over that span the ETF-only end value works out to about {pct(RPP_ETF_IMPLIED_CAGR)} a year rather than the CAGR shown. Glossary: {term("cagr", "CAGR")} · {term("sharpe-ratio", "Sharpe ratio")} · {term("drawdown", "drawdown")} · {term("backtesting", "backtesting")} · {term("look-ahead-bias", "look-ahead bias")} · {term("market-on-close", "market-on-close")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rpp-caveats">
        <p className="font-semibold text-[14px]">What the backtest doesn't show</p>
        {RPP_CAVEATS.map((c) => (
          <div key={c.id} data-caveat={c.id}>
            <p className="font-medium">{c.title}</p>
            <p className="text-[12px]">{c.text}</p>
          </div>
        ))}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="rpp-links">
        <p className="font-semibold text-[14px]">Keep going</p>
        <ul className="list-disc pl-5 space-y-1">
          {RPP_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-primary underline">{l.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </PracticeShell>
  );
}

import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  CONTANGO_SHORT_LOSS,
  CURVE_EXAMPLES,
  EARLY_EXIT_EXAMPLE,
  EDGE_REQUIREMENTS,
  EV_CALL_EXAMPLE,
  EV_CALL_TEST,
  EV_CARRY,
  EV_FORMULAS,
  EV_MODEL,
  EV_TAIL_MODEL,
  FORECAST_EXAMPLES,
  HALF_INVERSE_PATH,
  INVERSE_BENCHMARK,
  INVERSE_PATH,
  INVERSE_ROUND_TRIP_LOSS,
  OPTION_EXAMPLES,
  PAPER_PROCESS,
  PRE_TRADE_CHECKLIST,
  RECOVERY_TABLE,
  SIZING_EXAMPLE,
  STRATEGY_FAMILIES,
  TERM_PREMIUM_NOTE,
  THREE_DECAYS,
  VIX_ARTICLE,
  VIX_DISCLAIMER,
  VIX_DRILLS,
  VIX_INSTRUMENTS,
  VIX_KEY_IDEAS,
  VIX_LINKS,
  VIX_SIGMA_LEVELS,
  VIX_VERDICT,
  VRO_EXAMPLE,
  VX_EXAMPLES,
  WIN_RATE_EXAMPLE,
  curveShape,
  curveSlope,
  signedUsd,
  usd,
  vxPnl,
} from "../../lib/vixTrading";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);
const Panel = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <section className="panel p-4 space-y-3 text-[13px]" data-testid={id}>
    <p className="font-semibold text-[14px]">{title}</p>
    {children}
  </section>
);
const th = "pr-3 font-medium";
const Formula = ({ children }: { children: ReactNode }) => (
  <p className="text-[12px] font-medium rounded border px-2 py-1" data-formula>{children}</p>
);
const pctProb = (p: number) => `${Math.round(p * 100)}%`;
const slope = (a: number, b: number) => {
  const s = Math.round(curveSlope(a, b) * 10) / 10;
  return `${s > 0 ? "+" : ""}${s}%`;
};

/** /practice/vix-trading: key ideas, what VIX measures, what you can trade, the futures curve, carry, options, expected value vs price, daily resets, sizing and a paper-trade process. */
export default function PracticeVixTrading() {
  const [picks, setPicks] = useState<Record<string, number>>({});
  const choose = (id: string, i: number) => {
    if (picks[id] !== undefined) return;
    const next = { ...picks, [id]: i };
    setPicks(next);
    if (VIX_DRILLS.every((d) => next[d.id] !== undefined)) markMiscPracticeDone("vix-trading");
  };
  const right = VIX_DRILLS.filter((d) => picks[d.id] === d.answer).length;
  const allDone = VIX_DRILLS.every((d) => picks[d.id] !== undefined);

  return (
    <PracticeShell
      title="VIX trading for beginners"
      blurb={`How traders try to profit from volatility, and the losses that can overwhelm a trade that looked right. ${VIX_DISCLAIMER}`}
    >
      <Panel id="vix-key-ideas" title="Key ideas">
        <table className="text-[12px] w-full">
          <tbody>
            {VIX_KEY_IDEAS.map((k) => (
              <tr key={k.concept} data-idea={k.panel} className="align-top">
                <td className="pr-3 text-muted whitespace-nowrap">{k.category}</td>
                <td className="pr-3 font-medium">{k.concept}</td>
                <td>{k.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel id="vix-verdict" title={VIX_VERDICT.title}>
        <p className="font-medium">{VIX_VERDICT.short}</p>
        {VIX_VERDICT.paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="text-[12px]">{p}</p>
        ))}
        <p className="text-[12px] text-muted">
          Glossary: {term("volatility-risk-premium", "volatility risk premium")} · {term("paper-trading", "paper trading")}
        </p>
      </Panel>

      <Panel id="vix-measures" title="What the VIX actually measures">
        <p className="text-[12px]">
          The Cboe Volatility Index is the 30-day volatility implied by S&P 500 (SPX) options, expressed as an annualized percentage. To scale it to one month, multiply by √(30/365). VIX 20 is about a 5.7% one-standard-deviation 30-day move, not a forecast of a 20% fall.
        </p>
        <table className="text-[12px]" data-testid="vix-sigma">
          <thead>
            <tr className="text-left text-muted"><th className={th}>VIX</th><th className="font-medium">Rough 1σ 30-day move</th></tr>
          </thead>
          <tbody>
            {VIX_SIGMA_LEVELS.map((r) => (
              <tr key={r.vix} data-vix={r.vix}><td className="pr-3">{r.vix}</td><td>about {r.monthly}%</td></tr>
            ))}
          </tbody>
        </table>
        <p className="text-[12px]">
          A rough guide under simplifying assumptions, not a guaranteed range: returns jump and volatility itself changes. Implied volatility (from option prices) can differ a lot from realized volatility (what happened). And VIX measures the expected size of moves, not their direction, so a long-volatility trade doesn't need a crash and a high VIX isn't a crash probability.
        </p>
        <p className="text-[12px] text-muted">
          Glossary: {term("vix-index", "VIX")} · {term("vix-one-month-move", "VIX to a one-month move")} · {term("implied-vs-realized-volatility", "implied vs realized volatility")}
        </p>
      </Panel>

      <Panel id="vix-instruments" title="What you can actually trade">
        <p className="text-[12px]">Spot VIX is a calculation; you can't buy it. Each product below references it differently, so the payoff, holding cost and worst-case loss change with the instrument.</p>
        <div className="overflow-x-auto">
          <table className="text-[12px] w-full">
            <thead>
              <tr className="text-left text-muted"><th className={th}>Instrument</th><th className={th}>What you hold</th><th className={th}>A directional trade gains when</th><th className="font-medium">Main complication</th></tr>
            </thead>
            <tbody>
              {VIX_INSTRUMENTS.map((x) => (
                <tr key={x.id} data-row={x.id}>
                  <td className="pr-3 font-medium">{x.name}</td><td className="pr-3">{x.holds}</td><td className="pr-3">{x.profitsWhen}</td><td>{x.complication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px]">
          Buying an inverse fund means owning shares that are short internally; it is not the same as short-selling. A fully paid share purchase can lose what you put in, while borrowing, short sales or added derivatives can create obligations beyond it. These products are not interchangeable: read the current prospectus.
        </p>
        <p className="text-[12px] text-muted">
          Glossary: {term("mini-vix-futures", "Mini VIX futures")} · {term("vix-index-options", "VIX index options")} · {term("options-on-vix-futures", "options on VIX futures")} · {term("inverse-volatility-etp", "inverse volatility ETPs")} · {term("etn-issuer-risk", "ETN issuer risk")}
        </p>
      </Panel>

      <Panel id="vix-futures-pnl" title="How VIX futures profits and losses work">
        <p className="text-[12px]">A standard VX future is $1,000 per index point. Long: (exit − entry) × $1,000 × contracts. Short: reverse the subtraction. To open a short you sell a contract; to close it you buy it back.</p>
        <table className="text-[12px]">
          <thead>
            <tr className="text-left text-muted"><th className={th}>Hypothetical trade</th><th className={th}>Entry</th><th className={th}>Exit</th><th className="font-medium">Gross, one VX contract</th></tr>
          </thead>
          <tbody>
            {VX_EXAMPLES.map((x, i) => (
              <tr key={i} data-vx={i}>
                <td className="pr-3">{x.label}</td><td className="pr-3">{x.entry}</td><td className="pr-3">{x.exit}</td><td>{signedUsd(vxPnl(x.entry, x.exit, x.side))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          <li>20 → 25 is 5 points and a 25% rise in the quote: different units. Your account's percentage depends on the capital behind the position.</li>
          <li>A quote of 20 doesn't mean the contract costs $20. Margin is collateral, not the maximum loss: futures are marked to market, and losses can exceed the deposit.</li>
          <li>Mini VIX futures (VXM) are one-tenth the size, $100 a point. Smaller dollars, same risk per unit of exposure.</li>
          <li>At expiration, VX futures settle in cash against the Special Opening Quotation (VRO), which can differ from the VIX just before or after.</li>
        </ul>
        <p className="text-[12px] text-muted">
          Glossary: {term("contract-multiplier", "contract multiplier")} · {term("vix-futures-margin", "VIX futures margin")} · {term("vix-special-opening-quotation", "Special Opening Quotation")}
        </p>
      </Panel>

      <Panel id="vix-curve" title="Reading the VIX futures curve">
        <p className="text-[12px]">The curve plots today's futures prices by expiration. It is a snapshot of prices now, not a chart of what VIX will do. Slope = (F2 ÷ F1 − 1) × 100.</p>
        <table className="text-[12px]">
          <thead>
            <tr className="text-left text-muted"><th className={th}>Shape</th><th className={th}>Month 1 · 2 · 3</th><th className={th}>F2 vs F1</th><th className="font-medium">What the prices suggest</th></tr>
          </thead>
          <tbody>
            {CURVE_EXAMPLES.map((c) => (
              <tr key={c.id} data-curve={c.id} data-shape={curveShape(c.prices)}>
                <td className="pr-3 font-medium">{c.label}</td><td className="pr-3">{c.prices.join(" · ")}</td><td className="pr-3">{slope(c.prices[0], c.prices[1])}</td><td>{c.reads}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          <li>The slope is a price comparison, not a promised monthly yield or a backtested return. Record the expiration dates: 10 and 30 days apart are different comparisons.</li>
          <li>Watch the level too. Curve {CONTANGO_SHORT_LOSS.before.join(" / ")} → {CONTANGO_SHORT_LOSS.after.join(" / ")} stays in contango, yet a short front future loses 6 points ({usd(CONTANGO_SHORT_LOSS.pnl)} per contract).</li>
          <li>An upward curve doesn't guarantee a surge, and a downward one doesn't mean the spike has peaked. Futures prices include risk compensation and supply and demand, not just forecasts.</li>
          <li>Cboe's VIX9D, VIX, VIX3M and VIX6M are option-implied indices for other horizons. VIX3M is not a VIX future expiring in three months.</li>
        </ul>
        <p className="text-[12px] text-muted">
          Glossary: {term("vix-term-structure", "VIX term structure")} · {term("vix-curve-slope", "curve slope")} · {term("vix-volatility-indices", "VIX9D / VIX3M / VIX6M")}
        </p>
      </Panel>

      <Panel id="vix-carry" title="Carry, convergence, and three kinds of “decay”">
        <p className="text-[12px]">
          If spot VIX stays near 15 and a future starts at 20, then settles at 15, a short earns 5 points and a long loses 5, though spot barely moved. That is carry: what time does to a position as the contract nears settlement. In a stable upward curve it can favor shorts and hurt long funds that keep rolling. It is conditional: a sharp rise in volatility can cost a short far more than convergence earns, and backwardation reverses the relationship.
        </p>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          {THREE_DECAYS.map((d) => (
            <li key={d.id} data-decay={d.id}><span className="font-medium">{d.name}.</span> {d.text}</li>
          ))}
        </ul>
        <p className="text-[12px] text-muted">
          Glossary: {term("carry-and-convergence", "carry and convergence")} · {term("roll-yield", "roll yield")} · {term("three-kinds-of-decay", "three kinds of decay")} · {term("theta-decay", "theta")}
        </p>
      </Panel>

      <Panel id="vix-forecast" title="Why a correct forecast can still lose money">
        {FORECAST_EXAMPLES.map((f) => (
          <div key={f.id} data-forecast={f.id}>
            <p className="font-medium">{f.title}: {signedUsd(f.pnl)} per contract</p>
            <p className="text-[12px]">{f.setup} {f.outcome}</p>
            <p className="text-[12px] text-muted">{f.lesson}</p>
          </div>
        ))}
        <p className="text-[12px]">
          The volatility risk premium (investors paying extra for protection) is a real idea, but its pay is uncertain. Selling SPX option volatility is not the same trade as shorting VIX futures, and calm stock markets alone don't settle a VIX future in your favor.
        </p>
      </Panel>

      <Panel id="vix-options" title="VIX options add another layer">
        <p className="text-[12px]">Traditional VIX index options are cash-settled, European-style, $100 per point, and priced off the matching VIX future rather than spot VIX. Trading in an expiring option normally ends before settlement day.</p>
        <table className="text-[12px]">
          <thead>
            <tr className="text-left text-muted"><th className={th}>Bought for 2.00 ($200)</th><th className={th}>Settlement</th><th className={th}>Net before costs</th><th className="font-medium">Expiration breakeven</th></tr>
          </thead>
          <tbody>
            {OPTION_EXAMPLES.map((o) => (
              <tr key={o.id} data-option={o.id}>
                <td className="pr-3">{o.strike} {o.kind}</td><td className="pr-3">{o.settle}</td><td className="pr-3">{signedUsd(o.net)}</td><td>{o.breakeven}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[12px]">
          A rise in volatility isn't automatically a profit: the payoff has to beat the premium. There are two layers of volatility here: VIX is about S&P 500 volatility, and VIX options' own implied volatility is about uncertainty in the VIX, which Cboe tracks with VVIX. Bought options limit loss to the premium and costs (repeated 100% losses still add up); selling uncovered VIX calls can lose enormous amounts. Options on VIX futures settle into futures and follow different rules.
        </p>
        <p className="text-[12px] text-muted">
          Glossary: {term("options-breakeven", "breakeven")} · {term("vvix", "VVIX")} · {term("vertical-spread", "vertical spread")} · {term("options-on-vix-futures", "options on VIX futures")}
        </p>
      </Panel>

      <Panel id="vix-edge" title="Where an edge actually comes from: expected value vs price">
        <p className="text-[12px]">
          A VIX edge depends on the price of your instrument compared with the payouts it can produce. Predicting that volatility rises or falls is only part of the calculation. All examples are hypothetical; N is the number of contracts, C is trading costs, and V_T is the official settlement value (VRO).
        </p>

        <p className="font-medium">1. Futures are linear, and settle against the VRO</p>
        <Formula>{EV_FORMULAS.futuresLong}</Formula>
        <Formula>{EV_FORMULAS.futuresShort}</Formula>
        <p className="text-[12px]" data-testid="vix-vro-example">
          Both prices refer to the same expiration. Spot VIX is {VRO_EXAMPLE.spot}; you buy one future at {VRO_EXAMPLE.entry}; it settles at {VRO_EXAMPLE.settle}. ({VRO_EXAMPLE.settle} − {VRO_EXAMPLE.entry}) × $1,000 = {usd(VRO_EXAMPLE.pnl)} before costs: volatility finished above where spot started, but below the price you paid.
        </p>

        <p className="font-medium">2. Carry if the curve keeps its shape</p>
        <table className="text-[12px]" data-testid="vix-carry-table">
          <thead>
            <tr className="text-left text-muted"><th className={th}>Curve</th><th className={th}>Month 1 · 2 · 3</th><th className={th}>Two-month future a month later</th><th className={th}>Long</th><th className="font-medium">Short</th></tr>
          </thead>
          <tbody>
            {EV_CARRY.map((c) => (
              <tr key={c.id} data-carry={c.id}>
                <td className="pr-3 font-medium">{c.label}</td><td className="pr-3">{c.prices.join(" · ")}</td><td className="pr-3">{c.roll.entry} → {c.roll.after}</td><td className="pr-3">{signedUsd(c.roll.long)}</td><td>{signedUsd(c.roll.short)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[12px]">
          Contango and backwardation describe prices across expirations today, not how prices will move. The carry above only holds if the curve stays exactly the same, and replacing an expiring contract with the next one (rolling) does not create an instant profit. A future above spot may reflect expected volatility, pay for risk, or both; the gap alone is not an edge.
        </p>

        <p className="font-medium">3. Options are nonlinear</p>
        <Formula>{EV_FORMULAS.callAtExpiry}</Formula>
        <Formula>{EV_FORMULAS.putAtExpiry}</Formula>
        <p className="text-[12px]" data-testid="vix-call-example">
          A {EV_CALL_EXAMPLE.strike}-strike call bought for {EV_CALL_EXAMPLE.premium} points costs ${EV_CALL_EXAMPLE.cost}. If settlement is {EV_CALL_EXAMPLE.settle}, it pays ${EV_CALL_EXAMPLE.payout}, so it loses {usd(Math.abs(EV_CALL_EXAMPLE.pnl))} (breakeven {EV_CALL_EXAMPLE.breakeven}; the matching put would break even at {EV_CALL_EXAMPLE.putBreakeven}). Finishing above the strike wasn't enough to recover the premium.
        </p>
        <Formula>{EV_FORMULAS.optionEarly}</Formula>
        <p className="text-[12px]">
          Example: {EARLY_EXIT_EXAMPLE.contracts} calls bought at {EARLY_EXIT_EXAMPLE.entry.toFixed(2)}, sold at {EARLY_EXIT_EXAMPLE.exit.toFixed(2)}, ${EARLY_EXIT_EXAMPLE.costs} costs: {signedUsd(EARLY_EXIT_EXAMPLE.pnl)}. Before expiration an option's price depends on that expiration's VIX futures level, the time left and implied volatility, so spot VIX alone can't tell you its value.
        </p>

        <p className="font-medium">4. The expected-value test</p>
        <Formula>{EV_FORMULAS.shortEv}</Formula>
        <p className="text-[12px]">E[V_T] is a probability-weighted estimate of settlement, extreme outcomes included. Short one future at 20 under two hypothetical models:</p>
        <div className="overflow-x-auto">
          <table className="text-[12px]" data-testid="vix-ev-table">
            <thead>
              <tr className="text-left text-muted"><th className={th}>Assumed outcome</th><th className={th}>Probability</th><th className={th}>Settlement</th><th className="font-medium">P/L before costs</th></tr>
            </thead>
            <tbody>
              {EV_MODEL.rows.map((r) => (
                <tr key={`base-${r.label}`} data-ev="base"><td className="pr-3">{r.label}</td><td className="pr-3">{pctProb(r.p)}</td><td className="pr-3">{r.settle}</td><td>{signedUsd(r.pnl)}</td></tr>
              ))}
              <tr data-ev="base-total" className="font-medium"><td className="pr-3">Model A</td><td className="pr-3" colSpan={2}>E[V_T] = {EV_MODEL.expectedSettle}</td><td>E[P/L] {signedUsd(EV_MODEL.expectedPnl)}</td></tr>
              {EV_TAIL_MODEL.rows.slice(1).map((r) => (
                <tr key={`tail-${r.label}`} data-ev="tail"><td className="pr-3">{r.label} (Model B)</td><td className="pr-3">{pctProb(r.p)}</td><td className="pr-3">{r.settle}</td><td>{signedUsd(r.pnl)}</td></tr>
              ))}
              <tr data-ev="tail-total" className="font-medium"><td className="pr-3">Model B</td><td className="pr-3" colSpan={2}>E[V_T] = {EV_TAIL_MODEL.expectedSettle}</td><td>E[P/L] {signedUsd(EV_TAIL_MODEL.expectedPnl)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-[12px]">
          Model A: 0.90 × $4,000 + 0.10 × (−$16,000) = {signedUsd(EV_MODEL.expectedPnl)}. Model B keeps the same 90% win probability but lets the spike settle at 70: 0.90 × $4,000 + 0.10 × (−$50,000) = {signedUsd(EV_TAIL_MODEL.expectedPnl)}. Underestimating the rare loss turns apparent profitability into negative expectancy.
        </p>
        <Formula>{EV_FORMULAS.callEv}</Formula>
        <p className="text-[12px]">
          A 20 call bought for 2 under Model A: 0.10 × 16 = 1.6 expected points against a 2-point premium, {signedUsd(EV_CALL_TEST.base)}. Under Model B it is {signedUsd(EV_CALL_TEST.tail)}. The tail you assume decides the sign for both sides of the trade.
        </p>
        <p className="text-[12px]" data-testid="vix-term-premium">{TERM_PREMIUM_NOTE}</p>
        <p className="text-[12px] font-medium">A model-implied edge is not evidence that the probabilities are right. Before calling it an edge you need:</p>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          {EDGE_REQUIREMENTS.map((r) => (
            <li key={r.id} data-edge-need={r.id}><span className="font-medium">{r.title}.</span> {r.text}</li>
          ))}
        </ul>
        <p className="text-[12px] text-muted">
          Glossary: {term("expected-value", "expected value")} · {term("negative-expectancy", "negative expectancy")} · {term("carry-and-convergence", "carry and convergence")} · {term("vix-special-opening-quotation", "VRO settlement")} · {term("volatility-risk-premium", "volatility risk premium")}
        </p>
      </Panel>

      <Panel id="vix-inverse" title="Why an inverse fund can lose when its benchmark ends unchanged">
        <table className="text-[12px]">
          <thead>
            <tr className="text-left text-muted"><th className={th}>Point</th><th className={th}>Futures benchmark</th><th className={th}>Daily −1x fund</th><th className="font-medium">Daily −0.5x fund</th></tr>
          </thead>
          <tbody>
            {INVERSE_BENCHMARK.map((b, i) => (
              <tr key={i} data-day={i}>
                <td className="pr-3">{i === 0 ? "Start" : `After day ${i}`}</td><td className="pr-3">{b.toFixed(2)}</td><td className="pr-3">${INVERSE_PATH[i]!.toFixed(2)}</td><td>${HALF_INVERSE_PATH[i]!.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[12px]">
          Idealized, before fees. The benchmark ends where it started; the −1x fund is down {Math.abs(INVERSE_ROUND_TRIP_LOSS).toFixed(2)}% because day 2's +16.67% applies to $80, not $100. Compounding depends on the path: a steady trend can work the other way. Model the product's real daily objective and history; a spot-VIX chart is not a substitute. The SVIX issuer warns you could lose the entire investment in one day, and SVXY's smaller −0.5x target changes the sensitivity but doesn't make a large allocation safe.
        </p>
        <p className="text-[12px] text-muted">Glossary: {term("daily-reset-path-dependence", "daily reset and path dependence")}</p>
      </Panel>

      <Panel id="vix-strategies" title="Where traders look for an edge, and how each one fails">
        {STRATEGY_FAMILIES.map((s) => (
          <div key={s.id} data-strategy={s.id}>
            <p className="font-medium">{s.name}</p>
            <p className="text-[12px]">Thesis: {s.thesis}</p>
            <p className="text-[12px]">Fails when: {s.fails}</p>
          </div>
        ))}
        <p className="text-[12px] text-muted">These are families to study on paper, not signals to trade today. Each needs a testable claim, a time horizon and an instrument whose payoff matches it.</p>
      </Panel>

      <Panel id="vix-shorting" title="Why shorting continuously can fail">
        <p className="text-[12px]">
          Volatility often falls back after a spike, but there is no deadline, no fixed baseline, and no guarantee the account survives until it does. 19 trades of +$100 and one of −$3,000: {WIN_RATE_EXAMPLE.winRate}% winners and {usd(WIN_RATE_EXAMPLE.total)} overall ({usd(WIN_RATE_EXAMPLE.expectancy)} a trade).
        </p>
        <table className="text-[12px]" data-testid="vix-recovery">
          <thead>
            <tr className="text-left text-muted"><th className={th}>Loss from start</th><th className="font-medium">Gain needed on what is left</th></tr>
          </thead>
          <tbody>
            {RECOVERY_TABLE.map((r) => (
              <tr key={r.loss} data-loss={r.loss}><td className="pr-3">{r.loss}%</td><td>{r.gain}%</td></tr>
            ))}
          </tbody>
        </table>
        <p className="text-[12px]">
          Look at the whole portfolio: a short-volatility position tends to lose at the same time as stocks in a selloff, so adding it to a stock-heavy account increases your dependence on calm markets. A long-volatility hedge has the opposite role, but its cost and imperfect response can still make it unsuitable.
        </p>
        <p className="text-[12px] text-muted">Glossary: {term("win-rate-vs-expectancy", "win rate vs expectancy")} · {term("recovery-math", "recovery math")} · {term("drawdown", "drawdown")}</p>
      </Panel>

      <Panel id="vix-sizing" title="Position sizing and orders before entry">
        <p className="text-[12px]">
          Illustrative only: a ${SIZING_EXAMPLE.account.toLocaleString("en-US")} practice account with a ${SIZING_EXAMPLE.budget} trade-loss budget. Buying a fund at ${SIZING_EXAMPLE.entry} with an exit at ${SIZING_EXAMPLE.stop} risks $2 a share, so {SIZING_EXAMPLE.shares} shares is {usd(SIZING_EXAMPLE.plannedLoss)} if it fills at the stop. If it gaps and fills at ${SIZING_EXAMPLE.gapFill}, the same shares lose {usd(SIZING_EXAMPLE.gapLoss)}. A stop is an instruction to act after a trigger, not insurance on the price; a stop-limit controls the price but can stay unfilled.
        </p>
        <p className="text-[12px]">
          For futures, a 10-point move against one short VX is {usd(SIZING_EXAMPLE.vxTenPoints)}. If the smallest tradable unit doesn't fit the budget, the position doesn't fit. Planned stops and contractual maximum losses are different things.
        </p>
        <p className="font-medium text-[12px]">Write down before any order</p>
        <ul className="list-disc pl-5 text-[12px]">
          {PRE_TRADE_CHECKLIST.map((c) => <li key={c}>{c}</li>)}
        </ul>
        <p className="text-[12px] text-muted">
          Don't add size just because the trade is losing. Glossary: {term("position-sizing", "position sizing")} · {term("stop-limit-order", "stop-limit order")} · {term("gap-risk", "gap risk")}
        </p>
      </Panel>

      <Panel id="vix-drills" title="Your call">
        {VIX_DRILLS.map((d) => {
          const picked = picks[d.id];
          return (
            <div key={d.id} className="panel p-3 space-y-2" data-drill={d.id}>
              <p className="text-[12px]">{d.prompt}</p>
              <div className="flex flex-col gap-1">
                {d.options.map((o, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={picked !== undefined}
                    onClick={() => choose(d.id, i)}
                    className={cn(
                      "text-left px-2 py-1.5 rounded border text-[12px]",
                      picked === i && i === d.answer && "bg-emerald-500/20 border-emerald-500",
                      picked === i && i !== d.answer && "bg-rose-500/20 border-rose-500",
                      picked !== undefined && i === d.answer && picked !== i && "border-emerald-500/50",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {picked !== undefined ? (
                <p className="text-[12px]" data-drill-result>{picked === d.answer ? "Correct. " : "Not quite. "}{d.why}</p>
              ) : null}
            </div>
          );
        })}
        {allDone ? <p className="font-medium" data-testid="vix-score">{right} / {VIX_DRILLS.length} correct</p> : null}
      </Panel>

      <Panel id="vix-paper" title="A practical way to learn before committing money">
        {PAPER_PROCESS.map((p) => (
          <div key={p.id} data-step={p.id}>
            <p className="font-medium">{p.title}</p>
            <p className="text-[12px]">{p.text}</p>
          </div>
        ))}
        <p className="text-[12px] font-medium">Choosing no position is a valid outcome when the price, payoff or risk can't be explained clearly.</p>
        <p className="text-[12px] text-muted">Glossary: {term("backtesting", "backtesting")} · {term("overfitting", "overfitting")} · {term("look-ahead-bias", "look-ahead bias")} · {term("paper-trading", "paper trading")}</p>
      </Panel>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="vix-links">
        <p className="font-semibold text-[14px]">Keep going</p>
        <ul className="list-disc pl-5 space-y-1">
          {VIX_LINKS.map((l) => (
            <li key={l.to}><Link to={l.to} className="text-primary underline">{l.label}</Link></li>
          ))}
        </ul>
        <p className="text-[11px] text-muted" data-testid="vix-source">
          Based on the article “{VIX_ARTICLE.title}” (no author named; product descriptions checked {VIX_ARTICLE.checkedOn}) and the Cboe, SEC, FINRA, NFA, New York Fed and fund-issuer pages it cites, listed on the{" "}
          <Link to="/playbooks/vix-curve-carry-paper" className="text-primary underline">VIX futures curve and carry Playbook</Link>. Trades and curves are hypothetical and exclude costs.
        </p>
      </section>
    </PracticeShell>
  );
}

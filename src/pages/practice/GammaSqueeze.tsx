import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CandlestickChart from "../../components/CandlestickChart";
import { CHART } from "../../lib/chartTheme";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { recordCaseOutcome } from "../../lib/progressStore";
import {
  CALL_STRIKE, ENTRY_BAR, EXIT_BAR, KEY_STRIKES, SQZ_BARS, SQZ_DECISIONS, SQZ_LABEL, SQZ_TICKER, SQZ_TLDR, STALL_BARS, STALL_EXPIRY_PRICE,
  STEP_POINTS, callVolumeMultiple, closeClock, gradeRun, hedgeShares, optionPath, sqzTrade, survivorStats, type SqzBar, type SqzDecision,
} from "../../lib/gammaSqueeze";
import { cn } from "../../lib/utils";

const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const markers = KEY_STRIKES.map((k) => ({ price: k.strike, label: `${k.strike} strike · OI ${k.openInterest.toLocaleString("en-US")}` }));

/** Simple SIMULATED bar strip (call contracts per 5-minute bar). */
function CallVolumeStrip({ bars, mark }: { bars: SqzBar[]; mark?: number }) {
  const max = Math.max(...SQZ_BARS.map((b) => b.callVolume));
  const w = 4;
  return (
    <svg viewBox={`0 0 ${78 * w} 48`} className="w-full h-12" role="img" aria-label="Call volume per bar (SIMULATED)" data-testid="sqz-call-volume">
      {bars.map((b, i) => {
        const h = (b.callVolume / max) * 44;
        return <rect key={i} x={i * w + 0.5} y={48 - h} width={w - 1} height={h} fill={i === mark ? CHART.highlight : CHART.textMuted} opacity={i === mark ? 1 : 0.55} />;
      })}
    </svg>
  );
}

/** Value of the trader's calls over the day on one or two paths. */
function ValueLines({ upTo, stall }: { upTo: number; stall?: boolean }) {
  const t = sqzTrade();
  const main = optionPath(SQZ_BARS).map((p) => p * t.contracts * 100);
  const alt = optionPath(STALL_BARS).map((p) => p * t.contracts * 100);
  const max = Math.max(...main);
  const pts = (vals: number[], from: number, to: number) =>
    vals.slice(from, to + 1).map((v, j) => `${((from + j) / 77) * 300},${100 - (v / max) * 92}`).join(" ");
  return (
    <svg viewBox="0 0 300 104" className="w-full h-28" role="img" aria-label="Value of the calls (SIMULATED)" data-testid={stall ? "sqz-stall-chart" : "sqz-value-chart"}>
      <line x1="0" x2="300" y1={100 - (t.cost / max) * 92} y2={100 - (t.cost / max) * 92} stroke={CHART.grid} strokeDasharray="3 3" />
      <polyline fill="none" stroke={CHART.up} strokeWidth="2" points={pts(main, ENTRY_BAR, upTo)} />
      {stall ? <polyline fill="none" stroke={CHART.down} strokeWidth="2" points={pts(alt, ENTRY_BAR, 77)} /> : null}
      <line x1={(EXIT_BAR / 77) * 300} x2={(EXIT_BAR / 77) * 300} y1="0" y2="104" stroke={CHART.highlight} strokeDasharray="2 2" />
    </svg>
  );
}

/** /practice/gamma-squeeze: a SIMULATED weekly-call chase with enter, size and exit decisions, a reveal and a stall counterfactual. */
export default function PracticeGammaSqueeze({ initialAnswers = {} as Partial<Record<SqzDecision["id"], string>> }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [award, setAward] = useState<{ points: number; replay: boolean } | null>(null);
  const t = useMemo(() => sqzTrade(), []);
  const s = useMemo(() => survivorStats(), []);
  const step = SQZ_DECISIONS.findIndex((d) => !answers[d.id]);
  const done = step === -1;
  const current = done ? undefined : SQZ_DECISIONS[step];
  const shownTo = done ? SQZ_BARS.length - 1 : current!.bar;
  const run = gradeRun(answers);

  const choose = (d: SqzDecision, id: string) => {
    if (answers[d.id]) return;
    const next = { ...answers, [d.id]: id };
    setAnswers(next);
    if (SQZ_DECISIONS.every((x) => next[x.id])) {
      const r = gradeRun(next);
      const out = recordCaseOutcome({ caseId: "gamma-squeeze", action: SQZ_DECISIONS.map((x) => next[x.id]).join("/"), grade: r.grade });
      setAward({ points: out.pointsAwarded, replay: out.replay });
      markMiscPracticeDone("gamma-squeeze");
    }
  };

  return (
    <PracticeShell
      title="Gamma squeeze case: chasing weekly calls"
      blurb={`A ${SQZ_LABEL} day in a made-up stock (${SQZ_TICKER}): call buying, crowded strikes and a fast move. Decide whether to enter, how much and when to exit, then see the result and the version where it stalls. Educational, not trading advice.`}
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="sqz-tldr">
        <p className="font-semibold text-[14px]">TL;DR</p>
        <p>{SQZ_TLDR}</p>
        <p className="text-[12px] text-muted">
          Delta is how much an option moves per $1 in the stock (0 to 1 for a call). Gamma is how fast delta changes. See{" "}
          <Link to="/archive?tab=literacy&open=gamma" className="text-primary underline">gamma</Link>,{" "}
          <Link to="/archive?tab=literacy&open=delta-hedging" className="text-primary underline">delta hedging</Link> and{" "}
          <Link to="/archive?tab=literacy&open=gamma-squeeze" className="text-primary underline">gamma squeeze</Link>.
        </p>
      </section>

      <section className="panel p-4 space-y-3" data-testid="sqz-case">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-semibold text-[14px]">{SQZ_TICKER} · Thursday · 5-minute bars · {SQZ_LABEL}</p>
          <p className="text-[12px] text-muted tabular-nums">Weekly calls expire Friday at the close</p>
        </div>
        <p className="text-[12px]">
          A trader sees chatter about {SQZ_TICKER} and a wave of call buying in Friday's strikes. The story you may have heard: {usd(t.cost)} of weekly out-of-the-money calls turned into about {usd(t.exitValue)} and was sold the same afternoon. Play it forward one decision at a time.
        </p>
        <CandlestickChart data={SQZ_BARS.slice(0, shownTo + 1)} height={260} markers={markers} showVolume highlightIndex={shownTo} markerDecimals={0} />
        <p className="text-[11px] text-muted">Call contracts traded per bar (all strikes), {SQZ_LABEL}</p>
        <CallVolumeStrip bars={SQZ_BARS.slice(0, shownTo + 1)} mark={shownTo} />

        {current ? (
          <div className="panel p-3 space-y-2" data-testid={`sqz-step-${current.id}`}>
            <p className="text-[11px] text-muted tabular-nums">Decision {step + 1} of {SQZ_DECISIONS.length}</p>
            <p className="text-[13px] font-medium">{current.prompt}</p>
            {current.id === "enter" ? (
              <p className="text-[12px] text-muted tabular-nums">
                Call volume this bar: {callVolumeMultiple(ENTRY_BAR)}× the first half hour's average. The 24 calls cost ${t.entryPremium.toFixed(2)} per share, ${(t.entryPremium * 100).toFixed(0)} per contract.
              </p>
            ) : null}
            <div className="grid gap-1.5">
              {current.choices.map((c) => (
                <button key={c.id} type="button" data-choice={c.id} onClick={() => choose(current, c.id)} className="text-left px-3 py-2 rounded-md border border-line hover:border-primary text-[13px] min-h-[44px]">
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {SQZ_DECISIONS.filter((d) => answers[d.id]).map((d) => {
          const c = d.choices.find((x) => x.id === answers[d.id])!;
          return (
            <p key={d.id} className="text-[12px]" data-testid={`sqz-feedback-${d.id}`}>
              <strong className={c.grade === "correct" ? "text-up" : c.grade === "partial" ? "text-primary" : "text-accent-red"}>
                {d.id === "enter" ? "Enter" : d.id === "size" ? "Size" : "Exit"}: {c.grade === "correct" ? "sound" : c.grade === "partial" ? "half right" : "risky"} (+{STEP_POINTS[c.grade]}).{" "}
              </strong>
              {c.feedback}
            </p>
          );
        })}
      </section>

      {done ? (
        <>
          <section className="panel p-4 space-y-2 text-[13px]" data-testid="sqz-reveal">
            <p className="font-semibold text-[14px]">Reveal</p>
            <p className="tabular-nums" data-testid="sqz-grade">
              Grade: <strong>{run.grade === "correct" ? "Sound process" : run.grade === "partial" ? "Partly sound" : "Risky process"}</strong> · {run.points} / {run.max} decision points
              {award ? (award.replay ? " · replay, no new progress points" : ` · +${award.points} progress points`) : null}
            </p>
            <ul className="list-disc pl-5 space-y-1 tabular-nums">
              <li>
                Entry at {closeClock(ENTRY_BAR).et} ({closeClock(ENTRY_BAR).pt}): {t.contracts} contracts of the {CALL_STRIKE} calls at ${t.entryPremium.toFixed(2)} = {usd(t.cost)}. The stock was {SQZ_BARS[ENTRY_BAR]!.close.toFixed(2)}, below the strike.
              </li>
              <li>
                Exit at {closeClock(EXIT_BAR).et} ({closeClock(EXIT_BAR).pt}): stock {SQZ_BARS[EXIT_BAR]!.close.toFixed(2)}, calls ${t.exitPremium.toFixed(2)} → {usd(t.exitValue)}, about {t.multiple}× the cost.
              </li>
              <li>
                If dealers were net short all {KEY_STRIKES.find((k) => k.strike === CALL_STRIKE)!.openInterest.toLocaleString("en-US")} open {CALL_STRIKE} calls, staying hedged would mean holding about {hedgeShares(ENTRY_BAR).toLocaleString("en-US")} shares at entry and {hedgeShares(EXIT_BAR).toLocaleString("en-US")} at the exit: buying like that can push dealers to buy into the rise.
              </li>
              <li>After the peak the call buying faded, the stock gave back part of the move, and the calls lost value fast.</li>
            </ul>
            <p className="text-[11px] text-muted">Value of the {t.contracts} calls through the day ({SQZ_LABEL}). Dashed line: what was paid. Blue line: the exit.</p>
            <ValueLines upTo={77} />
            <p className="text-[12px] text-muted">Option values are Black-Scholes mids on made-up volatility. Real weekly options have wide bid-ask spreads, so fills are worse than mids, especially in a fast market.</p>
          </section>

          <section className="panel p-4 space-y-2 text-[13px]" data-testid="sqz-stall">
            <p className="font-semibold text-[14px]">Counterfactual: the same morning, then it stalls</p>
            <p className="tabular-nums">
              Same entry, same calls. The call buying dries up before noon, the stock drifts back to {STALL_BARS[77]!.close.toFixed(2)} by Thursday's close and {STALL_EXPIRY_PRICE.toFixed(2)} at Friday's close. At 1:00 PM ET the calls are worth ${t.stallExitPremium.toFixed(2)} each; at Thursday's close about {usd(t.stallThursdayValue)} in total; at expiry, below the {CALL_STRIKE} strike, {usd(t.stallExpiryValue)}. The whole {usd(t.cost)} is gone.
            </p>
            <CandlestickChart data={STALL_BARS} height={200} markers={markers} highlightIndex={ENTRY_BAR} markerDecimals={0} />
            <p className="text-[11px] text-muted">Green: the squeeze path. Red: the stall path. Same calls, same entry.</p>
            <ValueLines upTo={77} stall />
          </section>

          <section className="panel p-4 space-y-2 text-[13px]" data-testid="sqz-survivorship">
            <p className="font-semibold text-[14px]">Why you hear about the wins: survivorship bias</p>
            <p className="tabular-nums">
              Picture 100 traders each putting $200 into a different chatter stock's weekly calls (made-up numbers to show the filter, not a measured rate). {s.bigWins} turn it into $2,400 or more and post about it. {s.losers} lose most or all of it and stay quiet. Together they paid {usd(s.cost)} and got back {usd(s.back)}: a net {s.net < 0 ? "loss" : "gain"} of {usd(Math.abs(s.net))}.
            </p>
            <p>One story like the case above is real for the person who had it. It says little about the odds for the next person. Ask how many tried, not only who won.</p>
          </section>

          <section className="panel p-4 space-y-2 text-[13px]" data-testid="sqz-mechanics">
            <p className="font-semibold text-[14px]">Short squeeze vs gamma squeeze</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Short squeeze:</strong> a rising price forces short sellers to buy back shares (often under margin pressure), and their buying adds to the rise.</li>
              <li><strong>Gamma squeeze:</strong> dealers who are net short calls buy shares to stay hedged as the calls' delta rises. Gamma is highest near the strike and close to expiry, so crowded weekly strikes matter most.</li>
              <li><strong>Together:</strong> each one's buying lifts the price, which can trigger more of the other. Neither is guaranteed: dealers are not always net short calls, and short sellers may hold or add.</li>
              <li><strong>Clues people watch:</strong> <Link to="/archive?tab=literacy&open=short-interest" className="text-primary underline">short interest</Link> (reported twice a month, so it lags), <Link to="/archive?tab=literacy&open=days-to-cover" className="text-primary underline">days to cover</Link>, <Link to="/archive?tab=literacy&open=open-interest" className="text-primary underline">open interest</Link> by strike and <Link to="/archive?tab=literacy&open=unusual-options-activity" className="text-primary underline">unusual options activity</Link>. None says who is on which side.</li>
              <li><strong>GameStop, January 2021:</strong> the SEC staff's October 2021 report found short covering contributed during some periods but was a small share of buying, and it was positive sentiment, not covering, that sustained the weeks-long rise. Staff found no evidence of a gamma squeeze: retail options volume was mostly put buying, and market makers were buying calls rather than writing them.</li>
            </ul>
          </section>

          <section className="panel p-4 space-y-2 text-[13px]" data-testid="sqz-takeaway">
            <p className="font-semibold text-[14px]">Takeaway</p>
            <p>{SQZ_TLDR}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Size as if the premium goes to zero. Weekly out-of-the-money calls often do.</li>
              <li>Decide the exit and a time stop before you buy, and take the planned exit into strength.</li>
              <li>Call volume and open interest show crowding, not direction. Passing on a move you cannot explain is a sound trade.</li>
            </ul>
            <p className="text-[12px]">
              Practise:{" "}
              <Link to="/training?group=squeezes&start=1" className="text-primary underline">Learn · Squeezes, Options Flow & Survivorship</Link> ·{" "}
              <Link to="/coach/chasing-a-squeeze" className="text-primary underline">Coach · Chasing a squeeze</Link> ·{" "}
              <Link to="/training?group=trading-risk&start=1" className="text-primary underline">Learn · Trading risk</Link> ·{" "}
              <Link to="/academy/options" className="text-primary underline">Academy · Options ladder</Link>
            </p>
            <p className="text-[11px] text-muted">
              Sources:{" "}
              <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf">SEC staff report on early-2021 market conditions (Oct 2021)</a> ·{" "}
              <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.optionseducation.org/advancedconcepts/gamma">OIC: Gamma</a> ·{" "}
              <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.investopedia.com/terms/g/gamma.asp">Investopedia: Gamma</a> ·{" "}
              <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.schwab.com/learn/story/understanding-gamma-squeeze">Schwab: Understanding the gamma squeeze</a> ·{" "}
              <a className="underline" target="_blank" rel="noopener noreferrer" href="https://alexandria.unisg.ch/261487/1/2020_05%20Barbon%20and%20Buraschi%202020%20-%20Gamma%20Fragility.pdf">Barbon &amp; Buraschi, Gamma Fragility</a> ·{" "}
              <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.finra.org/investors/investing/investment-products/options">FINRA: Options</a> ·{" "}
              <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.finra.org/finra-data/browse-catalog/equity-short-interest">FINRA: Equity short interest</a> ·{" "}
              <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.investopedia.com/terms/s/shortsqueeze.asp">Investopedia: Short squeeze and days to cover</a>
            </p>
            <button type="button" data-testid="sqz-restart" onClick={() => { setAnswers({}); setAward(null); }} className={cn("px-3 py-1.5 rounded-lg border border-line hover:border-primary text-[13px] min-h-[44px]")}>
              Play it again
            </button>
          </section>
        </>
      ) : null}
    </PracticeShell>
  );
}

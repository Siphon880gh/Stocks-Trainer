import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { HORIZON_ROWS, NEWS_BIASES, NEWS_BIAS_SOURCES, NEWS_DAY_STEPS, NEWS_VIDEO, BIAS_CHECKLIST } from "../../lib/newsBiases";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">
    {label}
  </Link>
);

/** /practice/news-biases: news-driven short-term options mindset, six biases, and the habits that counter them. */
export default function PracticeNewsBiases() {
  const [picks, setPicks] = useState<Record<string, "good" | "bad">>({});
  const choose = (id: string, v: "good" | "bad") => {
    if (picks[id]) return;
    const next = { ...picks, [id]: v };
    setPicks(next);
    if (NEWS_DAY_STEPS.every((s) => next[s.id])) markMiscPracticeDone("news-biases");
  };
  const right = NEWS_DAY_STEPS.filter((s) => picks[s.id] === "good").length;
  return (
    <PracticeShell
      title="News, biases & short-term options"
      blurb="How long a news idea needs, the biases news days trigger, and the habits that keep a plan in charge. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="nb-horizon">
        <p className="font-semibold text-[14px]">How long does a news idea need?</p>
        <p>
          Many news stories take weeks to play out: guidance gets digested, analysts revise, follow-up headlines arrive. For an option on a news idea, the expiry is a trade-off between cost
          and time. A horizon of about two months is a common middle ground.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="py-1 pr-2">Expiry</th>
                <th className="py-1 pr-2">Premium</th>
                <th className="py-1 pr-2">Time decay</th>
                <th className="py-1">Fit for a news idea</th>
              </tr>
            </thead>
            <tbody>
              {HORIZON_ROWS.map((r) => (
                <tr key={r.horizon} className="border-b border-line/60 align-top">
                  <td className="py-1 pr-2 font-medium">{r.horizon}</td>
                  <td className="py-1 pr-2">{r.cost}</td>
                  <td className="py-1 pr-2">{r.timeDecay}</td>
                  <td className="py-1">{r.fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px]">
          More on short expiries: {term("short-dated-option", "short-dated option")} · {term("leaps", "LEAPS")} ·{" "}
          <Link to="/training?group=trading-risk&start=1" className="text-primary underline">Learn · Float, Short-Dated Options & Risk</Link> ·{" "}
          <Link to="/coach/options-horizon-mismatch" className="text-primary underline">Coach · horizon mismatch</Link> ·{" "}
          <Link to="/practice/gamma-squeeze" className="text-primary underline">Gamma squeeze case</Link>
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="nb-biases">
        <p className="font-semibold text-[14px]">Six biases news days trigger</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {NEWS_BIASES.map((b) => (
            <div key={b.id} className="panel p-3 space-y-1" data-bias={b.id}>
              <p className="font-semibold">{term(b.id, b.name)}</p>
              <p>{b.definition}</p>
              <p className="text-[12px]"><span className="font-medium">News example:</span> {b.newsExample}</p>
              <p className="text-[12px]"><span className="font-medium">Countermeasure:</span> {b.countermeasure}</p>
              {b.source ? (
                <a href={b.source.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted underline">{b.source.label}</a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="nb-reaction">
        <p className="font-semibold text-[14px]">Too fast, too slow: over- and underreaction</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Information overload.</strong> When many companies report on the same day, prices react less at first and drift more afterwards (Hirshleifer, Lim & Teoh 2009). For a
            trader, overload shows up as {term("overtrading", "overtrading")}: many small trades, each after a new headline. Limit your sources and decide before the open what would make you act.
          </li>
          <li>
            <strong>Overreaction.</strong> Large moves without identifiable news tend to partly reverse in the following weeks, mostly in smaller, less liquid stocks; moves on real news tend
            to keep drifting, especially after bad news (Chan 2003).
          </li>
          <li>
            <strong>Underreaction.</strong> Limited attention slows the market: information that is less eye-catching, such as how efficiently a company turns research spending into patents,
            is priced slowly (Hirshleifer, Hsu & Li 2013), and news about a big customer reaches its suppliers' stocks with a lag (Cohen & Frazzini 2008).
          </li>
          <li>
            <strong>Headlines can flip.</strong> After the broad tariffs announced on April 2, 2025, the S&P 500 fell more than 12% in four sessions; on April 9 a 90-day pause for most
            countries was announced and the index rose 9.5% that day, its biggest gain since 2008. Positions sized for one headline met the opposite one a week later.
          </li>
        </ul>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="nb-strategies">
        <p className="font-semibold text-[14px]">Habits that counter the biases</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Set both exits before the news: OCO and brackets.</strong> A one-cancels-the-other order places a target (sell limit) and a stop together; when one fills, the other is
            cancelled. A bracket attaches that pair to your entry. Some brokers send bracket exits as market orders, so a gap can fill you far from your price. Practise it on the{" "}
            <Link to="/paper" className="text-primary underline">paper account</Link> (attach stop / target).
          </li>
          <li><strong>Seek contrary evidence.</strong> Write the best case against your trade and what would prove you wrong before you enter.</li>
          <li>
            <strong>Audit your source.</strong> Hype in group chats and social feeds, promises of big returns and requests for screenshots of your buys are classic pump-and-dump signs
            (Investor.gov, FINRA). Find the original filing or release.
          </li>
          <li>
            <strong>The "do nothing" rule.</strong> No edge, no trade. See {term("no-trade-zone", "the no-trade zone")}.
          </li>
          <li>
            <strong>Run a bias check on the ticket.</strong> The paper order ticket has an optional bias check (off by default) with these questions:
            <ul className="list-[circle] pl-5 mt-1">
              {BIAS_CHECKLIST.map((c) => (
                <li key={c.id}>{c.label}</li>
              ))}
            </ul>
          </li>
          <li>
            Watch:{" "}
            <a href={`https://www.youtube.com/watch?v=${NEWS_VIDEO.id}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {NEWS_VIDEO.title}
            </a>{" "}
            ({NEWS_VIDEO.channel}).
          </li>
        </ul>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="nb-day">
        <p className="font-semibold text-[14px]">A news day: spot the bias</p>
        {NEWS_DAY_STEPS.map((s) => {
          const p = picks[s.id];
          const bias = NEWS_BIASES.find((b) => b.id === s.bias)!;
          return (
            <div key={s.id} className="panel p-3 space-y-2" data-step={s.id}>
              <p className="font-medium">{s.headline}</p>
              <p>{s.ask}</p>
              <div className="grid sm:grid-cols-2 gap-1.5">
                <button type="button" disabled={!!p} data-pick="bad" onClick={() => choose(s.id, "bad")} className={cn("text-left px-3 py-2 rounded-md border text-[12px] min-h-[44px]", p === "bad" ? "border-accent-red bg-accent-red/10" : "border-line hover:border-primary")}>
                  Yes, act on it now
                </button>
                <button type="button" disabled={!!p} data-pick="good" onClick={() => choose(s.id, "good")} className={cn("text-left px-3 py-2 rounded-md border text-[12px] min-h-[44px]", p ? "border-up bg-up/10" : "border-line hover:border-primary")}>
                  No: check the plan first
                </button>
              </div>
              {p ? (
                <p className="text-[12px]" data-testid="nb-day-feedback">
                  <strong className={p === "good" ? "text-up" : "text-accent-red"}>{p === "good" ? "Right. " : "That's the bias talking. "}</strong>
                  {bias.name}: {s.bad} Better: {s.good}
                </p>
              ) : null}
            </div>
          );
        })}
        <p className="text-[12px] text-muted tabular-nums" data-testid="nb-day-score">{right} / {NEWS_DAY_STEPS.length} checkpoints right</p>
        <p className="text-[12px]">
          Practise:{" "}
          <Link to="/training?group=news-biases&start=1" className="text-primary underline">Learn · News, Biases & Short-Term Options</Link> ·{" "}
          <Link to="/coach/news-day-decision" className="text-primary underline">Coach · A news-day decision</Link>
        </p>
        <p className="text-[11px] text-muted">
          Sources:{" "}
          {NEWS_BIAS_SOURCES.map((s, i) => (
            <span key={s.url}>
              {i ? " · " : ""}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">{s.label}</a>
            </span>
          ))}
        </p>
      </section>
    </PracticeShell>
  );
}

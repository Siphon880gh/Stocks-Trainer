import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PaperSession from "../../components/academy/paper/PaperSession";
import SimulatedBanner from "../../components/academy/SimulatedBanner";
import { CHALLENGES, SCORE_MAX, THEME_LABELS, challengeOfTheWeek, endBar, getChallenge, leaderboard, newChallengeLog, scoreChallenge, type Challenge, type ChallengeScore, type Goal, type Rule } from "../../lib/academy/challenges";
import { getTape } from "../../lib/academy/paper/tapes";
import { TYPE_LABELS, money } from "../../lib/academy/paper/describe";
import { addCounters, countersFor } from "../../lib/academy/paper/counters";
import { replay } from "../../lib/academy/paper/session";
import type { PaperSessionLog } from "../../lib/academy/paper/types";
import { loadPaper, savePaper, type KVStorage } from "../../lib/academy/storage";
import { awardChallenge } from "../../lib/academy/rewards/award";
import { glossaryHref } from "../../lib/academy/refs";
import { getLiteracyTerm } from "../../lib/literacyTerms";
import { cn } from "../../lib/utils";

const pctTxt = (x: number) => `${Math.round(x * 100)}%`;
export function ruleText(r: Rule): string {
  switch (r.kind) {
    case "max-position-pct": return `Keep any position at or under ${pctTxt(r.pct)} of the account.`;
    case "stop-within": return r.bars === 0 ? "Place a protective sell stop on the bar your entry fills." : `Place a protective sell stop within ${r.bars} bar${r.bars === 1 ? "" : "s"} of the entry.`;
    case "max-drawdown": return `Never let the account fall more than ${pctTxt(r.pct)} from its high.`;
    case "no-averaging-down": return "Do not buy more below your average cost.";
    case "min-trades": return `Make at least ${r.n} trade${r.n === 1 ? "" : "s"}.`;
    case "max-trades": return `Make at most ${r.n} trades.`;
  }
}
export function goalText(g: Goal): string {
  switch (g.kind) {
    case "return-pct": return `Finish up at least ${g.pct}%.`;
    case "loss-contained": return `Trade, and finish no worse than −${g.pct}%.`;
    case "limit-below-market": return "Get a buy limit filled below the price when you placed it.";
    case "trailing-exit": return "Exit with a trailing stop.";
    case "stop-exit": return "Let a protective stop take you out.";
    case "buy-at-or-below": return `Buy at ${money(g.price)} or lower.`;
    case "buy-stop-entry": return "Enter with a buy stop.";
    case "flat-at-end": return "Trade, and finish with no open position.";
  }
}

function Result({ c, s, best, onAgain }: { c: Challenge; s: ChallengeScore; best: number | null; onAgain: () => void }) {
  return (
    <div className={cn("panel p-3 space-y-2", s.passed ? "border-up" : "border-accent-red/50")} data-testid="challenge-result" data-passed={s.passed ? "true" : "false"}>
      <p className="font-semibold">
        {s.score}/{SCORE_MAX} · {s.passed ? "Challenge passed" : "Not passed yet"}
      </p>
      <p className="text-[12px] text-muted">
        Discipline {s.discipline}/60 · Result {s.result}/40 · return {s.returnPct.toFixed(2)}% (simulated)
      </p>
      {s.breaches.length ? (
        <ul className="text-[12px] text-accent-red list-disc pl-4">
          {s.breaches.map((b, i) => (
            <li key={i}>{b.message}</li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-up">Every rule held.</p>
      )}
      <p className="text-[13px]">{c.debrief}</p>
      <LeaderboardTable c={c} best={best} />
      <button type="button" onClick={onAgain} className="px-3 py-1.5 rounded-md border border-line text-[13px]" data-testid="challenge-again">
        Try again
      </button>
    </div>
  );
}

function LeaderboardTable({ c, best }: { c: Challenge; best: number | null }) {
  const rows = leaderboard(c, best);
  return (
    <table className="w-full text-[12px]" data-testid="leaderboard">
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} className={r.benchmark ? "" : "font-semibold text-sim"}>
            <td className="py-0.5 pr-2 tabular-nums">#{r.rank}</td>
            <td className="py-0.5">{r.name}</td>
            <td className="py-0.5 text-right tabular-nums">{r.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** /paper/challenges and /paper/challenges/:challengeId — BA6.M4. Practice scores only; nothing leaves the device. */
export default function PaperChallenges({ storage, now = new Date() }: { storage?: KVStorage; now?: Date }) {
  const { challengeId } = useParams();
  const c = challengeId ? getChallenge(challengeId) : undefined;
  const [store, setStore] = useState(() => loadPaper(storage).state);
  const [log, setLog] = useState<PaperSessionLog | null>(c ? newChallengeLog(c) : null);
  const [result, setResult] = useState<ChallengeScore | null>(null);
  const [forId, setForId] = useState(challengeId);
  if (forId !== challengeId) {
    // same component instance across /paper/challenges ↔ /paper/challenges/:id: reset the play state
    setForId(challengeId);
    setLog(c ? newChallengeLog(c) : null);
    setResult(null);
  }
  const week = challengeOfTheWeek(now);
  const bestOf = (id: string) => {
    const a = store.challengeAttempts[id] ?? [];
    return a.length ? Math.max(...a.map((x) => x.score)) : null;
  };

  const onLog = useCallback(
    (next: PaperSessionLog) => {
      setLog(next);
      if (!c || next.bar < endBar(c)) return;
      const s = scoreChallenge(c, next);
      setResult(s);
      setStore((prev) => {
        const attempts = [...(prev.challengeAttempts[c.id] ?? []), { score: s.score, max: s.max, passed: s.passed, at: new Date().toISOString() }];
        const upd = { ...prev, challengeAttempts: { ...prev.challengeAttempts, [c.id]: attempts }, stats: addCounters(prev.stats, countersFor(replay(next))) };
        savePaper(upd, storage);
        return upd;
      });
      awardChallenge(c.id, s.passed, storage);
    },
    [c, storage],
  );

  if (challengeId && !c) {
    return (
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        <p className="panel p-4">
          That challenge does not exist. <Link to="/paper/challenges" className="text-primary underline">All challenges</Link>
        </p>
      </main>
    );
  }

  if (c && log) {
    const tape = getTape(c.tapeId)!;
    return (
      <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full space-y-4" data-testid="challenge-play" data-challenge={c.id}>
        <p className="text-[12px] text-muted">
          <Link to="/paper/challenges" className="hover:text-ink">
            Challenges
          </Link>{" "}
          · {THEME_LABELS[c.theme]}
        </p>
        <h1 className="text-xl font-semibold tracking-tight">{c.title}</h1>
        <div className="panel p-3 grid md:grid-cols-2 gap-3 text-[13px]">
          <div className="space-y-1">
            <p>{c.intro}</p>
            <p className="text-[12px] text-muted">
              {tape.symbol} · {c.bars} bars · {money(c.startingCash)} virtual · orders: {c.allowedOrderTypes.map((t) => TYPE_LABELS[t]).join(", ")}
            </p>
            <p className="text-[12px]">
              {c.terms.map((t, i) => (
                <span key={t}>
                  {i ? " · " : ""}
                  <Link to={glossaryHref(t)} className="text-primary underline">
                    {getLiteracyTerm(t)?.name ?? t}
                  </Link>
                </span>
              ))}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-[12px] uppercase text-muted">Rules (60 points)</p>
            <ul className="list-disc pl-4 text-[12px]">{c.rules.map((r, i) => <li key={i}>{ruleText(r)}</li>)}</ul>
            <p className="font-semibold text-[12px] uppercase text-muted">Goals (40 points)</p>
            <ul className="list-disc pl-4 text-[12px]">{c.goals.map((g, i) => <li key={i}>{goalText(g)}</li>)}</ul>
          </div>
        </div>
        <PaperSession
          log={log}
          onLog={onLog}
          allowedTypes={c.allowedOrderTypes}
          lastBar={endBar(c)}
          finished={result ? <Result c={c} s={result} best={bestOf(c.id)} onAgain={() => { setResult(null); setLog(newChallengeLog(c)); }} /> : undefined}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full space-y-4" data-testid="challenge-list">
      <p className="text-[12px] text-muted">
        <Link to="/academy" className="hover:text-ink">
          Academy
        </Link>{" "}
        ·{" "}
        <Link to="/paper" className="hover:text-ink">
          Paper trading
        </Link>{" "}
        · Challenges
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Paper-trading challenges</h1>
      <p className="text-[13px] text-muted max-w-3xl">
        Short scenarios on SAMPLE tapes. Following the rules earns 60 of the 100 points, so a disciplined loss beats a lucky rule-break. Benchmarks are fictional scripted
        plays.
      </p>
      <SimulatedBanner />
      <Link to={`/paper/challenges/${week.id}`} className="panel p-4 block border-sim/50 hover:border-sim" data-testid="challenge-of-the-week" data-challenge={week.id}>
        <p className="text-[12px] text-sim font-semibold uppercase">Challenge of the week</p>
        <p className="font-semibold">{week.title}</p>
        <p className="text-[13px] text-muted">{week.intro}</p>
      </Link>
      <div className="grid sm:grid-cols-2 gap-3">
        {CHALLENGES.map((ch) => {
          const best = bestOf(ch.id);
          const passed = (store.challengeAttempts[ch.id] ?? []).some((a) => a.passed);
          return (
            <Link key={ch.id} to={`/paper/challenges/${ch.id}`} className="panel p-3 block hover:border-sim space-y-1" data-challenge={ch.id}>
              <p className="text-[11px] text-muted uppercase">{THEME_LABELS[ch.theme]}</p>
              <p className="font-semibold text-[14px]">
                {ch.title} {passed ? <span className="material-symbols-outlined text-up text-base align-middle" aria-label="passed">check_circle</span> : null}
              </p>
              <p className="text-[12px] text-muted">{best === null ? "Not tried yet" : `Best ${best}/${SCORE_MAX}`}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

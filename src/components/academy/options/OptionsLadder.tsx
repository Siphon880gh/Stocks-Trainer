import { useState } from "react";
import { Link } from "react-router-dom";
import type { AnswerLetter } from "../../../lib/academy/types";
import { LADDER_LEVELS, strategiesForLevel, type LadderLevel } from "../../../lib/academy/options/ladder";
import { fmtUsd, summarize } from "../../../lib/academy/options/payoff";
import { CHECK_PASS, checksForLevel, gradeChecks } from "../../../lib/academy/options/checks";
import { LADDER, MAX_ATTEMPTS, acknowledge, afterCheck, canAttempt, isOptionsLevelPassed, isOptionsLevelUnlocked, recordOptionsAttempt } from "../../../lib/academy/options/gate";
import { OPTIONS_RISK_STATEMENT } from "../../../lib/academy/copy";
import { loadAcademy, saveAcademy, type KVStorage } from "../../../lib/academy/storage";
import { resolveRef } from "../../../lib/academy/refs";
import { awardOptionsLevel } from "../../../lib/academy/rewards/award";
import PayoffChart from "./PayoffChart";
import { cn } from "../../../lib/utils";

const BLOCK_TEXT = {
  locked: "Pass the previous level first.",
  "not-acknowledged": "Tick the risk acknowledgement to start this level's check.",
  "already-passed": "Passed.",
  "too-many-attempts": "Three attempts used in the last 24 hours. Re-read the cards and come back later.",
} as const;

function RiskStatement() {
  return (
    <p className="text-[12px] font-semibold text-accent-red border border-accent-red/40 bg-accent-red/5 rounded-md px-3 py-1.5" data-testid="options-risk">
      {OPTIONS_RISK_STATEMENT}
    </p>
  );
}

/** BA8.M3: the options knowledge ladder: four levels of strategies with payoff charts and gated checks. */
export default function OptionsLadder({ storage, now = () => new Date(), initialOpen }: { storage?: KVStorage; now?: () => Date; initialOpen?: LadderLevel }) {
  const [rec, setRec] = useState(() => loadAcademy(storage).state.options);
  const [open, setOpen] = useState<LadderLevel | null>(initialOpen ?? null);
  const [answers, setAnswers] = useState<Record<string, AnswerLetter>>({});
  const [result, setResult] = useState<{ level: LadderLevel; correct: number; total: number; passed: boolean } | null>(null);
  const save = (next: typeof rec) => {
    setRec(next);
    saveAcademy({ ...loadAcademy(storage).state, options: next }, storage);
  };

  return (
    <div className="space-y-4" data-testid="options-ladder">
      <RiskStatement />
      {LADDER_LEVELS.map((info) => {
        const l = info.level;
        const unlocked = isOptionsLevelUnlocked(rec, l);
        const passed = isOptionsLevelPassed(rec, l);
        const gate = canAttempt(rec, l, now());
        const items = checksForLevel(l);
        const chips = info.refs.map((r) => resolveRef(r)).filter((r) => r.ok);
        return (
          <section key={l} className={cn("panel p-4 space-y-3", !unlocked && "opacity-75")} data-level={l} data-unlocked={unlocked ? "true" : "false"} data-passed={passed ? "true" : "false"}>
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h2 className="text-[15px] font-semibold">
                Level {l}: {info.title}
              </h2>
              <span className={cn("text-[12px]", passed ? "text-up" : "text-muted")}>{passed ? "Passed" : unlocked ? "Open" : "Locked"}</span>
            </div>
            <p className="text-[13px] text-muted">{info.summary}</p>
            {unlocked ? (
              <>
                <div className="grid md:grid-cols-2 gap-3">
                  {strategiesForLevel(l).map((s) => {
                    const sum = summarize(s);
                    return (
                      <div key={s.id} className="border border-line rounded-lg p-3 space-y-1.5" data-strategy={s.id}>
                        <p className="font-semibold text-[14px]">
                          {s.name}
                          {s.conceptOnly ? <span className="ml-2 text-[11px] text-accent-red font-semibold">HIGHEST RISK · concept only</span> : null}
                        </p>
                        <p className="text-[12px]">{s.use}</p>
                        <p className="text-[12px] text-muted">Example ($50 stock): {s.legs.map((g) => (g.kind === "stock" ? `own shares at $${g.price}` : `${g.position} ${g.qty > 1 ? `${g.qty}× ` : ""}$${g.strike} ${g.kind} for $${g.premium.toFixed(2)}`)).join(", ")}</p>
                        <PayoffChart strategy={s} />
                        <table className="w-full text-[12px] tabular-nums">
                          <tbody>
                            <tr>
                              <td className="text-muted">Max gain / share</td>
                              <td data-stat="max-gain">{fmtUsd(sum.maxGain)}</td>
                              <td className="text-muted">per contract</td>
                              <td>{fmtUsd(sum.perContract.maxGain)}</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Max loss / share</td>
                              <td data-stat="max-loss">{fmtUsd(sum.maxLoss)}</td>
                              <td className="text-muted">per contract</td>
                              <td>{fmtUsd(sum.perContract.maxLoss)}</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Breakeven</td>
                              <td colSpan={3} data-stat="breakeven">
                                {sum.breakevens.map(fmtUsd).join(" and ")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="text-[12px] text-accent-red">{s.risk}</p>
                      </div>
                    );
                  })}
                </div>
                {chips.length ? (
                  <div className="flex flex-wrap gap-2">
                    {chips.map((c) => (
                      <Link key={c.href} to={c.href} className="px-2.5 py-1 rounded-lg border border-line text-[12px] hover:border-primary">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
                {passed && result?.level === l ? (
                  <p className="text-[13px] font-semibold text-up border-t border-line pt-3" data-testid="check-result">
                    {result.correct}/{result.total} · Level {l} passed{l < LADDER.length ? ` · level ${l + 1} is open` : ""}
                  </p>
                ) : null}
                {!passed ? (
                  <div className="space-y-2 border-t border-line pt-3">
                    <label className="flex items-start gap-2 text-[13px]">
                      <input type="checkbox" checked={!!rec.acknowledged[String(l)]} onChange={() => save(acknowledge(rec, l, now()))} disabled={!!rec.acknowledged[String(l)]} data-testid={`ack-${l}`} />
                      <span>I understand options can lose 100% of the premium quickly, and that passing this check is education, not approval to trade options.</span>
                    </label>
                    <p className="text-[12px] text-muted">
                      {items.length} questions · {Math.round(CHECK_PASS * 100)}% to pass · {gate.remaining}/{MAX_ATTEMPTS} attempts left in 24 h {gate.ok ? "" : `· ${BLOCK_TEXT[gate.reason!]}`}
                    </p>
                    {open === l ? (
                      <div className="space-y-2" data-testid={`check-${l}`}>
                        {items.map((q, qi) => (
                          <div key={q.id} className="space-y-1" data-item={q.id}>
                            <p className="text-[13px] font-medium">
                              {qi + 1}. {q.prompt}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-1">
                              {q.options.map((o) => (
                                <button key={o.id} type="button" disabled={!!result} onClick={() => setAnswers({ ...answers, [q.id]: o.id })} aria-pressed={answers[q.id] === o.id} className={cn("text-left px-2.5 py-1.5 rounded-md border text-[12px]", answers[q.id] === o.id ? "border-primary bg-primary/5" : "border-line")}>
                                  <span className="font-semibold mr-1">{o.id}</span>
                                  {o.label}
                                </button>
                              ))}
                            </div>
                            {result ? <p className="text-[12px]">{answers[q.id] === q.correctAnswer ? "Right. " : `Not quite (answer ${q.correctAnswer}). `}{q.explanation}</p> : null}
                          </div>
                        ))}
                        {!result ? (
                          <button
                            type="button"
                            disabled={items.some((q) => !answers[q.id]) || !canAttempt(rec, l, now()).ok}
                            onClick={() => {
                              const g = gradeChecks(l, answers);
                              save(recordOptionsAttempt(rec, l, g.passed, now()));
                              setResult({ level: l, ...g });
                              if (g.passed) awardOptionsLevel(l, storage);
                            }}
                            className="px-4 py-2 rounded-md bg-primary text-white text-[13px] font-semibold disabled:opacity-40"
                            data-testid={`submit-check-${l}`}
                          >
                            Check my answers
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <p className={cn("text-[13px] font-semibold", result.passed ? "text-up" : "text-accent-red")} data-testid="check-result">
                              {result.correct}/{result.total} · {result.passed ? `Level ${l} passed` : "Not passed yet"}
                            </p>
                            {(() => {
                              const next = afterCheck(rec, l, now());
                              if (next.kind === "retry")
                                return (
                                  <button type="button" onClick={() => { setAnswers({}); setResult(null); }} className="px-3 py-1.5 rounded-md border border-line text-[13px]" data-testid={`retry-check-${l}`}>
                                    Try again ({next.remaining} left in 24 h)
                                  </button>
                                );
                              if (next.kind === "blocked")
                                return (
                                  <p className="text-[12px] text-muted" data-testid={`blocked-check-${l}`}>
                                    {BLOCK_TEXT[next.reason]}
                                    {next.nextAt ? ` Next attempt after ${new Date(next.nextAt).toLocaleString()}.` : ""}{" "}
                                    <button type="button" onClick={() => { setOpen(null); setAnswers({}); setResult(null); }} className="underline">
                                      Close
                                    </button>
                                  </p>
                                );
                              return null;
                            })()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button type="button" disabled={!gate.ok} onClick={() => { setOpen(l); setAnswers({}); setResult(null); }} className="px-3 py-1.5 rounded-md bg-primary text-white text-[13px] font-semibold disabled:opacity-40" data-testid={`start-check-${l}`}>
                        Start the level {l} check
                      </button>
                    )}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-[12px] text-muted">Locked: pass level {l - 1} to open it.</p>
            )}
          </section>
        );
      })}
      <RiskStatement />
      <p className="sr-only">{LADDER.length} levels</p>
    </div>
  );
}

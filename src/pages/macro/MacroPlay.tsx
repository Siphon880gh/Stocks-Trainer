import { Fragment, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MACRO_ROUNDS } from "../../lib/macro/game";
import { getRelease } from "../../lib/macro/releases";
import { REGIME_NAMES } from "../../lib/macro/reactions";
import { loadMacroProgress, recordRound } from "../../lib/macro/macroProgress";
import MacroDeskRound from "../../components/macro/MacroDeskRound";
import { scrollToTopOf } from "../../lib/scrollReset";

/** /macro/play — every Macro Desk round in storyline order (?round=<id> to jump). */
export default function MacroPlay() {
  const [params] = useSearchParams();
  const start = Math.max(0, MACRO_ROUNDS.findIndex((r) => r.id === params.get("round")));
  const [idx, setIdx] = useState(start);
  const [progress, setProgress] = useState(() => loadMacroProgress());
  const round = MACRO_ROUNDS[idx]!;
  const mainRef = useRef<HTMLElement>(null);
  const goTo = (i: number) => {
    setIdx(i);
    scrollToTopOf(mainRef.current, window);
  };
  return (
    <main ref={mainRef} className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full space-y-4">
      <p className="text-[12px] text-muted">
        <Link to="/training" className="hover:text-ink">
          Learn
        </Link>{" "}
        ·{" "}
        <Link to="/macro" className="hover:text-ink">
          Macro Desk
        </Link>{" "}
        · Play
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-lg font-semibold">
          Round {idx + 1} of {MACRO_ROUNDS.length}
        </h1>
        <select aria-label="Jump to round" value={round.id} onChange={(e) => goTo(MACRO_ROUNDS.findIndex((r) => r.id === e.target.value))} className="ml-auto border border-line rounded px-2 py-1 text-[13px] bg-surface">
          {MACRO_ROUNDS.map((r, i) => (
            <option key={r.id} value={r.id}>
              {i + 1}. {getRelease(r.eventId)!.period} — {REGIME_NAMES[getRelease(r.eventId)!.regime]} {progress.rounds[r.id] ? `✓ ${progress.rounds[r.id]!.best}/${progress.rounds[r.id]!.total}` : ""}
            </option>
          ))}
        </select>
      </div>
      <Fragment key={round.id}>
      <MacroDeskRound
        round={round}
        onComplete={(c, t) => setProgress(recordRound(round.id, c, t))}
        onNext={idx < MACRO_ROUNDS.length - 1 ? () => goTo(idx + 1) : undefined}
      />
      </Fragment>
    </main>
  );
}

import { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { canStartCasePack, isChartGateComplete } from "../lib/beginnerPath";
import {
  CASE_LIBRARY_COUNT,
  CASE_PACKS,
  listCaseStudies,
  type CasePackId,
} from "../lib/caseStudies";
import { DECISION_MAKER_PATH_ID, getPathId } from "../lib/progressStore";

const VALID_PACKS = new Set(CASE_PACKS.map((p) => p.id));

export default function Cases() {
  const [searchParams] = useSearchParams();
  const packParam = searchParams.get("pack");
  const focusPack =
    packParam && VALID_PACKS.has(packParam as CasePackId)
      ? (packParam as CasePackId)
      : null;
  const focusRef = useRef<HTMLElement | null>(null);
  const chartOk = isChartGateComplete();
  const pathId = getPathId();
  const beginnerOnly = pathId !== DECISION_MAKER_PATH_ID;

  const orderedPacks = useMemo(() => {
    if (!focusPack) return CASE_PACKS;
    const focused = CASE_PACKS.filter((p) => p.id === focusPack);
    const rest = CASE_PACKS.filter((p) => p.id !== focusPack);
    return [...focused, ...rest];
  }, [focusPack]);

  useEffect(() => {
    if (!focusPack || !focusRef.current) return;
    focusRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusPack, orderedPacks]);

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen flex flex-col font-display">
      <header className="border-b border-primary/30 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-mono text-xs tracking-widest">DASHBOARD</span>
        </Link>
        <p className="font-mono text-[10px] text-primary/50 uppercase">Cases · SAMPLE</p>
      </header>
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Case Studies
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-mono">
            Anti-hindsight: decide before aftermath. Library size:{" "}
            {CASE_LIBRARY_COUNT} (E5.M5 target ≥20).
            {beginnerOnly ? " Beginner path: beginner difficulty only." : null}
          </p>
          {focusPack ? (
            <p className="text-[11px] font-mono text-primary/70 mt-2">
              FOCUS_PACK · {focusPack}
            </p>
          ) : null}
        </div>

        {!chartOk ? (
          <div className="border border-yellow-500/40 rounded-xl p-4 text-sm text-yellow-200/90 font-mono">
            Chart soft-gate required. Complete Indicators literacy on{" "}
            <Link to="/training" className="text-primary underline">
              Training
            </Link>{" "}
            first.
          </div>
        ) : null}

        {orderedPacks.map((meta) => {
          const packId = meta.id as CasePackId;
          const unlocked = canStartCasePack(packId);
          const pack = listCaseStudies(packId).filter((c) =>
            beginnerOnly ? c.difficulty === "beginner" : true
          );
          if (pack.length === 0) return null;
          const isFocus = focusPack === packId;
          return (
            <section
              key={packId}
              id={`pack-${packId}`}
              ref={isFocus ? focusRef : undefined}
              className={`space-y-3 ${
                isFocus ? "rounded-xl border border-primary/50 p-4 bg-primary/5" : ""
              }`}
            >
              <h2 className="text-sm font-bold text-primary/80 uppercase tracking-widest">
                {meta.name} ({pack.length})
                {isFocus ? " · PATH_FOCUS" : ""}
              </h2>
              <p className="text-xs text-slate-500 font-mono">{meta.description}</p>
              {!unlocked ? (
                <p className="text-xs text-slate-500 font-mono">
                  Locked — finish prior Beginner Path steps (or chart gate).
                </p>
              ) : null}
              <ul className="space-y-2">
                {pack.map((c) => (
                  <li key={c.id}>
                    {unlocked ? (
                      <Link
                        to={`/cases/${c.id}`}
                        className="block border border-primary/20 hover:border-primary/50 rounded-lg px-4 py-3 font-mono text-sm"
                      >
                        <span className="text-primary">{c.title}</span>
                        <span className="text-slate-500 text-xs ml-2">
                          {c.thinkingMode} · {c.difficulty}
                        </span>
                      </Link>
                    ) : (
                      <div className="border border-white/5 rounded-lg px-4 py-3 font-mono text-sm text-slate-600">
                        {c.title}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}

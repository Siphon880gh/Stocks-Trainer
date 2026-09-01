import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  canStartCasePack,
  CHART_GATE_TRAINING_GROUP,
  isChartGateComplete,
  isChartGateTemporarilyBypassed,
  setChartGateTemporaryBypass,
} from "../lib/beginnerPath";
import {
  CASE_LIBRARY_COUNT,
  CASE_PACKS,
  listCaseStudies,
  type CasePackId,
} from "../lib/caseStudies";
import {
  NAVIGATOR_CLASS_LABELS,
  parseMarketClassParam,
} from "../lib/marketNavigator";
import { DECISION_MAKER_PATH_ID, getPathId } from "../lib/progressStore";
import type { AssetClass } from "../lib/samplePacks";
import { thinkingModeLabel } from "../lib/thinkingModeTips";

const VALID_PACKS = new Set(CASE_PACKS.map((p) => p.id));

const CLASS_TO_PACKS: Partial<Record<AssetClass, CasePackId[]>> = {
  equity: ["earnings", "company-news", "macro-news", "combined"],
  future: ["futures"],
  forex: ["forex"],
  crypto: ["crypto"],
  option_context: ["options-context"],
};

export default function Cases() {
  const [searchParams] = useSearchParams();
  const packParam = searchParams.get("pack");
  const marketClass =
    parseMarketClassParam(searchParams.get("market")) ??
    parseMarketClassParam(searchParams.get("class"));
  const focusPack =
    packParam && VALID_PACKS.has(packParam as CasePackId)
      ? (packParam as CasePackId)
      : null;
  const focusRef = useRef<HTMLElement | null>(null);
  const [tempBypass, setTempBypass] = useState(isChartGateTemporarilyBypassed);
  const gateDone = isChartGateComplete();
  const chartOk = gateDone || tempBypass;
  const pathId = getPathId();
  const beginnerOnly = pathId !== DECISION_MAKER_PATH_ID;

  const orderedPacks = useMemo(() => {
    let packs = CASE_PACKS;
    if (marketClass) {
      const allowed = new Set(CLASS_TO_PACKS[marketClass] ?? []);
      packs = CASE_PACKS.filter((p) => allowed.has(p.id as CasePackId));
    }
    if (!focusPack) return packs;
    const focused = packs.filter((p) => p.id === focusPack);
    const rest = packs.filter((p) => p.id !== focusPack);
    return [...focused, ...rest];
  }, [focusPack, marketClass]);

  useEffect(() => {
    if ((!focusPack && !marketClass) || !focusRef.current) return;
    focusRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusPack, marketClass, orderedPacks]);

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen flex flex-col font-display">
      <header className="border-b border-primary/30 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-mono text-xs tracking-widest">DASHBOARD</span>
        </Link>
        <p className="font-mono text-[10px] text-primary/50 uppercase">Cases · practice</p>
      </header>
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Case Studies
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Read the setup, pick buy, sell, or hold, then see what happened.{" "}
            {CASE_LIBRARY_COUNT} practice cases.
            {beginnerOnly
              ? " Your beginner path shows beginner cases only."
              : null}
          </p>
          {focusPack ? (
            <p className="text-[11px] text-primary/70 mt-2">
              Showing: {CASE_PACKS.find((p) => p.id === focusPack)?.name ?? focusPack}
            </p>
          ) : null}
          {marketClass ? (
            <p className="text-[11px] text-primary/70 mt-2">
              Showing: {NAVIGATOR_CLASS_LABELS[marketClass]}
              {marketClass === "forex"
                ? ". Practice only, not a live FX desk."
                : marketClass === "option_context"
                  ? ". No options chain or Greeks here."
                  : " practice."}
            </p>
          ) : null}
        </div>

        {!chartOk ? (
          <div className="border border-primary/35 rounded-xl p-4 space-y-3 bg-primary/5">
            <p className="text-sm text-slate-200 leading-relaxed">
              Cases make more sense after a short Indicators pass on Training —
              so the chart language in each brief is familiar. Want to look
              around first? You can open cases for this browser session only.
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Temporary — clears when you close the tab. Does not mark Indicators
              complete in your saved progress.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to={`/training?group=${CHART_GATE_TRAINING_GROUP}&start=1`}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-background-dark"
              >
                Take Indicators quiz
              </Link>
              <button
                type="button"
                onClick={() => {
                  setChartGateTemporaryBypass(true);
                  setTempBypass(true);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-primary/50 px-3 py-2 text-sm font-mono text-primary hover:bg-primary/10"
              >
                Browse cases this session
              </button>
            </div>
          </div>
        ) : tempBypass && !gateDone ? (
          <div className="border border-yellow-500/30 rounded-xl px-4 py-3 text-xs font-mono text-yellow-100/80 space-y-2">
            <p>
              Temporary session peek is on — Indicators progress is not saved.
              Finish Indicators on Training when you want it permanent.
            </p>
            <button
              type="button"
              onClick={() => {
                setChartGateTemporaryBypass(false);
                setTempBypass(false);
              }}
              className="text-primary underline"
            >
              Turn off temporary peek
            </button>
          </div>
        ) : null}

        <p className="text-[11px] text-primary/60">
          Tip:{" "}
          <Link to="/coach/chase-vs-fade" className="underline text-primary">
            walk through chase vs fade
          </Link>{" "}
          before the company-news cases.
        </p>

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
              </h2>
              <p className="text-xs text-slate-500">{meta.description}</p>
              {!unlocked ? (
                <p className="text-xs text-slate-500">
                  Locked. Finish the earlier beginner-path steps first.
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
                          {thinkingModeLabel(c.thinkingMode)} ·{" "}
                          {c.difficulty === "beginner" ? "Beginner" : "Intermediate"}
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

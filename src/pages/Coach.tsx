import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MarketNavigator from "../components/MarketNavigator";
import { listSessions } from "../lib/coaching";
import { canBrowseAssetClass, isChartGateTemporarilyBypassed } from "../lib/beginnerPath";
import {
  assetClassFromCoachTags,
  coachSessionMatchesClass,
  parseMarketClassParam,
} from "../lib/marketNavigator";
import { isCoachingSessionComplete } from "../lib/progressStore";
import type { AssetClass } from "../lib/samplePacks";

export default function Coach() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") ?? "";
  const classFromUrl = parseMarketClassParam(
    searchParams.get("class") ?? searchParams.get("market"),
  );
  const classFilter = classFromUrl ?? "equity";
  const sessions = listSessions();
  const topics = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.topic))).sort(),
    [sessions]
  );
  const [topicFilter, setTopicFilter] = useState(topicParam);
  const [peekOn, setPeekOn] = useState(isChartGateTemporarilyBypassed);

  const filtered = sessions.filter((s) => {
    if (topicFilter && s.topic !== topicFilter) return false;
    if (!coachSessionMatchesClass(s.tags, classFilter)) return false;
    if (!peekOn && !canBrowseAssetClass(assetClassFromCoachTags(s.tags))) {
      return false;
    }
    return true;
  });

  const onTopicChange = (topic: string) => {
    setTopicFilter(topic);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (topic) p.set("topic", topic);
      else p.delete("topic");
      return p;
    });
  };

  const onSelectClass = (assetClass: AssetClass) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("class", assetClass);
      return p;
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Step coaching
          </h1>
          <p className="text-muted text-sm mt-2">
            Deterministic decision trees. Fail, read the correction, rewind, then finish a success
            path. SAMPLE / educational only.
          </p>
        </div>

        <MarketNavigator
          compact
          initialClass={classFilter}
          selectedClass={classFilter}
          onSelectClass={onSelectClass}
          onSessionPeekChange={setPeekOn}
        />

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-[12px] text-muted">
            Topic
            <select
              value={topicFilter}
              onChange={(e) => onTopicChange(e.target.value)}
              className="ml-2 bg-surface border border-line text-ink text-sm px-2 py-1 rounded-md"
            >
              <option value="">All topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <span className="font-mono text-[10px] text-slate-500">
            {filtered.length}/{sessions.length} sessions
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted">
            {!canBrowseAssetClass(classFilter)
              ? "This class is locked. Use Browse this session above to open Futures, Forex, Crypto, and Options context for this tab only."
              : classFromUrl
                ? "No step-coaching sessions seeded for this market type yet. Equities (stocks) has the beginner trees; Futures has a SAMPLE framing session."
                : "No sessions in this topic."}
          </p>
        ) : (
          <ul className="space-y-4" aria-label="Coaching session catalog">
            {filtered.map((meta) => {
              const done = isCoachingSessionComplete(meta.slug);
              return (
                <li key={meta.slug}>
                  <Link
                    to={`/coach/${meta.slug}`}
                    className="block panel p-4 hover:border-primary/40 transition-colors space-y-2"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-lg font-semibold">{meta.title}</h2>
                      <span className="text-[12px] text-muted">
                        {meta.topic}
                        {done ? " · done" : ""}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{meta.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] border border-line px-2 py-0.5 rounded text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

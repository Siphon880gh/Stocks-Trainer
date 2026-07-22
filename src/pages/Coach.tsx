import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listSessions } from "../lib/coaching";
import { isCoachingSessionComplete } from "../lib/progressStore";

export default function Coach() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") ?? "";
  const sessions = listSessions();
  const topics = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.topic))).sort(),
    [sessions]
  );
  const [topicFilter, setTopicFilter] = useState(topicParam);

  const filtered = sessions.filter(
    (s) => !topicFilter || s.topic === topicFilter
  );

  const onTopicChange = (topic: string) => {
    setTopicFilter(topic);
    if (topic) setSearchParams({ topic });
    else setSearchParams({});
  };

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen flex flex-col font-display">
      <header className="border-b border-primary/30 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-mono text-xs tracking-widest">DASHBOARD</span>
        </Link>
        <p className="font-mono text-[10px] text-primary/50 uppercase">
          Step Coaching · No LLM
        </p>
      </header>

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight crt-glow">
            Step Coaching
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-mono normal-case">
            Deterministic decision trees. Fail, read the correction, rewind, then finish a success
            path. SAMPLE / educational only.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="font-mono text-[10px] tracking-widest text-primary/60">
            TOPIC_FILTER
            <select
              value={topicFilter}
              onChange={(e) => onTopicChange(e.target.value)}
              className="ml-2 bg-neutral-dark border border-primary/40 text-primary text-xs px-2 py-1"
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
          <p className="font-mono text-sm text-accent-red">NO_SESSIONS · catalog empty</p>
        ) : (
          <ul className="space-y-4" aria-label="Coaching session catalog">
            {filtered.map((meta) => {
              const done = isCoachingSessionComplete(meta.slug);
              return (
                <li key={meta.slug}>
                  <Link
                    to={`/coach/${meta.slug}`}
                    className="block border-neon bg-neutral-dark/60 p-4 hover:bg-primary/5 transition-colors space-y-2"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-lg font-bold text-primary">{meta.title}</h2>
                      <span className="font-mono text-[10px] text-primary/50 tracking-widest">
                        {meta.topic}
                        {done ? " · DONE" : ""}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 font-mono normal-case">{meta.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] border border-primary/30 px-2 py-0.5 text-primary/70"
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

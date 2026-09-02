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
          <p className="text-sm text-accent-red">No sessions in this topic.</p>
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

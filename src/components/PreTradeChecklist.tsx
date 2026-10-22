import { useState } from "react";
import { HIERARCHY, THEMES, THEMES_QUOTE } from "../lib/patternThemes";

/**
 * The practical hierarchy as an interactive pre-trade checklist (context → location → theme → trigger →
 * invalidation and risk). Used on /practice/pattern-themes and inside the Buy-or-Sell drill.
 */
export default function PreTradeChecklist({ onComplete, compact = false }: { onComplete?: () => void; compact?: boolean }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState("");
  const count = HIERARCHY.filter((h) => done[h.id]).length;
  const toggle = (id: string) =>
    setDone((d) => {
      const n = { ...d, [id]: !d[id] };
      if (HIERARCHY.every((h) => n[h.id])) onComplete?.();
      return n;
    });
  return (
    <section className={compact ? "space-y-2 text-[12px]" : "panel p-4 space-y-2 text-[13px]"} data-testid="pretrade-checklist" aria-label="Pre-trade checklist">
      {!compact && <p className="font-semibold text-[14px]">Pre-trade checklist (the practical hierarchy)</p>}
      <ol className="space-y-2">
        {HIERARCHY.map((h, i) => (
          <li key={h.id} className="flex items-start gap-2">
            <input
              id={`ptc-${h.id}${compact ? "-c" : ""}`}
              type="checkbox"
              className="mt-0.5"
              checked={!!done[h.id]}
              onChange={() => toggle(h.id)}
              data-testid={`ptc-${h.id}`}
            />
            <label htmlFor={`ptc-${h.id}${compact ? "-c" : ""}`} className="flex-1">
              <span className="font-semibold">{i + 1}. {h.step}:</span> {h.ask}
              {h.id === "theme" && (
                <select
                  className="mt-1 block w-full max-w-xs rounded border border-line bg-surface px-2 py-1 text-[12px]"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  aria-label="Which theme is this setup?"
                  data-testid="ptc-theme-select"
                >
                  <option value="">Pick a theme…</option>
                  {THEMES.map((t) => <option key={t.id} value={t.id}>{t.n}. {t.name}</option>)}
                </select>
              )}
            </label>
          </li>
        ))}
      </ol>
      <p className="text-[12px]" data-testid="ptc-status" aria-live="polite">
        {count === HIERARCHY.length
          ? `All 5 checked${theme ? ` (theme: ${THEMES.find((t) => t.id === theme)?.name})` : ""}. ${THEMES_QUOTE}`
          : `${count}/5 checked. Skip none: a setup without a defined invalidation is not ready.`}
      </p>
    </section>
  );
}

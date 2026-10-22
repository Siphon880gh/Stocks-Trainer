import { Link, useSearchParams } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import PreTradeChecklist from "../../components/PreTradeChecklist";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { PATTERNS } from "../../lib/patterns";
import {
  QUICK_MAP, THEMES, THEMES_INTRO, THEMES_QUOTE, THEME_QUESTIONS, getTheme, isThemeId, type ThemeId,
} from "../../lib/patternThemes";
import { cn } from "../../lib/utils";

const NAME = Object.fromEntries(PATTERNS.map((p) => [p.id, p.name]));

/** /practice/pattern-themes: the 17 functional themes, every pattern tagged, quick map, hierarchy checklist. */
export default function PracticePatternThemes() {
  const [params, setParams] = useSearchParams();
  const param = params.get("theme");
  const selected: ThemeId = isThemeId(param) ? param : "continuation";
  const theme = getTheme(selected)!;
  const primary = PATTERNS.filter((p) => p.themes?.primary === selected);
  const secondary = PATTERNS.filter((p) => p.themes?.secondary.includes(selected));
  const pick = (id: ThemeId) => {
    const n = new URLSearchParams(params);
    n.set("theme", id);
    setParams(n, { replace: true });
  };

  return (
    <PracticeShell
      title="Pattern themes"
      blurb="Seventeen functional themes that every familiar candlestick and chart pattern fits into, with every pattern in the Archive tagged, a quick pattern map and a pre-trade checklist. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="pt-intro">
        {THEMES_INTRO.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
      </section>

      <section className="space-y-2" aria-label="Themes">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pick a theme" data-testid="pt-chips">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === selected}
              data-theme={t.id}
              onClick={() => pick(t.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px]",
                t.id === selected ? "border-primary bg-primary text-white" : "border-line bg-surface hover:bg-primary/10",
              )}
            >
              {t.n}. {t.short}
            </button>
          ))}
        </div>

        <article className="panel p-4 space-y-3 text-[13px]" data-testid="pt-theme" data-selected={selected}>
          <h2 className="text-[15px] font-semibold">{theme.n}. {theme.name}</h2>
          <p className="font-medium">Question: {theme.question}</p>
          <ul className="list-disc pl-5 space-y-1">{theme.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          <div>
            <p className="font-semibold">{theme.id === "measured-move" ? "Methods" : theme.id === "confirmation" ? "Confirmation ideas" : "Examples"}</p>
            <ul className="list-disc pl-5 space-y-0.5">{theme.examples.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div data-testid="pt-patterns">
            <p className="font-semibold">In the Archive ({primary.length} primary, {secondary.length} secondary)</p>
            {primary.length + secondary.length === 0 ? (
              <p className="text-muted">A decision theme rather than a shape: it applies to every pattern.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {primary.map((p) => (
                  <Link key={p.id} to={`/archive?open=${p.id}`} data-testid="pt-pattern" className="rounded border border-primary/60 bg-primary/10 px-2 py-0.5 text-[12px]">{p.name}</Link>
                ))}
                {secondary.map((p) => (
                  <Link key={p.id} to={`/archive?open=${p.id}`} data-testid="pt-pattern-secondary" className="rounded border border-line px-2 py-0.5 text-[12px] text-muted">{p.name}</Link>
                ))}
              </div>
            )}
            <p className="pt-2 text-[12px]">
              <Link className="underline text-primary" to={`/archive?theme=${selected}`} data-testid="pt-archive-link">Filter the Archive by this theme</Link>
            </p>
          </div>
        </article>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="pt-map">
        <p className="font-semibold text-[14px]">Quick pattern map</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-[12px]">
            <thead><tr className="text-left text-muted"><th className="py-1 pr-2">Pattern family</th><th className="pr-2">Primary theme</th><th>Possible secondary theme</th></tr></thead>
            <tbody>
              {QUICK_MAP.map((r) => (
                <tr key={r.family} className="border-t border-line/60" data-testid="pt-map-row">
                  <td className="py-1 pr-2">
                    {r.patterns.map((id, i) => (
                      <span key={id}>{i > 0 && " · "}<Link className="underline" to={`/archive?open=${id}`}>{NAME[id] ?? id}</Link></span>
                    ))}
                    <span className="sr-only"> ({r.family})</span>
                  </td>
                  <td className="pr-2">{r.primary}</td>
                  <td>{r.secondary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PreTradeChecklist onComplete={() => markMiscPracticeDone("pattern-themes")} />

      <section className="rounded-xl border-2 border-primary bg-primary/10 p-4 text-[14px] font-semibold" data-testid="pt-quote">
        “{THEMES_QUOTE}”
      </section>
      <p className="text-[12px] text-muted">
        Chart patterns are probabilistic and can fail; they should not be the sole basis for a trading decision. Practise: {" "}
        <Link className="underline text-primary" to="/training?group=pattern-themes">Learn · Pattern Themes ({THEME_QUESTIONS.length} questions)</Link>
        {" · "}
        <Link className="underline text-primary" to="/training?group=buy-or-sell">Buy or Sell? drill</Link>
      </p>
    </PracticeShell>
  );
}

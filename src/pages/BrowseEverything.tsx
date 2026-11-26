import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BROWSE_SECTIONS, searchBrowse } from "../lib/browseCatalog";
import { loadBrowseNewTab, newTabProps, saveBrowseNewTab } from "../lib/browseNewTab";

/** Browse everything: the full catalog and search, for learners who want every door open. */
export default function BrowseEverything({ initialNewTab }: { initialNewTab?: boolean } = {}) {
  const [query, setQuery] = useState("");
  const [newTab, setNewTab] = useState(() => initialNewTab ?? loadBrowseNewTab());
  const toggleNewTab = () => {
    const next = !newTab;
    setNewTab(next);
    saveBrowseNewTab(next);
  };
  const tab = newTabProps(newTab);
  const hits = useMemo(() => searchBrowse(query), [query]);
  const searching = query.trim().length > 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full space-y-6" data-testid="browse-everything">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Browse everything</h1>
        <p className="text-sm text-muted max-w-2xl">
          Every lesson, lab, quiz and tool in one place. Your path on Home stays as it is; open anything here.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/training" {...tab} className="text-primary underline" data-testid="browse-toc">Full Table of Contents</Link>
          <Link to="/archive" {...tab} className="text-primary underline">Library and glossary</Link>
          <Link to="/map" {...tab} className="text-primary underline">Progress map</Link>
        </div>
      </header>

      <div className="flex items-center gap-3 text-sm">
        <button
          type="button"
          role="switch"
          id="browse-new-tab"
          aria-checked={newTab}
          aria-labelledby="browse-new-tab-label"
          onClick={toggleNewTab}
          data-testid="browse-new-tab"
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${newTab ? "bg-primary border-primary" : "bg-surface border-line"}`}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-4 w-4 rounded-full shadow transition-transform ${newTab ? "translate-x-6 bg-white" : "translate-x-1 bg-muted"}`}
          />
        </button>
        <label htmlFor="browse-new-tab" id="browse-new-tab-label" className="cursor-pointer select-none">
          Open links in a new tab <span className="text-muted" aria-hidden="true">({newTab ? "on" : "off"})</span>
        </label>
      </div>

      <div className="max-w-xl">
        <label htmlFor="browse-search" className="text-sm font-medium">Search</label>
        <input
          id="browse-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try doji, CPI, opening range, earnings"
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
          data-testid="browse-search"
          autoComplete="off"
        />
      </div>

      {searching ? (
        <section aria-label="Search results" className="panel p-4 text-sm" data-testid="browse-results">
          {hits.length === 0 ? (
            <p className="text-muted">No match. Try a shorter word, or open the full Table of Contents.</p>
          ) : (
            <ul className="space-y-1.5">
              {hits.map((h) => (
                <li key={h.to} className="flex flex-wrap items-baseline gap-x-2">
                  <Link to={h.to} {...tab} className="text-primary underline">{h.label}</Link>
                  <span className="text-xs text-muted">{h.kind}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <nav aria-label="All sections" className="grid gap-4 sm:grid-cols-2">
        {BROWSE_SECTIONS.map((s) => (
          <section key={s.id} id={`browse-${s.id}`} className="panel p-4 text-sm space-y-2 scroll-mt-32" data-testid={`browse-section-${s.id}`}>
            <h2 className="font-semibold">{s.title}</h2>
            {s.blurb ? <p className="text-muted">{s.blurb}</p> : null}
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {s.links.map((l) => (
                <li key={`${s.id}-${l.to}`}>
                  <Link to={l.to} {...tab} className="text-primary underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </main>
  );
}

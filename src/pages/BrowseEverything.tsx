import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BROWSE_SECTIONS, searchBrowse } from "../lib/browseCatalog";
import { browseModalState, pageLocation, rememberBrowseTrigger } from "../lib/browseModal";

/** Browse everything: the full catalog and search, for learners who want every door open. */
export default function BrowseEverything() {
  const [query, setQuery] = useState("");
  const here = pageLocation(useLocation());
  // Each link opens its page in a popup over Browse; "Open full page" in the popup leaves Browse.
  const popup = (to: string, title: string) =>
    to === "/browse"
      ? {}
      : {
          state: browseModalState(here, title),
          onClick: (e: { currentTarget: HTMLElement }) => rememberBrowseTrigger(e.currentTarget),
        };
  const hits = useMemo(() => searchBrowse(query), [query]);
  const searching = query.trim().length > 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full space-y-6" data-testid="browse-everything">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Browse everything</h1>
        <p className="text-sm text-muted max-w-2xl">
          Every lesson, lab, quiz and tool in one place. Your path on Home stays as it is; anything here opens in a popup, with Open full page if you want to stay there.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/training" {...popup("/training", "Full Table of Contents")} className="inline-block py-1 text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary" data-testid="browse-toc">Full Table of Contents</Link>
          <Link to="/archive" {...popup("/archive", "Library and glossary")} className="inline-block py-1 text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">Library and glossary</Link>
          <Link to="/map" {...popup("/map", "Progress map")} className="inline-block py-1 text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">Progress map</Link>
        </div>
      </header>

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
            <ul className="space-y-0.5">
              {hits.map((h) => (
                <li key={h.to} className="flex flex-wrap items-baseline gap-x-2">
                  <Link to={h.to} {...popup(h.to, h.label)} className="inline-block py-1 text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">{h.label}</Link>
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
            <ul className="flex flex-wrap gap-x-4">
              {s.links.map((l) => (
                <li key={`${s.id}-${l.to}`}>
                  <Link to={l.to} {...popup(l.to, l.label)} className="inline-block py-1 text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">{l.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </main>
  );
}

import { lazy, type ComponentType } from "react";

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;
const loaders: Array<() => Promise<unknown>> = [];

/**
 * A route page loaded in its own chunk. Once its module has arrived it renders straight away (no Suspense round),
 * and `preloadPages()` lets tests and server renders load every page up front.
 */
export function lazyPage<P extends object>(load: Loader<P>): ComponentType<P> {
  let Loaded: ComponentType<P> | null = null;
  let pending: Promise<{ default: ComponentType<P> }> | null = null;
  const preload = () =>
    (pending ??= load().then((m) => {
      Loaded = m.default;
      return m;
    }));
  const Lazy = lazy(preload) as unknown as ComponentType<P>;
  function Page(props: P) {
    const Comp = Loaded ?? Lazy;
    return <Comp {...props} />;
  }
  loaders.push(preload);
  return Page;
}

/** Load every lazy page module (for tests and static renders). */
export const preloadPages = () => Promise.all(loaders.map((l) => l()));

/** Shown in the page area while a page's chunk loads; the header stays put. */
export function PageLoading() {
  return (
    <div role="status" aria-live="polite" className="flex-1 flex items-start justify-center p-8 text-sm text-muted" data-testid="page-loading">
      Loading…
    </div>
  );
}

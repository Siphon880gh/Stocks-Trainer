import { Component, lazy, type ComponentType, type ReactNode } from "react";

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
    (pending ??= load().then(
      (m) => {
        Loaded = m.default;
        return m;
      },
      (err: unknown) => {
        pending = null; // let a retry fetch the chunk again
        throw err;
      },
    ));
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

/**
 * Catches a page that fails to load or render (for example a chunk that no longer exists after a deploy, or a dropped
 * connection) and offers a reload instead of a blank screen. Give it `key={pathname}` so moving to another page resets it.
 */
type BoundaryProps = { children: ReactNode; key?: string };
export class PageErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  declare props: BoundaryProps;
  declare state: { failed: boolean };
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="mx-auto max-w-md flex-1 space-y-3 p-8 text-sm" data-testid="page-error">
        <p className="font-semibold text-ink">This page didn't load.</p>
        <p className="text-muted">Check your connection, then reload. Your progress is saved in this browser.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dim"
        >
          Reload the page
        </button>
      </div>
    );
  }
}

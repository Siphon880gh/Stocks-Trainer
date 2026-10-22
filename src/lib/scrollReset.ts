/**
 * Scroll helpers for in-app navigation. BrowserRouter keeps the old scroll
 * offset when the route changes, and the round-based games keep it when they
 * swap in the next round, so the user lands mid-page. These reset it.
 */
export interface ScrollWindow {
  scrollY: number;
  scrollTo(opts: { top: number; left?: number }): void;
}

export interface RouteLocation {
  pathname: string;
  hash: string;
}

/** A pathname change without a #hash target starts the new page at the top. */
export function shouldResetOnRouteChange(prev: RouteLocation | null, next: RouteLocation): boolean {
  if (!prev) return false; // first render: let the browser restore a reload's position
  if (next.hash) return false; // an in-page anchor picks its own spot
  return prev.pathname !== next.pathname;
}

/**
 * Bring an element's top back into view when the user is scrolled past it
 * (e.g. after "Next round" at the bottom of a long round). `offset` keeps it
 * clear of the sticky header. Does nothing if the top is already visible.
 */
export function scrollToTopOf(el: { getBoundingClientRect(): { top: number } } | null | undefined, win: ScrollWindow, offset = 72): boolean {
  if (!el) return false;
  const top = el.getBoundingClientRect().top;
  if (top >= 0) return false;
  win.scrollTo({ top: Math.max(0, win.scrollY + top - offset) });
  return true;
}

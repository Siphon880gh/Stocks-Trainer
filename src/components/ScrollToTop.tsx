import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { shouldResetOnRouteChange, type RouteLocation } from "../lib/scrollReset";

/**
 * Start each new route at the top. A layout effect runs before the pages' own
 * effects, so pages that scroll to a focus target on mount (Cases, Market) still win.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prev = useRef<RouteLocation | null>(null);
  useLayoutEffect(() => {
    const next = { pathname, hash };
    if (shouldResetOnRouteChange(prev.current, next)) window.scrollTo({ top: 0, left: 0 });
    prev.current = next;
  }, [pathname, hash]);
  return null;
}

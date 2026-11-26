import { Suspense, useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageErrorBoundary, PageLoading } from "../lib/lazyPage";
import { browseModalOf, takeBrowseTrigger } from "../lib/browseModal";
import { recordVisit } from "../lib/mapProgress";
import { Z } from "../lib/zLayers";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** A page from Browse everything, shown in a near full-screen dialog over the Browse page. */
export default function BrowseModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const modal = browseModalOf(location.state);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const fullPage = `${location.pathname}${location.search}${location.hash}`;
  const close = () => navigate(-1);

  useEffect(() => recordVisit(location.pathname), [location.pathname]);

  useEffect(() => {
    const { body } = document;
    const overflow = body.style.overflow;
    body.style.overflow = "hidden";
    body.classList.add("overlay-open");
    closeButton.current?.focus();
    return () => {
      body.style.overflow = overflow;
      body.classList.remove("overlay-open");
      // Wait a frame: StrictMode remounts effects, and only a real close leaves no dialog behind.
      requestAnimationFrame(() => {
        if (document.querySelector('[data-testid="browse-modal"]')) return;
        const back = takeBrowseTrigger();
        if (back?.isConnected) back.focus();
      });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      // A dialog opened by the page inside the popup handles its own Escape first.
      const inner = (e.target as Element | null)?.closest?.('[role="dialog"]');
      if (inner && inner !== panel.current) return;
      e.preventDefault();
      navigate(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  const trapTab = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panel.current) return;
    const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (items.length === 0) return;
    const first = items[0]!;
    const last = items[items.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const view: ReactNode = (
    <div
      className="fixed inset-0 bg-black/50 flex items-stretch justify-center p-2 sm:p-6"
      style={{ zIndex: Z.modal }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      data-testid="browse-modal-backdrop"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="browse-modal-title"
        onKeyDown={trapTab}
        className="flex w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-line bg-canvas shadow-2xl"
        data-testid="browse-modal"
      >
        <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-2">
          <h2 id="browse-modal-title" className="min-w-0 flex-1 truncate text-sm font-semibold" data-testid="browse-modal-title">
            {modal?.title ?? "Preview"}
          </h2>
          <Link to={fullPage} replace className="shrink-0 text-sm text-primary underline" data-testid="browse-modal-full">
            Open full page
          </Link>
          <button
            ref={closeButton}
            type="button"
            onClick={close}
            aria-label="Close"
            className="shrink-0 rounded p-1.5 text-muted hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary"
            data-testid="browse-modal-close"
          >
            <span className="material-symbols-outlined block" aria-hidden>close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain" data-testid="browse-modal-body">
          <PageErrorBoundary key={location.pathname}>
            <Suspense fallback={<PageLoading />}>
              <Outlet />
            </Suspense>
          </PageErrorBoundary>
        </div>
      </div>
    </div>
  );

  // Server render (unit tests) has no document to portal into.
  return typeof document === "undefined" ? view : createPortal(view, document.body);
}

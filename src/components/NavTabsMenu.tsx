import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { BROWSE_ROUTE } from "../lib/appNav";
import { Z } from "../lib/zLayers";
import { getTrack } from "../lib/tracks";
import {
  NAV_LEVELS,
  TAB_LIMIT,
  groupItems,
  itemsFor,
  loadNavTab,
  pathTabItems,
  saveNavTab,
  type MenuId,
  type NavTabId,
} from "../lib/navLevels";
import { cn } from "../lib/utils";
import { readTrackProgress } from "./NextUpCard";
import { useTrackId } from "./TrackPicker";

function here(to: string, pathname: string, hash: string, search: string): boolean {
  const mark = to.indexOf("#");
  if (mark >= 0) return pathname === to.slice(0, mark) && hash === to.slice(mark);
  const q = to.indexOf("?");
  if (q >= 0) return pathname === to.slice(0, q) && search === to.slice(q);
  if (to === "/training") return pathname === "/training" && hash === "";
  return pathname === to || pathname.startsWith(`${to}/`);
}

type Entry = { label: string; to: string; desc: string; group: string };

/**
 * A header dropdown with level tabs: For your path (with a track), Beginner, Intermediate, Advanced.
 * ARIA tabs with arrow keys, Home and End; Escape closes and returns focus to the toggle.
 */
export default function NavTabsMenu({
  menu,
  label,
  to,
  end,
}: {
  menu: MenuId;
  label: string;
  /** When set, the label navigates and the chevron opens the tabs. */
  to?: string;
  end?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const trackId = useTrackId();
  const track = getTrack(trackId);
  const [tab, setTab] = useState<NavTabId>("beginner");
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const base = useId();
  const panelId = `${base}-panel`;
  const { pathname, hash, search } = useLocation();

  const tabs: { id: NavTabId; label: string }[] = useMemo(
    () => [...(track ? [{ id: "path" as const, label: "For your path" }] : []), ...NAV_LEVELS.map((l) => ({ id: l.id, label: l.label }))],
    [track],
  );
  const pathItems = useMemo(
    () => (open && track ? pathTabItems(track, readTrackProgress(), menu) : []),
    [open, track, menu],
  );
  const allItems = NAV_LEVELS.flatMap((l) => itemsFor(menu, l.id));
  const groupOn = (to ? here(to, pathname, hash, search) : false) || allItems.some((i) => here(i.to, pathname, hash, search));

  const closeMenu = (refocus: boolean) => {
    setOpen(false);
    if (refocus) toggle.current?.focus();
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash, search]);

  // Opening focuses the selected tab (the toggle picked it in the same click).
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => tabRefs.current[tab]?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleMenu = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const t = loadNavTab(menu, trackId);
    setTab(tabs.some((x) => x.id === t) ? t : tabs[0].id);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (id: NavTabId, focus = false) => {
    setTab(id);
    saveNavTab(menu, id, trackId);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onTabKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const i = tabs.findIndex((t) => t.id === tab);
    let j = -1;
    if (event.key === "ArrowRight") j = (i + 1) % tabs.length;
    else if (event.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") j = 0;
    else if (event.key === "End") j = tabs.length - 1;
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      root.current?.querySelector<HTMLAnchorElement>(`#${CSS.escape(`${panelId}-${tab}`)} a`)?.focus();
      return;
    }
    if (j < 0) return;
    event.preventDefault();
    choose(tabs[j].id, true);
  };

  const buttonClass = cn(
    "inline-flex items-center justify-center gap-0.5 min-h-11 md:min-h-0 py-1.5 text-[13px]",
    groupOn || open ? "text-primary font-semibold bg-primary/10" : "text-muted hover:text-ink hover:bg-canvas",
  );

  const entriesFor = (id: NavTabId): { shown: Entry[]; extra: Entry[] } => {
    if (id === "path") return { shown: pathItems, extra: [] };
    const items = itemsFor(menu, id);
    return { shown: items.slice(0, TAB_LIMIT), extra: items.slice(TAB_LIMIT) };
  };

  const renderPanel = (id: NavTabId) => {
    const { shown, extra } = entriesFor(id);
    const expanded = !!showAll[id];
    const list = expanded ? [...shown, ...extra] : shown;
    const level = NAV_LEVELS.find((l) => l.id === id);
    return (
      <div
        key={id}
        id={`${panelId}-${id}`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${id}`}
        hidden={tab !== id}
        tabIndex={0}
        data-testid={`navpanel-${menu}-${id}`}
        className="px-3 py-2 focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      >
        <p className="text-[12px] text-muted pb-1">
          {id === "path" ? `Your path: ${track?.title ?? ""}. Only the steps for this menu, in order.` : level?.blurb}
        </p>
        {id === "path" && shown.length === 0 ? (
          <p className="text-[13px] py-2" data-testid={`navpanel-${menu}-path-empty`}>
            Nothing left on your path in this menu. <Link to="/" className="text-primary underline" onClick={() => closeMenu(false)}>See Next up on Home</Link>
          </p>
        ) : null}
        <div className="grid gap-x-4 sm:grid-cols-2">
          {groupItems(list).map((g) => (
            <div key={g.title} role="group" aria-label={g.title} className="pb-1">
              <p className="pt-1.5 pb-0.5 text-xs font-semibold uppercase tracking-wide text-muted">{g.title}</p>
              <ul>
                {g.items.map((item) => (
                  <li key={item.to + item.label}>
                    <Link
                      to={item.to}
                      data-testid="navtab-item"
                      onClick={() => closeMenu(false)}
                      className={cn(
                        "block rounded-md px-2 py-1 -mx-2",
                        here(item.to, pathname, hash, search) ? "bg-primary/10 text-primary" : "text-ink hover:bg-canvas",
                      )}
                    >
                      <span className="block text-[13px] font-medium leading-snug">{item.label}</span>
                      <span className="block text-xs text-muted leading-snug truncate">{item.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {extra.length ? (
          <button
            type="button"
            className="mt-1 text-[12px] text-primary underline"
            aria-expanded={expanded}
            data-testid={`navtab-more-${menu}-${id}`}
            onClick={() => setShowAll((v) => ({ ...v, [id]: !expanded }))}
          >
            {expanded ? "Show fewer" : `Show all ${shown.length + extra.length}`}
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <div ref={root} className="relative inline-flex items-center">
      {to ? (
        <NavLink to={to} end={end} className={cn(buttonClass, "rounded-l-md px-2 sm:px-2.5")}>
          {label}
        </NavLink>
      ) : null}
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label} menu`}
        data-testid={`${menu}-menu`}
        onClick={toggleMenu}
        className={cn(buttonClass, to ? "rounded-r-md min-w-11 md:min-w-0 pr-1" : "rounded-md px-2 sm:px-2.5")}
      >
        {to ? null : label}
        <span className="material-symbols-outlined text-[18px]" aria-hidden>expand_more</span>
      </button>
      <div
        id={panelId}
        hidden={!open}
        data-testid={`${menu}-menu-panel`}
        style={{ zIndex: Z.popover }}
        className={cn(
          // Fixed to the header (the blurred header is the containing block): full width on a phone, and
          // pinned to the header's right edge from sm up, so a 36rem panel never runs off the screen.
          "fixed top-full inset-x-2 max-h-[75vh] overflow-y-auto rounded-lg border border-line bg-surface shadow-lg",
          "sm:left-auto sm:right-4 sm:mt-1 sm:w-[36rem] sm:max-w-[calc(100vw-2rem)]",
        )}
      >
        <div
          role="tablist"
          aria-label={`${label} by level`}
          data-testid={`${menu}-tabs`}
          className="flex flex-nowrap gap-1 overflow-x-auto border-b border-line px-2 pt-2"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`${panelId}-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`${panelId}-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              data-testid={`navtab-${menu}-${t.id}`}
              onClick={() => choose(t.id)}
              onKeyDown={onTabKey}
              className={cn(
                "shrink-0 whitespace-nowrap border-b-2 px-2.5 py-2 text-[13px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
                tab === t.id ? "border-primary text-primary font-semibold" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tabs.map((t) => renderPanel(t.id))}
        <Link
          to={BROWSE_ROUTE}
          data-testid={`${menu}-menu-browse`}
          className="flex items-center gap-2 border-t border-line px-3 py-2 text-[13px] text-primary hover:bg-canvas"
          onClick={() => closeMenu(false)}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden>apps</span>
          Browse everything
        </Link>
      </div>
    </div>
  );
}

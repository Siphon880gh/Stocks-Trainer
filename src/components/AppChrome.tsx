import { Link, NavLink, useLocation } from "react-router-dom";
import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { BROWSE_ROUTE, HEADER_NAV, LEARN_MENU, PRACTICE_FAMILIES, TRADE_MENU } from "../lib/appNav";
import { getTrack } from "../lib/tracks";
import { TrackPickerDialog, useTrackId } from "./TrackPicker";
import { cn } from "../lib/utils";

function here(to: string, pathname: string, hash: string): boolean {
  const mark = to.indexOf("#");
  if (mark >= 0) return pathname === to.slice(0, mark) && hash === to.slice(mark);
  if (to === "/training") return pathname === "/training" && hash === "";
  return pathname === to || pathname.startsWith(`${to}/`);
}

type MenuItem = { label: string; to: string; icon?: string };

function MenuGroup({
  label,
  to,
  end,
  items = [],
  sections,
  testId,
}: {
  label: string;
  /** When set, the label itself navigates and the chevron opens the rest. */
  to?: string;
  end?: boolean;
  items?: readonly MenuItem[];
  /** Grouped items with a small heading each (the Practice families). */
  sections?: readonly { title: string; items: readonly MenuItem[] }[];
  testId: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { pathname, hash } = useLocation();
  const all = [...items, ...(sections ?? []).flatMap((s) => s.items)];
  const groupOn = (to ? here(to, pathname, hash) : false) || all.some((item) => here(item.to, pathname, hash));
  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const buttonClass = cn(
    "inline-flex items-center gap-0.5 py-1.5 text-[12px] min-[360px]:text-[13px]",
    groupOn || open ? "text-primary font-semibold bg-primary/10" : "text-muted hover:text-ink hover:bg-canvas",
  );
  const row = (item: MenuItem) => (
    <Link
      key={item.to}
      to={item.to}
      role="menuitem"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-[13px]",
        here(item.to, pathname, hash) ? "bg-primary/10 text-primary font-semibold" : "text-ink hover:bg-canvas",
      )}
      onClick={() => setOpen(false)}
    >
      {item.icon ? <span className="material-symbols-outlined text-[18px]" aria-hidden>{item.icon}</span> : null}
      {item.label}
    </Link>
  );
  return (
    <div ref={root} className="relative inline-flex items-center">
      {to ? (
        <NavLink to={to} end={end} className={cn(buttonClass, "rounded-l-md px-1 sm:px-2.5")}>
          {label}
        </NavLink>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label} menu`}
        data-testid={testId}
        onClick={() => setOpen((value) => !value)}
        className={cn(buttonClass, to ? "rounded-r-md pr-1" : "rounded-md px-1 sm:px-2.5")}
      >
        {to ? null : label}
        <span className="material-symbols-outlined text-[18px]" aria-hidden>expand_more</span>
      </button>
      <div
        id={menuId}
        role="menu"
        hidden={!open}
        className={cn(
          // Below sm the menu spans the header width (the blurred header is the containing block), so it never runs off a phone screen.
          "absolute left-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-surface py-1 shadow-lg max-sm:fixed max-sm:inset-x-2 max-sm:mt-0",
          sections ? "sm:w-[34rem] sm:columns-2 sm:gap-0" : "sm:min-w-56",
        )}
      >
        {items.map(row)}
        {(sections ?? []).map((s) => (
          <div key={s.title} role="group" aria-label={s.title} className="break-inside-avoid pb-1">
            <p className="px-3 pt-2 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{s.title}</p>
            {s.items.map(row)}
          </div>
        ))}
        <Link
          to={BROWSE_ROUTE}
          role="menuitem"
          className="flex items-center gap-2 px-3 py-1.5 mt-1 border-t border-line text-[13px] text-primary hover:bg-canvas break-inside-avoid"
          onClick={() => setOpen(false)}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden>apps</span>
          Browse everything
        </Link>
      </div>
    </div>
  );
}

const navLinkClass = (on: boolean) =>
  cn(
    "inline-flex items-center gap-1 px-1 sm:px-2.5 py-1.5 text-[12px] min-[360px]:text-[13px] rounded-md whitespace-nowrap transition-colors",
    on ? "text-primary font-semibold bg-primary/10" : "text-muted hover:text-ink hover:bg-canvas",
  );

/** Current track, or a prompt to pick one; opens the path picker. */
function TrackChip() {
  const id = useTrackId();
  const [open, setOpen] = useState(false);
  const track = getTrack(id);
  return (
    <>
      <button
        type="button"
        data-testid="track-chip"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[12px] text-ink hover:bg-canvas whitespace-nowrap"
        title="Change your path"
      >
        <span className="material-symbols-outlined text-[16px] text-primary" aria-hidden>{track?.icon ?? "alt_route"}</span>
        {track ? track.title : "Pick a path"}
      </button>
      <TrackPickerDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default function AppChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-0 md:h-14 flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-1">
          <Link to="/" className="flex items-center gap-2 shrink-0 text-ink hover:opacity-80">
            <span className="material-symbols-outlined text-up text-[22px]">candlestick_chart</span>
            <span className="flex flex-col leading-[1.15]">
              <span className="font-semibold tracking-tight text-[15px]">Learn Stocks</span>
              <span className="text-[10px] font-normal text-muted tracking-normal">by WengIndustries</span>
            </span>
          </Link>
          <nav
            data-testid="app-nav"
            className="flex flex-wrap md:flex-nowrap items-center justify-start w-full md:w-auto gap-x-0.5 gap-y-0.5 md:ml-auto"
          >
            {HEADER_NAV.map((item) => {
              if (item.menu === "learn") return <Fragment key={item.id}><MenuGroup label={item.label} to={item.to} end={item.end} items={LEARN_MENU} testId="learn-menu" /></Fragment>;
              if (item.menu === "practice") return <Fragment key={item.id}><MenuGroup label={item.label} to={item.to} sections={PRACTICE_FAMILIES} testId="practice-menu" /></Fragment>;
              if (item.menu === "trade") return <Fragment key={item.id}><MenuGroup label={item.label} items={TRADE_MENU} testId="trade-menu" /></Fragment>;
              const to = item.to ?? "/";
              return (
                <NavLink key={item.id} to={to} end={item.end} data-testid={`nav-${item.id}`} className={({ isActive }) => navLinkClass(isActive)}>
                  {item.id === "browse" ? <span className="material-symbols-outlined text-[16px]" aria-hidden>apps</span> : null}
                  {item.label}
                </NavLink>
              );
            })}
            <TrackChip />
          </nav>
        </div>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

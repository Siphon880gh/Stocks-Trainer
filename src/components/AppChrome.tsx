import { Link, NavLink, useLocation } from "react-router-dom";
import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ACADEMY_MORE, APP_NAV, DASHBOARD_MORE, DEEP_STUDY, OTHER_FACTORS, PATTERN_MORE, PRACTICE_MENU, QUICK_DECISIONS } from "../lib/appNav";
import { cn } from "../lib/utils";

function here(to: string, pathname: string, hash: string): boolean {
  const mark = to.indexOf("#");
  if (mark >= 0) return pathname === to.slice(0, mark) && hash === to.slice(mark);
  if (to === "/training") return pathname === "/training" && hash === "";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function MenuGroup({
  label,
  to,
  end,
  items,
  testId,
}: {
  label: string;
  /** When set, the label itself navigates and the chevron opens the rest. */
  to?: string;
  end?: boolean;
  items: readonly { label: string; to: string; icon?: string }[];
  testId: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { pathname, hash } = useLocation();
  const groupOn = (to ? here(to, pathname, hash) : false) || items.some((item) => here(item.to, pathname, hash));
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
        className="absolute left-0 top-full z-50 mt-1 min-w-56 max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-surface py-1 shadow-lg"
      >
        {items.map((item) => (
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
        ))}
      </div>
    </div>
  );
}

export default function AppChrome({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
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
            {APP_NAV.map((item) => {
              if (item.to === "/") return <Fragment key={item.to}><MenuGroup label={item.label} to={item.to} end items={DASHBOARD_MORE} testId="dashboard-menu" /></Fragment>;
              if (item.to === "/academy") return <Fragment key={item.to}><MenuGroup label={item.label} to={item.to} end items={ACADEMY_MORE} testId="academy-menu" /></Fragment>;
              if (item.to === "/training#patterns") return <Fragment key={item.to}><MenuGroup label={item.label} to={item.to} items={PATTERN_MORE} testId="pattern-menu" /></Fragment>;
              if (item.to === "/training#practice") return <Fragment key={item.to}><MenuGroup label={item.label} to={item.to} items={PRACTICE_MENU} testId="practice-menu" /></Fragment>;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={"end" in item ? item.end : false}
                  className={({ isActive }) =>
                    cn(
                      "px-1 sm:px-2.5 py-1.5 text-[12px] min-[360px]:text-[13px] rounded-md whitespace-nowrap transition-colors",
                      (item.to.includes("#") ? here(item.to, pathname, hash) : isActive)
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-muted hover:text-ink hover:bg-canvas",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
            <MenuGroup label="Deep Study" items={DEEP_STUDY} testId="deep-study-menu" />
            <MenuGroup label="Other factors" items={OTHER_FACTORS} testId="other-factors-menu" />
            <MenuGroup label="Quick Decisions" items={QUICK_DECISIONS} testId="quick-decisions-menu" />
          </nav>
        </div>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/training", label: "Learn" },
  { to: "/market", label: "Charts" },
  { to: "/cases", label: "Cases" },
  { to: "/coach", label: "Coach" },
  { to: "/playbooks", label: "Playbooks" },
] as const;

export default function AppChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm">
        {/* Below sm the six links get their own full-width row; one row hid Coach and Playbooks behind a scrollbar-less scroll on a 390px phone. */}
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-0 sm:h-14 flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-1">
          <Link to="/" className="flex items-center gap-2 shrink-0 text-ink hover:opacity-80">
            <span className="material-symbols-outlined text-up text-[22px]">candlestick_chart</span>
            <span className="flex flex-col leading-[1.15]">
              <span className="font-semibold tracking-tight text-[15px]">Learn Stocks</span>
              <span className="text-[10px] font-normal text-muted tracking-normal">by WengIndustries</span>
            </span>
          </Link>
          <nav
            data-testid="app-nav"
            className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-0.5 overflow-x-auto no-scrollbar sm:ml-auto"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-1 sm:px-2.5 py-1.5 text-[12px] min-[360px]:text-[13px] rounded-md whitespace-nowrap transition-colors",
                    isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted hover:text-ink hover:bg-canvas",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

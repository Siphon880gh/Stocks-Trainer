import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/training", label: "Learn" },
  { to: "/academy", label: "Academy" },
  { to: "/market", label: "Charts" },
  { to: "/cases", label: "Cases" },
  { to: "/coach", label: "Coach" },
  { to: "/playbooks", label: "Playbooks" },
] as const;

export default function AppChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm">
        {/* Below md the links get their own full-width row and wrap, so Academy through Playbooks stay on screen on a phone. */}
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-0 md:h-14 flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-1">
          <Link to="/" className="flex items-center gap-2 shrink-0 text-ink hover:opacity-80">
            <span className="material-symbols-outlined text-up text-[22px]">candlestick_chart</span>
            <span className="flex flex-col leading-[1.15]">
              <span className="font-semibold tracking-tight text-[15px]">Learn Stocks</span>
              <span className="text-[10px] font-normal text-muted tracking-normal">by WengIndustries</span>
            </span>
          </Link>
          {/* Progress Map (#23): beside the logo on phones, after the links from md up. */}
          <NavLink
            to="/map"
            data-testid="nav-map"
            aria-label="Progress map"
            className={({ isActive }) =>
              cn(
                "ml-auto md:ml-0 md:order-last inline-flex items-center gap-1 px-2 py-1.5 text-[13px] rounded-md border whitespace-nowrap transition-colors",
                isActive ? "text-primary font-semibold bg-primary/10 border-primary/40" : "text-muted border-line hover:text-ink hover:bg-canvas",
              )
            }
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden>map</span>
            Map
          </NavLink>
          <nav
            data-testid="app-nav"
            className="flex flex-wrap md:flex-nowrap items-center justify-start w-full md:w-auto gap-x-0.5 gap-y-0.5 md:ml-auto"
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

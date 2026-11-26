import { Link, NavLink } from "react-router-dom";
import { Fragment, useState, type ReactNode } from "react";
import { HEADER_NAV } from "../lib/appNav";
import NavTabsMenu from "./NavTabsMenu";
import ThemeMenu from "./ThemeMenu";
import { getTrack } from "../lib/tracks";
import { TrackPickerDialog, useTrackId } from "./TrackPicker";
import { cn } from "../lib/utils";

const navLinkClass = (on: boolean) =>
  cn(
    // Phones get 44 px tap targets; from md up the header is one 56 px row and the links stay compact.
    "inline-flex items-center justify-center gap-1 min-h-11 min-w-11 px-2 sm:px-2.5 py-1.5 md:min-h-0 md:min-w-0 text-[13px] rounded-md whitespace-nowrap transition-colors",
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
        className="inline-flex items-center gap-1 min-h-11 md:min-h-0 rounded-full border border-line px-3 py-1 text-[13px] text-ink hover:bg-canvas whitespace-nowrap"
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
          <Link to="/" aria-label="Learn Stocks home" className="flex items-center gap-2 min-h-11 shrink-0 text-ink hover:opacity-80">
            <span className="material-symbols-outlined text-up text-[22px]">candlestick_chart</span>
            <span className="flex flex-col leading-[1.15]">
              <span className="font-semibold tracking-tight text-[15px]">Learn Stocks</span>
              <span className="text-[12px] font-normal text-muted tracking-normal">by WengIndustries</span>
            </span>
          </Link>
          {/* Phones: top right beside the logo. From md up: last in the row, after the path chip. */}
          <ThemeMenu className="ml-auto md:ml-0 md:order-last shrink-0" />
          <nav
            data-testid="app-nav"
            className="flex flex-wrap md:flex-nowrap items-center justify-start w-full md:w-auto gap-x-0.5 gap-y-0.5 md:ml-auto"
          >
            {HEADER_NAV.map((item) => {
              if (item.menu) {
                return (
                  <Fragment key={item.id}>
                    <NavTabsMenu menu={item.menu} label={item.label} to={item.to} end={item.end} />
                  </Fragment>
                );
              }
              const to = item.to ?? "/";
              return (
                <NavLink key={item.id} to={to} end={item.end} data-testid={`nav-${item.id}`} className={({ isActive }) => cn(navLinkClass(isActive), item.id === "home" && "max-md:hidden")}>
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

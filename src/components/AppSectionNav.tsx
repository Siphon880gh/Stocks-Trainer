import { NavLink } from "react-router-dom";
import { ACADEMY_MORE, APP_NAV, DASHBOARD_MORE, DEEP_STUDY, OTHER_FACTORS, PATTERN_MORE, PRACTICE_MENU, QUICK_DECISIONS, TOOL_TRAINING } from "../lib/appNav";
import { cn } from "../lib/utils";

const [dashboard, ...afterDashboard] = APP_NAV;
const SECTIONS = [
  dashboard,
  ...DASHBOARD_MORE,
  ...afterDashboard,
  ...ACADEMY_MORE,
  ...PATTERN_MORE,
  ...PRACTICE_MENU,
  ...TOOL_TRAINING,
  ...DEEP_STUDY,
  ...OTHER_FACTORS,
  ...QUICK_DECISIONS,
];

/**
 * Same destinations as the top menu, with each group opened out. About 90 links, so they sit
 * behind a closed disclosure: the page's own content comes first, and every link is one click away.
 */
export default function AppSectionNav() {
  return (
    <details className="group text-[13px]" data-testid="app-sections-details">
      <summary className="inline-flex cursor-pointer select-none items-center gap-1 rounded-md py-1 text-muted hover:text-ink">
        <span className="material-symbols-outlined text-[18px] transition-transform group-open:rotate-90" aria-hidden>chevron_right</span>
        All sections ({SECTIONS.length})
      </summary>
      <nav aria-label="Sections" data-testid="app-sections" className="mt-2 flex flex-wrap gap-1.5">
        {SECTIONS.map((item) => (
          <NavLink
            key={`${item.label}-${item.to}`}
            to={item.to}
            end={"end" in item ? Boolean(item.end) : false}
            className={({ isActive }) =>
              cn(
                "px-2.5 py-1 rounded-full border text-[13px] whitespace-nowrap",
                isActive ? "border-primary bg-primary text-white font-semibold" : "border-line bg-surface text-muted hover:text-ink",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </details>
  );
}

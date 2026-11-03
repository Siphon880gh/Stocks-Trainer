import { NavLink } from "react-router-dom";
import { ACADEMY_MORE, APP_NAV, DASHBOARD_MORE, DEEP_STUDY, OTHER_FACTORS, PATTERN_MORE, PRACTICE_MENU, QUICK_DECISIONS } from "../lib/appNav";
import { cn } from "../lib/utils";

const [dashboard, ...afterDashboard] = APP_NAV;
const SECTIONS = [
  dashboard,
  ...DASHBOARD_MORE,
  ...afterDashboard,
  ...ACADEMY_MORE,
  ...PATTERN_MORE,
  ...PRACTICE_MENU,
  ...DEEP_STUDY,
  ...OTHER_FACTORS,
  ...QUICK_DECISIONS,
];

/** Same destinations as the top menu, with each group opened out. */
export default function AppSectionNav() {
  return (
    <nav aria-label="Sections" data-testid="app-sections" className="flex flex-wrap gap-1.5">
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
  );
}

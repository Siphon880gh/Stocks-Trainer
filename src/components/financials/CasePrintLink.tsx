import { Link } from "react-router-dom";
import { printLinksForCase } from "../../lib/financials/caseLinks";

/** FE7.M2: "Practice a similar setup in Read the Print" links on mapped earnings cases (CasePlayer). */
export default function CasePrintLink({ caseId }: { caseId: string }) {
  const links = printLinksForCase(caseId);
  if (links.length === 0) return null;
  return (
    <p className="text-[12px] text-muted" data-testid="case-print-link">
      <span className="material-symbols-outlined text-sm align-middle mr-1">query_stats</span>
      Practice a similar setup in Read the Print:{" "}
      {links.map((l, i) => (
        <span key={l.eventId}>
          {i > 0 ? " · " : ""}
          <Link to={l.href} className="text-primary underline">
            round {l.round} ({l.label})
          </Link>{" "}
          <span className="text-[11px]">— {l.why}</span>
        </span>
      ))}
    </p>
  );
}

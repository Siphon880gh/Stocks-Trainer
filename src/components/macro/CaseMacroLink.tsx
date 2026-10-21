import { Link } from "react-router-dom";
import { macroLinkForCase } from "../../lib/macro/caseLinks";

/** MF8.M2: small "Read the real release" bridge shown in CasePlayer for mapped macro cases. */
export default function CaseMacroLink({ caseId }: { caseId: string }) {
  const l = macroLinkForCase(caseId);
  if (!l) return null;
  return (
    <p className="text-[12px] text-muted" data-testid="case-macro-link">
      <span className="material-symbols-outlined text-sm align-middle mr-1">public</span>
      <a href={l.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
        Read the real release
      </a>{" "}
      ({l.sourceName}) ·{" "}
      <Link to={`/macro/${l.lessonId}`} className="text-primary underline">
        Macro Desk: {l.lessonTitle}
      </Link>
    </p>
  );
}

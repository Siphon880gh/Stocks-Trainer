import { GlossaryTermMark } from "../JargonText";
import { getLiteracyTerm } from "../../lib/literacyTerms";
import { fieldTermId } from "../../lib/toolTraining";

/**
 * Tool Training's glossary hover terms, built on `GlossaryTermMark` and the Archive glossary (`LITERACY_TERMS`).
 * `FieldLabel` is a screen label (looked up in `FIELD_TERM_IDS`); `ToolTerm` is a `{ text, term }` run in copy.
 */
export function ToolTerm({ text, term, focusable = true }: { text: string; term: string; focusable?: boolean }) {
  const t = getLiteracyTerm(term);
  if (!t) return <>{text}</>;
  return <GlossaryTermMark term={t} focusable={focusable}>{text}</GlossaryTermMark>;
}

/** A label on a simulated screen. Inside the `aria-hidden` frame it is hover and tap only; the row below is focusable. */
export function FieldLabel({ label }: { label: string }) {
  const id = fieldTermId(label);
  return id ? <ToolTerm text={label} term={id} focusable={false} /> : <>{label}</>;
}

/** The focusable copy of a screen's hover terms, outside the hidden frame, so keyboard and screen-reader users get them. */
export function ScreenTerms({ ids }: { ids: string[] }) {
  const terms = ids.map((id) => getLiteracyTerm(id)).filter((t) => t !== undefined);
  if (!terms.length) return null;
  return (
    <p className="text-[11px] text-muted" data-testid="screen-terms">
      <span>Terms on this screen (hover, focus or tap): </span>
      {terms.map((t, i) => (
        <span key={t.id}>
          {i ? " · " : ""}
          <GlossaryTermMark term={t}>{t.name}</GlossaryTermMark>
        </span>
      ))}
    </p>
  );
}

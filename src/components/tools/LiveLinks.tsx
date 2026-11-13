import { formatSnapshotDate, type LiveLink } from "../../lib/toolTraining";

/**
 * "Open the live version on <Tool>" links under a simulated screen or column walk. URLs come from
 * `lib/toolTraining/liveLinks.ts`. Opens in a new tab; the note reminds readers live numbers move on.
 */
export function LiveLinks({ links, asOf }: { links?: LiveLink[]; asOf?: string }) {
  if (!links?.length) return null;
  return (
    <div className="text-[12px] space-y-0.5" data-testid="live-links">
      <ul className="space-y-0.5">
        {links.map((l) => (
          <li key={l.url + l.label}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-primary underline" data-live-tool={l.tool}>
              Open the live version on {l.tool}
            </a>
            <span className="text-muted"> · {l.label} ↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-muted">
        {asOf
          ? `Live numbers will differ from this snapshot of ${formatSnapshotDate(asOf)}.`
          : "Live numbers will differ from the dated values in this walk."}
      </p>
    </div>
  );
}

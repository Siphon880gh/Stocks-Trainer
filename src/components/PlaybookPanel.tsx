import type { ReactNode } from "react";

/** Collapsed until the learner clicks the summary. */
export default function PlaybookPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="panel group">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold tracking-tight flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="material-symbols-outlined text-muted text-[18px] group-open:rotate-180 transition-transform">
          expand_more
        </span>
      </summary>
      <div className="px-4 pb-4 pt-1 border-t border-line space-y-3">{children}</div>
    </details>
  );
}

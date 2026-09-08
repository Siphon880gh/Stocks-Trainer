import { cn } from "../lib/utils";
import { youtubeSearchQuery, youtubeSearchUrl } from "../lib/youtubeSearch";

export default function YouTubeSearchLink({
  title,
  className,
  label,
}: {
  title: string;
  className?: string;
  /** Visible caption beside the icon — use in toolbars so the control is not icon-only. */
  label?: string;
}) {
  const name = title.trim();
  if (!name) return null;
  const query = youtubeSearchQuery(name);
  const icon = label ? 14 : 16;

  return (
    <a
      href={youtubeSearchUrl(name)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center justify-center shrink-0 text-muted hover:text-[#ff0000] focus-visible:text-[#ff0000] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        label
          ? "h-7 gap-1.5 rounded-md border border-[#d1d4dc] bg-white px-2.5 text-[11px] font-medium hover:border-current"
          : "min-h-7 min-w-7 rounded-sm p-1.5",
        className,
      )}
      aria-label={label ? undefined : `Search YouTube for ${query}`}
      title={`YouTube · ${query}`}
    >
      <svg viewBox="0 0 24 24" width={icon} height={icon} aria-hidden="true">
        <path
          fill="currentColor"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7L16.5 12l-6.75 3.5z"
        />
      </svg>
      {label ? (
        <>
          <span>{label}</span>
          <span className="sr-only">{` · ${query}`}</span>
        </>
      ) : null}
    </a>
  );
}

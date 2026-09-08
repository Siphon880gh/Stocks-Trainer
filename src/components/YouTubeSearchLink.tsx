import { cn } from "../lib/utils";
import { youtubeSearchQuery, youtubeSearchUrl } from "../lib/youtubeSearch";

export default function YouTubeSearchLink({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const name = title.trim();
  if (!name) return null;
  const query = youtubeSearchQuery(name);

  return (
    <a
      href={youtubeSearchUrl(name)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center justify-center shrink-0 p-0.5 text-muted hover:text-[#ff0000] focus-visible:text-[#ff0000] transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
      aria-label={`Search YouTube for ${query}`}
      title={`YouTube · ${query}`}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7L16.5 12l-6.75 3.5z"
        />
      </svg>
    </a>
  );
}

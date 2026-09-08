/** YouTube results URL for a resource title. Query is always `stocks {title}`. */

export const YOUTUBE_SEARCH_PREFIX = "stocks";

/** Drop SAMPLE / sample tokens so search queries stay learner-facing. */
export function stripYoutubeFillerWords(title: string): string {
  return title
    .replace(/\(\s*sample\s*\)/gi, " ")
    .replace(/\bsample\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function youtubeSearchQuery(title: string): string {
  const name = stripYoutubeFillerWords(title);
  if (!name) return YOUTUBE_SEARCH_PREFIX;
  return `${YOUTUBE_SEARCH_PREFIX} ${name}`;
}

export function youtubeSearchUrl(title: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearchQuery(title))}`;
}

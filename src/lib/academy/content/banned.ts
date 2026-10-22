/**
 * Phrases that must never appear in Academy content (units, quizzes, terms, challenges, badges, options items).
 * Broker names (the Academy copies patterns, never a broker's text or brand) and promise-of-profit wording.
 */
export const BANNED_PHRASES: readonly RegExp[] = [
  /webull/i,
  /robinhood/i,
  /schwab/i,
  /fidelity/i,
  /e\*?trade/i,
  /ameritrade/i,
  /interactive brokers/i,
  /moomoo/i,
  /tastytrade/i,
  /guaranteed/i,
  /risk[- ]free profit/i,
  /can['’]t lose/i,
  /cannot lose/i,
  /sure thing/i,
];

/** Returns the banned phrases found in `text`. */
export const bannedIn = (text: string) => BANNED_PHRASES.filter((r) => r.test(text)).map((r) => r.source);

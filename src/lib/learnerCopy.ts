/** Muted line shown after the main heading or paragraph. */
export const SAMPLE_DATA_NOTE =
  "Note: this is sample data. It does not reflect true market prices.";

/**
 * Learner-facing copy should not shout SAMPLE. Honesty lives in SAMPLE_DATA_NOTE.
 * Data, ids, and tests can keep the word; run this at render time.
 */
export function withoutSampleWord(text: string): string {
  if (!text) return text;
  let next = text
    .replace(/\s*SAMPLE educational definition(?:, not [^.]*)?\./gi, "")
    .replace(/\s*\(SAMPLE\)/gi, "")
    .replace(/\bSAMPLE\s*·\s*/gi, "")
    .replace(/\s*·\s*SAMPLE\b/gi, "")
    .replace(/\bSAMPLE teaching of\s+/gi, "")
    .replace(/\bSAMPLE read\b\s*[:—–-]?\s*([a-z])?/gi, (_m, c: string | undefined) =>
      c ? c.toUpperCase() : "",
    )
    .replace(/\s*\bSAMPLE teaching\b\.?/gi, "")
    .replace(/\s*\bSAMPLE process\b\.?/gi, "")
    .replace(/\bSAMPLE zone\b/gi, "A zone")
    .replace(/\s*\bon SAMPLE data\b/gi, "")
    .replace(/,?\s*still SAMPLE\b/gi, "")
    .replace(/\bSAMPLE\s*\/\s*/gi, "")
    .replace(/\bSAMPLE:\s*/gi, "")
    .replace(/\ba SAMPLE (?=[aeiou])/gi, "an ")
    .replace(/\bSAMPLE\b/gi, "");

  next = next
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+\./g, ".")
    .replace(/^\s*[:·—–-]+\s*/, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!next) return "";
  return next.charAt(0).toUpperCase() + next.slice(1);
}

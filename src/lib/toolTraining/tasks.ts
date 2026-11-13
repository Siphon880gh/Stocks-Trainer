/**
 * "Find it yourself" checks (Tool Training): the learner opens a live page, types the value they found and the
 * time stamp the page showed. Live numbers move, so we check the shape and a plausible range, never an exact value.
 * Educational, not advice.
 */
import type { FindTaskAnswer, ToolTask } from "./types";

export interface FindTaskResult {
  ok: boolean;
  /** What is wrong with the entry, in plain words. Empty when ok. */
  problems: string[];
}

/** One recorded answer: the value, the page's time stamp, and when it was checked here (ISO). */
export interface FindTaskRecord {
  value: string;
  stamp: string;
  checkedAt: string;
  ok: boolean;
}

const SUFFIX: Record<string, number> = { k: 1e3, thousand: 1e3, m: 1e6, million: 1e6, mn: 1e6, b: 1e9, bn: 1e9, billion: 1e9, t: 1e12, trillion: 1e12 };

/** "−1,234.5" / "13.42x" / "1.66%" / "$120.09B" / "120.1 billion" → number (scaled by K/M/B/T), or null. */
export function parseTaskNumber(raw: string): number | null {
  const s = raw.trim().replace(/[−–]/g, "-").replace(/\s+/g, " ");
  const m = /^\(?(-)?\s*\$?\s*(-)?(\d[\d,]*(?:\.\d+)?|\.\d+)\)?\s*(%|x|×|[kmbt]|mn|bn|thousand|million|billion|trillion)?$/i.exec(s);
  if (!m) return null;
  const n = Number(m[3]!.replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  const neg = m[1] || m[2] || (s.startsWith("(") && s.endsWith(")")) ? -1 : 1;
  const unit = (m[4] ?? "").toLowerCase();
  return neg * n * (SUFFIX[unit] ?? 1);
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Nov 12, 2026" / "2026-11-12" / "11/12/2026" / "12 Nov 2026" → { y, m, d }, or null. */
export function parseTaskDate(raw: string): { y: number; m: number; d: number } | null {
  const s = raw.trim().toLowerCase().replace(/,/g, " ").replace(/\s+/g, " ");
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (m) return valid(+m[1]!, +m[2]!, +m[3]!);
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (m) return valid(+m[3]!, +m[1]!, +m[2]!);
  m = /^([a-z]{3})[a-z]*\.? (\d{1,2}) (\d{4})$/.exec(s);
  if (m && MONTHS.includes(m[1]!)) return valid(+m[3]!, MONTHS.indexOf(m[1]!) + 1, +m[2]!);
  m = /^(\d{1,2}) ([a-z]{3})[a-z]*\.? (\d{4})$/.exec(s);
  if (m && MONTHS.includes(m[2]!)) return valid(+m[3]!, MONTHS.indexOf(m[2]!) + 1, +m[1]!);
  return null;
}

function valid(y: number, m: number, d: number) {
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

const fmt = (n: number) => (Math.abs(n) >= 1e9 ? `${n / 1e9}B` : Math.abs(n) >= 1e6 ? `${n / 1e6}M` : `${n}`);

/** Shape and plausibility of one value. */
export function checkTaskValue(answer: FindTaskAnswer, raw: string): string[] {
  const v = raw.trim();
  if (!v) return ["Type the value you found."];
  if (answer.format === "text") {
    if (v.length > 80) return ["Keep it to the label or name the page shows (under 80 characters)."];
    if (answer.oneOf && !answer.oneOf.some((o) => v.toLowerCase().includes(o.toLowerCase())))
      return [`Expected one of the labels the page uses: ${answer.oneOf.join(", ")}.`];
    return [];
  }
  if (answer.format === "date") {
    const d = parseTaskDate(v);
    if (!d) return ["Write a date like Nov 12, 2026 or 2026-11-12."];
    if (d.y < answer.minYear || d.y > answer.maxYear) return [`A year between ${answer.minYear} and ${answer.maxYear} is plausible here; check you copied the right date.`];
    return [];
  }
  const out: string[] = [];
  if (answer.format === "percent" && !/%\s*$/.test(v)) out.push("This field is a percentage: include the % sign.");
  if (answer.format !== "percent" && /%\s*$/.test(v)) out.push("This field is not a percentage: drop the % sign.");
  const n = parseTaskNumber(v);
  if (n === null) return [...out, answer.format === "money" ? "Write an amount like 115.56, $120.09B or 21.5 billion." : "Write a number like 13.42."];
  if (n < answer.min || n > answer.max)
    out.push(`That is outside a plausible range (${fmt(answer.min)} to ${fmt(answer.max)}${answer.format === "percent" ? "%" : ""}). Check the row and the units (B vs M).`);
  return out;
}

/** The page's time stamp (or when you looked): needs a date or a time, so the value can be dated later. */
export function checkTaskStamp(raw: string): string[] {
  const v = raw.trim();
  if (!v) return ["Record the time stamp the page shows, or when you looked."];
  if (!/\d/.test(v)) return ["A time stamp needs a date or a time, e.g. Nov 12 • 4:00 PM ET."];
  return [];
}

export function checkFindTask(task: ToolTask, value: string, stamp: string): FindTaskResult {
  const problems = [...checkTaskValue(task.answer, value), ...checkTaskStamp(stamp)];
  return { ok: problems.length === 0, problems };
}

/** A readable "when I looked" stamp in the learner's own zone, e.g. "Nov 12, 2026, 9:41 AM". */
export function nowStamp(d: Date = new Date()): string {
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** What the answer should look like, shown beside the input. */
export function taskFormatHint(answer: FindTaskAnswer): string {
  switch (answer.format) {
    case "percent": return `A percentage, e.g. ${answer.example}`;
    case "money": return `An amount, e.g. ${answer.example}`;
    case "number": return `A number, e.g. ${answer.example}`;
    case "date": return `A date, e.g. ${answer.example}`;
    default: return `The label the page shows, e.g. ${answer.example}`;
  }
}

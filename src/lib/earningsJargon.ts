/** Earnings-desk phrases. Popovers and the earnings-jargon quiz share this list. */

export interface EarningsJargonTerm {
  id: string;
  name: string;
  /** Lowercase match phrases. The longest match at a position wins. */
  phrases: string[];
  summary: string;
}

export const EARNINGS_JARGON: EarningsJargonTerm[] = [
  {
    id: "into-the-print",
    name: "Into the print",
    phrases: ["into the print"],
    summary: "Price action leading up to the earnings release.",
  },
  {
    id: "before-the-print",
    name: "Before the print / pre-print",
    phrases: ["before the print", "pre-print", "pre print"],
    summary: "Before earnings are released.",
  },
  {
    id: "after-the-print",
    name: "After the print / post-print",
    phrases: ["after the print", "post-print", "post print"],
    summary: "Trading after the earnings release.",
  },
  {
    id: "buy-the-rumor",
    name: "Buy the rumor, sell the news",
    phrases: ["buy the rumor, sell the news", "buy the rumor sell the news"],
    summary: "Price rises on anticipation, then falls when the expected event actually happens.",
  },
  {
    id: "sell-the-news",
    name: "Sell the news",
    phrases: ["sell the news"],
    summary: "Stock falls after good news because investors had already bought beforehand.",
  },
  {
    id: "run-up",
    name: "Run-up into earnings",
    phrases: ["run-up into earnings", "run up into earnings", "ran up into earnings"],
    summary: "Stock climbed ahead of earnings.",
  },
  {
    id: "faded-the-print",
    name: "Faded the print",
    phrases: ["faded the print", "fade the print"],
    summary: "Stock initially rose after earnings, then gave back the gains.",
  },
  {
    id: "ripped-on-the-print",
    name: "Ripped on the print",
    phrases: ["ripped on the print"],
    summary: "Stock jumped sharply after earnings.",
  },
  {
    id: "got-hit",
    name: "Got hit on the print",
    phrases: ["got hit on the print"],
    summary: "Stock dropped sharply after earnings.",
  },
  {
    id: "beat-but-not-enough",
    name: "Beat but not enough",
    phrases: ["beat but not enough"],
    summary: "Officially beat estimates, but failed to meet higher market expectations.",
  },
  {
    id: "beat-and-raise",
    name: "Beat and raise",
    phrases: ["beat and raise"],
    summary: "Beat current estimates and increased future guidance.",
  },
  {
    id: "miss-and-lower",
    name: "Miss and lower",
    phrases: ["miss and lower"],
    summary: "Missed estimates and reduced future guidance.",
  },
  {
    id: "clean-beat",
    name: "Clean beat",
    phrases: ["clean beat"],
    summary: "Most important metrics beat expectations without obvious negatives.",
  },
  {
    id: "good-bad-print",
    name: "Good print / bad print",
    phrases: ["good print", "bad print"],
    summary: "A broadly strong earnings report (good print) or a broadly weak one (bad print).",
  },
  {
    id: "headline-beat-miss",
    name: "Headline beat/miss",
    phrases: ["headline beat", "headline miss"],
    summary: "The main reported number beat or missed estimates.",
  },
  {
    id: "beat-the-street",
    name: "Beat the Street",
    phrases: ["beat the street", "beats the street", "beating the street"],
    summary: "Results exceeded Wall Street analyst estimates.",
  },
  {
    id: "missed-the-street",
    name: "Missed the Street",
    phrases: ["missed the street", "miss the street", "misses the street"],
    summary: "Results fell below analyst estimates.",
  },
  {
    id: "whisper-number",
    name: "Whisper number",
    phrases: ["whisper number"],
    summary: "Unofficial expectation that may be higher or lower than published analyst estimates.",
  },
  {
    id: "reaction-function",
    name: "Reaction function",
    phrases: ["reaction function"],
    summary: "How the market responds to a given set of results, not just whether the numbers beat or missed.",
  },
  {
    id: "elevated-expectations",
    name: "Expectations were elevated",
    phrases: ["expectations were elevated", "elevated expectations"],
    summary: "Investors were expecting unusually strong results.",
  },
  {
    id: "low-high-bar",
    name: "Low bar / high bar",
    phrases: ["low bar", "high bar"],
    summary: "Expectations were easy to beat (low bar) or hard to beat (high bar).",
  },
  {
    id: "guide-direction",
    name: "Guide-down / guide-up",
    phrases: ["guide-down", "guide-up", "guide down", "guide up"],
    summary: "Management lowered its forecast (guide-down) or raised it (guide-up).",
  },
  {
    id: "guide",
    name: "Guide / guidance",
    phrases: ["guidance", "guide", "guides"],
    summary: "Management’s forecast for future results.",
  },
  {
    id: "tape-strength",
    name: "Tape was strong/weak",
    phrases: ["the tape was strong", "the tape was weak", "tape was strong", "tape was weak"],
    summary: "Stock trading showed strength or weakness.",
  },
  {
    id: "not-priced-in",
    name: "Not priced in",
    phrases: ["not priced into", "not priced in"],
    summary: "The market was not expecting it.",
  },
  {
    id: "priced-in",
    name: "Priced in",
    phrases: ["priced into", "priced in"],
    summary: "Investors already expected it, so it may already be reflected in the stock price.",
  },
  {
    id: "the-print",
    name: "The print",
    phrases: ["the print"],
    summary: "The actual reported earnings/results.",
  },
  {
    id: "the-tape",
    name: "The tape",
    phrases: ["the tape"],
    summary: "What the stock’s price and trading activity are signaling.",
  },
];

const GUIDE_REJECT_BEFORE = new Set(["beginner", "trading", "swing", "day", "style", "public"]);
const GUIDE_REJECT_AFTER = new Set(["silhouette", "shown", "you", "lines"]);

export interface JargonPart {
  text: string;
  term?: EarningsJargonTerm;
}

function isWordChar(ch: string): boolean {
  return /[A-Za-z0-9]/.test(ch);
}

function neighborWord(text: string, from: number, dir: "prev" | "next"): string {
  if (dir === "next") {
    const m = text.slice(from).match(/^\s*([A-Za-z0-9-]+)/);
    return m ? m[1]!.toLowerCase() : "";
  }
  const before = text.slice(0, from).trimEnd();
  const m = before.match(/([A-Za-z0-9-]+)$/);
  return m ? m[1]!.toLowerCase() : "";
}

function skipMatch(text: string, index: number, phrase: string, termId: string): boolean {
  const end = index + phrase.length;
  if (termId === "the-print" && neighborWord(text, end, "next") === "bar") return true;
  if (termId === "guide" && (phrase === "guide" || phrase === "guides")) {
    const prev = neighborWord(text, index, "prev");
    const next = neighborWord(text, end, "next");
    if (GUIDE_REJECT_BEFORE.has(prev) || GUIDE_REJECT_AFTER.has(next)) return true;
  }
  return false;
}

function matchAt(text: string, index: number): { length: number; term: EarningsJargonTerm } | null {
  if (index > 0 && isWordChar(text[index - 1]!)) return null;
  const restLower = text.slice(index).toLowerCase();
  let best: { length: number; term: EarningsJargonTerm } | null = null;
  for (const term of EARNINGS_JARGON) {
    for (const phrase of term.phrases) {
      if (!restLower.startsWith(phrase)) continue;
      const endChar = text[index + phrase.length];
      if (endChar !== undefined && isWordChar(endChar)) continue;
      if (skipMatch(text, index, phrase, term.id)) continue;
      if (!best || phrase.length > best.length) best = { length: phrase.length, term };
    }
  }
  return best;
}

/** Split user-facing copy into plain spans and earnings-desk phrases. */
export function splitEarningsJargon(text: string): JargonPart[] {
  if (!text) return [{ text: text ?? "" }];
  const parts: JargonPart[] = [];
  let i = 0;
  let plainStart = 0;
  while (i < text.length) {
    const match = matchAt(text, i);
    if (!match) {
      i += 1;
      continue;
    }
    if (i > plainStart) parts.push({ text: text.slice(plainStart, i) });
    parts.push({ text: text.slice(i, i + match.length), term: match.term });
    i += match.length;
    plainStart = i;
  }
  if (plainStart < text.length) parts.push({ text: text.slice(plainStart) });
  if (parts.length === 0) parts.push({ text });
  return parts;
}

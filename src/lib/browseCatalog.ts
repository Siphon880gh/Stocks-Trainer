/**
 * Browse everything: the full catalog one click from the header. Every old menu item, every
 * content type that has its own route, and a plain search across all of it.
 * See docs/projects/navigation/DIRECTIONAL-NAV-PROPOSAL.md.
 */
import { LEVELS, UNITS } from "./academy/content/levels";
import { CHALLENGES } from "./academy/challenges";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies";
import { listSessions } from "./coaching";
import { LITERACY_TERMS } from "./literacyTerms";
import { MACRO_LESSONS } from "./macro/lessons";
import { NAVIGATOR_CLASS_LABELS } from "./marketNavigator";
import { PATTERNS } from "./patterns";
import { PLAYBOOKS } from "./playbooks";
import { QUIZ_GROUPS } from "./quizData";
import {
  LEARN_MENU,
  OTHER_FACTORS,
  PRACTICE_FAMILIES,
  QUICK_DECISIONS,
  TOOL_TRAINING,
  TRADE_MENU,
  type NavItem,
} from "./appNav";

export interface BrowseSection {
  id: string;
  title: string;
  blurb?: string;
  links: readonly NavItem[];
}

const COACH_CLASSES = ["equity", "future", "forex", "crypto", "option_context"] as const;

/** The whole catalog, grouped. Order: start points, Learn, Practice families, Trade, then the deep lists. */
export const BROWSE_SECTIONS: readonly BrowseSection[] = [
  {
    id: "start",
    title: "Start points",
    blurb: "The full Table of Contents, the reference library and the stage map.",
    links: [
      { label: "Full Table of Contents", to: "/training", icon: "toc" },
      { label: "Library and glossary", to: "/archive", icon: "menu_book" },
      { label: "Progress map", to: "/map", icon: "map" },
      { label: "Home", to: "/", icon: "home" },
    ],
  },
  { id: "learn", title: "Learn", links: LEARN_MENU },
  ...PRACTICE_FAMILIES.map((f, i) => ({ id: `practice-${i + 1}`, title: `Practice: ${f.title}`, links: f.items })),
  { id: "trade", title: "Trade and decide", links: TRADE_MENU },
  { id: "tool-training", title: "Tool Training", links: TOOL_TRAINING },
  { id: "other-factors", title: "Financials and macro", links: OTHER_FACTORS },
  { id: "quick-decisions", title: "Quick Decisions", links: QUICK_DECISIONS },
  {
    id: "test-outs",
    title: "Academy level test-outs",
    blurb: "Skip a level you already know.",
    links: LEVELS.map((l) => ({ label: `${l.id} ${l.title} test-out`, to: `/academy/test-out/${l.id}` })),
  },
  {
    id: "macro-lessons",
    title: "Macro lessons",
    links: MACRO_LESSONS.map((l) => ({ label: l.title, to: `/macro/${l.id}` })),
  },
  {
    id: "coach-markets",
    title: "Coach by market",
    links: COACH_CLASSES.map((c) => ({ label: `Coach: ${NAVIGATOR_CLASS_LABELS[c]}`, to: `/coach?class=${c}` })),
  },
  {
    id: "case-packs",
    title: "Case packs",
    links: CASE_PACKS.map((p) => ({ label: p.name, to: `/cases?pack=${p.id}` })),
  },
  {
    id: "challenges",
    title: "Paper challenges",
    links: CHALLENGES.map((c) => ({ label: c.title, to: `/paper/challenges/${c.id}` })),
  },
  {
    id: "playbooks",
    title: "Playbooks",
    links: PLAYBOOKS.map((p) => ({ label: p.title, to: `/playbooks/${p.id}` })),
  },
];

export interface BrowseHit {
  label: string;
  kind: string;
  to: string;
}

let INDEX: BrowseHit[] | null = null;

/** Everything searchable: catalog links plus quizzes, units, coach sessions, cases, glossary and patterns. */
export function browseIndex(): readonly BrowseHit[] {
  if (INDEX) return INDEX;
  const out: BrowseHit[] = [];
  for (const s of BROWSE_SECTIONS) for (const l of s.links) out.push({ label: l.label, kind: s.title, to: l.to });
  for (const g of QUIZ_GROUPS) if (g.id !== "all") out.push({ label: g.name, kind: "Quiz", to: `/training?group=${g.id}` });
  for (const u of UNITS) out.push({ label: u.title, kind: "Academy lesson", to: `/academy/${u.id}` });
  for (const s of listSessions()) out.push({ label: s.title, kind: "Coach session", to: `/coach/${s.slug}` });
  for (const c of CASE_STUDIES) out.push({ label: c.title, kind: "Case", to: `/cases/${c.id}` });
  for (const t of LITERACY_TERMS) out.push({ label: t.name, kind: "Glossary", to: `/archive?tab=literacy&open=${t.id}` });
  for (const p of PATTERNS) out.push({ label: p.name, kind: "Pattern", to: `/archive?tab=patterns&open=${p.id}` });
  const seen = new Set<string>();
  INDEX = out.filter((h) => (seen.has(h.to) ? false : (seen.add(h.to), true)));
  return INDEX;
}

/** Every word must appear in the label or kind. Label-prefix hits rank first. */
export function searchBrowse(query: string, limit = 40): BrowseHit[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const hits = browseIndex().filter((h) => {
    const hay = `${h.label} ${h.kind}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
  const first = words[0];
  const rank = (h: BrowseHit) => (h.label.toLowerCase().startsWith(first) ? 0 : h.label.toLowerCase().includes(first) ? 1 : 2);
  return hits.sort((a, b) => rank(a) - rank(b)).slice(0, limit);
}

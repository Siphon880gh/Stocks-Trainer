/**
 * BA0.M2: resolve Academy content refs against the app's real registries, so a unit can only link to
 * content that exists. Hrefs are the same ones the app uses today.
 */
import { QUIZ_GROUPS } from "../quizData";
import { LITERACY_TERMS } from "../literacyTerms";
import { listSessions } from "../coaching";
import { MISC_PRACTICE_ITEMS } from "../miscPractices";
import { getCaseStudy } from "../caseStudies";
import { getLesson } from "../macro/lessons";
import { CONTENT_REF_KINDS, type ContentRef, type ContentRefKind, type RefString } from "./types";

/**
 * Every `<Route path>` in src/App.tsx, as absolute paths (refs.test.ts parses App.tsx and checks this
 * list equals the source). Update both together.
 */
export const APP_ROUTES: readonly string[] = [
  "/",
  "/market",
  "/training",
  "/archive",
  "/practice-draw",
  "/practice/flashcards",
  "/practice/label",
  "/practice/regime",
  "/practice/replay",
  "/practice/plan",
  "/practice/hunt",
  "/practice/lookalike",
  "/practice/invalidation",
  "/practice/levels",
  "/practice/ema-macd",
  "/practice/oscillators",
  "/practice/japanese-candles",
  "/practice/heikin-ashi",
  "/practice/gamma-squeeze",
  "/practice/news-biases",
  "/practice/statements",
  "/practice/read-the-print",
  "/practice/mark-the-band",
  "/cases",
  "/cases/:caseId",
  "/coach",
  "/coach/:slug",
  "/playbooks",
  "/playbooks/:id",
  "/macro",
  "/macro/play",
  "/macro/:lessonId",
  "/academy",
  "/academy/test-out/:levelId",
  "/academy/options",
  "/academy/:unitId",
  "/paper",
  "/paper/challenges",
  "/paper/challenges/:challengeId",
];

/** Practice surfaces: the Misc Practices hub items plus the financials practice pages. */
export const PRACTICE_ROUTES: readonly { route: string; label: string }[] = [
  ...MISC_PRACTICE_ITEMS.map((m) => ({ route: m.to, label: m.title })),
  { route: "/practice/statements", label: "Statements lab" },
  { route: "/practice/read-the-print", label: "Read the Print" },
  { route: "/practice/mark-the-band", label: "Mark the band" },
];

export interface ResolvedRef {
  ok: boolean;
  kind: ContentRefKind | "unknown";
  href: string;
  label: string;
  /** Why it failed (only when ok is false). */
  reason?: string;
}

/** `quiz:candle-reading` → `{ kind: "quiz", groupId: "candle-reading" }`. Unknown kinds return null. */
export function parseRef(s: string): ContentRef | null {
  const i = s.indexOf(":");
  if (i <= 0) return null;
  const kind = s.slice(0, i) as ContentRefKind;
  const v = s.slice(i + 1);
  if (!CONTENT_REF_KINDS.includes(kind) || !v) return null;
  switch (kind) {
    case "quiz":
      return { kind, groupId: v };
    case "glossary":
      return { kind, termId: v };
    case "coach":
      return { kind, slug: v };
    case "practice":
      return { kind, route: v };
    case "case":
      return { kind, caseId: v };
    case "macro":
      return { kind, lessonId: v };
    case "route":
      return { kind, path: v };
  }
}

export const glossaryHref = (termId: string) => `/archive?tab=literacy&open=${termId}`;
export const quizHref = (groupId: string) => `/training?group=${groupId}&start=1`;

/** True when `path` (query and hash ignored) matches one of APP_ROUTES, `:param` segments matching any one segment. */
export function routeExists(path: string, routes: readonly string[] = APP_ROUTES): boolean {
  const clean = path.split(/[?#]/)[0]!.replace(/\/$/, "") || "/";
  const segs = clean.split("/");
  return routes.some((r) => {
    const rs = r.split("/");
    return rs.length === segs.length && rs.every((p, i) => p.startsWith(":") ? segs[i]!.length > 0 : p === segs[i]);
  });
}

const fail = (kind: ResolvedRef["kind"], reason: string): ResolvedRef => ({ ok: false, kind, href: "", label: "", reason });

export function resolveRef(ref: ContentRef | RefString | string): ResolvedRef {
  const r = typeof ref === "string" ? parseRef(ref) : ref;
  if (!r) return fail("unknown", `not a content ref: ${String(ref)}`);
  switch (r.kind) {
    case "quiz": {
      const g = QUIZ_GROUPS.find((x) => x.id === r.groupId);
      return g ? { ok: true, kind: r.kind, href: quizHref(g.id), label: `Learn: ${g.name}` } : fail(r.kind, `unknown quiz group ${r.groupId}`);
    }
    case "glossary": {
      const t = LITERACY_TERMS.find((x) => x.id === r.termId);
      return t ? { ok: true, kind: r.kind, href: glossaryHref(t.id), label: `Glossary: ${t.name}` } : fail(r.kind, `unknown glossary term ${r.termId}`);
    }
    case "coach": {
      const s = listSessions().find((x) => x.slug === r.slug);
      return s ? { ok: true, kind: r.kind, href: `/coach/${s.slug}`, label: `Coach: ${s.title}` } : fail(r.kind, `unknown coach session ${r.slug}`);
    }
    case "practice": {
      const p = PRACTICE_ROUTES.find((x) => x.route === r.route.split(/[?#]/)[0]);
      return p ? { ok: true, kind: r.kind, href: r.route, label: `Practice: ${p.label}` } : fail(r.kind, `unknown practice route ${r.route}`);
    }
    case "case": {
      const c = getCaseStudy(r.caseId);
      return c ? { ok: true, kind: r.kind, href: `/cases/${c.id}`, label: `Case: ${c.title}` } : fail(r.kind, `unknown case ${r.caseId}`);
    }
    case "macro": {
      const l = getLesson(r.lessonId);
      return l ? { ok: true, kind: r.kind, href: `/macro/${l.id}`, label: `Macro Desk: ${l.title}` } : fail(r.kind, `unknown macro lesson ${r.lessonId}`);
    }
    case "route":
      return routeExists(r.path) ? { ok: true, kind: r.kind, href: r.path, label: routeLabel(r.path) } : fail(r.kind, `no app route for ${r.path}`);
  }
}

const ROUTE_LABELS: Record<string, string> = {
  "/paper": "Paper trading (simulated)",
  "/paper/challenges": "Paper-trading challenges",
  "/academy": "Beginner Academy",
  "/academy/options": "Options knowledge ladder",
  "/macro": "Macro Desk",
  "/macro/play": "Macro Desk reaction game",
  "/cases": "Case library",
  "/coach": "Coach",
  "/training": "Learn",
  "/market": "Charts",
  "/archive": "Glossary and archive",
  "/playbooks": "Playbooks",
};

function routeLabel(path: string): string {
  const base = path.split(/[?#]/)[0]!;
  return ROUTE_LABELS[base] ?? `Open ${base}`;
}

/**
 * Topic access audit: every route, topic and resource that existed before the navigation redesign
 * (docs/projects/navigation/topic-baseline-536eeb5.json) must still exist and still be reachable from
 * the current navigation: header menus, For your path, Browse everything (sections and search),
 * the progress map, and the hub pages those link to.
 *
 * Set TOPIC_AUDIT_OUT=<file> to write the per-area counts used by TOPIC-ACCESS-AUDIT.md.
 */
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { describe, it } from "node:test";
import { MemoryRouter, matchPath } from "react-router-dom";
import { AppRoutes, preloadPages } from "../App.tsx";
import { HEADER_NAV } from "./appNav.ts";
import { LEVEL_MENUS, MENU_IDS } from "./navLevels.ts";
import { BROWSE_SECTIONS, browseIndex, searchBrowse } from "./browseCatalog.ts";
import { TRACKS } from "./tracks.ts";
import { REGIONS, STAGES } from "./progressMap.ts";
import { QUIZ_GROUPS } from "./quizData.ts";
import { MISC_PRACTICE_ITEMS } from "./miscPractices.ts";
import { TOOL_LESSONS } from "./toolTraining/index.ts";
import { LEVELS, UNITS } from "./academy/content/levels.ts";
import { LADDER_LEVELS, LADDER_STRATEGIES } from "./academy/options/ladder.ts";
import { CHALLENGES } from "./academy/challenges.ts";
import { DESK_SCENARIOS, DESK_TOPICS } from "./academy/paper/desk/scenarios.ts";
import { CASE_PACKS, CASE_STUDIES } from "./caseStudies.ts";
import { listSessions } from "./coaching/index.ts";
import { PLAYBOOKS } from "./playbooks.ts";
import { MACRO_LESSONS } from "./macro/lessons.ts";
import { MACRO_ROUNDS } from "./macro/game.ts";
import { MACRO_TERMS } from "./macro/glossary.ts";
import { PATTERNS } from "./patterns.ts";
import { OVERLAYS } from "./overlays.ts";
import { LITERACY_TERMS } from "./literacyTerms.ts";
import { MARKET_THEMES } from "./marketThemes/index.ts";
import { NARRATIVES } from "./techniqueNarratives.ts";
import { THEMES } from "./patternThemes.ts";
import { CONTENT_SIM_SETS } from "./contentSims.ts";
import { PATH_TEMPLATES } from "./learningPaths.ts";
import { setChartGateTemporaryBypass } from "./beginnerPath.ts";
import { hrefs, renderHtml } from "./macro/renderHarness.ts";

// Pages are lazy chunks in the app; load them all so the static renders below are complete.
await preloadPages();

type Baseline = Record<string, any>;
const BASE: Baseline = JSON.parse(readFileSync(new URL("../../docs/projects/navigation/topic-baseline-536eeb5.json", import.meta.url), "utf8"));
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), "utf8");

/* ---------- current routes ---------- */
const APP_SRC = read("../App.tsx");
const ROUTES = [...new Set([...APP_SRC.matchAll(/<Route path="([^"]+)"/g)].map((m) => (m[1] === "/" ? "/" : `/${m[1]}`)))];
const isParam = (r: string) => r.includes(":");
const routeFor = (to: string) => {
  const path = to.split(/[?#]/)[0] || "/";
  return ROUTES.find((r) => !isParam(r) && r === path) ?? ROUTES.find((r) => isParam(r) && matchPath(r, path));
};

/* ---------- reachable link set: href -> first click path that shows it ---------- */
const decode = (h: string) => h.replace(/&amp;/g, "&");
const REACH = new Map<string, string>();
const add = (to: string, via: string) => {
  const h = decode(to);
  if (h.startsWith("/") && !REACH.has(h)) REACH.set(h, via);
};
for (const h of HEADER_NAV) if (h.to) add(h.to, `Header › ${h.label}`);
for (const m of MENU_IDS) for (const i of LEVEL_MENUS[m]) add(i.to, `Header › ${HEADER_NAV.find((h) => h.menu === m)?.label ?? m} › ${i.level} tab › ${i.label}`);
for (const t of TRACKS) for (const s of t.steps) add(s.to, `Home › For your path (${t.title}) › ${s.label ?? s.to}`);
for (const s of BROWSE_SECTIONS) for (const l of s.links) add(l.to, `Header › Browse everything › ${s.title} › ${l.label}`);
for (const hit of browseIndex()) {
  const found = searchBrowse(hit.label, 400).some((x) => x.to === hit.to) || searchBrowse(`${hit.label} ${hit.kind}`, 400).some((x) => x.to === hit.to);
  if (found) add(hit.to, `Header › Browse everything › search "${hit.label}" (${hit.kind})`);
}
for (const st of STAGES) add(st.to, `Header › Map › ${REGIONS.find((r) => r.id === st.region)?.name ?? st.region} › ${st.title}`);

const pathReachable = (url: string) => {
  if (REACH.has(url)) return true;
  const path = url.split(/[?#]/)[0];
  return [...REACH.keys()].some((h) => h.split(/[?#]/)[0] === path);
};
const viaFor = (url: string) => REACH.get(url) ?? [...REACH.entries()].find(([h]) => h.split(/[?#]/)[0] === url.split(/[?#]/)[0])?.[1] ?? "";

/* ---------- hub pages: rendered once, their links and text join the reachable set ---------- */
const pageCache = new Map<string, { html: string; text: string }>();
function page(url: string) {
  let p = pageCache.get(url);
  if (!p) {
    const html = renderHtml(
      <MemoryRouter initialEntries={[url]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    const text = html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ");
    p = { html, text };
    pageCache.set(url, p);
  }
  return p;
}
const HUBS = [
  "/training",
  "/academy",
  "/academy/options",
  "/paper",
  "/paper/desk",
  "/paper/challenges",
  "/cases",
  ...CASE_PACKS.map((p) => `/cases?pack=${p.id}`),
  "/coach",
  "/playbooks",
  "/tools",
  "/macro",
  "/map",
  "/archive",
  "/archive?tab=patterns",
  "/archive?tab=indicators",
  "/archive?tab=literacy",
  "/practice/technique-narratives",
  "/practice/pattern-themes",
];
const COACH_CLASSES = ["equity", "future", "forex", "crypto", "option_context"];
for (const hub of HUBS) {
  if (!pathReachable(hub)) continue;
  for (const h of hrefs(page(hub).html)) add(h, `${viaFor(hub)} › ${hub} page`);
}
// Non-equity coach lists sit behind the chart gate; the page's peek switch opens them (unchanged since the baseline).
(globalThis as any).sessionStorage ??= (() => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
})();
setChartGateTemporaryBypass(true);
for (const c of COACH_CLASSES) {
  const hub = `/coach?class=${c}`;
  if (pathReachable(hub)) for (const h of hrefs(page(hub).html)) add(h, `${viaFor(hub)} › peek switch`);
}
setChartGateTemporaryBypass(false);

/* ---------- per-area checks ---------- */
interface Row { area: string; baseline: number; now: number; reachable: number; missing: string[]; unreachable: string[]; via: string }
const ROWS: Row[] = [];
function area(name: string, baseIds: readonly string[], nowIds: readonly string[], reach: (id: string) => boolean, via: (id: string) => string) {
  const now = new Set(nowIds);
  const missing = baseIds.filter((id) => !now.has(id));
  const unreachable = baseIds.filter((id) => now.has(id) && !reach(id));
  ROWS.push({ area: name, baseline: baseIds.length, now: now.size, reachable: baseIds.length - missing.length - unreachable.length, missing, unreachable, via: baseIds.length ? via(baseIds[0]!) : "" });
}
const hrefArea = (name: string, key: string, nowIds: readonly string[], url: (id: string) => string) =>
  area(name, BASE[key], nowIds, (id) => REACH.has(url(id)), (id) => `${REACH.get(url(id)) ?? ""} → ${url(id)}`);
const textOn = (hub: string, s: string) => pathReachable(hub) && page(hub).text.includes(s);
const nameOf = (x: any): string => x.title ?? x.name ?? x.label ?? x.id;

// Routes
area("Routes", BASE.routes, ROUTES, (r) => (isParam(r) ? [...REACH.keys()].some((h) => !!matchPath(r, h.split(/[?#]/)[0]!)) : pathReachable(r)), (r) => viaFor(r));
// Quiz groups ("all" is the TOC's mixed quiz button)
area("Quiz groups", BASE.quizGroups, QUIZ_GROUPS.map((g) => g.id), (id) => REACH.has(`/training?group=${id}`) || (id === "all" && pathReachable("/training")), (id) => viaFor(`/training?group=${id}`));
area("Practice labs", BASE.practiceLabs, ROUTES, (to) => pathReachable(to), viaFor);
area("Practice items", BASE.miscPractices, MISC_PRACTICE_ITEMS.map((m) => m.id), (id) => pathReachable(MISC_PRACTICE_ITEMS.find((m) => m.id === id)!.to), (id) => viaFor(MISC_PRACTICE_ITEMS.find((m) => m.id === id)!.to));
area("Tool training pages", BASE.toolTraining, ROUTES.filter((r) => !isParam(r)).concat(TOOL_LESSONS.map((t: any) => t.route)), pathReachable, viaFor);
area("Tool lessons", BASE.toolLessons, TOOL_LESSONS.map((t: any) => t.route), pathReachable, viaFor);
hrefArea("Academy levels (test-outs)", "academyLevels", LEVELS.map((l) => l.id), (id) => `/academy/test-out/${id}`);
hrefArea("Academy units", "academyUnits", UNITS.map((u) => u.id), (id) => `/academy/${id}`);
hrefArea("Test-outs", "testOuts", LEVELS.map((l) => l.id), (id) => `/academy/test-out/${id}`);
area("Option strategies", BASE.optionStrategies, LADDER_STRATEGIES.map((s) => s.id), (id) => {
  const s = LADDER_STRATEGIES.find((x) => x.id === id)!;
  // Higher levels unlock in place after the level before is passed (unchanged since the baseline).
  return textOn("/academy/options", s.name) || (pathReachable("/academy/options") && page("/academy/options").html.includes(`data-level="${s.level}"`));
}, () => `${viaFor("/academy/options")} → level card (unlocks after the level before)`);
area("Option ladder levels", BASE.optionLadderLevels.map(String), LADDER_LEVELS.map((l) => String(l.level)), (lv) => textOn("/academy/options", LADDER_LEVELS.find((l) => String(l.level) === lv)!.title), () => `${viaFor("/academy/options")} → level section`);
hrefArea("Challenges", "challenges", CHALLENGES.map((c) => c.id), (id) => `/paper/challenges/${id}`);
area("Desk scenarios", BASE.deskScenarios, DESK_SCENARIOS.map((s) => s.id), (id) => textOn("/paper/desk", DESK_SCENARIOS.find((s) => s.id === id)!.title), () => `${viaFor("/paper/desk")} → scenario picker`);
area("Desk topics", BASE.deskTopics, DESK_TOPICS.map((t: any) => t.id), (id) => textOn("/paper/desk", nameOf(DESK_TOPICS.find((t: any) => t.id === id))), () => `${viaFor("/paper/desk")} → topic filter`);
hrefArea("Case packs", "casePacks", CASE_PACKS.map((p) => p.id), (id) => `/cases?pack=${id}`);
hrefArea("Cases", "cases", CASE_STUDIES.map((c) => c.id), (id) => `/cases/${id}`);
area("Coach sessions", BASE.coachSessions.map((s: any) => s.slug), listSessions().map((s) => s.slug), (s) => REACH.has(`/coach/${s}`), (s) => `${REACH.get(`/coach/${s}`) ?? ""} → /coach/${s}`);
{
  const pairs: string[] = BASE.coachSessions.flatMap((s: any) => s.classes.filter((c: string) => c !== "equity").map((c: string) => `${c}:${s.slug}`));
  const now = listSessions().flatMap((s) => COACH_CLASSES.filter((c) => c !== "equity").map((c) => `${c}:${s.slug}`));
  area("Coach sessions under a non-equity class", pairs, now, (p) => {
    const [c, slug] = p.split(":");
    return pathReachable(`/coach?class=${c}`) && hrefs(page(`/coach?class=${c}`).html).includes(`/coach/${slug}`);
  }, (p) => `${viaFor(`/coach?class=${p.split(":")[0]}`)} → /coach?class=${p.split(":")[0]}`);
}
hrefArea("Playbooks", "playbooks", PLAYBOOKS.map((p) => p.id), (id) => `/playbooks/${id}`);
hrefArea("Macro lessons", "macroLessons", MACRO_LESSONS.map((l: any) => l.id), (id) => `/macro/${id}`);
area("Macro rounds", BASE.macroRounds, MACRO_ROUNDS.map((r: any) => r.id), () => pathReachable("/macro/play"), () => `${viaFor("/macro/play")} → /macro/play`);
area("Macro terms", BASE.macroTerms, MACRO_TERMS.map((t: any) => t.id).filter((id) => LITERACY_TERMS.some((l) => l.id === id)), (id) => REACH.has(`/archive?tab=literacy&open=${id}`), (id) => viaFor(`/archive?tab=literacy&open=${id}`));
hrefArea("Patterns", "patterns", PATTERNS.map((p) => p.id), (id) => `/archive?tab=patterns&open=${id}`);
area("Indicators", BASE.indicators, OVERLAYS.map((o) => o.id), (id) => textOn("/archive?tab=indicators", OVERLAYS.find((o) => o.id === id)!.fullName), () => `${viaFor("/archive?tab=indicators")} → Indicators tab`);
hrefArea("Glossary terms", "glossary", LITERACY_TERMS.map((t) => t.id), (id) => `/archive?tab=literacy&open=${id}`);
area("Market themes", BASE.marketThemes, ROUTES, pathReachable, viaFor);
area("Narratives", BASE.narratives, NARRATIVES.map((n) => n.id), (id) => textOn("/practice/technique-narratives", NARRATIVES.find((n) => n.id === id)!.title), () => `${viaFor("/practice/technique-narratives")} → narrative picker`);
area("Pattern themes", BASE.patternThemes, THEMES.map((t) => t.id), (id) => textOn("/practice/pattern-themes", THEMES.find((t) => t.id === id)!.name), () => `${viaFor("/practice/pattern-themes")} → theme list`);
area("Simulation set pages", BASE.simulationSetRoutes, ROUTES.filter((r) => !isParam(r)).concat(UNITS.map((u) => `/academy/${u.id}`), MACRO_LESSONS.map((l: any) => `/macro/${l.id}`), TOOL_LESSONS.map((t: any) => t.route)), (to) => REACH.has(to) || pathReachable(to), viaFor);
area("Learning paths", BASE.learningPaths, PATH_TEMPLATES.map((p) => p.id), (id) => TRACKS.some((t) => t.pathId === id), (id) => `Home › path picker › ${TRACKS.find((t) => t.pathId === id)?.title ?? "?"}`);
area("Map regions", BASE.mapRegions, REGIONS.map((r) => r.id), (id) => pathReachable("/map") && page("/map").text.includes(REGIONS.find((r) => r.id === id)!.name), () => `${viaFor("/map")} → region`);
area("Map stages", BASE.mapStages, STAGES.map((s) => s.id), (id) => pathReachable("/map") && !!routeFor(STAGES.find((s) => s.id === id)!.to), () => `${viaFor("/map")} → stage`);
{
  const training = read("../pages/Training.tsx");
  const ids = [...BASE.tocGroups, ...BASE.tocAliases];
  area("TOC groups and aliases", ids, ids.filter((id) => training.includes(`"${id}"`)), () => pathReachable("/training"), () => viaFor("/training"));
}
{
  const fileFor = (readBy: string) => (readBy.startsWith("src/") ? readBy : readBy === "SimProvider" ? "src/components/tools/Simulation.tsx" : "src/pages/Training.tsx");
  const kinds: string[] = BASE.deepLinks.map((d: any) => `${d.route}${d.param}`);
  const nowKinds = BASE.deepLinks
    .filter((d: any) => {
      const src = read(`../../${fileFor(d.readBy)}`);
      const key = d.param.slice(1);
      return src.includes(`"${key}"`) || src.includes(`'${key}'`) || src.includes(`#${key}`) || src.includes(`${key}=`);
    })
    .map((d: any) => `${d.route}${d.param}`);
  area("Deep-link kinds", kinds, nowKinds, (k) => !!ROUTES.find((r) => r === k.split(/[?#]/)[0]), () => "read by the page named in the baseline");
}

if (process.env.TOPIC_AUDIT_OUT) writeFileSync(process.env.TOPIC_AUDIT_OUT, JSON.stringify({ rows: ROWS, reachableLinks: REACH.size }, null, 2));

describe("Topic access after the navigation redesign", () => {
  for (const r of ROWS) {
    it(`${r.area}: all ${r.baseline} baseline items still exist and are reachable`, () => {
      assert.deepEqual(r.missing, [], `${r.area}: removed since 536eeb5`);
      assert.deepEqual(r.unreachable, [], `${r.area}: no click path from the current navigation`);
    });
  }
  it("covers every area of the baseline", () => {
    assert.ok(ROWS.length >= 30);
    assert.ok(REACH.size > 1000);
  });
});

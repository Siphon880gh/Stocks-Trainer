import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { APP_ROUTES } from "./academy/refs";
import {
  ACADEMY_MORE,
  DASHBOARD_MORE,
  DEEP_STUDY,
  HEADER_NAV,
  OTHER_FACTORS,
  PATTERN_MORE,
  PRACTICE_MENU,
  QUICK_DECISIONS,
  TOOL_TRAINING,
} from "./appNav";
import { LEVEL_MENUS, MENU_IDS } from "./navLevels";
import { BROWSE_SECTIONS } from "./browseCatalog";
import { STAGES } from "./progressMap";
import { TRACKS } from "./tracks";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const inventory = readFileSync(join(root, "docs", "NAVIGATION-INVENTORY.md"), "utf8");

const pathOf = (to: string) => to.split(/[?#]/)[0]!.replace(/(.)\/$/, "$1");

/** Links in the Table of Contents page and the cards it renders. */
function tocLinks(): string[] {
  const files = [
    "src/pages/Training.tsx",
    "src/components/academy/AcademyTrainingCard.tsx",
    "src/components/financials/FinancialsTrainingCard.tsx",
    "src/components/macro/MacroTrainingCard.tsx",
  ];
  const found: string[] = [];
  for (const f of files) {
    const src = readFileSync(join(root, f), "utf8");
    for (const m of src.matchAll(/to=\{?["`](\/[^"`$]*)/g)) found.push(m[1]!);
  }
  return [...found, ...PRACTICE_MENU.map((i) => i.to), ...TOOL_TRAINING.map((i) => i.to)];
}

/** The directional header: top-level links plus the level tabs of the Learn, Practice and Trade dropdowns. */
const headerGroups: readonly (readonly { to: string }[])[] = [
  HEADER_NAV.flatMap((i) => (i.to ? [{ to: i.to }] : [])), ...MENU_IDS.map((m) => LEVEL_MENUS[m]),
];
const headerLinks = headerGroups.flatMap((group) => group.map((i) => i.to));
const browseLinks = BROWSE_SECTIONS.flatMap((s) => s.links.map((l) => l.to));

/** Every static route a learner can reach from the header, Browse everything, the Table of Contents or the progress map. */
const entryPoints = new Set([...headerLinks, ...browseLinks, ...tocLinks(), ...STAGES.map((s) => s.to)].map(pathOf));

const staticRoutes = APP_ROUTES.filter((r) => !r.includes(":"));
const paramRoutes = APP_ROUTES.filter((r) => r.includes(":"));

test("every app route is listed in docs/NAVIGATION-INVENTORY.md", () => {
  for (const r of APP_ROUTES) assert.ok(inventory.includes(`\`${r}\``), `${r} is missing from the navigation inventory`);
});

test("the inventory's route sections match the router exactly", () => {
  const listed = [...inventory.matchAll(/^#### `(\/[^`]*)`$/gm)].map((m) => m[1]!);
  assert.deepEqual([...listed].sort(), [...APP_ROUTES].sort());
});

test("every static route has a header, Table of Contents or progress map entry point", () => {
  for (const r of staticRoutes) assert.ok(entryPoints.has(r), `${r} has no navigation entry point`);
});

test("every param route's hub is a static route with an entry point", () => {
  for (const r of paramRoutes) {
    const segs = r.split("/");
    const hub = segs.slice(0, segs.findIndex((s) => s.startsWith(":"))).join("/") || "/";
    // /academy/test-out/:levelId hangs off /academy; /paper/challenges/:id off /paper/challenges.
    const candidates = [hub, hub.split("/").slice(0, -1).join("/")].filter(Boolean);
    assert.ok(candidates.some((h) => staticRoutes.includes(h) && entryPoints.has(h)), `${r} has no reachable hub`);
  }
});

test("every item from the old header menus is still in the header or Browse everything", () => {
  const old: readonly (readonly { label: string; to: string }[])[] = [DASHBOARD_MORE, ACADEMY_MORE, PATTERN_MORE, PRACTICE_MENU, TOOL_TRAINING, DEEP_STUDY, OTHER_FACTORS, QUICK_DECISIONS];
  const reach = new Set([...headerLinks, ...browseLinks]);
  for (const item of old.flat()) assert.ok(reach.has(item.to), `${item.label} (${item.to}) lost its menu entry`);
  for (const to of ["/", "/training", "/academy", "/training#patterns", "/training#practice"]) assert.ok(reach.has(to), `old top-level ${to}`);
});

test("every learner-track step opens a route, or a hub's detail page, that also has a header, Browse or map entry point", () => {
  const reachable = (path: string) => {
    const segs = path.split("/");
    for (let n = segs.length; n > 1; n--) if (entryPoints.has(segs.slice(0, n).join("/"))) return true;
    return entryPoints.has(path);
  };
  for (const t of TRACKS) for (const s of t.steps) assert.ok(reachable(pathOf(s.to)), `${t.id}: ${s.to}`);
});

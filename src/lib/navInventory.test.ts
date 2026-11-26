import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { APP_ROUTES } from "./academy/refs";
import {
  ACADEMY_MORE,
  APP_NAV,
  DASHBOARD_MORE,
  DEEP_STUDY,
  OTHER_FACTORS,
  PATTERN_MORE,
  PRACTICE_MENU,
  QUICK_DECISIONS,
  TOOL_TRAINING,
} from "./appNav";
import { STAGES } from "./progressMap";

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

const menuGroups: readonly (readonly { to: string }[])[] = [
  APP_NAV, DASHBOARD_MORE, ACADEMY_MORE, PATTERN_MORE, PRACTICE_MENU, TOOL_TRAINING, DEEP_STUDY, OTHER_FACTORS, QUICK_DECISIONS,
];
const menuLinks = menuGroups.flatMap((group) => group.map((i) => i.to));

/** Every static route a learner can reach from the header, the Table of Contents or the progress map. */
const entryPoints = new Set([...menuLinks, ...tocLinks(), ...STAGES.map((s) => s.to)].map(pathOf));

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

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { APP_ROUTES, parseRef, resolveRef, routeExists } from "./refs";
import { CONTENT_REF_KINDS } from "./types";

const here = dirname(fileURLToPath(import.meta.url));

test("parseRef covers all 7 kinds and rejects junk", () => {
  assert.equal(CONTENT_REF_KINDS.length, 7);
  for (const k of CONTENT_REF_KINDS) assert.equal(parseRef(`${k}:x`)?.kind, k);
  assert.equal(parseRef("nope:x"), null);
  assert.equal(parseRef("quiz:"), null);
  assert.equal(parseRef("candle-reading"), null);
});

const GOOD: Record<string, [string, string]> = {
  quiz: ["quiz:candle-reading", "/training?group=candle-reading&start=1"],
  glossary: ["glossary:trailing-stop", "/archive?tab=literacy&open=trailing-stop"],
  coach: ["coach:trailing-stop-exit", "/coach/trailing-stop-exit"],
  practice: ["practice:/practice/plan", "/practice/plan"],
  case: ["case:case-earn-beat-miss", "/cases/case-earn-beat-miss"],
  macro: ["macro:cpi", "/macro/cpi"],
  route: ["route:/macro/play", "/macro/play"],
};
const BAD: Record<string, string> = {
  quiz: "quiz:no-such-group",
  glossary: "glossary:no-such-term",
  coach: "coach:no-such-session",
  practice: "practice:/practice/nope",
  case: "case:case-nope",
  macro: "macro:nope",
  route: "route:/nowhere/at/all",
};

test("one good and one broken ref per kind", () => {
  for (const k of CONTENT_REF_KINDS) {
    const [ref, href] = GOOD[k]!;
    const r = resolveRef(ref);
    assert.equal(r.ok, true, ref);
    assert.equal(r.href, href, ref);
    assert.ok(r.label.length > 0);
    const b = resolveRef(BAD[k]!);
    assert.equal(b.ok, false, BAD[k]);
    assert.equal(b.kind, k);
    assert.ok(b.reason && b.reason.length > 0);
  }
  assert.equal(resolveRef("garbage").ok, false);
});

test("route params match one segment; query strings are ignored", () => {
  assert.ok(routeExists("/cases/anything"));
  assert.ok(routeExists("/training?group=x&start=1"));
  assert.ok(!routeExists("/cases/a/b"));
  assert.ok(routeExists("/"));
});

test("APP_ROUTES equals every <Route path> in App.tsx (parsed from source)", () => {
  const src = readFileSync(join(here, "../../App.tsx"), "utf8");
  const found = new Set<string>(["/"]);
  for (const m of src.matchAll(/<Route\s+path="([^"]+)"/g)) {
    const p = m[1]!;
    if (p === "/") continue;
    found.add("/" + p.replace(/^\//, ""));
  }
  assert.deepEqual([...found].sort(), [...APP_ROUTES].sort());
});

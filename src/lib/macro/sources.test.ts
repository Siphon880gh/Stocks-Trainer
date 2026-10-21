import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MACRO_SOURCES, OFFICIAL_HOSTS } from "./sources";

function sourcesMdRows() {
  const md = readFileSync(new URL("../../../docs/projects/macro-forces/SOURCES.md", import.meta.url), "utf8");
  const registry = md.split("## Layout")[0];
  return registry
    .split("\n")
    .filter((l) => l.startsWith("| ") && l.includes("http"))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()))
    .map(([id, agency, title, url, , bot]) => ({ id, agency, title, url, botBlocked: bot === "yes" }));
}

test("registry matches SOURCES.md one-to-one", () => {
  const rows = sourcesMdRows();
  assert.equal(rows.length, MACRO_SOURCES.length);
  for (const r of rows) {
    const s = MACRO_SOURCES.find((x) => x.id === r.id);
    assert.ok(s, `missing in registry: ${r.id}`);
    assert.equal(s.url, r.url, r.id);
    assert.equal(s.botBlocked, r.botBlocked, r.id);
  }
});

test("ids unique, https, official hosts, FRED ids well-formed", () => {
  const ids = new Set<string>();
  for (const s of MACRO_SOURCES) {
    assert.ok(!ids.has(s.id), `dup ${s.id}`);
    ids.add(s.id);
    const u = new URL(s.url);
    assert.equal(u.protocol, "https:", s.id);
    assert.ok(OFFICIAL_HOSTS.includes(u.host), `${s.id} host ${u.host}`);
    if (s.fredSeries) {
      assert.match(s.fredSeries, /^[A-Z0-9]+$/);
      assert.equal(s.url, `https://fred.stlouisfed.org/series/${s.fredSeries}`);
    }
  }
});

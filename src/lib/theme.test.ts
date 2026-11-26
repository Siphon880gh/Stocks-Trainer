import test from "node:test";
import assert from "node:assert/strict";
import { applyTheme, readThemePref, resolveTheme, THEME_KEY, writeThemePref } from "./theme";

const mem = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
};

test("theme: nothing saved means follow the device", () => {
  assert.equal(readThemePref(mem()), "system");
  assert.equal(readThemePref(null), "system");
});

test("theme: a saved choice round-trips under analysis_core_theme_v1", () => {
  const kv = mem();
  for (const p of ["light", "dark", "system"] as const) {
    writeThemePref(p, kv);
    assert.equal(kv.m.get(THEME_KEY), p);
    assert.equal(readThemePref(kv), p);
  }
  assert.equal(THEME_KEY, "analysis_core_theme_v1");
});

test("theme: unknown or JSON-quoted values are tolerated", () => {
  const kv = mem();
  kv.setItem(THEME_KEY, "sepia");
  assert.equal(readThemePref(kv), "system");
  kv.setItem(THEME_KEY, '"dark"');
  assert.equal(readThemePref(kv), "dark");
});

test("theme: storage that throws does not break reading or writing", () => {
  const bad = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
  assert.equal(readThemePref(bad), "system");
  assert.doesNotThrow(() => writeThemePref("dark", bad));
});

test("theme: system resolves from the device, explicit choices win", () => {
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

test("theme: applyTheme sets the class, data-theme and color-scheme on the root", () => {
  const classes = new Set<string>();
  const root = {
    classList: { toggle: (c: string, on: boolean) => (on ? classes.add(c) : classes.delete(c)) },
    dataset: {} as Record<string, string>,
    style: {} as Record<string, string>,
  };
  applyTheme("dark", root as unknown as HTMLElement);
  assert.ok(classes.has("dark"));
  assert.equal(root.dataset.theme, "dark");
  assert.equal(root.style.colorScheme, "dark");
  applyTheme("light", root as unknown as HTMLElement);
  assert.ok(!classes.has("dark"));
  assert.equal(root.dataset.theme, "light");
});

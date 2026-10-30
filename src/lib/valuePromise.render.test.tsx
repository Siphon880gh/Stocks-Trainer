import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { VALUE_PROMISE } from "./academy/copy";
import { bannedIn } from "./academy/content/banned";

const store = new Map<string, string>();
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
};

test("value promise: plain, sentence case, no banned wording, and no claim of a real certificate", () => {
  assert.equal(VALUE_PROMISE, "Earn each credential by passing short checks. Already know it? Test out and move on. No videos required.");
  assert.deepEqual(bannedIn(VALUE_PROMISE), []);
  assert.doesNotMatch(VALUE_PROMISE, /certif|!|[A-Z]{3,}/);
});

test("value promise: first thing on Home (above the path picker), and in the README hero and index.html description", async () => {
  const { default: Dashboard } = await import("../pages/Dashboard");
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
  const at = html.indexOf('data-testid="value-promise"');
  assert.ok(at > 0, "rendered on Home");
  assert.ok(html.includes(VALUE_PROMISE));
  const picker = html.indexOf("Choose a path");
  assert.ok(picker === -1 || at < picker, "above the path picker");
  const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");
  assert.ok(readme.split("\n").slice(0, 8).join("\n").includes(VALUE_PROMISE), "README hero");
  assert.match(readme, /not attested certificates/);
  const index = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  assert.ok(index.includes(`<meta name="description" content="Learn to read stocks and charts with practice data. ${VALUE_PROMISE}" />`));
});

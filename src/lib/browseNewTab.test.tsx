import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import BrowseEverything from "../pages/BrowseEverything.tsx";
import { BROWSE_NEW_TAB_KEY, loadBrowseNewTab, newTabProps, saveBrowseNewTab } from "./browseNewTab.ts";
import { renderHtml } from "./macro/renderHarness.ts";

function memory() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

const anchors = (html: string) => [...html.matchAll(/<a [^>]*>/g)].map((m) => m[0]);

describe("Browse everything new-tab toggle", () => {
  it("is off by default and remembers the choice under an analysis_core_ key", () => {
    const s = memory();
    assert.match(BROWSE_NEW_TAB_KEY, /^analysis_core_/);
    assert.equal(loadBrowseNewTab(s), false);
    saveBrowseNewTab(true, s);
    assert.equal(loadBrowseNewTab(s), true);
    saveBrowseNewTab(false, s);
    assert.equal(loadBrowseNewTab(s), false);
    assert.equal(loadBrowseNewTab(undefined), false);
  });

  it("adds target and rel only when on", () => {
    assert.deepEqual(newTabProps(false), {});
    assert.deepEqual(newTabProps(true), { target: "_blank", rel: "noopener noreferrer" });
  });

  it("renders an accessible switch, off, with in-app links", () => {
    const html = renderHtml(
      <MemoryRouter initialEntries={["/browse"]}>
        <BrowseEverything initialNewTab={false} />
      </MemoryRouter>,
    );
    assert.match(html, /role="switch"[^>]*aria-checked="false"/);
    assert.match(html, /Open links in a new tab/);
    const links = anchors(html);
    assert.ok(links.length > 50);
    assert.ok(links.every((a) => !a.includes('target="_blank"')));
  });

  it("when on, every link opens a new tab and keeps the mounted base, query and hash", () => {
    const mounted = "/app/stocks-trainer";
    const html = renderHtml(
      <MemoryRouter basename={mounted} initialEntries={[`${mounted}/browse`]}>
        <BrowseEverything initialNewTab />
      </MemoryRouter>,
    );
    assert.match(html, /role="switch"[^>]*aria-checked="true"/);
    const links = anchors(html);
    assert.ok(links.length > 50);
    for (const a of links) {
      assert.ok(a.includes('target="_blank"') && a.includes('rel="noopener noreferrer"'), a);
      assert.ok(/href="\/app\/stocks-trainer(["\/?#])/.test(a), a);
    }
    assert.ok(links.some((a) => /href="[^"]*\?[^"]+"/.test(a)), "a link with a query survives");
    assert.ok(links.some((a) => /href="[^"]*#[^"]+"/.test(a)), "a link with a hash survives");
  });
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../App.tsx";
import { browseModalOf, browseModalState, pageLocation, rememberBrowseTrigger, takeBrowseTrigger } from "./browseModal.ts";
import { renderHtml } from "./macro/renderHarness.ts";

const browse = { pathname: "/browse", search: "", hash: "", key: "k1" };

describe("Browse everything popup state", () => {
  it("round-trips the background location and title", () => {
    const st = browseModalState(browse, "Library and glossary");
    assert.deepEqual(browseModalOf(st), { background: { ...browse, state: null }, title: "Library and glossary" });
  });

  it("ignores missing or malformed state, so a normal visit is a full page", () => {
    for (const bad of [null, undefined, {}, { browseModal: null }, { browseModal: { background: { pathname: "browse" } } }, "x"]) {
      assert.equal(browseModalOf(bad), null);
    }
    assert.equal(browseModalOf({ browseModal: { background: browse, title: " " } })?.title, "Preview");
  });

  it("renders the page behind the popup from the background location", () => {
    const loc = { pathname: "/archive", search: "?tab=patterns", hash: "", state: browseModalState(browse, "Library") };
    assert.equal(pageLocation(loc).pathname, "/browse");
    assert.equal(pageLocation({ pathname: "/map", state: null }).pathname, "/map");
  });

  it("hands back the opening link once", () => {
    const el = { focus() {} } as unknown as HTMLElement;
    rememberBrowseTrigger(el);
    assert.equal(takeBrowseTrigger(), el);
    assert.equal(takeBrowseTrigger(), null);
  });

  it("drops the new tab switch and its stored setting", () => {
    const page = readFileSync(new URL("../pages/BrowseEverything.tsx", import.meta.url), "utf8");
    assert.doesNotMatch(page, /_blank|role="switch"|browse_new_tab/);
  });
});

describe("Browse everything popup render", () => {
  const render = (entry: { pathname: string; search?: string; hash?: string; state?: unknown }, basename?: string) =>
    renderHtml(
      <MemoryRouter basename={basename} initialEntries={[basename ? { ...entry, pathname: basename + entry.pathname } : entry]}>
        <AppRoutes />
      </MemoryRouter>,
    );

  it("shows the destination in an accessible dialog over Browse, with Close and Open full page", () => {
    const html = render({ pathname: "/archive", search: "?tab=patterns&open=doji", state: browseModalState(browse, "Doji") });
    assert.match(html, /data-testid="browse-everything"/, "Browse stays behind");
    assert.match(html, /role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="browse-modal-title"/);
    assert.match(html, /id="browse-modal-title"[^>]*>Doji</);
    assert.match(html, /aria-label="Close"/);
    assert.match(html, /data-testid="browse-modal-full" href="\/archive\?tab=patterns&amp;open=doji"/);
    assert.match(html, /z-index:100/);
    const body = html.slice(html.indexOf('data-testid="browse-modal-body"'));
    assert.match(body, /<h1[^>]*>[^<]*Library/, "the Library page renders inside the popup");
  });

  it("keeps the mounted base path on Open full page", () => {
    const base = "/app/stocks-trainer";
    const html = render({ pathname: "/training", hash: "#practice", state: browseModalState(browse, "Full Table of Contents") }, base);
    assert.match(html, /data-testid="browse-modal-full" href="\/app\/stocks-trainer\/training#practice"/);
  });

  it("is a normal full page without popup state", () => {
    const html = render({ pathname: "/archive", search: "?tab=patterns" });
    assert.doesNotMatch(html, /data-testid="browse-modal"/);
    assert.doesNotMatch(html, /data-testid="browse-everything"/);
  });
});

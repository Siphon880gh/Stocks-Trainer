import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import AppChrome from "../components/AppChrome.tsx";
import { hrefs, renderHtml } from "./macro/renderHarness.ts";

describe("AppChrome header nav", () => {
  const html = renderHtml(
    <MemoryRouter initialEntries={["/playbooks"]}>
      <AppChrome>
        <p>body</p>
      </AppChrome>
    </MemoryRouter>,
  );

  it("links Home, Learn, Academy, Charts, Cases, Coach and Playbooks", () => {
    const nav = html.slice(html.indexOf('data-testid="app-nav"'), html.indexOf("</nav>"));
    assert.deepEqual(hrefs(nav), ["/", "/training", "/academy", "/market", "/cases", "/coach", "/playbooks"]);
  });

  it("links the progress map from the header, outside the section-link row", () => {
    assert.match(html, /data-testid="nav-map"[^>]*>|href="\/map"[^>]*data-testid="nav-map"/);
    assert.ok(html.indexOf('href="/map"') > -1 && html.indexOf('href="/map"') < html.indexOf('data-testid="app-nav"'));
  });

  it("gives the links a wrapping full-width row below md, so Academy through Playbooks stay on a phone screen", () => {
    const navTag = html.match(/<nav[^>]*data-testid="app-nav"[^>]*>|<nav[^>]*>/)![0];
    assert.match(navTag, /\bw-full\b/);
    assert.match(navTag, /\bmd:w-auto\b/);
    assert.match(navTag, /\bmd:ml-auto\b/);
    assert.match(navTag, /\bflex-wrap\b/);
    assert.match(navTag, /\bmd:flex-nowrap\b/);
    assert.doesNotMatch(navTag, /overflow-x-auto/);
    assert.doesNotMatch(navTag, /(^|\s)ml-auto\b/);
    assert.match(html, /flex-wrap md:flex-nowrap/);
    assert.doesNotMatch(html, /class="[^"]*(?<!md:)\bh-14\b/, "fixed one-row height only from md up");
  });
});

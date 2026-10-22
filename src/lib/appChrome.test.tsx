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

  it("links all six sections", () => {
    const nav = html.slice(html.indexOf('data-testid="app-nav"'), html.indexOf("</nav>"));
    assert.deepEqual(hrefs(nav), ["/", "/training", "/market", "/cases", "/coach", "/playbooks"]);
  });

  it("gives the links a full-width row below sm, so Coach and Playbooks are not hidden off a phone screen", () => {
    const navTag = html.match(/<nav[^>]*data-testid="app-nav"[^>]*>|<nav[^>]*>/)![0];
    assert.match(navTag, /\bw-full\b/);
    assert.match(navTag, /\bsm:w-auto\b/);
    assert.match(navTag, /\bsm:ml-auto\b/);
    assert.doesNotMatch(navTag, /(^|\s)ml-auto\b/);
    assert.match(html, /flex-wrap sm:flex-nowrap/);
    assert.doesNotMatch(html, /class="[^"]*(?<!sm:)\bh-14\b/, "fixed one-row height only from sm up");
  });
});

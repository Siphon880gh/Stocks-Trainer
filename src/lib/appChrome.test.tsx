import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import AppChrome from "../components/AppChrome.tsx";
import { MISC_PRACTICE_ITEMS } from "./miscPractices.ts";
import { hrefs, renderHtml } from "./macro/renderHarness.ts";

describe("AppChrome header nav", () => {
  const html = renderHtml(
    <MemoryRouter initialEntries={["/playbooks"]}>
      <AppChrome>
        <p>body</p>
      </AppChrome>
    </MemoryRouter>,
  );
  const nav = html.slice(html.indexOf('data-testid="app-nav"'), html.indexOf("</nav>"));
  const links = hrefs(nav);

  it("follows the Learn page through Practice, then Deep Study and Other factors", () => {
    const at = (href: string) => links.indexOf(href);
    assert.ok(at("/") < at("/map"));
    assert.ok(at("/map") < at("/training"));
    assert.ok(at("/training") < at("/academy"));
    assert.ok(at("/academy") < at("/training#quiz"));
    assert.ok(at("/training#quiz") < at("/archive"));
    assert.ok(at("/archive") < at("/training#practice"));
    assert.ok(at("/training#practice") < at("/cases"));
    assert.deepEqual(links.slice(at("/cases"), at("/cases") + 3), ["/cases", "/coach", "/playbooks"]);
    assert.ok(at("/playbooks") < at("/paper"));
    assert.ok(at("/paper") < at("/paper/challenges"));
    assert.ok(at("/paper/challenges") < at("/training#financials"));
    assert.ok(at("/training#financials") < at("/training#macro"));
    assert.ok(at("/training#macro") < at("/market"));
    assert.ok(at("/market") < at("/training#buy-or-sell"));
  });

  it("includes map destinations that are not their own top-level names", () => {
    for (const href of ["/paper", "/paper/challenges", "/academy/options", "/archive", "/macro", "/macro/play", "/practice/statements", "/practice/read-the-print", "/practice/mark-the-band"]) {
      assert.ok(links.includes(href), href);
    }
    for (const item of MISC_PRACTICE_ITEMS) assert.ok(links.includes(item.to), item.title);
  });

  it("keeps those links under the mounted path", () => {
    const mounted = "/weng/trainer/stocks-trainer/dist";
    const underBase = renderHtml(
      <MemoryRouter basename={mounted} initialEntries={[`${mounted}/playbooks`]}>
        <AppChrome>
          <p>body</p>
        </AppChrome>
      </MemoryRouter>,
    );
    const mountedNav = underBase.slice(underBase.indexOf('data-testid="app-nav"'), underBase.indexOf("</nav>"));
    for (const href of ["/playbooks", "/training#quiz", "/archive", "/paper"]) {
      assert.ok(mountedNav.includes(`href="${mounted}${href}"`), href);
    }
    assert.doesNotMatch(mountedNav, /href="\/training#/);
  });

  it("puts Map in the Dashboard menu and names Learn as ToC", () => {
    assert.match(nav, />Dashboard</);
    assert.match(nav, />Quiz</);
    assert.match(nav, />Library</);
    assert.match(nav, />Quick Decisions</);
    assert.ok(links.includes("/map"));
    assert.ok(html.indexOf('data-testid="app-nav"') < html.indexOf('href="/map"'));
  });

  it("gives the links a wrapping full-width row below md, so the menu stays on a phone screen", () => {
    const navTag = html.match(/<nav[^>]*data-testid="app-nav"[^>]*>/)![0];
    assert.match(navTag, /\bw-full\b/);
    assert.match(navTag, /\bmd:w-auto\b/);
    assert.match(navTag, /\bmd:flex-nowrap\b/);
    assert.match(html, /flex-wrap md:flex-nowrap/);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import AppChrome from "../components/AppChrome.tsx";
import { MISC_PRACTICE_ITEMS } from "./miscPractices.ts";
import { HEADER_NAV, PRACTICE_FAMILIES } from "./appNav.ts";
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
  const between = (from: string, to: string) => nav.slice(nav.indexOf(`data-testid="${from}"`), nav.indexOf(`data-testid="${to}"`));

  it("shows six top-level destinations in order: Home, Learn, Practice, Trade, Map, Browse everything", () => {
    assert.deepEqual(HEADER_NAV.map((i) => i.label), ["Home", "Learn", "Practice", "Trade", "Map", "Browse everything"]);
    const at = (href: string) => links.indexOf(href);
    assert.equal(links[0], "/");
    assert.ok(at("/academy") < at("/training#practice"));
    assert.ok(at("/training#practice") < at("/paper"));
    assert.ok(at("/paper") < at("/map"));
    assert.ok(at("/map") < links.lastIndexOf("/browse"), "the Browse everything link follows Map");
    assert.match(nav, /data-testid="nav-browse"/);
    assert.match(nav, /data-testid="track-chip"/);
  });

  it("keeps every old destination reachable from the header menus", () => {
    for (const href of ["/training", "/training#patterns", "/training#concepts", "/practice/candle-basics", "/archive", "/academy/options", "/tools", "/macro", "/macro/play", "/practice/statements", "/practice/read-the-print", "/practice/mark-the-band", "/cases", "/coach", "/playbooks", "/paper", "/paper/desk", "/paper/challenges", "/market", "/training#buy-or-sell", "/training#financials", "/training#macro"]) {
      assert.ok(links.includes(href), href);
    }
    for (const item of MISC_PRACTICE_ITEMS) assert.ok(links.includes(item.to), item.title);
  });

  it("groups Practice into labelled families and ends every menu with Browse everything", () => {
    const practice = between("practice-menu", "trade-menu");
    for (const f of PRACTICE_FAMILIES) assert.ok(practice.includes(`aria-label="${f.title}"`), f.title);
    assert.ok(hrefs(practice).includes("/practice/opening-range"));
    for (const id of ["learn-menu", "practice-menu", "trade-menu"]) {
      const m = nav.slice(nav.indexOf(`data-testid="${id}"`));
      const items = hrefs(m.slice(0, m.indexOf("Browse everything") + 1));
      assert.equal(items[items.length - 1], "/browse", id);
    }
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
    for (const href of ["/playbooks", "/training#patterns", "/archive", "/paper", "/practice/candle-basics", "/browse", "/map"]) {
      assert.ok(mountedNav.includes(`href="${mounted}${href}"`), href);
    }
    assert.doesNotMatch(mountedNav, /href="\/training#/);
  });

  it("names the menu items with their icons", () => {
    assert.match(nav, />school<\/span>Academy lessons/);
    assert.match(nav, />toc<\/span>Table of Contents/);
    assert.match(nav, />menu_book<\/span>Library and glossary/);
    assert.match(nav, />cases<\/span>Cases/);
    assert.match(nav, />psychology<\/span>Coach/);
    assert.match(nav, />account_balance_wallet<\/span>Paper trading/);
    assert.match(nav, />emoji_events<\/span>Challenges/);
    assert.match(nav, />Pick a path</);
  });

  it("gives the links a wrapping full-width row below md, so the menu stays on a phone screen", () => {
    const navTag = html.match(/<nav[^>]*data-testid="app-nav"[^>]*>/)![0];
    assert.match(navTag, /\bw-full\b/);
    assert.match(navTag, /\bmd:w-auto\b/);
    assert.match(navTag, /\bmd:flex-nowrap\b/);
    assert.match(html, /flex-wrap md:flex-nowrap/);
    assert.match(nav, /max-sm:fixed max-sm:inset-x-2/);
  });
});

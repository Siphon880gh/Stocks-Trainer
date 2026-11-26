import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import AppChrome from "../components/AppChrome.tsx";
import { HEADER_NAV } from "./appNav.ts";
import { LEVEL_MENUS, MENU_IDS, NAV_LEVELS, TAB_LIMIT, itemsFor } from "./navLevels.ts";
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
  const panel = (menu: string) => {
    const from = nav.indexOf(`data-testid="${menu}-menu-panel"`);
    const to = nav.indexOf(`data-testid="${menu}-menu-browse"`, from);
    return nav.slice(from, to);
  };

  it("shows six top-level destinations in order: Home, Learn, Practice, Trade, Map, Browse everything", () => {
    assert.deepEqual(HEADER_NAV.map((i) => i.label), ["Home", "Learn", "Practice", "Trade", "Map", "Browse everything"]);
    const at = (href: string) => links.indexOf(href);
    assert.equal(links[0], "/");
    assert.ok(at("/academy") < at("/training#practice"));
    assert.ok(at("/training#practice") < at("/map"));
    assert.ok(at("/map") < links.lastIndexOf("/browse"), "the Browse everything link follows Map");
    assert.match(nav, /data-testid="nav-browse"/);
    assert.match(nav, /data-testid="track-chip"/);
  });

  it("gives each dropdown a tablist with Beginner, Intermediate and Advanced, Beginner selected without a track", () => {
    for (const m of MENU_IDS) {
      const p = panel(m);
      assert.match(p, /role="tablist"/, m);
      for (const l of NAV_LEVELS) {
        assert.match(p, new RegExp(`data-testid="navtab-${m}-${l.id}"`), `${m} ${l.id} tab`);
        assert.match(p, new RegExp(`role="tabpanel"[^>]*data-testid="navpanel-${m}-${l.id}"|data-testid="navpanel-${m}-${l.id}"[^>]*role="tabpanel"|id="[^"]*-${l.id}" role="tabpanel"`), `${m} ${l.id} panel`);
      }
      assert.doesNotMatch(p, new RegExp(`data-testid="navtab-${m}-path"`), "no For your path tab without a track");
      assert.match(p, new RegExp(`aria-selected="true"[^>]*data-testid="navtab-${m}-beginner"`), `${m}: Beginner selected`);
      assert.match(p, /aria-controls="[^"]+"/);
    }
  });

  it("lists the first items of every level in its tab, with a one-line description, and Browse everything last", () => {
    for (const m of MENU_IDS) {
      const p = panel(m);
      const ph = hrefs(p);
      for (const l of NAV_LEVELS) for (const item of itemsFor(m, l.id).slice(0, TAB_LIMIT)) {
        assert.ok(ph.includes(item.to), `${m}/${l.id}: ${item.to}`);
        assert.ok(p.includes(item.desc.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;")), `${m}: description for ${item.to}`);
      }
      const after = nav.slice(nav.indexOf(`data-testid="${m}-menu-browse"`) - 200);
      assert.equal(hrefs(after)[0], "/browse", `${m} ends with Browse everything`);
    }
    assert.ok(LEVEL_MENUS.practice.length > TAB_LIMIT);
    assert.match(panel("practice"), /data-testid="navtab-more-practice-intermediate"/, "long tabs offer Show all");
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

  it("gives the links a wrapping full-width row below md and panels that fit a phone", () => {
    const navTag = html.match(/<nav[^>]*data-testid="app-nav"[^>]*>/)![0];
    assert.match(navTag, /\bw-full\b/);
    assert.match(navTag, /\bmd:w-auto\b/);
    assert.match(navTag, /\bmd:flex-nowrap\b/);
    assert.match(html, /flex-wrap md:flex-nowrap/);
    assert.match(nav, /fixed top-full inset-x-2/);
    assert.match(nav, /overflow-x-auto/, "tabs scroll sideways on a phone");
    assert.match(nav, /z-index:200/, "dropdowns use the popover layer");
    assert.match(html, />Pick a path</);
  });
});

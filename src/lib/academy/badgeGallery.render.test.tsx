import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import BadgeGallery from "../../components/academy/BadgeGallery";
import { BADGES } from "./rewards/badges";
import { REWARDS_KEY, emptyRewards, memoryStorage } from "./storage";

test("badge gallery: every badge listed; earned ones first, newest first, with the date earned; locked ones say what unlocks them", () => {
  const st = memoryStorage({ [REWARDS_KEY]: JSON.stringify({ ...emptyRewards(), badges: { "first-unit": "2026-11-20T18:00:00Z", "streak-3": "2026-11-24T18:00:00Z" } }) });
  const html = renderToStaticMarkup(<BadgeGallery storage={st} now={new Date("2026-11-26T18:00:00Z")} />);
  assert.equal((html.match(/data-badge="/g) || []).length, BADGES.length);
  assert.ok(html.includes('id="badges"'));
  assert.match(html, /2 of \d+ earned/);
  assert.ok(html.indexOf('data-badge="streak-3"') < html.indexOf('data-badge="first-unit"'));
  assert.ok(html.includes('data-badge-earned="2026-11-20T18:00:00Z"'));
  assert.match(html, /Locked\. /);
  assert.match(html, /data-days-ago="6"/);
  // The days-ago tag sits at the end of the tile (right in LTR), after the text block, not under the date.
  assert.match(html, /<\/div><span class="ms-auto shrink-0[^"]*" data-days-ago="6">/);
});

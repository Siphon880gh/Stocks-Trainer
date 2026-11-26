import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { TRACK_KEY } from "./tracks";

const store = new Map<string, string>();
const localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
};
(globalThis as { localStorage?: unknown }).localStorage = localStorage;
(globalThis as { window?: unknown }).window = { localStorage };

async function home(): Promise<string> {
  const { default: Dashboard } = await import("../pages/Dashboard");
  return renderToStaticMarkup(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
}

const linkCount = (html: string) => (html.match(/<a /g) ?? []).length;

test("directional Home: first visit shows the path picker, not a wall of links", async () => {
  store.clear();
  const html = await home();
  assert.match(html, /data-testid="track-picker"/);
  assert.doesNotMatch(html, /data-testid="next-up"/);
  assert.match(html, /data-testid="track-option-everything"/);
  assert.match(html, /data-testid="home-browse"/);
  assert.ok(linkCount(html) < 40, `Home has ${linkCount(html)} links`);
});

test("directional Home: with a track, Next up shows at most three steps and Browse everything", async () => {
  store.clear();
  store.set(TRACK_KEY, JSON.stringify({ id: "charts-patterns", at: "2026-11-25T00:00:00.000Z" }));
  const html = await home();
  assert.doesNotMatch(html, /data-testid="track-picker"/);
  assert.match(html, /data-testid="next-up" data-track="charts-patterns"/);
  const steps = (html.match(/data-testid="next-up-step"/g) ?? []).length;
  assert.ok(steps >= 1 && steps <= 3, `${steps} next steps`);
  assert.match(html, /data-testid="next-up-browse"/);
  assert.match(html, /data-testid="home-milestones"/);
  assert.doesNotMatch(html, /data-testid="map-region"/, "the full map is no longer embedded on Home");
});

test("directional Home: with a picked path, Next up is the only filled action and the rest is folded", async () => {
  store.clear();
  const { pickTrack } = await import("../components/TrackPicker");
  pickTrack("new-to-stocks");
  const html = await home();
  const fold = html.match(/<details[^>]*data-testid="home-more"[^>]*>[\s\S]*?<\/details>/)?.[0];
  assert.ok(fold, "More for today fold is on Home");
  assert.doesNotMatch(fold!.slice(0, fold!.indexOf(">")), /\sopen/, "the fold starts closed");
  for (const id of ["today-card", "placement-card", "home-map-link"]) assert.match(fold!, new RegExp(`data-testid="${id}"`), `${id} sits in the fold`);
  const outside = html.replace(fold!, "");
  const filled = (outside.match(/class="[^"]*\bbg-primary text-white\b[^"]*"/g) ?? []).length;
  assert.equal(filled, 1, `${filled} filled primary actions outside the fold`);
});

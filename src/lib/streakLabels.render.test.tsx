import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import RewardsPanel from "../components/academy/RewardsPanel";
import TodayCard from "../components/academy/TodayCard";
import { memoryStorage } from "./academy/storage";
import { ANSWER_STREAK_LABEL, ANSWER_STREAK_TIP, DAY_STREAK_LABEL, DAY_STREAK_TIP } from "./streakLabels";

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
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

test("Academy shows 'Day streak' with its tooltip (rewards panel and Today card)", () => {
  const st = memoryStorage();
  const panel = renderToStaticMarkup(<RewardsPanel storage={st} />);
  assert.match(panel, new RegExp(`${DAY_STREAK_LABEL} 0 days`));
  assert.ok(panel.includes(`title="${esc(DAY_STREAK_TIP)}"`));
  const today = renderToStaticMarkup(
    <MemoryRouter>
      <TodayCard storage={st} />
    </MemoryRouter>,
  );
  assert.match(today, new RegExp(`${DAY_STREAK_LABEL} 0`));
  assert.ok(!/>Streak /.test(today + panel), "no bare 'Streak' label left");
});

test("Home and Training show 'Answer streak' (correct answers in a row) with its tooltip", async () => {
  const { default: Dashboard } = await import("../pages/Dashboard");
  const { default: Training } = await import("../pages/Training");
  for (const Page of [Dashboard, Training]) {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Page />
      </MemoryRouter>,
    );
    assert.ok(html.includes('data-testid="answer-streak"'), Page.name);
    assert.ok(html.includes(ANSWER_STREAK_LABEL), Page.name);
    assert.ok(html.includes(`title="${esc(ANSWER_STREAK_TIP)}"`), Page.name);
  }
});

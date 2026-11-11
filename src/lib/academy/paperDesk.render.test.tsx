import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryRouter } from "react-router-dom";
import PaperDesk from "../../pages/academy/PaperDesk";
import { memoryStorage } from "./storage";
import { DESK_KEY } from "./paper/desk/storage";
import { newDeskLog, deskPlace, deskStep } from "./paper/desk/session";
import { getDeskScenario } from "./paper/desk/scenarios";
import { SIMULATED_BANNER } from "./copy";
import { bannedIn } from "./content/banned";
import { hrefs, renderHtml, renderText } from "./renderHarness";
import { routeExists } from "./refs";

const page = (storage: ReturnType<typeof memoryStorage>) => (
  <MemoryRouter>
    <PaperDesk storage={storage} />
  </MemoryRouter>
);
const withLog = (log: ReturnType<typeof newDeskLog>) => memoryStorage({ [DESK_KEY]: JSON.stringify({ session: log, completed: {}, schemaVersion: 1 }) });

test("fresh desk shows the setup with both scenarios and the SIMULATED banner; rendering never writes", () => {
  const mem = memoryStorage();
  const html = renderHtml(page(mem));
  assert.ok(html.includes('data-testid="desk-setup"'));
  assert.ok(html.includes('data-scenario="big-tech-2024"') && html.includes('data-scenario="sim-earnings-week"'));
  assert.ok(renderText(page(mem)).includes(SIMULATED_BANNER));
  assert.equal(mem.writes.length, 0);
  for (const h of hrefs(html)) assert.ok(routeExists(h), h);
});

test("historical session: clock shows the replay date, news and statements stop at the clock, fills appear on the chart", () => {
  const hist = getDeskScenario("big-tech-2024")!;
  let log = newDeskLog("big-tech-2024", 10_000_000);
  log = deskPlace(log, { symbol: "AAPL", side: "buy", type: "market", qty: 10, tif: "day" }).log;
  log = deskStep(log, 2);
  const html = renderHtml(page(withLog(log)));
  const text = renderText(page(withLog(log)));
  assert.ok(html.includes('data-testid="desk-session"'));
  assert.ok(html.includes('data-executions="1"'));
  assert.ok(text.includes("HISTORICAL replay"));
  assert.ok(text.includes("Jan 19, 2024"), hist.labels[log.bar]);
  // Microsoft's Midnight Blizzard 8-K (2024-01-19) is out on this day; Apple's 2024-02-01 results are not.
  assert.ok(html.includes('data-news-id="MSFT-2024-01-19-company"'));
  assert.ok(!html.includes("AAPL-2024-02-01-earnings"));
  assert.ok(!text.includes("Apple reports first quarter results"));
  assert.deepEqual(bannedIn(text), []);
});

test("simulated session: invented items carry the SIMULATED tag", () => {
  let log = newDeskLog("sim-earnings-week", 1_000_000);
  log = deskStep(log, 14);
  const text = renderText(page(withLog(log)));
  assert.ok(text.includes("Printwell Devices sets its quarterly report"));
  assert.ok(!text.includes("quarterly sales jump"));
  assert.ok((text.match(/SIMULATED/g) ?? []).length >= 3);
});

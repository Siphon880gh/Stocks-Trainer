import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Paper from "../../pages/academy/Paper";
import PaperChallenges from "../../pages/academy/PaperChallenges";
import OrderTicket from "../../components/academy/paper/OrderTicket";
import { AccountSummary, OpenOrders, OrderHistory, PositionsTable } from "../../components/academy/paper/PaperPanels";
import RewardsPanel from "../../components/academy/RewardsPanel";
import { PAPER_KEY, REWARDS_KEY, emptyPaper, emptyRewards, memoryStorage } from "./storage";
import { START_BAR, newSessionLog, replay, sessionPlace, sessionStep } from "./paper/session";
import { getTape } from "./paper/tapes";
import { createAccount } from "./paper/account";
import { performance, symbolPnl } from "./paper/stats";
import { money, signedMoney } from "./paper/describe";
import { SIMULATED_BANNER, POINTS_DISCLAIMER } from "./copy";
import { BADGES } from "./rewards/badges";
import { CHALLENGES, challengeOfTheWeek } from "./challenges";
import { hrefs, renderHtml, renderText } from "./renderHarness";
import { routeExists } from "./refs";

const tape = getTape("trend-up")!;
function fixtureLog() {
  let log = newSessionLog("trend-up", 1_000_000, START_BAR);
  log = sessionPlace(log, { symbol: tape.symbol, side: "buy", type: "market", qty: 20, tif: "day" }).log;
  log = sessionStep(log, 2);
  log = sessionPlace(log, { symbol: tape.symbol, side: "sell", type: "trailing-stop", trailPercent: 5, qty: 20, tif: "gtc" }).log;
  log = sessionPlace(log, { symbol: tape.symbol, side: "buy", type: "limit", limitPrice: 0, qty: 1, tif: "gtc" }).log; // rejected
  log = sessionStep(log, 3);
  return log;
}
const withSession = (log = fixtureLog()) => memoryStorage({ [PAPER_KEY]: JSON.stringify({ ...emptyPaper(), session: log }) });
const page = (storage: ReturnType<typeof memoryStorage>) => (
  <MemoryRouter>
    <Paper storage={storage} />
  </MemoryRouter>
);

test("no future-bar leak: only bars 0..current are on the chart, and the page restores the stored session", () => {
  const log = fixtureLog();
  const html = renderHtml(page(withSession(log)));
  assert.match(html, new RegExp(`data-bar="${log.bar}"`));
  assert.ok(renderText(page(withSession(log))).includes(`Bar ${log.bar + 1} of ${tape.bars.length}`));
  const labels = [...html.matchAll(/>D(\d+)</g)].map((m) => Number(m[1]));
  assert.ok(labels.length > 0, "axis labels rendered");
  assert.ok(Math.max(...labels) <= log.bar + 1, `no label past D${log.bar + 1}`);
  const futureHigh = Math.max(...tape.bars.slice(log.bar + 1).map((b) => b.high));
  assert.ok(!html.includes((futureHigh / 100).toFixed(2)), "future high not printed");
});

test("simulated banner on the setup and the session; a fresh page shows setup; rendering never writes", () => {
  const fresh = memoryStorage();
  const t = renderText(page(fresh));
  assert.ok(t.includes(SIMULATED_BANNER));
  assert.ok(renderHtml(page(fresh)).includes('data-testid="paper-setup"'));
  assert.ok(renderText(page(withSession())).includes(SIMULATED_BANNER));
  assert.deepEqual(fresh.writes, []);
  for (const h of hrefs(renderHtml(page(withSession())))) assert.ok(routeExists(h), h);
});

test("panels render exactly the stats.ts numbers for a fixture session; history shows the rejection reason", () => {
  const s = replay(fixtureLog());
  const p = performance(s);
  const html = renderHtml(<AccountSummary state={s} />);
  assert.ok(html.includes(money(p.equity)) && html.includes(money(p.cash)) && html.includes(signedMoney(p.total)));
  const pos = renderHtml(<PositionsTable state={s} />);
  assert.ok(pos.includes(`data-unrealized="${symbolPnl(s, tape.symbol).unrealized}"`));
  const open = renderText(<OpenOrders state={s} />);
  assert.match(open, /Trailing stop 5% trail · GTC · stop now \$/);
  const hist = renderHtml(<OrderHistory state={s} />);
  assert.match(hist, /data-status="rejected"/);
  assert.match(hist, /data-status="filled"/);
  assert.ok(s.orders.find((o) => o.status === "rejected")!.reason!.length > 10);
});

test("ticket: invalid order disables submit and shows the error; valid order shows a generated preview", () => {
  const s = createAccount(1_000_000, { [tape.symbol]: 5000 });
  const bad = renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} initial={{ qty: "0" }} />);
  assert.match(bad, /data-testid="ticket-submit"[^>]*disabled|disabled[^>]*data-testid="ticket-submit"/);
  assert.ok(bad.includes('data-code="QTY_NOT_POSITIVE"'));
  const ok = renderText(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} initial={{ type: "limit", limit: "49" }} />);
  assert.match(ok, /If the price trades at or below \$49\.00, buy 10 shares/);
  assert.match(ok, /SIMULATED/);
  const sellNoShares = renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} initial={{ side: "sell" }} />);
  assert.ok(sellNoShares.includes('data-code="SHORT_NOT_ALLOWED"'));
});

test("challenges: list shows all and the week's pick; play view shows rules and the banner", () => {
  const now = new Date("2026-10-21T19:00:00Z");
  const list = renderHtml(
    <MemoryRouter initialEntries={["/paper/challenges"]}>
      <Routes>
        <Route path="/paper/challenges" element={<PaperChallenges storage={memoryStorage()} now={now} />} />
      </Routes>
    </MemoryRouter>,
  );
  for (const c of CHALLENGES) assert.ok(list.includes(`data-challenge="${c.id}"`), c.id);
  assert.ok(list.includes(`data-testid="challenge-of-the-week" data-challenge="${challengeOfTheWeek(now).id}"`));
  const c = CHALLENGES[0]!;
  const play = renderText(
    <MemoryRouter initialEntries={[`/paper/challenges/${c.id}`]}>
      <Routes>
        <Route path="/paper/challenges/:challengeId" element={<PaperChallenges storage={memoryStorage()} now={now} />} />
      </Routes>
    </MemoryRouter>,
  );
  assert.ok(play.includes(c.title) && play.includes("Rules (60 points)") && play.includes(SIMULATED_BANNER));
});

test("rewards panel: virtual-only disclaimer; locked badges show the hint, never predicate code", () => {
  const store = memoryStorage({ [REWARDS_KEY]: JSON.stringify({ ...emptyRewards(), badges: { "first-unit": "2026-10-21T00:00:00Z" } }) });
  const html = renderHtml(<MemoryRouter><RewardsPanel storage={store} /></MemoryRouter>);
  const text = renderText(<MemoryRouter><RewardsPanel storage={store} /></MemoryRouter>);
  assert.ok(text.includes(POINTS_DISCLAIMER));
  assert.match(html, /data-badge="first-unit" data-earned="true"/);
  for (const b of BADGES.filter((x) => x.id !== "first-unit")) assert.ok(text.includes(b.hint), b.id);
  assert.doesNotMatch(text, /=>|earned\(|\.length\s*>=/);
});

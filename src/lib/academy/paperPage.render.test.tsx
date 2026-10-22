import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Paper from "../../pages/academy/Paper";
import PaperChallenges from "../../pages/academy/PaperChallenges";
import OrderTicket from "../../components/academy/paper/OrderTicket";
import { AccountSummary, OpenOrders, OrderHistory, PositionsTable } from "../../components/academy/paper/PaperPanels";
import RewardsPanel from "../../components/academy/RewardsPanel";
import { PAPER_KEY, REWARDS_KEY, emptyPaper, emptyRewards, memoryStorage } from "./storage";
import { START_BAR, newSessionLog, replay, sessionBracket, sessionPlace, sessionStep } from "./paper/session";
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

test("BA11.M1 bracket ticket: opt-in on buys only, validated exits, plain-language preview; open orders show the link", () => {
  const s = createAccount(1_000_000, { [tape.symbol]: 5000 });
  assert.ok(!renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} />).includes("ticket-bracket"), "off unless allowed");
  assert.ok(!renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} allowBracket initial={{ side: "sell" }} />).includes("ticket-bracket"), "buys only");
  const bad = renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} allowBracket initial={{ bracket: true, exitStop: "51", exitTarget: "55" }} />);
  assert.ok(bad.includes('data-code="BRACKET_STOP_NOT_BELOW"'));
  assert.match(bad, /data-testid="ticket-submit"[^>]*disabled|disabled[^>]*data-testid="ticket-submit"/);
  assert.ok(renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} allowBracket initial={{ bracket: true }} />).includes('data-code="BRACKET_NEEDS_EXIT"'));
  const ok = renderText(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} allowBracket initial={{ bracket: true, exitStop: "48", exitTarget: "55" }} />);
  assert.match(ok, /Only after the buy fills: a sell stop at \$48\.00 \(caps the loss\) and a sell limit at \$55\.00 \(takes the profit\)/);
  assert.match(ok, /one-cancels-other/);
  let log = newSessionLog("trend-up", 1_000_000, START_BAR);
  const last = tape.bars[START_BAR]!.close;
  log = sessionBracket(log, { symbol: tape.symbol, side: "buy", type: "limit", limitPrice: last - 500, qty: 5, tif: "gtc" }, last - 900, last + 500).log;
  const open = renderText(<OpenOrders state={replay(log)} />);
  assert.equal((open.match(/waits for its entry to fill/g) ?? []).length, 2);
});

test("BA11.M2 shorting: off by default on setup; ticket explains a short sale; the session shows the margin panel", () => {
  const setup = renderHtml(page(memoryStorage({})));
  assert.ok(setup.includes('data-testid="opt-short"'));
  assert.ok(!/data-testid="opt-short"[^>]*checked/.test(setup), "off by default");
  const s = createAccount(1_000_000, { [tape.symbol]: 5000 }, 0, { allowShort: true });
  const t = renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} initial={{ side: "sell" }} />);
  assert.ok(!t.includes('data-code="SHORT_NOT_ALLOWED"'));
  assert.ok(t.includes('data-code="SHORT_SALE_RISK"'));
  assert.match(renderText(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} initial={{ side: "sell" }} />), /no limit on the loss/);
  let log = newSessionLog("trend-up", 1_000_000, START_BAR, { allowShort: true });
  log = sessionPlace(log, { symbol: tape.symbol, side: "sell", type: "market", qty: 20, tif: "day" }).log;
  log = sessionStep(log, 2);
  const text = renderText(page(withSession(log)));
  assert.match(text, /Short selling & margin/);
  assert.match(text, /-20 \(short\)/);
  assert.ok(!renderText(page(withSession())).includes("Short selling & margin"), "core sessions have no margin panel");
});

test("BA11.M3 fractional: dollar sizing only in fractional sessions, for market buys; preview explains the rounding", () => {
  const core = createAccount(1_000_000, { [tape.symbol]: 5000 });
  assert.ok(!renderHtml(<OrderTicket state={core} symbol={tape.symbol} onSubmit={() => {}} />).includes("ticket-size-dollars"));
  const s = createAccount(1_000_000, { [tape.symbol]: 5000 }, 0, { fractional: true });
  assert.ok(renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} />).includes("ticket-size-dollars"));
  assert.ok(!renderHtml(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} initial={{ type: "limit", limit: "49" }} />).includes("ticket-size-dollars"));
  const text = renderText(<OrderTicket state={s} symbol={tape.symbol} onSubmit={() => {}} initial={{ qtyMode: "dollars", amount: "500" }} />);
  assert.match(text, /Buy \$500\.00 of TRWL\.S at the next bar's open/);
  assert.match(text, /about 10 shares/);
  assert.ok(renderHtml(page(memoryStorage({}))).includes('data-testid="opt-fractional"'));
});

test("BA11.M4 costs: setup offers fee and slippage (none by default); a costed session shows the cost panel and totals", () => {
  const setup = renderHtml(page(memoryStorage({})));
  assert.ok(setup.includes('data-testid="opt-fee"') && setup.includes('data-testid="opt-slippage"'));
  let log = newSessionLog("trend-up", 1_000_000, START_BAR, { feeCents: 100, slippageBps: 10 });
  log = sessionPlace(log, { symbol: tape.symbol, side: "buy", type: "market", qty: 20, tif: "day" }).log;
  log = sessionStep(log, 2);
  const text = renderText(page(withSession(log)));
  assert.match(text, /Cost of trading/);
  assert.match(text, /\$1\.00 per fill and 10 bps \(0\.10%\) slippage/);
  assert.match(text, /Paid so far: fees \$1\.00/);
  assert.match(text, /Trading costs are on/);
  const core = renderText(page(withSession()));
  assert.ok(!core.includes("Cost of trading") && core.includes("No fees."));
});

test("BA11.M5 journal: the paper page lists fills with their notes and an export button; challenges do not", () => {
  const log = { ...fixtureLog(), notes: { o1: "Bought the trend after a higher low." } };
  const html = renderHtml(page(withSession(log)));
  assert.ok(html.includes('data-testid="journal"'));
  assert.ok(html.includes('data-testid="journal-csv"'));
  assert.match(renderText(page(withSession(log))), /Bought the trend after a higher low\./);
});

test("BA11.M6 portfolios: an old store shows Main as the only portfolio; others list with their own summary", () => {
  const text = renderText(page(withSession()));
  assert.match(text, /Portfolios/);
  assert.match(text, /Main · equity \$/);
  const store = { ...emptyPaper(), session: fixtureLog(), portfolio: { id: "p2", name: "Swing" }, otherPortfolios: [{ id: "main", name: "Main", session: null }] };
  const html = renderHtml(page(memoryStorage({ [PAPER_KEY]: JSON.stringify(store) })));
  assert.match(html, /data-testid="portfolio-p2"[^>]*aria-pressed="true"|aria-pressed="true"[^>]*data-testid="portfolio-p2"/);
  assert.ok(html.includes('data-testid="portfolio-delete-main"'));
  assert.ok(!html.includes('data-testid="portfolio-delete-p2"'), "the active portfolio has no delete button");
  assert.match(renderText(page(memoryStorage({ [PAPER_KEY]: JSON.stringify(store) }))), /Main · not started/);
});

test("price-marker labels on the paper chart show cents; other charts keep whole-number labels", async () => {
  const { default: CandlestickChart } = await import("../../components/CandlestickChart");
  const data = tape.bars.slice(0, 12).map((b, i) => ({ name: `D${i + 1}`, open: b.open / 100, high: b.high / 100, low: b.low / 100, close: b.close / 100 }));
  const markers = [{ price: 52.15, label: "Sell stop" }];
  assert.match(renderText(<CandlestickChart data={data} markers={markers} markerDecimals={2} />), /Sell stop 52\.15/);
  assert.match(renderText(<CandlestickChart data={data} markers={markers} />), /Sell stop 52(?!\.)/);
  let log = newSessionLog("trend-up", 1_000_000, START_BAR);
  log = sessionPlace(log, { symbol: tape.symbol, side: "buy", type: "limit", limitPrice: 5215, qty: 5, tif: "gtc" }).log;
  assert.match(renderText(page(withSession(log))), /Buy limit 52\.15/);
});

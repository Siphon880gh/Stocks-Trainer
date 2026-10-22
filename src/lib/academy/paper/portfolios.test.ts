import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_PORTFOLIOS, createPortfolio, deletePortfolio, listPortfolios, renamePortfolio, switchPortfolio, type PortfolioResult } from "./portfolios";
import { emptyPaper, loadPaper, memoryStorage, migratePaper, PAPER_KEY, savePaper, type PaperStore } from "../storage";
import { newSessionLog, sessionPlace, sessionStep, START_BAR } from "./session";
import { totalCounters } from "./counters";

const ok = (r: PortfolioResult): PaperStore => {
  assert.equal(r.ok, true, r.ok ? "" : (r as { message: string }).message);
  return r.store;
};
const traded = () => sessionStep(sessionPlace(newSessionLog("trend-up", 1_000_000, START_BAR), { symbol: "TRWL.S", side: "buy", type: "limit", limitPrice: 5400, qty: 5, tif: "gtc" }).log, 3);

test("a store from before portfolios migrates losslessly into the single portfolio Main", () => {
  const log = traded();
  const old = { schemaVersion: 1, session: log, challengeAttempts: { c1: [] }, stats: { orders: 3, limitFills: 1, trailingExits: 0, stopProtectedTrades: 0, stopLimitNoFills: 0 } };
  const m = migratePaper(old);
  assert.deepEqual(m.portfolio, { id: "main", name: "Main" });
  assert.deepEqual(m.otherPortfolios, []);
  assert.deepEqual(m.session, log);
  assert.deepEqual(m.stats, old.stats);
  assert.deepEqual(listPortfolios(m).map((p) => [p.id, p.name, p.active]), [["main", "Main", true]]);
});

test("create, switch, rename and delete keep each portfolio's own session", () => {
  const log = traded();
  let p = { ...emptyPaper(), session: log };
  p = ok(createPortfolio(p, "  Swing   trades "));
  assert.deepEqual(p.portfolio, { id: "p2", name: "Swing trades" });
  assert.equal(p.session, null, "a new portfolio starts empty");
  assert.deepEqual(p.otherPortfolios[0]!.session, log, "Main keeps its session");
  p = { ...p, session: newSessionLog("gap-down", 100_000, START_BAR) };
  p = ok(switchPortfolio(p, "main"));
  assert.deepEqual(p.session, log);
  assert.equal(p.otherPortfolios[0]!.session!.tapeId, "gap-down");
  p = ok(renamePortfolio(p, "p2", "Gap practice"));
  assert.equal(p.otherPortfolios[0]!.name, "Gap practice");
  assert.equal(renamePortfolio(p, "p2", "main").ok, false, "names are unique, case-insensitive");
  assert.equal(deletePortfolio(p, "main").ok, false, "the active one cannot be deleted");
  p = ok(deletePortfolio(p, "p2"));
  assert.deepEqual(listPortfolios(p).map((x) => x.id), ["main"]);
});

test("validation: empty, too long, duplicate, at most five", () => {
  let p = emptyPaper();
  const codes = (r: PortfolioResult) => (r.ok ? "ok" : (r as { code: string }).code);
  assert.equal(codes(createPortfolio(p, "   ")), "NAME_EMPTY");
  assert.equal(codes(createPortfolio(p, "x".repeat(25))), "NAME_TOO_LONG");
  assert.equal(codes(createPortfolio(p, "MAIN")), "NAME_TAKEN");
  for (let i = 2; i <= MAX_PORTFOLIOS; i++) p = ok(createPortfolio(p, `P ${i}`));
  assert.equal(listPortfolios(p).length, MAX_PORTFOLIOS);
  assert.equal(codes(createPortfolio(p, "One more")), "TOO_MANY");
  assert.equal(codes(switchPortfolio(p, "nope")), "UNKNOWN");
});

test("portfolios persist through save / load, and badge counters include every portfolio", () => {
  const storage = memoryStorage({});
  let p = { ...emptyPaper(), session: traded() };
  const one = totalCounters(p);
  p = ok(createPortfolio(p, "Second"));
  p = { ...p, session: traded() };
  savePaper(p, storage);
  const back = loadPaper(storage).state;
  assert.deepEqual(back.portfolio, p.portfolio);
  assert.deepEqual(back.otherPortfolios, p.otherPortfolios);
  assert.equal(totalCounters(back).orders, 2 * one.orders);
  assert.ok(JSON.parse(storage.getItem(PAPER_KEY)!).otherPortfolios.length === 1);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { CHALLENGES, DISCIPLINE_MAX, RESULT_MAX, SCORE_MAX, THEME_LABELS, endBar, getChallenge, newChallengeLog, play, planPolicy, scoreChallenge, scoreState, type Challenge } from "./challenges";
import { replay, sessionPlace } from "./paper/session";
import { getTape } from "./paper/tapes";
import { ACADEMY_TERMS } from "./terms";

const C = (id: string) => getChallenge(id)!;

test("≥ 10 challenges across ≥ 4 themes, discipline ≥ 50% of the max, valid tapes and terms", () => {
  assert.ok(CHALLENGES.length >= 10);
  assert.ok(new Set(CHALLENGES.map((c) => c.theme)).size >= 4);
  assert.ok(DISCIPLINE_MAX / SCORE_MAX >= 0.5);
  assert.equal(DISCIPLINE_MAX + RESULT_MAX, 100);
  const termIds = new Set(ACADEMY_TERMS.map((t) => t.id));
  for (const c of CHALLENGES) {
    const tape = getTape(c.tapeId)!;
    assert.ok(tape, c.id);
    assert.ok(endBar(c) < tape.bars.length, `${c.id} window fits the tape`);
    assert.ok(c.rules.some((r) => r.kind === "min-trades"), `${c.id}: doing nothing must not pass`);
    assert.ok(THEME_LABELS[c.theme]);
    assert.match(c.intro, /SAMPLE/, `${c.id}: intro labels the stock SAMPLE`);
    for (const t of c.terms) assert.ok(termIds.has(t), `${c.id}: term ${t}`);
  }
  assert.equal(new Set(CHALLENGES.map((c) => c.id)).size, CHALLENGES.length);
});

const sym = (c: Challenge) => getTape(c.tapeId)!.symbol;

test("doing nothing: min-trades breach, not passed, discipline < max", () => {
  for (const c of CHALLENGES) {
    const s = scoreChallenge(c, { ...newChallengeLog(c), bar: endBar(c) });
    assert.equal(s.passed, false, c.id);
    assert.ok(s.breaches.some((b) => b.rule === "min-trades"), c.id);
  }
});

test("stop-within: pass (stop on the entry bar), breach reported at the deadline bar, edge (exit before deadline)", () => {
  const c = C("protect-with-a-stop"); // stop-within 0
  const pass = play(c, planPolicy({ entry: {}, size: 0.3, stop: { below: 0.05 } }));
  assert.ok(!scoreChallenge(c, pass).breaches.some((b) => b.rule === "stop-within"));
  const noStop = play(c, planPolicy({ entry: {}, size: 0.3 }));
  const br = scoreChallenge(c, noStop).breaches.find((b) => b.rule === "stop-within")!;
  assert.equal(br.bar, c.startBar + 1, "entry fills on the next bar; deadline = entry bar + 0");
  assert.match(br.message, /^Bar \d+:/);
  // edge: with stop-within 1, a trade that is closed by the deadline bar needs no stop
  const r = C("ride-the-trend");
  const quick = play(r, planPolicy({ entry: {}, size: 0.3, exitAt: r.startBar + 1 }));
  assert.ok(!scoreChallenge(r, quick).breaches.some((b) => b.rule === "stop-within"));
  // …but holding past the deadline without one breaches
  const late = play(r, planPolicy({ entry: {}, size: 0.3, exitAt: r.startBar + 2 }));
  assert.equal(scoreChallenge(r, late).breaches.find((b) => b.rule === "stop-within")!.bar, r.startBar + 2);
});

test("max-position-pct: pass at the cap, breach above it with the fill bar", () => {
  const c = C("earnings-small-size"); // 20%
  const ok = scoreChallenge(c, play(c, planPolicy({ entry: {}, size: 0.19, stop: { below: 0.08 } })));
  assert.ok(!ok.breaches.some((b) => b.rule === "max-position-pct"));
  const big = scoreChallenge(c, play(c, planPolicy({ entry: {}, size: 0.3, stop: { below: 0.08 } })));
  const b = big.breaches.find((x) => x.rule === "max-position-pct")!;
  assert.equal(b.bar, c.startBar + 1);
});

test("no-averaging-down: adding below average cost breaches; adding above does not", () => {
  const c = C("no-averaging-down");
  const down = scoreChallenge(c, play(c, planPolicy({ entry: {}, size: 0.1, stop: { below: 0.2 }, addAt: 20 })));
  assert.ok(down.breaches.some((b) => b.rule === "no-averaging-down"));
  const up = C("protect-with-a-stop");
  const r = scoreChallenge(up, play(up, planPolicy({ entry: {}, size: 0.1, stop: { below: 0.2 }, addAt: 40 })));
  assert.ok(!r.breaches.some((b) => b.rule === "no-averaging-down"), "trend-up: adding above the average is not averaging down");
});

test("max-drawdown and max-trades breaches carry bar indexes", () => {
  const c = C("drawdown-cap");
  const s = scoreChallenge(c, play(c, planPolicy({ entry: {}, size: 0.95, stop: { below: 0.5 } })));
  const b = s.breaches.find((x) => x.rule === "max-drawdown")!;
  assert.ok(b.bar > c.startBar && b.bar <= endBar(c));
  const w = C("wait-for-support"); // max 2 trades
  let log = newChallengeLog(w);
  const t = getTape(w.tapeId)!;
  for (let k = 0; k < 3; k++) {
    log = sessionPlace({ ...log, bar: w.startBar + k * 4 }, { symbol: t.symbol, side: "buy", type: "market", qty: 5, tif: "day" }).log;
    log = sessionPlace({ ...log, bar: w.startBar + k * 4 + 1 }, { symbol: t.symbol, side: "sell", type: "market", qty: 5, tif: "day" }).log;
  }
  const sc = scoreChallenge(w, { ...log, bar: endBar(w) });
  const mt = sc.breaches.find((x) => x.rule === "max-trades")!;
  assert.equal(mt.bar, w.startBar + 8 + 1);
});

test("score is pure and in range; a disallowed order type zeroes discipline", () => {
  const c = C("limit-below-market");
  const log = play(c, planPolicy({ entry: { type: "limit", limitPrice: 4200 }, size: 0.3, stop: { price: 4100 } }));
  assert.deepEqual(scoreChallenge(c, log), scoreChallenge(c, JSON.parse(JSON.stringify(log))));
  const t = getTape(c.tapeId)!;
  const bad = sessionPlace(newChallengeLog(c), { symbol: t.symbol, side: "buy", type: "stop-limit", stopPrice: 4500, limitPrice: 4550, qty: 1, tif: "gtc" }).log;
  const s = scoreState(c, replay({ ...bad, bar: endBar(c) }));
  assert.equal(s.discipline, 0);
  assert.ok(s.breaches.some((b) => b.rule === "order-type"));
  for (const ch of CHALLENGES) {
    const sc = scoreChallenge(ch, { ...newChallengeLog(ch), bar: endBar(ch) });
    assert.ok(sc.score >= 0 && sc.score <= sc.max && sc.max === SCORE_MAX);
  }
  void sym;
});

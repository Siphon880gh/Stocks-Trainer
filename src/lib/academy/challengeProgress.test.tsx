/** Weng 2026-10-22: half-played challenges persist in the paper key (schema v2) with Resume / Restart. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PaperChallenges from "../../pages/academy/PaperChallenges";
import { CHALLENGES, REFERENCE_PLAYS, endBar, newChallengeLog, planPolicy, play } from "./challenges";
import { clearRun, keepRun, savedRun } from "./challengeProgress";
import { PAPER_KEY, PAPER_SCHEMA_VERSION, emptyPaper, loadPaper, memoryStorage, migratePaper, savePaper } from "./storage";
import { renderHtml } from "./renderHarness";

const c = CHALLENGES[0]!;
const full = play(c, planPolicy(REFERENCE_PLAYS[c.id]!));
const mid = c.startBar + Math.floor(c.bars / 2);
const half = { ...full, bar: mid, actions: full.actions.filter((a) => a.atBar <= mid) };

test("v1 paper store → v2 is lossless and adds an empty challengeProgress; v2 migrates to itself", () => {
  const v1 = {
    schemaVersion: 1,
    session: full,
    challengeAttempts: { [c.id]: [{ score: 70, max: 100, passed: true, at: "2026-10-20T10:00:00.000Z" }] },
    stats: { orders: 7, limitFills: 1, trailingExits: 2, stopProtectedTrades: 3, stopLimitNoFills: 0 },
    portfolio: { id: "p2", name: "Swing" },
    otherPortfolios: [{ id: "main", name: "Main", session: half }],
  };
  const m = migratePaper(JSON.parse(JSON.stringify(v1)));
  assert.equal(PAPER_SCHEMA_VERSION, 2);
  assert.equal(m.schemaVersion, 2);
  const { schemaVersion: _a, challengeProgress, ...rest } = m;
  const { schemaVersion: _b, ...v1rest } = v1;
  assert.deepEqual(rest, JSON.parse(JSON.stringify(v1rest)));
  assert.deepEqual(challengeProgress, {});
  const v2 = keepRun(m, c.id, half);
  assert.deepEqual(migratePaper(JSON.parse(JSON.stringify(v2))), JSON.parse(JSON.stringify(v2)));
  // a stored v1 loads, and saving writes v2
  const st = memoryStorage({ [PAPER_KEY]: JSON.stringify(v1) });
  const l = loadPaper(st);
  assert.equal(l.recovered, false);
  savePaper(l.state, st);
  assert.equal(JSON.parse(st.data.get(PAPER_KEY)!).schemaVersion, 2);
  // a newer build's v3 is not guessed at
  assert.equal(loadPaper(memoryStorage({ [PAPER_KEY]: JSON.stringify({ schemaVersion: 3 }) })).recovered, true);
});

test("migration drops progress entries that are not session logs", () => {
  const m = migratePaper({ schemaVersion: 2, challengeProgress: { a: half, b: { bar: "x" }, c: 4, d: null } });
  assert.deepEqual(Object.keys(m.challengeProgress), ["a"]);
});

test("savedRun offers only a real, unfinished run of this challenge", () => {
  const s = keepRun(emptyPaper(), c.id, half);
  assert.deepEqual(savedRun(c, s), half);
  assert.equal(savedRun(c, emptyPaper()), null);
  assert.equal(savedRun(c, keepRun(emptyPaper(), c.id, newChallengeLog(c))), null, "nothing played yet");
  assert.equal(savedRun(c, keepRun(emptyPaper(), c.id, { ...half, bar: endBar(c) })), null, "finished");
  assert.equal(savedRun(c, keepRun(emptyPaper(), c.id, { ...half, tapeId: "other" })), null, "other tape");
  assert.equal(savedRun(c, keepRun(emptyPaper(), c.id, { ...half, startingCash: half.startingCash + 1 })), null);
  assert.deepEqual(clearRun(s, c.id).challengeProgress, {});
  const other = CHALLENGES.find((x) => x.tapeId !== c.tapeId) ?? CHALLENGES[1]!;
  assert.equal(savedRun(other, keepRun(emptyPaper(), other.id, half)), null);
});

const page = (path: string, st: ReturnType<typeof memoryStorage>) =>
  renderHtml(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/paper/challenges" element={<PaperChallenges storage={st} />} />
        <Route path="/paper/challenges/:challengeId" element={<PaperChallenges storage={st} />} />
      </Routes>
    </MemoryRouter>,
  );

test("a saved half-played run shows Resume / Restart instead of the session, and the list marks it in progress", () => {
  const st = memoryStorage();
  savePaper(keepRun(emptyPaper(), c.id, half), st);
  const play = page(`/paper/challenges/${c.id}`, st);
  assert.ok(play.includes('data-testid="challenge-resume"'));
  assert.ok(play.includes(`data-bar="${mid}"`));
  assert.ok(play.includes('data-testid="challenge-resume-go"'));
  assert.ok(play.includes('data-testid="challenge-restart"'));
  assert.ok(play.includes(`Bar ${mid - c.startBar} of ${c.bars}`));
  const list = page("/paper/challenges", st);
  assert.equal((list.match(/data-testid="challenge-in-progress"/g) ?? []).length, 1);
  // no saved run → straight into the session
  const fresh = page(`/paper/challenges/${c.id}`, memoryStorage());
  assert.ok(!fresh.includes('data-testid="challenge-resume"'));
});

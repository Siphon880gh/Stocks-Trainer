import { test } from "node:test";
import assert from "node:assert/strict";
import { BENCHMARK_NAMES, CHALLENGES, benchmarks, challengeOfTheWeek, leaderboard, rankEntries, weekIndex } from "./challenges";
import { readFileSync } from "node:fs";

test("rank math: competition ranking with ties; learner listed before benchmarks on a tie", () => {
  const r = rankEntries([
    { name: "A", score: 80, benchmark: true },
    { name: "You", score: 80, benchmark: false },
    { name: "B", score: 100, benchmark: true },
    { name: "C", score: 20, benchmark: true },
  ]);
  assert.deepEqual(r.map((e) => [e.name, e.rank]), [["B", 1], ["You", 2], ["A", 2], ["C", 4]]);
});

test("benchmarks are fictional, labelled, deterministic; the learner's best is ranked among them", () => {
  for (const n of BENCHMARK_NAMES) assert.match(n, /^Benchmark · /);
  for (const c of CHALLENGES) {
    const b = benchmarks(c);
    assert.ok(b.every((e) => e.benchmark));
    assert.deepEqual(b, benchmarks(c));
  }
  const lb = leaderboard(CHALLENGES[0]!, 0);
  assert.equal(lb.find((e) => e.name === "You")!.rank, lb.length);
  assert.equal(leaderboard(CHALLENGES[0]!, null).length, 3);
});

test("no network and no foreign storage in the challenge module", () => {
  const src = readFileSync(new URL("./challenges.ts", import.meta.url), "utf8");
  assert.doesNotMatch(src, /fetch\(|XMLHttpRequest|localStorage|WebSocket/);
});

test("challenge of the week: same week → same id; every challenge appears within N consecutive weeks", () => {
  const tz = "America/Los_Angeles";
  const mon = new Date("2026-10-19T17:00:00Z"); // Monday in LA
  const sun = new Date("2026-10-26T06:00:00Z"); // Sunday 23:00 LA, same ISO week
  assert.equal(weekIndex(mon, tz), weekIndex(sun, tz));
  assert.equal(challengeOfTheWeek(mon, tz).id, challengeOfTheWeek(sun, tz).id);
  assert.equal(weekIndex(new Date("2026-10-26T08:00:00Z"), tz), weekIndex(mon, tz) + 1, "Monday 01:00 LA starts a new week");
  const seen = new Set<string>();
  for (let w = 0; w < CHALLENGES.length; w++) seen.add(challengeOfTheWeek(new Date(mon.getTime() + w * 7 * 86_400_000), tz).id);
  assert.equal(seen.size, CHALLENGES.length);
  // year boundary: consecutive weeks stay consecutive
  assert.equal(weekIndex(new Date("2027-01-04T20:00:00Z"), tz) - weekIndex(new Date("2026-12-28T20:00:00Z"), tz), 1);
});

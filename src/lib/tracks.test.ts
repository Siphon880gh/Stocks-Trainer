import { test } from "node:test";
import assert from "node:assert/strict";
import { EVERYTHING_TRACK_ID, TRACKS, TRACK_KEY, clearTrackId, doneCount, getTrack, isStepDone, loadTrackId, nextSteps, saveTrackId, type TrackProgress } from "./tracks";
import { routeExists } from "./academy/refs";
import { STAGE_BY_ID } from "./progressMap";
import { CASE_PACKS } from "./caseStudies";
import { PATH_TEMPLATES } from "./learningPaths";
import { memoryStorage } from "./academy/storage";

const none: TrackProgress = { stageStatus: () => undefined, visited: new Set(), packPlayed: () => false };

test("tracks: unique ids, 7 learner tracks plus Show me everything, each mapped to a real learning path", () => {
  assert.equal(new Set(TRACKS.map((t) => t.id)).size, TRACKS.length);
  assert.equal(TRACKS.length, 8);
  assert.equal(TRACKS[TRACKS.length - 1]!.id, EVERYTHING_TRACK_ID);
  for (const t of TRACKS) assert.ok(PATH_TEMPLATES.some((p) => p.id === t.pathId), `${t.id} path ${t.pathId}`);
});

test("tracks: every step opens a real route, stage and case pack", () => {
  const packs = new Set(CASE_PACKS.map((p) => p.id));
  for (const t of TRACKS) {
    assert.ok(t.steps.length >= 3, t.id);
    for (const s of t.steps) {
      assert.ok(routeExists(s.to), `${t.id}: no route for ${s.to}`);
      if (s.stage) assert.ok(STAGE_BY_ID[s.stage], `${t.id}: unknown stage ${s.stage}`);
      if (s.pack) assert.ok(packs.has(s.pack as never), `${t.id}: unknown pack ${s.pack}`);
    }
  }
});

test("next steps: first three unfinished, by stage status, visit or case pack", () => {
  const t = getTrack("new-to-stocks")!;
  assert.deepEqual(nextSteps(t, none).map((s) => s.label), t.steps.slice(0, 3).map((s) => s.label));
  const progress: TrackProgress = {
    stageStatus: (id) => (id === "academy:L0" ? "done" : id.startsWith("academy:") ? "available" : undefined),
    visited: new Set(["/academy"]),
    packPlayed: (p) => p === "earnings",
  };
  assert.equal(isStepDone(t.steps[0]!, progress), true, "visited placement page");
  assert.equal(isStepDone(t.steps[1]!, progress), true, "L0 done on the map");
  assert.equal(isStepDone(t.steps[2]!, progress), false, "L1 status wins over the /academy visit");
  assert.equal(nextSteps(t, progress)[0]!.label, t.steps[2]!.label);
  assert.ok(isStepDone(t.steps.find((s) => s.pack === "earnings")!, progress));
  assert.equal(doneCount(t, progress), 3);
});

test("Show me everything always lists its entry points, including Browse everything", () => {
  const t = getTrack(EVERYTHING_TRACK_ID)!;
  const all: TrackProgress = { stageStatus: () => "done", visited: new Set(["/browse", "/training", "/map"]), packPlayed: () => true };
  assert.deepEqual(nextSteps(t, all).map((s) => s.to), ["/browse", "/training", "/map"]);
});

test("track storage: null before a pick, saved id after, unknown ids ignored", () => {
  const s = memoryStorage();
  assert.equal(loadTrackId(s), null);
  saveTrackId("options-vol", s);
  assert.equal(loadTrackId(s), "options-vol");
  saveTrackId("nope", s);
  assert.equal(loadTrackId(s), "options-vol");
  s.setItem(TRACK_KEY, "{bad json");
  assert.equal(loadTrackId(s), null);
});

test("tracks: clearing the track brings the picker back", () => {
  const kv = memoryStorage();
  saveTrackId("macro-news", kv);
  assert.equal(loadTrackId(kv), "macro-news");
  clearTrackId(kv);
  assert.equal(loadTrackId(kv), null);
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPathTrail,
  choose,
  choiceLabelBetween,
  ensureKnownNode,
  initialNavState,
  listSessions,
  loadSession,
  restart,
  rewindTo,
  stepBack,
  validateCoachingSession,
  validateDecisionGraph,
  type CoachingSession,
} from "./index.ts";
import { chaseVsFadeSession } from "./sessions/chase-vs-fade.ts";
import { coachSessionMatchesClass } from "../marketNavigator.ts";
import type { AssetClass } from "../samplePacks.ts";

describe("coaching validation", () => {
  it("accepts the chase-vs-fade sample", () => {
    const r = validateCoachingSession(chaseVsFadeSession);
    assert.equal(r.ok, true);
    assert.equal(r.issues.length, 0);
  });

  it("rejects broken next / rewind / missing success", () => {
    const bad: CoachingSession = {
      meta: {
        slug: "bad",
        title: "Bad",
        summary: "Bad",
        topic: "Test",
        tags: [],
      },
      tree: {
        start: "start",
        nodes: {
          start: {
            message: "Go",
            outcome: "continue",
            choices: [{ label: "x", next: "missing" }],
          },
          wrong: {
            message: "oops",
            outcome: "wrong",
            choices: [],
            // missing rewind_to
          },
        },
      },
    };
    const r = validateCoachingSession(bad);
    assert.equal(r.ok, false);
    const codes = new Set(r.issues.map((i) => i.code));
    assert.ok(codes.has("bad_next"));
    assert.ok(codes.has("missing_rewind"));
    assert.ok(codes.has("no_success"));
  });

  it("rejects invalid start reference", () => {
    const r = validateDecisionGraph({
      start: "nope",
      nodes: {
        start: { message: "x", outcome: "success", choices: [] },
      },
    });
    assert.equal(r.ok, false);
    assert.ok(r.issues.some((i) => i.code === "missing_start"));
  });
});

describe("coaching discovery", () => {
  it("lists valid sessions including sample", () => {
    const list = listSessions();
    assert.ok(list.length >= 4);
    assert.ok(list.some((s) => s.slug === "chase-vs-fade"));
  });

  it("expansion classes each have at least twelve tagged sessions", () => {
    const list = listSessions();
    const classes: AssetClass[] = ["future", "forex", "crypto", "option_context"];
    for (const cls of classes) {
      const n = list.filter((s) => coachSessionMatchesClass(s.tags, cls)).length;
      assert.ok(n >= 12, `${cls} has ${n} sessions, need ≥12`);
    }
  });

  it("loads start via loadSession", () => {
    const r = loadSession("chase-vs-fade");
    assert.equal(r.ok, true);
    if (!r.ok) return;
    const state = initialNavState(r.session.tree);
    assert.equal(state.currentNodeId, r.session.tree.start);
    assert.deepEqual(state.history, []);
  });

  it("handles missing session", () => {
    const r = loadSession("does-not-exist");
    assert.equal(r.ok, false);
    if (r.ok) return;
    assert.equal(r.error, "not_found");
  });
});

describe("coaching navigation", () => {
  const tree = chaseVsFadeSession.tree;

  it("follows a valid choice and grows history", () => {
    let s = initialNavState(tree);
    const choice = tree.nodes.start!.choices[1]!;
    const r = choose(tree, s, choice);
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.state.currentNodeId, "priced_in");
    assert.deepEqual(r.state.history, ["start"]);
  });

  it("rejects an invalid transition", () => {
    const s = initialNavState(tree);
    const r = choose(tree, s, { label: "nope", next: "priced_in" });
    assert.equal(r.ok, false);
    if (r.ok) return;
    assert.equal(r.error, "invalid_choice");
    assert.deepEqual(r.state.history, []);
  });

  it("normal step back pops one history entry", () => {
    let s = initialNavState(tree);
    s = choose(tree, s, tree.nodes.start!.choices[1]!).state;
    const back = stepBack(tree, s);
    assert.equal(back.ok, true);
    if (!back.ok) return;
    assert.equal(back.state.currentNodeId, "start");
    assert.deepEqual(back.state.history, []);
  });

  it("targeted rewind from wrong truncates history", () => {
    let s = initialNavState(tree);
    s = choose(tree, s, tree.nodes.start!.choices[1]!).state; // priced_in
    s = choose(tree, s, tree.nodes.priced_in!.choices[0]!).state; // wrong_buy_open
    assert.equal(s.currentNodeId, "wrong_buy_open");
    assert.deepEqual(s.history, ["start", "priced_in"]);
    const back = stepBack(tree, s);
    assert.equal(back.ok, true);
    if (!back.ok) return;
    assert.equal(back.state.currentNodeId, "priced_in");
    assert.deepEqual(back.state.history, ["start"]);
  });

  it("rewindTo truncates after destination", () => {
    const state = {
      currentNodeId: "wrong_buy_open",
      history: ["start", "priced_in"],
    };
    const r = rewindTo(tree, state, "priced_in");
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.state.currentNodeId, "priced_in");
    assert.deepEqual(r.state.history, ["start"]);
  });

  it("restart clears history to start", () => {
    let s = initialNavState(tree);
    s = choose(tree, s, tree.nodes.start!.choices[0]!).state;
    s = restart(tree);
    assert.equal(s.currentNodeId, "start");
    assert.deepEqual(s.history, []);
  });

  it("reaches success along the happy path", () => {
    let s = initialNavState(tree);
    s = choose(tree, s, tree.nodes.start!.choices[1]!).state;
    s = choose(tree, s, tree.nodes.priced_in!.choices[1]!).state;
    s = choose(tree, s, tree.nodes.horizon!.choices[1]!).state;
    assert.equal(s.currentNodeId, "success");
    assert.equal(tree.nodes.success!.outcome, "success");
  });

  it("unknown node recovers via ensureKnownNode", () => {
    const recovered = ensureKnownNode(tree, {
      currentNodeId: "ghost",
      history: ["start"],
    });
    assert.equal(recovered.currentNodeId, "start");
    assert.deepEqual(recovered.history, []);
  });
});

describe("path trail labels", () => {
  const tree = chaseVsFadeSession.tree;

  it("resolves choice labels between nodes", () => {
    const label = choiceLabelBetween(tree, "start", "priced_in");
    assert.equal(
      label,
      "Separate rumor vs filing, then ask if the move is already priced"
    );
  });

  it("builds trail from history + current", () => {
    const state = {
      currentNodeId: "priced_in",
      history: ["start"],
    };
    const trail = buildPathTrail(tree, state);
    assert.equal(trail.length, 2);
    assert.equal(trail[0]!.choiceLabel, choiceLabelBetween(tree, "start", "priced_in"));
    assert.equal(trail[1]!.isCurrent, true);
    assert.equal(trail[1]!.choiceLabel, null);
  });
});

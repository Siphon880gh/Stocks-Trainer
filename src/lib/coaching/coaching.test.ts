import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAiExplainPrompt,
  buildPathExplanationMarkdown,
  buildPathTrail,
  canShowAiExplain,
  chartBarsForCoachSlug,
  chatGptShareUrl,
  choose,
  choiceLabelBetween,
  claudeShareUrl,
  ensureKnownNode,
  initialNavState,
  listSessions,
  loadSession,
  nodeMessageToMarkdown,
  restart,
  rewindTo,
  stepBack,
  validateCoachingSession,
  validateDecisionGraph,
  type CoachingSession,
} from "./index.ts";
import { chaseVsFadeSession } from "./sessions/chase-vs-fade.ts";
import { cryptoSolAltHypeSession } from "./sessions/crypto-sol-alt-hype.ts";
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

describe("AI explain prompt", () => {
  it("hides on start and wrong, shows after a correct continue or success", () => {
    assert.equal(canShowAiExplain("continue", 0), false);
    assert.equal(canShowAiExplain("wrong", 1), false);
    assert.equal(canShowAiExplain("continue", 1), true);
    assert.equal(canShowAiExplain("success", 2), true);
  });

  it("bolds the question line in a node message", () => {
    const md = nodeMessageToMarkdown(
      "SAMPLE: bitcoin is flat. A SOL-style alt is extended after influencer clips. Not a live venue.\n\nFirst check?"
    );
    assert.match(md, /\*\*First check\?\*\*/);
    assert.match(md, /SAMPLE: bitcoin is flat/);
  });

  it("fills markdown from the session title through the current node", () => {
    const tree = cryptoSolAltHypeSession.tree;
    const trail = buildPathTrail(tree, {
      currentNodeId: "own",
      history: ["start"],
    });
    const md = buildPathExplanationMarkdown({
      title: cryptoSolAltHypeSession.meta.title,
      topic: cryptoSolAltHypeSession.meta.topic,
      steps: trail,
    });
    assert.match(md, /^# Alt hype versus SAMPLE bitcoin/m);
    assert.match(md, /\*Multi-market decisions\*/);
    assert.match(md, /## 1\./);
    assert.match(md, /\*\*First check\?\*\*/);
    assert.match(
      md,
      /\*You chose: Ask whether the alt has its own durable fact, or only social heat\*/
    );
    assert.match(md, /## 2\./);
    assert.match(md, /The brief is clips, not a protocol or listing fact/);
    assert.match(md, /\*\*What stance fits the alt\?\*\*/);
    assert.doesNotMatch(md, /You chose: Hold or fade/);
    assert.doesNotMatch(md, /SAMPLE chart/);
  });

  it("appends an OHLC table when the session has a chart", () => {
    const tree = cryptoSolAltHypeSession.tree;
    const trail = buildPathTrail(tree, {
      currentNodeId: "own",
      history: ["start"],
    });
    const md = buildPathExplanationMarkdown({
      title: cryptoSolAltHypeSession.meta.title,
      topic: cryptoSolAltHypeSession.meta.topic,
      steps: trail,
      chart: [
        { name: "T0", open: 100, high: 102, low: 99, close: 101 },
      ],
    });
    assert.match(md, /## SAMPLE chart/);
    assert.match(md, /\| Time \| High \| Open \| Close \| Low \|/);
    assert.match(md, /\| T0 \| 102 \| 100 \| 101 \| 99 \|/);
  });

  it("uses a unique playbook tape and skips a slug with two packs", () => {
    assert.ok((chartBarsForCoachSlug("chart-soft-gate")?.length ?? 0) > 0);
    assert.equal(chartBarsForCoachSlug("chase-vs-fade"), undefined);
    assert.equal(chartBarsForCoachSlug("does-not-exist"), undefined);
  });

  it("wraps the path markdown in the TLDR / ELI5 prompt", () => {
    const prompt = buildAiExplainPrompt("# Title\n\nHello");
    assert.match(prompt, /Generate a TLDR, then ELI5/);
    assert.match(prompt, /Can this be applied in other scenarios\?/);
    assert.match(prompt, /What's happening financially\?/);
    assert.match(prompt, /Explanation here:/);
    assert.match(prompt, /"""\n# Title\n\nHello\n"""/);
  });

  it("builds ChatGPT and Claude share URLs", () => {
    const prompt = "Read this explanation";
    const gpt = chatGptShareUrl(prompt);
    const claude = claudeShareUrl(prompt);
    assert.ok(gpt.startsWith("https://chatgpt.com/"));
    assert.ok(gpt.includes("q=Read"));
    assert.ok(claude.startsWith("https://claude.ai/new"));
    assert.ok(claude.includes("q=Read"));
  });
});

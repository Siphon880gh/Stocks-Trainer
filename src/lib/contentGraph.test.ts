/**
 * Content graph auto-verification (docs/projects/content-graph/LOOP-Graph.md).
 *
 * Every section loop in LOOPS/ states coverage floors and authoring rules. This file turns
 * them into checks, so a tick (or a cleanup) that breaks a floor, a deep-link id, or a loop
 * prompt reference fails `npm run test:content` instead of passing lint + build silently.
 * Floors here are the loop files' floors; raise them there and here together, never lower them.
 */
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { LITERACY_TERMS } from "./literacyTerms.ts";
import { PATTERNS } from "./patterns.ts";
import { ADVANCED_DRILL_INFO, ADVANCED_PATTERNS } from "./advancedPatterns.ts";
import { OVERLAYS } from "./overlays.ts";
import { SAMPLE_PACKS_BY_CLASS, EQUITY_SAMPLE_PACKS, type AssetClass } from "./samplePacks.ts";
import "./markets.ts"; // pushes the crypto SAMPLE packs into CRYPTO_SAMPLE_PACKS
import { PATTERN_OHLC, type OHLC } from "./ohlcData.ts";
import { getFinancialSnapshot } from "./financialSnapshots.ts";
import { UNITS } from "./academy/content/levels.ts";
import { ACADEMY_QUIZ_GROUP_IDS } from "./academy/quiz/groups.ts";
import { QUIZ_GROUPS, getQuestionsForGroup, type QuizGroupId, type QuizQuestion } from "./quizData.ts";
import { BUY_SELL_PATTERN_KEYS, BUY_SELL_SCENARIO_KEYS, BUY_SELL_WAIT_IDS } from "./buySellDrill.ts";
import { DRAW_TEMPLATES, parseDrawTemplateId } from "./practiceDraw.ts";
import {
  HUNT_TAPES,
  INVALIDATION_ROUNDS,
  LEVEL_ROUNDS,
  LOOKALIKE_ROUNDS,
  PLAN_TAPES,
  REGIME_WINDOWS,
  REPLAY_TAPES,
} from "./practiceLabs.ts";
import { scanPatterns } from "./patternScan.ts";
import { CASE_PACKS, CASE_STUDIES, listCaseStudiesByAssetClass, type CaseStudy } from "./caseStudies.ts";
import { COACH_TIP_BY_THINKING_MODE } from "./thinkingModeTips.ts";
import { CLASS_TO_DECIDE_PACKS, coachSessionMatchesClass } from "./marketNavigator.ts";
import { listSessions } from "./coaching/index.ts";
import { COACHING_SESSION_MODULES } from "./coaching/sessions/index.ts";
import {
  BEGINNER_PATH_MILESTONES,
  DECISION_MAKER_PATH_MILESTONES,
  MARKET_EXPLORER_PATH_MILESTONES,
  literacyTermAssetClass,
} from "./beginnerPath.ts";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const dupes = (ids: string[]) => [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
const allPacks = () => Object.values(SAMPLE_PACKS_BY_CLASS).flat();
/** Close-to-close shape signature: equal for a series and any rescaled copy of it. */
const shape = (bars: OHLC[]) => bars.map((b) => (b.close / bars[0]!.close).toFixed(3)).join(",");

const QUESTION_GROUPS = QUIZ_GROUPS.filter((g) => g.id !== "all");
const questions = (id: QuizGroupId) => getQuestionsForGroup(id);

// ---------------------------------------------------------------- Archive (LOOP-Archive.md)
describe("Archive floors + ids", () => {
  it("Phase A: ≥28 literacy terms, unique ids (Archive ?open= and flashcards key on them)", () => {
    assert.ok(LITERACY_TERMS.length >= 28);
    assert.deepEqual(dupes(LITERACY_TERMS.map((t) => t.id)), []);
  });
  it("Phase B: ≥18 patterns, unique ids, valid type", () => {
    assert.ok(PATTERNS.length >= 18);
    assert.deepEqual(dupes(PATTERNS.map((p) => p.id)), []);
    for (const p of PATTERNS) assert.ok(["reversal", "continuation", "neutral"].includes(p.type), p.id);
  });
  it("Phase C: OVERLAYS lists exactly the overlays MarketChart renders", () => {
    assert.deepEqual(OVERLAYS.map((o) => o.id).sort(), ["bollinger", "ema", "macd", "rsi", "sma"]);
  });
  it("every Archive pattern has a chart series in PATTERN_OHLC", () => {
    const missing = PATTERNS.filter((p) => !PATTERN_OHLC[p.id]).map((p) => p.id);
    assert.deepEqual(missing, []);
  });
  it("advanced patterns link to real Archive terms (glossaryLink and drill term)", () => {
    const termIds = new Set(LITERACY_TERMS.map((t) => t.id));
    assert.deepEqual(ADVANCED_PATTERNS.filter((p) => !termIds.has(p.glossaryLink)).map((p) => p.id), []);
    assert.deepEqual(
      Object.entries(ADVANCED_DRILL_INFO).filter(([, v]) => !termIds.has(v.term)).map(([k]) => k),
      [],
    );
  });
});

// ---------------------------------------------------------------- Charts (LOOP-Charts.md)
describe("Charts floors", () => {
  it("≥5 SAMPLE packs per asset class, unique ids", () => {
    for (const [cls, packs] of Object.entries(SAMPLE_PACKS_BY_CLASS)) assert.ok(packs.length >= 5, cls);
    assert.deepEqual(dupes(allPacks().map((p) => p.id)), []);
  });
  it("no pack is a rescaled clone of another", () => {
    const seen = new Map<string, string>();
    for (const p of allPacks()) {
      const s = shape(p.ohlc);
      assert.ok(!seen.has(s), `${p.id} has the same shape as ${seen.get(s)}`);
      seen.set(s, p.id);
    }
  });
  it("notes stay SAMPLE / STYLIZED honest", () => {
    for (const p of allPacks()) assert.match(p.educationalNotes + p.displayName, /SAMPLE|STYLIZED/i, p.id);
  });
});

// ---------------------------------------------------------------- Learn (LOOP-Learn.md)
const PHASE_A = ["equity-literacy", "financial-literacy", "indicators", "candle-anatomy", "news-literacy", "financial-drills"] as const;
const PHASE_D = ["futures-literacy", "forex-literacy", "crypto-literacy", "options-literacy"] as const;
const DEDICATED_FLOORS: Record<string, number> = {
  "candle-reading": 12,
  "candle-pattern-book": 12,
  "earnings-jargon": 12,
  "price-action": 12,
  "supply-demand": 12,
  "buy-or-sell": 60,
  "equity-patterns": 8,
  // project-owned groups (floors from the financials-earnings / macro-forces charters)
  "statements-reading": 12,
  "cash-forecast-13wk": 10,
  "earnings-preview": 10,
  "earnings-reaction": 10,
  "macro-releases": 14,
  "rates-curve": 12,
  "fed-policy": 12,
  "housing-mortgage": 10,
  "macro-reactions": 14,
};
const NON_FAMILY = new Set<string>([...PHASE_A, ...PHASE_D, ...Object.keys(DEDICATED_FLOORS)]);

describe("Learn floors", () => {
  it("Phase A path groups ≥12 each", () => {
    for (const g of PHASE_A) assert.ok(questions(g).length >= 12, `${g}: ${questions(g).length}`);
  });
  it("Phase B: every pattern family group ≥6, chart-pick first and *-MOVE last", () => {
    const families = QUESTION_GROUPS.map((g) => g.id).filter((id) => !NON_FAMILY.has(id));
    assert.ok(families.length >= 8);
    for (const g of families) {
      const qs = questions(g);
      assert.ok(qs.length >= 6, `${g}: ${qs.length}`);
      const rank = (q: QuizQuestion) => (q.optionsAreCharts ? 0 : /-MOVE\d*$/.test(q.id) ? 2 : 1);
      const ranks = qs.map(rank);
      assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b), `${g} sort contract`);
    }
  });
  it("Phase C: equity-patterns drills reference real equity packs, and every equity pack has one", () => {
    const qs = questions("equity-patterns");
    const equityIds = new Set(EQUITY_SAMPLE_PACKS.map((p) => p.id));
    for (const q of qs) assert.ok(q.samplePackId && equityIds.has(q.samplePackId), q.id);
    const used = new Set(qs.map((q) => q.samplePackId));
    assert.deepEqual([...equityIds].filter((id) => !used.has(id)), []);
  });
  it("Phase D multi-market literacy groups ≥12 each", () => {
    for (const g of PHASE_D) assert.ok(questions(g).length >= 12, `${g}: ${questions(g).length}`);
  });
  it("dedicated and project banks meet their floors", () => {
    for (const [g, floor] of Object.entries(DEDICATED_FLOORS)) {
      assert.ok(questions(g as QuizGroupId).length >= floor, `${g}: ${questions(g as QuizGroupId).length} < ${floor}`);
    }
  });
});

describe("Learn reference integrity (every group)", () => {
  const termIds = new Set(LITERACY_TERMS.map((t) => t.id));
  const packIds = new Set(allPacks().map((p) => p.id));
  const overlayIds = new Set(OVERLAYS.map((o) => o.id));
  for (const g of QUESTION_GROUPS) {
    it(`${g.id}: ids unique; answers, terms, snapshots, overlays, packs and charts resolve`, () => {
      const qs = questions(g.id);
      assert.ok(qs.length > 0);
      assert.deepEqual(dupes(qs.map((q) => q.id)), []);
      for (const q of qs) {
        assert.ok(q.options.some((o) => o.id === q.correctAnswer), `${q.id} answer`);
        assert.deepEqual(dupes(q.options.map((o) => o.id)), [], `${q.id} option ids`);
        if (q.glossaryTermId) assert.ok(termIds.has(q.glossaryTermId), `${q.id} → ${q.glossaryTermId}`);
        if (q.snapshotId) assert.ok(getFinancialSnapshot(q.snapshotId), `${q.id} → ${q.snapshotId}`);
        if (q.overlayId) assert.ok(overlayIds.has(q.overlayId), `${q.id} → ${q.overlayId}`);
        if (q.samplePackId) assert.ok(packIds.has(q.samplePackId), `${q.id} → ${q.samplePackId}`);
        const heroCandle =
          !q.optionsAreCharts && !q.financialsExhibit && !q.macroExhibit && !q.snapshotId && !q.overlayId && q.patternKey;
        // QuizModal silently falls back to the hammer chart, so a typo would show the wrong candles.
        if (heroCandle) assert.ok(PATTERN_OHLC[q.patternKey!], `${q.id} chart ${q.patternKey}`);
        if (q.optionsAreCharts) {
          for (const o of q.options) assert.ok(o.chartKey && PATTERN_OHLC[o.chartKey], `${q.id} option ${o.id}`);
        }
      }
    });
  }
});

describe("Buy or Sell? keeps full coverage of directional patterns", () => {
  // Patterns drilled under another key: bullish engulfing is the drill's `engulfing`,
  // the plain long candles are the drill's one-candle reads.
  const ALIASES: Record<string, string> = {
    "bullish-engulfing": "engulfing",
    "long-green-candle": "candle-bulls-win",
    "long-red-candle": "candle-bears-win",
  };
  it("every bullish / bearish Archive pattern is a drill key, a scenario chart, or a Wait case", () => {
    const keys = new Set(BUY_SELL_PATTERN_KEYS);
    const scen = new Set(BUY_SELL_SCENARIO_KEYS);
    const wait = new Set(BUY_SELL_WAIT_IDS);
    const missing = PATTERNS.filter((p) => p.sentiment === "bullish" || p.sentiment === "bearish")
      .map((p) => p.id)
      .filter((id) => !keys.has(ALIASES[id] ?? id) && !scen.has(`sc-${id}`) && !wait.has(`BS-W-${id}`));
    assert.deepEqual(missing, []);
  });
});

// ---------------------------------------------------------------- Practice (LOOP-Practice.md)
describe("Practice floors", () => {
  it("Phase A: draw templates for the taught candle silhouettes; ids parse", () => {
    const ids = new Set(DRAW_TEMPLATES.map((t) => t.id));
    for (const id of ["doji", "hammer", "shooting-star", "inverted-hammer", "bullish-engulfing", "bearish-engulfing", "morning-star"]) {
      assert.ok(ids.has(id as never), id);
    }
    assert.deepEqual(dupes(DRAW_TEMPLATES.map((t) => t.id)), []);
    for (const t of DRAW_TEMPLATES) assert.equal(parseDrawTemplateId(t.id), t.id);
  });
  it("Phase B: ≥8 regime windows, unique ids, ≥6 bars, distinct shapes", () => {
    assert.ok(REGIME_WINDOWS.length >= 8);
    assert.deepEqual(dupes(REGIME_WINDOWS.map((w) => w.id)), []);
    for (const w of REGIME_WINDOWS) assert.ok(w.bars.length >= 6, w.id);
    assert.equal(new Set(REGIME_WINDOWS.map((w) => shape(w.bars))).size, REGIME_WINDOWS.length);
  });
  it("Phase C: ≥2 replay and ≥2 plan tapes; ≥2 hunt tapes, each with a scan hit", () => {
    assert.ok(REPLAY_TAPES.length >= 2);
    assert.ok(PLAN_TAPES.length >= 2);
    assert.ok(HUNT_TAPES.length >= 2);
    for (const t of HUNT_TAPES) assert.ok(scanPatterns(t.bars).length > 0, t.id);
  });
  it("Phase D labs (lookalike / invalidation / levels) keep ≥8 rounds each", () => {
    assert.ok(LOOKALIKE_ROUNDS.length >= 8);
    assert.ok(INVALIDATION_ROUNDS.length >= 8);
    assert.ok(LEVEL_ROUNDS.length >= 8);
  });
});

// ---------------------------------------------------------------- Cases (LOOP-Cases.md + Stage B)
const HOME_MODES: Record<string, CaseStudy["thinkingMode"][]> = {
  earnings: ["beat_miss", "margin_compression", "cash_flow_red_flag", "guidance_cut", "balance_sheet_stress"],
  "company-news": ["momentum_chase_vs_fade", "company_headline", "short_vs_sell"],
  "macro-news": ["risk_off", "macro_print", "geopolitics_supply"],
  combined: ["combined_earnings_headline", "combined_rumor_filing"],
};
for (const cls of ["futures", "forex", "crypto", "options"]) {
  HOME_MODES[`${cls}-tape`] = ["momentum_chase_vs_fade", "company_headline"];
  HOME_MODES[`${cls}-macro`] = ["risk_off", "macro_print", "geopolitics_supply"];
}
const PACK_FLOORS: Record<string, [number, number]> = {
  earnings: [8, 4],
  "company-news": [8, 4],
  "macro-news": [8, 4],
  combined: [8, 4],
  futures: [8, 3],
  forex: [8, 3],
  crypto: [8, 3],
  "options-context": [6, 3],
};

describe("Cases floors", () => {
  const inPack = (p: string, d?: string) => CASE_STUDIES.filter((c) => c.packId === p && (!d || c.difficulty === d));
  it("pack floors (beginner / intermediate)", () => {
    for (const [p, [b, i]] of Object.entries(PACK_FLOORS)) {
      assert.ok(inPack(p, "beginner").length >= b, `${p} beginner`);
      assert.ok(inPack(p, "intermediate").length >= i, `${p} intermediate`);
    }
  });
  it("every home thinking mode appears at beginner and intermediate in its home pack (incl. Stage B packs)", () => {
    for (const [p, modes] of Object.entries(HOME_MODES)) {
      for (const m of modes) {
        for (const d of ["beginner", "intermediate"]) {
          assert.ok(inPack(p, d).some((c) => c.thinkingMode === m), `${p} ${m} ${d}`);
        }
      }
    }
  });
  it("ids and titles unique; every pack keeps ≥1 beginner case; navigator packs exist", () => {
    assert.deepEqual(dupes(CASE_STUDIES.map((c) => c.id)), []);
    assert.deepEqual(dupes(CASE_STUDIES.map((c) => c.title)), []);
    for (const p of CASE_PACKS) assert.ok(inPack(p.id, "beginner").length >= 1, p.id);
    const packIds = new Set(CASE_PACKS.map((p) => p.id));
    for (const packs of Object.values(CLASS_TO_DECIDE_PACKS)) for (const p of packs ?? []) assert.ok(packIds.has(p), p);
  });
  it("no case tape (pre + post) is a rescaled clone of another", () => {
    const seen = new Map<string, string>();
    for (const c of CASE_STUDIES) {
      const s = `${shape(c.preOhlc)}|${shape(c.postOhlc)}`;
      assert.ok(!seen.has(s), `${c.id} clones ${seen.get(s)}`);
      seen.set(s, c.id);
    }
  });
  it("non-equity cases set assetClass; shorts stay off unless the case teaches them; tips cover every mode", () => {
    for (const c of CASE_STUDIES) {
      if (!["earnings", "company-news", "macro-news", "combined", "demo"].includes(c.packId)) assert.ok(c.assetClass, c.id);
      if (c.correctActions.includes("short")) assert.equal(c.allowShort, true, c.id);
      assert.ok(COACH_TIP_BY_THINKING_MODE[c.thinkingMode], c.thinkingMode);
    }
  });
});

// ---------------------------------------------------------------- Coach (LOOP-Coach.md)
describe("Coach", () => {
  it("no module is dropped by validation; slugs unique", () => {
    const listed = listSessions();
    assert.equal(listed.length, COACHING_SESSION_MODULES.length);
    assert.deepEqual(dupes(listed.map((s) => s.slug)), []);
  });
  it("each session: ≥2 wrong nodes with rewind_to, ≥1 success, ≤16 nodes", () => {
    for (const s of COACHING_SESSION_MODULES) {
      const nodes = Object.values(s.tree.nodes);
      const wrong = nodes.filter((n) => n.outcome === "wrong");
      assert.ok(wrong.length >= 2, s.meta.slug);
      for (const n of wrong) assert.ok(n.rewind_to && s.tree.nodes[n.rewind_to], s.meta.slug);
      assert.ok(nodes.some((n) => n.outcome === "success"), s.meta.slug);
      assert.ok(nodes.length <= 16, `${s.meta.slug}: ${nodes.length} nodes`);
    }
  });
  it("Phase A–D topic rows each have a covering session", () => {
    const tags = listSessions().map((s) => new Set(s.tags));
    const need = [
      ["earnings"], ["margins"], ["statements"], ["guidance"], ["debt"], ["risk-off"], ["macro-print"], ["supply"], ["combined"],
      ["forex"], ["crypto"], ["options-context"], ["futures"], ["literacy"], ["indicators"], ["news-literacy"],
      ["trade-management"], ["supply-demand"], ["candles"],
    ];
    for (const n of need) assert.ok(tags.some((t) => n.every((x) => t.has(x))), n.join("+"));
  });
});

// ---------------------------------------------------------------- Asymmetry (LOOP-Asymmetry.md)
describe("Asymmetry parity targets (live, from Equities counts)", () => {
  const EXP: AssetClass[] = ["future", "forex", "crypto", "option_context"];
  const coachCount = (cls: AssetClass) => listSessions().filter((s) => coachSessionMatchesClass(s.tags, cls)).length;
  const eq = listCaseStudiesByAssetClass("equity");
  const LIT: Record<string, QuizGroupId> = {
    future: "futures-literacy",
    forex: "forex-literacy",
    crypto: "crypto-literacy",
    option_context: "options-literacy",
  };
  for (const cls of EXP) {
    it(`${cls} meets 70% cases / coach, equal charts / literacy, ≥4 Archive terms`, () => {
      const cases = listCaseStudiesByAssetClass(cls);
      assert.ok(cases.length >= Math.ceil(0.7 * eq.length));
      for (const d of ["beginner", "intermediate"] as const) {
        assert.ok(
          cases.filter((c) => c.difficulty === d).length >= Math.ceil(0.7 * eq.filter((c) => c.difficulty === d).length),
          `${cls} ${d}`,
        );
      }
      assert.ok(coachCount(cls) >= Math.ceil(0.7 * coachCount("equity")), `${cls} coach ${coachCount(cls)}`);
      assert.ok(SAMPLE_PACKS_BY_CLASS[cls].length >= SAMPLE_PACKS_BY_CLASS.equity.length);
      assert.ok(questions(LIT[cls]!).length >= questions("equity-literacy").length);
      assert.ok(LITERACY_TERMS.filter((t) => literacyTermAssetClass(t.id) === cls).length >= 4);
      assert.ok((CLASS_TO_DECIDE_PACKS[cls] ?? []).length >= 3, `${cls} Stage B packs`);
    });
  }
});

// ---------------------------------------------------------------- Home (LOOP-Home.md)
describe("Home coach tips name real surfaces", () => {
  const titles = listSessions().map((s) => s.title).sort((a, b) => b.length - a.length);
  const learnNames = [
    ...QUIZ_GROUPS.map((g) => g.name),
    "Misc Practices",
    "Statements lab",
    "Read the Print",
  ].map((n) => n.toLowerCase());
  const milestones = [...BEGINNER_PATH_MILESTONES, ...DECISION_MAKER_PATH_MILESTONES, ...MARKET_EXPLORER_PATH_MILESTONES];
  it("every milestone has a specific tip", () => {
    for (const m of milestones) assert.ok(m.coachTip && m.coachTip.length >= 30, m.id);
  });
  it("each 'Coach → …' names catalog session titles", () => {
    for (const m of milestones) {
      for (const seg of m.coachTip.split("Coach → ").slice(1)) {
        let rest = seg;
        let matched = 0;
        for (;;) {
          rest = rest.replace(/^(,\s*)?(or\s+)?/, "");
          const t = titles.find((x) => rest.startsWith(x));
          if (!t) break;
          matched += 1;
          rest = rest.slice(t.length);
        }
        assert.ok(matched >= 1 && /^[.\s]/.test(rest || "."), `${m.id}: "Coach → ${seg}"`);
      }
    }
  });
  it("each 'Training → …' / 'Learn → …' starts with a real Learn surface", () => {
    for (const m of milestones) {
      for (const seg of m.coachTip.split(/(?:Training|Learn) → /).slice(1)) {
        const low = seg.toLowerCase();
        assert.ok(learnNames.some((n) => low.startsWith(n)), `${m.id}: "→ ${seg}"`);
      }
    }
  });
});

// ---------------------------------------------------------------- Loop prompts themselves
describe("Loop prompts: config, verification and links", () => {
  const loopFiles = [
    ...readdirSync(join(REPO, "LOOPS")).filter((f) => f.endsWith(".md")).map((f) => join(REPO, "LOOPS", f)),
    ...readdirSync(join(REPO, "docs/projects")).flatMap((p) =>
      readdirSync(join(REPO, "docs/projects", p))
        .filter((f) => f.endsWith(".md"))
        .map((f) => join(REPO, "docs/projects", p, f)),
    ),
  ];
  const loopPrompts = loopFiles.filter((f) => /\/LOOP-[^/]+\.md$/.test(f));
  it("every loop prompt carries the shared config block (3 attempts × 3 rounds, temp build dir)", () => {
    assert.ok(loopPrompts.length >= 12);
    for (const f of loopPrompts) {
      const s = readFileSync(f, "utf8");
      assert.match(s, /ATTEMPT_LIMIT: 3\b/, f);
      assert.match(s, /ERROR_ROUNDS_PER_ATTEMPT: 3\b/, f);
      assert.match(s, /COMMIT_MODE: none\b/, f);
      assert.match(s, /BUILD_CHECK: npx vite build --outDir \/tmp\//, f);
      assert.match(s, /CHECKPOINT_MODE: (continue|stop)\b/, f);
    }
  });
  it("no loop prompt verifies with a plain `npm run build` (it would overwrite dist/)", () => {
    for (const f of [...loopFiles, join(REPO, "LOOPS/README.md")]) {
      assert.doesNotMatch(readFileSync(f, "utf8"), /npm run build/, f);
    }
  });
  it("relative markdown links in loop docs resolve", () => {
    for (const f of loopFiles) {
      const s = readFileSync(f, "utf8");
      for (const m of s.matchAll(/\]\((\.{1,2}\/[^)#\s]+)(?:#[^)]*)?\)/g)) {
        assert.ok(existsSync(resolve(dirname(f), m[1]!)), `${f} → ${m[1]}`);
      }
    }
  });
});

describe("echo family 14 (academy): Learn Academy groups ↔ Academy units", () => {
  it("every Academy Learn group has questions and is linked (never copied) from at least one Academy unit", () => {
    for (const g of ACADEMY_QUIZ_GROUP_IDS) {
      assert.ok(QUIZ_GROUPS.some((q) => q.id === g), `${g} is a Learn group`);
      assert.ok(getQuestionsForGroup(g as QuizGroupId).length >= 6, `${g} has questions`);
      const units = UNITS.filter((u) => u.refs.includes(`quiz:${g}`));
      assert.ok(units.length >= 1, `${g} is linked from an Academy unit`);
    }
  });
});

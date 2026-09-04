# Drain scanner + Practice Phase D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Make `scanPatterns` name every one-/two-/three-bar Archive candle the trainer already teaches (context-aware, not silhouette-only), then add three Practice Phase D routes that drill lookalikes, invalidation, and levels on SAMPLE tapes.

**Architecture:** Extend detectors in `patternScan.ts` using existing `PATTERN_OHLC` series as fixtures. Hunt tapes consume the new names. Phase D labs follow Hunt/Plan: `PracticeShell` + grade helpers in `practiceLabs.ts` + hub rows in `MISC_PRACTICE_ITEMS`. No LIVE desk, no order routing, no new progress key.

**Tech Stack:** TypeScript, Vite + React, `node:test` via `npx tsx --test`. Verify: `npx tsx --test src/lib/patternScan.test.ts src/lib/practiceLabs.test.ts` && `npm run lint` && `npm run build`. Leave `npm run dev` on 3001 alone.

## Global Constraints

- SAMPLE / STYLIZED / educational only. No LIVE / brokerage / paid APIs.
- Options = context only. Equities Beginner unlocks and `analysis_core_progress_v1` unchanged.
- `analysis_core_misc_practices_done_v1` and `analysis_core_practice_draw_v1` unchanged.
- Distinct OHLC already in `ohlcData.ts` — do not clone-and-scale.
- Draw Jaccard constants unchanged.
- Do not commit unless the human asks.
- TDD: failing `tsx --test` first, then detectors / grade functions.

## Files

- Modify: `src/lib/patternScan.ts`
- Modify: `src/lib/patternScan.test.ts`
- Modify: `src/lib/practiceLabs.ts`
- Modify: `src/lib/practiceLabs.test.ts`
- Modify: `src/lib/miscPractices.ts`
- Modify: `src/App.tsx`
- Create: `src/pages/practice/Lookalike.tsx`
- Create: `src/pages/practice/Invalidation.tsx`
- Create: `src/pages/practice/Levels.tsx`

Phase D routes (named here because LOOP-Practice Phase D had no ids):

| id | route | trains |
|----|--------|--------|
| `lookalike` | `/practice/lookalike` | Hammer vs hanging-man, pierce vs engulf, star vs soldiers, tweezer vs double, wedge vs triangle |
| `invalidation` | `/practice/invalidation` | Tap the price that cancels the SAMPLE idea |
| `levels` | `/practice/levels` | Tap support or resistance as a zone, not a magic tick |

Structure patterns (wedge/flag/double/triangle/H&S) stay hunt-optional this pass; they need swing logic, not the current bar-geometry scanner.

---

### Task 1: Failing scanner tests

**Files:**
- Modify: `src/lib/patternScan.test.ts`

**Produces:** `scanPatterns` tests on `PATTERN_OHLC` plus `patternBarIndices` for new multi-bar names.

- [x] **Step 1: Import `scanPatterns` and `PATTERN_OHLC`. Add this describe.**

```ts
import { PATTERN_OHLC } from "./ohlcData.ts";
import { explainChartProgression, patternBarIndices, scanPatterns } from "./patternScan.ts";

function namesAt(key: string): string[] {
  return scanPatterns(PATTERN_OHLC[key] ?? []).map((p) => p.name);
}

describe("scanPatterns candle families", () => {
  it("labels a lower wick after a decline as Hammer, not Hanging Man", () => {
    const names = namesAt("hammer");
    assert.ok(names.includes("Hammer"));
    assert.equal(names.includes("Hanging Man"), false);
  });

  it("labels a lower wick after a rally as Hanging Man, not Hammer", () => {
    const names = namesAt("hanging-man");
    assert.ok(names.includes("Hanging Man"));
    assert.equal(names.includes("Hammer"), false);
  });

  it("splits long upper wick by context", () => {
    assert.ok(namesAt("shooting-star").includes("Shooting Star"));
    assert.equal(namesAt("shooting-star").includes("Inverted Hammer"), false);
    assert.ok(namesAt("inverted-hammer").includes("Inverted Hammer"));
    assert.equal(namesAt("inverted-hammer").includes("Shooting Star"), false);
  });

  it("labels Morning Star and Evening Star on their own tapes", () => {
    assert.ok(namesAt("morning-star").includes("Morning Star"));
    assert.equal(namesAt("morning-star").includes("Evening Star"), false);
    assert.ok(namesAt("evening-star").includes("Evening Star"));
    assert.equal(namesAt("evening-star").includes("Morning Star"), false);
  });

  it("does not call a pierce an engulf, or a cover an engulf", () => {
    assert.ok(namesAt("piercing-line").includes("Piercing Line"));
    assert.equal(namesAt("piercing-line").includes("Bullish Engulfing"), false);
    assert.ok(namesAt("bullish-engulfing").includes("Bullish Engulfing"));
    assert.equal(namesAt("bullish-engulfing").includes("Piercing Line"), false);
    assert.ok(namesAt("dark-cloud-cover").includes("Dark Cloud Cover"));
    assert.equal(namesAt("dark-cloud-cover").includes("Bearish Engulfing"), false);
    assert.ok(namesAt("bearish-engulfing").includes("Bearish Engulfing"));
    assert.equal(namesAt("dark-cloud-cover").includes("Bearish Engulfing"), false);
  });

  it("labels soldiers, crows, harami, and tweezers", () => {
    assert.ok(namesAt("three-white-soldiers").includes("Three White Soldiers"));
    assert.ok(namesAt("three-black-crows").includes("Three Black Crows"));
    assert.ok(namesAt("harami").includes("Harami"));
    assert.equal(namesAt("harami").includes("Bullish Engulfing"), false);
    assert.ok(namesAt("tweezer-top").includes("Tweezer Top"));
    assert.ok(namesAt("tweezer-bottom").includes("Tweezer Bottom"));
  });
});
```

- [x] **Step 2: Extend `patternBarIndices` tests** for Evening Star `[i-2,i-1,i]`, Piercing Line / Dark Cloud Cover / Harami / Tweezer Top `[i-1,i]`, Three White Soldiers / Three Black Crows `[i-2,i-1,i]`.

- [x] **Step 3: Run to confirm RED**

Run: `npx tsx --test src/lib/patternScan.test.ts`  
Expected: FAIL — Hanging Man / Evening Star / Piercing Line missing (not a syntax error).

---

### Task 2: Detectors

**Files:**
- Modify: `src/lib/patternScan.ts`

**Interfaces:**
- Consumes: `OHLC[]`
- Produces: `scanPatterns` names that match Archive `PATTERNS[].name` exactly

- [x] **Step 1: Helpers** (after existing `isMorningStar`)

```ts
function closeTrend(data: OHLC[], i: number, lookback = 2): "up" | "down" | "flat" {
  if (i < 1) return "flat";
  const from = Math.max(0, i - lookback);
  const a = data[from]!.close;
  const b = data[i - 1]!.close;
  const thresh = Math.max(Math.abs(a) * 0.002, 1);
  if (b - a > thresh) return "up";
  if (a - b > thresh) return "down";
  return "flat";
}

function bodyLow(c: OHLC): number {
  return Math.min(c.open, c.close);
}
function bodyHigh(c: OHLC): number {
  return Math.max(c.open, c.close);
}
function isGreen(c: OHLC): boolean {
  return c.close >= c.open;
}
function isRed(c: OHLC): boolean {
  return c.close < c.open;
}
```

Keep `isHammer` geometry as the lower-wick silhouette. In `scanPatterns`: if silhouette and trend `down` → Hammer; if silhouette and trend `up` → Hanging Man; skip on `flat`.

Split `isShootingStar` the same way: `up` → `"Shooting Star"`; `down` → `"Inverted Hammer"`. Stop emitting `"Shooting Star / Inverted Hammer"` on new scans. Leave `patternDefForScanName` special-case for the old string.

Add `isEveningStar`, `isPiercingLine`, `isDarkCloudCover`, `isThreeWhiteSoldiers`, `isThreeBlackCrows`, `isHarami`, `isTweezerTop`, `isTweezerBottom`.

Rules (SAMPLE geometry, not LIVE fills):

- Evening Star at `i`: bar `i-2` large green, `i-1` small body, `i` large red; red close below midpoint of first body.
- Piercing Line at `i`: prior red, current green, open below prior low (or prior close), close into prior body past midpoint, **not** a full engulf.
- Dark Cloud Cover: inverse of piercing; **not** a full bearish engulf.
- Soldiers / crows: three consecutive same-color bodies, each close beyond the prior close, body/range ≥ 0.4; emit on the third bar.
- Harami: current body strictly inside prior body; skip if engulfing already matched.
- Tweezer Top: consecutive highs within `max(|h| * 0.001, 1)` after `up` trend. Tweezer Bottom: consecutive lows after `down`.

Emit engulfing **before** piercing/cover so full-cover tapes never get the weaker name.

- [x] **Step 2: `patternBarIndices`** — Evening Star and soldiers/crows = three bars; piercing, cover, harami, tweezers = two bars.

- [x] **Step 3: Run tests GREEN**

Run: `npx tsx --test src/lib/patternScan.test.ts`  
Expected: PASS.

---

### Task 3: Hunt tapes

**Files:**
- Modify: `src/lib/practiceLabs.ts` `HUNT_TAPES`

- [x] **Step 1: Append tapes** whose `scanPatterns` returns ≥1 hit: `hunt-hanging-man`, `hunt-evening-star`, `hunt-piercing-line`, `hunt-dark-cloud-cover`, `hunt-three-white-soldiers`, `hunt-three-black-crows`, `hunt-harami`, `hunt-tweezer-top`, `hunt-tweezer-bottom`. Use `PATTERN_OHLC[id]`. Keep `hunt-hammer` and `hunt-doji`.

- [x] **Step 2: Add a hunt test** that `gradeHunt` on the hanging-man tape is `correct` at the Hanging Man index.

Run: `npx tsx --test src/lib/practiceLabs.test.ts`  
Expected: PASS. Existing SAMPLE_OHLC hunt at index 3 still `correct`.

---

### Task 4: Lookalike lab

**Files:**
- Modify: `src/lib/practiceLabs.ts`, `src/lib/practiceLabs.test.ts`, `src/lib/miscPractices.ts`, `src/App.tsx`
- Create: `src/pages/practice/Lookalike.tsx`

**Produces:** `LOOKALIKE_ROUNDS`, `gradeLookalike(roundId, pick)`, route `/practice/lookalike`

- [x] **Step 1: Failing tests** for `gradeLookalike("hm-vs-hammer", "B")` correct and `"A"` incorrect (round: A=hammer, B=hanging-man).

- [x] **Step 2: Author ≥8 rounds** (chartKey pairs from `PATTERN_OHLC`): hanging-man vs hammer, evening-star vs morning-star, piercing-line vs bullish-engulfing, dark-cloud-cover vs bearish-engulfing, harami vs engulfing, three-white-soldiers vs morning-star, tweezer-top vs double-top, falling-wedge vs triangle. SAMPLE copy; no LIVE.

- [x] **Step 3: Page** — PracticeShell, round picker, two `CandlestickChart`s, A/B submit, `markMiscPracticeDone("lookalike")`.

- [x] **Step 4: Hub + route** — append `{ id: "lookalike", title: "Lookalikes", to: "/practice/lookalike" }`. Update catalog test. Wire `App.tsx`.

---

### Task 5: Invalidation lab

**Produces:** `/practice/invalidation`, `INVALIDATION_ROUNDS`, `gradeInvalidation(roundId, price)`

- [x] **Step 1: Failing test** — hanging-man round: price at/under the hanging low (`62800` ± 80) is `correct`; a price in the small body is `incorrect`.

- [x] **Step 2: Rounds** (≥6) using `PATTERN_OHLC` + a `[low, high]` band: hanging-man (under wick low), evening-star (reclaim of first green high), piercing-line (lose the shared decline low), three-white-soldiers (undercut first soldier low), tweezer-top (break the matched high), head-shoulders (new high above the head). Tips in learner language.

- [x] **Step 3: Page** — chart `onSelectPrice`, submit, `markMiscPracticeDone("invalidation")`. Hub title `Invalidation`.

---

### Task 6: Levels lab

**Produces:** `/practice/levels`, `LEVEL_ROUNDS`, `gradeLevel(roundId, price)`

- [x] **Step 1: Failing test** — tweezer-bottom matched low `62800` ± 80 is `correct`.

- [x] **Step 2: Rounds** (≥6): tweezer-bottom support, tweezer-top resistance, double-bottom support, double-top resistance, piercing-line reclaim zone (into prior red body), dark-cloud-cover cover zone (into prior green body).

- [x] **Step 3: Page** — `onSelectPrice`, hub title `Support and resistance`.

---

### Task 7: Verify

- [x] `npx tsx --test src/lib/patternScan.test.ts src/lib/practiceLabs.test.ts`
- [x] `npm run lint && npm run build`
- [x] Browser: `/practice/lookalike` submit a correct pick; `/practice/invalidation` tap a band; `/practice/hunt` hanging-man tape; `/practice/levels` tweezer support. Leave 3001 alone.
- [x] Do not commit unless asked.

# Drain echo leftovers (multi-guide Draw) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove multi-guide Practice Draw (candles plus structure lines), then drain leftover pattern echo: draw templates, `PATTERN_OHLC`, Learn family groups (≥6 each) for the six leftover Archive patterns, then unique-ify shared Cases `TECH_PRE` / `CYCLICAL_PRE` tapes.

**Architecture:** Extend `practiceDraw.ts` with a trendline stroke helper; templates stay `guides: Stroke[]` so Jaccard grading and the canvas dash renderer do not change. Add distinct OHLC in `ohlcData.ts`. Append family questions to `QUIZ_QUESTIONS` and register groups. Replace shared case pre tapes with named series that are not scaled clones.

**Tech Stack:** TypeScript, Vite + React SPA. Verify: `npm run lint` && `npm run build`. Leave `npm run dev` on 3001 alone.

## Global Constraints

- SAMPLE / STYLIZED / educational only. No LIVE / brokerage / paid APIs.
- Options = context only (no chain, no Greeks).
- Equities Beginner unlocks unchanged. New Learn groups stay off the Beginner `trainingGroup` spine.
- Draw coords 0–1. Storage key `analysis_core_practice_draw_v1` unchanged.
- Distinct OHLC shapes: do not `scale()` clones.
- Do not invent `/practice/...` routes (Practice Phase D).
- Do not commit unless the human asks.

## Files

- Modify: `src/lib/practiceDraw.ts` — `structureLine` helper, `DrawTemplateId` union, templates
- Modify: `src/lib/ohlcData.ts` — six leftover `PATTERN_OHLC` series
- Modify: `src/lib/quizData.ts` — `PatternId`, `QuizGroupId`, `QUIZ_GROUPS`, family questions
- Modify: `src/lib/caseStudies.ts` — unique pre tapes instead of shared `TECH_PRE` / `CYCLICAL_PRE`

---

### Task 1: Prove multi-guide Draw

**Files:**
- Modify: `src/lib/practiceDraw.ts`

**Interfaces:**
- Consumes: `candleGuide`, `Stroke`, `DrawTemplate`
- Produces: `structureLine(color, points)` plus `falling-wedge` template (candles + two converging trendlines)

- [x] **Step 1: Add helper after `engulfingGuides`**

```ts
function structureLine(color: BrushColor, points: Array<{ x: number; y: number }>): Stroke {
  return { color, points };
}
```

- [x] **Step 2: Extend `DrawTemplateId` with leftover + prove ids**

`falling-wedge` | `tweezer-top` | `tweezer-bottom` | `rising-wedge` | `bull-flag` | `double-top` | `double-bottom` | `triangle` | `head-shoulders` | `hanging-man` | `evening-star` | `piercing-line` | `dark-cloud-cover` | `three-white-soldiers` | `three-black-crows` | `harami`

- [x] **Step 3: Append templates** — falling-wedge first (structure proof), then leftover six, then remaining candle silhouettes listed above. Each uses `candleGuide` and, for wedges/flag/doubles/triangle/H&S, `structureLine` for trend/neck lines. Tips in learner language; SAMPLE honesty. `openingBrush` = first candle color.

- [x] **Step 4: Verify** `npm run lint && npm run build`. `/practice-draw` picker lists the new names. Deep link `?template=triangle` loads.

---

### Task 2: PATTERN_OHLC for leftover six

**Files:**
- Modify: `src/lib/ohlcData.ts`

**Produces:** keys `tweezer-bottom`, `rising-wedge`, `bull-flag`, `double-top`, `double-bottom`, `triangle` (and `tweezer-top` if missing). Distinct 6–8 bar stories, not clones of hammer/falling-wedge.

- [x] **Step 1: Add OHLC consts + `PATTERN_OHLC` entries.** Highlight-friendly: tweezer on last two bars; structures readable across the window.

- [x] **Step 2: Verify** lint + build.

---

### Task 3: Learn family groups (floor ≥6)

**Files:**
- Modify: `src/lib/quizData.ts`

**Produces:** `QuizGroupId` + `QUIZ_GROUPS` + `PatternId` for the six leftover ids. Six questions each: chart-pick → identify/describe → `*-MOVE` last (`familyDrillOrder`). Unique ids `PR-TB-*` `PR-RW-*` `PR-BF-*` `PR-DT-*` `PR-DB-*` `PR-TR-*`.

Do **not** add these ids to `QUIZ_GROUP_ASSET_CLASS` (they stay free extra drills).

- [x] **Step 1: Extend unions and `QUIZ_GROUPS` after `morning-star`.**
- [x] **Step 2: Append 36 questions to `QUIZ_QUESTIONS`.** Chart-picks use `chartPickOptions` with the new `PATTERN_OHLC` keys vs existing distractors.
- [x] **Step 3: Verify** lint + build. Training group chips show counts ≥6.

---

### Task 4: Unique Cases tapes (leftover clones)

**Files:**
- Modify: `src/lib/caseStudies.ts`

Replace each remaining `preOhlc: TECH_PRE` / `CYCLICAL_PRE` with a named series whose shape is not a scalar of those two (grind vs fade vs gap vs chop vs dump). Keep `withAftermath` for posts. Do not change `correctActions`, briefs, or unlocks.

- [x] **Step 1: Add named PRE arrays; re-point cases.**
- [x] **Step 2: Verify** lint + build. `/cases` still lists titles.

---

### Task 5: Browser drain check

- [ ] `/practice-draw` — falling-wedge (lines visible), triangle, tweezer-bottom
- [ ] `/training?group=triangle&start=1` — chart-pick loads
- [ ] `/training?group=tweezer-bottom&start=1`
- [ ] Leave 3001 `npm run dev` alone

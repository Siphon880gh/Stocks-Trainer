# Drain leftover coverage queues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship every leftover item named after the content-graph audit: six Archive patterns, three SAMPLE chart packs, two Coach sessions, and Home tips that name those Coach titles.

**Architecture:** Content-only drain in the existing registries. Archive appends `PATTERNS` rows (no new SVGs). Charts appends distinct OHLC packs in `samplePacks.ts` / `markets.ts` so Market class maps pick them up. Coach adds two validated decision graphs and registers them. Home copy in `learningPaths.ts` names the new session titles. No unlock, schema, or route changes.

**Tech Stack:** TypeScript, Vite + React SPA, `npm run lint` (`tsc --noEmit`), `npm run build`, `npm run test:coaching`. Leave `npm run dev` on port 3001 alone.

## Global Constraints

- SAMPLE / STYLIZED / educational only. No LIVE / REAL_TIME theater. No brokerage. No paid API keys.
- Options = educational context only (no chain, no Greeks engine).
- Equities remain the traditional retail path. Do not replace Beginner Equities unlocks.
- Distinct OHLC shapes: do not clone-and-rescale existing series.
- Do not invent `public/patterns/*.svg` binaries; skip `image` on new pattern rows.
- Do not add Practice Phase D routes (LOOP-Practice: no new `/practice/...` unless a named route is requested).
- Do not commit unless the human asks.
- Verify with `npm run lint` && `npm run build`; add `npm run test:coaching` after Coach files change.

## Files

- Modify: `src/lib/patterns.ts` — six `PatternDef` rows
- Modify: `src/lib/samplePacks.ts` — `eq-fail-rally`, `eq-div-cut` OHLC + packs
- Modify: `src/lib/markets.ts` — `CHOP_FAIL_CRYPTO_OHLC` + `crypto-chop-fail` pack
- Create: `src/lib/coaching/sessions/short-vs-sell.ts`
- Create: `src/lib/coaching/sessions/futures-roll.ts`
- Modify: `src/lib/coaching/sessions/index.ts` — register both
- Modify: `src/lib/learningPaths.ts` — company-news + futures `coachTip` lines

---

### Task 1: Archive leftover patterns

**Files:**
- Modify: `src/lib/patterns.ts` after `tweezer-top`

**Interfaces:**
- Consumes: `PatternDef` (`id`, `name`, `type`, `sentiment`, `confirmation`, `description`)
- Produces: ids `tweezer-bottom`, `rising-wedge`, `bull-flag`, `double-top`, `double-bottom`, `triangle`

- [x] **Step 1: Append the six rows** (no `image`)

```ts
  { id: "tweezer-bottom", name: "Tweezer Bottom", type: "reversal", sentiment: "bullish", confirmation: "medium", description: "Two candles share a similar low after a decline—matched support on SAMPLE tapes. Wait for the next print." },
  { id: "rising-wedge", name: "Rising Wedge", type: "reversal", sentiment: "bearish", confirmation: "medium", description: "Price rises inside two upward, converging lines. SAMPLE read: buying is tiring; a break of the lower line needs later bars." },
  { id: "bull-flag", name: "Bull Flag", type: "continuation", sentiment: "bullish", confirmation: "medium", description: "A sharp rise, then a tight downward or sideways pause. SAMPLE read: the pause can be a rest, not a new downtrend, if the prior thrust was clean." },
  { id: "double-top", name: "Double Top", type: "reversal", sentiment: "bearish", confirmation: "high", description: "Two similar highs with a dip between them. SAMPLE read: the second high failed to break out; a break of the dip is the usual confirmation." },
  { id: "double-bottom", name: "Double Bottom", type: "reversal", sentiment: "bullish", confirmation: "high", description: "Two similar lows with a bounce between them. SAMPLE read: the second low held; a break of the bounce high is the usual confirmation." },
  { id: "triangle", name: "Triangle", type: "neutral", sentiment: "neutral", confirmation: "low", description: "Highs and lows squeeze toward a point. SAMPLE read: direction is not the triangle itself—wait for which side breaks, then the next print." },
```

- [x] **Step 2: Verify**

Run: `npm run lint && npm run build`  
Expected: exit 0. Archive Patterns tab can list all six ids.

---

### Task 2: Equity leftover chart packs

**Files:**
- Modify: `src/lib/samplePacks.ts` after `SQUEEZE_OHLC` / `EQUITY_SAMPLE_PACKS`

**Interfaces:**
- Consumes: `bar`, `withBarLabels`, `RTH_BAR_LABELS_12`, `SamplePack`
- Produces: packs `eq-fail-rally` (`PFE.S`) and `eq-div-cut` (`T.S`)

- [x] **Step 1: Add failed-rally OHLC** — run up, then fail back through the bounce (≠ gap-and-go hold, ≠ cyclical dump-then-recover)

```ts
const FAIL_RALLY_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 28.4, 28.8, 28.1, 28.6),
    bar("t1", 28.6, 29.2, 28.4, 29.0),
    bar("t2", 29.0, 29.8, 28.8, 29.6),
    bar("t3", 29.6, 30.4, 29.4, 30.2),
    bar("t4", 30.2, 30.8, 29.9, 30.0),
    bar("t5", 30.0, 30.3, 29.2, 29.4),
    bar("t6", 29.4, 29.7, 28.6, 28.8),
    bar("t7", 28.8, 29.0, 28.0, 28.2),
    bar("t8", 28.2, 28.5, 27.4, 27.6),
    bar("t9", 27.6, 27.9, 27.0, 27.2),
    bar("t10", 27.2, 27.5, 26.6, 26.8),
    bar("t11", 26.8, 27.1, 26.3, 26.5),
  ],
  RTH_BAR_LABELS_12
);
```

- [x] **Step 2: Add dividend-cut OHLC** — slow grind, then a gap-down that stays offered (≠ fail-rally staircase, ≠ cyclical bounce)

```ts
const DIV_CUT_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 16.8, 17.0, 16.6, 16.9),
    bar("t1", 16.9, 17.1, 16.7, 16.8),
    bar("t2", 16.8, 17.0, 16.6, 16.7),
    bar("t3", 16.7, 16.9, 16.5, 16.6),
    bar("t4", 16.6, 16.8, 16.4, 16.5),
    bar("t5", 15.2, 15.4, 14.6, 14.8),
    bar("t6", 14.8, 15.0, 14.3, 14.5),
    bar("t7", 14.5, 14.7, 14.1, 14.3),
    bar("t8", 14.3, 14.6, 14.0, 14.2),
    bar("t9", 14.2, 14.4, 13.8, 14.0),
    bar("t10", 14.0, 14.2, 13.7, 13.9),
    bar("t11", 13.9, 14.1, 13.6, 13.8),
  ],
  RTH_BAR_LABELS_12
);
```

- [x] **Step 3: Append packs**

```ts
  {
    id: "eq-fail-rally",
    symbol: "PFE.S",
    assetClass: "equity",
    displayName: "Failed Rally Pharma (SAMPLE)",
    ohlc: FAIL_RALLY_OHLC,
    educationalNotes:
      "SAMPLE single-name: a rally that fails and gives back the thrust. Distinct from gap-and-go hold and cyclical dump-then-bounce. STYLIZED — not a live feed.",
  },
  {
    id: "eq-div-cut",
    symbol: "T.S",
    assetClass: "equity",
    displayName: "Dividend-Cut Telco (SAMPLE)",
    ohlc: DIV_CUT_OHLC,
    educationalNotes:
      "SAMPLE income name: quiet grind, then a gap lower that stays offered. Educational tape for a payout-cut shape — STYLIZED, not a live feed.",
  },
```

- [x] **Step 4: Verify**

Run: `npm run lint && npm run build`  
Expected: exit 0. `/market?class=equity` lists both display names via `EQUITY_MARKETS`.

---

### Task 3: Crypto leftover chart pack

**Files:**
- Modify: `src/lib/markets.ts` after `DUMP_CRYPTO_OHLC` / inside `LEGACY_CRYPTO_PACKS`

**Interfaces:**
- Consumes: `ohlc`, `withBarLabels`, `SESSION_24H_LABELS_12`, `SamplePack`
- Produces: pack `crypto-chop-fail` (`CHOP`)

- [x] **Step 1: Chop-then-fail OHLC** — tight range, upside probe, fail back into/below the range (≠ alt breakout that holds, ≠ dump-no-reclaim)

```ts
const CHOP_FAIL_CRYPTO_OHLC: OHLC[] = withBarLabels(
  [
    ohlc("t0", 2.40, 2.46, 2.36, 2.42),
    ohlc("t1", 2.42, 2.48, 2.38, 2.44),
    ohlc("t2", 2.44, 2.50, 2.40, 2.43),
    ohlc("t3", 2.43, 2.49, 2.39, 2.45),
    ohlc("t4", 2.45, 2.51, 2.41, 2.46),
    ohlc("t5", 2.46, 2.68, 2.44, 2.64),
    ohlc("t6", 2.64, 2.72, 2.58, 2.60),
    ohlc("t7", 2.60, 2.63, 2.48, 2.50),
    ohlc("t8", 2.50, 2.54, 2.40, 2.42),
    ohlc("t9", 2.42, 2.46, 2.34, 2.36),
    ohlc("t10", 2.36, 2.40, 2.28, 2.32),
    ohlc("t11", 2.32, 2.36, 2.24, 2.28),
  ],
  SESSION_24H_LABELS_12
);
```

- [x] **Step 2: Append pack**

```ts
  {
    id: "crypto-chop-fail",
    symbol: "CHOP",
    assetClass: "crypto",
    displayName: "Chop, Failed Break (SAMPLE)",
    ohlc: CHOP_FAIL_CRYPTO_OHLC,
    educationalNotes:
      "SAMPLE crypto: range, upside probe, then fail back through the range. Distinct from alt chop-then-break and dump-no-reclaim. Browse/drill only — not Beginner Equities Path, not LIVE.",
  },
```

- [x] **Step 3: Verify**

Run: `npm run lint && npm run build`  
Expected: exit 0. `/market?class=crypto` lists Chop, Failed Break. `CRYPTO_MARKETS` maps `CHOP/USDT` automatically.

---

### Task 4: Coach short vs sell

**Files:**
- Create: `src/lib/coaching/sessions/short-vs-sell.ts`
- Modify: `src/lib/coaching/sessions/index.ts`

**Interfaces:**
- Consumes: `CoachingSession` from `../types`
- Produces: `shortVsSellSession` / `export default`, slug `short-vs-sell`, tags include `equities` and `company-news`

Follow `.agents/skills/add-coaching-session/SKILL.md`: `start` + ≥2 continue layers, ≥2 `wrong` with `rewind_to`, ≥1 `success`, sentence labels.

- [x] **Step 1: Write the session**

```ts
import type { CoachingSession } from "../types";

export const shortVsSellSession: CoachingSession = {
  meta: {
    slug: "short-vs-sell",
    title: "Short versus sell",
    summary:
      "Sell closes a long you already have. Short is a new bet that price falls. Do not short a rumor.",
    topic: "Company news decisions",
    tags: ["equities", "company-news", "short", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: you do not own the stock. A launch product is recalled after a crowded run.\n\nWhat is the first distinction?",
        outcome: "continue",
        choices: [
          {
            label: "Sell and short mean the same thing — both are just downside",
            next: "wrong_same",
          },
          {
            label: "Sell exits a long you have; short is a new downside bet",
            next: "own",
          },
          {
            label: "Short every recall because price always gaps and stays down",
            next: "wrong_always",
          },
        ],
      },
      wrong_same: {
        message:
          "They are not the same. Sell needs shares you already hold. Short opens risk that can grow if the stock rips back.\n\nReturn to the first distinction.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_always: {
        message:
          "A recall is a fact, but “always” skips size and bounce risk. Process starts with own-vs-not-own.\n\nReturn to the first distinction.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      own: {
        message:
          "You do not own shares. Chat also has an unconfirmed CEO rumor on a different name.\n\nWhen is short the process answer?",
        outcome: "continue",
        choices: [
          {
            label: "Short the CEO rumor because chat is loud",
            next: "wrong_rumor",
          },
          {
            label: "Short only when a filed fact broke the thesis; hold if you refuse short risk",
            next: "success",
          },
        ],
      },
      wrong_rumor: {
        message:
          "A rumor without a filing is not an automatic short. Cases → company news (short vs sell) teaches that trap.\n\nRevisit when short is process.",
        outcome: "wrong",
        choices: [],
        rewind_to: "own",
      },
      success: {
        message:
          "Session complete. You separated sell from short, and rumor from filing.\n\nNext: Cases → company news (short vs sell).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default shortVsSellSession;
```

- [x] **Step 2: Register** in `COACHING_SESSION_MODULES` after `newsLiteracySession` (import `shortVsSellSession` from `./short-vs-sell`).

- [x] **Step 3: Verify**

Run: `npm run test:coaching && npm run lint && npm run build`  
Expected: 16 tests pass; `/coach/short-vs-sell` loads.

---

### Task 5: Coach futures roll literacy

**Files:**
- Create: `src/lib/coaching/sessions/futures-roll.ts`
- Modify: `src/lib/coaching/sessions/index.ts`

**Interfaces:**
- Consumes: `CoachingSession`
- Produces: `futuresRollSession`, slug `futures-roll`, tags include `futures`

This is the optional second futures tree (roll / contango / backwardation). Distinct from `futures-framing`.

- [x] **Step 1: Write the session**

```ts
import type { CoachingSession } from "../types";

export const futuresRollSession: CoachingSession = {
  meta: {
    slug: "futures-roll",
    title: "Contango, backwardation, and the roll",
    summary:
      "Name SAMPLE futures structure before guessing ticks. Contango and backwardation are costs to know, not automatic trades.",
    topic: "Multi-market decisions",
    tags: ["futures", "roll", "multi-market", "sample"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE crude future: the front month is richer than the next month (contango). A roll window is near.\n\nWhat is contango here?",
        outcome: "continue",
        choices: [
          {
            label: "A live calculator that tells you the exact roll profit",
            next: "wrong_calc",
          },
          {
            label: "A structure: front month costs more than the next month",
            next: "structure",
          },
          {
            label: "An automatic sell signal on every commodity future",
            next: "wrong_auto_sell",
          },
        ],
      },
      wrong_calc: {
        message:
          "This app has no live roll calculator, fills, or brokerage. Structure first.\n\nReturn to what contango is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_auto_sell: {
        message:
          "Contango is a cost to name, not an automatic sell. Time frame still rules.\n\nReturn to what contango is.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      structure: {
        message:
          "The next SAMPLE tape is backwardation: the front month is cheaper than the next.\n\nHow do you treat the roll?",
        outcome: "continue",
        choices: [
          {
            label: "Treat backwardation as an automatic buy and skip the brief",
            next: "wrong_auto_buy",
          },
          {
            label: "Name the structure, then decide if your time frame cares about the roll",
            next: "success",
          },
        ],
      },
      wrong_auto_buy: {
        message:
          "Backwardation is also a structure, not a buy button. Revisit how you treat the roll.",
        outcome: "wrong",
        choices: [],
        rewind_to: "structure",
      },
      success: {
        message:
          "Session complete. You named contango and backwardation without inventing a live desk.\n\nNext: Cases → futures (roll / structure briefs).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default futuresRollSession;
```

- [x] **Step 2: Register** `futuresRollSession` from `./futures-roll`.

- [x] **Step 3: Verify**

Run: `npm run test:coaching && npm run lint && npm run build`  
Expected: exit 0. `/coach?class=future` lists this session.

---

### Task 6: Home tips name the new Coach titles

**Files:**
- Modify: `src/lib/learningPaths.ts`

**Interfaces:**
- Consumes: existing `coachTip` strings on `E5.M2` (both paths) and `E10.M5`
- Produces: tips that name **Short versus sell** and **Contango, backwardation, and the roll**

- [x] **Step 1: Beginner + Decision Maker company-news tips** — keep existing Cases / chase-vs-fade sentences; append Coach → Short versus sell.

- [x] **Step 2: Market Explorer futures tip** — append Coach → Contango, backwardation, and the roll.

- [x] **Step 3: Verify**

Run: `npm run lint && npm run build`  
Expected: exit 0. Home Coach line names the titles after path confirm.

---

### Task 7: Browser drain check

- [x] **Step 1:** `/archive` Patterns tab shows the six new names.
- [x] **Step 2:** `/market?class=equity` shows Failed Rally Pharma and Dividend-Cut Telco.
- [x] **Step 3:** `/market?class=crypto` shows Chop, Failed Break.
- [x] **Step 4:** `/coach/short-vs-sell` happy path to success.
- [x] **Step 5:** `/coach?class=future` shows the roll session; open `/coach/futures-roll`.
- [x] **Step 6:** Leave `npm run dev` on 3001 alone.

---

## Out of scope

- Practice Phase D new `/practice/...` routes (no named route in the leftover list).
- New pattern SVGs, scanner detection, Learn family banks, or draw templates for wedges / flags / doubles.
- Git commit / PR unless the human asks.

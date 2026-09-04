# Drain remaining pattern-echo families Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the pattern echo queue: `PATTERN_OHLC` plus Learn family groups (≥6 questions) for every remaining Archive pattern that already has a Practice Draw template.

**Architecture:** Add missing OHLC series in `ohlcData.ts`. Extend `PatternId` / `QuizGroupId` / `QUIZ_GROUPS` and append family questions to `QUIZ_QUESTIONS` (chart-pick → describe/name → `*-MOVE` last). Groups stay off the Beginner `trainingGroup` spine and off `QUIZ_GROUP_ASSET_CLASS`.

**Tech Stack:** TypeScript, Vite + React. `npm run lint` && `npm run build`. Leave `npm run dev` on 3001 alone.

## Global Constraints

- SAMPLE / STYLIZED only. No LIVE / brokerage.
- Distinct OHLC (not scaled clones of hammer / morning-star / falling-wedge).
- Do not add Practice Phase D routes.
- Do not commit unless the human asks.

## Files

- Modify: `src/lib/ohlcData.ts`
- Modify: `src/lib/quizData.ts`

Ids (skip if group already exists): `hanging-man`, `evening-star`, `piercing-line`, `dark-cloud-cover`, `three-white-soldiers`, `three-black-crows`, `harami`, `tweezer-top`, `falling-wedge`, `head-shoulders`.

`tweezer-top`, `falling-wedge`, `head-shoulders` already have `PATTERN_OHLC` — questions only.

---

### Task 1: Missing PATTERN_OHLC

- [x] Add `HANGING_MAN_OHLC` (rally then long lower wick at the highs), `EVENING_STAR_OHLC` (green · small · red), `PIERCING_LINE_OHLC`, `DARK_CLOUD_COVER_OHLC`, `THREE_WHITE_SOLDIERS_OHLC`, `THREE_BLACK_CROWS_OHLC`, `HARAMI_OHLC`. Register kebab keys on `PATTERN_OHLC`.
- [x] `npm run lint && npm run build`

### Task 2: Ten Learn families

- [x] Extend `PatternId` and `QuizGroupId`; append `QUIZ_GROUPS` after `triangle`.
- [x] Six questions each (`PR-HM-*` `PR-ES-*` `PR-PL-*` `PR-DC-*` `PR-WS-*` `PR-BC-*` `PR-HA-*` `PR-TT-*` `PR-FW-*` `PR-HS-*`): PICK, DESC, NAME, MOVE, DESC2, MOVE2. SAMPLE process copy; no LIVE fills.
- [x] `npm run lint && npm run build`

### Task 3: Browser

- [x] `/training?group=hanging-man&start=1` chart-pick
- [x] `/training?group=falling-wedge&start=1`
- [x] `/training?group=head-shoulders&start=1`
- [x] Leave 3001 alone

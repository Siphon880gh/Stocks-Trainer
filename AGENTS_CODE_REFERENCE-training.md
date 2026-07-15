# AGENTS_CODE_REFERENCE-training.md

AI feature map: Training quizzes, scoring, Archive reference library.

**Approximate location cues are intentional.** Do not rely on exact line numbers.

**Parent:** [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md)  
**Related:** [`AGENTS_CODE_REFERENCE-charts.md`](./AGENTS_CODE_REFERENCE-charts.md) · [`AGENTS_CODE_REFERENCE-data.md`](./AGENTS_CODE_REFERENCE-data.md)

---

## Scope

| File | ~Lines | Role |
|------|--------|------|
| `src/lib/quizData.ts` | ~279 | Questions, groups, points constants |
| `src/pages/Training.tsx` | ~198 | Quiz launcher + session stats UI |
| `src/components/QuizModal.tsx` | ~320 | Question loop, submit/next, chart preview |
| `src/components/AnswerSheetModal.tsx` | ~162 | Review / jump into questions |
| `src/pages/Archive.tsx` | ~276 | Pattern + indicator library |
| `src/components/PatternDetailModal.tsx` | ~92 | Pattern detail |
| `src/components/IndicatorDetailModal.tsx` | ~93 | Indicator detail |

---

## Quiz data model (`quizData.ts`)

Near the top:
- `PatternId`, `QuizOption`, `QuizQuestion` (`correctAnswer` A–E; optional `patternKey`, `overlayId`, `highlightIndex`).
- Shared option banks: `OPTIONS_3`, `OPTIONS_5`, `INDICATOR_OPTIONS`.

Middle of file:
- `QUIZ_QUESTIONS` — candlestick recognition (uses `patternKey` + often `highlightIndex`).
- `INDICATOR_QUIZ_QUESTIONS` — identify which overlay is shown (`overlayId`).

Near the end:
- `POINTS_PER_CORRECT = 50`, `STREAK_BONUS = 10`.
- `QuizGroupId` / `QUIZ_GROUPS` — includes `"indicators"`, `"all"`, and per-pattern families.
- `getQuestionsForGroup(groupId)` — `"indicators"` → indicator bank; `"all"` → full pattern bank; else filter `patternKey === groupId`.
- Index helpers: `getQuestionIndexInGroup`, `getGlobalIndexFromGroup`.

---

## Training page flow

Near the top of `Training.tsx`:
- Reads `?group=` and `?start=1` from search params.
- State: selected group, quiz open, points/streak/accuracy (session only).
- `start=1` effect opens `QuizModal`.

UI (middle): group picker from `QUIZ_GROUPS`, launch quiz, answer sheet, links to Archive.

Deep link example: `/training?group=indicators&start=1`.

---

## QuizModal flow

Near the top: loads `questions = getQuestionsForGroup(groupId)`.

Submit handler (roughly first third): compare option to `correctAnswer`; update points/streak/accuracy; call `onPointsUpdate`.

Chart preview (middle/lower):
- If question has `overlayId` → `MarketChart` with that overlay enabled.
- Else → `CandlestickChart` with `PATTERN_OHLC[patternKey]` (fallback `SAMPLE_OHLC`) and `highlightIndex`.

Close on last “Next”; reset index when modal opens (`useEffect` near middle).

**Persistence:** None—parent `Training` holds session scores in memory.

---

## AnswerSheetModal

Lists questions for the active group; used to review or jump. Ties into Training’s answer-sheet open state.

---

## Archive

Near the top of `Archive.tsx`:
- Tabs: `patterns` | `indicators` (URL `?tab=indicators`).
- Deep-open indicator: `?open=<overlayId>`.
- Filters: pattern sentiment (bullish/bearish/neutral) or overlay category.

Renders cards from `PATTERNS` / `OVERLAYS`; opens `PatternDetailModal` or `IndicatorDetailModal`.

SVG art under `public/patterns/` referenced by some `PatternDef.image` paths.

---

## Code flow

```
Training (?group,&start)
  → getQuestionsForGroup
  → QuizModal
       → patternKey → PATTERN_OHLC → CandlestickChart
       → overlayId  → MarketChart (single overlay)
  → onPointsUpdate → Training header PTS / accuracy

Archive (?tab,&open) → PATTERNS / OVERLAYS → detail modals
```

---

## Safe-edit notes

- New pattern quiz: add OHLC pack in `ohlcData.PATTERN_OHLC`, optional `PATTERNS` entry, questions in `QUIZ_QUESTIONS`, and a `QUIZ_GROUPS` id if it needs its own family filter.
- New indicator quiz: ensure overlay id exists in `overlays.ts` + `MarketChart` can show it; add to `INDICATOR_QUIZ_QUESTIONS`.
- Do not assume scores survive refresh until E3 progress persistence lands.
- Keep `QuizGroupId` and `patternKey` strings aligned with `PATTERN_OHLC` keys.

---

> Refer to AGENTS_CODE_REFERENCE.md for high-level context; details are in feature context files.

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
- `QuizGroupId` / `QUIZ_GROUPS` — path groups (`equity-literacy`, `financial-literacy`, `indicators`, `news-literacy`, `financial-drills`) plus pattern families.
- `CANDLE_READING_QUESTIONS` (`candle-reading`, ids `OC-`) — one-candle reads (price rejected, stability, indecision, strong move). Series are `PATTERN_OHLC["candle-rejected-high"|"candle-rejected-low"|"candle-stable-*"|"candle-indecision-*"|"candle-bulls-win"|"candle-bears-win"]`, marked candle at index 3; glossary ids `wick-rejection`, `full-body-candle`, `indecision-candle`, `strong-move-candle`. Optional `priceMarkers` on a question draws labeled lines (e.g. Open / Close) on the hero chart.
- `PATTERN_BOOK_QUESTIONS` (`candle-pattern-book`, ids `PB-NN`) — reading rules from the candlestick pattern-book lessons (origin, real body, hollow/filled, prior trend, confirmation/invalidation, 50% rules, reversal vs continuation). Family drills for the book's extra patterns live in `QUIZ_QUESTIONS` (ids `PB-MARU-`, `PB-ST-`, `PB-BH-`, `PB-TIO-`, `PB-CA-`, `PB-CONT-`) and are grouped by `patternKeysForGroup`: `doji` (+`spinning-top`), `harami` (+`bearish-harami`), `marubozu`, `three-inside-outside`, `counterattack-on-neck`, `continuation-methods`.
- `src/lib/quizCandleExtras.ts` (type-only import of quiz types, no runtime cycle) — `EXTRA_FAMILY_QUESTIONS` is spread into the end of `QUIZ_QUESTIONS` (ids `PB-DJ-` doji types, `PB-MB-` opening/closing marubozu, `PB-GR-` kickers/abandoned babies/tri-stars, `PB-CS-` crows/three-line strike/breakaway, `PB-GC-` separating & side-by-side lines/gap three methods/bearish mat hold, `PB-NK-` in-neck/thrusting/meeting lines, `PB-IHS-` inverse H&S); `LONG_SHORT_CANDLE_QUESTIONS` (`OC-18`…`OC-22`) is spread into `CANDLE_READING_QUESTIONS`; `PRICE_ACTION_QUESTIONS` (`price-action`, ids `PA-`) and `SUPPLY_DEMAND_QUESTIONS` (`supply-demand`, ids `SD-`) are their own banks. Families added to `patternKeysForGroup`: `doji` (+5 doji types), `marubozu` (+4 opening/closing), `head-shoulders` (+`inverse-head-shoulders`), `counterattack-on-neck` (+`in-neck`, `thrusting`), `continuation-methods` (+7), new `gap-reversals`, `crows-and-strikes`.
- `src/lib/buySellDrill.ts` — `BUY_SELL_QUESTIONS` (`buy-or-sell`, ids `BS-P-<key>` confirmed patterns, `BS-W-` wait cases, `BS-SC-NN` scenario charts). Options are always A Buy / B Sell / C Wait; each wrong option carries `feedback` (shown as "Why not X" after a wrong pick); every explanation starts with the answer and ends with `BUY_SELL_DISCLAIMER`. Charts come from `DRILL_CHART_SPECS` in `ohlcData.ts` (`bs-<key>` = pattern + one confirming candle; `bs-<key>-open` = unconfirmed) and from `scenarioCharts.ts` (`sc-*`, 40–55 bars, seeded generator + pinned structure, `reveal` annotations and `plan` entry/stop/target at 1:2). Training has its own "Buy or Sell?" card below the quiz launcher.
- `src/lib/advancedPatterns.ts` (type-only imports, no runtime cycle) — one `ADVANCED_PATTERNS` table (harami crosses, morning / evening doji star, high-wave, rickshaw man, and the advanced / rare textbook patterns: stick sandwich, homing pigeon, ladder bottom, concealing baby swallow, unique three river bottom, advance block, deliberation, matching low, three stars in the south, identical three crows, takuri line, last engulfing bottom / top, above / below the stomach, bullish / bearish hikkake). It feeds `PATTERNS` (`ADVANCED_PATTERN_DEFS`, incl. triple top / bottom; `rare: true` shows the "Advanced / rare" tag in Archive and the pattern modal), `LITERACY_TERMS` (`ADVANCED_TERMS`, plus `triple-top`, `triple-bottom`, `wedge`, `belt-hold`, `harami-cross`, `doji-star`, `high-wave`, `advanced-rare-patterns`), `PATTERN_OHLC` / `DRILL_CHART_SPECS` (`ADVANCED_OHLC`, `ADVANCED_DRILL_SPECS`), the drill `INFO` table (`ADVANCED_DRILL_INFO`; rare rows say "advanced / rare" in the explanation) and `QUIZ_QUESTIONS` (`ADVANCED_QUESTIONS`: per pattern `-PICK` chart pick, `-NAME`, `-READ`; ids `AR-` rare, `PB-HC-` harami cross, `PB-DS-` doji stars, `PB-HW-` high-wave / rickshaw; plus `AR-CONCEPT-`, and `PB-BELT-` belt hold cross-linked to the opening marubozu). Group `advanced-rare` = `ADVANCED_RARE_KEYS`; the other entries join `harami`, `morning-star`, `evening-star`, `doji` via `familyKeys()`. To add a rare pattern, add one table row (and a rule in the validation script).
- Triple top / bottom and wedges: `scenarioCharts.ts` `sc-triple-top`, `sc-triple-bottom`, `sc-rising-wedge`, `sc-falling-wedge` (wedges carry both lines in `lines`); `PATTERN_OHLC` aliases `triple-top` / `triple-bottom`. Learn questions `PB-TT-`, `PB-TB-`, `PB-WG-R-`, `PB-WG-F-` (in `quizCandleExtras.ts`) join the `double-top`, `double-bottom` (now "Double & Triple Top / Bottom"), `rising-wedge`, `falling-wedge` groups; drill scenarios `BS-SC-14`…`17`.
- Question extras: `annotations` (always drawn), `revealAnnotations` (drawn only after submit; use for anything that gives the answer away), `chartSize: "large"` (380px hero + `SCENARIO_PAD_BARS` empty slots on the right). `QuizOption.feedback` is the why-wrong text. After submit, `QuizModal` always shows the correct answer line.
- Financials & earnings groups (`src/lib/financials/quizBanks.ts`, type-only import of quiz types): `statements-reading` (`FIN-ST-`), `cash-forecast-13wk` (`FIN-CF-`), `earnings-preview` (`FIN-EP-`), `earnings-reaction` (`FIN-ER-`). `FINANCIALS_QUIZ_GROUPS` is spread into `QUIZ_GROUPS` right after `financial-drills`; `isFinancialsQuizGroup` short-circuits `getQuestionsForGroup` / `questionsArrayForGroup`. Questions carry an optional `financialsExhibit` (`statement` / `forecast` / `preview` / `reaction`, type in `quizExhibit.ts`) that `QuizModal` renders with `components/financials/FinancialsQuizExhibit.tsx` before the snapshot branch; forecast breach tint / headroom and reaction teaching marks appear only after submit. All numbers are computed from the fixtures; `financialsQuiz.test.ts` recomputes every numeric answer. Training shows `FinancialsTrainingCard` (Read the Print, Statements lab, forecast, group links) above Misc Practices; routes `/practice/read-the-print` and `/practice/statements`.
- `getQuestionsForGroup(groupId)` — dedicated banks for literacy/drills/indicators; `"all"` → full pattern bank; else filter `patternKey === groupId`.
- Index helpers: `getQuestionIndexInGroup`, `getGlobalIndexFromGroup`.

---

## Training page flow

Near the top of `Training.tsx`:
- Reads `?group=` and `?start=1` from search params.
- State: selected group, quiz open; points/streak/accuracy seed from `progressStore`.
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

**Persistence:** `completeMilestoneFromQuiz` writes scores + milestone status to `analysis_core_progress_v1` (E3.M2). Parent `Training` also mirrors PTS in the header.

---

## AnswerSheetModal

Lists questions for the active group; used to review or jump. Ties into Training’s answer-sheet open state.

---

## Archive

Near the top of `Archive.tsx`:
- Tabs: `patterns` | `indicators` | `literacy` (URL `?tab=literacy`).
- Deep-open: `?open=<overlayId>` or a literacy term id.
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
- Quiz and case scores write to `analysis_core_progress_v1`. Do not rename that key without a migration.
- Keep `QuizGroupId` and `patternKey` strings aligned with `PATTERN_OHLC` keys.

---

> Refer to AGENTS_CODE_REFERENCE.md for high-level context; details are in feature context files.

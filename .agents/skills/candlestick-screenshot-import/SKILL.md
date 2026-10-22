---
name: candlestick-screenshot-import
description: >-
  Import candlestick, chart, gap or volume patterns from a screenshot or cheat sheet: extract the names,
  normalise typos, diff against the pattern registry, verify each against the textbooks, and add only the
  real missing patterns with full coverage (registry entry, three tabs, SIMULATED chart, Archive, flashcards,
  Learn questions, Buy-or-Sell drill, content-graph floors, tests). Never push.
---

# Candlestick screenshot import

Use when someone shares an image of patterns ("cheat sheet", poster, grid) and wants the app to cover them.
Read `AGENTS_CODE_REFERENCE.md`, `AGENTS_CODE_REFERENCE-charts.md` and `AGENTS_CODE_REFERENCE-training.md`
first, and follow the content-graph loop in `docs/projects/content-graph/LOOP-Graph.md`.

## 1. Extract and normalise
1. Read every image in full (zoom crops if text is small). List every label, cell by cell, with its section
   (bullish reversal, bearish continuation, volume, ...).
2. Normalise names: fix typos ("Marabozu" → Marubozu, "abandonyter" → abandoned baby, "Shonging Man" →
   hanging man), merge synonyms (window = gap; megaphone / expanding triangle = broadening; W / M shape =
   double bottom / top; round top = rounding top; pole & flag = flag; measuring gap = runaway gap),
   and drop duplicates (the same cell repeated in another row or image).
3. Drop colour-only variants: a "bullish / bearish spinning top" is one spinning top; colour does not change it.

## 2. Diff against the registry
Ids live in three places; check all of them before adding anything:
- `src/lib/patterns.ts` → `PATTERNS` (core and family patterns, plus the spreads below)
- `src/lib/advancedPatterns.ts` → `ADVANCED_PATTERNS` (harami crosses, doji stars, advanced / rare candles)
- `src/lib/chartPatternBook.ts` → `CHART_BOOK` (chart, gap, window, island and volume patterns)

Quick check (prints ids already present):
```bash
npx tsx -e "import {PATTERNS} from './src/lib/patterns.ts'; console.log(PATTERNS.map(p=>p.id).join(' '))"
```
Also grep glossary ids (`LITERACY_TERMS` in `src/lib/literacyTerms.ts`) and `PATTERN_OHLC` keys
(`src/lib/ohlcData.ts`) so a new id does not collide.

## 3. Verify against the textbooks
For each missing name, fetch a definition before writing anything:
- Candles: Nison (*Japanese Candlestick Charting Techniques*), Bulkowski (thepatternsite.com), StockCharts
  ChartSchool candlestick dictionary.
- Chart patterns and gaps: ChartSchool `chart-analysis/chart-patterns/*` (append `.md` to the URL for clean
  text, or use `https://chartschool.stockcharts.com/sitemap.md` to find pages), Bulkowski's pattern pages.
- Price-action names (e.g. three pushes): Al Brooks.
Rules:
- Teach the textbook form. If the image draws or labels a pattern wrongly, write the correct form in the app.
  Do not add a note about the image's mistake.
- A poster-only name goes in only with a credible published definition, marked as a less-standard term in
  its recognise text (`lessStandard: true` in `CHART_BOOK`). Otherwise skip it and give the reason in the report.
- Keep every "SIMULATED" label; never present a drawn chart as market data.

## 4. Add each real missing pattern (full coverage)
Pick the table that fits; both feed every surface automatically.

**Single to five candles** → add an entry to `ADVANCED_PATTERNS` in `src/lib/advancedPatterns.ts`
(`shape`, `read`, `stop`, `end`, `dir`, `lookalikes`, `confusers`, `glossaryLink`, `bars`). It generates
the Archive def (`ADVANCED_PATTERN_DEFS`), glossary (`ADVANCED_TERMS`), chart (`ADVANCED_OHLC`), drill
(`ADVANCED_DRILL_SPECS` / `ADVANCED_DRILL_INFO`) and Learn questions (`patternQuestions`). Add the id to a
family group in `patternKeysForGroup` (`src/lib/quizData.ts`) if it belongs there.

**Multi-bar chart, gap, window or volume pattern** → add an entry to `CHART_BOOK` in
`src/lib/chartPatternBook.ts`: `recognise` (3 lines), `psychology` (3 lines), `psy` (one line), `trade`
(confirmation / entry / stop / target), `stopAt`, `mark`, `end`, `dir`, two `lookalikes`, three `confusers`,
`source` (fetched URL) and `build` (swing `pivots`, `gaps`, `vol` waypoints, `spikes`, `lows`, `seed`).
Volume patterns also need `volumeRead`. That one entry produces:
- Archive: `CHART_BOOK_DEFS` → `PATTERNS`
- Glossary + flashcards: `CHART_BOOK_TERMS` → `LITERACY_TERMS` (Flashcards reads the glossary)
- SIMULATED chart with a volume pane: `CHART_BOOK_OHLC` → `PATTERN_OHLC` (`CandlestickChart showVolume`;
  `QuizModal` and `PatternDetailModal` turn the pane on only when the bars carry volume, so existing
  charts and the render snapshot stay unchanged)
- Three-tab detail: `patternTabs()` / `patternIllustration()` in `src/lib/patternTabs.ts`
- Buy-or-Sell drill: `CHART_BOOK_DRILL_SPECS` / `CHART_BOOK_DRILL_INFO` (directional patterns only)
- Learn group `chart-patterns`: five questions each, from `bookQuestions()` — identify (NAME), psychology
  (PSY), confirmation (CONF), stop/target (PLAN) and lookalike (PICK, or LOOK for volume patterns)

Core candle patterns with hand-written tabs live in `CORE_PATTERNS` (`src/lib/patternTabs.ts`); extend
those only for the core 14.

## 5. Tests and content-graph minimums
- Add a textbook rule for the new pattern in `RULES` (`src/lib/chartPatternBook.test.ts`) or a shape rule
  in `src/lib/japaneseCandles.test.ts` / the advanced tests. The rule must check the definition on the bars
  (gap clear of the prior high, flat top within 0.6%, volume ≥ 2× average, and so on).
- Raise the floor in `DEDICATED_FLOORS` (`src/lib/contentGraph.test.ts`) when the bank grows
  (`chart-patterns` ≥ 140 today); hero `patternKey`s must exist in `PATTERN_OHLC`.
- Run `npm run verify` (lint + all test suites + build) and
  `QA_SHOTS=<dir> PLAYWRIGHT_CORE=<path> npm run test:e2e`; take screenshots at 390 and 1280 of the Archive
  detail and the Learn group. Screenshots stay out of git (`.qa-shots/` is ignored).
- Never touch `dist/`. Stop any dev server you started.

## 6. Report (and never push)
Report an inventory table: image label → normalised name → status (already present / added / skipped and why),
plus files changed with `git diff --stat`, new files, test counts and screenshot paths. Commit only when asked;
never push.

## Checklist
- [ ] Every label from every image listed; typos normalised; duplicates and colour variants merged
- [ ] Each name diffed against `PATTERNS`, `ADVANCED_PATTERNS`, `CHART_BOOK`, glossary and `PATTERN_OHLC`
- [ ] Each new pattern verified against a fetched source; `source` set
- [ ] Wrong drawings or labels taught correctly (no "the image was wrong" notes)
- [ ] Entry added to the right table; tabs, chart, Archive, glossary, drill, five questions all appear
- [ ] Textbook rule test added and passing; content-graph floor updated
- [ ] README pattern counts and Learn group sizes updated
- [ ] `npm run verify` and e2e pass; screenshots at 390 and 1280 saved outside git
- [ ] Nothing committed unless asked; nothing pushed

## Common screenshot errors
- **Typos and doubled cells**: misspelled names and the same row repeated with different art.
- **Wrong drawing for the name**: triangles or wedges labelled "flag"; a V of candles labelled "rising
  window" (a window is one gap between two candles); a piercing line whose second candle does not open below
  the prior low or close above the midpoint.
- **Wrong section**: a rising wedge filed as a bullish reversal (it usually resolves down), a falling wedge
  as bearish, a hanging man with no prior rally.
- **Conflated patterns**: a triple bottom labelled "or rectangle" (a rectangle is a separate continuation
  range); a breakaway gap drawn mid-trend (that is a runaway gap).
- **Signals shown as certain**: single candles (doji, dragonfly, gravestone, hammer) drawn as reversals on
  their own; they need a confirming candle and a prior trend.
- **Made-up names**: labels with no published definition ("tweezer star", "trend stage bounce",
  "parallelogram", "step top") — skip them.
- **Volume art without a rule**: bars that look dramatic but no threshold; teach the measurable rule
  (e.g. breakout volume about twice the recent average).

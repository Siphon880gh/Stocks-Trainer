# Epics & Milestones: Financials, Expectations & Earnings Reactions

Charter: [`CHARTER.md`](./CHARTER.md) · Stories: [`STORIES.md`](./STORIES.md) · Progress: [`PROGRESS.md`](./PROGRESS.md) · Loop: [`LOOP-Financials-Earnings.md`](./LOOP-Financials-Earnings.md)

**Status key:** `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked (see PROGRESS.md). The loop flips the box on the milestone heading line and appends a PROGRESS.md entry.

**Every milestone's verification includes the base gate** (abbreviated **BASE** below):
`npm run lint` · `npm run test:coaching` · `npx tsx --test src/lib/*.test.ts` · `npm run test:financials` (after FE0.M1 adds it) · `npx vite build --outDir /tmp/st-build-check --emptyOutDir` then `rm -rf /tmp/st-build-check` (never touch `dist/`).

The tests named per milestone live in `src/lib/financials/**/*.test.{ts,tsx}` (node:test via tsx) and stay in the repo. Validators are tests, not throwaway scripts.

---

## Audit: what exists today

| Area | What exists | File(s) |
|------|-------------|---------|
| Statement snapshot | `FinancialSnapshot`: 3 numbers per statement (revenue / NI / margin; assets / liabilities / equity; CFO / FCF) + price / earnings for P/E. **2 base snapshots** plus variants inline in cases. | `src/lib/financialSnapshots.ts`, `components/FinancialSnapshotCard.tsx`, `components/FinancialsPanel.tsx` |
| Ratios | P/E-style earnings yield, Sharpe, volatility; `FAKE_FINANCIALS` constant | `src/lib/financials.ts` |
| Learn banks | `financial-literacy` (FL-, 12), `financial-drills` (FD-, 12, snapshot-based), `earnings-jargon` (EJ-, 29: into/after the print, whisper, beat-and-raise, sell the news, priced in, reaction function…), `news-literacy` (NL-, 12) | `src/lib/quizData.ts`, `src/lib/earningsJargon.ts` |
| Glossary | `earnings-season`, `guidance`, `free-cash-flow`, `net-margin`, `pe-ratio`, `priced-in`, `rumor-vs-filing`, `chase-vs-fade`, gap terms | `src/lib/literacyTerms.ts` |
| Decide-and-reveal cases | 13 `earnings` cases (beat/miss, margin compression, cash-flow red flag, guidance cut, balance-sheet stress…), plus `combined` and `company-news` packs. 6-bar pre chart → 3-bar aftermath, buy/sell/hold, process debrief. **No annotations, no volume, no expectations data, no gap mechanics.** | `src/lib/caseStudies.ts`, `pages/CasePlayer.tsx` |
| Coach | `earnings-beat-miss`, `earnings-guidance`, `earnings-margins`, `earnings-debt`, `statement-snapshot`, options `pre-event-chase` / `post-event` / `earnings-no-chain` | `src/lib/coaching/sessions/*` |
| Equity tapes | `eq-gap-go`, `eq-div-cut` (gap lower and leak), `eq-fail-rally` | `src/lib/samplePacks.ts` |
| Reveal infra | `CandlestickChart` annotations (levels, zones, trendlines, points), `padRightBars`, `revealAnnotations`, large charts, Buy-or-Sell drill, `scenarioCharts.ts` seeded generator + validators | `components/CandlestickChart.tsx`, `src/lib/chartAnnotations.ts`, `src/lib/scenarioCharts.ts`, `src/lib/buySellDrill.ts` |

**Gaps vs Weng's goal**
- (a) **Reading statements / projections:** no full IS / BS / CF line items, no multi-period columns, no EPS / share-count math, no working capital, no net debt, no burn / runway, **no 13-week cash forecast at all** (no "13-week", "runway", "burn", or "covenant" anywhere in `src/`), no KPIs, no consensus table, and no tie-out checks.
- (b) **Anticipating a report:** whisper / priced-in exist only as jargon. There are no consensus numbers, no guidance ranges, **no implied move** (zero hits), no run-up / positioning data, and no preview card.
- (c) **Aftermath on the chart:** case charts are 3 aftermath bars with no gap annotation, no gap fill, no volume, no PEAD, and no guidance-vs-headline teaching tied to the candles. `OHLC` has **no `volume` field**.
- **Game:** nothing that does "read statements + expectations → predict the reaction → reveal the annotated chart". Cases come closest but grade a buy/sell/hold, not the reaction, and they show no expectations.

---

## FE0 — Foundations (data model, tie-out math, test harness)

### [x] FE0.M1 — Types + tie-out library + `test:financials` script
- **Build:**
  - `src/lib/financials/types.ts`: `Company`, `FiscalPeriod`, `IncomeStatement`, `BalanceSheet`, `CashFlowStatement`, `Kpi`, `Guidance`, `Consensus`.
  - `src/lib/financials/ties.ts`: pure check functions that return a list of violations.
  - `package.json` script `"test:financials": "tsx --test \"src/lib/financials/**/*.test.{ts,tsx}\""` (confirm with a deliberately failing dummy test that the glob really picks files up, then delete the dummy).
- **Accept:** the tie functions cover the IS chain (GP, OI, pre-tax, NI, EPS basic/diluted), BS balance, CF sum = Δcash, CF ending cash = BS cash, and NI = CFO first line. Tolerance is an exact integer (store numbers in whole thousands).
- **Verify:** BASE. `ties.test.ts` has a hand-built good fixture that passes plus one broken fixture per rule, and each broken fixture produces exactly that violation.

### [x] FE0.M2 — Fictional company fixtures (3 archetypes × 8 quarters)
- **Build:** `src/lib/financials/companies.ts` with:
  - Northwind Cloud: SaaS, growing, cash burn, deferred revenue.
  - Harbor & Pine: retailer, inventory, Q4 seasonality.
  - Ironbridge Industrial: capex, term loan, covenant.

  Each company has 8 quarters generated deterministically from drivers (growth, margin, DSO / DIO / DPO, capex %, share count).
- **Accept:**
  - every period passes every FE0.M1 tie;
  - the quarter chain holds (opening BS cash = prior ending cash; retained earnings roll forward = prior + NI − dividends);
  - tickers end in `.S`, and names fail a blocklist of real large-cap names;
  - drivers produce the intended story (e.g. Northwind's FCF is negative in ≥ 6 of 8 quarters, Harbor & Pine's inventory peaks before Q4).
- **Verify:** BASE + `companies.test.ts`.

### [x] FE0.M3 — Derived metrics
- **Build:** `src/lib/financials/metrics.ts`:
  - margins (gross / operating / net);
  - YoY and QoQ growth;
  - EPS;
  - FCF = CFO − capex;
  - net debt;
  - current ratio;
  - DSO / DIO / DPO;
  - cash burn;
  - runway in months;
  - interest coverage;
  - leverage = net debt / TTM EBITDA.
- **Accept:** every metric has a doc comment with its formula, and division by zero returns `null` (rendered as "n/m").
- **Verify:** BASE + `metrics.test.ts` (hand-computed expectations for one quarter per company, the null cases, and that runway is `null` when FCF ≥ 0).

---

## FE1 — Statement reader

### [x] FE1.M1 — Income statement table component
- **Build:** `components/financials/IncomeStatementTable.tsx` (periods as columns, YoY delta column, margin sub-rows, optional `highlights: {row, period, note}[]` callout like "See it before you commit").
- **Accept:** renders from a `Company` with no data mutation; numbers are formatted ($k / $M, negatives in parentheses); highlights render a callout.
- **Verify:** BASE + `render.test.tsx` (`renderToStaticMarkup`; asserts row labels, a known cell value, and the callout text). Run via `tsx --test` (no browser).

### [x] FE1.M2 — Balance sheet + cash flow statement tables
- **Build:** `BalanceSheetTable.tsx` and `CashFlowTable.tsx` with the same props pattern; CF shows the CFO / CFI / CFF subtotals and the cash bridge.
- **Accept:** the BS shows the "Assets = Liabilities + Equity" check row (✓); the CF bridge row equals the BS cash.
- **Verify:** BASE + render tests (check rows present, ✓ for all fixtures).

### [x] FE1.M3 — Metrics panel + statement tabs
- **Build:** `StatementReader.tsx` with tabs IS / BS / CF / Metrics, using the FE0.M3 metrics and an "explain this line" glossary link per row.
- **Accept:** each row with a glossary id resolves to an existing `LITERACY_TERMS` id.
- **Verify:** BASE + test that every `glossaryId` used by the reader exists.

### [x] FE1.M4 — 🔍 HUMAN CHECKPOINT: reader visual review
- **Build:** the loop renders all readers to static HTML / screenshots (box headless Chrome or a local temp page) and stops.
- **Accept:** Weng signs off in PROGRESS.md (layout, density, readability).
- **Verify:** stop condition (a). Do not continue past this until it's signed.

---

## FE2 — 13-week cash flow forecast reader

### [x] FE2.M1 — Forecast model + validators
- **Build:** `src/lib/financials/cashForecast.ts`:
  - **Receipts:** collections, other receipts.
  - **Disbursements:** payroll, payables / inventory, rent & opex, marketing / ad spend, taxes, debt service (interest + principal), capex.
  - **Net and cash lines:** net cash flow, beginning cash, revolver draw / repay, ending cash.
  - **Covenant:** minimum cash covenant and headroom.
  - **Flags:** breach weeks, lowest week.
- **Accept:**
  - net = receipts − disbursements;
  - ending = beginning + net + draw − repay;
  - beginning[w+1] = ending[w];
  - headroom = ending − covenant;
  - breach flagged iff headroom < 0;
  - revolver never exceeds its limit.
- **Verify:** BASE + `cashForecast.test.ts` (the property loop over all fixtures plus broken fixtures).

### [x] FE2.M2 — Forecast fixtures (≥ 4)
- **Build:**
  1. **Level-1 replica** of Weng's image: 5 rows, week 9 Cash In 50k → 30k, Net 10k → −5k.
  2. Harbor & Pine collections slip (DSO stretch).
  3. Ironbridge payroll + debt-service collision breaching the covenant in week 7, fixed by a revolver draw.
  4. Northwind runway: steady burn, ending cash crosses the covenant in week 12.
- **Accept:** each fixture's documented "story" is asserted (e.g. the replica's week 9 net is −5k and the other weeks are 10k; the Ironbridge breach week is 7).
- **Verify:** BASE + fixture tests.

### [x] FE2.M3 — Forecast table component + what-if
- **Build:** `CashForecastTable.tsx`:
  - weeks 1–13 as columns;
  - grouped receipts / disbursements;
  - the bold Net row;
  - the cash bridge rows;
  - a covenant line, with breach cells tinted;
  - an optional callout pin ("See it before you commit").
- **What-if:** 2 toggles (delay collections by 1 week; defer capex), which recompute through the pure model.
- **Accept:** toggles never mutate fixtures; the recomputed result still passes FE2.M1 validators.
- **Verify:** BASE + render test + a what-if property test.

### [x] FE2.M4 — 🔍 HUMAN CHECKPOINT: forecast visual review
- Same procedure as FE1.M4.

---

## FE3 — Expectations & earnings preview

### [x] FE3.M1 — Earnings event model
- **Build:** `src/lib/financials/earningsEvents.ts` with `EarningsEvent` = company + quarter + `expect` + `actual` + `guidanceChange` + `reaction`.
  - **`expect`:** consensus EPS / revenue, whisper EPS, prior guidance range, KPI watch, implied move %, pre-event run-up %, positioning note.
  - **`actual`:** reported numbers taken from FE0 fixtures.
  - **`guidanceChange`:** `raise` | `maintain` | `cut`.
  - **`reaction`:** archetype id (FE4).
- **Accept:**
  - actual EPS / revenue equal the fixture quarter's values;
  - beat / miss labels are computed, not hand-typed;
  - implied move is between 2% and 20%;
  - the whisper, when present, sits on the same side of consensus as the event's story claims.
- **Verify:** BASE + `earningsEvents.test.ts`.

### [x] FE3.M2 — Preview card component
- **Build:** `EarningsPreviewCard.tsx` (consensus vs whisper, guidance range bar with the prior midpoint, KPI watch list, implied move ± band, run-up %). It has a `revealActuals` prop that adds actual vs expected with beat/miss chips.
- **Accept:** before reveal, nothing in the markup leaks the actuals.
- **Verify:** BASE + render test (pre-reveal markup contains no actual EPS string; post-reveal contains it).

### [x] FE3.M3 — Glossary terms (≥ 20)
- **Build:** at least these terms:
  - consensus estimate, whisper number (link the existing jargon), guidance raise / cut, beat-and-raise (link the existing one), KPI;
  - implied move, expected move vs actual, run-up / pre-earnings drift, positioning;
  - post-earnings announcement drift (PEAD), gap-and-go, gap fill, sell the news (link), volume spike;
  - gross / operating margin, EPS basic vs diluted, share count / dilution;
  - FCF (extend the existing term), working capital, DSO / DIO / DPO, net debt, leverage, interest coverage;
  - cash burn, runway, 13-week cash flow forecast, minimum cash covenant, revolver.
- **Accept:** ids are unique and every reader / preview `glossaryId` resolves.
- **Verify:** BASE + a terms test (count ≥ 20 new; no duplicate ids; every summary ≤ 140 chars).

---

## FE4 — Event reaction charts

### [x] FE4.M1 — Optional volume on OHLC + chart volume pane
- **Build:**
  - `OHLC.volume?: number`;
  - `CandlestickChart` gets an optional `showVolume` sub-pane (bars tinted by candle colour), off by default;
  - an `event` annotation type: a vertical line at the event index with a label.
- **Accept:** existing charts render byte-identically when `showVolume` is false (snapshot test on 3 existing keys).
- **Verify:** BASE + the snapshot test + `ohlcData.test.ts` still passes.

### [x] FE4.M2 — Reaction generator + 6 archetypes
- **Build:** `src/lib/financials/reactionCharts.ts` (seeded like `scenarioCharts.ts`): about 30 pre-event bars (drift or run-up), an event bar with a gap, and about 15 post bars, for each archetype:
  - `gap-and-go`
  - `gap-fill`
  - `sell-the-news`
  - `guidance-reversal` (headline beat, guide cut, gap up fails into a red close)
  - `pead-drift` (multi-day continuation)
  - `muted` (move inside the implied band)
- **Accept:** each event's chart is generated from its archetype + implied move.
- **Verify:** BASE + `reactionCharts.test.ts`, which checks per archetype:
  - |gap %| vs implied move (`muted` < implied; the others ≥ 0.8 × implied);
  - gap-fill touches the prior close within N bars;
  - sell-the-news closes the event bar below its open after a ≥ X% run-up;
  - PEAD's 10-bar return has the same sign as the gap;
  - event volume ≥ 3 × the 20-bar average;
  - no flat bars, and no unintended gaps outside the event bar.

### [x] FE4.M3 — Reveal annotations
- **Build:** per event:
  - prior close level;
  - gap zone;
  - implied-move band (zone);
  - event line;
  - fill point or drift trendline;
  - a "guidance" point label where relevant;
  - links to existing candle terms (marubozu, engulfing, gap-reversal, breakout-retest).
- **Accept:** annotation indices are in range, and the zone prices sit inside the chart extent.
- **Verify:** BASE + annotation test (reuse the logic from the drill validators).

---

## FE5 — "Read the Print" game

### [x] FE5.M1 — Round data (≥ 12 rounds, all 6 archetypes)
- **Build:** `src/lib/financials/readThePrint.ts`. Each round has:
  - an event id;
  - a step-1 prompt (statements + preview);
  - step-2 options: Gap up & hold / Gap up then fade / Gap down & keep falling / Gap down then fill / Muted (inside implied move);
  - an optional step-3 prompt ("next 5 days: drift with / against the gap / chop");
  - an explanation that leads with "what mattered" (e.g. the guide, not the beat);
  - `feedback` on wrong options (Buy-or-Sell drill style);
  - the disclaimer.
- **Accept:**
  - the answer key is derived from the event's archetype (not typed);
  - each archetype has ≥ 2 rounds;
  - no answer letter is > 35% of rounds;
  - every explanation names at least one statement / preview fact that is actually present in that round's data.
- **Verify:** BASE + `readThePrint.test.ts`.

### [x] FE5.M2 — Game UI
- **Build:** a page or modal (decide by repo convention: a Training card that opens a dedicated route like `/training/read-the-print`, or a QuizModal mode).
  - **Phase 1:** the `StatementReader` (condensed) + `EarningsPreviewCard` + the pre-event chart only.
  - **Phase 2:** answer.
  - **Phase 3:** reveal (preview actuals, full chart with `revealAnnotations`, `showVolume`, explanation, "Why not X").
- **Accept:** the pre-answer render never contains the post-event bars or actuals.
- **Verify:** BASE + a render test for each phase + a no-leak assertion.

### [x] FE5.M3 — Progress + scoring
- **Build:** a score per session plus persisted best / completed rounds under a **new** progressStore key (no changes to existing keys).
- **Accept:** reloading keeps progress; existing progress keys are unchanged (diff check).
- **Verify:** BASE + progressStore unit test.

### [x] FE5.M4 — 🔍 HUMAN CHECKPOINT: game play-through
- Weng plays 3 rounds and signs off on pacing, clarity and educational accuracy.

---

## FE6 — Learn content (quiz groups)

### [x] FE6.M1 — `statements-reading` group (≥ 12 Q)
- Read a line, compute a margin / EPS / FCF from the shown table, and spot the red flag (receivables up faster than revenue, inventory build, dilution).
- **Verify:** BASE + quiz validator (ids unique, answers exist, glossary ids resolve, and numeric answers recomputed from fixtures).

### [x] FE6.M2 — `cash-forecast-13wk` group (≥ 10 Q)
- Which week breaches? How much revolver is needed? Runway? What does a collections delay do?
- **Verify:** same as FE6.M1, with answers recomputed via `cashForecast.ts`.

### [x] FE6.M3 — `earnings-preview` group (≥ 10 Q)
- Consensus vs whisper, guidance math, the implied move band, "what is priced in".
- **Verify:** same as FE6.M1.

### [x] FE6.M4 — `earnings-reaction` group (≥ 10 Q, chart-based)
- Gap fill vs gap-and-go, sell the news, PEAD, volume, guidance > headline, tied to candle terms.
- **Verify:** same as FE6.M1, plus chart keys exist and the highlight / annotation indices are in range.

---

## FE7 — Integration, docs, QA

### [x] FE7.M1 — Training + Archive integration
- **Build:** a Training card for "Read the Print" + the 4 new groups (featured order after `financial-drills`); the glossary terms appear in the Archive literacy tab.
- **Verify:** BASE + a test that every new group id is in `QUIZ_GROUPS` and returns ≥ 10 questions via `getQuestionsForGroup`.

### [-] FE7.M2 — Cases bridge (optional, additive) · skipped: needs a product decision, see PROGRESS.md
- **Build:** the existing earnings cases get an optional `eventId` linking to a richer event (when one exists), so CasePlayer can show the preview card. No change to case grading.
- **Verify:** BASE + a test that existing case ids / grades are unchanged.

### [x] FE7.M3 — Docs + loops
- **Build:**
  - `AGENTS_CODE_REFERENCE-data.md` / `-training.md` sections for `src/lib/financials/`;
  - `LOOPS/LOOP-Learn.md` group list;
  - the `statements` echo family in [`../content-graph/LOOP-Graph.md`](../content-graph/LOOP-Graph.md) (point it at the new groups);
  - a `QA_User_Flows.md` flow for the game;
  - EPIC_MAP pointer row "FE (project) → docs/projects/financials-earnings".
- **Verify:** BASE + a link check (every relative md link in touched docs resolves).

### [x] FE7.M4 — Final audit
- **Build:** recount all charter success floors and paste the counts into PROGRESS.md.
- **Verify:** BASE + every test file green. Then STOP with Done(project).

---

## FE8 — Stretch (only after FE7, only if Weng says go)
- [-] FE8.M1 (skipped: needs a product decision, see PROGRESS): a 4th archetype company (bank / NII), or a biotech with binary events.
- [x] FE8.M2: Coach decision tree "earnings week" (preview → print → reaction), using existing coaching infra.
- [x] FE8.M3: Practice: draw the expected gap band / fill level on a reaction chart.

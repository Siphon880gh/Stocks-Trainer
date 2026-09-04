# Stock Trainer (ANALYSIS_CORE) — Implementation Stories

Stories and acceptance criteria for each milestone.  
Parent map: [`EPIC_MAP.md`](./EPIC_MAP.md) · Runtime state: [`.agents/state.json`](./.agents/state.json) · Council: [`council-report-epics-milestones.md`](./council-report-epics-milestones.md)

**Status key:** `todo` · `in_progress` · `done` · `blocked`  
**Finalize:** Council Option A — literacy-then-cases + soft chart gate + MVP freeze

---

## Global conventions

- Stack: React 19, TypeScript, Vite, existing terminal UI language
- Persist learner progress in `localStorage` (`analysis_core_progress_v1`); E8 adds local Account export/import (no paid cloud)
- Case decision set (P0 default): `buy` | `sell` | `hold`; **`short` soft-gated** until long/hold fluency + tip
- Grade: `correct` | `incorrect` | `partial` + **process** debrief (theory application, not direction-only)
- Content tags: `assetClass`, `thinkingMode`, `contextType` (`news` | `financials` | `combined`)
- Do not start post-P0 milestones until MVP freeze criteria are met

---

## Build order

### P0 — MVP freeze (do in sequence)

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 1 | E1.M1 | E1 | P0 | done |
| 2 | E3.M1 | E3 | P0 | done |
| 3 | E4.M1 | E4 | P0 | done |
| 4 | E4.M2 | E4 | P0 | done |
| 5 | E4.M0 | E4 | P0 | done |
| 6 | E5.M1 | E5 | P0 | done |
| 7 | E5.M3 | E5 | P0 | done |
| 8 | E5.M2 | E5 | P0 (thin) | done |
| 9 | E2.M1 | E2 | P0 (thin) | done |
| 10 | E3.M2 | E3 | P0 | done |
| 11 | E6.M1 | E6 | P0 | done |

**MVP freeze:** Beginner Equities Path completable — literacy + chart gate + case engine + earnings pack + thin company news + unlock + live dashboard + path-complete credential.

### Post-P0 — skill depth (many options & theory application)

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 12 | E5.M2b | E5 | Post | done |
| 13 | E5.M4 | E5 | Post | done |
| 14 | E5.M5 | E5 | Post | done |
| 15 | E5.M6 | E5 | Post | done |
| 16 | E2.M2 | E2 | Post | done |
| 17 | E4.M3 | E4 | Post | done |
| 18 | E1.M2 | E1 | Post | done |

### Later — Practice Draw & data/accounts

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 19 | E7.M1 | E7 | Later | done |
| 20 | E7.M2 | E7 | Later | done |
| 21 | E8.M1 | E8 | Later | done |
| 22 | E8.M2 | E8 | Later | done |
| 23 | E8.M3 | E8 | Later | done |

### Market types — multi-asset SAMPLE expansion (`market_types_order`)

Retail **traditional market** (stocks) stays **Equities**. These milestones fill other Market class slots with SAMPLE packs + thin literacy—no LIVE feeds, no order routing, no Greeks engine.

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 24 | E9.M1 | E9 | Market types | done |
| 25 | E9.M2 | E9 | Market types | done |
| 26 | E9.M3 | E9 | Market types | done |
| 27 | E9.M4 | E9 | Market types | done |
| 28 | E9.M5 | E9 | Market types | done |

Loop: [`AGENTS_LOOP-Market-Types.md`](./AGENTS_LOOP-Market-Types.md) (also queue 4 in Continue-Milestone).

### Market learning coverage (`market_learning_order`)

Close curriculum gaps: **navigate markets**, **news literacy**, **deeper financials drills**, and **SAMPLE decide-and-reveal** per market type (mock data only). Equities remains the traditional retail spine; other markets get learn-by-decision packs after chart soft-gate.

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 29 | E10.M1 | E10 | Coverage | done |
| 30 | E10.M2 | E10 | Coverage | done |
| 31 | E10.M3 | E10 | Coverage | done |
| 32 | E10.M4 | E10 | Coverage | done |
| 33 | E10.M5 | E10 | Coverage | done |
| 34 | E10.M6 | E10 | Coverage | done |
| 35 | E10.M7 | E10 | Coverage | done |
| 36 | E10.M8 | E10 | Coverage | done |
| 37 | E10.M9 | E10 | Coverage | done |

Loop: [`AGENTS_LOOP-Market-Learning-Coverage.md`](./AGENTS_LOOP-Market-Learning-Coverage.md) (queue 5 in Continue-Milestone).

### Step coaching (`step_coaching_order`)

Deterministic decision-tree coaching (fail → explain → rewind → succeed). No runtime LLM. Complements quizzes (MCQ) and cases (decide→reveal OHLC)—does not replace them.

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 38 | E11.M1 | E11 | Coaching | done |
| 39 | E11.M2 | E11 | Coaching | done |
| 40 | E11.M3 | E11 | Coaching | done |
| 41 | E11.M4 | E11 | Coaching | done |
| 42 | E11.M5 | E11 | Coaching | done |
| 43 | E11.M6 | E11 | Coaching | done |

Loop: [`AGENTS_LOOP-Step-Coaching.md`](./AGENTS_LOOP-Step-Coaching.md) (queue 6 in Continue-Milestone).

---

## E1 — Equities Sample Universe

### E1.M1 — Equities catalog & pack schema *(P0)*
**Outcome:** Named sample equity instruments and OHLC packs exist with a stable schema.

| ID | Story | Acceptance |
|----|--------|------------|
| E1.M1.S1 | Define `Instrument` + `SamplePack` types (id, symbol, assetClass, displayName, ohlc[], educationalNotes) | Types exported from `src/lib`; used by at least one consumer |
| E1.M1.S2 | Seed ≥3 equity packs (e.g. mega-cap tech, index proxy, cyclical) with distinct OHLC (not one series scaled) | Packs selectable; charts differ visually |
| E1.M1.S3 | Keep existing BTC/ETH/SPX working via adapter or migration | No regression on Market page for prior markets |
| E1.M1.S4 | Stub assetClass slots for `future` / `option_context` / `crypto` (empty or minimal) | Schema ready; UI can ignore empty classes; no multi-asset product promise in copy |

### E1.M2 — Market UI browse by asset class *(post-P0)*
**Outcome:** User filters Market by equities / crypto / futures / options-context.

| ID | Story | Acceptance |
|----|--------|------------|
| E1.M2.S1 | Asset-class filter on Market page | Filter changes listed instruments |
| E1.M2.S2 | Empty state when class has no packs | Clear copy, not a blank crash |

---

## E3 — Milestone Tracker & Progress Persistence

### E3.M1 — Progress store + path ID contract *(P0)*
**Outcome:** Path progress survives refresh; Beginner Equities milestone IDs are canonical.

| ID | Story | Acceptance |
|----|--------|------------|
| E3.M1.S1 | `ProgressStore` API: get/set pathId, milestone statuses, scores, streaks | Unit-smoke via app usage; JSON round-trip in `localStorage` |
| E3.M1.S2 | Schema version + safe reset if corrupt | Corrupt data → reset + user-visible recovery message |
| E3.M1.S3 | Seed default **Beginner Equities** path skeleton (IDs only) | Fixed milestone IDs match E2.M1 / E4 / E5 content keys; includes E4.M0 chart gate id |

### E3.M2 — Unlock rules & writeback *(P0)*
**Outcome:** Completing a quiz/case unlocks the next milestone.

| ID | Story | Acceptance |
|----|--------|------------|
| E3.M2.S1 | Unlock rule: prior milestone `complete` (or score threshold) | Locked items not startable; chart gate required before first graded case pack |
| E3.M2.S2 | Training + Case sessions write scores into store | Dashboard/Training reflect new scores after session |
| E3.M2.S3 | “Reset path” control | Confirms, then clears to first-run state |

---

## E4 — Equities Literacy & Chart Fluency

### E4.M1 — Equities literacy + risk/horizon *(P0)*
**Outcome:** Beginner can quiz on what a stock/market is and basic risk/horizon.

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M1.S1 | Quiz group: stocks, exchanges, long vs short, shares vs company | ≥8 questions; explanations on answer |
| E4.M1.S2 | Include risk/horizon / investing-vs-trading beat (when hold is correct; time horizon) | ≥2 questions or integrated tips in the same group |
| E4.M1.S3 | Wire group into Training selector | Launchable like existing pattern/indicator groups |
| E4.M1.S4 | Archive entries (or glossary) for new terms | Terms link from quiz explanations where useful |

### E4.M2 — Financial statement literacy quizzes *(P0)*
**Outcome:** Beginner can read a simple company snapshot.

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M2.S1 | Quiz group: revenue, net income, cash vs profit, assets/liabilities basics, simple P/E or margin | ≥8 questions with plain-language debriefs |
| E4.M2.S2 | Mini “snapshot card” UI in quiz/case context (IS/BS/CF highlights) | Card renders from structured JSON, not prose-only |
| E4.M2.S3 | Progress writeback to E3 store | Completing group updates milestone status |

### E4.M0 — Chart soft-gate (wire existing TA) *(P0)*
**Outcome:** Beginner path requires candle/indicator fluency before graded decision cases.

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M0.S1 | Attach existing pattern and/or indicator Training groups to equity packs / Beginner path milestone | Path lists chart literacy as a required step before E5 packs |
| E4.M0.S2 | Soft-gate: complete (or pass threshold) before unlocking E5.M3 / graded case packs | Locked cases show prerequisite tip |
| E4.M0.S3 | Progress writeback to E3 store | Chart gate milestone flips `complete` |

### E4.M3 — Expand candle/indicator drills on multi-asset packs *(post-P0)*
**Outcome:** Existing TA quizzes use richer equity (then other) packs.

| ID | Story | Acceptance |
|----|--------|------------|
| E4.M3.S1 | Attach pattern/indicator questions to E1 equity packs | At least one new equity-backed quiz set beyond E4.M0 |
| E4.M3.S2 | Tag questions by assetClass | Planner can filter later |

---

## E5 — Interactive Decision Case Studies *(priority content)*

### E5.M1 — Case engine (player loop) *(P0)*
**Outcome:** One end-to-end case works: brief → decide → reveal → grade.

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M1.S1 | `CaseStudy` schema: id, title, contextType, thinkingMode, brief, statementSnapshot?, newsHeadline?, preOhlc, postOhlc, correctActions[], acceptablePartial[], debrief | Typed module under `src/lib` |
| E5.M1.S2 | Case player route/page or modal flow | User can finish one seeded demo case |
| E5.M1.S3 | Decision controls: buy / sell / hold; short optional/locked until soft-gate clears | Choice recorded before reveal; short not default for first cases |
| E5.M1.S4 | Reveal aftermath chart + grade + **process** debrief | Correct/incorrect/partial shown; debrief covers thesis/evidence/why market moved; cannot re-pick without retry flag |
| E5.M1.S5 | Write result to progress store | Case id + grade persisted |

### E5.M3 — Pack B: financials / earnings cases *(P0)*
**Outcome:** Multiple statement/earnings thinking-mode cases (theory application).

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M3.S1 | Thinking modes covered: beat/miss, margin compression, cash-flow red flag, guidance cut, balance-sheet stress | ≥1 case per mode (target ≥5; floor ≥3 for freeze) |
| E5.M3.S2 | Each case includes statement snapshot + pre/post OHLC | Snapshot visible before decision |
| E5.M3.S3 | Debriefs explain *why* the market moved (process + theory), not only direction | Copy reviewed for beginner clarity |
| E5.M3.S4 | Pack listed in Training/Cases UI | Launchable as a set |

### E5.M2 — Pack A: company news cases *(P0 thin)*
**Outcome:** Company-news thinking modes on equity underlyings (macro deferred to E5.M2b).

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M2.S1 | Modes: momentum chase vs fade + simple company headlines | ≥3 cases (target ≥5 over time); no FOMC/geopolitics required for P0 |
| E5.M2.S2 | Prefer equity underlyings for beginner path | No options-required decisions in this pack |
| E5.M2.S3 | Same player loop as E5.M1 | No engine fork |

### E5.M2b — Pack A macro intro *(post-P0)*
**Outcome:** Intro macro thinking modes after company-news fluency.

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M2b.S1 | Modes: risk-off, simple macro print, geopolitics/supply (intro level) | ≥1 case per mode |
| E5.M2b.S2 | Same player loop as E5.M1 | No engine fork |

### E5.M4 — Pack C: combined news + statements *(post-P0)*
**Outcome:** Cases where both filings/snapshots and headlines matter.

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M4.S1 | ≥4 combined cases (e.g. earnings + headline; restatement rumor + filing) | `contextType: combined` |
| E5.M4.S2 | Partial credit when thesis right but horizon wrong | Documented in schema + UI |

### E5.M5 — Scale library & tags *(post-P0)*
**Outcome:** Enough volume for a long Decision Maker spine (many options & modes).

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M5.S1 | Grow toward “many” cases across packs (target: ≥20 total) | Shipped: **20** cases (`CASE_LIBRARY_COUNT` in `src/lib/caseStudies.ts`) |
| E5.M5.S2 | Consistent tags for planner (`thinkingMode`, `contextType`, difficulty) | All cases tagged |
| E5.M5.S3 | Difficulty: `beginner` \| `intermediate` | Beginner path only pulls `beginner` by default |

### E5.M6 — Decision Maker path wiring *(post-P0)*
**Outcome:** Ordered case milestones in the Decision Maker path; Beginner segment already sequenced in E2.M1.

| ID | Story | Acceptance |
|----|--------|------------|
| E5.M6.S1 | Decision Maker path sequences E5.M3 → E5.M2 → E5.M2b → E5.M4 cases | Matches learning order |
| E5.M6.S2 | Coach tip per thinking mode (short, terminal tone) | Shown on Dashboard/case intro |
| E5.M6.S3 | Completion badge/state for Decision Maker segment | Visible on Dashboard |

---

## E2 — Learning Milestone Planner (AI Context)

### E2.M1 — Path model & Beginner Equities template *(P0 thin)*
**Outcome:** Stable path graph agents and UI share; one hardcoded Beginner path.

| ID | Story | Acceptance |
|----|--------|------------|
| E2.M1.S1 | Path / Milestone types: id, title, contentRefs[], unlockFrom[] | Documented; mirrored in `.agents` context if needed |
| E2.M1.S2 | Template: **Beginner Equities Path** (E4.M1 → E4.M2 → E4.M0 → E5.M3 → E5.M2 → …) | IDs align with E3.M1 skeleton; includes chart gate before cases |
| E2.M1.S3 | Auto-seed Beginner Equities as default pathId (no picker yet) | First-run lands on this path |

### E2.M2 — Goal intake → proposed path *(post-P0)*
**Outcome:** First-run chooses a goal and gets a path (Beginner Equities vs Decision Maker).

| ID | Story | Acceptance |
|----|--------|------------|
| E2.M2.S1 | First-run goal picker (default: Beginner Equities) | Persists chosen pathId |
| E2.M2.S2 | Preview milestones before confirm | User can confirm or switch template |
| E2.M2.S3 | Export path snapshot for agent context (JSON) | Readable from app or `.agents` |
| E2.M2.S4 | Template: **Decision Maker** (case-heavy spine) | Reuses E5 case ids |

---

## E6 — Dashboard Path Integration & Coach Surfaces

### E6.M1 — Live path on Dashboard *(P0)*
**Outcome:** Decorative progress replaced with real path state; path-complete credential visible.

| ID | Story | Acceptance |
|----|--------|------------|
| E6.M1.S1 | Active milestone title, % or step N/M from store | Matches E3 data after refresh |
| E6.M1.S2 | Primary CTA → next quiz/case | Deep-links with correct ids |
| E6.M1.S3 | Coach tip for current milestone | From path/case metadata |
| E6.M1.S4 | Empty / complete path states | First-run CTA; “Beginner Equities Path complete” credential state without clutter |

---

## Later — E7 Practice Draw & E8 Data/Accounts

Enter only after `post_mvp_order` is complete (see `milestones.later_order` in `.agents/state.json`). Prefer SAMPLE / mock / delayed adapters; do not require paid API keys for acceptance.

### E7.M1 — Practice Draw canvas + grade vs template *(Later)*
**Outcome:** Learner sketches a candlestick pattern and gets a grade against a template.

| ID | Story | Acceptance |
|----|--------|------------|
| E7.M1.S1 | Drawable canvas on `/practice-draw` (pointer/touch) with clear / undo | User can draw strokes; not a static placeholder |
| E7.M1.S2 | Pattern template picker (Doji, Hammer, Engulfing minimum) | Selecting a template shows reference silhouette or guide |
| E7.M1.S3 | Grade sketch vs template (coarse similarity / checklist score) | Submit yields correct / partial / incorrect + short process tip |
| E7.M1.S4 | Persist last attempt in ProgressStore (or dedicated key) | Survives refresh |

### E7.M2 — Practice Draw path link *(Later)*
**Outcome:** Draw practice can feed a milestone or Dashboard CTA.

| ID | Story | Acceptance |
|----|--------|------------|
| E7.M2.S1 | Optional contentRef / Dashboard link into Practice Draw | Reachable from Dashboard or Training without orphan route |
| E7.M2.S2 | Completing a graded draw can mark a progress flag or tip state | Visible writeback (badge, tip, or milestone note) |

### E8.M1 — Market data adapter (mock / delayed) *(Later)*
**Outcome:** Pluggable feed behind Market charts; default stays SAMPLE.

| ID | Story | Acceptance |
|----|--------|------------|
| E8.M1.S1 | `MarketDataProvider` interface + SAMPLE/mock implementation | Market page can load OHLC via provider, not only static import |
| E8.M1.S2 | UI label distinguishes SAMPLE vs DELAYED (never fake LIVE) | Copy matches provider mode |
| E8.M1.S3 | Swap provider via config/flag without rewriting chart stack | One mock + one alternate (e.g. delayed replay) selectable |

### E8.M2 — Account shell *(Later)*
**Outcome:** Local identity shell; no paid IdP required for acceptance.

| ID | Story | Acceptance |
|----|--------|------------|
| E8.M2.S1 | Local display-name / learner id in ProgressStore | Editable; persists |
| E8.M2.S2 | Signed-out vs signed-in-local states in UI chrome | Clear terminal-tone status; no real OAuth required |

### E8.M3 — Progress export / sync stub *(Later)*
**Outcome:** Learner can export/import progress JSON; cloud sync stubbed.

| ID | Story | Acceptance |
|----|--------|------------|
| E8.M3.S1 | Export progress JSON download | File matches ProgressStore schema |
| E8.M3.S2 | Import progress JSON with schema validation + corrupt reject | Happy path restore; bad file shows recovery message |
| E8.M3.S3 | Cloud sync interface stub (`noop` or local queue) | Typed module; UI shows “sync stub / local only” — no silent fake cloud |

---

## Market types — E9 Multi-Asset SAMPLE Expansion

Enter only after `later_order` is complete (see `milestones.market_types_order` in `.agents/state.json`).  
**Constraint:** SAMPLE / STYLIZED educational packs only; never invent LIVE/REAL_TIME; options = context education only (no pricing/Greeks product).

### E9.M1 — Futures SAMPLE packs *(Market types)*
**Outcome:** Market **Class → Futures** lists ≥2 distinct SAMPLE future underlyings (e.g. index + energy style).

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M1.S1 | Add `future` SamplePacks (≥2) with distinct OHLC shapes + educationalNotes | Packs in `SAMPLE_PACKS_BY_CLASS.future`; selectable on Market |
| E9.M1.S2 | Wire futures into Market adapter (`MARKETS` / `listMarketsByAssetClass`) | Class filter **Futures** shows instruments; charts render |
| E9.M1.S3 | Empty-state regression: other empty classes still clear | No crash; equity/crypto paths unchanged |

### E9.M2 — Options-context SAMPLE packs *(Market types)*
**Outcome:** Market **Class → Options context** shows educational underlying packs (not a live chain).

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M2.S1 | Add `option_context` SamplePacks (≥2) with notes that this is context/education, not chain data | Packs selectable; copy denies LIVE chain / Greeks engine |
| E9.M2.S2 | Wire into Market filter + chart | Filter lists packs; OHLC chart works |
| E9.M2.S3 | Optional Archive or Training tip link “Options context (SAMPLE)” | Discoverable without promising brokerage options trading |

### E9.M3 — Crypto SAMPLE deepen *(Market types)*
**Outcome:** Crypto class feels intentional (≥3 packs or richer notes), still SAMPLE browse-only (not Beginner path replacement).

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M3.S1 | Ensure ≥3 crypto SAMPLE packs with distinct shapes (extend BTC/ETH; add one more) | Class **Crypto** lists ≥3; charts differ |
| E9.M3.S2 | UI copy: crypto is browse/drill, not the equities Beginner spine | No GoalPicker claim that crypto replaces stocks path |
| E9.M3.S3 | Provider SAMPLE/DELAYED still honest on crypto markets | No LIVE/REAL_TIME labels |

### E9.M4 — Forex SAMPLE packs *(Market types)*
**Outcome:** Spot FX as a Market class for retail FX curiosity after equities fluency.

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M4.S1 | Extend `AssetClass` with `forex`; Market Class filter label **Forex** | Type + filter work; empty state until packs land in same milestone |
| E9.M4.S2 | Seed ≥2 forex SAMPLE packs (e.g. major + cross) with distinct OHLC | Selectable; charts render |
| E9.M4.S3 | README / in-app empty-or-help copy names Forex vs Equities (stocks = traditional retail) | Learner can tell stocks vs FX |

### E9.M5 — Cross-market literacy bridge *(Market types)*
**Outcome:** Thin literacy so learners know what each market type is—without a full second path.

| ID | Story | Acceptance |
|----|--------|------------|
| E9.M5.S1 | Archive **Literacy** terms (or quiz group) covering equities vs futures vs options-context vs crypto vs forex at definition level | ≥1 term or ≥3 quiz items per new class touched in E9 |
| E9.M5.S2 | Dashboard or Market helper line: traditional retail track = **Equities (stocks)**; other classes = SAMPLE expansion | Visible without cluttering GoalPicker |
| E9.M5.S3 | QA note or UF stub in `QA_User_Flows.md` for Market class filters (equities + one non-equity) | Documented click path for agents/humans |

---

## Market learning coverage — E10 Navigate + Decide (SAMPLE)

Enter only after `market_types_order` (E9) is complete.  
**Constraints:** SAMPLE/mock OHLC + stylized headlines/snapshots only; reuse CasePlayer decide→reveal; chart soft-gate still required before graded cases; no LIVE feeds, no order routing, no Greeks engine; Equities = traditional retail stocks spine.

### Coverage map (what E10 closes)

| Gap | Milestone |
|-----|-----------|
| Hard to jump between market types / related learning | E10.M1 Navigator |
| No dedicated news-reading quiz | E10.M2 |
| Statements only “lite”; little drill after path | E10.M3 |
| Futures/FX/crypto/options = browse only, no decisions | E10.M4–M7 |
| No GoalPicker track for multi-market practice | E10.M8 |
| Progress/CTAs don’t surface market tracks | E10.M9 |

### E10.M1 — Market Navigator hub *(Coverage)*
**Outcome:** Learner picks a market type and reaches charts + literacy + cases for that type in ≤2 clicks from Dashboard or Market.

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M1.S1 | Market Navigator UI (Dashboard tile and/or Market header): Equities · Futures · Forex · Crypto · Options context | Selecting a type navigates with clear query/state (e.g. `/market?class=forex` or `/cases?market=future`) |
| E10.M1.S2 | Per-type action row: **VIEW_CHARTS** · **READ_LITERACY** · **DECIDE_CASES** (cases link disabled/locked copy until chart gate + pack exists) | Each control lands on the right surface; locked state explains gate |
| E10.M1.S3 | Helper copy: traditional retail = **Equities (stocks)**; other types = SAMPLE decide/browse expansion | Visible on Navigator without burying GoalPicker |

### E10.M2 — News literacy quiz *(Coverage)*
**Outcome:** Training group teaches how to read headlines before/alongside company-news cases.

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M2.S1 | Add quiz group `news-literacy` (≥6 SAMPLE questions): rumor vs filing, priced-in, chase vs fade, source humility | Group appears on Training; finishable via QuizModal |
| E10.M2.S2 | Archive literacy terms or deep-links for ≥3 news concepts | Terms open from quiz glossary links |
| E10.M2.S3 | Optional writeback flag or tip on Dashboard after first completion (not required to unlock equities path) | Progress visible; does not break Beginner unlock graph |

### E10.M3 — Financial statements drill pack *(Coverage)*
**Outcome:** Extra statement practice beyond E4.M2 lite (still SAMPLE snapshots—not a full accounting course).

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M3.S1 | Add quiz group `financial-drills` (≥6 Q) or extend financial-literacy with a second pack using ≥2 snapshot ids | Snapshot cards render; questions cover cash vs profit, margin, leverage/cushion cues |
| E10.M3.S2 | Cases list / Training banner link “Statements drills” after E4.M2 complete | Discoverable from Learn or Navigator Equities row |
| E10.M3.S3 | Reuse FinancialSnapshotCard; no live filings | SAMPLE/STYLIZED labels only |

### E10.M4 — Case engine: `assetClass` on studies *(Coverage)*
**Outcome:** CaseStudy model + Cases UI can filter by market type; CasePlayer unchanged mechanically.

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M4.S1 | Add `assetClass` (default `equity`) on `CaseStudy`; pack ids may include `futures` / `forex` / `crypto` / `options-context` | Types compile; equity cases default correctly |
| E10.M4.S2 | Cases page honors `?market=` or `?class=` (and Navigator links) | Filter focuses the right pack section |
| E10.M4.S3 | Chart soft-gate still blocks graded play for all asset classes | Direct URL to locked case shows gate tip |

### E10.M5 — Futures SAMPLE decide-and-reveal *(Coverage)*
**Outcome:** ≥3 futures cases (mock tape + brief); learn by BUY/SELL/HOLD/(SHORT soft-gate).

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M5.S1 | Seed ≥3 `future` cases with distinct thinking modes (e.g. trend continuation, risk-off dump, roll/contango *literacy-light*) | Cases list under Futures; pre/post OHLC anti-hindsight |
| E10.M5.S2 | Process debriefs; SHORT soft-gated when `allowShort` false | Same CasePlayer UX as equities |
| E10.M5.S3 | Navigator **DECIDE_CASES** for Futures opens filtered list | End-to-end click path works |

### E10.M6 — Forex SAMPLE decide-and-reveal *(Coverage)*
**Outcome:** ≥3 FX cases on SAMPLE spot pairs.

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M6.S1 | Seed ≥3 `forex` cases (major + cross); briefs about risk-on/off / data print *stylized* | Playable after chart gate |
| E10.M6.S2 | Copy clarifies FX browse/decide is SAMPLE—not a LIVE FX desk | No LIVE/REAL_TIME |
| E10.M6.S3 | Navigator Forex **DECIDE_CASES** wired | Filter + player work |

### E10.M7 — Crypto + options-context SAMPLE decisions *(Coverage)*
**Outcome:** Crypto gets ≥3 decide cases; options-context gets ≥2 underlying-context cases (no chain/Greeks).

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M7.S1 | ≥3 `crypto` SAMPLE cases (chase/fade, dump/reclaim, chop-break) | Graded decide→reveal |
| E10.M7.S2 | ≥2 `option_context` cases: underlying into event / after vol spike; debrief denies chain trading | Educational only |
| E10.M7.S3 | Navigator rows for Crypto + Options context | Charts + cases reachable |

### E10.M8 — Market Explorer path (GoalPicker) *(Coverage)*
**Outcome:** Optional third path for multi-market SAMPLE decisions after chart fluency—does not replace Beginner Equities.

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M8.S1 | Add path template `market-explorer` (or similar): gate → futures cases → forex → crypto (options-context optional tip) | Appears in GoalPicker with preview |
| E10.M8.S2 | ProgressStore supports path id + milestone order; unlock graph for explorer milestones | Persist/resume works |
| E10.M8.S3 | Confirm copy: Equities paths remain for traditional stocks; Explorer is SAMPLE multi-market practice | No claim Explorer replaces stock literacy |

### E10.M9 — Dashboard CTAs + QA flows *(Coverage)*
**Outcome:** Home surfaces Navigator; QA scripts cover news quiz + one non-equity decide flow.

| ID | Story | Acceptance |
|----|--------|------------|
| E10.M9.S1 | Dashboard quick tile **MARKET_NAV** (or equivalent) → Navigator | One click from `/` |
| E10.M9.S2 | Coach tip when explorer/news-literacy available | Terminal tone; not clutter |
| E10.M9.S3 | Add/extend `QA_User_Flows.md`: UF for Navigator; UF for news-literacy; UF for one futures or forex case | Agents can regression-QA |

---

## Step coaching — E11 Decision-tree wizard

Enter only after `market_learning_order` (E10) is complete.  
**Constraints:** Deterministic graphs only — no LLM, no randomness, no external content APIs at session runtime. Wrong nodes teach + `rewind_to`. Reuse Layout / terminal tokens. Do not rewrite CasePlayer or QuizModal. New sessions auto-discover from the content folder (no hand-maintained registry unless Vite glob needs an index export).

### Placement map (where code lives)

| Layer | Location |
|-------|----------|
| Types + outcomes | `src/lib/coaching/types.ts` |
| Validate graph | `src/lib/coaching/validate.ts` |
| Session content | `src/lib/coaching/sessions/<slug>.ts` (meta + tree) |
| Discovery / load | `src/lib/coaching/index.ts` (`import.meta.glob` or equivalent) |
| Nav engine + history | `src/lib/coaching/navigate.ts` |
| Path trail labels | `src/lib/coaching/pathTrail.ts` |
| Persist adapter | `src/lib/coaching/persist.ts` (`sessionStorage` default) |
| Catalog UI | `src/pages/Coach.tsx` → `/coach` |
| Session UI | `src/pages/CoachSession.tsx` → `/coach/:slug` |
| Routes | `src/App.tsx` |
| Optional CTAs | Dashboard · Training · Navigator deep-links by `topic` / tags |

### Coverage map (what E11 closes)

| Gap | Milestone |
|-----|-----------|
| No fail-and-rewind guided reasoning across topics | E11.M1–M3 |
| Refresh loses mid-session progress; no path trail | E11.M4 |
| Only one sample topic; not wired into app navigation | E11.M5 |
| No automated nav/validate tests or QA scripts | E11.M6 |

### E11.M1 — Content contract, validation, discovery, sample *(Coaching)*
**Outcome:** One valid sample coaching session loads from structured content; invalid graphs are rejected before play.

| ID | Story | Acceptance |
|----|--------|------------|
| E11.M1.S1 | Define session meta (`title`, `summary`, `topic`, `tags`, `slug`) + graph (`start`, `nodes` with `message`, `outcome`, `choices`, optional `rewind_to`) | Types exported from `src/lib/coaching`; used by validate + at least one session |
| E11.M1.S2 | Validator: `start` exists; every `next` / `rewind_to` exists; `wrong` requires `rewind_to`; ≥1 `success`; sample has ≥1 `wrong`; non-empty choice labels | Invalid session not listed (or load returns typed errors) |
| E11.M1.S3 | Discover sessions from content folder; `listSessions()` / `loadSession(slug)` | Sample slug loadable without a separate manual registry file beyond folder exports |
| E11.M1.S4 | Seed sample session (equities decision thinking, e.g. chase-vs-fade) with ≥2 wrong branches + ≥1 success path | Graph validates; readable labels for buttons and path trail |

### E11.M2 — Navigation engine *(Coaching)*
**Outcome:** Pure runtime advances/backs/rewinds/restarts using an ordered history stack of node IDs.

| ID | Story | Acceptance |
|----|--------|------------|
| E11.M2.S1 | `choose(choice)`: verify choice on current node + `next` exists; push current; go to target | Invalid transition rejected; history grows |
| E11.M2.S2 | Normal step-back pops one history entry; wrong-node step-back jumps to `rewind_to` and truncates history after that node | Rewind lands on intended decision; trail matches stack |
| E11.M2.S3 | `restart()` clears history and returns to `start`; unknown node recovers to `start` (or safe error state) | Restart + unknown-node behavior covered |

### E11.M3 — Catalog + session presentation *(Coaching)*
**Outcome:** Learner browses sessions and plays one node at a time with outcome styling and controls.

| ID | Story | Acceptance |
|----|--------|------------|
| E11.M3.S1 | Routes `/coach` (catalog: title, summary, topic, tags) and `/coach/:slug` (session) | Missing slug shows clear not-found; terminal tone |
| E11.M3.S2 | Session view: header, message panel, choice buttons (keyboard accessible), step-back when available, restart on terminal `wrong`/`success` | Choices hidden on terminal nodes; focus usable after nav |
| E11.M3.S3 | Outcome presentation: `continue` / `wrong` / `success` visually distinct **and** labeled (not color-only); `aria`/text for assistive tech | Wrong shows warning treatment + rewind control; success offers restart |

### E11.M4 — Persistence + path visualizer *(Coaching)*
**Outcome:** Mid-session state survives refresh; collapsible path trail derives from history + current node.

| ID | Story | Acceptance |
|----|--------|------------|
| E11.M4.S1 | Persist adapter: current node + history stack (default `sessionStorage` keyed by slug); clear on restart | Refresh restores; adapter boundary so URL/localStorage can swap later |
| E11.M4.S2 | Path visualizer: ordered steps, message preview, choice label between nodes (resolved from source `choices`), current-step marker | No separate breadcrumb content authored by hand |
| E11.M4.S3 | Collapsible trail with accessible expanded/collapsed state; optional debug node id toggle | Works on desktop + mobile widths used by Layout |

### E11.M5 — Topic sessions + app CTAs *(Coaching)*
**Outcome:** Coaching covers major app topics; discoverable from Dashboard (and optional Training/Navigator links).

| ID | Story | Acceptance |
|----|--------|------------|
| E11.M5.S1 | Add ≥3 more sessions spanning topics: statements/snapshot reasoning; chart/indicator gate thinking; multi-market (futures or FX) SAMPLE framing | Each validates; catalog lists ≥4 sessions total (incl. sample) |
| E11.M5.S2 | Tag sessions so catalog can filter or group by topic; labels stay durable for path trail | Tags visible on catalog cards |
| E11.M5.S3 | Dashboard **COACH** (or equivalent) CTA → `/coach`; optional deep-link from Training/Cases/Navigator for one tagged session | One-click from `/`; does not alter Beginner unlock graph |
| E11.M5.S4 | Optional ProgressStore flag per completed session slug (success reached) for tip copy only | No fake cloud sync; Beginner path unlocks unchanged |

### E11.M6 — Tests + QA + README *(Coaching)*
**Outcome:** Navigation/validation covered by automated checks; QA flows and README list coaching as a learning objective.

| ID | Story | Acceptance |
|----|--------|------------|
| E11.M6.S1 | Automated tests (e.g. `tsx` + `node:test` or equivalent—no new heavy test stack unless needed): start load, valid choice, reject invalid, step-back, rewind+truncate, restart, success, missing session, unknown node, path labels, validate broken refs | `npm` script runs green in CI-local (`npm run test:coaching` or documented equivalent) |
| E11.M6.S2 | Extend `QA_User_Flows.md`: catalog → play → wrong rewind → success restart; refresh restore | Agents can regression-QA |
| E11.M6.S3 | README: objective row + route in app map; skill stub `.agents/skills/add-coaching-session/SKILL.md` for authoring new graphs | Discoverable for humans + loop agents |

---

## Definition of done (per story)

1. Meets acceptance criteria  
2. No regression to existing Market / Training / Archive happy paths  
3. Progress keys stable (no silent renames without migration)  
4. `.agents/state.json` updated when a milestone flips `in_progress` / `done`  
5. New user-facing copy matches terminal tone of the app  
6. Case debriefs teach process / theory application (not direction-only)  

---

## MVP freeze checklist

- [x] E1.M1 equity packs live  
- [x] E3.M1 path IDs + progress persist  
- [x] E4.M1 + E4.M2 + E4.M0 complete on path  
- [x] E5.M1 engine + E5.M3 (≥3) + E5.M2 thin company news  
- [x] E2.M1 Beginner template + E3.M2 unlocks + E6.M1 live CTA  
- [x] Path-complete credential visible  
- [x] Soft-gate short in force for beginner cases  

**Only then:** post-P0 skill depth (E5.M2b → E5.M4 → E5.M5 → E5.M6 → E2.M2 → E4.M3 → E1.M2)

---

## Next action

**Done(step_coaching) / Done(global):** `step_coaching_order` (E11) complete. All milestone queues finished.

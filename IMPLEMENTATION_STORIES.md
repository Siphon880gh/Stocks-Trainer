# Stock Trainer (ANALYSIS_CORE) — Implementation Stories

Stories and acceptance criteria for each milestone.  
Parent map: [`EPIC_MAP.md`](./EPIC_MAP.md) · Runtime state: [`.agents/state.json`](./.agents/state.json) · Council: [`council-report-epics-milestones.md`](./council-report-epics-milestones.md)

**Status key:** `todo` · `in_progress` · `done` · `blocked`  
**Finalize:** Council Option A — literacy-then-cases + soft chart gate + MVP freeze

---

## Global conventions

- Stack: React 19, TypeScript, Vite, existing terminal UI language
- Persist learner progress in `localStorage` until E8
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

**All queues complete** (`implementation_order`, `post_mvp_order`, `later_order`). Global Done.

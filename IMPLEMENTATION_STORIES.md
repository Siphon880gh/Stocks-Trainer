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
| 1 | E1.M1 | E1 | P0 | todo |
| 2 | E3.M1 | E3 | P0 | todo |
| 3 | E4.M1 | E4 | P0 | todo |
| 4 | E4.M2 | E4 | P0 | todo |
| 5 | E4.M0 | E4 | P0 | todo |
| 6 | E5.M1 | E5 | P0 | todo |
| 7 | E5.M3 | E5 | P0 | todo |
| 8 | E5.M2 | E5 | P0 (thin) | todo |
| 9 | E2.M1 | E2 | P0 (thin) | todo |
| 10 | E3.M2 | E3 | P0 | todo |
| 11 | E6.M1 | E6 | P0 | todo |

**MVP freeze:** Beginner Equities Path completable — literacy + chart gate + case engine + earnings pack + thin company news + unlock + live dashboard + path-complete credential.

### Post-P0 — skill depth (many options & theory application)

| # | Milestone | Epic | Tier | Status |
|---|-----------|------|------|--------|
| 12 | E5.M2b | E5 | Post | todo |
| 13 | E5.M4 | E5 | Post | todo |
| 14 | E5.M5 | E5 | Post | todo |
| 15 | E5.M6 | E5 | Post | todo |
| 16 | E2.M2 | E2 | Post | todo |
| 17 | E4.M3 | E4 | Post | todo |
| 18 | E1.M2 | E1 | Post | todo |

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
| E5.M5.S1 | Grow toward “many” cases across packs (target: ≥20 total) | Count documented in this file when shipped |
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

## Later epics (stories deferred)

### E7 — Practice Draw
- Graded sketch vs pattern templates; optional milestone link

### E8 — Live data & accounts
- Provider adapter, auth, cloud sync of progress

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

- [ ] E1.M1 equity packs live  
- [ ] E3.M1 path IDs + progress persist  
- [ ] E4.M1 + E4.M2 + E4.M0 complete on path  
- [ ] E5.M1 engine + E5.M3 (≥3) + E5.M2 thin company news  
- [ ] E2.M1 Beginner template + E3.M2 unlocks + E6.M1 live CTA  
- [ ] Path-complete credential visible  
- [ ] Soft-gate short in force for beginner cases  

**Only then:** post-P0 skill depth (E5.M2b → E5.M4 → E5.M5 → E5.M6 → E2.M2 → E4.M3 → E1.M2)

---

## Next action

Start **E1.M1.S1** when implementing. Update the Status column in the build-order tables as work proceeds.

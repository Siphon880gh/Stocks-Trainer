# Stories: Macro Forces — Releases, Rates & Market Reactions

Parent: [`EPICS.md`](./EPICS.md) · Charter: [`CHARTER.md`](./CHARTER.md) · Progress: [`PROGRESS.md`](./PROGRESS.md)

Same shape as the root `IMPLEMENTATION_STORIES.md`. **Status key:** `todo` · `in_progress` · `done` · `blocked`. One story `in_progress` at a time. The loop advances stories in order and flips the milestone box in EPICS.md when its last story is `done`.

## Conventions
- New code: `src/lib/macro/` (data + pure logic + tests) and `src/components/macro/` (UI). Type-only imports into `quizData.ts` / `ohlcData.ts` where possible; data modules never import pages.
- Rates in percent with 2 decimals; changes in basis points as integers; payrolls in thousands (integers). Formatting only in components.
- Every user-facing macro surface carries the SIMULATED banner and the real-source link (CHARTER §5).
- Period labels are fictional (`SIM Y2 · Mar`, `SIM Y2 · wk 14`). No real calendar dates on simulated data.
- Do not modify existing macro cases, coach sessions, progress keys, case grading, or Beginner unlocks.

## Build order

| # | Story | Milestone | Acceptance (short) | Status |
|---|-------|-----------|--------------------|--------|
| 1 | MF0.M1.S1 Types + source registry | MF0.M1 | Registry ↔ SOURCES.md 1:1; allowlisted https domains | done |
| 2 | MF0.M1.S2 `test:macro` script | MF0.M1 | Dummy failing test proves the glob, then removed | done |
| 3 | MF0.M2.S1 Consistency checks + broken fixtures | MF0.M2 | Each broken fixture yields exactly its violation | done |
| 4 | MF0.M3.S1 Source checker CLI + log test | MF0.M3 | Bot-blocked hosts have dated manual rows; CLI run logged | done |
| 5 | MF1.M1.S1 Seeded world generator | MF1.M1 | Deterministic; all checks pass every period; bands | done |
| 6 | MF1.M2.S1 ≥ 30 release events | MF1.M2 | Actuals = world; computed surprise; ≥ 6 regimes | done |
| 7 | MF1.M3.S1 Fed path + pricing + dots | MF1.M3 | Range/steps/probabilities/median invariants | done |
| 8 | MF2.M1.S1 SimulatedFrame + render harness | MF2.M1 | Banner + link + disclaimer render | done |
| 9 | MF2.M2.S1 Labor viewers | MF2.M2 | Cells = data; revision sentence computed | done |
| 10 | MF2.M3.S1 Inflation viewers | MF2.M3 | Cells = computed % changes | done |
| 11 | MF2.M4.S1 FRED series + Treasury curve viewers | MF2.M4 | All ids render; spread callout | done |
| 12 | MF2.M5.S1 FOMC statement + dot plot | MF2.M5 | Facts match; 19 dots; median | done |
| 13 | MF2.M6.S1 PMMS + housing starts | MF2.M6 | Week change / year-ago computed | done |
| 14 | MF2.M7.S1 GDP, retail, ISM, sentiment | MF2.M7 | Contributions sum; 50-line labels | done |
| 15 | MF2.M8 Human visual checkpoint | MF2.M8 | Screenshots + PENDING WENG SIGN-OFF | done |
| 16 | MF3.M1.S1 Expectations panel + Fed pricing card | MF3.M1 | No-leak; probabilities sum 100 | done |
| 17 | MF3.M2.S1 ≥ 35 glossary terms | MF3.M2 | Unique ids; references resolve | done |
| 18 | MF4.M1.S1 Transmission rules + regimes | MF4.M1 | Bond proxy opposite 10y; rationale each | done |
| 19 | MF4.M2 Human accuracy checkpoint | MF4.M2 | Rules table render + PENDING WENG SIGN-OFF | done |
| 20 | MF4.M3.S1 Reaction chart generator + validators | MF4.M3 | Direction = label; release slot; monotonic | done |
| 21 | MF4.M4.S1 Reveal annotations | MF4.M4 | Indices/prices in range | done |
| 22 | MF5.M1.S1 ≥ 24 rounds | MF5.M1 | Derived keys; balance; regimes; cited facts | done |
| 23 | MF5.M2.S1 Game UI phases | MF5.M2 | Phase renders; no leak | done |
| 24 | MF5.M3.S1 Progress key + score | MF5.M3 | Persist round-trip; old keys untouched | done |
| 25 | MF5.M4 Human play-through | MF5.M4 | Screenshots + PENDING WENG SIGN-OFF | done |
| 26 | MF6.M1.S1 ≥ 15 lessons | MF6.M1 | Six parts; refs resolve | done |
| 27 | MF6.M2.S1 /macro pages + routes | MF6.M2 | Every lesson renders; not-found card | done |
| 28 | MF7.M1.S1 macro-releases ≥ 14 Q | MF7.M1 | Quiz validator; numbers recomputed | done |
| 29 | MF7.M2.S1 rates-curve ≥ 12 + fed-policy ≥ 12 | MF7.M2 | Same | done |
| 30 | MF7.M3.S1 housing-mortgage ≥ 10 Q | MF7.M3 | Same | done |
| 31 | MF7.M4.S1 macro-reactions ≥ 14 Q | MF7.M4 | Same + chart refs | done |
| 32 | MF8.M1.S1 Training card + groups + Archive | MF8.M1 | Groups ≥ 10 Q each | done |
| 33 | MF8.M2.S1 Case/coach lesson links | MF8.M2 | Mapped ids exist; case data unchanged | done |
| 34 | MF8.M3.S1 Docs + loops | MF8.M3 | Link check green | done |
| 35 | MF8.M4.S1 Final audit | MF8.M4 | Floors recorded | done |
| 36 | MF9.M1.S1 Coach: CPI morning | MF9.M1 | test:coaching green | done |
| 37 | MF9.M2.S1 Yield-curve explorer | MF9.M2 | Render + math test | done |
| 38 | MF9.M3.S1 Home tip | MF9.M3 | Tip names existing route | done |

MF9 stretch stories run after MF8 unless one needs a product decision (then STOP (a)).

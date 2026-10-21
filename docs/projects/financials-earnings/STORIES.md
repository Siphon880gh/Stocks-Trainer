# Stories: Financials, Expectations & Earnings Reactions

Parent: [`EPICS.md`](./EPICS.md) · Charter: [`CHARTER.md`](./CHARTER.md) · Progress: [`PROGRESS.md`](./PROGRESS.md)

Same shape as the root `IMPLEMENTATION_STORIES.md`. **Status key:** `todo` · `in_progress` · `done` · `blocked`. One story `in_progress` at a time. The loop advances stories in order and flips the milestone box in EPICS.md when its last story is `done`.

## Conventions
- New code: `src/lib/financials/` (data + pure logic + tests) and `src/components/financials/` (UI). Use type-only imports into `quizData.ts` (no runtime cycles, same rule as `buySellDrill.ts`).
- Numbers are whole thousands (integers). Formatting happens only in components.
- Every user-facing surface carries `SAMPLE / STYLIZED — fictional company, not a live filing, not trading advice.`
- Do not modify existing `FinancialSnapshot`, `CaseStudy` grading, progress keys, or Beginner unlocks.

## Build order

| # | Story | Milestone | Acceptance (short) | Status |
|---|-------|-----------|--------------------|--------|
| 1 | FE0.M1.S1 Types | FE0.M1 | Types compile; documented units | done |
| 2 | FE0.M1.S2 Tie checks + tests | FE0.M1 | Good fixture passes; each broken fixture yields its one violation | done |
| 3 | FE0.M1.S3 `test:financials` script | FE0.M1 | Script runs; dummy failing test proves the glob, then removed | done |
| 4 | FE0.M2.S1 Driver-based generator | FE0.M2 | Deterministic output (two runs deep-equal) | done |
| 5 | FE0.M2.S2 Three companies × 8 quarters | FE0.M2 | All ties + chain + story assertions pass | done |
| 6 | FE0.M3.S1 Metrics + tests | FE0.M3 | Hand-computed values match; n/m nulls | done |
| 7 | FE1.M1.S1 IncomeStatementTable | FE1.M1 | Render test green | done |
| 8 | FE1.M2.S1 BalanceSheetTable | FE1.M2 | Balance check row ✓ | done |
| 9 | FE1.M2.S2 CashFlowTable | FE1.M2 | Bridge = BS cash | done |
| 10 | FE1.M3.S1 StatementReader tabs + glossary links | FE1.M3 | All glossary ids resolve | done |
| 11 | FE1.M4 Human visual review | FE1.M4 | Weng sign-off in PROGRESS.md | done (signed off 2026-10-21) |
| 12 | FE2.M1.S1 Forecast model + validators | FE2.M1 | Property tests green | done |
| 13 | FE2.M2.S1 Level-1 replica of Weng's table | FE2.M2 | Week 9 net −5k; others 10k | done |
| 14 | FE2.M2.S2 Three realistic forecasts | FE2.M2 | Story assertions (breach week, runway) | done |
| 15 | FE2.M3.S1 CashForecastTable | FE2.M3 | Render test; breach tint; callout | done |
| 16 | FE2.M3.S2 What-if toggles | FE2.M3 | Recompute passes validators; no mutation | done |
| 17 | FE2.M4 Human visual review | FE2.M4 | Weng sign-off | done (signed off 2026-10-21) |
| 18 | FE3.M1.S1 EarningsEvent model + ≥ 12 events | FE3.M1 | Actuals equal fixtures; computed beat/miss | done |
| 19 | FE3.M2.S1 EarningsPreviewCard | FE3.M2 | No-leak pre-reveal test | done |
| 20 | FE3.M3.S1 ≥ 20 glossary terms | FE3.M3 | Terms test green | done |
| 21 | FE4.M1.S1 `volume?` + volume pane + event line | FE4.M1 | Existing charts unchanged (snapshot) | done |
| 22 | FE4.M2.S1 Reaction generator | FE4.M2 | Deterministic | done |
| 23 | FE4.M2.S2 Six archetype validators | FE4.M2 | Every event chart matches its label | done |
| 24 | FE4.M3.S1 Reveal annotations | FE4.M3 | Indices / prices in range | done |
| 25 | FE5.M1.S1 ≥ 12 rounds | FE5.M1 | Derived answer key; balance; facts present | done |
| 26 | FE5.M2.S1 Game UI phases | FE5.M2 | Phase render + no-leak tests | done |
| 27 | FE5.M3.S1 Progress key + score | FE5.M3 | Persist test; old keys unchanged | done |
| 28 | FE5.M4 Human play-through | FE5.M4 | Weng sign-off | done (signed off 2026-10-21) |
| 29 | FE6.M1.S1 `statements-reading` ≥ 12 Q | FE6.M1 | Quiz validator; numeric answers recomputed | done |
| 30 | FE6.M2.S1 `cash-forecast-13wk` ≥ 10 Q | FE6.M2 | Same | done |
| 31 | FE6.M3.S1 `earnings-preview` ≥ 10 Q | FE6.M3 | Same | done |
| 32 | FE6.M4.S1 `earnings-reaction` ≥ 10 Q | FE6.M4 | Same + chart refs | done |
| 33 | FE7.M1.S1 Training card + groups featured | FE7.M1 | Group test green | done |
| 34 | FE7.M2.S1 Optional case `eventId` bridge | FE7.M2 | Case ids / grades unchanged | skipped: needs product decision (see PROGRESS) |
| 35 | FE7.M3.S1 Docs + loops + QA flow + EPIC_MAP pointer | FE7.M3 | Link check green | done |
| 36 | FE7.M4.S1 Final audit | FE7.M4 | Floors recorded → Done(project) | done |

Stretch FE8 stories are added only when Weng says go.

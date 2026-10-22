# Progress log: Financials, Expectations & Earnings Reactions

Append-only. The loop writes one entry per story attempt outcome (PASS, FIX round, or STOP). Newest at the bottom. Times are America/Los_Angeles.

**Current pointer**
- `current_story`: DONE
- `status`: done — Done(project). All checkpoints signed off 2026-10-21; Weng decided FE7.M2 (yes) and FE8.M1 (bank + biotech) on 2026-10-21 and both are built
- `consecutive_failed_attempts`: 0
- `commit_mode`: none

## Human sign-offs
| Checkpoint | Signed by | Date | Notes |
|------------|-----------|------|-------|
| FE1.M4 reader visual | SIGNED OFF — Weng | 2026-10-21 | Screenshots in checkpoints/fe1-*.png; see entry |
| FE2.M4 forecast visual | SIGNED OFF — Weng | 2026-10-21 | Screenshots in checkpoints/fe2-*.png; week-9 inventory adjustment approved |
| FE5.M4 game play-through | SIGNED OFF — Weng | 2026-10-21 | Screenshots in checkpoints/fe5-*.png; follow-through bonus rule approved |
| FE7.M2 decision | DECIDED — Weng | 2026-10-21 | Yes: tag related cases, link a print's reaction to matching cases |
| FE8.M1 decision | DECIDED — Weng | 2026-10-21 | Both: simulated bank (NIM, provisions, deposits) and simulated biotech (runway, burn, readouts, dilution) as companies 4 and 5 |
| FE7.M2 / FE8.M1 visual | PENDING WENG SIGN-OFF | 2026-10-21 | Screenshots in checkpoints/fe7m2-*.png and fe8m1-*.png |

## Entries

<!-- Template:
### 2026-10-21 10:00 PT · FE0.M1.S2 · PASS
- Changed: src/lib/financials/ties.ts (+120/−0), src/lib/financials/ties.test.ts (+90/−0)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 14/14 · temp build ok (deleted)
- Milestone-specific: 1 good + 6 broken fixtures, each broken yields exactly its violation
- Next: FE0.M1.S3
-->

### 2026-10-21 04:53 PT · FE0.M1.S1–S3 · PASS
- Changed: src/lib/financials/types.ts (new), ties.ts (new), ties.test.ts (new), package.json (+2/−1: `test:financials` script)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials green · temp build ok (deleted)
- Milestone-specific: 1 hand-computed good fixture + one broken fixture per rule (8 IS, 7 BS, 6 CF, 2 cross-statement, 11 chain); glob proven with deliberately failing dummy tests at top level (.ts) and nested (.tsx), both caught, then deleted
- Next: FE0.M2.S1

### 2026-10-21 04:53 PT · FE0.M2.S1–S2 · PASS
- Changed: src/lib/financials/companies.ts (new: driver-based generator + Northwind Cloud NWCL.S, Harbor & Pine HBPN.S, Ironbridge Industrial IRBG.S × 8 quarters), companies.test.ts (new)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials green · temp build ok (deleted)
- Milestone-specific: deterministic (deep-equal); all ties + chain ties = 0 violations; story assertions (NWCL losses shrink, FCF < 0 in 7/8, single raise Q1 FY26; HBPN Q4 largest, inventory peaks Q3, dividend, comps negative FY26; IRBG GM ~27% compressing, capex ≥ 8%, 5k/q amortization, leverage 2.6× → 2.9× under 3.5× covenant)
- Next: FE0.M3.S1

### 2026-10-21 04:53 PT · FE0.M3.S1 · PASS
- Changed: src/lib/financials/metrics.ts (new), metrics.test.ts (new)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 66/66 · temp build ok (deleted)
- Milestone-specific: hand-computed fixture (margins, DSO/DIO/DPO on 91-day quarter, CCC, FCF, EBITDA, coverage, QoQ/YoY, TTM, leverage); n/m → null (zero revenue, zero interest, < 4 quarters, TTM EBITDA ≤ 0); NWCL runway < 18 mo before raise, > 2× after
- Next: FE1.M1.S1

### 2026-10-21 05:01 PT · FE1.M1.S1, FE1.M2.S1–S2, FE1.M3.S1 · PASS
- Changed: src/components/financials/{StatementTable,IncomeStatementTable,BalanceSheetTable,CashFlowTable,StatementReader}.tsx (new), src/components/financials/rows.ts (new), src/lib/financials/{format,terms}.ts (new, terms pulled forward from FE3.M3 because the reader links to them), src/lib/financials/{render,terms}.test.ts(x) (new), src/pages/practice/StatementsLab.tsx (new), src/lib/literacyTerms.ts (+2/−0: import + `...FINANCIAL_TERMS` spread), src/App.tsx (+2/−0: route `practice/statements`)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 84/84 · temp build ok (deleted)
- Milestone-specific: render tests: IS columns + parentheses for losses; BS check row = 0 and green for every quarter of all 3 companies; CF bridge ending cash = BS cash; every row glossary id resolves via getLiteracyTerm; reader defaults to latest 4 quarters + disclaimer; metrics show n/m. Visual fixes found in screenshots: cost lines no longer red (red = negative results only), zero line items render "—", table no longer stretches the page on phones (`contain: inline-size`).
- Next: FE1.M4 checkpoint

### 2026-10-21 05:01 PT · FE1.M4 · PENDING WENG SIGN-OFF (loop continued)
- Route: `/practice/statements` (Learn → Misc Practices style page). Deep links: `?company=<id>&tab=income|balance|cashflow|metrics|story&all=1`.
- Screenshots (docs/projects/financials-earnings/checkpoints/): fe1-income-northwind.png, fe1-balance-harbor-all8.png, fe1-cashflow-ironbridge.png, fe1-metrics-ironbridge-all8.png, fe1-story-harbor.png, fe1-mobile-income-northwind.png (true 390 px viewport rendered inside a 600 px frame; the "candlestick_chart" text in the header is the icon font not loading inside the headless iframe, not an app bug).
- What to look at: (1) are the three company stories believable for a beginner? (2) accounting style: costs in parentheses, red only for negative results; (3) the check rows (BS = L + E, CF ending cash = BS cash) read clearly; (4) metrics table density (n/m wording, "not burning" for runway); (5) phone: table scrolls inside its card.
- Next: FE2.M1.S1

### 2026-10-21 05:06 PT · FE2.M1.S1 · PASS
- Changed: src/lib/financials/cashForecast.ts (new: computeForecast, forecastInputViolations, forecastViolations, applyWhatIf), cashForecast.test.ts (new)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials green · temp build ok (deleted)
- Milestone-specific: property loop over all fixtures × 6 what-if combinations (net, ending, beginning chain, headroom, breach iff headroom < 0, revolver roll-forward, limit, breach list); 10 broken-result fixtures each caught; input validator (13 weeks, non-negative integers, callout range); tiny revolver still capped at its limit
- Next: FE2.M2.S1

### 2026-10-21 05:06 PT · FE2.M2.S1–S2 · PASS
- Changed: src/lib/financials/cashForecastFixtures.ts (new: level1-replica, harbor-collections-slip, ironbridge-debt-service, northwind-runway)
- Verify: as above
- Milestone-specific: replica week 9 net −5, other weeks +10, only 4 source rows; HBPN collections slip wk 5–9, draws only wk 7–9, repaid by wk 11, without line first breach wk 7; IRBG without revolver breach = [7] only, with revolver draw wk 7 repaid by wk 10, same 15k covenant as the statements; NWCL no revolver, first breach wk 12, starts from Q4 FY26 cash
- ⚠️ Data note for sign-off: in Weng's source sketch week 9 kept Inventory at 15k, which nets −10k, not −5k. Fixture uses Inventory 10k in week 9 so the stated −5k ties; disclosed under the table.
- Next: FE2.M3.S1

### 2026-10-21 05:06 PT · FE2.M3.S1–S2 · PASS
- Changed: src/components/financials/CashForecastTable.tsx (new), CashForecastPanel.tsx (new), src/pages/practice/StatementsLab.tsx (forecast section + `?forecast=&delay=1&defer=1&revolver=0` deep links), render.test.tsx (+3 tests)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 111/111 · temp build ok (deleted)
- Milestone-specific: replica renders only source rows, net week 9 "(5)", callout pin; IRBG no-revolver tints exactly week 7 (ending + headroom); panel summary chips + 3 what-ifs (delay collections, defer capex, use revolver); what-ifs never mutate fixtures (deep-equal snapshot), recomputed results pass validators. Visual fix found in screenshots: compact forecast table so all 13 weeks fit on desktop without scrolling.
- Next: FE2.M4 checkpoint

### 2026-10-21 05:06 PT · FE2.M4 · PENDING WENG SIGN-OFF (loop continued)
- Route: `/practice/statements#forecast` (below the statement reader). Deep links: `?forecast=<id>&delay=1&defer=1&revolver=0`.
- Screenshots (checkpoints/): fe2-level1-replica.png, fe2-ironbridge-with-revolver.png, fe2-ironbridge-no-revolver-breach.png, fe2-harbor-collections-slip.png, fe2-harbor-delay-whatif.png, fe2-northwind-runway.png, fe2-mobile-level1.png.
- What to look at: (1) the replica vs your sketch, including the week 9 inventory 10k adjustment; (2) row order in the replica is Inventory, Opex, Ad spend (model order), your sketch had Inventory, Ad, Opex; say if order matters; (3) breach tint + headroom row legibility; (4) the 📌 callout wording "See it before you commit"; (5) whether "Revolver draw/repay" rows of zeros should hide when the revolver is toggled off.
- Next: FE3.M1.S1

### 2026-10-21 05:11 PT · FE3.M1.S1 · PASS
- Changed: src/lib/financials/earningsEvents.ts (new: 14 events, computed beat/miss/in-line + raise/maintain/cut, gap direction, story-consistency validator), earningsEvents.test.ts (new)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 150/150 · temp build ok (deleted)
- Milestone-specific: 14 events (NWCL 5, HBPN 5, IRBG 4), each archetype ≥ 2; actual EPS/revenue read from fixtures; claimed labels = computed labels; implied move 2–20%; whisper side matches story; archetype rules (gap-and-go/PEAD need beat+raise or miss+cut, guidance-reversal = beat + cut, sell-the-news = run-up ≥ 8% and no raise, gap-fill = maintained guide, muted = in-line + maintain); 7 broken fixtures caught
- Next: FE3.M2.S1

### 2026-10-21 05:11 PT · FE3.M2.S1 · PASS
- Changed: src/components/financials/EarningsPreviewCard.tsx (new), render.test.tsx (+14 no-leak tests)
- Verify: as above
- Milestone-specific: for all 14 events the pre-reveal markup has no actual EPS (when it differs from consensus/whisper), actual revenue, headline, new guidance, explanation, reaction name or outcome chips; post-reveal has them. Data tweak: irbg-q3fy25 new guide low 159,000 → 159,500 (still "maintain") so it no longer coincides with the prior guide high.
- Next: FE3.M3.S1

### 2026-10-21 05:11 PT · FE3.M3.S1 · PASS
- Changed: src/lib/financials/terms.ts (33 terms total: 28 from FE1 + kpi, implied-move, pre-earnings-run-up, positioning, volume-spike), terms.test.ts (summary ≤ 140 chars)
- Verify: as above
- Milestone-specific: ≥ 20 new; unique across LITERACY_TERMS; every reader/preview glossary id resolves (existing `guidance`, `free-cash-flow`, `net-margin` reused, not duplicated). Whisper / beat-and-raise / sell-the-news stay in earningsJargon.ts (JargonText popovers), not duplicated as literacy terms.
- Next: FE4.M1.S1

### 2026-10-21 05:15 PT · FE4.M1.S1 · PASS
- Changed (shared, additive): src/lib/ohlcData.ts (+2/−0: `volume?`), src/lib/chartAnnotations.ts (+9/−0: `ChartEvent`, `events?`), src/components/CandlestickChart.tsx (+66/−3: `showVolume`, `VOLUME_PANE_HEIGHT`, event lines, tooltip V), AGENTS_CODE_REFERENCE-charts.md (+15/−0: API doc for reuse by the macro worker). New: src/lib/financials/chartSnapshotCases.tsx, chartSnapshotData.ts, __snapshots__/candlestick-baseline.json (hashes captured BEFORE the chart edit).
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 (incl. ohlcData.test.ts) · test:financials 190/190 · temp build ok (deleted)
- Milestone-specific: 4 existing render cases byte-identical to the pre-change baseline; volume pane adds exactly 56 px with one bar per candle; ignored when compact or no volume (markup identical); event line labelled, price axis unchanged
- Next: FE4.M2.S1

### 2026-10-21 05:15 PT · FE4.M2.S1–S2 · PASS
- Changed: src/lib/financials/reactionCharts.ts (new: seeded generator, 30 pre + report + 15 post bars with volume; per-archetype validator), reactionCharts.test.ts (new)
- Verify: as above
- Milestone-specific: deterministic; all 14 event charts pass: |gap| ≥ 0.8 × implied (muted < implied and report-bar range inside band), direction matches, gap-fill touches prior close within 8 bars, gap-and-go never fills and extends 5 bars, sell-the-news red report bar after ≥ 8% chart run-up, guidance-reversal gaps up and closes red below prior close, PEAD 10-bar return with the gap (≥ 0.3 × implied), report volume ≥ 3 × 20-bar average, chart run-up = event run-up (±0.5 pt), no flat bars, no gaps outside the report bar; 7 broken charts caught
- Next: FE4.M3.S1

### 2026-10-21 05:15 PT · FE4.M3.S1 · PASS
- Changed: reactionCharts.ts (`revealAnnotations`: prior-close level, implied band zone, gap zone, Report event line, fill point / drift or hold trendline / fade point, related term ids)
- Verify: as above
- Milestone-specific: all indices in range, zone/level/point prices within chart extent ± implied move, related terms resolve (gap-reversal, gap-continuation, priced-in reused from existing glossary)
- Next: FE5.M1.S1

### 2026-10-21 05:25 PT · FE5.M1.S1 · PASS
- Changed: src/lib/financials/readThePrint.ts (new: 5 call options + 3 follow-through options, `answerFor(archetype, direction)`, `followFor`, 14 rounds built from EARNINGS_EVENTS with generated facts / "what mattered" / per-option "why not"), readThePrint.test.ts (new)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 217/217 · temp build ok (deleted)
- Milestone-specific: answer key derived (never hand-typed), sequence ADEBCBAEDBACBC; every option is correct ≥ 2 times; no option > 4; no 3-in-a-row; facts quote fixture numbers; each wrong option has a "why not".
- Accuracy fix found at the checkpoint: non-muted gaps were 0.9–1.25 × the implied move, so a "real" gap could sit inside the band (hbpn-q2fy26 −5.8% vs ±6%), which contradicted option E ("Muted, inside the implied move"). The generator now uses 1.05–1.40 ×, and the validator requires |gap| > the implied move for every non-muted event. All 14 pass.
- Next: FE5.M2.S1

### 2026-10-21 05:25 PT · FE5.M2.S1 · PASS
- Changed: src/components/financials/ReadThePrintGame.tsx (new), src/pages/practice/ReadThePrint.tsx (new), src/App.tsx (+2 route/import, additive), render.test.tsx (+phase / no-leak tests)
- Verify: as above
- Milestone-specific: phases read → answer → follow → reveal. Before reveal: only the 30 pre bars, preview card and prior quarters (the reported quarter is excluded). Tests check that, for all 14 rounds in read and answer phases, no actual EPS / revenue / new guide / reaction name / headline leaks. Reveal shows the full chart with volume and annotations, facts, why-not and related terms.
- Next: FE5.M3.S1

### 2026-10-21 05:25 PT · FE5.M3.S1 · PASS
- Changed: src/lib/financials/readThePrintProgress.ts (new; key `analysis_core_read_the_print_v1`), tests
- Verify: as above
- Milestone-specific: 2 points for the call + 1 for the follow-through; best session persisted; JSON round-trip; null store = no persistence; existing keys untouched (analysis_core_progress_v1, misc_practices_done_v1 not read or written).
- Next: FE5.M4

### 2026-10-21 05:26 PT · FE5.M4 · PENDING WENG SIGN-OFF (loop continued)
- Route: `/practice/read-the-print`. Deep links: `?round=n&phase=read|answer|follow|reveal&pick=A-E&follow=with|against|chop`.
- Screenshots (checkpoints/): fe5-r1-read.png, fe5-r1-answer.png, fe5-r2-reveal-wrong-pick.png, fe5-r6-reveal-guidance-reversal.png, fe5-r11-reveal-pead.png, fe5-mobile-r1-answer.png.
- What to look at: (1) whether the pre-report info (preview + last quarters + 30 bars) is enough to make a fair call; (2) the follow-through bonus is awarded even when the main call is wrong (r2 shows "bonus +1"). Say if it should need a correct call; (3) wording of the five options, especially E "Muted (inside the implied move)"; (4) reveal annotations density on the chart; (5) mobile stacking order (preview → chart → statement → options). Note: in the mobile harness the icon font hadn't loaded, so "candlestick_chart" / "info" show as text; desktop renders the icons.
- Next: FE6.M1.S1

### 2026-10-21 05:36 PT · FE6.M1.S1–FE6.M4.S1 · PASS
- Changed (new): src/lib/financials/quizBanks.ts (4 banks + group metadata + `isFinancialsQuizGroup`), src/lib/financials/quizExhibit.ts (`FinancialsExhibit` type), src/components/financials/FinancialsQuizExhibit.tsx, financialsQuiz.test.ts, financialsQuiz.render.test.tsx. Own file: CashForecastTable.tsx (+`hideBreachCues`).
- Changed (shared, additive): src/lib/quizData.ts (+9/−1: imports, optional `financialsExhibit` field, 4 group ids in `QuizGroupId`, `...FINANCIALS_QUIZ_GROUPS` right after `financial-drills`, one bank lookup line in `questionsArrayForGroup` / `getQuestionsForGroup`); src/components/QuizModal.tsx (+4/−1: import + one branch that renders the exhibit before the snapshot card).
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 232/232 · temp build ok (deleted)
- Milestone-specific: statements-reading 13, cash-forecast-13wk 11, earnings-preview 11, earnings-reaction 11 (all chart-based). The validator checks unique FIN- ids across all groups, 4 options, answer exists, distinct labels, feedback on every wrong option, glossary ids resolve, no NaN / n/m, and each letter correct ≥ 2× and ≤ 40% per group. Exhibits resolve (company / quarter range / forecast / event); reaction chart keys exist and highlight indices are in range. Every numeric answer is recomputed from raw fixture fields (statements, `computeForecast`, events, generated bars). Answers are computed (never typed); preview questions about the upcoming print don't reveal actuals; forecast exhibits hide the breach tint and headroom row until the answer is submitted (the screenshot QA found they gave CF-01 / CF-02 away); reaction teaching marks show only after the answer.
- QA screenshots (not a sign-off checkpoint): checkpoints/fe6-quiz-statements-reading.png, fe6-quiz-cash-forecast-13wk.png (re-shot after the fix: no breach tint before answering), fe6-quiz-earnings-preview.png, fe6-quiz-earnings-reaction.png. Deep link: `/training?group=<id>&start=1`.
- Known, not mine: AnswerSheetModal falls back to a hammer chart for any question without `patternKey` (already true for the literacy groups). Left untouched; logged for Weng.
- Next: FE7.M1.S1

### 2026-10-21 05:41 PT · FE7.M1.S1 · PASS
- Changed (new): src/components/financials/FinancialsTrainingCard.tsx (Read the Print with rounds played / best session, Statements lab, 13-week forecast, and 4 group links that open the quiz via `/training?group=<id>&start=1`), src/lib/financials/integration.test.tsx.
- Changed (shared, additive): src/pages/Training.tsx (+6/−1: 2 imports, `|| isFinancialsQuizGroup(g.id)` in the featured list, the card above Misc Practices). MISC_PRACTICE_ITEMS is left alone because practiceLabs.test.ts pins that list.
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 235/235 · temp build ok (deleted)
- Milestone-specific: every new group is in QUIZ_GROUPS (featured, right after `financial-drills`) and returns ≥ 10 questions via `getQuestionsForGroup`; all 33 FINANCIAL_TERMS are in LITERACY_TERMS (Archive literacy tab); card render test checks the links and the progress line. Screenshot: checkpoints/fe7-training-card.png.
- Next: FE7.M2.S1

### 2026-10-21 05:50 PT · FE7.M2.S1 · SKIPPED (needs a product decision; optional milestone)
- Finding: no existing earnings case (`EARNINGS_CASES` in src/lib/caseStudies.ts: case-earn-*, NKE.S / JPM.S / UNH.S / GIS.S / CRM.S / NEE.S / DAL.S and unnamed SAMPLE companies) is about Northwind, Harbor & Pine or Ironbridge. Each case has its own `statementSnapshot` numbers, so "a richer event, when one exists" never exists.
- Options for Weng: (a) leave cases alone (current); (b) add an optional `relatedEventId` that only shows a "Practice this setup in Read the Print" link in the debrief (thematic matches: case-earn-guidance-cut ↔ irbg-q1fy26, case-earn-retail-beat-thin ↔ hbpn-q1fy26); (c) write new cases on the FE companies that embed the preview card. (b) and (c) change what CasePlayer shows, so they need your call. No code changed; case ids and grades untouched.
- Next: FE7.M3.S1

### 2026-10-21 05:50 PT · FE7.M3.S1 · PASS (resumed after an interruption: the doc edits had landed, the log hadn't; checks re-run)
- Changed (docs, additive): AGENTS_CODE_REFERENCE-data.md (+new "Financials & earnings project" section), AGENTS_CODE_REFERENCE-training.md (+1 bullet: groups, `financialsExhibit`, card, routes), LOOPS/LOOP-Learn.md (+project groups 20–23 owned by this project), docs/projects/content-graph/LOOP-Graph.md (the `statements` echo family names the 4 groups + Practice routes), QA_User_Flows.md (+UF-19 and matrix row G16), EPIC_MAP.md (+pointer row "FE (project)"). LOOPS/README.md already indexed the project loop (done in planning).
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 235/235 · link check across 16 touched docs: 0 broken (the checker flags a deliberately broken link)
- Next: FE7.M4.S1

### 2026-10-21 05:53 PT · FE7.M4.S1 · PASS (audit) · project status: DONE PENDING WENG SIGN-OFF
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 235/235 (12 test files) · temp build ok (deleted) · `git status dist/` clean · no commits made by this loop (the one local commit ahead of origin, d9ff4c6 at 04:33 PT, is Weng's own, made before the project, with no financials files)
- Charter floors, recounted from code and validated with 0 violations:

| Floor | Required | Actual |
|---|---|---|
| Fictional companies × quarters, tied | ≥ 3 × 8 | 3 × 8 (NWCL.S, HBPN.S, IRBG.S); 0 tie violations |
| 13-week forecasts incl. the level-1 replica | ≥ 4 | 4 (level1-replica, harbor-collections-slip, ironbridge-debt-service, northwind-runway); 0 violations |
| Earnings events with preview + actuals + reaction chart, all 6 archetypes | ≥ 12, 6/6 | 14, 6/6; 0 event / chart violations |
| Read-the-Print rounds, balanced key | ≥ 12 | 14; A3 B4 C3 D2 E2 |
| New Learn questions | ≥ 40 | 46 (statements-reading 13, cash-forecast-13wk 11, earnings-preview 11, earnings-reaction 11) |
| New glossary terms | ≥ 20 | 33 |

- Not yet Done(project) per charter §7: (1) FE7.M2 skipped, waiting on a product decision; (4) human checkpoints FE1.M4, FE2.M4 and FE5.M4 are PENDING WENG SIGN-OFF. Once Weng signs off and decides FE7.M2, flip this to Done(project).
- Next: FE8 stretch (Weng said go in the drain instruction); see the entries below.

### 2026-10-21 05:58 PT · FE8.M1 · SKIPPED (needs a product decision)
- The spec says "a bank (NII) **or** a biotech with binary events": choosing one is a product call, and both change the model. A bank has no COGS / gross margin (it needs NII, provisions, CET1 and a different statement shape and metrics), and a binary biotech readout is a 7th reaction archetype (gap with no fill / drift logic) plus new Read-the-Print options. No code changed. Tell me which one (or both) and whether to add the new archetype to the game.
- Next: FE8.M2

### 2026-10-21 05:58 PT · FE8.M2 · PASS
- Changed (new): src/lib/financials/coachEarningsWeek.ts (session `earnings-week`: preview → plan → print → reaction → success, 4 wrong branches with `rewind_to`; every number built from irbg-q1fy26 + its generated chart), coachEarningsWeek.test.ts.
- Changed (shared, additive): src/lib/coaching/sessions/index.ts (+2/−0: import + list entry).
- Verify: test:coaching 24/24 (the existing catalog / validation tests include the new session) · test:financials 238/238 · src/lib 63/63 · lint: my files clean; the one tsc error at the time was in the macro worker's in-progress src/lib/macro/caseLinks.ts (not mine; re-checked below).
- Milestone-specific: validateCoachingSession ok; in listSessions / loadSession; every wrong choice rewinds to its own step; the print / reaction messages quote the fixture EPS and the chart's open / close; preview + plan steps leak no actuals. Screenshot: checkpoints/fe8-coach-earnings-week.png (`/coach/earnings-week`).
- Next: FE8.M3

### 2026-10-21 06:05 PT · FE8.M3 · PASS
- Changed (new): src/lib/financials/markTheBand.ts (`bandTruth`, `filledAfter`, `gradeBand` with ±0.5% band / ±0.25% fill tolerance, `BAND_ROUNDS` in Read the Print order), src/components/financials/MarkTheBand.tsx (phases band → fill → reveal; the user's lines are drawn as annotation levels so the chart always fits them, with exact prices), src/pages/practice/MarkTheBand.tsx (`?round&phase&low&high&fill`), markTheBand.test.tsx. Own file: FinancialsTrainingCard.tsx (+Mark the band link).
- Changed (shared, additive): src/App.tsx (+2: import + `practice/mark-the-band` route). Docs: AGENTS_CODE_REFERENCE-data.md (+1 FE8 bullet), QA_User_Flows.md (UF-19 step 7).
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 241/241 · temp build ok (deleted) · link check 0 broken
- Milestone-specific: truth = prior close × (1 ± implied) from the generated chart; gap-fill events fill within 8 sessions, gap-and-go never fills; non-muted gaps leave the band, muted stay inside; band phase renders 30 bars, fill phase 31, reveal 46; no outcome text before reveal (all 14 rounds); "dollars instead of percent" scores 0. Screenshot QA found the first version's user lines clipped off the chart (markers don't widen the price range) and labels rounded to whole dollars; both fixed.
- Screenshots (QA, not a sign-off checkpoint): checkpoints/fe8-band-r2-band.png, fe8-band-r2-fill.png, fe8-band-r2-reveal.png, fe8-band-mobile-r2-reveal.png.
- Loop state: all FE0–FE7 milestones done except FE7.M2 (skipped, product decision); FE8.M2–M3 done, FE8.M1 skipped (product decision). Remaining for Done(project): Weng sign-off on FE1.M4 / FE2.M4 / FE5.M4 and decisions on FE7.M2 / FE8.M1.

### 2026-10-21 11:05 PT · Sign-offs recorded
- Weng ("I approve all"): FE1.M4, FE2.M4 (incl. the week-9 inventory adjustment) and FE5.M4 (incl. the follow-through bonus rule) SIGNED OFF.
- Still open (not decided by the blanket approval): FE7.M2 cases bridge and FE8.M1 4th company. Options are in the FE7.M2 / FE8.M1 entries above.

### 2026-10-21 21:14 PT · Weng decisions on FE7.M2 and FE8.M1
- FE7.M2: **yes** — bridge the earnings games to the case library (tag related cases; link from a print's reaction to matching cases).
- FE8.M1: **both** — a simulated bank (NIM, loan-loss provisions, deposits) and a simulated biotech (runway, burn, trial readouts, dilution) as companies 4 and 5, same depth as the first three.

### 2026-10-21 21:14 PT · FE7.M2.S1 · PASS
- Changed: src/lib/financials/caseLinks.ts (new: 8 earnings cases tagged with 1–2 Read the Print events each + the shared lesson; `printLinksForCase`, `casesForEvent`), src/components/financials/CasePrintLink.tsx (new), src/pages/CasePlayer.tsx (+2: renders `CasePrintLink` after `CaseMacroLink`), src/components/financials/ReadThePrintGame.tsx ("Same setup in the case library" on the reveal, `data-testid=rtp-related-cases`), src/lib/financials/caseLinks.test.tsx (new).
- Tags live outside the case objects, so `caseStudies.ts` and grading are untouched. The test pins all 12 earnings case ids and their correct answers, checks every tag resolves to a real case and a real round, and that no link renders before the reveal.
- Checkpoints: checkpoints/fe7m2-case-player-link.png, fe7m2-rtp-reveal-related-cases.png (PENDING WENG SIGN-OFF).

### 2026-10-21 21:14 PT · FE8.M1.S1–S5 · PASS
- Bank (Bayline Bancorp `BAYB.S`, simulated): optional bank lines in `types.ts` (counted with `?? 0`, so the first three companies are unchanged) + `bankViolations` in `ties.ts`; `bankBuilder.ts` (NII, provision, allowance roll-forward prior + provision − NCO, deposits, securities, simplified CET1 = (equity − other assets) ÷ (loans + 20% securities), labelled simplified); `bankMetrics.ts` (NIM, efficiency, NCO ratio, provision ÷ NCO, allowance ÷ loans, NPL, LDR, ROE, ROA, BVPS, TBVPS). Story: NIM 3.43% → 2.91% as deposit costs reprice and deposits run off, reserve build in FY25, recovery to 3.37% by Q4 FY26. Statements show in bank format (NII → PPNR → provision; loans net of allowance, deposits) with a caption; industrial ratios show n/m.
- Biotech (Kestrel Biotherapeutics `KSTL.S`, simulated): royalty revenue (12% of partner sales, destocking dip Q3 FY26), R&D burn, KB-207 Phase 2 failure → R&D cut, ATM raise Q2 FY25 (3,000k shares), follow-on Q2 FY26 (11,000k shares at $18.18); runway 19.4 → 34.8 months.
- 8 earnings events (4 each, archetypes A–E covered for the bank, A–D for the biotech) appended as Read the Print rounds 15–22 (PRINT_ROUNDS 14 → 22); preview / facts use the company's revenue label; bank rounds show NIM, efficiency, provision ÷ charge-offs and CET1 chips.
- Trial readouts: `trialReadouts.ts` + `TrialReadoutPanel` at `/practice/statements#readouts` (3 readouts: Phase 2 miss, interim continue, Phase 3 met + follow-on). Sizing question = 1% risk budget ÷ implied move; follow-up covers dilution / R&D cut / futility. Separate module, not a 7th archetype.
- Quiz: `quizBanksSector.ts` appends 12 questions to the existing FE6 groups (statements-reading B1–B4, K1–K4; earnings-preview B1, K1; earnings-reaction B1, K1); answers recompute from raw fields. Glossary: 23 terms (15 bank, 8 biotech).
- Spec-driven test updates (not weakening): company count 3 → 5 in earningsEvents.test.ts; "1/14 rounds played" → "1/22" in integration.test.tsx. New sectorCompanies.test.tsx (ties, 9 broken bank fixtures, story assertions, metrics, events, rounds, readouts, quizzes, terms, no-leak renders).
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 161/161 · test:financials 333/333 · test:macro 72/72 · temp build ok (deleted)
- Docs: EPICS.md (FE7.M2, FE8.M1 [x]), STORIES.md (#34 done; #35–39 added), AGENTS_CODE_REFERENCE-data.md (+1 bullet), QA_User_Flows.md (UF-19 steps 8–9, 1/22).
- Checkpoints: checkpoints/fe8m1-*.png (PENDING WENG SIGN-OFF).
- Loop state: every FE0–FE8 milestone done. Done(project).


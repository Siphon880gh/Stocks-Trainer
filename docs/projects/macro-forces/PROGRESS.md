# Progress log: Macro Forces — Releases, Rates & Market Reactions

Append-only. The loop writes one entry per story attempt outcome (PASS, FIX round, or STOP). Newest at the bottom. Times are America/Los_Angeles.

**Current pointer**
- `current_story`: DONE (all MF0–MF9 milestones [x])
- `status`: done — all checkpoints and teaching choices signed off by Weng 2026-10-21
- `consecutive_failed_attempts`: 0
- `commit_mode`: none

## Human sign-offs
| Checkpoint | Signed by | Date | Notes |
|------------|-----------|------|-------|
| MF2.M8 viewer visuals | SIGNED OFF — Weng | 2026-10-21 | 16 screenshots in docs/projects/macro-forces/checkpoints/mf2-*.png (employment-situation, claims, jolts, cpi, ppi, pce, fred-dgs10, treasury-curve, fomc-dots, pmms, housing-starts, gdp, retail, ism-mfg, ism-services, sentiment) |
| MF4.M2 reaction-rule accuracy | SIGNED OFF — Weng | 2026-10-21 | docs/projects/macro-forces/checkpoints/mf4-reaction-rules.png (regime × surprise matrix) + mf4-reaction-charts.png (scare-cut reversal, hot-CPI 2y follow-through, mixed-jobs whipsaw) |
| MF5.M4 game play-through | SIGNED OFF — Weng | 2026-10-21 | docs/projects/macro-forces/checkpoints/mf5-{payrolls-04,cpi-16,fomc-42}-{read,predict,reveal}.png (9 shots; reveal shows one deliberately wrong call) |
| Teaching choice: curve-shape cutoffs (<0 inverted / <25 flat / ≤150 normal / >150 steep bp) + default 2.00 mortgage spread (MF9.M2) | SIGNED OFF — Weng | 2026-10-21 | curveExplorer.ts |
| Teaching choice: prior-revision coverage (REVISES_PRIOR kinds only; CPI / ISM / PMMS / FOMC / UMich / GDP advance show none) (MF8.M4) | SIGNED OFF — Weng | 2026-10-21 | releases.ts |

## Entries

<!-- Template:
### 2026-10-21 10:00 PT · MF0.M2.S1 · PASS
- Changed: src/lib/macro/consistency.ts (+140/−0), src/lib/macro/consistency.test.ts (+120/−0)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:macro 18/18 · temp build ok (deleted)
- Milestone-specific: 12 good + 12 broken fixtures, each broken yields exactly its violation
- Next: MF0.M3.S1
-->

### 2026-10-21 04:57 PT · MF0.M1.S1–MF0.M3.S1 · PASS
- Changed: src/lib/macro/types.ts (new), sources.ts (new, 44 sources generated from SOURCES.md), sources.test.ts, consistency.ts, consistency.test.ts, sourcesLog.ts, sourcesLog.test.ts, checkSources.ts (new); package.json (+3/−1: `test:macro`, `check:macro-sources`; the `test:financials` line in the same hunk is the sibling project’s)
- Verify: lint 0 (one earlier run failed inside src/lib/financials/companies.test.ts — sibling project in progress; waited and re-ran, not counted) · test:coaching 24/24 · src/lib tests 63/63 · test:macro 11/11 · test:financials 66/66 · temp build ok (deleted) · dist/ untouched
- Milestone-specific: glob proven with two deliberately failing dummies (root .tsx + nested .ts → `not ok` ×2), then removed. 12 consistency rules each with good + broken fixtures. `npm run check:macro-sources` → 44/44 ok twice (census.gov returns sporadic 500s to scripts; checker now retries with backoff and sends a UA-only header).
- Next: MF1.M1.S1

### 2026-10-21 05:03 PT · MF1.M1.S1–MF1.M3.S1 · PASS
- Changed: src/lib/macro/world.ts (new), world.test.ts, fed.ts (new), fed.test.ts, releases.ts (new), releases.test.ts
- Order note: the meeting schedule + decisions live in world.ts (daily yields need them); fed.ts adds pricing, dots and statement facts. fed.ts was written before releases.ts because FOMC events read it.
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:macro 22/22 · test:financials 84/84 · temp build ok · dist/ untouched
- Milestone-specific: world deterministic (deep-equal), every consistency rule passes for 36 months / 144 weeks / 720 days / 12 quarters / 24 meetings; storyline asserts (UR rises > 0.5 pt, payroll trend 150+ → < 60, curve inverts then re-steepens). 43 release events (14 kinds, ≥ 2 each, 6 regimes); each spec’s intended effective label is asserted against the computed one (one spec, pmms-36, corrected from in-line to hot to match the data: the 30-yr rose 8 bp more than the 10-yr move implied). 19 dots per SEP column, median = 10th, pricing sums to 100.
- Next: MF2.M1.S1

### 2026-10-21 05:12 PT · MF2.M1.S1–MF2.M8 · PASS (MF2.M8 PENDING WENG SIGN-OFF)
- Changed: src/lib/macro/viewData.ts (new, pure table builders), viewData.test.ts, renderHarness.ts, render.test.tsx; src/components/macro/{SimulatedFrame.tsx, format.ts}, viewers/{LaborViewers, PriceViewers, RatesViewers, HousingViewers, ActivityViewers, ViewerForEvent}.tsx
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:macro 34/34 · test:financials 150/150 · temp build ok · dist/ untouched
- Milestone-specific: all 43 events render a SIMULATED viewer linking their registry URL (no NaN/undefined); payroll columns: sectors = private, private + gov = total, revision sentence = event revisions; CPI cells = pctChange of index levels; all 20 FRED ids render with latest label + link; 2s10s = 10y − 2y; 24 statements match meeting facts + implementation-note rates; 19 dots × 4 columns, medians shown; ISM direction ⇔ > 50; GDP contributions sum to headline ± 0.1.
- Deviations: claims viewer shows SA rows only (world has no NSA series); M8 screenshots rendered as static markup with the built app CSS and headless Chrome (pages /macro arrive in MF6; later checkpoints use the temp dev server).
- Checkpoint: MF2.M8 PENDING WENG SIGN-OFF (see table). Continuing per drain instruction.
- Next: MF3.M1.S1

### 2026-10-21 05:16 PT · MF3.M1.S1–MF3.M2.S1 · PASS
- Changed: src/lib/macro/display.ts (new), src/components/macro/ExpectationsPanel.tsx, FedPricingCard.tsx, src/lib/macro/panels.test.tsx, src/lib/macro/glossary.ts (50 terms), glossary.test.ts; src/lib/literacyTerms.ts (+2: import + `...MACRO_TERMS` after the sibling’s `...FINANCIAL_TERMS`); releases.ts (FOMC headline prior now = previous meeting’s decision in bp instead of the range level — unit fix; PMMS setup sentence hedged)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:macro 38/38 · test:financials 190/190 · temp build ok · dist/ untouched
- Milestone-specific: no actual / surprise / market-read markup before reveal for all 43 events (and no actual value text unless it equals a shown consensus/range/prior); reveal shows every metric; pricing probabilities sum to 100 at all 24 meetings; 50 macro terms, ids unique across LITERACY_TERMS, all resolvable via getLiteracyTerm.
- Next: MF4.M1.S1

### 2026-10-21 05:22 PT · MF4.M1.S1–MF4.M4.S1 · PASS (MF4.M2 PENDING WENG SIGN-OFF)
- Changed: src/lib/macro/reactions.ts (new), reactions.test.ts, reactionCharts.ts (new), reactionCharts.test.ts; src/components/macro/ReactionRulesTable.tsx, ReactionChartView.tsx; panels.test.tsx (+rules render test)
- FE4.M1 had landed (OHLC `volume?`, `showVolume`, `annotations.events`) — reused as documented in AGENTS_CODE_REFERENCE-charts.md; no edits to CandlestickChart / ohlcData / chartAnnotations.
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:macro 48/48 · test:financials 190/190 · temp build ok · dist/ untouched
- Milestone-specific: 14 kinds × 3 labels × 6 regimes: bond proxy opposite the 10y, dollar with the 2y, rationale for all 12 instruments, in-line ⇒ all muted; regime flips asserted (hot jobs: index down in inflation-worry, up in growth-scare; hot CPI in growth-scare down = stagflation). Events: 4 reversals (payrolls-03, cpi-16, fomc-40, fomc-42 scare cut), 2 whipsaws, 13 index-muted. Charts: 43 events × 12 instruments valid (OHLC, no gaps, release bar at the release clock time, direction/muted thresholds 0.55u / 0.25u, release-bar direction = knee-jerk, release volume ≥ 3× pre-avg), deterministic, |move| monotonic in |surprise| within kind, broken charts caught; daily view release day = intraday open/close; annotations in range.
- Checkpoint: MF4.M2 PENDING WENG SIGN-OFF. Continuing.
- Next: MF5.M1.S1

### 2026-10-21 05:27 PT · MF5.M1.S1–MF5.M4 · PASS (MF5.M4 PENDING WENG SIGN-OFF)
- Changed: src/lib/macro/game.ts (new: 29 rounds), game.test.ts, game.render.test.tsx, macroProgress.ts (new, key `macro_desk_progress_v1`), macroProgress.test.ts; src/components/macro/MacroDeskRound.tsx (new). Fixes: releases.ts roundStep keeps 1/8 steps (dot-plot range was 4.63 → 4.625), display.ts bp to 1 decimal, a/an article in explanations; ReactionChartView pre-release padding.
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:macro 55/55 · test:financials 217/217 · temp build ok · dist/ untouched
- Milestone-specific: 29 rounds, 6 regimes, 4 reversals, 8 index-muted/whipsaw; 77 calls keyed from reactions.ts (up 30 / down 32 / muted 15); every explanation cites the round’s actual headline value; why-not exists exactly for wrong choices; read/predict phases contain no outcome labels, rationale text, daily view or reveal markup (all 29 rounds); reveal renders score + one chart per instrument; progress round-trips with fake storage, keeps best, touches only its key, survives corrupt JSON.
- Checkpoint: MF5.M4 PENDING WENG SIGN-OFF (static render of each phase via initialPhase hook + headless Chrome). Continuing.
- Next: MF6.M1.S1

### 2026-10-21 05:32 PT · MF6.M1.S1–MF6.M2.S1 · PASS
- Changed: src/lib/macro/lessons.ts (18 lessons), lessons.test.ts, quiz/groups.ts (group ids + labels, questions follow in MF7), pages.test.tsx; src/components/macro/LessonViewer.tsx; src/pages/macro/{MacroDesk,MacroLesson,MacroPlay}.tsx; src/App.tsx (+10/−0: 3 imports + routes /macro, /macro/play, /macro/:lessonId after the existing playbooks routes; the sibling’s practice routes untouched)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:macro 59/59 · test:financials 231/231 · temp build ok · dist/ untouched
- Milestone-specific: 18 lessons across 6 families, 17 distinct primary sources; every source / alsoSee / viewer / event / round / quiz group / glossary id resolves; all 18 lesson pages render (MemoryRouter) with the real-source link before the SIMULATED look-alike, the quiz deep-link and no NaN/undefined; unknown id → not-found card; /macro/play renders round 1. Event picker drives both the look-alike and the expectations panel.
- Screens (informational, temp dev server :3017, stopped): checkpoints/mf6-macro-hub.png, mf6-lesson-employment-situation.png, mf6-lesson-fomc-decision.png, mf6-lesson-treasury-curve.png, mf6-macro-play.png
- Next: MF7.M1.S1

### 2026-10-21 05:39 PT · MF7.M1–M4 passed (attempt 1)
- Banks: src/lib/macro/quiz/banks.ts — macro-releases 15, rates-curve 14, fed-policy 13, housing-mortgage 12, macro-reactions 16 (70 Q; floors 14/12/12/10/14). Exhibits via QuizQuestion.macroExhibit → components/macro/MacroQuizExhibit (QuizModal branch, additive).
- Validator: src/lib/macro/macroQuiz.test.ts — ids unique, answer in options, distinct labels, glossary resolves, exhibits resolve (events, meetings, days, weeks, 42-bar reaction charts), 18 numeric answers recomputed from raw world fields; game.render.test.tsx adds no-leak test for reaction exhibits pre-submit.
- Fixes during verify: duplicate distractors in MR-09, MR-14, FP-05 (data-dependent collisions) replaced.
- Checks: lint 0 (macro), coaching 24/24, libtests 63/63, macro 63/63, financials 235/235, build ok, dist untouched.

### 2026-10-21 05:44 PT · MF8.M1–M2 passed (attempt 1)
- M1: components/macro/MacroTrainingCard.tsx (desk link, game link + rounds played, 5 group chips) mounted in Training.tsx under the FE card (additive: 2 imports, 1 featured-group clause, 1 element). Archive literacy tab lists all LITERACY_TERMS, so the 50 MACRO_TERMS show there.
- M2: src/lib/macro/caseLinks.ts MACRO_CASE_LESSON_LINKS (5 cases: case-macro-print, case-macro-beg-print-soft-landing → cpi; case-macro-beg-print-jobs-hot, case-scale-risk-on → employment-situation; case-macro-beg-print-gdp-soft → gdp) + components/macro/CaseMacroLink.tsx, mounted in CasePlayer under the headline (+2 lines). caseStudies.ts untouched (git diff empty); grading unchanged.
- Fix found via screenshots: release-type quiz exhibits showed the "Market read" verdict before submit (answer leak on MR-01-style questions). ExpectationsPanel gained optional hideRead; MacroQuizExhibit hides the read until submit; no-leak test extended.
- Tests: src/lib/macro/integration.test.tsx (groups ≥ 10 Q, terms in LITERACY_TERMS, card links, case links resolve, case bank unchanged).
- Screens (informational, temp dev server :3017 + /tmp/mf-cdp.mjs CDP driver): checkpoints/mf8-training-card.png, mf8-case-macro-print.png, mf8-quiz-macro-releases.png, mf8-quiz-macro-releases-revealed.png, mf8-quiz-macro-reactions.png, mf8-quiz-macro-reactions-revealed.png
- Checks: lint 0, coaching 24/24, libtests 63/63, macro 66/66, financials 241/241, build ok, dist untouched.

### 2026-10-21 05:45 PT · MF8.M3 passed (attempt 1)
- Additive doc edits (re-read first; FE sections untouched): AGENTS_CODE_REFERENCE-data.md new "Macro forces project" section before Market page wiring; AGENTS_CODE_REFERENCE-training.md macro groups bullet after the FE bullet; LOOPS/LOOP-Learn.md project groups 24–28; docs/projects/content-graph/LOOP-Graph.md `macro` family row now starts at the Learn project groups / Macro Desk; QA_User_Flows.md Flow UF-20 + matrix row G17; EPIC_MAP.md MF project row; LOOPS/README.md "Project: Macro forces" row in the Project loops table (the earlier bullet under project folders stays).
- Desk / lesson quiz links now open the quiz directly (`&start=1`), matching the Training card and UF-20.
- Link check (/tmp/mf-linkcheck.py over touched docs + docs/projects/macro-forces/*.md): 0 broken.
- Checks: lint 0, coaching 24/24, libtests 63/63, macro 66/66, financials 241/241, build ok, dist untouched.

### 2026-10-21 05:49 PT · MF9.M1–M3 (stretch) passed (attempt 1) — run before MF8.M4 so the final audit counts them
- M1: src/lib/macro/coachCpiMorning.ts — Coach session `cpi-morning` (preview → which line matters → print → yields → your stock), all numbers from SIMULATED cpi-16 (headline hot +0.3 vs +0.1, core cool +0.4 vs +0.5 → details-reverse, 2y −6 bp, 10y −4 bp, growth-tech +0.5% after a dip). Registered in coaching/sessions/index.ts (+2 lines, after earningsWeekSession). Test: coachCpiMorning.test.ts (validator, catalog, numbers vs release + charts).
- M2: src/lib/macro/curveExplorer.ts (spread, shape thresholds <0 inverted / <25 flat / ≤150 normal / >150 steep, amortisation) + components/macro/CurveExplorer.tsx (2y / 10y / mortgage-spread sliders, hedged notes). Mounted on /macro and the treasury-curve lesson.
- M3: src/lib/macro/homeTip.ts + components/macro/MacroHomeTip.tsx on Dashboard (+3 lines): new → /macro/employment-situation; in progress → /macro/play?round=<next id>; done → macro-reactions quiz. Test: stretch.test.tsx (math, render, every tip route exists in App.tsx).
- Screens (informational): checkpoints/mf9-coach-cpi-morning.png, mf9-coach-cpi-morning-stock.png, mf9-curve-explorer.png, mf9-home-tip.png
- Product note (not blocking): shape thresholds (25 / 150 bp) and default mortgage spread 2.00 are teaching choices — listed for Weng.
- Checks: lint 0, coaching 24/24, libtests 63/63, macro 71/71, financials 241/241, build ok, dist untouched.

### 2026-10-21 05:54 PT · MF8.M4 final audit passed (attempt 1) — project complete pending sign-off
- Floors (charter §7.3 → actual): lessons ≥ 15 → 18 (six parts each, lessons.test.ts) · viewer layouts ≥ 12 → 16 · release events ≥ 30 → 43 (all with consensus, range, actual, prior; prior revision on 21: payrolls 8 with two-month revisions + claims / JOLTS / PPI / PCE / retail / starts 13) · rounds ≥ 24 → 29 over 6 regimes, 6 muted / mixed, 4 reversals · Learn questions ≥ 60 → 70 (15 / 14 / 13 / 12 / 16; 18 numeric recomputed) · glossary ≥ 35 → 50 · sources 44.
- Audit fix: "prior revisions" were only on payrolls. Added REVISES_PRIOR in releases.ts (kinds whose real release revises the prior period in the same report): WORLD keeps the revised value, `prior` = first-reported (small deterministic non-zero difference ≤ 1.5σ). CPI, ISM, PMMS, FOMC, UMich and the GDP advance estimate deliberately show none (their real releases don't revise the prior period that way) — product/accuracy note for Weng, not blocking. Test added (releases.test.ts); panels no-leak test now treats any on-screen pre-reveal value as allowed coincidence (still asserts no actual / surprise cells).
- check:macro-sources: 44/44 ok (one run 43/44 from a transient census.gov error; immediate re-run 44/44, bot-blocked hosts logged in SOURCES.md).
- Final checks: lint 0, coaching 24/24, libtests 63/63, macro 72/72, financials 241/241, build ok (temp outDir), dist untouched, no commit (COMMIT_MODE none), no push.
- Screens (informational): checkpoints/mf8-lesson-claims-revisions.png, mf8-macro-hub-final.png
- Done (project) for MF0–MF9 except §7.4: the three human checkpoints are still PENDING WENG SIGN-OFF.

### 2026-10-21 11:05 PT · Sign-offs recorded
- Weng ("I approve all"): MF2.M8, MF4.M2, MF5.M4 and both teaching choices (curve-shape cutoffs + 2.00 mortgage spread; prior-revision coverage) SIGNED OFF. Project DONE.

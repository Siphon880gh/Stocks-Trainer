# Epics & Milestones: Macro Forces — Releases, Rates & Market Reactions

Charter: [`CHARTER.md`](./CHARTER.md) · Stories: [`STORIES.md`](./STORIES.md) · Progress: [`PROGRESS.md`](./PROGRESS.md) · Sources: [`SOURCES.md`](./SOURCES.md) · Loop: [`LOOP-Macro-Forces.md`](./LOOP-Macro-Forces.md)

**Status key:** `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked (see PROGRESS.md). The loop flips the box on the milestone heading line and appends a PROGRESS.md entry.

**Every milestone's verification includes the base gate** (abbreviated **BASE** below):
`npm run lint` · `npm run test:coaching` · `npx tsx --test src/lib/*.test.ts` · `npm run test:macro` (after MF0.M1 adds it) · `npx vite build --outDir /tmp/st-build-check-macro --emptyOutDir` then `rm -rf /tmp/st-build-check-macro` (never touch `dist/`).

Tests named per milestone live in `src/lib/macro/**/*.test.{ts,tsx}` (node:test via tsx) and stay in the repo. Validators are tests, not throwaway scripts.

---

## Audit: what exists today

| Area | What exists | File(s) |
|------|-------------|---------|
| Equity macro cases | `macro-news` pack, 12 cases: risk-off (utility / airline / bank), macro print (hot CPI, hot jobs, soft landing, soft GDP), supply (freight, energy), plus "jobs cool without collapsing" in `SCALE_CASES`. 6-bar pre / 3-bar post, buy/sell/hold, process debrief. **No numbers, no consensus, no yields, no source link.** | `src/lib/caseStudies.ts` |
| Class macro packs | `futures-macro`, `forex-macro`, `crypto-macro`, `options-macro`: 26 cases each (104). Mostly candlestick setups (dark cloud, hanging man, harami…) with a macro-flavoured headline (`thinkingMode: "macro_print"` on a few: ZF CPI coil, AUDCHF jobs coil…). | `src/lib/multiAssetCases.ts` |
| Coach | `macro-print`, `macro-risk-off`, `supply-shock`, `futures-fomc-print`, `futures-index-risk-off`, `futures-rumor-vs-print`, `forex-nfp-print`, `forex-boj-print`, `forex-rumor-vs-print`, `forex-combined`, `crypto-cpi-print`, `crypto-btc-risk-off`, `options-risk-off-stock` | `src/lib/coaching/sessions/*` |
| Learn | **No macro group.** A handful of questions mention payrolls (forex-literacy, EUR/USD) or risk-off (equity-literacy). | `src/lib/quizData.ts` |
| Glossary | **No macro terms** (no CPI, payrolls, unemployment rate, FOMC, dot plot, yield, curve, spread, mortgage, PMI, claims). Nearest: `priced-in`, `correlation`, `forex-risk-on`. | `src/lib/literacyTerms.ts` |
| Tips / paths | `macro_print` thinking-mode tip; Beginner / Decision Maker paths link `cases:macro-news`. | `thinkingModeTips.ts`, `beginnerPath.ts`, `learningPaths.ts` |
| Reveal infra (reusable) | `CandlestickChart` annotations (levels, zones, trendlines, points), `padRightBars`, large charts, `revealAnnotations` on `QuizQuestion`, seeded walk + pinned bars (`scenarioCharts.ts`), Buy-or-Sell explanations. `OHLC` = name/open/high/low/close (no volume, no timestamp). | `components/CandlestickChart.tsx`, `lib/chartAnnotations.ts`, `lib/scenarioCharts.ts`, `lib/buySellDrill.ts` |
| Line charts | Recharts `MarketChart` (for FRED-style series views). | `components/MarketChart.tsx` |

**Gaps vs Weng's goal**
- No link to any real release page; no look-alike of any release layout (BLS tables, FRED series page, FOMC statement, PMMS card).
- No numbers: consensus, actual, prior, revisions, surprise — none exist anywhere in `src/`.
- No rates layer: no 2y / 10y / 2s10s / mortgage / fed funds / dollar series, so "hot jobs → yields up → growth down / homebuilders down" cannot be shown, only told.
- No cross-asset reaction: case aftermath is one stock, 3 bars, no release-time intraday bars, no "first move fades" teaching.
- No regime teaching (good-news-is-bad-news vs good-news-is-good), no "priced in" for Fed decisions.

---

## MF0 — Foundations (types, sources, consistency checks, test harness)

### [x] MF0.M1 — Types + source registry + `test:macro` script
- **Build:** `src/lib/macro/types.ts` (`ReleaseKind`, `MacroSource`, `ReleaseEvent`, `SeriesPoint`, `Regime`, `Instrument`, `Direction`), `src/lib/macro/sources.ts` (`MACRO_SOURCES`: id, agency, title, url, release time ET, FRED series ids, `botBlocked` flag, layout notes), `package.json` script `"test:macro": "tsx --test \"src/lib/macro/**/*.test.{ts,tsx}\""`.
- **Accept:** every URL in SOURCES.md is in the registry and vice versa; urls are `https://` on an allowlisted official domain; FRED ids match `^[A-Z0-9]+$`.
- **Verify:** BASE + `sources.test.ts`. Prove the glob picks files up with a deliberately failing dummy test, then delete the dummy.

### [x] MF0.M2 — Consistency library
- **Build:** `src/lib/macro/consistency.ts`: pure checks returning violation lists — surprise, payroll sums and level chain, household identities (UR, LF, participation), CPI MoM/YoY from index levels, claims 4-week average, 2s10s, real yield, mortgage spread band and 15y < 30y, target range (25 bp width, effective inside, steps of 25), probabilities sum to 100, GDP annualized and contributions.
- **Accept:** each rule has a good fixture that passes and a broken fixture that yields exactly that violation.
- **Verify:** BASE + `consistency.test.ts`.

### [x] MF0.M3 — Source URL checker
- **Build:** `src/lib/macro/checkSources.ts` CLI (`npm run check:macro-sources`): fetch each registry URL with a browser UA; 2xx/3xx = ok; for `botBlocked` hosts (bls.gov, fred.stlouisfed.org, dol.gov, cmegroup.com — Akamai returns 403 to scripts) accept 403 only when SOURCES.md has a dated manual verification row; FRED ids confirmed via `fredgraph.csv?id=<ID>` header. Not part of `test:macro` (network).
- **Accept:** offline test asserts every botBlocked source has a dated verification row in SOURCES.md.
- **Verify:** BASE + `sourcesLog.test.ts` + one `npm run check:macro-sources` run recorded in PROGRESS.md.

---

## MF1 — Simulated macro world

### [x] MF1.M1 — Seeded world generator
- **Build:** `src/lib/macro/world.ts`: 36 simulated months (`SIM Y1 · Jan` … `SIM Y3 · Dec`) of payroll levels by sector (private sectors + government), household survey (population, LF, employed, unemployed), AHE, CPI index levels (all items, core, food, energy, shelter), PPI final demand, PCE / core PCE, quarterly real GDP levels + contributions, retail sales, ISM mfg / services, sentiment, housing starts / permits, JOLTS openings; weekly initial claims; daily 2y, 10y, breakeven, dollar index; weekly 30y / 15y mortgage.
- **Accept:** deterministic (two builds deep-equal); every MF0.M2 check passes over every period; values sit in plausible bands (UR 3–7%, 10y 2–6%, mortgage − 10y in [1.3, 3.0]).
- **Verify:** BASE + `world.test.ts`.

### [x] MF1.M2 — Release events (≥ 30)
- **Build:** `src/lib/macro/releases.ts`: events cut from the world with consensus, range, prior, prior revised (as previously published vs revised), actual, `regime`, `releaseTimeET`. Surprise and label (`hot` / `cool` / `in-line`) are computed.
- **Accept:** actuals equal the world values; revisions consistent; every kind in CHARTER §4 has ≥ 2 events; ≥ 6 distinct regimes.
- **Verify:** BASE + `releases.test.ts`.

### [x] MF1.M3 — Fed path + market pricing
- **Build:** `src/lib/macro/fed.ts`: target range path, 8 simulated meetings per year, decisions, implied probabilities before each meeting, SEP dots (19 participants) for SEP meetings, statement facts (vote, decision sentence fields).
- **Accept:** range width 25 bp; effective rate in range; decisions multiples of 25; probabilities sum to 100; median dot computed; expected move = Σ p × move.
- **Verify:** BASE + `fed.test.ts`.

---

## MF2 — Look-alike viewers (SIMULATED)

### [x] MF2.M1 — SimulatedFrame + render harness
- **Build:** `components/macro/SimulatedFrame.tsx` (SIMULATED banner, "Visit the real source" link `target="_blank" rel="noopener noreferrer"`, agency/release header, not-affiliated line), `src/lib/macro/render.test.tsx` harness via `react-dom/server`.
- **Accept:** frame renders banner + link + disclaimer for any source.
- **Verify:** BASE + render test.

### [x] MF2.M2 — Labor viewers: Employment Situation, weekly claims, JOLTS
- **Build:** `EmploymentSituationViewer` (summary paragraph, Summary table A household, table B establishment with sectors, revision paragraph), `ClaimsViewer` (week-ending table: initial SA, NSA, 4-week average, insured unemployment), `JoltsViewer` (openings / hires / quits / layoffs levels and rates).
- **Accept:** rendered numbers equal release data; revision sentence values equal computed revisions; frame present.
- **Verify:** BASE + render tests.

### [x] MF2.M3 — Inflation viewers: CPI, PPI, PCE
- **Build:** CPI "Table A" layout (categories × last 7 months SA MoM + 12-month unadjusted), PPI final demand table, PCE price table (BEA layout).
- **Accept:** each cell equals the computed % change from index levels.
- **Verify:** BASE + render tests.

### [x] MF2.M4 — FRED-style series viewer + Treasury curve viewer
- **Build:** `FredSeriesViewer` (title with series id, observations list newest first, units, frequency, line chart, notes), `TreasuryCurveViewer` (daily par yield curve table + curve line, 2s10s callout).
- **Accept:** all FRED ids in the registry render; spread callout = 10y − 2y.
- **Verify:** BASE + render tests.

### [x] MF2.M5 — Fed viewers: FOMC statement, implementation note, dot plot
- **Build:** `FomcStatementViewer` (fresh simulated statement text from facts: decision sentence, target range, vote), `DotPlotViewer` (SVG scatter by year, median line).
- **Accept:** statement numbers equal the meeting facts; dot count = 19 per year column; median marked equals computed median.
- **Verify:** BASE + render tests.

### [x] MF2.M6 — Housing viewers: PMMS, housing starts
- **Build:** `PmmsViewer` (30-yr / 15-yr cards, week change, year-ago), `HousingStartsViewer` (starts, permits, completions; SAAR, MoM %).
- **Accept:** week change computed; year-ago value from world.
- **Verify:** BASE + render tests.

### [x] MF2.M7 — Growth viewers: GDP, retail sales, ISM, sentiment
- **Build:** `GdpViewer` (headline annualized + contributions table), `RetailSalesViewer` (total, ex-autos, control group), `IsmViewer` (PMI + sub-indexes with expanding/contracting labels), `SentimentViewer` (index, current conditions, expectations, 1-yr inflation expectations).
- **Accept:** contributions sum to headline; ISM labels match the 50 line.
- **Verify:** BASE + render tests.

### [x] MF2.M8 — 🔍 HUMAN CHECKPOINT: viewer visuals
- **Build:** screenshots of every viewer (headless Chrome against a temp dev server) into `checkpoints/`.
- **Accept:** Weng signs off in PROGRESS.md. The loop records `PENDING WENG SIGN-OFF` with paths and continues (per Weng's drain instruction).

---

## MF3 — Expectations & glossary

### [x] MF3.M1 — Expectations panel + Fed pricing card
- **Build:** `ExpectationsPanel` (consensus, range, prior, prior revised, actual hidden until reveal, surprise and z-score after reveal), `FedPricingCard` (simulated probabilities per outcome, "market expects").
- **Accept:** pre-reveal markup contains no actual; probabilities displayed sum to 100.
- **Verify:** BASE + render + no-leak tests.

### [x] MF3.M2 — Glossary (≥ 35 terms)
- **Build:** `src/lib/macro/glossary.ts` (`MACRO_TERMS: LiteracyTerm[]`), spread into `LITERACY_TERMS`.
- **Accept:** ids unique across all terms; every term id referenced by lessons / quizzes resolves.
- **Verify:** BASE + `glossary.test.ts`.

---

## MF4 — Reaction model & charts

### [x] MF4.M1 — Transmission rules + regimes
- **Build:** `src/lib/macro/reactions.ts`: for (kind, surprise label, regime) → expected direction of 2y, 10y, dollar, index, growth/tech, homebuilders, REITs, banks, utilities, small caps, bond-price proxy, each with a hedged rationale naming the channel; plus explicit exceptions (priced-in, details-reverse, mixed).
- **Accept:** bond proxy opposite to 10y; every rule has a rationale; each regime covered.
- **Verify:** BASE + `reactions.test.ts`.

### [x] MF4.M2 — 🔍 HUMAN CHECKPOINT: reaction-rule accuracy
- **Build:** render the rules table to `checkpoints/`.
- **Accept:** Weng signs off educational accuracy. Recorded as `PENDING WENG SIGN-OFF`; loop continues.

### [x] MF4.M3 — Reaction chart generator + validators
- **Build:** `src/lib/macro/reactionCharts.ts`: per event and instrument, intraday 5-minute bars (pre-release window, release bar at release time, follow-through / fade) and a 10-day daily view; reversal archetype supported. Uses `volume?` only if FE4.M1 landed.
- **Accept:** chart direction matches the labelled outcome; release bar index = release time slot; |move| grows with |surprise| within kind; valid OHLC; deterministic.
- **Verify:** BASE + `reactionCharts.test.ts`.

### [x] MF4.M4 — Reveal annotations
- **Build:** release-time point, pre-release range zone, outcome label, fade point for reversals.
- **Accept:** indices in range; zone prices inside extent.
- **Verify:** BASE + annotation test.

---

## MF5 — Macro Desk game

### [x] MF5.M1 — Rounds (≥ 24)
- **Build:** `src/lib/macro/game.ts`: each round = event + instruments to predict (2–4 of: 2y, 10y, dollar, index, a sector) with up / down / muted; explanation leading with the channel; "why not" feedback.
- **Accept:** answer keys derived from MF4.M1 rules; ≥ 6 regimes; ≥ 4 muted/mixed; ≥ 4 reversals; no direction > 50% of all predictions; explanations cite a number present in the round.
- **Verify:** BASE + `game.test.ts`.

### [x] MF5.M2 — Game UI
- **Build:** `components/macro/MacroDeskRound.tsx`: phase 1 frame + look-alike + expectations (actual visible, reaction hidden), phase 2 predictions, phase 3 reveal (charts with annotations, per-instrument right/wrong, explanation).
- **Accept:** pre-answer render contains no post-release bars or outcome labels.
- **Verify:** BASE + render + no-leak tests.

### [x] MF5.M3 — Progress + scoring
- **Build:** `src/lib/macro/macroProgress.ts`: new localStorage key `macro_desk_progress_v1` (best score, completed round ids). Existing keys untouched.
- **Accept:** round-trip persist test with a fake storage.
- **Verify:** BASE + `macroProgress.test.ts`.

### [x] MF5.M4 — 🔍 HUMAN CHECKPOINT: play-through
- Screenshots of phases 1–3 for 3 rounds; `PENDING WENG SIGN-OFF`; continue.

---

## MF6 — Lessons & pages

### [x] MF6.M1 — Lesson registry (≥ 15)
- **Build:** `src/lib/macro/lessons.ts`: one lesson per release family member, each with source id, viewer id, event ids, round ids, quiz group/question ids, glossary ids, "what to look at first" bullets.
- **Accept:** each lesson has all six parts and every reference resolves.
- **Verify:** BASE + `lessons.test.ts`.

### [x] MF6.M2 — Pages + routes
- **Build:** `pages/MacroDesk.tsx` (`/macro` hub: lesson cards by family, play-all link), `pages/MacroLesson.tsx` (`/macro/:lessonId`: source link → look-alike → expectations → game rounds → quiz link → glossary chips), `/macro/play` (all rounds). Additive routes in `App.tsx`.
- **Accept:** each lesson page renders; unknown id shows a not-found card.
- **Verify:** BASE + render tests (MemoryRouter).

---

## MF7 — Learn content (quiz groups)

### [x] MF7.M1 — `macro-releases` (≥ 14 Q): reading the release (which line matters, revisions, UR math, MoM vs YoY).
### [x] MF7.M2 — `rates-curve` (≥ 12 Q) + `fed-policy` (≥ 12 Q): 2s10s, real yields, inversion, target range, priced-in, dots.
### [x] MF7.M3 — `housing-mortgage` (≥ 10 Q): mortgage vs 10y spread, affordability, homebuilders / REITs / banks.
### [x] MF7.M4 — `macro-reactions` (≥ 14 Q, chart-based): reaction charts as hero, regimes, reversals.
- **Verify (each):** BASE + quiz validator (ids unique across all banks, answer exists in options, glossary ids resolve, numeric answers recomputed from world/releases, chart keys exist, indices in range).

---

## MF8 — Integration, docs, QA

### [x] MF8.M1 — Training + Archive integration
- **Build:** Training "Macro Desk" card linking `/macro` + the 5 new groups registered in `QUIZ_GROUPS`; glossary visible in Archive literacy tab.
- **Verify:** BASE + test that every new group returns ≥ 10 questions via `getQuestionsForGroup`.

### [x] MF8.M2 — Cases / Coach bridge (additive)
- **Build:** `MACRO_CASE_LESSON_LINKS` map (existing macro case id → lesson id) and a small "Read the real release" link in CasePlayer for mapped cases. No grading change.
- **Verify:** BASE + test that mapped ids exist and case data is unchanged.

### [x] MF8.M3 — Docs + loops
- **Build:** AGENTS_CODE_REFERENCE-data/-training sections for `src/lib/macro/`; LOOP-Learn group list; content graph `macro` family Learn hop; QA_User_Flows flow; EPIC_MAP pointer row; LOOPS/README project loop row.
- **Verify:** BASE + link check over touched docs.

### [x] MF8.M4 — Final audit
- Recount charter floors into PROGRESS.md; all tests green; `check:macro-sources` run. Then Done(project) for MF0–MF8.

---

## MF9 — Stretch (run after MF8 unless it needs a product decision)
- [x] MF9.M1: Coach tree "CPI morning" (preview → print → yields → your stock) via existing coaching infra.
- [x] MF9.M2: Yield-curve explorer: sliders for 2y / 10y → spread, inversion label, mortgage estimate (10y + spread).
- [x] MF9.M3: Home tip naming the Macro Desk (only after `/macro` exists).

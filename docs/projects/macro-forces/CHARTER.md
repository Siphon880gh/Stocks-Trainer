# Charter — Macro Forces: Releases, Rates & Market Reactions

Project folder: `docs/projects/macro-forces/` · Epics: [`EPICS.md`](./EPICS.md) · Stories: [`STORIES.md`](./STORIES.md) · Progress log: [`PROGRESS.md`](./PROGRESS.md) · Sources: [`SOURCES.md`](./SOURCES.md) · Loop: [`LOOP-Macro-Forces.md`](./LOOP-Macro-Forces.md)

| Field | Value |
|-------|-------|
| **Status** | Chartered (planning). No milestone started. |
| **Epic ids** | `MF0`–`MF8` (own namespace; does not reopen E0–E11, which are Done(global) in `EPIC_MAP.md`, and does not overlap `FE0`–`FE8`) |
| **Owner / reviewer** | Weng |
| **Commit policy** | `COMMIT_MODE: none` (see the loop). Changes stay uncommitted; Weng commits. Never push, never open a PR. |
| **Sibling project** | [`../financials-earnings/`](../financials-earnings/CHARTER.md) (company-level prints). This project is the market-wide counterpart. |

---

## 1. Why

Weng's ask: *"Do the same creating a charter/project of epics and milestones for macro economic forces like job reports, FRED rate, mortgage rate, etc. You would preface it with a link that the user visits, and you sorta copy the interface but put in simulated numbers, then the user learns how the stock market reacts. Drain it until done."*

Today the app teaches macro only as **tone**: 12 equity `macro-news` cases ("jobs hotter than expected", "inflation hotter than expected") with a 6-bar pre chart and 3-bar aftermath, ~104 class `*-macro` cases that are mostly candlestick setups with a macro headline, and about 12 coach trees (`macro-print`, `macro-risk-off`, `futures-fomc-print`, `forex-nfp-print`, `crypto-cpi-print`…). There are **no** release tables, no consensus vs actual numbers, no yields / curve / mortgage / dollar data, no glossary terms for CPI, payrolls, FOMC or yields, no Learn group for macro, and no link to any real source. See the audit in [`EPICS.md` → Audit](./EPICS.md#audit-what-exists-today).

## 2. Goal

For each major macro release, a learner can:

1. **Visit the real source.** Every lesson opens with a "Visit the real source" link to the official public page (BLS, BEA, the Fed, FRED, Freddie Mac, DOL, Census, ISM, UMich, Conference Board). Every URL is verified in [`SOURCES.md`](./SOURCES.md).
2. **Read a look-alike.** An in-app reproduction of that source's **layout** (table structure, field names, release header, units, revision paragraph, FRED-style series page), clearly banner-marked **SIMULATED**, with fictional numbers and fictional period labels.
3. **Frame expectations.** Consensus, forecast range, prior and revised prior, the surprise (computed), and what the market was already pricing (e.g. simulated rate-cut probabilities).
4. **Predict the reaction.** A game: given the release and the regime, predict the 2-year yield, 10-year yield, dollar, S&P-style index, and a sector (growth/tech, homebuilders, REITs, banks, utilities, small caps).
5. **See the aftermath.** Reveal a simulated intraday (5-minute bars around the release time) and/or daily candlestick chart for each instrument, with annotations (release bar, pre-release range, follow-through or reversal) and an explanation that names the transmission channel.
6. **Drill and look up.** Learn quiz groups and glossary terms cover every release and transmission channel. Lessons are reachable from Training.

## 3. Audience

- Primary: learners who finished the Beginner Equities path and the macro intro cases, who now want to read the actual releases traders react to.
- Secondary: anyone who opened FRED or a BLS release and didn't know which line mattered. Level-1 lessons show the headline row only; level-2 shows the full layout.

## 4. Scope

**In scope (release families)**

| Family | Releases | Real source (verified) |
|--------|----------|------------------------|
| Labor | Employment Situation (payrolls, unemployment rate, average hourly earnings, revisions); weekly jobless claims; JOLTS | BLS, DOL, FRED `PAYEMS` / `UNRATE` / `ICSA` / `JTSJOL` |
| Inflation | CPI (headline, core), PPI, PCE price index | BLS, BEA, FRED `CPIAUCSL` / `CPILFESL` / `PCEPILFE` |
| Growth / activity | GDP (advance), retail sales, ISM manufacturing and services PMI, consumer sentiment / confidence | BEA, Census, ISM, UMich, Conference Board, FRED `GDPC1` / `RSAFS` / `UMCSENT` |
| Policy | FOMC statement and target range, implementation note, Summary of Economic Projections (dot plot), market-implied rate probabilities | federalreserve.gov, CME FedWatch (link only), FRED `FEDFUNDS` / `DFF` |
| Rates and curve | 2-year and 10-year Treasury yields, 2s10s spread, breakevens, dollar index | Treasury, FRED `DGS2` / `DGS10` / `T10Y2Y` / `T10YIE` / `DTWEXBGS` |
| Housing | 30-year / 15-year mortgage rate (PMMS), housing starts and permits | Freddie Mac, Census, FRED `MORTGAGE30US` / `HOUST` |

**Also in scope:** a deterministic simulated "macro world" (a fictional timeline in which all series are mutually consistent), look-alike viewers, the expectations panel, a cross-asset reaction model and chart generator, the "Macro Desk" reaction game, lesson pages, Learn groups, glossary, Training card, docs and validators.

**Out of scope (non-goals)**
- Live data, scraping, or any API call at runtime (including FRED's API). Links open the real site in a new tab; the app never fetches it.
- Copying logos, seals, branding, or copyrighted text verbatim. Layout and public field names (e.g. "Total nonfarm", "All items less food and energy", "30-yr FRM") are fine. Narrative text is written fresh.
- Real calendar dates attached to simulated numbers. Simulated periods use fictional labels (e.g. `SIM Y2 · Mar`), so nobody mistakes a simulated print for history.
- Options chains, futures pricing engines, or a full yield-curve model. Implied probabilities are given numbers.
- Changes to existing `macro-news` / `*-macro` cases, coach sessions, progress keys, case grading or Beginner unlocks (additive cross-links only).
- Trading advice.

## 5. Educational stance (non-negotiable)

- Every viewer shows `SIMULATED — fictional numbers in the layout of <source>. Not affiliated with <agency>. Not live data, not trading advice.` and the real-source link.
- Teach **process**: what was expected → what printed (and what got revised) → what it changes for the Fed path → how yields and the dollar moved → which equities are rate-sensitive → what would invalidate the read.
- Reactions are **regime-dependent** and probabilistic. The game must include:
  - good-news-is-bad-news (hot jobs while inflation is the worry → yields up, stocks down) and good-news-is-good (growth scare regime → strong data lifts stocks);
  - "priced in" (a cut that was 95% expected moves little; the dot plot or the press conference moves more);
  - reversals (the first 5 minutes fade after the details: e.g. a headline beat with downward revisions, or hot headline with soft core);
  - mixed reports where the answer is "muted" or "wait".
- Wording uses tendencies ("often", "tends to", "in this regime"). Explanations name the channel: discount rate, growth expectations, Fed reaction function, mortgage affordability, net interest margin, dollar translation.

## 6. Data approach

- **Synthetic, deterministic, fictional.** One seeded generator produces a 36-month simulated macro world (monthly and weekly series, daily yields). Releases are cut from it. Nothing is random per page load.
- **Everything ties out**, checked by tests (full list in the loop's invariants):
  - surprise = actual − consensus, and beat/miss/in-line labels are computed;
  - payroll change = private + government, private = Σ sectors, level[t] = level[t−1] + change[t], revision text equals revised − previous;
  - unemployment rate = unemployed / labor force; labor force = employed + unemployed; participation = labor force / population;
  - CPI month-over-month and year-over-year percentages are computed from index levels;
  - claims 4-week average = mean of the last 4 weeks;
  - 2s10s = 10y − 2y; real yield = nominal − breakeven;
  - mortgage 30y = weekly average 10y + a spread inside a documented band, and 15y < 30y;
  - target range width = 25 bp; effective rate inside the range; decision steps are multiples of 25 bp; implied probabilities sum to 100%;
  - GDP annualized growth computed from levels, and contributions sum to the headline.
- **Reaction charts are generated from the labelled outcome** (seeded walk + pinned release bar, the `scenarioCharts.ts` technique). Validators prove that each chart's direction matches its label, the release bar sits at the release time, the bond-price proxy moves opposite to yield, and magnitude grows with |surprise| within a release kind.
- New code lives under `src/lib/macro/` (data, pure logic, tests) and `src/components/macro/` (UI). Existing case / coach data is not rewritten.
- **Volume:** `OHLC` has no `volume` field today. FE4.M1 in the sibling project plans an optional `volume?`. If it has landed when MF4 runs, reaction charts may set it (release-bar volume spike) and use its pane; if not, MF ships without volume. MF never adds its own volume field.

## 7. Success criteria (project Done)

1. Every milestone in `EPICS.md` is `[x]`, with its automated verification recorded in `PROGRESS.md`.
2. `npm run lint`, `npm run test:coaching`, `npx tsx --test src/lib/*.test.ts`, `npm run test:macro`, `npm run test:financials` (if present), and the temp-folder build all exit 0. `npm run check:macro-sources` passes (bot-blocked hosts are logged as manually verified in SOURCES.md).
3. Content floors, all checked by validators:
   - ≥ 15 lessons (one per release in §4), each with all six parts (source link, look-alike, expectations, game rounds, quiz, glossary);
   - ≥ 12 look-alike viewer layouts;
   - ≥ 30 simulated release events with consensus, actual, prior, revision;
   - ≥ 24 Macro Desk rounds covering ≥ 6 regimes, with ≥ 4 "muted / mixed" rounds and ≥ 4 reversal rounds;
   - ≥ 60 new Learn questions across the new groups;
   - ≥ 35 new glossary terms.
4. The three human checkpoints in `EPICS.md` (viewer visuals, reaction-rule accuracy, game play-through) are signed off by Weng in `PROGRESS.md`.
5. No `dist/` changes, no push, no PR, and commits only per `COMMIT_MODE`.

## 8. Coordination with other projects

- Shared registries (`quizData.ts`, `literacyTerms.ts`, `Training.tsx`, `App.tsx`, `package.json`, `progressStore.ts`) are also edited by the financials project. Edits are append-only and small; re-read the file before each edit. Never run this loop and the financials loop at the same time.
- `test:macro` is a new `package.json` script next to `test:financials`.
- After MF8.M3, the content graph's `macro` echo family ([`../content-graph/LOOP-Graph.md`](../content-graph/LOOP-Graph.md)) gains a Learn hop pointing at this project's groups.

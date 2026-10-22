# LOOP: Financials, Expectations & Earnings Reactions (project graph)

```text
COMMIT_MODE: none          # none (default) | local  (local = one local commit per PASSed milestone; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3           # consecutive failed attempts on the same milestone before STOP (b)
ERROR_ROUNDS_PER_ATTEMPT: 3 # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-financials --emptyOutDir && rm -rf /tmp/st-build-check-financials
CHECKPOINT_MODE: continue  # continue (render + log PENDING WENG SIGN-OFF, keep going) | stop. Product decisions (FE7.M2, FE8.M1) always STOP (a) regardless.
```

Autonomous milestone loop for the project in this folder. It picks the next unfinished story, implements it, verifies it automatically, records progress here, and continues. It stops only for human judgment or repeated failure.

Companions: [`CHARTER.md`](./CHARTER.md) · [`EPICS.md`](./EPICS.md) · [`STORIES.md`](./STORIES.md) · [`PROGRESS.md`](./PROGRESS.md) · content graph [`../content-graph/LOOP-Graph.md`](../content-graph/LOOP-Graph.md) · section loops [`LOOPS/`](../../../LOOPS/README.md) · code refs [`AGENTS_CODE_REFERENCE.md`](../../../AGENTS_CODE_REFERENCE.md)

---

## How to run

```text
/loop financials project using docs/projects/financials-earnings/LOOP-Financials-Earnings.md
```

Override config on the same line, e.g. `COMMIT_MODE=local` or `ATTEMPT_LIMIT=2`. When there is no override, the block above is used.

**Before starting**
1. Leave a running `npm run dev` (port 3001) alone. Verification never needs it.
2. Do not run this together with the content graph or a section loop in the same session. They edit the same registries (`quizData.ts`, `literacyTerms.ts`).
3. `dist/` is never touched. Builds go to the temp folder only.

---

## Relationship to other loops

- This is a **project** loop: it implements EPICS.md milestones (code + content).
- The content graph ([`../content-graph/LOOP-Graph.md`](../content-graph/LOOP-Graph.md)) and section loops in `LOOPS/` add **one content unit per tick** to existing surfaces.
- After FE7.M3, the graph's `statements` echo family points at this project's groups, and later content drains for those groups run through the graph.
- The root `AGENTS_LOOP-*.md` milestone queues (E0–E11) are Done(global); this loop does not touch `.agents/state.json`.

---

## Loop prompt

```markdown
# OBJECTIVE
Implement docs/projects/financials-earnings/EPICS.md milestone by milestone (stories in STORIES.md order) until every FE0–FE7 milestone is [x].

**Done (project):** all FE0–FE7 milestone boxes are [x], all three human checkpoints are signed in PROGRESS.md, and the FE7.M4 audit recorded the charter floors.
**Done (per tick):** one story reaches PASS (and its milestone box flips if it was the last story), OR one attempt fails and is logged, OR a STOP is written.

# CONTEXT
- Config: the fenced block at the top of LOOP-Financials-Earnings.md (COMMIT_MODE, ATTEMPT_LIMIT, ERROR_ROUNDS_PER_ATTEMPT, BUILD_CHECK).
- Scope and stance: CHARTER.md (fictional SAMPLE companies, educational only, no live data, no advice).
- What to build and how to prove it: EPICS.md (Build / Accept / Verify per milestone).
- Order and status: STORIES.md (one story in_progress at a time).
- Log and pointer: PROGRESS.md (append-only entries + "Current pointer").
- Repo conventions: AGENTS_CODE_REFERENCE*.md, the reuse of CandlestickChart annotations / scenarioCharts / buySellDrill reveal patterns, and type-only imports into quizData.ts.
- Hard rules: no push, no PR, no dist/ edits, no new paid deps or API keys, no changes to existing progress keys / Beginner unlocks / case grading.

# STEP-BY-STEP CADENCE
1. **Orient**
   - Read PROGRESS.md "Current pointer", STORIES.md, and the current milestone in EPICS.md. Trust the files, not memory; re-derive the next story from STORIES.md statuses.
   - If the next milestone is a 🔍 HUMAN CHECKPOINT and PROGRESS.md has no sign-off for it → go to STOP (a) with the review package (step 7).
   - If every FE0–FE7 milestone is [x] → STOP with Done(project).
2. **Mark start:** set the story to `in_progress` in STORIES.md, the milestone box to `[~]` in EPICS.md, and update the pointer in PROGRESS.md.
3. **Implement the current story only**, the minimal change that meets its Accept line. Write the milestone's tests first (or alongside), as named in Verify: `src/lib/financials/**/*.test.{ts,tsx}`. Reuse existing infra; do not rewrite CandlestickChart, QuizModal or CasePlayer.
4. **Verify (all must exit 0)**
   1. `npm run lint`
   2. `npm run test:coaching`
   3. `npm run test:lib` (`src/lib/*.test.{ts,tsx}`, includes the content-graph floors in `contentGraph.test.ts`)
   4. `npm run test:financials` (once FE0.M1.S3 exists; before that, run the new test file directly with `npx tsx --test <file>`)
   5. BUILD_CHECK (temp outDir, then delete it)
   6. The milestone-specific checks from EPICS.md Verify. The data-consistency invariants below are always on once the code they cover exists.
   7. `git status --short dist/` is empty, and `git diff --stat` touches only files plausible for this story.
5. **On PASS**
   - STORIES.md: set the story to `done`. If it was the milestone's last story, flip EPICS.md to `[x]`.
   - PROGRESS.md: append an entry (files with +/- from `git diff --numstat` plus untracked line counts, every command with its result, the milestone-specific assertions, Next). Reset `consecutive_failed_attempts` to 0 and move the pointer.
   - Commit per COMMIT_MODE: `none` → leave everything uncommitted. `local` → one local commit per finished milestone, message `FE<x>.M<y>: <summary>`, never `--no-verify`, never push.
   - Continue immediately to the next story (same turn if time remains). Do not pause for review except at a STOP condition.
6. **On FAIL**
   - Read the failure, apply a minimal fix, and re-run the full verify list. That is one round.
   - After ERROR_ROUNDS_PER_ATTEMPT rounds still failing, the attempt has failed: log it in PROGRESS.md (error, files, approach), increment `consecutive_failed_attempts`, revert only this attempt's partial edits if they break unrelated checks, then start a fresh attempt with a different approach.
   - If `consecutive_failed_attempts` reaches ATTEMPT_LIMIT on the same milestone → STOP (b).
   - Never "fix" a failure by weakening a test, deleting an invariant, loosening a tolerance, or editing fixtures to match buggy code, unless the test itself contradicts EPICS.md. In that case, STOP (a).
7. **Human review package** (for checkpoints and STOP (a)): render the relevant components to static HTML (`renderToStaticMarkup` via a temp tsx script inside the repo, deleted afterwards) and screenshot them if a headless browser is available. List the files and paths. Put the exact question for Weng in PROGRESS.md.

# DATA-CONSISTENCY INVARIANTS (enforced by tests, never by eyeballing)
- IS: gross profit = revenue − COGS; operating income = GP − opex; pre-tax = OI − interest + other; NI = pre-tax − tax; EPS basic = NI / basic shares; EPS diluted = NI / diluted shares (rounded to cents consistently).
- BS: total assets = total liabilities + equity, in every period; retained earnings[t] = RE[t−1] + NI[t] − dividends[t].
- CF: CFO + CFI + CFF = ending cash − beginning cash; CF ending cash = BS cash; CFO starts at NI; FCF = CFO − capex.
- Quarter chain: beginning cash[t] = ending cash[t−1].
- 13-week forecast:
  - net = Σreceipts − Σdisbursements;
  - ending = beginning + net + revolver draw − repay;
  - beginning[w+1] = ending[w];
  - headroom = ending − minimum cash;
  - breach ⇔ headroom < 0;
  - revolver balance ≤ limit;
  - the level-1 replica reproduces Weng's numbers (week 9 Cash In 30k, Net −5k, other weeks Net 10k).
- Expectations: actual EPS / revenue equal the fixture quarter; beat/miss and guidance raise/cut are computed from numbers, never typed; implied move is 2–20%.
- Reaction charts match their label (archetype rules in EPICS.md FE4.M2):
  - gap % vs implied move;
  - fill / no fill;
  - the sell-the-news event bar is red after a run-up;
  - the PEAD 10-bar return has the same sign as the gap;
  - event volume ≥ 3× the 20-bar average;
  - valid OHLC, no flat bars, no stray gaps.
- Game:
  - answer keys are derived from archetypes;
  - every archetype has ≥ 2 rounds;
  - no letter is > 35% of answers;
  - the pre-answer render does not leak actuals or post-event bars;
  - each explanation cites a fact present in its round.
- Learn / glossary: ids are unique across all banks; answers exist in options; glossary ids resolve; chart keys and indices are in range; numeric answers are recomputed from fixtures.

# VERIFICATION RUBRIC (PASS only if all are true)
- [ ] The story's Accept line in EPICS.md / STORIES.md is met
- [ ] All verify commands exit 0, and the milestone tests exist in the repo and ran (count > 0)
- [ ] The invariants that apply are covered by tests that would fail on a broken fixture
- [ ] There is no SAMPLE/disclaimer, unlock, progress-key, dist/ or dependency drift
- [ ] STORIES.md, EPICS.md and PROGRESS.md reflect the new truth

# STOP CONDITIONS
- **(a) Human judgment needed:** a 🔍 checkpoint; a visual/UX call the tests cannot decide; educational accuracy that is ambiguous (e.g. how to present a disputed market tendency); a product decision not settled in CHARTER.md / EPICS.md (new route vs modal, new dependency, scope change); docs that conflict; or a test that contradicts EPICS.md.
  → Write a **Blocker Report** in PROGRESS.md and in the tick output: milestone/story, what's decided, the exact question(s), options with a recommendation, the review package paths.
- **(b) Repeated failure:** `consecutive_failed_attempts` reaches ATTEMPT_LIMIT on one milestone.
  → Write a **Failure Report**: milestone/story, each attempt's approach and its error (chronological, with the last command output excerpts), files touched, suspected root cause, what a human should try next, and the working-tree state (what was reverted, what remains).
- **Done(project)** → final tally of the charter floors vs actual counts.
- **Abort immediately:** about to push, open a PR, edit dist/, add or upgrade dependencies beyond the story's need, or touch another project's folder or loop being run concurrently.

# TICK OUTPUT (short)
1. story / milestone (+ attempt n of ATTEMPT_LIMIT, round m of ERROR_ROUNDS_PER_ATTEMPT if failing)
2. PASS | FIXING | STOP (a) | STOP (b) | DONE
3. commands + results (lint, coaching, src/lib tests, financials tests, build, milestone checks)
4. files changed with +/-
5. next story (from the updated PROGRESS.md pointer)
```

---

## Authoring notes
- Tests are part of the product here. Keep them in the repo (unlike the throwaway `/tmp` validators used for the candlestick drill).
- Prefer pure functions in `src/lib/financials/` and thin components. Render tests use `react-dom/server`, so no browser is needed.
- If a story needs a decision that EPICS.md leaves open (e.g. FE5.M2 route vs modal), check the repo convention first (`pages/practice/*` routes, QuizModal modes). If it's still unclear → STOP (a). Do not guess on product shape.

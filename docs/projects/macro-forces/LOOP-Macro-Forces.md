# LOOP: Macro Forces — Releases, Rates & Market Reactions (project graph)

```text
COMMIT_MODE: none          # none (default) | local  (local = one local commit per PASSed milestone; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3           # consecutive failed attempts on the same milestone before STOP (b)
ERROR_ROUNDS_PER_ATTEMPT: 3 # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-macro --emptyOutDir && rm -rf /tmp/st-build-check-macro
CHECKPOINT_MODE: continue  # continue (render + log PENDING WENG SIGN-OFF, keep going; Weng's drain instruction 2026-10-21) | stop
```

Autonomous milestone loop for the project in this folder. It picks the next unfinished story, implements it, verifies it automatically, records progress here, and continues. It stops only for a blocking human judgment or repeated failure.

Companions: [`CHARTER.md`](./CHARTER.md) · [`EPICS.md`](./EPICS.md) · [`STORIES.md`](./STORIES.md) · [`PROGRESS.md`](./PROGRESS.md) · [`SOURCES.md`](./SOURCES.md) · sibling [`../financials-earnings/LOOP-Financials-Earnings.md`](../financials-earnings/LOOP-Financials-Earnings.md) · content graph [`../content-graph/LOOP-Graph.md`](../content-graph/LOOP-Graph.md) · section loops [`LOOPS/`](../../../LOOPS/README.md) · code refs [`AGENTS_CODE_REFERENCE.md`](../../../AGENTS_CODE_REFERENCE.md)

---

## How to run

```text
/loop macro project using docs/projects/macro-forces/LOOP-Macro-Forces.md
```

Override config on the same line, e.g. `COMMIT_MODE=local`, `ATTEMPT_LIMIT=2` or `CHECKPOINT_MODE=stop`. When there is no override, the block above is used.

**Before starting**
1. Leave a running `npm run dev` (port 3001) alone. Checkpoint screenshots use a separate temp dev server (`npx vite --port 3017 --strictPort`), killed afterwards.
2. Avoid running this together with the content graph or a section loop. If the financials loop runs concurrently, follow the concurrency rules below.
3. `dist/` is never touched. Builds go to the temp folder only.

---

## Relationship to other loops

- This is a **project** loop: it implements EPICS.md milestones (code + content).
- The content graph and section loops add **one content unit per tick** to existing surfaces. After MF8.M3, the graph's `macro` echo family gains a Learn hop to this project's groups.
- The root `AGENTS_LOOP-*.md` queues (E0–E11) are Done(global); this loop does not touch `.agents/state.json`.
- **Concurrency with the financials project:** shared files (`quizData.ts`, `literacyTerms.ts`, `ohlcData.ts`, `Training.tsx`, `App.tsx`, `CandlestickChart.tsx`, `package.json`, `LOOPS/README.md`, `AGENTS_*.md`) get small additive edits only; re-read right before editing; never revert or "fix" code this loop did not write. If a verify step fails inside the other project's in-progress files, wait and re-run; that does not count as a failed attempt. Reuse FE's optional `volume?` / event-line chart support once it lands; never build a parallel one.

---

## Loop prompt

```markdown
# OBJECTIVE
Implement docs/projects/macro-forces/EPICS.md milestone by milestone (stories in STORIES.md order) until every MF0–MF8 milestone is [x], then the MF9 stretch items that need no product decision.

**Done (project):** all MF0–MF8 milestone boxes are [x]; the three human checkpoints are either signed in PROGRESS.md or logged as PENDING WENG SIGN-OFF with render paths (CHECKPOINT_MODE=continue); the MF8.M4 audit recorded the charter floors.
**Done (per tick):** one story reaches PASS (and its milestone box flips if it was the last story), OR one attempt fails and is logged, OR a STOP is written.

# CONTEXT
- Config: the fenced block at the top of LOOP-Macro-Forces.md (COMMIT_MODE, ATTEMPT_LIMIT, ERROR_ROUNDS_PER_ATTEMPT, BUILD_CHECK, CHECKPOINT_MODE).
- Scope and stance: CHARTER.md (SIMULATED numbers in the layout of real releases, real-source links, educational, regime-dependent, no live data, no advice).
- Sources: SOURCES.md (verified URLs; registry in src/lib/macro/sources.ts must match it 1:1).
- What to build and how to prove it: EPICS.md (Build / Accept / Verify per milestone).
- Order and status: STORIES.md (one story in_progress at a time).
- Log and pointer: PROGRESS.md (append-only entries + "Current pointer").
- Repo conventions: AGENTS_CODE_REFERENCE*.md; reuse CandlestickChart annotations / scenarioCharts seeded-walk / QuizModal revealAnnotations / MarketChart; type-only imports into quizData.ts.
- Hard rules: no push, no PR, no dist/ edits, no new deps or API keys, no runtime fetch of any source, no changes to existing progress keys / Beginner unlocks / case grading / existing macro cases.

# STEP-BY-STEP CADENCE
1. **Orient**
   - Read PROGRESS.md "Current pointer", STORIES.md, and the current milestone in EPICS.md. Trust the files, not memory.
   - If the next milestone is a 🔍 HUMAN CHECKPOINT: build the review package (step 7). CHECKPOINT_MODE=continue → log `PENDING WENG SIGN-OFF` with paths, mark the story done, continue. CHECKPOINT_MODE=stop → STOP (a).
   - If every MF0–MF8 milestone is [x] → do MF9 stretch items; then STOP with Done(project).
2. **Mark start:** story `in_progress` in STORIES.md, milestone box `[~]` in EPICS.md, pointer in PROGRESS.md.
3. **Implement the current story only**, the minimal change that meets its Accept line. Write the milestone's tests first (or alongside), as named in Verify: `src/lib/macro/**/*.test.{ts,tsx}`.
4. **Verify (all must exit 0)**
   1. `npm run lint`
   2. `npm run test:coaching`
   3. `npm run test:lib` (`src/lib/*.test.{ts,tsx}`, includes the content-graph floors in `contentGraph.test.ts`)
   4. `npm run test:macro` (once MF0.M1.S2 exists; before that, run the new test file directly)
   5. `npm run test:financials` if that script exists (regression guard for the sibling project; failures inside its in-progress files → wait and re-run, not counted)
   6. BUILD_CHECK (temp outDir, then delete it)
   7. The milestone-specific checks from EPICS.md Verify. The data-consistency invariants below are always on once the code they cover exists.
   8. `git status --short dist/` is empty, and `git diff --stat` touches only files plausible for this story.
5. **On PASS**
   - STORIES.md: story `done`; if last of its milestone, flip EPICS.md to `[x]`.
   - PROGRESS.md: append an entry (files with +/- from `git diff --numstat` plus untracked line counts, every command with its result, milestone-specific assertions, Next). Reset `consecutive_failed_attempts` to 0 and move the pointer.
   - Commit per COMMIT_MODE: `none` → leave uncommitted. `local` → one local commit per finished milestone, message `MF<x>.M<y>: <summary>`, never `--no-verify`, never push.
   - Continue immediately to the next story.
6. **On FAIL**
   - Read the failure, apply a minimal fix, re-run the full verify list. That is one round.
   - After ERROR_ROUNDS_PER_ATTEMPT rounds still failing, the attempt has failed: log it, increment `consecutive_failed_attempts`, revert only this attempt's partial edits if they break unrelated checks, then start a fresh attempt with a different approach.
   - `consecutive_failed_attempts` reaches ATTEMPT_LIMIT on one milestone → STOP (b).
   - Never "fix" a failure by weakening a test, deleting an invariant, loosening a tolerance, or editing fixtures to match buggy code, unless the test contradicts EPICS.md. In that case, STOP (a).
7. **Human review package:** start a temp dev server on port 3017, screenshot the relevant routes with headless Chrome (`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=<path> --window-size=1400,<h> <url>`; fallback `renderToStaticMarkup` HTML) into `docs/projects/macro-forces/checkpoints/`, kill the server, list paths and the exact question for Weng in PROGRESS.md.

# DATA-CONSISTENCY INVARIANTS (enforced by tests, never by eyeballing)
- Surprise = actual − consensus; label hot / cool / in-line computed from surprise vs a per-kind threshold; z = surprise / consensus stdev.
- Payrolls: total nonfarm change = private + government; private = Σ private sectors; level[t] = level[t−1] + change[t]; the revision paragraph's numbers equal revised − previously published; the two-month net revision equals their sum.
- Household: labor force = employed + unemployed; unemployment rate = unemployed / labor force (0.1 rounding); participation = labor force / population.
- Prices: CPI / PPI / PCE month-over-month and 12-month % are computed from index levels (0.1 rounding); core excludes food and energy.
- Claims: 4-week average = mean of the last 4 weeks; week change = this week − prior revised.
- Rates: 2s10s (bp) = (10y − 2y) × 100; real 10y = 10y − breakeven; mortgage30 = weekly mean 10y + spread with spread in [1.3, 3.0]; 15y < 30y.
- Fed: target range width 25 bp; effective rate in range; decisions multiples of 25 bp; implied probabilities sum to 100; expected move = Σ p × move; surprise = decision − expected; median dot computed from 19 dots.
- GDP: annualized % = ((level / prior)^4 − 1) × 100; contributions sum to headline within 0.1.
- ISM: "Growing" ⇔ index > 50.
- Reaction charts: direction of each instrument matches the labelled outcome; release bar sits at the release-time slot; bond-price proxy moves opposite to yield; |move| non-decreasing in |surprise| within a kind and regime; reversal archetype fades past the release-bar midpoint; valid OHLC (low ≤ open, close ≤ high), no flat bars; deterministic.
- Game: answer keys derived from rules (never typed); ≥ 6 regimes; ≥ 4 muted/mixed and ≥ 4 reversal rounds; no direction > 50% of predictions; pre-answer render leaks no post-release bars or outcome labels; each explanation cites a number present in its round.
- Sources: every lesson's source id resolves; registry ↔ SOURCES.md 1:1; https on an allowlisted official domain; every simulated surface renders the SIMULATED banner and the real-source link.
- Learn / glossary: ids unique across all banks; answers exist in options; glossary ids resolve; chart keys and indices in range; numeric answers recomputed from world / releases.

# VERIFICATION RUBRIC (PASS only if all are true)
- [ ] The story's Accept line in EPICS.md / STORIES.md is met
- [ ] All verify commands exit 0, and the milestone tests exist in the repo and ran (count > 0)
- [ ] The invariants that apply are covered by tests that would fail on a broken fixture
- [ ] No SIMULATED-banner / disclaimer, unlock, progress-key, dist/ or dependency drift
- [ ] STORIES.md, EPICS.md and PROGRESS.md reflect the new truth

# STOP CONDITIONS
- **(a) Blocking human judgment:** a product decision not settled in CHARTER.md / EPICS.md (scope change, new dependency); educational accuracy that is genuinely ambiguous and blocks the next milestone; docs that conflict; a test that contradicts EPICS.md; or a 🔍 checkpoint when CHECKPOINT_MODE=stop.
  → **Blocker Report** in PROGRESS.md and the tick output: milestone/story, what's decided, exact question(s), options with a recommendation, review package paths.
- **(b) Repeated failure:** `consecutive_failed_attempts` reaches ATTEMPT_LIMIT on one milestone.
  → **Failure Report:** milestone/story, each attempt's approach and its error (chronological, with last output excerpts), files touched, suspected root cause, what a human should try next, working-tree state.
- **Done(project)** → final tally of the charter floors vs actual counts.
- **Abort immediately:** about to push, open a PR, edit dist/, add or upgrade dependencies, fetch a source at runtime, or edit/revert the financials project's files.

# TICK OUTPUT (short)
1. story / milestone (+ attempt n of ATTEMPT_LIMIT, round m of ERROR_ROUNDS_PER_ATTEMPT if failing)
2. PASS | FIXING | PENDING SIGN-OFF | STOP (a) | STOP (b) | DONE
3. commands + results (lint, coaching, src/lib tests, macro tests, financials tests, build, milestone checks)
4. files changed with +/-
5. next story (from the updated PROGRESS.md pointer)
```

---

## Authoring notes
- Tests are part of the product. Keep them in the repo.
- Prefer pure functions in `src/lib/macro/` and thin components. Render tests use `react-dom/server`, no browser.
- Look-alikes copy **structure and public field names**, not narrative text, logos or seals. Write every sentence fresh from the simulated facts.
- When a reaction tendency is contested (e.g. how bad news reads in a recession scare), teach it as regime-dependent and keep the rule's exception in the explanation rather than stopping.

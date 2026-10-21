# LOOP: Beginner Academy — courses, placement, paper trading, challenges, rewards, options ladder (project graph)

```text
COMMIT_MODE: none            # none (default) | local  (local = one local commit per PASSed milestone; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3             # consecutive failed attempts on the same milestone before STOP (b)
ERROR_ROUNDS_PER_ATTEMPT: 3  # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-academy --emptyOutDir && rm -rf /tmp/st-build-check-academy
CHECKPOINT_MODE: continue    # continue (render + log PENDING WENG SIGN-OFF, keep going; matches Weng's drain instruction) | stop
```

Autonomous milestone loop for the project in this folder. It picks the next unfinished story, implements it, verifies it automatically, records progress here, and continues. It stops only for blocking human judgment or repeated failure.

Companions: [`CHARTER.md`](./CHARTER.md) · [`RESEARCH.md`](./RESEARCH.md) · [`EPICS.md`](./EPICS.md) · [`STORIES.md`](./STORIES.md) · [`PROGRESS.md`](./PROGRESS.md) · siblings [`../financials-earnings/LOOP-Financials-Earnings.md`](../financials-earnings/LOOP-Financials-Earnings.md), [`../macro-forces/LOOP-Macro-Forces.md`](../macro-forces/LOOP-Macro-Forces.md) · content graph [`../content-graph/LOOP-Graph.md`](../content-graph/LOOP-Graph.md) · section loops [`LOOPS/`](../../../LOOPS/README.md) · code refs [`AGENTS_CODE_REFERENCE.md`](../../../AGENTS_CODE_REFERENCE.md)

---

## How to run

```text
/loop beginner academy project using docs/projects/beginner-academy/LOOP-Beginner-Academy.md
```

Override config on the same line, e.g. `COMMIT_MODE=local`, `ATTEMPT_LIMIT=2` or `CHECKPOINT_MODE=stop`. When there is no override, the block above is used.

**Before starting**
1. Leave a running `npm run dev` (port 3001) alone. Checkpoint screenshots use a separate temp dev server (`npx vite --port 3018 --strictPort`), killed afterwards.
2. Do not run this together with the content graph, a section loop, or another project loop in the same working tree. They edit the same registries (`quizData.ts`, `literacyTerms.ts`, `App.tsx`, `Training.tsx`, `Dashboard.tsx`).
3. Start from a clean or committed tree for files outside this project (check `git status --short`); if the financials / macro / trade-management work is still uncommitted, record that in PROGRESS.md and touch none of their files.
4. `dist/` is never touched. Builds go to the temp folder only.

---

## Relationship to other loops

- This is a **project** loop: it implements EPICS.md milestones (code + content).
- The content graph ([`../content-graph/LOOP-Graph.md`](../content-graph/LOOP-Graph.md)) and the section loops in `LOOPS/` add **one content unit per tick** to existing surfaces. After BA10.M3, the graph may add more questions to the `orders-and-fills`, `paper-pnl` and `options-ladder` groups and more units to the course map; Academy units must keep linking to (not copying) graph-produced content.
- The financials (`FE*`) and macro (`MF*`) projects are Done; Academy units **link** into their routes and groups. Never edit their files except the additive integration lines named in EPICS.md (e.g. a new route in `App.tsx`).
- Trade-management content (stop-loss, trailing stop, profit target, breakout / pullback / reversal entries) is being added by a sibling change. BA1 L3 units and BA10.M2 terms **reference** those ids when they exist (resolver test) and add only what is missing.
- The root `AGENTS_LOOP-*.md` milestone queues (E0–E11) are Done(global); this loop does not touch `.agents/state.json`.

---

## Loop prompt

```markdown
# OBJECTIVE
Implement docs/projects/beginner-academy/EPICS.md milestone by milestone (stories in STORIES.md order) until every BA0–BA10 milestone is [x]. BA11 only after an approval line in PROGRESS.md.

**Done (project):** all BA0–BA10 milestone boxes are [x], every 🔍 checkpoint has a PROGRESS.md entry (signed or PENDING), and BA10.M5 recorded the charter floors.
**Done (per tick):** one story reaches PASS (and its milestone box flips if it was the last story), OR one attempt fails and is logged, OR a STOP is written.

# CONTEXT
- Config: the fenced block at the top of LOOP-Beginner-Academy.md (COMMIT_MODE, ATTEMPT_LIMIT, ERROR_ROUNDS_PER_ATTEMPT, BUILD_CHECK, CHECKPOINT_MODE).
- Scope, stance and default decisions D1–D5: CHARTER.md (simulated only, virtual points, original content, educational, no brokerage).
- Why each feature exists and what it maps to: RESEARCH.md (patterns only — never copy broker text, names, colours or quiz items).
- What to build and how to prove it: EPICS.md (Build / Accept / Verify per milestone; BA4 fill rules are normative).
- Order and status: STORIES.md (one story in_progress at a time).
- Log and pointer: PROGRESS.md (append-only entries + "Current pointer" + sign-off table).
- Repo conventions: AGENTS_CODE_REFERENCE*.md, the financials / macro patterns (own folder, own test script, type-only imports into quizData.ts / literacyTerms.ts, injectable KVStorage, render tests via react-dom/server).
- Hard rules: no push, no PR, no dist/ edits, no new or upgraded dependencies, no network at runtime, no changes to existing progress keys / Beginner unlocks / case grading, no edits to other projects' files beyond the named additive integration lines.

# STEP-BY-STEP CADENCE
1. **Orient**
   - Read PROGRESS.md "Current pointer", STORIES.md, and the current milestone in EPICS.md. Trust the files, not memory; re-derive the next story from STORIES.md statuses.
   - First tick only: run the full verify list on the untouched tree and record the baseline counts in PROGRESS.md. If the baseline is already red, STOP (a) — do not build on a broken tree.
   - If the next milestone is a 🔍 HUMAN CHECKPOINT: build the review package (step 7), log `PENDING WENG SIGN-OFF` in PROGRESS.md, mark the milestone [x] (package delivered), and continue when CHECKPOINT_MODE=continue; STOP (a) when CHECKPOINT_MODE=stop.
   - If every BA0–BA10 milestone is [x] → STOP with Done(project).
2. **Mark start:** set the story to `in_progress` in STORIES.md, the milestone box to `[~]` in EPICS.md, and update the pointer in PROGRESS.md.
3. **Implement the current story only**, the minimal change that meets its Accept line. Write the milestone's tests first (or alongside), as named in Verify: `src/lib/academy/**/*.test.{ts,tsx}`. Reuse existing infra (CandlestickChart, QuizModal conventions, PracticeShell, JargonText, coaching validator); do not rewrite them.
4. **Verify (all must exit 0)**
   1. `npm run lint`
   2. `npm run test:coaching`
   3. `npx tsx --test src/lib/*.test.ts`
   4. `npm run test:financials`
   5. `npm run test:macro`
   6. `npm run test:academy` (once BA0.M1.S2 exists; before that, run the new test file directly with `npx tsx --test <file>`)
   7. BUILD_CHECK (temp outDir, then delete it)
   8. The milestone-specific checks from EPICS.md Verify. The invariants below are always on once the code they cover exists.
   9. `git status --short dist/` is empty, and `git diff --stat` + `git status --short` touch only files plausible for this story (this folder, `src/lib/academy/`, `src/components/academy/`, `src/pages/academy/`, and the additive integration files EPICS.md names for this milestone).
5. **On PASS**
   - STORIES.md: set the story to `done`. If it was the milestone's last story, flip EPICS.md to `[x]`.
   - PROGRESS.md: append an entry (files with +/- from `git diff --numstat` plus untracked line counts, every command with its result and test counts, the milestone-specific assertions, Next). Reset `consecutive_failed_attempts` to 0 and move the pointer.
   - Commit per COMMIT_MODE: `none` → leave everything uncommitted. `local` → one local commit per finished milestone, message `BA<x>.M<y>: <summary>`, never `--no-verify`, never push.
   - Continue immediately to the next story (same turn if time remains). Do not pause for review except at a STOP condition.
6. **On FAIL**
   - Read the failure, apply a minimal fix, and re-run the full verify list. That is one round.
   - After ERROR_ROUNDS_PER_ATTEMPT rounds still failing, the attempt has failed: log it in PROGRESS.md (error, files, approach), increment `consecutive_failed_attempts`, revert only this attempt's partial edits if they break unrelated checks, then start a fresh attempt with a different approach.
   - If `consecutive_failed_attempts` reaches ATTEMPT_LIMIT on the same milestone → STOP (b).
   - A failure in a sibling suite (`test:financials`, `test:macro`, coaching, src/lib) caused by this story is this story's failure. A failure that reproduces on the baseline without this story's changes → STOP (a) (don't fix other projects' code).
   - Never "fix" a failure by weakening a test, deleting an invariant, loosening a tolerance, skipping a test, or editing fixtures to match buggy code, unless the test itself contradicts EPICS.md. In that case, STOP (a).
7. **Human review package** (for checkpoints and STOP (a)): render the relevant components to static HTML (`renderToStaticMarkup` via a temp tsx script inside the repo, deleted afterwards) and screenshot them with a headless browser against the temp dev server (port 3018) if available. Save to `docs/projects/beginner-academy/checkpoints/ba<epic>-*.png`. List the files and paths. Put the exact question(s) for Weng in PROGRESS.md.

# INVARIANTS (enforced by tests, never by eyeballing)
- Content: ids unique across every quiz bank in the app (quizData, financials, macro, academy) and across LITERACY_TERMS; answers exist in options; no letter > 35% per level / group; every ContentRef resolves; every unit has 3–6 cards, ≤ 120 words per card, estMinutes ≤ 5 at 200 wpm, ≥ 1 ref into existing content, and a 3–5 item quiz; banned-phrase list (broker names, "guaranteed", "risk-free profit", "can't lose") never appears in academy content.
- Progress: unlock = prerequisites mastered or tested-out; best score kept; placement routing monotone; Academy never writes `analysis_core_progress_v1` or any non-academy key (spy-storage tests).
- Paper engine (BA4 fill rules are normative):
  - equity = cash + Σ qty × mark at every bar; cash + reserved buying power ≥ 0; no negative positions (no shorting in v1);
  - Σ fill cash flows reconcile to cash − starting cash; realised P&L = Σ (sell fill − avg cost) × qty;
  - market fills at next bar open; limits fill at the limit or better; stops fill at the stop or worse (gap → open); stop-limit can stay unfilled after a gap past its limit; trailing stop level is non-decreasing for sells;
  - Day orders expire after their bar; GTC persists; cancel / fill / expire release reserved buying power exactly;
  - integer cents and integer shares everywhere; deterministic (same inputs → deep-equal state).
- Challenges: each has a passing reference play and a breaching reckless play; discipline ≥ 50% of max score; leaderboard ranks handle ties; rotation deterministic per ISO week.
- Rewards: ledger append-only and idempotent per key; retries award delta only; no spend / redeem path exists; streak uses the local calendar day with injectable clock (DST-safe); every badge reachable by the scripted learner; badges never revoked; every rewards surface states points are virtual and not redeemable.
- Options: payoff piecewise linear with kinks only at strikes; max gain / loss / breakevens equal the grid extremes / zero crossings; per-contract = per-share × 100; L(n) requires L(n−1); ≤ 3 attempts per rolling 24 h; risk acknowledgement required; no chain / Greeks / pricing-model wording in academy options files.
- Surfaces: every paper surface renders the SIMULATED banner; no surface fetches the network; no future bars render before stepping; pre-answer quiz markup never contains explanations or correct markers.

# VERIFICATION RUBRIC (PASS only if all are true)
- [ ] The story's Accept line in EPICS.md / STORIES.md is met
- [ ] All verify commands exit 0, and the milestone tests exist in the repo and ran (test count > 0 and higher than before when tests were added)
- [ ] The invariants that apply are covered by tests that would fail on a broken fixture
- [ ] No SIMULATED / virtual-points / options-risk disclaimer, unlock, progress-key, dist/ or dependency drift
- [ ] STORIES.md, EPICS.md and PROGRESS.md reflect the new truth

# STOP CONDITIONS (the only reasons to stop before Done)
- **(a) Human judgment needed:** a verification fails in a way tests cannot decide — a visual / UX call, ambiguous educational accuracy (e.g. a disputed fill rule or options formula), or a product decision not settled in CHARTER.md §8 / EPICS.md (new dependency, scope change, nav placement that breaks convention); docs that conflict; a test that contradicts EPICS.md; a red baseline; or a 🔍 checkpoint when CHECKPOINT_MODE=stop.
  → Write a **Blocker Report** in PROGRESS.md and in the tick output: milestone/story, what's decided, the exact question(s), options with a recommendation, the review package paths.
- **(b) Repeated failure:** `consecutive_failed_attempts` reaches ATTEMPT_LIMIT (3) on one milestone.
  → Write a **Failure Report**: milestone/story, each attempt's approach and its error (chronological, with the last command output excerpts), files touched, suspected root cause, what a human should try next, and the working-tree state (what was reverted, what remains).
- **Done(project)** → final tally of the charter floors vs actual counts (from `floors.test.ts`).
- **Abort immediately:** about to push, open a PR, edit dist/, add or upgrade a dependency, add a runtime network call, touch a real brokerage / broker API, write a foreign localStorage key, or edit another project's files beyond the named additive lines.

# TICK OUTPUT (short)
1. story / milestone (+ attempt n of ATTEMPT_LIMIT, round m of ERROR_ROUNDS_PER_ATTEMPT if failing)
2. PASS | FIXING | PENDING SIGN-OFF | STOP (a) | STOP (b) | DONE
3. commands + results (lint, coaching, src/lib tests, financials, macro, academy, build, milestone checks)
4. files changed with +/-
5. next story (from the updated PROGRESS.md pointer)
```

---

## Authoring notes
- Tests are part of the product here. Keep them in the repo.
- Prefer pure functions in `src/lib/academy/` and thin components. Render tests use `react-dom/server`, so no browser is needed.
- Lesson cards teach one idea each, in plain sentence-case English, then point at the app surface where the learner practises it. Link, don't duplicate.
- When a fill rule or options formula feels ambiguous, the EPICS.md BA4 / BA8 text wins; if it is silent → STOP (a). Do not guess on money math.
- If a story needs a decision EPICS.md leaves open (e.g. AppChrome nav item vs Training card), check the repo convention first (`pages/practice/*`, `pages/macro/*`, Training cards). If it's still unclear → STOP (a).

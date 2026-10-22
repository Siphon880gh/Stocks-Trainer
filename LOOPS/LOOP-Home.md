# LOOP — Home / Dashboard (exhaustive learner copy)

```text
COMMIT_MODE: none            # none (default) | local (one local commit per PASSed unit; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3             # consecutive failed attempts on the same unit before STOP (same rule as the project loops)
ERROR_ROUNDS_PER_ATTEMPT: 3  # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-home --emptyOutDir && rm -rf /tmp/st-build-check-home
VERIFY: npm run lint && npm run test:content && BUILD_CHECK
CHECKPOINT_MODE: continue    # no visual checkpoints here; a human-judgment STOP still stops
```

Deepen Home `/` copy and path-adjacent helper text: GoalPicker, next-step tips, credential lines, Navigator blurbs. **Not** a feature-rewrite loop.

Companions: [`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx) · [`src/components/GoalPicker.tsx`](../src/components/GoalPicker.tsx) · [`src/lib/beginnerPath.ts`](../src/lib/beginnerPath.ts) · [`src/lib/learningPaths.ts`](../src/lib/learningPaths.ts) · [`src/lib/thinkingModeTips.ts`](../src/lib/thinkingModeTips.ts) · [`src/components/MarketNavigator.tsx`](../src/components/MarketNavigator.tsx)

---

## How to run

```text
/loop exhaustive Home content using LOOPS/LOOP-Home.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with the VERIFY line in the config block (temp build dir, never `dist/`).
2. Stop yourself anytime; hard-stop after ATTEMPT_LIMIT (3) consecutive failed attempts on one unit or Done(home).

**On each tick**
- Pick the next copy gap from the queue.
- Change **one** learner-facing string cluster (one milestone tip, one path blurb, one empty state — not a drive-by rewrite of Dashboard.tsx).
- Do not change unlock logic, progress keys, or path order.
- VERIFY; continue.

---

## Product intent

Home should always answer: **what is my path, what do I do next, what did I already finish.** Copy gets more specific as Cases/Learn/Coach content grows (tips name real packs and sessions).

**Always:** sentence case · SAMPLE honesty · no `SNAKE_CASE` in learner UI · no LIVE theater · chart is louder than chrome.

---

## Coverage queue (strict order)

1. **`coachTip` on every Beginner / Decision Maker / Market Explorer milestone** in `beginnerPath.ts` — concrete next action (quiz group name or pack name), not generic “keep going.”
2. **`COACH_TIP_BY_THINKING_MODE`** — every `CaseThinkingMode` has a tip that matches how Cases now teach that mode (update when Cases loop added a mode).
3. **GoalPicker path cards** — three paths: who it is for, what you will click first, what “done” looks like; Equities = traditional retail stocks on Beginner.
4. **Dashboard empty / locked / complete states** — first-run, chart-gate locked, path complete credential, Decision Maker badge, Market Explorer done; each distinct.
5. **Account helper lines** — local only; export/import; no fake cloud sync success.
6. **Market Navigator compact copy** on Home (if rendered) — **View charts** / **Literacy** / **Decide cases** stay accurate for SAMPLE.
7. **Shipped-surface pointers** — when a milestone's skill has a shipped surface, the tip names it once, as optional depth, without changing the next action: statements → Learn → Reading the Statements / Practice → Statements lab; earnings milestones → Learn → Earnings Preview / Read the Print and Coach → Earnings week; market-wide news → the Macro Desk (SIMULATED releases, `MacroHomeTip`); chart milestones → Coach → One candle is not a signal / Oversold is not a buy signal; trade management → Coach → Plan the trade before you click. (2026-10-21: shipped in `learningPaths.ts`.)

Skip a row when the copy already names the real next surface (Training group, Cases pack, Coach slug).

**Names must be real.** A tip that says `Coach → <title>` must use a session's exact catalog title (not a paraphrase: "Beat vs miss on a SAMPLE report", not "Beat vs miss"), and `Training → <name>` / `Learn → <name>` must name a real Learn group or practice surface. `test:content` → "Home tip references" checks both; the 2026-10-21 audit fixed one tip that pointed at a non-existent title.

**Out of scope:** new paths, new milestones, progress schema, visual redesign.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Home copy exhaustive and accurate to shipped content, without changing path mechanics.

**Done (home):** Coverage rows 1–7 all accurate vs current registries (milestones, thinking modes, three paths, account, navigator, shipped surfaces).

**Done (per tick):** One copy cluster updated and verified.

# CONTEXT
- Path defs + tips: `src/lib/beginnerPath.ts`, `src/lib/learningPaths.ts`
- Thinking-mode tips: `src/lib/thinkingModeTips.ts`
- UI: `Dashboard.tsx`, `GoalPicker.tsx`, `MarketNavigator.tsx`
- Tone: `.impeccable.md` — clear, practiced, unhurried; sentence case
- Auto-verify: VERIFY (`npm run lint` && `npm run test:content` && BUILD_CHECK)

# STEP-BY-STEP CADENCE
1. **Orient** — read the next Coverage row; compare to source strings.
2. **Edit one cluster** — keep labels the UI already keys on (button names in QA_User_Flows.md). If QA names a label, do not rename it here.
3. **Verify** — VERIFY; progress keys unchanged (`analysis_core_progress_v1`).
4. **On FAIL** — ≤3 fix rounds per attempt; STOP after 3 failed attempts on the same unit.

# VERIFICATION RUBRIC
- [ ] One copy cluster
- [ ] No unlock / schema / route changes
- [ ] QA-critical labels preserved
- [ ] SAMPLE honesty; no LIVE; no snake_case learner labels
- [ ] lint + test:content + BUILD_CHECK 0

# STOP CONDITIONS
- Done(home) → STOP.
- 3 consecutive failed attempts on one unit → handoff.
- Human verification: brand-tone disagreement.
- Abort: GoalPicker behavior change; RESET_PATH confirmation rewrite that drops the confirm dialog.

# TICK OUTPUT
1. file + which tip/blurb
2. PASS | FIXING (attempt a/3 · round r/3) | STOP
3. Next row
4. lint / test:content / build-check status
```

---

## Authoring notes

- Prefer pointing at existing routes (`/training?group=…`, `/cases?pack=…`, `/coach/…`) over inventing new CTAs.
- If Cases/Coach loops added content, Home tips should name those packs/slugs rather than stay generic.
- This loop is the right place to fix stale “Packs A–C” style leftovers **only** when that string lives on Home/Dashboard/GoalPicker — Learn page copy belongs to the Learn loop.

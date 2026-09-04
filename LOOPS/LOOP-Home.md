# LOOP — Home / Dashboard (exhaustive learner copy)

Deepen Home `/` copy and path-adjacent helper text: GoalPicker, next-step tips, credential lines, Navigator blurbs. **Not** a feature-rewrite loop.

Companions: [`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx) · [`src/components/GoalPicker.tsx`](../src/components/GoalPicker.tsx) · [`src/lib/beginnerPath.ts`](../src/lib/beginnerPath.ts) · [`src/lib/learningPaths.ts`](../src/lib/learningPaths.ts) · [`src/lib/thinkingModeTips.ts`](../src/lib/thinkingModeTips.ts) · [`src/components/MarketNavigator.tsx`](../src/components/MarketNavigator.tsx)

---

## How to run

```text
/loop exhaustive Home content using LOOPS/LOOP-Home.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(home).

**On each tick**
- Pick the next copy gap from the queue.
- Change **one** learner-facing string cluster (one milestone tip, one path blurb, one empty state — not a drive-by rewrite of Dashboard.tsx).
- Do not change unlock logic, progress keys, or path order.
- Lint + build; continue.

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

Skip a row when the copy already names the real next surface (Training group, Cases pack, Coach slug).

**Out of scope:** new paths, new milestones, progress schema, visual redesign.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Home copy exhaustive and accurate to shipped content, without changing path mechanics.

**Done (home):** Coverage rows 1–6 all accurate vs current registries (milestones, thinking modes, three paths, account, navigator).

**Done (per tick):** One copy cluster updated and verified.

# CONTEXT
- Path defs + tips: `src/lib/beginnerPath.ts`, `src/lib/learningPaths.ts`
- Thinking-mode tips: `src/lib/thinkingModeTips.ts`
- UI: `Dashboard.tsx`, `GoalPicker.tsx`, `MarketNavigator.tsx`
- Tone: `.impeccable.md` — clear, practiced, unhurried; sentence case
- Auto-verify: `npm run lint` && `npm run build`

# STEP-BY-STEP CADENCE
1. **Orient** — read the next Coverage row; compare to source strings.
2. **Edit one cluster** — keep labels the UI already keys on (button names in QA_User_Flows.md). If QA names a label, do not rename it here.
3. **Verify** — lint + build; progress keys unchanged (`analysis_core_progress_v1`).
4. **On FAIL** — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One copy cluster
- [ ] No unlock / schema / route changes
- [ ] QA-critical labels preserved
- [ ] SAMPLE honesty; no LIVE; no snake_case learner labels
- [ ] lint + build 0

# STOP CONDITIONS
- Done(home) → STOP.
- Error budget 10 → handoff.
- Human verification: brand-tone disagreement.
- Abort: GoalPicker behavior change; RESET_PATH confirmation rewrite that drops the confirm dialog.

# TICK OUTPUT
1. file + which tip/blurb
2. PASS | FIXING (n/10) | STOP
3. Next row
4. lint/build status
```

---

## Authoring notes

- Prefer pointing at existing routes (`/training?group=…`, `/cases?pack=…`, `/coach/…`) over inventing new CTAs.
- If Cases/Coach loops added content, Home tips should name those packs/slugs rather than stay generic.
- This loop is the right place to fix stale “Packs A–C” style leftovers **only** when that string lives on Home/Dashboard/GoalPicker — Learn page copy belongs to the Learn loop.

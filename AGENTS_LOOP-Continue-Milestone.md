# AGENTS_LOOP — Continue Milestone

Reusable loop prompt for advancing Stock Trainer (ANALYSIS_CORE) through **all** milestone queues: P0 → post-P0 → later (E7/E8), until every ordered milestone is `done`.

Companions: [`.agents/state.json`](./.agents/state.json) · [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) · [`EPIC_MAP.md`](./EPIC_MAP.md) · [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md)

---

## How to run

**Preferred (dynamic loop — agent self-paces after each tick):**

```text
/loop continue milestones using AGENTS_LOOP-Continue-Milestone.md
```

Or paste the full prompt body below after `/loop` with no interval:

```text
/loop <paste everything under "Loop prompt" below>
```

**Fixed interval (only if you want heartbeat ticks even while idle):**

```text
/loop 5m continue milestones using AGENTS_LOOP-Continue-Milestone.md
```

Prefer **no interval** for implementation work so each wake continues the next story instead of waiting on a timer.

**Before starting**
1. Confirm `.agents/state.json` points at the story you want (`current_milestone_id`, `next_action`).
2. Is your current server working? If you already have `npm run dev` up, leave it alone; the loop uses `npm run lint` + `npm run build` for auto-verify, not the dev server.
3. Stop the loop yourself when you want (outer iterations are infinite). The agent also hard-stops on the error budget or human-verification cases below.

**On each tick the agent should**
- Read this file + `.agents/state.json` + the current milestone in `IMPLEMENTATION_STORIES.md`
- Implement one story, auto-verify, update state, continue
- Create/adapt skills under `.agents/skills/*` when work repeats

**Stop the loop**
- Tell the agent to stop / cancel the loop, or stop the Cursor agent process
- If it hits the 10-round error budget, it stops with an Error Handoff Summary for you

---

## Milestone queues (in order)

Read from `.agents/state.json` → `milestones`:

| Queue key | When to enter | Contents |
|-----------|---------------|----------|
| `implementation_order` | First | P0 through MVP freeze |
| `post_mvp_order` | After MVP freeze checklist is green (or human GO) | Skill-depth milestones |
| `later_order` | After `post_mvp_order` is fully done | E7 Practice Draw, E8 data/accounts |

**Never skip a queue.** Finish every id in the current queue before starting the next.

---

## Loop prompt

```markdown
# OBJECTIVE
Advance Stock Trainer (ANALYSIS_CORE) through **every** milestone queue until global Done.

Work queues (strict order), from `.agents/state.json` → `milestones`:
1. `implementation_order` (P0 → MVP freeze)
2. `post_mvp_order` (only after MVP freeze checklist green, or human GO already recorded)
3. `later_order` (E7 / E8 — after post-P0 complete)

**Done (global):** Every milestone id in all three queues is complete, with stories meeting acceptance in `IMPLEMENTATION_STORIES.md`.

**Done (per tick):** Exactly one story advanced to acceptance-pass, or one error-recovery round completed with a clear next action.

# CONTEXT
- State of record: `.agents/state.json` (`current_epic_id`, `current_milestone_id`, `next_action`, `status`)
- Story + acceptance source: `IMPLEMENTATION_STORIES.md` (including Later / E7 / E8 sections)
- Product map / constraints: `EPIC_MAP.md`, `AGENTS_CODE_REFERENCE.md` (+ feature companions as needed)
- Execution rules: one milestone `in_progress` at a time; follow the active queue in order; do not invent milestones outside the queues
- Auto-verify commands (this repo): `npm run lint` and `npm run build`
- Optional local skills: `.agents/skills/*` (create/adapt when a task repeats)

# STEP-BY-STEP CADENCE
1. **Orient**
   - Read `.agents/state.json` and the current milestone section in `IMPLEMENTATION_STORIES.md`.
   - Pick the active queue:
     - If any id in `implementation_order` unfinished → that queue
     - Else if any id in `post_mvp_order` unfinished → that queue (respect MVP freeze gate)
     - Else if any id in `later_order` unfinished → that queue
     - Else → Done(global) → STOP
   - Identify the single next unfinished story (e.g. `E7.M1.S1`). Do not skip ahead inside a queue.

2. **Implement the current story only**
   - Minimal changes that satisfy that story’s Acceptance column.
   - Prefer extending registries / existing patterns per `AGENTS_CODE_REFERENCE.md`.
   - Do not rewrite the chart stack unless the current story requires it; reuse Training/QuizModal/CasePlayer where stories say so.
   - For E8: prefer **adapter + mock/delayed SAMPLE providers** that satisfy acceptance without paid keys. STOP (human verification) only if a story truly requires a real credential/API key the agent cannot invent.

3. **Automatic verification (required before marking progress)**
   - Run `npm run lint` then `npm run build`.
   - Mentally check the story Acceptance criteria + global definition of done in `IMPLEMENTATION_STORIES.md` (regression to Market/Training/Archive happy paths; progress keys stable; terminal tone; no LIVE/REAL_TIME theater on path surfaces unless the current E8 story explicitly adds a clearly labeled delayed/live adapter).

4. **On PASS**
   - Update `.agents/state.json`: story/milestone progress, `next_action`, `last_updated_iso`, status fields as appropriate.
   - Update Status columns in `IMPLEMENTATION_STORIES.md` when a milestone flips.
   - Immediately continue to the next story in the same milestone; when the milestone is complete, GO to the next id in the **active queue** (treat GO as automatic if auto-verify passed).
   - When a queue finishes, enter the next queue automatically (P0 → post-P0 → later).
   - Do **not** pause for human review unless a stop condition below applies.

5. **On FAIL (lint/build/acceptance)**
   - Enter **error-fix mode** (see Error budget).
   - Read stderr / type errors; patch with minimal changes; re-run lint+build.
   - Count every failed verify → fix → re-verify cycle as one round, including new errors introduced by a fix.

6. **Skills (efficiency / self-heal)**
   - If the same workflow repeats (e.g. “add equity pack”, “wire quiz group writeback”, “GO milestone + state update”, “practice-draw grade”), create or update a skill under `.agents/skills/<skill-name>/SKILL.md`.
   - Skills may be self-learning: on failure, try a plausible fix, then rewrite the skill once the approach works.
   - If a skill is reused for a different purpose, create a new skill instead of overloading the old one.

# VERIFICATION RUBRIC
Return **PASS** for the current story only if ALL are true:
- [ ] Story Acceptance criteria in `IMPLEMENTATION_STORIES.md` are met
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0
- [ ] No intentional scope creep beyond the current story (unless required to unblock acceptance)
- [ ] `.agents/state.json` reflects the new truth (`next_action` points at the real next story)

Return **CONTINUE** after PASS (start next story same tick if time remains; otherwise end turn ready for next loop wake).

Return **STOP** only under Stop Conditions (including Done(global)).

# STOP CONDITIONS / ESCAPE HATCHES
- **Maximum outer iterations:** Infinite. Human stops the process when desired.
- **Done(global):** All queues (`implementation_order`, `post_mvp_order`, `later_order`) complete → STOP with status reflecting full milestone completion.
- **Error budget (hard stop):** If the same blocking failure (or the chain of new errors spawned while fixing it) is not resolved within **10** fix rounds, STOP immediately.
  - Emit an **Error Handoff Summary** for human takeover:
    - Current `epic` / `milestone` / `story` ids
    - Original error + subsequent errors (chronological)
    - Files touched and approaches tried
    - Last command outputs (lint/build excerpts)
    - Suspected root cause and what a human should try next
    - Whether a skill was involved and what it claimed vs what failed
- **Human verification required (hard stop):** STOP and ask the human only when automatic verification cannot decide, e.g.:
  - Ambiguous product/UX choice not already locked in `.agents/state.json` / EPIC_MAP / council reports
  - Need for real visual/UX judgment that lint+build cannot catch AND acceptance criteria explicitly require human taste
  - Credential/secret/external account or paid API decisions (typical E8 risk — prefer mock/delayed adapters first)
  - Conflicting instructions between docs that block a single correct implementation
- **Abort immediately (hard stop):** About to alter unexpected third-party dependency surface in a risky way (unrelated major upgrades, removing unused package.json deps “for cleanup”) **unless the current story in `later_order` / E8 explicitly requires it** — then implement the minimal adapter surface the story asks for, still preferring mock/delayed SAMPLE over live keys.
- **MVP freeze gate:** After `E6.M1` / freeze checklist items, do not enter `post_mvp_order` until the MVP freeze checklist in `IMPLEMENTATION_STORIES.md` is green; if checklist cannot be auto-confirmed, STOP for human GO. Once post-P0 is done, enter `later_order` without another human GO.

# TICK OUTPUT (keep short)
Each loop tick ends with:
1. `milestone/story` worked (+ which queue: P0 / post-P0 / later)
2. PASS | FIXING (round n/10) | STOP
3. Commands run + exit status
4. `next_action` (copied from updated state)
5. Skills created/updated (paths only), if any
```

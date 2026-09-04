# AGENTS_LOOP — Step-by-step Coaching (E11)

Reusable loop for **deterministic decision-tree coaching**: catalog → node choices → wrong endings with `rewind_to` → success → restart; path trail from history. **No runtime LLM.**

Companions: [`.agents/state.json`](./.agents/state.json) · [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) (E11 section) · [`EPIC_MAP.md`](./EPIC_MAP.md) · [`README.md`](./README.md) · [`QA_User_Flows.md`](./QA_User_Flows.md) · terminal UI patterns in [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md)

Wired as queue **`step_coaching_order`** in [`AGENTS_LOOP-Continue-Milestone.md`](./AGENTS_LOOP-Continue-Milestone.md) (after `market_learning_order` / E10).

---

## Product intent

| Learner need | How E11 delivers |
|--------------|------------------|
| Learn by failing safely | Explicit `wrong` nodes explain mistakes + `rewind_to` the decision |
| Guided reasoning across topics | Sessions tagged for literacy / statements / charts / cases / multi-market |
| Transparent path history | Path visualizer derived from the same history stack as step-back |
| No AI theater | Predefined graphs only; runtime loads, displays, navigates, persists |

**Always:** SAMPLE/educational framing · no LIVE · no brokerage · do not replace Beginner unlocks · do not rewrite CasePlayer/QuizModal.

**Not this epic:** Cloud LLM coach (still later / out of E11 scope).

---

## How to run

```text
/loop step coaching using AGENTS_LOOP-Step-Coaching.md
```

Or global continue (queue 6):

```text
/loop continue milestones using AGENTS_LOOP-Continue-Milestone.md
```

**Before starting**
1. E10 / `market_learning_order` complete; `next_action` at `E11.M1.S1` (or first unfinished E11 story).
2. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build` + `npm run test:coaching`.
3. Stop yourself anytime; hard-stop on 10-round error budget or Done(step_coaching).

---

## Queue (strict order)

From `.agents/state.json` → `milestones.step_coaching_order`:

1. `E11.M1` Content schema + validate + discovery + sample  
2. `E11.M2` Navigation engine (choose / back / rewind / restart)  
3. `E11.M3` Catalog + session UI + outcome styling  
4. `E11.M4` Persist adapter + path visualizer  
5. `E11.M5` Topic sessions + Dashboard/Navigator CTAs  
6. `E11.M6` Automated tests + QA + README + authoring skill  

---

## Loop prompt

```markdown
# OBJECTIVE
Ship `step_coaching_order` (epic E11) until every E11.M* milestone is done.

**Done (step_coaching):** All ids in `milestones.step_coaching_order` complete per `IMPLEMENTATION_STORIES.md`.

**Done (per tick):** Exactly one E11 story to acceptance-pass, or one error-recovery round.

# CONTEXT
- State: `.agents/state.json` (epic E11 while this queue runs)
- Stories: `IMPLEMENTATION_STORIES.md` → Step coaching — E11
- Placement: `src/lib/coaching/*` + `/coach` + `/coach/:slug` (see epic map / stories placement table)
- Auto-verify: `npm run lint` && `npm run build` (and coaching tests when script exists)
- Skills: create/adapt `.agents/skills/add-coaching-session/SKILL.md` when authoring sessions repeats

# STEP-BY-STEP CADENCE
1. **Orient** — next unfinished `E11.Mx.Sy`; do not skip ahead in `step_coaching_order`.
2. **Implement story only**
   - Content separate from runtime; validate before list/play.
   - History stack is the single model for step-back and path trail.
   - Persistence behind adapter (`sessionStorage` default); ProgressStore only for optional completion tips.
   - Terminal tone; outcome states not color-only; keyboard-accessible choices.
   - Never add LLM / random branching / LIVE theater.
3. **Verify** — lint + build (+ tests if present); Acceptance column green.
4. **On PASS** — update `.agents/state.json` + Status in stories; continue next story / milestone / Done(step_coaching).
5. **On FAIL** — error-fix (max 10 rounds) then Error Handoff Summary.

# STOP CONDITIONS
- Done(step_coaching) → STOP (or Continue-Milestone treats global Done if no further queues).
- Error budget 10 rounds → STOP with handoff.
- Human verification only for ambiguous UX not locked in docs, or if a story truly requires taste judgment beyond lint/build.
```

---

## Authoring note (content-only)

When the runtime already exists, new sessions = new files under `src/lib/coaching/sessions/` with `meta` + `tree`, ≥1 wrong with `rewind_to`, ≥1 success, durable choice labels. Follow the shorter content prompt in the product coaching spec; skill `add-coaching-session` once written.

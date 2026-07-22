# AGENTS_LOOP — Market Learning Coverage (E10)

Reusable loop for **navigation**, **news + statements drills**, and **SAMPLE decide-and-reveal** across Equities / Futures / Forex / Crypto / Options context.

Companions: [`.agents/state.json`](./.agents/state.json) · [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) (E10 section) · [`EPIC_MAP.md`](./EPIC_MAP.md) · [`README.md`](./README.md) · [`QA_User_Flows.md`](./QA_User_Flows.md) · CasePlayer / QuizModal patterns in [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md)

Wired as queue **`market_learning_order`** in [`AGENTS_LOOP-Continue-Milestone.md`](./AGENTS_LOOP-Continue-Milestone.md) (after `market_types_order` / E9).

---

## Product intent

| Learner need | How E10 delivers |
|--------------|------------------|
| Jump to a market type easily | **Market Navigator** (charts · literacy · decide) |
| Learn to read headlines | Training **`news-literacy`** quiz |
| More statement practice | **`financial-drills`** (SAMPLE snapshots) |
| Learn by deciding (mock data) | Per-class SAMPLE cases → CasePlayer BUY/SELL/HOLD |
| Traditional stocks vs other markets | Equities spine unchanged; Explorer path optional |

**Always:** SAMPLE/STYLIZED mock data · chart soft-gate before graded cases · no LIVE · no brokerage · options = context only.

---

## How to run

```text
/loop market learning coverage using AGENTS_LOOP-Market-Learning-Coverage.md
```

Or global continue (queue 5):

```text
/loop continue milestones using AGENTS_LOOP-Continue-Milestone.md
```

**Before starting**
1. E9 / `market_types_order` complete; `next_action` at `E10.M1.S1` (or first unfinished E10 story).
2. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build`.
3. Stop yourself anytime; hard-stop on 10-round error budget or Done(coverage).

---

## Queue (strict order)

From `.agents/state.json` → `milestones.market_learning_order`:

1. `E10.M1` Market Navigator hub  
2. `E10.M2` News literacy quiz  
3. `E10.M3` Financial statements drill pack  
4. `E10.M4` Case `assetClass` + Cases filter  
5. `E10.M5` Futures SAMPLE cases  
6. `E10.M6` Forex SAMPLE cases  
7. `E10.M7` Crypto + options-context SAMPLE cases  
8. `E10.M8` Market Explorer GoalPicker path  
9. `E10.M9` Dashboard CTAs + QA flows  

---

## Loop prompt

```markdown
# OBJECTIVE
Ship `market_learning_order` (epic E10) until every E10.M* milestone is done.

**Done (coverage):** All ids in `milestones.market_learning_order` complete per `IMPLEMENTATION_STORIES.md`.

**Done (per tick):** Exactly one E10 story to acceptance-pass, or one error-recovery round.

# CONTEXT
- State: `.agents/state.json` (epic E10 while this queue runs)
- Stories: `IMPLEMENTATION_STORIES.md` → Market learning coverage — E10
- Reuse: CasePlayer, QuizModal, FinancialSnapshotCard, ProgressStore unlock patterns, Market class filter
- Auto-verify: `npm run lint` && `npm run build`
- Skills: create/adapt under `.agents/skills/*` when “add case pack by assetClass” or “add quiz group” repeats

# STEP-BY-STEP CADENCE
1. **Orient** — next unfinished `E10.Mx.Sy`; do not skip ahead in `market_learning_order`.
2. **Implement story only**
   - Navigator: deep-links `class` / `market` query params; VIEW_CHARTS / READ_LITERACY / DECIDE_CASES.
   - Quizzes: register groups in `quizData.ts` + Training list; SAMPLE copy.
   - Cases: `assetClass` on CaseStudy; seed packs with distinct OHLC; process debriefs; respect chart gate.
   - Path: new template + ProgressStore order; Equities paths must keep working.
3. **Verify** — lint + build; smoke Navigator → one case for the market just added.
4. **On PASS** — update state + stories status; continue next story / milestone.
5. **On FAIL** — ≤10 fix rounds → Error Handoff Summary.
6. **Done(coverage)** — set `MARKET_LEARNING_ORDER_COMPLETE` / Done(global) if no further queues; STOP (no wake).

# VERIFICATION RUBRIC
- [ ] Story Acceptance met
- [ ] lint + build exit 0
- [ ] Beginner Equities + Decision Maker paths not broken
- [ ] No LIVE/REAL_TIME; SAMPLE labels honest
- [ ] Chart gate still blocks graded cases
- [ ] `next_action` accurate

# STOP CONDITIONS
- Done(coverage) / Done(global)
- Error budget 10
- Human verification (ambiguous UX not in docs; paid APIs)
- Abort risky unrelated dependency upgrades

# TICK OUTPUT
1. `E10.Mx.Sy` (+ market_learning queue)
2. PASS | FIXING (n/10) | STOP
3. Commands + exit status
4. `next_action`
5. Skills paths, if any
```

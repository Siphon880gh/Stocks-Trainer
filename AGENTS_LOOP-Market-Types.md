# AGENTS_LOOP — Market Types (E9)

Reusable loop prompt for expanding Stock Trainer beyond **Equities (stocks)**—the traditional retail market—into SAMPLE **futures**, **options-context**, **crypto**, and **forex**.

Companions: [`.agents/state.json`](./.agents/state.json) · [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) · [`EPIC_MAP.md`](./EPIC_MAP.md) · [`README.md`](./README.md) · [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md) · skill [`.agents/skills/add-equity-sample-pack/SKILL.md`](./.agents/skills/add-equity-sample-pack/SKILL.md) (adapt for other classes)

Also wired as queue **`market_types_order`** in [`AGENTS_LOOP-Continue-Milestone.md`](./AGENTS_LOOP-Continue-Milestone.md) (runs after `later_order`).

---

## Retail naming (do not drift)

| Learner language | App market type |
|------------------|-----------------|
| Traditional market / stocks / shares / stock market | **Equities** |
| Futures | **Futures** (`future`) |
| Options (education only) | **Options context** (`option_context`) — not a LIVE chain / Greeks product |
| Crypto | **Crypto** |
| FX / currencies | **Forex** (`forex`) |

Paths and graded cases stay **equities-first**. E9 fills Market class slots with SAMPLE packs + thin literacy.

---

## How to run

**Preferred (dynamic loop):**

```text
/loop market types using AGENTS_LOOP-Market-Types.md
```

Or via the global continue loop (queue 4 after later):

```text
/loop continue milestones using AGENTS_LOOP-Continue-Milestone.md
```

**Before starting**
1. `.agents/state.json` → `milestones.market_types_order`; `next_action` should point at `E9.M1.S1` (or the first unfinished E9 story).
2. Is your current server working? Leave `npm run dev` alone if up; verify with `npm run lint` + `npm run build`.
3. Stop the loop yourself when desired. Hard-stop on 10-round error budget or Done(market_types).

**On each tick**
- Read this file + state + current E9 milestone in `IMPLEMENTATION_STORIES.md`
- Implement **one** story; lint+build; update state; continue
- Prefer extending `samplePacks.ts` / `markets.ts` / Market filter labels; reuse chart stack

---

## Queue (strict order)

From `.agents/state.json` → `milestones.market_types_order`:

1. `E9.M1` Futures SAMPLE packs  
2. `E9.M2` Options-context SAMPLE packs  
3. `E9.M3` Crypto SAMPLE deepen  
4. `E9.M4` Forex class + SAMPLE packs  
5. `E9.M5` Cross-market literacy bridge  

---

## Loop prompt

```markdown
# OBJECTIVE
Ship Stock Trainer **market_types_order** (epic E9) until every E9.M* milestone is done.

**Done (market_types):** All ids in `milestones.market_types_order` complete with story acceptance in `IMPLEMENTATION_STORIES.md`.

**Done (per tick):** Exactly one E9 story advanced to acceptance-pass, or one error-recovery round with a clear next action.

# CONTEXT
- State: `.agents/state.json` (`current_epic_id` should be E9 while this queue runs)
- Stories: `IMPLEMENTATION_STORIES.md` → Market types — E9 section
- Product map: `EPIC_MAP.md` (E9); learner naming in `README.md` § markets
- Auto-verify: `npm run lint` then `npm run build`
- Skills: adapt `.agents/skills/add-equity-sample-pack` for futures/options/forex packs; create new skills if the workflow diverges
- Constraints: SAMPLE/STYLIZED only; no LIVE/REAL_TIME theater; no paid API keys; options = educational context only (no Greeks/pricing engine); do not replace Beginner Equities Path with crypto/FX

# STEP-BY-STEP CADENCE
1. **Orient**
   - Read `.agents/state.json` and the next unfinished story under the current `E9.M*` in `IMPLEMENTATION_STORIES.md`.
   - Active queue is only `market_types_order` (this loop). Do not reopen P0/post-P0/later unless a regression forces a minimal fix.

2. **Implement current story only**
   - Minimal registry/UI changes: `AssetClass`, `SAMPLE_PACKS_BY_CLASS`, Market `CLASS_LABELS` / filter, `MARKETS` adapter.
   - Distinct OHLC shapes (not scaled clones). Label SAMPLE/educationalNotes clearly.
   - For E9.M5: thin Archive literacy or small quiz group + Dashboard/Market helper that **Equities = traditional retail stocks**.

3. **Automatic verification**
   - `npm run lint` && `npm run build`
   - Mentally check: Equity path/cases still work; empty classes still show empty state; no LIVE claims.

4. **On PASS**
   - Update `.agents/state.json`: `milestone_story_status`, `completed`, `current_milestone_id`, `next_action`, `last_updated_iso`, epic status.
   - Flip Status in `IMPLEMENTATION_STORIES.md` build-order table when a milestone completes.
   - Continue to the next story / next `E9.M*` in `market_types_order`.
   - When queue finishes: set status reflecting market_types Done; `next_action` STOP or Done(global) if no further queues exist.

5. **On FAIL**
   - Error-fix mode; max **10** fix rounds → Error Handoff Summary (same shape as Continue-Milestone).

6. **Skills**
   - If “add SAMPLE pack for class X” repeats, create `.agents/skills/add-<class>-sample-pack/SKILL.md` or generalize the equity pack skill carefully.

# VERIFICATION RUBRIC
PASS only if:
- [ ] Story Acceptance met
- [ ] lint + build exit 0
- [ ] No LIVE/REAL_TIME theater; SAMPLE labels honest
- [ ] Equities Beginner / Decision Maker paths not broken
- [ ] `next_action` points at the real next E9 story (or STOP when queue done)

# STOP CONDITIONS
- **Done(market_types):** All `market_types_order` ids complete → STOP with one-line tally.
- **Error budget:** 10 fix rounds → handoff.
- **Human verification:** Ambiguous product choice; paid API; conflicting docs.
- **Abort:** Risky unrelated dependency upgrades.

# TICK OUTPUT (keep short)
1. `E9.Mx.Sy` (+ market_types queue)
2. PASS | FIXING (n/10) | STOP
3. Commands + exit status
4. `next_action`
5. Skills created/updated (paths only), if any
```

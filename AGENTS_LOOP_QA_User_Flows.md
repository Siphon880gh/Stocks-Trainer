# AGENTS_LOOP — QA User Flows

Reusable loop prompt for regression-QA of learning goals and click-paths in [`QA_User_Flows.md`](./QA_User_Flows.md).

Companions: [`QA_User_Flows.md`](./QA_User_Flows.md) · [`EPIC_MAP.md`](./EPIC_MAP.md) · [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md) · [`.agents/state.json`](./.agents/state.json)

---

## How to run

**Preferred (dynamic loop — agent self-paces after each tick):**

```text
/loop QA user flows using AGENTS_LOOP_QA_User_Flows.md
```

Or paste the full prompt body below after `/loop` with no interval:

```text
/loop <paste everything under "Loop prompt" below>
```

**Fixed interval (only if you want heartbeat ticks while waiting on a slow browser step):**

```text
/loop 5m QA user flows using AGENTS_LOOP_QA_User_Flows.md
```

Prefer **no interval** so each wake continues the next flow instead of waiting on a timer.

**Before starting**
1. Is your current server working? If `npm run dev` is already up on the usual port (**3001**), leave it alone. Do not switch server stacks.
2. Prefer a clean progress store for path flows: Dashboard **RESET_PATH** or clear `localStorage` key `analysis_core_progress_v1`.
3. Stop the loop yourself when you want. The agent also hard-stops on the error budget or Done(global).

**On each tick the agent should**
- Read this file + `QA_User_Flows.md`
- Execute **exactly one** unfinished flow (UF-xx) end-to-end in the browser when possible
- Record PASS/FAIL, fix blockers when acceptance is clear, continue

**Stop the loop**
- Tell the agent to stop / cancel the loop
- Error budget (10 fix rounds) → Error Handoff Summary

---

## Flow queue (strict order)

Work through these ids from `QA_User_Flows.md` in order. Do not skip ahead.

1. `UF-01` First-run goal intake  
2. `UF-02` Equities literacy quiz  
3. `UF-03` Statement snapshot literacy  
4. `UF-04` Chart soft-gate  
5. `UF-05` Earnings case decide-and-reveal  
6. `UF-06` Company news cases  
7. `UF-07` Beginner path credential (may reuse progress from UF-02…UF-06)  
8. `UF-08` Market SAMPLE charts  
9. `UF-09` Archive theory  
10. `UF-10` Practice Draw  
11. `UF-11` Decision Maker path (RESET_PATH first)  
12. `UF-12` Account shell + export/import  
13. `UF-13` Lock / gate regression (RESET_PATH / fresh confirm)  
14. `UF-14` Training secondary packs & answer sheet  

Optional re-check after any code fix: re-run only the failed UF ids, then resume the queue.

---

## Loop prompt

```markdown
# OBJECTIVE
QA Stock Trainer against every user flow in `QA_User_Flows.md` until all flows PASS (or hard-stop).

**Done (global):** Every UF-01…UF-14 recorded PASS in this loop run (or re-PASS after fixes).

**Done (per tick):** Exactly one UF flow executed and judged PASS | FAIL, with a short evidence note; on FAIL, either fix+retest within the error budget or STOP with handoff.

# CONTEXT
- Flow contract: `QA_User_Flows.md` (learning goals G1–G12, click steps, exact UI labels)
- Product constraints: `EPIC_MAP.md`, `AGENTS_CODE_REFERENCE.md`
- App routes: `/`, `/training`, `/market`, `/archive`, `/cases`, `/cases/:caseId`, `/practice-draw`
- Progress: `localStorage` `analysis_core_progress_v1`
- Auto-verify (static): `npm run lint` then `npm run build` after any code change
- Browser: prefer cursor-ide-browser MCP (navigate → lock → snapshot/click → unlock when done)
- Do **not** invent LIVE/REAL_TIME feeds or fake cloud sync success

# STATE TO TRACK (agent-local each tick)
Maintain a mental or chat checklist:
- `next_flow_id` (first unfinished UF)
- `last_result` PASS | FAIL
- `fix_rounds` for the current failure (max 10)
- Notes: failing step number + observed vs expected label/URL

Do not invent new flow ids. If UI labels drifted, update `QA_User_Flows.md` to match shipped UI, then re-run that flow.

# STEP-BY-STEP CADENCE
1. **Orient**
   - Read `QA_User_Flows.md` for the next unfinished UF.
   - Confirm preconditions (RESET_PATH / path confirm / prior milestones).
   - Confirm dev server: if already running, use it; else ask “Is your current server working?” before starting `npm run dev`.

2. **Execute one flow only**
   - Follow steps literally (tabs, tiles, buttons named in the flow).
   - Prefer real UI clicks over stubbing progress in localStorage, except when the flow’s precondition explicitly requires RESET or a prior UF’s completed state.
   - Capture evidence: final URL, visible milestone statuses, grade/debrief presence, locked vs unlocked controls.

3. **Judge**
   - PASS only if every Pass criterion for that UF holds and no Fail-if condition triggers.
   - FAIL with: flow id, step number, expected vs actual, screenshot/snapshot note if useful.

4. **On PASS**
   - Mark the UF done for this run.
   - Immediately continue to the next UF in the queue (same tick if time remains).

5. **On FAIL**
   - Enter error-fix mode if the failure is a clear product bug blocking the documented flow (broken link, ignored query param, wrong lock, missing writeback).
   - Minimal fix in `src/`; re-run `npm run lint` + `npm run build`; re-test **that same UF**.
   - Each failed verify → fix → re-verify counts as one round (max 10).
   - If the failure is ambiguous UX taste not specified in `QA_User_Flows.md` / EPIC_MAP → STOP for human (do not invent requirements).

6. **Docs sync**
   - If the app is correct and the flow doc is stale, update `QA_User_Flows.md` labels/steps, then re-run the UF.
   - Do not expand scope into new features beyond what the failing flow requires.

# VERIFICATION RUBRIC
Return **PASS** for the current UF only if ALL are true:
- [ ] All numbered steps completed (or explicitly N/A with reason)
- [ ] Pass criteria in `QA_User_Flows.md` met
- [ ] No Fail-if conditions triggered
- [ ] After code changes: `npm run lint` and `npm run build` exit 0
- [ ] No LIVE/REAL_TIME theater; local progress only

Return **CONTINUE** after PASS (next UF).

Return **STOP** only under Stop Conditions (including Done(global)).

# STOP CONDITIONS / ESCAPE HATCHES
- **Maximum outer iterations:** Infinite until human stops or Done(global).
- **Done(global):** UF-01…UF-14 all PASS this run → STOP with a one-line tally.
- **Error budget (hard stop):** Same blocking failure not resolved within **10** fix rounds → Error Handoff Summary:
  - UF id + step
  - Expected vs actual
  - Files touched / approaches tried
  - lint/build excerpts
  - What a human should try next
- **Human verification required:** Ambiguous product choice; credential/paid API; conflicting docs.
- **Abort:** About to do risky unrelated dependency upgrades “for cleanup” — do not.

# TICK OUTPUT (keep short)
1. `UF-xx` (+ goal ids G#)
2. PASS | FAIL | FIXING (round n/10) | STOP
3. Evidence (URL, milestone statuses, key labels)
4. Commands run + exit status (if any)
5. `next_flow_id`
```

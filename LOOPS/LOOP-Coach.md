# LOOP — Coach (exhaustive decision trees)

```text
COMMIT_MODE: none            # none (default) | local (one local commit per PASSed unit; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3             # consecutive failed attempts on the same unit before STOP (same rule as the project loops)
ERROR_ROUNDS_PER_ATTEMPT: 3  # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-coach --emptyOutDir && rm -rf /tmp/st-build-check-coach
VERIFY: npm run test:coaching && npm run lint && npm run test:content && BUILD_CHECK
CHECKPOINT_MODE: continue    # no visual checkpoints here; a human-judgment STOP still stops
```

Deepen deterministic step-coaching on `/coach` and `/coach/:slug`. Runtime (validate, navigate, persist, path trail) already exists. **No runtime LLM.**

Companions: [`src/lib/coaching/`](../src/lib/coaching/) · [`src/lib/coaching/sessions/`](../src/lib/coaching/sessions/) · [`src/pages/Coach.tsx`](../src/pages/Coach.tsx) · [`src/lib/marketNavigator.ts`](../src/lib/marketNavigator.ts) (`CLASS_SESSION_TAGS`) · [`.agents/skills/add-coaching-session/SKILL.md`](../.agents/skills/add-coaching-session/SKILL.md)

---

## How to run

```text
/loop exhaustive Coach content using LOOPS/LOOP-Coach.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with the VERIFY line in the config block (temp build dir, never `dist/`).
2. Stop yourself anytime; hard-stop after ATTEMPT_LIMIT (3) consecutive failed attempts on one unit or Done(coach).

**On each tick**
- Re-inventory `listSessions()` / `COACHING_SESSION_MODULES`.
- Add **exactly one** new session file (or one extra wrong-branch only if the current session is below the branch floor — prefer a whole new session).
- Wire export; run coaching tests; continue.

---

## Product intent

| Learner need | How this loop delivers |
|--------------|------------------------|
| Fail safely | ≥2 `wrong` nodes with `rewind_to` + ≥1 `success` |
| Topic coverage | Sessions for literacy, statements, charts, cases, multi-market |
| Class filter on `/coach?class=` | Tags that match `CLASS_SESSION_TAGS` |

**Always:** predefined graphs only · SAMPLE copy · durable choice labels (buttons **and** path trail) · do not replace CasePlayer/QuizModal.

---

## Coverage queue (strict order)

Existing modules (2026-10-21: 70 registered in `src/lib/coaching/sessions/index.ts`, all listed by `listSessions()`; re-list before adding, never duplicate a slug):

- Equity decisions: `chase-vs-fade`, `statement-snapshot`, `chart-soft-gate`, `earnings-beat-miss`, `earnings-margins`, `earnings-guidance`, `earnings-debt`, `macro-risk-off`, `macro-print`, `supply-shock`, `combined-decisions`, `short-vs-sell`, `equities-literacy`, `news-literacy`
- Project sessions (built by their project loops, registered here): `earnings-week` (`src/lib/financials/coachEarningsWeek.ts`), `cpi-morning` (`src/lib/macro/coachCpiMorning.ts`)
- Chart skills, tagged `all-markets`: `trade-plan-before-entry`, `trailing-stop-exit`, `supply-demand-zone-retest`, `candle-needs-context`, `rsi-vs-trend`
- Per class (Asymmetry loop): `futures-*` (12), `forex-*` (12), `crypto-*` (12), `options-*` (12), e.g. `futures-framing`, `forex-literacy`, `crypto-weekend-gap`, `options-vol-spike`

### Phase A — one session per remaining thinking-mode family

Skip a row if a session already teaches that family (tags or topic). Otherwise add:

| Step | Topic (catalog `meta.topic`) | Tags must include | Skill to teach |
|------|------------------------------|-------------------|----------------|
| 1 | Earnings decisions | `equities`, `earnings`, `beginner` | beat vs miss; profitable-but-miss |
| 2 | Earnings decisions | `equities`, `margins` | shrinking margins vs revenue growth |
| 3 | Financial statements | `equities`, `cash` | profit without cash |
| 4 | Earnings decisions | `equities`, `guidance` | outlook cut |
| 5 | Financial statements | `equities`, `debt` | balance-sheet stress |
| 6 | Company news decisions | *(chase-vs-fade exists — skip unless you add a second distinct headline tree)* | — |
| 7 | Market-wide news | `equities`, `macro`, `risk-off` | stock vs tape |
| 8 | Market-wide news | `equities`, `macro-print` | data print → rates/growth |
| 9 | Market-wide news | `equities`, `supply` | producer vs buyer |
| 10 | Combined decisions | `equities`, `combined` | filing vs headline; horizon mismatch |

### Phase B — one session per non-equity class (equity already has several)

| Step | Class needle (required tag) | Topic |
|------|-----------------------------|-------|
| 11 | `forex` | Multi-market decisions — SAMPLE FX framing |
| 12 | `crypto` | Multi-market decisions — chase/fade on SAMPLE crypto |
| 13 | `options` or `options-context` | Options context — event/vol, no chain |
| 14 | `futures` | *(futures-framing exists — add a second tree only if it is a new skill, e.g. roll literacy)* |

### Phase C — Learn-topic coaching (graphs, not quizzes)

| Step | Topic | Tags |
|------|-------|------|
| 15 | Equities vocabulary | `equities`, `literacy` |
| 16 | Chart fluency | *(chart-soft-gate exists — add RSI-vs-trend misuse or SMA-as-magic only if distinct)* |
| 17 | News literacy | `equities`, `news-literacy` |

### Phase D — chart-skill coaching (shipped 2026-10-21)

These read the same on any SAMPLE chart, so they carry the `all-markets` tag (`ALL_MARKETS_COACH_TAG` in `marketNavigator.ts`): `/coach?class=<any>` lists them and they count once per class toward the Asymmetry Coach targets.

| Step | Topic | Tags | Skill | Slug |
|------|-------|------|-------|------|
| 18 | Trade management | `all-markets`, `trade-management` | plan entry, invalidation and target before clicking | `trade-plan-before-entry` |
| 19 | Trade management | `all-markets`, `trade-management` | trail the stop under structure; planned exit vs hope | `trailing-stop-exit` |
| 20 | Chart skills | `all-markets`, `supply-demand` | fresh vs already-tested zone | `supply-demand-zone-retest` |
| 21 | Chart skills | `all-markets`, `candles` | one candle needs trend + level + confirmation | `candle-needs-context` |
| 22 | Chart fluency | `all-markets`, `indicators` | oversold RSI in a downtrend is not a buy | `rsi-vs-trend` |

Next distinct skills, if a tick is asked for more (each needs its own decision tree, not a re-skin): SMA-as-magic-line, position sizing from the stop distance, gap-and-go vs gap-fade. Do **not** tag a class-specific tree `all-markets`.

**Each new session minimum:** `start` + ≥2 continue layers · ≥2 `wrong` with valid `rewind_to` · ≥1 `success` · choice labels that read as sentences on the trail.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Coach exhaustive: Phases A–D session gaps filled with valid decision graphs.

**Done (coach):** Every Phase A–D row either skipped (already covered) or shipped (2026-10-21: Done; the topic rows are test-enforced in `contentGraph.test.ts` → "Coach").

**Done (per tick):** Exactly one new `CoachingSession` module wired, or one error-recovery round.

# CONTEXT
- New file: `src/lib/coaching/sessions/<slug>.ts` exporting named + default session
- Register: `COACHING_SESSION_MODULES` in `src/lib/coaching/sessions/index.ts`
- Validate: invalid graphs are dropped from `listSessions()` — tests must still pass
- Class filter: tags lowercase-match `CLASS_SESSION_TAGS` in `marketNavigator.ts`
- Skill: `add-coaching-session`
- Auto-verify: VERIFY (`npm run test:coaching` && `npm run lint` && `npm run test:content` && BUILD_CHECK)

# STEP-BY-STEP CADENCE
1. **Orient** — list slugs/topics/tags; pick first Coverage row with no covering session.
2. **Author one session** (follow add-coaching-session skill)
   - `meta.slug` kebab-case unique; `title`; `summary`; `topic`; `tags[]`.
   - SAMPLE setup in messages; no LIVE; no “AI will decide.”
   - wrong nodes: empty `choices`, `rewind_to` an earlier **continue** node.
   - success nodes: empty `choices`.
3. **Wire** + VERIFY (`npm run test:coaching` && lint && `test:content` && BUILD_CHECK).
4. **On FAIL** — ≤3 fix rounds per attempt (validation issues are the usual cause); STOP after 3 failed attempts on the same unit.
5. **Skills** — update add-coaching-session if rewind/catalog mistakes repeat.

# VERIFICATION RUBRIC
- [ ] One session; unique slug; in `COACHING_SESSION_MODULES`
- [ ] validate ok; ≥2 wrong + rewind; ≥1 success
- [ ] Tags hit the intended class filter
- [ ] test:coaching + lint + test:content + BUILD_CHECK 0
- [ ] No LLM / randomness

# STOP CONDITIONS
- Done(coach) → STOP with slug list.
- 3 consecutive failed attempts on one unit → handoff.
- Human verification: whether two sessions may share `topic` (yes — filter still works).
- Abort: adding an LLM coach; mutating nav engine “for cleanup.”

# TICK OUTPUT
1. slug + topic + tags
2. PASS | FIXING (attempt a/3 · round r/3) | STOP
3. Next Coverage row
4. test:coaching / lint / test:content / build-check status
```

---

## Authoring notes

- `/coach?class=forex` hides sessions that lack forex/fx tags — tag deliberately.
- `/coach?class=<x>` also lists every `all-markets` session; use that tag only for chart-skill trees whose copy names no instrument class.
- Do not point Dashboard CTAs or Home tips at a slug or title that is not in the catalog. `test:content` checks every `Coach → <title>` in the Home tips against real session titles.
- Register each module in `sessions/index.ts`; a module that fails `validate` is silently dropped from `listSessions()`, and the test catches that by comparing counts.
- Keep graphs finite (roughly ≤16 nodes). Depth beats sprawl.

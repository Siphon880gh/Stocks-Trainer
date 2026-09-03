# LOOP — Coach (exhaustive decision trees)

Deepen deterministic step-coaching on `/coach` and `/coach/:slug`. Runtime (validate, navigate, persist, path trail) already exists. **No runtime LLM.**

Companions: [`src/lib/coaching/`](../src/lib/coaching/) · [`src/lib/coaching/sessions/`](../src/lib/coaching/sessions/) · [`src/pages/Coach.tsx`](../src/pages/Coach.tsx) · [`src/lib/marketNavigator.ts`](../src/lib/marketNavigator.ts) (`CLASS_SESSION_TAGS`) · [`.agents/skills/add-coaching-session/SKILL.md`](../.agents/skills/add-coaching-session/SKILL.md)

---

## How to run

```text
/loop exhaustive Coach content using LOOPS/LOOP-Coach.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build` + `npm run test:coaching`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(coach).

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

Existing modules (do not duplicate slugs): `chase-vs-fade`, `statement-snapshot`, `chart-soft-gate`, `futures-framing`.

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

**Each new session minimum:** `start` + ≥2 continue layers · ≥2 `wrong` with valid `rewind_to` · ≥1 `success` · choice labels that read as sentences on the trail.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Coach exhaustive: Phases A–C session gaps filled with valid decision graphs.

**Done (coach):** Every Phase A–C row either skipped (already covered) or shipped.

**Done (per tick):** Exactly one new `CoachingSession` module wired, or one error-recovery round.

# CONTEXT
- New file: `src/lib/coaching/sessions/<slug>.ts` exporting named + default session
- Register: `COACHING_SESSION_MODULES` in `src/lib/coaching/sessions/index.ts`
- Validate: invalid graphs are dropped from `listSessions()` — tests must still pass
- Class filter: tags lowercase-match `CLASS_SESSION_TAGS` in `marketNavigator.ts`
- Skill: `add-coaching-session`
- Auto-verify: `npm run test:coaching` && `npm run lint` && `npm run build`

# STEP-BY-STEP CADENCE
1. **Orient** — list slugs/topics/tags; pick first Coverage row with no covering session.
2. **Author one session** (follow add-coaching-session skill)
   - `meta.slug` kebab-case unique; `title`; `summary`; `topic`; `tags[]`.
   - SAMPLE setup in messages; no LIVE; no “AI will decide.”
   - wrong nodes: empty `choices`, `rewind_to` an earlier **continue** node.
   - success nodes: empty `choices`.
3. **Wire** + `npm run test:coaching` && lint && build.
4. **On FAIL** — ≤10 rounds (validation issues are the usual cause).
5. **Skills** — update add-coaching-session if rewind/catalog mistakes repeat.

# VERIFICATION RUBRIC
- [ ] One session; unique slug; in `COACHING_SESSION_MODULES`
- [ ] validate ok; ≥2 wrong + rewind; ≥1 success
- [ ] Tags hit the intended class filter
- [ ] test:coaching + lint + build 0
- [ ] No LLM / randomness

# STOP CONDITIONS
- Done(coach) → STOP with slug list.
- Error budget 10 → handoff.
- Human verification: whether two sessions may share `topic` (yes — filter still works).
- Abort: adding an LLM coach; mutating nav engine “for cleanup.”

# TICK OUTPUT
1. slug + topic + tags
2. PASS | FIXING (n/10) | STOP
3. Next Coverage row
4. test/lint/build status
```

---

## Authoring notes

- `/coach?class=forex` hides sessions that lack forex/fx tags — tag deliberately.
- Do not point Dashboard CTAs at a slug that is not in the catalog.
- Keep graphs finite (roughly ≤16 nodes). Depth beats sprawl.

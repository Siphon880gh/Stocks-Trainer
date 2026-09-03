# LOOP — Learn / Training (exhaustive content)

Deepen quizzes on `/training` (Learn). Path writeback, chart soft-gate, and QuizModal runtime already exist.

Companions: [`src/lib/quizData.ts`](../src/lib/quizData.ts) · [`src/pages/Training.tsx`](../src/pages/Training.tsx) · [`src/components/QuizModal.tsx`](../src/components/QuizModal.tsx) · [`src/lib/ohlcData.ts`](../src/lib/ohlcData.ts) (`PATTERN_OHLC`) · [`src/lib/beginnerPath.ts`](../src/lib/beginnerPath.ts) · [`src/lib/progressStore.ts`](../src/lib/progressStore.ts)

---

## How to run

```text
/loop exhaustive Learn content using LOOPS/LOOP-Learn.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(learn).

**On each tick**
- Re-count questions per `QuizGroupId`.
- Add **exactly one** new `QuizQuestion` (or one new group **plus** its first question if you are in the new-groups phase).
- Wire types/arrays; lint + build; continue.

---

## Product intent

| Learner need | How this loop delivers |
|--------------|------------------------|
| Path literacy | Deeper banks for Equities / Statements / Indicators / News / Drills / Candle anatomy |
| Pattern drills | Chart-pick → identify → trade-move coverage per family |
| Multi-market literacy | New groups only after path banks meet floors — still SAMPLE |

**Always:** SAMPLE teaching copy · `glossaryTermId` / `snapshotId` / `overlayId` / `samplePackId` when they apply · do **not** change Beginner unlock order or `canStartQuizGroup` semantics.

---

## Coverage queue (strict order)

### Phase A — deepen existing path / gate groups

Floor **≥12** questions each (unique ids, not paraphrased clones):

1. `equity-literacy` (`EQUITY_LITERACY_QUESTIONS`) — ownership, exchange, long/short, horizon, investing vs trading, Equities = traditional retail stocks
2. `financial-literacy` (`FINANCIAL_LITERACY_QUESTIONS`) — revenue, profit vs cash, margin, leverage, P/E humility; use `snapshotId`
3. `indicators` (`INDICATOR_QUIZ_QUESTIONS`) — SMA, EMA, RSI, MACD, Bollinger; use `overlayId` (only overlays MarketChart already renders)
4. `candle-anatomy` (`CANDLE_ANATOMY_QUESTIONS`) — high/low/open/close, color rule, wick vs body; `glossaryTermId` `ohlc-anatomy` / `candle-color`
5. `news-literacy` (`NEWS_LITERACY_QUESTIONS`) — rumor vs filing, priced-in, chase vs fade, source humility
6. `financial-drills` (`FINANCIAL_DRILLS_QUESTIONS`) — extra snapshot practice; `snapshotId` (add cards in `financialSnapshots.ts` when the drill needs a new shape)

### Phase B — pattern family groups (from `QUIZ_QUESTIONS`)

For each family group, floor **≥6** questions with the existing sort contract (chart-pick first → identify/describe → `*-MOVE` last):

7. `hammer` · 8. `doji` · 9. `engulfing` · 10. `bullish-engulfing` · 11. `bearish-engulfing` · 12. `shooting-star` · 13. `inverted-hammer` · 14. `morning-star`

If a new Archive pattern ships (from the Archive loop), add `patternKey` + `PATTERN_OHLC` entry **before** family questions that show a chart.

### Phase C — equity pack drills

15. `equity-patterns` (`EQUITY_PATTERN_QUIZ_QUESTIONS`) floor **≥8**, each tagged `samplePackId` to a real equity SAMPLE pack.

### Phase D — new groups (only after A–C floors)

Add `QuizGroupId` + `QUIZ_GROUPS` entry + dedicated questions array + `getQuestionsForGroup` / `questionsArrayForGroup` branches. Do **not** put these groups on the Beginner spine (`trainingGroup` in `beginnerPath.ts` stays unchanged). Suggested order:

16. `futures-literacy` — contract vs stock, SAMPLE tape, not LIVE
17. `forex-literacy` — pair quote, risk-on/off, not a live FX desk
18. `crypto-literacy` — browse/drill only; does not replace Equities path
19. `options-literacy` — underlying / event / vol context; no Greeks/chain

New groups that should write Dashboard tips (like news-literacy) must extend `progressStore` writeback **only** if an existing pattern already exists for that group; otherwise leave them as extra Learn drills without new progress flags.

**Inside a group:** next question = first missing skill in that group’s topic list, not a duplicate prompt.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Learn exhaustive: every Phase A–C group meets its floor; then add Phase D multi-market literacy groups.

**Done (learn):** Phases A–D complete (or A–C complete and Phase D skipped only if a human said to stop before new groups).

**Done (per tick):** Exactly one new question (or one new group + its first question), wired and verified.

# CONTEXT
- Banks + groups: `src/lib/quizData.ts`
- Chart series for pattern questions: `PATTERN_OHLC` in `src/lib/ohlcData.ts`
- UI lists `QUIZ_GROUPS` automatically (`Training.tsx`)
- Path lock: `canStartQuizGroup` — groups **without** a Beginner `trainingGroup` stay free; do not accidentally assign a new group to a locked milestone
- Progress extras: `news-literacy` / `financial-drills` writeback in `progressStore.ts` — do not break those flags
- Auto-verify: `npm run lint` && `npm run build`

# STEP-BY-STEP CADENCE
1. **Orient** — count `getQuestionsForGroup(id).length` (or array length for dedicated banks). Pick the first group below its floor.
2. **Author one QuizQuestion**
   - Unique `id` (keep prefixes: `EL-` `FL-` `IN-` `CA-` `NL-` `FD-` `EQ-PAT-` `PR-` or a new prefix for Phase D).
   - 3–5 options A–E; one `correctAnswer`; explanation teaches process.
   - SAMPLE copy; no LIVE claims; no ticker-as-advice.
   - Set `glossaryTermId` when Archive has a matching term; `snapshotId` for statement cards; `overlayId` only for real overlays; `patternKey` / `optionsAreCharts` / `chartKey` for pattern drills.
   - If chart-pick: ensure `PATTERN_OHLC[chartKey]` exists and is a distinct candle story.
3. **Wire** — push onto the correct exported array; if new group: union type + `QUIZ_GROUPS` + both switch functions.
4. **Verify** — lint + build; Training group picker shows it; `/training?group=<id>&start=1` would load the new last question.
5. **On FAIL** — ≤10 fix rounds.
6. **Skills** — if “add quiz question to group X” repeats, add `.agents/skills/add-quiz-question/SKILL.md`.

# VERIFICATION RUBRIC
- [ ] One question (or one new group + first question)
- [ ] Closes the next Coverage-queue gap
- [ ] Unique id; correct bank/group wiring
- [ ] Beginner unlock order unchanged
- [ ] SAMPLE honest; lint + build 0

# STOP CONDITIONS
- Done(learn) → STOP with per-group counts.
- Error budget 10 → handoff.
- Human verification: whether a new group should write progress flags (default: no).
- Abort: rewriting QuizModal; changing POINTS_PER_CORRECT; path milestone rewiring.

# TICK OUTPUT
1. Group id + new question id
2. PASS | FIXING (n/10) | STOP
3. Next gap
4. lint/build status
```

---

## Authoring notes

- Family drills must keep `patternKey` in `patternKeysForGroup` (engulfing group includes bullish/bearish keys).
- `*-MOVE` ids sort last via `familyDrillOrder`.
- Do not add overlay quiz items for indicators the chart cannot draw.
- Wrong answers should be plausible learner mistakes, not jokes.

# LOOP — Graph (which section loop next)

```text
COMMIT_MODE: none            # none (default) | local (one local commit per PASSed unit; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3             # consecutive failed attempts on the same unit before STOP (same rule as the project loops)
ERROR_ROUNDS_PER_ATTEMPT: 3  # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-graph --emptyOutDir && rm -rf /tmp/st-build-check-graph
VERIFY: the chosen section loop's VERIFY line (always includes npm run lint && npm run test:content && BUILD_CHECK)
CHECKPOINT_MODE: continue    # no visual checkpoints here; a human-judgment STOP still stops
```

Orchestrator for the seven section content loops. One `/loop` session; this file **picks** which section loop to execute each tick. Authoring rules always come from the chosen section file — this file does not invent cases, questions, or packs.

Every section floor below is also an automatic check: [`src/lib/contentGraph.test.ts`](../../../src/lib/contentGraph.test.ts) (`npm run test:content`) asserts the Archive / Charts / Learn / Practice / Cases / Coach / Home floors, reference integrity (glossary, snapshot, overlay, pack and chart ids), the Buy-or-Sell coverage rule, the Asymmetry parity targets, and this config block in every loop prompt. A red `test:content` is the first gap to fix; a floor raised in a section file is raised in that test in the same tick, never lowered.

Charter: [`CHARTER.md`](./CHARTER.md) · Last gap audit + resume pointer: [`GAP-AUDIT.md`](./GAP-AUDIT.md) · Section loops (unchanged location): [`LOOPS/README.md`](../../../LOOPS/README.md)

Companions: [`LOOP-Archive.md`](../../../LOOPS/LOOP-Archive.md) · [`LOOP-Charts.md`](../../../LOOPS/LOOP-Charts.md) · [`LOOP-Learn.md`](../../../LOOPS/LOOP-Learn.md) · [`LOOP-Practice.md`](../../../LOOPS/LOOP-Practice.md) · [`LOOP-Cases.md`](../../../LOOPS/LOOP-Cases.md) · [`LOOP-Coach.md`](../../../LOOPS/LOOP-Coach.md) · [`LOOP-Home.md`](../../../LOOPS/LOOP-Home.md)

---

## How to run

```text
/loop content graph using docs/projects/content-graph/LOOP-Graph.md
```

Override policy in the same line if you do not want the default:

```text
/loop content graph using docs/projects/content-graph/LOOP-Graph.md policy=DRAIN
/loop content graph using docs/projects/content-graph/LOOP-Graph.md policy=ECHO
```

**Default policy: `FOUNDATION_THEN_ECHO`.** Drain the lookup + instrument layers first, then walk **resource families** across loops (one unit per loop hop), then drain leftovers.

**Before starting**
1. Leave working `npm run dev` alone; verify with the chosen section's VERIFY line (lint + `test:content` + BUILD_CHECK, plus that section's tests). Builds go to a temp `--outDir`, never `dist/`.
2. Stop yourself anytime; hard-stop on the error budget or Done(graph).
3. Do not also start a single-section `/loop` or [`LOOP-Asymmetry.md`](../../../LOOPS/LOOP-Asymmetry.md) in the same session. Graph is equities-first; class catch-up is a separate run.

---

## Policies

| Policy | When to use | Rule |
|--------|-------------|------|
| **`FOUNDATION_THEN_ECHO`** *(default)* | Normal exhaustive pass | Stage 0–1 drain Archive then Charts. Stage 2 echo families. Stage 3 drain any unfinished section floors. |
| **`DRAIN`** | Finish one surface before touching another | Stay on one section file until that file’s **Done(section)**. Then the next node in drain order. |
| **`ECHO`** | Keep related teaching in lockstep from tick 1 | No foundation drain. Each PASS follows the echo edge for the resource just shipped. If that hop is already Done for this family, take the next family. |

Do not mix policies mid-run unless the human names a new one.

---

## Nodes (section loops)

| Node | File | Unit per tick |
|------|------|----------------|
| Archive | `LOOPS/LOOP-Archive.md` | 1 term **or** 1 pattern **or** 1 overlay |
| Charts | `LOOPS/LOOP-Charts.md` | 1 SAMPLE pack |
| Learn | `LOOPS/LOOP-Learn.md` | 1 question (or 1 new group + first question) |
| Practice | `LOOPS/LOOP-Practice.md` | 1 draw template **or** 1 regime window **or** 1 tape **or** 1 lookalike / invalidation / levels round |
| Cases | `LOOPS/LOOP-Cases.md` | 1 case study |
| Coach | `LOOPS/LOOP-Coach.md` | 1 coaching session (equity tags, or `all-markets` for chart-skill trees) |
| Home | `LOOPS/LOOP-Home.md` | 1 copy cluster |

**Not nodes:** `/playbooks` (each Playbook needs a real outside source the human supplies; never invent one), the project surfaces (`/macro`, `/practice/statements`, `/practice/read-the-print`, `/practice/mark-the-band`, the future Academy) — those grow through their project loops in `docs/projects/*/`, and the graph only points echo hops at what they shipped.

---

## Drain order

Used by `DRAIN`, and by Stage 0–1 / Stage 3 of `FOUNDATION_THEN_ECHO`.

```text
Archive → Charts → Learn → Practice → Cases → Coach → Home
```

Why this order:

1. **Archive** — quizzes, flashcards, and Navigator literacy deep-link ids.
2. **Charts** — `samplePackId` on Learn equity drills; Market browse before decide.
3. **Learn** — path banks before more cases/coach that assume the vocabulary.
4. **Practice** — draw templates need Archive pattern ids; hunt tapes need scan hits.
5. **Cases** — decide-and-reveal after literacy + charts exist.
6. **Coach** — trees that walk the same skills as cases/quizzes.
7. **Home** — tips that **name** packs, groups, and slugs that already exist.

Never skip a node in `DRAIN` while it is short of its own Done(section).

---

## Echo families (similar resource hops)

A **family** is one teaching idea expressed on several surfaces. After a PASS, hop to the next **unfilled** hop in that family’s chain. Skip hops that are already filled or that the section loop forbids (e.g. Practice does not add literacy terms).

Walk families in this order (equities-first; `2b` and `2c` follow `2`):

| # | Family id | Typical chain (skip missing hops) |
|---|-----------|-------------------------------------|
| 1 | `pattern` | Archive pattern (+ `PATTERN_OHLC`, test-enforced; optional scan) → Learn family quiz → Learn `buy-or-sell` (directional patterns: `DRILL_CHART_SPECS` + drill `INFO` row, a `sc-<id>` scenario, or a `BS-W-<id>` Wait case; test-enforced) → Practice draw template → Practice lookalike round (pattern vs its confuser) → Practice hunt tape if scan hits |
| 2 | `anatomy` | Archive term (`ohlc-anatomy` / `candle-color`; one-candle reads `wick-rejection` / `full-body-candle` / `indecision-candle` / `strong-move-candle`; `prior-trend-context` / `pattern-confirmation`) → Learn `candle-anatomy` / `candle-reading` / `candle-pattern-book` → Coach `candle-needs-context` (shape → trend + level → confirmation → invalidation) |
| 2b | `price-action` | Archive process term (`market-structure`, `breakout-retest`, `risk-reward`, SMC terms, `supply-zone` / `demand-zone` …) → Learn `price-action` / `supply-demand` → `buy-or-sell` scenario chart (`scenarioCharts.ts`, reveal annotations; double / triple top & bottom, H&S, wedges, trendline, retests, zones) → Practice `/practice/levels` or `/practice/invalidation` round → Coach `supply-demand-zone-retest` (zones) |
| 2c | `trade-management` | Archive `entry-types` / `trailing-stop` / `taking-profit` / `risk-reward` / `no-trade-zone` → Learn `price-action` trade-management questions (guarded by `tradeManagement.test.ts`) → `buy-or-sell` `sc-pullback-entry` / trailing-stop chart → Practice `/practice/invalidation` / `/practice/plan` → Coach `trade-plan-before-entry` / `trailing-stop-exit` → Home tip |
| 3 | `vocab` | Archive ownership/markets/position/process term → Learn `equity-literacy` → Coach literacy session → Home tip |
| 4 | `statements` | Archive term (FCF, margin, P/E, …) → Learn `financial-literacy` / `financial-drills` / `earnings-jargon` (new snapshot if needed), or the project groups `statements-reading` / `cash-forecast-13wk` / `earnings-preview` / `earnings-reaction` ([financials-earnings](../financials-earnings/CHARTER.md); Practice `/practice/statements`, `/practice/read-the-print`, `/practice/mark-the-band`) → Cases `earnings` case in matching thinking mode (FE7.M2 case bridge is an open decision for Weng; do not link FE content into cases until it is decided) → Coach earnings / statements session (`earnings-week` exists) → Home thinking-mode or milestone tip |
| 5 | `indicators` | Archive overlay row only if chart renders it → Learn `indicators` question → Practice regime window with that overlay (regime follow-ups exist for `sma` / `rsi` / `bollinger` only; an `ema` / `macd` hop goes to a pack-tagged `equity-patterns` drill instead, which charts that pack's own tape) → Coach `rsi-vs-trend` / `chart-soft-gate` |
| 6 | `news` | Archive term (`rumor-vs-filing`, `priced-in`, `chase-vs-fade`) → Learn `news-literacy` → Cases `company-news` → Coach headline tree (skip if `chase-vs-fade` already covers) → Home tip |
| 7 | `macro` | Learn project groups `macro-releases` / `rates-curve` / `fed-policy` / `housing-mortgage` / `macro-reactions` ([macro-forces](../macro-forces/CHARTER.md); Macro Desk `/macro`, lesson `/macro/:lessonId`, game `/macro/play`) → Cases `macro-news` (risk-off / print / supply; print cases link their lesson) → Coach macro session (`cpi-morning`, `macro-print`, `macro-risk-off`, `supply-shock` exist) → Home tip (`MacroHomeTip` + the market-wide-news milestone tip exist) |
| 8 | `combined` | Cases `combined` → Coach combined session → Home tip |
| 9 | `equity-tape` | Charts equity pack (new shape) → Learn `equity-patterns` question with that `samplePackId` (every equity pack needs one; test-enforced; QuizModal charts the pack's own bars) → Cases earnings/news using a distinct (not cloned) tape |
| 10 | `futures` | Archive `futures-market` (exists → skip) → Charts `future` pack → Learn `futures-literacy` (Phase D) → Cases `futures` → Coach futures tree → Home nav copy |
| 11 | `forex` | Archive `forex-spot` → Charts `forex` pack → Learn `forex-literacy` → Cases `forex` → Coach forex session → Home |
| 12 | `crypto` | Archive `crypto-browse` → Charts `crypto` pack → Learn `crypto-literacy` → Cases `crypto` → Coach crypto session → Home |
| 13 | `options-context` | Archive `options-context` → Charts `option_context` pack → Learn `options-literacy` → Cases `options-context` → Coach options-context session → Home |
| 14 | `academy` | **Parked** until the Beginner Academy project ships BA10.M3 ([beginner-academy](../beginner-academy/CHARTER.md)). Then: Learn `orders-and-fills` / `paper-pnl` / `options-ladder` questions → Academy course-map units that **link** to (never copy) graph content |

**Echo edge rules**

- One hop = one tick = one unit in the **target** section file.
- Stay inside the family until the chain has no remaining hops **or** the target section’s next unit would violate that section’s own coverage queue (e.g. Cases still requires finishing `earnings` before `futures`). If the section queue blocks the hop, **do not skip the Cases pack order** — either take the blocked section’s legal next unit (same family if possible) or park that family and start the next family.
- Home hops only after the named surface exists (do not tip a slug/pack/group you did not ship).
- Learn Phase D groups (`futures-literacy`, …) only after Learn Phases A–C floors — if a multi-market family needs Phase D early, **park** that family until Learn A–C is Done, unless policy is pure `ECHO` (then follow Learn’s own queue when the hop is illegal).

---

## Stage machine (`FOUNDATION_THEN_ECHO`)

```text
Stage 0  DRAIN Archive until Done(archive)
Stage 1  DRAIN Charts until Done(charts)
Stage 2  ECHO families 1 → 13 (incl. 2b, 2c; 14 stays parked until BA10.M3) — one unit per tick, follow chain
Stage 3  DRAIN leftover section floors in drain order
         (Learn → Practice → Cases → Coach → Home)
Done(graph) when every section file’s Done(section) is true
```

Stage 2 may complete some section floors early. Stage 3 only fills gaps.

If Stage 2 wants Learn Phase D before A–C: stay in Stage 2 but execute Learn’s **legal** next question (A–C) tagged to the current family when possible; otherwise pause that family.

---

## Per-tick algorithm

1. **Read** this file + the seven section files’ coverage queues (do not trust stale counts). Run `npm run test:content` first: a red check is the gap, ahead of the policy pick.
2. **Policy** — default `FOUNDATION_THEN_ECHO`; honor `policy=` from the user line.
3. **Pick target**
   - `DRAIN`: first node in drain order that is not Done(section). Gap = that file’s next coverage item.
   - `ECHO`: current family + next unfilled hop; if none, next family; if none, drain leftovers.
   - `FOUNDATION_THEN_ECHO`: Stage 0–3 as above. Remember `stage`, `family_id`, and `last_unit` across ticks (chat state is enough; do not add a progress schema).
4. **Execute** the target section’s **Loop prompt** for **one** unit (its STEP-BY-STEP CADENCE + rubric).
5. **On PASS** — record `{ loop, family_id, unit_id, next_hop }`. Choose the next target for the following tick (same turn if time remains: still **one unit** then re-pick).
6. **On FAIL** — stay on the **same** section loop; consume that loop’s budget (3 rounds per attempt, 3 attempts). The graph budget is the same 3 × 3 on the blocking failure (do not hop away from a broken tick).
7. **Done(graph)** — all seven Done(section) and `npm run test:content` green → STOP with a per-node tally. Record the tally in [`GAP-AUDIT.md`](./GAP-AUDIT.md) (current pointer) so the next run starts from facts.

---

## Loop prompt

```markdown
# OBJECTIVE
Run the seven LOOPS/ section content loops as one graph until every section’s Done(section) is true.

**Done (graph):** Archive, Charts, Learn, Practice, Cases, Coach, and Home coverage floors all met per their files.

**Done (per tick):** Exactly one content unit in **one** section loop, chosen by the policy’s picker, verified with that section’s rubric.

# CONTEXT
- Picker + families + config block: `docs/projects/content-graph/LOOP-Graph.md` (COMMIT_MODE none, 3 attempts × 3 rounds, temp BUILD_CHECK)
- Floors as tests: `src/lib/contentGraph.test.ts` (`npm run test:content`); raise a floor there with its section file, never lower one
- Resume pointer: `docs/projects/content-graph/GAP-AUDIT.md`
- Authoring: only the chosen `LOOPS/LOOP-*.md` (never freelance a unit type that file forbids)
- Shared constraints: SAMPLE/STYLIZED; no LIVE; no brokerage; Equities path unlocks unchanged; one unit per tick
- Auto-verify: the chosen section's VERIFY line (`npm run lint` && `npm run test:content` && BUILD_CHECK, + `npm run test:coaching` on Coach ticks, + `npm run test:lib` on Archive / Practice ticks)
- Policy default: FOUNDATION_THEN_ECHO

# STEP-BY-STEP CADENCE
1. **Orient** — inventory counts from source; determine stage/family (or drain node); pick target loop + gap.
2. **Announce** in the tick output which loop and why (drain node vs echo hop vs leftover).
3. **Author** using that section file’s cadence only.
4. **Verify** using that section’s rubric + VERIFY (+ coaching tests if Coach).
5. **On PASS** — compute next hop (echo) or stay (drain until Done(section)).
6. **On FAIL** — same section; ≤3 rounds per attempt, STOP after 3 failed attempts → Error Handoff Summary (include graph stage/family).
7. **Do not** start a second section unit in the same tick after PASS unless time remains **and** you re-run the picker (still one unit, then stop or continue).

# VERIFICATION RUBRIC
PASS only if:
- [ ] Picker chose a legal target (drain order / echo hop / Learn A–C before Phase D)
- [ ] Section rubric for that loop also PASSes
- [ ] `npm run test:content` green (floors, ids, links, config block)
- [ ] No unlock/schema/LIVE drift
- [ ] lint + test:content + BUILD_CHECK 0 (and test:coaching if Coach)

# STOP CONDITIONS
- Done(graph) → STOP with per-section floors vs counts.
- 3 consecutive failed attempts on the blocking unit → handoff (stage, family, loop, id, stderr).
- Human verification: policy change; new pack id vs existing pack; overlay that needs chart work; a new `CaseThinkingMode`; a new `/practice/...` route; a Playbook source; anything that decides FE7.M2 (case bridge) or FE8.M1 (4th company).
- Abort: running two section loops without the picker; rewriting runtime “for cleanup.”

# TICK OUTPUT (keep short)
1. policy + stage (if any) + family_id (if any)
2. target loop + unit id
3. why this loop (foundation drain | echo hop from X | leftover drain)
4. PASS | FIXING (attempt a/3 · round r/3) | STOP
5. next_hop (loop + family) or Done(section) / Done(graph)
6. lint / test:content / (test:coaching) / build-check status
```

---

## Authoring notes

- Section files still say “stop at Done(section).” Under the graph, that is **not** a process stop unless policy is `DRAIN` and you just finished that node — continue to the next node/family.
- Cases pack order (`earnings` before `futures`, …) still binds Cases ticks. Echo cannot jump Cases to `forex` while `earnings` is thin.
- Learn Phase D is gated by Learn A–C even in `ECHO`; the picker parks multi-market Learn hops until then.
- Home is last in drain order so copy can name real ids. In echo, a Home hop is allowed **after** that family’s primary surface exists.
- Milestone `AGENTS_LOOP-*.md` files are out of this graph.
- Chart-skill Coach trees (candles, price action, trade management, indicators) read the same on any SAMPLE chart; tag them `all-markets` so `/coach?class=` lists them for every class (`ALL_MARKETS_COACH_TAG` in `marketNavigator.ts`). They count once per class in the Asymmetry Coach targets, so they do not reopen class asymmetry.
- Project loops ([`../financials-earnings/LOOP-Financials-Earnings.md`](../financials-earnings/LOOP-Financials-Earnings.md) Done, [`../macro-forces/LOOP-Macro-Forces.md`](../macro-forces/LOOP-Macro-Forces.md) Done, [`../beginner-academy/LOOP-Beginner-Academy.md`](../beginner-academy/LOOP-Beginner-Academy.md) chartered) build new surfaces milestone by milestone; do not run them in the same session as this graph. Once a project ships its groups, the matching echo family here points at them (families 4, 7, 14).

# LOOP — Graph (which section loop next)

Orchestrator for the seven section content loops. One `/loop` session; this file **picks** which section loop to execute each tick. Authoring rules always come from the chosen section file — this file does not invent cases, questions, or packs.

Companions: [`README.md`](./README.md) · [`LOOP-Archive.md`](./LOOP-Archive.md) · [`LOOP-Charts.md`](./LOOP-Charts.md) · [`LOOP-Learn.md`](./LOOP-Learn.md) · [`LOOP-Practice.md`](./LOOP-Practice.md) · [`LOOP-Cases.md`](./LOOP-Cases.md) · [`LOOP-Coach.md`](./LOOP-Coach.md) · [`LOOP-Home.md`](./LOOP-Home.md)

---

## How to run

```text
/loop content graph using LOOPS/LOOP-Graph.md
```

Override policy in the same line if you do not want the default:

```text
/loop content graph using LOOPS/LOOP-Graph.md policy=DRAIN
/loop content graph using LOOPS/LOOP-Graph.md policy=ECHO
```

**Default policy: `FOUNDATION_THEN_ECHO`.** Drain the lookup + instrument layers first, then walk **resource families** across loops (one unit per loop hop), then drain leftovers.

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build` (and `npm run test:coaching` when the tick is Coach).
2. Stop yourself anytime; hard-stop on the error budget or Done(graph).
3. Do not also start a single-section `/loop` or [`LOOP-Asymmetry.md`](./LOOP-Asymmetry.md) in the same session. Graph is equities-first; class catch-up is a separate run.

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
| Archive | `LOOP-Archive.md` | 1 term **or** 1 pattern **or** 1 overlay |
| Charts | `LOOP-Charts.md` | 1 SAMPLE pack |
| Learn | `LOOP-Learn.md` | 1 question (or 1 new group + first question) |
| Practice | `LOOP-Practice.md` | 1 draw template **or** 1 regime window **or** 1 tape |
| Cases | `LOOP-Cases.md` | 1 case study |
| Coach | `LOOP-Coach.md` | 1 coaching session |
| Home | `LOOP-Home.md` | 1 copy cluster |

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

Walk families in this order (equities-first):

| # | Family id | Typical chain (skip missing hops) |
|---|-----------|-------------------------------------|
| 1 | `pattern` | Archive pattern (+ optional `PATTERN_OHLC` / scan) → Learn family quiz → Practice draw template → Practice hunt tape if scan hits |
| 2 | `anatomy` | Archive term (`ohlc-anatomy` / `candle-color`) → Learn `candle-anatomy` |
| 3 | `vocab` | Archive ownership/markets/position/process term → Learn `equity-literacy` → Coach literacy session → Home tip |
| 4 | `statements` | Archive term (FCF, margin, P/E, …) → Learn `financial-literacy` or `financial-drills` (new snapshot if needed) → Cases `earnings` case in matching thinking mode → Coach earnings/statements session → Home thinking-mode tip |
| 5 | `indicators` | Archive overlay row only if chart renders it → Learn `indicators` question → Practice regime window with that overlay |
| 6 | `news` | Archive term (`rumor-vs-filing`, `priced-in`, `chase-vs-fade`) → Learn `news-literacy` → Cases `company-news` → Coach headline tree (skip if `chase-vs-fade` already covers) → Home tip |
| 7 | `macro` | Cases `macro-news` (risk-off / print / supply) → Coach macro session → Home tip |
| 8 | `combined` | Cases `combined` → Coach combined session → Home tip |
| 9 | `equity-tape` | Charts equity pack (new shape) → Learn `equity-patterns` question with that `samplePackId` → Cases earnings/news using a distinct (not cloned) tape |
| 10 | `futures` | Archive `futures-market` (exists → skip) → Charts `future` pack → Learn `futures-literacy` (Phase D) → Cases `futures` → Coach futures tree → Home nav copy |
| 11 | `forex` | Archive `forex-spot` → Charts `forex` pack → Learn `forex-literacy` → Cases `forex` → Coach forex session → Home |
| 12 | `crypto` | Archive `crypto-browse` → Charts `crypto` pack → Learn `crypto-literacy` → Cases `crypto` → Coach crypto session → Home |
| 13 | `options-context` | Archive `options-context` → Charts `option_context` pack → Learn `options-literacy` → Cases `options-context` → Coach options-context session → Home |

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
Stage 2  ECHO families 1 → 13 (one unit per tick, follow chain)
Stage 3  DRAIN leftover section floors in drain order
         (Learn → Practice → Cases → Coach → Home)
Done(graph) when every section file’s Done(section) is true
```

Stage 2 may complete some section floors early. Stage 3 only fills gaps.

If Stage 2 wants Learn Phase D before A–C: stay in Stage 2 but execute Learn’s **legal** next question (A–C) tagged to the current family when possible; otherwise pause that family.

---

## Per-tick algorithm

1. **Read** this file + the seven section files’ coverage queues (do not trust stale counts).
2. **Policy** — default `FOUNDATION_THEN_ECHO`; honor `policy=` from the user line.
3. **Pick target**
   - `DRAIN`: first node in drain order that is not Done(section). Gap = that file’s next coverage item.
   - `ECHO`: current family + next unfilled hop; if none, next family; if none, drain leftovers.
   - `FOUNDATION_THEN_ECHO`: Stage 0–3 as above. Remember `stage`, `family_id`, and `last_unit` across ticks (chat state is enough; do not add a progress schema).
4. **Execute** the target section’s **Loop prompt** for **one** unit (its STEP-BY-STEP CADENCE + rubric).
5. **On PASS** — record `{ loop, family_id, unit_id, next_hop }`. Choose the next target for the following tick (same turn if time remains: still **one unit** then re-pick).
6. **On FAIL** — stay on the **same** section loop; consume that loop’s 10-round budget. Graph error budget is the same 10 rounds on the blocking failure (do not hop away from a broken tick).
7. **Done(graph)** — all seven Done(section) → STOP with a per-node tally.

---

## Loop prompt

```markdown
# OBJECTIVE
Run the seven LOOPS/ section content loops as one graph until every section’s Done(section) is true.

**Done (graph):** Archive, Charts, Learn, Practice, Cases, Coach, and Home coverage floors all met per their files.

**Done (per tick):** Exactly one content unit in **one** section loop, chosen by the policy’s picker, verified with that section’s rubric.

# CONTEXT
- Picker + families: `LOOPS/LOOP-Graph.md`
- Authoring: only the chosen `LOOPS/LOOP-*.md` (never freelance a unit type that file forbids)
- Shared constraints: SAMPLE/STYLIZED; no LIVE; no brokerage; Equities path unlocks unchanged; one unit per tick
- Auto-verify: `npm run lint` && `npm run build`; add `npm run test:coaching` when the unit is a coaching session
- Policy default: FOUNDATION_THEN_ECHO

# STEP-BY-STEP CADENCE
1. **Orient** — inventory counts from source; determine stage/family (or drain node); pick target loop + gap.
2. **Announce** in the tick output which loop and why (drain node vs echo hop vs leftover).
3. **Author** using that section file’s cadence only.
4. **Verify** using that section’s rubric + lint/build (+ coaching tests if Coach).
5. **On PASS** — compute next hop (echo) or stay (drain until Done(section)).
6. **On FAIL** — same section; max 10 rounds → Error Handoff Summary (include graph stage/family).
7. **Do not** start a second section unit in the same tick after PASS unless time remains **and** you re-run the picker (still one unit, then stop or continue).

# VERIFICATION RUBRIC
PASS only if:
- [ ] Picker chose a legal target (drain order / echo hop / Learn A–C before Phase D)
- [ ] Section rubric for that loop also PASSes
- [ ] No unlock/schema/LIVE drift
- [ ] lint + build 0 (and test:coaching if Coach)

# STOP CONDITIONS
- Done(graph) → STOP with per-section floors vs counts.
- Error budget 10 on the blocking unit → handoff (stage, family, loop, id, stderr).
- Human verification: policy change; new pack id vs existing pack; overlay that needs chart work.
- Abort: running two section loops without the picker; rewriting runtime “for cleanup.”

# TICK OUTPUT (keep short)
1. policy + stage (if any) + family_id (if any)
2. target loop + unit id
3. why this loop (foundation drain | echo hop from X | leftover drain)
4. PASS | FIXING (n/10) | STOP
5. next_hop (loop + family) or Done(section) / Done(graph)
6. lint/build/(test:coaching) status
```

---

## Authoring notes

- Section files still say “stop at Done(section).” Under the graph, that is **not** a process stop unless policy is `DRAIN` and you just finished that node — continue to the next node/family.
- Cases pack order (`earnings` before `futures`, …) still binds Cases ticks. Echo cannot jump Cases to `forex` while `earnings` is thin.
- Learn Phase D is gated by Learn A–C even in `ECHO`; the picker parks multi-market Learn hops until then.
- Home is last in drain order so copy can name real ids. In echo, a Home hop is allowed **after** that family’s primary surface exists.
- Milestone `AGENTS_LOOP-*.md` files are out of this graph.

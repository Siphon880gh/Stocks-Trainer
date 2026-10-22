# Gap audit — content graph + every loop prompt (2026-10-21)

Resume pointer for the "check for gaps in the Main Content Graph Prompt and the other prompts, then implement them" run. Weng asked for a full drain; commits are left to Weng (nothing committed, nothing pushed).

**Baseline before edits (HEAD 00e8a5e):** lint 0 · test:coaching 24/24 · src/lib tests 68/68 · test:financials 241/241 · test:macro 72/72.

## Current pointer
- `status`: done (2026-10-21). Nothing committed; every change is in the working tree for Weng to review.
- `next`: no open graph gap. `npm run test:content` is the live audit. Re-run it first, and a red check is the next gap. Remaining items need a human (see "Left for Weng").

## Checklist (implementation order)
- [x] C1 Duplicate literacy id `high-wave` (two Archive / flashcard rows) — give the combined entry its own id; rickshaw-man refs → `rickshaw-man`
- [x] C2 `samplePackId` drills chart the pack's own tape (QuizModal + AnswerSheetModal used `SAMPLE_OHLC`)
- [x] C3 Scaled-clone case tape `case-fx-eur-supply-energy` ≈ `case-fut-es-print` — new EUR tape
- [x] C4 `equity-patterns`: drills for the two equity packs with none (`eq-fail-rally`, `eq-div-cut`)
- [x] C5 Coach Phase D: price-action / trade-management / supply-demand / candle-context / RSI-vs-trend sessions
- [x] C6 Cases: Stage B packs (`*-tape`, `*-macro`) have 0 intermediate cases — every home mode at intermediate
- [x] C7 Home coachTips name shipped surfaces (Buy or Sell?, Price Action, Statements lab, Earnings Preview, Read the Print, Macro Desk)
- [x] C8 Auto-test: `src/lib/contentGraph.test.ts` enforces every section floor + reference integrity; `test:content` / `test:lib` scripts
- [x] D1 LOOP-Graph.md + CHARTER.md refreshed (config block, temp build, tests, new families, nodes, related projects)
- [x] D2 Section loops refreshed (Archive, Charts, Learn, Practice, Cases, Coach, Home, Asymmetry, README)
- [x] D3 Project loops consistency (financials CHECKPOINT_MODE line, Beginner Academy stale sibling note + baseline)
- [x] D4 AGENTS_CODE_REFERENCE*.md routes / tree / tests refreshed
- [x] V  Full verification + screenshots

**After (2026-10-21):** lint 0 · test:coaching 24/24 · test:lib 161/161 (68 + 93 content-graph checks) · test:financials 241/241 · test:macro 72/72 · check:build ok (temp outDir deleted; `dist/` untouched).

## Audit table

| # | Prompt | Gap found | Fix |
|---|--------|-----------|-----|
| 1 | LOOP-Archive | Literacy id `high-wave` defined twice → two Archive / flashcard rows, modal shows the later one | Combined row renamed `high-wave-and-rickshaw-man`; rickshaw-man pattern `glossaryLink` and `BS-W-rickshaw-man` term → `rickshaw-man`; duplicate-id test |
| 2 | LOOP-Learn Phase C | `samplePackId` overlay drills charted generic `SAMPLE_OHLC`, not the tagged pack | `src/lib/quizChartData.ts` (`overlayQuizBars`, `quizSamplePackName`); QuizModal + AnswerSheetModal use it; caption names the pack |
| 3 | LOOP-Learn Phase C | Equity packs `eq-fail-rally` and `eq-div-cut` had no drill | `EQ-PAT-09` (MACD on failed rally), `EQ-PAT-10` (RSI in a fresh downtrend can stay low); test: every equity pack has one |
| 4 | LOOP-Cases | `case-fx-eur-supply-energy` tape was a rescaled clone of `case-fut-es-print` | New `EUR_ENERGY_PRE` tape + aftermath; clone check across all 437 cases |
| 5 | LOOP-Cases / Asymmetry | Stage B packs (`*-tape`, `*-macro`) had 0 intermediate cases | 20 intermediate cases (5 per class), every home mode at both difficulties |
| 6 | LOOP-Coach | No Coach hop for price action, trade management, zones, candle context, RSI misuse | 5 sessions tagged `all-markets`: `trade-plan-before-entry`, `trailing-stop-exit`, `supply-demand-zone-retest`, `candle-needs-context`, `rsi-vs-trend`; `ALL_MARKETS_COACH_TAG` in marketNavigator (Asymmetry parity holds: 22 / 17 / 18 / 17 / 17 vs target 16) |
| 7 | LOOP-Home | A tip named Coach "Beat vs miss", which is not a title; shipped surfaces (Statements lab, Earnings Preview / Read the Print, Macro Desk, chart-skill sessions) unnamed | Tips fixed and extended in `learningPaths.ts`; test checks every `Coach →` / `Learn →` name |
| 8 | All prompts | Floors were prose only; nothing failed when a floor or reference broke | `src/lib/contentGraph.test.ts` (93 checks); scripts `test:lib`, `test:content`, `check:build`, `verify` |
| 9 | All section loops + Graph | 10-round budget vs the projects' 3 × 3; verify built into `dist/`; no config block | Shared config block (COMMIT_MODE none, 3 × 3, temp BUILD_CHECK, VERIFY, CHECKPOINT_MODE) in every LOOP file; test enforces it and bans a plain build |
| 10 | LOOP-Graph | No trade-management family; price-action / statements / macro / indicators / anatomy chains missed shipped hops; Academy and Playbooks unaccounted | Family 2c trade-management; hops to Practice labs, Coach sessions, `earnings-jargon`, `mark-the-band`, `MacroHomeTip`; family 14 academy parked until BA10.M3; Playbooks + project pages listed as not-nodes |
| 11 | CHARTER (graph) | Related projects stale ("when that ships (FE7.M3)"); macro-forces / beginner-academy missing; no stop rule | Related projects refreshed (FE7.M2 / FE8.M1 left open); stop rule + last-audit rows |
| 12 | LOOP-Learn | Phase B listed 8 of 31 families; dedicated banks had no floors / prefixes | Full family list; dedicated-bank table with real prefixes and floors; reference-integrity notes |
| 13 | LOOP-Practice | Lookalike / invalidation / levels labs and project pages missing; "Phase D: no routes" stale | Phase D = shipped labs, floor ≥8 each; project pages delegated; EMA / MACD regime follow-up parked with reason |
| 14 | LOOP-Cases | Stage B packs absent from the queue | Rows 9–10 with home modes; clone rule; FE7.M2 STOP note |
| 15 | LOOP-Coach | "Existing modules" listed 4 of 70; no Phase D | Inventory by family; Phase D table; `all-markets` rule |
| 16 | LOOP-Charts / Archive | Shape table and id lists read as if work remained | Done-state notes with counts; unique-id rule; PATTERN_OHLC + Buy-or-Sell follow-ups; OVERLAYS-equals-renderable rule |
| 17 | LOOP-Asymmetry | Snapshot table from before Stage B | Current table (Done) + `all-markets` and live-test notes |
| 18 | LOOPS/README | Plain build in verify text; no test:content / Playbooks note | Config-block explanation, VERIFY wording, unique-id rule, Playbooks note, project statuses |
| 19 | Financials loop | No CHECKPOINT_MODE line; shared build dir | `CHECKPOINT_MODE: continue` (product decisions still STOP); own temp dir |
| 20 | Beginner Academy loop | Trade management "being added by a sibling change" (shipped in 2c93114); baseline 63 lib tests; old lib-test command | Shipped ids listed; `test:lib` in verify lists (Academy, financials, macro loops, CHARTER, EPICS); baseline update in PROGRESS.md; coach count 70 |
| 21 | AGENTS_CODE_REFERENCE*.md | Routes missing `/macro`, `/playbooks`, project practice pages; tree from the first commit; no test scripts; old git history | Architecture, tree, scripts, safe-edit rules, history refreshed; training ref documents `overlayQuizBars` |
| 22 | patterns.ts (test infra) | Registry crashed under node (`import.meta.env`, `document`) | Safe fallbacks so node tests can import it |
| 23 | Archive (advanced) | Nothing checked that advanced `glossaryLink` / drill terms resolve | Test added (all resolve today) |

## Left for Weng
- FE7.M2 (bridge financials content into cases) and FE8.M1 (4th company: bank or biotech): still open. Nothing here decides them.
- Beginner Academy: recommended as the next drain. It is the only remaining forward plan; every graph floor is met and graph family 14 waits on BA10.M3.
- Playbooks: each needs a real outside source that a human supplies; no loop invents one.
- Parked: EMA / MACD regime follow-ups. On these short windows they read the same as SMA and make the trend windows ambiguous.
- `all-markets` Coach sessions also show on a locked class's `/coach?class=` list (they map to Equities for the lock check). That is intended; flip it if you would rather hide them until peek.
- Root `AGENTS_LOOP-*.md` milestone queues (Done(global), outside this graph) still verify with a plain build into `dist/`; left as historical.
- Screenshots: `checkpoints/coach-forex-all-markets.png`, `coach-trade-plan.png`, `coach-rsi-vs-trend.png`, `learn-equity-patterns.png`. Case pages need a session peek click, so none were taken headless.

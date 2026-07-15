# Council Deliberation: P0 Execution (How to Build Option A)

**App:** Stock Trainer (ANALYSIS_CORE)  
**Date:** 2026-07-15  
**Topic:** Execute finalized P0 Beginner Equities Path (curriculum Option A locked)  
**Process:** 12 agents (Research → Data lenses) → peer grading → 3 HOW options  

**Curriculum lock (not reopened):**  
`E1.M1 → E3.M1 → E4.M1 → E4.M2 → E4.M0 → E5.M1 → E5.M3 → E5.M2 → E2.M1 → E3.M2 → E6.M1 → MVP FREEZE`

**Selected:** Option A — contracts-first balanced (user confirmed 2026-07-15)  
**Applied to:** [`.agents/state.json`](./.agents/state.json)

Companion: [`council-report-epics-milestones.md`](./council-report-epics-milestones.md) · [`EPIC_MAP.md`](./EPIC_MAP.md) · [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md)

---

## Process

- 12 agents deployed with distinct lenses (Research-first, Implementation-first, Risk, UX, Minimal-change, Scalable, Cost, Alternative, Standards, Quick-win, Security, Data)
- Peer grading completed
- 3 options synthesized for how to implement P0 (not what curriculum to teach)

---

## Grades (Convener)

| # | Lens | K | S | P | Avg |
|---|------|---|---|---|-----|
| 1 | Research-first | 5 | 5 | 4 | 4.7 |
| 2 | Implementation-first | 4 | 5 | 5 | 4.7 |
| 3 | Risk & edge cases | 5 | 5 | 5 | 5.0 |
| 4 | User/UX-centric | 4 | 5 | 4 | 4.3 |
| 5 | Minimal-change | 4 | 5 | 4 | 4.3 |
| 6 | Scalable/long-term | 4 | 4 | 4 | 4.0 |
| 7 | Cost & resources | 5 | 4 | 4 | 4.3 |
| 8 | Alternative methods | 4 | 4 | 4 | 4.0 |
| 9 | Standards & compliance | 4 | 5 | 5 | 4.7 |
| 10 | Quick-win | 3 | 4 | 4 | 3.7 |
| 11 | Security-only | 5 | 5 | 4 | 4.7 |
| 12 | Data | 5 | 4 | 5 | 4.7 |

**Top tier:** Risk (#3), Research, Implementation, Standards, Security, Data.

---

## Strongest elements (carry into any option)

1. Typed contracts first: Instrument, SamplePack, ProgressStore, CaseStudy, path IDs  
2. Freeze milestone IDs at E3.M1; schemaVersion + corrupt reset  
3. Reuse Training/QuizModal for E4; wire existing TA for E4.M0  
4. Content floors only: ≥3 packs, ≥8+8 quizzes, ≥3 earnings, ≥3 company news  
5. Anti-hindsight: hide postOhlc until decide submitted; process debriefs  
6. Soft-gates as code (chart gate, short)  
7. One primary Next CTA; kill decorative % and LIVE/REAL_TIME theater  
8. SAMPLE/STYLIZED labels; localStorage = UX progress, not attested credential  
9. One milestone in_progress; GO/NO-GO before next; deny post-P0 until freeze green  
10. Append-only registries so post-freeze cases don’t force migrations  

---

## Option A: Contracts-first balanced

**Summary:** Sequential milestones; schemas frozen early; Training reused; content at floors; GO/NO-GO per milestone; thin registries for append-only post-P0.

**Key steps:**
1. E1.M1 — Instrument/SamplePack + ≥3 distinct equity OHLC + markets adapter + SAMPLE labels  
2. E3.M1 — ProgressStore + schemaVersion + freeze Beginner Equities IDs (incl. E4.M0)  
3. E4.M1 → E4.M2 — QuizModal literacy at floors + snapshot card  
4. E4.M0 — Soft-gate via existing Training groups  
5. E5.M1 — CaseStudy + player; anti-hindsight reveal  
6. E5.M3 → E5.M2 — Floors 3+3; process debriefs; short soft-gated  
7. E2.M1 → E3.M2 → E6.M1 — Fixed path template, unlocks, live Next CTA + credential  
8. FREEZE checklist green before any post-P0  

**Trade-offs:** Slightly slower than max-parallel; lowest rework; strongest teaching integrity.  
**Best when:** Starting E1.M1 with agents; theory application matters more than demo theater.

---

## Option B: Max-speed floors + parallel + early Dashboard skeleton

**Summary:** Same learner unlock order; compress calendar with E1∥E3, early Dashboard shell, parallel content authoring after schemas, floors only.

**Key steps:**
1. Day 0–1: lib scaffold + Dashboard shell (no fake %)  
2. Parallel: packs (E1) ∥ ProgressStore + frozen IDs (E3)  
3. Literacy + chart gate at floors  
4. Case engine + 3+3 packs in parallel  
5. Unlock + live CTA; freeze  

**Trade-offs:** Faster visible wins; higher merge/ID conflict risk if E3 lags.  
**Best when:** Stakeholder demos this week and two streams can work in parallel.

---

## Option C: Max safety + minimal-change + trust labeling

**Summary:** Smallest blast radius; adapters only; feature flags; trust copy as release blockers; unlock late; compliance deny list.

**Key steps:**
1. E1 behind flag; adapter-only Market; distinct OHLC  
2. E3 schemaVersion + ID freeze; no unlock yet  
3. E4 via QuizModal only; E4.M0 deep-link Training  
4. E5 flagged; text-only debriefs; SAMPLE on every case  
5. E3.M2 + E6 with credential audit + strip LIVE copy  
6. Freeze only when #3+#9+#11 checklists pass  

**Trade-offs:** Safest trust/compliance; slowest calendar; more flag plumbing.  
**Best when:** Real beginners soon and wrong educational claims are the top risk.

---

## Recommendation

**Option A (Contracts-first balanced).**

Combines contracts + file layout + GO/NO-GO + field lists; absorbs reuse/UX/trust without Option C’s flag tax; uses content floors so Option B’s speed doesn’t inflate packs.

### First coding slice (when user says go)

| Story | Do |
|-------|-----|
| E1.M1.S1 | Export `Instrument` + `SamplePack` from `src/lib` |
| E1.M1.S2 | Seed ≥3 equities with visually distinct OHLC |
| E1.M1.S3 | Adapter so BTC/ETH/SPX Market still works |
| E1.M1.S4 | Stub non-equity classes; no multi-asset UI promise |
| Trust | SAMPLE/STYLIZED in notes or labels |

**Immediately after E1.M1 GO:** E3.M1 freeze path IDs + ProgressStore — do not start E4 until IDs are frozen.

**Do not in P0:** CMS, multi-path UI, chart stack rewrite, decorative Dashboard %, LIVE/REAL_TIME copy, post-P0 milestones, scaled OHLC clones.

---

## Apply-to-docs (after option selection)

Update `.agents/state.json` with `council_execution_option` and next_action; optionally add execution notes to EPIC_MAP agent notes.

# Charter — Beginner Academy (broker-style beginner training, merged into the app)

Project folder: `docs/projects/beginner-academy/` · Research: [`RESEARCH.md`](./RESEARCH.md) · Epics: [`EPICS.md`](./EPICS.md) · Stories: [`STORIES.md`](./STORIES.md) · Progress log: [`PROGRESS.md`](./PROGRESS.md) · Loop: [`LOOP-Beginner-Academy.md`](./LOOP-Beginner-Academy.md) (indexed in [`LOOPS/README.md`](../../../LOOPS/README.md))

| Field | Value |
|-------|-------|
| **Status** | In progress (loop started 2026-10-21). See PROGRESS.md. |
| **Epic ids** | `BA0`–`BA10` (+ `BA11` stretch). Own namespace; does not reopen E0–E11 (Done(global) in `EPIC_MAP.md`), `FE*` or `MF*`. |
| **Owner / reviewer** | Weng |
| **Commit policy** | `COMMIT_MODE: local` for the 2026-10-21 drain (Weng: "make commits"): local commits per coherent chunk. Never push, never open a PR. |
| **Code namespace** | `src/lib/academy/` (pure logic + data + tests), `src/components/academy/` (UI), `src/pages/academy/` (routes) |
| **Test script** | `npm run test:academy` → `tsx --test "src/lib/academy/**/*.test.{ts,tsx}"` (added in BA0.M1) |

---

## 1. Why

Weng's ask: *"Do you know how webull trains beginners? Create epics and milestones on it to merge it into our app."*

A large retail broker's beginner funnel (researched in [`RESEARCH.md`](./RESEARCH.md)) leans on five patterns:

1. a **course library** of short, numbered lessons grouped into courses / units, with a progress page;
2. **quizzes after lessons** that earn **knowledge points** inside a "training plan";
3. a **paper-trading** (simulated) account with a large default virtual balance, a reset button, real order types (market, limit, stop, stop-limit, trailing stop, bracket/OCO), positions and P&L, plus time-boxed **paper-trading competitions** with leaderboards;
4. a **chart replay** mode for practicing bar by bar;
5. **options trading levels** (Level 1 covered calls / cash-secured puts → Level 4 naked) unlocked by an application / knowledge assessment.

The app already has deep *content* (≈1,450 quiz items, 100+ patterns, 70 coach sessions (63 when this charter was written), cases, the Buy or Sell drill, the financials and macro projects), but **no structured beginner course map, no short lesson + unit-quiz player, no placement routing, no simulated account with orders, no challenges, no badges/streak-day rewards beyond the quiz streak counter, and no options knowledge ladder.** Independent reviewers also criticise that broker's education for having *no clear learning path* — so the opportunity is to copy the engagement mechanics and beat it on structure. See the audit in [`RESEARCH.md` → Mapping](./RESEARCH.md#mapping-broker-pattern--existing-app-feature--gap--epic).

## 2. Goal

A brand-new learner can:

1. Take a short **placement check** (or skip it) and land on the right starting **level** of a **course map** (Level 0 Orientation → Level 6 Options education + Level 7 Other markets).
2. Work through **bite-sized lesson units** (≤ 5 minutes each: 3–6 lesson cards + a 3–5 question unit quiz), where each unit **links into existing app content** (quiz groups, glossary terms, coach sessions, practice labs, cases, Macro Desk, Statements Lab) instead of duplicating it.
3. Open a **simulated paper account** (virtual cash, fees off by default), place **market / limit / stop / stop-limit / trailing-stop** orders on SAMPLE bar-replay tapes, and see **positions, cost basis, realised / unrealised P&L, buying power and order history** — every number provably correct by tests.
4. Play **paper-trading challenges** (scripted goals + rules + local leaderboard against fictional benchmark "ghost" traders).
5. Earn **virtual knowledge points, badges, levels and a daily streak** that are never redeemable for anything.
6. Climb an **options knowledge ladder** (Levels 1–4 mirroring the industry tiering) where each level is gated by a knowledge check and a risk acknowledgement, teaching payoff-at-expiration math only.

## 3. Audience

- **Primary:** absolute beginners who have never placed an order — they need orientation, order-ticket literacy and a safe sandbox before Cases and the Buy or Sell drill.
- **Secondary:** existing learners who want a guided "what next" map across the app's now-large content and a place to practise order mechanics (trailing stops, stop-limit gaps) that charts alone cannot teach.

## 4. Scope

**In scope**
- Course / level / unit / lesson-card data model, course map page, unit player, unit quiz (reusing `QuizModal` patterns), progress persistence on **new** localStorage keys.
- Placement check (10–12 items) and per-level "test out" quizzes.
- Pure paper-trading engine over SAMPLE OHLC tapes: order types above, time-in-force (Day / GTC), long-only stocks/ETFs in v1, deterministic bar-based fill rules, positions, P&L, buying power, order validation, reset with chosen starting cash.
- Paper-trading UI: order ticket with a plain-language "what this order does" preview, positions, open orders, history, equity curve, bar-by-bar replay stepping.
- Challenges with seeded tapes, rules, scoring and a local leaderboard of fictional benchmark entries.
- Rewards: knowledge-points ledger, badges, levels, daily streak, idempotent awarding, retro-credit from existing progress (read-only).
- Options knowledge ladder L1–L4 with knowledge checks, attempt cooldown, risk acknowledgement, and payoff-at-expiry arithmetic (max gain / max loss / breakeven) for the strategies on each level.
- "Today" card: daily lesson / question / term picked deterministically by local date.
- New glossary terms (order types, buying power, P&L, time-in-force, assignment, etc.), Learn quiz groups, a coach session ("Your first paper trade"), Training + Home entry points, docs.

**Out of scope (non-goals)**
- Any real brokerage, real account, real money, real order routing, KYC, login to a broker, or broker API (including any broker MCP / Open API). No network calls at runtime.
- Live or real-time quotes; real tickers presented as live. Tapes are SAMPLE / fictional (`.S` suffix convention).
- Real-money or real-stock rewards, sweepstakes, referral or deposit mechanics. Points are virtual and non-redeemable.
- A real social feed / community posting, user-generated content, online leaderboards. (Benchmarks are fictional, labelled, and local.)
- Options chains, a pricing model or a Greeks engine (existing app rule). Premiums are given numbers; only expiry payoff arithmetic.
- Margin, short selling, fractional shares and bracket/OCO in the core scope (they are `BA11` stretch, gated by Weng).
- Copying the broker's text, branding, colours, logos, course names, quiz items or lesson structure verbatim. Only the **design patterns** listed in RESEARCH.md are reused; all content is written fresh.
- Changing Beginner Equities unlocks, renaming `analysis_core_progress_v1`, or altering case grading.

## 5. Educational stance (non-negotiable)

- Every paper surface shows `SIMULATED — virtual money, SAMPLE prices, not a brokerage, not trading advice.` and uses a distinct "simulated" accent on order buttons (our own token, not the broker's colour).
- Teach **process**: what the order does, when it fills, what can go wrong (gaps through stops, unfilled limits, stop-limit not filling), position size vs account, and the exit plan. Never "this trade makes money".
- Reward **learning behaviours** (finishing units, reviewing mistakes, using stops, sticking to the plan), not raw P&L. Challenges score risk discipline at least as much as return.
- Options content always states that options can lose 100% of the premium quickly and that real approval is a broker/regulatory process this app does not perform.

## 6. Data approach

- **Content:** original lesson cards and quiz items in `src/lib/academy/content/`. Units mostly **reference** existing content via typed refs (`quiz:<groupId>`, `glossary:<termId>`, `coach:<slug>`, `practice:<route>`, `case:<id>`, `macro:<lessonId>`, `route:<path>`); a resolver test proves every ref exists.
- **Paper engine:** pure functions over `OHLC[]` from `samplePacks.ts` / `scenarioCharts.ts` tapes; integer cents for money, integer shares; seeded, deterministic. Fill rules are documented and test-locked (see EPICS BA4).
- **Persistence:** new keys only — `analysis_core_academy_v1` (course + placement + options ladder), `analysis_core_academy_paper_v1` (accounts, orders, fills), `analysis_core_academy_rewards_v1` (ledger, badges, streak). Each has `schemaVersion` + a migration function and corruption recovery, mirroring `progressStore.ts`. Export/import through `progressSync` is an additive, tested change.

## 7. Success criteria (project Done)

1. Every core milestone in `EPICS.md` is `[x]` with its automated verification recorded in `PROGRESS.md`.
2. `npm run lint`, `npm run test:coaching`, `npm run test:lib` (= `src/lib/*.test.{ts,tsx}`), `npm run test:financials`, `npm run test:macro`, `npm run test:academy` and the temp-folder production build all exit 0.
3. Content floors, all validator-checked:
   - ≥ 8 levels / courses and ≥ 40 units, every unit with 3–6 lesson cards, a 3–5 item unit quiz and ≥ 1 resolved link into existing content;
   - placement check of 10–12 items routing to ≥ 4 distinct start levels;
   - paper engine: all 5 order types × buy/sell × Day/GTC covered by tests, plus ≥ 30 order-validation cases;
   - ≥ 10 challenges across ≥ 4 skill themes;
   - ≥ 20 badges, every one reachable by a scripted test learner;
   - options ladder: 4 levels, ≥ 8 knowledge-check items per level, payoff math for every strategy listed on the level;
   - ≥ 25 new glossary terms and ≥ 60 new Learn questions.
4. Human checkpoints in `EPICS.md` are signed off by Weng in `PROGRESS.md`.
5. No `dist/` changes, no push, no PR, commits only per `COMMIT_MODE`, no new runtime dependencies.

## 8. Open decisions (defaults chosen so the loop can drain; Weng can override in PROGRESS.md)

| # | Decision | Default the loop uses | Why |
|---|----------|----------------------|-----|
| D1 | Options payoff math vs the "options = context only" rule | Allowed: payoff-at-expiry arithmetic with given premiums; no chain, no pricing model, no Greeks | Arithmetic only; keeps the existing rule's intent |
| D2 | Placement check placement | Optional card after GoalPicker confirm and on `/academy`; never blocks the existing first run | Doesn't change `pathConfirmed` semantics |
| D3 | Default starting virtual cash | $10,000 with presets $1k / $10k / $100k / $1M | The broker default ($1M) is unrealistic for beginners (a point reviewers and creators make) |
| D4 | Fees | Off by default; optional flat-fee toggle in BA11 | Mirrors $0 commissions while letting fees be taught later |
| D5 | Does Academy progress unlock anything existing? | No. It only links and recommends | Beginner Equities unlocks are frozen |

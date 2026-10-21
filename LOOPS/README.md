# LOOPS — section content loops

Reusable `/loop` prompts that deepen **content** per app section. Runtime and milestone queues stay in the root `AGENTS_LOOP-*.md` files. These loops assume that runtime already exists.

**If Forex / Futures / Crypto / Options look thin next to Equities:** section floors are probably already met. Run class catch-up instead of the graph:

```text
/loop class asymmetry using LOOPS/LOOP-Asymmetry.md
```

See [`LOOP-Asymmetry.md`](./LOOP-Asymmetry.md). Do not combine it with the graph or a single-section exhaustive loop in the same session.

**Preferred for first-pass exhaustive content:** one graph session that picks the next section each tick — [`LOOP-Graph.md`](../docs/projects/content-graph/LOOP-Graph.md) (lives in the content-graph project folder with its [`CHARTER.md`](../docs/projects/content-graph/CHARTER.md); the section loops it runs stay here). Default policy drains Archive then Charts, then echoes the same teaching idea across loops, then drains leftovers.

```text
/loop content graph using docs/projects/content-graph/LOOP-Graph.md
```

To pin a policy: `policy=DRAIN` (finish one section before the next) or `policy=ECHO` (hop after every resource). Default is `FOUNDATION_THEN_ECHO`.

To run a **single** section instead, use that file only. Do not start the graph and a section loop in the same session.

## How to run (one section)

Preferred (dynamic — agent self-paces after each tick):

```text
/loop exhaustive Cases content using LOOPS/LOOP-Cases.md
```

Swap the file for the section you want:

| Section (nav / route) | Loop file | `/loop` line |
|-----------------------|-----------|--------------|
| **Class asymmetry** (Forex/Futures/Crypto/Options vs Equities) | [`LOOP-Asymmetry.md`](./LOOP-Asymmetry.md) | `/loop class asymmetry using LOOPS/LOOP-Asymmetry.md` |
| **Graph (all sections)** | [`LOOP-Graph.md`](../docs/projects/content-graph/LOOP-Graph.md) | `/loop content graph using docs/projects/content-graph/LOOP-Graph.md` |
| **Project: Financials & earnings** (statements, 13-week forecast, preview, Read the Print) | [`LOOP-Financials-Earnings.md`](../docs/projects/financials-earnings/LOOP-Financials-Earnings.md) | `/loop financials project using docs/projects/financials-earnings/LOOP-Financials-Earnings.md` |
| **Project: Macro forces** (jobs, CPI, FOMC, yields, mortgage rates → SIMULATED look-alikes + reaction game) | [`LOOP-Macro-Forces.md`](../docs/projects/macro-forces/LOOP-Macro-Forces.md) | `/loop macro project using docs/projects/macro-forces/LOOP-Macro-Forces.md` |
| **Project: Beginner Academy** (course map, placement, paper trading, challenges, rewards, options ladder) | [`LOOP-Beginner-Academy.md`](../docs/projects/beginner-academy/LOOP-Beginner-Academy.md) | `/loop beginner academy project using docs/projects/beginner-academy/LOOP-Beginner-Academy.md` |
| Home `/` | [`LOOP-Home.md`](./LOOP-Home.md) | `/loop exhaustive Home content using LOOPS/LOOP-Home.md` |
| Learn `/training` | [`LOOP-Learn.md`](./LOOP-Learn.md) | `/loop exhaustive Learn content using LOOPS/LOOP-Learn.md` |
| Charts `/market` | [`LOOP-Charts.md`](./LOOP-Charts.md) | `/loop exhaustive Charts content using LOOPS/LOOP-Charts.md` |
| Cases `/cases` | [`LOOP-Cases.md`](./LOOP-Cases.md) | `/loop exhaustive Cases content using LOOPS/LOOP-Cases.md` |
| Coach `/coach` | [`LOOP-Coach.md`](./LOOP-Coach.md) | `/loop exhaustive Coach content using LOOPS/LOOP-Coach.md` |
| Reference `/archive` | [`LOOP-Archive.md`](./LOOP-Archive.md) | `/loop exhaustive Archive content using LOOPS/LOOP-Archive.md` |
| Practice `/practice-*` | [`LOOP-Practice.md`](./LOOP-Practice.md) | `/loop exhaustive Practice content using LOOPS/LOOP-Practice.md` |

Prefer **no interval** so each wake adds the next content unit instead of waiting on a timer.

**Before starting**
1. Is your current server working? If `npm run dev` is already up on port **3001**, leave it alone. These loops verify with `npm run lint` + `npm run build` (and `npm run test:coaching` when Coach content changes).
2. Stop the loop yourself when you want. The agent also hard-stops on the error budget or Done(section).

## Shared rules (every section)

- SAMPLE / STYLIZED / educational only. No LIVE / REAL_TIME theater. No brokerage. No paid API keys.
- Options = educational context only (no chain, no Greeks engine).
- Equities remain the traditional retail path. Do not replace Beginner Equities unlocks.
- One content unit per tick (one case, one question, one pack, one session, one term, one template — not a whole pack dump).
- Distinct data shapes: do not clone-and-rescale existing OHLC or copy-paste debriefs with a renamed title.
- Process teaching over “price went up.”
- After any code change: `npm run lint` && `npm run build`.
- Create or adapt `.agents/skills/*` when the same authoring workflow repeats.

## Project loops

Milestone-by-milestone projects live in `docs/projects/<name>/` (CHARTER.md · EPICS.md · STORIES.md · PROGRESS.md · loop file). They build new surfaces and stop for human review or repeated failure; do not run them in the same session as the graph or a section loop.

- [`docs/projects/content-graph/`](../docs/projects/content-graph/CHARTER.md): the content graph orchestrator
- [`docs/projects/financials-earnings/`](../docs/projects/financials-earnings/CHARTER.md): financials, expectations and earnings reactions
- [`docs/projects/macro-forces/`](../docs/projects/macro-forces/CHARTER.md): macro releases (jobs, CPI, FOMC, yields, mortgage rates…) with real-source links, SIMULATED look-alikes and market-reaction game · `/loop macro project using docs/projects/macro-forces/LOOP-Macro-Forces.md`
- [`docs/projects/beginner-academy/`](../docs/projects/beginner-academy/CHARTER.md): broker-style beginner training — leveled course map with short units, placement check, SIMULATED paper account (market/limit/stop/stop-limit/trailing stop), challenges, virtual points/badges/streak, options knowledge ladder · `/loop beginner academy project using docs/projects/beginner-academy/LOOP-Beginner-Academy.md`

## Not these files

Milestone delivery (P0 → E11) stays in:

- [`AGENTS_LOOP-Continue-Milestone.md`](../AGENTS_LOOP-Continue-Milestone.md)
- [`AGENTS_LOOP-Market-Types.md`](../AGENTS_LOOP-Market-Types.md)
- [`AGENTS_LOOP-Market-Learning-Coverage.md`](../AGENTS_LOOP-Market-Learning-Coverage.md)
- [`AGENTS_LOOP-Step-Coaching.md`](../AGENTS_LOOP-Step-Coaching.md)
- [`AGENTS_LOOP_QA_User_Flows.md`](../AGENTS_LOOP_QA_User_Flows.md)

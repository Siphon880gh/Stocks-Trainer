# PROMPTS — section content loops

Reusable `/loop` prompts that deepen **content** for one app section at a time. Runtime and milestone queues stay in the root `AGENTS_LOOP-*.md` files. These loops assume that runtime already exists.

Run **one section loop at a time**. Do not start two content loops in the same session.

## How to run

Preferred (dynamic — agent self-paces after each tick):

```text
/loop exhaustive Cases content using PROMPTS/LOOP-Cases.md
```

Swap the file for the section you want:

| Section (nav / route) | Loop file | `/loop` line |
|-----------------------|-----------|--------------|
| Home `/` | [`LOOP-Home.md`](./LOOP-Home.md) | `/loop exhaustive Home content using PROMPTS/LOOP-Home.md` |
| Learn `/training` | [`LOOP-Learn.md`](./LOOP-Learn.md) | `/loop exhaustive Learn content using PROMPTS/LOOP-Learn.md` |
| Charts `/market` | [`LOOP-Charts.md`](./LOOP-Charts.md) | `/loop exhaustive Charts content using PROMPTS/LOOP-Charts.md` |
| Cases `/cases` | [`LOOP-Cases.md`](./LOOP-Cases.md) | `/loop exhaustive Cases content using PROMPTS/LOOP-Cases.md` |
| Coach `/coach` | [`LOOP-Coach.md`](./LOOP-Coach.md) | `/loop exhaustive Coach content using PROMPTS/LOOP-Coach.md` |
| Reference `/archive` | [`LOOP-Archive.md`](./LOOP-Archive.md) | `/loop exhaustive Archive content using PROMPTS/LOOP-Archive.md` |
| Practice `/practice-*` | [`LOOP-Practice.md`](./LOOP-Practice.md) | `/loop exhaustive Practice content using PROMPTS/LOOP-Practice.md` |

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

## Not these files

Milestone delivery (P0 → E11) stays in:

- [`AGENTS_LOOP-Continue-Milestone.md`](../AGENTS_LOOP-Continue-Milestone.md)
- [`AGENTS_LOOP-Market-Types.md`](../AGENTS_LOOP-Market-Types.md)
- [`AGENTS_LOOP-Market-Learning-Coverage.md`](../AGENTS_LOOP-Market-Learning-Coverage.md)
- [`AGENTS_LOOP-Step-Coaching.md`](../AGENTS_LOOP-Step-Coaching.md)
- [`AGENTS_LOOP_QA_User_Flows.md`](../AGENTS_LOOP_QA_User_Flows.md)

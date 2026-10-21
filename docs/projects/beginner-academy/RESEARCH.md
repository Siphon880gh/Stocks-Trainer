# Research — how a large retail broker (Webull) trains beginners

Charter: [`CHARTER.md`](./CHARTER.md) · Epics: [`EPICS.md`](./EPICS.md)

Researched 2026-10-21 (America/Los_Angeles). Purpose: extract **design patterns** only. Nothing below is copied into the app; the app's text, structure names, colours and quiz items are written fresh (CHARTER §4).

**Legend:** ✅ verified on a page I opened · 🔎 search-result snippet only (page not opened or didn't render) · 💭 inference / not confirmed.

## Sources

| # | URL | How | What it showed |
|---|-----|-----|----------------|
| S1 | https://www.webull.com/learn | opened | Learn hub: course tiles (options, taxes, API walkthrough); videos with durations |
| S2 | https://www.webull.com/learn/course/XI2xVj/Technical-Analysis-for-Beginners | opened | Course page = intro blurb + **numbered lesson list** ("What is Technical Analysis?", "Basic Chart Types…"); search snippet showed lesson length as a character count + view count |
| S3 | https://www.webull.com/learn/course/4ExG3M/Introduction-to-Options | opened | Numbered lesson list; text lessons sized in characters (e.g. ~6k characters) with view counts |
| S4 | https://www.webull.com/learn/course/Z5F6Cl/Basic-Building-Blocks | 🔎 | Video series for beginners in technical analysis (trends, S/R, volume), lessons ~8–10 min |
| S5 | https://www.webull.com/learn/course/rfxJCq/YIS-Unit-1-The-Seven-Golden-Rules-of-Investing | 🔎 | Content organised as **Units → Lessons** (e.g. "Unit 1: Lesson 1 – Who Are Investors") |
| S6 | https://www.webull.com/actv2/learning/progress-prize/index.html | opened | "A Prize for Your Progress": in the mobile app, **Feeds → Learn → select a training plan to earn knowledge points** |
| S7 | https://www.webull.com/feature/community | opened | Community = Discover / Interact / Learn; "gain **knowledge points** by progressing and completing lessons that help you reach your objectives" |
| S8 | https://www.webullapp.com/training/quizzes/detail/65b79301e93c4922b5043332d997b7b6 | opened | "Test Yourself in A Quiz, Join Webull Learn" (search title); page now returns "content is nowhere to find" — quiz pages exist but are app-gated / expired |
| S9 | https://www.webull.com/help/faq/11069 | opened | Paper trading FAQ: stocks, ETFs, options, crypto, futures, events; new vs legacy system; **order types market, limit, stop, stop limit, trailing stop, conditional, algo, OCO/OTO/OTOCO**; market orders fill only in regular hours; stop / stop-limit fill only when condition met; no fill without volume; **paper buttons are orange** to distinguish from live; **reset account** (legacy: enter a new amount); export order records; Account P&L vs Symbol P&L; legacy data cleared after 180 days inactivity |
| S10 | https://www.webull.eu/paper-trading | opened | PaperTrade marketing: zero risk, zero commissions, "unlimited virtual cash", real-time data, indicators/charting tools |
| S11 | https://www.youtube.com/watch?v=qeCn83ilYnE | 🔎 (transcript snippet) | Creator tutorial: default **$1,000,000** paper balance, editable (creator used $500 because $1M is unrealistic); buying power shown next to the paper-trade button; separate futures paper portfolio |
| S12 | https://www.webull.ca/offers-promotions/paper-trading | opened | Canada "Bull Run Challenge" paper competition: $100K virtual (USD + CAD), 5 weeks, **leaderboard**, weekly + overall prizes |
| S13 | https://finance.yahoo.com/markets/options/articles/webull-canada-launches-paper-trading-130000637.html | 🔎 | Competition limited to stocks/ETFs; **no options, margin or short selling** |
| S14 | https://www.webull.com/help/faq/10980 | opened | **Options levels 1–4**: L1 covered calls, buy-writes, cash-secured puts; L2 + long calls/puts, collars, protective puts…; L3 (margin) spreads, butterflies, condors; L4 naked calls/puts (min $10k); spreads need L3 + $2,000 margin equity; expiry obligations / auto-exercise |
| S15 | https://www.webull.com/help/faq/10979-My-Options-Application | 🔎 | Options application asks about finances, experience, employment; decided in 1–2 business days; documents may be requested; reapply wait up to 7 days |
| S16 | https://www.webull.com.au/help/faq/1331-How-do-I-enable-Options-trading | opened | (Australia) enabling options requires **assessments per strategy level**; each has multiple questions; **up to 3 attempts per 24 hours** |
| S17 | https://www.stockbrokers.com/review/webull | opened (review dated 2026-10-20) | Independent review: education "quantity over quality", **no clear learning path**, Learn feels disconnected from the platform; has **progress tracking** and **interactive quizzes**; webinars hard to find; best-in-class **paper trading**; **Replay Mode** (bar-by-bar chart replay); social **Feeds** / "Most Popular" sentiment; AI news summaries; financials shown as YoY trend charts |
| S18 | https://broker-insight.com/broker-reviews/webull | 🔎 (page didn't render when opened) | Learn tab: Popular Lessons, Webinars, **Quizzes**, **My Learn** progress; filter chips Stocks / Options / Retirement / Portfolio / ETFs / Crypto / Futures / Fixed Income; short quiz after a lesson, scores tracked in My Learn |
| S19 | https://www.reddit.com/r/beermoneyuk/comments/17guyqk/ | 🔎 (Oct 2023, UK) | Past promotion tied free fractional shares to depositing + **finishing an educational course** and claiming in "My Rewards" — promotions vary by region/time |

## Findings

### Verified (✅)
1. **Course → numbered lessons** structure with text lessons sized by length and video lessons with durations (S2, S3; S4/S5 add Units → Lessons 🔎).
2. **Knowledge points** for progressing through lessons inside a **training plan**; reachable from the Feeds → Learn area (S6, S7).
3. **Quizzes exist** as a Learn surface (S8 title; S17 confirms "Interactive Learning – Quizzes" and "Progress Tracking").
4. **Paper trading**: simulated account, resettable starting cash, broad asset coverage, real order-type set incl. trailing stop and OCO/OTO/OTOCO, account vs symbol P&L, order-history export, visual distinction (colour) between paper and live, fill rules tied to market hours and conditions (S9, S10).
5. **Paper competitions** with a fixed virtual balance, a fixed window and a leaderboard; restricted products (S12, S13 🔎).
6. **Options levels 1–4** with a strategy list per level; higher levels need more account requirements (S14); some regions gate with **knowledge assessments, max 3 attempts / 24 h** (S16).
7. **Replay mode** for bar-by-bar practice and a social **Feeds** community (S17).
8. Reviewer criticism: **no clear beginner learning path**, education disconnected from the trading platform (S17).

### Not confirmed / inference (💭)
- **Levels (Beginner / Intermediate / Advanced) on courses:** not confirmed; S17 says the opposite (no clear path). 💭 Category filter chips (S18 🔎) are the closest thing.
- **Streaks and badges:** no evidence found for the broker. 💭 We add them because they are standard learning-app mechanics, not because the broker has them.
- **Placement / onboarding quiz for education:** not found. Account opening and the options application ask about experience and finances (S15 🔎), which is suitability, not teaching. 💭 Our placement check is an original addition.
- **Points → real rewards conversion:** only in regional / time-limited promotions (S19 🔎, 2023). 💭 Our points are virtual only, by charter.
- **Quiz length / pass marks:** not visible without the app. 💭 We choose 3–5 items per unit and 80% mastery.

## Patterns to adopt (original implementation)

| Pattern | How the app adopts it (no copying) |
|---------|------------------------------------|
| Course → units → short lessons | Levels → courses → units → 3–6 lesson cards (≤ 5 min), each unit linking into existing app content |
| Quiz after lesson + progress page | 3–5 item unit quiz, 80% mastery, "My progress" panel |
| Knowledge points in a training plan | Virtual points ledger + levels + badges + daily streak; idempotent; never redeemable |
| Paper account with reset + order types | Pure engine on SAMPLE tapes; presets $1k–$1M (default $10k); market / limit / stop / stop-limit / trailing stop; Day / GTC |
| Paper vs live visual distinction | Our own "SIMULATED" banner + accent on every paper control |
| Competitions + leaderboard | Offline challenges with rules, scored on discipline + return, vs fictional benchmark entries |
| Replay mode | Bar-by-bar stepping inside the paper account (extends the existing Bar replay lab) |
| Options levels + assessments + 3 attempts / 24 h | Options knowledge ladder L1–L4, knowledge checks, risk acknowledgement, 3 attempts per rolling 24 h, payoff-at-expiry math |
| Feeds / community | **Not adopted** (no UGC). A "Today" card gives the daily-habit hook instead |
| Fix the reviewers' complaint | One structured map from zero → options, with placement routing and "next unit" always visible |

## Mapping: broker pattern → existing app feature → gap → epic

| Broker pattern | Existing app feature (file) | Gap | Epic |
|----------------|-----------------------------|-----|------|
| Course library w/ numbered lessons | Learn quiz groups (`quizData.ts` `QUIZ_GROUPS`, ~50 groups), Archive glossary (`literacyTerms.ts`), Coach (63 sessions), Beginner Equities / Decision Maker / Market Explorer paths (`learningPaths.ts`, 4–5 milestones each) | No lesson *cards* (teaching before testing); paths are coarse (5 milestones) and only cover part of the app; no map of all content by level | BA1, BA2 |
| Unit quiz + "My Learn" progress | `QuizModal` + `completeMilestoneFromQuiz` (`progressStore.ts`), PathMapPanel | No per-unit mastery, no course progress %, no resume-next-unit | BA2, BA10 |
| Placement / experience routing | `GoalPicker.tsx` (picks one of 3 paths) | No knowledge check, no start-level routing, no test-out | BA3 |
| Paper trading account | Bar replay lab (`practice/Replay.tsx`, `REPLAY_TAPES`), Mark the plan (`practice/Plan.tsx`), Buy or Sell drill reveals (entry / stop / target) | No account, cash, buying power, orders, fills, positions, P&L; only `market-order-vs-limit` glossary term exists; no stop-limit / trailing-stop mechanics | BA4, BA5 |
| Order types (incl. trailing stop) | Glossary `market-order-vs-limit`; sibling worker is adding trade-management lessons (trailing stop concepts) | No executable order semantics or fill tests | BA4 (links to sibling content) |
| Replay mode | `practice/Replay.tsx` (grades buy/sell/hold on a tape) | No orders during replay | BA5 |
| Paper competitions / leaderboard | Cases grading, Macro reaction game, Read the Print scoring | No rule-based challenges, no leaderboard | BA6 |
| Knowledge points | `POINTS_PER_CORRECT = 50`, `STREAK_BONUS = 10`, `scores.totalPoints`, quiz `streaks` (answer streak, not daily) | No unified ledger across features, no badges, no levels, no daily streak | BA7 |
| Options levels / assessments | `options-literacy` quiz group, options-context glossary & coach sessions (context only) | No tiered strategy ladder, no gating, no payoff arithmetic | BA8 |
| Feeds / news / daily habit | Macro Desk, Home tips (`thinkingModeTips.ts`, macro `homeTip.ts`) | No daily rotating lesson / question / term | BA9 |
| Financial statements & earnings | Statements Lab, Read the Print, Mark the Band (financials project) | Covered — Academy links to them (Level 4) | BA1 refs |
| Macro & rates education | Macro Desk (18 lessons, reaction game) | Covered — Academy links (Level 5) | BA1 refs |
| Technical analysis course | Candles, patterns, indicators, Buy or Sell, Pattern hunt, S/R levels | Covered — Academy links (Level 2) | BA1 refs |
| Crypto / futures / forex | `*-literacy` groups, multi-asset cases, coach sessions | Covered — Academy links (Level 7) | BA1 refs |

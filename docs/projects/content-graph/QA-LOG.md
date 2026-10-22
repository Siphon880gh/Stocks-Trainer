# Interaction QA log

Append-only. Playwright flows on a temp dev server (port 3078), headless Chrome at 1280 and 390. Newest at the bottom. Times are America/Los_Angeles.

## 2026-10-22 interaction QA

| Flow | Result | Fix |
|---|---|---|
| Case decide → reveal (`/cases/case-news-chase-fade`, peek, BUY / HOLD, lock in) | Reveal, grade, locked buttons and stored `caseResults` correct; persists across reload; no console errors at 1280 / 390. Cases do not award points (by design: points come from Training quizzes). | — |
| Buy or Sell? drill (right and wrong answers, reveal, next) | Reveal explains the correct answer and why not the pick; header points / streak right (50 per correct, +10 streak bonus). **Bug:** points, streak and accuracy were never saved for Buy or Sell? (or any group without a path milestone, or any quiz closed early) — Training showed them, a reload reset to 0. | `recordQuizScore` saves after every answer; `progressStore.test.ts` |

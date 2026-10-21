# Charter — Financials, Expectations & Earnings Reactions

Project folder: `docs/projects/financials-earnings/` · Epics: [`EPICS.md`](./EPICS.md) · Stories: [`STORIES.md`](./STORIES.md) · Progress log: [`PROGRESS.md`](./PROGRESS.md) · Loop: [`LOOP-Financials-Earnings.md`](./LOOP-Financials-Earnings.md) (indexed in [`LOOPS/README.md`](../../../LOOPS/README.md))

| Field | Value |
|-------|-------|
| **Status** | Chartered (planning). No milestone started. |
| **Epic ids** | `FE0`–`FE8` (own namespace; does not reopen E0–E11, which are Done(global) in `EPIC_MAP.md`) |
| **Owner / reviewer** | Weng |
| **Commit policy** | `COMMIT_MODE: none` (see the loop). Changes stay uncommitted; Weng commits. Never push, never open a PR. |

---

## 1. Why

Weng's ask: *"Is there a game or section on reading a company's financials/projections, or expecting it to come out, and the aftermath response in the stock graph?"* The reference image (a 13-week cash flow forecast where week 9 Cash In drops $50k → $30k and Net Cash Flow flips $10k → −$5k, "See it before you commit") is the right *idea* but too simplified.

Today the app has the pieces in isolation (2 tiny statement snapshots with 3 numbers per statement, 13 earnings cases with a 6-bar pre / 3-bar post chart, an earnings-desk phrase quiz, 4 earnings coach sessions), but **no** place where a learner reads a real-looking statement set or forecast, forms an expectation for an upcoming report, and then sees and explains the reaction on the chart. See the audit in [`EPICS.md` → Audit](./EPICS.md#audit-what-exists-today).

## 2. Goal

A learner can:

1. **Read** a realistic quarterly statement set (income statement, balance sheet, cash flow statement) and a 13-week cash flow forecast, and pull out what matters: revenue growth, margins, EPS, FCF, working capital, net debt, burn / runway, covenant headroom.
2. **Anticipate** an upcoming report: consensus vs whisper, prior guidance, the KPI the market is watching, the options-implied move, the pre-earnings run-up or drift, and positioning ("priced in").
3. **Explain the aftermath** on the chart: gap up / down, gap-and-go vs gap fill, sell-the-news, guidance mattering more than the headline beat, the volume spike, and multi-day post-earnings drift. This connects to the candlestick / price-action content already in the app (gaps, marubozu, engulfing, breakout-retest, supply/demand).
4. **Play** "Read the Print": read the statements and the preview, predict the reaction, then see the post-event candle chart with annotations and an explanation.

## 3. Audience

- The primary audience is learners who have finished the Beginner Equities path (they know a candle and a P/E) and want to read **real** filings and earnings decks, not cartoon tables.
- The secondary audience is beginners. The simplified 13-week table (Weng's image) is kept as the **level-1 intro** inside FE2, then grows to the full layout.

## 4. Scope

**In scope**
- Fictional but realistic companies (3–4 archetypes) with 8 quarters of tied-out statements, guidance, and consensus.
- Statement reader components: IS / BS / CF tables, derived metrics, callouts.
- 13-week cash flow forecast reader with these rows:
  - collections and other receipts;
  - payroll, payables / inventory, rent / opex, marketing, taxes;
  - debt service (interest + principal) and capex;
  - net cash flow, beginning / ending cash, revolver draw / repay, and a minimum-cash covenant line.
- Earnings preview card: consensus, whisper, guidance range, KPI watch, implied move, run-up.
- Event reaction charts with optional volume, built in the existing `scenarioCharts.ts` / `CandlestickChart` annotation style. They cover these archetypes: gap-and-go, gap-fill, sell-the-news, guidance-led reversal, post-earnings drift, and muted.
- "Read the Print" game (predict → reveal), Learn quiz groups, glossary terms, Training card, docs, and validators.

**Out of scope (non-goals)**
- Live or real filings, real tickers presented as real data, paid APIs, EDGAR scraping. (`marketDataProvider.ts` is the SAMPLE/DELAYED adapter for prices only and does not serve fundamentals; do not extend it to live fundamentals.)
- Options chains or a Greeks engine. The implied move is a single, given educational number, consistent with the app's "options = context only" rule.
- A DCF / valuation modelling tool, and spreadsheet-style editing of statements. What-if toggles on the 13-week forecast are allowed.
- Changes to Beginner Equities unlocks, progress schema keys already in use, or existing case grading.
- Trading advice. Every surface carries the existing educational / SAMPLE framing.

## 5. Educational stance (non-negotiable)

- Use the label `SAMPLE / STYLIZED — fictional company, not a live filing, not trading advice.` (match the existing `BUY_SELL_DISCLAIMER` tone).
- Teach **process**: "what was expected → what printed → what changed in the outlook → how price and volume responded → what would have invalidated the read". Never just "price went up".
- Show that reactions are probabilistic. Include cases where a beat sells off, a miss rallies, and the reaction stays inside the implied move.
- Base claims about market behaviour (PEAD, sell-the-news, guidance > headline) on mainstream teaching, and word them as tendencies ("often", "tends to"), never certainties.

## 6. Data approach

- **Synthetic, deterministic, fictional.** Companies are invented, for example:
  - *Northwind Cloud* (subscription SaaS, burning cash);
  - *Harbor & Pine* (retailer with inventory and seasonality);
  - *Ironbridge Industrial* (capex-heavy, levered, covenant).

  Tickers use the repo's SAMPLE suffix convention (e.g. `NWCL.S`). Numbers are seeded and generated once, not random per load.
- **Everything ties out**, checked by tests:
  - Income statement: gross profit = revenue − COGS; operating income = GP − opex; net income = pre-tax − tax; EPS = NI / diluted shares.
  - Balance sheet: assets = liabilities + equity.
  - Cash flow statement: CFO + CFI + CFF = Δcash, ending cash = BS cash, and NI is the first line of CFO.
  - 13-week forecast: net = receipts − disbursements; ending = beginning + net + revolver draw − repay; next beginning = this ending.
- **Reaction charts are generated from the labelled outcome** (seeded generator plus pinned event bars, like `scenarioCharts.ts`). Validators prove the chart matches its label: gap size vs implied move, fill / no fill, drift direction, volume spike on the event bar.
- Existing `FinancialSnapshot` / `CaseStudy` stay as they are. New data lives under `src/lib/financials/`. A derived "snapshot" adapter may feed old surfaces, but old data is not rewritten.

## 7. Success criteria (project Done)

1. Every milestone in `EPICS.md` is checked, with its automated verification recorded in `PROGRESS.md`.
2. `npm run lint`, `npm run test:coaching`, `npx tsx --test src/lib/*.test.ts`, `npm run test:financials`, and the temp-folder production build all exit 0.
3. Content floors, all validator-checked:
   - ≥ 3 fictional companies × 8 quarters of tied statements;
   - ≥ 4 thirteen-week forecasts, including the level-1 replica of Weng's example;
   - ≥ 12 earnings events with preview + actuals + reaction chart, covering all 6 reaction archetypes;
   - ≥ 12 Read-the-Print rounds with a balanced answer key;
   - ≥ 40 new Learn questions across the new groups;
   - ≥ 20 new glossary terms.
4. Human checkpoints in `EPICS.md` (visual review of the readers and the game) are signed off by Weng in `PROGRESS.md`.
5. No `dist/` changes, no push, no PR, and commits only per `COMMIT_MODE`.

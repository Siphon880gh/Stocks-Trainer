# Paper desk — data sources

The desk (`/paper/desk`) bundles two scenarios as static files under `src/lib/academy/paper/desk/`. All money is SIMULATED.

## Big tech, 2024 (HISTORICAL) — `history2024.ts`

Generated on 2026-11-11 by [`build_desk_data.py`](./build_desk_data.py) (statements step: [`extract_statements.py`](./extract_statements.py)). Do not edit the data by hand; rerun the scripts.

| Data | Source | Notes |
|---|---|---|
| Daily open / high / low / close / volume, AAPL, MSFT, AMZN, 2024-01-02 … 2024-12-31 (252 sessions) | Yahoo Finance chart API v8, e.g. `https://query1.finance.yahoo.com/v8/finance/chart/AAPL?period1=1704067200&period2=1735689600&interval=1d` | Rounded to cents. None of the three split in 2024, so the prices are the prices that traded. Dividends are not added back. |
| Statements (revenue, gross profit, operating income, net income, diluted EPS, operating cash flow, capex, cash, total assets, total liabilities, equity) | SEC EDGAR XBRL companyfacts: [Apple](https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json), [Microsoft](https://data.sec.gov/api/xbrl/companyfacts/CIK0000789019.json), [Amazon](https://data.sec.gov/api/xbrl/companyfacts/CIK0001018724.json) | One row per 10-Q / 10-K filed 2023-09 … 2024-12, values taken from that filing's own accession. Income lines are the quarter (10-Q) or the fiscal year (10-K); cash-flow lines are year-to-date as filed. Amazon does not tag total liabilities, so it is total assets − stockholders' equity (flagged `liabilitiesDerived`). Amazon does not report gross profit. Each row links its filing. |
| Filing dates (what unlocks when) | SEC EDGAR submissions: [Apple](https://data.sec.gov/submissions/CIK0000320193.json), [Microsoft](https://data.sec.gov/submissions/CIK0000789019.json), [Amazon](https://data.sec.gov/submissions/CIK0001018724.json) | An item filed on date d unlocks on the first session dated ≥ d. Earnings releases are filed after the close, so the reaction is the next open. |
| Headlines | The Exhibit 99.1 press release (or the 8-K itself) of each 8-K, linked per item in the data | Headlines are the releases' own titles; one-line summaries restate the release's first lines or the 8-K item. |

8-K items used: Apple earnings (2023-11-02, 2024-02-01, 2024-05-02, 2024-08-01, 2024-10-31) and Item 7.01 (2024-05-03); Microsoft earnings (2023-10-24, 2024-01-30, 2024-04-25, 2024-07-30, 2024-10-30), Item 2.01 Activision Blizzard close (2023-10-13), Item 1.05 Midnight Blizzard (2024-01-19); Amazon earnings (2023-10-26, 2024-02-01, 2024-04-30, 2024-08-01, 2024-10-31) and Item 7.01 shareholder letter (2024-04-11).

## Earnings season (SIMULATED) — `simulatedDesk.ts`

Fictional `.S` companies from `tapes.ts` (seeded generator). Headlines and statements are invented to match the tapes' scripted gaps and are tagged SIMULATED wherever they appear.

## Competitor research behind the layout

See [`RESEARCH.md`](./RESEARCH.md) (every URL fetched 2026-11-11).

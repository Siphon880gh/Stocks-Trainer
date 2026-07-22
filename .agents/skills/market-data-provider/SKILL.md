---
name: market-data-provider
description: >-
  Pluggable MarketDataProvider (SAMPLE + DELAYED replay). Use for E8.M1 Market
  chart feeds; never invent LIVE/REAL_TIME theater or paid API keys.
---

# Market data provider

## Source
`src/lib/marketDataProvider.ts`

## API
- `MarketDataProvider` — `id`, `mode` (`sample`|`delayed`), `label`, `getOhlc`, `listMarketIds`
- `sampleMarketDataProvider` / `delayedMarketDataProvider`
- `getMarketDataProvider(id?)` / `getStoredProviderId` / `setStoredProviderId`
- Storage: `analysis_core_market_data_provider_v1`

## UI
`src/pages/Market.tsx` loads OHLC via provider; badge + header show SAMPLE or DELAYED; provider select swaps without chart rewrite.

## Rules
- Default SAMPLE. DELAYED = held-back SAMPLE bars, not a live feed.
- Never label LIVE / REAL_TIME.
- After changes: `npm run lint` && `npm run build`.

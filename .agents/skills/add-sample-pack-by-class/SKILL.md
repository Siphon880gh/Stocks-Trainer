---
name: add-sample-pack-by-class
description: >-
  Add a distinct SAMPLE SamplePack for equity/future/option_context/crypto/forex
  and expose it on Market. Use for E1/E9 multi-asset pack work.
---

# Add SAMPLE pack by asset class

## Steps
1. Add a unique OHLC series in `src/lib/samplePacks.ts` (or crypto series in `markets.ts` legacy crypto block) — not a scaled clone.
2. Append `SamplePack` with correct `assetClass`, SAMPLE/STYLIZED `educationalNotes`.
3. Ensure Market adapter includes the class: equity/future/option_context/forex via class→markets map in `markets.ts`; crypto via `CRYPTO_MARKETS` / `LEGACY_CRYPTO_PACKS`.
4. Market filter labels live in `Market.tsx` `CLASS_LABELS` + `ASSET_CLASSES` in `samplePacks.ts`.
5. For `option_context`: deny LIVE chain / Greeks in notes + optional Archive literacy link.
6. Run `npm run lint` && `npm run build`.

## Failure notes
- Identical charts → rewrite OHLC shape (grind vs dump vs chop/breakout).
- Class filter empty → pack not in `SAMPLE_PACKS_BY_CLASS` and/or not in `MARKETS`.
---
